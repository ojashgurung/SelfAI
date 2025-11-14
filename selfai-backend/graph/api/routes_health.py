from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["graph-health"])

@router.get("/")
def graph_health():
    return {"status": "graph OK"}
