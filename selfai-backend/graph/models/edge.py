from sqlmodel import SQLModel, Field, Relationship
import uuid
from datetime import datetime

class GraphEdge(SQLModel, table=True):
    __tablename__ = "graph_edges"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    from_node_id: uuid.UUID = Field(foreign_key="graph_nodes.id", index=True)
    to_node_id: uuid.UUID = Field(foreign_key="graph_nodes.id", index=True)

    type: str = Field(nullable=False)  # "owns", "contributes_to", "authored", etc.
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Disambiguate relationships by specifying which FK each uses
    from_node_rel: "GraphNode" = Relationship(
        back_populates="outgoing_edges",
        sa_relationship_kwargs={"foreign_keys": "GraphEdge.from_node_id"}
    )
    to_node_rel: "GraphNode" = Relationship(
        back_populates="incoming_edges",
        sa_relationship_kwargs={"foreign_keys": "GraphEdge.to_node_id"}
    )
