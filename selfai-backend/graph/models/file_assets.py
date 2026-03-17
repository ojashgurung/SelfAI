from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, JSON
from datetime import datetime, timezone
from typing import Optional, Dict, TYPE_CHECKING, List
import uuid

if TYPE_CHECKING:
    from graph.models.documents import Document

def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)

class FileAsset(SQLModel, table=True):
    __tablename__ = "file_assets"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        nullable=False,
    )

    user_id: uuid.UUID = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
    )

    # Optional but recommended:
    # link uploads to the "uploads" source
    source_id: Optional[uuid.UUID] = Field(
        foreign_key="sources.id",
        default=None,
        index=True,
    )

    # File identity
    file_name: str = Field(nullable=False)
    mime_type: Optional[str] = Field(default=None, index=True)

    # Storage info
    storage_path: str = Field(nullable=False)  # local path, S3 key, GCS path, etc.
    file_size: Optional[int] = Field(default=None)  # bytes

    # Integrity / dedupe
    sha256: Optional[str] = Field(default=None, index=True)

    # Extra info (original filename, upload method, etc.)
    file_assets_metadata: Dict = Field(
        default_factory=dict,
        sa_column=Column(JSON),
    )

    # Timestamps (timezone-aware)
    created_at: datetime = Field(
        default_factory=utcnow,
        nullable=False,
    )
    updated_at: datetime = Field(
        default_factory=utcnow,
        nullable=False,
    )

    documents: List["Document"] = Relationship(back_populates="file_asset")

    def __repr__(self) -> str:
        return (
            f"<FileAsset id={self.id} "
            f"file_name={self.file_name} "
            f"user_id={self.user_id}>"
        )