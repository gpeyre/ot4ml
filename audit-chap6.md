# Second-Round Independent Audit of Chapter 6, "Semi-discrete and W1"

## Scope and method

This report is a fresh adversarial refinement of the current on-disk source
`OT4ML/sections/semidiscr-w1.tex` and supersedes the preceding version of
`audit-chap6.md`. The chapter source was already modified relative to Git before
this audit. It was treated as read-only.

The scope and finding descriptions below record that read-only audit baseline.
The subsequent correction pass changed the chapter source; the correction
ledger and post-correction validation section record its current status.

At second-pass entry, the chapter source had exactly 1,422 physical lines and
80,542 bytes, with SHA-256
`a7cd404faf7eabccc51ab6a9984d76ba4ec6103df354f3aca24f7f2acd0cf1bb`.
The preceding report had SHA-256
`e7fa086cb63ab592f9770d6b4491117a9b218ae9809ca071e4965d246b5b6e39`.
That report was used only as a candidate inventory: every prior `CH6-*` item was
re-derived from the source and either retained, narrowed, reclassified, or
supplemented after an independent reread.

The second pass covered every physical source line, every standalone math block,
all named environments and proofs, all five algorithms, all seven figures and
their retained generators/diagnostics, all labels and references, and every
citation occurrence. Imported conventions were checked read-only in the book's
chapters on Kantorovich duality, c-transforms, assignment dual certificates,
one-dimensional transport, and continuity equations. Primary or near-primary
material was checked where locally available for auction scaling, quantization
gradient-flow limits, ultrafast diffusion, and graph flow-Sinkhorn. No asset was
regenerated. Bounded diagnostics were kept in `/tmp`.

The adversarial procedure had two stages. First, each prior finding was attacked
as a possible false positive by testing its exact quantifiers, conventions, and
smallest counterexample. Second, the complete source was reread with independent
searches for universal claims, omitted hypotheses, equality cases, tie and empty
cell behavior, normalization changes, and complexity simplifications. Optional
extensions are retained only as `RQ6-*` questions and are excluded from defect
counts.

## Second-pass refinement note

The first report counted 8 defects: 0 Critical, 1 Major, 4 Moderate, and 3 Minor.
The reconciled second pass counts 10 defects: 0 Critical, 0 Major, 4 Moderate,
and 6 Minor.

| Prior item | Reconciled item | Second-pass action |
|---|---|---|
| Prior `CH6-001` | `CH6-001` | Retained but reduced from Major to Moderate. The missing high-resolution normalization and metric mismatch are real, but the PDE and static optimizer remain correct and the paragraph is formal rather than a central theorem. |
| Prior `CH6-003` | `CH6-002` | Retained and narrowed to overlapping deterministic cells. The prior demand that the input separately say `tau>0` was removed: in an algorithm explicitly called ascent, "steps" conventionally means positive step sizes, and no convergence theorem is asserted. |
| Prior `CH6-004` | `CH6-003` | Retained and strengthened. In addition to the Sobolev-representative defect, the proof needs a spatial cutoff because the divergence identity is defined only for compactly supported tests. |
| No prior item | `CH6-004` | Added: the universal comparison between deterministic quantization and empirical OT rates is contradicted by the chapter's own one-dimensional formulas. |
| Prior `CH6-005` | `CH6-005` | Retained but reduced from Moderate to Minor. The theorem and exactness condition are correct; only the final parameter-free simplification needs a concrete `eta=Theta(1/n)` choice. |
| Prior `CH6-002` | `CH6-006` | Retained but reduced from Moderate to Minor. The gauge identity is correct; the problem is one local sentence that can be read as a uniqueness claim. |
| No prior item | `CH6-007` | Added: the discrete subsection permits mass `M`, while the imported `MKD_C` notation is defined only for probability vectors. |
| Prior `CH6-006` | `CH6-008` | Retained as Minor after rechecking the notebook residual. |
| Prior `CH6-007` | `CH6-009` | Retained and expanded to reconcile squared error, root-mean-square error, nonzero constants, and finite Monte Carlo provenance. |
| Prior `CH6-008` | `CH6-010` | Retained as Minor after rechecking the plotting map. |

No prior root-cause finding was silently discarded. One false-positive symptom,
the alleged absence of a positive-step declaration, was removed. Two previously
missed defects were added. The stale internal label
`eq-semi-disc-energy-entropy` at line 624 is recorded in the label matrix as
editorial cleanup, not as a defect: it is unreferenced and does not alter any
printed statement or reference resolution.

## Correction pass - 2026-08-26

All ten established findings were corrected in
`OT4ML/sections/semidiscr-w1.tex`. The original findings are retained below as
an audit trail; their line numbers refer to the audited baseline recorded above.

| Finding | Status | Implemented correction |
|---|---|---|
| `CH6-001` | Resolved | Inserted the missing `m^{p/d}` normalization in the high-resolution quantization ansatz, stated that the unscaled distortion is `O(m^{-p/d})`, labelled the mass-preconditioned Lloyd flow, and explicitly separated it from the ordinary Euclidean site gradient flow treated by the cited one-dimensional limit theory. |
| `CH6-002` | Resolved | Replaced overlapping closed cells in deterministic Laguerre ascent by a deterministic `min argmin` selector and disjoint selected cells. The algorithm now computes and tests the masses of this partition, and the text explains why tied atoms may require mass splitting for exact target masses. |
| `CH6-003` | Resolved | Stated the exact zero-mass/total-variation first-moment domain on noncompact pointed spaces, formulated the Euclidean dual using continuous Sobolev representatives normalized at the origin, and completed the Beckmann weak-duality proof with truncation, mollification, and a spatial cutoff before passing to the limits. |
| `CH6-004` | Resolved | Replaced the false universal equality of deterministic and empirical rates by a regime-dependent comparison, with a pointer to the statistical chapter and the chapter's own one-dimensional `m^{-1}` versus `m^{-1/2}` contrast. |
| `CH6-005` | Resolved | Chose the concrete tolerance `eta=1/(2n)` before simplifying the integer-cost complexity and retained the immediate `R_C=0` case. |
| `CH6-006` | Resolved | Replaced the uniqueness implication by the correct additive-gauge statement and explicitly allowed further nonuniqueness absent nondegeneracy/connectivity assumptions. |
| `CH6-007` | Resolved | Restricted the discrete semi-dual vectors to `a in simplex_n` and `b in simplex_m`, matching the imported probability-domain definition of `MKD_C`. |
| `CH6-008` | Resolved | Changed the Laguerre-figure introduction and panel heading from exact balance to approximate balance, consistently with the retained numerical residual. |
| `CH6-009` | Resolved | Qualified positive asymptotic orders by nonconstancy of the quantile, compared like error scales, described the deterministic points as quantile-bin averages, and identified the empirical curve as a finite Monte Carlo estimate. |
| `CH6-010` | Resolved | Corrected the graph-flow caption to state that width is affine in normalized square-root flux, matching the plotting map with its positive width floor. |

No figure generator or asset was changed: `CH6-008`, `CH6-009`, and `CH6-010`
were provenance/wording discrepancies, and the retained numerical outputs were
already the data audited below. Build and visual-validation results are recorded
at the end of this file.

## Correction-review iteration - 2026-08-26

Every corrected claim and proof was checked again against its hypotheses,
normalization, boundary cases, and surrounding notation. None of the ten
resolved findings reopened, and this review found no additional established
defect. It did identify five places where the corrected formulation could be
made more explicit:

1. The one-dimensional optimal Laguerre cells are now identified with the
   quantile intervals modulo `alpha`-null sets, rather than by literal equality
   of representatives at cell boundaries.
2. The deterministic Laguerre algorithm now states that its selected cells form
   a disjoint partition, their masses sum to one, and `b-m^(ell)` is a selected
   supergradient of the concave semi-dual objective.
3. The `m^{-1}` deterministic versus `m^{-1/2}` empirical one-dimensional
   comparison is explicitly restricted to the regular nonconstant laws covered
   by the two preceding propositions.
4. The high-resolution ansatz now states convergence of the empirical site
   measures and asymptotic local optimality of the cells, identifies
   `C_{p,d}` as the universal quantization constant, and limits the asserted
   `m^{-p/d}` order to such configurations.
5. The Beckmann cutoff argument now records the uniform bound on the mollified
   truncation, takes absolute values in the divergence estimate, and specifies
   the ordered limits `R -> infinity`, `delta -> 0`, and `K -> infinity` with
   the relevant domination at each step.

The primary one-dimensional quantization-flow source cited in the chapter was
also rechecked. It studies the ordinary Euclidean site gradient flow with an
`m`-dependent time/metric rescaling, confirming the chapter's corrected
distinction from the mass-preconditioned Lloyd flow.

## Executive summary

This is the historical audit summary. Its counts describe the defects found in
the audited baseline; all ten established defects are now resolved by the
correction pass above.

| Severity | Count |
|---|---:|
| Critical | 0 |
| Major | 0 |
| Moderate | 4 |
| Minor | 6 |
| **Total established defects** | **10** |

The chapter's central constructions survive the second pass. The general and
discrete semi-duals have the correct orientation; auction bidding preserves
`epsilon`-complementary slackness and has valid fixed-tolerance and scaling
bounds; the semi-discrete cell-mass gradient and one-dimensional formulas are
correct under their hypotheses; the elementary quantization propositions and
constants are correct; and both continuous and graph Beckmann equalities have
the correct sign and value.

The four Moderate defects are localized but mathematically substantive: the
mean-field paragraph conflates two particle metrics and omits the energy
normalization; deterministic Laguerre pseudocode double-counts boundary mass;
the Euclidean `W_1` dual is not well-defined on raw Sobolev equivalence classes
and its proof omits a cutoff; and a universal empirical-rate comparison is
false. The six Minor defects concern one auction parameter simplification, one
gauge-uniqueness sentence, one equal-mass notation mismatch, and three retained
figure/prose precision issues.

## Findings

### CH6-001 - Moderate - The mean-field paragraph omits the high-resolution normalization and conflates Lloyd flow with the cited Euclidean gradient flow

**Status:** Resolved on 2026-08-26; see the correction ledger above.

- **Current lines and environment:** lines 903--929, paragraph `Mean-field limit and ultrafast diffusion`, especially lines 911--919 and displays at lines 912--918 and 922--928. The mass-preconditioned Lloyd flow to which the paragraph is attached is defined at lines 844--902, especially lines 859--876.
- **Precise claim:** line 911 says high-resolution quantization leads, up to a constant depending only on `p,d`, to `G_rho(sigma)=int rho sigma^{-p/d}`. Line 919 then says "the discrete-to-continuum limit of the dynamics is rigorous in one dimension" immediately after the chapter has defined `dot y_j=bar x_j-y_j` as a mass-preconditioned gradient flow.
- **Derivation:** if `sigma` is the probability density of sites, a typical cell near `x` has volume about `(m sigma(x))^{-1}`. Its `p`-distortion is proportional to `rho(x)(m sigma(x))^{-(1+p/d)}`. Multiplication by the local number of cells, `m sigma(x)`, yields
  `F_m(Y) ~ C_{p,d} m^{-p/d} int rho(x)sigma(x)^{-p/d} dx`.
  Therefore `G_rho` is the limit shape of `m^{p/d}F_m`, not the unscaled energy modulo an `m`-independent constant. For quadratic distortion,
  `-grad_{y_j}F_m=2a_j(bar x_j-y_j)`, whereas the chapter's Lloyd ODE is
  `dot y_j=bar x_j-y_j`. The velocities differ by the cell-dependent factor
  `2a_j`, so the two ODEs are not related by one global change of time unless all
  cell masses happen to agree. The cited one-dimensional result studies the
  ordinary Euclidean site gradient flow with a rescaled discrete metric and
  time (quadratic one-dimensional time scale `m^3`), not the preceding
  mass-preconditioned Lloyd ODE.
- **Why this is Moderate, not Major:** the displayed PDE is the correct formal
  `W_2` gradient flow of `G_rho`, and its stationary exponent
  `sigma_* proportional to rho^{d/(d+p)}` is correct. The defect is a localized
  normalization and attribution/metric bridge in a formal discussion; it does
  not invalidate Lloyd descent, the static quantization results, or a stated
  convergence theorem.
- **Smallest repair:** replace the static statement by
  `m^{p/d}F_m -> C_{p,d}G_rho` under the usual high-resolution assumptions.
  State separately that the displayed PDE is the formal Wasserstein gradient
  flow of `G_rho`, and that the cited rigorous one-dimensional dynamic limit is
  for ordinary Euclidean gradient descent after metric/time rescaling, not as
  written for the mass-preconditioned Lloyd flow. Derive and cite a separate
  limit if Lloyd flow is the intended finite-particle dynamics.
- **Downstream impact:** lines 911 and 919 require repair. The PDE sign, uniform-density reduction, no-flux/periodic boundary statement, stationary density, and earlier energy-dissipation identity remain valid.

### CH6-002 - Moderate - Deterministic Laguerre ascent can double-count tie mass

**Status:** Resolved on 2026-08-26; see the correction ledger above.

- **Current lines and environment:** Definition `def-laguerre-power-cells`, lines 431--440; Algorithm `alg:semidiscrete-laguerre-ascent`, lines 581--610, especially the closed-cell computation at lines 592--596 and update at lines 603--604.
- **Precise claim:** the definition correctly says a partition requires arbitrary tie-breaking, but the deterministic algorithm computes all cells with non-strict `<=` and integrates each of those overlapping sets. It supplies neither a disjoint selector nor a hypothesis that every encountered boundary has zero `alpha`-mass.
- **Counterexample:** let `alpha=delta_0`, use `c(x,y)=|x-y|^2`, choose `y_1=-1`, `y_2=1`, target weights `b=(1/2,1/2)`, and initialize `g=(0,0)`. The source atom belongs to both printed cells, so the algorithm computes `m=(1,1)`, whose total is 2 rather than 1. The update is a common shift and leaves the same invalid mass vector. Thus the quantity called a cell-mass vector is not necessarily a marginal or a selected semi-dual supergradient.
- **Proof gap/root cause:** the analytic gradient formula at lines 516--542 is explicitly conditional on an almost-everywhere unique minimizer and is correct. The pseudocode drops that condition while reverting from a tie-broken partition to closed, overlapping cells. Atomlessness by itself would not handle all degenerate costs; the needed condition is boundary-nullness for the encountered cells, or an explicit measurable selector.
- **Smallest repair:** compute cells with one deterministic selection, for example
  `j(x)=min argmin_r(c(x,y_r)-g_r)`, and set `L_j={x:j(x)=j}`. Alternatively,
  state that all encountered cell boundaries are `alpha`-null. For atomic
  sources, explain that selected supergradients are valid but exact prescribed
  masses can require splitting tied atoms and may be unattainable by a map.
- **Downstream impact:** only the deterministic pseudocode's mass invariant,
  stopping test, and returned cells are affected. Definition
  `def-laguerre-power-cells`, Proposition `prop-semidiscrete-dual-gradient`, and
  the stochastic algorithm's explicit `min argmin` tie rule remain correct.

### CH6-003 - Moderate - The Euclidean KR dual needs Lipschitz representatives, an exact signed-measure domain, and a spatial cutoff in the Beckmann proof

**Status:** Resolved on 2026-08-26; see the correction ledger above.

- **Current lines and environments:** line 1205; equation `eq-w1-cont`, lines 1231--1237; distributional divergence, lines 1264--1270; proof of Proposition `prop-euclidean-beckmann`, lines 1290--1318, especially line 1299.
- **Precise claim:** equation `eq-w1-cont` integrates `f` against possibly singular `xi=alpha-beta` while optimizing over `W_loc^{1,infinity}(R^d)`. Line 1205 says only "signed measures with finite first moment" on noncompact spaces. The proof then invokes the divergence identity for smooth Lipschitz functions although divergence was defined only against `C_c^1` tests, and says truncation plus mollification suffices.
- **Counterexample to the displayed domain:** Sobolev functions are equivalence classes modulo Lebesgue-null sets. Start with the zero class and change one representative's value at 0 to an arbitrary `A`. Its weak gradient remains zero almost everywhere. For `xi=delta_0-delta_1`, the integral of that representative is `A`. Hence the displayed integral is not defined on the Sobolev class; under a literal representative-wise reading its supremum is infinite.
- **Exact noncompact domain:** for a pointed metric space with base point `x_0`, the signed KR domain is
  `xi(X)=0` and `int d(x,x_0) d|xi|(x)<infinity`, tested against normalized continuous 1-Lipschitz functions. A first moment of an unspecified signed representative is not precise enough; the total variation measure is required.
- **Missing proof step:** value truncation and mollification make a Lipschitz function bounded and smooth, but not compactly supported. They therefore do not by themselves authorize the distributional integration by parts at line 1293. For a bounded smooth approximation `f_K`, multiply by a cutoff `chi_R` that is 1 on `B_R` and satisfies `|grad chi_R|=O(1/R)`. For fixed `K`, the extra flux term is at most `O(K/R)||flow||_TV`; let `R` tend to infinity, then let `K` tend to infinity, using the first moments of `alpha,beta`. This supplies the omitted passage.
- **Smallest repair:** state `eq-w1-cont` first over continuous normalized
  1-Lipschitz functions. If Sobolev notation is retained, require evaluation via
  the canonical continuous Lipschitz representative of each class. Replace the
  noncompact sentence by the total-variation moment condition above. Add one
  sentence in the Beckmann proof describing the cutoff limit after truncation
  and mollification.
- **Downstream impact:** the KR value, Beckmann value, segment-current construction, divergence sign, equality, and attainment all remain correct after these domain/proof repairs. Without them, the main Euclidean dual display is undefined for the Dirac example that motivates vector-valued measure fluxes.

### CH6-004 - Moderate - The deterministic quantization rate does not universally equal the empirical OT rate

**Status:** Resolved on 2026-08-26; see the correction ledger above.

- **Current lines and environment:** lines 752--784, Proposition `prop-quantization-rate` and the prose immediately after its proof, especially line 784. The contradiction is made explicit by lines 1043--1128.
- **Precise claim:** line 784 says deterministic quantization and empirical OT
  sample complexity are both governed by the spacing `m^{-1/d}` and display the
  same curse of dimensionality, without a dimensional or cost-regime qualification.
- **Internal counterexample:** take `alpha=Unif[0,1]`, `d=1`, and `p=2`. The
  optimal `m`-point quadratic quantizer has
  `W_2^2(alpha,nu_m)=1/(12m^2)`, hence
  `W_2(alpha,nu_m)=1/(sqrt(12)m)`. Proposition
  `prop-1d-random-quantile-process` gives
  `m E[W_2^2(alpha,alpha_hat_m)] -> int_0^1 u(1-u)du=1/6`, so the root-mean-square empirical `W_2` error is asymptotic to
  `1/sqrt(6m)`. The exponents are `m^{-1}` and `m^{-1/2}`, respectively, not the same `m^{-1/d}=m^{-1}` rate.
- **Reason for the mismatch:** deterministic quantization is a best-placement
  approximation problem. Empirical OT includes sampling fluctuations; its rate
  depends on dimension, `p`, moments, and whether the dimension is below, at,
  or above critical regimes. Zador's theorem refines deterministic quantization
  but does not turn this into a universal empirical-rate identity.
- **Smallest repair:** replace line 784 by a qualified comparison: optimal
  quantization always reflects geometric spacing at rate `m^{-1/d}` under the
  proposition's assumptions, while empirical OT has dimension-, cost-, and
  regularity-dependent rates and matches spacing only in appropriate
  high-dimensional regimes. Point forward to the chapter's one-dimensional
  `m^{-1}` versus `m^{-1/2}` contrast.
- **Downstream impact:** Proposition `prop-quantization-rate`, its proof, and the
  cited Zador optimizer-density narrative remain correct. The defect is the
  general empirical comparison, not the deterministic theorem.

### CH6-005 - Minor - The final exact auction complexity suppresses the chosen tolerance

**Status:** Resolved on 2026-08-26; see the correction ledger above.

- **Current lines and environment:** Proposition `prop-auction-epsilon-scaling`, lines 362--382, and the final sentence of line 384.
- **Precise claim:** the proposition correctly proves
  `O(n^3(1+log_+(R_C/eta)))` and exactness for every integer cost matrix when
  `eta<1/n`. Line 384 concludes that merely "choosing `eta<1/n`" gives
  `O(n^3(1+log_+(nR_C)))`.
- **Counterexample:** take `eta=e^{-n}/n`. It satisfies `eta<1/n`, but
  `log(R_C/eta)=log(nR_C)+n`; the additional order-`n` phase count cannot be
  removed by replacing `1/eta` with `n`. The simplified bound is valid only for
  a concrete order-`1/n` choice, such as `eta=1/(2n)`, or uniformly under
  `c/n<=eta<1/n` for fixed `c>0`.
- **Smallest repair:** replace "choosing `eta<1/n`" by "choosing, for example,
  `eta=1/(2n)`" and retain the separate `R_C=0` immediate case.
- **Downstream impact:** no theorem or algorithm changes. Fixed-`epsilon`
  termination, epsilon-complementary slackness, the error certificate, warm
  starts, exact integer recovery, and the proposition's full `eta`-dependent
  complexity are valid.

### CH6-006 - Minor - Gauge invariance does not by itself imply uniqueness modulo constants

**Status:** Resolved on 2026-08-26; see the correction ledger above.

- **Current lines and environment:** line 56, prose following Definition
  `def-full-dual-functional` and equation `eq-semi-dual`.
- **Precise claim:** after correctly proving `E_0(g+s)=E_0(g)`, the text says,
  "Potentials are therefore determined only up to an additive constant."
- **Counterexample:** for uniform two-point marginals and
  `C=[[0,1],[1,0]]`, every `g=(t,-t)` with `-1/2<=t<=1/2` maximizes the
  semi-dual with value zero. Distinct `t` values are not related by common
  additive shifts because their coordinate differences differ. Degenerate or
  disconnected optimal contact graphs can produce additional flat directions.
- **Smallest repair:** say, "The objective has an additive gauge: if `g` is
  optimal, so is `g+s`. Optimizers need not otherwise be unique; additional
  nondegeneracy/connectivity hypotheses can yield uniqueness modulo this gauge."
- **Downstream impact:** all gauge normalizations and shift identities remain
  valid. Only the local uniqueness implication must be weakened.

### CH6-007 - Minor - The discrete semi-dual permits total mass M but uses probability-only MKD notation

**Status:** Resolved on 2026-08-26; see the correction ledger above.

- **Current lines and environment:** lines 62--87, equation
  `eq-discrete-semi-dual`; imported Definition `def-discrete-kantorovich-problem`
  in `OT4ML/sections/kantorovich.tex`, lines 146--158.
- **Precise claim:** lines 62--64 allow nonnegative vectors `a,b` with arbitrary
  common mass `M`, then identify the semi-dual value with `MKD_C(a,b)`. The
  imported definition introduces `MKD_C` only for
  `a in simplex_n`, `b in simplex_m`, hence total mass one.
- **Derivation:** the displayed dual objective and transform are homogeneous and
  mathematically valid for every common mass `M`; the issue is that the left
  side has not been defined on that domain. For `M!=1`, neither imported simplex
  membership nor the imported transport-polytope notation supplies the stated
  value without an explicit homogeneous extension.
- **Smallest repair:** either assume `M=1` and put `a,b` in their probability
  simplices, or define the equal-mass extension of `MKD_C` (equivalently,
  normalize by `M` and multiply the probability cost by `M`, with the zero-mass
  case handled separately).
- **Downstream impact:** the supergradient formula, gauge cancellation for equal
  mass, and all later probability specializations remain correct. This is a
  local cross-chapter domain/notation mismatch.

### CH6-008 - Minor - The retained Laguerre figure is approximately, not exactly, balanced

**Status:** Resolved on 2026-08-26; see the correction ledger above.

- **Current lines and environment:** lines 446--459, Figure
  `fig:semidiscrete-laguerre-cells`; generator
  `notebooks-figures/semidiscrete-laguerre-cells.ipynb`.
- **Precise claim:** line 446 says final masses "match" the target weights and a
  panel heading says "balanced cells"; the caption more cautiously says the
  cells "approach" the prescribed masses.
- **Retained diagnostic:** the notebook uses grid quadrature and 128 ascent
  iterations for 21 equal weights. Its retained final all-cell `L1` mass error
  is `0.03199022346398456`, not zero.
- **Smallest repair:** use "approximately balanced" in line 446 and the panel
  heading, or disclose the residual; alternatively retain a more accurate solve
  before claiming exact balance.
- **Downstream impact:** none for Laguerre geometry or the gradient sign. This is
  numerical provenance and caption precision only.

### CH6-009 - Minor - The scalar-rate prose mixes error scales, overstates quantile uniformity, and labels finite Monte Carlo as expectation

**Status:** Resolved on 2026-08-26; see the correction ledger above.

- **Current lines and environment:** lines 1128--1142, especially line 1130 and
  Figure `fig:semidiscrete-quantile-quantization-rates`; generator
  `notebooks-figures/semidiscrete-quantile-quantization-rates.ipynb`.
- **Precise claims:** line 1130 says optimal atoms are uniform in quantile
  coordinates and that "their error decays one power" faster than the
  root-mean-square empirical error. The caption calls the finite simulation
  "expected squared" errors. Line 1128 states rates "of order" without noting
  that the asymptotic constants can vanish for a degenerate law.
- **Counterexample and scale check:** Proposition
  `prop-1d-equal-weight-quantization` correctly gives bin averages
  `y_i=m int_{I_i}Q`, not midpoint quantiles. For `Q(u)=u^2`, `m=2`, these are
  `1/12` and `7/12`; their quantile coordinates are their square roots, not the
  midpoint grid `(1/4,3/4)`. Deterministic `W_2` decays as `m^{-1}` while
  root-mean-square empirical `W_2` decays as `m^{-1/2}`, a half-power
  difference. The one-power difference is between squared errors `m^{-2}` and
  `m^{-1}`, not between squared and root-mean-square quantities. If `Q` is
  constant, both errors are identically zero, so a two-sided "order" statement
  needs nonconstancy (equivalently a positive displayed integral).
- **Retained provenance:** the generator correctly plots bin averages. It uses
  64 quadrature points per bin and a finite Monte Carlo budget decreasing from
  775 to 160 trials. The retained fitted constants are approximately `0.12157`
  for deterministic squared error and `0.13427` for random expected squared
  error.
- **Smallest repair:** say "one bin-average atom per equal quantile interval,
  asymptotically quantile-uniform under regularity." Compare either both squared
  errors (one power) or both `W_2` errors (one half-power). Qualify the positive
  asymptotic order by `Q` nonconstant, and call the plotted random curve a Monte
  Carlo estimate of the expectation.
- **Downstream impact:** both scalar propositions, exact formulas, and asymptotic
  constants remain correct. This is a post-theorem paraphrase and retained
  figure-provenance issue.

### CH6-010 - Minor - Graph-flow arrow widths are affine in normalized square-root flux, not proportional to it

**Status:** Resolved on 2026-08-26; see the correction ledger above.

- **Current lines and environment:** line 1390, Figure
  `fig:w1-graph-transport-flow`; generator
  `notebooks-figures/w1-graph-transport-flow.ipynb`.
- **Precise claim:** the caption says arrow width is proportional to
  `sqrt(|m_e|)`.
- **Retained generator check:** the plotting map is
  `w_min+(w_max-w_min)sqrt(|m_e|/max_e|m_e|)` with `w_min>0`. Thus width is
  monotone and affine in normalized square-root flux, but not proportional to
  it. The retained primal and independent dual LP values agree (`2.1491` and
  `2.4651` in the two panels), and the divergence checks pass.
- **Smallest repair:** say "width increases affinely with normalized
  `sqrt(|m_e|)`", or remove the positive width floor in the generator.
- **Downstream impact:** none for the graph Beckmann formula, signs, constraints,
  or numerical optimum. This is caption provenance only.

## Research and scope questions

The following are optional extensions or packaging questions. They are not
established defects and are excluded from the count of 10.

### RQ6-001 - Weighted auction scope

The general discrete semi-dual permits unequal weights, while the auction section
explicitly specializes at line 119 to a uniform square assignment. Should a
later edition add transportation auction for integer/rational supplies and
demands, common-denominator scaling, and its complexity? Its absence is not a
defect in the present explicitly scoped algorithm.

### RQ6-002 - Semi-discrete second-order theory

Should the chapter add the Laguerre-cell Hessian as a weighted graph Laplacian,
strict concavity modulo constants under connectivity/nondegeneracy, and damped
Newton hypotheses? The present text claims only first-order differentiability
and stochastic-supergradient rates, so omission of Newton theory is a scope
choice.

### RQ6-003 - Noncompact and bounded-domain W1 packaging

Should compact KR duality, pointed Polish finite-first-moment KR duality,
whole-space Beckmann, and bounded-domain no-flux variants be stated as separate
theorems with attainment hypotheses? CH6-003 supplies the repairs needed for the
claims currently made; fuller packaging would improve topology and boundary
bookkeeping but is optional.

## Validated-correct ledger

The following substantial claims were independently re-derived and retained as
correct, subject only to the finding explicitly cited in the disposition.

| ID | Current lines | Claim independently checked | Disposition |
|---|---:|---|---|
| VC6-001 | 27--56 | Eliminating `f` from `f+g<=c` gives `f=g^{bar c}` and `E_0(g)=int g^{bar c}d alpha+int g d beta`; partial maximization preserves concavity and common shifts cancel for unit masses. | Correct under the imported compact-space/continuous-cost duality assumptions. CH6-006 changes only the uniqueness wording. |
| VC6-002 | 62--112 | In the finite problem, `g_i^{bar C}=min_j(C_ij-g_j)`; an active selection yields supergradient `b-b_hat`, and unique row minimizers yield the gradient. | Formula, sign, and tie superdifferential are correct for nonnegative equal-mass marginals. CH6-007 concerns only the imported name of the value when mass is not one. |
| VC6-003 | 123--198 | Uniform assignment semi-dual, discrete Laguerre cells, coordinate derivative, second-best bid, target-potential decrement, and the explanation that epsilon overshoot is not exact block maximization. | Correct for `n>=2`; target rewards consistently enter as `C-g`. |
| VC6-004 | 200--327 | Epsilon-complementary slackness is preserved by a bid; a complete partial permutation is a permutation; summing the contact inequalities gives normalized cost error at most `epsilon`; the cold bid and dense-work bounds follow. | Correct. For integer costs and `epsilon<1/n`, the unnormalized nonnegative integer gap is below one and therefore zero. |
| VC6-005 | 336--382 | Epsilon scaling rebuilds ownership while warm-starting the target potential, reaches `eta`, and uses `O(n^2)` bids and `O(n^3)` dense work per warm phase when consecutive tolerances differ by at most two. | Proposition and proof correct, including `R_C=0`. CH6-005 affects only the simplification at line 384. |
| VC6-006 | 403--440 | Restricting the target transform to finitely many sites gives the semi-discrete objective; active regions are Laguerre cells and become power cells for quadratic cost. | Correct. Closed cells cover but can overlap; a partition requires the tie-breaking already stated in the definition. |
| VC6-007 | 468--503 | In one dimension with a source density and strictly ordered sites, active indices are monotone; optimal cumulative target masses determine interval boundaries; square expansion gives the integrated-quantile formula. | Correct, including null endpoint conventions and arbitrary positive target weights. |
| VC6-008 | 507--557 | Splitting over tie-broken cells and differentiating active branches gives `partial_j E_0=b_j-alpha(L_j)` under almost-everywhere uniqueness; zero gradient is mass balance and complementary slackness certifies optimality. | Correct. No uniqueness of dual weights is asserted. CH6-002 concerns the later pseudocode. |
| VC6-009 | 619--699 | A sampled active index gives `b-e_j`; conditional unbiasedness plus the squared-distance recursion gives expected averaged gap `RG/sqrt(L)`. | Correct under the proposition's optimizer, bounded-supergradient, independence, and constant-step assumptions. `G<=2` is a valid loose bound. |
| VC6-010 | 738--782 | Compact-support quantization has a constructive `O(m^{-1/d})` upper bound; an upper density bound `rho<=rho_+` and a union-of-balls/layer-cake argument give the matching lower bound. | Proposition, exponent, and proof are correct. No lower density bound is used. CH6-004 concerns only the following empirical comparison. |
| VC6-011 | 788--842 | For fixed sites, powered OT cost is convex in target masses; optimizing free masses selects nearest sites and Voronoi weights; quadratic site gradient is `2a_j(y_j-bar x_j)`. | Correct under null boundaries and nonempty cells for centroid differentiation. Lloyd's two exact minimization steps are non-increasing but do not ensure a global minimum. |
| VC6-012 | 844--902 | The mass-preconditioned Lloyd ODE is `dot y_j=bar x_j-y_j`; along smooth portions, `dF/dt=-2 sum_j a_j|y_j-bar x_j|^2`; fixed labelled particle weights satisfy the stated continuity equation. | Correct as a piecewise-smooth/formal finite-particle calculation. CH6-001 distinguishes this flow from the cited Euclidean gradient-flow limit. |
| VC6-013 | 911--929 | The first variation of `G_rho=int rho sigma^{-r}` produces `partial_t sigma=-r div(sigma grad(rho/sigma^{r+1}))`; for constant `rho`, this is `-(r+1)Delta(sigma^{-r})`; constrained stationarity gives `sigma_* proportional to rho^{1/(r+1)}`. | Formal PDE sign, coefficient, boundary wording, and stationary exponent are correct. CH6-001 repairs the discrete normalization and dynamic attribution. |
| VC6-014 | 955--985 | Lloyd pseudocode uses deterministic nearest-index tie-breaking, centroid updates for nonempty cells, and fixed sites for empty cells. | Correct finite-budget descent implementation; it makes no unsupported convergence or global-optimality claim. |
| VC6-015 | 1006--1126 | Fixed equal masses require Laguerre rather than free Voronoi cells; in one dimension the optimum is the quantile-bin average, the exact variance decomposition and `1/12` constant follow, and the empirical quantile-process limit has the displayed Brownian-bridge constant. | Propositions and proofs correct under their finite-moment and `C^1` hypotheses. CH6-009 concerns only the subsequent prose and figure wording. |
| VC6-016 | 1156--1225 | For distance cost, the c-transform is 1-Lipschitz; every 1-Lipschitz `f` has `f^c=-f`; compact KR duality, the zero-mass signed norm, the finite all-pairs LP, and one-dimensional neighboring constraints follow. | Correct in the compact/finite settings. CH6-003 supplies the exact noncompact signed domain. |
| VC6-017 | 1241--1318 | Vector-measure total variation, distributional divergence sign, segment-current construction from an optimal coupling, TV estimate, feasibility, equality, and attainment in the Euclidean Beckmann formula. | Mathematical result and signs correct. The printed first inequality needs CH6-003's representative and cutoff details. |
| VC6-018 | 1329--1418 | Edge inequalities are equivalent to graph-geodesic Lipschitz constraints; with `div_G=-grad_G^*`, finite LP duality gives weighted edge `l1` flow; split arcs give transshipment/network-simplex form. | Correct for finite connected graphs with positive lengths and zero-sum source. Conditional `O(PM)` accounting does not claim polynomial simplex pivots. |

## Structural-unit matrix

Every physical source line belongs to exactly one row. Blank separators and index
commands are assigned to their surrounding unit.

| Current lines | Structural unit | Second-pass disposition |
|---:|---|---|
| 1--16 | Chapter heading, label `sec-semidiscr-w1`, overview | Checked; overview and citations resolve. |
| 17--57 | General measure semi-dual | VC6-001; CH6-006 at line 56. |
| 58--113 | Discrete semi-dual and supergradient proposition/proof | VC6-002; CH6-007 at lines 62--87. |
| 114--122 | Auction heading and explicit specialization | Uniform `n x n` assignment scope is explicit and valid. |
| 123--175 | Auction coordinate ascent and finite Laguerre cells | VC6-003; correct. |
| 176--278 | Bids, epsilon contacts, bidding algorithm, progression figure | VC6-003/004; correct, including the warning that bids need not increase `E_0`. |
| 279--329 | Fixed-tolerance auction theorem and proof | VC6-004; correct. |
| 330--391 | Epsilon scaling, theorem/proof, final comparison, Sinkhorn remark | VC6-005; CH6-005 at line 384. |
| 392--467 | Semi-discrete setup, finite transform, cells, first figure | VC6-006; CH6-008 is figure precision only. |
| 468--506 | One-dimensional semi-discrete OT | VC6-007; correct. |
| 507--618 | Mass balance, gradient proof, geometry, deterministic ascent | VC6-008; CH6-002 in Algorithm `alg:semidiscrete-laguerre-ascent`. |
| 619--725 | Stochastic semi-dual, rate proof, stochastic algorithm | VC6-009; correct. |
| 726--794 | Quantization definition, dimension-dependent rate, empirical comparison | VC6-010/011; CH6-004 at line 784. |
| 795--843 | Free masses, Voronoi reduction, centroid condition, Lloyd descent | VC6-011; correct. |
| 844--1005 | Continuous Lloyd flow, mean-field paragraph, Lloyd algorithm, two figures | VC6-012/013/014; CH6-001 at lines 911--919. |
| 1006--1145 | Fixed equal weights and one-dimensional deterministic/random rates | VC6-015; CH6-009 at lines 1128--1141. |
| 1146--1226 | `W_1`, distance transforms, KR norm, discrete forms | VC6-016; CH6-003 at line 1205. |
| 1227--1324 | Euclidean differential dual and Beckmann formulation/proof | VC6-017; CH6-003 at lines 1231--1237 and 1290--1299. |
| 1325--1422 | Graph geodesics, graph Beckmann, figure, network simplex | VC6-018; CH6-010 at line 1390. |

## Named and numbered environment matrix

The proof matrix below inventories every proof. This table contains every other
named or numbered definition, proposition, algorithm, figure, and remark,
including the one unlabeled auction/Sinkhorn remark.

| Current lines | Type and label/title | Disposition |
|---:|---|---|
| 27--46 | Definition `def-full-dual-functional` | Correct; CH6-006 is subsequent prose. |
| 96--98 | Proposition `prop-discrete-semidual-supergradient` | Correct; value-notation scope is CH6-007. |
| 200--210 | Definition `def-auction-eps-cs` | Correct orientation and normalization. |
| 213--239 | Algorithm `alg:auction-bidding` | Correct for `epsilon>0`, `n>=2`; cold theorem uses zero initialization. |
| 254--277 | Figure `fig:dual-auction-progression` | Verified against retained generator and diagnostics. |
| 282--308 | Proposition `prop-auction-termination` | Correct. |
| 336--360 | Algorithm `alg:auction-epsilon-scaling` | Correct. |
| 362--373 | Proposition `prop-auction-epsilon-scaling` | Correct; CH6-005 is later prose. |
| 386--391 | Remark `epsilon-scaling and relation with Sinkhorn` | Correct distinction between hard contacts and entropic smoothing. |
| 431--440 | Definition `def-laguerre-power-cells` | Correct and explicitly mentions tie-breaking. |
| 448--466 | Figure `fig:semidiscrete-laguerre-cells` | CH6-008. |
| 481--500 | Proposition `prop-semidiscrete-1d-quantile` | Correct. |
| 516--525 | Proposition `prop-semidiscrete-dual-gradient` | Correct under stated almost-everywhere uniqueness. |
| 564--579 | Figure `fig:semidiscrete-weight-gradient-cells` | Verified. |
| 581--610 | Algorithm `alg:semidiscrete-laguerre-ascent` | CH6-002. |
| 671--678 | Proposition `prop-semidiscrete-sgd-rate` | Correct conditional expected-value rate. |
| 702--723 | Algorithm `alg:semidiscrete-stochastic-ascent` | Correct explicit tie selection and gauge preservation. |
| 738--747 | Definition `def-optimal-quantization` | Correct; free sites and masses, with zero weights/coincident points allowed. |
| 752--763 | Proposition `prop-quantization-rate` | Correct under bounded support and upper density bound. |
| 799--818 | Proposition `prop-free-masses-voronoi` | Correct. |
| 933--953 | Figure `fig:semidiscrete-lloyd-flow-mixtures` | Verified. |
| 955--985 | Algorithm `alg:lloyd-quantization` | Correct tie and empty-cell policy. |
| 989--1004 | Figure `fig:semidiscrete-lloyd-quantization` | Verified. |
| 1043--1071 | Proposition `prop-1d-equal-weight-quantization` | Correct. |
| 1108--1117 | Proposition `prop-1d-random-quantile-process` | Correct. |
| 1132--1143 | Figure `fig:semidiscrete-quantile-quantization-rates` | CH6-009. |
| 1162--1170 | Definition `def-lipschitz-constant` | Correct extended-real convention. |
| 1172--1176 | Proposition `prop-w1-c-transform-lipschitz` | Correct in the finite-valued context used. |
| 1241--1252 | Definition `def-vector-measure-tv` | Correct dual norm for finite vector Radon measures. |
| 1254--1262 | Remark `rem-vector-measure-tv-density` | Correct absolutely continuous specialization. |
| 1273--1281 | Definition `def-beckmann-problem` | Correct whole-space constraint and sign. |
| 1283--1289 | Proposition `prop-euclidean-beckmann` | Correct result; printed proof needs CH6-003. |
| 1329--1336 | Definition `def-graph-geodesic-distance` | Correct for positive edge lengths. |
| 1339--1356 | Proposition `prop-graph-w1-beckmann` | Correct. |
| 1378--1395 | Figure `fig:w1-graph-transport-flow` | CH6-010 caption only. |
| 1397--1416 | Remark `rem-graph-w1-network-simplex` | Correct conditional complexity wording. |

## Proof matrix

| Current lines | Proposition proved | Adversarial line-by-line result |
|---:|---|---|
| 99--110 | Discrete semi-dual supergradient | Active-affine inequality, multiplication by nonnegative masses, target linear term, supergradient sign, and local unique-branch differentiability are correct. |
| 309--328 | Fixed-epsilon auction | Price lower bound before selection, persistent column occupancy, bid count, terminal permutation feasibility, dual certificate, dense scan cost, and strict integer-gap argument are correct. |
| 374--382 | Epsilon scaling | Cold first phase, cited warm component bound, consecutive-tolerance ratio, phase count, final certificate, and exactness transfer are correct. CH6-005 is outside the proof. |
| 501--503 | One-dimensional semi-discrete formula | Quantile partition and square expansion are exact; no factor `1/2` is missing for the stated cost. |
| 526--542 | Semi-discrete gradient | Difference quotient, almost-everywhere active-branch limit, domination on compact data, and cell-mass sign are correct. |
| 679--697 | Averaged stochastic rate | Squared-distance recursion, conditional expectation, concavity inequality, telescope, averaging, and optimized constant step give exactly `RG/sqrt(L)`. |
| 764--782 | Quantization rate | Grid-cover upper bound and upper-density union-of-balls/layer-cake lower bound give powered exponent `m^{-p/d}` and distance exponent `m^{-1/d}`. |
| 819--821 | Free masses imply Voronoi cells | Pointwise nearest-label minimization and induced target masses prove both inequalities. |
| 1072--1095 | One-dimensional equal-weight quantization | Independent bin minimization, strict scalar convexity, ordered bin averages, exact variance decomposition, uniform Taylor remainder, and Riemann-sum constant `1/12` are correct. |
| 1118--1126 | Random quantile-process asymptotic | Quantile representation, functional delta limit, stated uniform-integrability route, Brownian-bridge variance, and Fubini yield the constant. |
| 1177--1192 | Distance-cost c-transform | Reverse triangle inequality, diagonal test, sign `f^c=-f`, and c-concavity conclusion are correct. |
| 1290--1318 | Euclidean Beckmann | Weak dual inequality has the right sign; segment current is finite, feasible, and has TV at most transport cost; equality and attainment follow. The printed extension from compact smooth tests to general Lipschitz tests omits CH6-003's representative/cutoff argument. |
| 1358--1374 | Graph Beckmann | Edge-to-path telescoping, incidence adjoint sign, scalar conjugates, zero-sum feasibility, and finite LP strong duality are correct. |

## Display and standalone-math matrix

The following line starts exhaust all 108 source math blocks set on their own
lines, including the short standalone blocks used in pseudocode. Each start is
listed exactly once.

| Unit | Math-block start lines | Audit result |
|---|---|---|
| General/discrete semi-dual | 30, 39, 48, 65, 75, 89, 101 | Formulas and signs correct. Line 75 uses the probability-only value notation on mass `M`: CH6-007. Gauge prose after line 39 is CH6-006. |
| Auction coordinate/bids | 130, 144, 155, 163, 171, 179, 185, 203, 242, 249 | Correct `1/n` normalization, second-best threshold, target-potential sign, ties, and epsilon overshoot. |
| Auction certificates/scaling | 285, 289, 293, 304, 313, 367, 378 | Correct. CH6-005 concerns prose at line 384, not a display. |
| Semi-discrete setup and one-dimensional formulas | 407, 414, 422, 436, 473, 484, 488, 492 | Correct dimensions, target sums, transform orientation, interval endpoints, and factors. |
| Semi-discrete mass balance/deterministic algorithm | 511, 521, 528, 535, 545, 549, 593, 596, 604, 613 | Analytic displays correct. Algorithm blocks at 593 and 596 require CH6-002's disjoint tie selection. |
| Stochastic semi-dual | 624, 635, 644, 650, 654, 662, 673, 681, 691, 718 | Correct expectation, sampled supergradient, gauge sum, step conditions, constants, and update. Label at 624 is semantically stale but harmless. |
| Quantization rate/Voronoi/Lloyd statics | 740, 756, 768, 772, 789, 803, 812, 825, 835 | Correct free-mass definition, exponents, convexity-in-mass statement, Voronoi reduction, gradient, and centroid. CH6-004 is prose at line 784. |
| Lloyd flow | 848, 854, 859, 863, 871, 877, 884, 890, 894 | Correct preconditioned ODE, dissipation, labelled-particle continuity equation, and distinction from evolving Voronoi masses. |
| Mean field and Lloyd pseudocode | 908, 912, 922, 968, 972 | PDE display is formally correct; line 912 needs CH6-001's `m^{p/d}` normalization/context. Lloyd blocks are correct. |
| Fixed-weight quantization | 1010, 1018, 1024, 1030 | Correct distinction between fixed Laguerre masses and free Voronoi masses. |
| Scalar deterministic/random quantization | 1045, 1052, 1058, 1066, 1074, 1083, 1089, 1098, 1112, 1120 | Exact atom formula, decomposition, constants, and empirical limit are correct. CH6-009 is subsequent prose/figure wording. |
| `W_1` transforms and KR | 1164, 1179, 1197, 1211, 1219 | Correct compact and finite forms; line 1205's noncompact prose is CH6-003. |
| Euclidean `W_1`/Beckmann | 1233, 1245, 1256, 1265, 1275, 1286, 1292, 1302, 1309 | Line 1233 needs CH6-003's representative convention. Flux definitions, segment formula, equality display, and signs are correct; line 1292 applies first to compactly supported tests. |
| Graph `W_1`/Beckmann/network LP | 1332, 1343, 1348, 1366, 1402 | Correct edge dimensions, lengths, divergence signs, split-flow objective, and balances. |

## Algorithm audit matrix

| Algorithm | Objective and scope | Invariant/feasibility | Stopping, correctness, complexity | Result |
|---|---|---|---|---|
| `alg:auction-bidding`, 213--239 | Hard semi-dual for uniform square assignment; optional incoming target potential | Partial permutation; deterministic best/second-best selection; previous owner removed; epsilon-CS preserved | Stops when every row is assigned. The cold theorem proves finite bids, error certificate, and dense work from `g=0`; scaling supplies certified warm starts | Valid. It is intentionally not exact cyclic block maximization and need not monotonically increase `E_0`. |
| `alg:auction-epsilon-scaling`, 336--360 | Same unit assignment, tolerance continuation | Ownership resets each phase; target potential warm-starts; final `eta` phase always runs | Proposition proves phase count, final eta-CS, and exact integer recovery for `eta<1/n` | Valid. CH6-005 repairs only the parameter-free sentence at line 384. |
| `alg:semidiscrete-laguerre-ascent`, 581--610 | Deterministic cell-mass supergradient/ascent | Printed closed cells overlap at ties and need not sum to source mass | Tolerance and finite budget are explicit; no convergence theorem is asserted | CH6-002: add a disjoint selector or boundary-null hypothesis. Positive steps are understood from "steps"/"ascent" and are not retained as a separate defect. |
| `alg:semidiscrete-stochastic-ascent`, 702--723 | One sampled active cell per iteration | `min argmin` chooses one simplex vertex; each update has zero coordinate sum | Finite budget; preceding proposition covers the stated constant-step averaged setup. Naive active-site search is `O(m)` per sample | Valid. General step sequences are algorithm input, not an unproved convergence guarantee. |
| `alg:lloyd-quantization`, 955--985 | Free-mass quadratic quantization | Deterministic Voronoi selector; exact centroid for nonempty cells; empty site remains fixed | Fixed iteration budget; each assignment/centroid cycle is non-increasing; no finite-termination, rate, global-convergence, or global-optimality claim | Valid. Coincident sites and ties are defined by index selection. |

## Figure and generator matrix

All seven included PDFs exist as one-page retained outputs. They and their
notebooks were inspected read-only and were not regenerated. Notebook SHA-256
values identify the generators audited.

| Figure and source lines | Generator and SHA-256 | Retained parameters/diagnostics | Disposition |
|---|---|---|---|
| `fig:dual-auction-progression`, 254--277 | `notebooks-figures/dual-auction-progression.ipynb`; `51ef6c659890dab9cc3bb0dfe193a17f1ed19002f81f6228daf81bebc0546be6` | `n=36`, seed 2027, squared Euclidean cost, `epsilon=0.002`, milestones 0/10/40/98/505 bids; retained epsilon-CS checks pass; final objective `12.13332760` equals the independent assignment optimum | Cells, links, prices, iterate count, axes, and normalization verified. |
| `fig:semidiscrete-laguerre-cells`, 448--466 | `notebooks-figures/semidiscrete-laguerre-cells.ipynb`; `33de45e5bfe146ca0247b0e519132d176a93cad4440ad4b6761008d0b3cc54ae` | 21 sites, seed 612, three-Gaussian source, uniform targets, grid ascent 128 iterations; final mass `L1=0.03199022346398456` | CH6-008; geometry and progression otherwise verified. |
| `fig:semidiscrete-weight-gradient-cells`, 564--579 | `notebooks-figures/semidiscrete-weight-gradient-cells.ipynb`; `d97163bceca5efbc467550f95fce69df02ed504e8f6f361c9b2338189c3f8cda` | 13 sites; highlighted balanced mass `0.0770` versus target `0.0769`, underweight `0.0285`, overweight `0.2447`; all-cell balanced `L1=1.029e-02` | Expansion/shrinkage sign, dotted reference, coupling, and normalization verified; wording is appropriately qualitative. |
| `fig:semidiscrete-lloyd-flow-mixtures`, 933--953 | `notebooks-figures/semidiscrete-lloyd-flow-mixtures.ipynb`; `32cb9cbbf3d32f15b7ad2936e274e46b62749e47c01be1bc42e211e2bceabb2e` | 64 sites, relaxation `0.085`, 240 iterations; energy decreases `0.73099 -> 0.02899`; generator guards monotonicity | Caption correctly distinguishes biased initialization, target density, and non-transport-interpolation paths. |
| `fig:semidiscrete-lloyd-quantization`, 989--1004 | `notebooks-figures/semidiscrete-lloyd-quantization.ipynb`; `f6cc40eadcc04b017588b0b33ee4bb78594395b3e022c64ea106408035957137` | Same 21 initial sites and density as first Laguerre figure; snapshots 0/6/36; relaxed Lloyd updates | Cross-figure parameters, Voronoi cells, paths, and descent narrative verified. |
| `fig:semidiscrete-quantile-quantization-rates`, 1132--1143 | `notebooks-figures/semidiscrete-quantile-quantization-rates.ipynb`; `a135e751e7d06c94237f21f8aedd8a1ae98227934f655c2c08e8ffcd94e61d59` | Smooth positive law on `[0,1]`; 64 quadrature points/bin; Monte Carlo trials 775 down to 160; fitted constants `0.12157` and `0.13427` | CH6-009; plotted slopes and formulas verified. |
| `fig:w1-graph-transport-flow`, 1378--1395 | `notebooks-figures/w1-graph-transport-flow.ipynb`; `c277aa8e179a1f80cc77a4b320ff9bb4529565ed5e768cdb72e4d3fed5247955` | Regular graph: 56 vertices/155 edges/20 active fluxes, cost `2.14905945`; nonuniform: 144/418/36, cost `2.46512788`; six positive/six negative nodes; primal divergence and independent dual values agree | CH6-010 only; graph geometry, source signs, axes-free display, objective normalization, and flow constraints verified. |

## Label, cross-reference, and bibliography matrix

### Local labels

The chapter defines 66 labels. They are all unique. The chapter contains 58
reference commands resolving to 42 distinct labels; every reference resolves in
the retained source tree.

| Class | Labels with current definition lines | Check |
|---|---|---|
| Structural (5) | `sec-semidiscr-w1` 8; `sec-semi-dual` 17; `sec-auction-dual-ascent` 117; `sec-optimal-quantization` 729; `sec-W1` 1151 | Unique and resolved. |
| Equations (26) | `eq-full-dual-functional` 30; `eq-semi-dual` 39; `eq-discrete-semi-dual` 75; `eq-auction-semidual` 130; `eq-auction-discrete-laguerre` 144; `eq-auction-coordinate-derivative` 155; `eq-auction-bid` 163; `eq-auction-reduced-costs` 179; `eq-auction-dual-update` 185; `eq-auction-epsilon-cs` 203; `eq-auction-cost-certificate` 293; `eq-disc-c-transfo` 414; `eq-semi-dual-discr` 422; `eq-laguerre-cells` 436; `eq-semidiscrete-1d-laguerre-cells` 473; `eq-semidiscrete-1d-w2-uniform` 492; `eq-semi-disc-energy` 511; `eq-semi-disc-energy-entropy` 624; `eq-sgd` 644; `eq-step-size-sgd` 662; `eq-optimal-quantization` 740; `eq-lip-constant` 1164; `eq-w1-metric` 1197; `eq-w1-discr` 1211; `eq-w1-cont` 1233; `eq-w1-cont-div` 1286 | Unique and resolved. `eq-semi-disc-energy-entropy` is a stale semantic name for an unregularized expectation identity; it has no use site and no reader-visible effect. Rename opportunistically, but it is not counted as a defect. |
| Definitions (8) | `def-full-dual-functional` 27; `def-auction-eps-cs` 200; `def-laguerre-power-cells` 431; `def-optimal-quantization` 738; `def-lipschitz-constant` 1162; `def-vector-measure-tv` 1241; `def-beckmann-problem` 1273; `def-graph-geodesic-distance` 1329 | Unique and resolved. |
| Propositions (13) | `prop-discrete-semidual-supergradient` 96; `prop-auction-termination` 282; `prop-auction-epsilon-scaling` 362; `prop-semidiscrete-1d-quantile` 481; `prop-semidiscrete-dual-gradient` 516; `prop-semidiscrete-sgd-rate` 671; `prop-quantization-rate` 752; `prop-free-masses-voronoi` 799; `prop-1d-equal-weight-quantization` 1043; `prop-1d-random-quantile-process` 1108; `prop-w1-c-transform-lipschitz` 1172; `prop-euclidean-beckmann` 1283; `prop-graph-w1-beckmann` 1339 | Unique and resolved. |
| Algorithms (5) | `alg:auction-bidding` 213; `alg:auction-epsilon-scaling` 336; `alg:semidiscrete-laguerre-ascent` 581; `alg:semidiscrete-stochastic-ascent` 702; `alg:lloyd-quantization` 955 | Unique and resolved. |
| Figures (7) | `fig:dual-auction-progression` 276; `fig:semidiscrete-laguerre-cells` 465; `fig:semidiscrete-weight-gradient-cells` 578; `fig:semidiscrete-lloyd-flow-mixtures` 952; `fig:semidiscrete-lloyd-quantization` 1003; `fig:semidiscrete-quantile-quantization-rates` 1142; `fig:w1-graph-transport-flow` 1394 | Unique and resolved. |
| Remarks (2) | `rem-vector-measure-tv-density` 1254; `rem-graph-w1-network-simplex` 1397 | Unique and resolved. The auction/Sinkhorn remark at line 386 is intentionally unlabeled. |

### Imported references and conventions

| Imported source/label(s) | Chapter use | Second-pass check |
|---|---|---|
| `sec-dual`, `eq-dual-generic`, `def-c-transform`, `sec-c-transfo` | Compact duality, transform definitions, semi-dual elimination | Function spaces, feasibility sign `f+g<=c`, and `bar c` orientation agree. |
| `sec-sinkhorn-local-acceleration` | Parallel `D_epsilon/E_epsilon` notation | `D_0/E_0` consistently means hard/unregularized dual and source-eliminated semi-dual. |
| `def-discrete-kantorovich-problem`, `eq-kanto-discr` | Discrete value `MKD_C` | Imported domain is `simplex_n x simplex_m`; chapter's mass-`M` use is CH6-007. |
| `def-permutation-matrices`, `prop-assignment-dual-certificate`, `fig-matching-2d-cost-exponent` | Auction coupling normalization, certificate, comparison figure | A permutation represents probability coupling `P/n`; contact orientation and normalized objective agree. |
| `prop-1d-quantile-map`, `prop-wass-quantile-1d`, `eq-w1-1d` | One-dimensional cells, quadratic formula, cumulative `W_1` | Generalized inverse and monotone rearrangement conventions agree. |
| `prop-continuous-complementary-slackness` | Semi-discrete mass-balance certificate | Contact-map conclusion has the right direction and cost equality. |
| `prop-lagrangian-flow-continuity`, `sec-dynamic-optimal-transport`, `sec-wasserstein-gradient-flows` | Labelled particle continuity equations and gradient-flow viewpoint | Continuity-equation sign agrees. CH6-001 concerns which particle metric has the cited continuum limit, not this imported proposition. |

No unresolved local or imported reference was found. The retained build artifacts
contain all cited bibliography entries.

## Citation-sensitive claim matrix

The chapter contains 23 citation commands using 27 distinct bibliography keys.
Every key is present in `OT4ML/all.bib` and the retained `OT4ML/OT4ML.bbl`.
Primary-source checking was bounded to claims material to correctness; no claim
below relies solely on a secondary summary where a checked primary treatment was
available.

| Current lines | Citation keys | Claim audited | Disposition |
|---:|---|---|---|
| 10 | `bertsekas1992auction`, `bertsekas1988dual`, `AurenhammerHA98`, `Merigot11`, `merigot2013comparison`, `kantorovich1958space`, `Beckmann52` | Chapter-level map from semi-duals to auction/Laguerre and from KR to flow | Appropriate overview attribution. |
| 119, 174 | `merigot2020optimaltransportalgorithms`, `bertsekas1981new`, `bertsekas1988dual`, `bertsekas1992auction` | Auction coordinate threshold, epsilon overshoot, and scaling lineage | Checked formulas match after reversing the source's price sign to the chapter's target-reward convention. |
| 377 | `merigot2020optimaltransportalgorithms` | Warm-start component movement and phase bid bound | The cited lemma supports `n(lambda+epsilon)` component movement and `n^2(1+lambda/epsilon)` bids. |
| 612 | `aurenhammer1987power`, `AurenhammerHA98`, `Merigot11` | Power diagrams, computational geometry, lifted triangulations | Geometry and attribution correct. |
| 616 | `chan1996optimal` | Output-sensitive three-dimensional hull time `O(m log Q)` | Correctly restricted to planar source/3D lift; the text explicitly declines to extend it to a 4D lift. |
| 670, 699 | `nemirovski2009robust`, `genevay2016stochastic`, `Merigot11` | Averaged stochastic-supergradient rate and semi-discrete use | Bound is also proved directly and is correct under the displayed assumptions. |
| 748 | `graf2000foundationsquantization`, `Lloyd82` | Classical status of quantization | Appropriate. |
| 784 | `graf2000foundationsquantization` | Zador refinement and comparison with empirical OT | Zador attribution is appropriate for deterministic quantization; the universal empirical-rate sentence is not supported and is false: CH6-004. |
| 842 | `Lloyd82`, `ArthurVassilvitskii2007` | Lloyd/k-means and expected logarithmic k-means++ approximation | Correctly restricted to finite data and squared Euclidean loss. |
| 911 | `graf2000foundationsquantization` | High-resolution effective energy | Energy shape correct; missing `m^{-p/d}` normalization is CH6-001. |
| 919 | `caglioti2015gradient`, `iacobelli2019asymptotic`, `caglioti2018quantization2d`, `iacobelli2019weighted` | Rigorous one-dimensional dynamics and related diffusion/lattice/PDE work | The checked one-dimensional primary source treats ordinary Euclidean site gradient flow after metric/time rescaling, not the preceding mass-preconditioned Lloyd flow: CH6-001. Related-work descriptions are otherwise consistent with the cited scopes. |
| 1039 | `graf2000foundationsquantization` | Scalar equal-weight bin averages | Correct and explicitly distinguishes midpoint quantiles. |
| 1125 | `vanDerVaartWellner1996`, `BobkovLedoux2019EmpiricalKantorovich` | Uniform quantile process, functional delta method, expectation limit | The chapter's `C^1` bounded-derivative hypothesis and stated uniform-integrability route support the conclusion. |
| 1128 | `dereich2013constructive`, `fournier2015rate`, `weed2017sharp` | Broader empirical OT sample complexity | Appropriate as broad context only; it does not rescue line 784's universal equality of rates. CH6-009 handles the local scale wording. |
| 1205 | `kantorovich1958space` | KR norm on finite zero-mass signed measures | Compact claim correct. Exact noncompact total-variation moment and representatives are CH6-003. |
| 1320 | `Beckmann52`, `SantambrogioBook` | Continuous Beckmann formulation | Formula and sign correct; chapter provides a nearly complete direct proof, with CH6-003's cutoff repair. |
| 1411 | `bertsekas1988dual`, `Orlin1997` | Network simplex/transshipment | Correct basis-cycle description and conditional `O(PM)` accounting; no unsupported polynomial pivot claim. |
| 1418 | `Beckmann52`, `peyre2026robust` | Graph transshipment and flow-Sinkhorn variants | Graph analogy and recent flow-Sinkhorn attribution agree with retained primary material. |

## Notation, dimension, and normalization audit

| Topic | Check performed | Result |
|---|---|---|
| `D_0/E_0` | Compared hard full dual, eliminated semi-dual, and imported positive-temperature notation | Consistent throughout. |
| Transform orientation | Checked `g^{bar c}(x)=inf_y(c(x,y)-g(y))` against `f+g<=c` in general, finite, auction, and semi-discrete forms | Correct signs and variables. |
| Gauge | Checked common shifts against source and target total masses and stochastic coordinate sums | Invariance correct; CH6-006 repairs the uniqueness implication. |
| Discrete total mass | Compared lines 62--87 with imported simplex-only `MKD_C` definition | CH6-007. All formulas themselves are homogeneous. |
| Auction normalization | Traced `P/n`, semi-dual `1/n`, normalized error `epsilon`, and unnormalized integer gap `n epsilon` | Correct. |
| Auction price/reward sign | Followed selected target update and reduced costs through epsilon-CS and the cited price convention | Correct: decreasing chapter `g_j` corresponds to increasing auction price. |
| Laguerre sign | Checked cells minimize `c-g`, increasing `g_j` expands cell, and gradient is prescribed minus captured mass | Correct in text and figures. |
| Power-diagram dimension | Expanded squared cost and checked lift dimension and Chan bound | A 2D source lifts to 3D; the special `O(m log Q)` claim is not extended to 3D source/4D lift. |
| Free versus fixed masses | Compared Definition `def-optimal-quantization`, free Voronoi reduction, and equal-weight section | Correctly separated: free masses use Voronoi cells; prescribed equal masses use Laguerre cells. |
| Quantization exponent | Checked `p`-power distortion, `W_p` root, high-resolution `r=p/d`, and quadratic `p=2` | Proposition exponents correct; CH6-001 supplies the omitted `m^{p/d}` normalization. |
| Empirical-rate normalization | Compared line 784 with exact scalar formulas | CH6-004. |
| Centroid gradient/flow | Recomputed shape derivative away from null boundaries | `grad_{y_j}F=2a_j(y_j-bar x_j)` and Lloyd preconditioner `(2a_j)^{-1}` are correct. |
| Scalar constants | Recomputed interval variance and Brownian-bridge integrals | `1/12`, `u(1-u)`, squared versus unsquared exponents are correct in the propositions; CH6-009 repairs prose. |
| `W_1` signed source | Traced `xi=alpha-beta` through KR, divergence, segment current, and graph incidence | Signs are consistent with `div=-grad^*`. |
| Sobolev/Lipschitz representative | Tested raw equivalence classes against atomic measures | CH6-003. |
| Graph dimensions | Checked `N=|V|`, `M=|E|`, incidence rank, split arcs, and objectives | `2M` nonnegative variables and `N-1` independent balances for a connected graph; correct. |

## Topology, regularity, integrability, and attainment audit

| Setting | Required or used hypotheses | Second-pass conclusion |
|---|---|---|
| General semi-dual | Imported compact metric spaces, continuous finite cost, probability measures | Continuous transforms and Kantorovich dual attainment apply. Gauge invariance does not establish uniqueness: CH6-006. |
| Discrete semi-dual | Finite supports, finite real costs, nonnegative equal masses | Piecewise-affine concave dual and superdifferential correct; finite LP duality supplies attainment modulo gauges/flat directions. Value notation for mass `M` is CH6-007. |
| Auction | Finite real `n x n` matrix, `n>=2`, positive tolerance; integer entries only for exact recovery | Best and second-best values exist, finite termination is proved, and no rational-cost exact-recovery theorem is claimed. |
| Semi-discrete dual | Compact source setting inherited from Chapter `sec-dual`, finite distinct target sites, positive weights, continuous cost | Finite-dimensional dual maximum is inherited. No general uniqueness of weights is claimed; gauge remains. |
| Semi-discrete differentiability | Unique active site `alpha`-almost everywhere at the evaluated weight | Correct and sharper than atomlessness. Atomic or degenerate ties require a selected supergradient; CH6-002 repairs pseudocode. |
| One-dimensional semi-discrete | Source density and finite second moment; strictly ordered sites | Quantile boundaries, induced map, and cost formula hold up to null endpoints. |
| Stochastic rate | Maximizer exists; samples independent/conditionally unbiased; bounded sample supergradient; constant horizon-dependent step | Correct expected objective-gap result, not a blanket almost-sure convergence theorem. |
| Quantization rate | Probability density supported in a bounded set and bounded above by `rho_+` | Both sides of `Theta(m^{-1/d})` follow. A lower density bound is neither stated nor needed. |
| Lloyd differential calculus | Null Voronoi boundaries and positive cell mass for each differentiated centroid | Correct locally. Empty-cell policy is explicit; continuous flow is formal across combinatorial events. |
| Mean-field paragraph | High-resolution site density, regular positive densities, and formal periodic/no-flux PDE setting | PDE variation correct; normalization and finite-particle metric attribution are CH6-001. |
| Scalar quantization | Finite second moment for exact bin formula; `Q in C^1([0,1])` for asymptotics | Propositions correct. Positive two-sided rate wording additionally needs nonconstant `Q`: CH6-009. |
| Compact KR | Compact metric space, probability measures; normalized Lipschitz family for compactness | Maximum is attained after fixing a value; finite zero-mass signed Radon measures form the exact norm domain. |
| Noncompact KR | Pointed metric/Polish setting, zero total mass, normalized Lipschitz tests, finite `int d(x,x_0)d|xi|` | Source sentence is underspecified: CH6-003. |
| Euclidean Beckmann | Probability measures on all `R^d` with finite first moments; finite vector Radon measures | Optimal coupling and segment current give an attaining flux. No physical boundary is present. Printed dual passage needs CH6-003's cutoff. |
| Graph Beckmann | Finite connected graph, positive edge lengths, zero-sum source vector | Feasibility, finite LP strong duality, and primal/dual attainment hold. |

## Boundary, ties, empty cells, and equality-case audit

| Case | Source treatment | Result |
|---|---|---|
| Additive gauges | General and semi-discrete objectives are shift invariant | Correct invariance; CH6-006 removes an overstrong uniqueness reading. |
| Discrete active ties | Proposition selects one minimizer and later mentions convex splitting | Correct full superdifferential description. |
| Auction ties | Deterministic best and second-best targets plus epsilon overshoot | Correctly prevents zero-bid jamming while preserving epsilon-CS. |
| Deterministic semi-discrete ties | Closed cells are integrated without the definition's selector | CH6-002. |
| Atomic source and prescribed cell masses | A deterministic map may not split an atom | No theorem falsely promises existence of such a map, but the deterministic algorithm must use a selected supergradient or allow split ties. |
| One-dimensional endpoints | Half-open bins and `Q(0)=-infinity`, `Q(1)=+infinity` conventions | Harmless under a source density; changes occur only on null/outside-support sets. |
| Empty Laguerre/Voronoi cells | Dual mass component remains defined; centroid division needs positive mass | Lloyd keeps an empty site's old position; no division by zero occurs in pseudocode. |
| Coincident Lloyd sites | Index tie-breaking gives a partition and can empty later cells | Defined; no unsupported stationarity/convergence conclusion. |
| Auction `n=1` | Excluded from second-best code and declared immediate | Correct. |
| Auction `R_C=0` | Scaling returns immediately | Correct. |
| Integer exactness boundary | Strict `eta<1/n` | Correct; `<=` would not force an integer gap below one. CH6-005 concerns only how `eta` is chosen for the simplified complexity. |
| Quantization density degeneracy | Proposition assumes an absolutely continuous probability with finite upper density | Lower rate proof remains valid even if density vanishes on subsets; prior-report lower-density wording was removed. |
| Constant quantile | Both deterministic and empirical errors can be identically zero | Propositions allow the zero constants; post-theorem "order" wording needs CH6-009's qualification. |
| Sobolev null-set values | Raw class is integrated against singular `xi` | CH6-003. |
| Whole-space Beckmann boundary | Divergence tests are compactly supported on `R^d` | No boundary/no-flux term is needed. Extending the weak inequality to global Lipschitz tests needs a cutoff: CH6-003. |
| Mean-field boundary | Periodic or no-flux is explicitly stated | Correct formal integration-by-parts setting. |
| Zero-length transport segment | Segment vector is zero when `x=y` | Well-defined and cost-free. |
| Graph source sign | Positive flow on an oriented edge gives surplus at its declared tail under `div_G=-grad_G^*` | Formula, LP, and retained figure signs agree. |
| Disconnected graph | Proposition assumes connectedness | Correct; otherwise zero sum on each component would be needed. |

## Complexity and rate audit

| Claim | Independent derivation or qualification | Result |
|---|---|---|
| Cold auction bids | Each selected target drops by at least `epsilon`; before selection it is at least `-R_C` while an unassigned zero-potential target exists | At most `n(floor(R_C/epsilon)+1)` bids; correct for the stated cold initialization. |
| Cold dense operations | One `O(n)` row scan per bid, constant ownership updates | `O(n^2(1+R_C/epsilon))`; correct. |
| Scaling phases | First cold phase at cost scale, then halving with ratio at most two | `1+ceil(log_2^+(R_C/eta))` phases and `O(n^3)` dense work per warm phase; correct. |
| Exact integer scaling | Gap is integer and below `n eta` | Exact for every `eta<1/n`; simplified logarithm needs `eta=Theta(1/n)`: CH6-005. |
| Auction versus Hungarian/network methods | Auction claim is scoped to square assignment; graph section separately treats min-cost transshipment | No unsupported Hungarian bound is assigned. Weighted transportation auction is RQ6-001. |
| Power diagram | Planar source gives 3D lifting with output size `Q` | Cited `O(m log Q)` bound is correctly dimension-limited. |
| Stochastic semi-dual | Standard averaged supergradient telescope | Expected objective gap `O(L^{-1/2})`; active-site search is naively `O(m)` per sample. No wall-clock acceleration is claimed. |
| Deterministic quantization | Covering and union-of-balls arguments | Best `W_p` distortion is `Theta(m^{-1/d})` under the proposition's assumptions. |
| Empirical OT comparison | Exact 1D quadratic counterexample | Universal `m^{-1/d}` comparison is false: CH6-004. |
| Lloyd | Exact assignment and centroid updates | Monotone descent only; no finite termination, rate, or global convergence claimed for continuous sources. |
| Mean-field dynamics | Euclidean site gradient versus mass-preconditioned Lloyd velocity | Metric/time normalization must be separated: CH6-001. |
| Dense discrete KR | All unordered support pairs impose Lipschitz inequalities | `O(N^2)` constraints; correct. |
| Graph Beckmann LP | One signed edge variable or two nonnegative arc variables per edge | `O(M)` variables and `N-1` independent balances; correct sparse reduction. |
| Network simplex | Pricing `O(M)` and sparse-tree updates `O(N)` per pivot | Conditional `O(PM)` for `P` pivots is correctly qualified; arbitrary pivot count is not claimed polynomial. |

## Original prioritized repair order (completed)

The following was the repair order at audit time. Every item has now been
implemented and is cross-referenced in the correction ledger above.

1. **CH6-003:** make `eq-w1-cont` a normalized continuous-Lipschitz optimization, state the total-variation first moment, and add the Beckmann cutoff passage.
2. **CH6-001:** insert `m^{p/d}` and separate Euclidean gradient-flow scaling from mass-preconditioned Lloyd flow.
3. **CH6-002:** make deterministic Laguerre mass cells a disjoint selected partition or state a boundary-null hypothesis.
4. **CH6-004:** replace the universal empirical-rate identity by a regime-qualified comparison and point to the chapter's one-dimensional counterexample.
5. **CH6-007:** align the discrete value notation with either probability mass or an explicitly defined equal-mass extension.
6. **CH6-005:** choose a concrete final tolerance such as `eta=1/(2n)` before simplifying the exact auction complexity.
7. **CH6-006:** replace the gauge/uniqueness sentence by an invariance statement with a nonuniqueness caveat.
8. **CH6-008:** label the retained Laguerre balancing as approximate or disclose its residual.
9. **CH6-009:** align quantile geometry, squared/unsquared rate language, nondegeneracy, and Monte Carlo wording.
10. **CH6-010:** align the graph caption with the affine normalized square-root width map.

## Audit-baseline mechanical reconciliation (historical)

### Finding and ID reconciliation

- Established defect IDs are unique and contiguous: `CH6-001` through `CH6-010`.
- Severity membership is exact: Critical `{}`; Major `{}`; Moderate
  `{CH6-001, CH6-002, CH6-003, CH6-004}`; Minor
  `{CH6-005, CH6-006, CH6-007, CH6-008, CH6-009, CH6-010}`.
- Arithmetic is exact: Critical 0 + Major 0 + Moderate 4 + Minor 6 = 10.
- Scope-question IDs are unique and contiguous: `RQ6-001` through `RQ6-003`;
  all three are excluded from defect totals.
- Validated-correct IDs are unique and contiguous: `VC6-001` through
  `VC6-018`.
- Prior-report reconciliation is explicit in the second-pass mapping table. No
  root finding was dropped; one false-positive subclaim was removed, two
  severities were reduced, and two missed findings were added.
- Duplicate symptoms are merged by root cause: normalization and particle metric
  are one mean-field finding; Sobolev representatives, signed domain, and cutoff
  are one KR/Beckmann finding; scalar geometry, rate units, degeneracy, and Monte
  Carlo provenance are one post-theorem/figure finding.

### Inventory reconciliation

- The structural matrix has 19 disjoint consecutive rows covering every source
  line from 1 through 1,422 with no gap or overlap.
- The environment inventory contains all 36 named/numbered non-proof
  environments: 8 definitions, 13 propositions, 5 algorithms, 7 figures, and 3
  remarks (one auction remark is unlabeled).
- The proof matrix contains all 13 proof environments.
- The display matrix contains all 108 standalone math-block starts exactly once.
- The figure matrix contains all 7 included figures and all 7 generators.
- The source has 66 unique local labels: 5 structural, 26 equation, 8 definition,
  13 proposition, 5 algorithm, 7 figure, and 2 labeled remark labels.
- The source has 58 reference commands resolving to 42 distinct labels; none is
  unresolved.
- The source has 23 citation commands using 27 distinct keys; all keys resolve in
  both the bibliography database and retained bibliography output.
- The stale but harmless internal equation-label name at line 624 is explicitly
  recorded and excluded from defect totals; no label or citation issue is hidden
  in an `RQ6-*` item.

### Audit-baseline source-byte reconciliation

The following hashes certify the read-only baseline used to derive the
findings. They are intentionally not hashes of the corrected source.

- Audited source: `OT4ML/sections/semidiscr-w1.tex`.
- Initial second-pass physical size: exactly 1,422 lines and 80,542 bytes.
- Final second-pass physical size: exactly 1,422 lines and 80,542 bytes.
- Initial SHA-256:
  `a7cd404faf7eabccc51ab6a9984d76ba4ec6103df354f3aca24f7f2acd0cf1bb`.
- Final SHA-256:
  `a7cd404faf7eabccc51ab6a9984d76ba4ec6103df354f3aca24f7f2acd0cf1bb`.
- Initial and final hashes are identical. The chapter source remained
  byte-for-byte unchanged.

### Audit-baseline report and write-scope reconciliation

The following records the scope of the independent audit before the correction
pass began. It is superseded, for current modified files, by the validation
section below.

- Final report serialization: exactly 0728 physical lines and 073996 bytes.
- The report is ASCII-only and contains exactly 10 `CH6-*` finding headings, 3
  `RQ6-*` headings, and 18 validated-ledger rows.
- The report contains no placeholder, unfinished note, unresolved ID, duplicate
  finding heading, or unreconciled severity.
- The only workspace file modified during this second-round audit is
  `audit-chap6.md`.
- The chapter source, imported chapters, bibliography, notebooks, figures,
  retained outputs, assets, and generated book files were read-only. Bounded
  temporary diagnostics were written only under `/tmp`.
- The pre-existing Git-modified state of
  `OT4ML/sections/semidiscr-w1.tex` was preserved. The report was already present
  and untracked at second-pass entry and remains the sole audit output.
- No commit or push was performed.

## Post-correction validation - 2026-08-26

- Resolution count: 10 of 10 established findings resolved; no `CH6-*` item
  remains open.
- Corrected source: `OT4ML/sections/semidiscr-w1.tex`, 1,433 physical lines and
  83,328 bytes, SHA-256
  `fb0c9630db6a9c98e0b5e2f339c954b9206270513e562cf9bf9332f34c852efc`.
- An isolated clean `latexmk` build completed successfully and stabilized at
  486 pages. The log contains no LaTeX error, fatal error, emergency stop,
  undefined citation/reference, multiply-defined label, or overfull box.
- Chapter 6 was rendered in full, with the pages containing the
  corrected algorithm, high-resolution limit, scalar-quantization figure,
  noncompact Kantorovich--Rubinstein dual, Beckmann proof, and graph caption
  inspected again at high resolution. No clipping, blocked environment, or malformed
  display was found. The only chapter-scoped layout diagnostic is one harmless
  underfull vertical box near printed page 109.
- `git diff --check` passes for the corrected source and this report.
- The pre-existing unrelated worktree changes were not modified. No figure
  generator or retained asset was regenerated, and no commit or push was
  performed.
