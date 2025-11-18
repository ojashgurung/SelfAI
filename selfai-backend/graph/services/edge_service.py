from core.database.db import AsyncSession
from graph.models.edge import GraphEdge

class EdgeService:
    @staticmethod
    async def create_edge(session: AsyncSession, user_id: str, from_id: str, to_id: str, type: str = "owns"):
        edge = GraphEdge(
            user_id=user_id,
            from_node_id=from_id,
            to_node_id=to_id,
            type=type
        )
        session.add(edge)
        await session.commit()
        await session.refresh(edge)
        return edge
