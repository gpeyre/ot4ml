# Waddington-OT day 10 to day 10.5 asset

This reduced asset is derived from the public iPSC reprogramming tutorial data
released with Waddington-OT by Schiebinger et al. (Cell, 2019). The official
tutorial is <https://broadinstitute.github.io/wot/tutorial/>.

The preparation script `notebooks-figures/prepare_waddington_ot_data.py` reads
the following members through byte-range requests, without downloading the full
archives:

- `data/fle_coords.txt` from the official `data.zip` archive;
- `tmaps/serum_10.0_10.5.h5ad` from the official `tmaps.zip` archive.

The display coordinates are the official force-layout embedding released with
the Waddington-OT tutorial. It is constructed from a diffusion-map
nearest-neighbor graph over the whole reprogramming time course; it is used only
to display the cells. The archived transport plan itself was computed by the
authors using squared Euclidean costs in pairwise local 30-dimensional PCA
coordinates, together with entropy and growth-aware unbalanced constraints.
Display clouds are deterministic farthest-point subsets. Interpolation
trajectories are first sampled according to the mass of the Waddington-OT plan
and then thinned by farthest-point sampling in the joint source-target display
coordinates. Coupling segments are selected by a second farthest-point pass
among the 5,000 largest entries of the plan.

The resulting `waddington_ot_day10_day10_5.npz` contains only force-layout
coordinates, integer display indices, normalized segment masses, and the two
collection days. It contains no gene-expression matrix or cell identifier.
