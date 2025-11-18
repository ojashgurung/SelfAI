from sqlmodel import select
from core.database.db import AsyncSessionLocal
from graph.models.node import GraphNode
from graph.models.edge import GraphEdge

class GraphService:

    @staticmethod
    async def get_graph(user_id: str):
        async with AsyncSessionLocal() as session:
            
            # Query nodes
            result_nodes = await session.exec(
                select(GraphNode).where(GraphNode.user_id == user_id)
            )
            nodes = result_nodes.all()

            # Query edges
            result_edges = await session.exec(
                select(GraphEdge).where(GraphEdge.user_id == user_id)
            )
            edges = result_edges.all()

            return nodes, edges
