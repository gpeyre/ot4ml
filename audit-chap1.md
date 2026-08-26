# Independent Audit of Chapter 1: Optimal Matching between Point Clouds

## Scope and source identity

This report audits the current on-disk file
`/Users/gpeyre/Dropbox/github/ot4ml/OT4ML/sections/matching.tex`, not Git HEAD.
The audit covers all 639 physical lines, all mathematical claims and proof steps,
all four algorithms, all six figures and 23 included PDF panels, all labels and
cross-references, and all nine distinct citation keys. Imported notation,
cross-referenced definitions and results, generator notebooks, retained figure
outputs, bibliography records, and the primary literature needed to check the
specialized concave-line and circle claims were inspected read-only.

Source identity at audit start:

| Item | Value |
|---|---|
| Physical lines | 639 |
| Bytes | 43,151 |
| Initial SHA-256 | `e0115196571fcd2336dbbb3e0da5bae3413f2fe32abcf7ddc8ec661a6878d529` |
| Supplied baseline match | Yes |
| On-disk modification time observed | 2026-08-08 13:04:47 +0200 |

## Method

1. I froze line count, byte count, and SHA-256 before reading any dependency.
2. I read the source line by line and inventoried every structural unit,
   theorem-like environment, proof, display, algorithm, figure, label, reference,
   and citation.
3. I independently re-derived the assignment orientation, one-dimensional exchange
   inequalities, equality cases for absolute cost, circle cut reduction, planar
   uncrossing, assignment dual certificate, and every Hungarian invariant.
4. I checked specialized claims against the cited primary papers, notably Delon,
   Salomon, and Sobolevski on concave costs; Rabin, Delon, and Gousseau on the
   circle; Delon, Salomon, and Sobolevski on circular Monge costs; and Ottolini and
   Steinerberger on greedy concave matching.
5. I inspected all six generator notebooks and shared generator code, checked the
   retained PDFs and byte-identical arXiv copies, rendered every included panel,
   and ran bounded in-memory diagnostics. No expensive experiment was executed.
6. Bounded checks included 14,422 small alternating-chain instances for the local
   indicator rule, 39,830 rational-grid circle instances for the cyclic-shift
   theorem, direct numerical reconstruction of every figure's data, and invariant
   checks for the Hungarian figure.
7. I then performed an adversarial second reread, tried to falsify each provisional
   issue, merged symptoms with the same root cause, and removed claims contradicted
   by either derivation or diagnostics.

Severity follows the requested scale. A defect is counted once at its root cause.
The RQ items below are scope questions, not defects.

## Executive summary

| Severity | Count |
|---|---:|
| Critical | 0 |
| Major | 0 |
| Moderate | 3 |
| Minor | 2 |
| **Total established defects** | **5** |

The central strict-convex one-dimensional theorem, the circle cyclic-shift theorem,
the planar uncrossing proposition, the assignment dual certificate, and the
Hungarian algorithm are mathematically correct. The main defects concern atomic
data: a labeled assignment is identified with a deterministic Monge map even when
source locations repeat, the histogram figure states a literal CDF-quantile map
that its tie-broken generator does not implement, and the concave-chain algorithm
does not state the disjoint/distinct support preprocessing required by its cited
theory. The circle theorem is correct, but its proof suppresses the key propagation
and open-gap argument. The two minor findings are a missing positive-size boundary
and a missing strict-convex-position hypothesis in the Catalan illustration.

## Correction implementation record

**Implementation date:** 2026-08-26
**Status:** all five established findings have been resolved in the authoritative
Chapter 1 source. The detailed findings below are retained as the diagnostic record
of the audited baseline; their physical line references and quoted wording therefore
refer to the initial SHA-256 recorded above, not to the corrected file.

| Finding | Status | Correction implemented |
|---|---|---|
| CH1-001 | Resolved | The assignment problem now associates a permutation with the empirical coupling $\pi_\sigma$ in general and identifies it with a Monge map only when the source locations are pairwise distinct. The histogram construction explicitly defines $\alpha_N$, $\beta_N$, and their quantile coupling $\pi_N$, and distinguishes this coupling from the atomless formula $Q_\beta\circ F_\alpha$. The text now also separates two effects of an intensity tie: reordering tied labels leaves $\pi_N$ unchanged but changes the spatially labeled output image. The notebook explanation and figure caption use the same convention. |
| CH1-002 | Resolved | The concave-cost discussion and Algorithm 1.2 normalize finite $g(0)$, cancel coincident source-target copies, require the remaining unit-mass support locations to be pairwise distinct, and direct repeated same-color locations to the positive-mass weighted formulation after aggregation. Cancellation is now justified by the subadditivity of $\widetilde g=g-g(0)$ and an explicit two-pair exchange, and it is included in the pseudocode initialization. |
| CH1-003 | Resolved | The circle proof supplies the omitted orientation-propagation argument: the local predecessor/successor alternative propagates around the cycle, and an explicitly defined cyclic reassignment strictly shortens every arc. It then constructs an open endpoint-free gap from an uncovered source before applying one-dimensional monotonicity. Cyclic indexing is explicit, and Algorithm 1.3 now states the pairwise-distinctness hypothesis needed for the returned cut. |
| CH1-004 | Resolved | Definition 1.1 now assumes $n\geq1$, and the text explicitly obtains existence of an optimizer from the nonempty finite set $\operatorname{Perm}(n)$. |
| CH1-005 | Resolved | The Catalan illustration now places the alternating colors at the vertices of a strictly convex $2n$-gon and defines non-crossing chords by disjoint relative interiors, exactly the geometric setting used by its recurrence. |

### Second-pass refinement

A second mathematical and editorial pass did not reopen any finding. It strengthened
the repairs in four ways: it wrote the empirical histogram coupling itself rather
than only describing it; corrected the subtle distinction between tie-order
invariance of that coupling and tie-order dependence of the labeled image; proved
the concave-cost cancellation step from subadditivity; and made both the cyclic
reassignment and the endpoint-free cut in the circle proof directly auditable.
The surrounding prose was split and tightened, ``arbitrary real masses'' was
corrected to ``arbitrary positive masses,'' and the circle algorithm's input was
aligned with the proposition it implements.

The three research questions in this report were intentionally left unchanged:
they are possible extensions or scope choices, not defects in Chapter 1.

### Verification of the corrected chapter

| Check | Result |
|---|---|
| Corrected source | `OT4ML/sections/matching.tex`: 653 physical lines, 47,955 bytes, SHA-256 `91a8951bf73da19a3edb06557d0e163341a26c6d4da8adac5852b15b4ba36125` |
| Synchronized notebook | `notebooks-figures/monge-histogram-equalization.ipynb`: valid JSON and successful clean execution, SHA-256 `401b91f8df40fcd32aba948f6adf749381dc2d8b29163913029c5e03792bdb6b` |
| Targeted mathematical checks | Passed 4,877 repeated-support concave assignments, 7,350 rational circle assignments, Catalan enumeration through $n=7$, and the coupling-versus-labeled-image tie-order test |
| Full LaTeX build | Successful: 482-page PDF; no LaTeX errors, undefined references or citations, duplicate labels, or overfull boxes |
| Visual inspection | Chapter 1 pages rendered and inspected; no clipping, obstructive whitespace, or malformed theorem, algorithm, caption, or figure layout was found |
| Whitespace validation | `git diff --check` passed for all corrected artifacts |

**Open established findings after implementation: 0.** Generated arXiv and MyST
mirrors were not regenerated in this correction pass; the source above remains the
authoritative manuscript file.

## Established findings

### CH1-001 - Atomic samples are conflated with deterministic Monge maps

**Severity:** Moderate

**Current locations:** lines 19 and 35, paragraph `Assignment problem`; lines
199-207, paragraph `Histogram equalization`; lines 209-227, Figure 1.3,
`fig:monge-histogram-equalization`, especially caption line 222.

**Problematic claims:** line 35 says that the labeled permutation problem is the
Monge problem between the two empirical measures without a distinct-source
hypothesis. Figure 1.3 then says that its image operation is the map
`T=Q_beta o F_alpha`, using the later standard CDF and quantile definitions, even
though the actual image histogram is highly atomic and the generator splits ties.

**Derivation and counterexample:** take `x_1=x_2=0`, `y_1=-1`, and `y_2=1`.
The assignment problem has feasible permutations and induces the coupling

`pi=(delta_(0,-1)+delta_(0,1))/2`.

But the empirical source measure is `alpha=delta_0`. For every deterministic map
on the intensity line, `T_# alpha=delta_{T(0)}`, so it cannot equal
`beta=(delta_{-1}+delta_1)/2`. Thus a labeled permutation always gives a
Kantorovich coupling, but it gives a Monge map on the geometric support only when
all copies of each repeated source location are sent to one target location with
compatible mass.

The retained histogram generator makes the same distinction concrete. Its
`126 x 126` image has `N=15,876` pixel samples but only 201 distinct intensity
values; 15,868 pixels belong to a nontrivial tie, and the largest tie has 807
pixels. The code assigns stable midpoint ranks `(k+1/2)/N`, producing 15,876
distinct target quantiles. In contrast, the right-continuous empirical CDF defined
later is constant on each intensity tie and `Q_beta(F_alpha(I))` can produce at
most 201 values. Direct comparison found all 15,876 generated values different
from that literal formula, with maximum absolute discrepancy `0.4267582123`.
The generator is a valid optimal tie-broken empirical quantile coupling; it is not
a deterministic function of intensity equal to the displayed composition.

**Smallest correct repair:**

- At line 35, replace the unconditional Monge identification by: the permutation
  induces an admissible empirical coupling; if the source locations are pairwise
  distinct, it is the graph of a Monge map on their support.
- At lines 202 and 222, distinguish the atomless formula from the empirical
  tie-broken construction. State the implemented rule explicitly: stably order the
  labeled pixels, use `u_k=(k-1/2)/N`, and assign `Q_beta(u_k)`. Call the resulting
  target `beta_N`, the midpoint-quantile empirical approximation of `beta`, and
  call the operation a coupling or a map on labeled pixels, not a deterministic
  map on intensity values.

**Downstream impact:** the present wording blurs the central Monge-versus-
Kantorovich distinction that motivates the next chapters, misstates what happens
at image ties, and hides the dependence of the interpolated image on the chosen
spatial tie order. The optimal histogram evolution as a distribution remains
valid after the repair.

### CH1-002 - The concave local-indicator algorithm omits required support preprocessing

**Severity:** Moderate

**Current locations:** lines 89-114, paragraph `Concave costs on the line`; lines
121-166, Algorithm 1.2, `alg:concave-line-local-indicators`, especially its input
at line 122 and chain construction at lines 126-128.

**Problematic claim:** the algorithm accepts arbitrary two `n`-point unit-mass
clouds on `R`, but the balanced-neighbor construction and the displayed chain
`p_1<q_1<...<p_N<q_N` require strict, disjoint support positions after
preprocessing. No rule is given for a source and target at the same coordinate,
or for repeated positions within one color.

**Derivation and counterexample:** for `X={0,2}` and `Y={0,1}` with
`g(r)=sqrt(r)`, the optimum first matches the coincident red-blue pair at zero and
then matches `2` to `1`. In the algorithm as written, the target at zero is neither
a left nor a right neighbor of the source at zero, because both definitions use a
strict side and an open intervening interval. The asserted chain partition is
therefore not defined on this allowed input. Repetitions within one color similarly
destroy the strict chain order; aggregating them changes the problem from unit
masses to integer or real masses.

The cited primary paper explicitly removes common source-target mass first and
then assumes disjoint supports before defining strict chains. Its weighted
stratification handles aggregated masses separately. The chapter's indicator
formulas and negative-indicator theorem agree with that paper once these hypotheses
are imposed. Independent tests found no algorithmic failure on 7,200 random and
7,222 exhaustive small strict alternating chains.

**Smallest correct repair:** add a preprocessing step and an exact input contract.
Cancel coincident source-target copies, require the remaining combined unit support
to be pairwise distinct, and state that repeated same-color positions must either be
kept as an explicitly proved labeled limiting convention or aggregated and sent to
the weighted stratified algorithm. Then define the orientation of every resulting
strict chain before applying the displayed indicators.

**Downstream impact:** without the repair, Algorithm 1.2 is not a total algorithm
on its stated input and its `O(n^2)` bound does not apply to repeated-support cases.
The theorem and complexity remain correct on the repaired strict unit-mass domain;
the cited weighted extension retains its `O(n^3)` worst-case bound.

### CH1-003 - The circle proof skips the propagation and open-cut steps needed for its conclusion

**Severity:** Moderate

**Current locations:** lines 277-303, Proposition 1.4,
`prop-circle-ot-cut`, especially proof lines 295-300.

**Problematic proof step:** line 298 moves directly from pairwise path uncrossing
and coverage of the circle to the global dichotomy
`x_(k+1) in gamma_(k)` for every `k`, or the backward analogue. It then concludes
only that some point is outside the open arcs, while the proposition requires a cut
outside all `2n` endpoints as well.

**Proof gap:** the cited pairwise lemma says that intersecting optimal geodesic
arcs have one orientation and are not strictly nested. It does not, without the
omitted cyclic-order argument, immediately imply a common orientation and the
specific neighboring-source relation. The required argument is:

1. If the open arcs cover the circle, each source lies in another arc because its
   own arc omits its endpoint.
2. Compare that containing arc with the source's own arc. The pairwise lemma gives
   a common orientation; cyclic source order plus noncontainment forces the
   containing arc to be the predecessor arc in the positive case or the successor
   arc in the negative case.
3. One such relation propagates around the finite cycle. Reassigning every target
   to the next source then strictly shortens every arc, contradicting optimality.
4. Once coverage is excluded, pairwise distinct finite endpoints imply that the
   complement contains an open subarc: if a complementary point is an endpoint,
   no other arc can cross it, so the side not occupied by its unique incident arc
   contains a gap. A point in that gap is the required endpoint-free cut.

This is the substance of the longer Appendix argument in the cited Rabin-Delon-
Gousseau paper. The theorem itself checked out: exhaustive exact squared-distance
tests on 39,830 small rational-grid circle instances, including antipodal edges and
multiple optima, found every optimum to be a cyclic shift.

**Smallest correct repair:** insert the four-step propagation and open-gap argument
above, or explicitly cite the exact proposition from the primary source and state
that it supplies an open endpoint-free gap, not merely a point outside the open
paths.

**Downstream impact:** Proposition 1.4 and Algorithm 1.3 are correct, but the
present proof does not establish the exact cut asserted by the statement. The
repair closes a logical gap and makes antipodal and endpoint cases auditable.

### CH1-004 - The positive-size assumption and finite existence are implicit

**Severity:** Minor

**Current locations:** lines 27-35, Definition 1.1,
`def-optimal-assignment`; lines 509-514, Algorithm 1.4,
`alg:hungarian-primal-dual`.

**Problematic boundary:** no line states `n>=1`. For `n=0`, the factor `1/n` in
Equation (1.1) is undefined, the empirical measures in line 35 are undefined, and
the Hungarian initialization `f_i=min_j C_ij` has no row minimum. The definition
also relies on, but never records, existence of a minimizer.

**Derivation:** for every integer `n>=1`, `Perm(n)` is a nonempty finite set of
size `n!`, and every entry of `C` is finite because `C in R^(n x n)`. Hence the
minimum is attained. No compactness or additional cost hypothesis is needed.

**Smallest correct repair:** begin Definition 1.1 with `Let n>=1` and add one
sentence that finiteness of `Perm(n)` gives existence. Reuse that convention in
all four algorithms.

**Downstream impact:** none for ordinary positive-size use; this removes an avoidable
formal boundary failure and makes the Hungarian theorem's quantifier exact.

### CH1-005 - The Catalan count needs strict convex position

**Severity:** Minor

**Current locations:** lines 392-408, including Remark 1.6, `Catalan count of
alternating non-crossing matchings`.

**Problematic claim:** the text places alternating points merely on the boundary of
a convex polygon and uses the Catalan count to quantify the matchings that survive
the preceding prohibition of proper crossings. The standard recurrence assumes the
`2n` points are vertices in strict convex position, so that every interior
intersection is a proper crossing and each chord genuinely separates the remaining
vertices into two subpolygons.

**Counterexample:** put six alternating red-blue points in order on one straight
edge of a convex polygon. All `3!=6` bipartite perfect matchings have collinear
supporting lines and therefore none has a proper crossing as defined in Proposition
1.5. But `C_3=5`. Thus the stated geometric condition is too weak for the count and
for the transition from "no proper crossings" to standard non-crossing matchings.

**Smallest correct repair:** say "the vertices of a strictly convex `2n`-gon,
colored alternately" and use non-crossing to mean disjoint relative interiors. The
recurrence and asymptotic formula then apply exactly.

**Downstream impact:** only the illustrative counting argument is affected. The
intended conclusion that a local non-crossing filter leaves exponentially many
candidates remains valid under the repaired configuration.

## Research and scope questions

These items are not defects and are excluded from all severity counts.

### RQ1 - How much of the `W_1` equality set should Chapter 1 characterize?

The book-shifting example is correct but intentionally non-exhaustive. For a plan on
the line, write `R(t)` and `L(t)` for mass crossing the cut `t` rightward and
leftward. Then

`cost = integral (R(t)+L(t)) dt`, while
`F_alpha(t)-F_beta(t)=R(t)-L(t)`.

Thus a plan is `W_1`-optimal exactly when `R(t)L(t)=0` for almost every `t`: no cut
carries positive mass simultaneously in both directions. In the discrete
book-shifting example `beta` is stochastically to the right of `alpha`, so the exact
permutation condition reduces to `y_{sigma(i)}>=i` for every `i`. It is a scope
choice whether to state this full equality characterization here or leave it to the
later coupling chapter.

### RQ2 - Should the practical circle algorithm remain the transparent quadratic one?

Algorithm 1.3 deliberately enumerates `n` shifts and then searches for a compatible
cut in `O(n^2)` time. The cited weighted-histogram literature supplies faster
shift-parameter methods. Replacing the transparent algorithm is not required for
correctness; the editorial question is whether Chapter 1 should distinguish more
prominently between the pedagogical direct algorithm and the best cited complexity.

### RQ3 - Should implementation-level numerical policy be stated for Hungarian?

The pseudocode and proof are correct in exact real arithmetic. A floating-point
implementation cannot safely test `ell_k=0` literally and needs tolerances or a
careful shortest-augmenting-path implementation. This is not a theorem defect under
the standard real-RAM convention, but an implementation note would prevent readers
from transcribing the exact comparisons naively.

## Validated-correct ledger

The following important claims were independently re-derived and survived the
adversarial reread.

| ID | Lines | Claim checked | Independent validation |
|---|---:|---|---|
| VC-01 | 28-35 | Assignment orientation is source `i` to target `sigma(i)` and the `1/n` factor does not change minimizers. | Direct substitution; the induced empirical object is always a coupling. Existence holds for `n>=1` by finiteness. |
| VC-02 | 41-59 | Strictly convex difference cost has the unique equal-rank assignment for pairwise distinct clouds. | For an inversion `x<x'`, `y<y'`, the old-minus-swapped cost is `d(D(x'-y)-D(x-y))>0`; the displayed signs and arguments are correct. |
| VC-03 | 61-85 | Convex, not necessarily strict, costs admit rank matching, with permutation `sigma_Y o sigma_X^{-1}`. | Bubble-sort exchanges are non-increasing; the composition has the correct orientation. Comparison sorting gives `O(n log n)`. |
| VC-04 | 89-166 | The two local-indicator formulas and certified blocks agree with the primary theorem on strict alternating chains. | Index-by-index comparison with Definition 3.1 and Theorem 3.2 of the cited paper; 14,422 bounded small-chain tests had zero failures. |
| VC-05 | 184-197 | Common quantile levels produce the displayed equal-rank assignments for the two smooth-law panels. | Generator uses 52 midpoint levels and monotone numerical inverse CDFs in each panel. |
| VC-06 | 199-202 | A common strictly increasing coordinate change preserves rank order, and `h(|u-v|)` is convex when `h` is convex and nondecreasing on `R_+`. | Composition with absolute value is convex under the stated monotonicity; sorting remains optimal. |
| VC-07 | 232-263 | Discrete book-shifting is a bijection and has the same `W_1` cost `m`; for `p>1` its cost is `2^(p-1)m^p`. | Target-minus-source mean is `m`; equality in `|d|>=d` holds for both displayed maps. All arithmetic is correct. |
| VC-08 | 268-303 | For `p>1` and pairwise distinct circle points, every optimum is a cyclic shift and admits a compatible cut. | Primary theorem plus 39,830 exact small-grid cases. The hypothesis is sharp: for `p=1`, `X=(0,1,2)`, `Y=(3,4,5)` on a six-site circle has a non-cyclic optimum `(5,4,3)`. |
| VC-09 | 305-333 | Direct circle enumeration and cut search are exact and `O(n^2)` after sorting. | There are `n` shifts with `n` costs each and at most `2n` gaps with `n` arc tests each. Antipodal arcs can be oriented away from an endpoint-free test cut. |
| VC-10 | 372-390 | Proper crossings cannot occur for Euclidean-distance optimal matchings in `R^2`. | Reconnecting at the interior crossing gives two triangle inequalities; distinct supporting lines make at least one strict. Collinear overlap is correctly excluded. |
| VC-11 | 395-406 | The Catalan recurrence and asymptotic are correct under strict convex position. | Fixing one red vertex yields `M_n=sum M_k M_(n-1-k)` and hence `C_n=(1/(n+1)) binom(2n,n)`. |
| VC-12 | 429-464 | Assignment dual signs, weak-dual bound, tight-edge certificate, and equality characterization are correct. | Summing `f_i+g_{tau(i)}<=C_{i,tau(i)}` uses the permutation once in each target coordinate; the gap is a sum of nonnegative slacks. |
| VC-13 | 468-503 | Hungarian slack definition, equality graph, dual shift signs, and objective ascent are correct. | Slacks change by `0,-delta,+delta,0` on `SxT`, `SxT^c`, `S^cxT`, `S^cxT^c`; `|S|=|T|+1` gives objective increase `delta`. |
| VC-14 | 509-568 | Hungarian pseudocode maintains valid parent pointers and flips a genuine augmenting path. | Every reached non-root source has exactly its matched predecessor `q(i)`; each selected target has a tight parent `p(j)`. The backward loop terminates at the root. |
| VC-15 | 594-637 | Hungarian termination, certificate, `O(n^3)` operations, and `O(n^2)` storage are correct in exact arithmetic. | At most `n` target additions per phase, one augmentation per phase, `n` phases, and `O(n)` maintained-slack work per inner iteration. |
| VC-16 | 170-366, 572-592 | Retained figure data, costs, colors, panel stages, and stated exponents agree with generators. | All 23 included PDFs rendered cleanly; generator-specific numerical checks are in the figure matrix below. |

## Structural-unit reconciliation

| Unit | Current lines | Contents | Audit disposition |
|---|---:|---|---|
| Chapter header and motivation | 1-13 | Chapter title, labels, scope, Hungarian/auction citations | Audited; correct. |
| Section 1.1 | 15-410 | Discrete Monge/assignment geometry | Audited in full. |
| Assignment problem paragraph | 22-35 | Definition, empirical interpretation, normalization, existence context | CH1-001, CH1-004. |
| Convex line paragraph | 37-85 | Strict theorem, proof, convex extension, sorting algorithm | Correct. |
| Concave line paragraph | 87-197 | Structural claims, indicators, algorithm, two figures | CH1-002; formulas otherwise correct. |
| Histogram paragraph | 199-227 | Increasing transforms, empirical histogram operation, Figure 1.3 | CH1-001. |
| Linear-cost paragraph | 229-263 | Book-shifting example and `p>1` comparison | Correct. |
| Circle paragraph | 265-347 | Circle theorem, proof, algorithm, Figure 1.4 | CH1-003; result and algorithm otherwise correct. |
| Planar exponent transition | 349-366 | Four-power Figure 1.5 | Correct and generator-matched. |
| Two-dimensional paragraph | 368-408 | Proper uncrossing and Catalan illustration | CH1-005; proposition correct. |
| Section 1.2 | 412-639 | Hungarian primal-dual method and synthesis | Audited in full. |
| Hungarian paragraph | 423-637 | Dual, invariant, pseudocode, figure, theorem, proof | Correct subject to CH1-004 and exact-arithmetic convention. |
| Closing synthesis | 639 | Geometry versus primal-dual labels | Correct. |

Counts: one chapter, two sections, eight explicit `paragraph` units, and one closing
synthesis line.

## Named and numbered environment reconciliation

| Printed number/type | Label or name | Lines | Status |
|---|---|---:|---|
| Definition 1.1 | `def-optimal-assignment` | 27-33 | Formula correct; CH1-004 boundary and CH1-001 interpretation. |
| Proposition 1.2 | `prop-matching-1d-monotone` | 41-49 | Correct. |
| Algorithm 1.1 | `alg:one-dimensional-sorting` | 69-85 | Correct. |
| Algorithm 1.2 | `alg:concave-line-local-indicators` | 121-166 | Correct on strict preprocessed chains; CH1-002 input defect. |
| Example 1.3 | `ex-book-shifting-w1` | 232-263 | Correct. |
| Proposition 1.4 | `prop-circle-ot-cut` | 277-293 | Statement correct; CH1-003 proof gap. |
| Algorithm 1.3 | `alg:circle-cut-assignment` | 305-331 | Correct. |
| Proposition 1.5 | `prop-planar-no-proper-crossing` | 372-375 | Correct. |
| Remark 1.6 | Catalan count | 399-406 | Recurrence correct under CH1-005 repair. |
| Proposition 1.7 | `prop-assignment-dual-certificate` | 438-453 | Correct. |
| Algorithm 1.4 | `alg:hungarian-primal-dual` | 509-568 | Correct for `n>=1` in exact arithmetic. |
| Proposition 1.8 | `prop-hungarian-correct` | 594-604 | Correct. |

The theorem counter and algorithm counter are internally consistent. The anchor
`rem-circle-ot-cut` is attached to an unnumbered paragraph, is unique, and is not
used by a TeX cross-reference; it functions as an HTML/index anchor rather than a
numbered remark.

## Proof reconciliation

| Proof | Lines | Obligations checked | Result |
|---|---:|---|---|
| Monotone matching | 50-59 | inversion existence, algebraic sign, strict secant monotonicity, finite termination, uniqueness | Complete and correct. |
| Circle cut | 295-303 | path lemma, coverage contradiction, endpoint-free cut, lifted optimality, cyclic shift | The theorem is correct, but propagation and open-gap implications are omitted: CH1-003. |
| Planar no proper crossing | 377-390 | crossing geometry, two triangle inequalities, strictness, swap | Complete and correct. |
| Dual certificate | 454-464 | feasibility sum, permutation reindexing, primal and dual optimality, equality iff all slacks vanish | Complete and correct. |
| Hungarian correctness | 606-637 | initialization, maintained minima, feasibility, tight matching, augmentation, termination, operation/storage count | Complete and correct for exact arithmetic and `n>=1`. |

Proof count: five; complete without defect: four; correct theorem with a localized
proof gap: one.

## Displayed-equation reconciliation

There are 25 display blocks: seven numbered and 18 unnumbered.

| ID | Lines | Label or content | Status |
|---|---:|---|---|
| D01 | 29-31 | `eq-optimal-assignment` | Correct; `n>=1` needed. |
| D02 | 44-47 | strict order-preservation condition | Correct under pairwise distinctness. |
| D03 | 54-57 | strict inversion exchange gap | Algebra and sign correct. |
| D04 | 62-66 | source/target sorting permutations | Correct. |
| D05 | 92-94 | strict balanced-chain order | Correct on CH1-002 domain. |
| D06 | 96-111 | `I_k^p(i)` and `I_k^q(i)` | Indices and signs match the primary source. |
| D07 | 238-244 | discrete book-shifting map | Correct bijection. |
| D08 | 246-251 | book-shifting average cost | Correct: `m`. |
| D09 | 253-258 | signed-mean lower bound | Correct, with exact equality condition that all displacements are nonnegative. |
| D10 | 269-273 | circle distance and `c_p` | Correct for circumference-one normalization. |
| D11 | 280-283 | cyclic-shift form | Correct when both orderings use the common circle orientation. |
| D12 | 285-290 | shift energy `E_s` | Correct orientation and modulo indexing. |
| D13 | 380-388 | planar reconnection inequalities | Correct. |
| D14 | 395-397 | Catalan formula and asymptotic | Numerically correct; geometric premise needs CH1-005. |
| D15 | 430-435 | `eq-hungarian-dual` | Correct unnormalized dual signs and dimensions. |
| D16 | 442-446 | `eq-assignment-dual-lower-bound` | Correct. |
| D17 | 448-451 | `eq-assignment-tight-certificate` | Correct. |
| D18 | 456-462 | proof of weak dual bound | Correct permutation reindexing. |
| D19 | 471-473 | `eq-hungarian-slack` | Correct and nonnegative under feasibility. |
| D20 | 475-481 | equality graph | Correct. |
| D21 | 491-496 | `eq-hungarian-dual-shift` | Correct update signs. |
| D22 | 500-502 | `eq-hungarian-maintained-slack` | Correct maintained minimum. |
| D23 | 599-602 | terminal tightness | Correct certificate. |
| D24 | 610-613 | maintained-minimum invariant | Correct. |
| D25 | 617-620 | inner-loop minimum and nonnegativity | Correct; `T` cannot exhaust all targets because `|S|=|T|+1`. |

## Algorithm reconciliation

| Algorithm | Input/output and invariant | Correctness | Exact complexity audit |
|---|---|---|---|
| 1.1 one-dimensional sorting, lines 69-85 | Sort rank-to-index maps and return `sigma_Y o sigma_X^{-1}`. | Correct for convex `h(x-y)`, including ties as labeled permutations. | Two comparison sorts plus linear pairing: `O(n log n)` time, `O(n)` permutation storage apart from input. |
| 1.2 concave local indicators, lines 121-166 | Negative indicators certify blocks after all required lower orders are nonnegative. | Correct on disjoint strict unit chains; input/preprocessing incomplete under CH1-002. Zero indicators are safely treated as nonnegative. | The cited table reuses unaffected entries and bounds cost evaluations/additions by `O(n^2)`; weighted stratification is `O(n^3)`. The bound does not cover the unstated duplicate preprocessing. |
| 1.3 circle cutting, lines 305-331 | Minimize all cyclic-shift energies and find an endpoint-free compatible cut. | Correct for `p>1`, common orientation, pairwise distinct points; antipodal arcs may be oriented away from the test cut. | Sorting `O(n log n)`; `n` energies of length `n` plus at most `2n` gap tests of `n` arcs: `O(n^2)` time and `O(n)` auxiliary storage. |
| 1.4 Hungarian, lines 509-568 | Maintain feasible `(f,g)`, tight partial matching `M`, alternating sets `(S,T)`, slacks `ell`, and parents `(p,q)`. | Correct for every finite real square cost matrix with `n>=1` in exact arithmetic. Handles negative costs and ties. | At most `n` inner iterations per phase, `O(n)` work each, and `n` phases: `O(n^3)` arithmetic/comparisons. Storage is `O(n^2)` including `C`, otherwise `O(n)` auxiliary. |

## Figure and generator reconciliation

All 23 cited PDFs exist, are one-page files produced by Matplotlib 3.10.8, render
without clipping or missing content, and are byte-identical to their corresponding
`arxiv/figures/<figure>--<panel>.pdf` copies. Colors agree with the shared style:
red source, blue target, violet transport, and green circle cut. Two legacy files
`convex.pdf` and `concave.pdf` in the first figure directory are not included by
this chapter and are excluded from the 23-panel structural count.

| Figure | Lines/panels | Generator and exact parameters | Independent match result | Status |
|---|---|---|---|---|
| Figure 1.1, `fig:matching-1d-convex-concave-costs` | 170-182; 2 panels | `matching-1d-convex-concave-costs.ipynb`; 42 common midpoint quantiles; SciPy assignment; `p=2,1/2`. | Quadratic panel is exactly rank matching with 0 inversions. Concave panel has 128 inversions, maximum edge `0.5802385`, and differs on 40 of 42 sources. | Caption correct. |
| Figure 1.2, `fig:matching-1d-quantile-assignment` | 186-197; 2 panels | `matching-1d-quantile-assignment.ipynb`; 52 levels `(k+1/2)/52`; 5,000-point CDF grid; stated two-mixture and one-to-three-mixture parameters. | Every segment joins common quantile rank; both panels are non-crossing. Smooth curves are the laws used for numerical inverse-CDF samples. | Correct. |
| Figure 1.3, `fig:monge-histogram-equalization` | 209-227; 8 panels | `monge-histogram-equalization.ipynb`; cat image resized to `126 x 126`; stable rank sort; truncated normal `mu=0.18`, `sigma=0.105`; `t=0,1/3,2/3,1`; 41 histogram bins. | Images, times, common vertical scale, and target-density overlay match. Generated target has mean `0.1900723`, standard deviation `0.0954463`, and range `[0.00003446,0.6012361]`. | Assets correct; map formula is CH1-001. |
| Figure 1.4, `fig:monge-circle-cut-unfolding` | 335-347; 2 panels | `monge-circle-cut-unfolding.ipynb`; seed 42; 54 sources in clusters `21/15/18`, 54 targets `15/21/18`; squared geodesic cost in radians; 108 gap candidates. | Chosen cut `4.69629052895` rad; global and enumerated total cost both `34.8438323461`; exact same 54 pairs as a global assignment solver. Maximum lifted edge `1.21124354<pi`, so no shortest edge crosses the cut. | Correct; radian scaling changes values only by a common factor relative to `R/Z`. |
| Figure 1.5, `fig:matching-2d-cost-exponent` | 351-366; 4 panels | `matching-2d-cost-exponent.ipynb`; canonical seed 2027; 36 disk and 36 annulus points; POT exact plans; `p=0.5,1,2,6`. | Each plan has exactly 36 edges of mass `1/36` and a unique assignment. Maximum edge lengths decrease `1.01136,0.96422,0.80120,0.76778`; adjacent assignments change on `14,18,19` sources. | Caption correct. |
| Figure 1.6, `fig:matching-hungarian-progression` | 572-592; 5 panels | `matching-hungarian-progression.ipynb`; same seed-2027 clouds; squared cost; states `0,9,18,27,36`; 72 lowest-slack unmatched edges. | Stored run reports primal-dual value `12.13332760` and minimum reduced cost zero. Stage counts, thick tight edges, thin candidate count, and final assignment match Figure 1.5's `p=2` optimum. | Correct. |

### Retained panel manifest

| Included panel | SHA-256 |
|---|---|
| `matching-1d-convex-concave-costs/mixture-convex.pdf` | `b3c4a8ce9c90ad3fa3d18255986e8de8a8d2f5c99b6415a8c9c0799c74c16f50` |
| `matching-1d-convex-concave-costs/mixture-concave.pdf` | `3d11d6f9e1df6613a250a8d20561d22e533a609df2ce92f0dd0b3be10d1bfb60` |
| `matching-1d-quantile-assignment/quantile-assignment.pdf` | `7a9b17239de9fa53bef8e4c17d78af48bf6dd682ff152f052f60f6129a216238` |
| `matching-1d-quantile-assignment/central-to-three-modes.pdf` | `3af57c342d5a588c493c8d2895750dcc941bfb85ed5def54e0760055a3a1271d` |
| `monge-histogram-equalization/image-t000.pdf` | `e271eb5b08aeb014eaaf5917005c8c793ccee127b52423228ca24464b786d66c` |
| `monge-histogram-equalization/image-t033.pdf` | `9b040ef47e196be3c1e91960b471a58a75e9e6c25c5f8f50d609f9d9995444d2` |
| `monge-histogram-equalization/image-t067.pdf` | `2e4f076e91e8fd4f885630c5e062f0117c0e734e62e77e1d30d35aa3e6e0c59d` |
| `monge-histogram-equalization/image-t100.pdf` | `965237c45737d995d729dd1347c13d0363e152bbe6aab80c108a001375063486` |
| `monge-histogram-equalization/hist-t000.pdf` | `604d972d431d54188cf21e8560f6b0c3ffd84b363244eb321168e7c1cb245952` |
| `monge-histogram-equalization/hist-t033.pdf` | `d6fe0d3bc74f047443b054464a8ac41680b5703888548199feb5849532ed40dd` |
| `monge-histogram-equalization/hist-t067.pdf` | `3e2788c6424f3b21e62f25729e92c65c9c1e1d859e095f7265a3ee7ba7d8399d` |
| `monge-histogram-equalization/hist-t100.pdf` | `07b6b57605418bcfd10c174d2f95c8c99d4b4a7002f4848986909efe29ed891c` |
| `monge-circle-cut-unfolding/circle.pdf` | `c49d2c6302ff051ec1674c393e9995145774799c90610296084e4401563cd251` |
| `monge-circle-cut-unfolding/unfolded.pdf` | `f5af43dc0a968d77db509c932d59bd4166c7c5ada3115aed1c54f05f92637dc3` |
| `matching-2d-cost-exponent/p0p5.pdf` | `e0650b158b720e6da07dc212051d59beaadd0d51a6995beea829f614e2c22909` |
| `matching-2d-cost-exponent/p1.pdf` | `f29003df880de756d98f23d9ceb4fdcd3df236bcf17947668dd8dc355e8f6781` |
| `matching-2d-cost-exponent/p2.pdf` | `64681e8b95fcb18fecbc332193c85176cca466763328bd74935b3b19bf8704d0` |
| `matching-2d-cost-exponent/p6.pdf` | `01d6220c0b2871e0d186a1d2dc1930b8791f8fa34c0d399b97b671aff273c4a5` |
| `matching-hungarian-progression/stage-0.pdf` | `c0700358fdf739d91f54526cbdbf237c3138c9339eb54a581bf5604b8ca36d43` |
| `matching-hungarian-progression/stage-1.pdf` | `ac9ab34224ea8051e6a3aafba5526ea4a39505f5d0b33a6b11711a49c7dccc0f` |
| `matching-hungarian-progression/stage-2.pdf` | `3caba2825b18d7e4437462d85189b759debc69adcaf905e2306e009103564811` |
| `matching-hungarian-progression/stage-3.pdf` | `d4c75f94d91c25c2b4fe8d81907c42da49a704647f729bf4d3b73941d76879bf` |
| `matching-hungarian-progression/stage-4.pdf` | `ee84823a028035a8070b77bcd1c520d6f6cf9c9f74191c22148c63ac07237065` |

## Reference and citation-sensitive claim reconciliation

All nine unique keys occur in `OT4ML/all.bib`; none is missing. The 14 key
occurrences resolve. Bibliographic metadata agrees with the primary records checked.

| Key | Current lines | Claim or attribution checked | Primary-source disposition |
|---|---:|---|---|
| `Kuhn1955` | 10, 416 | Hungarian method attribution | Correct; 1955 Naval Research Logistics Quarterly article, DOI `10.1002/nav.3800020109`. The chapter presents the modern `O(n^3)` primal-dual implementation, with Burkard et al. also cited. |
| `bertsekas1992auction` | 10, 416 | Auction methods as assignment/network-flow algorithms | Correct; tutorial citation is appropriate. |
| `gangbo1996geometry` | 89 | Strictly concave increasing distance-cost regime | Appropriate high-level attribution; the chapter does not rely on it for the local-indicator algorithm. |
| `delon-concave` | 91, 112; same work at 114 | chains, indicators, `O(n^2)` unit and `O(n^3)` weighted bounds | Correct after CH1-002 preprocessing. Primary paper: DOI `10.1137/110823304`, arXiv `1102.1795`. |
| `OttoliniSteinerberger2023GreedyConcave` | 114 | Greedy closest-pair rule is heuristic with guarantees for `0<p<1/2` | Correct. The main theorem gives the sharp rate up to constants in that range; journal year 2025 and DOI `10.54330/afm.173113` are correct. |
| `DelonRabinGousseau2011Circle` | 296, 300 | strict-convex circle path lemma and cut reduction | Correct. Primary Appendix proves the claim for every strict-convex optimum and existence for at least one optimum in the merely convex case; DOI `10.1007/s10851-011-0284-0`. |
| `delon-circle` | 300, 333 | weighted circular Monge costs, convex shift parameter, faster algorithms | Correct. DOI `10.1137/090772708`, arXiv `0902.3527`. |
| `Burkard09` | 416 | standard assignment-problem reference | Correct; SIAM monograph metadata resolves. |
| `bertsekas1981new` | 416 | original auction assignment algorithm | Correct; Mathematical Programming 21 (1981), 152-171. |

The uncited historical phrase at line 370, "already present in Monge's geometric
reasoning," is plausible but not needed for any proof; whether to add a primary
historical citation is an editorial scope question rather than an established defect.

## Label and cross-reference audit

| Check | Result |
|---|---:|
| Labels defined in the chapter | 27 |
| Duplicate chapter labels | 0 |
| Chapter labels duplicated elsewhere in imported sections | 0 |
| `ref`/`eqref` occurrences | 39 |
| Unique referenced labels | 25 |
| Missing referenced labels | 0 |
| Citation-key occurrences | 14 |
| Unique citation keys | 9 |
| Missing bibliography keys | 0 |

All forward references resolve, including `def-cdf-quantile`,
`prop-1d-equal-weight-quantization`, `eq-dual`, the later auction section, and
discrete complementary slackness. The sorting-permutation orientation is consistent
with later matrix and coupling conventions. The existing full-book build artifacts
postdate the source and contain no undefined-reference, undefined-citation, or
multiply-defined-label warning for this chapter.

## Notation, dimensions, and normalization audit

| Item | Check | Result |
|---|---|---|
| `range{n}` and `Perm(n)` | Domain/codomain and indexing | Correct for `n>=1`; CH1-004 makes this explicit. |
| `sigma(i)` | Assignment orientation | Consistently source index to target index. |
| `sigma_X`, `sigma_Y` | Rank-to-index sorting maps | `sigma_Y o sigma_X^{-1}` is dimensionally and directionally correct. |
| Assignment normalization | Average versus total | `1/n` is used in Equation (1.1); Hungarian drops it explicitly and later identifies the dual as multiplied by `n`. Correct. |
| Empirical measures | Atom weights | Both marginals have total mass one. Map interpretation needs CH1-001 when source locations repeat. |
| `h` versus `g` | Difference cost versus radial distance cost | `h:R->R` in the convex theorem and `g:R_+->R` in the concave section are used consistently. |
| Chain indices | `p_i,q_i,k,r` | Indicator ranges and certified pair blocks agree with the primary theorem. |
| Circle normalization | `R/Z` versus generator radians | Chapter circumference is one; generator circumference is `2*pi`. Multiplication of all distances by `2*pi` preserves every power-cost optimizer and cut. |
| Circle cyclic indices | `k+s` modulo `n` | Correct. Both cyclic lists must use the common increasing orientation; Algorithm 1.3 does so. |
| Euclidean norm | Planar claims and figures | Used as Euclidean distance; the no-crossing proposition is restricted correctly to power one. |
| Dual potentials | `f,g in R^n` | Dimensions, signs, and gauge freedom are consistent with later discrete duality. |
| Slack | `C_ij-f_i-g_j` | Nonnegative under dual feasibility and zero precisely on equality edges. |
| Alternating tree | `S,T,p(j),q(i)` | Parent directions are consistent: `p` follows unmatched/tight source-to-target edges and `q` follows matched target-to-source edges. |
| Figure masses | assignment versus plan | POT panels have 36 entries of mass `1/36`; visual line normalization does not alter assignment claims. |

## Equality and boundary-case audit

| Case | Exact conclusion | Chapter status |
|---|---|---|
| `n=0` | `1/n` and Hungarian row minima fail. | Missing: CH1-004. |
| Strictly convex line cost, distinct points | Unique rank assignment. | Correct. |
| Strictly convex line cost, repeated same-color points | Geometric support relation remains monotone, but labeled permutations can tie. | Compatible with the convex discussion; empirical Monge wording needs CH1-001. |
| Convex non-strict cost | Rank matching is optimal; other optimizers occur exactly along flat exchange directions. | Correct; no false uniqueness claim. |
| `p=1` on the line | Rank matching is optimal but generally nonunique. | Correctly illustrated. |
| `p<1` on the line | Rank matching need not be optimal; nested/crossing structures can win. | Correctly separated into the concave section. |
| Coincident red-blue point under strict concavity | Common mass can be matched at zero first, after subtracting the harmless constant `g(0)` if needed. | Required preprocessing omitted: CH1-002. |
| Book-shifting `W_1` equality | Exact permutation condition here is `y_{sigma(i)}>=i` for all `i`; more generally no cut carries opposite flows simultaneously. | Displayed examples and lower bound correct; full characterization left as RQ1. |
| Circle antipodal edge | Two shortest semicircles tie; one may be oriented away from a proposed endpoint-free cut. | Algorithm handles it correctly. |
| Circle `p=1` | At least one cyclic-shift optimum exists, but not every optimum must be cyclic. | Correctly excluded by `p>1`; explicit sharpness example recorded in VC-08. |
| Circle repeated/shared points | The strict theorem does not apply. | Correctly excluded by pairwise distinctness. |
| Planar collinear overlap | Swap can have equal cost and proper-crossing theorem does not exclude it. | Correctly stated; Catalan transition needs CH1-005. |
| Hungarian negative costs | Row-minimum initialization remains feasible. | Correct. |
| Hungarian all-zero/tied costs | Zero shifts and deterministic smallest-index choices still augment and terminate. | Correct in exact arithmetic. |

## Complexity audit

| Claim | Assumptions and operation accounting | Disposition |
|---|---|---|
| Exhaustive assignment, line 35 | There are `n!` candidates; direct summation is `O(n*n!)`, though the text only says all `n!` are evaluated. | Correct. |
| Sorting assignment, line 67 | Comparison model; evaluating/comparing point coordinates is constant cost. | Correct `O(n log n)` worst case for mergesort/heapsort and expected for standard randomized quicksort. |
| Concave unit masses, line 112 | Strict preprocessed chains and the cited retained-indicator table. | Correct `O(n^2)` after CH1-002 domain repair. |
| Concave real masses, line 114 | Complexity measured in the number of original supply/demand breakpoints under stratification. | Correct cited `O(n^3)` worst-case order. |
| Circle direct enumeration, line 333 | Sorted inputs, all shift energies and all gap/arc tests evaluated directly. | Correct `O(n^2)`. |
| Catalan survivors, lines 392-408 | Strict convex alternating vertices. | Exponential `Theta(4^n/n^(3/2))`; CH1-005 fixes premise. |
| Hungarian, lines 594-632 | Exact real-RAM arithmetic/comparison model; dense stored `n x n` matrix; maintained target slacks. | Correct `O(n^3)` operations and `O(n^2)` total storage. |

## Prioritized repair order

1. **CH1-001:** repair the empirical assignment/Monge distinction and rewrite the
   histogram caption to describe the implemented midpoint-rank tie-broken coupling.
   This prevents a conceptual error from propagating into the next chapter.
2. **CH1-002:** add exact duplicate/collision preprocessing and a strict support
   contract to the concave-chain algorithm before readers try to implement it.
3. **CH1-003:** restore the omitted cyclic propagation and endpoint-free open-gap
   steps in the circle proof.
4. **CH1-004:** declare `n>=1` once and record finite attainment.
5. **CH1-005:** replace the Catalan configuration by alternating vertices of a
   strictly convex `2n`-gon.

## Mechanical reconciliation

### Issue accounting

| Check | Exact result |
|---|---:|
| Contiguous defect IDs | `CH1-001` through `CH1-005` |
| Critical IDs | 0 |
| Major IDs | 0 |
| Moderate IDs | 3: `CH1-001`, `CH1-002`, `CH1-003` |
| Minor IDs | 2: `CH1-004`, `CH1-005` |
| Total defect IDs | 5 |
| RQ IDs, excluded from defect counts | 3: `RQ1` through `RQ3` |
| Validated-correct ledger entries | 16: `VC-01` through `VC-16` |

### Structural accounting

| Structure | Exact count |
|---|---:|
| Chapters in audited file | 1 |
| Sections | 2 |
| Explicit paragraphs | 8 |
| Definitions | 1 |
| Propositions (`proposition` plus `prop`) | 5 |
| Examples | 1 |
| Remarks | 1 |
| Algorithms | 4 |
| Proofs | 5 |
| Figures | 6 |
| Included PDF panels | 23 |
| Display blocks | 25 |
| Numbered displays | 7 |
| Unnumbered displays | 18 |
| Labels | 27 |
| Reference occurrences / unique targets | 39 / 25 |
| Citation-key occurrences / unique keys | 14 / 9 |

### Source preservation and report checks

| Check | Result |
|---|---|
| Source physical lines at start / finish | 639 / 639 |
| Source bytes at start / finish | 43,151 / 43,151 |
| Initial source SHA-256 | `e0115196571fcd2336dbbb3e0da5bae3413f2fe32abcf7ddc8ec661a6878d529` |
| Final source SHA-256 | `e0115196571fcd2336dbbb3e0da5bae3413f2fe32abcf7ddc8ec661a6878d529` |
| Source byte preservation | PASS: initial and final hashes are identical |
| Finding-ID/count reconciliation | PASS: 5 IDs equal `0+0+3+2` |
| Structural matrix/count reconciliation | PASS |
| Figure matrix/panel manifest reconciliation | PASS: 6 figures, 23 panels |
| Label/reference/citation reconciliation | PASS: no missing or duplicate chapter labels |
| Open drafting-marker check | PASS: none |
| ASCII check | PASS |
| Workspace write scope | Only `/Users/gpeyre/Dropbox/github/ot4ml/audit-chap1.md` was created or modified |

Temporary bounded diagnostics were confined to process memory and `/tmp`; no
chapter, bibliography, notebook, figure, generated asset, build artifact, or other
workspace file was edited. The authoritative chapter bytes are preserved exactly.
