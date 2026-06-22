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
over all $1$-Lipschitz test functions.

(fig:matching-quantitative-clt)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("matching-quantitative-clt")
```

*Central-limit theorem for normalized Bernoulli sums. Starting from
$\alpha_0=\frac12(\delta_{-1}+\delta_1)$, the law of
$Z_n=n^{-1/2}\sum_i X_i$ remains discrete, but its rescaled atom heights
approach the standard Gaussian density shown in gray. The Wasserstein
Berry--Esseen bound below quantifies this weak convergence by a $\Wass_1$
distance.*
:::

The interactive demo varies the number of summands and the Bernoulli skew,
making the Wasserstein view of weak convergence visible even while the law
remains discrete.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the number-of-summands and Bernoulli-skew controls to watch the Wasserstein CLT scaling predicted by Lipschitz test functions.
:::

<iframe class="ot4ml-live-frame" title="Quantitative CLT controls" src="../live/kantorovich-clt.html" loading="lazy" style="width:100%;height:470px;border:0;display:block;"></iframe>

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

:::{dropdown} Proof Sketch
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
$f_h'(x)-xf_h(x)=h(x)-\mathbb{E}h(G)$. The solution has uniform derivative
bounds of first and second order depending only on the Lipschitz constant of $h$. Write
$S_n^{(i)}=S_n-X_i/\sqrt n$. Since $S_n^{(i)}$ is independent of $X_i$, a
Taylor expansion of $f_h'$ and $f_h$ around $S_n^{(i)}$ cancels the first- and
second-order terms by $\mathbb{E}X_i=0$ and $\mathbb{E}X_i^2=1$. The remainder
is bounded by $C\mathbb{E}|X_i/\sqrt n|^3$. Summing over $i$ gives the
$n^{-1/2}$ rate
{cite:p}`berry1941accuracy,esseen1942liapunoff,chen2011normal,bobkov2018berry,rio2011asymptotic`.
:::

(sec-sample-complexity)=
## Sample Complexity

This section separates two statistical regimes. Exact OT resolves geometry at
all spatial scales and pays rates controlled by the metric entropy, hence by
the intrinsic dimension, of the support. Fixed-temperature Sinkhorn divergences
smooth the dual potentials and recover parametric fluctuations, at the price
of regularization bias.

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
Entropic regularization changes a different aspect of the picture: for a
fixed $\epsilon>0$, Sinkhorn divergences have
parametric $n^{-1/2}$ statistical rates, although the constant deteriorates
when $\epsilon\to0$ {cite:p}`genevay2018sample,bigot2017central`. Related
two-sample-testing viewpoints are developed in {cite:p}`ramdas2017wasserstein`,
and the large-$\epsilon$ kernel limit connects to classical MMD tests
{cite:p}`gretton2012kernel`.

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

(prop-empirical-ot-rate)=
:::{admonition} Proposition: Empirical OT has Intrinsic-Dimension Value Rates
:class: important
Let $\alpha$ and $\beta$ be probability distributions with densities bounded
above and below on $[0,1]^d$, and let $\hat\alpha_n$ and $\hat\beta_m$ be
independent empirical measures. For $d>2p$, the expected empirical error for
estimating the two-sample distance obeys

```{math}
\mathbb E
\abs{
\Wass_p(\hat\alpha_n,\hat\beta_m)
-
\Wass_p(\alpha,\beta)
}
\lesssim
n^{-1/d}+m^{-1/d}.
```

The exponent changes in low dimension, but the important message is that
exact OT deteriorates with the intrinsic dimension of the support rather than
necessarily with the ambient dimension. More generally, if the measures are
supported on a compact set with regular $d'$-dimensional volume growth, so
that covering numbers at scale $r$ are of order $r^{-d'}$, the same estimate
holds with $d$ replaced by $d'$ when $d'>2p$. This includes smooth compact
$d'$-dimensional submanifolds with densities bounded above and below with
respect to their volume measure.
:::

:::{dropdown} Proof Sketch
By the triangle inequality,

```{math}
\abs{\Wass_p(\hat\alpha_n,\hat\beta_m)-\Wass_p(\alpha,\beta)}
\leq
\Wass_p(\hat\alpha_n,\alpha)
+
\Wass_p(\hat\beta_m,\beta).
```

For the one-sample term, partition $[0,1]^d$ into dyadic cubes. At scale
$2^{-j}$, empirical mass fluctuations over the cells are of order
$n^{-1/2}2^{jd/2}$, while moving this excess mass inside cells costs
$2^{-j}$. Summing the multiscale contributions up to the scale where the
expected number of samples per cell is order one gives $2^{-J}$ with
$2^{Jd}\simeq n$, hence $n^{-1/d}$. On a support with $d'$-dimensional
metric entropy, the same chaining argument uses covers with $O(2^{jd'})$
cells at scale $2^{-j}$, hence the balancing scale is $2^{Jd'}\simeq n$ and the rate is
$n^{-1/d'}$. Matching lower bounds follow from packing arguments
{cite:p}`dudley1969speed,fournier2015rate,weed2017sharp`.
:::

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

(prop-sinkhorn-sample-rate)=
:::{admonition} Proposition: Sinkhorn Divergences Interpolate the Rates
:class: important
Assume $\alpha$ and $\beta$ are supported in a compact subset of $\RR^d$ and
the cost is smooth. For fixed $\epsilon>0$, debiased Sinkhorn divergences
satisfy representative empirical bounds of the form

```{math}
\mathbb E
\abs{
\overline{\mathcal L}_c^\epsilon(\hat\alpha_n,\hat\beta_m)
-
\overline{\mathcal L}_c^\epsilon(\alpha,\beta)
}
\leq
C_{c,d}\epsilon^{-d/2}
\left(
\frac1{\sqrt n}+\frac1{\sqrt m}
\right),
```

up to constants and exponents depending on the precise smoothness class and
support diameter. Thus regularization removes the $n^{-1/d}$ curse for fixed
$\epsilon$, while the prefactor deteriorates as $\epsilon\to0$.
:::

:::{dropdown} Proof Sketch
By the envelope theorem, the fluctuation of
$\mathcal L_c^\epsilon$ with respect to its first marginal is controlled by
the class of entropic dual potentials. The soft $c$-transform smooths these
potentials at spatial scale $\sqrt\epsilon$ for a quadratic-type cost.
Covering a bounded $d$-dimensional domain at this scale gives an effective
complexity of order $\epsilon^{-d/2}$. Standard Rademacher or Dudley entropy
bounds then give an empirical-process fluctuation of order
$\epsilon^{-d/2}/\sqrt n$ for each marginal. Applying the same estimate to
the three terms defining the debiased divergence gives the stated bound.
:::

(rem-sinkhorn-no-free-lunch)=
:::{admonition} Remark: No free lunch when approximating exact OT
:class: ot4ml-remark

The parametric rate in Proposition {ref}`prop-sinkhorn-sample-rate` holds for fixed $\epsilon$. If the goal is to approximate the unregularized OT value, one must also account for the regularization bias. In a typical bounded-cost finite-dimensional regime,

```{math}
\abs{\bar\MK_\c^\epsilon(\alpha,\beta)-\MK_\c(\alpha,\beta)}
\leq C\epsilon,
\qquad
\EE\abs{\bar\MK_\c^\epsilon(\hat\alpha_n,\hat\beta_n)-\bar\MK_\c^\epsilon(\alpha,\beta)}
\leq C_{c,d}\epsilon^{-d/2}n^{-1/2}.
```

Balancing the two terms gives $\epsilon\simeq n^{-1/(d+2)}$ and total error of order $n^{-1/(d+2)}$. Equivalently, target accuracy $\eta$ requires choosing $\epsilon\simeq\eta$ and $n\simeq\eta^{-(d+2)}$ samples under this bound. Thus entropic smoothing improves the statistical behavior at fixed scale, but approximating exact OT still forces a bias-variance tradeoff whose exponent deteriorates with dimension.
:::


The interactive demo below is only a scaling guide: change the dimension to see the
exact-OT exponent flatten, and change $\epsilon$ to move the Sinkhorn bias
floor against its parametric fluctuation term.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** This exploratory panel is a scaling guide. Use dimension, sample size, and epsilon to compare statistical fluctuation with regularization bias.
:::

<iframe class="ot4ml-live-frame" title="Sinkhorn sample-complexity controls" src="../live/sinkhorn-advanced-samples.html" loading="lazy" style="width:100%;height:460px;border:0;display:block;"></iframe>

(sec-bias-variance-ot)=
## Bias and Variance of OT

The previous section answered a coarse but essential question: how many samples
are needed before an empirical OT quantity is accurate, typically up to
universal constants. We now ask for a finer statistical description. Rather
than only estimating the size of the error, we seek the first expansion of the
plug-in estimator. Given empirical laws $\hat\alpha_n$ and $\hat\beta_m$, and
an OT functional $T$, this expansion separates the leading statistical bias

```{math}
B_{n,m}(T)
\eqdef
\mathbb E T(\hat\alpha_n,\hat\beta_m)-T(\alpha,\beta)
```

and the centered fluctuation

```{math}
Z_{n,m}(T)
\eqdef
T(\hat\alpha_n,\hat\beta_m)-\mathbb E T(\hat\alpha_n,\hat\beta_m),
```

for OT functionals such as $T(\alpha,\beta)=\Wass_p^p(\alpha,\beta)$,
$T(\alpha,\beta)=\mathcal L_c(\alpha,\beta)$, or their entropic analogues. This
is not just the central limit theorem of {ref}`sec-law-large-numbers-clt`,
which describes the random signed measure $\sqrt n(\hat\alpha_n-\alpha)$
itself. Here the empirical process is pushed through a nonlinear, often
nonsmooth, transport value. The resulting law is governed by the local
differentiability of the OT functional and by the geometry of its optimal dual
potentials.

### Literature Map

The shape of the limit depends sharply on the analytic regularity of the
transport value. For exact OT on a finite or countable space, the map from
empirical weights to optimal cost is convex and piecewise affine. Sommerfeld
and Munk {cite:p}`sommerfeld2018inference`, and the countable-space extensions
of Tameling--Sommerfeld--Munk and Hundrieser--Klatt--Munk--Tameling
{cite:p}`tameling2017empirical,hundrieser2022empirical`, show that the natural
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
Mena--Weed
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
T(\hat\alpha_n,\hat\beta_m)-T(\alpha,\beta)
=
\underbrace{\mathbb E T(\hat\alpha_n,\hat\beta_m)-T(\alpha,\beta)}_{\text{bias}}
+
\underbrace{T(\hat\alpha_n,\hat\beta_m)-\mathbb E T(\hat\alpha_n,\hat\beta_m)}_{\text{centered fluctuation}}
```

is elementary, but in OT it is genuinely diagnostic because the two terms may
live on different scales. For the self-distance
$T(\hat\alpha_n,\alpha)=\Wass_p^p(\hat\alpha_n,\alpha)$, the population value
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
$T(\alpha,\beta)$ is nonzero and the OT functional is differentiable at
$(\alpha,\beta)$, the centered fluctuation is often governed by an ordinary
$n^{-1/2}$ central limit theorem. A ``slow OT statistic'' can therefore have
three distinct causes: a large empirical bias, a nonsmooth directional limit,
or a regularization bias $T_\epsilon(\alpha,\beta)-T_0(\alpha,\beta)$ that
still has to be removed.

(prop-finite-ot-clt)=
:::{admonition} Proposition: Finite-Space Bias and CLT for Exact OT
:class: important
Let $a\in\simplex_n$ and $b\in\simplex_m$ have positive entries, let
$\C\in\RR^{n\times m}$, and define

```{math}
\Phi(a,b)\eqdef \mathcal L_\C(a,b)
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
\sqrt N\big(\Phi(\hat a_N,b)-\Phi(a,b)\big)
\Longrightarrow
\sup_{(f,g)\in\mathcal D^\star(a,b)}\dotp{f}{G_a}.
```

Moreover,

```{math}
\sqrt N\big(\mathbb E\Phi(\hat a_N,b)-\Phi(a,b)\big)
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
\mathbb E\Phi(\hat a_N,b)-\Phi(a,b)=o(N^{-1/2}).
```
:::

:::{dropdown} Proof
The multinomial central limit theorem gives

```{math}
\sqrt N(\hat a_N-a)\Longrightarrow G_a,
\qquad
G_a\in\{\xi:\dotp{\ones}{\xi}=0\}.
```

The dual formulation writes $\Phi$ as the supremum, over the feasible
polyhedron $f_i+g_j\leq\C_{ij}$, of the affine functions
$a\mapsto\dotp f a+\dotp g b$. Its directional derivative at $a$, in any
tangent direction $h$ with
$\dotp{\ones}{h}=0$, is therefore

```{math}
D_a\Phi(a,b)[h]
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
r_{N,M}\big(\Phi(\hat a_N,\hat b_M)-\Phi(a,b)\big)
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
\Phi_\epsilon(a,b)
\eqdef
\min_{\P\in\CouplingsD(a,b)}
\dotp{\C}{\P}+\epsilon\operatorname{KL}(\P|a\otimes b).
```

Let $(f_\epsilon,g_\epsilon)$ be normalized entropic dual potentials for
$\Phi_\epsilon(a,b)$. If $\hat a_N$ is the empirical histogram of $N$ samples
from $a$, then

```{math}
\sqrt N\big(\Phi_\epsilon(\hat a_N,b)-\Phi_\epsilon(a,b)\big)
\Longrightarrow
\mathcal N(0,\sigma_{\epsilon,a}^2),
```

and

```{math}
\mathbb E\Phi_\epsilon(\hat a_N,b)-\Phi_\epsilon(a,b)=O(N^{-1}),
\qquad
N\,\operatorname{Var}\big(\Phi_\epsilon(\hat a_N,b)\big)\to\sigma_{\epsilon,a}^2,
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
D_a\Phi_\epsilon(a,b)[h]=\dotp{f_\epsilon}{h}.
```

Applying the ordinary delta method to the multinomial CLT
$\sqrt N(\hat a_N-a)\Rightarrow G_a$ gives the one-sample limit
$\dotp{f_\epsilon}{G_a}$, whose variance is the displayed covariance formula.
The only boundary nuisance is that an empirical histogram may have a zero
entry. Since $a_i>0$ for all $i$, this event has probability at most
$\sum_i(1-a_i)^N$, hence is exponentially small and does not affect the
first-order limit or the $N^{-1}$ bias. On the complementary event, Taylor's
formula applies in the relative interior: the first-order term is centered and
the Hessian is locally bounded, so the plug-in bias is
$O(N^{-1})$. The variance convergence follows from the same expansion and from
bounded moments of the multinomial fluctuation. The two-sample formula follows
by applying the argument independently to the two marginals.
:::

For the entropy-only convention $\mathcal L_\C^\epsilon$ used in
{ref}`sec-entropic-discrete`, the marginal entropy derivatives described after
{ref}`prop-ot-first-variations-entropic` must be added to the potentials. For
the debiased Sinkhorn divergence $\bar\MK_c^\epsilon$, the derivative is
instead the difference between cross and self entropic potentials. At the null
$\alpha=\beta$, this first derivative can vanish for the debiased statistic,
and second-order limits then become relevant {cite:p}`goldfeld2022limit`. This
is a useful warning: the asymptotic law is determined not only by a rate, but
also by the local geometry of the functional.

### Three Error Terms When Entropy Estimates Exact OT

If the target is the exact cost
$T_0(\alpha,\beta)=\mathcal L_c(\alpha,\beta)$ but the statistic uses
$T_\epsilon$, three errors should be kept separate:

```{math}
T_\epsilon(\hat\alpha_n,\hat\beta_m)-T_0(\alpha,\beta)
=
\underbrace{T_\epsilon(\alpha,\beta)-T_0(\alpha,\beta)}_{\text{regularization bias}}
+
\underbrace{\mathbb E T_\epsilon(\hat\alpha_n,\hat\beta_m)-T_\epsilon(\alpha,\beta)}_{\text{statistical bias}}
+
\underbrace{Z_{n,m}(T_\epsilon)}_{\text{centered fluctuation}} .
```

This identity is trivial algebraically but important statistically. It is
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
studies the degenerate self-distance $T(\alpha,\alpha)=0$, the limit may be
non-Gaussian or may occur at a slower non-parametric scale. Entropic
regularization smooths the dual potentials and typically restores a
conventional first-order CLT for fixed $\epsilon$, even under weak assumptions
on the cost. If the target is unregularized OT, however, this statistical
expansion must still be balanced against the bias
$T_\epsilon(\alpha,\beta)-T_0(\alpha,\beta)$. Thus
{ref}`sec-sample-complexity` gives dimension-dependent magnitudes, while the
present section identifies the local asymptotic constants and covariance
formulas needed for inference.
