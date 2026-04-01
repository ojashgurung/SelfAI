from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from core.auth.dependencies import get_current_user
from core.database.db import AsyncSessionLocal

from graph.integrations.github.oauth import oauth
from graph.integrations.github.client import GitHubClient
from graph.services.connections_service import ConnectionsService
from graph.services.sources_service import SourcesService

from core.config import Config

router = APIRouter(prefix="/integrations/github", tags=["integrations-github"])

@router.get("/login")
async def github_login(request: Request):
    redirect_uri = f"{Config.BACKEND_URL}/api/v1/graph/integrations/github/callback"
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get("/callback", name="github_callback")
async def github_callback(request: Request, current_user=Depends(get_current_user)):
    # 1) Exchange code -> token (authlib does it)
    token = await oauth.github.authorize_access_token(request)
    access_token = token.get("access_token")

    # 2) Identify GitHub username
    gh = GitHubClient(token=access_token)
    viewer = await gh.get_viewer()
    username = viewer.get("login")

    # 3) Store tokens in connections + create/update source
    async with AsyncSessionLocal() as session:
        conn = await ConnectionsService.upsert_connection(
            session=session,
            user_id=current_user.id,
            platform="github",
            account_id=username,
            token=token,
        )
        src = await SourcesService.upsert_source(
            session=session,
            user_id=current_user.id,
            platform="github",
            account_id=username,
            display_name=f"{username}'s GitHub",
            connection_id=conn.id,
        )
        await session.commit()

    return RedirectResponse(
        url=f"{Config.FRONTEND_URL}/context?connected=github&source_id={str(src.id)}"
    )