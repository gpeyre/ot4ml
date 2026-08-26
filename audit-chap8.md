# Second-Round Mathematical Audit of Chapter 8: Entropic Regularization: Sinkhorn Algorithm

## Audit identity and scope

- **Audited source:** `/Users/gpeyre/Dropbox/github/ot4ml/OT4ML/sections/sinkhorn.tex`
- **Audit date:** 2026-08-25
- **Source state:** current on-disk file, not Git `HEAD`
- **Protected source baseline:** 2,610 physical lines; 155,652 bytes; SHA-256 `eccafc8beb29d9f68ba7425670fe69e1bc8a22bc7679c684ad238f905547054d`
- **First-report baseline:** 1,300 physical lines; 88,817 bytes; SHA-256 `675bc48ed3483a30946927622ba916c15102487eaf523e83e8507e6b6035c6de`
- **Write scope:** only `/Users/gpeyre/Dropbox/github/ot4ml/audit-chap8.md`
- **Second-pass method:** all 2,610 source lines, 45 theorem-style environments, 22 proofs, 175 top-level displays, 3 algorithms, 16 figures, 61 included assets, 15 generator notebooks, 120 labels, 153 cross-reference occurrences, 31 citation commands, and 34 distinct citation keys were reconciled again. Every prior `CH8-001` through `CH8-014` was re-derived rather than presumed correct. Imported definitions and primary sources were rechecked, retained notebook evidence was retested, and additional deterministic calculations were run in memory without changing generators or assets.

This is a standalone adversarial refinement of the first report. A final finding is retained only when the second pass establishes a reproducible mathematical, algorithmic, numerical, citation, or material expository defect. Optional improvements and research directions are separated from findings.

## Executive summary

The second pass materially changes the first assessment. The final ledger contains **10 findings: 0 Critical, 0 Major, 4 Moderate, and 6 Minor**. Four former findings are removed as false positives, one former Moderate finding is narrowed to a Minor algorithm-contract omission, and the figure-provenance finding is narrowed after independent residual checks. No new independent root cause survived the complete resweep.

| Severity | Count | Final IDs |
|---|---:|---|
| Critical | 0 | None |
| Major | 0 | None |
| Moderate | 4 | CH8-001 through CH8-004 |
| Minor | 6 | CH8-005 through CH8-010 |

All ten findings in this table were resolved in the correction pass of
2026-08-26. The original findings are retained below as a historical audit
trail; their source line numbers refer to the read-only baseline recorded
above, not to the corrected file.

## Correction pass - 2026-08-26

The correction pass changed `OT4ML/sections/sinkhorn.tex`, added one primary
source to `OT4ML/all.bib`, repaired the two affected numerical notebooks and
their figure assets, and re-executed every Chapter 8 figure notebook from a
fresh kernel. No commit or push was made.

| Finding | Status | Implemented correction |
|---|---|---|
| `CH8-001` | Resolved | Added the global cap `f+g-c <= epsilon phi'_infinity` to the general phi-regularized dual. The primal--dual statement now uses the full Lebesgue decomposition of the optimizer: it gives the subgradient law for the absolutely continuous density and locates singular mass on the recession contact set. The generalized soft transforms are constrained by the same cap; the derivative-equals-one characterization is restricted to interior minimizers, and the boundary deficit/singular branch is stated explicitly whenever the left derivative exists. The text now cites Terjek--Gonzalez-Sanchez (2022). |
| `CH8-002` | Resolved | Replaced the slowly converged Burg panel by a certified computation: 15,000 vectorized exact dual block cycles are followed by a positive matrix-balancing correction, and the notebook retains assertions on feasibility and the primal--dual gap. The displayed plan has row and column errors at most `4.08e-14` and primal--dual gap `1.88e-4`; the caption reports these values. |
| `CH8-003` | Resolved | Added uniqueness of the normalized Kantorovich pair for convergence of the full potential family. The theorem now states the Nutz--Wiesel conclusion in `L^1(alpha) x L^1(beta)`, then proves uniform convergence of continuous soft- and hard-`c`-transform representatives on the compact supports using their common modulus of continuity and the definition of support. Spatial order-epsilon Laplace corrections remain outside the theorem as a formal refinement requiring stronger non-degeneracy and boundary hypotheses. |
| `CH8-004` | Resolved | Replaced the insufficient lower-semicontinuous-superlinear hypothesis by the concrete sufficient condition that `f` is finite, continuous, and superlinear. The proof now explains why continuity identifies the pointwise and essential suprema and why lower semicontinuity alone can miss a null-set downward spike. |
| `CH8-005` | Resolved | Added proper lower-semicontinuous convex penalties, finite entries of `C`, and strict feasibility to the generalized-scaling contract. The proof establishes existence and uniqueness of each KL-proximal minimizer and strict positivity by the dominating `t log t` variation at a zero coordinate; the algorithm input refers explicitly to these hypotheses. Every displayed quotient is therefore defined. |
| `CH8-006` | Resolved | Disclosed that the four panels are finite-step Adam endpoints for the raw/debiased objective plus `0.006 int |x|^2 d alpha_n`, rather than certified minimizers of the unconfined objectives. The notebook now retains objective decrease, terminal RMS first-variation norms, Sinkhorn marginal residuals, and clipping counts. All four objectives decrease, all clipping counts are zero, and the retained marginal residuals are below `5.7e-16`. |
| `CH8-007` | Resolved | Added the exact tilted-reference identity, including its additive constant, and stated that the optimizer is the generalized-KL projection of the generally unnormalized reference `(a tensor b) exp(-C/epsilon)` onto the transport polytope. The paragraph points directly to Chapter 9 for cyclic projections and their Pythagorean identities. |
| `CH8-008` | Resolved | Declared a separated locally convex dual pair `(E,E*)`, admissible potential spaces, the continuous marginalization map, and the functional conjugate pairing. The dual theorem now requires `delta Phi(xi) in E*` and exact Fenchel--Rockafellar duality in that dual pair; a feasible point in `ri(dom Phi)` is given as a concrete finite-dimensional sufficient condition. The associated block transforms use the same typed spaces. |
| `CH8-009` | Resolved | Defined `v_epsilon=1/q_epsilon` only on `{q_epsilon>0}`, stated that the scaling identity holds `alpha tensor beta_epsilon`-almost everywhere, and allowed an arbitrary finite value on the complementary null set. |
| `CH8-010` | Resolved | Re-executed all 15 Chapter 8 generator notebooks top-to-bottom from fresh kernels. Every saved code-cell sequence is now exactly `1,2,...`, and no notebook retains an error output. The two repaired notebooks additionally retain the new feasibility, dual-gap, objective, gradient, residual, and clipping assertions. |

The full post-correction validation record appears after the original audit.

## Correction review iteration - 2026-08-26

A second correction review re-derived the ten findings against the amended
chapter and the cited primary sources. All ten remain resolved, and no new
mathematical defect was found. This iteration did, however, strengthen several
repairs rather than merely confirming them:

- For `CH8-003`, the small-temperature result now cleanly separates the
  `L^1(\alpha) \times L^1(\beta)` compactness theorem of Nutz--Wiesel from the
  stronger uniform conclusion available here. The text chooses continuous
  soft- and hard-`c`-transform representatives and proves uniform convergence
  on the two compact supports from their common modulus of continuity and the
  fact that every relative neighborhood of a support point has positive
  marginal mass. Thus the strengthened conclusion no longer rests on an
  overstatement of the citation.
- For `CH8-005`, the marginal-dependent scaling proposition now assumes proper
  lower-semicontinuous convex penalties, proves existence and uniqueness of
  both KL-proximal minimizers, and proves their strict positivity by a
  `t\log t` boundary variation. The displayed divisions are consequently
  justified inside the proposition, not only by an implicit algorithmic
  convention.
- For `CH8-008`, the Bregman theorem no longer invokes an ambiguous
  infinite-dimensional algebraic-core condition. It assumes exact
  Fenchel--Rockafellar duality in the stated separated locally convex dual pair
  and gives the feasible-relative-interior criterion only as the concrete
  finite-dimensional sufficient condition. The analogous
  `\varphi`-regularized theorem now records a precise primary-source setting in
  which exact duality holds.
- For `CH8-009`, the closed Gibbs representative is assigned an arbitrary
  *finite* value only on its null complement. For `CH8-001`, the boundary
  derivative condition is now explicitly conditional on existence of the left
  derivative. The tilted Gibbs formulation is also described accurately as a
  generalized-KL projection because its reference need not be normalized.
- For `CH8-006`, terminal first variations in the debiasing notebook are now
  recomputed with 600 Sinkhorn iterations, independently of the cheaper inner
  solves used along the optimization path. A fresh execution retained no error
  output and the sequential counts `1,2,...,7`. The four objective decreases,
  first-variation values, and sub-`5.7e-16` marginal residual certificates were
  unchanged. The Burg panel's positive balancing and primal--dual certificate
  were independently rechecked and retained: attempting to replace this
  certificate by a poorly conditioned direct solve would have weakened the
  numerical evidence.

The source statements, proofs, and adjacent formulas were rendered after these
changes and inspected at the affected pages. The final build and reproducibility
checks are included in the validation record below.

## Original second-pass audit (historical)

The remainder of this report records the findings at the audited baseline, before
the correction pass above. Numerical defects and source locations described in
this historical part no longer characterize the corrected manuscript.

The central KL chapter remains mathematically strong. Its entropy and generalized-KL constants, reference shifts, primal uniqueness and limits, matrix scalings, discrete and continuous dual signs, soft transforms, Brownian conversion, heat/Hopf--Cole factors, Sinkhorn-divergence cancellation, positivity theorem, and finite-dimensional holomorphic implicit-function argument all re-derive correctly under the stated assumptions.

The most important correction to the first report concerns generalized Burg regularization. The abstract transform in `eq-phi-soft-c-transform` is a constrained extended-valued `argmin` and is valid. The one-point/unit-ball example does **not** invalidate that transform or the abstract alternating algorithm. It invalidates only the subsequent derivative-equals-one characterization and the claim that a Burg update always normalizes an absolutely continuous conditional density. A separate translation-invariant torus example establishes that balanced Burg-regularized OT can genuinely have singular optimal mass. Because this affects a specialized generalization rather than the central KL theory, final CH8-001 is Moderate, not Major.

The two material numerical issues are now cleanly separated. The retained Burg comparison has source-marginal error `6.21e-02` and is not a fixed-marginal coupling (CH8-002, Moderate). The debiasing notebook's internal Sinkhorn solves are accurate to about `10^-6` or better, and its box clipping is inactive in an exact replay; its remaining defect is the undisclosed quadratic confinement and uncertified finite-step optimization named too strongly as an optimized objective (CH8-006, Minor).

## Second-pass disposition of prior findings

| Prior ID | Prior severity | Final disposition | Reason and final ID |
|---|---|---|---|
| CH8-001 | Major | **Narrowed; downgraded** | The abstract generalized transform and alternating `argmin` remain valid. Only the finite-recession cap, boundary derivative characterization, and singular conditional law are incomplete. Final **CH8-001, Moderate**. |
| CH8-002 | Moderate | **Retained** | The saved Burg plan still has row residual `6.21e-02`; longer replay decreases the residual, confirming nonconvergence rather than a wrong discrete root law. Final **CH8-002, Moderate**. |
| CH8-003 | Moderate | **Retained and sharpened** | The value and scalar-potential expansions are correct, but the potential limit omits uniqueness and overstates what Nutz--Wiesel proves. Final **CH8-003, Moderate**. |
| CH8-004 | Moderate | **Retained and strengthened** | A positive-finite-integral downward-spike counterexample shows that lsc superlinearity converges to an essential, not pointwise, supremum. Final **CH8-004, Moderate**. |
| CH8-005 | Moderate | **Narrowed; downgraded** | The preceding qualification forces positive KL-prox outputs, so the former counterexample does not refute the proposition. The standalone pseudocode omits those prerequisites and fails outside them. Final **CH8-005, Minor**. |
| CH8-006 | Moderate | **Removed** | If `H=SW` contains quadrature weights, `H^T=WS` is the Euclidean transpose required to scale that matrix; the diagonal weights are absorbable in a scaling. The weighted function-space adjoint is different, but the text does not assert that convention. Clarification is optional, not a defect. |
| CH8-007 | Moderate | **Retained; downgraded** | Replay certifies the inner Sinkhorn residuals and shows clipping never activates. The undisclosed confinement and nonstationary finite-step endpoints remain a caption/provenance issue. Final **CH8-006, Minor**. |
| CH8-008 | Minor | **Retained; renumbered** | The synopsis and section lead promise a KL projection reformulation that Chapter 8 never displays. Final **CH8-007, Minor**. |
| CH8-009 | Minor | **Removed** | `Barrier` is used informally for infinite boundary slope, and lines 134-147 explicitly distinguish entropy from a self-concordant value barrier. No mathematical statement depends on the shorthand. |
| CH8-010 | Minor | **Removed** | The high-temperature inference is justified by finite-dimensional compactness, the KL continuity already used at line 586, and definiteness. Pinsker would be a quantitative improvement, not a missing theorem. |
| CH8-011 | Minor | **Retained; renumbered** | The function-space Bregman dual still evaluates a conjugate outside its declared continuous dual space and gives no adequate exact-duality qualification. Final **CH8-008, Minor**. |
| CH8-012 | Minor | **Retained; renumbered** | `1/q_epsilon` still needs an almost-everywhere/support convention when the Gibbs kernel may vanish. Final **CH8-009, Minor**. |
| CH8-013 | Minor | **Retained and narrowed; renumbered** | Null execution counts do not show wrong figures, but 13 of 15 saved notebooks are not clean top-to-bottom provenance records. Final **CH8-010, Minor**. |
| CH8-014 | Minor | **Removed** | The Sobolev sentence immediately follows the Euclidean example and is acceptable shorthand in context; compact support supplies the needed moment condition. Exact order/quotient details are optional exposition. |

## Findings

### CH8-001 - Moderate - Finite-recession Burg updates need an explicit cap and boundary/singular branch

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Category:** mathematical domain defect; algorithm characterization defect; missing primary citation.

**Current locations and environments:**

- Lines 1848-1861, Definition `def-phi-regularized-ot` and `eq-phi-regularized-ot`.
- Lines 1863-1926, Proposition `prop-phi-regularized-ot-dual` and proof, especially `eq-phi-regularized-ot-dual`.
- Lines 1932-1940, Burg density specialization.
- Lines 2119-2143, `eq-phi-soft-c-transform` and the scalar derivative characterization.
- Imported `OT4ML/sections/dual-norms.tex:371-396`, Definition `def_entropy` and Definition `def_divergence`.
- Imported `OT4ML/sections/dual-norms.tex:641-677`, Proposition `prop-phi-div-dual` and `eq-legendre`.

**Precise claim.** Lines 2138-2143 say that differentiability of `phi*` characterizes each scalar block minimizer by

\[
\int (\phi^*)'\!\left(\frac{u+g-c}{\epsilon}\right)d\beta=1,
\]

and conclude that Burg remains a monotone scalar solve normalizing one conditional density.

**Conventions and terminology.** For Burg entropy

\[
\phi(r)=r-\log r-1,\qquad r>0,
\]

one has

\[
L:=\phi'_\infty=1,\qquad
\phi^*(s)=-\log(1-s)\ (s<1),\qquad
(\phi^*)'(s)=\frac1{1-s}.
\]

The chapter's term `reverse-KL` is correct for probability measures. If
`alpha=r beta+alpha^perp`, then

\[
D_\phi(\alpha\mid\beta)
=\int(r-\log r-1)d\beta+\alpha^\perp(X)
=-\int\log r\,d\beta
=KL(\beta\mid\alpha),
\]

with finiteness exactly when `beta << alpha`. This terminology is not a defect.

**Dual cap and product-null sets.** The imported measure conjugate is finite only when

\[
f(x)+g(y)-c(x,y)\leq \epsilon L
\quad\text{on }X\times Y.
\]

The printed dual omits this cap. When the spaces have first been restricted to `supp(alpha)` and `supp(beta)` and the potentials and cost are continuous, the extended-valued integral detects every strict violation because every neighborhood has positive product measure. Thus the omission does not by itself change the dual value in that full-support setting. It is nevertheless a real effective-domain omission in the proposition and its proof, especially on ambient spaces larger than the marginal supports. Equality at the cap on an `alpha otimes beta`-null contact set is allowed and is precisely where singular optimal mass may live. For Burg, `phi*(1)=+infinity`, but an infinite point value on a product-null set does not change the integral.

**Smallest block-update counterexample.** Let `X` be one point, let `Y` be the unit ball in `R^3`, let `beta` be normalized Lebesgue measure, take `epsilon=1`, `g=0`, and

\[
c(y)=M\lVert y\rVert^2,\qquad M>3.
\]

The first scalar block objective in `eq-phi-soft-c-transform` is the extended-valued convex function

\[
J(u)=\int_Y-\log(1-u+M\lVert y\rVert^2)d\beta(y)-u,
\qquad u\leq1.
\]

For `u<1`,

\[
J'(u)=\int_Y\frac{d\beta(y)}{1-u+M\lVert y\rVert^2}-1.
\]

At the boundary, radial integration gives

\[
\lim_{u\uparrow1}\int_Y\frac{d\beta(y)}{1-u+M\lVert y\rVert^2}
=3\int_0^1\frac{r^2}{Mr^2}dr
=\frac3M<1.
\]

Hence `J` decreases up to its boundary minimizer `u=1`; no derivative-equals-one root exists. The absolutely continuous conditional density has mass `3/M`, and the missing mass `1-3/M` is a singular atom at `y=0`, where the cap is active.

This example does **not** invalidate `eq-phi-soft-c-transform`: the displayed `argmin` correctly returns `u=1`. It also is not a balanced singular optimizer, because the second marginal is not fixed during a single row block. It invalidates only the claimed derivative characterization, the unconditional monotone-root implementation, and the statement that the absolutely continuous density is normalized after every Burg block.

**Balanced singular optimizer.** A genuine balanced example is obtained on the flat three-torus. Let `mu` be Haar probability, set `alpha=beta=mu`, `c(x,y)=M d_T(x,y)^2`, and choose `M` so large that

\[
q:=\frac{\epsilon}{M}\int_{\mathbb T^3}d_T(0,z)^{-2}d\mu(z)<1.
\]

The integral is finite in dimension three. Define

\[
r(x,y)=\frac{\epsilon}{M d_T(x,y)^2}\quad(x\ne y),
\qquad
\pi=r\,\mu\otimes\mu+(1-q)(\operatorname{Id},\operatorname{Id})_\#\mu.
\]

Translation invariance gives both absolutely continuous marginals `q mu`; the diagonal term supplies the missing `(1-q)mu`. With constant potentials satisfying `f+g=epsilon`,

\[
\frac{f+g-c}{\epsilon}=1-\frac{M d_T(x,y)^2}{\epsilon}=\phi'(r)
\]

away from the diagonal, while equality with the recession cap holds on the diagonal. Fenchel equality for the absolutely continuous part and the recession equality for the singular part certify optimality. Thus singular balanced Burg optima are not merely hypothetical.

The primary source [Terjek and Gonzalez-Sanchez, *Optimal transport with f-divergence regularization and generalized Sinkhorn algorithm*](https://proceedings.mlr.press/v151/terjek22a/terjek22a.pdf) writes the cap explicitly, separates absolutely continuous and singular optimal parts, and treats boundary-collapse transforms for non-superlinear generators. It is not cited in the chapter.

**Minimal repair.** Add the cap `f+g-c <= epsilon phi'_infty`, or explicitly restrict all spaces to full marginal supports and explain why the extended integral enforces strict violations. State the derivative equation only for an interior block minimizer. At a boundary minimizer, define the absolutely continuous mass by the left derivative and place the deficit on the recession contact set. Restrict root-based pseudocode to an interior/good-triple hypothesis, while retaining the abstract constrained `argmin`. Add the primary citation and assumptions for dual attainment and alternating convergence.

**Downstream impact.** KL and finite discrete quadratic formulas are unaffected. Finite discrete Burg blocks with positive atom weights have interior roots; CH8-002 is therefore a convergence failure, not this boundary phenomenon. The continuous Burg density-normalization interpretation and any root-only implementation are incomplete.

### CH8-002 - Moderate - The retained Burg panel is not a fixed-marginal coupling

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Category:** numerical defect; figure/caption defect.

**Current locations and environments:**

- Lines 2210-2227, Figure `fig:sinkhorn-entropic-versus-quadratic-regularization`.
- `notebooks-figures/sinkhorn-entropic-versus-quadratic-regularization.ipynb:239-241`, retained diagnostics.
- The same notebook at physical JSON lines 290-375, scalar solver, 520-cycle call, and export path.
- Included asset `OT4ML/figures/sinkhorn-entropic-versus-quadratic-regularization/burg-plan.pdf`.

**Precise claim.** The caption presents the side curves as fixed marginals and the middle matrix as the Burg-regularized coupling for them.

**Retained counterevidence.** The notebook records

```text
kl        row error 1.12e-16  col error 2.54e-16  support 0.39
burg      row error 6.21e-02  col error 2.31e-08  support 0.71
quadratic row error 2.14e-13  col error 1.79e-13  support 0.28
```

These are `L1` marginal residuals. A source residual `0.0621` is not plotting error; the saved matrix is outside the transport polytope. The generator always exports after 520 Burg cycles and has no residual stop or assertion.

**Second-pass diagnosis.** Every finite-grid Burg scalar root exists because each target/source atom has positive mass and the Burg density diverges as a cell cap is approached. A read-only deterministic replay gives row residual `0.06212545` after 520 cycles and `0.02005401` after 1,040 cycles, while column residuals remain near `10^-8`. The residual decreases, so the code is slowly converging rather than implementing the wrong finite-dimensional transform. This finding is independent of CH8-001.

**Minimal repair.** Iterate until both marginal residuals satisfy a documented tolerance, retain the achieved residuals, and assert them before export. Use a better-conditioned/stabilized Burg block solver if necessary. If convergence cannot be certified, label the panel as a nonconverged iterate rather than a coupling with the fixed side marginals.

**Downstream impact.** The middle panel cannot support equal-marginal comparisons of concentration, tails, or support. The Burg conjugate and finite-grid density law remain algebraically correct.

### CH8-003 - Moderate - The small-temperature potential theorem omits uniqueness and overstates the cited topology

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Category:** mathematical hypothesis defect; proof gap; citation overreach.

**Current locations and environments:**

- Lines 936-971, Proposition `prop-small-epsilon-expansion`, especially lines 960-970.
- Lines 973-1008, proof, especially line 1007.
- Citation key `NutzWiesel2022EntropicPotentials`.

**Precise claim.** Under smooth positive endpoint densities and a smooth nondegenerate quadratic transport diffeomorphism, the chapter chooses normalized Kantorovich potentials `(f_0,g_0)` and states that the full entropic family converges locally uniformly to that pair. It then attributes spatial order-`epsilon` corrections to Laplace prefactors.

**Counterexample to identification of the limit.** Let `alpha=beta` be the equal mixture of two smooth compactly supported bump densities on disjoint congruent sets `A` and `B`, and let

\[
D=\operatorname{dist}(A,B)>0.
\]

For quadratic cost the identity is the smooth nondegenerate optimal map on the interiors. For every `t` with `|2t|<=D^2`, set on the disconnected supports

\[
f_t=t\ \text{on }A,\quad f_t=-t\ \text{on }B,
\qquad
g_t=-t\ \text{on }A,\quad g_t=t\ \text{on }B.
\]

Within each component, `f_t+g_t=0<=|x-y|^2`, with equality on the identity graph. Across components, `f_t+g_t` is `+/-2t`, bounded by the cross cost because `|2t|<=D^2`. The pair is dual optimal, and equal component masses give `int g_t d beta=0`. Thus there is a continuum of distinct gauge-normalized Kantorovich pairs satisfying the chapter's stated smooth-map conditions. One entropic family cannot converge to every arbitrarily selected pair.

**Primary-source comparison.** [Nutz and Wiesel, Theorem 1.1](https://arxiv.org/pdf/2104.11720) proves `L1(alpha) x L1(beta)` subsequential compactness and that cluster points are Kantorovich potentials. It gives full-sequence `L1` convergence when the normalized Kantorovich pair is unique. For uniformly continuous costs, the common modulus of continuity gives uniform-on-compact subsequential convergence by Arzela--Ascoli. Uniqueness is still needed to identify the whole sequence. The paper uses the symmetric gauge `int f d alpha=int g d beta`; this is equivalent to the chapter's gauge after an additive shift.

**What remains correct.** The Conforti--Tamanini value expansion and all converted constants are correct. At a balanced optimum the exponential penalty integrates to zero; hence, under `int g_epsilon d beta=0`,

\[
\int f_\epsilon d\alpha=\MK_{\lVert\cdot\rVert^2}^\epsilon(\alpha,\beta).
\]

The scalar first-potential formula is therefore correct. It does not identify the spatially varying potential. Nutz--Wiesel also does not prove the asserted order-`epsilon` spatial expansion; that requires a separate uniform Laplace analysis, unique nondegenerate contacts, and boundary control.

**Minimal repair.** Add uniqueness of the normalized Kantorovich pair, or concrete support/contact-graph hypotheses implying it. Attribute `L1` convergence to Nutz--Wiesel and derive the local-uniform upgrade from compact support and the shared modulus of continuity. Present the spatial correction as a formal Laplace statement unless a separate theorem supplies its hypotheses and remainder.

**Downstream impact.** The displayed value and scalar-potential asymptotics are valid. The selected limiting pair, full-sequence local-uniform claim, and unproved spatial correction are not valid under the printed assumptions.

### CH8-004 - Moderate - Lsc superlinearity is insufficient for the printed Laplace principle

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Category:** mathematical domain/hypothesis defect.

**Current locations and environments:**

- Lines 1726-1751, Proposition `prop-soft-legendre-convolution`, especially line 1750.
- Lines 1753-1771, proof, especially the final Laplace-principle sentence.

**Precise claim.** The proposition gives `proper, lower semicontinuous and superlinear` as a sufficient condition for `f^{*,epsilon}(p) -> f*(p)`.

**Positive-finite-integral counterexample.** In one dimension define

\[
f(0)=0,\qquad f(y)=1+y^2\quad(y\ne0).
\]

This function is proper, lower semicontinuous, and superlinear. For `p=0`, the hard conjugate is `f*(0)=0`. The point `y=0` is Lebesgue-null, so for every `epsilon>0`,

\[
\int_{\mathbb R}e^{-f(y)/\epsilon}dy
=e^{-1/\epsilon}\sqrt{\pi\epsilon},
\qquad
f^{*,\epsilon}(0)
=-1+\frac\epsilon2\log(\pi\epsilon)\longrightarrow-1.
\]

Thus the integral is positive and finite, but the soft transform converges to the essential supremum of `-f`, not its pointwise supremum.

If convexity was intended but omitted, `f=iota_{\{0\}}` is proper, lsc, convex, and superlinear in the extended-valued sense; its hard conjugate is zero while the Lebesgue integral vanishes and the soft logarithm is `-infinity`. Full-dimensional effective domain or another local-mass condition is still necessary.

**Derivation of the correct principle.** For `h_p(y)=<p,y>-f(y)`, a Lebesgue Laplace integral sees

\[
\operatorname*{ess\,sup}_{dy} h_p,
\]

not an isolated pointwise supremum. Superlinearity controls tails by making upper level sets bounded, but it neither guarantees `0<Z_epsilon<infinity` nor `sup h_p=ess sup h_p`.

**Minimal repair.** Require the integrals to be positive and finite and require pointwise and essential suprema to agree. Simple sufficient alternatives are: `f` finite, continuous, and superlinear; or `f` proper lsc convex, superlinear, with full-dimensional effective domain/nonempty interior. State explicitly that the limit is an essential supremum under weaker measurable hypotheses.

**Downstream impact.** Completing-the-square and Gaussian-convolution identities remain correct wherever the integrals are positive and finite. The convergence clause and its proof are false as printed.

### CH8-005 - Minor - The generalized pseudocode omits the positivity qualification needed by its divisions

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Category:** algorithm-contract defect.

**Current locations and environments:**

- Lines 1459-1500, Proposition `prop-marginal-dependent-dual-scaling`.
- Lines 1502-1527, its proof.
- Lines 1536-1568, Algorithm `alg-generalized-sinkhorn-marginal-penalties`.

**Precise claim.** The standalone algorithm accepts positive-reference data only implicitly and generic convex marginal penalties explicitly, then performs `u=r/z` and `v=s/w` without a support or positivity branch.

**Second-pass correction to the former finding.** The one-by-one choice `F=G=iota_{\{0\}}` does not satisfy the proposition's relative-interior qualification. More generally, if a positive vector lies in `ri(dom F)` and `z>0`, then the minimizer of

\[
F(r)+\epsilon KL(r\mid z)
\]

is strictly positive. If a minimizing coordinate were zero, moving a small distance toward that positive relative-interior point changes `F` by at most `O(t)` while the KL coordinate contributes `t log t+O(t)`, a strict decrease. Thus the proposition's exact block formulas are well-defined under its own hypothesis.

**Counterexample to the printed algorithm contract.** The algorithm input does not restate that hypothesis or require positivity-preserving proximal outputs. With `n=m=1`, `a=b=1`, `C=0`, and `F=G=iota_{\{0\}}`, its lines compute

\[
z=1,\quad r=0,\quad u=0,\quad w=0,\quad s=0,\quad v=0/0.
\]

The underlying generalized primal has the valid optimizer `P=0`; only the printed scaling representation is undefined.

**Minimal repair.** State that the algorithm runs under Proposition `prop-marginal-dependent-dual-scaling`, with finite cost, `K>0`, and positive KL-prox outputs. Alternatively add support reduction and explicit zero-denominator branches. A return status, residual, or dual gap would improve software robustness, but budget exhaustion and the existing heuristic stopping rules are not counted here as mathematical defects.

**Downstream impact.** Classical balanced Sinkhorn and common KL-unbalanced penalties are unaffected. The failure concerns convex penalties outside the omitted positivity/qualification contract, such as hard zero marginals.

### CH8-006 - Minor - The debiasing figure minimizes an undisclosed confined objective and lacks endpoint certificates

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Category:** numerical provenance defect; figure/caption overclaim.

**Current locations and environments:**

- Lines 2346-2366, Figure `fig:sinkhorn-divergence-debiasing` and its caption.
- `notebooks-figures/sinkhorn-divergence-debiasing.ipynb:451-489`, `adam_optimize`, confinement, clipping, and four calls.
- Retained morphology output in the same notebook at physical JSON lines 424-427.

**Precise claim.** The caption calls each blue cloud an optimized empirical measure for either `MK_c^epsilon` or the debiased Sinkhorn divergence.

**Actual computation.** Every Adam step adds

```text
grad += 0.012 * X
```

which, in the notebook's mass-normalized particle-velocity convention, adds the quadratic confinement

\[
0.006\int\lVert x\rVert^2d\alpha_n(x)
\]

to the named objective. The code also clips to a display box, but an exact deterministic replay recorded zero clipping activations in all four runs, so the second pass does not treat clipping as an actual objective modification.

The replay also separates inner OT feasibility from outer optimization. Cross/self Sinkhorn row residuals were at most `9.43e-7`/`4.16e-6` for the small-temperature runs and at machine precision for the large-temperature runs; column residuals were at machine precision. Thus fixed Sinkhorn iteration counts do not create a material feasibility defect here. At the final clouds, however, RMS particle gradients for the **unconfined** named objectives were approximately `5.37e-3`, `5.70e-3`, `4.66e-2`, and `5.63e-3` for raw-small, debiased-small, raw-large, and debiased-large. The confined gradients were much smaller in three panels (`2.96e-4`, `2.72e-5`, and `6.17e-5`) but remained `4.77e-2` for raw-large. The retained notebook reports only center, spread, and nearest-neighbor spacing, not objective values or stationarity.

**Why severity is Minor.** The qualitative collapse/debiasing mechanism agrees with the proved large-temperature limits, and the confinement is mild. The figure is illustrative, not quantitative. Nevertheless, `optimized for the named objective` is stronger than the actual finite-step, confined computation supports.

**Minimal repair.** Disclose the confinement and finite-step Adam nature in the caption, or remove the confinement and optimize the stated objectives. Retain final objective values and a gradient/KKT criterion. Since clipping was inactive, no clipping correction is needed for these particular outputs, though retaining an activation count would certify that fact.

**Downstream impact.** The large-temperature collapse example and Sinkhorn-divergence theory remain correct. The figure is qualitative evidence from a nearby confined optimization, not a certified minimizer comparison.

### CH8-007 - Minor - The promised KL projection reformulation is absent from Chapter 8

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Category:** material expository completeness defect.

**Current locations and environments:**

- Chapter synopsis, line 12.
- Projection language at lines 137, 287, 419, and 423.
- Section `Reformulation Using Relative Entropy`, lines 416-529.
- Delayed imported material in `OT4ML/sections/sinkhorn-advanced.tex:25-287`.

**Precise claim.** The synopsis says the chapter rewrites entropic OT as a relative-entropy projection, and the section lead says the KL formulation identifies Sinkhorn as a projection method. Chapter 8 defines KL and proves reference shifts but never displays the tilted reference, projection problem, affine marginal sets, or Pythagorean identity.

**Missing derivation.** With

\[
R^\epsilon_{ij}=a_i b_j e^{-C_{ij}/\epsilon},
\]

one has for every probability matrix `P`

\[
\langle C,P\rangle+\epsilon KL(P\mid a\otimes b)
=\epsilon KL(P\mid R^\epsilon)
+\epsilon\left(1-\sum_{ij}R^\epsilon_{ij}\right).
\]

Hence the optimizer is the KL projection of `R^epsilon` onto the transport polytope. Each half-step is a KL projection onto one affine marginal set, and the affine case has a Pythagorean equality. Positivity-constrained non-KL projections and Dykstra corrections require separate treatment. Chapter 9 contains this material, but Chapter 8 does not point to it when making the promise.

**Minimal repair.** Add the displayed identity and an immediate forward reference to Chapter 9, or weaken the synopsis and section lead to say only that KL normalizes the entropy formulation.

**Downstream impact.** No optimization formula is wrong. The stated conceptual bridge to Bregman projection geometry is missing at the point where readers are told it has been made.

### CH8-008 - Minor - The measure Bregman dual is not typed in a specified dual pair

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Category:** functional-analytic domain and qualification defect.

**Current locations and environments:**

- Lines 1952-1963, Definition `def-measure-bregman-divergence`.
- Lines 1981-2016, Proposition `prop-bregman-regularized-ot-dual`.
- Lines 2018-2055, proof.
- Lines 2145-2162, Bregman block transforms.

**Precise claim.** The proposition defines `Phi*` only for continuous test functions, then evaluates it at

\[
\delta\Phi(\xi)+\frac{f\oplus g-c}{\epsilon}
\]

without requiring `delta Phi(xi)` to be continuous or to belong to any declared dual space. It further says exact duality follows under `standard compactness and lower-semicontinuity hypotheses`, which do not alone provide a Fenchel--Rockafellar qualification or dual attainment.

**Explicit type counterexample.** Let `Z=[0,1]`, let `lambda` be Lebesgue measure, and define

\[
\Phi(\rho\lambda)=\frac12\int_0^1\rho^2d\lambda
\]

on `L2` densities. Choose a probability reference density `q` equal to `3/2` on `[0,1/2]` and `1/2` on `(1/2,1]`. In the natural `L2` dual pair, `delta Phi(q lambda)=q`, which has a jump and is not continuous. The Bregman divergence and its `L2` conjugate are perfectly well-defined, but the printed expression is outside the proposition's declared continuous test domain. Entropy generators with vanishing or merely measurable reference densities give even unbounded first variations.

**Minimal repair.** Specify the locally convex primal/dual pair, require `delta Phi(xi)` to lie in the dual function space, and state an actual continuity-point/interiority qualification for the marginal operator. Alternatively state a finite-dimensional theorem and label the measure expression formal until those assumptions are supplied. Apply the same typing and attainment conditions to the Bregman block `argmin`s.

**Downstream impact.** The finite-dimensional algebra, quadratic density law, and KL specialization are correct. The general measure proposition and its exact function-space alternating algorithm are underspecified.

### CH8-009 - Minor - The closed Gibbs scaling needs a support/a.e. convention when `q_epsilon` vanishes

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Category:** Radon--Nikodym notation/domain defect.

**Current location and environment:** lines 718-753, Proposition `prop-sinkhorn-gibbs-pushforward`, especially lines 741-752.

**Precise claim.** The proposition writes `v_epsilon=1/q_epsilon` and `k/(Z q)` pointwise on all of `Y`, although its assumptions do not require a strictly positive kernel or `q_epsilon>0` everywhere.

**Smallest counterexample.** Let `X` be one point, `Y={0,1}` with counting reference `beta_0`, and allow `c(x,1)=+infinity`, so `k(x,.)=(1,0)`. Then `Z=1`, `q=(1,0)`, and `beta_epsilon=delta_0`. The coupling construction is valid, but `1/q(1)` and `k(x,1)/(Zq(1))=0/0` are undefined. The Radon--Nikodym density is only an `alpha otimes beta_epsilon` equivalence class.

**Minimal repair.** Define `v=1/q` on `{q>0}` with an arbitrary value on its `beta_epsilon`-null complement, and mark the density/scaling identity `alpha otimes beta_epsilon`-almost everywhere. If finite real cost is intended, state it; then `k>0` and `q>0` on the relevant support.

**Downstream impact.** The Gibbs push-forward proof and Gaussian special case are correct. This is a null-set qualification for extended/infinite costs.

### CH8-010 - Minor - Thirteen retained figure notebooks are not clean top-to-bottom execution records

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Category:** reproducibility/provenance defect.

**Current locations:** the 16 figure environments and 15 generators in the complete figure register below.

**Precise issue.** Thirteen of the 15 saved chapter generators contain code cells with null execution counts while later cells retain outputs. Several later cells depend on definitions in those null-count cells, so the saved state is not a linear, independently checkable execution transcript. `sinkhorn-geodesics-in-heat.ipynb` and `sinkhorn-complex-epsilon-continuation.ipynb` are the two clean saved executions.

**What this does and does not establish.** All 61 included assets exist, no retained output has `output_type=error`, and targeted replays agree with retained numerical values. Null counts do not prove that any additional figure is wrong. The exact-field least-squares scaling in the heat generator is also not a defect: later homogeneous panelwise quantile normalization cancels it visually. A hash manifest would be useful but is an optional extension, not part of this finding.

**Minimal repair.** From fresh kernels, execute all 15 generators top to bottom without changing their mathematics, retain monotonically ordered execution counts and numerical assertions, and ensure export fails on violated residuals. A machine-readable notebook/asset hash manifest is recommended but not required to correct the saved transcripts.

**Downstream impact.** This is provenance debt, not evidence against the mathematical content of the other figures. The two concrete figure defects are independently recorded in CH8-002 and CH8-006.

## Validated-correct ledger

This ledger records claims that were re-derived and found correct, rather than merely not challenged. It also records the four first-pass concerns that were affirmatively rejected on re-audit. Qualifications refer to the final findings above.

### Discrete entropy, KL, and primal limits

- **Lines 38-56:** The convention
  \[
  H(P)=-\sum_{ij}P_{ij}\log P_{ij},\qquad 0\log0=0,
  \]
  and the objective \(\langle C,P\rangle-\epsilon H(P)\) have consistent signs.
- **Lines 79-92:** The transport polytope is compact. Strict convexity of \(r\mapsto r\log r\) on every nontrivial feasible segment gives uniqueness. After deleting zero-mass rows and columns, mixing a putative boundary minimizer with \(a\otimes b>0\) gives the standard \(t\log t\) directional improvement and proves strict positivity.
- **Lines 166-223:** The stationarity equation is
  \[
  C_{ij}+\epsilon(\log P_{ij}+1)-f_i-g_j=0.
  \]
  Thus \(P=\operatorname{diag}(u)K\operatorname{diag}(v)\), with \(K_{ij}=e^{-C_{ij}/\epsilon}\); the common \(e^{-1}\) factor is correctly absorbed into one scaling. The sole multiplicative gauge is correctly identified.
- **Lines 227-260:** For positive weights and finite costs, all denominators in classical Sinkhorn are positive. A row update enforces \(a\) and the following column update enforces \(b\). The displayed maximum marginal \(L^1\) residual is a genuine feasibility certificate. Returning after the stated finite budget without a success flag is a software-interface improvement, not an established mathematical defect.
- **Lines 357-410:** Dense work \(O(N_{\rm it}nm)\), separable Gaussian work \(O(dq^{d+1})\) for \(q^d\) grid points, and the separation between per-step and total interior-point complexity are correct. The \(\widetilde O(n^2/\delta^2)\) summary is consistent with the cited approximation literature at its stated level of suppressed logarithmic, cost-range, and dimension factors.
- **Lines 425-461:** Generalized discrete KL includes the \(-P+Q\) terms, is nonnegative, and is definite under the printed zero-entry conventions.
- **Lines 476-527:** On \(\operatorname{Couplings}(a,b)\),
  \[
  \operatorname{KL}(P\mid a\otimes b)=-H(P)+H(a)+H(b),
  \]
  and
  \[
  \operatorname{KL}(P\mid a\otimes b)
  =
  \operatorname{KL}(P\mid a'\otimes b')
  -\operatorname{KL}(a\mid a')
  -\operatorname{KL}(b\mid b')
  \]
  has the correct constants and signs.
- **Lines 557-602:** As \(\epsilon\downarrow0\), the finite-dimensional optimizer selects the unique maximum-entropy plan on the optimal face. As \(\epsilon\to\infty\), the KL bound tends to zero; compactness, continuity of this finite-dimensional KL, and definiteness identify the product coupling. Pinsker would quantify the last step but is not needed, so prior CH8-010 is removed.

### General measures and temperature limits

- **Lines 620-666:** The measure KL convention includes the singular recession term and reduces to ordinary relative entropy for probabilities. The product-reference change has the correct domination direction. Mutual information is exactly \(\operatorname{KL}(\pi\mid\alpha\otimes\beta)\).
- **Lines 674-714:** The two kernel operators have the correct source and target measures and are adjoint in the \(L^2(\alpha)\)-\(L^2(\beta)\) pairing. Since the reference already contains both marginals, the density is \(u(x)k(x,y)v(y)\) and each target marginal density is one. Compact supports and finite continuous cost make the kernel strictly positive and the displayed divisions well-defined.
- **Lines 718-790:** Subject to the null-set correction in CH8-009, the normalized Gibbs transition, push-forward marginal, KL projection proof, and Gaussian specialization are correct. In the Euclidean quadratic case, \(Z_\epsilon=(\pi\epsilon)^{d/2}\), the noise covariance is \(\epsilon I/2\), and the law is \((X,X+\sqrt{\epsilon/2}\,G)\).
- **Lines 804-844:** The explicit finite-entropy density assumption supplies the zero-temperature recovery sequence. Compactness and lower semicontinuity give the liminf and cluster-point claims; uniqueness gives convergence of the whole family. At high temperature, Pinsker correctly gives total-variation convergence.
- **Lines 850-930:** Conditional on the explicitly assumed \(1/\epsilon\) expansion, double centering gives
  \[
  c_0=c-c_X-c_Y+\bar c,\qquad q=-c_0.
  \]
  The value coefficients
  \[
  -\frac{1}{2\epsilon}\int c_0^2\,dr
  +\frac{1}{6\epsilon^2}\int c_0^3\,dr
  \]
  and the first potential coefficients \(-A/2\) and \((\sigma^2-B)/2\) are correct in the printed gauge.
- **Lines 934-1008:** The conversion from Brownian time \(T\) to the static convention \(\epsilon=2T\) is correct. In particular,
  \[
  -\frac{d\epsilon}{2}\log(\pi\epsilon),\qquad
  -\frac{\epsilon}{2}\{H(\alpha)+H(\beta)\},\qquad
  \frac{\epsilon^2}{16}I_{\rm geo}
  \]
  have the right signs and factors. At a balanced optimum, the exponential dual penalty integrates to zero, so the scalar formula for \(\int f_\epsilon\,d\alpha\) is also correctly derived. CH8-003 concerns only the subsequent convergence claim for the spatial potentials.

### Discrete and continuous duality

- **Lines 1024-1075:** The KL-normalized discrete dual has the correct \(+\epsilon\) constant and weights \(a_ib_j\). Its scalings satisfy
  \[
  u_i^{D}=a_i e^{f_i/\epsilon},\qquad v_j^{D}=b_j e^{g_j/\epsilon},
  \]
  which correctly distinguishes them from the earlier unweighted-kernel scalings.
- **Lines 1080-1152:** Exact block differentiation gives the weighted soft minimum with the printed sign. Restricting the minimum to positive-weight support and subtracting the maximum in log-sum-exp are correct. Every stabilized exponent is nonpositive, and the reconstructed plan uses the KL-normalized product reference.
- **Lines 1180-1249:** On compact marginal supports with finite continuous cost, the continuous dual, exponential density law, and strong-duality proof are correct. The product coupling is a strictly positive entropy-domain qualification point.
- **Lines 1255-1307:** Both continuous soft transforms use the correct integration measure and direction. Cost-modulus bounds, additive gauge normalization, Arzela-Ascoli, and strict convexity modulo constants prove attainment and uniqueness on the marginal supports.
- **Lines 1317-1367:** The soft transforms are exact alternate dual maximizers and exponentiate to the continuous scaling iteration. For \(c(x,y)=-\langle x,y\rangle\), the concavity/convex-shift statements have the correct signs. The chapter correctly warns that neural parameter optimization is nonconvex and that unrestricted ReLU approximation does not enforce input convexity.

### Marginal-dependent problems

- **Lines 1392-1455:** The generalized KL convention remains valid for variable total mass. With
  \[
  K_{ij}=a_i b_j e^{-C_{ij}/\epsilon},
  \]
  absorbing the cost changes the objective only by \(\epsilon\{\sum_{ij}a_ib_j-\sum_{ij}K_{ij}\}\), independent of \(P\).
- **Lines 1459-1527:** Under the proposition's Fenchel qualification and positive references, the dual signs and block formulas are correct:
  \[
  r=\operatorname{prox}^{\rm KL}_{F/\epsilon}(Kv),\quad u=r/(Kv),
  \]
  followed by the symmetric column update. The KL chain identity is correct. The second pass proves that the qualification forces positive prox outputs, so the former broad algorithm objection is narrowed to the standalone input contract in CH8-005.
- **Lines 1573-1594:** The hard-marginal, KL-relaxation, box, total-variation, and fixed-total-mass KL proximal formulas re-derive correctly on their stated domains.

### Heat kernels and Hopf-Cole

- **Lines 1613-1624:** For \(\partial_tu=\Delta u\),
  \[
  e^{-\|x-y\|^2/\epsilon}=(\pi\epsilon)^{d/2}h_{\epsilon/4}(x,y).
  \]
  Both the heat time and normalization are correct.
- **Lines 1625-1658:** With \(L=-\Delta_M\geq0\), the semigroup is \(e^{-(\epsilon/4)L}\) and
  \[
  e^{-(\epsilon/4)L}=\lim_{q\to\infty}(I+\epsilon L/(4q))^{-q}.
  \]
  The signs, sparse-solve interpretation, reuse of factorizations, and mesh-resolution warning are correct.
- **Second-pass rejection of prior CH8-006:** If a symmetric point kernel \(S\) is combined with quadrature \(W\), the mass-vector operator is \(H=SW\). Matrix scaling of \(\operatorname{diag}(u)H\operatorname{diag}(v)\) necessarily uses the ordinary transpose \(H^\top=WS\) for the column marginal. Its \(W\)-weighted function-space adjoint is \(W^{-1}H^\top W=H\). The source's transpose is therefore correct; a different density-vector convention would merely redistribute \(W\). Boundary conditions belong to the chosen discrete Laplacian, and the figure generator explicitly uses Neumann conditions.
- **Lines 1694-1721:** The hard transform sign and the Gaussian-convolution constant \(-(\epsilon d/2)\log(2\pi\epsilon)\) are correct.
- **Lines 1726-1770:** Completing the square and both soft-Legendre identities are correct whenever the integral is positive and finite. Only the claimed lsc-superlinear convergence criterion fails, as detailed in CH8-004.
- **Lines 1800-1810:** With \(u=e^{-\phi/\epsilon}\),
  \[
  \partial_s\phi+\tfrac12|\nabla\phi|^2=(\epsilon/2)\Delta\phi
  \]
  transforms to \(\partial_su=(\epsilon/2)\Delta u\); differentiating gives the displayed viscous Burgers equation. Signs and factors are correct.
- **Second-pass rejection of prior CH8-014:** The Sobolev sentence follows the Euclidean compact-support example. In that context the negative-order homogeneous Sobolev interpretation is standard shorthand and finite moments are automatic. Specifying the exact homogeneous quotient would be useful exposition, not a defect.

### General regularizers

- **Lines 1848-1928:** For superlinear \(\phi\), Fenchel conjugacy gives the displayed integral dual and absolutely continuous subgradient law. For finite recession slope, the same formulas require the cap and singular branch in CH8-001.
- **Lines 1928-1940:** The scalar conjugates/transfers are correct on their effective domains:
  \[
  \phi_{\rm KL}^*(s)=e^s-1,\quad
  (\phi_{\rm Burg}^*)'(s)=(1-s)^{-1}\ (s<1),\quad
  (\phi_{\rm quad}^*)'(s)=(1+s)_+.
  \]
  Calling the Burg generator reverse KL is correct for probability measures because \(D_\phi(\alpha\mid\beta)=\operatorname{KL}(\beta\mid\alpha)\), including the singular term.
- **Second-pass rejection of prior CH8-009:** Lines 134-147 explicitly distinguish entropic smoothing from a self-concordant value barrier and use barrier terminology only as informal geometric shorthand for infinite boundary slope. No theorem depends on that word choice.
- **Lines 1952-2057:** The finite-dimensional Bregman algebra and distinction between a functional dual-coordinate shift and a pointwise density-ratio law are correct. The general measure statement still needs the dual-pair repair in CH8-008.
- **Lines 2072-2104:** The two-valued density-ratio argument correctly shows that, up to a nonnegative factor and an affine generator term, KL is the only smooth divergence common to the Bregman and \(\phi\)-divergence families.
- **Lines 2175-2189:** Both quadratic density laws have the correct reference weights. The weighted threshold equation is continuous and piecewise affine and can be solved by sorting in \(O(m\log m)\). The resulting positive-part law can generate exact sparsity.

### Sinkhorn divergences

- **Lines 2308-2344:** Symmetry is explicitly required. The product-reference chain rule has the correct sign, and cross/self marginal corrections cancel exactly when the same references are used consistently.
- **Lines 2371-2386:** After an exact balanced block update, the reconstructed density has total mass one, so the integrated exponential penalty is zero. At optimum the entropic value is the sum of the two potential integrals.
- **Lines 2390-2430:** Under compactness, continuity, symmetry, and zero diagonal, the small-temperature self-costs vanish and
  \[
  S_\epsilon(\alpha,\beta)\longrightarrow
  -\frac12\iint c(x,y)\,d(\alpha-\beta)(x)d(\alpha-\beta)(y)
  \]
  at high temperature. The sign and self-cost subtraction are correct.
- **Lines 2447-2499:** Cauchy-Schwarz in the Gibbs-kernel RKHS gives nonnegativity under positive semidefiniteness; universality gives definiteness. Compactness and continuity then give equivalence with weak convergence. The text correctly notes that PSD without universality may leave a nontrivial null space.

### Complex temperature

- **Lines 2513-2528:** The chapter distinguishes algebraic complexification from positive-real convergence and makes no global convergence claim for complex Sinkhorn iteration.
- **Lines 2534-2566:** After deleting one redundant column equation and imposing a linear gauge, the holomorphic implicit-function theorem applies. The Jacobian-kernel identity
  \[
  \sum_{ij}P^0_{ij}|r_i+s_j|^2=0
  \]
  isolates exactly the additive gauge, which the extra equation removes.
- **Lines 2568-2575:** Nonzero local scalings admit local logarithm branches. The warnings about singularities, branch changes, and absence of global single-valued continuation are correct.
- **Lines 2593-2610:** The centered one-dimensional Gaussian cross-covariance
  \[
  k_\epsilon=\frac{\sqrt{\epsilon^2+16\sigma_\alpha^2\sigma_\beta^2}-\epsilon}{4}
  \]
  and branch points \(\epsilon=\pm4i\sigma_\alpha\sigma_\beta\) are correct. The square-root branch positive on the real axis is holomorphic on the right half-plane.

## Proof audit

The chapter contains 22 explicit proof environments. Each proof was re-derived line by line in the second pass.

| Lines | Result proved | Final audit outcome |
|---:|---|---|
| 85-92 | Existence, uniqueness, positivity of discrete entropic OT | Correct after the stated deletion of zero-mass rows and columns. |
| 177-199 | Discrete scaling form | Correct; the constant \(e^{-1}\) is harmlessly gauged away. |
| 453-461 | KL nonnegativity and definiteness | Correct, including zero-entry conventions. |
| 512-527 | Product-reference KL shift | Correct signs and constants. |
| 577-602 | Discrete temperature limits | Correct. Compactness plus KL continuity and definiteness justify the high-temperature conclusion; prior CH8-010 is removed. |
| 755-768 | Closed Gibbs coupling | Correct after the almost-everywhere convention in CH8-009. |
| 822-844 | Measure Gamma/large-temperature convergence | Correct under the explicit recovery-sequence density assumption. |
| 893-930 | Large-temperature expansion | Correct conditional expansion and coefficients. |
| 973-1008 | Small-temperature expansion | Value conversion and scalar potential integral are correct; the spatial-potential convergence clause has CH8-003. |
| 1049-1075 | Discrete entropic dual | Correct. |
| 1213-1249 | Continuous entropic dual | Correct under compactness and finite continuous cost. |
| 1290-1307 | Existence and uniqueness of continuous potentials | Correct on the marginal supports. |
| 1502-1527 | Marginal-penalty dual/scaling | Correct under its stated qualification; only the standalone algorithm omits that contract in CH8-005. |
| 1753-1771 | Soft-Legendre identities and limit | Identities correct; the Laplace-principle hypothesis is false by CH8-004. |
| 1897-1926 | \(\phi\)-regularized dual/density law | Correct for the superlinear/interior branch; finite-recession cap and singular branch are omitted by CH8-001. |
| 2018-2055 | Bregman-regularized dual | Finite-dimensional algebra correct; the measure-space dual pair and qualification are underspecified by CH8-008. |
| 2087-2104 | KL-only overlap theorem | Correct. |
| 2253-2282 | Large-temperature entropic bias | Correct uniform bounded-oscillation expansion. |
| 2378-2386 | Dual cost at optimum | Correct. |
| 2401-2430 | Sinkhorn-divergence asymptotics | Correct under the stated compactness, continuity, symmetry, and diagonal assumptions. |
| 2458-2499 | Sinkhorn-divergence positivity/definiteness | Correct under the separately stated PSD and universality hypotheses. |
| 2545-2566 | Local holomorphic continuation | Correct finite-dimensional, gauge-fixed IFT proof. |

No circular proof dependency, hidden sign reversal, or invalid central KL duality argument was found. The surviving proof-level issues are one false sufficient hypothesis (CH8-004), one overstrong imported convergence clause (CH8-003), and two incomplete functional domains (CH8-001 and CH8-008).

## Hypothesis and domain audit

| Topic/location | Minimum condition used | Final status |
|---|---|---|
| Discrete primal, lines 79-92 | Probability histograms, finite cost, positive reduced supports | Correctly stated or explicitly reduced. |
| Classical scaling, lines 166-260 | Positive reduced weights and \(K_{ij}>0\) | Correct. Infinite costs would require support feasibility, but the algorithm inputs a finite cost matrix. |
| Product-reference shifts, lines 499-527 | Positive comparison references, or finite marginal KL with support domination | Correct. |
| Continuous primal/dual, lines 633-714 and 1180-1307 | Compact marginal supports and finite continuous cost for attained continuous potentials | Correct where used. |
| Closed Gibbs form, lines 718-753 | \(0<Z_\epsilon<\infty\), finite objective, and \(q_\epsilon>0\) only on its support | Last support/a.e. convention missing: CH8-009. |
| Measure Gamma limit, lines 804-844 | Finite-entropy couplings dense with simultaneous cost convergence | Explicitly assumed. |
| Large-temperature series, lines 850-930 | A third-order \(L^\infty\) branch expansion in \(1/\epsilon\) | Explicitly assumed; existence is not claimed. |
| Small-temperature value, lines 936-1008 | Euclidean quadratic setting, compact bounded densities, finite geodesic Fisher information | Sufficient for the cited value expansion. |
| Small-temperature potentials, lines 960 and 1007 | Uniqueness of normalized hard potentials for full-family convergence; equicontinuity for uniform-on-compact upgrade | Missing: CH8-003. |
| Marginal penalties, lines 1459-1568 | Fenchel qualification, positive kernel, positive KL-prox outputs for quotient updates | Proposition sufficient; algorithm input incomplete: CH8-005. |
| Heat operator, lines 1625-1658 | A specified heat semigroup and a consistent mass/quadrature matrix convention | Source convention is internally correct; prior CH8-006 removed. |
| Soft Legendre, line 1750 | Positive finite integral and equality of pointwise and essential suprema, for example finite continuous superlinear \(f\) | Printed lsc-superlinear condition is insufficient: CH8-004. |
| General \(\phi\) dual, lines 1863-1926 | Fenchel qualification; cap \(f\oplus g-c\leq\epsilon\phi'_\infty\); singular KKT law when \(\phi'_\infty<\infty\) | Finite-recession branch incomplete: CH8-001. |
| Measure Bregman dual, lines 1981-2055 | Declared locally convex dual pair, \(\delta\Phi(\xi)\) in the dual space, and an exact-duality qualification | Underspecified: CH8-008. |
| Sinkhorn divergence, lines 2308-2499 | Common state space and symmetric cost; PSD Gibbs kernel for nonnegativity; universal kernel for definiteness | Correctly separated. |
| Complex continuation, lines 2534-2566 | Finite positive matrix at a nonzero real base temperature and a fixed gauge | Correctly stated; conclusion explicitly local. |

## Notation, sign, and constant audit

| Item | Re-derived value | Final status |
|---|---|---|
| Discrete entropy sign | \(\langle C,P\rangle+\epsilon\sum P_{ij}\log P_{ij}\) | Correct. |
| Generalized KL | \(\sum(P\log(P/Q)-P+Q)\) plus recession mass in measure form | Correct. |
| Product-reference entropy shift | Adds \(\epsilon\{H(a)+H(b)\}\) to the unnormalized entropic value | Correct. |
| Tilted projection reference | \(R^\epsilon_{ij}=a_ib_j e^{-C_{ij}/\epsilon}\) | Algebra correct but not displayed: CH8-007. |
| Unweighted versus KL-normalized scalings | \(u^D=a\,e^{f/\epsilon}\), \(v^D=b\,e^{g/\epsilon}\) | Correctly distinguished. |
| Continuous dual constant | \(-\epsilon\int(e^{(f+g-c)/\epsilon}-1)\,d\alpha d\beta\) | Correct. |
| Soft transform sign | \(-\epsilon\log\int e^{(g-c)/\epsilon}\,d\beta\) | Correct. |
| Large-temperature centered interaction | \(c_0=c-c_X-c_Y+\bar c\) | Correct. |
| Large-temperature value coefficients | \(-\int c_0^2/(2\epsilon)+\int c_0^3/(6\epsilon^2)\) | Correct conditionally. |
| Brownian/static conversion | \(\epsilon=2T\) | Correct. |
| Small-temperature Gaussian term | \(-(d\epsilon/2)\log(\pi\epsilon)\) | Correct. |
| Heat time and blur covariance | \(t=\epsilon/4\), covariance \(\epsilon I/2\) | Correct. |
| Heat reverse multiplication | Ordinary transpose of the mass-vector matrix; weighted adjoint is self-adjoint | Correct; prior CH8-006 removed. |
| Hopf-Cole viscosity | \(\nu=\epsilon/2\) | Correct. |
| Burg recession slope/domain | \(\phi'_\infty=1\), \(\phi^*(s)=-\log(1-s)\) for \(s<1\) | Scalar formula correct; cap/boundary branch missing: CH8-001. |
| Quadratic \(\phi\) transfer | \((1+s)_+\) | Correct. |
| Quadratic Bregman transfer | \((a_ib_j+(f_i+g_j-C_{ij})/\epsilon)_+\) | Correct. |
| Sinkhorn high-temperature sign | \(-\frac12\iint c\,d(\alpha-\beta)^{\otimes2}\) | Correct. |
| Complex Gaussian branch points | \(\pm4i\sigma_\alpha\sigma_\beta\) | Correct. |
| Entropy/barrier terminology | Explicitly qualified informal comparison | No mathematical defect; prior CH8-009 removed. |
| Euclidean Sobolev shorthand | Negative-order homogeneous norm in the immediately preceding compact-support setting | Acceptable contextual shorthand; prior CH8-014 removed. |

No factor-of-two, dual-sign, reference-measure constant, heat-time, Brownian-time, Hopf-Cole, or Gaussian-branch error survived the second pass.

## Algorithm audit

| Algorithm/update | Initialization and domain | Exact block invariant | Printed stopping rule | Final audit |
|---|---|---|---|---|
| <code>alg:sinkhorn-scaling</code>, lines 238-260 | \(v^{(0)}=\mathbf1\); positive weights, finite \(C\) | Row block fixes \(a\); following column block fixes \(b\) | Maximum two-marginal \(L^1\) residual | Correct mathematical algorithm. The returned residual itself reveals budget exhaustion; a status flag is optional robustness. |
| <code>alg:log-domain-sinkhorn</code>, lines 1116-1152 | \(g^{(0)}=0\); same positive finite domain | Each soft block is an exact dual maximizer; one marginal is exact after its block | Same marginal residual | Stabilization, signs, reference weights, and reconstruction are correct. |
| Continuous iteration, lines 702-714 | \(v^{(0)}=1\); compact supports, finite continuous cost | Alternately fixes marginal density one | None, since this is a mathematical iteration rather than executable pseudocode | Correct. |
| <code>alg-generalized-sinkhorn-marginal-penalties</code>, lines 1536-1568 | \(u=v=\mathbf1\); input does not repeat proposition qualification | Each positive KL-prox block is exact dual ascent | Absolute scaling change | Quotients can be undefined outside the omitted positivity contract: CH8-005. Replacing the heuristic by a gap is optional once the domain is fixed. |
| General \(\phi\) blocks, lines 2119-2143 | No explicit initialization | The extended-valued argmin is the exact block maximizer | None | Abstract argmin correct. Derivative-equals-one/root description fails at finite-recession boundary: CH8-001. |
| General Bregman blocks, lines 2145-2173 | No explicit initialization or dual-space assumptions | Exact block minimization if the typed problem attains | None | Formal principle correct; exact function-space claim needs CH8-008 hypotheses. |

### Indexing and gauges

- Equation <code>eq-sinkhorn</code> uses full-cycle indexing: \(u^{(\ell+1)}\) is followed by \(v^{(\ell+1)}\).
- Figure <code>fig:sinkhorn-linear-rate-epsilon</code> plots half-step residuals and says so in its caption. Reusing \(\ell\) for the plotted half-step is a notation refinement, not a defect.
- Multiplicative primal gauges and additive dual gauges are consistent across the unweighted, KL-normalized, continuous, and complex formulations.
- The generalized scaling-change stop is not gauge invariant in the balanced specialization, but it is only a heuristic iterate-change test and is not presented as a primal/dual accuracy theorem. This remains an optional improvement, not an additional finding.

## Figure and numerical provenance audit

All **61 of 61** <code>includegraphics</code> targets exist. The chapter has 16 figure environments generated by 15 notebooks; the Hopf-Cole notebook supplies two figures. No retained notebook output has <code>output_type=error</code>. In the table, “executed” means a non-null saved execution count.

| Figure/source lines | Label | Generator | Assets | Saved code execution | Second-pass audit |
|---|---|---|---:|---:|---|
| 61-77 | <code>fig:sinkhorn-plan-epsilon</code> | <code>sinkhorn-plan-epsilon.ipynb</code> | 4 | 3/6 | Export code contains a marginal-residual assertion; panels are consistent. Saved history is not a clean run: CH8-010. |
| 110-132 | <code>fig:sinkhorn-entropy-lp-geometry</code> | <code>sinkhorn-entropy-lp-geometry.ipynb</code> | 8 | 5/6 | Interior minimizers and paths are consistent. Coding the strict-domain slack objective as infinite on the boundary does not misstate the separate entropy curve or its panels. Prior CH8-009 removed; saved history still has CH8-010. |
| 264-285 | <code>fig:sinkhorn-marginal-errors</code> | <code>sinkhorn-marginal-errors.ipynb</code> | 5 | 3/6 | Alternating exact-marginal mechanism matches caption; provenance CH8-010 only. |
| 290-308 | <code>fig:sinkhorn-continuous-marginal-scaling</code> | <code>sinkhorn-continuous-marginal-scaling.ipynb</code> | 4 | 3/6 | Uniform-grid dense discretization matches caption; provenance CH8-010 only. |
| 316-332 | <code>fig:sinkhorn-coupling-iterations</code> | <code>sinkhorn-coupling-iterations.ipynb</code> | 4 | 3/6 | Common normalization and fixed marginals are consistent; provenance CH8-010 only. |
| 337-355 | <code>fig:sinkhorn-potentials-iterations</code> | <code>sinkhorn-potentials-iterations.ipynb</code> | 4 | 4/6 | Gauge-normalized log-scalings match caption; provenance CH8-010 only. |
| 369-383 | <code>fig:sinkhorn-linear-rate-epsilon</code> | <code>sinkhorn-linear-rate-epsilon.ipynb</code> | 2 | 3/7 | Half-step residual is correctly described; only notation and saved-history refinements remain. |
| 535-552 | <code>fig:sinkhorn-dual-potentials-epsilon</code> | <code>sinkhorn-dual-potentials-epsilon.ipynb</code> | 3 | 4/6 | KL-normalized scaling convention matches <code>eq-entropy-pd</code>; provenance CH8-010 only. |
| 1156-1173 | <code>fig:sinkhorn-soft-c-transform-epsilon</code> | <code>sinkhorn-soft-c-transform-epsilon.ipynb</code> | 4 | 4/5 | Soft-min signs and zero-temperature envelope match caption; provenance CH8-010 only. |
| 1669-1686 | <code>fig:sinkhorn-geodesics-in-heat</code> | <code>sinkhorn-geodesics-in-heat.ipynb</code> | 4 | 6/6 | Clean saved execution. Neumann boundaries are explicit. Least-squares calibration of the exact field is canceled by homogeneous panelwise normalization and creates no visible or mathematical mismatch. |
| 1787-1798 | <code>fig:sinkhorn-soft-biconjugates</code> | <code>sinkhorn-hopf-cole-transform.ipynb</code> | 2 | 4/9 shared | Grid truncation and finite-temperature approximation are qualitatively faithful; shared notebook provenance has CH8-010. |
| 1816-1831 | <code>fig:sinkhorn-hopf-cole-transform</code> | <code>sinkhorn-hopf-cole-transform.ipynb</code> | 3 | 4/9 shared | Periodic Fourier boundaries and a tiny mean correction are visible in code; neither changes the qualitative PDE claim. Shared notebook provenance has CH8-010. |
| 2193-2208 | <code>fig:sinkhorn-phi-soft-c-transforms</code> | <code>sinkhorn-phi-soft-c-transforms.ipynb</code> | 3 | 5/6 | Retained convexity residuals are \(-1.828\cdot10^{-6}\), \(-2.128\cdot10^{-9}\), and \(5.697\cdot10^{-11}\); finite-grid transforms are consistent. CH8-001 concerns the general continuous boundary case, not these finite transforms. |
| 2212-2227 | <code>fig:sinkhorn-entropic-versus-quadratic-regularization</code> | <code>sinkhorn-entropic-versus-quadratic-regularization.ipynb</code> | 3 | 5/6 | KL and quadratic panels are feasible. Retained Burg row residual is \(6.21\cdot10^{-2}\): CH8-002. |
| 2348-2366 | <code>fig:sinkhorn-divergence-debiasing</code> | <code>sinkhorn-divergence-debiasing.ipynb</code> | 4 | 6/7 | Inner coupling residuals are small, but the optimizer adds undisclosed confinement and retains no stationarity certificate: CH8-006. |
| 2577-2591 | <code>fig:sinkhorn-complex-epsilon-continuation</code> | <code>sinkhorn-complex-epsilon-continuation.ipynb</code> | 4 of 9 generated | 6/6 | Clean saved execution. Retained maximum marginal/gauge residual is \(9.96\cdot10^{-14}\), with at most four Newton steps; the caption's \(10^{-11}\) claim is certified. |

### Targeted numerical retests

- **Burg plan:** retained residuals are row \(6.21\cdot10^{-2}\), column \(2.31\cdot10^{-8}\), versus near-machine precision for KL and quadratic. A read-only replay gave row residual \(6.21254516\cdot10^{-2}\) after 520 cycles and \(2.00540058\cdot10^{-2}\) after 1,040 cycles. This confirms slow convergence and an uncertified retained panel, not a wrong finite-dimensional Burg root.
- **Debiasing:** a deterministic in-memory replay found zero clipping activations. Maximum inner row residuals were \(9.43\cdot10^{-7}\) for cross terms and \(4.16\cdot10^{-6}\) for self terms in the small-temperature cases, and machine precision in the large-temperature cases. Final unconfined RMS particle gradients were approximately \(5.37\cdot10^{-3}\), \(5.70\cdot10^{-3}\), \(4.66\cdot10^{-2}\), and \(5.63\cdot10^{-3}\); confined gradients were \(2.96\cdot10^{-4}\), \(2.72\cdot10^{-5}\), \(4.77\cdot10^{-2}\), and \(6.17\cdot10^{-5}\).
- **Complex continuation:** retained residuals and Newton counts directly certify the caption.
- No generator, output cell, asset, or source file was changed during these retests.

### Retained notebook summary

| Generator | Bytes | Cells | Code | Executed | Outputs | Errors |
|---|---:|---:|---:|---:|---:|---:|
| <code>sinkhorn-plan-epsilon.ipynb</code> | 93,961 | 10 | 6 | 3 | 1 | 0 |
| <code>sinkhorn-entropy-lp-geometry.ipynb</code> | 121,095 | 11 | 6 | 5 | 2 | 0 |
| <code>sinkhorn-marginal-errors.ipynb</code> | 74,906 | 10 | 6 | 3 | 1 | 0 |
| <code>sinkhorn-continuous-marginal-scaling.ipynb</code> | 44,020 | 10 | 6 | 3 | 1 | 0 |
| <code>sinkhorn-coupling-iterations.ipynb</code> | 38,710 | 10 | 6 | 3 | 1 | 0 |
| <code>sinkhorn-potentials-iterations.ipynb</code> | 65,424 | 11 | 6 | 4 | 1 | 0 |
| <code>sinkhorn-linear-rate-epsilon.ipynb</code> | 62,217 | 12 | 7 | 3 | 5 | 0 |
| <code>sinkhorn-dual-potentials-epsilon.ipynb</code> | 73,638 | 11 | 6 | 4 | 1 | 0 |
| <code>sinkhorn-soft-c-transform-epsilon.ipynb</code> | 125,458 | 9 | 5 | 4 | 9 | 0 |
| <code>sinkhorn-geodesics-in-heat.ipynb</code> | 625,723 | 10 | 6 | 6 | 1 | 0 |
| <code>sinkhorn-hopf-cole-transform.ipynb</code> | 391,808 | 15 | 9 | 4 | 16 | 0 |
| <code>sinkhorn-phi-soft-c-transforms.ipynb</code> | 150,640 | 11 | 6 | 5 | 3 | 0 |
| <code>sinkhorn-entropic-versus-quadratic-regularization.ipynb</code> | 60,951 | 11 | 6 | 5 | 2 | 0 |
| <code>sinkhorn-divergence-debiasing.ipynb</code> | 68,412 | 13 | 7 | 6 | 2 | 0 |
| <code>sinkhorn-complex-epsilon-continuation.ipynb</code> | 78,951 | 10 | 6 | 6 | 3 | 0 |

Thirteen generators have at least one null execution count before later retained outputs. Only <code>sinkhorn-geodesics-in-heat.ipynb</code> and <code>sinkhorn-complex-epsilon-continuation.ipynb</code> are clean saved top-to-bottom executions.

## Citation and reference audit

### Bibliographic reconciliation

- The chapter contains 31 citation commands, 49 key occurrences, and 34 distinct keys.
- Every cited key exists in <code>OT4ML/all.bib</code>. The entry <code>varadhan-1967</code> uses the valid syntax <code>@article {varadhan-1967</code>, which simplistic key scanners can miss.
- A full build of the current on-disk book produced a 480-page PDF with no undefined references or citations and no Chapter 8 compilation error.
- Two substantive citation issues survive. The Nutz-Wiesel result is invoked without its uniqueness hypothesis in CH8-003. The finite-recession \(\phi\) discussion omits a directly relevant source that explicitly treats caps, boundary transforms, and singular parts in CH8-001.
- No citation defect was established for the complexity summary, Conforti-Tamanini constants, Sinkhorn-divergence theorem, heat-kernel factor, or local complex theorem.

### Primary-source checks

| Chapter claim | Primary source checked | Second-pass conclusion |
|---|---|---|
| Matrix scaling history | Sinkhorn (1964), Sinkhorn-Knopp (1967), Sinkhorn (1967), as entered in <code>all.bib</code> | Historical attribution consistent. |
| Modern entropic OT formulation | Cuturi, “Sinkhorn Distances” (NeurIPS 2013) | Scaling interpretation and attribution consistent. |
| Approximation complexity | [Altschuler-Weed-Rigollet](https://proceedings.neurips.cc/paper/2017/file/491442df5f88c6aa018e86dac21d3606-Paper.pdf); [Dvurechensky-Gasnikov-Kroshnin](https://proceedings.mlr.press/v80/dvurechensky18a.html) | The chapter's \(1/\delta^2\) summary is acceptable because it suppresses logarithmic and cost-range factors and cites both generations of bounds. |
| Continuous Gamma convergence | Leonard (2012); Carlier et al. (2017), entries in <code>all.bib</code> | Qualitative weak convergence and recovery-sequence discussion consistent with the printed explicit density assumption. |
| Second-order small-noise value | [Conforti-Tamanini](https://arxiv.org/pdf/1912.10555) | After \(\epsilon=2T\), all displayed constants and signs are correct. |
| Entropic-potential convergence | [Nutz-Wiesel](https://arxiv.org/pdf/2104.11720) | \(L^1\) subsequential compactness is general; full normalized convergence needs uniqueness. Uniform-on-compact convergence requires additional regularity. CH8-003. |
| Finite-recession \(f\)-regularized OT | [Terjek-Gonzalez-Sanchez](https://proceedings.mlr.press/v151/terjek22a/terjek22a.pdf) | The source explicitly carries the recession cap and singular contribution and treats non-superlinear transforms. It supports CH8-001 and is absent from the chapter bibliography/citations. |
| Sinkhorn-divergence positivity | [Feydy et al.](https://proceedings.mlr.press/v89/feydy19a/feydy19a.pdf) | Compactness, symmetry, positive universal Gibbs kernel, nonnegativity, definiteness, and weak-convergence claims match. |
| Analytic temperature dependence | [Carlier-Pegon-Tamanini](https://arxiv.org/pdf/2206.03347) | Theorem 2.1 and its proof give positive-axis analyticity of normalized solutions/cost; Remark 2.2 gives local complex extension. The chapter's finite-dimensional theorem is independently proved and correct. |
| Varadhan/heat limit | Varadhan (1967), plus the cited Solomon and Crane computational papers | The \(-4t\log h_t\to d_M^2\) factor yields the chapter's \(-\epsilon\log h_{\epsilon/4}\) limit. No factor error. |

### Complete citation-key register

<code>2015-solomon-siggraph</code> (lines 1648, 1658); <code>2016-chizat-sinkhorn</code> (1387); <code>2017-carlier-SIMA</code> (802, 1241, 2404); <code>CarlierPegonTamanini2023EntropicRates</code> (2532); <code>ChizatRoussillonLegerVialardPeyre2020Sinkhorn</code> (934); <code>ConfortiTamanini2021EntropicDerivative</code> (934, 982); <code>Crane2013</code> (1648); <code>CuturiSinkhorn</code> (12, 160); <code>FelzenszwalbHuttenlocher2012DistanceTransforms</code> (1778); <code>Galichon-Entropic</code> (220); <code>Lucet2010ComputationalConvexAnalysis</code> (1778); <code>NutzWiesel2022EntropicPotentials</code> (960); <code>ReviewSinkhorn</code> (220); <code>Sinkhorn64</code> (12, 160); <code>Sinkhorn67</code> (12, 160); <code>SinkhornKnopp67</code> (12, 160); <code>Villani09</code> (1698); <code>altschuler2017near</code> (357, 359); <code>amos2017input</code> (1367); <code>blondel2018smooth</code> (2175, 2189); <code>cohen2017matrix</code> (220); <code>evans2010pde</code> (1698); <code>feydy2018interpolating</code> (2237, 2302, 2498); <code>hanin2019universal</code> (1367); <code>knight2008sinkhorn</code> (357); <code>kruithof</code> (220); <code>leonard2012schrodinger</code> (802, 1241, 2404); <code>makkuva2020optimal</code> (1367); <code>nemirovski1999complexity</code> (217); <code>nesterov1994interior</code> (137); <code>peyre2019computational</code> (12); <code>pmlr-v80-dvurechensky18a</code> (357, 359); <code>varadhan-1967</code> (1648); <code>yule1912methods</code> (220).

## Prioritized repair checklist

| Priority | Finding | Severity | Minimal concrete repair |
|---:|---|---|---|
| 1 | CH8-001 | Moderate | Add the finite-recession dual cap, boundary KKT/singular law, and a source such as Terjek-Gonzalez-Sanchez; qualify the derivative/root algorithm as interior-only. |
| 2 | CH8-002 | Moderate | Iterate the Burg panel to a stated marginal tolerance and retain an assertion, or remove/label the unconverged panel. |
| 3 | CH8-003 | Moderate | Add uniqueness of normalized hard potentials for full convergence; distinguish \(L^1\) convergence from the regularity-dependent uniform upgrade. |
| 4 | CH8-004 | Moderate | Replace lsc superlinearity by a positive-finite Laplace-integral hypothesis ensuring pointwise supremum equals essential supremum. |
| 5 | CH8-005 | Minor | Tie the pseudocode input explicitly to Proposition <code>prop-marginal-dependent-dual-scaling</code>, or add zero-output/support branches. |
| 6 | CH8-006 | Minor | Disclose the quadratic confinement and finite-step Adam optimization, and retain objective/gradient certificates. |
| 7 | CH8-007 | Minor | Display the tilted-reference KL projection identity and point immediately to Chapter 9 for alternating projections and Pythagorean identities. |
| 8 | CH8-008 | Minor | State the measure/dual function spaces, require \(\delta\Phi(\xi)\) in the dual, and give an actual Fenchel qualification. |
| 9 | CH8-009 | Minor | Define \(1/q_\epsilon\) on \(\{q_\epsilon>0\}\) and state density/scaling identities almost everywhere. |
| 10 | CH8-010 | Minor | Re-execute all generators from fresh kernels with ordered counts and retained numerical assertions. |

The first four repairs correct mathematical statements or outputs. Repairs 5-10 clarify contracts, domains, exposition, or reproducibility. No repair is classified Critical or Major.

## Research questions

These are optional extensions, not defects.

### RQ8-001 - Boundary generalized Sinkhorn rates

Can one state a concise convergence theorem for alternating finite-recession \(\phi\) transforms when the dual cap is attained and singular conditional mass appears? The result should distinguish convergence of the absolutely continuous density from weak convergence of the singular part.

### RQ8-002 - Intrinsic hypotheses for the large-temperature series

The large-\(\epsilon\) expansion is correctly conditional on an \(L^\infty\) analytic branch. What minimal operator conditions on a bounded measurable cost guarantee that branch and a controlled remainder beyond finite matrices and compact continuous kernels?

### RQ8-003 - Joint mesh/temperature limits for heat Sinkhorn

For nonuniform finite elements, what sharp relation among mesh size, heat time, resolvent depth, and scaling tolerance guarantees convergence to geodesic-cost entropic OT before \(\epsilon\downarrow0\)?

### RQ8-004 - Certified neural dual error

Can stochastic ICNN dual optimization have a computable certificate separating network approximation, Monte Carlo integration, optimization, and entropic-regularization errors?

### RQ8-005 - Global complex singularity geometry

For \(K(\epsilon)=e^{-C/\epsilon}\), characterize the discriminant where the gauge-fixed scaling Jacobian is singular. How do branch points and monodromy depend on support geometry, and when does the positive-axis branch extend to a simply connected sector larger than \(\operatorname{Re}\epsilon>0\)?


## Complete mechanical reconciliation

### Physical-line coverage

Every physical line belongs to exactly one contiguous range below. Independently, lexical classification gives 268 blank lines, 32 comment-only lines, and 2,310 nonblank noncomment lines; these sum to 2,610.

| Lines | Content |
|---:|---|
| 1-24 | Root directive, chapter declaration, label, synopsis, indexes |
| 25-32 | Discrete-measures section lead |
| 33-95 | Entropy penalty, first definition/proposition/figure/proof |
| 96-152 | Smoothing, LP geometry, barrier comparison |
| 153-415 | Sinkhorn derivation, algorithms, convergence figures, complexity |
| 416-421 | Relative-entropy section lead |
| 422-475 | Discrete relative entropy and definiteness |
| 476-606 | KL normalization, reference shift, dual-potential figure, finite limits |
| 607-611 | General-formulation section lead |
| 612-648 | Measure KL and continuous entropic OT |
| 649-668 | Mutual information interpretation |
| 669-799 | Continuous scaling, closed Gibbs coupling, Gaussian example |
| 800-845 | Measure `epsilon` convergence |
| 846-931 | Large-temperature expansion |
| 932-1012 | Small-temperature expansion and conversion proof |
| 1013-1018 | Dual section lead |
| 1019-1076 | Discrete dual |
| 1077-1174 | Discrete soft transforms and log-domain algorithm |
| 1175-1316 | Continuous dual, soft transforms, attainment, uniqueness |
| 1317-1355 | Continuous dual Sinkhorn iteration |
| 1356-1381 | Neural dual solvers and Gaussian remark |
| 1382-1600 | Marginal-dependent/unbalanced problems and generalized algorithm |
| 1601-1608 | Heat/Hopf--Cole section lead |
| 1609-1688 | Geodesics in heat and numerical implementation |
| 1689-1834 | Soft Hopf--Lax, soft Legendre, Hopf--Cole/Burgers |
| 1835-1843 | Other-regularizers section lead |
| 1844-1941 | `phi`-divergence regularization |
| 1942-2113 | Measure Bregman regularization and KL overlap |
| 2114-2231 | Generalized transforms, quadratic/Burg/KL figures |
| 2232-2238 | Sinkhorn-divergence section lead |
| 2239-2298 | Entropic bias and collapse example |
| 2299-2506 | Sinkhorn divergence, invariance, asymptotics, positivity |
| 2507-2516 | Complex-temperature section lead |
| 2517-2523 | Complex measure fixed point |
| 2524-2610 | Discrete holomorphic theorem, figure, Gaussian example |

### Environment balance

Every `begin` has a matching `end`. Counts are:

| Environment | Count | Environment | Count |
|---|---:|---|---:|
| `defn` | 13 | `prop` | 20 |
| `thm` | 1 | `lem` | 1 |
| `example` | 2 | `rem` | 8 |
| `proof` | 22 | `figure` | 16 |
| `alg` | 2 | `algH` | 1 |
| `algblock` | 5 | `equation` | 13 |
| `align` | 1 | `align*` | 2 |
| `aligned` | 5 | `array` | 1 |
| `cases` | 1 | `pmatrix` | 1 |
| `tabular` | 16 | `itemize` | 1 |

There are 45 theorem-style substantive environments (13 definitions, 20 propositions, 1 theorem, 1 lemma, 2 examples, 8 remarks), 22 proofs, 3 algorithms, and 16 figures. Figures are completely registered in the figure audit; proofs and algorithms are completely registered in their respective audits above.

### Theorem-style environment register

**Definitions (13):**

- Lines 38-46, `def-discrete-shannon-boltzmann-entropy`, Discrete Shannon--Boltzmann entropy.
- Lines 48-56, `def-discrete-entropic-ot`, Discrete entropic optimal transport.
- Lines 425-433, `def-discrete-relative-entropy`, Discrete relative entropy.
- Lines 620-630, `def-measure-relative-entropy`, Relative entropy of measures.
- Lines 633-641, `def-continuous-entropic-ot`, Continuous entropic optimal transport.
- Lines 653-660, `def-mutual-information`, Mutual information.
- Lines 1093-1107, `def-discrete-soft-c-transform`, Soft-min and discrete soft `c`-transform.
- Lines 1255-1275, `def-continuous-soft-c-transform`, Continuous soft `c`-transforms.
- Lines 1403-1429, `def-marginal-dependent-entropic-transport`, Marginal-dependent entropic transport.
- Lines 1851-1861, `def-phi-regularized-ot`, `phi`-regularized optimal transport.
- Lines 1952-1963, `def-measure-bregman-divergence`, Measure Bregman divergence.
- Lines 1971-1979, `def-bregman-regularized-ot`, Bregman-regularized optimal transport.
- Lines 2308-2315, `def-sinkhorn-divergence`, Sinkhorn divergence.

**Propositions (20):**

- Lines 79-83, `prop-entropic-unique`, existence and uniqueness.
- Lines 166-175, `prop-regularized-primal`, scaling form.
- Lines 449-452, `prop-kl-distance-like`, KL nonnegativity/definiteness.
- Lines 499-510, `prop-kl-shift`, reference shift.
- Lines 557-575, `prop-convergence-eps`, finite `epsilon` limits.
- Lines 718-753, `prop-sinkhorn-gibbs-pushforward`, closed Gibbs coupling.
- Lines 804-820, `prop-continuous-convergence-epsilon`, measure `epsilon` limits.
- Lines 850-891, `prop-large-epsilon-expansion`, large-temperature expansion.
- Lines 936-971, `prop-small-epsilon-expansion`, small-temperature expansion.
- Lines 1024-1047, unlabeled, dual of entropic OT; display label `eq-dual-formulation`.
- Lines 1180-1211, `prop-continuous-entropic-duality`, continuous duality.
- Lines 1280-1288, `prop-entropic-dual-potentials`, dual-potential existence/uniqueness.
- Lines 1459-1500, `prop-marginal-dependent-dual-scaling`, marginal-penalty dual/scaling.
- Lines 1726-1751, `prop-soft-legendre-convolution`, soft Legendre approximation.
- Lines 1863-1895, `prop-phi-regularized-ot-dual`, `phi` dual/density law.
- Lines 1981-2016, `prop-bregman-regularized-ot-dual`, Bregman dual/density law.
- Lines 2072-2085, `prop-kl-only-bregman-phi`, KL-only overlap.
- Lines 2249-2252, unlabeled, large-temperature entropic bias.
- Lines 2390-2400, `prop-sinkhorn-divergence-asymptotics`, divergence asymptotics.
- Lines 2447-2456, `prop-sinkhorn-positive`, positivity/definiteness.

**Theorem, lemma, examples, and remarks (12):**

- Lines 2534-2543, theorem `thm-carlier-complex-sinkhorn`, local holomorphic continuation.
- Lines 2371-2377, lemma with display label `eq-formula-cost-dual`, entropic dual cost.
- Lines 2286-2297, unlabeled example, large-temperature collapse.
- Lines 2593-2610, unlabeled example, centered one-dimensional Gaussians.
- Lines 134-147, `rem-entropy-versus-lp-barriers`.
- Lines 394-411, `rem-sinkhorn-separable-gaussian`.
- Lines 1309-1315, `rem-soft-transform-convexity`.
- Lines 1373-1378, `rem-sinkhorn-gaussian-marginals`.
- Lines 1773-1781, `rem-soft-legendre-fft`.
- Lines 2318-2344, `rem-sinkhorn-reference-invariance`.
- Lines 2432-2443, unlabeled remark, large-temperature Hilbertian limit.
- Lines 2570-2573, unlabeled remark, local not global complex scaling.

### Display register

There are **175 top-level display containers**: 93 bracket displays, 28 `eq` macros, 36 `eql` macros, 2 `eqllead` macros, 13 `equation` environments, and 3 `align`/`align*` environments. Nested `aligned`, `array`, `cases`, and `pmatrix` environments are counted separately in the environment balance.

- **Bracket displays (93), opening lines:** 42, 192, 398, 456, 656, 662, 722, 742, 759, 771, 777, 808, 815, 824, 831, 838, 853, 859, 863, 868, 876, 882, 886, 895, 899, 905, 916, 922, 940, 945, 951, 961, 975, 983, 992, 1000, 1098, 1215, 1221, 1231, 1244, 1284, 1296, 1362, 1431, 1448, 1475, 1504, 1519, 1576, 1584, 1615, 1626, 1640, 1644, 1651, 1695, 1711, 1755, 1764, 1802, 1807, 1889, 1900, 1912, 1920, 1932, 1973, 1985, 2021, 2031, 2047, 2062, 2076, 2080, 2089, 2095, 2139, 2186, 2257, 2266, 2274, 2289, 2320, 2329, 2421, 2450, 2493, 2538, 2549, 2556, 2597, 2603.
- **`eq` macros (28):** 183, 435, 439, 464, 471, 484, 503, 568, 594, 598, 695, 709, 1051, 1055, 1069, 1082, 1088, 1111, 1322, 1339, 1345, 2243, 2380, 2394, 2416, 2466, 2471, 2483.
- **`eql` macros (36):** 51, 170, 206, 212, 229, 429, 479, 561, 583, 624, 636, 674, 689, 703, 728, 736, 1027, 1042, 1102, 1183, 1190, 1205, 1331, 1619, 1630, 1852, 1868, 1881, 1995, 2011, 2120, 2146, 2165, 2176, 2311, 2374.
- **`eqllead` macros (2):** 571 and 1736.
- **`equation` environments (13):** 407, 1394, 1406, 1419, 1462, 1481, 1493, 1701, 1715, 1731, 1743, 1955, 2336.
- **`align`/`align*` environments (3):** 515, 1259, 2409.

All 93 bracket displays have matching closing delimiters. No malformed or unbalanced mathematical environment was found.

### Label register

There are **120 labels**, including the two labels generated by `eqllead`; no duplicate Chapter 8 label was found.

```text
10 sec-sinkhorn
28 sec-entropic-discrete
38 def-discrete-shannon-boltzmann-entropy
48 def-discrete-entropic-ot
51 eq-regularized-discr
76 fig:sinkhorn-plan-epsilon
79 prop-entropic-unique
131 fig:sinkhorn-entropy-lp-geometry
134 rem-entropy-versus-lp-barriers
166 prop-regularized-primal
170 eq-scaling-form
183 eq-sinkhorn-lagrangian
206 eq-dualsinkhorn-constraints
212 eq-dualsinkhorn-constraints2
229 eq-sinkhorn
238 alg:sinkhorn-scaling
284 fig:sinkhorn-marginal-errors
307 fig:sinkhorn-continuous-marginal-scaling
331 fig:sinkhorn-coupling-iterations
354 fig:sinkhorn-potentials-iterations
382 fig:sinkhorn-linear-rate-epsilon
394 rem-sinkhorn-separable-gaussian
407 eq-separable-gaussian-half-step
425 def-discrete-relative-entropy
429 eq-kl-defn
449 prop-kl-distance-like
479 eq-regularized-discr-rescaled
499 prop-kl-shift
551 fig:sinkhorn-dual-potentials-epsilon
557 prop-convergence-eps
561 eq-entropy-conv-1
571 eq-entropy-conv-2
583 eq-proof-gamma-conv
620 def-measure-relative-entropy
624 eq-defn-rel-entropy
633 def-continuous-entropic-ot
636 eq-entropic-generic
653 def-mutual-information
674 eq-continuous-sinkhorn-operators
689 eq-continuous-sinkhorn-scaling
703 eq-continuous-sinkhorn-iteration
718 prop-sinkhorn-gibbs-pushforward
728 eq-gibbs-pushforward-target
736 eq-closed-form-gibbs-coupling
804 prop-continuous-convergence-epsilon
850 prop-large-epsilon-expansion
936 prop-small-epsilon-expansion
1013 sec-dual-sinkhorn
1027 eq-dual-formulation
1042 eq-entropy-pd
1093 def-discrete-soft-c-transform
1102 eq-discrete-soft-c-transforms
1116 alg:log-domain-sinkhorn
1172 fig:sinkhorn-soft-c-transform-epsilon
1180 prop-continuous-entropic-duality
1183 eq-dual-sinkh-cont
1190 eq-dual-sinkhorn-objective
1205 eq-continuous-entropic-density-law
1255 def-continuous-soft-c-transform
1266 eq-soft-c-cont-f
1273 eq-soft-c-cont-g
1280 prop-entropic-dual-potentials
1309 rem-soft-transform-convexity
1317 par-continuous-dual-sinkhorn
1331 eq-continuous-dual-sinkhorn-iteration
1373 rem-sinkhorn-gaussian-marginals
1384 sec-sinkhorn-marginal-dependent
1394 eq-marginal-dependent-unregularized-cont
1403 def-marginal-dependent-entropic-transport
1406 eq-marginal-dependent-cont
1419 eq-marginal-dependent-discrete
1459 prop-marginal-dependent-dual-scaling
1462 eq-marginal-dependent-dual
1481 eq-generalized-sinkhorn-kl-prox
1493 eq-kl-prox-marginal
1536 alg-generalized-sinkhorn-marginal-penalties
1605 sec-sinkhorn-heat-hopf-cole
1619 eq-sinkhorn-heat-kernel
1630 eq-convolutional-sinkhorn
1685 fig:sinkhorn-geodesics-in-heat
1701 eq-soft-hopf-lax-heat
1715 eq-soft-c-transform-gaussian-convolution
1726 prop-soft-legendre-convolution
1731 eq-soft-legendre-definition
1736 eq-soft-legendre-logsumexp
1743 eq-soft-legendre-convolution
1773 rem-soft-legendre-fft
1797 fig:sinkhorn-soft-biconjugates
1830 fig:sinkhorn-hopf-cole-transform
1837 sec-sinkhorn-other-regularizers
1851 def-phi-regularized-ot
1852 eq-phi-regularized-ot
1863 prop-phi-regularized-ot-dual
1868 eq-phi-regularized-ot-dual
1881 eq-phi-regularized-ot-density-law
1952 def-measure-bregman-divergence
1955 eq-measure-bregman-divergence
1971 def-bregman-regularized-ot
1981 prop-bregman-regularized-ot-dual
1995 eq-bregman-regularized-ot-dual
2011 eq-bregman-regularized-ot-density-law
2072 prop-kl-only-bregman-phi
2120 eq-phi-soft-c-transform
2146 eq-bregman-soft-c-transform
2165 eq-generalized-soft-c-alternate-maximization
2176 eq-quadratic-regularized-density-laws
2207 fig:sinkhorn-phi-soft-c-transforms
2226 fig:sinkhorn-entropic-versus-quadratic-regularization
2234 sec-sinkhorn-div
2308 def-sinkhorn-divergence
2311 eq-sinkhorn-divergence
2318 rem-sinkhorn-reference-invariance
2336 eq-sinkhorn-reference-invariance
2365 fig:sinkhorn-divergence-debiasing
2374 eq-formula-cost-dual
2390 prop-sinkhorn-divergence-asymptotics
2447 prop-sinkhorn-positive
2508 sec-complex-epsilon
2534 thm-carlier-complex-sinkhorn
2590 fig:sinkhorn-complex-epsilon-continuation
```

### Cross-reference occurrence register

The following register is exhaustive for the 153 `\\ref`, `\\eqref`, and `\\hyperref` occurrences in the chapter. It is grouped by target; each entry after the target is `source-line:command`. There are 96 distinct targets. Every target resolves in the current full-book build; there are no duplicate Chapter 8 labels and no unresolved Chapter 8 references.

```text
def-bregman-divergence 1964:ref
def-c-transform 1698:ref
def-continuous-entropic-ot 2319:ref
def-continuous-soft-c-transform 1700:ref
def-discrete-entropic-ot 632:ref
def-discrete-relative-entropy 618:ref
def-discrete-soft-c-transform 1253:ref
def-first-variation 1962:ref
def-marginal-dependent-entropic-transport 1446:ref
def-measure-relative-entropy 991:ref
def-positive-kernels 2448:ref
def-universal-kernel 2449:ref
def_divergence 1848:ref
def_entropy 1848:ref
eq-bregman-regularized-ot-density-law 2052:eqref 2057:eqref
eq-bregman-regularized-ot-dual 2052:eqref 2145:eqref
eq-closed-form-gibbs-coupling 756:eqref 786:eqref
eq-continuous-dual-sinkhorn-iteration 1344:eqref 2173:eqref
eq-continuous-entropic-density-law 688:eqref 1248:eqref
eq-continuous-sinkhorn-iteration 798:eqref 1338:eqref 2521:eqref
eq-continuous-sinkhorn-operators 1344:eqref 2521:eqref
eq-continuous-sinkhorn-scaling 1354:eqref 2521:eqref
eq-convolutional-sinkhorn 1658:eqref
eq-discrete-soft-c-transforms 1276:eqref
eq-dual-formulation 1080:eqref
eq-dual-sinkh-cont 1241:eqref 1282:eqref 2385:eqref
eq-dual-sinkhorn-objective 1301:eqref 1321:eqref 1365:eqref 1534:eqref 1928:eqref
eq-entropic-generic 647:eqref 661:eqref 735:eqref 807:eqref 830:eqref 1182:eqref
eq-entropy-conv-1 587:eqref 588:eqref
eq-formula-cost-dual 2415:eqref 2465:eqref
eq-gibbs-pushforward-target 770:eqref
eq-kanto-discr 57:eqref
eq-legendre 1068:eqref 1910:eqref
eq-marginal-dependent-discrete 1461:eqref
eq-marginal-dependent-dual 1515:eqref
eq-measure-bregman-divergence 2019:eqref
eq-phi-regularized-ot-density-law 2057:eqref
eq-phi-regularized-ot-dual 1918:eqref 1928:eqref 2106:eqref 2119:eqref
eq-phi-soft-c-transform 2162:eqref
eq-proof-gamma-conv 587:eqref
eq-regularized-discr 81:eqref 99:eqref 164:eqref 169:eqref 181:eqref 490:eqref 507:eqref 559:eqref 580:eqref 1021:eqref
eq-regularized-discr-rescaled 490:eqref 507:eqref 582:eqref 1021:eqref 1026:eqref
eq-scaling-form 201:eqref 671:eqref 1040:eqref 2528:eqref
eq-separable-gaussian-half-step 1780:eqref
eq-sinkhorn 798:eqref 2528:eqref 2572:eqref
eq-sinkhorn-divergence 2362:eqref
eq-soft-c-cont-f 1336:eqref
eq-soft-c-cont-g 1336:eqref
eq-soft-c-transform-gaussian-convolution 1770:eqref
eq-soft-hopf-lax-heat 1714:eqref 1763:eqref
eq-soft-legendre-convolution 1770:eqref 1778:eqref
eq-soft-legendre-definition 1763:eqref
eq-soft-legendre-logsumexp 1770:eqref 1770:eqref
fig:sinkhorn-complex-epsilon-continuation 2575:ref
fig:sinkhorn-continuous-marginal-scaling 287:ref
fig:sinkhorn-coupling-iterations 314:ref
fig:sinkhorn-divergence-debiasing 2346:ref
fig:sinkhorn-dual-potentials-epsilon 350:ref 533:ref
fig:sinkhorn-entropic-versus-quadratic-regularization 2210:ref
fig:sinkhorn-entropy-lp-geometry 108:ref 137:ref
fig:sinkhorn-geodesics-in-heat 1667:ref
fig:sinkhorn-hopf-cole-transform 1810:ref
fig:sinkhorn-linear-rate-epsilon 367:ref
fig:sinkhorn-marginal-errors 262:ref
fig:sinkhorn-phi-soft-c-transforms 2191:ref
fig:sinkhorn-plan-epsilon 59:ref
fig:sinkhorn-potentials-iterations 334:ref
fig:sinkhorn-soft-biconjugates 1783:ref 1810:ref
fig:sinkhorn-soft-c-transform-epsilon 1154:ref
par-continuous-dual-sinkhorn 798:hyperref
par-diffusion-model-connection 790:hyperref
prop-bregman-regularized-ot-dual 2106:ref
prop-continuous-entropic-duality 688:ref
prop-convergence-eps 59:ref 106:ref 802:ref
prop-entropic-dual-potentials 688:ref
prop-entropic-unique 99:ref 106:ref 178:ref 223:ref
prop-gaussian-sinkhorn-closed-form 2596:ref
prop-kl-shift 643:ref 2328:ref
prop-sinkhorn-divergence-asymptotics 2434:ref
prop-sinkhorn-positive 2316:ref
prop-soft-legendre-convolution 1778:ref
rem-soft-transform-convexity 1365:ref
sec-barycenters 1441:ref
sec-convergence-dual 359:ref
sec-convergence-init 2106:ref
sec-entropic-convergence 334:ref
sec-gaussian-sinkhorn 1375:ref
sec-generative-flow-matching 790:ref
sec-path-space-schrodinger 12:ref 647:ref
sec-phi-div 445:ref
sec-sinkhorn-advanced 2513:ref
sec-sinkhorn-hilbert 798:ref
sec-sinkhorn-monotone 798:ref
sec-unbalanced 1441:ref
sec-wasserstein-gradient-flows 1441:ref
thm-pinsker 843:ref
```

### Imported-definition and theorem dependency register

The chapter relies on the following definitions, equations, sections, and results defined outside `sinkhorn.tex`. I inspected each target in its defining source, rather than inferring its meaning from the Chapter 8 citation alone.

| Target | Defining file and current line | Audit use |
|---|---:|---|
| `def-bregman-divergence` | `OT4ML/sections/sinkhorn-advanced.tex:48` | finite-dimensional Bregman convention |
| `def-c-transform` | `OT4ML/sections/dual.tex:317` | hard (c)-transform comparison |
| `def-first-variation` | `OT4ML/sections/wasserstein-gradient-flows.tex:66` | first-variation convention in divergence flow |
| `def-positive-kernels` | `OT4ML/sections/dual-norms.tex:174` | positive-definite kernel condition |
| `def-universal-kernel` | `OT4ML/sections/dual-norms.tex:316` | characteristic/universal kernel separation |
| `def_divergence` | `OT4ML/sections/dual-norms.tex:385` | divergence terminology |
| `def_entropy` | `OT4ML/sections/dual-norms.tex:372` | measure entropy convention |
| `eq-legendre` | `OT4ML/sections/dual-norms.tex:656` | Fenchel conjugate convention |
| `eq-kanto-discr` | `OT4ML/sections/kantorovich.tex:148` | unregularized discrete primal |
| `sec-phi-div` | `OT4ML/sections/dual-norms.tex:356` | general phi-divergence definitions and examples |
| `sec-path-space-schrodinger` | `OT4ML/sections/dynamic-ot.tex:596` | path-space Schrödinger bridge context |
| `sec-sinkhorn-advanced` | `OT4ML/sections/sinkhorn-advanced.tex:9` | advanced convergence chapter invoked by the complex-temperature caveat |
| `sec-convergence-dual` | `OT4ML/sections/sinkhorn-advanced.tex:11` | convergence cross-reference |
| `sec-convergence-init` | `OT4ML/sections/sinkhorn-advanced.tex:26` | initialization/convergence discussion |
| `sec-entropic-convergence` | `OT4ML/sections/sinkhorn-advanced.tex:10` | advanced convergence material |
| `sec-sinkhorn-hilbert` | `OT4ML/sections/sinkhorn-advanced.tex:660` | Hilbert metric contraction |
| `sec-sinkhorn-monotone` | `OT4ML/sections/sinkhorn-advanced.tex:353` | monotone dual convergence |
| `sec-gaussian-sinkhorn` | `OT4ML/sections/sinkhorn-advanced.tex:1411` | Gaussian entropic OT |
| `sec-generative-flow-matching` | `OT4ML/sections/transportation-models.tex:15` | diffusion/flow-matching context |
| `sec-unbalanced` | `OT4ML/sections/generalized-wasserstein.tex:21` | unbalanced transport context |
| `sec-barycenters` | `OT4ML/sections/generalized-ot-problems.tex:13` | barycenter context |
| `sec-wasserstein-gradient-flows` | `OT4ML/sections/wasserstein-gradient-flows.tex:7` | gradient-flow context |
| `prop-gaussian-sinkhorn-closed-form` | `OT4ML/sections/sinkhorn-advanced.tex:1443` | closed-form Gaussian continuation claim |
| `thm-pinsker` | `OT4ML/sections/dual-norms.tex:508` | KL-to-total-variation implication |
| `par-diffusion-model-connection` | `OT4ML/sections/transportation-models.tex:311` | diffusion-model connection |

### Included-asset occurrence register

There are 61 `\\includegraphics` occurrences across 16 figure environments. Every referenced file exists on disk. The entries below give the Chapter 8 source line and path relative to `OT4ML/`; repeated directories are retained so that each occurrence is independently auditable.

```text
64 figures/sinkhorn-plan-epsilon/eps-0p018.pdf
65 figures/sinkhorn-plan-epsilon/eps-0p045.pdf
66 figures/sinkhorn-plan-epsilon/eps-0p120.pdf
67 figures/sinkhorn-plan-epsilon/eps-0p320.pdf
114 figures/sinkhorn-entropy-lp-geometry/eps-large.pdf
115 figures/sinkhorn-entropy-lp-geometry/eps-medium.pdf
116 figures/sinkhorn-entropy-lp-geometry/eps-small.pdf
117 figures/sinkhorn-entropy-lp-geometry/path.pdf
118 figures/sinkhorn-entropy-lp-geometry/barrier-large.pdf
119 figures/sinkhorn-entropy-lp-geometry/barrier-medium.pdf
120 figures/sinkhorn-entropy-lp-geometry/barrier-small.pdf
121 figures/sinkhorn-entropy-lp-geometry/barrier-path.pdf
268 figures/sinkhorn-marginal-errors/initial.pdf
269 figures/sinkhorn-marginal-errors/row-1.pdf
270 figures/sinkhorn-marginal-errors/column-1.pdf
271 figures/sinkhorn-marginal-errors/row-2.pdf
272 figures/sinkhorn-marginal-errors/column-2.pdf
293 figures/sinkhorn-continuous-marginal-scaling/initial.pdf
294 figures/sinkhorn-continuous-marginal-scaling/row-1.pdf
295 figures/sinkhorn-continuous-marginal-scaling/column-1.pdf
296 figures/sinkhorn-continuous-marginal-scaling/column-12.pdf
319 figures/sinkhorn-coupling-iterations/eps-0p010.pdf
320 figures/sinkhorn-coupling-iterations/eps-0p030.pdf
321 figures/sinkhorn-coupling-iterations/eps-0p085.pdf
322 figures/sinkhorn-coupling-iterations/eps-0p240.pdf
341 figures/sinkhorn-potentials-iterations/iter-0.pdf
342 figures/sinkhorn-potentials-iterations/iter-1.pdf
343 figures/sinkhorn-potentials-iterations/iter-3.pdf
344 figures/sinkhorn-potentials-iterations/iter-12.pdf
373 figures/sinkhorn-linear-rate-epsilon/marginal-error.pdf
374 figures/sinkhorn-linear-rate-epsilon/limiting-plans.pdf
538 figures/sinkhorn-dual-potentials-epsilon/eps-0p010.pdf
540 figures/sinkhorn-dual-potentials-epsilon/eps-0p045.pdf
541 figures/sinkhorn-dual-potentials-epsilon/eps-0p200.pdf
1161 figures/sinkhorn-soft-c-transform-epsilon/eps-0p55.pdf
1163 figures/sinkhorn-soft-c-transform-epsilon/eps-0p14.pdf
1165 figures/sinkhorn-soft-c-transform-epsilon/eps-0p035.pdf
1166 figures/sinkhorn-soft-c-transform-epsilon/hard.pdf
1673 figures/sinkhorn-geodesics-in-heat/exact.pdf
1674 figures/sinkhorn-geodesics-in-heat/epsilon-small.pdf
1675 figures/sinkhorn-geodesics-in-heat/epsilon-medium.pdf
1676 figures/sinkhorn-geodesics-in-heat/epsilon-large.pdf
1791 figures/sinkhorn-hopf-cole-transform/biconjugate-simple.pdf
1792 figures/sinkhorn-hopf-cole-transform/biconjugate-oscillatory.pdf
1820 figures/sinkhorn-hopf-cole-transform/burgers-epsilon-small.pdf
1821 figures/sinkhorn-hopf-cole-transform/burgers-epsilon-medium.pdf
1822 figures/sinkhorn-hopf-cole-transform/burgers-epsilon-large.pdf
2197 figures/sinkhorn-phi-soft-c-transforms/kl.pdf
2198 figures/sinkhorn-phi-soft-c-transforms/burg.pdf
2199 figures/sinkhorn-phi-soft-c-transforms/quadratic.pdf
2216 figures/sinkhorn-entropic-versus-quadratic-regularization/kl-plan.pdf
2217 figures/sinkhorn-entropic-versus-quadratic-regularization/burg-plan.pdf
2218 figures/sinkhorn-entropic-versus-quadratic-regularization/quadratic-plan.pdf
2352 figures/sinkhorn-divergence-debiasing/raw-small.pdf
2354 figures/sinkhorn-divergence-debiasing/debiased-small.pdf
2355 figures/sinkhorn-divergence-debiasing/raw-large.pdf
2356 figures/sinkhorn-divergence-debiasing/debiased-large.pdf
2581 figures/sinkhorn-complex-epsilon-continuation/theta-0p00.pdf
2582 figures/sinkhorn-complex-epsilon-continuation/theta-0p40.pdf
2583 figures/sinkhorn-complex-epsilon-continuation/theta-0p80.pdf
2584 figures/sinkhorn-complex-epsilon-continuation/theta-1p20.pdf
```

## Read-only audit-phase preservation (historical)

The audited source was measured independently before the read-only audit and
again when that report was assembled, before the correction pass documented at
the beginning of this file.

| Measurement | Initial | Final |
|---|---:|---:|
| Physical lines | 2,610 | 2,610 |
| Bytes | 155,652 | 155,652 |
| SHA-256 | `eccafc8beb29d9f68ba7425670fe69e1bc8a22bc7679c684ad238f905547054d` | `eccafc8beb29d9f68ba7425670fe69e1bc8a22bc7679c684ad238f905547054d` |

The identical byte count and SHA-256 establish byte-for-byte preservation of `/Users/gpeyre/Dropbox/github/ot4ml/OT4ML/sections/sinkhorn.tex` during the read-only audit phase. The **only path modified during that phase** was:

```text
/Users/gpeyre/Dropbox/github/ot4ml/audit-chap8.md
```

No source file, bibliography, notebook, retained output, generated figure, asset, build product, Git index entry, commit, or remote branch was modified during that historical read-only phase. The subsequent correction pass intentionally changed the files listed in its ledger.

## Post-correction validation

After the correction review, the Chapter 8 source contains **2,647 physical
lines** and **162,008 bytes**, with SHA-256
`1d2354571952ea7531c19bbbab2a162abd8d68cc7253c9869787d89b30d569e6`.

- `git diff --check` reports no whitespace error in the corrected chapter,
  bibliography entry, audit ledger, or repaired notebooks.
- BibTeX resolves the new `TerjekGonzalezSanchez2022` entry. A complete BibTeX
  pass followed by two LaTeX passes produced a **488-page** `OT4ML.pdf` with no
  undefined citation, undefined reference, or compilation error. The final PDF
  contains 28,837,627 bytes.
- All **15** Chapter 8 notebooks were executed in place from fresh kernels. For
  every notebook, the saved code-cell counts form the exact sequence
  `1,2,...,N`, and no output has type `error`.
- The certified Burg plan has row error `4.08e-14`, column error `2.80e-16`,
  and primal--dual gap `1.88e-4`. The KL and quadratic comparison plans have
  marginal errors below `2.1e-13`.
- In the debiasing experiment, every confined objective decreased, no clipping
  branch was activated, and all independently recomputed Sinkhorn marginal
  residuals are below `5.7e-16`. The retained terminal RMS first variations are
  `4.19e-4`, `3.84e-5`, `6.75e-2`, and `8.72e-5`; the comparatively larger raw,
  large-temperature value is why the caption explicitly describes finite-step
  endpoints rather than stationary minimizers.
- The regenerated Burg and debiasing panels and the pages containing the
  small-temperature, marginal-dependent, `\varphi`-regularized, Bregman, and
  closed-Gibbs corrections were rendered to raster images and inspected. No
  clipping, overlap, unreadable formula, broken caption, or malformed theorem
  box was found.
