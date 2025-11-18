from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["graph-health"])

@router.get("/")
def health_check():
    return {"route":"/graph/health", "status": "health OK"}
