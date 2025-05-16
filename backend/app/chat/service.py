from datetime import datetime, timedelta

from fastapi import HTTPException, status
from sqlmodel import select, join
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from uuid import UUID
import secrets

from ..database.models import ChatSessions, ChatMessages, Users
from .schemas import ChatSessionCreate, ChatSessionUpdate, MessageCreate
from ..rag.service import RagService


class ChatService:
    async def create_session(
        self,
        session_data: ChatSessionCreate,
        current_user: Optional[dict],
        rag_service: RagService,
        db_session: AsyncSession,
    ):
        try:
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required to create a session"
                ) 

            user_id = current_user["user"]["id"]
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid user credentials"
                )

            share_token = secrets.token_urlsafe(16) if session_data.is_public else None

            chat_session = ChatSessions(
                user_id=user_id,
                share_token=share_token,
                namespace=session_data.namespace,
                title=session_data.title,
                is_public=session_data.is_public,
                visitor_id=None,
                parent_id=None
            )
            
            db_session.add(chat_session)
            await db_session.flush()  
            await db_session.commit()
            await db_session.refresh(chat_session, ['messages'])

            return chat_session

        except Exception as e:
            await db_session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create session +++: {str(e)}"
            )

    async def get_session(
        self,
        session_id: UUID,
        db_session: AsyncSession
    ) -> Optional[ChatSessions]:
        statement = select(ChatSessions).where(ChatSessions.id == session_id)
        result = await db_session.exec(statement)
        session = result.first()
        if session:
            await db_session.refresh(session, ['messages'])
        return session

    async def get_session_by_token(
        self,
        token: str,
        db_session: AsyncSession
    ) -> Optional[ChatSessions]:
        statement = select(ChatSessions).where(ChatSessions.share_token == token, ChatSessions.is_public == True)
        result = await db_session.exec(statement)
        session = result.first()
        if session:
            await db_session.refresh(session, ['messages'])
        return session
    
    async def get_or_create_visitor_session(
        self,
        template_session_id: UUID,
        visitor_id: str,
        namespace: str,
        db_session: AsyncSession
    ) -> ChatSessions:
        try:
            statement = select(ChatSessions).where(
                ChatSessions.parent_id == template_session_id,
                ChatSessions.title == f"Visitor: {visitor_id}"
            )
            result = await db_session.exec(statement)
            session = result.first()

            if session:
                await db_session.refresh(session, ['messages'])
                return session
            
            template_session = await self.get_session(template_session_id, db_session)
            if not template_session:
                raise ValueError("Template session not found")

            try:
                visitor_uuid = UUID(visitor_id)
            except ValueError:
                visitor_uuid = None

            # Create new session
            new_session = ChatSessions(
                parent_id=template_session_id,
                user_id= template_session.user_id,
                title=f"Visitor: {visitor_id}",
                namespace=namespace,
                is_public=True,
                visitor_id=visitor_uuid,
                share_token = None 
            )

            db_session.add(new_session)
            await db_session.commit()
            await db_session.refresh(new_session, ['messages'])
            
            return new_session
        except Exception as e:
            await db_session.rollback()
            raise ValueError(f"Failed to create visitor session: {str(e)}")

    async def process_message(
        self,
        session_id: UUID,
        message_data: MessageCreate,
        user_id : Optional[UUID],
        rag_service: RagService,
        db_session: AsyncSession
    ) -> dict:
        # Get chat session
        session = await self.get_session(session_id, db_session)
        if not session:
            raise ValueError("Chat session not found")


        if not session.is_public and str(user_id) != str(session.user_id):  
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this chat"
            )

        user_msg = ChatMessages(
            session_id=session_id,
            role="user",
            user_id=user_id,
            content=message_data.content
        )
        db_session.add(user_msg)
        await db_session.commit()

        # Get AI response using RAG
        response = await rag_service.handle_query(message_data.content, session.namespace)
        if response:
            retrieve_text = await rag_service.handle_answer(response)
            ai_response = await rag_service.query_llm(retrieve_text, message_data.content)
            
            if hasattr(ai_response, 'content'):
                response_content = ai_response.content
            elif isinstance(ai_response, dict) and 'content' in ai_response:
                response_content = ai_response['content']
            elif hasattr(ai_response, 'message'):
                response_content = ai_response.message.content
            else:
                response_content = str(ai_response)
        else:
            response_content = "I couldn't find relevant information to answer your question."

        ai_message = ChatMessages(
            session_id=session_id,
            role="assistant",
            user_id=user_id,
            content=response_content
        )
        db_session.add(ai_message)
        await db_session.commit()
        await db_session.refresh(ai_message)
        return {
            "id": ai_message.id,
            "session_id": ai_message.session_id,
            "user_id": ai_message.user_id,
            "role": ai_message.role,
            "content": ai_message.content,
            "created_at": ai_message.created_at
        }

    async def get_master_session(
        self,
        namespace: str,
        user_id: UUID,
        db_session: AsyncSession
    ) -> Optional[ChatSessions]:
        """Get master/owner session for a namespace"""
        statement = select(ChatSessions).where(
            ChatSessions.user_id == user_id,
            ChatSessions.namespace == namespace,
            ChatSessions.title == "Owner"
        )
        result = await db_session.exec(statement)
        session = result.first()
        if session:
            await db_session.refresh(session, ['messages'])
        return session

    async def get_total_chat_count(
        self,
        user_id: UUID,
        db_session: AsyncSession
    ) -> int:
        statement = select(ChatSessions).where(
            ChatSessions.user_id == user_id,
            ChatSessions.visitor_id != None
        )
        result = await db_session.exec(statement)
        sessions = result.all()
        return len(sessions)

    async def get_weekly_chat_count(
        self,
        user_id: UUID,
        db_session: AsyncSession
    ) -> int:
        statement = select(ChatSessions).where(
            ChatSessions.user_id == user_id,
            ChatSessions.visitor_id != None,
            ChatSessions.created_at >= datetime.now() - timedelta(days=7)
        )
        result = await db_session.exec(statement)
        sessions = result.all()

        return len(sessions)