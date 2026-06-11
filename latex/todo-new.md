# Post-Audit Todo Status

This file used to contain the untracked active todo list audited in the previous pass. The actionable items have now been addressed or, where the original request was mathematically too strong, corrected in the manuscript with the precise statement.

- [done] Discrete couplings are now a titled definition, and the coupling-segment figure was moved next to it.
- [done] `fig:kantorovich-coupling-polylines` now exports straight segments rather than curved polylines.
- [done] The discrete gluing lemma now defines the glued coupling `R` as both `sum_j S_{i,j,k}` and `P diag(1/b) Q`, proves `R in U(a,c)`, and points to the figure.
- [done] Strong topology is no longer redefined in the Kantorovich section; it is recalled from the earlier total-variation definition.
- [done] Distributional robustness and `W_infty` is now a subsection with convexity and robust-envelope statements.
- [done] The manuscript now states the correct convexity fact: `W_p^p` is jointly convex, while `W_p` itself is not generally convex for `p>1`.
- [done] Berry--Esseen now cites classical Berry/Esseen references and a modern Stein-method reference.
- [done] The GW subsection now contains the Memoli profile lower bound with proof and initialization comment.
- [done] The log-barrier and coupling figures were corrected in the live roadmap/gallery.
- [done] The Hilbertian embedding comparison paragraph is present in the Linear OT subsection.
- [done] Flat norm context and references are present in the dual-norm section.
- [done] IPM witness caption now identifies the plotted dual witnesses.
- [done] Theorem-like counters and equation/figure counters are section-indexed.
- [done] Other convex regularizers now use `epsilon` as regularization parameter.
- [done] The Figure 36 roadmap and notebook now use the same `epsilon=.06` convention as the manuscript caption.
- [done] The Bregman-regularized value uses the product reference `alpha otimes beta`.
- [done] Sample-complexity propositions are written in two-sample value-estimation form.
- [done] Final build and inventory checks pass: no missing graphics, no active gallery mismatch, and no unresolved LaTeX warnings in the scanned log.

Residual note: the original request asked to prove convexity of `W_p`; the manuscript intentionally states the mathematically correct version, namely convexity of `W_p^p` and of `W_1`, with a counterexample for `W_p`, `p>1`.

## Latest Verification Pass

- [done] No fresh unchecked todo list was present in this file; it remains an addressed status log.
- [done] Tightened the `W_p` non-convexity counterexample by spelling out the midpoint violation for `t^{1/p}`.
- [done] Tightened the Memoli profile lower-bound proof by matching the exponent convention in the definition of `\GW^p` and explicitly taking the `p`-th root at the end.

## Detailed Resolution Audit

- [done] Discrete couplings: checked `def-discrete-couplings`, `eq-discr-couplings`, and `fig:kantorovich-coupling-polylines`; the definition and straight-segment figure are placed before the first discrete LP discussion.
- [done] Coupling figure: confirmed the notebook-generated panels use straight segments and that the manuscript caption describes line width and opacity as transported mass.
- [done] Discrete gluing lemma: checked `lem-gluing-discr`; the tensor construction, the zero-mass convention for `1/b_j`, the partial marginal `R`, and the matrix product `P diag(1/b) Q` are all present.
- [done] Strong topology: checked the topology paragraph; it now recalls total variation through `defn-total-variation` and `prop-tv-dual-measure` instead of redefining it.
- [done] DRO and `W_infty`: checked `sec-dro-wasserstein-infinity`; the section contains the DRO dual envelope, the convexity result, the precise warning that `W_p` is not convex for `p>1`, and the empirical `W_infty` envelope.
- [done] `W_p` convexity correction: improved `prop-wasserstein-cost-convex` by making the non-convexity counterexample explicit through the midpoint inequality `F(1/2)>(F(0)+F(1))/2`.
- [done] `W_infty` envelope proof: made the compact-ball hypothesis explicit and replaced the approximate selector argument by an attained maximizer argument for upper-semicontinuous losses.
- [done] Berry--Esseen context: checked the CLT subsection; the proposition is introduced as a Wasserstein form of the classical Berry--Esseen theorem and cites Berry, Esseen and a modern Stein-method reference.
- [done] Memoli profile lower bound: checked `prop-memoli-gw-profile-lower-bound`; the proof now explicitly uses the same exponent as `eq-gw-generic` and takes the final `p`-th root.
- [done] Log-barrier and coupling figures: checked the live figure references and roadmap status; no missing `includegraphics` targets were found in the final scan.
- [done] Linear OT Hilbertian comparison: checked `rem-three-hilbertian-measure-embeddings`; it distinguishes kernel mean embeddings, sliced Wasserstein quantile embeddings, and linear OT maps.
- [done] Flat norm context: checked the dual-norm section; the flat norm and Dudley metric are presented as bounded dual-norm variants, and this pass clarified the compact-space scope of the weak-metrization statement.
- [done] IPM witness caption: checked `fig:dualnorms-ipm-witnesses`; it identifies the violet curve as a normalized optimal dual witness for the IPM variational problem.
- [done] Counter numbering: checked `mystyle.sty`; equations, figures and theorem-like environments are section-indexed.
- [done] Other convex regularizers: checked `sec-sinkhorn-other-regularizers`; the regularization parameter is consistently `epsilon` in the manuscript and Figure 36 roadmap.
- [done] Bregman product reference: checked `prop-bregman-phi-dual-comparison`; the Bregman-regularized value uses `xi=alpha otimes beta` and contrasts this with density-ratio penalties.
- [done] Sample complexity: checked the advanced Sinkhorn sample-complexity subsection; exact OT, MMD and Sinkhorn statements are written as two-sample value-estimation rates.
- [done] Final verification: rebuilt the manuscript after the detailed pass and scanned the LaTeX log and graphics inventory.

## Second Detailed Pass

- [done] Rechecked that this file contains no fresh unchecked todo entries; it is still an addressed audit log.
- [done] Tightened the empirical `\Wass_\infty` robust-envelope result: the loss is now explicitly real-valued upper-semicontinuous, the formula uses closed perturbation balls throughout, and the proof consistently invokes compact closed balls to obtain maximizers.
- [done] Clarified the Bregman-vs-density-ratio comparison by explicitly fixing the marginals before setting the product reference `xi=alpha otimes beta`.
- [done] Rephrased the empirical OT sample-complexity proposition so that the text says "expected empirical error", matching the displayed expectation.
- [done] Cleaned the formatting of the Memoli profile lower-bound proof after the exponent/root correction.

## Pending Audit Issues Resolved

- [done] Removed the misleading phrase "arbitrary measures" from the discrete Wasserstein triangle-inequality proof; that proof is now explicitly described as the discrete setting before the general Polish-space proof.
- [done] Made the `\Wass_\infty` robust-envelope proof rigorous by assuming a Polish metric space and extracting a closed-ball coupling from approximate `\Wass_\infty` couplings before disintegration.
- [done] Renamed the internal notebook parameter `lam` to `epsilon` in `sinkhorn-entropic-versus-quadratic-regularization.ipynb`, aligning the implementation vocabulary with the manuscript notation.

## Corrective Figure Pass After Stale-Output Audit

- [done] Figure 9.6 / roadmap Figure 41, spectral gauges: corrected the stale cat-to-two-disks implementation. The live notebook, exported PDFs, caption and gallery thumbnail now use the intended two-disks-to-heart construction.
- [done] Figure 10.1 / roadmap Figure 42, barycenter grids: regenerated the figure rather than only updating the checklist. The left panel now has visibly distinct one-, two-, three- and four-mode quantile barycenters, and the right panel uses entropic Sinkhorn barycenters of the cat, two-disk, cross and clover assets with exact corner silhouettes preserved.
- [done] Ran a deeper stale-output audit after the user pointed out that several requested edits had only reached notebook code, not the live PDFs. The result is recorded in `audit-figure-edits.md`.
- [done] Re-executed the affected notebooks for Figures 10.2, 10.3, 10.4, 12.1, 13.3, 13.5, 14.3, 14.4 and 14.5, and visually checked the regenerated panels.
- [done] Removed stale alias exports from the notebooks and archived the unused live PDFs under `latex/figures/removed/stale-panels/`.
- [done] Verified the Gromov correction: Figure 11.1 carries the larger deformation in the right panel, while Figure 11.2 uses the milder local distortion and residual matrix.
- [done] Rebuilt `OT4ML.pdf` twice, scanned the LaTeX log, rendered the affected manuscript pages, and checked the global graphics inventory: 212 included graphics, no missing graphics, and no unreferenced live PDFs.
