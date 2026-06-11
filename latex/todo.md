# Todo Resolution Log

This file records the latest batch of manuscript and figure corrections and how they were addressed.

## Manuscript and Notation

- [done] One-dimensional Gaussian notation: replaced `s_\alpha,s_\beta` by `\sigma_\alpha,\sigma_\beta` in the Gaussian Monge discussion.
- [done] Linear-programming algorithms: promoted the material to a full subsection before arbitrary-measure relaxation, with background on the transportation simplex, network simplex, interior-point methods, complexity, and the distinction between vanishing log barriers and fixed entropic Sinkhorn regularization.
- [done] Log-barrier LP figure: added a new notebook and figure mirroring the entropic/slack-barrier geometry with a `-\log` barrier central path.
- [done] Network-flow paragraph: removed it from the matching section and integrated the relevant content into the new LP-algorithms subsection.
- [done] Color-transfer paragraph: moved the RGB/Lab color-transfer discussion and references next to the Monge color-transfer figure.
- [done] Sinkhorn convergence headings: renamed the convergence subsections to `Sinkhorn Convergence: Bregman View`, `Sinkhorn Convergence: Monotone Point of View`, `Sinkhorn Convergence: Sublinear Robust Rate`, and `Sinkhorn Convergence: Linear Hilbert Metric Rate`.
- [done] Topical maps result: added the monotone, translation-equivariant, variation-seminorm nonexpansiveness proposition, proof, contextual citation, and the soft-c-transform corollary before the Hilbert-metric contraction discussion.
- [done] Gaussian Sinkhorn rates: replaced the informal remark by a proved one-dimensional Gaussian convergence-rate proposition.
- [done] Sinkhorn divergences placement: moved the subsection to the end of the preceding entropic-regularization section.
- [done] Gaussian Sinkhorn divergence: added the debiased Gaussian formula and the associated smoothed Bures spectral expression, contrasting it with the unregularized Bures distance.

## Figures

- [done] Figure 7, McCann interpolation: regenerated with denser silhouette samples, farthest-point sampling/subsampling, and labels below the panels.
- [done] Figure 10, coupling matrices: added a black coupling box and tightened the marginal strips to the box boundary.
- [done] Figure 14, gluing lemma: tightened the marginal strips around the square matrices.
- [done] Figure 30, Sinkhorn marginal violation: removed the `half-steps` and `marginal error` axis labels and kept the limiting-plan block aligned with the error plot.
- [done] Figure 34, density-ratio regularizers: reduced the regularization scale and regenerated the coupling-support panels.
- [done] Figure 35, Sinkhorn debiasing: increased the number of atoms, ran the optimization longer, added mild confinement/clipping, and regenerated more regular final clouds.
- [done] Figure 36, empirical fluctuations: corrected the legend notation to use the Sinkhorn-divergence notation rather than the raw barred OT value.
- [done] Figure 39, sliced projections: assigned distinct colors to projection directions and reused the same colors for the corresponding one-dimensional projected densities.
- [done] Figure 41, linear OT coordinates: removed the reference background from the linearized barycenter panel and added a true OT/McCann midpoint panel.
- [done] Figure 42, spectral gauges: regenerated the trace and `\lambda_{\max}` gauge displays using two-disk and heart silhouettes, with coupling and density-interpolation rows.
- [done] Figure 43, barycenter grids: rebuilt the left grid from one-, two-, three-, and four-Gaussian one-dimensional inputs via averaged quantiles, and rebuilt the right grid from entropic Sinkhorn barycenters of the cat, two-disk, cross and clover asset shapes.
- [done] Figure 44, Gaussian covariance barycenters: strengthened the anisotropy in the right Bures-Wasserstein grid.
- [done] Figure 45, metric learning: increased the anisotropy in the strong-metric panel.
- [done] Figure 46, weak OT: regenerated using standardized disk/annulus clouds, fewer red atoms, and roughly three times more blue atoms.
- [done] Gromov-Wasserstein deformation figure: regenerated with a stronger final non-isometric deformation.
- [done] Figure 48, GW local distortion: regenerated the residual matrix as a white-to-black plot with a black box and kept the correspondence/matrix panels vertically aligned.
- [done] Benamou-Brenier geodesic: regenerated with farthest-point shape samples, contour-only density panels, tighter crop, smaller KDE bandwidth, and farthest-sampled black midpoint arrows.
- [done] Interaction-energy particle flows: regenerated with more particles, longer integration, smaller circular markers, and red-to-blue trajectory colors by curvilinear length.
- [done] Homogeneous ReLU mean-field flow: reworked after checking `aux/mlp/`; the figure now uses reduced coordinates `(|u|v_1,|u|v_2)` and shows only the Wasserstein particle gradient flow.
- [done] Figure 59, diffusion versus OT: regenerated with a target made of exactly three Dirac atoms and more displayed particles.
- [done] Figure 60, drifting model: integrated for longer, removed the right vector-field panel from the manuscript, and kept only trajectory panels.

## Verification

- [done] Re-executed the affected notebooks for spectral gauges, drifting trajectories, and GW distortion after the final corrections.
- [done] Rebuilt `latex/OT4ML.pdf` with `pdflatex` after the edits.
- [done] Scanned `latex/OT4ML.log` for LaTeX warnings, unresolved references/citations, rerun warnings, overfull/underfull boxes, extra alignment tabs, and fatal errors; the final scan is clean.
- [done] Rendered and visually spot-checked the changed pages, including the Monge, Kantorovich, Sinkhorn, spectral/barycenter/generalized-OT, GW, dynamic, gradient-flow, generative, and drifting figure pages.

## Second Polish Iteration

- [done] Rechecked the mathematical statements added in the previous pass, with particular attention to the topical-map variation estimate, the Gaussian Sinkhorn closed form, the smoothed Bures/Sinkhorn-divergence formula, and the one-dimensional Gaussian local rate.
- [done] Clarified the balanced KL reference-measure shift: for positive fixed marginals it changes the objective only by a constant, while the normalization becomes substantive again in unbalanced OT.
- [done] Removed the stale `\removed{...}` edit macro from the Sinkhorn text.
- [done] Made the Gaussian Sinkhorn limit proof explicit by noting that $\epsilon\log(1-s_i^2)\to0$ before taking the Bures limit.
- [done] Polished figure captions for the spectral gauge, barycenter-grid, weak-OT and GW-distortion figures so the text describes the actual visual construction more precisely.
- [done] Checked that every `\includegraphics` target referenced by the manuscript exists.
- [done] Rebuilt `latex/OT4ML.pdf` and scanned the final LaTeX log; no warnings, unresolved references/citations, rerun requests, overfull/underfull boxes, alignment errors or fatal errors were reported by the final scan.
- [done] Rendered and visually checked the affected Sinkhorn/Gaussian/generalized-OT/GW pages after the edits.

## Third Polish Iteration

- [done] Tightened Proposition~`prop-kl-shift` by making the positive-support convention explicit after removing zero-mass rows and columns.
- [done] Reordered the Sinkhorn dual-potential figure so it no longer interrupts the proposition announced by the preceding paragraph.
- [done] Polished the reference-measure discussion in the discrete and continuous Sinkhorn formulations: product references change balanced objectives only by constants under compatible absolute-continuity assumptions, while support still controls finite entropy.
- [done] Improved the transition and internal wording of the limiting-regularization proposition for clearer flow.
- [done] Rechecked active LaTeX and README/figure-roadmap files for stale edit macros, unresolved todo markers, typo artifacts, and missing `\includegraphics` targets.

## Fourth Polish Iteration

- [done] Strengthened the spectral Wasserstein proof by explicitly passing from the squared minimax identity to the supremum-of-pseudodistances formula for `\Wass_\gamma`, which makes the triangle inequality argument complete.
- [done] Clarified the Ky Fan/subspace-robust paragraph by explaining why the convex hull of rank-`k` projectors has the same support function on positive semidefinite displacement covariances.
- [done] Refined the spectral-gauge caption to say that the `\lambda_{\max}` panel approximates the robust formulation with finitely many directions, rather than presenting it as a generic linear-programming artifact.
- [done] Polished the Sinkhorn-divergence subsection: improved the debiasing motivation, labeled the asymptotics proposition, turned the large-temperature Hilbertian limit into a titled remark, and cleaned the positivity proof wording and continuous notation.
- [done] Turned the Gurvits/QOT warning into a titled remark emphasizing that operator scaling is a symmetric surrogate, not the exact entropic Bregman projection scheme.

## Fifth Polish Iteration

- [done] Rephrased the Fortet monotone convergence statement in projective terms, making clear that monotonicity is for representatives modulo additive constants.
- [done] Replaced the informal `decay epsilon` wording by the standard annealing/multiscale terminology.
- [done] Fixed the one-dimensional Gaussian Sinkhorn-rate proof punctuation around the completed-square integral.
- [done] Polished the sample-complexity opening to separate exact-OT dimension-dependent empirical rates from fixed-temperature Sinkhorn parametric fluctuations.
- [done] Cleaned the indentation in the empirical OT multiscale proof.

## Post-Audit Todo Resolution

- [done] Converted the untracked `latex/todo-new.md` list into an addressed status log and mirrored the substantive fixes here.
- [done] Turned the discrete coupling constraints into a titled definition and moved the coupling-segment figure next to this definition.
- [done] Regenerated `fig:kantorovich-coupling-polylines` with straight transport segments and updated the caption/gallery wording.
- [done] Strengthened the discrete gluing lemma by defining the glued marginal `R` both as a partial sum of the tensor and as `P diag(1/b) Q`, with proof of feasibility.
- [done] Replaced the duplicate strong-topology definition in the Kantorovich section by a recall of the earlier total-variation definition.
- [done] Promoted distributional robustness and `W_\infty` to a subsection, added the convexity statement for `W_p^p`, clarified that `W_p` is not generally convex for `p>1`, and added the empirical `W_\infty` robust-envelope formula.
- [done] Added classical Berry--Esseen and Stein-method references and context around the Wasserstein Berry--Esseen proposition.
- [done] Added the Memoli distance-profile lower bound for Gromov--Wasserstein, with proof and its use as an initialization.
- [done] Added a dual-attainment remark for Kantorovich duality using compactness of c-transforms.
- [done] Added the missing pitch sentence for the classical phi-divergence examples.
- [done] Changed the theorem/proposition/lemma/definition/remark/example counters and equation/figure counters to be section-indexed.
- [done] Replaced the regularization parameter `lambda` by `epsilon` in the other-convex-regularizers subsection and specialized the Bregman comparison to the product reference.
- [done] Aligned the Figure 36 notebook/roadmap wording with the manuscript caption: the regularization strength is consistently denoted by `\epsilon=.06`.
- [done] Rewrote the OT and MMD sample-complexity propositions in two-sample value-estimation form.
- [done] Made the IPM witness caption identify the plotted violet curves as normalized optimal dual witnesses.
- [done] Added the missing gallery entry and thumbnail for `fig:kantorovich-log-barrier-lp-geometry`.
- [done] Rebuilt the manuscript after the audit fixes and reran inventory checks: no missing graphics, no active unresolved figure-gallery mismatch, and no LaTeX warning matched in the final log scan.

## Todo-New Verification Pass

- [done] Rechecked `latex/todo-new.md`; it contained an addressed status log rather than a fresh unchecked todo list.
- [done] Polished the `W_p` convexity correction by making the non-convexity counterexample explicit at the midpoint.
- [done] Polished the Memoli profile lower-bound statement/proof so the exponent convention agrees with `\GW^p` and the final root step is explicit.

## Detailed Todo-New Pass

- [done] Performed an item-by-item audit of the current `latex/todo-new.md` entries against the manuscript.
- [done] Tightened the `W_\infty` robust-envelope proposition by making compactness of the closed perturbation balls explicit and using actual maximizers in the proof.
- [done] Cleaned the dual-norm total-variation example so it refers back to the original total-variation definition/proposition rather than relying on a later example.
- [done] Clarified the scope of the flat norm weak-metrization statement on compact metric spaces.
- [done] Expanded `latex/todo-new.md` with a detailed resolution audit recording the relevant manuscript locations and checks for each listed item.

## Second Detailed Todo-New Pass

- [done] Rechecked that `latex/todo-new.md` still contains no fresh unchecked todo entries, only the addressed audit log.
- [done] Tightened the empirical `W_\infty` robust-envelope proposition by stating the real-valued upper-semicontinuity assumption and using closed balls consistently in the statement and proof.
- [done] Clarified the Sinkhorn Bregman-comparison proposition by fixing the marginals before introducing the product reference `\xi=\alpha\otimes\beta`.
- [done] Rephrased the empirical OT sample-complexity statement from "typical" to "expected" empirical error to match the displayed expectation.
- [done] Cleaned a minor formatting inconsistency in the Memoli profile lower-bound proof after the mathematical correction.

## Pending Audit Issues Resolved

- [done] Corrected the discrete triangle-inequality proof wording so it no longer claims to be the arbitrary-measure proof.
- [done] Strengthened the empirical `W_\infty` robust-envelope proof by adding the Polish-space setting and proving existence of a closed-radius coupling from approximate optimal `W_\infty` couplings.
- [done] Renamed the internal `lam` parameter to `epsilon` in the density-ratio regularizer notebook so the implementation matches the manuscript notation.
