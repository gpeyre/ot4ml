---
title: "Generalized OT Problems"
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-generalized-ot-problems)=

This chapter changes the optimization problem rather than only the ground
distance. Barycenters average several measures, multi-marginal OT couples many
measures at once, low-rank and capacity constraints restrict the admissible
plans, inverse OT learns the cost from observed transport, and weak or
martingale OT acts on conditional laws. These models remain close to
Kantorovich optimization, but the unknown can now be a family of couplings, a
factored plan, a learned cost, or a coupling subject to nonlinear conditional
constraints.

:::{admonition} Guiding Comparison
:class: tip
Barycenters optimize over the unknown measure being averaged. Multi-marginal
OT optimizes over a whole joint law with several marginals. Low-rank and
capacity constraints restrict the coupling geometry. Inverse OT makes the
ground cost the unknown. Weak and martingale OT constrain or penalize
conditional laws rather than only pointwise pairs.
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

(sec-barycenters)=
## OT Barycenters

Barycenters ask how to average probability measures rather than points. This
section explains the variational definition, the special closed forms in one
dimension and for Gaussians, and the entropic algorithms used in practice.

### Frechet Means

The natural formulation is a Frechet-mean problem on the space of probability
measures: the unknown is the barycenter measure itself, and its support is not
prescribed. It uses the continuous Kantorovich value $\mathcal L_c$ defined
in {eq}`eq-mk-generic`.

(def-ot-barycenter)=
:::{admonition} Definition: Optimal-Transport Barycenter
:class: definition
Given input measures $(\beta_s)_{s=1}^S$ on a space $\Xx$ and weights
$\lambda\in\simplex_S$, discard any zero-weight inputs. An
*optimal-transport barycenter* of this weighted family is any solution of

```{math}
:label: eq-barycenter-generic
\min_{\alpha\in\mathcal M_+^1(\Xx)}
\sum_{s=1}^S
\lambda_s\,\mathcal L_c(\alpha,\beta_s).
```
:::

Unlike a coupling, the barycenter is a new probability measure on $\Xx$.
Since the weights $\lambda_s$ are nonnegative, problem
{eq}`eq-barycenter-generic` is convex in $\alpha$: Proposition
{ref}`prop-kantorovich-value-curvature` shows that the continuous Kantorovich
value is jointly convex in its two marginals.
Agueh and Carlier introduced this problem, following earlier ideas of Carlier and Ekeland
{cite:p}`Carlier_wasserstein_barycenter,carlierekelandmatching`. For the
quadratic cost on $\Xx=\RR^d$, a barycenter exists under the finite-second-
moment assumption. It is unique if at least one positive-weight input is
absolutely continuous; more general criteria ensure uniqueness through an
essentially unique multi-marginal barycentric map. Discrete existence,
consistency, and fixed-point constructions are studied in
{cite:p}`anderes2016discrete,alvarez2016fixed,leGouic2016existence`.

#### Fixed-support discrete barycenters

For computation, one often turns the preceding infinite-dimensional problem
into a finite one by prescribing possible barycenter locations. Assume the
inputs are discrete,

```{math}
\beta_s=\sum_{j=1}^{n_s} b_{s,j}\delta_{x_{s,j}},
\qquad
b_s=(b_{s,j})_{j=1}^{n_s}\in\simplex_{n_s}.
```

Choose candidate barycenter sites $(y_i)_{i=1}^n$ and restrict the unknown to
$\alpha=\sum_i a_i\delta_{y_i}$. For each input $s$, the cost
$\mathcal L_c(\alpha,\beta_s)$ then becomes a finite Kantorovich problem with
cost matrix

```{math}
(C_s)_{ij}=c(y_i,x_{s,j})\in\RR^{n\times n_s}.
```

Thus its value is $\mathcal L_{C_s}(a,b_s)$, in the notation of the discrete
Kantorovich problem {eq}`eq-kanto-discr-web`.

(def-fixed-support-discrete-barycenter)=
:::{admonition} Definition: Fixed-Support Discrete OT Barycenter
:class: definition
With the candidate sites and cost matrices above, a *fixed-support discrete OT
barycenter* is a measure $\alpha^\star=\sum_i a_i^\star\delta_{y_i}$ whose
weight vector $a^\star=(a_i^\star)_{i=1}^n$ solves

```{math}
:label: eq-wass-discr
\min_{a\in\simplex_n}
\sum_{s=1}^S
\lambda_s\,\mathcal L_{C_s}(a,b_s),
```
:::

This construction is a finite-dimensional restriction, not an exact discrete
reduction of the general barycenter problem. In the ordinary two-marginal
Kantorovich problem, once both marginals are discrete, the two supports are
known and the whole problem is exactly the matrix optimization
{eq}`eq-kanto-discr-web` on their product support. For barycenters, the input
supports do not determine the support of the unknown barycenter: a minimizer
may place mass outside the chosen sites $(y_i)_i$ and outside the union of the
input supports. Once the candidate support is fixed, however, the nonnegative
weights $\lambda_s$ and Proposition
{ref}`prop-discrete-kantorovich-joint-convexity` show that problem
{eq}`eq-wass-discr` is convex in $a$: the discrete Kantorovich value is jointly
convex in its two histograms.

For quadratic costs, the multi-marginal formulation of Section
{ref}`sec-multimarginal-ot` shows that, for discrete inputs, one may choose a
barycenter supported on weighted averages $\sum_s\lambda_s x_{s,i_s}$ of one
support point from each input. This exact candidate set can contain
$\prod_s n_s$ points, but Corollary
{ref}`cor-discrete-barycenters` shows that there exists a barycenter for which at
most $\sum_s n_s-S+1$ of them carry positive mass. Prescribing the support
$(y_i)_i$ before solving {eq}`eq-wass-discr` is nevertheless a numerical
approximation, because the active weighted averages are not known in advance.

:::{admonition} Example: Two measures recover a Wasserstein geodesic
:class: ot4ml-example

For $S=2$, $c(x,y)=\norm{x-y}^2$ and weights $(1-t,t)$, the barycenter is the point at time $t$ on a Wasserstein geodesic between $\beta_0$ and $\beta_1$. If $T$ is the Brenier map from $\beta_0$ to $\beta_1$, this barycenter is $((1-t)\Id+tT)_\sharp\beta_0$, the McCann interpolation of Definition {ref}`def-monge-mccann-interpolation`. If no Monge map is available, Definition {ref}`def-w2-geodesic-induced-by-plan` uses an optimal coupling $\pi$ and gives the barycenter as the push-forward of $\pi$ by $(x,y)\mapsto(1-t)x+ty$.
:::


:::{admonition} Example: Dirac inputs recover Fréchet means
:class: ot4ml-example

The general barycenter formulation above extends the computation of barycenters of points $(x_s)_{s=1}^S\in\Xx^S$ to arbitrary measures. Indeed, if $\beta_s=\delta_{x_s}$ is a single Dirac mass, then a solution is $\delta_{x^\star}$, where $x^\star$ minimizes $x\mapsto\sum_s\lambda_s c(x,x_s)$.
:::


Figure {ref}`fig:barycenters-four-shapes` moves beyond this degenerate case and compares barycenter grids obtained from one-dimensional quantile averaging and two-dimensional entropic transport under the same bilinear corner weights.

(fig:barycenters-four-shapes)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("barycenters-four-shapes")
```

*Wasserstein barycenter grids for four corner measures. The left panel uses
the one-dimensional formula
$Q_{u,v}=\sum_{i,j}\lambda_{ij}(u,v)Q_{ij}$ for one Gaussian law and three
asymmetric two-Gaussian mixtures, and displays densities reconstructed from
the averaged quantiles. The right panel computes entropic Wasserstein
barycenters on a common pixel grid for the cat, two-disk, cross and clover
silhouettes, using the normalized squared ground cost,
$\epsilon=4\cdot10^{-4}$ and a Sinkhorn tolerance of $5\cdot10^{-8}$.
The barycenters are rendered as density images with values clamped at their
$95\%$ quantile rather than by threshold contours. Colors interpolate between
the four corners and encode the same bilinear weights in both panels.*
:::

The interactive demo below keeps the exact one-dimensional formula visible: the two
coordinates set bilinear weights on the four corner laws, the middle panel
averages their quantile functions, and the right panel reconstructs the
resulting barycenter density.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the barycentric coordinate controls to move through the four input laws and compare quantile and entropic barycenter constructions.
:::


:::{admonition} Remark: Mean of a quadratic barycenter
:class: ot4ml-remark

For $c(x,y)=\norm{x-y}^2$, the mean of the barycenter $\al^\star$ is necessarily the barycenter of the means,

```{math}
\int_\Xx x \d\al^\star(x) = \sum_s \la_s \int_\Xx x \d\be_s(x).
```

Write $m_\alpha=\int x\,\d\alpha(x)$ and let
$\alpha^0=(x\mapsto x-m_\alpha)_\sharp\alpha$ be the centered translate. Then

```{math}
\Wass_2^2(\alpha,\beta)
=
\norm{m_\alpha-m_\beta}^2+\Wass_2^2(\alpha^0,\beta^0).
```

The cross term vanishes under every coupling of the centered measures. The
barycenter objective therefore separates into a centered term and the strictly
convex Euclidean function
$m\mapsto\sum_s\lambda_s\norm{m-m_{\beta_s}}^2$, whose minimizer is
$\sum_s\lambda_s m_{\beta_s}$. If the inputs have compact support,
Proposition {ref}`prop-multimarginal-barycenter` also gives a barycenter
supported in the convex hull of their supports.
:::


### One-Dimensional Case

On the line, barycenters become linear after the quantile change of variables.
This gives the rare case where the barycenter is explicit rather than the
solution of a high-dimensional optimization problem.

(prop-quantile-barycenters)=
:::{admonition} Proposition: Quantile Barycenters on the Line
:class: important
For $\Xx=\RR$ and $c(x,y)=|x-y|^2$, the quantile function of a Wasserstein
barycenter is the weighted average of the input quantile functions:

```{math}
F_{\alpha^\star}^{-1}(r)
=
\sum_{s=1}^S
\lambda_s F_{\beta_s}^{-1}(r),
\qquad r\in(0,1).
```
:::

:::{dropdown} Proof
The one-dimensional formula for $\Wass_2$ gives

```{math}
\sum_s\lambda_s\Wass_2^2(\alpha,\beta_s)
=
\int_0^1
\sum_s\lambda_s
\abs{F_\alpha^{-1}(r)-F_{\beta_s}^{-1}(r)}^2
\d r.
```

The minimization decouples pointwise in $r$. For each fixed $r$, the
minimizer of
$z\mapsto\sum_s\lambda_s|z-F_{\beta_s}^{-1}(r)|^2$ is the weighted average
$\sum_s\lambda_sF_{\beta_s}^{-1}(r)$. This function is nondecreasing because
it is a positive weighted sum of nondecreasing quantile functions, hence it
is a valid quantile function.
:::

### Gaussian Case

Gaussian barycenters show that the same separation as in the Gaussian
Wasserstein formula persists: means average linearly, while covariances
average according to the Bures--Wasserstein geometry.

(prop-gaussian-barycenter)=
:::{admonition} Proposition: Nondegenerate Gaussian inputs remain Gaussian
:class: ot4ml-proposition

Let the positive-weight inputs be $\beta_s=\Gaussian(\mean_s,\cov_s)$, with
$\cov_s\succeq0$, and assume that at least one $\cov_s$ is positive definite.
The quadratic Wasserstein barycenter is unique and has the form
$\alpha^\star=\Gaussian(\mean,\cov)$, where

```{math}
\mean=\sum_s\lambda_s\mean_s.
```

Its positive-definite covariance $\cov$ is the unique minimizer of the Bures objective

```{math}
\cov \mapsto \sum_s \la_s \Bb(\cov,\cov_s)^2.
```

Equivalently, defining the map on the positive-definite cone

```{math}
\Psi_{\lambda}(X)
:=
\sum_s \la_s
\pa{X^{1/2}\cov_sX^{1/2}}^{1/2},
```

its covariance is the unique solution of the fixed-point equation

```{math}
\Psi_{\lambda}(\cov)=\cov.
```

In dimension one, if $\sigma_s=\sqrt{\cov_s}$ denotes the input standard
deviation, then the barycenter standard deviation is
$\sigma=\sum_s\lambda_s\sigma_s$.
:::

:::{dropdown} Proof
Let $\mathcal R\alpha$ denote the Gaussian measure with the same mean and
covariance as $\alpha$. For every competitor $\alpha\in\Pp_2(\RR^d)$ and every
Gaussian input $\beta_s$, the Gelbrich contraction of Theorem
{ref}`thm-gelbrich-projection` gives

```{math}
\Wass_2^2(\mathcal R\alpha,\beta_s)
=
\Wass_2^2(\mathcal R\alpha,\mathcal R\beta_s)
\leq
\Wass_2^2(\alpha,\beta_s).
```

Summing with weights $\lambda_s$ shows that moment-matched Gaussian projection
cannot increase the barycenter objective. Since a barycenter exists, projecting
any minimizer produces a Gaussian barycenter. The input with positive-definite
covariance is absolutely continuous, so the uniqueness criterion following
Definition {ref}`def-ot-barycenter` implies that the barycenter itself is this
Gaussian measure.

For a Gaussian candidate, the Gaussian Wasserstein formula separates the
objective as

```{math}
\sum_s\lambda_s\Wass_2^2\bigl(\Gaussian(\mean,\cov),\Gaussian(\mean_s,\cov_s)\bigr)
=
\sum_s\lambda_s\norm{\mean-\mean_s}^2
+
\sum_s\lambda_s\Bb(\cov,\cov_s)^2.
```

The first term is uniquely minimized at
$\mean=\sum_s\lambda_s\mean_s$. The second is the Bures barycenter problem.
Uniqueness of the Wasserstein barycenter makes its covariance minimizer unique,
and the presence of a positive-definite input makes this minimizer positive
definite {cite:p}`alvarez2016fixed,bhatia2018bures`. At such a minimizer, set

```{math}
T_s
\eqdef
\cov^{-1/2}
\pa{\cov^{1/2}\cov_s\cov^{1/2}}^{1/2}
\cov^{-1/2}.
```

The differential of $\cov\mapsto\Bb(\cov,\cov_s)^2$ in a symmetric direction
$H$ is $\operatorname{tr}((\Id-T_s)H)$. Hence first-order optimality is
$\sum_s\lambda_sT_s=\Id$. Multiplying on the left and right by $\cov^{1/2}$
gives the covariance equation. In dimension one,
$\Bb(\sigma^2,\sigma_s^2)^2=(\sigma-\sigma_s)^2$, whose minimizer is
$\sigma=\sum_s\lambda_s\sigma_s$.
:::

If all input covariances are singular, the same contraction argument still
gives a Gaussian barycenter, but the uniqueness step can fail and non-Gaussian
barycenters may coexist. Thus nondegeneracy is essential when asserting that
every barycenter is Gaussian.

:::{admonition} Remark: Forward KL barycenter of Gaussian laws
:class: ot4ml-remark

The contrast with Wasserstein averaging is particularly sharp for the forward
KL barycenter. Assume now that every $\cov_s\succ0$, and define

```{math}
\alpha_{\mathrm{KL}}
:=
\argmin_{\alpha\in\Pp(\RR^d)}
\sum_s\lambda_s\KL(\alpha\mid\beta_s).
```

Then $\alpha_{\mathrm{KL}}=\Gaussian(\mean_{\mathrm{KL}},\cov_{\mathrm{KL}})$,
with

```{math}
\cov_{\mathrm{KL}}
=
\left(\sum_s\lambda_s\cov_s^{-1}\right)^{-1},
\qquad
\mean_{\mathrm{KL}}
=
\cov_{\mathrm{KL}}
\sum_s\lambda_s\cov_s^{-1}\mean_s.
```

Thus $\cov_{\mathrm{KL}}$ is the weighted harmonic mean of the covariance
matrices. Unlike the Wasserstein barycenter in Proposition
{ref}`prop-gaussian-barycenter`, its mean is precision-weighted and therefore
depends on the input covariances. Normalizing the geometric mean
$\prod_s(\d\beta_s/\d x)^{\lambda_s}$ gives this Gaussian, and the objective
differs from $\KL(\alpha\mid\alpha_{\mathrm{KL}})$ only by a constant. This is
directional: minimizing $\sum_s\lambda_s\KL(\beta_s\mid\alpha)$ over arbitrary
$\alpha$ gives the mixture $\sum_s\lambda_s\beta_s$, generally not a Gaussian;
see Section {ref}`sec-phi-div`.
:::

:::{admonition} Remark: Raw fixed-point iteration
:class: ot4ml-remark

The raw Picard map $\Psi_{\lambda}$ is not a global Banach contraction in the
Frobenius norm, as the scalar case already shows. With
$c=\sum_s\lambda_s\sigma_s$ and covariance fixed point $\cov_\star=c^2$, one
has

```{math}
\Psi_{\lambda}(r)=c\sqrt r,
\qquad
\Psi_{\lambda}^k(r)=\cov_\star^{1-2^{-k}}r^{2^{-k}}.
```

Every compact interval $[m,M]\subset(0,+\infty)$ containing $\cov_\star$ is
invariant under $\Psi_{\lambda}$, and the exact Lipschitz constant of
$\Psi_{\lambda}^k$ on this interval is

```{math}
q_k
=
2^{-k}\pa{\frac{\cov_\star}{m}}^{1-2^{-k}},
```

which tends to zero. Thus sufficiently high iterates are contractions on every
such fixed interval.
The raw iteration $X_{\ell+1}=\Psi_{\lambda}(X_\ell)$ often converges
numerically, but no global contraction theorem explains this behavior
{cite:p}`RuschendorfUckelmann,alvarez2016fixed`. A normalized update with the
same fixed point that converges globally under the proposition's assumptions is
{cite:p}`alvarez2016fixed,bhatia2018bures`

```{math}
X_{\ell+1}
=
X_\ell^{-1/2}\Psi_{\lambda}(X_\ell)^2X_\ell^{-1/2}.
```
:::


Figure {ref}`fig:barycenters-gaussian-covariances` illustrates the nonlinear covariance interpolation characterized above; increasing anisotropy makes the simultaneous rotation and rescaling of the Bures--Wasserstein barycenter especially visible.

(fig:barycenters-gaussian-covariances)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("barycenters-gaussian-covariances")
```

*Bures--Wasserstein barycenters of centered Gaussian covariance matrices.
Each panel shows a $5\times5$ grid of barycenter ellipses for four corner
covariances, without separate input panels: the corner ellipses are the four
input covariances themselves. The right grid uses more anisotropic inputs,
making the nonlinear rotation and scaling of covariance barycenters more
visible.*
:::

The interactive Gaussian demo compares the Bures covariance barycenter with a plain
Euclidean covariance average under the same weights. The difference is most
visible for rotated, anisotropic covariances: the Euclidean average blends
matrix entries, whereas the Bures barycenter follows the geometry induced by
quadratic Gaussian transport.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the corner-covariance and interpolation controls to see how Gaussian barycenter ellipses interpolate covariance geometry.
:::

<iframe class="ot4ml-live-frame" title="Gaussian barycenter controls" src="../live/ot-problems-gaussian-barycenter.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

### Sliced and Radon Barycenters

Slicing gives a scalable surrogate for high-dimensional barycenters by applying
the one-dimensional quantile formula in every projection direction. For
measures on $\RR^d$, one replaces $\Wass_2$ by the sliced distance $\SW_2$
introduced in Definition {ref}`def-sliced-wasserstein` and interpreted through
the Radon transform in Section {ref}`sec-sliced-wasserstein`:

```{math}
\min_{\alpha\in\Pp_2(\RR^d)}
\sum_s \lambda_s \SW_2^2(\alpha,\beta_s).
```

The constraint that all projected measures come from the same $\alpha$ is the
nontrivial part. A cheaper Radon-domain approximation drops this consistency
constraint and minimizes directly over one-dimensional projected laws
$(\gamma_\theta)_\theta$:

```{math}
\min_{(\gamma_\theta)}
\int_{\Sphere^{d-1}}
\sum_s \lambda_s
\Wass_2^2(\gamma_\theta,(P_\theta)_\sharp\beta_s)
\d\sigma(\theta).
```

For each $\theta$, this is a one-dimensional barycenter, hence its quantile is
the weighted average of the projected quantiles. For two inputs $\beta_0$ and
$\beta_1$, define

```{math}
:label: eq-radon-barycenter-quantile-field
Q_i(\theta,r)
=
F^{-1}_{(P_\theta)_\sharp\beta_i}(r),
\qquad
Q_t(\theta,r)
=
(1-t)Q_0(\theta,r)+tQ_1(\theta,r),
\qquad
\gamma_{t,\theta}
=
\bigl(Q_t(\theta,\cdot)\bigr)_\sharp\mathrm{Leb}_{[0,1]}.
```

Thus $Q_t$ is the directionwise quantile field, and when
$\gamma_{t,\theta}$ has a density we denote it by $h_t(\theta,\cdot)$. The
relaxed value is a lower bound on the sliced-barycenter value. If the minimizing family is
Radon-consistent, meaning that
$\gamma_\theta=(P_\theta)_\sharp\bar\alpha$ for a common probability measure
$\bar\alpha$ and almost every $\theta$, then $\bar\alpha$ is an exact sliced
barycenter. In general, independently computed one-dimensional barycenters do
not satisfy the range conditions of the Radon transform. One therefore
reconstructs a density in a least-squares sense, usually through a regularized
Radon pseudoinverse.

Let $h(\theta,t)$ denote a density of $\gamma_\theta$. We use the
one-dimensional Fourier transform in $t$ given by

```{math}
:label: eq-radon-sinogram-fourier
\widehat h(\theta,\omega)
=
\int_{\RR}e^{-\imath\omega t}h(\theta,t)\d t,
\qquad
h(\theta,t)
=
\frac1{2\pi}\int_{\RR}e^{\imath\omega t}\widehat h(\theta,\omega)\d\omega,
```

whenever Fourier inversion is valid.

(prop-radon-pseudoinverse)=
:::{admonition} Proposition: Radon Least-Squares Pseudoinverse
:class: important
Let $d\geq2$, let $\sigma$ be the uniform probability measure on
$\Sphere^{d-1}$, and let $R$ be the density Radon transform introduced in the
{ref}`rem-sliced-radon-viewpoint` paragraph. Write

```{math}
\mathcal D(R)
=
\left\{\rho\in L^2(\RR^d):
R\rho\in L^2(\Sphere^{d-1}\times\RR,\d\sigma\,\d t)\right\}.
```

Let $h\in L^2(\Sphere^{d-1}\times\RR,\d\sigma\,\d t)$ and assume that the
Fourier expressions below define an element of $\mathcal D(R)$. Then the unique
solution of

```{math}
:label: eq-radon-least-squares
\min_{\rho\in\mathcal D(R)}
\int_{\Sphere^{d-1}}\int_{\RR}
\abs{R\rho(\theta,t)-h(\theta,t)}^2
\d t\,\d\sigma(\theta)
```

is the density $\rho^\dagger=R^\dagger h$, where

```{math}
:label: eq-radon-pseudoinverse
R^\dagger h(x)
=
\frac{\abs{\Sphere^{d-1}}}{2(2\pi)^d}
\int_{\Sphere^{d-1}}\int_{\RR}
e^{\imath\omega\dotp{\theta}{x}}
|\omega|^{d-1}\widehat h(\theta,\omega)
\d\omega\,\d\sigma(\theta).
```

Thus $R^\dagger h$ is the density of the pseudoinverse reconstruction, which is
a priori a signed measure. If $h=R\rho$ is Radon-consistent and $\rho$ is
sufficiently regular, then $R^\dagger R\rho=\rho$.
:::

:::{dropdown} Proof
Use the compatible $d$-dimensional Fourier convention

```{math}
\widehat\rho(\xi)=\int_{\RR^d}e^{-\imath\dotp{\xi}{x}}\rho(x)\d x,
\qquad
\rho(x)=\frac1{(2\pi)^d}\int_{\RR^d}
e^{\imath\dotp{\xi}{x}}\widehat\rho(\xi)\d\xi.
```

The Fourier-slice theorem gives
$\widehat{R\rho}(\theta,\omega)=\widehat\rho(\omega\theta)$. Plancherel's
identity therefore turns the least-squares objective, up to the positive factor
$1/(2\pi)$, into

```{math}
\int_{\Sphere^{d-1}}\int_{\RR}
\abs{\widehat\rho(\omega\theta)-\widehat h(\theta,\omega)}^2
\d\omega\,\d\sigma(\theta).
```

Every $\xi\neq0$ has the two signed-polar representations
$(\xi/\norm{\xi},\norm{\xi})$ and $(-\xi/\norm{\xi},-\norm{\xi})$. Pointwise
least squares consequently gives

```{math}
\widehat{\rho^\dagger}(\xi)
=
\frac12\left[
\widehat h\left(\frac\xi{\norm{\xi}},\norm{\xi}\right)
+
\widehat h\left(-\frac\xi{\norm{\xi}},-\norm{\xi}\right)
\right].
```

Inverse $d$-dimensional Fourier transformation and signed polar coordinates
give {eq}`eq-radon-pseudoinverse`; the factor
$\abs{\Sphere^{d-1}}/2$ accounts for the normalization of $\sigma$ and the two
signed representations. If $h=R\rho$, the Fourier-slice theorem makes both
terms in the last display equal to $\widehat\rho(\xi)$, proving exact recovery.
:::

Formula {eq}`eq-radon-pseudoinverse` is the filtered back-projection
representation of the Radon pseudoinverse used in tomography
{cite:p}`HermanTomography`; $|\omega|^{d-1}$ is its ramp multiplier. Since this
multiplier amplifies high frequencies, one typically chooses a bandwidth
$\Omega>0$ and an even low-pass window $\chi$ with $\chi(0)=1$, and replaces
the ramp by

```{math}
:label: eq-radon-windowed-ramp
m_\Omega(\omega)
=
|\omega|^{d-1}\chi(\omega/\Omega),
\qquad
R_\Omega^\dagger h(x)
=
\frac{\abs{\Sphere^{d-1}}}{2(2\pi)^d}
\int_{\Sphere^{d-1}}\int_{\RR}
e^{\imath\omega\dotp{\theta}{x}}
m_\Omega(\omega)\widehat h(\theta,\omega)
\d\omega\,\d\sigma(\theta).
```

The numerical reconstruction below uses the super-Gaussian window
$\chi(s)=e^{-|s|^4}$. Choose $\eta_t\geq0$ so that the positive part below has
nonzero mass, and define the nonnegative, unit-mass reconstruction

```{math}
:label: eq-radon-display-reconstruction
A_t(x)
=
\frac{\bigl((R_\Omega^\dagger h_t)(x)-\eta_t\bigr)_+}
{\displaystyle\int_{\RR^d}
\bigl((R_\Omega^\dagger h_t)(z)-\eta_t\bigr)_+\d z}.
```

For the endpoints, set $A_i=\rho_i$ when $\beta_i=\rho_i\d x$, $i\in\{0,1\}$.
In the figure, the small threshold $\eta_t$ only suppresses finite-angle
inversion ghosts. The resulting
regularized density is generally only a least-squares approximation to the
independently averaged slices. This fast construction was introduced for
sliced and Radon Wasserstein barycenters in
{cite:p}`2013-Bonneel-barycenter`, but it is not the exact constrained sliced
barycenter. With all directions, the Radon transform is injective by the
Cramér--Wold theorem {cite:p}`CramerWold1936`; inconsistency comes from failure
of Radon range conditions such as antipodal symmetry and moment consistency; with
finitely many directions, the sampled Radon operator is also non-injective.

Figure {ref}`fig:sliced-radon-barycenter` follows the resulting density, projected-density and quantile fields through a cat-to-heart interpolation.

(fig:sliced-radon-barycenter)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sliced-radon-barycenter")
```

*Radon-domain sliced barycentric interpolation between the cat and heart
densities. The columns correspond to $t=0,0.2,\ldots,1$. The first row shows
the endpoint densities and the intermediate reconstructions $A_t$ defined in
{eq}`eq-radon-display-reconstruction` from the windowed pseudoinverse
{eq}`eq-radon-windowed-ramp`. The second row shows the
projected-density fields $h_t$ (labeled $R_t$ in the figure), obtained by
converting the directionwise quantile barycenters back into one-dimensional
densities. The third row shows the quantile fields $Q_t$ defined in
{eq}`eq-radon-barycenter-quantile-field`.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Move the interpolation time and projection angle to compare image-space densities, Radon profiles, and quantile interpolation in the sliced barycenter construction.
:::

<iframe class="ot4ml-live-frame" title="Interactive sliced/Radon barycenter panel" src="../live/sliced-radon-barycenter.html" loading="lazy" style="width:100%;height:640px;border:0;display:block;"></iframe>

### Sinkhorn for Barycenters

A key difference with the regularized two-marginal OT problem is that there is
no canonical reference measure $\alpha\otimes\beta$, because the barycenter
$\alpha$ is unknown. To reduce complexity, one usually fixes a candidate
support for the barycenter and solves the discrete problem
{eq}`eq-wass-discr`; this introduces a discretization error but keeps the
number of unknowns manageable.

One can then use the entropy-only convention of {eq}`eq-regularized-discrete-web`
and approximate {eq}`eq-wass-discr` by

```{math}
:label: eq-entropic-bary
\min_{a\in\simplex_n}
\sum_{s=1}^S
\lambda_s\mathcal L_{\C_s}^{\epsilon}(a,b_s)
```

for some $\epsilon>0$. This is a smooth convex minimization problem, which can
be tackled using gradient descent {cite:p}`CuturiBarycenter`. An alternative
is to use a descent method, typically quasi-Newton, on the semi-dual
{cite:p}`2016-Cuturi-siims`; this is useful when adding extra regularization
on the barycenter, for instance to impose smoothness.

A simple but effective approach developed in {cite:p}`2015-benamou-cisc`
observes that {eq}`eq-entropic-bary` has the same minimizers as the weighted KL
projection problem

```{math}
:label: eq-bary-entropy-couplings
\min_{(\P_s)_s}
\epsilon\sum_s\lambda_s
\operatorname{KL}(\P_s\mid K_s)
```

subject to

```{math}
\P_s^\top\mathbf 1_n=b_s
\quad\text{for all }s,
\qquad
\P_1\mathbf 1_{n_1}
=
\cdots
=
\P_S\mathbf 1_{n_S}.
```

Here $K_s\eqdef e^{-\C_s/\epsilon}$. The barycenter $a$ is implicitly encoded
in the common row marginal

```{math}
a=\P_1\mathbf 1_{n_1}=\cdots=\P_S\mathbf 1_{n_S}.
```

The two objectives differ only by constants depending on $(\C_s,\epsilon)_s$,
not on the couplings or barycenter. Assume below that every $\C_s$ is finite and
every $b_s$ is positive; zero-weight target atoms can be deleted before the
iteration. The optimal couplings then have scaling form

```{math}
:label: eq-bary-opt
\P_s=\diag(u_s)K_s\diag(v_s),
```

and the generalized Sinkhorn iterations are

```{math}
v_s\leftarrow\frac{b_s}{K_s^\top u_s},
\qquad
a\leftarrow\prod_s(K_s v_s)^{\lambda_s},
\qquad
u_s\leftarrow\frac{a}{K_s v_s}.
```

The geometric mean enforces the fact that all couplings share the same
barycenter marginal.

The scaling cycle has an exact dual-optimization interpretation; it is not
merely a sequence of marginal normalizations. Write
$u_s=e^{f_s/\epsilon}$ and $v_s=e^{g_s/\epsilon}$, with all operations
understood componentwise. The proposition below shows that these potentials
maximize the concave dual {eq}`eq-dual-bary-entropy`. With $(f_s)_s$ fixed,
the objective separates over $s$, and its exact maximizer in each $g_s$ is

```{math}
g_s^+
=
\epsilon\log\!\left(
\frac{b_s}{K_s^\top e^{f_s/\epsilon}}
\right),
```

which is precisely the $v_s$-update. Conversely, with $(g_s^+)_s$ fixed, exact
maximization over the coupled block $(f_s)_s$ under
$\sum_s\lambda_s f_s=0$ gives

```{math}
q_s
\eqdef
K_s e^{g_s^+/\epsilon},
\qquad
a^+
=
\prod_s q_s^{\lambda_s},
\qquad
f_s^+
=
\epsilon\log\!\left(\frac{a^+}{q_s}\right).
```

Thus a complete generalized Sinkhorn cycle is exact two-block coordinate
ascent on the dual, or equivalently alternating minimization of its negative.
Indeed, the constraint follows from
$\log a^+=\sum_s\lambda_s\log q_s$, while the first-order conditions require
$e^{f_s^+/\epsilon}q_s=a^+$ for every $s$. In the primal formulation
{eq}`eq-bary-entropy-couplings`, the same cycle alternates weighted KL
projections onto the target-column constraints and the common-row-marginal
constraint {cite:p}`2015-benamou-cisc`.

(prop-dual-entropic-barycenters)=
:::{admonition} Proposition: Dual of Entropic Barycenters
:class: important
Under the preceding positivity assumptions, the optimal scalings in
{eq}`eq-bary-opt` can be written as
$(u_s,v_s)=(e^{f_s/\epsilon},e^{g_s/\epsilon})$, where
$(f_s,g_s)_s$ solve

```{math}
:label: eq-dual-bary-entropy
\max_{(f_s,g_s)_s}
\sum_s\lambda_s
\left(
\dotp{g_s}{b_s}
-
\epsilon\dotp{K_s e^{g_s/\epsilon}}{e^{f_s/\epsilon}}
+
\epsilon\sum_{i,j}(K_s)_{i,j}
\right)
\quad
\text{subject to}
\quad
\sum_s\lambda_s f_s=0.
```
:::

:::{dropdown} Proof
Introduce Lagrange multipliers in {eq}`eq-bary-entropy-couplings`:

```{math}
\min_{(\P_s)_s,a}
\max_{(f_s,g_s)_s}
\sum_s\lambda_s
\left(
\epsilon\operatorname{KL}(\P_s\mid K_s)
+
\dotp{a-\P_s\mathbf 1_{n_s}}{f_s}
+
\dotp{b_s-\P_s^\top\mathbf 1_n}{g_s}
\right).
```

The explicit constraint $a\in\Sigma_n$ may be dropped here: nonnegativity of
the couplings, together with $\P_s\mathbf 1_{n_s}=a$ and
$\P_s^\top\mathbf 1_n=b_s$, already forces $a\in\Sigma_n$. We may therefore
minimize the Lagrangian over $a\in\mathbb R^n$. Strong duality allows one to
exchange the minimum and maximum. Finiteness of the minimum with respect to
$a$ gives the vector constraint $\sum_s\lambda_s f_s=0$, while minimizing with
respect to $\P_s$ gives the Legendre transform of
$\operatorname{KL}(\cdot\mid K_s)$:

```{math}
\max_{(f_s,g_s)_s}
\sum_s\lambda_s
\left[
\dotp{g_s}{b_s}
-
\epsilon
\operatorname{KL}^*
\left(\frac{f_s\oplus g_s}{\epsilon}\middle|K_s\right)
\right],
\qquad
\sum_s\lambda_s f_s=0.
```

The separable conjugate is

```{math}
\operatorname{KL}^*(U\mid K)
=
\sum_{i,j}K_{i,j}(e^{U_{i,j}}-1),
```

because for $k>0$,

```{math}
\sup_{r\geq0}
ur-\big(r\log(r/k)-r+k\big)
=
k(e^u-1).
```

Substituting this conjugate gives the displayed dual, including its additive
constant. Coordinate maximization in $g_s$ gives the $v_s$ update; block
maximization in all $(f_s)_s$ under $\sum_s\lambda_s f_s=0$ gives the
weighted geometric mean and then the $u_s$ update.
:::

Classical applications include two-dimensional image interpolation,
three-dimensional shape interpolation, and barycenters on surfaces where the
ground cost is the square of the geodesic distance {cite:p}`2015-solomon-siggraph`.


(alg-entropic-barycenter-sinkhorn)=
:::{admonition} Algorithm: Entropic barycenter Sinkhorn
:class: ot4ml-algorithm

**Input:** Finite costs $\C_s$, positive target histograms $\b_s$,
barycenter weights $\lambda\in\operatorname{int}(\simplex_S)$,
regularization $\epsilon>0$, tolerance $\mathrm{tol}$.

**Output:** Barycenter weights $\a$ and couplings $\P_s$.

**Initialize:** Set $\K_s=e^{-\C_s/\epsilon}$, $\uD_s^{(0)}=\ones_n$ for all $s$, $r_0=+\infty$, and $k=0$.

**While** $r_k>\mathrm{tol}$ **do**:

>
> **Set** $k\leftarrow k+1$.
>
> **For** each marginal $s$ **do**

>> $\vD_s^{(k)} = \frac{\b_s}{\transp{\K_s}\uD_s^{(k-1)}}.$

> **Compute** barycenter marginal:
> $\a^{(k)} = \prod_s \bigl(\K_s\vD_s^{(k)}\bigr)^{\lambda_s}.$
>
> **For** each marginal $s$ **do**

>> $\uD_s^{(k)} = \frac{\a^{(k)}}{\K_s\vD_s^{(k)}}.$

>
> **Set** $\P_s^{(k)}=\diag(\uD_s^{(k)})\K_s\diag(\vD_s^{(k)})$ for all $s$.
>
> **Set** $r_k=\max_s \max\{\norm{\P_s^{(k)}\ones-\a^{(k)}}_1,\norm{(\P_s^{(k)})^\top\ones-\b_s}_1\}$.

**Return** $\a^{(k)}$ and $\P_s^{(k)}$.
:::


### Wasserstein-Over-Wasserstein and Barycenters

The barycenter formula does not require a finite list of inputs. The
Wasserstein-over-Wasserstein viewpoint of Section
{ref}`sec-wasserstein-over-wasserstein` allows one to replace the discrete
family $(\beta_s,\lambda_s)_s$ by a law
$\mathfrak A\in\mathcal P(\mathcal P(\Omega))$ over probability measures.
Such *population Wasserstein barycenters* were studied for random probability
measures by Bigot and Klein, in general geodesic settings by Le Gouic and
Loubes, and on Riemannian manifolds by Kim and Pass
{cite:p}`bigot2012characterization,leGouic2016existence,KimPass2017WassersteinBarycenters`.
Assume, for instance, that $c$ is lower semicontinuous and that there exists at
least one $\beta_0\in\mathcal P(\Omega)$ with

```{math}
\int_{\mathcal P(\Omega)}
\mathcal L_c(\beta_0,\alpha)\,\mathrm d\mathfrak A(\alpha)<+\infty,
```

together with the usual compactness or coercivity hypotheses ensuring existence
of minimizers. For instance, these assumptions are automatic when $\Omega$ is
compact and $c$ is continuous. The barycenter correspondence is then

```{math}
\mathcal B_c(\mathfrak A)
\eqdef
\operatorname*{Argmin}_{\beta\in\mathcal P(\Omega)}
\int_{\mathcal P(\Omega)}
\mathcal L_c(\beta,\alpha)\,\mathrm d\mathfrak A(\alpha).
```

When this set is a singleton, we denote its element by

```{math}
\widetilde\alpha_{\mathfrak A}
\eqdef
\operatorname*{argmin}_{\beta\in\mathcal P(\Omega)}
\int_{\mathcal P(\Omega)}
\mathcal L_c(\beta,\alpha)\,\mathrm d\mathfrak A(\alpha),
```

which defines a nonlinear flattening map
$\mathfrak A\mapsto\widetilde\alpha_{\mathfrak A}$ from laws over measures
back to measures on $\Omega$. When
$\mathfrak A=\sum_s\lambda_s\delta_{\beta_s}$, this is exactly the finite
barycenter problem above. This map should be contrasted with the linear
collapsed, or barycentric, mixture $\bar\alpha_{\mathfrak A}$ of Definition
{ref}`def-collapsed-barycentric-mixture`, which simply averages the input
measures themselves. The two operations agree in degenerate linear situations,
but in general $\widetilde\alpha_{\mathfrak A}$ is a geometric average in
transport space, whereas $\bar\alpha_{\mathfrak A}$ is an ordinary mixture in
the ambient linear space of measures.

The next result records the corresponding law of large numbers. It is useful
when a dataset is itself made of probability measures, for instance populations
of histograms, posterior distributions or shapes. We state it in the compact
setting, where no moment or tightness side conditions are needed; non-compact
extensions require the usual integrability assumptions. Consistency of
Wasserstein barycenters and related statistical constructions is developed in
{cite:p}`boissard2015distribution,leGouic2016existence,zemel2017fr`; streaming
and large-scale uses of many input measures appear for instance in
{cite:p}`staib2017parallel,srivastava2015wasp,srivastava2018scalable`.

(prop-wow-barycenter-lln)=
:::{admonition} Proposition: Law of Large Numbers for Barycenters Over Measures
:class: important
Let $\Omega$ be a compact metric space, let
$c:\Omega\times\Omega\to\RR$ be continuous, and let
$\mathfrak A\in\mathcal P(\mathcal P(\Omega))$. Let
$\alpha_1,\alpha_2,\ldots$ be independent random probability measures with
common law $\mathfrak A$, and set

```{math}
\widehat{\mathfrak A}_p
\eqdef
\frac1p\sum_{i=1}^p\delta_{\alpha_i}
\in\mathcal P(\mathcal P(\Omega)).
```

Then, almost surely,

```{math}
:label: eq-wow-empirical-law-lln
\widehat{\mathfrak A}_p \rightharpoonup \mathfrak A
\quad\text{in }\mathcal P(\mathcal P(\Omega)).
```

```{math}
:label: eq-wow-collapsed-mixture-lln
\bar\alpha_{\widehat{\mathfrak A}_p}
\rightharpoonup
\bar\alpha_{\mathfrak A}
\quad\text{in }\mathcal P(\Omega).
```

Moreover, if
$\mathcal B_c(\mathfrak A)=\{\widetilde\alpha_{\mathfrak A}\}$ is a singleton
and if
$\widetilde\alpha_{\widehat{\mathfrak A}_p}\in\mathcal B_c(\widehat{\mathfrak A}_p)$
is any empirical barycenter, then, almost surely,

```{math}
:label: eq-wow-population-barycenter-lln
\widetilde\alpha_{\widehat{\mathfrak A}_p}
\rightharpoonup
\widetilde\alpha_{\mathfrak A}
\quad\text{in }\mathcal P(\Omega).
```
:::

:::{dropdown} Proof
Set $K=\mathcal P(\Omega)$. Since $\Omega$ is compact metric, $K$ is compact
metric for weak convergence, and so is $\mathcal P(K)$. The space $C(K)$ is
separable for the uniform norm. Applying the scalar strong law to a countable
dense family of test functions and then using uniform approximation gives,
almost surely, for every $\Phi\in C(K)$,

```{math}
\int \Phi(\alpha)\,\mathrm d\widehat{\mathfrak A}_p(\alpha)
=
\frac1p\sum_{i=1}^p\Phi(\alpha_i)
\longrightarrow
\int \Phi(\alpha)\,\mathrm d\mathfrak A(\alpha)
```

This is exactly {eq}`eq-wow-empirical-law-lln`.

For the collapsed mixtures, take $f\in C(\Omega)$ and define
$\Phi_f(\alpha)=\int_\Omega f\,\mathrm d\alpha$. This function is continuous on
$\mathcal P(\Omega)$. Hence

```{math}
\int_\Omega f\,\mathrm d\bar\alpha_{\widehat{\mathfrak A}_p}
=
\int_{\mathcal P(\Omega)}
\Phi_f(\alpha)\,\mathrm d\widehat{\mathfrak A}_p(\alpha)
\longrightarrow
\int_{\mathcal P(\Omega)}
\Phi_f(\alpha)\,\mathrm d\mathfrak A(\alpha)
=
\int_\Omega f\,\mathrm d\bar\alpha_{\mathfrak A},
```

which proves {eq}`eq-wow-collapsed-mixture-lln`.

It remains to prove the nonlinear barycenter consistency. The map
$(\beta,\alpha)\mapsto\mathcal L_c(\beta,\alpha)$ is continuous on $K^2$.
Therefore the map $\beta\mapsto h_\beta$, where
$h_\beta(\alpha)=\mathcal L_c(\beta,\alpha)$, is continuous from the compact
space $K$ to $C(K)$. Its image

```{math}
\mathcal H
\eqdef
\{h_\beta:\beta\in K\}
```

is compact in $C(K)$. The convergence of $\widehat{\mathfrak A}_p$ to
$\mathfrak A$ is uniform over $\mathcal H$: given $\eta>0$, cover
$\mathcal H$ by finitely many $\eta$-balls in $\|\cdot\|_\infty$, use weak
convergence for the centers, and bound the error on the balls by the total
variation of $\widehat{\mathfrak A}_p-\mathfrak A$. Hence the empirical
objectives

```{math}
F_p(\beta)\eqdef
\int\mathcal L_c(\beta,\alpha)\,
\mathrm d\widehat{\mathfrak A}_p(\alpha)
```

converge uniformly on $K$ to

```{math}
F(\beta)\eqdef
\int\mathcal L_c(\beta,\alpha)\,
\mathrm d\mathfrak A(\alpha).
```

Let $\beta_p\in\mathcal B_c(\widehat{\mathfrak A}_p)$. Compactness gives a
subsequence $\beta_{p_k}\rightharpoonup\beta$. Uniform convergence, continuity
of $F$, and optimality of $\beta_{p_k}$ give, for any $\gamma\in K$,

```{math}
F(\beta)
=
\lim_k F_{p_k}(\beta_{p_k})
\leq
\lim_k F_{p_k}(\gamma)
=
F(\gamma),
```

so $\beta\in\mathcal B_c(\mathfrak A)$. If this set is the singleton
$\{\widetilde\alpha_{\mathfrak A}\}$, every converging subsequence has the same
limit, and therefore the whole sequence
$\widetilde\alpha_{\widehat{\mathfrak A}_p}$ converges to
$\widetilde\alpha_{\mathfrak A}$, proving
{eq}`eq-wow-population-barycenter-lln`.
:::

Thus, {eq}`eq-wow-empirical-law-lln` is the classical law of large numbers on
Wasserstein space, and {eq}`eq-wow-collapsed-mixture-lln` is its linear image
under the collapse map. By contrast,
{eq}`eq-wow-population-barycenter-lln` is nonlinear: it recomputes a
Wasserstein barycenter from the empirical law over measures. The number $p$ of
input measures should not be confused with the number $n$ of samples used to
approximate each input measure, studied in Section
{ref}`sec-sample-complexity`. In applications one often observes $p$ empirical
measures, each made of roughly $n$ atoms, hence about $np$ points in total.
Balancing the error due to finitely many input laws against the error due to
finitely sampled input laws is a separate statistical and computational
tradeoff.

### Toward Central Limit Theorems on Wasserstein Space

The same hierarchy suggests a central-limit refinement of the preceding law of
large numbers, but the nonlinear geometry makes this substantially more
delicate. For the linear collapse
$\bar\alpha_{\widehat{\mathfrak A}_p}$, testing against a fixed
$f\in C(\Omega)$ reduces the question to the classical scalar central limit
theorem for the random variable $\alpha\mapsto\int f\,\mathrm d\alpha$. For the
nonlinear barycenter $\widetilde\alpha_{\widehat{\mathfrak A}_p}$, however,
there is no canonical vector difference
$\widetilde\alpha_{\widehat{\mathfrak A}_p}-\widetilde\alpha_{\mathfrak A}$
inside $\mathcal P(\Omega)$. One has to choose a local linearization. When the
population barycenter is sufficiently regular so that the optimal map $T_p$
from $\widetilde\alpha_{\mathfrak A}$ to
$\widetilde\alpha_{\widehat{\mathfrak A}_p}$ exists, this amounts to asking
whether $\sqrt p\,(T_p-\mathrm{Id})$ converges in a Hilbert space such as
$L^2(\widetilde\alpha_{\mathfrak A})$. In nonsmooth settings one must instead
work with optimal-plan or logarithmic-map coordinates. Even after such a
linearization, an infinite-dimensional CLT requires tightness of the rescaled
tangent variables and a genuine Radon Gaussian random element; in a Hilbert
space, the associated covariance must be trace class. A cylindrical Gaussian
limit alone is therefore not a probability law on the tangent space. This
obstruction explains why Wasserstein-space CLTs are more rigid than the weak
laws above.

There are nevertheless important settings where such results can be proved. In
one dimension, the quantile representation linearizes $\mathcal W_2$, so
barycenter fluctuations can be studied through empirical averages of quantile
functions. Another finite-dimensional case is the family of non-degenerate
Gaussian measures in fixed dimension, where $\mathcal W_2$ reduces to the Bures
geometry of means and covariance matrices. Agueh and Carlier
{cite:p}`agueh2017vers` formulate this Wasserstein-barycenter CLT precisely in
tangent coordinates and prove it in a few special cases, including the
one-dimensional non-atomic setting and finite laws supported on non-degenerate
Gaussian measures. Entropic barycenters give a smoother variant for which
central-limit theorems for empirical barycenters are also available
{cite:p}`CarlierEichingerKroshnin2020EntropicBarycenterCLT`. These results
should be read as nonlinear analogues of the statistical limits discussed in
Chapter {ref}`sec-statistical-ot`, not as a generic Hilbert-space CLT valid on
all of $\mathcal P(\Omega)$.

(ex-fair-score-repair)=
:::{admonition} Example: Application to fair score repair
:class: ot4ml-example

Let $S$ be a protected group and $Y=f(X)$ a score. A basic demographic-parity constraint asks that the conditional laws $\al_s=\mathcal L(Y\mid S=s)$ be independent of $s$. OT post-processing chooses a common fair law, often a Wasserstein barycenter

```{math}
\bar\al\in\uargmin{\zeta}\sum_s p_s\Wass_2^2(\al_s,\zeta),
```

and transports each group toward it. In one dimension this uses monotone rearrangements; in the quadratic absolutely continuous case it uses Brenier maps $(T_s)_\sharp\al_s=\bar\al$; otherwise one can use the barycentric projection of an optimal plan. The repaired score is $\widetilde Y=T_S(Y)$ when a map is used. The barycenter is the compromise distribution, while the OT maps give minimal geometric changes to the original scores {cite:p}`DelBarrioGamboaGordalizaLoubes2018FairOT,ChzhenDenisHebiriOnetoPontil2020FairBarycenters,BuylDeBie2022FairClassifiers,HuRatzCharpentier2023FairBarycenters`. Thus the barycenter is not only an averaging tool: it can define a target distribution used to repair several observed laws simultaneously.
:::


(sec-multimarginal-ot)=
## Multimarginal OT

Multi-marginal OT couples more than two measures at once. It is the natural
language for barycenters, matching with teams and several-body costs, but its
tensor dimension is the main computational obstacle.

### Definition and Basic Structure

The multi-marginal formulation replaces a coupling between two measures by a
joint distribution with several prescribed marginals. Given measures
$(\alpha_s)_{s=1}^S$ on spaces $(\Xx_s)_{s=1}^S$ and a lower-semicontinuous
cost $c:\Xx_1\times\cdots\times\Xx_S\to\RR\cup\{+\infty\}$ bounded
from below, the problem reads

```{math}
\inf_{\pi\in\Couplings(\alpha_1,\ldots,\alpha_S)}
\int_{\Xx_1\times\cdots\times\Xx_S}
c(x_1,\ldots,x_S)\d\pi(x_1,\ldots,x_S),
```

where $\Couplings(\alpha_1,\ldots,\alpha_S)$ is the set of probability
measures whose $s$-th marginal is $\alpha_s$. This is still a linear program
in the discrete setting, but its ambient tensor has size $\prod_s n_s$.

### Monge Structure and Splitting-Set Twist

As in the two-marginal case, one would like to know when the optimal joint law
is induced by deterministic maps from one marginal. The relevant
non-degeneracy assumption is stronger than pairwise twist, because the other
$S-1$ variables have to be recovered simultaneously. The condition below is the
standard multi-marginal analogue used in the Monge-structure theory of
Gangbo--Swiech and Pass {cite:p}`GangboSciech,Pass2,PassMultiMarginalStructure,PassMultiReview`.

(def-twist-splitting-sets)=
:::{admonition} Definition: Twist on Splitting Sets
:class: definition
Fix $x_1\in\Xx_1$. A set $M\subset\Xx_2\times\cdots\times\Xx_S$ is a
$c$-splitting set at $x_1$ if there exist functions
$u_s:\Xx_s\to\RR\cup\{-\infty\}$, for $s=2,\ldots,S$, such that

```{math}
\sum_{s=2}^S u_s(x_s)\leq c(x_1,x_2,\ldots,x_S)
```

for all $(x_2,\ldots,x_S)$, with equality on $M$. Assume $c$ is differentiable
in $x_1$. The cost is twisted on splitting sets if, for every $x_1$ and every
$c$-splitting set $M$ at $x_1$, the map

```{math}
(x_2,\ldots,x_S)
\longmapsto
\nabla_{x_1}c(x_1,x_2,\ldots,x_S)
```

is injective on $M$.
:::

(prop-multimarginal-monge-structure)=
:::{admonition} Proposition: Multi-Marginal Monge Structure
:class: important
Assume that $\Xx_s\subset\RR^d$, that $c$ is continuous and differentiable
with respect to $x_1$, and that $c$ is twisted on splitting sets. Suppose that
Kantorovich dual maximizers $(\varphi_s)_{s=1}^S$ exist, that $\alpha_1$ is
absolutely continuous, and that $\varphi_1$ is differentiable
$\alpha_1$-a.e. Then every optimal plan $\pi^\star\in\Couplings(\alpha_1,\ldots,\alpha_S)$ is
concentrated on the graph of maps

```{math}
\pi^\star=(\Id,\T_2,\ldots,\T_S)_\sharp\alpha_1,
\qquad
(\T_s)_\sharp\alpha_1=\alpha_s.
```

In particular, under these hypotheses the optimizer is unique.
:::

:::{dropdown} Proof
Let $(\varphi_s)_{s=1}^S$ be optimal dual potentials. Complementary
slackness gives a Borel contact set $\Gamma$ of full $\pi^\star$-measure on
which $\sum_s\varphi_s(x_s)=c(x_1,\ldots,x_S)$. After disintegrating with
respect to the first marginal, fix a point $x_1$ where $\varphi_1$ is
differentiable and where the conditional plan is concentrated on the fiber

```{math}
M(x_1)
=
\{(x_2,\ldots,x_S):(x_1,x_2,\ldots,x_S)\in\Gamma\}.
```

For this fixed $x_1$, the fiber is a splitting set: indeed, the constant
$\varphi_1(x_1)$ can be absorbed into one of the functions $\varphi_s$,
$s\geq2$. Equivalently, set $u_2=\varphi_2+\varphi_1(x_1)$ and
$u_s=\varphi_s$ for $s\geq3$. Dual feasibility gives
$\sum_{s=2}^S u_s(x_s)\leq c(x_1,x_2,\ldots,x_S)$, with equality on
$M(x_1)$. If $(x_2,\ldots,x_S)\in M(x_1)$, the function

```{math}
z\longmapsto c(z,x_2,\ldots,x_S)-\sum_{s=2}^S\varphi_s(x_s)
```

touches $\varphi_1$ from above at $z=x_1$. Differentiating at this contact
point gives

```{math}
\nabla\varphi_1(x_1)=\nabla_{x_1}c(x_1,x_2,\ldots,x_S).
```

All points in the fiber therefore have the same value of $\nabla_{x_1}c$.
Twist on splitting sets makes the fiber a singleton for $\alpha_1$-a.e.
$x_1$. Disintegrating $\pi^\star$ with respect to its first marginal gives
Dirac conditional measures, hence measurable maps $(\T_2,\ldots,\T_S)$. If
$\pi^1$ and $\pi^2$ are two optimal plans, their average is also optimal. The
conditional measure of this average over $x_1$ is the average of the two Dirac
conditionals, and it must again be a Dirac mass by the preceding argument.
Hence the two Dirac masses coincide for $\alpha_1$-a.e. $x_1$, proving
uniqueness.
:::

:::{admonition} Remark: Recovery of the Two-Marginal Theory
:class: ot4ml-remark
When $S=2$, twist on splitting sets is exactly the usual twist condition of
Definition {ref}`def-twist-condition`. Indeed, for fixed $x$, the whole target
space is a splitting set by taking $u_2(y)=c(x,y)$; hence the condition requires
$y\mapsto\nabla_x c(x,y)$ to be injective. At a dual contact point,

```{math}
\nabla\varphi_1(x)=\nabla_x c(x,y),
```

so this injectivity selects a unique $y=\T(x)$. Provided the Kantorovich
problem admits an optimizer, the proposition therefore makes that optimizer
equal to $(\Id,\T)_\sharp\alpha_1$: the relaxation is tight and $\T$ is an
optimal Monge map. This is precisely the two-marginal mechanism isolated in
Proposition {ref}`prop-twist-prevents-splitting`.

For the quadratic cost $c(x,y)=\norm{x-y}^2$, one has
$\nabla_x c(x,y)=2(x-y)$ and therefore

```{math}
\T(x)=x-\frac12\nabla\varphi_1(x)
=\nabla\left(\frac12\norm{x}^2-\frac12\varphi_1(x)\right).
```

Choosing the usual $c$-concave representative of the quadratic dual potential
makes the potential in parentheses convex; it is differentiable
$\alpha_1$-almost everywhere because $\alpha_1$ is absolutely continuous.
Thus the case $S=2$ recovers the convex-gradient map, uniqueness, and tightness
conclusions of Brenier's theorem {ref}`thm-brenier` and Corollary
{ref}`cor-monge-kantorovich-brenier`. For $S>2$, the splitting-set twist is the
stronger requirement that the same first-order identity recover the entire
tuple $(x_2,\ldots,x_S)$ at once.
:::

### Coulomb Cost and Density-Functional Theory

A second canonical example, besides barycenters, comes from electronic
structure. For $N$ electrons in $\RR^3$, the repulsive Coulomb interaction is
the multi-body cost

```{math}
c_{\mathrm{Coul}}(x_1,\ldots,x_N)
\eqdef
\sum_{1\leq i<j\leq N}\frac{1}{\norm{x_i-x_j}},
```

with the value $+\infty$ on the collision set. Proposition
{ref}`prop-multimarginal-monge-structure` therefore does not apply verbatim:
the Coulomb cost is neither finite nor differentiable on the whole product
space. Any finite-energy plan gives zero mass to exact collisions, so the cost
is smooth at almost every point charged by the plan, but this removes only the
singularity; one must still establish differentiability of the dual potential
and twist on the relevant splitting sets. Away from collisions,

```{math}
\nabla_{x_1}c_{\mathrm{Coul}}(x_1,\ldots,x_N)
=
-\sum_{j=2}^N\frac{x_1-x_j}{\norm{x_1-x_j}^3}.
```

For $N=2$, the map from $x_2$ to this vector is injective, so the ordinary
two-marginal twist argument can be recovered under the required existence,
duality and differentiability hypotheses. For $N\geq3$, however, the displayed
total force does not by itself determine the entire tuple
$(x_2,\ldots,x_N)$; twist on splitting sets, and hence a Monge representation,
is not automatic. The previous proposition thus supplies a mechanism to verify
in special Coulomb models, not a general existence theorem for co-motion maps.

If $\rho$ is an electron density with $\int_{\RR^3}\rho(x)\d x=N$ and
$\al=\rho/N$ is the associated probability density, the
strictly-correlated-electrons relaxation of density-functional theory is the
equal-marginal problem

```{math}
V_{\mathrm{ee}}^{\mathrm{SCE}}[\rho]
\eqdef
\inf_{\pi\in\Couplings(\al,\ldots,\al)}
\int_{(\RR^3)^N}
c_{\mathrm{Coul}}(x_1,\ldots,x_N)
\d\pi(x_1,\ldots,x_N).
```

Since the cost and constraints are permutation invariant, symmetrizing any
admissible plan does not change its value, so one may equivalently minimize
over symmetric plans. This functional gives the smallest possible
electron--electron repulsion compatible with the prescribed one-particle
density; it appears as the strong-interaction limit in density-functional
theory and was connected to optimal transport in
{cite:p}`GorSeiVig,BuDePGor,CotarDFT,DiMarinoGerolinNennaRepulsiveCosts`. The
deterministic ansatz writes a plan through co-motion maps

```{math}
\pi=(\Id,\T_2,\ldots,\T_N)_\sharp\al,
\qquad
(\T_i)_\sharp\al=\al,
```

so that the position of one electron determines the positions of the others.
The following cyclic version is the most common structural form of this ansatz
in the strictly-correlated-electrons literature.

(prop-cyclic-comotion-plans)=
:::{admonition} Proposition: Cyclic Co-Motion Plans
:class: important
Let $\al\in\Pp(\RR^3)$ and let $\T:\RR^3\to\RR^3$ be measurable with
$\T_\sharp\al=\al$ and $\T^N=\Id$ $\al$-a.e. Set $\T^0=\Id$ and

```{math}
\pi_\T=(\T^0,\T^1,\ldots,\T^{N-1})_\sharp\al .
```

Then $\pi_\T\in\Couplings(\al,\ldots,\al)$. If
$R_\sigma(x_1,\ldots,x_N)=(x_{\sigma(1)},\ldots,x_{\sigma(N)})$ for
$\sigma\in\Perm(N)$, then

```{math}
\bar\pi_\T
\eqdef
\frac1{N!}\sum_{\sigma\in\Perm(N)}(R_\sigma)_\sharp\pi_\T
```

is a symmetric admissible plan and

```{math}
\int c_{\mathrm{Coul}}\d\bar\pi_\T
=
\int c_{\mathrm{Coul}}\d\pi_\T
=
\int_{\RR^3}
\sum_{0\leq i<j\leq N-1}
\frac{1}{\norm{\T^i(x)-\T^j(x)}}\d\al(x).
```
:::

:::{dropdown} Proof
Since $\T_\sharp\al=\al$, all iterates $\T^i$ preserve $\al$, so every marginal
of $\pi_\T$ is $\al$. The plan $\bar\pi_\T$ is an average of coordinate
permutations of $\pi_\T$, hence has the same marginals and is invariant under
coordinate permutations. The Coulomb cost is symmetric in its arguments, so its
integral is unchanged by each $R_\sigma$. The last identity follows by
evaluating $c_{\mathrm{Coul}}$ on the graph
$(x,\T(x),\ldots,\T^{N-1}(x))$.
:::

The Monge-structure proposition above explains the general mechanism that can
force graph solutions, while the cyclic co-motion proposition records the
additional equal-marginal symmetry used by co-motion maps. For the Coulomb
cost, however, the singular repulsion and permutation symmetry make the
structure delicate: co-motion maps are optimal in special geometries, but they
are not universally optimal, and counterexamples are known
{cite:p}`ColomboStraCoulombCounterexamples,BindiniDePascaleKausamoDeterministicCoulomb`.
Thus the DFT problem is both a central application and a warning that
multi-marginal OT is richer than a naive deterministic matching problem.

Figure {ref}`fig:multimarginal-coulomb-sinkhorn` shows the same phenomenon in a deliberately small one-dimensional model.

(fig:multimarginal-coulomb-sinkhorn)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("multimarginal-coulomb-sinkhorn", width=760)
```

*Entropic three-marginal Coulomb transport in one dimension. The three
marginals are equal and the pairwise cost is a softened Coulomb repulsion.
Each panel shows the $(X_1,X_2)$ marginal of the tensor Sinkhorn solution:
small regularization pushes mass away from the collision diagonal, while larger
regularization blurs the repulsive structure toward the independent reference.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Adjust the entropic temperature and repulsion strength to see the pairwise marginals of a three-marginal Coulomb plan move away from the diagonals.
:::

<iframe class="ot4ml-live-frame" title="Interactive multimarginal Coulomb panel" src="../live/multimarginal-coulomb-sinkhorn.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

### Multi-Marginal Formulation of Barycenters

Wasserstein barycenters are the central example. For the squared Euclidean
cost, one can introduce a latent barycenter point and eliminate it explicitly,
leading to the multi-marginal cost

```{math}
c_{\mathrm{bar}}(x_1,\ldots,x_S)
=
\min_{x\in\RR^d}
\sum_{s=1}^S\lambda_s\norm{x-x_s}^2.
```

(prop-multimarginal-barycenter)=
:::{admonition} Proposition: Multi-Marginal Formula for Quadratic Barycenters
:class: important
Let $\beta_1,\ldots,\beta_S\in\mathcal P_2(\RR^d)$ and
$\lambda\in\simplex_S$. Define

```{math}
B(x_1,\ldots,x_S)=\sum_{s=1}^S\lambda_s x_s,
\qquad
c_{\mathrm{bar}}(x_1,\ldots,x_S)
=
\min_x
\sum_s\lambda_s\norm{x-x_s}^2.
```

If $\pi^\star$ solves the multi-marginal OT problem with marginals
$(\beta_s)_s$ and cost $c_{\mathrm{bar}}$, then
$\alpha^\star=B_\sharp\pi^\star$ is a Wasserstein barycenter. Conversely,
every barycenter is obtained this way from an optimal multi-marginal plan.
:::

:::{dropdown} Proof
For any candidate barycenter $\alpha$ and couplings
$\pi_s\in\Couplings(\alpha,\beta_s)$, glue the couplings along their common
$\alpha$ marginal to obtain a joint law of $(X,Y_1,\ldots,Y_S)$. Conditioning
on $(Y_s)_s$ and minimizing over $X$ gives

```{math}
\sum_s\lambda_s\mathbb E\norm{X-Y_s}^2
\geq
\mathbb E
\min_x
\sum_s\lambda_s\norm{x-Y_s}^2
=
\mathbb E c_{\mathrm{bar}}(Y_1,\ldots,Y_S).
```

Taking the infimum over the couplings gives that the barycenter value is at
least the multi-marginal value. Conversely, from an optimal multi-marginal
plan $\pi^\star$, set $X=B(Y_1,\ldots,Y_S)$. The couplings between $X$ and
each $Y_s$ are feasible for the barycenter problem and attain exactly the
multi-marginal cost.

If $\alpha^\star$ is any barycenter, choose optimal couplings between
$\alpha^\star$ and each $\beta_s$ and glue them along the common
$\alpha^\star$ marginal. Since the barycenter and multi-marginal values are
equal, the conditional minimization inequality above must be an equality.
Thus $X=B(Y_1,\ldots,Y_S)$ almost surely for the induced optimal
multi-marginal plan.
:::

(cor-discrete-barycenters)=
:::{admonition} Corollary: Sparse Discrete Barycenters
:class: important
Let

```{math}
\beta_s=\sum_{i_s=1}^{n_s}b_{s,i_s}\delta_{x_{s,i_s}},
\qquad s=1,\ldots,S,
```

be discrete input measures. There exists a quadratic Wasserstein barycenter
$\alpha^\star$ supported on weighted averages
$\sum_s\lambda_s x_{s,i_s}$ of one support point from each input and
satisfying

```{math}
\#\operatorname{supp}(\alpha^\star)
\leq
\sum_{s=1}^S n_s-S+1.
```
:::

:::{dropdown} Proof
Write a discrete multi-marginal plan as a nonnegative tensor
$\P=(\P_{i_1,\ldots,i_S})$ and let $\mathcal A_{\mathrm{marg}}$ collect its
$S$ marginals:

```{math}
\bigl(\mathcal A_{\mathrm{marg}}\Pi\bigr)_{s,i_s}
=
\sum_{(i_r)_{r\neq s}}\P_{i_1,\ldots,i_S}.
```

After vectorizing $\Pi$, Proposition
{ref}`prop-lp-rank-sparsity` applies to the multi-marginal linear program.
Its constraint operator has rank

```{math}
\operatorname{rank}(\mathcal A_{\mathrm{marg}})
=
\sum_{s=1}^S n_s-S+1.
```

Indeed, a family $u_s\in\RR^{n_s}$ belongs to the annihilator of its image
precisely when

```{math}
\sum_{s=1}^S u_{s,i_s}=0
\qquad\text{for every }(i_1,\ldots,i_S).
```

Varying one index at a time shows that every $u_s$ is constant, say
$u_s=c_s\mathbf 1_{n_s}$, and the remaining condition is $\sum_s c_s=0$.
The annihilator therefore has dimension $S-1$, proving the rank formula.

Consequently, one may choose an optimal multi-marginal tensor $\P^\star$
with at most $\sum_s n_s-S+1$ positive entries. Proposition
{ref}`prop-multimarginal-barycenter` gives
$\alpha^\star=B_\sharp\P^\star$. Each positive tensor entry produces at most
one atom under $B$, and collisions can only reduce the support size.
:::

This linear support bound, rather than the cardinality of the full product
grid, is the standard sparsity estimate for discrete Wasserstein barycenters
{cite:p}`anderes2016discrete`.

### Entropic Regularization of Multi-Marginal OT

As in the two-marginal case, adding an entropic penalty with respect to the
product measure $\alpha_1\otimes\cdots\otimes\alpha_S$ leads to scaling
algorithms:

```{math}
\inf_{\pi\in\Couplings(\alpha_1,\ldots,\alpha_S)}
\int c\d\pi
+
\epsilon\operatorname{KL}
(\pi\mid\alpha_1\otimes\cdots\otimes\alpha_S).
```

The optimizer has the generalized Gibbs form

```{math}
\d\pi^\star(x_1,\ldots,x_S)
=
\exp\!\left(
\frac{\sum_s f_s(x_s)-c(x_1,\ldots,x_S)}{\epsilon}
\right)
\prod_s\d\alpha_s(x_s),
```

and generalized Sinkhorn iterations alternately update one potential $f_s$ so
that the $s$-th marginal is correct. This formula is direct but, without
additional structure, it is mostly a conceptual baseline. In the discrete case,
even storing the Gibbs tensor or the coupling requires $\prod_s n_s$ entries,
and the unstructured multi-marginal Sinkhorn complexity inherits this
exponential dependence on the number of marginals
{cite:p}`LinHoCuturiJordan2022MOTComplexity`.

### Treewidth and Graphical Structure

The important exception is when the cost factors over a sparse interaction
graph. Let $G=(V,E)$ be a finite undirected graph with
$V=\{1,\ldots,S\}$ and suppose, for simplicity, that

(eq-multimarginal-graph-cost)=
```{math}
c(x_1,\ldots,x_S)
=
\sum_{(r,s)\in E}c_{r,s}(x_r,x_s).
```

The relevant complexity parameter is not merely the number of edges, but the
largest intermediate interaction created when variables are summed out.

(def-treewidth)=
:::{admonition} Definition: Tree Decomposition and Treewidth
:class: definition

A **tree decomposition** of a finite graph $G=(V,E)$ is a tree
$\mathcal T=(Q,F)$ together with bags $B_q\subseteq V$, $q\in Q$, such that

1. $\bigcup_{q\in Q}B_q=V$;
2. for every edge $(r,s)\in E$, some bag contains both $r$ and $s$;
3. for every vertex $s\in V$, the nodes
   $\{q\in Q:s\in B_q\}$ form a connected subtree of $\mathcal T$.

The width of this decomposition is $\max_{q\in Q}|B_q|-1$, and the
**treewidth** $\operatorname{tw}(G)$ is the minimum width over all tree
decompositions.
:::

The last condition is the **running-intersection property**. A tree
decomposition equipped with factors assigned to its bags is also called a
**junction tree**. Equivalently, choose an order in which to eliminate the
vertices of $G$. Just before eliminating a vertex, connect all of its remaining
neighbors, thereby adding *fill-in edges*. The induced width of the order is
the largest number of remaining neighbors encountered. Treewidth is the
minimum induced width over all elimination orders, and the corresponding bags
consist of each eliminated vertex together with those neighbors. This
equivalent viewpoint explains why treewidth controls exact summation.

The same construction applies to higher-order factors $c_A(x_A)$ indexed by
subsets $A\subseteq V$: form the primal interaction graph by connecting every
pair of variables occurring in a common factor, then compute the treewidth of
that graph.

(ex-treewidth-graphs)=
:::{admonition} Example: Treewidth of Familiar Interaction Graphs
:class: example

A tree, including a chain or a star, has treewidth one. For the chain
$1-2-\cdots-S$, the edge bags $B_q=\{q,q+1\}$ form a width-one decomposition.
A cycle $C_S$, $S\geq3$, has treewidth two: fixing vertex $1$, the bags
$\{1,q,q+1\}$ for $q=2,\ldots,S-1$ form a width-two decomposition. The
complete graph $K_S$ has treewidth $S-1$, so it offers no asymptotic time
reduction over enumerating all $S$ indices. The star appearing when a
barycenter variable is retained as a hub also has treewidth one; in that
graphical formulation, the leaf marginals are prescribed while the hub
marginal is induced by the optimizer
{cite:p}`FanHaaslerKarlssonChen2021GraphCostMOT`.
:::

### Junction-Tree Contractions Inside Sinkhorn

The treewidth reduction replaces each full tensor contraction in Sinkhorn by
exact sum-product messages. In the discrete setting, define the edge Gibbs
matrices and current unary factors

```{math}
K^{r,s}_{i_r,i_s}
=
\exp\!\left(-\frac{\C^{r,s}_{i_r,i_s}}{\epsilon}\right),
\qquad
h_s(i_s)
=
(a_s)_{i_s}(u_s)_{i_s}.
```

Under {eq}`eq-multimarginal-graph-cost`, the current scaled coupling is
represented implicitly as

(eq-multimarginal-graph-factorization)=
```{math}
\P_{i_1,\ldots,i_S}
=
\prod_{s\in V}h_s(i_s)
\prod_{(r,s)\in E}K^{r,s}_{i_r,i_s}.
```

When $G$ is a tree, let $N_G(r)$ denote the neighbors of $r$. The directed
sum-product messages satisfy

(eq-multimarginal-tree-message)=
```{math}
m_{r\to s}(i_s)
=
\sum_{i_r=1}^{n_r}
K^{r,s}_{i_r,i_s}h_r(i_r)
\prod_{q\in N_G(r)\setminus\{s\}}
m_{q\to r}(i_r).
```

Cutting the edge $(r,s)$ separates the tree into two components:
$m_{r\to s}(i_s)$ is the total contribution of the component containing $r$,
conditional on the boundary state $i_s$. Conditioning first on $i_r$ gives
the message recursion. A leaf-to-root pass followed by a root-to-leaf pass
computes every directed message and hence every current marginal,

(eq-multimarginal-tree-marginal)=
```{math}
(\widehat a_s)_{i_s}
=
h_s(i_s)
\prod_{r\in N_G(s)}m_{r\to s}(i_s).
```

For the block $s$ currently selected by cyclic scaling, the exact coordinate
update is

```{math}
u_s
\leftarrow
u_s\odot\frac{a_s}{\widehat a_s},
```

with componentwise products and quotients. This changes only the unary factor
$h_s$. Updating all blocks at once would instead define a Jacobi scheme. Thus
the expensive denominator of one
generalized Sinkhorn block update is evaluated by messages rather than by
enumerating all multi-indices.

For a general tree decomposition, choose one host bag for each unary factor,
assign each edge factor in {eq}`eq-multimarginal-graph-factorization` to a bag
containing both endpoints, and denote the product assigned to bag $B_q$ by
$\psi_q(i_{B_q})$. For adjacent bags $q,q'\in Q$, set
$\mathcal S_{q,q'}=B_q\cap B_{q'}$. Junction-tree messages take the form

(eq-multimarginal-junction-message)=
```{math}
M_{q\to q'}(i_{\mathcal S_{q,q'}})
=
\sum_{i_{B_q\setminus\mathcal S_{q,q'}}}
\psi_q(i_{B_q})
\prod_{\ell\in N_{\mathcal T}(q)\setminus\{q'\}}
M_{\ell\to q}(i_{\mathcal S_{\ell,q}}).
```

After a collect-distribute pass, the calibrated bag belief is

(eq-multimarginal-junction-belief)=
```{math}
\mathfrak b_q(i_{B_q})
=
\psi_q(i_{B_q})
\prod_{\ell\in N_{\mathcal T}(q)}
M_{\ell\to q}(i_{\mathcal S_{\ell,q}}).
```

For any $s\in B_q$, summing $\mathfrak b_q$ over $B_q\setminus\{s\}$ gives
$\widehat a_s$; the running-intersection property ensures that every bag
containing $s$ gives the same result.

Redundant adjacent bags may be contracted, so one can assume that the
decomposition is reduced. If its width is $w$, every bag contains at most
$w+1$ variables and every separator contains at most $w$. Consequently, if
$n_s\leq n$, one collect-distribute inference pass for fixed scalings costs

```{math}
O\!\left(|Q|n^{w+1}\right)\quad\text{time},
\qquad
O\!\left(|Q|n^w\right)\quad\text{message memory}.
```

More precisely, the time is bounded by

```{math}
O\!\left(
\sum_{q\in Q}(1+\deg_{\mathcal T}(q))
\prod_{s\in B_q}n_s
\right),
```

and the stored messages occupy

```{math}
O\!\left(
\sum_{(q,q')\in F}
\prod_{s\in\mathcal S_{q,q'}}n_s
\right)
```

beyond the original factors and scaling vectors. The message-memory bound
assumes streamed bag contractions; materializing every dense belief
{eq}`eq-multimarginal-junction-belief` instead requires
$O(|Q|n^{w+1})$ working memory.

These are fixed-scaling inference bounds, not the cost of an entire Sinkhorn
solve. They also yield a sharper block implementation. Assign each constrained
marginal $s$ to a host bag $q(s)$. After updating $u_s$, only the messages along
the unique path from $q(s)$ to the host bag of the next updated marginal must
be refreshed. A path of length $\ell$ costs $O(\ell n^{w+1})$, hence at most
$O(\operatorname{diam}(\mathcal T)n^{w+1})$ per block update. This is the
junction-tree iterative-scaling mechanism analyzed in
{cite:p}`HaaslerSinghZhangKarlssonChen2020PGMMOT,FanHaaslerKarlssonChen2021GraphCostMOT`.
For a tree interaction graph, direct edge messages give
$O(\sum_{(r,s)\in E}n_rn_s)$ for a full pass, or $O(Sn^2)$ with equal support
sizes. A cycle admits $O(Sn^3)$ full junction-tree passes, while the complete
graph still costs $O(n^S)$ in time.

The structured implementation never forms $K$ or $\P$ as full tensors. It
stores the original local factors and separator messages, evaluates bag
products on the fly, and replaces the explicit contraction in
{ref}`alg-multimarginal-sinkhorn` by
{eq}`eq-multimarginal-tree-marginal` or
{eq}`eq-multimarginal-junction-message`, and returns the coupling through its
factors and scalings. Materializing every entry of $\P$ would itself require
$\prod_s n_s$ operations, so the saving applies when only marginals, costs,
samples, or other low-order statistics are needed. For small $\epsilon$, the
same recursions are evaluated in the log domain with log-sum-exp operations.
This connects entropic multi-marginal OT with exact inference in probabilistic
graphical models and Schrodinger bridge computations
{cite:p}`HaaslerRinghChenKarlsson2021TreeMOT,HaaslerSinghZhangKarlssonChen2020PGMMOT,FanHaaslerKarlssonChen2021GraphCostMOT,AltschulerBoixAdsera2022StructuredMOT`.

A representative fluid-mechanics example is the time discretization of
Brenier's generalized incompressible Euler problem: kinetic action couples
neighboring time slices and periodic incompressibility closes the chain into a
cycle, hence a graph of treewidth two. Entropic Bregman/Sinkhorn schemes exploit
this circular structure through low-order contractions
{cite:p}`2015-benamou-cisc,BenamouCarlierNenna2018GeneralizedIncompressible`.

Practical barycenter solvers therefore exploit separability of the cost,
low-rank structure, convolutional kernels, or a fixed barycenter support.

(alg-multimarginal-sinkhorn)=
:::{admonition} Algorithm: Multi-marginal Sinkhorn
:class: ot4ml-algorithm

**Input:** Positive marginals $\a_s\in\simplex_{n_s}$, finite tensor cost
$\C$, regularization $\epsilon>0$, tolerance $\mathrm{tol}$.

**Output:** Multi-marginal entropic coupling tensor $\P$.

**Build**
$K_{i_1,\ldots,i_S} = \exp\!\left(-\frac{\C_{i_1,\ldots,i_S}}{\epsilon}\right) \prod_{s=1}^S(\a_s)_{i_s}.$

**Initialize:** Set $u_s=\ones_{n_s}$ for all $s$ and residual $r=+\infty$.

**While** $r>\mathrm{tol}$ **do**:

>
> **For** $s=1,\ldots,S$ **do**:

>> $(u_s)_i \leftarrow \frac{(\a_s)_i} { \sum_{i_1,\ldots,i_{s-1},i_{s+1},\ldots,i_S} K_{i_1,\ldots,i_{s-1},i,i_{s+1},\ldots,i_S} \prod_{r\neq s}(u_r)_{i_r}}.$

>
> **Set** $\P_{i_1,\ldots,i_S}=K_{i_1,\ldots,i_S}\prod_s (u_s)_{i_s}$.
>
> **Set** $r=\max_s\norm{(\mathrm{proj}_s)_\sharp \P-\a_s}_1$.

**Return** $\P$.
:::


(sec-low-rank-ot)=
## Low-Rank Optimal Transport

Low-rank OT reduces the size of a transport plan by forcing the coupling itself
to pass through a small latent measure. This is useful when the mass exchange is
expected to be organized by a few hidden clusters or prototypes, and it is
distinct from approximating the Sinkhorn kernel by a low-rank matrix. The idea
was introduced statistically through factored couplings by Forrow, Hütter,
Nitzan, Rigollet, Schiebinger and Weed {cite:p}`forrow2019factored`, and
developed algorithmically for arbitrary costs by Scetbon, Cuturi and Peyré
{cite:p}`scetbon2021lowrank`.

(def-low-rank-couplings)=
:::{admonition} Definition: Low-Rank Factored Couplings
:class: important
Let $a\in\simplex_n$, $b\in\simplex_m$ and let $r\geq1$. A rank-$r$ factored
coupling is a triple $(\Q,\R,g)$ such that

```{math}
\Q\in\RR_+^{n\times r},\qquad
\R\in\RR_+^{m\times r},
\qquad g\in\simplex_r,
```

with

```{math}
\Q\ones_r=a,
\qquad
\R\ones_r=b,
\qquad
\Q^\top\ones_n=\R^\top\ones_m=g.
```

It induces the coupling

```{math}
:label: eq-low-rank-coupling-factor
\P(\Q,\R,g)
=
\Q\operatorname{diag}(g)^{-1}\R^\top,
\qquad
\P_{i,j}=\sum_{k=1}^r \frac{\Q_{i,k}\R_{j,k}}{g_k},
```

where columns with $g_k=0$ are discarded before applying the formula.
:::

The latent interpretation is immediate. The vector $g$ is the law of an
intermediate variable $Z\in\{1,\ldots,r\}$; $\Q$ is a coupling of the source
index $X$ with $Z$; $\R$ is a coupling of the target index $Y$ with the same
$Z$. Formula {eq}`eq-low-rank-coupling-factor` is the law of $(X,Y)$ obtained
by sampling $Z\sim g$, then sampling $X$ and $Y$ conditionally independently
given $Z$. Equivalently, OT is replaced by a succession of two transports through an
abstract intermediate measure $\eta=\sum_{k=1}^r g_k\delta_{z_k}$ on an
$r$-point space. The locations $z_k$ only label the latent atoms and do not
enter the original cost.

(prop-low-rank-factorization)=
:::{admonition} Proposition: Factored Couplings and Nonnegative Rank
:class: important
For every feasible triple $(\Q,\R,g)$ in Definition {ref}`def-low-rank-couplings`,
the matrix $\P(\Q,\R,g)$ belongs to $\CouplingsD(a,b)$ and has nonnegative rank at
most $r$. Conversely, every coupling $\P\in\CouplingsD(a,b)$ with nonnegative
rank at most $r$ admits a representation of the form
{eq}`eq-low-rank-coupling-factor`, after possibly deleting zero latent
components.
:::

:::{dropdown} Proof
The marginal constraints follow by direct summation:

```{math}
\P\ones_m=\Q\operatorname{diag}(g)^{-1}\R^\top\ones_m
=\Q\operatorname{diag}(g)^{-1}g=\Q\ones_r=a,
```

and similarly $\P^\top\ones_n=b$. Since $\P$ is a sum of $r$ nonnegative
rank-one matrices $\Q_{:,k}\R_{:,k}^\top/g_k$, its nonnegative rank is at most
$r$.

Conversely, suppose $\P=UV^\top$ with $U\in\RR_+^{n\times r}$ and
$V\in\RR_+^{m\times r}$. Set $q_k=\sum_i U_{i,k}$ and
$s_k=\sum_j V_{j,k}$. Components with $q_ks_k=0$ do not contribute and can be
removed. Define $g_k=q_ks_k$, $\Q_{i,k}=U_{i,k}s_k$ and
$\R_{j,k}=V_{j,k}q_k$. Since $\P$ has total mass one, $g\in\simplex_r$. Moreover
$\Q\ones_r=\P\ones_m=a$, $\R\ones_r=\P^\top\ones_n=b$, and both column marginals
are equal to $g$. Finally,

```{math}
\sum_k\frac{\Q_{i,k}\R_{j,k}}{g_k}
=
\sum_k\frac{U_{i,k}s_kV_{j,k}q_k}{q_ks_k}
=\P_{i,j}.
```
:::

For a cost matrix $\C\in\RR^{n\times m}$, the low-rank constrained OT value is

```{math}
\min_{(\Q,\R,g)}
\left\langle\C,\Q\operatorname{diag}(g)^{-1}\R^\top\right\rangle.
```

The minimization is over triples satisfying Definition
{ref}`def-low-rank-couplings`.

This problem is non-convex. Scetbon, Cuturi and Peyré regularize the joint
variables $(\Q,\R,g)$ by the sum of their entropies and optimize them by
constrained mirror descent {cite:p}`scetbon2021lowrank`. To isolate the simpler
block mechanism used in Figure {ref}`fig:low-rank-ot-factorization`, fix a
positive latent law $g\in\simplex_r$ and optimize only the two sub-couplings:

```{math}
:label: eq-low-rank-entropic-ot
\min_{\substack{\Q\ones_r=a,\;\Q^\top\ones_n=g\\
\R\ones_r=b,\;\R^\top\ones_m=g}}
\left\langle\C,\Q\operatorname{diag}(g)^{-1}\R^\top\right\rangle
+
\epsilon\KLD(\Q|a\otimes g)
+
\epsilon\KLD(\R|b\otimes g).
```

For fixed $g$, this differs only by constants from adding the negative
entropies of $\Q$ and $\R$ to the factorized transport cost. Each block subproblem
is a strictly convex entropic OT problem with an effective cost, although the
joint objective remains non-convex because of its bilinear $\Q$--$\R$ term.

:::{admonition} Algorithm: Alternating Low-Rank Sinkhorn with Fixed Latent Mass
:class: note
**Input:** positive marginals $a\in\operatorname{int}(\simplex_n)$ and
$b\in\operatorname{int}(\simplex_m)$, cost $\C\in\RR^{n\times m}$, rank
$r$, positive latent mass $g\in\operatorname{int}(\simplex_r)$,
regularization $\epsilon>0$, maximum number of iterations $L\geq1$, and
tolerance $\mathrm{tol}$.

**Output:** factored coupling $\P=\Q\operatorname{diag}(g)^{-1}\R^\top$.

Initialize $\Q^{(0)}=a\otimes g$, $\R^{(0)}=b\otimes g$ and $J^{(0)}=+\infty$.

For $\ell=0,\ldots,L-1$:

1. Set $A^{(\ell)}=\C \R^{(\ell)}\operatorname{diag}(g)^{-1}$.
2. Update $\Q^{(\ell+1)}$ by entropic OT:
   $\Q^{(\ell+1)}=\arg\min_{\Q\ones_r=a,\,\Q^\top\ones_n=g}
   \langle A^{(\ell)},\Q\rangle+\epsilon\KLD(\Q|a\otimes g)$.
3. Set $B^{(\ell+1)}=\C^\top \Q^{(\ell+1)}\operatorname{diag}(g)^{-1}$.
4. Update $\R^{(\ell+1)}$ by entropic OT:
   $\R^{(\ell+1)}=\arg\min_{\R\ones_r=b,\,\R^\top\ones_m=g}
   \langle B^{(\ell+1)},\R\rangle+\epsilon\KLD(\R|b\otimes g)$.
5. Set $\P^{(\ell+1)}=\Q^{(\ell+1)}\operatorname{diag}(g)^{-1}(\R^{(\ell+1)})^\top$.
6. Set $J^{(\ell+1)}$ to the value of {eq}`eq-low-rank-entropic-ot` at
   $(\Q^{(\ell+1)},\R^{(\ell+1)})$.
7. If $\ell\geq1$ and
   $|J^{(\ell+1)}-J^{(\ell)}|\leq \mathrm{tol}\max\{1,|J^{(\ell)}|\}$, return
   $\P^{(\ell+1)}$.

Return $\P^{(L)}$ if the loop reaches $L$ iterations.
:::

Each update exactly minimizes one factor block while keeping the other fixed.
Once its effective cost has been formed, one Sinkhorn scaling step for the
$\Q$ block costs $O(nr)$ operations and one for the $\R$ block costs $O(mr)$,
instead of $O(nm)$ for a scaling step on the full coupling. The factors require
only $O((n+m)r)$ storage as long as the full matrix $\P$ is kept implicit. For
a dense unstructured cost, however, forming $\C\R$ or $\C^\top\Q$ costs $O(nmr)$ per
block, so an overall speedup requires structure in the cost multiplication or
enough inner scaling iterations to amortize this cost. The objective decreases
monotonically. Positivity makes each block minimizer
unique and keeps it in the relative interior of its transport polytope.
Compactness and exact cyclic block-coordinate descent imply that every
accumulation point is a coordinatewise minimizer, hence a stationary point of
the constrained problem. The non-convexity does not guarantee a globally
optimal rank-$r$ coupling.

Figure {ref}`fig:low-rank-ot-factorization` visualizes both the intermediate latent measure and the improvement of the factored coupling as the prescribed rank increases.

(fig:low-rank-ot-factorization)=

:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("low-rank-ot-factorization")
```

*Low-rank entropic OT on a one-dimensional Gaussian-mixture example. The first
view shows factorization through four latent atoms; the matrix panels compare
the full entropic coupling with fixed-latent-mass low-rank couplings of
increasing rank. This is deliberately not a favorable example for low rank:
with a small entropic parameter, one-dimensional quadratic OT is close to a
sparse Monge graph rather than to a genuinely low-rank matrix.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Vary the latent rank and entropic scale to see the same
one-dimensional problem as a two-stage transport through a small intermediate
measure. The right matrix should approach the full entropic plan as the rank
increases.
:::

<iframe class="ot4ml-live-frame" title="Low-rank optimal transport controls" src="../live/low-rank-ot.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>


## Capacity-Constrained Optimal Transport
(sec-capacity-constrained-ot)=

Classical Kantorovich transport only fixes the marginals: if a pair $(x,y)$ is
cheap, the optimizer may concentrate as much mass as the marginal constraints
allow on this pair. Capacity-constrained OT adds a local congestion rule on the
coupling itself. It is useful when edges, facilities or matchings have limited
throughput, and it also gives a clean mathematical way to interpolate between a
sparse OT plan and the independent product coupling. The systematic study of
the continuous problem, including existence and the geometry of active
saturated regions, was developed by Korman and McCann {cite:p}`km1`.

Let $\alpha\in\Mm_+^1(\Xx)$, $\beta\in\Mm_+^1(\Yy)$ and let
$\kappa:\Xx\times\Yy\to[0,+\infty)$ be a finite-valued measurable capacity. The
capacity-constrained transport value is

```{math}
:label: eq-capacity-constrained-ot
\MK_c^\kappa(\alpha,\beta)
=
\inf_{\pi\in\Couplings(\alpha,\beta)}
\left\{
\int_{\Xx\times\Yy} c(x,y)\,d\pi(x,y)
:\;
\pi\ll\alpha\otimes\beta,\quad
\frac{d\pi}{d(\alpha\otimes\beta)}(x,y)\leq\kappa(x,y)
\right\}.
```

The product coupling $\alpha\otimes\beta$ is feasible whenever $\kappa\geq1$.
Thus the constraint is not meant to promote the product plan; rather, it
prevents the optimizer from using any pair more than the prescribed density
ratio. Separately, we adopt the convention
$\MK_c^{+\infty}(\alpha,\beta)=\MK_c(\alpha,\beta)$: the symbol
$\kappa\equiv+\infty$ removes both the density bound and the
absolute-continuity requirement, and hence recovers the full Kantorovich
problem. At the opposite extreme,
$\kappa=1$ forces the independent coupling itself, because a density bounded
by one and integrating to one must equal one almost everywhere. Values close
to one therefore enforce diffuse plans close to this reference.

For discrete measures $\alpha=\sum_i a_i\delta_{x_i}$ and
$\beta=\sum_j b_j\delta_{y_j}$, a capacity is an upper matrix
$U\in\RR_+^{n\times m}$. The density-ratio discretization of
{eq}`eq-capacity-constrained-ot` is $U_{i,j}=\kappa_{i,j}a_i b_j$, and the
finite-dimensional problem is the linear program

```{math}
:label: eq-discrete-capacity-constrained-ot
\min_{\P\in\CouplingsD(a,b)}
\langle \C,\P\rangle
\quad\text{subject to}\quad
0\leq \P_{i,j}\leq U_{i,j}\quad\forall(i,j).
```

Feasibility is now a genuine issue: the upper matrix must contain enough mass
in every row-column cut to support the prescribed marginals. The usual
transport polytope is recovered when $U_{i,j}=+\infty$, while small capacities
select a smaller capped transportation polytope. For index sets $I$ and $J$,
write $a(I)=\sum_{i\in I}a_i$, $b(J)=\sum_{j\in J}b_j$, and
$U(I,J)=\sum_{i\in I,j\in J}U_{ij}$.

(prop-capacity-feasibility)=
:::{admonition} Proposition: Feasibility of a Capped Transport Polytope
:class: important
The capped marginal constraints are feasible if and only if

```{math}
:label: eq-capacity-cut-condition
a(I)+b(J)-1\leq U(I,J)
\qquad\text{for every }I\subset\{1,\ldots,n\},\ J\subset\{1,\ldots,m\}.
```
:::

:::{dropdown} Proof
If $\P$ is feasible, then

```{math}
\P(I,J)=a(I)-\P(I,J^c)\geq a(I)-b(J^c)=a(I)+b(J)-1,
```

and $\P(I,J)\leq U(I,J)$ proves necessity. Conversely, build a flow network
with capacity $a_i$ from the source to row $i$, capacity $U_{ij}$ from row $i$
to column $j$, and capacity $b_j$ from column $j$ to the sink. A cut containing
row set $I$ and column set $J^c$ has capacity

```{math}
1-a(I)+U(I,J)+1-b(J).
```

The cut condition makes every such capacity at least one. The max-flow/min-cut
theorem therefore gives a unit flow, whose row-to-column edge values form the
required matrix $\P$.
:::

Entropic smoothing gives a direct Sinkhorn-like algorithm. Assume the cut
condition above. With
$K_{i,j}=a_i b_j e^{-\C_{i,j}/\epsilon}$, the regularized problem is

```{math}
:label: eq-entropic-capacity-constrained-ot
\min_{\P\in\CouplingsD(a,b),\,0\leq \P\leq U}
\langle \C,\P\rangle
+
\epsilon\KLD(\P|a\otimes b).
```

Equivalently, up to additive constants, the objective is
$\epsilon\KLD(\P|K)$. The problem is therefore the KL projection of $K$ onto the
intersection of three convex sets: the row constraints, the column constraints
and the box $\P\leq U$. Alternating KL projections with Dykstra correction
factors {cite:p}`Dykstra85,bauschke-lewis`, in the same spirit as the Bregman
projection formulation of Sinkhorn {cite:p}`2015-benamou-cisc`, gives a simple
capacity-constrained scaling scheme.

:::{admonition} Algorithm: Capacity-Constrained Sinkhorn by KL-Dykstra
:class: note
**Input:** positive marginals $a\in\simplex_n$ and $b\in\simplex_m$,
finite cost $\C$, feasible capacity $U$, regularization $\epsilon>0$, and
tolerance $\mathrm{tol}$.

**Output:** entropic capped coupling $\P$.

Restrict all arrays to the active edge set
$E=\{(i,j):U_{ij}>0\}$; entries outside $E$ remain zero. All products and
divisions below are entrywise on $E$.

Set $K_{i,j}=a_i b_j e^{-\C_{i,j}/\epsilon}$ for $(i,j)\in E$.

Initialize $\P=K$, correction matrices $\R_1=\R_2=\R_3=\ones_{n\times m}$ and
$r=+\infty$.

While $r>\mathrm{tol}$:

1. Set $Z=\P\odot \R_1$.
2. Project rows: $\P=\operatorname{diag}(a/(Z\ones_m))Z$.
3. Update $\R_1=Z\oslash \P$.
4. Set $Z=\P\odot \R_2$.
5. Project columns: $\P=Z\operatorname{diag}(b/(Z^\top\ones_n))$.
6. Update $\R_2=Z\oslash \P$.
7. Set $Z=\P\odot \R_3$.
8. Project capacity: $\P=\min\{Z,U\}$ entrywise.
9. Update $\R_3=Z\oslash \P$.
10. Set
    $r=\max\{\|\P\ones_m-a\|_\infty,\|\P^\top\ones_n-b\|_\infty,\|(\P-U)_+\|_\infty\}$.

Return $\P$.
:::

On the active support, all iterates and correction factors are positive, so
every division is defined. Finite-dimensional KL-Dykstra convergence shows
that, whenever the capped polytope is nonempty, the iterates converge to the
unique regularized minimizer. Deleting zero-capacity edges is essential:
otherwise the correction step creates undefined products of zero and infinite
factors.

Figure {ref}`fig:capacity-constrained-ot-1d` shows how lowering the entrywise cap progressively spreads a one-dimensional coupling while preserving both prescribed marginals.

(fig:capacity-constrained-ot-1d)=

:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("capacity-constrained-ot-1d")
```

*Capacity-constrained entropic OT between two one-dimensional Gaussian-mixture
histograms. The same source and target marginals are coupled with a
density-ratio cap $U_{ij}=\kappa a_i b_j$. Large capacity leaves a nearly
Monge-like graph, whereas small capacity saturates many entries and forces the
coupling to spread.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Vary the density-ratio cap and the entropic
regularization to see how the upper bound turns a graph-like one-dimensional
coupling into a saturated spread-out plan.
:::

<iframe class="ot4ml-live-frame" title="Capacity-constrained one-dimensional OT controls" src="../live/sinkhorn-capacity-1d.html" loading="lazy" style="width:100%;height:480px;border:0;display:block;"></iframe>

For the empirical self-coupling in {numref}`fig:capacity-constrained-ot-2d`, the
cap is chosen to prescribe a minimum number of outgoing connections per source
point. With uniform weights $a_i=1/n$, imposing $\P_{ij}\leq1/(qn)$ is equivalent
to the conditional bound $\P_{ij}/a_i\leq1/q$. Since each row has total mass
$1/n$, this forces each source row to use at least $q$ target atoms, up to the
small extra spreading introduced by entropic smoothing.

For the empirical self-coupling in Figure {ref}`fig:capacity-constrained-ot-2d`, the cap is chosen to prescribe a minimum number of outgoing connections per source point.

(fig:capacity-constrained-ot-2d)=

:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("capacity-constrained-ot-2d")
```

*Capacity-constrained local self-couplings on a two-dimensional empirical
Gaussian mixture. The source and target are the same semi-regular uniform
empirical measure, but the diagonal is removed to avoid the trivial identity
plan. The three panels use off-diagonal caps $U_{ij}=1/(qn)$ with
$q=1,3,5$, equivalently $\P_{ij}/a_i\leq1/q$ because $a_i=1/n$. They therefore
impose at least one, three and five outgoing connections per source atom.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change the admissible number of outgoing connections to see how the capacity bound turns a dense self-coupling into a local transport graph.
:::

<iframe class="ot4ml-live-frame" title="Interactive capacity-constrained coupling panel" src="../live/capacity-constrained-ot-2d.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>


(sec-metric-learning-inverse-ot)=
## Metric Learning and Inverse OT

Metric learning differentiates a forward transport loss through a parameterized
cost, whereas inverse OT starts from an observed plan and asks which cost makes
it optimal. The first viewpoint is often bilevel; the second admits a direct
convex formulation for affine cost families, provided the intrinsic cost
invariances are removed.

### Differentiating OT Losses

Inverse OT and metric learning repeatedly differentiate a forward OT value with
respect to the input law and to the ground cost. The two resulting objects are
precisely the two certificates of optimality: a Kantorovich potential for
perturbations of the marginal and an optimal coupling for perturbations of the
cost. The main caveat is non-uniqueness. In the unregularized case, the correct
objects are one-sided directional derivatives, or equivalently subgradients in
the measure variable and supergradients in the cost variable. Entropic
regularization selects a unique plan and, for positive finite histograms, gives
ordinary derivatives on the simplex interiors.

(prop-ot-first-variations-unregularized)=
:::{admonition} Proposition: First variations of OT values
:class: important
Let $\alpha$ and $\beta$ be probability measures with compact supports
$\Xx=\supp(\alpha)$ and $\Yy=\supp(\beta)$, let
$c\in\Cc(\Xx\times\Yy)$, and let $\epsilon\geq0$. Use the convention
$\MK_c^0=\MK_c$, where the two values are defined in
{eq}`eq-mk-generic` and {eq}`eq-entropic-generic-web`. Denote by
$\mathcal O_c^\epsilon(\alpha,\beta)$ and
$\mathcal D_c^\epsilon(\alpha,\beta)$ the sets of primal and dual optimizers of
the corresponding problem.

If $\chi$ is a signed measure with $\chi(\Xx)=0$ and
$\alpha_t=\alpha+t\chi$ is a probability measure for $0\leq t\leq t_0$, then

```{math}
\left.\frac{\d}{\d t}\right|_{t=0^+}
\MK_c^\epsilon(\alpha_t,\beta)
=
\sup_{(f,g)\in\mathcal D_c^\epsilon(\alpha,\beta)}
\int_{\Xx} f(x)\d\chi(x).
```

If $h\in\Cc(\Xx\times\Yy)$ and $c_t=c+th$, then

```{math}
\left.\frac{\d}{\d t}\right|_{t=0^+}
\MK_{c_t}^\epsilon(\alpha,\beta)
=
\inf_{\pi\in\mathcal O_c^\epsilon(\alpha,\beta)}
\int_{\Xx\times\Yy} h(x,y)\d\pi(x,y).
```

For fixed $(\alpha,\beta)$, a finite signed Radon measure $\eta$ on
$\Xx\times\Yy$ represents the first variation of the functional
$c\mapsto\MK_c^\epsilon(\alpha,\beta)$ if,
for every $h\in\Cc(\Xx\times\Yy)$,

```{math}
\MK_{c+t h}^\epsilon(\alpha,\beta)
=
\MK_c^\epsilon(\alpha,\beta)
+t\int_{\Xx\times\Yy}h\d\eta+o(t)
\qquad(t\to0).
```

In particular, if the normalized optimal potential $f_\epsilon^\star$ and the
optimal plan $\pi_\epsilon^\star$ are unique (so in particular when
$\epsilon>0$), then, with the marginal first variation understood as in
Definition {ref}`def-first-variation`,

```{math}
\frac{\delta \MK_c^\epsilon}{\delta\alpha}(\alpha,\beta)=f_\epsilon^\star,
\qquad
\frac{\delta \MK_c^\epsilon}{\delta c}(\alpha,\beta)=\pi_\epsilon^\star .
```
:::

:::{dropdown} Proof
For $\epsilon=0$, the Kantorovich duality theorem is stated in Proposition
{ref}`prop-kantorovich-duality-general`. Its dual value is a supremum of affine
functions of $\alpha$, so Danskin's theorem {cite:p}`Danskin1967` gives the
first formula as the supremum over active dual potentials. The condition
$\chi(\Xx)=0$ makes this expression independent of the additive gauge
$(f,g)\mapsto(f+\lambda,g-\lambda)$.

For $\epsilon>0$, use the continuous entropic duality and primal-dual density
law of Proposition {ref}`prop-continuous-entropic-duality`. At an optimal pair,
the marginal constraint makes the density in
{eq}`eq-continuous-entropic-density-law-web` integrate to one with respect to
$\beta$ for every $x$ on the source support. Therefore the derivative of the
dual objective {eq}`eq-dual-sinkhorn-objective-web` with respect to $\alpha$ at
fixed optimal potentials is $\int f_\epsilon^\star\d\chi$: the derivative of
its exponential term vanishes after the row normalization. Danskin's theorem
then gives the same first formula, now with a singleton set of normalized
active potentials.

For every $\epsilon\geq0$, the primal objective depends on $c$ only through the
affine term $\int c\d\pi$. The minimum form of Danskin's theorem therefore gives
the second formula as the infimum of $\int h\d\pi$ over active primal
optimizers. Uniqueness makes the corresponding directional derivative linear,
which gives the two first variations.
:::

In the discrete unregularized case, the primal problem
{eq}`eq-kanto-discr-web` and its dual {eq}`eq-dual` show that any optimal dual
vector $f^\star$ is a subgradient with respect to the source weights $a$, while
any optimal plan $P^\star$ is a supergradient with respect to the cost matrix
$C$, because the value is concave in $C$:

```{math}
f^\star\in\partial_a\mathcal L_C(a,b),
\qquad
P^\star\in\partial_C^{\mathrm{sup}}\mathcal L_C(a,b).
```

Here $\partial_C^{\mathrm{sup}}$ denotes the superdifferential of the concave
map $C\mapsto\mathcal L_C(a,b)$. When the corresponding objects are unique,
these inclusions become the gradients $\nabla_a\mathcal L_C(a,b)=f^\star$ on
the tangent space $\{\dotp{\ones}{\chi}=0\}$ and
$\nabla_C\mathcal L_C(a,b)=P^\star$. Without uniqueness, the exact directional
derivative with respect to $C$ in a direction $\Delta C$ is the minimum of
$\dotp{\Delta C}{P}$ over all optimal plans.

For $\epsilon>0$, uniqueness makes these ordinary derivatives on the relative
interiors of finite-dimensional simplices. For a finite-dimensional
parametrization $c_\theta$, the entropic formula gives the backpropagation rule

```{math}
\partial_{\theta}\MK_{c_\theta}^\epsilon(\alpha,\beta)
=
\int \partial_\theta c_\theta(x,y)\d\pi_{\theta,\epsilon}^\star(x,y),
```

where $\pi_{\theta,\epsilon}^\star$ is the entropic optimizer between
$(\alpha,\beta)$ for the cost $c_\theta$. For example, let
$\Xx=\Yy=\RR^d$ and $c_A(x,y)=\dotp{Ax}{y}$, with
$A\in\RR^{d\times d}$. For every perturbation $H\in\RR^{d\times d}$,

```{math}
D_A\MK_{c_A}^\epsilon(\alpha,\beta)[H]
=
\int \dotp{Hx}{y}\d\pi_{A,\epsilon}^\star(x,y)
=
\left\langle H,\int yx^\top\d\pi_{A,\epsilon}^\star(x,y)\right\rangle_{\mathrm F}.
```

Consequently,

```{math}
\nabla_A\MK_{c_A}^\epsilon(\alpha,\beta)
=
\int yx^\top\d\pi_{A,\epsilon}^\star(x,y)
=
\operatorname{Cov}_{\pi_{A,\epsilon}^\star}(Y,X)+m_\beta m_\alpha^\top,
```

where $(X,Y)\sim\pi_{A,\epsilon}^\star$, $m_\alpha=\int x\d\alpha(x)$ and
$m_\beta=\int y\d\beta(y)$. Thus the gradient is the raw cross-moment of the
optimal coupling, and it is its cross-covariance when both marginals are
centered. This is the calculus behind
ground-metric learning, which was explicitly studied in
{cite:p}`CuturiGroundMetric2014` and connects to the broader metric-learning
literature {cite:p}`MAL-019,bellet2015metric`. Figure
{ref}`fig:metric-learning-cost-deformation` uses instead the Mahalanobis cost
$c_A^{\mathrm{quad}}(x,y)=(x-y)^\top A(x-y)$ with $A$ symmetric positive
definite. For fixed marginals, its two purely quadratic terms depend only on $(\alpha,\beta)$, while its
coupling-dependent term is $-2\dotp{Ax}{y}$; the same cross-moment therefore
controls how the optimal matching changes with $A$.

(fig:metric-learning-cost-deformation)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("metric-learning-cost-deformation")
```

*Changing the ground metric changes the optimal coupling. The same red and
blue empirical measures are matched with
$c_A^{\mathrm{quad}}(x,y)=(x-y)^\top A(x-y)$ for the Euclidean metric and two increasingly
anisotropic Mahalanobis metrics. The small gray ellipse shows the unit ball of
the metric: directions in which the ellipse is elongated are cheaper, and
this deforms the transport segments selected by the OT plan.*
:::

The interactive demo lets the anisotropy and orientation of the Mahalanobis cost
move. The transport plan is recomputed exactly for the displayed particles,
so the segments show how the learned cost changes the matching.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the metric and deformation controls to see how learning the ground cost changes the apparent transport geometry.
:::

<iframe class="ot4ml-live-frame" title="Metric learning controls" src="../live/ot-problems-metric.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

### Inverse Optimal Transport

Inverse OT asks for a ground cost that explains observed matchings or flows as
optimal transport plans. In its most direct form, one observes a plan
$\widehat\pi\in\Couplings(\alpha,\beta)$ and seeks a cost $c$ for which
$\widehat\pi$ solves the $\epsilon$-regularized problem
{eq}`eq-entropic-generic-web`, with $\epsilon\geq0$ and the convention
$\MK_c^0=\MK_c$.

This inverse problem is ill-posed without structure. Adding $u(x)+v(y)$ to a
cost shifts every feasible objective by the same marginal-dependent constant
and leaves its minimizers unchanged. When $\epsilon=0$, multiplication by a
positive scalar is another invariance and the zero cost rationalizes every
feasible plan. An identifiable model must therefore fix the relevant gauges
and, in the unregularized case, its scale.

The natural loss is the regularized suboptimality of the observed plan.

(def-inverse-ot-loss)=
:::{admonition} Definition: Regularized Inverse-OT Loss
:class: important
Let $\epsilon\geq0$ and
$\widehat\pi\in\Couplings(\alpha,\beta)$, with
$\operatorname{KL}(\widehat\pi\mid\alpha\otimes\beta)<+\infty$ when
$\epsilon>0$. The regularized inverse-OT loss is

```{math}
:label: eq-inverse-ot-loss
\mathcal F_\epsilon(c\mid\widehat\pi)
\eqdef
\int c\d\widehat\pi
+\epsilon\operatorname{KL}(\widehat\pi\mid\alpha\otimes\beta)
-\MK_c^\epsilon(\alpha,\beta),
```

where the entropy term is set to zero when $\epsilon=0$.
:::

This definition treats unregularized and entropic inverse OT with the same
notation. It is also a Fenchel--Young loss for the convex prediction map
associated with regularized OT {cite:p}`andrade2025sharpened`. As shown next,
it is convex in $c$; minimizing it over a convex class of costs is therefore a
convex problem that avoids non-convex bilevel optimization through a forward
OT solver.

(prop-inverse-ot-convex)=
:::{admonition} Proposition: Convexity and Calibration of the Inverse-OT Loss
:class: important
For fixed $(\alpha,\beta,\widehat\pi)$, the map
$c\mapsto\mathcal F_\epsilon(c\mid\widehat\pi)$ is convex and nonnegative.
Moreover,

```{math}
\mathcal F_\epsilon(c\mid\widehat\pi)=0
\quad\Longleftrightarrow\quad
\widehat\pi\text{ solves the regularized OT problem for the cost }c.
```

When $\epsilon>0$, the regularized optimizer is unique whenever the value is
finite, so the equality condition identifies the forward coupling for a fixed
cost.
:::

:::{dropdown} Proof
The first two terms in {eq}`eq-inverse-ot-loss` are respectively linear and
constant in $c$, whereas
$c\mapsto\MK_c^\epsilon(\alpha,\beta)$ is concave because it is the infimum
of affine functions of $c$. Testing the regularized OT problem with
$\widehat\pi$ proves nonnegativity, and equality holds precisely when this
test plan attains the infimum. Uniqueness for $\epsilon>0$ follows from the
strict convexity of relative entropy on finite-entropy couplings.
:::

#### Bilinear Cost Learning

For concreteness, consider the bilinear model on $\RR^d$,

```{math}
c_A(x,y)=\dotp{Ax}{y},
\qquad A\in\RR^{d\times d}.
```

After fixing the cost invariances through a convex admissible set
$\mathcal A\subset\RR^{d\times d}$, one estimates

```{math}
:label: eq-inverse-ot-bilinear-estimator
A^\star\in\argmin_{A\in\mathcal A}
\mathcal F_\epsilon(c_A\mid\widehat\pi).
```

This is an instance of the preceding convex formulation because
$A\mapsto c_A$ is linear. Figure
{ref}`fig:inverse-ot-forward-logo` illustrates the correspondence between $A$
and the resulting coupling on the OT4ML point clouds in the unregularized case
$\epsilon=0$. The choices $A=-I$ and $A=+I$ favor, respectively, correlated
and anticorrelated assignments, while rank-one matrices select predominantly
horizontal or vertical correspondences.

(fig:inverse-ot-forward-logo)=
:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change the bilinear cost matrix and solve the corresponding equal-weight assignment in the browser; each panel uses an actual Hungarian solve.
:::

<iframe class="ot4ml-live-frame" title="Interactive inverse-OT forward assignment panel" src="../live/inverse-ot-forward.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("inverse-ot-bilinear-logo-map")
```

*Forward solutions of the bilinear cost $c_A(x,y)=\dotp{Ax}{y}$ on the OT4ML
logo point clouds.* Each panel solves the equal-weight assignment problem with
a different matrix $A$; the first two use $\delta=10^{-3}$ to break rank-one
ties. The source atoms are red, the target atoms are blue, and the gray
segments give one deterministic optimal bijection.
:::

#### Finite-Sample Polyhedrality and Population Curvature

Let $A_0=-I$ and let $\pi_0$ be the associated population optimal plan,
equivalently the quadratic $\Wass_2$ plan. From i.i.d. pairs
$(X_i,Y_i)\sim\pi_0$, form

```{math}
\widehat\pi_n=\frac1n\sum_{i=1}^n\delta_{(X_i,Y_i)}.
```

To vary the cost while fixing its trace, let
$J=\left(\begin{smallmatrix}0&-1\\1&0\end{smallmatrix}\right)$ and
$A_t=-I+tJ$. The interactive panel and book figure below plot the already-defined
loss $t\mapsto\mathcal F_0(c_{A_t}\mid\widehat\pi_n)$. For every finite $n$,
this is a convex polyhedral function: the observed-plan cost is affine in $t$,
whereas the empirical OT value is the minimum of finitely many affine
assignment costs. Its zero set can therefore contain an interval even when
the population cost is identifiable.

(fig:inverse-ot-gap-loss)=
:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change the sample size and nonlinear Brenier map to recompute the empirical loss along the transverse cost path.
:::

<iframe class="ot4ml-live-frame" title="Interactive inverse-OT loss panel" src="../live/inverse-ot-gap.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("inverse-ot-gap-loss")
```

*Empirical inverse-OT losses approach a curved population geometry.* Panel (a)
shows $n=10$ i.i.d. pairs from a fixed plan
$\pi_0=(I,T)_\sharp\alpha$ generated by a nonlinear Brenier map $T$ for
$A_0=-I$. Panels (b,c) plot
$t\mapsto\mathcal F_0(c_{A_t}\mid\widehat\pi_n)$ for $n=10$ and $n=100$ on
the same vertical scale. Each finite-sample curve is convex and polyhedral;
increasing $n$ resolves progressively more affine pieces around the generating
parameter $t=0$.
:::

As $n\to+\infty$, these empirical losses converge to the population loss
$\mathcal F_0(c_{A_t}\mid\pi_0)$ under the usual moment assumptions. Peyré,
Poon and Tron {cite:p}`peyre2026curvature` identify conditions under which this
limit is genuinely curved. In their smooth setting, the source and target have
positive Hölder densities bounded away from zero on compact connected
uniformly convex domains, $A_0$ is invertible, and the Hessians of the
associated Kantorovich potential span the symmetric matrices. The population
loss is then locally quadratic in directions transverse to the unavoidable ray
$\{\lambda A_0:\lambda>0\}$. Thus increasing $n$ can reveal population
curvature, as suggested by the numerical experiment below, but it cannot
repair a structural failure of identifiability such as the affine Gaussian
case.

#### Statistical Estimation

Suppose that $(X_i,Y_i)_{i=1}^n$ are i.i.d. samples from the entropic optimizer
$\pi_{A_0,\epsilon}^\star$ associated with $c_{A_0}$, and set
$\widehat\pi_n=n^{-1}\sum_{i=1}^n\delta_{(X_i,Y_i)}$. Applying
{eq}`eq-inverse-ot-bilinear-estimator` with the empirical marginals of
$\widehat\pi_n$ gives a convex empirical estimator. In a fixed-dimensional
identifiable model, Andrade, Peyré and Poon {cite:p}`andrade2024sparsistency`
analyze its $\ell^1$-regularized version for $\epsilon>0$. Under their
nondegenerate-certificate assumptions and with a regularization parameter of
order $n^{-1/2}$, up to logarithmic, confidence and $\epsilon$-dependent
factors, they prove

```{math}
\norm{A_n^\star-A_0}_{\mathrm F}=O_{\mathbb P}(n^{-1/2})
```

together with recovery of the support of $A_0$. This rate is not
unconditional: cost gauges, identifiability and the stated nondegeneracy
assumptions are essential. More general Fenchel--Young formulations and
curvature properties of inverse OT are studied in
{cite:p}`andrade2025sharpened,peyre2026curvature`.

(sec-weak-ot)=
## Weak Optimal Transport

Weak OT relaxes the cost so that it depends on the conditional distribution
of destinations rather than only on pointwise pairs. It is useful when a
source point is allowed to choose a randomized response and the model only
penalizes an aggregate of that response, such as its conditional mean.

### Barycentric Projection of a Coupling

The first object to isolate is the map obtained by collapsing each
conditional law to its barycenter.

(def-barycentric-projection)=
:::{admonition} Definition: Barycentric Projection of a Coupling
:class: important
Let $\alpha,\beta\in\mathcal P_1(\RR^d)$ and let
$\pi\in\Couplings(\alpha,\beta)$. Disintegrate $\pi$ with respect to its first
marginal as $\pi(\d x,\d y)=\pi_x(\d y)\alpha(\d x)$. Since $\beta$ has
finite first moment, the conditional mean is finite for $\alpha$-a.e. $x$,
and the barycentric projection of $\pi$ is the map

```{math}
:label: eq-barycentric-projection
\bar T_\pi(x)
\eqdef
\int_{\RR^d}y\d\pi_x(y),
\qquad
\bar\beta_\pi
\eqdef
(\bar T_\pi)_\sharp\alpha.
```
:::

The projected target $\bar\beta_\pi$ records the distribution of conditional
means, not the full second marginal. Thus it is generally different from
$\beta$; if $\pi=(\Id,T)_\sharp\alpha$ is induced by a map, then
$\bar T_\pi=T$ and $\bar\beta_\pi=\beta$. For discrete measures
$\alpha=\sum_{i=1}^n a_i\delta_{x_i}$ and
$\beta=\sum_{j=1}^m b_j\delta_{y_j}$, write
$\pi=\sum_{i,j}\mathrm P_{i,j}\delta_{(x_i,y_j)}$ with
$\mathrm P\in\mathrm U(a,b)$. Then

```{math}
\pi_{x_i}=\sum_{j=1}^m\frac{\mathrm P_{i,j}}{a_i}\delta_{y_j}
\qquad\text{and}\qquad
\bar T_\pi(x_i)=\frac{1}{a_i}\sum_{j=1}^m\mathrm P_{i,j}y_j.
```

The useful positive statement is attached to quadratic optimal plans, as in
the tangent-space viewpoint on $\Wass_2$ developed by Ambrosio, Gigli and Savare
{cite:p}`ambrosio2006gradient`.

(prop-barycentric-projection-optimal)=
:::{admonition} Proposition: Barycentric Projection of a Quadratic Optimal Plan
:class: important
Let $\pi\in\Couplings(\alpha,\beta)$ be optimal for the quadratic cost
$\norm{x-y}^2$ between $\alpha,\beta\in\mathcal P_2(\RR^d)$, and define
$\bar T_\pi$ and $\bar\beta_\pi$ by {eq}`eq-barycentric-projection`. Then
$(\Id,\bar T_\pi)_\sharp\alpha$ is an optimal coupling between $\alpha$ and
$\bar\beta_\pi$. Equivalently, $\bar T_\pi$ is a quadratic optimal transport
map from $\alpha$ to the projected target $\bar\beta_\pi$.
:::

:::{dropdown} Proof
By the cyclic-monotonicity characterization of quadratic optimality, $\pi$ is
concentrated on a $c$-cyclically monotone set $\Gamma$ for
$c(x,y)=\norm{x-y}^2$. This means that every finite cycle
$(x_i,y_i)_{i=1}^m\subset\Gamma$ satisfies

```{math}
\sum_{i=1}^m\dotp{x_i}{y_i}
\geq
\sum_{i=1}^m\dotp{x_i}{y_{i+1}},
\qquad
y_{m+1}=y_1.
```

After changing the disintegration on an $\alpha$-negligible set, $\pi_x$ is
supported on the section $\Gamma_x=\{y:(x,y)\in\Gamma\}$ for
$\alpha$-almost every $x$. Choose $x_1,\ldots,x_m$ in this full-measure set
and independently sample $Y_i\sim\pi_{x_i}$. Applying the cyclic inequality
to $(x_i,Y_i)$ and taking expectations gives

```{math}
\sum_{i=1}^m\dotp{x_i}{\bar T_\pi(x_i)}
\geq
\sum_{i=1}^m\dotp{x_i}{\bar T_\pi(x_{i+1})}.
```

Thus $(\Id,\bar T_\pi)_\sharp\alpha$ is concentrated on a cyclically monotone
graph. By the cyclic-monotonicity characterization of quadratic optimality,
this plan is optimal between its two marginals.
:::

(rem-barycentric-projection-everywhere)=
:::{admonition} Remark: Barycentric Projection Appears Everywhere
:class: ot4ml-remark

Barycentric projection turns a conditional law into a mean. Definition
{ref}`def-barycentric-projection` applies it to a disintegrated coupling, and
Proposition {ref}`prop-barycentric-projection-optimal` shows that quadratic
optimal plans are stable under this collapse. The barycentric weak cost below
inserts $\bar T_\pi$ into {eq}`eq-weak-ot`; martingale OT instead imposes
$\int y\,\d\pi_x(y)=x$ in {eq}`eq-martingale-coupling`. Conditional
Wasserstein distances use the same disintegration language fiber by fiber in
{eq}`eq-conditional-ot-general`. Later, the mean-shift and Gaussian-attention
velocity {eq}`eq-l2-attention-mean-shift` is another barycentric average, while
SVGD replaces it by the RKHS steepest-descent average {eq}`eq-svgd-velocity`.
Across these examples, the recurring move is to retain conditional structure
while replacing a full conditional law by a tractable first or kernelized
moment.
:::

### Weak Transport Costs

Weak transport costs use the same disintegration but allow the objective to
depend on the whole conditional law, or on summaries such as the barycentric
projection {eq}`eq-barycentric-projection`. The framework was introduced
through general transport costs and weak transport inequalities, with
existence, duality and optimality conditions developed on Polish spaces
{cite:p}`gozlan2017kantorovich,backhoff2019weak`. For a weak cost
$C:\Xx\times\mathcal P(\Yy)\to\RR\cup\{+\infty\}$, the weak OT value is

(def-weak-optimal-transport)=
:::{admonition} Definition: Weak Optimal Transport
:class: important
Let $\Xx$ and $\Yy$ be Polish spaces, let $\alpha\in\mathcal P(\Xx)$ and
$\beta\in\mathcal P(\Yy)$, and let
$C:\Xx\times\mathcal P(\Yy)\to\RR\cup\{+\infty\}$ be measurable. For
$\pi\in\Couplings(\alpha,\beta)$, write
$\pi(\d x,\d y)=\alpha(\d x)\pi_x(\d y)$. Then

```{math}
:label: eq-weak-ot
\WOT_C(\alpha,\beta)
\eqdef
\inf_{\pi\in\Couplings(\alpha,\beta)}
\int C(x,\pi_x)\d\alpha(x).
```
:::

If $C(x,\cdot)$ is convex for $\alpha$-a.e. $x$, this objective is convex in
$\pi$. Indeed, the conditional law of $(1-t)\pi^0+t\pi^1$ is
$(1-t)\pi_x^0+t\pi_x^1$. Since $\Couplings(\alpha,\beta)$ is convex, weak OT
is then a convex optimization problem over couplings; without this hypothesis
it need not be.

The classical Kantorovich problem is recovered when
$C(x,\nu)=\int c(x,y)\d\nu(y)$, because the objective then becomes
$\int c(x,y)\d\pi(x,y)$. The genuinely weak behavior starts when $C$ is
nonlinear in $\nu$.

(prop-weak-ot-duality)=
:::{admonition} Proposition: Weak Kantorovich Duality
:class: important
Let $\Xx$ and $\Yy$ be compact metric spaces, and let
$C:\Xx\times\mathcal P(\Yy)\to\RR\cup\{+\infty\}$ be proper, jointly
lower semicontinuous, bounded from below, and convex in its second argument.
Fix $\alpha\in\mathcal P(\Xx)$ and $\beta\in\mathcal P(\Yy)$, and assume that
$\WOT_C(\alpha,\beta)<+\infty$.
For $g\in C(\Yy)$, define

```{math}
g^C(x)
\eqdef
\inf_{\nu\in\mathcal P(\Yy)}
\left\{C(x,\nu)-\int g(y)\d\nu(y)\right\}.
```

Then

```{math}
\WOT_C(\alpha,\beta)
=
\sup_{g\in C(\Yy)}
\left\{\int g^C(x)\d\alpha(x)+\int g(y)\d\beta(y)\right\}.
```

For $C(x,\nu)=\int c(x,y)\d\nu(y)$, this is the usual Kantorovich dual.
:::

:::{dropdown} Proof
The definition of $g^C$ gives

```{math}
C(x,\pi_x)\geq g^C(x)+\int g(y)\d\pi_x(y).
```

Integration and the second-marginal constraint prove weak duality. For the
converse, lift a kernel $x\mapsto\pi_x$ to
$\alpha(\d x)\delta_{\pi_x}(\d\nu)$ on
$\Xx\times\mathcal P(\Yy)$. Relaxing the graph constraint gives probability
measures $P$ whose first marginal is $\alpha$ and whose intensity satisfies

```{math}
\int_{\Xx\times\mathcal P(\Yy)}\nu\,\d P(x,\nu)=\beta.
```

This relaxation leaves the value unchanged. Disintegrate
$P(\d x,\d\nu)=P_x(\d\nu)\alpha(\d x)$ and replace $P_x$ by its barycenter
$\bar\nu_x=\int\nu\,\d P_x(\nu)$. The intensity is preserved and convexity
of $C(x,\cdot)$ cannot increase the objective. The relaxed feasible set is
compact and its integral objective is lower semicontinuous.
Fenchel--Rockafellar duality for the affine intensity constraint therefore has
no gap. Its continuous multiplier is $g\in C(\Yy)$; minimization in $\nu$
gives $g^C(x)$ and the constraint contributes $\int g\d\beta$. See
{cite:p}`backhoff2019weak` for the Polish-space formulation.
:::

The dual is a concave maximization problem. For each $x$, the map
$g\mapsto g^C(x)$ is the pointwise infimum over $\nu$ of affine functions of
$g$, hence is concave. Therefore
$g\mapsto\int g^C\d\alpha+\int g\d\beta$ is concave, although generally
non-smooth.

The most common weak transport model on $\RR^d$ retains only the conditional
barycenter. Its quadratic cost gives a convex relaxation of quadratic
Wasserstein transport.

(prop-barycentric-weak-ot)=
:::{admonition} Proposition: Barycentric Weak Transport Is Weaker than $\Wass_2$
:class: important
Let $\alpha,\beta\in\mathcal P_2(\RR^d)$ and define

```{math}
C_{\mathrm{bar}}(x,\nu)
=
\norm{x-\int y\d\nu(y)}^2.
```

Equivalently,

```{math}
:label: eq-barycentric-weak-primal
\WOT_{C_{\mathrm{bar}}}(\alpha,\beta)
=
\inf_{\pi\in\Couplings(\alpha,\beta)}
\int_{\RR^d}\norm{x-\bar T_\pi(x)}^2\d\alpha(x).
```

Then

```{math}
\WOT_{C_{\mathrm{bar}}}(\alpha,\beta)
\leq
\Wass_2^2(\alpha,\beta).
```
:::

:::{dropdown} Proof
Let $\pi$ be any coupling and disintegrate it as $\pi_x\alpha$. By Jensen's
inequality,

```{math}
\norm{x-\bar T_\pi(x)}^2
\leq
\int\norm{x-y}^2\d\pi_x(y).
```

Integrating in $x$ gives
$\int C_{\mathrm{bar}}(x,\pi_x)\d\alpha(x)\leq
\int\norm{x-y}^2\d\pi(x,y)$. Taking the infimum over $\pi$ proves the claim.
:::

For discrete measures $\alpha=\sum_{i=1}^n a_i\delta_{x_i}$ and
$\beta=\sum_{j=1}^m b_j\delta_{y_j}$, {eq}`eq-barycentric-weak-primal`
becomes

```{math}
:label: eq-barycentric-weak-discrete
\min_{\mathrm P\in\mathrm U(a,b)}
\sum_{i=1}^n a_i
\left\|x_i-\frac{1}{a_i}\sum_{j=1}^m\mathrm P_{i,j}y_j\right\|^2.
```

Each row barycenter is affine in $\mathrm P$, so this is a convex quadratic
program on the transport polytope. This contrasts with GW in Section
{ref}`sec-gromov-wasserstein`, whose quadratic coupling energy is generally
indefinite and non-convex.

One may add $\epsilon\operatorname{KL}(\pi\mid\alpha\otimes\beta)$ to the
objective. If $F_{\mathrm{bar}}$ denotes the unregularized objective in
{eq}`eq-barycentric-weak-primal`, a linearized ground cost at $\pi$ is

```{math}
:label: eq-barycentric-weak-linearized-cost
c_\pi^{\mathrm{bar}}(x,y)
\eqdef
2\dotp{x-\bar T_\pi(x)}{x-y}.
```

Indeed, for every $\widehat\pi\in\Couplings(\alpha,\beta)$,

```{math}
\left.\frac{\d}{\d t}\right|_{t=0}
F_{\mathrm{bar}}\bigl((1-t)\pi+t\widehat\pi\bigr)
=
\int c_\pi^{\mathrm{bar}}\d(\widehat\pi-\pi).
```

The $x$-only term in {eq}`eq-barycentric-weak-linearized-cost` is a harmless
source-marginal gauge; equivalently one may use
$2\dotp{\bar T_\pi(x)-x}{y}$. The first-order condition for a regularized
minimizer is the self-consistent entropic OT problem

```{math}
:label: eq-barycentric-weak-entropic-fixed-point
\pi^\star
\in
\argmin_{\widehat\pi\in\Couplings(\alpha,\beta)}
\left\{
\int c_{\pi^\star}^{\mathrm{bar}}\d\widehat\pi
+\epsilon\operatorname{KL}(\widehat\pi\mid\alpha\otimes\beta)
\right\}.
```

Because the regularized objective is convex, this self-consistency condition
characterizes its global minimizers, unlike frozen-cost stationarity for
general GW. Freezing $c_\pi^{\mathrm{bar}}$ gives an entropic OT subproblem
solvable by Sinkhorn, in the same computational spirit as Algorithm
{ref}`alg-entropic-gromov-wasserstein`. The curvature is opposite: here the
tangent is a lower model, so the undamped fixed-point iteration is not
automatically a descent method. Damped conditional-gradient or proximal
mirror-descent variants retain the convex optimization interpretation.

Figure {ref}`fig:weak-ot-barycentric-projection` compares the usual quadratic OT
plan with barycentric weak OT. It first displays the full optimal plan, then
retains only its conditional barycenters, and finally shows how optimizing
these barycenters changes the solution.

(fig:weak-ot-barycentric-projection)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("weak-ot-barycentric-projection")
```

*Classical and weak quadratic transport between a red disk and a blue
annulus.* Left: the quadratic OT plan $\pi_{\mathrm{OT}}$, with segment
thickness proportional to transported mass. Center: its barycentric
projection $\bar T_{\pi_{\mathrm{OT}}}$, shown by violet displacements. Right:
the projection $\bar T_{\pi_{\mathrm{weak}}}$ of a minimizer of
{eq}`eq-barycentric-weak-primal`; it remains much closer to the source points
because the weak objective ignores the conditional spread needed to reproduce
the blue marginal.
:::

The interactive demo lets each source point split toward several targets. Increasing
the split count or spread usually increases the full quadratic cost while the
weak barycentric cost can remain much smaller.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the spread and barycentric controls to compare full weak conditional laws with their barycentric projections.
:::

<iframe class="ot4ml-live-frame" title="Weak barycentric transport controls" src="../live/ot-problems-weak.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

The barycentric cost is the canonical example to keep in mind: admissibility
still constrains the full conditional laws to have second marginal $\beta$,
but the objective only charges the displacement from $x$ to $\bar T_\pi(x)$
and ignores the conditional variance around this barycenter. Its zero level
already points toward the next section. Vanishing cost means that every
conditional law is centered at its source, $\bar T_\pi(x)=x$, which is exactly
the martingale constraint. Martingale feasibility is therefore the zero-cost
question for barycentric weak OT, and Strassen's theorem will identify it with
the convex-order relation $\alpha\preceq_{\mathrm{cx}}\beta$.


(sec-martingale-ot)=
## Martingale Optimal Transport

Martingale OT is the extreme barycentric version of the weak viewpoint: a
source point may split randomly, but the average destination must remain
equal to the source point. This turns the barycentric projection from an
object used in the cost into a hard constraint.

(def-martingale-coupling)=
:::{admonition} Definition: Martingale Couplings and Martingale OT
:class: important
Let $\alpha,\beta\in\mathcal P_1(\RR^d)$. A coupling
$\pi\in\Couplings(\alpha,\beta)$ is a martingale coupling if, for the
disintegration $\pi(\d x,\d y)=\pi_x(\d y)\alpha(\d x)$,

```{math}
:label: eq-martingale-coupling
\int_{\RR^d}y\d\pi_x(y)=x
\qquad\text{for $\alpha$-a.e. }x .
```

Equivalently, $\bar T_\pi=\Id$ in {eq}`eq-barycentric-projection`. The set
of such couplings is

```{math}
\Couplings_{\mathrm{mart}}(\alpha,\beta)
\eqdef
\left\{
\pi\in\Couplings(\alpha,\beta)\;:\;
\bar T_\pi=\Id\quad\alpha\text{-a.e.}
\right\}.
```

For a cost $c$, the martingale OT value is
$+\infty$ if the admissible set is empty, and otherwise is obtained by
minimizing $\int c\d\pi$ over
$\Couplings_{\mathrm{mart}}(\alpha,\beta)$.
:::

(rem-weak-ot-martingale-feasibility)=
:::{admonition} Remark: Zero Barycentric Cost and Martingale Feasibility
:class: note
For $\alpha,\beta\in\mathcal P_2(\RR^d)$,

```{math}
:label: eq-weak-zero-iff-martingale
\WOT_{C_{\mathrm{bar}}}(\alpha,\beta)=0
\quad\Longleftrightarrow\quad
\Couplings_{\mathrm{mart}}(\alpha,\beta)\neq\emptyset.
```

Every martingale coupling has $\bar T_\pi=\Id$ and is therefore a zero-cost
competitor in {eq}`eq-barycentric-weak-primal`. Conversely, the barycentric
weak problem attains its minimum for finite-second-moment marginals: compactness
of the coupling set and lower semicontinuity of the convex weak cost give an
optimal $\pi$ {cite:p}`backhoff2019weak`. If the value is zero, nonnegativity
of the integrand yields $\bar T_\pi=\Id$ $\alpha$-almost everywhere, hence
$\pi\in\Couplings_{\mathrm{mart}}(\alpha,\beta)$. By Theorem
{ref}`thm-strassen-martingale`, these conditions are also equivalent to
$\alpha\preceq_{\mathrm{cx}}\beta$.
:::

The terminology comes from probability: if $(X,Y)\sim\pi$, then
{eq}`eq-martingale-coupling` is exactly $\mathbb E[Y|X]=X$. Hence martingale
OT is a Kantorovich problem with the usual two marginal constraints plus a
barycentric constraint on the conditional laws. Equivalently, the barycentric
projected coupling $(\Id,\bar T_\pi)_\sharp\alpha$ must be the diagonal
coupling $(\Id,\Id)_\sharp\alpha$. This is stronger than merely asking the
projected target $(\bar T_\pi)_\sharp\alpha$ to equal $\alpha$, since a
nontrivial measure-preserving map could have the same projected marginal
without satisfying $\bar T_\pi(x)=x$ pointwise. Martingale OT is central in
robust finance, where one transports today prices to tomorrow prices without
introducing drift, and has led to a rich martingale transport theory
{cite:p}`beiglbock2013model,GalichonMartingale,dolinsky2014martingale,guo2017computational`.

### Stochastic Orders

The admissibility of constrained couplings is governed by stochastic order. The
basic principle is that inequalities tested against a class of functions are
equivalent to the existence of couplings satisfying a pointwise or conditional
constraint. Strassen's theorem is the canonical result of this kind
{cite:p}`Strassen1965`.

(prop-strassen-stochastic-order)=
:::{admonition} Proposition: Strassen's Theorem for Stochastic Order
:class: important
Let $\alpha,\beta\in\Pp(\RR)$ and define the classical stochastic order by

```{math}
\alpha\preceq_{\mathrm{st}}\beta
\quad\Longleftrightarrow\quad
\int\varphi\,\d\alpha\leq\int\varphi\,\d\beta
\quad\text{for every bounded increasing }\varphi .
```

Then $\alpha\preceq_{\mathrm{st}}\beta$ if and only if there exists
$\pi\in\Couplings(\alpha,\beta)$ concentrated on
$\{(x,y):x\leq y\}$.
:::

:::{dropdown} Proof
A coupling supported on $x\leq y$ immediately gives the integral inequality for
every increasing $\varphi$. Conversely, testing approximate indicators of
intervals $(t,+\infty)$ gives
$F_\alpha(t)\geq F_\beta(t)$ for all continuity points of the distribution
functions. If $U$ is uniform on $(0,1)$ and
$F_\alpha^{-1},F_\beta^{-1}$ are the generalized quantiles, then
$X=F_\alpha^{-1}(U)$ and $Y=F_\beta^{-1}(U)$ have laws $\alpha$ and
$\beta$, and the inequality between distribution functions gives
$X\leq Y$ almost surely.
:::

### Convex Order and Martingale Feasibility

For martingale OT, the pointwise order constraint is replaced by a barycentric
constraint on conditional laws. The corresponding order is the convex order. For
$\alpha,\beta\in\Pp_1(\RR^d)$,

```{math}
\alpha\preceq_{\mathrm{cx}}\beta
\quad\Longleftrightarrow\quad
\int\varphi\,\d\alpha\leq\int\varphi\,\d\beta
\quad\text{for every convex }\varphi\text{ for which both integrals are defined}.
```

For finite-first-moment measures, it is enough to test continuous convex
functions with at most linear growth. Testing affine functions gives equality
of means, while the remaining convex tests say that $\beta$ is more spread
out than $\alpha$. Strassen's martingale theorem
says that this spread condition is exactly what is needed to realize $\beta$
from $\alpha$ by mean-preserving randomization.

(thm-strassen-martingale)=
:::{admonition} Theorem: Strassen's Martingale Theorem
:class: important
Let $\alpha,\beta\in\Pp_1(\RR^d)$. Then

```{math}
\alpha\preceq_{\mathrm{cx}}\beta
\quad\Longleftrightarrow\quad
\Couplings_{\mathrm{mart}}(\alpha,\beta)\neq\emptyset .
```

Equivalently, $\beta$ is above $\alpha$ in convex order if and only if there
exists a coupling $\pi(\d x,\d y)=\pi_x(\d y)\alpha(\d x)$ such that
$\int y\d\pi_x(y)=x$ for $\alpha$-almost every $x$.
:::

:::{dropdown} Proof
If $\pi$ is a martingale coupling, then Jensen's inequality gives, for every
convex $\varphi$,

```{math}
\varphi(x)
=
\varphi\!\left(\int y\d\pi_x(y)\right)
\leq
\int \varphi(y)\d\pi_x(y),
```

and integration in $x$ gives
$\int\varphi\d\alpha\leq\int\varphi\d\beta$.

Conversely, assume $\alpha\preceq_{\mathrm{cx}}\beta$. First suppose both
measures are supported in a compact convex set $K$. Separate $\beta$ from the
closed convex set of probability measures on $K$ reachable from $\alpha$ by
martingale kernels supported in $K$. If $\beta$ were not in this set, a
continuous separating function $\psi:K\to\RR$ would satisfy

```{math}
\int\psi\d\beta
>
\sup\left\{\int\psi\d\eta:\eta\in\mathcal P(K),\;
\Couplings_{\mathrm{mart}}(\alpha,\eta)\neq\emptyset\right\}.
```

For fixed $x\in K$, optimizing over probability measures on $K$ with
barycenter $x$ gives the concave envelope $\operatorname{conc}_K\psi(x)$.
Thus the right-hand side is $\int\operatorname{conc}_K\psi\d\alpha$.
Convex order is equivalently the reverse inequality for concave functions, so

```{math}
\int\operatorname{conc}_K\psi\d\alpha
\geq
\int\operatorname{conc}_K\psi\d\beta
\geq
\int\psi\d\beta,
```

a contradiction. For general measures in $\mathcal P_1(\RR^d)$, the same
separation argument is carried out in the $\Wass_1$ topology, whose continuous
test functions have at most linear growth. Compactness is replaced by tightness
and uniform integrability of first moments; these properties also make the set
of attainable second marginals closed and preserve the martingale constraint
under limits. This is the standard extension in Strassen's theorem
{cite:p}`Strassen1965`.
:::

The same theorem gives an exact geometric description of the barycentric weak
cost: weak OT transports to the closest measure below $\beta$ in convex order.

(prop-brenier-strassen-projection)=
:::{admonition} Proposition: Brenier--Strassen Projection Formula
:class: important
For $\alpha,\beta\in\mathcal P_2(\RR^d)$,

```{math}
:label: eq-brenier-strassen-projection
\WOT_{C_{\mathrm{bar}}}(\alpha,\beta)
=
\inf_{\eta\in\mathcal P_2(\RR^d):\,\eta\preceq_{\mathrm{cx}}\beta}
\Wass_2^2(\alpha,\eta).
```
:::

:::{dropdown} Proof
Let $(X,Y)\sim\pi\in\Couplings(\alpha,\beta)$, set
$Z=\mathbb E[Y\mid X]$, and denote its law by $\eta$. Conditional Jensen
shows $\eta\preceq_{\mathrm{cx}}\beta$, while $(X,Z)$ couples $\alpha$ and
$\eta$. Hence

```{math}
\Wass_2^2(\alpha,\eta)
\leq\mathbb E\norm{X-Z}^2
=\int C_{\mathrm{bar}}(x,\pi_x)\d\alpha(x).
```

Conversely, fix $\eta\preceq_{\mathrm{cx}}\beta$. Strassen's theorem gives a
martingale coupling from $\eta$ to $\beta$. Glue it conditionally to an
optimal coupling $(X,Z)$ between $\alpha$ and $\eta$. Then
$\mathbb E[Y\mid X]=\mathbb E[Z\mid X]$, and conditional Jensen gives

```{math}
\mathbb E\norm{X-\mathbb E[Y\mid X]}^2
\leq\mathbb E\norm{X-Z}^2
=\Wass_2^2(\alpha,\eta).
```

Taking the two infima proves the identity; see {cite:p}`backhoff2019weak` for
existence and finer structure of the projected measure.
:::

Theorem {ref}`thm-strassen-martingale` explains why convex order is the right
admissibility notion for martingale OT: it is exactly the feasibility condition
for the martingale constraint. If $\alpha\not\preceq_{\mathrm{cx}}\beta$, then
$\Couplings_{\mathrm{mart}}(\alpha,\beta)=\emptyset$ and the martingale OT value
is $+\infty$, independently of the cost. If
$\alpha\preceq_{\mathrm{cx}}\beta$, then the optimization problem is nonempty
and the cost selects, among all mean-preserving splittings of each source point,
the martingale coupling best adapted to the application. This is the
probabilistic meaning of the barycentric constraint: mass may branch, but it
cannot drift on average.

For Gaussian measures with the same mean, convex order reduces to the Loewner
order on covariance matrices:

```{math}
\mathcal N(m,\Sigma_0)\preceq_{\mathrm{cx}}\mathcal N(m,\Sigma_1)
\quad\Longleftrightarrow\quad
\Sigma_1-\Sigma_0\succeq0 .
```

Indeed, if $\Sigma_1-\Sigma_0\succeq0$, then
$\mathcal N(m,\Sigma_1)$ is obtained from $\mathcal N(m,\Sigma_0)$ by adding
independent centered Gaussian noise. Conversely, testing the convex quadratic
functions $x\mapsto\langle u,x\rangle^2$ gives the Loewner inequality.

Figure {ref}`fig:martingale-ot-centered-kernels` gives a discrete non-Gaussian counterpart: centered conditional kernels provide a feasible martingale plan, while optimizing the transport cost selects a much sparser plan with the same marginals and barycentric constraint.

(fig:martingale-ot-centered-kernels)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("martingale-ot-centered-kernels")
```

*A discrete one-dimensional martingale OT example. The source $\alpha$ is a
red Gaussian mixture on a grid. A first feasible plan is generated by centered
kernels $K_i(y_j)=\kappa_i(y_j-x_i)$, whose discrete barycenter is $x_i$.
Keeping the same marginals, the third panel solves the martingale OT linear
program with row, column, and constraints
$\sum_j(y_j-x_i)P_{ij}=0$. The optimized plan is much sparser, while both
plans have the identity barycentric projection.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change the space-varying kernel width and source skew to see how centered conditional kernels create a more spread target while preserving barycentric centering.
:::

<iframe class="ot4ml-live-frame" title="Interactive martingale-kernel panel" src="../live/martingale-ot-centered-kernels.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>
