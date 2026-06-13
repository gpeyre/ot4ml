---
title: "Dynamic Optimal Transport"
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---

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

:::{admonition} Procedure: Least-square velocity reconstruction
:class: ot4ml-procedure

Given a smooth positive density curve $\rho_t$ on a domain with suitable boundary conditions, compute the time derivative $\partial_t\rho_t$. For each time $t$, solve the weighted Poisson equation

```{math}
-\diverg(\rho_t\nabla\phi_t)=\partial_t\rho_t
```

with a normalization such as $\int\phi_t\rho_t=0$. Set

```{math}
v_t=\nabla\phi_t .
```

The pair $(\rho_t,v_t)$ satisfies the continuity equation and has minimal kinetic energy among all velocities realizing the prescribed density evolution.
:::

## Benamou--Brenier Dynamic Formulation of OT

The dynamic formulation identifies $\Wass_2$ with the kinetic energy of the
cheapest continuity-equation path. It is the point where OT becomes a
least-action principle.

Instead of assuming that a whole curve $(\alpha_t)_{t\in[0,1]}$ is prescribed,
one fixes only the endpoints $\alpha_0$ and $\alpha_1$ and minimizes the
least-square energy {eq}`eq-least-square-field`. The theorem of Benamou and
Brenier states that this geodesic energy is exactly the squared Wasserstein
distance {cite:p}`benamou2000computational`.

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

:::{admonition} Remark: Path-Space Formulation
:class: note
Let $\mathcal S=C([0,1];\RR^d)$ be the space of continuous paths with the
uniform topology. For $t\in[0,1]$, define the evaluation map

```{math}
P_t:\mathcal S\to\RR^d,
\qquad
P_t(\gamma)=\gamma(t).
```

The Benamou--Brenier cost admits the equivalent formulation

```{math}
\Wass_2^2(\alpha_0,\alpha_1)
=
\inf_{M\in\mathcal P(\mathcal S)}
\left\{
\int_{\mathcal S}\!\int_0^1\norm{\dot\gamma(t)}^2\d t\,\d M(\gamma):
(P_0)_\sharp M=\alpha_0,\ (P_1)_\sharp M=\alpha_1
\right\}.
```

If $\alpha_0$ has a density, the minimizer $M^\star$ is unique. Its time
marginals reproduce the optimal curve:
$\alpha_t=(P_t)_\sharp M^\star$ for all $t$. Furthermore, for a.e. $t$,
denoting $Q_t(\gamma)=\dot\gamma(t)$ on absolutely continuous paths, the
conditional law of the velocity is deterministic:

```{math}
(P_t,Q_t)_\sharp M^\star(\d x,\d q)
=
\alpha_t(\d x)\delta_{v_t^\star(x)}(\d q).
```

Here $v_t^\star$ is the optimal velocity field in the Benamou--Brenier
formulation. Hence $M^\star$ concentrates on straight-line geodesics and, for
a.e. $t$, assigns exactly one direction at $\alpha_t$-a.e. spatial point.
:::

### Extensions of the Dynamic Formulation

The same variational grammar extends beyond the quadratic Wasserstein
distance. One changes either the kinetic exponent, the mobility or the
balance equation, while keeping a continuity-type constraint and a convex
perspective action.

:::{admonition} Remark: Generalized Benamou--Brenier Distances
:class: note
The dynamic formulation is not specific to $\Wass_2$. For measures with finite
$p$-th moments and $p>1$,

```{math}
\Wass_p^p(\alpha_0,\alpha_1)
=
\inf_{\substack{\partial_t\alpha_t+\nabla\!\cdot(\alpha_t v_t)=0\\
\alpha_{t=0}=\alpha_0,\ \alpha_{t=1}=\alpha_1}}
\int_0^1\!\int_{\RR^d}|v_t(x)|^p\,\d\alpha_t(x)\,\d t.
```

When $\alpha_t=\rho_t\,\d x$ and $m_t=\rho_t v_t$, this becomes the convex
perspective action

```{math}
\int_0^1\!\int_{\RR^d}
\frac{|m_t(x)|^p}{\rho_t(x)^{p-1}}\d x\,\d t,
\qquad
\partial_t\rho_t+\nabla\!\cdot m_t=0,
```

with the same zero-density convention as above.

A second class of variants changes the mobility of the medium: the quadratic
action $|m|^2/\rho$ is replaced by $|m|^2/\theta(\rho)$ for a suitable
concave mobility $\theta$. Under appropriate structural assumptions, this
produces transport metrics adapted to nonlinear diffusions and finite-volume
discretizations {cite:p}`dolbeault2009new`. On finite graphs and Markov
chains, the analogous action uses an edge mobility, often the logarithmic
mean of endpoint densities, and leads to discrete Wasserstein geometries
{cite:p}`Maas2011,MielkeCVPDE`. These extensions keep the same variational
grammar as Benamou--Brenier: a continuity-type constraint, an action density,
and geodesics obtained by minimizing an integrated kinetic cost.
:::

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

:::{admonition} Procedure: Douglas--Rachford for dynamic Benamou--Brenier
:class: ot4ml-procedure

Choose a proximal parameter $\tau>0$ and initialize a discrete field $Z^0$. For $k=0,1,\ldots$, compute

```{math}
U^{k+1}=\prox_{\tau\mathcal F}(Z^k),
```

where the proximal map is evaluated pointwise through the perspective action $J$. Then project the reflected point onto the affine continuity-equation constraint,

```{math}
\widetilde U^{k+1}
=
\prox_{\tau\mathcal G}(2U^{k+1}-Z^k)
=
\Proj_{\mathcal C}(2U^{k+1}-Z^k),
```

and update

```{math}
Z^{k+1}=Z^k+\widetilde U^{k+1}-U^{k+1}.
```

Return the common shadow limit $U^\star=\widetilde U^\star$, which gives the discrete density and momentum of the Benamou--Brenier geodesic.
:::
