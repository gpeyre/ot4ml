---
title: "Dynamic Optimal Transport"
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-dynamic-optimal-transport)=

Optimal transport becomes especially powerful once distances between measures
are seen as actions of moving mass. This chapter first develops the dynamic
language: continuity equations describe admissible measure evolutions, while
the Benamou--Brenier formula identifies $\Wass_2$ with a least-action
principle. These ideas prepare the gradient-flow and generative-model
chapters that follow.

:::{admonition} Guiding Comparison
:class: tip
The static formulation optimizes over a coupling between endpoints. The
dynamic formulation optimizes over a whole path of measures and a velocity
field. The continuity equation is the constraint, and kinetic energy is the
cost.
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

## Evolutions Over the Space of Measures

We start with the continuity equation because it is the common language for
particles, densities and weak measure evolutions. It also makes precise which
velocity fields actually move mass.

### Lagrangian and Eulerian Descriptions

Consider an evolution $t\mapsto\alpha_t\in\mathcal P(\RR^d)$. It can be
described in a Lagrangian way as the advection of particles along a
time-dependent vector field $v_t(x)$:

```{math}
:label: eq-lagrangian-advection
\frac{\d x(t)}{\d t}=v_t(x(t)).
```

Writing $T_t$ for the associated flow map, so that $T_t(x(0))=x(t)$, the
advected measure is

```{math}
\alpha_t=(T_t)_\sharp\alpha_0.
```

For empirical measures,
$\alpha_t=n^{-1}\sum_{i=1}^n\delta_{x_i(t)}$, each particle solves
{eq}`eq-lagrangian-advection`.

In the Eulerian description, the same motion is written directly on the
evolving measure:

```{math}
:label: eq-eulerian-advection
\frac{\partial\alpha_t}{\partial t}
+\operatorname{div}(v_t\alpha_t)=0.
```

This PDE is often called the advection equation, the continuity equation, or
Liouville's equation when it acts on phase space. It is a classical PDE only
when $\alpha_t$ has a smooth density. For general measures, and in particular
for empirical measures, it is understood weakly: for any smooth test function
$(t,x)\mapsto\varphi(t,x)$ compactly supported in time,

```{math}
:label: eq-eulerian-advection-weak
\int_0^1\!\int_{\RR^d}
\left(
\partial_t\varphi(t,x)
+\dotp{v_t(x)}{\nabla_x\varphi(t,x)}
\right)
\d\alpha_t(x)\d t
=0.
```

This weak equation is obtained from {eq}`eq-eulerian-advection` by integration
by parts. For smooth positive densities, the classical and weak formulations
are equivalent; for particle clouds, the weak form remains meaningful.

(prop-lagrangian-flow-continuity)=
:::{admonition} Proposition: Lagrangian Flows Solve the Continuity Equation
:class: important
Consider a smooth flow $T_t:\RR^d\to\RR^d$ and define
$\alpha_t=(T_t)_\sharp\alpha_0$. Define the Eulerian velocity field by

```{math}
v_t(T_t(y))=\partial_t T_t(y).
```

Then $(\alpha_t,v_t)$ solves the continuity equation in the weak sense
{eq}`eq-eulerian-advection-weak`. In particular, if
$\alpha_0=n^{-1}\sum_i\delta_{x_i(0)}$ is empirical, then
$\alpha_t=n^{-1}\sum_i\delta_{x_i(t)}$ is empirical as well, with particle
velocities $\dot x_i(t)=v_t(x_i(t))$.
:::

:::{dropdown} Proof
Let $\varphi(t,x)$ be a smooth test function vanishing at $t=0$ and $t=1$.
Since $\alpha_t=(T_t)_\sharp\alpha_0$,

```{math}
\frac{\d}{\d t}\int \varphi(t,x)\d\alpha_t(x)
=
\frac{\d}{\d t}\int \varphi(t,T_t(y))\d\alpha_0(y).
```

The chain rule gives

```{math}
\frac{\d}{\d t}\int \varphi(t,T_t(y))\d\alpha_0(y)
=
\int
\left(
\partial_t\varphi(t,T_t(y))
+\dotp{\nabla_x\varphi(t,T_t(y))}{\partial_t T_t(y)}
\right)
\d\alpha_0(y).
```

Using the definition of $v_t$ and the push-forward relation, this is

```{math}
\int
\left(
\partial_t\varphi(t,x)+\dotp{\nabla_x\varphi(t,x)}{v_t(x)}
\right)
\d\alpha_t(x).
```

Integrating in time and using the boundary values of $\varphi$ gives
{eq}`eq-eulerian-advection-weak`.
:::

### From Measure Evolutions to Vector Fields

For a given evolution $(\alpha_t)_t$, there are typically infinitely many
velocity fields $v_t$ satisfying

```{math}
:label: eq-inverse-flow
\partial_t\alpha_t+\operatorname{div}(\alpha_t v_t)=0.
```

This non-uniqueness comes from the kernel of the weighted divergence. The
linear space of vector fields that leave a measure $\alpha$ invariant is

```{math}
\mathcal H_\alpha
=
\{v:\operatorname{div}(\alpha v)=0\}.
```

It is usually non-trivial: if $\alpha$ is an isotropic Gaussian,
$\mathcal H_\alpha$ contains rotational vector fields generated by
anti-symmetric matrices.

### Dacorogna--Moser Inversion

Reconstructing particles from an observed density evolution is therefore
ill-posed. A simple choice, introduced by Dacorogna and Moser
{cite:p}`DacorognaMoser1990`, imposes that the flux $\alpha_t v_t$ is a
gradient field. Formally,

```{math}
:label: eq-dacorogna-moser
v_t
=
-\frac{1}{\alpha_t}
\nabla\Delta^{-1}(\partial_t\alpha_t),
```

with suitable boundary conditions, for instance vanishing at infinity. This
formula is useful conceptually but delicate when $\alpha_t$ vanishes, and it
does not generally produce a gradient velocity field.

### Least-Square Inversion and Gradient Structure

A more robust choice, used implicitly in flow matching, optimal transport and
Wasserstein gradient flows, is to select among all admissible velocities the
one with smallest kinetic energy:

```{math}
:label: eq-least-square-field
\min_v
\frac12\int_0^1\!\int_{\RR^d}\norm{v_t(x)}^2\,\d\alpha_t(x)\d t
\quad
\text{subject to}
\quad
\partial_t\alpha_t+\operatorname{div}(\alpha_t v_t)=0.
```

(prop-least-square-gradient-velocity)=
:::{admonition} Proposition: Least-Square Velocities Are Gradients
:class: important
Assume that $\alpha_t=\rho_t\,\d x$ is a smooth positive density curve and
that boundary terms vanish. The minimizer of {eq}`eq-least-square-field`, if
it exists, is a gradient field

```{math}
v_t=\nabla\phi_t,
```

where $\phi_t$, unique up to an additive constant, solves the weighted
Poisson equation

```{math}
:label: eq-least-square-field-explicit
-\operatorname{div}(\rho_t\nabla\phi_t)=\partial_t\rho_t,
\qquad
v_t=-\nabla\Delta_{\alpha_t}^{-1}(\partial_t\alpha_t),
\qquad
\Delta_{\alpha_t}\phi=\operatorname{div}(\alpha_t\nabla\phi).
```
:::

:::{dropdown} Proof
Introduce a Lagrange multiplier $\phi_t$ for the continuity equation. The
constrained problem has the formal saddle formulation

```{math}
\min_v\max_\phi
\int_0^1
\left[
\frac12\int_{\RR^d}\norm{v_t(x)}^2\,\d\alpha_t(x)
+
\int_{\RR^d}\phi_t(x)
\left(\operatorname{div}(\alpha_t v_t)(x)+\partial_t\alpha_t(x)\right)
\d x
\right]\d t.
```

Integrating by parts in the divergence term gives, for each $t$,

```{math}
\int
\left(
\frac12\norm{v_t}^2-\dotp{\nabla\phi_t}{v_t}
\right)
\d\alpha_t
+
\int\phi_t\,\partial_t\alpha_t.
```

The pointwise minimizer in $v_t$ is therefore $v_t=\nabla\phi_t$.
Substituting this into
$\partial_t\rho_t+\operatorname{div}(\rho_t v_t)=0$ gives the weighted
Poisson equation in {eq}`eq-least-square-field-explicit`. The inverse notation
is a shorthand for solving this equation on zero-mean right-hand sides,
modulo additive constants.
:::

In general this inversion is still computationally demanding, but special
choices of $(\alpha_t)_t$ lead to simpler formulas; this is the mechanism
exploited later by flow matching.

(alg-least-square-velocity-reconstruction)=
:::{admonition} Algorithm: Least-square velocity reconstruction
:class: ot4ml-algorithm

**Input:** Smooth positive density curve $(\rho_t)_{t\in[0,1]}$ and boundary conditions.

**Output:** Minimal-energy velocity field $v_t$ realizing the curve.

**For** each time $t$ **do**:

>
> **Compute** $\partial_t\rho_t$.
>
> **Solve** weighted Poisson equation:
>
> $-\diverg(\rho_t\nabla\phi_t)=\partial_t\rho_t, \qquad \int\phi_t\rho_t=0.$
>
> **Set**
> $v_t=\nabla\phi_t .$

**Return** $(v_t)_{t\in[0,1]}$.
:::


(sec-benamou-brenier-dynamic)=
## Benamou--Brenier Dynamic Formulation of OT

The dynamic formulation identifies $\Wass_2$ with the kinetic energy of the
cheapest continuity-equation path. It is the point where OT becomes a
least-action principle.

Instead of assuming that a whole curve $(\alpha_t)_{t\in[0,1]}$ is prescribed,
one fixes only the endpoints $\alpha_0$ and $\alpha_1$ and minimizes the
least-square energy {eq}`eq-least-square-field`. The theorem of Benamou and
Brenier states that this geodesic energy is exactly the squared Wasserstein
distance {cite:p}`benamou2000computational`.

(thm-benamou-brenier)=
:::{admonition} Theorem: Benamou--Brenier
:class: important
For probability measures $\alpha_0,\alpha_1\in\mathcal P_2(\RR^d)$,

```{math}
:label: eq-benamou-brenier
\Wass_2^2(\alpha_0,\alpha_1)
=
\inf_{(\alpha_t,v_t)}
\int_0^1\!\int_{\RR^d}\norm{v_t(x)}^2\,\d\alpha_t(x)\d t,
```

where the infimum is over $(\alpha_t,v_t)$ solving
$\partial_t\alpha_t+\nabla\!\cdot(\alpha_t v_t)=0$ with
$\alpha_{t=0}=\alpha_0$ and $\alpha_{t=1}=\alpha_1$. If $\alpha_0$ has a
density and $T$ is the optimal Monge map $T_\sharp\alpha_0=\alpha_1$, the
minimizer is

```{math}
:label: eq-static-to-dynamic
\alpha_t=((1-t)\Id+tT)_\sharp\alpha_0,
\qquad
v_t((1-t)x+tT(x))=T(x)-x.
```
:::

:::{dropdown} Proof
For the inequality "dynamic $\leq$ static", assume first that a Monge map
$T$ exists and define $(\alpha_t,v_t)$ by {eq}`eq-static-to-dynamic`. Since
the Lagrangian velocity $T(x)-x$ is independent of $t$,

```{math}
\int_0^1\!\int\norm{v_t}^2\,\d\alpha_t\d t
=
\int\norm{T(x)-x}^2\,\d\alpha_0(x),
```

so the dynamic cost is no larger than the static Monge cost. Without a Monge
map, the same construction uses an optimal coupling $\pi$: sample
$(X,Y)\sim\pi$ and move along the straight path
$\gamma_{X,Y}(t)=(1-t)X+tY$. This path measure has action
$\int\norm{x-y}^2\d\pi(x,y)$; projecting path velocities onto their
conditional mean at time $t$ gives an admissible Eulerian velocity with no
larger action, so the dynamic value is no larger than the Kantorovich value.

Conversely, for a smooth deterministic path, take the flow $T_t$ defined by
$\dot T_t=v_t\circ T_t$ and $T_0=\Id$. Then
$\alpha_t=(T_t)_\sharp\alpha_0$ and $(T_1)_\sharp\alpha_0=\alpha_1$.
Jensen's inequality gives

```{math}
\norm{T_1(x)-x}^2
\leq
\int_0^1\norm{v_t(T_t(x))}^2\d t.
```

After integration with respect to $\alpha_0$, the Monge cost is bounded above
by the dynamic action. For general finite-energy solutions of the continuity
equation, the superposition principle lifts the curve to a probability
measure on absolutely continuous paths; applying Jensen's inequality pathwise
gives a coupling of the endpoints whose quadratic cost is no larger than the
action. Thus the Kantorovich value is bounded above by the dynamic value.
:::

### Convex Moment-Based Reformulation

Although {eq}`eq-benamou-brenier` is not jointly convex in $(\alpha_t,v_t)$,
it becomes convex after replacing velocities by the momentum measure
$m_t=v_t\alpha_t$ and using the perspective action. In the absolutely
continuous case $\alpha_t=\rho_t\,\d x$ and
$m_t(x)=\rho_t(x)v_t(x)$,

```{math}
:label: eq-benamou-brenier-convex
\Wass_2^2(\alpha_0,\alpha_1)
=
\inf_{\substack{\partial_t\rho_t+\operatorname{div}m_t=0\\
\rho_{t=0}\d x=\alpha_0,\ \rho_{t=1}\d x=\alpha_1}}
\int_0^1\!\int_{\RR^d}
\frac{\norm{m_t(x)}^2}{\rho_t(x)}
\d x\,\d t,
```

with the usual convention that the integrand is $0$ when
$(\rho_t,m_t)=(0,0)$ and $+\infty$ when $\rho_t=0$ but $m_t\neq0$. For
singular endpoints or curves, the same statement is interpreted with
vector-valued momentum measures and the corresponding recession convention.
This convex reformulation enables geodesic interpolation by convex
optimization once the domain is discretized.

### Dual Hamilton--Jacobi Formulation

The momentum formulation also has a useful dual. It turns the least-action
problem into a Hamilton--Jacobi subsolution inequality for a scalar potential,
with equality on the part of space-time actually visited by the optimal curve.
With the no-$1/2$ convention of {eq}`eq-benamou-brenier-convex`, the constants
are as follows.

(prop-benamou-brenier-dual)=
::::{admonition} Proposition: Dual Benamou--Brenier Problem
:class: important

Assume, for simplicity, that the densities are smooth, compactly supported,
and that boundary terms vanish. Then the convex dynamic value has the dual
formulation

```{math}
:label: eq-benamou-brenier-dual
\Wass_2^2(\alpha_0,\alpha_1)
=
\sup_{\phi}
\left\{
\int_{\RR^d}\phi_1\,\d\alpha_1
-
\int_{\RR^d}\phi_0\,\d\alpha_0
\;:\;
\partial_t\phi_t+\frac14\norm{\nabla\phi_t}^2\leq 0
\right\}.
```

If $(\rho,m)$ and $\phi$ are smooth primal and dual optimizers, then

```{math}
:label: eq-bb-primal-dual-relation
m_t=\frac{\rho_t}{2}\nabla\phi_t,
\qquad
\partial_t\phi_t+\frac14\norm{\nabla\phi_t}^2=0
\quad\text{on }\{\rho_t>0\}.
```

Equivalently, the optimal Eulerian velocity is
$v_t=m_t/\rho_t=\nabla\phi_t/2$.
::::

:::{dropdown} Proof
Let $(\rho,m)$ satisfy the continuity equation and let $\phi$ be smooth.
Multiplying the constraint by $\phi$ and integrating by parts gives

```{math}
\int_{\RR^d}\phi_1\,\d\alpha_1
-
\int_{\RR^d}\phi_0\,\d\alpha_0
=
\int_0^1\!\int_{\RR^d}
\left(\rho_t\,\partial_t\phi_t+\dotp{m_t}{\nabla\phi_t}\right)\d x\d t .
```

If $\partial_t\phi_t+\norm{\nabla\phi_t}^2/4\leq0$, Young's inequality yields

```{math}
\rho\,\partial_t\phi+\dotp{m}{\nabla\phi}
\leq
-\frac{\rho}{4}\norm{\nabla\phi}^2+\dotp{m}{\nabla\phi}
\leq
\frac{\norm m^2}{\rho},
```

with the usual perspective convention. Thus the dual objective of every
feasible potential is no larger than the action of every feasible primal pair.
Conversely, introducing
$\phi$ as a Lagrange multiplier for
$\partial_t\rho+\operatorname{div}m=0$, and discarding the fixed endpoint
contribution, the pointwise minimization contains
$\norm m^2/\rho-\rho\,\partial_t\phi-\dotp{m}{\nabla\phi}$. Minimizing over
$m$ gives $m=\rho\nabla\phi/2$; minimizing over $\rho\geq0$ is finite exactly
under $\partial_t\phi+\norm{\nabla\phi}^2/4\leq0$. Fenchel--Rockafellar duality
then gives no duality gap in finite-dimensional discretizations. The
continuum identity follows by the usual relaxation and approximation, with
$\phi$ interpreted as a Hamilton--Jacobi subsolution. Equality in the two
pointwise inequalities gives {eq}`eq-bb-primal-dual-relation`.
:::

The inequality in {eq}`eq-benamou-brenier-dual` is the subsolution form of the
Hamilton--Jacobi equation associated with the Hamiltonian
$H(p)=\norm{p}^2/4$. On the transported mass, equality holds and the
characteristics satisfy
$\dot x=\nabla_pH(\nabla\phi)=\nabla\phi/2$. Since this Hamiltonian is
independent of $x$ in Euclidean space, the momentum along characteristics is
constant and the trajectories are straight lines. On a Riemannian manifold,
the same duality uses the Hamiltonian $H_x(p)=\norm{p}_{g_x^{-1}}^2/4$; the
characteristics are then geodesics for the underlying metric.

This also recovers the static Kantorovich inequality from a dynamic principle.
If $\gamma$ is any smooth curve with $\gamma(0)=x$ and $\gamma(1)=y$, then

```{math}
\frac{\d}{\d t}\phi_t(\gamma(t))
=
\partial_t\phi_t(\gamma(t))+\dotp{\nabla\phi_t(\gamma(t))}{\dot\gamma(t)}
\leq
\norm{\dot\gamma(t)}^2.
```

After integration and minimization over curves,

```{math}
\phi_1(y)-\phi_0(x)\leq \norm{x-y}^2.
```

Thus $(\phi_0,\phi_1)$ is a feasible static Kantorovich dual pair for the
quadratic cost. At optimality the inequality is saturated on the endpoint pairs
connected by the primal characteristics.

(fig:dynamic-benamou-brenier-duality)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("dynamic-benamou-brenier-duality")
```

*One-dimensional Benamou--Brenier primal and dual solutions. The endpoints
are Gaussian mixtures and the solution is computed from monotone quantile
interpolation. The panels show the primal density, the momentum
$m_t=\rho_t v_t$, and the dual Hamilton--Jacobi potential. Along the active
transported mass, the notebook checks $m_t=\rho_t\partial_x\phi_t/2$ and
$\partial_t\phi_t+|\partial_x\phi_t|^2/4=0$.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Move the geodesic time and velocity scale to inspect the
primal density and characteristic field underlying the dual certificate.
:::

<iframe class="ot4ml-live-frame" title="Benamou-Brenier geodesic controls" src="../live/dynamic-bb.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

### Proximal Splitting

The convex momentum formulation also explains the original Benamou--Brenier
solver. After discretization, the ALG2 scheme can be read as a
Douglas--Rachford splitting, equivalently ADMM on the Fenchel--Rockafellar
dual {cite:p}`FPapPeyOud13`. Suppressing discretization indices, write
$U=(\rho,m)$, let $\mathcal F(U)$ be the integral of the perspective action,
and let $\mathcal G=\iota_{\mathcal C}$ be the indicator of the affine
continuity constraint with prescribed endpoints. The problem is
$\min_U \mathcal F(U)+\mathcal G(U)$.

The two proximal operators separate the nonlinear and linear parts: the prox
of $\mathcal F$ is local in $(t,x)$ and amounts to the perspective proximal
operator, whereas the prox of $\mathcal G$ is the orthogonal projection onto
the divergence equation and endpoint constraints. Douglas--Rachford alternates
these two simple operations.

(alg-benamou-brenier-douglas-rachford)=
:::{admonition} Algorithm: Douglas--Rachford for dynamic Benamou--Brenier
:class: ot4ml-algorithm

**Input:** Functionals $\mathcal F,\mathcal G=\iota_{\mathcal C}$, proximal parameter $\tau>0$, initial field $Z^0$.

**Output:** Discrete density-momentum field $U^\star$.

**For** $k=0,1,\ldots$ **do**:

> $U^{k+1}=\prox_{\tau\mathcal F}(Z^k).$
>
> **Project** reflected point:
> $\widetilde U^{k+1} = \prox_{\tau\mathcal G}(2U^{k+1}-Z^k) = \Proj_{\mathcal C}(2U^{k+1}-Z^k).$
>
> **Update**
> $Z^{k+1}=Z^k+\widetilde U^{k+1}-U^{k+1}.$
>
> **If** $\norm{U^{k+1}-\widetilde U^{k+1}}\leq\mathrm{tol}$ **then**:

>> **Return** $U^{k+1}$.
:::


(fig:dynamic-benamou-brenier-geodesic)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("dynamic-benamou-brenier-geodesic")
```

*Benamou--Brenier geodesic between two sampled silhouettes. A discrete
quadratic OT plan between finely subsampled cat and two-disks point clouds
induces the McCann interpolation $Z_t=(1-t)X+tY$, which is the Lagrangian
realization of the least-action solution. The left panel renders
local color images of the smaller-bandwidth kernel-smoothed densities with
enough padding to include the full silhouettes. The right panel overlays
shortened velocity arrows centered at evenly subsampled midpoint particles
$Z_{1/2}$; each displayed arrow runs in data coordinates from a source-side
tail to a target-side head along the matched characteristic direction $Y-X$,
but is not drawn as the full endpoint segment from $X$ to $Y$.*
:::

The interactive demo keeps the same Lagrangian picture: particles are matched once,
then move along straight characteristics. The time and velocity scale controls
separate the path $\alpha_t$ from the underlying displacement field.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the time and velocity-scale controls to follow the Benamou-Brenier geodesic as a moving density with an Eulerian velocity field.
:::

<iframe class="ot4ml-live-frame" title="Benamou-Brenier geodesic controls" src="../live/dynamic-bb.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

(rem-bb-path-space)=
### Path-Space Formulation

Let $\Ss=C([0,1];\RR^d)$ be the space of continuous paths endowed with the uniform topology. For $t\in[0,1]$ define the evaluation map

```{math}
P_t:\Ss\to\RR^d,
\qquad
P_t(\gamma)=\gamma(t).
```

The Benamou--Brenier cost admits the equivalent formulation

```{math}
\Wass_2^2(\alpha_0,\alpha_1)
=
\inf_{M\in\Pp(\Ss)}
\enscond{
\int_{\Ss}\!\int_0^1\norm{\dot\gamma(t)}^2\d t\,\d M(\gamma)
}{
(P_0)_\sharp M=\alpha_0,\ (P_1)_\sharp M=\alpha_1
}.
```

If $\alpha_0$ has a density, the minimizer $M^*$ is unique. Its time marginals reproduce the optimal curve: $\alpha_t=(P_t)_\sharp M^*$ for all $t$. Furthermore, for a.e. $t$, denoting $Q_t(\gamma)=\dot\gamma(t)$ on absolutely continuous paths, the conditional law of the velocity is deterministic:

```{math}
(P_t,Q_t)_\sharp M^*(\d x,\d q)
=
\alpha_t(\d x)\delta_{v_t^*(x)}(\d q),
```

where $v_t^*$ is the optimal velocity field in the Benamou--Brenier formulation. Hence $M^*$ concentrates on straight-line geodesics and, for a.e. $t$, assigns exactly one direction at $\alpha_t$-a.e. spatial point.


(sec-bb-extensions)=
## Extensions of the Dynamic Formulation

The same variational grammar extends beyond the quadratic Wasserstein
distance. One changes either the kinetic exponent, the mobility or the
balance equation, while keeping a continuity-type constraint and a convex
perspective action.

(rem-generalized-bb)=
### Generalized Benamou--Brenier Distances

The dynamic formulation is not specific to $\Wass_2$. For measures with finite $p$-th moments and $p>1$, one has the analogous action formula

```{math}
\Wass_p^p(\alpha_0,\alpha_1)
=
\inf_{\substack{\partial_t\alpha_t+\nabla\!\cdot(\alpha_t v_t)=0\\
\alpha_{t=0}=\alpha_0,\ \alpha_{t=1}=\alpha_1}}
\int_0^1\!\int_{\RR^d} |v_t(x)|^p\,\d\alpha_t(x)\,\d t.
```

When $\alpha_t=\rho_t\,\d x$ and $m_t=\rho_t v_t$, this becomes the convex perspective action

```{math}
\int_0^1\!\int_{\RR^d}
\frac{|m_t(x)|^p}{\rho_t(x)^{p-1}}\,\d x\,\d t,
\qquad
\partial_t\rho_t+\nabla\!\cdot m_t=0,
```

with the usual convention that the integrand is $0$ if $(\rho,m)=(0,0)$ and $+\infty$ if $\rho=0$ but $m\neq0$.

A second class of variants changes the mobility of the medium: the quadratic action $|m|^2/\rho$ is replaced by $|m|^2/\theta(\rho)$ for a suitable concave mobility $\theta$. Under appropriate structural assumptions, this produces transport metrics adapted to nonlinear diffusions and finite-volume discretizations {cite:p}`dolbeault2009new`. The finite-state version, where the mobility is dictated by a reversible Markov chain, is developed in {ref}`sec-discrete-wasserstein-markov`. These extensions keep the same variational grammar as Benamou--Brenier: a continuity-type constraint, an action density, and geodesics obtained by minimizing an integrated kinetic cost.


### Dynamic Unbalanced OT

Unbalanced dynamic transport is obtained by allowing mass to be created and
destroyed along the path. The continuity equation is replaced by a balance
equation, and the action penalizes both spatial motion and growth. This
dynamic formulation underlies the Hellinger--Kantorovich and
Wasserstein--Fisher--Rao metrics
{cite:p}`LieroMielkeSavareShort,2017-chizat-focm`; its equivalence with
static entropy-transport and cone formulations is developed in
{cite:p}`LieroMielkeSavareLong,2015-chizat-unbalanced`.

A representative quadratic action is

```{math}
\partial_t\rho_t+\nabla\!\cdot m_t=s_t,
\qquad
\int_0^1\!\int
\left(
\frac{|m_t|^2}{\rho_t}
+\kappa^2\frac{s_t^2}{\rho_t}
\right)\d x\,\d t,
```

with the same perspective convention as above. Equivalently, writing
$m_t=\rho_t v_t$ and $s_t=\rho_t g_t$, one minimizes
$\int_0^1\int(|v_t|^2+\kappa^2g_t^2)\d\rho_t\d t$ under

```{math}
\partial_t\rho_t+\nabla\!\cdot(\rho_t v_t)=g_t\rho_t.
```

The parameter $\kappa$ fixes the relative cost of reaction and transport:
changing it rescales the radial/angular balance in the associated cone
metric. For measure-valued triples, the action is understood in the
lower-semicontinuous perspective sense

```{math}
\mathcal A_\kappa(\rho,m,s)
\eqdef
\int
\left(
\frac{\norm{\dot m}^2}{\dot\rho}
+
\kappa^2\frac{\dot s^2}{\dot\rho}
\right)\d\lambda,
\qquad
(\dot\rho,\dot m,\dot s)
=
\left(
\frac{\d\rho}{\d\lambda},
\frac{\d m}{\d\lambda},
\frac{\d s}{\d\lambda}
\right),
```

where $\lambda$ dominates $\rho$ and the total variations of $m$ and $s$. The
value is independent of this choice. The convention is $0/0=0$ and
$a/0=+\infty$ for $a>0$, so finite action forces both the flux and the source
to be absolutely continuous with respect to the transported mass.

(prop-static-dynamic-unbalanced)=
:::{admonition} Proposition: Static/Dynamic Equivalence for Unbalanced OT
:class: important
Fix the action above and let $\mathcal C\mathcal W_\kappa$ be the cone value
of the cone formulation of unbalanced OT, with the cone metric normalized to
the same growth scale $\kappa$. For nonnegative finite measures
$\alpha_0,\alpha_1$ on $\RR^d$, the dynamic value

```{math}
:label: eq-dynamic-unbalanced-ot
\mathrm{WFR}_\kappa^2(\alpha_0,\alpha_1)
\eqdef
\inf_{\substack{\partial_t\rho_t+\nabla\cdot m_t=s_t\\
\rho_0=\alpha_0,\ \rho_1=\alpha_1}}
\int_0^1
\mathcal A_\kappa(\rho_t,m_t,s_t)\,\d t
```

equals the static cone formulation $\mathcal C\mathcal W_\kappa(\alpha_0,\alpha_1)$.
Hence the static unbalanced problem and the balance-equation least-action
problem define the same geodesic distance.
:::

:::{dropdown} Proof
The cone construction turns variation of mass into radial motion and spatial
transport into angular motion on $\mathfrak C[\RR^d]$. Applying the
Benamou--Brenier theorem on the cone to the lifted endpoint measures gives a
dynamic least-action problem on $\mathfrak C[\RR^d]$ whose static value is the
cone value. This is the standard static/dynamic identification for the
Hellinger--Kantorovich and Wasserstein--Fisher--Rao metrics
{cite:p}`LieroMielkeSavareShort,LieroMielkeSavareLong,2017-chizat-focm,2015-chizat-unbalanced`.

Projecting a cone curve back to the base space with weight $r^2$ produces a
measure curve $\rho_t$, a spatial flux $m_t$ and a source term $s_t$
satisfying the balance equation. With the matching normalization of the cone
metric, the cone kinetic energy decomposes exactly into the perspective action
$\mathcal A_\kappa$ in {eq}`eq-dynamic-unbalanced-ot`. Conversely, any
finite-action triple $(\rho_t,m_t,s_t)$ can be lifted to a cone curve whose
radial velocity realizes the growth term and whose spatial velocity realizes
the transport term, with the same action after relaxation. The two infima are
therefore equal; lower semicontinuity gives the general finite-measure
statement from the smooth positive case.
:::

(fig:dynamic-unbalanced-geodesic)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("dynamic-unbalanced-geodesic")
```

*Balanced and unbalanced Sinkhorn-barycenter interpolations between two
one-dimensional Gaussian mixtures with swapped modal masses. The balanced row
conserves total mass, so excess mass from the dominant left mode must move
along the line toward the dominant right target mode, producing transient mass
in the middle. The unbalanced row uses KL-relaxed marginal constraints; mass
can be attenuated near overrepresented modes and recreated near
underrepresented modes, giving a reaction--transport interpolation closer to
the Wasserstein--Fisher--Rao intuition.*
:::

The interactive demo below exposes this balance directly. A high reaction weight
keeps more mass local by fading and recreating modes, while the balanced path
must carry mass through space.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the growth and time controls to compare motion with source terms in dynamic unbalanced transport.
:::

<iframe class="ot4ml-live-frame" title="Dynamic unbalanced transport controls" src="../live/dynamic-unbalanced.html" loading="lazy" style="width:100%;height:510px;border:0;display:block;"></iframe>

(sec-discrete-wasserstein-markov)=
## Discrete Wasserstein Geometries on Markov Chains

The Benamou--Brenier construction also has a finite-state analogue, but not the
naive one obtained by putting the Euclidean metric on the simplex. The key idea,
introduced by Maas and independently developed in related forms by Mielke and by
Chow--Huang--Li--Zhou, is to use the transition graph of a reversible Markov
chain to define the admissible directions and the mobility of the mass
{cite:p}`Maas2011,MielkeCVPDE,ChowHuangLiZhou2012`. The resulting distance
turns the heat flow of the chain into the gradient flow of the discrete Shannon
entropy. This is the finite-dimensional counterpart of the fact that the heat
equation on $\RR^d$ is the Wasserstein gradient flow of entropy, and it is also
the geometric structure used in numerical work on discrete metric-measure spaces
{cite:p}`ErbarDCDS,erbar2017computation`.

Let $\mathcal X=\{1,\ldots,n\}$ and let $K=(K_{ij})$ denote the off-diagonal transition rates of an
irreducible continuous-time Markov chain which is reversible with respect to a
probability vector $\pi$, so that $\pi_iK_{ij}=\pi_jK_{ji}$ for $i\neq j$.
We write a probability $p\in\Sigma_n$ in density form $p_i=\pi_i\rho_i$, where

```{math}
\Sigma_n\eqdef\left\{p\in\RR_+^n:\sum_i p_i=1\right\}.
```

The entropy relative to $\pi$ is

```{math}
\operatorname{Ent}_\pi(\rho)\eqdef\sum_i\pi_i\rho_i\log\rho_i.
```

The logarithmic mean

```{math}
\theta(a,b)\eqdef
\begin{cases}
\displaystyle\frac{a-b}{\log a-\log b}, & a\neq b,\\[.4em]
a, & a=b,
\end{cases}
```

is the specific mobility which makes the entropy gradient exactly coincide with
the Markov evolution. For a potential $\psi\in\RR^n$, define the Onsager operator

```{math}
:label: eq-discrete-markov-onsager
(\mathcal K_\rho\psi)_i
\eqdef
\sum_j K_{ij}\theta(\rho_i,\rho_j)(\psi_i-\psi_j).
```

Its associated action is

```{math}
:label: eq-discrete-markov-action
\mathcal A(\rho,\psi)
\eqdef
\frac12\sum_{i,j}\pi_iK_{ij}\theta(\rho_i,\rho_j)(\psi_i-\psi_j)^2.
```

The discrete transport distance is the least action

```{math}
:label: eq-discrete-markov-distance
\mathcal W_K^2(\rho^0,\rho^1)
\eqdef
\inf_{\rho_t,\psi_t}
\int_0^1\mathcal A(\rho_t,\psi_t)\,\d t,
\qquad
\dot\rho_t+\mathcal K_{\rho_t}\psi_t=0,
```

with endpoints $\rho_0=\rho^0$, $\rho_1=\rho^1$. Equivalently, one can write
the same formula in edge-flux variables, exactly as in a finite-volume
discretization: the flux is only allowed along edges where $K_{ij}>0$, and the
denominator in the kinetic energy is the logarithmic mean of the two endpoint
densities.

(prop-discrete-markov-entropy-gradient)=
:::{admonition} Proposition: Entropy Gradient Flow of a Reversible Markov Chain
:class: important
Let $K$ be reversible with invariant law $\pi$. The gradient flow of
$\operatorname{Ent}_\pi$ for the metric $\mathcal W_K$ is the forward equation
of the Markov chain,

```{math}
:label: eq-discrete-markov-gradient-flow
\dot\rho_i(t)=\sum_jK_{ij}\bigl(\rho_j(t)-\rho_i(t)\bigr).
```

Equivalently, for the masses $p_i(t)=\pi_i\rho_i(t)$, this is
$\dot p_i(t)=\sum_j(p_j(t)K_{ji}-p_i(t)K_{ij})$.
:::

:::{dropdown} Proof
The first variation of the entropy, with respect to the weighted pairing
$\sum_i\pi_i\xi_i\varphi_i$, is $\log\rho_i+1$. Constants do not contribute to
$\mathcal K_\rho$, hence the metric gradient-flow equation is

```{math}
\dot\rho=-\mathcal K_\rho\log\rho.
```

Using the identity

```{math}
\theta(a,b)(\log a-\log b)=a-b,
```

one obtains, componentwise,

```{math}
\dot\rho_i
=-\sum_jK_{ij}\theta(\rho_i,\rho_j)(\log\rho_i-\log\rho_j)
=
\sum_jK_{ij}(\rho_j-\rho_i),
```

which is the density form of the Kolmogorov forward equation. Multiplying by
$\pi_i$ and using detailed balance gives the equation for the probability masses.
:::

Although the minimizing-movement construction is introduced only in {ref}`sec-wasserstein-gradient-flows`, it is useful to keep its intuition in mind here. If one formally
performs one JKO step for the metric $\mathcal W_K$,

```{math}
:label: eq-discrete-markov-jko
\rho^{k+1}\in\argmin_\rho
\frac{1}{2\tau}\mathcal W_K^2(\rho,\rho^k)+\operatorname{Ent}_\pi(\rho),
```

then the first-order optimality condition gives, for small $\tau$,

```{math}
\frac{\rho^{k+1}-\rho^k}{\tau}
=-\mathcal K_{\rho^k}\log\rho^k+O(\tau)
=K\rho^k+O(\tau),
```

where $(K\rho)_i=\sum_jK_{ij}(\rho_j-\rho_i)$. Thus the discrete Wasserstein
geometry is engineered so that the implicit Euler step for entropy is, to first
order, the Markov semigroup. This is precisely the finite-state analogue of the
JKO interpretation of the heat equation.

### Closed Forms in Dimensions Two and Three

For the two- and three-state examples below, take the uniform random walk on
the complete neighbor graph, i.e. every pair of distinct states is declared
neighboring. Thus $\pi_i=1/n$, and $K_{ij}=1/(n-1)$ for $i\neq j$. On
$\Sigma_2$, write $p=(r,1-r)$ and $q=(s,1-s)$. Since there is only
one edge, the distance reduces to the scalar Riemannian length

```{math}
:label: eq-two-state-markov-distance
\mathcal W_K(p,q)
=
\left|\int_s^r \frac{\d u}{\sqrt{\theta(u,1-u)}}\right|,
\qquad
0<r,s<1.
```

This formula is closed but not Euclidean: the logarithmic mean changes the cost
of moving mass depending on the current split between the two states.

On $\Sigma_3$, the complete-neighbor graph is a triangle. For
$p\in\operatorname{int}(\Sigma_3)$, set

```{math}
a_{ij}(p)\eqdef\frac12\theta(p_i,p_j),
\qquad 1\leq i<j\leq3.
```

For a tangent vector $u\in\RR^3$ with $u_1+u_2+u_3=0$, orient the edges as
$1\to2$, $1\to3$, $2\to3$. The squared norm induced by the discrete
Wasserstein metric is

```{math}
:label: eq-three-state-markov-norm
\|u\|_p^2
=
\min_{q_{12},q_{13},q_{23}}
\left\{
\frac{q_{12}^2}{a_{12}}+
\frac{q_{13}^2}{a_{13}}+
\frac{q_{23}^2}{a_{23}}
\right\},
```

subject to

```{math}
u_1+q_{12}+q_{13}=0,
\qquad
u_2-q_{12}+q_{23}=0,
\qquad
u_3-q_{13}-q_{23}=0.
```

Eliminating the three edge fluxes gives an explicit formula. With
$D=a_{12}^{-1}+a_{13}^{-1}+a_{23}^{-1}$,

```{math}
q_{12}^*=\frac{u_2/a_{23}-u_1/a_{13}}{D},
\qquad
q_{13}^*=-u_1-q_{12}^*,
\qquad
q_{23}^*=q_{12}^*-u_2,
```

and $\|u\|_p^2$ is obtained by inserting these values in
{eq}`eq-three-state-markov-norm`. Therefore

```{math}
:label: eq-three-state-markov-distance
\mathcal W_K^2(p^0,p^1)
=
\inf_{p_t\in\operatorname{int}(\Sigma_3)}
\int_0^1\|\dot p_t\|_{p_t}^2\,\d t,
\qquad
p_0=p^0,
\quad p_1=p^1.
```

Thus the three-state distance is an explicit two-dimensional Riemannian
geodesic problem on the open triangle. The formula is simple enough to compute
directly, but it already shows the main difference with Euclidean geometry on
the simplex: the local metric depends nonlinearly on the current density through
logarithmic edge mobilities.

(fig:discrete-markov-simplex-distances)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("discrete-markov-simplex-distances")
```

*Discrete Wasserstein distances on small Markov-chain simplices. The left panel shows
the closed-form profiles $p\mapsto \mathcal W_K(a_p,a_{p_0})$, with
$a_p=(p,1-p)$, for several anchors $p_0$ on $\Sigma_2$. The middle panel shows
numerical level sets of $\mathcal W_K(a,\bar a)$ on $\Sigma_3$, where
$\bar a=(1/3,1/3,1/3)$, using the local Riemannian norm induced by the
complete-neighbor Markov chain. The right panel shows the corresponding level
sets for the ordinary $W_2$ distance with $d(i,j)=1$ for $i\neq j$, so that
$W_2^2(a,\bar a)=\norm{a-\bar a}_{\mathrm{TV}}$.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Move the anchor in the two-state formula and refine the
three-state grid to compare the Markov-chain Riemannian distance with the
ordinary simplex distance induced by the \(0/1\) ground metric.
:::

<iframe class="ot4ml-live-frame" title="Discrete Markov-chain simplex distance controls" src="../live/dynamic-markov-simplex.html" loading="lazy" style="width:100%;height:480px;border:0;display:block;"></iframe>
