from fastapi import APIRouter

from .ingest_routes import router as ingest_router
from .view_routes import router as view_router
from graph.integrations.github.routes import router as github_router
from graph.api.ingest_routes import router as ingest_router
from graph.api.connections_routes import router as connections_router
from graph.api.documents_routes import router as documents_router
from graph.api.sources_routes import router as sources_router
from graph.api.query_routes import router as query_router
from graph.api.compare_models_routes import router as compare_models_router

graph_router = APIRouter()

graph_router.include_router(view_router)
graph_router.include_router(ingest_router)
graph_router.include_router(github_router)
graph_router.include_router(connections_router)
graph_router.include_router(documents_router)
graph_router.include_router(sources_router)
graph_router.include_router(query_router)
graph_router.include_router(compare_models_router)
