from typing import Optional
from pydantic import BaseModel

class HighlightResponseModel(BaseModel):
    label: str 
    stat: str | int = ""
    description: str