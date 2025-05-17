from .schemas import (
    HighlightResponseModel,
    ProfileCompletionResponseModel,
    ProfileCompletionSectionModel
    )

from ..user.schemas import (
    UserResponse,
)

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
        
        