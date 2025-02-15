import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import UploadFile, File

from pydantic import BaseModel, Field, field_validator

class UploadFileRequest(BaseModel):
    uuid: uuid.UUID
    file: Optional[UploadFile] = File(None, description="Uploaded document (pdf, docx, html, md)")
    text: Optional[str] = Field(None, description="Text content for the document, optional if a file is uploaded")

    @field_validator("file", mode="before")
    def check_either_file_or_text(cls, v, values, field):
        if not v and not values.get("text"):
            raise ValueError("Either 'file' or 'text' must be provided.")
        return v

    @field_validator("text", mode="before")
    def check_either_file_or_text(cls, v, values, field):
        if not v and not values.get("file"):
            raise ValueError("Either 'file' or 'text' must be provided.")
        return v


class UserDataSourceCreate(BaseModel):
    source: str  # LinkedIn, GitHub, Resume, etc.
    vector_db_id: str
    data: List[str] = None  # Optional data associated with this data source

    class Config:
        orm_mode = True


class UserDataSourceOut(BaseModel):
    id: uuid.UUID
    uuid: uuid.UUID  # Foreign key to Users table
    source: str
    vector_db_id: str
    data: List[str] = None
    created_at: datetime
    update_at: datetime

    class Config:
        orm_mode = True