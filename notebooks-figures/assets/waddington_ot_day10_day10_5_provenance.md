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
nearest-neighbor graph over the whole reprogramming time course and is used only
to display cells. The archived transport plan itself was computed by the
authors using squared Euclidean costs in pairwise local 30-dimensional PCA
coordinates, together with entropy and growth-aware unbalanced constraints.

The reduced asset supports the probability-on-FLE displays used in the paper
and its official trajectory tutorial. It contains a deterministic random sample
of 20,000 cells from the full FLE as a gray background, together with all day-10
and day-10.5 cells. A source-cell set is pushed forward through the released
plan to obtain descendant probabilities. Two compact target regions are pulled
back to obtain ancestor probabilities. Candidate target regions are centered at
farthest-point samples; the selected pair balances FLE separation with the
Bhattacharyya affinity of the two pulled-back distributions. Their pointwise
minimum supplies the common-ancestry display. No straight-line interpolation in
the FLE is constructed because that embedding is not the transport geometry.

The resulting `waddington_ot_day10_day10_5.npz` contains only force-layout
coordinates, integer conditioning sets, normalized descendant and ancestor
masses, and the two collection days. It contains no gene-expression matrix or
cell identifier.
