from typing import Optional, Dict, Any, List
from datetime import datetime, timezone

from langchain_openai import ChatOpenAI

from graph.pipeline.embeddings import embed_query
from core.vector_store.vector_db import get_query_pinecone
from graph.pipeline.identity_answer import identity_answer_json

def utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

class IdentityService:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

    async def answer_one(
        self,
        *,
        user_id,
        question: str,
        top_k: int = 8,
        platform: Optional[str] = "github",
        source_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        namespace = str(user_id)

        # 1) embed query
        qvec = {"values": embed_query(question)}

        # 2) apply strict filter (prevents чужие repos)
        f: Dict[str, Any] = {}
        if platform:
            f["platform"] = platform
        if source_id:
            f["source_id"] = str(source_id)

        # 3) query pinecone
        res = await get_query_pinecone(
            qvec,
            namespace,
            top_k=top_k,
            filter=f if f else None,
            include_metadata=True,
            include_values=False,
        )

        matches = getattr(res, "matches", None) or res.get("matches", [])
        contexts: List[str] = []
        citations: List[Dict[str, Any]] = []

        seen = set()  # de-dupe citations
        for m in matches:
            md = m.metadata if hasattr(m, "metadata") else (m.get("metadata") or {})
            content = md.get("content") or ""
            if content:
                contexts.append(content)

            key = (md.get("document_id"), md.get("external_id"), md.get("chunk_id"))
            if key in seen:
                continue
            seen.add(key)

            citations.append({
                "title": md.get("title"),
                "url": md.get("url"),
                "document_id": md.get("document_id"),
                "source_id": md.get("source_id"),
                "platform": md.get("platform"),
                "external_id": md.get("external_id"),
                "score": float(m.score) if hasattr(m, "score") else float(m.get("score", 0)),
            })

        context_text = "\n\n---\n\n".join(contexts[:top_k]) if contexts else ""

        # 4) Let identity_answer produce structured JSON
        answer_obj = await identity_answer_json(
            question=question,
            context=context_text,
        )

        return {
            "question": question,
            **answer_obj,          # summary/capabilities/evidence
            "citations": citations, # your retrieval citations (ground truth)
            "last_updated": utcnow_iso(),
        }