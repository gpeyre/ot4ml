# Second-Pass Audit of Chapter 2: Monge Problem between Measures

## Scope and method

This report is a fresh adversarial audit of the current on-disk source:

- Source: /Users/gpeyre/Dropbox/github/ot4ml/OT4ML/sections/monge.tex
- Source baseline: 2,337 physical lines, 148,459 bytes
- Source baseline SHA-256: 643d92beecae27591dd225adf72bca09d3bebcdafd7755de620d9e6e012b7fe5
- First-pass report examined only after the independent reread: /Users/gpeyre/Dropbox/github/ot4ml/audit-chap2.md
- First-pass report SHA-256: 052b7c418e7ad7bd14eaa6b191186da6e76dca040e21eeec7d21b44370e14cac

The first-pass findings CH2-001 through CH2-012 were treated as hypotheses, not accepted conclusions. Every one of the 2,337 source lines was reread. Substantive claims were re-derived from the definitions, including all stated proofs, endpoint cases, signs, constants, dimensions, matrix orders, attainment statements, and singular cases. Imported material was read where needed: the chapter's c-transform convention, one-dimensional Kantorovich quantile result, Wasserstein topology statement, Kantorovich--Rubinstein domain, and referenced book-wide labels.

Read-only checks covered OT4ML/all.bib, all 17 figure environments, all 65 included one-page PDF assets, and the 16 notebooks that generate those figures. Retained outputs and generator code were inspected without rerunning expensive notebooks. Primary sources were checked for the disputed MTW, Knothe-limit, RGB, and Bobkov--Ledoux claims. Bounded diagnostics were confined to /tmp.

This pass distinguishes four outcomes:

1. An active mathematical defect has an ID, severity, derivation, minimal repair, and impact.
2. A retired ID remains in the historical disposition table but is excluded from defect totals.
3. An RQ2 item records an unresolved authorial or scope choice and is excluded from defect totals.
4. A validated claim is entered in the V2 ledger.

No source, bibliography, notebook, figure, asset, or generated file was edited during the audit itself. The subsequent source correction pass is documented below.

## Executive summary

| Severity | Active at audit completion | Unresolved after correction |
|---|---:|---:|
| Critical | 0 | 0 |
| Major | 0 | 0 |
| Moderate | 2 | 0 |
| Minor | 9 | 0 |
| **Total** | **11** | **0** |

At audit completion, the active findings were CH2-001, CH2-003, CH2-004, and CH2-006 through CH2-013. All 11 have since been resolved in the authoritative Chapter 2 source. CH2-002 and CH2-005 remain retired false positives and were not modified. CH2-013 was the new finding in the second audit pass. The issued namespace is contiguous from CH2-001 through CH2-013; retirement, rather than renumbering, preserves traceability.

The chapter's central results survive the second pass. In particular, Brenier's theorem and proof, radial transport, polar factorization, directed displacement interpolation, the Monge--Ampere formulas, one-dimensional Wasserstein and tree identities, the Knothe--Rosenblatt construction and anisotropic limit, scalar and multivariate Gaussian transport, both Bures quotient formulas, the Bures metric proof, covariance geodesics, and the Fisher--Rao constants are mathematically sound under the hypotheses actually stated or explicitly imported.

The two Moderate defects identified by the audit were localized theorem-envelope problems:

- CH2-003 permits a convex cost for which a competitor's signed objective is undefined.
- CH2-004 presents a family of MTW regularity theorems as one proposition whose hypotheses and conclusion are not checkable.

The nine Minor defects concerned a noncompact adjoint interpretation, one citation mismatch, the zero convention in the p-cost inverse duality map, omitted Riemannian existence hypotheses, quantile endpoints, exact atomlessness in map composition, historical attribution, the finite domain of the one-dimensional W1 norm, and signed-measure integration in the relative-density definition.

## Correction implementation record (2026-08-26)

The diagnostic entries below are retained verbatim as an audit trail and refer to the source baseline recorded above. The following table records the subsequent repairs in `OT4ML/sections/monge.tex`; line numbers refer to the corrected source.

| ID | Corrected location | Implemented correction | Current status |
|---|---:|---|---|
| CH2-001 | 313--338 | Restricted the Banach-adjoint statement to compact spaces and continuous maps, where Riesz duality applies. Retained only the bounded-test dual relation on noncompact spaces and explicitly declined a full-dual identification there. | Resolved |
| CH2-003 | 1285--1318 | Restricted the convex displacement cost to `h:R->[0,+infinity)` and interpreted every competitor objective as a nonnegative extended integral. The Cauchy/affine undefined-integral counterexample is therefore excluded. The power-cost specialization now explicitly assumes finite `p`th moments, matching the theorem's finite-cost hypothesis. | Resolved |
| CH2-004 | 1196--1204 | Replaced the purported MTW proposition and proof by a remark explicitly presented as a regularity roadmap. It now distinguishes interior, boundary, and higher-order results and directs the reader to the precise hypotheses in the cited theorems. A remark-typed label was added while the former proposition label was retained as a compatibility alias. | Resolved |
| CH2-006 | 531 | Reassigned the Rabin et al. citation to the sliced-Wasserstein texture-mixing claim it supports. The book's own experiment is now described separately as a genuine three-dimensional sampled-palette assignment. | Resolved |
| CH2-007 | 1069--1082 | Defined the continuous duality map `|z|^(q-2) z` to equal zero at `z=0`, explicitly including `q=2` and removing the apparent singularity for `1<q<2`. | Resolved |
| CH2-008 | 1088--1107 | Added completeness and connectedness of the Riemannian manifold, probability and finite-second-moment assumptions, and source absolute continuity. Stated uniqueness and the exponential-map formula almost everywhere off the cut locus, and used a measurable minimizing-geodesic selection for arbitrary optimal plans. The compact McCann theorem is now paired with the Fathi--Figalli noncompact extension, which exactly supports the stated ambient setting. | Resolved |
| CH2-009 | 1253--1274 and 1302--1304 | Replaced every quantile push-forward from `Leb_[0,1]` by `Leb_(0,1)`, matching the declared domain of the generalized inverse without changing any integral or transport value. | Resolved |
| CH2-010 | 1320--1336 | Replaced the ambiguous "intermediate laws" condition by the exact assumptions that alpha and beta are atomless, while explicitly allowing gamma to have atoms. | Resolved |
| CH2-011 | 1390 | Reworded the historical attribution: Bobkov and Ledoux record the formula communicated to them by E. del Barrio. | Resolved |
| CH2-012 | 1475--1481 | Defined the one-dimensional signed `W_1` norm on the exact finite domain `xi(R)=0` and `F_xi in L^1(R)`. Recorded finite first absolute variation moment as sufficient but not necessary, and added a direct proof of definiteness rather than invoking a probability-measure formula outside its stated domain. | Resolved |
| CH2-013 | 159--175 | Restricted the signed-measure integration identity to bounded tests, or more generally tests integrable against total variation. Preserved the extended nonnegative-test identity for positive measures. | Resolved |

No correction was made for retired findings CH2-002 and CH2-005. The authorial research questions RQ2-001 through RQ2-003 remain outside the defect ledger. The number of unresolved audited defects after this implementation pass is zero.

### Correction verification

- `git diff --check -- OT4ML/sections/monge.tex` reports no whitespace errors.
- A full `latexmk` build completes successfully and produces a 482-page PDF with no undefined references, no undefined citations, and no overfull boxes.
- The only build warnings are two frame-break warnings in Chapter 6 (`semidiscr-w1.tex`, line 1170); they are unrelated to Chapter 2.
- Final PDF pages labelled 14--19 and 26--32 (physical PDF pages 22--27 and 34--40) were rendered and inspected. The revised definitions, theorem, remarks, equations, references, and RGB figure page have no clipping, overlap, malformed glyphs, or adverse page breaks.
- Corrected source after the refinement pass: 2,340 physical lines, 149,848 bytes, SHA-256 `391922d7a70d0269216bb70bd27b1347b0a887dd8fe88b83e166539e7acbc79c`.

### Correction refinement pass (2026-08-26)

Every implemented repair was re-derived from its definitions and checked again against the surrounding statements. No correction was reverted and no audited defect reopened. Four places were improved:

- **CH2-003:** the `|t|^p` specialization now states the finite-`p`-moment condition that guarantees the displayed finite quantile cost.
- **CH2-004:** the MTW overview has its own remark label, while the former proposition label remains as an alias so existing references cannot break.
- **CH2-008:** the complete, possibly noncompact Riemannian theorem is now attributed jointly to McCann's compact theorem and the Fathi--Figalli noncompact extension. The complete bibliographic entry was added to `OT4ML/all.bib`.
- **CH2-012:** the malformed literal `infty` was repaired to `\infty`, and the norm properties are now proved directly on the maximal domain `F_xi in L^1`, without extending Equation `eq-w1-1d` beyond probability measures of finite first moment.

The final isolated two-pass build produces a 482-page PDF. It has no undefined references, no undefined citations, no overfull boxes, and no multiply defined labels. Its only two `mdframed` warnings occur at line 1170 of Chapter 6 and are unrelated to these edits. Printed pages 27--32 (physical PDF pages 35--40), containing the Riemannian theorem, MTW remark, quantile theorem, and signed `W_1` norm, were rendered at 120 dpi and inspected individually; no clipping, overlap, malformed mathematical glyph, or adverse page break was found.

## Second-pass disposition of CH2-001 through CH2-012

| ID | First-pass severity | Second-pass status | New severity | Adversarial disposition |
|---|---|---|---|---|
| CH2-001 | Moderate | Active, narrowed | Minor | Algebraic pullback and the bounded-test push-forward identity are correct. Only the unqualified C(X)-M(X) pairing and Banach-adjoint interpretation fail on noncompact spaces. |
| CH2-002 | Moderate | **Retired** | None | The notebook performs exact OT between two sampled 190-color empirical palettes and extends that palette map to the image. The prose/caption do not assert equality with the full target-pixel law. The earlier audit imposed a claim the chapter does not make. |
| CH2-003 | Moderate | Active | Moderate | The Cauchy/affine-cost counterexample survives. Measurability is automatic, but finiteness of the negative part is not. |
| CH2-004 | Moderate | Active, classified | Moderate | The underlying MTW results are not false. The displayed proposition is an uncheckable overview because its placeholders do not define one theorem. |
| CH2-005 | Moderate | **Retired** | None | The text expressly says it summarizes the cited scale-separated proof and identifies the delegated residual estimate. The cited primary theorem supplies that estimate under hypotheses implied by the chapter's positive rectangular densities. |
| CH2-006 | Minor | Active, narrowed | Minor | The figure and sampled-palette computation are valid. The remaining defect is solely that rabin-ssvm-11 is not primary support for a genuine multivariate RGB map. |
| CH2-007 | Minor | Active, refined | Minor | The formula is literal for 1<p<2, ambiguous at p=2 when the gradient vanishes, and undefined as written for p>2. The continuous duality map convention repairs every p>1. |
| CH2-008 | Minor | Active, narrowed | Minor | The nearby prose acknowledges cut-locus and selection issues, but it still does not state source absolute continuity, finite cost, or complete/geodesic ambient hypotheses before referring to "the optimal map." |
| CH2-009 | Minor | Active | Minor | This is a formal domain defect only. Endpoint values are Lebesgue-null and no transport value is wrong. |
| CH2-010 | Minor | Active, refined | Minor | Exactly alpha and beta must be atomless for the two displayed Monge maps and cancellation; gamma may have atoms. |
| CH2-011 | Minor | Active | Minor | The formula and citation are correct, but the cited memoir explicitly credits E. del Barrio for communicating the identity. |
| CH2-012 | Minor | Active, corrected | Minor | The exact maximal domain is F_xi in L1, not "finite first absolute moment." The latter is sufficient but not equivalent for signed measures because cancellations can occur. |

New issued ID:

| ID | Severity | Status | Reason found on second pass |
|---|---|---|---|
| CH2-013 | Minor | Active | The relative-density definition inherits the chapter's signed-measure convention but claims an integration identity for every nonnegative measurable test, for which a signed integral can be undefined. |

## Findings active at audit completion

These findings are ordered by their audit-time severity. Stable IDs are not renumbered; their implemented resolutions are recorded above.

### CH2-003 - The one-dimensional Monge theorem admits undefined competitor objectives

- **Severity:** Moderate
- **Exact location:** lines 1286--1319; Theorem One-dimensional Monge solution, label prop-1d-quantile-map; especially hypothesis line 1290, objective lines 1297--1299, and comparison lines 1306--1313.
- **Precise claim:** For arbitrary finite convex h:R->R, atomless alpha, and h(q_alpha-q_beta) in L1(0,1), the quantile map minimizes the displayed integral over every measurable S with S_#alpha=beta.
- **Derivation and counterexample:** A finite convex h is continuous, so measurability is not the issue. Let alpha=beta be the standard Cauchy probability and h(t)=t. Then q_alpha=q_beta, so the stated integrability assumption holds and the identity map has cost zero. The measurable map S(x)=-x also preserves the symmetric Cauchy law. Its integrand is h(x-S(x))=2x. Both positive and negative parts have infinite alpha-integral, hence the signed integral is undefined. It is neither a real number nor an extended-real cost. Therefore the inequality in lines 1306--1313 is not a proposition about every admissible S. This also exceeds the nonnegative cost convention in Definition def-monge-problem.
- **Smallest correct repair:** Require h to be bounded below, most simply h:R->[0,+infinity), and use nonnegative extended integrals. A less restrictive repair is to assume alpha,beta have finite first moments: every finite convex h has an affine lower support, so the negative part of h(x-y) is then integrable for every coupling; positive parts may be +infinity without ambiguity.
- **Downstream impact:** All advertised costs h(t)=|t|^p, 1<=p<infinity, remain valid. The quantile map, push-forward argument, and uncrossing argument do not change.

### CH2-004 - The MTW regularity proposition is not a checkable theorem

- **Severity:** Moderate
- **Exact location:** lines 1194--1205; Proposition MTW condition and regularity, label prop-mtw-regularity-implication, and its proof.
- **Precise claim:** Smoothness, twist, nondegeneracy, "appropriate mutual c-convexity," positive bounded densities, and weak MTW are said to imply local Holder continuity; "corresponding global domain hypotheses" imply boundary continuity; strong MTW plus "higher smoothness" gives higher regularity.
- **Derivation and proof gap:** These phrases do not specify a single theorem. MTW results require precise choices among one- or two-sided twist, the domain of the c-exponential, avoidance of cut-locus/degeneracy, c-convexity or strong c-convexity relative to the opposite domain, regularity of c on neighborhoods of the closures, density bounds or Lp conditions, boundary regularity, and a target regularity order. Primary results of Ma--Trudinger--Wang, Loeper, and Figalli--Kim--McCann validate versions of the narrative under such explicit packages, but no reader can test a concrete example against the proposition as written. The "proof" itself says the statement is structural rather than supplied with full hypotheses. Thus this is not a false MTW theorem; it is an overview mislabeled as a proposition with proof.
- **Smallest correct repair:** Convert lines 1194--1205 into a remark explicitly described as an overview. Alternatively, state separate exact local and global theorems, defining c-convexity, closure/nondegeneracy assumptions, data classes, and the exact Holder or C^{k,alpha} conclusion.
- **Downstream impact:** The twist proposition, MTW tensor sign convention, Loeper necessity statement, and sphere/product/submersion examples remain valid. Only the theorem status and usability of this summary are affected.

### CH2-001 - Pullback is not an unqualified Banach adjoint on the stated spaces

- **Severity:** Minor
- **Exact location:** lines 312--337; Remark Pullback and push-forward, labels rem-pullback-pushforward and rem-push-forward-pull-back; displays lines 316--320, 324--328, and 330--334.
- **Precise claim:** For every continuous T:X->Y, T^sharp is written C(Y)->C(X), the integrals are paired as C-M dualities, and T_# is called the adjoint of T^sharp without compactness, boundedness, or integrability qualifications.
- **Derivation:** Algebraically g o T is continuous, and Definition defn-pushfwd already gives the integral identity for bounded measurable g. The defect is the functional-analytic packaging. Line 144 established M(X)=C(X)^* only for compact X. On X=Y=R with T=Id, alpha a Cauchy probability, and g(y)=y, g is continuous but both signed integrals in lines 324--327 are undefined. Moreover C(R) is not the displayed sup-norm Banach space. C_b is a Banach space, but its full dual is larger than Radon measures. C_0 has Radon dual, but g o T need not lie in C_0 unless T is proper.
- **Smallest correct repair:** Add that X and Y are compact. Then T^sharp is bounded and its Banach adjoint restricted through Riesz is exactly T_#. If noncompact spaces are intended, state the equality only for bounded measurable or bounded continuous g and call it a dual relation rather than an identification of full Banach adjoints.
- **Downstream impact:** Definition defn-pushfwd, composition, mass preservation, and every later bounded-test use are unchanged.

### CH2-006 - The RGB citation does not support the stated multivariate map claim

- **Severity:** Minor
- **Exact location:** line 530, prose preceding Figure fig:monge-color-transfer-rgb; citation key rabin-ssvm-11.
- **Precise claim:** Rabin et al. is cited for replacing one-dimensional projections by a genuine three-dimensional OT palette map.
- **Derivation:** The cited primary work, Wasserstein Barycenter and its Application to Texture Mixing, develops a sliced approximation based on one-dimensional projections and applies it to texture mixing. It is relevant imaging background, but it is not primary support for the particular claim that a genuine three-dimensional RGB/Lab Monge map is computed. Independent generator inspection confirms that this chapter's own 190-by-190 palette assignment is genuinely three-dimensional; the citation mismatch is separate from that valid computation.
- **Smallest correct repair:** Cite a primary multivariate color-distribution transport paper for the RGB/Lab claim, or revise the sentence so rabin-ssvm-11 supports only sliced/barycentric texture processing.
- **Downstream impact:** Attribution only. Figure fig:monge-color-transfer-rgb and the empirical Monge discussion are correct.

### CH2-007 - The p-cost inverse-gradient formula needs its value at zero

- **Severity:** Minor
- **Exact location:** lines 1071--1080, paragraph Wp costs; display lines 1075--1079.
- **Precise claim:** For every p>1, q=p/(p-1), the map is written T(x)=x-||grad f(x)||^{q-2} grad f(x).
- **Derivation:** The inverse of z->||z||^{p-2}z is the continuous duality map J_q(z)=||z||^{q-2}z with J_q(0)=0. For 1<p<2 one has q>2 and the displayed product is literally zero at z=0. For p=2 it contains the convention-sensitive expression 0^0 times 0. For p>2 one has 1<q<2, so the scalar factor has a negative exponent and the written expression is undefined at z=0 even though J_q has a continuous value there. The chapter correctly excludes p=1 and p=infinity from this formula.
- **Smallest correct repair:** Add "where ||z||^{q-2}z is defined as 0 at z=0."
- **Downstream impact:** No change away from critical points and no change to existence, uniqueness, or the quadratic specialization.

### CH2-008 - The Riemannian map paragraph omits its existence package

- **Severity:** Minor
- **Exact location:** lines 1086--1105, paragraph Squared geodesic distance; displays lines 1091--1104.
- **Precise claim:** The text refers to "the optimal map" T(x)=exp_x(-grad phi(x)) and its McCann interpolation before stating conditions under which a deterministic optimal map and minimizing geodesics exist.
- **Derivation and counterexample:** A Dirac source cannot be pushed by any deterministic map to a two-atom target. Thus a non-splitting source condition is essential. In the standard Riemannian theorem one assumes, for example, a complete connected manifold, finite second moments, and source absolute continuity with respect to volume; the optimal endpoint lies off the source cut locus almost everywhere, giving the logarithm and unique map almost everywhere. Hopf--Rinow or another geodesic hypothesis is needed for global minimizing geodesics. The nearby phrases "ignoring cut-locus and measurable-selection issues" and the later plan-valued construction accurately flag two issues, but they do not repair the missing source and ambient assumptions in the map assertion.
- **Smallest correct repair:** Make the map sentence conditional on a complete connected Riemannian manifold, finite quadratic cost, and an absolutely continuous source, with the formula understood almost everywhere off the cut locus. For arbitrary optimal plans, retain a measurable selection of minimizing geodesics rather than asserting a map.
- **Downstream impact:** The finite sphere and Poincare illustrations explicitly select geodesics and remain valid.

### CH2-009 - Quantiles are used on [0,1] after being defined on (0,1)

- **Severity:** Minor
- **Exact location:** lines 1229--1243, Definition Cumulative and quantile functions, label def-cdf-quantile and equation eq-OT-map-1d; lines 1254--1272, Proposition prop-quantile-pushforward and proof; subsequent [0,1] push-forward notation.
- **Precise claim:** Q_alpha is defined only for r in (0,1), but (Q_alpha)_#Leb_[0,1] and integrals from 0 to 1 treat it as a map on the closed interval.
- **Derivation:** A push-forward requires a measurable map on the stated underlying space. The two omitted values form a Lebesgue-null set, so every distributional and integral identity is unchanged after choosing representatives. For unbounded laws, the canonical extended endpoint values can be +/-infinity and need not lie in R, so silently extending by those values is not a repair in the stated codomain.
- **Smallest correct repair:** Write Leb_(0,1) in the push-forward statements, or explicitly assign arbitrary real endpoint representatives and note that they are null.
- **Downstream impact:** No formula, map almost-everywhere class, or transport cost changes.

### CH2-010 - The composition remark needs alpha and beta atomless

- **Severity:** Minor
- **Exact location:** lines 1321--1337; Remark Composition is one-dimensional, label rem-1d-composition-optimal; displays lines 1324--1335.
- **Precise claim:** "Assume for simplicity that the intermediate laws have no atoms" is used to justify both maps and T_{beta->gamma} o T_{alpha->beta}=T_{alpha->gamma} alpha-a.e.
- **Derivation:** To have Q_beta o F_alpha push alpha to beta, alpha must be atomless so (F_alpha)_#alpha is uniform. To cancel F_beta o Q_beta at the transported quantile level, beta must be atomless, equivalently its CDF is continuous and F_beta(Q_beta(r))=r for Lebesgue-a.e. r. Gamma may contain atoms because Q_gamma still pushes uniform mass to gamma. If only beta is atomless, alpha=delta_0 and beta uniform already makes deterministic alpha-to-beta transport impossible.
- **Smallest correct repair:** Replace the ambiguous phrase with "assume alpha and beta are atomless"; gamma need not be atomless. Apply the endpoint convention in CH2-009.
- **Downstream impact:** Under those exact assumptions the semigroup identity is correct.

### CH2-011 - The Bobkov--Ledoux historical attribution is incomplete

- **Severity:** Minor
- **Exact location:** lines 1391--1409; Proposition Bobkov--Ledoux cumulative formula, labels prop-bobkov-ledoux-cdf-w2 and eq-bobkov-ledoux-cdf-w2; citation BobkovLedoux2019EmpiricalKantorovich.
- **Precise claim:** The prose says Bobkov and Ledoux "gave" the cumulative W2 formula.
- **Derivation:** The chapter's identity and factor 2 agree with Theorem 2.11 of the cited memoir. Immediately before that theorem, the authors say that E. del Barrio communicated the formula to them. The result is therefore mathematically and bibliographically located correctly, but the historical wording omits the source's own attribution.
- **Smallest correct repair:** Say "Bobkov and Ledoux record a formula communicated by E. del Barrio," retaining the memoir citation.
- **Downstream impact:** Attribution only; the proposition and its layer-cake proof are correct.

### CH2-012 - The W1 primitive norm needs its exact finite domain

- **Severity:** Minor
- **Exact location:** lines 1476--1478; Remark W1 is a norm, label rem-w1-norm-1d.
- **Precise claim:** W1 is called a norm on zero-mass signed measures identified with cumulative primitives, without specifying where the primitive has finite L1 norm.
- **Derivation:** On all finite zero-mass signed measures this is only an extended norm. If mu is the standard Cauchy law and xi=mu-delta_0, then xi(R)=0 but F_xi is not in L1(R), equivalently the Cauchy first moment diverges. The precise maximal finite-norm vector space is
  {xi: xi is a finite signed Borel measure, xi(R)=0, F_xi(x)=xi((-\infty,x]) belongs to L1(R)}.
  On this space ||xi||=int_R |F_xi(x)| dx is finite, homogeneous, subadditive, and separates measures. Finite first absolute moment of |xi| is sufficient but not necessary. For example,
  xi=sum_{n>=2} n^{-2}(delta_n-delta_{n+n^{-2}})
  has finite total variation and int|F_xi|=sum n^{-4}<infinity, while int|x| d|xi| diverges like 2 sum n^{-1}. The first-pass proposed equivalence with finite first absolute moment is therefore too narrow.
- **Smallest correct repair:** State the exact F_xi in L1 domain. Optionally mention the finite-|xi|-first-moment class as a simple sufficient subspace. If no domain is introduced, call the unrestricted quantity an extended norm.
- **Downstream impact:** Formula eq-w1-1d and W1 on P_1(R) are unchanged.

### CH2-013 - The relative-density test identity is not defined for every nonnegative test of a signed measure

- **Severity:** Minor
- **Exact location:** lines 159--173; Definition Relative density, label def-relative-density; especially the integration assertion at lines 169--172.
- **Precise claim:** After the chapter declares alpha to be a finite signed measure by default at line 63, the definition takes alpha<<lambda and says the density identity holds "for every nonnegative measurable function h."
- **Derivation and counterexample:** Radon--Nikodym densities for finite signed alpha relative to positive lambda are valid, but the signed integral of a nonnegative h need not exist if its alpha-positive and alpha-negative integrals are both infinite. On the discrete space X=N x {+,-}, set lambda({(n,+)})=lambda({(n,-)})=2^{-n-1} and rho(n,+)=2^n/n^2, rho(n,-)=-2^n/n^2. Then d alpha=rho d lambda is a finite signed measure because |alpha|(X)=sum_n 1/n^2<infinity. For h(n,+)=h(n,-)=n, both int h d alpha^+ and int h d alpha^- equal (1/2)sum_n 1/n=infinity. Thus int h d alpha and the asserted equality are undefined. If alpha is positive, both sides are legitimate extended nonnegative integrals; if alpha is signed and h in L1(|alpha|), both are finite and equal.
- **Smallest correct repair:** Either restrict the definition's alpha to positive measures, which is the later OT use, or replace "every nonnegative measurable h" by "every h in L1(|alpha|)" for signed alpha. The measure identity d alpha=rho d lambda remains valid.
- **Downstream impact:** Later probability-density and Jacobian formulas involve positive measures and are unaffected.

## Retired finding ledger

### CH2-002 - Retired: the RGB figure makes no false full-law push-forward claim

- **Former severity:** Moderate
- **Location reviewed:** lines 530--550; Figure fig:monge-color-transfer-rgb; generator notebooks-figures/monge-color-transfer-rgb.ipynb; all ten retained PDFs.
- **Adversarial check:** The notebook downsamples both images to 86 x 86, uses seed 20240608, samples 190 colors without replacement from each image, assigns equal mass 1/190, and solves an exact 190-by-190 RGB OT assignment. The lower panels are exactly those sampled source colors, their linear displacement, and the assigned sampled target palette. The upper panels apply the same sampled-palette map to all source pixels by nearest sampled source color. This extension does not generally push the full 7,396-pixel source empirical law to the full target-pixel law, but neither line 530 nor the caption asserts that it does. "The source and target measures are empirical color clouds" is satisfied by the sampled clouds; "the top row applies the palette map" is also literal. The separate target photograph is a visual reference.
- **Disposition:** The first-pass finding inferred an equality with the full target image law that is absent from the chapter. Retired and excluded from all severity totals.
- **Optional editorial enhancement, not a defect:** The caption could disclose "190 sampled colors; nearest-palette extension" to make the numerical protocol transparent.

### CH2-005 - Retired: the anisotropic Knothe proof is a valid cited proof summary

- **Former severity:** Moderate
- **Location reviewed:** lines 1721--1770; Proposition prop-knothe-limit-anisotropic-brenier and proof; primary source carlier2010knothe.
- **Adversarial check:** The chapter assumes compact rectangular supports with densities bounded above and below. These assumptions imply the source and target conditional atomlessness required by the cited theorem. The cost order epsilon^{k-1} selects coordinate 1 first and agrees with the displayed Knothe order. Compactness gives weak subsequences. The first-scale minimization is correct. From optimality against the Knothe coupling and I_1(pi_epsilon)>=I_1(pi_KR), the cancellation inequality at lines 1748--1750 follows. Conditional disintegration identifies coordinate 2. Line 1755 explicitly identifies the residual earlier-coordinate estimate needed for the induction and invokes the cited scale-separated estimate. The primary theorem supplies exactly this induction. Finally, graph-plan convergence to a measurable limiting graph gives convergence in probability via Lusin and Portmanteau; common compact target support gives uniform integrability and L2 convergence.
- **Disposition:** The proof is not self-contained, but it expressly announces itself as a summary of a cited proof and accurately states the delegated hard step. Reliance on a checked citation is not a mathematical defect. Retired and excluded from all severity totals.
- **Optional editorial enhancement, not a defect:** Rename the environment text "Proof sketch" if the book distinguishes cited sketches typographically.

## Research and scope questions

These are not defects and are excluded from severity totals.

- **RQ2-001 (active; lines 948--969):** Which exact global Caffarelli boundary theorem is intended by "standard compatibility and higher boundary-regularity assumptions"? The interior C^{2,alpha}_{loc} statement is valid. The boundary sentence should eventually identify a precise domain/data theorem or remain an overview.
- **RQ2-002 (active; lines 177--253):** Will later chapters require vector-valued Radon measures? This chapter correctly develops scalar signed total variation only. If vector measures are needed, the polar density d m=sigma d|m|, |sigma|=1 |m|-a.e., and the corresponding dual norm would need a separate definition.
- **RQ2-003 (active; lines 1661--1682):** Is Algorithm alg:triangular-rearrangement intended only as an oracle-level construction, or as implementable pseudocode? Without a representation and conditional-CDF/quantile oracle, arithmetic and sample complexity are not defined.

Retired scope question:

- **RQ2-004 (retired; former line 530):** A replacement RGB citation is not an unresolved research question. It is the concrete editorial repair in CH2-006.

## Validated-correct ledger

Each entry was independently re-derived. "Modulo CH2-..." means the mathematical core is correct after the stated local repair.

| ID | Lines | Independently validated claim |
|---|---:|---|
| V2-001 | 23--153 | Probability-simplex, histogram, discrete/empirical, finite signed Borel, Polish-space, support, Radon, weak integration, and compact Riesz representation conventions are correct. Finite Borel measures on Polish spaces are Radon. |
| V2-002 | 159--253 | The Radon--Nikodym measure identity is correct modulo CH2-013. Scalar total variation equals |alpha|(X), including density and merged-atom l1 formulas; the convention is the full TV norm, not half-TV. |
| V2-003 | 278--399 | Push-forward set and bounded-test identities, atomic formula, positivity/mass, composition, support inclusion, probabilistic law, and C1-diffeomorphism density formula with absolute determinant are correct modulo CH2-001's adjoint wording. |
| V2-004 | 414--513 | Monge infimum conventions, empirical matching with equal multiplicities, atom obstruction, atomless-source feasibility on Polish spaces, splitting nonattainment, and semidiscrete cell masses are correct. |
| V2-005 | 515--638 | The semidiscrete and sampled RGB illustrations are mathematically consistent. Directed Monge value is nonnegative, separates measures, obeys the oriented triangle inequality, may be asymmetric/infinite, and has the stated book-shifting equality case. |
| V2-006 | 658--684 | Brenier's theorem has the needed source absolute continuity, finite quadratic moments, convex-gradient conclusion, almost-everywhere map uniqueness, and optimal-plan uniqueness. The graph/duality proof has the correct factor convention. |
| V2-007 | 686--775 | A monotone field need not be a gradient; non-charging hypersurfaces is a sufficient source condition; the radial quantile map, convex radial potential, and radial cost formula are correct, including the origin null set. |
| V2-008 | 780--814 | Polar factorization under absolute continuity of S_#alpha, the inverse Brenier factor, measure-preserving factor, singular linear polar example, and uniqueness are correct. |
| V2-009 | 841--911 | Monge/McCann interpolation and the directed constant-speed identity are correct under the stated endpoint map and injectivity. Strong monotonicity makes Brenier interpolants injective for t<1. |
| V2-010 | 942--1056 | The interior Caffarelli synopsis, Monge--Ampere density/determinant identity, convex branch, Alexandrov caveat, and weighted-Poisson linearization have correct signs, boundary flux, and constants. RQ2-001 concerns only global boundary scope. |
| V2-011 | 1068--1207 | Strictly convex displacement costs, the p-duality formula modulo CH2-007, twist definition and no-splitting proof, MTW tensor sign, Loeper necessity, and flat/sphere/product/submersion examples are correct. CH2-004 concerns theorem packaging. |
| V2-012 | 1229--1352 | Generalized inverse identities, Q_#Leb=alpha, the probability integral transform under atomlessness, monotone Monge map, and higher-dimensional noncomposition example are correct modulo CH2-003, CH2-009, and CH2-010. |
| V2-013 | 1356--1439 | Quantile Wp, CDF W1, and double-CDF W2 formulas are correct with all constants. The layer-cake proof handles atoms and endpoint null sets. CH2-011 is attribution only. |
| V2-014 | 1443--1554 | Linear quantile geodesics, D_p metric properties, global and compact-support comparisons, normalizations, and topology examples, including p=infinity incomparability, are correct modulo CH2-012's norm domain. |
| V2-015 | 1560--1604 | The tree W1 cut formula, lower bound, flow realization, O(|V|) value computation, chain reduction, and failure of edgewise decoupling for p>1 are correct. |
| V2-016 | 1629--1716 | Knothe--Rosenblatt recursive construction, measurable conditional quantiles, triangular monotonicity, push-forward invariant, oracle algorithm, and histogram visualization are correct under source-conditional atomlessness. |
| V2-017 | 1721--1770 | The anisotropic Brenier-to-Knothe statement, scale order, conditional atomlessness, cited induction, whole-family weak convergence, and graph-to-L2 conclusion are correct. Retired CH2-005 records why the cited proof summary is adequate. |
| V2-018 | 1782--1882 | Scalar Gaussian transport, W2^2=(Delta m)^2+(Delta sigma)^2, Fisher--Rao metric, sqrt(2)-scaled hyperbolic model, arcosh distance, geodesics, and boundary behavior are correct. |
| V2-019 | 1884--1991 | Affine Gaussian covariance transport, unique positive Brenier matrix for PD covariances, mean/covariance cost split, Bures trace formula, map placement, and continuous PSD distance extension are correct. |
| V2-020 | 1993--2005 | The common-radial-generator elliptical extension is correct: A Sigma^{1/2}=Lambda^{1/2}Q, orthogonal radial invariance supplies the push-forward, and covariance determines the quadratic cost. |
| V2-021 | 2008--2054 | The 2 x 2 orthonormal cone coordinates, determinant/Lorentz-cone relation, covariance Bures path, and distinction from the Frobenius segment are correct. |
| V2-022 | 2063--2123 | Bures as a raw-second-moment Wasserstein quotient is correct, including block positivity, contraction/nuclear duality, singular limiting argument, and centered Gaussian attainment. |
| V2-023 | 2127--2239 | Rectangular-factor Procrustes formula, orthogonal-orbit quotient, rank-deficient singular-value identity, Bures metric axioms, triangle alignment order, and joint convexity block-factor proof are correct. |
| V2-024 | 2241--2337 | Diagonal square-root/Hellinger geometry, covariance Fisher--Rao normalization, affine-invariant geodesic, PSD boundary contrast, and both 2 x 2 closed distance formulas are correct. |

## Structural reconciliation

### Chapter, sections, and titled paragraphs

| Structural unit | Current lines | Audit result |
|---|---:|---|
| Chapter sec-monge, Monge Problem between Measures | 6--2337 | Read in full |
| Section sec-measures, Measures | 17--277 | CH2-013; otherwise V2-001--002 |
| Section sec-push-forward, Push-Forward | 278--401 | CH2-001; otherwise V2-003 |
| Section sec-monge-formulation / alias sec-continuous-monge, Monge's Formulation | 402--642 | CH2-006 attribution only; otherwise V2-004--005 |
| Section sec-monge-existence-uniqueness, Existence and Uniqueness | 643--1059 | V2-006--010; RQ2-001 |
| Section sec-beyond-quadratic-euclidean-cost | 1060--1212 | CH2-004, CH2-007, CH2-008 |
| Section sec-1d-transport-quantiles | 1213--1772 | CH2-003, CH2-009--012; otherwise V2-012--017 |
| Section sec-gaussian-bures | 1773--2337 | V2-018--024; no active defect |

All 29 titled paragraphs:

| No. | Paragraph | Lines | Audit |
|---:|---|---:|---|
| 1 | Histograms | 23--36 | OK |
| 2 | Discrete measure, empirical measure | 37--60 | OK |
| 3 | General measures | 61--74 | OK |
| 4 | Polish metric spaces | 75--114 | OK |
| 5 | Radon measures | 115--153 | OK |
| 6 | Relative densities | 154--176 | CH2-013 |
| 7 | Total variation norm | 177--254 | OK |
| 8 | Probabilistic interpretation | 255--277 | OK |
| 9 | Monge problem | 410--552 | CH2-006 attribution; retired CH2-002 |
| 10 | Monge distance | 553--642 | OK |
| 11 | Brenier's theorem | 652--735 | OK |
| 12 | Radial measures | 736--779 | OK |
| 13 | Polar factorization | 780--840 | OK |
| 14 | Displacement interpolation | 841--941 | OK |
| 15 | Regularity and Monge--Ampere | 942--1059 | OK; RQ2-001 |
| 16 | Wp costs | 1068--1085 | CH2-007 |
| 17 | Squared geodesic distance | 1086--1119 | CH2-008 |
| 18 | Poincare disk | 1120--1133 | OK |
| 19 | Twist condition | 1134--1167 | OK |
| 20 | Ma--Trudinger--Wang curvature | 1168--1212 | CH2-004 |
| 21 | Cumulative and quantile functions | 1220--1276 | CH2-009 |
| 22 | 1D Monge solutions, par-1d-monge-solution | 1277--1479 | CH2-003, CH2-010, CH2-011, CH2-012 |
| 23 | Norms on cumulative functions | 1480--1559 | OK |
| 24 | OT on trees | 1560--1628 | OK |
| 25 | Triangular rearrangements | 1629--1772 | OK; retired CH2-005 |
| 26 | One-dimensional Gaussians | 1782--1883 | OK |
| 27 | Multivariate Gaussians | 1884--2057 | OK |
| 28 | Alternate formulation of Bures | 2058--2250 | OK |
| 29 | Fisher--Rao comparison for zero-mean Gaussians | 2251--2337 | OK |

There are no subsection or subsubsection units.

### Named and numbered environments

There are 63 named/numbered non-proof, non-figure environments: 18 definitions, 24 propositions, 2 theorems, 14 remarks, 4 examples, and 1 algorithm.

#### Definitions (18)

| Lines | Title / label | Audit |
|---:|---|---|
| 28--35 | Probability simplex / def-probability-simplex | OK |
| 43--50 | Discrete measure / def-discrete-measure | OK |
| 82--87 | Polish metric space / def-polish-metric-space | OK |
| 102--111 | Support / def:support | OK |
| 122--129 | Radon and probability measures / def-radon-probability-measures | OK |
| 159--173 | Relative density / def-relative-density | CH2-013 |
| 181--189 | Total variation / defn-total-variation | OK |
| 261--269 | Random variable and law / def-random-variable-law | OK |
| 299--309 | Push-forward / defn-pushfwd | OK |
| 414--423 | Monge problem and Monge map / def-monge-problem | OK |
| 557--567 | Directed Monge distance / def-directed-monge-distance | OK |
| 714--720 | Not charging hypersurfaces / defn-not-charging-hypersurfaces | OK |
| 848--859 | Monge and McCann interpolation / def-monge-mccann-interpolation | OK |
| 1139--1146 | Twist / def-twist-condition | OK |
| 1176--1189 | Weak MTW / def-mtw-condition | OK |
| 1229--1243 | CDF and quantile / def-cdf-quantile | CH2-009 |
| 1483--1497 | Cumulative-function distances / def-cumulative-function-distance | OK |
| 1923--1932 | Bures metric / def-bures-metric | OK |

#### Propositions (24) and theorems (2)

| Lines | Kind, title / label | Audit |
|---:|---|---|
| 203--210 | Prop., TV dual/measure / prop-tv-dual-measure | OK |
| 341--352 | Prop., density push-forward / prop-push-forward-densities | OK |
| 446--461 | Prop., empirical maps/matchings / prop-empirical-monge-matching | OK |
| 471--478 | Prop., atomless feasibility / prop-existence-transport-map-atomless | OK |
| 593--597 | Prop., directed distance / prop-directed-monge-distance | OK |
| 658--669 | Thm., Brenier / thm-brenier | OK |
| 743--766 | Prop., radial transport / prop-radial-transport | OK |
| 788--798 | Prop., polar factorization / prop-polar-factorization | OK |
| 871--882 | Prop., directed displacement geodesics / prop-monge-displacement-geodesic | OK |
| 948--955 | Prop., Caffarelli regularity / prop-caffarelli-regularity | Interior OK; RQ2-001 |
| 1029--1037 | Prop., linearized Monge--Ampere / prop-linearized-monge-ampere | OK |
| 1148--1152 | Prop., twist prevents splitting / prop-twist-prevents-splitting | OK |
| 1194--1198 | Prop., MTW and regularity / prop-mtw-regularity-implication | CH2-004 |
| 1254--1258 | Prop., quantile push-forward / prop-quantile-pushforward | CH2-009 convention only |
| 1286--1301 | Thm., 1D Monge solution / prop-1d-quantile-map | CH2-003 |
| 1356--1376 | Prop., 1D Wasserstein formulas / prop-wass-quantile-1d | OK |
| 1393--1409 | Prop., Bobkov--Ledoux CDF formula / prop-bobkov-ledoux-cdf-w2 | Formula OK; CH2-011 attribution |
| 1504--1529 | Prop., CDF/Wasserstein comparisons / prop-cumulative-wasserstein-comparison | OK |
| 1570--1582 | Prop., tree cumulative formula / prop-tree-w1-cumulative | OK |
| 1635--1647 | Prop., Knothe--Rosenblatt / prop-knothe-rosenblatt | OK |
| 1721--1739 | Prop., anisotropic limit / prop-knothe-limit-anisotropic-brenier | OK; retired CH2-005 |
| 1898--1905 | Prop., affine Gaussian push-forward / prop-gaussian-affine-push-forward | OK |
| 1935--1957 | Prop., Gaussian/Bures / prop-gaussian-w2-bures | OK |
| 2063--2082 | Prop., second-moment quotient / prop-bures-second-moment-lift | OK |
| 2127--2144 | Prop., Procrustes / prop-bures-procrustes | OK |
| 2188--2197 | Prop., metric and convexity / prop-bures-metric-convex | OK |

#### Remarks (14), examples (4), and algorithm (1)

| Lines | Kind, title / label | Audit |
|---:|---|---|
| 312--337 | Remark, Pullback and push-forward / two alias labels | CH2-001 |
| 384--399 | Remark, Probabilistic interpretation | OK |
| 487--491 | Remark, Feasibility versus optimality | OK |
| 493--501 | Example, splitting obstruction / ex-splitting-obstruction | OK |
| 503--513 | Example, semi-discrete maps | OK |
| 569--591 | Example, book-shifting / ex-monge-book-shifting-w1 | OK |
| 693--712 | Remark, monotone fields | OK |
| 722--734 | Remark, sharp source hypothesis | OK |
| 995--1005 | Remark, regularity/weak maps/splitting | OK |
| 1015--1024 | Remark, numerical Monge--Ampere solvers | Correct overview |
| 1321--1337 | Remark, 1D composition / rem-1d-composition-optimal | CH2-010 |
| 1341--1350 | Example, composing Brenier maps | OK |
| 1435--1439 | Remark, quantile linearization / rem-1d-wasserstein-banach-isometry | OK |
| 1476--1478 | Remark, W1 is a norm / rem-w1-norm-1d | CH2-012 |
| 1661--1682 | Algorithm, triangular rearrangement / alg:triangular-rearrangement | Correct oracle construction; RQ2-003 |
| 1826--1867 | Remark, Fisher--Rao with mean / rem-fisher-rao-gaussian-mean | OK |
| 1993--2005 | Remark, common-generator elliptical laws / rem-elliptical-bures | OK |
| 2008--2039 | Remark, 2 x 2 covariance cone / rem-2x2-covariance-cone | OK |
| 2241--2249 | Remark, diagonal/Hellinger geometry | OK |

### Proof matrix

Exactly 26 proof environments occur.

| Proof | Lines | Result | Line-by-line audit |
|---|---:|---|---|
| P2-01 | 211--220 | TV dual/measure | Complete. Radon regularity gives bounded continuous L1 approximation to the sign. |
| P2-02 | 354--361 | Density push-forward | Complete. Compactly supported tests, absolute determinant, inverse Jacobian, and a.e. conclusion match. |
| P2-03 | 462--469 | Empirical matching | Complete. Equal weights force equal multiplicities after merging. |
| P2-04 | 479--485 | Atomless feasibility | Complete. The standard atomless probability-space isomorphism is used with Polish targets. |
| P2-05 | 598--638 | Directed distance | Complete. Separation uses bounded Lipschitz tests and epsilon maps; triangle uses composition and Minkowski without assuming attainment. |
| P2-06 | 670--684 | Brenier | Complete relative to imported Kantorovich duality/attainment. Equality, differentiability, and uniqueness quantifiers match. |
| P2-07 | 767--775 | Radial map | Complete. Radius push-forward and convex radial potential are correct a.e. |
| P2-08 | 799--810 | Polar factorization | Complete. The inverse Brenier map exists under image absolute continuity and yields the measure-preserving factor. |
| P2-09 | 883--911 | Directed geodesic | Complete. Upper bounds plus the oriented triangle force equality; injectivity is used exactly where stated. |
| P2-10 | 956--969 | Caffarelli interior regularity | Correct synopsis for the interior result; RQ2-001 concerns only the non-specific boundary addendum. |
| P2-11 | 1038--1056 | Linearized Monge--Ampere | Complete. Determinant derivative, density derivative, divergence sign, and Neumann condition check. |
| P2-12 | 1153--1160 | Twist prevents splitting | Complete under the proposition's explicit first-order certificate. |
| P2-13 | 1199--1205 | MTW regularity | Does not prove a fixed theorem because the statement has placeholder hypotheses: CH2-004. |
| P2-14 | 1259--1275 | Quantile push-forward | Complete modulo the null endpoint convention CH2-009. Generalized-inverse equivalence is correct with right continuity. |
| P2-15 | 1302--1319 | 1D Monge solution | Push-forward and uncrossing logic are correct, but competitor comparison can be undefined under the stated h: CH2-003. |
| P2-16 | 1377--1389 | 1D Wasserstein formulas | Complete. Quantile coupling and layer-cake W1 identity handle atoms. |
| P2-17 | 1410--1431 | Double-CDF W2 | Complete. Triangle area supplies factor 2; generalized inverse events give both positive parts. |
| P2-18 | 1530--1547 | CDF/Wasserstein inequalities | Complete. Jensen, support length, and probability normalization yield the stated powers. |
| P2-19 | 1583--1596 | Tree formula | Complete. Every cut gives a lower bound and the oriented subtree flow realizes all bounds simultaneously. |
| P2-20 | 1648--1657 | Knothe--Rosenblatt | Complete at regular-conditional-kernel level under source conditional atomlessness. |
| P2-21 | 1741--1770 | Anisotropic Knothe limit | Valid cited proof summary. The delegated residual induction is exactly the checked primary theorem; graph-to-L2 closure is complete. Retired CH2-005. |
| P2-22 | 1906--1918 | Affine Gaussian push-forward | Complete. Mean and covariance transformations and SPD matrix solution are dimensionally correct. |
| P2-23 | 1958--1991 | Gaussian/Bures | Complete for PD maps; distance extension to PSD by continuity is correctly separated from map existence. |
| P2-24 | 2083--2123 | Second-moment quotient | Complete. Schur complement/contraction argument, trace duality, singular approximation, and Gaussian attainment match. |
| P2-25 | 2145--2178 | Procrustes quotient | Complete for rectangular and rank-deficient factors. Nonzero singular values are matched in the correct order. |
| P2-26 | 2198--2239 | Bures metric/convexity | Complete. Alignment order Q_2 Q_1 is correct; block factors establish joint convexity. |

### Displayed-equation matrix

The source contains exactly 129 display-math units: 94 bracket displays, 8 eq macro displays, 21 eql macro displays, and 6 equation/align environments. Sixteen tabular row-spacing tokens of the form double-backslash followed by brackets were excluded. Every display is listed. OK* means the formula is correct but nearby prose has the cited defect.

~~~text
ID    lines       kind/label                                      audit
D001  31-33       bracket                                         OK
D002  46-48       eql eq-discr-meas                               OK
D003  69-71       eq                                              OK
D004  89-92       eq                                              OK
D005  105-109     bracket                                         OK
D006  124-126     bracket                                         OK
D007  133-135     bracket                                         OK
D008  137-139     eq                                              OK
D009  164-168     bracket                                         OK: signed RN measure identity
D010  170-172     bracket                                         CH2-013
D011  184-188     bracket                                         OK
D012  196-200     bracket                                         OK
D013  213-215     bracket                                         OK
D014  223-227     bracket                                         OK
D015  230-234     bracket                                         OK
D016  237-241     bracket                                         OK
D017  249-253     bracket                                         OK
D018  263-267     bracket                                         OK
D019  272-274     bracket                                         OK
D020  292-294     eq                                              OK
D021  301-303     eql eq-equiv-pushfwd                            OK
D022  305-307     eql eq-push-fwd                                 OK
D023  316-320     bracket                                         OK* CH2-001 spaces
D024  324-328     bracket                                         CH2-001
D025  330-334     bracket                                         CH2-001
D026  344-346     eql eq-pfwd-density                             OK
D027  348-351     bracket                                         OK
D028  356-359     align*                                          OK
D029  393-395     bracket                                         OK
D030  416-421     eql eq-monge-continuous                         OK
D031  427-429     bracket                                         OK
D032  450-454     bracket                                         OK
D033  457-459     bracket                                         OK
D034  465-467     bracket                                         OK
D035  559-565     eql eq-monge-distance                           OK
D036  580-587     bracket                                         OK
D037  601-608     bracket                                         OK
D038  615-619     bracket                                         OK
D039  622-636     bracket                                         OK
D040  662-666     bracket                                         OK
D041  672-676     bracket                                         OK
D042  689-691     bracket                                         OK
D043  703-709     bracket                                         OK
D044  745-750     bracket                                         OK
D045  754-759     bracket                                         OK
D046  761-765     bracket                                         OK
D047  792-795     bracket                                         OK
D048  801-806     bracket                                         OK
D049  851-856     bracket                                         OK
D050  876-878     bracket                                         OK
D051  887-895     bracket                                         OK
D052  899-905     bracket                                         OK
D053  951-953     bracket                                         OK
D054  959-962     bracket                                         OK; RQ2-001 boundary scope
D055  1010-1012   eql eq-monge-ampere                             OK
D056  1033-1035   bracket                                         OK
D057  1041-1043   bracket                                         OK
D058  1046-1054   bracket                                         OK
D059  1072-1074   bracket                                         OK
D060  1076-1079   bracket                                         CH2-007
D061  1091-1093   bracket                                         OK* CH2-008 hypotheses
D062  1095-1104   bracket                                         OK* CH2-008 hypotheses
D063  1141-1143   bracket                                         OK
D064  1183-1186   bracket                                         OK
D065  1232-1234   eql eq-cumul-defn                               OK
D066  1237-1242   eql eq-OT-map-1d                                CH2-009 convention
D067  1261-1271   bracket                                         OK* CH2-009
D068  1291-1295   eql eq-1d-monge-map                             OK* CH2-003/009
D069  1297-1299   bracket                                         CH2-003
D070  1306-1314   bracket                                         OK after CH2-003 repair
D071  1324-1328   bracket                                         CH2-010 assumptions
D072  1330-1335   bracket                                         CH2-010 assumptions
D073  1359-1365   eql eq-wass-cumul                               OK
D074  1367-1375   equation eq-w1-1d                               OK
D075  1382-1387   bracket                                         OK
D076  1399-1408   eql eq-bobkov-ledoux-cdf-w2                     OK; CH2-011 attribution only
D077  1412-1421   bracket                                         OK
D078  1423-1427   bracket                                         OK
D079  1467-1472   bracket                                         OK
D080  1486-1490   eql eq-cumulative-function-distance             OK
D081  1492-1496   eq                                              OK
D082  1506-1514   eql eq-cumulative-wasserstein-global-comparison OK
D083  1516-1522   eql eq-cumulative-wasserstein-bounded-comparison OK
D084  1524-1528   eq                                              OK
D085  1532-1536   eq                                              OK
D086  1541-1545   eq                                              OK
D087  1572-1580   eql eq-tree-w1-cumulative                       OK
D088  1585-1592   bracket                                         OK
D089  1641-1645   bracket                                         OK
D090  1726-1730   bracket                                         OK
D091  1734-1738   bracket                                         OK
D092  1748-1751   bracket                                         OK
D093  1759-1761   bracket                                         OK
D094  1764-1768   bracket                                         OK
D095  1786-1788   bracket                                         OK
D096  1791-1793   bracket                                         OK
D097  1796-1802   bracket                                         OK
D098  1832-1840   bracket                                         OK
D099  1842-1849   bracket                                         OK
D100  1852-1856   bracket                                         OK
D101  1858-1864   bracket                                         OK
D102  1888-1894   eql eq-gauss-pf                                 OK
D103  1902-1904   eql eq-gauss-covariance-pushforward             OK
D104  1910-1916   bracket                                         OK
D105  1927-1931   eql eq-bures-defn                               OK
D106  1939-1946   eql eq-bures-map                                OK
D107  1950-1954   eql eq-dist-gauss                               OK
D108  1969-1988   align*                                          OK
D109  1999-2003   bracket                                         OK
D110  2018-2035   equation eq-2x2-covariance-cone                 OK
D111  2070-2072   bracket                                         OK
D112  2074-2079   bracket                                         OK
D113  2089-2099   bracket                                         OK
D114  2103-2111   bracket                                         OK
D115  2113-2117   bracket                                         OK
D116  2133-2141   equation eq-bures-procrustes                    OK
D117  2153-2157   bracket                                         OK
D118  2164-2168   bracket                                         OK
D119  2192-2196   bracket                                         OK
D120  2207-2217   bracket                                         OK
D121  2223-2227   bracket                                         OK
D122  2232-2237   bracket                                         OK
D123  2258-2266   bracket                                         OK
D124  2268-2274   bracket                                         OK
D125  2276-2278   bracket                                         OK
D126  2281-2286   bracket                                         OK
D127  2288-2294   bracket                                         OK
D128  2298-2303   bracket                                         OK
D129  2305-2322   align eq-2x2-bures-cone-distance,               OK
                   eq-2x2-fr-cone-distance
~~~

## Algorithm and complexity audit

| Item | Objective and invariant | Feasibility and correctness | Termination and complexity |
|---|---|---|---|
| alg:triangular-rearrangement, lines 1661--1682 | At stage k, the first k output coordinates have target marginal beta_{<=k}; the new coordinate is the conditional monotone rearrangement. | Correct under atomless source conditional laws and measurable regular conditional distributions. Target atoms are handled by generalized quantiles. Null conditioning fibers require only arbitrary measurable representatives. | Terminates after exactly d stages. It is an oracle construction: conditional CDF and generalized-inverse evaluation costs are unspecified, so no arithmetic or sample complexity follows. RQ2-003. |
| Tree value computation, lines 1570--1596 | A postorder pass computes F_e=(alpha-beta)(V_e) for every child subtree. | Every feasible flow crosses edge e with net amount F_e, and the constructed leaf-to-root flow realizes equality simultaneously. | O(|V|) arithmetic and memory after masses and adjacency are stored, since |E|=|V|-1. The stated complexity is correct. |

No other algorithm or pseudocode environment occurs. Lines 1015--1024 survey numerical Monge--Ampere solvers but state no algorithm, invariant, termination theorem, or complexity claim.

## Figure and generator reconciliation

All 17 figure environments, 65 includegraphics targets, and 16 used generator notebooks were checked. Every asset exists and is a valid single-page PDF. Retained outputs contained no saved exception. A contact sheet was visually inspected. No notebook was rerun. The one notebook monge-gaussian-w2-geodesic.ipynb generates two figure environments.

| Figure lines / label | Assets | Generator | Parameter, geometry, and retained-output audit |
|---|---:|---|---|
| 368--381 / fig:monge-jacobian-pushforward-density | 3 | notebooks-figures/monge-jacobian-pushforward-density.ipynb | Three smooth maps. Retained sampled minimum determinants are about 0.0400, 0.0589, 0.0688; all are orientation-preserving. Inverse-Jacobian density and contour/grid compression match the formula and caption. |
| 432--444 / fig:monge-1d-map-mixtures | 2 | notebooks-figures/monge-1d-map-mixtures.ipynb | Source mixture weights (0.46,0.54), target weights (0.24,0.43,0.33). Equal-quantile rays and graph use the generalized inverse correctly; retained numerical inverse residual is about 1.1e-16. |
| 515--528 / fig:monge-semidiscrete-maps | 2 | notebooks-figures/monge-semidiscrete-maps.ipynb | 15- and 20-atom cases. Numerical Laguerre-cell marginal l1 residuals are about 6.71e-4 and 5.24e-4. The caption says numerical cells and distinguishes displayed-domain extension from alpha-mass. |
| 534--551 / fig:monge-color-transfer-rgb | 10 | notebooks-figures/monge-color-transfer-rgb.ipynb | 86 x 86 images, seed 20240608, 190 source and 190 target sampled colors, equal weights, exact POT assignment, and nearest-source-palette extension to all source pixels. Bottom row is the exact sampled-palette displacement; top row applies that map. Caption does not claim full target-law attainment. Correct; CH2-002 retired. Citation issue CH2-006 is external to the figure. |
| 818--830 / fig:monge-polar-factorization | 3 | notebooks-figures/monge-polar-factorization.ipynb | RK4 flow of a divergence-free Hamiltonian field followed by an SPD affine map. Retained det(Ds) is 1 to about 1e-9 and SPD eigenvalues are about 0.76 and 1.40. Labels and composition order match. |
| 915--935 / fig:monge-shape-mccann-interpolation | 10 | notebooks-figures/monge-shape-mccann-interpolation.ipynb | Exact equal-weight assignment on 2,200-point clouds; 165 farthest-point trajectories displayed; t=0,.25,.5,.75,1. Endpoint and interpolation panels match. |
| 974--993 / fig:monge-caffarelli-nonconvex-map | 5 | notebooks-figures/monge-caffarelli-nonconvex-map.ipynb | Exact SciPy assignment between two 5,200-point farthest-point samples. Caption calls it an empirical stress test, not a continuum counterexample. Correct. |
| 1113--1118 / fig:monge-sphere-mccann-interpolation | 1 | notebooks-figures/monge-sphere-mccann-interpolation.ipynb | Sixteen-point exact assignment for d_S^2/2 and spherical linear interpolation. All retained samples stay in the upper hemisphere; minimum z about 0.1286. Geodesics and times match. |
| 1127--1132 / fig:monge-hyperbolic-mccann-interpolation | 1 | notebooks-figures/monge-hyperbolic-mccann-interpolation.ipynb | Sixteen-point exact assignment for d_H^2/2, hyperboloid interpolation, max disk radius about 0.8461, constant-speed residual about 3.6e-13. Poincare distance formula and boundary label are correct. |
| 1247--1252 / fig:monge-cdf-quantile-mixtures | 1 | notebooks-figures/monge-cdf-quantile-mixtures.ipynb | One-, two-, and three-mode Gaussian mixtures; aligned quarter-mass guides. Density/CDF/quantile inversion and labels agree. |
| 1445--1463 / fig:monge-1d-quantile-geodesic | 4 | notebooks-figures/monge-1d-quantile-geodesic.ipynb | Times 0,1/3,2/3,1. Quantiles interpolate linearly; densities are recovered by quantile differentiation. Correct. |
| 1608--1627 / fig:monge-tree-mccann-interpolation | 5 | notebooks-figures/monge-tree-mccann-interpolation.ipynb | 22 vertices, 21 edges, unit-mass nonuniform histograms, squared-path optimal plan, 11 displayed packets. Retained mass is 1 at every time. Caption and packet paths match. |
| 1689--1714 / fig:monge-triangular-rearrangement | 7 | notebooks-figures/monge-triangular-rearrangement.ipynb | Smoothed 220 x 220 histograms; 18,000 horizontal ranks and 1,400 vertical ranks per active column; pivot x-marginal error about 2.5e-16. Correct as a histogram approximation to the triangular map. |
| 1810--1823 / fig:monge-gaussian-w2-geodesic-1d | 3 | notebooks-figures/monge-gaussian-w2-geodesic.ipynb | Straight paths in (m,sigma) and corresponding Gaussian densities. Endpoint, times, and W2 geometry are correct. |
| 1869--1882 / fig:monge-gaussian-fr-mean-geodesic | 3 | notebooks-figures/monge-gaussian-fr-mean-geodesic.ipynb | Same endpoints/times for Euclidean W2 and sqrt(2)-scaled hyperbolic Fisher--Rao paths. Retained Fisher distance about 3.78297. Correct. |
| 2041--2054 / fig:monge-gaussian-w2-geodesic-2d | 3 | notebooks-figures/monge-gaussian-w2-geodesic.ipynb | Sigma_t=((1-t)I+tA)Sigma_0((1-t)I+tA)^T. Cone coordinates and ellipses match lines 2018--2035. |
| 2326--2337 / fig:monge-gaussian-fr-vs-bures-cone | 2 | notebooks-figures/monge-gaussian-fr-vs-bures-cone.ipynb | Bures paths reach rank-one endpoints. Fisher--Rao uses small PD regularization and omits the infinite-distance boundary endpoint. Caption and retained curves match. |

Asset arithmetic: 3+2+2+10+3+10+5+1+1+1+4+5+7+3+3+3+2=65.

The 16 used notebooks are exactly: monge-jacobian-pushforward-density, monge-1d-map-mixtures, monge-semidiscrete-maps, monge-color-transfer-rgb, monge-polar-factorization, monge-shape-mccann-interpolation, monge-caffarelli-nonconvex-map, monge-sphere-mccann-interpolation, monge-hyperbolic-mccann-interpolation, monge-cdf-quantile-mixtures, monge-1d-quantile-geodesic, monge-tree-mccann-interpolation, monge-triangular-rearrangement, monge-gaussian-w2-geodesic, monge-gaussian-fr-mean-geodesic, and monge-gaussian-fr-vs-bures-cone. Three other monge-named notebooks are not referenced by this chapter and are outside the generator count.

## Label and reference reconciliation

The chapter defines 109 labels. The following is the exhaustive line-to-label inventory; the two labels on line 312 intentionally alias one remark.

~~~text
8 sec-monge; 18 sec-measures; 28 def-probability-simplex;
43 def-discrete-measure; 46 eq-discr-meas; 82 def-polish-metric-space;
102 def:support; 122 def-radon-probability-measures; 159 def-relative-density;
181 defn-total-variation; 203 prop-tv-dual-measure; 261 def-random-variable-law;
280 sec-push-forward; 299 defn-pushfwd; 301 eq-equiv-pushfwd;
305 eq-push-fwd; 312 rem-pullback-pushforward;
312 rem-push-forward-pull-back; 341 prop-push-forward-densities;
344 eq-pfwd-density; 380 fig:monge-jacobian-pushforward-density;
404 sec-monge-formulation; 405 sec-continuous-monge; 414 def-monge-problem;
416 eq-monge-continuous; 441 fig:monge-1d-map-mixtures;
446 prop-empirical-monge-matching; 471 prop-existence-transport-map-atomless;
493 ex-splitting-obstruction; 525 fig:monge-semidiscrete-maps;
550 fig:monge-color-transfer-rgb; 557 def-directed-monge-distance;
559 eq-monge-distance; 569 ex-monge-book-shifting-w1;
593 prop-directed-monge-distance; 645 sec-monge-existence-uniqueness;
658 thm-brenier; 714 defn-not-charging-hypersurfaces;
743 prop-radial-transport; 788 prop-polar-factorization;
829 fig:monge-polar-factorization; 843 sec-monge-interpolation;
848 def-monge-mccann-interpolation; 871 prop-monge-displacement-geodesic;
934 fig:monge-shape-mccann-interpolation; 948 prop-caffarelli-regularity;
990 fig:monge-caffarelli-nonconvex-map; 1010 eq-monge-ampere;
1029 prop-linearized-monge-ampere; 1064 sec-beyond-quadratic-euclidean-cost;
1117 fig:monge-sphere-mccann-interpolation;
1131 fig:monge-hyperbolic-mccann-interpolation; 1139 def-twist-condition;
1148 prop-twist-prevents-splitting; 1176 def-mtw-condition;
1194 prop-mtw-regularity-implication; 1216 sec-1d-transport-quantiles;
1229 def-cdf-quantile; 1232 eq-cumul-defn; 1237 eq-OT-map-1d;
1251 fig:monge-cdf-quantile-mixtures; 1254 prop-quantile-pushforward;
1277 par-1d-monge-solution; 1286 prop-1d-quantile-map;
1291 eq-1d-monge-map; 1321 rem-1d-composition-optimal;
1356 prop-wass-quantile-1d; 1359 eq-wass-cumul; 1367 eq-w1-1d;
1393 prop-bobkov-ledoux-cdf-w2; 1399 eq-bobkov-ledoux-cdf-w2;
1435 rem-1d-wasserstein-banach-isometry;
1462 fig:monge-1d-quantile-geodesic; 1476 rem-w1-norm-1d;
1483 def-cumulative-function-distance; 1486 eq-cumulative-function-distance;
1504 prop-cumulative-wasserstein-comparison;
1506 eq-cumulative-wasserstein-global-comparison;
1516 eq-cumulative-wasserstein-bounded-comparison;
1570 prop-tree-w1-cumulative; 1572 eq-tree-w1-cumulative;
1626 fig:monge-tree-mccann-interpolation; 1635 prop-knothe-rosenblatt;
1661 alg:triangular-rearrangement; 1713 fig:monge-triangular-rearrangement;
1721 prop-knothe-limit-anisotropic-brenier; 1776 sec-gaussian-bures;
1822 fig:monge-gaussian-w2-geodesic-1d; 1826 rem-fisher-rao-gaussian-mean;
1881 fig:monge-gaussian-fr-mean-geodesic; 1888 eq-gauss-pf;
1898 prop-gaussian-affine-push-forward; 1902 eq-gauss-covariance-pushforward;
1923 def-bures-metric; 1927 eq-bures-defn; 1935 prop-gaussian-w2-bures;
1939 eq-bures-map; 1950 eq-dist-gauss; 1993 rem-elliptical-bures;
2008 rem-2x2-covariance-cone; 2018 eq-2x2-covariance-cone;
2053 fig:monge-gaussian-w2-geodesic-2d; 2063 prop-bures-second-moment-lift;
2127 prop-bures-procrustes; 2133 eq-bures-procrustes;
2188 prop-bures-metric-convex; 2311 eq-2x2-bures-cone-distance;
2321 eq-2x2-fr-cone-distance; 2336 fig:monge-gaussian-fr-vs-bures-cone.
~~~

There are 87 ref/eqref commands and one explicit hyperref, hence 88 cross-reference occurrences and 72 unique targets. Every target resolves in the current TeX tree. Exhaustive occurrence matrix:

~~~text
67 eq-discr-meas;
88 rem-bb-path-space, sec-path-space-schrodinger;
96 prop-wasserstein-space-polish;
290 eq-discr-meas;
355 eq-push-fwd;
360 eq-pfwd-density;
364 fig:monge-jacobian-pushforward-density;
392 eq-push-fwd;
424 defn-pushfwd;
430 prop-1d-quantile-map, fig:monge-1d-map-mixtures;
440 prop-push-forward-densities;
488 eq-monge-continuous, prop-existence-transport-map-atomless;
508 sec-semidiscr-w1, fig:monge-semidiscrete-maps;
530 fig:monge-color-transfer-rgb;
572 ex-book-shifting-w1;
671 sec-dual;
724 ex-splitting-obstruction;
814 fig:monge-polar-factorization;
860 sec-barycenters, sec-wasserstein-gradient-flows,
    sec-kantorovich-plan-interpolation;
873 eq-monge-distance;
879 thm-brenier;
896 prop-directed-monge-distance;
913 fig:monge-shape-mccann-interpolation;
971 fig:monge-caffarelli-nonconvex-map;
1007 eq-pfwd-density;
1019 prop-linearized-monge-ampere;
1071 def-c-concave-functions, sec-c-transfo;
1108 fig:monge-sphere-mccann-interpolation;
1122 fig:monge-hyperbolic-mccann-interpolation;
1154 sec-dual;
1245 fig:monge-cdf-quantile-mixtures;
1282 sec-kantorovich-continuous plus hyperref sec-1d-kantorovich-solution;
1303 prop-quantile-pushforward;
1305 prop-1d-kantorovich-quantile-coupling;
1352 prop-matching-1d-monotone;
1378 prop-1d-kantorovich-quantile-coupling;
1438 eq-wass-cumul, prop-quantile-barycenters, def-sliced-wasserstein,
     eq-sliced-wasserstein, rem-sliced-hilbert-embedding, eq-lot-embedding,
     sec-statistical-ot, eq-bobkov-ledoux-cdf-w2;
1443 fig:monge-1d-quantile-geodesic;
1465 sec-monge-interpolation;
1473 sec-monge-pbm;
1477 eq-w1-1d, sec-W1;
1481 eq-w1-1d;
1531 eq-w1-1d;
1537 eq-cumulative-wasserstein-global-comparison;
1540 prop-wass-quantile-1d;
1546 eq-cumulative-wasserstein-bounded-comparison,
     eq-cumulative-wasserstein-global-comparison;
1550 eq-cumulative-wasserstein-bounded-comparison, prop-wass-topology-polish;
1552 eq-cumulative-wasserstein-global-comparison;
1595 eq-tree-w1-cumulative;
1598 eq-tree-w1-cumulative, eq-w1-1d;
1604 fig:monge-tree-mccann-interpolation;
1684 fig:monge-triangular-rearrangement;
1709 fig:monge-shape-mccann-interpolation;
1808 fig:monge-gaussian-w2-geodesic-1d;
1865 fig:monge-gaussian-fr-mean-geodesic;
1955 def-bures-metric;
1962 eq-bures-map;
1964 prop-gaussian-affine-push-forward;
2004 eq-bures-map, eq-dist-gauss;
2038 fig:monge-gaussian-w2-geodesic-2d;
2120 prop-gaussian-w2-bures;
2159 eq-bures-procrustes;
2176 def-bures-metric;
2184 sec-quotient-wasserstein-procrustes;
2199 prop-bures-procrustes;
2220 prop-bures-procrustes;
2297 eq-2x2-covariance-cone;
2323 fig:monge-gaussian-fr-vs-bures-cone.
~~~

There is no unresolved target and no duplicate chapter-local label. The two line-312 labels are deliberate aliases. Duplicate labels found only under OT4ML/removed are neither part of the current compiled section set nor referenced here.

## Citation-sensitive claim matrix

There are 36 citation commands, 66 citation-key occurrences, and 44 unique keys. All 44 keys occur in OT4ML/all.bib. P means a relevant primary source was directly checked; D means the mathematical statement was independently derived and the source metadata/subject was reconciled; A marks an active attribution/citation defect.

| Key and source lines | Audit |
|---|---|
| Monge1781 (10, 407) | D: historical Monge formulation fits. |
| Villani03 (10) | D: general OT background fits. |
| Villani09 (10, 677, 724, 963, 1080, 1105, 1200) | D: Brenier, source hypotheses, Riemannian, and MTW overview uses fit; CH2-004 is independently about theorem precision. |
| SantambrogioBook (10, 498, 724) | D: splitting and source-hypothesis uses fit. |
| rachev1998mass (10) | D: general background fits. |
| rudin1987realcomplex, bogachev2007measure (144; Bogachev also 480) | D: compact Riesz and atomless standard-space isomorphism uses fit. CH2-001 does not arise from these sources. |
| reinhard2001color, pitie2005n (530) | D: affine color statistics and iterative one-dimensional projection background fit. |
| rabin-ssvm-11 (530) | A: CH2-006. The primary paper is sliced/barycentric texture mixing, not direct support for a genuine 3D palette map. |
| MR923203, Brenier91 (654, 783) | P/D: Brenier map and polar factorization attributions fit. |
| gangbo1996geometry (677, 724, 1080) | P/D: strictly convex displacement costs and weakened source hypotheses fit. |
| caffarelli2002constructing (677) | D: convex-gradient transport context fits. |
| mccann1997convexity (860, 1105) | P/D: displacement interpolation/convexity and manifold framework fit. |
| caffarelli2003monge (963) | D: interior and global regularity overview fits; RQ2-001 asks which boundary version is intended. |
| oliker1989numerical, caffarelli1999problem, Loeper:2005fn, benamou2014numerical, froese2011convergent, benamou2016monotone, mirebeau2015discretization, sulman2011efficient (1021) | D: representative Monge--Ampere numerical categories fit. No convergence or complexity theorem is specifically claimed. |
| mccann2001polar (1105) | P/D: Riemannian polar-factorization framework fits; CH2-008 is the chapter's omitted hypothesis package. |
| ma2005regularity, trudinger2001monge (1172, 1200) | P/D: MTW origin and regularity role fit; no source rescues the proposition's undefined placeholders, CH2-004. |
| loeper2009regularity (1200) | P: necessity of weak MTW for continuity for arbitrary smooth positive data is supported. |
| Loeper2011Sphere (1207) | P: positive cost-sectional curvature for round-sphere squared distance away from cut locus is supported. |
| KimMcCann2012 (1207, twice) | P: product/submersion preservation of nonnegative cross-curvature and complex projective examples are supported. |
| FigalliKimMcCann2013 (1207) | P: regularity context for products of round spheres is supported. |
| BobkovLedoux2019EmpiricalKantorovich (1391) | P/A: formula and constants are exact; the memoir's explicit del Barrio credit yields CH2-011. |
| VauthierMerigotKorba2026CDFSW (1391) | P: the primary preprint exists and supports data-parallel CDF sliced-Wasserstein estimation. |
| TreeEMD2007 (1566, 1598) | D: tree cut/EMD context fits. |
| LeYamadaFukumizuCuturi2019TreeSliced (1566, 1598) | D: tree-sliced context fits. |
| indyk, andoni2008earth (1598) | D: tree embeddings for EMD context fits. |
| Knothe1957, Rosenblatt1952 (1632) | D: historical triangular rearrangement attribution fits. |
| carlier2010knothe (1716, 1742, 1755) | P: anisotropic theorem, coordinate order, conditional atomlessness, and residual induction match; CH2-005 is retired. |
| costa2015fisher (1831) | D: Gaussian Fisher geometry context fits; chapter formulas independently derived. |
| bures1969extension, gelbrich1990formula, bhatia2018bures (2007) | P/D: Bures/Gaussian/PSD metric attributions fit; formulas independently derived. |

The table groups keys cited together but accounts for all 44 unique keys and all 66 key occurrences. Mathematical defects CH2-003, CH2-007--010, CH2-012, and CH2-013 do not depend on citations.

## Notation, dimension, and normalization audit

| Topic | Reconciliation |
|---|---|
| Measure classes | M(X) is finite signed Borel measures by default; M_+(X) and M_+^1(X) are positive Radon/probability classes. This inheritance is the source of CH2-013. |
| Radon regularity | Support is defined only for positive measures. Finite Borel measures on Polish spaces are Radon. Compactness is used exactly for C(X)^*=M(X); CH2-001 prevents extending that identification silently. |
| Histogram/discrete mass | Probability vectors sum to one. Empirical laws use 1/n. Repeated support points must be merged before the discrete TV l1 formula; the text does so. |
| Relative density | d alpha=rho d lambda is valid for positive or signed alpha<<lambda. Nonnegative extended test integration is unrestricted only for positive alpha; signed tests require integrability or a defined one-sided extended integral: CH2-013. |
| Scalar versus vector TV | Scalar TV is fully defined and proved. The supremum omits an outer absolute value, but the symmetric unit ball makes it equivalent. Vector-measure TV is not claimed; RQ2-002 is scope only. |
| TV normalization | ||alpha||_TV=|alpha|(X), so probability TV here is the full l1 density difference, not the alternative half-l1 statistical convention. All later constants are internally consistent. |
| Push-forward Jacobian | rho_alpha(x)=|det DT(x)| rho_beta(Tx). Equal dimensions, C1 diffeomorphism, absolute sign, inverse denominator, and a.e. qualifiers are all present. No multiplicity/area-formula case is claimed. |
| Cost normalization | Quadratic Brenier sections use ||x-y||^2. The general p section uses ||x-y||^p/p. This rescales values but not minimizers. q=p/(p-1) is correct modulo the zero convention CH2-007. |
| Directed distance | Tilde W_p^p is an infimum over maps and may be +infinity. Roots, Minkowski exponents, orientation, and the distinction from a symmetric metric are consistent. |
| Monge--Ampere | D2 phi is d x d. No absolute determinant is needed on the convex PSD branch. Linearization is -div(rho_0 grad u)=r, with correct no-flux boundary sign. |
| One-dimensional domains | CDF uses (-infinity,x], quantile is left generalized inverse on (0,1), and target atoms are allowed. CH2-009 repairs only endpoint representatives. |
| W1 signed norm | Exact domain is zero total mass plus F_xi in L1. A finite |xi|-first moment is sufficient, not necessary: CH2-012. |
| Tree formula | Edge length multiplies absolute subtree mass. It is W1 for path length, not squared path cost. Total zero imbalance closes the root flux. |
| Triangular map | Coordinate k depends on x_1,...,x_k. Source conditionals, not target conditionals, need atomlessness for forward maps; target atomlessness is additionally used in the anisotropic invertibility argument and is supplied there. |
| Gaussian covariance | Means are in R^d; covariances and affine A are d x d. The unique Brenier A requires PD endpoint covariances. Distance formulas, not deterministic maps from singular sources, extend to PSD. |
| Bures square roots | Every unqualified matrix square root is the principal PSD root. Formula placement (Sigma^{1/2} Lambda Sigma^{1/2}) is dimensionally and cyclically correct. |
| Procrustes dimensions | Factors are d x d' with d'>=d; orthogonal matrices act on the right in O(d'). Products, singular values, and trace identities are dimensionally valid. |
| Raw moment versus covariance | Phi_2 is explicitly raw second moment. Centered Gaussian laws attain every PSD raw matrix, so the quotient needs no missing mean term. |
| Fisher--Rao | g_Sigma(D,E)=1/2 tr(Sigma^{-1}D Sigma^{-1}E), hence squared distance is 1/2 times the squared Frobenius logarithm. Scalar mean-varying metric and sqrt(2) hyperbolic scaling agree. |
| 2 x 2 cone | (t,u,v)=(a+b,a-b,2c)/sqrt(2) is Frobenius-orthonormal and 2 det Sigma=t^2-u^2-v^2. Both Bures and generalized-eigenvalue formulas check. |

## Topology and measurability audit

- Polish hypotheses are present where standard Borel isomorphisms, disintegration, weak compactness, or Wasserstein topology are used.
- All displayed Monge maps are measurable under their stated constructions: convex gradients use a.e. Borel representatives; generalized quantiles are monotone/Borel; regular conditional quantiles admit measurable versions under the standard Borel hypotheses.
- Finite convex h is continuous, so CH2-003 is a signed-integral finiteness defect, not a measurability defect.
- The push-forward definition correctly tests bounded measurable functions. CH2-001 arises only when the remark changes to unbounded C spaces and Banach-dual notation.
- The directed Monge separation proof uses bounded Lipschitz functions and does not assume infimum attainment.
- On a fixed compact interval, the two-sided normalized estimate proves D_p and W_p induce the same topology for finite p, hence weak convergence there.
- On R, the escaping-mass example correctly shows W_p stronger than D_p for p>1: D_p^p=n^{1-p}, while W_p^p=n^{p-1}.
- D_infinity and W_infinity are correctly incomparable even on [0,1].
- Weak graph-plan convergence to the Knothe graph implies convergence in probability by Lusin/Portmanteau; common bounded support gives uniform integrability and L2 convergence.
- SPD Fisher--Rao geometry sends the PSD boundary to infinite distance. Bures extends continuously to the closed PSD cone at finite distance.

## Boundary, endpoint, and equality-case audit

- **Zero mass:** Probability constructions have mass one. Directed distance compares equal unit masses. Tree imbalance has total zero. No denominator uses a zero total mass.
- **Signed integration:** Nonnegative integration against signed alpha can be undefined; CH2-013 supplies the exact repair.
- **Atoms:** Empirical multiplicities, source-atom splitting, target atoms under generalized quantiles, alpha/beta atomlessness for composition, and conditional atomlessness in Knothe are correctly distinguished after CH2-010.
- **Quantile endpoints:** Values at 0 and 1 are null for Lebesgue push-forwards but formally absent: CH2-009.
- **p endpoints:** The p-gradient formula is for 1<p<infinity. p=1 loss of strict convexity and book-shifting nonuniqueness are correctly handled elsewhere; p=infinity is only used in separate D_infinity/W_infinity examples.
- **Zero gradient:** The inverse duality map is continuous at zero but its factored expression needs CH2-007.
- **Monge infimum/minimum:** Definitions correctly use infimum except where existence theorems provide a minimizer. The directed metric proof never assumes attainment.
- **Directed equality:** Concatenated upper bounds and the oriented triangle inequality force the stated constant-speed equalities. Interpolant injectivity is needed only before t=1 and is proved by strong monotonicity.
- **Brenier uniqueness:** Uniqueness is alpha-a.e. and plan uniqueness follows because every optimal plan lies on the same graph. No pointwise uniqueness is claimed on null sets.
- **Radial origin:** Absolute continuity removes the origin. Discontinuity radii of the monotone radial map are countable and null for the source radial law.
- **Polar factorization:** Absolute continuity of S_#alpha is explicitly assumed, which supplies the inverse Brenier map and uniqueness. Singular linear factors are treated by polar decomposition without claiming an inverse.
- **Monge--Ampere:** Pointwise Jacobian equations are confined to smooth positive densities; Alexandrov interpretation is stated for nonsmooth potentials.
- **Caffarelli boundary:** Interior regularity is sound. Exact global boundary scope remains RQ2-001.
- **Cut locus:** The prose recognizes cut-locus/nonunique-geodesic issues, but source and ambient hypotheses still need CH2-008.
- **One-dimensional uniqueness:** For strictly convex h the monotone coupling is unique; the chapter does not incorrectly assert uniqueness for p=1. Monotone maps are only claimed where the source is atomless.
- **Gaussian singularity:** A scalar or matrix distance can extend to Dirac/rank-deficient laws even when no deterministic map exists from a singular source to a less singular target. The chapter separates the PD map theorem from PSD distance continuation.
- **Bures equality:** The Procrustes minimum is zero exactly on the same PSD matrix orbit. Triangle alignment Q_2 Q_1 is correct. Joint convexity uses compatible block factors.
- **Hellinger convention:** The text says Hellinger geometry rather than asserting the statistically normalized 1/sqrt(2) distance, so no missing factor exists.

## Complexity audit

- Algorithm alg:triangular-rearrangement has d finite stages and a correct measure-level invariant, but no finite input encoding or conditional-law oracle; no runtime claim is made. RQ2-003 asks whether one is intended.
- The tree W1 value has a genuine O(|V|) postorder algorithm. Constructing an explicitly expanded particle coupling could require more output work, but the text claims only value computation.
- Empirical matching is identified with a permutation optimization; no polynomial complexity claim is attached.
- Semidiscrete, assignment, Monge--Ampere, and Gaussian visualizations are numerical examples or literature overviews. Captions do not promote retained residuals into theorems.
- No iterative pseudocode asserts convergence, stopping tolerance, or sample complexity elsewhere in the chapter.

## Prioritized repair order

This was the priority order proposed at audit completion. Every listed repair has now been implemented as recorded in the correction ledger above.

1. **CH2-003:** Make the one-dimensional optimization objective well-defined for every competitor.
2. **CH2-004:** Recast the MTW proposition as an overview or state exact local/global theorems.
3. **CH2-013:** Reconcile the signed-measure convention with the relative-density test identity.
4. **CH2-001:** Restore compact C-M duality or use bounded tests without claiming a full Banach adjoint.
5. **CH2-008:** Add the Riemannian completeness, finite-cost, source-absolute-continuity, and cut-locus package.
6. **CH2-010:** State exactly that alpha and beta are atomless.
7. **CH2-012:** Give the F_xi in L1 norm domain rather than the overbroad zero-mass class.
8. **CH2-007 and CH2-009:** Add the zero-gradient and quantile-endpoint conventions.
9. **CH2-006 and CH2-011:** Correct the RGB source and del Barrio attribution.

Retired CH2-002 and CH2-005 require no mathematical repair. Their optional caption/proof-sketch clarifications are lower priority than every active item.

## Mechanical closure

### ID and severity reconciliation

- Issued finding IDs: CH2-001 through CH2-013, contiguous, 13 issued.
- Active IDs at audit completion: CH2-001, CH2-003, CH2-004, CH2-006, CH2-007, CH2-008, CH2-009, CH2-010, CH2-011, CH2-012, CH2-013.
- Unresolved IDs after the correction pass: none.
- Retired IDs: CH2-002 and CH2-005.
- Audit-time severity partition: 0 Critical + 0 Major + 2 Moderate + 9 Minor = 11 defects, all now resolved.
- Retired findings excluded from totals: 2.
- Second-pass disposition rows for old hypotheses: 12 of 12.
- New second-pass findings: 1, CH2-013.
- Active research questions: RQ2-001 through RQ2-003, 3.
- Retired research questions: RQ2-004, 1.
- Validated ledger: V2-001 through V2-024, contiguous, 24.

### Coverage-count reconciliation

- Structural units: 1 chapter, 7 sections, 29 titled paragraphs, 0 subsections, 0 subsubsections.
- Named/numbered non-proof, non-figure environments: 63 = 18 definitions + 24 propositions + 2 theorems + 14 remarks + 4 examples + 1 algorithm.
- Proof environments: 26, all listed P2-01 through P2-26.
- Display-math units: 129 = 94 bracket + 8 eq + 21 eql + 6 equation/align units, all listed D001 through D129.
- Algorithms/pseudocode: 1 formal algorithm; 1 separate stated tree-value complexity argument.
- Figures: 17 environments, 65 PDF inclusions, 16 used generator notebooks.
- Labels: 109.
- Cross-references: 88 occurrences = 87 ref/eqref + 1 hyperref; 72 unique targets; 0 unresolved.
- Citations: 36 commands, 66 key occurrences, 44 unique keys, 44 present bibliography entries.
- Active mathematical/citation defects represented in matrices: 11 of 11.
- Retired findings represented in disposition and retired ledgers: 2 of 2.

### Source, report, and write-scope reconciliation

- Source before: 2,337 physical lines; 148,459 bytes; SHA-256 643d92beecae27591dd225adf72bca09d3bebcdafd7755de620d9e6e012b7fe5.
- Source after the read-only audit: 2,337 physical lines; 148,459 bytes; SHA-256 643d92beecae27591dd225adf72bca09d3bebcdafd7755de620d9e6e012b7fe5. The audit itself preserved `monge.tex` byte-for-byte.
- Source after the correction pass: 2,340 physical lines; 149,442 bytes; SHA-256 505d8124f351f00858c8e974f27ec519aff8be163d4757c832a26119c5e59bd6.
- First-pass report before rewrite: 722 physical lines; 66,346 bytes; SHA-256 052b7c418e7ad7bd14eaa6b191186da6e76dca040e21eeec7d21b44370e14cac.
- Revised report after rewrite: 875 physical lines; 85097 bytes. Its whole-file digest is reported externally at task completion because embedding a file's own digest would change that digest.
- Workspace write scope during the second-pass audit: the only workspace path created or modified was /Users/gpeyre/Dropbox/github/ot4ml/audit-chap2.md.
- Workspace write scope during the correction pass: /Users/gpeyre/Dropbox/github/ot4ml/OT4ML/sections/monge.tex and this audit report.
- Read-only correction-pass inputs included imported TeX sections, OT4ML/all.bib, all generator notebooks, and all retained figure assets.
- Temporary diagnostics were bounded and confined to /tmp.
- Report checks: complete findings and repairs, reconciled active/retired counts, every required matrix, and ASCII-only text.
