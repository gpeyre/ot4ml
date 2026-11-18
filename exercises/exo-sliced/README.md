# Sliced Optimal Transport

Adapted from Kimia Nadjahi's *Sliced Optimal Transport: Exercises*
(October 29, 2025), supplied via CNRS sDrive. Both PDFs credit Kimia Nadjahi
for the original exercises. The hints and corrections are part of the OT4ML
adaptation.

- [Statements only](exo-sliced-uncorrected.pdf)
- [Statements, hints and worked solutions](exo-sliced.pdf)
- [Standalone LaTeX source](exo-sliced.tex)

Build both editions from the repository root with
`python3 exercises/build.py exo-sliced`.

## Solution Notes

1. **Centered isotropic Gaussians.** The two optima follow from matching the
   same Gaussian noise and proving that no other coupling has a larger cross
   moment. The argument includes zero standard deviations.
2. **Projected transport plans.** The proof distinguishes feasibility from
   optimality. It computes all feasible planar couplings in a two-point example,
   shows that the unique optimal plan projects to a strictly suboptimal plan,
   and derives the sliced-versus-ambient comparison by averaging the projected
   cost. In dimension one, projection preserves optimality.
3. **Translation decomposition.** The proof uses a fixed direction to compute
   means, verifies that centering commutes with projection, and expands the cost
   for an arbitrary one-dimensional coupling. The spherical second-moment
   identity then gives the squared-distance factor `1/d`.

The relevant book sections are *Sliced Wasserstein* (including the proposition
*Sliced Wasserstein between Gaussians*) and *Wasserstein Distances* (the
proposition *Euclidean mean bound and quadratic decomposition*).
