# Second Adversarial Audit of Chapter 4: Wasserstein Space

## Scope and method

This report is a fresh second-pass audit of the current on-disk source
`/Users/gpeyre/Dropbox/github/ot4ml/OT4ML/sections/wasserstein-space.tex`.
It audits neither Git HEAD nor an earlier source version. The source had a
pre-existing dirty Git state and was treated as immutable. The first-pass report was
used only as a register of hypotheses to attack, not as authority for any conclusion.

The pass re-read all 1,427 physical source lines, reconstructed the chapter inventory,
re-derived every substantive result, and inspected the imported definitions and proofs
needed for disintegration, optimal-plan existence, atomless Monge recovery,
completeness/compactness, empirical Wasserstein rates, conditional/quotient/conic/GW
cross-references, push-forwards, and measurable optimal-kernel selection. It also
checked all bibliography keys, primary sources for citation-sensitive assertions, and
all four figure generators and retained panels read-only. Numerical diagnostics were
bounded and kept in memory or `/tmp`; no notebook or asset was rerun in place.

The adversarial phase separately tested each old `CH4-001` through `CH4-008`, searched
for omitted defects, then performed a final reread to merge common causes and remove
false mathematical interpretations. In particular, it distinguishes value duality
from optimizer existence, a feasible coupling's cost from the optimal transport cost,
and mathematical defects from numerical provenance or citation defects.

Baselines at the start of this pass:

| Artifact | Physical lines | Bytes | SHA-256 |
|---|---:|---:|---|
| Chapter source | 1,427 | 89,276 | `4c7e46a906dd8e50ed710d0655af31bef0f22cbb43d301cef2bfae6199c202a0` |
| First-pass report | 808 | 59,644 | `c74e159731806bd7baa5d4966fd09aac43022270239632ed2e24a50b957203aa` |

## Correction pass - 2026-08-26

All nine defects identified below have been corrected in the current manuscript.
The original findings are retained verbatim as an audit trail; this table records the
implemented resolution rather than replacing the mathematical diagnosis.

| ID | Status | Implemented correction |
|---|---|---|
| `CH4-001` | Resolved | Replaced the informal empirical-DRO identity by Proposition `prop-empirical-wasserstein-dro-duality`, with a Polish state space, finite `p`, positive radius, Borel measurability, nominal integrability, and an explicit finite upper `p`-growth condition. The proposition now separates weak dualization from strong duality, states dual attainment, treats `rho=0` separately, and no longer presents a nonattained supremum as a worst perturbation. |
| `CH4-002` | Resolved | Restricted `W_infinity` to Borel laws on a Polish metric space, called it an extended distance, and added Proposition `prop-wasserstein-infinity-metric`. Its proof establishes exact threshold attainment, the extended metric axioms by gluing, finite-distance components, and the bounded-space `p -> infinity` limit. Added the missing `rho >= 0` hypothesis to the empirical robust-envelope result and reused the new attainment theorem in its proof. |
| `CH4-003` | Resolved | Identified Figure `fig:kantorovich-dro-ambiguity` as a projected deterministic adversarial-training heuristic. The prose and caption now state that the displayed pointwise coupling has RMS cost `rho`, hence only certifies `W_2 <= rho`, and explicitly disclaim a certificate for the unrestricted inner DRO problem. |
| `CH4-004` | Resolved | Recast Proposition `prop-rel-wass-tv` as a Kantorovich value for the measurable `0/1` cost on a standard Borel space. The genuine `W_p^p` interpretation is now restricted to countable spaces with their Polish discrete topology. |
| `CH4-005` | Resolved | Replaced the global-invariance citation by the direct EMNLP 2018 source, Alvarez-Melis and Jaakkola, *Gromov-Wasserstein Alignment of Word Embedding Spaces*, and added its complete bibliography entry. |
| `CH4-006` | Resolved | Corrected Remark `rem-gluing-metric-engine`: the unbalanced homogenization proof is now described through disintegration and conditional Jensen, while literal gluing is reserved for the metric arguments that actually use it. |
| `CH4-007` | Resolved | Declared `Q,K in R^{r x d}` and `V in R^{d x d}` explicitly in both the discrete and mean-field attention formulations, making matrix products, operator norms, measurability, and compact-support integrability formal. |
| `CH4-008` | Resolved | Stated the bounded-space comparison for `p<q` and handled `p=q` as an identity. Treated the singleton finite-space case before defining the off-diagonal minimum, and assumed at least two points in the nontrivial TV comparison. |
| `CH4-009` | Resolved | Quantified the general particle-polynomial estimate for `n>=1` and restricted the imported `r_{n,p,d}` rate to `n>=2`, exactly matching its definition. |

Files changed by this correction pass: `OT4ML/sections/wasserstein-space.tex`,
`OT4ML/all.bib`, and this audit ledger. Build and consistency checks are recorded in
the validation note at the end of this report.

## Audit executive summary (pre-correction)

Defects identified in the audited baseline:

| Severity | Count |
|---|---:|
| Critical | 0 |
| Major | 0 |
| Moderate | 2 |
| Minor | 7 |
| **Total** | **9** |

The chapter's central mathematics survives review. The finite-`p` Wasserstein metric,
optimal-plan geodesics, Monge relaxation, weak-plus-moment topology, CLT normalization,
Stone--Weierstrass argument, empirical approximation proof for its stated imported
rate range, measure-map stability, compact-support attention estimate, and Markov and
convolution bounds are correct.

The baseline contained two Moderate defects. The exact finite-`p` DRO dual was hidden behind an
undefined phrase that conflates strong duality, finiteness, and several distinct forms
of attainment. The `W_infinity` endpoint is stated on arbitrary metric spaces although
its exact sublevel equivalence, metric proof, and `p -> infinity` limit need a standard
topological setting, and its possible value `+infinity` makes it an extended metric.

The baseline contained seven Minor defects. The DRO figure's numerical identity is correct for its
displayed deterministic coupling, so the old mathematical allegation is rejected;
the residual issue is failure to identify the restricted heuristic and the fact that
the actual empirical `W_2` is smaller. The other Minor findings concern the TV
domain, a mismatched word-embedding citation, an inaccurate imported conic-proof
description, implicit rather than stated matrix assumptions in attention, two
degenerate comparison cases, and an `n=1` rate whose imported symbol is defined only
for `n>=2`.

One research/scope question, `RQ4-001`, is excluded from all defect totals. No old ID
is retired: `CH4-003` is retained only as a narrowed numerical-provenance issue, not as
the first report's claim that the caption equates its coupling cost with `W_2`.

## Second-pass disposition of CH4-001 through CH4-008

| ID | First-pass severity | Second-pass disposition | New severity | Adversarial rationale |
|---|---|---|---|---|
| CH4-001 | Moderate | Retained and narrowed | Moderate | The cited Gao--Kleywegt theorem permits measurable losses for positive radius under integrability and finite growth rate, so upper semicontinuity is not necessary for value duality. It is needed in common optimizer/pointwise-attainment results. The chapter still fails to state any exact theorem and silently includes `rho=0`. |
| CH4-002 | Moderate | Retained and refined | Moderate | On Polish Borel spaces, compactness of the fixed-marginal coupling set proves exact threshold attainment and gluing proves the extended metric axioms. The empirical proposition already supplies enough compact-ball assumptions for its finite-atom selector. The over-scope is in the preceding arbitrary-metric definition/limit; the proposition only additionally needs `rho>=0`. |
| CH4-003 | Moderate | Retained only as provenance; mathematical allegation rejected | Minor | The caption says the RMS displacement equals the budget, and that is exactly true for the displayed identity pairing. It does not literally assert `W_2=rho`. The generator is nevertheless an uncertified deterministic Monge-type heuristic and the optimal empirical `W_2` is materially smaller, facts needed to interpret the illustration. |
| CH4-004 | Minor | Retained and narrowed | Minor | The `0/1` cost is bounded, so this is not a moment or extended-value failure. The identity is valid on standard Borel spaces because the diagonal is measurable. Only its presentation as the chapter's Polish-ground-metric `W_p` is out of domain on an uncountable space. |
| CH4-005 | Minor | Retained | Minor | The cited global-invariance paper is not the direct GW word-alignment source, and no nearby chapter citation supplies that exact attribution. |
| CH4-006 | Minor | Retained | Minor | The imported conic proposition was checked line-by-line: it uses disintegration, conditional Jensen, and measurable near-minimization, not gluing of cone couplings. This is a concrete proof-description error, not merely stylistic shorthand. |
| CH4-007 | Minor | Retained and narrowed | Minor | Matrix linearity is strongly implied by `Qx`, operator norms, transpose, and later usage, but the local declaration formally admits arbitrary maps. A one-line matrix hypothesis closes the measurability, integrability, and differentiation gap. |
| CH4-008 | Minor | Retained | Minor | All nondegenerate inequalities and equality cases are correct. Only `0^0` at `p=q` on a singleton and the minimum over an empty off-diagonal set remain undefined. |

## Findings

### CH4-001 - The DRO dual does not state one theorem with checkable hypotheses

- **Severity:** Moderate
- **Class:** Mathematical theorem statement and endpoint scope
- **Current lines:** 816-848, especially 828-838
- **Label/environment:** equation `eq-dro-dual-envelope`, paragraph `DRO ambiguity sets`
- **Precise claim:** The chapter states the exact empirical Wasserstein-DRO identity
  under only "the usual upper-semicontinuity and growth assumptions." The state
  space, measurable structure, range of `p` and `rho`, loss measurability and
  integrability, growth condition, finite/extended-value convention, and all
  attainment claims remain unstated. The next sentence calls each pointwise supremum
  a sample's "worst" perturbation without saying whether it is attained.
- **Direct derivation:** Write
  `alpha_hat=(1/n) sum_i delta_(z_i)` and orient a coupling with its first marginal
  equal to `alpha_hat`. Disintegration is then exactly
  `pi=(1/n) sum_i delta_(z_i) tensor nu_i`, and the second marginal is
  `beta=(1/n) sum_i nu_i`. Consequently the primal is

  ```text
  sup  (1/n) sum_i int ell(z) dnu_i(z)
  s.t. (1/n) sum_i int d(z,z_i)^p dnu_i(z) <= rho^p,
       nu_i probability measures.
  ```

  Lagranging the one cost constraint gives weak duality and, after maximizing each
  `nu_i`, the displayed expression. Equality is therefore a strong-duality theorem,
  not an algebraic rearrangement.
- **Exact distinctions established in the second pass:** For `rho>0`, the cited
  Gao--Kleywegt result covers a Polish state space, finite `p>=1`, an empirical nominal
  law (hence in `P_p`), and a measurable loss integrable at the nominal law. If the
  loss has finite upper `p`-growth rate, the value is finite, strong duality holds, and
  the one-dimensional dual has a minimizer. Upper semicontinuity is not required for
  that value identity. It enters their worst-case-distribution results together with
  total boundedness of bounded sets, and pointwise maximizers require a separate
  compactness/coercivity condition. See [Gao and Kleywegt, arXiv:1604.02199](https://arxiv.org/abs/1604.02199).
- **Endpoint counterexample:** The chapter does not exclude `rho=0`. Let
  `Z=R`, `p=1`, `alpha_hat=delta_0`, and set `ell(0)=0`, `ell(z)=1` for `z!=0`.
  The primal value is `0`, while for every finite `lambda`,
  `sup_z{ell(z)-lambda|z|}=1`; the displayed dual infimum is `1`. Thus a merely
  measurable loss and finite nominal value do not suffice at the zero-radius endpoint.
- **Finiteness and attainment are independent:** Super-`p` upper growth can make both
  sides `+infinity`. Even with finite strong duality and a dual minimizer, a primal
  worst-case law can fail to exist because mass may escape to infinity; conversely a
  pointwise `sup_z` need not be a maximum. At `rho=0`, even a well-behaved loss may
  yield the correct value only through `lambda -> infinity`, so dual attainment also
  needs separate wording.
- **Smallest correct repair:** State a precise positive-radius theorem matching the
  cited measurable-loss result: `(Z,d)` Polish, `1<=p<infinity`, `rho>0`, empirical
  nominal law, nominal integrability, and finite upper `p`-growth rate. State equality
  and dual attainment only. Then give a separate `rho=0` sentence under upper
  semicontinuity, and add properness/compactness or coercivity only when claiming
  pointwise or primal attainment. A simpler but stronger textbook version may assume
  real upper-semicontinuous `ell(z)<=C(1+d(z,z0)^p)` and a proper Polish space, while
  still distinguishing value equality from worst-case-law existence.
- **Downstream impact:** The Lipschitz upper bound at lines 839-846 and the convexity
  argument at lines 874-880 remain valid. What lacks a checkable foundation is the
  exact samplewise dualization and any reading of its suprema as attained adversarial
  perturbations.

### CH4-002 - The W-infinity endpoint is over-scoped and is generally an extended metric

- **Severity:** Moderate
- **Class:** Mathematical definition, topology, and boundary hypothesis
- **Current lines:** 883-934, especially 888-906 and 908-919
- **Label/environment:** definition `def-wasserstein-infinity`, equation
  `eq-wass-infty`, proposition `prop-wasserstein-infty-dro`
- **Precise claim:** For probabilities on an arbitrary metric space, the definition
  immediately asserts the exact closed-threshold equivalence, calls the result a
  distance, and states the bounded-space limit `W_p -> W_infinity`. It also explicitly
  allows value `+infinity`, which is incompatible with an ordinary finite-valued
  metric. The following empirical robust-envelope proposition omits `rho>=0`.
- **Derivation/proof gap:** An infimum at most `r` directly supplies couplings with
  displacement at most `r+epsilon`, not necessarily one supported on `{d<=r}`. For
  Borel probabilities on a Polish space, the missing step is valid: fixed marginals
  make the coupling family tight and weakly compact; the sets `{d<=r+epsilon}` are
  closed; Portmanteau and a decreasing sequence of thresholds give an exactly
  `r`-supported coupling. The same attainment plus the Polish gluing lemma proves
  symmetry, diagonal definiteness, and the triangle inequality. Without a
  standard-Borel/Polish framework, disintegration/gluing and weak compactness are not
  available as used in the chapter. The bounded-space `p -> infinity` interchange is
  likewise justified by optimal-coupling compactness in the Polish setting, not by
  the displayed infimum alone.
- **Empirical proposition recheck:** Lines 911-934 already assume Polish space,
  compact closed balls, finitely many atoms, positive weights, and real
  upper-semicontinuous loss. Compactness makes each pointwise supremum a maximum; only
  finitely many choices are needed, so no measurable-selector theorem is missing.
  Its limiting-coupling proof also establishes the threshold attainment needed in
  this special case. The proposition's only local boundary omission is `rho>=0`.
- **General pointwise-adversary distinction:** For a non-atomic nominal law, replacing
  the empirical sum by an integral of pointwise ball suprema requires universal/Borel
  measurability of the envelope and an exact or epsilon-measurable selector. Those
  requirements are not needed for the finite empirical proposition actually stated.
- **Smallest correct repair:** Define `W_infinity` for Borel probabilities on a Polish
  metric space and call it an extended metric; optionally restrict to a finite-valued
  component. State and prove attainment, the metric axioms, and the bounded-space
  limit there. If arbitrary metric spaces are retained, weaken the equivalence to an
  `r+epsilon` formulation and do not claim the unqualified metric/limit facts. Add
  `rho>=0` to `prop-wasserstein-infty-dro`.
- **Downstream impact:** The finite empirical robust-envelope formula is sound after
  the one boundary addition. The defect concerns the advertised global endpoint
  geometry, not finite-`p` Wasserstein space.

### CH4-003 - The DRO figure hides a restricted heuristic, but its RMS statement is correct

- **Severity:** Minor
- **Class:** Numerical provenance and precision; not a false Wasserstein identity
- **Current lines:** 851-865
- **Label/environment:** figure `fig:kantorovich-dro-ambiguity`
- **Precise claim:** The prose presents the panels as the geometric picture of the
  preceding full measure-valued DRO problem. The caption says the RMS displacement
  equals the global quadratic Wasserstein budget `rho`, but it does not identify the
  coupling or the restricted numerical problem.
- **Adversarial disposition of the old allegation:** The generator explicitly uses
  one adversarial location per observed point, paired with that point. Projection
  enforces
  `(n^{-1} sum_i ||z_i'-z_i||^2)^(1/2)=rho` at positive radii. This is the cost of the
  displayed identity-labelled coupling, so the caption's budget statement is true.
  It does not literally state that the optimal empirical `W_2` equals `rho`; that
  first-pass interpretation is retired.
- **Generator and diagnostic check:** The notebook uses 66 samples per class (132
  total), seed `217`, Laplacian bandwidth `0.24`, ridge `0.018`, radii `0`, `0.055`,
  and `0.11`, and alternating projected ascent/refitting with `35 x 25` inner/outer
  steps. It describes this as a deterministic Monge-type restriction and provides no
  global optimality or convergence certificate. A fresh bounded assignment check on
  the generated point arrays gave:

  | `rho` | displayed identity RMS | unlabelled empirical `W_2` | label-preserving empirical `W_2` | maximum displayed shift |
  |---:|---:|---:|---:|---:|
  | 0 | 0 | 0 | 0 | 0 |
  | 0.055 | 0.055000000000 | 0.041841531993 | 0.054920763634 | 0.162729703872 |
  | 0.110 | 0.110000000000 | 0.083692524319 | 0.108216276909 | 0.248429639484 |

  The displayed coupling is feasible for the radius, while the actual unlabelled
  transport distance is respectively about `23.9%` and `23.9%` smaller. Even the
  label-preserving optima are slightly smaller.
- **Smallest correct repair:** Add "under the displayed pointwise coupling" to the
  RMS sentence and identify the panels as a projected deterministic adversarial-
  training heuristic. State only feasibility (`W_2<=rho`), not solution of the full
  inner DRO problem.
- **Downstream impact:** The visual margin narrative and all printed parameter values
  remain usable. The repair prevents readers from treating an uncertified restricted
  optimization as a numerical solution of the full Wasserstein ambiguity problem.

### CH4-004 - The TV identity is outside the chapter's Polish W-p domain on uncountable spaces

- **Severity:** Minor
- **Class:** Mathematical domain and terminology
- **Current lines:** 567-611, especially 581-590
- **Label/environment:** proposition `prop-rel-wass-tv`
- **Precise claim:** On an arbitrary standard Borel space, the proposition identifies
  the bounded `0/1`-cost Kantorovich value with `W_p(alpha,beta)^p` whenever that cost
  is "used as the ground metric."
- **Derivation:** The diagonal of a standard Borel space is product-measurable, so
  `d_0=1_{x!=y}` is a bounded measurable cost. The common-part coupling proves exactly
  `inf_pi int d_0^p dpi = ||alpha-beta||_TV/2`; all probability laws have finite cost.
  Thus neither moments nor an extended-valued OT convention are at issue.
- **Domain gap:** If the underlying set is countable with its discrete sigma-algebra,
  `d_0` is Polish and the identity is a genuine instance of the chapter's `W_p`.
  If an uncountable standard Borel space is equipped with `d_0`, its topology is
  nonseparable and its Borel sigma-algebra is the full power set, generally not the
  given standard Borel sigma-algebra. It therefore leaves Definitions
  `def-p-wasserstein-space` and `def-wasserstein-distance`.
- **Smallest correct repair:** Call the left side the Kantorovich value for the
  measurable `0/1` cost and note the formal `W_p^p` notation, or restrict the metric
  interpretation to countable spaces. Do not describe this as an extended-value or
  moment-domain issue.
- **Downstream impact:** The value, proof, TV normalization, and finite-space
  comparison remain correct; only the Wasserstein-domain terminology changes.

### CH4-005 - The cited paper is not the direct GW word-embedding source

- **Severity:** Minor
- **Class:** Citation and attribution
- **Current lines:** 320-326, especially 325
- **Label/environment:** example `ex-word-mover-distance`
- **Precise claim:** The sentence on unaligned embedding spaces and intrinsic
  neighborhood geometry cites `alvarez2018towards` as its Gromov--Wasserstein source.
- **Primary-source check:** The cited paper is Alvarez-Melis, Jegelka, and Jaakkola,
  ["Towards Optimal Transport with Global Invariances"](https://proceedings.mlr.press/v89/alvarez-melis19a.html),
  PMLR 2019. It optimizes transport jointly with global latent transformations and is
  not the direct source for the stated GW word-embedding method. The direct paper is
  Alvarez-Melis and Jaakkola,
  ["Gromov-Wasserstein Alignment of Word Embedding Spaces"](https://aclanthology.org/D18-1214/),
  ACL 2018. The nearby imported generalized-Wasserstein discussion itself separates
  global-invariance OT from GW; no other citation adjacent to this example repairs
  the mismatch.
- **Smallest correct repair:** Cite the ACL 2018 paper for the GW sentence. Retain the
  PMLR citation only if the text also discusses global transform alignment as a
  distinct construction.
- **Downstream impact:** No mathematical conclusion changes.

### CH4-006 - The gluing remark misstates the imported conic proof mechanism

- **Severity:** Minor
- **Class:** Cross-reference and proof description
- **Current lines:** 260-264
- **Label/environment:** remark `rem-gluing-metric-engine`; imported proposition
  `prop-homogeneous-unbalanced`
- **Precise claim:** The remark says that the cited homogeneous conic construction of
  unbalanced OT "uses gluing on cone couplings."
- **Imported-proof recheck:** The proof in `generalized-wasserstein.tex`, lines
  381-404, homogenizes before conic lifting. Its operative steps are disintegration,
  conditional Jensen, and a measurable near-minimizer for the radial parameter. It
  does not glue two cone couplings. By contrast, the imported GW metric theorem does
  genuinely glue couplings. The conditional-Wasserstein metric proof invokes the
  already-established fiberwise `W_p` triangle inequality and Minkowski rather than
  explicitly performing a new gluing construction.
- **Smallest correct repair:** Remove the conic clause, or replace "uses gluing" by a
  looser conceptual statement that does not cite this proposition as proof evidence.
  Keep the GW example as the literal imported gluing analogue.
- **Downstream impact:** None for any theorem; the issue is proof navigation and
  pedagogical accuracy.

### CH4-007 - Q, K, and V are used as linear matrices but declared only as maps

- **Severity:** Minor
- **Class:** Mathematical hypothesis, notation, and measurability
- **Current lines:** 1213-1343, especially 1216-1227, 1243-1265, and 1281-1341
- **Label/environment:** equation `eq-discrete-self-attention`, definition
  `def-mean-field-attention-map`, proposition `prop-attention-wass-lipschitz`
- **Precise claim:** The first declaration says only that `Q,K:R^d->R^r` and
  `V:R^d->R^d` are maps. The definition then claims compact support makes its
  integrability conditions automatic, and the proposition uses operator norms,
  `Q^T Kz`, derivatives, and linear growth.
- **Adversarial recheck:** Matrix linearity is unmistakably intended: the text writes
  `Qx`, later takes matrix operator norms and a transpose, and a later imported use in
  `transportation-models.tex` explicitly calls `Q,K` matrices. Intent does not supply
  a formal local hypothesis. For arbitrary maps, compact support alone gives neither
  Borel measurability nor boundedness/integrability, and the derivative formula is
  undefined. For finite-dimensional linear maps, all dimensions agree, maps are
  Borel, compact support bounds the exponent and numerator, the denominator is at
  least `exp(-A_R)`, and every proof estimate is valid.
- **Smallest correct repair:** At line 1216 declare `Q,K` and `V` to be linear maps
  (matrices), for example `Q,K in L(R^d,R^r)` and `V in L(R^d,R^d)`, and let the
  definition and proposition inherit this declaration. A nonlinear version would
  instead need explicit Borel, boundedness, Lipschitz, and differentiability bounds.
- **Downstream impact:** The finite-token identity, permutation equivariance,
  push-forward, and `e^{2A_R}` compact-support stability estimate are correct after
  this one-line repair.

### CH4-008 - Two comparison results omit degenerate singleton conventions

- **Severity:** Minor
- **Class:** Boundary and equality case
- **Current lines:** 509-528 and 775-807
- **Label/environment:** proposition `prop-comp-wass-p`; unlabeled proposition
  `Comparison with total variation on finite spaces`
- **Precise claim:** The first proposition permits `p=q` and writes
  `diam(X)^((q-p)/q)`; for a singleton this is `0^0`. The second defines
  `d_min=min_(x!=y)d(x,y)>0`; for a singleton the index set is empty. Its claimed
  minimizing/maximizing point pairs also do not exist.
- **Derivation:** For `p<q`, `d^q<=diam(X)^(q-p)d^p` is valid, including zero
  diameter because both measures are then identical. For `p=q`, the assertion is
  simply `W_p=W_p` and should not pass through `0^0`. On every finite space with at
  least two points, compact finiteness gives positive `d_min`, finite `d_max`, and the
  TV sandwich and equality cases are exact. On a singleton, all probability measures
  coincide and every distance is zero, but `d_min` is undefined.
- **Smallest correct repair:** State the diameter estimate for `p<q` and handle
  `p=q` separately, or explicitly define the zero-exponent factor as one. Add
  `|X|>=2` to the finite-space comparison and state the singleton case separately.
- **Downstream impact:** No nontrivial comparison or topology conclusion changes.

### CH4-009 - The uniform particle rate uses r_(n,p,d) at n=1 where it is not defined

- **Severity:** Minor
- **Class:** Imported definition and boundary quantifier
- **Current lines:** 1035-1073, especially 1037 and 1059-1072
- **Label/environment:** definition `def-particle-polynomial`; proposition
  `prop-holder-particle-polynomial`; equation `eq-holder-particle-polynomial-rate`
- **Precise claim:** The particle operator is defined for every `n>=1`, and the next
  proposition inherits that range while asserting a rate in terms of
  `r_(n,p,d)`. The cross-referenced definition `eq-empirical-wasserstein-scale` in
  `statistical-ot.tex`, lines 233-242, explicitly begins with `n>=2`.
- **Derivation:** The general estimate
  `|B_n f(alpha)-f(alpha)| <= L E[W_p(alpha_hat_n,alpha)^eta]` is valid at `n=1`.
  The subsequent proof correctly invokes the imported empirical `p`-moment bound and
  Lyapunov for every `n` in that imported theorem's range, but the displayed symbol
  on the right has no defined value at `n=1`. This is a quantifier/notation defect,
  not a failure of the asymptotic rate.
- **Smallest correct repair:** Insert "Moreover, for `n>=2`," before the uniform-rate
  display. Alternatively extend the imported definition of `r_(n,p,d)` to `n=1` and
  verify the imported bound under that convention; the local one-phrase repair is
  smaller.
- **Downstream impact:** Pointwise Bernstein approximation, uniform convergence as
  `n->infinity`, the three dimension regimes, and the exponent `eta` remain correct.

## Research/scope questions excluded from defect totals

### RQ4-001 - What formal approximation model is intended by the parameter-budget discussion?

- **Current lines:** 1099
- **Question:** The statement that a generic kernel on `X^m` needs a parameter count
  exponential in `m`, hence `m` grows at best logarithmically with a budget `M`, is
  explicitly heuristic ("typically" and "worst-case") and directionally sound. A
  theorem would require a regularity class, architecture or dictionary, approximation
  norm, target error, and dimension notion. Should this remain an informal warning,
  or should a concrete approximation-width result be stated and cited?
- **Second-pass disposition:** Still an RQ, not a defect. The chapter does not present
  a formal complexity theorem, algorithm, stopping rule, or universal rate in `M`.

## Validated-correct ledger

The following important claims were independently re-derived during this second pass
and retained as correct, subject only to any explicitly linked finding. "Imported"
means the defining source and proof, not merely its label, were inspected read-only.

| ID | Current lines | Claim checked | Independent check |
|---|---:|---|---|
| VC4-001 | 34-78 | Discrete gluing lemma | The conditional-product tensor has both prescribed marginals, including every zero entry of the shared marginal; its first-third marginal is feasible. |
| VC4-002 | 100-137 | Discrete `W_p` is a metric | Transposition, diagonal support, discrete gluing, the ground triangle inequality, and Minkowski give all axioms. |
| VC4-003 | 145-178 | Continuous gluing | Polish disintegration supplies measurable regular conditional laws; their conditional product has the stated two marginals. |
| VC4-004 | 181-210 | `P_p` and finite-`p` distance definitions | Reference-point independence follows from the metric triangle inequality; the imported lower-semicontinuous-cost existence result gives an optimal coupling. |
| VC4-005 | 214-258 | Finite-`p` Wasserstein metric | Symmetry and definiteness are correct; continuous gluing and Minkowski prove the triangle inequality with all moment terms finite. |
| VC4-006 | 268-304 | Mean lower bound and `W_2` centering identity | Jensen gives the mean bound; centering bijects coupling sets and kills the cross term exactly. |
| VC4-007 | 310-318 | Gene-expression measure model | Expression weights are normalized to a probability law on a gene-feature space and the ground metric is correctly identified as external biological/learned geometry. |
| VC4-008 | 320-325 | Word Mover's Distance model | Normalized word frequencies define document measures on a common embedding ground space; the WMD statement itself is correct. Citation repair is CH4-005. |
| VC4-009 | 336-381 | Optimal-plan displacement interpolation | The endpoint coupling gives the upper bound, while the endpoint triangle inequality forces equality on each subinterval, hence constant speed and subplan optimality. |
| VC4-010 | 401-409 | General geodesic-space extension | The text correctly makes the construction conditional on a measurable selection of pointwise constant-speed geodesics. |
| VC4-011 | 423-457 | Kantorovich as plan-space Monge relaxation | Push-forward by maps gives the easy inequality; atomlessness and weak density of graph plans give recovery, with bounded continuous cost controlling objective convergence. |
| VC4-012 | 464-490 | Lower-semicontinuous envelope of directed Monge cost | The lower bound is Wasserstein lower semicontinuity; atomless recovery maps provide the matching upper bound. The `+infinity` convention is coherent. |
| VC4-013 | 509-528 | Monotonicity in `p` and diameter interpolation | Jensen and `d^q <= diam(X)^(q-p)d^p` are correct for the nondegenerate cases; only CH4-008's endpoint notation needs repair. |
| VC4-014 | 534-565 | Narrow/weak terminology and examples | `C_b` is the correct test class on metric spaces; weak-star terminology is restricted to compact duality; the Riemann and fixed-atom examples are correct. |
| VC4-015 | 581-611 | TV value for the measurable `0/1` cost | The common-part construction attains off-diagonal mass `TV/2`, and no coupling can put more than the common mass on the diagonal. Domain terminology is CH4-004. |
| VC4-016 | 614-630 | Probability-law interpretation | Almost-sure implies in-probability implies in-law; in-law depends only on marginals; total variation implies narrow convergence. |
| VC4-017 | 639-679 | Convolution and normalized CLT laws | Push-forward under addition and dilation gives the stated density formula and `law(Z_n)=(D_{1/sqrt(n)})_# alpha^{*n}`. |
| VC4-018 | 681-706 | Bernoulli CLT and `W_1` Berry--Esseen pointer | The lattice normalization, atom-height normalization, Gaussian comparison, and imported `W_1` theorem pointer agree. |
| VC4-019 | 724-771 | `W_p` convergence theorem | `W_p -> 0` yields weak and moment convergence; Skorokhod plus Scheffe and Vitali proves the converse; moment convergence and uniform-integrability tails are equivalent. |
| VC4-020 | 779-807 | Finite-space TV comparison | For at least two points, sandwiching `d` between `d_min d_0` and `d_max d_0` gives sharp constants. Singleton repair is CH4-008. |
| VC4-021 | 819-848 | DRO ambiguity set and Lipschitz upper bound | The constrained and fixed-penalty problems are correctly distinguished. Kantorovich--Rubinstein gives empirical risk plus `rho L` for a fixed Lipschitz loss. |
| VC4-022 | 867-880 | Joint convexity and robust-risk convexity | `W_p^p` is jointly convex; the `t^(1/p)` counterexample correctly disproves convexity of `W_p` for `p>1`; a supremum of convex losses is convex. |
| VC4-023 | 908-934 | Empirical `W_infinity` envelope | With Polish space, `rho >= 0`, compact closed balls, and real upper-semicontinuous loss, limiting couplings, disintegration, and pointwise maximizers prove the formula. |
| VC4-024 | 953-987 | Functional norm, Holder class, examples/nonexamples | The definitions are coherent on compact `X`; distance powers and linear observables have the stated regularity; point mass and empirical relative entropy are valid discontinuity examples. |
| VC4-025 | 995-1031 | Wasserstein-polynomial density | The polynomial class contains constants, is an algebra after lifting/symmetrizing kernels, separates measures by continuous functions, and Stone--Weierstrass applies on compact `P(X)`. |
| VC4-026 | 1035-1097 | Particle polynomial and uniform rate | `B_n f=E f(hat alpha_n)` is an order-`n` interaction polynomial; for `n>=2`, Holder control plus the imported empirical moment rate and Lyapunov give `r_(n,p,d)^eta`. The missing local restriction is CH4-009. |
| VC4-027 | 963, 1138-1152 | Vector-valued extension | Coordinatewise approximation is legitimate in finite-dimensional codomains; equivalent norms combine the component bounds. |
| VC4-028 | 1124-1203 | Particle-preserving representation and stability | Push-forward preserves weights up to collisions; coupling `(T[alpha],T[beta])_# pi` and Minkowski give constant `L_x+L_law`; fixed push-forward has constant `L`. |
| VC4-029 | 1217-1278 | Finite-token/mean-field attention identity | Empirical integration reproduces softmax exactly, `1/sqrt(r)` can be absorbed into a linear query/key map, and unmasked attention is permutation equivariant. |
| VC4-030 | 1281-1345 | Compact-support attention stability | Once CH4-007 states matrix linearity, denominator, numerator, law sensitivity, spatial derivative, support, and `W_1 <= W_p` estimates yield the claimed exponential score-radius behavior. |
| VC4-031 | 1352-1411 | Markov measure-map stability | The moment condition maps `P_p` to itself; measurable optimal-coupling selection on Polish spaces and integration against an input coupling give the sharp `L` estimate. |
| VC4-032 | 1413-1424 | Convolution non-expansiveness | Common-noise coupling gives the upper bound; a linear `1`-Lipschitz test in the displacement direction gives equality for translated kernels and map constant `1`. |
| VC4-033 | Imported completeness/compactness convention | `P_p(X)` geometry | The imported proposition correctly states that `P_p(X)` is Polish when `X` is Polish and is compact when `X` is compact. Completeness uses compatible glued near-optimal couplings and finite-moment control; separability and compactness follow from finite-support approximation and tightness. The chapter itself makes no stronger properness or local-compactness claim. |
| VC4-034 | 851-865 and generator | DRO figure coupling identity | The displayed identity pairing has RMS displacement exactly `rho` and is feasible, so the literal budget statement is correct. It is not the minimizing empirical coupling; provenance precision is CH4-003. |

## Exhaustive structural matrix

| Unit | Current lines | Audit disposition |
|---|---:|---|
| Chapter opening and scope | 1-10 | Checked; consistent with chapter contents. |
| Section: Wasserstein Distances | 11-496 | Checked line-by-line; CH4-005 and CH4-006 only. |
| Paragraph: OT defines a distance | 22-138 | Correct. |
| Paragraph: Continuous gluing | 139-305 | Correct. |
| Paragraph: Applications | 306-327 | Models correct; citation CH4-005. |
| Paragraph: optimal-plan interpolation | 328-410 | Correct. |
| Paragraph: comparison with Monge | 411-496 | Correct under stated atomlessness/continuity assumptions. |
| Section: Topology and Applications | 497-809 | Checked line-by-line; CH4-004 and CH4-008. |
| Paragraph: convergence in law topology | 504-566 | Correct except zero-diameter endpoint in CH4-008. |
| Paragraph: strong versus weak topology | 567-613 | Value proof correct; domain wording CH4-004. |
| Paragraph: probabilistic interpretation | 614-635 | Correct. |
| Paragraph: CLT and OT | 636-709 | Correct, including figure provenance. |
| Paragraph: Wasserstein metrizes weak convergence | 710-809 | Correct except singleton case in CH4-008. |
| Section: Distributional Robustness and `W_infinity` | 810-935 | CH4-001, CH4-002, CH4-003. |
| Paragraph: DRO ambiguity sets | 816-882 | Exact dual needs CH4-001; figure needs CH4-003; remaining claims correct. |
| Paragraph: `W_infinity` robustness | 883-935 | Endpoint domain/metric issue CH4-002; envelope proof otherwise correct. |
| Section: Measure-to-Vector Maps | 936-1100 | Correct except the `n=1` imported-rate domain in CH4-009; RQ4-001 is a non-defect scope question. |
| Paragraph: functional regularity | 943-977 | Correct. |
| Paragraph: examples/nonexamples | 978-988 | Correct. |
| Paragraph: interaction polynomials | 989-1005 | Correct. |
| Paragraph: empirical particle approximation | 1006-1100 | Rate proof correct for imported range `n>=2`; local quantifier is CH4-009; complexity prose is RQ4-001. |
| Section: Measure-to-Measure Maps | 1101-1427 | Correct except CH4-007. |
| Paragraph: maps on Wasserstein space | 1107-1118 | Correct framing. |
| Paragraph: particle-preserving representations | 1119-1153 | Correct; no converse characterization is falsely claimed. |
| Paragraph: Wasserstein stability | 1154-1205 | Correct. |
| Paragraph: mean-field attention | 1206-1346 | Correct after matrix-linearity repair CH4-007. |
| Paragraph: mass-splitting Markov maps | 1347-1427 | Correct. |

## Exhaustive named/numbered environment matrix

There are 39 theorem-style environments: 2 lemmas, 12 definitions, 15
propositions, 1 corollary, 6 remarks, and 3 examples.

| ID | Type and title/label | Current lines | Disposition |
|---|---|---:|---|
| E01 | Lemma, Discrete gluing lemma, `lem-gluing-discr` | 34-51 | Correct. |
| E02 | Definition, Discrete Wasserstein distance, `def-discrete-wasserstein-distance` | 100-107 | Correct. |
| E03 | Proposition, discrete metric, `prop-metric-histo` | 109-116 | Correct. |
| E04 | Lemma, Gluing lemma, `lem-gluing-general` | 145-158 | Correct. |
| E05 | Definition, `p`-Wasserstein space, `def-p-wasserstein-space` | 181-190 | Correct. |
| E06 | Definition, Wasserstein distance, `def-wasserstein-distance` | 201-210 | Correct. |
| E07 | Proposition, Wasserstein metric, `prop-metric-measure` | 214-222 | Correct. |
| E08 | Remark, Gluing is the metric engine, `rem-gluing-metric-engine` | 260-264 | CH4-006. |
| E09 | Proposition, mean bound/decomposition, `prop-wasserstein-mean-decomposition` | 268-284 | Correct. |
| E10 | Example, gene-expression distance, `ex-gene-expression-distance` | 310-318 | Correct. |
| E11 | Example, word embeddings/documents, `ex-word-mover-distance` | 320-326 | CH4-005. |
| E12 | Definition, plan-induced `W_2` geodesic, `def-w2-geodesic-induced-by-plan` | 336-347 | Correct. |
| E13 | Proposition, plan interpolation geodesic, `prop-plan-interpolation-w2-geodesic` | 352-362 | Correct. |
| E14 | Remark, interpolation on a general geodesic space | 401-409 | Correct and appropriately conditional. |
| E15 | Proposition, Kantorovich relaxation of Monge, `prop-kantorovich-relaxation-monge` | 423-431 | Correct. |
| E16 | Corollary, lsc envelope of Monge cost, `cor-wasserstein-lsc-envelope-monge-distance` | 464-475 | Correct. |
| E17 | Proposition, bounded-space `W_p` comparison, `prop-comp-wass-p` | 509-517 | CH4-008. |
| E18 | Definition, weak/narrow topology, `dfn-weak-conv` | 534-543 | Correct. |
| E19 | Remark, Riemann-sum weak limit, `rem-riemann-weak-limit` | 545-556 | Correct. |
| E20 | Remark, weak convergence for discrete measures, `rem-weak-conv-disc` | 558-565 | Correct. |
| E21 | Proposition, TV as discrete-cost transport, `prop-rel-wass-tv` | 581-590 | CH4-004. |
| E22 | Definition, convolution, `def-measure-convolution` | 639-652 | Correct. |
| E23 | Remark, central limit theorem, `rem-clt` | 662-679 | Correct. |
| E24 | Remark, quantitative CLT pointer, `rem-wasserstein-berry-esseen-pointer` | 699-706 | Correct. |
| E25 | Proposition, Wasserstein convergence, `prop-wass-topology-polish` | 724-742 | Correct. |
| E26 | Proposition, finite-space TV comparison, unlabeled | 779-794 | CH4-008. |
| E27 | Definition, `W_infinity`, `def-wasserstein-infinity` | 888-904 | CH4-002. |
| E28 | Proposition, empirical `W_infinity` envelope, `prop-wasserstein-infty-dro` | 908-918 | Correct after `rho >= 0`; linked CH4-002. |
| E29 | Definition, uniform functional norm, `def-uniform-norm-functionals` | 953-961 | Correct. |
| E30 | Definition, Wasserstein--Holder functional, `def-wasserstein-holder-functional` | 965-974 | Correct. |
| E31 | Definition, Wasserstein polynomial, `def-wasserstein-polynomial` | 995-1003 | Correct. |
| E32 | Proposition, polynomial density, `prop-density-wasserstein-polynomials` | 1012-1020 | Correct. |
| E33 | Definition, particle polynomial, `def-particle-polynomial` | 1035-1053 | Correct. |
| E34 | Proposition, Holder particle approximation, `prop-holder-particle-polynomial` | 1059-1073 | General bound correct; uniform-rate display needs `n>=2`, CH4-009. |
| E35 | Proposition, transport-representation stability, `prop-measure-map-wass-lipschitz` | 1160-1179 | Correct. |
| E36 | Definition, mean-field attention, `def-mean-field-attention-map` | 1243-1264 | CH4-007. |
| E37 | Proposition, compact-support attention stability, `prop-attention-wass-lipschitz` | 1281-1296 | Correct after CH4-007. |
| E38 | Proposition, Markov-map stability, `prop-markov-map-wasserstein-stability` | 1370-1385 | Correct. |
| E39 | Example, convolution non-expansive, `ex-convolution-wasserstein-nonexpansive` | 1413-1424 | Correct. |

## Exhaustive proof matrix

All 18 proof environments were checked line-by-line.

| ID | Result proved | Current lines | Proof audit |
|---|---|---:|---|
| P01 | Discrete gluing lemma | 52-78 | Correct, including shared zero masses. |
| P02 | Discrete Wasserstein metric | 118-137 | Correct; finite optimum exists and Minkowski is applied to the glued probability tensor. |
| P03 | Continuous gluing lemma | 159-178 | Correct under Polish disintegration. |
| P04 | Wasserstein metric | 224-258 | Correct; optimal plans exist from the imported lsc-cost theorem. |
| P05 | Mean bound/quadratic decomposition | 285-304 | Correct. |
| P06 | Plan interpolation is constant speed | 363-381 | Correct; endpoint upper bounds plus triangle equality force both subdistance equalities. |
| P07 | Kantorovich relaxation of Monge | 433-457 | Correct under atomlessness and bounded continuous cost. |
| P08 | Monge lsc envelope | 476-490 | Correct. |
| P09 | Bounded-space `p,q` comparison | 518-528 | Algebra correct; statement endpoint notation is CH4-008. |
| P10 | TV for `0/1` cost | 591-611 | Correct measurable-cost proof; Wasserstein-domain wording is CH4-004. |
| P11 | `W_p` convergence equivalences | 743-771 | Correct use of bounded Lipschitz tests, Skorokhod, Scheffe, uniform integrability, and Vitali. |
| P12 | Finite-space TV comparison | 796-800 | Correct when at least two points; CH4-008. |
| P13 | Empirical `W_infinity` envelope | 919-934 | Correct after `rho >= 0`; it also supplies the compactness argument missing from the preceding over-broad definition. |
| P14 | Wasserstein-polynomial density | 1021-1031 | Correct real Stone--Weierstrass argument. |
| P15 | Particle-polynomial rate | 1074-1097 | Derivation is correct on the imported theorem's `n>=2` range; the proposition's unstated range is CH4-009. |
| P16 | Transport-representation stability | 1180-1197 | Correct coupling and Minkowski proof. |
| P17 | Attention stability | 1297-1343 | Correct once `Q,K,V` are linear matrices; otherwise operations are undefined (CH4-007). |
| P18 | Markov-map stability | 1386-1411 | Correct under Polish measurable optimal-plan selection. |

## Exhaustive display matrix

There are 104 mathematical displays. The inventory includes the three custom
`eql`/`eqllead` displays that a plain `\[`/`equation` search would miss. The three
`\\[-.15em]` tabular spacing commands in figures are not mathematical displays.

| ID | Start line | Content | Disposition |
|---|---:|---|---|
| D001 | 38 | Discrete glued tensor marginals | Correct. |
| D002 | 53 | Conditional-product formula for `S` | Correct. |
| D003 | 60 | First marginal calculation | Correct. |
| D004 | 66 | Second marginal including zero case | Correct. |
| D005 | 103 | Discrete `W_p` definition | Correct. |
| D006 | 113 | Discrete triangle inequality statement | Correct. |
| D007 | 126 | Discrete Minkowski chain | Correct. |
| D008 | 152 | Continuous glued marginals | Correct. |
| D009 | 166 | Conditional-product law by test functions | Correct. |
| D010 | 184 | `P_p(X)` moment definition | Correct. |
| D011 | 203 | Finite-`p` Wasserstein definition | Correct. |
| D012 | 218 | Metric axioms/triangle statement | Correct. |
| D013 | 229 | Zero-cost integral under optimizer | Correct. |
| D014 | 246 | Continuous gluing/Minkowski chain | Correct. |
| D015 | 279 | Mean/quadratic decomposition formula | Correct. |
| D016 | 298 | Centered cost expansion | Correct. |
| D017 | 314 | Cell as a normalized gene measure | Correct. |
| D018 | 341 | Plan-induced interpolation push-forward | Correct. |
| D019 | 356 | Constant-speed `W_2` formula | Correct. |
| D020 | 365 | Endpoint coupling upper bounds | Correct. |
| D021 | 373 | Triangle-equality forcing chain | Correct. |
| D022 | 428 | Kantorovich value below Monge value | Correct. |
| D023 | 442 | Recovery-map weak and cost convergence | Correct. |
| D024 | 451 | Relaxation equality sandwich | Correct. |
| D025 | 468 | Lower-semicontinuous envelope formula | Correct. |
| D026 | 480 | Recovery sequence upper estimate | Correct. |
| D027 | 512 | Bounded-space `p,q` comparison | CH4-008 endpoint convention. |
| D028 | 522 | Jensen comparison of moments | Correct. |
| D029 | 537 | Narrow convergence test functions | Correct. |
| D030 | 572 | Total-variation norm recall | Correct convention. |
| D031 | 584 | `0/1` transport value equals `TV/2` | Formula correct; domain CH4-004. |
| D032 | 595 | Common residual mass identity | Correct. |
| D033 | 624 | Definition of convergence in probability | Correct. |
| D034 | 642 | Convolution as addition push-forward | Correct. |
| D035 | 647 | Test-function convolution identity | Correct. |
| D036 | 654 | Convolution density formula | Correct. |
| D037 | 665 | Normalized CLT sum | Correct. |
| D038 | 673 | Normalized convolution law | Correct. |
| D039 | 716 | Moving Dirac: TV versus `W_p` | Correct. |
| D040 | 730 | Convergence of `p`th moments | Correct. |
| D041 | 736 | Uniform-integrability tail condition | Correct. |
| D042 | 745 | Reverse `L^p` triangle estimate | Correct. |
| D043 | 757 | Domination for Skorokhod coupling | Correct. |
| D044 | 762 | Coupling upper bound tending to zero | Correct. |
| D045 | 783 | `d_min,d_max` definitions | CH4-008 singleton case. |
| D046 | 789 | Finite-space TV comparison | Correct for at least two points. |
| D047 | 803 | Sharpness reduction to point pairs | Correct for at least two points. |
| D048 | 822 | Wasserstein ambiguity-set risk | Correct definition. |
| D049 | 829 | Exact empirical DRO dual | CH4-001. |
| D050 | 840 | Lipschitz DRO upper bound | Correct. |
| D051 | 868 | Concavity counterexample for `W_p` | Correct. |
| D052 | 875 | Convex robust-risk map | Correct. |
| D053 | 890 | `W_infinity` infimum definition | CH4-002 domain/metric scope. |
| D054 | 898 | Exact support-threshold equivalence | CH4-002 attainment scope. |
| D055 | 912 | Empirical `W_infinity` envelope | Correct after `rho >= 0`. |
| D056 | 926 | Envelope proof decomposition | Correct. |
| D057 | 947 | Scalar functional domain | Correct. |
| D058 | 956 | Uniform functional norm | Correct. |
| D059 | 967 | Wasserstein--Holder inequality | Correct. |
| D060 | 982 | Linear-observable Lipschitz estimate | Correct. |
| D061 | 997 | Interaction-polynomial definition | Correct. |
| D062 | 1014 | Uniform polynomial approximation | Correct. |
| D063 | 1023 | Product-algebra identity | Correct. |
| D064 | 1038 | Empirical particle kernel | Correct. |
| D065 | 1044 | Bernstein/particle operator | Correct. |
| D066 | 1061 | General Holder approximation bound | Correct. |
| D067 | 1067 | Uniform empirical-rate bound | Correct for `n>=2`; missing range is CH4-009. |
| D068 | 1076 | Holder proof estimate | Correct. |
| D069 | 1084 | Imported empirical `p`-moment bound | Correctly transferred for its stated `n>=2` range; CH4-009. |
| D070 | 1091 | Lyapunov moment step | Correct. |
| D071 | 1110 | Measure-to-measure map domain | Correct. |
| D072 | 1124 | Particle-preserving push-forward representation | Correct. |
| D073 | 1130 | Preservation of atom weights | Correct up to stated collisions. |
| D074 | 1138 | Curried representative | Correct for Euclidean codomain. |
| D075 | 1144 | Uniform law-sensitivity hypothesis | Correct. |
| D076 | 1164 | Spatial Lipschitz hypothesis | Correct. |
| D077 | 1169 | Law Lipschitz hypothesis | Correct. |
| D078 | 1174 | Output stability conclusion | Correct. |
| D079 | 1182 | Push-forward coupling estimate | Correct. |
| D080 | 1190 | Pointwise split bound | Correct. |
| D081 | 1200 | Fixed push-forward contraction | Correct. |
| D082 | 1217 | Discrete self-attention | Correct after linear-map declaration CH4-007. |
| D083 | 1233 | Permutation-equivariance formula | Correct. |
| D084 | 1246 | Mean-field integrability assumptions | Need Borel/linear map declaration, CH4-007. |
| D085 | 1252 | Mean-field attention quotient | Correct after CH4-007. |
| D086 | 1259 | Attention push-forward | Correct after measurability in CH4-007. |
| D087 | 1266 | Exact empirical attention identity | Correct. |
| D088 | 1285 | Compact-support `W_p` stability | Correct after CH4-007. |
| D089 | 1291 | Exponential score-radius bound | Correct up to stated polynomial factors after CH4-007. |
| D090 | 1299 | Attention normalizer/numerator | Correct after CH4-007. |
| D091 | 1305 | Kernel law-sensitivity estimate | Correct. |
| D092 | 1312 | Quotient-difference identity | Correct. |
| D093 | 1321 | Uniform law-sensitivity bound | Correct. |
| D094 | 1327 | Tilted attention law | Correct. |
| D095 | 1333 | Spatial derivative/covariance formula | Correct for linear matrices; CH4-007. |
| D096 | 1353 | Markov-kernel moment condition | Correct and sufficient. |
| D097 | 1358 | Induced Markov map | Correct weak definition. |
| D098 | 1374 | Kernel `W_p` Lipschitz condition | Correct. |
| D099 | 1380 | Induced-map Lipschitz conclusion | Correct. |
| D100 | 1388 | Measurable optimal kernel coupling | Correct on Polish space. |
| D101 | 1396 | Integrated output coupling | Correct. |
| D102 | 1403 | Markov-map cost estimate | Correct. |
| D103 | 1416 | Translate-kernel distance upper bound | Correct and in fact equality. |
| D104 | 1421 | Convolution non-expansiveness | Correct with sharp constant one. |

## Algorithm and pseudocode matrix

| Item | Result |
|---|---|
| Chapter algorithms | None present. |
| Pseudocode environments | None present. |
| Iterative convergence/stopping/complexity claims | None presented as an algorithm. The DRO figure generator uses an alternating numerical heuristic, audited under F04 and CH4-003; it is not chapter pseudocode and has no stated convergence guarantee. |

## Exhaustive figure and generator matrix

All four generators, all 17 source-referenced PDF panels, and the three additional
retained DRO diagnostics were inspected read-only. Referenced panels were rendered
only into `/tmp` for a contact-sheet reread. No notebook was executed in place and no
retained output was modified.

| ID | Figure and current lines | Generator SHA-256 and read-only audit | Disposition |
|---|---|---|---|
| F01 | `fig:kantorovich-discrete-gluing-lemma`, 82-94 | `kantorovich-discrete-gluing-lemma.ipynb`, `6dd1929f9efc53e92df2e1e55656b7c28da8272719ed5235fbe3fcb98e6bbc53`; 70-point fine outer grids, 18-point intermediate grid, one-dimensional monotone input plans, and `R=P diag(1/b)Q`. The first two plans are optimal, the glued plan is feasible and generally not direct-optimal, and all four panels/caption agree. | Correct. |
| F02 | `fig:kantorovich-plan-interpolation`, 385-399 | `kantorovich-plan-interpolation.ipynb`, `2a12b8b956a8d2ac2991bea2e24b46bf068f9069e9887f24785e4ef3d6d4d005`; 10 equally weighted source atoms, 9 target atoms with raw weights `(.15,.08,.14,.11,.13,.09,.16,.10,.12)` normalized to one, squared-Euclidean `ot.emd`, and times `0,1/4,1/2,3/4,1`. Since target weights are not multiples of `1/10`, the plan splits mass. Panels and interpolation agree. | Correct. |
| F03 | `fig:matching-quantitative-clt`, 683-697 | `matching-quantitative-clt.ipynb`, `9964bb322f99b318e7254d27a4f50a2ff71219098d574be26d5b27fa513174b8`; Bernoulli support `(2k-n)/sqrt(n)`, binomial masses, spacing `2/sqrt(n)`, and displayed height `mass/(2/sqrt(n))` for `n=1,2,4,16,64`. This is the correct local-density normalization for the lattice law; Gaussian overlay, rates pointer, axes, and panels agree. | Correct. |
| F04 | `fig:kantorovich-dro-ambiguity`, 853-865 | `kantorovich-dro-ambiguity.ipynb`, `e68b952ad620465fd572b787f4aa24f09f8e7d6d002e8aee5dcacf10d1f78f54`; 132 points, seed `217`, bandwidth `0.24`, ridge `0.018`, radii `0,.055,.11`, deterministic projected shifts, and `35 x 25` alternating steps. The three referenced panels match. The RMS identity is correct for the displayed feasible coupling; restricted-heuristic provenance and assignment gaps are CH4-003. | CH4-003 (numerical provenance only). |

Referenced panel SHA-256 register:

| Figure | Retained panels and SHA-256 |
|---|---|
| Gluing | `ab-plan.pdf` `4adcc642e09e1ac7032ea820e7708453810ecbdec8b493aabb0c3d11d342976b`; `bc-plan.pdf` `31ab4b43ab74c917c0b16e19f6f5b81af6e3ea8bd5178d1ae16268c1329acfda`; `glued-ac-plan.pdf` `44aa22598794be69561f4e3408552aa18b51e72ff407460eb82d31e27f2d0246`; `direct-ac-plan.pdf` `647a61e85142bafe55f014bdc9d8779b62e518c89e967e4d31b989c4622c607e`. |
| Interpolation | `time-000.pdf` `278268a08f0f6ed95918115d5666a1c298813f98b0c433057facfc2722325077`; `time-025.pdf` `c46cd4663713a762ea957b45142639bd1224854bcf18f310fda41143928086d8`; `time-050.pdf` `098aaf8e04588760bc7544d0c1b2be515886a911996df9707c8c11f5e080ae45`; `time-075.pdf` `2e0da4b2216ba2b6e806197c604163ab10b5bc2562ac9460f5529499313a422e`; `time-100.pdf` `abbdfde2f1f68082fc75b97c1e0f9a4827ff31323dd67ffbcd2f0d971895bd83`. |
| CLT | `n-001.pdf` `482d454bcd4f09309a1abe9b294a3f7b1f873b0badc54aa18f05ae72a59bb57d`; `n-002.pdf` `eece89b3c8b76272d643e41e538ac727afafb4bbea512fc4143c1dafbeeddf0b`; `n-004.pdf` `bf8a6ad9272ee743199867d319a75313a57a4e3357af24f533f0bc43a7a7f798`; `n-016.pdf` `bfc787086a8242e9b4f07ace18f48d9998782abf63c2f7b3a980b8bb0a06e979`; `n-064.pdf` `1af6072c5f9a8a3b7ea1c9aad36cf5867cd2389a8076df4cc4938c6eac711b45`. |
| DRO | `rho-zero.pdf` `a71266ed96f424671d0edeefb78b5e674cabdba044cfe1b69f78b419f8181f67`; `rho-medium.pdf` `776421a82ca76393ed342ffa017f49081e24286355afc8ecb0c75e472dc73c59`; `rho-large.pdf` `91222da50be8de36c4d42ab7727af8c1916ab9a3f3ba23e547dbb4c042e655bf`. |

The unreferenced retained F04 diagnostics also remained unchanged:
`ambiguity-disks.pdf` (`d17b51a1f1a5ddafb4e663dc90b4291427448bbbb756726680d121429e15b063`),
`empirical-cloud.pdf` (`fc5d82d5a4489fdd58c13fc82ca4d35f27d89b7c3c0fb257e9b00d73da62c44d`),
and `worst-case-shift.pdf` (`6e014fea203118c1e9c40c13e1235ad50c41fdff65bec39f39f2ed90506c40d7`).

## Exhaustive cross-reference matrix

The source contains 57 distinct referenced labels/equations. Every key resolves in
the retained auxiliary build. `Local` means defined in this chapter; `Imported` means
the defining source and, where mathematically relevant, its result/proof were inspected
read-only.

| ID | Referenced key | Scope | Disposition |
|---|---|---|---|
| R001 | `eq-defn-wass-dist` | Local | Resolved; correct. |
| R002 | `eq-discrete-self-attention` | Local | Resolved; CH4-007 hypothesis. |
| R003 | `eq-dro-dual-envelope` | Local | Resolved; CH4-001. |
| R004 | `eq-empirical-particle-polynomial` | Local | Resolved; correct. |
| R005 | `eq-empirical-wasserstein-moment-scale` | Imported | Resolved; rate, power, and `n>=2` range checked; local omission CH4-009. |
| R006 | `eq-empirical-wasserstein-scale` | Imported | Resolved; all three `r_(n,p,d)` cases and its `n>=2` domain checked; CH4-009. |
| R007 | `eq-glued-discr` | Local | Resolved; correct. |
| R008 | `eq-holder-particle-polynomial-general` | Local | Resolved; correct. |
| R009 | `eq-mean-field-attention` | Local | Resolved; CH4-007 hypothesis. |
| R010 | `eq-measure-map-markov-kernel` | Local | Resolved; correct. |
| R011 | `eq-measure-map-transport-representation` | Local | Resolved; correct. |
| R012 | `eq-monge-distance` | Imported | Resolved; extended-value convention agrees. |
| R013 | `eq-w1-metric` | Imported | Resolved; Kantorovich--Rubinstein use correct. |
| R014 | `def-discrete-wasserstein-distance` | Local | Resolved; correct. |
| R015 | `def-kernel-mmd-norm` | Imported | Resolved; order-two polynomial link correct. |
| R016 | `def-measure-convolution` | Local | Resolved; correct. |
| R017 | `def-p-wasserstein-space` | Local | Resolved; correct. |
| R018 | `def-polish-metric-space` | Imported | Resolved; hypotheses used correctly. |
| R019 | `def-w2-geodesic-induced-by-plan` | Local | Resolved; correct. |
| R020 | `def-wasserstein-distance` | Local | Resolved; correct. |
| R021 | `def-wasserstein-infinity` | Local | Resolved; CH4-002. |
| R022 | `defn-pushfwd` | Imported | Resolved; uses correct. |
| R023 | `defn-total-variation` | Imported | Resolved; norm convention checked. |
| R024 | `fig:kantorovich-discrete-gluing-lemma` | Local | Resolved; F01 correct. |
| R025 | `fig:kantorovich-dro-ambiguity` | Local | Resolved; F04/CH4-003. |
| R026 | `fig:kantorovich-plan-interpolation` | Local | Resolved; F02 correct. |
| R027 | `fig:matching-quantitative-clt` | Local | Resolved; F03 correct. |
| R028 | `lem-gluing-discr` | Local | Resolved; correct. |
| R029 | `lem-gluing-general` | Local | Resolved; correct. |
| R030 | `prop-berry-esseen-w1` | Imported | Resolved; hypotheses/rate and lattice/density discussion checked. |
| R031 | `prop-comp-wass-p` | Local | Resolved; CH4-008 endpoint. |
| R032 | `prop-conditional-wasserstein-distance` | Imported | Resolved; metric dependence checked. |
| R033 | `prop-conditional-wasserstein-geodesics` | Imported | Resolved; geodesic dependence checked. |
| R034 | `prop-empirical-lln-wasserstein` | Imported | Resolved; compact-case use correct. |
| R035 | `prop-existence-transport-map-atomless` | Imported | Resolved; atomlessness use correct. |
| R036 | `prop-homogeneous-unbalanced` | Imported | Resolved; description is CH4-006. |
| R037 | `prop-kantorovich-existence-compact` | Imported | Resolved; lsc Polish-cost existence applies. |
| R038 | `prop-kantorovich-relaxation-monge` | Local | Resolved; correct. |
| R039 | `prop-kantorovich-value-curvature` | Imported | Resolved; joint convexity use correct. |
| R040 | `prop-markov-map-wasserstein-stability` | Local | Resolved; correct. |
| R041 | `prop-measure-map-wass-lipschitz` | Local | Resolved; correct. |
| R042 | `prop-metric-histo` | Local | Resolved; correct. |
| R043 | `prop-metric-measure` | Local | Resolved; correct. |
| R044 | `prop-quotient-wasserstein-metric` | Imported | Resolved; metric inheritance is accurately relevant. |
| R045 | `prop-rel-wass-tv` | Local | Resolved; CH4-004. |
| R046 | `prop-tv-dual-measure` | Imported | Resolved; convention agrees. |
| R047 | `prop-wass-topology-polish` | Local | Resolved; correct. |
| R048 | `rem-weak-conv-disc` | Local | Resolved; correct. |
| R049 | `sec-generative-models-transportation` | Imported | Resolved; forward pointer appropriate. |
| R050 | `sec-gromov-wasserstein` | Imported | Resolved; topic pointer appropriate. |
| R051 | `sec-law-large-numbers-clt` | Imported | Resolved; Berry--Esseen pointer appropriate. |
| R052 | `sec-measure-to-vector-maps` | Local | Resolved; correct. |
| R053 | `sec-metric-learning-inverse-ot` | Imported | Resolved; application pointer appropriate. |
| R054 | `sec-sample-complexity` | Imported | Resolved; empirical-rate pointer appropriate. |
| R055 | `sec-transformer-depth-evolution` | Imported | Resolved; forward pointer appropriate. |
| R056 | `sec-wasserstein-gradient-flows` | Imported | Resolved; forward pointer appropriate. |
| R057 | `thm-gw-metric` | Imported | Resolved; genuine gluing analogy checked. |

No undefined reference or citation warning appears in the retained build log. The
current auxiliary file contains the chapter's labels, including all four figures and
all displayed equation labels.

## Exhaustive citation matrix

There are 31 active citation keys and one key in commented-out source. All 32 keys
exist in the bibliography. Primary sources were checked where the claim was specific
or potentially unstable.

| Key | Claim/use | Disposition |
|---|---|---|
| `BellazziCodegoniGualandiNicoraVercesi2021GeneMover` | Gene Mover's Distance | Supports normalized gene-expression transport model. |
| `HuizingCantiniPeyre2021WassersteinSingularVectors` | Single-cell learned ground geometry | Supports the application claim. |
| `kusner2015word` | Word Mover's Distance | Supports document measures and embedding ground cost. |
| `alvarez2018towards` | Claimed GW word-embedding alignment | Bibliography resolves, but citation is mismatched: CH4-005. |
| `Villani09` | Wasserstein topology, gluing/selection | Appropriate; imported uses checked. |
| `SantambrogioBook` | Wasserstein topology | Appropriate. |
| `gigli2011user` | Wasserstein-space topology/geometry | Appropriate. |
| `ambrosio2006gradient` | `W_p` convergence characterization | Appropriate. |
| `dudley1969speed` | Empirical convergence rates | Appropriate historical rate reference. |
| `fournier2015rate` | Empirical Wasserstein rates | Appropriate. |
| `weed2017sharp` | Sharp/intrinsic empirical rates | Appropriate. |
| `boissard2015distribution` | Empirical Wasserstein concentration/rates | Appropriate. |
| `bolley2007quantitative` | Quantitative empirical transport bounds | Appropriate. |
| `esfahani2018data` | Wasserstein DRO | Appropriate for finite-dimensional tractable reformulations under its stated loss/support assumptions; it does not itself supply the unstated generic theorem in CH4-001. |
| `BlanchetMurthy2019` | OT distributional model risk | Appropriate; its upper-semicontinuous/lower-semicontinuous transport framework separates duality and existence assumptions explicitly. |
| `GaoKleywegt2016` | Wasserstein DRO strong duality | Appropriate and checked against the primary preprint [arXiv:1604.02199](https://arxiv.org/abs/1604.02199). Its positive-radius measurable-loss theorem, finite growth rate, dual minimizer, and separate worst-case-law conditions are reflected in CH4-001. |
| `sinha2018certifying` | Adversarial training/robustness | Appropriate. |
| `NIPS2015_5745` | Distributionally robust logistic regression | Appropriate. |
| `xu2012distributionallyrobustmdp` | Distributionally robust MDPs | Appropriate. |
| `yang2017convex` | Robust RL/MDP formulation | Appropriate. |
| `schnabl1969bernstein` | Bernstein--Schnabl construction | Appropriate. |
| `bogachev2007measure` | Lyapunov/moment inequality | Appropriate though stronger than needed. |
| `Vaswani2017Attention` | Transformer/self-attention origin | Appropriate. |
| `Brown2020LanguageModels` | Language-model use | Appropriate. |
| `Dosovitskiy2021Image` | Vision transformers | Appropriate. |
| `Vuckovic2020MathematicalAttention` | Attention as mathematical operator | Appropriate. |
| `Geshkovski2023MathematicalPerspective` | Interacting-particle/attention analysis | Appropriate. |
| `Castin2025DynamicsTransformers` | Mean-field transformer dynamics | Appropriate. |
| `Bohbot2025TokenSampleComplexity` | Token sampling/mean-field approximation | Appropriate. |
| `CastinAblinPeyre2024HowSmoothAttention` | Attention Lipschitz scaling | Appropriate for the stated exponential score-radius behavior. |
| `LavenantSavare2026ContinuousTransformations` | Transport representatives of measure maps | The cited 2026 preprint exists and supports the representation/continuity discussion: [arXiv:2604.16653](https://arxiv.org/abs/2604.16653). |
| `RubTomGui00` | Commented historical ground-metric sentence | Key resolves but is inactive and creates no rendered claim. |

## Notation, dimension, and normalization audit

| Topic | Check | Result |
|---|---|---|
| Probability normalization | Histogram, gene, document, empirical-token, and empirical-DRO weights sum to one. | Correct. |
| Discrete gluing dimensions | `P` is `n x p`, `Q` is `p x m`, `S` is `n x p x m`, and `R` is `n x m`. | Correct. |
| Zero shared masses | `1/b_j` is set to zero and both incident coupling slices vanish. | Correct. |
| Wasserstein powers | Definitions consistently distinguish `W_p` from the linear objective `W_p^p`. | Correct. |
| Means and covariance | Euclidean means require `p >= 1`; the CLT covariance normalization is the identity. | Correct. |
| TV normalization | The book uses the total variation norm of a signed measure, so mutually singular probabilities have norm 2 and discrete-cost value `TV/2`. | Correct. |
| CLT lattice heights | Binomial atom mass is divided by lattice spacing `2/sqrt(n)` before density comparison. | Correct. |
| DRO radii | The constrained finite-`p` ball uses `W_p^p <= rho^p`, but its exact dual includes an unstated zero-radius endpoint; the endpoint proposition also omits `rho>=0`. | CH4-001 and CH4-002. |
| Functional rate | The Holder exponent multiplies the empirical scale exponent as `r_(n,p,d)^eta`; no power is lost for `n>=2`, the imported domain. | CH4-009 only at `n=1`. |
| Particle polynomials | Order is particle arity, not spatial polynomial degree. | Correct. |
| Attention dimensions | Intended matrices are `Q,K:R^d -> R^r`, `V:R^d -> R^d`; dot products and output dimensions agree. | Linearity must be stated: CH4-007. |
| Attention scaling | The standard `1/sqrt(r)` can be absorbed into one linear query/key matrix. | Correct. |
| Attention empirical normalization | The `1/n` cancels between numerator and denominator and reappears in the output empirical law. | Correct. |
| Markov kernels | `K(y,.)` is a probability law and the moment inequality guarantees output membership in `P_p`. | Correct. |
| Convolution constant | Translation kernels have exactly `W_p(K_y,K_y')=||y-y'||`; induced convolution constant is one. | Correct. |

## Topology and measurability audit

| Topic | Exact check | Result |
|---|---|---|
| Narrow convergence | Uses all bounded continuous test functions on a metric space. | Correct. |
| Weak-star terminology | Restricted explicitly to compact measure/function duality and otherwise called informal. | Acceptable. |
| Tightness/Prokhorov | Fixed coupling marginals on Polish spaces give tightness and weak compactness. | Correct where used. |
| Portmanteau | Applied to closed displacement sublevel sets with the correct upper-bound direction. | Correct. |
| Disintegration | Polish/standard-Borel hypotheses are present in continuous gluing and empirical `W_infinity` proof. | Correct; endpoint definition scope is CH4-002. |
| General geodesic selection | The chapter conditions its non-Euclidean interpolation on a measurable choice of pointwise geodesics and does not assert such a selector on every geodesic space. | Correct. |
| Optimal coupling existence | Imported lsc-cost theorem applies to `d^p` on Polish spaces and finite moments. | Correct. |
| Completeness/compactness | Imported conventions state `P_p(X)` Polish for Polish `X` and compact for compact `X`; no unsupported local compactness assertion is made. | Correct. |
| Skorokhod representation | Polish hypothesis is present; almost-sure coupling is used only to prove convergence, not claimed as the original coupling. | Correct. |
| Uniform integrability | Tail criterion and Scheffe/Vitali passage are valid for the nonnegative `p`th-distance variables. | Correct. |
| Compact `P(X)` | Weak compactness and equivalence with every finite-`p` Wasserstein topology are used correctly. | Correct. |
| `0/1` cost | Diagonal is measurable on a standard Borel product, but the discrete metric is not generally Polish on an uncountable set. | CH4-004. |
| DRO pointwise envelope | For finite empirical support, no measurable selector across `i` is needed; for a general nominal law it would be. Value duality and optimizer existence are separated in CH4-001. | CH4-001. |
| `W_infinity` threshold | Exact threshold attainment and gluing are justified on Polish Borel spaces, not on the arbitrary-metric domain stated. | CH4-002. |
| Mean-field push-forward | Requires Borel representatives; linear matrices supply them. | CH4-007 repair. |
| Markov optimal-plan selector | Polish spaces and measurable probability kernels provide the required selector. | Correct. |

## Boundary and equality-case audit

| Case | Result |
|---|---|
| `p=1` | Minkowski, topology, DRO Lipschitz, and Markov-map arguments remain valid. |
| `p=q` | Comparison is equality, but `diam(X)^0` at zero diameter needs CH4-008. |
| `p -> infinity` | Correct on bounded Polish spaces after the compactness scope in CH4-002 is stated. |
| Zero histogram entries | Discrete gluing handles them explicitly and correctly. |
| Identical measures | Diagonal coupling gives zero and definiteness arguments recover equality. |
| Singleton ground space | All probability distances vanish, but two comparison statements need CH4-008. |
| Zero TV residual | Proof separately uses the diagonal coupling; no division by zero occurs. |
| `rho=0` | The finite-`p` ambiguity ball is the singleton empirical law; CH4-001's discontinuous-loss example shows that the cited positive-radius measurable theorem cannot simply be extended to zero without closure regularity. |
| Negative `rho` | Not meaningful for a radius; explicitly exclude in CH4-002. |
| `eta=1` | Gives the stated Lipschitz endpoint. |
| `eta>1` | Subdivision argument correctly forces constancy along geodesics. |
| `n=1` particle operator | The operator and general expectation bound are meaningful, but imported `r_(n,p,d)` is undefined there; CH4-009. |
| Atom collisions under push-forward | Number of represented atoms may decrease; text already states this. |
| Attention denominator | On compact support with linear matrices it is at least `exp(-A_R)`. |
| Convolution equality | Kernel translate distance equals the displacement for every finite `p`; the induced law map need only be non-expansive, as stated. |

## Complexity audit

- No chapter algorithm, pseudocode, stopping rule, or complexity theorem is present.
- The finite-dimensional discrete OT and threshold-feasibility comments do not assert
  an unproved runtime.
- The empirical polynomial `B_n` is constructive as an expectation over `X^n`, but
  the chapter correctly warns that representation of a generic `m`-body kernel can
  dominate cost.
- The exact relationship among interaction order, parameter count, approximation
  norm, and intrinsic dimension is intentionally informal; see RQ4-001.
- The DRO figure's alternating projected routine is a visualization heuristic, not an
  algorithmic theorem; its lack of global certificate is part of CH4-003.

## Prioritized repair order

1. **CH4-001:** Replace "usual assumptions" with an exact positive-radius duality
   theorem, a separate zero-radius statement, and explicit finiteness/attainment
   clauses.
2. **CH4-002:** Put `W_infinity` on a Polish Borel domain, call it an extended metric,
   prove threshold attainment/metric axioms/finite-`p` limit, and require `rho>=0`.
3. **CH4-007:** Declare `Q`, `K`, and `V` linear matrices. This one-line change closes
   every attention measurability, boundedness, operator-norm, and derivative use.
4. **CH4-009:** Restrict the imported empirical-rate display to `n>=2`.
5. **CH4-004:** Recast the TV identity as a measurable-cost Kantorovich value or
   restrict its `W_p` interpretation to countable discrete spaces.
6. **CH4-008:** Separate `p=q` and singleton comparison cases.
7. **CH4-003:** Identify the DRO visualization as a restricted projected heuristic
   and its RMS as the displayed feasible coupling's cost.
8. **CH4-005:** Replace or supplement the citation with the direct ACL GW alignment
   paper.
9. **CH4-006:** Remove the inaccurate conic-gluing proof description.

## Historical audit reconciliation and closure (pre-correction)

### Finding arithmetic

- Active defect IDs are contiguous: `CH4-001` through `CH4-009`.
- Second-pass dispositions cover every old hypothesis `CH4-001` through `CH4-008`.
- Retired IDs: none. The old mathematical reading inside CH4-003 is explicitly
  rejected, but the ID remains active as a narrowed numerical-provenance defect.
- Critical IDs: none; count 0.
- Major IDs: none; count 0.
- Moderate IDs: `CH4-001`, `CH4-002`; count 2.
- Minor IDs: `CH4-003`, `CH4-004`, `CH4-005`, `CH4-006`, `CH4-007`,
  `CH4-008`, `CH4-009`; count 7.
- Total active defects: `0 + 0 + 2 + 7 = 9`.
- Research/scope IDs: `RQ4-001`; count 1; excluded from defect totals.
- Validated-correct ledger IDs: `VC4-001` through `VC4-034`; count 34.

### Inventory arithmetic

- Structural coverage: chapter opening, 5 sections, and all 21 paragraph units.
- Theorem-style environments: 39 total = 2 lemmas + 12 definitions + 15
  propositions + 1 corollary + 6 remarks + 3 examples.
- Proof environments: 18, all audited.
- Mathematical displays: 104, `D001` through `D104`, all inventoried.
- Algorithms/pseudocode: 0.
- Figures: 4 figures and 17 referenced PDF panels, all checked against 4 generators;
  3 additional retained DRO diagnostic PDFs were also hashed and inspected.
- Distinct referenced labels/equations: 57, `R001` through `R057`, all resolved.
- Citation keys: 31 active + 1 commented = 32; all bibliography entries resolve.

### Report reconciliation

- First-pass report at entry: 808 physical lines; 59,644 bytes; SHA-256
  `c74e159731806bd7baa5d4966fd09aac43022270239632ed2e24a50b957203aa`.
- Rewritten second-pass report: `944` physical lines; `74545` bytes. These values
  are mechanically reconciled after serialization.
- Heading/register checks: 9 unique active `CH4` finding headings, 1 unique `RQ4`
  heading, 34 unique `VC4` ledger rows, 39 `E` rows, 18 `P` rows, 104 `D` rows,
  4 `F` rows, and 57 `R` rows.
- Content checks: ASCII-only text; all sections are complete; finding IDs are unique;
  every finding has a severity and a completed disposition.

### Source integrity during the audit phase

- Source before audit: 1,427 physical lines; 89,276 bytes.
- Initial source SHA-256:
  `4c7e46a906dd8e50ed710d0655af31bef0f22cbb43d301cef2bfae6199c202a0`.
- Source after audit: 1,427 physical lines; 89,276 bytes.
- Final source SHA-256:
  `4c7e46a906dd8e50ed710d0655af31bef0f22cbb43d301cef2bfae6199c202a0`.
- Hash reconciliation: initial and final hashes are identical; the source was
  preserved byte-for-byte.
- The source's pre-existing modified Git state was not reverted, staged, or edited.
- The only workspace file modified by this second-pass audit is
  `/Users/gpeyre/Dropbox/github/ot4ml/audit-chap4.md`.
- Bibliography, notebooks, figures, assets, auxiliary files, generated files, and all
  other workspace files were read-only.
- Write-scope reconciliation: exactly one workspace path was written; every other
  read or diagnostic output was outside the workspace in `/tmp`.

## Post-correction validation - 2026-08-26

The historical counts and hashes immediately above describe the read-only audit
phase. The subsequent correction pass changed the chapter source and bibliography as
recorded at the start of this report.

- Re-read every edited statement and proof against its corresponding finding. All
  nine correction IDs `CH4-001` through `CH4-009` are now resolved; no active chapter-4
  defect from this audit remains.
- Checked the edited LaTeX and bibliography with a targeted whitespace/error pass;
  the authored files pass `git diff --check`.
- Built the complete manuscript in a clean temporary tree with a freshly generated
  bibliography and index. `latexmk` completed successfully and produced a 484-page
  PDF.
- The final LaTeX log contains no undefined references, undefined citations,
  multiply defined labels, overfull boxes, LaTeX errors, or package errors.
- Confirmed that `AlvarezMelisJaakkola2018Gromov` is present in the generated
  bibliography and resolves at its chapter-4 citation.
- Visually inspected the rendered pages containing the revised TV proposition, DRO
  duality theorem and figure, `W_infinity` definition and endpoint theorem, empirical
  robust envelope, and particle-polynomial rate. The statements, proofs, equations,
  cross-references, and page breaks render correctly.
- The corrected chapter source has 1,467 physical lines and 93,319 bytes, with
  SHA-256 `47134ab15f5174c784c094d63adb4756428de8b3b5f915c202bd4133aaf58ff0`.

The separate scope question `RQ4-001` remains a possible future extension rather than
a mathematical defect in the chapter.

## Correction refinement pass - 2026-08-26

A second independent derivation of every corrected item confirmed the nine resolved
findings and exposed no new defect. The following refinements make the repaired
statements more self-contained and remove remaining ambiguity.

- `CH4-001`: expanded the DRO proof to derive finiteness and attainment of the scalar
  dual minimum. The growth assumption gives a finite objective for all sufficiently
  large multipliers; the objective is lower semicontinuous and convex; and the
  positive radius makes it coercive. The zero-radius discussion is now exact: upper
  semicontinuity and the same growth bound give equality with an infimum, which need
  not be attained. A bounded measurable counterexample shows that value equality can
  fail without upper semicontinuity.
- `CH4-002`: quantified `alpha` and `beta` inside the `W_infinity` proposition rather
  than inheriting them from the preceding definition, separated the trivial
  infinite-valued branch of the triangle inequality, and pointed explicitly to
  finite-order optimal-plan existence in the proof of the large-exponent limit.
- `CH4-004`: added the standard-Borel diagonal-measurability justification needed to
  define the `0/1` cost and the diagonal submeasure used in the TV proof.
- `CH4-007`: repeated the matrix dimensions of `Q`, `K`, and `V` in the compact-support
  stability proposition, making that theorem independent of surrounding prose.
- `CH4-008`: made the bounded-space comparison a single self-contained proposition
  for `p <= q`, with the Holder estimate restricted to `p < q` and the identity case
  stated and dispatched separately. The pitch now says precisely that the metrics
  are topologically equivalent but generally not bi-Lipschitz equivalent.

Validation of this refinement pass:

- The authored chapter and bibliography pass the targeted `git diff --check`.
- A clean full-manuscript `latexmk` build completed successfully and produced a
  484-page PDF.
- The final log contains no undefined references or citations, multiply defined
  labels, overfull boxes, LaTeX errors, or package errors.
- Rendered pages 72--85 were inspected, including every refined proposition and the
  complete attention proof; equations, references, boxes, and page breaks remain
  clean.
- The refined chapter source has 1,473 physical lines and 94,609 bytes, with SHA-256
  `f64fb7174963de399146dc787648905d4cf84ca6c0b5ac0822054e2896c9c666`.

This refinement hash supersedes the chapter-source hash recorded by the immediately
preceding validation pass. The status remains: `CH4-001` through `CH4-009` resolved,
zero active audit defects, and `RQ4-001` retained only as an optional scope extension.
