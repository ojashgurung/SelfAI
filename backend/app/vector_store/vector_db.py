from ..config import Config
import asyncio

from pinecone import PineconeAsyncio, ServerlessSpec

index_name = "SelfAI"

async def main():
    async with PineconeAsyncio(api_key=Config.PINECONE_API_KEY) as pc:
        if not await pc.has_index(index_name):
            await pc.create_index(
                name="SelfAI",
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
            print(f"Index '{index_name}' created successfully.")
        else:
            print(f"Index '{index_name}' already exists.")
            

if __name__ == "__main__":
    asyncio.run(main())