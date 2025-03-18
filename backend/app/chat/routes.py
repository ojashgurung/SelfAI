from fastapi import APIRouter, Depends, HTTPException, status, Request, Security
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
strict_token_bearer = AccessTokenBearer(auto_error=True)
access_token_bearer = AccessTokenBearer(auto_error=False)

async def get_rag_service():
    return RagService()

@chat_router.post("/sessions", response_model=ChatSessionRead)
async def create_chat_session(
    session_data: ChatSessionCreate,
    current_user: dict = Depends(strict_token_bearer),
    rag_service: RagService = Depends(get_rag_service),
    db_session: AsyncSession = Depends(get_session),
):
    return await chat_service.create_session(session_data,current_user, rag_service, db_session)

@chat_router.post("/sessions/{session_id}/messages", response_model=MessageRead)
async def send_message(
    session_id: UUID,
    message: MessageCreate,
    current_user: Optional[dict] = Depends(access_token_bearer),
    rag_service: RagService = Depends(get_rag_service),
    db_session: AsyncSession = Depends(get_session)
):  
    user_id = current_user["user"]["user_id"] if current_user else None

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

    return await chat_service.process_message(
        session_id,
        message,
        user_id,
        rag_service,
        db_session
    )

@chat_router.get("/public/{share_token}", response_model=ChatSessionWithMessages)
async def get_public_chat_session(
    share_token: str,
    request: Request,
    current_user: Optional[dict] = Security(access_token_bearer),
    rag_service: RagService = Depends(get_rag_service),
    db_session: AsyncSession = Depends(get_session),
):
    """Access a public chat session using share token"""
    
    session = await chat_service.get_session_by_token(share_token, db_session)
    if not session or not session.is_public:
        raise HTTPException(status_code=404, detail="Chat session not found")

    try:
        if current_user:
            visitor_id = str(current_user["user"]["user_id"])
        else:
            visitor_id = request.client.host
    except (KeyError, TypeError):
        visitor_id = request.client.host

    visitor_session = await chat_service.get_or_create_visitor_session(
        session.id,
        visitor_id,
        session.namespace,
        db_session
    )
    
    return visitor_session

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

@chat_router.get("/sessions/history", response_model=List[ChatSessionWithMessages])
async def get_user_chat_history(
    current_user: dict = Depends(strict_token_bearer),
    db_session: AsyncSession = Depends(get_session),
):
    """Get all chat sessions related to the user"""
    try:
        user_id = current_user["user"]["user_id"]
        user = await db_session.get(Users, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Refresh relationships to get latest data
        await db_session.refresh(user, ['owned_chats', 'visited_chats'])

        # Combine owned and visited chats
        all_chats = []
        all_chats.extend(user.owned_chats)
        all_chats.extend(user.visited_chats)

        # Sort by most recent first
        all_chats.sort(key=lambda x: x.updated_at, reverse=True)

        # Load messages for each chat
        for chat in all_chats:
            await db_session.refresh(chat, ['messages'])

        return all_chats

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@chat_router.delete("/sessions/history", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat_history(
    current_user: dict = Depends(strict_token_bearer),
    db_session: AsyncSession = Depends(get_session),
):
    """Delete all chat sessions related to the user"""
    try:
        user_id = current_user["user"]["user_id"]
        user = await db_session.get(Users, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Refresh relationships to get latest data
        await db_session.refresh(user, ['owned_chats', 'visited_chats'])

        # Delete all owned chats
        for chat in user.owned_chats:
            await db_session.delete(chat)

        # Remove user from visited chats
        for chat in user.visited_chats:
            chat.visitor_id = None
            db_session.add(chat)

        await db_session.commit()
        return None

    except Exception as e:
        await db_session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )