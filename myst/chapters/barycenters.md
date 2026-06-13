---
title: "Barycenters"
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---

Barycenters average probability measures. They extend the Frechet mean of
points to the Wasserstein space, where the average is not obtained by adding
densities pointwise, but by searching for the measure that minimizes a
weighted sum of transport costs.

This chapter moves through the three cases where the structure is most
transparent: quantiles on the line, covariance matrices for Gaussian laws, and
fixed-support histograms. The accompanying controls vary the barycentric
weights and show how the same definition produces linear quantile averages,
nonlinear Bures covariance averages, and entropic Sinkhorn scalings.

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

## Frechet Mean over the Wasserstein Space

The Wasserstein barycenter problem was introduced by Carlier, Ekeland and
coauthors, following earlier matching ideas {cite:p}`Carlier_wasserstein_barycenter,carlierekelandmatching`.
For the quadratic cost on $\RR^d$, they proved uniqueness when at least one
input measure has a density with respect to Lebesgue measure, and more
generally under the hypotheses that guarantee a Monge map.

Given input measures $(\beta_s)_{s=1}^S$ on a space $\X$, and weights
$\lambda_s\geq0$ with $\sum_s\lambda_s=1$, the barycenter problem is

```{math}
:label: eq-barycenter-generic-standalone
\min_{\alpha\in\mathcal M_+^1(\X)}
\sum_{s=1}^S
\lambda_s\,\mathcal L_c(\alpha,\beta_s).
```

For $\X=\RR^d$ and $c(x,y)=\norm{x-y}^2$, the barycenter is unique if one of
the input measures has a density {cite:p}`Carlier_wasserstein_barycenter`.
This problem generalizes the ordinary Frechet mean of points. If
$\beta_s=\delta_{x_s}$ is a Dirac mass, then a solution is
$\delta_{x^\star}$, where $x^\star$ is a Frechet mean of the points
$(x_s)_s$.

For the quadratic cost, the mean of a barycenter $\alpha^\star$ is
necessarily the barycenter of the input means:

```{math}
\int_\X x\,\d\alpha^\star(x)
=
\sum_s\lambda_s\int_\X x\,\d\beta_s(x).
```

The support of $\alpha^\star$ is contained in the convex hull of the supports
of the input measures. The consistency of discrete approximations to
{eq}`eq-barycenter-generic-standalone` is studied in
{cite:p}`Carlier-NumericsBarycenters`. One may also rewrite the same problem
as a multi-marginal optimal transport problem, where the barycenter point is
the weighted average of one point sampled from each marginal.

Existence follows from compactness and lower semicontinuity under the standard
assumptions used for the two-marginal problem. Dual formulations and
Monge-type characterizations can also be derived, but their structure is more
involved because the barycenter is itself an unknown measure.

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("barycenters-four-shapes", width=760)
```

Wasserstein barycenter grids for four corner measures. The left panel uses the
one-dimensional quantile formula for one Gaussian law and three asymmetric
two-Gaussian mixtures. The right panel computes entropic Wasserstein
barycenters on a common pixel grid for four silhouettes, with normalized
squared ground cost and a sharp regularization. Colors interpolate between
the corners and encode the same bilinear weights in both panels.

<iframe class="ot4ml-live-frame" title="Quantile barycenter controls" src="../live/ot-problems-barycenter.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

The live panel exposes the exact one-dimensional construction. The two weight
sliders move inside the square of corner laws, the quantile count controls the
resolution of the average, and the right panel reconstructs the resulting
barycenter density from the averaged quantiles.

## One-Dimensional Case

In one dimension, the barycenter has an explicit expression in terms of
quantile functions. If $c(x,y)=|x-y|^p$, then

```{math}
F_{\alpha^\star}^{-1}(t)
\in
\argmin_{x\in\RR}
\sum_{s=1}^S
\lambda_s
\abs{x-F_{\beta_s}^{-1}(t)}^p,
\qquad t\in[0,1].
```

For $p=2$, this pointwise minimizer is the weighted average of the input
quantiles:

```{math}
F_{\alpha^\star}^{-1}(t)
=
\sum_{s=1}^S
\lambda_sF_{\beta_s}^{-1}(t).
```

This formula is one of the rare cases where a Wasserstein barycenter can be
computed pointwise rather than by solving a high-dimensional optimization
problem.

## Gaussians Case

For $c(x,y)=\norm{x-y}^2$, the barycenter of Gaussian measures is Gaussian.
Its mean is the weighted average of the input means, while its covariance is
characterized by a fixed-point equation involving the Bures metric on
positive definite covariance matrices.

If $\beta_s=\Gaussian(m_s,\Sigma_s)$, then the barycenter has mean
$m=\sum_s\lambda_sm_s$. Its covariance $\Sigma$ is the Bures--Wasserstein
barycenter of the input covariances. In particular, $\Sigma$ minimizes

```{math}
\Sigma\mapsto
\sum_s\lambda_s\mathcal B(\Sigma,\Sigma_s)^2,
```

and satisfies the fixed-point equation

```{math}
\Sigma
=
\sum_s\lambda_s
\left(\Sigma^{1/2}\Sigma_s\Sigma^{1/2}\right)^{1/2}.
```

In one dimension, this reduces to linear averaging of standard deviations
rather than variances.

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("barycenters-gaussian-covariances", width=760)
```

Bures--Wasserstein barycenters of centered Gaussian covariance matrices. Each
panel shows a $5\times5$ grid of barycenter ellipses for four corner
covariances. The right grid uses more anisotropic inputs, making the nonlinear
rotation and scaling of covariance barycenters more visible.

<iframe class="ot4ml-live-frame" title="Gaussian barycenter controls" src="../live/ot-problems-gaussian-barycenter.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

The live Gaussian panel compares the Bures covariance barycenter with the
plain Euclidean covariance average under the same weights. The violet ellipse
is the Wasserstein barycenter; the gray ellipse is what one would obtain by
averaging matrix entries. The gap is most visible for rotated, anisotropic
covariances.

## Discrete Barycenters

Given input histograms $\{b_s\}_{s=1}^S$, with
$b_s\in\simplex_{n_s}$, and weights $\lambda\in\simplex_S$, a Wasserstein
barycenter with a prescribed support of size $n$ is computed by minimizing

```{math}
:label: eq-wass-discr-standalone
\min_{a\in\simplex_n}
\sum_{s=1}^S
\lambda_s\mathcal L_{C_s}(a,b_s),
```

where the cost matrices $C_s\in\RR^{n\times n_s}$ must be specified. In an
Eulerian setup all barycenters and input histograms live on the same grid:
$n_s=n$ and $C_s=C=d^p$, so that one solves

```{math}
\min_{a\in\simplex_n}
\sum_{s=1}^S
\lambda_s\Wass_p^p(a,b_s).
```

The fixed-support histogram problem is a linear program. One can optimize over
the barycenter $a$ and over $S$ couplings $P_s$ between the barycenter and each
input:

```{math}
\min_{a\in\simplex_n,\; P_s\in\RR^{n\times n_s}}
\sum_{s=1}^S
\lambda_s\dotp{P_s}{C_s}
```

subject to

```{math}
P_s\mathbf 1_{n_s}=a,
\qquad
P_s^\top\mathbf 1_n=b_s
\qquad
\text{for all }s.
```

Although this is an LP, its scale prevents generic solvers from being used on
medium-sized grids. One can instead use first-order methods such as subgradient
descent on the dual {cite:p}`Carlier-NumericsBarycenters`, or the entropic
methods described next.

## Sinkhorn for Barycenters

A key difference with the regularized two-marginal OT problem is that there is
no canonical reference measure $\alpha\otimes\beta$, because the barycenter
$\alpha$ is unknown. One can nevertheless use entropic smoothing and
approximate {eq}`eq-wass-discr-standalone` by

```{math}
:label: eq-entropic-bary-standalone
\min_{a\in\simplex_n}
\sum_{s=1}^S
\lambda_s\mathcal L_{C_s}^{\epsilon}(a,b_s),
```

for $\epsilon>0$. This smooth convex minimization problem can be tackled with
gradient descent {cite:p}`CuturiBarycenter`, or by quasi-Newton descent on the
semi-dual when extra regularization on the barycenter is desired
{cite:p}`2016-Cuturi-siims`.

A simple and effective approach rewrites {eq}`eq-entropic-bary-standalone` as
a weighted KL projection problem {cite:p}`2015-benamou-cisc`:

```{math}
:label: eq-bary-entropy-couplings-standalone
\min_{(P_s)_s}
\epsilon\sum_s\lambda_s\operatorname{KL}(P_s\mid K_s)
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
P_S\mathbf 1_{n_S},
```

where $K_s\eqdef e^{-C_s/\epsilon}$. The barycenter $a$ is implicitly encoded
as the common row marginal

```{math}
a=P_1\mathbf 1_{n_1}=\cdots=P_S\mathbf 1_{n_S}.
```

The optimal couplings have scaling form

```{math}
:label: eq-bary-opt-standalone
P_s=\diag(u_s)K_s\diag(v_s),
```

and the generalized Sinkhorn updates are

```{math}
v_s\leftarrow \frac{b_s}{K_s^\top u_s},
\qquad
a\leftarrow\prod_s(K_sv_s)^{\lambda_s},
\qquad
u_s\leftarrow\frac{a}{K_sv_s}.
```

The geometric mean update enforces the common barycenter marginal shared by
all couplings.

:::{admonition} Proposition: Dual of Entropic Barycenters
:class: important
The optimal scalings in {eq}`eq-bary-opt-standalone` can be written as
$(u_s,v_s)=(e^{f_s/\epsilon},e^{g_s/\epsilon})$, where $(f_s,g_s)_s$ solve

```{math}
:label: eq-dual-bary-entropy-standalone
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
Introduce Lagrange multipliers in
{eq}`eq-bary-entropy-couplings-standalone`:

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

Strong duality allows one to exchange the minimum and maximum. Minimizing
with respect to $a$ gives the constraint $\sum_s\lambda_s f_s=0$; minimizing
with respect to $P_s$ gives the Legendre transform of
$\operatorname{KL}(\cdot\mid K_s)$:

```{math}
\max_{(f_s,g_s)_s}
\sum_s\lambda_s
\left[
\dotp{g_s}{b_s}
-
\epsilon
\operatorname{KL}^\star
\left(
\frac{f_s\oplus g_s}{\epsilon}
\middle| K_s
\right)
\right],
\qquad
\sum_s\lambda_s f_s=0.
```

The separable conjugate is

```{math}
\operatorname{KL}^\star(U\mid K)
=
\sum_{i,j}K_{i,j}(e^{U_{i,j}}-1).
```

Indeed, for $k>0$,

```{math}
\sup_{r\geq0}
\left[
ur-\left(r\log(r/k)-r+k\right)
\right]
=
k(e^u-1),
```

because the optimality condition is $u=\log(r/k)$. The case $k=0$ follows by
lower semicontinuity.
:::

Minimizing {eq}`eq-dual-bary-entropy-standalone` with respect to each $g_s$,
while keeping all other variables fixed, gives the $v_s$ update. Minimizing
with respect to all the $(f_s)_s$ gives the geometric-mean update for $a$ and
then the $u_s$ update.

Classical applications include two-dimensional image interpolation,
three-dimensional shape interpolation, and barycenters on surfaces where the
ground cost is the squared geodesic distance. See
{cite:p}`2015-solomon-siggraph` for applications in computer graphics and
imaging sciences.
