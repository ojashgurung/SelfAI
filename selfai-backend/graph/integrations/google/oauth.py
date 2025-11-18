from authlib.integrations.starlette_client import OAuth
from core.config import Config

oauth = OAuth()

oauth.register(
    name="google_drive",
    client_id=Config.GOOGLE_CLIENT_ID,
    client_secret=Config.GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        'scope': 'openid email profile https://www.googleapis.com/auth/drive.readonly',
        'access_type': 'offline',
        'prompt': 'consent'
    },
)