from sqlmodel import SQLModel, Field
import uuid
from datetime import datetime
from typing import Optional

class UserIntegration(SQLModel, table=True):
    __tablename__ = "user_integrations"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False, index=True)

    platform: str
    username: Optional[str] = None
    external_id: Optional[str] = None

    access_token: Optional[str] = None
    refresh_token: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_synced_at: datetime = Field(default_factory=datetime.utcnow)
