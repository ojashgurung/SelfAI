from uuid import UUID
from datetime import datetime, timedelta

from sqlmodel.ext.asyncio.session import AsyncSession

from .schemas import (
    HighlightResponseModel,
    ProfileCompletionResponseModel,
    ProfileCompletionSectionModel
    )

from ..user.schemas import (
    UserResponse,
)

from ..database.models import (
    ChatMessage, 
    ChatSession, 
)

from sqlmodel import distinct, select, between, func


class AnalyticsService:
    async def getHighlight(self, total_chats: int, recent_chats: int, document_count: int) -> HighlightResponseModel:
        if total_chats == 0 and document_count == 0:
            return {
                "label": "Welcome",
                "stat": "",
                "description": "Welcome to SelfAI! Start by uploading a document to train your chatbot."
            }
        elif document_count > 0 and total_chats == 0:
            return {
                "label": "Ready to Chat",
                "stat": document_count,
                "description": f"You've uploaded {document_count} document{'s' if document_count > 1 else ''}. Try chatting with your AI now!"
            }
        elif total_chats > 0 and total_chats < 100:
            return {
                "label": "Progress",
                "stat": total_chats,
                "description": f"Your chatbot has answered {total_chats} queries so far — great start!"
            }
        elif total_chats >= 100:
            return {
                "label": "Milestone",
                "stat": total_chats,
                "description": f"🎉 Congrats! Your chatbot has answered over {total_chats} queries!"
            }
        elif recent_chats == 0:
            return {
                "label": "Boost Engagement",
                "stat": "",
                "description": "It’s been quiet lately. Share your widget or upload new content to re-engage."
            }
        else:
            return {
                "label": "Stats",
                "stat": recent_chats,
                "description": f"{recent_chats} queries answered this week. Keep it growing!"
            }
    
    async def getProfileCompletion(self, user_profile: UserResponse) -> ProfileCompletionResponseModel:
        REQ_DOCUMENT_COUNT = 3
        REQ_WIDGET_COUNT = 1
        REQ_PROFILE_FIELD_COUNT = 4
        DOCUMENT_TOTAL_PERCENT = 42
        PROFILE_TOTAL_PERCENT = 34
        WIDGET_TOTAL_PERCENT = 24

        widget_count = len(user_profile.widgets)
        document_count = len(user_profile.documents)
        profile_fields = [user_profile.personal_bio, user_profile.linkedin_url, user_profile.github_url, user_profile.profile_image]
        profile_fields_count = sum(1 for field in profile_fields if field is not None)
        
        widget_percent = float(widget_count/REQ_WIDGET_COUNT)
        document_percent = float(document_count/REQ_DOCUMENT_COUNT)
        profile_percent = float(profile_fields_count/REQ_PROFILE_FIELD_COUNT)
        total_percent = widget_percent * WIDGET_TOTAL_PERCENT + document_percent * DOCUMENT_TOTAL_PERCENT + profile_percent * PROFILE_TOTAL_PERCENT

        sections = []

        sections.append(ProfileCompletionSectionModel(
                    label="Uploaded Documents",
                    percent=document_percent * 100,
                ))
        
          
        sections.append(ProfileCompletionSectionModel(
                    label="Profile",
                    percent=profile_percent * 100,
                ))
        
        sections.append(ProfileCompletionSectionModel(
                    label="Widgets",
                    percent=widget_percent * 100,
                ))

        response = ProfileCompletionResponseModel(
            completion_score=float(total_percent),
            sections = sections
        )

        return response
    
    @staticmethod
    async def count_user_queries(user_id: UUID, start: datetime, end: datetime, db_session: AsyncSession):
        stmt = (
            select(func.count())
            .select_from(ChatMessage)
            .join(ChatSession, ChatMessage.session_id == ChatSession.id)
            .where(
                ChatSession.user_id == user_id,
                ChatSession.title != "Owner",
                ChatSession.visitor_id.is_(None) | (ChatSession.visitor_id != user_id),
                ChatMessage.role == "assistant",
                ChatMessage.created_at.between(start, end)
            )
        )
        result = await db_session.exec(stmt)
        return result.first()
    
    @staticmethod
    async def count_unique_visitors(user_id: UUID, start: datetime, end: datetime, db_session: AsyncSession):
        statement = (
            select(func.count())
            .select_from(ChatSession)
            .where(
                ChatSession.user_id == user_id,
                ChatSession.title != "Owner",
                ChatSession.visitor_id.is_(None) | (ChatSession.visitor_id != user_id),
                ChatSession.created_at.between(start, end)
            )
        )

        result = await db_session.exec(statement)
        return result.first()

    @staticmethod
    async def count_total_user_queries(user_id: UUID, db_session: AsyncSession):
        stmt = (
            select(func.count())
            .select_from(ChatMessage)
            .join(ChatSession, ChatMessage.session_id == ChatSession.id)
            .where(
                ChatSession.user_id == user_id,
                ChatSession.title != "Owner",
                ChatSession.visitor_id.is_(None) | (ChatSession.visitor_id != user_id),
                ChatMessage.role == "assistant",
            )
        )
        result = await db_session.exec(stmt)
        return result.first()

    @staticmethod
    async def count_total_unique_visitors(user_id: UUID, db_session: AsyncSession):
        statement = (
            select(func.count())
            .select_from(ChatSession)
            .where(
                ChatSession.user_id == user_id,
                ChatSession.title != "Owner",
                ChatSession.visitor_id.is_(None) | (ChatSession.visitor_id != user_id),
            )
        )

        result = await db_session.exec(statement)
        return result.first()

    @staticmethod
    async def get_trend_metrics(user_id: UUID, start_date: datetime, end_date: datetime, db_session: AsyncSession, period: str = "week"):
        dates = []
        current = start_date
        if period == "week":
            # Daily data for week view
            while current <= end_date:
                dates.append(current)
                current += timedelta(days=1)
            
            daily_data = []
            for date in dates:
                next_date = date + timedelta(days=1)
                count = await AnalyticsService.count_user_queries(user_id, date, next_date, db_session)
                daily_data.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "visitors": count
                })
            data = daily_data
            
        elif period == "month":
            # Weekly data for month view
            while current <= end_date:
                dates.append(current)
                current += timedelta(days=7)
            
            weekly_data = []
            for date in dates:
                next_date = date + timedelta(days=7)
                count = await AnalyticsService.count_user_queries(user_id, date, next_date, db_session)
                weekly_data.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "visitors": count
                })
            data = weekly_data
            
        else:  # year
            # Monthly data for year view
            while current <= end_date:
                dates.append(current)
                current += timedelta(days=30)  # Approximate month
            
            monthly_data = []
            for date in dates:
                next_date = date + timedelta(days=30)
                count = await AnalyticsService.count_user_queries(user_id, date, next_date, db_session)
                monthly_data.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "visitors": count
                })
            data = monthly_data

        visitor_counts = [day["visitors"] for day in data]
        response = {
            "min_count": min(visitor_counts) if visitor_counts else 0,
            "max_count": max(visitor_counts) if visitor_counts else 0,
            "data" : data,
            "period" : {
                "start" : start_date.isoformat(),
                "end" : end_date.isoformat()
            }
        }

        return response
    
    @staticmethod
    async def get_average_response_time(user_id: UUID, db_session: AsyncSession):
        messages_subquery = (
            select(
                ChatMessage.session_id,
                ChatMessage.created_at,
                ChatMessage.role,
                func.lag(ChatMessage.created_at).over(
                    partition_by=ChatMessage.session_id,
                    order_by=ChatMessage.created_at
                ).label('prev_time'),
                func.lag(ChatMessage.role).over(
                    partition_by=ChatMessage.session_id,
                    order_by=ChatMessage.created_at
                ).label('prev_role')
            )
            .select_from(ChatMessage)
            .join(ChatSession, ChatMessage.session_id == ChatSession.id)
            .where(
                ChatSession.user_id == user_id,
                ChatSession.title != "Owner",
                (ChatSession.visitor_id.is_(None)) | (ChatSession.visitor_id != user_id)
            )
            .subquery()
        )

        stmt = (
            select(func.avg(
                func.extract('epoch', messages_subquery.c.created_at) - 
                func.extract('epoch', messages_subquery.c.prev_time)
            ))
            .select_from(messages_subquery)
            .where(
                messages_subquery.c.role == "assistant",
                messages_subquery.c.prev_role == "user",
                messages_subquery.c.prev_time != None
            )
        )

        result = await db_session.exec(stmt)
        average_time = result.first()

        if average_time is None:
            return 0
        
        return round(float(average_time), 2)


        
        