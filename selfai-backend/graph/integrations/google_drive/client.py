from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

class GoogleDriveService:

    @staticmethod
    async def list_files(token_data: dict):
        """
        token_data = {
            "access_token": "...",
            "refresh_token": "...",
            "client_id": "...",
            "client_secret": "..."
        }
        """

        creds = Credentials(
            token=token_data["access_token"],
            refresh_token=token_data["refresh_token"],
            client_id=token_data["client_id"],
            client_secret=token_data["client_secret"],
            token_uri="https://oauth2.googleapis.com/token"
        )

        service = build("drive", "v3", credentials=creds)

        results = service.files().list(
            pageSize=50,
            fields="files(id, name, mimeType, size, modifiedTime)"
        ).execute()

        return results.get("files", [])