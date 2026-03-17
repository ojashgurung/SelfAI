import asyncio
from typing import List, Optional, Dict, Any
from graph.services.identity_service import IdentityService

class IdentityController:
    @staticmethod
    async def query(*, user_id, question: str, top_k: int = 8, platform: Optional[str] = "github", source_id: Optional[str] = None):
        svc = IdentityService()
        return await svc.answer_one(
            user_id=user_id,
            question=question,
            top_k=top_k,
            platform=platform,
            source_id=source_id,
            depth="concise",
        )

    @staticmethod
    async def batch_query(
        *,
        user_id,
        questions: List[str],
        top_k: int = 8,
        platform: Optional[str] = "github",
        source_id: Optional[str] = None,
        concurrency: int = 1,
    ) -> Dict[str, Any]:
        svc = IdentityService()

        if concurrency <= 1:
            results = []
            for q in questions:
                results.append(await svc.answer_one(
                    user_id=user_id,
                    question=q,
                    top_k=top_k,
                    platform=platform,
                    source_id=source_id,
                ))
            return {"mode": "sequential", "count": len(results), "results": results}

        sem = asyncio.Semaphore(concurrency)

        async def run_one(q: str):
            async with sem:
                return await svc.answer_one(
                    user_id=user_id,
                    question=q,
                    top_k=top_k,
                    platform=platform,
                    source_id=source_id,
                )

        tasks = [asyncio.create_task(run_one(q)) for q in questions]
        results = await asyncio.gather(*tasks)
        return {"mode": f"concurrent({concurrency})", "count": len(results), "results": results}