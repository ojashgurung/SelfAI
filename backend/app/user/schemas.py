from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class DocumentInfo(BaseModel):
    id: str
    namespace: str
    file_name: str
    created_at: datetime

class UserResponse(BaseModel):
    user_id: str
    email: str
    fullname: str
    personal_bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    documents: List[DocumentInfo] = []