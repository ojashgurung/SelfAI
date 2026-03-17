from starlette.responses import RedirectResponse
from core.config import Config
from core.database.db import AsyncSessionLocal
from graph.integrations.google_drive.oauth import oauth as google_oauth
from graph.integrations.github.oauth import oauth as github_oauth
from .service import GoogleDriveService


class GoogleDriveController:
    @staticmethod
    async def google_drive_login(request):
        redirect_uri = f"{Config.BACKEND_URL}/api/v1/graph/integrations/google-drive/callback"
        return await google_oauth.google_drive.authorize_redirect(request, redirect_uri)

    @staticmethod
    async def google_drive_callback(request, current_user):
        try:
            token = await google_oauth.google_drive.authorize_access_token(request)
            google_user = token.get("userinfo", {})
            google_id = google_user.get("sub")

            if not google_id:
                return RedirectResponse(f"{Config.FRONTEND_URL}/graph?error=missing_google_id")

            # save tokens using DB session
            async with AsyncSessionLocal() as session:
                await GoogleDriveService.save_tokens(
                    session=session,
                    user_id=current_user.id,
                    platform="google_drive",
                    external_id=google_id,
                    token=token
                )

            return RedirectResponse(f"{Config.FRONTEND_URL}/graph?connected=google_drive")

        except Exception as e:
            print("Drive callback error:", e)
            return RedirectResponse(f"{Config.FRONTEND_URL}/graph?error=callback_failed")
