from sqlmodel import SQLModel, Field
import uuid
from datetime import datetime
from typing import Optional

class GraphIntegration(SQLModel, table=True):
    __tablename__ = "graph_integrations"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    node_id: uuid.UUID = Field(foreign_key="graph_nodes.id", nullable=False)

    source: str = Field(nullable=False)      # "github", "linkedin"
    external_id: str = Field(nullable=False) # repo_id, linkedin_id, tweet_id…

    created_at: datetime = Field(default_factory=datetime.utcnow)
