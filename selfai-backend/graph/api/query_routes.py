from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from core.auth.dependencies import get_current_user
from graph.pipeline.embeddings import embed_query
from core.vector_store.vector_db import get_query_pinecone
from graph.pipeline.answer import answer_with_context
from graph.utils.build_context import build_context


router = APIRouter(prefix="/query", tags=["graph-query"])


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1)
    top_k: int = Field(default=8, ge=1, le=20)
    source_id: str | None = None
    model: str = Field(default="gpt-4o")


@router.post("")
async def query_selfai(body: QueryRequest, current_user=Depends(get_current_user)):
    namespace = str(current_user.id)

    # 🔒 Always filter by user_id to prevent cross-user leakage
    filter_ = {"user_id": str(current_user.id)}
    if body.source_id:
        filter_["source_id"] = body.source_id

    qvec = {"values": embed_query(body.question)}

    result = await get_query_pinecone(
        qvec,
        namespace,
        top_k=body.top_k,
        filter=filter_,
        include_metadata=True,
        include_values=False,
    )

    matches = getattr(result, "matches", []) or []
    context = build_context(matches)

    if not context.strip():
        return {
            "answer": "I couldn’t find relevant information in your connected data yet. Try syncing more sources or ask something more specific.",
            "matches": [],
        }

    answer = await answer_with_context(context=context, question=body.question, model_name=body.model)

    return {
        "answer": answer,
        "matches": [
            {
                "score": m.score,
                "title": (m.metadata or {}).get("title"),
                "url": (m.metadata or {}).get("url"),
                "document_id": (m.metadata or {}).get("document_id"),
                "chunk_index": (m.metadata or {}).get("chunk_index"),
                "source_id": (m.metadata or {}).get("source_id"),
            }
            for m in matches
        ],
    }