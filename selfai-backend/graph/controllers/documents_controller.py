import uuid
from core.database.db import AsyncSessionLocal
from graph.services.documents_service import DocumentsService

class DocumentsController:
    @staticmethod
    async def get_all_documents(user_id: uuid.UUID):
        async with AsyncSessionLocal() as session:
            return await DocumentsService.get_all_documents(session, user_id)