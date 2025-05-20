from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from ..user.service import UserService

from .schemas import (
    HighlightResponseModel,
    MetricsSummaryQueries,
    MetricsSummaryResponseModel,
    MetricsSummaryVisitors
)

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

@analytics_router.get("/metrics/summary", response_model=MetricsSummaryResponseModel)
async def get_summary_metrics(
    current_user: dict = Depends(access_token_bearer),
    session : AsyncSession = Depends(get_session)
):
    now = datetime.now()
    user_id = current_user["user"]["id"]
    
    last_login_date = await user_service.get_user_last_login(user_id, session)
    window_size = now - last_login_date

    previous_start = last_login_date - window_size
    previous_end = last_login_date

    new_queries = await analytics_service.count_user_queries(user_id, last_login_date, now, session)
    old_queries = await analytics_service.count_user_queries(user_id, previous_start, previous_end, session)

    new_visitors = await analytics_service.count_unique_visitors(user_id, last_login_date, now, session)
    old_visitors = await analytics_service.count_unique_visitors(user_id, previous_start, previous_end, session)
    
    total_user_queries = await analytics_service.count_total_user_queries(user_id, session)
    total_unique_visitors = await analytics_service.count_total_unique_visitors(user_id, session)

    def growth(new, old) -> int:
        if old == 0:
            return 0
        return round(((new - old)/ old) * 100)
    
    queries_growth = growth(new_queries, old_queries)
    visitors_growth = growth(new_visitors, old_visitors)
    
    response_data = MetricsSummaryResponseModel(
        queries = MetricsSummaryQueries(
            total_queries= total_user_queries,
            current= new_queries,
            previous= old_queries,
            growth= queries_growth
        ),
        visitors = MetricsSummaryVisitors(
            total_visitors= total_unique_visitors,
            current= new_visitors,
            previous= old_visitors,
            growth= visitors_growth
        ),
        since= last_login_date
    )

    response = JSONResponse(content=jsonable_encoder(response_data))
    return response

@analytics_router.get("/metrics/trend")
async def get_trend_metrics(
    current_user: dict = Depends(access_token_bearer),
    period: str = Query("week", enum=["week", "month", "year"]),
    session : AsyncSession = Depends(get_session)
): 
    user_id = current_user["user"]["id"]
    now = datetime.now()

    start_date = {
        "week": now - timedelta(days=7),
        "month": now - timedelta(days=30),
        "year": now - timedelta(days=365)
    }[period]

    trend_data = await analytics_service.get_trend_metrics(user_id, start_date, now, session, period)
    response = JSONResponse(content=jsonable_encoder(trend_data))
    return response


@analytics_router.get("/metrics/average-response-time")
async def get_average_response_time(
    current_user: dict = Depends(access_token_bearer),
    session : AsyncSession = Depends(get_session)
): 
    user_id = current_user["user"]["id"]
    average_response_time = await analytics_service.get_average_response_time(user_id, session)
    response = JSONResponse(content=jsonable_encoder(average_response_time))
    return response
