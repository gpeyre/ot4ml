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

This section isolates the test-function viewpoint behind weak discrepancies.
Dual norms generalize the $\Wass_1$ test-function principle and are useful in
statistics because they compare distributions through a restricted
discriminator class.

### Integral Probability Metrics

The Kantorovich--Rubinstein formula for $\Wass_1$ is a special case of a dual
norm. This viewpoint designs weak discrepancies by testing signed differences
of measures against a controlled class of functions.

(def-dual-norm-ipm)=
:::{admonition} Definition: Dual Seminorm and Integral Probability Metric
:class: important
Let $B$ be a nonempty symmetric convex class of measurable functions that are
integrable against the measures under consideration. For a signed measure
$\xi$, define the extended dual seminorm

```{math}
:label: eq-dual-norm-cont-web
\norm{\xi}_B
\eqdef
\sup_{f\in B}
\int_\X f(x)\,\d\xi(x).
```

It is a norm when it is finite and $B$ separates signed measures. Applied to
$\alpha-\beta$, it is an integral probability metric; it is a genuine metric
precisely when $B$ separates probability measures.
:::

Symmetry makes the supremum equal to
$\sup_{f\in B}|\int f\,\d\xi|$, while convexity makes $B$ a natural unit ball.

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

On zero-mass signed measures with finite first moment, the Kantorovich--Rubinstein norm underlying
$\Wass_1$ is the extended dual seminorm {eq}`eq-dual-norm-cont-web` associated with

```{math}
B = \enscond{f}{\Lip(f) \leq 1}
```

the set of 1-Lipschitz functions.
:::


:::{admonition} Example: Flat norm and Dudley metric
:class: ot4ml-example

If $B$ is uniformly bounded and separates measures, then $\norm{\cdot}_B$ is a finite norm on the whole space $\Mm(\Xx)$ of finite signed measures.

This is not the case for $\Wass_1$: zero total mass is necessary, and on an
unbounded space a finite first moment is also required. For nonzero total
mass, $\norm{\xi}_B=+\infty$ because constants belong to the Lipschitz ball.

This is remedied by imposing a bound on the value of the potential $\f$, which leads for instance to the flat norm,

```{math}
:label: eq-set-flatnorm

B=\enscond{f}{\Lip(f) \leq 1 \qquad\text{and}\qquad \norm{\f}_\infty \leq 1}.
```

On compact metric spaces, it metrizes weak convergence of finite nonnegative
measures, and weak-$\ast$ convergence on every total-variation-bounded family
of signed measures.

The finite-dimensional version is obtained from the usual $\Wass_1$ dual linear program by adding the box constraints $\abs{\fD_k}\leq1$.

The flat norm is sometimes called the "Kantorovich--Rubinstein" norm {cite:p}`hanin1992kantorovich` and has been used as a fidelity term for inverse problems in imaging {cite:p}`lellmann2014imaging`.

The flat norm is equivalent to the bounded-Lipschitz, or Dudley, metric, whose
test class is

```{math}
:label: eq-set-dudley

B=\enscond{f}{\Lip(f) + \norm{f}_\infty \leq 1}.
```

On a Euclidean domain, $\Lip(f)=\norm{\nabla f}_\infty$ for differentiable
$f$.
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

If $h=\sum_{j=1}^Jc_jf_j\in\operatorname{span}(B)$, then

```{math}
\left|\int h\,\d(\alpha_n-\alpha)\right|
\le
\left(\sum_{j=1}^J|c_j|\right)\norm{\alpha_n-\alpha}_B,
```

so integrals converge for every $h\in\operatorname{span}(B)$. Let
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
kernel Hilbert space. The resulting Hilbertian dual seminorms are quadratic
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

Here ``positive definite'' has its standard kernel-theory meaning of positive
semidefinite. Strict positivity is an additional property, and its absence can
make the induced discrepancy degenerate.

The conditional version is the right notion for probability distances,
because one applies the quadratic form to signed measures
$\xi=\alpha-\beta$ of total mass zero. Adding $a(x)+a(y)$ to the kernel does
not change $\iint K(x,y)\,\d\xi(x)\,\d\xi(y)$ on such measures, and many
natural distance kernels are only conditionally positive definite.

:::{admonition} Example: Riesz, energy and Matérn-type kernels
:class: ot4ml-example

On $\RR^d$, translation-invariant kernels are most transparent in Fourier variables. The Riesz family associated with $(-\Delta)^{-s}$ has multiplier $\norm{\om}^{-2s}$ and defines a nonnegative quadratic form on zero-mass measures for which the low-frequency singularity is integrable; this is the kernel counterpart of classical Riesz potentials {cite:p}`berg84harmonic`. The energy distance corresponds to the conditionally positive kernel $\Krkhs(x,y)=-\norm{x-y}$, whose Fourier multiplier is proportional to $\norm{\om}^{-(d+1)}$; for $\xi=\al-\be$,

```{math}
-\iint \norm{x-y}\d\xi(x)\d\xi(y)
```

is exactly the customary squared energy distance
$2\EE\norm{X-Y}-\EE\norm{X-X'}-\EE\norm{Y-Y'}$; only its Fourier
representation carries a dimension-dependent constant
{cite:p}`schoenberg38,szekely2004testing`.

Shifted kernels replace $(-\Delta)^{-s}$ by $(-\Delta+\lambda I)^{-s}$ with $\lambda>0$. Their Fourier multiplier $(\norm{\om}^2+\lambda)^{-s}$ is bounded at the origin, hence the kernel is positive definite without imposing zero mass. These are Matern kernels; in closed form they are radial and involve a modified Bessel function {cite:p}`wendland2005scattered`. The Laplacian kernel $e^{-\norm{x-y}/\sigma}$ is a low-smoothness Matern example, while the Gaussian kernel $e^{-\norm{x-y}^2/(2\sigma^2)}$ is the infinite-smoothness limit after the usual rescaling of the Matern smoothness parameter.
:::


(def-kernel-mmd-norm)=
:::{admonition} Definition: Kernel Seminorm and MMD
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

It is a genuine distance when $K$ is characteristic, meaning that zero MMD
implies $\alpha=\beta$.
:::

These seminorms are usually called maximum mean discrepancies in statistics and
machine learning {cite:p}`gretton2012kernel,muandet2017kernel`, and kernel
norms in shape analysis {cite:p}`Hofmann2008`. For a positive-definite kernel,
if $X,X'$ are independent with
law $\alpha$, then
$\norm{\alpha}_K^2=\EE_{X,X'}(K(X,X'))$, whenever this expression is finite.
For a conditionally positive kernel, fixing $x_0\in\X$ and replacing $K$ by

```{math}
\widetilde K(x,y)=K(x,y)-K(x,x_0)-K(x_0,y)+K(x_0,x_0)
```

produces a positive-definite kernel with the same energy on zero-mass measures.

(prop-kernel-rkhs-dual)=
:::{admonition} Proposition: Kernel Seminorm as an RKHS Dual Norm
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

so $\norm{\cdot}_K$ is the dual seminorm associated with the RKHS unit ball.
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
If $\operatorname{MMD}_K(\alpha_n,\alpha)\to0$, then for every
$g\in\mathcal H$,

```{math}
\left|\int g\,\d(\alpha_n-\alpha)\right|
\le \norm{g}_{\mathcal H}\operatorname{MMD}_K(\alpha_n,\alpha)\to0.
```

For any $h\in\Cc(\X)$ and any $\eta>0$, choose
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

The hypothesis in Proposition {ref}`prop-mmd-metrization` is called universality of the kernel. Equivalently, finite sums of the form $\sum_{i=1}^n a_i K(x_i,\cdot)$ are dense in $\Cc(\X)$ for the uniform norm. For a bounded continuous translation-invariant kernel on $\RR^d$, a standard sufficient condition is that its Bochner spectral measure have support equal to all of $\RR^d$; under the usual $C_0$ assumptions this characterizes $C_0$-universality {cite:p}`sriperumbudur2008injective,sriperumbudur2012empirical`.
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
$\norm{\alpha-\beta}_K^2=(a-b)^\top K_X(a-b)$, a Euclidean seminorm on
the simplex. It is nondegenerate exactly when $r^\top K_Xr>0$ for every
nonzero zero-sum vector $r$. For two arbitrary discrete measures,

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
computationally simple and statistically classical, but on nondiscrete spaces
they generally induce a topology much stronger than weak convergence and do
not see small spatial displacements between mutually singular measures.

### Definition by Density Ratios

On a common discrete support, phi-divergences cost only $O(n)$ to evaluate,
but on a continuous space they generally fail to metrize weak convergence.
Bregman divergences provide a different convex construction and should not be
conflated with density-ratio divergences.

(def_entropy)=
:::{admonition} Definition: Entropy Function
:class: important
A function $\phi:\RR\to\RR\cup\{+\infty\}$ is an entropy function if it is
proper, lower semicontinuous, convex, has domain contained in $[0,+\infty)$, and
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
Let $\phi$ be an entropy function and let
$\alpha,\beta\in\mathcal{M}_+(\X)$. Write

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

with the convention $0\cdot(+\infty)=0$, and extend it by $+\infty$ whenever
either argument is not a nonnegative measure.
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

(phi-div-positive)=
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

For probability measures, $m/2$ is a probability and $a+b=1$. Jensen's
inequality and the $1$-homogeneity of $\psi$ give

```{math}
\frac12D_\phi(\alpha|\beta)
\ge
\psi\left(\frac12\int a\,\d m,\frac12\int b\,\d m\right)
=\psi(1/2,1/2)=0.
```

If $\phi$ is strictly convex, its perspective is strictly convex on the line
$u+v=1$. Equality therefore forces $a=b=1/2$ almost everywhere and hence
$\alpha=\beta$.
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

With the convention of this book, total variation
$\TV \eqdef \Divergm_{\phi_{\TV}}$ is the full variation norm, without the
factor $1/2$ sometimes used for probabilities. It is associated with

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

For probability measures on a compact metric space,

```{math}
\Wass_1(\al,\be)
\leq \frac{\operatorname{diam}(\X)}{2}\norm{\al-\be}_{\TV}.
```

Indeed, a $1$-Lipschitz test function can be shifted so that its sup norm is
at most $\operatorname{diam}(\X)/2$. Thus total-variation convergence implies
weak convergence.

The converse is false: if $x_n\to x$ with $x_n\ne x$, then
$\delta_{x_n}\rightharpoonup\delta_x$ but
$\norm{\delta_{x_n}-\delta_x}_{\TV}=2$ for every $n$.

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

interpolates, up to conventional multiplicative normalizations, between
Pearson's $\chi^2$ divergence at $\gamma=2$, Hellinger behavior at
$\gamma=1/2$, and, by taking limits, the KL
divergence as $\gamma\to1$ and the reverse KL or Burg entropy
$\phi_0(s)=-\log s+s-1$ as $\gamma\to0$. The Hellinger divergence is often
written with $\phi_H(s)=(\sqrt{s}-1)^2$. If
$\alpha=\rho_\alpha\lambda$ and $\beta=\rho_\beta\lambda$, then
$\operatorname{Hellinger}(\alpha,\beta)
=\norm{\sqrt{\rho_\alpha}-\sqrt{\rho_\beta}}_{L^2(\lambda)}$. The
Jensen--Shannon distance {cite:p}`endres2003new,osterreicher2003new` is the square root of the symmetrized, bounded
KL-to-the-mixture divergence

```{math}
\operatorname{JS}(\alpha,\beta)^2
=
\frac12\operatorname{KL}\!\left(\alpha\middle|\frac{\alpha+\beta}{2}\right)
+
\frac12\operatorname{KL}\!\left(\beta\middle|\frac{\alpha+\beta}{2}\right),
```

and $0\le\operatorname{JS}(\alpha,\beta)^2\le\log2$. Its exact generator is

```{math}
\phi_{\operatorname{JS}}(s)
=\frac12\left[s\log s-(s+1)\log\left(\frac{s+1}{2}\right)\right].
```

Total variation,
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

Except for KL-type entropies, $\phi$-divergences should not be confused with Bregman divergences. A $\phi$-divergence compares measures pointwise through the density ratio $\d\alpha/\d\beta$. It is invariant under measurable bijections and cannot increase under measurable coarse-graining or a Markov kernel {cite:p}`ciszar1967information`. A Bregman divergence is generated by a convex functional on a linear space and measures first-order Taylor error. KL is special because the integral entropy $\alpha\mapsto\int \rho\log\rho$ produces a Bregman divergence whose density-ratio form is also a $\phi$-divergence.
:::


### Variational Dual Formula

The following formula turns a pointwise density-ratio penalty into a dual
optimization problem over test functions. It is the analogue, for
$\phi$-divergences, of the Kantorovich dual formula for transport costs.

:::{admonition} Proposition: Variational Representation of a $\phi$-Divergence
:class: important
Assume that $\X$ is compact. Since $\phi$ is extended by $+\infty$ on
negative arguments, define its Legendre transform by

```{math}
\phi^*(s)
\eqdef
\sup_{r\ge0}\{sr-\phi(r)\}.
```

as

```{math}
:label: eq-dual-div
D_\phi(\alpha|\beta)
=
\sup_{f\in\Cc(\X)}
\left\{
\int_\X f(x)\,\d\alpha(x)
-\int_\X \phi^*(f(x))\,\d\beta(x)
\right\}.
```

Equivalently,

```{math}
D_\phi^*(f|\beta)=\int_\X \phi^*(f(x))\,\d\beta(x).
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

This is the displayed integral of $\phi^*$. For finite $\phi'_\infty$, the
upper endpoint of $\operatorname{dom}\phi^*$ encodes the singular recession
term. Convexity, weak-$\ast$ lower semicontinuity, and Fenchel--Moreau then give
the dual expression.
:::

(sec-gan-duality)=
## GANs via Duality

GANs fit naturally into the dual viewpoint: the discriminator is a
parameterized potential and the generator moves a reference measure. This
section first explains the original divergence-based GAN objective, then
contrasts it with integral probability metrics such as MMD and Wasserstein
distances.

The goal is to fit a generative parametric model
$\alpha_\theta=(g_\theta)_\sharp\zeta$ to empirical data

```{math}
\beta=\frac1m\sum_{j=1}^m\delta_{y_j},
```

where $\zeta$ is a fixed probability measure on the latent space and
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
\frac1m\sum_{j=1}^m\phi^*(f(y_j))
\right\}.
```

Replacing the unrestricted potential $f$ by a neural network $f_\xi$ gives a
saddle problem

```{math}
\min_\theta\max_\xi
\int_\mathcal{Z} f_\xi(g_\theta(z))\,\d\zeta(z)
-
\frac1m\sum_{j=1}^m\phi^*(f_\xi(y_j)).
```

For fixed $\theta$, restricting the discriminator gives a lower bound on the
exact divergence. This distinction is essential for empirical data: if
$\beta$ is discrete and $\alpha_\theta$ is non-atomic, a superlinear
divergence is $+\infty$, while the restricted objective can remain finite.

The original vanilla GAN {cite:p}`GAN` corresponds, up to an additive
constant and discriminator reparametrization, to the unscaled
Jensen--Shannon generator $\widehat\phi_{\operatorname{JS}}=2\phi_{\operatorname{JS}}$,

```{math}
\widehat\phi_{\operatorname{JS}}(s)
=
s\log s-(s+1)\log\frac{s+1}{2},
\qquad
\widehat\phi_{\operatorname{JS}}^*(u)
=
-\log(2-e^u),
\quad u<\log2,
```

Thus $D_{\widehat\phi_{\operatorname{JS}}}=2\operatorname{JS}^2$. In practice
the min--max problem is solved by alternating stochastic gradient
descent/ascent. Although the unrestricted maximization is concave in $f$,
neural parametrization generally destroys concavity in $\xi$; the generator
problem is likewise nonconvex in $\theta$. Density-ratio losses can also
saturate on singular measures: $\operatorname{JS}^2$ reaches its maximum
$\log2$ on disjoint supports.

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
\frac1m\sum_{j=1}^m f(y_j)
\right\}.
```

MMD-GANs take $B$ to be a unit ball in an RKHS {cite:p}`MMD-GAN`;
Wasserstein GANs take $B$ to be a Lipschitz ball, following
Kantorovich--Rubinstein duality {cite:p}`WassersteinGAN,FrognerNIPS`. The
advantage is topological: for a continuous kernel on a compact space, the
RKHS unit ball is uniformly bounded and equicontinuous, while the normalized
Lipschitz ball is compact by Arzela--Ascoli. The objective is therefore weakly
continuous. It can
therefore compare singular empirical and generated measures through test
functions instead of requiring pointwise density ratios. The price is that the
discriminator class must be controlled geometrically, either by a kernel norm,
a Lipschitz constraint, or a related regularization.

:::{admonition} Remark: Weight clipping is only a proxy
:class: ot4ml-remark

Wasserstein GANs originally used weight clipping, constraining
$\norm{\xi}_\infty\leq1$ as a proxy for enforcing
$f_\xi\in\{f:\operatorname{Lip}(f)\leq1\}$. The parameter box is convex, but
its image through a neural network is neither the full Lipschitz ball nor
generally a convex function class, and parameter optimization remains
nonconcave. Clipping is therefore a heuristic rather than a faithful
implementation of the Kantorovich--Rubinstein constraint.
:::

(ex-imitation-learning-ot)=
:::{admonition} Example: Application to imitation learning
:class: ot4ml-example

In imitation learning, one can compare the expert occupancy measure $\rho_E$ and the learner occupancy measure $\rho_\theta$ on state-action space. OT gives either a primal matching loss $W(\rho_\theta,\rho_E)$, or a dual adversarial reward obtained from a Kantorovich potential. Thus the discriminator in an adversarial imitation method can be interpreted as a learned reward shaping the learner toward the expert distribution, exactly as the GAN discriminator above is a learned potential. Wasserstein adversarial imitation and primal Wasserstein imitation exploit this distribution-matching viewpoint while retaining the geometry of state-action space, for instance through a cost that compares nearby states and actions more mildly than distant ones {cite:p}`XiaoHermanWagnerZiescheEtesamiLinh2019WAIL,DadashiHussenotGeistPietquin2020PWIL`.
:::
