# Independent Mathematical Audit: Chapter 12, Generalized OT Problems

## Audit status and source identity

- **Authoritative source:** `/Users/gpeyre/Dropbox/github/ot4ml/OT4ML/sections/generalized-ot-problems.tex`.
- **Protected baseline:** 2,414 physical lines, 164,370 bytes, SHA-256 `4d8bea5312cc6b48884864ebca042e23743ca337a5569ac5c854c779f1727ad5`.
- **Prior-report baseline:** `/Users/gpeyre/Dropbox/github/ot4ml/audit-chap12.md`, 774 lines, 92,946 bytes, SHA-256 `e8658f566bca7257ed02f729b623b0bccad4e83ee77e6e2e9b834effa6831751` before replacement.
- **Second-pass input baseline:** this report before refinement had 936 lines, 119,701 bytes, SHA-256 `540005cae83441a8c6c8ec3f7f26d63cd66c490da289f3f1de83b88d37f7d9ce`.
- **Audit mode:** read-only for the manuscript, imports, bibliography, notebooks, scripts, figures, and build evidence. Only this report was written.
- **Replica policy:** `arxiv/` and `myst/` copies were not treated as authoritative and were not used to override the protected TeX source.
- **Independence protocol:** I read all 2,414 source lines, reconstructed imported definitions, rederived the central mathematics, inspected every generator and included asset, checked the references and material primary literature, and froze an independent issue ledger before opening the prior report. Only then did I read all 774 lines of that report and test every inherited finding adversarially.
- **Second-pass protocol:** I reread the complete source and relevant imported contracts, treated CH12-001--CH12-011 as untrusted hypotheses, rechecked all retained notebook evidence, and returned to primary sources for every disputed theorem-scope question. The second pass did not rely on the first report's verdicts.
- **Status:** second adversarial audit closed, reconciled, and source-preserving.

## Correction implementation - 2026-08-26

The audit below is preserved as the pre-correction record. The read-only statements, source hashes, line counts and defect counts in that record describe the completed audit phase, not the workspace after this implementation pass. All ten retained findings CH12-001--CH12-010 have now been corrected. CH12-011 remains correctly rejected and required no source change.

| Issue | Resolution implemented | Verification |
|---|---|---|
| CH12-001 | Proposition `prop-quantile-barycenters` now assumes positive-weight inputs in $\mathcal P_2(\mathbb R)$, matching the book's $W_2$ domain. The sliced and Radon barycenter problems now use $\mathcal P_2$ explicitly, the directionwise family is required to be measurable, quantiles are evaluated on $(0,1)$, and endpoint representatives are declared irrelevant to the Lebesgue push-forward. | The finite-value domain is now sufficient for every displayed $W_2$ term, and the quantile average remains in $L^2(0,1)$ and nondecreasing. Full LaTeX build passed. |
| CH12-002 | The Radon discussion and Figure 12.3 caption now disclose the actual display pipeline: a $1.35$-pixel Gaussian after filtered back-projection, thresholding at the $42$nd percentile, then a display-only positive-value floor and $0.20$-pixel Gaussian. The first row is called a display-regularized version of the mathematical reconstruction rather than the exact $A_t$. | `sliced-radon-barycenter.ipynb` was rerun from a clean kernel with execution counts 1--8 and no error cells. Endpoint and intermediate masses are all $1$; `grid.pdf` was regenerated and visually inspected. |
| CH12-003 | The third Coulomb panel is relabeled from $\epsilon=0.50$ to the generator's actual value $\epsilon=2.00$. | The retained tensor solve reports errors $4.72\times10^{-10}$, $1.39\times10^{-10}$ and $2.32\times10^{-11}$ for $\epsilon=0.06,0.16,2.00$, respectively. The rendered label matches the generator. |
| CH12-004 | The MMOT paragraph now separates primal attainment, finite-entropy absolute continuity, additive dual-potential attainment and cyclic-scaling convergence. A Polish/lower-semicontinuous/proper regime is stated for the primal result; the Gibbs formula is conditional on dual attainment; finite positive discrete data are identified as the regime where Gibbs potentials and iterative proportional fitting are automatic. | The direct-method and strict-convexity arguments apply under the printed assumptions. The finite-dimensional convergence statement is linked to the earlier Sinkhorn analysis and appropriate IPFP references. |
| CH12-005 | The capacity solver now raises an error if its requested tolerance is not reached, uses the current $q=1,3,5$ source, targets the stricter tolerance $5\times10^{-8}$, and independently asserts row, column and cap feasibility at $6\times10^{-8}$. The capacity, Radon and four-shape barycenter notebooks were rerun from clean kernels, eliminating all stale core-cell execution gaps. | Capacity results are: $q=1$, 1,001 iterations, residual $2.75\times10^{-8}$; $q=3$, 176,101 iterations, residual $4.25\times10^{-8}$; $q=5$, 356,001 iterations, residual $5.00\times10^{-8}$. The four-shape barycenter has maximum Sinkhorn residual $5.00\times10^{-8}$. All revised notebooks have monotone execution counts and zero error outputs. |
| CH12-006 | Both discrete barycentric formulas now explicitly delete zero-mass source atoms before dividing by $a_i$. | Every displayed conditional law and row barycenter is now defined under the closed-simplex convention used elsewhere in the book. |
| CH12-007 | The martingale generator now removes source tail atoms below $10^{-6}$ before discretization, scales each martingale equality by its row mass, requests $10^{-9}$ primal and dual LP feasibility, and asserts the maximum conditional barycentric residual. | A clean run gives maximum conditional residual $2.22\times10^{-16}$, compared with $9.05\times10^{-2}$ in the stale run. The four martingale panels and thumbnail were regenerated and visually inspected. |
| CH12-008 | The Gaussian convex-order converse no longer tests an inadmissible quadratic directly. It uses convex at-most-linear truncations that increase monotonically to each directional quadratic, then applies monotone convergence. | The proof now derives $u^\top\Sigma_0u\leq u^\top\Sigma_1u$ within the exact test-function class of Definition `def-convex-order`. |
| CH12-009 | The bilinear derivative example now assumes $\alpha,\beta\in\mathcal P_2(\mathbb R^d)$, explicitly extends the OT value to proper signed bilinear costs, proves a uniform moment bound and records attainment and entropic uniqueness. The inverse-OT loss is defined on a convex admissible cost class with observed-plan integrability, finite forward value and attainment; the bilinear estimator is placed in this domain. | Cauchy--Schwarz controls every coupling uniformly, giving finite cross-moments and weak continuity of the bilinear term. The calibration proof is now performed only where all terms are finite and the forward infimum is attained. |
| CH12-010 | The fixed-support entropic barycenter objective is now described as convex on the closed simplex and smooth only on its relative interior; the algorithmic sentence specifies positive, interior-preserving iterates. | This removes the boundary differentiability overclaim while preserving the intended numerical method. |

### Post-correction verification

- `latexmk -pdf -interaction=nonstopmode -halt-on-error OT4ML.tex` completed successfully and produced the 494-page book.
- The build log contains no undefined references, undefined citations, duplicate labels, LaTeX errors or new Chapter 12 overfull boxes.
- `git diff --check` passes for the Chapter 12 manuscript and all revised notebooks.
- Clean notebook execution was verified for `sliced-radon-barycenter.ipynb`, `barycenters-four-shapes.ipynb`, `capacity-constrained-ot-2d.ipynb` and `martingale-ot-centered-kernels.ipynb`; every code cell has a monotone execution count and no error output.
- The regenerated Radon, barycenter, capacity and martingale assets were rendered to PNG and visually inspected for clipping, alignment, legibility and consistency with their captions.

### Second correction pass - 2026-08-26

This follow-up pass rechecked each implemented resolution against the retained finding rather than relying on successful compilation alone. It made the following additional improvements.

- The proof of Proposition `prop-quantile-barycenters` now verifies explicitly that the positive weighted average of the input quantiles belongs to $L^2(0,1)$, and therefore corresponds to a law in $\mathcal P_2(\mathbb R)$ rather than merely to a nondecreasing generalized inverse.
- The fixed-support entropic barycenter smoothness statement now includes the finite-cost and positive retained-support hypotheses: zero-weight atoms are deleted before smoothness on the relative interior is invoked.
- The MMOT direct-method statement now explicitly assumes $\epsilon>0$, which is necessary for the printed uniqueness conclusion.
- The signed bilinear-cost argument now proves uniform integrability by an explicit second-moment tail split. This justifies weak continuity of the cost integral and primal attainment; a uniform bound on expectations alone would not have sufficed.
- The Radon implementation disclosure now states explicitly that the post-inversion processing applies only to intermediate columns, while the endpoint panels remain the original endpoint densities.
- The hard capacity experiment was rerun from a clean kernel with a $500{,}000$-iteration budget and a target tolerance $5\times10^{-8}$, stricter than the independent $6\times10^{-8}$ assertions. The hardest $q=5$ solve converged in 356,001 iterations with residual $4.9993\times10^{-8}$; all six code cells have monotone execution counts and no error output.
- The complete book was rebuilt and the affected printed pages 246, 250, 257, 260, 261, 268, 270, 271 and 279 were rendered and inspected. No correction-induced mathematical, cross-reference or layout defect remains in the audited material.

## Scope, standards, and severity

Every physical source line is assigned to a structural unit in the structural matrix. Every named or numbered environment, proof, display, algorithm, figure, citation, cross-reference, notation dependency, endpoint claim, dimension statement, and complexity statement was separately inventoried. A statement was accepted only after its hypotheses and conventions were reconstructed independently; theorem names, citations, and manuscript proofs were not themselves treated as evidence.

- **Critical:** invalidates a central theorem/algorithm or makes a main construction materially false without substantial new hypotheses.
- **Major:** false or unjustified mathematical claim with meaningful downstream consequences, but locally repairable or not chapter-central.
- **Moderate:** real defect in hypotheses, scope, formula, convention, attribution, or exposition that can mislead a careful reader.
- **Minor:** localized typo, notation/reference defect, or precision omission with low mathematical risk.

Repeated consequences of one root cause receive one issue ID. Open research or scope questions are recorded separately and are not included in defect counts.

## Independence ledger

Before reading the old report, the frozen ledger contained eight root candidates: the one-dimensional/Radon finite-value domain, MMOT Gibbs scope, Coulomb panel temperature, martingale conditional residual, generator provenance, the Gaussian convex-order proof bridge, the bilinear/inverse proper domain, and closed-simplex boundary conventions. The old report then supplied one genuinely new hypothesis, the undeclared Radon post-processing; direct notebook inspection confirmed it as CH12-002. Its other final findings were already represented in the frozen ledger. During reconciliation, the broad boundary entry was split into two nonduplicate defects with different formulas and repairs: division by zero in weak-OT rows (CH12-006) and unqualified smoothness at entropic-simplex boundaries (CH12-010).

The first report also introduced CH12-011 after observing that Bauschke--Lewis's convergence theorem requires an interior feasible point. The second pass did not infer a defect from that citation limitation. It located and checked the more applicable polyhedral-boundary theorem of Bregman, Censor, and Reich, verified its hypotheses against the exact row, column, and box sets, and rejected CH12-011. Thus the boundary example in the first report remains a valid counterexample to one sufficient qualification, but not to the chapter's convergence claim.

The old report's own file identity was verified before reading it. All dispositions below therefore distinguish three outcomes: independently confirmed, confirmed only after fresh verification of a prior hypothesis, and explicitly rejected.

## Mechanical reconciliation ledger

| Quantity | Critical | Major | Moderate | Minor | Total |
|---|---:|---:|---:|---:|---:|
| Established defects | 0 | 0 | 5 | 5 | 10 |

| Audit object | Inventoried | Checked | Defects linked | Status |
|---|---:|---:|---:|---|
| Physical source lines | 2,414 | 2,414 | 10 | Complete |
| Structural units | 34 | 34 | 10 | Complete |
| Named/numbered environments | 44 | 44 | 2 | Complete |
| Proofs | 22 | 22 | 2 | Complete |
| Equations/displays | 158 | 158 | 4 | Complete |
| Algorithms/pseudocode blocks | 4 | 4 | 0 | Complete |
| Figures | 12 | 12 | 4 | Complete |
| Figure-generating notebooks/scripts | 12 | 12 | 4 | Complete |
| Included figure assets | 37 | 37 | 3 | Complete; none missing |
| Logical labels | 120 | 120 | 0 | Complete |
| Standard `ref`/`eqref` uses | 179 | 179 | 0 | Complete |
| Direct `hyperref` uses | 1 | 1 | 0 | Complete |
| Citation commands / distinct keys | 58 / 66 | 58 / 66 | 1 | Complete |

## Executive summary

This audit establishes **10 distinct defects: 0 Critical, 0 Major, 5 Moderate, and 5 Minor**. The chapter's central mathematical architecture survives independent rederivation: two-measure barycenters/geodesics, Gaussian covariance stationarity and damped convergence, entropic barycenter duality and scaling, the epsilon/tau cancellation, multimarginal barycenter equivalence, graphical contractions, low-rank factorization, capped feasibility and KL-Dykstra convergence, compact-domain OT first variations, weak duality, Strassen, and Brenier--Strassen are correct in their stated regimes.

The principal repairs are: state the exact finite-value hypothesis for line/Radon quantile barycenters (CH12-001); disclose the actual Radon display operator (CH12-002); correct the Coulomb temperature label (CH12-003); separate MMOT primal existence, density representation, dual attainment, and Sinkhorn convergence (CH12-004); and put the bilinear derivative and inverse-gap loss on a proper finite-moment/finite-value domain (CH12-009). The capacity-figure and martingale findings concern retained numerical certification rather than false theory (CH12-005, CH12-007). CH12-010 is the one retained finding absent from the nine-finding prior report; CH12-011 is retired after the second-pass theorem check.

## Adversarial reconciliation of the prior report

The old report was not consulted until the independent ledger had been frozen. Its nine final issue IDs were then reconciled as follows.

| Prior ID | Disposition | Prior severity | Final severity | Independent conclusion |
|---|---|---|---|---|
| CH12-001 | **Confirmed with exact scope** | Moderate | Moderate | The proposition already uses $r\in(0,1)$, and individual $\mathcal P_2$ membership is sufficient but not necessary. The real defect is the absent finite-value criterion, plus the closed endpoint notation only in the Radon reuse. |
| CH12-002 | **Confirmed and narrowed** | Moderate | Moderate | The percentile floor can be represented by a choice of $\eta_t$, and one Gaussian can be folded into an effective window. The caption still falsely identifies the panels with the specifically printed operator because neither change nor the post-threshold convolution is disclosed. |
| CH12-003 | **Confirmed** | Moderate | Moderate | Source, retained output, and asset-writing path all use $\epsilon=2.00$ for the third panel, while TeX says $0.50$. |
| CH12-004 | **Confirmed and expanded** | Moderate | Moderate | Four logically distinct conclusions are conflated: primal attainment, finite-entropy density, additive-potential dual attainment, and cyclic-scaling convergence. |
| CH12-005 | **Confirmed and expanded** | Minor | Minor | The $q$-connection theorem is correct and the assets are not proved wrong. The stale $(2,3,5)$ output, failed $q=3$ tolerance, and unexecuted core cells establish incomplete generator provenance; analogous core-cell gaps occur in two other notebooks. |
| CH12-006 | **Confirmed** | Minor | Minor | Imported definitions do not remove zero-weight atoms globally: `monge.tex:32` defines the closed simplex and `monge.tex:45--49` permits zero weights. The divisions therefore need a local positive-mass convention. |
| CH12-007 | **Confirmed at the narrower scope** | Minor | Minor | The raw equality residual is within the solver's absolute tolerance, but division by a $10^{-6}$ row mass produces conditional error $0.0905$. The LP and theorem are correct; the all-row caption is not numerically certified. |
| CH12-008 | **Confirmed** | Minor | Minor | Equivalent definitions of convex order do permit all integrable convex tests, but under the chapter's explicit at-most-linear test class the quadratic is still inadmissible. A monotone convex truncation argument repairs the proof. |
| CH12-009 | **Confirmed independently** | Moderate | Moderate | Unbounded bilinear derivatives and inverse-gap formulas lack moment, integrability, finite-value, and attainment hypotheses, and also extend notation imported for nonnegative costs to signed costs without declaring a proper extension. |

CH12-010 below is new relative to the nine-finding prior report.

## Second-pass disposition of the current ledger

The 936-line report supplied for this second pass contained CH12-001--CH12-011. Each was rederived rather than presumed correct.

| Input ID | Input severity | Second-pass disposition | Final severity | Decisive point |
|---|---:|---|---:|---|
| CH12-001 | Moderate | **Retained and sharpened** | Moderate | The imported $W_2$ and sliced-$W_2$ notation is defined on finite-second-moment spaces. Pairwise $L^2$ quantile differences give a valid broader extension, but the chapter does not declare it; the Radon reuse alone has the endpoint error. |
| CH12-002 | Moderate | **Retained** | Moderate | Direct generator inspection again finds an undeclared post-inversion Gaussian and a second post-threshold Gaussian. |
| CH12-003 | Moderate | **Retained** | Moderate | TeX says $0.50$ while generator, retained output, and written third panel use $2.00$. |
| CH12-004 | Moderate | **Retained** | Moderate | General measurable/lower-bounded cost does not ensure finite primal value, finite-entropy density, additive-potential dual attainment, or cyclic-scaling convergence. |
| CH12-005 | Minor | **Retained** | Minor | The finding remains provenance-only: stale/unexecuted core cells and one retained failed tolerance do not prove the PDFs mathematically false. |
| CH12-006 | Minor | **Retained** | Minor | The imported simplex is closed and zero-weight listed atoms are allowed, so the displayed conditional means literally divide by zero without a local convention. |
| CH12-007 | Minor | **Retained at numerical-certification scope** | Minor | Raw LP equalities pass at about $10^{-7}$ but the retained tiny row yields conditional residual $9.05\times10^{-2}$. |
| CH12-008 | Minor | **Retained** | Minor | The proof uses a quadratic outside its stated linear-growth test class; monotone convex linear-growth truncations supply the missing bridge. |
| CH12-009 | Moderate | **Retained** | Moderate | Signed bilinear costs fall outside the imported nonnegative-cost contract, and moments, proper finite values, attainment, and uniqueness are missing where used. |
| CH12-010 | Minor | **Retained but narrowed** | Minor | The defect is only the unqualified word “smooth” on the printed closed simplex. The objective is convex and continuous there and smooth on its relative interior; standard interior methods remain valid. |
| CH12-011 | Moderate | **Removed as a false positive** | None | [Bregman--Censor--Reich, Theorem 3.1 and Remark 2.5](https://math.haifa.ac.il/yair/Dykstra.jca99.pdf) cover cyclic entropy-Dykstra with a boundary-only intersection when the component sets are polyhedral. All three chapter sets satisfy the theorem's exact hypotheses. |

### Explicitly rejected hypotheses

| Hypothesis tested | Disposition | Reason |
|---|---|---|
| Every input in the one-dimensional theorem must individually lie in $\mathcal P_2$ | **Rejected** | Pairwise $L^2$ quantile differences are exact; identical or shifted Cauchy laws give finite pairwise objectives without finite second moments. |
| Proposition `prop-quantile-barycenters` uses invalid endpoint quantiles | **Rejected** | Its displayed domain is already $(0,1)$; only lines 891--897 use $[0,1]$. |
| The percentile subtraction alone proves the Radon panel is outside equation `eq-radon-display-reconstruction` | **Rejected as stated** | A data-dependent percentile can serve as $\eta_t$; the undeclared Gaussian filtering is the irreducible mismatch. |
| `cap-1.pdf` is necessarily an old $q=2$ panel | **Not established** | The retained output is stale, but all three PDFs have a later common timestamp and could have been regenerated. The defect is provenance, not a proven false asset. |
| The martingale LP formulation is infeasible or mathematically wrong | **Rejected** | Raw row, column, and martingale equalities are all satisfied to about $10^{-7}$; only conditioning by a tiny row mass breaks the claimed conditional precision. |
| The Gaussian covariance panels are materially inaccurate because POT prints 17 warnings | **Rejected** | A long-run recomputation changes the worst covariance by only $2.36\times10^{-6}$ relatively and the objective by $4.8\times10^{-12}$. |
| The chapter claims universal deterministic Coulomb optimizers | **Rejected** | Lines 1130--1190 explicitly separate the twist mechanism from Coulomb and cite counterexamples. |
| The chapter claims a generic Wasserstein-space CLT | **Rejected** | Lines 848--857 explicitly restrict the discussion to special one-dimensional and finite Gaussian regimes. |
| The fixed-$g$ low-rank method claims global optimality or monotone approximation in rank | **Rejected** | It claims only monotone block-objective descent and stationary accumulation; the figure's rank trend is explicitly example-specific. |
| Missing martingale duality, continuous capacity duality, or low-rank approximation rates are defects | **Rejected** | Those results are not asserted; they are optional extensions and remain separated below as research questions. |
| Failure of the Bauschke--Lewis interior qualification makes line 1731's KL-Dykstra convergence false or unsupported | **Rejected on second pass; retired CH12-011** | Bregman--Censor--Reich Theorem 3.1 permits $C\cap\operatorname{int}(\operatorname{dom}f)=\varnothing$ when the component sets are polyhedral. For $f_K(P)=\sum_e[P_e\log(P_e/K_e)-P_e]$, the active-edge domain is $\mathbb R_+^E$; positive marginals make each row/column set meet $\mathbb R_{++}^E$, positive capacities make the box meet it, all three sets are polyhedral, and feasibility gives $C\cap\operatorname{dom}f_K\ne\varnothing$. Remark 2.5 identifies the cyclic scheme with Bregman-Dykstra. Hence the primal iterates converge to the unique KL projection even if the dual corrections diverge. |

## Established defects

### CH12-001 - Moderate - Quantile barycenters lack the exact finite-value hypothesis; Radon endpoints remain invalid

- **Source:** lines 245--270, especially Proposition `prop-quantile-barycenters`; lines 870--897 in the sliced/Radon construction.
- **Current claim:** the line barycenter is represented by $\bar q=\sum_s\lambda_sq_s$; the Radon paragraph uses directionwise averaged quantiles for $r\in[0,1]$.
- **Defect:** the proposition does not require a finite-valued barycenter problem. It already uses the correct open interval $r\in(0,1)$, so an endpoint objection to that proposition is rejected. The imported quantile formula at `monge.tex:1356--1365` and imported sliced distance at `generalized-wasserstein.tex:1040--1051` are stated on finite-moment Wasserstein spaces, while lines 245--270 and 870--913 do not restate or enforce that domain. The Radon display also includes endpoints. If every candidate has value $+\infty$, pointwise square completion does not characterize the minimizer set.
- **Exact finite-value criterion and derivation:** discard zero weights as line 24 already instructs. For positive-weight quantiles $q_s$, a finite candidate exists iff there is a nondecreasing quantile $q$ with $q-q_s\in L^2(0,1)$ for every $s$; equivalently, $q_s-q_t\in L^2(0,1)$ for every positive-weight pair. Individual $\beta_s\in\mathcal P_2$ is sufficient, not necessary: identical Cauchy inputs have zero barycenter objective, and shifted Cauchy inputs have square-integrable quantile differences despite infinite second moments. Conversely, $\delta_0$ and a Cauchy input have no finite candidate, so all candidates have extended value $+\infty$. In the finite regime,
  \[
  \sum_s\lambda_s|q-q_s|^2=|q-\bar q|^2+\sum_s\lambda_s|q_s-\bar q|^2,
  \qquad \bar q=\sum_s\lambda_s q_s.
  \]
- **Uniqueness/existence consequence:** $\bar q$ is nondecreasing and the square completion makes it the unique minimizer in the $L^2$ equivalence class whenever the objective is finite. No uniqueness statement is meaningful when the infimum is everywhere $+\infty$.
- **Concrete repair:** either (i) follow the imported book contract by assuming every positive-weight input lies in $\mathcal P_2(\mathbb R)$ and every sliced input lies in $\mathcal P_2(\mathbb R^d)$, or (ii) explicitly extend the notation and state the exact pairwise $L^2$-difference criterion. Keep the proposition's $(0,1)$ domain; change lines 891--897 to $(0,1)$ and state that endpoint representatives are irrelevant to Lebesgue push-forward.
- **Downstream impact:** the quantile algebra and all finite-moment examples remain correct. The defect affects the theorem's declared domain, the fair-repair dependency, and the relaxed Radon construction when inputs are not explicitly in the imported Wasserstein space.

### CH12-002 - Moderate - The Radon figure is not generated by the specifically stated reconstruction

- **Source:** lines 984--1006 and Figure `fig:sliced-radon-barycenter`, lines 1012--1016; generator `notebooks-figures/sliced-radon-barycenter.ipynb`, functions `filtered_back_projection` and `display_density`.
- **Current claim:** the numerical reconstruction uses the super-Gaussian window $\chi(s)=e^{-|s|^4}$, and the first figure row shows the densities $A_t$ defined by equation `eq-radon-display-reconstruction` from `eq-radon-windowed-ramp`.
- **Defect:** the generator applies the stated ramp/super-Gaussian filter and then an undeclared two-dimensional Gaussian filter (`post_sigma=1.35`). For non-endpoint display it subtracts the 10th percentile of positive values and applies another Gaussian filter (`sigma=0.20`). Threshold subtraction can be interpreted as a data-dependent $\eta_t$, and the first Gaussian can be folded into an effective radial window, but neither effective operator nor the final display convolution is disclosed. The displayed row is therefore not the specifically defined $A_t$ as captioned.
- **Independent check:** convolution after inversion multiplies the reconstructed Fourier field by an additional Gaussian radial factor. The second convolution occurs after positive-part thresholding and normalization, so it cannot be represented by the linear pseudoinverse in equations `eq-radon-windowed-ramp`--`eq-radon-display-reconstruction`.
- **Concrete repair:** either (i) disclose both post-inversion operations and call the first row a display-regularized version of $A_t$, defining the effective window/floors, or (ii) generate the panel directly from `eq-radon-display-reconstruction` and limit rendering to a monotone color normalization.
- **Downstream impact:** the Radon pseudoinverse theorem and constants are unaffected. Only the evidentiary claim that the plotted first row is exactly the printed $A_t$ fails.

### CH12-003 - Moderate - Coulomb figure labels the third regularization parameter incorrectly

- **Source:** lines 1194--1206 and Figure `fig:multimarginal-coulomb-sinkhorn`; generator `notebooks-figures/multimarginal-coulomb-sinkhorn.ipynb`.
- **Current claim:** the three panels use $\epsilon=0.06$, $0.16$, and $0.50$.
- **Defect:** the generating source sets `epsilons = [0.06, 0.16, 2.00]`; its recorded numerical output likewise reports `epsilon=2.00` for the third tensor solve. `epsilon-large.pdf` is written from that third solution. The manuscript's `0.50` label is therefore false for the documented generator.
- **Independent check:** the tensor kernel is `base * exp(-(C-C.min())/epsilon)`. Subtracting the constant `C.min()` does not alter the optimizer, so it cannot reconcile 2.00 with 0.50.
- **Concrete repair:** either relabel the third panel as $\epsilon=2.00$ or rerun the generator with $0.50$ and replace the panel and recorded diagnostics.
- **Downstream impact:** the qualitative repulsion/blurring discussion is unchanged, but the figure cannot support any quantitative comparison at $\epsilon=0.50$ in its present documented form.

### CH12-004 - Moderate - MMOT Gibbs form and Sinkhorn are asserted without separating four existence questions

- **Source:** lines 1029--1042 and 1292--1309, especially the sentence at line 1302.
- **Current claim:** after defining MMOT for an arbitrary measurable cost bounded below, the text says that the entropy-regularized optimizer has a density $\exp((\sum_s f_s-c)/\epsilon)$ relative to the product measure and can be obtained by generalized Sinkhorn updates.
- **Defect:** the definition gives neither finite value nor lower semicontinuity, integrability, primal/dual attainment, or support positivity. The prose conflates: (i) existence of a primal optimizer, (ii) its density with respect to $\bigotimes_s\beta_s$, (iii) representation of the log-density by additive dual potentials, and (iv) existence/convergence of cyclic scaling. None follows from mere measurability and a lower bound.
- **Independent counterexample/derivation:** the defect does not depend on allowing the value $+\infty$ pointwise. Take a Cauchy marginal $\alpha_1$ and the finite nonnegative measurable cost $c(x_1,\ldots,x_S)=x_1^2$. Every feasible plan has $\int c\,d\pi=+\infty$, so the problem is not proper and no finite Gibbs characterization follows. Even when a finite competitor exists, measurability alone does not make the cost integral lower semicontinuous on the tight coupling set, and primal attainment does not imply dual-potential attainment. In the finite discrete, finite-cost, positive-marginal case, Lagrange stationarity does give
  \[
  \pi_{i_1\ldots i_S}=\left(\prod_s a_{s,i_s}\right)
  \exp\!\left(\frac{\sum_s f_{s,i_s}-c_{i_1\ldots i_S}}{\epsilon}\right),
  \]
  with one additive gauge redundancy per collection of potentials.
- **Sharp safe regimes:** in the finite discrete case, after deleting zero masses, finite costs and strictly positive retained marginals give a strictly positive kernel, a unique positive primal optimizer, finite dual potentials modulo gauges, Gibbs form, and convergent cyclic iterative proportional fitting. Forbidden entries require a feasible compatible support and extended-potential conventions. In a standard continuous safe regime, compact metric spaces and finite continuous $c$ make the Gibbs kernel bounded above and below; primal and dual optimizers exist and normalized Sinkhorn/IPFP converges in plan under standard results. On general Polish spaces, lower semicontinuity of fixed-reference KL plus tightness can yield a primal optimizer if a finite-entropy feasible coupling exists, but this alone does not give additive dual potentials or scaling convergence.
- **Concrete repair:** state one of those regimes explicitly and separate the four conclusions. Do not infer Gibbs potentials or generalized Sinkhorn merely from primal attainment.
- **Downstream impact:** the later finite positive tensor Algorithm `alg:multimarginal-sinkhorn` remains valid. The defect is in the continuous/general prose and can misstate existence, representability, or convergence outside that safe finite regime.

### CH12-005 - Minor - Retained generator execution provenance is incomplete, with a concrete stale capacity run

- **Source:** all 12 figure generators, especially `notebooks-figures/barycenters-four-shapes.ipynb`, `notebooks-figures/sliced-radon-barycenter.ipynb`, and `notebooks-figures/capacity-constrained-ot-2d.ipynb`; manuscript lines 1752--1768 for the concrete capacity claim.
- **Current claim:** the retained notebooks are the evidence for the included panels; in particular, the capacity panels solve the capped problem for $q=1,3,5$ and impose at least one, three, and five outgoing connections.
- **Defect:** three notebooks retain downstream executions while core current-code cells have `execution_count=null`: `image_density` in the four-shape generator, `normalize_projection` and `sinogram_from_quantiles` in the Radon generator, and `kl_dykstra_capacity` in the two-dimensional capacity generator. This prevents the notebook metadata from certifying that the retained outputs came from all current cells in a clean run. The capacity notebook supplies a direct contradiction: current source sets `connection_counts = [1, 3, 5]`, while retained output reports `(2,3,5)` under a stale `cap factor` header. Its recorded $q=3$ run reaches 90,000 iterations with residual $2.0081\times10^{-7}$ against a requested $6\times10^{-8}$. The three included PDFs have a later common timestamp than the stale retained output, so this audit cannot establish that `cap-1.pdf` is mathematically wrong; it establishes that the retained notebook is not a coherent execution certificate for those assets.
- **Independent check:** for uniform $a_i=1/n$, the cap $P_{ij}\leq1/(qn)$ does algebraically force at least $q$ positive entries in every row, since $\sum_jP_{ij}=1/n$. That mathematical caption claim is correct; the defect is the unverified numerical provenance and convergence status of the displayed panels.
- **Concrete repair:** execute every generator from a clean kernel after all source cells are finalized and retain monotone execution counts. For capacity, make nonconvergence a hard error, record all $q=1,3,5$ diagnostics below tolerance, and regenerate `cap-1.pdf`, `cap-3.pdf`, and `cap-5.pdf` in that same run. This is a provenance repair; it does not require changing the correct minimum-degree argument.
- **Downstream impact:** the retained notebooks cannot currently serve as complete reproducibility certificates. No theorem, algorithm formula, or included capacity asset is thereby proved false.

### CH12-006 - Minor - Discrete barycentric formulas divide by source masses without a local positive-atom convention

- **Source:** lines 2028--2032 and 2162--2168.
- **Current claim:** for $\alpha=\sum_i a_i\delta_{x_i}$, the conditional law and weak quadratic objective use $P_{ij}/a_i$ and $a_i^{-1}\sum_jP_{ij}y_j$ for every $i$.
- **Defect:** imported conventions do not silently remove zero atoms. Definition `def-probability-simplex` in `monge.tex:28--35` is the closed simplex, and the discrete-measure definition at `monge.tex:43--50` allows zero weights. Thus $a_i=0$ is possible and the displayed conditional/objective are undefined as written. Conditional laws are only $\alpha$-a.e., so deletion is a valid repair but is not already a book-wide convention.
- **Independent derivation:** the row constraint gives $\sum_jP_{ij}=a_i$. For $a_i>0$, normalization yields the stated conditional distribution. For $a_i=0$, nonnegativity gives $P_{ij}=0$ for every $j$, and the row contributes zero to the integral, while its conditional barycenter may be assigned arbitrarily.
- **Concrete repair:** assume all displayed source atoms have $a_i>0$, or state that zero-mass atoms are deleted and the sum runs only over $i$ with $a_i>0$.
- **Downstream impact:** positive-mass numerical examples and the measure-theoretic $\alpha$-a.e. definitions are unaffected; only the literal discrete formulas fail on the closed-simplex boundary.

### CH12-007 - Minor - Absolute LP tolerances do not certify the caption's conditional martingale identity

- **Source:** lines 2397--2414 and Figure `fig:martingale-ot-centered-kernels`; generator `notebooks-figures/martingale-ot-centered-kernels.ipynb`.
- **Current claim:** the optimized third panel solves the hard finite-dimensional martingale constraints and both displayed plans have identity barycentric projection.
- **Defect:** retained output reports conditional residual $9.05\times10^{-2}$. A read-only reproduction with SciPy/HiGHS found maximum row, column, and raw martingale equality residuals $8.72\times10^{-8}$, $6.08\times10^{-8}$, and $9.08\times10^{-8}$, consistent with HiGHS' default $10^{-7}$ absolute primal feasibility tolerance. The offending row has $a_i=1.0027\times10^{-6}$; dividing its raw $9.08\times10^{-8}$ residual by $a_i$ gives $0.09054$. All rows with $a_i>10^{-5}$ have conditional error below $4.5\times10^{-16}$. The LP formulation is correct, but the generated plan does not numerically certify the caption's unqualified identity on every positive displayed row.
- **Concrete repair:** scale each martingale equality by $1/a_i$ for retained positive rows (or formulate directly in conditional variables), remove numerically negligible atoms with an explicit mass threshold, solve at a tolerance controlling conditional residuals, assert the maximum residual in the notebook, and regenerate the optimized panels.
- **Downstream impact:** the martingale LP, Strassen theorem, and convex-order discussion remain correct. The displayed optimized plan does not certify identity barycentric projection on every positive row at the caption's unqualified precision.

### CH12-008 - Minor - The Gaussian convex-order converse skips the truncation needed by its chosen definition

- **Source:** Definition `def-convex-order`, lines 2294--2298, and the Gaussian equivalence/justification at lines 2384--2392.
- **Current claim:** convex order on $\mathcal P_1(\mathbb R^d)$ is tested against continuous convex functions of at most linear growth; the Gaussian covariance converse is then said to follow by testing $x\mapsto\langle u,x\rangle^2$.
- **Defect:** a nonzero quadratic function does not have at most linear growth and therefore is not an admissible test under the definition just given. The Gaussian equivalence remains true, but the stated one-line derivation does not literally follow from that test class.
- **Independent derivation:** use $q_R(t)=t^2$ for $|t|\le R$ and the tangent affine continuations $2R|t|-R^2$ outside. Then $q_R\uparrow t^2$, each $q_R\circ\langle u,\cdot\rangle$ is continuous convex with at-most-linear growth, and monotone convergence gives the second-moment inequality. Equivalent definitions that test every convex function integrable under both laws reach the result directly, but that is not the definition printed at lines 2294--2298.
- **Concrete repair:** replace "testing the convex quadratic functions" by "approximating the convex quadratic functions monotonically by convex functions of at most linear growth and passing to the limit"; alternatively define convex order using every convex function integrable under both measures.
- **Downstream impact:** the Gaussian covariance-order equivalence is true; the defect is a missing bridge between the selected definition and the proof sentence.

### CH12-009 - Moderate - Bilinear derivatives and inverse-gap loss are not placed on a proper finite domain

- **Source:** lines 1856--1878; Definition `def-inverse-ot-loss`, lines 1910--1920; Proposition `prop-inverse-ot-convex`, lines 1924--1936; bilinear model, lines 1938--1950.
- **Current claim:** on $\mathbb R^d$, the entropic bilinear value has gradient $\int yx^\top\,d\pi^\star$; for any observed coupling satisfying only finite observed KL when $\epsilon>0$, $\mathcal F_\epsilon$ is a finite nonnegative convex loss and vanishes exactly at forward optimizers.
- **Defect:** the compact-support/continuous-cost hypotheses of Proposition E29 are left behind when $c_A(x,y)=\langle Ax,y\rangle$ is introduced. Moreover, the imported continuous Kantorovich definition at `kantorovich.tex:1015--1025` declares a nonnegative Borel cost, whereas a bilinear cost is signed and unbounded on $\mathbb R^d$; the extension is never stated. No first/second moments, integrability of $c_A$ or $yx^\top$, finite forward value, optimizer existence, or differentiability hypothesis is supplied. Definition E30 likewise does not require $\int c\,d\widehat\pi$ and $\MK_c^\epsilon$ to be finite real numbers. Its formula can therefore be undefined as $+\infty-+\infty$ (and signed unbounded costs can create undefined integrals or value $-\infty$), so E31's nonnegativity/zero equivalence is not a statement on the declared domain.
- **Independent counterexamples:** with Cauchy marginals, $m_\alpha$, $m_\beta$, and $\int yx^\top d\pi$ need not exist, so line 1876 is meaningless. More generally, choose a measurable nonnegative cost with $\int c\,d\widehat\pi=+\infty$ and every feasible forward objective $+\infty$; then E30 subtracts two infinities. Finite observed KL does not imply cost integrability. For bilinear costs, $\alpha,\beta\in\mathcal P_2$ gives $\int|x||y|d\pi<\infty$ for every coupling by Cauchy--Schwarz, but differentiability still needs uniqueness (or else only a directional infimum over optimal cross-moments is available).
- **Independent derivation in the valid regime:** if $A\mapsto c_A$ is differentiable, all relevant integrals are finite, the forward infimum is attained, and the optimizer is unique, envelope differentiation gives
  \[
  D\MK_{c_A}^\epsilon[H]=\int\langle Hx,y\rangle d\pi^\star
  =\left\langle H,\int yx^\top d\pi^\star\right\rangle_F.
  \]
  On a proper convex cost domain where the observed objective and forward value are finite, $\mathcal F_\epsilon$ is the supremum over feasible plans of affine cost differences, hence convex and nonnegative; equality is equivalent to attainment by $\widehat\pi$.
- **Concrete repair:** retain compact supports and continuous finite costs, or assume at least $\alpha,\beta\in\mathcal P_2(\mathbb R^d)$ for bilinear costs plus finite value/attainment and uniqueness for an ordinary gradient. Define E30 only on costs for which both the observed objective and $\MK_c^\epsilon$ are finite real numbers, and state calibration conditional on forward attainment.
- **Downstream impact:** without repair, a displayed gradient, loss, minimizer, and calibration equivalence can all be undefined in the advertised $\mathbb R^d$ setting. The finite empirical figures and the convex algebra on a proper domain remain valid.

### CH12-010 - Minor - “Smooth” needs a relative-interior qualifier for the closed-simplex problem

- **Source:** equation `eq-entropic-bary` and the sentence at line 541; imported closed-simplex convention `monge.tex:28--35`.
- **Current claim:** for $\epsilon>0$, minimization of $\sum_s\lambda_s\MKD_{C_s}^\epsilon(a,b_s)$ over $a\in\Delta_n$ is a “smooth convex minimization problem” suitable for gradient descent.
- **Defect:** convexity and continuity on the closed simplex are correct, and the usual positive initialization makes smooth optimization meaningful on the relative interior. The only overclaim is the unqualified word “smooth” for the problem as printed over the closed simplex: entropic smoothing does not remove the logarithmic singularity at a zero source weight. This is not a claim that smooth constrained optimization is impossible, nor that the cited interior algorithm is invalid.
- **Minimal counterexample:** take one target atom, $b=(1)$, finite costs $C_i$, and a candidate source histogram $a\in\Delta_n$. The only coupling is $P=a$, so, up to an additive constant,
  \[
  \MKD_C^\epsilon(a,b)=\sum_i C_i a_i+\epsilon\sum_i a_i\log a_i.
  \]
  At $a_i=0$, the one-sided derivative for introducing mass in component $i$ is $-\infty$; no finite gradient exists there. This counterexample uses precisely the entropy-only convention imported by line 535.
- **Concrete repair:** say “convex on $\Delta_n$ and smooth on $\operatorname{ri}(\Delta_n)$” and either initialize/use an interior-preserving method or formulate boundary optimization with one-sided/subgradient language. [Cuturi--Doucet](https://proceedings.mlr.press/v32/cuturi14.html) likewise computes Sinkhorn gradients under positive-histogram scaling. The subsequent chapter algorithm assumes positive target masses and maintains positive barycenter weights, so no algorithm formula needs to change.
- **Downstream impact:** the objective, minimizers, and interior gradient method remain valid. Only an unqualified finite-gradient reading at sparse initializations or boundary iterates fails.

## Optional exposition improvements

These are not defects and are excluded from the severity count.

- **Lines 1005--1006, Radon range language:** exact directionwise interpolation of consistent input projections preserves the antipodal relation $h(-\theta,t)=h(\theta,-t)$. Moment/range consistency is the substantive obstruction here. Rephrasing “such as antipodal symmetry” would prevent readers from inferring that this particular exact construction necessarily violates antipodal symmetry.
- **Lines 1069--1099, Monge structure:** “the optimizer is unique” is logically “there is at most one optimizer” unless primal existence is supplied separately. The proposition quantifies over every optimal plan, so its proof is correct; an explicit existence caveat would improve semantics.
- **Lines 779--842, LLN proof:** line 811 says the just-proved empirical-law convergence is “exactly” equation `eq-wow-empirical-law-lln`, although that equation also contains the collapsed-mixture convergence proved immediately afterward. Replacing “the first assertion in” would be cleaner.
- **Lines 714--727, zero outer weight:** explicitly state that when $\tau=0$ the KL term is omitted, equivalently adopt the convex-analysis convention $0\cdot(+\infty)=0$.
- **Line 1681, boundary-capacity convergence citation:** the current citations are topically correct, and the claim is true. Adding Bregman--Censor--Reich (1999), Theorem 3.1, would make explicit why polyhedral row/column/box constraints need no strictly positive common point.
- **Line 1752, minimum degree:** the cap forces at least $q$ positive entries exactly; entropic smoothing may make the support larger. The current wording is understandable, but separating these two facts would be sharper.

## Unresolved research and scope questions

These items are excluded from the ten established defects.

- **RQ12-001 - Martingale dual scope.** The subsection defines the primal feasible set and stochastic/convex orders but does not state the martingale superhedging dual, its integrability class, or attainment. This is a scope omission rather than a false duality claim. If a dual is added, distinguish pointwise and quasi-sure formulations and state the growth/integrability hypotheses.
- **RQ12-002 - Capacity duality and partial-transport relation.** The section gives a continuous primal definition, a complete discrete feasibility theorem, and an entropic discrete algorithm, but no continuous existence theorem, capacity dual, uniqueness statement for the unregularized problem, or precise partial-transport equivalence. The prose only says the model provides an interpolation, so no absent theorem is counted as defective. Adding these topics would require explicit topological and feasibility assumptions.
- **RQ12-003 - Low-rank approximation guarantees.** The section intentionally treats nonnegative-rank factorization and a fixed-latent-mass block algorithm. It makes no mutual-information identity, metric, global approximation-rate, or global-optimality claim. Whether to add such results is editorial scope, not a correctness issue.
- **RQ12-004 - Version-sensitive statistical inverse-OT claims.** The population curvature and parametric-rate paragraph is explicitly conditional on identifiability, local strong convexity, bounded/sub-Gaussian features, and empirical-process regularity. Its scope is compatible with the cited recent work, but the final theorem numbering and sharp assumptions should be checked again when those recent references reach a stable archival version.

## Detailed verification matrices

### Structural coverage matrix

The 34 rows below are contiguous and exhaustive: S01 starts at physical line 1, each later row starts at the next structural heading, and S34 ends at line 2,414. A section/subsection row covers its heading and introductory text before the first child paragraph; a section without child headings covers its complete body.

| ID | Lines | Level and title | Disposition |
|---|---:|---|---|
| S01 | 1--10 | Chapter: Generalized OT Problems (including file prologue) | Pass |
| S02 | 11--17 | Section: OT Barycenters, introduction | Pass |
| S03 | 18--37 | Paragraph: Frechet means | Pass |
| S04 | 38--239 | Paragraph: Fixed-support restriction | Pass |
| S05 | 240--273 | Paragraph: One-dimensional case | CH12-001 |
| S06 | 274--527 | Paragraph: Gaussian case | Pass |
| S07 | 528--707 | Paragraph: Sinkhorn for barycenters | CH12-010 at line 541; all scaling/duality claims pass |
| S08 | 708--740 | Paragraph: Doubly regularized entropic barycenters | Pass |
| S09 | 741--847 | Paragraph: Wasserstein-over-Wasserstein and barycenters | Pass |
| S10 | 848--861 | Paragraph: Toward central limit theorems on Wasserstein space | Pass, scoped |
| S11 | 862--1018 | Paragraph: Sliced and Radon barycenters | CH12-001, CH12-002 |
| S12 | 1019--1025 | Section: Multimarginal OT, introduction | Pass |
| S13 | 1026--1045 | Paragraph: Definition and basic structure | Pass |
| S14 | 1046--1119 | Paragraph: Monge structure and splitting-set twist | Pass |
| S15 | 1120--1212 | Paragraph: Coulomb cost and density-functional theory | CH12-003 |
| S16 | 1213--1291 | Paragraph: Multi-marginal formulation of barycenters | Pass |
| S17 | 1292--1310 | Paragraph: Entropic regularization of multi-marginal OT | CH12-004 |
| S18 | 1311--1348 | Paragraph: Treewidth and graphical structure | Pass |
| S19 | 1349--1466 | Paragraph: Junction-tree contractions inside Sinkhorn | Pass |
| S20 | 1467--1597 | Section: Low-Rank Optimal Transport | Pass |
| S21 | 1598--1775 | Section: Capacity-Constrained Optimal Transport | CH12-005; feasibility, projection formulas, and convergence pass |
| S22 | 1776--1785 | Section: Metric Learning and Inverse OT, introduction | Pass |
| S23 | 1786--1792 | Subsection: Differentiating OT losses, introduction | Pass |
| S24 | 1793--1895 | Paragraph: First variations of OT values | CH12-009 at 1856--1878; E29 itself passes |
| S25 | 1896--1937 | Subsection: Inverse Optimal Transport, introduction | CH12-009 |
| S26 | 1938--1971 | Paragraph: Bilinear cost learning | CH12-009 |
| S27 | 1972--1991 | Paragraph: Finite-sample polyhedrality and population curvature | Pass, scoped |
| S28 | 1992--2003 | Paragraph: Statistical estimation | Pass, scoped |
| S29 | 2004--2010 | Section: Weak Optimal Transport, introduction | Pass |
| S30 | 2011--2063 | Paragraph: Barycentric projection of a coupling | CH12-006 |
| S31 | 2064--2218 | Paragraph: Weak transport costs | CH12-006 |
| S32 | 2219--2263 | Subsection: Martingale Optimal Transport, introduction | Pass |
| S33 | 2264--2290 | Paragraph: Stochastic orders | Pass |
| S34 | 2291--2414 | Paragraph: Convex order and martingale feasibility | CH12-007, CH12-008 |

### Named and numbered environment matrix

There are 44 mathematical environments: 14 definitions, 20 propositions, one theorem, one corollary, zero lemmas, five remarks, and three examples. Line intervals include each complete environment but not a following proof.

| ID | Type | Lines | Name / primary label | Disposition |
|---|---|---:|---|---|
| E01 | Definition | 23--29 | Optimal-transport barycenter; `def-ot-barycenter` | Pass |
| E02 | Definition | 52--60 | Fixed-support discrete OT barycenter; `def-fixed-support-discrete-barycenter` | Pass |
| E03 | Example | 80--109 | Application to fair score repair; `ex-fair-score-repair` | Pass |
| E04 | Proposition | 113--133 | Two-measure barycenters are Wasserstein geodesics; `prop-two-measure-barycenter-geodesic` | Pass |
| E05 | Example | 160--164 | Dirac inputs recover Frechet means | Pass |
| E06 | Proposition | 187--209 | Mean and support of quadratic Wasserstein barycenters; `prop-w2-barycenter-mean-support` | Pass |
| E07 | Proposition | 245--256 | Quantile barycenters on the line; `prop-quantile-barycenters` | CH12-001 |
| E08 | Proposition | 280--320 | Nondegenerate Gaussian inputs remain Gaussian; `prop-gaussian-barycenter` | Pass |
| E09 | Remark | 371--393 | Forward KL barycenter of Gaussian laws | Pass |
| E10 | Proposition | 422--446 | Convergence of Gaussian transport fixed-point iteration; `prop-gaussian-barycenter-fixed-point-convergence` | Pass |
| E11 | Remark | 498--508 | Raw covariance Picard iteration | Pass |
| E12 | Proposition | 645--662 | Dual of entropic barycenters; `prop-dual-entropic-barycenters` | Pass |
| E13 | Definition | 714--727 | Doubly regularized entropic barycenter; `def-doubly-regularized-entropic-barycenter` | Pass |
| E14 | Proposition | 779--800 | Law of large numbers for barycenters over measures; `prop-wow-barycenter-lln` | Pass |
| E15 | Proposition | 930--958 | Radon least-squares pseudoinverse; `prop-radon-pseudoinverse` | Pass |
| E16 | Definition | 1029--1042 | Multimarginal optimal transport; `def-multimarginal-ot` | Pass |
| E17 | Definition | 1054--1067 | Twist on splitting sets; `def-twist-splitting-sets` | Pass |
| E18 | Proposition | 1069--1082 | Multi-marginal Monge structure; `prop-multimarginal-monge-structure` | Pass |
| E19 | Remark | 1101--1118 | Recovery of two-marginal theory | Pass |
| E20 | Proposition | 1163--1183 | Cyclic co-motion plans; `prop-cyclic-comotion-plans` | Pass |
| E21 | Proposition | 1227--1239 | Multi-marginal formula for quadratic barycenters; `prop-multimarginal-barycenter` | Pass |
| E22 | Corollary | 1258--1273 | Sparse discrete barycenters; `cor-discrete-barycenters` | Pass |
| E23 | Definition | 1322--1333 | Tree decomposition and treewidth; `def-treewidth` | Pass |
| E24 | Example | 1342--1347 | Treewidth of familiar interaction graphs; `ex-treewidth-graphs` | Pass |
| E25 | Definition | 1476--1492 | Low-rank factored couplings; `def-low-rank-couplings` | Pass |
| E26 | Proposition | 1501--1504 | Factored couplings and nonnegative rank; `prop-low-rank-factorization` | Pass |
| E27 | Definition | 1608--1624 | Capacity-constrained optimal transport; `def-capacity-constrained-ot` | Pass |
| E28 | Proposition | 1645--1653 | Feasibility of a capped transport polytope; `prop-capacity-feasibility` | Pass |
| E29 | Proposition | 1799--1833 | First variations of OT values; two intentional alias labels | Pass |
| E30 | Definition | 1910--1920 | Regularized inverse-OT loss; `def-inverse-ot-loss` | CH12-009 |
| E31 | Proposition | 1924--1932 | Convexity and calibration of inverse-OT loss; `prop-inverse-ot-convex` | CH12-009 |
| E32 | Definition | 2015--2027 | Barycentric projection of a coupling; `def-barycentric-projection` | Pass |
| E33 | Proposition | 2037--2043 | Barycentric projection of a quadratic optimal plan; `prop-barycentric-projection-optimal` | Pass |
| E34 | Remark | 2058--2062 | Barycentric projection appears everywhere; `rem-barycentric-projection-everywhere` | Pass |
| E35 | Definition | 2074--2083 | Weak optimal transport; `def-weak-optimal-transport` | Pass |
| E36 | Proposition | 2087--2112 | Weak Kantorovich duality; `prop-weak-ot-duality` | Pass |
| E37 | Proposition | 2135--2152 | Barycentric weak transport is weaker than W2; `prop-barycentric-weak-ot` | Pass |
| E38 | Definition | 2227--2240 | Martingale couplings and martingale OT; `def-martingale-coupling` | Pass |
| E39 | Remark | 2242--2250 | Zero barycentric cost and martingale feasibility; `rem-weak-ot-martingale-feasibility` | Pass |
| E40 | Definition | 2272--2280 | Classical stochastic order; `def-classical-stochastic-order` | Pass |
| E41 | Proposition | 2282--2285 | Strassen theorem for stochastic order; `prop-strassen-stochastic-order` | Pass |
| E42 | Definition | 2294--2298 | Convex order; `def-convex-order` | Pass |
| E43 | Theorem | 2303--2309 | Strassen martingale theorem; `thm-strassen-martingale` | Pass |
| E44 | Proposition | 2341--2351 | Brenier--Strassen projection formula; `prop-brenier-strassen-projection` | Pass |

### Proof matrix

| ID | Lines | Result proved | Independent disposition |
|---|---:|---|---|
| P01 | 134--159 | E04, two-measure geodesic characterization | Pass: triangle inequality and equality case re-derived |
| P02 | 210--236 | E06, barycenter mean and support | Pass: variance decomposition and convex-hull projection re-derived |
| P03 | 258--270 | E07, quantile barycenter | Algebra correct after CH12-001 hypotheses/endpoint repair |
| P04 | 322--367 | E08, Gaussian barycenter | Pass: affine maps and covariance stationarity re-derived |
| P05 | 448--496 | E10, damped Gaussian iteration | Pass: descent, determinant barrier, compactness, stationarity checked |
| P06 | 664--703 | E12, entropic barycenter dual | Pass: signs, constants, gauge and geometric-mean elimination checked |
| P07 | 802--842 | E14, barycenter LLN | Pass under compactness: uniform convergence and argmin argument checked |
| P08 | 960--982 | E15, Radon pseudoinverse | Pass: Fourier-slice and signed-polar constants checked |
| P09 | 1083--1099 | E18, splitting-set twist Monge structure | Pass under explicitly assumed dual attainment/differentiability |
| P10 | 1184--1188 | E20, cyclic co-motion plan | Pass: every coordinate marginal is the invariant law |
| P11 | 1241--1256 | E21, multimarginal barycenter equivalence | Pass: pointwise variance identity and gluing checked |
| P12 | 1275--1288 | E22, sparse discrete barycenter | Pass: LP support count and push-forward support bound checked |
| P13 | 1506--1516 | E26, nonnegative-rank factorization | Pass: dimensions, marginals, zero components, converse checked |
| P14 | 1655--1672 | E28, capped-polytope feasibility | Pass: necessity and max-flow/min-cut sufficiency checked |
| P15 | 1834--1844 | E29, OT first variations | Pass: Danskin/envelope directional derivatives checked |
| P16 | 1934--1936 | E31, inverse-loss convexity/calibration | Algebra passes on a proper finite domain; missing domain/attainment hypotheses are CH12-009 |
| P17 | 2045--2056 | E33, barycentric projection optimality | Pass: expected cyclic-monotonicity inequality checked |
| P18 | 2114--2129 | E36, weak duality | Pass: lifted-kernel relaxation and Jensen collapse checked |
| P19 | 2154--2160 | E37, weak cost below W2 | Pass: conditional Jensen inequality checked |
| P20 | 2287--2289 | E41, stochastic Strassen statement | Pass as a cited classical result |
| P21 | 2311--2337 | E43, martingale Strassen theorem | Pass: necessity and compact convex separation proof checked |
| P22 | 2353--2379 | E44, Brenier--Strassen projection | Pass: lower bound, convex order, and gluing upper bound checked |

### Equation and display matrix

The matrix counts each of 104 `\\[...\\]` displays, 31 `equation` environments, five `align` environments, 13 `\\eql` macro displays, and five `\\eqllead` macro displays: **158 total**. A label of `-` means intentionally unnumbered. A defect marker identifies the root issue; it does not create an additional defect count.

| ID | Start line | Form | Structural unit | Label(s) | Disposition |
|---|---:|---|---|---|---|
| D001 | 26 | eql | S03 | `eq-barycenter-generic` | Pass |
| D002 | 41 | bracket | S04 | `-` | Pass |
| D003 | 46 | bracket | S04 | `-` | Pass |
| D004 | 57 | eql | S04 | `eq-wass-discr` | Pass |
| D005 | 67 | bracket | S04 | `-` | Pass |
| D006 | 85 | bracket | S04 | `-` | Pass |
| D007 | 91 | bracket | S04 | `-` | Pass |
| D008 | 95 | bracket | S04 | `-` | Pass |
| D009 | 101 | bracket | S04 | `-` | Pass |
| D010 | 117 | bracket | S04 | `-` | Pass |
| D011 | 121 | bracket | S04 | `-` | Pass |
| D012 | 127 | bracket | S04 | `-` | Pass |
| D013 | 136 | bracket | S04 | `-` | Pass |
| D014 | 144 | bracket | S04 | `-` | Pass |
| D015 | 150 | bracket | S04 | `-` | Pass |
| D016 | 193 | bracket | S04 | `-` | Pass |
| D017 | 202 | bracket | S04 | `-` | Pass |
| D018 | 212 | bracket | S04 | `-` | Pass |
| D019 | 222 | bracket | S04 | `-` | Pass |
| D020 | 228 | bracket | S04 | `-` | Pass |
| D021 | 250 | bracket | S05 | `-` | CH12-001 |
| D022 | 260 | bracket | S05 | `-` | Pass |
| D023 | 282 | bracket | S06 | `-` | Pass |
| D024 | 287 | eql | S06 | `eq-gaussian-barycenter-energy` | Pass |
| D025 | 293 | align | S06 | `eq-gaussian-barycenter-maps, eq-gaussian-barycenter-average-map` | Pass |
| D026 | 313 | eql | S06 | `eq-gaussian-barycenter-fixed-point` | Pass |
| D027 | 324 | bracket | S06 | `-` | Pass |
| D028 | 334 | bracket | S06 | `-` | Pass |
| D029 | 344 | bracket | S06 | `-` | Pass |
| D030 | 350 | bracket | S06 | `-` | Pass |
| D031 | 355 | eqllead | S06 | `eq-gaussian-barycenter-first-variation` | Pass |
| D032 | 361 | bracket | S06 | `-` | Pass |
| D033 | 375 | bracket | S06 | `-` | Pass |
| D034 | 382 | bracket | S06 | `-` | Pass |
| D035 | 396 | bracket | S06 | `-` | Pass |
| D036 | 400 | eql | S06 | `eq-gaussian-barycenter-transport-update` | Pass |
| D037 | 408 | bracket | S06 | `-` | Pass |
| D038 | 413 | eqllead | S06 | `eq-gaussian-barycenter-damped-update` | Pass |
| D039 | 424 | bracket | S06 | `-` | Pass |
| D040 | 428 | bracket | S06 | `-` | Pass |
| D041 | 433 | eqllead | S06 | `eq-gaussian-barycenter-descent` | Pass |
| D042 | 441 | bracket | S06 | `-` | Pass |
| D043 | 450 | align | S06 | `-` | Pass |
| D044 | 464 | bracket | S06 | `-` | Pass |
| D045 | 470 | align | S06 | `-` | Pass |
| D046 | 488 | bracket | S06 | `-` | Pass |
| D047 | 500 | bracket | S06 | `-` | Pass |
| D048 | 537 | eql | S07 | `eq-entropic-bary` | Objective and convexity pass; the following global smoothness claim is CH12-010 |
| D049 | 546 | eql | S07 | `eq-bary-entropy-couplings` | Pass |
| D050 | 557 | bracket | S07 | `-` | Pass |
| D051 | 563 | eql | S07 | `eq-bary-opt` | Pass |
| D052 | 568 | align | S07 | `eq-sinkhorn-bary, eq-sinkhorn-bary-2, eq-sinkhorn-bary-3` | Pass |
| D053 | 623 | bracket | S07 | `-` | Pass |
| D054 | 629 | bracket | S07 | `-` | Pass |
| D055 | 649 | eql | S07 | `eq-dual-bary-entropy` | Pass |
| D056 | 666 | align | S07 | `-` | Pass |
| D057 | 678 | bracket | S07 | `-` | Pass |
| D058 | 689 | eqllead | S07 | `eq-legendre-kl-bary` | Pass |
| D059 | 695 | bracket | S07 | `-` | Pass |
| D060 | 716 | eql | S08 | `eq-doubly-regularized-entropic-barycenter` | Pass |
| D061 | 732 | equation | S08 | `eq-doubly-regularized-barycenter-cancellation` | Pass |
| D062 | 747 | bracket | S09 | `-` | Pass |
| D063 | 754 | bracket | S09 | `-` | Pass |
| D064 | 761 | bracket | S09 | `-` | Pass |
| D065 | 781 | bracket | S09 | `-` | Pass |
| D066 | 788 | equation | S09 | `eq-wow-empirical-law-lln` | Pass |
| D067 | 794 | eql | S09 | `eq-wow-population-barycenter-lln` | Pass |
| D068 | 804 | bracket | S09 | `-` | Pass |
| D069 | 814 | bracket | S09 | `-` | Pass |
| D070 | 832 | bracket | S09 | `-` | Pass |
| D071 | 871 | bracket | S11 | `-` | Pass |
| D072 | 882 | bracket | S11 | `-` | Pass |
| D073 | 892 | bracket | S11 | `-` | CH12-001 |
| D074 | 899 | equation | S11 | `eq-radon-barycenter-quantile-field` | Pass |
| D075 | 918 | equation | S11 | `eq-radon-sinogram-fourier` | Pass |
| D076 | 934 | bracket | S11 | `-` | Pass |
| D077 | 940 | equation | S11 | `eq-radon-least-squares` | Pass |
| D078 | 947 | equation | S11 | `eq-radon-pseudoinverse` | Pass |
| D079 | 962 | bracket | S11 | `-` | Pass |
| D080 | 971 | eqllead | S11 | `eq-radon-fourier-slice` | Pass |
| D081 | 978 | equation | S11 | `eq-radon-pseudoinverse-fourier` | Pass |
| D082 | 985 | equation | S11 | `eq-radon-windowed-ramp` | Pass |
| D083 | 999 | equation | S11 | `eq-radon-display-reconstruction` | Pass |
| D084 | 1035 | equation | S13 | `eq-multimarginal-ot` | Pass |
| D085 | 1056 | bracket | S14 | `-` | Pass |
| D086 | 1060 | bracket | S14 | `-` | Pass |
| D087 | 1074 | bracket | S14 | `-` | Pass |
| D088 | 1085 | bracket | S14 | `-` | Pass |
| D089 | 1089 | bracket | S14 | `-` | Pass |
| D090 | 1093 | bracket | S14 | `-` | Pass |
| D091 | 1105 | bracket | S14 | `-` | Pass |
| D092 | 1111 | bracket | S14 | `-` | Pass |
| D093 | 1125 | bracket | S15 | `-` | Pass |
| D094 | 1131 | bracket | S15 | `-` | Pass |
| D095 | 1140 | bracket | S15 | `-` | Pass |
| D096 | 1151 | bracket | S15 | `-` | Pass |
| D097 | 1166 | bracket | S15 | `-` | Pass |
| D098 | 1170 | bracket | S15 | `-` | Pass |
| D099 | 1174 | bracket | S15 | `-` | Pass |
| D100 | 1220 | bracket | S16 | `-` | Pass |
| D101 | 1231 | bracket | S16 | `-` | Pass |
| D102 | 1244 | bracket | S16 | `-` | Pass |
| D103 | 1261 | bracket | S16 | `-` | Pass |
| D104 | 1266 | bracket | S16 | `-` | Pass |
| D105 | 1298 | bracket | S17 | `-` | CH12-004 |
| D106 | 1303 | bracket | S17 | `-` | CH12-004 |
| D107 | 1315 | equation | S18 | `eq-multimarginal-graph-cost` | Pass |
| D108 | 1355 | bracket | S19 | `-` | Pass |
| D109 | 1365 | equation | S19 | `eq-multimarginal-graph-factorization` | Pass |
| D110 | 1372 | equation | S19 | `eq-multimarginal-tree-message` | Pass |
| D111 | 1381 | equation | S19 | `eq-multimarginal-tree-marginal` | Pass |
| D112 | 1392 | equation | S19 | `eq-multimarginal-junction-message` | Pass |
| D113 | 1401 | equation | S19 | `eq-multimarginal-junction-belief` | Pass |
| D114 | 1484 | equation | S20 | `eq-low-rank-coupling-factor` | Pass |
| D115 | 1508 | bracket | S20 | `-` | Pass |
| D116 | 1519 | bracket | S20 | `-` | Pass |
| D117 | 1525 | equation | S20 | `eq-low-rank-entropic-ot` | Pass |
| D118 | 1611 | equation | S21 | `eq-capacity-constrained-ot` | Pass |
| D119 | 1630 | equation | S21 | `eq-discrete-capacity-constrained-ot` | Pass |
| D120 | 1648 | equation | S21 | `eq-capacity-cut-condition` | Pass |
| D121 | 1657 | bracket | S21 | `-` | Pass |
| D122 | 1675 | equation | S21 | `eq-entropic-capacity-constrained-ot` | Pass |
| D123 | 1803 | bracket | S24 | `-` | Pass |
| D124 | 1811 | bracket | S24 | `-` | Pass |
| D125 | 1819 | bracket | S24 | `-` | Pass |
| D126 | 1827 | bracket | S24 | `-` | Pass |
| D127 | 1847 | bracket | S24 | `-` | Pass |
| D128 | 1857 | bracket | S24 | `-` | CH12-009 |
| D129 | 1863 | bracket | S24 | `-` | CH12-009 |
| D130 | 1871 | bracket | S24 | `-` | CH12-009 |
| D131 | 1912 | eql | S25 | `eq-inverse-ot-loss` | CH12-009 |
| D132 | 1926 | bracket | S25 | `-` | CH12-009 |
| D133 | 1941 | bracket | S26 | `-` | CH12-009 |
| D134 | 1946 | eql | S26 | `eq-inverse-ot-bilinear-estimator` | CH12-009 |
| D135 | 1974 | bracket | S27 | `-` | Pass |
| D136 | 1994 | bracket | S28 | `-` | Pass |
| D137 | 2018 | equation | S30 | `eq-barycentric-projection` | Pass |
| D138 | 2029 | bracket | S30 | `-` | CH12-006 |
| D139 | 2077 | equation | S31 | `eq-weak-ot` | Pass |
| D140 | 2094 | bracket | S31 | `-` | Pass |
| D141 | 2103 | bracket | S31 | `-` | Pass |
| D142 | 2138 | bracket | S31 | `-` | Pass |
| D143 | 2144 | equation | S31 | `eq-barycentric-weak-primal` | Pass |
| D144 | 2163 | equation | S31 | `eq-barycentric-weak-discrete` | CH12-006 |
| D145 | 2171 | equation | S31 | `eq-barycentric-weak-linearized-cost` | Pass |
| D146 | 2177 | bracket | S31 | `-` | Pass |
| D147 | 2184 | equation | S31 | `eq-barycentric-weak-entropic-fixed-point` | Pass |
| D148 | 2230 | equation | S32 | `eq-martingale-coupling` | Pass |
| D149 | 2235 | bracket | S32 | `-` | Pass |
| D150 | 2244 | equation | S32 | `eq-weak-zero-iff-martingale` | Pass |
| D151 | 2256 | bracket | S32 | `-` | Pass |
| D152 | 2274 | bracket | S33 | `-` | Pass |
| D153 | 2317 | bracket | S34 | `-` | Pass |
| D154 | 2329 | bracket | S34 | `-` | Pass |
| D155 | 2345 | equation | S34 | `eq-brenier-strassen-projection` | Pass |
| D156 | 2357 | bracket | S34 | `-` | Pass |
| D157 | 2369 | bracket | S34 | `-` | Pass |
| D158 | 2387 | bracket | S34 | `-` | Pass |

### Algorithm matrix

| ID | Lines | Algorithm | Formula, assumptions, and complexity disposition |
|---|---:|---|---|
| A01 | 589--619 | `alg:entropic-barycenter-sinkhorn` | Pass. Finite costs and positive targets make every kernel/scaling positive. Column scaling, weighted geometric row marginal, and row scaling reproduce the three equations grouped in D052 (`eq-sinkhorn-bary` through `eq-sinkhorn-bary-3`). Residual checks both marginals. Dense work per outer sweep is $O(\sum_s nn_s)$ and storage is of the same kernel order. |
| A02 | 1434--1461 | `alg:multimarginal-sinkhorn` | Pass in its stated finite positive discrete regime. Dividing one scaling by the current marginal is the exact KL projection. A naive contraction costs/stores $\prod_s n_s$; the preceding junction-tree messages reduce a marginal contraction to the stated treewidth-dependent cost. CH12-004 concerns the earlier unrestricted continuous prose, not this algorithm. |
| A03 | 1539--1570 | `alg-low-rank-sinkhorn-fixed-g` | Pass. $Q\in\mathbb R_+^{n\times r}$ and $R\in\mathbb R_+^{m\times r}$ have the stated row/column marginals; differentiating the bilinear term gives effective costs $CR\operatorname{diag}(g)^{-1}$ and $C^TQ\operatorname{diag}(g)^{-1}$. Each inner scaling step is $O(nr)$ or $O(mr)$, but dense effective-cost formation is correctly disclosed as $O(nmr)$ per block. Exact block minimization only guarantees stationary accumulation points, not a global rank-$r$ optimum. |
| A04 | 1688--1729 | `alg-capacity-constrained-sinkhorn` | Pass. The three KL projections are row scaling, column scaling, and entrywise clipping; Dykstra factors use the correct old-projectand/new-projectand ratio. Restriction to positive-capacity edges prevents finite-iterate zero divisions. Bregman--Censor--Reich Theorem 3.1 applies because all component sets are polyhedral and each separately meets the positive orthant, even if their feasible intersection is boundary-only. A dense sweep is $O(nm)$ time and $O(nm)$ storage; sparse active-edge implementation is $O(\lvert E\rvert)$. |

### Figure and generator matrix

Each figure has one uniquely matched notebook in `notebooks-figures/`. All sources and retained outputs were inspected. No notebook or asset was executed or modified; two bounded in-memory reproductions were used only to quantify F02 convergence and F12 LP residual scaling.

| ID | TeX lines / label | Generator | Claim-level disposition |
|---|---|---|---|
| F01 | 168--183; `fig:barycenters-four-shapes` | `barycenters-four-shapes.ipynb` | Mathematical content passes. The one-dimensional panel uses weighted quantiles and the two-dimensional panel solves the advertised fixed-support construction; endpoints are display samples only. The current `image_density` cell is unexecuted in retained metadata, contributing to CH12-005's provenance limitation. |
| F02 | 512--524; `fig:barycenters-gaussian-covariances` | `barycenters-gaussian-covariances.ipynb` | Pass with numerical qualification. POT 0.9.6.post1 emits 17 non-convergence warnings for the 25 strongly anisotropic cells at 150 iterations and tolerance $10^{-12}$, but the worst covariance differs from a 20,000-iteration reference by only $2.37\times10^{-6}$ relatively. No accuracy is claimed in the caption, and this is visually immaterial. |
| F03 | 1012--1017; `fig:sliced-radon-barycenter` | `sliced-radon-barycenter.ipynb` | CH12-002: effective window, data-dependent floor, and final display convolution are not fully disclosed. Its current `normalize_projection` and `sinogram_from_quantiles` cells are also unexecuted in retained metadata (CH12-005). |
| F04 | 1197--1211; `fig:multimarginal-coulomb-sinkhorn` | `multimarginal-coulomb-sinkhorn.ipynb` | CH12-003. The third generated tensor uses $\epsilon=2.00$, not the captioned $0.50$. Retained marginal errors are otherwise below $5\times10^{-10}$. |
| F05 | 1577--1596; `fig:low-rank-ot-factorization` | `low-rank-ot-factorization.ipynb` | Pass. Shapes and latent dimensions agree. Recorded transport costs for the displayed sequence decrease toward the full-plan cost in this example; the caption correctly avoids a theorem-level monotonic approximation claim. |
| F06 | 1735--1750; `fig:capacity-constrained-ot-1d` | `capacity-constrained-ot-1d.ipynb` | Pass. The three density-ratio caps are $+\infty,10,2.6$; row/column feasibility and cap saturation are computed consistently with the caption. |
| F07 | 1754--1769; `fig:capacity-constrained-ot-2d` | `capacity-constrained-ot-2d.ipynb` | CH12-005. Current source requests $q=1,3,5$, retained output records $q=2,3,5$, its $q=3$ run misses tolerance, and the current Dykstra function cell is unexecuted. Asset times are compatible with later regeneration, so no false `cap-1.pdf` claim is established. |
| F08 | 1882--1894; `fig:metric-learning-cost-deformation` | `metric-learning-cost-deformation.ipynb` | Pass. The same point clouds are used with three positive-definite Mahalanobis matrices; ellipse axes and segment assignments use the same matrices and cost convention. |
| F09 | 1953--1970; `fig:inverse-ot-forward-logo` | `inverse-ot-bilinear-logo-map.ipynb` | Pass. The four $A$ matrices, tie-breaking $\delta=10^{-3}$, and assignment objective match the labels; $A=-I$ differs from squared W2 only by marginal gauges. |
| F10 | 1979--1988; `fig:inverse-ot-gap-loss` | `inverse-ot-gap-loss.ipynb` | Pass. Current code and outputs use $n=10$ and $n=200$, compute the unregularized assignment gap along $A_t$, and produce convex piecewise-affine finite-sample curves. Numerical clipping at zero only removes solver roundoff. |
| F11 | 2197--2211; `fig:weak-ot-barycentric-projection` | `weak-ot-barycentric-projection.ipynb` | Pass. The ordinary OT plan, its row barycenters, and the weak optimum are distinct objects as captioned. The weak quadratic program is solved by a conditional-gradient method with exact quadratic line search and checked marginal feasibility. |
| F12 | 2399--2414; `fig:martingale-ot-centered-kernels` | `martingale-ot-centered-kernels.ipynb` | CH12-007 (Minor). Default absolute LP tolerance accepts raw residual $9.08\times10^{-8}$; a $1.00\times10^{-6}$ row amplifies it to conditional error $0.0905$. Material rows above $10^{-5}$ are centered to machine precision, but the unqualified all-positive-row caption is not numerically certified. |

### Notebook execution-provenance matrix

No notebook was edited or executed in place. Execution counts and retained outputs were read directly. The abbreviated hashes identify the exact notebooks audited. A null bootstrap cell is a provenance gap but not by itself a mathematical defect; a null current core-computation cell is stronger evidence and is linked to CH12-005.

| Figure | Notebook SHA-256 prefix | Code cells / retained execution counts | Provenance conclusion |
|---|---|---|---|
| F01 | `387cb8224db4` | 6 / `[null,1,2,null,3,4]` | Current core `image_density` cell is null while later output is retained; mathematics visually/coherently passes, provenance incomplete. |
| F02 | `fdc245c7bb01` | 4 / `[null,1,2,3]` | Bootstrap null; computation retained. Seventeen POT `Dit not converge.` warnings quantified below; visual values remain accurate. |
| F03 | `7e470d9b59ee` | 8 / `[null,1,2,null,null,3,4,5]` | Current `normalize_projection` and `sinogram_from_quantiles` cells are null; later output retained. Separate operator mismatch is CH12-002. |
| F04 | `5d02f0149375` | 5 / `[null,1,2,3,4]` | Bootstrap null; numerical solve retained. Output explicitly records $\epsilon=2.00$ (CH12-003). |
| F05 | `b9e45c08d23d` | 8 / `[1,2,3,4,5,6,7,8]` | Clean monotone retained execution; pass. |
| F06 | `12307720fae2` | 5 / `[null,1,2,3,4]` | Bootstrap null; current computation retained; pass. |
| F07 | `15745dd29968` | 6 / `[null,1,null,2,3,4]` | Current Dykstra function null; stale $(2,3,5)$ output and failed $q=3$ tolerance; CH12-005. |
| F08 | `c9c18be2e9c8` | 5 / `[null,1,2,3,4]` | Bootstrap null; current computation retained; pass. |
| F09 | `b64367fce22d` | 6 / `[null,1,2,3,4,5]` | Bootstrap null; current computation retained; pass. |
| F10 | `e9c88b60681c` | 9 / `[1,2,3,4,5,6,7,8,9]` | Clean monotone retained execution; pass. |
| F11 | `089a6730f9e4` | 6 / `[1,2,3,4,5,6]` | Clean monotone retained execution; pass. |
| F12 | `56c4fd143f6e` | 5 / `[null,1,2,3,4]` | Bootstrap null; current LP retained. Conditional residual warning is CH12-007. |

### Read-only numerical diagnostics

Only lightweight in-memory diagnostics were recomputed; no notebook or asset was rewritten.

| Object | Diagnostic | Result |
|---|---|---|
| Gaussian F02, moderate grid | 25 cells against long iteration | All converged; maximum covariance discrepancy $2.77\times10^{-12}$. |
| Gaussian F02, anisotropic grid | Retained 150-iteration runs versus up to 20,000 iterations | 17/25 retained runs warn; worst fixed-point residual $2.68\times10^{-7}$, stationarity residual $2.51\times10^{-7}$, covariance discrepancy $4.05\times10^{-6}$ absolute and $2.36\times10^{-6}$ relative, objective discrepancy $4.78\times10^{-12}$. Warning is real provenance evidence but not a materially inaccurate panel. |
| Coulomb F04 | Retained solver diagnostics | $(\epsilon,\text{iterations},\text{tensor error})=(0.06,550,4.72\times10^{-10}),(0.16,250,1.39\times10^{-10}),(2.00,25,2.32\times10^{-11})$. Confirms CH12-003 and otherwise good marginal accuracy. |
| Capacity F07 | Retained output | Reports $q=(2,3,5)$; residuals $5.97\times10^{-8},2.01\times10^{-7},5.91\times10^{-8}$, with the middle run exhausted at 90,000 iterations against tolerance $6\times10^{-8}$. |
| Martingale F12 | Re-solved finite LP with SciPy/HiGHS | Solver success. Maximum full equality residual $9.08\times10^{-8}$; row $8.72\times10^{-8}$; column $6.08\times10^{-8}$; raw martingale $9.08\times10^{-8}$. The offending row has $a_i=1.0027\times10^{-6}$ and conditional error $0.09054$; all rows with $a_i>10^{-5}$ are centered to $4.5\times10^{-16}$. Weighted $L^1$ conditional defect is $9.08\times10^{-8}$ and weighted RMS defect $9.07\times10^{-5}$. |

### Included-asset manifest

All 37 `includegraphics` targets exist. Sizes are bytes; hashes are SHA-256 prefixes. These files were read only.

| Figure | Included asset under `OT4ML/` | Bytes | SHA-256 prefix |
|---|---|---:|---|
| F01 | `figures/barycenters-four-shapes/quantile-grid.pdf` | 43,095 | `c06561bdc67e` |
| F01 | `figures/barycenters-four-shapes/shape-grid.pdf` | 85,395 | `4195463a016d` |
| F02 | `figures/barycenters-gaussian-covariances/moderate-grid.pdf` | 8,931 | `9d4c4a94d73a` |
| F02 | `figures/barycenters-gaussian-covariances/anisotropic-grid.pdf` | 8,906 | `e0276ce309e2` |
| F03 | `figures/sliced-radon-barycenter/grid.pdf` | 182,382 | `9047a078c6a3` |
| F04 | `figures/multimarginal-coulomb-sinkhorn/epsilon-small.pdf` | 11,053 | `13d76e0c2b61` |
| F04 | `figures/multimarginal-coulomb-sinkhorn/epsilon-medium.pdf` | 11,569 | `f1522840ae48` |
| F04 | `figures/multimarginal-coulomb-sinkhorn/epsilon-large.pdf` | 13,684 | `5987d1704f65` |
| F05 | `figures/low-rank-ot-factorization/factor-view-r4.pdf` | 16,149 | `fe974bede263` |
| F05 | `figures/low-rank-ot-factorization/full.pdf` | 5,295 | `7c45cdabcfd8` |
| F05 | `figures/low-rank-ot-factorization/rank-2.pdf` | 6,329 | `87a0f63117f9` |
| F05 | `figures/low-rank-ot-factorization/rank-4.pdf` | 5,961 | `71913461a953` |
| F05 | `figures/low-rank-ot-factorization/rank-8.pdf` | 5,855 | `ab4c30b4a203` |
| F05 | `figures/low-rank-ot-factorization/rank-16.pdf` | 6,064 | `6a47139c755d` |
| F06 | `figures/capacity-constrained-ot-1d/large.pdf` | 6,729 | `0d5067efe234` |
| F06 | `figures/capacity-constrained-ot-1d/medium.pdf` | 6,875 | `415dbecc5f5a` |
| F06 | `figures/capacity-constrained-ot-1d/small.pdf` | 8,365 | `f21a92194299` |
| F07 | `figures/capacity-constrained-ot-2d/cap-1.pdf` | 23,602 | `4a23ecc77706` |
| F07 | `figures/capacity-constrained-ot-2d/cap-3.pdf` | 36,205 | `f64705207c70` |
| F07 | `figures/capacity-constrained-ot-2d/cap-5.pdf` | 52,173 | `9a2c551408f0` |
| F08 | `figures/metric-learning-cost-deformation/euclidean.pdf` | 13,266 | `2830e807e0c5` |
| F08 | `figures/metric-learning-cost-deformation/moderate.pdf` | 13,378 | `7e7ec62d0d90` |
| F08 | `figures/metric-learning-cost-deformation/strong.pdf` | 13,409 | `abc6b89c3ad9` |
| F09 | `figures/inverse-ot-bilinear-logo-map/horizontal.pdf` | 4,257 | `d34272707bce` |
| F09 | `figures/inverse-ot-bilinear-logo-map/vertical.pdf` | 4,255 | `59f77445cbe9` |
| F09 | `figures/inverse-ot-bilinear-logo-map/w2.pdf` | 4,246 | `61e2baaf3baa` |
| F09 | `figures/inverse-ot-bilinear-logo-map/anti.pdf` | 4,240 | `af104be377fc` |
| F10 | `figures/inverse-ot-gap-loss/observed-map-n10.pdf` | 122,325 | `8057efa0ff11` |
| F10 | `figures/inverse-ot-gap-loss/gap-loss-n10.pdf` | 22,771 | `7340df4a3a98` |
| F10 | `figures/inverse-ot-gap-loss/gap-loss-n200.pdf` | 23,165 | `1168b4e9a9e5` |
| F11 | `figures/weak-ot-barycentric-projection/ot-coupling.pdf` | 14,670 | `e1f0ef91a2c9` |
| F11 | `figures/weak-ot-barycentric-projection/ot-barycentric-projection.pdf` | 15,112 | `18855da4489b` |
| F11 | `figures/weak-ot-barycentric-projection/weak-barycentric-projection.pdf` | 15,095 | `607f5fb382a2` |
| F12 | `figures/martingale-ot-centered-kernels/marginals.pdf` | 3,377 | `ab98efa9dc04` |
| F12 | `figures/martingale-ot-centered-kernels/generated-coupling.pdf` | 5,909 | `662e361e640f` |
| F12 | `figures/martingale-ot-centered-kernels/optimal-coupling.pdf` | 3,570 | `f4c13d36b681` |
| F12 | `figures/martingale-ot-centered-kernels/conditionals.pdf` | 5,411 | `5679f5517b87` |

The retained full-book artifact `OT4ML/OT4ML.pdf` has 480 pages, 28,795,528 bytes, SHA-256 prefix `0dce3eee377a`, and timestamp 2026-08-24 20:02:07 +0200. Its retained log has no undefined-reference, undefined-citation, or multiply-defined-label warning. This was existing evidence, not a build performed by this audit.

## Delicate claims independently validated

The entries below record claims that were re-derived rather than accepted from their names, proofs, or citations. `Pass` means the exact formula and its stated scope are coherent; qualifications shown here are already present in the manuscript unless linked to an issue.

| ID | Lines | Claim checked | Independent check and conclusion |
|---|---:|---|---|
| V01 | 23--36 | Continuous OT barycenter definition, existence, convexity, uniqueness | With inputs in $\mathcal P_2$, lower semicontinuity and coercivity give existence; mixing optimal couplings proves convexity in the candidate law. Absolute continuity of a positive-weight input supplies strict displacement convexity/uniqueness in the stated Euclidean quadratic setting. Pass. |
| V02 | 52--78 | Fixed-support discrete barycenter | The feasible matrices have row marginal $a$ and target marginal $b_s$; optimizing over $a\in\Delta_n$ is a genuine restriction of the free-support problem and remains convex. Dimensions are $P_s\in\mathbb R^{n\times n_s}$. Pass. |
| V03 | 80--109 | Fair score repair | In one dimension the common distribution minimizing weighted squared displacement has averaged quantile. Pushing each group score through its CDF then that quantile equalizes score laws, subject to the manuscript's density/monotone-map assumptions. Pass modulo CH12-001's general theorem hypothesis. |
| V04 | 113--159 | Two-measure barycenters and geodesics | Writing $a=W_2(\alpha,\beta_0)$, $b=W_2(\alpha,\beta_1)$ gives $(1-t)a^2+tb^2\ge t(1-t)(a+b)^2\ge t(1-t)W_2^2(\beta_0,\beta_1)$. Equality requires $a=tW_2$ and $b=(1-t)W_2$, exactly constant-speed geodesic position. Pass. |
| V05 | 187--236 | Mean and support of quadratic barycenters | The identity $\int\lvert x-y\rvert^2d\pi=\lvert m_\alpha-m_\beta\rvert^2+\int\lvert(x-m_\alpha)-(y-m_\beta)\rvert^2d\pi$ yields the weighted mean. Projecting a candidate point onto the closed convex hull of all input supports cannot increase any squared distance and is strict outside it. Pass. |
| V06 | 245--270 | Quantile formula | Completing the square gives the weighted quantile exactly when the problem has a finite candidate, equivalently when all positive-weight quantile differences are in $L^2$. Individual $\mathcal P_2$ membership is sufficient but not necessary. Proposition endpoints already pass; the missing condition is CH12-001. |
| V07 | 280--367 | Gaussian barycenter and fixed point | Gelbrich projection reduces to Gaussians. Differentiating $\operatorname{tr}(X^{1/2}\Sigma_sX^{1/2})^{1/2}$ gives $\tfrac12\operatorname{tr}(T_s(X)Z)$, hence $D\mathcal E(X)[Z]=\operatorname{tr}((I-\bar T(X))Z)$. Since $\Psi(X)=X^{1/2}\bar T(X)X^{1/2}$, the two stationarity equations are equivalent. Pass. |
| V08 | 371--393 | Forward-KL Gaussian barycenter | $\sum_s\lambda_s\mathrm{KL}(\alpha\mid\beta_s)$ equals KL to the normalized geometric mean plus a constant. Completing the Gaussian exponent gives precision $\sum_s\lambda_s\Sigma_s^{-1}$ and precision-weighted mean. The reverse direction gives a mixture, as stated. Pass. |
| V09 | 395--496 | Gaussian transport update, descent, and convergence | Pushing $N(0,X)$ by $B_\eta=(1-\eta)I+\eta\bar T$ gives $B_\eta XB_\eta$. Euclidean variance decomposition yields the coefficient $\eta(2-\eta)$. Minkowski's determinant inequality gives a positive determinant floor and the Bures trace bound gives compactness; vanishing residual forces the unique fixed point. Pass for $\eta\in(0,1]$. |
| V10 | 498--508 | One-dimensional Picard limiting case | For variance $r$, $\Psi(r)=c\sqrt r$ while $K_\eta(r)=((1-\eta)\sqrt r+\eta c)^2$; $\eta=1$ reaches $c^2$ in one step. Pass. |
| V11 | 535--587 | Entropic barycenter as weighted KL projection | Expanding $\epsilon\mathrm{KL}(P_s\mid e^{-C_s/\epsilon})$ gives $\langle C_s,P_s\rangle-\epsilon H(P_s)$ plus mass constants. Eliminating the common row marginal in the dual gives its weighted geometric mean. The value is convex on the closed simplex and smooth on its relative interior, not globally smooth as claimed at line 541 (CH12-010). |
| V12 | 645--703 | Entropic barycenter dual | Lagrange minimization over $P_s$ gives $P_s=\exp((f_s\oplus g_s-C_s)/\epsilon)$ and the constraint $\sum_s\lambda_sf_s=0$. The manuscript's dual signs and $\epsilon$ constants agree with the entropy-only convention. Pass. |
| V13 | 708--739 | Doubly regularized epsilon/tau cancellation | Normalized EOT equals entropy-only EOT plus $\epsilon H(a)+\epsilon H(b)$, while $\tau\mathrm{KL}(a\mid g)=-\tau H(a)-\tau\langle a,\log g\rangle$. Thus the coefficient of $H(a)$ is $\epsilon-\tau$ and cancels for uniform $g$, $\tau=\epsilon$. The continuous small-$\epsilon$ coefficient $\tau-\epsilon/2$ is consistent with the cited expansion convention. Pass. |
| V14 | 741--847 | Laws over Wasserstein space and LLN | The population objective is an expectation of $\mathrm{MK}_c$ (specializing to $W_2^2$ for quadratic cost), and the empirical law produces the finite barycenter objective. On compact $\Omega$ with continuous $c$, $(\alpha,\beta)\mapsto\mathrm{MK}_c(\alpha,\beta)$ is bounded and continuous; compactness gives an equicontinuous objective class, uniform convergence, and the standard argmin conclusion. Pass. |
| V15 | 848--861 | CLT scope | The text does not claim a general Wasserstein-space CLT; it explicitly limits known results to one-dimensional non-atomic laws and finite nondegenerate Gaussian laws, with tangent/covariance nondegeneracy. This matches the cited primary result's scope. Pass. |
| V16 | 862--982 | Sliced/Radon consistency and pseudoinverse | Directionwise quantile averages need not satisfy Radon range conditions. With the stated Fourier convention, signed polar coordinates double-cover nonzero frequencies; antipodal averaging and $\lvert S^{d-1}\rvert/[2(2\pi)^d]$ are correct. Pass apart from CH12-001's finite-value/domain qualification. |
| V17 | 1029--1044 | Multimarginal primal convention | The feasible set fixes all coordinate marginals and the objective is linear in the joint law. A discrete tensor has $\prod_s n_s$ entries. Pass; existence is not asserted in this definition. |
| V18 | 1054--1099 | Splitting-set twist and Monge structure | Equality on a dual contact/splitting set and differentiability in $x_1$ give $\nabla\varphi_1(x_1)=\nabla_{x_1}c(x_1,x_{2:S})$. Injectivity on the splitting set makes the remaining tuple unique, so disintegration over a non-atomic first marginal is graph-valued. Pass under the stated attainment/differentiability assumptions. |
| V19 | 1120--1195 | Coulomb scope and cyclic co-motion | $\nabla_{x_1}c= -\sum_{s>1}(x_1-x_s)/\lvert x_1-x_s\rvert^3$ for $1/\lvert x_r-x_s\rvert$, so the manuscript correctly warns that ordinary global twist fails and treats the cyclic plan only as feasible, not universally optimal. Measure-preserving cyclic shifts give every marginal $\rho$. Pass. |
| V20 | 1213--1288 | Multimarginal equivalence with barycenters and support bound | The pointwise identity $\sum_s\lambda_s\lvert x_s-\sum_r\lambda_rx_r\rvert^2=\sum_{r<s}\lambda_r\lambda_s\lvert x_r-x_s\rvert^2$ converts a joint plan to a barycenter competitor. Gluing optimal pair couplings gives the reverse inequality. A basic feasible joint tensor has at most $\sum_s n_s-S+1$ nonzeros, and its barycentric push-forward cannot have larger support. Pass. |
| V21 | 1311--1432 | Graph factorization, treewidth, and junction-tree contraction | The Gibbs kernel factorizes over edges. Variable elimination creates factors on separator bags; a width-$w$ decomposition with state size $n$ needs $O(Sn^{w+1})$ arithmetic and $O(Sn^w)$ message storage. The sum-product messages and root marginal normalization match the displayed contractions. Pass. |
| V22 | 1476--1516 | Low-rank dimensions, marginals, and converse | $Q\operatorname{diag}(g)^{-1}R^T$ is $n\times m$; summing uses $Q^T1_n=R^T1_m=g$. Conversely, from $P=UV^T$, setting $g_k=(1^TU_{:k})(1^TV_{:k})$ and rescaling columns reconstructs the required sub-couplings. Pass. |
| V23 | 1518--1575 | Fixed-$g$ entropy and nonconvex block updates | Relative entropies differ from negative matrix entropies only by marginal constants. Each block is strictly convex for positive marginals and has the stated effective cost; the joint bilinear term remains nonconvex. Exact cyclic updates decrease the objective and yield stationary accumulation points only. Pass. |
| V24 | 1608--1672 | Capacity endpoints, feasibility, and existence scope | $u=1$ forces density one; the $u=+\infty$ convention recovers arbitrary couplings. In the discrete model the cut inequality is necessary, and max-flow/min-cut proves sufficiency. The unregularized continuous section does not overclaim uniqueness. Pass. |
| V25 | 1674--1732 | Entropic capped projection | Pass. Expanding KL against $K_{ij}=a_ib_je^{-C_{ij}/\epsilon}$ gives the stated objective plus constants, and strict convexity on the feasible capped polytope gives uniqueness. The polyhedral-boundary Bregman-Dykstra theorem proves convergence under mere nonempty feasibility after zero-capacity edges are deleted. |
| V26 | 1752--1765 | Minimum connection count | If each entry is at most $1/(qn)$ and each uniform row sums to $1/n$, fewer than $q$ positive entries cannot carry the row mass. Pass mathematically; the generator provenance is CH12-005. |
| V27 | 1799--1844 | First variations for $\epsilon\ge0$ | The one-sided marginal derivative is the support function of the dual optimizer set; the cost derivative is the infimum over primal optimizers. Uniqueness reduces each support function to a linear derivative. Compact supports, continuous costs, feasible directions, and optimizer sets are stated. Pass. |
| V28 | 1846--1878 | Cost-parameter derivatives and bilinear example | On a finite proper domain, envelope differentiation gives $\int\partial_\theta c_\theta\,d\pi^*$. The orientation $\int yx^T d\pi^*$ and covariance decomposition are correct. Missing unbounded-domain moment/attainment assumptions are CH12-009. |
| V29 | 1899--1936 | Inverse-OT gauges and gap loss | Gauge identities, convexity, nonnegativity, and calibration are correct whenever both observed and forward objectives are finite and the infimum is attained. The definition omits that proper domain; CH12-009. |
| V30 | 1938--1977 | Bilinear estimator and finite-sample polyhedrality | $A\mapsto c_A$ is linear, so the gap loss remains convex on a convex gauge-fixed set. For fixed empirical marginals, the OT value is the minimum of finitely many affine assignment costs, making the negative value plus an affine term convex polyhedral. Pass. |
| V31 | 1990--1997 | Population curvature and $n^{-1/2}$ rate | Both claims are explicitly conditional. The curvature statement lists smooth positive densities, uniformly convex domains, invertible $A_0$, Hessian spanning, and excludes the scaling ray. The statistical rate includes fixed dimension, identifiability, nondegenerate certificate, positive $\epsilon$, and tuning caveats. Pass as scoped; see RQ12-004. |
| V32 | 2015--2056 | Barycentric projection | Finite first moment makes conditional means integrable almost everywhere. Taking expectations of quadratic cyclic-monotonicity inequalities preserves cyclic monotonicity of the projected graph, proving optimality to its own projected marginal. Pass, with zero-row notation repaired by CH12-006. |
| V33 | 2074--2129 | Convexity and duality of weak OT | Mixing couplings with a fixed first marginal mixes conditional kernels pointwise, so convexity in the second argument gives convexity in the coupling. Lifting kernels to laws on $\mathcal P(Y)$ and Jensen-collapsing their barycenters preserves the intensity constraint; Fenchel duality gives the displayed weak transform. Pass under compactness/lower-semicontinuity/finite-value assumptions. |
| V34 | 2135--2195 | Discrete quadratic weak OT and linearized cost | Conditional Jensen proves the weak value is at most $W_2^2$. Differentiating $\lvert x-\bar T_\pi(x)\rvert^2$ gives $2\langle x-\bar T_\pi(x),x-y\rangle$ up to a source gauge. Convexity makes the fixed-point first-order condition globally characterizing, while the warning that an undamped frozen-cost step need not descend is correct. Pass. |
| V35 | 2227--2259 | Martingale constraints and zero weak cost | $E[Y\mid X]=X$ is exactly identity barycentric projection. With attainment, nonnegative barycentric quadratic cost has value zero iff such a coupling exists. Equality of projected marginal alone is correctly identified as weaker than the pointwise martingale constraint. Pass. |
| V36 | 2264--2337 | Stochastic/convex orders and Strassen equivalences | Increasing-test stochastic order has the standard monotone-coupling characterization. Martingale Jensen proves convex-order necessity; compact separation via the concave envelope and the $W_1$ extension establish sufficiency with first moments. Pass. |
| V37 | 2341--2379 | Brenier--Strassen projection formula | Any weak coupling yields $\eta=\operatorname{Law}(E[Y\mid X])\preceq_{cx}\beta$ and a W2 lower bound. Conversely, glue an optimal $\alpha$-$\eta$ coupling with a martingale $\eta$-$\beta$ kernel and apply conditional Jensen. Both inequality directions and moment requirements are correct. Pass. |
| V38 | 2384--2392 | Gaussian convex order | If $\Sigma_1-\Sigma_0\succeq0$, independent centered Gaussian noise gives a martingale coupling. Conversely, monotone convex linear-growth approximations to $x\mapsto(u^Tx)^2$ yield $u^T(\Sigma_1-\Sigma_0)u\ge0$ for all $u$. The equivalence passes, but the omitted approximation is CH12-008. |

## Citation audit

The source contains **58 citation commands using 66 distinct keys**. Every current key resolves in `OT4ML/all.bib`; there are no misspellings or missing entries. Every use was checked for topical attribution, and claims materially depending on theorem scope, assumptions, constants, convergence, complexity, or novelty were checked against primary papers or official proceedings. The principal checks were: Wasserstein barycenters ([Agueh--Carlier](https://epubs.siam.org/doi/10.1137/100805741)); fixed-support computation ([Cuturi--Doucet](https://proceedings.mlr.press/v32/cuturi14.html)); Gaussian fixed points ([Alvarez-Esteban et al.](https://arxiv.org/abs/1511.05355)); doubly regularized barycenters ([Chizat](https://arxiv.org/abs/2303.11844)); the deliberately limited barycenter CLT ([Agueh--Carlier](https://www.numdam.org/item/10.1016/j.crma.2017.05.010.pdf)); multimarginal structure ([Pass](https://www.numdam.org/item/10.1051/m2an/2015020.pdf)); Coulomb counterexamples ([Colombo--Stra](https://arxiv.org/abs/1507.08522), [Bindini--De Pascale--Kausamo](https://arxiv.org/abs/2011.05063)); graphical MMOT ([Haasler et al.](https://arxiv.org/abs/2006.14113), [Fan et al.](https://arxiv.org/abs/2110.00627), [Altschuler--Boix-Adsera](https://arxiv.org/abs/2008.03006)); factored/low-rank OT ([Forrow et al.](https://proceedings.mlr.press/v89/forrow19a.html), [Scetbon--Cuturi--Peyre](https://proceedings.mlr.press/v139/scetbon21a.html)); capacity constraints ([Korman--McCann](https://arxiv.org/abs/1201.6404)); Bregman-Dykstra convergence both with an interior qualification ([Bauschke--Lewis](https://people.orie.cornell.edu/aslewis/publications/00-dykstras.pdf)) and for polyhedral boundary intersections ([Bregman--Censor--Reich](https://math.haifa.ac.il/yair/Dykstra.jca99.pdf)); weak OT ([Backhoff-Veraguas--Beiglboeck--Pammer](https://arxiv.org/abs/1809.05893)); inverse-OT sparsistency ([Andrade--Peyre--Poon](https://arxiv.org/abs/2310.05461)); and current inverse-OT curvature v2, dated 8 July 2026 ([Peyre--Poon--Tron](https://arxiv.org/abs/2604.22670)). No wrong author attribution or missing bibliographic entry was established. CH12-004 is an over-extension beyond safe hypotheses, CH12-010 is a boundary qualifier absent from its sentence, and RQ12-004 remains version-sensitive. The absence of the sharper polyhedral-boundary reference at line 1681 is an optional citation improvement, not a theorem-scope defect, because the asserted convergence is valid.

| Citation key | Source line(s) | Resolution / scope disposition |
|---|---:|---|
| `2013-Bonneel-barycenter` | 1006 | Present; attribution and stated scope coherent |
| `2015-benamou-cisc` | 544, 642, 1425, 1681 | Present; transport-specific KL projections and Dykstra iteration are correctly attributed. Its convergence statement is valid here by the polyhedral-boundary theorem checked independently. |
| `2015-solomon-siggraph` | 705, 737 | Present; attribution and stated scope coherent |
| `2016-Cuturi-siims` | 541 | Present; attribution and stated scope coherent |
| `AltschulerBoixAdsera2022StructuredMOT` | 1420 | Present; attribution and stated scope coherent |
| `BenamouCarlierNenna2018GeneralizedIncompressible` | 1425 | Present; attribution and stated scope coherent |
| `BigotCazellesPapadakis2019DataDriven` | 737 | Present; attribution and stated scope coherent |
| `BigotCazellesPapadakis2019Penalization` | 737 | Present; attribution and stated scope coherent |
| `BindiniDePascaleKausamoDeterministicCoulomb` | 1190 | Present; attribution and stated scope coherent |
| `BuDePGor` | 1148 | Present; attribution and stated scope coherent |
| `BuylDeBie2022FairClassifiers` | 108 | Present; attribution and stated scope coherent |
| `CarlierEichingerKroshnin2020EntropicBarycenterCLT` | 737, 857 | Present; attribution and stated scope coherent |
| `Carlier_wasserstein_barycenter` | 34 | Present; primary-source scope checked |
| `Chizat2025DoublyRegularizedBarycenter` | 712, 737 | Present; primary-source scope checked |
| `ChzhenDenisHebiriOnetoPontil2020FairBarycenters` | 108 | Present; attribution and stated scope coherent |
| `ColomboStraCoulombCounterexamples` | 1190 | Present; attribution and stated scope coherent |
| `CotarDFT` | 1148 | Present; attribution and stated scope coherent |
| `CramerWold1936` | 1006 | Present; attribution and stated scope coherent |
| `CuturiBarycenter` | 73, 541 | Present; official PMLR paper checked. Computational attribution is correct, but “smooth” must be restricted to the simplex relative interior (CH12-010). |
| `CuturiGroundMetric2014` | 1878 | Present; attribution and stated scope coherent |
| `Danskin1967` | 1835 | Present; attribution and stated scope coherent |
| `DelBarrioGamboaGordalizaLoubes2018FairOT` | 108 | Present; attribution and stated scope coherent |
| `DiMarinoGerolinNennaRepulsiveCosts` | 1148 | Present; attribution and stated scope coherent |
| `Dykstra85` | 1681 | Present; historical attribution to the finite-alphabet iterative I-projection procedure is correct. Later Bregman-Dykstra theory supplies the clean exact theorem used for the chapter's affine-plus-box case. |
| `FanHaaslerKarlssonChen2021GraphCostMOT` | 1346, 1418, 1420 | Present; primary-source scope checked |
| `GalichonMartingale` | 2259 | Present; attribution and stated scope coherent |
| `GangboSciech` | 1051 | Present; attribution and stated scope coherent |
| `GorSeiVig` | 1148 | Present; attribution and stated scope coherent |
| `HaaslerRinghChenKarlsson2021TreeMOT` | 1420 | Present; attribution and stated scope coherent |
| `HaaslerSinghZhangKarlssonChen2020PGMMOT` | 1418, 1420 | Present; attribution and stated scope coherent |
| `HermanTomography` | 984 | Present; attribution and stated scope coherent |
| `HuRatzCharpentier2023FairBarycenters` | 108 | Present; attribution and stated scope coherent |
| `KimPass2017WassersteinBarycenters` | 745 | Present; attribution and stated scope coherent |
| `LinHoCuturiJordan2022MOTComplexity` | 1309 | Present; dense-tensor exponential dependence is scoped correctly |
| `MAL-019` | 1878 | Present; attribution and stated scope coherent |
| `Pass2` | 1051 | Present; attribution and stated scope coherent |
| `PassMultiMarginalStructure` | 1051 | Present; attribution and stated scope coherent |
| `PassMultiReview` | 1051 | Present; primary-source scope checked |
| `RuschendorfUckelmann` | 507 | Present; attribution and stated scope coherent |
| `Strassen1965` | 2266, 2336 | Present; attribution and stated scope coherent |
| `agueh2017vers` | 857 | Present; primary-source scope checked |
| `alvarez2016fixed` | 34, 341, 399, 418, 495, 507 | Present; primary-source scope checked |
| `ambrosio2006gradient` | 2034 | Present; chapter-specific citation syntax checked; attribution and scope coherent |
| `anderes2016discrete` | 34, 1290 | Present; attribution and stated scope coherent |
| `andrade2024sparsistency` | 1993 | Present; primary paper supports conditional sparsity recovery and estimation bounds; manuscript retains the required identifiability/certificate/tuning caveats |
| `andrade2025sharpened` | 1922, 1997 | Present; conditional/version-sensitive claim, see RQ12-004 |
| `backhoff2019weak` | 2067, 2122, 2249, 2378 | Present; attribution and stated scope coherent |
| `bauschke-lewis` | 1681 | Present. Theorem 3.2 has an interior-intersection hypothesis that mere feasibility does not ensure, so it is not alone the best theorem for boundary-only capped polytopes. Bregman--Censor--Reich Theorem 3.1 covers the exact polyhedral case; no defect remains. |
| `beiglbock2013model` | 2259 | Present; attribution and stated scope coherent |
| `bellet2015metric` | 1878 | Present; attribution and stated scope coherent |
| `bhatia2018bures` | 341, 507 | Present; attribution and stated scope coherent |
| `bigot2012characterization` | 745 | Present; attribution and stated scope coherent |
| `boissard2015distribution` | 774 | Present; attribution and stated scope coherent |
| `carlierekelandmatching` | 34 | Present; attribution and stated scope coherent |
| `dolinsky2014martingale` | 2259 | Present; attribution and stated scope coherent |
| `forrow2019factored` | 1472 | Present; attribution and stated scope coherent |
| `gozlan2017kantorovich` | 2067 | Present; attribution and stated scope coherent |
| `guo2017computational` | 2259 | Present; attribution and stated scope coherent |
| `km1` | 1602 | Present; primary-source scope checked |
| `leGouic2016existence` | 34, 745, 774 | Present; attribution and stated scope coherent |
| `peyre2026curvature` | 1990, 1997 | Present; arXiv v2 (8 July 2026) supports smooth-density curvature, spanning-based identifiability, and affine/Gaussian degeneracy; still version-sensitive, see RQ12-004 |
| `scetbon2021lowrank` | 1472, 1523 | Present; primary-source scope checked |
| `srivastava2015wasp` | 774 | Present; attribution and stated scope coherent |
| `srivastava2018scalable` | 774 | Present; attribution and stated scope coherent |
| `staib2017parallel` | 774 | Present; attribution and stated scope coherent |
| `zemel2017fr` | 774 | Present; attribution and stated scope coherent |

## Cross-reference and imported-convention audit

- **Logical labels defined locally:** 120, consisting of 115 explicit `\\label` definitions and five labels carried by `\\eqllead`. All 120 are unique.
- **Standard reference uses:** 76 `\\ref` plus 103 `\\eqref`, totaling 179 commands and 123 distinct targets.
- **Direct hyperlink use:** one `\\hyperref`, targeting imported label `rem-sliced-radon-viewpoint`.
- **All targets:** 180 cross-reference commands target 124 distinct labels: 79 local and 45 imported. Every target resolves; there are **zero dangling references**.
- **Intentional aliases:** E29 defines both `prop-ot-first-variations-unregularized` and `prop-ot-first-variations-entropic` on the same proposition. They are distinct labels, not a collision.
- **Duplicates:** no duplicate active chapter label and no multiply-defined-label warning in the retained full build. Duplicate text in excluded/uncompiled material was not treated as an active collision.

The complete imported-target matrix follows. Locations identify the definition of the imported convention, not merely its use in Chapter 12.

| Imported label | Defining source | Convention or dependency checked |
|---|---|---|
| `alg:entropic-gromov-wasserstein` | `beyond-comparing-measures.tex:1682` | Alternating frozen-cost GW update used only as a computational analogy; pass |
| `cor-monge-kantorovich-brenier` | `kantorovich.tex:1142` | Brenier conditions for map/plan equivalence; pass |
| `def-collapsed-barycentric-mixture` | `beyond-comparing-measures.tex:246` | Law over component measures and barycentric collapse; pass |
| `def-conditional-ot` | `generalized-wasserstein.tex:2631` | Disintegration and fiberwise conditional OT convention; pass |
| `def-continuous-entropic-ot` | `sinkhorn.tex:633` | KL reference $\alpha\otimes\beta$ and $\epsilon>0$ convention; pass |
| `def-continuous-kantorovich-problem` | `kantorovich.tex:1015` | Continuous primal value is declared for nonnegative Borel costs; the later signed bilinear extension needs an explicit domain (CH12-009) |
| `def-first-variation` | `wasserstein-gradient-flows.tex:66` | Directional first-variation convention; pass |
| `def-monge-mccann-interpolation` | `monge.tex:848` | Displacement interpolation parameter and push-forward convention; pass |
| `def-sliced-wasserstein` | `generalized-wasserstein.tex:1040` | Projection map and uniform-sphere averaging; pass |
| `def-twist-condition` | `monge.tex:1139` | Injectivity of $y\mapsto\nabla_xc(x,y)$; pass |
| `eq-conditional-ot-general` | `generalized-wasserstein.tex:2646` | Fiberwise conditional objective; pass |
| `eq-continuous-entropic-density-law` | `sinkhorn.tex:1205` | Continuous Gibbs density and potential signs under dual attainment; pass |
| `eq-dist-gauss` | `monge.tex:1950` | Squared W2 Gaussian mean/Bures decomposition; pass |
| `eq-dual` | `dual.tex:44` | Discrete dual sign and inequality convention; pass |
| `eq-dual-sinkhorn-objective` | `sinkhorn.tex:1190` | Entropic dual normalization and exponential term; pass |
| `eq-entropic-generic` | `sinkhorn.tex:636` | Normalized continuous entropic value used in inverse OT; its imported definition does not by itself make every unbounded candidate cost proper, which is CH12-009 |
| `eq-kanto-discr` | `kantorovich.tex:148` | $P1_m=a$, $P^T1_n=b$ orientation; pass |
| `eq-l2-attention-mean-shift` | `transportation-models.tex:1381` | Kernel-weighted barycentric mean analogy; pass |
| `eq-mk-generic` | `kantorovich.tex:1017` | Unregularized continuous OT value under the preceding nonnegative-cost convention; CH12-009 for signed bilinear use |
| `eq-regularized-discr` | `sinkhorn.tex:51` | Entropy-only convention $\langle C,P\rangle-\epsilon H(P)$; confirms the boundary counterexample in CH12-010 |
| `eq-regularized-discr-rescaled` | `sinkhorn.tex:479` | Product-reference KL convention and marginal entropy constants; pass |
| `eq-svgd-velocity` | `transportation-models.tex:885` | RKHS averaging analogy only; pass |
| `eq-wass-cumul` | `monge.tex:1359` | One-dimensional W2 quantile integral; pass subject to CH12-001's finite-value/domain repair |
| `prop-basic-phi-divergence-properties` | `dual-norms.tex:412` | KL/phi-divergence convexity convention; pass |
| `prop-continuous-entropic-duality` | `sinkhorn.tex:1180` | Continuous entropic duality hypotheses; pass and highlights CH12-004's missing hypotheses |
| `prop-discrete-kantorovich-joint-convexity` | `kantorovich.tex:163` | Joint marginal convexity used for fixed-support barycenters; pass |
| `prop-duality-discr` | `dual.tex:41` | Finite discrete strong duality; pass |
| `prop-kantorovich-duality-general` | `dual.tex:154` | Continuous Kantorovich duality scope; pass |
| `prop-kantorovich-value-curvature` | `kantorovich.tex:1031` | Concavity in cost and convexity in marginals; pass |
| `prop-lp-rank-sparsity` | `kantorovich.tex:221` | Basic-feasible-solution support rank; pass |
| `prop-plan-interpolation-w2-geodesic` | `wasserstein-space.tex:352` | Optimal-plan interpolation is constant-speed W2 geodesic; pass |
| `prop-small-epsilon-expansion` | `sinkhorn.tex:936` | Small-temperature coefficient under normalized KL convention; pass |
| `prop-twist-prevents-splitting` | `monge.tex:1148` | Two-marginal no-splitting argument recovered as a special case; pass |
| `prop-wasserstein-mean-decomposition` | `wasserstein-space.tex:268` | Mean lower bound and centered quadratic decomposition; pass |
| `rem-sliced-radon-viewpoint` | `generalized-wasserstein.tex:1145` | Density Radon transform and Fourier-slice convention reached by the chapter's one direct `hyperref`; resolves |
| `sec-gromov-wasserstein` | `beyond-comparing-measures.tex:391` | Comparison point for nonconvex quadratic coupling objectives; resolves |
| `sec-phi-div` | `dual-norms.tex:356` | Directional KL discussion; resolves |
| `sec-sample-complexity` | `statistical-ot.tex:214` | Statistical comparison scope; resolves |
| `sec-sliced-wasserstein` | `generalized-wasserstein.tex:1029` | Imported sliced conventions; resolves |
| `sec-statistical-ot` | `statistical-ot.tex:7` | Statistical OT context; resolves |
| `sec-svgd-generative-flow` | `transportation-models.tex:858` | SVGD analogy; resolves |
| `sec-wasserstein-over-wasserstein` | `beyond-comparing-measures.tex:209` | Hierarchical measure-valued OT distinction; resolves |
| `thm-brenier` | `monge.tex:658` | Absolute-continuity condition for unique quadratic map; pass |
| `thm-gelbrich-projection` | `transportation-models.tex:2575` | Moment-matched Gaussian W2 contraction; pass |
| `thm:opt_ccm` | `kantorovich.tex:1443` | $c$-cyclical monotonicity of optimal plans; pass |

Two non-reference imported conventions were also checked explicitly. `monge.tex:28--35` defines the closed simplex, and `monge.tex:43--50` does not delete listed zero-mass atoms. The former confirms both the boundary counterexample CH12-010 and, together with the latter, the zero-row problem CH12-006. The compact/continuous assumptions in E29 do not automatically extend to the later $\mathbb R^d$ bilinear example; this confirms CH12-009.

## Notation and normalization audit

| Topic | Lines | Audit result |
|---|---:|---|
| Probability and moment spaces | 23--29, 245--270, 743--779, 1856--1878, 1910--1936, 2015--2017, 2227--2229 | $\mathcal P$, $\mathcal P_1$, and $\mathcal P_2$ are otherwise used consistently. CH12-001 omits the quantile finite-value condition; CH12-009 omits moment/properness assumptions for unbounded bilinear and inverse costs. |
| Barycenter weights | 20--29 and throughout | $\lambda\in\Delta_S$ is normalized. Claims needing strict positivity explicitly refer to positive-weight inputs or assume interior weights; zero-weight inputs are harmlessly ignored. |
| Squared-distance convention | 23--29, 113--159, 1213--1256 | Barycenter objectives use $W_2^2$, and the two-measure minimum is $t(1-t)W_2^2$ with no missing square or factor. |
| Discrete coupling orientation | 52--60, 546--565, 1476--1516, 1626--1642 | Every $n\times m$ plan has row marginal $a$ and column marginal $b$. Transposes and all-one vector dimensions are consistent. |
| Entropy-only versus normalized KL | 535--560, 645--703, 708--739, 1674--1686 | The fixed-support Sinkhorn section uses entropy-only regularization; double regularization and capacity use product-reference KL. All additive marginal entropy terms and the epsilon/tau cancellation have the correct signs. Entropy's derivative diverges at zero mass, which is CH12-010 rather than a sign error. |
| Potential gauges | 645--703, 1802--1817, 1899--1903 | Barycenter dual potentials satisfy the weighted zero-sum gauge; OT first variations are invariant under constants because perturbations have zero mass; inverse OT correctly identifies additive marginal gauges and unregularized positive scaling. |
| Gaussian matrices | 280--508 | $X,\Sigma_s,T_s,R_s,\Psi$ are symmetric with stated positive-semidefinite/positive-definite domains. Matrix square roots, inverses, traces, and determinant exponents are dimensionally valid. |
| Fourier/Radon convention | 864--1006 | The Fourier transform/inverse factors, signed frequency variable, sphere surface measure, antipodal symmetrization, and ramp $\lvert\omega\rvert^{d-1}$ are internally consistent. Figure post-processing is separately defective under CH12-002. |
| Multi-marginal indexing | 1029--1461 | Tensor indices, coordinate marginals, edge factors, bags, separators, and messages use a consistent $S$-marginal convention. $S$ is not confused with sphere surface area, which is written $\lvert\mathbb S^{d-1}\rvert$. |
| Low-rank latent variables | 1476--1575 | $g$ is a probability vector and the $g_k^{-1}$ convention discards zero components. The section distinguishes nonnegative coupling rank from kernel approximation rank. |
| Capacity normalization | 1608--1768 | Continuous $u$ bounds density relative to $\alpha\otimes\beta$; the discrete cap is $u_{ij}a_ib_j$. The special $u=+\infty$ convention is explicit, and $u=1$ correctly forces the product law. |
| First-variation signs | 1799--1878 | Marginal derivatives are suprema over dual optimizers; cost derivatives are infima over primal optimizers. The bilinear orientation is $E[YX^T]$, not its transpose. Existence of that moment/gradient is CH12-009. |
| Weak/martingale disintegration | 2015--2392 | Conditional laws are taken relative to the first marginal, barycentric projections map source to target space, and martingale orientation is $E[Y\mid X]=X$. CH12-006 is the sole zero-row notation defect. |

No conflicting reuse of a mathematical symbol changes meaning within a structural unit. Typography alternates between continuous measures and bold discrete vectors/matrices consistently; no sign, transpose, or normalization defect beyond the registered issues was found.

## Endpoint and limiting-case audit

| Endpoint or limit | Result |
|---|---|
| Two-measure weight $t=0,1$ | The barycenter objective reduces to one input and the geodesic characterization has the correct degenerate endpoint interpretation. Pass. |
| Quantile parameter $r=0,1$ | E07 already uses $(0,1)$ and passes on endpoints. Lines 891--897 use $[0,1]$ even though endpoint quantiles may be infinite; this remaining defect is CH12-001. |
| Gaussian singular inputs | The Gaussian theorem permits singular covariances but requires one positive-definite positive-weight input for uniqueness/interiority. The all-singular nonuniqueness caveat is explicit. Pass. |
| Gaussian damping $\eta\downarrow0$ and $\eta=1$ | The theorem uses $\eta\in(0,1]$; zero is excluded, and one is the undamped transport update. The descent coefficient remains nonnegative and correct. Pass. |
| Entropic temperature $\epsilon=0$ | Sinkhorn algorithms correctly require $\epsilon>0$, and E29 separates the unregularized convention. E30's value must additionally be finite/proper at either endpoint; CH12-009. |
| Simplex weights $a_i\downarrow0$ | The entropic transport value remains continuous, but its gradient generally diverges logarithmically. Global “smooth” wording is CH12-010; the later algorithms' positive-mass assumptions are safe. |
| Double regularization $\tau=0$, $\epsilon=0$, and $\tau=\epsilon$ | Compactness/continuity supports existence at zero parameters; the entropy-only cancellation at $\tau=\epsilon$ is exact in the discrete uniform-reference case. At $\tau=0$, the intended convention is to omit the KL term; explicitly declaring $0\cdot(+\infty)=0$ would improve precision but is not counted as a defect. |
| Population sample size $N\to\infty$ | The LLN conclusion is an argmin convergence statement with uniqueness only when assumed; no unjustified rate is attached. Pass. |
| Number of projections $L\to\infty$ | The Radon least-squares discussion distinguishes finite directional fitting from an exactly consistent continuum sinogram. Pass. |
| Coulomb diagonal | The singular collision set is treated as infinite cost/forbidden; regularized numerics use a finite grid treatment and do not turn this into a general Monge theorem. Pass. |
| Low rank $r=1$ and zero $g_k$ | The factorization remains well defined for $r=1$; zero latent components are deleted before inversion. Pass. |
| Capacity $u=1$ and $u=+\infty$ | Product coupling and ordinary OT endpoints are correctly recovered by explicit convention. Pass. |
| Boundary-only capped polytope | Positive active capacities and positive marginals do not prevent saturated cuts from forcing active-edge zeros. The minimizer still exists and is unique. Since row, column, and box sets are polyhedral and each separately meets the positive orthant, Bregman--Censor--Reich Theorem 3.1 proves convergence even when their common intersection is boundary-only. Pass; CH12-011 retired. |
| Connection parameter $q$ | Algebraic minimum-degree claim holds for integer $q\ge1$ with uniform rows; current numerical provenance fails under CH12-005. |
| Zero atomic weights | Divisions in discrete barycentric formulas require deletion of zero $a_i$; CH12-006. Other algorithms explicitly assume positive marginals. |
| Weak zero cost | The equivalence with martingale feasibility uses $\mathcal P_2$ and attainment; both are stated. Pass. |
| Martingale first-moment boundary | Definitions/Strassen use $\mathcal P_1$; quadratic projection upgrades to $\mathcal P_2$. Gaussian covariance tests require the linear-growth approximation in CH12-008 before second moments are passed to the limit. |

## Dimension audit

| Object | Required dimensions | Result |
|---|---|---|
| Fixed-support barycenter plan $P_s$ | $n\times n_s$; $P_s1_{n_s}=a$, $P_s^T1_n=b_s$ | Pass |
| Gaussian map $T_s(X)$ | $d\times d$, mapping covariance $X$ to $\Sigma_s$ via $T_sXT_s=\Sigma_s$ | Pass |
| Entropic barycenter scalings | $u_s\in\mathbb R^n$, $v_s\in\mathbb R^{n_s}$, $K_s\in\mathbb R^{n\times n_s}$ | Pass |
| Multimarginal tensor | Shape $n_1\times\cdots\times n_S$; each marginal contraction has length $n_s$ | Pass |
| Junction-tree message | Array on separator $B\cap B'$ with at most $w$ variables after eliminating a width-$w$ bag | Pass |
| Low-rank factors | $Q:n\times r$, $R:m\times r$, $\operatorname{diag}(g)^{-1}:r\times r$, induced $P:n\times m$ | Pass |
| Low-rank effective costs | $CR\operatorname{diag}(g)^{-1}:n\times r$; $C^TQ\operatorname{diag}(g)^{-1}:m\times r$ | Pass |
| Capacity arrays | $C,K,\bar P,P,R_1,R_2,R_3\in\mathbb R^{n\times m}$ | Pass |
| Bilinear cost parameter | $A,H\in\mathbb R^{d\times d}$; $\int yx^T d\pi$ pairs with $H$ in Frobenius product | Dimensions/orientation pass; existence of the integral is CH12-009 |
| Discrete barycentric projection | $\sum_jP_{ij}y_j/a_i\in\mathbb R^d$ for $a_i>0$ | CH12-006 at zero rows |
| Martingale LP constraints | One scalar equality per source atom in $d=1$, or $d$ equalities per source atom generally | Mathematical text pass; F12 numerical scaling is CH12-007 |

## Complexity audit

| Lines | Claim | Audit result |
|---:|---|---|
| 38--78 | Fixed support controls barycenter unknowns | Correct qualitative statement; it trades free support for $n$ weights and $S$ plans of total size $n\sum_sn_s$. |
| 1258--1290 | Discrete barycenter support at most $\sum_sn_s-S+1$ | Correct LP rank bound, independent of the full product-grid cardinality. |
| 1309 | Unstructured MM Sinkhorn exponential in number of marginals | Correct: a dense tensor stores $\prod_sn_s$ entries and a full marginal contraction has comparable exponential dependence. No polynomial claim is made. |
| 1311--1432 | Treewidth controls contraction | Correct with $n=\max_sn_s$: $O(Sn^{w+1})$ arithmetic and $O(Sn^w)$ message storage for a width-$w$ junction tree, up to graph/decomposition constants. Trees have $w=1$; a clique on $S$ variables has $w=S-1$. |
| 1572--1575 | Low-rank scaling and formation costs | Correctly separates $O(nr)$/$O(mr)$ inner scaling from $O(nmr)$ dense products and $O((n+m)r)$ implicit storage. This avoids the common but false claim that all low-rank updates are automatically subquadratic. |
| 1688--1732 | Capacity KL-Dykstra | No explicit manuscript big-O is overstated. Direct dense projections are $O(nm)$ per sweep; restricting to active edges gives $O(\lvert E\rvert)$ arithmetic/storage, excluding solver overhead. Polyhedral-boundary convergence passes. |
| 1972--1977 | Finite empirical inverse loss | Correctly described as the minimum of finitely many affine assignment costs. The text makes no unsupported polynomial enumeration claim. |

No complexity constant or exponent stated in the chapter was found false. Algorithm A03's effective-cost formation caveat and MMOT's treewidth qualification are both essential and are present.

## Attribution and scope conclusions

- The chapter does not infer universal Monge structure for Coulomb costs; it separates splitting-set twist theory from the Coulomb examples and cites counterexamples. This scope is correct.
- The barycenter CLT paragraph is deliberately non-universal and names only the one-dimensional and finite Gaussian regimes. This avoids an unjustified general tangent-space CLT.
- The fixed-$g$ low-rank algorithm is not attributed as the full Scetbon--Cuturi--Peyre algorithm; the distinction from their joint mirror-descent formulation is explicit.
- Capacity-constrained OT is correctly attributed to the continuous theory, the discrete cut theorem is complete, and the KL-Dykstra convergence sentence is valid. Bauschke--Lewis alone has an unnecessarily strong qualification here; Bregman--Censor--Reich's polyhedral theorem closes the boundary case. Adding that citation is optional exposition.
- The inverse-OT statistical and curvature claims retain identifiability, nondegeneracy, dimension, tuning, and version caveats. RQ12-004 records the remaining archival-version question.
- The algebraic inverse-gap interpretation is correct on a proper domain, but the chapter does not state that domain; this is CH12-009 rather than a citation problem.
- The weak and martingale sections correctly attribute existence/duality/order results without claiming a martingale dual that is not actually stated.

## Prioritized repair order

| Priority | Issue | Repair action | Why this order |
|---:|---|---|---|
| 1 | CH12-009 | Put the bilinear derivative and inverse-gap definition/proposition on a finite-moment, finite-value, attained domain. | A definition and proposition are not well-defined on their declared domain. |
| 2 | CH12-004 | Restrict MMOT Gibbs/Sinkhorn to a safe finite or continuous regime and separate primal, dual, density, and convergence conclusions. | Prevents a broad continuous algorithmic assertion from being read as unconditional. |
| 3 | CH12-001 | State the exact finite-value criterion (or the sufficient positive-weight $\mathcal P_2$ assumption) and fix only the Radon endpoint domain. | Repairs a numbered proposition's scope and its reused construction without reintroducing the removed endpoint false positive. |
| 4 | CH12-003 | Relabel the third Coulomb panel $\epsilon=2.00$ or regenerate it at $0.50$. | Direct parameter mismatch with a trivial deterministic repair. |
| 5 | CH12-002 | Disclose the effective Radon filters/floor or regenerate exactly from the stated operator. | Restores equality between a defined reconstruction and its advertised panel. |
| 6 | CH12-006 | Delete zero-mass atoms locally or restrict the two sums to $a_i>0$. | Small textual change prevents literal division by zero. |
| 7 | CH12-010 | Restrict smoothness to $\operatorname{ri}(\Delta_n)$ and state an interior-preserving optimization convention. | Corrects an unqualified boundary claim with one sentence. |
| 8 | CH12-008 | Insert the monotone convex linear-growth approximation before using Gaussian quadratics. | The theorem is true; only the proof bridge is missing. |
| 9 | CH12-007 | Scale LP martingale rows or tighten tolerances, assert conditional residual, and regenerate F12. | Corrects a low-mass numerical certification problem, not theory. |
| 10 | CH12-005 | Execute all generators from clean kernels; for capacity run $q=1,3,5$, make nonconvergence fatal, and regenerate/record the panels together. | Restores provenance; current mathematics and assets are not proved false. |

## Reconciled issue register

| Issue | Severity | Primary location | Root category |
|---|---|---|---|
| CH12-001 | Moderate | 245--270; 870--897 | Missing finite-value hypothesis; invalid endpoints only in Radon reuse |
| CH12-002 | Moderate | 984--1016 and F03 generator | Figure reconstruction mismatch |
| CH12-003 | Moderate | 1194--1206 and F04 generator | Figure parameter mismatch |
| CH12-004 | Moderate | 1292--1309 | Primal/density/dual/scaling hypotheses conflated |
| CH12-005 | Minor | F01/F03/F07 generators; 1752--1768 | Incomplete/stale execution provenance, including one nonconverged retained run |
| CH12-006 | Minor | 2028--2032; 2162--2168 | Zero-mass division convention |
| CH12-007 | Minor | 2397--2414 and F12 generator | Absolute LP tolerance fails conditional certification |
| CH12-008 | Minor | 2294--2298; 2384--2392 | Quadratic test excluded by stated convex-order class |
| CH12-009 | Moderate | 1856--1878; 1910--1950 | Missing moment/properness/attainment domain |
| CH12-010 | Minor | 535--541 | Unqualified smoothness wording at the closed-simplex boundary |

The register contains **10 retained IDs exactly once**: **0 Critical + 0 Major + 5 Moderate + 5 Minor = 10 established defects**. CH12-011 is intentionally not reused: its retired disposition remains in the second-pass table. Structural, display, citation, and figure matrices may link an ID more than once, but those links are manifestations of the same root cause and are not additional findings.

## Final source-hash reconciliation and closure

- **Initial authoritative-source SHA-256:** `4d8bea5312cc6b48884864ebca042e23743ca337a5569ac5c854c779f1727ad5`.
- **Final authoritative-source SHA-256:** `4d8bea5312cc6b48884864ebca042e23743ca337a5569ac5c854c779f1727ad5`.
- **Hash comparison:** exact match. The audited bytes did not change during the audit.
- **Final authoritative-source length:** 2,414 physical lines and 164,370 bytes, matching the protected baseline.
- **Coverage reconciliation:** 34 contiguous structural units; 44 named/numbered environments; 22 proofs; 158 displays; four algorithms; 12 figures; 12 matched generators; 37 included assets; 120 unique logical labels; 179 `ref`/`eqref` uses plus one direct `hyperref`; 58 citation commands and 66 distinct citation keys.
- **Defect reconciliation:** 0 Critical, 0 Major, 5 Moderate, 5 Minor, 10 total; retained IDs are CH12-001--CH12-010, while CH12-011 is explicitly retired rather than reassigned.
- **Write-scope check:** only `/Users/gpeyre/Dropbox/github/ot4ml/audit-chap12.md` was written. Git continues to show the authoritative TeX source as modified relative to the repository index, but that dirty state pre-existed this audit; its session-initial and session-final byte hashes are identical.
- **Version-control action:** no file was staged, no commit was created, and nothing was pushed.

This closes the second adversarial audit. No notebook or asset was executed in place or modified; two bounded in-memory numerical reproductions quantified F02 and F12, and primary papers were inspected read-only. No manuscript, replica, bibliography, notebook, figure, code, data, build, or Git-index file was edited, and RQ12-001 through RQ12-004 remain optional research/scope questions rather than defects.
