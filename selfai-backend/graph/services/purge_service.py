from sqlmodel import select, delete
from graph.models.connections import Connection
from graph.models.sources import Source
from graph.models.documents import Document

class PurgeService:
    @staticmethod
    async def purge_connection(session, *, user_id, connection_id, vector_delete_fn):
        # 1) load connection
        conn = (await session.exec(
            select(Connection).where(Connection.id == connection_id, Connection.user_id == user_id)
        )).first()
        if not conn:
            return None, 0

        # 2) load sources under connection
        sources = (await session.exec(
            select(Source).where(Source.connection_id == conn.id, Source.user_id == user_id)
        )).all()
        source_ids = [s.id for s in sources]

        # 3) delete vectors per source (best-effort)
        for s in sources:
            try:
                await vector_delete_fn(
                    namespace=str(user_id),
                    filter={"platform": s.platform, "source_id": str(s.id)}
                )
            except Exception as e:
                s.last_error = f"vector_delete_failed: {str(e)}"
                session.add(s)

        # 4) delete documents
        if source_ids:
            await session.exec(
                delete(Document).where(Document.user_id == user_id, Document.source_id.in_(source_ids))
            )

            # 5) delete sources
            await session.exec(
                delete(Source).where(Source.user_id == user_id, Source.id.in_(source_ids))
            )

        # 6) delete connection
        await session.delete(conn)

        return conn, len(source_ids)

    @staticmethod
    async def reset_source(session, *, user_id, source_id, vector_delete_fn) -> Source | None:
        """
        Reset a source:
        - delete vectors for this source (best effort)
        - delete documents for this source
        - keep source row but clear ingestion status fields
        """
        src = (await session.exec(
            select(Source).where(Source.id == source_id, Source.user_id == user_id)
        )).first()
        if not src:
            return None

        # delete vectors
        try:
            await vector_delete_fn(
                namespace=str(user_id),
                filter={
                    "platform": src.platform,
                    "source_id": str(src.id),
                },
            )
            src.last_error = None
        except Exception as e:
            # record but continue
            src.last_error = f"vector_delete_failed: {str(e)}"

        # delete docs
        await session.exec(
            delete(Document).where(Document.user_id == user_id, Document.source_id == src.id)
        )

        # keep src but reset bookkeeping
        src.last_ingested_at = None
        src.last_synced_at = None
        src.status = "connected"
        session.add(src)

        return src