# Audit of CourseOT Content Still Missing from OT4ML

Date: 2026-06-11

Compared files:
- `latex/CourseOT.pdf`, previous manuscript, 131 pages.
- `latex/OT4ML.pdf`, current manuscript, 158 pages.

Scope: mathematical content from `CourseOT.pdf` that is absent from the current `OT4ML.pdf`. This audit ignores bibliography ordering, notation-table formatting, figure placement, and purely stylistic rewrites unless they change mathematical content.

## Audit Verdict and Labels

Global verdict: no high-confidence missing mathematical content from `CourseOT.pdf` remains absent from the current manuscript.

Labels used below:
- `covered`: the mathematical content is present in the current manuscript.
- `renamed`: the content is present under a different statement or subsection title.
- `strengthened`: the current manuscript gives a more general, more explicit, or better-proved version.
- `reorganized`: the content is present but moved into the new section structure.
- `soft gap`: a concrete old pedagogical specialization is no longer displayed verbatim, although the general mathematical statement is present.
- `missing`: no current counterpart was found. No item receives this label in this audit.

## Executive Summary

I do not find any high-confidence missing named mathematical result from `CourseOT.pdf`.

All CourseOT propositions, theorems, corollaries, definitions, examples, and remarks that carry mathematical content have a counterpart in the current manuscript. Many have been moved, renamed, or strengthened. The main restoration-sensitive areas that were previously at risk are now present:

- CourseOT 2.3-2.7 on Monge maps, Brenier, quantiles, vector quantiles and Gaussian/Bures geometry.
- CourseOT 3.1-3.3 on discrete Kantorovich relaxation, arbitrary measures and c-cyclical monotonicity.
- CourseOT 5.4 and 6.2-6.4 on c-transforms, semi-discrete OT, quantization and W_1.
- CourseOT 7.1-7.2 on IPMs, RKHS norms and MMD.
- CourseOT 8.1-8.2 on Sinkhorn duals, continuous soft transforms and Gaussian Sinkhorn.
- CourseOT 9.* extensions, now split across generalized Wasserstein distances, generalized OT problems and beyond-comparing-measures.
- CourseOT 10.1-10.8 on dynamic OT, Benamou-Brenier, Wasserstein gradient flows, MLP mean-field flows, generative models, transformers and Gaussian closures.

The only remaining issue is not missing mathematics: CourseOT 10.5 displayed a scalar empirical two-layer MLP specialization that the current text replaces by a more general population/vector-output formulation. Restoring the scalar display would be pedagogically useful, but is optional.

## Method

1. Extracted structured text from both PDFs using `pdftotext -layout` and `pdftotext -raw`.
2. Parsed CourseOT subsection headings and compared each subsection against the current PDF with TF-IDF passage matching.
3. Extracted all named mathematical blocks from both PDFs:
   - `Definition`
   - `Proposition`
   - `Theorem`
   - `Corollary`
   - `Remark`
   - `Example`
4. Manually inspected all low-similarity flags and all renamed mathematical blocks in the LaTeX source.

The automated pass flagged several sections, mostly because the current manuscript has new figures, renamed statements, stronger proofs, or more general notation. Manual inspection resolved these as present.

The current manuscript source set was taken from `latex/OT4ML.tex`, namely the included files `matching`, `monge`, `kantorovich`, `sinkhorn`, `dual`, `semidiscr-w1`, `dual-norms`, `sinkhorn-advanced`, `generalized-wasserstein`, `generalized-ot-problems`, `beyond-comparing-measures`, `dynamic-ot`, `wasserstein-gradient-flows`, `transportation-models`, and `notation-table`. Legacy files not included there were not counted as current manuscript content.

## Traceability Map

This table records where the old CourseOT material is now located. Line numbers are approximate source anchors in the current LaTeX files.

| CourseOT content | Current source anchor | Verdict | Notes |
|---|---|---|---|
| 1.1-1.2 matching and assignment | `latex/sections/matching.tex:6` | covered | Point-cloud matching, monotone matching, non-crossing arguments and Hungarian primal-dual material are present. |
| 2.1-2.7 Monge problem | `latex/sections/monge.tex:6` | covered, strengthened | The restored section contains Monge maps, Brenier, quantiles, vector quantiles and Gaussian/Bures material, with additional figures and context. |
| 3.1-3.5 Kantorovich relaxation | `latex/sections/kantorovich.tex:6` | covered, strengthened | Discrete, arbitrary-measure and c-cyclical monotonicity material is present; Rockafellar is now exposed through a descriptive theorem title. |
| 4.1-4.6 Sinkhorn | `latex/sections/sinkhorn.tex:7` | covered | Entropic OT, scaling, Sinkhorn iterations, Bregman projections and Hilbert-metric convergence are present. |
| 5.1-5.4 duality and c-transforms | `latex/sections/dual.tex:6` | covered | Includes general duality, c-transforms, Lipschitz stability and Euclidean quadratic specialization. |
| 6.1-6.4 semi-discrete, quantization, W_1 | `latex/sections/semidiscr-w1.tex:12` | covered | Semi-dual formulas, Laguerre cells, stochastic semi-discrete optimization, quantization and W_1/Beckmann material are present. |
| 7.1-7.4 dual norms and divergences | `latex/sections/dual-norms.tex:1` | covered | IPMs, RKHS/MMD, phi-divergences and GAN duality are present. |
| 8.1-8.5 advanced Sinkhorn | `latex/sections/sinkhorn-advanced.tex:6` | covered, strengthened | Continuous dual, Gaussian Sinkhorn, convergence rates, Sinkhorn divergences and statistical rates are present. |
| 9.1, 9.4-9.6 generalized Wasserstein distances | `latex/sections/generalized-wasserstein.tex:6` | covered, reorganized | Unbalanced, sliced, linear and spectral/subspace robust Wasserstein material is present in the new order. |
| 9.2, 9.3, 9.7, 9.9 generalized OT problems | `latex/sections/generalized-ot-problems.tex:3` | covered, reorganized | Barycenters, multimarginal OT, weak OT and inverse OT are present. |
| 9.8, 9.10 beyond comparing measures | `latex/sections/beyond-comparing-measures.tex:3` | covered, strengthened | Gromov-Wasserstein and quantum OT are present, with the new quantum subsection extending the old account. |
| 10.1, 10.3 dynamic OT | `latex/sections/dynamic-ot.tex:3` | covered, restored | Evolutions over measures and Benamou-Brenier are restored as separate subsections. |
| 10.4-10.5 Wasserstein gradient flows and MLPs | `latex/sections/wasserstein-gradient-flows.tex:3` | covered, soft gap | The mean-field MLP part is mathematically present in a generalized form; only the old scalar empirical display is absent verbatim. |
| 10.2, 10.6-10.8 transportation models | `latex/sections/transportation-models.tex:3` | covered, strengthened | Flow matching, one-step generative models, transformer flows and Gaussian closures are present. |

## Named-Result Reconciliation

The extraction pass found 177 named mathematical blocks in `CourseOT.pdf` and 190 in the current manuscript. The larger current count is consistent with the restoration work: several old paragraphs are now formalized as propositions, theorems, remarks or examples.

No named CourseOT result remains unmatched in substance. The remaining differences are title changes, stronger hypotheses/conclusions, or relocation into the new structure.

## High-Confidence Missing Mathematical Content

None found.

No CourseOT named result appears to be absent in mathematical substance from the current manuscript.

## Residual Soft Gap

This is not a missing theorem or definition, but an old pedagogical specialization that could be restored as an example if desired.

### CourseOT 10.5: scalar two-layer MLP specialization

Current location: `latex/sections/wasserstein-gradient-flows.tex`, subsection `Training Two-Layer MLPs as Wasserstein Flows`.

Status: `soft gap`; mathematically present, generalized.

CourseOT used the scalar model
```tex
g_\theta(u) = \frac1n\sum_i a_i \sigma(<u,w_i>),
\qquad \theta_i=(w_i,a_i),
```
then wrote the empirical square-loss first variation explicitly as
```tex
\delta f(\alpha)(\theta)
= \frac1N \sum_k
\left(\int \psi(\theta',u_k)d\alpha(\theta') - y_k\right)
\psi(\theta,u_k),
```
and introduced the finite-sample kernel and potential
```tex
k(\theta,\theta')
= \frac1N\sum_k \psi(\theta,u_k)\psi(\theta',u_k),
\qquad
g(\theta)=-\frac1N\sum_k y_k\psi(\theta,u_k).
```

The current manuscript gives the more general vector-output/population-risk version:
```tex
f(\alpha)=\int \ell(G_\alpha(z),y)d\rho(z,y),
```
with first variation and the square-loss quadratic-linear decomposition
```tex
k(x,x')=\int <\psi(x,z),\psi(x',z)>d\rho(z,y),
\qquad
g(x)=-\int <y,\psi(x,z)>d\rho(z,y).
```

Recommendation: no mathematical restoration is required. If the teaching flow should remain close to CourseOT, add a short example after the general formula specializing to scalar labels and empirical data. The natural insertion point is after the square-loss decomposition in `latex/sections/wasserstein-gradient-flows.tex`, around the formulas defining the kernel `k` and linear term `g`.

## Resolved Non-Gaps

The following items looked risky during the comparison but are now resolved.

### CourseOT 10.2: old proof style for flow matching

Current location: `latex/sections/transportation-models.tex`, subsection `Generative Models via Flow Matching`.

Status: `covered`, `strengthened`.

The CourseOT proof of `Flow matching vector field` used a formal delta representation of `alpha_t` and then translated it into test-function identities. The current text now restores this proof style while keeping the sharper `L^2(pi)` and `alpha_t`-a.e. conditional-expectation formulation.

Recommendation: no further restoration needed.

### CourseOT 3.3: theorem title `Rockafellar`

Current location: `latex/sections/kantorovich.tex`, subsection `c-Cyclical Monotonicity`.

Status: `renamed`.

CourseOT titled the result `Theorem (Rockafellar)`. The current manuscript states it as `Theorem (Optimal plans are c-cyclically monotone)` and mentions Rockafellar's cyclic-monotonicity theorem in the surrounding text. The proof is more detailed than CourseOT, including the construction of the modified coupling using restricted rectangle measures.

Recommendation: no content missing. If desired, the title could be changed to `Optimal plans are c-cyclically monotone` with `Rockafellar` in parentheses, but this is stylistic.

### CourseOT 8.2: proposition title `Optimal vector field`

Current location: `latex/sections/transportation-models.tex`, `Gaussian-endpoint flow-matching field`.

Status: `renamed`.

CourseOT's `Optimal vector field` is now the `Gaussian-endpoint flow-matching field`. The formula is present and connected to Tweedie's identity.

Recommendation: no content missing.

## Section-by-Section Coverage

### 1. Optimal Matching Between Point Clouds

Status: covered.

CourseOT content present:
- Monotone matching on the line.
- Non-crossing optimal matchings.
- Hungarian primal-dual correctness and complexity.
- Matching algorithms and assignment viewpoint.

No missing mathematical content found.

### 2. Monge Problem Between Measures

Status: covered.

CourseOT content present:
- Measures, total variation and push-forward.
- Push-forward density formula.
- Empirical Monge maps and matchings.
- Existence of transport maps from atomless sources.
- Feasibility versus attainment obstruction.
- Splitting obstruction and semi-discrete Monge maps.
- Directed Monge distance and its triangle inequality.
- Brenier theorem and proof sketch through Kantorovich duality.
- Sharp source hypothesis and non-charging hypersurfaces.
- Beyond-quadratic and Riemannian variants.
- Monotone fields not being gradients.
- Caffarelli regularity and Monge-Ampere equation.
- One-dimensional quantiles and Wasserstein formulas.
- Knothe-Rosenblatt rearrangement.
- Vector quantiles and linearized transport.
- Gaussian affine push-forward, Bures formula and Bures metric properties.

No missing mathematical content found.

### 3. Kantorovich Relaxation

Status: covered.

CourseOT content present:
- Discrete transportation polytope.
- Sparse optimal plans.
- North-west corner feasible plan.
- One-dimensional weighted sweep.
- Extreme point existence.
- Linear programs have extreme minimizers.
- Birkhoff-von Neumann theorem and matching corollary.
- Marginals, couplings and probabilistic interpretations.
- Existence on compact spaces.
- Monge-Kantorovich equivalence under Brenier.
- Support and c-cyclical monotonicity.
- Optimal plans are c-cyclically monotone.
- Monotonicity consequences and the one-dimensional order case.
- Metric properties of discrete and continuous Wasserstein distances.
- Weak-* and strong topologies, TV comparison, Berry-Esseen in W_1.

No missing mathematical content found.

### 4. Sinkhorn

Status: covered.

CourseOT content present:
- Entropic regularization for discrete measures.
- Existence and uniqueness of entropic OT.
- Scaling form.
- Sinkhorn algorithm.
- Relative entropy reformulation.
- Reference-measure shift for KL.
- Convergence as epsilon tends to zero.
- Bregman divergence, tilted penalties and cyclic Bregman projections.
- KL projections as scalings.
- Hilbert projective metric, Birkhoff contraction and linear convergence.

No missing mathematical content found.

### 5. Dual Problem

Status: covered.

CourseOT content present:
- Discrete Kantorovich duality.
- Epsilon-complementary slackness.
- Auction optimality certificate and epsilon-scaling.
- General Kantorovich duality.
- c-transform definition.
- c-transforms as semi-relaxed optimizers.
- Lipschitz stability of c-transforms.
- Proof-of-Brenier remark via c-transforms/Fenchel geometry.
- Algebra of c-transforms.
- Euclidean case for quadratic OT through the bilinear cost and Legendre transform.
- Alternating c-transform failure.

No missing mathematical content found.

### 6. Semi-Discrete and W_1

Status: covered.

CourseOT content present:
- Semi-dual formulation.
- Discrete target and Laguerre cells.
- Semi-discrete dual gradient formula.
- Power diagrams and computational geometry.
- Stochastic optimization using samples from the continuous source.
- SGD update and O(ell^{-1/2}) sublinear rate.
- Quantization rate m^{-1/d}.
- Free masses give Voronoi cells.
- Lloyd/k-means fixed-point condition and k-means++ comment.
- c-transform characterization of W_1 potentials as 1-Lipschitz functions.
- Kantorovich-Rubinstein norm on signed zero-mass measures.
- Discrete W_1 linear program and one-dimensional reduction.
- Euclidean Beckmann formulation.
- Graph Beckmann/transshipment formulation.

No missing mathematical content found.

### 7. Divergences and Dual Norms

Status: covered.

CourseOT content present:
- IPM/dual norm framework.
- Metrization by dual norms.
- Wasserstein as dual norm.
- Positive and conditionally positive kernels.
- Riesz, energy and Matern-type kernels.
- Kernel norm and MMD.
- RKHS dual characterization.
- Universal kernels and weak convergence.
- Discrete MMD formula.
- Entropy functions and phi-divergences.
- Basic properties and non-negativity.
- KL, TV, power divergences, Hellinger and Jensen-Shannon examples.
- Strong versus weak topology.
- Phi-divergence versus Bregman-divergence remark.
- Variational dual expression.
- GAN duality.

No missing mathematical content found.

### 8. Advanced Topics on Entropic Regularization

Status: covered.

CourseOT content present:
- Dual of entropic OT.
- Discrete soft c-transforms.
- Continuous dual and soft transforms.
- Existence and uniqueness of entropic dual potentials.
- Convexity properties of soft transforms.
- Gaussian marginals remark.
- Quadratic closure of Gaussian Sinkhorn iterates.
- Balanced entropic OT between Gaussians.
- Gaussian rates remark.
- Monotone fixed-point route to convergence.
- Pinsker inequality.
- Compact O(1/k) rate.
- Approximation of unregularized OT by regularized dual costs.
- Sinkhorn divergence asymptotics, non-negativity and strict positivity.
- Empirical OT, MMD and Sinkhorn statistical rates.
- No-free-lunch bias-variance tradeoff.

No missing mathematical content found.

### 9. Extensions

CourseOT section 9 has been reorganized across current Sections 9, 10 and 11.

Status: covered.

Current mapping:
- CourseOT 9.1 `Unbalanced OT` -> current 9.1.
- CourseOT 9.2 `OT Barycenters` -> current 10.1.
- CourseOT 9.3 `Multimarginal OT` -> current 10.2.
- CourseOT 9.4 `Sliced Wasserstein` -> current 9.2.
- CourseOT 9.5 `Spectral and Subspace Robust Wasserstein` -> current 9.4.
- CourseOT 9.6 `Linear Optimal Transport` -> current 9.3.
- CourseOT 9.7 `Weak Optimal Transport` -> current 10.4.
- CourseOT 9.8 `Gromov Wasserstein` -> current 11.2.
- CourseOT 9.9 `Metric learning and inverse OT` -> current 10.3.
- CourseOT 9.10 `Quantum Optimal Transport` -> current 11.3.

CourseOT content present:
- Unbalanced primal, dual, homogeneous and cone formulations.
- Cone distance examples: HK/WFR, Gaussian Hellinger cone, partial transport.
- Entropic unbalanced formulation.
- Barycenter variational definition, geodesic two-measure case, Dirac case.
- Mean of quadratic barycenter.
- Convexity of OT cost.
- Quantile and Gaussian barycenters.
- Entropic barycenter KL projection, scaling form and dual.
- Multi-marginal barycenter formula and discrete/Gaussian corollary.
- Entropic multi-marginal Gibbs/scaling form.
- Sliced, max-sliced and subspace-sliced Wasserstein.
- Spectral Wasserstein, robust representation and metric equivalence.
- Linear OT and local stability.
- Weak OT duality and barycentric relaxation.
- GW definition, metric modulo isometries, geodesics, entropic solver and fused GW.
- Hausdorff/Gromov-Hausdorff comparison.
- Cost derivative and inverse OT dual-gap formulation.
- Quantum OT primal, dual, entropic dual and Bregman projections.

No missing mathematical content found.

### 10. Wasserstein (Gradient) Flows

CourseOT section 10 has been split across current Sections 12, 13 and 14.

Status: covered.

Current mapping:
- CourseOT 10.1 `Evolutions over the Space of Measures` -> current 12.1.
- CourseOT 10.2 `Generative Models via Flow Matching` -> current 14.1.
- CourseOT 10.3 `Benamou-Brenier dynamic formulation of OT` -> current 12.2.
- CourseOT 10.4 `Wasserstein Gradient Flows` -> current Section 13.
- CourseOT 10.5 `Application: Training Two-Layer MLPs as Wasserstein Flows` -> current 13.3.
- CourseOT 10.6 `Application: One-Step Generative Models` -> current 14.2.
- CourseOT 10.7 `Application: Evolution in Depth of Transformers` -> current 14.3.
- CourseOT 10.8 `Gaussian Closures as Finite-Dimensional Test Cases` -> current 14.4.

CourseOT content present:
- Lagrangian and Eulerian descriptions.
- Weak continuity equation.
- Lagrangian flows solve the continuity equation.
- Dacorogna-Moser inversion.
- Least-square inversion and gradient structure.
- Flow matching interpolants and conditional expectation formula.
- Restored formal/test-function proof of flow matching.
- Tweedie identity.
- Gaussian-endpoint flow-matching vector field.
- Benamou-Brenier least-action theorem.
- Path-space formulation.
- Generalized Benamou-Brenier distances.
- Formal Wasserstein gradients.
- Geodesic convexity and examples.
- Energy decay for convex Wasserstein flows.
- Two-layer mean-field neural network flow.
- One-step generative models and drifting fields.
- General fields and projection onto gradients.
- Transformer token-measure evolution.
- Affine velocities preserving Gaussianity.
- Gaussian-constrained Wasserstein gradients.
- Gaussian energy catalogue.
- Linear mean-field, Gaussian drifting and attention Gaussian closures.

No missing mathematical content found.

## Renamed or Strengthened CourseOT Blocks

The following CourseOT named blocks are present but renamed or strengthened in the current manuscript:

- `Existence of transport maps from non-atomic sources` -> `Existence of transport maps from atomless sources`.
- `Existence is not attainment` -> `Feasibility versus optimality`.
- `Caffarelli regularity, informal form` -> `Caffarelli regularity`.
- `Theorem (Rockafellar)` -> `Optimal plans are c-cyclically monotone`.
- `Convexity properties` -> `Convexity properties of soft transforms`.
- `Optimal vector field` -> `Gaussian-endpoint flow-matching field`.
- `Linear mean-field networks` -> `Linear mean-field networks as cross-moment flows`.

These are not missing; the current versions are either equivalent or more explicit.

## Automated Low-Similarity Flags Manually Resolved

The TF-IDF comparison flagged the following CourseOT subsections for manual inspection:

- 2.3 Monge's Formulation.
- 2.4 Existence and Uniqueness of the Monge Map.
- 3.1 Discrete Relaxation.
- 3.2 Relaxation for Arbitrary Measures.
- 5.4 c-transforms.
- 6.2 Semi-discrete.
- 6.4 Wasserstein-1 norm.
- 7.2 RKHS/MMD.
- 8.1 Dual of Sinkhorn.
- 8.2 Gaussian Sinkhorn Problems.
- 9.1 Unbalanced OT.
- 9.8 Gromov Wasserstein.
- 10.2 Generative Models via Flow Matching.
- 10.5 Training Two-Layer MLPs.

Manual inspection found that the mathematical content is present in each case. The low scores were caused by:
- reordering into the new manuscript structure;
- new figures inserted into the PDF text;
- stronger or more detailed proofs;
- title changes;
- generalized notation, especially in MLPs and Gaussian closures;
- PDF extraction artifacts around equations.

## Residual Risks and Non-Scope

- Equation-level PDF extraction can miss local algebraic differences. This risk was reduced by checking the corresponding LaTeX sources for every low-similarity flag and every renamed named block.
- This audit checks restoration from `CourseOT.pdf`; it is not a full correctness audit of mathematical material newly introduced after CourseOT.
- Figure placement, figure captions and bibliography completeness were not re-audited here unless they affected the mathematical content inherited from CourseOT.
- Legacy source files not included by `latex/OT4ML.tex` were not used as evidence that content is present in the current manuscript.

## Recommended Next Actions

1. No restoration patch is required solely on the basis of missing CourseOT mathematics.
2. If pedagogical fidelity to CourseOT is desired, add a short scalar empirical MLP example after the general mean-field MLP formulas.
3. If a final pre-release check is needed, do a targeted equation-by-equation review only for the restored high-risk subsections: Monge 2.3-2.7, Kantorovich 3.1-3.3, advanced Sinkhorn 8.1-8.2, generalized OT Section 9, and transportation models Section 14.
4. Keep this file as the audit record before further manuscript polishing, so future restoration requests can distinguish true missing content from renamed or generalized material.
