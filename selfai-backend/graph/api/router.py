from fastapi import APIRouter

from .health_routes import router as health_router 
from .ingest_routes import router as ingest_router
from .view_routes import router as view_router
from graph.integrations.github.routes import router as github_router

graph_router = APIRouter()

graph_router.include_router(view_router)
graph_router.include_router(ingest_router)
graph_router.include_router(health_router)
graph_router.include_router(github_router)
