from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from uuid import UUID
import secrets
from datetime import datetime, timedelta

from ..database.db import get_session
from ..auth.dependencies import AccessTokenBearer

from ..database.models import Widgets
from .service import WidgetService
from .schemas import (
    WidgetCreate,
    WidgetRead,
    WidgetUpdate,
    WidgetWithSession
)

widget_router = APIRouter()
widget_service = WidgetService()
strict_token_bearer = AccessTokenBearer(auto_error=True)

@widget_router.post("/", response_model=WidgetRead)
async def create_widget(
    widget_data: WidgetCreate,
    current_user: dict = Depends(strict_token_bearer),
    db_session: AsyncSession = Depends(get_session),
):
    """Create a new widget"""
    try:
        return await widget_service.create_widget(widget_data, current_user["user"]["id"], db_session)
    except Exception as e:
        await db_session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@widget_router.get("/", response_model=List[WidgetWithSession])
async def get_user_widgets(
    current_user: dict = Depends(strict_token_bearer),
    db_session: AsyncSession = Depends(get_session),
):
    """Get all widgets for current user"""
    try:
        return await widget_service.get_user_widgets(current_user["user"]["id"], db_session)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@widget_router.get("/{widget_id}", response_model=WidgetWithSession)
async def get_widget(
    widget_id: UUID,
    current_user: dict = Depends(strict_token_bearer),
    db_session: AsyncSession = Depends(get_session),
):
    """Get a specific widget"""
    try:
        return await widget_service.get_widget(widget_id, current_user["user"]["id"], db_session)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@widget_router.patch("/{widget_id}", response_model=WidgetRead)
async def update_widget(
    widget_id: UUID,
    widget_data: WidgetUpdate,
    current_user: dict = Depends(strict_token_bearer),
    db_session: AsyncSession = Depends(get_session),
):
    """Update widget settings"""
    try:
        return await widget_service.update_widget(widget_id, widget_data, current_user["user"]["id"], db_session)
    except HTTPException as he:
        await db_session.rollback()
        raise he
    except Exception as e:
        await db_session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@widget_router.delete("/{widget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_widget(
    widget_id: UUID,
    current_user: dict = Depends(strict_token_bearer),
    db_session: AsyncSession = Depends(get_session),
):
    """Delete a widget"""
    try:
        await widget_service.delete_widget(widget_id, current_user["user"]["id"], db_session)
    except HTTPException as he:
        await db_session.rollback()
        raise he
    except Exception as e:
        await db_session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@widget_router.post("/public/{share_token}/init")
async def initialize_widget_session(
    share_token: str,
    request: Request,
    db_session: AsyncSession = Depends(get_session),
):
    """Initialize or retrieve existing widget session"""
    try:
        visitor_id = request.client.host
        return await widget_service.initialize_widget_session(share_token, visitor_id, db_session)
    except HTTPException as he:
        await db_session.rollback()
        raise he
    except Exception as e:
        await db_session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )