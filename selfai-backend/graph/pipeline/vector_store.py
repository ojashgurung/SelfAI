from typing import Any, Dict, List
from core.vector_store.vector_db import upsert_to_pinecone  # reuse your existing pinecone wrapper

async def upsert_document_vectors(
    *,
    namespace: str,
    document_id: str,
    chunks: List[str],
    vectors: List[List[float]],
    metadata_base: Dict[str, Any],
):
    items = []
    for i, (chunk, vec) in enumerate(zip(chunks, vectors)):
        items.append({
            "id": f"{document_id}:{i}",  # deterministic
            "values": vec,
            "metadata": {
                **metadata_base,
                "chunk_index": i,
                "content": chunk,
            }
        })
    await upsert_to_pinecone(items, namespace)
    return len(items)