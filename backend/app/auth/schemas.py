import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

class UserCreateModel(BaseModel):
    fullname: str = Field(max_length=40)
    email: str = Field(max_length=40)
    password: str = Field(min_length=8)
    google_id: Optional[str] = None
    github_id: Optional[str] = None
    auth_provider: Optional[str] = None
    profile_image: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "fullname" : "John Doe",
                "email": "johndoe123@co.com",
                "password": "testpass123",
            }
        }
    }

class UserModel(BaseModel):
    uid: uuid.UUID
    email: str
    password_hash: str = Field(exclude=True)
    created_at: datetime
    update_at: datetime

class UserLoginModel(BaseModel):
    email: str = Field(max_length=40)
    password: str = Field(min_length=8)

class EmailModel(BaseModel):
    addresses: List[str]