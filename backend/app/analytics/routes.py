from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from ..user.service import UserService

from .schemas import HighlightResponseModel

from ..rag.service import RagService
from ..chat.service import ChatService
from ..user.service import UserService
from .service import AnalyticsService
from ..auth.dependencies import AccessTokenBearer
from sqlmodel.ext.asyncio.session import AsyncSession
from ..database.db import get_session


analytics_router = APIRouter()
chat_service = ChatService()
document_service = RagService()
analytics_service = AnalyticsService()
user_service = UserService()
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
    

@analytics_router.get("/profile-completion")
async def get_profile_completion(
    current_user: dict = Depends(access_token_bearer),
    session: AsyncSession = Depends(get_session),
):
    user_id = current_user["user"]["id"]
    user_profile = await user_service.get_user(user_id, session)
    
    profile_completion_data = await analytics_service.getProfileCompletion(user_profile)

    response = JSONResponse(content=jsonable_encoder(profile_completion_data))  
    return response

