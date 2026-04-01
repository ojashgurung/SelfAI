from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from core.auth.dependencies import get_current_user
from core.database.db import AsyncSessionLocal
from graph.models.documents import Document
from graph.controllers.documents_controller import DocumentsController
from core.vector_store.vector_db import delete_by_filter
from sqlmodel import select

router = APIRouter(prefix="/documents", tags=["graph-documents"])

@router.get("/")
async def get_all_documents(
    current_user=Depends(get_current_user),
    source_id: Optional[UUID] = None
):
    return await DocumentsController.get_all_documents(
        current_user.id,
        source_id=source_id
    )

@router.delete("/{document_id}")
async def delete_document(document_id: str, current_user=Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        doc = (await session.exec(
            select(Document).where(Document.id == document_id, Document.user_id == current_user.id)
        )).first()

        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")

        # delete vectors for this doc
        await delete_by_filter(
            namespace=str(current_user.id),
            filter={"document_id": str(doc.id)}
        )

        await session.delete(doc)
        await session.commit()

    return {"status": "deleted", "document_id": document_id}