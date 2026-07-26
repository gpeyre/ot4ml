# Waddington-OT time-course snapshot asset

This compact asset is derived from the public iPSC reprogramming data released
with Waddington-OT by Schiebinger et al. (Cell, 2019). The official tutorial is
<https://broadinstitute.github.io/wot/tutorial/>.

The preparation script `notebooks-figures/prepare_waddington_ot_data.py` reads
only two members of the official `data.zip` archive through byte-range requests:

- `data/fle_coords.txt`, the official force-layout display coordinates;
- `data/cell_days.txt`, the collection day of each cell.

The force-layout embedding is constructed from a diffusion-map nearest-neighbor
graph over the reprogramming time course. It is used only as a common display
plane. The compact archive contains a deterministic sample of 40,000 time-labeled
cells for the aggregate landscape and all available cells at days 0, 9 and 18.
It contains no expression matrix, cell identifier or transport plan.
