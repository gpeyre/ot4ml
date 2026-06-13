---
title: Divergences and Dual Norms
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-divergences-dual-norms)=

This chapter compares optimal transport with divergence-based and adversarial
ways of measuring discrepancy. The main stake is topological:
$\phi$-divergences are cheap but strong, while dual norms and GAN objectives
can be weak enough to compare singular measures. The discussion connects
classical information divergences {cite:p}`ciszar1967information,ali1966general`
with modern integral probability metrics and generative modeling
{cite:p}`sriperumbudur2009integral,GAN,WassersteinGAN`.

:::{admonition} Guiding Comparison
:class: tip
Dual norms and integral probability metrics compare measures through test
functions. Phi-divergences compare them through density ratios. This single
change explains most of the chapter: test-function discrepancies can be weak
enough to compare singular measures, while ratio-based divergences are often
cheap and statistically classical but topologically strong.
:::

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

(sec-dual-norms)=
## Dual Norms and Integral Probability Metrics

Dual norms generalize the $\Wass_1$ test-function principle. They are useful
in statistics because they compare distributions by restricting the
discriminator class.

### Integral Probability Metrics

The Kantorovich--Rubinstein formula for $\Wass_1$ is a special case of a dual
norm. This viewpoint designs weak discrepancies by testing signed differences
of measures against a controlled class of functions.

(def-dual-norm-ipm)=
:::{admonition} Definition: Dual Norm and Integral Probability Metric
:class: important
For a symmetric convex set $B$ of measurable functions, define on signed
measures $\xi$

```{math}
:label: eq-dual-norm-cont-web
\norm{\xi}_B
\eqdef
\sup_{f\in B}
\int_\X f(x)\,\d\xi(x).
```

When this quantity is applied to $\alpha-\beta$ for probability measures, it
is often called an integral probability metric.
:::

The choice of the test-function class $B$ determines both the topology and the
statistical behavior of the discrepancy {cite:p}`sriperumbudur2012empirical,sriperumbudur2009integral,sriperumbudur2008injective`.

:::{admonition} Example: Total variation
:class: ot4ml-example

As recalled in Definition {ref}`defn-total-variation` and Proposition {ref}`prop-tv-dual-measure`, total variation is the dual norm associated with the unit ball of continuous functions

```{math}
B = \enscond{f \in \Cc(\X)}{\norm{f}_\infty \leq 1}.
```

Total variation is the canonical nontrivial example of a discrepancy that is both a $\phi$-divergence and a dual norm; see {cite:p}`sriperumbudur2009integral`.
:::

:::{admonition} Example: $\Wass_1$ norm
:class: ot4ml-example

$\Wass_1$, as defined in {eq}`eq-w1-cont-web`, is the dual norm {eq}`eq-dual-norm-cont-web` associated with

```{math}
B = \enscond{f}{\Lip(f) \leq 1}
```

the set of 1-Lipschitz functions.
:::

:::{admonition} Example: Flat norm and Dudley metric
:class: ot4ml-example

If the set $B$ is bounded and separates measures, then $\norm{\cdot}_B$ is a norm on the whole space $\Mm(\Xx)$ of finite measures.

This is not the case of $\Wass_1$, which is only finite on signed measures $\xi$ such that $\int_\X \d\xi=0$; otherwise $\norm{\xi}_B=+\infty$ because constants belong to the Lipschitz ball.

This is remedied by imposing a bound on the value of the potential $\f$, which leads for instance to the flat norm,

```{math}
:label: eq-set-flatnorm

B=\enscond{f}{\Lip(f) \leq 1 \qquad\text{and}\qquad \norm{\f}_\infty \leq 1}.
```

On compact metric spaces, it metrizes weak convergence on the whole space $\Mm(\X)$ of finite measures.

The finite-dimensional version is obtained from the usual $\Wass_1$ dual linear program by adding the box constraints $\abs{\fD_k}\leq1$.

The flat norm is sometimes called the "Kantorovich--Rubinstein" norm {cite:p}`hanin1992kantorovich` and has been used as a fidelity term for inverse problems in imaging {cite:p}`lellmann2014imaging`.

The flat norm is similar to the Dudley metric, which uses

```{math}
:label: eq-set-dudley

B=\enscond{f}{\norm{\nabla \f}_\infty + \norm{\f}_\infty \leq 1}.
```
:::

(fig:dualnorms-ipm-witnesses)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("dualnorms-ipm-witnesses")
```

*Dual witnesses for integral probability metrics. The red and blue curves are
two one-dimensional probability densities and the violet curve is a normalized
optimal dual witness $f^\star_{\alpha,\beta}$ for the IPM variational problem.
$\Wass_1$ restricts the slope through Kantorovich--Rubinstein duality, MMD
restricts the RKHS norm, and total variation can saturate pointwise and
therefore reacts sharply to signed density differences.*
:::

The interactive demo makes the topology visible. As the two densities move, the
total-variation witness jumps with the sign of the density difference, the
Wasserstein witness keeps a unit-slope geometry, and the MMD witness is
smoothed by the kernel bandwidth.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the kernel, bandwidth, and separation controls to see how witness functions detect differences between measures.
:::

<iframe class="ot4ml-live-frame" title="IPM witness controls" src="../live/dualnorm-ipm.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

The following proposition gives a compact-space criterion. The dual ball
should be rich enough to approximate continuous observables, but compact
enough for weak convergence to imply uniform convergence over the
discriminator class.

(prop-dual-norm-metrization)=
:::{admonition} Proposition: Metrization by Dual Norms
:class: important
Assume that $\X$ is compact, $B=-B$, and the measures considered are
probability measures.

1. If every function in $\Cc(\X)$ can be uniformly approximated by elements of
   $\operatorname{span}(B)$, then $\norm{\alpha_n-\alpha}_B\to0$ implies
   $\alpha_n\rightharpoonup\alpha$.
2. If $B\subset\Cc(\X)$ is compact for $\norm{\cdot}_\infty$, then
   $\alpha_n\rightharpoonup\alpha$ implies
   $\norm{\alpha_n-\alpha}_B\to0$.
:::

:::{dropdown} Proof
For the first implication, $\norm{\alpha_n-\alpha}_B\to0$ and the symmetry of
$B$ imply

```{math}
\left|\int f\,\d(\alpha_n-\alpha)\right|
\le
\norm{\alpha_n-\alpha}_B
\qquad (f\in B).
```

By linearity, integrals converge for every $h\in\operatorname{span}(B)$. Let
$u\in\Cc(\X)$ and choose $h\in\operatorname{span}(B)$ with
$\norm{u-h}_\infty\le\eta$. Since $\alpha_n$ and $\alpha$ are probabilities,

```{math}
\left|\int u\,\d(\alpha_n-\alpha)\right|
\le
\left|\int h\,\d(\alpha_n-\alpha)\right|
+2\eta .
```

Taking the limsup as $n\to\infty$ and then letting $\eta\to0$ gives weak
convergence.

For the second implication, assume $\alpha_n\rightharpoonup\alpha$ and choose
a subsequence $(\alpha_{n_k})_k$ realizing the limsup of
$\norm{\alpha_n-\alpha}_B$. Since $B$ is compact and
$f\mapsto\int f\,\d(\alpha_{n_k}-\alpha)$ is continuous on $B$, the supremum
is attained by some $f_{n_k}\in B$. Extract a further subsequence with
$f_{n_k}\to f$ uniformly. Then

```{math}
\int f_{n_k}\,\d(\alpha_{n_k}-\alpha)
=
\int f\,\d(\alpha_{n_k}-\alpha)
+
\int (f_{n_k}-f)\,\d\alpha_{n_k}
-
\int (f_{n_k}-f)\,\d\alpha .
```

The first term tends to zero by weak convergence and the last two by uniform
convergence. Hence the limsup is zero.
:::

(cor-topol-wass)=
:::{admonition} Corollary: Wasserstein Metrizes Weak Convergence
On a compact metric space, $\Wass_p$ metrizes weak convergence on probability
measures for every $p\ge1$.
:::

:::{dropdown} Proof
For $p=1$, take $B=\{f:\operatorname{Lip}(f)\le1\}$. The span of $B$ contains
all Lipschitz functions, which are dense in $\Cc(\X)$ on compact metric
spaces. This gives
$\Wass_1(\alpha_n,\alpha)\to0\Rightarrow\alpha_n\rightharpoonup\alpha$.

Conversely, constants do not change the pairing with $\alpha_n-\alpha$. Fix
$x_0\in\X$ and normalize potentials by $f(x_0)=0$. The normalized unit
Lipschitz ball is uniformly bounded by $\operatorname{diam}(\X)$ and
equicontinuous, hence compact in $\norm{\cdot}_\infty$ by Arzela--Ascoli. The
previous proposition gives $\Wass_1(\alpha_n,\alpha)\to0$. On compact spaces,
all $\Wass_p$ distances induce the same topology.
:::

(sec-rkhs-mmd)=
## Dual RKHS Norms and Maximum Mean Discrepancies

Kernel methods turn probability measures into mean elements of a reproducing
kernel Hilbert space. The resulting Hilbertian dual norms are quadratic
discrepancies, handled with Euclidean geometry while retaining a weak
test-function interpretation.

(def-positive-kernels)=
:::{admonition} Definition: Positive and Conditionally Positive Kernels
:class: important
A symmetric function $K:\X\times\X\to\RR$ is positive definite if for every
$n\ge1$, every $x_1,\ldots,x_n\in\X$, and every $r\in\RR^n$,

```{math}
\sum_{i,j=1}^n r_i r_j K(x_i,x_j)\ge0.
```

It is conditionally positive definite if the same inequality is required only
for zero-sum vectors, $\langle r,\mathbf{1}\rangle=0$.
:::

The conditional version is the right notion for probability distances,
because one applies the quadratic form to signed measures
$\xi=\alpha-\beta$ of total mass zero. Adding $a(x)+a(y)$ to the kernel does
not change $\iint K(x,y)\,\d\xi(x)\,\d\xi(y)$ on such measures, and many
natural distance kernels are only conditionally positive definite.

:::{admonition} Example: Riesz, energy and Mat\'ern-type kernels
:class: ot4ml-example

On $\RR^d$, translation-invariant kernels are most transparent in Fourier variables. The Riesz family associated with $(-\Delta)^{-s}$ has multiplier $\norm{\om}^{-2s}$ and defines a nonnegative quadratic form on zero-mass measures for which the low-frequency singularity is integrable; this is the kernel counterpart of classical Riesz potentials {cite:p}`berg84harmonic`. The energy distance corresponds to the conditionally positive kernel $\Krkhs(x,y)=-\norm{x-y}$, whose Fourier multiplier is proportional to $\norm{\om}^{-(d+1)}$; for $\xi=\al-\be$,

```{math}
-\iint \norm{x-y}\d\xi(x)\d\xi(y)
```

is the squared energy distance up to a dimensional constant {cite:p}`schoenberg38,szekely2004testing`.

Shifted kernels replace $(-\Delta)^{-s}$ by $(-\Delta+\lambda I)^{-s}$ with $\lambda>0$. Their Fourier multiplier $(\norm{\om}^2+\lambda)^{-s}$ is bounded at the origin, hence the kernel is positive definite without imposing zero mass. These are Matern kernels; in closed form they are radial and involve a modified Bessel function {cite:p}`wendland2005scattered`. The Laplacian kernel $e^{-\norm{x-y}/\sigma}$ is a low-smoothness Matern example, while the Gaussian kernel $e^{-\norm{x-y}^2/(2\sigma^2)}$ is the infinite-smoothness limit after the usual rescaling of the Matern smoothness parameter.
:::

(def-kernel-mmd-norm)=
:::{admonition} Definition: Kernel Norm and MMD
:class: important
Let $K$ be positive definite. More generally, let $K$ be conditionally
positive definite and restrict attention to signed measures of total mass
zero. For a signed measure $\xi$ with finite kernel energy, define

```{math}
:label: eq-kernel-dual-web
\norm{\xi}_K^2
\eqdef
\iint_{\X\times\X}K(x,y)\,\d\xi(x)\,\d\xi(y).
```

For two probability measures, the maximum mean discrepancy associated with
$K$ is

```{math}
\operatorname{MMD}_K(\alpha,\beta)
\eqdef
\norm{\alpha-\beta}_K.
```
:::

These norms are usually called maximum mean discrepancies in statistics and
machine learning {cite:p}`gretton2012kernel,muandet2017kernel`, and kernel
norms in shape analysis {cite:p}`Hofmann2008`. If $X,X'$ are independent with
law $\alpha$, then
$\norm{\alpha}_K^2=\EE_{X,X'}(K(X,X'))$, whenever this expression is finite.

(prop-kernel-rkhs-dual)=
:::{admonition} Proposition: Kernel Norm as an RKHS Dual Norm
:class: important
Let $\mathcal{H}$ be the RKHS with reproducing kernel $K$, and assume that the
kernel mean embedding

```{math}
m_\xi\eqdef\int K(x,\cdot)\,\d\xi(x)
```

is well-defined. Then

```{math}
\norm{\xi}_K
=
\sup_{\norm{h}_{\mathcal{H}}\le1}
\int h(x)\,\d\xi(x),
```

so $\norm{\cdot}_K$ is the dual norm associated with the RKHS unit ball.
:::

:::{dropdown} Proof
By the reproducing property,

```{math}
\int h(x)\,\d\xi(x)
=
\left\langle
h,\int K(x,\cdot)\,\d\xi(x)
\right\rangle_{\mathcal{H}}
=
\langle h,m_\xi\rangle_{\mathcal{H}}.
```

Cauchy--Schwarz gives

```{math}
\sup_{\norm{h}_{\mathcal{H}}\le1}\int h\,\d\xi
=
\norm{m_\xi}_{\mathcal{H}}.
```

Finally,

```{math}
\norm{m_\xi}_{\mathcal{H}}^2
=
\iint K(x,y)\,\d\xi(x)\,\d\xi(y).
```
:::

(prop-mmd-metrization)=
:::{admonition} Proposition: Universal Kernels Metrize Weak Convergence
:class: important
Assume that $\X$ is compact and that the RKHS generated by the continuous
kernel $K$ is dense in $\Cc(\X)$ for the uniform norm. Then

```{math}
\operatorname{MMD}_K(\alpha_n,\alpha)\to0
\quad\Longleftrightarrow\quad
\alpha_n\rightharpoonup\alpha
```

for probability measures on $\X$.
:::

:::{dropdown} Proof
If $\operatorname{MMD}_K(\alpha_n,\alpha)\to0$, then integrals of all RKHS
functions converge. For any $h\in\Cc(\X)$ and any $\eta>0$, choose
$g\in\mathcal{H}$ with $\norm{h-g}_\infty\le\eta$. Since $\alpha_n$ and
$\alpha$ are probabilities,

```{math}
\left|\int h\,\d(\alpha_n-\alpha)\right|
\le
2\eta
+
\left|\int g\,\d(\alpha_n-\alpha)\right|,
```

and the last term tends to zero. Conversely, if
$\alpha_n\rightharpoonup\alpha$, then
$\alpha_n\otimes\alpha_n$, $\alpha_n\otimes\alpha$, and
$\alpha\otimes\alpha$ converge weakly on the compact product space. Applying
this to the continuous bounded function $K$ in

```{math}
\operatorname{MMD}_K(\alpha_n,\alpha)^2
=
\iint K\,\d\alpha_n\,\d\alpha_n
-2\iint K\,\d\alpha_n\,\d\alpha
+\iint K\,\d\alpha\,\d\alpha
```

gives convergence to zero.
:::

Further background on RKHS spaces can be found in
{cite:p}`berlinet03reproducing,Hofmann2008,scholkopf2002learning`.

:::{admonition} Remark: Universal kernels
:class: ot4ml-remark

The hypothesis in Proposition {ref}`prop-mmd-metrization` is called universality of the kernel. Equivalently, finite sums of the form $\sum_{i=1}^n a_i \Krkhs(x_i,\cdot)$ are dense in $\Cc(\Xx)$ for the uniform norm. For translation-invariant kernels on $\Xx=\RR^d$, $\Krkhs(x,y)=\Krkhs_0(x-y)$, this is equivalent, in the usual sense on compact sets or with suitable decay assumptions, to the Fourier transform not vanishing on its support {cite:p}`sriperumbudur2008injective,sriperumbudur2012empirical`.
:::

In the special case where $\alpha=\sum_{i=1}^n a_i\delta_{x_i}$ is discrete,
one obtains

```{math}
:label: eq-mmd-discrete-web
\norm{\alpha}_K^2
=
\sum_{i,i'} a_i a_{i'}K(x_i,x_{i'})
=
a^\top K_X a,
```

where $(K_X)_{i,i'}=K(x_i,x_{i'})$. In particular, if
$\alpha=\sum_i a_i\delta_{x_i}$ and
$\beta=\sum_i b_i\delta_{x_i}$ are supported on the same point cloud, then
$\norm{\alpha-\beta}_K^2=(a-b)^\top K_X(a-b)$, a Euclidean quadratic form on
the simplex. For two arbitrary discrete measures,

```{math}
:label: eq-mmd-two-clouds-web
\norm{\alpha-\beta}_K^2
=
\sum_{i,i'} a_i a_{i'}K(x_i,x_{i'})
+
\sum_{j,j'} b_j b_{j'}K(y_j,y_{j'})
-
2\sum_{i,j}a_i b_j K(x_i,y_j).
```

(sec-phi-div)=
## Phi-Divergences

This section develops divergences based on pointwise density ratios. They are
computationally simple and statistically classical, but they do not see small
spatial displacements between singular measures.

### Definition by Density Ratios

Phi-divergences are simpler to compute, typically $O(n)$ for discrete
distributions, but they never metrize weak-$\ast$ convergence on singular
measures. Another route is possible through Bregman divergences, which may
metrize weak-$\ast$ convergence when the associated entropy functional is
weakly regular.

(def_entropy)=
:::{admonition} Definition: Entropy Function
:class: important
A function $\phi:\RR\to\RR\cup\{+\infty\}$ is an entropy function if it is
lower semicontinuous, convex, has domain contained in $[0,+\infty)$, and
$\operatorname{dom}\phi$ intersects $(0,+\infty)$. Its growth at infinity is
described by

```{math}
\phi'_\infty
=
\lim_{x\to+\infty}\frac{\phi(x)}{x}
\in
\RR\cup\{+\infty\}.
```
:::

If $\phi'_\infty=+\infty$, then $\phi$ grows faster than any linear function
and is called superlinear. Any entropy function induces a $\phi$-divergence,
also known as a Ciszar divergence or $f$-divergence
{cite:p}`ciszar1967information,ali1966general`.

:::{admonition} Definition: $\phi$-Divergence
:class: important
Let $\phi$ be an entropy function. For $\alpha,\beta\in\mathcal{M}(\X)$, let

```{math}
\alpha
=
\frac{\d\alpha}{\d\beta}\,\beta
+
\alpha^\perp
```

be the Lebesgue decomposition of $\alpha$ with respect to $\beta$. The
divergence is

```{math}
:label: eq-phi-div-web
D_\phi(\alpha|\beta)
\eqdef
\int_\X
\phi\left(\frac{\d\alpha}{\d\beta}\right)
\,\d\beta
+
\phi'_\infty\,\alpha^\perp(\X),
```

if $\alpha,\beta$ are nonnegative, and $+\infty$ otherwise.
:::

Here $\alpha^\perp$ is the part of $\alpha$ singular with respect to $\beta$.
The singular term is the recession contribution of the perspective
functional. It gives the weak-$\ast$ lower-semicontinuous extension of the
density-ratio integral when singular mass appears. This is essential for
linear-growth entropies such as total variation. For superlinear entropies,
such as the usual entropy, $\phi'_\infty=+\infty$, so the divergence is
infinite when $\alpha$ is not absolutely continuous with respect to $\beta$.

For discrete measures supported on the same set,

```{math}
\alpha=\sum_i a_i\delta_{x_i},
\qquad
\beta=\sum_i b_i\delta_{x_i},
```

the formula becomes

```{math}
:label: eq-div-disc-meas
D_\phi(a|b)
=
\sum_{i\in\operatorname{supp}(b)}
b_i\,
\phi\left(\frac{a_i}{b_i}\right)
+
\phi'_\infty
\sum_{i\notin\operatorname{supp}(b)}a_i .
```

:::{admonition} Proposition: Basic Properties of $\phi$-Divergences
:class: important
If $\phi$ is an entropy function, then $D_\phi$ is jointly $1$-homogeneous,
convex, and weak-$\ast$ lower semicontinuous in $(\alpha,\beta)$.
:::

:::{dropdown} Proof
Define the perspective

```{math}
\psi(u,v)
=
\begin{cases}
v\,\phi(u/v), & v>0,\\
u\,\phi'_\infty, & v=0.
\end{cases}
```

Joint $1$-homogeneity follows directly. In the discrete case,
$D_\phi(a|b)=\sum_i\psi(a_i,b_i)$, so it is enough to show that $\psi$ is
convex. For $v_1,v_2>0$, $\lambda\in[0,1]$, $\tau=1-\lambda$, set

```{math}
\theta_1=\frac{\tau v_1}{\tau v_1+\lambda v_2},
\qquad
\theta_2=\frac{\lambda v_2}{\tau v_1+\lambda v_2}.
```

Then $\theta_1+\theta_2=1$ and

```{math}
\frac{\tau u_1+\lambda u_2}{\tau v_1+\lambda v_2}
=
\theta_1\frac{u_1}{v_1}
+
\theta_2\frac{u_2}{v_2}.
```

Convexity of $\phi$ gives convexity of $\psi$ on $v>0$; the case $v=0$ follows
by lower semicontinuity of the recession value. In the measure case,
weak-$\ast$ lower semicontinuity is the standard theorem for convex integral
functionals with recession extension.
:::

:::{admonition} Proposition: Nonnegativity of $\phi$-Divergences
:class: important
Assume that $\phi(1)=0$. For probability measures,
$D_\phi(\alpha|\beta)\ge0$. If $\phi$ is strictly convex, then equality holds
if and only if $\alpha=\beta$. This extends to arbitrary nonnegative measures
if one also imposes $\phi\ge0$.
:::

:::{dropdown} Proof
Let $m=\alpha+\beta$ and write
$a=\d\alpha/\d m$, $b=\d\beta/\d m$. Using the perspective,

```{math}
D_\phi(\alpha|\beta)
=
\int \psi(a,b)\,\d m.
```

For probability measures, $\int a\,\d m=\int b\,\d m=1$. Jensen's inequality
and $\psi(1,1)=\phi(1)=0$ give

```{math}
D_\phi(\alpha|\beta)
\ge
\psi\left(\int a\,\d m,\int b\,\d m\right)
=0.
```

If $\phi$ is strictly convex, equality in Jensen forces $a=b$ almost
everywhere, hence $\alpha=\beta$.
:::

### Classical Examples and Topology

The following examples calibrate the strength of $\phi$-divergences. KL is
sensitive to absolute continuity, while total variation gives the strong
topology and therefore behaves very differently from Wasserstein-type weak
metrics.

:::{admonition} Example: Kullback--Leibler divergence
:class: ot4ml-example

The Kullback--Leibler divergence $\KL \eqdef \Divergm_{\phi_{\KL}}$, also known as the relative entropy, was already introduced in {eq}`eq-defn-rel-entropy` and {eq}`eq-kl-defn`. It is the divergence associated to the Shannon--Boltzmann entropy function $\phi_{\KL}$, given by

```{math}
:label: eq-shannon-entropy

\phi_{\KL}(s)= \begin{cases}
s\log(s)-s+1 & \textnormal{for } s>0 , \\
1 & \textnormal{for } s=0 , \\
+\infty & \textnormal{otherwise.}
\end{cases}
```
:::
(exmp-tv)=
:::{admonition} Example: Total variation
:class: ot4ml-example

The total variation distance $\TV \eqdef \Divergm_{\phi_{\TV}}$ is the divergence associated to

```{math}
:label: eq-tv-entropy

\phi_{\TV}(s)= \begin{cases}
|s-1| & \textnormal{for } s\geq0 , \\
+\infty & \textnormal{otherwise.}
\end{cases}
```

It actually defines a norm on the full space of measures $\Mm(\X)$ where

```{math}
:label: eq-defn-tv

\TV(\al|\be) = \norm{\al-\be}_{\TV},
\qquad\text{where}\qquad
\norm{\al}_{\TV} = |\al|(\X) = \int_\X \d|\al|(x).
```

If $\al$ has a density $\density{\al}$ on $\X=\RR^\dim$, then the TV norm is the $L^1$ norm on functions, $\norm{\al}_{\TV} = \int_\X |\density{\al}(x)| \d x = \norm{\density{\al}}_{L^1}$.

If $\al$ is discrete as in {eq}`eq-div-disc-meas`, then the TV norm is the $\ell^1$ norm of vectors in $\RR^n$, $\norm{\al}_{\TV}=\sum_i |\a_i| = \norm{\a}_{\ell^1}$.
:::

:::{admonition} Remark: Strong vs. weak topology
:class: ot4ml-remark

The total variation norm {eq}`eq-defn-tv` defines the so-called "strong" topology on the space of measures.

On a compact domain $\X$ of radius $R$, one has

```{math}
\Wass_1(\al,\be) \leq R \norm{\al-\be}_{\TV}
```

so that this strong notion of convergence implies the weak convergence metrized by Wasserstein distances.

The converse is, however, not true, since $\de_x$ does not converge strongly to $\de_y$ if $x \rightarrow y$ (note that
$\norm{\de_x-\de_y}_{\TV}=2$ if $x \neq y$).

A chief advantage is that $\Mm_+^1(\Xx)$ (once again on a compact ground space $\X$) is compact for the weak topology so that from any sequence of probability measures $(\al_k)_k$, one can always extract a converging subsequence, which makes it a suitable space for several optimization problems.
:::

### Main Families of $\phi$-Divergences

Several classical divergences fit in the same template. The power-divergence
family

```{math}
\phi_\gamma(s)
=
\frac{s^\gamma-\gamma s+\gamma-1}{\gamma(\gamma-1)}
\qquad(\gamma\ne0,1)
```

interpolates between the Pearson $\chi^2$ divergence at $\gamma=2$, a
Hellinger-type behavior at $\gamma=1/2$, and, by taking limits, the KL
divergence as $\gamma\to1$ and the reverse KL or Burg entropy
$\phi_0(s)=-\log s+s-1$ as $\gamma\to0$. The Hellinger divergence is often
written with $\phi_H(s)=(\sqrt{s}-1)^2$; for measures with densities,
$\operatorname{Hellinger}(\alpha,\beta)
=\norm{\sqrt{\rho_\alpha}-\sqrt{\rho_\beta}}_{L^2}$. The Jensen--Shannon
divergence is the symmetrized and bounded KL-to-the-mixture divergence

```{math}
\operatorname{JS}(\alpha,\beta)^2
=
\frac12\operatorname{KL}\!\left(\alpha\middle|\frac{\alpha+\beta}{2}\right)
+
\frac12\operatorname{KL}\!\left(\beta\middle|\frac{\alpha+\beta}{2}\right),
```

generated, up to an irrelevant affine term, by
$\phi_{\operatorname{JS}}(s)=s\log s-(s+1)\log((s+1)/2)$. Total variation,
generated by $|s-1|$, is exceptional because it is both a $\phi$-divergence
and an integral probability metric.

(fig:dualnorms-phi-generators)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("dualnorms-phi-generators")
```

*$\phi$-divergences through density ratios. The left panel shows normalized
generators for common divergences as functions of $s=\d\alpha/\d\beta$; all
curves vanish at $s=1$ up to affine normalization. The right panel shows the
discrete formula $D_\phi(a|b)=\sum_i b_i\phi(a_i/b_i)$: hollow blue circles
encode $b_i$, filled red circles encode $a_i$, the violet curve gives the
ratios $a_i/b_i$, and orange lollipops show local KL-type contributions.*
:::

The interactive demo changes the generator family and the amount of mismatch
between two discrete histograms. The near-zero control deliberately creates
small target bins, making the recession and singularity behavior visible:
ratio-based penalties react to overlap and density ratios rather than to
spatial displacement.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the divergence and ratio controls to compare convex generators and their dual penalties around density ratio one.
:::

<iframe class="ot4ml-live-frame" title="Phi-divergence controls" src="../live/dualnorm-phi.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

:::{admonition} Remark: $\phi$-divergences versus Bregman divergences
:class: ot4ml-remark

Except for KL-type entropies, $\phi$-divergences should not be confused with Bregman divergences. A $\phi$-divergence compares measures pointwise through the density ratio $\d\alpha/\d\beta$ and is invariant under measurable changes of variables. A Bregman divergence is generated by a convex functional on a linear space and compares two points through first-order Taylor error. KL is special because the integral entropy $\alpha\mapsto\int \rho\log\rho$ produces a Bregman divergence whose density-ratio form is also a $\phi$-divergence.
:::

### Variational Dual Formula

The following formula turns a pointwise density-ratio penalty into a dual
optimization problem over test functions. It is the analogue, for
$\phi$-divergences, of the Kantorovich dual formula for transport costs.

:::{admonition} Proposition: Dual Expression for $\phi$-Divergences
:class: important
A $\phi$-divergence can be expressed using the positive-domain Legendre
transform

```{math}
\phi^{*,\ge0}(s)
\eqdef
\sup_{t\ge0}\, st-\phi(t)
```

as

```{math}
:label: eq-dual-div-web
D_\phi(\alpha|\beta)
=
\sup_f
\left\{
\int_\X f(x)\,\d\alpha(x)
-
\int_\X \phi^{*,\ge0}(f(x))\,\d\beta(x)
\right\}.
```

Equivalently,

```{math}
D_\phi^*(f|\beta)
=
\int_\X \phi^{*,\ge0}(f(x))\,\d\beta(x).
```
:::

:::{dropdown} Proof
First assume $\phi'_\infty=+\infty$, so the divergence is infinite unless
$\alpha$ has a density $\rho\ge0$ with respect to $\beta$. The
Legendre--Fenchel transform of $D_\phi(\cdot|\beta)$ is

```{math}
D_\phi^*(f|\beta)
=
\sup_{\rho\ge0}
\int_\X f(x)\rho(x)\,\d\beta(x)
-
\int_\X\phi(\rho(x))\,\d\beta(x)
=
\int_\X
\sup_{\rho(x)\ge0}
\left(f(x)\rho(x)-\phi(\rho(x))\right)
\d\beta(x).
```

This is the displayed integral of $\phi^{*,\ge0}$. Fenchel--Moreau gives the
dual expression. For a general entropy, the same argument is applied to the
perspective with its recession term; the singular part is encoded by the
effective domain of $\phi^{*,\ge0}$.
:::

## GANs via Duality

GANs fit naturally into the dual viewpoint: the discriminator is a
parameterized potential and the generator moves a reference measure. This
section first explains the original divergence-based GAN objective, then
contrasts it with integral probability metrics such as MMD and Wasserstein
distances.

The goal is to fit a generative parametric model
$\alpha_\theta=(g_\theta)_\sharp\zeta$ to empirical data

```{math}
\beta=\frac1m\sum_j\delta_{y_j},
```

where $\zeta$ is a fixed density over the latent space and
$g_\theta:\mathcal{Z}\to\X$ is the generator, often a neural network.

### Divergence-Based Adversarial Losses

Any $\phi$-divergence can be written in adversarial form through the dual
formula:

```{math}
\min_\theta D_\phi(\alpha_\theta|\beta)
=
\min_\theta\sup_f
\left\{
\int_\X f\,\d\alpha_\theta
-
D_\phi^*(f|\beta)
\right\}
=
\min_\theta\sup_f
\left\{
\int_\mathcal{Z} f(g_\theta(z))\,\d\zeta(z)
-
\frac1m\sum_j\phi^*(f(y_j))
\right\}.
```

Replacing the unrestricted potential $f$ by a neural network $f_\xi$ gives a
saddle problem

```{math}
\min_\theta\max_\xi
\int_\mathcal{Z} f_\xi(g_\theta(z))\,\d\zeta(z)
-
\frac1m\sum_j\phi^*(f_\xi(y_j)).
```

The original vanilla GAN {cite:p}`GAN` is this construction for the
Jensen--Shannon generator

```{math}
\phi_{\operatorname{JS}}(s)
=
s\log s-(s+1)\log\frac{s+1}{2},
\qquad
\phi_{\operatorname{JS}}^*(u)
=
-\log(2-e^u),
\quad u<\log2,
```

up to affine normalizations and the usual reparametrization of the potential
by a discriminator with values in $(0,1)$. In practice the min--max problem is
solved by alternating stochastic gradient descent/ascent. Unlike the
convex-concave variational formula, the neural parametrization is nonconvex in
$\theta$ and nonconcave in $\xi$, which explains instability and mode-collapse
pathologies. These losses estimate density ratios, which is meaningful when
the measures overlap but can saturate when the model and data are mutually
singular.
For example, the Jensen--Shannon divergence is already maximal for disjoint
supports.

### Dual Norms and Integral Probability Metrics

Instead of a density-ratio divergence, one can minimize an integral probability
metric:

```{math}
\min_\theta\norm{\alpha_\theta-\beta}_B
=
\min_\theta
\sup_{f\in B}
\left\{
\int_\mathcal{Z} f(g_\theta(z))\,\d\zeta(z)
-
\frac1m\sum_j f(y_j)
\right\}.
```

MMD-GANs take $B$ to be a unit ball in an RKHS {cite:p}`MMD-GAN`;
Wasserstein GANs take $B$ to be a Lipschitz ball, following
Kantorovich--Rubinstein duality {cite:p}`WassersteinGAN,FrognerNIPS`. The
advantage is topological: for bounded continuous RKHS balls, or for bounded
Lipschitz balls on compact spaces, the objective is weakly continuous. It can
therefore compare singular empirical and generated measures through test
functions instead of requiring pointwise density ratios. The price is that the
discriminator class must be controlled geometrically, either by a kernel norm,
a Lipschitz constraint, or a related regularization.

Wasserstein GANs originally used weight clipping as a proxy for enforcing
$f_\xi\in\{f:\operatorname{Lip}(f)\le1\}$. This parameter set is both smaller
than the true Lipschitz ball and nonconvex, so clipping should be understood
as a practical heuristic rather than a faithful implementation of the
Kantorovich--Rubinstein dual constraint.

:::{admonition} Remark: Weight clipping is only a proxy
:class: ot4ml-remark

Wasserstein GANs originally used weight clipping, constraining $\norm{\xi}_\infty \leq 1$ as a proxy for enforcing $\f_\xi \in B = \enscond{f}{\Lip(f) \leq 1}$. This parameter set is both smaller than the true Lipschitz ball and non-convex, so clipping should be understood as a practical heuristic rather than a faithful implementation of the Kantorovich--Rubinstein dual constraint.
:::
