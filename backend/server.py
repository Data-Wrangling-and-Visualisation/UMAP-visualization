from fastapi import FastAPI, File, UploadFile, HTTPException
import pandas as pd
from typing import List
from io import BytesIO
from PIL import Image
from typing import List, Tuple

import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
from matplotlib import animation

from umap import UMAP
app = FastAPI()

def get_image_features(bytes: str) -> np.ndarray:
    image = Image.open(BytesIO(bytes))
    return np.array(image).flatten()  

def emb2anim(
    embedding_history: List[np.ndarray],
    y: np.ndarray
):
    list_of_frames: List[List[Tuple[float,float,float]]] = []
    for frame in embedding_history:
        list_of_frames.append([(point[0], point[1], point[2]) for point in frame])
    labels = [int(y_item) for y_item in y]
    
    if(len(list_of_frames) == 0):
        raise ValueError("No frames found in the embedding history")
    
    if(len(labels) != len(list_of_frames[0])):
        raise ValueError("Length of labels must match the number of frames")
    
    animation = {
        "frames":list_of_frames,
        "labels":labels
    }
    
    return animation

    
 
@app.post("/data2emb")
async def data2emb(file: UploadFile = File(...)) -> dict:
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only .csv files are supported")
    
    try:
        # Read the CSV file into a DataFrame
        df = pd.read_csv(file.file)
        
        # Check for required columns
        data = np.array([get_image_features(bytes["bytes"]) for bytes in df["image"]])
        
        umap = UMAP()
        umap.n_components = 3
        umap.fit_transform(data)
        try:
            anim = emb2anim(umap.embedding_hist, df["label"])
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error creating animation: {str(e)}")
        result = {
            "frames": anim["frames"],
            "labels": anim["labels"]
        }      
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")