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

Before discussing sample complexity in Section {ref}`sec-sample-complexity`, it
is useful to separate consistency from rates. If $X_1,\ldots,X_n$ are i.i.d.
samples with common law $\alpha$, the
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
speed.

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
$\norm{f_h'}_\infty+\norm{f_h''}_\infty\leq C$
{cite:p}`chen2011normal`. Writing
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
$\alpha$, define

```{math}
\alpha_n=(D_{1/\sqrt n})_\sharp\alpha^{*n},
\qquad n\geq1,
```

so that $\alpha_1=\alpha$. For Bernoulli input, the distance is evaluated by
the exact quantile formula and atom masses are divided by the current lattice
spacing in the density display. For continuous-uniform input, the normalized
convolution is an affine image of the Irwin--Hall distribution, whose density
is, up to rescaling, a cardinal B-spline of degree $n-1$, and the absolute CDF
difference is integrated numerically. Neither computation uses Monte Carlo
sampling.

(fig:statistical-berry-esseen-w1)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("statistical-berry-esseen-w1", width=920)
```

*Sharp lattice and density central-limit asymptotics in $\Wass_1$.* The two
left panels show $\alpha_1$, $\alpha_2$, and $\alpha_6$ for symmetric
Bernoulli and continuous-uniform inputs; the gray curve is the standard
Gaussian density. The right panel compares the exact numerical distances
(solid) with the sharp equivalents in {eq}`eq-bernoulli-uniform-sharp-w1-clt`
(dashed). The Bernoulli curve follows its lattice rate $1/(2\sqrt n)$, while
the continuous-uniform curve approaches
$(1+4e^{-3/2})/(10\sqrt{2\pi}\,n)$.
:::

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

For $n\geq2$, $p\geq1$, and $d\geq1$, define the worst-case empirical scale

```{math}
:label: eq-empirical-wasserstein-scale
r_{n,p,d}
\eqdef
\begin{cases}
n^{-1/(2p)}, & d<2p,\\
n^{-1/(2p)}(\log(1+n))^{1/p}, & d=2p,\\
n^{-1/d}, & d>2p.
\end{cases}
```

The following proposition turns this scale into uniform one-sample and
two-sample bounds for empirical OT.

(prop-empirical-ot-rate)=
:::{admonition} Proposition: Empirical OT Has Intrinsic-Dimension Value Rates
:class: important
Let $p\geq1$ and let $\mathcal X\subset\mathbb R^d$ be compact. For
$\alpha\in\mathcal P(\mathcal X)$, let $\hat\alpha_n$ be its empirical law.
Then

```{math}
:label: eq-empirical-wasserstein-moment-scale
\sup_{\alpha\in\mathcal P(\mathcal X)}
\mathbb E\!\left[\Wass_p(\hat\alpha_n,\alpha)^p\right]^{1/p}
\leq C_{\mathcal X,p,d}\,r_{n,p,d}.
```

Consequently, if $\alpha,\beta$ are supported on $[0,1]^d$ and
$\hat\alpha_n,\hat\beta_m$ are independent empirical measures, then

```{math}
\mathbb E\!\left[
\left|\Wass_p(\hat\alpha_n,\hat\beta_m)-\Wass_p(\alpha,\beta)\right|^p
\right]^{1/p}
\lesssim_{p,d} r_{n,p,d}+r_{m,p,d}.
```
:::

:::{admonition} Remark: Adaptation to Intrinsic Dimension
:class: note
If the supports have covering numbers of order $O(\delta^{-d'})$ at scale
$\delta$, the same estimates hold with $d'$ in place of $d$, under the
corresponding volume-growth and moment assumptions. In particular,
distributions supported on a regular compact $d'$-dimensional submanifold
have rate $r_{n,p,d'}$. Empirical OT therefore adapts to the support
dimension rather than the ambient Euclidean dimension
{cite:p}`dudley1969speed,weed2017sharp`.
:::

The following multiscale estimate makes the mechanism behind the $\Wass_1$
bound explicit.

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
$j$ moves by at most $\sqrt d\,2^{-j}$, and its total amount is bounded by
the sum of the child-cell imbalances. The residual at the finest unresolved
scale has mass at most one and moves by at most $\sqrt d\,2^{-J}$.
:::

:::{dropdown} Proof of the empirical-OT rate proposition
General empirical Wasserstein moment estimates prove the one-sample statement
for arbitrary $p$ {cite:p}`dereich2013constructive,fournier2015rate`; reverse
triangle and Minkowski then give the two-sample estimate. We give the direct
multiscale proof for $p=1$. The triangle inequality reduces the result to
$\mathbb E\Wass_1(\hat\alpha_n,\alpha)$. For each dyadic cell $Q$,

```{math}
\mathbb E|\hat\alpha_n(Q)-\alpha(Q)|
\leq \sqrt{\alpha(Q)/n}.
```

Summing by Cauchy--Schwarz and applying
{ref}`prop-dyadic-partition-w1` gives

```{math}
\mathbb E\Wass_1(\hat\alpha_n,\alpha)
\lesssim_d
2^{-J}+n^{-1/2}\sum_{j=0}^{J-1}2^{j(d/2-1)}.
```

Optimizing $J$ yields the three displayed regimes for $p=1$.
:::

Figure {ref}`fig:sinkhorn-bias-variance-tradeoff` gives a numerical overview of these regimes: exact OT exhibits dimension-dependent empirical fluctuations, whereas MMD and fixed-temperature Sinkhorn divergences lie much closer to the parametric $n^{-1/2}$ scale.

(fig:sinkhorn-bias-variance-tradeoff)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-bias-variance-tradeoff")
```

*Empirical fluctuations in dimensions three and six.* For each sample size
$n$, two independent empirical measures are drawn from the same standard
Gaussian law. Exact OT follows a slower dimension-dependent scale, while MMD
and the fixed-$\epsilon$ Sinkhorn divergence behave closer to the parametric
$n^{-1/2}$ guide. This is a statistical illustration, not a solver benchmark.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Vary dimension, sample budget and temperature to compare the curse-of-dimensionality OT guide with the parametric fluctuation and bias floor of entropic OT.
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
$\rho$ satisfying $1/2\leq\rho\leq3/2$. For each $n\geq1$, let $\mathfrak E_n$
be the class of measurable estimators
$\widetilde\alpha_n:([0,1]^d)^n\to\mathcal P([0,1]^d)$. Then

```{math}
\inf_{\widetilde\alpha_n\in\mathfrak E_n}
\sup_{\alpha\in\mathcal A}
\mathbb E_{(X_1,\ldots,X_n)\sim\alpha^{\otimes n}}
\left[
\Wass_1\big(\widetilde\alpha_n(X_1,\ldots,X_n),\alpha\big)
\right]
\geq c_d n^{-1/d},
```

where the expectation is over i.i.d. samples $X_i\sim\alpha$.
:::

:::{dropdown} Proof Sketch
Partition the cube into $M=m^d$ cells of width $h=1/m$, and put an
independent signed, zero-mean bump of fixed small amplitude in each cell.
Kantorovich--Rubinstein duality gives a separation of order
$h^{d+1}$ per differing sign. Neighboring experiments have one-sample KL
divergence $O(h^d)$. Pinsker's inequality ({ref}`thm-pinsker`) shows that
choosing $M\asymp n$ keeps their $n$-sample total variation bounded away from
one. Assouad's lemma then gives
$Mh^{d+1}=h\asymp n^{-1/d}$.
:::

### Leveraging Smoothness

For a Sobolev-smooth density, convolving the empirical measure at bandwidth
$h$ creates a bias of order $h^{s+1}$ but reduces the empirical fluctuation to
order $n^{-1/2}h^{1-d/2}$. Balancing these terms selects
$h_n\asymp n^{-1/(d+2s)}$, which improves on the empirical $n^{-1/d}$ rate
when $d>2$
{cite:p}`nilesweed2019minimaxSmooth,divol2022measure`.

(prop-smooth-plugin-w1-rate)=
:::{admonition} Proposition: Smoothed Plug-In Rates
:class: important
Let $d\geq3$, $0<s\leq1$, and suppose that $\alpha,\beta$ have densities in a
bounded subset of $H^s(\mathbb T^d)$. Let $\kappa$ be a smooth symmetric
probability density with finite second moment and rapidly decaying Fourier
transform, and let $\kappa_h$ be the periodization of
$h^{-d}\kappa(\cdot/h)$. For empirical measures formed from i.i.d. samples of
$\alpha$ and $\beta$, define

```{math}
\tilde\alpha_n=\hat\alpha_n\ast\kappa_{h_n},
\qquad
\tilde\beta_m=\hat\beta_m\ast\kappa_{h_m}.
```

Then

```{math}
\mathbb E W_1(\tilde\alpha_n,\alpha)
\leq
C\left(h_n^{s+1}+n^{-1/2}h_n^{1-d/2}\right),
```

and likewise for $\beta$. With $h_n\asymp n^{-1/(d+2s)}$ and
$h_m\asymp m^{-1/(d+2s)}$,

```{math}
\mathbb E\left|
\Wass_1(\tilde\alpha_n,\tilde\beta_m)-\Wass_1(\alpha,\beta)
\right|
\leq
C\left(n^{-\frac{s+1}{d+2s}}+m^{-\frac{s+1}{d+2s}}\right).
```
:::

:::{dropdown} Proof Sketch
Kantorovich--Rubinstein duality bounds $W_1$ by the negative Sobolev norm
$\dot H^{-1}$. Since
$\mathbb E\rho_{\tilde\alpha_n}=\rho_\alpha\ast\kappa_h$, Fourier estimates
give kernel bias $O(h^{s+1})$, while Parseval's identity gives

```{math}
\mathbb E
\left\|
\rho_{\tilde\alpha_n}-\rho_\alpha\ast\kappa_h
\right\|_{\dot H^{-1}}^2
\lesssim
\frac1n\sum_{k\neq0}
\frac{|\widehat\kappa(hk)|^2}{4\pi^2|k|^2}
\lesssim
\frac{h^{2-d}}n.
```

Balancing the bias with the square root of this fluctuation yields the stated
bandwidth and rate.
:::

The restriction $s\leq1$ permits a nonnegative symmetric kernel and hence a
genuine probability estimator. Exploiting higher smoothness requires
higher-order, generally signed kernels followed by a positivity correction.
Dimensions one and two have separate parametric or logarithmic regimes
{cite:p}`divol2022measure`.

This statistical acceleration has a numerical price. For a Gaussian kernel,
$\tilde\alpha_n$ is a mixture of $n$ Gaussians, and OT between two such
mixtures has no closed form in general. A direct particle implementation draws
$M$ independent vectors $\xi_{i,j}\sim\mathcal N(0,\mathrm{Id}_d)$ around each
observation and defines

```{math}
\tilde\alpha_{n,M}
=
\frac1{nM}\sum_{i=1}^n\sum_{j=1}^M
\delta_{X_i+h_n\xi_{i,j}}.
```

Here addition is understood modulo $\mathbb Z^d$. Conditionally on the
observations, convexity of $W_1$ under mixing, together with translation,
scaling and the $1$-Lipschitz projection onto the torus, gives

```{math}
\mathbb E W_1(\tilde\alpha_{n,M},\tilde\alpha_n)
\leq
h_n\,\mathbb E W_1\left(
\frac1M\sum_{j=1}^M\delta_{\xi_j},
\mathcal N(0,\mathrm{Id}_d)
\right)
\lesssim_d h_nM^{-1/d}.
```

The last estimate is the moment form of the empirical OT rate
{cite:p}`fournier2015rate`. At the optimal bandwidth
$h_n\asymp n^{-1/(d+2s)}$, keeping this extra error below the statistical rate
is guaranteed by
$M\gtrsim n^{sd/(d+2s)}$. This componentwise strategy therefore uses
$N_{\rm comp}=nM\gtrsim n^{1+sd/(d+2s)}$ particles per measure.

Approximating every Gaussian separately is conservative. One can instead
sample or quantize the whole smoothed mixture using $N$ points. In dimension
$d>2$, the corresponding $W_1$ error is of order $N^{-1/d}$, up to
dimension-dependent constants {cite:p}`graf2000foundationsquantization`.
Thus target accuracy $\delta$ requires $N\gtrsim\delta^{-d}$, whereas the
componentwise construction uses
$N_{\rm comp}\gtrsim\delta^{-d-2s/(s+1)}$. The global strategy is cheaper, but
its particle count remains exponential in $d$ at fixed accuracy. Forming and
storing a dense $N\times N$ transport kernel costs $O(N^2)$ work and memory,
and each direct Sinkhorn scaling costs another $O(N^2)$ operations. Fast
kernel summation or low-rank approximations may reduce this matrix cost, but
without additional structure they do not remove the underlying $N^{-1/d}$
discretization barrier.

### MMD

MMD contains no transport optimization: its square is a combination of
expectations of kernel evaluations, estimated empirically by sums of kernel
values. Ordinary Monte Carlo averaging therefore gives a dimension-free
parametric rate for bounded kernels. This sharply contrasts with exact
empirical OT, whose value is defined through an optimization problem and whose
worst-case $W_1$ plug-in bias in dimension $d>2$ decays only as $n^{-1/d}$,
corresponding to a sample requirement of order $\delta^{-d}$ at accuracy
$\delta$. The constants for MMD still depend on the kernel and its bandwidth,
and changing the kernel changes the discrepancy being estimated.

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

:::

:::{dropdown} Proof Sketch
Dual optimality bounds a one-marginal perturbation by the empirical process
indexed by normalized entropic potentials. One can show that these potentials
obey polynomial local Hölder bounds under a common subgaussian proxy
{cite:p}`mena2019statistical`.
Their covering numbers have a finite Dudley integral, hence the empirical
process is $O(n^{-1/2})$ with constant $C_d(1+\sigma^{q_d})$ at
$\epsilon=1$. The rescaling $x\mapsto x/\sqrt\epsilon$ gives the displayed
$\Lambda_{d,\sigma}(\epsilon)$. Perturbing both marginals and applying the
same estimate to the cross and two self terms yields the debiased result.
:::

For fixed $\epsilon>0$, the empirical fluctuation is therefore parametric,
while the prefactor deteriorates only polynomially as $\epsilon\downarrow0$.
Compact support is a special case: if both supports lie in a common ball
$B(z,R)$, translating them by $-z$ leaves the quadratic transport problem
unchanged, and the subgaussian assumption holds with
$\sigma=R/\sqrt{2d\log 2}=O(R)$. Genevay--Chizat--Bach--Cuturi--Peyré
established the compactly supported result, and Mena--Niles-Weed extended it to
the subgaussian setting above
{cite:p}`genevay2018sample,mena2019statistical`.

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

### Sample Complexity of Estimating OT Maps

The preceding estimates concern transport values. For map estimation, one
solves the empirical discrete dual problem {eq}`eq-dual` or its entropic
counterpart {eq}`eq-dual-formulation` for potentials
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

Quantitative map convergence requires stronger regularity than consistency.
The following result gives a direct guarantee for the Sinkhorn-based estimator
defined above {cite:p}`pooladian2021entropicOTMaps`.

(prop-entropic-map-rate)=
:::{admonition} Proposition: Finite-Sample Rate for the Entropic Map
:class: important
Assume that $\alpha$ and $\beta$ have densities on a common compact set
$\Omega$, both bounded above and with $\rho_\beta$ bounded below away from
zero. Let $T=\nabla\phi$ be the quadratic Brenier map, assume
$\phi\in C^2(\Omega)$ and $\phi^*\in C^{s+1}(\Omega)$ for some $s>1$, and
suppose

```{math}
\mu\mathrm{Id}_d\preceq\nabla^2\phi(x)\preceq L\mathrm{Id}_d
\qquad (x\in\Omega).
```

Set $\bar s=s\wedge3$, assume
$\mathcal I_{\rm geo}(\alpha,\beta)<+\infty$, and draw $n$ independent
samples from each measure. If

```{math}
\epsilon_n\asymp n^{-1/(d+\bar s+1)},
```

then the estimator $T_{n,n}^{\epsilon_n}$ defined above satisfies

```{math}
\mathbb E\norm{T_{n,n}^{\epsilon_n}-T}_{L^2(\alpha)}^2
\lesssim
\bigl(1+\mathcal I_{\rm geo}(\alpha,\beta)\bigr)
n^{-\frac{\bar s+1}{2(d+\bar s+1)}}\log n.
```
:::

This estimator is directly computable from Sinkhorn potentials. Under stronger
modeling and smoothing assumptions, unregularized estimators can attain sharper
minimax rates
{cite:p}`hutter2021minimaxOTMaps,deb2021ratesBarycentricMaps,manole2021pluginOTMaps`.

### Sliced Wasserstein

For $P_\theta(x)=\langle\theta,x\rangle$ and normalized surface measure
$\sigma$ on $\mathbb S^{d-1}$, define

```{math}
\SW_p(\alpha,\beta)^p
=
\int_{\mathbb S^{d-1}}
\Wass_p((P_\theta)_\#\alpha,(P_\theta)_\#\beta)^p,d\sigma(\theta).
```

The construction is studied in {ref}`sec-sliced-wasserstein`. For $p=1$, it
inherits a particularly clean one-dimensional empirical-CDF rate rather than
an ambient-dimensional matching rate
{cite:p}`nadjahi2019asymptotic,nadjahi2020statistical,manole2019minimax`.

(thm-sliced-sample-complexity)=
:::{admonition} Theorem: Dimension-Free Empirical Rate for Sliced Wasserstein-1
:class: important
Let $\alpha,\beta\in\mathcal P(\mathbb R^d)$ satisfy
$\operatorname{supp}(\alpha)\cup\operatorname{supp}(\beta)\subset B(0,R)$,
and let $\hat\alpha_n$ and $\hat\beta_m$ be their empirical measures from $n$
and $m$ i.i.d. samples, respectively. Then

```{math}
\mathbb E|\SW_1(\hat\alpha_n,\hat\beta_m)-\SW_1(\alpha,\beta)|
\leq R\left(\frac1{\sqrt n}+\frac1{\sqrt m}\right).
```
:::

:::{dropdown} Proof
The triangle inequality reduces the claim to the two one-sample terms
$\SW_1(\hat\alpha_n,\alpha)$ and $\SW_1(\hat\beta_m,\beta)$. Fix a direction
$\theta$, and let $F_\theta$ and $\hat F_{\theta,n}$ be the CDFs of
$(P_\theta)_\#\alpha$ and $(P_\theta)_\#\hat\alpha_n$. Their supports lie in
$[-R,R]$, and the one-dimensional CDF formula gives

```{math}
\mathbb E\Wass_1((P_\theta)_\#\hat\alpha_n,(P_\theta)_\#\alpha)
=\int_{-R}^R\mathbb E|\hat F_{\theta,n}(s)-F_\theta(s)|\,ds
\leq\int_{-R}^R\sqrt{\frac{F_\theta(s)(1-F_\theta(s))}{n}}\,ds
\leq\frac R{\sqrt n}.
```

Here $n\hat F_{\theta,n}(s)$ is binomial with success probability
$F_\theta(s)$. Integrating over $\theta$ yields
$\mathbb E\SW_1(\hat\alpha_n,\alpha)\leq R/\sqrt n$. The same argument for
$\beta$ concludes the proof.
:::


(rem-sliced-direction-sample-budget)=
:::{admonition} Remark: Directions are another sample budget
:class: ot4ml-remark

The theorem concerns the statistical samples used to form $\hat\alpha_n$ and
$\hat\beta_m$. In computation, draw i.i.d. directions
$\theta_1,\ldots,\theta_L$ with law $\sigma$, independently of the data, and
use the random estimator

```{math}
:label: eq-empirical-direction-sliced-w1
\widehat{\SW}_1^{\,L}(\hat\alpha_n,\hat\beta_m)
\eqdef
\frac1L\sum_{r=1}^L
\Wass_1((P_{\theta_r})_\#\hat\alpha_n,(P_{\theta_r})_\#\hat\beta_m).
```

Conditionally on the samples, the summands are i.i.d., take values in
$[0,2R]$, and have mean $\SW_1(\hat\alpha_n,\hat\beta_m)$. Their conditional
variance is at most $R^2$, and therefore

```{math}
\mathbb E\left[
\left|\widehat{\SW}_1^{\,L}(\hat\alpha_n,\hat\beta_m)
-\SW_1(\hat\alpha_n,\hat\beta_m)\right|
\,\middle|\,\hat\alpha_n,\hat\beta_m
\right]
\leq \frac R{\sqrt L}.
```

Combining this estimate with Theorem {ref}`thm-sliced-sample-complexity` gives

```{math}
:label: eq-sliced-joint-sample-direction-rate
\mathbb E\left|
\widehat{\SW}_1^{\,L}(\hat\alpha_n,\hat\beta_m)-\SW_1(\alpha,\beta)
\right|
\leq
R\left(\frac1{\sqrt L}+\frac1{\sqrt n}+\frac1{\sqrt m}\right).
```

Thus the directional approximation preserves the empirical rate provided
$L\gtrsim\min\{n,m\}$. More precisely, its contribution is no larger than the
two-sample contribution whenever
$L\geq(n^{-1/2}+m^{-1/2})^{-2}$. If only $\alpha$ is sampled while $\beta$ is
known, the corresponding bound is $R(L^{-1/2}+n^{-1/2})$, and retaining the
$n^{-1/2}$ rate requires $L\gtrsim n$.
:::


(sec-bias-variance-ot)=
## Bias and Variance of OT

### Bias, Variance and Approximation Errors

The previous section answered a coarse but essential question: how many samples
are needed before an empirical OT quantity is accurate, typically up to
universal constants. We now ask for a finer statistical description of the
KL-normalized entropic OT value $\MK_c^\epsilon$ defined in
{eq}`eq-entropic-generic-web`, with the convention
$\MK_c^0\eqdef\MK_c$ for unregularized OT. Fixing $c$, $\alpha$ and $\beta$,
define the statistical bias

```{math}
B_{n,m}^\epsilon
\eqdef
\mathbb E\MK_c^\epsilon(\hat\alpha_n,\hat\beta_m)
-\MK_c^\epsilon(\alpha,\beta)
```

and the centered fluctuation

```{math}
Z_{n,m}^\epsilon
\eqdef
\MK_c^\epsilon(\hat\alpha_n,\hat\beta_m)
-\mathbb E\MK_c^\epsilon(\hat\alpha_n,\hat\beta_m).
```

If the target is the exact cost but the statistic is entropically regularized,
these quantities isolate the three sources of error:

```{math}
\MK_c^\epsilon(\hat\alpha_n,\hat\beta_m)-\MK_c^0(\alpha,\beta)
=
\underbrace{\MK_c^\epsilon(\alpha,\beta)-\MK_c^0(\alpha,\beta)}_{\text{regularization bias}}
+
\underbrace{B_{n,m}^\epsilon}_{\text{statistical bias}}
+
\underbrace{Z_{n,m}^\epsilon}_{\text{centered fluctuation}}.
```

For the debiased Sinkhorn divergence, define $\bar B_{n,m}^\epsilon$ and
$\bar Z_{n,m}^\epsilon$ by replacing $\MK_c^\epsilon$ with
$\bar\MK_c^\epsilon$ above; the same decomposition then holds with bars. It is
usually read after choosing a temperature $\epsilon=\epsilon_n$. At fixed
$\epsilon>0$ and on finite supports, the statistical bias is typically
$O(n^{-1}+m^{-1})$, while the centered fluctuation is
$O_{\mathbb P}(n^{-1/2}+m^{-1/2})$. The regularization bias disappears only
when $\epsilon\to0$, whereas the fluctuation constants can deteriorate in this
limit. This is the bias--variance tradeoff illustrated in
{ref}`fig:sinkhorn-bias-variance-tradeoff`.

The remainder of this section analyzes the latter two terms. The superscript
records their dependence on the regularization strength. The empirical
fluctuation is pushed through the nonlinear transport value $\MK_c^\epsilon$,
which can be nonsmooth at $\epsilon=0$. Its limiting law is governed by local
differentiability and by the geometry of the optimal dual potentials.

For exact OT on finite spaces, empirical central-limit theorems follow from a
directional delta method {cite:p}`sommerfeld2018inference,tameling2017empirical`;
fixed positive entropic regularization makes the transport value smooth on the
interiors of the marginal simplices
{cite:p}`bigot2017central,klatt2020empirical,hundrieser2021limit,mena2019statistical`.
The following statement isolates the Gaussian regime common to both settings:
at zero temperature, uniqueness of the dual potentials turns the directional
derivative into an ordinary linear derivative.

(prop-finite-ot-clt)=
:::{admonition} Proposition: Finite-Space Bias and CLT for OT
:class: important
Let

```{math}
\alpha=\sum_{i=1}^{N}a_i\delta_{x_i},
\qquad
\beta=\sum_{j=1}^{M}b_j\delta_{y_j},
```

where all weights are positive and $c$ is finite on the product support. Let
$\hat\alpha_n$ and $\hat\beta_n$ be the independent empirical laws of $n$
i.i.d. samples from $\alpha$ and $\beta$, respectively. Fix $\epsilon\geq0$,
with $\MK_c^0=\MK_c$, and let $(f_\epsilon^\star,g_\epsilon^\star)$ be optimal
dual potentials for $\MK_c^\epsilon(\alpha,\beta)$. When $\epsilon=0$, assume
that this pair is unique up to the additive gauge; for $\epsilon>0$, this
uniqueness follows after fixing the gauge. Define

```{math}
\mathsf{v}_\epsilon
\eqdef
\sum_{i=1}^{N}a_i\bigl(f_\epsilon^\star(x_i)-\bar f_\epsilon\bigr)^2
+
\sum_{j=1}^{M}b_j\bigl(g_\epsilon^\star(y_j)-\bar g_\epsilon\bigr)^2,
```

where $\bar f_\epsilon=\sum_i a_i f_\epsilon^\star(x_i)$ and
$\bar g_\epsilon=\sum_j b_j g_\epsilon^\star(y_j)$. Then, as
$n\to+\infty$ with $N,M$ fixed,

```{math}
\sqrt n\,B_{n,n}^\epsilon\longrightarrow0,
\qquad
\sqrt n\,Z_{n,n}^\epsilon\Longrightarrow\mathcal N(0,\mathsf{v}_\epsilon),
\qquad
n\,\operatorname{Var}\!\left[\MK_c^\epsilon(\hat\alpha_n,\hat\beta_n)\right]
\longrightarrow\mathsf{v}_\epsilon.
```

Equivalently,

```{math}
\sqrt n\left(
\MK_c^\epsilon(\hat\alpha_n,\hat\beta_n)
-
\MK_c^\epsilon(\alpha,\beta)
\right)
\Longrightarrow\mathcal N(0,\mathsf{v}_\epsilon).
```

For every fixed $\epsilon>0$, one moreover has
$B_{n,n}^\epsilon=O(n^{-1})$.
:::

:::{dropdown} Proof
Writing $\hat a_n$ and $\hat b_n$ for the two empirical histograms, the
independent multinomial central-limit theorems give

```{math}
\sqrt n(\hat a_n-a,\hat b_n-b)
\Longrightarrow
(G_a,G_b),
```

where $G_a$ and $G_b$ are independent centered Gaussian vectors with covariance
matrices $\operatorname{diag}(a)-aa^\top$ and
$\operatorname{diag}(b)-bb^\top$. Proposition
{ref}`prop-ot-first-variations-unregularized` gives the directional derivative
for every $\epsilon\geq0$. It is linear under the assumed uniqueness at
$\epsilon=0$, and automatically at positive temperature. Thus,

```{math}
D\MK_c^\epsilon(\alpha,\beta)[h,k]
=
\sum_i f_\epsilon^\star(x_i)h_i
+
\sum_j g_\epsilon^\star(y_j)k_j.
```

The delta method therefore gives the Gaussian limit
$\sum_i f_\epsilon^\star(x_i)(G_a)_i+
\sum_j g_\epsilon^\star(y_j)(G_b)_j$. Independence and the two multinomial
covariance formulas give exactly $\mathsf{v}_\epsilon$.

It remains to justify convergence of the moments, which does not follow from
convergence in distribution alone. Set
$R=\max_{i,j}c(x_i,y_j)-\min_{i,j}c(x_i,y_j)$. Exact dual potentials may be
replaced by their $c$-transforms, and entropic potentials by their soft
$c$-transforms; in either case their oscillations are at most $R$. Since
differences of histograms have zero sum, integrating the corresponding
subgradient bounds along segments in the two marginal simplices gives, for any
histograms $(a',b')$ and their associated measures $(\alpha',\beta')$,

```{math}
\left|\MK_c^\epsilon(\alpha',\beta')-\MK_c^\epsilon(\alpha,\beta)\right|
\leq
\frac{R}{2}\left(\|a'-a\|_1+\|b'-b\|_1\right).
```

Because $N,M$ are fixed, the fourth moments of
$\sqrt n\|\hat a_n-a\|_1$ and $\sqrt n\|\hat b_n-b\|_1$ are uniformly
bounded. The squared rescaled OT values are therefore uniformly integrable.
The Gaussian limit then yields convergence of the means and second moments,
which proves the assertions for $B_{n,n}^\epsilon$, $Z_{n,n}^\epsilon$, and the
variance.

For fixed $\epsilon>0$, the entropic value is twice continuously differentiable
in a neighborhood of the positive pair $(a,b)$. A second-order Taylor expansion
on this neighborhood has a uniformly bounded remainder; its linear term has
zero expectation and
$\mathbb E(\|\hat a_n-a\|^2+\|\hat b_n-b\|^2)=O(n^{-1})$. The probability
of leaving the neighborhood is exponentially small, and the preceding global
Lipschitz bound controls its contribution. Hence
$B_{n,n}^\epsilon=O(n^{-1})$.
:::

The uniqueness assumption at $\epsilon=0$ is substantive. Without it, the
directional delta method gives the generally non-Gaussian limit

```{math}
\sup_{(f,g)\in\mathcal D_c(\alpha,\beta)}
\left\{
\sum_i f(x_i)(G_a)_i+
\sum_j g(y_j)(G_b)_j
\right\},
```

where $\mathcal D_c(\alpha,\beta)$ is the set of optimal dual pairs modulo the
additive gauge. Its expectation need not vanish, so the exact-OT bias can then
have order $n^{-1/2}$ rather than being negligible at the central-limit scale
{cite:p}`sommerfeld2018inference,tameling2017empirical`.

### Fixed Support Versus a Continuum

{ref}`prop-finite-ot-clt` keeps the support sizes $N$ and $M$ fixed while $n$
grows. More explicitly, its limiting variable is

```{math}
\sum_{i=1}^{N}f_\epsilon^\star(x_i)(G_a)_i
+
\sum_{j=1}^{M}g_\epsilon^\star(y_j)(G_b)_j,
\qquad
\begin{cases}
\operatorname{Cov}(G_a)=\operatorname{diag}(a)-aa^\top,\\
\operatorname{Cov}(G_b)=\operatorname{diag}(b)-bb^\top.
\end{cases}
```

The variance does not necessarily diverge with $N,M$: for a uniformly bounded
cost, normalized dual potentials have bounded oscillation, hence
$\mathsf{v}_\epsilon$ remains bounded. What fails to be uniform is the
differentiability argument. If $a_{\min}=\min_i a_i$ and
$b_{\min}=\min_j b_j$, then

```{math}
\mathbb P[\text{some source or target atom is unobserved}]
\leq
N e^{-n a_{\min}}+M e^{-n b_{\min}}.
```

For nearly uniform weights, making this probability vanish already requires
both $n\gg N\log N$ and $n\gg M\log M$. Moreover, exact-dual uniqueness margins can
close as the supports become dense, while entropic Hessian bounds can
deteriorate with the smallest weights and as $\epsilon\downarrow0$. Thus the
constant hidden in the bias estimate may grow even when the first-order
variance stays bounded.

There is therefore no distribution-free passage from this multinomial CLT to
arbitrary continuous laws. Continuous CLTs nevertheless hold under hypotheses
ensuring stable unique potentials, with limiting variance
$\operatorname{Var}_\alpha(f_\epsilon^\star)+
\operatorname{Var}_\beta(g_\epsilon^\star)$
in the independent two-sample setting
{cite:p}`delBarrioLoubes2017clt,delBarrioGonzalezSanzLoubes2021central,mena2019statistical,gonzalezSanzHundrieser2023weak`.
The first-order description ceases to be informative in degenerate regimes. For
instance, when $\epsilon=0$, $c=\dist^p$, and $\alpha=\beta$, the first
derivative vanishes; the two-sample empirical cost
$\MK_{\dist^p}(\hat\alpha_n,\hat\beta_n)$ is instead governed by the
dimension-dependent matching behavior studied in {ref}`sec-sample-complexity`.
This is where the curse of dimensionality re-enters. The first derivative of
the debiased Sinkhorn divergence also vanishes under the null, so its nontrivial
limit is of second order
{cite:p}`goldfeld2022limit`.

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

This is the classical random-feature principle. Given two point families
$(x_i)_{i=1}^n$ and $(y_j)_{j=1}^m$, define the rectangular cross-kernel matrix
$K\in\RR^{n\times m}$ by $K_{ij}=k(x_i,y_j)$. Set $R=rp$, flatten
$(\ell,q)$ into a single feature index, and define

```{math}
:label: eq-rectangular-feature-sketch-web
(\Phi_X)_{i,(\ell,q)}=r^{-1/2}\phi_q(x_i,z_\ell),
\qquad
(\Phi_Y)_{j,(\ell,q)}=r^{-1/2}\phi_q(y_j,z_\ell),
\qquad
\widetilde K=\Phi_X\Phi_Y^\top.
```

Here $\Phi_X\in\RR^{n\times R}$, $\Phi_Y\in\RR^{m\times R}$, and

```{math}
\widetilde K_{ij}
=
\frac1r\sum_{\ell=1}^r
\dotp{\phi(x_i,z_\ell)}{\phi(y_j,z_\ell)}_{\RR^p}
=
\widetilde k_r(x_i,y_j).
```

Although $K$ is generally rectangular and hence is not itself a Gram matrix,
it is a cross-block of the Gram matrix evaluated on the union of the two point
families. When the families coincide, $\Phi_X=\Phi_Y=\Phi$, and the construction
reduces to the symmetric approximation $\widetilde K=\Phi\Phi^\top$. The number
$r$ of sampled latent variables is thus a second sample size, distinct from $n$
and $m$. At this stage no positivity of $\phi$ is assumed; signed or oscillatory
features are exactly what make Fourier sketches useful.

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

The following concentration bound assesses the entrywise quality of the
rectangular sketch {eq}`eq-rectangular-feature-sketch-web`. This is the relevant
control when the kernel will subsequently be used inside logarithms or
componentwise divisions.

(prop-sinkhorn-sketch-positive-guarantee)=
:::{admonition} Proposition: Entrywise Accuracy of Rectangular Feature Sketches
:class: important
Let $z_1,\ldots,z_r$ be independent with law $\xi$, and let
$K_{ij}=k(x_i,y_j)$ and $\widetilde K$ be the rectangular kernel matrix and
sketch defined above. Assume that, for some $M<+\infty$,

```{math}
\left|\dotp{\phi(x_i,z)}{\phi(y_j,z)}_{\RR^p}\right|\leq M
\qquad
\text{for all }(i,j)\text{ and }\xi\text{-a.e. }z.
```

If $K_{\min}\eqdef\min_{i,j}K_{ij}>0$, then, for every
$0<\delta\leq1/2$,

```{math}
:label: eq-rectangular-sketch-relative-concentration-web
\mathbb P\left(
\max_{i,j}\left|\frac{\widetilde K_{ij}}{K_{ij}}-1\right|>\delta
\right)
\leq
2nm\exp\left(-\frac{rK_{\min}^2\delta^2}{2M^2}\right).
```

On the complementary event, $\widetilde K$ is entrywise positive and, for
every $\epsilon>0$,

```{math}
\max_{i,j}
\left|-\epsilon\log\widetilde K_{ij}+\epsilon\log K_{ij}\right|
\leq 2\epsilon\delta.
```
:::

:::{dropdown} Proof
For each fixed $(i,j)$, the summands in the definition of
$\widetilde K_{ij}$ have expectation $K_{ij}$ and lie in $[-M,M]$.
Hoeffding's inequality therefore gives

```{math}
\mathbb P\left(
\left|\widetilde K_{ij}-K_{ij}\right|>\delta K_{ij}
\right)
\leq
2\exp\left(-\frac{r\delta^2K_{ij}^2}{2M^2}\right)
\leq
2\exp\left(-\frac{r\delta^2K_{\min}^2}{2M^2}\right).
```

A union bound over the $nm$ entries proves
{eq}`eq-rectangular-sketch-relative-concentration-web`. On its complementary
event, write $\widetilde K_{ij}=K_{ij}(1+s_{ij})$, where
$|s_{ij}|\leq\delta\leq1/2$. Hence $\widetilde K_{ij}>0$, and
$|\log(1+s_{ij})|\leq2|s_{ij}|$ gives the logarithmic estimate.
:::

### Application to Sinkhorn Kernels

Let

```{math}
\alpha=\sum_{i=1}^n a_i\delta_{x_i},
\qquad
\beta=\sum_{j=1}^m b_j\delta_{y_j}.
```

Specialize the preceding construction to the Gibbs kernel
$k_\epsilon(x,y)=e^{-c(x,y)/\epsilon}$, assumed to be PSD and to admit the
displayed feature representation. Thus the rectangular matrix defined above is
precisely the Sinkhorn kernel, $K_{ij}=k_\epsilon(x_i,y_j)$. Assume that the
weights and the entries of $K$ are positive. Recall the Sinkhorn scaling
equations {eq}`eq-sinkhorn-web`:

```{math}
u=\frac{a}{Kv},
\qquad
v=\frac{b}{K^\top u},
```

where divisions are componentwise. Replacing $K$ by its rank-$R$ sketch
{eq}`eq-rectangular-feature-sketch-web`, the two matrix-vector products are
evaluated as

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

The interaction between kernel accuracy and scaling accuracy can be quantified
for Gaussian kernels. The following specialization of the Nyström--Sinkhorn
analysis of Altschuler, Bach, Rudi and Niles-Weed
{cite:p}`AltschulerBachRudiWeed2018QuadraticTransport,AltschulerBachRudiNilesWeed2019NystromSinkhorn`
uses $\epsilon$ for the entropic temperature and $\tau$ for the requested
numerical accuracy. We write $\widetilde O$ for bounds up to logarithmic factors
in $N$, $1/\tau$, and $1/\delta$.

(prop-gaussian-nystrom-sinkhorn-complexity)=
:::{admonition} Proposition: Accuracy and Complexity of Gaussian Nyström--Sinkhorn
:class: important
Let $\alpha=\sum_{i=1}^n a_i\delta_{x_i}$ and
$\beta=\sum_{j=1}^m b_j\delta_{y_j}$ have positive weights, assume that all
their support points lie in the ball $B(0,D)\subset\RR^d$, and set $N=n+m$.
For the quadratic cost $c(x,y)=\norm{x-y}^2$, fix $\epsilon>0$ and
$\tau,\delta\in(0,1)$. There is a randomized Nyström construction of an
entrywise-positive rank-$R$ approximation $\widetilde K$ of the Gaussian kernel
$K_{ij}=e^{-\norm{x_i-y_j}^2/\epsilon}$, followed by approximate Sinkhorn
scaling and rounding, which returns a feasible coupling
$\widehat P\in\CouplingsD(a,b)$ and a value $\widehat W$ such that, with
probability at least $1-\delta$,

```{math}
0\leq
\dotp{C}{\widehat P}
+\epsilon\operatorname{KL}(\widehat P\,|\,a\otimes b)
-\MK_c^\epsilon(\alpha,\beta)
\leq\tau,
\qquad
\left|\widehat W-\MK_c^\epsilon(\alpha,\beta)\right|\leq\tau.
```

The sketch rank can be chosen so that

```{math}
:label: eq-gaussian-nystrom-rank-web
R
\lesssim_d
\left(
1+\frac{D^2}{\epsilon}
+\log\frac{N(1+D^2)}{\tau}
\right)^d
\log\frac{N}{\delta},
```

and the complete computation uses

```{math}
\widetilde O\left(
NR\left(R+\frac{D^4}{\epsilon\tau}\right)
\right)
\quad\text{operations and}\quad
O\left(N(R+d)\right)
\quad\text{memory}.
```

Here the constant hidden in $\lesssim_d$ depends only on $d$.
:::

:::{dropdown} Proof
Apply the Gaussian Nyström approximation to the Gram matrix on the union of the
$N$ support points and retain its source--target block. Since
$\norm{x-y}\leq2D$, one has $K_{\min}\geq e^{-4D^2/\epsilon}$. The adaptive
stopping rule of Altschuler, Bach, Rudi and Niles-Weed resolves the kernel below
this scale, hence produces $\widetilde K>0$ with the same logarithmic control
singled out in {ref}`prop-sinkhorn-sketch-positive-guarantee`. Their Gaussian
effective-dimension estimate gives {eq}`eq-gaussian-nystrom-rank-web`.
Stability of entropic OT with respect to $\log K$, followed by approximate
Sinkhorn scaling and rounding, gives the two error bounds. The low-rank
factorization costs $O(NR^2)$ to construct, each kernel product costs $O(NR)$,
and the quantitative scaling bound contributes
$\widetilde O(NRD^4/(\epsilon\tau))$, yielding the stated time and memory
estimates. Their entropy convention differs from the KL-normalized value
$\MK_c^\epsilon$ only by a constant depending on $(a,b)$, so the approximation
bounds are unchanged.
:::

The power $d$ in {eq}`eq-gaussian-nystrom-rank-web` is the principal
limitation. Sinkhorn requires $\widetilde K>0$ and control of
$\log\widetilde K$, so an additive kernel approximation must resolve entries as
small as $e^{-4D^2/\epsilon}$. The Gaussian effective dimension at this
resolution scales as $(D^2/\epsilon)^d$, up to logarithmic factors. For example,
when $n=m$ and both measures are uniform,
$0\leq\MK_c^\epsilon-\MK_c\leq\epsilon\log n$. Approximating unregularized OT
to accuracy $\tau$ therefore calls for $\epsilon$ of order $\tau/\log n$, and
the sufficient rank scales as $\tau^{-d}$ up to powers of $D$ and logarithmic
factors. This is the dimension-dependent price of the sketch; replacing $d$ by
a smaller intrinsic dimension is possible under additional geometric
assumptions on the data
{cite:p}`AltschulerBachRudiNilesWeed2019NystromSinkhorn`.

### Positive Features and Complete Positivity

The preceding analysis identifies positivity as a central bottleneck: a signed
sketch may require many features merely to avoid negative entries, whereas
Sinkhorn repeatedly divides by kernel--vector products and therefore cannot
tolerate this failure. A natural remedy is to build entrywise nonnegativity
into every sketch by using nonnegative features; under a mild nondegeneracy
condition, the resulting entries are strictly positive. Not every positive
semidefinite and pointwise-positive kernel admits such a representation,
however. We therefore first identify the matrix and kernel classes for which
positive sketches are possible. In finite dimension, let

```{math}
\mathrm{DNN}_n=\{A\in\RR^{n\times n}: A\succeq0,\ A_{ij}\geq0\},
\qquad
\mathrm{CP}_n=\{BB^\top: B\in\RR_+^{n\times q}\hbox{ for some }q\geq1\}.
```

Matrices in $\mathrm{DNN}_n$ are doubly nonnegative, while matrices in
$\mathrm{CP}_n$ are completely positive. One always has
$\mathrm{CP}_n\subset\mathrm{DNN}_n$, with equality for $n\leq4$ and strict
inclusion for $n\geq5$
{cite:p}`BermanShakedMonderer2003,AnstreicherBurerDuer2009`. Thus, from five
sampled points onward, positive sketchability is strictly more demanding than
being doubly nonnegative: the latter is the spectral and entrywise positivity
condition desirable for stable Sinkhorn kernels, whereas the former guarantees
nonnegative low-rank features and hence positive Sinkhorn sketches. This gap
does not occur for ordinary sketches, where no sign constraint is imposed on
the features: spectral positivity is equivalent to the existence of a possibly
signed Hilbert feature representation. It appears only when one insists that
every feature, and hence every finite sketch, be pointwise nonnegative. Checking
membership in the completely positive cone is computationally hard: strong
membership is NP-hard, and weak membership for the completely positive cone and
its copositive dual is NP-hard {cite:p}`DickinsonGijben2014`.

A concrete five-point obstruction is provided by the periodic kernel

```{math}
k_\lambda(x,y)=\lambda+\cos^2\left(\frac{x-y}{2}\right),
\qquad \lambda>0.
```

It is PSD and strictly positive pointwise because
$\cos^2(t/2)=(1+\cos t)/2$ has nonnegative Fourier coefficients. Yet, for
$\lambda=1/20$, its Gram matrix $K$ on five equally spaced points is not
completely positive. Indeed, the Horn copositive matrix $H$ is nonnegative on
$\mathrm{CP}_5$, whereas

```{math}
\langle H,K\rangle
=
\frac{21}{4}-\frac{5\sqrt5}{2}<0.
```

Thus $K\in\mathrm{DNN}_5\setminus\mathrm{CP}_5$, as displayed in Figure
{ref}`fig:sinkhorn-doubly-positive-counterexample`.

(fig:sinkhorn-doubly-positive-counterexample)=
```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-doubly-positive-counterexample")
```

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change the offset to compare an entrywise positive PSD
kernel matrix with the Horn certificate obstructing complete positivity.
:::

<iframe class="ot4ml-live-frame" title="Interactive doubly-positive counterexample panel" src="../live/sinkhorn-doubly-positive-counterexample.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

(def-dnn-cp-kernels)=
:::{admonition} Definition: Completely Positive and Positive-Feature Kernels
:class: note
A kernel is **doubly positive**, respectively **completely positive**, if
every finite Gram matrix belongs to $\mathrm{DNN}_n$, respectively
$\mathrm{CP}_n$. It is a **positive-feature kernel** if there are a
probability space $(Z,\xi)$, an integer $p\geq1$, and measurable features
$\phi(x,\cdot):Z\to\RR_+^p$ such that

```{math}
k(x,y)=\int_Z\dotp{\phi(x,z)}{\phi(y,z)}_{\RR^p}\,d\xi(z).
```
:::

A doubly positive kernel is equivalently PSD and pointwise nonnegative.

(prop-cp-kernel-positive-features)=
:::{admonition} Proposition: Complete Positivity and Positive Features
:class: important
Let $k:\Xx\times\Xx\to\RR$ be a finite-valued PSD kernel whose canonical
pseudometric

```{math}
d_k(x,y)^2:=k(x,x)+k(y,y)-2k(x,y)
```

is separable. Then $k$ is completely positive if and only if it is a
positive-feature kernel. Scalar features suffice. On a finite set this reduces
to

```{math}
K\in\mathrm{CP}_n
\quad\Longleftrightarrow\quad
K=BB^\top\quad\text{for some }B\geq0.
```
:::

:::{dropdown} Proof
If $k$ has positive features, then on $x_1,\ldots,x_n$,

```{math}
K=\sum_{q=1}^p\int_Zv_q(z)v_q(z)^\top\,d\xi(z),
\qquad
v_q(z):=(\phi_q(x_i,z))_{i=1}^n\geq0.
```

The integrand belongs to the closed convex cone $\mathrm{CP}_n$, hence so does
$K$.

The zero kernel is trivial. Otherwise, choose a $d_k$-dense sequence $(x_i)$
and positive weights $(\omega_i)$ such that
$0<S:=\sum_i\omega_i k(x_i,x_i)<+\infty$. Factor each
finite Gram matrix as $K^{(r)}=B^{(r)}(B^{(r)})^\top$. If $b_\ell$ are its
nonzero columns, set
$t_\ell=\sum_{i\leq r}\omega_i(b_\ell)_i^2$,
$S_r=\sum_\ell t_\ell$, and
$z_i^{(r,\ell)}=\sqrt{S_r/t_\ell}(b_\ell)_i$ for $i\leq r$, with zero
coordinates afterward. The probability measures

```{math}
\xi_r:=\sum_\ell\frac{t_\ell}{S_r}\delta_{z^{(r,\ell)}}
```

are supported on the compact product
$\prod_i[0,\sqrt{S/\omega_i}]$ and satisfy
$\int z_i z_j\,d\xi_r=k(x_i,x_j)$ for $i,j\leq r$. A weak limit $\xi$ gives
scalar nonnegative features $\phi(x_i,z)=z_i$. Their $L^2(\xi)$-distance is
$d_k(x_i,x_j)$, so they extend by continuity to all $x\in\Xx$, remain
nonnegative, and have inner products $k(x,y)$.
:::

The separability assumption holds for continuous kernels on separable metric
spaces. It cannot be omitted for a common probability feature space: the delta
kernel on an uncountable discrete set has completely positive finite Gram
matrices but would require uncountably many pairwise orthogonal nonzero
elements of $L^2_+(\xi)$. For a rectangular source--target matrix, the
proposition is applied to the Gram matrix on the union of the two point sets,
after which one extracts the rectangular cross block.

Despite this certification difficulty, completely positive kernels,
equivalently positive-sketchable kernels under the preceding proposition,
enjoy a useful closure algebra. It provides a systematic way to construct new
kernels whose low-rank features remain nonnegative.

(prop-completely-positive-kernel-closure)=
:::{admonition} Proposition: Basic Closure of Completely Positive Kernels
:class: important
Let $k_1,\ldots,k_J$ be completely positive kernels,
$a_1,\ldots,a_J\geq0$, and $(k_\theta)_{\theta\in\Theta}$ a measurable family
of completely positive kernels. Whenever they are finite, the kernels

```{math}
k_{\mathrm{sum}}:=\sum_{j=1}^J a_jk_j,
\qquad
k_{\mathrm{prod}}:=\prod_{j=1}^J k_j,
\qquad
k_{\mathrm{mix}}:=\int_\Theta k_\theta\,d\eta(\theta),
\quad \eta\geq0,
```

are completely positive. In particular, so is every positive autocorrelation

```{math}
k(x,y)=\int g(u-x)g(u-y)\,du,
\qquad g\geq0,
```

and every nonnegative mixture of such kernels.
:::

:::{dropdown} Proof
On an arbitrary finite point set, nonnegative sums are handled by concatenating
nonnegative factors. If $K_j=B_jB_j^\top$, then

```{math}
K_1\odot K_2
=
\sum_{\ell,s}
\big((B_1)_{\cdot,\ell}\odot(B_2)_{\cdot,s}\big)
\big((B_1)_{\cdot,\ell}\odot(B_2)_{\cdot,s}\big)^\top,
```

so pointwise products are completely positive. Measurable nonnegative mixtures
remain in the closed convex cone $\mathrm{CP}_n$. The autocorrelation formula
is directly a scalar positive-feature representation, so the same integral
argument applies.
:::

For the quadratic cost $c(x,y)=\norm{x-y}^2$, the Gaussian Gibbs kernel used
by Sinkhorn admits an especially simple positive feature representation,
which is the construction exploited by Scetbon and Cuturi
{cite:p}`ScetbonCuturi2020PositiveFeatures`. The same construction extends to
the generalized Gaussian kernels
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

Set $a=p/2$, let $S_a$ be the positive $a$-stable random variable normalized by

```{math}
\mathbb E\left(e^{-tS_a}\right)=e^{-t^a},
\qquad t\geq0,
```

and draw independently

```{math}
\Lambda=\epsilon^{-1/a}S_a,
\qquad
Z\sim\mathcal N(0,\Id_d).
```

For any $x_0\in\RR^d$, define the positive feature

```{math}
\phi_{p,\epsilon}(x;\Lambda,Z)
:=
\exp\left(
\sqrt{2\Lambda}\dotp{Z}{x-x_0}
-2\Lambda\norm{x-x_0}^2
\right).
```

Then

```{math}
k_{p,\epsilon}(x,y)
=
\mathbb E\left[
\phi_{p,\epsilon}(x;\Lambda,Z)
\phi_{p,\epsilon}(y;\Lambda,Z)
\right],
```

so $k_{p,\epsilon}$ is completely positive. For i.i.d. copies
$(\Lambda_\ell,Z_\ell)_{\ell=1}^r$, define the positive sketching features

```{math}
\varphi_\ell(x)
=r^{-1/2}\phi_{p,\epsilon}(x;\Lambda_\ell,Z_\ell),
\qquad 1\leq\ell\leq r.
```

They satisfy $\varphi_\ell\geq0$ and

```{math}
\mathbb E\left[\sum_{\ell=1}^r
\varphi_\ell(x)\varphi_\ell(y)\right]
=k_{p,\epsilon}(x,y).
```

For $p=2$, one has $S_1=1$ almost surely and

```{math}
\phi_{2,\epsilon}(x;Z)
=
\exp\left(
\sqrt{2/\epsilon}\dotp{Z}{x-x_0}
-(2/\epsilon)\norm{x-x_0}^2
\right).
```
:::

:::{dropdown} Proof
The stable-law normalization gives

```{math}
\mathbb E e^{-t\Lambda}
=
\exp\left(-\frac{t^a}{\epsilon}\right),
```

while, conditionally on $\Lambda$, the Gaussian moment-generating function gives

```{math}
\mathbb E_Z\left[
\phi_{p,\epsilon}(x;\Lambda,Z)
\phi_{p,\epsilon}(y;\Lambda,Z)
\right]
=e^{-\Lambda\norm{x-y}^2}.
```

Taking $t=\norm{x-y}^2$ in the first identity proves the feature formula, and
averaging independent copies proves unbiasedness.
:::

:::{admonition} Remark: The range $0<p\leq2$
:class: ot4ml-remark

The restriction $0<p\leq2$ is essential. Schoenberg's theorem says that
$x\mapsto e^{-\gamma\norm{x}^p}$ is positive definite on every Euclidean
space precisely in this range. For $p>2$, some finite Gram matrices have a
negative eigenvalue, so no universal positive-feature factorization should be
expected.
:::


### Positive Sketches for Sinkhorn

For the $p$-power cost $c_p(x,y)=\norm{x-y}^p$, with $0<p\leq2$, let

```{math}
K_{i,j}=k_{p,\epsilon}(x_i,y_j)
=
\exp\left(-\frac{\norm{x_i-y_j}^p}{\epsilon}\right).
```

The factor $1/p$, often used in the definition of $W_p^p$, only rescales
$\epsilon$. For $p\geq1$, this is the usual $p$-Wasserstein power cost; for
$0<p<1$, it should be read simply as a concave power transport cost.
Using the sketching features $\varphi_\ell$ of Proposition
{ref}`prop-gaussian-positive-features`, define directly

```{math}
(\Phi_X)_{i,\ell}=\varphi_\ell(x_i),
\qquad
(\Phi_Y)_{j,\ell}=\varphi_\ell(y_j).
```

The proposition gives $K_r:=\Phi_X\Phi_Y^\top\geq0$ entrywise and
$\mathbb E[K_r]=K$. Sinkhorn applied to $K_r$ uses only products by the two
feature matrices, and its plan is represented as

```{math}
P_r
=
\diag(u)\Phi_X\Phi_Y^\top\diag(v)
=
LR^\top,
\qquad
L=\diag(u)\Phi_X,
\quad
R=\diag(v)\Phi_Y .
```

This route is complementary to
worst-case near-linear Sinkhorn analyses {cite:p}`altschuler2017near`, low-rank
Gaussian-kernel approximations for quadratic transport
{cite:p}`AltschulerBachRudiWeed2018QuadraticTransport`, and factored-coupling
models in which the coupling itself is constrained to have low rank
{cite:p}`scetbon2021lowrank`.

Figure {ref}`fig:sinkhorn-positive-feature-sketching` uses the $p=2$ Gaussian
Gibbs kernel. A sufficiently large rank gives a visually accurate plan and
entrywise logarithm of the kernel matrix, whereas coarse sketches preserve the
marginals but lose geometric concentration.

(fig:sinkhorn-positive-feature-sketching)=
```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-positive-feature-sketching")
```

The top row shows the entropic couplings. The bottom row displays the entries
$-\epsilon\log (K_r)_{i,j}$ with black level sets, compared with the exact
quadratic cost $|x_i-y_j|^2$ in the first column. Rank $40$ remains close to the dense
computation, while ranks $10$ and $3$ preserve the marginals but increasingly
blur the transport geometry.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change the regularization and random seed to compare the
exact Gibbs matrix with positive low-rank sketches and their logarithmic
matrices.
:::

<iframe class="ot4ml-live-frame" title="Interactive positive-feature Sinkhorn sketch panel" src="../live/sinkhorn-positive-sketching.html" loading="lazy" style="width:100%;height:700px;border:0;display:block;"></iframe>

### Connection with Linear Time Attention

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
