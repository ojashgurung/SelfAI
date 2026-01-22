from sqlmodel import SQLModel, Field
import uuid
from datetime import datetime, timezone
from typing import Optional

class Connection(SQLModel, table=True):
    __tablename__ = "connections"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False, index=True)

    platform: str
    username: Optional[str] = None
    external_id: Optional[str] = None

    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    
    # Added missing fields to support upsert logic
    token_type: Optional[str] = None
    expires_at: Optional[int] = None
    status: str = Field(default="connected")

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    last_synced_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )
