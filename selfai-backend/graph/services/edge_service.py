from core.database.db import AsyncSession
from graph.models.edge import GraphEdge

class EdgeService:

    @staticmethod
    async def create_edge(session: AsyncSession, from_id: str, to_id: str, type: str = "owns"):
        edge = GraphEdge(
            from_node_id=from_id,
            to_node_id=to_id,
            type=type
        )
        session.add(edge)
        await session.commit()
        await session.refresh(edge)
        return edge
