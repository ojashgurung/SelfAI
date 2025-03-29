from fastapi import APIRouter,status, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
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
        user_id = current_user["user"]["id"]
        user = await session.get(Users, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        await session.refresh(user, ['documents'])
        
        return UserResponse(
            id=user_id,
            email=user.email,
            fullname=user.fullname,
            personal_bio=user.personal_bio,
            linkedin_url=user.linkedin_url,
            github_url=user.github_url,
            documents=[{
                "id": str(doc.id),
                "namespace": doc.namespace,
                "file_name": doc.file_name,
                "created_at": doc.created_at
            } for doc in user.documents]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
    )


@user_router.get("/{user_id}", status_code=status.HTTP_200_OK, response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
    session: AsyncSession = Depends(get_session),
):
    try:
        statement = select(Users).where(Users.uuid == user_id)
        result = await session.execute(statement)
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        await session.refresh(user, ['documents'])

        return UserResponse(
            id=user_id,
            email=user.email,
            fullname=user.fullname,
            personal_bio=user.personal_bio,
            linkedin_url=user.linkedin_url,
            github_url=user.github_url,
            documents=[{
                "id": str(doc.id),
                "namespace": doc.namespace,
                "file_name": doc.file_name,
                "created_at": doc.created_at
            } for doc in user.documents]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )