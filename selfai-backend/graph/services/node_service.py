# class NodeService (add get_or_create_user_node and ensure node_metadata usage)
from sqlmodel import select
from core.database.db import AsyncSession
from graph.models.node import GraphNode

class NodeService:

    @staticmethod
    async def get_or_create_user_node(session: AsyncSession, user_id: str, username: str):
        result = await session.exec(
            select(GraphNode).where(
                GraphNode.user_id == user_id,
                GraphNode.type == "user"
            )
        )
        user_node = result.first()
        if user_node:
            return user_node

        user_node = GraphNode(
            user_id=user_id,
            type="user",
            title=username,
            source="system",
            node_metadata={}
        )
        session.add(user_node)
        await session.commit()
        await session.refresh(user_node)
        return user_node

    @staticmethod
    async def create_node(session: AsyncSession, user_id: str, type: str, title: str, source: str, metadata: dict):
        node = GraphNode(
            user_id=user_id,
            type=type,
            title=title,
            source=source,
            node_metadata=metadata
        )
        session.add(node)
        await session.commit()
        await session.refresh(node)
        return node
