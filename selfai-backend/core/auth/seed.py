import logging
from sqlmodel.ext.asyncio.session import AsyncSession

from ..config import Config
from .schemas import UserCreateModel
from .service import AuthService
from .utils import generate_passwd_hash

logger = logging.getLogger(__name__)


async def seed_dev_user(session: AsyncSession) -> None:
    """
    Creates a default dev user for quick login in development.

    Controlled via .env:
      ENVIRONMENT=dev
      SEED_DEV_USER=true
      DEV_USER_EMAIL=...
      DEV_USER_PASSWORD=...
      DEV_USER_FULLNAME=...
      DEV_USER_ROLE=...
    """
    # Debug logging
    print(f"Checking seed conditions: ENVIRONMENT={Config.ENVIRONMENT}, SEED_DEV_USER={Config.SEED_DEV_USER}")
    logger.info(f"Checking seed conditions: ENVIRONMENT={Config.ENVIRONMENT}, SEED_DEV_USER={Config.SEED_DEV_USER}")
    
    # Hard safety guard: never seed in production
    if Config.ENVIRONMENT == "prod":
        logger.info("Skipping seed: Environment is prod")
        return

    # Only run when enabled
    if not Config.SEED_DEV_USER:
        print("Skipping seed: SEED_DEV_USER is not enabled")
        logger.info("Skipping seed: SEED_DEV_USER is not enabled")
        return

    auth_service = AuthService()

    try:
        # Check if user exists
        print(f"Checking if dev user exists: {Config.DEV_USER_EMAIL}")
        existing_user = await auth_service.get_user_by_email(Config.DEV_USER_EMAIL, session)
        
        if existing_user:
            logger.info(f"Dev user exists, updating credentials: {Config.DEV_USER_EMAIL}")
            print(f"Dev user exists, updating credentials: {Config.DEV_USER_EMAIL}")
            # Update credentials to match .env
            update_data = {
                "fullname": Config.DEV_USER_FULLNAME,
                "role": Config.DEV_USER_ROLE,
                "password_hash": generate_passwd_hash(Config.DEV_USER_PASSWORD)
            }
            await auth_service.update_user(existing_user, update_data, session)
            msg = f"✅ Updated dev user: {Config.DEV_USER_EMAIL}"
            logger.info(msg)
            print(msg)
            return

        user_data = UserCreateModel(
            fullname=Config.DEV_USER_FULLNAME,
            email=Config.DEV_USER_EMAIL,
            password=Config.DEV_USER_PASSWORD,
            role=Config.DEV_USER_ROLE,
        )

        await auth_service.create_user(user_data, session)
        msg = f"✅ Seeded dev user: {Config.DEV_USER_EMAIL}"
        logger.info(msg)
        print(msg)

    except Exception as e:
        # Don't crash app startup for seeding issues; log loudly
        msg = f"❌ Failed to seed dev user: {str(e)}"
        logger.exception(msg)
        print(msg)
