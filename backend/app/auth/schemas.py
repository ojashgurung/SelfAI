import uuid
from datetime import datetime

from pydantic import BaseModel, Field

class UserCreateModel(BaseModel):
    email: str = Field(max_length=40)
    password: str = Field(min_length=8)

    model_config = {
        "json_schema_extra": {
            "example": {
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