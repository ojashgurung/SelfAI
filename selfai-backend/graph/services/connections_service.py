from sqlmodel import select
from datetime import datetime, timezone
from graph.models.connections import Connection

class ConnectionsService:
    @staticmethod
    async def get_all_connections(session, user_id):
        stmt = select(Connection).where(Connection.user_id == user_id)
        return (await session.exec(stmt)).all()

    @staticmethod
    async def upsert_connection(session, user_id, platform: str, account_id: str, token: dict):
        # Use naive UTC for asyncpg compatibility with TIMESTAMP WITHOUT TIME ZONE
        now = datetime.now(timezone.utc).replace(tzinfo=None)
        stmt = select(Connection).where(
            Connection.user_id == user_id,
            Connection.platform == platform,      # Fixed: platform -> platform
            Connection.external_id == account_id, # Fixed: account_id -> external_id
        )
        conn = (await session.exec(stmt)).first()
        if conn:
            conn.access_token = token.get("access_token")
            conn.refresh_token = token.get("refresh_token")
            conn.token_type = token.get("token_type")
            conn.expires_at = token.get("expires_at")  # may be None for GitHub
            conn.status = "connected"
            conn.updated_at = now
            session.add(conn)
            await session.flush()
            return conn

        conn = Connection(
            user_id=user_id,
            platform=platform,       # Fixed: platform -> platform
            external_id=account_id,  # Fixed: account_id -> external_id
            access_token=token.get("access_token"),
            refresh_token=token.get("refresh_token"),
            token_type=token.get("token_type"),
            expires_at=token.get("expires_at"),
            status="connected",
            created_at=now,
            updated_at=now,
            last_synced_at=now,
        )
        session.add(conn)
        await session.flush()
        return conn