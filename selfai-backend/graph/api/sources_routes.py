
from fastapi import APIRouter, Depends
from core.auth.dependencies import get_current_user
from graph.controllers.sources_controller import SourcesController

router = APIRouter(prefix="/sources", tags=["graph-sources"])

@router.get("/")
async def get_all_sources(current_user=Depends(get_current_user)):
    return await SourcesController.get_all_sources(current_user.id)