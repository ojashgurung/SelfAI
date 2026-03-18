
from fastapi import APIRouter, Depends, HTTPException, Query
from core.auth.dependencies import get_current_user
from graph.controllers.sources_controller import SourcesController

router = APIRouter(prefix="/sources", tags=["graph-sources"])

@router.get("/")
async def get_all_sources(current_user=Depends(get_current_user)):
    return await SourcesController.get_all_sources(current_user.id)


@router.post("/{source_id}/reset")
async def reset_source(source_id: str, current_user=Depends(get_current_user)):
    result = await SourcesController.reset_sources(user_id = current_user.id, source_id=source_id)
    if not result:
        raise HTTPException(status_code=404, detail="Source not found")
    
    return result
    
@router.post("/{source_id}/ingest")
async def ingest_source(source_id: str, top_n: int = Query(15, ge=1, le=100), sort_by: str = Query("updated"),current_user=Depends(get_current_user)):
    result = await SourcesController.ingest_source(user_id = current_user.id, source_id=source_id, top_n=top_n, sort_by=sort_by)
    if not result:
        raise HTTPException(status_code=404, detail="Source not found")
    
    return result

