from fastapi import APIRouter, Depends
from core.auth.dependencies import get_current_user
from graph.controllers.connections_controller import ConnectionsController

router = APIRouter(prefix="/connections", tags=["graph-connections"])

@router.get("/")
async def get_all_connections(current_user=Depends(get_current_user)):
    return await ConnectionsController.get_all_connections(current_user.id)