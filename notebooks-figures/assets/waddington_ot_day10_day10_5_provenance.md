# Waddington-OT day 10 to day 10.5 asset

This reduced asset is derived from the public iPSC reprogramming tutorial data
released with Waddington-OT by Schiebinger et al. (Cell, 2019). The official
tutorial is <https://broadinstitute.github.io/wot/tutorial/>.

The preparation script `notebooks-figures/prepare_waddington_ot_data.py` reads
the following members through byte-range requests, without downloading the full
archives:

- `data/ExprMatrix.var.genes.h5ad` and `data/cell_days.txt` from the official
  `data.zip` archive;
- `tmaps/serum_10.0_10.5.h5ad` from the official `tmaps.zip` archive.

The two snapshots are projected jointly onto the first two principal
components of the 1,479-gene log-normalized expression matrix. Display clouds
are deterministic farthest-point subsets. Interpolation trajectories are first
sampled according to the mass of the Waddington-OT plan and then thinned by
farthest-point sampling in joint source-target PCA coordinates. Coupling
segments are selected by a second farthest-point pass among the 5,000 largest
entries of the plan.

The resulting `waddington_ot_day10_day10_5.npz` contains only PCA coordinates,
integer display indices, normalized segment masses, the two collection days,
and the explained-variance ratios. It contains no gene-expression matrix or
cell identifier.
