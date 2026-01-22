# graph/models/documents.py
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, JSON, UniqueConstraint, Index
from datetime import datetime, timezone
from typing import Optional, Dict
import uuid


class Document(SQLModel, table=True):
    __tablename__ = "documents"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True, nullable=False)

    source_id: uuid.UUID = Field(foreign_key="sources.id", index=True, nullable=False)

    # External identifier from platform side (stable key)
    # Examples:
    # - github:repo:<owner>/<repo>:readme
    # - drive:file:<fileId>
    # - upload:file:<sha256>
    external_id: str = Field(index=True, nullable=False)

    # Logical type of document
    # Examples: "readme", "md", "pdf", "docx", "drive_doc", "text"
    doc_type: str = Field(index=True, nullable=False)

    title: str = Field(nullable=False)
    url: Optional[str] = Field(default=None)

    # Hash of extracted text/content to detect changes
    content_hash: Optional[str] = Field(default=None, index=True)

    # When the platform says it was last updated (if available)
    updated_at_source: Optional[datetime] = Field(default=None)

    # Optional: store extracted text (v1 OK). If you prefer, store in object storage instead.
    extracted_text: Optional[str] = Field(default=None)

    # Metadata: repo info, drive mimeType, file path, commit sha, etc.
    doc_metadata: Dict = Field(default_factory=dict, sa_column=Column(JSON))

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    __table_args__ = (
        # prevents duplicate documents per source/external_id
        UniqueConstraint("user_id", "source_id", "external_id", name="uq_document_source_external"),
        # common query index (helps list docs per source)
        Index("ix_documents_user_source", "user_id", "source_id"),
    )