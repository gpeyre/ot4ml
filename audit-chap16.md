# Second-Pass Adversarial Mathematical Audit of Chapter 16

## Audit basis

- **Authoritative source:** `OT4ML/sections/transportation-models.tex`
- **Chapter label:** `sec-generative-models-transportation`
- **Source state audited:** 2,710 lines, 15,634 words, 158,028 bytes
- **SHA-256:** `ae8c8630bc6c2db7d8408600157ec6bb3adbb10fc88816aaa5d62083dd67319d`
- **Second-pass audit date:** 2026-08-25
- **Scope:** a new line-by-line reading of all 2,710 authoritative lines; every definition, named result, proof, display, figure caption, and major informal claim; all cross-chapter definitions needed to fix sign and normalization conventions; every chapter label, reference, citation key, and graphic path; the arXiv and MyST replicas only for source drift; and every generating notebook whose code bears on a mathematical claim in a caption.
- **Conventions checked:** the book uses `\partial_t\alpha+\operatorname{div}(\alpha v)=0`, Wasserstein gradient `\nabla\delta f`, descent velocity `-\nabla\delta f`, normalized spherical measure in `\mathrm{SW}_2`, quadratic cost `|x-y|^2` in the Gaussian Sinkhorn formulas, and the variation seminorm `\max z-\min z`.
- **Independence of this pass:** every first-pass finding was treated as a hypothesis. The source, derivations, primary papers, and notebook code were rechecked before deciding its disposition.

No chapter, notebook, figure, replica, or bibliography file was changed during this pass. The authoritative source hash remained the one recorded above.

## Executive conclusion

The chapter remains mathematically strong at the formula level. All nine rows of the Gaussian closure catalogue, every displayed one-dimensional Gaussian restriction, the Gaussian product-coupling flow map, the stochastic-interpolant Fokker--Planck correction, Tweedie's identity, the SVGD sign, and every Dobrushin/Birkhoff/consensus constant check out independently. I found no Critical error and no central theorem whose conclusion must be withdrawn.

There are still two Major defects. First, line 42 identifies the conditional-expectation flow-matching representative with the minimum-kinetic-energy Wasserstein tangent obtained from a weighted Poisson problem. The chapter does not repeat this error globally, and its special Gaussian equality is correct, but the introductory identification is genuinely false and consequential. Second, the converse part of the moment-measure variational proposition is a true theorem with an invalid proof under its stated nonsmooth hypotheses; the correct argument is one-sided and uses the absolutely continuous distributional Laplacian, the essential-continuity boundary inequality, and approximation.

The second pass removed two false positives. In particular, a smooth Gaussian marginal curve can indeed be realized by a deterministic affine latent interpolant whose exact conditional flow-matching field is the symmetric Lyapunov representative; the chapter only makes this existential claim. Also, the quadratic-kernel MMD row never claims characteristicness and already identifies the raw-second-moment content. The remaining Moderate findings concern endpoint flow scope, an `L^2` regression domain, sliced-flow theorem scope, two materially misleading computations/captions, moment-measure hypotheses, finite projective diameter, ambient-flow solution classes, and stale replicas.

### Finding counts

| Severity | Count |
|---|---:|
| Critical | 0 |
| Major | 2 |
| Moderate | 10 |
| Minor | 13 |
| **Total** | **25** |

Severity meanings used here are: **Critical**, a central conclusion is false or unusable; **Major**, a central conceptual claim or formal proof is materially wrong; **Moderate**, a result is materially over-scoped, under-hypothesized, or represented by the wrong computation; **Minor**, a local hypothesis, notation, or interpretation should be tightened without changing the chapter's main mathematics.

## Second-pass changes

The table gives an explicit disposition for every first-pass finding. "Narrowed" means that the defect survives only in the location or sense stated here; it must not be propagated to nearby correct claims. Removed findings are excluded from the active counts.

| First-pass ID | Second-pass disposition | Active consequence |
|---|---|---|
| MAJ-1 | **Confirmed and narrowed.** | Remains MAJ-1. The conflation is at lines 19 and especially 42. Proposition `prop-flow-matching-vector-field` is correct, Remark lines 1045--1055 later distinguishes the representatives, and the Gaussian equality at line 323 is valid because that conditional field is a gradient. |
| MAJ-2 | **Confirmed and classified more precisely.** | Remains MAJ-2. The proposition is true; its converse proof is invalid at the stated regularity. A complete replacement argument is supplied below. |
| MOD-1 | **Confirmed and narrowed.** | Remains MOD-1. Finite-time push-forward is conditional on a suitable characteristic/regular-Lagrangian flow; the unqualified endpoint sentence is the issue, not every singular endpoint. |
| MOD-2 | **Confirmed.** | Remains MOD-2. The displayed space-time squared-loss theorem needs an `L^2` domain, naturally `\alpha\in\mathcal P_2`. |
| MOD-3 | **Confirmed.** | Remains MOD-3. The cited theorem is standard Gaussian, with an isotropic extension only. |
| MOD-4 | **Split and narrowed.** | MOD-4 now concerns only the materially mismatched drifting figure/computation. The absolute anti-collapse wording is downgraded to MIN-11. |
| MOD-5 | **Confirmed.** | Remains MOD-5: the definition must require `0<Z_u<\infty`. |
| MOD-6 | **Confirmed and narrowed to theorem scope.** | Remains MOD-6. The cited existence theorem assumes an absolutely continuous target with compact convex support; broader use may be presented as an ansatz. |
| MOD-7 | **Confirmed and narrowed.** | Remains MOD-7 only for the pre-theorem general bound at lines 1536--1573. The consensus theorem itself is correct because positive Lipschitz `K` on compact `C_0\times C_0` is uniformly positive. |
| MOD-8 | **Confirmed.** | Remains MOD-8. The middle panel is an ad hoc covariance bump, not a Sinkhorn curve or a Schrodinger bridge. |
| MOD-9 | **Confirmed and narrowed.** | Remains MOD-9 as a solution-class/uniqueness qualification. Every catalogue field and matrix ODE is correct and gives an exact ambient Gaussian PDE solution. |
| MOD-10 | **Removed as a false positive.** | No active finding. "Can be taken" is existential. The symmetric Lyapunov field is realized exactly by the deterministic affine flow-map interpolant, although it is not the conditional field for every latent coupling. |
| MOD-11 | **Confirmed.** | Remains MOD-11. Both replicas still contain mathematically stale flow-matching/SVGD text; MyST also retains old `P_t` notation. |
| MIN-1 | **Confirmed.** | Remains MIN-1. Pointwise differentiability is weaker than the pathwise absolute continuity used later. |
| MIN-2 | **Confirmed.** | Remains MIN-2. McCann interpolation requires a quadratic-optimal coupling/map. |
| MIN-3 | **Confirmed.** | Remains MIN-3. Four schedule endpoint conditions are omitted and `\pi` is reused. |
| MIN-4 | **Confirmed.** | Remains MIN-4. The displayed regression has a free `t`. |
| MIN-5 | **Confirmed.** | Remains MIN-5. State the `L^2` equivalence and test-function classes. |
| MIN-6 | **Confirmed.** | Remains MIN-6. Standard Stein/RKHS admissibility is needed. |
| MIN-7 | **Confirmed and narrowed.** | Remains MIN-7. Projection is onto the closed tangent-gradient space; weighted divergence-free additions can realize the same measure descent. |
| MIN-8 | **Confirmed as a notation clarification.** | Remains MIN-8. "Full update" means `\tau=1`; the general damped factor is already correct in the theorem. |
| MIN-9 | **Removed as a false positive.** | No active finding. The row is correctly called an MMD, makes no metric/identifiability claim, and explicitly says that the embedding is the raw second moment. |
| MIN-10 | **Confirmed.** | Remains MIN-10. `\GaussProj` is defined in a Definition, not in the following theorem. |

New active Minor findings are: MIN-11, the anti-collapse language split from MOD-4 and broadened to the analogous SVGD sentence; MIN-12, omitted independence in the Gaussian diffusion-path covariance; MIN-13, a covariance-eigenvalue derivative called a scalar spatial velocity; and MIN-14, a reverse-flow caption calling stratified jittered seeds Gaussian samples.

## Established findings

### Critical

No Critical findings.

### Major

#### MAJ-1. Conditional flow matching is not the weighted-Poisson least-square velocity

**Location.** Lines 19 and 42, chapter introduction; compare the actual regression at lines 123--218, the special Gaussian statement at lines 311--405, and the later correct warning at lines 1045--1055. The referenced formula is `eq:least-square-field-explicit` in `OT4ML/sections/dynamic-ot.tex`, lines 160--189.

**Current claim.** The chapter says that one first finds the field by the constrained least-square/weighted-Poisson formula and that the conditional expectation is a way of computing “this” field without inverting a Laplacian.

**Defect.** The two optimizations project different objects onto different spaces.

The weighted-Poisson problem fixes the marginal curve and minimizes
\[
\int |v_t|^2\,d\alpha_t
\quad\text{subject to}\quad
\partial_t\alpha_t+\operatorname{div}(\alpha_t v_t)=0.
\]
Its solution is the unique minimum-norm Wasserstein tangent, hence an element of the `L^2(\alpha_t)` closure of gradients.

Flow matching instead minimizes
\[
\mathbb E\bigl[|v_t(I_t(U))-\dot I_t(U)|^2\bigr]
\]
over all state-measurable fields. It gives
\(v_t^{\rm FM}=\mathbb E[\dot I_t(U)\mid I_t(U)=\cdot]\), which solves the continuity equation but need not be a gradient and need not minimize kinetic energy among all velocities for the same marginal curve.

More explicitly, put
\[
\mathsf G_t=\overline{\{\nabla\phi:\phi\in C_c^\infty\}}^{L^2(\alpha_t)},
\qquad
\mathsf N_t=\{w\in L^2(\alpha_t):\operatorname{div}(\alpha_t w)=0\}.
\]
Under the weighted Helmholtz decomposition, `\mathsf G_t=\mathsf N_t^\perp`. If `b_t=v_t^{\rm FM}`, then the weighted-Poisson representative is
\[
v_t^{\min}=P_{\mathsf G_t}b_t,
\qquad
\int\nabla\phi_t\cdot\nabla\psi\,d\alpha_t
=\int b_t\cdot\nabla\psi\,d\alpha_t,
\]
while conditional flow matching is the unrelated projection of the latent random vector `\dot I_t(U)` onto the closed subspace of `\sigma(I_t(U))`-measurable random vectors. Calling both operations "least squares" does not make their outputs equal.

**Decisive counterexample.** Let `d=2`, let `U\sim N(0,I_2)`, let `J` be the 90-degree skew-symmetric rotation, and set `I_t(U)=e^{tJ}U`. Then `\alpha_t=N(0,I_2)` is constant, while
\[
v_t^{\rm FM}(z)=Jz.
\]
Since `\operatorname{div}(\rho Jz)=0` for the standard Gaussian density `\rho`, this is an admissible nonzero rotational velocity for the constant curve. The minimum-energy weighted-Poisson velocity is instead `v_t^{\min}=0`. Thus the two fields can be maximally different even for a smooth Gaussian curve.

In general,
\[
v_t^{\rm FM}=v_t^{\min}+w_t,
\qquad
\operatorname{div}(\alpha_t w_t)=0,
\]
whenever the weighted Helmholtz decomposition is available.

**Adversarial scope check.** Line 19 by itself can be read harmlessly: the chosen interpolant makes the continuity equation hold while an unconstrained regression learns one admissible representative. Line 42 is not harmless, because it explicitly says that the field from `eq:least-square-field-explicit` is computed by conditional expectation. The formal flow-matching proposition at lines 123--218 makes no such equality claim. Remark lines 1045--1055 later gives the correct projection distinction. Line 323 is also correct: Proposition `prop:flow` produces a gradient conditional field, so its weighted divergence-free remainder is zero and it equals the minimum tangent. Thus MAJ-1 is a consequential error in the section's conceptual setup, not a defect in every later flow-matching formula.

**Repair.** Replace line 42 by a distinction between the two regressions. State that the conditional field already enforces the prescribed continuity equation, while the weighted-Poisson field is its minimum-norm gradient representative. State coincidence only under an extra gradient condition. The Gaussian-endpoint field of Proposition `prop:flow` is one such special case, which is why line 323 is correct even though line 42 is not.

#### MAJ-2. The converse moment-measure proof uses unjustified equalities under nonsmooth hypotheses

**Location.** Proposition `prop-moment-hidden-convexity`, especially lines 1221--1239 (“Conversely”); the proposition begins at line 1196.

**Current claim.** For an essentially continuous convex `u` with `\eta=Z_u^{-1}e^{-u}dx` and `\alpha=(\nabla u)_\#\eta`, the proof takes a Brenier map `T` to a smooth compactly supported competitor and asserts exact entropy and maximal-correlation directional derivatives that cancel.

**Defect.** The proposition's conclusion is true, but the proof as written silently assumes substantially more regularity than the statement. Essential continuity allows a nonsmooth convex `u` and nontrivial effective-domain boundary. The Brenier potential generating `T` can have a singular distributional Hessian. In this setting:

- the entropy derivative is naturally expressed using the absolutely continuous Laplacian of the Brenier potential, not automatically as the exact integral in line 1225;
- integration by parts against `e^{-u}` needs the essential-continuity boundary estimate;
- the maximal-correlation term supplies a one-sided derivative bound, not an a priori differentiability identity;
- singular Hessian mass must be handled through `\Delta^{ac}v\leq\Delta v`;
- the passage from compactly supported competitors to the full `\mathcal P_1` domain requires the paper's approximation result.

The primary source explicitly treats this converse separately. Santambrogio's Proposition 5.1 starts with the one-sided estimate
\[
D^+\{\mathcal H+\mathcal C_\alpha\}(\eta)
\geq
-\int(\Delta^{ac}v-d)\,d\eta
+\int(\nabla v-x)\cdot\nabla u\,d\eta,
\]
then uses the essential-continuity estimate, `\Delta^{ac}v\leq\Delta v`, boundary control, and approximation to obtain nonnegativity. See [Santambrogio, Proposition 5.1](https://arxiv.org/pdf/1507.04187), especially Section 5; displacement convexity is Proposition 3.3 and existence/uniqueness is Theorem 4.1.

**Exact replacement argument.** Absorb `\log Z_u` into `u`, so `d\eta=e^{-u}dx`. Let `\nu` first be a compactly supported `\mathcal P_2` competitor, let `T=\nabla v` be the Brenier map from `\eta` to `\nu`, and put `\eta_s=((1-s)\operatorname{Id}+sT)_\#\eta`. Compact support of `\nu` makes `T` bounded. Santambrogio's entropy derivative and maximal-correlation directional bound give
\[
D^+\{\mathcal H+\mathcal C_\alpha\}(\eta;\nu)
\geq
-\int(\Delta^{ac}v-d)\,d\eta
+\int(\nabla v-x)\cdot\nabla u\,d\eta.
\]
Essential continuity gives the CEK integration-by-parts inequality
\[
\int x\cdot\nabla u\,d\eta\leq d.
\]
Consequently,
\[
D^+\{\mathcal H+\mathcal C_\alpha\}(\eta;\nu)
\geq
-\int\Delta^{ac}v\,d\eta
+\int\nabla v\cdot\nabla u\,d\eta.
\]
The distributional Hessian of convex `v` is a positive matrix-valued measure, so
`\Delta v=\Delta^{ac}v\,dx+\Delta^s v` with `\Delta^s v\geq0`. Since `\nabla u\,e^{-u}=-\nabla(e^{-u})`, cutoff integration by parts yields
\[
-\int\Delta^{ac}v\,e^{-u}dx
-\int\nabla v\cdot\nabla(e^{-u})dx
\geq
-\int e^{-u}\,d(\Delta v)
-\int\nabla v\cdot\nabla(e^{-u})dx
=0.
\]
The final equality is first taken on balls/cutoffs; bounded `\nabla v`, integrability of `\nabla(e^{-u})`, and exponential tails of the nondegenerate log-concave density make the boundary term vanish. Hence every such directional derivative is nonnegative. Displacement convexity gives global minimality against compactly supported competitors. Santambrogio's approximation proposition then supplies compactly supported `\nu_n` with both entropy and maximal correlation converging, extending the result to all `\nu\in\mathcal P_1`.

This also pinpoints the error in the chapter's cancellation: the nonsmooth proof obtains a lower bound by keeping the positive singular-Laplacian contribution; it does not establish two exact first derivatives that cancel.

**Repair.** Either:

1. replace lines 1221--1239 with the one-sided argument immediately above, including the distributional Hessian, CEK boundary inequality, cutoff limit, and compact-support approximation; or
2. explicitly label the displayed calculation as a smooth full-domain heuristic, prove it under `u,v\in C^2` with sufficient decay and uniformly positive Hessians, and then cite Proposition 5.1 for the nonsmooth extension.

The formal proposition may remain; it is a true theorem with an insufficient proof, not a false theorem.

### Moderate

#### MOD-1. Exact terminal sampling by an ODE is overclaimed at singular endpoints

**Location.** Lines 229--233 (“For the exact field…”); related endpoint caveats correctly appear later at lines 605 and 628.

**Current claim.** Integrating the exact field defines a transport map and, in the ideal exact-field limit, `X_{t=1}` has law `\beta`.

**Defect.** The first sentence partly qualifies the claim, but the terminal conclusion suppresses the required flow existence, uniqueness, and endpoint integrability. A distributional continuity-equation solution with `v\in L^2(dt\,d\alpha_t)` does not by itself produce a classical flow map. If a smooth absolutely continuous law is driven to atoms, a regular diffeomorphic flow cannot realize the terminal collapse at finite time; the velocity or its spatial derivative must become singular, and the endpoint is generally obtained only as `t\uparrow1`. This is exactly what the later Dirac examples do by stopping early.

**Repair.** State the map identity on compact subintervals where a classical or regular Lagrangian flow exists. For the endpoint, say
\[
(T_t)_\#\alpha_0=\alpha_t\quad (t<1),
\qquad
(T_t)_\#\alpha_0\rightharpoonup\beta\quad(t\uparrow1),
\]
unless assumptions guarantee extension to `t=1`. Separate ODE uniqueness from uniqueness of the continuity equation. The finite-time marginal identities in [Albergo--Boffi--Vanden-Eijnden](https://arxiv.org/abs/2303.08797) do not remove these characteristic-flow regularity requirements.

#### MOD-2. The Gaussian-endpoint regression proposition lacks an `L^2` hypothesis

**Location.** Proposition `prop:flow`, lines 375--405.

**Current claim.** For arbitrary `X\sim\alpha`, the time-integrated squared regression has the displayed minimizer.

**Defect.** No moment assumption is imposed on `\alpha`. The Hilbert-space least-squares argument requires the response `Y-X` to belong to `L^2`; the sufficient natural condition is `\alpha\in\mathcal P_2(\mathbb R^d)`. Without it, the stated global quadratic objective is not an ordinary `L^2` projection problem, and existence/uniqueness of a finite-loss minimizer is not established. The pointwise score identity can still make sense under weaker hypotheses after Gaussian smoothing, but that is not enough for the displayed time-integrated regression theorem.

**Repair.** Add `\alpha\in\mathcal P_2(\mathbb R^d)` to the proposition. If the intended result is only pointwise in `t`, state the weaker integrability needed at each `t` and formulate the minimization as an extended-risk statement. Keep the formula restricted to `t\in(0,1)`.

#### MOD-3. The sliced-Wasserstein convergence citation is over-scoped

**Location.** Line 825, paragraph “Sliced-Wasserstein flow.”

**Current claim.** Cozzi and Santambrogio prove long-time convergence “when the target is Gaussian.”

**Defect.** Their Theorem 4.1 is for the **standard Gaussian** target and assumes the initial law has finite entropy and finite second moment. The authors state that the proof adapts to isotropic Gaussians of arbitrary variance but “does not generalize” to non-isotropic covariance. The chapter's wording naturally includes every nondegenerate Gaussian, which is not what the cited theorem proves.

**Repair.** Replace the sentence by: “They prove well-posedness and `SW_2^2(\rho_t,\gamma)\leq C/t` for a standard Gaussian target when `\rho_0` has finite entropy and finite second moment; the argument extends to isotropic Gaussian covariance, while the non-isotropic Gaussian case is not covered.” See [Cozzi--Santambrogio, Section 4.2 and Theorem 4.1](https://cvgmt.sns.it/media/doc/paper/6495/CozSan%20@2@.pdf).

The separate claim that the limiting characteristic map need not be the Brenier map is correctly attributed.

#### MOD-4. The drifting figure implements a different comparison from its caption

**Location.** Lines 957--970 and Figure `fig:generative-drifting-model-trajectories`; generating notebook `notebooks-figures/generative-drifting-model-trajectories.ipynb`, JSON lines 197--252, especially 246 and 251--252.

**Current claim.** The labels and caption describe a raw **Laplacian-kernel** target drift versus the self-corrected field `B_\epsilon[\beta]-B_\epsilon[\alpha_t]`, and the preceding sentence says the comparison illustrates the effect of adding the self term.

**Defect.** The notebook uses Gaussian kernels in both panels, and both panels already contain a self term. The first is
\[
4.6\{\widetilde B_{0.23}[\beta]-0.70\widetilde B_{0.20}[\alpha_t]\},
\]
with unnormalized Gaussian averages, while the second is
\[
1.35\{B_{0.23}[\beta]-0.78B_{0.18}[\alpha_t]\}.
\]
The two terms use unequal bandwidths and unequal coefficients. They are also integrated for different numbers of steps and time steps. At notebook line 246, both simulations are subjected to the state-dependent rescaling `V/max(speed,cap)`. Thus the panels compare neither Laplacian versus normalized drift nor target-only versus self-corrected drift, and the second panel is not equation `eq-cross-minus-self-drift` with one common `\epsilon`. No causal conclusion about the self term alone can be drawn from this multi-factor comparison.

**Repair.** Either regenerate with the exact fields claimed, using an actual target-only first panel and one common bandwidth for the second, or rewrite the caption as a schematic comparison between unnormalized and normalized **Gaussian** attraction-minus-weighted-self fields and disclose the unequal bandwidths, weights, horizons, and speed normalization. The separate anti-collapse wording issue is MIN-11.

#### MOD-5. The moment-measure definition permits division by zero

**Location.** Definition `def-moment-measure`, lines 1067--1082.

**Current claim.** A proper lower-semicontinuous convex `u` is admissible when `Z_u=\int e^{-u}<\infty`, after which `Z_u^{-1}e^{-u}dx` is defined.

**Defect.** Properness does not imply positive Lebesgue mass of the effective domain. For example, a convex function finite on a lower-dimensional convex set and `+\infty` elsewhere is proper and lower semicontinuous but has `Z_u=0`. The normalization is then undefined.

**Repair.** Require
\[
0<Z_u=\int_{\mathbb R^d}e^{-u(x)}dx<\infty.
\]
The original framework makes this explicit and notes its equivalence to a full-dimensional effective domain plus coercivity: [Cordero--Erausquin--Klartag, Definition 1 and introductory integrability condition](https://arxiv.org/abs/1304.0630).

#### MOD-6. Conjugate moment-measure existence is stated without the theorem's hypotheses

**Location.** Lines 1272--1279, paragraph “Conjugate moment measures for generation.”

**Current claim.** The displayed factorization is presented for a generic target `\beta`, with `\nabla w^*` called its Brenier map.

**Defect.** The cited primary theorem proves existence when the target is an **absolutely continuous probability supported on a compact convex set**. It does not establish the displayed factorization for an arbitrary probability law. The Brenier-map language also needs the usual finite-moment and source absolute-continuity setting.

**Repair.** Precede the display with the exact theorem scope. If broader empirical use is intended, label it as a parameterized modeling ansatz rather than an existence theorem. See [Vesseron--Béthune--Cuturi, Theorem 1](https://arxiv.org/html/2503.10576v2).

#### MOD-7. Pointwise positivity does not imply a strict uniform Birkhoff factor

**Location.** Lines 1420 and 1536--1573, especially `\lambda_K(C)<1` in line 1572.

**Current claim.** For a positive kernel on a compact set, the cross-ratio construction gives a uniform factor strictly below one.

**Defect.** Pointwise positivity without continuity or a finite projective diameter does not prevent `\inf K=0` or `\eta_K(C)=+\infty`. Then `\lambda_K(C)=1`, not `<1`. Compactness alone is insufficient for a discontinuous positive function. The later consensus theorem correctly assumes a positive Lipschitz kernel, which does imply a positive minimum on the compact set.

For a concrete counterexample, take `C=[0,1]` and
\[
K(x,y)=
\begin{cases}
\exp[-1/(x+y)],&x+y>0,\\
1,&(x,y)=(0,0).
\end{cases}
\]
This kernel is strictly positive at every point of `C\times C`, but the cross-ratio with `(x,x',y,y')=(1,0,\varepsilon,1)` diverges as `\varepsilon\downarrow0`; hence `\eta_K(C)=\infty` and `\lambda_K(C)=1`.

**Repair.** Before line 1567 assume `\eta_K(C)<\infty`, or more concretely `0<k_-\leq K\leq k_+<\infty` on `C\times C`. Then
\[
\lambda_K(C)=\tanh\!\left(\frac{\log\eta_K(C)}4\right)<1.
\]
The relation between projective diameter and contraction is the Birkhoff--Hopf theorem; see [Gaubert--Qu](https://www.cmap.polytechnique.fr/~gaubert/PAPERS/GaubertQuIEOTD14QuFinal.pdf).

#### MOD-8. The “Sinkhorn/Schrödinger bridge” panel is an ad hoc covariance inflation

**Location.** Figure `fig:gradflow-gaussian-closure`, lines 1822--1834; generating notebook `notebooks-figures/gradflow-gaussian-closure.ipynb`, lines 220--245.

**Current claim.** The middle panel is an entropic Sinkhorn/Schrödinger bridge-style Gaussian closure for quadratic cost and some regularization `\epsilon>0`, with entropic noise inflating intermediate covariance.

**Defect.** The notebook first computes the exact `W_2` Gaussian geodesic and then defines
\[
\Sigma_t^{\rm panel}=\Sigma_t^{W_2}+0.080\,t(1-t)I.
\]
There is no entropic coupling, Sinkhorn scaling, Schrödinger system, or parameter `\epsilon`. For positive regularization, Sinkhorn geodesics, Sinkhorn-divergence Wasserstein gradient flows, and Schrödinger bridges are distinct constructions. An exact Gaussian Schrödinger bridge does have a bridge-noise contribution, but its endpoint cross-covariance is also regularization-dependent; it is not obtained in general by adding an arbitrary isotropic bump to the unregularized Brenier geodesic.

**Repair.** Either label the panel “schematic isotropic covariance inflation” and remove the model attribution, or regenerate it from one precisely defined entropic interpolation and state its convention. The distinctions are summarized explicitly in [Hardion--Lacombe, Section 1.1, “Distinction from Sinkhorn geodesics, barycenters, and Schrödinger bridges”](https://arxiv.org/html/2602.10726v2).

#### MOD-9. The Gaussian catalogue conflates an invariant Gaussian solution with unconditional ambient-flow invariance

**Location.** Lines 1939--1948 and Proposition `prop-centered-gaussian-covariance-catalogue` through line 2090.

**Current claim.** For every listed functional, “the usual Wasserstein gradient flow on `\mathcal P_2`” initialized at a Gaussian stays Gaussian.

**Defect.** The affine first-variation calculation proves that the PDE admits an exact Gaussian solution following the displayed ODE. To conclude that an unspecified "usual Wasserstein gradient flow" from that datum must equal this solution, one also needs a selected solution concept and an appropriate uniqueness theorem. The chapter supplies neither uniformly across the catalogue nor row by row. This matters particularly for the fourth-order relative-Fisher equation, for sliced Wasserstein (whose cited source says general uniqueness is open), and for Sinkhorn divergence. The recent Sinkhorn result proves the Gaussian flow and uniqueness only in a regular strongly log-concave class, not among all weak `\mathcal P_2` solutions.

**Repair.** State first: “For each row, the formal ambient equation has an exact Gaussian solution with the following ODE. Whenever the ambient flow is unique in the stated solution class, this proves invariance.” Then give row-specific solution assumptions. For Sinkhorn, cite the precise result in [Hardion--Lacombe, Theorem 1.1](https://arxiv.org/html/2602.10726v2). For sliced Wasserstein, do not turn the Gaussian ansatz into an unqualified uniqueness claim.

This finding does not challenge any `h` or `H` formula; all catalogue formulas are correct.

#### MOD-11. The arXiv and MyST replicas retain mathematically stale statements

**Location.** `arxiv/sections/transportation-models.tex`, lines 123--180 and 858--889; `myst/chapters/transportation-models.md`, lines 118--160 and 965--998.

**Current claim in replicas.** The replicas use only a fixed-time `L^2` assumption before claiming a space-time continuity equation, and they state that optimizing the SVGD linear functional over the RKHS unit ball gives the **unnormalized** standard SVGD field.

**Defect.** The authoritative source has already repaired both points. It now assumes pathwise absolute continuity, joint measurability, and space-time `L^2` integrability for flow matching. It also correctly distinguishes the quadratically penalized optimizer from the normalized unit-ball optimizer. The MyST copy additionally retains old `P_t` notation.

**Repair.** Regenerate or synchronize both replicas from the authoritative source after the chapter corrections. The standard unnormalized SVGD field is the Riesz representer/quadratically penalized optimizer; the unit-ball optimizer is that field divided by its RKHS norm when nonzero. This distinction follows directly from the original functional-gradient construction; see [Liu--Wang 2016](https://papers.nips.cc/paper_files/paper/2016/hash/b3ba8f1bee1238a2f37603d90b58898d-Abstract.html).

### Minor

#### MIN-1. The interpolant definitions are weaker than their continuity claims

**Location.** Lines 51--62 and 240--263.

**Current claim.** A measurable family merely “differentiable in `t`” induces a curve obeying an ordinary continuity equation; the same inference is repeated for the static-noise definition.

**Defect.** Pointwise differentiability alone does not provide an integrable derivative or justify the pathwise fundamental theorem/Fubini argument. Proposition `prop-flow-matching-vector-field` later supplies the right absolute-continuity and space-time integrability assumptions.

**Repair.** Either build pathwise absolute continuity and an integrable derivative into both definitions, or qualify lines 51 and 263 with “under the assumptions of Proposition …”.

#### MIN-2. “Brenier-type” is too weak for the McCann interpolation label

**Location.** Line 98.

**Current claim.** If `\pi=(\mathrm{Id},T)_\#\alpha` is “Brenier-type,” then the linear interpolation is the McCann OT interpolation.

**Defect.** McCann displacement interpolation requires an optimal quadratic coupling (or the Brenier map under hypotheses guaranteeing it). “Brenier-type” is undefined and can be read as merely a gradient-like map.

**Repair.** Say explicitly that `T` is the quadratic optimal/Brenier map from `\alpha` to `\beta`, or that `\pi` is an optimal quadratic coupling.

#### MIN-3. The static-noise linear example omits endpoint conditions and reuses `\pi`

**Location.** Lines 253--259.

**Current claim.** `X_t=a(t)X_0+b(t)X_1+\gamma(t)Z` is a typical stochastic interpolant, with only `\gamma(0)=\gamma(1)=0` stated; the triple law is then also denoted `\pi`.

**Defect.** Definition `def-stochastic-interpolant` additionally requires
`a(0)=1`, `b(0)=0`, `a(1)=0`, and `b(1)=1`. Reusing `\pi` for the triple law conflicts with its immediately preceding meaning as the coupling law of `(X_0,X_1)`.

**Repair.** State all six endpoint conditions and denote the enlarged latent law by, for example, `\widetilde\pi=\pi\otimes\operatorname{Law}(Z)`.

#### MIN-4. The linear-bridge regression objective has a free time variable

**Location.** Lines 314--318.

**Current claim.** The display minimizes over the family `(v_t)_t` but contains neither a time integral nor a fixed-time quantifier.

**Defect.** As written, `t` is free.

**Repair.** Either write “for each fixed `t`” and minimize over `v_t`, or insert `\int_0^1(\cdots)dt` and retain minimization over the family.

#### MIN-5. The weak-test and minimization classes in the flow-matching proposition should be explicit

**Location.** Lines 128--182.

**Current claim.** The minimization is over “measurable fields,” and the weak identities are said to hold for “every smooth” test function.

**Defect.** The Hilbert projection is really over `L^2(\alpha_t;\mathbb R^d)` modulo `\alpha_t`-a.e. equality. Distributional testing should use `C_c^\infty` space-time tests, or bounded `C^1` tests with bounded gradient in the differentiated marginal identity. Unqualified smooth functions can make the integrals undefined.

**Repair.** Name the `L^2` equivalence class and the compactly supported/bounded test class. The proposition's substance and sign are otherwise correct.

#### MIN-6. The SVGD representer step omits RKHS admissibility assumptions

**Location.** Lines 868--892.

**Current claim.** After proving the Stein identity for compactly supported smooth `v`, the text immediately minimizes over `\mathcal H_k^d` and writes the representer.

**Defect.** The extension requires enough differentiability of `k`, a Stein boundary/integrability condition, and Bochner integrability of
`k(y,\cdot)\nabla\log\rho_\beta(y)+\nabla_yk(y,\cdot)` in the vector RKHS.

**Repair.** Add a short “assuming `k` and the target score satisfy the standard Stein/RKHS integrability conditions” clause. The sign, kernel argument order, repulsive derivative, and normalized-versus-unnormalized distinction are correct.

#### MIN-7. The gradient projection must be onto a closure, and the last sentence is too categorical

**Location.** Lines 1045--1055, Remark “General fields and projection onto gradients.”

**Current claim.** The gradient component is an attained `\arg\min_{\nabla\phi}`, and non-gradient components “are not descent directions.”

**Defect.** The Wasserstein tangent space is the `L^2(\alpha_t)` closure of gradients; a minimizing element need not have a globally represented potential in the displayed class. Also, a field can equal a genuine gradient-descent velocity plus an `\alpha_t`-weighted divergence-free component. It then generates the same measure curve and decreases the same energy, even though it is not the canonical Riemannian gradient representative.

**Repair.** Project onto `\overline{\{\nabla\phi\}}^{L^2(\alpha_t)}` and replace the final clause by “non-gradient components are not part of the canonical minimum-norm Wasserstein gradient, although divergence-free additions may represent the same descent curve.”

#### MIN-8. The adaptive discrete Gaussian-kernel estimate silently sets `\tau=1`

**Location.** Lines 1704--1711.

**Current claim.** The “full discrete update” contracts by `\tanh(D_\ell^2/(4\epsilon))`.

**Defect.** This is correct only for the undamped update `\tau=1`. For the theorem's general damping,
\[
D_{\ell+1}\leq
\left[1-\tau\left(1-\tanh\frac{D_\ell^2}{4\epsilon}\right)\right]D_\ell.
\]

**Repair.** Append “that is, `\tau=1`” after “full discrete update,” or display the damped factor.

#### MIN-10. The Lavenant criterion points to the wrong environment type

**Location.** Line 2620.

**Current claim.** `\GaussProj` is said to be defined in Theorem `thm-gelbrich-projection`.

**Defect.** It is defined in Definition `def-gaussian-projection` at lines 2565--2573; the theorem only proves contraction.

**Repair.** Change the cross-reference to Definition `def-gaussian-projection`.

#### MIN-11. The anti-collapse language is absolute, but both repulsions vanish after exact coalescence

**Location.** Lines 908, 951, and 957--970, in the SVGD, drifting, and drifting-figure discussions.

**Current claim.** Kernel repulsion “prevents immediate particle collapse,” the self-correction term “prevents all particles from collapsing,” and the figure is said to show how drifting “corrects the collapse” of target attraction alone.

**Defect.** These are useful qualitative mechanisms, not unconditional guarantees. For a translation-invariant radial kernel such as the Gaussian RBF, if all particles coincide at `x`, then the empirical SVGD repulsion is
`n^{-1}\sum_j\nabla_{x_j}k(x_j,x)=0`. Likewise `B_\epsilon[\delta_x](x)=0`, so the drifting self term cannot split an exactly coalesced cloud. Repulsion can counteract concentration while particles remain distinct, but it does not restore diversity after exact coalescence. The figure also cannot isolate that mechanism because of MOD-4's multi-factor code mismatch.

**Repair.** Replace “prevents” and “corrects” by “discourages” or “counteracts while particles remain noncoincident,” and state that exact collapse is an invariant configuration for the usual radial self-repulsion. Do not present the current figure as a controlled proof of the effect.

#### MIN-12. The Gaussian diffusion-path covariance omits independence of the added noise

**Location.** Lines 2492--2496, Example “Flow matching and diffusion paths between Gaussians.”

**Current claim.** For `X_t=a_tX_0+\sigma_tZ` with `X_0\sim N(m_0,\Sigma_0)` and `Z\sim N(0,I)`, the covariance is `a_t^2\Sigma_0+\sigma_t^2I`.

**Defect.** The formula requires `Z` to be independent of `X_0`, or at least to have zero cross-covariance with it. In general, with `C=\operatorname{Cov}(X_0,Z)`,
\[
\operatorname{Cov}(X_t)
=a_t^2\Sigma_0+\sigma_t^2I
+a_t\sigma_t(C+C^\top).
\]
The statement specifies only the two marginal Gaussian laws.

**Repair.** State `Z\sim N(0,I)` independently of `X_0`. If joint Gaussianity is intended for the whole path, state it explicitly as well.

#### MIN-13. A covariance-eigenvalue derivative is called a scalar spatial velocity

**Location.** Lines 2191--2195, debiased Sinkhorn specialization for `\bar\Sigma=I`.

**Current claim.** The expression
\[
4\sqrt{\lambda+\epsilon^2/16}
-4\sqrt{\lambda^2+\epsilon^2/16}
\]
is called “the scalar velocity on an eigenvalue `\lambda`.”

**Defect.** The algebra is correct, but the quantity is `\dot\lambda`, the covariance-eigenvalue right-hand side. The corresponding centered spatial affine velocity coefficient along that eigendirection is `\dot\lambda/(2\lambda)` when `\lambda>0`. Calling both a velocity obscures the factor relating state and covariance dynamics.

**Repair.** Rename it “the covariance-eigenvalue derivative” or “the scalar covariance ODE.”

#### MIN-14. The reverse-flow caption calls stratified jittered seeds Gaussian samples

**Location.** Figure `fig:generative-diffusion-1d-forward-backward`, lines 426--438; generating notebook `notebooks-figures/generative-diffusion-1d-forward-backward.ipynb`, JSON line 315.

**Current claim.** The caption calls the reverse initial points “blue noise samples” from the Gaussian endpoint.

**Defect.** The notebook initializes them deterministically on an equally spaced grid in `[-2.35,2.35]` plus small Gaussian jitter:
`z0=np.linspace(-2.35,2.35,27)+.035*rng.normal(size=27)`. This is a stratified visualization of the noise range, not an i.i.d. sample from the standard Gaussian. The reverse vector field itself is unaffected.

**Repair.** Call them “stratified jittered noise seeds,” or change the notebook to draw `rng.normal(size=27)` if the probabilistic caption is desired.

## Established defects versus unresolved questions

The 25 active numbered findings above are **established defects in the text as written**. They are counted even when the underlying theorem is true but the proof, hypotheses, caption, or attribution is not. Removed IDs MOD-10 and MIN-9 are not findings. The following are instead genuine scope boundaries or open questions. They are **not additional findings** and must not be turned into claims of impossibility.

| Location | Question not settled by the cited result | Safe wording for this chapter |
|---|---|---|
| Lines 808--825 and 2197--2219 | Uniqueness of the general sliced-Wasserstein flow, and long-time convergence to a non-isotropic Gaussian target. Cozzi--Santambrogio explicitly leave general uniqueness open and their Gaussian convergence argument is standard/isotropic. | State only the proved standard/isotropic result and describe the non-isotropic/general case as open in the cited work. |
| Lines 1943--2224, Sinkhorn row | Unrestricted uniqueness of the ambient Sinkhorn-divergence flow from Gaussian data among all weak `\mathcal P_2` solutions. | Claim an exact Gaussian solution; add the solution class whenever invoking uniqueness. |
| Lines 229--233 | Whether a singular terminal law is reached by an actual endpoint characteristic map rather than only as a marginal limit. This depends on the interpolant and regularity near the endpoint. | State finite-time push-forward and terminal weak convergence unless endpoint flow hypotheses are supplied. |
| Lines 1272--1279 | Existence of the conjugate moment-measure factorization for targets outside the absolutely continuous, compact-convex-support theorem. | Present broader use as a modeling ansatz, not as the cited existence theorem. |
| Lines 1754--1799 | Existence of some fixed scalar Wasserstein energy for generic self-attention beyond the natural candidate ruled out by the response term. | Retain the current cautious “instantaneous gradient but not thereby a Wasserstein gradient flow” formulation. |
| Lines 2661--2710 | Global classification of eikonal coordinates across critical sets, cut loci, and topology. The proposition deliberately gives only a local regular-set representation. | Keep the local statement; do not extrapolate it to a global signed-distance theorem. |

## Primary-source scope checks

These sources were used for theorem scope rather than for algebra that can be checked directly in the chapter.

| Topic | Primary source and exact scope checked | Audit consequence |
|---|---|---|
| Moment measures | [Cordero-Erausquin--Klartag, Theorem 2](https://arxiv.org/abs/1304.0630): finite first moment, barycenter zero, support not contained in a hyperplane; essentially continuous convex potential, unique up to translation (with additive normalization immaterial). The paper begins from `0<\int e^{-\psi}<\infty`. | The characterization theorem is accurate; the chapter definition must exclude `Z_u=0`. |
| Moment variational formulation | [Santambrogio, Propositions 3.3 and 5.1 and Theorem 4.1](https://arxiv.org/pdf/1507.04187): displacement convexity, existence/uniqueness up to translations, and the nonsmooth converse via one-sided derivatives, `\Delta^{ac}`, essential continuity, and approximation. | Proposition conclusion is retained, but the converse proof must be replaced or explicitly downgraded to a smooth heuristic. |
| Sliced-Wasserstein convergence | [Cozzi--Santambrogio, Theorem 4.1 and Section 4.2](https://cvgmt.sns.it/media/doc/paper/6495/CozSan%20@2@.pdf): standard Gaussian target, finite entropy and second moment, `SW_2^2=O(1/t)`; isotropic extension noted, non-isotropic extension not obtained. | “Gaussian target” is too broad. |
| Conjugate moment measures | [Vesseron--Béthune--Cuturi, Theorem 1](https://arxiv.org/html/2503.10576v2): existence for an absolutely continuous target supported on a compact convex set. | The generative factorization needs these hypotheses or must be labeled an ansatz. |
| Sinkhorn Gaussian flow | [Hardion--Lacombe, Theorem 1.1](https://arxiv.org/html/2602.10726v2): a Gaussian Sinkhorn-divergence flow and uniqueness in a smooth strongly log-concave class; the introduction also separates Sinkhorn geodesics, barycenters, and Schrödinger bridges. | Supports the Gaussian formula but not unrestricted ambient uniqueness; also confirms the middle bridge caption conflates distinct objects. |
| Projective contraction | [Gaubert--Qu](https://www.cmap.polytechnique.fr/~gaubert/PAPERS/GaubertQuIEOTD14QuFinal.pdf) and the [arXiv record](https://arxiv.org/abs/1307.4649): Dobrushin/ergodicity coefficients as quotient contraction norms and their relation to cone/projective contraction. | The finite-projective-diameter formulas are correct; pointwise positivity alone does not force a uniform coefficient below one. |
| SVGD | [Liu--Wang 2016](https://papers.nips.cc/paper_files/paper/2016/hash/b3ba8f1bee1238a2f37603d90b58898d-Abstract.html): functional steepest descent in an RKHS using the Stein operator. | The chapter's sign and representer are correct; the unit-ball solution is normalized, and RKHS/Stein admissibility must be stated. |
| Gaussian lower bound | [Gelbrich 1990](https://doi.org/10.1002/mana.19901470121): the mean-covariance lower bound for the quadratic Wasserstein distance. | The contraction theorem and its covariance expression are correct. |
| Eulerian bounded confidence | [Canuto--Fagnani--Tilli 2012](https://doi.org/10.1137/100793177): under their hypotheses, limiting measures consist of finitely many Dirac masses separated by at least the confidence radius. | The hard-confidence contrast at lines 1729--1742 is correctly scoped. |
| Stochastic interpolants | [Albergo--Boffi--Vanden-Eijnden](https://arxiv.org/abs/2303.08797) and [Song et al.](https://arxiv.org/abs/2011.13456): marginal interpolation/conditional velocity and probability-flow identities. | The chapter's finite-time identities are correct; these references do not automatically supply a classical endpoint flow map. |

The recent method attributions to [W-Flow](https://arxiv.org/abs/2605.11755), [Drifting Models](https://arxiv.org/abs/2602.04770), [the discrepancy-flow analysis of drifting](https://arxiv.org/abs/2605.05118), and [Sinkhorn drifting](https://arxiv.org/abs/2603.12366) are consistent at the high level used in lines 798--805 and 951--953. No theorem from those papers is needed for a chapter formula.

## Independent derivation ledger

### Flow matching, stochastic interpolants, and diffusion

**Conditional projection and continuity equation.** Let `X_t=I_t(U)` and `Y_t=\dot I_t(U)`. In the Hilbert space of square-integrable random vectors measurable with respect to `X_t`, orthogonal projection gives
\[
v_t(X_t)=\mathbb E[Y_t\mid X_t].
\]
For `\varphi\in C_c^1`, pathwise absolute continuity and the space-time integrability assumed in Proposition `prop-flow-matching-vector-field` give
\[
\frac d{dt}\int\varphi\,d\alpha_t
=\mathbb E[\nabla\varphi(X_t)\cdot Y_t]
=\int\nabla\varphi(x)\cdot v_t(x)\,d\alpha_t(x),
\]
which is exactly `\partial_t\alpha_t+\operatorname{div}(\alpha_tv_t)=0`. This confirms the conditional-expectation formula and its sign. It does **not** identify `v_t` with the minimum-norm gradient tangent; MAJ-1 records that separate issue.

**Diffusive realization.** For
`dX_t=v_t(X_t)dt+\sigma_t(X_t)dB_t`, with `D_t=\sigma_t\sigma_t^\top`, the density obeys
\[
\partial_t\rho_t=-\operatorname{div}(\rho_tv_t)
+\frac12\partial_{ij}(D_{t,ij}\rho_t).
\]
Therefore the same marginals solve a continuity equation with
\[
\bar v_t=v_t-\frac1{2\rho_t}\operatorname{div}(\rho_tD_t).
\]
When `D_t=\sigma_t^2I` is spatially constant this becomes
`\bar v_t=v_t-(\sigma_t^2/2)\nabla\log\rho_t`. The factor `1/2`, row-wise divergence, and sign at lines 265--309 are correct.

**Tweedie and the Gaussian endpoint.** If `Z=W+\sigma\varepsilon`, differentiation of the Gaussian convolution gives
\[
\nabla\rho_\sigma(z)
=-\sigma^{-2}\{z-\mathbb E[W\mid Z=z]\}\rho_\sigma(z),
\]
hence `\mathbb E[W\mid Z=z]=z+\sigma^2\nabla\log\rho_\sigma(z)`. For `Z_t=(1-t)X+tY`, apply this with `W=(1-t)X` and `\sigma=t`:
\[
\mathbb E[Y\mid Z_t=z]=-t\nabla\log\rho_t(z),
\qquad
v_t(z)=-\frac z{1-t}-\frac t{1-t}\nabla\log\rho_t(z).
\]
Thus the score sign and both coefficients in Proposition `prop:flow` are correct for `0<t<1`.

**General scalar noising schedule.** With `Z_t=a_tX+b_tY`, `Y\sim N(0,\sigma^2I)`, Tweedie's formula gives
\[
\mathbb E[Y\mid Z_t=z]=-b_t\sigma^2s_t(z),
\qquad
\mathbb E[X\mid Z_t=z]=a_t^{-1}\{z+b_t^2\sigma^2s_t(z)\}.
\]
Consequently
\[
v_t(z)=\frac{a_t'}{a_t}z
+\left(\frac{a_t'b_t^2}{a_t}-b_t'b_t\right)\sigma^2s_t(z).
\]
For `a_\tau=e^{-\tau}` and `b_\tau=(1-e^{-2\tau})^{1/2}`, the score coefficient is `-\sigma^2`, so `v_\tau=-z-\sigma^2s_\tau`. Lines 570--628 have the correct coefficient and reverse-time sign.

**Independent Gaussian product coupling.** For independent centered Gaussian endpoints,
\[
\Sigma_t=(1-t)^2\Sigma_0+t^2\Sigma_1,
\qquad
\operatorname{Cov}(X_1-X_0,Z_t)=t\Sigma_1-(1-t)\Sigma_0.
\]
Gaussian regression therefore gives exactly
\[
A_t=\{t\Sigma_1-(1-t)\Sigma_0\}\Sigma_t^{-1}.
\]
After whitening by `\Sigma_0^{-1/2}`, the covariance is
`S_t=(1-t)^2I+t^2C`, where `C=\Sigma_0^{-1/2}\Sigma_1\Sigma_0^{-1/2}`. Since `S_t` and `\dot S_t` commute, the characteristic matrix is `S_t^{1/2}`. Transforming back yields the map displayed at lines 487--492. Its endpoint is symmetric exactly when `\Sigma_0` commutes with `\Sigma_1`; only then is it the unique positive symmetric Gaussian Brenier map. Replacing `(1-t,t)` by any nondegenerate scalar schedule gives `(a_t^2I+b_t^2C)^{1/2}` and the same terminal map. Every coefficient and the “if and only if” in Proposition `prop-gaussian-flow-matching-optimality` check out.

**Existential affine realization of an arbitrary smooth Gaussian path.** Suppose `\Sigma_t\succ0` is differentiable and let the symmetric `A_t` solve
`A_t\Sigma_t+\Sigma_tA_t=\dot\Sigma_t`. If `\Phi_t` solves `\dot\Phi_t=A_t\Phi_t`, `\Phi_0=I`, uniqueness of the matrix ODE gives
`\Phi_t\Sigma_0\Phi_t^\top=\Sigma_t`. For `U\sim N(m_0,\Sigma_0)`, define
\[
I_t(U)=m_t+\Phi_t(U-m_0).
\]
The matrix `\Phi_t` is invertible on every finite interval, so conditioning on `I_t(U)=x` is deterministic and
\[
\mathbb E[\dot I_t(U)\mid I_t(U)=x]
=\dot m_t+A_t(x-m_t).
\]
Thus line 2480's phrase “can be taken” is correct: this particular deterministic latent interpolant realizes the symmetric minimum tangent as its exact conditional field. A different coupling can realize a nonsymmetric representative. This distinction removes first-pass MOD-10 without weakening MAJ-1.

**Noise cross-covariance.** For the diffusion path at lines 2492--2496,
\[
\operatorname{Cov}(a_tX_0+\sigma_tZ)
=a_t^2\Sigma_0+\sigma_t^2I
+a_t\sigma_t\{\operatorname{Cov}(X_0,Z)+\operatorname{Cov}(Z,X_0)\}.
\]
The displayed covariance is therefore correct under the standard but unstated independence assumption recorded in MIN-12.

### One-step discrepancy flows, sliced flow, SVGD, and drifting

**Parameter push-forward.** Differentiating `X_t=f_{\theta_t}(Z)` gives `\dot X_t=\partial_\theta f_{\theta_t}(Z)\dot\theta_t`. Conditioning on the fiber of `f_{\theta_t}` produces equation `eq-one-step-induced-velocity`; testing against `\varphi` gives its continuity equation with the stated sign. This also confirms why Euclidean parameter descent is not generally the `L^2(\alpha_t)` projection of an intrinsic Wasserstein gradient.

**Sliced-Wasserstein velocity.** In the one-step paragraph the chapter uses the half-squared, normalized-sphere convention
\[
\mathcal E_\beta(\alpha)=\frac12\operatorname{SW}_2^2(\alpha,\beta)
=\frac12\int_{S^{d-1}}W_2^2(P_{\theta\#}\alpha,P_{\theta\#}\beta)\,d\sigma(\theta).
\]
Each one-dimensional half-squared distance has descent `T_\theta-\operatorname{Id}`. Lifting by `P_\theta^*s=s\theta` gives
\[
v_\alpha(x)=\int_{S^{d-1}}
\{T_\theta(\theta\cdot x)-\theta\cdot x\}\theta\,d\sigma(\theta),
\]
so equation `eq-sliced-wasserstein-flow-velocity` has the correct sign, no extra factor two, and the correct spherical normalization. The later Gaussian catalogue instead uses the unhalved functional `\operatorname{SW}_2^2`, whose descent field is twice this one and consequently has `h=-2\delta_m/d`.

**SVGD sign and normalization.** Under `\alpha_\varepsilon=(I+\varepsilon v)_\#\alpha`, continuity differentiation gives
\[
\left.\frac d{d\varepsilon}\mathrm{KL}(\alpha_\varepsilon\mid\beta)\right|_0
=-\mathbb E_\alpha[\nabla\log\rho_\beta\cdot v+\operatorname{div}v].
\]
Applying the RKHS reproducing identities makes the negative derivative's Riesz representer
\[
v^{\rm SVGD}_\alpha(x)=\mathbb E_{Y\sim\alpha}
[k(Y,x)\nabla\log\rho_\beta(Y)+\nabla_Yk(Y,x)].
\]
The repulsive term therefore has a plus sign. Minimizing “directional derivative plus `\|v\|_{\mathcal H}^2/2`” gives this unnormalized representer; minimizing only the linear functional over the unit ball gives its normalization. Lines 858--905 are algebraically correct after adding MIN-6's admissibility clause.

**Limits of anti-collapse.** If every particle equals `x` and `k(x,y)=\kappa(x-y)` with even differentiable `\kappa`, then `\nabla_{x_j}k(x_j,x)=\nabla\kappa(0)=0`; all particles receive the same target-score velocity and remain coincident. For drifting, `B_\epsilon[\delta_x](x)=0`, so the self term likewise cannot separate an exactly collapsed cloud. This confirms the mechanisms' signs while narrowing the prose as in MIN-11.

**Normalized drift and frozen objective.** For the Gaussian kernel,
\[
\epsilon\nabla_x\log\int K_\epsilon(x,y)d\nu(y)
=\frac{\int(y-x)K_\epsilon(x,y)d\nu(y)}{\int K_\epsilon(x,y)d\nu(y)},
\]
so `u_t=B_\epsilon[\beta]-B_\epsilon[\alpha_t]` is the gradient of the displayed log ratio. Freezing both `\phi_t` and the reference `\alpha_t` gives first variation `-\phi_t`; its descent velocity is `+\nabla\phi_t=u_t`. The sign in Proposition `prop-drifting-semi-relaxed-gradient`, and the warning that this is not one fixed evolving energy, are correct.

### Moment measures

**Centering and the quadratic example.** Under the essential-continuity boundary theorem,
`\int\nabla u\,e^{-u}dx=-\int\nabla(e^{-u})dx=0`, so every full-dimensional moment measure is centered. For `u(x)=x^\top Ax/2+c`, `\eta_u=N(0,A^{-1})` and `Ax\sim N(0,A)`. Both conclusions and the covariance inversion are correct.

**Maximal correlation signs.** Expanding the quadratic cost gives, for finite second moments,
\[
\mathcal C_\alpha(\eta)
=\frac12\int|x|^2d\eta+\frac12\int|y|^2d\alpha
-\frac12W_2^2(\eta,\alpha).
\]
Fenchel equality `u(x)+u^*(y)=x\cdot y` on `y\in\partial u(x)` gives the dual infimum in lines 1162--1168. Varying `\eta` while holding the optimal convex potential fixed yields `\log r+1+u=\text{constant}`, hence `r\propto e^{-u}`; optimal scalar-product coupling then gives `\alpha=(\nabla u)_\#\eta`. The objective sign, Euler equation, transport direction, and translation invariance are correct. Only the nonsmooth converse proof has the defect in MAJ-2.

**Hidden convexity.** Substitution of the entropy optimizer gives
\[
u\mapsto\int u^*d\alpha-\log\int e^{-u}dx.
\]
With `\varphi=u^*`, the first term is affine and Prékopa's theorem makes `\varphi\mapsto\log\int e^{-\varphi^*}` concave. The negative log-partition is therefore convex. The signs and the Toland-duality explanation at lines 1244--1264 are correct.

### Transformer and consensus dynamics

**Residual/depth limit.** A residual layer is exactly
`\alpha^{(\ell+1)}=(I+T^{-1}\Gamma_{\theta^{(\ell)}}[\alpha^{(\ell)}])_\#\alpha^{(\ell)}`. Its formal first-order weak expansion gives
`\partial_t\alpha+\operatorname{div}(\alpha\Gamma_{\theta_t}[\alpha])=0`. This is a depth limit at fixed token number, not a many-token limit; the chapter keeps those limits distinct.

**Mean shift and Markov normalization.** The Gaussian-kernel identity gives
`M_\epsilon=m_\epsilon-I=\epsilon\nabla\log\rho_\epsilon`, not `m_\epsilon` itself. For weights `a_j`,
\[
(P_X)_{ij}=\frac{K(x_i,x_j)a_j}{\sum_rK(x_i,x_r)a_r},
\]
so `P_X1=1` and `\dot X=(P_X-I)X`. The attention normalization, distinction between raw residual attention and mean-shift displacement, and particle equation are correct.

**Dobrushin coefficient.** For two rows `p,p'`, removing common mass `r_j=\min(p_j,p'_j)` leaves total mass
`\frac12\sum_j|p_j-p'_j|`. This proves
\[
\|Pz\|_V\leq\delta(P)\|z\|_V,
\qquad
\delta(P)=\frac12\max_{i,\ell}\sum_j|P_{ij}-P_{\ell j}|.
\]
Choosing `z_j=1_{p_j\geq p'_j}` proves sharpness. Linearizing Hilbert contraction at `e^{sz}` gives `\delta(P)\leq\lambda(P)`. Thus Proposition `prop-dobrushin-birkhoff-contraction` is correct, including its exact quotient norm and absence of an extra factor two.

**Consensus rates.** For the damped update,
\[
\|(1-\tau)z+\tau Pz\|_V
\leq[1-\tau(1-\delta(P))]\|z\|_V.
\]
Hence `q^{(\ell)}=1-\tau(1-\delta^{(\ell)})` and
`q_\tau=1-\tau(1-\bar\delta)` are correct. Summing particle increments gives
\[
\max_i|x_i^{(\ell)}-x_\infty|
\leq\frac{D_0}{1-\bar\delta}q_\tau^\ell.
\]
For characteristics, the directional-width inequality
`D^+w_\theta\leq-(1-\delta(P_{\alpha_t}))w_\theta` yields the adaptive exponential. Since `|\dot X_t|\leq D(t)`, integration gives the stated `W_\infty` tail with the same denominator. No missing factor of `\tau`, two, or dimension occurs in Theorem `thm-mean-shift-consensus`.

**Gaussian-kernel projective constant.** Direct cancellation gives
\[
\log\frac{K_\epsilon(x,y)K_\epsilon(x',y')}
{K_\epsilon(x',y)K_\epsilon(x,y')}
=\frac{(x-x')\cdot(y-y')}{\epsilon}.
\]
On a compact set of diameter `D`, the supremum is `D^2/\epsilon`, attained by choosing the same diameter pair in both slots. Thus
`\eta=e^{D^2/\epsilon}` and
`\lambda=(\sqrt\eta-1)/(\sqrt\eta+1)=\tanh(D^2/(4\epsilon))`. The continuous adaptive rate is correct; the discrete display merely needs `\tau=1` made explicit as in MIN-8.

**Attention gradient test.** If `V=Q^\top K`, differentiating
`U_\alpha(x)=\log\int e^{\langle Qx,Ky\rangle}d\alpha(y)` gives exactly `\Gamma_\theta[\alpha](x)`. Varying `\int U_\alpha d\alpha`, however, also differentiates the measure inside every query's denominator and produces the response term displayed at lines 1778--1788. The chapter correctly concludes that an instantaneous spatial gradient does not by itself identify a fixed Wasserstein energy.

### Gaussian closure and Bures geometry

**Affine closure.** For `v_t(x)=b_t+A_t(x-m_t)`, a characteristic is
`X_t=m_t+\Phi_t(X_0-m_0)` with `\dot\Phi_t=A_t\Phi_t`. Therefore
\[
\dot m_t=b_t,
\qquad
\dot\Sigma_t=A_t\Sigma_t+\Sigma_tA_t^\top.
\]
The fundamental matrix is invertible, so positive definiteness is preserved on every finite interval of definition. On symmetric matrices the Lyapunov map `A\mapsto A\Sigma+\Sigma A` is invertible for `\Sigma\succ0`, proving uniqueness of the minimum-norm affine gradient tangent. Proposition `prop-gaussian-affine-closure` and its weighted-divergence-free qualification are correct.

**Universal moment-functional rule.** For `f(\alpha)=g(m_\alpha,\Sigma_\alpha)` and symmetric `G=\nabla_\Sigma g`,
\[
\nabla_x\delta f(\alpha)(x)=\nabla_mg+2G(x-m).
\]
The descent field gives
\[
\dot m=-\nabla_mg,
\qquad
\dot\Sigma=-2(\Sigma G+G\Sigma).
\]
This calculation is distribution-free and independently confirms the first catalogue row, the constrained Gaussian gradient, and the factor two in equations `eq-gaussian-wgf-closure` and `eq-distribution-free-mean-covariance-closure`.

**Complete catalogue recomputation.** Put `\delta=m-\bar m`, `A=\bar\Sigma^{-1}`, and let `M` be the Gaussian Brenier linear part. Restricting each functional to a Gaussian and differentiating gives:

| Functional | Independent derivative/affine descent check | Result |
|---|---|---|
| `g(m,\Sigma)` | `\nabla_mg`, `G=\nabla_\Sigma g` | `h=-\nabla_mg`, `H=-2(\Sigma G+G\Sigma)` |
| Quadratic potential | `\nabla_m=B m+\ell`, `\nabla_\Sigma=B/2` | `h=-(Bm+\ell)`, `H=-(\Sigma B+B\Sigma)` |
| Quadratic interaction | `f=\tfrac12\operatorname{tr}(G\Sigma)`, so `\nabla_\Sigma=G/2` | `h=0`, `H=-(\Sigma G+G\Sigma)` |
| `\mathrm{KL}(\alpha\mid\gamma)` | `\nabla_m=A\delta`, `\nabla_\Sigma=(A-\Sigma^{-1})/2` | `h=-A\delta`, `H=2I-\Sigma A-A\Sigma` |
| Relative Fisher `\mathcal I` | `\mathcal I=\delta^\top A^2\delta+\operatorname{tr}(A^2\Sigma)-2\operatorname{tr}A+\operatorname{tr}\Sigma^{-1}` | `h=-2A^2\delta`, `H=4\Sigma^{-1}-2\Sigma A^2-2A^2\Sigma` |
| `W_2^2(\alpha,\gamma)` | `\nabla_m=2\delta`, `\nabla_\Sigma=I-M` | `h=-2\delta`, `H=2(M\Sigma+\Sigma M-2\Sigma)` |
| Quadratic-kernel MMD | `R=\Sigma+mm^\top-\bar\Sigma-\bar m\bar m^\top`, `f=\|R\|_F^2`, gradients `4Rm,2R` | `h=-4Rm`, `H=-4(\Sigma R+R\Sigma)` |
| Debiased Sinkhorn | Gaussian restriction `|\delta|^2+\mathcal B_\epsilon^2`; covariance derivative is the displayed `G_\epsilon` | `h=-2\delta`, `H=-2(\Sigma G_\epsilon+G_\epsilon\Sigma)` |
| `\mathrm{SW}_2^2` | Mean term integrates to `|\delta|^2/d`; covariance derivative is `G_{\rm sw}` | `h=-2\delta/d`, `H=-2(\Sigma G_{\rm sw}+G_{\rm sw}\Sigma)` |

No sign, transpose, factor two, or spherical factor in this table needs correction.

**Sinkhorn matrix derivative and scalar check.** Spectral trace differentiation with `\psi_\epsilon'(r)=-2\tau_\epsilon(r)` yields
\[
G_\epsilon=\tau_\epsilon(\Sigma)
-\bar\Sigma^{1/2}\tau_\epsilon(B^{1/2})B^{-1/2}\bar\Sigma^{1/2},
\qquad B=\bar\Sigma^{1/2}\Sigma\bar\Sigma^{1/2}.
\]
For `\bar\Sigma=I` and covariance eigenvalue `\lambda`, `-4\lambda G_\epsilon(\lambda,1)` simplifies to
\[
4\sqrt{\lambda+\epsilon^2/16}
-4\sqrt{\lambda^2+\epsilon^2/16},
\]
exactly as stated at lines 2191--2195. This is the covariance derivative `\dot\lambda`, not the spatial affine coefficient; MIN-13 changes only its name.

**One-dimensional restrictions.** In coordinates `(m,\sigma)` the induced Gaussian `W_2` metric is Euclidean. Direct substitution gives
\[
\mathrm{KL}=\log(\bar\sigma/\sigma)
+\frac{\sigma^2+(m-\bar m)^2}{2\bar\sigma^2}-\frac12,
\]
`W_2^2=(m-\bar m)^2+(\sigma-\bar\sigma)^2`, and
\[
\mathcal I=\frac{(m-\bar m)^2}{\bar\sigma^4}
+\frac{(\sigma^2-\bar\sigma^2)^2}{\sigma^2\bar\sigma^4}.
\]
The Sinkhorn restriction has the stated three `\psi_\epsilon` terms and tends to `W_2^2` because `\psi_\epsilon(r)\to-2r`. Their Euclidean `(m,\sigma)` gradient-flow ODEs are
\[
\begin{array}{c|cc}
&\dot m&\dot\sigma\\ \hline
\mathrm{KL}&-(m-\bar m)/\bar\sigma^2&1/\sigma-\sigma/\bar\sigma^2\\
W_2^2&-2(m-\bar m)&-2(\sigma-\bar\sigma)\\
\mathrm{S}_\epsilon&-2(m-\bar m)&2\bar\sigma\tau_\epsilon(\sigma\bar\sigma)-2\sigma\tau_\epsilon(\sigma^2)\\
\mathcal I&-2(m-\bar m)/\bar\sigma^4&2/\sigma^3-2\sigma/\bar\sigma^4.
\end{array}
\]
These independently reproduce the chapter's restrictions and the covariance ODEs after `\dot\lambda=2\sigma\dot\sigma`. All four rows at lines 2320--2370 are correct.

**Non-variational affine examples.** Gaussian convolution gives
`B_\epsilon[N(m,\Sigma)](x)=-\epsilon(\Sigma+\epsilon I)^{-1}(x-m)`, which yields exactly the mean and covariance ODE at lines 2519--2524. Exponential tilting of `N(m,\Sigma)` by `\exp\langle Qx,Ky\rangle` has mean `m+\Sigma K^\top Qx`, yielding the attention ODE at lines 2544--2549. Both examples preserve Gaussianity for the stated affine reason.

**Gelbrich and constrained projection.** For any coupling, write its cross-covariance as
`C=\Sigma_\alpha^{1/2}K\Sigma_\beta^{1/2}` with `\|K\|_{op}\leq1`. Nuclear/operator duality gives
`\operatorname{tr}C\leq\operatorname{tr}(\Sigma_\alpha^{1/2}\Sigma_\beta\Sigma_\alpha^{1/2})^{1/2}`. Expanding `\mathbb E|X-Y|^2` proves the stated contraction, with approximation handling singular covariances. The Lavenant JKO criterion then follows in one line by applying both this contraction and `f(\GaussProj\eta)\leq f(\eta)` to a minimizer. Both the theorem and proof are correct apart from MIN-10's cross-reference.

### Scalar closure beyond Gaussianity

For `f_g(\alpha)=g(\int\varphi d\alpha)`, the descent field is
`-g'(m)\nabla\varphi`; hence
\[
\dot m=-g'(m)\int|\nabla\varphi|^2d\alpha.
\]
If this depends on every admissible `\alpha` only through `m`, Dirac laws show `|\nabla\varphi|^2=q(\varphi)`, and comparison with all two-point mixtures gives Jensen equality for every convex coefficient. Thus `q(s)=a+bs`. On a connected regular component,
\[
r(x)=\int_{s_0}^{\varphi(x)}\frac{ds}{\sqrt{a+bs}}
\]
satisfies `|\nabla r|=1`; inversion gives
`\varphi=c+\kappa r+(b/4)r^2`, i.e. `\lambda=b/2` in the chapter's notation. Conversely this quadratic-in-eikonal form gives
`|\nabla\varphi|^2=\kappa^2-2\lambda c+2\lambda\varphi`. The necessity, converse, local regularity domain, and constants in Proposition `prop-scalar-moment-closure` are all correct. For a signed distance in a tubular neighborhood, `|\nabla r_{\mathcal S}|=1` yields `|\nabla(r+\lambda r^2/2)|^2=1+2\lambda\varphi`; the support-in-tube qualification is sufficient and necessary for that example.

## Cross-chapter dependencies inspected

| Referenced material | Why inspected | Result |
|---|---|---|
| `OT4ML/sections/dynamic-ot.tex`, weighted least-square field and continuity equation | Fixes the sign convention and meaning of the minimum-norm Wasserstein tangent used at line 42. | The earlier result is correct; Chapter 16 incorrectly identifies it with unrestricted conditional regression in MAJ-1. |
| Dynamic OT/Brenier and McCann statements | Fixes the quadratic-cost convention, Gaussian map, and displacement interpolation hypothesis. | Chapter formulas agree; “Brenier-type” at line 98 is not a precise enough assumption. |
| Sliced-Wasserstein definition and one-dimensional gradient formula | Fixes whether spherical measure is normalized and whether the objective is halved. | Normalized `\sigma`, no factor two for `\tfrac12\mathrm{SW}_2^2`, and factor two for the catalogue's unhalved `\mathrm{SW}_2^2` are all consistent. |
| Kernelized Benamou--Brenier/RKHS geometry | Fixes the SVGD descent convention. | The representer sign and quadratic-penalty normalization are correct; functional-analytic assumptions are omitted locally. |
| Mean-field attention definition and discrete self-attention | Fixes numerator, denominator, and output matrix placement. | Equation `eq-transformer-residual-attention-step` and the law-level push-forward are consistent with the earlier definition. |
| Hilbert metric, Birkhoff theorem, and topical-map variation norm | Fixes `\lambda=\tanh(\Delta/4)` and the variation seminorm convention. | The Dobrushin linearization and Gaussian-kernel constants are correct once finite projective diameter is assumed. |
| Gaussian `W_2`/Bures formula and Gaussian Brenier map | Fixes matrix square-root order and the covariance metric. | Product-flow map, catalogue `W_2` row, constrained metric, and Gelbrich formula agree with the earlier results. |
| Gaussian entropic OT and Sinkhorn-divergence corollary | Fixes cost `|x-y|^2`, debiasing, `\epsilon`, `\psi_\epsilon`, and `\tau_\epsilon`. | The catalogue's Sinkhorn gradient and scalar eigenvalue ODE are consistent with that convention. |
| Formal Wasserstein first-variation proposition and JKO scheme | Fixes gradient versus descent signs and the Gaussian-projection argument. | Drifting frozen-surrogate and Lavenant proofs have the correct sign and JKO coefficient. |
| Mean-field two-layer network section | Fixes the linear-activation predictor and covariance-block convention. | The cross-covariance energy, symmetric factor `1/2`, and block ODE are correct. |

## Figure and code verification

Every chapter figure caption was checked against its included files and, where present, the generating notebook. The two Moderate mismatches and one Minor sampling-description mismatch are separated from otherwise correct mathematics.

| Figure/notebook | Code-level check | Status |
|---|---|---|
| `fig:generative-flow-matching-interpolants` / `generative-flow-matching-interpolants.ipynb` | Product and optimal couplings, linear paths, and endpoint conventions match the caption. | Correct |
| `fig:generative-diffusion-1d-forward-backward` / `generative-diffusion-1d-forward-backward.ipynb` | Density path and reverse ODE are correct. JSON line 315 uses `linspace` plus jitter rather than Gaussian draws. | **Needs clarification (MIN-14)** |
| `fig:generative-diffusion-2d-forward-backward` / matching notebook | Mixture score, scaled endpoint covariance, reverse field, and three-atom geometry match the caption. | Correct |
| `fig:generative-diffusion-versus-ot-2d` and `fig:generative-diffusion-schedule-comparison` / `generative-diffusion-versus-ot-2d.ipynb` | The notebook generates both figures; direction, early stopping, and linear versus trigonometric schedules match the text. | Correct |
| `fig:generative-w2-vs-sliced-flow-shapes` / matching notebook | The sliced field is approximated with finitely many directions and mild numerical clipping. The caption makes only a qualitative path-map comparison, which the computation supports. | Correct |
| `fig:generative-w2-vs-svgd-entropy-flow` / matching notebook | KDE-Wasserstein and RBF-SVGD updates implement the two displayed fields with the claimed signs. | Correct |
| `fig:generative-drifting-model-trajectories` / matching notebook | JSON lines 251--252 implement unequal Gaussian bandwidths, unequal self weights, unequal horizons, and state-dependent speed caps in both panels. Neither panel is target-only, and no Laplacian kernel is used. | **Contains error (MOD-4)** |
| `fig:moment-measure-forward-map` / matching notebook | Convex potential, gradient image, centering, and displayed source/target roles agree with the chapter. | Correct |
| `fig:generative-mean-shift-pde` / matching notebook | The numerical domain includes a safety clipping branch, but an independent rerun confirmed it is inactive for the plotted trajectory; the long transient and eventual consensus claim is unaffected. | Correct |
| `fig:gradflow-gaussian-closure` / matching notebook | JSON line 245 sets `\Sigma_t=\Sigma_t^{W_2}+0.080t(1-t)I`; no Sinkhorn or Schrodinger computation appears. | **Contains error (MOD-8)** |
| `fig:gradflow-gaussian-1d-energy-landscapes` / matching notebook | The four displayed restrictions and Euclidean `(m,\sigma)` flow curves agree with the independently derived objectives and ODEs. | Correct |

## Repository integrity checks

- The chapter defines 100 ordinary `\label{...}` labels and four labels through `\eqllead`, for 104 local definitions. All are unique.
- It contains 136 reference occurrences with 87 distinct targets. Every target resolves in the current `OT4ML/sections` sources, including the four `\eqllead` equation labels.
- It contains 50 citation commands with 48 distinct bibliography keys. Every key resolves in the repository bibliography.
- All 43 `\includegraphics` paths resolve to existing files.
- The only environment-type cross-reference defect is MIN-10: line 2620 says “Theorem” for a label attached to Definition `def-gaussian-projection`.
- The authoritative source and replicas are not text-identical. The arXiv replica is 2,691 lines and differs from the source by 67 insertions and 48 deletions in a direct textual diff; the MyST replica is 3,024 lines. MOD-11 records the mathematically relevant drift rather than treating line-count differences themselves as defects.
- The notation audit found no unresolved symbol collision beyond MIN-3's local reuse of `\pi`; the old `P_t` notation occurs only in the stale MyST replica.

## Complete coverage matrix

The status categories are literal: **Correct** means no mathematical defect was found in the stated scope; **Needs clarification** means the formula/result is usable but a hypothesis, convention, or interpretation must be made explicit; **Contains error** means at least one sentence, proof step, scope assertion, or figure claim in that unit is wrong as written. A unit can be marked “Contains error” even when its central formula is correct.

### Generative Models via Flow Matching (`sec-generative-flow-matching`)

| Lines | Unit | Status | Audit disposition |
|---:|---|---|---|
| 1--13 | Chapter opening and roadmap | Correct | Descriptive only; conventions are consistent. |
| 14--45 | Section introduction and relation to weighted least squares | **Contains error** | MAJ-1: two different velocity projections are identified. |
| 46--53 | Deterministic-interpolant discussion | **Needs clarification** | MIN-1: refer forward to the pathwise absolute-continuity hypotheses. |
| 54--68 | Definition `def-deterministic-interpolant` | **Needs clarification** | Pointwise differentiability alone is not enough for the surrounding continuity claim. |
| 69--103 | Example “Linear two-endpoint deterministic interpolants” | **Needs clarification** | MIN-2: McCann requires an optimal quadratic coupling/map. |
| 104--114 | Figure `fig:generative-flow-matching-interpolants` | Correct | Caption distinguishes product and OT couplings correctly. |
| 115--122 | Flow-matching setup | Correct | Conditional regression target and dimensions are consistent. |
| 123--218 | Proposition `prop-flow-matching-vector-field` and proof | **Needs clarification** | Conditional projection, signs, push-forward identity, and continuity equation are correct; MIN-5 tightens the Hilbert/test classes. |
| 219--234 | Flux interpretation and exact ODE sampling | **Contains error** | MOD-1: endpoint map/existence conclusion is overbroad. |
| 235--252 | Definition `def-stochastic-interpolant` | **Needs clarification** | Endpoint laws and independence are coherent, but MIN-1's pathwise regularity issue recurs. |
| 253--264 | Static-noise linear stochastic example | **Needs clarification** | MIN-3: omitted coefficient endpoints and reused `\pi`. |
| 265--310 | Remark `rem-noisy-stochastic-interpolants` | Correct | Itô/Fokker--Planck and probability-flow correction have the right `1/2`, divergence, and sign. |
| 311--330 | Diffusion-model connection and regression display | **Needs clarification** | MIN-4: the displayed objective leaves `t` free; the special gradient/minimum-tangent claim is otherwise correct. |
| 331--374 | Proposition `prop:Tweedie` and proof | Correct | `\mathcal P_1`, convolution differentiation, and everywhere version are sufficient. |
| 375--405 | Proposition `prop:flow` and proof | **Needs clarification** | MOD-2: add `\alpha\in\mathcal P_2` for the global squared-loss theorem; formula is correct. |
| 406--441 | Figure `fig:generative-diffusion-1d-forward-backward` | **Needs clarification** | Vector field and direction are correct; MIN-14: the reverse seeds are stratified and jittered, not Gaussian draws. |
| 442--460 | Mixture score and Figure `fig:generative-diffusion-2d-forward-backward` | Correct | Scaled score coefficient and OU time change are correct. |
| 461--533 | Proposition `prop-gaussian-flow-matching-optimality` and proof | Correct | Regression matrix, characteristic map, Brenier map, and commutation equivalence all re-derived successfully. |
| 534--569 | Remark “Changing the bridge speed does not restore optimality” | Correct | The nondegenerate scalar-schedule invariance and non-Gaussian caution are accurate. |
| 570--628 | Paragraph “Variations on the interpolant” | Correct | Time reparametrization, general score formula, OU velocity, overshoot, and endpoint warning are correct. |
| 629--642 | Figure `fig:generative-diffusion-versus-ot-2d` | Correct | Caption explicitly stops before the singular endpoint. |
| 643--656 | Figure `fig:generative-diffusion-schedule-comparison` | Correct | The schedules differ as claimed and endpoint handling is qualified. |

### One-Step Generative Models

| Lines | Unit | Status | Audit disposition |
|---:|---|---|---|
| 657--662 | Section introduction | Correct | Correctly separates training-time evolution from one-evaluation inference. |
| 663--688 | Parameter-domain discrepancy objective | Correct | Push-forward objective and Euclidean parameter gradient sign are correct. |
| 689--739 | Induced Eulerian velocity and continuity equation | Correct | Fiber disintegration and conditional averaging are correct; non-identifiability warning is important. |
| 740--755 | Minibatch bias paragraph | Correct | Nonlinear plug-in gradients are generally biased; MMD `U`-statistic qualification is correct. |
| 756--761 | Example `ex-perturbation-response-neural-ot` | Correct | Coupling/map/out-of-sample distinctions are accurate. |
| 762--807 | Paragraph “One-step model using Wasserstein flow of discrepancy” | Correct | Formal descent, `L^2` fit, composition-versus-distillation caveat, and recent-method descriptions are coherent. |
| 808--825 | Paragraph “Sliced-Wasserstein flow” | **Contains error** | Velocity is correct; MOD-3 corrects the convergence theorem's target and initial-data scope. |
| 826--857 | Figure `fig:generative-w2-vs-sliced-flow-shapes` and map comment | Correct | The qualitative non-Brenier conclusion is supported and not overstated. |
| 858--905 | Paragraph `sec-svgd-generative-flow` | **Needs clarification** | MIN-6 supplies RKHS/Stein assumptions; MIN-11 narrows the anti-collapse wording. Sign, normalization, and particle factor `1/n` are correct. |
| 906--921 | Figure `fig:generative-w2-vs-svgd-entropy-flow` | Correct | Correctly distinguishes KDE approximation of current score from SVGD. |
| 922--956 | Self-corrected drifting equations and interpretation | **Needs clarification** | Gaussian-kernel score identity and sign are correct; MIN-11 changes the absolute “prevents collapse” claim to a tendency, not a guarantee. |
| 957--972 | Figure `fig:generative-drifting-model-trajectories` | **Contains error** | MOD-4: notebook dynamics do not match caption or claimed isolated comparison. |
| 973--1015 | Proposition `prop-drifting-semi-relaxed-gradient` and proof | Correct | Frozen first variation and descent sign are correct; no fixed-energy claim is made. |
| 1016--1044 | Example “Kernel drifting as a frozen surrogate” | Correct | Potential sign, additive constant, and non-divergence qualification are correct. |
| 1045--1057 | Remark “General fields and projection onto gradients” | **Needs clarification** | MIN-7: project onto the closure and qualify divergence-free additions. |

### Moment Measures (`sec-moment-measures`)

| Lines | Unit | Status | Audit disposition |
|---:|---|---|---|
| 1058--1066 | Section introduction | Correct | Accurately describes source/map coupling and hidden convexity. |
| 1067--1082 | Definition `def-moment-measure` | **Contains error** | MOD-5: `Z_u=0` is allowed but then inverted. |
| 1083--1103 | Invariances, centering, essential continuity | Correct | Translation/additive invariances and centering obstruction agree with the primary theorem. |
| 1104--1119 | Figure `fig:moment-measure-forward-map` | Correct | Caption represents the forward construction and centered outputs consistently. |
| 1120--1135 | Theorem `thm-moment-measure-characterization` | Correct | `\mathcal P_1`, centering, non-hyperplane support, essential continuity, and uniqueness scope match CEK. |
| 1136--1150 | Example `ex-moment-measure-gaussian` | Correct | Source covariance `A^{-1}` and image covariance `A` are correct. |
| 1151--1195 | Maximal correlation, duality, `W_2` identity, and variational problem | Correct | Signs, factors `1/2`, domains, and translation invariance check out. |
| 1196--1243 | Proposition `prop-moment-hidden-convexity` and proof | **Contains error** | The theorem is true; MAJ-2 identifies a materially invalid nonsmooth converse proof. |
| 1244--1264 | Remark `rem-moment-hidden-convexity` | Correct | Legendre/Toland transformation and Prékopa convexity signs are correct. |
| 1265--1283 | Paragraph “Conjugate moment measures for generation” | **Contains error** | MOD-6: theorem hypotheses are omitted and Brenier language is overgeneralized. |

### Evolution in Depth of Transformers (`sec-transformer-depth-evolution`)

| Lines | Unit | Status | Audit disposition |
|---:|---|---|---|
| 1284--1309 | Section setup and depth-versus-token limit | Correct | Fixed-token continuous-depth interpretation and architectural omissions are explicit. |
| 1310--1328 | Paragraph “Attention as a context-dependent velocity” | Correct | Softmax normalization and residual scale `1/T` are correct. |
| 1329--1358 | Paragraph “Token measure evolution” | Correct | Empirical push-forward is exact; PDE limit is appropriately labeled formal and assumption-dependent. |
| 1359--1409 | Paragraph “`L^2` attention and mean shift” | Correct | Raw barycenter versus displacement, Gaussian score identity, damping, and blurring interpretation are correct. |
| 1410--1445 | Paragraph “Consensus and Markov averaging” | Correct | Weighted row-stochastic matrix and particle ODE are normalized correctly. |
| 1446--1509 | Proposition `prop-dobrushin-birkhoff-contraction` and proof | Correct | Exact quotient norm, common-mass proof, and Birkhoff tangent factor are correct. |
| 1510--1535 | Continuous Markov operator and Dobrushin coefficient | Correct | Density relative to `\alpha`, factor `1/2`, and variation contraction are correct. |
| 1536--1580 | Kernel cross-ratio and uniform Birkhoff bound | **Contains error** | MOD-7: `\lambda_K(C)<1` needs finite projective diameter/uniform positivity, not pointwise positivity alone. |
| 1581--1698 | Theorem `thm-mean-shift-consensus` and proof | Correct | Its Lipschitz positive kernel on compact `C_0` supplies the missing uniform bound; all discrete/continuous rates are correct. |
| 1699--1712 | Gaussian-kernel cross-ratio and discrete adaptive estimate | **Needs clarification** | Constant is exact; MIN-8: the displayed full-step rate silently takes `\tau=1`. |
| 1713--1722 | Continuous Gaussian adaptive contraction | Correct | Integrand and exponential sign are correct. |
| 1723--1728 | Remark `rem-sinkhorn-mean-shift-contraction` | Correct | Correctly distinguishes fixed-kernel inter-iterate contraction from within-cloud state-dependent contraction. |
| 1729--1745 | Paragraph “Scope of the consensus result” | Correct | Nonconservation, frozen mean shift, hard-confidence clustering, and Gaussian eventual consensus are properly separated. |
| 1746--1753 | Figure `fig:generative-mean-shift-pde` | Correct | Long transient and eventual one-point consensus are compatible. |
| 1754--1799 | Paragraph “Gradient structure and limitations” | Correct | `V=Q^\top K` gradient condition and response term are correct; no generic fixed-energy claim is made. |

### Flows over the Gaussian Manifold (`sec-gaussian-closure-transport-dynamics`)

| Lines | Unit | Status | Audit disposition |
|---:|---|---|---|
| 1800--1818 | Section setup and Gaussian/Bures viewpoint | Correct | Correctly separates exact affine invariance from constrained projection. |
| 1819--1836 | Figure `fig:gradflow-gaussian-closure` | **Contains error** | MOD-8: middle panel is an arbitrary isotropic covariance bump, not a computed Sinkhorn or Schrödinger bridge. |
| 1837--1843 | Gaussianity-preservation setup | Correct | Introductory statement is accurate. |
| 1844--1934 | Proposition `prop-gaussian-affine-closure` and proof | Correct | Affine closure, positivity, converse for gradient tangents, weighted-divergence caveat, and Lyapunov equation are correct. |
| 1935--1963 | Gaussian-preserving catalogue scope and proposition header | **Contains error** | MOD-9: exact Gaussian solution is conflated with unconditional invariance of an unspecified ambient solution. |
| 1974--1979; 2093--2119 | General moment-functional row | Correct | Distribution-free first variation and covariance factor two are correct. |
| 1980--1984; 2123--2128 | Quadratic-potential row | Correct | Mean and covariance signs and coefficients are correct. |
| 1986--1990; 2129--2137 | Quadratic-interaction row | Correct | The prefactor `1/4` produces `G/2` as covariance derivative and the stated ODE. |
| 1992--1996; 2142--2150 | KL row | Correct | Affine score difference and Ornstein--Uhlenbeck covariance ODE are correct. |
| 1998--2002; 2150--2158 | Relative-Fisher row | Correct | Fourth-order first variation collapses to the stated affine field; all powers and factors are correct. |
| 2004--2008; 2162--2164 | Squared-`W_2` row | Correct | Brenier matrix order and unhalved factor two are correct. |
| 2010--2014; 2032--2035; 2164--2172 | Quadratic-kernel MMD row | Correct | Formula is the squared raw-second-moment discrepancy; the chapter explicitly says so and makes no characteristicness claim. |
| 2016--2020; 2036--2068; 2178--2195 | Debiased Sinkhorn row | **Needs clarification** | Matrix derivative and eigenvalue ODE are correct; MOD-9 qualifies ambient uniqueness and MIN-13 renames `\dot\lambda`. |
| 2022--2026; 2069--2078; 2197--2219 | Sliced-Wasserstein row | **Needs clarification** | Mean factor `1/d` and covariance integral are correct; ambient uniqueness requires MOD-9's qualification. |
| 2079--2089 | Relative-Fisher normalization | Correct | It is the unhalved relative Fisher information used by the row. |
| 2092--2224 | Catalogue proof as algebra | Correct | Every displayed first variation and matrix ODE checks out; only the proposition-level uniqueness scope needs repair. |
| 2226--2318 | Example “Linear mean-field networks as cross-covariance flows” | Correct | Predictor, block orientation, symmetric-gradient `1/2`, affine particle field, and covariance ODE are correct. |
| 2320--2371 | Paragraph “One-dimensional case” | **Needs clarification** | All four restrictions are correct; “exact ambient” inherits MOD-9's solution-class caveat. |
| 2372--2383 | Figure `fig:gradflow-gaussian-1d-energy-landscapes` | Correct | The half-plane metric, target, and straight `W_2^2` rays are consistent. |
| 2384--2407 | Constrained Gaussian-manifold setup | Correct | Tangent affine-gradient class and constrained JKO interpretation are correct. |
| 2408--2468 | Proposition `prop-gaussian-gradient-bullet-list`, proof, and organizing paragraph | Correct | Riesz calculation, factor two, Bures covariance ODE, and equality with ambient flow for quadratic first variation are correct. |
| 2469--2478 | Non-variational-flow introduction | Correct | Correctly distinguishes affine preservation from fixed-energy gradient structure. |
| 2479--2498 | Example “Flow matching and diffusion paths between Gaussians” | **Needs clarification** | The existential affine flow-matching claim is correct; MIN-12 adds independence for the diffusion covariance. |
| 2500--2526 | Example “Gaussian kernel drifting” | Correct | Smoothed score, mean equation, covariance equation, and self-term interpretation are correct. |
| 2528--2555 | Example “Gaussian closure of attention dynamics” | Correct | Gaussian tilting, affine matrix, mean/covariance ODE, and PSD special case are correct. |
| 2557--2573 | Paragraph and Definition `def-gaussian-projection` | Correct | Domain `\mathcal P_2` and allowance for singular covariance are appropriate. |
| 2575--2603 | Theorem `thm-gelbrich-projection` and proof | Correct | Cross-covariance factorization, trace bound, singular approximation, and equality are correct. |
| 2605--2640 | Theorem `thm-lavenant-gaussian-preserving-jko` and proof | **Needs clarification** | Mathematical criterion and hypotheses are correct; MIN-10 fixes the environment cross-reference. |
| 2642--2659 | Paragraph “Moment closure beyond Gaussianity” | Correct | The affine first variation gives the stated distribution-free mean/covariance closure. |
| 2661--2705 | Proposition `prop-scalar-moment-closure` and proof | Correct | Necessity, converse, constants, connectedness, and local regular-set scope are correct. |
| 2706--2710 | Example “A closed signed-distance moment” | Correct | Tubular-neighborhood regularity, coefficient `2\lambda`, and support condition are correct. |

### Replicas and generating artifacts

| Artifact/location | Status | Audit disposition |
|---|---|---|
| `arxiv/sections/transportation-models.tex`, 2,691 lines | **Contains error** | MOD-11: mathematically stale flow-matching assumptions and SVGD optimizer description. Relative to the authoritative source, the current textual diff is 67 insertions and 48 deletions. |
| `myst/chapters/transportation-models.md`, 3,024 lines | **Contains error** | MOD-11: same stale mathematics plus old `P_t` notation. It was inspected only for drift, not treated as authoritative. |
| `notebooks-figures/generative-drifting-model-trajectories.ipynb` | **Contains error** | MOD-4: implemented kernels, self terms, weights, bandwidths, and speed control do not match the caption. |
| `notebooks-figures/gradflow-gaussian-closure.ipynb` | **Contains error** | MOD-8: middle covariance is `\Sigma_t^{W_2}+0.080t(1-t)I`, not an entropic model. |
| `notebooks-figures/generative-diffusion-1d-forward-backward.ipynb` | **Needs clarification** | MIN-14: reverse trajectories use an evenly spaced grid plus small jitter, not i.i.d. Gaussian endpoint draws. |
| All remaining chapter figure captions and generating mathematics | Correct | No further normalization, endpoint, or model-identification discrepancy found. |

## Delicate claims independently checked and found correct

This list records delicate points for which no correction is recommended. It is intentionally explicit so that repairs to nearby text do not accidentally alter valid mathematics.

1. The conditional expectation in `prop-flow-matching-vector-field` is the unique `L^2` state-measurable regression minimizer, modulo `\alpha_t`-a.e. equality.
2. The push-forward differentiation and weak continuity-equation sign in lines 148--215 are correct.
3. The space-time assumptions newly present in the authoritative flow-matching proposition are sufficient for its integrated weak identity.
4. The Fokker--Planck matrix divergence and probability-flow correction in `rem-noisy-stochastic-interpolants` have the correct factor `1/2`.
5. Tweedie's identity is stated with the correct `+\sigma^2\nabla\log\rho_\sigma` sign and is valid for a `\mathcal P_1` input after Gaussian convolution.
6. The Gaussian-endpoint conditional noise identity is `\mathbb E[Y\mid Z_t=z]=-t\nabla\log\rho_t(z)`.
7. The linear-bridge field is `-z/(1-t)-t\nabla\log\rho_t(z)/(1-t)`; its displayed scalar potential differentiates to that field.
8. The general schedule coefficient `a_t'b_t^2/a_t-b_t'b_t` is correct.
9. The OU probability-flow velocity is `-z-\sigma^2\nabla\log p_t`, with the opposite sign under reverse-time parametrization.
10. The finite-time coefficients `\cos(\pi t/2),\sin(\pi t/2)` are exactly an OU time change, not a new path.
11. The independent-Gaussian interpolation covariance is `(1-t)^2\Sigma_0+t^2\Sigma_1` with no cross term.
12. The Gaussian product-coupling regression matrix has the order `(t\Sigma_1-(1-t)\Sigma_0)\Sigma_t^{-1}`.
13. The Gaussian product-coupling flow map has the stated whitened square-root order and pushes `N(0,\Sigma_0)` to `N(0,\Sigma_t)`.
14. Its terminal map is the Brenier map if and only if the endpoint covariances commute.
15. A nondegenerate scalar rescheduling cannot repair that terminal non-optimality.
16. The parameter-flow push-forward velocity is the conditional average over latent fibers and is not intrinsically determined by the generated law.
17. A nonlinear empirical transport objective generally has minibatch plug-in gradient bias; the separate MMD `U`-statistic qualification is correct.
18. The sliced-Wasserstein velocity has no extra factor two for the one-step objective `\tfrac12\mathrm{SW}_2^2`; the unhalved Gaussian-catalogue objective correctly doubles it, with normalized spherical measure in both places.
19. The chapter correctly warns that a sliced-flow characteristic map need not be the Brenier map.
20. The SVGD Stein derivative, target-score attraction sign, kernel derivative variable, repulsion sign, particle factor `1/n`, and mean-field transport sign are correct.
21. The authoritative source correctly distinguishes the quadratically penalized SVGD representer from the normalized unit-ball optimizer.
22. Gaussian normalized kernel drift equals `\epsilon` times the score of the smoothed density.
23. The cross-minus-self drifting field has the correct attraction/repulsion sign.
24. The semi-relaxed drifting functional is differentiated with both the reference measure and potential frozen; its descent velocity is exactly the prescribed gradient field.
25. The moment-measure translation invariance and zero-barycenter necessity are correct under essential continuity.
26. The CEK theorem's `\mathcal P_1`, centering, non-hyperplane, essential-continuity, and uniqueness conditions are correctly stated.
27. For quadratic `u`, the log-concave source covariance is `A^{-1}` and the moment-measure covariance is `A`.
28. Maximal-correlation Kantorovich duality uses an infimum of `\int u\,d\eta+\int u^*\,d\alpha` with the correct sign.
29. The identity between maximal correlation and `W_2^2` has all three factors `1/2` correct.
30. The entropy-plus-correlation functional is translation invariant precisely because the target is centered.
31. The minimizer's Euler equation gives `\eta\propto e^{-u}` and the scalar-product optimizer gives `\alpha=(\nabla u)_\#\eta` in the stated direction.
32. The hidden-convexity reformulation has the correct Legendre conjugate and negative log-partition sign.
33. The transformer limit in this chapter is a residual-depth limit at fixed token number, and the text correctly distinguishes it from a many-token limit.
34. The attention denominator, value-matrix placement, empirical-law push-forward, and explicit-Euler scaling are correct.
35. Gaussian mean shift is `m_\epsilon[\alpha](x)-x`, not the raw local barycenter; the score identity has coefficient `\epsilon`.
36. The weighted empirical averaging matrix is row-stochastic even for unequal positive particle weights.
37. The Dobrushin coefficient equals the exact variation-seminorm quotient norm with no extra factor.
38. Linearizing Birkhoff contraction at the constant ray correctly gives `\delta(P)\leq\lambda(P)`.
39. Row normalization and positive diagonal particle weights cancel from projective cross-ratios.
40. The damped consensus factor is `1-\tau(1-\delta)` and the continuous exponent is `-\int(1-\delta)`.
41. The discrete and continuous pointwise consensus bounds both have denominator `1-\bar\delta`; no missing `\tau` remains after summing the discrete tail.
42. Positive Lipschitz kernels on the compact invariant hull make the consensus characteristic field uniformly well posed and supply a uniform positive kernel minimum.
43. The Gaussian-kernel projective factor is exactly `\tanh(D^2/(4\epsilon))`.
44. The hard-confidence kernel can split into clusters; this does not contradict the strictly positive-kernel consensus theorem.
45. For `V=Q^\top K`, attention is an instantaneous gradient in the query token, and the first variation of the natural global candidate has the extra response term shown in the chapter.
46. An affine velocity preserves Gaussianity with `\dot\Sigma=A\Sigma+\Sigma A^\top`.
47. A Gaussian tangent's minimum-norm gradient representative is affine with the unique symmetric Lyapunov solution.
48. The general moment-functional row has the correct covariance derivative and factor two, for Gaussian and non-Gaussian laws alike.
49. The quadratic-potential and quadratic-interaction catalogue rows have the correct normalizations.
50. The KL catalogue row has mean `-\bar\Sigma^{-1}(m-\bar m)` and covariance `2I-\Sigma\bar\Sigma^{-1}-\bar\Sigma^{-1}\Sigma`.
51. The relative-Fisher row has the correct `A^2`, `\Sigma^{-2}`, and factor-four covariance term.
52. The squared-`W_2` row uses the correct Gaussian Brenier matrix and the correct factor two for the unhalved distance.
53. The quadratic-kernel MMD formula is exactly the squared Frobenius discrepancy of raw second moments, and its affine field is `-4Rx`.
54. The debiased Sinkhorn covariance derivative `G_\epsilon`, including matrix square-root order and self term, is correct.
55. The Sinkhorn covariance-eigenvalue derivative for identity target is exactly `4\sqrt{\lambda+\epsilon^2/16}-4\sqrt{\lambda^2+\epsilon^2/16}`.
56. The sliced-Gaussian mean coefficient is `-2/d`, and `G_{\rm sw}` has the correct square-root ratio and normalized-sphere integral.
57. The linear mean-field network's lower-left cross-covariance convention, symmetric block gradient factor `1/2`, and covariance ODE are correct.
58. The one-dimensional KL, `W_2`, Sinkhorn, and Fisher restrictions are correct, including the `\epsilon\downarrow0` Sinkhorn limit.
59. The constrained Gaussian gradient is `\nabla_mF+2\nabla_\Sigma F(x-m)`; the Bures covariance ODE has the correct factor two.
60. Gaussian kernel drifting produces the stated affine mean and covariance ODEs.
61. Exponential tilting of a Gaussian gives the stated transformer Gaussian closure, including `B=V\Sigma K^\top Q`.
62. Gelbrich projection is `W_2`-nonexpansive and the proof correctly handles semidefinite covariances by approximation.
63. The Lavenant JKO preservation criterion is mathematically correct, including the need for uniqueness and convergence before concluding a Gaussian limit curve.
64. Mean/covariance closure for `g(m,\Sigma)` is distribution-free; Gaussianity is not needed for those two ODEs.
65. Scalar closure for every `g` is equivalent to `|\nabla\varphi|^2=a+b\varphi` under the proposition's algebraic meaning of autonomy.
66. The eikonal normal form is local to connected regular sets and has `\lambda=b/2`.
67. The signed-distance example is valid only in a tubular neighborhood and while the evolving support remains there; the chapter states both qualifications.
68. Every differentiable positive-definite Gaussian marginal path admits the deterministic affine flow-map interpolant whose exact conditional field is the symmetric Lyapunov representative; the existential wording at line 2480 is correct.
69. The quadratic-kernel MMD row is intentionally non-characteristic: the chapter explicitly identifies its embedding as the raw second moment and does not claim that zero energy identifies the law.

## Prioritized repair order

1. **Separate the two tangent projections (MAJ-1).** Repair the introductory conceptual model first, because it controls how readers interpret flow matching, the Gaussian special case, drifting projection, and the later Gaussian-path example.
2. **Replace the nonsmooth converse proof (MAJ-2).** Preserve the proposition, but use Santambrogio's one-sided inequality/distributional-Laplacian argument or explicitly split a smooth heuristic from the cited general proof.
3. **Repair formal theorem domains.** In order: require `0<Z_u<\infty` (MOD-5), add finite projective diameter before claiming `\lambda<1` (MOD-7), narrow sliced-Gaussian convergence (MOD-3), state conjugate moment-measure hypotheses (MOD-6), and qualify ambient Gaussian-flow uniqueness (MOD-9).
4. **Correct or regenerate the two misleading figures.** Fix the drifting comparison (MOD-4) and replace the ad hoc entropic bridge panel or relabel it as schematic (MOD-8). Captions should describe the actual computation, not an intended model.
5. **Tighten flow-matching existence and domains.** Add endpoint characteristic caveats (MOD-1), `\mathcal P_2` to the global Gaussian-endpoint regression (MOD-2), and independence to the later Gaussian diffusion covariance (MIN-12). Do not alter the valid existential affine-path claim.
6. **Apply local mathematical clarifications.** Resolve MIN-1--MIN-8 and MIN-11--MIN-14: regularity, optimal-coupling language, stochastic endpoints/notation, time quantifier, test spaces, RKHS assumptions, closed gradient projection, damping, anti-collapse scope, independence, covariance-versus-state terminology, and reverse-seed wording.
7. **Fix the isolated reference typo (MIN-10).** Point the Lavenant theorem to Definition `def-gaussian-projection`.
8. **Regenerate replicas last (MOD-11).** Synchronize arXiv and MyST only after all authoritative-source repairs, so stale flow assumptions and SVGD normalization are not reintroduced.

## Count reconciliation

| Severity | Finding IDs | Count |
|---|---|---:|
| Critical | None | 0 |
| Major | MAJ-1--MAJ-2 | 2 |
| Moderate | MOD-1--MOD-9, MOD-11 | 10 |
| Minor | MIN-1--MIN-8, MIN-10--MIN-14 | 13 |
| **Established total** | **MAJ-1--2; MOD-1--9, 11; MIN-1--8, 10--14** | **25** |

The six unresolved-scope questions are not included in these counts. Removed first-pass IDs MOD-10 and MIN-9 are also excluded. Repeated appearances in the coverage matrix, formula ledger, replica table, or repair order refer to the same numbered findings and are not additional defects. There are no Critical findings.
