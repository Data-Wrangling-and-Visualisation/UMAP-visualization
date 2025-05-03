from typing import List, Tuple, Optional
from pydantic import BaseModel

class EmbeddingOutput(BaseModel):
    embeddings: List[List[Tuple[float, float, float]]]
    colors: Optional[List[int]] = None
    labels: Optional[List[str]] = None