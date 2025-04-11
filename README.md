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

To run the project, simply run
```bash
docker compose up --build -d
```
Frontend page will be available at [`localhost:8000`](http://localhost:8000), where you can upload your data and visualize it. We prepared two sample datasets in the [`sample_data`](./sample_data/) folder, which you can use for visualization 

## Acknowledgements

Implementation of our algorithm relies on original `UMAP` repository: [GitHub](https://github.com/lmcinnes/umap), and original paper: [ArXiV](https://arxiv.org/abs/1802.03426)

