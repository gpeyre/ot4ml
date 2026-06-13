---
title: Semi-discrete and Wasserstein-1
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-semidiscr-w1)=

This chapter focuses on two computationally useful degeneracies of the dual
problem. Semi-discrete optimal transport turns a continuous-to-discrete map
into finite-dimensional geometry, while $\Wass_1$ replaces convex potentials by
Lipschitz functions and flow fields. The material connects computational
geometry {cite:p}`AurenhammerHA98,Merigot11,merigot2013comparison` with the
Kantorovich--Rubinstein and Beckmann formulations
{cite:p}`kantorovich1958space,Beckmann52`.

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

## Semi-dual

The semi-dual eliminates one potential by an exact $c$-transform. It keeps
concavity while removing explicit inequality constraints.

Write the dual problem as

```{math}
\sup_{f,g\in\Cc(\X)\times\Cc(\Y)} \mathcal{E}(f,g),
```

where $\mathcal{E}(f,g)$ is the dual objective, with value $-\infty$ when the
feasibility constraint fails. Optimizing out $g$ exactly gives the semi-dual
problem

```{math}
:label: eq-semi-dual-web
\sup_{f\in\Cc(\X)} \widetilde{\mathcal{E}}(f)
\eqdef
\mathcal{E}(f,f^c)
=
\sup_g \mathcal{E}(f,g)
=
\int_\X f\,\d\alpha
+
\int_\Y f^c\,\d\beta .
```

Partial maximization of a concave problem preserves concavity, so
$\widetilde{\mathcal{E}}$ is still concave. The advantage is that the explicit
inequality constraint has disappeared, which allows simpler optimization
algorithms.

## Semi-discrete

The semi-discrete case is the setting where dual potentials become weights of
Laguerre cells. This gives both geometry and algorithms for quantization and
density fitting.

### Discrete Targets and Laguerre Cells

Consider the case where

```{math}
\beta=\sum_{j=1}^m b_j\delta_{y_j}
```

is discrete. The same construction applies if $\alpha$ is discrete, after
exchanging the roles of $\alpha$ and $\beta$. For a dual vector
$g\in\RR^m$, the discrete $\bar c$-transform is

```{math}
:label: eq-disc-c-transform-web
g^{\bar c}(x)
\eqdef
\min_{1\le j\le m} c(x,y_j)-g_j.
```

This maps a vector $g$ to a continuous function under the same regularity
assumptions on $c$ as in the continuous setting. It coincides with the usual
$c$-transform when the target space is restricted to the support of
$\beta$. Using this transform when $\beta$ is discrete yields the
finite-dimensional semi-dual

```{math}
:label: eq-semi-dual-discrete-web
\mathcal{L}_c(\alpha,\beta)
=
\max_{g\in\RR^m}
\mathcal{E}(g)
\eqdef
\int_\X g^{\bar c}(x)\,\d\alpha(x)
+
\sum_{j=1}^m g_j b_j .
```

The geometric object encoded by the dual weights is a weighted
nearest-neighbor diagram: each source point is assigned to the target atom that
realizes the discrete $\bar c$-transform.

(def-laguerre-power-cells)=
:::{admonition} Definition: Laguerre Cells and Power Diagrams
:class: important
For sites $(y_j)_{j=1}^m$ and weights $g\in\RR^m$, the Laguerre cell
associated with $y_j$ is

```{math}
:label: eq-laguerre-cells-web
\mathcal{L}_j(g)
\eqdef
\left\{
x\in\X
:
c(x,y_j)-g_j
\le
c(x,y_{j'})-g_{j'}
\quad\text{for all }j'\ne j
\right\}.
```

The cells cover $\X$; after arbitrary tie-breaking on common boundaries, they
induce a disjoint partition. When $c(x,y)=\norm{x-y}^2$, this decomposition is
also called a power diagram. If $g$ is constant, it reduces to the ordinary
Voronoi diagram.
:::

For quadratic costs, varying the dual weights moves the walls between adjacent
cells while keeping them parallel. This is the geometric mechanism by which
the cell masses are adjusted.

(fig:semidiscrete-laguerre-cells)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("semidiscrete-laguerre-cells")
```

*Laguerre cells for semi-discrete quadratic transport. The red contours show a
continuous source density $\alpha$ given by a three-component Gaussian mixture
on the right. The twenty-one colored circular sites are the atoms of the
discrete target $\beta$, sampled from a compact cloud on the left; each site
color matches its Laguerre cell. Starting from ordinary Voronoi cells,
semi-dual weight updates deform the cells so that the $\alpha$-mass captured
by each cell approaches the prescribed target mass.*
:::

The interactive demo exposes the dual-weight mechanism directly. Increase the number
of weight updates to watch cells with too little mass expand and cells with too
much mass shrink.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the weight and seed controls to deform Laguerre cells and watch how their areas respond to semi-discrete masses.
:::

<iframe class="ot4ml-live-frame" title="Semi-discrete Laguerre controls" src="../live/semidiscrete-laguerre.html" loading="lazy" style="width:100%;height:510px;border:0;display:block;"></iframe>

### Mass Balance

The semi-dual energy can be rewritten as

```{math}
:label: eq-semi-disc-energy-web
\mathcal{E}(g)
=
\sum_{j=1}^m
\int_{\mathcal{L}_j(g)}
\left(c(x,y_j)-g_j\right)\,\d\alpha(x)
+
\langle g,b\rangle .
```

:::{admonition} Proposition: Gradient of the Semi-discrete Dual
:class: important
If $\alpha$ gives zero mass to the Laguerre cell boundaries, then
$\mathcal{E}$ is differentiable at $g$ and

```{math}
\frac{\partial \mathcal{E}}{\partial g_j}(g)
=
b_j-\int_{\mathcal{L}_j(g)}\d\alpha .
```
:::

:::{dropdown} Proof
For $\alpha$-almost every $x$, the minimizing index in
$\min_j c(x,y_j)-g_j$ is unique. If this index is $j(x)$, then the directional
derivative in direction $h\in\RR^m$ is

```{math}
\left.\frac{\d}{\d t}\right|_{t=0}
\min_j\left(c(x,y_j)-g_j-t h_j\right)
=
-h_{j(x)}.
```

Dominated convergence gives

```{math}
\d\mathcal{E}(g)[h]
=
-\sum_j h_j\int_{\mathcal{L}_j(g)}\d\alpha
+
\sum_j h_j b_j,
```

which is the announced gradient formula.
:::

The first-order optimality condition says that solving the semi-discrete dual
amounts to choosing weights $g$ so that

```{math}
\int_{\mathcal{L}_j(g)}\d\alpha=b_j
\qquad\text{for every }j.
```

At optimality, the transport map is piecewise constant: it sends
$x\in\mathcal{L}_j(g)$ to $y_j$. For the quadratic cost, uniqueness follows
from Brenier's theorem when $\alpha$ has a density.

Quadratic power diagrams have polyhedral cells and can be computed efficiently
using computational-geometry algorithms {cite:p}`aurenhammer1987power,AurenhammerHA98,Merigot11`.
One classical construction lifts sites to
$(y_j,\norm{y_j}^2-g_j)\in\RR^{d+1}$ and obtains the power diagram by
projecting the lower envelope of their convex hull. In dimensions two and
three, Chan's output-sensitive convex-hull algorithm has complexity
$O(m\log Q)$ for $m$ sites and $Q$ hull vertices {cite:p}`chan1996optimal`.

### Stochastic Optimization

The semi-discrete formulation is useful because the objective is an
expectation with respect to $\alpha$:

```{math}
:label: eq-semi-disc-energy-expectation-web
\mathcal{E}(g)
=
\int_\X E(g,x)\,\d\alpha(x)
=
\EE_X(E(g,X)),
\qquad
E(g,x)\eqdef g^{\bar c}(x)+\langle g,b\rangle .
```

Away from cell boundaries, the stochastic gradient of the integrand is

```{math}
\nabla_g E(g,x)
=
\left(b_j-\mathbf{1}_{\mathcal{L}_j(g)}(x)\right)_{j=1}^m,
```

an unbiased estimator of $\nabla\mathcal{E}(g)$ when cell boundaries have
$\alpha$-measure zero. One can therefore maximize the semi-dual without first
discretizing $\alpha$: the measure is used as a black box from which
independent samples are drawn, a natural setup in high-dimensional statistics
and machine learning.

Starting from $g^{(0)}=0$, stochastic gradient ascent draws
$x_\ell\sim\alpha$ and performs

```{math}
:label: eq-sgd-semidiscrete-web
g^{(\ell+1)}
\eqdef
g^{(\ell)}
+
\tau_\ell\nabla_g E(g^{(\ell)},x_\ell).
```

The step size must decay so that sampling noise averages out. A typical
schedule is

```{math}
\tau_\ell\eqdef\frac{\tau_0}{1+\ell/\ell_0}.
```

Under standard stochastic-approximation assumptions,

```{math}
\mathcal{E}(g^\star)
-
\EE\left(\mathcal{E}(g^{(\ell)})\right)
=
O(\ell^{-1/2}),
```

where $g^\star$ is a maximizer and the expectation is over the i.i.d. samples.
This stochastic viewpoint is one of the main algorithmic advantages of the
semi-discrete formulation {cite:p}`Merigot11,genevay2016stochastic`.

(alg:semidiscrete-laguerre-descent)=
:::{admonition} Algorithm: Semi-discrete Laguerre descent
:class: ot4ml-algorithm

**Input:** Source measure $\alpha$, target atoms $(y_j,\b_j)$, cost $c$, steps $\tau_k$.

**Output:** Semi-discrete dual weights $\gD$ and Laguerre cells.

**Initialize:** Set $\gD^{(0)}=0$.

**For** $k=0,1,\ldots$ **do**:

>
> **Compute cells:**
> \(\Laguerre_j(\gD^{(k)}) = \enscond{x}{c(x,y_j)-\gD^{(k)}_j\leq c(x,y_\ell)-\gD^{(k)}_\ell\quad\forall \ell}.\)
>
> **Compute masses:**
> \(m_j^{(k)}=\int_{\Laguerre_j(\gD^{(k)})}\d\al .\)
>
> **Update**
> \(\gD^{(k+1)} = \gD^{(k)}+\tau_k\bigl(\b-m^{(k)}\bigr).\)
>
> **If** $\max_j\abs{m_j^{(k)}-\b_j}\leq\mathrm{tol}$ **then**:

>>
>> **Return** $\gD^{(k+1)}$ and the cells.
>>
:::

(alg:semidiscrete-stochastic-ascent)=
:::{admonition} Algorithm: Stochastic semi-discrete ascent
:class: ot4ml-algorithm

**Input:** Source sampler $x\sim\alpha$, target atoms $(y_j,\b_j)$, steps $\tau_\ell$.

**Output:** Stochastic semi-discrete dual weights $\gD$.

**Initialize:** Set $\gD^{(0)}=0$.

**For** $\ell=0,1,\ldots$ **do**:

>
> **Draw** $x_\ell\sim\alpha$.
>
> **Set** \(j_\ell=\min\argmin_j\bigl(c(x_\ell,y_j)-\gD_j^{(\ell)}\bigr)\).
>
> **For** $j=1,\ldots,m$ **do**

>> \(\gD_j^{(\ell+1)} = \gD_j^{(\ell)} + \tau_\ell\bigl(\b_j-\ones_{\{j=j_\ell\}}\bigr).\)

**Return** $\gD^{(\ell)}$ or its running average.
:::


(sec-optimal-quantization)=
## Optimal Quantization

Optimal quantization asks for the best discrete approximation of a measure by
$m$ codepoints. It is the geometric core of vector quantization, compression
and $k$-means clustering.

For a measure $\alpha$, define

```{math}
:label: eq-optimal-quantization-web
\mathcal{Q}_m(\alpha)
\eqdef
\min_{Y=(y_j)_{j=1}^m,\;b\in\simplex_m}
\Wass_p\left(\alpha,\sum_{j=1}^m b_j\delta_{y_j}\right).
```

This problem is classical in approximation theory and information theory
{cite:p}`graf2000foundationsquantization,Lloyd82`. The optimal-transport
formulation emphasizes that one optimizes both the support locations $Y$ and,
unless prescribed, the masses $b$.

(prop-quantization-rate)=
:::{admonition} Proposition: Quantization Rate and Curse of Dimensionality
:class: important
Let $\Omega\subset\RR^d$ be a bounded Lipschitz domain and assume
$\alpha=\rho\,\d x$ on $\Omega$, with
$0<\rho_-\le\rho\le\rho_+<+\infty$. Then, for fixed $p\ge1$, there exist
constants $0<c\le C<+\infty$ such that

```{math}
c\,m^{-1/d}
\le
\mathcal{Q}_m(\alpha)
\le
C\,m^{-1/d}.
```
:::

:::{dropdown} Proof
For the upper bound, partition $\Omega$ into $m$ cells of diameter at most
$C m^{-1/d}$, up to boundary effects, and place one codepoint in each nonempty
cell. Sending each point to the codepoint in its cell gives a transport
distance bounded by $C m^{-1/d}$.

For the lower bound, fix any set $Y$ of $m$ codepoints and write
$d_Y(x)=\min_j\norm{x-y_j}$. Since the density is bounded above, the mass of
the $t$-neighborhood of $Y$ is at most $Cmt^d$. Choosing
$t_0\simeq m^{-1/d}$ small enough gives
$\alpha(\{d_Y>t\})\ge c$ for $0<t<t_0$. Hence

```{math}
\int d_Y(x)^p\,\d\alpha(x)
=
\int_0^{+\infty}
p t^{p-1}\alpha(\{d_Y>t\})\,\d t
\ge
c t_0^p
\simeq
c m^{-p/d}.
```

Taking the $p$-th root and minimizing over $Y$ proves the lower bound.
:::

This deterministic rate mirrors the empirical optimal-transport
sample-complexity rate: both are governed by the spacing $m^{-1/d}$ of points
in dimension $d$. Quantization is best-case and deterministic, while empirical
OT is random, but both display the same curse of dimensionality.

For fixed codepoints $Y$, the problem is convex with respect to the weights
$b$. The dependence on $Y$ is nonconvex and is generally computationally hard.
In one dimension, monotonicity fixes the ordering of cells, reducing the
problem to interval endpoints and centroids; for the uniform law with the
quadratic cost, the optimal centroids are equally spaced.

(prop-free-masses-voronoi)=
:::{admonition} Proposition: Free Masses Give Voronoi Cells
:class: important
For the cost $c(x,y)=d(x,y)^p$, fix distinct codepoints
$Y=(y_j)_{j=1}^m$. Duplicate codepoints can be merged beforehand. Minimizing
over the weights $b\in\simplex_m$ gives

```{math}
\min_{b\in\simplex_m}
\Wass_p^p
\left(\alpha,\sum_j b_j\delta_{y_j}\right)
=
\int_\X \min_{1\le j\le m} c(x,y_j)\,\d\alpha(x).
```

An optimal coupling is induced by sending each $x$ to a nearest codepoint. The
corresponding cells are the Voronoi cells

```{math}
\mathcal{V}_j(Y)
\eqdef
\left\{
x
:
c(x,y_j)\le c(x,y_{j'})
\quad\text{for all }j'
\right\},
```

up to arbitrary tie-breaking on common boundaries.
:::

:::{dropdown} Proof
For any coupling between $\alpha$ and a measure supported on $Y$, the
conditional destination of a point $x$ belongs to $Y$, so its conditional cost
is at least $\min_j c(x,y_j)$. Integrating gives the lower bound. Conversely,
choose a measurable nearest-codepoint map
$T_Y(x)\in\operatorname*{arg\,min}_j c(x,y_j)$, breaking ties measurably, and
set $b_j=\alpha(T_Y^{-1}(y_j))$. Then
$(T_Y)_\sharp\alpha=\sum_j b_j\delta_{y_j}$ and the induced transport reaches
the displayed lower bound.
:::

Consequently, the quantization energy can be written in nearest-centroid form:

```{math}
\mathcal{Q}_m(\alpha)^p
=
\min_Y \mathcal{F}(Y),
\qquad
\mathcal{F}(Y)
\eqdef
\int_\X \min_{1\le j\le m} c(x,y_j)\,\d\alpha(x).
```

At a differentiability point of this energy, each local minimizer satisfies the
centroid condition

```{math}
y_j
\in
\operatorname*{arg\,min}_{y}
\int_{\mathcal{V}_j(Y)} c(x,y)\,\d\alpha(x).
```

For the squared Euclidean cost, this becomes

```{math}
y_j
=
\frac{\int_{\mathcal{V}_j(Y)} x\,\d\alpha(x)}
{\int_{\mathcal{V}_j(Y)} \d\alpha}.
```

Lloyd's algorithm, also known as the $k$-means algorithm, iterates this fixed
point: assign points to nearest sites, then replace each site by the centroid
of its cell {cite:p}`Lloyd82`. With standard tie-breaking, the objective
decreases at each step. Since the problem is nonconvex in $Y$, the iterates
generally converge only to a local minimum. Good seeding matters; for squared
Euclidean costs, $k$-means++ gives a logarithmic approximation guarantee in
expectation {cite:p}`ArthurVassilvitskii2007`.

(fig:semidiscrete-lloyd-quantization)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("semidiscrete-lloyd-quantization")
```

*Lloyd quantization for the same continuous density and twenty-one initial
sites as the Laguerre-cell figure. The red contours show the density
$\alpha$, while the colored disks are the current codepoints and have the same
colors as their Voronoi cells. The iterations move the initially left-located
sites toward the high-density region and reshape the cells according to
centroidal Voronoi geometry.*
:::

The interactive demo separates the nonconvex geometry from the fixed-point update:
increase the iteration counter and watch sites migrate toward the density
before settling into a local centroidal configuration.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the iteration and site controls to compare Lloyd-style quantization steps with the semi-discrete geometry.
:::

<iframe class="ot4ml-live-frame" title="Lloyd quantization controls" src="../live/semidiscrete-lloyd.html" loading="lazy" style="width:100%;height:510px;border:0;display:block;"></iframe>

(alg:lloyd-quantization)=
:::{admonition} Algorithm: Lloyd quantization
:class: ot4ml-algorithm

**Input:** Source measure $\alpha$, initial codepoints $Y^{(0)}=(y_j^{(0)})_{j=1}^m$, squared Euclidean cost.

**Output:** Codepoints $Y=(y_j)_{j=1}^m$.

**Initialize:** Set $k=0$.

**For** $k=0,1,\ldots$ **do**:

>
> **Compute Voronoi cells:**
> \(\VV_j(Y^{(k)}) = \enscond{x}{c(x,y_j^{(k)})\leq c(x,y_\ell^{(k)})\quad\forall \ell}.\)
>
> **For** each nonempty cell $\VV_j$ **do**

>> \(y_j^{(k+1)} = \frac{\int_{\VV_j(Y^{(k)})}x\,\d\al(x)} {\int_{\VV_j(Y^{(k)})}\d\al(x)}.\)

> **For** each empty cell $\VV_j$ **do**:

>>
>> **Set** $y_j^{(k+1)}=y_j^{(k)}$.
>>

> **If** codepoint displacement is below $\mathrm{tol}$ **then**:

>>
>> **Return** $Y^{(k+1)}$.
>>
:::

(rem-graph-w1-network-simplex)=
:::{admonition} Remark: Sparse LP and network simplex
:class: ot4ml-remark

Let $N=|V|$ and $M=|E|$. The graph Beckmann problem is a linear program, but it is much smaller than the dense Kantorovich LP on the same vertex set. Indeed, writing $m=m^+-m^-$ gives

```{math}
\min_{m^+,m^-\geq0}\sum_{e\in E}\ell_e(m^+_e+m^-_e)
\quad\text{subject to}\quad
\operatorname{div}_G(m^+-m^-)=r .
```

This formulation has $2M$ nonnegative variables and $N-1$ independent balance constraints, whereas the standard transport LP between two measures on $V$ has $N^2$ coupling variables and $2N-1$ independent marginal constraints. For sparse geometric graphs, such as planar Delaunay graphs where typically $M=O(N)$, the graph formulation is therefore linear-size rather than quadratic-size.

The same LP is a minimum-cost transshipment problem. Replace each undirected edge $\{i,j\}$ by the two directed arcs $i\to j$ and $j\to i$, both with cost $\ell_e$, and impose the node balances $\sum_{j}u_{ij}-\sum_j u_{ji}=r_i$. This is exactly the setting of the network simplex method: a basis is a spanning tree, a pivot adds one non-tree arc, creates a unique cycle, sends flow along this cycle, and updates the node potentials and reduced costs {cite:p}`bertsekas1988dual,Orlin1997`. A basic implementation needs $O(M)$ work to price all arcs and $O(N)$ work to update the tree at each pivot, hence $O(PM)$ arithmetic operations for $P$ pivots on a sparse graph. The pivot count $P$ depends on the rule and can be large in worst-case simplex analyses, but network-simplex variants and general minimum-cost-flow algorithms give polynomial guarantees in $N$ and $M$; in practice, this edge-based formulation is often far cheaper than solving the dense $N^2$-variable transport LP.
:::

(alg:graph-beckmann-network-simplex)=
:::{admonition} Algorithm: Graph Beckmann network-simplex pivot
:class: ot4ml-algorithm

**Input:** Graph $G=(V,E)$, edge lengths $\ell_e$, node balances $r_i$ with $\sum_ir_i=0$.

**Output:** Minimum-cost graph flow $u$.

**Replace** each undirected edge by two directed arcs.

**Impose balances:**
\(\sum_j u_{ij}-\sum_j u_{ji}=r_i .\)

**Initialize:** Add artificial root arcs and compute a feasible tree flow on a spanning tree $T$ with node potentials.

**While** \(\min_{e\notin T}\bar c_e<0\) **do**:

>
> **Set** entering arc \(e=\min\argmin_{a\notin T}\bar c_a\) for a fixed ordering of arcs.
>
> **Add** it to the tree.
>
> **Set** $\mathcal C=$ unique induced cycle.
>
> **Send** the largest admissible flow around $\mathcal C$.
>
> **Remove** the first zero-flow arc met on the directed cycle after augmentation.
>
> **Update** the tree, potentials, and reduced costs.
>

**Return** $u$.
:::


(sec-W1)=
## Wasserstein-1 Norm

The $\Wass_1$ distance has an especially transparent dual: the admissible
potentials are exactly $1$-Lipschitz test functions. This makes $\Wass_1$ the
meeting point between transport, PDE formulations and weak norms on signed
measures.

### c-Transform for Wasserstein-1

Assume that $d$ is a distance on $\X=\Y$ and take the ground cost
$c(x,y)=d(x,y)$. The Lipschitz constant of $f\in\Cc(\X)$ is

```{math}
:label: eq-lip-constant-web
\Lip(f)
\eqdef
\sup_{x\ne y}
\frac{|f(x)-f(y)|}{d(x,y)}.
```

(prop-w1-c-transform-lipschitz)=
:::{admonition} Proposition: $c$-Transforms and $1$-Lipschitz Functions
:class: important
Suppose $\X=\Y$ and $c(x,y)=d(x,y)$. Then there exists $g$ such that
$f=g^c$ if and only if $\Lip(f)\le1$. Furthermore, if $\Lip(f)\le1$, then
$f^c=-f$.
:::

:::{dropdown} Proof
First suppose $f=g^c$ for some $g$. For $x,y\in\X$,

```{math}
|f(x)-f(y)|
=
\left|
\inf_z [d(x,z)-g(z)]
-
\inf_z [d(y,z)-g(z)]
\right|
\le
\sup_z |d(x,z)-d(y,z)|
\le
d(x,y),
```

where the last inequality is the reverse triangle inequality. Thus
$\Lip(f)\le1$.

If $\Lip(f)\le1$, then $f(x)\le f(y)+d(x,y)$, so
$d(x,y)-f(x)\ge -f(y)$ for all $x$, hence $f^c(y)\ge -f(y)$. Taking $x=y$
gives $f^c(y)\le -f(y)$. Therefore $f^c=-f$. Applying the same property to
$-f$ gives $(-f)^c=f$, so every $1$-Lipschitz function is $c$-concave.
:::

Using the alternating $c$-transform scheme from the dual chapter, one can
replace the dual pair by $(f,-f)$ with $\Lip(f)\le1$. The Kantorovich dual
therefore becomes the Kantorovich--Rubinstein formula

```{math}
:label: eq-w1-metric-web
\Wass_1(\alpha,\beta)
=
\max_f
\left\{
\int_\X f\,\d(\alpha-\beta)
:
\Lip(f)\le1
\right\}.
```

This expression depends only on the signed measure $\alpha-\beta$. It
therefore extends to finite signed measures of total mass zero and defines the
Kantorovich--Rubinstein norm on that space {cite:p}`kantorovich1958space`.

For a discrete signed measure
$\alpha-\beta=\sum_k r_k\delta_{z_k}$ with $\sum_k r_k=0$,

```{math}
:label: eq-w1-discrete-web
\Wass_1(\alpha,\beta)
=
\max_{(f_k)_k}
\left\{
\sum_k f_k r_k
:
|f_k-f_\ell|\le d(z_k,z_\ell)
\quad\text{for all }k,\ell
\right\}.
```

This finite-dimensional linear program can be solved by generic interior-point
or first-order methods; structured graph versions admit the flow formulations
described below.

When $d(x,y)=|x-y|$ on $\RR$, ordering the support points
$z_1\le z_2\le\cdots$ reduces the constraints to neighboring pairs:

```{math}
\Wass_1(\alpha,\beta)
=
\max_{(f_k)_k}
\left\{
\sum_k f_k r_k
:
|f_{k+1}-f_k|\le z_{k+1}-z_k
\quad\text{for all }k
\right\}.
```

In one dimension this is equivalent to the closed-form cumulative formula
introduced earlier.

### Wasserstein-1 on Euclidean Spaces

For $\X=\Y=\RR^d$ with $c(x,y)=\norm{x-y}$, the global Lipschitz constraint in
the Kantorovich--Rubinstein formula can be made local as a uniform bound on
the gradient:

```{math}
:label: eq-w1-cont-web
\Wass_1(\alpha,\beta)
=
\sup_f
\left\{
\int_{\RR^d} f\,(\d\alpha-\d\beta)
:
\norm{\nabla f}_\infty\le1
\right\}.
```

Dualizing this expression with respect to vector fields $m:\RR^d\to\RR^d$
gives the fixed-divergence problem

```{math}
:label: eq-w1-cont-div-web
\Wass_1(\alpha,\beta)
=
\inf_m
\left\{
\int_{\RR^d}\norm{m(x)}\,\d x
:
\operatorname{div}(m)=\alpha-\beta
\right\},
```

often called the Beckmann formulation {cite:p}`Beckmann52`. The vector field
$m(x)$ describes local movement of mass. Outside the support of the two input
measures, $\operatorname{div}(m)=0$, which is conservation of mass.

Once discretized with finite elements, the dual Lipschitz problem and the
Beckmann problem become nonsmooth convex optimization problems. The same
formulation extends to Riemannian manifolds by replacing the Euclidean
distance by geodesic distance and interpreting gradient and divergence as
differential operators on the manifold.

(def-graph-geodesic-distance)=
:::{admonition} Definition: Graph Geodesic Distance
:class: important
Let $G=(V,E)$ be a connected finite graph with positive edge lengths
$(\ell_e)_{e\in E}$. The graph geodesic distance between two vertices is

```{math}
d_G(i,j)
=
\min_{\gamma:i\leadsto j}
\sum_{e\in\gamma}\ell_e .
```

The minimum is over all paths $\gamma$ joining $i$ to $j$.
:::

This graph distance turns $\Wass_1$ into a finite-dimensional flow problem.

(prop-graph-w1-beckmann)=
:::{admonition} Proposition: $\Wass_1$ and Beckmann Flow on a Graph
:class: important
Let $G=(V,E)$ be a connected finite graph with positive edge lengths
$(\ell_e)_{e\in E}$ and graph geodesic distance $d_G$. For probability
vectors $a,b$ on $V$, set $r=a-b$ and orient each edge $e=(i,j)$. If

```{math}
(\nabla_G f)_e=f_j-f_i,
\qquad
\operatorname{div}_G=-\nabla_G^*
```

are the finite-difference gradient and negative adjoint, then

```{math}
\Wass_{1,G}(a,b)
=
\max_f
\left\{
\sum_{i\in V} f_i r_i
:
|f_i-f_j|\le\ell_e
\quad\forall e=(i,j)
\right\}
=
\min_m
\left\{
\sum_{e\in E}\ell_e |m_e|
:
\operatorname{div}_G m=r
\right\}.
```

The vector $m_e$ is an oriented edge flow, and the constraint
$\operatorname{div}_G m=r$ is conservation of mass at each vertex.
:::

:::{dropdown} Proof
The edge constraint $|f_i-f_j|\le\ell_e$ implies, by summing along paths, that
$|f_i-f_j|\le d_G(i,j)$ for all vertices. Conversely, any $1$-Lipschitz
function for $d_G$ satisfies the edge constraints because each edge is a path
of length $\ell_e$. The first equality is therefore the
Kantorovich--Rubinstein formula on the metric space $(V,d_G)$.

For the second equality, write the graph Beckmann problem and dualize its
equality constraint with a potential $f$:

```{math}
\inf_m \sum_e \ell_e|m_e|
+
\sup_f
\sum_i f_i
\left(r_i-(\operatorname{div}_G m)_i\right).
```

Using $\operatorname{div}_G=-\nabla_G^*$, the coupling term is
$\sum_e m_e(\nabla_G f)_e$. The minimization over each scalar flow $m_e$ is
finite exactly when $|(\nabla_G f)_e|\le\ell_e$, and is then equal to zero.
The dual problem is the graph Lipschitz dual above. Strong duality holds
because this is a finite-dimensional linear program with a nonempty feasible
set: connectedness and $\sum_i r_i=0$ allow the signed surplus to be routed
along paths.
:::

(fig:w1-graph-transport-flow)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("w1-graph-transport-flow")
```

*Graph Beckmann formulation of $\Wass_1$ on a Delaunay graph. Red and blue
disks encode the positive and negative parts of $r=\alpha-\beta$. Violet
arrows display the signed edge flow $m$: orientation gives the sign, width is
proportional to $\sqrt{|m_e|}$, and the flow satisfies the conservation
constraint $\operatorname{div}_G m=r$.*
:::

The interactive graph view lets the source and sink clusters move and changes the
graph resolution. It makes the transshipment interpretation of $\Wass_1$
visible: signed mass is routed through local edges rather than matched only by
straight source-to-target segments.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the graph and demand controls to inspect how Wasserstein-1 transport becomes a flow problem on edges.
:::

<iframe class="ot4ml-live-frame" title="Graph W1 flow controls" src="../live/w1-graph.html" loading="lazy" style="width:100%;height:510px;border:0;display:block;"></iframe>

This graph formulation is the transshipment version of $\Wass_1$. It is the
natural discrete analogue of the Beckmann formulation: gradients are edge
differences, divergences are incidence-matrix balances, and geodesic distance
is shortest-path length. It can be solved by min-cost flow methods on sparse
graphs, while entropic or KL-projection variants lead to flow-Sinkhorn
algorithms for graph $\Wass_1$ {cite:p}`Beckmann52,peyre2026robust`.
