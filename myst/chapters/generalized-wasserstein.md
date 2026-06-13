---
title: "Generalized Wasserstein Distances"
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-extensions)=

The first family of extensions keeps the idea of a distance between measures,
but changes the geometry used to compare them. The variants in this chapter
relax mass conservation, reduce high-dimensional transport to
one-dimensional projections, or replace the trace quadratic cost by spectral
gauges and robust projected viewpoints.

These constructions are useful when the standard distance $\Wass_p$ is too
rigid or too expensive. They preserve much of the metric intuition of optimal
transport, but expose new controls: how expensive it is to delete mass, which
projections should be trusted, and which directions of displacement should be
penalized.

:::{admonition} Guiding Comparison
:class: tip
Balanced Wasserstein fixes the marginals exactly. Unbalanced OT relaxes the
marginals. Sliced OT compares many one-dimensional shadows. Linear OT embeds
measures through maps from a fixed reference. Spectral OT changes the scalar
quadratic cost into a gauge of the whole displacement covariance.
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

(sec-unbalanced)=
## Unbalanced OT

Unbalanced OT allows mass creation and destruction by penalizing marginal
mismatch. It is essential when histograms are not normalized, when
observations contain outliers, or when only part of the source should match
the target {cite:p}`LieroMielkeSavareLong,2015-chizat-unbalanced,2017-chizat-focm`.

### Relaxed Formulation

For nonnegative measures
$(\alpha,\beta)\in\mathcal M_+(\X)\times\mathcal M_+(\Y)$, a generic relaxed
formulation is

```{math}
:label: eq-unbalanced-primal
\mathsf{UW}_c(\alpha,\beta)
=
\inf_{\pi\in\mathcal M_+(\X\times\Y)}
\int_{\X\times\Y} c(x,y)\d\pi(x,y)
+
\mathcal D_{\psi_1}(\pi_1\mid\alpha)
+
\mathcal D_{\psi_2}(\pi_2\mid\beta),
```

where $\psi_1,\psi_2$ are convex entropy functions. Exact conservation
$(\pi_1,\pi_2)=(\alpha,\beta)$ is replaced by a cost for changing the
marginals. Writing $\psi_s=\tau\bar\psi_s$ exposes the relaxation scale:

```{math}
\mathsf{UW}_{c,\tau}(\alpha,\beta)
=
\inf_{\pi\geq0}
\int c\d\pi
+
\tau\mathcal D_{\bar\psi_1}(\pi_1\mid\alpha)
+
\tau\mathcal D_{\bar\psi_2}(\pi_2\mid\beta).
```

Large $\tau$ makes marginal mismatch expensive and approaches balanced OT when
the total masses are compatible. Small $\tau$ makes creation and destruction
cheap; after rescaling by $\tau$, the zero-transport part reveals the pure
divergence geometry.

:::{admonition} Proposition: Small-Transport-Scale Limit
:class: important
Assume that $\alpha,\beta$ are finite measures on a compact metric space
$\X$, that $c$ is continuous, $c\geq0$, and $c(x,y)=0$ if and only if $x=y$.
Assume also that the marginal divergences are nonnegative, weak-* lower
semicontinuous, and have weak-* compact sublevel sets on $\mathcal M_+(\X)$.
Then

```{math}
\lim_{\tau\downarrow0}
\frac{1}{\tau}\mathsf{UW}_{c,\tau}(\alpha,\beta)
=
\inf_{\rho\in\mathcal M_+(\X)}
\mathcal D_{\bar\psi_1}(\rho\mid\alpha)
+
\mathcal D_{\bar\psi_2}(\rho\mid\beta).
```

The right-hand side is the infimal gluing divergence obtained by matching the
two measures through a common zero-transport marginal $\rho$. In the dominated
case, if $\alpha=a\lambda$, $\beta=b\lambda$, and $\rho=r\lambda$, this
decouples pointwise:

```{math}
\int \mathfrak m_{\bar\psi_1,\bar\psi_2}(a(x),b(x))\d\lambda(x),
\qquad
\mathfrak m_{\bar\psi_1,\bar\psi_2}(a,b)
\eqdef
\inf_{r\geq0}
a\,\bar\psi_1(r/a)+b\,\bar\psi_2(r/b),
```

with the usual recession conventions when $a=0$ or $b=0$. For KL marginal
penalties,

```{math}
\inf_{\rho\in\mathcal M_+(\X)}
\operatorname{KL}(\rho\mid\alpha)
+
\operatorname{KL}(\rho\mid\beta)
=
\int (\sqrt a-\sqrt b)^2\d\lambda .
```

Thus KL marginal relaxation contains the squared Hellinger distance as its
local mass-variation limit.
:::

:::{dropdown} Proof
For the upper bound, restrict to diagonal plans
$\pi=(\Id,\Id)_\sharp\rho$, whose transport cost is zero and whose two
marginals are both $\rho$. This gives the desired upper bound after
optimizing over $\rho$.

For the lower bound, let $\tau_n\downarrow0$ and let $\pi_n$ be almost
minimizing plans with bounded scaled values
$\tau_n^{-1}\mathsf{UW}_{c,\tau_n}(\alpha,\beta)$. Since the divergences are
nonnegative, $\int c\d\pi_n=O(\tau_n)$, hence $\int c\d\pi_n\to0$. The
bounded scaled values also put the two marginals in compact divergence
sublevel sets. Since a coupling has the same total mass as each marginal, the
couplings are tight on $\X\times\X$. Up to subsequences,
$\pi_n\rightharpoonup\pi_0$.

Lower semicontinuity of the transport cost yields $\int c\d\pi_0=0$, so
$\pi_0$ is concentrated on the diagonal. Its two marginals are therefore equal
to a common measure $\rho$. Lower semicontinuity of the marginal divergences
gives

```{math}
\liminf_n
\frac{1}{\tau_n}
\mathsf{UW}_{c,\tau_n}(\alpha,\beta)
\geq
\mathcal D_{\bar\psi_1}(\rho\mid\alpha)
+
\mathcal D_{\bar\psi_2}(\rho\mid\beta),
```

and optimizing over $\rho$ gives the lower bound.

In the dominated case, the minimization over $\rho=r\lambda$ decouples into
the scalar envelope $\mathfrak m_{\bar\psi_1,\bar\psi_2}$. For KL, no
singular part is admissible when $\alpha$ and $\beta$ are dominated by
$\lambda$. The pointwise objective is
$r\log(r/a)-r+a+r\log(r/b)-r+b$. Its optimality condition is
$\log(r/a)+\log(r/b)=0$, hence $r=\sqrt{ab}$, and the minimum is
$a+b-2\sqrt{ab}=(\sqrt a-\sqrt b)^2$.
:::

(prop-dual-unbalanced-ot)=
:::{admonition} Proposition: Dual of Unbalanced Optimal Transport
:class: important
Under the usual Fenchel--Rockafellar qualification assumptions, the relaxed
primal value in {eq}`eq-unbalanced-primal` equals

```{math}
\mathsf{UW}_c(\alpha,\beta)
=
\sup_{f\oplus g\leq c}
-
\mathcal D_{\psi_1}^*(-f\mid\alpha)
-
\mathcal D_{\psi_2}^*(-g\mid\beta).
```
:::

:::{dropdown} Proof
Use the variational formula for the dual of a divergence and introduce the
marginal variables through continuous potentials:

```{math}
\inf_{\pi\geq0}\sup_{f,g}
\int c\d\pi
+
\int -f\d\pi_1
+
\int -g\d\pi_2
-
\mathcal D_{\psi_1}^*(-f\mid\alpha)
-
\mathcal D_{\psi_2}^*(-g\mid\beta).
```

Exchanging the infimum and supremum gives

```{math}
\sup_{f,g}
-
\mathcal D_{\psi_1}^*(-f\mid\alpha)
-
\mathcal D_{\psi_2}^*(-g\mid\beta)
+
\inf_{\pi\geq0}
\int \big(c-(f\oplus g)\big)\d\pi .
```

The last infimum is $0$ when $f\oplus g\leq c$ and $-\infty$ otherwise.
:::

### Reverse and Homogeneous Formulations

The Liero--Mielke--Savare formulation rewrites marginal penalties as a local
transport cost and then homogenizes it. Assuming first that the reference
measures and transported marginals have mutually absolutely continuous parts,
one can factor the objective as

```{math}
\begin{aligned}
&\int c(x,y)\d\pi(x,y)
+
\mathcal D_{\psi_1}(\pi_1\mid\alpha)
+
\mathcal D_{\psi_2}(\pi_2\mid\beta) \\
&\quad =
\int
\left(
c(x,y)
+
\psi_1\!\left(\frac{\d\pi_1}{\d\alpha}(x)\right)
\frac{\d\alpha}{\d\pi_1}(x)
+
\psi_2\!\left(\frac{\d\pi_2}{\d\beta}(y)\right)
\frac{\d\beta}{\d\pi_2}(y)
\right)
\d\pi(x,y).
\end{aligned}
```

This motivates the local reverse cost

```{math}
:label: eq-unbalanced-reverse-local-cost
L_c(r,s)
\eqdef
c+r\psi_1(1/r)+s\psi_2(1/s),
```

with the usual recession convention at $r=0$ or $s=0$. If
$\alpha=F\pi_1+\alpha^\perp$ and $\beta=G\pi_2+\beta^\perp$ are the Lebesgue
decompositions of the reference marginals with respect to the transported
marginals, then

```{math}
\mathsf{UW}_c(\alpha,\beta)
=
\inf_{\pi\geq0}
\int L_{c(x,y)}(F(x),G(y))\d\pi(x,y)
+
\psi_1(0)\alpha^\perp(\X)
+
\psi_2(0)\beta^\perp(\Y).
```

The homogeneous formulation is obtained by taking the perspective transform
of $L_c$,

```{math}
:label: eq-unbalanced-homogeneous-local-cost
H_c(r,s)
\eqdef
\inf_{\theta>0}
\theta L_c(r/\theta,s/\theta),
```

which is positively $1$-homogeneous. It defines

```{math}
:label: eq-homogeneous
\mathsf{HW}_c(\alpha,\beta)
=
\inf_{\pi\geq0}
\int H_{c(x,y)}(F(x),G(y))\d\pi(x,y)
+
\psi_1(0)\alpha^\perp(\X)
+
\psi_2(0)\beta^\perp(\Y).
```

:::{admonition} Proposition: Homogenization Does Not Change the Cost
:class: important
One has

```{math}
\mathsf{HW}_c(\alpha,\beta)=\mathsf{UW}_c(\alpha,\beta).
```
:::

:::{dropdown} Proof
The inequality $\mathsf{HW}\leq\mathsf{UW}$ follows from $H_c\leq L_c$ by
taking $\theta=1$. Conversely, take a feasible measure $\pi$ in the
homogeneous formulation. By definition of the perspective transform, for
every $(x,y)$ and every $\eta>0$ there exists a scale $\theta(x,y)>0$ such
that

```{math}
H_{c(x,y)}(F(x),G(y))+\eta
\geq
\theta(x,y)
L_{c(x,y)}
\big(F(x)/\theta(x,y),G(y)/\theta(x,y)\big).
```

Replacing $\pi$ by the rescaled measure $\tilde\pi=\theta\pi$ and the
densities by $F/\theta$ and $G/\theta$ gives an admissible competitor for the
reverse formulation with cost no larger than the homogeneous cost plus
$\eta\pi(\X\times\Y)$. Letting $\eta\to0$ yields
$\mathsf{UW}\leq\mathsf{HW}$. The singular terms are unchanged because the
same rescaling is performed before taking the Lebesgue decomposition of the
marginals.
:::

### Conic Lifting

Assume now that $\X=\Y$ and $\psi_1=\psi_2=\psi$. The homogeneous formulation
lifts the problem to the cone space
$\mathfrak C[\X]\eqdef(\X\times\RR_+)/\sim$, where all points $(x,0)$ are
identified at the apex. For an exponent $p\geq1$, define

```{math}
\mathsf D((x,r),(y,s))
\eqdef
H_{c(x,y)}(r^p,s^p)^{1/p}.
```

Several classical unbalanced geometries are obtained by choosing $\psi$, $c$
and $p$ so that $\mathsf D$ is a distance on the cone:

- $\mathcal D_\psi=\operatorname{KL}$, $p=2$, and
  $c(x,y)=-\log\cos^2(d(x,y)\wedge\pi/2)$ give the
  Hellinger--Kantorovich or Wasserstein--Fisher--Rao cone metric

```{math}
\mathsf D((x,r),(y,s))^2
=
r^2+s^2-2rs\cos(d(x,y)\wedge\pi/2).
```

- $\mathcal D_\psi=\operatorname{KL}$, $p=2$, and $c(x,y)=d(x,y)^2$ give the
  Gaussian Hellinger cone metric

```{math}
\mathsf D((x,r),(y,s))^2
=
r^2+s^2-2rs e^{-d(x,y)^2/2}.
```

- $\mathcal D_\psi=\TV$, $p=1$, and $c(x,y)=d(x,y)$ give the partial-transport
  cone cost

```{math}
\mathsf D((x,r),(y,s))
=
r+s-(r\wedge s)(2-d(x,y))_+.
```

The corresponding cone value is

```{math}
\mathsf{CW}(\alpha,\beta)
=
\inf_{\gamma\in\mathcal M_+(\mathfrak C[\X]^2)}
\left\{
\int \mathsf D((x,r),(y,s))^p\d\gamma
\; ; \;
\int r^p\d\gamma_1(\cdot,r)=\alpha,\quad
\int s^p\d\gamma_2(\cdot,s)=\beta
\right\}.
```

(thm-cone-unbalanced-ot)=
:::{admonition} Theorem: Cone Formulation of Unbalanced OT
:class: important
One has $\mathsf{UW}=\mathsf{HW}=\mathsf{CW}$. If $\mathsf D$ is a distance,
then $\mathsf{CW}^{1/p}$ is a distance between nonnegative measures.
:::

:::{dropdown} Proof
The equality $\mathsf{UW}=\mathsf{HW}$ is the homogenization proposition. To
prove $\mathsf{HW}=\mathsf{CW}$, disintegrate an admissible cone coupling
$\gamma$ with respect to its spatial variables $(x,y)$ and radii $(r,s)$. The
cone marginal constraints say precisely that the spatial marginals are
recovered after weighting by $r^p$ and $s^p$. Since
$\mathsf D((x,r),(y,s))^p=H_{c(x,y)}(r^p,s^p)$, integrating the cone cost
gives the homogeneous objective. Conversely, any homogeneous competitor can be
lifted to the cone by placing, over each $(x,y)$, radii whose $p$th powers are
the two density factors appearing in $H_c$.

If $\mathsf D$ is a distance on the cone, then $\mathsf{CW}^{1/p}$ is the
usual $p$-Wasserstein distance between lifted measures under the linear
cone-marginal constraints. Symmetry and the triangle inequality follow from
the corresponding Wasserstein properties and the gluing lemma on the cone. If
the distance is zero, an optimal cone coupling is concentrated on the diagonal
of the cone, so the weighted projections agree and therefore $\alpha=\beta$.
:::

### Entropic KL Relaxation

A generic entropic regularization of unbalanced OT reads

```{math}
\inf_{\pi\in\mathcal M_+(\X\times\Y)}
\int c\d\pi
+
\mathcal D_{\psi_1}(\pi_1\mid\alpha)
+
\mathcal D_{\psi_2}(\pi_2\mid\beta)
+
\epsilon\mathcal D_\phi(\pi\mid\alpha\otimes\beta).
```

Its dual is

```{math}
\sup_{f,g}
-
\mathcal D_{\psi_1}^*(-f\mid\alpha)
-
\mathcal D_{\psi_2}^*(-g\mid\beta)
-
\epsilon\mathcal D_\phi^*
\left(\frac{f\oplus g-c}{\epsilon}\middle|\alpha\otimes\beta\right).
```

For $\mathcal D_\phi=\operatorname{KL}$, the primal-dual relation is
$\d\pi=e^{(f\oplus g-c)/\epsilon}\d\alpha\d\beta$. If in addition
$\mathcal D_{\psi_1}=\mathcal D_{\psi_2}=\tau\operatorname{KL}$, coordinate
maximization gives the damped soft transforms

```{math}
\begin{aligned}
f(x)
&=
-
\frac{\tau\epsilon}{\tau+\epsilon}
\log\int_\Y
\exp\left(\frac{g(y)-c(x,y)}{\epsilon}\right)\d\beta(y),\\
g(y)
&=
-
\frac{\tau\epsilon}{\tau+\epsilon}
\log\int_\X
\exp\left(\frac{f(x)-c(x,y)}{\epsilon}\right)\d\alpha(x).
\end{aligned}
```

In the discrete case, with
$K_{i,j}=e^{-C_{i,j}/\epsilon}a_i b_j$ and
$\rho=\tau/(\tau+\epsilon)$, this gives the generalized Sinkhorn scaling

```{math}
u_i\leftarrow
\left(\frac{a_i}{(Kv)_i}\right)^\rho,
\qquad
v_j\leftarrow
\left(\frac{b_j}{(K^\top u)_j}\right)^\rho,
\qquad
P=\diag(u)K\diag(v).
```

The exponent $\rho<1$ is the visible difference with balanced Sinkhorn:
marginal corrections are damped because violating the marginals is allowed.

(fig:unbalanced-mass-relaxation)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("unbalanced-mass-relaxation")
```

*KL unbalanced OT on one-dimensional Gaussian-mixture densities. The central
matrix is the transported coupling. The side curves compare the prescribed
marginals with the transported marginals; increasing $\tau$ makes marginal
mismatch more expensive, so more mass is moved rather than created or
destroyed.*
:::

The interactive demo below exposes the two most important regularization scales.
Increasing $\tau$ pushes the transported marginals closer to the prescribed
ones; increasing $\epsilon$ spreads the coupling itself.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the deletion cost and regularization controls to see when unbalanced transport prefers moving mass, creating mass, or removing it.
:::

<iframe class="ot4ml-live-frame" title="Unbalanced Sinkhorn controls" src="../live/generalized-unbalanced.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

The entropy used in the marginal relaxation also changes the qualitative
behavior. A KL penalty leads to smooth multiplicative rescaling. The
reverse-KL, or Burg, penalty blows up when a transported marginal vanishes
where the prescribed marginal is positive, so it discourages complete deletion
of small modes. Total variation has a linear kink and behaves closer to
partial transport: mass is either kept active or created and destroyed at
nearly constant marginal price.

(fig:unbalanced-divergence-choice)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("unbalanced-divergence-choice")
```

*Effect of the marginal divergence in unbalanced entropic OT. The geometric
cost, entropic plan regularization $\epsilon$, and relaxation strength $\tau$
are fixed; only the marginal penalty changes. KL allows smooth mass
variation, Burg keeps transported marginals from vanishing on prescribed
modes, and total variation gives a sharper active-mass selection.*
:::

(alg:unbalanced-sinkhorn)=
:::{admonition} Algorithm: Unbalanced Sinkhorn scaling
:class: ot4ml-algorithm

**Input:** Weights $\a,\b$, cost matrix $\C$, entropic scale $\epsilon>0$, KL strength $\tau>0$.

**Output:** Unbalanced entropic coupling $\P$.

**Initialize:** Set
\(K_{ij}=e^{-\C_{ij}/\epsilon}\a_i\b_j, \qquad \rho=\frac{\tau}{\tau+\epsilon}, \qquad v^{(0)}=\ones_m.\)

**For** $k=0,1,\ldots$ **do**:

> \(u^{(k+1)} = \left(\frac{\a}{K v^{(k)}}\right)^\rho, \qquad v^{(k+1)} = \left(\frac{\b}{\transp{K}u^{(k+1)}}\right)^\rho.\)
>
> **If** scaling changes are below $\mathrm{tol}$ **then**:

>>
>> **Return**
>> \(\P^{(k+1)}=\diag(u^{(k+1)})K\diag(v^{(k+1)}).\)
>>
:::


(sec-sliced-wasserstein)=
## Sliced Wasserstein Distances

Sliced Wasserstein trades exact high-dimensional geometry for many
one-dimensional projections. It is cheap, differentiable after sorting, and
often effective in imaging and learning. For measures on $\RR^d$ and
$\theta\in\mathbb S^{d-1}$, let
$P_\theta(x)=\dotp{\theta}{x}$ be the projection on direction $\theta$.

(def-sliced-wasserstein)=
:::{admonition} Definition: Sliced Wasserstein Distance
:class: important
Let $\sigma$ be the uniform probability measure on the sphere
$\mathbb S^{d-1}$. The sliced $p$-Wasserstein distance is

```{math}
:label: eq-sliced-wasserstein
\operatorname{SW}_p(\alpha,\beta)^p
\eqdef
\int_{\mathbb S^{d-1}}
\Wass_p\big((P_\theta)_\sharp\alpha,(P_\theta)_\sharp\beta\big)^p
\d\sigma(\theta).
```
:::

This construction is closely related to the Radon transform and is much
cheaper to approximate numerically than high-dimensional OT, since each
projected problem can be solved by sorting or quantiles
{cite:p}`rabin-ssvm-11,2013-Bonneel-barycenter,kolouri2016sliced`. It
metrizes the same weak-plus-moment topology as $\Wass_p$, but its geometry is
not bi-Lipschitz equivalent to $\Wass_p$ in high dimension
{cite:p}`nadjahi2019asymptotic`.

(fig:sliced-wasserstein-projections)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sliced-wasserstein-projections")
```

*Sliced Wasserstein projections between two planar densities. Fixed directions
are drawn on both densities, and the middle panels show smoothed
one-dimensional density estimates of the projected measures. Sliced OT
averages one-dimensional Wasserstein discrepancies over many such directions.*
:::

The interactive demo separates two uses of a slice: comparing projected measures and
lifting the sorted one-dimensional matching back to the plane. The lifted plan
is always feasible in the original space, but it need not be the quadratic
optimal plan.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the projection angle and number of directions to see how sliced Wasserstein distances reduce high-dimensional transport to one-dimensional matchings.
:::

<iframe class="ot4ml-live-frame" title="Sliced Wasserstein controls" src="../live/generalized-sliced.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

(prop-sliced-wasserstein-metric)=
:::{admonition} Proposition: Metric Properties of Sliced Wasserstein
:class: important
For $p\geq1$, $\operatorname{SW}_p$ is a distance on
$\mathcal P_p(\RR^d)$. Moreover, $\operatorname{SW}_p$ metrizes weak
convergence together with convergence of the $p$th moment. Finally,

```{math}
\operatorname{SW}_p(\alpha,\beta)\leq\Wass_p(\alpha,\beta),
```

and, for $p=2$ with the uniform probability measure on the sphere,

```{math}
\operatorname{SW}_2(\alpha,\beta)^2
\leq
\frac{1}{d}\Wass_2(\alpha,\beta)^2.
```
:::

:::{dropdown} Proof
Non-negativity and symmetry follow from the one-dimensional Wasserstein
distance. For the triangle inequality, apply the triangle inequality of
$\Wass_p$ for each direction $\theta$ and then Minkowski's inequality in
$L^p(\mathbb S^{d-1})$.

If $\operatorname{SW}_p(\alpha,\beta)=0$, then
$(P_\theta)_\sharp\alpha=(P_\theta)_\sharp\beta$ for almost every direction.
By continuity of characteristic functions this holds for all directions, and
the Cramer--Wold theorem implies $\alpha=\beta$.

The bound $\operatorname{SW}_p\leq\Wass_p$ follows because $P_\theta$ is
$1$-Lipschitz. For $p=2$, using any coupling $\pi$ between $\alpha$ and
$\beta$,

```{math}
\int_{\mathbb S^{d-1}}\int |\dotp{x-y}{\theta}|^2\d\pi(x,y)\d\sigma(\theta)
=
\frac{1}{d}\int \norm{x-y}^2\d\pi(x,y).
```

Optimizing over $\pi$ gives the sharper inequality. The weak-convergence
statement follows from the same Cramer--Wold mechanism plus the moment
condition.
:::

(rem-sliced-hilbert-embedding)=
:::{admonition} Remark: Hilbert embedding for $\SW_2$
:class: ot4ml-remark

In one dimension, $\Wass_2$ is the $L^2(0,1)$ distance between quantile functions. Hence

```{math}
\SW_2(\alpha,\beta)^2
=
\int_{\Sphere^{d-1}}\int_0^1
\abs{F_{\theta,\alpha}^{-1}(u)-F_{\theta,\beta}^{-1}(u)}^2
\d u\d\sigma(\theta),
```

where $F_{\theta,\alpha}^{-1}$ is the quantile of $(P_\theta)_\sharp\alpha$. Thus $\SW_2$ is a Hilbertian distance after embedding each measure into its field of projected quantiles. Consequently, $\exp(-\gamma\SW_2^2)$ is a positive definite kernel on probability measures for every $\gamma>0$.

Conversely, on compact sets, $\Wass_p$ can be bounded by a dimension-dependent power of $\SW_p$; such inequalities are weaker than the direct bound of Proposition {ref}`prop-sliced-wasserstein-metric` and explain why sliced distances metrize the same topology without being bi-Lipschitz equivalent to $\Wass_p$ in high dimension {cite:p}`bonnotte2013unidimensional,nadjahi2019asymptotic`.
:::


(def-sliced-variants)=
:::{admonition} Definition: Max-Sliced Wasserstein
:class: important
The max-sliced distance replaces the average over directions by the most
discriminating one:

```{math}
\operatorname{MaxSW}_p(\alpha,\beta)
\eqdef
\sup_{\theta\in\mathbb S^{d-1}}
\Wass_p((P_\theta)_\sharp\alpha,(P_\theta)_\sharp\beta).
```
:::

### Subspace-Sliced Variants

One-dimensional slices are extremely cheap, but they may discard too much
geometry in high dimension. A natural compromise is to project onto
$k$-dimensional subspaces: the projected OT problems remain lower
dimensional, while each projection retains correlations inside a small block
of coordinates.

(def-subspace-sliced-wasserstein)=
:::{admonition} Definition: Subspace-Sliced Wasserstein
:class: important
Fix $1\leq k\leq d$. Subspace-sliced variants replace one-dimensional lines by
$k$-dimensional orthogonal projections. If $U\in\RR^{d\times k}$ satisfies
$U^\top U=I_k$, then

```{math}
\operatorname{SW}_{p,k}(\alpha,\beta)^p
\eqdef
\int
\Wass_p((U^\top)_\sharp\alpha,(U^\top)_\sharp\beta)^p\d U,
```

where $\d U$ denotes the normalized invariant measure on the Stiefel manifold
$\operatorname{St}(d,k)=\{U\in\RR^{d\times k}:U^\top U=I_k\}$, and

```{math}
\operatorname{MaxSW}_{p,k}(\alpha,\beta)
\eqdef
\sup_{U^\top U=I_k}
\Wass_p((U^\top)_\sharp\alpha,(U^\top)_\sharp\beta).
```

The case $k=1$ recovers ordinary sliced and max-sliced Wasserstein, while
$k=d$ recovers the original Wasserstein distance.
:::

(prop-sliced-variant-bounds)=
:::{admonition} Proposition: Basic Bounds for Sliced Variants
:class: important
Let $p\geq1$ and let $\alpha,\beta\in\mathcal P_p(\RR^d)$. With normalized
spherical and Stiefel measures,

```{math}
\operatorname{SW}_p(\alpha,\beta)
\leq
\operatorname{MaxSW}_p(\alpha,\beta)
\leq
\Wass_p(\alpha,\beta).
```

For $k$-dimensional subspace projections,

```{math}
\operatorname{SW}_{p,k}(\alpha,\beta)
\leq
\operatorname{MaxSW}_{p,k}(\alpha,\beta)
\leq
\Wass_p(\alpha,\beta).
```
:::

:::{dropdown} Proof
The first inequality in each line follows because an $L^p$ average over a
probability space is bounded by the corresponding supremum. The second
inequality follows because orthogonal projections are $1$-Lipschitz: pushing
any admissible coupling between $\alpha$ and $\beta$ through a projection gives
an admissible coupling for the projected measures with no larger transport
cost. Optimizing over couplings and then averaging or maximizing over the
projection gives the result.
:::

### Min-Sliced Lifted Transport Plans

The preceding constructions define distances between projected measures. A
different use of slicing is to use a projection only as a device for building
a feasible high-dimensional transport plan. For equal-weight empirical
measures
$\alpha=n^{-1}\sum_i\delta_{x_i}$ and
$\beta=n^{-1}\sum_i\delta_{y_i}$, sort the projected samples
$\dotp{x_i}{\theta}$ and $\dotp{y_j}{\theta}$, and let $\sigma_\theta$ be the
monotone matching induced by this sorting. The lifted plan

```{math}
\pi_\theta
=
\frac{1}{n}\sum_{i=1}^n
\delta_{(x_i,y_{\sigma_\theta(i)})}
```

is a genuine coupling between $\alpha$ and $\beta$ in the original space.
Min-SWGG-type methods then choose the projection whose lifted plan has the
smallest full-dimensional quadratic cost:

```{math}
\operatorname{MSWGG}_2(\alpha,\beta)^2
\eqdef
\min_{\theta\in\mathbb S^{d-1}}
\int\norm{x-y}^2\d\pi_\theta(x,y).
```

This quantity is not a projected distance; it is a cheap feasible-plan
construction. Consequently,

```{math}
\Wass_2^2(\alpha,\beta)
\leq
\int\norm{x-y}^2\d\pi_\theta(x,y),
\qquad
\Wass_2^2(\alpha,\beta)
\leq
\operatorname{MSWGG}_2(\alpha,\beta)^2.
```

(fig:min-sliced-transport-plan)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("min-sliced-transport-plan")
```

*Lifted min-sliced plan. A one-dimensional direction is selected by a small
deterministic sweep, then red and blue atoms are sorted after projection and
matched in that order. The middle panel lifts this one-dimensional matching
back to the plane; it is a feasible coupling but not the same object as the
quadratic $W_2$ matching shown on the right.*
:::

(alg:monte-carlo-sliced-wasserstein)=
:::{admonition} Algorithm: Monte Carlo sliced Wasserstein
:class: ot4ml-algorithm

**Input:** Equal-weight point clouds $(x_i)_{i=1}^n$, $(y_i)_{i=1}^n$, exponent $p$, number of directions $L$.

**Output:** Monte Carlo estimate $\widehat{\SW}_p^p(\alpha,\beta)$.

**For** $\ell=1,\ldots,L$ **do**:

>
> **Sample** $\theta_\ell\sim\sigma$ on $\Sphere^{d-1}$.
>
> **Set** $s_i^\ell=\dotp{\theta_\ell}{x_i}$ and $t_i^\ell=\dotp{\theta_\ell}{y_i}$.
>
> **Let** $\sigma_\ell,\tau_\ell$ be stable sorting permutations:
> \(s_{\sigma_\ell(1)}^\ell\leq\cdots\leq s_{\sigma_\ell(n)}^\ell, \quad t_{\tau_\ell(1)}^\ell\leq\cdots\leq t_{\tau_\ell(n)}^\ell.\)
>
> **Compute**
> \(E_\ell=\frac1n\sum_{i=1}^n\abs{s_{\sigma_\ell(i)}^\ell-t_{\tau_\ell(i)}^\ell}^p.\)

**Return**
\(\widehat{\SW}_p^p(\alpha,\beta)=\frac1L\sum_{\ell=1}^L E_\ell.\)
:::

(alg:lifted-min-sliced-matching)=
:::{admonition} Algorithm: Lifted min-sliced matching
:class: ot4ml-algorithm

**Input:** Equal-weight point clouds $(x_i)_{i=1}^n$, $(y_i)_{i=1}^n$, finite direction set $\Theta\subset\Sphere^{d-1}$.

**Output:** Feasible coupling $\pi_{\theta^\star}$ induced by the selected projection direction.

**For** each $\theta\in\Theta$ **do**:

>
> **Let** $\sigma_\theta,\tau_\theta$ be stable sorting permutations of $\dotp{\theta}{x_i}$ and $\dotp{\theta}{y_j}$.
>
> **Match** $x_{\sigma_\theta(k)}$ to $y_{\tau_\theta(k)}$ for $k=1,\ldots,n$.
>
> **Store** rank-matching permutation $\rho_\theta=\tau_\theta\circ\sigma_\theta^{-1}$.
>
> **Evaluate**
> \(E(\theta)=\frac1n\sum_{i=1}^n\norm{x_i-y_{\rho_\theta(i)}}^2.\)

**Set** $\theta^\star=\min\argmin_{\theta\in\Theta}E(\theta)$ for the fixed order on $\Theta$.

**Return**
\(\pi_{\theta^\star}=\frac1n\sum_i\delta_{(x_i,y_{\rho_{\theta^\star}(i)})}.\)
:::


(sec-linear-ot)=
## Vector Quantiles and Linear Optimal Transport

Linear OT starts from the multivariate analogue of quantile coordinates. The
one-dimensional quantile function represents a probability measure by the
monotone map sending a fixed reference law to it; in dimension $d>1$,
Brenier's theorem gives the corresponding construction after choosing an
absolutely continuous reference probability $\rho$, typically the uniform law
on a convex body or a standard Gaussian.

### Vector Quantiles

Assume that $\rho$ is absolutely continuous. For a target law $\mu$ with
finite second moment, its vector quantile relative to $\rho$ is the Brenier
map

```{math}
T_\mu=\nabla\phi_\mu,
\qquad
(T_\mu)_\sharp\rho=\mu,
```

or equivalently the solution of

```{math}
\min_{T_\sharp\rho=\mu}
\int\norm{x-T(x)}^2\d\rho(x).
```

This construction is canonical only after fixing $\rho$: changing the
reference law changes the coordinates used to represent $\mu$. Vector
quantile regression uses the same idea conditionally, replacing scalar
conditional quantiles by conditional Brenier maps and thereby encoding
multivariate ranks and depths {cite:p}`carlier2016vector`.

### Linearized Wasserstein Coordinates

Linear OT replaces a nonlinear transport distance by a Hilbert norm between
reference maps. It is useful when one reference measure is fixed and many
nearby distributions must be compared cheaply. Let $T_\alpha$ be the Brenier
map pushing $\rho$ to $\alpha$, understood as an element of
$L^2(\rho;\RR^d)$ and hence defined only $\rho$-almost everywhere. The linear
OT embedding is

```{math}
:label: eq-lot-embedding
\alpha\mapsto T_\alpha-\Id\in L^2(\rho;\RR^d),
\qquad
\operatorname{LOT}_\rho(\alpha,\beta)
=
\norm{T_\alpha-T_\beta}_{L^2(\rho)}.
```

If one of the two targets equals the reference, the linearized distance is
exact: for instance,
$\operatorname{LOT}_\rho(\rho,\alpha)
=\norm{T_\alpha-\Id}_{L^2(\rho)}
=\Wass_2(\rho,\alpha)$. For two arbitrary targets, the coupling
$(T_\alpha,T_\beta)_\sharp\rho$ is admissible but not generally optimal, so
$\operatorname{LOT}_\rho$ is a tangent-space approximation of the Wasserstein
geometry {cite:p}`wang2013linear`.

For a family $(\alpha_s)_s$ with weights $(\lambda_s)_s$, the linearized
barycenter is obtained by averaging maps,

```{math}
\bar T=\sum_s\lambda_s T_{\alpha_s},
\qquad
\bar\alpha_{\operatorname{LOT}}=\bar T_\sharp\rho.
```

This is exact in one dimension, where quantile functions linearize
$\Wass_2$, and it is especially useful when many barycenters with changing
weights must be evaluated quickly.

(rem-three-hilbertian-measure-embeddings)=
:::{admonition} Remark: Three Hilbertian embeddings of measures
:class: ot4ml-remark

Several constructions in this text embed measures into Hilbert spaces, but they encode different geometries. Kernel mean embeddings send $\alpha$ to $\int k(x,\cdot)\d\alpha(x)$ in an RKHS and lead to MMD distances; see Section {ref}`sec-rkhs-mmd`. Quadratic sliced Wasserstein sends a measure to the collection of one-dimensional quantile functions of its projections, viewed in $L^2(\Sphere^{d-1}\times[0,1])$; see Section {ref}`sec-sliced-wasserstein`. Linear OT sends $\alpha$ to the displacement field $T_\alpha-\Id$ from a fixed reference $\rho$ in $L^2(\rho;\RR^d)$. The first construction is linear in the measure and depends on the kernel, the second is nonlinear but reduces OT to projected one-dimensional quantiles, and the third is a tangent approximation to the full Wasserstein geometry around a chosen reference.
:::


(fig:dualnorms-linear-ot-embedding)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("dualnorms-linear-ot-embedding")
```

*Linear OT coordinates. Fixing a reference measure $\rho$ turns each target
into a map $T_\alpha$ from $\rho$ to $\alpha$, or equivalently into the
displacement field $T_\alpha-\Id$. In one dimension this is exactly the
quantile parametrization of $\Wass_2$. In two dimensions, averaging the maps
gives the linearized barycenter, which is compared with the genuine McCann
midpoint.*
:::

The next control keeps the exact one-dimensional setting. The reference
density defines the coordinate system, the target maps are quantile maps from
that reference, and the barycenter is obtained by averaging those maps before
pushing the reference forward.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the reference and deformation controls to inspect how linear optimal transport embeds measures through maps from a fixed template.
:::

<iframe class="ot4ml-live-frame" title="Linear optimal transport controls" src="../live/generalized-linear-ot.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

(prop-linear-ot-stability)=
:::{admonition} Proposition: Local Stability of Linear OT
:class: important
Assume that the measures are supported on a fixed convex compact set, with
densities bounded above and below, and that the Brenier maps from $\rho$ are
regular. Then, for $\alpha,\beta$ in a sufficiently small regular
neighborhood of $\rho$,

```{math}
\Wass_2(\alpha,\beta)
\leq
\operatorname{LOT}_\rho(\alpha,\beta)
\qquad\text{and}\qquad
\operatorname{LOT}_\rho(\alpha,\beta)
\leq
C\Wass_2(\alpha,\beta)^\eta
```

for constants $C>0$ and $\eta\in(0,1]$ depending on regularity.
:::

:::{dropdown} Proof
The first inequality is immediate:
$(T_\alpha,T_\beta)_\sharp\rho$ is a feasible coupling between $\alpha$ and
$\beta$. The reverse local estimate is a standard stability statement for the
Monge--Ampere equation under the stated regularity assumptions: changes in
the target measure control changes in the Brenier potential in Holder norms,
hence control $T_\alpha-T_\beta$ in $L^2(\rho)$.

In one-dimensional settings, quantile functions make this exact with
$\eta=1$. In several dimensions one should not read the statement as a global
Lipschitz estimate in $\Wass_2$. Quantitative stability results for
semi-discrete and Monge--Ampere maps give Holder exponents depending on the
dimension, density bounds, support geometry and regularity
{cite:p}`merigot2020stability`.
:::

(sec-spectral-subspace-wasserstein)=
## Spectral and Robust Wasserstein Distances

Spectral OT changes the scalar quadratic cost by measuring the whole
displacement covariance through a matrix gauge. The same object admits a
robust projected formulation: instead of fixing one projection, one maximizes
over the polar set of the gauge. Subspace robust OT is the important
non-convex rank-constrained version of this idea {cite:p}`paty2019subspace`;
spectral gauges provide its convex minimax counterpart and connect to recent
spectral-gradient viewpoints such as Muon dynamics {cite:p}`peyre2026muon`.

(def-monotone-spectral-gauge)=
:::{admonition} Definition: Monotone Spectral Gauge
:class: important
A monotone spectral gauge on positive semidefinite matrices is a convex,
positively $1$-homogeneous map $\gamma:\mathbb S_+^d\to\RR_+$ such that
$\gamma(M)=0$ only for $M=0$,
$\gamma(QMQ^\top)=\gamma(M)$ for every orthogonal matrix $Q$, and

```{math}
0\preceq M\preceq N
\quad\Longrightarrow\quad
\gamma(M)\leq\gamma(N).
```
:::

The monotonicity condition means that increasing the displacement covariance
in Loewner order cannot decrease the transport penalty.

(def-spectral-wasserstein)=
:::{admonition} Definition: Spectral Wasserstein Distance
:class: important
Let $\gamma$ be a monotone spectral gauge. For a coupling
$\pi\in\Couplings(\alpha,\beta)$, define its displacement covariance

```{math}
M_\pi
\eqdef
\int (x-y)(x-y)^\top\d\pi(x,y).
```

The spectral Wasserstein distance associated with $\gamma$ is

```{math}
:label: eq-spectral-wasserstein
\Wass_\gamma(\alpha,\beta)^2
\eqdef
\inf_{\pi\in\Couplings(\alpha,\beta)}
\gamma(M_\pi).
```
:::

The special case $\gamma(M)=\tr(M)$ gives the usual quadratic Wasserstein
distance $\Wass_2$. The spectral gauge $\gamma(M)=\lambda_{\max}(M)$ instead
measures the worst transported variance direction. For $A\succeq0$, define
the quadratic projected transport cost

```{math}
:label: eq-quadratic-projected-cost
\Wass_{2,A}(\alpha,\beta)^2
\eqdef
\inf_{\pi\in\Couplings(\alpha,\beta)}
\int (x-y)^\top A(x-y)\d\pi(x,y)
=
\Wass_2((A^{1/2})_\sharp\alpha,(A^{1/2})_\sharp\beta)^2.
```

The polar set of the gauge is

```{math}
:label: eq-spectral-polar-set
\mathcal B_\gamma
\eqdef
\{A\succeq0:
\tr(AM)\leq\gamma(M)\ \text{for all } M\succeq0\},
```

so that, for a closed gauge,
$\gamma(M)=\sup_{A\in\mathcal B_\gamma}\tr(AM)$.

(prop-spectral-wasserstein-robust)=
:::{admonition} Proposition: Robust Representation and Metric Equivalence
:class: important
Assume, for simplicity, that the measures are compactly supported and that
$\gamma$ is closed and finite on the positive semidefinite cone. Then

```{math}
\Wass_\gamma(\alpha,\beta)^2
=
\sup_{A\in\mathcal B_\gamma}
\Wass_{2,A}(\alpha,\beta)^2.
```

If there exist constants $0<a\leq b<+\infty$ such that
$aI\in\mathcal B_\gamma$ and
$\mathcal B_\gamma\subset\{A:0\preceq A\preceq bI\}$, equivalently

```{math}
a\tr(M)\leq\gamma(M)\leq b\tr(M)
\qquad (M\succeq0),
```

then

```{math}
\sqrt a\,\Wass_2(\alpha,\beta)
\leq
\Wass_\gamma(\alpha,\beta)
\leq
\sqrt b\,\Wass_2(\alpha,\beta).
```

In particular, $\Wass_\gamma$ is a distance.
:::

:::{dropdown} Proof
Using the polar representation of $\gamma$,

```{math}
\Wass_\gamma(\alpha,\beta)^2
=
\inf_{\pi\in\Couplings(\alpha,\beta)}
\sup_{A\in\mathcal B_\gamma}
\tr(AM_\pi).
```

The coupling set is convex and compact for weak convergence under compact
support. The polar set $\mathcal B_\gamma$ is convex and compact, and the map
$(\pi,A)\mapsto\tr(AM_\pi)$ is affine in each variable and continuous. Sion's
minimax theorem gives

```{math}
\inf_\pi\sup_{A\in\mathcal B_\gamma}\tr(AM_\pi)
=
\sup_{A\in\mathcal B_\gamma}\inf_\pi\tr(AM_\pi)
=
\sup_{A\in\mathcal B_\gamma}\Wass_{2,A}(\alpha,\beta)^2.
```

For fixed $A\succeq0$, $\Wass_{2,A}$ is the Wasserstein pseudodistance
associated with the seminorm $x\mapsto\norm{A^{1/2}x}$. A supremum of
pseudodistances is symmetric and satisfies the triangle inequality. If
$aI\in\mathcal B_\gamma$ and $A\preceq bI$ for all
$A\in\mathcal B_\gamma$, then

```{math}
a\Wass_2(\alpha,\beta)^2
\leq
\Wass_\gamma(\alpha,\beta)^2
\leq
b\Wass_2(\alpha,\beta)^2,
```

which proves definiteness and equivalence with $\Wass_2$.
:::

(def-subspace-robust-wasserstein)=
:::{admonition} Definition: Subspace Robust Wasserstein
:class: important
For $1\leq k\leq d$, the Paty--Cuturi subspace robust Wasserstein distance is

```{math}
\operatorname{SRW}_{2,k}(\alpha,\beta)
\eqdef
\sup_{U^\top U=I_k}
\Wass_2((U^\top)_\sharp\alpha,(U^\top)_\sharp\beta)
=
\sup_{P^2=P=P^\top,\ \tr(P)=k}
\Wass_{2,P}(\alpha,\beta).
```
:::

For the Ky Fan gauge

```{math}
\gamma_k(M)=\sum_{\ell=1}^k\lambda_\ell(M),
```

where the eigenvalues are sorted in decreasing order, the polar set is

```{math}
\mathcal B_{\gamma_k}
=
\{A:0\preceq A\preceq I,\ \tr(A)\leq k\}.
```

Thus $k=d$ gives $\gamma_d(M)=\tr(M)$ and recovers $\Wass_2$. The convex hull
of rank-$k$ projectors is

```{math}
\{A:0\preceq A\preceq I,\ \tr(A)=k\},
```

and, since $M\succeq0$, the associated support function is the same Ky Fan
gauge. Thus $\Wass_{\gamma_k}$ is the convexified spectral counterpart of
$\operatorname{SRW}_{2,k}$, while $\operatorname{SRW}_{2,k}$ keeps the
original non-convex rank constraint. For $k=1$,
$\gamma_1(M)=\lambda_{\max}(M)$ and
$\mathcal B_{\gamma_1}=\{A\succeq0:\tr(A)\leq1\}$.

(fig:spectral-wasserstein-gauge)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("spectral-wasserstein-gauge")
```

*Trace and spectral gauges for displacement covariances. The trace gauge
minimizes the average squared displacement and gives the usual quadratic
transport plan. The $\lambda_{\max}$ gauge penalizes the worst projected
displacement variance; the displayed plan is obtained by approximating the
robust formulation with finitely many directions.*
:::

The interactive demo turns the displacement covariance into a visible object. The
trace gauge sums both covariance eigenvalues, while the top-eigenvalue gauge
cares only about the worst transported direction.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the spectral weights and deformation controls to see how the gauge changes the geometry used to compare measures.
:::

<iframe class="ot4ml-live-frame" title="Spectral Wasserstein controls" src="../live/generalized-spectral.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>
