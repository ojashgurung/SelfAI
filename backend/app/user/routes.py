from fastapi import APIRouter,status, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from ..database.models import Users
from ..database.db import get_session
from .schemas import UserResponse
from ..auth.dependencies import AccessTokenBearer

user_router = APIRouter()
access_token_bearer = AccessTokenBearer()

@user_router.get("/me", status_code=status.HTTP_200_OK,  response_model=UserResponse)
async def get_current_user_info(
    current_user: dict = Depends(access_token_bearer),
    session: AsyncSession = Depends(get_session),):
    try:
        user_id = current_user["user"]["user_id"]
        user = await session.get(Users, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return UserResponse(
            email=user.email,
            fullname=user.fullname
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
    )