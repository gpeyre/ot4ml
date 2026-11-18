# Wasserstein Distances and Duality

Adapted from Julie Delon's *Wasserstein Distances and duality*
(`exo_distance_wasserstein.pdf`, October 28, 2025). Both editions credit
Julie Delon for the original exercises; the hints and corrections are part
of the OT4ML adaptation.

- [Statements only](exo-distance-duality-uncorrected.pdf)
- [Statements, hints and worked solutions](exo-distance-duality.pdf)
- [Standalone LaTeX source](exo-distance-duality.tex)

Build both editions with `python3 exercises/build.py exo-distance-duality`.

## Solution Notes

1. **Total variation and the 0/1 cost.** Both proofs construct an optimizer
   by keeping the common part on the diagonal. The general statement uses the
   measurable cost on a standard Borel space, rather than assuming that an
   uncountable discrete metric gives the same Borel structure.
2. **Finite metric spaces.** The comparison uses sharp distance constants,
   and the proof gives explicit neighborhood inclusions.
3. **Algebra of transforms.** The two domains determine the order of the
   transforms: the source potential starts with the forward cost, while
   the target potential starts with the transposed cost. The proof also gives
   a two-point example where exact alternating
   dual updates reach a fixed point that is not jointly optimal.

The corresponding book material is in *Wasserstein Space* (comparison with
total variation) and *Dual Problem* (algebra of c-transforms).
