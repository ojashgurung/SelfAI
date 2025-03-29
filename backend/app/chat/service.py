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
            is_public=session_data.is_public
        )
        
        db_session.add(chat_session)
        await db_session.commit()  # ✅ Commit before returning
        await db_session.refresh(chat_session, ['messages']) # ✅ Ensure it's refreshed

        return chat_session 

    # async def get_user_sessions(
    #     self,
    #     user_id: UUID,
    #     db: AsyncSession
    # ) -> List[ChatSessions]:
    #     statement = select(ChatSessions).where(
    #         (ChatSessions.user_id == user_id) | 
    #         (ChatSessions.visitor_id == user_id)
    #     )
    #     result = await self.db.execute(statement)
    #     return result.scalars().all()

    async def get_session(
        self,
        session_id: UUID,
        db_session: AsyncSession
    ) -> Optional[ChatSessions]:
        statement = select(ChatSessions).where(ChatSessions.id == session_id)
        result = await db_session.execute(statement)
        session = result.scalar_one_or_none()
        if session:
            await db_session.refresh(session, ['messages'])
        return session

    async def get_session_by_token(
        self,
        token: str,
        db_session: AsyncSession
    ) -> Optional[ChatSessions]:
        statement = select(ChatSessions).where(ChatSessions.share_token == token, ChatSessions.is_public == True)
        result = await db_session.execute(statement)
        session = result.scalar_one_or_none()
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
            result = await db_session.execute(statement)
            session = result.scalar_one_or_none()

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
                visitor_id=visitor_uuid
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
        user_id : UUID,
        rag_service: RagService,
        db_session: AsyncSession
    ) -> ChatMessages:
        # Get chat session
        session = await self.get_session(session_id, db_session)
        if not session:
            raise ValueError("Chat session not found")


        if not session.is_public and str(user_id) != str(session.user_id):  
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this chat"
            )
        # Save user message
        user_message = ChatMessages(
            session_id=session_id,
            role="user",
            user_id=user_id,
            content=message_data.content
        )
        db_session.add(user_message)

        # Get AI response using RAG
        response = await rag_service.handle_query(message_data.content, session.namespace)
        if response:
            retrieve_text = await rag_service.handle_answer(response)
            ai_response = await rag_service.query_llm(retrieve_text, message_data.content)
        else:
            ai_response = "I couldn't find relevant information to answer your question."
        
        # Create AI response
        ai_message = ChatMessages(
            session_id=session_id,
            role="assistant",
            content=ai_response
        )
        db_session.add(ai_message)

        await db_session.commit()
        await db_session.refresh(ai_message)
        return ai_message

    # async def update_session(
    #     self,
    #     session_id: UUID,
    #     update_data: ChatSessionUpdate,
    #     current_user: Users,
    #     db: AsyncSession
    # ) -> Optional[ChatSessions]:
    #     session = await self.get_session(session_id, db)
    #     if not session or session.user_id != current_user.uuid:
    #         return None

    #     for field, value in update_data.dict(exclude_unset=True).items():
    #         setattr(session, field, value)

    #     self.db.add(session)
    #     await self.db.commit()
    #     await self.db.refresh(session)
    #     return session

    
    # async def delete_session(
    #     self,
    #     session_id: UUID,
    #     current_user: Users,
    #     db: AsyncSession
    # ) -> bool:
    #     session = await self.get_session(session_id, db)
    #     if not session or session.user_id != current_user.uuid:
    #         return False

    #     await db.delete(session)
    #     await db.commit()
    #     return True


    