from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, status, BackgroundTasks
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from sqlmodel.ext.asyncio.session import AsyncSession

from .schemas import (
    UserCreateModel,
    UserModel,
    UserLoginModel,
    EmailModel
)

from .utils import (
    verify_password,
    create_access_token,
    create_url_safe_token,
    decode_url_safe_token,
)

from .service import UserService
from ..errors import UserAlreadyExists, UserNotFound, InvalidCredentials
from ..config import Config
# from ..celery_tasks import send_email
from ..database.db import get_session


auth_router = APIRouter()
user_service = UserService()

REFRESH_TOKEN_EXPIRY = 2

# @auth_router.post("/send_mail")
# async def send_mail(emails: EmailModel):
#     emails = emails.addresses

#     html = "<h1>Welcome to the app</h1>"
#     subject = "Welcome to our app"

#     send_email.delay(emails, subject, html)

#     return {"message": "Email sent successfully"}

@auth_router.get("/test", status_code=status.HTTP_201_CREATED)
async def test(
    session: AsyncSession = Depends(get_session),
):
    return {
        "message": "Testing route",
    }


@auth_router.post("/signup", status_code=status.HTTP_201_CREATED)
async def create_user_Account(
    user_data: UserCreateModel,
    bg_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
):
    fullname = user_data.fullname
    email = user_data.email

    user_exists = await user_service.user_exists(email, session)

    if user_exists:
        raise UserAlreadyExists()

    new_user = await user_service.create_user(user_data, session)

    access_token = create_access_token(
        user_data={
            "email": new_user.email,
            "user_id": str(new_user.uuid),
            "role": new_user.role,
        }
    )

    refresh_token = create_access_token(
        user_data={"email": new_user.email, "user_id": str(new_user.uuid)},
        refresh=True,
        expiry=timedelta(days=REFRESH_TOKEN_EXPIRY),
    )

    return JSONResponse(
        content={
            "message": "Account Created! Check email to verify your account",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {"email": new_user.email, "user_id": str(new_user.uuid)},
        }
    )

@auth_router.get("/verify/{token}")
async def verify_user_account(token: str, session: AsyncSession = Depends(get_session)):

    token_data = decode_url_safe_token(token)

    user_email = token_data.get("email")

    if user_email:
        user = await user_service.get_user_by_email(user_email, session)

        if not user:
            raise UserNotFound()

        await user_service.update_user(user, {"is_verified": True}, session)

        return JSONResponse(
            content={"message": "Account verified successfully"},
            status_code=status.HTTP_200_OK,
        )

    return JSONResponse(
        content={"message": "Error occurred during verification"},
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


@auth_router.post("/signin")
async def login_users(
    login_data: UserLoginModel, session: AsyncSession = Depends(get_session)
):
    email = login_data.email
    password = login_data.password

    user = await user_service.get_user_by_email(email, session)

    if user is not None:
        password_valid = verify_password(password, user.password_hash)

        if password_valid:
            access_token = create_access_token(
                user_data={
                    "email": user.email,
                    "user_id": str(user.uuid),
                    "role": user.role,
                }
            )

            refresh_token = create_access_token(
                user_data={"email": user.email, "user_uid": str(user.uuid)},
                refresh=True,
                expiry=timedelta(days=REFRESH_TOKEN_EXPIRY),
            )

            return JSONResponse(
                content={
                    "message": "Login successful",
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user": {"email": user.email, "user_id": str(user.uuid)},
                }
            )

    raise InvalidCredentials()
