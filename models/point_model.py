from typing import List, Tuple
from pydantic import BaseModel

class Point(BaseModel):
    pos: Tuple[float, float, float]
    label: int