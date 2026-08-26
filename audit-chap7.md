# Second-Round Mathematical Audit of Chapter 7: Divergences and Dual Norms

## Read-only audit mandate and source-integrity record (historical baseline)

This report is a fresh adversarial refinement of the first audit of Chapter 7. The first report's F1-F10 conclusions were treated as hypotheses to falsify, not as accepted facts. Every theorem-like environment, proof, display, example, figure, caption, citation, label, and cross-reference in the current on-disk chapter was rechecked. The current bibliography, retained build metadata, imported chapter definitions, figure notebooks, common figure helper, and retained PDF outputs were inspected read-only.

The metadata below records the read-only audit phase completed on 2026-08-25,
before the corrective edit pass. It is retained as provenance and should not be
read as a description of the post-correction workspace.

- Workspace: **/Users/gpeyre/Dropbox/github/ot4ml**
- Audited source: **OT4ML/sections/dual-norms.tex**
- Chapter title: **Divergences and Dual Norms**
- Report modified: **/Users/gpeyre/Dropbox/github/ot4ml/audit-chap7.md**
- Second-pass date: **2026-08-25**
- Source at second-pass entry: **755 physical lines; 47,018 bytes; SHA-256 1181852e56e1621b90cd9b44a2d12b8843c4d698b7649c5bb617bb229c50538f**
- Source at second-pass completion: **755 physical lines; 47,018 bytes; SHA-256 1181852e56e1621b90cd9b44a2d12b8843c4d698b7649c5bb617bb229c50538f**
- Byte-for-byte conclusion: **unchanged**
- Write scope used: **exactly one path, audit-chap7.md**
- Prohibited actions: no chapter, bibliography, auxiliary file, notebook, figure, generated output, or other workspace file was edited; no commit or push was made.

At entry, Git already reported **OT4ML/sections/dual-norms.tex** and **OT4ML/all.bib** as modified, and **audit-chap7.md** as untracked. The two audited notebooks, their common helper, and all five retained PDF panels were clean relative to Git. These pre-existing states were not altered.

## Executive summary of the read-only audit

At the read-only audit stage, the second pass retained the chapter's central mathematical architecture. The IPM support-function formalism, total-variation and Kantorovich-Rubinstein specializations, compact-space IPM metrization theorem, RKHS dual identity, compact universal-kernel MMD theorem, measure-valued perspective definition of a \(\phi\)-divergence, data processing, joint convexity, non-negativity, the full-variation Pinsker constant, the measure-level Fenchel conjugate, the Jensen-Shannon conjugate, and the signs and constants connecting vanilla GANs to Jensen-Shannon all re-derived correctly under their stated or imported hypotheses.

The reconciled pre-correction finding count was:

| Severity | Count |
|---|---:|
| Critical | 0 |
| Major | 1 |
| Moderate | 2 |
| Minor | 6 |
| **Total established findings** | **9** |

All nine findings in this table are now resolved; the implementation ledger and
post-correction validation appear below.

The sole Major finding is narrower than in the first report. Proposition **prop-phi-div-dual** and its functional conjugate are correct. The failure occurs only when the GAN section replaces that true conjugate by a data-atom average while suppressing the admissible critic class. For finite recession slope \(L=\phi'_\infty\), the scalar penalty controls critic values on data atoms but does not control values on generated mass singular to the data. The true conjugate requires a global cap \(f\le L\); for one fixed pair, the minimal requirement is a cap on the generated singular support. An output activation into the pointwise effective domain of \(\phi^*\) is a sufficient global implementation, though it can exclude the endpoint \(L\) and turn attainment of singular mass into approximation.

The two Moderate findings are:

1. Corollary **cor-topol-wass** includes \(p=\infty\), although weak convergence on a compact space is metrized only by finite-\(p\) Wasserstein distances.
2. The kernel section lacks measure-level measurability/integrability hypotheses, omits the first-moment domain of energy distance, and incorrectly infers an ordinary Matérn kernel from boundedness of the spectral multiplier at zero without the necessary high-frequency condition \(s>d/2\).

The six Minor findings concern incomplete boundary hypotheses for named \(\phi\)-families and the finite-measure Jensen-Shannon bound, an over-literal first figure caption, a nonconvex-domain Lipschitz/gradient identity, the positive-definite-only FID cross-reference, semantic citation/cross-reference defects, and the noncanonical unit clipping constant in the historical WGAN remark.

No Critical issue was found. No algorithm environment occurs. All 28 citation keys resolve in both the current bibliography and retained bibliography output. All 23 distinct cross-reference targets resolve. All 38 explicit labels are unique.

## Second-pass refinement of prior F1-F10

| Prior finding | Second-pass disposition | Final location |
|---|---|---|
| Prior F1, Major: empirical \(\phi\)-GAN loses recession cap | **Retained as Major, but narrowed.** The measure conjugate and first equality through \(D_\phi^*\) are correct. The defect begins at the data-sum substitution. The final analysis now distinguishes the global functional-conjugate cap, the scalar effective domain of \(\phi^*\), data-support penalties, generated singular support, and endpoint nonattainment. The incorrect \(\int_X\) latent integral is folded into the same repair. | Final F1 |
| Prior F2, Moderate: \(p=\infty\) included in Wasserstein topology corollary | **Retained unchanged as Moderate.** The two-point/outlier counterexample survives exactly. | Final F2 |
| Prior F3, Moderate: first figure does not plot literal optimizers | **Retained but downgraded to Minor.** The theorem is unaffected and the curves are legitimate qualitative witness shapes; only the caption's literal optimal-unit-ball claim and plotting normalization are defective. | Final F5 |
| Prior F4, Moderate: kernel/energy domains under-specified | **Retained and strengthened as Moderate.** A missed concrete error was added: \((\|\omega\|^2+\lambda)^{-s}\) is a finite spectral measure, hence an ordinary stationary Matérn kernel, only for \(s>d/2\). | Final F3 |
| Prior F5, Moderate: weak-* lower semicontinuity ambiguous/incompletely proved | **Mathematical charge removed and severity reduced.** The book already defines its informal noncompact weak-* usage as narrow convergence, and the joint lower-semicontinuity result is standard and correct. What remains is only an unnamed-theorem/hypothesis citation gap, merged into the citation finding. | Final F8 |
| Prior F6, Minor: biased MMD versus unbiased KID omitted | **Removed as an established defect.** Equation **eq-mmd-discr** is explicitly a deterministic discrete-measure identity and is never called unbiased. The KID sentence correctly says that KID estimates squared MMD. The \(U\)- versus \(V\)-statistic distinction remains a useful optional extension and is documented below. | Optional extension; no finding |
| Prior F7, Minor: \(\operatorname{Lip}(f)=\|\nabla f\|_\infty\) on arbitrary Euclidean domains | **Retained as Minor.** The slit-domain counterexample survives. | Final F6 |
| Prior F8, Minor: FID cross-reference assumes positive-definite covariances | **Retained as Minor.** The formula is correct for positive semidefinite matrices, but the cited proposition does not state that extension. | Final F7 |
| Prior F9, Minor: citations/metadata imprecise | **Retained and expanded as Minor.** The missing primary f-GAN citation and the general-metric KR cross-reference mismatch were added. | Final F8 |
| Prior F10, Minor: occupancy normalization and clipping constant | **Narrowed.** The occupancy objection is removed: in the cited settings the expert and learner occupancies have a common discount/horizon and hence equal mass, with normalization conventional. The historical clipping constant \(c\), not \(1\), remains a defect. | Final F9 |

This table reconciles every prior finding; no prior item is silently dropped or duplicated.

## Correction pass - 2026-08-26

All nine established findings were corrected in
`OT4ML/sections/dual-norms.tex`; the citation repairs also required narrowly
scoped updates to `OT4ML/all.bib`. The original findings below are retained as
an audit trail, and their line numbers refer to the read-only baseline recorded
at the beginning of this report.

| Finding | Status | Implemented correction |
|---|---|---|
| `F1` | Resolved | Restored the global critic constraint `f <= phi'_infinity` in the empirical GAN formula, corrected the latent integral from `X` to `Z`, restricted neural critics to the admissible class, and explained the stronger output-domain condition and possible endpoint nonattainment on generated singular mass. |
| `F2` | Resolved | Restricted compact-space weak metrization to `1 <= p < infinity`, pointed to the dedicated `W_infinity` section, and added the explicit weakly convergent contamination sequence whose `W_infinity` distance remains one. |
| `F3` | Resolved | Required Borel measurability, constructed an anchored positive-definite kernel in the conditional case, and defined the measure domain by strong measurability plus Bochner integrability of its canonical feature map. This proves absolute convergence, non-negativity, and anchor independence rather than assuming them. The correction also imposes finite first moments for energy distance, restricts ordinary Matérn kernels with multiplier `(abs(omega)^2+lambda)^(-s)` to `s>d/2`, and limits the non-zero-mass discrete norm formula to positive-definite kernels. |
| `F4` | Resolved | Added the lower-semicontinuous boundary values and recession slopes of the power family, reverse KL, Hellinger, and Jensen--Shannon generators; restricted the normalized Jensen--Shannon distance bound to probabilities and stated the homogeneous finite-measure extension and equal-mass scaling. |
| `F5` | Resolved | Recast the first figure as display-normalized witness shapes, disclosed independent peak normalizations, and removed claims that the plotted curves are certified optimizers of the continuous unit balls. |
| `F6` | Resolved | Restricted the ambient Euclidean identity `Lip(f)=||grad f||_infinity` to convex domains and stated the intrinsic-path-metric alternative on nonconvex domains. |
| `F7` | Resolved | Pointed FID to the Bures definition on the positive-semidefinite cone and stated that the Gaussian value extends to singular empirical covariances by continuity, while the exact affine-map formula in `eq-bures-map` requires positive-definite covariances. |
| `F8` | Resolved | Corrected the general metric KR cross-reference; supplied shape-analysis, universality, measure-perspective, and f-GAN sources; removed the unrelated Frogner citation from WGAN; and repaired the audited bibliography metadata for Csiszár, Gretton et al., Székely--Rizzo, and PWIL. |
| `F9` | Resolved | Replaced the canonical unit clipping box by the tunable WGAN parameter box `[-c,c]` and clarified that its induced Lipschitz constant depends on the architecture and on `c`. |

No figure generator or retained figure asset was changed: finding `F5` was a
caption/provenance mismatch, and the audited plots already provide the intended
qualitative comparison. Build and visual-validation results are recorded at the
end of this file.

## Severity rubric

- **Critical:** invalidates a central theorem or requires substantial reconstruction.
- **Major:** materially breaks a central formulation or conclusion but has a localized repair.
- **Moderate:** a false endpoint, missing hypothesis, or measure/domain error that affects rigorous use beyond a cosmetic edit.
- **Minor:** a localized hypothesis, caption, attribution, cross-reference, notation, or historical-constant defect with limited downstream effect.

## Established findings

### F1. Major: the empirical \(\phi\)-GAN equality suppresses the critic domain needed to price generated singular mass

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Exact location.** Proposition **prop-phi-div-dual**, **OT4ML/sections/dual-norms.tex:641-678**, especially **eq-dual-div** and **eq-legendre**; GAN display and neural restriction, **698-720**, especially **701-714**. The latent integral at line 704 is also over the wrong displayed domain.

**What is correct.** Let \(L=\phi'_\infty\). The proposition correctly states

\[
D_\phi(\alpha\mid\beta)
=
\sup_{\substack{f\in C(X)\\f\le L}}
\left\{\int f\,d\alpha-\int\phi^*(f)\,d\beta\right\},
\]

and correctly computes the convex conjugate, as a functional of arbitrary nonnegative measures \(\alpha\),

\[
D_\phi^*(f\mid\beta)
=
\begin{cases}
\int\phi^*(f)\,d\beta,& f\le L\text{ on }X,\\
+\infty,&\text{otherwise}.
\end{cases}
\]

The first GAN equality through the notation \(D_\phi^*(f\mid\beta)\) is therefore correct if its supremum is read over the proposition's compact-space dual pair.

**Precise failure.** Lines 704-705 replace \(D_\phi^*(f\mid\beta)\) by

\[
\frac1m\sum_{j=1}^m\phi^*(f(y_j))
\]

but retain an unrestricted \(\sup_f\). The sum checks the scalar effective domain only at data atoms \(y_j\). It cannot detect \(f>L\) on generated points or other \(\beta\)-null sets. Thus it is not the functional conjugate in **eq-legendre**.

**Why the true conjugate has a global cap.** For a candidate measure \(\alpha=\rho\beta+\eta\), with \(\eta\perp\beta\),

\[
\int f\,d\alpha-D_\phi(\alpha\mid\beta)
=
\int(f\rho-\phi(\rho))\,d\beta+\int(f-L)\,d\eta.
\]

The first term gives \(\int\phi^*(f)\,d\beta\). The second is bounded above over all nonnegative singular \(\eta\) if and only if \(f\le L\) everywhere: if \(f(x_0)>L\), continuity supplies a neighborhood on which arbitrary singular mass makes the conjugate infinite whenever that neighborhood is \(\beta\)-null; if it has positive \(\beta\)-mass, \(\phi^*(f)=+\infty\) there instead.

**Pointwise domain versus singular endpoint.** Convexity gives

\[
\operatorname{dom}\phi^*\subset(-\infty,L].
\]

The endpoint need not belong to the scalar domain. For Hellinger and Jensen-Shannon, \(\phi^*(u)\to+\infty\) as \(u\uparrow L\), so \(\operatorname{dom}\phi^*=(-\infty,L)\). Nevertheless, the functional conjugate may allow \(f=L\) on a \(\beta\)-null set because the extended integrand is infinite only on a null set; that endpoint is exactly what prices singular \(\alpha\)-mass at rate \(L\).

For one fixed pair \((\alpha,\beta)\), the smallest condition needed for the pairwise Fenchel bound is more local:

- \(\phi^*(f)<+\infty\) is needed \(\beta\)-almost everywhere, hence at every data atom in the empirical formula;
- \(f\le L\) is needed \(\alpha^\perp\)-almost everywhere on generated mass singular to \(\beta\);
- values outside \(\operatorname{supp}\alpha\cup\operatorname{supp}\beta\) do not affect that fixed objective.

The global cap is the correct, \(\theta\)-independent condition when one uses the functional conjugate or a single critic architecture across a generator family. Requiring \(f(x)\in\operatorname{dom}\phi^*\) globally is sufficient but can be stronger than \(f\le L\) because it excludes \(f=L\) on generated-only support. A strict output activation still recovers the same supremum by approaching the endpoint, but need not attain it.

**Smallest counterexample.** Let \(X=\{x,y\}\), \(\alpha=\delta_x\), \(\beta=\delta_y\), and use the chapter's full-TV generator

\[
\phi(r)=|r-1|,\qquad r\ge0.
\]

Then \(L=1\) and

\[
\phi^*(u)=
\begin{cases}
-1,&u\le-1,\\
u,&-1\le u\le1,\\
+\infty,&u>1.
\end{cases}
\]

The exact divergence is \(D_\phi(\delta_x\mid\delta_y)=2\). The correctly capped dual attains \(2\) at \(f(x)=1,f(y)=-1\). The printed data-sum expression becomes

\[
\sup_{f(x),f(y)}\{f(x)-\phi^*(f(y))\}.
\]

Taking \(f(y)=-1\) and \(f(x)\to+\infty\) makes this \(+\infty\).

For the unscaled Jensen-Shannon generator at lines 715-718, \(L=\log2\) and \(\operatorname{dom}\widehat\phi_{\rm JS}^*=(-\infty,\log2)\). On disjoint generated/data atoms, the data term constrains only the data value. An uncapped generated value again makes the printed supremum infinite, whereas the exact divergence is \(2\log2\).

**Lower-bound consequence.** A neural restricted supremum is a lower bound on the exact divergence only when every neural critic is admissible for the exact dual. A class containing functions above \(L\) on generated singular support is not a subset of the exact class; its empirical objective may exceed the divergence or be unbounded.

**Smallest repair.** Under the proposition's compact-space hypothesis, replace lines 701-713 by

\[
\min_\theta
\sup_{\substack{f\in C(X)\\f\le\phi'_\infty}}
\left\{
\int_Z f(g_\theta(z))\,d\zeta(z)
-\frac1m\sum_{j=1}^m\phi^*(f(y_j))
\right\}.
\]

The integral is over \(Z\), not \(X\). For neural critics, state that the output parametrization enforces \(f_\xi\le L\) globally, or more strongly maps into \(\operatorname{dom}\phi^*\). For the chapter's Jensen-Shannon orientation, \(f=\log(2(1-D))\), \(D\in(0,1)\), enforces \(f<\log2\) globally and gives the Goodfellow discriminator objective plus \(\log4\). On singular supports the endpoint is approached as \(D\downarrow0\), so equality is a supremum rather than necessarily an attained maximum.

**Downstream impact.** This affects the claimed exact passage from finite-recession \(\phi\)-divergences to empirical adversarial losses, the neural lower-bound statement, and generated-versus-data support behavior. It does not invalidate **prop-phi-div-dual**, **eq-legendre**, the displayed Jensen-Shannon conjugate, or superlinear cases \(L=+\infty\).

### F2. Moderate: the weak-metrization corollary incorrectly includes \(W_\infty\)

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Exact location.** Corollary **cor-topol-wass**, **151-160**.

**Problematic claim.** The statement says that on a compact metric space \(W_p\) metrizes weak convergence "for every \(p\ge1\)." The book separately defines \(W_\infty\), so this notation includes the endpoint. The proof invokes imported Proposition **prop-comp-wass-p**, whose explicit range is \(1\le p\le q<\infty\).

**Smallest counterexample.** On \(X=[0,1]\), let

\[
\alpha_n=(1-1/n)\delta_0+(1/n)\delta_1,\qquad \alpha=\delta_0.
\]

Then \(\alpha_n\rightharpoonup\alpha\). For every finite \(p\),

\[
W_p(\alpha_n,\alpha)=n^{-1/p}\to0.
\]

Every coupling must move the \(1/n\) atom from \(1\) to \(0\), however, so

\[
W_\infty(\alpha_n,\alpha)=1
\]

for all \(n\).

**Smallest repair.** Change the statement to "for every \(1\le p<\infty\)." The proof is then correct as written. Optionally add one sentence that \(W_\infty\) controls worst displacement and induces a strictly stronger topology.

**Downstream impact.** All finite-\(p\) claims survive. The repair prevents a direct contradiction with the book's dedicated \(W_\infty\) section and its essential-supremum geometry.

### F3. Moderate: finite-Gram kernel positivity is extended to measure energies and Matérn kernels without the required analytic domains

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Exact location.** Definition **def-positive-kernels**, **174-184**; Riesz/energy/Matérn example, **190-212**; Definition **def-kernel-mmd-norm**, **214-234**; anchoring discussion, **236-241**; Proposition **prop-kernel-rkhs-dual**, **246-270**.

**Problematic claims.**

1. Positive definiteness is defined for an arbitrary symmetric real-valued function, then that function is integrated against signed measures without a measurability assumption.
2. "Finite kernel energy" is not defined as absolute product-integrability, an anchored energy, or a mean-embedding condition.
3. The energy-distance expectation identity is stated without finite first moments.
4. Boundedness of \((\|\omega\|^2+\lambda)^{-s}\) at \(\omega=0\) is said to imply an ordinary positive-definite Matérn kernel. Bounded low frequency does not control the high-frequency tail.

**Measurability counterexample.** For any nonmeasurable \(g:X\to\mathbb R\),

\[
k(x,y)=g(x)g(y)
\]

has positive-semidefinite Gram matrices because

\[
\sum_{i,j}r_ir_jk(x_i,x_j)=\left(\sum_i r_i g(x_i)\right)^2\ge0.
\]

It satisfies the printed finite-set definition but its measure integral need not be defined.

**Matérn counterexample.** A continuous stationary positive-definite kernel has a finite Bochner spectral measure. If its spectral density is proportional to

\[
q(\omega)=(\|\omega\|^2+\lambda)^{-s},
\]

then

\[
k(0)\propto\int_{\mathbb R^d}q(\omega)\,d\omega
\asymp\int_1^\infty r^{d-1-2s}\,dr.
\]

This is finite if and only if \(s>d/2\). In the smallest case \(d=1,s=1/4\), the multiplier is bounded at zero but the tail behaves as \(|\omega|^{-1/2}\), so \(k(0)=+\infty\). The inverse Fourier object is a distribution/singular Green kernel, not a real-valued stationary kernel of Definition **def-positive-kernels**. For an ordinary Matérn covariance one writes \(s=\nu+d/2\) with \(\nu>0\).

**Energy-distance counterexample.** Let \(\alpha=\beta\) be a standard Cauchy law on \(\mathbb R\). As a signed measure, \(\xi=\alpha-\beta=0\) has quadratic energy \(0\). But

\[
2\mathbb E|X-Y|-\mathbb E|X-X'|-\mathbb E|Y-Y'|
\]

is \(+\infty-\infty\), not a defined real number. Finite first moments make all three expectations finite and justify expansion of \((\alpha-\beta)^{\otimes2}\).

**Conditionally definite kernels.** For a conditionally positive kernel, the finite-Gram condition guarantees nonnegativity only on finite atomic zero-mass combinations. Passage to arbitrary signed measures requires approximation plus a well-defined energy. The anchored kernel

\[
\widetilde k(x,y)=k(x,y)-k(x,x_0)-k(x_0,y)+k(x_0,x_0)
\]

is algebraically positive definite and gives the same quadratic form on zero-mass measures, but it does not by itself supply measurability or integrability.

**Smallest repair.**

- Require kernels used with measures to be Borel measurable.
- For direct signed energies, impose
  \[
  \iint |k(x,y)|\,d|\xi|(x)d|\xi|(y)<\infty,
  \]
  or explicitly define the energy through an anchored positive kernel/mean embedding.
- For a continuous positive kernel on a separable space, a standard sufficient Bochner condition is
  \[
  \int\sqrt{k(x,x)}\,d|\xi|(x)<\infty.
  \]
- Add finite first moments to the Euclidean energy-distance identity.
- Add \(s>d/2\) to the Matérn paragraph and identify \(\nu=s-d/2\). For \(s\le d/2\), call the inverse a generalized/distributional Green kernel rather than an ordinary RKHS kernel.

**Downstream impact.** Bounded continuous kernels on compact spaces, including the compact MMD theorem, are unaffected. The repairs matter for the unbounded energy, Riesz, polynomial, Green, and conditionally definite kernels that motivate the section.

### F4. Minor: the named \(\phi\)-family paragraph omits its boundary/recession conventions and states the Jensen-Shannon bound on the wrong measure domain

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Exact location.** Main-family paragraph and displays, **575-605**, especially the power formula at **576-580** and Jensen-Shannon bound at **592-604**.

**Problematic claims.** The chapter's declared divergence domain is arbitrary finite nonnegative measures. The power formula is written without its lower-semicontinuous value at \(s=0\) or its recession slope, although both determine singular-measure behavior. The bound

\[
0\le \operatorname{JS}(\alpha,\beta)^2\le\log2
\]

is true for probability measures, not arbitrary finite measures.

**Boundary derivation.** For \(\gamma\ne0,1\),

\[
\phi_\gamma(s)
=
\frac{s^\gamma-\gamma s+\gamma-1}{\gamma(\gamma-1)}
\quad(s>0)
\]

has the lower-semicontinuous extension

\[
\phi_\gamma(0)=
\begin{cases}
1/\gamma,&\gamma>0,\\
+\infty,&\gamma<0,
\end{cases}
\]

and recession slope

\[
\phi'_{\gamma,\infty}=
\begin{cases}
+\infty,&\gamma>1,\\
1/(1-\gamma),&\gamma<1.
\end{cases}
\]

The limits are consistent with KL at \(\gamma\to1\) and reverse KL at \(\gamma\to0\). For the separately normalized Hellinger generator, \(\phi_H(0)=1\) and \(\phi'_{H,\infty}=1\).

For the normalized Jensen-Shannon generator in lines 600-604,

\[
\phi_{\rm JS}(0)=\frac12\log2,\qquad
\phi'_{\rm JS,\infty}=\frac12\log2.
\]

The unscaled generator \(\widehat\phi_{\rm JS}=2\phi_{\rm JS}\) used later has recession slope \(\log2\), matching its conjugate domain \(u<\log2\).

**Smallest counterexample to the bound.** Let \(x\ne y\) and

\[
\alpha=M\delta_x,\qquad \beta=M\delta_y.
\]

The two measures have equal finite mass \(M\) and disjoint support. One obtains

\[
\operatorname{JS}(\alpha,\beta)^2=M\log2.
\]

For \(M>1\), this exceeds \(\log2\). The divergence is positively 1-homogeneous, exactly as Proposition **prop-basic-phi-divergence-properties** states.

**Smallest repair.** Declare the power formula for \(s>0\), add the boundary and recession table above, and qualify the Jensen-Shannon bound and "distance" discussion by \(\alpha,\beta\in\mathcal P(X)\). For equal finite mass \(M\), state the upper bound \(M\log2\).

**Downstream impact.** Probability-level named examples and all displayed generator normalizations remain correct. The missing conventions matter for zero reference density, singular parts, and the critic cap in variational formulas.

### F5. Minor: Figure fig:dualnorms-ipm-witnesses shows display-normalized witness shapes, not literal optimizers of the cited continuous unit balls

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Exact location.** Figure and caption, **90-109**, especially **102**; generator **notebooks-figures/dualnorms-ipm-witnesses.ipynb**.

**Problematic claim.** The caption calls each violet curve "a normalized optimal dual witness" for **eq-dual-norm-cont**.

**Retained generator audit.**

- **\(W_1\).** The raw integrated-sign witness has numerical Lipschitz constant \(1\) and maximum absolute value \(1.6204700592683543\). Dividing by that maximum, as the notebook does, reduces the plotted Lipschitz constant to \(0.617104891435958\). Since its objective is nonzero, scaling it upward remains feasible until Lipschitz constant \(1\) and strictly improves the objective. The plotted curve is therefore not a unit-ball maximizer.
- **MMD.** The unshifted kernel mean difference is the correct optimal direction. The notebook subtracts its nonzero arithmetic grid mean, \(-5.3157126448193685\times10^{-5}\), and then normalizes by sup norm rather than RKHS norm. Constants are not a harmless gauge for an RKHS ball; in the intended continuous Gaussian RKHS on an interval, a nonzero constant shift is not an admissible preservation of the mean-element direction. No RKHS norm is computed, so the plotted function is neither certified feasible at norm one nor optimal.
- **TV.** The plotted \(\operatorname{sign}(\rho_\alpha-\rho_\beta)\) is an optimizer in the measurable \(L^\infty\) ball. It jumps at the two sign changes and is not in the continuous test class cited by the chapter. The continuous ball has the same supremum through approximation, but generally no continuous maximizer here.
- **Density backgrounds.** The notebook draws filled profiles rather than red/blue curves and divides each density by its own maximum. Their displayed heights are therefore not on a common density scale.

**Smallest repair.** Change the caption to "display-normalized witness shapes" or "near-witnesses," and disclose the independent peak/sup normalizations. Alternatively, regenerate with a unit-Lipschitz witness up to an additive constant, the unshifted mean element divided by its RKHS norm, and a TV maximizing sequence or explicitly measurable sign witness.

**Downstream impact.** No theorem or qualitative comparison is affected. The figure cannot currently be used as evidence for dual attainment or exact unit-ball normalization.

### F6. Minor: the differential Lipschitz identity needs convexity or the intrinsic path metric

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Exact location.** Flat/Dudley example, **87**.

**Problematic claim.** The sentence states: "On a Euclidean domain, \(\operatorname{Lip}(f)=\|\nabla f\|_\infty\) for differentiable \(f\)." This fails for a nonconvex domain equipped with ambient Euclidean distance.

**Smallest counterexample.** Let

\[
\Omega=\{(r\cos\theta,r\sin\theta):1<r<2,\ -\pi<\theta<\pi\}
\]

be a slit annulus and set \(f(r,\theta)=\theta\). Then \(f\) is smooth on \(\Omega\) and \(\|\nabla f\|=1/r\), so \(\|\nabla f\|_\infty=1\). At radius \(3/2\), points with angles \(\pi-\varepsilon\) and \(-\pi+\varepsilon\) have Euclidean distance asymptotic to \(3\varepsilon\), while their function values differ by \(2\pi-2\varepsilon\). Hence \(f\) is not globally Lipschitz for the ambient metric.

**Smallest repair.** Write "on a convex Euclidean domain" or replace the ambient metric by the intrinsic path metric, with the usual regularity hypotheses.

**Downstream impact.** Only the differential aside is affected. The flat and Dudley test classes and topology statements remain correct.

### F7. Minor: the FID cross-reference does not state the positive-semidefinite covariance extension used empirically

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Exact location.** Example **ex-two-sample-testing-fid**, **330-334**; imported Definition **def-bures-metric**, **OT4ML/sections/monge.tex:1923-1932**; imported Proposition **prop-gaussian-w2-bures**, **monge.tex:1935-1957**.

**Problematic claim.** The FID sentence attributes its covariance formula to Proposition **prop-gaussian-w2-bures**, but that proposition assumes both covariances are positive definite. Empirical feature covariances are positive semidefinite and have rank at most \(n-1\); with one observation the covariance is zero, and whenever \(n\le d\) it is necessarily singular.

**Derivation.** The covariance term

\[
\operatorname{tr}\!\left(
\Sigma+\Lambda
-2(\Sigma^{1/2}\Lambda\Sigma^{1/2})^{1/2}
\right)
\]

is well-defined for positive semidefinite matrices and extends the positive-definite Gaussian \(W_2\) formula by approximation/continuity. The inverse-covariance transport map in the cited proposition does not extend verbatim.

**Smallest repair.** Cite the preceding Bures definition, which already allows positive semidefinite matrices, and add that the Gaussian distance formula extends from positive definite to positive semidefinite covariances by continuity.

**Downstream impact.** The FID formula is correct; only the formal scope of its cited justification fails in a common empirical regime.

### F8. Minor: several semantic citations, cross-references, and proof sources do not support their adjacent claims precisely

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Exact location.** General KR example **52**; shape-analysis sentence **236**; spectral remark **321-326**; lower-semicontinuity proof **412-435**; arbitrary-\(\phi\) GAN statement **698**; MMD/WGAN sentence **737**; corresponding current entries in **OT4ML/all.bib**.

These are citation/reference defects, not newly asserted mathematical counterexamples.

1. **General metric KR points to a Euclidean formula.** Line 52 discusses the KR norm on zero-mass signed measures on a metric space but cites **eq-w1-cont**, which is the imported \(\mathbb R^d\) Sobolev/gradient formula at **semidiscr-w1.tex:1231-1236**. The general metric signed-measure statement is **eq-w1-metric** and its discussion at **semidiscr-w1.tex:1194-1205**.
2. **Shape analysis.** **Hofmann2008** is a general kernel-method survey. It supports RKHS background but not the adjacent historical claim that kernel norms are used in shape analysis. A currents/varifolds or computational-anatomy primary reference is needed.
3. **Universality source.** The cited 2008 characteristic-kernel paper supports full spectral support for characteristic translation-invariant kernels. The \(C_0\)-universality equivalence is more directly sourced by the 2011 universality/characteristic paper.
4. **Measure-level lower semicontinuity.** The result at lines 414 and 435 is correct under the book's narrow-convergence convention, but "the standard lower-semicontinuity theorem" is not identified. A vector-measure perspective/Reshetnyak-type source should be cited, especially because the dominating measure changes with \((\alpha,\beta)\).
5. **Arbitrary \(f\)-GAN attribution.** The central statement that any \(\phi\)-divergence yields an adversarial neural loss has no f-GAN citation. The primary source is Nowozin, Cseke, and Tomioka, *f-GAN: Training Generative Neural Samplers using Variational Divergence Minimization*.
6. **WGAN citation.** **FrognerNIPS** is *Learning with a Wasserstein Loss*, a supervised structured-prediction paper. It does not support the statement that WGANs use a Lipschitz critic. **WassersteinGAN** does.
7. **MMD naming.** **MMD-GAN** is a fixed-kernel MMD optimization paper without an explicitly parameterized adversarial RKHS witness. It supports MMD generator training, but a learned-feature MMD-GAN claim would need a later adversarial-kernel source.
8. **Bibliography metadata.** The **ciszar1967information** author field omits one of the two "s" letters in Csiszar; the PWIL record stops at the 2020 arXiv version instead of ICLR 2021; **gretton2012kernel** uses **number={Mar}** rather than journal issue metadata; and **szekely2004testing** is sparse. All keys still resolve.

**Smallest repair.** Replace the KR target, replace or relocate the two mismatched adjacent citations, add primary f-GAN and measure-perspective sources, and correct the metadata. No citation key used by the source must be renamed merely to fix displayed author spelling.

**Downstream impact.** The chapter remains buildable and the underlying mathematics can be supported, but a reader following the present references will not find support for several adjacent historical or functional-analytic claims.

### F9. Minor: original WGAN clipping used a tunable box \([-c,c]\), not a canonical unit parameter ball

**Status:** Resolved on 2026-08-26; see the correction ledger above.

**Exact location.** Weight-clipping remark, **752-755**, especially **754**.

**Problematic claim.** The sentence describes original WGAN clipping as \(\|\xi\|_\infty\le1\). The original WGAN algorithm clips each critic parameter to \([-c,c]\), where \(c\) is a tunable hyperparameter; its reported default was \(c=0.01\).

**Derivation/source check.** Algorithm 1 of the primary WGAN paper lists \(c\) as "the clipping parameter" and applies \(\operatorname{clip}(w,-c,c)\). The paper's argument is only that a compact parameter box gives a uniformly Lipschitz family up to an architecture- and box-dependent constant. It does not identify that family with the unit Lipschitz ball.

**Smallest repair.** Replace \(\|\xi\|_\infty\le1\) by \(\|\xi\|_\infty\le c\). Keep the rest of the remark: its conclusion that clipping is only a proxy and does not parameterize the full convex 1-Lipschitz ball is correct.

**Downstream impact.** This is a historical normalization correction only. The conceptual warning in the remark survives.

## Validated-correct theorem and environment ledger

There are 26 theorem-like environments. "Correct" below means the claim re-derived under its printed or explicitly imported standard domain; retained findings are cross-referenced.

| Lines | Environment | Second-pass disposition |
|---:|---|---|
| 28-35 | Definition **def-dual-norm-ipm** | Correct. The support function of a nonempty symmetric convex class is an extended seminorm on any vector domain where all pairings are defined; finiteness plus separation gives a norm. |
| 40-49 | Total-variation example | Correct with the book's full-variation convention. The continuous sup-norm ball recovers variation for finite Radon measures. |
| 51-58 | \(W_1\)/KR example | Mathematically correct on zero-mass signed measures with finite first moment; the cross-reference should be the general metric formula, F8. |
| 60-88 | Flat norm and Dudley example | The two balls are equivalent, and compact-space topology claims are correct. The gradient gloss needs F6. |
| 115-123 | Proposition **prop-dual-norm-metrization** | Correct. Density of \(\operatorname{Span}(B)\) gives one implication; sup-norm compactness gives uniformity for the other. |
| 151-154 | Corollary **cor-topol-wass** | Correct only for \(1\le p<\infty\); F2. |
| 174-184 | Definition **def-positive-kernels** | Correct as a finite-Gram algebraic definition. Measure use needs F3. |
| 190-212 | Riesz, energy, Matérn example | Energy sign and formal Fourier exponents are correct; finite-valued/integrability and Matérn \(s>d/2\) conditions are missing, F3. |
| 214-234 | Definition **def-kernel-mmd-norm** | Algebraically correct when the signed energy is well-defined and nonnegative. Domain repair: F3. |
| 246-259 | Proposition **prop-kernel-rkhs-dual** | Correct under the explicit assumption that the mean embedding is well-defined. The nonzero optimizer is \(m_\xi/\|m_\xi\|_{\mathcal H}\). |
| 273-286 | Proposition **prop-mmd-metrization** | Correct on compact \(X\) for a continuous universal kernel. |
| 316-319 | Definition **def-universal-kernel** | Correct compact \(C(X)\)-universality definition. |
| 321-326 | Spectral-universality remark | Mathematically correct under its stated \(C_0\) qualification; source precision noted in F8. |
| 330-334 | Two-sample/FID/KID example | Population descriptions are correct. The FID semidefinite extension needs F7. No biased-estimator claim is made. |
| 371-378 | Entropy-function definition | Correct. The recession ratio exists for a proper l.s.c. convex entropy on \([0,\infty)\). |
| 384-394 | Definition **def_divergence** | Correct perspective extension, including singular \(\alpha\)-mass and \(0\cdot\infty=0\). |
| 412-417 | Basic-properties proposition | Joint positive homogeneity, convexity, and narrow/weak-* lower semicontinuity are correct. Add a named theorem/source, F8. |
| 441-446 | Non-negativity proposition | Correct. For probabilities, perspective Jensen gives non-negativity; strict convexity gives equality only at \(\alpha=\beta\). |
| 470-484 | KL example | Correct generalized relative-entropy generator, value at zero, and infinite recession slope. |
| 486-504 | TV \(\phi\)-example | Correct. The singular term with slope \(1\) recovers full variation. |
| 508-526 | Pinsker theorem | Correct for natural logs and full variation: \(\|\alpha-\beta\|_{\rm TV}^2\le2\,\mathrm{KL}(\alpha\mid\beta)\). |
| 549-569 | Strong-versus-weak remark | Correct. The factor \(\operatorname{diam}(X)/2\) matches full variation and is sharp. |
| 626-633 | \(\phi\)- versus Bregman-divergence remark | Correct at the stated level. Data processing follows from conditional Jensen for the perspective. |
| 641-666 | Proposition **prop-phi-div-dual** | Correct on compact \(X\), including the global finite-recession cap and values outside \(\operatorname{supp}\beta\). F1 concerns only the later specialization. |
| 746-750 | Imitation-learning example | Correct at the conceptual level. Equal mass is supplied by common discount/horizon conventions in the cited occupancy constructions; normalization would be a useful clarification, not an established defect. |
| 752-755 | Weight-clipping remark | Correct conclusion; historical box constant requires F9. |

## Hypothesis and domain audit

| Topic | Hypotheses actually needed | Chapter status |
|---|---|---|
| General IPM | A vector domain of finite signed measures; defined pairings; symmetry for absolute-value form; finiteness for an ordinary seminorm; separation for definiteness. | Substantially explicit. |
| Total variation | Finite signed Radon measures; bounded continuous tests. Compactness is needed for the exact \(M(X)=C(X)^*\) identification used by the imported proposition. | Correct. |
| KR norm | Zero total mass; finite first moment on an unbounded pointed space; potentials normalized modulo constants. | Correct; F8 cross-reference only. |
| Flat/Dudley | Finite measures; compact metric space for the stated sequential weak-* metrization on TV-bounded signed sets. | Correct except F6 aside. |
| Finite-\(p\) Wasserstein topology | Probability measures; compact metric \(X\); \(1\le p<\infty\). | F2. |
| \(W_\infty\) | Probability measures and finite-displacement couplings; worst-displacement topology is stronger than weak convergence. | Imported definition correct; excluded by F2 repair. |
| Positive kernel energy | Borel measurability plus absolute product-integrability or a well-defined mean embedding. | F3. |
| Conditional kernel energy | Zero-mass signed measures plus an anchored/quotient construction and finite energy. | Zero mass explicit; analytic domain missing, F3. |
| Energy distance | Probability measures with finite first moments for the expectation formula. | Missing, F3. |
| RKHS mean embedding | Strong/Pettis measurability and integrability; for continuous kernels a useful sufficient condition is \(\int\sqrt{k(x,x)}\,d|\xi|<\infty\). | Hidden in "well-defined"; acceptable in proposition, but examples need F3. |
| Characteristic kernel | Injectivity on probability measures. It gives a metric, not automatically a topology theorem on a noncompact space. | Correct distinction. |
| Universal compact kernel | Continuous kernel, compact \(X\), RKHS dense in \(C(X)\). | Explicit and correct. |
| Noncompact MMD topology | Characteristicness alone is not the general replacement for compact universality. Conditions depend on boundedness, continuity, \(C_0\), tightness, and integral strict positivity. | Chapter makes no false noncompact topology claim. |
| Discrete MMD | Finite Gram sums; for samples the displayed formula is the empirical-measure \(V\)-statistic. | Correct. |
| Measure \(\phi\)-divergence | Finite nonnegative Radon measures; l.s.c. convex entropy on \([0,\infty)\); l.s.c. boundary at zero; recession term for singular \(\alpha\). | Core definition correct; named-family table needs F4. |
| Joint l.s.c. | Joint narrow convergence on Polish spaces, or weak-* convergence on compact spaces; vector-measure perspective theorem. | Correct under imported convention; source gap F8. |
| Non-negativity | Equal unit mass and \(\phi(1)=0\); strict convexity for definiteness. For arbitrary finite masses, pointwise \(\phi\ge0\) suffices. | Explicit and correct. |
| Pinsker | Probability measures, natural log, full TV convention. | Explicit and correct. |
| Jensen-Shannon bound | Probability measures, or equal mass \(M\) with bound \(M\log2\). | Probability hypothesis missing, F4. |
| Data processing | Markov kernel/coarse graining; standard Borel hypotheses for a measurable bijection to have a measurable inverse. | Correct in the book's metric/Polish setting. |
| Fenchel duality | Compact \(X\), dual pair \(M(X),C(X)\), l.s.c. proper convex functional; global cap \(f\le L\). | Explicit and correct. |
| \(\phi\)-GAN specialization | Proposition hypotheses or a separately stated noncompact measurable dual theorem; data penalties in \(\operatorname{dom}\phi^*\); cap on generated singular support, globally for the functional conjugate. | F1. |
| IPM GAN | Symmetric critic class \(B\), finite pairings; separation only if a metric claim is made. | Correct. |
| FID | Positive-semidefinite empirical covariances; Gaussian \(W_2\) formula extended by continuity. | F7. |
| KID | Population polynomial-kernel MMD requires corresponding kernel moments; the unbiased estimator needs sample sizes at least two. | No false claim; useful extension below. |
| Occupancy OT | Expert and learner occupancies must have equal mass for balanced OT; common horizon/discount provides this, with optional normalization to probabilities. | Conceptually satisfied; no retained defect. |

## Topology audit

1. **IPM topology.** Proposition **prop-dual-norm-metrization** is correct and deliberately separates two directions. Density of the span forces convergence against all continuous observables; compactness of the test ball makes pointwise weak convergence uniform over that ball. Neither condition alone is claimed to be necessary.
2. **Finite-\(p\) Wasserstein.** On compact \(X\), weak convergence and \(W_p\)-convergence agree for every finite \(p\). On noncompact Polish spaces, imported Proposition **prop-wass-topology-polish** correctly adds convergence/uniform integrability of \(p\)-th moments.
3. **\(W_\infty\).** F2's vanishing-outlier example proves that weak convergence is insufficient even on a compact interval.
4. **Flat/Dudley.** The bounded-Lipschitz ball contains constants and therefore detects total mass. On compact metric spaces it metrizes weak convergence of finite positive measures; on TV-bounded signed sets it metrizes the weak-* topology.
5. **TV and \(\phi\)-divergences.** If \(x_n\to x\) with \(x_n\ne x\), then \(\delta_{x_n}\rightharpoonup\delta_x\), while full TV remains \(2\), KL is \(+\infty\), and probability Jensen-Shannon remains at \(\log2\). This validates the chapter's "stronger than weak" discussion.
6. **MMD on compact spaces.** Universal implies characteristic and gives the difficult MMD-to-weak implication. Continuity and compactness give weak-to-MMD. The proof correctly uses convergence of product measures.
7. **Characteristic versus universal.** Characteristicness is exactly injectivity on probabilities and suffices for definiteness, but it is not definitionally the same as universality on general spaces. The chapter does not conflate them.
8. **Noncompact kernels.** Full support of the Bochner spectral measure characterizes characteristicness for bounded continuous translation-invariant kernels on \(\mathbb R^d\), and under standard \(C_0\) hypotheses characterizes \(C_0\)-universality. General weak-metrization on noncompact spaces needs additional hypotheses; the chapter wisely confines its theorem to compact \(X\).
9. **GAN continuity claim.** For a fixed continuous kernel on compact \(X\), the RKHS unit ball is uniformly bounded and equicontinuous because
   \[
   |h(x)-h(y)|\le\|h\|_{\mathcal H}\|k(x,\cdot)-k(y,\cdot)\|_{\mathcal H}.
   \]
   The normalized Lipschitz ball is compact by Arzela-Ascoli. Thus the weak-continuity statement at line 737 is correct.

## Measure-valued \(\phi\)-divergence, boundary, and conjugate audit

The following table reconciles signs, boundary values, recession slopes, and scalar conjugate domains. Affine additions \(a(s-1)\) leave divergences unchanged only on equal-mass pairs; they change arbitrary unequal finite-mass divergences by \(a(\alpha(X)-\beta(X))\).

| Generator | \(\phi(0)\) | \(L=\phi'_\infty\) | Scalar conjugate/domain | Audit |
|---|---:|---:|---|---|
| KL \(s\log s-s+1\) | \(1\) | \(+\infty\) | \(\phi^*(u)=e^u-1\), all \(u\in\mathbb R\) | Correct. Singular \(\alpha\) gives \(+\infty\). |
| TV \(|s-1|\) | \(1\) | \(1\) | \(-1\) for \(u\le-1\), \(u\) for \(-1\le u\le1\), \(+\infty\) for \(u>1\) | Correct full-variation normalization. |
| Pearson, chapter normalization \(\tfrac12(s-1)^2\) | \(1/2\) | \(+\infty\) | Finite for every \(u\), with boundary branch from \(s\ge0\) | Correct. |
| Reverse KL \(-\log s+s-1\) | \(+\infty\) | \(1\) | \(-\log(1-u)\), \(u<1\) | Formula correct; boundary omitted in family paragraph, F4. |
| Hellinger \((\sqrt s-1)^2\) | \(1\) | \(1\) | \(u/(1-u)\), \(u<1\) | Density formula correct for finite measures; finite first mass is automatic. |
| Normalized JS \(\phi_{\rm JS}\) | \(\tfrac12\log2\) | \(\tfrac12\log2\) | \(-\tfrac12\log(2-e^{2u})\), \(u<\tfrac12\log2\) | Generator identity correct; bound needs probabilities, F4. |
| Unscaled JS \(\widehat\phi_{\rm JS}=2\phi_{\rm JS}\) | \(\log2\) | \(\log2\) | \(-\log(2-e^u)\), \(u<\log2\) | Lines 715-720 correct. |
| Power \(\phi_\gamma\), \(\gamma>1\) | \(1/\gamma\) | \(+\infty\) | Superlinear | Boundary omitted, F4. |
| Power \(\phi_\gamma\), \(0<\gamma<1\) | \(1/\gamma\) | \(1/(1-\gamma)\) | Upper endpoint at recession slope | Boundary omitted, F4. |
| Power \(\phi_\gamma\), \(\gamma<0\) | \(+\infty\) | \(1/(1-\gamma)\) | Upper endpoint at recession slope | Boundary omitted, F4. |

Additional checks:

- **Perspective at zero.** The convention \(\psi(0,0)=0\) is consistent with \(0\cdot(+\infty)=0\).
- **Singular parts.** Decomposing only \(\alpha\) relative to \(\beta\) is sufficient. Regions where \(\beta>0\) and \(\alpha=0\) enter through \(\phi(0)\beta\); regions where \(\alpha\perp\beta\) enter through \(L\alpha^\perp\).
- **Joint convexity.** A common dominating measure for two pairs reduces the claim to convexity of the l.s.c. perspective.
- **Lower semicontinuity.** The recession value at \(v=0\) is essential. Dropping it would fail under concentration to singular mass.
- **Data processing.** If a Markov kernel maps the likelihood ratio to a conditional expectation, Jensen's inequality for the perspective gives contraction. Strict equality requires recoverability/sufficiency conditions, which the chapter does not overstate.
- **Non-negativity.** For probabilities, Jensen at total masses \((1,1)\) is correct even if \(\phi\) takes negative values away from \(1\). For arbitrary finite measures, the added hypothesis \(\phi\ge0\) is sufficient.
- **Pinsker.** The printed factor \(2\) is correct for full variation. With the half-TV convention it becomes \(\operatorname{TV}_{1/2}^2\le\frac12\mathrm{KL}\).
- **Pinsker equality.** Equality holds at \(\alpha=\beta\); the sharp constant is approached by small balanced Bernoulli perturbations rather than by a nontrivial equality pair.
- **Jensen-Shannon maximum.** For probabilities, disjoint support gives two contributions \(\tfrac12\log2\), hence \(\log2\), as stated later in the GAN section.

## MMD, energy, KID, and FID audit

### Population MMD identities

For a well-defined mean embedding \(m_\xi\),

\[
\|m_\xi\|_{\mathcal H}^2
=
\iint k(x,y)\,d\xi(x)d\xi(y),
\qquad
\sup_{\|h\|_{\mathcal H}\le1}\int h\,d\xi
=
\|m_\xi\|_{\mathcal H}.
\]

The optimizer exists when \(m_\xi\ne0\) and equals \(m_\xi/\|m_\xi\|_{\mathcal H}\). The three-term expansion **eq-mmd-discr** is algebraically exact. For a conditionally positive kernel, anchoring preserves zero-mass energies.

### Energy distance

The sign is correct:

\[
-\iint\|x-y\|\,d(\alpha-\beta)(x)d(\alpha-\beta)(y)
=
2\mathbb E\|X-Y\|-\mathbb E\|X-X'\|-\mathbb E\|Y-Y'\|.
\]

Finite first moments are the missing condition in F3. Under that condition, Euclidean distance has strong negative type, so the quantity separates probability laws.

### Empirical MMD and KID

The first report incorrectly promoted an omitted estimator distinction to a defect. The source never labels **eq-mmd-discr** unbiased. With uniform empirical weights it is the nonnegative \(V\)-statistic

\[
\widehat{\operatorname{MMD}}_V^2
=
\frac1{n^2}\sum_{i,i'}k(X_i,X_{i'})
+
\frac1{m^2}\sum_{j,j'}k(Y_j,Y_{j'})
-
\frac2{nm}\sum_{i,j}k(X_i,Y_j).
\]

Its expectation is

\[
\operatorname{MMD}^2
+
\frac1n\{\mathbb E k(X,X)-\mathbb E k(X,X')\}
+
\frac1m\{\mathbb E k(Y,Y)-\mathbb E k(Y,Y')\}.
\]

The primary KID construction instead uses the unbiased off-diagonal statistic, for \(n,m\ge2\),

\[
\widehat{\operatorname{MMD}}_U^2
=
\frac1{n(n-1)}\sum_{i\ne i'}k(X_i,X_{i'})
+
\frac1{m(m-1)}\sum_{j\ne j'}k(Y_j,Y_{j'})
-
\frac2{nm}\sum_{i,j}k(X_i,Y_j).
\]

It can be negative in a finite sample. The chapter's sentence that KID "estimates a squared MMD, typically with a polynomial kernel" is therefore correct. Adding these formulas would improve pedagogy but is optional.

A population polynomial-kernel MMD requires corresponding feature moments; unlike a bounded kernel on compact \(X\), this is not automatic on an unbounded feature space. The chapter makes no rate claim for KID that would violate this condition.

### FID

The population description as the squared \(W_2\) distance between fitted Gaussian feature laws is correct. The estimator is a plug-in statistic and is biased in finite samples; the chapter does not call it unbiased and explicitly warns that population geometry differs from finite-sample calibration. F7 concerns only the semidefinite scope of the imported proposition.

## Exact GAN formulation audit

1. **Exact \(\phi\)-GAN.** Under Proposition **prop-phi-div-dual**,
   \[
   D_\phi(\alpha_\theta\mid\beta)
   =
   \sup_{\substack{f\in C(X)\\ f\le L}}
   \left\{
   \mathbb E_\zeta f(g_\theta(Z))
   -
   \mathbb E_\beta\phi^*(f(Y))
   \right\}.
   \]
   F1 repairs the empirical display.
2. **Restricted critic.** A parameterized class yields a pointwise lower bound only if it lies in the exact admissible class. Equality of suprema can follow by approximation; literal attainment is sufficient but not necessary.
3. **Concavity.** The unrestricted inner objective is concave in the function value \(f\) because \(-\phi^*\) is concave. A nonlinear neural parametrization need not be concave in its parameters. The chapter states this correctly.
4. **Vanilla minimax GAN.** With the chapter's orientation and \(f=\log(2(1-D))\),
   \[
   \mathbb E_{\alpha_\theta}f-\mathbb E_\beta\widehat\phi_{\rm JS}^*(f)
   =
   \log4+
   \mathbb E_\beta\log D+
   \mathbb E_{\alpha_\theta}\log(1-D).
   \]
   Maximizing over \(D\) gives \(2\,\mathrm{JS}^2\), equivalently the original Goodfellow value \(-\log4+2\,\mathrm{JS}^2\). The signs and additive constant are correct.
5. **Non-saturating generator.** The common practical generator update \(-\mathbb E\log D(G(Z))\) is not the same off-optimum objective as minimization of the optimized minimax/JS value. The chapter discusses only the minimax formulation and makes no false identification; a clarification would be optional.
6. **IPM GAN.** Symmetry of \(B\) makes source/data sign orientation immaterial. A neural subclass need not separate all laws and hence need not be a metric.
7. **Fixed-kernel MMD.** The RKHS supremum has a closed-form witness; no trained discriminator is mathematically required. Learned-feature MMD GANs add a separate adversarial kernel/feature optimization.
8. **WGAN.** The exact class is the 1-Lipschitz ball modulo constants on probability differences. Weight clipping, gradient penalties, and spectral normalization are proxies, not identities with that ball.
9. **Occupancy measures.** Balanced OT requires equal masses. Common finite horizons or a common discount give expert and learner occupancies equal mass; multiplying both by the same normalization does not change the conceptual claim.

## Proof audit

There are eight proof environments.

| Lines | Proof | Second-pass audit |
|---:|---|---|
| 124-149 | Proposition **prop-dual-norm-metrization** | Correct. The limsup subsequence and compactness argument are valid; symmetry supplies absolute values. |
| 155-161 | Corollary **cor-topol-wass** | The \(p=1\) proof is correct. The normalized Lipschitz ball is compact and constants vanish on probability differences. Only the statement's \(p=\infty\) endpoint fails, F2. |
| 260-271 | RKHS dual identity | Correct once the mean embedding exists. Cauchy-Schwarz is sharp in the mean-element direction. |
| 287-310 | Universal-kernel MMD metrization | Correct. Uniform RKHS approximation handles MMD-to-weak; bounded continuous \(k\) on compact \(X^2\) handles weak-to-MMD. |
| 419-437 | Basic \(\phi\)-properties | Perspective homogeneity/convexity are correct. The final l.s.c. step must invoke the vector-measure perspective theorem rather than a fixed-reference theorem; the result is standard, but naming the theorem and topology would improve rigor, F8. |
| 448-460 | Non-negativity/equality | Correct. Strictness of the perspective on the line \(u+v=1\) follows because distinct points there are not positively collinear. |
| 528-547 | Pinsker | Correct. Hahn decomposition gives half the full variation; binary coarse-graining and \(1/a+1/(1-a)-4\ge0\) give the sharp constant. |
| 668-678 | \(\phi\)-conjugate and duality | Correct. The proof properly separates absolutely continuous and singular mass, detects \(f>L\) both on positive-\(\beta\) neighborhoods and \(\beta\)-null neighborhoods, and uses compact-space Fenchel-Moreau. No attainment is claimed. |

### Attainment and equality cases

- The general IPM supremum need not be attained unless the test class has suitable compactness.
- The compact normalized \(W_1\) ball is compact, so a \(W_1\) witness exists.
- The continuous TV ball has the correct supremum but may not contain the measurable sign optimizer.
- MMD attains its supremum whenever the mean difference exists and is nonzero.
- The \(\phi\)-dual can fail to attain: for KL the formal optimizer \(\log(d\alpha/d\beta)\) may be unbounded/discontinuous; for finite-recession generators the scalar endpoint can be excluded from \(\operatorname{dom}\phi^*\).
- At line 714, a restricted class can have the exact supremum by approximation without containing an optimizer. "Rich enough to attain" should be read as a sufficient, not necessary, condition.

## Notation, sign, normalization, constant, and equality checks

| Item | Result |
|---|---|
| Full TV convention | Correct: no factor \(1/2\); disjoint probabilities have distance \(2\). |
| TV as \(\phi\)-divergence | Correct with \(\phi(s)=|s-1|\), \(\phi(0)=1\), \(L=1\). |
| KR constants | Constants make nonzero-mass signed KR infinite; finite first moment is needed on unbounded spaces. |
| Flat versus Dudley | \(B_{\rm Dudley}\subset B_{\rm flat}\subset2B_{\rm Dudley}\); equivalent norms. |
| \(W_1\)-TV diameter bound | Correct and sharp: \(W_1\le\operatorname{diam}(X)\|\alpha-\beta\|_{\rm TV}/2\). |
| Kernel sign | \(d(x,y)\) is conditionally negative; \(-d(x,y)\) is conditionally positive. Energy-distance sign is correct. |
| Anchoring | Additive \(a(x)+a(y)\) terms vanish on zero-mass quadratic forms. |
| MMD expansion | Two self terms minus twice the cross term; signs correct. |
| KL normalization | \(s\log s-s+1\); generalized finite-measure linear mass terms correct. |
| Pinsker constant | Correct for natural logs and full TV: coefficient \(2\) on KL. |
| Power \(\gamma=2\) | \(\tfrac12(s-1)^2\), matching the figure's half-Pearson normalization. |
| Power \(\gamma=1/2\) | \(2(\sqrt s-1)^2\), hence "up to multiplicative normalization" is correct. |
| Hellinger | The chapter defines the square root of \(D_{\phi_H}\), giving the \(L^2\) distance of square roots. |
| Normalized JS | \(D_{\phi_{\rm JS}}=\mathrm{JS}^2\); recession slope \(\tfrac12\log2\). |
| Unscaled JS | \(D_{\widehat\phi_{\rm JS}}=2\mathrm{JS}^2\); conjugate and \(u<\log2\) domain correct. |
| Vanilla GAN additive constant | Chapter's dual objective equals Goodfellow's value plus \(\log4\). |
| Min/max signs | Generator minimizes; critic maximizes. IPM sign is harmless because \(B=-B\). |
| Latent integration | Must be over \(Z\), repaired with F1. |
| WGAN clipping | Must use tunable \(c\), F9. |
| FID covariance order | Bures expression is symmetric despite an apparently ordered matrix product; PSD extension F7. |

No sign error was found in Pinsker, energy distance, MMD, the \(\phi\)-conjugate, Jensen-Shannon, vanilla GAN, or the IPM GAN objective.

## Displayed-equation ledger

There are 44 displayed formulas: 23 book macro displays and 21 bracket displays. Thirteen contain explicit labels, and **eq-dual-div** is created by the **eqllead** macro, giving 14 equation anchors.

| Start line | Display | Status |
|---:|---|---|
| 30 | Dual seminorm \(\|\xi\|_B\) | Correct. |
| 43 | TV continuous unit ball | Correct. |
| 53 | Unit-Lipschitz ball | Correct on zero-mass/first-moment domain. |
| 70 | Flat test ball | Correct. |
| 84 | Dudley test ball | Correct. |
| 126 | Pairing bound for \(f\in B\) | Correct. |
| 140 | Supremizer-subsequence decomposition | Correct. |
| 180 | Finite Gram positivity | Correct algebraically; measure extension F3. |
| 221 | Kernel quadratic energy | Correct only under F3 domain. |
| 229 | MMD definition | Correct. |
| 237 | Anchored conditional kernel | Correct algebraically. |
| 279 | MMD/weak equivalence | Correct under proposition hypotheses. |
| 289 | RKHS Cauchy-Schwarz estimate | Correct. |
| 294 | Uniform approximation estimate | Correct. |
| 301 | Three-term population MMD | Correct. |
| 337 | Discrete kernel quadratic form | Correct. |
| 346 | Two-support discrete MMD | Correct deterministic/V-statistic identity. |
| 375 | Recession slope | Correct. |
| 389 | Measure \(\phi\)-divergence | Correct singular extension. |
| 401 | Common-support discrete measures | Correct. |
| 406 | Discrete divergence including zero reference weights | Correct. |
| 421 | Lower-semicontinuous perspective | Correct with \(\psi(0,0)=0\); source gap F8. |
| 453 | Perspective Jensen calculation | Correct. |
| 476 | KL generator | Correct. |
| 489 | TV generator | Correct. |
| 496 | Full TV identities | Correct. |
| 513 | Measure Pinsker inequality | Correct. |
| 521 | Vector Pinsker inequality | Correct. |
| 530 | Hahn-set mass relation | Correct. |
| 536 | Binary coarse-grained KL | Correct with standard zero conventions. |
| 543 | Binary second derivative | Correct. |
| 556 | \(W_1\)/TV comparison | Correct and sharp. |
| 576 | Power generator | Interior formula correct; boundary/recession omitted, F4. |
| 581 | Hellinger density formula | Correct. |
| 592 | Jensen-Shannon definition/bound | Formula correct; bound needs probabilities, F4. |
| 600 | Jensen-Shannon generator | Correct, including normalization. |
| 644 | Scalar Legendre transform | Correct. |
| 647 | Measure variational formula | Correct, including global cap. |
| 656 | Functional conjugate | Correct. |
| 670 | Absolutely continuous/singular split | Correct. |
| 701 | Exact-to-empirical \(\phi\)-GAN chain | First equality correct through true conjugate; second drops domain and line 704 mislabels \(Z\) integral, F1. |
| 708 | Neural restricted saddle | Lower bound only for admissible global output class, F1. |
| 715 | Unscaled JS generator/conjugate | Correct. |
| 730 | IPM generator objective | Correct for the actual symmetric class \(B\). |

## Complete source-line inventory

The following disjoint ranges cover all 755 physical source lines exactly once.

| Lines | Content |
|---:|---|
| 1-10 | Chapter heading, label, overview, citations, indices. |
| 11-12 | Blank/separator lines. |
| 13-19 | Dual-norm section heading and motivation. |
| 20-27 | IPM setup and KR link. |
| 28-36 | Dual seminorm/IPM definition and consequences. |
| 37-39 | Index/spacing. |
| 40-49 | Total-variation example. |
| 50 | Blank. |
| 51-58 | KR/\(W_1\) example. |
| 59 | Blank. |
| 60-88 | Flat norm and Dudley example. |
| 89-91 | First figure introduction. |
| 92-109 | IPM-witness figure, caption, references, indices, label. |
| 110-114 | Metrization proposition motivation. |
| 115-123 | Two-part dual-norm metrization proposition. |
| 124-149 | Proof of both implications. |
| 150 | Blank. |
| 151-154 | Wasserstein weak-metrization corollary. |
| 155-161 | Corollary proof. |
| 162 | Blank. |
| 163-173 | RKHS/MMD section heading and motivation. |
| 174-185 | Positive/conditional definiteness and terminology. |
| 186-189 | Zero-mass/additive-kernel explanation. |
| 190-212 | Riesz, energy, shifted/Matérn, Laplacian, Gaussian example. |
| 213 | Blank. |
| 214-234 | Kernel seminorm, MMD, characteristic definition. |
| 235-245 | Mean-energy identity and anchored kernel. |
| 246-259 | RKHS dual proposition. |
| 260-271 | RKHS dual proof. |
| 272 | Blank. |
| 273-286 | Universal-kernel weak-metrization proposition. |
| 287-310 | MMD metrization proof. |
| 311-315 | RKHS references and transition. |
| 316-319 | Universal-kernel definition. |
| 320 | Blank. |
| 321-326 | Spectral characterization remark. |
| 327-329 | Sample-criterion transition. |
| 330-334 | Two-sample, FID, KID example. |
| 335 | Blank. |
| 336-352 | Discrete kernel norm and MMD formulas. |
| 353 | Blank. |
| 354-360 | \(\phi\)-divergence section heading/topology motivation. |
| 361-370 | Density-ratio setup and Bregman warning. |
| 371-378 | Entropy-function definition. |
| 379-383 | Superlinearity and historical names. |
| 384-394 | Measure \(\phi\)-divergence definition. |
| 395-399 | Singular recession/l.s.c. extension explanation. |
| 400-410 | Discrete common-support formula. |
| 411 | Blank. |
| 412-417 | Basic-properties proposition. |
| 418 | Blank. |
| 419-437 | Perspective proof. |
| 438-440 | Non-negativity transition. |
| 441-446 | Non-negativity/equality proposition. |
| 447 | Blank. |
| 448-460 | Perspective Jensen proof. |
| 461-469 | Classical examples/topology heading. |
| 470-484 | KL example and generator. |
| 485 | Blank. |
| 486-504 | TV \(\phi\)-example and discrete/density norms. |
| 505-507 | Pinsker transition. |
| 508-526 | Pinsker theorem. |
| 527 | Blank. |
| 528-547 | Pinsker proof. |
| 548 | Blank. |
| 549-569 | Strong-versus-weak remark. |
| 570-574 | Spacing and main-families heading. |
| 575-610 | Power, Hellinger, Jensen-Shannon, TV families. |
| 611-612 | Second figure introduction. |
| 613-624 | \(\phi\)-generator figure and caption. |
| 625 | Blank. |
| 626-633 | \(\phi\)- versus Bregman remark/data processing. |
| 634-640 | Variational-dual heading/motivation. |
| 641-666 | Measure variational/conjugate proposition. |
| 667 | Blank. |
| 668-678 | Conjugate/Fenchel-Moreau proof. |
| 679-681 | Blank/separators. |
| 682-694 | GAN section, motivation, model/data setup. |
| 695-706 | Divergence-based adversarial formula. |
| 707-724 | Neural restriction, vanilla GAN, optimization discussion. |
| 725-744 | IPM/MMD/WGAN formulation and topology. |
| 745 | Blank. |
| 746-750 | Imitation-learning example. |
| 751 | Blank. |
| 752-755 | Weight-clipping remark. |

Mechanical line classes reconcile as **81 blank + 15 comment-only + 659 other content = 755**.

## Environment, label, reference, citation, and dependency inventory

### Mechanical environment counts

- 1 chapter command.
- 4 section commands.
- 7 paragraph headings.
- 26 theorem-like environments: 6 **defn**, 8 **example**, 3 **prop**, 3 **proposition**, 1 **thm**, 1 **cor**, 4 **rem**.
- 8 proofs.
- 2 figures and 2 tabular environments.
- 5 included PDF panels.
- 1 enumerate environment.
- 3 cases environments.
- 44 displayed formulas.
- 38 explicit labels, all unique, plus macro anchor **eq-dual-div**.
- 33 reference occurrences to 23 distinct targets.
- 24 citation commands containing 28 distinct keys.
- 176 index commands.
- No algorithm environment.
- All inspected begin/end structures are balanced.

### Labels

- **Chapter/sections:** sec-divergences-dual-norms, sec-dual-norms, sec-rkhs-mmd, sec-phi-div, sec-gan-duality.
- **Definitions/results:** def-dual-norm-ipm, prop-dual-norm-metrization, cor-topol-wass, def-positive-kernels, def-kernel-mmd-norm, prop-kernel-rkhs-dual, prop-mmd-metrization, def-universal-kernel, def_entropy, def_divergence, prop-basic-phi-divergence-properties, phi-div-positive, thm-pinsker, prop-phi-div-dual.
- **Examples:** ex-two-sample-testing-fid, ex_KLdiv, exmp-tv, ex-imitation-learning-ot.
- **Figures:** fig:dualnorms-ipm-witnesses, fig:dualnorms-phi-generators.
- **Explicit equations:** eq-dual-norm-cont, eq-set-flatnorm, eq-set-dudley, eq-dual-kern, eq-kernel-dual, eq-mmd-discr, eq-phi-div, eq-div-disc-meas, eq-discr-diverg, eq-shannon-entropy, eq-tv-entropy, eq-defn-tv, eq-legendre.
- **Macro equation anchor:** eq-dual-div.

### Cross-references

All 23 distinct targets resolve in the current source or retained auxiliary metadata.

- **Within Chapter 7:** eq-defn-tv, eq-div-disc-meas, eq-dual-div, eq-dual-norm-cont, eq-kernel-dual, eq-legendre, eq-phi-div, eq-shannon-entropy, eq-tv-entropy, both figure labels, prop-basic-phi-divergence-properties, prop-dual-norm-metrization, prop-kernel-rkhs-dual.
- **Imported measure/TV/Bures material:** defn-total-variation, prop-tv-dual-measure, prop-gaussian-w2-bures.
- **Imported Wasserstein comparison:** prop-comp-wass-p.
- **Imported KR formula:** eq-w1-cont; semantic target repair F8.
- **Imported entropy formulas:** eq-kl-defn, eq-defn-rel-entropy.
- **Imported statistics sections:** sec-sample-complexity, sec-bias-variance-ot.

The sample-complexity section contains a bounded-kernel MMD value-rate proposition. The OT bias/variance section does not provide the KID \(U\)- versus \(V\)-statistic formulas or FID plug-in bias; the Chapter 7 sentence is best read as a broad pointer, not a complete estimator analysis.

### Citation keys

All 28 keys occur in the current **OT4ML/all.bib** and retained **OT4ML/OT4ML.bbl**.

| Key | Adjacent use | Second-pass disposition |
|---|---|---|
| ciszar1967information | Classical \(f\)-divergence/data processing | Relevant primary source; author spelling metadata F8. |
| ali1966general | General divergence coefficients | Relevant primary source. |
| sriperumbudur2009integral | IPM/\(\phi\) intersection | Relevant. |
| sriperumbudur2012empirical | Empirical IPMs | Relevant; not the best source for \(C_0\)-universality. |
| sriperumbudur2008injective | Characteristic spectral support | Relevant primary source. |
| GAN | Vanilla GAN/JS | Relevant primary source. |
| WassersteinGAN | WGAN/Lipschitz critic/clipping | Relevant primary source. |
| hanin1992kantorovich | KR/flat naming | Relevant. |
| lellmann2014imaging | KR discrepancy in imaging | Relevant. |
| berg84harmonic | Positive/negative definite harmonic analysis | Relevant book. |
| schoenberg38 | Negative type/energy kernels | Foundational and relevant. |
| szekely2004testing | Energy testing | Relevant; sparse metadata. |
| wendland2005scattered | Matérn/kernel background | Relevant, but missing \(s>d/2\) remains F3. |
| gretton2012kernel | MMD/two-sample testing | Relevant; metadata cleanup F8. |
| muandet2017kernel | Kernel mean embeddings | Relevant review. |
| Hofmann2008 | General RKHS and alleged shape-analysis use | General RKHS only; mismatch F8. |
| berlinet03reproducing | RKHS background | Relevant book. |
| scholkopf2002learning | Kernel learning | Relevant book. |
| ramdas2017wasserstein | Wasserstein two-sample testing | Relevant. |
| HeuselRamsauerUnterthinerNesslerHochreiter2017FID | FID | Relevant primary source. |
| BinkowskiSutherlandArbelGretton2018MMDGAN | KID/MMD-GAN | Relevant primary source. |
| endres2003new | Square-root JS metric | Relevant primary source. |
| osterreicher2003new | Metric divergences | Relevant. |
| pinsker1964information | Pinsker inequality | Foundational; convention translated correctly. |
| MMD-GAN | Fixed-kernel MMD generator training | Relevant with naming caveat F8. |
| FrognerNIPS | WGAN sentence | Wrong adjacent use, F8. |
| XiaoHermanWagnerZiescheEtesamiLinh2019WAIL | Wasserstein adversarial imitation | Relevant. |
| DadashiHussenotGeistPietquin2020PWIL | Primal Wasserstein imitation | Relevant; publication metadata stale, F8. |

### Primary-source checks

The following primary/publisher-hosted sources were checked independently during the second pass:

- [Nowozin, Cseke, and Tomioka, f-GAN](https://papers.nips.cc/paper/6066-f-gan-training-generative-neural-samplers-using-variational-divergence-minimization.pdf): variational \(f\)-divergence bound, scalar conjugate domains, divergence-specific output activations.
- [Goodfellow et al., Generative Adversarial Nets](https://proceedings.neurips.cc/paper_files/paper/2014/file/f033ed80deb0234979a61f95710dbe25-Paper.pdf): optimized minimax value \(-\log4+2\,\mathrm{JS}\).
- [Arjovsky, Chintala, and Bottou, WGAN](https://proceedings.mlr.press/v70/arjovsky17a/arjovsky17a.pdf): 1-Lipschitz critic and clipping to \([-c,c]\).
- [Sriperumbudur et al., COLT 2008](https://www.learningtheory.org/colt2008/papers/COLT2008.pdf): characteristic translation-invariant kernels and full spectral support.
- [Sriperumbudur, Fukumizu, and Lanckriet, JMLR 2011](https://www.jmlr.org/papers/volume12/sriperumbudur11a/sriperumbudur11a.pdf): universal versus characteristic kernels.
- [Simon-Gabriel et al., JMLR 2023](https://jmlr.org/papers/v24/21-0599.html): noncompact MMD weak-metrization qualifications.
- [Gretton et al., A Kernel Two-Sample Test](https://www.jmlr.org/papers/volume13/gretton12a/gretton12a.pdf): MMD population and \(U/V\)-statistic testing formulas.
- [Binkowski et al., Demystifying MMD GANs](https://openreview.net/pdf?id=r1lUOzWCW): KID's unbiased estimator and FID bias.
- [Heusel et al., FID](https://proceedings.neurips.cc/paper/2017/hash/8a1d694707eb0fefe65871369074926d-Abstract.html): Gaussian-feature FID definition.
- [Liero, Mielke, and Savare, Optimal Entropy-Transport](https://iris.unibocconi.it/retrieve/e31e10d4-0f6e-31fb-e053-1705fe0a5b99/Liero-Mielke-Savare18.pdf): entropy perspectives, recession terms, finite measures, lower semicontinuity, duality.
- [Schoenberg, Metric Spaces and Positive Definite Functions](https://www.ams.org/journals/tran/1938-044-03/S0002-9947-1938-1501980-0/S0002-9947-1938-1501980-0.pdf): negative type.
- [Szekely and Rizzo, Energy Statistics](https://pages.stat.wisc.edu/~wahba/stat860public/pdf4/Energy/JSPI5102.pdf): energy distance and moment domain.
- [Lindgren, Rue, and Lindstrom, Matérn/SPDE link](https://rss.onlinelibrary.wiley.com/doi/10.1111/j.1467-9868.2011.00777.x): Matérn exponent relation \(s=\nu+d/2\).
- [Endres and Schindelin, Jensen-Shannon metric](https://doi.org/10.1109/TIT.2003.813506): probability-level metric and normalization.
- [Frogner et al., Learning with a Wasserstein Loss](https://proceedings.neurips.cc/paper_files/paper/2015/file/a9eb812238f753132652ae09963a05e9-Paper.pdf): confirms the paper is supervised loss work, not WGAN.
- [Dadashi et al., PWIL](https://openreview.net/pdf?id=TtYSU29zgR): primal Wasserstein imitation and normalized trajectory distributions.

## Figure and numerical provenance audit

### Shared helper

- Path: **notebooks-figures/figure_style.py**
- SHA-256: **1831104c58f5a793695ab31856ebff2a90b500911e8b53976fcabede737768c9**
- Size: **11,323 bytes**
- Git state: clean.
- Relevant behavior: common serif styling; deterministic figure directory; PDF saved with tight bounding box. No stochastic helper is used by either chapter figure.

### Figure fig:dualnorms-ipm-witnesses

- Generator: **notebooks-figures/dualnorms-ipm-witnesses.ipynb**
- SHA-256: **d623acddf545ebb8522b0b5356b72024a9ce92d2dd3ec550585ff1c3f5a770c0**
- Size: **35,558 bytes**
- Retained code execution counts: **[null, 1, 2, 3, 4]**
- Inputs: deterministic 700-point grid on \([-3.2,3.2]\); two explicit Gaussian mixtures renormalized to masses \(0.9999999999999998\) and \(1.0000000000000002\); Gaussian bandwidth \(0.42\).
- Cumulative mass residual at the right endpoint: \(7.824823718935428\times10^{-18}\).
- Raw/display \(W_1\) numbers: max absolute raw witness \(1.6204700592683543\); raw discrete Lipschitz constant \(1\); plotted constant \(0.617104891435958\).
- MMD arithmetic grid mean before subtraction: \(-5.3157126448193685\times10^{-5}\).
- TV sign changes: 2.
- Retained PDFs, all tracked and clean:
  - **w1.pdf**, 25,079 bytes, SHA-256 **52e09c8a6033809b6060a094a1998a7faa62524ae21170c2f3155a3132a4cd6a**, one page, \(196.884\times143.965\) pt.
  - **mmd.pdf**, 25,766 bytes, SHA-256 **9f8a1d76c1f664a7a785da460d7d314209636cc5e22f5bf31c7f781bf6e42335**, same page size.
  - **tv.pdf**, 25,074 bytes, SHA-256 **39069dfe2870e13ca3979e1bb3af13920fc8229615628d5f56fc6d7749b1fd03**, same page size.
- PDF producer: Matplotlib 3.10.8; creation timestamp 2026-06-11 18:07:26 CEST.
- Visual inspection matches the generator: V-shaped \(W_1\), smooth oscillatory MMD, discontinuous TV sign, separately peak-normalized density fills.
- Mathematical/caption disposition: F5.

### Figure fig:dualnorms-phi-generators

- Generator: **notebooks-figures/dualnorms-phi-generators.ipynb**
- SHA-256: **4baeab4ae87bd70c2c3570c55ce2d3891cef296ff176b819f9d66e897a8099e4**
- Size: **58,058 bytes**
- Retained code execution counts: **[null, 1, 2, 3, 4]**
- Left panel exactly implements KL, reverse KL, TV, half-Pearson \(\chi^2\), and Hellinger on \(s\in[0.035,3.4]\). All plotted generators vanish at \(s=1\).
- Right panel uses explicit strictly positive vectors \(a,b\), normalizes both, computes \(a_i/b_i\), and plots local KL contributions
  \[
  b_i\left[(a_i/b_i)\log(a_i/b_i)-a_i/b_i+1\right].
  \]
  Because every displayed \(b_i>0\), omission of the singular discrete term in this caption does not make the plotted formula false.
- Retained PDFs, tracked and clean:
  - **generators.pdf**, 18,614 bytes, SHA-256 **4cfb779a5d3af88fab152d802a140ec1fc5ad90c8742ed25b4c7850116f1016b**, one page, \(217.558\times148.039\) pt.
  - **ratio-penalties.pdf**, 21,626 bytes, SHA-256 **77bc16566a99eff2d80ec4825ec4f3ee578e7c9dcbe622bd1185f620ad7cb0c2**, one page, \(226.853\times148.039\) pt.
- PDF producer: Matplotlib 3.10.8; creation timestamps 2026-06-11 18:07:40-41 CEST.
- Visual inspection agrees with code and caption. No mathematical or numerical defect was found.

### Provenance limitation

The notebooks were modified on 2026-07-11, after the PDF creation timestamps. Naming, retained execution outputs, deterministic code, clean Git state, hashes, and visual agreement strongly connect generators and outputs, but the PDFs do not embed notebook hashes or parameter manifests. Therefore there is no cryptographic proof that the five PDFs were produced from the exact current notebook bytes. The notebooks were not re-executed because the audit's write scope forbids changing retained outputs. This is a provenance limitation, not evidence of stale numerical content.

## Optional extensions and research-level clarifications

These are not included in the nine established findings.

1. **KID \(U/V\) estimators.** Add the formulas in the MMD audit above, explain that the unbiased statistic can be negative, and describe permutation/null calibration.
2. **FID finite-sample bias.** Explain plug-in bias and sample-size dependence separately from the population Bures geometry.
3. **Noncompact MMD topology.** Add a warning that characteristicness, \(C_0\)-universality, integral strict positive definiteness, and weak-metrization are distinct outside compact spaces.
4. **Strict data-processing equality.** For strictly convex generators, characterize equality through sufficient statistics/recoverability of the likelihood ratio, including singular parts.
5. **Neural discrepancy topology.** A fixed finite neural class generally does not separate all probability laws. Approximation error and statistical complexity should be distinguished from the population IPM/divergence.
6. **Generator objective.** Distinguish the minimax JS generator from the common non-saturating update and state that minimizing a critic-restricted lower bound need not minimize the exact divergence.
7. **Occupancy convention.** Explicitly define discounted occupancy as \((1-\gamma)\sum_{t\ge0}\gamma^t\mathcal L(s_t,a_t)\), or state the common finite-horizon mass, even though the present claim is not false.
8. **Affine generator normalization.** State that adding \(a(s-1)\) is harmless only for equal-mass arguments.
9. **Figure reproducibility.** Embed notebook hash, parameters, and package versions in PDF metadata or a sidecar manifest.

## Original prioritized repair order (completed)

1. **F1:** Restore the admissible critic class and \(Z\)-domain integral in the empirical/neural \(\phi\)-GAN display. Explain global cap versus scalar domain and generated singular support.
2. **F2:** Restrict the Wasserstein corollary to \(1\le p<\infty\).
3. **F3:** Add kernel measurability/integrability, energy first moments, and Matérn \(s>d/2\).
4. **F4:** Add power-family boundary/recession conventions and the probability hypothesis for the Jensen-Shannon bound.
5. **F5:** Relabel the first figure as display-normalized witness shapes or regenerate exact witnesses.
6. **F6-F7:** Add the convex-domain qualifier and semidefinite FID extension.
7. **F8:** Repair semantic citations/cross-references and add primary f-GAN/vector-measure sources.
8. **F9:** Replace the unit clipping box by \([-c,c]\).

## Read-only audit mechanical reconciliation (historical baseline)

| Item | Count/value | Reconciliation |
|---|---:|---|
| Source physical lines, entry | 755 | Verified from current on-disk source. |
| Source bytes, entry | 47,018 | Verified. |
| Source SHA-256, entry | 1181852e56e1621b90cd9b44a2d12b8843c4d698b7649c5bb617bb229c50538f | Matches supplied baseline. |
| Source physical lines, completion | 755 | Unchanged. |
| Source bytes, completion | 47,018 | Unchanged. |
| Source SHA-256, completion | 1181852e56e1621b90cd9b44a2d12b8843c4d698b7649c5bb617bb229c50538f | Byte-for-byte unchanged. |
| Line classes | 755 | \(81+15+659=755\). |
| Headings | 12 | 1 chapter + 4 sections + 7 paragraphs. |
| Theorem-like environments | 26 | \(6+8+3+3+1+1+4=26\). |
| Proofs | 8 | All audited. |
| Displays | 44 | 23 macro + 21 bracket. |
| Explicit labels | 38 | All unique. |
| Macro equation anchors | 1 | eq-dual-div; 39 chapter-originating anchors total. |
| Reference occurrences | 33 | 23 distinct targets; all resolve. |
| Citation commands | 24 | 28 distinct keys; all resolve in current .bib and retained .bbl. |
| Figures | 2 | 5 retained PDF panels; both generators and helper audited. |
| Index commands | 176 | Mechanically counted. |
| Algorithms | 0 | None present. |
| Established findings | 9 | 0 Critical + 1 Major + 2 Moderate + 6 Minor. |
| Prior findings reconciled | 10 | Every prior F1-F10 mapped in the refinement table. |
| Modified workspace paths | 1 | Only /Users/gpeyre/Dropbox/github/ot4ml/audit-chap7.md. |
| Commits/pushes | 0 | None. |

## First correction-pass validation - 2026-08-26

| Check | Result |
|---|---|
| Corrected chapter source | 766 physical lines; 50,275 bytes; SHA-256 `31790ef1f76bd7119942c315f988763e043970f9d7bb3ccc259a6e153f15e4b5`. |
| Full isolated LaTeX build | Successful; 486-page A4 PDF generated with `latexmk`. |
| LaTeX diagnostics | No fatal error, undefined citation, undefined reference, multiply defined label, or overfull box. |
| BibTeX diagnostics | Zero warnings. |
| Visual QA | All 11 Chapter 7 pages, printed pages 117--127 and physical PDF pages 125--135, inspected at 160 dpi; no clipping, collision, caption overflow, or misplaced float was found. |
| Source hygiene | `git diff --check` passes for the chapter, bibliography, and this audit file. |
| Figure scope | No notebook or retained figure asset was modified; the corrected caption now matches the existing display normalization. |
| Finding closure | 9 of 9 established findings resolved; no unresolved Critical, Major, Moderate, or Minor audit finding remains. |

## Second correction iteration - 2026-08-26

A second adversarial pass re-derived each of the nine repaired points and checked
their immediate downstream uses. It found no reopened original finding, but it
did identify one residual rigor gap in the first repair of F3: absolute
integrability of a measurable kernel energy alone did not transparently carry
finite-Gram positivity to arbitrary signed measures. The following refinements
were therefore made.

| Area | Second-iteration refinement |
|---|---|
| Measure-level kernel energy | Introduced the anchored positive-definite kernel `k^circle` for conditionally positive kernels, required strong measurability and integrability of its canonical feature map, and defined the energy through the resulting Bochner mean. RKHS Cauchy--Schwarz now proves absolute convergence, while feature-map translation proves anchor independence on zero-mass measures. |
| RKHS duality | Rewrote Proposition 7.10 on exactly the admissible domain of Definition 7.9, so existence of the mean embedding and equality between the quadratic energy and RKHS dual norm are proved under one coherent hypothesis. |
| Discrete specialization | Restricted `||alpha||_k^2 = a^T K a` for a non-zero-mass measure to positive-definite kernels; the difference formula remains valid for conditionally positive kernels because `alpha-beta` has zero mass. |
| Jensen--Shannon scope | Distinguished the probability-distance statement from its homogeneous extension to finite positive measures and retained the `M log 2` bound on equal-mass pairs. |
| FID scope | Replaced the vague “inverse-covariance map” wording by an exact reference to `eq-bures-map` and its positive-definite covariance hypothesis. |
| Optimization notation | Replaced `min/max` by `inf/sup` in the exact and neural adversarial formulations, avoiding an unstated compactness or attainment assumption. |

| Validation check | Result |
|---|---|
| Corrected chapter source | 767 physical lines; 50,885 bytes; SHA-256 `053f4b0ad59fca701bb985bf72237e51c0f78d4856b7617e4ec5065212d4cb9e`. |
| Full isolated LaTeX build | Successful; 486-page A4 PDF generated with `latexmk`. |
| LaTeX and BibTeX diagnostics | No fatal error, undefined citation, undefined reference, multiply defined label, overfull box, or BibTeX warning. |
| Visual QA | All 11 Chapter 7 pages were inspected in a contact sheet; the rewritten kernel page and the Jensen--Shannon/GAN pages were additionally inspected at full resolution. No clipping, collision, overflow, or misplaced float was found. |
| Source hygiene | `git diff --check` passes for the chapter, bibliography, and audit file. |
| Finding closure | 9 of 9 established findings remain resolved after the second mathematical pass. |

## Post-correction verdict

All nine established findings have been resolved in the manuscript and remained
closed under the second correction iteration. The repaired
chapter now distinguishes finite-order Wasserstein weak metrization from the
`W_infinity` endpoint, states the measure-level domains needed by kernel
energies, gives the correct Matérn threshold and divergence boundary data,
handles semidefinite FID covariances, and preserves the global critic cap when
specializing the finite-measure Fenchel formula to empirical GAN objectives.
The remaining optional extensions listed above are possible enrichments, not
known mathematical defects in Chapter 7.
