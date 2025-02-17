from ..config import Config
from typing import List
import asyncio

from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec

INDEX_NAME = "selfai"
pc = Pinecone(api_key=Config.PINECONE_API_KEY)

def get_pinecone_index():
    """Ensures the index exists and returns a Pinecone index instance."""
    if not pc.has_index(INDEX_NAME):
        pc.create_index(
            name=INDEX_NAME,
            dimension=768,
            metric="cosine",
            spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        ),
        deletion_protection="disabled",
        tags={
            "environment": "development"
        }
    )

        print(f"Index {INDEX_NAME} has been created.")
    else:
        print(f"Index {INDEX_NAME} already exists.")

    # Return the index instance
    return pc.Index(INDEX_NAME)


async def upsert_to_pinecone(embeddings: List[dict], namespace: str):
    try:
        index = get_pinecone_index()
        inserted_ids = [vector["id"] for vector in embeddings]
        index.upsert(vectors=embeddings, namespace=namespace)
        return {"status": "success", "inserted_ids": inserted_ids, "namespace": namespace}

    except Exception as e:
        print(f"Error while upserting to Pinecone: {e}")


async def get_query_pinecone(query_embedding, namespace: str):
    try:
        index = get_pinecone_index()
        result = index.query(vector=query_embedding["values"], namespace=namespace, top_k=3, include_metadata=True, include_values=False)
        return result

    except Exception as e:
        print(f"Error while Quering to Pinecone: {e}")
        