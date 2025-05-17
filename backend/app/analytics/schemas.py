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
