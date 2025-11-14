from sqlmodel import select
from datetime import timedelta
from typing import Optional
from fastapi.exceptions import HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession

from ..database.models import Users
from .schemas import UserCreateModel
from .utils import generate_passwd_hash
from ..errors import UserAlreadyExists
from fastapi.responses import JSONResponse

from .utils import (
    create_token,
    set_auth_cookies,

)

class AuthService:
    async def get_user_by_email(self, email: str, session : AsyncSession):
        normalized_email = email.lower()
        statement = select(Users).where(Users.email.ilike(normalized_email))

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
        await session.refresh(new_user) 
        

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
                return await self.update_user(user, {
                    "profile_image": user_info.get('profile_image'),
                }, session)
                

            user = await self.get_user_by_email(user_info['email'], session)
            if user:
                if user.auth_provider and user.auth_provider != "google":
                    raise HTTPException(
                        status_code=400,
                        detail=f"User already registered with {user.auth_provider}"
                    )
                if not user.auth_provider:
                    raise UserAlreadyExists()
                
                return await self.update_user(user, {
                    "profile_image": user_info.get('profile_image'),
                    "google_id": user_info['sub'], 
                    "auth_provider": "google"
                }, session)

            user_data = UserCreateModel(
                email=user_info['email'],
                fullname=user_info.get('name', 'Google User'),
                password='google_oauth',
                google_id=user_info['sub'],
                auth_provider='google',
                profile_image=user_info.get('profile_image')
            )
            return await self.create_user(user_data, session)
        except Exception as e:
            print(f"Error in get_or_create_google_user: {str(e)}")
            raise

    async def get_user_by_github_id(self, github_id: str, session: AsyncSession) -> Optional[Users]:
        query = select(Users).where(Users.github_id == github_id)
        result = await session.exec(query)
        return result.first()

    async def get_or_create_github_user(self, user_info: dict, primary_email: str, session: AsyncSession) -> Users:
        """Get existing user or create new one from GitHub OAuth data"""
        try:
            user = await self.get_user_by_github_id(str(user_info['id']), session)
            if user:
                return await self.update_user(user, {
                "profile_image": user_info.get('profile_image')
            }, session)

            user = await self.get_user_by_email(primary_email, session)
            if user:
                if user.auth_provider and user.auth_provider != "github":
                    raise HTTPException(
                        status_code=400,
                        detail=f"User already registered with {user.auth_provider}"
                    )

                if not user.auth_provider:
                    raise UserAlreadyExists()

                return await self.update_user(user, {
                    "github_id": str(user_info['id']),
                    "auth_provider": "github",
                    "profile_image": user_info.get('profile_image') 
                }, session)

            user_data = UserCreateModel(
                email=primary_email,
                fullname=user_info.get('name', '') or user_info['login'],
                password='github_oauth',
                github_id=str(user_info['id']),
                auth_provider='github',
                profile_image=user_info.get('profile_image')
            )
            return await self.create_user(user_data, session)
        except Exception as e:
            print(f"Error in get_or_create_github_user: {str(e)}")
            raise
    
    async def create_oauth_response(self, user: Users, REFRESH_TOKEN_EXPIRY: int):
        access_token = create_token(
            user_data={
                "id": str(user.id),
                "email": user.email,
                "role": user.role,
            }
        )

        refresh_token = create_token(
            user_data={"id": str(user.id), "email": user.email},
            refresh=True,
            expiry=timedelta(days=REFRESH_TOKEN_EXPIRY),
        )

        response = JSONResponse(
            content={
                "message": "OAuth login successful",
                "user": {
                    "id": str(user.id),
                    "fullname": user.fullname,
                    "email": user.email,
                    "role": user.role,
                    "profile_image": user.profile_image 
                }
            }
        )

        set_auth_cookies(response, access_token, refresh_token)

        return response