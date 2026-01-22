import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, TYPE_CHECKING
from enum import Enum
from sqlalchemy import JSON
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from graph.models.documents import Document

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"

def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)

class User(SQLModel, table = True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, nullable=False, primary_key=True)
    fullname: str = Field(nullable=False)
    email: str = Field(unique=True, nullable=False)
    password_hash: str = Field(nullable=False, exclude=True)
    profile_image: Optional[str] = Field(default=None, nullable=True)
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

    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)
    last_login_at: datetime = Field(default_factory=utcnow)
    documents: List["Document"] = Relationship(back_populates="user")
    messages: List["ChatMessage"] = Relationship(back_populates="user")
    owned_chats: List["ChatSession"] = Relationship(
        back_populates="owner",
        sa_relationship_kwargs={"foreign_keys": "ChatSession.user_id"}
    )
    visited_chats: List["ChatSession"] = Relationship(
        back_populates="visitor",
        sa_relationship_kwargs={"foreign_keys": "ChatSession.visitor_id"}
    )

    widgets: List["Widget"] = Relationship(back_populates="owner")

    def __repr__(self):
        return f"<User {self.email} - Premium: {self.is_premium}>"


class ChatSession(SQLModel, table=True):
    __tablename__ = "chatsessions"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, nullable=False, primary_key=True)
    user_id: Optional[uuid.UUID]  = Field(foreign_key="users.id", nullable=True)
    visitor_id: Optional[uuid.UUID] = Field(foreign_key="users.id", nullable=True)
    parent_id: Optional[uuid.UUID] = Field(foreign_key="chatsessions.id", nullable=True)
    namespace: str
    title: str
    is_public: bool = Field(default=False)
    share_token: Optional[str] = Field(unique=True, index=True)
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)
    owner: "User" = Relationship(back_populates="owned_chats", sa_relationship_kwargs={"foreign_keys": "ChatSession.user_id"})
    visitor: Optional["User"] = Relationship(back_populates="visited_chats", sa_relationship_kwargs={"foreign_keys": "ChatSession.visitor_id"})
    messages: List["ChatMessage"] = Relationship(back_populates="session")
    parent_session: Optional["ChatSession"] = Relationship(back_populates="child_sessions", sa_relationship_kwargs={"foreign_keys": "ChatSession.parent_id", "remote_side": "ChatSession.id"})
    child_sessions: List["ChatSession"] = Relationship(back_populates="parent_session", sa_relationship_kwargs={"foreign_keys": "ChatSession.parent_id"})

class ChatMessage(SQLModel, table=True):
    __tablename__ = "chatmessages"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, nullable=False, primary_key=True)
    session_id: uuid.UUID = Field(foreign_key="chatsessions.id")
    user_id: Optional[uuid.UUID] = Field(foreign_key="users.id", nullable=True)
    role: str
    content: str
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)
    session: "ChatSession" = Relationship(back_populates="messages")
    user: Optional["User"] = Relationship(back_populates="messages")


class Widget(SQLModel, table=True):
    __tablename__ = "widgets"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, nullable=False, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    share_token: str = Field(unique=True, index=True)
    theme: str
    color: str
    heading: str
    title: str
    subtitle: str
    prompts: List[Dict] = Field(sa_type= JSON, default=[])
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)
    expires_at: Optional[datetime] = Field(default=None)
    is_active: bool = Field(default=True)

    owner: "User" = Relationship(back_populates="widgets", sa_relationship_kwargs={"foreign_keys": "Widget.user_id"})