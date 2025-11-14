from fastapi import APIRouter, Depends
from core.auth.dependencies import get_current_user
from graph.controllers.ingest_controller import ingest_github_repo

graph_ingest_router = APIRouter(prefix="/ingest", tags=["graph-ingest"])

@graph_ingest_router.get("/github/{username}")
async def ingest_github(username: str, current_user=Depends(get_current_user)):
    return await ingest_github_repo(user_id=str(current_user.id), username=username)
