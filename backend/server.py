from fastapi import FastAPI, File, UploadFile, HTTPException

import numpy as np
import pandas as pd

from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

from umap import UMAP

from models import EmbeddingOutput

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI()

MAX_UNIQUE_CATEGORIES = 20


def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    cat_features = df.select_dtypes(include=["object"]).columns.tolist()
    num_features = df.select_dtypes(include=["number"]).columns.tolist()
    cat_features = [
        col for col in cat_features if df[col].nunique() <= MAX_UNIQUE_CATEGORIES
    ]

    cat_preprocessor = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )
    num_preprocessor = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="mean")),
            ("scaler", StandardScaler()),
        ]
    )
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", cat_preprocessor, cat_features),
            ("num", num_preprocessor, num_features),
        ]
    )
    preprocessed_data = preprocessor.fit_transform(df)

    return pd.DataFrame(preprocessed_data, columns=preprocessor.get_feature_names_out())


@app.post("/data2emb")
async def data2emb(file: UploadFile = File(...)) -> EmbeddingOutput:
    logger.info("Received file for embedding")
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are supported")

    logger.info("Reading CSV file")
    df: pd.DataFrame = pd.read_csv(file.file)
    x = df.drop(columns=["label"], errors="ignore")
    y = None
    if "label" in df.columns:
        logger.info("label column found, using it for coloring")
        y = df["label"].values.astype(np.int32).tolist()

    logger.info("Preprocessing data")
    x = preprocess_data(x)

    umap = UMAP(n_components=3)
    _ = umap.fit_transform(x)
    embedding_history = umap.embedding_hist

    logger.info(f"UMAP embedding shape: {embedding_history[-1].shape}")
    logger.info(f"UMAP embedding history length: {len(embedding_history)}")

    return EmbeddingOutput(
        embeddings=[
            [tuple(vector) for vector in embedding] for embedding in embedding_history
        ],
        colors=y,
    )
