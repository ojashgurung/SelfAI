from sqlmodel import SQLModel, Field, Session
from sqlalchemy import event, Column, JSON
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional, Dict
import uuid
from sqlmodel import Relationship
from typing import List, Dict, TYPE_CHECKING

if TYPE_CHECKING:
    from graph.models.documents import Document

def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)

class Source(SQLModel, table=True):
    __tablename__ = "sources"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True, nullable=False)
    platform: str = Field(index=True, nullable=False)
    connection_id: Optional[uuid.UUID] = Field(
        default=None, foreign_key="connections.id", index=True
    )
    account_id: Optional[str] = Field(default=None, index=True)
    display_name: str = Field(nullable=False)
    status: str = Field(default="connected", index=True)
    last_synced_at: Optional[datetime] = Field(default=None)
    last_ingested_at: Optional[datetime] = Field(default=None)
    last_error: Optional[str] = Field(default=None)
    source_metadata: Dict = Field(default_factory=dict, sa_column=Column(JSON))

    documents: List["Document"] = Relationship(back_populates="source")
    
    created_at: datetime = Field(
        default_factory=utcnow,
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=utcnow,
        nullable=False
    )

# Auto-update timestamp before any update
@event.listens_for(Source, 'before_update')
def update_timestamp(mapper, connection, target):
    target.updated_at = utcnow()
