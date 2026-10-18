# OT4ML: second global mathematical and editorial pass

Date: 18 October 2026.

## Scope

This second pass screened the statements in all 16 chapters and checked selected proofs, boundary cases, notation, references, and the rendering of the edited passages. The deeper checks included quantile maps, entropic bias and Sinkhorn rates, Bregman density laws, positive kernel features, weak transport, quantum scaling, Wasserstein particle flows, functional inequalities, and moment closure.

The pass made **16 corrections and clarifications in six chapters and the notation appendix**, listed below. It does not certify every proof or cited external theorem, and it did not rerun the figure notebooks. Chapters without a confirmed new issue were left unchanged. PDE4ML, the compact edition, arXiv exports, drafts, and the other pre-existing working-tree changes were preserved and excluded from this commit.

## Corrections

1. **Chapter 2: domains of one-dimensional quantile maps.** In `OT4ML/sections/monge.tex`, Theorem `prop-1d-quantile-map` now defines the quantile map alpha-almost everywhere and permits a finite measurable extension on the exceptional set. Its proof explains why the source rank belongs to `(0,1)` almost surely. It also distinguishes monotonicity on a full-measure set from the existence of a globally finite monotone extension. For example, the Gaussian quantile map from the uniform law on `(0,1)` cannot be extended as a finite nondecreasing function on all of the real line.

2. **Chapter 3: the same domain issue in increasing rearrangements.** In `kantorovich.tex`, Definition `def-increasing-rearrangement-map` and Proposition `prop-monge-gap-one-dimensional` now use nondecreasing maps on a full alpha-measure subset. This keeps the Monge-gap zero-set characterization correct for unbounded output laws and links explicitly to the corrected quantile-map theorem.

3. **Chapter 2: coupling indices on trees.** In Proposition `prop-tree-w1-cumulative`, replaced the remaining `pi_{x y}` by `pi_{x,y}`, consistently with the proof and the book's two-index convention.

4. **Chapter 8: entropy Hessian with zero marginal weights.** In `sinkhorn.tex`, the proof of Proposition `prop-entropic-unique` now removes structurally zero rows and columns before invoking the Hessian with entries `1/P_{i,j}`. Otherwise the displayed Hessian was undefined even on the relative interior of the original constrained polytope. Existence and uniqueness for histograms with zero entries remain unchanged.

5. **Chapter 8: boundary optimality for Bregman regularization.** After Proposition `prop-bregman-regularized-ot-dual`, the separable density formula is explicitly restricted to the differentiability domain. At zero density it is replaced by membership in `partial h(0)`, with `h` extended by infinity to negative arguments. This is the normal-cone condition needed for sparse quadratic transport; an ordinary derivative equality would incorrectly exclude zero entries.

6. **Chapter 10: nonnegative features do not ensure strictly positive sketches.** In `statistical-ot.tex`, after Proposition `prop-cp-kernel-positive-features`, distinguished complete positivity/nonnegative factorization from entrywise strict positivity. A finite random sketch may contain zero entries or even a zero row although its expectation is strictly positive. In contrast, the exponential features in Proposition `prop-gaussian-positive-features` are strictly positive, so the corresponding finite sketch is now correctly written `K_r > 0` entrywise.

7. **Chapter 10: infinite variance does not invalidate the strong law.** Corrected the statement that the raw positive-feature Monte Carlo average "need not concentrate." Its finite first moment and independent sampling do give entrywise almost-sure convergence on a fixed finite cloud. The actual obstruction discussed here is the lack of a useful finite-rank error guarantee, with infinite variance for the stable-mixture features when `0 < p < 2` and very large variance in the Gaussian case.

8. **Chapter 13: entropy at singular quantum states.** In `beyond-comparing-measures.tex`, Definition `def-von-neumann-quantum-entropy` now defines entropy through eigenvalues and states `nabla H(T)=log T` only for positive definite matrices. The entropy extends continuously to singular matrices; the matrix-logarithm gradient does not. The convention `0 log 0=0` cannot supply a finite gradient there.

9. **Chapter 13: unsupported general quantum-scaling convergence claim.** Replaced the assertion of general convergence of the displayed symmetric congruence iteration by a precise distinction between exact normalization of each block and convergence of the full iteration. The text explains the uniform-marginal inverse-map contraction mechanism and the diagonal Sinkhorn case, but does not transfer these guarantees to arbitrary noncommuting targets. Renamed the algorithm "Symmetric quantum marginal scaling," emphasized its returned feasibility residual, and distinguished feasibility from minimizing entropic QOT. Updated the notation appendix and the surrounding prose consistently. The source check used [Georgiou and Pavon](https://arxiv.org/abs/1405.6650); the existence and algorithmic results for related quantum/operator-scaling problems must not be treated as convergence proofs for a different displayed iteration. No assertion is made here that general operator scaling lacks convergent algorithms.

10. **Chapter 15: smooth interaction gradients versus nonsmooth energy distance.** In `wasserstein-gradient-flows.tex`, the classical interaction formula now states differentiability and integration assumptions and writes the partial derivative `nabla_x k` explicitly. For `k(x,y)=-|x-y|`, the fixed-particle descent uses `j != i` away from collisions because the diagonal energy is constant. The teacher integral requires no target atom at the current particle. Added the distinction between this discretized descent, collision handling, and differentiability of the full Wasserstein functional at an atomic measure.

11. **Chapter 15: cumulative notation in the flow figure.** The caption of `fig:gradflow-discrepancy-density-comparison` now uses the book's cumulative functions `C_alpha` and `C_beta`, via the existing `cumul` macro, instead of introducing `F_alpha` and `F_beta`.

12. **Chapter 15: Fisher information for vanishing densities.** Definition `def-relative-fisher-lsi` keeps the weak square-root-density formula as the primary definition. The logarithmic expression is now stated for smooth positive densities rather than displayed as an unconditional equality when `h` can vanish. Thus the definition no longer silently assumes that `log h` is a globally defined weakly differentiable function.

13. **Chapter 15: the domain of the HWI argument for logarithmic Sobolev.** The proof of Proposition `prop-curvature-log-sobolev` now first applies HWI to smooth probabilities with finite second moment and finite Fisher information, before the existing approximation step. It no longer invokes a Wasserstein-2 inequality for arbitrary absolutely continuous laws without its moment hypothesis.

14. **Chapter 15: uncentered spectral action.** Replaced the remaining description "covariance action" by "second-moment action" in the generalized-flow introduction. The action integrates velocity outer products without centering, consistently with the corrected dynamic formulation and notation appendix.

15. **Chapter 15: a compact geodesic-convexity definition.** Definition `def-geodesic-convexity` now gives the lambda-convex inequality directly, specifies finite endpoint energies and `0 <= t <= 1`, and identifies ordinary geodesic convexity with `lambda=0`. The preceding interpolation paragraph was shortened without removing its map-versus-splitting distinction. This short definition is kept together locally to avoid an isolated continuation; the book's general breakable-definition style is unchanged.

16. **Chapter 15: stability of energy-dissipation inequalities needs hypotheses.** After the definition of curves of maximal slope, replaced the unconditional assertion of stability under weak limits by a statement requiring suitable compactness and lower semicontinuity of both energy and slope. The inequality alone does not supply these assumptions, particularly when energies or geometries vary.

## Checks

- The book's native pdfLaTeX/latexmk build was run successfully. The built-in preview compiler was also attempted, but its XeTeX engine rejects the project's existing Latin-1 input configuration; the project encoding was not changed.
- Reference and bibliography integrity were checked globally: no unresolved targets, duplicate explicit labels, or missing cited keys were found.
- Numerical checks of the edited formulas: the quantum-entropy directional derivative agreed with `trace(log(T) D)` to `1.7e-10`; 100 random positive-definite congruence normalizations had maximum residual `4.8e-15`; the energy-distance fixed-particle weighted gradient agreed with finite differences to `2.6e-11`.
- A two-point feature example verified the strict-positivity distinction: features `(1,1)` and `(0,1)`, sampled equally, have the strictly positive expected Gram matrix `[[1/2,1/2],[1/2,1]]`, but a single sample can give `[[0,0],[0,1]]`.
- The final PDF and page-break diagnostics were checked after rebuilding. Selected edited pages were rendered and visually inspected; final validation details are recorded below.

## Final validation

- `OT4ML/OT4ML.pdf`: 494 pages; the index was regenerated with `ot4ml.ist` and incorporated in the final build.
- 2,112 reference commands checked; no missing targets or duplicate explicit labels. All 577 cited bibliography keys exist.
- No unresolved references/citations, overfull boxes, or bad framed-box breaks in the final log. Existing font-size substitutions and underfull-page diagnostics remain.
- Visually inspected 13 selected pages, including the final quantum algorithm and the repaired geodesic-convexity definition boundary.
- A random strictly positive quantum kernel with uniform marginals reached row and column residuals below `8e-16` after 40 cycles. This is a sanity check for the stated uniform case, not evidence of a general convergence theorem.
- Source/report whitespace checks passed. Compiler-generated log whitespace was left untouched.
