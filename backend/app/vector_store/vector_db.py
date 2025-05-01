from ..config import Config
from typing import List, Any, TypedDict
import asyncio

from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
from pinecone import Vector
from ..config import Config

INDEX_NAME = Config.VECTOR_DB_INDEX_NAME
pc = Pinecone(api_key=Config.PINECONE_API_KEY)

def create_index_if_not_exists():
    if not pc.has_index(INDEX_NAME):
        pc.create_index(
            name=INDEX_NAME,
            dimension=1536,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            deletion_protection="disabled",
            tags={"environment": "development"},
        )
        print(f"Index {INDEX_NAME} has been created.")
    else:
        print(f"Index {INDEX_NAME} already exists.")


create_index_if_not_exists()

index = pc.Index(INDEX_NAME)

class EmbeddingDict(TypedDict):
    id: str
    values: list[float]
    metadata: dict[str, Any]



async def upsert_to_pinecone(embeddings: List[EmbeddingDict], namespace: str) -> dict[str, Any]:
    try:
        inserted_ids = [vector["id"] for vector in embeddings]
        
        pinecone_vectors = [
            Vector(
                id=vector['id'],
                values=vector['values'],
                metadata=vector.get('metadata', {})
            )
            for vector in embeddings
        ]
        await asyncio.to_thread(index.upsert, vectors=pinecone_vectors, namespace=namespace)
        return {"status": "success", "inserted_ids": inserted_ids, "namespace": namespace}

    except Exception as e:
        print(f"Error while upserting to Pinecone: {e}")
        return {
            "status": "error",
            "error": str(e),
            "namespace": namespace
        }


async def get_query_pinecone(query_embedding, namespace: str):
    try:
        result = await asyncio.to_thread(
            index.query,
            vector=query_embedding["values"],
            namespace=namespace,
            top_k=3,
            include_metadata=True,
            include_values=False
        )
        return result
    except Exception as e:
        print(f"Error while Quering to Pinecone: {e}")
        

async def delete_vectors(vector_ids: list, namespace: str):
    try:
        if not vector_ids:
            return True

        await asyncio.to_thread(index.delete, ids=vector_ids, namespace=namespace)
        return True
    except Exception as e:
        print(f"Failed to delete vectors: {e}")
        raise Exception(f"Failed to delete vectors: {e}")


async def check_namespace_exists(namespace: str) -> bool:
    try:
        result = await asyncio.to_thread(
            index.query,
            vector=[0.0] * 1536,
            namespace=namespace,
            top_k=1,
            include_metadata=False
        )

        return len(result.matches) > 0
    except Exception as e:
        print(f"Error while checking namespace existence: {e}")
        return False