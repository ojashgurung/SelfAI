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
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to create a chat session"
        )
    
    namespace_exists = await rag_service.check_namespace_exists(session_data.namespace)
    if not namespace_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No documents found in this namespace. Please upload documents first."
        )

    return await chat_service.create_session(session_data, current_user, rag_service, db_session)

@chat_router.post("/sessions/{session_id}/messages", response_model=MessageRead)
async def send_message(
    session_id: UUID,
    message: MessageCreate,
    current_user: Optional[dict] = Depends(access_token_bearer),
    rag_service: RagService = Depends(get_rag_service),
    db_session: AsyncSession = Depends(get_session)
):  
    user_id = current_user["user"]["id"] if current_user else None

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
            visitor_id = str(current_user["user"]["id"])
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

    url = f"http://localhost:3000/dashboard/chat/public/{share_token}"
    
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
        user_id = current_user["user"]["id"]
        user = await db_session.get(Users, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        await db_session.refresh(user, ['visited_chats'])


        all_chats = user.visited_chats
        all_chats.sort(key=lambda x: x.updated_at, reverse=True)

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
        user_id = current_user["user"]["id"]
        user = await db_session.get(Users, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        await db_session.refresh(user, ['visited_chats'])

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

@chat_router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat_session(
    session_id: UUID,
    current_user: dict = Depends(strict_token_bearer),
    db_session: AsyncSession = Depends(get_session), 
):
    """Delete a specific chat session"""
    try:
        user_id = current_user["user"]["id"]
        session = await chat_service.get_session(session_id, db_session)
        
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
            
        if str(session.visitor_id)!= str(user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this chat session"
            )
            
        if session.parent_id:
            session.visitor_id = None
            db_session.add(session)
        else:
            await db_session.delete(session)

        await db_session.commit()
        
        return None

    except Exception as e:
        await db_session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@chat_router.get("/sessions/analytics", response_model=List[dict])
async def get_chat_analytics(
    current_user: dict = Depends(strict_token_bearer),
    db_session: AsyncSession = Depends(get_session),
):
    try:
        user_id = current_user["user"]["id"]
        user = await db_session.get(Users, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        await db_session.refresh(user, ['owned_chats'])
        
        analytics = []
        for chat in user.owned_chats:
            if "owner" in chat.title.lower():
                continue
            await db_session.refresh(chat, ['messages', 'visitor'])
            
            # Calculate message statistics
            total_messages = len(chat.messages)
            user_messages = sum(1 for m in chat.messages if m.user_id == user_id)
            ai_messages = sum(1 for m in chat.messages if m.role == "assistant")
            
            # Calculate visitor statistics
            unique_visitors = set()
            for message in chat.messages:
                if message.user_id and message.user_id != user_id:
                    unique_visitors.add(message.user_id)
            
            analytics.append({
                "session_id": str(chat.id),
                "title": chat.title,
                "is_public": chat.is_public,
                "share_token": chat.share_token,
                "created_at": chat.created_at,
                "last_activity": chat.updated_at,
                "stats": {
                    "total_messages": total_messages,
                    "user_messages": user_messages,
                    "ai_messages": ai_messages,
                    "unique_visitors": len(unique_visitors),
                    "average_response_length": sum(len(m.content) for m in chat.messages) / total_messages if total_messages > 0 else 0,
                }
            })

        analytics.sort(key=lambda x: x["stats"]["total_messages"], reverse=True)
        
        return analytics

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
@chat_router.get("/sessions/{session_id}", response_model=ChatSessionWithMessages)
async def get_chat_session(
    session_id: UUID,
    current_user: dict = Depends(strict_token_bearer),
    db_session: AsyncSession = Depends(get_session),
):
    """Get chat session details by session ID"""
    try:
        user_id = current_user["user"]["id"]
        session = await chat_service.get_session(session_id, db_session)
        
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
            
        # Check if user is either the owner or a visitor of this session
        if str(session.user_id) != user_id and str(session.visitor_id) != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this chat session"
            )
        
        await db_session.refresh(session, ['messages'])
        return session

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )