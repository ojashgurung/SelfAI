from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Literal
from uuid import UUID

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    content: str
    share_token: Optional[str] = None

class MessageRead(MessageBase):
    id: UUID
    session_id: UUID
    role: Literal["user", "assistant"]
    content: str    
    created_at: datetime

class ChatSessionBase(BaseModel):
    namespace: str
    title: str
    is_public: bool = False

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSessionUpdate(BaseModel):
    title: Optional[str] = None
    is_public: Optional[bool] = None

class ChatSessionRead(ChatSessionBase):
    id: UUID
    user_id: Optional[UUID]
    visitor_id: Optional[UUID]
    share_token: Optional[str]
    created_at: datetime
    updated_at: datetime
    messages: List[MessageRead] = []

class ChatSessionWithMessages(ChatSessionRead):
    messages: List[MessageRead] = []

class ChatSessionConnectionResponse(ChatSessionWithMessages):
    owner_name: str