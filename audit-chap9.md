# Mathematical Audit of Chapter 9: Entropic Regularization: Convergence

## Executive summary

This is the second independent, adversarial pass over every physical line of the authoritative Chapter 9 manuscript. It revises in place the first-pass report whose SHA-256 was `d231cd25cf5822e9ad77570517fae39dede3b220377193d96ed8902063306532`:

`/Users/gpeyre/Dropbox/github/ot4ml/OT4ML/sections/sinkhorn-advanced.tex`

The protected source was read in full again, including all prose, definitions, statements, proofs, displays, algorithms, figures, captions, citations, labels, and cross-references. Every imported definition used materially by the chapter was reread at its defining location rather than reconstructed from memory. The central mathematics was independently rederived again, each first-pass finding was actively challenged, primary references and retained figure outputs were rechecked, and bounded numerical diagnostics were run in memory without changing any notebook or asset.

After attempted falsification, the second pass identified **7 genuine defects**:

| Severity | Count | Summary |
|---|---:|---|
| Critical | 0 | No result invalidates the chapter's central program or requires withdrawing a section. |
| Major | 0 | No principal convergence theorem or Gaussian/flow formula is false under its intended hypotheses. |
| Moderate | 3 | Boundary/support assumptions in the Bregman/KL layer; inconsistent primal half-step indexing; non-rigorous topology in the continuous scaling-limit proposition. |
| Minor | 4 | One false sentence in the over-relaxation proof; one incorrect historical attribution; an undefined singleton maximal-correlation endpoint and false doubly singleton Hessian condition number; one figure-caption mismatch. |
| **Total** | **7** | Unique IDs `C9-MOD-01`--`C9-MOD-03` and `C9-MIN-01`--`C9-MIN-04`. |

The following important claims were independently validated: the Bregman three-point argument; cyclic affine projection characterization; topical nonexpansiveness and Fortet monotonicity; the exact robust bound `2 ||C||_infty^2/(epsilon ell)`; the regularization-to-exact-OT corollary and dense arithmetic count; the Birkhoff cross-ratio coefficient; the squared Hilbert factor per Sinkhorn cycle; the local Hessian, maximal-correlation, and Jacobian formulas; `sigma_epsilon <= lambda(K)`; the optimal over-relaxation parameter and rate; the semi-dual Schur complement; all balanced Gaussian constants for the convention `c(x,y)=||x-y||^2`; the one-dimensional Mobius rate; and the signs, determinant factor, time scaling, stationarity, and Gaussian closure of the continuous flow.

The highest-priority repair was `C9-MOD-02`: the theorem-level estimates were mathematically correct only after replacing the newly introduced but undefined cycle notation by the already defined physical half-step notation. The second priority was `C9-MOD-01`, because the standalone KL-scaling proposition was false on the boundary even though the subsequent Sinkhorn application explicitly returned to positive histograms and a positive kernel. The PDE itself was correct, but `C9-MOD-03` needed either to become a formal consistency statement or to use a precise interpolation and convergence topology. All seven findings have now been corrected as recorded below.

## Correction pass -- 2026-08-26

All seven actionable findings were rederived and corrected in the authoritative source `OT4ML/sections/sinkhorn-advanced.tex`. The detailed finding descriptions below are retained as a record of the pre-correction state; they should no longer be read as descriptions of the current manuscript.

| Finding | Status | Implemented correction |
|---|---|---|
| `C9-MOD-01` | **Resolved** | Extended the first argument of the Bregman divergence to `dom(Phi)` while keeping the reference point in `int(dom(Phi))`; made Bregman projections explicitly possibly empty or set-valued; strengthened the tilt and cyclic-projection hypotheses; selected the Fejer comparison point in the interior; and replaced unqualified KL row/column division by a support-compatible statement covering all four zero-mass/reference-mass endpoint cases. |
| `C9-MOD-02` | **Resolved** | Replaced the undefined cycle-indexed half-step plans throughout the Hilbert theorem, proof, posterior estimates, potential bounds, and stopping criteria by the physical sequence already defined in the chapter: `P^(2 ell)` for complete cycles and `P^(2 ell+1)` for row-normalized half-steps. The valid index ranges `ell >= 1` and `ell >= 0` are now explicit. |
| `C9-MOD-03` | **Resolved** | Recast the scaling limit as a conditional convergence theorem for piecewise-affine time interpolants. The statement now gives a uniform positive-Jacobian hypothesis, a quantified normalized consistency residual, and convergence in `C([0,T];C^2)`. The proof uses telescoping sums and a Riemann-sum limit before differentiating the resulting integral equation. The text also states a concrete uniform-Laplace regime that avoids competing torus lifts. |
| `C9-MIN-01` | **Resolved** | Replaced the false equal-modulus characterization by the correct discriminant statement: the roots coalesce at the threshold and form an equal-modulus complex-conjugate pair beyond it. The degenerate case `sigma_epsilon=0` is handled separately. |
| `C9-MIN-02` | **Resolved** | Corrected the attribution: the geometry is Hilbert's; Birkhoff and Samelson independently applied it to Perron--Frobenius theory; Birkhoff supplied the sharp contraction coefficient used in the chapter. |
| `C9-MIN-03` | **Resolved** | Defined maximal correlation as a restricted operator norm with the zero-dimensional convention. Added the singleton discrete cases; separated one-sided and doubly singleton quotient-Hessian spectra; corrected the doubly singleton condition number to one; and qualified the local-rate, conditional-variance, semi-dual-conditioning, and VarPro comparisons when centered spaces are trivial. |
| `C9-MIN-04` | **Resolved** | Made the acceleration caption match the generator exactly: the threshold is inclusive (`at least 35%`), while width and opacity increase affinely with mass rather than being claimed proportional to it. |

### Post-correction verification

- **Source fingerprint:** 1,841 physical lines, 107,451 bytes, SHA-256 `034a776e7967f84d078ac24765257e4f05db8a40dea5da66120bbcc11bf0cc80`.
- **Mathematical diagnostics:** the over-relaxation polynomial reproduces the stated optimal factors for `sigma=0`, `0.8`, and `0.993`; the doubly singleton quotient curvature has sole eigenvalue `2/epsilon`; and the four KL support endpoint cases agree with the revised proposition.
- **Notebook provenance:** all code cells are executed and no stored error output is present in the four Chapter 9 generators: Birkhoff simplex contraction (5/5), projective Sinkhorn simplex contraction (6/6), over-relaxation (9/9), and continuous Sinkhorn flow (5/5).
- **Book build:** two clean `pdflatex` passes produced a 490-page PDF (28,847,307 bytes), with no undefined references or citations, no label-rerun warning, and no overfull box.
- **Visual QA:** the revised material was inspected on the rendered pages containing Definitions 9.1--9.2, Theorem 9.18, Proposition 9.20, Figure 9.3, and Proposition 9.31. The theorem boxes, displays, caption, and page breaks are legible and free of overlap or clipping.

## Verification iteration -- 2026-08-26

A further source-level and mathematical pass actively retested every correction against its neighboring definitions, proofs, and generated figure. No finding was reopened and no new defect survived the checks. The following refinements make the repairs more explicit and less dependent on implicit conventions.

| Area | Improvement made in this iteration |
|---|---|
| Bregman projection | The definition now distinguishes an empty feasible interior from non-attainment and nonuniqueness, instead of conflating these reasons for an empty or set-valued projection. |
| Entropic tilt | Before choosing `Q=a tensor b` as the interior reference, the text explicitly removes zero-mass rows and columns using the support-reduction result. This supplies the strict positivity needed by the Bregman tilt proposition. |
| Sinkhorn plan indexing | The row- and column-normalized plans are now defined together in the single labelled display `eq-sink-matrix`, with the parity of their exact marginals stated immediately afterward. The physical sequence begins after the first row update, consistently with the initialization by `v^(0)`. |
| Acceleration figure | The caption uses a dedicated coupling notation `P_omega^(ell)`, avoiding collision with the physical half-step indexing, and the notebook description now correctly says that displayed widths are mass-dependent rather than proportional to mass. |
| Continuous limit | The proof now names the left-step interpolation, writes the telescoping sum exactly as a time integral along that interpolation, and only then passes to the limit. The geometric hypothesis is consistently called positive-Jacobian, namely `Id+Hess u>0`, rather than positive Hessian. |

The iteration was checked in four complementary ways:

1. Direct calculations verify that the first physical plan has source marginal `a`, the second has target marginal `b`, the doubly singleton full Hessian has spectrum `{0,2/epsilon}` and hence quotient spectrum `{2/epsilon}`, and the stated optimal SOR parameter gives a radius in `[0,1)` for representative correlations.
2. The over-relaxation notebook executes all 9 code cells without stored errors and regenerates its figure successfully.
3. Two complete LaTeX passes resolve all Chapter 9 labels and citations; `eq-sink-matrix` is Equation 9.3, Figure 9.3 and Proposition 9.31 resolve at their intended locations, and the log contains no undefined reference, citation, or overfull-box warning.
4. Rendered pages covering the revised Bregman layer, physical Sinkhorn sequence, Hilbert theorem, local Hessian analysis, acceleration figure, and continuous limit were inspected for legibility and page-flow regressions.

## Scope, second-pass independence, and source freeze

### Protected source

| Item | Value |
|---|---|
| Source path | `/Users/gpeyre/Dropbox/github/ot4ml/OT4ML/sections/sinkhorn-advanced.tex` |
| Protected physical lines | 1,757 |
| Protected bytes | 101,590 |
| Protected SHA-256 | `84cfeba54fee5c28aadc7c17cea4d559d191beddf7e527179832a4c337713278` |
| Second-pass initial check | Exact match |
| Second-pass pre-write check | Exact match |
| Source write performed | No |

The second pass began from the existing report fingerprint supplied above and revised that report in place. The broader worktree was already dirty; unrelated user changes were not inspected for correction, reverted, staged, committed, or pushed. Only the requested report path is written.

### Audit method

1. Reread all 1,757 source lines in ordered chunks and checked the complete physical-block ledger against that reading.
2. Parsed all structural headings, environments, displays, labels, cross-references, citations, and figure inclusions.
3. Followed every chapter-external reference to its defining source and checked the imported normalization and hypotheses.
4. Rederived each displayed convergence estimate, spectral formula, Gaussian expression, and continuous-limit expansion.
5. Searched for boundary, zero-mass, support, gauge, singleton-dimension, and endpoint counterexamples.
6. Inspected all four figure-generator notebooks and all five included PDF assets read-only, including retained outputs and execution order.
7. Ran bounded in-memory numerical diagnostics; no notebook, script, output, or asset was regenerated or overwritten.
8. Checked material citations against original papers, official proceedings, publisher pages, or author manuscripts.
9. Tried to falsify every first-pass finding and every validated-correct entry before deciding whether to retain, rewrite, remove, or add an item.
10. Mechanically checked identifiers, counts, Markdown tables, local paths, cross-reference resolution, bibliography-key resolution, and source preservation.

### Severity calibration

- **Critical:** the chapter's core conclusion is unusable or materially unsafe.
- **Major:** a principal theorem, proof, or claimed rate is false in the stated regime and needs substantial reconstruction.
- **Moderate:** a proposition is false on a meaningful stated case, notation makes a theorem non-well-defined, or a limiting argument is not a valid proposition as written, but the intended result has a local repair.
- **Minor:** a real mathematical, historical, dimensional, or provenance inaccuracy with narrow downstream effect.
- Optional exposition and research extensions are excluded from the count.

## Second-pass refinement

The first-pass report was treated as a set of hypotheses, not as an authority. The complete source, imported notation, relevant primary papers, notebook code, retained notebook outputs, and included assets were rechecked. Stable IDs were preserved whenever the underlying source defect survived.

| Finding | Second-pass disposition | Reason |
|---|---|---|
| `C9-MOD-01` | Retained, diagnosis narrowed and strengthened | An empty `argmin` is still a meaningful set-valued notation, so that first-pass phrasing was too broad. The real defects survive: the divergence is defined only on the interior but used at boundary first arguments, finite attainment is not guaranteed, and the scaling formula fails for zero reference rows/columns. The revised item gives all four scalar endpoint cases. |
| `C9-MOD-02` | Retained unchanged in substance | The iteration macros were reread at `notations_ot.sty:227--231`; none denotes a half-step. The source still switches from the defined physical sequence `P^(2 ell+r)` to an undefined `P^(ell+1/2)`. |
| `C9-MOD-03` | Retained, theorem/formula distinction sharpened | The PDE consistency formula is correct. The defect is the absence of a stated topology and compactness argument that can identify a time derivative from discontinuous step interpolants, not an error in the PDE itself. The cut-locus issue is now treated as content that the blanket uniform-Laplace assumption must make explicit, not as a separate formula error. |
| `C9-MIN-01` | Retained and strengthened | Besides the complex-conjugate counterexample above the discriminant threshold, `sigma=0` gives repeated equal-modulus roots for every `omega`, whereas the displayed equality then holds only at `omega=1`. |
| `C9-MIN-02` | Retained unchanged in substance | Birkhoff's original paper explicitly calls it Hilbert's projective metric and cites Hilbert; the attribution remains historically false. |
| `C9-MIN-03` | Retained and strengthened | The empty unit-sphere problem survives. The second pass also isolates the doubly singleton case, where the quotient Hessian has only eigenvalue `2/epsilon` and condition number 1, not 2. |
| `C9-MIN-04` | Retained unchanged in substance | The notebook still uses width `0.22+2.30*relative_mass` and an inclusive `>=0.35` threshold, contrary to the caption's proportional/strict wording. |

**Disposition totals:** 7 retained; 4 materially refined (`C9-MOD-01`, `C9-MOD-03`, `C9-MIN-01`, `C9-MIN-03`); 3 unchanged in substance; 0 removed; 0 added; 0 severity changes. No new ID was created because the second pass found no new root cause that survived counterexample, dependency, and consequence checks.

## Original actionable findings (resolved)

The seven entries in this section describe the source before the correction pass above. Every entry is now resolved.

### C9-MOD-01: The Bregman/KL layer mixes an interior-only divergence with unqualified boundary scalings

**Severity:** Moderate
**Source:** lines 48--71 (`def-bregman-divergence`, `def-bregman-projection`); lines 84--98 (`prop-bregman-linear-tilt`); lines 143--170 (`alg:cyclic-bregman-projections`, statement of `prop-cyclic-kl-affine`); lines 181--204 (three-point/Fejer proof); lines 250--285 (unlabelled proposition *KL projections are scalings* and proof).
**Root cause:** interior-domain and support conditions are changed silently between definitions, propositions, and the entropy specialization.

**Current claims.**

1. Lines 50--55 define `B_Phi(P|Q)` only for `P,Q in int(Omega)`.
2. Lines 64--70 define the projection for any nonempty convex set and mention only nonuniqueness, without requiring a finite minimizer or acknowledging an empty argmin.
3. Lines 86--97 claim the tilt identity for all `P` in the domain, although the preceding definition does not define the divergence at boundary `P`.
4. Algorithm lines 143--163 call the projectors from only closed convex sets and an interior starting point. The convergence proposition repairs this for its own use by assuming the projections well-defined and compact-interior iterates, but lines 193--204 still state the Fejer inequality for every `Q in C`, including boundary points where the chapter's divergence is undefined.
5. Lines 265--273 state, without hypotheses on `P`, `a`, or `b`, that both KL projections are given by row/column division.
6. Lines 275--284 derive the formula from an interior Lagrange equation with multiplier `u=e^{-lambda}>0`, even when the imposed mass `s` is zero or the reference row has zero mass.

**Rigorous diagnosis.**

The standard lower-semicontinuous extension used in line 58 is well typed for

`P in dom(Phi), Q in int(dom(Phi))`,

provided `Phi(P)` is finite; the manuscript instead restricts both variables to the interior and then immediately uses boundary points. An `argmin` may syntactically denote the empty set, so the notation itself is not the defect. The defect is calling it a projection and subsequently using it as an attained finite minimizer without hypotheses ensuring that. A nonempty convex set alone gives neither finite feasibility nor attainment.

For KL, support is decisive. Reduce one projected row to a nonnegative vector `q` with total `Q=sum_i q_i` and imposed mass `s>=0`.

- If `Q=0` and `s>0`, every feasible row has infinite KL relative to `q`; there is no finite projection, and `s q/Q` is undefined. The `1 x 1` choice `q=[0]`, `s=1` is the smallest formula counterexample. With two columns, every point of the mass-`s` simplex ties at `+infinity` under the literal extended-real argmin convention, so the result is not even a distinguished projection.
- If `Q=0` and `s=0`, nonnegativity forces the unique feasible row `p=0`, but the displayed formula is `0/0`.
- If `Q>0` and `s=0`, the unique minimizer is `p=0` and the scaling factor is `u=0`; lines 279--280 require `u=e^{-lambda}>0`, so their interior multiplier proof does not cover this valid boundary solution.
- If `Q>0` and `s>0`, the finite minimizer is indeed `p=(s/Q)q`, including when some coordinates of `q` vanish; it preserves the reference support.

The symmetric four-way distinction holds for columns. The later Sinkhorn use at line 287 assumes positive histograms and a strictly positive Gibbs kernel, so that application is safe; the standalone proposition and generic definitions are not.

**Minimal repair.**

- Define the extended divergence for `P in dom(Phi)` and `Q in int(dom(Phi))`, and state separately when the lower-semicontinuous extension is used.
- Say that `Proj_C^{B_Phi}(Q)` is a possibly empty argmin, and reserve single-valued projection notation for an attained finite minimum if that is the intended convention.
- In `prop-bregman-linear-tilt`, require `Q^C in int(dom(Phi))` and use the extended first-argument domain.
- In the cyclic algorithm/proof, either use the same extended first-argument definition or restrict the universal Fejer statement to `Q in C intersect dom(Phi)`; retain the proposition's explicit well-definedness and compact-interior hypotheses.
- State the row formula for `q>=0` and `Q>0`; set `p=0` separately when `s=0=Q`; and state that no finite projection exists when `s>0=Q`. Apply this rowwise/columnwise, or impose the simpler intended assumptions `P>0`, `a>0`, `b>0`.
- State that the Lagrange proof handles `s>0`, and treat `s=0` by lower-semicontinuity.

**Downstream impact.**

The positive-kernel Sinkhorn convergence, robust rate, Hilbert theorem, and local analysis are unchanged. The defect matters for the chapter's advertised general Bregman viewpoint, for sparse kernels, zero histogram bins, boundary iterates under non-entropic generators, and any reader who invokes the proposition independently of line 287.

### C9-MOD-02: The Hilbert theorem changes primal indexing and uses an undefined half-step plan

**Severity:** Moderate
**Source:** lines 291--297 (`eq-sink-matrix` and following `align*`); lines 837--867 (`thm-sinkhorn-hilbert-linear`, especially `eq-convsinkh-control` and macro-labelled `eq-convlin-sinkh-prim`); lines 869--893 (proof); lines 946--999 (dual-potential posterior bounds and stopping criteria).
**Root cause:** complete-cycle indices and physical half-step indices are conflated.

**Current claim.**

Lines 291--297 explicitly define the physical plan sequence

- `P^(2 ell) = diag(u^ell) K diag(v^ell)`,
- `P^(2 ell+1) = diag(u^(ell+1)) K diag(v^ell)`,
- `P^(2 ell+2) = diag(u^(ell+1)) K diag(v^(ell+1))`.

Theorem `thm-sinkhorn-hilbert-linear` then says that it uses the associated primal half-step iterates already defined, but lines 849--865 use `P^(ell)` as a complete-cycle plan and introduce `P^(ell+1/2)`, which is nowhere defined. The same notation propagates to lines 881--893, 982--993, and 999.

**Rigorous diagnosis.**

The posterior argument itself is correct. For the row map, the fixed-point residual is

`d_H(u^ell,u^(ell+1)) = d_H(a, P^(2 ell) 1)`

for `ell>=1`. For the column map it is

`d_H(v^ell,v^(ell+1)) = d_H(b, (P^(2 ell+1))^T 1)`

for `ell>=0`. These are exactly the non-normalized marginals. However, if a reader follows the physical sequence already defined at lines 291--297, `P^(ell)` alternates parity and is not always the complete-cycle matrix needed in the theorem; `P^(ell+1/2)` has no referent at all.

There is an additional initialization reason not to hide this distinction: imported equation `eq-sinkhorn` initializes `v^(0)` and computes `u^(1)`; it does not define `u^(0)`. Thus the complete-cycle plan `diag(u^ell)Kdiag(v^ell)` naturally begins at `ell>=1`, while the row half-step begins at `ell=0`. The theorem's stated endpoint ranges reflect this fact, but its plan notation does not.

**Minimal repair.**

Use the existing physical notation consistently:

- replace theorem-level complete-cycle `P^(ell)` by `P^(2 ell)`;
- replace `P^(ell+1/2)` by `P^(2 ell+1)`;
- state the primal log-density estimate for `P^(2 ell)` with `ell>=1`;
- make the same replacements in lines 881--893, 982--993, and 999.

An equally valid repair is to introduce a new symbol, for example `Q^ell=diag(u^ell)Kdiag(v^ell)` and `Q^(ell+1/2)=diag(u^(ell+1))Kdiag(v^ell)`, explicitly declaring that it is cycle-indexed and distinct from the physical sequence `P^r`.

**Downstream impact.**

No contraction constant changes. Without the repair, the posterior estimates, primal sup-norm estimate, and stopping-rule paragraph are formally ambiguous and can point to the marginal that was just normalized rather than the one that must be monitored.

### C9-MOD-03: The continuous scaling-limit proposition does not state a topology that justifies its limit

**Severity:** Moderate
**Source:** lines 1689--1699 (`prop-scaled-log-sinkhorn-limit`); lines 1701--1713 (proof).
**Root cause:** a piecewise-constant interpolation is assumed to converge "smoothly" in time, then a discrete increment is passed directly to a time derivative.

**Current claim.**

The proposition defines

`u_epsilon(t)=u_epsilon^(floor(t/epsilon))`

and assumes these interpolants "converge smoothly on compact time intervals." The proof divides a one-step consistency expansion by `epsilon` and "pass[es] formally to the smooth limit."

**Rigorous diagnosis.**

Each `u_epsilon(t)` is piecewise constant and discontinuous at the time grid unless the iteration has already stopped. It is therefore not an element of an ordinary `C^1`-in-time or smooth spacetime class. The phrase "converge smoothly" could conceivably be intended to refer only to spatial derivatives plus convergence of discrete time differences, but no such topology is stated. Uniform convergence of the values alone does not justify convergence of difference quotients to `partial_t u`; small-amplitude, high-frequency functions give the elementary general counterexample.

For this particular scheme, the claimed PDE can still be obtained because the independently checked consistency expansion is correct and a telescoping-sum argument can pass to an integral equation. That argument needs a stated spatial topology, time compactness, and a uniform remainder along the iterates. The present phrase "Laplace expansion below is uniform along the sequence" is helpful but does not define any of these or explain the treatment of jumps.

**Minimal repair.**

Choose one of two precise formulations.

1. **Formal consistency version:** rename the proposition as a formal first-order consistency statement and conclude only that any sufficiently regular scaling limit must satisfy the PDE.
2. **Conditional convergence version:** use a piecewise-affine interpolation, assume convergence in `C([0,T];C^2(T^d))` (or a stronger spatial norm sufficient for the determinant and composition), a uniform `O(epsilon^2)` consistency remainder in a specified norm, and uniform positivity `Id+Hess u_epsilon >= kappa Id`. Sum the increments and pass to the integral equation before differentiating the regular limit.

The blanket uniform-Laplace assumption can absorb the torus squared-distance cut locus, so the cut locus is not a second formula defect. To make that assumption checkable, state what it entails, for example unique nondegenerate minimizers on one consistent lift and uniform separation from competing lattice lifts.

**Downstream impact.**

The PDE signs, determinant factor, time step `epsilon`, stationarity statement, and one-dimensional Gaussian ODE are correct. The defect affects theorem status and well-posedness, not the formal equation or the plotted numerical experiment.

### C9-MIN-01: "Equal modulus precisely when" is false above the over-relaxation threshold

**Severity:** Minor
**Source:** lines 1260--1275, proof of `prop-sinkhorn-optimal-overrelaxation`, especially lines 1271--1273.
**Current claim:** the limiting two roots have equal modulus precisely when `omega^2 sigma_epsilon^2=4(omega-1)`.

**Diagnosis.**

The equality is the zero-discriminant condition, where the two real roots coalesce. For every `omega` above that threshold and below 2, the roots are a complex-conjugate pair and therefore also have equal modulus `omega-1`. For example, `sigma=0.8`, `omega=1.8` gives roots approximately

`0.2368 +/- 0.76415035 i`,

both of modulus `0.8`, while `omega^2 sigma^2-4(omega-1)=-1.1264`, not zero. At the other endpoint, `sigma=0` gives the repeated roots `1-omega,1-omega` for every `omega`, so their moduli are equal for every `omega`, while the displayed equation holds only at `omega=1`. The next sentence already describes the conjugate branch correctly, and the optimal `omega_star` and `r_star` formulas are correct.

**Minimal repair:** replace "have equal modulus precisely when" by "coalesce precisely when" or "enter the equal-modulus complex-conjugate branch when."
**Downstream impact:** none on the proposition, asymptotic expansion, or figure; only the proof sentence is false.

### C9-MIN-02: The Hilbert metric is misattributed to Birkhoff and Samelson

**Severity:** Minor
**Source:** lines 694--696, narrative after the projective-cone proposition.
**Current claim:** "It was introduced independently by Birkhoff and Samelson" for Perron-Frobenius proofs.

**Diagnosis.**

Birkhoff's 1957 original paper begins by saying that "the projective metric of Hilbert" is applied and cites Hilbert's 1903 work. Birkhoff and Samelson independently developed projective/contraction proofs in Perron-Frobenius theory; they did not introduce Hilbert's metric. The chapter itself correctly calls it Hilbert's metric everywhere else.

**Minimal repair:** "Birkhoff and Samelson independently used Hilbert's projective geometry in 1957 to give quantitative/geometric Perron-Frobenius proofs; Birkhoff established the sharp contraction coefficient used below."
**Downstream impact:** historical only; definitions and theorem are unaffected.

Primary check: [Birkhoff, *Extensions of Jentzsch's theorem*, AMS PDF](https://www.ams.org/tran/1957-085-01/S0002-9947-1957-0087058-6/S0002-9947-1957-0087058-6.pdf), including its Hilbert 1903 footnote; [Samelson DOI record](https://doi.org/10.1307/mmj/1028990177).

### C9-MIN-03: Singleton centered spaces leave maximal correlation undefined and one Hessian endpoint false

**Severity:** Minor
**Source:** lines 1021--1080 (`def-sinkhorn-conditional-operator` and discrete interpretation); lines 1108--1110 (`prop-sinkhorn-local-rate`); lines 1165--1173 (`eq-sinkhorn-conditional-variance-gap`); lines 1243--1275 (`prop-sinkhorn-optimal-overrelaxation` and proof); lines 1357--1386 (`prop-sinkhorn-semidual-curvature`).
**Current claim:** `sigma(pi)` is a supremum over unit vectors in `L_0^2(beta)`, is always in `[0,1]`, and in finite spaces is the second singular value of the normalized coupling. The Hessian proposition then says both spectral endpoints occur and gives condition number `2/(1-sigma_epsilon)`. The same unit sphere appears in the conditional-variance identity, and the semi-dual proposition assigns a condition number on `L_0^2(beta)`.

**Diagnosis.**

If `beta` is a point mass (or `m=1` in the positive discrete setting), `L_0^2(beta)={0}` and the first displayed unit sphere is empty. If either marginal is a point mass, the bilinear unit-sphere supremum is empty. A `1 x 1` normalized coupling also has no second singular value. Thus the asserted equality of the two suprema and the claim `sigma in [0,1]` need an explicit convention.

There is a further doubly singleton endpoint. For `n=m=1`, the positive-curvature matrix before quotienting is `(1/epsilon)[[1,1],[1,1]]`. Quotienting by the gauge `(1,-1)` leaves a one-dimensional space with the sole eigenvalue `2/epsilon`; the lower endpoint `1/epsilon` is absent and the actual spectral condition number is 1. Setting `sigma=0` without a separate carve-out would make line 1110 report 2. If exactly one centered space is zero-dimensional and the other is nontrivial, the quotient spectrum is `{1/epsilon,2/epsilon}`, so the convention `sigma=0` and condition number 2 are correct. When `L_0^2(beta)={0}`, the infimum in lines 1167--1172 and the semi-dual condition number on that zero-dimensional space are also undefined unless separately interpreted.

**Minimal repair:** define `sigma(pi)=0` whenever either centered space is `{0}`, interpret the bilinear and conditional-variance formulas accordingly, and qualify the "second singular value" sentence by `min(n,m)>=2`. In the Hessian proposition, assume at least one centered space is nontrivial or state separately that the doubly singleton quotient condition number is 1. If `L_0^2(beta)={0}`, say that the semi-dual has no centered degree of freedom and omit its condition number. Interpret the over-relaxation endpoint under the same convention.
**Downstream impact:** only one-point marginal cases; all dimensions with both centered spaces nontrivial are correct, and the one-sided singleton case is repaired by the `sigma=0` convention.

### C9-MIN-04: The over-relaxation caption overstates the edge-width encoding

**Severity:** Minor
**Source:** lines 1299--1304, figure `fig:sinkhorn-overrelaxation`, especially caption line 1302; generator notebook code cell 12.
**Current claim:** displayed segment widths are proportional to coupling masses, and entries "larger than 35%" of the maximum are drawn.

**Diagnosis.**

The retained generator uses

`widths = 0.22 + 2.30 * relative_mass`

and selects `plan >= 0.35 * plan.max()`. Width is affine with a nonzero intercept, not proportional; the threshold is inclusive, not strict. Opacity is also affine in relative mass. The visual and substantive convergence claims are unaffected.

**Minimal repair:** either change the caption to "width and opacity increase with mass; entries at least 35% of the maximum are drawn" or change the generator to a zero-intercept width rule.
**Downstream impact:** visual encoding only.

## Prioritized repair checklist

1. **Fix `C9-MOD-02`:** use `P^(2 ell)` and `P^(2 ell+1)` throughout the Hilbert theorem, proof, dual-potential posterior formulas, and stopping paragraph.
2. **Fix `C9-MOD-01`:** make the extended Bregman domain and possible nonattainment explicit; add positivity or support compatibility to the KL scaling proposition.
3. **Fix `C9-MOD-03`:** choose either a formal consistency statement or a piecewise-affine, normed conditional convergence proposition with a telescoping proof.
4. **Fix `C9-MIN-01`:** replace "equal modulus precisely when" with "coalesce precisely when."
5. **Fix `C9-MIN-02`:** credit Hilbert for the metric and Birkhoff/Samelson for its Perron-Frobenius use.
6. **Fix `C9-MIN-03`:** define the zero-dimensional centered-space convention and carve out the doubly singleton Hessian condition number.
7. **Fix `C9-MIN-04`:** align the caption with the affine width and inclusive threshold in the retained notebook.
8. Rebuild only after the manuscript is deliberately edited; no source or build edit was made during this audit.

## Validated-correct ledger

Every item below was independently rederived during the second pass. These are positive derivations with stated qualifications, not merely statements that no counterexample was found and not unchecked carry-overs from the first report.

### VC-01: Bregman tilt identity

**Lines:** 84--109.
Subtracting the two Bregman expressions cancels `Phi(P)` and leaves

`<grad Phi(Q)-grad Phi(Q^C),P> + constant`.

Using `grad Phi(Q^C)=grad Phi(Q)-C/epsilon` gives the stated tilt exactly. This is correct once the domain repair in `C9-MOD-01` is made.

### VC-02: Cyclic Bregman convergence under the stated compact-interior hypothesis

**Lines:** 167--230.
The three-point identity has the displayed sign. First-order optimality yields Bregman-Fejer monotonicity. Summability of consecutive Bregman drops plus compactness inside the differentiability stratum forces adjacent increments to zero. Alternation then places every cluster point in both sets. For affine sets, each normal displacement telescopes into `N_C1+N_C2=N_(C1 intersection C2)`, which is the nearest-point optimality condition. The compact-interior and well-defined-projection assumptions are strong but sufficient.

### VC-03: Positivity explains why ordinary cyclic projections equal the KL closest point

**Lines:** 232--306.
For a strictly positive Gibbs reference and positive marginals, every row and column denominator is positive, the KL projections are multiplicative, the half-steps remain interior, and affinity turns the feasible limit into the KL projection. Thus none of the four boundary cases in `C9-MOD-01` occurs in the chapter's later Sinkhorn application. Dykstra corrections are needed for general convex intersections, but vanish in the affine cyclic argument used here.

### VC-04: Topical maps are variation-nonexpansive

**Lines:** 359--400.
If `a=inf(f-g)` and `b=sup(f-g)`, then `g+a <= f <= g+b`. Monotonicity and additive homogeneity give `Tg+a <= Tf <= Tg+b`, hence `osc(Tf-Tg)<=b-a`. The quotient/gauge interpretation is correct.

### VC-05: Generalized soft transforms and Fortet monotonicity

**Lines:** 409--490 plus imported `eq-phi-soft-c-transform`, lines 2120--2137 of `sinkhorn.tex`.
The extremal minimizer selections reverse order under a larger input potential, while additive shifts translate minimizers with the correct opposite sign. Composing two order-reversing transforms is topical. The subsolution/supersolution iteration is monotone, uniformly bounded, and equicontinuous through the cost modulus; the compactness argument is valid under the stated compact spaces, continuous cost, and compact minimizer intervals.

### VC-06: Robust dual rate and exact constant

**Lines:** 507--614, `prop-sinkhorn-dual-rate`.
Let `M=||C||_infty` after normalizing `0<=C<=M`. Each soft transform has oscillation at most `M`. At a column-normalized iterate with row residual `delta_ell`, concavity and the zero-sum oscillation pairing give

`Delta_ell <= M delta_ell`.

The row update increases the dual by exactly `epsilon KL(a|r_ell)`, and Pinsker gives

`Delta_ell-Delta_(ell+1) >= epsilon delta_ell^2/2 >= epsilon Delta_ell^2/(2M^2)`.

The first-cycle estimate gives `Delta_1<=2M^2/epsilon`. Reciprocals telescope to

`Delta_ell <= 2M^2/(epsilon ell)`.

All factors of 2, the cycle indexing, and the use of the full `l1` convention were checked again against imported `thm-pinsker` and the normalized dual update.

A bounded in-memory test on 12 positive random instances found

`max_{instances,ell} Delta_ell * epsilon * ell / (2M^2) = 0.012180801 < 1`.

This is a diagnostic, not a proof; the proof above is exact.

### VC-07: Cost shifts and exact-OT conversion

**Lines:** 616--646.
Subtracting `min C` changes the primal and dual values by a common mass-one constant and leaves updates/gaps invariant. For `epsilon=delta/log(nm)`, the regularization bias and optimization error are each at most `delta`. Since the computed discrepancy is their signed difference, its absolute value is bounded by their maximum, not their sum. The threshold

`ell >= 2||C||_infty^2 log(nm)/delta^2`

is therefore correct. Dense work is `O(n^2)` per cycle and yields the displayed nearly quadratic count.

### VC-08: Hilbert quotient completeness

**Lines:** 671--692.
The logarithm identifies positive rays with `R^n/span(1)`. Variation is a genuine norm on that finite-dimensional quotient, so completeness and all metric properties follow.

### VC-09: Birkhoff cross-ratio coefficient

**Lines:** 698--772, `thm-birkhoff`.
For a Jacobian row pair `p,q`, the likelihood ratio range satisfies `b/a<=eta(K)`. Maximizing total variation under this range and mean-one constraint gives

`TV(p,q) <= tanh((log eta(K))/4) = (sqrt(eta)-1)/(sqrt(eta)+1)`.

Integrating the logarithmic Jacobian along a segment gives the stated contraction. The coefficient and cross-ratio orientation are correct and invariant under transpose/diagonal scalings.

### VC-10: Perron-Frobenius consequence

**Lines:** 774--817.
Normalization to a positive affine section plus projective completeness gives a unique fixed ray and global linear convergence. The three displayed kernels are positive and doubly stochastic. Independent diagnostics gave:

| Kernel | `eta` | `lambda` | Tangent determinant | Tangent eigenvalues | Tangent anisotropy at 15 steps |
|---|---:|---:|---:|---|---:|
| `K1` | 784.000000 | 0.931034483 | 0.810000 | `0.9, 0.9` | 1.000000 |
| `K2` | 951.918406994 | 0.937211911 | 0.810588 | `0.9 +/- 0.02424871 i` | 1.000000 |
| `K3` | 3302.734375 | 0.965794086 | 0.735732 | `0.92219325, 0.79780675` | 9.567511 |

The caption's geometric distinctions are accurate.

### VC-11: Global Sinkhorn projective rate

**Lines:** 833--894.
Row and column maps are each `lambda(K)`-Lipschitz because fixed diagonal multiplication and inversion are projective isometries. A full cycle is `lambda(K)^2`-contractive. The a posteriori fixed-point inequality contributes exactly `1/(1-lambda^2)`. The primal logarithmic sup bound follows from oscillation additivity and the common mass-one normalization. Only the indexing defect `C9-MOD-02` needs repair.

### VC-12: Cost-oscillation Hilbert bound

**Lines:** 946--1006.
For `K_ij=exp(-C_ij/epsilon)`, every log cross-ratio is at most `2R/epsilon`, so

`lambda(K)<=tanh(R/(2epsilon))`.

Consequently `1-lambda^2` can scale as `4 exp(-R/epsilon)`. The temperature factor in the potential-to-density conversion is correctly retained.

### VC-13: Conditional operator and maximal correlation

**Lines:** 1021--1080.
Disintegration gives mutually adjoint conditional expectations. Conditional Jensen gives operator norm at most one, constants map to constants, and centered spaces are invariant. For positive finite marginals, the weighted matrix representation and normalized-coupling singular-value formula are correct, subject only to the singleton convention in `C9-MIN-03`.

### VC-14: Dual Hessian, quotient spectrum, and local Jacobian

**Lines:** 1088--1163.
Twice differentiating the dual exponential gives the quadratic form

`(1/epsilon) E_pi[(h(X)+k(Y))^2]`.

On the gauge quotient, the block curvature operator is

`(1/epsilon) [[I,T],[T*,I]]`.

Writing the gauge-orthogonal representative as `(h0+m,k0+m)` is correct. When both centered spaces are nontrivial, the centered block has spectral endpoints `1-sigma` and `1+sigma`, the common constant has eigenvalue 2, and the gauge has eigenvalue 0. Thus the quotient condition number is exactly `2/(1-sigma)` when `sigma<1`. With exactly one nontrivial centered space, the `sigma=0` convention gives quotient spectrum `{1,2}` and the same formula. When both spaces are singleton, the quotient has only eigenvalue 2 and condition number 1, as isolated in `C9-MIN-03`. Differentiating the two soft transforms gives `-T` and `-T*`; on the centered quotient a complete cycle has Jacobian `T*T` and exact generic local factor `sigma^2`.

### VC-15: Conditional variance and global-versus-local bound

**Lines:** 1165--1229.
When `L_0^2(beta)` has a unit sphere, the law of total variance gives

`1-sigma^2 = inf E[Var(k(Y)|X)]`

over centered unit vectors. The zero-dimensional convention is the endpoint repair in `C9-MIN-03`. Differentiating the global variation contraction at the fixed point and testing a top centered eigenvector gives `sigma^2<=lambda(K)^2`, hence `sigma<=lambda(K)`. The compact continuous-kernel extension is valid when the optimal density is continuous and bounded above and below.

### VC-16: Optimal block over-relaxation

**Lines:** 1231--1295.
On a singular mode `s`, direct linearization gives the displayed matrix and characteristic polynomial

`z^2-[2(1-omega)+omega^2 s^2]z+(1-omega)^2`.

Balancing the decreasing real-root branch against the increasing conjugate branch yields

`omega_star=2/(1+sqrt(1-sigma^2))`,

`r_star=omega_star-1=(1-sqrt(1-sigma^2))/(1+sqrt(1-sigma^2))`.

Local convergence for `0<omega<2`, the ordinary factor `sigma^2`, the small-gap expansion, and the conservative global interval `0<omega<2/(1+lambda(K))` all match the primary over-relaxation analysis. At `sigma=0`, the characteristic polynomial is `(z-(1-omega))^2`, which confirms both the optimal choice `omega_star=1` and the extra counterexample in `C9-MIN-01`. Only the isolated root-description sentence is wrong.

### VC-17: Semi-dual variable projection

**Lines:** 1306--1406.
Exact maximization over `f` removes the exponential term and yields the stated semi-dual. Its gradient is `1-r_g`. Since `-epsilon log r_g = epsilon(1-r_g)+o(||g-g_epsilon||)`, an ordinary cycle is locally gradient ascent with step `epsilon`, but not globally identical to it. The covariance Hessian equals the Schur complement

`(1/epsilon)(I-T*T)`.

On a nonzero centered semi-dual space, its condition-number bound is `1/(1-sigma^2)`, compared with `2/(1-sigma)` for the full quotient Hessian; the ratio of these bounds is exactly `2(1+sigma)`. If `L_0^2(beta)={0}`, there is no reduced centered degree of freedom and no spectral condition number to compare, as recorded in `C9-MIN-03`.

### VC-18: Gaussian closure and balanced entropic coupling

**Lines:** 1421--1506.
Completing the square preserves quadratic potentials. Replacing a finite-KL coupling by the Gaussian with the same covariance preserves quadratic cost and increases joint entropy, so Gaussian restriction is variationally valid. With

`Sigma_a^(1/2) Sigma_b^(1/2)=U diag(sigma_i) V^T`,

the scalar objective is

`-2 sigma_i s-(epsilon/2)log(1-s^2)`.

Its first-order condition `2 sigma_i=epsilon s/(1-s^2)` gives exactly

`s_i=(sqrt(epsilon^2+16 sigma_i^2)-epsilon)/(4 sigma_i)`.

The cross-covariance orientation, value formula, and `epsilon->0` Bures limit are correct for the chapter's cost convention `||x-y||^2`. A second-pass random-SPD diagnostic in dimensions 1, 2, and 4 found positive block covariances, scalar first-order-condition residual at most `3.7e-14`, and objective increase under bounded perturbations of each scalar optimizer.

### VC-19: Gaussian Sinkhorn divergence

**Lines:** 1510--1560.
Polarization cancels both marginal trace terms and self-bias spectral terms exactly. `psi_epsilon(r)->-2r`, so the covariance term tends to

`tr Sigma+tr Lambda-2 tr[(Sigma^(1/2)Lambda Sigma^(1/2))^(1/2)]`.

All factors of one half are correct.

### VC-20: Exact one-dimensional Gaussian rate

**Lines:** 1564--1627.
Completing the square gives `Q_epsilon(q)=1-1/(1-q+epsilon/2)`. For `A=1-q+epsilon/2`, two transforms give the Mobius map

`M(A)=epsilon/2+A/(1+(epsilon/2)A)`.

Its fixed points are `A_star` and `-A_star^{-1}` and the cross-ratio multiplier is exactly `A_star^{-4}` per complete cycle. Direct floating-point checks at `epsilon=0.01,0.2,2` had maximum cross-ratio error `6.4e-16`. The expansion `A_star^{-4}=1-epsilon+O(epsilon^2)` and cycle complexity `O(epsilon^{-1}log(1/delta))` are correct.

### VC-21: Continuous flow consistency, signs, and stationarity

**Lines:** 1634--1713.
Two Laplace expansions were independently composed in the sign convention `u=-f`. The Gaussian determinant factors multiply to `det(I+Hess u)`, the source and target density factors give `F(x)-G(x+grad u(x))`, and one complete cycle changes `u` by `epsilon` times the displayed right-hand side, up to an `x`-independent gauge term. Thus the PDE sign and time scaling are correct. As a separate exact-Gaussian diagnostic for cost `|x-y|^2/2`, finite differences of one complete soft-transform cycle converge, as `epsilon` decreases, to `dot a=1/sigma_alpha^2-a^2/sigma_beta^2` and `dot q=-a(q-m_beta)/sigma_beta^2`; this checks the full-cycle time factor and both signs without using the PDE derivation.

At stationarity,

`e^{-G(T(x))} det DT(x)=e^{-F(x)} e^r`.

`DT=I+Hess u>0` makes the torus map a degree-one local diffeomorphism, hence a global diffeomorphism. Integrating forces `e^r=1`, giving exactly `T_# alpha=beta`. The converse is correct.

### VC-22: One-dimensional Gaussian flow closure

**Lines:** 1717--1743.
For `T_t(x)=q_t+a_t(x-m_alpha)`, matching quadratic and linear coefficients gives

`dot a=1/sigma_alpha^2-a^2/sigma_beta^2`,

`dot q=-(a/sigma_beta^2)(q-m_beta)`.

The equilibrium is the Gaussian Brenier map. Signs, dimensions, and factors were checked directly.

## Imported dependency audit

Every material imported object was read at its defining source. The central dependencies are:

| Imported object | Defining source and lines | Reconstructed convention/check |
|---|---|---|
| Discrete entropic OT and entropy | `OT4ML/sections/sinkhorn.tex:38--56` | Cost is `dot(P,C)-epsilon H(P)`; `0 log 0=0`. |
| Matrix KL and normalized primal | `sinkhorn.tex:425--490` | Generalized mass-corrected KL; normalized reference is `a tensor b`; fixed-marginal objective differs by a constant. |
| Sinkhorn scaling | `sinkhorn.tex:205--236` | `u^(ell+1)=a/(Kv^ell)`, then `v^(ell+1)=b/(K^T u^(ell+1))`; only `v^0` is initialized. |
| Discrete soft transforms | `sinkhorn.tex:1085--1107` | Weighted log-sum-exp, positive weights for full-support minima. |
| Continuous entropic dual/density law | `sinkhorn.tex:1180--1211` | KL is relative to `alpha tensor beta`; exponential includes the normalized `-1` term. |
| Continuous soft transforms and cycle | `sinkhorn.tex:1255--1275`, `1321--1336` | Domain decorations and signs agree with Chapter 9. |
| Entropic dual uniqueness | `sinkhorn.tex:1280--1307` | Potentials unique modulo `(s,-s)` under compactness/continuity. |
| Generalized `phi` transforms | `sinkhorn.tex:2114--2173` | Argmin selections can be intervals; extremal selections are needed for monotonicity. |
| Sinkhorn divergence | `sinkhorn.tex:2308--2315` | Polarization uses one half of each self-cost. |
| Measure Bregman divergence | `sinkhorn.tex:1952--1964` | Formula is asserted whenever the right side is well defined; this exposes the Chapter 9 domain mismatch. |
| Full TV and Pinsker | `OT4ML/sections/dual-norms.tex:470--526` | TV is full variation, so `l1(a-b)^2 <= 2 KL(a,b)`. |
| Scalar Legendre conjugate | `dual-norms.tex:641--666` | `phi*(s)=sup_{r>=0}(sr-phi(r))`; monotonicity follows from `r>=0`. |
| Hard semi-dual | `OT4ML/sections/semidiscr-w1.tex:27--56` | Eliminates `f` by the hard transform and retains additive gauge. |
| Auction complexity | `semidiscr-w1.tex:362--384` | Dense `O(n^3)` per scaling-phase bound and exactness for integer costs below `1/n`. |
| Hungarian complexity | `OT4ML/sections/matching.tex:594--637` | Exact `O(n^3)` arithmetic/comparison operations and `O(n^2)` storage. |
| Bures metric/Gaussian OT | `OT4ML/sections/monge.tex:1923--1957` | Squared cost convention and covariance trace formula agree. |
| Iteration macros | `OT4ML/notations_ot.sty:227--231` | `it`, `itt`, `ittt` are integer iterate decorations, not half-integer aliases. |

All 129 chapter cross-reference occurrences resolve after recognizing that `eqllead` creates its label from its second macro argument. All 34 unique citation keys occur exactly once in `OT4ML/all.bib`.

## Function-space, topology, gauge, and normalization audit

| Topic | Result |
|---|---|
| Bregman first argument | Defect `C9-MOD-01`: generic definition is interior-only but later uses boundary points. |
| Projection existence | Defect `C9-MOD-01`: a nonempty convex set does not ensure a finite attained minimum; the set-valued argmin may be empty or consist only of infinite-valued ties. |
| KL support | Defect `C9-MOD-01`: a positive target row/column needs positive reference mass; the zero-target/zero-reference case must be defined separately. |
| Discrete Sinkhorn positivity | Correct under explicitly positive histograms and strictly positive finite Gibbs kernel. |
| Potential gauge | Correct: `(f,g)->(f+s,g-s)`; variation/Hilbert quotient removes constants. |
| Scaling gauge | Correct: `(u,v)->(lambda u,v/lambda)`; plans are invariant. |
| Dual Hessian quotient | Correct product-`L2` quotient by `(1,-1)`; common constant `(1,1)` remains curvature eigenvector 2. |
| Semi-dual gauge | Correctly restricted to centered `L_0^2(beta)` for positive curvature. |
| Continuous disintegrations | Valid on the compact metric probability spaces imported from continuous entropic duality. |
| Differentiation under integrals | Explicitly assumed; automatic in finite spaces. In continuous settings it remains a local regularity hypothesis, as stated. |
| Compact conditional operator | Correct for continuous bounded density on compact supports; it is Hilbert-Schmidt. |
| Maximal-correlation attainment | Not needed for the general local upper bound; isolated-eigenvalue equality is correctly qualified. |
| Singleton centered spaces | Defect `C9-MIN-03`: empty unit spheres require `sigma=0` by convention; the doubly singleton Hessian quotient has condition number 1; a zero-dimensional semi-dual has no condition number. |
| Torus flow gauge | Mean-zero subtraction is correct on unit-volume torus. |
| Flow topology | Defect `C9-MOD-03`. |
| Torus cut locus | Not an independent formula error because the proposition assumes a uniform Laplace expansion. The assumption is presently non-checkable and should explicitly require the needed unique lift/nondegeneracy and separation from competing lifts. |
| Gaussian whole-space integrability | Closure proposition explicitly requires finiteness; closed-form proposition assumes positive-definite covariances. |
| Gaussian entropy | Finite relative entropy justifies the differential-entropy identity; singular joint covariance has infinite KL. |

## Endpoint and dimension audit

| Endpoint/dimension | Audit result |
|---|---|
| `epsilon>0` | Required throughout entropic algorithms and stated in imported definitions. |
| `epsilon->0` robust rate | Bias/rate balance and constants correct. |
| `epsilon->0` Hilbert factor | Correct exponential worst-case degeneration. |
| `epsilon->0` Gaussian local factor | Correct `1-epsilon+O(epsilon^2)`. |
| `epsilon->0` Gaussian value | Correct Bures limit; `epsilon log(1-s_i^2)->0`. |
| `epsilon->infinity` Gaussian scalar formula | Well-defined for every positive `epsilon`; no unsupported large-temperature rate is claimed here. |
| `M=supnorm(C)=0` | Correctly separated; one complete cycle reaches the independent plan. |
| Signed cost | Correct after subtracting `min C`; oscillation, not absolute level, is the invariant constant. |
| `nm=1` exact-OT corollary | Correctly excluded because `log(nm)=0`; the doubly singleton local Hessian statement still needs `C9-MIN-03`. |
| Rectangular `n x m` | Bregman, robust, Hilbert, and local formulas are dimensionally consistent. Assignment comparisons are explicitly limited to uniform square problems. |
| Rank-deficient positive kernel | Positive does not imply full rank, but Hilbert contraction still holds. Local `sigma` may be zero; formulas remain valid. |
| Zero histogram entries | Not covered by imported Sinkhorn algorithm and mishandled by the standalone scaling proposition; see `C9-MOD-01`. |
| Positive-semidefinite Gaussian covariances | Chapter restricts closed-form result to positive definite, avoiding division by zero in `s_i`; the cited primary paper treats degenerate extensions, but the chapter does not claim them. |
| `omega->0` and `omega->2` | Local convergence interval is open and exact. At 2 the conjugate modulus reaches 1. |
| `sigma->1` | Full/semi-dual condition numbers diverge and `omega_star->2`, consistently. |
| `sigma=0` | Main local-cycle and acceleration formulas give `omega_star=1`, `r_star=0`. If both marginals are singleton, the full quotient Hessian condition number is 1 rather than the generic formula's 2. |

## Complexity audit

| Claim | Check |
|---|---|
| One dense Sinkhorn cycle is `O(n^2)` | Correct for square dense kernel-vector multiplication; storage not separately claimed. |
| Robust cycle count | Correct: `O(supnorm(C)^2 log(n)/delta^2)` for normalized square size. |
| Total dense arithmetic | Correct multiplication gives `O(n^2 supnorm(C)^2 log(n)/delta^2)`. |
| Hungarian comparison | Imported theorem proves exact `O(n^3)` for square assignment. |
| Auction comparison | Imported theorem gives `O(n^3)` per warm scaling phase and logarithmically many phases; Chapter 9 wording says "per scaling phase," correctly. |
| Interior-point comparison | Qualitative statement about logarithmic accuracy but costly Newton solves is appropriately non-quantitative. |
| Local rates | Spectral factors are per complete two-block cycle; the chapter explicitly converts to a half-step factor where needed. |
| Gaussian scalar cycles | `O(epsilon^{-1}log(1/delta))` is a cycle count along the invariant quadratic orbit, not a full arithmetic-complexity claim. |
| Continuous explicit simulation | Numerical stability cost is not promoted to a theorem; provenance is recorded below. |

## Figure and numerical provenance audit

All notebooks and assets were inspected read-only and rechecked during the second pass. Their byte counts and hashes were unchanged from the first-pass provenance ledger. They were clean relative to Git at the time checked, executed sequentially, and contained no retained error outputs. No notebook or PDF was modified.

### Provenance files

| Item | Lines | Bytes | SHA-256 |
|---|---:|---:|---|
| `notebooks-figures/sinkhorn-birkhoff-simplex-contraction.ipynb` | 791 | 544,039 | `86f81fafc63a5aa57624c73a35af7d00a136c54a99e52fd332ddadc9fc675204` |
| `notebooks-figures/sinkhorn-projective-scaling-simplex.ipynb` | 901 | 414,062 | `4ce1e698d78705c8932ae1d30c33e6c0bc86771b3ce20f894f15ccaa9d3da771` |
| `notebooks-figures/sinkhorn-overrelaxation.ipynb` | 902 | 283,868 | `456fe7b2b08a144f1d0e195a4cd7497f62ff290239c7aa9b5b916992f8a5c6d3` |
| `notebooks-figures/sinkhorn-continuous-epsilon-flow.ipynb` | 557 | 21,589 | `3adb42a250c6a6b817a0ac3b06b0a9c5359432bb579d384af5c2312ca282b497` |
| `notebooks-figures/figure_style.py` | 341 | 11,323 | `1831104c58f5a793695ab31856ebff2a90b500911e8b53976fcabede737768c9` |
| `OT4ML/figures/sinkhorn-birkhoff-simplex-contraction/simplex-contraction.pdf` | 1 PDF page | 13,251 | `4ae40e8825fbc62a685b8be6f85e37cbc5b1289c365b70da3ca3b7588506f9c0` |
| `OT4ML/figures/sinkhorn-projective-scaling-simplex/scaling-contraction.pdf` | 1 PDF page | 899,337 | `4b79d51cd62c100a6750930fae3616d89e37a50e5d60f47a77fe59cde2199576` |
| `OT4ML/figures/sinkhorn-overrelaxation/overview.pdf` | 1 PDF page | 71,289 | `dd852ce194216f81f26dc2e263e0217c73f7b5f94c8a7c22b646c70e49c305f0` |
| `OT4ML/figures/sinkhorn-continuous-epsilon-flow/unimodal.pdf` | 1 PDF page | 24,484 | `2810f4d5380d516165893fb6864f6ba1cc046f704c8dc9aa45a2984c69d5c206` |
| `OT4ML/figures/sinkhorn-continuous-epsilon-flow/multimodal.pdf` | 1 PDF page | 25,983 | `0468faae22f7792c8e7789de4530e665dea40164891ce93dcc4f9da0713dc947` |

### Figure 9.1: positive Markov kernels

**Source lines:** 790--826; figure label `fig:sinkhorn-birkhoff-simplex-contraction`.
**Notebook:** 9 cells; code execution counts 1--5; no errors.
**Retained output:** turns `0.0`, `23.2`, `38.3` degrees; anisotropies `1.00`, `1.00`, `9.57`; common stationary vector `(1/3,1/3,1/3)`.
**Independent check:** positivity, row sums, column sums, eigenvalues, cross-ratio factors, and anisotropy were recomputed. The visual was rendered and inspected; no clipping or caption/content mismatch was found.

### Figure 9.2: nonlinear projective Sinkhorn images

**Source lines:** 896--940; figure label `fig:sinkhorn-projective-scaling-simplex`.
**Notebook:** 11 cells; code execution counts 1--6; no errors.
**Retained output:** turns `0.0`, `-22.2`, `33.3` degrees; anisotropies `1.00`, `1.00`, `42.94`; fixed left scaling `(1/3,1/3,1/3)`.
**Independent check:** boundary samples are propagated by the normalized nonlinear map, images are nested, kernels are invertible, and sampled Hilbert diameters contract. The outer boundary at iteration zero contains zeros and the notebook starts projective diagnostics only after positivity, as the caption says.

### Figure 9.3: blockwise over-relaxation

**Source lines:** 1297--1304; figure label `fig:sinkhorn-overrelaxation`.
**Notebook:** 16 cells; code execution counts 1--9; no errors.
**Parameters/output:** `epsilon=0.01`, `sigma=0.992810`, `omega_star=1.786194`, ordinary local factor `0.985672`, optimal factor `0.786194`, 300-cycle warm start, warm residual `2.481e-4`.
**Retained theoretical/measured residual factors:**

| `omega` | Theory | Measured |
|---:|---:|---:|
| 0.500 | 0.995216 | 0.995221 |
| 1.000 | 0.985672 | 0.985701 |
| 1.786 | 0.786194 | 0.800253 |
| 1.893 | 0.893097 | 0.893725 |
| 1.970 | 0.970000 | 0.972037 |

The optimum run has the largest finite-tail discrepancy because it reaches the numerical floor fastest; the caption describes crosses as fitted empirical gains rather than exact theory. Plan marginal error is asserted below `2e-12`. The only provenance defect is `C9-MIN-04`.

### Figure 9.4: continuous flow

**Source lines:** 1743--1757; figure label `fig:sinkhorn-continuous-epsilon-flow`.
**Notebook:** 11 cells; code execution counts 1--5; no errors.
**Discretization:** periodic grid `N=512`, centered finite differences, explicit Euler `dt=5e-7`, 200,000 steps, final time `0.1`, 13 snapshots.
**Retained diagnostics:** unimodal minimum `1+u_xx=0.261069908`, final potential range `0.057143078`; multimodal minimum `0.269922460`, range `0.036782050`. Thus the determinant argument remained positive.

Independent in-memory grid checks to the same final time gave:

| Case | `supnorm(u_128-u_256)` | `supnorm(u_256-u_512)` | Ratio | `N=256` time-step-halving difference |
|---|---:|---:|---:|---:|
| Unimodal | `1.203745455e-5` | `2.995208230e-6` | 4.019 | `2.38e-8` |
| Multimodal | `5.856589441e-6` | `1.459004138e-6` | 4.014 | same-order negligible value |

The approximately fourfold spatial-error reduction is consistent with the second-order centered stencil. Final right-hand-side sup norms were approximately `0.00901` and `0.02870`, so the simulations had not reached stationarity; the caption does not claim stationarity. Both PDFs were rendered and visually inspected without clipping or semantic mismatch.

## Primary-source citation audit

Material citations were checked against original papers, official proceedings, publisher records, or author manuscripts. The chapter contains 34 unique keys and 43 key occurrences.

| Topic | Primary source checked | Result |
|---|---|---|
| Bregman cyclic projections | [Bregman 1967, MathNet](https://www.mathnet.ru/eng/zvmmf7353) | Supports the classical projection framework; Chapter 9 adds explicit compact-interior assumptions. |
| Bregman/Dykstra | [Bregman-Censor-Reich 1999, Journal of Convex Analysis](https://ftp.gwdg.de/pub/misc/EMIS/journals/JCA/vol.6_no.2/5.html); [Bauschke-Lewis 2000](https://www.tandfonline.com/doi/abs/10.1080/02331930008844513) | Supports correction terms for general convex intersections and closest-point convergence. |
| Iterative Bregman OT | [Benamou et al. 2015, SIAM](https://epubs.siam.org/doi/10.1137/141000439) | Directly supports Bregman/Dykstra use in regularized transport. |
| Fortet monotonicity | [Fortet 1940, Numdam](https://www.numdam.org/item/JMPA_1940_9_19_1-4_83_0/) | Historical attribution to monotone Schrodinger-system iteration is appropriate. |
| IPFP convergence | [Ruschendorf 1995 DOI](https://doi.org/10.1214/aos/1176324703); [Ruschendorf-Thomsen 1998, SIAM](https://epubs.siam.org/doi/10.1137/S0040585X97976301) | Supports positive/full-support convergence and generalized Schrodinger projection context. |
| Sinkhorn-Knopp | [Sinkhorn and Knopp 1967, MSP PDF](https://msp.org/pjm/1967/21-2/pjm-v21-n2-p14-p.pdf) | Original matrix-scaling convergence cross-check; not directly cited in this chapter. |
| Robust sublinear rate | [Peyre 2026, arXiv](https://arxiv.org/abs/2602.01372) | Direct source for the robust `O(1/ell)` Bregman-projection viewpoint. |
| Earlier OT complexity | [Altschuler-Weed-Rigollet 2017, NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2017/hash/491442df5f88c6aa018e86dac21d3606-Abstract.html); [Dvurechensky-Gasnikov-Kroshnin 2018, PMLR](https://proceedings.mlr.press/v80/dvurechensky18a.html) | Supports surrounding Sinkhorn complexity literature, not the exact new constant proved in Chapter 9. Citation placement is acceptable. |
| Birkhoff contraction | [Birkhoff 1957, AMS PDF](https://www.ams.org/tran/1957-085-01/S0002-9947-1957-0087058-6/S0002-9947-1957-0087058-6.pdf) | Supports the Hilbert-projective contraction proof and exposes historical defect `C9-MIN-02`. |
| Franklin-Lorenz | [Franklin and Lorenz 1989, publisher page](https://www.sciencedirect.com/science/article/pii/0024379589904904) | Direct support for Hilbert-metric geometric convergence of matrix scaling. |
| Exact local rate | [Knight 2008, SIAM PDF](https://epubs.siam.org/doi/pdf/10.1137/060659624) | Gives the second nontrivial singular/eigenvalue asymptotic matrix-scaling rate. |
| Over-relaxation | [Lehmann et al. 2022, Springer](https://link.springer.com/article/10.1007/s11590-021-01830-0); [Thibault et al. 2021, Algorithms](https://www.mdpi.com/1999-4893/14/5/143) | Confirms `0<omega<2` locally, exact `omega_star`, and the global conservative interval. Lehmann et al.'s finite-dimensional setup assumes `min(m,n)>=2`, consistent with the singleton qualification in `C9-MIN-03`. It confirms `C9-MIN-01` is only a root-description error. |
| Semi-dual | [Cuturi-Peyre 2018, SIAM](https://epubs.siam.org/doi/abs/10.1137/18M1208654) | Supports regularized semi-dual optimization. |
| Variable projection | [Golub-Pereyra 1973, SIAM](https://epubs.siam.org/doi/abs/10.1137/0710036?journalCode=sjnaam); [Golub-Pereyra 2003 DOI](https://doi.org/10.1088/0266-5611/19/2/201) | Supports exact block elimination and improved reduced conditioning. Chapter's Schur complement is independently derived. |
| Smooth/sparse quadratic OT | [Blondel-Seguy-Rolet 2018, PMLR PDF](https://proceedings.mlr.press/v84/blondel18a/blondel18a.pdf) | Supplement explicitly gives simplex projection and expected-linear-time threshold computation. |
| Stochastic semi-dual | [Genevay et al. 2016, NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2016/hash/2a27b8144ac02f67687f76782a3b5d8f-Abstract.html) | Supports sampled stochastic dual/semi-dual optimization. |
| Gaussian entropic OT | [Janati et al. 2020, NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2020/hash/766e428d1e232bbdd58664b41346196c-Abstract.html) | Supports Gaussian closure and closed forms; constants were independently checked for this manuscript's cost convention. |
| Sharper continuous rates | [Chizat-Delalande-Vaskevicius, Springer](https://link.springer.com/article/10.1007/s10107-025-02242-z) | Supports polynomial-in-temperature improvements under continuous regularity/log-concavity assumptions. |
| Continuous Sinkhorn flow | [Berman 2020, Springer](https://link.springer.com/article/10.1007/s00211-020-01127-x) | The displayed parabolic Monge-Ampere equation agrees with Berman's sign and determinant convention. Theorem 1.2 combines small temperature, many iterations, and simultaneous grid refinement under explicit regularity/local-density assumptions, and the paper separately discusses cut-locus control. Chapter line 1715 is accurate; it does not supply the missing topology in lines 1689--1713. |

No citation was found to reverse a sign, change a normalization, or support a stronger theorem than the cited primary source. The only retained citation-related defect is the prose attribution in `C9-MIN-02`.

## Optional exposition improvements (not defects)

1. State the standard essential-smoothness/essential-strict-convexity definition of a Legendre function rather than listing only consequences used locally.
2. Add an original Sinkhorn-Knopp citation near the matrix-scaling history even though Ruschendorf and Franklin-Lorenz already support the invoked results.
3. Call `thm-birkhoff` the Birkhoff-Hopf contraction theorem if the broader cone formulation is later emphasized; the finite matrix theorem as stated is correctly Birkhoff's.
4. Report confidence windows or fit intervals for the empirical rates in Figure 9.3, especially at `omega_star`, where numerical-floor truncation biases the 80-point tail fit.
5. Mention that the Gaussian closed form can be extended continuously to singular covariances, as the cited Janati et al. paper does, while keeping the present positive-definite proof unchanged.
6. Distinguish iteration complexity, dense arithmetic complexity, and memory complexity in a one-line summary table.
7. In the continuous-flow section, separate formal asymptotics, PDE well-posedness, convergence of the time-discrete scheme, and convergence under simultaneous spatial discretization.

## Open research questions (outside the defect count)

1. Under what minimal semiconcavity/log-concavity assumptions can the local conditional-variance gap be bounded uniformly by a coercive weighted Dirichlet form with sharp constants?
2. Can `sigma_epsilon` be estimated online with certified upper and lower bounds cheaply enough to safeguard near-optimal over-relaxation globally?
3. Is there a global semi-dual preconditioner interpolating between exact Sinkhorn block elimination and the inverse Schur complement while retaining positivity/stability?
4. For noncompact supports and unbounded costs, what weighted projective metric best replaces the finite-diameter Hilbert bound while recovering Gaussian polynomial rates?
5. Can the continuous epsilon-Sinkhorn limit be proved directly for a fixed continuous kernel without simultaneous point-cloud refinement under a clean viscosity/strong-solution framework?
6. What is the sharp relation between the Birkhoff contraction factor and maximal correlation beyond positive finite kernels, especially for nearly deterministic continuous couplings?

## Complete structural inventories

The following inventories are mechanically generated from the protected source. A "physical block" is a maximal nonblank block of source lines. The physical-block ledger therefore accounts for every narrative paragraph, environment body, display block, algorithm fragment, figure block, index-only block, and separator; blank lines contain no source content. Environment and display ledgers then give semantic granularity.

### Heading inventory

| Line | Kind | Text/label |
|---:|---|---|
| 6 | chapter | `Entropic Regularization: Convergence` |
| 25 | section | `Sinkhorn Convergence: Bregman Point of View` |
| 38 | paragraph | `Alternating $\KL$ projections.` |
| 78 | paragraph | `Linear tilts and Gibbs references.` |
| 136 | paragraph | `Cyclic projection convergence.` |
| 232 | paragraph | `Row and column scalings.` |
| 308 | paragraph | `Other divergences.` |
| 353 | section | `Sinkhorn Convergence: Monotone Point of View`; label `sec-sinkhorn-monotone` |
| 359 | paragraph | `Variation seminorm and topical maps.` |
| 409 | paragraph | `Generalized Sinkhorn maps.` |
| 452 | paragraph | `Monotone convergence for generalized Sinkhorn.` |
| 494 | section | `Sinkhorn Convergence: Sublinear Robust Rate` |
| 656 | section | `Sinkhorn Convergence: Linear Hilbert Metric Rate` |
| 667 | paragraph | `Projective contraction.` |
| 831 | paragraph | `Sinkhorn contraction.` |
| 896 | paragraph | `Nonlinear Sinkhorn images of the simplex.` |
| 942 | paragraph | `Dual-potential form of the contraction.` |
| 1010 | section | `Local Convergence Analysis and Acceleration` |
| 1017 | paragraph | `Conditional operator and maximal correlation.` |
| 1082 | paragraph | `Dual Hessian and exact local rate.` |
| 1231 | paragraph | `Blockwise over-relaxation.` |
| 1306 | paragraph | `Entropic semi-dual and variable projection.` |
| 1409 | section | `Entropic Optimal Transport between Gaussians` |
| 1634 | section | `Continuous \texorpdfstring{$\varepsilon$}{epsilon}-Sinkhorn Flow`; label `sec-continuous-epsilon-sinkhorn` |
| 1640 | paragraph | `Parabolic Monge--Amp\`ere limit.` |
| 1677 | paragraph | `Rescaled continuous Sinkhorn iterates.` |
| 1717 | paragraph | `One-dimensional Gaussian closure.` |

### Definition/theorem/proof/algorithm/figure inventory

| ID | Lines | Environment | Label | Title or role |
|---|---:|---|---|---|
| E01 | 48--56 | `defn` | `def-bregman-divergence` | Bregman divergence |
| E02 | 63--71 | `defn` | `def-bregman-projection` | Bregman projection |
| E03 | 84--98 | `prop` | `prop-bregman-linear-tilt` | Linear tilts of Bregman penalties |
| E04 | 99--109 | `proof` | `` | proof of preceding result |
| E05 | 143--163 | `algH` | `alg:cyclic-bregman-projections` | Cyclic Bregman projections |
| E06 | 167--179 | `prop` | `prop-cyclic-kl-affine` | Convergence of cyclic Bregman projections |
| E07 | 180--230 | `proof` | `` | proof of preceding result |
| E08 | 265--273 | `prop` | `` | KL projections are scalings |
| E09 | 274--285 | `proof` | `` | proof of preceding result |
| E10 | 362--369 | `defn` | `def-variation-seminorm` | Variation seminorm |
| E11 | 372--380 | `defn` | `def-topical-map` | Topical map |
| E12 | 382--392 | `prop` | `prop-topical-variation-nonexpansive` | Topical maps are variation-nonexpansive |
| E13 | 394--400 | `proof` | `` | proof of preceding result |
| E14 | 402--407 | `rem` | `rem-topical-maps` | Topical maps and projective geometry |
| E15 | 418--439 | `prop` | `prop-phi-double-soft-transform-monotone` | Generalized Sinkhorn maps are topical |
| E16 | 441--446 | `proof` | `` | proof of preceding result |
| E17 | 457--462 | `prop` | `prop-fortet-monotone` | Monotone convergence of generalized Sinkhorn cycles |
| E18 | 464--481 | `proof` | `` | proof of preceding result |
| E19 | 486--490 | `rem` | `` | Beyond variational transport |
| E20 | 507--524 | `prop` | `prop-sinkhorn-dual-rate` | Robust $O(1/\ell)$ dual rate for discrete Sinkhorn |
| E21 | 526--614 | `proof` | `` | proof of preceding result; internal display label `eq-sinkhorn-gap-residual` is inventoried separately |
| E22 | 620--629 | `cor` | `cor-sinkhorn-dual-complexity` | Approximating unregularized OT by regularized dual costs |
| E23 | 630--640 | `proof` | `` | proof of preceding result |
| E24 | 671--680 | `defn` | `def-hilbert-metric` | Hilbert metric |
| E25 | 683--687 | `prop` | `` | Hilbert metric on the projective cone |
| E26 | 688--692 | `proof` | `` | proof of preceding result |
| E27 | 698--708 | `thm` | `thm-birkhoff` | Birkhoff contraction theorem |
| E28 | 709--772 | `proof` | `` | proof of preceding result; internal display label `eq-birkhoff-proof-dobrushin` is inventoried separately |
| E29 | 819--826 | `figure` | `fig:sinkhorn-birkhoff-simplex-contraction` | positive Markov-kernel simplex contraction; placement `H` |
| E30 | 837--867 | `thm` | `thm-sinkhorn-hilbert-linear` | Projective linear convergence of Sinkhorn |
| E31 | 869--894 | `proof` | `` | proof of preceding result |
| E32 | 933--940 | `figure` | `fig:sinkhorn-projective-scaling-simplex` | nonlinear projective Sinkhorn images; placement `H` |
| E33 | 1027--1067 | `defn` | `def-sinkhorn-conditional-operator` | Conditional coupling operator |
| E34 | 1088--1135 | `prop` | `prop-sinkhorn-local-rate` | Dual Hessian and local Sinkhorn rate |
| E35 | 1137--1161 | `proof` | `` | proof of preceding result |
| E36 | 1178--1185 | `prop` | `prop-sinkhorn-hilbert-controls-local` | The global Hilbert factor controls the local rate |
| E37 | 1186--1221 | `proof` | `` | proof of preceding result |
| E38 | 1243--1258 | `prop` | `prop-sinkhorn-optimal-overrelaxation` | Optimal local block relaxation |
| E39 | 1260--1275 | `proof` | `` | proof of preceding result |
| E40 | 1299--1304 | `figure` | `fig:sinkhorn-overrelaxation` | blockwise over-relaxation comparison; placement `H` |
| E41 | 1328--1349 | `rem` | `rem-sinkhorn-semidual-gradient` | Sinkhorn as an approximate semi-dual gradient ascent |
| E42 | 1357--1387 | `prop` | `prop-sinkhorn-semidual-curvature` | Semi-dual curvature and conditioning |
| E43 | 1389--1404 | `proof` | `` | proof of preceding result |
| E44 | 1421--1435 | `prop` | `prop-gaussian-sinkhorn-closure` | Quadratic closure of Sinkhorn iterates |
| E45 | 1437--1439 | `proof` | `` | proof of preceding result |
| E46 | 1443--1472 | `prop` | `prop-gaussian-sinkhorn-closed-form` | Balanced entropic OT between Gaussians |
| E47 | 1474--1506 | `proof` | `` | proof of preceding result |
| E48 | 1510--1547 | `cor` | `cor-gaussian-sinkhorn-divergence` | Gaussian Sinkhorn divergence and smoothed Bures term |
| E49 | 1549--1560 | `proof` | `` | proof of preceding result |
| E50 | 1564--1601 | `prop` | `prop-gaussian-sinkhorn-1d-rate` | One-dimensional Gaussian Sinkhorn rate |
| E51 | 1603--1625 | `proof` | `` | proof of preceding result |
| E52 | 1645--1658 | `defn` | `def-continuous-epsilon-sinkhorn` | Continuous \texorpdfstring{$\varepsilon$}{epsilon}-Sinkhorn flow |
| E53 | 1662--1665 | `prop` | `prop-continuous-sinkhorn-stationary` | Stationary continuous Sinkhorn potentials |
| E54 | 1667--1675 | `proof` | `` | proof of preceding result |
| E55 | 1689--1699 | `prop` | `prop-scaled-log-sinkhorn-limit` | Rescaled continuous Sinkhorn limit |
| E56 | 1701--1713 | `proof` | `` | proof of preceding result |
| E57 | 1745--1757 | `figure` | `fig:sinkhorn-continuous-epsilon-flow` | one-dimensional continuous flow; placement `ht` |

### Display inventory

| ID | Lines | Form | Label | Content capsule |
|---|---:|---|---|---|
| D001 | 53--55 | `bracket` | `` | `\[ B_\Phi(\P\|\Q)\eqdef \Phi(\P)-\Phi(\Q)-\dotp{\nabla\Phi(\Q)}{\P-\Q}. \]` |
| D002 | 65--69 | `bracket` | `` | `\[ \Proj_{\Cc}^{B_\Phi}(\Q) \eqdef \argmin_{\P\in\Cc} B_\Phi(\P\|\Q), \]` |
| D003 | 88--90 | `bracket` | `` | `\[ \nabla\Phi(\Q^\C)=\nabla\Phi(\Q)-\C/\epsilon. \]` |
| D004 | 92--96 | `bracket` | `` | `\[ \dotp{\P}{\C}+\epsilon B_\Phi(\P\|\Q) = \epsilon B_\Phi(\P\|\Q^\C)+\text{\upshape cst}, \]` |
| D005 | 102--107 | `bracket` | `` | `\[ B_\Phi(\P\|\Q^\C)-B_\Phi(\P\|\Q) = \dotp{\nabla\Phi(\Q)-\nabla\Phi(\Q^\C)}{\P} +\text{cst}. \]` |
| D006 | 113--117 | `bracket` | `` | `\[ \K_{\a,\b}^\epsilon \eqdef (\a\otimes\b)\odot e^{-\C/\epsilon}. \]` |
| D007 | 119--123 | `bracket` | `` | `\[ \dotp{\P}{\C}+\epsilon\KLD(\P\|\a\otimes\b) = \epsilon\KLD(\P\|\K_{\a,\b}^\epsilon)+\text{\upshape cst}. \]` |
| D008 | 132--134 | `eql` | `eq-kl-proj` | `\P_\epsilon = \Proj_{\CouplingsD(\a,\b)}^\KLD(\K_{\a,\b}^\epsilon) \eqdef \uargmin{\P \in \CouplingsD(\a,\b)}...` |
| D009 | 173--177 | `bracket` | `` | `\[ \bar\P = \Proj_{\Cc_1\cap\Cc_2}^{B_\Phi}(\P^{(0)}). \]` |
| D010 | 184--192 | `bracket` | `` | `\[ B_\Phi(\Q\|\P) = B_\Phi(\Q\|\P^+) + B_\Phi(\P^+\|\P) + \dotp{\nabla\Phi(\P^+)-\nabla\Phi(\P)}{\Q-\P^+}. \]` |
| D011 | 195--198 | `bracket` | `` | `\[ \dotp{\nabla\Phi(\P^+)-\nabla\Phi(\P)}{\Q-\P^+}\geq0 \qquad \forall \Q\in\Cc. \]` |
| D012 | 200--205 | `bracket` | `` | `\[ B_\Phi(\Q\|\P) \geq B_\Phi(\Q\|\P^+)+B_\Phi(\P^+\|\P) \qquad\forall \Q\in\Cc. \]` |
| D013 | 209--213 | `bracket` | `` | `\[ B_\Phi(\Q\|Z^{(r)})-B_\Phi(\Q\|Z^{(r+1)}) \geq B_\Phi(Z^{(r+1)}\|Z^{(r)})\geq0. \]` |
| D014 | 219--225 | `bracket` | `` | `\[ \nabla\Phi(\bar \P)-\nabla\Phi(\P^{(0)}) \in N_{\Cc_1}+N_{\Cc_2} = N_{\Cc_1\cap\Cc_2}, \]` |
| D015 | 239--243 | `eq` | `eq-affine-marginal-sets` | `\Cc^1_\a \eqdef \enscond{\P\in\RR^{n\times m}}{\P\ones_m=\a} \qandq \Cc^2_\b \eqdef \enscond{\P\in\RR^{n\time...` |
| D016 | 245--249 | `bracket` | `` | `\[ \CouplingsD(\a,\b) = \Cc^1_\a\cap\Cc^2_\b\cap\RR_+^{n\times m}. \]` |
| D017 | 251--255 | `eql` | `eq-kl-sinkh-proj` | `\itt{\P} \eqdef \Proj_{\Cc^1_\a}^{\KLD}(\it{\P}) \qandq \ittt{\P} \eqdef \Proj_{\Cc^2_\b}^{\KLD}(\itt{\P}). }` |
| D018 | 268--272 | `eq` | `` | `\Proj_{\Cc^1_\a}^{\KLD}(\P) = \diag\pa{\frac{\a}{\P \ones_m}} \P \qandq \Proj_{\Cc^2_\b}^{\KLD}(\P) = \P \dia...` |
| D019 | 278--281 | `eq` | `` | `\log(p/q)+\la \ones=0 \qarrq p = u q \qwhereq u = e^{-\la}>0. }` |
| D020 | 291--291 | `eq` | `eq-sink-matrix` | `\P^{(2\ell)} \eqdef \diag(\it{\uD}) \K \diag(\it{\vD}),}` |
| D021 | 293--297 | `align*` | `` | `\P^{(2\ell+1)} &\eqdef \diag(\itt{\uD}) \K \diag(\it{\vD}) \\ \qandq \P^{(2\ell+2)} &\eqdef \diag(\itt{\uD}) ...` |
| D022 | 315--323 | `eql` | `eq-positive-marginal-sets` | `\Cc^1_{\a,+} \eqdef \Cc^1_\a\cap\RR_+^{n\times m} \qandq \Cc^2_{\b,+} \eqdef \Cc^2_\b\cap\RR_+^{n\times m}, }` |
| D023 | 327--333 | `bracket` | `` | `\[ \big[\Proj_{\Cc^1_{\a,+}}^{B_\Phi}(\Q)\big]_{i,j} = (\Q_{i,j}-\tau_i)_+, \qquad \sum_j(\Q_{i,j}-\tau_i)_+=...` |
| D024 | 339--343 | `bracket` | `` | `\[ B_\Phi(\P\|\xi) = \frac12\sum_{i,j}(\P_{i,j}-a_i b_j)^2. \]` |
| D025 | 345--349 | `bracket` | `` | `\[ \Divergm_\phi(\P\|\a\otimes\b) = \frac12\sum_{i,j}\frac{(\P_{i,j}-a_i b_j)^2}{a_i b_j}. \]` |
| D026 | 365--367 | `bracket` | `` | `\[ \norm{h}_V\eqdef \sup h-\inf h. \]` |
| D027 | 374--379 | `bracket` | `` | `\[ f\leq g\Longrightarrow\mathcal T(f)\leq\mathcal T(g), \qquad \mathcal T(f+s)=\mathcal T(f)+s \quad(s\in\RR...` |
| D028 | 386--390 | `bracket` | `` | `\[ \norm{\mathcal T(f)-\mathcal T(g)}_V \leq \norm{f-g}_V. \]` |
| D029 | 396--398 | `bracket` | `` | `\[ \mathcal T(g)+a\leq\mathcal T(f)\leq\mathcal T(g)+b. \]` |
| D030 | 411--415 | `eql` | `eq-generalized-sinkhorn-map` | `\mathcal A_\phi(f) \eqdef \big(f^{c,\epsilon,\phi}\big)^{\bar c,\epsilon,\phi}. }` |
| D031 | 423--431 | `bracket` | `` | `\[ g\leq g' \Longrightarrow g^{\bar c,\epsilon,\phi}\geq {g'}^{\bar c,\epsilon,\phi}, \qquad (g+s)^{\bar c,\e...` |
| D032 | 433--437 | `bracket` | `` | `\[ \norm{\mathcal A_\phi(f)-\mathcal A_\phi(h)}_V \leq \norm{f-h}_V. \]` |
| D033 | 466--468 | `bracket` | `` | `\[ f^{(0)}\leq f^{(1)}\leq\cdots\leq f^\star, \]` |
| D034 | 474--477 | `bracket` | `` | `\[ \left\|g^{\bar c,\epsilon,\phi}(x)-g^{\bar c,\epsilon,\phi}(x')\right\| \leq \delta(x,x'). \]` |
| D035 | 512--518 | `bracket` | `` | `\[ \Delta^{(\ell)} \eqdef \Dd_\epsilon(\fD^\star,\gD^\star) - \Dd_\epsilon(\fD^{(\ell)},\gD^{(\ell)}) \]` |
| D036 | 520--523 | `bracket` | `` | `\[ 0\leq\Delta^{(\ell)}\leq \frac{2\norm{\C}_\infty^2}{\epsilon \ell}, \qquad \ell\geq1. \]` |
| D037 | 528--531 | `bracket` | `` | `\[ Z_i\eqdef\sum_j b_j\exp\!\left(\frac{\gD_j-\C_{i,j}}{\epsilon}\right), \qquad \fD_i=-\epsilon\log Z_i. \]` |
| D038 | 536--540 | `bracket` | `` | `\[ \norm{\fD^{(\ell)}}_V,\ \norm{\gD^{(\ell)}}_V, \ \norm{\fD^\star}_V,\ \norm{\gD^\star}_V \leq M. \]` |
| D039 | 545--551 | `bracket` | `` | `\[ \P(\fD,\gD) \eqdef (\a\otimes\b) \odot \exp\!\left(\frac{\fD\oplus\gD-\C}{\epsilon}\right). \]` |
| D040 | 553--557 | `bracket` | `` | `\[ \Delta^{(\ell)} \leq \dotp{\fD^\star-\fD^{(\ell)}}{\a-r^{(\ell)}}. \]` |
| D041 | 559--563 | `bracket` | `` | `\[ \abs{\dotp{h}{z}} \leq \frac12\norm{h}_V\norm{z}_1. \]` |
| D042 | 565--567 | `equation` | `eq-sinkhorn-gap-residual` | `\Delta^{(\ell)}\leq M\delta_\ell.` |
| D043 | 570--574 | `bracket` | `` | `\[ \fD_i^{(\ell+1)}-\fD_i^{(\ell)} = \epsilon\log\!\left(\frac{a_i}{r_i^{(\ell)}}\right). \]` |
| D044 | 578--586 | `bracket` | `` | `\[ \Delta^{(\ell)}-\Delta^{(\ell+1)} \geq \epsilon\KLD(\a\|r^{(\ell)}) \geq \frac{\epsilon}{2}\delta_\ell^2 \...` |
| D045 | 589--595 | `bracket` | `` | `\[ e^{-x} \leq \frac{\widehat{\P}^{(1)}_{i,j}}{a_i b_j} \leq e^x. \]` |
| D046 | 597--602 | `bracket` | `` | `\[ \frac{r_i^{(1)}}{a_i} = \sum_j\frac{\widehat{\P}^{(1)}_{i,j}}{a_i}\frac{b_j}{\widehat s_j} \in[e^{-x},e^x]...` |
| D047 | 606--612 | `bracket` | `` | `\[ \frac1{\Delta^{(\ell+1)}}-\frac1{\Delta^{(\ell)}} = \frac{\Delta^{(\ell)}-\Delta^{(\ell+1)}}{\Delta^{(\ell...` |
| D048 | 624--628 | `bracket` | `` | `\[ \ell\geq \frac{2\norm{\C}_\infty^2\log(nm)}{\delta^2} \quad\Longrightarrow\quad \abs{L_0-\Dd_\epsilon(\fD^...` |
| D049 | 633--637 | `bracket` | `` | `\[ 0\leq L_\epsilon-L_0 \leq \epsilon\KLD(\P^0\|\a\otimes\b) \leq \epsilon\log(nm). \]` |
| D050 | 643--645 | `bracket` | `` | `\[ O\!\left(\frac{n^2\norm{\C}_\infty^2\log n}{\delta^2}\right) \]` |
| D051 | 674--678 | `eql` | `eq-hilbert-metric` | `\foralls (\uD,\uD') \in (\RR_{+,*}^n)^2, \quad \Hilbert(\uD,\uD') \eqdef \norm{\log(\uD)-\log(\uD')}_V. }` |
| D052 | 701--707 | `bracket` | `` | `\[ \Hilbert(\K \vD,\K \vD') \leq \la(\K) \Hilbert(\vD,\vD'), \qquad \la(\K) \eqdef \frac{\sqrt{\eta(\K)}-1}{\...` |
| D053 | 711--717 | `bracket` | `` | `\[ F(z)\eqdef\log(\K e^z), \qquad \mathsf P(z)_{i,k} \eqdef \frac{\K_{i,k}e^{z_k}}{(\K e^z)_i}. \]` |
| D054 | 719--723 | `bracket` | `` | `\[ \abs{\dotp{p-q}{h}} \leq \frac12\norm{p-q}_1\norm{h}_V. \]` |
| D055 | 725--733 | `equation` | `eq-birkhoff-proof-dobrushin` | `\norm{\mathsf P(z)h}_V \leq \delta(\mathsf P(z))\norm{h}_V, \qquad \delta(\mathsf P) \eqdef \frac12\max_{i,j}...` |
| D056 | 736--742 | `bracket` | `` | `\[ \frac{\max_k r_k}{\min_k r_k} = \max_{k,\ell} \frac{\K_{i,k}\K_{j,\ell}}{\K_{j,k}\K_{i,\ell}} \leq\eta(\K)...` |
| D057 | 744--750 | `bracket` | `` | `\[ \frac12\norm{p-q}_1 = \sum_kq_k(r_k-1)_+ \leq \frac{(1-a)(b-1)}{b-a}. \]` |
| D058 | 752--760 | `bracket` | `` | `\[ \frac{2\sinh(u/2)\sinh(v/2)}{\sinh((u+v)/2)} \leq \tanh\!\left(\frac{u+v}{4}\right) \leq \tanh\!\left(\fra...` |
| D059 | 764--770 | `bracket` | `` | `\[ \norm{F(z)-F(z')}_V \leq \int_0^1\norm{\mathsf P(z_t)(z-z')}_V\d t \leq \la(\K)\norm{z-z'}_V. \]` |
| D060 | 775--779 | `bracket` | `` | `\[ \Hilbert(\K^\ell u^{(0)},u^\star) \leq \la(\K)^\ell\Hilbert(u^{(0)},u^\star). \]` |
| D061 | 783--789 | `bracket` | `` | `\[ \K^{\ell+1}\simplex_3 = \K^\ell(\K\simplex_3) \subseteq \K^\ell\simplex_3. \]` |
| D062 | 792--803 | `bracket` | `` | `\[ J_3\eqdef\frac{1}{3}\ones_3\ones_3^\top, \qquad A\eqdef 0&-1&1\\ 1&0&-1\\ -1&1&0 , \qquad \K_{\rho,\delta}...` |
| D063 | 805--816 | `bracket` | `` | `\[ \K_1=\K_{.90,0}, \qquad \K_2=\K_{.90,.014}, \qquad \K_3= .950&.018&.032\\ .042&.880&.078\\ .008&.102&.890 ...` |
| D064 | 840--848 | `eql` | `eq-convlin-sinkh` | `\Hilbert(\vD^{(\ell)},\vD^\star) \leq \la^{2\ell}\Hilbert(\vD^{(0)},\vD^\star), \qquad \Hilbert(\uD^{(\ell+1)...` |
| D065 | 850--858 | `eql` | `eq-convsinkh-control` | `\Hilbert(\uD^{(\ell)},\uD^\star) \leq \frac{\Hilbert(\P^{(\ell)}\ones_m,\a)}{1-\la^2} \qandq \Hilbert(\vD^{(\...` |
| D066 | 859--865 | `eqllead` | `eq-convlin-sinkh-prim` | `\eqllead{Lastly,}{eq-convlin-sinkh-prim}{ \norm{\log(\P^{(\ell)})-\log(\P^\star)}_\infty \leq \Hilbert(\uD^{(...` |
| D067 | 873--879 | `bracket` | `` | `\[ d(x,x^\star) \leq d(x,Fx)+d(Fx,Fx^\star) \leq d(x,Fx)+q\,d(x,x^\star), \]` |
| D068 | 899--905 | `bracket` | `` | `\[ F_{\uD}(\uD) \eqdef R(C(\uD)) = \a\oslash\left[\K\left(\b\oslash(\K^\top\uD)\right)\right]. \]` |
| D069 | 907--912 | `bracket` | `` | `\[ \widehat F_{\uD}(p) \eqdef \frac{F_{\uD}(p)}{\dotp{F_{\uD}(p)}{\ones_3}}, \qquad p\in\simplex_3. \]` |
| D070 | 915--921 | `bracket` | `` | `\[ \widehat F_{\uD}^{\,\ell+1}(\simplex_3) = \widehat F_{\uD}^{\,\ell}\!\left(\widehat F_{\uD}(\simplex_3)\ri...` |
| D071 | 924--930 | `bracket` | `` | `\[ \operatorname{diam}_{\Hilbert}\!\left(\widehat F_{\uD}^{\,\ell}(\simplex_3)\right) \leq \la(\K)^{2(\ell-1)...` |
| D072 | 955--963 | `bracket` | `` | `\[ \norm{\fD^{(\ell)}-\fD^\star}_V = \epsilon\Hilbert(\uD^{(\ell)},\uD^\star), \qquad \norm{\gD^{(\ell)}-\gD^...` |
| D073 | 965--972 | `eq` | `` | `\norm{ \log \frac{\d\pi^{(\ell)}}{\d\pi^\star} }_\infty = \frac1\epsilon \norm{ (\fD^{(\ell)}-\fD^\star) \opl...` |
| D074 | 976--980 | `bracket` | `` | `\[ \la=\frac{\sqrt{\eta}-1}{\sqrt{\eta}+1} \leq \tanh(R/(2\epsilon))<1. \]` |
| D075 | 982--987 | `bracket` | `` | `\[ \norm{\fD^{(\ell)}-\fD^\star}_V \leq \frac{\epsilon}{1-\la^2} \norm{\log((\P^{(\ell)}\ones_m)\oslash\a)}_V...` |
| D076 | 989--994 | `bracket` | `` | `\[ \norm{\gD^{(\ell)}-\gD^\star}_V \leq \frac{\epsilon}{1-\la^2} \norm{\log(((\P^{(\ell+1/2)})^\top\ones_n)\o...` |
| D077 | 1043--1047 | `eql` | `eq-sinkhorn-conditional-operator` | `(T_\pi k)(x)\eqdef\int_\Yy k(y)\d\pi_x(y), \qquad (T_\pi^*h)(y)\eqdef\int_\Xx h(x)\d\pi^y(x). }` |
| D078 | 1049--1058 | `eql` | `eq-sinkhorn-maximal-correlation` | `\sigma(\pi) \eqdef \sup_{\substack{k\in L_0^2(\be)\\\norm{k}_{L^2(\be)}=1}} \norm{T_\pi k}_{L^2(\al)} = \sup_...` |
| D079 | 1070--1074 | `eql` | `eq-sinkhorn-conditional-operator-discrete` | `T_\epsilon=\diag(\a)^{-1}\P_\epsilon, \qquad T_\epsilon^*=\diag(\b)^{-1}\P_\epsilon^\top, }` |
| D080 | 1090--1096 | `eql` | `eq-sinkhorn-dual-hessian-form` | `-\epsilon D^2\Dd_\epsilon(f_\epsilon,g_\epsilon) [(h,k),(h',k')] = \int_{\Xx\times\Yy} (h(x)+k(y))(h'(x)+k'(y...` |
| D081 | 1099--1107 | `eql` | `eq-sinkhorn-dual-hessian-operator` | `-\nabla^2\Dd_\epsilon(f_\epsilon,g_\epsilon) = \frac1\epsilon \Id&T_\epsilon\\ T_\epsilon^*&\Id . }` |
| D082 | 1113--1117 | `eql` | `eq-sinkhorn-soft-transform-jacobians` | `D[g\mapsto g^{\bar c,\epsilon}](g_\epsilon)=-T_\epsilon, \qquad D[f\mapsto f^{c,\epsilon}](f_\epsilon)=-T_\ep...` |
| D083 | 1122--1133 | `eql` | `eq-sinkhorn-local-error` | `e^{(\ell+1)} = T_\epsilon^*T_\epsilon e^{(\ell)} + o\!\left(\norm{e^{(\ell)}}_{L^2(\be)}\right), \qquad \lims...` |
| D084 | 1145--1154 | `bracket` | `` | `\[ (1-\sigma_\epsilon) \bigl(\norm{h_0}_{L^2(\al)}^2+\norm{k_0}_{L^2(\be)}^2\bigr) \leq \norm{h_0}_{L^2(\al)}...` |
| D085 | 1166--1173 | `eql` | `eq-sinkhorn-conditional-variance-gap` | `1-\sigma_\epsilon^2 = \inf_{\substack{k\in L_0^2(\be)\\\norm{k}_{L^2(\be)}=1}} \int_\Xx \operatorname{Var}_{\...` |
| D086 | 1180--1184 | `eql` | `eq-sinkhorn-hilbert-controls-local` | `\sigma_\epsilon\leq\la(\K)<1, \qquad \sigma_\epsilon^2\leq\la(\K)^2. }` |
| D087 | 1188--1192 | `bracket` | `` | `\[ \Hilbert\bigl(C(R(\vD)),C(R(\widetilde\vD))\bigr) \leq \la(\K)^2\Hilbert(\vD,\widetilde\vD), \]` |
| D088 | 1198--1202 | `bracket` | `` | `\[ \norm{\mathcal S(g)-\mathcal S(\widetilde g)}_V \leq \la(\K)^2\norm{g-\widetilde g}_V. \]` |
| D089 | 1205--1211 | `bracket` | `` | `\[ \norm{T_\epsilon^*T_\epsilon h}_V \leq \la(\K)^2\norm{h}_V \qquad \text{for every }h\in L_0^2(\be). \]` |
| D090 | 1213--1219 | `bracket` | `` | `\[ \sigma_\epsilon^2\norm{h_\star}_V = \norm{T_\epsilon^*T_\epsilon h_\star}_V \leq \la(\K)^2\norm{h_\star}_V...` |
| D091 | 1236--1240 | `eql` | `eq-sinkhorn-block-overrelaxation` | `f^{(\ell+1)}=(1-\omega)f^{(\ell)}+\omega(g^{(\ell)})^{\bar c,\epsilon}, \qquad g^{(\ell+1)}=(1-\omega)g^{(\el...` |
| D092 | 1245--1256 | `eql` | `eq-sinkhorn-optimal-overrelaxation` | `\omega_\star = \frac{2}{1+\sqrt{1-\sigma_\epsilon^2}}, \qquad r_\star = \omega_\star-1 = \frac{1-\sqrt{1-\sig...` |
| D093 | 1262--1269 | `bracket` | `` | `\[ \mathsf M_\omega(s) = 1-\omega&-\omega s\\ -\omega s(1-\omega)&1-\omega+\omega^2s^2 , \]` |
| D094 | 1278--1286 | `bracket` | `` | `\[ r_\star = \frac{1-\sqrt{\delta_\epsilon}}{1+\sqrt{\delta_\epsilon}} = 1-2\sqrt{\delta_\epsilon} +2\delta_\...` |
| D095 | 1311--1319 | `eql` | `eq-entropic-semidual-local` | `\Ee_\epsilon(g) \eqdef \Dd_\epsilon(g^{\bar c,\epsilon},g) = \int_\Xx g^{\bar c,\epsilon}\d\al + \int_\Yy g\d...` |
| D096 | 1330--1338 | `eql` | `eq-sinkhorn-semidual-gradient-comparison` | `r_g = \exp\!\left( \frac{g-(g^{\bar c,\epsilon})^{c,\epsilon}}{\epsilon} \right), \qquad \nabla\Ee_\epsilon(g...` |
| D097 | 1340--1347 | `bracket` | `` | `\[ (g^{\bar c,\epsilon})^{c,\epsilon}-g = -\epsilon\log r_g = \epsilon\nabla\Ee_\epsilon(g) +o\!\left(\norm{g...` |
| D098 | 1352--1354 | `bracket` | `` | `\[ \min_{U,V}\frac12\norm{U\sigma(VX)-Y}_{\rm F}^2, \]` |
| D099 | 1359--1370 | `eql` | `eq-entropic-semidual-derivatives` | `D\Ee_\epsilon(g)[k] = \int_\Yy k\d(\be-\be_g), \qquad D^2\Ee_\epsilon(g)[k,k'] = -\frac1\epsilon \int_\Xx \op...` |
| D100 | 1372--1382 | `eql` | `eq-entropic-semidual-hessian` | `-\nabla^2\Ee_\epsilon(g_\epsilon) = \frac1\epsilon(\Id-T_\epsilon^*T_\epsilon), \qquad \frac{1-\sigma_\epsilo...` |
| D101 | 1391--1399 | `bracket` | `` | `\[ \int_\Xx \operatorname{Cov}_{\pi_{\epsilon,x}}(k(Y),k'(Y)) \d\al(x) = \int_\Yy kk'\d\be - \int_\Xx(T_\epsi...` |
| D102 | 1426--1433 | `bracket` | `` | `\[ f(x) = -\epsilon\log \int \exp\!\left(\frac{g(y)-\norm{x-y}^2}{\epsilon}\right) \d\be(y) \]` |
| D103 | 1448--1458 | `bracket` | `` | `\[ K_\epsilon = \cov_\al^{1/2} U\diag(s_i)V^\top \cov_\be^{1/2}, \qquad s_i = \frac{\sqrt{\epsilon^2+16\sigma...` |
| D104 | 1460--1470 | `bracket` | `` | `\[ \norm{\mean_\al-\mean_\be}^2 + \tr(\cov_\al)+\tr(\cov_\be) + \sum_i \left( -2\sigma_i s_i -\frac{\epsilon}...` |
| D105 | 1479--1483 | `bracket` | `` | `\[ \KL(\pi\|\al\otimes\be) = -h(X,Y)+h(\al)+h(\be), \]` |
| D106 | 1488--1493 | `bracket` | `` | `\[ \cov_\al & K\\ K^\top & \cov_\be . \]` |
| D107 | 1495--1497 | `bracket` | `` | `\[ \norm{\mean_\al-\mean_\be}^2+\tr(\cov_\al)+\tr(\cov_\be)-2\tr(K), \]` |
| D108 | 1500--1503 | `bracket` | `` | `\[ \min_{0\leq s<1} -2\sigma_i s-\frac{\epsilon}{2}\log(1-s^2). \]` |
| D109 | 1516--1525 | `bracket` | `` | `\[ \tau_\epsilon(r) \eqdef \frac{\sqrt{\epsilon^2+16r^2}-\epsilon}{4r}, \qquad \psi_\epsilon(r) \eqdef -2r\,\...` |
| D110 | 1528--1534 | `bracket` | `` | `\[ \bar\MK_{\norm{\cdot-\cdot}^2}^{\epsilon}(\al,\be) = \norm{\mean_\al-\mean_\be}^2 + \Bb_\epsilon(\cov_\al,...` |
| D111 | 1538--1544 | `bracket` | `` | `\[ \Bb_\epsilon(\Sigma,\Lambda)^2 \eqdef \sum_i \psi_\epsilon\bigl(\sigma_i(\Sigma,\Lambda)\bigr) -\frac12\su...` |
| D112 | 1553--1558 | `bracket` | `` | `\[ \tr\Sigma+\tr\Lambda -2\sum_i\sigma_i(\Sigma,\Lambda) = \Bb(\Sigma,\Lambda)^2, \]` |
| D113 | 1567--1569 | `bracket` | `` | `\[ g^{(\ell)}(y)=q^{(\ell)}y^2+\mathrm{cst}. \]` |
| D114 | 1573--1578 | `bracket` | `` | `\[ \mathsf Q_\epsilon(q) = 1-\frac{1}{1-q+\epsilon/2}, \qquad q<1+\epsilon/2, \]` |
| D115 | 1580--1586 | `bracket` | `` | `\[ A_\ell\eqdef 1-q^{(\ell)}+\frac{\epsilon}{2}, \qquad A_\star\eqdef 1-q_\star+\frac{\epsilon}{2} = \frac{\e...` |
| D116 | 1588--1593 | `bracket` | `` | `\[ \frac{A_\ell-A_\star}{A_\ell+A_\star^{-1}} = A_\star^{-4\ell} \frac{A_0-A_\star}{A_0+A_\star^{-1}}. \]` |
| D117 | 1595--1600 | `bracket` | `` | `\[ 0\leq q_\star-q^{(\ell)} \leq q_\star \left(\frac{4}{\epsilon+\sqrt{\epsilon^2+16}}\right)^{4\ell}. \]` |
| D118 | 1605--1609 | `bracket` | `` | `\[ A_{\ell+1}=M(A_\ell), \qquad M(A)\eqdef a+\frac{A}{1+aA}. \]` |
| D119 | 1611--1616 | `bracket` | `` | `\[ \frac{M(A)-A_\star}{M(A)+A_\star^{-1}} = A_\star^{-4} \frac{A-A_\star}{A+A_\star^{-1}}, \]` |
| D120 | 1618--1623 | `bracket` | `` | `\[ 0<M'(A)=\frac{1}{(1+aA)^2} \leq \frac{1}{(1+aA_\star)^2} =A_\star^{-4}, \]` |
| D121 | 1648--1654 | `equation` | `eq-continuous-epsilon-sinkhorn-pde` | `\partial_t u_t(x) = \log\det\bigl(\Id+\nabla^2u_t(x)\bigr) -G\bigl(x+\nabla u_t(x)\bigr) +F(x)-\bar r_t,` |
| D122 | 1669--1671 | `bracket` | `` | `\[ e^{-G(T(x))}\det\nabla T(x)=e^{-F(x)}e^r. \]` |
| D123 | 1682--1686 | `bracket` | `` | `\[ \mathsf S_\epsilon u \eqdef -\Big((-u)^{c,\epsilon}\Big)^{\bar c,\epsilon}. \]` |
| D124 | 1691--1697 | `bracket` | `` | `\[ u_\epsilon^{(\ell+1)} = \mathsf S_\epsilon u_\epsilon^{(\ell)} - \int_{\TT^d}\mathsf S_\epsilon u_\epsilon...` |
| D125 | 1703--1711 | `bracket` | `` | `\[ \mathsf S_\epsilon u-u = \epsilon\left[ \log\det(\Id+\nabla^2u) -G(\Id+\nabla u)+F \right] +O(\epsilon^2), \]` |
| D126 | 1721--1726 | `bracket` | `` | `\[ \partial_tu_t(x) = \log\bigl(1+u_t''(x)\bigr) -G\bigl(x+u_t'(x)\bigr)+F(x)-\bar r_t. \]` |
| D127 | 1728--1731 | `bracket` | `` | `\[ x+u_t'(x)=q_t+a_t(x-m_\al), \qquad a_t>0. \]` |
| D128 | 1733--1741 | `eql` | `eq-continuous-sinkhorn-gaussian-1d` | `\dot a_t = \frac{1}{\sigma_\al^2}-\frac{a_t^2}{\sigma_\be^2}, \qquad \dot q_t = -\frac{a_t}{\sigma_\be^2}(q_t...` |

### Label inventory

| Line | Label | Origin |
|---:|---|---|
| 9 | `sec-sinkhorn-advanced` | explicit |
| 10 | `sec-entropic-convergence` | explicit |
| 11 | `sec-convergence-dual` | explicit |
| 26 | `sec-convergence-init` | explicit |
| 48 | `def-bregman-divergence` | explicit |
| 63 | `def-bregman-projection` | explicit |
| 84 | `prop-bregman-linear-tilt` | explicit |
| 132 | `eq-kl-proj` | explicit |
| 143 | `alg:cyclic-bregman-projections` | explicit |
| 167 | `prop-cyclic-kl-affine` | explicit |
| 239 | `eq-affine-marginal-sets` | explicit |
| 251 | `eq-kl-sinkh-proj` | explicit |
| 291 | `eq-sink-matrix` | explicit |
| 315 | `eq-positive-marginal-sets` | explicit |
| 353 | `sec-sinkhorn-monotone` | explicit |
| 362 | `def-variation-seminorm` | explicit |
| 372 | `def-topical-map` | explicit |
| 382 | `prop-topical-variation-nonexpansive` | explicit |
| 402 | `rem-topical-maps` | explicit |
| 411 | `eq-generalized-sinkhorn-map` | explicit |
| 418 | `prop-phi-double-soft-transform-monotone` | explicit |
| 457 | `prop-fortet-monotone` | explicit |
| 507 | `prop-sinkhorn-dual-rate` | explicit |
| 565 | `eq-sinkhorn-gap-residual` | explicit |
| 620 | `cor-sinkhorn-dual-complexity` | explicit |
| 660 | `sec-sinkhorn-hilbert` | explicit |
| 671 | `def-hilbert-metric` | explicit |
| 674 | `eq-hilbert-metric` | explicit |
| 698 | `thm-birkhoff` | explicit |
| 725 | `eq-birkhoff-proof-dobrushin` | explicit |
| 823 | `fig:sinkhorn-birkhoff-simplex-contraction` | explicit |
| 837 | `thm-sinkhorn-hilbert-linear` | explicit |
| 840 | `eq-convlin-sinkh` | explicit |
| 850 | `eq-convsinkh-control` | explicit |
| 859 | `eq-convlin-sinkh-prim` | eqllead argument |
| 937 | `fig:sinkhorn-projective-scaling-simplex` | explicit |
| 1011 | `sec-sinkhorn-local-acceleration` | explicit |
| 1027 | `def-sinkhorn-conditional-operator` | explicit |
| 1043 | `eq-sinkhorn-conditional-operator` | explicit |
| 1049 | `eq-sinkhorn-maximal-correlation` | explicit |
| 1070 | `eq-sinkhorn-conditional-operator-discrete` | explicit |
| 1088 | `prop-sinkhorn-local-rate` | explicit |
| 1090 | `eq-sinkhorn-dual-hessian-form` | explicit |
| 1099 | `eq-sinkhorn-dual-hessian-operator` | explicit |
| 1113 | `eq-sinkhorn-soft-transform-jacobians` | explicit |
| 1122 | `eq-sinkhorn-local-error` | explicit |
| 1166 | `eq-sinkhorn-conditional-variance-gap` | explicit |
| 1178 | `prop-sinkhorn-hilbert-controls-local` | explicit |
| 1180 | `eq-sinkhorn-hilbert-controls-local` | explicit |
| 1236 | `eq-sinkhorn-block-overrelaxation` | explicit |
| 1243 | `prop-sinkhorn-optimal-overrelaxation` | explicit |
| 1245 | `eq-sinkhorn-optimal-overrelaxation` | explicit |
| 1303 | `fig:sinkhorn-overrelaxation` | explicit |
| 1311 | `eq-entropic-semidual-local` | explicit |
| 1328 | `rem-sinkhorn-semidual-gradient` | explicit |
| 1330 | `eq-sinkhorn-semidual-gradient-comparison` | explicit |
| 1357 | `prop-sinkhorn-semidual-curvature` | explicit |
| 1359 | `eq-entropic-semidual-derivatives` | explicit |
| 1372 | `eq-entropic-semidual-hessian` | explicit |
| 1411 | `sec-gaussian-sinkhorn` | explicit |
| 1421 | `prop-gaussian-sinkhorn-closure` | explicit |
| 1443 | `prop-gaussian-sinkhorn-closed-form` | explicit |
| 1510 | `cor-gaussian-sinkhorn-divergence` | explicit |
| 1564 | `prop-gaussian-sinkhorn-1d-rate` | explicit |
| 1634 | `sec-continuous-epsilon-sinkhorn` | explicit |
| 1645 | `def-continuous-epsilon-sinkhorn` | explicit |
| 1648 | `eq-continuous-epsilon-sinkhorn-pde` | explicit |
| 1662 | `prop-continuous-sinkhorn-stationary` | explicit |
| 1689 | `prop-scaled-log-sinkhorn-limit` | explicit |
| 1733 | `eq-continuous-sinkhorn-gaussian-1d` | explicit |
| 1756 | `fig:sinkhorn-continuous-epsilon-flow` | explicit |

### Cross-reference inventory

| Target | Occurrence lines | Defining source | Status |
|---|---|---|---|
| `alg:cyclic-bregman-projections` | 141, 170, 250 | `OT4ML/sections/sinkhorn-advanced.tex:143` | resolved uniquely |
| `cor-sinkhorn-dual-complexity` | 498, 642 | `OT4ML/sections/sinkhorn-advanced.tex:620` | resolved uniquely |
| `def-continuous-soft-c-transform` | 1157, 1681 | `OT4ML/sections/sinkhorn.tex:1255` | resolved uniquely |
| `def-measure-bregman-divergence` | 46 | `OT4ML/sections/sinkhorn.tex:1952` | resolved uniquely |
| `def-variation-seminorm` | 679 | `OT4ML/sections/sinkhorn-advanced.tex:362` | resolved uniquely |
| `eq-birkhoff-proof-dobrushin` | 761 | `OT4ML/sections/sinkhorn-advanced.tex:725` | resolved uniquely |
| `eq-bures-defn` | 1559 | `OT4ML/sections/monge.tex:1927` | resolved uniquely |
| `eq-continuous-dual-sinkhorn-iteration` | 1086, 1241, 1681 | `OT4ML/sections/sinkhorn.tex:1331` | resolved uniquely |
| `eq-continuous-entropic-density-law` | 1138, 1322 | `OT4ML/sections/sinkhorn.tex:1205` | resolved uniquely |
| `eq-continuous-epsilon-sinkhorn-pde` | 1660, 1664, 1698, 1712, 1732, 1753 | `OT4ML/sections/sinkhorn-advanced.tex:1648` | resolved uniquely |
| `eq-convlin-sinkh` | 870 | `OT4ML/sections/sinkhorn-advanced.tex:840` | resolved uniquely |
| `eq-convlin-sinkh-prim` | 893, 973 | `OT4ML/sections/sinkhorn-advanced.tex:859` | resolved uniquely |
| `eq-convsinkh-control` | 890, 981 | `OT4ML/sections/sinkhorn-advanced.tex:850` | resolved uniquely |
| `eq-discrete-soft-c-transforms` | 527 | `OT4ML/sections/sinkhorn.tex:1102` | resolved uniquely |
| `eq-dual-sinkhorn-objective` | 519, 575, 618, 1086, 1138, 1310 | `OT4ML/sections/sinkhorn.tex:1190` | resolved uniquely |
| `eq-entropic-generic` | 1059, 1446 | `OT4ML/sections/sinkhorn.tex:636` | resolved uniquely |
| `eq-entropic-semidual-derivatives` | 1390 | `OT4ML/sections/sinkhorn-advanced.tex:1359` | resolved uniquely |
| `eq-entropic-semidual-hessian` | 1400 | `OT4ML/sections/sinkhorn-advanced.tex:1372` | resolved uniquely |
| `eq-entropy-pd` | 946 | `OT4ML/sections/sinkhorn.tex:1042` | resolved uniquely |
| `eq-generalized-soft-c-alternate-maximization` | 350, 410 | `OT4ML/sections/sinkhorn.tex:2165` | resolved uniquely |
| `eq-hilbert-metric` | 1193 | `OT4ML/sections/sinkhorn-advanced.tex:674` | resolved uniquely |
| `eq-kl-proj` | 287 | `OT4ML/sections/sinkhorn-advanced.tex:132` | resolved uniquely |
| `eq-kl-sinkh-proj` | 287, 838 | `OT4ML/sections/sinkhorn-advanced.tex:251` | resolved uniquely |
| `eq-legendre` | 410, 442 | `OT4ML/sections/dual-norms.tex:656` | resolved uniquely |
| `eq-phi-soft-c-transform` | 410, 422, 442 | `OT4ML/sections/sinkhorn.tex:2120` | resolved uniquely |
| `eq-quadratic-regularized-density-laws` | 350 | `OT4ML/sections/sinkhorn.tex:2176` | resolved uniquely |
| `eq-regularized-discr` | 129, 866, 1069 | `OT4ML/sections/sinkhorn.tex:51` | resolved uniquely |
| `eq-regularized-discr-rescaled` | 631 | `OT4ML/sections/sinkhorn.tex:479` | resolved uniquely |
| `eq-semi-dual` | 1310 | `OT4ML/sections/semidiscr-w1.tex:39` | resolved uniquely |
| `eq-sinkhorn` | 289, 298, 838 | `OT4ML/sections/sinkhorn.tex:229` | resolved uniquely |
| `eq-sinkhorn-block-overrelaxation` | 1244 | `OT4ML/sections/sinkhorn-advanced.tex:1236` | resolved uniquely |
| `eq-sinkhorn-conditional-variance-gap` | 1225 | `OT4ML/sections/sinkhorn-advanced.tex:1166` | resolved uniquely |
| `eq-sinkhorn-divergence` | 1526, 1550 | `OT4ML/sections/sinkhorn.tex:2311` | resolved uniquely |
| `eq-sinkhorn-dual-hessian-form` | 1138 | `OT4ML/sections/sinkhorn-advanced.tex:1090` | resolved uniquely |
| `eq-sinkhorn-dual-hessian-operator` | 1138, 1400, 1406 | `OT4ML/sections/sinkhorn-advanced.tex:1099` | resolved uniquely |
| `eq-sinkhorn-gap-residual` | 575, 603 | `OT4ML/sections/sinkhorn-advanced.tex:565` | resolved uniquely |
| `eq-sinkhorn-local-error` | 1134, 1157 | `OT4ML/sections/sinkhorn-advanced.tex:1122` | resolved uniquely |
| `eq-sinkhorn-maximal-correlation` | 1144, 1155 | `OT4ML/sections/sinkhorn-advanced.tex:1049` | resolved uniquely |
| `eq-sinkhorn-optimal-overrelaxation` | 1273, 1277, 1302 | `OT4ML/sections/sinkhorn-advanced.tex:1245` | resolved uniquely |
| `eq-sinkhorn-soft-transform-jacobians` | 1157, 1261 | `OT4ML/sections/sinkhorn-advanced.tex:1113` | resolved uniquely |
| `eq-soft-c-cont-f` | 1112 | `OT4ML/sections/sinkhorn.tex:1266` | resolved uniquely |
| `eq-soft-c-cont-g` | 1112, 1310 | `OT4ML/sections/sinkhorn.tex:1273` | resolved uniquely |
| `fig:sinkhorn-birkhoff-simplex-contraction` | 922, 931, 936 | `OT4ML/sections/sinkhorn-advanced.tex:823` | resolved uniquely |
| `fig:sinkhorn-continuous-epsilon-flow` | 1743 | `OT4ML/sections/sinkhorn-advanced.tex:1756` | resolved uniquely |
| `fig:sinkhorn-overrelaxation` | 1297 | `OT4ML/sections/sinkhorn-advanced.tex:1303` | resolved uniquely |
| `fig:sinkhorn-projective-scaling-simplex` | 931 | `OT4ML/sections/sinkhorn-advanced.tex:937` | resolved uniquely |
| `prop-auction-epsilon-scaling` | 646 | `OT4ML/sections/semidiscr-w1.tex:362` | resolved uniquely |
| `prop-continuous-entropic-duality` | 1089 | `OT4ML/sections/sinkhorn.tex:1180` | resolved uniquely |
| `prop-cyclic-kl-affine` | 287, 324 | `OT4ML/sections/sinkhorn-advanced.tex:167` | resolved uniquely |
| `prop-entropic-dual-potentials` | 1086 | `OT4ML/sections/sinkhorn.tex:1280` | resolved uniquely |
| `prop-gaussian-sinkhorn-1d-rate` | 1229 | `OT4ML/sections/sinkhorn-advanced.tex:1564` | resolved uniquely |
| `prop-gaussian-sinkhorn-closed-form` | 1550 | `OT4ML/sections/sinkhorn-advanced.tex:1443` | resolved uniquely |
| `prop-gaussian-w2-bures` | 1413, 1545 | `OT4ML/sections/monge.tex:1935` | resolved uniquely |
| `prop-hungarian-correct` | 646 | `OT4ML/sections/matching.tex:594` | resolved uniquely |
| `prop-phi-double-soft-transform-monotone` | 459 | `OT4ML/sections/sinkhorn-advanced.tex:418` | resolved uniquely |
| `prop-sinkhorn-dual-rate` | 621, 639 | `OT4ML/sections/sinkhorn-advanced.tex:507` | resolved uniquely |
| `prop-sinkhorn-local-rate` | 1203, 1244, 1257, 1406 | `OT4ML/sections/sinkhorn-advanced.tex:1088` | resolved uniquely |
| `prop-topical-variation-nonexpansive` | 405, 444 | `OT4ML/sections/sinkhorn-advanced.tex:382` | resolved uniquely |
| `sec-kantorovich-lp-algorithms` | 646 | `OT4ML/sections/kantorovich.tex:774` | resolved uniquely |
| `sec-sinkhorn-hilbert` | 287, 448, 498, 1015 | `OT4ML/sections/sinkhorn-advanced.tex:660` | resolved uniquely |
| `sec-sinkhorn-other-regularizers` | 350, 357, 410 | `OT4ML/sections/sinkhorn.tex:1837` | resolved uniquely |
| `sec-statistical-ot` | 13 | `OT4ML/sections/statistical-ot.tex:7` | resolved uniquely |
| `sec-wasserstein-flows-mlp` | 1355 | `OT4ML/sections/wasserstein-gradient-flows.tex:2397` | resolved uniquely |
| `thm-birkhoff` | 774, 833, 870, 973, 1179, 1187 | `OT4ML/sections/sinkhorn-advanced.tex:698` | resolved uniquely |
| `thm-pinsker` | 575 | `OT4ML/sections/dual-norms.tex:508` | resolved uniquely |
| `thm-sinkhorn-hilbert-linear` | 922, 1001, 1179, 1187, 1291, 1627 | `OT4ML/sections/sinkhorn-advanced.tex:837` | resolved uniquely |

### Citation-key inventory

| Key | Source lines | Bibliography | Audit verdict |
|---|---|---|---|
| `2015-benamou-cisc` | 336 | 1 entry | materially pertinent; metadata/source checked |
| `2016-Cuturi-siims` | 1348 | 1 entry | materially pertinent; metadata/source checked |
| `BregmanCensorReich1999Dykstra` | 336 | 1 entry | materially pertinent; metadata/source checked |
| `CensorReich-Dykstra` | 336 | 1 entry | materially pertinent; metadata/source checked |
| `Dykstra85` | 336 | 1 entry | materially pertinent; metadata/source checked |
| `GalichonJacquet2024Substitutability` | 487 | 1 entry | materially pertinent; metadata/source checked |
| `GalichonSamuelsonVernet2022Monotone` | 487 | 1 entry | materially pertinent; metadata/source checked |
| `Ruschendorf95` | 287 | 1 entry | materially pertinent; metadata/source checked |
| `RuschendorfThomsen` | 287 | 1 entry | materially pertinent; metadata/source checked |
| `altschuler2017near` | 498 | 1 entry | pertinent context; not the source of the exact Chapter 9 constant |
| `bauschke-lewis` | 336 | 1 entry | materially pertinent; metadata/source checked |
| `berman2017sinkhorn` | 1715 | 1 entry | materially pertinent; metadata/source checked |
| `birkhoff1957extensions` | 694 | 1 entry | primary source valid; surrounding historical sentence needs `C9-MIN-02` |
| `blondel2018smooth` | 334 | 1 entry | materially pertinent; metadata/source checked |
| `bregman1967relaxation` | 165 | 1 entry | materially pertinent; metadata/source checked |
| `chizat2024sharper` | 1001, 1229, 1627 | 1 entry | materially pertinent; metadata/source checked |
| `cuturi2018semidual` | 1348 | 1 entry | materially pertinent; metadata/source checked |
| `essid2019fortet` | 453 | 1 entry | materially pertinent; metadata/source checked |
| `fortet1940schrodinger` | 453 | 1 entry | materially pertinent; metadata/source checked |
| `franklin1989scaling` | 669, 833 | 1 entry | materially pertinent; metadata/source checked |
| `genevay2016stochastic` | 1348 | 1 entry | materially pertinent; metadata/source checked |
| `golub1973variableprojection` | 1320, 1406 | 1 entry | materially pertinent; metadata/source checked |
| `golub2003variableprojection` | 1320, 1406 | 1 entry | materially pertinent; metadata/source checked |
| `janati2020gaussian` | 1413 | 1 entry | materially pertinent; metadata/source checked |
| `kim2008variableprojection` | 1355 | 1 entry | materially pertinent; metadata/source checked |
| `knight2008sinkhorn` | 1163 | 1 entry | materially pertinent; metadata/source checked |
| `lehmann2022overrelaxation` | 1163, 1235, 1291, 1295 | 1 entry | materially pertinent; metadata/source checked |
| `lemmens2012nonlinear` | 405 | 1 entry | materially pertinent; metadata/source checked |
| `leonard2019fortet` | 453 | 1 entry | materially pertinent; metadata/source checked |
| `nocedal` | 1348 | 1 entry | pertinent context; not the source of the exact Chapter 9 constant |
| `peyre2026robust` | 498 | 1 entry | materially pertinent; metadata/source checked |
| `pmlr-v80-dvurechensky18a` | 498 | 1 entry | pertinent context; not the source of the exact Chapter 9 constant |
| `samelson1957perron` | 694 | 1 entry | primary source valid; surrounding historical sentence needs `C9-MIN-02` |
| `thibault2021overrelaxed` | 1235, 1295 | 1 entry | materially pertinent; metadata/source checked |

### Figure and asset inclusion inventory

| Source line | Figure label | Included path | Exists |
|---:|---|---|---|
| 821 | `fig:sinkhorn-birkhoff-simplex-contraction` | `figures/sinkhorn-birkhoff-simplex-contraction/simplex-contraction.pdf` | yes |
| 935 | `fig:sinkhorn-projective-scaling-simplex` | `figures/sinkhorn-projective-scaling-simplex/scaling-contraction.pdf` | yes |
| 1301 | `fig:sinkhorn-overrelaxation` | `figures/sinkhorn-overrelaxation/overview.pdf` | yes |
| 1749 | `fig:sinkhorn-continuous-epsilon-flow` | `figures/sinkhorn-continuous-epsilon-flow/unimodal.pdf` | yes |
| 1750 | `fig:sinkhorn-continuous-epsilon-flow` | `figures/sinkhorn-continuous-epsilon-flow/multimodal.pdf` | yes |

### Complete physical-block and paragraph ledger

| ID | Lines | Class | Opening/content capsule |
|---|---:|---|---|
| B001 | 1--1 | separator/comment | % !TEX root = ../OT4ML.tex |
| B002 | 3--11 | heading/structural | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%... |
| B003 | 13--17 | narrative/source | This chapter focuses on algorithmic convergence for entropic optimal transport: the marginals and the temperature are... |
| B004 | 19--22 | narrative/source | The chapter revisits Sinkhorn convergence through several complementary lenses. Bregman projections explain the alter... |
| B005 | 24--26 | heading/structural | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \section{Sinkhorn Convergence: Bregman Po... |
| B006 | 28--34 | narrative/source | This section explains Sinkhorn as alternating Bregman projections. The main message is geometric: each row or column ... |
| B007 | 36--36 | narrative/source | For simplicity, this section is written for discrete measures, but the same ideas carry over to general measures. The... |
| B008 | 38--39 | heading/structural | \paragraph{Alternating $\KL$ projections.} strictindex |
| B009 | 41--44 | narrative/source | The projection viewpoint explains Sinkhorn as repeated enforcement of one marginal constraint at a time. It is not sp... |
| B010 | 46--46 | narrative/source | The following matrix construction is the finite-dimensional counterpart of the measure-valued Definition~\ref{def-mea... |
| B011 | 48--56 | statement | \begin{defn}[Bregman divergence] strictindex Let $\Omega\subset\RR^{n\times m}$ be convex with nonempty interior, and... |
| B012 | 58--60 | narrative/source | For the quadratic generator $\Phi(\P)=\frac12\norm{\P}_{\mathrm F}^2$ on $\RR^{n\times m}$, one recovers half the squ... |
| B013 | 62--71 | statement | The corresponding projection is the basic operation in alternating Bregman methods. \begin{defn}[Bregman projection] ... |
| B014 | 73--76 | narrative/source | Bregman divergences are useful because their geometry can encode constraints. A Legendre-type generator $\Phi$ blows ... |
| B015 | 78--80 | heading/structural | \paragraph{Linear tilts and Gibbs references.} strictindex strictindex |
| B016 | 82--82 | narrative/source | The next proposition explains why adding a linear cost to a Bregman penalty merely shifts the reference point in dual... |
| B017 | 84--109 | proof | \begin{prop}[Linear tilts of Bregman penalties] strictindex Let $\Phi$ be differentiable and strictly convex, and let... |
| B018 | 111--127 | narrative/source | For the negative entropy $\Phi(\P)=\sum_{i,j}\P_{i,j}\log\P_{i,j}$, one has $B_\Phi=\KLD$. Taking $\Q=\a\otimes\b$ gi... |
| B019 | 129--134 | narrative/source | Thus the unique solution $\P_\epsilon$ of~\eqref{eq-regularized-discr} is the KL projection of the tilted Gibbs refer... |
| B020 | 136--137 | heading/structural | \paragraph{Cyclic projection convergence.} strictindex |
| B021 | 139--139 | narrative/source | Given two closed convex constraint sets $\Cc_1$ and $\Cc_2$, the cyclic method projects first onto $\Cc_1$, then onto... |
| B022 | 141--141 | narrative/source | Algorithm~\ref{alg:cyclic-bregman-projections} records the general iteration, with a stopping rule based on nonnegati... |
| B023 | 143--145 | algorithm | \begin{algH}[Cyclic Bregman projections] strictindex \textbf{Input:} Closed convex sets $\Cc_1,\Cc_2$, Bregman diverg... |
| B024 | 147--147 | narrative/source | \textbf{Output:} Approximate point in $\Cc_1\cap\Cc_2$ when the intersection is nonempty. |
| B025 | 149--149 | narrative/source | \textbf{Initialize:} Set $r^{(0)}=+\infty$ and $\ell=0$. |
| B026 | 151--152 | algorithm | \textbf{While} $r^{(\ell)}>\mathrm{tol}$ and $\ell<L$ \textbf{do}: \begin{algblock} |
| B027 | 154--154 | narrative/source | \textbf{Set} $\ell\leftarrow \ell+1$. |
| B028 | 156--157 | narrative/source | $\P^{(\ell-1/2)}=\Proj_{\Cc_1}^{B_\Phi}(\P^{(\ell-1)})$ and $\P^{(\ell)}=\Proj_{\Cc_2}^{B_\Phi}(\P^{(\ell-1/2)})$. |
| B029 | 159--163 | narrative/source | \textbf{Set} $r^{(\ell)}=\max\{\mathrm{def}_{\Cc_1}(\P^{(\ell)}),\mathrm{def}_{\Cc_2}(\P^{(\ell)})\}$. \end{algblock}... |
| B030 | 165--165 | narrative/source | The convergence mechanism is the classical one of Bregman~\cite{bregman1967relaxation}. General convex constraints de... |
| B031 | 167--170 | statement | \begin{prop}[Convergence of cyclic Bregman projections] strictindex strictindex Let $\Phi$ be a Legendre generator on... |
| B032 | 172--205 | proof | If, in addition, $\Cc_1$ and $\Cc_2$ are affine, then \[ \bar\P = \Proj_{\Cc_1\cap\Cc_2}^{B_\Phi}(\P^{(0)}). \] stric... |
| B033 | 207--214 | narrative/source | Let $(Z^{(r)})_r$ be the half-step sequence, so that $Z^{(2\ell)}=\P^{(\ell)}$ and $Z^{(2\ell+1)}=\P^{(\ell+1/2)}$. F... |
| B034 | 216--230 | narrative/source | Suppose now that $\Cc_1$ and $\Cc_2$ are affine. The first-order inequality above is then an equality because both si... |
| B035 | 232--234 | heading/structural | \paragraph{Row and column scalings.} strictindex strictindex |
| B036 | 236--236 | narrative/source | We now apply the preceding Bregman-projection framework to entropic OT\@. The two affine constraints impose the sourc... |
| B037 | 238--261 | narrative/source | Denote the two affine marginal sets by \eq{ \Cc^1_\a \eqdef \enscond{\P\in\RR^{n\times m}}{\P\ones_m=\a} \qandq \Cc^2... |
| B038 | 263--263 | narrative/source | These two KL projectors are explicit: they rescale respectively the rows and the columns. |
| B039 | 265--285 | proof | \begin{prop}[KL projections are scalings] strictindex One has \eq{ \Proj_{\Cc^1_\a}^{\KLD}(\P) = \diag\pa{\frac{\a}{\... |
| B040 | 287--287 | narrative/source | For positive histograms and a strictly positive Gibbs kernel, the classical iterative-proportional-fitting theorem en... |
| B041 | 289--300 | narrative/source | These iterations are equivalent to Sinkhorn iterations~\eqref{eq-sinkhorn} since defining strictindex \eq{ \P^{(2\ell... |
| B042 | 302--306 | narrative/source | Such a convergence analysis using Bregman projection is of limited interest because it only works directly in finite ... |
| B043 | 308--312 | heading/structural | \paragraph{Other divergences.} strictindex strictindex strictindex strictindex |
| B044 | 314--324 | narrative/source | The simplicity of the KL construction relies on negative entropy encoding nonnegativity through its effective domain.... |
| B045 | 326--334 | narrative/source | The Euclidean generator $\Phi(\P)=\frac12\norm{\P}_{\mathrm F}^2$ illustrates both the additional difficulty and the ... |
| B046 | 336--336 | narrative/source | To recover the closest-point projection onto the intersection, one uses Dykstra's algorithm: it alternates the same B... |
| B047 | 338--350 | narrative/source | For the quadratic generator and the product reference $\xi=\a\otimes\b$, the Bregman penalty is \[ B_\Phi(\P\|\xi) = ... |
| B048 | 352--355 | heading/structural | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \section{Sinkhorn Convergence: Monotone P... |
| B049 | 357--357 | narrative/source | This section isolates the order structure shared by generalized Sinkhorn updates. It first introduces the abstract la... |
| B050 | 359--360 | heading/structural | \paragraph{Variation seminorm and topical maps.} Potentials are defined only up to additive constants, so their natur... |
| B051 | 362--369 | statement | \begin{defn}[Variation seminorm] strictindex For a bounded real-valued function $h$, its variation seminorm is \[ \no... |
| B052 | 371--380 | statement | The order maps relevant to Sinkhorn commute with this additive gauge. \begin{defn}[Topical map] Let $E$ be an ordered... |
| B053 | 382--392 | statement | \begin{prop}[Topical maps are variation-nonexpansive] strictindex strictindex Let $E$ be a vector space of bounded re... |
| B054 | 394--400 | proof | \begin{proof} Set $a=\inf(f-g)$ and $b=\sup(f-g)$, so that $g+a\leq f\leq g+b$. If $\mathcal T$ is topical, then \[ \... |
| B055 | 402--407 | statement | \begin{rem}[Topical maps and projective geometry] strictindex strictindex Order-preserving additively homogeneous map... |
| B056 | 409--416 | heading/structural | \paragraph{Generalized Sinkhorn maps.} Consider the $\phi$-divergence regularized transport problem of Section~\ref{s... |
| B057 | 418--439 | statement | \begin{prop}[Generalized Sinkhorn maps are topical] strictindex strictindex strictindex Assume that the scalar minimi... |
| B058 | 441--442 | proof | \begin{proof} Since $\phi$ is extended by $+\infty$ on $(-\infty,0)$, its Legendre transform $\phi^*$ from~\eqref{eq-... |
| B059 | 444--446 | narrative/source | Let $I=\argmin H_g^x$ and $I'=\argmin H_{g'}^x$. If $a=\min I$ and $a'=\min I'$ satisfied $a'>a$, the optimality ineq... |
| B060 | 448--450 | narrative/source | Topicality gives nonexpansiveness, not a strict contraction. For KL, positivity of the Gibbs kernel supplies the stro... |
| B061 | 452--455 | heading/structural | \paragraph{Monotone convergence for generalized Sinkhorn.} The following order argument traces back to Fortet's proof... |
| B062 | 457--459 | statement | \begin{prop}[Monotone convergence of generalized Sinkhorn cycles] strictindex Let $\Xx$ and $\Yy$ be compact metric s... |
| B063 | 461--462 | narrative/source | If $f^{(0)}\in\Cc(\Xx)$ is a subsolution, $f^{(0)}\leq\mathcal A_\phi(f^{(0)})$, then the iterates $f^{(\ell+1)}=\mat... |
| B064 | 464--469 | proof | \begin{proof} Because $\mathcal A_\phi$ is additively homogeneous, shifting a subsolution preserves the subsolution i... |
| B065 | 471--478 | narrative/source | The one-sided transforms inherit the modulus of continuity of the cost. Indeed, if \(\delta(x,x')\eqdef\sup_{y\in\Yy}... |
| B066 | 480--481 | narrative/source | Moreover, every selected one-sided transform is nonexpansive for the uniform norm. If $\norm{g-h}_\infty\leq r$, then... |
| B067 | 483--484 | narrative/source | The subsolution and supersolution conditions are invariant under additive shifts, but an additive shift cannot turn a... |
| B068 | 486--490 | statement | \begin{rem}[Beyond variational transport] The preceding monotone argument uses order, additive homogeneity and barrie... |
| B069 | 493--496 | heading/structural | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \section{Sinkhorn Convergence: Sublinear ... |
| B070 | 498--505 | narrative/source | The preceding projection and monotonicity arguments establish convergence but do not provide a quantitative rate. Sec... |
| B071 | 507--524 | statement | \begin{prop}[Robust $O(1/\ell)$ dual rate for discrete Sinkhorn] strictindex Let $\a\in\simplex_n$ and $\b\in\simplex... |
| B072 | 526--540 | proof | \begin{proof} Write $M\eqdef\norm{\C}_\infty$; the case $M=0$ is immediate because one complete cycle produces $\a\ot... |
| B073 | 542--567 | narrative/source | Associate with any potentials the nonnegative matrix strictindex strictindex \[ \P(\fD,\gD) \eqdef (\a\otimes\b) \odo... |
| B074 | 569--586 | narrative/source | We next compute the ascent of one complete cycle. Its row update satisfies \[ \fD_i^{(\ell+1)}-\fD_i^{(\ell)} = \epsi... |
| B075 | 588--603 | narrative/source | It remains to initialize this recursion uniformly in $\epsilon$. Set $x=M/\epsilon$, and let $\widehat\P^{(1)}$ be th... |
| B076 | 605--614 | narrative/source | Finally, whenever $\Delta^{(\ell+1)}>0$, \[ \frac1{\Delta^{(\ell+1)}}-\frac1{\Delta^{(\ell)}} = \frac{\Delta^{(\ell)}... |
| B077 | 616--616 | narrative/source | The assumption $\C\geq0$ is harmless for transport costs. For a signed matrix, subtracting $\min_{i,j}\C_{i,j}$ leave... |
| B078 | 618--618 | narrative/source | The preceding rate becomes useful when Sinkhorn serves as an approximate solver for exact OT\@. With the KL-normalize... |
| B079 | 620--640 | proof | \begin{cor}[Approximating unregularized OT by regularized dual costs] Under the assumptions of Proposition~\ref{prop-... |
| B080 | 642--650 | narrative/source | For dense $n\times n$ problems, one Sinkhorn cycle costs $O(n^2)$ operations. Corollary~\ref{cor-sinkhorn-dual-comple... |
| B081 | 653--653 | separator/comment | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% |
| B082 | 655--660 | heading/structural | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \section{Sinkhorn Convergence: Linear Hil... |
| B083 | 662--665 | narrative/source | Hilbert's projective metric gives a complementary convergence mechanism. Instead of following objective values, it me... |
| B084 | 667--669 | heading/structural | \paragraph{Projective contraction.} strictindex As initially explained by~\cite{franklin1989scaling}, the global conv... |
| B085 | 671--681 | statement | \begin{defn}[Hilbert metric] strictindex On $\RR_{+,*}^n$, Hilbert's projective metric is \eql{ \foralls (\uD,\uD') \... |
| B086 | 683--695 | proof | \begin{prop}[Hilbert metric on the projective cone] strictindex strictindex The function $\Hilbert$ defines a complet... |
| B087 | 698--733 | proof | \begin{thm}[Birkhoff contraction theorem] strictindex Let $\K \in \RR_{+,*}^{n \times m}$. Then, for $(\vD,\vD') \in ... |
| B088 | 735--761 | narrative/source | It remains to control this row-wise total variation. Fix rows $p,q$ of $\mathsf P(z)$, with indices $i,j$, and put $r... |
| B089 | 763--772 | narrative/source | For $z_t=(1-t)z'+tz$, the fundamental theorem of calculus and the triangle inequality for $\norm{\cdot}_V$ now give \... |
| B090 | 774--817 | narrative/source | Before returning to Sinkhorn, consider the linear power iteration behind the Perron--Frobenius theorem. For a positiv... |
| B091 | 819--826 | figure | \begin{figure}[H] \centering \includegraphics[width=.98\linewidth]{figures/sinkhorn-birkhoff-simplex-contraction/simp... |
| B092 | 828--829 | narrative/source | The same theorem holds for positive linear maps between proper cones. Order-preserving homogeneous nonlinear maps adm... |
| B093 | 831--831 | heading/structural | \paragraph{Sinkhorn contraction.} |
| B094 | 833--835 | narrative/source | Each Sinkhorn half-step composes multiplication by a positive kernel, which contracts Hilbert's metric by Theorem~\re... |
| B095 | 837--867 | statement | \begin{thm}[Projective linear convergence of Sinkhorn] Starting from $\vD^{(0)}>0$, use the scaling iterates of~\eqre... |
| B096 | 869--870 | proof | \begin{proof} Entrywise multiplication by a fixed positive vector and entrywise inversion are isometries of Hilbert's... |
| B097 | 872--890 | narrative/source | For any contraction $F$ with factor $q<1$ and fixed point $x^\star$, the triangle inequality gives \[ d(x,x^\star) \l... |
| B098 | 892--894 | narrative/source | Finally, write $\xi_i=\log(u_i^{(\ell)}/u_i^\star)$ and $\zeta_j=\log(v_j^{(\ell)}/v_j^\star)$. Then $\log(\P_{i,j}^{... |
| B099 | 896--931 | heading/structural | \paragraph{Nonlinear Sinkhorn images of the simplex.} The preceding contraction can be visualized simultaneously for ... |
| B100 | 933--940 | figure | \begin{figure}[H] \centering \includegraphics[width=.98\linewidth]{figures/sinkhorn-projective-scaling-simplex/scalin... |
| B101 | 942--944 | heading/structural | \paragraph{Dual-potential form of the contraction.} strictindex strictindex |
| B102 | 946--995 | narrative/source | By~\eqref{eq-entropy-pd}, the KL-normalized potentials satisfy \( \fD^{(\ell)}=\epsilon\log(\uD^{(\ell)}\oslash\a) \)... |
| B103 | 999--1007 | narrative/source | The marginal violations $\norm{\P^{(\ell)}\ones_m-\a}_1$ and $\norm{(\P^{(\ell+1/2)})^\top\ones_n-\b}_1$ remain usefu... |
| B104 | 1009--1013 | heading/structural | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \section{Local Convergence Analysis and A... |
| B105 | 1015--1015 | narrative/source | The projective analysis of Section~\ref{sec-sinkhorn-hilbert} gives an initialization-independent global rate from th... |
| B106 | 1017--1019 | heading/structural | \paragraph{Conditional operator and maximal correlation.} strictindex strictindex |
| B107 | 1021--1025 | narrative/source | The local geometry is intrinsic to the coupling and does not depend on whether it is parameterized by potentials or s... |
| B108 | 1027--1067 | statement | \begin{defn}[Conditional coupling operator] strictindex For a coupling $\pi\in\Couplings(\al,\be)$, let \( \pi(\d x,\... |
| B109 | 1069--1080 | narrative/source | The notation $T_\pi^*$ is literal: the two operators are adjoint for the $L^2(\al)$ and $L^2(\be)$ inner products. Co... |
| B110 | 1082--1084 | heading/structural | \paragraph{Dual Hessian and exact local rate.} strictindex strictindex |
| B111 | 1086--1086 | narrative/source | Recall that $\Dd_\epsilon$ is the continuous dual objective~\eqref{eq-dual-sinkhorn-objective}, its optimizers $(f_\e... |
| B112 | 1088--1110 | statement | \begin{prop}[Dual Hessian and local Sinkhorn rate] Assume the setting of Proposition~\ref{prop-continuous-entropic-du... |
| B113 | 1112--1135 | narrative/source | The derivatives of the two soft-transform updates~\eqref{eq-soft-c-cont-f}--\eqref{eq-soft-c-cont-g} at the optimum a... |
| B114 | 1137--1138 | proof | \begin{proof} Twice differentiating the exponential term in~\eqref{eq-dual-sinkhorn-objective} gives~\eqref{eq-sinkho... |
| B115 | 1140--1155 | narrative/source | Each quotient class has a unique representative orthogonal to the gauge direction, hence of the form \( (h_0+m,k_0+m)... |
| B116 | 1157--1161 | narrative/source | Differentiating either log-partition formula in Definition~\ref{def-continuous-soft-c-transform} produces minus the c... |
| B117 | 1163--1163 | narrative/source | In finite spaces, this recovers the second-singular-value description of the asymptotic matrix-scaling rate~\cite{kni... |
| B118 | 1165--1174 | narrative/source | The same spectral gap has a direct probabilistic interpretation. The law of total variance gives \eql{ 1-\sigma_\epsi... |
| B119 | 1176--1176 | narrative/source | The global projective contraction must dominate every infinitesimal contraction at its fixed point. The next proposit... |
| B120 | 1178--1221 | proof | \begin{prop}[The global Hilbert factor controls the local rate] In the discrete positive-kernel setting of Theorem~\r... |
| B121 | 1223--1223 | narrative/source | The same argument applies when the Gibbs kernel is continuous and strictly positive on compact marginal supports: the... |
| B122 | 1225--1229 | narrative/source | The proposition makes the relation with the preceding section precise: maximal correlation is the sharp local quantit... |
| B123 | 1231--1233 | heading/structural | \paragraph{Blockwise over-relaxation.} strictindex strictindex |
| B124 | 1235--1241 | narrative/source | Sinkhorn performs exact maximization in one dual block after the other. A minimal acceleration extrapolates each bloc... |
| B125 | 1243--1258 | statement | \begin{prop}[Optimal local block relaxation] Assume the hypotheses of Proposition~\ref{prop-sinkhorn-local-rate} and ... |
| B126 | 1260--1275 | proof | \begin{proof} Use~\eqref{eq-sinkhorn-soft-transform-jacobians}. The polar decomposition of $T_\epsilon$ and the spect... |
| B127 | 1277--1295 | narrative/source | Set $\delta_\epsilon=1-\sigma_\epsilon^2$. When $\delta_\epsilon$ is small, the exact expression in~\eqref{eq-sinkhor... |
| B128 | 1297--1297 | narrative/source | Figure~\ref{fig:sinkhorn-overrelaxation} compares this local prediction with nonlinear iterations. A common ordinary-... |
| B129 | 1299--1304 | figure | \begin{figure}[H] \centering \includegraphics[width=.99\linewidth]{figures/sinkhorn-overrelaxation/overview.pdf} \cap... |
| B130 | 1306--1308 | heading/structural | \paragraph{Entropic semi-dual and variable projection.} strictindex strictindex |
| B131 | 1310--1320 | narrative/source | The hard semi-dual \(\Ee_0\) in~\eqref{eq-semi-dual} eliminates one potential from the full dual \(\Dd_0\). At positi... |
| B132 | 1322--1326 | narrative/source | For a potential $g$, let $\pi_g$ be the Gibbs measure obtained from the density law~\eqref{eq-continuous-entropic-den... |
| B133 | 1328--1349 | statement | \begin{rem}[Sinkhorn as an approximate semi-dual gradient ascent] Write $r_g\eqdef\d\be_g/\d\be$. Combining the two s... |
| B134 | 1351--1355 | narrative/source | VarPro was introduced for separable nonlinear least-squares problems. A representative application is training a two-... |
| B135 | 1357--1387 | statement | \begin{prop}[Semi-dual curvature and conditioning] For bounded directions $k,k'$, \eql{ D\Ee_\epsilon(g)[k] = \int_\Y... |
| B136 | 1389--1404 | proof | \begin{proof} The envelope theorem gives the first derivative in~\eqref{eq-entropic-semidual-derivatives}. Differenti... |
| B137 | 1406--1406 | narrative/source | Variable projection cannot worsen local spectral conditioning~\cite{golub1973variableprojection,golub2003variableproj... |
| B138 | 1408--1411 | heading/structural | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \section{Entropic Optimal Transport betwe... |
| B139 | 1413--1417 | narrative/source | Gaussian marginals provide an explicit finite-dimensional model of Sinkhorn's behavior. The soft $c$-transform preser... |
| B140 | 1419--1419 | narrative/source | Gaussian log densities are quadratic, and integrating the exponential of a quadratic against a Gaussian produces anot... |
| B141 | 1421--1435 | statement | \begin{prop}[Quadratic closure of Sinkhorn iterates] strictindex strictindex Let $\be=\Gaussian(\mean_\be,\cov_\be)$ ... |
| B142 | 1437--1439 | proof | \begin{proof} The exponent is the sum of a quadratic polynomial in $y$ and the logarithm of the Gaussian density of $... |
| B143 | 1441--1441 | narrative/source | Closure of the iterates suggests, but does not by itself prove, that the optimal coupling is Gaussian. Entropy maximi... |
| B144 | 1443--1472 | statement | \begin{prop}[Balanced entropic OT between Gaussians] strictindex strictindex Let $\al=\Gaussian(\mean_\al,\cov_\al)$ ... |
| B145 | 1474--1485 | proof | \begin{proof} Let $(X,Y)$ be any coupling with finite second moments and cross-covariance \(K=\EE\big[(X-\mean_\al)(Y... |
| B146 | 1487--1506 | narrative/source | Any such coupling has covariance \[ \begin{pmatrix} \cov_\al & K\\ K^\top & \cov_\be \end{pmatrix}. \] Write $K=\cov_... |
| B147 | 1508--1508 | narrative/source | Debiasing the preceding value cancels the marginal trace terms and leaves a smooth spectral deformation of the Bures ... |
| B148 | 1510--1547 | statement | \begin{cor}[Gaussian Sinkhorn divergence and smoothed Bures term] strictindex strictindex strictindex strictindex Let... |
| B149 | 1549--1560 | proof | \begin{proof} Proposition~\ref{prop-gaussian-sinkhorn-closed-form} writes the raw entropic value as the squared mean ... |
| B150 | 1562--1562 | narrative/source | The scalar centered case permits an exact non-asymptotic analysis along the invariant family of quadratic potentials.... |
| B151 | 1564--1601 | statement | \begin{prop}[One-dimensional Gaussian Sinkhorn rate] strictindex Consider $\al=\be=\Gaussian(0,1)$ on $\RR$ with $c(x... |
| B152 | 1603--1625 | proof | \begin{proof} Completing the square in $\int\exp((q y^2-(x-y)^2)/\epsilon)\d\Gaussian(0,1)(y)$ gives $\mathsf Q_\epsi... |
| B153 | 1627--1628 | narrative/source | Since $A_\star^{-4}=1-\epsilon+O(\epsilon^2)$, reducing the relative coefficient error $(q_\star-q^{(\ell)})/q_\star$... |
| B154 | 1631--1631 | separator/comment | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% |
| B155 | 1633--1636 | heading/structural | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \section{Continuous \texorpdfstring{$\var... |
| B156 | 1638--1638 | narrative/source | This section studies a joint small-temperature and many-iteration limit of Sinkhorn directly on a continuous domain. ... |
| B157 | 1640--1641 | heading/structural | \paragraph{Parabolic Monge--Amp\`ere limit.} strictindex |
| B158 | 1643--1643 | narrative/source | Take the quadratic torus cost $c(x,y)=d_{\TT^d}(x,y)^2/2$. In the zero-temperature limit, the soft transforms concent... |
| B159 | 1645--1658 | statement | \begin{defn}[Continuous \texorpdfstring{$\varepsilon$}{epsilon}-Sinkhorn flow] strictindex Let $\al$ and $\be$ be pro... |
| B160 | 1660--1660 | narrative/source | The stationary equation is exactly the Jacobian equation for optimal transport, which justifies the geometric form of... |
| B161 | 1662--1665 | statement | \begin{prop}[Stationary continuous Sinkhorn potentials] strictindex Assume that a smooth stationary solution of~\eqre... |
| B162 | 1667--1675 | proof | \begin{proof} At stationarity, the right-hand side before subtracting $\bar r_t$ is a constant $r$, hence \[ e^{-G(T(... |
| B163 | 1677--1679 | heading/structural | \paragraph{Rescaled continuous Sinkhorn iterates.} strictindex strictindex |
| B164 | 1681--1687 | narrative/source | Let $\mathsf S_\epsilon$ denote one complete continuous dual Sinkhorn cycle~\eqref{eq-continuous-dual-sinkhorn-iterat... |
| B165 | 1689--1699 | statement | \begin{prop}[Rescaled continuous Sinkhorn limit] Let $u_\epsilon^{(0)}=u_0$ be smooth and mean zero, generate \[ u_\e... |
| B166 | 1701--1713 | proof | \begin{proof} The Laplace expansion of the two soft transforms gives the first-order consistency formula \[ \mathsf S... |
| B167 | 1715--1715 | narrative/source | Berman proves a stronger convergence result in which this small-temperature, many-iteration limit is combined with a ... |
| B168 | 1717--1718 | heading/structural | \paragraph{One-dimensional Gaussian closure.} strictindex |
| B169 | 1720--1743 | narrative/source | In one dimension, the flow reads \[ \partial_tu_t(x) = \log\bigl(1+u_t''(x)\bigr) -G\bigl(x+u_t'(x)\bigr)+F(x)-\bar r... |
| B170 | 1745--1757 | figure | \begin{figure}[ht] \centering \setlength{\tabcolsep}{3pt} \begin{tabular}{@{}cc@{}} \includegraphics[width=.46\linewi... |

## Mechanical consistency audit

| Check | Result |
|---|---|
| Physical source lines read/accounted | 1757 |
| Physical source lines reread in second pass | 1757 |
| First-pass report input SHA-256 | `d231cd25cf5822e9ad77570517fae39dede3b220377193d96ed8902063306532` |
| Nonblank physical blocks inventoried | 170 |
| Blank separator lines | 175 |
| Chapters | 1 |
| Sections | 7 |
| Paragraph headings | 19 |
| Definitions | 7 |
| Propositions | 17 |
| Theorems | 2 |
| Corollaries | 2 |
| Remarks | 3 |
| Proof environments | 21 |
| Algorithms | 1 |
| Figure environments | 4 |
| Included figure assets | 5 |
| Display objects | 128 |
| Labels, macro-aware | 71 |
| Cross-reference occurrences / unique targets | 129 / 66 |
| Unresolved cross-reference targets | 0 |
| Multiply defined referenced targets | 0 |
| Citation commands / key occurrences / unique keys | 28 / 43 / 34 |
| Missing or duplicate cited bibliography keys | 0 |
| Index entries | 198 |
| Finding IDs | 7 unique |
| Validated-correct IDs | 22 unique |
| Severity arithmetic | `0 + 0 + 3 + 4 = 7` |
| Second-pass finding disposition | `7 retained = 4 refined + 3 unchanged; 0 removed; 0 added; 0 severity changes` |
| Placeholders intentionally left | 0 |
| Local included assets missing | 0 |
| Protected source hash after report construction read | `84cfeba54fee5c28aadc7c17cea4d559d191beddf7e527179832a4c337713278` |

### Finding-ID, severity, and second-pass ledger

| ID | Severity | Second-pass disposition |
|---|---|---|
| `C9-MOD-01` | Moderate | Retained, refined |
| `C9-MOD-02` | Moderate | Retained, unchanged in substance |
| `C9-MOD-03` | Moderate | Retained, refined |
| `C9-MIN-01` | Minor | Retained, refined |
| `C9-MIN-02` | Minor | Retained, unchanged in substance |
| `C9-MIN-03` | Minor | Retained, refined |
| `C9-MIN-04` | Minor | Retained, unchanged in substance |

## Source-preservation and write-scope attestation

- The chapter source was not edited during either pass and was rehashed after the second-pass report edit.
- No imported source, bibliography, notebook, script, figure, asset, build product, Git index, or other audit report was edited.
- The only intended changed path is `/Users/gpeyre/Dropbox/github/ot4ml/audit-chap9.md`.
- No file was staged.
- No commit was created or amended.
- No push occurred.
- Protected source at report construction: 1757 lines, 101,590 bytes, SHA-256 `84cfeba54fee5c28aadc7c17cea4d559d191beddf7e527179832a4c337713278`.
- The final report's external byte count, physical line count, and SHA-256 are reported in the delivery response after the file is closed. Embedding a file's own final SHA-256 inside that same file would change the digest; no self-referential placeholder is used.

## Final conclusion

The second adversarial pass leaves the chapter's central mathematics intact. Its robust, projective, local-spectral, Gaussian, and formal continuous-limit calculations are mutually consistent under their intended positive and regular settings. No Critical or Major defect was found. The three Moderate repairs are local but necessary: they make the projection layer honest on boundaries, restore a single unambiguous primal iteration index, and turn the continuous scaling-limit discussion into a mathematically meaningful statement. The four Minor repairs remove one proof misphrase, one historical error, one degenerate-dimensional undefined case, and one caption mismatch. After those changes, the audited claims listed in the validated-correct ledger require no mathematical alteration.
