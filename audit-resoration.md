# Restoration Audit

This audit compares the previous manuscript `latex/CourseOT.pdf`, the current manuscript
`latex/OT4ML.pdf`, and the compact source in `compact/`. It is deliberately audit-only:
no manuscript source has been edited in this pass.

The requested filename was `audit-resoration.md`, so this file keeps that spelling.

## Method

- Extracted layout-preserving text from `latex/CourseOT.pdf`, `latex/OT4ML.pdf`, and `compact/CourseOT-compact.pdf` using `pdftotext -layout`.
- Compared section and subsection headings from the extracted PDFs.
- Compared old subsections against the current PDF using word-shingle coverage to identify likely losses.
- Inspected current LaTeX sources in `latex/sections/` and compact sources in `compact/sections/` to separate real losses from renamed or reorganized material.
- Checked which LaTeX section files exist but are not currently included by `latex/OT4ML.tex`.

## Quantitative Signals

The old PDF is longer in text content, even though the current PDF contains many new figures:

| source | pages | extracted words |
| --- | ---: | ---: |
| `latex/CourseOT.pdf` | 131 | 67,381 |
| `latex/OT4ML.pdf` | 125 | 55,759 |
| `compact/CourseOT-compact.pdf` | 38 | 30,214 |

Low shingle coverage does not prove that content is missing, because several sections were rewritten. It is useful as a triage signal. The strongest low-coverage old subsections are:

| old subsection | coverage against current | audit interpretation |
| --- | ---: | --- |
| `2.6 Vector Quantiles and Linearized Transport` | 0.01 | Mostly missing as a bridge between 1-D quantiles, triangular maps, and LOT. |
| `2.7 Gaussian Measures and the Bures Metric` | 0.01 | Formula retained, but proofs and Bures metric properties mostly lost. |
| `6.3 Optimal Quantization` | 0.02 | Current section has a Lloyd figure and short text, but not the old derivation. |
| `2.3 Monge's Formulation` | 0.03 | Current section compressed several propositions and examples. |
| `2.4 Existence and Uniqueness of the Monge Map` | 0.03 | Some Brenier material kept, but important explanatory remarks/proofs were lost. |
| `9.4 Sliced Wasserstein` | 0.03 | Definition and figures kept, but metric/topological results are missing. |
| `9.1 Unbalanced OT` | 0.06 | Current section kept the main formulation, but lost dual/local/conic details. |
| `8.2 Gaussian Sinkhorn Problems` | 0.07 | Current has only a Gaussian-rate remark, not the Gaussian Sinkhorn problem itself. |
| `10.1 Evolutions over the Space of Measures` | 0.14 | Current has continuity and least-square velocity, but lost non-uniqueness and Dacorogna--Moser discussion. |
| `9.2 OT Barycenters` | 0.27 | Current barycenter section is improved visually, but lost barycenter-specific Sinkhorn scaling. |
| `9.8 Gromov Wasserstein` | 0.31 | Current keeps definition and figures, but lost metric proof/geodesics/solver details. |

## Structural Findings

Two source files in `latex/sections/` are not currently input by `latex/OT4ML.tex`:

- `latex/sections/estimation.tex`
- `latex/sections/barycenters.tex`

This does not mean that all their content is lost. Barycenters have been partly absorbed into `latex/sections/generalized-ot-problems.tex`, and sample complexity has been partly absorbed into `latex/sections/sinkhorn-advanced.tex`. Still, both orphaned files contain recoverable material that should be mined carefully.

The current global structure is better than the old one in several respects:

- It has a cleaner split into generalized Wasserstein distances, generalized OT problems, beyond scalar measures, dynamic OT, Wasserstein gradient flows, and transportation models.
- It contains many new figures that should be preserved.
- It has newer material on spectral/robust Wasserstein, quantum OT, Gaussian closures, one-step generative models, and transformers.

The restoration should therefore be additive and surgical. The old section order should not be restored wholesale.

## Priority Restoration Items

### 1. Monge Problem Between Measures

Current location: `latex/sections/monge.tex`

Recoverable sources:

- `latex/CourseOT.pdf`, old Sections 2.3--2.7.
- `compact/sections/monge.tex`.

Current status:

- The current section has a good modern shape: measures, push-forwards, Monge maps, quantiles, Brenier, Gaussian formula, regularity, linearized Monge--Ampere, triangular rearrangements, and figures.
- However, several old propositions were compressed into prose or removed.

Content to restore:

- **Empirical Monge maps are matchings.** Restore a compact proposition showing that if
  `alpha = n^{-1} sum_i delta_{x_i}` and `beta = n^{-1} sum_j delta_{y_j}` with distinct atoms, then any feasible Monge map induces a permutation, and conversely. This should sit after the continuous Monge problem definition. It is pedagogically important because it closes the loop with Section 1.
- **Directed Monge distance.** Restore the proposition that `\tilde\Wass_p` is a directed extended distance: nonnegative, separates points, satisfies the triangle inequality, but may be infinite and is not symmetric. The current notation table still references `\tilde\Wass_p`, so the result should be explicit.
- **Failure and asymmetry of Monge maps.** Keep the current short Dirac-splitting explanation, but enrich it with the old examples: single atom cannot split, discrete source cannot generally map to an absolutely continuous target, and a Monge constraint can be empty or fail to attain the infimum.
- **Quantile push-forward and 1-D formulas.** The current monotone-rearrangement proposition is good, but it does not contain the old full formulas
  `\Wass_p^p(alpha,beta)=int_0^1 |F_alpha^{-1}(r)-F_beta^{-1}(r)|^p dr`
  and, for `p=1`,
  `\Wass_1(alpha,beta)=int_R |F_alpha(x)-F_beta(x)| dx`.
  Restore them as a proposition after the current quantile map proposition. This will also support the barycenter and sliced-Wasserstein sections.
- **1-D Gaussian transport.** Restore the short formula
  `\Wass_2^2(N(m_alpha,s_alpha^2),N(m_beta,s_beta^2))=(m_alpha-m_beta)^2+(s_alpha-s_beta)^2`
  and the contrast with KL, where singular Gaussians are infinitely distant. This is a simple illustrative case and should be an `example`.
- **Affine push-forward of Gaussians.** Current text states the affine map and Bures formula but does not prove the covariance push-forward condition. Restore the proposition `T_\sharp alpha=beta iff A Sigma_alpha A^T=Sigma_beta`, followed by the current Brenier/Bures formula.
- **Bures metric properties.** Restore the old proposition that the Bures term is a metric on positive semidefinite covariances and that `\Bb^2` is jointly convex. The Procrustes proof from compact is clean and should be reused in compressed form.
- **Diagonal covariance/Hellinger geometry.** Restore the remark that, for diagonal covariance matrices, Bures is the Euclidean distance between square roots. This is a valuable bridge to Hellinger geometry and unbalanced OT.
- **Vector quantiles and linearized transport.** The current text has Knothe--Rosenblatt triangular rearrangements and later has Linear OT in `dual-norms.tex`, but the old bridge explaining vector quantiles and linearized transport is missing. Restore it as a short paragraph after triangular rearrangements, with a cross-reference to the Linear OT subsection. Do not duplicate the full LOT section.
- **Monotone fields need not be gradients.** Current Kantorovich has a parenthetical note about rotations. The old Monge section had a concrete rotation example. Restore as a short remark near Brenier/monotonicity, or keep in Kantorovich if that is the better local flow.

Do not restore:

- The old longer section split `Monge's Formulation` / `Existence and Uniqueness` verbatim. The current consolidated `Monge Maps` subsection is better.
- Old figure placeholders. Keep the new figure suite.

### 2. Kantorovich Relaxation

Current location: `latex/sections/kantorovich.tex`

Recoverable sources:

- `latex/CourseOT.pdf`, old Section 3.
- `compact/sections/kantorovich.tex`.

Current status:

- The current section preserves much of the important material: discrete couplings, continuous couplings, sparse plans, cyclical monotonicity, interpolation by plans, Wasserstein metric proofs, topology, DRO, and CLT.
- It has new useful figures.
- A key LP/extreme-point thread has been lost.

Content to restore:

- **Permutation matrices as couplings.** Reintroduce the notation `P_sigma` and the identification of assignments with permutation matrices, but do it compactly.
- **Birkhoff--von Neumann theorem.** Restore the theorem `Extr(B_n)=Perm_n` and a concise cycle-splitting proof. This is the clean proof that the Kantorovich relaxation is exact for square uniform assignment problems.
- **Extreme minimizers for linear programs.** Restore either as a small lemma or as part of the Birkhoff theorem proof: a linear objective over a compact polytope admits an extreme-point minimizer.
- **Kantorovich recovers matching.** Add the corollary that when `m=n` and `a=b=1/n`, there exists an optimal Kantorovich plan that is a permutation matrix and hence solves the matching problem.
- **Probabilistic interpretation.** Compactly restore the statement
  `MK_c(alpha,beta)=min E[c(X,Y)]` over random variables `X~alpha`, `Y~beta`. This is conceptually useful and was present in the old text.
- **Monge--Kantorovich equivalence under Brenier.** The current Brenier theorem already says the optimal plan is graph-induced, but a short reminder in the Kantorovich section would clarify when the relaxation is tight.

Do not restore:

- The older full "Relaxation for Arbitrary Measures" subsection layout. The current section already handles continuous plans and gluing more coherently.
- Duplicate proof of support definition if `def:support` in the Monge section remains authoritative.

### 3. Semi-Discrete OT, Quantization, and W1

Current location: `latex/sections/semidiscr-w1.tex`

Recoverable sources:

- `latex/CourseOT.pdf`, old Section 6.3.
- `compact/sections/semidiscr-w1.tex`.

Current status:

- Current semi-discrete material has Laguerre cells, semi-dual gradient, a Lloyd figure, and W1/Beckmann graph material.
- The old stochastic-optimization and quantization derivations are mostly missing.

Content to restore:

- **Stochastic semi-dual optimization.** Restore the old formulation
  `E(g)=int E(g,x) d alpha(x)` and the stochastic gradient
  `(1_{Laguerre_j(g)}(x)-b_j)_j`.
  Include the SGD update and a short comment on step schedules and the `O(1/sqrt(l))` concave stochastic optimization rate. This is important for ML readers because it connects semi-discrete OT to sampling.
- **Optimal quantization as a variational problem.** Restore the definition
  `Q_m(alpha)=min_{Y,b} W_p(alpha, sum_j b_j delta_{y_j})`
  and the reduction, after optimizing over weights, to the Voronoi energy
  `F(Y)=int min_j c(x,y_j) d alpha(x)`.
- **Centroid condition.** Restore the condition that, for the quadratic cost, each codepoint should be the centroid of its Voronoi cell. The current Lloyd paragraph says this informally but lacks the mathematical statement.
- **1-D quantization case.** Restore the simple statement that in one dimension the optimal sampling points are obtained from quantiles, at least in the equal-weight quadratic/monotone setting.

Do not restore:

- Long algorithmic discussion or benchmarks. The manuscript should remain conceptual and figure-driven.

### 4. Advanced Entropic Regularization

Current location: `latex/sections/sinkhorn-advanced.tex`

Recoverable sources:

- `latex/CourseOT.pdf`, old Sections 8.1--8.2.
- `compact/sections/sinkhorn-advanced.tex`.

Current status:

- Current section has discrete dual, soft transforms, other regularizers, convergence, Sinkhorn divergences, and sample complexity.
- It lost some continuous-dual and Gaussian-Sinkhorn material.

Content to restore:

- **Continuous entropic dual and soft transforms.** Restore the continuous dual
  `sup_{f,g} int f d alpha + int g d beta - epsilon int (exp((f+g-c)/epsilon)-1) d alpha d beta`
  and the corresponding continuous soft `c`-transforms. This should follow the discrete soft-transform paragraph.
- **Existence and uniqueness of entropic dual potentials.** Restore the compact proof using normalization, oscillation bounds, equicontinuity of soft transforms, Arzela--Ascoli, and uniqueness modulo additive constants.
- **Convexity property for quadratic cost.** Restore the remark that for `c(x,y)=-<x,y>`, the soft transform preserves concavity, and for the quadratic cost the optimal potentials are quadratic minus convex potentials.
- **Gaussian Sinkhorn problems.** The current `Gaussian rates` remark is not enough. Restore the old subsection that explains that, for Gaussian marginals and quadratic cost, entropic OT has quadratic potentials and a closed finite-dimensional covariance problem. Include the covariance term and the limit as `epsilon -> 0` toward the Bures term.
- **Keep the current scalar-rate remark.** It is useful, but it should become a continuation of the restored Gaussian Sinkhorn discussion, not the only Gaussian content.

Do not restore:

- Excessively long finite-dimensional algebra if it disrupts the flow. The closed-form statement and the limiting connection to Bures are the essential parts.

### 5. Generalized Wasserstein Distances

Current location: `latex/sections/generalized-wasserstein.tex`

Recoverable sources:

- `latex/CourseOT.pdf`, old Sections 9.1, 9.4, 9.5.
- `compact/sections/extensions.tex`.

Current status:

- Current section has a good high-level split: unbalanced OT, sliced Wasserstein, spectral/robust Wasserstein.
- The spectral/robust subsection is newer and should be kept.
- Unbalanced and sliced subsections lost important theory.

Content to restore in unbalanced OT:

- **Small-transport-scale KL limit.** Restore the proposition that for KL marginal penalties,
  `tau^{-1} UW_{c,tau}` converges, as `tau -> 0`, to the Hellinger-type common-marginal problem
  `inf_rho KL(rho|alpha)+KL(rho|beta)`, equal to `int (sqrt rho_alpha - sqrt rho_beta)^2` for densities.
- **Dual of unbalanced OT.** Restore the dual formula with `-D^*_{\psi_1}(-f|alpha)-D^*_{\psi_2}(-g|beta)` under `f \oplus g <= c`.
- **Reverse/local-cost formulation.** The current section defines `L_c` and `H_c`, but the old reverse formulation explains the density ratios and singular terms. Restore a compact version to make the homogeneous formula less mysterious.
- **Homogenization proof.** Current has a cone theorem but not the old "homogenization does not change the cost" proposition. Restore the essence, possibly folded into the theorem proof.
- **Explicit cone metrics.** Restore the examples for KL/Hellinger--Kantorovich, Gaussian-Hellinger type, and TV/partial-transport type costs. They give intuition for the abstract cone theorem.

Content to restore in sliced Wasserstein:

- **Metric properties.** Restore a proposition that `SW_p` is a distance on `P_p(R^d)`, metrizes weak convergence plus `p`-moment convergence, and satisfies `SW_p <= W_p`.
- **Cramer--Wold proof.** Include the compact argument: equality of almost all projected laws implies equality of characteristic functions and hence equality of measures.
- **Sharp `p=2` projection bound.** Restore the bound `SW_2^2 <= d^{-1} W_2^2` under uniform sphere measure.
- **Hilbert embedding for `SW_2`.** Restore the remark that `SW_2` embeds measures into fields of projected quantiles.
- **Bounds for max/min/subspace variants.** Current defines variants but does not prove the basic inequalities. Restore them compactly.

Do not restore:

- Old subspace robust notation if it conflicts with the current improved spectral gauge formulation. The current spectral gauge treatment is mathematically cleaner and should remain the main presentation.

### 6. Generalized OT Problems: Barycenters and Multimarginal OT

Current location: `latex/sections/generalized-ot-problems.tex`

Recoverable sources:

- `latex/CourseOT.pdf`, old Sections 9.2--9.3.
- `latex/sections/barycenters.tex` (orphaned).
- `compact/sections/extensions.tex`.

Current status:

- The current barycenter subsection has good exposition and new figures.
- Gaussian and discrete barycenter existence is present.
- The old barycenter-specific Sinkhorn algorithm is mostly absent.

Content to restore:

- **Discrete barycenter LP.** Restore the formulation with unknown barycenter weights `a` and couplings `P_s`:
  `min_{a,(P_s)} sum_s lambda_s <P_s,C_s>` with row marginals equal to `a` and column marginals fixed to `b_s`.
- **Entropic barycenter formulation.** Restore the entropic problem
  `min_a sum_s lambda_s MK^epsilon_{C_s}(a,b_s)`.
- **KL projection formulation.** Restore the equivalent problem over couplings with common row marginal:
  `P_1 1 = ... = P_S 1`.
- **Generalized Sinkhorn barycenter updates.** Restore the scaling form
  `P_s=diag(u_s) K_s diag(v_s)` and the updates
  `v_s <- b_s/(K_s^T u_s)`,
  `a <- prod_s (K_s v_s)^{lambda_s}`,
  `u_s <- a/(K_s v_s)`.
- **Dual of entropic barycenters.** Restore at least the proposition statement and the short Lagrange-multiplier proof, or a compressed derivation if space is tight.

Do not restore:

- A separate `Barycenters` section unless the current structure is changed intentionally. The material fits better inside `Generalized OT Problems`.

### 7. Beyond Comparing Measures: Gromov--Wasserstein

Current location: `latex/sections/beyond-comparing-measures.tex`

Recoverable sources:

- `latex/CourseOT.pdf`, old Section 9.8.
- `compact/sections/extensions.tex`.

Current status:

- Current section has a strong start: discrete GW, general setting, Euclidean GW controlled by W, figures, and fused GW.
- It lacks some theoretical closure and solver details from compact/old.

Content to restore:

- **GW metric modulo isometries.** Restore a theorem stating that GW defines a distance between metric-measure spaces modulo measure-preserving isometries. Include the compact proof: zero distance gives an isometric support relation; triangle inequality follows by gluing couplings and Minkowski.
- **GW geodesics.** Restore the short remark defining interpolated distances on the product support:
  `d_t((x0,x1),(x0',x1'))=(1-t)d_0(x0,x0')+t d_1(x1,x1')`.
- **Entropic GW solver.** Restore the majorization step where one linearizes the quadratic GW objective at the current coupling and solves an entropic OT subproblem with cost
  `C^k = D^{\odot 2} a 1^T + 1 (D'^{\odot 2} b)^T - 2 D P^k (D')^T`
  in the squared-loss case. This is not a benchmark; it is the basic algorithmic intuition for GW.

Do not restore:

- Long implementation details or convergence claims not present in the old manuscript unless carefully verified.

### 8. Dynamic OT and Measure Evolutions

Current locations:

- `latex/sections/dynamic-ot.tex`
- `latex/sections/wasserstein-gradient-flows.tex`
- `latex/sections/transportation-models.tex`

Recoverable sources:

- `latex/CourseOT.pdf`, old Section 10.1.
- `compact/sections/grad-flows.tex`.

Current status:

- The old Section 10 has been split in a reasonable way.
- Current dynamic OT contains continuity equation, least-energy velocities, Benamou--Brenier, path-space formulation, and dynamic extensions.
- Current transportation models contain flow matching and diffusion material.
- Some conceptual material about inverting a measure curve into a velocity field has been lost.

Content to restore:

- **Non-uniqueness of velocities.** Restore the old explanation that a measure curve `alpha_t` does not determine a unique `v_t`; the ambiguity is the divergence-free subspace
  `{v : div(alpha_t v)=0}`.
- **Dacorogna--Moser inversion.** Restore the formula
  `v_t = - alpha_t^{-1} nabla Delta^{-1}(partial_t alpha_t)`
  and the warning that it is ill-defined where `alpha_t` vanishes and is not generally a gradient field.
- **Least-square inversion derivation.** Current states the weighted Poisson equation, but the old source derives it through a Lagrange multiplier and shows why the minimizer is a gradient field. Restore a compact derivation immediately before or after `eq:least-square-field-explicit`.
- **Connection to flow matching.** Current already explains this later; add a cross-reference so the reader understands that flow matching avoids the constrained inversion by choosing a parametric interpolant.

Do not restore:

- Duplicate the old full "Wasserstein (gradient) Flows" section. The current split is better.

### 9. Wasserstein Estimation and Losses

Current status:

- `latex/sections/estimation.tex` exists but is not input by `latex/OT4ML.tex`.
- Sample complexity has been partly integrated into `latex/sections/sinkhorn-advanced.tex`.
- Some applied-statistical material appears in `latex/sections/kantorovich.tex` and `latex/sections/transportation-models.tex`, but the old coherent estimation section is absent.

Recoverable source:

- `latex/sections/estimation.tex`.

Content to restore:

- **Wasserstein loss as model fitting.** Restore the setup
  `min_theta MK_c(alpha_theta,beta)` and explain when it is convex in histogram/mixture weights but non-convex for general parameterized generators.
- **Density fitting and MLE comparison.** Restore the comparison with maximum likelihood, especially the failure of KL/MLE when model or data distributions are singular or densities are inaccessible. This is highly relevant to ML readers.
- **Push-forward generative models.** Restore the formulation `alpha_theta=(h_theta)_# zeta` and the explanation that samples are easy while densities are often intractable.
- **Dual-loss viewpoint.** Restore the generic dual loss formula with potential class `Potentials`, connecting OT, dual norms, and adversarial losses.
- **Minimum Kantorovich estimators.** Restore the terminology and references, but keep it concise.
- **Wasserstein derivatives.** Restore the Eulerian first variation and Lagrangian chain rule:
  `partial_theta L(alpha_theta,beta)=int grad f_theta(h_theta(z)) partial_theta h_theta(z) d zeta`.
- **Sample complexity.** Do not duplicate the current sample-complexity section. Instead, keep only the estimation framing and cross-reference the current advanced Sinkhorn sample complexity subsection.

Recommended placement:

- Either add a compact subsection near the end of `Kantorovich Relaxation` after topology/applications, or create a short section before `General Models via Transportation`.
- Avoid reintroducing a long separate chapter unless the overall book structure is meant to expand.

## Secondary Restoration Items

These are useful but less urgent than the items above.

- Restore the old "continuous dual and soft transforms" references in the notation table after the Sinkhorn restoration, if equation numbers change.
- Check whether the current notation table references results that are only implicit, for example `\tilde\Wass_p`, continuous Sinkhorn potentials, `\SW_p`, and barycenter scaling variables.
- When restoring Bures and Gaussian Sinkhorn material, ensure notation does not conflict with the current Gaussian-closure notation in `latex/sections/transportation-models.tex`.
- When restoring unbalanced OT, avoid duplicating the phi-divergence discussion in `latex/sections/dual-norms.tex`; cross-reference it instead.
- When restoring GW solver details, make clear it is a majorization/linearization algorithmic principle, not a benchmark comparison.

## Content That Should Not Be Rolled Back

The following current material appears newer or stronger than the old manuscript and should be preserved:

- The new figure-rich presentation throughout `latex/sections/`.
- The current split into `generalized-wasserstein`, `generalized-ot-problems`, `beyond-comparing-measures`, `dynamic-ot`, `wasserstein-gradient-flows`, and `transportation-models`.
- Spectral and robust Wasserstein via monotone gauges and polar robust formulation.
- Quantum OT finite-dimensional formulation, entropic regularization, Bregman iterations, and Gurvits/operator-scaling distinction.
- One-step generative models and normalized drifting fields.
- Gaussian closures as finite-dimensional test cases in `transportation-models`.
- Transformer token measure evolution.
- New figures and captions in `latex/figures/` and `notebooks-figures/`.

## Suggested Restoration Order

1. Restore orphaned/self-contained mathematical items that are clearly missing: Monge propositions, Birkhoff matching corollary, semi-discrete quantization/SGD, barycenter Sinkhorn updates.
2. Restore theory that supports current definitions: sliced metric properties, unbalanced dual/homogeneous/cone details, Bures metric properties, continuous Sinkhorn dual.
3. Restore ML-facing estimation material in a compact form.
4. Restore GW metric/geodesic/solver material.
5. Re-run notation-table consistency after all insertions.
6. Compile and check that no old equation labels collide with current labels.

## Label and Integration Cautions

- Several old labels are reused or changed in the current manuscript. Restoring text from compact verbatim will likely create duplicate labels such as `eq-wass-discr`, `eq-barycenter-generic`, `eq-sinkhorn-bary`, `eq-bary-opt`, `eq-soft-c-1`, and `eq-soft-c-2`.
- The compact source sometimes uses old section references such as `Chapter~\ref{c-algo-semidiscr}` that do not exist in the current article structure. These must be rewritten.
- The old text sometimes says "chapter" while the current manuscript uses article-style sections. Use "section" throughout.
- Do not reintroduce old figure placeholders or old section numbers.
- Prefer restoring as titled propositions, remarks, and examples, matching the current polished style.

## Executive Summary

The largest real losses are not in the new figures or the new high-level structure; those should stay. The losses are mostly compact mathematical bridges and proof blocks that were present in the old manuscript and compact notes:

- Monge: directed Monge distance, empirical maps as matchings, full 1-D formulas, Gaussian/Bures proofs.
- Kantorovich: Birkhoff--von Neumann and exactness of the LP relaxation for matching.
- Semi-discrete: stochastic semi-dual optimization and the formal quantization problem.
- Sinkhorn advanced: continuous entropic dual and Gaussian Sinkhorn closed forms.
- Generalized Wasserstein: unbalanced dual/cone details and sliced metric/topological properties.
- Barycenters: entropic barycenter Sinkhorn scaling.
- Gromov: metric modulo isometry, geodesics, and entropic GW majorization.
- Estimation: Wasserstein losses, MLE failure for singular generative models, and Wasserstein derivatives.

These should be integrated back without undoing the current structure.
