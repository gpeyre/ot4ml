# OT4ML logo experiments

This folder contains a notebook-driven logo experiment inspired by the POT logo:
red source points, blue target points, and black transport segments arranged to
spell `OT4ML`.

Run `ot4ml_logo_ot_map.ipynb` from this folder. It generates SVG and PNG
candidates in `outputs/` for several transport costs:

- `W2`: squared Euclidean assignment.
- `W1`: Manhattan assignment.
- `Winf`: bottleneck assignment for the Chebyshev metric.
- `anisotropic L2`: weighted Euclidean assignments with several anisotropies.

The helper module `ot4ml_logo.py` contains the geometry, solvers, and rendering
functions used by the notebook.

The site favicon is derived from the same W2 geometry by
`generate_favicon.py`. It writes the browser icon set to `../assets/favicon/`,
copies the default icons to the repository root, and refreshes the MyST source
icons in `../myst/`.
