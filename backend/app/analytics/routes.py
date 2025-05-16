from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from .schemas import HighlightResponseModel

from ..rag.service import RagService
from ..chat.service import ChatService
from .service import AnalyticsService
from ..auth.dependencies import AccessTokenBearer
from sqlmodel.ext.asyncio.session import AsyncSession
from ..database.db import get_session


analytics_router = APIRouter()
chat_service = ChatService()
document_service = RagService()
analytics_service = AnalyticsService()
access_token_bearer = AccessTokenBearer()

@analytics_router.get("/highlight", response_model=HighlightResponseModel)
async def get_contextual_highlight(
    current_user: dict = Depends(access_token_bearer),
    session: AsyncSession = Depends(get_session),
):
    user_id = current_user["user"]["id"]
    total_chats = await chat_service.get_total_chat_count(user_id, session)
    recent_chats = await chat_service.get_weekly_chat_count(user_id, session)
    document_count = await document_service.get_user_doc_count(user_id, session)

    highlight = await analytics_service.getHighlight(
        total_chats, recent_chats, document_count
    )

    response_data = HighlightResponseModel(
        label=highlight["label"],
        stat=highlight["stat"],
        description=highlight["description"]
    )

    response = JSONResponse(content=jsonable_encoder(response_data))
    return response
    
@analytics_router.get("/get-message-count")
async def get_message_count(
    current_user: dict = Depends(access_token_bearer),
    session: AsyncSession = Depends(get_session),
):

    user_id = current_user["user"]["id"]
    message_count = await chat_service.get_total_chat_count(user_id, session)
    return {"message_count": message_count}