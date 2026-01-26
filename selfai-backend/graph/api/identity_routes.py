from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import json
from datetime import datetime, timezone

from core.auth.dependencies import get_current_user
from core.vector_store.vector_db import get_query_pinecone 
from graph.pipeline.embeddings import embed_query
from graph.pipeline.identity_answer import identity_answer_json

from graph.controllers.identity_controller import IdentityController

router = APIRouter(prefix="/identity", tags=["identity"])

class IdentityQueryRequest(BaseModel):
    question: str = Field(..., min_length=1)
    top_k: int = Field(default=8, ge=1, le=20)
    source_id: Optional[str] = None
    platform: Optional[str] = None  # e.g. "github"
    depth: str = Field(default="concise")  # "concise" | "detailed"

class IdentityBatchQueryRequest(BaseModel):
    questions: List[str] = Field(..., min_items=1, max_items=25)
    top_k: int = Field(default=8, ge=1, le=25)
    platform: Optional[str] = Field(default="github")
    source_id: Optional[str] = None
    concurrency: int = Field(default=1, ge=1, le=5)
    depth: str = Field(default="concise") 

class Citation(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    document_id: Optional[str] = None
    source_id: Optional[str] = None
    platform: Optional[str] = None
    score: Optional[float] = None


class IdentityQueryResponse(BaseModel):
    summary: str
    capabilities: List[str]
    evidence: List[Dict[str, Any]]
    citations: List[Citation]
    last_updated: str

@router.post("/query/batch")
async def identity_query_batch(req: IdentityBatchQueryRequest, current_user=Depends(get_current_user)):
    return await IdentityController.batch_query(
        user_id=current_user.id,
        questions=req.questions,
        top_k=req.top_k,
        platform=req.platform,
        source_id=req.source_id,
        concurrency=req.concurrency,
    )


def _build_context_from_matches(matches: list, max_chars: int = 12000) -> str:
    parts = []
    used = 0

    for m in matches:
        md = getattr(m, "metadata", None) or {}
        content = md.get("content") or ""
        if not content:
            continue

        title = md.get("title") or md.get("document_name") or ""
        url = md.get("url") or ""
        header = f"{title}\n{url}".strip()

        block = f"{header}\n\n{content}".strip() if header else content.strip()
        if used + len(block) > max_chars:
            break

        parts.append(block)
        used += len(block) + 2

    return "\n\n---\n\n".join(parts)

@router.post("/query", response_model=IdentityQueryResponse)
async def identity_query(body: IdentityQueryRequest, current_user=Depends(get_current_user)):
    namespace = str(current_user.id)

    # 🔒 hard safety filter (must match your upsert metadata)
    filter_: Dict[str, Any] = {"user_id": str(current_user.id)}
    if body.source_id:
        filter_["source_id"] = body.source_id
    if body.platform:
        filter_["platform"] = body.platform

    query_embedding = {"values": embed_query(body.question)}

    # This expects your upgraded get_query_pinecone signature.
    # If you haven't upgraded yet, do it (I gave that patch earlier).
    try:
        res = await get_query_pinecone(
            query_embedding,
            namespace,
            top_k=body.top_k,
            filter=filter_,
            include_metadata=True,
            include_values=False,
        )
    except TypeError:
        # Fallback if your get_query_pinecone is still old (no top_k/filter args)
        res = await get_query_pinecone(query_embedding, namespace)

    matches = getattr(res, "matches", []) or []
    context = _build_context_from_matches(matches)

    if not context.strip():
        return IdentityQueryResponse(
            summary="I don’t have enough indexed information to answer that yet. Please sync more sources (GitHub/Drive/uploads) and try again.",
            capabilities=[],
            evidence=[],
            citations=[],
            last_updated=datetime.now(timezone.utc).isoformat(),
        )

    # LLM returns a JSON string (we parse it)
    raw = await identity_answer_json(
        question=body.question,
        context=context,
        depth=body.depth,
    )

    try:
        parsed = json.loads(raw)
    except Exception:
        # Don’t fail the endpoint if model returns imperfect JSON
        parsed = {
            "summary": raw.strip(),
            "capabilities": [],
            "evidence": [],
        }

    # Citations from retrieval (trust layer)
    citations: List[Citation] = []
    for m in matches:
        md = getattr(m, "metadata", None) or {}
        citations.append(
            Citation(
                title=md.get("title"),
                url=md.get("url"),
                document_id=md.get("document_id"),
                source_id=md.get("source_id"),
                platform=md.get("platform"),
                score=getattr(m, "score", None),
            )
        )

    return IdentityQueryResponse(
        summary=parsed.get("summary", "").strip() or "No summary produced.",
        capabilities=parsed.get("capabilities", []) or [],
        evidence=parsed.get("evidence", []) or [],
        citations=citations[:10],
        last_updated=datetime.now(timezone.utc).isoformat(),
    )