from fastapi import APIRouter, Depends

from core.database.models import User
from core.auth.dependencies import get_current_user
from graph.controllers.graph_controller import GraphController

router = APIRouter()

@router.get("/view")
async def view_graph(current_user: User = Depends(get_current_user)):
    return await GraphController.view_graph(current_user.id)