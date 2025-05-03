# UMAP Visualization

This project aims to create an interactive visualization web application for the UMAP algorithm.

## Preview

![Preview Video](./public/demo.gif)

## Table of contents

The repository contains all the documents required for the `DW&V` course:

- [Project Proposal](./proposal/main.pdf)
- [First Checkpoint](./checkpoint1/main.pdf)
- [Second Checkpoint](./checkpoint2/main.pdf)
- [Presentation Slides](./slides/main.pdf)

## How to run

```bash
docker compose up --build -d
```
Frontend page will be available at [`localhost:8000`](http://localhost:8000), where you can upload your data and visualize it. We prepared two sample datasets in the [`gallery`](./frontend/gallery/) folder, which you can use for visualization.

## Using the Frontend

1. **Landing page overview**  
   At the top you’ll find a brief description of UMAP and instructions on how to use this tool.

2. **Uploading your own CSV**  
   - Click **Upload CSV**, select a `.csv` file with your dataset.  
   - Include a `label` column if you wish to color‐code and display point labels.

3. **Sample Data Gallery**  
   - Click **Use Sample Data** to reveal a sliding panel of preloaded datasets.  
   - Select any listed CSV to load and visualize it immediately.

4. **3D Scatter Plot**  
   - The right panel shows your UMAP embedding in 3D.  
   - **Rotate**, **pan**, and **zoom** with mouse controls.  
   - **Hover** over points to see the exact `(x,y,z)` coordinates and your original `label` value.

5. **2D D3 Scatter Plot**  
   - Below or beside the 3D view, a 2D projection (first two components) is rendered using D3.  
   - Hover displays the same label text.  
   - Use this to get a quick overview of clustering in 2D.

6. **Epoch Slider**  
   - A slider labeled **Epoch** lets you step through UMAP’s intermediate embeddings.  
   - Drag it to watch how the algorithm gradually separates clusters.

7. **Re‐visualizing**  
   - To load another dataset (own or sample) at any time, simply repeat steps 2 or 3.  
   - No page refresh needed, new data replaces the old view.

## Acknowledgements

Implementation of our algorithm relies on original `UMAP` repository: [GitHub](https://github.com/lmcinnes/umap), and original paper: [arXiv](https://arxiv.org/abs/1802.03426)

