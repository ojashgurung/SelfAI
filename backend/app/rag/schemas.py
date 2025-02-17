from pydantic import BaseModel, Field

class QueryRequest(BaseModel):
    question: str = Field(None, description="Query Question?")