import uuid as uuid_pkg
from datetime import datetime
from typing import Optional
from enum import Enum

from sqlmodel import Field, SQLModel, Relationship


class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"

class Users(SQLModel, table = True):
    uuid: uuid_pkg.UUID = Field(default_factory=uuid_pkg.uuid4, nullable=False, primary_key=True)
    email: str = Field(unique=True, nullable=False)
    password_hash: str = Field(nullable=False, exclude=True)
    created_at: datetime = Field(default_factory=datetime.now)
    update_at: datetime = Field(default_factory=datetime.now)
    personal_bio: Optional[str] = Field(default=None, nullable=True) 
    linkedin_url: Optional[str] = Field(default=None, nullable=True)
    github_url: Optional[str] = Field(default=None, nullable=True)
    resume_url: Optional[str] = Field(default=None, nullable=True)
    vector_db_id: Optional[str] = Field(default=None, nullable=True) 
    rag_enabled: bool = Field(default=True)
    is_premium: bool = Field(default=False)
    role: UserRole = Field(default= UserRole.USER)
    data_sources: list["UserDataSource"] = Relationship(back_populates="Users")

    def __repr__(self):
        return f"<User {self.email} - Premium: {self.is_premium}>"
    
class UserDataSource(SQLModel, table = True):
    id: uuid_pkg.UUID = Field(default_factory=uuid_pkg.uuid4, nullable=False, primary_key=True)
    uuid: uuid_pkg.UUID = Field(foreign_key="users.uuid", nullable=False)
    source: str = Field(nullable=False) 
    vector_db_id: str = Field(nullable=False)
    data: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)
    update_at: datetime = Field(default_factory=datetime.now)

    Users: "Users" = Relationship(back_populates="data_sources")

    def __repr__(self):
        return f"<UserDataSource(user_id={self.uuid}, source={self.source}, created_at={self.created_at})>"