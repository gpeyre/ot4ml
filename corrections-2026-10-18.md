# OT4ML: global mathematical and editorial pass

Date: 18 October 2026.

## Scope

This pass screened the main manuscript's 16 chapters and notation appendix, with closer proof checks on hypotheses, extended-valued objectives, limiting arguments, entropy normalizations, and moment closures. It records only changes made during this pass, not the earlier PDE4ML-to-OT4ML transfers already present in the working tree. Existing edits were preserved.

There are **29 recorded corrections and clarifications**, affecting 13 chapters and the notation appendix. They include mathematical repairs, qualifications of otherwise correct results, notation consistency, and local presentation improvements. This is a mathematical review, not a formal verification certificate. The numerical notebooks and every external cited theorem were not independently revalidated.

Locations below use source files and stable LaTeX labels rather than proposition numbers, which may change during editing.

## Corrections

1. **Chapter 1: consistent cumulative and quantile notation.** In `OT4ML/sections/matching.tex`, the histogram-equalization paragraph and figure caption now use `\cumul{\alpha}` and `\cumul{\beta}^{-1}`, rather than introducing `F_alpha` and `Q_beta`. The continuum map and empirical target atoms use the same notation as Definition `def-cdf-quantile`.

2. **Chapter 1: non-monotone is not non-increasing.** In the paragraph "Flat directions for the linear cost," replaced "non-increasing optimal assignments" by "non-monotone optimal assignments." A failure of monotonicity does not mean that the entire assignment is decreasing.

3. **Chapter 2: radial maps are defined almost everywhere.** In `monge.tex`, Proposition `prop-radial-transport` now states the radial formula alpha-almost everywhere and permits a finite measurable extension on the exceptional set. For a bounded source and an unbounded target, the expression at source rank one can be infinite outside the source support. The proof explains why the probability-integral transform avoids this endpoint almost surely and allows an extended-valued convex radial potential.

4. **Chapter 2: quantile-geodesic caption.** The caption of `fig:monge-1d-quantile-geodesic` now uses the established cumulative-inverse notation instead of the undefined symbols `Q_t`, `Q_alpha`, and `Q_beta`.

5. **Chapter 6: edge flow versus flow vector.** In `semidiscr-w1.tex`, Proposition `prop-graph-w1-beckmann` now calls `m_e` the scalar signed flow on an oriented edge. The complete family is the flow vector. The description of the divergence constraint was polished accordingly.

6. **Chapter 7: finiteness of an IPM.** In `dual-norms.tex`, Definition `def-dual-norm-ipm` now distinguishes a finite-valued metric from an extended metric. Separation by test functions alone does not imply that the supremum is finite on every pair of probability measures.

7. **Chapter 8: compact Bregman definition and page break.** In `sinkhorn.tex`, Definition `def-measure-bregman-divergence` retains the well-definedness qualification but moves the explanation and cross-reference for the first variation immediately outside the box. This makes the definition more direct and removes a nearly empty continuation of its shaded frame at a page boundary.

8. **Chapter 9: a local rate needs a local convergence hypothesis.** In `sinkhorn-advanced.tex`, Proposition `prop-sinkhorn-local-rate` now explicitly applies its error expansion and asymptotic ratio bound to iterates converging to the optimum in the topology of the assumed Taylor expansion. A Jacobian computation by itself does not establish convergence of arbitrary continuous-space iterates.

9. **Chapter 10: empirical coupling notation.** In `statistical-ot.tex`, Proposition `prop-empirical-barycentric-map-consistency` and its proof now consistently use `\P^\epsilon` for the matrix and `\P_{i,j}^\epsilon` for its entries. Removed the inconsistent extra matrix subscript `(n,m)`; the measure-valued aggregated plan retains its sample-size subscripts.

10. **Chapter 10: entropy on index sets, including repeated observations.** In the same proof, the comparison plan is now a discrete matrix `\Q` with uniform index marginals. Its mutual-information bound is written against the product of those index marginals, not against a product of empirical measures on the ambient space. The proof explicitly notes that pushing matrices to sample locations preserves the transport cost even when locations coincide. This repairs both a type mismatch and the ambiguity caused by repeated samples.

11. **Chapter 11: finite-value optimizer characterization for UOT.** In `generalized-wasserstein.tex`, Proposition `prop-uot-balanced-relaxed-marginals` keeps the value identity in the extended-valued setting but requires a finite unbalanced value for the optimizer equivalence. If all values are infinite, an "optimizer" need not minimize the balanced cost between its own marginals. The proof now identifies precisely where finiteness is needed.

12. **Chapter 11: robust-Wasserstein definition layout.** In Definition `def-projection-subspace-robust-wasserstein`, the projection set is described directly as rank-k orthogonal projections, and the max-min/min-max formulas are aligned on separate lines. This removes both overflowing lines in the previous rendering without changing either definition.

13. **Chapter 11: Min-SW quantiles and compact introduction.** Before Definition `def-min-sw`, replaced the undefined `q_{alpha_theta}` and `q_{beta_theta}` by the book's cumulative-inverse notation. Used the uniform law on `(0,1)`, so no endpoint value of an unbounded quantile is required. Integrated the two projected-marginal definitions into the prose, shortening the lead-in and avoiding an empty shaded-frame continuation.

14. **Chapter 12: well-defined weak-OT objective.** In `generalized-ot-problems.tex`, Definition `def-weak-optimal-transport` now assumes the measurable weak cost is bounded below. This prevents an undefined integral of the form infinity minus infinity. The later duality proposition already used this hypothesis, and all weak-cost examples in this section satisfy it.

15. **Chapter 12: direct stochastic-order proof.** In Proposition `prop-strassen-stochastic-order`, the proof now tests the bounded increasing indicators of `(t,+infinity)` directly. No approximation or restriction to continuity points is necessary. The proof uses the standard cumulative/quantile notation and points to its definition.

16. **Chapter 12: wording in the martingale interpretation.** Corrected "today prices" and "tomorrow prices" to "today's prices" and "tomorrow's prices."

17. **Chapter 13: minimizers of a nonconvex problem need not form a face.** In `beyond-comparing-measures.tex`, the discussion of the unregularized biconvex GW relaxation now says that nonunique global minimizers may include fractional couplings. Removed the inappropriate description of the global minimizer set as an "optimal face." The face terminology is appropriate for the frozen linear subproblem, not for the whole nonconvex problem.

18. **Chapter 14: initial condition for a Lagrangian flow.** In `dynamic-ot.tex`, Proposition `prop-lagrangian-flow-continuity` now assumes `T_0=Id`. This ensures that `alpha_t=(T_t)_# alpha_0` actually has the stated initial law and that the particle positions at time zero have their intended meaning.

19. **Chapter 14: finite-entropy endpoint optimizer.** Proposition `prop-schrodinger-endpoint-reduction` now requires finite relative entropy when lifting an optimal endpoint coupling to an optimal mixture of reference bridges. The reference conditional laws are defined only almost everywhere for the reference endpoint law; an arbitrary infinite-entropy endpoint optimizer cannot be lifted by that argument. The extended-value identity itself is unchanged.

20. **Chapters 14-15 and notation appendix: raw second moments, not centered covariances.** The introductions to dynamic spectral transport and spectral flows now describe `int v v^T d alpha` and `S_alpha(g)` as second-moment matrices. The notation table was corrected accordingly. Added the explanation that centering the velocities would incorrectly give zero action to translations. The formulas were already uncentered and remain unchanged.

21. **Chapter 15: finite infimum in slope inequalities.** In `wasserstein-gradient-flows.tex`, Definitions `def-wasserstein-pl` and `def-wasserstein-kl` now explicitly require `f_star` to be real. This excludes undefined energy gaps for an identically infinite functional or an infimum of minus infinity.

22. **Chapter 15: hypotheses for the PL convergence proof.** Theorem `thm-wasserstein-pl-convergence` now states finite initial energy and local absolute continuity of the energy along the flow. These are the hypotheses needed to integrate the dissipation identity and apply Gronwall; an almost-everywhere derivative identity alone is insufficient.

23. **Chapter 15: the same integration issue for KL rates.** Theorem `thm-wasserstein-kl-sublinear` now explicitly assumes local absolute continuity of its finite energy gap before integrating the differential inequality and deriving the tail-length estimate.

24. **Chapter 15: one definition of relative Fisher information.** The Poincare and HWI statements now refer to Definition `def-relative-fisher-lsi`, which uses the weak gradient of the square-root density and specifies infinite values. Removed repeated logarithmic-density definitions that obscured the treatment of densities that vanish. The Poincare statement also reuses the existing logarithmic-Sobolev formula.

25. **Chapter 15: complete the Poincare linearization proof.** In Proposition `prop-poincare-linearized-wasserstein-pl`, first take a bounded mean-zero perturbation and impose `|epsilon| ||xi||_infinity < 1`. This guarantees that `(1+epsilon xi) beta` is a probability measure. Added the extension to general smooth integrable perturbations by smooth truncation, recentering, and Fatou's lemma. The original "epsilon small enough" argument did not cover unbounded perturbations.

26. **Chapter 15: justify the limiting step in HWI.** In Proposition `prop-hwi-inequality`, replaced an appeal to lower semicontinuity alone by a recovery approximation: approximate the square-root density in weighted Sobolev norm, control the second moment, normalize, and add a vanishing positive reference component. This gives Wasserstein convergence and convergence of Fisher information. Lower semicontinuity of entropy can then pass the inequality to the limit. Lower semicontinuity of a quantity on the right-hand side would not suffice. The existing Otto-Villani reference is retained.

27. **Chapter 15: singular spectral PMO and Muon normalization.** In Proposition `prop-normalized-spectral-polar`, replaced the vague "boundary" argument and the potentially nonexistent sequence of positive definite minimizers by a reduction to the range of `S_alpha(g)`. The proof shows that orthogonal projection preserves the linear pairing and cannot increase the monotone spectral action. The zero-gradient case is stated separately. For the operator gauge, the singular formula now explicitly uses `(S_alpha(g)^dagger)^{1/2}`. Boundary membership in the polar set is not the same thing as matrix singularity.

28. **Chapter 16: cross-covariance is not generally an autonomous state.** In `transportation-models.tex`, the example "Linear mean-field networks as cross-covariance flows" now distinguishes the predictor/residual, which depend only on the cross block, from the evolution, which also depends on both diagonal blocks. The closed state is the full covariance matrix. For example, with scalar cross-covariance `c=1/2`, input second moment one, and zero input-output cross moment, diagonal covariance blocks `(1,1)` give `dot c=-1`, whereas `(2,2)` give `dot c=-2`, despite the same predictor.

29. **Chapter 16: constrained JKO is a flow limit, not a gradient identity.** In the paragraph preceding Proposition `prop-gaussian-gradient-bullet-list`, the projected/Riesz gradient is no longer identified directly with a small-step JKO limit. Its descent flow is the formal limit, subject to existence of the constrained minimizers and convergence to a smooth curve. This also keeps ambient Gaussian preservation distinct from deliberately constrained evolution.

## Coverage without new source corrections

Chapters 3, 4, and 5 were screened without a newly confirmed issue requiring a source change in this pass. The reviewed material included sparse LP solutions, coupling relaxation and Monge gaps, Wasserstein topology and measure-valued maps, duality, and c-transforms. In the other chapters, the review also checked the main normalization conventions and representative proofs beyond the locations edited above; unchanged statements should not be interpreted as a formal correctness certificate.

## Validation

- Main-book pdfLaTeX build succeeded: `OT4ML/OT4ML.pdf`, 494 pages. The final log contains no unresolved references or citations, duplicate-label warnings, overfull boxes, or bad framed-box breaks. Existing font-size substitution warnings remain.
- Visually inspected 12 selected pages covering the changed statements and the problematic page boundaries; re-rendered and checked the final Bregman and Min-SW pages after their layout repairs. No clipped formulas or empty continuation frames remain on those pages.
- Cross-reference scan: 2,104 reference commands checked, with no unresolved targets or duplicate explicit labels.
- Citation scan: all 577 cited bibliography keys exist. This checks reference integrity, not the accuracy of every bibliography entry.
- Numerical sanity checks: two covariances with the same cross block produced the different derivatives stated in item 28; the singular operator-gauge PMO attained its analytic dual lower bound to about `3.6e-15`; 100 random compression tests respected the trace, Frobenius, and operator gauges.
- The built-in preview compiler was attempted, but its XeTeX-based engine rejects this project's existing Latin-1/pdfLaTeX setup. The manuscript's declared pdfLaTeX engine is used for the authoritative build; the project encoding was not changed.
- No commit or push was performed. PDE4ML, the compact edition, arXiv exports, and figure-generation notebooks were outside the edit scope.
