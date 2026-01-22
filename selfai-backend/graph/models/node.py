from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import JSON, Column
from typing import Optional, List, Dict, TYPE_CHECKING
import uuid
from datetime import datetime, timezone

if TYPE_CHECKING:
    from graph.models.edge import GraphEdge

def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)

class GraphNode(SQLModel, table=True):
    __tablename__ = "graph_nodes"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)

    type: str = Field(nullable=False)   # e.g. "github_repo", "document"
    title: str = Field(nullable=False)
    source: str = Field(nullable=False)  # e.g. "github", "upload", "linkedin"

    node_metadata: Dict = Field(default_factory=dict, sa_column=Column(JSON))

    created_at: datetime = Field(
        default_factory=utcnow,
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=utcnow,
        nullable=False
    )

    # Relationships — edge models will define the FK fields
    outgoing_edges: List["GraphEdge"] = Relationship(
        back_populates="from_node_rel",
        sa_relationship_kwargs={"foreign_keys": "GraphEdge.from_node_id"}
    )
    incoming_edges: List["GraphEdge"] = Relationship(
        back_populates="to_node_rel",
        sa_relationship_kwargs={"foreign_keys": "GraphEdge.to_node_id"}
    )
