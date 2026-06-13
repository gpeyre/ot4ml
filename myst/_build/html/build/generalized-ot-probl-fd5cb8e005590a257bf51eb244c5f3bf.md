---
title: "Generalized OT Problems"
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---

The second family changes the optimization problem rather than only the ground
distance. Barycenters average several measures, multi-marginal OT couples many
measures at once, inverse OT learns the cost from observed transport, and weak
OT allows randomized conditional responses.

These formulations remain close to Kantorovich linear programming, but the
object being optimized is richer than a single two-marginal coupling.

:::{admonition} Guiding Comparison
:class: tip
Barycenters optimize over the unknown measure being averaged. Multi-marginal
OT optimizes over a whole joint law with several marginals. Inverse OT makes
the ground cost the unknown. Weak OT keeps the marginal constraints but lets
the cost depend on conditional laws rather than only on pointwise pairs.
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

## OT Barycenters

Barycenters ask how to average probability measures rather than points. This
section explains the variational definition, the special closed forms in one
dimension and for Gaussians, and the entropic algorithms used in practice.

### Frechet Means

For discrete input histograms $\{b_s\}_{s=1}^S$, with
$b_s\in\simplex_{n_s}$, and weights $\lambda\in\simplex_S$, a Wasserstein
barycenter can be computed by minimizing

```{math}
:label: eq-wass-discr
\min_{a\in\simplex_n}
\sum_{s=1}^S
\lambda_s\,\mathcal L_{C_s}(a,b_s),
```

where the cost matrices $C_s\in\RR^{n\times n_s}$ are prescribed. This
barycenter problem was introduced by Carlier and coauthors, following earlier
matching ideas, and is the measure-valued analogue of a Frechet mean
{cite:p}`Carlier_wasserstein_barycenter,carlierekelandmatching`.

Given input measures $(\beta_s)_s$ on a space $\X$, the barycenter problem is

```{math}
:label: eq-barycenter-generic
\min_{\alpha\in\mathcal M_+^1(\X)}
\sum_{s=1}^S
\lambda_s\,\mathcal L_c(\alpha,\beta_s).
```

For $\X=\RR^d$ and $c(x,y)=\norm{x-y}^2$, if one input measure has a density,
then the barycenter is unique {cite:p}`Carlier_wasserstein_barycenter`.
Discrete existence, consistency, and fixed-point constructions are studied in
{cite:p}`anderes2016discrete,alvarez2016fixed,leGouic2016existence`.

:::{admonition} Remark: Two Measures Give a Wasserstein Geodesic
:class: note
For $S=2$, $c(x,y)=\norm{x-y}^2$ and weights $(1-t,t)$, the barycenter is the
point at time $t$ on the Wasserstein geodesic between $\beta_0$ and
$\beta_1$. If $T$ is the Brenier map from $\beta_0$ to $\beta_1$, this
barycenter is

```{math}
((1-t)\Id+tT)_\sharp\beta_0.
```

If no Monge map is available, the same construction uses an optimal coupling
$\pi$ and the interpolation map $(x,y)\mapsto(1-t)x+ty$, giving
$((1-t)x+ty)_\sharp\pi$.
:::

:::{admonition} Example: Dirac Inputs
:class: note
Problem {eq}`eq-barycenter-generic` generalizes the computation of
barycenters of points. If $\beta_s=\delta_{x_s}$ is a single Dirac mass, then
a solution is $\delta_{x^\star}$, where $x^\star$ is a Frechet mean of the
points $(x_s)_s$.
:::

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

<iframe class="ot4ml-live-frame" title="Quantile barycenter controls" src="../live/ot-problems-barycenter.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

:::{admonition} Remark: Mean of a Quadratic Barycenter
:class: note
For $c(x,y)=\norm{x-y}^2$, the mean of the barycenter $\alpha^\star$ is the
barycenter of the means:

```{math}
\int_\X x\d\alpha^\star(x)
=
\sum_s\lambda_s\int_\X x\d\beta_s(x).
```

Indeed, the squared Wasserstein distance decomposes into a squared distance
between means plus a centered Wasserstein term. Minimizing the resulting
quadratic function of the barycenter mean gives the identity. If the input
measures have compact support, the usual multi-marginal barycentric
construction also gives a barycenter supported in the convex hull of the
input supports.
:::

:::{admonition} Proposition: Convexity of the OT Cost
:class: important
The map $(\alpha,\beta)\mapsto\mathcal L_c(\alpha,\beta)$ is convex.
:::

:::{dropdown} Proof
Let $(\alpha_0,\beta_0)$ and $(\alpha_1,\beta_1)$ be two pairs of probability
measures and let $t\in[0,1]$. For $\eta>0$, choose couplings
$\pi_i\in\Couplings(\alpha_i,\beta_i)$ such that

```{math}
\int c\d\pi_i
\leq
\mathcal L_c(\alpha_i,\beta_i)+\eta
\qquad (i=0,1).
```

Then $\pi_t=(1-t)\pi_0+t\pi_1$ is a coupling between
$(1-t)\alpha_0+t\alpha_1$ and $(1-t)\beta_0+t\beta_1$. Hence

```{math}
\mathcal L_c((1-t)\alpha_0+t\alpha_1,(1-t)\beta_0+t\beta_1)
\leq
(1-t)\mathcal L_c(\alpha_0,\beta_0)
+
t\mathcal L_c(\alpha_1,\beta_1)
+
\eta .
```

Letting $\eta\to0$ gives the claim.
:::

Even when all input measures are discrete, the support of a barycenter is not
known a priori. The multi-marginal formulation below shows that a discrete
barycenter can be supported on all weighted averages of one support point from
each input. This gives at most $\prod_s n_s$ candidate points if the $s$-th
input has $n_s$ atoms, which is prohibitive when the number of inputs is
large. A common numerical compromise is therefore to prescribe a smaller
support for the barycenter and solve a fixed-support problem.

### One-Dimensional Case

On the line, barycenters become linear after the quantile change of variables.
This gives the rare case where the barycenter is explicit rather than the
solution of a high-dimensional optimization problem.

:::{admonition} Proposition: Quantile Barycenters on the Line
:class: important
For $\X=\RR$ and $c(x,y)=|x-y|^2$, the quantile function of a Wasserstein
barycenter is the weighted average of the input quantile functions:

```{math}
F_{\alpha^\star}^{-1}(r)
=
\sum_{s=1}^S
\lambda_s F_{\beta_s}^{-1}(r),
\qquad r\in[0,1].
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

:::{admonition} Remark: Gaussian Barycenters
:class: note
The barycenter of Gaussian measures is Gaussian. In one dimension, it is
obtained by averaging the means and the standard deviations, so the
barycenter variance is the square of this averaged standard deviation. In
higher dimensions, the covariance $\Sigma$ minimizes the Bures objective

```{math}
\Sigma\mapsto
\sum_s\lambda_s\mathcal B(\Sigma,\Sigma_s)^2,
```

and equivalently solves the fixed-point equation

```{math}
\Sigma
=
\sum_s\lambda_s
\left(\Sigma^{1/2}\Sigma_s\Sigma^{1/2}\right)^{1/2}.
```

The mean part averages linearly, while the covariance part averages through
the Bures--Wasserstein geometry {cite:p}`alvarez2016fixed,bhatia2018bures`.
:::

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

### Sinkhorn for Barycenters

A key difference with the regularized two-marginal OT problem is that there is
no canonical reference measure $\alpha\otimes\beta$, because the barycenter
$\alpha$ is unknown. To reduce complexity, one usually fixes a candidate
support for the barycenter and solves the discrete problem
{eq}`eq-wass-discr`; this introduces a discretization error but keeps the
number of unknowns manageable.

One can then use entropic smoothing and approximate {eq}`eq-wass-discr` by

```{math}
:label: eq-entropic-bary
\min_{a\in\simplex_n}
\sum_{s=1}^S
\lambda_s\mathcal L_{C_s}^{\epsilon}(a,b_s)
```

for some $\epsilon>0$. This is a smooth convex minimization problem, which can
be tackled using gradient descent {cite:p}`CuturiBarycenter`. An alternative
is to use a descent method, typically quasi-Newton, on the semi-dual
{cite:p}`2016-Cuturi-siims`; this is useful when adding extra regularization
on the barycenter, for instance to impose smoothness.

A simple but effective approach rewrites {eq}`eq-entropic-bary` as a weighted
KL projection problem {cite:p}`2015-benamou-cisc`:

```{math}
:label: eq-bary-entropy-couplings
\min_{(P_s)_s}
\epsilon\sum_s\lambda_s
\operatorname{KL}(P_s\mid K_s)
```

subject to

```{math}
P_s^\top\mathbf 1_n=b_s
\quad\text{for all }s,
\qquad
P_1\mathbf 1_{n_1}
=
\cdots
=
P_S\mathbf 1_{n_S}.
```

Here $K_s\eqdef e^{-C_s/\epsilon}$. The barycenter $a$ is implicitly encoded
in the common row marginal

```{math}
a=P_1\mathbf 1_{n_1}=\cdots=P_S\mathbf 1_{n_S}.
```

The optimal couplings have scaling form

```{math}
:label: eq-bary-opt
P_s=\diag(u_s)K_s\diag(v_s),
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

:::{admonition} Proposition: Dual of Entropic Barycenters
:class: important
The optimal scalings in {eq}`eq-bary-opt` can be written as
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
\min_{(P_s)_s,a}
\max_{(f_s,g_s)_s}
\sum_s\lambda_s
\left(
\epsilon\operatorname{KL}(P_s\mid K_s)
+
\dotp{a-P_s\mathbf 1_{n_s}}{f_s}
+
\dotp{b_s-P_s^\top\mathbf 1_n}{g_s}
\right).
```

Strong duality allows one to exchange the minimum and maximum. Minimizing with
respect to $a$ gives the constraint $\sum_s\lambda_s f_s=0$, and minimizing
with respect to $P_s$ gives the Legendre transform of
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

Dropping constants independent of the potentials gives the displayed dual.
Coordinate maximization in $g_s$ gives the $v_s$ update; block maximization in
all $(f_s)_s$ gives the common marginal update and then the $u_s$ update.
:::

Classical applications include two-dimensional image interpolation,
three-dimensional shape interpolation, and barycenters on surfaces where the
ground cost is the square of the geodesic distance {cite:p}`2015-solomon-siggraph`.

:::{admonition} Example: Two measures recover a Wasserstein geodesic
:class: ot4ml-example

For $S=2$, $c(x,y)=\norm{x-y}^2$ and weights $(1-t,t)$, the barycenter is the point at time $t$ on the Wasserstein geodesic between $\beta_0$ and $\beta_1$. If $T$ is the Brenier map from $\beta_0$ to $\beta_1$, this barycenter is $((1-t)\Id+tT)_\sharp\beta_0$, the McCann interpolation detailed in the geodesic-convexity section. If no Monge map is available, the same construction uses an optimal coupling $\pi$ and the interpolation map $(x,y)\mapsto(1-t)x+ty$, giving $((1-t)x+ty)_\sharp\pi$.
:::

:::{admonition} Example: Dirac inputs recover Fr\'echet means
:class: ot4ml-example

The barycenter problem generalizes the computation of barycenters of points $(x_s)_{s=1}^S \in \X^S$ to arbitrary measures. Indeed, if $\be_s=\de_{x_s}$ is a single Dirac mass, then a solution is $\de_{x^\star}$ where $x^\star$ is a Frechet mean of the points $(x_s)_s$.
:::

:::{admonition} Example: Gaussian inputs remain Gaussian
:class: ot4ml-example

The barycenter of Gaussian measures is Gaussian. In one dimension, it is obtained by averaging the means and the standard deviations, so the barycenter variance is the square of this averaged standard deviation. In higher dimensions, the covariance $\cov$ minimizes the Bures objective

```{math}
\cov \mapsto \sum_s \la_s \Bb(\cov,\cov_s)^2,
```

and equivalently solves the fixed-point equation

```{math}
\cov =
\sum_s \la_s
\pa{\cov^{1/2}\cov_s\cov^{1/2}}^{1/2}.
```

This is the covariance analogue of the usual Euclidean barycenter equation: the mean part averages linearly, while the covariance part averages through the Bures--Wasserstein geometry {cite:p}`alvarez2016fixed,bhatia2018bures`.
:::

:::{admonition} Algorithm: Gaussian barycenter fixed point
:class: ot4ml-algorithm

Given Gaussian inputs $\Gaussian(\mean_s,\cov_s)$ and weights $\la_s$, set the barycenter mean to

```{math}
\mean=\sum_s\la_s\mean_s .
```

Initialize a positive definite covariance $\cov^{(0)}$. At iteration $k$, compute

```{math}
S^{(k)}
=
\sum_s\la_s
\left((\cov^{(k)})^{1/2}\cov_s(\cov^{(k)})^{1/2}\right)^{1/2}
```

and update

```{math}
\cov^{(k+1)}
=
(\cov^{(k)})^{-1/2}
\left(S^{(k)}\right)^2
(\cov^{(k)})^{-1/2}.
```

At convergence, $\cov^{(k)}$ satisfies the Bures barycenter equation and $\Gaussian(\mean,\cov^{(k)})$ is the Gaussian Wasserstein barycenter.
:::

:::{admonition} Algorithm: Entropic barycenter Sinkhorn
:class: ot4ml-algorithm

Fix a barycenter support and kernels $\K_s=e^{-\C_s/\epsilon}$. Initialize $\uD_s^{(0)}\in\RR_{+,*}^n$ for all $s$. At iteration $k$, update each target scaling

```{math}
\vD_s^{(k+1)}
=
\frac{\b_s}{\transp{\K_s}\uD_s^{(k)}}.
```

Compute the current barycenter marginal by the weighted geometric mean

```{math}
\a^{(k+1)}
=
\prod_s \bigl(\K_s\vD_s^{(k+1)}\bigr)^{\lambda_s},
```

and update the source scalings

```{math}
\uD_s^{(k+1)}
=
\frac{\a^{(k+1)}}{\K_s\vD_s^{(k+1)}}.
```

Return $\a^{(k)}$ and $\P_s^{(k)}=\diag(\uD_s^{(k)})\K_s\diag(\vD_s^{(k)})$.
:::

## Multimarginal OT

Multi-marginal OT couples more than two measures at once. It is the natural
language for barycenters, matching with teams and several-body costs, but its
tensor dimension is the main computational obstacle.

### Definition and Basic Structure

The multi-marginal formulation replaces a coupling between two measures by a
joint distribution with several prescribed marginals. Given measures
$(\alpha_s)_{s=1}^S$ on spaces $(\X_s)_{s=1}^S$ and a cost
$c:\X_1\times\cdots\times\X_S\to\RR$, the problem reads

```{math}
\inf_{\pi\in\Couplings(\alpha_1,\ldots,\alpha_S)}
\int_{\X_1\times\cdots\times\X_S}
c(x_1,\ldots,x_S)\d\pi(x_1,\ldots,x_S),
```

where $\Couplings(\alpha_1,\ldots,\alpha_S)$ is the set of probability
measures whose $s$-th marginal is $\alpha_s$. This is still a linear program
in the discrete setting, but its ambient tensor has size $\prod_s n_s$.

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

:::{admonition} Corollary: Gaussian and Discrete Barycenters
:class: important
Quadratic Wasserstein barycenters of Gaussian measures are Gaussian. If the
input measures are discrete, then there exists a barycenter supported on the
set of weighted averages $\sum_s\lambda_s x_{s,i_s}$ of one support point from
each input. In particular, if the $s$-th input has $n_s$ atoms, a barycenter
exists with at most $\prod_s n_s$ atoms.
:::

:::{dropdown} Proof
Let the input Gaussians have means $m_s$ and covariances $\Sigma_s$. For any
candidate barycenter $\alpha$ with mean $m$ and covariance $\Sigma$,
Gelbrich's inequality gives

```{math}
\Wass_2^2(\alpha,\beta_s)
\geq
\norm{m-m_s}^2+\mathcal B(\Sigma,\Sigma_s)^2,
```

with equality for the Gaussian law with mean $m$ and covariance $\Sigma$.
Therefore the barycenter objective is bounded below by a function depending
only on $(m,\Sigma)$, and this lower bound is attained by the Gaussian measure
with the minimizing mean and covariance. For discrete inputs, any
multi-marginal optimizer is supported on the finite product of the input
supports, and $B$ maps this product to at most $\prod_s n_s$ points.
:::

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
that the $s$-th marginal is correct. The bottleneck is the tensor size
$\prod_s n_s$ in the discrete case. Practical barycenter solvers exploit
separability of the cost, low-rank structure, convolutional kernels, or a
fixed barycenter support.

:::{admonition} Algorithm: Multi-marginal Sinkhorn
:class: ot4ml-algorithm

For discrete marginals $\a_s\in\simplex_{n_s}$, define the tensor

```{math}
K_{i_1,\ldots,i_S}
=
\exp\!\left(-\frac{C_{i_1,\ldots,i_S}}{\epsilon}\right)
\prod_{s=1}^S(\a_s)_{i_s}.
```

Initialize positive scalings $u_s\in\RR_{+,*}^{n_s}$. The current coupling tensor is

```{math}
P_{i_1,\ldots,i_S}
=
K_{i_1,\ldots,i_S}\prod_{s=1}^S (u_s)_{i_s}.
```

Sweep over $s=1,\ldots,S$ and replace

```{math}
(u_s)_i
\leftarrow
\frac{(\a_s)_i}
{\displaystyle
\sum_{i_1,\ldots,i_{s-1},i_{s+1},\ldots,i_S}
K_{i_1,\ldots,i_{s-1},i,i_{s+1},\ldots,i_S}
\prod_{r\neq s}(u_r)_{i_r}}.
```

Repeat until all marginals match. The full tensor has size $\prod_s n_s$, so this direct procedure is only practical when additional structure avoids explicitly storing all entries.
:::

## Metric Learning and Inverse OT

This section points to inverse problems where the ground cost itself is
learned. Such problems are typically bilevel and non-convex, but OT provides
useful gradients with respect to the cost.

### Metric Learning and Derivatives of OT

OT is convex with respect to the measure and concave with respect to the cost.
Ground-metric learning was explicitly studied in {cite:p}`CuturiGroundMetric2014`,
and it connects to the broader metric-learning literature
{cite:p}`MAL-019,bellet2015metric`.

:::{admonition} Proposition: Derivative with Respect to the Cost
:class: important
In the discrete setting, assume that the optimal coupling for
$\mathcal L_C(a,b)$ is unique and denote it by $P^\star(C)$. Then
$C\mapsto\mathcal L_C(a,b)$ is differentiable at $C$ and

```{math}
\nabla_C\mathcal L_C(a,b)=P^\star(C).
```
:::

:::{dropdown} Proof
The value is the minimum of affine functions of $C$,

```{math}
\mathcal L_C(a,b)
=
\min_{P\in\mathbf U(a,b)}
\dotp{C}{P}.
```

The envelope theorem, or equivalently Danskin's theorem, states that the
subdifferential with respect to $C$ is the convex hull of the optimal
couplings. If the optimizer is unique, this subdifferential is the singleton
$\{P^\star(C)\}$, hence the value is differentiable with the displayed
gradient.
:::

Thus, if the cost is parameterized as $C_\theta$, gradients of losses
involving OT values are obtained by backpropagating through the inner product
$\dotp{P^\star(C_\theta)}{\partial_\theta C_\theta}$. The difficulty is not
differentiating a solved OT problem, but learning a cost for which the
resulting matching has the desired semantic behavior; this is a bilevel and
usually non-convex optimization problem.

:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("metric-learning-cost-deformation")
```

*Changing the ground metric changes the optimal coupling. The same red and
blue empirical measures are matched with
$c_A(x,y)=(x-y)^\top A(x-y)$ for the Euclidean metric and two increasingly
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
$\widehat\pi$ with marginals $(\alpha,\beta)$ and seeks a cost $c$ such that
$\widehat\pi$ is optimal for

```{math}
\inf_{\pi\in\Couplings(\alpha,\beta)}
\int c(x,y)\d\pi(x,y).
```

This is ill-posed without structure: adding potentials $u(x)+v(y)$ to a cost
does not change the set of optimal couplings, and many costs can rationalize
the same sparse plan.

A useful statistical methodology is to measure the suboptimality of the
observed plan through a Fenchel--Young loss. Write the score as $s=-c$ and
define the convex regularized prediction value

```{math}
G_\epsilon(s)
=
\sup_{\pi\in\Couplings(\alpha,\beta)}
\int s\d\pi
-
\epsilon\operatorname{KL}(\pi\mid\alpha\otimes\beta).
```

The Fenchel--Young loss

```{math}
\mathcal L_\epsilon(c;\widehat\pi)
=
G_\epsilon(-c)
+
G_\epsilon^*(\widehat\pi)
+
\int c\d\widehat\pi
```

is nonnegative by Fenchel's inequality and vanishes exactly when
$\widehat\pi\in\partial G_\epsilon(-c)$, i.e. when $\widehat\pi$ satisfies the
regularized optimality conditions for $c$. Entropic regularization is
important here because it makes the forward map smoother and provides
gradients with respect to $c$, at the price of a statistical bias
{cite:p}`andrade2025sharpened,peyre2026curvature`.

In practice, one restricts the cost to a finite-dimensional model class,
often affine:

```{math}
C_\theta=\sum_{r=1}^R\theta_r C^{(r)},
\qquad
\theta\in\Theta,
```

where $\Theta$ is convex and the matrices $C^{(r)}$ encode features, graph
distances or a Mahalanobis parameterization. This viewpoint appears in
low-rank and sparse inverse OT models
{cite:p}`dupuy2016estimating,andrade2024sparsistency` and in convex
formulations for learning OT costs from observed plans
{cite:p}`ma2020learning,peyre2026curvature`.

:::{admonition} Proposition: Convex Dual-Gap Formulation of Inverse OT
:class: important
Let $\widehat P\in\mathbf U(a,b)$ be an observed coupling and let
$C_\theta$ depend affinely on $\theta\in\Theta$, where $\Theta$ is convex.
The condition that $\widehat P$ is optimal for the cost $C_\theta$ is
equivalent to the existence of dual potentials $(f,g)$ such that

```{math}
f_i+g_j\leq (C_\theta)_{i,j}
\qquad\text{and}\qquad
\sum_{i,j}\widehat P_{i,j}
\big((C_\theta)_{i,j}-f_i-g_j\big)=0.
```

Consequently, for a convex regularizer $R$, the noisy inverse problem can be
relaxed as the convex program

```{math}
:label: eq-inverse-ot-convex
\min_{\theta\in\Theta,f,g}
R(\theta)
+
\lambda
\sum_{i,j}\widehat P_{i,j}
\big((C_\theta)_{i,j}-f_i-g_j\big)
```

subject to $f_i+g_j\leq(C_\theta)_{i,j}$ for all $i,j$.
:::

:::{dropdown} Proof
For a fixed cost $C_\theta$, Kantorovich duality gives

```{math}
\min_{P\in\mathbf U(a,b)}
\dotp{C_\theta}{P}
=
\max_{f_i+g_j\leq(C_\theta)_{i,j}}
\dotp{f}{a}+\dotp{g}{b}.
```

Since $\widehat P$ has marginals $(a,b)$, every dual feasible pair satisfies

```{math}
\dotp{C_\theta}{\widehat P}
-
\dotp{f}{a}
-
\dotp{g}{b}
=
\sum_{i,j}\widehat P_{i,j}
\big((C_\theta)_{i,j}-f_i-g_j\big)
\geq0.
```

This nonnegative quantity is exactly the primal-dual gap of $\widehat P$. It
vanishes if and only if $\widehat P$ reaches the dual value and is therefore
optimal. If $C_\theta$ is affine and $\Theta$ and $R$ are convex, the
constraints and objective in {eq}`eq-inverse-ot-convex` are convex.
:::

The formulation is useful because it avoids differentiating through a forward
OT solver: it learns a cost by making the observed plan satisfy complementary
slackness. In statistical settings, $\widehat P$ is only partially observed or
noisy, so one adds sparsity, low-rank, smoothness or metric constraints to
select a meaningful cost. For entropic OT, the optimality condition becomes
smoother:

```{math}
\widehat P_{i,j}
\approx
a_i b_j
\exp\!\left(
\frac{f_i+g_j-(C_\theta)_{i,j}}{\epsilon}
\right),
```

which leads to likelihood-based or KL-based convex objectives when
$C_\theta$ is affine, and connects inverse OT with generalized Sinkhorn
iterations and transport-regularized inverse problems
{cite:p}`karlsson2016generalized,ma2020learning`.

:::{admonition} Algorithm: Inverse OT by dual-gap fitting
:class: ot4ml-algorithm

Choose cost features $C^{(r)}$ and a convex parameter set $\Theta$, and write

```{math}
C_\theta=\sum_r\theta_r C^{(r)}.
```

Given an observed plan $\widehat P\in\CouplingsD(\a,\b)$, solve the convex dual-gap problem

```{math}
\min_{\theta\in\Theta,f,g}
R(\theta)+\lambda
\sum_{i,j}\widehat P_{i,j}\big((C_\theta)_{i,j}-f_i-g_j\big)
```

subject to $f_i+g_j\leq(C_\theta)_{i,j}$ for all $(i,j)$. The fitted cost is the one for which the observed plan has small complementary-slackness defect, with the regularizer $R$ selecting among non-identifiable costs.
:::

## Weak Optimal Transport

Weak OT relaxes the cost so that it depends on the conditional distribution
of destinations rather than only on pointwise pairs. It is useful when a
source point is allowed to choose a randomized response and the model only
penalizes an aggregate of that response, such as its conditional mean.

### Barycentric Projection of a Coupling

The first object to isolate is the map obtained by collapsing each
conditional law to its barycenter.

:::{admonition} Definition: Barycentric Projection of a Coupling
:class: important
Let $\alpha,\beta\in\mathcal P_2(\RR^d)$ and let
$\pi\in\Couplings(\alpha,\beta)$. Disintegrate $\pi$ with respect to its first
marginal as $\pi(\d x,\d y)=\pi_x(\d y)\alpha(\d x)$. The barycentric
projection of $\pi$ is the map

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
$\bar T_\pi=T$ and $\bar\beta_\pi=\beta$. This projection is not an optimal
map for an arbitrary coupling: a deterministic rotation of a radially
symmetric source, for example, projects to the rotation itself, whereas the
optimal map from the source to itself is the identity. The useful positive
statement is attached to quadratic optimal plans, as in the tangent-space
viewpoint on $\Wass_2$ developed by Ambrosio, Gigli and Savare
{cite:p}`ambrosio2006gradient`.

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

Weak transport costs use the same disintegration but allow the objective to
depend on the whole conditional law, or on summaries such as the barycentric
projection {eq}`eq-barycentric-projection`. The framework was introduced
through general transport costs and weak transport inequalities, with
existence, duality and optimality conditions developed on Polish spaces
{cite:p}`gozlan2017kantorovich,backhoff2019weak`. For a weak cost
$C:\X\times\mathcal P(\Y)\to\RR\cup\{+\infty\}$, the weak OT value is

```{math}
:label: eq-weak-ot
\mathcal W_C(\alpha,\beta)
\eqdef
\inf_{\pi\in\Couplings(\alpha,\beta)}
\int C(x,\pi_x)\d\alpha(x).
```

The classical Kantorovich problem is recovered when
$C(x,\nu)=\int c(x,y)\d\nu(y)$, because the objective then becomes
$\int c(x,y)\d\pi(x,y)$. The genuinely weak behavior starts when $C$ is
nonlinear in $\nu$.

:::{admonition} Proposition: Weak Kantorovich Duality
:class: important
Assume that $\X,\Y$ are compact metric spaces and that $C(x,\nu)$ is lower
semicontinuous, bounded from below and convex in $\nu$, with the standard
qualification assumptions ensuring Fenchel--Rockafellar duality. For
$g\in\mathcal C(\Y)$ define the weak $C$-transform

```{math}
g^C(x)
\eqdef
\inf_{\nu\in\mathcal P(\Y)}
\left\{
C(x,\nu)-\int g(y)\d\nu(y)
\right\}.
```

Then

```{math}
\mathcal W_C(\alpha,\beta)
=
\sup_{g\in\mathcal C(\Y)}
\left\{
\int g^C(x)\d\alpha(x)
+
\int g(y)\d\beta(y)
\right\}.
```

When $C(x,\nu)=\int c(x,y)\d\nu(y)$, this reduces to the usual Kantorovich
dual with $g^C(x)=\inf_y(c(x,y)-g(y))$.
:::

:::{dropdown} Proof
For any coupling $\pi$ and any $g\in\mathcal C(\Y)$, the definition of
$g^C$ gives

```{math}
C(x,\pi_x)
\geq
g^C(x)
+
\int g(y)\d\pi_x(y).
```

After integration with respect to $\alpha$, the second term becomes
$\int g\d\beta$ because the second marginal of $\pi$ is $\beta$. This proves
weak duality.

For the reverse inequality, consider the convex minimization over probability
kernels $x\mapsto\pi_x$ with the affine constraint
$\int \pi_x\d\alpha(x)=\beta$. Fenchel--Rockafellar duality gives a
continuous Lagrange multiplier $g$ for this marginal constraint. Minimizing
the Lagrangian over each conditional law gives exactly the pointwise term
$g^C(x)$, while the multiplier contributes $\int g\d\beta$. The compactness,
lower semicontinuity, convexity and qualification assumptions ensure no
duality gap.
:::

:::{admonition} Proposition: Barycentric Weak Transport Is Weaker than $\Wass_2$
:class: important
Let $\alpha,\beta\in\mathcal P_2(\RR^d)$ and define

```{math}
C_{\mathrm{bar}}(x,\nu)
=
\norm{x-\int y\d\nu(y)}^2.
```

Equivalently, for a coupling $\pi$, the integrand is
$\norm{x-\bar T_\pi(x)}^2$. Then

```{math}
\mathcal W_{C_{\mathrm{bar}}}(\alpha,\beta)
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

:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("weak-ot-barycentric-projection")
```

*Weak barycentric transport on a small disk-to-annulus coupling. The left
panel shows the full conditional laws: each red source atom splits its mass
among several blue target atoms, with segment thickness proportional to
transported mass. The right panel collapses each conditional law $\pi_x$ to
its barycenter $\bar T_\pi(x)=\int y\d\pi_x(y)$, shown in violet. The
barycentric weak cost only sees the red-to-violet displacement, and therefore
ignores the conditional spread around each barycenter.*
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
and ignores the conditional variance around this barycenter. This connects
weak OT with martingale transport, Strassen-type convex-order constraints,
barycentric projections and learning problems where conditional averages are
meaningful objects.
