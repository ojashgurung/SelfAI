from fastapi import FastAPI
from .auth.routes import auth_router

version = "v1"

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

version_prefix =f"/api/{version}"

app = FastAPI(
    title="SelfAI",
    description=description,
    version=version,
    contact={
        "name": "Ojash Gurung",
        "url": "https://github.com/ojasggg",
        "email":"gurungojash0@gmail.com",
        "website": "https://ojashgurung.com.np"
    },
)

app.include_router(auth_router, prefix=f"{version_prefix}/auth", tags=["auth"])