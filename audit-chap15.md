# Second-Pass Adversarial Mathematical Audit of Chapter 15

## Executive summary

This report is a fresh second-pass audit of the complete authoritative source
`OT4ML/sections/wasserstein-gradient-flows.tex` (3,883 lines). The audited file
has SHA-256
`39d69fa695b4bdc1b29152ed2e6db8bd275d77109627cd146418ca08a7c47741`.
I re-read every line, treated all conclusions of the first report as hypotheses
to be challenged, independently recomputed the delicate formulas, and
re-checked the cited theorem scopes against primary papers or authoritative
monographs. I also re-read the definitions used from
`OT4ML/sections/dual-norms.tex`, `OT4ML/sections/dynamic-ot.tex`,
`OT4ML/sections/wasserstein-space.tex`, and
`OT4ML/sections/statistical-ot.tex`.

The central mathematical calculus survives this adversarial pass. No Critical
or Major defect remains. In particular, I found no wrong coefficient or sign in
the JKO normalization, the principal Wasserstein PDEs, PL/KL rates, functional
inequalities, PMO and spectral formulas, nonlocal formal calculus, WFR flow, or
second-order phase-space dynamics. The revised findings are:

| Severity | Count |
|---|---:|
| Critical | 0 |
| Major | 0 |
| Moderate | 8 |
| Minor | 9 |
| **Total** | **17** |

The two most consequential conclusions of the second pass are:

1. The former Major finding about McCann's theorem was too broad. The chapter's
   hard `+\infty` extension is still geodesically convex as an extended-valued
   functional. What fails is the claimed lower-semicontinuity proof and the
   identification with the book-wide recession convention for sublinear
   powers. F1 is therefore narrowed and downgraded to Moderate.
2. The earlier literature uncertainty about higher-order empirical expansions
   is substantially resolved. The expansion mechanism and the empirical
   high-moment estimate are valid on the compact domain, but the Richardson
   sentence must make clear which higher kernels are uniformly bounded. F6 is
   narrowed and downgraded to Minor; it is no longer an unresolved theorem
   claim.

Of the 17 revised findings, F16 is only secondary-source drift: it is not an
error in the authoritative chapter. The other 16 concern the authoritative
text. Most are hypothesis, domain, or theorem-scope defects rather than false
formulas.

## Second-pass changes

Every first-pass finding was reconsidered independently. “Removed” below means
that it no longer contributes a separate finding or severity count.

| Prior ID | Second-pass disposition | Revised judgment |
|---|---|---|
| F1 | **Narrowed and downgraded**: Major to Moderate | The extended-valued geodesic-convexity theorem is true. The lower-semicontinuity sentence is false for finite recession, and the power-divergence convention conflicts with Definition `def_divergence`. |
| F2 | **Confirmed and broadened** | The formal jump calculation is correct, but Erbar's rigorous theorem is translation-invariant and substantially more restrictive; Warren's broader result still has explicit structural hypotheses. The principal-value sentence is also too general. |
| F3 | **Confirmed** | A concrete `C^1` counterexample shows explicit and implicit schemes can select different ODE solutions. |
| F4 | **Narrowed and downgraded**: Moderate to Minor | The proposition is explicitly formal and the chapter distinguishes vertical from horizontal variations. Only the meaning of “smooth first variation” needs to include a transport chain rule. |
| F5 | **Confirmed, with corrected rationale** | The text does state the strong-upper-gradient condition. The actual omission is `AC^2` membership (and the associated measurability/integrability requirements) in the maximal-slope definition. |
| F6 | **Narrowed, literature status resolved, downgraded**: Moderate to Minor | Compact support plus bounded differences supplies every fixed empirical Wasserstein moment. Centered empirical tensors give the `1/n` expansion. The remaining defect is an ambiguity about bounded kernels above order `2J-2` when `r>2J-2`; the cited paper proves a related theorem under its own precise derivative assumptions. |
| F7 | **Confirmed and narrowed** | The chapter's formal two-homogeneity proposition is correct. Only the preceding attribution of unconditional “global convergence” to Chizat--Bach is too strong. |
| F8 | **Confirmed and broadened** | Compactness gives generalized minimizing movements, not automatically curves of maximal slope. The action must first generate a suitable complete extended metric, and a slope-liminf/upper-gradient condition is needed. |
| F9 | **Confirmed and broadened** | The primary ResNet source proves finite-width consistency for an already continuous-depth model. It explicitly treats finite-depth-to-continuous-depth consistency as separate; the chapter's sequential limit and finite training metric need qualification. |
| F10 | **Confirmed** | The Nesterov ODE requires `t=k\sqrt h`, not the heavy-ball scaling `t=kh`. |
| F11 | **Merged into F8 and removed as a standalone finding** | Calling the discrete construction a minimizing-movement scheme is common and harmless. The only material terminology issue is the later identification of an arbitrary limit with a gradient flow/maximal-slope curve. |
| F12 | **Confirmed** | The symbol `b` is undefined in the multispecies display. |
| F13 | **Confirmed** | The moment and distance slope formulas need their effective domains and target-point convention. |
| F14 | **Narrowed and confirmed** | The proposition is correct under its intended setting; it should state the convergence topology and EDI assumption, and the proof needs only the inequality, not an identity. |
| F15 | **Confirmed and broadened** | The WFR reaction cannot nucleate exact vacuum; the logarithmic formula also requires a positive target density or an explicit support convention. |
| F16 | **Confirmed** | The arXiv and MyST formulas still differ mathematically from the corrected authoritative dual pairing. |
| F17 | **New, Minor** | “Zero mean” does not fix higher-derivative kernel gauges until a reference measure is specified. |
| F18 | **New, Minor** | Heat flow is not intrinsically “no longer a deterministic push-forward”; the Otto velocity is a deterministic density-dependent velocity when sufficiently regular. |

No first-pass finding was upgraded. F11 was merged, no finding remains at Major
severity, and F17--F18 record issues missed in the first pass.

## Audit method and conventions

### Scope and independence

- I re-read all 3,883 authoritative lines, including captions and informal
  interpretations.
- I recomputed every displayed flow sign, normalization, first variation,
  dissipation factor, PL/KL exponent, and second-order force emphasized in the
  request.
- I inspected the referenced Chapter 14 dynamic-action, mobility, spectral,
  nonlocal, and WFR definitions, the global `\phi`-divergence convention, and
  the empirical-polynomial/rate definitions.
- I compared `arxiv/sections/wasserstein-gradient-flows.tex` and
  `myst/chapters/wasserstein-gradient-flows.md` only for drift; neither was
  treated as authoritative.
- A check against the active book sources (excluding archival files under
  `OT4ML/removed`) found all 112 distinct `\ref` or `\eqref` targets and all
  88 distinct citation keys. No unresolved reference, missing bibliography
  key, or conflicting active label was found. The two labels attached to the
  power-divergence proposition are intentional aliases.

### Status terminology

- **Correct**: mathematically sound at the level explicitly claimed, including
  statements clearly labelled formal.
- **Needs clarification**: the formula is sound but its domain, topology,
  regularity, proof status, or cited theorem scope needs an explicit repair.
- **Contains error**: false as written, internally inconsistent, or proved by an
  invalid argument that is material to the displayed claim.

### Severity terminology

- **Critical**: invalidates a central construction or a substantial chain of
  results.
- **Major**: a false central theorem or normalization with significant
  downstream consequences.
- **Moderate**: a materially false generality, missing convergence scaling, or
  foundational metric-theory hypothesis.
- **Minor**: a local domain, notation, formal-chain-rule, wording, or
  source-synchronization defect with a direct repair.

Line numbers below are one-based and refer to the authoritative source.

## Detailed established findings

### F1. McCann's hard singular extension is geodesically convex, but not lower semicontinuous for finite recession and not the book's divergence

**Severity:** Moderate

**Location:** lines 967-1015, Theorem `thm-mccann-internal-energy`, “McCann
displacement convexity for internal energies,” especially lines 977-986;
lines 1017-1067, Proposition `prop-power-divergences-geodesic-convexity`,
especially lines 1032-1037; lines 1068-1107, Remark
`rem-phi-divergence-geodesic-convexity`.

**Current claim.** The theorem assigns `+\infty` to every singular measure and
says the nonsmooth/singular case follows by approximation and lower
semicontinuity. The power-divergence proposition uses the same hard convention
for all `m>0`, despite using the notation `\Divergm_{\phi_m}` defined elsewhere
with a recession term.

**Second-pass judgment.** The first report incorrectly called the
geodesic-convexity theorem false on singular measures. With the chapter's hard
extension it is still geodesically convex in the extended-valued sense. If both
endpoint energies are finite, both endpoints are absolutely continuous and
McCann's argument applies; if either endpoint has infinite energy, the convexity
inequality is trivial for interior times because its right-hand side is
`+\infty`. Thus this is a true theorem with an invalid general-case proof, not a
false theorem.

The lower-semicontinuity claim is nevertheless false for sublinear internal
energies. For

$$
g_m(r)=\frac{r^m}{m-1},\qquad 0<m<1,
$$

the recession slope is

$$
g'_{m,\infty}=\lim_{r\to\infty}\frac{g_m(r)}r=0.
$$

Let `\rho_\varepsilon` be uniform on a ball of volume
`V_\varepsilon\downarrow0`. Then
`\rho_\varepsilon dx\rightharpoonup\delta_0`, while

$$
\int g_m(\rho_\varepsilon)\,dx
=\frac{V_\varepsilon^{1-m}}{m-1}\longrightarrow0.
$$

The hard extension gives `\mathcal U_{g_m}(\delta_0)=+\infty`, so it is not
narrowly lower semicontinuous. The correct relaxed integral is

$$
\overline{\mathcal U}_g(\rho\,dx+\alpha^\perp)
=\int g(\rho)\,dx+g'_\infty\alpha^\perp(\mathbb R^d).
$$

There is also a direct cross-chapter inconsistency. Definition
`def_divergence` in `OT4ML/sections/dual-norms.tex`, lines 384-396, defines

$$
\Divergm_\phi(\alpha\mid\beta)
=\int\phi\!\left(\frac{d\alpha}{d\beta}\right)d\beta
 +\phi'_\infty\alpha^\perp(\mathcal X).
$$

For the chapter's

$$
\phi_m(r)=\frac{r^m-mr+m-1}{m(m-1)},
$$

one obtains

$$
\phi'_{m,\infty}=
\begin{cases}
+\infty,&m\geq1,\\
\dfrac1{1-m},&0<m<1.
\end{cases}
$$

Hence singular mass has finite cost for `0<m<1`. For a flat probability target
`\beta=b\mathbf 1_\Omega dx`, the recession contribution combines with the
affine density term to give a constant depending on total mass; the remaining
non-affine part is precisely the relaxed fast-diffusion internal energy. Both
the relaxed divergence and the separately declared hard extension are
geodesically convex, but they are different functionals.

The original McCann theorem is stated for absolutely continuous endpoint
measures; it does not justify the hard extension by lower semicontinuity.
McCann also records a hard `+\infty` lower-semicontinuous extension under
superlinear growth, which is exactly the regime missing here. See
[McCann, *A convexity principle for interacting gases*, Theorem 2.2](https://www.math.utoronto.ca/mccann/papers/advances.pdf).

**Concrete repair.** Choose one of two internally consistent presentations:

1. Use the relaxed recession functional throughout. Then the lower-
   semicontinuity sentence is correct and the power divergences agree with
   Definition `def_divergence`; add `\alpha^\perp(\mathcal X)/(1-m)` for
   `0<m<1`.
2. Retain the hard absolutely-continuous domain. Then explicitly call it a
   restricted extended-valued functional, prove convexity only for finite
   endpoints (the infinite-endpoint cases are trivial), delete the global
   lower-semicontinuity claim, and do not denote it by the book-wide
   `\Divergm_{\phi_m}` for `m<1`.

Also state properness/integrability in the fast-diffusion regime: in
low-dimensional cases the negative internal energy can equal `-\infty` for heavy
tails unless the effective domain is restricted. The phrase “when the energy
is well defined” points in the right direction but does not define that domain.

### F2. The reversible-jump gradient-flow theorem imports a much narrower theorem than its prose suggests

**Severity:** Moderate

**Location:** lines 3005-3072, Section “Nonlocal Wasserstein Flows,” especially
Proposition `prop-nonlocal-entropy-gradient-flow`, lines 3024-3066.

**Current claim.** Under the “regularity and irreducibility assumptions”
imported from Chapter 14, the Markov semigroup of a general reversible kernel is
called the `\mathcal W_K` gradient flow of entropy. The proof idea says that the
metric and geodesic properties recalled from Chapter 14 justify this
identification, and every singular `K` is said to be interpreted by principal
value.

**What is correct.** The formal Onsager calculation has the right orientation
and factor. If `f=d\alpha/d\mathfrak m`, then

$$
\theta(f(x),f(y))(\log f(y)-\log f(x))=f(y)-f(x),
$$

so the nonlocal continuity equation reduces to `\partial_t f=Lf`. No factor two
is missing: the `1/2` in the symmetric edge action is cancelled when the two
orientations are combined.

**Why the rigorous claim is under-specified.** Distance, geodesic existence,
and a formal first variation do not alone identify a semigroup as an EVI flow
or a curve of maximal slope. Erbar's rigorous entropy theorem is for
translation-invariant Levy jump kernels on `\mathbb R^d`, with a smooth,
strictly positive fundamental solution, finite entropy/Fisher information and
integrability assumptions (Assumptions 5.5--5.6), in addition to the earlier
kernel hypotheses. Erbar explicitly restricts the gradient-flow theorem to the
translation-invariant setting. See
[Erbar, *Gradient flows of the entropy for jump processes*](https://www.numdam.org/item/AIHPB_2014__50_3_920_0.pdf).

Warren proves a genuinely nonhomogeneous extension, but still only for
`X=\mathbb R^d` or `\mathbb T^d`, a probability reference `\pi`, and symmetric
kernels satisfying the paper's structural, integrability, and weak-solution
hypotheses. It is not an arbitrary detailed-balance theorem. See
[Warren, *Gradient flow structure for some nonlocal diffusion equations*](https://arxiv.org/abs/2412.20969).
Finite irreducible reversible chains are covered separately by
[Maas, *Gradient flows of the entropy for finite Markov chains*](https://arxiv.org/abs/1102.5238).

The principal-value sentence is also too broad. A symmetric translation-
invariant fractional kernel has the cancellation needed for a principal value.
A general singular reversible kernel may require an explicit compensated Levy
operator or a closed Dirichlet-form definition; detailed balance alone does not
ensure pointwise principal-value convergence.

**Theorem status.** If “the assumptions used in Proposition
`prop-nonlocal-distance-properties`” is read as importing every analytic
assumption of Erbar, the intended translation-invariant result is true but the
local proof is inadequate. If it is read as only metric regularity,
irreducibility, and detailed balance for the displayed general kernel, the
rigorous gradient-flow assertion is unsupported.

**Concrete repair.** State one precise rigorous variant with Erbar's exact
translation-invariant assumptions and cite the entropy gradient-flow theorem,
not only the distance theorem. Label the broader reversible-kernel derivation
formal. Optionally state Warren's nonhomogeneous theorem separately with its
own assumptions. Restrict the principal-value statement to kernels with the
required cancellation, and use a generator/Dirichlet-form formulation in the
general case.

### F3. Differentiability does not make explicit and implicit schemes select the same gradient flow

**Severity:** Moderate

**Location:** lines 34-55, paragraph “Euclidean gradient flows.”

**Current claim.** For differentiable `h`, explicit Euler and the implicit
minimizing-movement step are said to converge as the step tends to zero to the
same gradient-flow trajectory; only uniqueness of each proximal minimizer is
mentioned.

**Counterexample.** Let

$$
h(x)=-\frac23(x_+)^{3/2},\qquad h'(x)=-\sqrt{x_+},
$$

which is `C^1`, and start at `x_0=0`. Explicit Euler remains at zero. The first
implicit step uniquely minimizes

$$
\frac{x^2}{2\tau}-\frac23(x_+)^{3/2}.
$$

Its global minimizer is `x=\tau^2`, since the objective there is
`-\tau^3/6<0`. Subsequent implicit steps choose the immediately departing
solution. Writing `y_k=\sqrt{x_k}` gives

$$
y_{k+1}^2-y_k^2=\tau y_{k+1},
$$

from which the piecewise interpolation converges for positive times to
`x(t)=t^2/4`. The ODE `\dot x=\sqrt{x_+}` has a family of waiting-time
solutions; explicit Euler selects the stationary one and implicit Euler the
maximal immediately departing one. Unique proximal minimizers do not imply a
unique common continuum selection.

**Concrete repair.** Add a standard well-posedness hypothesis, for example
`h\in C^1` with locally Lipschitz gradient on a neighborhood containing all
finite-time trajectories, plus existence and boundedness of the discrete
solutions. A globally Lipschitz gradient is a clean elementary assumption. For
convex nonsmooth `h`, state the implicit result through the maximal-monotone
subdifferential rather than a classical ODE.

### F4. “Smooth first variation” must include a transport chain rule

**Severity:** Minor

**Location:** lines 58-84, Definition `def-first-variation`; lines 169-248,
Definition `def-wasserstein-gradient` and Proposition
`prop-formal-wass-gradient`.

**Current claim.** The first variation is defined along affine mixtures. The
formal Wasserstein-gradient proof applies that same derivative to the
distributional tangent `-\operatorname{div}(\alpha v)` generated by a
push-forward.

**Judgment.** The formula is correct and the proposition is appropriately
labelled formal. The text also explicitly distinguishes vertical and
horizontal perturbations. The remaining gap is logical: an affine directional
derivative against finite signed measures does not by itself imply

$$
\frac d{dt}f(\alpha_t)
=\int\nabla\delta f(\alpha_t)\cdot v_t\,d\alpha_t
$$

for continuity-equation curves, nor does it imply that the spatial gradient is
in `L^2(\alpha_t)`. Thus “smooth first variation” is doing more work than the
preceding definition says.

**Concrete repair.** Add one sentence defining “smooth” here to include the
transport chain rule, boundary integration by parts, and
`\nabla\delta f(\alpha)\in L^2(\alpha)`, or formulate the result with a strong
Wasserstein subdifferential. The additive-constant gauge and every displayed
sign are correct. Authoritative treatments of the distinction are the
[AGS monograph](https://link.springer.com/book/10.1007/b137080) and
[Ambrosio--Gigli, *A user's guide to optimal transport*](https://cvgmt.sns.it/media/doc/paper/195/users_guide-final.pdf).

### F5. The maximal-slope definition does not require the curve to belong to `AC^2`

**Severity:** Moderate

**Location:** lines 293-334, Definitions `def-metric-derivative-ac-curve` and
`def-curve-maximal-slope`, especially lines 323-332.

**Current claim.** Once the local slope is a strong upper gradient, “a curve
`x_t`” is called a curve of maximal slope if it satisfies the integrated
energy-dissipation inequality. The definition does not require that curve to be
absolutely continuous.

**Why this is a real definition error.** In the quadratic AGS theory a curve
of maximal slope belongs to `AC^2` (locally in time when appropriate), its
metric derivative is in `L^2`, and the energy composition has the needed
measurability/absolute-continuity representative. The separate preceding
definition of `AC^p` does not impose membership on the later “a curve.”

Without it, take a nonconstant Cantor function as a curve in `\mathbb R` and a
constant energy. The metric derivative is zero almost everywhere and the slope
is the strong upper gradient zero, so the displayed inequality holds, although
the curve is not absolutely continuous and is not a gradient flow.

The first report also alleged that upper-gradient status was omitted. That was
incorrect: line 323 explicitly conditions the definition on that property.

**Concrete repair.** Require
`x\in AC^2([0,T];\mathcal X)` and the usual measurability conditions, then write

$$
f(x_t)+\frac12\int_s^t|\dot x_r|^2dr
       +\frac12\int_s^t g(x_r)^2dr\leq f(x_s)
$$

for a specified strong upper gradient `g`. State separately when
`g=|\partial f|` or the relaxed slope is a strong upper gradient. See
[Ambrosio--Gigli--Savare, *Gradient Flows*](https://link.springer.com/book/10.1007/b137080),
Chapter 1 and the Wasserstein specialization.

### F6. The higher-order empirical expansion needs one explicit uniform-remainder hypothesis

**Severity:** Minor

**Location:** lines 87-165, Definition
`def-higher-order-vertical-derivatives` and Remark
`rem-higher-order-particle-polynomial`, especially the extrapolated estimate
following `\eqref{eq-higher-order-wasserstein-holder}`.

**Current claim.** For `\alpha_n=n^{-1}\sum_i\delta_{X_i}` and a functional
with sufficiently many bounded centered functional derivatives, the chapter
claims

$$
\|B_nf-f\|_\infty\lesssim
\begin{cases}
r_n^s,&1<s\leq2,\\
n^{-1}+r_n^s,&s>2,
\end{cases}
$$

and, after Richardson extrapolation with `J` sample sizes,
`\|\widetilde B_nf-f\|_\infty\lesssim n^{-J}+r_n^s` when
`s>2J-2`.

**Second-pass judgment.** The first report's concern that compact support gives
only the first moment of `W_p` was a false alarm and is removed. If the support
has diameter `D`, replacing one observation changes the optimal `p`-cost by at
most `D^p/n`: reuse an optimal coupling and move only the mass attached to the
replaced atom. McDiarmid concentration around the mean, together with
`r_n^p\gtrsim n^{-1/2}` as used in the chapter, then yields every fixed moment
needed here, `\mathbb E W_p(\alpha_n,\alpha)^s\lesssim r_n^s` (with constants
depending on `p,s,D`).

The cancellation mechanism is also sound. In
`\nu_n=n^{-1}\sum_i(\delta_{X_i}-\alpha)`, expectations of tensor products are
indexed by set partitions; any block containing a singleton vanishes. Hence a
`k`-linear centered term starts at `n^{-\lceil k/2\rceil}` and has a finite
polynomial expansion in `1/n`. Richardson weights can cancel the first
`J-1` powers.

The remaining issue is narrower. Line 159 explicitly assumes bounded kernels
only through order `2J-2`, whereas the Taylor polynomial in line 137 has order
`\lceil s\rceil-1`, which can be larger. As written, the omitted high-order
terms and the uniformity of the remainder over `\alpha` are not controlled by
the stated hypothesis. The surrounding phrase “derivatives ... are all
bounded” may have been intended to supply this, but the quantifiers are
ambiguous. Also, the cited paper establishes closely related iid functional
expansions under its own linear-functional-derivative and moment assumptions;
it is not a verbatim theorem for the chapter's `W_p`-Holder remainder.

**Concrete repair.** State either:

1. all kernels through the actual Taylor order are uniformly bounded and the
   Taylor remainder is uniform over the displayed class of measures; or
2. a Taylor formula truncated at order `2J-2` whose expected remainder is
   explicitly assumed/proved to be `O(n^{-J}+r_n^s)`.

Then add a short partition-counting lemma and the bounded-difference moment
argument above. The nearest primary results are the first- and second-order iid
bounds in Theorem 2.11 and, more directly, the full static iid weak-error
expansion in Theorem 2.12 of
[Chassagneux--Szpruch--Tse, *Weak quantitative propagation of chaos via differential calculus on the space of measures*](https://doi.org/10.1214/21-AAP1725),
whose [author manuscript](https://arxiv.org/pdf/1901.02556) makes the derivative
and moment hypotheses explicit. In its notation, Theorem 2.12 assumes
linear-functional derivatives through order `2q-1` to obtain a static expansion
with remainder `O(N^{-(q-1)})`; it therefore supports the mechanism but not the
chapter's weaker-looking `2J-2` assumption verbatim. This second pass resolves
the literature-verification question: the chapter's conclusion is defensible,
but one uniform-remainder hypothesis must be written down.

### F7. “Chizat and Bach prove global convergence” omits the theorem's conditional hypotheses

**Severity:** Moderate

**Location:** lines 2577-2580, paragraph immediately before Proposition
`prop-formal-chizat-bach`.

**Current claim.** “Chizat and Bach prove global convergence for the
unregularized, noiseless Wasserstein flow of positively homogeneous models.”

**Judgment.** This reads as an unconditional convergence theorem. The cited
paper's relevant result is conditional: if the Wasserstein flow exists and
converges in `W_2`, then its limit is globally minimizing under the paper's
regularity, homogeneity, support-separation, and Sard-type assumptions. The
paper's support argument rules out convergence to a nonglobal stationary
point; it does not prove that every trajectory converges. The nonsmooth ReLU
case also requires the paper's separate handling/approximation and is not
covered by merely saying “positively homogeneous.”

The formal proposition at lines 2581-2637 is independently correct under its
much stronger full-directional-support hypothesis: Euler's homogeneous
identity turns a negative first-variation direction into a nonzero radial
derivative on the support, contradicting stationarity. The proposition is
properly labelled formal and does not need to be weakened.

The two adjacent literature summaries were also rechecked and do not create
additional findings. Mei--Montanari--Nguyen do prove convergence results for
the noisy, regularized distributional dynamics and its finite-width SGD
approximation, but under their A1--A4 regularity assumptions, positive finite
temperature, a prescribed regularization range, an absolutely continuous
finite-free-energy initialization, and width/step-size conditions. Their
parabolic PDE is smoothing for positive time under the corresponding
nondegenerate regularity assumptions, although their main convergence theorem
does not start from an arbitrary singular law. Rotskoff--Vanden-Eijnden's
long-time and `O(n^{-1})` statements likewise use their function-approximation,
kernel-discriminacy, full-support, and scaling assumptions. Because the chapter
only says that this paper “emphasize[s]” those themes, that sentence is a fair
literature synopsis rather than a second false theorem.

**Concrete repair.** Replace “prove global convergence” by “prove that any
`W_2`-convergent flow has a globally minimizing limit under their regularity,
homogeneity, and support assumptions,” then state or cite those assumptions.
If an actual all-trajectory convergence theorem is intended, supply a distinct
source and its compactness/convergence hypotheses. See Theorem 3.3 and
Assumptions 3.2 in
[Chizat--Bach, *On the global convergence of gradient descent for over-parameterized models using optimal transport*](https://proceedings.neurips.cc/paper_files/paper/2018/file/a1afc58c6ca9540d057299ec3016d726-Paper.pdf).

### F8. Generalized minimizing-movement limits are not automatically curves of maximal slope

**Severity:** Moderate

**Location:** lines 2639-2679, Definition
`def-generalized-action-gradient-flow`, especially lines 2651-2662.

**Current claim.** Definition `def-generalized-action-gradient-flow` calls any
continuous-time limit of the proximal interpolants a generalized action
gradient flow. The next sentence says that “under compactness, coercivity and
lower-semicontinuity assumptions adapted to `d`” those interpolants can
converge to a curve of maximal slope.

**Why this is incomplete.** Compactness/coercivity and lower semicontinuity
are the direct-method ingredients for extracting a generalized
minimizing-movement limit. They do not by themselves identify the limit as a
curve of maximal slope. That promotion requires an actual complete metric (or
an explicitly developed extended-metric theory), a lower-semicontinuity
estimate for the discrete slopes/actions, and an appropriate relaxed slope
that is a strong upper gradient. For a general action-induced distance, one
must also identify the metric derivative with the minimal tangent action. The
later spectral proposition correctly states this last point conditionally; the
generic sentence does not.

This finding absorbs first-pass F11. Calling the discrete construction a
minimizing-movement scheme is common shorthand and is not a separate defect;
the material issue is the missing slope/upper-gradient hypothesis in the
generic convergence sentence.

**Concrete repair.** Say first that compactness, coercivity, and lower
semicontinuity can produce a generalized minimizing movement. Add that it is a
curve of maximal slope only when the relaxed-slope liminf and strong
upper-gradient hypotheses hold (and when `d` is the required complete
metric/extended metric). See the abstract minimizing-movement theory in the
[AGS monograph](https://link.springer.com/book/10.1007/b137080) and the
[Ambrosio--Gigli guide](https://cvgmt.sns.it/media/doc/paper/195/users_guide-final.pdf).

### F9. The conditional-ResNet limit conflates width, depth, and time scalings

**Severity:** Moderate

**Location:** lines 3332-3488, Section `sec-conditional-wasserstein-resnets`, in
particular the finite architecture at lines 3337-3385 and the limiting claims
at lines 3387-3488.

**Current claim.** The chapter presents a finite-depth, finite-width residual
network, introduces a conditional Wasserstein metric, and narrates passage in
width and depth to the displayed Wasserstein gradient flow of the
continuous-depth objective.

**Independent scaling check.** For equal layer widths `n`, the finite metric
corresponding to the chapter's continuum norm is

$$
\|\dot\theta\|^2=\frac1L\sum_{\ell=0}^{L-1}
                 \frac1n\sum_{j=1}^n|\dot\theta_{\ell j}|^2.
$$

Its Riemannian gradient therefore multiplies each ordinary coordinate
derivative by `Ln`. Unequal widths give the layer-dependent factor `Ln_\ell`.
These factors determine the physical training time. They are absent from the
finite-network discussion, so the limiting PDE is not attached to a precise
finite gradient flow or learning-rate scaling.

**Primary-source scope.** The cited Barboni--Peyre--Vialard analysis starts
with a continuous-depth neural ODE and proves a mean-field/finite-width
consistency result under regularity and compact-support assumptions. It
explicitly treats passage from finite-depth ResNets to neural ODEs as a
separate approximation problem. It does not prove the simultaneous finite
width/finite depth limit asserted by a literal reading of this section.

**Concrete repair.** Separate three statements:

1. define the continuous-depth conditional-measure model;
2. state the proved width limit for that model, with its assumptions and
   `n_\ell` training-rate normalization; and
3. label the finite-depth-to-continuous-depth passage as a separate result or
   formal limit, with an order of limits and uniform estimates.

Cite [Barboni--Peyre--Vialard, *Understanding the training of infinitely deep and wide ResNets with conditional optimal transport*](https://doi.org/10.1002/cpa.70004)
([author manuscript](https://arxiv.org/pdf/2403.12887)).

### F10. The Nesterov ODE needs the `t=k\sqrt h` time scaling

**Severity:** Moderate

**Location:** lines 3490-3531, Section `sec-second-order-momentum-flows`,
paragraph “Finite-dimensional momentum.”

**Current claim.** The standard Nesterov recurrence with step size `h` is
immediately followed by “Its scaling limit is”

$$
\ddot x_t+\frac3t\dot x_t+\nabla f(x_t)=0.
$$

**Judgment.** The ODE and the formal `O(t^{-2})` convex-energy rate are correct,
but the limit is not obtained on the ordinary time scale `t=kh`. On that scale
the gradient term vanishes after the second-difference expansion. The
nontrivial scaling is

$$
t=k\sqrt h,
$$

with the discrete initial condition corresponding to `\dot x(0)=0`; the
singular damping at `t=0` also needs to be interpreted through that initial
condition. A rigorous convergence statement requires smoothness and a specified
interpolation (and usually works away from `t=0` before taking the compatible
limit).

**Concrete repair.** Insert the scaling `t=k\sqrt h`, state the initial
condition and regularity level, and call the calculation formal unless a
discrete-to-continuous convergence theorem is quoted. See
[Su--Boyd--Candes, *A differential equation for modeling Nesterov's accelerated gradient method*](https://jmlr.org/papers/volume17/15-084/15-084.pdf),
Section 2.

### F12. The multispecies entropy specialization uses an undefined density symbol

**Severity:** Minor

**Location:** lines 732-793, paragraph “Multi-species gradient flows,”
especially equations `\eqref{eq-multispecies-composition-constraint}` and
`\eqref{eq-multispecies-modified-heat}`.

**Current claim.** The reference measure is introduced as
`\beta=\density{\beta}\,dx`, but the pressure equation is subsequently written

$$
\operatorname{div}(b\nabla\lambda_t)=\Delta b
$$

and the next sentence assumes “`b` is constant.” The symbol `b` is never
defined.

**Judgment and derivation.** This is a notation error, not a sign error. From
`\sum_i\rho_i=\density{\beta}` and
`\partial_t\rho_i=\operatorname{div}(\rho_i\nabla(\phi_i-\lambda))`, summing
and imposing zero time derivative gives

$$
\operatorname{div}(\density{\beta}\nabla\lambda)
=\operatorname{div}\!\left(\sum_i\rho_i\nabla\phi_i\right).
$$

For `\phi_i=\log\rho_i+1`, the right side is
`\sum_i\Delta\rho_i=\Delta\density{\beta}`. Thus both occurrences of `b`
should be `\density{\beta}`, or `b:=\density{\beta}` must be declared.

**Concrete repair.** Define `b=\density{\beta}` before the equations and state
periodic or no-flux boundary conditions. The assertion that constant `b`
allows constant pressure otherwise also needs the usual connectedness and
boundary convention; the PDE itself is correct.

### F13. The potential/KL examples overstate their domains of validity

**Severity:** Minor

**Location:** lines 1692-1710, Remark
`ex-homogeneous-wasserstein-kl`, especially lines 1695-1701.

**Current claim.** For smooth bounded-below `V`, the formal slope is
`|\partial f_V|^2=\int|\nabla V|^2d\alpha`, and the pointwise KL inequality is
said to be equivalent to the measure inequality “for every probability
measure `\alpha`.”

**Judgment.** The exponent and Jensen argument are correct. The universal
domain wording is not. The energy, the gradient integral, or both can be
infinite for a general probability measure; in this chapter the ambient
metric is normally `\mathcal P_2`, not all of `\mathcal P`. On a domain with a
boundary, the Wasserstein slope also uses the admissible/tangential gradient
unless the no-boundary setting or compatible boundary conditions are stated.
The exact slope formula requires standard growth, lower-semicontinuity, and
subdifferential hypotheses; it is only formal at the stated level.

**Concrete repair.** Replace “every probability measure” by measures in
`\mathcal P_2` for which `f_V` and `\nabla V` have the required integrability,
and specify `\mathbb R^d` (or the boundary convention). Retain “formal slope”
unless the hypotheses ensuring the strong subdifferential formula are added.
The displayed KL exponent `\theta=(q-1)/q` and rate
`O(t^{-q/(q-2)})` for `q>2` need no change.

### F14. The stationary-positive-density proposition needs topology and domain hypotheses

**Severity:** Minor

**Location:** lines 2502-2575, Proposition
`prop-classical-convex-stationary` and its proof.

**Current claim.** A convergent Wasserstein gradient flow whose limit has a
strictly positive density is globally minimizing, under affine convexity and
the displayed lower-semicontinuity assumption on the squared slope.

**Judgment.** The argument is mathematically sound under its intended smooth
interpretation, so the first report's concern is narrowed rather than promoted.
However, “converges” has no topology, “a Wasserstein gradient flow” does not
state whether the energy-dissipation identity or only an inequality is
available, and `\Omega` is merely connected. To infer from

$$
\int_\Omega|\nabla\delta f(\alpha_\infty)|^2\rho_\infty dx=0
$$

that the continuous gradient vanishes everywhere and then that the first
variation is constant, one needs a connected open domain (or a comparably
explicit regular domain) and positivity almost everywhere with respect to
Lebesgue measure. The affine subgradient inequality also presupposes that the
displayed first variation is valid along every feasible segment to a
competitor of finite energy.

**Concrete repair.** Specify convergence in `W_2` (or the actual topology),
assume an `AC^2` energy-dissipation solution, take `\Omega` connected and open,
and state the differentiability/domain condition needed for the convex
subgradient inequality. “Energy-dissipation inequality” is sufficient: its
integrated dissipation plus the lower bound still furnishes a sequence of
times with slope tending to zero. No stronger theorem is needed.

### F15. WFR reaction does not create mass at exact vacuum

**Severity:** Minor

**Location:** lines 3283-3313, Example `ex-wfr-kl-flow`, especially line 3312.

**Current claim.** In the WFR relative-entropy flow, the reaction term
“creates [mass] where `\rho_t<\density{\beta}`.”

**Judgment.** The first variation and the PDE

$$
\partial_t\rho
=\Delta\rho-\operatorname{div}(\rho\nabla\log\density{\beta})
-\kappa^{-2}\rho\log(\rho/\density{\beta})
$$

have the correct signs and factor `\kappa^{-2}` for the chapter's action
normalization. But the reaction rate tends to zero as `\rho\downarrow0`, since
`\rho\log\rho\to0`; it does not nucleate mass at an exact vacuum. For the pure
reaction equation and `\rho_0>0`,

$$
\rho_t=\density{\beta}
\left(\frac{\rho_0}{\density{\beta}}\right)^{e^{-t/\kappa^2}},
$$

whereas the zero solution remains zero on an initially vacant point. In the
full equation, diffusion can fill vacuum under appropriate positivity and
parabolic hypotheses. The logarithm also presupposes
`\density{\beta}>0` on the relevant set.

**Concrete repair.** Say that the reaction amplifies *positive but
underrepresented* density and attenuates overrepresented density; attribute
instantaneous filling, when valid, to diffusion. Add the positivity/domain
convention for `\beta`. The dynamic normalization agrees with
[Chizat--Peyre--Schmitzer--Vialard, *Unbalanced optimal transport: dynamic and Kantorovich formulations*](https://arxiv.org/abs/1508.05216).

### F16. Secondary versions retain a stale, ill-typed pairing

**Severity:** Minor (source drift only; no error in the authoritative chapter)

**Location:** authoritative lines 2594-2600 in the proof of Proposition
`prop-formal-chizat-bach`; corresponding arXiv source line 2598 and MyST source
near line 3905.

**Current authoritative claim.** The first variation is correctly written as
the dual pairing

$$
h_\alpha(x)=DJ(G_\alpha)[\psi(x,\cdot)],
$$

with an `L^2(\zeta)` inner-product representation only when a Riesz
representative exists.

**Drift.** The arXiv LaTeX still writes an inner product against an undefined
`\rho`; the MyST version writes an `L^2(\zeta)` pairing without stating the
Riesz assumption. The authoritative text has already made the mathematically
correct repair, so this must not be counted as a Chapter 15 source error.

**Concrete repair.** Propagate authoritative lines 2594-2600 to both secondary
sources. No change to the chapter is required.

### F17. “Zero mean” does not fix higher-variation gauges without a reference measure

**Severity:** Minor

**Location:** lines 87-113, Definition
`def-higher-order-vertical-derivatives` and the paragraph immediately after it.

**Current claim.** Integral kernels of the multilinear vertical derivatives
can have their gauge fixed “by requiring zero mean in each spatial variable.”

**Why this is ambiguous.** A mean is defined relative to a measure, but none
is specified. Moreover, on `\mathcal M_0(\mathcal X)^j` the null gauge is
larger than an additive constant: adding any kernel term that omits at least
one coordinate gives zero after integration against the corresponding
zero-mass argument. A normalization such as

$$
\int K_\alpha(x_1,\ldots,x_j)\,d\alpha(x_i)=0
\quad\text{for every }i
$$

fixes a canonical centered representative only after the centering measure
`\alpha` (or another reference probability) and its dependence on the base
point have been declared.

**Concrete repair.** Specify the centering measure and state the full gauge
class. If centering with the current base measure, write the condition above
and note that kernels at different base points use different normalizations.
This also makes the centered-partition calculation in the empirical expansion
unambiguous.

### F18. Entropy flow is not categorically “no longer a deterministic push-forward”

**Severity:** Minor

**Location:** lines 400-405, transition into the paragraph “Shannon
neg-entropy.”

**Current claim.** “Entropy gives the opposite benchmark: the flow is no
longer a deterministic push-forward of particles, but a diffusion of
density.”

**Judgment.** The intended contrast with independent particles following the
fixed ODE `\dot x=-\nabla h(x)` is useful, but the literal dichotomy is too
strong. For a smooth positive heat-flow density,

$$
\partial_t\rho+\operatorname{div}(\rho v)=0,
\qquad v=-\nabla\log\rho,
$$

so whenever this velocity generates a sufficiently regular flow, the solution
is a deterministic, density-dependent push-forward of its initial absolutely
continuous measure. What fails is an independent particle ODE with a velocity
fixed independently of the evolving law; a deterministic map also cannot
spread a Dirac mass into the heat kernel.

**Concrete repair.** Replace the sentence by: “Entropy no longer gives
independent particles driven by a fixed vector field; it gives diffusion, or
formally a continuity equation with the density-dependent score velocity.”
The heat equation and score sign in the following display are correct.

## Established errors versus literature questions

All 17 findings above are established textual conclusions; none rests on an
unresolved recollection of the literature. They fall into the following
categories.

| Finding | Mathematical status after second pass |
|---|---|
| F1 | True extended-valued convexity theorem, but an invalid lower-semicontinuity proof and an inconsistent divergence convention. |
| F2 | Correct formal identity; rigorous theorem stated beyond the hypotheses supplied by the cited source. |
| F3 | False convergence statement, with an explicit counterexample. |
| F4 | Correct formal formula; the named smoothness assumption is not defined strongly enough to imply it. |
| F5 | False definition because `AC^2` membership is absent. |
| F6 | Correct expansion mechanism; one uniform boundedness/remainder quantifier is ambiguous. |
| F7 | Correct formal homogeneity proposition; false unconditional summary of a conditional convergence theorem. |
| F8 | Generalized minimizing-movement existence and maximal-slope identification are conflated at the hypothesis level. |
| F9 | Correct formal conditional geometry; the cited paper proves a narrower width limit and the finite training-time scaling is unspecified. |
| F10 | Correct limiting ODE, but an incomplete limit statement because the essential time scaling is absent. |
| F12 | Undefined symbol and omitted boundary convention; signs are correct. |
| F13 | Correct inequalities on their effective domains; universal domain wording is false. |
| F14 | True proposition under standard topology/domain/EDI assumptions, which should be stated. |
| F15 | Correct WFR PDE; false literal description at exact vacuum. |
| F16 | Established secondary-source drift only. |
| F17 | Genuine gauge ambiguity, resolved by naming a centering measure. |
| F18 | Misleading categorical interpretation; the following PDE is correct. |

### Questions not counted as additional findings

No first-pass literature item remains unresolved. In particular, F6 is no
longer marked “needs stronger literature verification”: the iid partition
expansion is established, and the exact missing assumption is identified.

Two possible *new theorems* would still need sources if the author wants to
state them, but this does not make the audit findings uncertain. A simultaneous
finite-depth/finite-width ResNet limit is not supplied by the cited Barboni--
Peyre--Vialard paper, and a fully general state-dependent reversible-jump EVI
theorem is not supplied by Erbar. The safe repairs are to state the narrower
proved results; alternatively, the author must formulate the desired stronger
theorem with exact assumptions before searching for a source.

## Delicate claims re-derived and found correct

The following checks record the claims that survived the second pass. “Correct”
here always retains any formal/smooth qualification already made in the
chapter and does not erase the local caveats in F1--F18.

### First-order Wasserstein calculus and PDEs

1. **JKO coefficient.** Lines 24-31 correctly use
   `W_2^2/(2\tau)`. With a displacement `\tau v`, the local objective is
   `\tau(\|v\|_{L^2(\alpha)}^2/2+\langle\nabla\delta f,v\rangle)`, whose
   minimizer is `v=-\nabla\delta f`. No factor two is missing.
2. **Empirical metric normalization.** Lines 371-379 and 3536-3568 correctly
   use `n^{-1}\sum_i|\dot x_i|^2`. Its metric gradient is `n` times the
   ordinary coordinate gradient of `F(X)=f(n^{-1}\sum_i\delta_{x_i})`, hence
   `\dot x_i=-n\nabla_{x_i}F`.
3. **Horizontal derivative sign.** The push-forward expansion
   `(Id+\tau v)_\#\alpha=\alpha-\tau\operatorname{div}(\alpha v)+o(\tau)`
   and integration by parts give
   `Df(\alpha)[-\operatorname{div}(\alpha v)]
   =\int\nabla\delta f\cdot v\,d\alpha`. Thus
   `\partial_t\alpha=\operatorname{div}(\alpha\nabla\delta f)` is steepest
   descent, as written.
4. **Potential flow.** For `f(\alpha)=\int h\,d\alpha`, the velocity is
   `-\nabla h`; lines 387-398 have the correct continuity-equation sign.
5. **Entropy and porous medium.** For `\int g(\rho)dx`,
   `\partial_t\rho=\operatorname{div}(\rho g''(\rho)\nabla\rho)
   =\Delta P(\rho)` with `P'(r)=rg''(r)`. Thus `g=r\log r` gives heat and
   `g=r^m/(m-1)` gives exactly `\Delta\rho^m`, with no extra `m`.
6. **Interaction factors.** For the chapter's unhalved energy
   `\iint k\,d\alpha d\alpha`, symmetry gives first variation
   `2\int k(x,y)d\alpha(y)` and particle force `-(2/n)\sum_j\nabla_xk`.
   For the later halved convention, the factor two disappears. Both uses are
   internally consistent.
7. **Langevin normalization.** Noise `\sqrt2\sigma\,dB_t` yields
   `\sigma^2\Delta\rho`; adding `\sigma^2\int\rho\log\rho` to the energy
   gives the same coefficient. The target-score velocity in
   `\eqref{eq-relative-entropy-three-representations}` has the correct sign.
8. **Density cap.** The complementarity system uses
   `v=-\nabla(h+p)`, hence
   `\partial_t\rho=\operatorname{div}(\rho\nabla(h+p))`; `p\geq0` on the
   saturated set has the correct orientation.
9. **Multispecies geometry.** The factor
   `m_iW_2^2(\alpha_i/m_i,\eta_i/m_i)` equals the kinetic action
   `\int|v_i|^2d\alpha_i`. Consequently
   `\partial_t\rho_i=\operatorname{div}(\rho_i\nabla\phi_i)` has no mass
   prefactor. Summing the constrained equations gives the pressure sign in
   lines 780-785; only the undefined `b` in F12 is wrong.

### Convexity, dissipation, and rates

10. **Basic displacement convexity constants.** A `\lambda`-strongly convex
    `k`-particle integrand gives `k\lambda` before any scalar prefactor. For
    `\frac12\iint W`, a `\lambda`-strongly convex `W` therefore gives exactly
    `\lambda`-geodesic convexity, as lines 847-882 state.
11. **One-dimensional interaction criterion.** Quantiles make
    `Q_t(r)-Q_t(s)` affine and nonnegative for `r>s`, proving the iff criterion
    for `\varphi(|x-y|)`. For `\varphi(r)=-r`, the self term is affine and the
    target cross term is convex, so squared energy distance is displacement
    convex in one dimension.
12. **McCann transform and threshold.** For
    `g_m(s)=s^m/(m-1)`, the transform is proportional to
    `r^{d(1-m)}/(m-1)`. In the fast-diffusion range it is convex and
    nonincreasing exactly when `d(1-m)\leq1`, i.e.
    `m\geq1-1/d`. Entropy gives `-d\log r`. These thresholds are correct.
13. **Power divergences to structured targets.** For `m>1` and
    `\beta\propto e^{-V}`, the nonconstant term is
    `\int\rho^m e^{(m-1)V}`. Along a Brenier geodesic its Lagrangian integrand
    is the exponential of `(m-1)(V(T_t)-\log J_t)`, a convex function of time
    when `V` is convex. The KL endpoint splits into entropy plus potential and
    inherits the stated `\lambda`.
14. **Hellinger counterexample.** `\phi_H=\phi_{1/2}/2`, and for Gaussian
    translations the divergence is `2(1-e^{-m^2/8})`; its second derivative is
    `\frac12e^{-m^2/8}(1-m^2/4)`. The target-dependent failure of convexity is
    therefore correctly demonstrated.
15. **Density-cap geodesics.** Concavity of `\det^{1/d}` yields
    `\rho_t(T_t)^{-1/d}\geq(1-t)\rho_0^{-1/d}+t\rho_1(T)^{-1/d}`; a common
    upper cap is preserved. Convexity of the spatial domain keeps the
    interpolation inside it.
16. **Squared-distance semiconcavity.** Gluing an optimal midpoint-to-target
    coupling to the endpoint geodesic and using the Euclidean parallelogram
    identity gives exactly the correction
    `t(1-t)W_2^2(\alpha_0,\alpha_1)`, i.e. the chapter's `2`-semiconcavity
    convention. Integrating projections gives the correct sliced factor `1/d`.
17. **Finite-length constants.** Exact dissipation gives
    `\int_s^t|\dot\alpha|\leq\sqrt{t-s}\sqrt{f_s-f_t}`. The quadratic EDI
    controls only half the speed integral and therefore introduces exactly
    `\sqrt2`.
18. **Convex `O(1/t)` rate.** The first variation of
    `W_2^2(\alpha_t,\alpha^*)/2` has the sign used in lines 1366-1372.
    Integrating the EVI-type inequality and using energy monotonicity gives
    `(f(\alpha_t)-f_*)\leq W_2^2(\alpha_0,\alpha^*)/(2t)`.
19. **PL energy and distance rates.** From
    `|\partial f|^2\geq2\kappa E` and `E'=-|\partial f|^2`, one gets
    `E(t)\leq e^{-2\kappa(t-s)}E(s)`. Dividing the dissipation by
    `|\partial f|\geq\sqrt{2\kappa E}` gives tail length
    `\sqrt{2/\kappa}\sqrt{E(t)}` and hence the correct distance rate
    `e^{-\kappa t}` and distance-to-`Argmin` bound.
20. **Strong convexity implies PL.** Along a geodesic to a minimizer,
    `|\partial f|\geq E/r+(\lambda/2)r`; maximizing
    `|\partial f|r-(\lambda/2)r^2` gives
    `|\partial f|^2\geq2\lambda E`. The constant is correct.
21. **KL polynomial exponents.** If `|\partial f|\geq cE^\theta` with
    `1/2<\theta<1`, integration of
    `E'\leq-c^2E^{2\theta}` gives energy exponent
    `1/(2\theta-1)`. The tail-distance exponent is
    `(1-\theta)/(2\theta-1)`, and the coefficient
    `1/[c(1-\theta)]` is correct.
22. **Powers of PL energies.** For `f=g^r`, the chain rule gives exponent
    `\theta=1-1/(2r)` and energy rate `t^{-r/(r-1)}`. For moments
    `\int|x|^q`, this becomes `\theta=(q-1)/q` and
    `t^{-q/(q-2)}`. The same exponents for distance powers are correct on the
    stated formal domains.
23. **Homogeneous interactions.** Symmetrization gives
    `\int G_\alpha\cdot(x-\bar x)d\alpha=qf`; Jensen gives
    `\int|x-\bar x|^q d\alpha\leq2f`. Holder and Cauchy--Schwarz yield the
    stated constant `q2^{-1/q}`.
24. **Ricci/entropy constant.** On a compact smooth manifold without
    boundary, `\operatorname{Ric}\geq\lambda g` is equivalent to
    `\lambda`-displacement convexity of entropy relative to volume, with the
    chapter's `-\lambda t(1-t)W_2^2/2` convention.

### Functional inequalities

25. **Brunn--Minkowski and isoperimetry.** The determinant-concavity proof
    gives the `1/d` volume power, and differentiating
    `|A+\varepsilon B_1|` gives the sharp coefficient
    `d\omega_d^{1/d}|A|^{(d-1)/d}`.
26. **Prekopa--Leindler.** The determinant estimate
    `\det((1-t)I+tDT)\geq\det(DT)^t` and the Monge--Ampere ratio produce
    `U^{1-t}V^t` with no missing normalization.
27. **Fisher information and LSI convention.** The identity
    `I=4\int|\nabla\sqrt h|^2d\beta
    =\int|\nabla\log h|^2d\alpha` is correct, and
    `KL\leq I/(2\lambda)` is exactly PL with constant `\lambda`.
28. **Entropy decay.** Along Fokker--Planck,
    `d KL/dt=-I`; LSI gives `e^{-2\lambda t}` entropy decay. Combining this
    with the PL tail bound gives
    `W_2(\alpha_t,\beta)\leq\sqrt{2KL(\alpha_0|\beta)/\lambda}
    e^{-\lambda t}`.
29. **Gaussian LSI.** The map direction `T_\#(\rho\gamma)=\gamma`, the
    Monge--Ampere sign, and Gaussian integration by parts are all consistent.
    Translation tilts attain equality, confirming the sharp `\lambda=1`.
30. **Poincare linearization.** For `h_\varepsilon=1+\varepsilon\xi`,
    `KL=(\varepsilon^2/2)\int\xi^2+o(\varepsilon^2)` and
    `I=\varepsilon^2\int|\nabla\xi|^2+o(\varepsilon^2)`. Thus LSI yields
    `\lambda\operatorname{Var}_\beta\xi\leq\int|\nabla\xi|^2d\beta` with
    no factor two.
31. **Other linearizations.** The `\phi`-divergence Hessian factor
    `\phi''(1)`, the squared-slope factor `\phi''(1)^2`, the MMD factors `2`
    and `4`, and the squared-Wasserstein negative-Sobolev factors `2` and `4`
    all follow from the definitions at lines 2083-2094.
32. **Talagrand `T_2`.** The Gaussian transport proof yields
    `W_2^2/2\leq KL`; translations establish sharpness.
33. **HWI.** `\lambda`-convexity of relative entropy along the geodesic from
    `\alpha` to `\beta`, followed by Cauchy--Schwarz, gives
    `H\leq W\sqrt I-(\lambda/2)W^2`. Maximizing in `W` for `\lambda>0`
    recovers `H\leq I/(2\lambda)`.

### Neural, generalized, nonlocal, unbalanced, and inertial flows

34. **Two-layer mean-field first variation.** Differentiating through the
    predictor gives the dual pairing in
    `\eqref{eq-mlp-first-variation-general}`. For square loss, expansion gives
    exactly the halved quadratic kernel plus the linear teacher potential.
35. **Formal two-homogeneous optimality.** With the authoritative dual
    pairing, `h_\alpha(\lambda x)=\lambda^2h_\alpha(x)`. Euler's radial
    identity and full directional support give the contradiction claimed in
    Proposition `prop-formal-chizat-bach`.
36. **`W_p` PMO duality.** Minimizing
    `\langle u,w\rangle+\|w\|_p^2/2` gives
    `w=-\|u\|_q^{2-q}|u|^{q-2}u`, with `q=p/(p-1)`. Its `L^p` norm is
    `\|u\|_q`, confirming every exponent in `\eqref{eq-wp-pmo}`.
37. **Mobility flow.** The velocity action is
    `\int\rho^2|w|^2/\theta(\rho)dx`; minimization gives
    `w=-\theta(\rho)u/\rho` and flux `-\theta(\rho)u`. Entropy with
    `\theta(\rho)=\rho^\gamma` yields
    `(1/\gamma)\Delta\rho^\gamma`, as stated.
38. **Spectral inverse-trace formula.** The polar representation and the
    first-order condition on the active polar matrix give
    `v=-(A^*)^{-1}g`. For the operator gauge,
    `A^*=S^{1/2}/\operatorname{tr}S^{1/2}` and
    `v=-\operatorname{tr}(S^{1/2})S^{-1/2}g`; range inverses handle singular
    `S`.
39. **Muon matrix factor.** For `G=U\Sigma W^T`, minimizing
    `\operatorname{tr}(G^TV)+\|V\|_{op}^2/2` along the polar direction gives
    `V=-\|G\|_*UW^T`. The pseudoinverse expression in line 2980 is exactly
    the same partial polar factor.
40. **Nonlocal formal entropy flow.** The logarithmic-mean identity cancels
    the entropy difference and the two edge orientations cancel the action's
    `1/2`, giving `\partial_t\rho=L\rho`. F2 concerns rigor, not this formula.
41. **Fractional and Levy scalings.** The kernel
    `c_{d,s}|x-y|^{-d-s}` generates `-(-\Delta)^{s/2}`. Scaling an
    `s`-stable Levy process by `\sigma` multiplies its generator by
    `\sigma^s`, matching `\eqref{eq-fractional-fokker-planck}`.
42. **Finite Markov chains.** Detailed balance and
    `\theta(a,b)(\log a-\log b)=a-b` yield
    `\dot\rho_i=\sum_jK_{ij}(\rho_j-\rho_i)` and the equivalent mass forward
    equation with the displayed orientation.
43. **WFR factors.** For tangent norm
    `\int(|v|^2+\kappa^2g^2)\rho`, the Riesz representative of the first
    variation is `(\nabla\phi,\phi/\kappa^2)`. Steepest descent therefore gives
    the transport term plus reaction `-\rho\phi/\kappa^2`, and dissipation has
    the same `\kappa^{-2}` factor. No factor `2` or `4` is missing relative to
    Chapter 14's cone normalization.
44. **Conditional distance and matching.** Integrating fiberwise squared
    `W_2` over depth gives the metric in line 3420. Fixed labels define a
    feasible coupling, so the labelled squared parameter distance indeed
    upper-bounds the optimized conditional distance.
45. **Heavy-ball limit.** The semi-implicit recurrence at lines 3505-3509 uses
    the ordinary `t=kh` scaling and converges formally to
    `\ddot X+\lambda_{fric}\dot X+\nabla F=0`. This is distinct from the
    Nesterov scaling defect in F10.
46. **Mechanical energy.** With kinetic energy
    `(2n)^{-1}\sum_i|s_i|^2`, the force contribution cancels
    `dF/dt`, leaving exactly
    `-(\lambda_{fric}/n)\sum_i|s_i|^2`; the undamped energy is conserved.
47. **Liouville signs.** Characteristics
    `\dot x=s`, `\dot s=-\lambda_{fric}s+v_\alpha(x)` give the two positive
    divergence terms in `\eqref{eq-second-order-liouville-density}`. The
    position marginal is correctly coupled back into the force.
48. **Gravity and MMD forces.** For `k=-G/|x-y|`,
    `-\nabla_xk=G(y-x)/|x-y|^3`. For `k=-|x-y|` in the squared MMD,
    `-\nabla\delta f=2\int(x-y)/|x-y|\,d(\alpha-\beta)(y)`. Both signs and
    factors are correct.
49. **Entropy-driven phase space.** The formal score acceleration is
    `-\nabla\log\rho`; adding `V(x)=|x|^2/2` adds `-x`. The displayed
    phase-space equation and the overdamped Ornstein--Uhlenbeck equation have
    consistent signs. The text correctly warns that entropy has no finite
    empirical lift without a density/score closure.

## Complete coverage table

The table covers every section, named paragraph, formal definition/result,
and intervening major derivation. Figure-only intervals are included with the
mathematical paragraph they illustrate unless a caption makes a separate
claim.

| Lines | Section, paragraph, or result | Status | Audit conclusion |
|---:|---|---|---|
| 3-14 | Chapter introduction | Correct | Accurate roadmap; no theorem claim. |
| 15-33 | “Minimizing Movements and Wasserstein Gradients”; Definition `def-jko-minimizing-movement` | Correct | JKO normalization and interpolation are standard; the terminology is harmless shorthand. |
| 34-57 | “Euclidean gradient flows” | Contains error | Explicit and implicit convergence needs ODE well-posedness; F3. |
| 58-86 | “Vertical derivatives”; Definition `def-first-variation` | Needs clarification | The vertical definition is correct, but later use needs the transport chain rule; F4. |
| 87-114 | Definition `def-higher-order-vertical-derivatives` | Needs clarification | Multilinear definition is sound; kernel gauge needs a centering measure; F17. |
| 115-168 | Remark `rem-higher-order-particle-polynomial` | Needs clarification | Expansion and rates are defensible; uniform high-order remainder quantifier is ambiguous; F6. |
| 169-255 | “Horizontal derivative”; Definition `def-wasserstein-gradient`; Proposition `prop-formal-wass-gradient` | Needs clarification | Every displayed sign is correct and the proposition is formal; define “smooth” strongly enough; F4. |
| 256-292 | “From the JKO step to the velocity field” | Correct | Correct first-order expansion and explicit formal/rigorous distinction. |
| 293-341 | “Metric derivative and curves of maximal slope”; Definitions `def-metric-derivative-ac-curve`, `def-curve-maximal-slope` | Contains error | Maximal-slope curve is not required to lie in `AC^2`; F5. |
| 342-370 | Example `ex-single-cell-gradient-flow` and JKO figure | Correct | Drift/diffusion coefficient and modeling qualifications are consistent. |
| 371-381 | “Discrete evolutions” | Correct | Empirical metric supplies the factor `n`. |
| 382-399 | “Linear functionals” | Correct | Potential-flow sign and independent-particle interpretation are correct. |
| 400-409 | “Shannon neg-entropy” transition and Definition `def-score-function` | Contains error | Score definition is correct; deterministic-push-forward dichotomy is too categorical; F18. |
| 410-466 | Entropy/porous-medium example, Remark `rem-two-interpretations-heat-equation`, figures | Correct | First variations, pressures, PDE signs, and coefficients are correct. |
| 467-585 | “Interaction energies” and MMD/discrepancy figures | Correct | Factors `2`, teacher-potential sign, and kernel interpretations are consistent under the stated smooth reading. |
| 586-672 | “Stochastic particles and McKean--Vlasov limits” | Correct | `\sqrt2\sigma`, Fokker--Planck, entropy, and target-score constants agree. |
| 673-731 | “Gradient flows under density constraints” | Correct | JKO constraint, normal cone, pressure sign, complementarity, and cap condition are correct. |
| 732-813 | “Multi-species gradient flows” | Contains error | Product metric and PDEs are correct, but `b` is undefined and boundary data are omitted; F12. |
| 814-846 | “Geodesic Convexity and Convergence”; geodesics and Definition `def-geodesic-convexity` | Correct | Coupling geodesics and `\lambda/2` convention are correct. |
| 847-888 | Proposition `prop-basic-geodesic-convexity` | Correct | Product strong-convexity factors, including the halved interaction case, are correct. |
| 889-966 | Proposition `prop-1d-interaction-halfline-convex` and discussion | Correct | Quantile proof and one-dimensional energy-distance conclusion are correct. |
| 967-1016 | Theorem `thm-mccann-internal-energy` | Contains error | Convexity conclusion survives, but the general lower-semicontinuity proof does not; F1. |
| 1017-1067 | Proposition `prop-power-divergences-geodesic-convexity` | Contains error | Thresholds/proofs are correct on the chosen hard domain; notation conflicts with the global recession convention for `m<1`; F1. |
| 1068-1110 | Remark `rem-phi-divergence-geodesic-convexity` | Needs clarification | Target-dependent convexity and Gaussian counterexample are correct; singular recession convention must be reconciled; F1. |
| 1111-1139 | “Geodesically convex constraints”; Proposition `prop-density-cap-geodesic-convex` | Correct | Determinant proof and convex-domain hypothesis are adequate. |
| 1140-1175 | Example “Squared Wasserstein distance need not be geodesically convex” | Correct | Couplings and costs `1/2,1/2,1` check exactly. |
| 1176-1222 | Remark `rem-target-discrepancies-semiconcave` | Correct | `2`-semiconcavity and sliced `1/d` correction are correct. |
| 1223-1307 | “Dissipation and finite metric length”; Proposition `prop-gradient-flow-finite-length` | Correct | Exact and EDI `\sqrt2` length constants are correct. |
| 1308-1383 | Proposition `prop-convex-wass-flow-rate` | Correct | Dissipation sign, distance derivative, and `1/(2t)` rate are correct under the explicit formal assumptions. |
| 1384-1402 | “Wasserstein--PL viewpoint” preamble | Correct | Smooth slope interpretation is properly qualified. |
| 1403-1419 | Definition `def-wasserstein-pl` | Correct | Factor `2\kappa` matches all later rates. |
| 1420-1517 | Theorem `thm-wasserstein-pl-convergence` and proof | Correct | Energy, tail length, limit, and distance-to-`Argmin` estimates all check. |
| 1518-1567 | Strong convexity; Proposition `prop-strong-geodesic-convexity-implies-pl`; classical examples | Correct | PL constant and `e^{-2\lambda t}`/`e^{-\lambda t}` rates are correct. |
| 1568-1596 | KL discussion and Definition `def-wasserstein-kl` | Correct | Desingularizing function and regime split are correct. |
| 1597-1657 | Theorem `thm-wasserstein-kl-sublinear` | Correct | Energy and distance exponents and coefficients are correct. |
| 1658-1691 | Proposition `prop-powers-pl-are-kl` | Correct | Chain-rule exponent and `t^{-r/(r-1)}` rate are correct. |
| 1692-1711 | Remark `ex-homogeneous-wasserstein-kl` | Needs clarification | Moment/distance exponents are correct; effective domain and boundary setting are overstated; F13. |
| 1712-1728 | Remark `rem-homogeneous-interaction-kl` | Correct | Symmetrization and constant `q2^{-1/q}` are correct. |
| 1729-1762 | “Convexity and curvature”; Theorem `thm-ricci-entropy-convexity` | Correct | Smooth compact boundaryless theorem has the right equivalence and constant. |
| 1763-1772 | “Functional Inequalities via Optimal Transport” introduction | Correct | Scope and smooth-approximation level are stated. |
| 1773-1845 | Brunn--Minkowski; Proposition `prop-ot-brunn-minkowski-isoperimetric` | Correct | Determinant, volume, perimeter, and sharp constants are correct. |
| 1846-1891 | Prekopa--Leindler; Proposition `prop-ot-prekopa-leindler` | Correct | Jacobian proof and normalization are correct. |
| 1892-1915 | LSI paragraph and Definition `def-relative-fisher-lsi` | Correct | Fisher-information identity and `1/(2\lambda)` convention are correct. |
| 1916-1933 | Proposition `prop-curvature-log-sobolev` | Correct | HWI optimization gives the stated Bakry--Emery constant. |
| 1934-1955 | Remark `rem-lsi-wasserstein-pl` | Correct | Relative Fisher information equals the formal squared Wasserstein slope. |
| 1956-1999 | Proposition `prop-lsi-entropy-decay` | Correct | Fokker--Planck sign and entropy/distance rates are correct. |
| 2000-2073 | Gaussian LSI; Proposition `prop-gaussian-log-sobolev-ot` | Correct | Monge--Ampere signs, integration by parts, and sharp translation case are correct. |
| 2074-2096 | “Poincare as a linearized Wasserstein--PL inequality” | Correct | Definitions of quadratic energy and slope forms have consistent factors. |
| 2097-2125 | Proposition `prop-linearized-pl-functional-inequality` | Correct | Dividing PL by `\varepsilon^2` gives exactly `\kappa H\leq D`. |
| 2126-2140 | Example `ex-linearized-phi-divergence-forms` | Correct | Factors `\phi''(1)` and `\phi''(1)^2` are correct. |
| 2141-2167 | Example `ex-linearized-mmd-forms` | Correct | Hessian factor `2` and slope factor `4` are correct. |
| 2168-2188 | Example `ex-linearized-wasserstein-forms` | Correct | Negative-Sobolev factors `2` and `4` are correct. |
| 2189-2201 | KL expansion before Poincare proposition | Correct | Taylor coefficients have no missing factor. |
| 2202-2243 | Proposition `prop-poincare-linearized-wasserstein-pl` | Correct | Poincare constant is `\lambda`, not `2\lambda`. |
| 2244-2274 | Spectral-gap and frozen-mobility interpretation | Correct | Weighted generator sign and nonlinear mobility distinction are correct. |
| 2275-2280 | Talagrand introduction | Correct | LSI-to-`T_2` constant `2/\lambda` is correct. |
| 2281-2322 | Proposition `prop-gaussian-talagrand-t2` | Correct | Direct transport proof and equality case are correct. |
| 2323-2376 | HWI; Proposition `prop-hwi-inequality` | Correct | Signs, `\lambda/2`, and LSI optimization are correct. |
| 2377-2395 | HWI/OU figure and caption | Correct | Bounds shown use the same normalization as the propositions. |
| 2396-2403 | “Training Two-Layer MLPs as Wasserstein Flows” introduction | Correct | Mean-field overview is accurate at its stated informal level. |
| 2404-2485 | “Wasserstein training of two-layer MLPs” | Correct | Particle scaling, first variation, square-loss kernel, and affine convexity are correct. |
| 2486-2501 | Homogeneous-ReLU figure | Correct | Caption makes no unsupported theorem claim. |
| 2502-2575 | “Classical convexity and stationarity”; Proposition `prop-classical-convex-stationary` | Needs clarification | Argument is correct under topology/domain/EDI hypotheses that should be explicit; F14. |
| 2576-2580 | Literature summary before homogeneous proposition | Contains error | Chizat--Bach result is conditional, not unconditional global convergence; F7. |
| 2581-2638 | Proposition `prop-formal-chizat-bach` | Correct | Formal statement and radial proof are correct; authoritative pairing is well typed. |
| 2639-2645 | “Generalized Dynamic Wasserstein Flows” introduction | Correct | Accurate scope statement. |
| 2646-2683 | “Generalized Wasserstein flows”; Definition `def-generalized-action-gradient-flow` | Contains error | Direct-method hypotheses do not alone give a maximal-slope curve; F8. |
| 2684-2762 | Definition `def-generalized-action-steepest-direction` and PMO dictionary | Correct | Quotient caveat, `2`-homogeneous dissipation, `W_2`, preconditioner, and `W_p` formulas are correct. |
| 2763-2800 | “General mobility flows” | Correct | Velocity/momentum conversion and all diffusion coefficients are correct. |
| 2801-2817 | “Dynamic spectral Wasserstein flows” introduction | Correct | Trace/operator gauge distinctions are consistent with Chapter 14. |
| 2818-2898 | Proposition `prop-normalized-spectral-polar` and static/dynamic caveat | Correct | Inverse-trace and range-inverse formulas are correct; minimal-representative caveat is explicit. |
| 2899-2941 | Proposition `prop-normalized-spectral-gradient-flow` | Correct | Continuity sign and `2`-homogeneous energy dissipation are correct. |
| 2942-3004 | Empirical/Muon remark and figure | Correct | `1/n` cancellation, nuclear-norm scale, polar factor, and practical caveats are correct. |
| 3005-3013 | “Nonlocal Wasserstein Flows” introduction | Correct | Correctly distinguishes pair fluxes from local velocities. |
| 3014-3072 | Nonlocal flows; Proposition `prop-nonlocal-entropy-gradient-flow` | Contains error | Formal logarithmic-mean computation is correct, but rigorous theorem and principal-value scope are overbroad; F2. |
| 3073-3118 | Fractional kernel, fractional heat, target-dependent jump flow | Correct | Generator sign and exponent `s/2` are correct; general target statement is read formally/conditionally. |
| 3119-3140 | Levy SDE remark | Correct | Stable-noise coefficient is `\sigma^s`; reversibility distinction is explicit. |
| 3141-3157 | Stochastic-gradient-dynamics remark | Correct | Clearly labelled a modeling approximation with relevant caveats. |
| 3158-3204 | Discrete Markov-chain flow; Proposition `prop-discrete-markov-entropy-gradient` | Correct | Logarithmic-mean cancellation and detailed-balance mass equation are correct. |
| 3205-3215 | “Dynamic Unbalanced OT and WFR Flows” introduction | Correct | State space and tangent pair match Chapter 14. |
| 3216-3282 | Definition `def-wfr-jko-gradient-flow`; Proposition `prop-wfr-gradient-flow-pde` | Correct | JKO coefficient, reaction factor, additive-constant gauge, and dissipation are correct. |
| 3283-3313 | Example `ex-wfr-kl-flow` | Contains error | PDE is correct; exact-vacuum creation wording and target positivity need repair; F15. |
| 3314-3331 | WFR comparison figure | Correct | Qualitative caption is compatible with positive numerical densities. |
| 3332-3342 | Conditional-ResNet introduction and limiting narrative | Needs clarification | Cited source begins at continuous depth; order and scope of limits need qualification; F9. |
| 3343-3386 | “Finite-depth finite-width ResNets” | Correct | Architecture, residual `1/L`, empirical laws, and depth marginal are correct. |
| 3387-3407 | “Finite-depth mean-field limit” | Needs clarification | Model is correctly defined, but no theorem/finite training scaling is supplied; F9. |
| 3408-3423 | “Continuous-depth conditional geometry” | Correct | Conditional state space and fiberwise metric are correct. |
| 3424-3442 | “Infinite-depth mean-field ResNet” | Needs clarification | Neural-ODE functional is correct; finite-depth convergence is only formal here; F9. |
| 3443-3464 | “Conditional Wasserstein gradient flow” | Correct | Fiberwise first variation and transport sign are correct under the stated formal regularity. |
| 3465-3489 | “Particle discretization and layerwise matching” | Needs clarification | Matching inequality is correct; “recovered” needs the `Ln_r` training-time normalization/order of limits; F9. |
| 3490-3499 | “Second-Order Momentum Flows” introduction | Correct | Correctly distinguishes first-order JKO from inertial state augmentation. |
| 3500-3535 | “Finite-dimensional momentum” | Contains error | Heavy-ball scaling is correct; Nesterov limit omits `t=k\sqrt h`; F10. |
| 3536-3592 | “Empirical Wasserstein lift” | Correct | Metric gradient, force, damping, and formal-limit caveat are correct. |
| 3593-3630 | Proposition `prop-second-order-energy-dissipation` | Correct | Kinetic normalization and frictional dissipation are exact. |
| 3631-3687 | “Phase-space formulation”; Proposition `prop-second-order-liouville` | Correct | Empirical distributional equation and conditional mean-field passage have correct signs. |
| 3688-3698 | Remark `rem-newtonian-momentum-limit` | Correct | Undamped acceleration and phase-space/Hamiltonian interpretation are correct under smoothness. |
| 3699-3795 | Example `ex-quadratic-momentum-gravity` and MMD Newton figure | Correct | Interaction, gravity, and energy-distance forces have correct signs/factors. |
| 3796-3834 | “Entropy without an empirical energy”; Example `ex-second-order-entropy-score` | Correct | Empirical-domain warning and formal score-acceleration equation are correct. |
| 3835-3882 | Confined entropy/Newton example and figure | Correct | OU and phase-space equations have consistent confinement signs. |
| 3883 | Chapter conclusion | Correct | Accurately separates quantitative convex flows from problem-specific mean-field/inertial analyses. |

## Cross-chapter, reference, and notation audit

### Cross-chapter consistency

- The JKO, `W_2` tangent norm, continuity equation, and geodesic conventions
  agree with `wasserstein-space.tex` and `dynamic-ot.tex`.
- The only substantive cross-book functional mismatch is F1: Chapter 15's
  hard singular convention for `\phi_m`, `m<1`, conflicts with the recession
  definition of `\Divergm_\phi` in `dual-norms.tex`.
- The generalized-flow section correctly uses the *squared* `W_p` Finsler
  speed `(\int|v|^p d\alpha)^{2/p}`, not the underlying `p`-homogeneous
  Benamou--Brenier density. Its PMO therefore has the correct `L^p`/`L^q`
  exponents.
- The mobility action, spectral covariance action, nonlocal logarithmic-mean
  action, conditional fiber metric, and WFR transport--reaction action all
  match their Chapter 14 definitions, including the `1/2` edge convention and
  the WFR scale `\kappa^2`.
- The empirical Wasserstein rate `r_{n,p,d}` imported from
  `statistical-ot.tex` is large enough that `r_{n,p,d}^p\gtrsim n^{-1/2}` in
  every dimension regime; this is the fact needed in the corrected F6 moment
  argument.
- Aside from the undefined `b` in F12 and the unspecified centering measure in
  F17, notation is consistent with the repository's definitions.

### Labels and citations

A repository-wide parse of the current source and included book sections found:

- 112 distinct targets used by `\ref` or `\eqref`, all defined (including two
  equation names created by the `\eqllead` macro rather than a literal
  `\label` command);
- 88 distinct bibliography keys used by `\cite`, all present in the
  repository bibliographies;
- no conflicting ordinary label definitions relevant to this chapter; and
- two labels on Proposition `prop-power-divergences-geodesic-convexity`, which
  are intentional aliases rather than a collision.

The theorem/definition references used inside proofs point to the intended
objects. In particular, the PL theorem uses the full dissipation identity it
states, the nonlocal proposition points to the Chapter 14 nonlocal action, and
the WFR section points to the same `\kappa`-scaled action used in its Riesz
calculation.

### Secondary-source drift

The substantive drift found is F16. The authoritative LaTeX has the corrected
abstract derivative pairing; the arXiv LaTeX retains an undefined `\rho` in an
inner product, and MyST assumes an `L^2(\zeta)` representation without its Riesz
hypothesis. No secondary-source formula was used to override the authoritative
chapter. The remaining comparisons revealed formatting or exposition drift,
not an additional mathematical discrepancy affecting this audit.

## Primary-source scope checks

The following sources were read for theorem scope, rather than cited merely as
background.

| Topic | Primary or authoritative source | What the source verifies |
|---|---|---|
| Metric gradient flows | [Ambrosio--Gigli--Savare, *Gradient Flows*](https://link.springer.com/book/10.1007/b137080) and [Ambrosio--Gigli, *A user's guide to optimal transport*](https://cvgmt.sns.it/media/doc/paper/195/users_guide-final.pdf) | Curves of maximal slope require absolute continuity and an upper gradient; generalized minimizing-movement convergence needs more than compactness of iterates to identify the limiting slope. This confirms F5 and F8. |
| Displacement convexity | [McCann, *A convexity principle for interacting gases*](https://www.math.utoronto.ca/mccann/papers/advances.pdf) | The internal-energy interpolation theorem is formulated on absolutely continuous laws. The paper's lower-semicontinuous hard extension is tied to superlinear growth; it does not justify the chapter's finite-recession approximation sentence. This narrows F1 without invalidating extended-valued geodesic convexity. |
| Higher empirical expansions | [Chassagneux--Szpruch--Tse, published article](https://doi.org/10.1214/21-AAP1725) and [author manuscript](https://arxiv.org/pdf/1901.02556) | Theorem 2.11 gives first- and second-order iid bounds. Theorem 2.12 is the full static iid weak-error expansion; it assumes linear-functional derivatives through order `2q-1` for an `O(N^{-(q-1)})` remainder. These results validate the partition/cancellation mechanism but do not state the chapter's custom uniform `W_p`-Taylor remainder theorem under only the displayed `2J-2` bound. This resolves F6 while identifying the exact hypothesis gap. |
| Homogeneous mean-field training | [Chizat--Bach, NeurIPS paper](https://proceedings.neurips.cc/paper_files/paper/2018/file/a1afc58c6ca9540d057299ec3016d726-Paper.pdf) | Theorem 3.3 is an optimality-at-convergence result under Assumptions 3.2 and support-separation/Sard hypotheses. It does not prove convergence of every noiseless homogeneous flow. This confirms F7. |
| Other mean-field convergence claims | [Mei--Montanari--Nguyen, author manuscript](https://arxiv.org/pdf/1804.06561) and [Rotskoff--Vanden-Eijnden, NeurIPS paper](https://papers.neurips.cc/paper_files/paper/2018/file/196f5641aa9dc87067da4ff90fd81e7b-Paper.pdf) | The former's noisy, regularized convergence theorems require A1--A4, finite positive temperature, regularization, initialization, and scaling hypotheses; its main theorem assumes an absolutely continuous initial law. The latter's long-time and `O(n^{-1})` conclusions are likewise conditional on its approximation/kernel/support/scaling setting. The chapter's adjacent synopsis is directionally accurate; only its Chizat--Bach sentence is unconditionally worded enough to count as F7. |
| Continuum jump kernels | [Erbar, *Gradient flows of the entropy for jump processes*](https://www.numdam.org/item/AIHPB_2014__50_3_920_0.pdf) | The metric construction is broad, but the entropy gradient-flow theorem in the relevant section imposes translation invariance and Assumptions 5.5--5.6. This confirms the narrow scope in F2. |
| Nonhomogeneous jump extensions | [Warren, *Gradient flow structure for some nonlocal diffusion equations*](https://arxiv.org/abs/2412.20969) | Extends beyond translation-invariant kernels on `\mathbb R^d`/`\mathbb T^d`, but retains symmetry, reference-measure, integrability, and weak-solution assumptions. It does not justify an arbitrary reversible kernel. |
| Finite Markov chains | [Maas, *Gradient flows of the entropy for finite Markov chains*](https://arxiv.org/abs/1102.5238) | Confirms the logarithmic-mean metric and exact entropy-gradient-flow identity for reversible finite chains used at lines 3158-3204. |
| Conditional ResNets | [Barboni--Peyre--Vialard, published article](https://doi.org/10.1002/cpa.70004) and [author manuscript](https://arxiv.org/pdf/2403.12887) | The model is continuous in depth from the outset; the paper proves well-posedness and consistency with finite-width training under its assumptions. Finite-depth-to-neural-ODE convergence is a separate approximation. This confirms F9. |
| Nesterov limit | [Su--Boyd--Candes, JMLR](https://jmlr.org/papers/volume17/15-084/15-084.pdf) | The low-resolution ODE uses `t=k\sqrt h`, compatible initialization at the singular origin, and smooth convex assumptions. This confirms F10. |
| WFR normalization | [Chizat--Peyre--Schmitzer--Vialard, *Unbalanced optimal transport: dynamic and Kantorovich formulations*](https://arxiv.org/abs/1508.05216) | Confirms the transport--reaction action after accounting for the chapter's `\kappa` parameterization. The PDE factor `\kappa^{-2}` is correct. |
| HWI/LSI/Talagrand | [Otto--Villani, *Generalization of an inequality by Talagrand and links with the logarithmic Sobolev inequality*](https://doi.org/10.1006/jfan.1999.3557) | Confirms the HWI sign and `\lambda/2` curvature term, the `I/(2\lambda)` LSI convention, and the resulting `2/\lambda` transport-entropy constant. |

## Prioritized repair order

1. **Reconcile the singular convention (F1).** Decide between the relaxed
   recession functional and the hard absolutely-continuous domain before
   editing any power-divergence prose; this is the only cross-book
   inconsistency.
2. **Repair the metric-theory definitions (F5, F8).** Add `AC^2` to curves of
   maximal slope, then distinguish generalized minimizing movements from
   maximal-slope limits through explicit slope/upper-gradient assumptions.
3. **Correct the two continuum-limit statements (F3, F10).** Add ODE
   well-posedness for Euler convergence and `t=k\sqrt h` plus initialization
   for Nesterov.
4. **Narrow cited theorem scopes (F2, F7).** State Erbar's
   translation-invariant jump theorem and Chizat--Bach's
   optimality-at-convergence theorem with their actual assumptions.
5. **Separate the ResNet limits (F9).** Present the continuous-depth model
   first, state the proved width consistency, and treat depth discretization
   separately with the `Ln_r` finite training-rate normalization.
6. **Close the empirical-expansion quantifier (F6).** State uniform bounds for
   all Taylor kernels actually retained, or give a truncated remainder lemma.
7. **Tighten formal domains (F4, F13, F14).** Define the transport chain rule,
   restrict slope examples to their effective domains, and specify the
   stationary-limit topology/domain/EDI hypotheses.
8. **Make the local repairs (F12, F15, F17, F18).** Define `b`, add boundary
   data, distinguish positive underdensity from exact vacuum, name the gauge
   reference measure, and replace the deterministic-push-forward dichotomy.
9. **Synchronize secondary sources (F16).** Copy the authoritative dual
   pairing and its Riesz qualification into arXiv and MyST after the chapter
   repairs are settled.

## Final counts and conclusion

| Severity | Finding IDs | Count |
|---|---|---:|
| Critical | None | 0 |
| Major | None | 0 |
| Moderate | F1, F2, F3, F5, F7, F8, F9, F10 | 8 |
| Minor | F4, F6, F12, F13, F14, F15, F16, F17, F18 | 9 |
| **Total** | **17 findings** | **17** |

F11 is intentionally absent from the final count because it was merged into
F8. Sixteen findings concern the authoritative chapter and one, F16, concerns
secondary-source drift only. There are no Critical or Major findings and no
unresolved literature-verification findings. The chapter's central formulas
are mathematically coherent; the priority is to repair theorem scope,
effective domains, and metric-gradient-flow hypotheses without changing the
validated signs, constants, or rates listed above.
