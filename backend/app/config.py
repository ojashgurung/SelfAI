from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
import os

# Only load .env file in development (when not in production environment)
if os.getenv("ENVIRONMENT") != "prod":
    env_file_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
    if os.path.exists(env_file_path):
        load_dotenv(dotenv_path=env_file_path)

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str
    PINECONE_API_KEY : str
    FRONTEND_ORIGINS: List[str]
    FRONTEND_URL: str
    BACKEND_URL: str
    OPENAI_API_KEY: str
    ENVIRONMENT: str = "dev"
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    SESSION_SECRET_KEY: str
    VECTOR_DB_INDEX_NAME: str
    
    model_config = SettingsConfigDict(
        env_file="../../.env" if os.getenv("ENVIRONMENT") != "prod" else None,
        extra="ignore"
    )


Config = Settings()

# JWT_ALGORITHM: str
    # REDIS_URL: str = "redis://localhost:6379/0"
    # MAIL_USERNAME: str
    # MAIL_PASSWORD: str
    # MAIL_FROM: str
    # MAIL_PORT: int
    # MAIL_SERVER: str
    # MAIL_FROM_NAME: str
    # MAIL_STARTTLS: bool = True
    # MAIL_SSL_TLS: bool = False
    # USE_CREDENTIALS: bool = True
    # VALIDATE_CERTS: bool = True