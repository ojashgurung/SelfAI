from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, List, Optional

@dataclass
class IngestedDocument:
    external_id: str
    doc_type: str
    title: str
    text: str
    url: Optional[str] = None
    updated_at_source: Optional[datetime] = None
    metadata: Dict[str, Any] = None

@dataclass
class IngestPayload:
    platform: str
    account_id: Optional[str]
    display_name: str
    source_metadata: Dict[str, Any]
    documents: List[IngestedDocument]