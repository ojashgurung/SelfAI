from fastapi import HTTPException, status
from sqlmodel import select, join
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta

from ..database.models import ChatSession, Widget
from .schemas import (
    WidgetCreate,
    WidgetRead,
    WidgetUpdate,
)
from ..rag.service import RagService
from ..chat.service import ChatService

chat_service = ChatService()

class WidgetService:
    async def get_widget(self, widget_id: UUID, user_id: UUID, db_session: AsyncSession) -> Optional[Widget]:
        widget = await db_session.get(Widget, widget_id)
        if not widget or str(widget.user_id) != str(user_id):
            raise HTTPException(status_code=404, detail="Widget not found")
        return widget
    
    
    async def get_public_widget(self, widget_id: UUID, db_session: AsyncSession) -> Optional[Widget]:
        """Get widget by share token"""
        result = await db_session.exec(select(Widget).where(Widget.id == widget_id))
        widget = result.first()
        
        if not widget:
            raise HTTPException(status_code=404, detail="Widget not found or expired")
        return widget
    
    async def create_widget(self, widget_data: WidgetCreate, user_id: UUID, db_session: AsyncSession) -> Widget:
        """Create a new widget"""
        existing_widget = await db_session.exec(
            select(Widget).where(Widget.user_id == user_id)
        )

        existing_widget = existing_widget.first()

        if existing_widget:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already has a widget configured"
            )

        session = await chat_service.get_master_session(user_id, user_id, db_session)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Master session not found. Please create a chat session first."
            )

        widget = Widget(
            user_id=user_id,
            session_id=session.id,
            share_token=session.share_token,
            is_active=True,
            expires_at=datetime.utcnow() + timedelta(days=30),
            **widget_data.model_dump(exclude={'share_token'})
        )
        db_session.add(widget)
        await db_session.commit()
        await db_session.refresh(widget)
        return widget
    
    async def get_user_widgets(self, user_id: UUID, db_session: AsyncSession) -> List[Widget]:
        """Get all Widget for a user"""

        statement = (
            select(Widget)
            .where(Widget.user_id == user_id)
        )
        result = await db_session.exec(statement)
        return result.all()
    
    async def get_user_widget_count(self, user_id: UUID, db_session: AsyncSession) -> int:
        """Get the count of Widget for a user"""
        statement = (
            select(Widget)
            .where(Widget.user_id == user_id)
        )
        result = await db_session.exec(statement)
        Widget = result.all()
        return len(Widget)

    
    async def update_widget(self, widget_id: UUID, widget_data: WidgetUpdate, user_id: UUID, db_session: AsyncSession) -> Widget:
        """Update widget settings"""
        widget = await self.get_widget(widget_id, user_id, db_session)
        
        for field, value in widget_data.dict(exclude_unset=True).items():
            setattr(widget, field, value)
        
        db_session.add(widget)
        await db_session.commit()
        await db_session.refresh(widget)
        return widget

    async def delete_widget(self, widget_id: UUID, user_id: UUID, db_session: AsyncSession) -> None:
        """Delete a widget"""
        widget = await self.get_widget(widget_id, user_id, db_session)
        await db_session.delete(widget)
        await db_session.commit()

    async def initialize_widget_session(
        self, 
        share_token: str, 
        visitor_id: str,
        db_session: AsyncSession
    ) -> dict:
        """Initialize or retrieve existing widget session"""
        widget = await self.get_widget_by_token(share_token, db_session)
        
        template_session = await db_session.get(ChatSession, widget.session_id)
        if not template_session:
            raise HTTPException(status_code=404, detail="Template session not found")

        # Check for existing visitor session
        existing_session = await db_session.query(ChatSession).filter(
            ChatSession.parent_id == template_session.id,
            ChatSession.visitor_id == visitor_id
        ).first()

        if not existing_session:
            visitor_session = ChatSession(
                parent_id=template_session.id,
                namespace=template_session.namespace,
                title=f"Widget Chat {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}",
                is_public=True,
                visitor_id=visitor_id
            )
            db_session.add(visitor_session)
            await db_session.commit()
            await db_session.refresh(visitor_session)
        else:
            visitor_session = existing_session

        return {
            "widget_id": widget.id,
            "session_id": visitor_session.id,
            "is_new_session": not existing_session,
            "config": {
                "theme": widget.theme,
                "color": widget.color,
                "heading": widget.heading,
                "title": widget.title,
                "subtitle": widget.subtitle,
                "prompts": widget.prompts
            }
        }