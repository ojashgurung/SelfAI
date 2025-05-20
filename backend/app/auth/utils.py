import logging
import uuid
from datetime import UTC, datetime, timedelta

from fastapi.responses import JSONResponse
from itsdangerous import URLSafeTimedSerializer

import jwt
from passlib.context import CryptContext

from ..config import Config

passwd_context = CryptContext(schemes=["bcrypt"])

ACCESS_TOKEN_EXPIRY = 30
REFRESH_TOKEN_EXPIRY = 7

def generate_passwd_hash(password: str) -> str:
    return passwd_context.hash(password)

def verify_password(password: str, hash: str) -> bool:
    return passwd_context.verify(password, hash)

def create_token(user_data: dict, expiry: timedelta = None, refresh: bool = False):
    payload = {}
    payload["user"] = user_data
    payload["exp"] = datetime.now(UTC) + (expiry or timedelta(minutes=ACCESS_TOKEN_EXPIRY))
    payload["jti"] = str(uuid.uuid4())
    payload["refresh"] = refresh

    token = jwt.encode(
        payload=payload, key=Config.JWT_SECRET, algorithm=Config.JWT_ALGORITHM
    )

    return token

def decode_token(token: str) -> dict:
    try:
        token_data = jwt.decode(
            jwt=token, key=Config.JWT_SECRET, algorithms=[Config.JWT_ALGORITHM]
        )
        return token_data

    except jwt.PyJWTError as e:
        logging.exception(e)
        return None


serializer = URLSafeTimedSerializer(
    secret_key=Config.JWT_SECRET, salt="email-configuration"
)

def create_url_safe_token(data: dict):

    token = serializer.dumps(data)

    return token

def decode_url_safe_token(token:str):
    try:
        token_data = serializer.loads(token)

        return token_data
    
    except Exception as e:
        logging.error(str(e))

def set_access_cookie(response: JSONResponse, new_access_token: str):
    response.set_cookie(
            key="access_token",
            value=new_access_token,
            httponly=True,
            secure=Config.ENVIRONMENT == "prod",
            samesite="lax",
            domain= ".selfai.tech" if Config.ENVIRONMENT == "prod" else None,
            path="/",
            max_age=ACCESS_TOKEN_EXPIRY * 60,
        )
    return response

def set_auth_cookies(response: JSONResponse, access_token: str, refresh_token: str):
    response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=Config.ENVIRONMENT == "prod",
            samesite="lax",
            domain= ".selfai.tech" if Config.ENVIRONMENT == "prod" else None,
            path="/",
            max_age=ACCESS_TOKEN_EXPIRY * 60,
        )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=Config.ENVIRONMENT == "prod",
        samesite="lax",
        domain=".selfai.tech" if Config.ENVIRONMENT == "prod" else None,
        path="/",
        max_age=REFRESH_TOKEN_EXPIRY * 86400,
    )

    return response

def remove_auth_cookies(response: JSONResponse):
    response.delete_cookie(
            key="access_token",
            domain= ".selfai.tech" if Config.ENVIRONMENT == "prod" else None,
            path="/",
        )
        
    response.delete_cookie(
        key="refresh_token",
        domain= ".selfai.tech" if Config.ENVIRONMENT == "prod" else None,
        path="/",
    )
    
    return response