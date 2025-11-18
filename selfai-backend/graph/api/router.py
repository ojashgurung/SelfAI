from fastapi import APIRouter

from .health_routes import router as health_router 
from .ingest_routes import router as ingest_router
from .view_routes import router as view_router
from .integrations_routes import router as integration_router

graph_router = APIRouter()

graph_router.include_router(view_router)
graph_router.include_router(ingest_router)
graph_router.include_router(health_router)
graph_router.include_router(integration_router)
