from sqlmodel import select
from typing import Optional
from sqlmodel.ext.asyncio.session import AsyncSession

from ..database.models import Users
from .schemas import UserCreateModel
from .utils import generate_passwd_hash

class UserService:
    async def get_user_by_email(self, email: str, session : AsyncSession):
        statement = select(Users).where(Users.email == email)

        result = await session.exec(statement)

        user = result.first()
        return user
    
    async def user_exists(self, email: str, session: AsyncSession):
        user = await self.get_user_by_email(email, session)

        return True if user is not None else False
    
    async def create_user(self, user_data: UserCreateModel, session: AsyncSession):
        user_data_dict = user_data.model_dump()
        user_data_dict["password_hash"] = generate_passwd_hash(user_data_dict["password"])
        user_data_dict.pop("password", None)
        user_data_dict["role"] = "user"

        new_user = Users(**user_data_dict)

        session.add(new_user)

        await session.commit()

        return new_user

    async def update_user(self, user: Users, update_data: dict, session: AsyncSession):
        """Update user attributes"""
        for field, value in update_data.items():
            setattr(user, field, value)
        
        session.add(user)
        await session.commit()
        await session.refresh(user)
        
        return user
    
    async def get_user_by_google_id(self, google_id: str, session: AsyncSession) -> Optional[Users]:
        query = select(Users).where(Users.google_id == google_id)
        result = await session.exec(query)
        return result.first()
    

    async def get_or_create_google_user(self, user_info: dict, session: AsyncSession) -> Users:
        """Get existing user or create new one from Google OAuth data"""
        try:
            user = await self.get_user_by_google_id(user_info['sub'], session)
            if user:
                return user

            user = await self.get_user_by_email(user_info['email'], session)
            if user:
                return await self.update_user(user, {
                    "google_id": user_info['sub'],
                    "auth_provider": "google"
                }, session)

            user_data = UserCreateModel(
                email=user_info['email'],
                fullname=user_info.get('name', 'Google User'),
                password='google_oauth',
                google_id=user_info['sub'],
                auth_provider='google'
            )
            return await self.create_user(user_data, session)
        except Exception as e:
            print(f"Error in get_or_create_google_user: {str(e)}")
            raise