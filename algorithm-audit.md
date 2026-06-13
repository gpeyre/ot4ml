# Algorithm audit for pseudocode blocks

All active `alg` floats have been normalized to explicit pseudo-code form: every block states `Input` and `Output`, uses direct elementary commands (`Set`, `Solve`, `Update`, `For`, `While`, `If`, `Repeat`), and ends with a return or certification line. The LaTeX and MyST rendering now use an `Algorithm` float/admonition rather than prose-style procedure boxes.

Second enforcement pass: combined `End ...; Return` lines were split, lowercase `return` was eliminated, conditionals were rewritten as short `If ... then` branches, returned objects were named more explicitly, and the audit reports zero bare prose candidates inside active algorithm floats.

Third enforcement pass: all remaining inline `If ..., Return` and `If ..., break` shortcuts were expanded into explicit branches, semicolon-compressed commands were split into elementary steps, article-heavy command labels such as `Set the ...` or `Solve the ...` were shortened, and the cyclic Bregman specialization was moved before its projection loop. A strict scan now reports 42 active algorithm floats, 42 inputs, 42 outputs, 42 returns, and no flagged inline branch or prose-stop patterns.

Fourth presentation pass: all active control-flow bodies below `For`, `While`, `If`, `Else`, and `Repeat` statements are wrapped in scoped pseudo-code blocks. In the PDF these blocks are indented with a thin left rule, and in the MyST build the same structure is rendered as nested ruled blocks. Textual closure markers such as `End for`, `End while`, and `End if` are intentionally omitted: the indentation and left rule carry the scope.

Fifth spacing pass: displayed equations have been removed from all active pseudo-code blocks. Formula updates and assignments are written inline, and the algorithm style no longer adds special paragraph or display spacing around `Input`, `Output`, loop bodies, or nested blocks. The vertical spacing is therefore the ordinary text spacing of the algorithm float.

Scope: active manuscript files included by `latex/OT4ML.tex`. The files `latex/sections/barycenters.tex` and `latex/sections/estimation.tex` are present in the repository but are not currently input by the main book, so they are not counted here.

The style files now define `alg` as a custom ruled floating environment named `Algorithm`. This follows the standard book convention for mathematical pseudocode: a captioned float with muted horizontal rules above the caption, between the caption and the body, and below the body. The environment uses normal text spacing and inline mathematical pseudo-code rather than code syntax highlighting. The same visual convention is mirrored in the MyST build with a top-and-bottom ruled algorithm admonition.

## Implementation status

Status after this pass: all P0 algorithms from the recommended first batch, all P1 candidates listed in the audit, and additional algorithmic constructions from the one-dimensional, Kantorovich-geodesic, dual, graph, sliced, dynamic, barycenter, inverse-OT, gradient-flow and generative-model chapters have been added to the manuscript. The inserted blocks are short mathematical pseudocode blocks, and nearby prose now references the algorithm float where useful.

| Label | Location | Status | What was added |
|---|---|---:|---|
| `alg:one-dimensional-sorting` | `latex/sections/matching.tex`, Ch. 1 | done | Sorting of source and target points and equal-rank matching for convex one-dimensional costs. |
| `alg:circle-cut-assignment` | `latex/sections/matching.tex`, Ch. 1 | done | Cyclic ordering, scan over cyclic shifts/cuts, select minimum-cost cut, then unfold to the interval. |
| `alg:hungarian-primal-dual` | `latex/sections/matching.tex`, Ch. 1 | done | Dual labels, equality graph, alternating tree, slack update, and augmentation loop. |
| `alg:north-west-corner` | `latex/sections/kantorovich.tex`, Ch. 3 | done | Greedy residual mass sweep constructing a sparse feasible coupling. |
| `alg:weighted-one-dimensional-sweep` | `latex/sections/kantorovich.tex`, Ch. 3 | done | Sort weighted atoms and apply the north-west sweep to obtain the monotone optimal one-dimensional convex-cost plan. |
| `alg:auction-bidding` | `latex/sections/dual.tex`, Ch. 4 | done | Target prices, best and second-best reduced profits, bid update, reassignment, and stopping at complete assignment. |
| `alg:semidiscrete-laguerre-descent` | `latex/sections/semidiscr-w1.tex`, Ch. 5 | done | Compute Laguerre cells and masses, then update dual weights by the semi-dual gradient. |
| `alg:semidiscrete-stochastic-ascent` | `latex/sections/semidiscr-w1.tex`, Ch. 5 | done | Draw samples, identify active Laguerre cell, and apply the unbiased stochastic gradient update. |
| `alg:lloyd-quantization` | `latex/sections/semidiscr-w1.tex`, Ch. 5 | done | Alternate Voronoi assignment and centroid update for squared Euclidean quantization. |
| `alg:sinkhorn-scaling` | `latex/sections/sinkhorn.tex`, Ch. 7 | done | Positive scaling initialization, alternating `u <- a/(K v)` and `v <- b/(K^T u)`, and output `diag(u)Kdiag(v)`. |
| `alg:log-domain-sinkhorn` | `latex/sections/sinkhorn.tex`, Ch. 7 | done | Stabilized soft `c`-transform iterations in potentials using log-sum-exp. |
| `alg:unbalanced-sinkhorn` | `latex/sections/generalized-wasserstein.tex`, Ch. 9 | done | Damped generalized scaling with exponent `rho=tau/(tau+epsilon)`. |
| `alg:entropic-barycenter-sinkhorn` | `latex/sections/generalized-ot-problems.tex`, Ch. 10 | done | Update target scalings, compute the geometric-mean barycenter marginal, and update source scalings. |
| `alg:multimarginal-sinkhorn` | `latex/sections/generalized-ot-problems.tex`, Ch. 10 | done | Alternately enforce one marginal of the Gibbs tensor, with a warning about the full tensor-size bottleneck. |
| `alg:entropic-gromov-wasserstein` | `latex/sections/beyond-comparing-measures.tex`, Ch. 11 | done | Linearize the GW objective into a cost matrix and solve the entropic OT subproblem by Sinkhorn. |
| `alg:quantum-exact-bregman` | `latex/sections/beyond-comparing-measures.tex`, Ch. 11 | done | Exact but implicit alternating Bregman projections solving one partial-trace equation at a time. |
| `alg:quantum-gurvits-scaling` | `latex/sections/beyond-comparing-measures.tex`, Ch. 11 | done | Alternate congruence normalizations using matrix square roots for the two partial traces. |
| `alg:concave-line-local-indicators` | `latex/sections/matching.tex`, Ch. 1 | done | Recursive local-indicator removal for one-dimensional concave-cost assignment. |
| `alg:triangular-rearrangement` | `latex/sections/monge.tex`, Ch. 2 | done | Sequential conditional one-dimensional transports constructing the Knothe--Rosenblatt map. |
| `alg:birkhoff-von-neumann-decomposition` | `latex/sections/kantorovich.tex`, Ch. 3 | done | Repeated extraction of supported permutations from a bistochastic matrix. |
| `alg:cyclic-bregman-projections` | `latex/sections/sinkhorn-advanced.tex`, Ch. 8 | done | Alternating Bregman projections on two affine constraints, specialized to row/column KL projections. |
| `alg:benamou-brenier-douglas-rachford` | `latex/sections/dynamic-ot.tex`, Ch. 12 | done | Douglas--Rachford splitting for the convex momentum Benamou--Brenier discretization. |
| `alg:jko-minimizing-movement` | `latex/sections/wasserstein-gradient-flows.tex`, Ch. 13 | done | Implicit Wasserstein proximal step defining the minimizing-movement approximation. |
| `alg:empirical-wasserstein-particle-flow` | `latex/sections/wasserstein-gradient-flows.tex`, Ch. 13 | done | Particle ODE/explicit Euler discretization induced by the empirical Wasserstein metric. |
| `alg:mmd-particle-flow` | `latex/sections/wasserstein-gradient-flows.tex`, Ch. 13 | done | Kernel self-interaction plus teacher attraction update for MMD-type Wasserstein particle flows. |
| `alg:flow-matching-regression` | `latex/sections/transportation-models.tex`, Ch. 14 | done | Simulation-free velocity regression from interpolant samples followed by ODE sampling. |
| `alg:hard-c-transform-closure` | `latex/sections/dual.tex`, Ch. 4 | done | Exact hard `c`-transform best responses and closure, showing why the nonsmooth alternating scheme stalls. |
| `alg:graph-beckmann-network-simplex` | `latex/sections/semidiscr-w1.tex`, Ch. 5 | done | Network-simplex pivot view of the sparse graph Beckmann transshipment LP. |
| `alg:monte-carlo-sliced-wasserstein` | `latex/sections/generalized-wasserstein.tex`, Ch. 9 | done | Sample directions, project empirical measures, sort one-dimensional samples, and average projected costs. |
| `alg:lifted-min-sliced-matching` | `latex/sections/generalized-wasserstein.tex`, Ch. 9 | done | Search over projection directions, lift the sorted one-dimensional matching back to a feasible high-dimensional coupling. |
| `alg:one-step-wgf-generator-update` | `latex/sections/transportation-models.tex`, Ch. 14 | done | Fit a residual descent field and compose it into a one-step generator update. |
| `alg:self-corrected-drifting-particles` | `latex/sections/transportation-models.tex`, Ch. 14 | done | Attraction-minus-self-repulsion particle update using normalized kernel fields. |
| `alg:residual-attention-depth-evolution` | `latex/sections/transportation-models.tex`, Ch. 14 | done | Residual self-attention layer as explicit Euler transport of the empirical token measure. |
| `alg:least-square-velocity-reconstruction` | `latex/sections/dynamic-ot.tex`, Ch. 12 | done | Reconstruct the minimum-kinetic-energy Eulerian velocity by solving a weighted Poisson equation. |
| `alg:schrodinger-endpoint-path-lift` | `latex/sections/sinkhorn.tex`, Ch. 7 | done | Solve the static entropic endpoint problem and lift the endpoint coupling to a mixture of reference bridges. |
| `alg:gaussian-barycenter-fixed-point` | `latex/sections/generalized-ot-problems.tex`, Ch. 10 | done | Fixed-point iteration for the covariance of a Gaussian Wasserstein barycenter, with linear averaging of means. |
| `alg:inverse-ot-dual-gap-learning` | `latex/sections/generalized-ot-problems.tex`, Ch. 10 | done | Convex inverse-OT fitting by minimizing the complementary-slackness dual gap of an observed plan. |
| `alg:gaussian-sinkhorn-closed-form` | `latex/sections/sinkhorn-advanced.tex`, Ch. 8 | done | Closed-form computation of the Gaussian entropic coupling from singular values of the covariance product. |
| `alg:quantile-rearrangement-geodesic` | `latex/sections/monge.tex`, Ch. 2 | done | Quantile coupling, atomless Monge map, and one-dimensional Wasserstein geodesic by linear interpolation of quantiles. |
| `alg:plan-displacement-interpolation` | `latex/sections/kantorovich.tex`, Ch. 3 | done | Push an optimal quadratic transport plan by Euclidean interpolation to obtain the McCann geodesic, including the discrete split-mass formula. |
| `alg:certified-entropic-ot-accuracy` | `latex/sections/sinkhorn-advanced.tex`, Ch. 8 | done | Choose an entropic temperature and stop Sinkhorn when the dual gap certifies a prescribed additive accuracy for unregularized discrete OT. |
| `alg:gaussian-mixture-probability-flow-sampling` | `latex/sections/transportation-models.tex`, Ch. 14 | done | Exact probability-flow sampling for Gaussian-mixture noising paths using the closed-form mixture score. |

## Remaining candidates

No remaining candidates from this audit. Future algorithm additions should now be driven by new manuscript edits rather than by this initial sweep.

## Verification

Additional precision pass: all active algorithm floats were scanned for vague instructions such as "choose", "find", "run", generic "stopping criterion", and unspecified "estimation". These were replaced by explicit initializations, deterministic tie-breaking rules such as `min argmin`, residual-based `while` conditions, concrete empirical sums, and step-by-step parent-pointer updates where appropriate. Remaining nonstandard verbs denote exact operations such as sorting, projection, sampling from a specified distribution, or graph construction.

The current verification pass used

```sh
pdflatex -interaction=nonstopmode -halt-on-error OT4ML.tex
pdflatex -interaction=nonstopmode -halt-on-error OT4ML.tex
pdflatex -interaction=nonstopmode -halt-on-error CourseOT-compact.tex
node myst/scripts/sync-latex-boxes.js
npm run build
```

The second main-book pass resolves the algorithm references. The compact PDF still compiles, although it does not include `alg` floats. The MyST source chapters and deployed HTML contain `Algorithm` boxes and no stale `Procedure` boxes. The static MyST build directory was pruned to the 18 generated markdown payloads actually referenced by the current HTML pages. Remaining LaTeX warnings are the pre-existing font substitutions and underfull boxes; there are no undefined algorithm labels.
