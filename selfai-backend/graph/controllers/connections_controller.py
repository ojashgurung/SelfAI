import uuid
from core.database.db import AsyncSessionLocal
from graph.services.connections_service import ConnectionsService

class ConnectionsController:
    @staticmethod
    async def get_all_connections(user_id: uuid.UUID):
        async with AsyncSessionLocal() as session:
            return await ConnectionsService.get_all_connections(session, user_id)