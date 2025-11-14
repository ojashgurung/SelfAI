from fastapi import Depends, Request
from fastapi.security.http import HTTPAuthorizationCredentials
from sqlmodel.ext.asyncio.session import AsyncSession

from ..database.db import get_session
from ..database.models import Users

from .service import (
    AuthService
)

from .utils import decode_token
from ..errors import InvalidToken, AccessTokenRequired, RefreshTokenRequired


auth_service = AuthService()

class TokenBearer:
    def __init__(self, auto_error: bool=True):
        self.auto_error = auto_error

    async def __call__(self, request: Request) -> dict:
        token = request.cookies.get("access_token")

        if not token:
            if not self.auto_error:
                return None
            raise InvalidToken("No credentials provided")


        try:
            token_data = decode_token(token)
            if not token_data:
                if not self.auto_error:
                    return None
                raise InvalidToken("Invalid token data")
            
            self.verify_token_data(token_data)
            return token_data

        except Exception as e:
            if not self.auto_error:
                return None
            raise InvalidToken(f"Token decoding failed: {str(e)}")


    def token_valid(self, token: str) -> bool:
        token_data = decode_token(token)

        return token_data is not None

    def verify_token_data(self, token_data):
        raise NotImplementedError("Please Override this method in child classes")
    

class AccessTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> None:
        if token_data and token_data["refresh"]:
            raise AccessTokenRequired()


class RefreshTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> None:
        if token_data and not token_data["refresh"]:
            raise RefreshTokenRequired()
        
async def get_current_user(
    token_details: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    user_email = token_details["user"]["email"]

    user = await auth_service.get_user_by_email(user_email, session)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
        
    return user
