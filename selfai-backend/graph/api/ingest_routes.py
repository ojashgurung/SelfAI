from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from core.auth.dependencies import get_current_user
from core.database.db import AsyncSessionLocal

from graph.models.sources import Source
from graph.models.connections import Connection

from graph.ingestors.github_ingestor import GitHubIngestor
from graph.integrations.github.client import GitHubClient
from graph.pipeline.run import ingest_and_index_payload

router = APIRouter(prefix="/ingest", tags=["graph-ingest"])

@router.get('/status')
async def get_ingest_status(current_user=Depends(get_current_user)):
    return {"status": "ingest OK"}

@router.post("/github/{source_id}")
async def ingest_github(source_id: str, current_user=Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        src = (await session.exec(
            select(Source).where(Source.id == source_id, Source.user_id == current_user.id)
        )).first()
        if not src:
            raise HTTPException(status_code=404, detail="Source not found")
        if src.platform != "github":
            raise HTTPException(status_code=400, detail="Source is not github")

        conn = (await session.exec(
            select(Connection).where(Connection.id == src.connection_id, Connection.user_id == current_user.id)
        )).first()
        if not conn or not conn.access_token:
            raise HTTPException(status_code=401, detail="Missing github connection/token. Reconnect.")

        ingestor = GitHubIngestor(client=GitHubClient(token=conn.access_token))
        payload = await ingestor.ingest(username=src.account_id)

        stats = await ingest_and_index_payload(session, user_id=current_user.id, source=src, payload=payload)
        await session.commit()

        return {"status": "success", "source_id": str(src.id), **stats}