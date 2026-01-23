from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from core.auth.dependencies import get_current_user
from graph.pipeline.embeddings import embed_query
from core.vector_store.vector_db import get_query_pinecone
from graph.pipeline.answer import answer_with_context


router = APIRouter(prefix="/query", tags=["graph-query"])


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1)
    top_k: int = Field(default=8, ge=1, le=20)
    source_id: str | None = None

def build_context(matches, max_chars: int = 12000) -> str:
    parts = []
    used = 0

    for m in matches:
        md = m.metadata or {}
        chunk = md.get("content") or ""
        if not chunk:
            continue

        title = md.get("title") or md.get("document_name") or ""
        url = md.get("url") or ""
        header = f"{title}\n{url}".strip()

        block = f"{header}\n\n{chunk}".strip() if header else chunk.strip()

        if used + len(block) > max_chars:
            break

        parts.append(block)
        used += len(block) + 2

    return "\n\n---\n\n".join(parts)    


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

    answer = await answer_with_context(context=context, question=body.question)

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