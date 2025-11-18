from fastapi import APIRouter, Depends, Request
from core.auth.dependencies import get_current_user
from graph.controllers.integrations_controller import IntegrationsController
from core.config import Config

router = APIRouter(prefix="/integrations", tags=["integrations"])

@router.get("/google-drive/login")
async def google_drive_login(request: Request):
    return await IntegrationsController.google_drive_login(request)


@router.get("/google-drive/callback")
async def google_drive_callback(
    request: Request,
    current_user=Depends(get_current_user) 
):
    return await IntegrationsController.google_drive_callback(request, current_user)
