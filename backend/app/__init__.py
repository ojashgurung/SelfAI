from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .auth.routes import auth_router
from .rag.routes import rag_router
from .user.routes import user_router
from .database.db import init_db
from .errors import register_all_errors

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up... Initializing database.")
    await init_db()  # Initialize the database on startup
    yield  # This allows the app to run
    print("Shutting down... Cleanup if necessary.")

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
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

register_all_errors(app)

app.include_router(auth_router, prefix=f"{version_prefix}/auth", tags=["auth"])
app.include_router(rag_router, prefix=f"{version_prefix}/rag", tags=["rag"])
app.include_router(user_router, prefix=f"{version_prefix}/user", tags=["user"])