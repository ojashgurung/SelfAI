import uuid as uuid_pkg
from datetime import datetime
from typing import Optional, List
from enum import Enum
from sqlalchemy import JSON
from sqlmodel import Field, SQLModel, Relationship


class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"

class Users(SQLModel, table = True):
    uuid: uuid_pkg.UUID = Field(default_factory=uuid_pkg.uuid4, nullable=False, primary_key=True)
    fullname: str = Field(nullable=False)
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
    Documents: list["Documents"] = Relationship(back_populates="Users")

    def __repr__(self):
        return f"<User {self.email} - Premium: {self.is_premium}>"
    
class Documents(SQLModel, table = True):
    id: uuid_pkg.UUID = Field(default_factory=uuid_pkg.uuid4, nullable=False, primary_key=True)
    user_id: uuid_pkg.UUID = Field(foreign_key="users.uuid", nullable=False)
    file_name: str = Field(nullable=False)
    file_size: str
    file_path: str
    vector_ids: List[str] = Field(sa_type=JSON, default=[])
    namespace: str
    created_at: datetime = Field(default_factory=datetime.now)
    update_at: datetime = Field(default_factory=datetime.now)

    Users: "Users" = Relationship(back_populates="Documents")

    def __repr__(self):
        return f"<Documents(user_id={self.user_id}, source={self.file_name}, created_at={self.created_at})>"