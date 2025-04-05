from fastapi import FastAPI, File, UploadFile, HTTPException
import pandas as pd
from typing import List
from ..models.point_model import Point
from io import BytesIO
from PIL import Image
from typing import List

import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
from matplotlib import animation

from umap import UMAP

app = FastAPI()
def get_image_features(bytes: str) -> np.ndarray:
    image = Image.open(BytesIO(bytes))
    return np.array(image).flatten()  

def save_embedding_animation(
    embedding_history: List[np.ndarray],
    y: np.ndarray,
    output_file: str,
):
    all_points = np.concatenate(embedding_history)
    x_min, x_max = np.min(all_points[:, 0]), np.max(all_points[:, 0])
    y_min, y_max = np.min(all_points[:, 1]), np.max(all_points[:, 1])

    x_margin = (x_max - x_min) * 0.05
    y_margin = (y_max - y_min) * 0.05

    fig, ax = plt.subplots()
    ax.axis("off")
    
    ax.set_xlim(x_min - x_margin, x_max + x_margin)
    ax.set_ylim(y_min - y_margin, y_max + y_margin)

    sc = ax.scatter(
        embedding_history[0][:, 0], embedding_history[0][:, 1], c=y, cmap="tab10"
    )

    def update(frame):
        sc.set_offsets(embedding_history[frame])
        return [sc]

    ani = animation.FuncAnimation(
        fig, update, frames=len(embedding_history), interval=50, blit=True
    )

    writer = animation.FFMpegWriter(fps=20)
    ani.save(output_file, writer=writer)
    plt.close(fig)
    print(f"Animation saved to {output_file}")
    
@app.post("/data2emb")
async def data2emb(file: UploadFile = File(...)) -> List[List[Point]]:
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only .csv files are supported")
    
    try:
        # Read the CSV file into a DataFrame
        df = pd.read_csv(file.file)
        
        # Check for required columns
        data = np.array([get_image_features(bytes["bytes"]) for bytes in df["image"]])
        
        umap = UMAP()
        embedding = umap.fit_transform(data)
        
        
        
        # Convert DataFrame to the required format
        result = []
        for _, row in df.iterrows():
            point = Point(pos=[row[x_col], row[y_col], row[z_col]], label=row[label_col])
            result.append(point)
        
        return [result]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")