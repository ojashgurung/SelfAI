from fastapi import APIRouter, Depends
from core.auth.dependencies import get_current_user
from graph.controllers.documents_controller import DocumentsController

router = APIRouter(prefix="/documents", tags=["graph-documents"])

@router.get("/")
async def get_all_documents(current_user=Depends(get_current_user)):
    return await DocumentsController.get_all_documents(current_user.id)

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