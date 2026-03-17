from fastapi import APIRouter, Depends, HTTPException
from core.auth.dependencies import get_current_user
from graph.controllers.connections_controller import ConnectionsController

router = APIRouter(prefix="/connections", tags=["graph-connections"])

@router.get("/")
async def get_all_connections(current_user=Depends(get_current_user)):
    return await ConnectionsController.get_all_connections(current_user.id)


@router.post("/{connection_id}/disconnect")
async def disconnect_connection(connection_id: str, current_user=Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        conn = (await session.exec(
            select(Connection).where(Connection.id == connection_id, Connection.user_id == current_user.id)
        )).first()
        if not conn:
            raise HTTPException(status_code=404, detail="Connection not found")

        # revoke locally (optional: also call provider revoke endpoint later)
        conn.access_token = None
        conn.refresh_token = None
        conn.status = "disconnected"
        session.add(conn)

        # mark sources disconnected
        sources = (await session.exec(
            select(Source).where(Source.connection_id == conn.id, Source.user_id == current_user.id)
        )).all()
        for src in sources:
            src.status = "disconnected"
            session.add(src)

        await session.commit()

    return {"status": "disconnected", "connection_id": connection_id, "sources_updated": len(sources)}

@router.delete("/{connection_id}")
async def purge_connection(connection_id: str, current_user=Depends(get_current_user)):
    result = await ConnectionsController.purge_connection(
        user_id=current_user.id,
        connection_id=connection_id
    )
    if not result:
        raise HTTPException(status_code=404, detail="Connection not found")
    return result