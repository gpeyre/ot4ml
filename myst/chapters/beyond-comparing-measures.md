---
title: "Beyond Comparing Measures"
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-beyond-comparing-measures)=

This chapter leaves the setting of scalar measures on a common ambient
space. Vector- and matrix-valued OT transports mass with internal degrees of
freedom, Gromov--Wasserstein compares metric-measure spaces without a
prescribed correspondence, and quantum OT replaces scalar couplings by
positive operators. In each case, the transport plan must also encode
structure carried by the support, the fibers, or the non-commutative state
space.

:::{admonition} Guiding Comparison
:class: tip
Classical OT compares two scalar measures through a ground cost. Vector- and
matrix-valued OT keeps the base space but enriches the mass attached to each
point. Gromov--Wasserstein removes the common base space and compares
internal distances. Quantum OT keeps the marginal idea but replaces vectors
and matrices of masses by positive operators and partial traces.
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

(sec-vector-matrix-valued-measures)=
## Vector and Matrix-Valued Measures

Scalar OT transports a nonnegative density. In imaging, color processing,
spectral analysis, diffusion tensor imaging and quantum-inspired models, the
object attached to a point can instead have several nonnegative components or
a positive semidefinite matrix. The first step beyond scalar OT is the
positive vector-valued case: the fiber remains linear and commutative, but
the transport cost may couple its channels.

### Positive Vector-Valued Measures

The simplest way to keep internal structure in transport is to attach several
nonnegative masses to each spatial point and to decide whether these channels
move independently or interact through the cost.

(def-positive-vector-valued-measure)=
:::{admonition} Definition: Positive Vector-Valued Measure
:class: important
A positive $\RR_+^m$-valued measure on $\X$ is a tuple

```{math}
\al=(\al^1,\ldots,\al^m)\in\mathcal M_+(\X;\RR_+^m),
```

where each component $\al^k$ is a nonnegative finite measure.
:::

This models multi-channel densities such as color histograms, spectral bins
or several species transported on the same domain. In a conservative model
the mass of each channel is preserved, so one assumes
$\al_0^k(\X)=\al_1^k(\X)$ for every $k$. The natural vector-valued extension
therefore starts from the positive cone $\RR_+^m$.

For the dynamic formulas below, assume that $\X$ is either $\RR^d$, the flat
torus, or a bounded convex domain in $\RR^d$ equipped with no-flux boundary
conditions. First suppose that the endpoints and the curve have densities.
The direct analogue of Benamou--Brenier fixes a vector
density $u_t(x)\in\RR_+^m$ and a spatial flux
$V_t(x)=(V_{t,1},\ldots,V_{t,d})\in(\RR^m)^d$, where $V_{t,\ell}^k$ is the
momentum of channel $k$ in spatial direction $\ell$. The conservative vector
transport cost associated with an action density $\Phi$ is

```{math}
:label: eq-vector-valued-bb
\mathcal W_{\Phi}^2(\al_0,\al_1)
\eqdef
\inf_{u,V}
\int_0^1\!\int_\X
\Phi(u_t(x),V_t(x))\,\d x\,\d t
```

subject to the endpoint constraints $u_0\d x=\al_0$, $u_1\d x=\al_1$ and the
componentwise continuity equation

```{math}
:label: eq-vector-valued-continuity
\partial_t u_t+\nabla_x\cdot V_t=0,
\qquad
(\nabla_x\cdot V_t)^k
=
\sum_{\ell=1}^d\partial_{x_\ell}V_{t,\ell}^k.
```

Thus each component satisfies its own continuity equation, but the cost may
still couple the components. Singular curves are handled as in scalar dynamic
OT by replacing densities and fluxes by measures and using the lower
semicontinuous perspective recession convention.

A simple quadratic family is obtained from a mobility matrix
$\mathsf M(u)\in\mathbb S_+^m$:

```{math}
\Phi_{\mathsf M}(u,V)
=
\sum_{\ell=1}^d
V_\ell^\top \mathsf M(u)^\dagger V_\ell,
```

with the usual convention that the value is finite only when each $V_\ell$
belongs to the range of $\mathsf M(u)$. If $u\mapsto\mathsf M(u)$ is linear
and takes values in $\mathbb S_+^m$, this action is jointly convex and
positively one-homogeneous in $(u,V)$. Indeed, the matrix fractional map
$(M,z)\mapsto z^\top M^\dagger z$ is jointly convex on its effective domain,
and $\mathsf M(su)=s\mathsf M(u)$ for $s>0$. For $m=1$ and
$\mathsf M(u)=u$, one
recovers exactly the scalar Benamou--Brenier action. For

```{math}
\mathsf M_{\mathrm{diag}}(u)=\operatorname{diag}(u_1,\ldots,u_m),
```

the channels move independently. Non-diagonal mobilities are the simplest way
to couple the coordinates while keeping the same componentwise conservation
law. For instance, with $q=m^{-1/2}(1,\ldots,1)$ and $\kappa\geq0$,

```{math}
\mathsf M_\kappa(u)
=
\operatorname{diag}(u)
+
\kappa\left(\sum_{k=1}^m u_k\right)qq^\top
```

increases the mobility in the common channel direction $q$ while leaving
transverse directions controlled by the diagonal part. The local cost of
moving one component can therefore depend on the densities and momenta of the
other components, even though each component mass remains conserved.

(prop-diagonal-positive-vector-bb)=
:::{admonition} Proposition: Diagonal Positive Vector Benamou--Brenier
:class: important
Assume that $\al_0^k,\al_1^k\in\mathcal M_+(\X)$ have finite second moments
and the same mass $m_k$ for every $k$. For the diagonal mobility
$\mathsf M_{\mathrm{diag}}$,

```{math}
\mathcal W_{\mathrm{diag}}^2(\al_0,\al_1)
=
\sum_{k:m_k>0}
m_k\,
\Wass_2^2\!\left(
\frac{\al_0^k}{m_k},
\frac{\al_1^k}{m_k}
\right),
```

with the convention that zero-mass channels contribute zero.
:::

:::{dropdown} Proof
For $\mathsf M_{\mathrm{diag}}(u)=\operatorname{diag}(u_1,\ldots,u_m)$, the
action separates as

```{math}
\sum_{\ell=1}^d
V_\ell^\top\mathsf M_{\mathrm{diag}}(u)^\dagger V_\ell
=
\sum_{k=1}^m\frac{|V^k|^2}{u^k},
```

where $V^k=(V_1^k,\ldots,V_d^k)$ is the spatial momentum of channel $k$. The
constraint {eq}`eq-vector-valued-continuity` also separates into
$\partial_t u^k+\nabla\cdot V^k=0$. The minimization therefore splits into
$m$ independent scalar Benamou--Brenier problems. If $m_k>0$, normalizing
$\rho_t^k=u_t^k/m_k$ and $p_t^k=V_t^k/m_k$ factors the channel action as
$m_k\int |p_t^k|^2/\rho_t^k$, hence the scalar value is the displayed
$m_k\Wass_2^2$ term. If $m_k=0$, nonnegativity and conservation force the
whole channel to vanish. Summing over all channels proves the claim.
:::

The conservative positive-cone model above is the basic extension of
Benamou--Brenier. Adding a source term
$\partial_t u+\nabla\cdot V=S$ and a convex perspective penalty in $S$ gives
unbalanced or reaction--transport variants
{cite:p}`maas2015generalized,maas2016generalized,dolbeault2009new,MielkeCVPDE`.
These generalized transport models include dissipation and density
modulation. The figure below contrasts the exact diagonal case
$\kappa=0$, where each positive channel is transported by its quantile map,
with a large-$\kappa$ illustrative common-mode interpolation in which the
channels move more coherently. The endpoints are two-mode mixtures: at each
spatial mode the two channels have Gaussian profiles with the same center
but different amplitudes.

(fig:vector-valued-measure-geodesics)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("vector-valued-measure-geodesics")
```

*One-dimensional positive $\RR_+^2$-valued transport displayed by arrow
glyphs at eight time levels. Each endpoint is a mixture of two localized
Gaussian modes, and, inside each mode, both channel profiles have the same
center. Each arrow is proportional to the local fiber value
$(u_t^1(x),u_t^2(x))$, and time runs vertically from the red source to the
blue target. Left: for $\kappa=0$, the diagonal mobility gives two
independent scalar quantile geodesics. Right: a large-$\kappa$ common-mode
interpolation bends the display toward $q=2^{-1/2}(1,1)$, illustrating the
effect of a mobility that favors coherent channel motion while keeping the
same componentwise continuity equation.*
:::

The interactive demo keeps the same glyph idea and lets the coupling strength bend
the fibers toward a common channel direction.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the coupling and mixture controls to see how vector-valued mass transports both location and channel composition.
:::

<iframe class="ot4ml-live-frame" title="Vector-valued transport controls" src="../live/beyond-vector.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

### Positive Matrix-Valued Measures

The next simplest fiber is the positive matrix cone. This is the simplest
tensor-valued model beyond vectors: the diagonal entries behave like positive
channels, while the eigenvectors encode local orientations.

(def-positive-matrix-valued-measure)=
:::{admonition} Definition: Positive Matrix-Valued Measure
:class: important
Write $\mathbb S^m$ for real symmetric matrices and $\mathbb S_+^m$ for the
positive semidefinite cone. A positive $\mathbb S_+^m$-valued measure is a
countably additive map from Borel sets of $\X$ to $\mathbb S_+^m$; the cone of
such measures is denoted by

```{math}
\mathcal A\in\mathcal M_+(\X;\mathbb S_+^m).
```
:::

Equivalently, $\mathcal A$ is a symmetric matrix of finite signed measures
such that $\mathcal A(E)\succeq0$ for every Borel set $E$. If $\mathcal A$
has density $A(x)\succeq0$, then $\operatorname{tr}A(x)$ is
the scalar amount of mass at $x$, while, wherever $\operatorname{tr}A(x)>0$,
the normalized matrix $A(x)/\operatorname{tr}A(x)$ records an internal
covariance or orientation. This is the matrix analogue of the positive vector
case: diagonal matrices encode nonnegative vector components, and
non-diagonal matrices add a local eigenbasis.

The conservative Benamou--Brenier model fixes a matrix density
$A_t(x)\in\mathbb S_+^m$ and symmetric matrix fluxes
$P_t(x)=(P_{t,1},\ldots,P_{t,d})\in(\mathbb S^m)^d$. With no flux through the
boundary of $\X$, the full matrix mass $\int_\X A_t(x)\d x$ is conserved, so
the endpoints must have the same total matrix. The model minimizes the
matrix-perspective action

```{math}
:label: eq-matrix-valued-bb
\mathcal W_{\mathrm{mat}}^2(\mathcal A_0,\mathcal A_1)
\eqdef
\inf_{A,P}
\int_0^1\!\int_\X
\sum_{\ell=1}^d
\operatorname{tr}\!\left(P_{t,\ell}^{\top} A_t^\dagger P_{t,\ell}\right)
\d x\,\d t
```

subject to $A_0\d x=\mathcal A_0$, $A_1\d x=\mathcal A_1$ and to the
matrix-valued continuity equation

```{math}
:label: eq-matrix-valued-continuity
\partial_t A_t+\nabla_x\cdot P_t=0,
\qquad
\nabla_x\cdot P_t
=
\sum_{\ell=1}^d\partial_{x_\ell}P_{t,\ell}.
```

Here $A^\dagger$ denotes the Moore--Penrose inverse, with the usual
lower-semicontinuous perspective convention: the action is finite only when
the columns of each $P_{t,\ell}$ belong to the range of $A_t$. The matrix
fractional map $(A,P)\mapsto\operatorname{tr}(P^\top A^\dagger P)$ is jointly
convex on this effective domain and positively one-homogeneous in $(A,P)$.
This gives the simplest
non-trivial matrix-valued transport model: spatial motion is conservative,
but the fiber carries orientation through the eigenvectors of $A_t(x)$.

(prop-matrix-diagonal-reduction)=
:::{admonition} Proposition: Diagonal Matrix Subproblem
:class: important
Assume that the endpoints are diagonal in a fixed orthonormal basis,

```{math}
\mathcal A_i=\operatorname{diag}(\al_i^1,\ldots,\al_i^m),
\qquad i=0,1,
```

and that $\al_0^k(\X)=\al_1^k(\X)=m_k$ for every $k$. If one restricts the
admissible curves in {eq}`eq-matrix-valued-bb` to remain diagonal in that
basis,

```{math}
A_t=\operatorname{diag}(u_t^1,\ldots,u_t^m),
\qquad
P_{t,\ell}=\operatorname{diag}(V_{t,\ell}^1,\ldots,V_{t,\ell}^m),
```

then the restricted matrix problem has value

```{math}
\sum_{k:m_k>0}
m_k\,
\Wass_2^2\!\left(
\frac{\al_0^k}{m_k},
\frac{\al_1^k}{m_k}
\right).
```

with zero contribution from zero-mass channels. Thus the commuting matrix
submodel is exactly the diagonal positive vector-valued Benamou--Brenier
model.
:::

:::{dropdown} Proof
The continuity equation {eq}`eq-matrix-valued-continuity` is diagonal entry by
diagonal entry and gives $\partial_t u^k+\nabla\cdot V^k=0$. Moreover,

```{math}
\sum_{\ell=1}^d
\operatorname{tr}\!\left(P_{t,\ell}^{\top}A_t^\dagger P_{t,\ell}\right)
=
\sum_{k=1}^m\frac{|V_t^k|^2}{u_t^k},
```

with the same scalar perspective convention as before. The admissible set and
the action are therefore exactly those of the diagonal vector model.
:::

The restriction to a fixed diagonal basis gives eigenvalue transport; it
should be read as a commuting submodel, not as a claim that non-diagonal
excursions can never change the unrestricted value. The genuinely
matrix-valued case starts when the eigenspaces vary with $x$ or along the
interpolation, so that the transported object carries both mass and
orientation. Static matrix-valued Monge--Kantorovich problems and dual
test-function metrics were developed in
{cite:p}`Ning2014metrics,JiangSpectral,ning2015matrix`; dynamic versions and
related non-commutative geometries appear in
{cite:p}`Chen2016,ChenGangbo17,Carlen2014,2016-peyre-qot`. The figure below
shows the analogous independent/coupled contrast for positive $2\times2$
matrix fibers, using two localized matrix modes whose eigenvalue profiles
share a common center at each mode.

(fig:matrix-valued-measure-geodesic)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("matrix-valued-measure-geodesic")
```

*Positive $2\times2$ matrix-valued transport on a one-dimensional base. Each
endpoint is a mixture of two localized matrix modes; within one mode, both
eigenvalue profiles are Gaussian bumps with the same center. Each ellipse is
the glyph of a positive semidefinite matrix $A_t(x)$, with axes given by
eigenvectors and eigenvalues. Left: the matrices are diagonal in a fixed
basis, giving the commuting tensor analogue of independent vector channels.
Right: a coupled illustrative interpolation bends packet motion toward the
trace-density transport and uses non-commuting eigendirections; the
superposition remains positive semidefinite and produces spatially varying
orientations.*
:::


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the coupling and rotation controls to compare matrix-valued transport of anisotropic local structure.
:::

<iframe class="ot4ml-live-frame" title="Matrix-valued transport controls" src="../live/beyond-matrix.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

:::{admonition} Example: Diagonal and coupled positive mobilities
:class: ot4ml-example

Choose a mobility matrix $\mathsf M(u)\in\mathbb S_+^m$, where $\mathbb S_+^m$ denotes the cone of real symmetric positive semidefinite matrices, and set

```{math}
\Phi_{\mathsf M}(u,V)
=
\sum_{\ell=1}^d V_{\ell}^{\top}\mathsf M(u)^\dagger V_{\ell},
```

with the usual convention that the value is finite only when each $V_\ell$ belongs to the range of $\mathsf M(u)$. One chooses $\mathsf M$ so that this matrix perspective is convex and one-homogeneous in $(u,V)$; this holds for the linear positive mobilities below. For $m=1$ and $\mathsf M(u)=u$, one recovers exactly the scalar Benamou--Brenier action. For

```{math}
\mathsf M_{\mathrm{diag}}(u)=\diag(u_1,\ldots,u_m),
```

the channels move independently. Non-diagonal mobilities are the simplest way to couple the coordinates while keeping the same componentwise conservation law. For instance, with $q=m^{-1/2}(1,\ldots,1)$ and $\kappa\geq0$,

```{math}
\mathsf M_\kappa(u)=\diag(u)+\kappa\Big(\sum_{k=1}^m u_k\Big) q q^\top
```

increases the mobility in the common channel direction $q$ while leaving transverse directions controlled by the diagonal part. The local cost of moving one component can therefore depend on the densities and momenta of the other components, even though each component mass remains conserved.
:::


(sec-wasserstein-over-wasserstein)=
## Wasserstein Over Wasserstein

The construction can be iterated. Once $(\X,d)$ is a metric space, the set of
probability measures on $\X$ becomes a metric space through $\Wass_p$. It can
therefore serve as a new ground space. This is useful whenever the objects to
compare are themselves random probability measures, or mixtures whose
components are meaningful objects rather than only a collapsed density.

The standard setting is that of Polish spaces, introduced in
{ref}`def-polish-metric-space`. These assumptions provide separability,
completeness, tightness criteria and regular conditional probabilities. The
next proposition shows that Wasserstein spaces preserve this well-behaved
structure.

(prop-wasserstein-space-polish)=
:::{admonition} Proposition: Wasserstein Spaces As Ground Spaces
:class: important
Let $1\leq p<\infty$. If $(\X,d)$ is Polish, then
$(\Pp_p(\X),\Wass_p)$ is Polish. If $\X$ is compact, then
$\Pp_p(\X)=\Pp(\X)$ and this space is compact for $\Wass_p$. Consequently,
the construction may be iterated, with the corresponding finite-moment
condition at every level.
:::

:::{dropdown} Proof
From a $\Wass_p$-Cauchy sequence, extract a subsequence $(\alpha_k)_k$ such
that $\sum_k\Wass_p(\alpha_k,\alpha_{k+1})<\infty$. Gluing optimal couplings
of consecutive terms produces random variables $(X_k)_k$ with laws
$\alpha_k$ and
$\sum_k\|d(X_k,X_{k+1})\|_{L^p}<\infty$. Hence $(X_k)_k$ converges almost
surely and in $L^p$ to an $\X$-valued random variable, whose law is the
$\Wass_p$ limit. Separability follows by approximating measures with finitely
supported measures on a countable dense subset and rational weights. If
$\X$ is compact, Prokhorov compactness and Wasserstein metrization of weak
convergence give compactness.
:::

Fix $1\leq p<\infty$. Elements of $\Pp_p(\Pp_p(\X))$ are probability laws
over probability measures, or random probability measures. A measurable
parametric family gives

```{math}
:label: eq-wow-parametric-law
\mathfrak A=(\zeta\mapsto\alpha_\zeta)_\sharp\gamma.
```

This law belongs to $\Pp_p(\Pp_p(\X))$ precisely when, for one and hence every
$x_0\in\X$,

```{math}
\int \Wass_p(\alpha_\zeta,\delta_{x_0})^p\,\d\gamma(\zeta)<\infty.
```

(def-collapsed-barycentric-mixture)=
:::{admonition} Definition: Collapsed, Or Barycentric, Mixture
:class: important
For $\mathfrak A\in\Pp(\Pp(\X))$, the collapsed mixture is defined by

```{math}
:label: eq-wow-barycentric-mixture
\int_\X f(x)\d\bar\alpha_{\mathfrak A}(x)
=
\int_{\Pp(\X)}
\left(\int_\X f(x)\d\alpha(x)\right)
\d\mathfrak A(\alpha)
```

for every bounded continuous $f$.
:::

If $\mathfrak A\in\Pp_p(\Pp_p(\X))$, then
$\bar\alpha_{\mathfrak A}\in\Pp_p(\X)$ because

```{math}
\int_\X d(x,x_0)^p\,\d\bar\alpha_{\mathfrak A}(x)
=
\int_{\Pp_p(\X)}\Wass_p(\alpha,\delta_{x_0})^p\,\d\mathfrak A(\alpha).
```

The Wasserstein distance on the Wasserstein space is

```{math}
:label: eq-wow-distance
\mathbb W_p^p(\mathfrak A,\mathfrak B)
\eqdef
\inf_{\Pi\in\Couplings(\mathfrak A,\mathfrak B)}
\int_{\Pp_p(\X)\times\Pp_p(\X)}
\Wass_p^p(\alpha,\beta)\d\Pi(\alpha,\beta),
\qquad
\mathfrak A,\mathfrak B\in\Pp_p(\Pp_p(\X)).
```

For $p=2$, Gaussian mixtures provide an explicit example with two geometries.
A mixture can be viewed
as a collapsed density on $\X$, or as a component law over Gaussian atoms in
the Bures--Wasserstein space. For two component laws

```{math}
\mathfrak A=\sum_i a_i\delta_{\Gaussian(m_i,\Sigma_i)},
\qquad
\mathfrak B=\sum_j b_j\delta_{\Gaussian(n_j,\Lambda_j)},
```

the component-level problem uses the cost

```{math}
C_{ij}=\norm{m_i-n_j}^2+\Bb(\Sigma_i,\Lambda_j)^2.
```

If $\Pi^\star$ is an optimal coupling between the weights $a$ and $b$, and if
$A_{ij}$ is the Brenier linear part from $\Sigma_i$ to $\Lambda_j$, each active
pair follows the Gaussian geodesic

```{math}
m_{ij,t}=(1-t)m_i+t n_j,
\qquad
\Sigma_{ij,t}
=
\big((1-t)\Id+tA_{ij}\big)\Sigma_i
\big((1-t)\Id+tA_{ij}\big)^\top.
```

Collapsing these component geodesics gives

```{math}
\bar\alpha_t=
\sum_{i,j}\Pi^\star_{ij}\Gaussian(m_{ij,t},\Sigma_{ij,t}).
```

This component-level interpolation generally differs from the true $\Wass_2$
interpolation between the collapsed mixture densities.

(fig:kantorovich-wow-mixtures)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("kantorovich-wow-mixtures")
```

*Two interpolations between the same asymmetric three-component
one-dimensional Gaussian mixtures. The red endpoint has a broad central
component carrying most of the mass, while the blue endpoint has two dominant
sharp side modes. Left: Gaussian components are transported as atoms using
their Bures--Wasserstein distance. Right: the collapsed densities are
interpolated by the true one-dimensional quantile formula for $\Wass_2$. The
central mass is split and recombined in the collapsed geometry, making the two
paths visibly distinct.*
:::

The interactive comparison keeps both geometries side by side: component-level
transport moves Gaussian atoms, while collapsed transport rearranges the full
density.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the mixture and blur controls to compare transport between ordinary measures with transport between distributions of measures.
:::

<iframe class="ot4ml-live-frame" title="Wasserstein-over-Wasserstein controls" src="../live/kantorovich-wow.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

(prop-wow-collapsed-bound)=
:::{admonition} Proposition: Collapsing Is Non-Expansive
:class: important
Let $(\X,d)$ be Polish, let $1\leq p<\infty$, and let
$\mathfrak A,\mathfrak B\in\Pp_p(\Pp_p(\X))$. Then

```{math}
\Wass_p(\bar\alpha_{\mathfrak A},\bar\beta_{\mathfrak B})
\leq
\mathbb W_p(\mathfrak A,\mathfrak B).
```
:::

:::{dropdown} Proof
Fix a coupling $\Pi$ between $\mathfrak A$ and $\mathfrak B$ and $\eta>0$.
A measurable-selection theorem gives a measurable kernel
$\pi_{\alpha,\beta}\in\Couplings(\alpha,\beta)$ whose cost is at most
$\Wass_p(\alpha,\beta)^p+\eta$. Integrating this kernel against $\Pi$ gives a
coupling between the collapsed mixtures. Its cost is at most the
$\Pi$-average of $\Wass_p^p(\alpha,\beta)$ plus $\eta$. Letting
$\eta\downarrow0$, taking the infimum over $\Pi$, and then taking the
$p$-th root proves the claim.
:::

This viewpoint also clarifies lower bounds for Gromov--Wasserstein distances:
a metric-measure space can be mapped to a law of local distance profiles, and
these laws can be compared by Wasserstein-over-Wasserstein.

:::{admonition} Remark: Local profiles as Wasserstein-over-Wasserstein laws
:class: ot4ml-remark

Given a metric-measure space $\XX=(\X,\dist_\X,\al_\X)$, each point defines a local distance distribution

```{math}
\alpha_x=(\dist_\X(x,\cdot))_\sharp\al_\X\in\Pp(\RR_+),
\qquad
\mathfrak D_\XX=(x\mapsto\alpha_x)_\sharp\al_\X\in\Pp(\Pp(\RR_+)).
```

The Memoli profile lower bound in Proposition
{ref}`prop-memoli-gw-profile-lower-bound` is precisely a
Wasserstein-over-Wasserstein comparison of these laws of local profiles. It
replaces the full pairwise distortion by an ordinary OT problem whose ground
cost is itself a one-dimensional Wasserstein distance.
:::


(sec-gromov-wasserstein)=
## Gromov--Wasserstein

Gromov--Wasserstein compares spaces through their internal distance
structures rather than through a fixed ambient ground cost. This is the right
extension for graphs, shapes and point clouds whose points are not
pre-aligned.

### Discrete Formulation

Optimal transport needs a ground cost $C$ to compare histograms $(a,b)$, and
thus cannot be used directly if the histograms are not defined on the same
underlying space, or if one cannot pre-register these spaces to define a
ground cost. Instead, assume that two matrices
$D\in\RR^{n\times n}$ and $D'\in\RR^{m\times m}$ represent relationships
between points. A typical scenario is when these matrices are powers of
distance matrices. Define the quadratic distortion and its minimum by

```{math}
:label: eq-gw-def
\begin{aligned}
\mathcal E_{D,D'}(P)
&\eqdef
\sum_{i,j,i',j'}
\Delta(D_{i,i'},D'_{j,j'})^pP_{i,j}P_{i',j'},
\\
\operatorname{GW}((a,D),(b,D'))^p
&\eqdef
\min_{P\in\mathbf U(a,b)}\mathcal E_{D,D'}(P).
\end{aligned}
```

where $p\geq1$ and $\Delta$ is usually $\Delta(u,v)=|u-v|$. This is a
non-convex quadratic problem over the transport polytope. In the uniform
case with $m=n$ and $P$ constrained to be a permutation matrix, it becomes a
Quadratic Assignment Problem, already NP-hard in full generality
{cite:p}`loiola-2007`. The relaxed coupling formulation can therefore be
read as a soft graph-matching model {cite:p}`lyzinski-2015`.

(fig:gromov-isometry-matching)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("gromov-isometry-matching")
```

*Gromov--Wasserstein correspondences under increasing deformation. The red
and blue point clouds are not compared through an ambient Euclidean
cross-cost; instead, the GW coupling compares their internal pairwise
distances. A perfectly isometric copy admits a clean structural match, while
mild and deliberately stronger deformations progressively bend the
correspondence.*
:::

The interactive demo uses a fixed structural correspondence and lets the deformation
change the pairwise-distance residual. This isolates the quantity minimized by
the GW objective.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the deformation and point controls to inspect correspondences when only within-space distances are meaningful.
:::

<iframe class="ot4ml-live-frame" title="Gromov-Wasserstein matching controls" src="../live/beyond-gromov.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

When $D,D'$ are genuine distance matrices, the construction below defines a
distance between metric spaces equipped with a probability distribution, up to
measure-preserving isometries
{cite:p}`memoli-2011,SturmGW,schmitzer2013modelling`. The same construction
also explains why GW satisfies the triangle inequality after quotienting by
isometries, and its relation to Hausdorff and Gromov--Hausdorff distances is
discussed at the end of the section.

### General Setting

The continuous formulation abstracts the discrete distance matrices into
metric-measure spaces, so that GW compares intrinsic geometries independently
of labels, parametrizations or ambient coordinates.

(def-metric-measure-space)=
:::{admonition} Definition: Metric-Measure Space
:class: important
A metric-measure space is a triple

```{math}
\mathbb X=(\X,d_\X,\alpha),
```

where $(\X,d_\X)$ is Polish and $\alpha$ is a Borel probability measure on
$\X$. For a finite $p$-Gromov--Wasserstein distance one assumes

```{math}
\int_{\X\times\X}d_\X(x,x')^p\,\d\alpha(x)\d\alpha(x')<\infty.
```
:::

Compactness is often assumed below to avoid additional tightness and
integrability arguments.

For metric-measure spaces $\mathbb X=(\X,d_\X,\alpha)$ and
$\mathbb Y=(\Y,d_\Y,\beta)$, define

```{math}
:label: eq-gw-generic
\operatorname{GW}(\mathbb X,\mathbb Y)^p
\eqdef
\min_{\pi\in\Couplings(\alpha,\beta)}
\int_{\X^2\times\Y^2}
\Delta(d_\X(x,x'),d_\Y(y,y'))^p
\d\pi(x,y)\d\pi(x',y').
```

(prop-gw-controlled-by-wasserstein)=
:::{admonition} Proposition: Fixed-Space GW Is Controlled by Wasserstein
:class: important
Let $\alpha,\beta\in\Pp_p(\X)$ be probability measures on the same metric
space $(\X,d_\X)$, and take $\Delta(u,v)=|u-v|$ in
{eq}`eq-gw-generic`. Then

```{math}
\operatorname{GW}((\X,d_\X,\alpha),(\X,d_\X,\beta))
\leq
2\Wass_p(\alpha,\beta).
```

The Wasserstein distance uses the same ground metric $d_\X$. The factor two
comes from the normalization in {eq}`eq-gw-generic`.
:::

:::{dropdown} Proof
Let $\pi$ be any coupling between $\alpha$ and $\beta$. For two independent
pairs $(X,Y),(X',Y')\sim\pi$, the reverse triangle inequality gives

```{math}
\left|d_\X(X,X')-d_\X(Y,Y')\right|
\leq
d_\X(X,Y)+d_\X(X',Y').
```

Taking the $L^p$ norm and using Minkowski gives a bound by
$2(\int d_\X(x,y)^p\d\pi)^{1/p}$. Optimizing over $\pi$ proves the claim.
:::

(def-isometric-mm-spaces)=
:::{admonition} Definition: Isometric Metric-Measure Spaces
:class: important
Two metric-measure spaces $\mathbb X=(\X,d_\X,\alpha)$ and
$\mathbb Y=(\Y,d_\Y,\beta)$ are isometric if there exists a bijection
$\phi:\operatorname{supp}(\alpha)\to\operatorname{supp}(\beta)$ such that
$\phi_\sharp\alpha=\beta$ and

```{math}
d_\Y(\phi(x),\phi(x'))=d_\X(x,x')
```

for all $x,x'\in\operatorname{supp}(\alpha)$.
:::

(thm-gw-metric)=
:::{admonition} Theorem: Gromov--Wasserstein Metric Modulo Isometries
:class: important
For compact metric-measure spaces, $p\geq1$ and $\Delta(u,v)=|u-v|$,
$\operatorname{GW}$ defines a distance up to measure-preserving isometries.
:::

:::{dropdown} Proof
Compactness makes the coupling set compact and the distortion continuous, so
an optimal coupling exists. A measure-preserving isometry induces a graph
coupling with zero distortion; symmetry and non-negativity are immediate.

If $\operatorname{GW}(\mathbb X,\mathbb Y)=0$ and $\pi$ is optimal, then
$d_\X(x,x')=d_\Y(y,y')$ holds $\pi\otimes\pi$-almost everywhere. By
continuity, this equality holds on $\operatorname{supp}(\pi)^2$. Both
$\mathbb X$ and $\mathbb Y$ are isometric to the support space
$(\operatorname{supp}(\pi),d_\pi,\pi)$, where

```{math}
d_\pi((x,y),(x',y'))
\eqdef
\frac12d_\X(x,x')+\frac12d_\Y(y,y').
```

The first projection is measure-preserving and distance-preserving on
$\operatorname{supp}(\pi)$, and compactness gives surjectivity onto
$\operatorname{supp}(\alpha)$; the same argument applies to the second
projection.

For the triangle inequality, glue optimal couplings between
$\mathbb X,\mathbb Y$ and between $\mathbb Y,\mathbb Z$. The projected
$\X\times\Z$ marginal is feasible, and the pointwise triangle inequality
together with Minkowski gives

```{math}
\operatorname{GW}(\mathbb X,\mathbb Z)
\leq
\operatorname{GW}(\mathbb X,\mathbb Y)
+
\operatorname{GW}(\mathbb Y,\mathbb Z).
```

This proves the triangle inequality and completes the metric proof.
:::

(prop-gw-empirical-stability)=
:::{admonition} Proposition: Marginal Stability and Empirical GW Rates
:class: important
Let $\mathbb X=(\X,d_\X,\alpha)$ and
$\mathbb Y=(\Y,d_\Y,\beta)$ be compact metric-measure spaces. Replacing the
marginals by $\widetilde\alpha$ and $\widetilde\beta$ gives

```{math}
\left|
\operatorname{GW}((\X,d_\X,\widetilde\alpha),(\Y,d_\Y,\widetilde\beta))
-
\operatorname{GW}(\mathbb X,\mathbb Y)
\right|
\leq
2\Wass_p^\X(\widetilde\alpha,\alpha)
+
2\Wass_p^\Y(\widetilde\beta,\beta).
```

Consequently, for empirical measures $\widehat\alpha_n$ and
$\widehat\beta_m$,

```{math}
\mathbb E\left|
\operatorname{GW}((\X,d_\X,\widehat\alpha_n),(\Y,d_\Y,\widehat\beta_m))
-
\operatorname{GW}(\mathbb X,\mathbb Y)
\right|
\leq
2\mathbb E\Wass_p^\X(\widehat\alpha_n,\alpha)
+
2\mathbb E\Wass_p^\Y(\widehat\beta_m,\beta).
```
:::

:::{dropdown} Proof
Apply the GW triangle inequality in both directions. Each error term compares
the same underlying metric space equipped with two different measures, so
{ref}`prop-gw-controlled-by-wasserstein` bounds it by twice the corresponding
ordinary Wasserstein distance. Taking expectations yields the empirical
bound; the rates are therefore those developed in
{ref}`sec-sample-complexity`.
:::

The metric structure also gives geodesics. Sturm's construction allows one to
speak about interpolation, barycenters and gradient flows directly on the
space of metric-measure spaces, even though the intermediate space lives on a
product support and is therefore expensive numerically {cite:p}`SturmGW`.

(prop-gw-geodesics)=
:::{admonition} Proposition: Gromov--Wasserstein Geodesics
:class: important
Let $\mathbb X_0=(\X_0,d_{\X_0},\alpha_0)$ and
$\mathbb X_1=(\X_1,d_{\X_1},\alpha_1)$ be compact metric-measure spaces, and
let $\pi^\star$ be an optimal coupling. Define, on $\mathcal Z=\X_0\times\X_1$,

```{math}
d_t((x_0,x_1),(x'_0,x'_1))
\eqdef
(1-t)d_{\X_0}(x_0,x'_0)
+
t d_{\X_1}(x_1,x'_1),
\qquad
\mathbb X_t=(\mathcal Z,d_t,\pi^\star).
```

For $0<t<1$, $d_t$ is a metric. At the endpoints one quotients the product
space by the corresponding zero-distance relation. Then
$t\mapsto\mathbb X_t$ is a constant-speed geodesic:

```{math}
\operatorname{GW}(\mathbb X_s,\mathbb X_t)
=
|t-s|\operatorname{GW}(\mathbb X_0,\mathbb X_1).
```
:::

:::{dropdown} Proof
For $s<t$, couple $\mathbb X_s$ and $\mathbb X_t$ by the diagonal coupling on
$\mathcal Z$. The distance difference is exactly

```{math}
d_t(z,z')-d_s(z,z')
=
(t-s)\big(d_{\X_1}(x_1,x'_1)-d_{\X_0}(x_0,x'_0)\big),
```

so $\operatorname{GW}(\mathbb X_s,\mathbb X_t)\leq(t-s)D$, where
$D=\operatorname{GW}(\mathbb X_0,\mathbb X_1)$. Applying the triangle
inequality to
$\mathbb X_0,\mathbb X_s,\mathbb X_t,\mathbb X_1$ gives the reverse bound.
:::

(fig:gromov-nonisometric-distortion)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("gromov-nonisometric-distortion")
```

*Local distortion in a mildly non-isometric GW match. The left panel colors
transport segments by the average residual induced by the displayed hard
correspondence. The right panel shows the pairwise-distance residual matrix
$|d_\X(x_i,x_{i'})-d_\Y(y_{\sigma(i)},y_{\sigma(i')})|$, with darker entries
marking larger local distortion. This matrix is the local contribution
minimized by the discrete GW objective for the displayed correspondence.*
:::


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the deformation and shift controls to see where a Gromov-Wasserstein correspondence preserves or distorts pairwise distances.
:::

<iframe class="ot4ml-live-frame" title="Gromov-Wasserstein distortion controls" src="../live/beyond-gromov-distortion.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

(prop-memoli-gw-profile-lower-bound)=
:::{admonition} Proposition: Memoli Profile Lower Bound
:class: important
Let $\mathbb X=(\X,d_\X,\alpha)$ and $\mathbb Y=(\Y,d_\Y,\beta)$ be compact
metric-measure spaces. For each $x\in\X$ and $y\in\Y$, define the
distance-profile measures on $\RR_+$ by

```{math}
\alpha_x\eqdef(d_\X(x,\cdot))_\sharp\alpha,
\qquad
\beta_y\eqdef(d_\Y(y,\cdot))_\sharp\beta.
```

Let $\mathfrak D_\mathbb X=(x\mapsto\alpha_x)_\sharp\alpha$ and
$\mathfrak D_\mathbb Y=(y\mapsto\beta_y)_\sharp\beta$. Then

```{math}
\mathbb W_p(\mathfrak D_\mathbb X,\mathfrak D_\mathbb Y)
\leq
\operatorname{GW}(\mathbb X,\mathbb Y),
```

where $\mathbb W_p$ is the Wasserstein-over-Wasserstein distance
{eq}`eq-wow-distance`, whose ground metric is the one-dimensional
$\Wass_p$ distance between profile measures.
:::

:::{dropdown} Proof
Fix any $\pi\in\Couplings(\alpha,\beta)$. It induces a coupling
$(x,y)\mapsto(\alpha_x,\beta_y)$ between the profile laws, hence

```{math}
\mathbb W_p(\mathfrak D_\mathbb X,\mathfrak D_\mathbb Y)^p
\leq
\int_{\X\times\Y}
\Wass_p(\alpha_x,\beta_y)^p\,\d\pi(x,y).
```

For fixed $(x,y)$, the map
$(x',y')\mapsto(d_\X(x,x'),d_\Y(y,y'))$ pushes the same coupling $\pi$ to a
coupling between $\alpha_x$ and $\beta_y$. Integrating the resulting
one-dimensional OT bound over $(x,y)$ gives the GW objective for $\pi$.
Taking the infimum over $\pi$ proves the claim.
:::

The next figure exposes the two nested transport problems on densely sampled
silhouettes: sorting each distance row computes the one-dimensional profile
costs exactly, then an outer assignment couples the resulting empirical
profile laws.

(fig:gromov-memoli-distance-profiles)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
# Exact sorted profiles; the histograms are display summaries only.
show_book_figure("gromov-memoli-distance-profiles")
```

*Mémoli distance profiles expose a computable lower bound for intrinsic GW
comparison.* The cat and bunny silhouettes are discretized by $300$ well-spread
farthest-point samples and normalized to unit diameter. Eight representative
cat anchors are selected by a second farthest-point pass; their bunny partners are
their exact images under the optimal profile assignment with cost
$C_{ij}=\Wass_2^2(\alpha_{x_i},\beta_{y_j})$. Matching colors identify each
pair, its segment and its two side histograms. The $20$ histogram bins are used
only for display: every profile cost is computed exactly by sorting all $300$
distances. The value below the shapes is the certified Mémoli lower bound.
:::

This lower bound is useful computationally because the profile cost matrix
$C_{ij}=\Wass_p(\alpha_{x_i},\beta_{y_j})^p$ is an ordinary OT cost between
points. Solving this easier OT problem gives a geometry-aware initialization
for the non-convex GW iterations.

### Relation With Wasserstein-Procrustes

The profile lower bound is intrinsic. In Euclidean applications, it is naturally
paired with an extrinsic upper certificate obtained by registering the two
measures before applying the ordinary Wasserstein distance.

(prop-gw-procrustes-upper-certificate)=
:::{admonition} Proposition: Wasserstein-Procrustes Upper Certificate
:class: important
Let $\alpha,\beta$ be probability measures on $\RR^d$, equipped with the
Euclidean distance, and take $\Delta(u,v)=|u-v|$. If
$\Wass_{p,\mathrm E(d)}$ denotes the quotient Wasserstein distance under the
Euclidean group, then

```{math}
:label: eq-gw-procrustes-upper-gw-section
\operatorname{GW}((\RR^d,\norm{\cdot},\alpha),(\RR^d,\norm{\cdot},\beta))
\leq
2\,\Wass_{p,\mathrm E(d)}([\alpha],[\beta]).
```
:::

:::{dropdown} Proof
Let $g,h\in\mathrm E(d)$ be rigid motions. They preserve all pairwise
Euclidean distances, so
$(\RR^d,\norm{\cdot},\alpha)$ is isometric to
$(\RR^d,\norm{\cdot},g_\sharp\alpha)$, and similarly for $\beta$ and
$h_\sharp\beta$. Hence $\operatorname{GW}$ is unchanged by pushing the two
measures forward by $g$ and $h$. Applying
{ref}`prop-gw-controlled-by-wasserstein` to $g_\sharp\alpha$ and
$h_\sharp\beta$ gives

```{math}
\operatorname{GW}((\RR^d,\norm{\cdot},\alpha),(\RR^d,\norm{\cdot},\beta))
\leq
2\,\Wass_p(g_\sharp\alpha,h_\sharp\beta).
```

Taking the infimum over $g,h\in\mathrm E(d)$ proves the result.
:::

Wasserstein-Procrustes therefore gives an extrinsic certificate that a Euclidean
GW distance is small. The converse need not hold, because a small GW value may
be achieved by an intrinsic correspondence that is not induced by any ambient
rigid motion. Combining the profile lower bound with the Procrustes upper
certificate gives the sandwich

```{math}
:label: eq-gw-profile-procrustes-sandwich
\mathbb W_p(\mathfrak D_\mathbb X,\mathfrak D_\mathbb Y)
\leq
\operatorname{GW}(\mathbb X,\mathbb Y)
\leq
2\,\Wass_{p,\mathrm E(d)}([\alpha],[\beta]),
```

where
$\mathbb X=(\RR^d,\norm{\cdot},\alpha)$ and
$\mathbb Y=(\RR^d,\norm{\cdot},\beta)$. The left term is intrinsic and
inexpensive; the right term is an ambient rigid-registration certificate.

### Entropic Regularization and Fused GW

For the common squared distortion $\Delta(u,v)^2=(u-v)^2$, one often seeks
a stationary point of the entropic relaxation

```{math}
:label: eq-gw-entropy
\min_{P\in\mathbf U(a,b)}
\mathcal E_{D,D'}(P)-\epsilon H(P).
```

For symmetric distance matrices, define the half-gradient

```{math}
:label: eq-gw-sinkh
\C(P)
\eqdef
D^{\odot2}a\,\mathbf 1_m^\top
+
\mathbf 1_n(D'^{\odot2}b)^\top
-
2D\,P\,D'^\top,
\qquad
\nabla\mathcal E_{D,D'}(P)=2\C(P).
```

A standard fixed-point linearization {cite:p}`peyre2016gromov` computes

```{math}
P^{(\ell+1)}
=
\operatorname*{argmin}_{P\in\mathbf U(a,b)}
\langle P,\C(P^{(\ell)})\rangle
-\frac{\epsilon}{2}H(P).
```

The factor $\epsilon/2$ is essential because $\C(P)$ is one half of
the quadratic gradient. Each update is an ordinary entropic OT problem and
can therefore be solved with Sinkhorn iterations. If the iterates converge to
a positive fixed point, it satisfies the stationarity conditions of the
regularized GW objective. The basic fixed-point iteration is not a descent
method in general and has no global guarantee for this non-convex problem;
line searches or proximal variants are needed when monotone decrease is
required.

Fused Gromov--Wasserstein augments the structural term with a feature
transport cost {cite:p}`vayer2019optimaltransportstructured`. In the discrete
case, given a cross-feature cost $M\in\RR^{n\times m}$ and a parameter
$\lambda\in[0,1]$, one minimizes

```{math}
\operatorname{FGW}_{\lambda,p}((a,D),(b,D'))^p
\eqdef
\min_{P\in\mathbf U(a,b)}
(1-\lambda)\sum_{i,j}M_{ij}P_{ij}
+
\lambda
\sum_{i,j,i',j'}
\Delta(D_{ii'},D'_{jj'})^pP_{ij}P_{i'j'}.
```

The endpoints $\lambda=0$ and $\lambda=1$ recover feature-only OT and pure GW
respectively; intermediate values trade attribute matching against structural
matching. The first term compares node attributes in the usual OT sense, and
the second compares intrinsic geometry; this is useful when two spaces have
both distances and features, and the two sources of information may disagree.

(fig:fused-gromov-feature-geometry)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("fused-gromov-feature-geometry")
```

*Feature information and intrinsic geometry in fused Gromov--Wasserstein.
Small inner disks encode binary node features. Feature-only OT follows the
attributes even when this crosses the shape structure, pure GW follows the
intrinsic ordering, and fused GW balances the feature term with the
pairwise-distance distortion.*
:::


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the geometry-weight and feature-conflict controls to balance structural matching against feature agreement.
:::

<iframe class="ot4ml-live-frame" title="Fused Gromov-Wasserstein controls" src="../live/beyond-fused-gromov.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

### Hausdorff and Gromov--Hausdorff Viewpoints

If $A,B$ are compact subsets of a common metric space $(\mathcal Z,d_\mathcal Z)$,
their Hausdorff distance is

```{math}
d_{\mathrm H}^{\mathcal Z}(A,B)
=
\max\left\{
\sup_{a\in A}\inf_{b\in B}d_\mathcal Z(a,b),
\sup_{b\in B}\inf_{a\in A}d_\mathcal Z(a,b)
\right\}.
```

The Gromov--Hausdorff distance removes the common ambient space by minimizing
this quantity over all isometric embeddings into a third space:

```{math}
d_{\mathrm{GH}}(\X,\Y)
=
\inf_{\mathcal Z,\phi,\psi}
d_{\mathrm H}^{\mathcal Z}(\phi(\X),\psi(\Y)).
```

Equivalently, it is half the minimal distortion of a correspondence between
$\X$ and $\Y$ {cite:p}`gromov-2001,memoli-2007`. This is a worst-case set
distance: every point must be matched with small distortion.
Gromov--Wasserstein replaces correspondences by probability couplings and
worst-case distortion by averaged distortion. It is therefore better adapted
to noisy sampled shapes and weighted graphs, but it can ignore small sets of
mass that would dominate the Hausdorff distance.

(alg-entropic-gromov-wasserstein)=
:::{admonition} Algorithm: Entropic Gromov--Wasserstein linearization
:class: ot4ml-algorithm

**Input:** Symmetric metric matrices $\distD,\distD'$, weights $\a,\b$, regularization $\epsilon>0$, tolerance $\mathrm{tol}$, maximum iterations $L$.

**Output:** Approximate entropic GW coupling $\P\in\CouplingsD(\a,\b)$.

**Initialize:** Set $\P^{(0)}=\a\otimes\b$.

**For** $k=0,\ldots,L-1$ **do**:

> $\C^{(k)} = \distD^{\odot2}\a\,\ones_m^\top + \ones_n(\distD'^{\odot2}\b)^\top - 2\distD\,\P^{(k)}\,\transp{\distD'}.$
>
> **Solve** entropic OT subproblem:
> $\P^{(k+1)} = \uargmin{\P\in\CouplingsD(\a,\b)} \dotp{\P}{\C^{(k)}}-(\epsilon/2)\HD(\P).$
>
> **If** $\norm{\P^{(k+1)}-\P^{(k)}}_{\mathrm F}\leq\mathrm{tol}$ **then**:

>> **Return** $\P^{(k+1)}$.

**Return** $\P^{(L)}$.
:::

(ex-structured-objects-gw)=
:::{admonition} Example: Application to structured objects
:class: ot4ml-example

Graphs, molecules, meshes and point clouds often do not come with a common coordinate system or a reliable node-to-node correspondence. GW compares them through their internal distances, so the coupling $\P_{ij}$ becomes a soft structural correspondence rather than a spatial displacement. This is useful for graph matching, node embedding, shape comparison and molecule or mesh alignment {cite:p}`peyre2016gromov,vayer2019optimaltransportstructured`. When node attributes are also available, fused GW below adds a feature transport term to the intrinsic distortion, separating what should be preserved as structure from what should be matched as signal.
:::

(ex-multi-omics-alignment)=
:::{admonition} Example: Application to multi-omics alignment
:class: ot4ml-example

Multi-omics experiments can produce unmatched point clouds in different feature spaces, for instance RNA and ATAC profiles measured on different cells. If direct feature comparison is unavailable or incomplete, the relational term in GW preserves neighborhood structure; if partial cross-feature information exists, fused GW uses it through $M_{ij}$. Unbalanced and co-optimal variants further allow the number and relative importance of cells or features to differ across modalities. The mathematical template is therefore precise: preserve within-modality geometry while learning a cross-modality coupling {cite:p}`TranJanatiCourtyFlamaryRedkoDemetciSingh2022UCOOT,RyuBunnePinelloRegevLopez2024LabeledGW,StanojevicLiGarmire2022MultiOmicsReview`.
:::


(sec-quantum-ot)=
## Quantum Optimal Transport

Quantum optimal transport replaces probability vectors by density matrices
and scalar couplings by positive operators on a tensor product space. This is
the right language when the transported objects are matrix-valued signals,
covariance-like descriptors or quantum states, and it exposes a precise
bridge between OT, non-commutative entropy and operator scaling
{cite:p}`Ning2014metrics,Chen2016,ChenGangbo17,2016-peyre-qot,caglioti2019quantum,chakrabarti2019quantum`.

### Finite-Dimensional States and Couplings

(def-hermitian-density-matrices)=
:::{admonition} Definition: Hermitian and Density Matrices
:class: important
Let $\mathbb H_n$ be the real vector space of $n\times n$ Hermitian matrices,

```{math}
\mathbb H_n^+
=
\{A\in\mathbb H_n:A\succeq0\},
\qquad
\mathbb H_n^{+,1}
=
\{A\in\mathbb H_n^+:\operatorname{tr}(A)=1\}.
```

Elements of $\mathbb H_n^{+,1}$ are density matrices.
:::

A joint quantum state between $\mathbb C^n$ and $\mathbb C^m$ is a matrix
$T\in\mathbb H_{nm}^+$ acting on $\mathbb C^n\otimes\mathbb C^m$. Its
marginals are the partial traces, defined by duality through

```{math}
:label: eq-qot-partial-traces
\operatorname{tr}(F\,\operatorname{Tr}_B T)
=
\operatorname{tr}((F\otimes I_m)T),
\qquad
\operatorname{tr}(G\,\operatorname{Tr}_A T)
=
\operatorname{tr}((I_n\otimes G)T).
```

for all $F\in\mathbb H_n$ and $G\in\mathbb H_m$. Thus
$\operatorname{Tr}_B(T)\in\mathbb H_n^+$ and
$\operatorname{Tr}_A(T)\in\mathbb H_m^+$ play exactly the role of the two
marginals of a classical coupling.

(def-finite-dimensional-qot)=
:::{admonition} Definition: Finite-Dimensional Quantum OT
:class: important
Let $A\in\mathbb H_n^{+,1}$, $B\in\mathbb H_m^{+,1}$ and let
$C\in\mathbb H_{nm}$ be a Hermitian cost observable. The quantum OT value is
the semidefinite program

```{math}
:label: eq-qot-primal
\operatorname{QOT}_C(A,B)
\eqdef
\min_{T\in\mathbb H_{nm}^+}
\left\{
\operatorname{tr}(CT):
\operatorname{Tr}_B(T)=A,\
\operatorname{Tr}_A(T)=B
\right\}.
```
:::

The feasible set is never empty, since $A\otimes B$ has marginals $A$ and
$B$.

(rem-qot-classical-diagonal-case)=
:::{admonition} Example: Classical diagonal case
:class: ot4ml-example

Suppose that $A$, $B$ and $C$ are diagonal in fixed product bases. Let
$\Delta_A$ and $\Delta_B$ be the corresponding dephasing maps. For every
feasible $T$, the matrix
$\widetilde T=(\Delta_A\otimes\Delta_B)(T)$ is positive, has the same partial
traces, and satisfies
$\operatorname{tr}(C\widetilde T)=\operatorname{tr}(CT)$. Hence an optimizer
may be chosen diagonal. Its diagonal entries form a nonnegative matrix with
the prescribed row and column sums, so {eq}`eq-qot-primal` reduces exactly to
classical Kantorovich OT. Non-commuting data may instead require off-diagonal
coherences or entanglement.
:::


(prop-qot-duality)=
:::{admonition} Proposition: Quantum Kantorovich Duality
:class: important
For $A\in\mathbb H_n^{+,1}$ and $B\in\mathbb H_m^{+,1}$, the dual of
{eq}`eq-qot-primal` is

```{math}
:label: eq-qot-dual
\operatorname{QOT}_C(A,B)
=
\sup_{F\in\mathbb H_n,\ G\in\mathbb H_m}
\left\{
\operatorname{tr}(FA)+\operatorname{tr}(GB)
:
F\otimes I_m+I_n\otimes G\preceq C
\right\}.
```

There is no duality gap. If $A,B$ are positive definite, the supremum is
attained. For singular marginals, the primal reduces to the tensor product of
their supports; on this reduced space the corresponding dual maximum is
attained, while the full-space formula is always valid as a supremum.
:::

:::{dropdown} Proof
Introduce Hermitian Lagrange multipliers $F$ and $G$ for the two marginal
constraints. Using {eq}`eq-qot-partial-traces`, the Lagrangian is

```{math}
\operatorname{tr}(FA)+\operatorname{tr}(GB)
+
\operatorname{tr}\!\left((C-F\otimes I_m-I_n\otimes G)T\right).
```

Minimizing over $T\succeq0$ gives a finite lower bound if and only if
$C-F\otimes I_m-I_n\otimes G\succeq0$, in which case the infimum in $T$ is
$0$. When $A,B\succ0$, the coupling $A\otimes B$ is strictly feasible, so
Slater's theorem gives equality of primal and dual values and dual attainment.

For singular marginals, let $P_A,P_B$ be their support projections. Positivity
and

```{math}
\operatorname{tr}\!\left(((I_n-P_A)\otimes I_m)T\right)
=
\operatorname{tr}((I_n-P_A)A)=0
```

imply
$T=(P_A\otimes P_B)T(P_A\otimes P_B)$. Thus the primal is exactly the
problem compressed to $\operatorname{supp}(A)\otimes\operatorname{supp}(B)$,
where both reduced marginals are positive definite and Slater applies. The
unreduced dual values approach this reduced maximum by choosing sufficiently
negative potentials on the orthogonal complements.
:::

The dual potentials have the usual scalar gauge freedom: replacing
$(F,G)$ by $(F+tI_n,G-tI_m)$ leaves both the constraint and the value
unchanged because $\operatorname{tr}(A)=\operatorname{tr}(B)=1$.

### Entropic Regularization and Bregman Iterations

(def-von-neumann-quantum-entropy)=
:::{admonition} Definition: von Neumann Quantum Entropy
:class: important
For a density matrix or positive semidefinite matrix $T$, the shifted von
Neumann entropy functional used here is

```{math}
H(T)
=
\operatorname{tr}\!\left(T(\log T-I)\right),
\qquad
\nabla H(T)=\log T,
```

with the convention $0\log0=0$ on eigenvalues. This is the convex negative
quantum entropy; on trace-one states it differs from the physical entropy by
a sign and an additive constant.
:::

For $\epsilon>0$ define

```{math}
:label: eq-qot-entropic-primal
\operatorname{QOT}_C^\epsilon(A,B)
=
\min_{T\succeq0}
\left\{
\operatorname{tr}(CT)+\epsilon H(T):
\operatorname{Tr}_B(T)=A,\
\operatorname{Tr}_A(T)=B
\right\}.
```

This is the non-commutative analogue of entropic OT: the Shannon entropy of a
coupling is replaced by the trace entropy of a density matrix
{cite:p}`2016-peyre-qot,chakrabarti2019quantum`.

(prop-qot-entropic-duality)=
:::{admonition} Proposition: Entropic Quantum OT Duality
:class: important
Assume $A\succ0$, $B\succ0$ and $\epsilon>0$. Then
{eq}`eq-qot-entropic-primal` has a unique positive minimizer. Its dual is

```{math}
:label: eq-qot-entropic-dual
\operatorname{QOT}_C^\epsilon(A,B)
=
\max_{F\in\mathbb H_n,\ G\in\mathbb H_m}
\left\{
\operatorname{tr}(FA)+\operatorname{tr}(GB)
-
\epsilon\,
\operatorname{tr}
\exp\!\left(
\frac{F\otimes I_m+I_n\otimes G-C}{\epsilon}
\right)
\right\}.
```

At optimality, primal and dual variables are linked by the Gibbs formula

```{math}
:label: eq-qot-gibbs-coupling
T_e(F,G)
=
\exp\!\left(
\frac{F\otimes I_m+I_n\otimes G-C}{\epsilon}
\right).
```

with $\operatorname{Tr}_B(T_e)=A$ and $\operatorname{Tr}_A(T_e)=B$.
:::

:::{dropdown} Proof
The feasible set is compact and nonempty, and it contains the positive
definite point $A\otimes B$. The trace entropy is strictly convex on positive
semidefinite matrices, hence the regularized primal has a unique minimizer.
The minimizer is positive definite: otherwise, moving toward the positive
feasible point $A\otimes B$ would have entropy directional derivative
$-\infty$ at the boundary while changing the linear cost at finite rate.
Slater's condition justifies the Lagrange dual computation. The Fenchel
identity

```{math}
\sup_{T\succeq0}
\operatorname{tr}(YT)-\epsilon H(T)
=
\epsilon\,\operatorname{tr}\exp(Y/\epsilon)
```

is the matrix analogue of the scalar exponential conjugacy. Applying it to
the Lagrangian with
$Y=F\otimes I_m+I_n\otimes G-C$ gives {eq}`eq-qot-entropic-dual`, and the
stationarity condition gives {eq}`eq-qot-gibbs-coupling`; differentiating the
dual objective with respect to $F$ and $G$ yields the two marginal equations.
:::

Writing $K=\exp(-C/\epsilon)$, the objective differs by a constant from
$\epsilon$ times the quantum KL divergence

```{math}
D_H(T\mid K)
=
\operatorname{tr}\!\left(
T(\log T-\log K)-T+K
\right).
```

The exact quantum analogue of Sinkhorn is an implicit alternating Bregman
projection scheme onto the affine marginal sets

```{math}
\mathcal M_A=\{T\succeq0:\operatorname{Tr}_B(T)=A\},
\qquad
\mathcal M_B=\{T\succeq0:\operatorname{Tr}_A(T)=B\}.
```

(prop-qot-bregman-projections)=
:::{admonition} Proposition: Exact Bregman Projections
:class: important
Assume $A,B\succ0$ and let $K=\exp(-C/\epsilon)$. The minimizer of
{eq}`eq-qot-entropic-primal` is equivalently the minimizer of $D_H(T\mid K)$
over $\mathcal M_A\cap\mathcal M_B$. Moreover, if a current positive definite
matrix has Gibbs form $T_e(F,G)$, then its Bregman projection onto
$\mathcal M_A$ has the form $T_e(F^+,G)$, where $F^+$ is chosen so that
$\operatorname{Tr}_B T_e(F^+,G)=A$. The projection onto $\mathcal M_B$ is
analogous. Thus, when each one-block marginal equation is solved exactly,
alternating Bregman projections are equivalent to alternating block
maximization of the dual {eq}`eq-qot-entropic-dual`.
:::

:::{dropdown} Proof
Since $\log K=-C/\epsilon$,

```{math}
\operatorname{tr}(CT)+\epsilon H(T)
=
\epsilon D_H(T\mid K)-\epsilon\operatorname{tr}(K).
```

For the projection of a positive definite matrix $S$ onto $\mathcal M_A$, the
affine set contains the positive definite point $A\otimes I_m/m$. The entropy
derivative is singular at the boundary, so the projection lies in the
interior of the positive cone and the first variation has the form

```{math}
\log T-\log S-\Lambda\otimes I_m=0,
```

for a Hermitian multiplier $\Lambda$. Hence
$T=\exp(\log S+\Lambda\otimes I_m)$. If $S=T_e(F,G)$, this is again
$T_e(F+\epsilon\Lambda,G)$; the multiplier is fixed by the marginal equation.
The same argument applies to $\mathcal M_B$. Finally, the first-order
optimality condition for maximizing {eq}`eq-qot-entropic-dual` over one block
is exactly the corresponding marginal equation, so the Bregman and block-dual
views coincide.
:::

In the diagonal case this proposition gives the usual multiplicative Sinkhorn
updates. In the non-commutative case, however, the exact block equations

```{math}
\operatorname{Tr}_B T_e(F,G)=A,
\qquad
\operatorname{Tr}_A T_e(F,G)=B
```

do not admit scalar division formulas, because the exponential of
$F\otimes I_m+I_n\otimes G-C$ cannot be separated unless the local potential
commutes with the cost.

### Gurvits Scaling and Quantum Sinkhorn

The algorithm often called quantum Sinkhorn comes from the operator-scaling
literature of Gurvits and subsequent developments
{cite:p}`gurvits2003classical,gurvits2004classical,georgiou2015positive,garg2018recent`.
It replaces the true Gibbs coupling {eq}`eq-qot-gibbs-coupling` by the
symmetric factorization

```{math}
:label: eq-qot-symmetric-scaling
T_s(F,G)
=
\exp\!\left(\frac{Z}{2\epsilon}\right)
\exp(-C/\epsilon)
\exp\!\left(\frac{Z}{2\epsilon}\right)
=
(U\otimes V)K(U\otimes V),
\qquad
Z=F\otimes I_m+I_n\otimes G,
```

where $U=\exp(F/(2\epsilon))$, $V=\exp(G/(2\epsilon))$ and
$K=\exp(-C/\epsilon)$. If $[Z,C]=0$, then $T_s(F,G)=T_e(F,G)$; otherwise this
is a Strang-type symmetric surrogate.

Fix a Choi convention and let $\mathcal K:\mathbb H_m\to\mathbb H_n$ be the
completely positive map represented by the positive Choi matrix $K$; let
$\mathcal K^\star$ be its Hilbert--Schmidt adjoint. Up to the transpose
dictated by the chosen Choi convention, the marginal equations for the
symmetric coupling take the operator-scaling form

```{math}
U\,\mathcal K(V^2)\,U=A,
\qquad
V\,\mathcal K^\star(U^2)\,V=B,
```

and can be enforced by the congruence normalizations

```{math}
:label: eq-qot-gurvits-updates
\begin{aligned}
R_V&=\mathcal K(V^2),
&
U&\leftarrow
R_V^{-1/2}
\left(R_V^{1/2} A R_V^{1/2}\right)^{1/2}
R_V^{-1/2},
\\
S_U&=\mathcal K^\star(U^2),
&
V&\leftarrow
S_U^{-1/2}
\left(S_U^{1/2} B S_U^{1/2}\right)^{1/2}
S_U^{-1/2}.
\end{aligned}
```

These inverse square roots are well-defined when $K\succ0$ and
$U,V,A,B\succ0$. Under the standard strict-positivity and scalability
hypotheses, the alternating normalizations converge to the prescribed
marginals {cite:p}`georgiou2015positive,garg2018recent`. At finite tolerance
they return an approximate coupling. When all matrices are diagonal, the
updates reduce to classical Sinkhorn scaling; when the targets are
proportional to identities, they match the usual bistochastic
operator-scaling normalization up to trace convention.

:::{admonition} Remark: Gurvits scaling is not the exact Bregman scheme
:class: ot4ml-remark

It is important not to identify {eq}`eq-qot-gurvits-updates` with the exact Bregman scheme for {eq}`eq-qot-entropic-primal`. The exact Bregman step would enforce the marginals of $T_e(F,G)=\exp((Z-C)/\epsilon)$ and would be a block maximization of the true concave dual {eq}`eq-qot-entropic-dual`. Gurvits scaling instead enforces the marginals of the surrogate

```{math}
T_s=
\exp\!\left(\frac{Z}{2\epsilon}\right)
\exp(-C/\epsilon)
\exp\!\left(\frac{Z}{2\epsilon}\right).
```

The two coincide in the commuting/diagonal regime, but in general the Baker--Campbell--Hausdorff commutator terms do not vanish. The Gurvits iteration should therefore be understood as a tractable symmetric operator-scaling approximation to entropic Q--OT, not as the literal alternating KL projection algorithm.
:::


:::{admonition} Remark: Operator-valued couplings
:class: ot4ml-remark

The same definitions extend formally from matrices to separable Hilbert spaces by replacing density matrices with positive trace-class operators of trace one, observables with bounded self-adjoint operators and {eq}`eq-qot-partial-traces` with partial traces defined by duality against local bounded observables. If $\Pi(A,B)$ denotes positive trace-class operators with partial traces $A$ and $B$, a bounded cost observable $C$ gives the problem $\inf_{T\in\Pi(A,B)}\Tr(CT)$. For unbounded positive costs one must define the energy through the quadratic form or spectral truncations, and in the entropic case one must ensure that the Gibbs operator $\exp(-C/\epsilon)$ is trace class and that the partial traces of the candidate coupling are well-defined. The matrix formulas above are therefore the clean finite-dimensional core; the operator version adds domain and compactness assumptions rather than a different algebraic structure.
:::

(alg-quantum-exact-bregman)=
:::{admonition} Algorithm: Exact quantum Bregman projections
:class: ot4ml-algorithm

**Input:** Positive definite density matrices $A,B$, cost $C$, regularization $\epsilon>0$, tolerance $\mathrm{tol}$, maximum iterations $L$.

**Output:** Approximate quantum entropic coupling $T$ and its partial-trace residual.

**Initialize:** Set Hermitian potentials $F^{(0)}=0$ and $G^{(0)}=0$.

**For** $k=0,\ldots,L-1$ **do**:

> $T^{(k)}= T_e(F^{(k)},G^{(k)}) = \exp\!\left( \frac{F^{(k)}\otimes\Id_m+\Id_n\otimes G^{(k)}-C}{\epsilon} \right).$
>
> **Solve** $A$-projection equation:
> $\operatorname{Tr}_B T_e(F^+,G^{(k)})=A,$
>
> **Set** $F^{(k+1)}=F^+$.
>
> **Solve** $B$-projection equation:
> $\operatorname{Tr}_A T_e(F^{(k+1)},G^+)=B,$
>
> **Set** $G^{(k+1)}=G^+$.
>
> **If** both partial-trace residuals are at most $\mathrm{tol}$ **then**:

>> **Return** $T_e(F^{(k+1)},G^{(k+1)})$.

**Return** $T_e(F^{(L)},G^{(L)})$ and its residual.
:::

(alg-quantum-gurvits-scaling)=
:::{admonition} Algorithm: Gurvits/operator scaling for quantum Sinkhorn
:class: ot4ml-algorithm

**Input:** Positive definite marginals $A,B$, positive definite kernel operator $K$, maps $\mathcal K,\mathcal K^\star$, tolerance $\mathrm{tol}$, maximum iterations $L$.

**Output:** Symmetrically scaled coupling $T_s$ with approximate prescribed marginals.

**Initialize:** Set $U=\Id_n$ and $V=\Id_m$.

**Set** residual $r=+\infty$ and counter $k=0$.

**While** $r>\mathrm{tol}$ and $k<L$ **do**:

> $R_V=\mathcal K(V^2), \qquad U\leftarrow R_V^{-1/2}\bigl(R_V^{1/2} A R_V^{1/2}\bigr)^{1/2}R_V^{-1/2}.$
>
> $S_U=\mathcal K^\star(U^2), \qquad V\leftarrow S_U^{-1/2}\bigl(S_U^{1/2} B S_U^{1/2}\bigr)^{1/2}S_U^{-1/2}.$
>
> **Set** $T_s=(U\otimes V)K(U\otimes V)$ and $r$ to the maximum of its two operator-marginal residuals against $A$ and $B$.
>
> **Set** $k\leftarrow k+1$.

**Return** $T_s$.
:::

Vector, metric-measure and quantum transport extend the same coupling
principle in three different directions: richer fibers, unknown cross-space
correspondences and non-commutative joint states. Their feasible sets and
algorithms differ, but marginal constraints, convex duality and entropy
regularization remain the common organizing mechanisms.
