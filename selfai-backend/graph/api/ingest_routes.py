from fastapi import APIRouter, Depends
from core.auth.dependencies import get_current_user
from core.database.db import AsyncSessionLocal
from graph.services.ingest_service import IngestService

router = APIRouter(prefix="/ingest", tags=["graph-ingest"])

@router.get('/status')
async def get_ingest_status(current_user=Depends(get_current_user)):
    return {"status": "ingest OK"}

@router.post("/github/{source_id}")
async def ingest_github(source_id: str, current_user=Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        result = await IngestService.ingest_github_source(session, user_id=current_user.id, source_id=source_id)
        await session.commit()
        return result