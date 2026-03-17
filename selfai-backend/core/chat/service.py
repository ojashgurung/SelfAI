from datetime import datetime, timedelta

from fastapi import HTTPException, status
from qrcode.util import create_data
from sqlmodel import select, join, func, desc
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from uuid import UUID
import secrets

from ..database.models import ChatSession, ChatMessage, User
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

            chat_session = ChatSession(
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
    ) -> Optional[ChatSession]:
        statement = select(ChatSession).where(ChatSession.id == session_id)
        result = await db_session.exec(statement)
        session = result.first()
        if session:
            await db_session.refresh(session, ['messages'])
        return session

    async def get_user_sessions(
        self,
        user_id: UUID,
        db_session: AsyncSession
    ) -> List[ChatSession]:
        statement = select(ChatSession).where(ChatSession.user_id == user_id)
        result = await db_session.exec(statement)
        sessions = result.all()
        for session in sessions:
            await db_session.refresh(session, ['messages'])
        return list(sessions)

    async def get_session_by_token(
        self,
        token: str,
        db_session: AsyncSession
    ) -> Optional[ChatSession]:
        statement = select(ChatSession).where(ChatSession.share_token == token, ChatSession.is_public == True)
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
    ) -> ChatSession:
        try:
            statement = select(ChatSession).where(
                ChatSession.parent_id == template_session_id,
                ChatSession.title == f"Visitor: {visitor_id}"
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
            new_session = ChatSession(
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

        user_msg = ChatMessage(
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

        ai_message = ChatMessage(
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
    ) -> Optional[ChatSession]:
        """Get master/owner session for a namespace"""
        statement = select(ChatSession).where(
            ChatSession.user_id == user_id,
            ChatSession.namespace == namespace,
            ChatSession.title == "Owner"
        )
        result = await db_session.exec(statement)
        session = result.first()
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No master session found. Please upload a document first."
            )
        await db_session.refresh(session, ['messages'])
        return session

    async def get_session_connections(
        self,
        user_id: UUID,
        db_session: AsyncSession,
    ):
        user = await db_session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        await db_session.refresh(user, ['visited_chats'])

        all_chats = user.visited_chats
        all_chats.sort(key=lambda x: x.updated_at, reverse=True)

        for chat in all_chats:
            await db_session.refresh(chat, ['messages', 'owner'])
        
        return all_chats

    async def get_total_chat_count(
        self,
        user_id: UUID,
        db_session: AsyncSession
    ) -> int:
        statement = select(ChatSession).where(
            ChatSession.user_id == user_id,
            ChatSession.visitor_id != None
        )
        result = await db_session.exec(statement)
        sessions = result.all()
        return len(sessions)

    async def get_weekly_chat_count(
        self,
        user_id: UUID,
        db_session: AsyncSession
    ) -> int:
        statement = select(ChatSession).where(
            ChatSession.user_id == user_id,
            ChatSession.visitor_id != None,
            ChatSession.created_at >= datetime.now() - timedelta(days=7)
        )
        result = await db_session.exec(statement)
        sessions = result.all()

        return len(sessions)

    def _format_time_difference(self, timestamp: datetime) -> str:
        if not timestamp:
            return "-"
            
        time_diff = datetime.now() - timestamp
        minutes = time_diff.total_seconds() / 60
        
        if minutes < 60:
            return f"{int(minutes)}min"
        else:
            hours = minutes / 60
            return f"{int(hours)}hr"

    async def get_recent_interactions(self, user_id: UUID, db_session: AsyncSession):
        latest_messages = (
            select(
                ChatMessage.session_id,
                ChatMessage.content,
                ChatMessage.created_at,
                func.row_number().over(
                    partition_by=ChatMessage.session_id,
                    order_by=ChatMessage.created_at.desc()
                ).label('msg_rank')
            ).where(ChatMessage.role == "user") .subquery()
        )

        # Get latest session for each visitor
        latest_visitor_sessions = (
            select(
                ChatSession.id,
                ChatSession.visitor_id,
                func.row_number().over(
                    partition_by=ChatSession.visitor_id,
                    order_by=ChatSession.updated_at.desc()
                ).label('session_rank')
            )
            .where(
                ChatSession.user_id == user_id,
                ChatSession.title != "Owner",
                ChatSession.visitor_id.is_(None) | (ChatSession.visitor_id != user_id)
            )
            .subquery()
        )

        statement = (
            select(
                ChatSession.id,
                ChatSession.title,
                ChatSession.created_at,
                ChatSession.updated_at,
                User.fullname.label('visitor_name'),
                User.profile_image.label('visitor_profile_image'),
                latest_messages.c.content.label('last_message'),
                latest_messages.c.created_at.label('last_message_created_at')
            )
            .join(latest_visitor_sessions, 
                  (ChatSession.id == latest_visitor_sessions.c.id) &
                  (latest_visitor_sessions.c.session_rank == 1))
            .join(User, ChatSession.visitor_id == User.id, isouter=True)
            .join(
                latest_messages,
                (latest_messages.c.session_id == ChatSession.id) &
                (latest_messages.c.msg_rank == 1),
                isouter=True
            )
            .order_by(ChatSession.updated_at.desc())
        )
        
        result = await db_session.exec(statement)
        rows = result.all()

        return [
            {
                "id": str(row.id),
                "title": row.title,
                "visitor_name": row.visitor_name or "Anonymous",
                "visitor_profile_image": row.visitor_profile_image or None,
                "last_message": row.last_message or "No messages yet",
                "created_at": row.created_at.isoformat(),
                "updated_at": row.updated_at.isoformat(),
                "last_message_created_at" : self._format_time_difference(row.last_message_created_at)
            }
            for row in rows[:4]
        ]