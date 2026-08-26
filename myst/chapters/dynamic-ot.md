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
principle. The path-space Schrodinger problem then provides its stochastic,
entropy-regularized counterpart. After extending dynamic actions to other
transport geometries, the chapter closes with variational mean field games,
where congestion and a terminal cost turn the Benamou--Brenier action into a
population-planning problem. These ideas prepare the gradient-flow and
generative-model chapters that follow.

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
for empirical measures, it is understood in the distributional sense: for
every $\varphi\in C_c^1((0,1)\times\RR^d)$,

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

The interior identity does not record endpoint traces or boundary conditions.
The boundary-aware version supplies the admissible class used throughout the
chapter.

(def-admissible-continuity-evolution)=
:::{admonition} Definition: Admissible Continuity-Equation Evolution
:class: ot4ml-definition

Let $\Omega=\RR^d$, or let $\Omega\subset\RR^d$ be a bounded Lipschitz
domain. A narrowly continuous curve $(\alpha_t)_{t\in[0,1]}$ in
$\Pp(\overline\Omega)$ and a jointly Borel velocity field $v_t(x)$ are
admissible between $\alpha_0$ and $\alpha_1$ if

```{math}
\int_0^1\!\int_{\overline\Omega}\norm{v_t(x)}^2\d\alpha_t(x)\d t<+\infty
```

and, for every $\varphi\in C^1([0,1]\times\overline\Omega)$, compactly
supported in space when $\Omega=\RR^d$,

```{math}
:label: eq-continuity-endpoint-no-flux
\int_0^1\!\int_{\overline\Omega}
\left(\partial_t\varphi+\dotp{v_t}{\nabla_x\varphi}\right)\d\alpha_t\d t
+\int_{\overline\Omega}\varphi(0,\cdot)\d\alpha_0
-\int_{\overline\Omega}\varphi(1,\cdot)\d\alpha_1=0.
```

On a bounded domain, allowing tests that do not vanish on $\partial\Omega$
encodes the zero-normal-flux condition $(\alpha_t v_t)\cdot n=0$ weakly.
:::

(prop-lagrangian-flow-continuity)=
:::{admonition} Proposition: Lagrangian Flows Solve the Continuity Equation
:class: important
Let $(T_t)_{t\in[0,1]}$ be a $C^1$ family of diffeomorphisms of $\RR^d$ and
define $\alpha_t=(T_t)_\sharp\alpha_0$. Assume that the derivatives below are
integrable with respect to $\alpha_0$, and define the Eulerian velocity field by

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
Let $\varphi\in C_c^1((0,1)\times\RR^d)$.
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
\{v\in L^2(\alpha;\RR^d):\operatorname{div}(\alpha v)=0
\text{ in distributions}\}.
```

It is usually non-trivial: if $\alpha$ is an isotropic Gaussian,
$\mathcal H_\alpha$ contains rotational vector fields generated by
anti-symmetric matrices.

### Dacorogna--Moser Inversion

Reconstructing particles from an observed density evolution is therefore
ill-posed. For a smooth positive density $\alpha_t=\rho_t\,\d x$, a simple
choice, introduced by Dacorogna and Moser {cite:p}`DacorognaMoser1990`, imposes
that the flux $\rho_t v_t$ is a gradient field. With a fixed convention for
the inverse Laplacian,

```{math}
:label: eq-dacorogna-moser
v_t
=
-\frac{1}{\rho_t}
\nabla\Delta^{-1}(\partial_t\rho_t),
```

with suitable boundary conditions, for instance vanishing at infinity. This
formula is useful conceptually but delicate when $\rho_t$ vanishes, and it
does not generally produce a gradient velocity field.

The classical Dacorogna--Moser construction uses the linear density path. If
$\alpha_i=\rho_i\,\d x$ are smooth positive densities with the same total mass
on a bounded connected domain $\Omega$, set

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
Assume that $\alpha_t=\rho_t\,\d x$ is a smooth positive density curve, that
$\partial_t\rho_t$ has zero integral, and that boundary terms vanish. The
minimizer of {eq}`eq-least-square-field`, if it exists, is a gradient field

```{math}
v_t=\nabla\phi_t,
```

where $\phi_t$, unique up to an additive constant on each connected component,
solves the weighted Poisson equation

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
density and $T$ is the optimal Monge map $T_\sharp\alpha_0=\alpha_1$, a
minimizing curve is

```{math}
:label: eq-static-to-dynamic
\alpha_t=((1-t)\Id+tT)_\sharp\alpha_0,
\qquad
v_t((1-t)x+tT(x))=T(x)-x
\quad\text{for $\alpha_0$-a.e. $x$ and a.e. $t\in(0,1)$}.
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

(convex-moment-based-reformulation)=
#### Convex Momentum-Based Reformulation

Although {eq}`eq-benamou-brenier` is not jointly convex in $(\alpha_t,v_t)$,
it becomes convex after replacing velocities by momenta. Given
$v\in L^2(\alpha;\RR^d)$, define the momentum

```{math}
\omega\eqdef \alpha v,
\qquad
\omega(B)=\int_B v(x)\,\d\alpha(x),
```

which is a finite $\RR^d$-valued measure. The nonlinear relation
$\omega=\alpha v$ is eliminated by the quadratic perspective

```{math}
:label: eq-quadratic-perspective
J(a,m)
\eqdef
\begin{cases}
\norm{m}^2/a, & a>0,\\
0, & a=0\ \text{and}\ m=0,\\
+\infty, & a=0\ \text{and}\ m\neq0,
\end{cases}
\qquad
(a,m)\in[0,+\infty)\times\RR^d.
```

This lower-semicontinuous convex function is positively $1$-homogeneous:
$J(\eta a,\eta m)=\eta J(a,m)$ for $\eta\geq0$. If $\lambda$ is any positive
measure dominating both $\alpha$ and the total variation $|\omega|$, set

```{math}
:label: eq-measure-perspective-action
\mathbb J(\alpha,\omega)
\eqdef
\int
J\left(
\frac{\d\alpha}{\d\lambda}(x),
\frac{\d\omega}{\d\lambda}(x)
\right)\d\lambda(x).
```

The value is independent of the dominating measure: both Radon--Nikodym
densities change by the same factor, and the $1$-homogeneity of $J$ cancels
the change of reference measure. This is the integral functional associated
with a convex normal integrand in the measure-valued relaxation of dynamic OT
{cite:p}`ambrosio2006gradient`; see also the perspective construction in
{cite:p}`rockafellar2015convex`. Moreover,

```{math}
\mathbb J(\alpha,\omega)<+\infty
\quad\Longleftrightarrow\quad
\omega=v\alpha\ \text{with}\ v\in L^2(\alpha;\RR^d),
\qquad
\mathbb J(\alpha,\omega)=\int\norm{v}^2\,\d\alpha.
```

The Benamou--Brenier problem therefore has the convex measure formulation

```{math}
:label: eq-benamou-brenier-convex
\Wass_2^2(\alpha_0,\alpha_1)
=
\inf_{\substack{\partial_t\alpha_t+\operatorname{div}\omega_t=0\\
\alpha_{t=0}=\alpha_0,\ \alpha_{t=1}=\alpha_1}}
\int_0^1\mathbb J(\alpha_t,\omega_t)\,\d t.
```

In the absolutely continuous case $\alpha_t=\rho_t\,\d x$ and
$\omega_t=m_t\,\d x$, this reduces to the familiar integral of
$J(\rho_t,m_t)=\norm{m_t}^2/\rho_t$, with the zero-density conventions already
encoded in {eq}`eq-quadratic-perspective`. This convex reformulation enables
geodesic interpolation by convex optimization after discretization.

:::{admonition} Remark: Perspective Transform Gives Convexity
:class: note
The same perspective mechanism already proves the joint convexity of
$\phi$-divergences in {ref}`sec-phi-div`: there one uses the density-ratio
perspective in {eq}`eq-phi-div-web`, whereas here one uses
$J(a,m)=\norm m^2/a$. The generalized momentum perspective
{eq}`eq-general-momentum-perspective`, concave-mobility action
{eq}`eq-concave-mobility-perspective`, and unbalanced three-variable action
{eq}`eq-wfr-momentum-perspective` are later instances of the same
convexification principle.
:::

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

Thus $(-\phi_0,\phi_1)$ is a feasible static Kantorovich dual pair for the
quadratic cost. At optimality the inequality is saturated on the endpoint pairs
connected by the primal characteristics.

Figure {ref}`fig:dynamic-benamou-brenier-duality` displays these primal--dual
relations for a one-dimensional mixture transport, including the
Hamilton--Jacobi contact identity along the active mass.

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

**Input:** Functionals $\mathcal F,\mathcal G=\iota_{\mathcal C}$, proximal
parameter $\tau>0$, initial field $Z^0$, tolerance $\mathrm{tol}>0$, and
maximum iteration count $K\geq1$.

**Output:** Discrete density-momentum field $U^\star$.

**For** $k=0,\ldots,K-1$ **do**:

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

**Return** $U^K$.
:::

Figure {ref}`fig:dynamic-benamou-brenier-geodesic` complements the Eulerian
optimization viewpoint with the Lagrangian picture: matched particles travel
along the straight characteristics of the minimizing curve.


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
e_t:\Ss\to\RR^d,
\qquad
e_t(\gamma)=\gamma(t).
```

The Benamou--Brenier cost admits the equivalent formulation

```{math}
\Wass_2^2(\alpha_0,\alpha_1)
=
\inf_{M\in\Pp(\Ss)}
\enscond{
\int_{\Ss}\!\int_0^1\norm{\dot\gamma(t)}^2\d t\,\d M(\gamma)
}{
(e_0)_\sharp M=\alpha_0,\ (e_1)_\sharp M=\alpha_1
}.
```

The inner energy is understood as $+\infty$ outside the absolutely continuous
paths. If $\alpha_0$ has a density, the minimizer $M^*$ is unique. Its time
marginals reproduce the optimal curve: $\alpha_t=(e_t)_\sharp M^*$ for all
$t$. Furthermore, for a.e. $t$, the conditional law of the path velocity is
deterministic:

```{math}
(e_t,\dot e_t)_\sharp M^*(\d x,\d q)
=
\alpha_t(\d x)\delta_{v_t^*(x)}(\d q),
```

where $v_t^*$ is the optimal velocity field in the Benamou--Brenier formulation. Hence $M^*$ concentrates on straight-line geodesics and, for a.e. $t$, assigns exactly one direction at $\alpha_t$-a.e. spatial point.


(sec-path-space-schrodinger)=
## Path-Space Schrödinger Problem

The path-space formulation above fills each endpoint pair by a deterministic
least-action path. Schrödinger's reciprocal problem replaces this path by the
conditional trajectory of a noisy reference dynamics. Optimizing the
conditional path laws leaves an entropic problem over endpoint couplings, which
connects dynamic transport with the Sinkhorn problem of Chapter
{ref}`sec-sinkhorn`.

### From Least-Action Paths to Random Bridges

Let $\X$ be a Polish state space equipped with a compatible complete bounded
metric and equip $\Om=C([0,1];\X)$ with the uniform metric. Then $\Om$ is
Polish, the evaluations $e_t(\omega)=\omega_t$ are continuous, and regular
conditional path laws exist.

(def-path-space-transport)=
:::{admonition} Definition: Path-Space Least Action
:class: ot4ml-definition

For a lower-semicontinuous path action $\mathcal{A}:\Om\to[0,+\infty]$, define

```{math}
:label: eq-path-space-ot
\operatorname{PT}_{\mathcal{A}}(\alpha,\beta)
\eqdef
\inf_{M\in\Pp(\Om)}
\enscond{\int_\Om \mathcal{A}(\omega)\,\d M(\omega)}
{(e_0)_\sharp M=\alpha,\ (e_1)_\sharp M=\beta}.
```
:::

For quadratic Euclidean transport,
$\mathcal{A}(\omega)=\int_0^1\norm{\dot\omega_t}^2\d t$ on absolutely continuous
paths and $+\infty$ otherwise. The induced endpoint cost is

```{math}
:label: eq-path-action-endpoint-cost
c_{\mathcal{A}}(x,y)
\eqdef
\inf_{\substack{\omega\in\Om\\e_0(\omega)=x,\ e_1(\omega)=y}}
\mathcal{A}(\omega).
```

It is lower semianalytic, hence universally measurable. In the quadratic
Euclidean case, $c_{\mathcal{A}}(x,y)=\norm{x-y}^2$.

(prop-path-space-ot-endpoint-reduction)=
:::{admonition} Proposition: Endpoint Reduction of Path-Space Transport
:class: ot4ml-proposition

Assume that for every $\delta>0$ there is a universally measurable selection
$(x,y)\mapsto\omega_\delta^{x,y}$ with the prescribed endpoints and
$\mathcal{A}(\omega_\delta^{x,y})\leq c_{\mathcal{A}}(x,y)+\delta$ whenever the endpoint cost
is finite. Then {eq}`eq-path-space-ot` equals

```{math}
\inf_{\pi\in\Couplings(\alpha,\beta)}\int c_{\mathcal{A}}(x,y)\d\pi(x,y).
```

If an optimal endpoint coupling $\pi^\star$ and an exact minimizing selection
exist, the optimal path law is
$M^\star=\int\delta_{\omega^{x,y}}\d\pi^\star(x,y)$.
:::

:::{dropdown} Proof
Every feasible path law induces
$\pi=(e_0,e_1)_\sharp M$ and satisfies
$\int\mathcal{A}\d M\geq\int c_{\mathcal{A}}\d\pi$. Conversely, mixing the selected
$\delta$-optimal paths against any endpoint coupling gives the reverse
inequality after $\delta\downarrow0$. Exact selections yield the stated
optimizer.
:::

### Entropic Path-Space Problem

Let $\mathsf R^\epsilon\in\Pp(\Om)$ be a Brownian, Langevin, or other reference
path law at noise level $\epsilon$.

(def-schrodinger-bridge)=
:::{admonition} Definition: Schrödinger Bridge
:class: ot4ml-definition

```{math}
:label: eq-schrodinger-path-space
\mathrm{SB}_\epsilon(\alpha,\beta)
\eqdef
\inf_{M\in\Pp(\Om)}
\enscond{\epsilon\KL(M\mid\mathsf R^\epsilon)}
{(e_0)_\sharp M=\alpha,\ (e_1)_\sharp M=\beta}.
```
:::

This is Schrödinger's entropy projection of a prior dynamics onto prescribed
endpoint marginals {cite:p}`Schroedinger31,LeonardSchroedinger`. For the
reference $\d X_t=\sqrt\epsilon\,\d B_t$ started from $\alpha$, Girsanov's
formula gives, under its usual integrability assumptions,

```{math}
\epsilon\KL(M\mid\mathsf R^\epsilon)
=\frac12\mathbb E_M\int_0^1\norm{u_t}^2\d t
```

when $M$ has controlled drift $u_t$. Thus the bridge is the least energetic
drift change steering the Brownian prior from $\alpha$ to $\beta$.

(prop-schrodinger-endpoint-reduction)=
:::{admonition} Proposition: Endpoint Reduction of the Schrödinger Problem
:class: ot4ml-proposition

Let $\mathsf R_{0,1}^\epsilon=(e_0,e_1)_\sharp\mathsf R^\epsilon$ and assume that regular
conditional bridge laws $\mathsf R^{\epsilon,x,y}$ exist. Then

```{math}
:label: eq-schrodinger-static-endpoint
\mathrm{SB}_\epsilon(\alpha,\beta)
=\inf_{\pi\in\Couplings(\alpha,\beta)}
\epsilon\KL(\pi\mid\mathsf R_{0,1}^\epsilon).
```

For a fixed finite-entropy endpoint coupling, the minimizing path law is

```{math}
:label: eq-schrodinger-bridge-mixture
M^\pi=\int\mathsf R^{\epsilon,x,y}\d\pi(x,y).
```
:::

:::{dropdown} Proof
Disintegrating $M$ and the reference with respect to their endpoints gives the
entropy chain rule

```{math}
:label: eq-kl-chain-rule-path
\KL(M\mid\mathsf R^\epsilon)
=\KL(\pi\mid\mathsf R_{0,1}^\epsilon)
+\int\KL(M^{x,y}\mid\mathsf R^{\epsilon,x,y})\d\pi(x,y).
```

The second term is nonnegative and vanishes exactly for the mixture of
reference bridges.
:::

A zero-noise conclusion requires a path-space large-deviation theorem, not
only this definition. If $\mathsf R^\epsilon$ satisfies an LDP with speed
$1/\epsilon$ and good action $\mathcal{A}$, and exponential tightness plus the endpoint
constraints yield constrained $\Gamma$-convergence, then minima and suitably
precompact minimizers converge to the unregularized path problem
{cite:p}`leonard2012schrodinger`. For
$\d X_t=\sqrt\epsilon\,\d B_t$, the rate action is
$\frac12\int_0^1\norm{\dot\omega_t}^2\d t$, so the limiting endpoint cost is
$\norm{x-y}^2/2$.

### Brownian Bridges and Sinkhorn Couplings

For $\d X_t=\sqrt\epsilon\,\d B_t$, the unit-time Brownian transition density is

```{math}
p_\epsilon(x,y)=(2\pi\epsilon)^{-d/2}
\exp(-\norm{x-y}^2/(2\epsilon)).
```

Thus $\epsilon\KL$ produces the cost $\norm{x-y}^2/2$; the usual quadratic
Sinkhorn convention $e^{-\norm{x-y}^2/\epsilon}$ corresponds to Brownian noise
variance $\epsilon/2$. More generally, suppose that for reference probability
measures $\bar\alpha,\bar\beta$ the endpoint prior is, with
$0<Z_\epsilon<+\infty$,

```{math}
\mathsf R_{0,1}^\epsilon(\d x,\d y)
=Z_\epsilon^{-1}e^{-c(x,y)/\epsilon}
\bar\alpha(\d x)\bar\beta(\d y),
```

with $\alpha\ll\bar\alpha$ and $\beta\ll\bar\beta$. For every feasible
coupling, the chain rule gives

```{math}
\epsilon\KL(\pi|\mathsf R_{0,1}^\epsilon)
=\int c\,\d\pi+\epsilon\KL(\pi|\alpha\otimes\beta)
+\epsilon\KL(\alpha|\bar\alpha)+\epsilon\KL(\beta|\bar\beta)
+\epsilon\log Z_\epsilon.
```

The last three terms are fixed by the marginals, so
{eq}`eq-schrodinger-static-endpoint` is the continuous Sinkhorn problem up to
an additive constant. If Brownian motion starts from $\alpha$ and
$\beta=b\,\d y$, the same identity contains the fixed one-body term
$\epsilon\int\log b\,\d\beta$. Thus the needed domination is
$\beta\ll\d y$ (and $\alpha\ll(\mathsf R^\epsilon)_0$ for another initial reference),
not an absolute-continuity relation between $\alpha$ and $\beta$.

(fig:sinkhorn-path-space-bridges)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-path-space-bridges")
```

*Schematic endpoint couplings lifted to Brownian bridges. The discrete picture
is literal for a reciprocal reference obtained by mixing endpoint-conditioned
Brownian bridges with a discrete endpoint prior; an ordinary unconditioned
Brownian reference cannot have an atomic terminal law at finite entropy.*
:::


(sec-generalized-dynamic-wasserstein-distances)=
## Generalized Dynamic Wasserstein Distances

The quadratic Benamou--Brenier formula is only one instance of a broader
fixed-mass dynamic language. The goal of this section is to define a large
family of geodesic-like geometries on spaces of probability measures by
modifying the action minimized in the Benamou--Brenier formula. An arbitrary
action first defines only a path value; metric properties require the symmetry,
homogeneity, nondegeneracy, and closure assumptions isolated below. All descent
constructions are postponed to
{ref}`sec-generalized-dynamic-wasserstein-flows`, where these distances are used
to generate gradient-flow PDE models.

### Path Actions

The common construction replaces the quadratic kinetic energy in the
Benamou--Brenier formula by an instantaneous action while retaining the
continuity equation and endpoint constraints.

In the mass-preserving Euclidean setting, the basic input is an instantaneous
action $\mathbb A(\alpha,w)$, where $\alpha$ is the current measure and $w$ is
an admissible velocity representative.

(def-generalized-dynamic-action-distance)=
:::{admonition} Definition: Generalized Dynamic Action Value
:class: ot4ml-definition

```{math}
:label: eq-generalized-action-length-distance
\mathsf E_{\mathbb A}(\alpha_0,\alpha_1)
\eqdef
\inf_{\alpha_t,v_t}
\left\{
\int_0^1 \mathbb A(\alpha_t,v_t)\,\d t
:
\partial_t\alpha_t+\operatorname{div}(\alpha_t v_t)=0,
\ \alpha_{t=0}=\alpha_0,
\ \alpha_{t=1}=\alpha_1
\right\}.
```
:::

Equivalently, one may quotient by velocity fields that induce the same
first-order variation of the measure. This value need not be symmetric or
separate measures, and its square root need not satisfy the triangle
inequality. For an $r$-homogeneous action satisfying Proposition
{ref}`prop-homogeneous-dynamic-action-distance`, its $r$-th root is a distance.
Some standard distances, such as $\Wass_p$, are first written with a
$p$-homogeneous action and then squared by taking a constant-speed
parametrization; this normalization is made explicit below.
Different choices of $\mathbb A$ change the resulting geometry;
{ref}`sec-generalized-dynamic-wasserstein-flows` later reuses these choices
when dynamics are introduced.

### Quadratic, or Riemannian, Tangent Actions

A particularly transparent case occurs when $w\mapsto\mathbb A(\alpha,w)$ is
quadratic. For simplicity, take admissible velocities in
$L^2(\alpha;\RR^d)$; in some applications this Hilbert space is replaced by a
closed subspace encoding additional constraints. Suppose the polarization of
$\mathbb A$ is represented by a positive self-adjoint operator
$Q_\alpha:L^2(\alpha;\RR^d)\to L^2(\alpha;\RR^d)$,

```{math}
\mathbb A(\alpha;w,z)
=
\left\langle Q_\alpha w,z\right\rangle_{L^2(\alpha)},
\qquad
\mathbb A(\alpha,w)=\left\langle Q_\alpha w,w\right\rangle_{L^2(\alpha)},
```

To obtain a genuine tangent norm, this quadratic form must be nondegenerate
after quotienting velocity fields that induce the same measure variation.

The associated quadratic path value is

```{math}
:label: eq-general-quadratic-tangent-action
\mathsf D_Q^2(\alpha_0,\alpha_1)
=
\mathsf E_{\mathbb A}(\alpha_0,\alpha_1)
=
\inf_{\substack{\partial_t\alpha_t+\operatorname{div}(\alpha_t v_t)=0\\
\alpha_{t=0}=\alpha_0,\ \alpha_{t=1}=\alpha_1}}
\int_0^1
\left\langle Q_{\alpha_t}v_t,v_t\right\rangle_{L^2(\alpha_t)}
\d t .
```

If the dynamic problem is also sequentially closed and attains finite infima
as in {ref}`prop-homogeneous-dynamic-action-distance`, $\mathsf D_Q$ is an
extended distance. The usual $\Wass_2$ geometry corresponds to $Q_\alpha=\Id$ in this simplified
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
which convexity and metric properties are easiest to read. Set $\omega=\alpha w$,
so that $\omega$ is a vector-valued measure. When the local description is written
with the same reference $\lambda$, so that $\alpha=a\lambda$ and
$\omega=m\lambda$, the pointwise momentum perspective is

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

and the measure action relative to $\lambda$ is

```{math}
:label: eq-general-measure-momentum-action
\mathbb J_{A,\lambda}(\alpha,\omega)
\eqdef
\int
J_A\!\left(
\frac{\d\alpha}{\d\lambda},
\frac{\d\omega}{\d\lambda}
\right)\d\lambda,
```

with value $+\infty$ if $\alpha$ or the total variation $|\omega|$ is not absolutely continuous with
respect to $\lambda$. This zero-density convention is the lower-semicontinuous
one for the superlinear actions used below; other growths use the corresponding
recession extension. If $A$ is positively $1$-homogeneous in $a$, then $J_A$ is
jointly $1$-homogeneous: $J_A(\eta a,\eta m)=\eta J_A(a,m)$. In that intrinsic
case the value of $\mathbb J_{A,\lambda}$ is independent of the dominating
reference measure, and we write simply $\mathbb J_A$.
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
Fix a reference measure $\lambda$, omitted from the notation only in the
intrinsic case where $\mathbb J_{A,\lambda}$ does not depend on $\lambda$.
Assume that the momentum perspective $J_A$ defined in
{eq}`eq-general-momentum-perspective` is lower semicontinuous, convex in
$(a,m)$, even in $m$, and satisfies $J_A(a,0)=0$ on its effective density
domain. Assume moreover that for some $r>1$

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
\qquad (a>0\text{ admissible}).
```

For a mass $M\geq0$, define the effective state space

```{math}
\mathcal S_{A,\lambda}^M
\eqdef
\left\{\alpha=a\lambda:\ \alpha(\mathcal X)=M,\
J_A(a(x),0)=0\ \lambda\text{-a.e.}\right\}.
```

For endpoints in this state space, define

```{math}
\mathsf D_{A,\lambda}(\alpha_0,\alpha_1)
\eqdef
\inf_{\substack{\partial_t\alpha_t+\diverg\omega_t=0\\
\alpha_{t=0}=\alpha_0,\ \alpha_{t=1}=\alpha_1}}
\left(
\int_0^1\mathbb J_{A,\lambda}(\alpha_t,\omega_t)\,\d t
\right)^{1/r}.
```

Assume finally that the relaxed dynamic problem is sequentially closed and
attains its infimum whenever the value is finite. Then
$\mathsf D_{A,\lambda}$ is an extended distance on
$\mathcal S_{A,\lambda}^M$ and a genuine distance on each finite-action
component: it is symmetric, satisfies the triangle inequality, and
$\mathsf D_{A,\lambda}(\alpha_0,\alpha_1)=0$ only when $\alpha_0=\alpha_1$.
In the intrinsic case, the reference is omitted and we write $\mathsf D_A$.
:::

:::{dropdown} Proof
Zero self-distance is obtained by the constant curve. Conversely, if the
distance is zero, attainment supplies a relaxed zero-action minimizer. Thus
$\mathbb J_{A,\lambda}(\alpha_t,\omega_t)=0$ a.e., hence
$\omega_t=0$ a.e.; the continuity equation then gives $\alpha_0=\alpha_1$.
Symmetry follows by time reversal and evenness in $m$. For the triangle
inequality, concatenate two almost optimal curves with
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
the usual identity $\mathsf D_{A_p}=\Wass_p$. The corresponding squared length-space normalization is

```{math}
\mathbb A_p(\alpha,w)
=
\left(\int\norm{w}^p\d\alpha\right)^{2/p}.
```

This is the squared version of the $p$-homogeneous action: minimizing
$\int_0^1\mathbb A_p(\alpha_t,v_t)\d t$ gives $\Wass_p^2$ after
constant-speed reparametrization. Thus $A_p,J_p$ denote the local
$p$-homogeneous velocity and momentum densities, whereas $\mathbb A_p$ denotes
the squared tangent action used in the length formulation. The endpoint $p=1$ can be
treated separately: $J_1(a,m)=\norm m$, and the dynamic problem collapses to
Beckmann's formulation of $\Wass_1$ {cite:p}`Beckmann52`.
:::

### Concave-Mobility Actions

One can instead keep a quadratic momentum action and change the mobility.
Dolbeault, Nazaret and Savaré introduced this construction as a class of
generalized transport distances adapted to nonlinear diffusion
{cite:p}`dolbeault2009new`.

(def-concave-mobility-distance)=
:::{admonition} Definition: Concave-Mobility Dynamic Distance
:class: ot4ml-definition

Let $I\subset[0,+\infty)$ be a closed convex interval and let
$\theta:I\to[0,+\infty)$ be continuous and concave, with $\theta>0$ on the
relative interior of $I$. Define the closed momentum perspective

```{math}
J_\theta(a,m)
\eqdef
\begin{cases}
\norm{m}^2/\theta(a), & a\in I,\ \theta(a)>0,\\
0, & a\in I,\ \theta(a)=0,\ m=0,\\
+\infty, & \text{otherwise}.
\end{cases}
```

The corresponding velocity action is

```{math}
A_\theta(a,w)=J_\theta(a,aw),
\qquad
A_\theta(a,w)=\frac{a^2\norm{w}^2}{\theta(a)}
\quad\text{when }\theta(a)>0.
```

For a reference measure $\lambda$ and mass $M$, set

```{math}
\mathcal S_{\theta,\lambda}^M
\eqdef
\left\{\alpha=a\lambda:\alpha(\mathcal X)=M,\
a(x)\in I\ \lambda\text{-a.e.}\right\},
\qquad
\mathsf W_{\theta,\lambda}
\eqdef\mathsf D_{A_\theta,\lambda}.
```
:::

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

with the closed convention above. It is $+\infty$ when
$\alpha\not\ll\lambda$ or $a$ leaves $I$ on a set of positive
$\lambda$-measure. Equivalently, on the set where $\theta(a(x))>0$,

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

The subscript $\lambda$ recalls that the action is measured through the
density $a=\d\alpha/\d\lambda$. Equivalently, because this action is quadratic
in the momentum, $\mathsf W_{\theta,\lambda}^2$ is the path value
{eq}`eq-generalized-action-length-distance` with
$\mathbb A=\mathbb A_{\theta,\lambda}$.

(prop-concave-mobility-distance)=
:::{admonition} Proposition: Concave-Mobility Dynamic Distances
:class: important
For a fixed reference measure $\lambda$, and under the compactness hypotheses
ensuring existence of relaxed minimizers {cite:p}`dolbeault2009new`,
$\mathsf W_{\theta,\lambda}=\mathsf D_{A_\theta,\lambda}$ is an extended
distance on $\mathcal S_{\theta,\lambda}^M$ and a genuine metric on each
finite-action component.
:::

:::{dropdown} Proof
Proposition {ref}`prop-momentum-perspective-convexity`, applied with
$L(u)=\norm u^2$, gives convexity on the positive-mobility region. Continuity
of $\theta$, the zero-mobility convention, and the barrier outside $I$ give the
lower-semicontinuous extension $J_\theta$. It is even in $m$, satisfies
$J_\theta(a,0)=0$ on $I$, and obeys

```{math}
J_\theta(a,\xi m)=|\xi|^2J_\theta(a,m).
```

Moreover $J_\theta(a,m)=0$ if and only if $m=0$, with the boundary convention
used in its definition. For the fixed reference $\lambda$, the hypotheses of
Proposition {ref}`prop-homogeneous-dynamic-action-distance` therefore hold with
$r=2$; the compactness hypothesis supplies its existence assumption. That
proposition gives symmetry, separation and the triangle inequality for
$\mathsf D_{A_\theta,\lambda}$, hence for $\mathsf W_{\theta,\lambda}$.
:::

The choice $\theta(a)=a$ recovers $\Wass_2$. Other choices encode different
geometry: $\theta(a)=a^\gamma$ with $0<\gamma\leq1$ changes the cost of moving
dilute mass, while $\theta(a)=a(1-a/M)$ on $[0,M]$ models a volume-filling or
exclusion effect. The distance is comparable with $\Wass_2$ on classes where
$\theta(a)$ is bounded above and below by positive multiples of $a$; otherwise
zero-mobility barriers can make some pairs infinitely far apart.

### Dynamic Spectral Wasserstein Distances

The static spectral distances of {ref}`sec-spectral-subspace-wasserstein`
penalize a coupling through the covariance of its displacement. A dynamic
version keeps the continuity equation but replaces the pointwise kinetic energy
by a gauge of the whole velocity covariance. The resulting action is nonlocal in
space: velocity directions are charged globally through their covariance, rather
than independently at each point.

(def-dynamic-spectral-wasserstein)=
:::{admonition} Definition: Dynamic Spectral Wasserstein Distance
:class: ot4ml-definition

Let $\gamma$ be a monotone spectral gauge on $\mathbb S_+^d$. Define

```{math}
:label: eq-spectral-tangent-action
\mathbb A_\gamma(\alpha,v)
\eqdef
\gamma\!\left(\int v(x)v(x)^\top\d\alpha(x)\right).
```

```{math}
:label: eq-dynamic-spectral-wasserstein
\mathsf W_{\gamma,\mathrm{dyn}}^2(\alpha_0,\alpha_1)
\eqdef
\mathsf E_{\mathbb A_\gamma}(\alpha_0,\alpha_1).
```
:::

The trace gauge gives the usual Wasserstein tangent action, while the operator
gauge $\gamma(M)=\lambda_{\max}(M)$ charges only the largest directional
velocity variance.

In density--momentum variables, this corresponds to the measure action

```{math}
\mathbb J_\gamma(\alpha,\omega)
=
\gamma\!\left(\int
\left(\frac{\d\omega}{\d\alpha}\right)
\left(\frac{\d\omega}{\d\alpha}\right)^\top
\d\alpha\right),
```

or, when $\alpha=\rho\,\d x$ and $\omega=m\,\d x$,

```{math}
\mathbb J_\gamma(\rho,m)
=
\gamma\!\left(\int \frac{m(x)m(x)^\top}{\rho(x)}\,\d x\right).
```

This functional is convex in the density--momentum fields $(\rho,m)$ by the
matrix perspective, together with the monotonicity and convexity of $\gamma$. It
is nevertheless not, in general, obtained by integrating a pointwise action
density, because the covariance is computed globally before applying $\gamma$.
Among spectral gauges, the linear ones are exactly the scaled traces
$\gamma(M)=c\operatorname{tr}(M)$ with $c>0$. Their velocity and momentum
densities are

```{math}
A_{\mathrm{lin}}(a,w)=ca\norm w^2,
\qquad
J_{\mathrm{lin}}(a,m)=c\frac{\norm m^2}{a}.
```

The case $c=1$ recovers Benamou--Brenier. A functional
$M\mapsto\operatorname{tr}(GM)$ with nonscalar $G\succeq0$ is
Loewner-monotone but not orthogonally invariant, hence anisotropic rather than
spectral.

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

The common value defines a distance on $\Pp_2(\RR^d)$; the triangle inequality
is established by the robust representation in Proposition
{ref}`prop-spectral-wasserstein-robust`.
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
the kernel makes the velocity field computable from particles, while its
regularity is inherited from that of the kernel. The price is a much more
restrictive transport geometry.

(def-kernelized-bb-distance)=
:::{admonition} Definition: Kernelized Benamou--Brenier Distance
:class: ot4ml-definition

Let $k$ be a Borel measurable positive definite kernel on $\RR^d$ with scalar
RKHS $\RKHS_k$. Set

```{math}
\RKHS_k^d\eqdef \RKHS_k\times\cdots\times\RKHS_k,
\qquad
\norm{v}_{\RKHS_k^d}^2
\eqdef
\sum_{\ell=1}^d\norm{v_\ell}_{\RKHS_k}^2.
```

```{math}
:label: eq-kernelized-bb-distance
\mathbb A_k(\alpha,v)
\eqdef
\norm{v}_{\RKHS_k^d}^2,
\qquad
\mathcal W_k^2(\alpha_0,\alpha_1)
\eqdef
\mathsf E_{\mathbb A_k}(\alpha_0,\alpha_1),
```

where the infimum is restricted to strongly measurable
$v\in L^2([0,1];\RKHS_k^d)$ satisfying the continuity equation.
:::

This is the vector-valued analogue of the scalar RKHS norm used for MMDs in
{ref}`sec-rkhs-mmd`. The action itself is independent of $\alpha$; the measure only
enters through the continuity equation
$\partial_t\alpha_t+\diverg(\alpha_t v_t)=0$, which says how the common
velocity field moves all particles. This type of Stein geometry was introduced
in the analysis of SVGD by Liu and Wang {cite:p}`LiuWang2016SVGD,Liu2017SVGDGradientFlow`
and later developed geometrically in {cite:p}`DuncanNueskenSzpruch2019SVGDGeometry,NueskenRenger2021SVGDAsymptotics`.
The important caveat is that the admissible tangent space is the restricted
RKHS class, not the whole Wasserstein tangent space; its regularity depends on
$k$.

(prop-kernelized-bb-distance)=
:::{admonition} Proposition: Kernelized Dynamic Distance
:class: important
Assume that the kernel has uniformly bounded diagonal,

```{math}
\kappa_k^2\eqdef\sup_{x\in\RR^d}k(x,x)<+\infty.
```

Then the quantity $\mathcal W_k$ defined by
{eq}`eq-kernelized-bb-distance` is an extended distance on probability
measures. More precisely, it is symmetric, satisfies the triangle inequality,
and
$\mathcal W_k(\alpha_0,\alpha_1)=0$ implies $\alpha_0=\alpha_1$. It can take the
value $+\infty$ between different components.
:::

:::{dropdown} Proof
The Borel assumption makes every RKHS function measurable: kernel sections and
their finite linear combinations are Borel, while the bounded evaluation
estimate turns RKHS-norm convergence into uniform convergence. The constant
curve gives zero self-distance. The RKHS evaluation bound gives
$\norm{v(x)}\leq\kappa_k\norm{v}_{\RKHS_k^d}$. Therefore, for every
$\varphi\in C_c^1(\RR^d)$ and every admissible curve of action $E$, the weak
continuity equation and Cauchy--Schwarz imply

```{math}
\begin{aligned}
\left|\int\varphi\,\d(\alpha_1-\alpha_0)\right|
&\leq
\int_0^1\!\int\norm{\nabla\varphi(x)}\,\norm{v_t(x)}
\,\d\alpha_t(x)\d t\\
&\leq
\kappa_k\norm{\nabla\varphi}_\infty
\left(\int_0^1\norm{v_t}_{\RKHS_k^d}^2\d t\right)^{1/2}
=\kappa_k\norm{\nabla\varphi}_\infty\sqrt E.
\end{aligned}
```

Taking the infimum over curves proves separation without assuming that a
zero-action minimizer exists. Symmetry follows by time reversal and by
replacing $v_t$ with $-v_{1-t}$. For the triangle inequality, concatenate two
almost optimal curves of actions $E_1$ and $E_2$. Compressing them into time
intervals of lengths $\tau$ and $1-\tau$ changes the total action to
$E_1/\tau+E_2/(1-\tau)$. Optimizing gives
$(\sqrt{E_1}+\sqrt{E_2})^2$, and taking infima yields the claim.
:::

One should read $\mathcal W_k$ as an extended distance on finite-action
components, not as a replacement for $\Wass_2$ on all of $\Pp_2(\RR^d)$. A useful
sufficient condition for finiteness is that the endpoints lie on the same
RKHS-flow orbit: if there exists $v\in L^2([0,1];\RKHS_k^d)$ whose flow map
$\Phi_t$ solves $\dot\Phi_t=v_t\circ\Phi_t$ and satisfies
$\alpha_1=(\Phi_1)_\sharp\alpha_0$, then
$\mathcal W_k^2(\alpha_0,\alpha_1)\leq\int_0^1\norm{v_t}_{\RKHS_k^d}^2\d t$.
For a concrete particle criterion, assume additionally that $k$ is continuous
and strictly positive definite. If pairwise-distinct atoms follow absolutely
continuous paths $x_i(t)$ with square-integrable speeds, the Gram matrices
$(k(x_i(t),x_j(t)))_{i,j}$ vary continuously and remain uniformly positive
definite. Their minimum-norm RKHS interpolants therefore have square-integrable
norm, so discrete measures with the corresponding fixed weights are at finite
distance. Smooth or Lipschitz interpolating fields require the corresponding
regularity assumptions on $k$; strict positive definiteness alone does not
provide them.

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

(def-logarithmic-mean)=
:::{admonition} Definition: Logarithmic Mean
:class: ot4ml-definition

```{math}
:label: eq-logarithmic-mean
\theta(a,b)\eqdef
\begin{cases}
\displaystyle\frac{a-b}{\log a-\log b}, & a,b>0\text{ and }a\neq b,\\[.4em]
a, & a=b,\\
0, & ab=0,
\end{cases}
```
for $a,b\geq0$.
:::

For $a,b>0$, it satisfies
$\theta(a,b)(\log a-\log b)=a-b$. At vacuum this relation is understood only
as a limiting identity. This edge-wise chain rule identifies entropy-driven
flows with the underlying reversible Markov or jump dynamics.

### Continuum Jump Kernels

The continuum version replaces graph edges by a symmetric measure on pairs.
Weak compactness requires a formulation for arbitrary measures and pair-flux
measures; the density--velocity formula is only its absolutely continuous
specialization.

Let $(\mathcal X,d)$ be Polish, let $\mathfrak m$ be Radon, and let
$K(x,\cdot)$ be a nonnegative Borel kernel. Assume that the pair measures below
are locally finite on the off-diagonal space
$\mathcal G=\{(x,y):x\neq y\}$. Define

```{math}
:label: eq-nonlocal-jump-measure
\int_{\mathcal G}\Phi(x,y)\,\mathsf J(\d x,\d y)
\eqdef
\int_{\mathcal X}\left(\int_{\mathcal X\setminus\{x\}}
\Phi(x,y)K(x,\d y)\right)\mathfrak m(\d x).
```

Reversibility means that $\mathsf J$ is invariant under
$(x,y)\mapsto(y,x)$. Write
$\bar\nabla\varphi(x,y)=\varphi(y)-\varphi(x)$. For
$\alpha\in\Pp(\mathcal X)$ define the oriented edge measures

```{math}
\alpha^1(\d x,\d y)=K(x,\d y)\alpha(\d x),
\qquad
\alpha^2(\d x,\d y)=K(y,\d x)\alpha(\d y).
```

If a measure $\varsigma$ dominates $\alpha^1$, $\alpha^2$, and a signed
pair-flux $\nu$, write $r_i=\d\alpha^i/\d\varsigma$ and
$q=\d\nu/\d\varsigma$. Positive homogeneity makes the following action
independent of $\varsigma$.

(def-continuum-nonlocal-wasserstein)=
:::{admonition} Definition: Continuum Nonlocal Wasserstein Distance
:class: ot4ml-definition

```{math}
:label: eq-nonlocal-relaxed-action
\mathbb A_K(\alpha,\nu)
\eqdef
\frac12\int_{\mathcal G}
\begin{cases}
|q|^2/\theta(r_1,r_2),&\theta(r_1,r_2)>0,\\
0,&\theta(r_1,r_2)=0,\ q=0,\\
+\infty,&\theta(r_1,r_2)=0,\ q\neq0
\end{cases}
\d\varsigma.
```

An admissible pair is a narrowly continuous curve $\alpha_t$ and a Borel
family of antisymmetric signed flux measures $\nu_t$ such that
$\int_0^1\int_{\mathcal G}(1\wedge d(x,y))\d|\nu_t|\d t<\infty$ and

```{math}
:label: eq-nonlocal-continuity-weak
\int_0^1\!\int_{\mathcal X}\partial_t\varphi_t\d\alpha_t\d t
+\frac12\int_0^1\!\int_{\mathcal G}\bar\nabla\varphi_t\d\nu_t\d t
=\int\varphi_1\d\alpha_1-\int\varphi_0\d\alpha_0
```

for tests that are $C^1$ in time and bounded Lipschitz in space. Define

```{math}
:label: eq-nonlocal-wasserstein-distance
\mathcal W_K^2(\alpha_0,\alpha_1)
\eqdef
\inf_{(\alpha_t,\nu_t)}\int_0^1\mathbb A_K(\alpha_t,\nu_t)\d t.
```
:::

If $\alpha=\rho\mathfrak m$ and
$\nu=v(x,y)\theta(\rho(x),\rho(y))\mathsf J$, then

```{math}
:label: eq-nonlocal-density-flux
\mathbb A_K(\alpha,\nu)
=\frac12\int_{\mathcal G}|v(x,y)|^2
\theta(\rho(x),\rho(y))\mathsf J(\d x,\d y).
```

This recovers the intuitive density--velocity formula, but relaxed minimizers
need not remain absolutely continuous with respect to $\mathfrak m$.

The definition makes sense on a general Polish space, but the metric and
compactness theorems need additional analytic assumptions. We record the
Euclidean result used here.

(prop-nonlocal-distance-properties)=
:::{admonition} Proposition: Metric Properties of Nonlocal Transport
:class: ot4ml-proposition

Let $\mathcal X=\mathbb R^d$. Assume that $K$ and $\mathfrak m$ satisfy
Assumption 1.1 of {cite:t}`Erbar2012JumpEntropy`: besides reversibility, the
weighted kernels $(1\wedge\lVert x-y\rVert^2)K(x,\d y)$ depend continuously on
$x$ against bounded continuous tests and are uniformly integrable near the
diagonal and at infinity. Then $\mathcal W_K$ is an extended distance on
$\Pp(\mathbb R^d)$. Every finite-distance
component is complete and geodesic, the infimum in
{eq}`eq-nonlocal-wasserstein-distance` is attained when finite, and a minimizer
can be parametrized at constant speed.
:::

:::{dropdown} Proof
The integrand in {eq}`eq-nonlocal-relaxed-action` is a convex
lower-semicontinuous perspective, homogeneous in $(r_1,r_2,q)$, and the
logarithmic mean satisfies Assumption 2.1 of
{cite:t}`Erbar2012JumpEntropy`. Proposition 3.4 there gives compactness and
closure of the measure--flux continuity equation, Proposition 4.3 gives
attainment and constant-speed parametrization, and Theorem 4.4 gives
definiteness, completeness, and geodesicity. Time reversal gives symmetry, while time-optimized
concatenation gives the triangle inequality.
:::

For a fixed jump kernel this geometry is genuinely nonlocal and does not
coincide with ordinary $\Wass_2$. A local metric is recovered in a small-jump
limit only if the kernel can transport through vacuum. More explicitly, set
$\mathcal X=\mathbb R^d$ and $\mathfrak m=\mathcal L^d$, and let
$\eta(z)=\bar\eta(\lVert z\rVert)$ satisfy
Assumptions 2.1--2.2 of {cite:t}`SlepcevWarren2022NonlocalWasserstein`,
including radial monotonicity and the required tail and nondegeneracy bounds,
and suppose that

```{math}
M_2(\eta):=\int_{\mathbb R^d}\lVert z\rVert^2\eta(z)\,\mathrm dz
\in(0,+\infty),
```

and, for some $c,r_0>0$ and $s\in(0,2)$,

```{math}
:label: eq-small-jump-singular-lower-bound
\eta(z)\geq c\lVert z\rVert^{-d-s}
\qquad\text{whenever }0<\lVert z\rVert<r_0.
```

and define

```{math}
:label: eq-small-jump-kernel-scaling
K_\varepsilon(x,\mathrm dy)
:=\eta_\varepsilon(y-x)\,\mathrm dy,
\qquad
\eta_\varepsilon(z):=\varepsilon^{-d}\eta(z/\varepsilon).
```

Radiality implies symmetry and isotropy, and a change of variables gives

```{math}
:label: eq-small-jump-kernel-moments
\int\lVert y-x\rVert^2K_\varepsilon(x,\mathrm dy)
=\varepsilon^2M_2(\eta),
\qquad
\int (y-x)(y-x)^\top K_\varepsilon(x,\mathrm dy)
=\varepsilon^2\frac{M_2(\eta)}{d}\operatorname{Id}.
```

Equation {eq}`eq-small-jump-kernel-moments` is the precise sense in which the
second-moment jump scale is $\varepsilon$. To obtain a nontrivial local limit,
one simultaneously accelerates the jump rate by $\varepsilon^{-2}$ and sets

```{math}
\widehat K_\varepsilon
:=\frac{2d}{\varepsilon^2M_2(\eta)}K_\varepsilon,
\qquad
\int (y-x)(y-x)^\top\widehat K_\varepsilon(x,\mathrm dy)
=2\operatorname{Id}.
```

Multiplying a jump kernel by $c>0$ divides the associated distance by
$\sqrt c$. Theorem 1.3 of
{cite:t}`SlepcevWarren2022NonlocalWasserstein` therefore gives, for endpoints
supported in a fixed compact set,

```{math}
\mathcal W_{\widehat K_\varepsilon}
=\varepsilon\sqrt{\frac{M_2(\eta)}{2d}}\,
\mathcal W_{K_\varepsilon}
\longrightarrow\Wass_2
\qquad(\varepsilon\to0).
```

The singular lower bound {eq}`eq-small-jump-singular-lower-bound` is essential
for the logarithmic mean because $\theta(1,0)=0$. A smooth integrable profile,
including the usual bounded compactly supported kernels, does not satisfy this
theorem: in that regime a Dirac mass can be at infinite nonlocal distance from
another compactly supported singular measure although their $\Wass_2$ distance
is finite {cite:p}`SlepcevWarren2022NonlocalWasserstein`.

There is a rigorous anisotropic extension for affine images of such kernels.
If $B$ is invertible and

```{math}
\eta_B(z)=|\det B|^{-1}\eta(B^{-1}z),
```

define

```{math}
K_{B,\varepsilon}(x,\d y)
=\varepsilon^{-d}\eta_B((y-x)/\varepsilon)\d y,
\qquad
\widehat K_{B,\varepsilon}
=\frac{2d}{\varepsilon^2M_2(\eta)}K_{B,\varepsilon}.
```

Then the change of variables $x=B\xi$, $y=B\zeta$, together with the
one-homogeneity of the logarithmic mean, gives

```{math}
\mathcal W_{\widehat K_{B,\varepsilon}}(\alpha_0,\alpha_1)
=
\mathcal W_{\widehat K_\varepsilon}
(B^{-1}_\sharp\alpha_0,B^{-1}_\sharp\alpha_1)
\longrightarrow
\Wass_2(B^{-1}_\sharp\alpha_0,B^{-1}_\sharp\alpha_1).
```

The limiting accelerated covariance is $2BB^\top$, and the local velocity
action is $\int v^\top(BB^\top)^{-1}v\,\d\alpha$. For a general anisotropic
profile this covariance gives only the candidate local action: a convergence
theorem additionally requires compactness, recovery sequences, tail control,
and vacuum connectivity.

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
above. The transported object is a mass histogram

```{math}
\Sigma_n\eqdef\left\{a\in\RR_+^n:\sum_i a_i=1\right\}.
```

Relative densities only enter as auxiliary variables with respect to the
invariant law:

```{math}
\rho_i(a)\eqdef \frac{a_i}{\pi_i},
\qquad a_i=\pi_i\rho_i(a).
```

The logarithmic mean $\theta$ defined in {eq}`eq-logarithmic-mean` is the
mobility selected so that the entropy calculus later recovers exactly the Markov
evolution. The identity $\theta(a,b)(\log a-\log b)=a-b$ converts entropy
gradients into density differences along graph edges. For a potential
$\psi\in\RR^n$, set

```{math}
\bar\nabla\psi(i,j)\eqdef\psi_j-\psi_i.
```

The finite nonlocal divergence is encoded by the density Onsager operator and by
its mass form

```{math}
:label: eq-discrete-markov-onsager
(\mathcal K_\rho\psi)_i
\eqdef
\sum_j K_{ij}\theta(\rho_i,\rho_j)(\psi_i-\psi_j),
\qquad
(\mathcal L_a\psi)_i
\eqdef
\pi_i(\mathcal K_{\rho(a)}\psi)_i.
```

with tangent action

```{math}
:label: eq-discrete-markov-action
\mathbb A_K(a,\psi)
\eqdef
\frac12\sum_{i,j}\mathsf J_{ij}\theta(\rho_i(a),\rho_j(a))
(\bar\nabla\psi(i,j))^2.
```

This is the finite-state squared tangent action; the tangent
variable is the potential $\psi$, or equivalently the induced edge flux, rather
than an ambient Euclidean vector field.

The discrete transport distance is

```{math}
:label: eq-discrete-markov-distance
\mathcal W_K^2(a_0,a_1)
\eqdef
\inf_{a_t,\psi_t}
\int_0^1\mathbb A_K(a_t,\psi_t)\,\d t,
\qquad
\dot a_t+\mathcal L_{a_t}\psi_t=0,
```

with endpoint conditions $a_{t=0}=a_0$ and $a_{t=1}=a_1$. Equivalently, one can
write the same formula in edge-flux variables: flux is only allowed along edges
where $K_{ij}>0$, and the denominator in the kinetic energy is the logarithmic
mean of the two relative endpoint densities $\rho_i(a)=a_i/\pi_i$.

The first nontrivial finite Markov geometries already show how the logarithmic
mean bends the simplex. In both examples below, take the uniform random walk on
the complete neighbor graph, so $\pi_i=1/n$ and $K_{ij}=1/(n-1)$ for $i\neq j$.

:::{admonition} Example: Two-point complete graph
:class: ot4ml-example

On $\Sigma_2$, write $a_0=(r,1-r)$ and $a_1=(s,1-s)$. Since there is only one edge, the discrete dynamic problem reduces to the scalar Riemannian length

```{math}
:label: eq-two-state-markov-distance

\mathcal W_K(a_0,a_1)
=
\left|\int_s^r \frac{\d u}{\sqrt{\theta(u,1-u)}}\right|,
\qquad
0<r,s<1.
```

This formula is closed but not Euclidean: the logarithmic mean changes the cost of moving mass depending on the current split between the two points.
:::


:::{admonition} Example: Three-point complete graph
:class: ot4ml-example

Let $a_0,a_1\in\operatorname{int}(\Sigma_3)$. The complete-neighbor graph is a
triangle. For $a\in\operatorname{int}(\Sigma_3)$, set

```{math}
\Theta_{ij}(a)\eqdef\frac12\theta(a_i,a_j),
\qquad 1\leq i<j\leq3.
```

For a fixed $a$, write $\Theta_{ij}=\Theta_{ij}(a)$.

For a tangent vector $h\in\RR^3$ with $h_1+h_2+h_3=0$, orient the edges as $1\to2$, $1\to3$, $2\to3$. The squared norm induced by the discrete Wasserstein metric is

```{math}
:label: eq-three-state-markov-norm

\|h\|_a^2
=
\min_{m_{12},m_{13},m_{23}}
\left\{
\frac{m_{12}^2}{\Theta_{12}}+
\frac{m_{13}^2}{\Theta_{13}}+
\frac{m_{23}^2}{\Theta_{23}}
\right\},
```

subject to

```{math}
h_1+m_{12}+m_{13}=0,
\qquad
h_2-m_{12}+m_{23}=0,
\qquad
h_3-m_{13}-m_{23}=0.
```

Eliminating the three edge fluxes gives an explicit formula. With $D=\Theta_{12}^{-1}+\Theta_{13}^{-1}+\Theta_{23}^{-1}$,

```{math}
m_{12}^*=\frac{h_2/\Theta_{23}-h_1/\Theta_{13}}{D},
\qquad
m_{13}^*=-h_1-m_{12}^*,
\qquad
m_{23}^*=m_{12}^*-h_2,
```

and $\|h\|_a^2$ is obtained by inserting these values in {eq}`eq-three-state-markov-norm`. Therefore

```{math}
:label: eq-three-state-markov-distance

\mathcal W_K^2(a_0,a_1)
=
\inf_{a_t\in\operatorname{int}(\Sigma_3)}
\int_0^1\|\dot a_t\|_{a_t}^2\,\d t,
\qquad
a_{t=0}=a_0,
\quad a_{t=1}=a_1.
```

Thus the three-state distance is an explicit two-dimensional Riemannian geodesic problem on the open triangle. The formula is simple enough to compute directly, but it already shows the main difference with Euclidean geometry on the simplex: the local metric depends nonlinearly on the current density through logarithmic edge mobilities.
:::


Figure {ref}`fig:discrete-markov-simplex-distances` visualizes these
small-dimensional geometries and compares them with the ordinary Wasserstein
distance associated with the $0/1$ ground metric, for which $\Wass_2^2$ is one
half of the total variation norm.

(fig:discrete-markov-simplex-distances)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("discrete-markov-simplex-distances")
```

*Discrete Wasserstein distances on small Markov-chain simplices. The left panel shows
the closed-form profiles $r\mapsto \mathcal W_K(a_r,a_{r_0})$, with
$a_r=(r,1-r)$, for several anchors $r_0$ on $\Sigma_2$. The middle panel shows
numerical level sets of $\mathcal W_K(a,\bar a)$ on $\Sigma_3$, where
$\bar a=(1/3,1/3,1/3)$, using the local Riemannian norm induced by the
complete-neighbor Markov chain. The right panel shows the corresponding level
sets for the ordinary $W_2$ distance with $d(i,j)=1$ for $i\neq j$, so that
$W_2^2(a,\bar a)=\tfrac12\norm{a-\bar a}_{\mathrm{TV}}$.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Move the anchor in the two-state formula and refine the
three-state grid to compare the Markov-chain Riemannian distance with the
ordinary simplex distance induced by the $0/1$ ground metric.
:::

<iframe class="ot4ml-live-frame" title="Discrete Markov-chain simplex distance controls" src="../live/dynamic-markov-simplex.html" loading="lazy" style="width:100%;height:480px;border:0;display:block;"></iframe>

(sec-unbalanced-ot)=
## Dynamic Unbalanced Wasserstein Distances

Balanced dynamic distances keep the total mass fixed: their tangent vectors are
transport velocities or fluxes satisfying a continuity equation. Unbalanced
distances use a different tangent model. A tangent vector now has both a
spatial component and a reaction component, so mass can move, disappear, and
reappear. This section isolates this reaction--transport geometry before its
use for gradient flows in {ref}`sec-dynamic-unbalanced-wfr-flows`.

### Balance Equation and Tangent Variables

Unbalanced dynamic transport is obtained by allowing mass to be created and
destroyed along the path. At the density level, the continuity equation becomes
a balance equation and an admissible tangent direction is a pair $(m,s)$: the
flux density $m$ transports mass, while the source density $s$ changes its
amount locally. This formulation underlies the Hellinger--Kantorovich and
Wasserstein--Fisher--Rao metrics
{cite:p}`LieroMielkeSavareShort,2017-chizat-focm`; its equivalence with static
entropy-transport and cone formulations is developed in
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
infinite cost. At the measure level these densities become the vector-valued
flux measure $\omega_t=m_t\,\d x$ and the signed source measure
$\sigma_t=s_t\,\d x$.

### Reaction--Transport Action

The action attaches one price to displacement and another to local growth.
For a density $a\geq0$, a velocity $w\in\RR^d$, and a relative growth rate
$g\in\RR$, define


```{math}
:label: eq-wfr-velocity-action
A_\kappa(a,w,g)
\eqdef
a\bigl(\norm{w}^2+\kappa^2 g^2\bigr).
```

Thus, writing $m_t=\rho_t v_t$ and $s_t=\rho_t g_t$, the smooth action is
$\int_0^1\int A_\kappa(\rho_t,v_t,g_t)\,\d x\,\d t$ under
$\partial_t\rho_t+\nabla\!\cdot(\rho_t v_t)=g_t\rho_t$. The parameter
$\kappa$ fixes the relative cost of reaction and transport.

For the convex measure formulation, set $m=aw$ and $r=ag$. The corresponding
three-variable perspective is

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

For measure-valued triples, $\alpha$ denotes the transported measure, $\omega$ the
vector-valued flux measure, and $\sigma$ the signed source measure. If
$\lambda$ dominates $\alpha$, $|\omega|$ and $|\sigma|$, define

```{math}
:label: eq-wfr-measure-action
\mathbb J_\kappa(\alpha,\omega,\sigma)
\eqdef
\int
J_\kappa\!\left(
\frac{\d\alpha}{\d\lambda},
\frac{\d \omega}{\d\lambda},
\frac{\d \sigma}{\d\lambda}
\right)\d\lambda .
```

The one-homogeneity of $J_\kappa$ makes this definition independent of the
chosen dominating measure. Finite action forces both the flux and source to be
absolutely continuous with respect to the transported mass.

### Static and Dynamic Viewpoints

The balance-equation formula is the least-action representation of the same
cone distance used in static unbalanced OT. To make the normalization explicit,
define on the cone $\mathfrak C[\RR^d]$ the squared cost

```{math}
:label: eq-wfr-scaled-cone-metric
\Delta_\kappa\big((x,r),(y,s)\big)^2
\eqdef
4\kappa^2
\left[
r^2+s^2-2rs
\cos\!\left(
\frac{\norm{x-y}}{2\kappa}\wedge\frac{\pi}{2}
\right)
\right].
```

The radii encode masses through the weighted projection $\mathsf P_2$ defined
in {ref}`sec-unbalanced`. Accordingly, set

```{math}
:label: eq-wfr-scaled-cone-value
\CW_\kappa(\alpha_0,\alpha_1)
\eqdef
\inf_{\substack{\gamma\in\Mm_+(\mathfrak C[\RR^d]^2)\\
\mathsf P_2\gamma_1=\alpha_0,\ \mathsf P_2\gamma_2=\alpha_1}}
\int
\Delta_\kappa\big((x,r),(y,s)\big)^2
\,\d\gamma(x,r,y,s).
```

For $\kappa=1/2$, this is exactly the normalization of the
Hellinger--Kantorovich cone cost used in {ref}`sec-unbalanced`.

(prop-static-dynamic-unbalanced)=
:::{admonition} Proposition: Static/Dynamic Equivalence for Unbalanced OT
:class: important
For nonnegative finite measures $\alpha_0,\alpha_1$ on $\RR^d$, the dynamic
value

```{math}
:label: eq-dynamic-unbalanced-ot
\WFR_\kappa^2(\alpha_0,\alpha_1)
\eqdef
\inf_{\substack{\partial_t\alpha_t+\nabla\cdot \omega_t=\sigma_t\\
\alpha_{t=0}=\alpha_0,\ \alpha_{t=1}=\alpha_1}}
\int_0^1
\mathbb J_\kappa(\alpha_t,\omega_t,\sigma_t)\,\d t
```

equals the static cone value {eq}`eq-wfr-scaled-cone-value`. Hence
$\WFR_\kappa=\CW_\kappa^{1/2}$ is the geodesic distance generated by the
balance-equation least-action problem.
:::

:::{dropdown} Proof
The cone construction turns variation of mass into radial motion and spatial
transport into angular motion. The normalization can be checked on a smooth
cone path: if its base position is $x_t$, its radius is $r_t$, and the projected
mass is $a_t=r_t^2$, then $g_t=\dot a_t/a_t=2\dot r_t/r_t$. The infinitesimal
energy induced by {eq}`eq-wfr-scaled-cone-metric` is therefore

```{math}
4\kappa^2\dot r_t^2+r_t^2\norm{\dot x_t}^2
=
a_t\bigl(\norm{\dot x_t}^2+\kappa^2g_t^2\bigr),
```

which is precisely {eq}`eq-wfr-velocity-action`.

The converse passage from an arbitrary Eulerian triple to a cone-valued
dynamic plan is the substantive step. For $\kappa=1/2$, Theorems 4.3, 4.5, and
4.6 of {cite:t}`LieroMielkeSavareShort` give, respectively, the dynamic-plan
representation and the two action comparisons; the proof of their Theorem 3.6
identifies the resulting distance with the cone metric. In their notation the
vector field is the velocity $w$ used here, while the scalar field $\xi$
satisfies $g=4\xi$. Thus their action density $\lVert w\rVert^2+4\xi^2$ is
exactly $\lVert w\rVert^2+g^2/4$. These results establish both inequalities for
arbitrary finite measures, not only for smooth cone paths.

For general $\kappa$, rescale the base metric by $(2\kappa)^{-1}$ and the cone
distance by $2\kappa$. The same theorem then gives the cone cost
{eq}`eq-wfr-scaled-cone-metric` and the action
$\lVert w\rVert^2+\kappa^2g^2$. The complete-separable-space formulation and
its relaxation are developed in {cite:t}`LieroMielkeSavareLong`; related
normalizations appear in
{cite:p}`2017-chizat-focm,2015-chizat-unbalanced`.
:::

### Balanced Versus Unbalanced Interpolations

The distinction is visible for mixtures with mismatched modal masses. Balanced
transport must physically move excess mass, whereas unbalanced transport can
trade transport against reaction. Figure
{ref}`fig:dynamic-unbalanced-geodesic` uses entropic balanced and KL-relaxed
barycenters as a qualitative numerical surrogate; its unbalanced row
illustrates the reaction--transport mechanism but is not asserted to be an
exact $\WFR_\kappa$ geodesic.

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

(sec-variational-mean-field-games)=
## Variational Mean Field Games

Mean field games use a population law to summarize strategic interactions
among many individually negligible agents. This section only considers the
potential subclass for which the equilibrium system is the optimality
condition of one convex planning problem. The link with dynamic OT is then
transparent: the Benamou--Brenier kinetic action is augmented by congestion,
and a terminal penalty replaces the prescribed final measure.

Throughout this section, $\Omega\subset\mathbb R^d$ is a bounded connected
Lipschitz domain, agents remain in $\overline\Omega$, and the population flux
has zero normal trace on $\partial\Omega$ in the sense of
{eq}`eq-continuity-endpoint-no-flux`. These assumptions make the room geometry
and its impermeable walls part of the variational model.

### From Individual Control to a Population Equilibrium

Mean field games were introduced by Lasry and Lions
{cite:p}`LasryLions2007MeanFieldGames` and, in a parallel large-population
stochastic-control framework, by Huang, Malhame, and Caines
{cite:p}`HuangMalhameCaines2006`. Given a candidate density path $\rho_t$, a
representative deterministic agent starting from $x\in\overline\Omega$ chooses
an admissible path $\gamma:[0,1]\to\overline\Omega$ by minimizing

```{math}
:label: eq-mfg-individual-control
\inf_{\gamma(0)=x}
\left\{
\int_0^1\left(\frac12\lVert\dot\gamma(t)\rVert^2
+g(\rho_t(\gamma(t)))\right)\d t
+\Psi(\gamma(1))
\right\}.
```

Here $g(\rho)$ is the running cost created by the local population density and
the continuous function $\Psi:\overline\Omega\to\mathbb R$ prices the final
state. A mean field Nash equilibrium requires consistency: when every agent
uses an optimal feedback, the resulting position law must be
$\alpha_t=\rho_t\d x$.

### Benamou--Brenier Planning Problem

A global variational reduction is available when the local coupling is a first
variation. Let $G:[0,+\infty)\to[0,+\infty]$ be proper, closed, and convex,
with $G(0)=0$. In the differentiable case set $g(r)=G'(r)$; more generally,
select $g(r)\in\partial G(r)$.

(def-variational-mfg-planning)=
:::{admonition} Definition: Variational Mean-Field-Game Planning Problem
:class: ot4ml-definition

Starting from a probability density $\alpha_0=\rho_0\d x$ on $\Omega$, define

```{math}
:label: eq-variational-mfg-velocity
\inf_{(\rho_t,v_t)}
\left\{
\int_0^1\!\int_\Omega
\left(\frac12\rho_t(x)\lVert v_t(x)\rVert^2+G(\rho_t(x))\right)
\d x\,\d t
+\int_\Omega\Psi(x)\rho_1(x)\d x
\right\},
```

subject to

```{math}
:label: eq-variational-mfg-continuity
\partial_t\rho_t+\nabla\!\cdot(\rho_tv_t)=0,
\qquad
\rho_{t=0}\d x=\alpha_0,
\qquad
(\rho_tv_t)\cdot n=0\quad\text{on }\partial\Omega.
```
:::

Unlike the classical Benamou--Brenier problem, the final measure is not
prescribed. The terminal potential softly selects desirable final states,
while $G$ penalizes crowded configurations. The planner pays $G(\rho)$ rather
than $\rho g(\rho)$ because the marginal cost perceived by an infinitesimal
agent is $G'(\rho)=g(\rho)$. This potential formulation is developed in
{cite:t}`BenamouCarlierSantambrogio2017`; first-order systems with local
couplings are analyzed in {cite:t}`CardaliaguetGraber2015FirstOrderMFG`.

### Convex Momentum Formulation

Set $\omega_t=\alpha_tv_t$, or $m_t=\rho_tv_t$ when densities exist. For the
closed congestion functional, write the Lebesgue decomposition
$\alpha=\rho\d x+\alpha^s$ and define

```{math}
:label: eq-mfg-congestion-functional
\mathcal C_G(\alpha)
\eqdef
\int_\Omega G(\rho(x))\d x
+G^\infty\alpha^s(\overline\Omega),
\qquad
G^\infty\eqdef\lim_{r\to+\infty}\frac{G(r)}r.
```

For superlinear congestion, $G^\infty=+\infty$ and finite energy forces
$\alpha\ll\d x$. The recession term is needed for lower-semicontinuous closure
when $G$ has only linear growth. The planning problem becomes

```{math}
:label: eq-variational-mfg-momentum
\inf_{(\alpha_t,\omega_t)}
\left\{
\int_0^1\left(\frac12\mathbb J(\alpha_t,\omega_t)
+\mathcal C_G(\alpha_t)\right)\d t
+\int_{\overline\Omega}\Psi\d\alpha_1
\right\},
```

under the affine constraints
$\partial_t\alpha_t+\nabla\!\cdot\omega_t=0$,
$\alpha_{t=0}=\alpha_0$, and $\omega_t\cdot n=0$ on $\partial\Omega$. In
density--momentum variables, the running integrand is

```{math}
:label: eq-variational-mfg-density-momentum
\frac12J(\rho_t,m_t)+G(\rho_t)
=\frac{\lVert m_t\rVert^2}{2\rho_t}+G(\rho_t),
```

with the vacuum convention of {eq}`eq-quadratic-perspective`. The perspective
term is convex, $\mathcal C_G$ is convex and narrowly lower semicontinuous, the
terminal term is continuous and linear, and the constraints are affine and
closed. Thus {eq}`eq-variational-mfg-momentum` is a closed convex problem. If a
finite-action competitor exists, compactness on $\overline\Omega$ and the
direct method give an optimizer. A nonconvex $G$ would leave the congestion
term nonconvex even after the momentum substitution.

### Optimality System and Game Interpretation

(prop-variational-mfg-system)=
:::{admonition} Proposition: Potential MFG System
:class: ot4ml-proposition

Assume an optimizer of {eq}`eq-variational-mfg-momentum` has a smooth positive
density $\rho$ and that $G$ is differentiable. Then there is a value function
$u$ such that

```{math}
:label: eq-variational-mfg-system
\begin{cases}
-\partial_tu+\frac12\lVert\nabla u\rVert^2=g(\rho),
&u_{t=1}=\Psi,\\
\partial_t\rho-\nabla\!\cdot(\rho\nabla u)=0,
&\rho_{t=0}\d x=\alpha_0,
\end{cases}
\qquad
m=-\rho\nabla u,
\qquad
\rho\nabla u\cdot n=0\text{ on }\partial\Omega.
```
:::

:::{dropdown} Proof
Use $-u$ as multiplier for $\partial_t\rho+\nabla\!\cdot m=0$. After
integration by parts, the space--time Lagrangian density is
$\lVert m\rVert^2/(2\rho)+G(\rho)+\rho\partial_tu+m\cdot\nabla u$.
Stationarity in $m$ gives $m=-\rho\nabla u$; stationarity in $\rho$ then gives
the Hamilton--Jacobi--Bellman equation. Since terminal variations preserve
total mass, stationarity first says that $u_1-\Psi$ is spatially constant. The
additive gauge of $u$ is chosen to make this constant zero, so $u_1=\Psi$.
Primal feasibility gives the forward equation.
:::

The backward equation describes the representative agent's best response,
while the forward equation transports the population under the feedback
$v=-\nabla u$. For nonsmooth $G$, replace $g(\rho)$ by an element of
$\partial G(\rho)$; a hard density cap produces a pressure on the saturated
region.

### Hard Congestion Through a Bottleneck

A hard crowd-capacity constraint is obtained with

```{math}
:label: eq-variational-mfg-hard-cap
G_\kappa(r)=\iota_{[0,\kappa]}(r)
=
\begin{cases}
0,&0\leq r\leq\kappa,\\
+\infty,&\text{otherwise}.
\end{cases}
```

One can retain a prescribed terminal preference by replacing the linear
terminal term with the convex penalty

```{math}
:label: eq-variational-mfg-quadratic-terminal
\Gamma_\eta(\rho_1)
=\frac\eta2\int_\Omega|\rho_1(x)-\rho_\star(x)|^2\d x.
```

Such endpoint penalties occur in the augmented-Lagrangian experiments of
{cite:t}`benamou2015augmented`, while the two-room hard-congestion geometry
follows {cite:t}`BenamouCarlierSantambrogio2017`. A constant cap does not alter
a Euclidean $\Wass_2$ geodesic between capped endpoints, but that argument
fails in a nonconvex domain because straight displacement segments may leave
the domain and a narrow passage creates a genuine bottleneck.

Figure {ref}`fig:dynamic-variational-mfg-hard-congestion` uses a bounded
two-room domain joined by a narrow doorway and specializes the terminal
functional to the hard constraint $\rho_{t=1}=\rho_\star$. Both endpoints are
uniform on mirrored disks. The constrained row uses the tight feasible cap
$\kappa=\lVert\rho_0\rVert_\infty$; blocked grid faces carry zero flux and
implement the impermeable boundary.

(fig:dynamic-variational-mfg-hard-congestion)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("dynamic-variational-mfg-hard-congestion")
```

*Hard-congestion variational MFG through two communicating rooms. The bounded
domain has impermeable walls and one narrow doorway. Initial and hard terminal
profiles are uniform on mirrored disks; dashed outlines show the target and
the columns advance from red to blue. Without a cap the path forms a narrow,
dense doorway jet. The cap $\kappa=\lVert\rho_0\rVert_\infty$ instead forces a
broad saturated queue; dark contours mark regions within one percent of the
cap.*
:::

:::{admonition} Scope of the Variational Reduction
:class: ot4ml-remark
A general mean field game need not be the optimality system of a global convex
functional. The reduction above applies because the coupling is the first
variation of $\mathcal C_G$ and the terminal cost is linear, or more generally
convex, in the final law. Nonlocal, non-potential, or nonmonotone couplings
generally fall outside {eq}`eq-variational-mfg-momentum`.
:::

After conservative space--time discretization, the convex objective is a sum
of local perspective and congestion terms under one affine divergence
constraint. Augmented-Lagrangian and primal--dual methods can alternate local
proximal updates with a linear space--time solve, paralleling the dynamic OT
solver {cite:p}`benamou2015augmented,BenamouCarlierSantambrogio2017`.

Together, the local, spectral, kernelized, jump, graph, and unbalanced examples
show that modifying the Benamou--Brenier action changes both the admissible
motion and the topology of the measure space. The MFG planning problem then
shows how adding a convex congestion cost turns the same dynamic language into
a population game. The next chapter turns these geometries into gradient-flow
equations.
