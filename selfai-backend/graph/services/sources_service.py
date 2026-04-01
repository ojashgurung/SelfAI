from sqlmodel import select
from datetime import datetime, timezone
from graph.models.sources import Source

from graph.ingestors.github_ingestor import GitHubIngestor
from graph.integrations.github.client import GitHubClient
from graph.models.connections import Connection
from graph.pipeline.run import ingest_and_index_payload

class SourcesService:
    @staticmethod
    async def get_all_sources(session, user_id):
        stmt = select(Source).where(Source.user_id == user_id)
        return (await session.exec(stmt)).all()

    @staticmethod
    async def upsert_source(session, user_id, platform: str, account_id: str, display_name: str, connection_id):
        # Use naive UTC for asyncpg compatibility with TIMESTAMP WITHOUT TIME ZONE
        now = datetime.now(timezone.utc).replace(tzinfo=None)
        stmt = select(Source).where(
            Source.user_id == user_id,
            Source.platform == platform,
            Source.account_id == account_id,
        )
        src = (await session.exec(stmt)).first()
        if src:
            src.connection_id = connection_id
            src.display_name = display_name
            src.status = "connected"
            src.last_synced_at = now
            src.updated_at = now
            session.add(src)
            await session.flush()
            return src

        src = Source(
            user_id=user_id,
            platform=platform,
            account_id=account_id,
            connection_id=connection_id,
            display_name=display_name,
            status="connected",
            last_synced_at=now,
            created_at=now,
            updated_at=now,
        )
        session.add(src)
        await session.flush()
        return src

    @staticmethod
    async def ingest_source(session, user_id, source_id, top_n, sort_by):
        result = await session.exec(select(Source).where(Source.id == source_id, Source.user_id == user_id ))
        src = result.first()

        if not src: 
            return None
        
        if src.platform != "github":
            return {"status" : "error ", "message" : "Only GitHub sources are supported for ingestion right now."}

        conn = None
        if src.connection_id:
            conn = (await session.exec(select(Connection).where(Connection.id == src.connection_id, Connection.user_id == user_id))).first()

        if not conn:
            return {"status" : "error", "error_code" : "missing_token", "message" : "Reconnect GitHub."}
        
        try:
            client = GitHubClient(token = conn.access_token)
            ingestor = GitHubIngestor(client)
            payload = await ingestor.ingest(
                username = src.account_id or "unknown",
                top_n = top_n,
                sort_by = sort_by,
                include_collab= False,
                include_forks= False
            )
        except Exception as e:
            src.last_error = f"github_ingest_failed: {str(e)}"
            session.add(src)
            await session.commit()
            return {"status": "error", "message": "GitHub ingest failed", "detail": str(e)}

        try:
            stats = await ingest_and_index_payload(
                session,
                user_id=user_id,
                source=src,
                payload=payload,
            )

            src.last_error = None
            session.add(src)
            await session.commit()

            return {
                "status": "ingested",
                "source_id": str(src.id),
                "platform": src.platform,
                "account_id": payload.account_id,
                "display_name": payload.display_name,
                "docs_seen": len(payload.documents),
                **stats,
            }

        except Exception as e:
            src.last_error = f"pipeline_failed: {str(e)}"
            session.add(src)
            await session.commit()
            return {"status": "error", "message": "Pipeline failed", "detail": str(e)}

    async def get_or_create_documents_source(session, user_id):
        # Check if documents source exists
        existing = (await session.exec(
            select(Source).where(
                Source.user_id == user_id,
                Source.platform == "documents"
            )
        )).first()
        
        if existing:
            return existing
        
        # Create it
        source = Source(
            user_id=user_id,
            platform="documents",
            display_name="Documents",
            status="connected",
            last_ingested_at= datetime.now(timezone.utc).replace(tzinfo=None)
        )
        session.add(source)
        await session.flush()
        return source