# Chapter 10: Independent Adversarial Audit of Statistical Optimal Transport

## Audit Identity

- **Authoritative source:** `/Users/gpeyre/Dropbox/github/ot4ml/OT4ML/sections/statistical-ot.tex`
- **Protected-source extent:** 1,369 physical lines, 11,075 words, 109,722 bytes.
- **Protected-source SHA-256 at the start of the audit:** `57ec1686ffe3ddc8fdd26184912068751c318b6fca112793384fabaac6360552`.
- **Audit date:** 2026-08-25.
- **Independence protocol:** every source line, imported definition, proof, notebook, retained output, figure asset, and material citation was examined before the pre-existing report was opened. The independent severity and validated-correct ledgers were frozen first. The old report was then treated only as a list of hypotheses to verify or reject.
- **Second-pass protocol:** the complete source was read again, every retained finding was subjected to an attempted falsification, the delicate constants and endpoint regimes were rederived, all four notebooks and their retained outputs were reinspected, and the preserved superseded audit at `/private/tmp/ot4ml-audit-chap10-before-fresh-agent.md` was reconciled only after that work.
- **First-pass report checkpoint:** 775 lines, 67,669 bytes, SHA-256 `13e62e878d8c6fea0ba26145be5f24c6c94f426b912c60bbaf3951cd164d630d` before this adversarial refinement.
- **Write boundary:** only this report was replaced. No manuscript, bibliography, notebook, script, figure, build artifact, or Git state was intentionally changed.
- **Line anchors:** all manuscript locations below refer to the protected 1,369-line source. Notebook locations are physical JSON lines in the named `.ipynb` file.

## Correction Pass - 2026-08-26

All **16 findings** from this audit have been resolved in the manuscript or its source-linked numerical material. The original findings below are retained unchanged as the pre-correction record; this section records the implemented disposition and supersedes the historical read-only boundary stated in the audit identity.

| Finding | Status | Implemented correction |
|---|---|---|
| C10-MAJ-01 | Resolved | Replaced the universal vanishing-first-derivative claim by a finite/disconnected-versus-smooth taxonomy. The text now gives the two-point behavior $W_p^p=t$, $W_p=t^{1/p}$, distinguishes $W_p$ from $W_p^p$, and calls the fixed-temperature Sinkhorn null limit a possibly degenerate quadratic form. |
| C10-MOD-01 | Resolved | Rewrote the bias--variance notebook to recover the optimal plan and evaluate the complete product-KL objective $\langle C,P\rangle+\epsilon\mathrm{KL}(P\mid a\otimes b)$ in every cross and self term. The manuscript caption now states this convention explicitly. |
| C10-MOD-02 | Resolved | Removed the unjustified rounded all-temperature exponent. Proposition 10.12 now uses $q_d=\lceil5d/2\rceil+6$ and the exact scale $\Lambda_{d,\sigma}(\epsilon)=\epsilon[1+(\sigma/\sqrt\epsilon)^{q_d}]$, with the small-temperature integer-power simplification stated only on $0<\epsilon\leq1$. |
| C10-MOD-03 | Resolved | Restricted the clean $O(\epsilon)$ bias statement to fixed finite supports and proved an explicit entropy bound. The text now warns that continuum expansions can contain $\epsilon\log(1/\epsilon)$ terms and that Sinkhorn cancellation needs further geometric assumptions. |
| C10-MOD-04 | Resolved | Required all empirical sites to lie in the compact domain and defined the barycentric estimator from the aggregated empirical plan. Repeated source sites are now combined through disintegration; the row formula is stated only as the distinct-site specialization. The proof uses the aggregated plan throughout. |
| C10-MOD-05 | Resolved | Separated the elementary stable-mixture identity from the bounded-domain construction of Scetbon--Cuturi. Added the exact conditional second moment $\mathbb E_Z[F_{x,y}^2\mid\Lambda]=e^{8\Lambda\langle u,v\rangle}$, showing infinite variance for $0<p<2$ and exponential growth for $p=2$, and removed any unsupported rank--accuracy guarantee. |
| C10-MOD-06 | Resolved | Relabeled the numerical statistic as $\sqrt{\bar{\mathcal L}_c^\epsilon}$, both in code and prose. The caption now explains that this is the square root of an $n^{-1}$ second-order same-population null statistic, rather than an $n^{-1/2}$ fluctuation of the raw divergence. |
| C10-MOD-07 | Resolved | Replaced the qualitative rank-40 accuracy claim by retained diagnostics: plan $\ell^1$ error about $0.735$ and weighted log-kernel RMSE about $48.9$. The caption and notebook disclose the $10^{-300}$ logarithmic floor and the 70th-percentile color cap. |
| C10-MOD-08 | Resolved | Corrected the Gaussian tail contribution in the Berry--Esseen notebook to $\varphi(R)-R\Phi(-R)$ and regenerated the comparison figure. |
| C10-MIN-01 | Resolved | Qualified the exact-OT Nystr\"om tuning: the cited proposition certifies $\epsilon\simeq\tau/\log N$ only when $\tau/\log N\in[1/N,1]$, in particular $\tau\gtrsim(\log N)/N$. |
| C10-MIN-02 | Resolved | Replaced the ambiguous coupon-collector statement by the explicit bounds $n\geq N[\log N+\log(2/\delta)]$ and its $M$-point analogue, and stated the correct vanishing-failure conditions. |
| C10-MIN-03 | Resolved | Normalized Bochner sampling by $\rho=\Lambda/\kappa(0)$ and multiplied the real Fourier feature by $\sqrt{\kappa(0)}$. |
| C10-MIN-04 | Resolved | Added the denominator in the linear-attention formula and separated positive-feature/Performer attention from Linformer sequence projection and Nystr\"omformer landmark reconstruction. |
| C10-MIN-05 | Resolved | Replaced the absolute claim that fixed-temperature regularization bias can vanish only as $\epsilon\to0$ by a generic statement with the uniquely forced product-coupling exception. |
| C10-MIN-06 | Resolved | Restarted and executed all four Chapter 10 notebooks from clean state. Execution counters are sequential and no code cell retains an error output. |
| C10-MIN-07 | Resolved | Renamed the numerical notebook heading from "Totally Positive" to "Doubly Positive but Not Completely Positive," matching the cone property actually tested. |

### Correction Validation

- **Corrected source:** 1,393 physical lines, 114,198 bytes; SHA-256 73081cc7a5f40ae12920a57c0829ddc7890a68bdb8f4b7a0d12ce1f6fef6974a.
- **Clean notebook runs:** bias--variance, 6/6 code cells; Berry--Esseen, 5/5; positive-feature sketching, 7/7; doubly-positive counterexample, 3/3. Every notebook has sequential execution counts and zero error outputs.
- **Regenerated assets:** 12 one-page PDFs: two bias--variance panels, one Berry--Esseen comparison, eight positive-feature panels, and one doubly-positive counterexample.
- **Book build:** OT4ML.pdf compiles successfully to 490 pages. The final log has no undefined citation, unresolved reference, rerun request, or overfull box.
- **Visual QA:** the corrected pages containing Figure 10.2, Proposition 10.12, Proposition 10.14, and Figure 10.4 were rendered and inspected; equations, captions, theorem boxes, and figures fit without clipping or collision.

### Correction Verification Iteration - 2026-08-26

Every corrected finding was re-read in context and independently checked against the definitions it uses. No finding was reopened, and no additional theorem-level defect was found. The following refinements were nevertheless made during this iteration.

- **Sinkhorn empirical-process proof:** the one-marginal comparison is now derived from the exact optimal-value sandwich, without the previous informal constant. The proof explicitly distinguishes the random pathwise class of the two realized optimal potentials from the deterministic regularity class used in the entropy bound, introduces the random common subgaussian proxy required by the empirical measure, and uses its moment estimates before taking expectations.
- **Finite-support regularization bias:** the argument now identifies the product-reference KL as mutual information, states the discrete Shannon entropies locally, and derives the cross- and self-cost contributions to the debiased bound explicitly.
- **Behavior at the diagonal:** the informal two-point discussion was replaced by the concrete path $\alpha_t=((1+t)/2,(1-t)/2)$, $\beta_t=((1-t)/2,(1+t)/2)$, for which $W_p^p=t$ and $W_p=t^{1/p}$. This makes the distinction between the first-order behavior of $W_p$ and $W_p^p$ exact.
- **Endpoint qualifications:** the linear-attention identity now states its positive-denominator condition, and theorem punctuation was normalized. A rendered-page check found and removed one orphan period below the MMD bound.
- **Notebook integrity:** the four source-linked notebooks remain valid JSON with sequential execution counts $1{:}6$, $1{:}5$, $1{:}7$, and $1{:}3$, respectively, and no retained error output.
- **Final source fingerprint:** 1,401 physical lines, 115,572 bytes; SHA-256 `9f0b8b044db9a1dca823666db2a9bb07a9470080033e866a1978dc0d4470f0b1`.
- **Final build and visual QA:** the book compiles to 490 pages (28,855,241 bytes). The log has no undefined citation, unresolved reference, rerun request, or overfull box. The revised pages for Proposition 10.12, the finite-support bias calculation, Proposition 10.18, its diagonal discussion, and Figure 10.4 were rendered and inspected without clipping, collision, or stranded punctuation.

## Executive Result

The original audit retained **16 findings: 0 Critical, 1 Major, 8 Moderate, and 7 Minor**. All are now resolved by the correction pass recorded above.

| Severity | IDs | Count |
|---|---|---:|
| Critical | none | 0 |
| Major | C10-MAJ-01 | 1 |
| Moderate | C10-MOD-01 through C10-MOD-08 | 8 |
| Minor | C10-MIN-01 through C10-MIN-07 | 7 |
| **Total** | **16 unique IDs** | **16** |

Arithmetic check: $0+1+8+7=16$.

### Second-Pass Disposition

All 16 first-pass finding IDs were stress-tested against the source, direct calculations, retained notebook state, and primary sources.

| Disposition | Count | IDs or scope |
|---|---:|---|
| Reconfirmed without a material root-cause or severity change | 14 | C10-MAJ-01; C10-MOD-01, C10-MOD-02, C10-MOD-05 through C10-MOD-08; C10-MIN-01 through C10-MIN-07 |
| Materially refined, same stable ID and severity | 2 | C10-MOD-03 was narrowed to an under-specified continuum assertion; C10-MOD-04 was expanded to include the missing empirical support-site hypothesis. |
| Removed, downgraded, upgraded, split, merged, or assigned a new finding ID | 0 | none |
| Additional candidate defects tested and rejected | 2 | the obsolete $d'=2\lceil d/2\rceil$ map-rate exponent from an older paper version; interpreting the $d=3$, $W_2$ $n^{-1/3}$ plotting guide as the chapter's distribution-free empirical rate. |

Disposition arithmetic: $14+2=16$ retained first-pass IDs; 0 severity changes and 0 new IDs.

The central mathematical defect is the universal diagonal differentiability assertion for exact OT. On a two-point space, the directional derivative of $W_p^p$ at equality is nonzero, and the derivative of $W_p$ is either nonzero ($p=1$) or infinite along the same direction ($p>1$). The chapter's neighboring finite-space discussion already contains the ingredients needed to state the correct directional result.

The most consequential numerical defect is that the sample-complexity notebook labels a debiased sum of regularized-plan transport terms as the KL-normalized Sinkhorn divergence. POT's `sinkhorn2` deliberately omits the entropy term. A separate defect in the same figure is that the notebook plots a square root under the null, while the caption calls it the divergence itself and compares it to an $n^{-1/2}$ guide. Correcting the KL objective preserves the qualitative slope of the square-root plot, but it does not repair either identity claim.

The positive-feature construction is an exact expectation identity, but it is not the construction analyzed by Scetbon and Cuturi. Its naive Monte Carlo kernel summands have infinite variance for $0<p<2$ and exponentially large variance for $p=2$. Consequently, unbiasedness and $O((n+m)r)$ arithmetic per scaling sweep do not supply a rank-accuracy or end-to-end complexity guarantee.

No defect was found in the Wasserstein LLN, the sharp lattice and smooth-density CLT constants, the three empirical $r_{n,p,d}$ regimes, the dyadic and Assouad exponents, the signed flat-top smoothing argument, the MMD bound, the quoted entropic-map rate under its full hypotheses, the sliced-$W_1$ constants, the finite-support Gaussian variance formula, the Horn witness, the complete-positivity equivalence, or the core Nystrom rank and complexity translation within its stated range. These checks are recorded in the validated-correct ledger.

## Severity Rubric

- **Critical:** invalidates a central theorem or a substantial downstream development and has no local repair.
- **Major:** a false central claim or a scope error requiring substantial conceptual restructuring.
- **Moderate:** a substantive but localized theorem, derivation, experiment, caption, or attribution defect.
- **Minor:** a normalization, endpoint, provenance, terminology, citation-scope, or edge-case defect with a contained repair.

## Findings

### Critical

No Critical finding was established.

### Major

#### C10-MAJ-01 - Exact OT does not have a universally vanishing first derivative on the diagonal

**Source lines:** 986 and 1008, especially the sentence at line 1008 beginning “For instance, when $\epsilon=0$, $c=\dist^p$, and $\alpha=\beta$, the first derivative vanishes.” The adjacent Sinkhorn clause is also at line 1008.

**Current claim:** at equality of the population laws, the first derivative of the exact transport cost vanishes, so the empirical null behavior is necessarily a higher-order matching phenomenon; the debiased Sinkhorn divergence then has a nontrivial second-order limit.

**Diagnosis:** there is no universal zero derivative. The answer depends on whether the functional is $W_p$ or $W_p^p$, on the geometry and support, on the perturbation topology, and on whether “derivative” means a linear Hadamard derivative or a one-sided directional derivative. The finite-space exact OT functional is typically only directionally differentiable at the diagonal, with a nonlinear and nonzero derivative.

**Minimal counterexample:** let $\mathcal X=\{0,1\}$ with $d(0,1)=1$, let

\[
\alpha=(1/2,1/2),\qquad h=(1/2,-1/2),\qquad k=-h,
\]

and set $\alpha_t=\alpha+th$, $\beta_t=\alpha+tk$ for $t\downarrow0$. The source excess at $0$ is exactly $t$, and it must cross distance one. Hence, for every $p\geq1$,

\[
\MK_{d^p}(\alpha_t,\beta_t)=W_p(\alpha_t,\beta_t)^p=t,
\qquad
W_p(\alpha_t,\beta_t)=t^{1/p}.
\]

Thus the right directional derivative of $W_p^p$ is $1$, not $0$. For $W_1$ the derivative is also $1$; for $W_p$ with $p>1$, the quotient $t^{1/p}/t$ diverges. This is also the relevant finite-support empirical direction: a difference of two multinomial proportions is $O_{\mathbb P}(n^{-1/2})$, so $W_p^p$ has a first-order, generally non-Gaussian null limit there.

**Absolutely continuous lift:** the failure is not confined to atoms. Let $\mu_A$ and $\mu_B$ be the uniform laws on $A=[0,1]$ and $B=[3,4]$, let $\alpha=(\mu_A+\mu_B)/2$, and perturb the two component weights oppositely:

\[
\alpha_t=\frac{1+t}{2}\mu_A+\frac{1-t}{2}\mu_B,
\qquad
\beta_t=\frac{1-t}{2}\mu_A+\frac{1+t}{2}\mu_B.
\]

Every coupling must move mass $t$ from $A$ to $B$. Since the gap is 2, while translation by 3 gives a feasible transfer,

\[
2^p t\le W_p(\alpha_t,\beta_t)^p\le3^p t.
\]

Thus even for an absolutely continuous law on a bounded subset of $\mathbb R$, the lower directional slope is strictly positive. A connected-support or comparable tangent-regularity hypothesis is essential.

**Why a smooth connected model can look different:** for regular mass-preserving tangent perturbations of a positive smooth density on a connected domain, one can have

\[
W_p(\alpha+th,\alpha+tk)=t\,\|h-k\|_{T_\alpha,p}+o(t),
\]

so $W_p$ still has a generally nonzero norm-like directional derivative. Only after taking the $p$th power does the first variation vanish for $p>1$. That conclusion is model-, topology-, and functional-specific and does not cover singular empirical directions.

**Adjacent entropic overstatement:** fixed-temperature Sinkhorn divergence has first-order cancellation under the regularity assumptions of the cited second-order delta method, and its null scale is $n^{-1}$. The resulting quadratic-form limit may nevertheless be degenerate. A one-point space makes the statistic identically zero. Calling the limit “nontrivial” therefore requires a nondegeneracy hypothesis. The primary paper establishes second-order differentiability and the null scaling, not universal nondegeneracy: [Goldfeld, Kato, Rioux, and Sadhu (2024)](https://doi.org/10.1214/24-EJS2217).

**Minimal repair:** replace the universal sentence by a taxonomy. State that finite/disconnected supports and empirical directions can be first order; $W_p$ has a norm-like directional behavior in regular continuous models; $W_p^p$ can have zero first variation for $p>1$ only in specified smooth tangent topologies; and the entropic $n$-scaled null limit is a possibly degenerate quadratic form.

**Downstream impact:** the finite-space proposition at lines 937-986 remains correct and in fact already warns that nonunique exact dual optimizers give non-Gaussian limits. The defect is the later universal synthesis, not the preceding CLT theorem. The finite-space directional behavior is documented in [Sommerfeld and Munk (2018)](https://academic.oup.com/jrsssb/article/80/1/219/7048419).

### Moderate

#### C10-MOD-01 - The bias-variance notebook computes a different functional from the defined Sinkhorn divergence

**Source lines:** 357-370 and the KL-normalized definitions at 897-922. **Notebook lines:** `notebooks-figures/sinkhorn-bias-variance-tradeoff.ipynb:232-273`, especially the `ot.sinkhorn2` call at line 247.

**Current claim:** the purple curve is the fixed-$\epsilon$ Sinkhorn divergence formed from three complete KL-regularized OT values.

**Diagnosis:** in the installed POT 0.9.6.post1 implementation used by the notebook, `ot.sinkhorn2(a,b,C,reg)` computes the entropic optimizer $P_\epsilon$ but returns only $\langle C,P_\epsilon\rangle$. The official documentation states explicitly that the entropic contribution is omitted: [POT `sinkhorn2` documentation](https://pythonot.github.io/gen_modules/ot.bregman.html#ot.bregman.sinkhorn2). The notebook subtracts three such linear terms. It does not evaluate

\[
\MK_C^\epsilon(a,b)
=\langle C,P_\epsilon\rangle
+\epsilon\KL(P_\epsilon\mid a\otimes b).
\]

The product-marginal constants in the KL expansion cancel under debiasing, but the three plan-entropy terms do not. The optimizer is the same under the Shannon and product-KL conventions, while the returned value is not.

**Independent replay:** using the notebook's exact sizes, seeds, repetitions, and temperatures, the all-size/last-four log-log slopes of the plotted square root changed as follows when the omitted KL terms were restored:

| Dimension | Transport-term-only slopes | Full-KL slopes |
|---:|---:|---:|
| 3 | -0.404 / -0.414 | -0.446 / -0.453 |
| 6 | -0.331 / -0.355 | -0.392 / -0.410 |

At the seven sample sizes, the transport-only median was 1.16 to 1.30 times the corrected median in $d=3$ and 1.28 to 1.47 times it in $d=6$. The qualitative movement toward a $-1/2$ slope survives, but every ordinate and the functional label change.

**Minimal repair:** obtain the plan and evaluate the full KL objective for each cross and self pair, with the convention written next to the code. Regenerate both PDFs and describe the solver tolerance and repetition count in the caption. Alternatively, relabel the current curve as a “debiased transport component of entropic plans,” but it must not be called the Sinkhorn divergence.

**Downstream impact:** this invalidates the numerical identity in one figure, not Proposition 575-589. The corrected replay supports the same qualitative square-root slope.

#### C10-MOD-02 - The rounded Mena-Niles-Weed exponent is not justified for every temperature

**Source lines:** 575-589, especially the definition of $q_d,b_d$ at 580-587; the scaling step at 650-652; and the small-$\epsilon$ consequence at 686-699.

**Current claim:** for every $\epsilon>0$, the rescaled unit-temperature bound is at most

\[
C_d\epsilon\left(1+\frac{\sigma^{q_d}}{\epsilon^{b_d}}\right)n^{-1/2},
\quad q_d=\left\lceil\frac{5d}{2}\right\rceil+6,
\quad b_d=\left\lceil\frac{q_d}{2}\right\rceil.
\]

**Diagnosis:** the unit-temperature result and the dilation $x\mapsto x/\sqrt\epsilon$ give the secure expression

\[
C_d\epsilon\left[1+\left(\frac{\sigma}{\sqrt\epsilon}\right)^{q_d}\right]n^{-1/2}.
\]

When $q_d$ is odd, replacing $q_d/2$ by $b_d=(q_d+1)/2$ while retaining the numerator $\sigma^{q_d}$ is not a uniform domination over $\sigma,\epsilon>0$. Let $T\to\infty$, set $\epsilon=T^2$ and $\sigma=T^{1+1/q_d}$. Then

\[
\left(\frac{\sigma}{\sqrt\epsilon}\right)^{q_d}=T,
\qquad
\frac{\sigma^{q_d}}{\epsilon^{b_d}}=1.
\]

No dimension-only constant makes the asserted comparison valid. For $0<\epsilon\leq1$, the rounding is harmless, and if $q_d$ is even there is no rounding gap.

**Citation status:** Corollary 1 of the cited paper prints the same rounded expression, but its displayed scaling argument starts from the same half-integer exponent and does not supply a separate large-temperature estimate. The chapter has inherited, rather than repaired, that algebraic gap. See the [primary NeurIPS paper](https://proceedings.neurips.cc/paper/2019/file/5acdc9ca5d99ae66afdfe1eea0e3b26b-Paper.pdf).

**Minimal repair:** retain $\epsilon[1+(\sigma/\sqrt\epsilon)^{q_d}]$ for all temperatures, or state the rounded formula only for $0<\epsilon\leq1$. A separate large-temperature estimate could also be proved and combined with the scaled bound.

**Downstream impact:** the fixed-temperature parametric $n^{-1/2}$ conclusion remains. The small-$\epsilon$ discussion uses $\epsilon\leq1$, where the rounded upper bound is valid, but the proposition's “every $\epsilon>0$” scope and proof are not.

#### C10-MOD-03 - The $O(\epsilon)$ Sinkhorn-to-exact balancing premise is under-specified and fails for bounded continuum laws

**Source lines:** 686-699, especially 688-695.

**Current claim:** without defining the intended “typical bounded-cost finite-dimensional regime,” the text uses

\[
\left|\bar\MK_c^\epsilon(\alpha,\beta)-\MK_c(\alpha,\beta)\right|\le C\epsilon,
\]

as the deterministic bias input and balances it with the statistical term to obtain the displayed tuning rule. The wording is not a fully quantified universal theorem, but its stated descriptors do include the following compact finite-dimensional example.

**Counterexample within bounded Euclidean quadratic cost:** embed the unit circle in $\mathbb R^2$, use $c(x,y)=\|x-y\|^2/2$, let $\alpha=\delta_{(1,0)}$, and let $\beta$ be uniform on the circle. The cross coupling is unique and equals $\alpha\otimes\beta$, so its KL penalty is zero and $\MK_c^\epsilon(\alpha,\beta)=\MK_c(\alpha,\beta)$ for all $\epsilon$.

For the self-pair $(\beta,\beta)$, rotation invariance and strict convexity give the Gibbs difference density

\[
q_\epsilon(\theta)=Z_\epsilon^{-1}
\exp\left(-\frac{1-\cos\theta}{\epsilon}\right),
\qquad
Z_\epsilon=\int_{-\pi}^{\pi}
\exp\left(-\frac{1-\cos\theta}{\epsilon}\right)\frac{d\theta}{2\pi}.
\]

Its complete KL objective is $-\epsilon\log Z_\epsilon$. Laplace's method gives $Z_\epsilon\sim\sqrt{\epsilon/(2\pi)}$, hence

\[
\MK_c^\epsilon(\beta,\beta)
=\frac{\epsilon}{2}\log\frac1\epsilon+O(\epsilon).
\]

Because both exact self-costs vanish,

\[
\bar\MK_c^\epsilon(\alpha,\beta)-\MK_c(\alpha,\beta)
=-\frac12\MK_c^\epsilon(\beta,\beta)
=-\frac{\epsilon}{4}\log\frac1\epsilon+O(\epsilon),
\]

which is not $O(\epsilon)$.

**Minimal repair:** state a fixed-finite-support version, where a constant depending on support cardinalities follows from entropy bounds, or give precise regularity and common-dimensionality assumptions under which Sinkhorn debiasing cancels the leading term. In a general bounded continuum statement, allow an $\epsilon\log(1/\epsilon)$ term. The compact-support convergence estimates in [Genevay et al. (2019)](https://proceedings.mlr.press/v89/genevay19a.html) should not be silently strengthened; for compactly supported $L^\infty$ marginals under nondegeneracy hypotheses on the cost, raw regularized-OT asymptotics with an $\epsilon\log(1/\epsilon)$ leading scale are documented by [Carlier, Pegon, and Tamanini (2022)](https://arxiv.org/abs/2206.03347).

**Downstream impact:** the qualitative bias-variance tradeoff remains, but the displayed balance can acquire logarithmic factors and its constant is not distribution-free.

#### C10-MOD-04 - The empirical barycentric proposition is ill-defined for duplicate or out-of-domain source sites

**Source lines:** 752-769, especially the definition at 758-765; proof lines 779-789.

**Current claim:** for every empirical coupling matrix, $\bar T_{n,m}^\epsilon(X_i)=n\sum_jP_{ij}^\epsilon Y_j$ defines a function on the support of $\hat\alpha_n$, and its integral against $\hat\alpha_n$ equals the indexed average.

**Counterexample:** take $X_1=X_2=0$, $Y_1=-1$, $Y_2=1$, uniform weights, $\epsilon=0$, and

\[
P=\frac12\begin{pmatrix}1&0\\0&1\end{pmatrix}.
\]

Both rows represent a valid optimal indexed coupling, but the formula assigns $\bar T(0)=-1$ through the first row and $\bar T(0)=1$ through the second. It is a map on sample indices, not a single-valued map on the measure support. The disintegration of the aggregated coupling at the unique source location instead has barycenter zero.

**Scope:** atomless i.i.d. sampling makes duplicates a null event. For positive entropy, uniqueness plus permutation symmetry forces equal rows for equal locations and equal weights. Neither qualification appears in the deterministic proposition, which also includes $\epsilon=0$ and arbitrary convergent empirical sequences.

**Independent domain defect:** lines 758-765 choose $T$ only on $\Omega$ but do not assume $X_i,Y_j\in\Omega$. Wasserstein convergence to laws supported on compact $\Omega$ does not impose that pointwise condition. Starting from any valid empirical approximation, replace one source site by a point $z_n$ at distance $n^{1/4}$ from $\Omega$. Moving its mass $1/n$ back to the original site costs $O(n^{-1/2})$ in squared $W_2$ cost, so the modified empirical measures still converge in $W_2$, while $T(z_n)$ in the displayed average is undefined. The proof's weak-plan compactness can be recovered from $W_2$ tightness; it does not cure the undefined evaluation.

**Minimal repair:** require all empirical sites to lie in $\Omega$ (or specify a suitable global extension of $T$), and then either assume pairwise distinct $X_i$; state the estimate for indexed values $\bar T_i$ rather than a support function; or aggregate duplicate locations and disintegrate the coupling with respect to the aggregated empirical measure. The last option makes the integral notation literally correct.

**Downstream impact:** the convergence mechanism survives after these repairs. As written, however, the estimated map can be multivalued at repeated atoms and the comparator can be undefined at admissible empirical sites.

**Primary evidence:** the quantified proposition and proof are in the [protected chapter source](OT4ML/sections/statistical-ot.tex); the counterexamples above use only its stated deterministic hypotheses.

#### C10-MOD-05 - The generalized positive features have uncontrolled variance and are misattributed to Scetbon-Cuturi

**Source lines:** 1269-1306 and 1317-1338, especially the attribution at 1269 and the use as sketching features at 1289-1290 and 1325-1328.

**Current claim:** the simple exponential Gaussian feature is the construction exploited by Scetbon and Cuturi and provides positive sketching features for $e^{-\|x-y\|^p/\epsilon}$, $0<p\le2$.

**What is correct:** the expectation identity is exact. With $u=x-x_0$, $v=y-x_0$, and

\[
F_{x,y}=\phi_{p,\epsilon}(x;\Lambda,Z)
\phi_{p,\epsilon}(y;\Lambda,Z),
\]

conditioning on $\Lambda$ gives $\mathbb E_ZF_{x,y}=e^{-\Lambda\|u-v\|^2}$, and stable mixing gives the desired generalized Gaussian kernel.

**Variance calculation:** a second Gaussian-moment calculation gives

\[
\mathbb E_Z[F_{x,y}^2\mid\Lambda]=e^{8\Lambda\langle u,v\rangle}.
\]

In particular, at $x=y\ne x_0$,

\[
\mathbb E[F_{x,x}^2]
=\mathbb E e^{8\Lambda\|x-x_0\|^2}.
\]

For $0<p<2$, the positive $p/2$-stable variable has no positive exponential moments, so this kernel-summand variance is infinite. For $p=2$, $\Lambda=1/\epsilon$ and the second moment is $e^{8\|x-x_0\|^2/\epsilon}$, which is finite but exponentially large. Proposition 1074-1094 cannot be applied because its bounded-product hypothesis fails.

**Attribution check:** Scetbon and Cuturi explicitly say that a previously known simple Gaussian decomposition does not satisfy their relative boundedness assumptions. They construct a different localized Gaussian feature on a bounded ball, with parameters involving the Lambert $W$ function, precisely to obtain a uniform relative-feature bound. See Section 3.2 and Lemma 1 of the [primary NeurIPS paper](https://proceedings.neurips.cc/paper/2020/hash/9bde76f262285bb1eaeb7b40c758b53e-Abstract.html).

**Minimal repair:** correct the attribution; state that the displayed formula is an unbiased positive representation but supplies no useful variance or rank guarantee; and either use the bounded-domain Scetbon-Cuturi feature, or analyze truncation, clipping bias, importance sampling, or robust averaging. Any clipping claim must quantify the induced kernel and cost bias.

**Downstream impact:** $O((n+m)r)$ arithmetic for one sketched scaling sweep remains true. What is missing is a bound on the $r$ needed for kernel, logarithmic-cost, plan, or transport-value accuracy, so no end-to-end linear-time approximation conclusion follows from this Monte Carlo construction alone.

#### C10-MOD-06 - The sample-complexity figure conflates a null square root with the Sinkhorn divergence itself

**Source lines:** 357-370, especially 357 and caption line 367; the chapter's correct second-order null warning is at 1008. **Notebook lines:** 167-174 and 259-273.

**Current claim:** the plotted fixed-$\epsilon$ Sinkhorn divergence behaves near the parametric $n^{-1/2}$ guide.

**Diagnosis:** both empirical laws are sampled from the same Gaussian population. The notebook takes `sqrt(max(value,0))` after debiasing. Even after C10-MOD-01 is repaired, the raw fixed-temperature Sinkhorn divergence under this null is second order and is $O_{\mathbb P}(n^{-1})$ under the regularity assumptions of the cited null-limit theory. Its square root is therefore $O_{\mathbb P}(n^{-1/2})$. The figure illustrates a distance-like square root in a null experiment, not $n^{-1/2}$ first-order fluctuations of the raw divergence under an alternative.

**Minimal repair:** state explicitly that the plotted quantity is $\sqrt{\bar\MK_c^\epsilon}$, that the two laws coincide at population level, and that the guide reflects a square root of an $n^{-1}$ second-order null statistic. Plot the raw divergence with an $n^{-1}$ guide if the goal is to illustrate the null theorem; use distinct populations if the goal is to illustrate the ordinary first-order fixed-temperature CLT.

**Downstream impact:** the visual comparison between distance-like quantities remains pedagogically usable. The caption cannot be used as evidence for the exact functional or for the alternative-regime first-order statement.

**Primary evidence:** the square-root transform is retained in the [figure notebook](notebooks-figures/sinkhorn-bias-variance-tradeoff.ipynb), while the second-order null theory is in [Goldfeld et al. (2024)](https://doi.org/10.1214/24-EJS2217).

#### C10-MOD-07 - The rank-40 positive-feature caption contradicts the retained diagnostics and hides numerical flooring

**Source lines:** 1343 and 1358-1359. **Notebook lines:** retained diagnostics at 317-345; logarithmic diagnostics at 430-448; flooring at 397, 440, and 667; display clipping at 776-789.

**Current claim:** a sufficiently large rank is visually accurate, and rank 40 “remains close to the dense computation” in both the plan and entrywise logarithmic cost.

**Diagnosis and retained rank-40 diagnostics:** the [primary figure notebook](notebooks-figures/sinkhorn-positive-feature-sketching.ipynb) itself reports

| Diagnostic | Rank 40 value |
|---|---:|
| Median $\lvert\log K_r-\log K\rvert$ | 1.87965 |
| $P$-weighted 99th percentile of $\lvert\log K_r-\log K\rvert$ | 169.573 |
| Plan $\ell^1$ error | 0.734945 |
| $P$-weighted log RMSE | 48.9330 |
| Maximum displayed effective-cost error | 10.6089 |

The maximum possible $\ell^1$ distance between probability plans is 2, so 0.735 is not an unqualified notion of closeness. The very small marginal residual only proves that Sinkhorn solved the sketched marginal constraints.

**Independent floating-point check:** with $\epsilon=0.02$ and the grid $[-2.2,2.2]$, the exact mathematical cost reaches 19.36. Flooring at $10^{-300}$ caps $-\epsilon\log K$ at 13.8155. The exact and rank-40 matrices each contain 380 floating-point zeros; rank 10 contains 386 and rank 3 contains 566. The rendering additionally clips effective costs to the 70th percentile of the exact cost matrix. These are defensible display choices but are not disclosed.

**Minimal repair:** replace “remains close” by a metric-specific description consistent with the diagnostics; disclose the $10^{-300}$ floor and percentile clipping; and report plan plus log-kernel errors in the caption or adjacent text. A genuinely accurate panel needs a larger or better-conditioned feature construction.

**Downstream impact:** the figure still demonstrates that coarse positive factorizations preserve prescribed marginals while distorting geometry. It does not demonstrate logarithmic kernel accuracy at rank 40.

#### C10-MOD-08 - The Berry-Esseen notebook adds the wrong Gaussian tail integral

**Source lines:** 202-208, which call the plotted one-dimensional values exact numerical distances. **Notebook line:** `notebooks-figures/statistical-berry-esseen-w1.ipynb:447`.

**Current implementation:** after integrating the absolute CDF gap on $[0,R]$ and doubling by symmetry, with $R=\sqrt{3n}$, the code adds `2*ndtr(-radius)`.

**Diagnosis:** the retained implementation in the [primary figure notebook](notebooks-figures/statistical-berry-esseen-w1.ipynb) confuses a Gaussian tail probability with the integral of that tail.

**Correct tail:** outside the support, the positive-side contribution is

\[
\int_R^\infty(1-\Phi(x))\,dx
=\varphi(R)-R\Phi(-R),
\]

and the two tails contribute $2[\varphi(R)-R\Phi(-R)]$, not $2\Phi(-R)$.

**Numerical effect:** the bug is substantial in the finite-$n$ snapshots and negligible in the asymptotic tail of the rate plot.

| $n$ | Stored formula | Correct $W_1$ | Relative excess |
|---:|---:|---:|---:|
| 1 | 0.203730292342 | 0.154279512181 | 32.05% |
| 2 | 0.055026898332 | 0.045403250585 | 21.20% |
| 6 | 0.013279858640 | 0.013262512879 | 0.131% |
| 16 | 0.00481040914194 | 0.00481040913827 | $7.6\times10^{-8}$% |

At $n=160$ the difference is below displayed precision, so the $n^{-1}$ conclusion and sharp constant are unaffected.

**Minimal repair:** replace the final term by `2*(gaussian_pdf(radius) - radius*ndtr(-radius))`, regenerate `comparison.pdf`, and update any retained output values.

**Downstream impact:** the theorem and asymptotic constant remain correct. The defect is the “exact numerical distance” claim and the low-order solid curve/snapshots.

### Minor

#### C10-MIN-01 - The exact-OT Nystrom tuning can leave the proposition's certified temperature range

**Source lines:** 1150, 1183, and 1186.

**Current claim:** Proposition 1148-1180 assumes $\epsilon\in[1/N,1]$ and is followed by the unrestricted choice $\epsilon\asymp\tau/\log N$ to approximate exact OT.

**Diagnosis:** if $\tau<(\log N)/N$, then $\tau/\log N<1/N$. The consequence is outside the proposition. Contrary to the superseded audit, the range was not invented by the chapter: the primary paper explicitly assumes throughout its main-result section that inverse temperature $\eta\in[1,N]$, equivalent to $\epsilon\in[1/N,1]$. Its effective-dimension corollary is stated for all $\eta>0$, but the full algorithmic theorem is presented under the standing range. See the [primary Nystrom paper](https://proceedings.neurips.cc/paper/2019/file/f55cadb97eaff2ba1980e001b0bd9842-Paper.pdf).

**Minimal repair:** add $\tau\gtrsim(\log N)/N$ to this local consequence, or state and prove the extension of the full algorithmic guarantee outside the normalized range. Do not claim that the cited theorem itself lacks the range.

**Downstream impact:** the rank dependence within the proposition is correct. Only the unrestricted extrapolation to arbitrarily small target accuracy is uncertified locally.

#### C10-MIN-02 - The coupon-collector threshold is stated with an ambiguous stronger asymptotic

**Source lines:** 1001-1006, especially 1006.

**Current claim:** for nearly uniform weights, making the probability of an unobserved atom vanish “requires” $n\gg N\log N$ and $n\gg M\log M$.

**Diagnosis:** for $N$ uniform atoms,

\[
\Pr(\hbox{some atom unseen})\le N e^{-n/N}.
\]

The sharp vanishing threshold is $n=N\log N+\omega(N)$, equivalently $n/N-\log N\to\infty$. If `\gg` means a diverging ratio, it is sufficient but not necessary; if it means a sufficiently large constant multiple, it is imprecise about the desired failure probability.

**Minimal repair:** write $n\ge N(\log N+\log(1/\delta))$ for failure probability at most $\delta$, and similarly for $M$.

**Downstream impact:** none for the fixed-support CLT. This only sharpens the support-coverage warning.

**Primary evidence:** the threshold claim appears in the [protected chapter source](OT4ML/sections/statistical-ot.tex); the displayed union bound and the uniform coupon-collector calculation establish the correction directly.

#### C10-MIN-03 - The Bochner feature paragraph omits the spectral-mass normalization

**Source lines:** 1032-1067, especially the probability-feature convention at 1038 and the Bochner paragraph at 1067.

**Current claim:** a positive spectral measure $\Lambda$ can be used directly with features $(\cos\langle\omega,x\rangle,\sin\langle\omega,x\rangle)$ in the preceding probability-feature Monte Carlo construction.

**Diagnosis:** Bochner's measure has total mass $\Lambda(\mathbb R^d)=\kappa(0)$. It is a probability measure only for normalized kernels with $\kappa(0)=1$. In general, sample from $\rho=\Lambda/\kappa(0)$ and multiply the feature by $\sqrt{\kappa(0)}$.

**Minimal repair:** assume $\kappa(0)=1$ explicitly or include the mass factor. The Gaussian example immediately following is already normalized.

**Downstream impact:** no effect on the Gaussian formulas used later.

**Primary evidence:** the probability normalization is explicit in [Rahimi and Recht's primary NeurIPS paper](https://proceedings.neurips.cc/paper_files/paper/2007/file/013a006f03dbc5392effeb8f18fda755-Paper.pdf).

#### C10-MIN-04 - The attention analogy omits normalization and groups unlike approximations

**Source lines:** 1363-1366.

**Current claim:** positive-feature attention can be applied as $\Phi(Q)(\Phi(K)^TV)$, with Performer, Linformer, and Nystromformer cited as instances of the same algebra.

**Diagnosis:** row-normalized kernel attention requires

\[
y_i=
\frac{\phi(q_i)^T\sum_j\phi(k_j)v_j}
{\phi(q_i)^T\sum_j\phi(k_j)}.
\]

The displayed associative product is only the numerator. Performer and linear transformers use kernel-feature algebra; Linformer projects the sequence dimension; Nystromformer uses landmark/Nystrom reconstruction. The citations are related computationally but do not all support the stated positive-feature identity.

**Minimal repair:** display numerator and denominator, cite the exact feature mechanism locally, and describe Linformer and Nystromformer separately as related low-rank methods.

**Downstream impact:** none for Sinkhorn; this is a final analogy.

**Primary evidence:** the normalized feature-attention denominator appears in the [Linear Transformers paper](https://proceedings.mlr.press/v119/katharopoulos20a.html); the chapter's four cited mechanisms are separately inventoried below.

#### C10-MIN-05 - “Regularization bias disappears only when $\epsilon\to0$” has degenerate counterexamples

**Source line:** 922.

**Current claim:** the raw regularization bias disappears only in the zero-temperature limit.

**Counterexample:** if either marginal is a Dirac mass, the feasible coupling is unique and equals $\alpha\otimes\beta$. Its product-relative KL is zero, so $\MK_c^\epsilon(\alpha,\beta)=\MK_c(\alpha,\beta)$ for every $\epsilon>0$. Other uniquely forced product couplings give the same phenomenon.

**Minimal repair:** write that regularization bias “does not generally vanish at fixed temperature and is controlled uniformly by sending $\epsilon\to0$.”

**Downstream impact:** none for the generic tradeoff; this removes an absolute quantifier.

**Primary evidence:** the absolute statement is in the [protected chapter source](OT4ML/sections/statistical-ot.tex); the unique feasible product coupling supplies the counterexample without an external theorem.

#### C10-MIN-06 - Three retained notebooks do not record a clean restart-and-run-all execution

**Source figure lines:** 205-210, 359-371, 1236-1242, and 1345-1361. **Notebook evidence:** execution-count inventories in the provenance table below.

**Current provenance implication:** retained outputs are presented as reproducible figure evidence.

**Diagnosis:** the Berry notebook is internally sequential, with all five code cells executed as counts 1-5. The bias-variance notebook has an unexecuted bootstrap cell followed by counts 1-5, which is locally plausible because its imports are self-contained. The completely-positive notebook records only its final code cell as executed, although that cell depends on two unexecuted setup cells. The positive-feature notebook records counts 1-4 while two rendering-helper cells needed by the final output have `None` execution counts. These retained states cannot be the literal trace of a clean kernel execution represented by the notebook.

**Minimal repair:** restart and run all four notebooks in a controlled environment, retain sequential execution counts, record package versions, and regenerate the chapter PDFs only after the mathematical/code defects are fixed.

**Downstream impact:** this is a provenance weakness, not proof that the stored figures are fabricated. Independent arithmetic checks reproduced the key diagnostics without writing artifacts.

**Primary evidence:** the retained JSON states are the four notebooks inventoried under Numerical and Figure Provenance below; in particular, see the [bias-variance notebook](notebooks-figures/sinkhorn-bias-variance-tradeoff.ipynb) and [positive-feature notebook](notebooks-figures/sinkhorn-positive-feature-sketching.ipynb).

#### C10-MIN-07 - The completely-positive notebook title uses a different established concept

**Source lines:** 1196-1234 correctly define and use “completely positive.” **Notebook line:** `notebooks-figures/sinkhorn-doubly-positive-counterexample.ipynb:8` says “not Totally Positive.”

**Current claim:** the [primary figure notebook](notebooks-figures/sinkhorn-doubly-positive-counterexample.ipynb) titles the Horn-witness example as a failure of total positivity.

**Diagnosis:** total positivity is an established and different matrix/kernel property involving signs of minors. The Horn certificate concerns complete positivity, not total positivity. The notebook body and manuscript use the correct term; only the title is wrong.

**Minimal repair:** rename the notebook heading to “Doubly Nonnegative but Not Completely Positive Kernel,” or “Doubly Positive but Not Completely Positive Kernel” if retaining the chapter's kernel terminology.

**Downstream impact:** none for the mathematics or generated panel.

## Validated-Correct Ledger

The following are affirmative checks, not findings. Each item was independently rederived or compared with its defining source and primary citation.

| ID | Source lines | Claim independently validated |
|---|---:|---|
| C10-OK-01 | 43-82 | Weak convergence plus convergence of the $p$th moment gives almost-sure $W_p$ convergence on a Polish space; de la Vallee-Poussin and Jensen correctly give uniform integrability and convergence in $p$th mean. |
| C10-OK-02 | 97-121 | The Stein leave-one-out proof gives $W_1(\alpha_n,\gamma)\le C\mathbb E\lvert X\rvert^3/\sqrt n$ under centering, unit variance, and a finite third absolute moment. |
| C10-OK-03 | 128-156 | The integrated lattice Edgeworth term averages $\lvert1/2-\{u\}\rvert$ to $1/4$, yielding $\sqrt n W_1\to h/4$ for a maximal span $h$. |
| C10-OK-04 | 162-181 | Under the deliberately strong density, symmetry, Cramer, and moment hypotheses, the first surviving CDF Edgeworth term is $-\kappa_4H_3\varphi/(24n)$ and its $L^1$ integral gives the displayed $W_1$ equivalent. |
| C10-OK-05 | 184-200 | Bernoulli has maximal span 2 and constant $1/2$; uniform $[-\sqrt3,\sqrt3]$ has $\kappa_4=-6/5$ and $\int\lvert H_3\rvert\varphi=2\varphi(0)+8\varphi(\sqrt3)$, giving exactly the printed constant. |
| C10-OK-06 | 233-264 | The three $r_{n,p,d}$ regimes correctly describe a distribution-free compact-support upper bound for $\mathbb E[W_p^p]^{1/p}$, including the critical logarithm. |
| C10-OK-07 | 275-355 | The dyadic coupling construction and the binomial cell-mass estimate yield $n^{-1/2}$ in $d=1$, $(\log n)n^{-1/2}$ in $d=2$, and $n^{-1/d}$ for $d\ge3$ in the stated elementary $W_1$ proof. |
| C10-OK-08 | 266-270, 348 | Intrinsic dimension is tied to covering/volume-growth hypotheses rather than asserted from ambient embedding alone, and the critical dyadic bound is explicitly identified as nonsharp for smooth uniform laws. |
| C10-OK-09 | 381-434 | The bounded-density Assouad construction has $M\asymp h^{-d}$ bits, per-bit $W_1$ separation $\asymp\eta h^{d+1}$, and neighbor information $\asymp n\eta^2h^d$; $h\asymp n^{-1/d}$ gives the stated minimax obstruction. |
| C10-OK-10 | 449-497 | The periodic flat-top estimator is deliberately signed; the $H^{-1}$ bias is $h^{s+1}$ and the fluctuation is $n^{-1/2}h^{1-d/2}$ for $d\ge3$, balancing at $h\asymp n^{-1/(d+2s)}$. |
| C10-OK-11 | 500-522 | $4G_h/3-G_{2h}/3$ has unit mass and cancels the quadratic Fourier term, giving order four. The text correctly separates kernel order from unknown-smoothness bandwidth adaptation. |
| C10-OK-12 | 536-567 | For $k(x,x)\le\kappa^2$, Hilbert-space variance and the reverse triangle inequality give the MMD norm error $\kappa(n^{-1/2}+m^{-1/2})$. |
| C10-OK-13 | 591-648 | The fixed-unit-temperature empirical-process reduction, potential derivative/Holder envelope, and finite Dudley integral have the cited exponent $q_d=\lceil5d/2\rceil+6$. C10-MOD-02 concerns only the later all-temperature rounding. |
| C10-OK-14 | 650-651 | The exact scaling identity $\MK_c^\epsilon(\alpha,\beta)=\epsilon\MK_c^1((D_{1/\sqrt\epsilon})_\#\alpha,(D_{1/\sqrt\epsilon})_\#\beta)$ is correct for the quadratic cost and product-KL convention. |
| C10-OK-15 | 663-675 | Cross and self terms of the Sinkhorn divergence can be controlled by one-marginal perturbations, including random empirical other marginals, once their subgaussian proxies are integrated as in the cited argument. |
| C10-OK-16 | 683-684 | Compact support in a radius-$R$ ball implies the chapter's subgaussian condition after translation with $\sigma=R/\sqrt{2d\log2}$. |
| C10-OK-17 | 712-753 | The soft barycentric map formula and its equality with the entropic plan row barycenter at sampled points are algebraically correct when empirical atoms are represented without duplicate ambiguity. |
| C10-OK-18 | 772-793 | Vanishing entropic suboptimality $\epsilon\log\min(n,m)\to0$, weak plan compactness, Brenier uniqueness, and Jensen give map consistency after defining the barycentric object correctly. |
| C10-OK-19 | 799-812 | The Pooladian-Niles-Weed rate and bandwidth match the current arXiv v3 theorem, with dimension $d$, under common compact support, upper density bounds, a target lower density bound, $C^2$ strong convexity, and $C^{s+1}$ conjugate-potential regularity. |
| C10-OK-20 | 819-862 | Projection to $[-R,R]$, Vallender's identity, and $F(1-F)\le1/4$ give the exact dimension-free one-sample constant $R/\sqrt n$ and the stated two-sample sum. |
| C10-OK-21 | 864-887 | Conditional on the data, a sliced-$W_1$ summand lies in $[0,2R]$, has variance at most $R^2$, and contributes $R/\sqrt L$; the joint expectation correctly averages both data and direction randomness. |
| C10-OK-22 | 897-920 | The definitions of $B_{n,m}^\epsilon$ and $Z_{n,m}^\epsilon$ give an exact deterministic regularization-bias plus statistical-bias plus centered-fluctuation decomposition; the barred version follows by linear self-debiasing. |
| C10-OK-23 | 937-977 | On fixed positive supports, a unique normalized dual optimizer makes the directional derivative linear; the multinomial delta method yields the displayed Gaussian variance with covariance $\operatorname{diag}(a)-aa^T$ and its target analogue. |
| C10-OK-24 | 979-984 | For fixed $\epsilon>0$, interior finite-dimensional smoothness and exponentially small boundary escape justify $O(n^{-1}+m^{-1})$ bias and moment convergence. |
| C10-OK-25 | 986 | Without exact-dual uniqueness, the finite-support directional limit can be non-Gaussian with nonzero mean, so an $n^{-1/2}$ exact-OT bias is possible. |
| C10-OK-26 | 1032-1062 | The rectangular source-target kernel is correctly represented as a cross-block of a Gram factorization; rank is $R=rp$, and one product costs $O((n+m)R)$. |
| C10-OK-27 | 1074-1108 | Under the explicit bounded feature-product hypothesis, Hoeffding plus a union bound gives the printed $2nm\exp[-rK_{\min}^2\delta^2/(2M^2)]$ bound and the $2\epsilon\delta$ log-cost error. |
| C10-OK-28 | 1132-1184 | Within $\epsilon\in[1/N,1]$, the Nystrom positivity, rank, value/plan accuracy, $\widetilde O(NR(R+D^4/(\epsilon\tau)))$ time, and $O(N(R+d))$ memory correctly translate the cited theorem. |
| C10-OK-29 | 1196-1227 | For continuous finite PSD kernels on a separable metric space, complete positivity of every finite Gram restriction is equivalent to a global nonnegative scalar $L^2$ feature representation; the compactness construction is sound. |
| C10-OK-30 | 1229-1267 | $\mathrm{CP}_n\subset\mathrm{DNN}_n$, equality through $n=4$, strict inclusion from $n=5$, the Horn pairing $21/4-5\sqrt5/2<0$, and closure under nonnegative sums, products, mixtures, and autocorrelations are correct. |
| C10-OK-31 | 1271-1311 | The stable-mixture feature expectation and the Schoenberg range $0<p\le2$ are correct. C10-MOD-05 concerns variance, attribution, and finite-rank accuracy, not the identity. |
| C10-OK-32 | 1325-1337 | For any realized nonnegative feature matrices, the sketched kernel and plan factorization $P_r=LR^T$ are entrywise nonnegative and support $O((n+m)r)$ kernel-vector products. |

## Optional Improvements and Open Questions

These items are not counted as defects.

1. The strongest scalar-functional minimax lower bound near the diagonal is not proved by merely quoting a distribution-recovery Assouad construction. The chapter's line 436 says the construction “captures” the obstruction rather than claiming a new scalar theorem; that cautious wording is acceptable.
2. A maximal exact-OT diagonal theorem covering smooth densities, finite spaces, disconnected supports, singular empirical tangents, every $p$, and both $W_p$ and $W_p^p$ would require explicit topologies and is beyond a local repair.
3. Sharp robust-random-feature rates for the stable positive representation remain open in this chapter. Truncation, median-of-means, or importance sampling may help, but each changes the estimator or needs new analysis.
4. The Nystrom proof says that a known marginal-entropy correction is applied to the returned value. Writing the correction explicitly would improve reproducibility, but the theorem is not false merely because the formula is omitted.
5. The smooth plug-in estimator is oracle-tuned in $s$. The text correctly states that adaptation is not developed; a Lepski construction and its logarithmic cost would be a useful extension, not a required correction.

## Primary-Literature Audit

### Material Results Checked at Theorem Level

| Topic | Primary source checked | Audit conclusion |
|---|---|---|
| Sharp transport CLTs | Bobkov, Petrov, Bhattacharya-Rao, Kolassa-McCullagh, and Vallender | The lattice $h/4$ and smooth fourth-cumulant constants are consistent under the chapter's strong hypotheses. The Berry notebook defect is numerical only. |
| Empirical Wasserstein rates | Fournier-Guillin, Dereich-Scheutzow-Schottstedt, Weed-Bach, Singh-Poczos | The compact-support regimes and high-dimensional minimax exponents are correctly stated; the chapter explicitly marks its elementary critical $W_1$ bound as nonsharp for regular laws. |
| Smooth Wasserstein estimation | Niles-Weed-Berthet and Divol | The signed high-order smoothing idea and exponent are supported; the chapter's torus proof is independently complete. |
| Compact entropic sample complexity | [Genevay et al. (2019)](https://proceedings.mlr.press/v89/genevay19a.html) and [Carlier-Pegon-Tamanini (2022)](https://arxiv.org/abs/2206.03347) | Fixed-temperature parametric behavior is supported. The sources do not justify the chapter's under-specified debiased $O(\epsilon)$ premise; the latter paper proves a raw $\frac d2\epsilon\log(1/\epsilon)+O(\epsilon)$ scale for compact $L^\infty$ marginals under its cost hypotheses. |
| Subgaussian entropic rate and CLT | [Mena and Niles-Weed (2019)](https://proceedings.neurips.cc/paper/2019/file/5acdc9ca5d99ae66afdfe1eea0e3b26b-Paper.pdf) | The unit-temperature exponent and exact rescaling are supported. The source itself prints the unproved odd-exponent rounding identified in C10-MOD-02. |
| Entropic map estimation | [Pooladian and Niles-Weed, current arXiv v3](https://arxiv.org/html/2109.12004v3) | The quoted bandwidth, dimension-$d$ exponent, logarithm, and assumptions A1-A3 match after notation translation. The older even-dimension surrogate $d'=2\lceil d/2\rceil$ is not the current theorem. |
| Exact finite-space limits | [Sommerfeld and Munk (2018)](https://academic.oup.com/jrsssb/article/80/1/219/7048419) | The source explicitly uses nonlinear directional Hadamard derivatives at the null, supporting C10-MAJ-01 rather than a universal zero derivative. |
| Entropic null limit | [Goldfeld et al. (2024)](https://doi.org/10.1214/24-EJS2217) | The null statistic has second-order, $n$-scaled behavior under the paper's hypotheses; nondegeneracy is not automatic. |
| Nystrom Sinkhorn | [Altschuler et al. (2019)](https://proceedings.neurips.cc/paper/2019/file/f55cadb97eaff2ba1980e001b0bd9842-Paper.pdf) | Core rank and complexity translations are correct. The primary main-result section has the same $\eta\in[1,N]$ standing range; C10-MIN-01 concerns the next extrapolation. |
| Positive-feature Sinkhorn | [Scetbon and Cuturi (2020)](https://proceedings.neurips.cc/paper/2020/hash/9bde76f262285bb1eaeb7b40c758b53e-Abstract.html) | The paper rejects the simple Gaussian representation for failing its bounded relative-feature assumptions and constructs a different bounded-domain feature. This contradicts line 1269's attribution. |
| POT implementation | [Official POT documentation](https://pythonot.github.io/gen_modules/ot.bregman.html#ot.bregman.sinkhorn2) and installed 0.9.6.post1 source | `sinkhorn2` returns $\langle C,P_\epsilon\rangle$ without the entropic contribution, confirming C10-MOD-01. |
| Complete positivity | Berman-Shaked-Monderer, Anstreicher-Burer-Duer, Dickinson-Gijben | Cone inclusions, the five-dimensional gap, membership hardness, and the Horn separation are supported. |

### Complete Citation-Key Inventory

The source contains 51 citation commands, 85 key uses, and 57 unique keys. Every unique key occurs exactly once in `OT4ML/all.bib`. The grouped inventory below contains all 57 keys exactly once.

| Source lines / topic | Citation keys | Scope result |
|---|---|---|
| 92-181, one-dimensional CLT and transport refinements | `berry1941accuracy`, `esseen1942liapunoff`, `chen2011normal`, `bobkov2018berry`, `rio2011asymptotic`, `Petrov1975`, `BhattacharyaRao2010`, `KolassaMcCullagh1990`, `Vallender1974` | Scope consistent; constants independently rederived. |
| 224-436, empirical rates and minimax lower bounds | `dudley1969speed`, `weed2017sharp`, `ramdas2017wasserstein`, `dereich2013constructive`, `fournier2015rate`, `singh2018minimax`, `weed2025statistical`, `assouad1983deux` | Scope consistent; chapter distinguishes upper bounds, recovery minimax, and scalar-value nuance. |
| 444-522, smooth estimation | `nilesweed2019minimaxSmooth`, `divol2022measure` | Scope consistent with signed smoothing and regularity qualifications. |
| 570-684 and 932-1008, MMD/entropic statistics and empirical-process tools | `genevay2018sample`, `bigot2017central`, `mena2019statistical`, `feydy2018interpolating`, `gretton2012kernel`, `vanDerVaartWellner1996` | Material claims supported except C10-MOD-02's inherited rounding gap. |
| 797-814, map estimation | `pooladian2021entropicOTMaps`, `hutter2021minimaxOTMaps`, `deb2021ratesBarycentricMaps`, `manole2021pluginOTMaps` | Pooladian theorem checked exactly; the others are correctly presented as related stronger-model results. |
| 829, sliced statistics | `nadjahi2019asymptotic`, `nadjahi2020statistical`, `manole2019minimax` | Background attribution is consistent; the chapter's theorem is self-proved. |
| 932-1008, exact and entropic limit laws | `sommerfeld2018inference`, `tameling2017empirical`, `klatt2020empirical`, `hundrieser2021limit`, `delBarrioLoubes2017clt`, `delBarrioGonzalezSanzLoubes2021central`, `gonzalezSanzHundrieser2023weak`, `goldfeld2022limit` | Finite/continuum distinctions are supported, subject to C10-MAJ-01's overgeneralized synthesis. |
| 1067, ordinary random features | `RahimiRecht2007RandomFeatures`, `RudiRosasco2017RandomFeatures`, `AvronKapralovMusco2017RandomFourierKRR` | Scope consistent after the normalization repair in C10-MIN-03. |
| 1132-1186 and 1338, algorithmic sketching | `AltschulerBachRudiWeed2018QuadraticTransport`, `AltschulerBachRudiNilesWeed2019NystromSinkhorn`, `altschuler2017near`, `scetbon2021lowrank` | Core distinctions between kernel approximation and low-rank couplings are accurate; C10-MIN-01 is a range issue. |
| 1229-1310, complete positivity and radial kernels | `BermanShakedMonderer2003`, `AnstreicherBurerDuer2009`, `DickinsonGijben2014`, `ScetbonCuturi2020PositiveFeatures`, `schoenberg38`, `berg84harmonic` | Cone and Schoenberg claims are supported; Scetbon-Cuturi attribution has C10-MOD-05. |
| 1366, efficient attention | `Katharopoulos2020LinearAttention`, `Choromanski2021Performer`, `Wang2020Linformer`, `Xiong2021Nystromformer` | Related work exists, but the mechanisms are conflated as described in C10-MIN-04. |

## Imported Definitions and Results

Every materially imported label was read at its defining location.

| Chapter 10 dependency | Defining file and line | Label | Audit use |
|---|---:|---|---|
| Wasserstein topology on Polish spaces | `OT4ML/sections/wasserstein-space.tex:724` | `prop-wass-topology-polish` | Validates LLN moment criterion. |
| Background CLT remark | `OT4ML/sections/wasserstein-space.tex:662` | `rem-clt` | Confirms normalized-convolution convention. |
| Pinsker inequality | `OT4ML/sections/dual-norms.tex:508` | `thm-pinsker` | Confirms Assouad testing normalization. |
| Kantorovich-Rubinstein signed norm | `OT4ML/sections/semidiscr-w1.tex:1197` | `eq-w1-metric` | Validates signed smoothing estimator. |
| MMD definition | `OT4ML/sections/dual-norms.tex:214` | `def-kernel-mmd-norm` | Confirms unsquared MMD convention. |
| Discrete Sinkhorn scaling | `OT4ML/sections/sinkhorn.tex:229` | `eq-sinkhorn` | Confirms $K=e^{-C/\epsilon}$ and scaling equations. |
| Continuous product-KL OT | `OT4ML/sections/sinkhorn.tex:633` | `def-continuous-entropic-ot` | Fixes the value convention in C10-MOD-01. |
| Entropic dual objective | `OT4ML/sections/sinkhorn.tex:1190` | `eq-dual-sinkhorn-objective` | Validates empirical-process reduction. |
| Continuous soft transform | `OT4ML/sections/sinkhorn.tex:1255` | `def-continuous-soft-c-transform` | Validates entropic map extrapolation. |
| Small-temperature expansion | `OT4ML/sections/sinkhorn.tex:936` | `prop-small-epsilon-expansion` | Confirms that stronger bias cancellations require regularity. |
| Barycentric projection | `OT4ML/sections/generalized-ot-problems.tex:2018` | `eq-barycentric-projection` | Exposes duplicate-location aggregation issue. |
| First variations | `OT4ML/sections/generalized-ot-problems.tex:1799` | `prop-ot-first-variations-unregularized`, `prop-ot-first-variations-entropic` | Does not imply universal exact-diagonal linear differentiability. |
| One-dimensional $W_1$ formula | `OT4ML/sections/monge.tex:1367` | `eq-w1-1d` | Validates sliced theorem and Berry integrations. |
| Sliced Wasserstein | `OT4ML/sections/generalized-wasserstein.tex:1029` | `sec-sliced-wasserstein` | Confirms normalized sphere measure and $p$th-root convention. |

## Numerical and Provenance Audit

### Notebook Inventory

These are the four notebooks mapped to the four figures actually included by this chapter. The separate `sinkhorn-divergence-debiasing.ipynb` is not referenced by Chapter 10 and is therefore not one of the four audited figure generators.

| Notebook | Bytes | SHA-256 | Cells (code/markdown) | Executed code counts | Error outputs |
|---|---:|---|---:|---|---:|
| `notebooks-figures/statistical-berry-esseen-w1.ipynb` | 106,326 | `5a0ca32e97410d5e5fdfe549d9f0e51d24df222ce05a500a1f48d0df9cf9ee6a` | 9 (5/4) | 1,2,3,4,5 | 0 |
| `notebooks-figures/sinkhorn-bias-variance-tradeoff.ipynb` | 89,179 | `8dc5658fe8e2be571da7f5864d569e5f69ae9d7e562938ed323b37c616a2f7cb` | 11 (6/5) | None,1,2,3,4,5 | 0 |
| `notebooks-figures/sinkhorn-doubly-positive-counterexample.ipynb` | 53,131 | `0fc14dea553be568e048457cfdb6050a923e3e021a286a97337fc8cc96fb9d07` | 6 (3/3) | None,None,1 | 0 |
| `notebooks-figures/sinkhorn-positive-feature-sketching.ipynb` | 33,155 | `c82a79513c339bc786cd0612d51b1686ebd6b8b3fb0e5e771495e186dd421397` | 13 (7/6) | None,1,2,3,None,None,4 | 0 |

### Exact Numerical Functionals

| Notebook | Quantity actually computed |
|---|---|
| Berry-Esseen $W_1$ | No Sinkhorn computation. Bernoulli uses the exact one-dimensional quantile formula. Uniform sums use numerical integration of the absolute CDF difference plus the erroneous tail term isolated in C10-MOD-08. |
| Bias-variance tradeoff | With $C_{ij}=\lVert X_i-Y_j\rVert^2$, each POT `sinkhorn2` call returns $\langle C,P_\epsilon\rangle$. The notebook plots $\sqrt{\max\{L_{XY}-L_{XX}/2-L_{YY}/2,0\}}$ for these transport components, not the complete product-KL Sinkhorn divergence. Exact OT is $\sqrt{\mathtt{emd2}}$; MMD is the square root of the biased V-statistic. |
| Five-point CP obstruction | No Sinkhorn scaling or transport value. The code constructs a nonnegative PSD five-point kernel, computes its eigenvalues and Horn pairing, and renders the matrix/certificate. |
| Positive-feature sketch | The code scales the dense $K=e^{-C/\epsilon}$ and each nonnegative low-rank $K_r$ to plans $P=\operatorname{diag}(u)K\operatorname{diag}(v)$ and plots those plans. It does not report an OT objective. Its cost panels show $-\epsilon\log\max\{K_r,10^{-300}\}$, then clip the display range as described in C10-MOD-07. |

### Parameters, Randomness, and Retained Outputs

| Figure/notebook | Parameters and seed | Retained-output audit |
|---|---|---|
| Berry-Esseen $W_1$ | $n=1,\ldots,160$; snapshots $n=1,2,6$; no random sampling | Bernoulli quantile computation and asymptotic output are correct. Uniform Irwin-Hall integration has C10-MOD-08. |
| Bias-variance tradeoff | $d=3,6$; $n=(16,24,36,54,81,120,180)$; 16 repetitions; seeds 4303 and 4306; $\epsilon=2,3.6$; MMD bandwidths 2,2.8 | Exact OT and biased empirical MMD formulas are consistent with the plotted distance-like roots. Sinkhorn has C10-MOD-01 and C10-MOD-06. An in-memory replay reproduced the retained qualitative slopes. |
| Five-point CP obstruction | $n=5$, $\lambda=0.05$, equally spaced circle points; deterministic | Minimum entry 0.1454915; minimum eigenvalue $-4.57\times10^{-16}$ is roundoff; Horn pairing -0.34016994. The mathematical certificate is correct. |
| Positive-feature sketch | grid size 150 on $[-2.2,2.2]$; $\epsilon=0.02$; Gauss-Hermite ranks 40,10,3; deterministic quadrature; seed 20260704 is set but unused | Marginal residuals are small. Stored approximation diagnostics contradict the rank-40 caption; floor/clipping and execution-state issues are C10-MOD-07 and C10-MIN-06. |

No notebook was executed in place and no figure was regenerated. Independent checks were bounded, in memory, and did not write repository artifacts.

### Included PDF Asset Inventory

All 12 references resolve to one-page PDFs and render without a malformed page. Data-level clipping in C10-MOD-07 is distinct from PDF layout integrity.

| Source line | Asset | Bytes | SHA-256 |
|---:|---|---:|---|
| 207 | `OT4ML/figures/statistical-berry-esseen-w1/comparison.pdf` | 83,864 | `d20cafe2912969b8930e57a6c4ccecada2468c7fc36791133da0da6aa71a1461` |
| 363 | `OT4ML/figures/sinkhorn-bias-variance-tradeoff/dimension-3.pdf` | 22,292 | `c104811f19f5a5cf6b1b8020b6822c6e2bb25c5951400940c3cc638d165fb669` |
| 364 | `OT4ML/figures/sinkhorn-bias-variance-tradeoff/dimension-6.pdf` | 22,275 | `dd2c2cccce3aa7e60c188ffc88d40c273c4670359914d5c7c01b2da64554cf15` |
| 1238 | `OT4ML/figures/sinkhorn-doubly-positive-counterexample/counterexample.pdf` | 31,180 | `e1678bbff259d1d0ba0a5bf79916412d610cfeae26ec3fb695a697145712f8c0` |
| 1348 | `OT4ML/figures/sinkhorn-positive-feature-sketching/exact.pdf` | 12,758 | `6cd97172f3b17b10df2bfabb20dc8a2b34c7f76f711df47fddfa6c6c9017c752` |
| 1349 | `OT4ML/figures/sinkhorn-positive-feature-sketching/rank-040.pdf` | 13,586 | `09bc12cc73330f0b3359d980cba41210179ebf4cabdd682c87899bcdc5e4cdb2` |
| 1350 | `OT4ML/figures/sinkhorn-positive-feature-sketching/rank-010.pdf` | 13,536 | `80836c83409cc79a6045f9b2caa75389116789d22b2e0c385d33b8718619ca5a` |
| 1351 | `OT4ML/figures/sinkhorn-positive-feature-sketching/rank-003.pdf` | 13,799 | `a39b17a397d2304134d607d4a76c29f83f8160372132d2fd4a37294f99045045` |
| 1352 | `OT4ML/figures/sinkhorn-positive-feature-sketching/cost-exact.pdf` | 9,584 | `71861de15d1036a8990d42027b5cd2c42fa7e4acf0c143c722b64b29d51d03e3` |
| 1353 | `OT4ML/figures/sinkhorn-positive-feature-sketching/cost-rank-040.pdf` | 28,066 | `d2a8e3b804a6fc8fbb4ebb58245219f13994f17c271c14e74f987967c8aca38e` |
| 1354 | `OT4ML/figures/sinkhorn-positive-feature-sketching/cost-rank-010.pdf` | 29,827 | `2ab31fa019d15dc1b5d70edd89c99bd184016bf319865608b014da9ff6e03ff2` |
| 1355 | `OT4ML/figures/sinkhorn-positive-feature-sketching/cost-rank-003.pdf` | 30,095 | `7eddfa2b38c5a06b1bd36390c7f34313f17682cfe66f996939e8c091e4799ec4` |

## Structural Coverage and Mechanics

### Physical and Syntactic Counts

| Item | Count |
|---|---:|
| Physical lines | 1,369 |
| Blank lines | 120 |
| Comment-only nonblank lines | 7 |
| Active nonblank lines | 1,242 |
| Maximal nonblank physical blocks | 120 |
| Maximal nonblank blocks after excluding comment-only blocks | 118 |
| Chapters / sections / paragraphs | 1 / 4 / 16 |
| Propositions / theorems / remarks / definitions / examples | 18 / 1 / 5 / 1 / 1 |
| Proof environments | 18 |
| Figure environments / included graphics | 4 / 12 |
| `equation` / custom `\eql` / `\[...\]` displays | 7 / 3 / 76 |
| Total top-level display containers | 86 |
| Nested `aligned` / `cases` / `tabular` environments | 1 / 3 / 2 |
| Labels, all unique | 44 |
| Reference uses / unique targets | 54 / 40 |
| Citation commands / key uses / unique keys | 51 / 85 / 57 |
| Index commands | 214 |

### Exhaustive Line-Band Coverage

| Lines | Content | Result |
|---:|---|---|
| 1-21 | Chapter opening and roadmap | Checked; no finding |
| 22-84 | Empirical-law LLN | C10-OK-01 |
| 85-212 | Berry-Esseen, lattice/density limits, first figure | C10-MOD-08; C10-OK-02 through C10-OK-05 |
| 213-372 | Empirical OT upper rates, dyadic proof, bias-variance figure | C10-MOD-01, C10-MOD-06; C10-OK-06 through C10-OK-08 |
| 373-439 | Assouad lower bound and minimax scope | C10-OK-09 |
| 440-529 | Signed smooth plug-in estimators | C10-OK-10, C10-OK-11 |
| 530-568 | MMD | C10-OK-12 |
| 569-703 | Entropic sample rates and exact-OT approximation | C10-MOD-02, C10-MOD-03; C10-OK-13 through C10-OK-16 |
| 704-818 | OT map estimation | C10-MOD-04; C10-OK-17 through C10-OK-19 |
| 819-889 | Sliced Wasserstein | C10-OK-20, C10-OK-21 |
| 890-987 | Bias/variance decomposition and finite-support CLT | C10-MIN-05; C10-OK-22 through C10-OK-25 |
| 988-1014 | Finite support versus continuum and null regimes | C10-MAJ-01, C10-MIN-02 |
| 1015-1109 | Rectangular ordinary feature sketches | C10-MIN-03; C10-OK-26, C10-OK-27 |
| 1110-1190 | Nystrom Sinkhorn | C10-MIN-01; C10-OK-28 |
| 1191-1316 | Complete positivity and generalized positive features | C10-MOD-05, C10-MIN-07; C10-OK-29 through C10-OK-31 |
| 1317-1362 | Positive sketches and figure | C10-MOD-07; C10-OK-32 |
| 1363-1369 | Linear-attention analogy | C10-MIN-04 |

### Complete Physical-Block Inventory

The 120 maximal nonblank blocks are listed below. Their union is exactly all nonblank physical lines, with no overlap.

```text
B001:1-1 | B002:3-11 | B003:13-15 | B004:17-20 | B005:22-27 | B006:29-29
B007:31-41 | B008:43-55 | B009:57-62 | B010:64-73 | B011:75-83 | B012:85-90
B013:92-95 | B014:97-101 | B015:103-122 | B016:124-126 | B017:128-133 | B018:135-156
B019:158-160 | B020:162-171 | B021:173-182 | B022:184-200 | B023:202-203 | B024:205-210
B025:212-215 | B026:217-221 | B027:223-231 | B028:233-243 | B029:245-264 | B030:266-271
B031:273-273 | B032:275-289 | B033:291-294 | B034:296-297 | B035:299-316 | B036:318-355
B037:357-357 | B038:359-371 | B039:373-379 | B040:381-399 | B041:401-402 | B042:404-408
B043:410-412 | B044:414-434 | B045:436-438 | B046:440-447 | B047:449-474 | B048:476-484
B049:486-497 | B050:499-520 | B051:522-523 | B052:525-525 | B053:527-528 | B054:530-534
B055:536-547 | B056:549-567 | B057:569-573 | B058:575-589 | B059:591-594 | B060:596-627
B061:629-648 | B062:650-661 | B063:663-681 | B064:683-684 | B065:686-702 | B066:704-710
B067:712-753 | B068:755-770 | B069:772-777 | B070:779-793 | B071:795-797 | B072:799-812
B073:814-817 | B074:819-842 | B075:844-862 | B076:864-887 | B077:889-894 | B078:896-925
B079:927-930 | B080:932-935 | B081:937-966 | B082:968-977 | B083:979-979 | B084:981-984
B085:986-986 | B086:988-1006 | B087:1008-1011 | B088:1013-1013 | B089:1015-1024 | B090:1026-1026
B091:1028-1065 | B092:1067-1070 | B093:1072-1072 | B094:1074-1094 | B095:1096-1108 | B096:1110-1123
B097:1125-1132 | B098:1134-1146 | B099:1148-1180 | B100:1182-1184 | B101:1186-1189 | B102:1191-1209
B103:1211-1214 | B104:1216-1218 | B105:1220-1227 | B106:1229-1229 | B107:1231-1234 | B108:1236-1247
B109:1249-1250 | B110:1252-1254 | B111:1256-1263 | B112:1265-1267 | B113:1269-1269 | B114:1271-1299
B115:1301-1306 | B116:1308-1314 | B117:1317-1341 | B118:1343-1343 | B119:1345-1361 | B120:1363-1369
```

### Complete Numbered-Structure Inventory

| Type | Source ranges and labels |
|---|---|
| Propositions (18) | 43-55 `prop-empirical-lln-wasserstein`; 97-101 `prop-berry-esseen-w1`; 128-133 `prop-sharp-lattice-w1-clt`; 162-171 `prop-sharp-density-w1-clt`; 245-264 `prop-empirical-ot-rate`; 275-289 `prop-dyadic-partition-w1`; 381-399 `prop-minimax-lower-w1-density`; 449-474 `prop-smooth-plugin-w1-rate`; 536-547 `prop-mmd-sample-rate`; 575-589 `prop-sinkhorn-sample-rate`; 755-770 `prop-empirical-barycentric-map-consistency`; 799-812 `prop-entropic-map-rate`; 937-966 `prop-finite-ot-clt`; 1074-1094 `prop-sinkhorn-sketch-positive-guarantee`; 1148-1180 `prop-gaussian-nystrom-sinkhorn-complexity`; 1211-1214 `prop-cp-kernel-positive-features`; 1257-1263 `prop-completely-positive-kernel-closure`; 1271-1299 `prop-gaussian-positive-features`. |
| Theorem (1) | 832-842 `thm-sliced-sample-complexity`. |
| Remarks (5) | 266-271 `rem-empirical-ot-intrinsic-dimension`; 500-523 `rem-smooth-plugin-kernel-order`; 686-702 `rem-sinkhorn-no-free-lunch`; 864-887 `rem-sliced-direction-sample-budget`; 1308-1311 unlabelled range remark. |
| Definition (1) | 1196-1209 `def-dnn-cp-kernels`. |
| Example (1) | 1231-1234, five-point obstruction. |
| `equation` (7) | 34-36 `eq-empirical-law-alpha-n`; 191-200 `eq-bernoulli-uniform-sharp-w1-clt`; 234-242 `eq-empirical-wasserstein-scale`; 249-254 `eq-empirical-wasserstein-moment-scale`; 739-751 `eq-empirical-entropic-map-barycentric`; 867-873 `eq-empirical-direction-sliced-w1`; 875-881 `eq-sliced-joint-sample-direction-rate`. |
| Custom `\eql` (3) | 1046-1052 `eq-rectangular-feature-sketch`; 1081-1087 `eq-rectangular-sketch-relative-concentration`; 1161-1169 `eq-gaussian-nystrom-rank`. |

### Complete Unnumbered-Display Inventory

The 76 `\[...\]` display ranges are:

```text
D01:48-52 | D02:65-71 | D03:111-113 | D04:115-120 | D05:130-132 | D06:137-144 | D07:146-154 | D08:164-170
D09:175-180 | D10:185-189 | D11:256-262 | D12:280-288 | D13:303-312 | D14:322-326 | D15:328-334 | D16:336-344
D17:388-397 | D18:419-432 | D19:453-457 | D20:459-463 | D21:465-472 | D22:478-483 | D23:487-495 | D24:502-506
D25:508-512 | D26:514-519 | D27:541-546 | D28:553-558 | D29:560-564 | D30:583-588 | D31:597-606 | D32:613-619
D33:621-626 | D34:630-634 | D35:637-641 | D36:643-648 | D37:654-660 | D38:666-672 | D39:690-698 | D40:713-722
D41:724-735 | D42:761-767 | D43:780-784 | D44:786-790 | D45:801-804 | D46:806-811 | D47:822-828 | D48:837-841
D49:846-850 | D50:852-860 | D51:899-904 | D52:906-911 | D53:913-921 | D54:940-946 | D55:948-955 | D56:957-964
D57:970-976 | D58:990-999 | D59:1001-1005 | D60:1033-1037 | D61:1039-1044 | D62:1054-1061 | D63:1089-1093 | D64:1098-1106
D65:1116-1120 | D66:1135-1140 | D67:1142-1145 | D68:1151-1159 | D69:1171-1178 | D70:1198-1202 | D71:1205-1208 | D72:1222-1225
D73:1281-1288 | D74:1291-1298 | D75:1321-1324 | D76:1327-1337
```

### Complete Proof Inventory

| Proof | Lines | Result |
|---|---:|---|
| P01 | 57-83 | Checked; C10-OK-01 |
| P02 | 103-122 | Checked; C10-OK-02 |
| P03 | 135-156 | Checked; C10-OK-03 |
| P04 | 173-182 | Checked; C10-OK-04 |
| P05 | 291-316 | Checked; C10-OK-07 |
| P06 | 318-355 | Checked; C10-OK-06 through C10-OK-08 |
| P07 | 401-434 | Checked; C10-OK-09 |
| P08 | 476-497 | Checked; C10-OK-10 |
| P09 | 549-567 | Checked; C10-OK-12 |
| P10 | 591-681 | Checked; C10-MOD-02 localized to 652; otherwise C10-OK-13 through C10-OK-15 |
| P11 | 772-793 | Checked; C10-MOD-04 definition issue; convergence argument C10-OK-18 |
| P12 | 844-862 | Checked; C10-OK-20 |
| P13 | 968-984 | Checked; C10-OK-23, C10-OK-24 |
| P14 | 1096-1108 | Checked; C10-OK-27 |
| P15 | 1182-1184 | Checked; C10-OK-28 |
| P16 | 1216-1227 | Checked; C10-OK-29 |
| P17 | 1265-1267 | Checked; C10-OK-30 |
| P18 | 1301-1306 | Checked; expectation identity correct; C10-MOD-05 concerns omitted moments/attribution |

### Labels, References, Citations, and Build Mechanics

The 44 labels are unique within the chapter and project-wide. They are:

```text
sec-statistical-ot, sec-law-large-numbers-clt, sec-quantitative-clt,
eq-empirical-law-alpha-n, prop-empirical-lln-wasserstein,
prop-berry-esseen-w1, prop-sharp-lattice-w1-clt,
prop-sharp-density-w1-clt, eq-bernoulli-uniform-sharp-w1-clt,
fig:statistical-berry-esseen-w1, sec-sample-complexity,
eq-empirical-wasserstein-scale, prop-empirical-ot-rate,
eq-empirical-wasserstein-moment-scale, rem-empirical-ot-intrinsic-dimension,
prop-dyadic-partition-w1, fig:sinkhorn-bias-variance-tradeoff,
prop-minimax-lower-w1-density, prop-smooth-plugin-w1-rate,
rem-smooth-plugin-kernel-order, prop-mmd-sample-rate,
prop-sinkhorn-sample-rate, rem-sinkhorn-no-free-lunch,
eq-empirical-entropic-map-barycentric,
prop-empirical-barycentric-map-consistency, prop-entropic-map-rate,
thm-sliced-sample-complexity, rem-sliced-direction-sample-budget,
eq-empirical-direction-sliced-w1, eq-sliced-joint-sample-direction-rate,
sec-bias-variance-ot, prop-finite-ot-clt, sec-sketching-sinkhorn,
eq-rectangular-feature-sketch, prop-sinkhorn-sketch-positive-guarantee,
eq-rectangular-sketch-relative-concentration,
prop-gaussian-nystrom-sinkhorn-complexity, eq-gaussian-nystrom-rank,
def-dnn-cp-kernels, prop-cp-kernel-positive-features,
fig:sinkhorn-doubly-positive-counterexample,
prop-completely-positive-kernel-closure, prop-gaussian-positive-features,
fig:sinkhorn-positive-feature-sketching
```

- All 54 `\ref`/`\eqref` uses resolve; the 40 unique targets are defined.
- No chapter label is duplicated anywhere under `OT4ML/**/*.tex`.
- All 57 unique citation keys resolve exactly once in `OT4ML/all.bib`.
- All 12 included graphic paths resolve.
- The existing `OT4ML/OT4ML.log` contains no undefined-reference, undefined-citation, or multiply-defined-label warning. It was inspected read-only; no build was run.

## Reconciliation With the Superseded Audit

The preserved report at `/private/tmp/ot4ml-audit-chap10-before-fresh-agent.md` had 659 lines, 10,339 words, 78,841 bytes, and SHA-256 `0ca5028ca0582439918a427c11e9e79fbceda397f387f1b9eee4787763131d90` when first opened. It was not read until the independent source, mathematics, notebooks, primary references, candidate severity ledger, and validated-correct ledger were substantially complete. The second pass repeated the independent checks before replaying this reconciliation.

| Old ID | Reconciliation disposition | Current result |
|---|---|---|
| CH10-001 | Independently rediscovered before reading; replayed from scratch | Retained and rewritten as C10-MOD-01. |
| CH10-002 | Not in the frozen independent defect ledger; old hypothesis was then independently tested on a two-point model and primary finite-space theory | Retained as C10-MAJ-01. The report is explicit that this was verified during reconciliation, not pre-read rediscovery. |
| CH10-003 | Initially treated as supported because the primary corollary prints the rounded exponent; fresh algebra found the odd-exponent counterexample | Retained as C10-MOD-02 with an explicit $T$-family counterexample and limited claim: proof/scope gap, not a proved failure of every possible large-temperature bound. |
| CH10-004 | Independently rediscovered | Retained as C10-MOD-04. |
| CH10-005 | Materially changed and partly rejected | The old statement that the primary theorem lacks the range is false. The narrower local extrapolation issue is retained as C10-MIN-01. |
| CH10-006 | Figure defect independently rediscovered; theoretical tail issue materially expanded | Split into C10-MOD-05 and C10-MOD-07. The new report adds the exact second-moment formula and verifies the Scetbon-Cuturi attribution is wrong. |
| CH10-007 | Independently rediscovered | Retained as C10-MIN-04 with the exact normalized formula. |
| CH10-008 | Independently rediscovered, but old source location was wrong | Retained as C10-MIN-02 at finite-support line 1006, not in the sliced-direction discussion. |
| CH10-009 | Verified during reconciliation | Retained as C10-MIN-03. |
| CH10-010 | Rejected as a counted defect | Line 1183 already states that the marginal correction is applied before asserting the KL-normalized value guarantee. An explicit formula is an optional improvement only. |
| CH10-011 | Verified during reconciliation | Retained as C10-MIN-05. |

**Newly established or not present as separate old findings:** C10-MOD-03 (bounded circle counterexample to $O(\epsilon)$ debiased bias), C10-MOD-06 (null square-root regime), C10-MOD-08 (wrong Gaussian tail), C10-MIN-06 (retained execution state), and C10-MIN-07 (total versus complete positivity). C10-MOD-05's false attribution and full stable-feature variance analysis are also materially new even though the old report mentioned heavy tails while discussing the figure.

No old prose was adopted as authority. Mechanical ranges and shared mathematical identities were independently regenerated from the protected files.

**Second-pass reconciliation outcome:** all 11 old IDs were replayed. Ten survive in verified form, although several were narrowed, moved, expanded, or split; CH10-010 remains rejected as a counted defect. Five current root causes were absent as separate old findings, and the variance/attribution component of C10-MOD-05 was materially strengthened. No preserved-audit hypothesis generated a new finding during the second pass.

## Prioritized Repair Order

1. Rewrite line 1008 using the exact-OT diagonal taxonomy in C10-MAJ-01.
2. Correct the bias-variance notebook to evaluate full KL objectives and relabel the null square root, then regenerate both PDFs.
3. Replace the all-temperature rounded exponent by the exact scaled expression or restrict its temperature range.
4. Qualify the $O(\epsilon)$ exact-OT approximation statement with explicit support/regularity hypotheses.
5. Correct the positive-feature attribution and separate exact expectation, variance, rank accuracy, and computational cost.
6. Require empirical map sites in the comparator's domain and repair duplicate-site semantics by aggregation, distinctness, or indexed notation.
7. Correct the Berry tail and regenerate its figure.
8. Make the rank-40 caption quantitative and disclose flooring/clipping.
9. Apply the seven minor normalization, range, provenance, and terminology repairs.

## Final Integrity and QA Ledger

- Finding IDs are unique and gap-free within each severity: 1 Major, 8 Moderate, 7 Minor.
- Severity arithmetic is $0+1+8+7=16$.
- Validated-correct IDs are unique and gap-free: C10-OK-01 through C10-OK-32.
- Second-pass dispositions account for all 16 first-pass IDs: 14 reconfirmed without material change and 2 materially refined; 0 removed, 0 severity changes, and 0 new IDs.
- Two additional candidate defects were explicitly rejected after rederivation: the obsolete map-rate dimension surrogate and the misclassification of the $d=3$ smooth-matching plotting guide.
- Every retained finding contains exact source locations, the current claim or implementation, a diagnosis or counterexample, a minimal repair, downstream impact, and a direct primary-evidence link.
- All four source-linked notebooks and all 12 included PDFs are inventoried.
- The exact functional or matrix quantity computed by each figure notebook is recorded separately from its caption's terminology.
- All 120 physical nonblank blocks, 86 top-level display containers, 36 numbered structures, 18 proofs, 44 labels, 54 reference uses, and 57 citation keys are covered.
- Markdown tables have complete separator rows and consistent cell counts.
- No drafting placeholders or unresolved question markers remain in this report.
- The protected source fingerprint used throughout is `57ec1686ffe3ddc8fdd26184912068751c318b6fca112793384fabaac6360552`.
- The authoritative source remained read-only throughout the audit.
- No Git add, restore, checkout, reset, commit, amend, merge, rebase, push, or branch action was performed.
