import uuid
from datetime import datetime
from typing import Optional, List, Dict
from enum import Enum
from sqlalchemy import JSON
from sqlmodel import Field, SQLModel, Relationship

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"

class Users(SQLModel, table = True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, nullable=False, primary_key=True)
    fullname: str = Field(nullable=False)
    email: str = Field(unique=True, nullable=False)
    password_hash: str = Field(nullable=False, exclude=True)
    profile_image: Optional[str] = Field(default=None, nullable=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    personal_bio: Optional[str] = Field(default=None, nullable=True) 
    linkedin_url: Optional[str] = Field(default=None, nullable=True)
    github_url: Optional[str] = Field(default=None, nullable=True)
    resume_url: Optional[str] = Field(default=None, nullable=True)
    vector_db_id: Optional[str] = Field(default=None, nullable=True) 
    rag_enabled: bool = Field(default=True)
    google_id: Optional[str] = Field(default=None, nullable=True, unique=True)
    github_id: Optional[str] = Field(default=None, nullable=True, unique=True)
    linkedin_id: Optional[str] = Field(default=None, nullable=True, unique=True) 
    auth_provider: str = Field(default="email")
    is_premium: bool = Field(default=False)
    role: UserRole = Field(default= UserRole.USER)
    documents: List["Documents"] = Relationship(back_populates="users")
    messages: List["ChatMessages"] = Relationship(back_populates="user")
    owned_chats: List["ChatSessions"] = Relationship(
        back_populates="owner",
        sa_relationship_kwargs={"foreign_keys": "ChatSessions.user_id"}
    )
    visited_chats: List["ChatSessions"] = Relationship(
        back_populates="visitor",
        sa_relationship_kwargs={"foreign_keys": "ChatSessions.visitor_id"}
    )

    widgets: List["Widgets"] = Relationship(back_populates="owner")

    def __repr__(self):
        return f"<User {self.email} - Premium: {self.is_premium}>"
    
class Documents(SQLModel, table = True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, nullable=False, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    file_name: str = Field(nullable=False)
    file_size: str
    file_path: str
    vector_ids: List[str] = Field(sa_type=JSON, default=[])
    namespace: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    users: "Users" = Relationship(back_populates="documents")

    def __repr__(self):
        return f"<Documents(user_id={self.user_id}, source={self.file_name}, created_at={self.created_at})>"

class ChatSessions(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, nullable=False, primary_key=True)
    user_id: Optional[uuid.UUID]  = Field(foreign_key="users.id", nullable=True)
    visitor_id: Optional[uuid.UUID] = Field(foreign_key="users.id", nullable=True)
    parent_id: Optional[uuid.UUID] = Field(foreign_key="chatsessions.id", nullable=True)
    namespace: str
    title: str
    is_public: bool = Field(default=False)
    share_token: Optional[str] = Field(unique=True, index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    owner: "Users" = Relationship(back_populates="owned_chats", sa_relationship_kwargs={"foreign_keys": "ChatSessions.user_id"})
    visitor: Optional["Users"] = Relationship(back_populates="visited_chats", sa_relationship_kwargs={"foreign_keys": "ChatSessions.visitor_id"})
    messages: List["ChatMessages"] = Relationship(back_populates="session")
    parent_session: Optional["ChatSessions"] = Relationship(back_populates="child_sessions", sa_relationship_kwargs={"foreign_keys": "ChatSessions.parent_id", "remote_side": "ChatSessions.id"})
    child_sessions: List["ChatSessions"] = Relationship(back_populates="parent_session", sa_relationship_kwargs={"foreign_keys": "ChatSessions.parent_id"})

class ChatMessages(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, nullable=False, primary_key=True)
    session_id: uuid.UUID = Field(foreign_key="chatsessions.id")
    user_id: Optional[uuid.UUID] = Field(foreign_key="users.id", nullable=True)
    role: str
    content: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    session: "ChatSessions" = Relationship(back_populates="messages")
    user: Optional["Users"] = Relationship(back_populates="messages")


class Widgets(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, nullable=False, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    share_token: str = Field(unique=True, index=True)
    theme: str
    color: str
    heading: str
    title: str
    subtitle: str
    prompts: List[Dict] = Field(sa_type= JSON, default=[])
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    expires_at: Optional[datetime] = Field(default=None)
    is_active: bool = Field(default=True)

    owner: "Users" = Relationship(back_populates="widgets", sa_relationship_kwargs={"foreign_keys": "Widgets.user_id"})