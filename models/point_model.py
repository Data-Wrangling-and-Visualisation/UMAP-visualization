from typing import List, Tuple
from pydantic import BaseModel

class Point(BaseModel):
    pos: Tuple[float, float, float]

class Frame(BaseModel):
    points: List[Point]

class Animation(BaseModel):
    frames: List[Frame]
    labels: List[int]

