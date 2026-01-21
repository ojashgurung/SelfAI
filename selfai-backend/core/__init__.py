from .config import Config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .database.db import get_session
from contextlib import asynccontextmanager
from .auth.routes import auth_router
from .auth.seed import seed_dev_user
from .rag.routes import rag_router
from .user.routes import user_router
from .chat.routes import chat_router
from .widget.routes import widget_router
from .analytics.routes import analytics_router
from .database.db import init_db
from .errors import register_all_errors
from graph.api.router import graph_router
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting up... Initializing database.")
    await init_db()  # Initialize the database on startup

    print("🌱 Attempting to seed dev user...")
    async for session in get_session():
        await seed_dev_user(session)
        break
    print("✅ Startup complete.")

    yield  # This allows the app to run
    print("🛑 Shutting down... Cleanup if necessary.")

api_version = "v1"

description = """
A REST API for personal RAG application which knows you better than you.

This REST API is able to;
- Create Read Update And delete Users
- Generate Personal Knowledged RAG from
    - Personal Bio
    - LinkedIn
    - GitHub
- Select RAG features
- Premium Users role to get premium features and many more e.t.c
"""

version_prefix =f"/api/{api_version}"

app = FastAPI(
    title="SelfAI",
    description=description,
    version=api_version,
    contact={
        "name": "Ojash Gurung",
        "url": "https://ojashgurung.com.np",
        "email":"gurungojash0@gmail.com",
    },
    lifespan= lifespan
)

app.add_middleware(
    SessionMiddleware,
    secret_key=Config.SESSION_SECRET_KEY 
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.FRONTEND_ORIGINS,
    allow_origin_regex="https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

register_all_errors(app)

app.include_router(auth_router, prefix=f"{version_prefix}/auth", tags=["auth"])
app.include_router(rag_router, prefix=f"{version_prefix}/rag", tags=["rag"])
app.include_router(user_router, prefix=f"{version_prefix}/user", tags=["user"])
app.include_router(chat_router, prefix=f"{version_prefix}/chat", tags=["chat"])
app.include_router(widget_router, prefix=f"{version_prefix}/widget", tags=["widget"])
app.include_router(analytics_router, prefix=f"{version_prefix}/analytics", tags=["analytics"])
app.include_router(graph_router, prefix=f"{version_prefix}/graph", tags=["graph"])
