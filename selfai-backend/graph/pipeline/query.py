from typing import Any, Dict, List, Optional
from graph.pipeline.embeddings import embed_query
from core.vector_store.vector_db import get_query_pinecone  # uses your existing pinecone wrapper


def build_context(matches: List[Dict[str, Any]], max_chars: int = 12000) -> str:
    parts = []
    used = 0

    for m in matches:
        md = (m.get("metadata") or {})
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


async def retrieve_matches(
    *,
    question: str,
    namespace: str,
    top_k: int = 8,
    filter_: Optional[Dict[str, Any]] = None,
):
    qvec = embed_query(question)

    # 🔥 This depends on how your get_query_pinecone is written.
    # If your current version only accepts {"values": ...} then we pass that.
    payload = {"values": qvec, "top_k": top_k, "filter": filter_}

    return await get_query_pinecone(payload, namespace)