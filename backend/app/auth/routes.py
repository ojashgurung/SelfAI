from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, status, BackgroundTasks, Cookie
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
    decode_token,
    create_access_token,
    create_url_safe_token,
    decode_url_safe_token,
)

from .service import UserService
from ..errors import UserAlreadyExists, UserNotFound, InvalidCredentials
from ..config import Config
from ..database.db import get_session


auth_router = APIRouter()
user_service = UserService()

REFRESH_TOKEN_EXPIRY = 2

@auth_router.post("/signup", status_code=status.HTTP_201_CREATED)
async def create_user_Account(
    user_data: UserCreateModel,
    bg_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
):
    try:
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

        response = JSONResponse(
            content={
                "message": "Login successful",
                "user" : {
                        "user_id": str(user.uuid),
                        "fullname": user.fullname,
                        "email": user.email,
                        "role": user.role,
                    }
                }
            )

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=36000,
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=172800,
        )

        return response
    except UserAlreadyExists:
        raise
    except Exception as e:
        print(f"Signup error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during signup"
        )

@auth_router.post("/signin")
async def login_users(
    login_data: UserLoginModel, session: AsyncSession = Depends(get_session)
):
    try:
        email = login_data.email
        password = login_data.password

        user = await user_service.get_user_by_email(email, session)

        if not user:
            raise InvalidCredentials()

    
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

            response = JSONResponse(
                content={
                    "message": "Login successful",
                    "user" : {
                            "user_id": str(user.uuid),
                            "fullname": user.fullname,
                            "email": user.email,
                            "role": user.role,
                        }
                }
            )

            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,
                samesite="lax",
                max_age=36000,
            )

            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=False,
                samesite="lax",
                max_age=172800,
            )


            return response

    except InvalidCredentials:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login",
        )

@auth_router.get("/verify/{token}")
async def verify_user_account(token: str, session: AsyncSession = Depends(get_session)):
    try:
        payload = decode_url_safe_token(token)
        if not payload:
            return JSONResponse(
                content={"message": "Invalid verification token"},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        user_email = payload.get("email")

        if user_email:
            user = await user_service.get_user_by_email(user_email, session)

            if not user:
                raise UserNotFound()

            await user_service.update_user(user, {"is_verified": True}, session)

            return JSONResponse(
                content={"message": "Account verified successfully"},
                status_code=status.HTTP_200_OK,
            )
    except UserNotFound:
        raise
    except Exception as e:
        print(f"Verification error: {str(e)}")
        return JSONResponse(
            content={"message": "Error occurred during verification"},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@auth_router.get("/verify-token")
async def verify_access_token(session : AsyncSession = Depends(get_session), access_token: str = Cookie(key = "access_token", default=None)):
    try:
        if not access_token:
            print("No access_token cookie found")
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"message": "No token provided"}
            )       
        payload = decode_token(access_token)
        if not payload:
            return JSONResponse(
                status_code = status.HTTP_401_UNAUTHORIZED,
                content = {"message": "Invalid token"}
            )
        user_email = payload["user"].get("email")
        print(user_email)
        
        user = await user_service.get_user_by_email(user_email, session)

        if not user:
            return JSONResponse(
                status_code = status.HTTP_401_UNAUTHORIZED,
                content = {"message": "User not found"}
            )
        
        return JSONResponse(
            status_code = status.HTTP_200_OK,
            content = {"vaild": True,
                        "user" : {
                            "user_id": str(user.uuid),
                            "fullname": user.fullname,
                            "email": user.email,
                            "role": user.role,
                        }
                    }
            )

    except Exception as e:
        print(f"Token verification error: {str(e)}")
        return JSONResponse(
            status_code = status.HTTP_401_UNAUTHORIZED,
            content = {"message": "Invalid token"}
        )

@auth_router.post("/logout")
async def logout():
    try:
        response = JSONResponse(
            content={
                "message": "Logged out successfully"
            },
            status_code=status.HTTP_200_OK
        )
        
        response.delete_cookie(
            key="access_token",
            httponly=True,
            samesite="lax"
        )
        
        response.delete_cookie(
            key="refresh_token",
            httponly=True,
            samesite="lax"
        )
        
        return response
        
    except Exception as e:
        print(f"Logout error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during logout"
        )