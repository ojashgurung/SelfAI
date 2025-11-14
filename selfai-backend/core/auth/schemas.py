import uuid
from typing import Optional
import re

from pydantic import BaseModel, EmailStr, Field, HttpUrl, field_validator, model_validator

class UserCreateModel(BaseModel):
    fullname: str = Field(max_length=40)
    email: EmailStr = Field(max_length=40)
    password: str = Field(min_length=8)
    google_id: Optional[str] = None
    github_id: Optional[str] = None
    auth_provider: Optional[str] = None
    profile_image: Optional[str] = None

    @model_validator(mode='after')
    def validate_password(cls, values):
        provider = values.auth_provider
        password = values.password

        if provider in {"google", "github"}:
            return values

        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", password):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", password):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"[0-9]", password):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]", password):
            raise ValueError("Password must contain at least one special character")

        return values

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError("Invalid email format")
        
        v = v.lower().strip()
        if v.endswith("."):
            raise ValueError("Email cannot end with a dot")
        if not re.search(r"\.(com|org|net|edu)$", v):
            raise ValueError("Email must end with .com, .org, .net, or .edu")
        
        disposable_domains = {
            "mailinator.com", "10minutemail.com", "guerrillamail.com", "tempmail.com"
        }
        domain = v.split("@")[-1]
        if domain in disposable_domains:
            raise ValueError("Disposable email addresses are not allowed")
    
        return v


    model_config = {
        "json_schema_extra": {
            "example": {
                "fullname" : "John Doe",
                "email": "johndoe123@co.com",
                "password": "Testpass123!",
            }
        }
    }

class UserLoginModel(BaseModel):
    email: str = Field(max_length=40)
    password: str = Field(min_length=8)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v):
        return v.strip().lower()

    @field_validator("password")
    @classmethod
    def check_not_blank(cls, v):
        if not v.strip():
            raise ValueError("Password cannot be blank.")
        return v

class UserModel(BaseModel):
    id: uuid.UUID
    fullname: str
    email: str
    role: str

class UserLoginResponseModel(BaseModel):
    message: str
    user: UserModel