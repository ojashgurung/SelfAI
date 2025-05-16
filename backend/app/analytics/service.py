from .schemas import HighlightResponseModel

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