from fastapi import APIRouter

from .health_routes import router as health_router 
from .ingest_routes import router as ingest_router
from .view_routes import router as view_router
from graph.integrations.github.routes import router as github_router
from graph.api.ingest_routes import router as ingest_router
from graph.api.connections_routes import router as connections_router
from graph.api.documents_routes import router as documents_router
from graph.api.sources_routes import router as sources_router

graph_router = APIRouter()

graph_router.include_router(view_router)
graph_router.include_router(ingest_router)
graph_router.include_router(health_router)
graph_router.include_router(github_router)
graph_router.include_router(connections_router)
graph_router.include_router(documents_router)
graph_router.include_router(sources_router)
