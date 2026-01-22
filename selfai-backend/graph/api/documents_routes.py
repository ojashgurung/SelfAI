from fastapi import APIRouter, Depends
from core.auth.dependencies import get_current_user
from graph.controllers.documents_controller import DocumentsController

router = APIRouter(prefix="/documents", tags=["graph-documents"])

@router.get("/")
async def get_all_documents(current_user=Depends(get_current_user)):
    return await DocumentsController.get_all_documents(current_user.id)