import uuid
from core.database.db import AsyncSessionLocal

from graph.services.sources_service import SourcesService
from graph.services.purge_service import PurgeService
from graph.models.sources import Source

from core.vector_store.vector_db import delete_by_filter

class SourcesController:
    @staticmethod
    async def get_all_sources(user_id: uuid.UUID):
        async with AsyncSessionLocal() as session:
            return await SourcesService.get_all_sources(session, user_id)

    @staticmethod
    async def ingest_source(*, user_id, source_id, top_n: int = 15, sort_by: str = "updated"):
        async with AsyncSessionLocal() as session:
            return await SourcesService.ingest_source(
                session,
                user_id=user_id,
                source_id=source_id,
                top_n=top_n,
                sort_by=sort_by,
            )

    @staticmethod
    async def reset_sources(*, user_id, source_id):
        async with AsyncSessionLocal() as session:
            src = await PurgeService.reset_source(
                session,
                user_id=user_id,
                source_id=source_id,
                vector_delete_fn=delete_by_filter,
            )

            if not src:
                return None
        
            await session.commit()
            await session.refresh(src)

            return {
                "status" : "reset",
                "source_id" : str(source_id),
                "platform" : src.platform,
                "account_id" : src.account_id,
                "last_error" : src.last_error,
            }