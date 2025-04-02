from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime
from uuid import UUID

class WidgetBase(BaseModel):
    theme: str
    color: str
    heading: str
    title: str
    subtitle: str
    prompts: List[Dict] = []
    session_id: UUID

class WidgetCreate(WidgetBase):
    pass

class WidgetUpdate(BaseModel):
    theme: Optional[str] = None
    color: Optional[str] = None
    heading: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    prompts: Optional[List[Dict]] = None
    is_active: Optional[bool] = None

class WidgetRead(WidgetBase):
    id: UUID
    user_id: UUID
    share_token: str
    created_at: datetime
    expires_at: Optional[datetime]
    is_active: bool

class WidgetWithSession(WidgetRead):
    session: Optional[dict] = None