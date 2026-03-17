# graph/models/entities.py
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, JSON, UniqueConstraint, Index
from datetime import datetime, timezone
from typing import Optional, Dict
import uuid

def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)

class Entity(SQLModel, table=True):
    __tablename__ = "entities"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True, nullable=False)

    # project | experience | skill | education | link | preference
    entity_type: str = Field(index=True, nullable=False)

    # Human-friendly identifier (e.g., "SelfAI", "FastAPI", "VeraAI Tech")
    name: str = Field(index=True, nullable=False)

    # Flexible data payload (stack, dates, bullets, URLs, etc.)
    data: Dict = Field(default_factory=dict, sa_column=Column(JSON))

    # Trust + control
    confidence: float = Field(default=1.0)
    visibility: str = Field(default="private", index=True)  # public | link | private | never

    # If created from extraction, store provenance hints
    created_from: Optional[str] = Field(default=None)  # e.g. "extraction", "manual", "import"
    entity_metadata: Dict = Field(default_factory=dict, sa_column=Column(JSON))

    created_at: datetime = Field(
        default_factory= utcnow,
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=utcnow,
        nullable=False
    )

    __table_args__ = (
        # Helps avoid duplicates like multiple "FastAPI" skills for same user
        UniqueConstraint("user_id", "entity_type", "name", name="uq_entity_user_type_name"),
        Index("ix_entities_user_type", "user_id", "entity_type"),
    )