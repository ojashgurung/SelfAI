from sqlmodel import select
from datetime import datetime, timezone
from graph.models.sources import Source

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