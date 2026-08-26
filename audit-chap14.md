# Mathematical Audit of Chapter 14: Dynamic Optimal Transport

## Correction implementation (2026-08-26)

All 19 ranked findings in this audit have now been addressed in the
authoritative Chapter 14 source. The literature-dependent anisotropy question
Q1 has also been resolved at the level justified by the available theorem: the
chapter proves the affine-image case and explicitly labels the broader
anisotropic statement as formal rather than claiming an unsupported theorem.
The original audit is retained below as a historical record; the status table
in this section supersedes its descriptions of the manuscript before repair.

### Implemented corrections

| Audit item | Status | Correction made |
|---|---|---|
| **M1: nonlocal admissible class** | **Resolved** | Replaced the density-only definition by Erbar's lower-semicontinuous measure--flux relaxation. The state is now an arbitrary probability measure, the flux is a locally finite signed measure on the off-diagonal pair space, the action is defined through a common dominating measure, and the weak continuity equation includes the precise time-distributional endpoint identity and flux integrability. The former density--velocity formula is retained only as a specialization. The metric theorem is stated on `R^d` under Erbar's exact kernel hypotheses; attainment, completeness and geodesicity hold on its relaxed finite-distance components. |
| **M2: small-jump limit at vacuum** | **Resolved** | Added the singular lower bound on the radial profile required for the logarithmic mean, with exponent in the finite-second-moment range, and recorded the remaining regularity, support, monotonicity, and connectedness assumptions. The text now explains why ordinary integrable kernels fail at vacuum when `theta(1,0)=0`, rather than asserting convergence for every finite-second-moment radial profile. |
| **M3: variational-MFG properness** | **Resolved** | Moved the model to a bounded connected Lipschitz domain, imposed no flux, assumed a proper closed convex nonnegative congestion with `G(0)=0`, and used its recession function to define the lower-semicontinuous action on singular measures. The terminal cost is continuous and bounded below. The momentum problem is now stated as a closed convex problem, with existence under the stated finite-competitor assumptions. |
| **M4: bottleneck geometry** | **Resolved** | Defined the two-room experiment on its actual bounded nonconvex domain, imposed impermeable walls through the no-flux continuity equation, and stated the hard endpoint and density-cap functional explicitly. The numerical discussion now corresponds to the displayed variational problem. |
| **O1: weak continuity equation** | **Resolved** | Replaced the interior-test formulation by a boundary-aware space--time identity containing both endpoint measures. On bounded domains the no-flux condition is encoded by allowing test functions up to the spatial boundary. |
| **O2: fixed-reference state space** | **Resolved** | Restricted homogeneous fixed-reference distances to the effective state space of measures with finite action relative to the chosen reference measure, and stated metric properties only on finite-distance components of that space. |
| **O3: abstract path space** | **Resolved** | Assumed a Polish state space with a compatible complete bounded metric, equipped continuous paths with the uniform topology, required a lower-semicontinuous path action, identified the endpoint cost as lower semianalytic, and stated the measurable-selection hypothesis needed for endpoint reduction. |
| **O4: kernelized-action measurability** | **Resolved** | Added Borel measurability of the positive-definite kernel and strong measurability of RKHS vector fields. The proof now explains why bounded diagonal gives the required `L^2(alpha)` embedding only after these measurability hypotheses are in place. |
| **O5: zero-noise limit** | **Resolved** | Made the conclusion conditional on a path-space large-deviation principle, exponential tightness, and constrained Gamma convergence. For `dX_t=sqrt(epsilon)dB_t`, the text now records the correct rate action `1/2 int |dot omega|^2` and endpoint normalization. |
| **O6: concave-mobility boundary** | **Resolved** | Required a closed density interval, continuity and strict positivity of the mobility on its relative interior, and the lower-semicontinuous perspective extension at vacuum and outside the admissible density domain. The metric proposition now invokes precisely these hypotheses. |
| **O7: WFR converse** | **Resolved** | Replaced the informal lifting step by precise references to the dynamic-plan, superposition, and metric-identification results of Liero--Mielke--Savare, with the normalization used in the chapter made explicit. |
| **O8: spectral gauge example** | **Resolved** | Distinguished the only orthogonally invariant linear spectral gauge, a positive multiple of the trace, from nonscalar expressions `tr(GM)`, which are now described as anisotropic quadratic actions rather than spectral gauges. |
| **N1: arbitrary action called a distance** | **Resolved** | Renamed the general object the path value `E_A` and explicitly warned that symmetry, separation, and the triangle inequality require additional assumptions. Distance notation is introduced only in the homogeneous metric cases. |
| **N2: Brownian domination and atomic figure** | **Resolved** | Gave the exact Gibbs-reference entropy identity and stated the correct domination against the two reference marginals. For Brownian motion started from the prescribed source, only the target must have a Lebesgue density; no domination relation between source and target is needed. The text also distinguishes Brownian variance `epsilon`, which yields cost `|x-y|^2/2`, from variance `epsilon/2`, which yields the usual quadratic Sinkhorn kernel. The atomic illustration is now identified as schematic, or literal for a reciprocal prior obtained by mixing Brownian bridges with a discrete endpoint law. |
| **N3: three-state boundary** | **Resolved** | Declared the displayed endpoint laws to lie in the open simplex, consistently with the positive-density logarithmic-mean formula. |
| **N4: GHK/WFR parameter conversion** | **Resolved** | Verified and retained the exact conversion `kappa=sqrt(tau)/2` in the referenced unbalanced-OT discussion. |
| **N5: stale secondary sources** | **Resolved** | Synchronized `arxiv/sections/dynamic-ot.tex` with the authoritative source, ported the corrected material to `myst/chapters/dynamic-ot.md`, removed the obsolete duplicate path-space section from the MyST Sinkhorn chapter, and updated the notation tables and dependent gradient-flow references. |
| **N6: moment/momentum typo** | **Resolved** | Renamed the paragraph and all local descriptions to “momentum-based reformulation.” |
| **N7: logarithmic-mean chain rule at vacuum** | **Resolved** | Restricted the pointwise logarithmic identity to positive arguments and stated that boundary cases follow by the lower-semicontinuous approximation used by the relaxed action. |
| **Q1: anisotropic small-jump limit** | **Resolved at rigorous scope** | Proved the exact reduction for invertible affine images of admissible isotropic kernels, including the transformed local quadratic tensor. General anisotropic profiles are presented only as a formal covariance heuristic pending a theorem with the necessary compactness and recovery-sequence hypotheses. |

### Consistency and build checks

- Updated the dependent generalized-flow discussion so that it refers to a
  metric generated from the path value, rather than treating every action value
  as a distance; the quadratic Wasserstein example now explicitly identifies
  its path value with `W_2^2`.
- Updated the notation tables to use `E_A` consistently and to distinguish the
  nonlocal pair-flux measure from a velocity field.
- Rebuilt the full 496-page PDF. There are no undefined references or citations,
  and no overfull boxes in Chapter 14. The only remaining overfull-box messages
  are two pre-existing warnings in Chapter 11.
- Rebuilt the complete MyST site. Chapter 14 has no undefined macros, duplicate
  identifiers, or unresolved cross-references after moving the path-space
  Schrödinger material.
- Visually inspected the rendered pages containing the path-space reduction,
  continuum jump action, small-jump limit, variational-MFG formulation, and
  hard-congestion bottleneck figure.

### Second correction review (2026-08-26)

A further end-to-end review was performed after the corrections above. It did
not reopen any of the 19 ranked findings, but it sharpened several repaired
statements and found one additional notation clash in the web rendering.

| Area rechecked | Improvement made |
|---|---|
| **Brownian endpoint reduction** | Replaced the informal reference-shift sentence by the exact Gibbs-reference entropy identity. The text now distinguishes the Brownian convention `dX=sqrt(epsilon)dB`, whose endpoint cost is `|x-y|^2/2`, from the usual quadratic Sinkhorn kernel `exp(-|x-y|^2/epsilon)`, corresponding to variance `epsilon/2`. The required domination is stated against the initial reference marginal and Lebesgue terminal measure, not between the two prescribed marginals. |
| **Schrodinger reference notation** | Renamed the reference path law from `mathcal R^epsilon` to `mathsf R^epsilon`. This removes a book-wide collision with `mathcal R(c)`, the feasible set of continuous dual potentials, and fixes the previously inconsistent MyST macro rendering. |
| **Erbar theorem scope** | Restricted the metric theorem to the Euclidean setting and the exact kernel hypotheses of Erbar's Assumption 1.1. Corrected the compactness citation to Proposition 3.4, retained Proposition 4.3 for attainment and constant speed, and retained Theorem 4.4 for the extended metric, completeness, and geodesicity. No unsupported irreducibility hypothesis remains. |
| **Nonlocal action domain** | Added the local-finiteness condition on the oriented pair measures, which is needed before the Radon--Nikodym action is defined and is automatic under the Euclidean hypotheses used by the metric theorem. |
| **Small-jump limit** | Made the Lebesgue reference measure explicit, fully defined the affine-image kernels and their accelerated normalization, and kept the general anisotropic statement at the level of a formal covariance candidate only. |
| **Abstract quadratic actions** | Replaced the premature claim of a generated distance by a quadratic path value; distance terminology is now conditional on sequential closure and finite-infimum attainment. |
| **Variational MFG system** | Made the terminal variation argument precise: mass-preserving variations give `u_1-Psi` only up to a spatial constant, and the additive gauge of the multiplier fixes that constant. The connected-domain assumption required by the Dacorogna--Moser discussion was also made explicit. |
| **Dependent nonlocal flow theorem** | Corrected the later entropy-flow proposition to the translation-invariant Lebesgue setting of Erbar's rigorous EVI theorem and added its heat-kernel and moment assumptions. The formal logarithmic-mean computation is now clearly separated from the rigorous gradient-flow conclusion. |

After these refinements, the authoritative and arXiv sources agree modulo the
arXiv figure-path transformation. The 496-page main PDF, 482-page arXiv PDF,
and 20-page MyST site all build successfully. Neither PDF has undefined
references or citations; Chapter 14 introduces no overfull box. The two
remaining main-PDF overfull warnings are outside this chapter and predate this
review.

## Scope and verdict

This report is a fresh second-pass audit of the authoritative source
`/Users/gpeyre/Dropbox/github/ot4ml/OT4ML/sections/dynamic-ot.tex` (2,169 lines after correction).
The chapter was reread from beginning to end. Every definition, stated result, proof, displayed
calculation, coefficient, sign, exponent, boundary convention, metric assertion, limiting claim,
and algorithmic interpretation was rechecked independently. Definitions and results in other
chapters were inspected when they control a Chapter 14 claim. The arXiv and MyST versions were
used only to identify source drift.

The core calculations are strong. The Benamou--Brenier normalization, the `1/4`
Hamilton--Jacobi coefficient, the Girsanov and Fisher-information constants, the nonlocal factors
of `1/2`, the finite-chain examples, the WFR cone scaling, and the MFG Euler--Lagrange signs all
survive independent derivation. No Critical error was found.

The refined audit finds four Major defects. Two concern continuum nonlocal transport: the metric
theorem is applied to a density-only class different from Erbar's closed measure--flux class, and
the small-jump statement omits a theorem hypothesis that fails for the logarithmic mean with
ordinary integrable kernels. Two concern variational MFGs: the problem on `R^d` need not be a
proper lower-bounded variational problem under the stated data, and the two-room experiment
requires a bounded-domain no-flux model that is never written. The WFR equality and the
concave-mobility metric proposition, previously classified as Major, are not false theorems;
their actual defects are narrower and are reclassified as Moderate.

### Second-pass changes

This table gives an explicit disposition for every item in the first audit.

| First-pass item | Second-pass disposition | Reason |
|---|---|---|
| Old M1, concave-mobility boundary | **Downgraded and narrowed to O6 (Moderate)** | Proposition 1294 is conditional on lower semicontinuity and compactness, so it is not an unconditional false theorem. The definition and proof still fail to ensure those hypotheses and omit the density domain outside `I`. |
| Old M2, nonlocal relaxed class | **Confirmed as M1 (Major)** | Erbar's exact action, continuity equation, compactness theorem, and geodesic theorem use arbitrary measures and pair-flux measures, not the chapter's density--velocity class. |
| Old M3, small-jump limit | **Confirmed and sharpened as M2 (Major)** | Slepcev--Warren Theorem 1.3 requires an additional alternative for the upper comparison; Proposition 1.1 gives a direct obstruction for the logarithmic mean with integrable kernels. |
| Old M4, WFR proof | **Downgraded to O7 (Moderate)** | The proposition and all constants are true. The defect is that the proof sketch invokes, rather than proves or precisely cites, the decisive lifting/dynamic-plan theorem. |
| Old M5, MFG properness | **Confirmed but narrowed as M3 (Major)** | The algebraic convexity sentence is correct. The defect is that properness, lower semicontinuity, coercivity, and a lower bound are not supplied. |
| Old M6, bottleneck domain | **Confirmed as M4 (Major)** | A bottleneck has no mathematical effect in the displayed `R^d` problem unless the room geometry and impermeable boundary are included in the admissible set. |
| Old O1, weak continuity equation | **Confirmed as O1 (Moderate)** | Endpoints and no flux are stated verbally but not encoded in a boundary-aware weak identity. |
| Old O2, arbitrary action called a distance | **Downgraded to N1 (Minor)** | Line 976 explicitly warns that metric properties are not automatic. What remains is inconsistent nomenclature and square-root notation in the preceding definition. |
| Old O3, abstract path space | **Confirmed as O3 (Moderate)** | The arbitrary-state-space definition still lacks the topology and measurability needed for path laws, actions, endpoint costs, and disintegration. |
| Old O4, RKHS measurability | **Confirmed as O4 (Moderate)** | The repository's positive-definite-kernel definition is algebraic; bounded diagonal alone does not make RKHS functions Borel. |
| Old O5, zero-noise limit | **Confirmed as O5 (Moderate)** | The claim requires a path-space LDP/Gamma-convergence theorem and the Brownian convention has a limiting factor `1/2`. |
| Old O6, Brownian domination/atomic figure | **Downgraded and narrowed to N2 (Minor)** | The domination wording is imprecise. The atomic picture is valid as a schematic or for a specially constructed mixture of Brownian bridges, but not for ordinary unconditioned Brownian reference dynamics with finite KL. |
| Old N1, three-state boundary | **Confirmed as N3 (Minor)** | The displayed open-simplex path class and unspecified endpoint class remain inconsistent at the boundary. |
| Old N2, MFG terminal additive constant | **Removed as a false positive** | Probability-preserving variations first determine `u_1-Psi` up to a constant, but the value-function gauge fixes that constant. The proposition asserts existence of a normalized `u`, so `u_1=Psi` is correct. |
| Old N3, GHK/WFR parameter | **Confirmed as N4 (Minor)** | The exact conversion remains `kappa=sqrt(tau)/2`. |
| Old N4, source drift | **Confirmed as N5 (Minor)** | The secondary versions remain materially behind the authoritative LaTeX. |
| Old Q1, anisotropic limit | **Sharpened, partly resolved, still unranked** | Exact affine images of admissible isotropic kernels reduce rigorously to the published theorem. A theorem for arbitrary anisotropic profiles under the chapter's broad wording was not located. |
| New in this pass | **O2, O8, N6, N7** | The fixed-reference metric proposition has the wrong state space; the spectral local example violates its gauge hypothesis; "moment-based" is a typo; and the logarithmic-mean chain rule is undefined literally at vacuum. |

### Finding count

| Severity | Count |
|---|---:|
| Critical | 0 |
| Major | 4 |
| Moderate | 8 |
| Minor | 7 |
| **Total ranked findings** | **19** |

There is also one unranked literature-dependent uncertainty, Q1.

Severity meanings used here:

- **Critical:** invalidates a principal result or a substantial portion of the chapter.
- **Major:** a false central statement, a central theorem applied to the wrong object, or a
  central variational model that can be improper under its stated assumptions.
- **Moderate:** a mathematically consequential missing hypothesis, state space, domain,
  boundary condition, or essential proof citation.
- **Minor:** a local ambiguity, terminology problem, normalization cross-reference, or source
  consistency issue that does not alter the main result.

## Method and primary sources

All delicate constants were rederived rather than inferred from the chapter. The checks used the
distributional continuity equation, convex conjugacy of the momentum perspective, Girsanov's
formula, the entropy chain rule, time compression of homogeneous actions, Taylor expansion of
jump increments, explicit finite-graph flux minimization, and the cone line element. The six
first-pass Major findings were then compared with the exact hypotheses and conclusions of the
cited primary theorems.

| Topic | Primary or authoritative source used |
|---|---|
| Benamou--Brenier | J.-D. Benamou and Y. Brenier, *A computational fluid mechanics solution to the Monge--Kantorovich mass transfer problem*, Numer. Math. 84 (2000), [DOI](https://doi.org/10.1007/s002110050002), [author PDF](https://www.ceremade.dauphine.fr/~carlier/brenierbenamou.pdf). |
| Prescribed-Jacobian interpolation | B. Dacorogna and J. Moser, *On a partial differential equation involving the Jacobian determinant*, Ann. IHP 7 (1990), [NUMDAM](https://numdam.org/item/AIHPC_1990__7_1_1_0/). |
| Schrodinger problem | C. Leonard, *A survey of the Schrodinger problem and some of its connections with optimal transport*, [arXiv:1308.0215](https://arxiv.org/abs/1308.0215). |
| Zero-noise limit | C. Leonard, *From the Schrodinger problem to the Monge--Kantorovich problem*, [arXiv:1011.2564](https://arxiv.org/abs/1011.2564). |
| Concave mobilities | J. Dolbeault, B. Nazaret, and G. Savare, *A new class of transport distances between measures*, [arXiv:0803.1235](https://arxiv.org/abs/0803.1235). |
| Continuum jump geometry | M. Erbar, *Gradient flows of the entropy for jump processes*, [arXiv:1204.2190](https://arxiv.org/abs/1204.2190). |
| Nonlocal-to-local limit | D. Slepcev and A. Warren, *Nonlocal Wasserstein distance: metric and asymptotic properties*, [arXiv:2209.08407](https://arxiv.org/abs/2209.08407), [published article](https://link.springer.com/article/10.1007/s00526-023-02576-6). |
| Finite Markov geometry | J. Maas, *Gradient flows of the entropy for finite Markov chains*, [arXiv:1102.5238](https://arxiv.org/abs/1102.5238). |
| HK/WFR dynamic plans | M. Liero, A. Mielke, and G. Savare, *Optimal transport in competition with reaction: the Hellinger--Kantorovich distance and geodesic curves*, [arXiv:1509.00068](https://arxiv.org/abs/1509.00068). |
| General HK/WFR theory | M. Liero, A. Mielke, and G. Savare, *Optimal entropy-transport problems and a new Hellinger--Kantorovich distance between positive measures*, Invent. Math. 211 (2018), [DOI](https://doi.org/10.1007/s00222-017-0759-8), [publisher page](https://link.springer.com/article/10.1007/s00222-017-0759-8). |
| Dynamic unbalanced OT | L. Chizat, G. Peyre, B. Schmitzer, and F.-X. Vialard, *Unbalanced optimal transport: dynamic and Kantorovich formulations*, [arXiv:1508.05216](https://arxiv.org/abs/1508.05216). |
| Variational MFG | J.-D. Benamou, G. Carlier, and F. Santambrogio, *Variational mean field games*, [primary manuscript](https://cvgmt.sns.it/media/doc/paper/2979/BenCarSan-v4.pdf). |
| Augmented-Lagrangian MFG | J.-D. Benamou and G. Carlier, *Augmented Lagrangian methods for transport optimization, mean field games and degenerate elliptic equations*, [author manuscript](https://www.ceremade.dauphine.fr/~carlier/ALG2_Draft.pdf). |

## Ranked findings: established defects and required repairs

The findings below are established from the source and the stated hypotheses. The remaining
anisotropic literature question is separated afterward.

## Critical findings

None.

## Major findings

### M1. The nonlocal metric/geodesic theorem is applied to a different, non-closed admissible class

**Location.** `OT4ML/sections/dynamic-ot.tex:1526-1569`, Definition
`def-continuum-nonlocal-wasserstein`; `OT4ML/sections/dynamic-ot.tex:1574-1626`, Proposition
`prop-nonlocal-distance-properties` and its proof.

**Current claim.** The chapter defines curves only as `alpha_t=rho_t m` with an antisymmetric
pair velocity `v_t`. It then invokes Erbar's compactness and lower-semicontinuity results to claim
that this quantity is an extended distance on absolutely continuous probability measures and
that every finite pair has a constant-speed geodesic.

**Established defect.** Erbar's theorem is not a theorem for this density-only class. Its closed
action is defined for an arbitrary probability measure `mu` and a signed pair-flux measure `nu`.
Writing

\[
\mu^1(\mathrm dx,\mathrm dy)=K(x,\mathrm dy)\mu(\mathrm dx),\qquad
\mu^2(\mathrm dx,\mathrm dy)=K(y,\mathrm dx)\mu(\mathrm dy),
\]

and choosing a pair-space measure `lambda` dominating `mu^1`, `mu^2`, and `|nu|`, the relaxed
action has the form

\[
\mathcal A(\mu,\nu)
=\frac12\int
\frac{|\mathrm d\nu/\mathrm d\lambda|^2}
{\theta(\mathrm d\mu^1/\mathrm d\lambda,
        \mathrm d\mu^2/\mathrm d\lambda)}\,\mathrm d\lambda,
\]

with the lower-semicontinuous perspective convention. When `mu=rho m` and
`nu=v theta(rho(x),rho(y)) J`, this reduces to the chapter's density formula. The relaxed action
also covers singular `mu`, which is indispensable for weak compactness.

Narrow limits of absolutely continuous measures need not be absolutely continuous. Therefore the
chapter's admissible set is not weakly closed, and Erbar's Proposition 3.3 does not imply that a
minimizing sequence remains in that set. Nor does Proposition 4.3 or Theorem 4.4 imply that a
relaxed geodesic between density endpoints has a density at every intermediate time. The direct
method asserted at lines 1580, 1616, and 1621 is consequently being applied to a different
problem.

There is a second mismatch. For an infinite jump kernel, the pointwise-in-time derivative in
`eq-nonlocal-continuity-weak` and the phrase "for every test function" do not specify the test
class or the flux integrability needed to make the pair integral finite. Erbar's Definition 3.2
uses a narrowly continuous measure curve, a Borel family of flux measures, a time-distributional
identity, and an integrability condition such as integration of `(1 wedge |x-y|)` against the
flux.

**Concrete repair.** Define the relaxed measure--flux action first. Require a narrowly continuous
`mu_t`, Borel flux measures `nu_t`, the precise jump-moment/flux integrability, and

\[
\int_0^1\!\int \partial_t\varphi_t\,\mathrm d\mu_t\,\mathrm dt
+\frac12\int_0^1\!\iint
  (\varphi_t(y)-\varphi_t(x))\,\mathrm d\nu_t(x,y)\,\mathrm dt
=\int\varphi_1\,\mathrm d\mu_1-\int\varphi_0\,\mathrm d\mu_0.
\]

Then state the extended metric, attainment, completeness, and geodesic result on the
finite-distance components of the relaxed probability space. Present the current
density--velocity expression only as its absolutely continuous specialization. If a metric on
densities alone is intended, a separate closure/invariance theorem for that subclass is needed.

**Primary support.** Erbar's Assumption 2.1 defines the admissible means; Section 2 and Lemma 2.3
give the measure action and its density specialization; Definition 3.2 gives the weak continuity
equation; Proposition 3.3 gives compactness; Proposition 4.3 gives attainment; and Theorem 4.4
gives the extended metric and complete geodesic finite-distance components in
[arXiv:1204.2190](https://arxiv.org/abs/1204.2190). The chapter's factors and signs in the
density specialization are correct. The defect is the omitted relaxation and the theorem-class
mismatch.

### M2. The small-jump theorem omits the hypothesis that controls transport through vacuum

**Location.** `OT4ML/sections/dynamic-ot.tex:1628-1668`, especially lines 1659-1666.

**Current claim.** For a nonnegative radial profile with a finite nonzero second moment, and
"under the regularity and irreducibility hypotheses" of Slepcev--Warren, the chapter states for
compactly supported endpoints that

\[
\varepsilon\sqrt{\frac{M_2(\eta)}{2d}}\,
\mathcal W_{K_\varepsilon}\longrightarrow W_2.
\]

The mobility fixed in this section is the logarithmic mean.

**Established defect.** Slepcev--Warren Theorem 1.3 requires substantially more than radiality,
finite second moment, and generic irreducibility. In addition to Assumptions 2.1--2.2, the upper
comparison needed for convergence assumes either

\[
\eta\in L^1\quad\text{and}\quad\theta(1,0)>0,
\]

or a singular lower bound near the origin of the form

\[
\eta(z)\ge c|z|^{-d-s}\qquad(0<|z|<r_0)
\]

for some `s>0` compatible with the finite-second-moment assumption. The logarithmic mean has
`theta(1,0)=0`. Thus a smooth integrable radial kernel, including a compactly supported kernel,
does not satisfy the first alternative, and the singular alternative is absent from the chapter.

This is not merely a technical omission. Slepcev--Warren Proposition 1.1(i) states that when
`theta(1,0)=0` and the kernel is integrable near the origin, a Dirac mass is at infinite nonlocal
distance from any compactly supported probability measure singular to that Dirac. Consequently,
for the relaxed metric required by M1,

\[
\mathcal W_{K_\varepsilon}(\delta_0,\nu)=+\infty
\quad\text{while}\quad
W_2(\delta_0,\nu)<+\infty
\]

for many compactly supported `nu`; no finite scaling can yield the claimed convergence. If the
author instead retains a density-only endpoint class, the cited theorem still does not supply the
stated result without a separate endpoint-regularity theorem.

**Concrete repair.** State Slepcev--Warren's assumptions and the additional upper-bound
alternative explicitly. Since this section fixes the logarithmic mean, the clean theorem should
impose the required singular lower bound on `eta` near zero (together with the remaining
regularity, monotonicity, support, connectedness, and moment assumptions). Alternatively, use a
mean satisfying `theta(1,0)>0` and assume the relevant kernel integrability. State whether the
conclusion is pointwise, a two-sided comparison, or Gromov--Hausdorff convergence on compactly
supported probability measures.

**Derivation and primary support.** The normalization itself is correct:

\[
\int zz^\top\eta_\varepsilon(z)\,\mathrm dz
=\varepsilon^2\frac{M_2(\eta)}d I,
\]

and multiplying the kernel by `2d/(epsilon^2 M_2)` gives covariance `2I`; multiplying a jump
kernel by `c` divides the distance by `sqrt(c)`. The missing alternatives are exactly those in
Theorem 1.3, and the vacuum obstruction is Proposition 1.1, of
[Slepcev--Warren, arXiv:2209.08407](https://arxiv.org/abs/2209.08407).

### M3. The variational MFG definition need not be proper, lower semicontinuous, or bounded below

**Location.** `OT4ML/sections/dynamic-ot.tex:1988-2050`, equations
`eq-mfg-congestion-primitive`, `eq-variational-mfg-velocity`, `eq-mfg-congestion-functional`, and
`eq-variational-mfg-momentum`.

**Current claim.** A proper convex `G:[0,+infinity)->R union {+infinity}` and an unspecified
terminal potential `Psi` define a variational MFG on `R^d`. The momentum substitution is then
said to yield a convex problem.

**Established defect.** The algebraic convexity statement is correct, but the data do not make
the displayed optimization a proper variational problem.

1. On the infinite-volume domain, `G(r)=r^2+1` is proper and convex, but
   `int_Rd G(rho) dx=+infinity` for every probability density because `G(0)=1`. If `G(0)<0`, the
   integral can instead be `-infinity`. A normalization such as `G(0)=0` is essential on `R^d`.
2. The assignment `C_G(alpha)=+infinity` for every singular measure is not the weakly
   lower-semicontinuous relaxation when `G` has finite linear recession. For `G(r)=r`, every
   probability density has `C_G=1`, while smooth densities can converge narrowly to a Dirac mass
   assigned value `+infinity`. The relaxed functional is instead

   \[
   \mathcal C_G(\rho\,\mathrm dx+\alpha^s)
   =\int G(\rho)\,\mathrm dx+G^\infty\alpha^s(\mathbb R^d),
   \qquad G^\infty=\lim_{r\to\infty}\frac{G(r)}r,
   \]

   under the standard closed-convex hypotheses. The chapter's `+infinity` convention is valid
   for superlinear `G`, not for every proper convex `G`.
3. No lower-growth condition is imposed on `Psi`. Translating a fixed density by a vector of
   length `R` costs asymptotically `R^2/2` in the chapter's kinetic convention, whereas
   `Psi(x)=-|x|^2` contributes asymptotically `-R^2`. Translation leaves a spatially homogeneous
   congestion integral unchanged, so the infimum can be `-infinity`.
4. The relation `g=G'` requires differentiability. A merely proper convex `G` supplies a
   subdifferential, and a hard cap is the main nonsmooth example used later.

Thus "the problem is convex" is true in an algebraic extended-value sense, but it does not imply
that the objective is well defined, proper, closed, coercive, or has a minimizer.

**Concrete repair.** The simplest rigorous presentation is on a bounded Lipschitz domain or a
flat torus: impose no flux, normalize `G(x,0)=0`, assume `G` is proper, closed, convex, and has the
growth needed for compactness, and take `Psi` continuous or otherwise bounded below in a way
compatible with the kinetic term. On `R^d`, impose `G(0)=0`, nonnegativity/coercivity, moment
control, and a quadratic lower bound on `Psi`; then use the recession extension unless `G` is
superlinear. Write `g in partial G` until differentiability is imposed in the smooth optimality
proposition.

**Primary support.** The primary variational MFG formulation works on a smooth bounded domain or
the torus, uses normalized congestion data, continuous terminal data, and a weak continuity
equation with the boundary condition built in; see the setup of
[Benamou--Carlier--Santambrogio](https://cvgmt.sns.it/media/doc/paper/2979/BenCarSan-v4.pdf).
This finding does not dispute the chapter's momentum-perspective convexity calculation.

### M4. The bottleneck example is not the `R^d` problem that the chapter defines

**Location.** `OT4ML/sections/dynamic-ot.tex:1993-2008`, Definition
`def-variational-mfg-planning`; `OT4ML/sections/dynamic-ot.tex:2095-2112`, equations
`eq-variational-mfg-quadratic-terminal` and the two-room discussion/figure.

**Current claim.** The planning problem is posed on `R^d`. The hard-congestion discussion later
introduces an integral over an undefined `Omega` and describes two rooms connected by a doorway,
as though the existing admissible set confines mass to those rooms.

**Established defect.** A bottleneck is a property of the admissible spatial domain. In the
problem actually displayed on `R^d`, mass can leave the drawn rooms and move around the doorway.
Changing a terminal integral to `Omega` does not impose walls. Even after replacing `R^d` by a
bounded nonconvex domain, the continuity equation must include zero normal flux; otherwise mass
can cross the room boundary. The informal sentence in Definition 52 does not import a precise
wall condition into the later MFG definition or its discretization.

**Concrete repair.** State a separate bounded-domain planning problem before the example:

\[
\partial_t\rho+\nabla\!\cdot m=0
\quad\text{in }(0,1)\times\Omega,
\qquad
m\cdot n=0
\quad\text{on }(0,1)\times\partial\Omega,
\]

where `Omega` is the two-room Lipschitz domain. Replace all spatial integrals by integrals over
`Omega`; state that `rho_0`, `rho_star`, the terminal functional, and the cap are defined there;
and say explicitly that blocked grid faces implement zero flux in the discrete divergence. The
endpoint-aware weak identity in O1 is the appropriate measure formulation.

**Primary support.** The two-room examples in
[Benamou--Carlier--Santambrogio](https://cvgmt.sns.it/media/doc/paper/2979/BenCarSan-v4.pdf)
are bounded-domain problems whose admissible geometry and wall condition are part of the model.

## Moderate findings

### O1. The general weak continuity-equation definition does not encode endpoints and no flux

**Location.** `OT4ML/sections/dynamic-ot.tex:39-63`, equation
`eq:eulerian-advection-weak` and Definition `def-admissible-continuity-evolution`.

**Current claim.** The identity for tests in `C_c^1((0,1) x R^d)` is followed by a definition
that adds prescribed endpoint values and "no flux through the boundary when the domain is
bounded."

**Issue.** The displayed test functions vanish near `t=0,1`, so that identity contains neither
endpoint traces nor their signs. It is correct as an interior equation when narrow continuity and
endpoints are imposed separately. It does not, however, define the bounded-domain wall
condition: interior compactly supported tests cannot detect the boundary, and no normal trace is
specified. Joint measurability of `(t,x)->v_t(x)` is also implicit rather than stated.

**Concrete repair.** On a bounded domain require, for every suitable
`phi in C^1([0,1] x closure(Omega))`,

\[
\int_0^1\!\int_\Omega
(\partial_t\phi+\nabla\phi\cdot v_t)\,\mathrm d\alpha_t\,\mathrm dt
+\int_\Omega\phi(0,\cdot)\,\mathrm d\alpha_0
-\int_\Omega\phi(1,\cdot)\,\mathrm d\alpha_1=0.
\]

Allowing tests up to the boundary is the weak zero-flux formulation. Alternatively, retain
interior tests and separately require the normal trace `(alpha v).n=0`. State that `v` is jointly
Borel modulo `dt alpha_t`-null sets.

### O2. The fixed-reference metric proposition uses a larger state space than its action allows

**Location.** `OT4ML/sections/dynamic-ot.tex:1054-1064`, equation
`eq-general-measure-momentum-action`; `OT4ML/sections/dynamic-ot.tex:1138-1175`, Proposition
`prop-homogeneous-dynamic-action-distance` and its proof.

**Current claim.** The measure action is `+infinity` whenever `alpha` is not absolutely
continuous with respect to a fixed `lambda`, but the proposition defines the dynamic value "on
every fixed-mass class." Its proof says the constant curve gives zero self-distance for every
endpoint.

**Issue.** For a singular `alpha`, the constant curve has infinite action at almost every time,
not zero. This is not always repairable by allowing singularity only at the endpoint times. A
concrete counterexample on `R^d` is obtained by fixing `lambda=delta_0` and taking

\[
J_A(a,m)=\frac{|m|^2}{a}+|m|^2\quad(a>0),
\]

with the chapter's vacuum convention at `a=0`. This is lower semicontinuous, jointly convex,
even, nondegenerate, and 2-homogeneous in `m`; it is generated by
`A(a,w)=a|w|^2+a^2|w|^2`. For unit-mass curves, finite action requires
`alpha_t<<delta_0` for almost every `t`, hence `alpha_t=delta_0` almost everywhere in time.
Narrow continuity then forces `alpha_t=delta_0` for every `t`. Consequently there is no
finite-action curve from `delta_1` to itself and

\[
\mathsf D_{A,\delta_0}(\delta_1,\delta_1)=+\infty.
\]

The only finite unit-mass endpoint pair is `(delta_0,delta_0)`, attained by the constant curve,
so sequential closure and finite-value attainment are trivial in this example and do not rescue
the fixed-mass-class claim.

Thus reflexivity fails on the stated fixed-mass class even though the pointwise integrand has all
the structural properties listed in the proposition. The proposition's time-rescaling, symmetry,
and separation arguments remain correct on the effective state space.

**Concrete repair.** Restrict the proposition to

\[
\mathcal S_{A,\lambda}
=\{\alpha=a\lambda:\ a(x)\text{ belongs to the effective density domain a.e.}\},
\]

or to a specified finite-action component contained in that set. Then the constant curve has
zero action because `J_A(a,0)=0`. If singular endpoints are intended, replace the fixed-reference
formula by the appropriate intrinsic/recession relaxation and prove its closure separately.

### O3. The abstract path-space formulation lacks the topology and measurability needed to define it

**Location.** `OT4ML/sections/dynamic-ot.tex:603-681`, Definition
`def-path-space-transport` and Proposition `prop-path-space-ot-endpoint-reduction`.

**Current claim.** For an unspecified state space `X`, the chapter writes
`Omega=C([0,1];X)`, probability measures on `Omega`, an arbitrary path action, an endpoint cost,
and measurable path selections.

**Issue.** Continuity, the path-space sigma-algebra, Borel probability laws, and evaluation maps
are undefined until `X` has a topology. The integral of the path action requires measurability.
Even after choosing a topology, the infimum defining `c_A` need not be Borel, and regular
conditional path laws used in the Schrodinger section require standard Borel spaces. Earlier
book material establishes the Euclidean path space as Polish, but the chapter explicitly
generalizes here to arbitrary `X` without carrying those hypotheses into the definition.

**Concrete repair.** Assume `X` is Polish and give `C([0,1];X)` the uniform topology for a
compatible bounded metric (or the compact-open topology). Require the action to be Borel lower
semicontinuous, or at least lower semianalytic, so the endpoint value is universally measurable.
State the approximate measurable-selection assumption in a standard theorem-compatible form.
Retain the Polish/standard-Borel hypothesis for the subsequent entropy disintegration.

### O4. Bounded kernel diagonal does not imply measurable RKHS velocities

**Location.** `OT4ML/sections/dynamic-ot.tex:1435-1485`, Definition
`def-kernelized-bb-distance` and Proposition `prop-kernelized-bb-distance`; cross-chapter kernel
definition `OT4ML/sections/dual-norms.tex:174-185`.

**Current claim.** Any positive-definite kernel on `R^d` with bounded diagonal yields the stated
extended dynamic distance, and every RKHS velocity can be inserted in the weak continuity
equation.

**Issue.** The book's positive-definite-kernel definition is only the algebraic Gram-matrix
condition; it imposes no Borel measurability. Bounded diagonal proves the evaluation bound used
for separation, but not measurability of `x->v(x)`. For example, for a non-Borel set `A`,

\[
k(x,y)=\mathbf 1_A(x)\mathbf 1_A(y)
\]

is positive semidefinite with `sup_x k(x,x)<=1`, while its one-dimensional RKHS contains the
non-Borel function `1_A`. The integral `int grad(phi).v d alpha` is then undefined. Strong time
measurability of `t->v_t` is also unstated.

**Concrete repair.** Assume `k` is Borel measurable; continuity is the convenient sufficient
condition already used in the particle paragraph. Require RKHS functions to have Borel versions
and `t->v_t` to be strongly measurable in `H_k^d` with square-integrable norm. With these
additions, the bounded-evaluation separation proof and the concatenation argument are correct;
no characteristic or universal-kernel assumption is needed.

### O5. The zero-noise conclusion is not valid for an arbitrary reference family

**Location.** `OT4ML/sections/dynamic-ot.tex:688-706`, Definition
`def-schrodinger-bridge`; `OT4ML/sections/dynamic-ot.tex:872`, zero-noise sentence.

**Current claim.** After defining the Schrodinger problem for a general family `R^epsilon`, the
chapter says that zero noise makes bridges concentrate on least-action paths and recovers the
unregularized path-space/Kantorovich problem.

**Issue.** This conclusion requires a path-space large-deviation principle with speed
`1/epsilon`, a good rate equal to the intended path action, exponential tightness/equicoercivity,
and compatibility/closure of the endpoint constraints. Equivalently, one needs a constrained
Gamma-convergence result for `epsilon KL(.-|R^epsilon)` and convergence of minima/minimizers. A
fixed reference, a differently scaled process, or a process with another rate function need not
have the claimed limit.

There is also a normalization that should be stated at the claim itself. For
`dX=sqrt(epsilon)dB`, the path rate is

\[
\frac12\int_0^1|\dot\omega_t|^2\,\mathrm dt,
\]

so the static limiting cost is `|x-y|^2/2`, whereas the unregularized action at lines 624-632 is
written without `1/2`. The later Brownian paragraph correctly explains the factor-two temperature
renaming, but line 872 says "recovers" without that qualification.

**Concrete repair.** Replace the unconditional sentence by an LDP/Gamma-convergence statement
with the rate action and endpoint hypotheses. State that the Brownian convention used here gives
one half of the earlier quadratic action in value, although it has the same minimizers after the
temperature/cost normalization.

**Primary support.** These hypotheses and the constrained Gamma-convergence mechanism are the
content of Leonard's [arXiv:1011.2564](https://arxiv.org/abs/1011.2564), not a consequence of
the entropy-projection definition alone.

### O6. The concave-mobility definition does not ensure the lower-semicontinuity assumed by its theorem

**Location.** `OT4ML/sections/dynamic-ot.tex:1072-1125`, Proposition
`prop-momentum-perspective-convexity`; `OT4ML/sections/dynamic-ot.tex:1243-1304`, Definition
`def-concave-mobility-distance` and Proposition `prop-concave-mobility-distance`.

**Current claim.** The general perspective proposition says to extend the interior integrand by
lower semicontinuity. The later mobility definition instead hard-codes

\[
J_\theta(a,m)=0\quad\text{at }\theta(a)=0,m=0,
\qquad
J_\theta(a,m)=+\infty\quad\text{at }\theta(a)=0,m\ne0,
\]

for an arbitrary nonnegative concave `theta:I->[0,+infinity)`. The proof at line 1301 says the
earlier proposition gives a lower-semicontinuous density.

**Issue and corrected classification.** Proposition 1294 itself assumes the "standard
compactness and lower-semicontinuity hypotheses," so the distance theorem is conditional and is
not false. The definition and proof nevertheless do not establish those hypotheses. Concavity on
a closed interval need not prevent a downward endpoint jump. For

\[
I=[0,1],\qquad \theta(0)=0,\qquad\theta(a)=1\quad(0<a\le1),
\]

`theta` is nonnegative and concave, but for `m ne 0`,

\[
J_\theta(0,m)=+\infty,
\qquad
J_\theta(a_n,m)=|m|^2\quad(a_n\downarrow0),
\]

so the hard-coded extension is not lower semicontinuous. Proposition 1072's instruction to take
the l.s.c. envelope would give a different boundary value.

The density domain is also incomplete. `J_theta` is defined only for `a in I`, while the measure
action is applied without either requiring `d alpha/d lambda in I` almost everywhere or assigning
`+infinity` outside `I`. For `theta(a)=a(1-a/M)` on `[0,M]`, densities above `M` must be
inadmissible. The two concrete chapter examples `a^gamma` and `a(1-a/M)` are continuous on their
stated domains and do not suffer from the endpoint-jump counterexample.

**Concrete repair.** Define the closed perspective as the l.s.c. envelope of
`|m|^2/theta(a)` on the positive-mobility relative interior and set it to `+infinity` outside
`I`. Explicitly restrict the state space to densities in `I`. A simpler sufficient presentation
is to assume continuity on `closure(I)`, strict positivity in the relative interior, and use the
hard barrier only where the continuous mobility tends to zero. Keep compactness/coercivity as
separate assumptions rather than claiming that bare concavity supplies them.

**Primary support.** Sections 2--3 of
[Dolbeault--Nazaret--Savare, arXiv:0803.1235](https://arxiv.org/abs/0803.1235) give the general
closed convex measure-functional and recession framework. Their specific mobility class has
additional monotonicity assumptions, so it should be cited for the closure mechanism rather than
as a theorem covering every exclusion mobility written in this chapter.

### O7. The WFR proposition is true, but its proof sketch omits the theorem that proves the converse

**Location.** `OT4ML/sections/dynamic-ot.tex:1908-1930`, Proposition
`prop-static-dynamic-unbalanced`, especially lines 1923-1927.

**Current claim.** After checking one smooth cone path, the proof says that every finite-action
Eulerian triple can be lifted "after relaxation" to a cone curve of the same action and that lower
semicontinuity yields the general finite-measure statement.

**Issue and corrected classification.** The proposition and normalization are correct. The
single-particle calculation proves only

\[
4\kappa^2\dot r^2+r^2|\dot x|^2
=a(|\dot x|^2+\kappa^2g^2),
\qquad a=r^2,\quad g=2\dot r/r.
\]

It does not prove that an arbitrary measure-valued balance-equation triple admits a compatible
dynamic plan on the cone, nor the two metric-derivative inequalities needed for equality. That is
the main lifting/superposition theorem of HK theory. Lower semicontinuity alone cannot create the
missing recovery lift; it can only pass to a limit after both inequalities are available. Line
1923 effectively states the essential theorem without identifying its hypotheses or theorem
number.

**Concrete repair.** Retain lines 1915-1921 as a normalization check, then cite the exact
dynamic-plan comparison. In the normalization `kappa=1/2`, set the Liero--Mielke--Savare scalar
field by `g=4 xi`; their action `|Xi|^2+4 xi^2` becomes `|w|^2+(1/4)g^2`, exactly the chapter's
action. General `kappa` follows by scaling the base metric and radial factor as in
`Delta_kappa`. State the domain and regularity setting of the selected theorem.

**Primary support.** In [arXiv:1509.00068](https://arxiv.org/abs/1509.00068), Theorem 4.3 is the
dynamic-plan representation; Theorem 4.5 sends HK-absolutely-continuous curves to vector/scalar
fields with the lower action bound; Theorem 4.6 proves the converse upper bound; and the proof of
Theorem 3.6(v) concludes `HK=D_{1,4}`. The full complete-separable-space treatment is in the
Inventiones monograph/article [DOI 10.1007/s00222-017-0759-8](https://doi.org/10.1007/s00222-017-0759-8).

### O8. The local spectral example violates the definition of a spectral gauge

**Location.** `OT4ML/sections/dynamic-ot.tex:1318-1354`, especially line 1348; controlling
definition `OT4ML/sections/generalized-wasserstein.tex:2383-2393`, Definition
`def-monotone-spectral-gauge`.

**Current claim.** The chapter assumes a monotone spectral gauge, then says the action becomes
local for linear spectral gauges and gives `gamma(M)=tr(GM)` for arbitrary `G succeq 0`.

**Issue.** The book's definition requires orthogonal invariance and nondegeneracy. For
`gamma_G(M)=tr(GM)`,

\[
\gamma_G(QMQ^\top)=\operatorname{tr}(Q^\top GQ\,M).
\]

This equals `gamma_G(M)` for every positive semidefinite `M` and every orthogonal `Q` only when
`G=cI`. Moreover, `gamma_G` vanishes on a nonzero positive semidefinite matrix whenever `G` is
singular, contradicting the nondegeneracy requirement. Thus a general `G succeq 0` is a linear
Loewner-monotone matrix functional, but not a monotone spectral gauge in the chapter's defined
class.

**Concrete repair.** Either restrict the example to `G=cI` with `c>0`, in which case it is the
scaled trace action, or explicitly broaden the surrounding paragraph to non-spectral monotone
matrix gauges and state that singular `G` generates only a pseudometric. The static/dynamic
equality Proposition 1358 is correct for the actual monotone spectral gauges and does not depend
on this local-example wording.

## Minor findings

### N1. The arbitrary-action definition still uses distance notation before metric hypotheses are imposed

**Location.** `OT4ML/sections/dynamic-ot.tex:955-976`, Definition
`def-generalized-dynamic-action-distance`; compare Proposition
`prop-homogeneous-dynamic-action-distance` at lines 1138-1209.

**Current claim and narrowed issue.** Definition 960 names `D_A` a distance and fixes a square
root for every nonnegative action. Line 976 immediately and correctly warns that metric
properties are not automatic, so this is not a substantive theorem error. The preceding name and
normalization remain literally misleading: `A=0` gives zero between all endpoints, an action not
even in velocity can be asymmetric, and `A=|v|^4` on moving Diracs gives `D_A(x,y)=|x-y|^2`
under the fixed square root, which fails the triangle inequality.

**Repair.** Call `eq-generalized-action-length-distance` the *dynamic action value* or *distance
candidate*, and reserve
`D_A` and the `1/r` root for the homogeneous hypotheses of Proposition 1138. Keep the warning at
line 976.

### N2. The Brownian domination sentence and atomic illustration conflate two reference laws

**Location.** `OT4ML/sections/dynamic-ot.tex:883-918`, Brownian/Sinkhorn paragraph and the text
introducing Figure `fig:sinkhorn-path-space-bridges`.

**Current claim.** An ordinary heat-kernel endpoint law is said to be rewritable with respect to
`alpha tensor beta` when endpoint densities are "fixed and mutually absolutely continuous," and
the subsequent discrete atomic bridge picture is described in the same Brownian language.

**Issue.** If Brownian motion starts from `alpha`, then

\[
R_{01}^\varepsilon(\mathrm dx,\mathrm dy)
=\alpha(\mathrm dx)p_\varepsilon(x,y)\,\mathrm dy.
\]

A finite endpoint KL coupling with terminal marginal `beta` requires `beta<<Lebesgue`; it does
not require `alpha` and `beta` to be mutually absolutely continuous with each other. If the
reference starts from another law `r_0`, one additionally needs `alpha<<r_0`. Rewriting against
`alpha tensor beta` introduces a one-body factor `1/(d beta/dx)(y)`, whose integral is constant
under the terminal marginal constraint; this is the precise reason the Sinkhorn objective is
unchanged up to constants.

With an ordinary unconditioned Brownian reference, an atomic terminal law is singular and gives
infinite path-space KL. The figure is nevertheless mathematically meaningful as a visualization
of a discrete Sinkhorn endpoint plan filled with Gaussian bridge samples. It can also be made
literal by defining the reference itself as a mixture of Brownian bridges with a discrete
endpoint prior; that reciprocal reference is not the ordinary Brownian law used at lines 713 and
883.

**Repair.** Replace the mutual-absolute-continuity phrase by the exact domination conditions and
label the atomic figure as schematic, or specify the discrete-endpoint bridge-mixture reference.
The displayed Brownian factor-of-two conversion is correct.

### N3. The three-state formula does not state whether boundary endpoints are admissible

**Location.** `OT4ML/sections/dynamic-ot.tex:1756-1803`, equation
`eq-three-state-markov-distance`.

**Current claim.** The infimum is over paths `a_t in int(simplex_3)` with endpoints `a_0,a_1`,
but no endpoint class is stated.

**Issue and repair.** If the path condition includes `t=0,1`, boundary endpoints are infeasible.
State `a_0,a_1 in int(simplex_3)`. If the closed simplex is intended, use the l.s.c. edge-flux
action or the metric completion, allowing interior paths on `0<t<1` with boundary traces. The
local norm, the factors `Theta_ij=(1/2)theta(a_i,a_j)`, and the displayed minimizing flux are
correct in the interior.

### N4. The GHK-to-WFR cross-reference omits the parameter conversion

**Location.** `OT4ML/sections/generalized-wasserstein.tex:725-738`, especially line 738; Chapter
14 normalization `OT4ML/sections/dynamic-ot.tex:1883-1904`.

**Current claim.** The intrinsic length metric of `GHK_tau` is identified with WFR without
mapping `tau` to `kappa`.

**Issue and repair.** Under the displayed conventions,

\[
\kappa=\frac{\sqrt\tau}{2}.
\]

The GHK chordal cone has radial prefactor `tau` and local angular scale
`|x-y|/sqrt(tau)`. Chapter 14 has prefactor `4 kappa^2` and angle
`|x-y|/(2 kappa)`. Equating either pair gives the formula. Add it to the cross-reference. The
Chapter 14 statement that `kappa=1/2` matches the book's unscaled HK convention is the `tau=1`
case and is correct.

### N5. The arXiv and MyST chapter versions are materially stale

**Location.** `arxiv/sections/dynamic-ot.tex`; `myst/chapters/dynamic-ot.md`; authoritative source
`OT4ML/sections/dynamic-ot.tex`.

**Current drift.** The arXiv source still says that the RKHS automatically provides smooth
velocities, retains the old incorrect full-TV normalization in the discrete-simplex paragraph and
caption, and identifies a hard terminal density constraint with a pointwise potential rather than
a functional of the full endpoint density. The authoritative LaTeX has corrected all three. The
arXiv copy also uses flattened figure paths, which is a build-layout difference rather than a
mathematical drift. The MyST chapter omits the entire Schrodinger section corresponding to
authoritative lines 592-942 and the entire variational MFG section at lines 1961-2123.

**Repair.** Synchronize secondary sources only after corrections to the authoritative source are
implemented. In particular, do not overwrite the corrected TV factor or terminal-functional
wording from the stale copies.

### N6. "Convex moment-based reformulation" should be "momentum-based"

**Location.** `OT4ML/sections/dynamic-ot.tex:294`, paragraph title before the momentum
perspective.

**Issue and repair.** The paragraph introduces the flux/momentum variable `omega=alpha v`; it is
not a moment method. Replace `moment-based` by `momentum-based`. The MyST heading repeats the
same typo.

### N7. The logarithmic-mean chain rule is literal only for positive arguments

**Location.** `OT4ML/sections/dynamic-ot.tex:1507-1518`, Definition
`def-logarithmic-mean`; repeated at `OT4ML/sections/dynamic-ot.tex:1696`.

**Current claim.** After defining `theta(a,b)=0` when `ab=0`, the text writes
`theta(a,b)(log a-log b)=a-b` without qualification.

**Issue.** The identity is ordinary algebra for `a,b>0`. At `a=0` or `b=0`, `log 0` is not a
real number and the product `0 times infinity` is undefined. The equality is valid only as the
continuous limiting identity that motivates the closed logarithmic mean, or within a
subdifferential/positive-time entropy calculation. This matters because vacuum behavior is
central to M2.

**Repair.** Write "for `a,b>0`, with the boundary relation understood by limit" and use a
positive-density approximation or subdifferential statement when applying it to boundary states.

## Literature-dependent uncertainty

This item is not counted in the severity table because the formal coefficient is established and
a substantial subclass is rigorous, but no primary theorem was found under the full sentence's
generality.

### Q1. General anisotropic nonlocal-to-local convergence

**Location.** `OT4ML/sections/dynamic-ot.tex:1668`.

**Current claim.** Dropping isotropy is said to yield an anisotropic Wasserstein geometry.

**What is established directly.** Suppose the accelerated jump covariance converges to `2A`
with `A` positive definite. For smooth positive densities and smooth pair potentials,
`bar nabla psi(x,x+z)=grad psi(x).z+o(|z|)`. The weak equation and action then converge formally
to

\[
\frac{\mathrm d}{\mathrm dt}\int\varphi\rho
=\int\rho\,\nabla\varphi^\top A\nabla\psi,
\qquad
\mathbb A_{\rm loc}
=\int\rho\,\nabla\psi^\top A\nabla\psi.
\]

Thus the local Eulerian velocity is `u=A grad psi` and

\[
\mathbb A_{\rm loc}=\int\rho\,u^\top A^{-1}u,
\]

the anisotropic `W_2` action for the ground norm `|A^{-1/2}(x-y)|`. The factor `2A` is necessary:
the `1/2` in the pair integral cancels the `2` in the covariance.

**Rigorous affine subclass.** Let `eta` satisfy the exact isotropic Slepcev--Warren theorem and
let `B` be invertible. Define

\[
\eta_B(z)=|\det B|^{-1}\eta(B^{-1}z).
\]

For any 1-homogeneous interpolation mean, including the logarithmic mean, the change of variables
`x=B xi`, `y=B zeta` makes the density Jacobian cancel against the homogeneity of `theta`. Hence

\[
\mathcal W_{\eta_{B,\varepsilon}}(\alpha,\beta)
=\mathcal W_{\eta_\varepsilon}(B^{-1}_\sharp\alpha,B^{-1}_\sharp\beta).
\]

Applying the published isotropic theorem gives a rigorous limit to

\[
W_2(B^{-1}_\sharp\alpha,B^{-1}_\sharp\beta),
\]

whose accelerated covariance and tangent tensor are `2BB^T` and `(BB^T)^{-1}`. This fully
justifies the chapter's sentence for elliptic linear images of admissible radial kernels.

**What remains unverified.** Slepcev--Warren Assumption 2.1 and Theorem 1.3 are stated for an
isotropic radial, radially nonincreasing profile; the paper remarks that isotropy simplifies its
statements but does not state a general arbitrary-anisotropic Gamma/Gromov--Hausdorff theorem.
The literature search did not locate a primary theorem covering every translation-invariant
anisotropic profile with only a positive covariance and the chapter's broad kernel assumptions.
For such profiles, covariance identification alone does not prove compactness, recovery
sequences, tail control, or vacuum connectivity.

**Repair.** Either restrict the sentence to the rigorous affine subclass, label the general
matrix-covariance calculation formal, or cite a theorem that supplies the missing compactness and
Gamma-convergence assumptions. The exact isotropic source is
[Slepcev--Warren, arXiv:2209.08407](https://arxiv.org/abs/2209.08407), Assumption 2.1 and
Theorem 1.3.

## Chapter-wide coverage table

"Correct" means that the statement and normalization survived independent derivation under the
hypotheses stated or under an explicitly announced formal smooth regime. "Needs clarification"
points to a Moderate/Minor finding or Q1. "Contains error" identifies a Major defect or a literal
state-space/example mismatch.

| Source range | Section, result, or major paragraph | Status | Audit conclusion |
|---|---|---|---|
| 1-20 | Chapter introduction | Correct | The chapter map accurately describes the material. |
| 21-50 | Lagrangian/Eulerian descriptions | Correct | Pushforward differentiation and the sign of the continuity equation are correct. |
| 51-63 | Admissible continuity-equation evolution | Needs clarification | The interior equation is correct; endpoints and bounded-domain no flux need the weak identity in O1. |
| 65-106 | Lagrangian flows solve the continuity equation | Correct | The Eulerian velocity and weak chain-rule proof are correct under the stated integrability. |
| 108-121 | Inverse velocity fields | Correct | The weighted-divergence kernel and rotational Gaussian example are correct. |
| 122-155 | Dacorogna--Moser inversion | Correct | All divergence, Poisson, and velocity signs agree; positivity/boundary caveats are acknowledged. |
| 156-216 | Least-square inversion | Correct | The weighted Poisson equation, gradient selection, and additive gauge are correct in the stated formal regime. |
| 217-293 | Benamou--Brenier theorem/proof | Correct | The no-`1/2` action equals `W_2^2`; coupling and superposition arguments have the right directions. |
| 294 | Momentum paragraph title | Needs clarification | "Moment-based" is a terminology typo (N6). |
| 297-367 | Convex momentum formulation | Correct | Perspective, vacuum convention, measure action, and reference independence are correct. |
| 368-468 | Dynamic Hamilton--Jacobi duality | Correct | The `1/4` coefficient, signs, and `m=(rho/2)grad phi` are correct. |
| 470-539 | Douglas--Rachford splitting | Correct | The local perspective prox/global affine projection interpretation is correct at the stated discretized/formal level. |
| 540-591 | Benamou--Brenier path law | Correct | Straight paths, unique dynamical plan under an a.c. source, and deterministic conditional velocity a.e. in time are correct. |
| 600-684 | General path-space action and endpoint reduction | Needs clarification | The algebraic reduction is right; the arbitrary-space measurable setup is incomplete (O3). |
| 688-706 | Schrodinger bridge definition | Correct | The relative-entropy projection is standard once the path space is standard Borel. |
| 709-748 | Girsanov/control/Doob transform | Correct | `sqrt(epsilon)` gives `epsilon KL=(1/2)E int|u|^2`; drift and viscous HJ signs are right. |
| 753-807 | Viscous Benamou--Brenier form | Correct | Current velocity, Fisher coefficient `sigma^2/8`, and endpoint entropy sign/coefficient are right. |
| 811-870 | Endpoint KL chain rule | Correct | Disintegration and bridge-mixture minimization give the endpoint problem exactly. |
| 872 | Zero-noise sentence | Needs clarification | Requires LDP/Gamma convergence and an explicit factor `1/2` under the chosen Brownian convention (O5). |
| 878-942 | Brownian/Sinkhorn paragraph and figure | Needs clarification | Heat-kernel temperature is correct; domination and the atomic-reference interpretation need N2. |
| 946-1039 | Generalized action/quadratic/local actions | Needs clarification | Formulas are correct; arbitrary actions should be called distance candidates (N1). |
| 1040-1132 | Momentum perspectives and concave-composition convexity | Correct | Interior convexity and intrinsic 1-homogeneous reference independence are correct when the l.s.c. extension is used. |
| 1134-1211 | Homogeneous metric proposition | Contains error | Time-rescaling and triangle inequality are correct, but the fixed-reference state space makes reflexivity false as stated (O2). |
| 1213-1235 | `W_p` and Beckmann example | Correct | The `p`-homogeneous and squared-length normalizations are correct. |
| 1237-1306 | Concave-mobility distance | Needs clarification | The conditional theorem is true; its definition/proof do not ensure l.s.c. or enforce the density interval (O6). |
| 1309-1354 | Spectral action and local example | Contains error | Matrix-perspective convexity is correct, but general `tr(GM)` is not a spectral gauge under the book's definition (O8). |
| 1356-1424 | Static/dynamic spectral equality | Correct | Both Loewner comparisons, Jensen steps, and the common static value are correct. |
| 1425-1494 | Kernelized Benamou--Brenier geometry | Needs clarification | Metric algebra and particle Gram argument are correct after adding Borel/time measurability (O4). |
| 1495-1520 | Nonlocal introduction/logarithmic mean | Needs clarification | The mean is correct; its entropy chain rule needs a positive-argument/boundary-limit qualification (N7). |
| 1521-1626 | Continuum jump-kernel distance | Contains error | Density factors are correct, but Erbar's relaxed compactness/geodesic theorem does not apply to the defined class (M1). |
| 1628-1667 | Small-jump limit | Contains error | Covariance and scaling constants are correct; the theorem omits the vacuum-connectivity alternative (M2). |
| 1668 | Anisotropic extension | Needs clarification | Tensor and factor are formally correct and rigorous for affine radial kernels; arbitrary profiles remain Q1. |
| 1671-1738 | Reversible finite Markov geometry | Correct | Relative densities, edge measure, Onsager sign, action factor, and potential gauge are consistent. |
| 1743-1754 | Two-state complete graph | Correct | The scalar line element has no missing factor. |
| 1756-1804 | Three-state complete graph | Needs clarification | The flux minimizer is correct; endpoint treatment on the simplex boundary is unspecified (N3). |
| 1806-1818 | Ordinary `0/1`-metric comparison | Correct | With the book's full TV norm, `W_2^2=(1/2)||a-b||_TV` is correct. |
| 1820-1879 | WFR balance equation/action | Correct | Source sign, velocity/momentum forms, perspective, and `kappa` placement are correct. |
| 1880-1907 | WFR cone cost/scaling | Correct | Prefactor `4kappa^2`, angle `d/(2kappa)`, cutoff, and base `kappa=1/2` convention agree. |
| 1908-1930 | Static/dynamic WFR equality | Needs clarification | The theorem and constants are correct; the proof must explicitly invoke the lifting theorems (O7). |
| 1932-1960 | Balanced/unbalanced illustration | Correct | It is explicitly described as a qualitative KL-relaxed surrogate, not an exact WFR geodesic. |
| 1961-1984 | Individual control/potential MFG | Needs clarification | Agent cost and HJB convention are right; domain/data assumptions are missing (M3-M4). |
| 1985-2050 | MFG planning and momentum convexification | Contains error | Algebraic convexity is right, but the displayed `R^d` functional can be improper, nonclosed, or unbounded (M3). |
| 2052-2081 | Smooth MFG optimality system | Correct | PDE signs, factor `1/2`, feedback, and normalized terminal condition are correct; the old gauge finding is removed. |
| 2083-2113 | Hard cap/two-room bottleneck | Contains error | Cap and endpoint functionals are convex, but the room domain and impermeable wall are absent (M4). |
| 2115-2123 | Scope/computational consequence | Correct | Potential-game qualification and local-prox/linear-space-time interpretation are accurate once the model is properly posed. |
| Secondary versions | arXiv/MyST parity | Needs clarification | The secondary sources are stale (N5). |

## Delicate claims checked and found correct

The following claims were rederived independently and should not be changed except for the
hypotheses identified above.

1. **Continuity-equation sign.** If `alpha_t=(T_t)_#alpha_0` and
   `v_t=dot T_t o T_t^{-1}`, then
   `d/dt int phi d alpha_t=int grad(phi).v_t d alpha_t`, giving
   `partial_t alpha+div(alpha v)=0` with the chapter's sign.

2. **Dacorogna--Moser signs.** For `rho_t=(1-t)rho_0+t rho_1`, choosing
   `w=-grad phi` and `Delta phi=rho_1-rho_0` gives
   `div w=rho_0-rho_1=-partial_t rho_t`; hence `v=w/rho_t` is correct.

3. **Least-square inverse.** Minimizing `int rho|v|^2` under
   `-div(rho v)=partial_t rho` gives `v=grad phi` and
   `-div(rho grad phi)=partial_t rho`. The inverse-operator minus sign is correct.

4. **Benamou--Brenier normalization.** The action is `int rho|v|^2`, not half that
   quantity, so its value is exactly `W_2^2`.

5. **Benamou--Brenier proof directions.** Straight interpolation of a coupling gives the
   dynamic upper bound; conditional averaging can only reduce energy. The superposition
   principle and pathwise Jensen give the static upper bound on every dynamic action. The two
   inequalities are oriented correctly.

6. **Displacement velocity.** If the source is absolutely continuous, the Brenier map exists and
   the interpolating map `(1-t)Id+tT` is injective for `t<1`; the Eulerian formula for `v_t` and
   the deterministic conditional velocity are valid for almost every `t in (0,1)`.

7. **Quadratic perspective.** `J(a,m)=|m|^2/a` with the vacuum convention is convex, l.s.c., and
   jointly 1-homogeneous. Its measure action is independent of the dominating measure and finite
   exactly when `omega=v alpha` with `v in L^2(alpha)`.

8. **Dynamic dual coefficient.** The inequality

   \[
   m\cdot p\le |m|^2/\rho+\rho|p|^2/4
   \]

   yields `partial_t phi+|grad phi|^2/4<=0` and equality at
   `m=(rho/2)grad phi`. The `1/4` is forced by the no-`1/2` primal action.

9. **Static dual recovery.** Along any path, the HJ inequality gives
   `phi_1(y)-phi_0(x)<=|x-y|^2`; hence `(-phi_0,phi_1)` has the correct static-dual signs.

10. **Douglas--Rachford interpretation.** After discretization, the perspective functional is
    pointwise and the continuity/end-point condition is affine. Their proximal maps are,
    respectively, local perspective proxes and a global orthogonal projection. The displayed DR
    iteration is standard.

11. **Quadratic path law.** Conditional on endpoints, Cauchy--Schwarz makes the straight segment
    the unique minimum-energy path. An absolutely continuous source makes the quadratic optimal
    endpoint coupling unique, so the dynamical plan is unique.

12. **Girsanov normalization.** For
    `dX=u dt+sqrt(epsilon)dB`,
    `KL(M|R)=(1/(2epsilon))E int|u|^2`; multiplication by `epsilon` gives the chapter's `1/2`.

13. **Doob drift and viscous HJ equation.** With generator `(epsilon/2)Delta`,
    `u*=epsilon grad log h`, and `phi=epsilon log h` satisfies
    `partial_t phi+(1/2)|grad phi|^2+(epsilon/2)Delta phi=0`.

14. **Current-velocity expansion.** From
    `u_current=v_forward-(sigma/2)grad log rho`, the cross term is
    `(sigma/2)(H(rho_1)-H(rho_0))` and the Fisher coefficient is `sigma^2/8`. Replacing a
    Fokker--Planck coefficient `(sigma/2)Delta` by `sigma Delta` changes the Fisher coefficient to
    `sigma^2/2`, as stated.

15. **Endpoint KL decomposition.** Disintegrating both path laws over `(X_0,X_1)` gives endpoint
    KL plus the conditional bridge KL. Filling every endpoint pair with the reference conditional
    bridge makes the second term zero exactly.

16. **Brownian/static temperature.** Unit-time variance `epsilon` has heat kernel
    `exp(-|x-y|^2/(2epsilon))`; therefore `epsilon KL` produces cost `|x-y|^2/2`. The later
    factor-two temperature renaming is correct.

17. **Homogeneous time rescaling.** Compressing an `r`-homogeneous momentum action into a time
    interval of length `tau` multiplies it by `tau^(1-r)`. Minimizing
    `tau^(1-r)E_1+(1-tau)^(1-r)E_2` gives
    `(E_1^(1/r)+E_2^(1/r))^r`.

18. **`W_p` normalization.** The `p`-homogeneous action minimizes to `W_p^p`; the squared tangent
    action `(int|v|^p d alpha)^(2/p)` minimizes to `W_p^2` after constant-speed
    reparametrization. The `p=1` Beckmann endpoint is also correct.

19. **Concave-mobility interior convexity.** The perspective
    `P(s,m)=sL(m/s)` is convex and nonincreasing in `s` for convex `L` with `L(0)=0`; composition
    with concave `theta(a)` gives the claimed interior convexity. The chapter's two concrete
    mobilities are continuous and compatible with the intended boundary rule.

20. **Spectral static/dynamic equality.** From an endpoint coupling, conditional Jensen gives
    `C_t preceq M_pi`. From a dynamic curve, superposition and pathwise matrix Jensen give
    `M_pi preceq int C_t dt`. Loewner monotonicity and convexity of `gamma` give the two stated
    inequalities with no missing coefficient.

21. **Kernelized separation and particles.** Once measurability is added, bounded evaluation
    gives the test-function estimate proving separation. For continuous strictly positive
    definite `k` and pairwise-distinct particle paths, the Gram matrix is continuously and
    uniformly positive definite on `[0,1]`; the minimum-norm interpolant has square-integrable
    RKHS norm.

22. **Nonlocal factors and sign.** With flux density
    `nu=v theta(rho(x),rho(y))J`, Erbar's `1/2` action becomes
    `(1/2)int v^2 theta dJ`, and the weak equation has the chapter's plus sign. Time reversal uses
    `v_tilde=-v_{1-t}`. Kernel multiplication by `c` divides squared action by `c` and distance by
    `sqrt(c)`.

23. **Small-jump coefficient.** Isotropy gives covariance
    `epsilon^2 M_2 I/d`; acceleration by `2d/(epsilon^2 M_2)` gives `2I`, the normalization that
    cancels the pair factor `1/2` and yields the standard local action.

24. **Anisotropic formal tensor.** Accelerated covariance `2A` yields local velocity
    `u=A grad psi` and action `int rho u^T A^{-1}u`. The affine-kernel reduction in Q1 verifies
    this rigorously for linear images of the isotropic theorem.

25. **Finite Markov normalization.** For the uniform complete-neighbor chain,
    `J_ij=1/(n(n-1))` and homogeneity of the logarithmic mean converts relative densities to the
    factors used in the examples. The potential is defined only modulo constants, but both the
    action and `L_a psi` are gauge invariant, so no quotient defect affects the distance.

26. **Two-state formula.** For `n=2`, the constraint gives
    `dot r=-theta(r,1-r)(psi_1-psi_2)` and the action is
    `dot r^2/theta(r,1-r)`, exactly the displayed line element.

27. **Three-state flux minimizer.** With
    `Theta_ij=(1/2)theta(a_i,a_j)`, solving the single-cycle quadratic minimization gives the
    chapter's denominator and all three flux formulas. N3 concerns only endpoint wording.

28. **Full-TV factor.** For the `0/1` ground metric,
    `W_2^2=1-sum_i min(a_i,b_i)=(1/2)||a-b||_TV` under the book's full variation norm. The current
    authoritative LaTeX is correct.

29. **WFR action and cone scaling.** The balance equation sign, source density `r=ag`, and
    perspective are consistent. The cone line element
    `4kappa^2 dot r^2+r^2|dot x|^2` equals
    `a(|dot x|^2+kappa^2g^2)`. Pure reaction gives
    `WFR_kappa(a delta_x,b delta_x)=2kappa|sqrt(a)-sqrt(b)|`. The angle cutoff and
    `kappa=1/2` base normalization agree with the earlier cone definition.

30. **WFR theorem status.** Static/dynamic equality for all finite nonnegative measures is true;
    O7 is a proof-citation defect, not a counterexample or coefficient error.

31. **Unbalanced figure qualification.** The chapter explicitly says that its KL-relaxed
    barycenters are a qualitative surrogate and not exact WFR geodesics. This caveat is correct.

32. **MFG convexity and PDE signs.** The momentum perspective and `C_G` are algebraically convex
    whenever `G` is convex. With multiplier `-u`, stationarity gives
    `m=-rho grad u`,
    `-partial_t u+(1/2)|grad u|^2=G'(rho)`, and
    `partial_t rho-div(rho grad u)=0`.

33. **MFG terminal condition.** Probability-preserving endpoint variations determine
    `u_1-Psi` up to a constant. The HJB system is invariant under adding a constant to `u`, so one
    can and normally does choose `u_1=Psi`. The proposition says there exists such a value
    function; the first-pass terminal-gauge finding was therefore removed.

34. **Density-cap geodesic statement.** On `R^d` or a convex domain, a spatially constant upper
    density bound is preserved by quadratic displacement interpolation. The chapter correctly
    says this fact does not model a nonconvex bottleneck.

35. **Internal references.** The authoritative build has no unresolved reference or citation
    warning. No explicit Chapter 14 label is duplicated. Four labels that look absent in a raw
    search are generated by `eqllead` and are present in `OT4ML.aux`:
    `eq-nonlocal-wasserstein-distance`, `eq-wfr-velocity-action`,
    `eq-wfr-momentum-perspective`, and `eq-variational-mfg-continuity`.

## Recommended repair order

1. Replace the continuum nonlocal density-only definition by the relaxed measure--flux action,
   then state the small-jump theorem under the exact mobility/kernel alternatives (M1-M2).
2. Choose a rigorous MFG domain and data regime, make the functional proper/closed, and write the
   two-room experiment as a bounded no-flux problem (M3-M4, O1).
3. Correct the fixed-reference state space, close the mobility perspective on its density domain,
   and repair the non-spectral `tr(GM)` example (O2, O6, O8).
4. Add the Polish/measurable path-space and RKHS hypotheses and qualify zero-noise convergence
   and Brownian endpoint domination (O3-O5, N2).
5. Replace the WFR proof shortcut with the exact dynamic-plan theorem citation and parameter
   conversion (O7, N4).
6. Resolve the remaining local wording/boundary issues (N1, N3, N6, N7), and decide whether the
   anisotropic sentence will be restricted, labeled formal, or supported by a broader theorem
   (Q1).
7. Synchronize arXiv and MyST only after the authoritative LaTeX corrections are complete (N5).

## Final audit summary

The second pass confirms that Chapter 14's central coefficients and most proofs are correct. It
removes one false positive, downgrades two previously overstated Major findings, confirms four
Major defects after exact primary-theorem comparison, and adds four missed issues. The remaining
anisotropic claim is rigorous for affine images of admissible radial kernels and formally correct
at the covariance level, but is not verified here for arbitrary anisotropic profiles.

Report path:
`/Users/gpeyre/Dropbox/github/ot4ml/audit-chap14.md`

Final finding count: **0 Critical, 4 Major, 8 Moderate, 7 Minor (19 total)**, plus **1 unranked
literature-dependent uncertainty**.
