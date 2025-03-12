from fastapi import APIRouter, Depends, HTTPException, status, Request
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

@chat_router.post("/sessions/{session_id}/messages", response_model=MessageRead)
async def send_message(
    session_id: UUID,
    message: MessageCreate,
    request: Request,
    rag_service: RagService = Depends(get_rag_service),
    db_session: AsyncSession = Depends(get_session)
):  
    print("Message:", message)
    print("Share token:", message.share_token)
    auth_header = request.headers.get("Authorization")
    current_user = None
    template_session = None
    
    if auth_header and auth_header.startswith("Bearer "):
        try:
            current_user = await access_token_bearer(request)
        except:
            # If token is invalid, continue as public access
            pass


    session = await chat_service.get_session(session_id, db_session)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
        
    # Handle authenticated access
    if not current_user:
        if not message.share_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Share token is required for public access"
            )
        template_session = await chat_service.get_session_by_token(message.share_token, db_session)
        if not template_session or not template_session.is_public:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid share token or unauthorized access"
            )

        if session.id != template_session.id and session.parent_id != template_session.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid session access"
            )

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
    request: Request,
    rag_service: RagService = Depends(get_rag_service),
    db_session: AsyncSession = Depends(get_session),
):
    """Access a public chat session using share token"""
    session = await chat_service.get_session_by_token(share_token, db_session)
    if not session or not session.is_public:
        raise HTTPException(status_code=404, detail="Chat session not found")

    visitor_id = request.client.host

    visitor_session = await chat_service.get_or_create_visitor_session(
        session.parent_id,
        visitor_id,
        session.namespace,
        db_session
    )
    visitor_session.share_token = share_token
    
    return visitor_session

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
    current_user: dict = Depends(access_token_bearer),
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