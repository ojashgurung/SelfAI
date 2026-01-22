import uuid
from core.database.db import AsyncSessionLocal
from graph.services.sources_service import SourcesService

class SourcesController:
    @staticmethod
    async def get_all_sources(user_id: uuid.UUID):
        async with AsyncSessionLocal() as session:
            return await SourcesService.get_all_sources(session, user_id)