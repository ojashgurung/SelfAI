from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from ..database.models import User

class UserService:
    async def get_user_by_email(self, email: str, session : AsyncSession):
        statement = select(User).where(User.email == email)

        result = await session.exec(statement)

        user = result.first()
        return user
    
    async def user_exists(self, email: str, session: AsyncSession):
        user = await self.get_user_by_email(email, session)

        return True if user is not None else False