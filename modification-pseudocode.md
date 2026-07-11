# Pseudocode audit and corrections

## Scope

- Audited all 44 algorithm floats in the manuscript, including their mathematical assumptions, initialization, stopping rules, outputs, indexing, control flow, and consistency with the surrounding derivations.
- Checked every rendered algorithm page in the rebuilt 421-page PDF.
- Verified that every algorithm declares its inputs and outputs and that every `for`, `while`, and `if` body is visibly indented.

## Global presentation

- Restyled algorithm captions as `Algorithm X.Y: Title`, with the label and pseudocode keywords in a restrained blue that matches the book.
- Kept the body font at the manuscript font size, while improving hierarchy through colored keywords rather than smaller text.
- Strengthened and slightly widened the vertical rules that identify nested control-flow blocks.
- Standardized left alignment, rule spacing, indentation, punctuation after control statements, and the wording `iteration budget`.
- Preserved the ruled-float presentation and confirmed that no algorithm overflows a page or creates an overfull box.

## Correctness and precision

### Matching, Monge, and Kantorovich algorithms

- Made the concave one-dimensional matching branches explicit, indented blocks.
- Replaced the nonconstructive final step of circle matching by a finite search for a compatible cut, including a deterministic convention for antipodal arcs.
- Clarified the Hungarian augmentation steps without exceeding the supported nesting depth.
- Added the source atomlessness assumptions required by the Knothe--Rosenblatt conditional quantile construction.
- Made the optimal coupling an explicit input of displacement interpolation, matching the algorithm title and avoiding an implicit optimization step.
- Removed an obsolete duplicate label from the semi-discrete Laguerre algorithm.
- Defined Lloyd cells as a tie-broken Voronoi partition, so the update remains unambiguous for atomic measures and distance ties.
- Added deterministic tie-breaking to dynamic-time-warping backtracking.

### Duality and Sinkhorn algorithms

- Specified the square finite-dimensional setting of the auction algorithm and returned the prices together with the assignment, making the stated epsilon-complementary-slackness certificate explicit.
- Added finite iteration budgets to Sinkhorn, log-domain Sinkhorn, generalized marginal-penalty Sinkhorn, unbalanced Sinkhorn, cyclic Bregman projection, entropic barycenter, multi-marginal Sinkhorn, and Wasserstein--Procrustes iterations.
- Added missing iteration counters where a stopping condition previously had no finite safeguard.
- Rewrote the endpoint-to-path Schrodinger algorithm to separate the exact lifted path law from finite conditional bridge sampling; the sample count and all random draws are now explicit.
- Clarified that multi-marginal Sinkhorn uses the newest available scaling vectors in its Gauss--Seidel sweep and removed a residual/index notation collision.
- Added normalization of Gaussian-barycenter weights, a finite iteration budget, and a valid fallback output when tolerance is not reached.
- Strengthened the capacity-constrained KL-Dykstra stopping criterion: it now monitors the fixed-point defect in addition to marginal and capacity feasibility. Feasibility alone does not certify convergence to the KL projection.

### Quantum, dynamic, and learning algorithms

- Defined and returned explicit partial-trace residuals in exact quantum Bregman projection and Gurvits/operator scaling.
- Made flow-matching training fully reproducible at the pseudocode level by adding the initial parameter, learning rates, explicit stochastic-gradient update, trained parameter, and sampling field.
- Added the schedule endpoints, positivity assumptions, sample count, and endpoint-extension convention needed by exact Gaussian-mixture probability-flow sampling.
- Recast the one-step Wasserstein generator operation as the functional map update it actually computes, with optional architectural distillation stated separately.
- Added the differentiability and symmetry assumptions required by the displayed MMD particle gradients.
- Standardized the remaining particle, attention, Douglas--Rachford, low-rank, inverse-OT, and generalized-transport procedures for stepwise control-flow syntax.

## Verification

- Full `bibtex` plus two-pass `pdflatex` rebuild completed successfully.
- Final PDF: 421 pages, with all references resolved.
- Log checks found no overfull boxes, oversized floats, excessive nesting, unprocessed floats, or undefined references/citations.
- Structural audit: 44/44 algorithms contain explicit input and output declarations; all control-flow bodies and loop punctuation pass the consistency check.
- Source whitespace check passes for the edited style and section files.
