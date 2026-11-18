# Flow Matching and Dynamic OT

Five exercises adapted from Julie Delon's sheet
`exo-flow-matching-and-dynamicOT.pdf`, supplied through a Proton Drive link.
Both PDF editions explicitly credit **Julie Delon for the original exercises**.
The additional hints, worked solutions, and clarifications are identified as
the OT4ML adaptation, rather than attributed to her.

- [Statements only](exo-flow-matching-uncorrected.pdf)
- [Statements, hints and worked solutions](exo-flow-matching.pdf)
- [Standalone LaTeX source](exo-flow-matching.tex)

Build from the repository root with
`python3 exercises/build.py exo-flow-matching`. The source uses the same copied
preamble, exercise dividers, and conditional hints/solutions as the other sheets.
No external figure or bibliography file is needed.

## Mathematical clarifications

The five original topics and their order are preserved.

1. **Affine changes and time change:** give a consistent pointwise argument
   and state that conditional-velocity identities hold almost everywhere for
   the respective interpolated laws. Positive target dilation uses the same
   time change as the original sheet.
2. **Optimal maps under transformations:** common arbitrary invertible affine
   changes preserve flow-matching equivariance, but not necessarily quadratic
   optimality. The solutions prove the similarity case and provide a shear
   counterexample. Target translations and positive target dilations do
   preserve optimality. Finite second moments and an absolutely continuous
   source are explicit.
3. **One-dimensional terminal optimality:** specify sufficient regularity for
   characteristics and continuity-equation uniqueness on each interval before
   time 1, together with existence of an almost-everywhere finite terminal
   limit. These assumptions justify the pushforward claim, not merely
   noncrossing of trajectories. The limiting map may be non-strictly
   increasing, allowing atomic targets. The quantile-composition formula is
   only asserted for atomless sources.
4. **Gaussian endpoints:** define the cross covariance as
   `R = E[X_1 X_0^T]`, use its transpose in the other block, and require
   invertibility of the intermediate covariance. Nonsingular endpoint
   covariances alone do not suffice (`X_1 = -X_0` is a counterexample).
   The regression formula has no artificial singularity at time 1.
   For independent commuting Gaussians the terminal map is optimal, but the
   intermediate path need not be a Wasserstein geodesic.
5. **Gaussian mixtures:** distinguish the fixed mixture weights from the
   space- and time-dependent posterior weights. Allow singular joint
   components when the intermediate covariances are invertible. Explicitly
   impose independence between the Gaussian source and the discrete target:
   specifying the two marginal laws does not determine a flow-matching field.
   The discrete-target formulas are stated before time 1, and convergence of
   the interpolated laws is quantified in Wasserstein distance.

## Relation to the book and literature

The sheet follows the conditional-expectation and Gaussian constructions in
OT4ML, Chapter 16, *Generative Models via Transportation*, especially
`prop-flow-matching-vector-field` and
`prop-gaussian-flow-matching-optimality` in
`OT4ML/sections/transportation-models.tex`.

Further reading: Johannes Hertrich, Antonin Chambolle and Julie Delon,
[*On the Relation between Rectified Flows and Optimal Transport*](https://arxiv.org/abs/2505.19712),
NeurIPS 2025. The PDF includes this reference in both editions.

## Expanded computations in the corrected edition

- Exercise 3 constructs the admissible coupling of the intermediate and target
  laws explicitly, computes its squared cost, and explains the finite-moment
  bound, weak convergence, and dominated-convergence passage to the terminal
  pushforward. It identifies the terminal monotone coupling through its joint
  cumulative function and writes its optimal quantile cost.
- Exercise 4 proves Gaussian regression by subtracting the affine predictor,
  computing its zero cross covariance, and factoring the joint Gaussian
  characteristic function to establish independence of the residual.
- The intermediate covariance and velocity cross covariance are expanded
  outer product by outer product, including the transpose of each cross term.
  Regression is then applied explicitly to both equivalent velocity formulas.
- The diagonalized Gaussian ODE is integrated using its positive covariance
  factor, with the time integral and initial normalization written out. The
  argument also covers a zero initial coordinate, without dividing by it.

All these derivations remain inside the conditional solution environments, so
they do not appear in the statement-only edition.

## Validation

Both editions are built twice to resolve their local references. The exercise
test suite checks the statement/hints/solution separation and visible and
metadata attribution. Numerical checks independently verify the Gaussian
regression formula, the target-dilation transformation, commuting Gaussian
characteristics, the strict suboptimality of the shear counterexample, and
the continuity equation for the Gaussian-to-discrete construction.
Additional checks cover the Gaussian residual covariance, including singular
joint Gaussian laws, and ensure that the new proof text is absent from the
statement-only PDF.
