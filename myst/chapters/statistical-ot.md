---
title: "Statistical Optimal Transport"
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-statistical-ot)=

Optimal transport is rarely evaluated on population measures directly. In
machine learning and statistics, the inputs are usually empirical laws,
histograms, simulated particles or minibatches, and the central question is
therefore no longer only how to compute OT, but how OT behaves as a random
estimator. This chapter studies this statistical layer: qualitative consistency
of empirical measures, non-asymptotic sample-complexity rates, and asymptotic
bias--variance decompositions for exact and regularized transport costs.

This statistical convergence is conceptually different from the algorithmic
convergence studied in the previous chapter. There the marginals and the
temperature were fixed and one asked how Sinkhorn iterates approach a
regularized optimizer. Here the number of samples grows, the empirical
measures themselves move, and the regularization parameter may either remain
fixed or be sent to zero. The resulting picture explains why exact OT is
statistically expensive in high intrinsic dimension, why fixed-temperature
Sinkhorn has smoother parametric fluctuations, and why approximating exact OT
with entropy always involves a bias--variance tradeoff.

```{code-cell} ipython3
:tags: [remove-input]
from pathlib import Path
import sys

from IPython.display import Image as DisplayImage
from IPython.display import display

here = Path.cwd()
myst_dir = None
for candidate in [here, here.parent, here / "myst", here.parent / "myst", here.parent.parent / "myst"]:
    if (candidate / "ot4ml_web.py").exists():
        myst_dir = candidate.resolve()
        sys.path.insert(0, str(myst_dir))
        break

if myst_dir is None:
    raise RuntimeError("Could not locate myst/ot4ml_web.py")

repo_root = myst_dir.parent
thumbnails = repo_root / "notebooks-figures" / "thumbnails"

def show_book_figure(name, width=760):
    display(DisplayImage(filename=str(thumbnails / f"{name}.png"), width=width))
```

(sec-law-large-numbers-clt)=
## Law of Large Numbers and Central Limit Theorem

Before discussing sample complexity, it is useful to separate consistency from
rates. If $X_1,\ldots,X_n$ are i.i.d. samples with common law $\alpha$, the
associated empirical measure is the random probability measure

```{math}
:label: eq-empirical-law-alpha-n
\hat\alpha_n
\eqdef
\frac1n\sum_{i=1}^n\delta_{X_i}.
```

The ordinary law of large numbers says that empirical averages converge to
expectations. In measure language this means that $\hat\alpha_n$ converges
weakly toward $\alpha$, because testing $\hat\alpha_n$ against a bounded
continuous function $\varphi$ gives the sample average
$n^{-1}\sum_i\varphi(X_i)$. Wasserstein distances strengthen this statement by
also recording moment convergence. Thus, if $\alpha$ has a finite $p$-th
moment, the empirical law converges to $\alpha$ in $\Wass_p$, almost surely and
in $p$-th mean in the sense that
$\mathbb E\Wass_p(\hat\alpha_n,\alpha)^p\to0$. This is the qualitative consistency
statement behind empirical OT plug-in estimators: empirical transport
distances converge to their population counterparts once the sampled laws
themselves converge in Wasserstein distance. It says nothing yet about the
speed, which is the topic of {ref}`sec-sample-complexity`.

(prop-empirical-lln-wasserstein)=
:::{admonition} Proposition: Empirical Law of Large Numbers in $\Wass_p$
:class: important
Let $(\Xx,d)$ be a Polish metric space, let $p\geq1$, and let
$\alpha\in\Pp_p(\Xx)$. Let $(X_i)_{i\geq1}$ be i.i.d. random variables with law
$\alpha$, and define $\hat\alpha_n$ by {eq}`eq-empirical-law-alpha-n`. Then

```{math}
\hat\alpha_n\rightharpoonup\alpha,
\qquad
\Wass_p(\hat\alpha_n,\alpha)\longrightarrow0
```

almost surely. Moreover,

```{math}
\mathbb E\,\Wass_p(\hat\alpha_n,\alpha)^p\longrightarrow0.
```
:::

:::{dropdown} Proof
Fix a reference point $x_0\in\Xx$, and write $r(x)=d(x,x_0)$. Since $\Xx$ is
Polish, the weak topology on $\Pp(\Xx)$ admits a countable
convergence-determining class $(\varphi_k)_{k\geq1}\subset C_b(\Xx)$. For each
fixed $k$, the strong law of large numbers gives

```{math}
\int \varphi_k\,\d\hat\alpha_n
=
\frac1n\sum_{i=1}^n\varphi_k(X_i)
\longrightarrow
\mathbb E\varphi_k(X_1)
=
\int\varphi_k\,\d\alpha
```

almost surely. Intersecting these probability-one events over the countable set
of indices gives convergence against every $\varphi_k$, hence weak convergence
$\hat\alpha_n\rightharpoonup\alpha$.

The moment condition $\alpha\in\Pp_p(\Xx)$ means $\int r^p\,\d\alpha<+\infty$.
Applying the strong law again to $r(X_1)^p$ gives

```{math}
\int r^p\,\d\hat\alpha_n
=
\frac1n\sum_{i=1}^n r(X_i)^p
\longrightarrow
\int r^p\,\d\alpha
```

almost surely. Weak convergence plus convergence of $p$-th moments is
equivalent to $\Wass_p$ convergence on $\Pp_p(\Xx)$, so
$\Wass_p(\hat\alpha_n,\alpha)\to0$ almost surely.

For convergence in expectation, set $A_n=\int r^p\,\d\hat\alpha_n$ and
$M=\int r^p\,\d\alpha$. The triangle inequality through the Dirac mass
$\delta_{x_0}$, followed by $(a+b)^p\leq2^{p-1}(a^p+b^p)$, gives

```{math}
\Wass_p(\hat\alpha_n,\alpha)^p
\leq
2^{p-1}(A_n+M).
```

The family $(A_n)_n$ is uniformly integrable. By the de la Vallee--Poussin
criterion, choose a convex superlinear function $\Psi$ such that
$\mathbb E\Psi(r(X_1)^p)<+\infty$; Jensen's inequality gives

```{math}
\mathbb E\Psi(A_n)
\leq
\frac1n\sum_{i=1}^n\mathbb E\Psi(r(X_i)^p)
=
\mathbb E\Psi(r(X_1)^p).
```

Thus $(A_n+M)_n$, and hence $(\Wass_p(\hat\alpha_n,\alpha)^p)_n$, is uniformly
integrable. Together with almost-sure convergence to zero, this implies
$\mathbb E\Wass_p(\hat\alpha_n,\alpha)^p\to0$.
:::

### Central-Limit Fluctuations

The previous proposition is a law-of-large-numbers statement: a random
empirical measure converges to the law that generated it. The central limit
theorem describes a different, fluctuation-scale limit. As recalled in Remark
{ref}`rem-clt`, if $(X_i)_{i\geq1}$ are centered i.i.d. random vectors with
identity covariance, the law of $n^{-1/2}\sum_i X_i$ converges weakly toward a
Gaussian. Equivalently, if $\alpha$ is the common law of the $X_i$, this law is
the rescaled convolution $(D_{1/\sqrt n})_\sharp\alpha^{*n}$. Wasserstein
distances make this qualitative convergence quantitative. The next result is
a $\Wass_1$ form of the Berry--Esseen theorem: it controls the error uniformly
over all $1$-Lipschitz test functions. The qualitative Bernoulli example was
visualized earlier in Figure {ref}`fig:matching-quantitative-clt`.

(prop-berry-esseen-w1)=
:::{admonition} Proposition: Berry--Esseen bound in $\Wass_1$
:class: important
Let $(X_i)_{i=1}^n$ be i.i.d. real random variables with
$\mathbb{E}X_i=0$, $\mathbb{E}X_i^2=1$ and
$\mathbb{E}|X_i|^3<+\infty$. If $\alpha_n$ is the law of
$n^{-1/2}\sum_i X_i$ and $\gamma$ is the standard Gaussian law, then

```{math}
\Wass_1(\alpha_n,\gamma)
\leq
\frac{C\,\mathbb{E}|X_1|^3}{\sqrt n},
```

where $C$ is a universal constant.
:::

:::{dropdown} Proof
By Kantorovich--Rubinstein duality,

```{math}
\Wass_1(\alpha_n,\gamma)
=
\sup_{\Lip(h)\leq1}
\left|\mathbb{E}h(S_n)-\mathbb{E}h(G)\right|,
\qquad
S_n=n^{-1/2}\sum_iX_i,
\quad
G\sim\gamma.
```

For each such $h$, solve Stein's equation
$f_h'(x)-xf_h(x)=h(x)-\mathbb{E}h(G)$. Its solution satisfies
$\norm{f_h'}_\infty+\norm{f_h''}_\infty\leq C$. Writing
$S_n^{(i)}=S_n-X_i/\sqrt n$, independence and $\mathbb E X_i=0$ give

```{math}
\mathbb E[S_nf_h(S_n)]
=
\frac1{\sqrt n}\sum_{i=1}^n
\mathbb E\left[X_i\left(f_h(S_n^{(i)}+X_i/\sqrt n)-f_h(S_n^{(i)})\right)\right].
```

Taylor's formula with integral remainder and $\mathbb E X_i^2=1$ show that
this differs from $n^{-1}\sum_i\mathbb E f_h'(S_n^{(i)})$ by at most
$C\mathbb E|X_1|^3/\sqrt n$. The Lipschitz bound on $f_h'$ replaces this
average by $\mathbb E f_h'(S_n)$ at the same order. Stein's identity and the
duality formula then prove the claim
{cite:p}`berry1941accuracy,esseen1942liapunoff,chen2011normal,bobkov2018berry,rio2011asymptotic`.
:::

The universal $n^{-1/2}$ bound is sharp over broad classes of input laws, but
it need not describe the asymptotic behavior of a fixed law. For symmetric
inputs, the smooth skewness correction vanishes. What replaces it depends on
whether the law is lattice-valued or has a density.

(prop-sharp-lattice-w1-clt)=
:::{admonition} Proposition: Sharp Symmetric Lattice Asymptotic
:class: important
Let $X$ be centered, symmetric, of unit variance, and supported on a finite
subset of $a+h\mathbb Z$, where $h>0$ is the maximal lattice span. If
$\alpha_n$ is the law of $n^{-1/2}\sum_{i=1}^nX_i$ and
$\gamma=\mathcal N(0,1)$, then

```{math}
\sqrt n\,\Wass_1(\alpha_n,\gamma)\longrightarrow \frac h4.
```
:::

:::{dropdown} Proof
Write $F_n$ for the CDF of $\alpha_n$, and $\Phi$ and $\varphi$ for the
standard Gaussian CDF and density. With
$\psi(u)=\frac12-\{u\}$, the integrated lattice Edgeworth expansion gives

```{math}
F_n(x)-\Phi(x)
=
\frac h{\sqrt n}\,
\psi\!\left(\frac{\sqrt n\,x-na}{h}\right)\varphi(x)+r_n(x),
\qquad
\|r_n\|_{L^1(\mathbb R)}=o(n^{-1/2});
```

see {cite:p}`Petrov1975,BhattacharyaRao2010,KolassaMcCullagh1990`.
Vallender's identity {cite:p}`Vallender1974` states that
$\Wass_1(\alpha_n,\gamma)=\int_{\mathbb R}|F_n-\Phi|$. The inequality
$\big||u+v|-|u|\big|\leq|v|$ reduces the result to periodic averaging:

```{math}
\int_{\mathbb R}
\left|\psi\!\left(\frac{\sqrt n\,x-na}{h}\right)\right|\varphi(x)\,dx
\longrightarrow
\int_0^1|\psi(u)|\,du
=\frac14.
```

For completeness, prove this first for compactly supported step functions,
where it is a Riemann sum over periods, and conclude by $L^1$ approximation
of $\varphi$.
:::

The absence of a lattice correction reveals the next smooth Edgeworth term.
A density automatically satisfies Cramér's non-lattice condition because its
characteristic function vanishes at infinity.

(prop-sharp-density-w1-clt)=
:::{admonition} Proposition: Sharp Symmetric Density Asymptotic
:class: important
Let $X$ be centered, symmetric, of unit variance, with a density and moments
of every order. Set $\kappa_4=\mathbb E[X^4]-3$ and
$H_3(x)=x^3-3x$. If $\alpha_n$ is the law of
$n^{-1/2}\sum_{i=1}^nX_i$ and $\gamma=\mathcal N(0,1)$, then

```{math}
\Wass_1(\alpha_n,\gamma)
=
\frac{|\kappa_4|}{24n}
\int_{\mathbb R}|H_3(x)|\varphi(x)\,dx
+o(n^{-1}).
```
:::

:::{dropdown} Proof
The non-lattice Edgeworth expansion through order $n^{-1}$ has an
$n^{-1/2}$ term proportional to the third cumulant, and $n^{-1}$ terms
proportional to the fourth cumulant and to the square of the third one.
Symmetry makes the third cumulant vanish and gives

```{math}
F_n(x)-\Phi(x)
=-\frac{\kappa_4}{24n}H_3(x)\varphi(x)+r_n(x),
\qquad
\|r_n\|_{L^1(\mathbb R)}=o(n^{-1});
```

see {cite:p}`Petrov1975,BhattacharyaRao2010`. Insert this expansion into
Vallender's identity and use $\big||u+v|-|u|\big|\leq|v|$.
:::

These two results explain the different behaviors in Figure
{ref}`fig:statistical-berry-esseen-w1`. For the symmetric Bernoulli law, the
maximal span is $h=2$, hence
$\Wass_1(\alpha_n,\gamma)=1/(2\sqrt n)+o(n^{-1/2})$. The density proposition
cannot be used: this law has no density and its characteristic function is
$\mathbb E[e^{itX}]=\cos t$, whose modulus returns to one at arbitrarily large
frequencies. Thus symmetry removes the smooth skewness term but not the
lattice sawtooth. Conversely, $X\sim\operatorname{Unif}[-\sqrt3,\sqrt3]$ has
a density, characteristic function $\sin(\sqrt3t)/(\sqrt3t)\to0$, and
$\kappa_4=-6/5$. Since

```{math}
\int_{\mathbb R}|H_3(x)|\varphi(x)\,dx
=2\varphi(0)+8\varphi(\sqrt3)
=\frac{2+8e^{-3/2}}{\sqrt{2\pi}},
```

one obtains

```{math}
:label: eq-bernoulli-uniform-sharp-w1-clt
\Wass_1(\alpha_n,\gamma)
\sim
\begin{cases}
\dfrac1{2\sqrt n},
&X\sim\frac12(\delta_{-1}+\delta_1),\\[2mm]
\dfrac{1+4e^{-3/2}}{10\sqrt{2\pi}}\dfrac1n,
&X\sim\operatorname{Unif}[-\sqrt3,\sqrt3].
\end{cases}
```

Figure {ref}`fig:statistical-berry-esseen-w1` confronts these equivalents with
exact one-dimensional computations. For a centered, unit-variance input law
$\alpha_0$, define

```{math}
\alpha_n=(D_{1/\sqrt n})_\sharp\alpha_0^{*n},
\qquad n\geq1,
```

so that $\alpha_1=\alpha_0$. For Bernoulli input, the distance is evaluated by
the exact quantile formula and atom masses are divided by the current lattice
spacing in the density display. For continuous-uniform input, the normalized
convolution is an affine image of the Irwin--Hall distribution and Vallender's
CDF formula is integrated numerically. Neither computation uses Monte Carlo
sampling.

(fig:statistical-berry-esseen-w1)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("statistical-berry-esseen-w1", width=920)
```

*Sharp lattice and density central-limit asymptotics in $\Wass_1$.* The two
left panels show $\alpha_0$, $\alpha_2$, and $\alpha_6$ for symmetric
Bernoulli and continuous-uniform inputs; the gray curve is the standard
Gaussian density. The right panel compares the exact numerical distances
(solid) with the sharp equivalents in {eq}`eq-bernoulli-uniform-sharp-w1-clt`
(dashed). The Bernoulli curve follows its lattice rate $1/(2\sqrt n)$, while
the continuous-uniform curve approaches
$(1+4e^{-3/2})/(10\sqrt{2\pi}\,n)$.
:::

### Empirical-Process Fluctuations

The fluctuation object used by statistical OT is the empirical law itself,
not only a normalized sum in Euclidean space. There is no canonical Gaussian
law on an unrestricted infinite-dimensional space of signed measures, so the
precise finite-dimensional statement is made through test functions. Uniform
convergence over an infinite class requires a Donsker condition
{cite:p}`vanDerVaartWellner1996`.

(prop-empirical-process-clt)=
:::{admonition} Proposition: Finite-Dimensional Empirical-Process CLT
:class: important
Let $X_1,X_2,\ldots$ be i.i.d. with law $\alpha$, and let
$\varphi_1,\ldots,\varphi_q\in L^2(\alpha)$. Then

```{math}
\sqrt n\left(\int\varphi_r\,d(\hat\alpha_n-\alpha)\right)_{r=1}^q
\Longrightarrow G_\alpha,
```

where $G_\alpha$ is centered Gaussian in $\RR^q$ with covariance

```{math}
\mathbb E[(G_\alpha)_r(G_\alpha)_s]
=
\int\left(\varphi_r-\int\varphi_r\,d\alpha\right)
\left(\varphi_s-\int\varphi_s\,d\alpha\right)d\alpha.
```
:::

:::{dropdown} Proof
Apply the multivariate central limit theorem to the centered i.i.d. vectors
$(\varphi_r(X_i)-\int\varphi_r\,d\alpha)_{r=1}^q$.
:::

This linear CLT is the input to the delta-method arguments in
{ref}`sec-bias-variance-ot`. Exact OT may have only directional derivatives,
whereas fixed-temperature entropic OT is smooth in the relative interiors of
finite probability simplices.

(sec-sample-complexity)=
## Sample Complexity

This section compares four statistical regimes. Exact OT resolves geometry at
all scales and pays rates controlled by the intrinsic dimension. MMD replaces
transport by a kernel mean embedding and has a parametric Monte-Carlo rate for
bounded kernels. Fixed-temperature Sinkhorn divergences smooth the dual
potentials and also recover parametric fluctuations, at the price of
regularization bias. Sliced Wasserstein inherits one-dimensional empirical
rates through its projected laws.

### Unregularized OT

The previous section proves qualitative convergence of empirical laws. The
sample-complexity question is how fast this convergence happens. The sample
complexity of unregularized OT suffers from the curse of
dimensionality, but the relevant dimension is geometric. If the distributions
are supported on a regular
lower-dimensional set, for instance a $d'$-dimensional submanifold of
$\RR^d$, the empirical rate is governed by $d'$ rather than by the ambient
dimension $d$. In the high-dimensional regime for $\Wass_p$, namely
$d'>2p$, this gives the characteristic rate $n^{-1/d'}$. Exact OT is therefore
dimension-adaptive: it sees the intrinsic dimension of the data support
through its covering numbers {cite:p}`dudley1969speed,weed2017sharp`.
Related two-sample-testing viewpoints are developed in
{cite:p}`ramdas2017wasserstein`.

Figure {ref}`fig:sinkhorn-bias-variance-tradeoff` gives a numerical overview: exact OT exhibits dimension-dependent empirical fluctuations, whereas MMD and fixed-temperature Sinkhorn divergences lie much closer to the parametric $n^{-1/2}$ scale.

(fig:sinkhorn-bias-variance-tradeoff)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-bias-variance-tradeoff")
```

*Empirical fluctuations in dimensions three and six. For each sample size
$n$, two independent empirical measures are drawn from the same standard
Gaussian law. Exact OT follows a slower dimension-dependent scale, while MMD
and the fixed-$\epsilon$ Sinkhorn divergence behave closer to the parametric
$n^{-1/2}$ guide. This is a statistical illustration, not a solver benchmark.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Vary dimension, sample budget and temperature to compare the curse-of-dimensionality OT guide with the parametric fluctuation and bias floor of entropic OT.
:::


(prop-dyadic-partition-w1)=
:::{admonition} Proposition: Dyadic Partition Bound for $\Wass_1$
:class: important
Let $\mathcal Q_j$ be the dyadic partition of $[0,1]^d$ into cubes of side
$2^{-j}$. For every integer $J\geq0$ and every
$\alpha,\beta\in\mathcal P([0,1]^d)$,

```{math}
\Wass_1(\alpha,\beta)
\leq
\sqrt d\sum_{j=0}^{J-1}2^{-j}
\sum_{Q\in\mathcal Q_{j+1}}|\alpha(Q)-\beta(Q)|
+\sqrt d\,2^{-J}.
```
:::

:::{dropdown} Proof Sketch
Match the common mass inside the finest cells, then recursively match the
remaining common mass inside each parent cell. Mass first matched at scale
$j$ moves by at most $\sqrt d,2^{-j}$, and its total amount is bounded by
the sum of the child-cell imbalances. The residual at the finest unresolved
scale has mass at most one and moves by at most $\sqrt d,2^{-J}$.
:::

(prop-empirical-ot-rate)=
:::{admonition} Proposition: Empirical OT has Intrinsic-Dimension Value Rates
:class: important
Let $\alpha$ and $\beta$ be supported on $[0,1]^d$, and let
$\hat\alpha_n,\hat\beta_m$ be independent empirical measures. Then

```{math}
\mathbb E\left|
\Wass_1(\hat\alpha_n,\hat\beta_m)-\Wass_1(\alpha,\beta)
\right|
\lesssim_d r_d(n)+r_d(m),
```

where

```{math}
r_d(N)=
\begin{cases}
N^{-1/2}, & d=1,\\
(\log N)N^{-1/2}, & d=2,\\
N^{-1/d}, & d\geq3.
\end{cases}
```

For $\Wass_p$ on a regular $d'$-dimensional support, the high-dimensional
rate is $N^{-1/d'}$ when $d'>2p$ under the usual volume-growth and moment
assumptions. The dimension is therefore intrinsic rather than necessarily
ambient.
:::

:::{dropdown} Proof
The triangle inequality reduces the result to
$\mathbb E\Wass_1(\hat\alpha_N,\alpha)$. For each dyadic cell $Q$,

```{math}
\mathbb E|\hat\alpha_N(Q)-\alpha(Q)|
\leq \sqrt{\alpha(Q)/N}.
```

Summing by Cauchy--Schwarz and applying
{ref}`prop-dyadic-partition-w1` gives

```{math}
\mathbb E\Wass_1(\hat\alpha_N,\alpha)
\lesssim_d
2^{-J}+N^{-1/2}\sum_{j=0}^{J-1}2^{j(d/2-1)}.
```

Optimizing $J$ yields the three displayed regimes. Replacing dyadic cubes by
covers of cardinality $O(2^{jd'})$ gives the intrinsic-dimensional extension
{cite:p}`dudley1969speed,fournier2015rate,weed2017sharp`.
:::

### Lower Bounds and Minimax Optimality

The high-dimensional rate is not merely a defect of the empirical plug-in
estimator. A hypercube of localized density perturbations gives the following
distribution-estimation obstruction
{cite:p}`singh2018minimax,weed2017sharp,weed2025statistical`.

(prop-minimax-lower-w1-density)=
:::{admonition} Proposition: Minimax Lower Bound for Bounded Densities
:class: important
Let $d\geq3$ and let $\mathcal A$ contain the laws on $[0,1]^d$ with density
$\rho$ satisfying $1/2\leq\rho\leq3/2$. Then

```{math}
\inf_{\widetilde\alpha_N}\sup_{\alpha\in\mathcal A}
\mathbb E_\alpha\Wass_1(\widetilde\alpha_N,\alpha)
\geq c_dN^{-1/d},
```

where the infimum is over every estimator based on $N$ i.i.d. samples.
:::

:::{dropdown} Proof Sketch
Partition the cube into $M=m^d$ cells of width $h=1/m$, and put an
independent signed, zero-mean bump of fixed small amplitude in each cell.
Kantorovich--Rubinstein duality gives a separation of order
$h^{d+1}$ per differing sign. Neighboring experiments have one-sample KL
divergence $O(h^d)$, so choosing $M\asymp N$ keeps their $N$-sample total
variation bounded away from one. Assouad's lemma then gives
$Mh^{d+1}=h\asymp N^{-1/d}$.
:::

### Leveraging Smoothness

Smooth densities permit a better estimator: first remove fine empirical
oscillations with a wavelet or kernel smoother, then compute OT between the
smoothed laws {cite:p}`nilesweed2019minimaxSmooth`.

(prop-smooth-plugin-w1-rate)=
:::{admonition} Proposition: Smoothed Plug-In Rates
:class: important
Let $d\geq3$, $s>0$, and suppose the source and target densities on
$[0,1]^d$ are bounded above and below and lie in a bounded
$B^s_{\infty,\infty}$ class. There are normalized nonnegative wavelet
estimators $\tilde\alpha_n,\tilde\beta_m$ such that

```{math}
\mathbb E\left|
\Wass_1(\tilde\alpha_n,\tilde\beta_m)-\Wass_1(\alpha,\beta)
\right|
\leq
C\left(n^{-\frac{s+1}{d+2s}}+m^{-\frac{s+1}{d+2s}}\right).
```
:::

:::{dropdown} Proof Sketch
At wavelet scale $J$, the $B^{-1}_{1,1}$ approximation bias is
$O(2^{-J(s+1)})$ and the stochastic term is
$O(N^{-1/2}2^{J(d/2-1)})$. Since $\Wass_1$ is controlled by this negative
Besov norm for densities bounded away from zero, balancing the two terms with
$2^J\asymp N^{1/(d+2s)}$ gives the rate. Projection onto nonnegative
unit-mass densities preserves its order.
:::

This gain is statistical rather than automatically computational: a grid at
bandwidth $h$ has $O(h^{-d})$ degrees of freedom, so direct smoothing remains
expensive in high dimension. Sum-of-squares relaxations offer theoretical
dimension-free exponents but are still costly in practice
{cite:p}`vacher2021dimensionfreeSmoothOT`.

### MMD

(prop-mmd-sample-rate)=
:::{admonition} Proposition: MMD has a Parametric Value Rate
:class: important
Let $k$ be a bounded positive definite kernel with RKHS $\mathcal H_k$, and
define

```{math}
\operatorname{MMD}_k(\alpha,\beta)
\eqdef
\norm{
\int k(x,\cdot)\,\d(\alpha-\beta)(x)
}_{\mathcal H_k}.
```

If $\hat\alpha_n$ and $\hat\beta_m$ are independent empirical measures, then

```{math}
\mathbb E
\abs{
\operatorname{MMD}_k(\hat\alpha_n,\hat\beta_m)
-
\operatorname{MMD}_k(\alpha,\beta)
}
\leq
\kappa\left(\frac1{\sqrt n}+\frac1{\sqrt m}\right)
```

when $k(x,x)\leq\kappa^2$.
:::

:::{dropdown} Proof
Let $\Phi(x)=k(x,\cdot)$ be the feature map and
$m_\alpha=\mathbb E\Phi(X)$. The reverse triangle inequality gives

```{math}
\abs{
\operatorname{MMD}_k(\hat\alpha_n,\hat\beta_m)
-
\operatorname{MMD}_k(\alpha,\beta)
}
\leq
\operatorname{MMD}_k(\hat\alpha_n,\alpha)
+
\operatorname{MMD}_k(\hat\beta_m,\beta).
```

Independence cancels cross terms after taking squared norms and expectation:

```{math}
\mathbb E\operatorname{MMD}_k(\hat\alpha_n,\alpha)^2
=
\frac1n
\mathbb E\norm{\Phi(X)-m_\alpha}_{\mathcal H_k}^2
=
\frac1n
\left(
\mathbb E k(X,X)-\mathbb E k(X,X')
\right).
```

Jensen's inequality and $k(x,x)\leq\kappa^2$ give the displayed bound.
:::

### Entropic OT

Entropic regularization keeps the transport geometry while smoothing the dual
potentials. The sharp fixed-temperature statement below has polynomial, rather
than exponential, dependence on the inverse temperature
{cite:p}`genevay2018sample,mena2019statistical`.

(prop-sinkhorn-sample-rate)=
:::{admonition} Proposition: Fixed-Temperature Sinkhorn Divergence Has a Parametric Rate
:class: important
Let $c(x,y)=\norm{x-y}^2/2$, and assume $\alpha$ and $\beta$ are
$\sigma^2$-subgaussian on $\RR^d$:

```{math}
\int e^{\norm{x}^2/(2d\sigma^2)}d\alpha(x)\leq2,
\qquad
\int e^{\norm{y}^2/(2d\sigma^2)}d\beta(y)\leq2.
```

Set

```{math}
q_d=\left\lceil\frac{5d}{2}\right\rceil+6,
\qquad
b_d=\left\lceil\frac{5d}{4}\right\rceil+3,
\qquad
\Lambda_{d,\sigma}(\epsilon)
=\epsilon\left(1+\frac{\sigma^{q_d}}{\epsilon^{b_d}}\right).
```

For independent empirical measures and every $\epsilon>0$,

```{math}
\mathbb E\left|
\bar\MK_c^\epsilon(\hat\alpha_n,\hat\beta_m)
-\bar\MK_c^\epsilon(\alpha,\beta)
\right|
\leq
C_d\Lambda_{d,\sigma}(\epsilon)
\left(\frac1{\sqrt n}+\frac1{\sqrt m}\right).
```

Thus fixed temperature gives a parametric rate, while the prefactor grows only
polynomially as $\epsilon\downarrow0$.
:::

:::{dropdown} Proof Sketch
Dual optimality bounds a one-marginal perturbation by the empirical process
indexed by normalized entropic potentials. Mena--Niles-Weed prove polynomial
local Hölder bounds for these potentials under a common subgaussian proxy.
Their covering numbers have a finite Dudley integral, hence the empirical
process is $O(n^{-1/2})$ with constant $C_d(1+\sigma^{q_d})$ at
$\epsilon=1$. The rescaling $x\mapsto x/\sqrt\epsilon$ gives the displayed
$\Lambda_{d,\sigma}(\epsilon)$. Perturbing both marginals and applying the
same estimate to the cross and two self terms yields the debiased result.
:::

### Sample Complexity of Estimating OT Maps

The preceding estimates concern transport values. For map estimation, one
solves the empirical dual problem for potentials
$(\mathbf f_{n,m}^\epsilon,\mathbf g_{n,m}^\epsilon)\in\RR^n\times\RR^m$, with
$\epsilon=0$ denoting the unregularized Kantorovich problem, and then uses the
soft $c$-transform as an out-of-sample extrapolator.

For the quadratic cost $c_2(x,y)=\norm{x-y}^2/2$, let
$\P_{n,m}^\epsilon=(\P_{ij}^\epsilon)$ be the empirical entropic coupling and let
$\mathbf g_{n,m}^\epsilon$ be the target-side dual potential. Define

```{math}
u_{n,m}^\epsilon(x)
=
-\epsilon\log
\sum_j b_j
\exp\left(
\frac{\mathbf g_{n,m,j}^\epsilon-c_2(x,Y_j)}{\epsilon}
\right),
\qquad
T_{n,m}^\epsilon(x)=x-\nabla u_{n,m}^\epsilon(x).
```

Equivalently, subtracting the quadratic marginal terms turns $c_2$ into the
bilinear cost $c_{\rm ip}(x,y)=-\langle x,y\rangle$. With the sign convention
used here, the associated soft convex potential is

```{math}
\varphi_{n,m}^\epsilon(x)
=
\frac12\norm{x}^2-u_{n,m}^\epsilon(x)
=
\epsilon\log\sum_j b_j
\exp\left(
\frac{\langle x,Y_j\rangle+\mathbf g_{n,m,j}^\epsilon-\frac12\norm{Y_j}^2}{\epsilon}
\right),
\qquad
T_{n,m}^\epsilon=\nabla\varphi_{n,m}^\epsilon .
```

Differentiating this log-sum-exp gives the explicit soft barycentric form

```{math}
T_{n,m}^\epsilon(x)=\sum_j\omega_j^\epsilon(x)Y_j,
\qquad
\omega_j^\epsilon(x)=
\frac{b_j e^{(\mathbf g_{n,m,j}^\epsilon-c_2(x,Y_j))/\epsilon}}
{\sum_k b_k e^{(\mathbf g_{n,m,k}^\epsilon-c_2(x,Y_k))/\epsilon}} .
```

At a sampled point $X_i$, Sinkhorn normalization gives

```{math}
T_{n,m}^\epsilon(X_i)=\frac1{a_i}\sum_jP_{ij}^\epsilon Y_j,
```

which is the barycentric projection of the entropic plan. At $\epsilon=0$,
the hard $c$-transform is generally nondifferentiable: away from Laguerre
boundaries its gradient selects one target site, whereas the barycentric
projection of an optimal unregularized plan may average several target sites
when a row splits. The consistency statement is therefore formulated directly
for barycentric projections. It uses uniform empirical weights; deterministic
nonuniform weights require the corresponding entropy bound.

(prop-empirical-barycentric-map-consistency)=
:::{admonition} Proposition: Consistency of Empirical Barycentric Maps
:class: important
Let $\Omega\subset\RR^d$ be compact, let $\alpha,\beta\in\Pp_2(\Omega)$, and
assume that $\alpha$ is absolutely continuous. Let $\phi$ be a Brenier
potential and choose a bounded Borel subgradient selection
$T(x)\in\partial\phi(x)$, which equals the unique Brenier map at every
differentiability point. If uniform empirical measures
$\hat\alpha_n,\hat\beta_m$ converge to $\alpha,\beta$ in $\Wass_2$, if
$\epsilon_{n,m}\to0$ with
$\epsilon_{n,m}\log(\min\{n,m\})\to0$, and if
$\bar T_{n,m}^{\epsilon}$ is the barycentric projection of the empirical
entropic coupling, then

```{math}
\int\norm{\bar T_{n,m}^{\epsilon}(x)-T(x)}^2\,d\hat\alpha_n(x)
\longrightarrow0.
```

The analogous backward statement holds when $\beta$ is also absolutely
continuous.
:::

:::{dropdown} Proof Sketch
Compare the entropic minimizer with an unregularized empirical optimal plan.
On a uniform $n\times m$ grid, this relative entropy is the mutual information
of two uniform indices and is at most $\min\{\log n,\log m\}$. Thus the entropic
coupling has asymptotically optimal quadratic cost when
$\epsilon\log(\min\{n,m\})\to0$. Any weak limit is therefore an optimal population
plan, hence the Brenier graph $(\operatorname{Id},T)_\#\alpha$. Jensen's
inequality applied to each conditional law reduces the claim to the convergence
of $\iint\norm{y-T(x)}^2\,dP_{n,m}^{\epsilon}(x,y)$. This last convergence is
not a continuity tautology, because the Brenier map is only defined
$\alpha$-a.e. At every differentiability point of $\phi$, the subdifferential
is the singleton $\{\nabla\phi(x)\}$; compactness of the target bounds the
selected subgradients, and the closed-graph property of the subdifferential
then gives continuity of any selected subgradient there. Since convex functions
are differentiable Lebesgue-a.e. and $\alpha$ is absolutely continuous, the
portmanteau theorem for bounded test functions continuous almost everywhere
under the limiting measure gives the desired limit.
:::

Quantitative map rates require stronger stability assumptions on Brenier
potentials. For unregularized map estimation, Hütter--Rigollet,
Deb--Ghosal--Sen, and Manole--Balakrishnan--Niles-Weed--Wasserman obtain,
under smoothness and curvature assumptions, squared $L^2(\alpha)$ risk of
order

```{math}
\mathbb E\norm{\widehat T_n-T_0}_{L^2(\alpha)}^2
\lesssim
\left(n^{-\frac{2s}{2(s-1)+d}}\vee n^{-1}\right)
```

up to logarithms, and this rate is minimax optimal
{cite:p}`hutter2021minimaxOTMaps,deb2021ratesBarycentricMaps,manole2021pluginOTMaps`.
For the Sinkhorn-computable entropic barycentric estimator,
Pooladian--Niles-Weed prove

```{math}
\mathbb E\norm{T_{\epsilon,(n,n)}-T_0}_{L^2(\alpha)}^2
\lesssim
\epsilon^{-d/2}\log(n)n^{-1/2}
+
\epsilon^{(\bar s+1)/2}
+
\epsilon^2\mathcal I_0(\alpha,\beta),
```

with $\bar s=s\wedge3$ {cite:p}`pooladian2021entropicOTMaps`. The first term
is the statistical fluctuation of the entropic map, while the last two terms
are regularization-bias terms. Thus fixed $\epsilon$ gives a parametric
empirical fluctuation for the regularized map, whereas
$\epsilon\simeq n^{-1/(d+\bar s+1)}$ gives a convergent estimator of the
Brenier map. The unregularized case can achieve sharper minimax rates when
combined with enough smooth extension machinery; the regularized estimator is
instead directly Sinkhorn-computable.

(rem-sinkhorn-no-free-lunch)=
:::{admonition} Remark: No free lunch when approximating exact OT
:class: ot4ml-remark

The parametric rate in Proposition {ref}`prop-sinkhorn-sample-rate` holds for fixed $\epsilon$. If the goal is to approximate the unregularized OT value, one must also account for the regularization bias. In a typical bounded-cost finite-dimensional regime,

```{math}
\abs{\bar\MK_\c^\epsilon(\alpha,\beta)-\MK_\c(\alpha,\beta)}
\leq C\epsilon,
\qquad
\EE\abs{\bar\MK_\c^\epsilon(\hat\alpha_n,\hat\beta_n)-\bar\MK_\c^\epsilon(\alpha,\beta)}
\leq C_{d,\sigma}\epsilon^{-p_d}n^{-1/2},
\qquad
p_d\eqdef\left\lceil\frac{5d}{4}\right\rceil+2,
```

where the second estimate is the small-$\epsilon$ form of the polynomial Mena--Niles-Weed bound. Balancing the two terms gives $\epsilon\simeq n^{-1/(2(p_d+1))}$ and total error of order $n^{-1/(2(p_d+1))}$ under this conservative bound. Thus entropic smoothing improves the statistical behavior at fixed scale, and the refined analysis avoids an exponential $e^{C/\epsilon}$ penalty, but approximating exact OT still forces a bias-variance tradeoff whose exponent deteriorates with dimension.
:::


The interactive demo below is only a scaling guide: change the dimension to see the
exact-OT exponent flatten, and change $\epsilon$ to move the Sinkhorn bias
floor against its parametric fluctuation term.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** This exploratory panel is a scaling guide. Use dimension, sample size, and epsilon to compare statistical fluctuation with regularization bias.
:::

### Sliced Wasserstein

For $P_\theta(x)=\langle\theta,x\rangle$ and normalized surface measure
$\sigma$ on $\mathbb S^{d-1}$, define

```{math}
\SW_p(\alpha,\beta)^p
=
\int_{\mathbb S^{d-1}}
\Wass_p((P_\theta)_\#\alpha,(P_\theta)_\#\beta)^p,d\sigma(\theta).
```

The construction is studied in {ref}`sec-sliced-wasserstein`. Statistically,
it inherits one-dimensional empirical rates rather than ambient-dimensional
matching rates {cite:p}`nadjahi2019asymptotic,nadjahi2020statistical,manole2019minimax`.

(thm-sliced-sample-complexity)=
:::{admonition} Theorem: Dimension-Free Empirical Rate for Sliced Wasserstein
:class: important
Let $p\geq1$. Assume all one-dimensional projections satisfy

```{math}
\sup_\theta\mathbb E\Wass_p((P_\theta)_\#\hat\alpha_n,(P_\theta)_\#\alpha)^p
\leq A_\alpha n^{-p/2},
\qquad
\sup_\theta\mathbb E\Wass_p((P_\theta)_\#\hat\beta_m,(P_\theta)_\#\beta)^p
\leq A_\beta m^{-p/2}.
```

Then

```{math}
\mathbb E|\SW_p(\hat\alpha_n,\hat\beta_m)-\SW_p(\alpha,\beta)|
\leq A_\alpha^{1/p}n^{-1/2}+A_\beta^{1/p}m^{-1/2}.
```

For $p=1$, bounded support implies the assumption. For $p=2$, a sufficient
condition is the uniform projected Bobkov--Ledoux $J_2$ bound

```{math}
\sup_\theta\int_0^1
\left[
\frac{u(1-u)}{h_{\alpha,\theta}(Q_{\alpha,\theta}(u))^2}
+\frac{u(1-u)}{h_{\beta,\theta}(Q_{\beta,\theta}(u))^2}
\right]\,du<\infty.
```
:::

:::{dropdown} Proof
The triangle inequality reduces the claim to two one-sample sliced distances.
Jensen's inequality moves expectation inside the spherical integral, after
which the assumed projected bounds apply. For $p=1$, use the
Dvoretzky--Kiefer--Wolfowitz inequality and
$\Wass_1=\int|F_{\hat\alpha_n}-F_\alpha|$. For $p=2$, use the
one-dimensional $J_2$ quantile-process estimate
{cite:p}`BobkovLedoux2019EmpiricalKantorovich`.
:::


(rem-sliced-direction-sample-budget)=
:::{admonition} Remark: Directions are another sample budget
:class: ot4ml-remark

The theorem concerns the statistical samples used to form $\hat\alpha_n$ and $\hat\beta_m$. In computation one also replaces the spherical average in the definition of $\SW_p$ by an empirical average over $L$ random directions. For bounded support, the resulting Monte-Carlo error for $\SW_p^p$ is of order $L^{-1/2}$, independently of $d$, because it is just the average of bounded one-dimensional costs. This should not be read as saying that a small number of directions captures full $\Wass_2$ geometry in high dimension. Even the exact sliced distance is an averaged projected geometry, not a bi-Lipschitz surrogate for $\Wass_2$ uniformly in dimension; see Proposition {ref}`prop-sliced-wasserstein-metric` and {ref}`par-sliced-intrinsic-length`. Moreover, if a discrepancy is visible only inside a spherical cap of angular radius $\delta$, the probability that $L$ random directions hit it is roughly $1-(1-\sigma(\mathrm{cap}_\delta))^L$, and $\sigma(\mathrm{cap}_\delta)$ scales like $\delta^{d-1}$ for small caps. For a fixed narrow aperture, it decays exponentially with $d$. Thus estimating the sliced objective is dimension-friendly, while using random slices to approximate a worst direction, a max-sliced distance, or a proxy meant to behave like full $\Wass_2$, reintroduces an angular-covering cost. This is the practical no-free-lunch behind sliced, max-sliced and subspace-sliced variants; see also Section {ref}`sec-sliced-wasserstein`.
:::


(sec-bias-variance-ot)=
## Bias and Variance of OT

The previous section answered a coarse but essential question: how many samples
are needed before an empirical OT quantity is accurate, typically up to
universal constants. We now ask for a finer statistical description. Rather
than only estimating the size of the error, we seek the first expansion of the
plug-in estimator. Given empirical laws $\hat\alpha_n$ and $\hat\beta_m$, and
a scalar OT value $\mathcal V$, this expansion separates the leading statistical bias

```{math}
B_{n,m}(\mathcal V)
\eqdef
\mathbb E\mathcal V(\hat\alpha_n,\hat\beta_m)-\mathcal V(\alpha,\beta)
```

and the centered fluctuation

```{math}
Z_{n,m}(\mathcal V)
\eqdef
\mathcal V(\hat\alpha_n,\hat\beta_m)
-\mathbb E\mathcal V(\hat\alpha_n,\hat\beta_m),
```

for values such as $\mathcal V(\alpha,\beta)=\Wass_p^p(\alpha,\beta)$,
$\mathcal V(\alpha,\beta)=\MK_c(\alpha,\beta)$, or their entropic analogues. This
goes beyond Proposition {ref}`prop-empirical-process-clt`: the empirical
fluctuation is now pushed through a nonlinear, often nonsmooth, transport
value. The resulting law is governed by local differentiability and by the
geometry of the optimal dual face.

### Literature Map

The shape of the limit depends sharply on the analytic regularity of the
transport value. For exact OT on a finite or countable space, the map from
empirical weights to optimal cost is convex and piecewise affine. Sommerfeld
and Munk {cite:p}`sommerfeld2018inference`, and the countable-space extensions
of Tameling--Sommerfeld--Munk
{cite:p}`tameling2017empirical`, show that the natural
limit is a directional delta-method limit: often a support function of a
Gaussian process over an optimal dual face, rather than a Gaussian random
variable. For Euclidean costs, del Barrio--Loubes and collaborators obtain
central-limit theorems for empirical transportation costs under regularity and
uniqueness assumptions on the Kantorovich potentials
{cite:p}`delBarrioLoubes2017clt,delBarrioGonzalezSanzLoubes2021central`.
Entropic regularization makes the problem smoother. For fixed $\epsilon>0$,
the value is differentiable with respect to the marginals, and the limiting
variance is read directly from the entropic dual potentials. This is the point
of view developed by
Bigot--Cazelles--Papadakis, Klatt--Tameling--Munk, Hundrieser--Klatt--Munk, and
Mena--Niles-Weed
{cite:p}`bigot2017central,klatt2020empirical,hundrieser2021limit,mena2019statistical`.
More recent results clarify weak limits beyond smooth costs and second-order
null limits for Sinkhorn divergences
{cite:p}`gonzalezSanzHundrieser2023weak,goldfeld2022limit`. These asymptotic
statements do not replace the dimension-dependent bounds of
{ref}`sec-sample-complexity`; they explain what the leading random object is,
what constants appear, and where the bias comes from.

### Bias Versus Centered Fluctuation

The decomposition

```{math}
\mathcal V(\hat\alpha_n,\hat\beta_m)-\mathcal V(\alpha,\beta)
=
\underbrace{\mathbb E\mathcal V(\hat\alpha_n,\hat\beta_m)-\mathcal V(\alpha,\beta)}_{\text{bias}}
+
\underbrace{\mathcal V(\hat\alpha_n,\hat\beta_m)-\mathbb E\mathcal V(\hat\alpha_n,\hat\beta_m)}_{\text{centered fluctuation}}
```

is elementary, but in OT it is genuinely diagnostic because the two terms may
live on different scales. For the self-distance
$\mathcal V(\hat\alpha_n,\alpha)=\Wass_p^p(\hat\alpha_n,\alpha)$, the population value
is zero and the deterministic bias
$\mathbb E\Wass_p^p(\hat\alpha_n,\alpha)$ is the leading term. On a regular
$d'$-dimensional support, the high-dimensional matching scale is $n^{-p/d'}$
when $d'>2p$, with a critical logarithmic correction when $d'=2p$. Below this
threshold the rate is controlled by empirical-process fluctuations and can be
faster; in one dimension, smooth positive densities give the familiar
quantile-process asymptotics for $\Wass_p^p$, of order $n^{-p/2}$ for $p>1$,
and in particular $n^{-1}$ for $\Wass_2^2$. Thus $p/d'$ is the
high-dimensional matching exponent, not a universal rate formula
{cite:p}`dudley1969speed,fournier2015rate,weed2017sharp`. By contrast, when
$\mathcal V(\alpha,\beta)$ is nonzero and the OT value is differentiable at
$(\alpha,\beta)$, the centered fluctuation is often governed by an ordinary
$n^{-1/2}$ central limit theorem. A ``slow OT statistic'' can therefore have
three distinct causes: a large empirical bias, a nonsmooth directional limit,
or a regularization bias $\MK_c^\epsilon(\alpha,\beta)-\MK_c(\alpha,\beta)$ that
still has to be removed.

(prop-finite-ot-clt)=
:::{admonition} Proposition: Finite-Space Bias and CLT for Exact OT
:class: important
Let $a\in\simplex_n$ and $b\in\simplex_m$ have positive entries, let
$\C\in\RR^{n\times m}$, and define

```{math}
\MKD_\C(a,b)
=
\min_{\P\in\CouplingsD(a,b)}\dotp{\C}{\P}.
```

Let $\hat a_N$ be the empirical histogram of $N$ independent samples from $a$,
while $b$ is fixed. Denote by

```{math}
\mathcal D^\star(a,b)
\eqdef
\argmax_{f_i+g_j\leq \C_{ij}}
\dotp{f}{a}+\dotp{g}{b}
```

the set of optimal dual vectors, modulo the gauge
$(f,g)\mapsto(f+\lambda\ones,g-\lambda\ones)$. If $G_a$ is a centered Gaussian
vector with covariance

```{math}
\mathbb E\,G_aG_a^\top=\operatorname{diag}(a)-aa^\top,
```

then

```{math}
\sqrt N\big(\MKD_\C(\hat a_N,b)-\MKD_\C(a,b)\big)
\Longrightarrow
\sup_{(f,g)\in\mathcal D^\star(a,b)}\dotp{f}{G_a}.
```

Moreover,

```{math}
\sqrt N\big(\mathbb E\MKD_\C(\hat a_N,b)-\MKD_\C(a,b)\big)
\longrightarrow
\mathbb E\sup_{(f,g)\in\mathcal D^\star(a,b)}\dotp{f}{G_a},
```

and the rescaled variance converges to the variance of the same limit.
If the source dual potential $f^\star$ is unique up to constants, the limit is
Gaussian with variance

```{math}
\sigma_{\mathrm{OT}}^2
=
\sum_i a_i
\left(f^\star_i-\sum_k a_k f^\star_k\right)^2.
```

In this differentiable case, the first-order bias vanishes:

```{math}
\mathbb E\MKD_\C(\hat a_N,b)-\MKD_\C(a,b)=o(N^{-1/2}).
```
:::

:::{dropdown} Proof
The multinomial central limit theorem gives

```{math}
\sqrt N(\hat a_N-a)\Longrightarrow G_a,
\qquad
G_a\in\{\xi:\dotp{\ones}{\xi}=0\}.
```

The dual formulation writes $\MKD_\C(\cdot,b)$ as the supremum, over the feasible
polyhedron $f_i+g_j\leq\C_{ij}$, of the affine functions
$a\mapsto\dotp f a+\dotp g b$. Its directional derivative at $a$, in any
tangent direction $h$ with
$\dotp{\ones}{h}=0$, is therefore

```{math}
D_a\MKD_\C(a,b)[h]
=
\sup_{(f,g)\in\mathcal D^\star(a,b)}\dotp f h,
```

which is the finite-dimensional form of Danskin's theorem already used in
{ref}`prop-ot-first-variations-unregularized`. The directional delta method
gives the displayed distributional limit. After fixing a gauge, the relevant
dual face is bounded, so the support functions above have at most linear
growth in the multinomial fluctuation. Uniform integrability then yields
convergence of the first two moments, hence the bias and variance
statements. If $f^\star$ is unique modulo constants, the support function
reduces to the linear form $\dotp{f^\star}{G_a}$. Its expectation is zero, and
the covariance of $G_a$ gives exactly the displayed variance.
:::

The same argument gives the independent two-sample limit. If
$N/(N+M)\to\lambda\in(0,1)$, then, with
$r_{N,M}=\sqrt{NM/(N+M)}$,

```{math}
r_{N,M}\big(\MKD_\C(\hat a_N,\hat b_M)-\MKD_\C(a,b)\big)
\Longrightarrow
\sup_{(f,g)\in\mathcal D^\star(a,b)}
\left(
\sqrt{1-\lambda}\,\dotp{f}{G_a}
+
\sqrt{\lambda}\,\dotp{g}{G_b}
\right),
```

where $G_a$ and $G_b$ are independent multinomial Gaussian limits. When both
dual potentials are unique, the first-order bias is negligible and the
asymptotic variance of the unscaled estimator is

```{math}
\frac{1}{N}\sum_i a_i(f^\star_i-\bar f^\star)^2
+
\frac{1}{M}\sum_j b_j(g^\star_j-\bar g^\star)^2,
\qquad
\bar f^\star=\sum_i a_i f_i^\star,
\quad
\bar g^\star=\sum_j b_j g_j^\star.
```

If the optimal face contains several dual potentials, the limit is the
supremum of a Gaussian process over that face and need not itself be Gaussian.
The leading bias is then the expectation of this supremum divided by the
square-root sample size. This nonsmoothness is the basic reason why inference
for exact OT can remain delicate even on a finite space.

(prop-finite-entropic-ot-clt)=
:::{admonition} Proposition: Finite-Space Bias and CLT for Entropic OT
:class: important
Fix $\epsilon>0$, positive histograms $a,b$, and a finite cost matrix $\C$.
Consider the KL-normalized entropic value

```{math}
\mathcal V_{\C,\epsilon}(a,b)
\eqdef
\min_{\P\in\CouplingsD(a,b)}
\dotp{\C}{\P}+\epsilon\operatorname{KL}(\P|a\otimes b).
```

Let $(f_\epsilon,g_\epsilon)$ be normalized entropic dual potentials for
$\mathcal V_{\C,\epsilon}(a,b)$. If $\hat a_N$ is the empirical histogram of $N$ samples
from $a$, then

```{math}
\sqrt N\big(\mathcal V_{\C,\epsilon}(\hat a_N,b)-\mathcal V_{\C,\epsilon}(a,b)\big)
\Longrightarrow
\mathcal N(0,\sigma_{\epsilon,a}^2),
```

and

```{math}
\mathbb E\mathcal V_{\C,\epsilon}(\hat a_N,b)-\mathcal V_{\C,\epsilon}(a,b)=O(N^{-1}),
\qquad
N\,\operatorname{Var}\big(\mathcal V_{\C,\epsilon}(\hat a_N,b)\big)\to\sigma_{\epsilon,a}^2,
```

where

```{math}
\sigma_{\epsilon,a}^2
=
\sum_i a_i
\left((f_\epsilon)_i-\sum_k a_k(f_\epsilon)_k\right)^2.
```

For two independent empirical histograms, the first-order asymptotic variance is

```{math}
\frac{\sigma_{\epsilon,a}^2}{N}
+
\frac{\sigma_{\epsilon,b}^2}{M},
\qquad
\sigma_{\epsilon,b}^2
=
\sum_j b_j
\left((g_\epsilon)_j-\sum_\ell b_\ell(g_\epsilon)_\ell\right)^2.
```
:::

:::{dropdown} Proof
For positive histograms and fixed $\epsilon>0$, the entropic problem has a
unique optimizer, and the KL-normalized value is smooth on a neighborhood of
$(a,b)$ inside the relative interiors of the simplices.
{ref}`prop-ot-first-variations-entropic` gives

```{math}
D_a\mathcal V_{\C,\epsilon}(a,b)[h]=\dotp{f_\epsilon}{h}.
```

Applying the ordinary delta method to the multinomial CLT
$\sqrt N(\hat a_N-a)\Rightarrow G_a$ gives the one-sample limit
$\dotp{f_\epsilon}{G_a}$, whose variance is the displayed covariance formula.
Fix a relative-interior neighborhood $U$ of $a$ on which the Hessian is
bounded. Multinomial concentration gives
$\mathbb P(\hat a_N\notin U)\leq Ce^{-cN}$. On $U$, Taylor's formula has a
centered linear term and a quadratic remainder bounded by
$C\norm{\hat a_N-a}^2$, whose expectation is $O(N^{-1})$. On the exponentially
unlikely complement, the value remains bounded; on a boundary face, its
natural definition simply discards zero-weight atoms. This proves the bias
bound. The same expansion and bounded multinomial moments give convergence of
the rescaled variance. The two-sample formula follows independently for the
two marginals.
:::

For the entropy-only convention $\MKD_\C^\epsilon$ used in
{ref}`sec-entropic-discrete`,

```{math}
\MKD_\C^\epsilon(a,b)
=\mathcal V_{\C,\epsilon}(a,b)-\epsilon\HD(a)-\epsilon\HD(b).
```

The marginal entropy derivatives described after
{ref}`prop-ot-first-variations-entropic` must therefore be added to the
potentials. For
the debiased Sinkhorn divergence $\bar\MK_c^\epsilon$, the derivative is
instead the difference between cross and self entropic potentials. At the null
$\alpha=\beta$, this first derivative can vanish for the debiased statistic,
and second-order limits then become relevant {cite:p}`goldfeld2022limit`. This
is a useful warning: the asymptotic law is determined not only by a rate, but
also by the local geometry of the functional.

### Three Error Terms When Entropy Estimates Exact OT

If the target is $\MK_c(\alpha,\beta)$ but the statistic uses
$\MK_c^\epsilon$, three errors should be kept separate:

```{math}
\MK_c^\epsilon(\hat\alpha_n,\hat\beta_m)-\MK_c(\alpha,\beta)
=
\underbrace{\MK_c^\epsilon(\alpha,\beta)-\MK_c(\alpha,\beta)}_{\text{regularization bias}}
+
\underbrace{\mathbb E\MK_c^\epsilon(\hat\alpha_n,\hat\beta_m)-\MK_c^\epsilon(\alpha,\beta)}_{\text{statistical bias}}
+
\underbrace{\MK_c^\epsilon(\hat\alpha_n,\hat\beta_m)
-\mathbb E\MK_c^\epsilon(\hat\alpha_n,\hat\beta_m)}_{\text{centered fluctuation}} .
```

Although algebraic, this identity is important statistically. It is
usually read after choosing $\epsilon=\epsilon_n$. For fixed
$\epsilon$, the statistical bias is typically $O(n^{-1}+m^{-1})$ in finite
dimension, and the centered fluctuation is
$O_{\mathbb P}(n^{-1/2}+m^{-1/2})$; boundary events where an empirical finite
histogram has a zero entry have exponentially small probability when the
population weights are positive. The regularization bias disappears only when
$\epsilon\to0$, whereas the variance constants usually deteriorate as
$\epsilon\downarrow0$. This is the asymptotic form of the bias--variance
tradeoff illustrated in {ref}`fig:sinkhorn-bias-variance-tradeoff`.

### What Changes in Continuous Spaces

The finite-dimensional formulas above are not merely toy models; they are the
cleanest template for the general mechanism. Whenever an OT value is Hadamard
differentiable and admits a unique sufficiently regular dual potential
$f^\star$, the empirical-process CLT and the delta method give a first-order
Gaussian limit with one-sample variance
$\operatorname{Var}_\alpha(f^\star(X))$. When differentiability fails, as can
happen for exact OT because the dual optimizer is not unique or because one
studies the degenerate self-distance $\MK_c(\alpha,\alpha)=0$, the limit may be
non-Gaussian or may occur at a slower non-parametric scale. Entropic
regularization smooths the dual potentials and typically restores a
conventional first-order CLT for fixed $\epsilon$, even under weak assumptions
on the cost. If the target is unregularized OT, however, this statistical
expansion must still be balanced against the bias
$\MK_c^\epsilon(\alpha,\beta)-\MK_c(\alpha,\beta)$. Thus
{ref}`sec-sample-complexity` gives dimension-dependent magnitudes, while the
present section identifies the local asymptotic constants and covariance
formulas needed for inference.


(sec-sketching-sinkhorn)=
## Sketching Sinkhorn in Linear Time

The statistical results above explain why entropic OT is attractive at fixed
temperature, but they also expose a computational tension. Sampling the
marginals replaces the input laws by empirical measures and reduces the problem
to finitely many support points; subsampling or coarsening these supports is
governed by the sample-complexity estimates of this chapter. Even after the
supports are fixed, however, a Sinkhorn sweep still costs $O(nm)$, because it
repeatedly applies the Gibbs kernel to vectors. Kernel sketching attacks this
second bottleneck: it keeps the sampled marginals fixed and samples, or
otherwise compresses, the feature representation of the kernel used by
Sinkhorn. With a rank $R$ factorization, $N_{\rm it}$ scaling sweeps cost
$O(N_{\rm it}(n+m)R)$, which is linear in the support sizes only when both the
required rank and the iteration count are controlled. The rank generally
depends on dimension, temperature, and target accuracy.

### PSD Kernels and Ordinary Feature Sketches

The RKHS/MMD section, {ref}`sec-rkhs-mmd`, already used positive semidefinite
kernels to define Hilbertian discrepancies between measures. Recall that a
symmetric kernel $k:\Xx\times\Xx\to\RR$ is positive semidefinite if, for every
finite family $(x_i)_{i=1}^n$, the Gram matrix $(k(x_i,x_j))_{ij}$ is positive
semidefinite. Many scalable kernel methods start from an integral feature
representation

```{math}
k(x,y)=\int_Z \dotp{\phi(x,z)}{\phi(y,z)}_{\RR^p}\,d\xi(z),
\qquad
\phi:\Xx\times Z\to\RR^p,
```

where $\xi$ is a latent distribution. Drawing $z_1,\ldots,z_r\sim\xi$ gives

```{math}
\widetilde k_r(x,y)
=
\frac1r\sum_{\ell=1}^r
\dotp{\phi(x,z_\ell)}{\phi(y,z_\ell)}_{\RR^p}.
```

This is the classical random-feature principle. For data points
$(x_i)_{i=1}^n$, the dense Gram matrix $K=(k(x_i,x_j))_{ij}$ is replaced by
$\widetilde K=\Phi\Phi^\top$, where $\Phi\in\RR^{n\times rp}$ is the sampled
feature matrix with entries
$\Phi_{i,(\ell,q)}=r^{-1/2}\phi_q(x_i,z_\ell)$, $1\leq \ell\leq r$,
$1\leq q\leq p$. The number $r$ of sampled latent variables is thus a second
sample size, distinct from the number of data points. At this stage no
positivity of $\phi$ is assumed; signed or oscillatory features are exactly
what make Fourier sketches useful.

For translation-invariant kernels on $\RR^d$, Bochner's theorem gives the
standard Fourier sketch. If $k(x,y)=\kappa(x-y)$ and
$\kappa(t)=\int e^{i\dotp{\omega}{t}}\,d\Lambda(\omega)$, with $\Lambda$ a
positive spectral measure, one may use real features
$\phi(x,\omega)=(\cos\dotp{\omega}{x},\sin\dotp{\omega}{x})$. For the Gaussian
kernel $k_\sigma(x,y)=\exp(-\norm{x-y}^2/(2\sigma^2))$, this corresponds to
$\omega\sim\mathcal N(0,\sigma^{-2}\Id)$. This random Fourier feature
construction was introduced by Rahimi and Recht to accelerate large-scale
kernel machines {cite:p}`RahimiRecht2007RandomFeatures`; its statistical role
for kernel ridge regression and related supervised methods is analyzed, for
instance, in
{cite:p}`RudiRosasco2017RandomFeatures,AvronKapralovMusco2017RandomFourierKRR`.

### Application to Sinkhorn Kernels

Let

```{math}
\alpha=\sum_{i=1}^n a_i\delta_{x_i},
\qquad
\beta=\sum_{j=1}^m b_j\delta_{y_j},
\qquad
K_{ij}=k_\epsilon(x_i,y_j)\eqdef e^{-c(x_i,y_j)/\epsilon}.
```

Assume here that the weights are positive and that $K_{ij}>0$. The Sinkhorn
scaling equations are

```{math}
u=\frac{a}{Kv},
\qquad
v=\frac{b}{K^\top u},
```

where divisions are componentwise. The factorization used by Sinkhorn is
rectangular, because the source points $x_i$ and target points $y_j$ need not
coincide. Starting from the same sketch
$k(x,y)\simeq r^{-1}\sum_{\ell=1}^r
\dotp{\phi(x,z_\ell)}{\phi(y,z_\ell)}_{\RR^p}$, set $R=rp$ and flatten the
pair $(\ell,q)$ into a single column index. Define

```{math}
(\Phi_X)_{i,(\ell,q)}=r^{-1/2}\phi_q(x_i,z_\ell),
\qquad
(\Phi_Y)_{j,(\ell,q)}=r^{-1/2}\phi_q(y_j,z_\ell).
```

Then $\Phi_X\in\RR^{n\times R}$, $\Phi_Y\in\RR^{m\times R}$, and

```{math}
\widetilde K_{ij}
=
(\Phi_X\Phi_Y^\top)_{ij}
=
\frac1r\sum_{\ell=1}^r
\dotp{\phi(x_i,z_\ell)}{\phi(y_j,z_\ell)}_{\RR^p}
\simeq K_{ij}.
```

When the two supports are the same, one has $\Phi_X=\Phi_Y=\Phi$ and this
reduces to the symmetric Gram approximation $\widetilde K=\Phi\Phi^\top$. In
the rectangular case, if $K$ is replaced by the rank-$R$ factorization
$\widetilde K=\Phi_X\Phi_Y^\top$, the two matrix-vector products are evaluated
as

```{math}
\widetilde K v=\Phi_X(\Phi_Y^\top v),
\qquad
\widetilde K^\top u=\Phi_Y(\Phi_X^\top u),
```

so each scaling sweep costs $O((n+m)R)$ operations and stores only
$O((n+m)R)$ numbers. The difficulty is that Sinkhorn is not a generic kernel
method: it divides by $\widetilde K v$ and, in dual variables, applies
logarithms. Thus one needs $\widetilde K_{ij}>0$, preferably with a relative
error on the entries, because $-\epsilon\log K_{ij}$ is the effective cost.
This is a more stringent requirement than the usual spectral or Frobenius
approximation of a PSD Gram matrix.

The next proposition is not a substitute for the sharp low-rank Sinkhorn
theory. It is an elementary concentration lemma whose role is to isolate the
two facts that matter for Sinkhorn: positivity of the approximate kernel and
accuracy after taking logarithms. The full algorithmic statements rely on more
refined Nyström or Gaussian-kernel approximations together with stability of
Sinkhorn scaling
{cite:p}`AltschulerBachRudiWeed2018QuadraticTransport,AltschulerBachRudiNilesWeed2019NystromSinkhorn`.

(prop-sinkhorn-sketch-positive-guarantee)=
:::{admonition} Proposition: Finite Positivity and Logarithmic Accuracy
:class: important
Let $\epsilon>0$ and $K_{ij}=\mathbb E h_{ij}(Z)>0$ for
$1\leq i\leq n$, $1\leq j\leq m$, where $Z$ has law $\xi$ and
$|h_{ij}(Z)|\leq M$ almost surely. Set
$c_{ij}=-\epsilon\log K_{ij}$, and let

```{math}
\widetilde K_{ij}=\frac1r\sum_{\ell=1}^r h_{ij}(Z_\ell),
\qquad
Z_1,\ldots,Z_r\sim\xi.
```

Then, for every $\eta>0$,

```{math}
\mathbb P\left(\max_{i,j}|\widetilde K_{ij}-K_{ij}|>\eta\right)
\leq
2nm\exp\left(-\frac{r\eta^2}{2M^2}\right).
```

In particular, if $\kappa\eqdef\min_{i,j}K_{ij}>0$, $\eta<\kappa$, and the
event above does not occur, then $\widetilde K$ is entrywise positive. If
moreover $\eta\leq\kappa/2$, then the sketched cost
$\widetilde c_{ij}=-\epsilon\log \widetilde K_{ij}$ satisfies

```{math}
\max_{i,j}|\widetilde c_{ij}-c_{ij}|
\leq
\frac{2\epsilon\eta}{\kappa}.
```

If, more sharply, the relative variables
$\zeta_{ij}(Z)\eqdef h_{ij}(Z)/K_{ij}$ satisfy
$|\zeta_{ij}(Z)|\leq\psi$ almost surely, then for every
$0<\delta\leq1/2$,

```{math}
\mathbb P\left(
\max_{i,j}\left|\frac{\widetilde K_{ij}}{K_{ij}}-1\right|>\delta
\right)
\leq
2nm\exp\left(-\frac{r\delta^2}{2\psi^2}\right).
```

On the complementary event,

```{math}
\widetilde K_{ij}>0
\quad\hbox{and}\quad
\max_{i,j}|\widetilde c_{ij}-c_{ij}|
\leq
2\epsilon\delta .
```
:::

:::{dropdown} Proof
For a fixed pair $(i,j)$, Hoeffding's inequality applied to bounded variables
in $[-M,M]$ gives

```{math}
\mathbb P\left(|\widetilde K_{ij}-K_{ij}|>\eta\right)
\leq 2\exp\left(-\frac{r\eta^2}{2M^2}\right).
```

A union bound over the $nm$ entries gives the first claim. If
$\max_{ij}|\widetilde K_{ij}-K_{ij}|\leq\eta<\kappa$, then
$\widetilde K_{ij}\geq\kappa-\eta>0$. Writing
$\widetilde K_{ij}=K_{ij}(1+s_{ij})$, one has
$|s_{ij}|\leq\eta/\kappa\leq1/2$, hence
$|\log(1+s_{ij})|\leq2|s_{ij}|$, which proves the absolute logarithmic bound.
Applying the same Hoeffding argument to $\zeta_{ij}(Z)$, whose expectation is
$1$, gives the relative estimate. On the corresponding event,
$\widetilde K_{ij}=K_{ij}(1+s_{ij})$ with
$|s_{ij}|\leq\delta\leq1/2$, so positivity and
$\epsilon|\log(1+s_{ij})|\leq2\epsilon\delta$ follow.
:::

This proposition pinpoints the obstruction. When $\epsilon$ is small or the
data diameter is large, $\kappa=\min K_{ij}$ can be exponentially small, so an
ordinary signed sketch may need a very large $r$ just to keep all entries
positive. What Sinkhorn really needs is relative control of the kernel,
equivalently additive control of the sketched costs. Positive features do not
solve the whole approximation problem, but they remove the most basic failure
mode, negative entries in $\widetilde K$. The log-normal positive features
below are unbounded, so this Hoeffding proposition does not apply to them
without truncation or a different concentration argument.

Available worst-case bounds retain explicit dimension dependence. For the quadratic
cost on points contained in a radius-$R$ ball of $\RR^d$, the Nyström analysis
of Altschuler, Bach, Rudi and Niles-Weed
{cite:p}`AltschulerBachRudiNilesWeed2019NystromSinkhorn` studies
$K_{ij}=\exp(-\eta\norm{x_i-x_j}^2)$ and bounds the effective rank by a
quantity of the form

```{math}
r_\ast(X,\eta,\epsilon_0)
\lesssim
\left(\eta R^2+\log(n/\epsilon_0)\right)^d
```

up to universal constants and harmless logarithms. Thus the resulting Sinkhorn computation is near-linear in $n$ once this rank
is fixed, but the required rank is polynomial in the inverse kernel bandwidth,
with exponent $d$ and only logarithmic dependence on $n$ in this bound. When the same machinery is used to approximate unregularized
quadratic OT to additive accuracy $\tau$, one takes $\eta$ of order
$\tau^{-1}\log n$, so the complexity contains a factor $\tau^{-O(d)}$, often
summarized informally as an $\epsilon^{-d}$-type dependence on the target
precision. The same work also explains why this can be much better on data
with lower intrinsic dimension.

### Positive Features and Total Positivity

A positive feature sketch asks for more than positive semidefiniteness. In
finite dimension, let

```{math}
\mathrm{DNN}_n=\{A\in\RR^{n\times n}: A\succeq0,\ A_{ij}\geq0\},
\qquad
\mathrm{CP}_n=\{BB^\top: B\in\RR_+^{n\times q}\hbox{ for some }q\geq1\}.
```

Matrices in $\mathrm{DNN}_n$ are doubly nonnegative, while matrices in
$\mathrm{CP}_n$ are completely positive. One always has
$\mathrm{CP}_n\subset\mathrm{DNN}_n$, with equality for $n\leq4$ and strict
inclusion for $n\geq5$
{cite:p}`BermanShakedMonderer2003,AnstreicherBurerDuer2009`. Checking
membership in the completely positive cone is computationally hard: strong
membership is NP-hard, and weak membership for the completely positive cone and
its copositive dual is NP-hard {cite:p}`DickinsonGijben2014`.

For kernels, it is useful to distinguish the two corresponding notions. A
kernel $k$ is *doubly positive* if every finite Gram matrix belongs to
$\mathrm{DNN}_n$, i.e. if $k$ is PSD and pointwise nonnegative. It is *totally
positive* in the positive-feature sense if every finite Gram matrix belongs to
$\mathrm{CP}_n$. This terminology should not be confused with Karlin's
classical total positivity, which concerns nonnegativity of all minors of an
ordered kernel {cite:p}`Karlin1968TotalPositivity`; it is a
complete-positive-type condition, studied for instance in
{cite:p}`DeCorteOliveiraFilhoVallentin2022`.

The positive-feature construction of Scetbon and Cuturi
{cite:p}`ScetbonCuturi2020PositiveFeatures` makes the reason for this
definition direct. If

```{math}
k(x,y)=\int_Z\dotp{\phi(x,z)}{\phi(y,z)}_{\RR^p}\,d\xi(z),
\qquad
\phi(x,z)\in\RR_+^p,
```

then every finite Gram matrix is a conic combination of rank-one matrices
$vv^\top$ with $v\geq0$, and hence is completely positive. Conversely, on a
fixed finite set, $K\in\mathrm{CP}_n$ is exactly the existence of a
nonnegative factorization $K=BB^\top$. Thus total positivity is the relevant
finite-sample kernel condition behind positive random features. For
rectangular source--target matrices, one applies the same statement to the
Gram matrix on the union of the sampled source and target points and then
extracts its $n\times m$ cross block.

(prop-totally-positive-kernel-closure)=
:::{admonition} Proposition: Basic Closure of Totally Positive Kernels
:class: important
Nonnegative sums and pointwise products of totally positive kernels are totally
positive. The same holds for measurable nonnegative mixtures whenever the
resulting kernel is finite. In particular, positive autocorrelations

```{math}
k(x,y)=\int g(u-x)g(u-y)\,du,
\qquad g\geq0,
```

and all nonnegative mixtures of such kernels are totally positive.
:::

:::{dropdown} Proof
For sums, concatenate the nonnegative features and rescale them by the square
roots of the nonnegative coefficients. For products, tensor the nonnegative
features:

```{math}
\dotp{\phi_1(x,z_1)}{\phi_1(y,z_1)}
\dotp{\phi_2(x,z_2)}{\phi_2(y,z_2)}
=
\dotp{\phi_1(x,z_1)\otimes\phi_2(x,z_2)}
      {\phi_1(y,z_1)\otimes\phi_2(y,z_2)}.
```

The tensor feature remains entrywise nonnegative. A measurable mixture is a
limit of conic combinations in the closed completely positive cone on every
finite point set. The autocorrelation formula is already a positive feature
representation with latent variable $u$ and scalar feature $g(u-x)$.
:::

The Gaussian Gibbs kernels used by Sinkhorn admit an especially simple positive
feature representation, which is the construction exploited by Scetbon and
Cuturi {cite:p}`ScetbonCuturi2020PositiveFeatures`. The same construction
extends to the generalized Gaussian kernels
$e^{-\norm{x-y}^p/\epsilon}$ for $0<p\leq2$, because these kernels are
mixtures of Gaussian kernels. This is the Schoenberg--Bernstein mechanism
behind the positive definiteness of radial stable kernels
{cite:p}`schoenberg38,berg84harmonic`.

(prop-gaussian-positive-features)=
:::{admonition} Proposition: Generalized Gaussian Positive Features
:class: important
Let $0<p\leq2$, $\epsilon>0$, and

```{math}
k_{p,\epsilon}(x,y)
=
\exp\left(-\frac{\norm{x-y}^p}{\epsilon}\right),
\qquad x,y\in\RR^d .
```

Set $a=p/2\in(0,1]$. Let $S_a$ be the positive $a$-stable random variable
normalized by

```{math}
\mathbb E\left(e^{-tS_a}\right)=e^{-t^a},
\qquad t\geq0,
```

and set $\Lambda=\epsilon^{-1/a}S_a$. Denote by $\nu_{a,\epsilon}$ the law
of $\Lambda$. Then

```{math}
\exp\left(-\frac{t^a}{\epsilon}\right)
=
\int_0^{+\infty} e^{-\lambda t}\,d\nu_{a,\epsilon}(\lambda),
\qquad t\geq0.
```

Equivalently, for a nonnegative random variable
$\Lambda\sim\nu_{a,\epsilon}$,

```{math}
k_{p,\epsilon}(x,y)
=
\mathbb E_\Lambda\exp\left(-\Lambda\norm{x-y}^2\right).
```

Fix a centering point $x_0\in\RR^d$, let $Z\sim\mathcal N(0,\Id_d)$,
independent of $\Lambda$, and set

```{math}
q_x(\Lambda)=\sqrt{2\Lambda}\,(x-x_0),
\qquad
\phi_p(x,\Lambda,Z)
=
\exp\left(\dotp{Z}{q_x(\Lambda)}-\norm{q_x(\Lambda)}^2\right).
```

Then

```{math}
k_{p,\epsilon}(x,y)
=
\mathbb E_{\Lambda,Z}
\left(\phi_p(x,\Lambda,Z)\phi_p(y,\Lambda,Z)\right).
```

Thus $k_{p,\epsilon}$ is totally positive in the complete-positive sense. In
particular, if $(\Lambda_\ell,Z_\ell)_{\ell=1}^r$ are i.i.d. copies of
$(\Lambda,Z)$, then

```{math}
\widetilde k_{p,\epsilon}(x,y)
=
\sum_{\ell=1}^r
\varphi_\ell(x)\varphi_\ell(y),
\qquad
\varphi_\ell(x)=r^{-1/2}\phi_p(x,\Lambda_\ell,Z_\ell),
```

is an unbiased nonnegative feature sketch of $k_{p,\epsilon}$.

For $p=2$, the mixing law reduces to the Dirac mass
$\nu_{1,\epsilon}=\delta_{1/\epsilon}$, which recovers the usual Gaussian
feature formula.
:::

:::{dropdown} Proof
The function $s\mapsto e^{-s^a}$ is completely monotone for $0<a\leq1$.
Bernstein's theorem therefore gives the Laplace-transform representation of a
positive $a$-stable random variable $S_a$. The scaling
$\Lambda=\epsilon^{-1/a}S_a$ gives

```{math}
\mathbb E e^{-t\Lambda}
=
\exp\left(-\frac{t^a}{\epsilon}\right),
```

which is the displayed representation by $\nu_{a,\epsilon}$. Applying this
identity with $t=\norm{x-y}^2$ gives the Gaussian-mixture formula.

Conditionally on $\Lambda=\lambda$, the Gaussian moment-generating function
gives

```{math}
\begin{aligned}
\mathbb E_Z\left(\phi_p(x,\lambda,Z)\phi_p(y,\lambda,Z)\right)
&=
\exp\left(-\norm{q_x(\lambda)}^2-\norm{q_y(\lambda)}^2\right)
\mathbb E_Z\left(\exp\dotp{Z}{q_x(\lambda)+q_y(\lambda)}\right) \\
&=
\exp\left(-\frac12\norm{q_x(\lambda)-q_y(\lambda)}^2\right)
=
\exp\left(-\lambda\norm{x-y}^2\right).
\end{aligned}
```

Taking the expectation over $\Lambda$ gives $k_{p,\epsilon}$. Since $\phi_p$ is
positive, this is a positive-feature representation; hence every finite Gram
matrix is completely positive. The Monte-Carlo sketch is just the empirical
average of this representation.
:::

:::{admonition} Remark: The range $0<p\leq2$
:class: ot4ml-remark

The restriction $0<p\leq2$ is essential. Schoenberg's theorem says that
$x\mapsto e^{-\gamma\norm{x}^p}$ is positive definite on every Euclidean
space precisely in this range. For $p>2$, some finite Gram matrices have a
negative eigenvalue, so no universal positive-feature factorization should be
expected.

For $p<2$, the positive stable mixing variable is heavy tailed. For
$x\neq x_0$,
$$
\mathbb E_Z\phi_p(x,\Lambda,Z)^4
=\exp\left(8\Lambda\norm{x-x_0}^2\right),
$$
whose expectation over $\Lambda$ is infinite. Unbiasedness therefore does not
give a finite-variance Monte-Carlo sketch; practical implementations need
truncation, quadrature, variance reduction, or another positive
representation. The $p=2$ case avoids this issue because
$\Lambda=1/\epsilon$ is deterministic.
:::


Choosing $x_0$ near the data can reduce the dynamic range of the features
without changing the kernel. More generally, Gaussian scale mixtures give many
radial totally positive kernels, including standard covariance families used
in Gaussian processes {cite:p}`rasmussen2006gaussian`.

The gap between doubly positive and totally positive kernels is real. On the
circle, consider

```{math}
k_\lambda(x,y)=\lambda+\cos^2\left(\frac{x-y}{2}\right),
\qquad \lambda>0.
```

This kernel is PSD and strictly positive pointwise, since
$\cos^2(t/2)=(1+\cos t)/2$ has nonnegative Fourier coefficients and $\lambda$
adds a positive constant mode. For $\lambda=1/20$, however, its Gram matrix on
five equally spaced points is not completely positive. The Horn copositive
matrix $H$ satisfies $\langle H,B\rangle\geq0$ for every completely positive
matrix $B$, but the five-point Gram matrix $K$ gives

```{math}
\langle H,K\rangle
=
\frac{21}{4}-\frac{5\sqrt5}{2}<0.
```

Thus $K\in\mathrm{DNN}_5\setminus\mathrm{CP}_5$, and the kernel is doubly
positive but not totally positive.

Figure {ref}`fig:sinkhorn-doubly-positive-counterexample` displays this finite certificate and the separating witness.

(fig:sinkhorn-doubly-positive-counterexample)=
```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-doubly-positive-counterexample")
```

Figure {ref}`fig:sinkhorn-doubly-positive-counterexample` displays this finite
certificate.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change the offset to compare an entrywise positive PSD
kernel matrix with the Horn certificate obstructing complete positivity.
:::

<iframe class="ot4ml-live-frame" title="Interactive doubly-positive counterexample panel" src="../live/sinkhorn-doubly-positive-counterexample.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

### Positive Sketches for Sinkhorn

For the $p$-power cost $c_p(x,y)=\norm{x-y}^p$, with $0<p\leq2$, the Sinkhorn
Gibbs kernel is the generalized Gaussian kernel

```{math}
k_{p,\epsilon}(x,y)
=
\exp\left(-\frac{\norm{x-y}^p}{\epsilon}\right).
```

The factor $1/p$, often used in the definition of $W_p^p$, only rescales
$\epsilon$. For $p\geq1$, this is the usual $p$-Wasserstein power cost; for
$0<p<1$, it should be read simply as a concave power transport cost.
Proposition {ref}`prop-gaussian-positive-features` gives a positive
factorization of this kernel. With $r$ draws
$(\Lambda_\ell,Z_\ell)\sim\nu_{p/2,\epsilon}\otimes\mathcal N(0,\Id_d)$,
define the normalized features

```{math}
\varphi_\ell(x)=r^{-1/2}\phi_p(x,\Lambda_\ell,Z_\ell),
\qquad 1\leq \ell\leq r .
```

They satisfy

```{math}
\widetilde k_{p,\epsilon}(x,y)
=
\sum_{\ell=1}^r\varphi_\ell(x)\varphi_\ell(y)
\geq0,
\qquad
\mathbb E[\widetilde k_{p,\epsilon}(x,y)]=k_{p,\epsilon}(x,y).
```

The corresponding matrices $(\Phi_X)_{i\ell}=\varphi_\ell(x_i)$ and
$(\Phi_Y)_{j\ell}=\varphi_\ell(y_j)$ give a positive factorization
$\widetilde K=\Phi_X\Phi_Y^\top$. Sinkhorn can therefore be run safely on the
sketched kernel, and the resulting plan is represented as

```{math}
\widetilde P
=
\diag(u)\Phi_X\Phi_Y^\top\diag(v)
=
LR^\top,
\qquad
L=\diag(u)\Phi_X,
\quad
R=\diag(v)\Phi_Y .
```

The output is the exact entropic coupling for the sketched effective cost
$\widetilde c_{p,\epsilon}=-\epsilon\log\widetilde k_{p,\epsilon}$, and it
approximates the original $W_p$-type entropic problem only insofar as this
logarithmic kernel approximation is accurate. This route is complementary to
worst-case near-linear Sinkhorn analyses {cite:p}`altschuler2017near`, low-rank
Gaussian-kernel approximations for quadratic transport
{cite:p}`AltschulerBachRudiWeed2018QuadraticTransport`, and factored-coupling
models in which the coupling itself is constrained to have low rank
{cite:p}`scetbon2021lowrank`.

Figure {ref}`fig:sinkhorn-positive-feature-sketching` compares the exact Sinkhorn plan with positive-feature approximations and displays the associated approximation of the ground cost.

(fig:sinkhorn-positive-feature-sketching)=
```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-positive-feature-sketching")
```

Figure {ref}`fig:sinkhorn-positive-feature-sketching` shows the object that is
changed by this approximation. The top row shows the entropic couplings, while
the bottom row shows the matching effective costs
$\widetilde c_\epsilon(x,y)=-\epsilon\log\widetilde k_\epsilon(x,y)$ with black
level sets. The dense Gaussian Gibbs kernel gives the usual entropic plan and
the quadratic cost $|x-y|^2$. A sufficiently rich rank-$40$ positive-feature
sketch remains visually close to both, whereas rank-$10$ and rank-$3$ sketches
still enforce the prescribed marginals after Sinkhorn scaling but progressively
lose the geometric concentration of the true coupling because the logarithmic
kernel approximation has become too coarse.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change the regularization and random seed to compare the
exact Gibbs kernel with positive low-rank sketches and their effective
logarithmic costs.
:::

<iframe class="ot4ml-live-frame" title="Interactive positive-feature Sinkhorn sketch panel" src="../live/sinkhorn-positive-sketching.html" loading="lazy" style="width:100%;height:700px;border:0;display:block;"></iframe>

### Connection with Linear Attention

The same algebra appears in transformer attention, studied later from a
continuous-depth transport viewpoint in
{ref}`sec-transformer-depth-evolution`. A softmax attention matrix has entries
proportional to $\exp(\dotp{q_i}{k_j})$; linear-attention methods
replace this positive kernel by features $\Phi(q_i)^\top\Phi(k_j)$, so that
attention can be applied as $\Phi(Q)(\Phi(K)^\top V)$ rather than by forming
the full $n\times n$ matrix
{cite:p}`Katharopoulos2020LinearAttention,Choromanski2021Performer,Wang2020Linformer,Xiong2021Nystromformer`.
Sinkhorn sketching is the transport analogue of this idea: replace the Gibbs
matrix by a positive feature factorization, keep only the scaling vectors and
feature factors, and control the approximation in the logarithmic scale
relevant to entropic potentials. The transport case is more constrained,
however, since the approximate kernel is reused inside nonlinear normalizations
until the prescribed marginals are reached for the sketched problem.
