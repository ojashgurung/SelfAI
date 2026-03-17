from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
import asyncio

from core.auth.dependencies import get_current_user
from graph.pipeline.embeddings import embed_query
from core.vector_store.vector_db import get_query_pinecone
from graph.pipeline.answer import answer_with_context, answer_without_context
from graph.utils.build_context import build_context

router = APIRouter(prefix="/compare", tags=["graph-compare"])

class CompareRequest(BaseModel):
    question: str = Field(..., min_length=1)
    top_k: int = Field(default=8, ge=1, le=20)
    model: str = Field(default="gpt-4o")

@router.post("")
async def compare_selfai(body: CompareRequest, current_user=Depends(get_current_user)):
    namespace = str(current_user.id)
    filter_ = {"user_id": str(current_user.id)}

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

    # Run both in parallel
    generic_task = answer_without_context(
        question=body.question,
        model_name=body.model
    )
    personalized_task = answer_with_context(
        context=context,
        question=body.question,
        model_name=body.model
    )

    generic, personalized = await asyncio.gather(generic_task, personalized_task)

    return {
        "question": body.question,
        "model": body.model,
        "without_selfai": generic,
        "with_selfai": personalized,
    }
