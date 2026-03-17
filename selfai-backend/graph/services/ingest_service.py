from fastapi import HTTPException
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

from graph.models.sources import Source
from graph.models.connections import Connection
from graph.ingestors.github_ingestor import GitHubIngestor
from graph.integrations.github.client import GitHubClient
from graph.pipeline.run import ingest_and_index_payload


class IngestService:
    @staticmethod
    async def ingest_github_source(session: AsyncSession, user_id: int, source_id: str):
        # 1. Validate Source
        src = (await session.exec(
            select(Source).where(Source.id == source_id, Source.user_id == user_id)
        )).first()
        if not src:
            raise HTTPException(status_code=404, detail="Source not found")
        if src.platform != "github":
            raise HTTPException(status_code=400, detail="Source is not github")

        # 2. Validate Connection
        conn = (await session.exec(
            select(Connection).where(Connection.id == src.connection_id, Connection.user_id == user_id)
        )).first()
        if not conn or not conn.access_token:
            raise HTTPException(status_code=401, detail="Missing github connection/token. Reconnect.")

        # 3. Ingest from GitHub
        ingestor = GitHubIngestor(client=GitHubClient(token=conn.access_token))
        payload = await ingestor.ingest(username=src.account_id)

        # 4. Index Payload
        stats = await ingest_and_index_payload(session, user_id=user_id, source=src, payload=payload)
        
        return {"status": "success", "source_id": str(src.id), **stats}