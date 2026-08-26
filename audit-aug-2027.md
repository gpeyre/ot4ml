# OT4ML Mathematical Audit

## Audit scope

This report is a second, independent-pass mathematical audit of the current
production sources included by `OT4ML/OT4ML.tex:260-275`, followed by the
notation appendix included at `OT4ML/OT4ML.tex:291`. Every source was reread in
production order, including `semidiscr-w1.tex` as a full member of the chapter
sequence.

| Order | Source | Lines inspected | Retained second-pass findings |
|---:|---|---:|---|
| 1 | `OT4ML/sections/matching.tex` | 1-639 | None |
| 2 | `OT4ML/sections/monge.tex` | 1-2337 | None |
| 3 | `OT4ML/sections/kantorovich.tex` | 1-1495 | None |
| 4 | `OT4ML/sections/wasserstein-space.tex` | 1-1427 | WAS-1 |
| 5 | `OT4ML/sections/dual.tex` | 1-645 | None |
| 6 | `OT4ML/sections/semidiscr-w1.tex` | 1-1470 | SDW1-1 |
| 7 | `OT4ML/sections/dual-norms.tex` | 1-748 | DN-1 |
| 8 | `OT4ML/sections/sinkhorn.tex` | 1-2620 | None |
| 9 | `OT4ML/sections/sinkhorn-advanced.tex` | 1-1757 | None |
| 10 | `OT4ML/sections/statistical-ot.tex` | 1-1585 | STAT-1 |
| 11 | `OT4ML/sections/generalized-wasserstein.tex` | 1-2718 | GW-1 |
| 12 | `OT4ML/sections/generalized-ot-problems.tex` | 1-2413 | GOP-1 |
| 13 | `OT4ML/sections/beyond-comparing-measures.tex` | 1-2755 | BCM-1 |
| 14 | `OT4ML/sections/dynamic-ot.tex` | 1-2123 | DOT-1, DOT-2, DOT-3 |
| 15 | `OT4ML/sections/wasserstein-gradient-flows.tex` | 1-3882 | WGF-1 |
| 16 | `OT4ML/sections/transportation-models.tex` | 1-2691 | TM-1, TM-2 |
| 17 | `OT4ML/sections/notation-table.tex` | 1-337 | NOT-1, NOT-2 |

Total source inspected: **31,642 lines**.

Line numbers and labels below refer to this current workspace snapshot. The
audit targets mathematical meaning: hypotheses, domains, constants, signs,
powers, convexity, metricity, uniqueness, convergence, proof implications,
first variations, and the support supplied by cited theorems. It does not list
generic stylistic improvements.

### Status and severity

- **Confirmed error** means that the displayed statement, formula, or proof
  step can be contradicted or repaired directly from the manuscript's own
  conventions.
- **Confirmed missing hypothesis/proof gap** means that a stated implication
  does not follow under the written assumptions, although the intended result
  is standard after a precise additional assumption.
- **Needs source verification** means that the cited primary theorem does not
  directly cover the generality asserted. It is not classified as a false
  theorem.
- **Critical** means that a central result or a substantial part of the book is
  invalid.
- **High** means a false theorem or definition with nonlocal downstream
  consequences.
- **Medium** means a substantive but localized false statement, omitted
  hypothesis, proof gap, or normalization error.
- **Low** means a localized display, notation, indexing, or normalization
  defect whose intended correction is clear.

No Critical issue was found.

## Second-pass revision

This pass did not merely append to the first report. It rechecked each existing
finding against the cited text and independently reread all 17 sources, with
extra attention to the chapters previously reported clean.

1. **Removed former WAS-2.** The first report objected to attainment in the
   closed-sublevel characterization of (W_\infty). That objection ignored the
   book's standing use of finite Radon measures. Fixed Radon marginals make the
   coupling family uniformly tight; the distance cost is continuous and the
   closed support condition is stable under weak limits. The claimed
   characterization is therefore justified in the manuscript's framework.

2. **Removed former GW-1.** The generic UOT formulas use the exact convex
   conjugates (D_\psi^*) and (D_\phi^*). Those compact formulas remain
   correct and automatically contain any finite-recession domain restriction.
   The error is the explicit formula for that conjugate in DN-1, not a second
   independent UOT theorem error. The surviving partial-OT finding formerly
   numbered GW-2 is renumbered GW-1 in this report.

3. **Added TM-2.** The flow-matching proposition assumes only fixed-time
   (L^2(\pi)) integrability of the pathwise derivative, but its proof
   differentiates the push-forward identity under the latent integral. An
   absolute-continuity or locally uniform domination assumption in time is
   missing.

4. **Downgraded SDW1-1 from Medium to Low.** It is a malformed proof display,
   but the proposition, preceding algebra, and intended supergradient formula
   are otherwise clear.

5. **Downgraded TM-1 from Medium to Low.** The formula is the correct
   unnormalized SVGD representer and has the correct descent ray. The error is
   specifically the claim that it is the literal unit-ball optimizer; it
   changes the time/step normalization, not the state-space direction.

6. **Downgraded NOT-1 from Medium to Low.** The collision is real, but confined
   to the notation appendix.

7. **Strengthened verification.** The DN-1 two-point counterexample and the
   DOT-2 factor (1/2) were recomputed explicitly. The STAT-1 source question
   was checked against the primary 2019 theorem, including its common-support,
   square-kernel, positive-weight, and parameter-range assumptions. The
   matching circle proposition was stress-tested on random small instances,
   and the quantum square-root transport counterexample in Chapter 13 was
   numerically recomputed; neither produced an additional finding.

The revised report has **15 findings**, down from 16: 14 retained, two removed,
and one newly added.

## Remediation status

All 15 retained findings were corrected in the production sources after this
audit. The original findings remain below as an audit trail; they no longer
describe outstanding defects in the current workspace.

| Finding | Resolution in the manuscript |
|---|---|
| WAS-1 | The Monge/Kantorovich comparison now states only the always-valid inequality, distinguishes existence of a Monge minimizer from Kantorovich optimality, and points to the atomless equality-of-infima result. |
| SDW1-1 | The missing plus sign in the semi-dual supergradient proof was restored. |
| DN-1 | The finite-recession dual now imposes the global cap (f\leq\phi'_\infty), and the conjugacy proof treats absolutely continuous, singular, and superlinear cases separately. |
| STAT-1 | The Nystr\"om--Sinkhorn theorem was restricted to the cited common-support square setting, with the source theorem's radius, temperature, accuracy, and positivity assumptions made explicit. |
| GW-1 | The fixed-mass partial-OT identity now explicitly assumes a common metric space and (c=d^p). |
| GOP-1 | The Radon pseudoinverse is described as an (L^2) reconstruction; normalization of its positive part now requires finite nonzero (L^1) mass, with a sufficient positive-threshold estimate. |
| BCM-1 | The two finite GW cardinalities were put in the correct order. |
| DOT-1 | RKHS field regularity is tied to kernel regularity, and finite moving-atom interpolation now assumes a continuous strictly positive-definite kernel, pairwise-distinct absolutely continuous paths, and square-integrable velocities. |
| DOT-2 | Both (0/1)-metric formulas now read (Wass_2^2=\tfrac12\|a-b\|_{\mathrm{TV}}) under the book's full-variation convention. |
| DOT-3 | The hard terminal condition is now the measure functional (Gamma(\rho_1)=\iota_{\{\rho_\star\}}(\rho_1)), explicitly distinguished from a pointwise terminal potential. |
| WGF-1 | The first variation of the mean-field predictor is written as the derivative-dual pairing (DJ(G_\alpha)[\psi(x,\cdot)]), with the optional (L^2(\zeta)) specialization stated separately. |
| TM-1 | The displayed SVGD field is characterized as the penalized RKHS minimizer; the normalized unit-ball optimizer is stated explicitly. |
| TM-2 | Flow matching now assumes pathwise absolute continuity, joint measurability, and finite space--time (L^2) action; the proof uses the pathwise chain rule and Fubini before asserting the distributional continuity equation. |
| NOT-1 | Flow-matching notation in the appendix now uses (I_t,\partial_tI_t), leaving (P_t) to the matrix-valued flux. |
| NOT-2 | The undefined SVGD symbol was replaced by (v_\alpha^{\mathrm{SVGD}}). |

The corrected book was compiled twice with `pdflatex`. The resulting 482-page
PDF has no undefined references, LaTeX errors, or overfull boxes, and the pages
containing the corrections were visually inspected.

### Second remediation recheck

A second source-level and mathematical verification was performed against all
15 retained findings. Each corrected statement was re-derived from the book's
definitions rather than checked only by textual comparison. The Nystr\"om
result was also compared again with the primary common-support theorem,
including its inverse-temperature range, radius and accuracy assumptions,
rank estimate, runtime, rounding guarantee, and entropy-normalization shift.

This recheck found one residual qualifier in DOT-1: the surrounding text still
called the admissible class a ``smooth RKHS class,'' although the basic
definition assumes only a positive-definite kernel. It now says ``restricted
RKHS class'' and explicitly makes its regularity depend on the assumptions on
the kernel. No other residual defect from the audit was found.

**Outstanding retained audit findings after the second recheck: 0.**

## Cross-chapter normalization audit

The following conventions were traced through all relevant chapters.

1. The balanced Kantorovich value is the integral of the displayed ground
   cost, and

   \[
   W_p(\alpha,\beta)^p=\operatorname{MK}_{d^p}(\alpha,\beta).
   \]

   Sections using (c(x,y)=\|x-y\|^2/2) consistently obtain
   (W_2^2/2), rather than silently treating this cost as (W_2^2).

2. The finite-measure KL convention is generated by
   (\phi_{\rm KL}(r)=r\log r-r+1), including the singular recession term.
   For probabilities it agrees with ordinary relative entropy. Product-KL and
   Shannon-entropy Sinkhorn objectives differ only by marginal constants, and
   those constants are handled consistently.

3. The manuscript defines the total-variation norm as the **full** variation:
   for histograms, (\|a-b\|_{\rm TV}=\sum_i|a_i-b_i|). Pinsker and
   partial-transport formulas follow that convention. DOT-2 is the one
   confirmed cross-chapter violation.

4. The entropic convention is

   \[
   \operatorname{MK}_c^\epsilon
   =\min_\pi \left\{\int c\,d\pi
   +\epsilon\operatorname{KL}(\pi\mid\alpha\otimes\beta)\right\},
   \qquad K=e^{-c/\epsilon}.
   \]

   The dual potentials, soft transforms, Gaussian formulas, and large- and
   small-temperature limits use this same scaling.

5. The basic Benamou--Brenier action has no factor (1/2) and equals
   (W_2^2). The mean-field-game planning functional deliberately uses one
   half of this kinetic action, which consistently yields the Hamiltonian
   (\|\nabla u\|^2/2).

6. Static and dynamic WFR use the same reaction scale (\kappa): the tangent
   penalty is (\kappa^2g^2), the gradient-flow reaction is
   (-\phi\rho/\kappa^2), and the cone normalization is compatible with that
   convention.

7. Discrete and continuous GW use the same distortion-power convention, with
   no hidden (1/2) in the quadratic distortion. Sliced, conditional,
   quotient, spectral, and Procrustes constructions distinguish powered costs
   from metric roots. GW-1 is a localized omission of the required
   (c=d^p) specialization in one partial-OT proposition.

8. For finite-recession divergences, singular mass costs
   (L=\phi'_\infty) per unit mass. DN-1 omits the resulting global cap in an
   explicit conjugate formula. Generic UOT formulas written with the exact
   extended-valued symbol (D_\phi^*) remain valid; expanding that symbol by
   the current DN-1 formula does not.

9. First variations use
   (\operatorname{grad}_W f=\nabla\delta f), while descent velocities use
   the negative gradient. The KL/Fisher, sliced, MMD, Sinkhorn, spectral, WFR,
   and Gaussian covariance calculations follow this sign convention. TM-1 is
   a normalization mismatch between a Riesz representer and a unit-ball
   optimizer, not a sign error.

## Chapter-by-chapter audit

### 1. Optimal Matching between Point Clouds

**Source:** `OT4ML/sections/matching.tex`, lines 1-639.

Second-pass coverage included the assignment LP, one-dimensional exchange
arguments, Monge and anti-Monge matrices, concave-cost local indicators,
Hungarian primal-dual invariants, the circle-cut construction, and unequal
cardinalities. Random small circle instances were also compared against
brute-force permutations; no counterexample to the cutting proposition was
found.

**No material issue found.**

Residual risk: Algorithm `alg:concave-line-local-indicators` and the
path-uncrossing lemma in Proposition `prop-circle-ot-cut` rely on specialized
source results. Their internal formulas and implications check out, but those
external proofs were not reconstructed in full generality.

### 2. Monge Problem between Measures

**Source:** `OT4ML/sections/monge.tex`, lines 1-2337.

Second-pass coverage included Radon-measure conventions, push-forwards,
atomless map existence, directed Monge triangle inequalities, Brenier maps,
twist/MTW conditions, Caffarelli regularity, one-dimensional quantiles,
Bobkov--Ledoux cumulative formulas, tree (W_1), Knothe limits, and the
Gaussian/Bures/Fisher--Rao constants.

**No material issue found.**

Residual risk: Proposition `prop-caffarelli-regularity`, the curved-cost MTW
examples, and Proposition `prop-knothe-limit-anisotropic-brenier` invoke
advanced regularity or scale-separation theorems. The written hypotheses and
normalizations are coherent; their complete external proofs were not
rederived.

### 3. Kantorovich Relaxation

**Source:** `OT4ML/sections/kantorovich.tex`, lines 1-1495.

Second-pass coverage included transportation-polytope dimensions and
extreme-point sparsity, Birkhoff--von Neumann, existence by weak compactness,
convexity in the marginals, gluing, cyclical monotonicity, convex order, the
maximal convex relaxation, and the Monge optimality gap.

**No material issue found.**

Residual risk: Theorem `thm-kantorovich-maximal-convex-relaxation` uses an
infinite-dimensional Jensen argument and points to the more general
Savare--Sodini result. The compact-space specialization is consistent; only
the cited general extension remains source-dependent.

### 4. Wasserstein Space

**Source:** `OT4ML/sections/wasserstein-space.tex`, lines 1-1427.

#### WAS-1 - A Monge minimizer need not be Kantorovich-optimal

- **Severity:** Medium
- **Status:** Confirmed error
- **Chapter/section:** Wasserstein Space, "Comparison with Monge"
- **Source location:** `OT4ML/sections/wasserstein-space.tex:414`; compare
  Proposition `prop-kantorovich-relaxation-monge` at lines 423-432.
- **Problematic statement:** "When an optimal Monge map exists, Kantorovich
  gives the same value by choosing the graph coupling."
- **Why problematic:** Existence of a Monge minimizer only supplies a feasible
  graph coupling, so it proves
  (W_p(\alpha,\beta)\leq\widetilde W_p(\alpha,\beta)), not equality. For
  (p=1) on (\mathbb R), take

  \[
  \alpha=\tfrac12\delta_0+\tfrac14\delta_{-1}+\tfrac14\delta_1,
  \qquad
  \beta=\tfrac12\delta_{-1/2}+\tfrac12\delta_{1/2}.
  \]

  Any admissible map must send the mass-(1/2) atom at zero wholly to one
  target and both mass-(1/4) outer atoms to the other, giving cost (3/4).
  A coupling splits the zero atom equally and sends each outer atom to its
  nearest target, giving cost (1/2). Thus the Monge optimum is attained but
  is strictly larger.
- **Concrete correction:** Say that every Monge map induces a feasible graph
  coupling and hence an upper bound on the Kantorovich value. State equality
  only when a graph coupling is Kantorovich-optimal, for example under the
  atomless-source relaxation hypotheses of Proposition
  `prop-kantorovich-relaxation-monge`.

The former (W_\infty) attainment finding is withdrawn for the reason recorded
in "Second-pass revision." Barycenters, Wasserstein-on-Wasserstein, weak
convergence, (W_\infty), and the metric-power conventions were otherwise
rechecked without a material discrepancy.

### 5. Dual Problem

**Source:** `OT4ML/sections/dual.tex`, lines 1-645.

Second-pass coverage included discrete and continuous duality,
(c\)-transforms, complementary slackness, quadratic convex-potential
normalization, tropical closure, and cross-curvature.

**No material issue found.**

Residual risk: the equivalence between convexity of the full class of
(c\)-concave potentials and nonnegative cross-curvature near lines 625-627 is
an advanced geometric result. The manuscript includes the main twist,
nondegeneracy, compactness, and (c\)-convexity qualifications, but the recent
infinite-dimensional lifting claim remains source-dependent.

### 6. Semi-discrete and \(W_1\)

**Source:** `OT4ML/sections/semidiscr-w1.tex`, lines 1-1470. This source was
audited explicitly as the sixth production input.

#### SDW1-1 - Missing plus sign in the supergradient inequality

- **Severity:** Low
- **Status:** Confirmed display error
- **Chapter/section:** Semi-discrete and (W_1), discrete semi-dual
- **Source location:** Proposition `prop-discrete-semidual-supergradient`,
  proof, `OT4ML/sections/semidiscr-w1.tex:123-131`.
- **Problematic statement:** The proof displays

  \[
  E_0(h)\leq E_0(g)
  \langle b-\widehat b(g),h-g\rangle,
  \]

  with no operation between the two terms on the right.
- **Why problematic:** This is not a valid scalar expression and is not the
  supergradient inequality invoked in the next sentence. The immediately
  preceding expansion adds the marginal term.
- **Concrete correction:** Replace the display by

  \[
  E_0(h)\leq E_0(g)+
  \langle b-\widehat b(g),h-g\rangle.
  \]

The continuous semi-discrete formulas, Laguerre-cell derivatives,
quantization limits, Kantorovich--Rubinstein duality, and Beckmann/graph
normalizations were rechecked without an additional material issue.

### 7. Divergences and Dual Norms

**Source:** `OT4ML/sections/dual-norms.tex`, lines 1-748.

#### DN-1 - Finite-recession conjugacy omits a global domain cap

- **Severity:** High
- **Status:** Confirmed error
- **Chapter/section:** Divergences and Dual Norms, `Phi-divergences`
- **Source location:** Proposition `prop-phi-div-dual`, equations
  `eq-dual-div` and `eq-legendre`,
  `OT4ML/sections/dual-norms.tex:641-670`; compare the singular-part
  definition `eq-phi-div` at lines 384-396.
- **Problematic statement:** For every entropy (\phi), the manuscript states

  \[
  D_\phi^*(f\mid\beta)=\int\phi^*(f)\,d\beta
  \]

  and then takes the variational supremum over all continuous (f), with no
  additional condition when (L=\phi'_\infty<\infty).
- **Why problematic:** Integration against (\beta) does not see (f) on a
  (\beta)-null set, but the primal can place singular mass there at cost
  (L) per unit mass. Hence the conjugate is (+\infty) if (f>L) anywhere
  singular mass can be placed. This is not only a formal concern. For the
  manuscript's full-TV entropy (\phi(r)=|r-1|), (L=1). On
  (X=\{0,1\}), let (\beta=\delta_0), (\alpha=\delta_1), and set
  (f_M(0)=-1), (f_M(1)=M). The manuscript's primal definition gives
  (D_\phi(\alpha\mid\beta)=\phi(0)+L=2). Since
  (\phi^*(-1)=-1), the asserted dual lower bound is
  (M-\phi^*(-1)=M+1), which is unbounded as (M\to\infty).
- **Concrete correction:** For finite (L), write

  \[
  D_\phi^*(f\mid\beta)=
  \begin{cases}
  \displaystyle\int\phi^*(f)\,d\beta,
  & f\leq L\text{ on the ambient space},\\
  +\infty,&\text{otherwise}.
  \end{cases}
  \]

  Equivalently, restrict the continuous-potential supremum in `eq-dual-div`
  to (f\leq L). The restriction is vacuous for superlinear entropies such
  as KL. The proof must conjugate the singular term as well as the
  (\beta)-absolutely-continuous term.

This is the only High-severity finding. It affects generic finite-recession
TV/Hellinger-type dual expansions, but not the KL specializations.

### 8. Entropic Regularization: Sinkhorn Algorithm

**Source:** `OT4ML/sections/sinkhorn.tex`, lines 1-2620.

Second-pass coverage included discrete/continuous product-KL objectives,
strict positivity, scaling equations, dual gauges, soft transforms,
generalized regularizers, heat and Hopf--Cole formulas, small/large
temperature limits, Sinkhorn divergence, and complex continuation. The
finite-recession issue in DN-1 does not create a separate error here: the
coupling regularizers are either KL or are handled through their exact
extended-valued conjugates and support constraints.

**No material issue found.**

Residual risk: the smooth small-temperature expansion and the final
gauge-fixed holomorphic continuation are regularity-sensitive advanced
claims. Their constants and signs are internally consistent; full analytic
hypotheses remain tied to the cited sources.

### 9. Entropic Regularization: Convergence

**Source:** `OT4ML/sections/sinkhorn-advanced.tex`, lines 1-1757.

Second-pass coverage included Bregman projection, monotone/topical maps,
robust (O(1/\ell)) bounds, Hilbert/Birkhoff contraction, local spectral
rates, over-relaxation, variable projection, Gaussian closure, and the
continuous small-temperature limit. In the consistency formula at line 1708,
(G(\operatorname{Id}+\nabla u)) is standard pointwise composition shorthand
for (x\mapsto G(x+\nabla u(x))); it is not retained as an error.

**No material issue found.**

Residual risk: Proposition `prop-scaled-log-sinkhorn-limit` is explicitly a
formal smooth limit conditional on uniform Laplace expansion and smooth
convergence. No unsupported unconditional convergence claim or incorrect
factor was found.

### 10. Statistical Optimal Transport

**Source:** `OT4ML/sections/statistical-ot.tex`, lines 1-1585.

#### STAT-1 - The cited Nystrom theorem does not directly cover the rectangular proposition

- **Severity:** Medium
- **Status:** Needs source verification; not a confirmed false theorem
- **Chapter/section:** Statistical Optimal Transport, "Application to
  Sinkhorn kernels"
- **Source location:** Proposition
  `prop-gaussian-nystrom-sinkhorn-complexity`, equation
  `eq-gaussian-nystrom-rank`, and proof,
  `OT4ML/sections/statistical-ot.tex:1288-1326`.
- **Problematic statement:** The proposition presents a randomized,
  entrywise-positive rank-(R) approximation and complete complexity bound for
  two distinct supports of sizes (n) and (m), arbitrary
  (\epsilon>0), and a rectangular source-target Gaussian block as a
  specialization of the cited Nystrom--Sinkhorn theorem.
- **Why verification is needed:** The primary 2019 result is stated for two
  strictly positive weight vectors on one common (N)-point support, a
  square (N\times N) PSD Gaussian Gram matrix, and normalized ranges
  including inverse temperature (\eta\in[1,N]), radius (R>1), and target
  accuracy at most one. The manuscript proposes applying the construction to
  the union support and retaining the source-target block. That is plausible,
  but a direct reduction would introduce zero weights outside each original
  marginal, whereas the source scaling theorem assumes positive vectors. The
  proof also does not derive removal/rescaling of the source parameter ranges
  or show that square rounding and objective guarantees pass unchanged to the
  rectangular problem.
- **Concrete verification needed:** Supply a reduction that treats the zero
  union-support weights or proves the rectangular scaling theorem directly;
  track (\eta=1/\epsilon), the radius/accuracy rescaling, positivity of the
  retained factorization, rounding, and the exact rank/runtime bounds. If such
  a reduction is not intended, restrict the proposition to the source
  theorem's common-support square setting. Primary source checked:
  [Altschuler--Bach--Rudi--Niles-Weed, NeurIPS 2019](https://proceedings.neurips.cc/paper_files/paper/2019/file/f55cadb97eaff2ba1980e001b0bd9842-Paper.pdf).

The one-dimensional empirical constants, dyadic (W_1) rates,
dimension-dependent (W_p) rates, Edgeworth integral, Sinkhorn bias/variance,
empirical barycentric maps, random features, and positive-feature/complete
positivity claims were otherwise rechecked. In particular, the displayed
Edgeworth constant reduces to (2\varphi(0)+8\varphi(\sqrt3)), consistent
with the manuscript's value.

### 11. Generalized Wasserstein Distances

**Source:** `OT4ML/sections/generalized-wasserstein.tex`, lines 1-2718.

#### GW-1 - The fixed-mass partial-OT metric formula omits the ground-cost specialization

- **Severity:** Medium
- **Status:** Confirmed missing hypothesis
- **Chapter/section:** Generalized Wasserstein Distances, "Partial optimal
  transport"
- **Source location:** Definition `def-partial-optimal-transport`, equation
  `eq-partial-ot-fixed-mass` at lines 894-903; Proposition
  `prop-partial-ot-metric-slice`, equation `eq-partial-ot-balanced-slice`,
  `OT4ML/sections/generalized-wasserstein.tex:961-974`.
- **Problematic statement:** Partial OT is defined with a generic cost
  (c:\mathcal X\times\mathcal Y\to[0,\infty]). The proposition then assumes
  only a metric space ((\mathcal X,d)) and concludes

  \[
  \operatorname{POT}_m(\alpha,\beta)
  =mW_p(\alpha/m,\beta/m)^p,
  \]

  followed by metricity.
- **Why problematic:** The conclusion requires both measures to live on the
  same metric space and the cost in the preceding definition to be
  (c(x,y)=d(x,y)^p). Neither (\mathcal Y=\mathcal X) nor this cost
  specialization is stated. With a generic cost, the proof yields only
  (m\operatorname{MK}_c(\alpha/m,\beta/m)), which need not induce a metric.
- **Concrete correction:** Add "Assume (\mathcal Y=\mathcal X) and
  specialize `eq-partial-ot-fixed-mass` to (c=d^p)." Alternatively state
  the generic balanced Kantorovich identity and reserve the distance claim for
  the (d^p) case.

The generic UOT dual finding from the first report is withdrawn: exact
conjugate notation already carries the needed extended-value domain. The KL
shape envelope, Gaussian UOT formulas, cone metric, barycenters, sliced and
spectral variants, conditional OT, LOT, and low-rank OT were reread without an
additional confirmed discrepancy. Advanced static/dynamic cone equivalence
remains source-dependent under its stated compactness and regularity regime.

### 12. Generalized OT Problems

**Source:** `OT4ML/sections/generalized-ot-problems.tex`, lines 1-2413.

#### GOP-1 - An \(L^2\) Radon reconstruction is treated as a finite density

- **Severity:** Medium
- **Status:** Confirmed missing hypothesis
- **Chapter/section:** Generalized OT Problems, "Sliced and Radon
  barycenters"
- **Source location:** Proposition `prop-radon-pseudoinverse`, equation
  `eq-radon-pseudoinverse`, and sentence at
  `OT4ML/sections/generalized-ot-problems.tex:930-957`; normalization
  `eq-radon-display-reconstruction` at lines 998-1004.
- **Problematic statement:** The proposition assumes only
  (R^\dagger h\in L^2(\mathbb R^d)) and calls it the density of an a priori
  signed measure. The subsequent construction permits (\eta_t=0) and
  normalizes the positive part by its integral over (\mathbb R^d).
- **Why problematic:** On (\mathbb R^d), (L^2\not\subset L^1). An
  (L^2) reconstruction need not define a finite signed Radon measure, and
  its positive part can have infinite mass. Merely requiring the positive
  part to be nonzero does not make the denominator in
  `eq-radon-display-reconstruction` finite. For example, a nonnegative tail
  proportional to ((1+|x|)^{-a}) with (d/2<a\leq d) is in (L^2) but
  not (L^1).
- **Concrete correction:** Call (R^\dagger h) an (L^2) reconstruction
  unless (L^1) is separately known. Before the display normalization, assume
  (((R_\Omega^\dagger h_t)-\eta_t)_+\in L^1) with finite nonzero mass. A
  sufficient alternative is (\eta_t>0), since
  ((f-\eta_t)_+\leq f_+^2/\eta_t) for (f\in L^2).

The Radon constants and signed-polar factor, multimarginal reductions,
capacity constraints, OT first variations, inverse OT, weak OT, convex order,
martingale couplings, and Brenier--Strassen implications were rechecked with
no additional material issue. The advanced weak/martingale duality statements
remain source-dependent under their displayed compactness and moment
hypotheses.

### 13. Beyond Comparing Measures

**Source:** `OT4ML/sections/beyond-comparing-measures.tex`, lines 1-2755.

#### BCM-1 - Discrete GW cardinalities are reversed

- **Severity:** Low
- **Status:** Confirmed indexing error
- **Chapter/section:** Beyond Comparing Measures, discrete
  Gromov--Wasserstein
- **Source location:** `OT4ML/sections/beyond-comparing-measures.tex:401-454`,
  equation `eq-gw-def`; the incorrect sentence is at line 454.
- **Problematic statement:** Line 401 defines
  (D\in\mathbb R^{n\times n}) and
  (D'\in\mathbb R^{m\times m}), matching
  (a\in\mathbb R^n) and (b\in\mathbb R^m). Line 454 then says that
  (D) and (D') are metrics on `(\{1,\ldots,m\})` and
  `(\{1,\ldots,n\})`, respectively.
- **Why problematic:** The two underlying index sets are swapped and do not
  match the matrix dimensions in `eq-gw-def`.
- **Concrete correction:** Replace the sets by
  (\{1,\ldots,n\}) and (\{1,\ldots,m\}), respectively.

The vector- and matrix-valued actions, GW distortion factors, Gaussian
fourth-moment calculation, biconvex linearization, metric/profile bounds,
quantum coupling formulas, and time-warping recursions were reread. The
manuscript's explicit three-point failure of the classical square-root quantum
transport triangle inequality was numerically checked: the direct side is
approximately (1.29099), while the two-leg sum is approximately (1.05564).
No additional finding is recorded. The topology comparison and rank-deficient
Gromov--Monge existence claims remain advanced source-dependent results.

### 14. Dynamic Optimal Transport

**Source:** `OT4ML/sections/dynamic-ot.tex`, lines 1-2123.

#### DOT-1 - Strict positive definiteness does not ensure finite moving-point RKHS interpolation

- **Severity:** Medium
- **Status:** Confirmed missing hypothesis
- **Chapter/section:** Dynamic Optimal Transport, "Kernelized
  Benamou--Brenier distances"
- **Source location:** Definition `def-kernelized-bb-distance`, Proposition
  `prop-kernelized-bb-distance`, and especially
  `OT4ML/sections/dynamic-ot.tex:1432-1436` and lines 1487-1491.
- **Problematic statement:** The text says that the kernel makes velocities
  smooth and that, for a strictly positive-definite kernel, noncolliding
  smooth atom paths can be realized with finite action by RKHS interpolation.
- **Why problematic:** Strict positive definiteness is only an algebraic
  invertibility property of each fixed finite Gram matrix. It does not imply
  measurability, continuity, or smoothness of (k). It also does not by itself
  control the inverse Gram matrix along moving sites. Without time
  measurability the interpolating coefficients need not define an admissible
  field, and without a uniform lower eigenvalue bound the squared RKHS norm
  need not be time-integrable.
- **Concrete correction:** State that field regularity is inherited from the
  kernel. For the finite-action interpolation claim, assume at least a
  continuous strictly positive-definite kernel, continuous pairwise-distinct
  paths on a compact time interval, and square-integrable prescribed atom
  velocities. Continuity then makes the Gram matrices a continuous uniformly
  invertible family. Require differentiability of (k) for smooth/Lipschitz
  field claims.

#### DOT-2 - The \(0/1\)-metric Wasserstein cost is off by a factor of two

- **Severity:** Medium
- **Status:** Confirmed error
- **Chapter/section:** Dynamic Optimal Transport, finite-state Markov
  Wasserstein comparison
- **Source location:** `OT4ML/sections/dynamic-ot.tex:1806-1816`, especially
  Figure `fig:discrete-markov-simplex-distances`.
- **Problematic statement:** For (d(i,j)=1) when (i\ne j), the text and
  caption state
  (W_2^2(a,\bar a)=\|a-\bar a\|_{\rm TV}).
- **Why problematic:** An optimal plan leaves
  (\sum_i\min(a_i,\bar a_i)) on the diagonal and transports the remaining
  mass at unit cost. Therefore

  \[
  W_2^2(a,\bar a)
  =1-\sum_i\min(a_i,\bar a_i)
  =\tfrac12\sum_i|a_i-\bar a_i|.
  \]

  Equation `eq-defn-tv` in
  `OT4ML/sections/dual-norms.tex:486-503` defines the book's TV norm as the
  full (\ell^1) norm, so the missing factor cannot be absorbed by convention.
- **Concrete correction:** Replace both occurrences by
  (W_2^2(a,\bar a)=\tfrac12\|a-\bar a\|_{\rm TV}).

#### DOT-3 - A hard terminal-density constraint is not a pointwise potential

- **Severity:** Low
- **Status:** Confirmed notation/domain error
- **Chapter/section:** Dynamic Optimal Transport, variational mean-field games
- **Source location:** `OT4ML/sections/dynamic-ot.tex:1993-2002` and line 2106;
  equation `eq-variational-mfg-quadratic-terminal`.
- **Problematic statement:** Line 2106 calls the hard endpoint
  (\rho_1=\rho_\star) "equivalently the indicator terminal cost
  (\Psi=\iota_{\{\rho_\star\}})."
- **Why problematic:** Earlier, (\Psi(x)) is a pointwise state cost entering
  the linear functional (\int\Psi(x)\rho_1(x)\,dx). The indicator of a
  singleton set of densities is a nonlinear functional of the whole terminal
  measure and cannot be substituted for this pointwise (\Psi).
- **Concrete correction:** Write
  (\Gamma(\rho_1)=\iota_{\{\rho_\star\}}(\rho_1)), or impose the endpoint
  directly. Reserve (\Psi) for the pointwise linear terminal potential.

The Benamou--Brenier, path-space, generalized mobility, spectral,
finite-state/nonlocal, Schrodinger, WFR, and mean-field-game constants were
otherwise rechecked. The nonlocal metric and geodesic claims remain dependent
on the cited irreducibility and regularity framework; the chapter generally
signals that dependence.

### 15. Wasserstein Gradient Flows

**Source:** `OT4ML/sections/wasserstein-gradient-flows.tex`, lines 1-3882.

#### WGF-1 - The homogeneous-network proof uses an undefined pairing

- **Severity:** Low
- **Status:** Confirmed notation/domain defect
- **Chapter/section:** Wasserstein Gradient Flows, "Training Two-Layer MLPs as
  Wasserstein Flows"
- **Source location:** Proposition `prop-formal-chizat-bach`, proof,
  `OT4ML/sections/wasserstein-gradient-flows.tex:2581-2599`; compare the data
  law at lines 2429-2451.
- **Problematic statement:** The proof defines

  \[
  h_\alpha(x)=
  \langle\nabla J(G_\alpha),\psi(x,\cdot)\rangle_\rho,
  \]

  but no (\rho) is defined in this section, and the proposition assumes only
  that (J) is differentiable as a predictor functional.
- **Why problematic:** The subscript introduces an unstated Hilbert-space
  representation of (DJ) and conflicts with the data-law notation (\zeta)
  used in `eq-mlp-first-variation-general`. The homogeneity proof requires
  only a derivative-dual pairing.
- **Concrete correction:** Define
  (h_\alpha(x)=DJ(G_\alpha)[\psi(x,\cdot)]). In an
  (L^2(\zeta)) specialization, define that predictor space and use (\zeta)
  explicitly.

The second pass rechecked JKO factors, first variations, entropy and
porous-medium coefficients, McCann convexity, PL/Kurdyka--Lojasiewicz
exponents, LSI/Poincare/Talagrand/HWI constants, multi-species constraints,
mean-field homogeneity, generalized and spectral PMOs, nonlocal entropy flow,
WFR reaction, conditional ResNets, and particle momentum. No further material
issue was found. The nonlocal and mean-field global-convergence statements are
advanced claims whose rigorous versions remain tied to their cited regularity,
support-propagation, and irreducibility assumptions.

### 16. Generative Models via Transportation

**Source:** `OT4ML/sections/transportation-models.tex`, lines 1-2691.

#### TM-1 - The displayed SVGD field is not the literal unit-ball optimizer

- **Severity:** Low
- **Status:** Confirmed scaling mismatch
- **Chapter/section:** Generative Models via Transportation, "Stein
  variational gradient descent"
- **Source location:** `OT4ML/sections/transportation-models.tex:858-889`,
  equation `eq-svgd-velocity`.
- **Problematic statement:** Line 866 says that optimizing the Stein linear
  functional over the unit ball of (\mathcal H_k^d) gives the displayed
  field

  \[
  g_\alpha(x)=\int
  \bigl(k(y,x)\nabla\log\rho_\beta(y)+\nabla_yk(y,x)\bigr)\,d\alpha(y).
  \]
- **Why problematic:** The displayed (g_\alpha) is the Riesz representer.
  When (g_\alpha\ne0), the optimizer over
  (\|v\|_{\mathcal H_k^d}\leq1) is
  (g_\alpha/\|g_\alpha\|_{\mathcal H_k^d}). The unnormalized standard SVGD
  field instead solves the quadratically penalized steepest-descent problem.
  The two fields have the same ray, but their state-dependent magnitude gives
  a different time/step parametrization.
- **Concrete correction:** Replace "over the unit ball" by the penalized
  characterization

  \[
  \min_v\left\{D\operatorname{KL}(\alpha)[v]
  +\tfrac12\|v\|_{\mathcal H_k^d}^2\right\},
  \]

  with the sign convention matching the preceding derivative, or normalize
  `eq-svgd-velocity` and define the zero-representer case separately.

#### TM-2 - Fixed-time \(L^2\) control does not justify the continuity equation

- **Severity:** Medium
- **Status:** Confirmed missing hypothesis/proof gap
- **Chapter/section:** Generative Models via Transportation, "Flow matching
  formula"
- **Source location:** Definition `def-deterministic-interpolant` and
  `eq:interp-coupling`, `OT4ML/sections/transportation-models.tex:54-65`;
  Proposition `prop-flow-matching-vector-field` and proof, lines 123-186,
  especially the differentiation step at lines 172-179.
- **Problematic statement:** The proposition assumes only that
  (\partial_tI_t\in L^2(\pi)) for each fixed (t), then differentiates

  \[
  \int\varphi(I_t(u))\,d\pi(u)
  \]

  under the integral and concludes that ((\alpha_t,v_t)) satisfies the
  continuity equation.
- **Why problematic:** Pointwise differentiability in (t) and integrability
  at each individual time do not provide a time-integrable dominating
  function, absolute continuity of (t\mapsto I_t) in (L^2(\pi)), or even
  local integrability of the induced flux. Differentiation under an integral
  and the distributional continuity equation require such joint time-latent
  control. The conditional-expectation minimizer is correct at each fixed
  time; the gap concerns promotion of those fixed-time identities to a curve
  equation.
- **Concrete correction:** Assume, for example,
  (I\in AC^2([0,1];L^2(\pi;\mathbb R^d))), with a jointly measurable
  pathwise derivative, or assume pathwise absolute continuity together with

  \[
  \int_0^1\!\int|\partial_tI_t(u)|^2\,d\pi(u)\,dt<\infty.
  \]

  Then the chain rule and Fubini justify the weak continuity equation and give
  (v_t\in L^2(\alpha_t)) for almost every (t).

The Tweedie signs, Gaussian flow-matching maps, OU time change, one-step
push-forward velocities, sliced flow, drifting first variations, moment
measures, Dobrushin/Birkhoff constants, Gaussian closures, Gelbrich
projection, and scalar eikonal closure were otherwise rechecked. The
moment-measure characterization and manifold-level consensus extensions
remain advanced source-dependent results under their stated hypotheses.

### 17. Notation Table

**Source:** `OT4ML/sections/notation-table.tex`, lines 1-337.

#### NOT-1 - Flow matching is renamed \(P_t\), colliding with matrix flux

- **Severity:** Low
- **Status:** Confirmed notation collision
- **Chapter/section:** Notation Table, dynamic OT and generative-model entries
- **Source location:** `OT4ML/sections/notation-table.tex:250`, line 277, and
  lines 325-326; compare `def-deterministic-interpolant` and
  `eq:interp-coupling` at
  `OT4ML/sections/transportation-models.tex:54-65`.
- **Problematic statement:** The table lists (P_t) and (\partial_tP_t) as
  the flow-matching interpolant and latent velocity. The chapter defines
  (I_t) and (\partial_tI_t). Line 250 already assigns (P_t) to the
  matrix-valued spatial flux in `eq-matrix-valued-continuity`.
- **Why problematic:** The table points to a symbol absent from its cited
  flow-matching equations and gives the same notation to two different
  mathematical objects.
- **Concrete correction:** Replace the flow-matching entries at lines 277,
  325, and 326 by (I_t) and (\partial_tI_t). Keep (P_t) only for the
  matrix flux at line 250.

#### NOT-2 - The listed SVGD field symbol is undefined

- **Severity:** Low
- **Status:** Confirmed notation error
- **Chapter/section:** Notation Table, generative-model entries
- **Source location:** `OT4ML/sections/notation-table.tex:332`; compare
  `eq-svgd-velocity` at
  `OT4ML/sections/transportation-models.tex:867-873`.
- **Problematic statement:** The table lists (\phi_\alpha^\star) as the
  RKHS steepest-descent field.
- **Why problematic:** That symbol never occurs in the source. The field is
  denoted (v_\alpha^{\rm SVGD}).
- **Concrete correction:** Replace (\phi_\alpha^\star) by
  (v_\alpha^{\rm SVGD}), with the unit-ball clarification in TM-1.

All other notation-table entries were checked against their cited labels and
source definitions. No additional material issue was found.

## Prioritized global summary

1. **Correct finite-recession conjugacy first (DN-1, High).** The explicit
   conjugate formula is false when (\phi'_\infty<\infty), as shown by the
   two-point full-TV counterexample. The correction is a global cap
   (f\leq\phi'_\infty). KL formulas are unaffected.

2. **Repair substantive hypotheses and false implications (Medium).** WAS-1
   must not infer Kantorovich equality from existence of a Monge minimizer.
   GW-1 must state (c=d^p) and a common ground space. GOP-1 needs (L^1)
   control before treating a Radon reconstruction as a finite density. DOT-1
   needs kernel/time-uniform regularity. TM-2 needs time-integrable latent
   velocities before asserting a continuity equation.

3. **Fix the confirmed factor error (DOT-2, Medium).** Under the book's full-TV
   convention, the (0/1)-ground-cost identity is
   (W_2^2=\|a-b\|_{\rm TV}/2).

4. **Verify the rectangular Nystrom theorem (STAT-1, Medium, source
   verification).** The primary theorem does not directly supply the
   manuscript's two-support rectangular extension or arbitrary parameter
   ranges. Either provide the reduction or narrow the proposition.

5. **Clean localized mathematical notation and scaling (Low).** SDW1-1,
   BCM-1, DOT-3, WGF-1, TM-1, NOT-1, and NOT-2 have direct local corrections.
   They should not be allowed to obscure the intended mathematics, but they do
   not invalidate surrounding results.

## Finding counts

### By severity and status

| Severity | Confirmed | Needs source verification | Total |
|---|---:|---:|---:|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 6 | 1 | 7 |
| Low | 7 | 0 | 7 |
| **Total** | **14** | **1** | **15** |

### By source/chapter

| Source/chapter | Critical | High | Medium | Low | Total |
|---|---:|---:|---:|---:|---:|
| `matching.tex` | 0 | 0 | 0 | 0 | 0 |
| `monge.tex` | 0 | 0 | 0 | 0 | 0 |
| `kantorovich.tex` | 0 | 0 | 0 | 0 | 0 |
| `wasserstein-space.tex` | 0 | 0 | 1 | 0 | 1 |
| `dual.tex` | 0 | 0 | 0 | 0 | 0 |
| `semidiscr-w1.tex` | 0 | 0 | 0 | 1 | 1 |
| `dual-norms.tex` | 0 | 1 | 0 | 0 | 1 |
| `sinkhorn.tex` | 0 | 0 | 0 | 0 | 0 |
| `sinkhorn-advanced.tex` | 0 | 0 | 0 | 0 | 0 |
| `statistical-ot.tex` | 0 | 0 | 1 | 0 | 1 |
| `generalized-wasserstein.tex` | 0 | 0 | 1 | 0 | 1 |
| `generalized-ot-problems.tex` | 0 | 0 | 1 | 0 | 1 |
| `beyond-comparing-measures.tex` | 0 | 0 | 0 | 1 | 1 |
| `dynamic-ot.tex` | 0 | 0 | 2 | 1 | 3 |
| `wasserstein-gradient-flows.tex` | 0 | 0 | 0 | 1 | 1 |
| `transportation-models.tex` | 0 | 0 | 1 | 1 | 2 |
| `notation-table.tex` | 0 | 0 | 0 | 2 | 2 |
| **Total** | **0** | **1** | **7** | **7** | **15** |

## Final validation

- Every production source at `OT4ML/OT4ML.tex:260-275` has explicit
  second-pass coverage, including `OT4ML/sections/semidiscr-w1.tex`.
- The notation appendix at `OT4ML/OT4ML.tex:291` has explicit second-pass
  coverage.
- All 17 source paths exist in `OT4ML/sections/` and their current line counts
  sum to 31,642.
- Every theorem, proposition, definition, equation, figure, and algorithm
  label named in a retained finding exists in the current source snapshot.
- Confirmed errors and proof gaps are separated from the single item requiring
  primary-source verification.
- No manuscript or build file was modified as part of this audit revision.
