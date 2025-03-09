from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from uuid import UUID
from qrcode import QRCode
from fastapi.responses import StreamingResponse
from io import BytesIO

from ..database.db import get_session
from ..auth.dependencies import get_current_user
from ..database.models import Users
from .service import ChatService
from .schemas import (
    ChatSessionCreate,
    ChatSessionRead,
    ChatSessionUpdate,
    ChatSessionWithMessages,
    MessageCreate,
    MessageRead
)
from ..rag.service import RagService
from ..auth.dependencies import AccessTokenBearer



chat_router = APIRouter()
chat_service = ChatService()
access_token_bearer = AccessTokenBearer()

async def get_rag_service():
    return RagService()

@chat_router.post("/sessions", response_model=ChatSessionRead)
async def create_chat_session(
    session_data: ChatSessionCreate,
    current_user: dict = Depends(access_token_bearer),
    rag_service: RagService = Depends(get_rag_service),
    db_session: AsyncSession = Depends(get_session),
):
    return await chat_service.create_session(session_data,current_user, rag_service, db_session)

# @chat_router.get("/sessions", response_model=List[ChatSessionRead])
# async def get_user_sessions(
#     current_user: Users = Depends(get_current_user),
#     db: AsyncSession = Depends(get_session),
#     rag_service: RagService = Depends(get_rag_service)
# ):
#     """Get all chat sessions for the current user"""
#     chat_service = ChatService(db, rag_service)
#     return await chat_service.get_user_sessions(current_user.uuid, db)

# @chat_router.get("/sessions/{session_id}", response_model=ChatSessionWithMessages)
# async def get_chat_session(
#     session_id: UUID,
#     current_user: Optional[Users] = Depends(get_current_user),
#     db: AsyncSession = Depends(get_session),
#     rag_service: RagService = Depends(get_rag_service)
# ):
#     """Get a specific chat session with its messages"""
#     chat_service = ChatService(db, rag_service)
#     session = await chat_service.get_session(session_id, db)
#     if not session:
#         raise HTTPException(status_code=404, detail="Chat session not found")
#     if not session.is_public and (not current_user or current_user.uuid != session.user_id):
#         raise HTTPException(status_code=403, detail="Not authorized to access this chat")
#     return session

@chat_router.post("/sessions/{session_id}/messages", response_model=MessageRead)
async def send_message(
    session_id: UUID,
    message: MessageCreate,
    current_user: dict = Depends(access_token_bearer),
    rag_service: RagService = Depends(get_rag_service),
    db_session: AsyncSession = Depends(get_session)
):
    """Send a message in a chat session"""
    return await chat_service.process_message(
        session_id,
        message,
        current_user,
        rag_service,
        db_session
    )

@chat_router.get("/public/{share_token}", response_model=ChatSessionWithMessages)
async def get_public_chat_session(
    share_token: str,
    rag_service: RagService = Depends(get_rag_service),
    db_session: AsyncSession = Depends(get_session),
):
    """Access a public chat session using share token"""
    session = await chat_service.get_session_by_token(share_token, db_session)
    if not session or not session.is_public:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return session

# @chat_router.patch("/sessions/{session_id}", response_model=ChatSessionRead)
# async def update_chat_session(
#     session_id: UUID,
#     update_data: ChatSessionUpdate,
#     current_user: Users = Depends(get_current_user),
#     db: AsyncSession = Depends(get_session),
#     rag_service: RagService = Depends(get_rag_service)
# ):
#     """Update a chat session's properties"""
#     chat_service = ChatService(db, rag_service)
#     session = await chat_service.update_session(session_id, update_data, current_user, db)
#     if not session:
#         raise HTTPException(status_code=404, detail="Chat session not found")
#     return session

# @chat_router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_chat_session(
#     session_id: UUID,
#     current_user: Users = Depends(get_current_user),
#     db: AsyncSession = Depends(get_session),
#     rag_service: RagService = Depends(get_rag_service)
# ):
#     """Delete a chat session"""
#     chat_service = ChatService(db, rag_service)
#     success = await chat_service.delete_session(session_id, current_user, db)
#     if not success:
#         raise HTTPException(status_code=404, detail="Chat session not found")

@chat_router.get("/public/{share_token}/qr")
async def get_session_qr(
    share_token: str,
    db_session: AsyncSession = Depends(get_session),
):
    """Generate QR code for public chat session"""
    # Verify session exists
    session = await chat_service.get_session_by_token(share_token, db_session)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")

    url = f"http://192.168.1.146:3000/dashboard/chat/public/{share_token}"
    
    qr = QRCode(version=1, box_size=10, border=5)
    qr.add_data(url)
    qr.make(fit=True)
    
    img_buffer = BytesIO()
    qr.make_image(fill_color="black", back_color="white").save(img_buffer)
    img_buffer.seek(0)
    
    return StreamingResponse(img_buffer, media_type="image/png")