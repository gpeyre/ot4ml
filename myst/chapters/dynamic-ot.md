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

The classical Dacorogna--Moser construction uses the linear density path. If
$\alpha_i=\rho_i\,\d x$ are smooth positive densities with the same total mass
on a bounded domain $\Omega$, set

```{math}
\alpha_t=(1-t)\alpha_0+t\alpha_1=\rho_t\,\d x,
\qquad
\rho_t=(1-t)\rho_0+t\rho_1.
```

Choose a time-independent flux $w$ satisfying

```{math}
\operatorname{div} w=\rho_0-\rho_1,
\qquad
w\cdot n=0\quad\hbox{on }\partial\Omega,
```

for instance $w=-\nabla\phi$ with $\Delta\phi=\rho_1-\rho_0$ and Neumann
boundary condition. Then

```{math}
v_t=\frac{w}{\rho_t}
```

satisfies $\partial_t\rho_t+\operatorname{div}(\rho_t v_t)=0$. The flow
$\partial_t T_t=v_t\circ T_t$, $T_0=\operatorname{Id}$, therefore transports
$\rho_0\d x$ onto $\rho_t\d x$, and $T_1$ solves the prescribed-Jacobian
problem
$\rho_1(T_1(x))\det(\nabla T_1(x))=\rho_0(x)$.

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
exploited later by flow matching in Section {ref}`sec-generative-flow-matching`.

(sec-benamou-brenier-dynamic)=
## Benamou--Brenier Dynamic Formulation of OT

The dynamic formulation identifies $\Wass_2$ with the kinetic energy of the
cheapest continuity-equation path. It is the point where OT becomes a
least-action principle.

### Benamou--Brenier Formulation

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

#### Convex Moment-Based Reformulation

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

#### Dual Hamilton--Jacobi Formulation

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

#### Proximal Splitting

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



(sec-generalized-dynamic-wasserstein-distances)=
## Generalized Dynamic Wasserstein Distances

The quadratic Benamou--Brenier formula is only one instance of a broader
fixed-mass dynamic language. The goal of this section is to define a large
family of geodesic-like distances on spaces of probability measures by
modifying the action minimized in the Benamou--Brenier formula. The objects
introduced here are metric: they specify admissible curves, tangent variables
and path energies. All descent constructions are postponed to
{ref}`sec-generalized-dynamic-wasserstein-flows`, where these distances are used
to generate gradient-flow PDE models.

In the mass-preserving Euclidean setting, the basic input is an instantaneous
action $\mathbb A(\alpha,w)$, where $\alpha$ is the current measure and $w$ is
an admissible velocity representative. When this action is normalized as a
squared infinitesimal speed, it generates the length-space value

```{math}
:label: eq-generalized-action-length-distance
\mathsf D_{\mathbb A}^2(\alpha_0,\alpha_1)
=
\inf_{\alpha_t,v_t}
\left\{
\int_0^1 \mathbb A(\alpha_t,v_t)\,\d t
:
\partial_t\alpha_t+\operatorname{div}(\alpha_t v_t)=0,
\ \alpha_{t=0}=\alpha_0,
\ \alpha_{t=1}=\alpha_1
\right\}.
```

Equivalently, one may quotient by velocity fields that induce the same
first-order variation of the measure. The formula above should be read as a
dynamic definition of the distance, not as a property automatically satisfied
by an arbitrary discrepancy. Some standard distances, such as $\Wass_p$, are
first written with a $p$-homogeneous action and then squared by taking a
constant-speed parametrization; this normalization is made explicit below.
Different choices of $\mathbb A$ change the resulting geometry;
{ref}`sec-generalized-dynamic-wasserstein-flows` later reuses these choices
when dynamics are introduced.

### Quadratic, or Riemannian, Tangent Actions

A particularly transparent case occurs when $w\mapsto\mathbb A(\alpha,w)$ is
quadratic. For simplicity, take admissible velocities in
$L^2(\alpha;\RR^d)$; in some applications this Hilbert space is replaced by a
closed subspace encoding additional constraints. If the polarization of
$\mathbb A$ is represented by a positive self-adjoint operator
$Q_\alpha:L^2(\alpha;\RR^d)\to L^2(\alpha;\RR^d)$,

```{math}
\mathbb A(\alpha;w,z)
=
\left\langle Q_\alpha w,z\right\rangle_{L^2(\alpha)},
\qquad
\mathbb A(\alpha,w)=\left\langle Q_\alpha w,w\right\rangle_{L^2(\alpha)},
```

then the least-action distance generated by this tensor is

```{math}
:label: eq-general-quadratic-tangent-action
\mathsf D_Q^2(\alpha_0,\alpha_1)
=
\mathsf D_{\mathbb A}^2(\alpha_0,\alpha_1)
=
\inf_{\substack{\partial_t\alpha_t+\operatorname{div}(\alpha_t v_t)=0\\
\alpha_{t=0}=\alpha_0,\ \alpha_{t=1}=\alpha_1}}
\int_0^1
\left\langle Q_{\alpha_t}v_t,v_t\right\rangle_{L^2(\alpha_t)}
\d t .
```

The usual $\Wass_2$ geometry corresponds to $Q_\alpha=\Id$ in this simplified
notation. Thus $Q_\alpha$ records how the chosen geometry deforms the Euclidean
$L^2(\alpha)$ tangent norm: no deformation for
$\Wass_2$, and a nontrivial tensor for generalized Riemannian geometries.
{ref}`sec-generalized-dynamic-wasserstein-flows` later reuses the same tensor as
a preconditioner for metric descent.

### Local Velocity Actions

Many dynamic distances are local with respect to a reference measure $\lambda$.
Write $\alpha=a\lambda$. A velocity action is specified by a pointwise
integrand

```{math}
A:[0,+\infty)\times\RR^d\to[0,+\infty],
\qquad
(a,w)\mapsto A(a,w),
```

where $a\in\RR_+$ is a density value and $w\in\RR^d$ is a velocity value, and
defines

```{math}
:label: eq-local-velocity-action
\mathbb A(\alpha,w)
=
\int A\left(\frac{\d\alpha}{\d\lambda}(x),w(x)\right)\d\lambda(x).
```

For a fixed reference $\lambda$, this covers density-dependent mobilities and
congestion constraints. If, in addition, $A$ is positively $1$-homogeneous in
its first variable, $A(\eta a,w)=\eta A(a,w)$ for $\eta\geq0$, then the same
formula is intrinsic: replacing $\lambda$ by another dominating measure gives
the same value. The usual Benamou--Brenier action is the model case

```{math}
:label: eq-bb-velocity-action
A_2(a,w)=a\norm{w}^2,
\qquad
\mathbb A(\alpha,w)=\int\norm{w}^2\d\alpha .
```

(rem-generalized-bb)=
### Homogeneous Momentum Actions

The same action can be written in momentum variables, and this is the form in
which convexity and metric properties are easiest to read. Set $\mu=\alpha w$,
so that $\mu$ is a vector-valued measure. At the measure level, define

```{math}
:label: eq-general-measure-momentum-action
\mathbb J_A(\alpha,\mu)
\eqdef
\begin{cases}
\mathbb A\!\big(\alpha,\d\mu/\d\alpha\big), & \mu\ll\alpha,\\
+\infty, & \text{otherwise}.
\end{cases}
```

When the local description is written with the same reference $\lambda$, so
that $\alpha=a\lambda$ and $\mu=m\lambda$, the pointwise momentum perspective is

```{math}
:label: eq-general-momentum-perspective
J_A(a,m)
\eqdef
\begin{cases}
A(a,m/a), & a>0,\\
0, & a=0\ \text{and}\ m=0,\\
+\infty, & a=0\ \text{and}\ m\neq0,
\end{cases}
```

so that $\mathbb J_A(\alpha,\mu)=\int J_A(a(x),m(x))\d\lambda(x)$. This
zero-density convention is the lower-semicontinuous one for the superlinear
actions used below; other growths use the corresponding recession extension.
For $A_2(a,w)=a\norm{w}^2$, one recovers the quadratic perspective

```{math}
J_2(a,m)=\frac{\norm m^2}{a},
```

which is the integrand used in the convex Benamou--Brenier formulation.

(prop-momentum-perspective-convexity)=
:::{admonition} Proposition: Concave Mobilities Give Convex Momentum Actions
:class: important
Let $I\subset[0,+\infty)$ be a convex interval, let
$\theta:I\to[0,+\infty)$ be concave, and let
$L:\RR^d\to[0,+\infty]$ be convex with $L(0)=0$. Define, on the set where
$\theta(a)>0$,

```{math}
:label: eq-concave-mobility-perspective
J_{\theta,L}(a,m)
\eqdef
\theta(a)L\!\left(\frac{m}{\theta(a)}\right),
\qquad
A_{\theta,L}(a,w)
\eqdef
J_{\theta,L}(a,aw)
=
\theta(a)L\!\left(\frac{aw}{\theta(a)}\right).
```

Extend $J_{\theta,L}$ to the boundary by lower semicontinuity. Then
$J_{\theta,L}$ is convex in $(a,m)$. This single construction contains the
standard action $A(a,w)=aL(w)$ by taking $\theta(a)=a$, and the
concave-mobility quadratic action
$A(a,w)=a^2\norm w^2/\theta(a)$ by taking $L(u)=\norm u^2$.
:::

:::{dropdown} Proof
The perspective $P(s,m)=sL(m/s)$ of a convex function is convex on $s>0$.
Since $L(0)=0$, it is also nonincreasing in $s$ for fixed $m$: if
$s_2\geq s_1>0$, then

```{math}
L(m/s_2)
=
L\!\left((s_1/s_2)(m/s_1)\right)
\leq
(s_1/s_2)L(m/s_1),
```

hence $P(s_2,m)\leq P(s_1,m)$. Let
$a_\zeta=(1-\zeta)a_0+\zeta a_1$ and
$m_\zeta=(1-\zeta)m_0+\zeta m_1$. Concavity of $\theta$ gives
$\theta(a_\zeta)\geq(1-\zeta)\theta(a_0)+\zeta\theta(a_1)$. Monotonicity in
$s$, followed by convexity of $P$, gives

```{math}
J_{\theta,L}(a_\zeta,m_\zeta)
\leq
P((1-\zeta)\theta(a_0)+\zeta\theta(a_1),m_\zeta)
\leq
(1-\zeta)J_{\theta,L}(a_0,m_0)
+\zeta J_{\theta,L}(a_1,m_1).
```

Boundary cases follow from the lower-semicontinuous extension.
:::

The next proposition isolates the assumptions under which the momentum
formulation generated by $A$ defines a path metric rather than only a
variational principle.

(prop-homogeneous-dynamic-action-distance)=
:::{admonition} Proposition: Homogeneous Dynamic Actions Define Distances
:class: important
Assume that the momentum perspective $J_A$ defined in
{eq}`eq-general-momentum-perspective` is lower semicontinuous, convex in
$(a,m)$, even in $m$, and satisfies $J_A(a,0)=0$. Assume moreover that for some
$r>1$

```{math}
J_A(a,\xi m)=|\xi|^rJ_A(a,m)
\qquad
\text{for all admissible }a,\ \text{all }m,\ \text{and all }\xi\in\RR,
```

and that $J_A(a,m)=0$ if and only if $m=0$. Equivalently, the evenness,
homogeneity and nondegeneracy assumptions translate, away from zero density,
into

```{math}
A(a,-w)=A(a,w),
\qquad
A(a,\xi w)=|\xi|^rA(a,w),
\qquad
A(a,w)=0 \Longleftrightarrow w=0
\qquad (a>0).
```

Define, on every fixed-mass class,

```{math}
\mathsf D_A(\alpha_0,\alpha_1)
\eqdef
\inf_{\substack{\partial_t\alpha_t+\diverg\mu_t=0\\
\alpha_{t=0}=\alpha_0,\ \alpha_{t=1}=\alpha_1}}
\left(
\int_0^1\mathbb J_A(\alpha_t,\mu_t)\,\d t
\right)^{1/r}.
```

After the usual lower-semicontinuous relaxation assuming that zero-action values
are attained, $\mathsf D_A$ is an extended distance on each finite-action
component: it is symmetric, satisfies the triangle inequality, and
$\mathsf D_A(\alpha_0,\alpha_1)=0$ only when $\alpha_0=\alpha_1$.
:::

:::{dropdown} Proof
Zero self-distance is obtained by the constant curve. Conversely, zero relaxed
action forces $\mathbb J_A(\alpha_t,\mu_t)=0$ a.e., hence $\mu_t=0$ a.e.; the
continuity equation then gives $\alpha_0=\alpha_1$. Symmetry follows by time
reversal and evenness in $m$. For the triangle inequality, concatenate two almost optimal curves with
actions $E_1,E_2$, allocating time fractions $\tau$ and $1-\tau$. By
$r$-homogeneity the action is $\tau^{1-r}E_1+(1-\tau)^{1-r}E_2$. Optimizing in
$\tau$ gives $(E_1^{1/r}+E_2^{1/r})^r$, and the result follows after taking
infima.
:::

Without homogeneity or nondegeneracy, the same momentum action remains useful as
a variational principle, but its $r$-th root need not define a distance.

:::{admonition} Example: Wasserstein-$p$ action
:class: ot4ml-example

The usual $\Wass_p$ distances correspond to changing only the homogeneity of the
Benamou--Brenier action. The specific objects to insert in the general framework
are

```{math}
A_p(a,w)=a\norm{w}^p,
\qquad
J_p(a,m)=
\begin{cases}
\norm{m}^p/a^{p-1}, & a>0,\\
0, & (a,m)=(0,0),\\
+\infty, & a=0,\ m\neq0,
\end{cases}
```

With $A=A_p$, Proposition {ref}`prop-homogeneous-dynamic-action-distance` gives
the usual identity $\mathsf D_{A_p}=\Wass_p$. For gradient-flow purposes one
uses the corresponding squared metric speed

```{math}
\mathbb A_p(\alpha,w)
=
\left(\int\norm{w}^p\d\alpha\right)^{2/p}.
```

This is the squared version of the $p$-homogeneous action: minimizing
$\int_0^1\mathbb A_p(\alpha_t,v_t)\d t$ gives $\Wass_p^2$ after
constant-speed reparametrization. Thus $A_p,J_p$ denote the local
$p$-homogeneous velocity and momentum densities, whereas $\mathbb A_p$ denotes
the squared tangent action used later in the PMO. The endpoint $p=1$ can be
treated separately: $J_1(a,m)=\norm m$, and the dynamic problem collapses to
Beckmann's formulation of $\Wass_1$ {cite:p}`Beckmann52`.
:::

### Concave-Mobility Actions

One can instead keep a quadratic momentum action and change the mobility.
Dolbeault, Nazaret and Savaré introduced this construction as a class of
generalized transport distances adapted to nonlinear diffusion
{cite:p}`dolbeault2009new`. Let $I\subset[0,+\infty)$ be a convex interval and
let $\theta:I\to[0,+\infty)$ be concave. Define

```{math}
J_\theta(a,m)
\eqdef
\begin{cases}
\norm{m}^2/\theta(a), & \theta(a)>0,\\
0, & \theta(a)=0 \text{ and } m=0,\\
+\infty, & \theta(a)=0 \text{ and } m\neq0.
\end{cases}
```

The corresponding velocity action is

```{math}
A_\theta(a,w)=J_\theta(a,aw)=\frac{a^2\norm{w}^2}{\theta(a)}.
```

The convexity of $J_\theta$ is the special case $L(u)=\norm u^2$ of
Proposition {ref}`prop-momentum-perspective-convexity`. This is why concavity
of the mobility, rather than convexity, is the structural condition that makes
the continuity-equation formulation convex.

Fix now a reference measure $\lambda$. If $\alpha=a\lambda$, the induced squared
tangent action is

```{math}
\mathbb A_{\theta,\lambda}(\alpha,w)
=
\int A_\theta(a(x),w(x))\,\d\lambda(x)
=
\int \frac{a(x)^2}{\theta(a(x))}\norm{w(x)}^2\,\d\lambda(x),
```

and it is set to $+\infty$ when $\alpha\not\ll\lambda$. Equivalently, on the set
where $\theta(a(x))>0$,

```{math}
\mathbb A_{\theta,\lambda}(\alpha,w)
=
\int \frac{a(x)}{\theta(a(x))}\norm{w(x)}^2\,\d\alpha(x).
```

Hence this is a local Riemannian case whenever the multiplier
$a(x)/\theta(a(x))$ is finite and positive, in the sense of
{eq}`eq-general-quadratic-tangent-action`. The associated tensor is the
multiplication operator

```{math}
:label: eq-concave-mobility-q-alpha
\big(Q_{\theta,\lambda,\alpha}w\big)(x)
=
\frac{a(x)}{\theta(a(x))}w(x),
\qquad
\alpha=a\lambda,
```

defined $\alpha$-a.e. on the set where $\theta(a)>0$. Except for linear
mobilities $\theta(a)=ca$, and in particular the normalized case $\theta(a)=a$
which recovers $\Wass_2$, the pointwise velocity action $A_\theta(a,w)$ is not
positively $1$-homogeneous in the density variable $a$. Consequently the
construction is not intrinsic under a change of $\lambda$: the resulting
distance depends on the chosen reference measure and is finite only between
endpoints that can be joined by a finite-action curve with
$\alpha_t\ll\lambda$.

The associated value is therefore written

```{math}
\mathsf W_{\theta,\lambda}(\alpha_0,\alpha_1)
\eqdef
\mathsf D_{A_\theta,\lambda}(\alpha_0,\alpha_1),
```

where the subscript $\lambda$ recalls that the action is measured through the
density $a=\d\alpha/\d\lambda$.
Here $\mathsf D_{A_\theta,\lambda}$ denotes the general path value
{eq}`eq-generalized-action-length-distance` with the action
$\mathbb A=\mathbb A_{\theta,\lambda}$.

(prop-concave-mobility-distance)=
:::{admonition} Proposition: Concave-Mobility Dynamic Distances
:class: important
For a fixed reference measure $\lambda$, and with the lower-semicontinuous
extension of $J_\theta$ above,
$\mathsf W_{\theta,\lambda}=\mathsf D_{A_\theta,\lambda}$ is an extended
distance on each finite-action component contained in
$\{\alpha:\alpha\ll\lambda\}$. In particular, whenever the relevant component
has finite pairwise distances, $\mathsf W_{\theta,\lambda}$ is a genuine metric
there.
:::

:::{dropdown} Proof
Proposition {ref}`prop-momentum-perspective-convexity`, applied with
$L(u)=\norm u^2$, gives the lower-semicontinuous convex momentum density
$J_\theta$. It is even in $m$, satisfies $J_\theta(a,0)=0$, and obeys

```{math}
J_\theta(a,\xi m)=|\xi|^2J_\theta(a,m).
```

Moreover $J_\theta(a,m)=0$ if and only if $m=0$, with the boundary convention
used in its definition. For the fixed reference $\lambda$, the hypotheses of
Proposition {ref}`prop-homogeneous-dynamic-action-distance` therefore hold with
$r=2$. That proposition gives symmetry, separation and the triangle inequality for
$\mathsf D_{A_\theta,\lambda}$, hence for $\mathsf W_{\theta,\lambda}$.
:::

The choice $\theta(a)=a$ recovers $\Wass_2$; choices such as
$\theta(a)=a(1-a/M)$ encode volume-filling effects.

### Dynamic Spectral Wasserstein Distances

The static spectral distances of {ref}`sec-spectral-subspace-wasserstein`
penalize a coupling through the covariance of its displacement. A dynamic
version keeps the continuity equation but replaces the pointwise kinetic energy
by a gauge of the whole velocity covariance. The resulting action is nonlocal in
space: velocity directions are charged globally through their covariance, rather
than independently at each point.

Let $\gamma$ be a monotone spectral gauge on $\mathbb S_+^d$. For a probability
measure $\alpha$ and a velocity field $v\in L^2(\alpha;\RR^d)$, define the
spectral tangent action

```{math}
:label: eq-spectral-tangent-action
\mathbb A_\gamma(\alpha,v)
\eqdef
\gamma\!\left(\int v(x)v(x)^\top\d\alpha(x)\right).
```

The trace gauge gives the usual Wasserstein tangent action, while the operator
gauge $\gamma(M)=\lambda_{\max}(M)$ charges only the largest directional
velocity variance. With the length-distance notation introduced in
{eq}`eq-generalized-action-length-distance`, the associated dynamic action
distance is

```{math}
:label: eq-dynamic-spectral-wasserstein
\mathsf W_{\gamma,\mathrm{dyn}}^2
\eqdef
\mathsf D_{\mathbb A_\gamma}^2 .
```

In density--momentum variables, this corresponds to the measure action

```{math}
\mathbb J_\gamma(\alpha,\mu)
=
\gamma\!\left(\int
\left(\frac{\d\mu}{\d\alpha}\right)
\left(\frac{\d\mu}{\d\alpha}\right)^\top
\d\alpha\right),
```

or, when $\alpha=\rho\,\d x$ and $\mu=m\,\d x$,

```{math}
\mathbb J_\gamma(\rho,m)
=
\gamma\!\left(\int \frac{m(x)m(x)^\top}{\rho(x)}\,\d x\right).
```

This functional is convex in the density--momentum fields $(\rho,m)$ by the
matrix perspective, together with the monotonicity and convexity of $\gamma$. It
is nevertheless not, in general, obtained by integrating a pointwise action
density, because the covariance is computed globally before applying $\gamma$.
It becomes local only for linear spectral gauges. For instance, if
$\gamma(M)=\operatorname{tr}(GM)$ with $G\succeq0$, then the velocity and
momentum densities are

```{math}
A_{\mathrm{lin}}(a,w)=a\,w^\top G w,
\qquad
J_{\mathrm{lin}}(a,m)=\frac{m^\top G m}{a},
```

and the trace gauge, $G=\Id$ in $\gamma(M)=\operatorname{tr}(GM)$, recovers the
usual Benamou--Brenier action.

The following result, in the form used for normalized spectral flows in
{cite:p}`peyre2026muon`, shows that this dynamic construction is not merely
infinitesimal: it exactly recovers the static displacement-covariance
formulation.

(prop-static-dynamic-spectral-wasserstein)=
:::{admonition} Proposition: Static/Dynamic Equality for Spectral Wasserstein
:class: important
Let $\gamma$ be a monotone spectral gauge and let
$\alpha_0,\alpha_1\in\mathcal P_2(\RR^d)$. Then

```{math}
\mathsf W_{\gamma,\mathrm{dyn}}^2(\alpha_0,\alpha_1)
=
\Wass_\gamma^2(\alpha_0,\alpha_1).
```

In particular, $\Wass_\gamma$ defines a distance on $\Pp_2(\RR^d)$.
:::

:::{dropdown} Proof
First let $\pi\in\Couplings(\alpha_0,\alpha_1)$, let $(X,Y)\sim\pi$, set
$Z_t=(1-t)X+tY$ and $\alpha_t=(Z_t)_\sharp\pi$, and define the Eulerian velocity
as the conditional mean $v_t(z)=\mathbb E[Y-X\mid Z_t=z]$. Then
$(\alpha_t,v_t)$ solves the continuity equation. If
$M_\pi=\int(x-y)(x-y)^\top\d\pi(x,y)$ and
$C_t=\int v_t(z)v_t(z)^\top\d\alpha_t(z)$, conditional Jensen gives
$C_t\preceq M_\pi$: for every $u\in\RR^d$,

```{math}
u^\top C_tu
=
\mathbb E\!\left[\mathbb E[\langle u,Y-X\rangle\mid Z_t]^2\right]
\leq
\mathbb E[\langle u,Y-X\rangle^2]
=
u^\top M_\pi u .
```

Since $\gamma$ is monotone for the Loewner order,
$\int_0^1\gamma(C_t)\d t\leq\gamma(M_\pi)$. Infimizing over $\pi$ gives
$\mathsf W_{\gamma,\mathrm{dyn}}^2\leq\Wass_\gamma^2$.

Conversely, let $(\alpha_t,v_t)$ be a finite-action competitor. Since $\gamma$
is a finite positive gauge on the finite-dimensional cone $\mathbb S_+^d$, it is
equivalent to the trace on this cone; hence finite spectral action gives finite
kinetic energy. By the superposition principle, the competitor is represented by
a probability law $\eta$ on absolutely continuous paths satisfying
$\dot\omega_t=v_t(\omega_t)$. For the endpoint coupling
$\pi=(e_0,e_1)_\sharp\eta$, Jensen along each path gives

```{math}
(\omega_1-\omega_0)(\omega_1-\omega_0)^\top
\preceq
\int_0^1\dot\omega_t\dot\omega_t^\top\d t .
```

After integration over the path law, $M_\pi\preceq\int_0^1 C_t\d t$. Therefore
monotonicity and convexity of $\gamma$ imply

```{math}
\gamma(M_\pi)
\leq
\gamma\!\left(\int_0^1 C_t\d t\right)
\leq
\int_0^1\gamma(C_t)\d t .
```

The static value is thus no larger than any dynamic action. The crucial
hypothesis is the monotonicity of $\gamma$: the proof only produces Loewner-order
comparisons of covariance matrices, and these comparisons control the action
only for monotone gauges.
:::

The use of this geometry for normalized flows, including the operator-gauge connection with Muon-type normalization, is developed in {ref}`sec-normalized-spectral-wasserstein-dynamics`.

(sec-kernelized-bb-distance)=
### Kernelized Benamou--Brenier Distances

A different way to deform the Benamou--Brenier geometry is to keep the local
continuity equation but to measure velocities in a reproducing-kernel Hilbert
space rather than in $L^2(\alpha)$. This construction is motivated by Stein
variational gradient descent, studied later in {ref}`sec-svgd-generative-flow`:
the kernel makes the velocity field smooth and computable from particles, at
the price of defining a much more restrictive transport geometry.

Let $k$ be a positive definite kernel on $\RR^d$ with scalar RKHS
$\RKHS_k$. The vector-valued RKHS is

```{math}
\RKHS_k^d\eqdef \RKHS_k\times\cdots\times\RKHS_k,
\qquad
\norm{v}_{\RKHS_k^d}^2
\eqdef
\sum_{\ell=1}^d\norm{v_\ell}_{\RKHS_k}^2.
```

This is the vector-valued analogue of the scalar RKHS norm used for MMDs
in {ref}`sec-rkhs-mmd`. The specific kernelized tangent action is

```{math}
:label: eq-kernelized-bb-distance
\mathbb A_k(\alpha,v)
\eqdef
\norm{v}_{\RKHS_k^d}^2,
\qquad
\mathcal W_k^2
\eqdef
\mathsf D_{\mathbb A_k}^2,
```

where the general distance formula {eq}`eq-generalized-action-length-distance`
is understood with the restricted admissible tangent class
$v_t\in\RKHS_k^d$. The action itself is independent of $\alpha$; the measure only
enters through the continuity equation
$\partial_t\alpha_t+\diverg(\alpha_t v_t)=0$, which says how the common smooth
velocity field moves all particles. This type of Stein geometry was introduced
in the analysis of SVGD by Liu and Wang {cite:p}`LiuWang2016SVGD,Liu2017SVGDGradientFlow`
and later developed geometrically in {cite:p}`DuncanNueskenSzpruch2019SVGDGeometry,NueskenRenger2021SVGDAsymptotics`.
The important caveat is that the admissible tangent space is the smooth RKHS
class, not the whole Wasserstein tangent space.

(prop-kernelized-bb-distance)=
:::{admonition} Proposition: Kernelized Dynamic Distance
:class: important
The quantity $\mathcal W_k$ defined by {eq}`eq-kernelized-bb-distance` is an
extended distance on each finite-action component of probability measures. More
precisely, it is symmetric, satisfies the triangle inequality, and
$\mathcal W_k(\alpha_0,\alpha_1)=0$ implies $\alpha_0=\alpha_1$. It can take the
value $+\infty$ between different components.
:::

:::{dropdown} Proof
This is the standard length-space argument for a quadratic action. The constant
curve gives zero self-distance. If $\mathcal W_k(\alpha_0,\alpha_1)=0$, a
zero-action relaxed curve has $v_t=0$ for a.e. $t$, hence the continuity equation
gives $\partial_t\alpha_t=0$ and $\alpha_0=\alpha_1$. Symmetry follows by time
reversal and by replacing $v_t$ with $-v_{1-t}$. For the triangle inequality,
concatenate two almost optimal curves of actions $E_1$ and $E_2$. Compressing the
first into a time interval of length $\tau$ multiplies its action by $1/\tau$,
and compressing the second into length $1-\tau$ multiplies its action by
$1/(1-\tau)$. Optimizing over $\tau\in(0,1)$ gives
$(\sqrt{E_1}+\sqrt{E_2})^2$, and taking infima yields the triangle inequality.
:::

One should read $\mathcal W_k$ as an extended distance on finite-action
components, not as a replacement for $\Wass_2$ on all of $\Pp_2(\RR^d)$. A useful
sufficient condition for finiteness is that the endpoints lie on the same
RKHS-flow orbit: if there exists $v\in L^2([0,1];\RKHS_k^d)$ whose flow map
$\Phi_t$ solves $\dot\Phi_t=v_t\circ\Phi_t$ and satisfies
$\alpha_1=(\Phi_1)_\sharp\alpha_0$, then
$\mathcal W_k^2(\alpha_0,\alpha_1)\leq\int_0^1\norm{v_t}_{\RKHS_k^d}^2\d t$.
In particular, for strictly positive definite kernels, two discrete measures
with the same weights and distinct moving support points are at finite distance
whenever their atoms can be connected by noncolliding smooth paths, because RKHS
interpolation constructs vector fields realizing the prescribed atom velocities
along the paths.

The same condition also explains the limitation. If $k$ is smooth enough that
$\RKHS_k^d$ embeds into Lipschitz vector fields, finite-action curves are induced
by regular flows. Atomic measures remain atomic with the same number of atoms,
so a Dirac mass cannot be transported at finite kernelized action to a measure
with a density. This lack of splitting is precisely what makes the geometry
useful for deterministic particle methods, and also what makes it a nontrivial
extended object rather than a full probability metric.

(sec-nonlocal-wasserstein-distances)=
## Nonlocal Wasserstein Distances

The local dynamic distances above transport mass through a vector field on the
base space and a classical continuity equation. Nonlocal geometries use a
different tangent model: the elementary motion is an exchange across an edge or
a jump from $x$ to $y$. The common data are a reversible kernel $K$, a symmetric
edge or jump measure $\mathsf J$, a pairwise increment $\bar\nabla$, and a
pair-space action $\mathbb A_K$. The tangent variable is therefore attached to
pairs of points, not to a single point $x$, so these constructions are not
simply obtained by choosing another pointwise local action-density
$A(\rho(x),m(x))$.

There are two complementary versions. On a finite state space, the goal is to
put a Wasserstein-like geometry on the probability simplex so that the entropy
gradient flow is exactly a prescribed reversible Markov chain
{cite:p}`Maas2011,MielkeCVPDE,ChowHuangLiZhou2012`. On a continuum space, the
same edge calculus becomes a jump calculus over $\mathcal X\times\mathcal X$, which models
nonlocal motion, heavy-tailed jumps, and fractional-type diffusion; this is the
construction of Erbar {cite:p}`Erbar2012JumpEntropy`, building on nonlinear
mobilities {cite:p}`dolbeault2009new`, with subsequent metric and asymptotic
refinements {cite:p}`SlepcevWarren2022NonlocalWasserstein`.

In both settings the canonical mobility for entropy is the logarithmic mean

```{math}
:label: eq-logarithmic-mean
\theta(a,b)\eqdef
\begin{cases}
\displaystyle\frac{a-b}{\log a-\log b}, & a\neq b,\\[.4em]
a, & a=b,
\end{cases}
```

with the usual lower-semicontinuous extension at $a=0$ or $b=0$. It appears
because $\theta(a,b)(\log a-\log b)=a-b$, which is the edge-wise chain rule
identifying entropy-driven flows with the underlying reversible Markov or jump
dynamics.

### Continuum Jump Kernels

The continuum version replaces graph edges by a symmetric measure on pairs. Its
action is still quadratic, but the tangent variable is an antisymmetric jump
velocity $v(x,y)$, and the mobility depends simultaneously on the two endpoint
densities $\rho(x)$ and $\rho(y)$. It is best viewed as a convex action on the
pair space $\mathcal X\times\mathcal X$, rather than as an integral of independent costs
attached to single base points $x$.

Let $(\mathcal X,\mathfrak m)$ be a reference measure space, and let
$K(x,\cdot)$ be a nonnegative measure on $\mathcal X$ for each
$x\in\mathcal X$, possibly of infinite total mass. We write this kernel as
$K(x,\d y)$ to emphasize that the integration variable is $y$. The pair measure
$\mathsf J$ on
$\mathcal X\times\mathcal X$ is defined by testing against nonnegative measurable
functions $\Phi$:

```{math}
:label: eq-nonlocal-jump-measure
\int_{\mathcal X\times\mathcal X}\Phi(x,y)\,\mathsf J(\d x,\d y)
\eqdef
\int_{\mathcal X}\left(\int_{\mathcal X}\Phi(x,y)\,K(x,\d y)\right)\mathfrak m(\d x).
```

The reversibility assumption is precisely that this measure $\mathsf J$ is
symmetric, i.e. invariant under $(x,y)\mapsto(y,x)$. For a density
$\rho=\d\alpha/\d\mathfrak m$, write

```{math}
\bar\nabla \varphi(x,y)\eqdef \varphi(y)-\varphi(x)
```

for the nonlocal gradient, and use the logarithmic mean $\theta$ defined in
{eq}`eq-logarithmic-mean`. A curve $\alpha_t=\rho_t\mathfrak m$ driven by an
antisymmetric velocity $v_t(x,y)=-v_t(y,x)$ satisfies the nonlocal continuity
equation if, for all test functions $\varphi$,

```{math}
:label: eq-nonlocal-continuity-weak
\frac{\d}{\d t}\int \varphi\,\d\alpha_t
=
\frac12
\iint
\bar\nabla\varphi(x,y)\,
v_t(x,y)\,
\theta(\rho_t(x),\rho_t(y))\,
\mathsf J(\d x,\d y).
```

The corresponding pair-space tangent action is

```{math}
\mathbb A_K(\alpha,v)
\eqdef
\frac12
\iint
|v(x,y)|^2
\theta(\rho(x),\rho(y))\,
\mathsf J(\d x,\d y),
```

for $\alpha=\rho\mathfrak m$. This is the nonlocal analogue of a tangent action; here $v$ is not a vector field on $\mathcal X$ but an
antisymmetric velocity on pairs $(x,y)$.

The nonlocal transport distance is

```{math}
:label: eq-nonlocal-wasserstein-distance
\mathcal W_K^2(\alpha_0,\alpha_1)
\eqdef
\inf_{\rho_t,v_t}
\int_0^1
\mathbb A_K(\alpha_t,v_t)\,\d t,
```

where the infimum is over curves solving {eq}`eq-nonlocal-continuity-weak` with
endpoints $\alpha_0,\alpha_1$.

(prop-nonlocal-distance-properties)=
:::{admonition} Proposition: Metric Properties of Nonlocal Transport
:class: important
Under the regularity and irreducibility assumptions of {cite:t}`Erbar2012JumpEntropy`, $\mathcal W_K$ is an extended distance on the set of probability measures absolutely continuous with respect to $\mathfrak m$, and finite-distance pairs are connected by constant-speed geodesics.
:::

:::{dropdown} Proof
We use the analytic compactness and lower-semicontinuity theorem of
{cite:t}`Erbar2012JumpEntropy` for the logarithmic-mean action. Namely,
action-bounded sequences of admissible curves are compact for the narrow
topology, the weak nonlocal continuity equation is closed under this
convergence, and the action is lower semicontinuous.

Nonnegativity is immediate from the definition of $\mathbb A_K(\alpha,v)$. If
$\alpha_0=\alpha_1$, the constant curve $\rho_t=\rho_0$, $v_t=0$, is admissible
and has zero action.

Symmetry follows by time reversal. If $(\rho_t,v_t)$ transports $\alpha_0$ to
$\alpha_1$, set $\tilde\rho_t=\rho_{1-t}$ and $\tilde v_t=-v_{1-t}$. The weak
continuity equation is preserved by this change of time, and the quadratic
action is unchanged. Thus $\mathcal W_K(\alpha_0,\alpha_1)=\mathcal
W_K(\alpha_1,\alpha_0)$.

For the triangle inequality, let $(\rho^0_t,v^0_t)$ connect $\alpha_0$ to
$\alpha_1$ with action $A_0$, and let $(\rho^1_t,v^1_t)$ connect $\alpha_1$ to
$\alpha_2$ with action $A_1$. For $0<\zeta<1$, concatenate the two curves by

```{math}
(\rho_t,v_t)=
\begin{cases}
\bigl(\rho^0_{t/\zeta},\,\zeta^{-1}v^0_{t/\zeta}\bigr),
&0\leq t\leq\zeta,\\[.35em]
\bigl(\rho^1_{(t-\zeta)/(1-\zeta)},\,(1-\zeta)^{-1}v^1_{(t-\zeta)/(1-\zeta)}\bigr),
&\zeta<t\leq1.
\end{cases}
```

The velocity factors are exactly those required by the weak continuity equation
after time rescaling. Since $v\mapsto\mathbb A_K(\alpha,v)$ is quadratic, the concatenated
action is

```{math}
\frac{A_0}{\zeta}+\frac{A_1}{1-\zeta}.
```

Optimizing in $\zeta$, for instance taking
$\zeta=\sqrt{A_0}/(\sqrt{A_0}+\sqrt{A_1})$ when both actions are positive,
gives the action $(\sqrt{A_0}+\sqrt{A_1})^2$. Taking infima over the two curves
proves the triangle inequality.

If $\mathcal W_K(\alpha_0,\alpha_1)=0$, choose admissible curves with actions
tending to zero. Compactness and lower semicontinuity give a limiting admissible
curve of zero action. Hence $v_t=0$ for
$\theta(\rho_t(x),\rho_t(y))\mathsf J(\d x,\d y)\d t$-a.e. $(t,x,y)$, and the
weak continuity equation gives

```{math}
\frac{\d}{\d t}\int\varphi\,\d\alpha_t=0
```

for every admissible test function $\varphi$. The irreducibility/separation
assumption in {cite:t}`Erbar2012JumpEntropy` ensures that these test functions
determine the measure, so $\alpha_t$ is constant and $\alpha_0=\alpha_1$.

Finally, if $\mathcal W_K(\alpha_0,\alpha_1)<+\infty$, the same direct-method
compactness applied to a minimizing sequence gives a minimizer. Reparametrizing
this minimizing curve by metric arclength gives a constant-speed curve; after
this parametrization,

```{math}
\mathcal W_K(\alpha_s,\alpha_t)=(t-s)\mathcal W_K(\alpha_0,\alpha_1),
\qquad 0\leq s<t\leq1.
```

The consequences for entropy dynamics and fractional PDE examples are developed
in the nonlocal Wasserstein-flow section below.
:::

(sec-discrete-wasserstein-markov)=
### Discrete Wasserstein Distances on Markov Chains

The finite-state version keeps the same pair-space philosophy, but with a finite
graph of admissible exchanges. It is not the naive Euclidean metric on the
simplex. The key idea, introduced by Maas and independently developed in related
forms by Mielke and by Chow--Huang--Li--Zhou, is to use the transition graph of
a reversible Markov chain to define both the admissible directions and the
mobility of the mass {cite:p}`Maas2011,MielkeCVPDE,ChowHuangLiZhou2012`. The
entropy gradient-flow interpretation is stated later in
{ref}`prop-discrete-markov-entropy-gradient`.

Let $\mathcal X=\{1,\ldots,n\}$ and let $K=(K_{ij})$ denote the off-diagonal
transition rates of an irreducible continuous-time Markov chain reversible with
respect to a probability vector $\pi$, so that $\pi_iK_{ij}=\pi_jK_{ji}$ for
$i\neq j$. Write

```{math}
\mathsf J_{ij}\eqdef \pi_iK_{ij}=\pi_jK_{ji}
```

for the symmetric edge measure, the finite counterpart of the jump measure used
above. Write a probability $p\in\Sigma_n$ in density form $p_i=\pi_i\rho_i$,
where

```{math}
\Sigma_n\eqdef\left\{p\in\RR_+^n:\sum_i p_i=1\right\}.
```

The logarithmic mean $\theta$ defined in {eq}`eq-logarithmic-mean` is the
mobility selected so that the entropy calculus later recovers exactly the Markov
evolution. The identity $\theta(a,b)(\log a-\log b)=a-b$ converts entropy
gradients into density differences along graph edges. For a potential
$\psi\in\RR^n$, set

```{math}
\bar\nabla\psi(i,j)\eqdef\psi_j-\psi_i.
```

The finite nonlocal divergence is encoded by

```{math}
:label: eq-discrete-markov-onsager
(\mathcal K_\rho\psi)_i
\eqdef
\sum_j K_{ij}\theta(\rho_i,\rho_j)(\psi_i-\psi_j),
```

with tangent action

```{math}
:label: eq-discrete-markov-action
\mathbb A_K(\rho,\psi)
\eqdef
\frac12\sum_{i,j}\mathsf J_{ij}\theta(\rho_i,\rho_j)
(\bar\nabla\psi(i,j))^2.
```

This is the finite-state squared tangent action; the tangent
variable is the potential $\psi$, or equivalently the induced edge flux, rather
than an ambient Euclidean vector field.

The discrete transport distance is

```{math}
:label: eq-discrete-markov-distance
\mathcal W_K^2(\rho^0,\rho^1)
\eqdef
\inf_{\rho_t,\psi_t}
\int_0^1\mathbb A_K(\rho_t,\psi_t)\,\d t,
\qquad
\dot\rho_t+\mathcal K_{\rho_t}\psi_t=0,
```

with endpoints $\rho_0=\rho^0$, $\rho_1=\rho^1$. Equivalently, one can write
the same formula in edge-flux variables: flux is only allowed along edges where
$K_{ij}>0$, and the denominator in the kinetic energy is the logarithmic mean
of the two endpoint densities.

The first nontrivial finite Markov geometries already show how the logarithmic
mean bends the simplex. In both examples below, take the uniform random walk on
the complete neighbor graph, so $\pi_i=1/n$ and $K_{ij}=1/(n-1)$ for $i\neq j$.

:::{admonition} Example: Two-point complete graph
:class: ot4ml-example

On $\Sigma_2$, write $p=(r,1-r)$ and $q=(s,1-s)$. Since there is only one edge, the discrete dynamic problem reduces to the scalar Riemannian length

```{math}
:label: eq-two-state-markov-distance

\mathcal W_K(p,q)
=
\left|\int_s^r \frac{\d u}{\sqrt{\theta(u,1-u)}}\right|,
\qquad
0<r,s<1.
```

This formula is closed but not Euclidean: the logarithmic mean changes the cost of moving mass depending on the current split between the two points.
:::


:::{admonition} Example: Three-point complete graph
:class: ot4ml-example

On $\Sigma_3$, the complete-neighbor graph is a triangle. For $p\in\operatorname{int}(\Sigma_3)$, set

```{math}
a_{ij}(p)\eqdef\frac12\theta(p_i,p_j),
\qquad 1\leq i<j\leq3.
```

For a tangent vector $u\in\RR^3$ with $u_1+u_2+u_3=0$, orient the edges as $1\to2$, $1\to3$, $2\to3$. The squared norm induced by the discrete Wasserstein metric is

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

Eliminating the three edge fluxes gives an explicit formula. With $D=a_{12}^{-1}+a_{13}^{-1}+a_{23}^{-1}$,

```{math}
q_{12}^*=\frac{u_2/a_{23}-u_1/a_{13}}{D},
\qquad
q_{13}^*=-u_1-q_{12}^*,
\qquad
q_{23}^*=q_{12}^*-u_2,
```

and $\|u\|_p^2$ is obtained by inserting these values in {eq}`eq-three-state-markov-norm`. Therefore

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

Thus the three-state distance is an explicit two-dimensional Riemannian geodesic problem on the open triangle. The formula is simple enough to compute directly, but it already shows the main difference with Euclidean geometry on the simplex: the local metric depends nonlinearly on the current density through logarithmic edge mobilities.
:::


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
ordinary simplex distance induced by the $0/1$ ground metric.
:::

<iframe class="ot4ml-live-frame" title="Discrete Markov-chain simplex distance controls" src="../live/dynamic-markov-simplex.html" loading="lazy" style="width:100%;height:480px;border:0;display:block;"></iframe>

(sec-unbalanced-ot)=
### Dynamic Unbalanced OT

Balanced dynamic distances keep total mass fixed: their tangent variables are
transport velocities or fluxes satisfying a continuity equation. Unbalanced
distances use a different tangent model. A tangent variable now has both a
spatial component and a reaction component, so mass can move, disappear and
reappear. This reaction--transport geometry is introduced here before its use
for gradient flows in {ref}`sec-dynamic-unbalanced-wfr-flows`.

Unbalanced dynamic transport is obtained by allowing mass to be created and
destroyed along the path. The continuity equation is replaced by a balance
equation, and the action penalizes both spatial motion and growth. This dynamic
formulation underlies the Hellinger--Kantorovich and Wasserstein--Fisher--Rao
metrics {cite:p}`LieroMielkeSavareShort,2017-chizat-focm`; its equivalence with
static entropy-transport and cone formulations is developed in
{cite:p}`LieroMielkeSavareLong,2015-chizat-unbalanced`.

A representative quadratic action is

```{math}
\partial_t\rho_t+\nabla\!\cdot m_t=s_t,
\qquad
\int_0^1\!\int
\left(\frac{|m_t|^2}{\rho_t}+\kappa^2\frac{s_t^2}{\rho_t}\right)\d x\,\d t,
```

with the usual perspective convention: zero flux and zero source through zero
density cost nothing, whereas nonzero flux or source through zero density has
infinite cost. Equivalently, writing $m_t=\rho_t v_t$ and
$s_t=\rho_t g_t$, one minimizes
$\int_0^1\int(\norm{v_t}^2+\kappa^2 g_t^2)\rho_t\,\d x\,\d t$ under
$\partial_t\rho_t+\nabla\!\cdot(\rho_t v_t)=g_t\rho_t$. The parameter
$\kappa$ fixes the relative cost of reaction and transport.

On the velocity side the pointwise action is

```{math}
:label: eq-wfr-velocity-action
A_\kappa(a,w,g)
\eqdef
a\bigl(\norm{w}^2+\kappa^2 g^2\bigr).
```

On the momentum side, with $m=aw$ and $r=ag$, the three-variable perspective is

```{math}
:label: eq-wfr-momentum-perspective
J_\kappa(a,m,r)
\eqdef
\begin{cases}
\displaystyle\frac{\norm{m}^2+\kappa^2 r^2}{a}, & a>0,\\
0, & a=0,\ m=0,\ r=0,\\
+\infty, & a=0,\ (m,r)\neq(0,0).
\end{cases}
```

For measure-valued triples, $\alpha$ denotes the transported measure, $\mu$ the
vector-valued flux measure, and $\sigma$ the signed source measure. If
$\lambda$ dominates $\alpha$, $|\mu|$ and $|\sigma|$, define

```{math}
:label: eq-wfr-measure-action
\mathbb J_\kappa(\alpha,\mu,\sigma)
\eqdef
\int
J_\kappa\!\left(
\frac{\d\alpha}{\d\lambda},
\frac{\d \mu}{\d\lambda},
\frac{\d \sigma}{\d\lambda}
\right)\d\lambda .
```

The one-homogeneity of $J_\kappa$ makes this definition independent of the
chosen dominating measure.

(prop-static-dynamic-unbalanced)=
:::{admonition} Proposition: Static/Dynamic Equivalence for Unbalanced OT
:class: important
Fix the action above and let $\mathcal C\mathcal W_\kappa$ be the cone value
with the cone metric normalized to the same growth scale $\kappa$. For
nonnegative finite measures $\alpha_0,\alpha_1$ on $\RR^d$, the dynamic value

```{math}
:label: eq-dynamic-unbalanced-ot
\WFR_\kappa^2(\alpha_0,\alpha_1)
\eqdef
\inf_{\substack{\partial_t\alpha_t+\nabla\cdot \mu_t=\sigma_t\\
\alpha_{t=0}=\alpha_0,\ \alpha_{t=1}=\alpha_1}}
\int_0^1
\mathbb J_\kappa(\alpha_t,\mu_t,\sigma_t)\,\d t
```

equals the static cone formulation $\mathcal C\mathcal W_\kappa(\alpha_0,\alpha_1)$. Hence the static unbalanced problem and the balance-equation least-action problem define the same geodesic distance.
:::

:::{dropdown} Proof
The cone construction turns variation of mass into radial motion and spatial
transport into angular motion on $\mathfrak C[\RR^d]$. Applying the
Benamou--Brenier theorem on the cone to the lifted endpoint measures gives a
dynamic least-action problem on $\mathfrak C[\RR^d]$ whose static value is the
cone value. Projecting a cone curve back to the base space with weight $r^2$
produces a measure curve, a spatial flux and a source term satisfying the
balance equation. Conversely, any finite-action triple can be lifted to a cone
curve with the same relaxed action. This gives the static/dynamic identity; see
{cite:p}`LieroMielkeSavareShort,LieroMielkeSavareLong,2017-chizat-focm,2015-chizat-unbalanced`.
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

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the growth and time controls to compare motion with source terms in dynamic unbalanced transport.
:::

<iframe class="ot4ml-live-frame" title="Dynamic unbalanced transport controls" src="../live/dynamic-unbalanced.html" loading="lazy" style="width:100%;height:510px;border:0;display:block;"></iframe>
