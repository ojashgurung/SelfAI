from datetime import datetime, timedelta
from ..config import Config

from fastapi import APIRouter, Depends, status, BackgroundTasks, Cookie, Request
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse, RedirectResponse
from sqlmodel.ext.asyncio.session import AsyncSession

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config as StarletteConfig

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
                "id": str(new_user.uuid),
                "email": new_user.email,
                "role": new_user.role,
            }
        )

        refresh_token = create_access_token(
            user_data={"id": str(new_user.uuid), "email": new_user.email},
            refresh=True,
            expiry=timedelta(days=REFRESH_TOKEN_EXPIRY),
        )

        response = JSONResponse(
            content={
                "message": "Sign-up successful",
                "user" : {
                        "id": str(new_user.uuid),
                        "fullname": new_user.fullname,
                        "email": new_user.email,
                        "role": new_user.role,
                    }
                }
            )

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=Config.ENVIRONMENT == "prod",
            samesite="lax",
            domain= ".selfai.tech" if Config.ENVIRONMENT == "prod" else None,
            path="/",
            max_age=36000,
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=Config.ENVIRONMENT == "prod",
            samesite="lax",
            domain=".selfai.tech" if Config.ENVIRONMENT == "prod" else None,
            path="/",
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

        if not password_valid:
            raise InvalidCredentials()

        
        access_token = create_access_token(
            user_data={
                "id": str(user.uuid),
                "email": user.email,
                "role": user.role,
            }
        )

        refresh_token = create_access_token(
            user_data={"email": user.email, "id": str(user.uuid)},
            refresh=True,
            expiry=timedelta(days=REFRESH_TOKEN_EXPIRY),
        )

        response = JSONResponse(
            content={
                "message": "Login successful",
                "user" : {
                        "id": str(user.uuid),
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
            secure=Config.ENVIRONMENT == "prod",
            samesite="lax",
            domain= ".selfai.tech" if Config.ENVIRONMENT == "prod" else None,
            path="/",
            max_age=36000,
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=Config.ENVIRONMENT == "prod",
            samesite="lax",
            domain= ".selfai.tech" if Config.ENVIRONMENT == "prod" else None,
            path="/",
            max_age=172800,
        )


        return response

    except InvalidCredentials:
        raise
    except Exception as e:
        print(f"Login error: {str(e)}")
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
        if not user_email:
            return JSONResponse(
                content={"message": "Email not found in token"},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        
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
        
        user = await user_service.get_user_by_email(user_email, session)

        if not user:
            return JSONResponse(
                status_code = status.HTTP_401_UNAUTHORIZED,
                content = {"message": "User not found"}
            )
        
        return JSONResponse(
            status_code = status.HTTP_200_OK,
            content = {"valid": True,
                        "user" : {
                            "id": str(user.uuid),
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
            secure=Config.ENVIRONMENT == "prod",
            samesite="lax",
            domain= ".selfai.tech" if Config.ENVIRONMENT == "prod" else None,
            path="/",
        )
        
        response.delete_cookie(
            key="refresh_token",
            httponly=True,
            secure=Config.ENVIRONMENT == "prod",
            samesite="lax",
            domain= ".selfai.tech" if Config.ENVIRONMENT == "prod" else None,
            path="/",
        )
        
        return response
        
    except Exception as e:
        print(f"Logout error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during logout"
        )

@auth_router.post("/refresh-token")
async def refresh_token(refresh_token: str = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token provided")
    
    payload = decode_token(refresh_token)
    if not payload or not payload.get("refresh"):
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access_token = create_access_token(user_data=payload["user"])

    response = JSONResponse(content={"message": "Token refreshed"})
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        samesite="lax",
        secure=False,  # True in prod
        max_age=36000,
    )
    return response


oauth = OAuth()
oauth.register(
    name='google',
    client_id=Config.GOOGLE_CLIENT_ID,
    client_secret=Config.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

oauth.register(
    name='github',
    client_id=Config.GITHUB_CLIENT_ID,
    client_secret=Config.GITHUB_CLIENT_SECRET,
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)

oauth.register(
    name='linkedin',
    client_id=Config.LINKEDIN_CLIENT_ID,
    client_secret=Config.LINKEDIN_CLIENT_SECRET,
    access_token_url='https://www.linkedin.com/oauth/v2/accessToken',
    authorize_url='https://www.linkedin.com/oauth/v2/authorization',
    client_kwargs={'scope': 'r_liteprofile r_emailaddress'},
)

@auth_router.get('/login/{provider}')
async def oauth_login(provider: str, request: Request):
    if provider not in ['google', 'github', 'linkedin']:
        raise HTTPException(status_code=400, detail="Unsupported OAuth provider")
    redirect_uri = f"{Config.BACKEND_URL}/api/v1/auth/{provider}/callback"
    return await oauth.create_client(provider).authorize_redirect(
        request, 
        redirect_uri,
        prompt='select_account'
    )

@auth_router.get('/google/callback')
async def google_callback(request: Request, session: AsyncSession = Depends(get_session)):
    try:
        # Get authorization token
        try:
            token = await oauth.google.authorize_access_token(request)
        except Exception as token_error:
            print(f"Token error: {str(token_error)}")
            raise HTTPException(status_code=400, detail="Failed to obtain access token")

        try:
            resp = await oauth.google.get('https://www.googleapis.com/oauth2/v3/userinfo', token=token)
            user_info = resp.json()
        except Exception as parse_error:
            print(f"Parse error: {str(parse_error)}")
            raise HTTPException(status_code=400, detail="Failed to get user info")

        user = await user_service.get_or_create_google_user(user_info, session)
        
        response = await create_oauth_response(user)
        response.headers['Location'] = f"{Config.FRONTEND_URL}/dashboard"
        response.status_code = status.HTTP_302_FOUND
        return response

    except HTTPException as he:
        print(f"HTTP Exception: {str(he)}")
        return RedirectResponse(
            url=f"{Config.FRONTEND_URL}/auth/signin?error={str(he.detail)}",
            status_code=status.HTTP_302_FOUND
        )
    except Exception as e:
        print(f"Unexpected error in OAuth callback: {str(e)}")
        return RedirectResponse(
            url=f"{Config.FRONTEND_URL}/auth/signin?error=Authentication failed",
            status_code=status.HTTP_302_FOUND
        )

@auth_router.get('/github/callback')
async def github_callback(request: Request, session: AsyncSession = Depends(get_session)):
    try:
        token = await oauth.github.authorize_access_token(request)
        resp = await oauth.github.get('user', token=token)
        user_info = resp.json()
        emails_resp = await oauth.github.get('user/emails', token=token)
        emails = emails_resp.json()
        primary_email = next(email['email'] for email in emails if email['primary'])

        user = await user_service.get_user_by_email(primary_email, session)
        if not user:
            user = await user_service.create_user({
                'email': primary_email,
                'fullname': user_info['name'] or user_info['login'],
                'github_id': str(user_info['id']),
                'auth_provider': 'github',
                'password_hash': 'github_oauth'
            }, session)

        return await create_oauth_response(user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@auth_router.get('/linkedin/callback')
async def linkedin_callback(request: Request, session: AsyncSession = Depends(get_session)):
    try:
        token = await oauth.linkedin.authorize_access_token(request)
        resp = await oauth.linkedin.get('v2/me', token=token)
        profile = resp.json()
        email_resp = await oauth.linkedin.get('v2/emailAddress', token=token)
        email_info = email_resp.json()

        user = await user_service.get_user_by_email(email_info['emailAddress'], session)
        if not user:
            user = await user_service.create_user({
                'email': email_info['emailAddress'],
                'fullname': f"{profile['localizedFirstName']} {profile['localizedLastName']}",
                'linkedin_id': profile['id'],
                'auth_provider': 'linkedin',
                'password_hash': 'linkedin_oauth'
            }, session)

        return await create_oauth_response(user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def create_oauth_response(user):
    access_token = create_access_token(
        user_data={
            "id": str(user.uuid),
            "email": user.email,
            "role": user.role,
        }
    )

    refresh_token = create_access_token(
        user_data={"id": str(user.uuid), "email": user.email},
        refresh=True,
        expiry=timedelta(days=REFRESH_TOKEN_EXPIRY),
    )

    response = JSONResponse(
        content={
            "message": "OAuth login successful",
            "user": {
                "id": str(user.uuid),
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
        secure=Config.ENVIRONMENT == "prod",
        samesite="lax",
        domain=".selfai.tech" if Config.ENVIRONMENT == "prod" else None,
        path="/",
        max_age=36000,
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=Config.ENVIRONMENT == "prod",
        samesite="lax",
        domain=".selfai.tech" if Config.ENVIRONMENT == "prod" else None,
        path="/",
        max_age=172800,
    )

    return response