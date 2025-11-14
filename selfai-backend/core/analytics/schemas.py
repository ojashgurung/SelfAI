from datetime import datetime
from typing import List
from pydantic import BaseModel

class HighlightResponseModel(BaseModel):
    label: str 
    stat: str | int = ""
    description: str

class ProfileCompletionSectionModel(BaseModel):
    label: str
    percent: float

class ProfileCompletionActionModel(BaseModel):
    label: str
    done: bool

class ProfileCompletionResponseModel(BaseModel):
    completion_score: float
    sections: List[ProfileCompletionSectionModel]
    # actions: List[ProfileCompletionActionModel]

class MetricsSummaryQueries(BaseModel):
    total_queries: int
    current: int
    previous: int
    growth: int

class MetricsSummaryVisitors(BaseModel):
    total_visitors: int
    current: int
    previous: int
    growth: int

class MetricsSummaryResponseModel(BaseModel):
    queries: MetricsSummaryQueries
    visitors: MetricsSummaryVisitors
    since: datetime
