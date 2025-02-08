import uuid
from datetime import date, datetime
from typing import List, Optional
from enum import Enum

from sqlmodel import Column, Field, SQLModel, create_engine
import sqlalchemy.dialects.postgresql as pg

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"

class User(SQLModel, table = True):
    uuid: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    email: str = Field(unique=True, nullable=False)
    password_hash: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=False), exclude=True
    )
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    update_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))

    personal_bio: str = Field(
        sa_column=Column(pg.TEXT, nullable=True)
    ) 

    linkedin_url: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=True)
    )

    github_url: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=True)
    )

    resume_url: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=True)
    )

    vector_db_id: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=True)
    ) 

    rag_enabled: bool = Field(
        sa_column=Column(pg.BOOLEAN, default=True)
    ) 

    is_premium: bool = Field(
        sa_column=Column(pg.BOOLEAN, default=False)
    )

    role: UserRole = Field(
        sa_column= Column(pg.ENUM(UserRole), default = UserRole.USER)
    )

    def __repr__(self):
        return f"<User {self.email} - Premium: {self.is_premium}>"