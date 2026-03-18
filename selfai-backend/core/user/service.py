from uuid import UUID
from datetime import datetime

from sqlmodel import select
from typing import Optional
from fastapi import status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession

from .schemas import (
    UserResponse, 
    WidgetInfo, 
    DocumentInfo
)

from ..database.models import User
from graph.models.sources import Source

class UserService:
    async def get_user(self, user_id: UUID, db_session: AsyncSession) -> UserResponse:
        """Get user by id"""
        try:
            statement = select(User).where(User.id == user_id)
            result = await db_session.exec(statement)
            user = result.first()
            
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            await db_session.refresh(user, ['documents', 'widgets'])

            return UserResponse(
                user_id=user_id,
                fullname=user.fullname,
                email=user.email,
                personal_bio=user.personal_bio,
                linkedin_url=user.linkedin_url,
                github_url=user.github_url,
                profile_image = user.profile_image,
                widgets = [WidgetInfo(
                    id=str(widget.id),
                    title=widget.title,
                    created_at=widget.created_at,
                    updated_at=widget.updated_at,
                    expires_at=widget.expires_at,
                    is_active=widget.is_active,
                ) for widget in user.widgets],
                documents=[DocumentInfo(
                    id = str(doc.id),
                    namespace = doc.namespace,
                    file_name = doc.file_name,
                    created_at = doc.created_at
                ) for doc in user.documents]
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )
    
    async def get_user_last_login(self, user_id: UUID, db_session: AsyncSession) -> Optional[datetime]:
        """Get user last login date"""
        try:
            statement = select(User).where(User.id == user_id)
            result = await db_session.exec(statement)
            user = result.first()

            return user.last_login_at

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )
       
    async def has_ingested_data(self, user_id: UUID, db_session: AsyncSession) -> bool:
        result = await db_session.exec(
            select(Source).where(
                Source.user_id == user_id,
                Source.last_ingested_at != None
            )
        )
        return result.first() is not None