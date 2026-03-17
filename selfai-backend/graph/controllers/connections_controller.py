import uuid
from core.database.db import AsyncSessionLocal
from graph.services.connections_service import ConnectionsService
from graph.services.purge_service import PurgeService
from core.vector_store.vector_db import delete_by_filter

class ConnectionsController:
    @staticmethod
    async def get_all_connections(user_id: uuid.UUID):
        async with AsyncSessionLocal() as session:
            return await ConnectionsService.get_all_connections(session, user_id)

    @staticmethod
    async def purge_connection(*, user_id: uuid.UUID, connection_id):
        async with AsyncSessionLocal() as session:
            conn, sources_deleted = await PurgeService.purge_connection(
                session,
                user_id=user_id,
                connection_id=connection_id,
                vector_delete_fn=delete_by_filter,
            )
            if not conn:
                return None

            await session.commit()
            return {"status": "purged", "connection_id": str(connection_id), "sources_deleted": sources_deleted}