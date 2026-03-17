from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from datetime import datetime, timezone
from graph.models.integration import UserIntegration


class IntegrationsService:

    @staticmethod
    async def save_tokens(session: AsyncSession, user_id: str, platform: str, external_id: str, token: dict):

        result = await session.exec(
            select(UserIntegration).where(
                UserIntegration.user_id == user_id,
                UserIntegration.platform == platform
            )
        )
        integration = result.first()

        expires_at = None
        if token.get("expires_at"):
            expires_at = datetime.fromtimestamp(token["expires_at"], tz=timezone.utc).replace(tzinfo=None)

        if integration:
            integration.access_token = token.get("access_token")
            integration.refresh_token = token.get("refresh_token", integration.refresh_token)
            integration.expires_at = expires_at
            integration.last_synced_at = datetime.now(timezone.utc).replace(tzinfo=None)
        else:
            integration = UserIntegration(
                user_id=user_id,
                platform=platform,
                external_id=external_id,
                access_token=token.get("access_token"),
                refresh_token=token.get("refresh_token"),
                expires_at=expires_at
            )
            session.add(integration)

        await session.commit()
        await session.refresh(integration)
        return integration
