---
title: Semi-discrete and Wasserstein-1
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-semidiscr-w1)=

This chapter develops three computational consequences of duality. Eliminating
one potential gives the semi-dual; for discrete measures, this viewpoint leads
to auction algorithms, while a continuous source and discrete target lead to
Laguerre-cell geometry. The final part specializes duality to $\Wass_1$, where
Lipschitz functions and flow fields replace convex potentials. The material
connects auction and network-flow methods
{cite:p}`bertsekas1992auction,bertsekas1988dual`, computational geometry
{cite:p}`AurenhammerHA98,Merigot11,merigot2013comparison`, and the
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

The semi-dual eliminates one potential by an exact $c$-transform. It preserves
concavity while removing the explicit pointwise inequality constraint.

### General Measure Semi-dual

For arbitrary measures, partial maximization converts the constrained
two-potential dual into an unconstrained optimization over one function.

Denote the extended full-dual objective by

```{math}
:label: eq-full-dual-functional-web
\mathcal E_0(f,g)
\eqdef
\begin{cases}
\displaystyle \int_\X f\,\d\alpha+\int_\Y g\,\d\beta,
& (f,g)\in\Potentials(c),\\
-\infty,&\text{otherwise}.
\end{cases}
```

Thus $\mathcal L_c(\alpha,\beta)=\max_{f,g}\mathcal E_0(f,g)$. For fixed $g$,
feasibility is equivalent to $f\leq g^{\bar c}$. Since $\alpha$ is nonnegative,
the largest admissible choice $f=g^{\bar c}$ maximizes the objective and gives

```{math}
:label: eq-semi-dual-web
\mathcal L_c(\alpha,\beta)
=
\sup_{g\in\Cc(\Y)}\mathcal E(g),
\qquad
\mathcal E(g)
\eqdef
\mathcal E_0(g^{\bar c},g)
=
\sup_{f\in\Cc(\X)}\mathcal E_0(f,g)
=
\int_\X g^{\bar c}\,\d\alpha+\int_\Y g\,\d\beta.
```

Partial maximization preserves concavity. Moreover,
$\mathcal E(g+s)=\mathcal E(g)$ because $(g+s)^{\bar c}=g^{\bar c}-s$ and
both measures have unit mass. Potentials are therefore
defined only up to an additive constant, while the optimization is
unconstrained.

### Discrete Semi-dual

For two discrete measures

```{math}
\alpha=\sum_{i=1}^n a_i\delta_{x_i},
\qquad
\beta=\sum_{j=1}^m b_j\delta_{y_j},
\qquad
\C_{ij}=c(x_i,y_j),
```

with common total mass $M$, use the same notation for vectors:

```{math}
\mathcal E_0(f,g)
\eqdef
\begin{cases}
\langle f,a\rangle+\langle g,b\rangle,&f\oplus g\leq\C,\\
-\infty,&\text{otherwise}.
\end{cases}
```

Eliminating the source vector gives

```{math}
:label: eq-discrete-semi-dual-web
\mathcal L_{\C}(a,b)
=
\max_{g\in\mathbb R^m}\mathcal E(g),
\qquad
\mathcal E(g)
=
\mathcal E_0(g^{\bar\C},g)
=
\sum_{i=1}^n a_i(g^{\bar\C})_i
+
\sum_{j=1}^m b_jg_j,
```

where

```{math}
(g^{\bar\C})_i=\min_{1\le j\le m}(\C_{ij}-g_j).
```

The function $\mathcal E$ is concave, piecewise affine, and invariant
under $g\mapsto g+s\mathbf 1$. If ties are resolved by choosing
$\sigma_g(i)\in\arg\min_j(\C_{ij}-g_j)$, then a supergradient is

```{math}
b-\widehat b(g),
\qquad
\widehat b_j(g)=\sum_{i:\,\sigma_g(i)=j}a_i.
```

It is therefore the mismatch between the desired target mass and the mass
currently attracted by each target coordinate. At ties, splitting source mass
among active targets describes the full superdifferential.

(sec-auction-dual-ascent)=
## Auction Algorithm

The auction algorithm is derived from coordinate maximization of the semi-dual
of the linear assignment problem. Its practical form uses bidder-specific
dual-weight updates that cross the selected row's next indifference threshold by
$\varepsilon$; this controlled relaxation prevents jamming at nonsmooth ties.
We follow the account of Mérigot and Thibert
{cite:p}`merigot2020optimaltransportalgorithms`, itself based on Bertsekas'
auction algorithm and its $\varepsilon$-scaling refinement
{cite:p}`bertsekas1981new,bertsekas1988dual,bertsekas1992auction`. In this
section, $\C\in\mathbb R^{n\times n}$ and $n\ge2$. A permutation matrix $P$
represents the probability coupling $P/n$.

### Coordinate Ascent and Discrete Laguerre Cells

Write $g_j$ for the target Kantorovich potential. Specializing the discrete
semi-dual to uniform weights gives

```{math}
:label: eq-auction-semidual-web
\mathcal E(g)
=
\frac1n\sum_{i=1}^n(g^{\bar\C})_i+\frac1n\sum_{j=1}^n g_j,
\qquad
(g^{\bar\C})_i=\min_{1\le j\le n}(\C_{ij}-g_j).
```

Thus $(g^{\bar\C},g)$ is dual feasible. This is the discrete $\bar C$-transform
of Remark {ref}`rem-discrete-c-transform`, with the same sign convention as in
the general and semi-discrete formulations.

The discrete Laguerre cells are

```{math}
:label: eq-auction-discrete-laguerre-web
\operatorname{Lag}^{\mathrm D}_j(g)
=
\left\{i:\ \C_{ij}-g_j\le \C_{ik}-g_k\ \text{for every }k\right\}.
```

They can overlap at ties. They are the finite counterparts of the general
semi-discrete Laguerre cells in Definition {ref}`def-laguerre-power-cells`:
the displayed cell is that definition restricted to row indices. If every row
has a unique minimizer, then

```{math}
\frac{\partial}{\partial g_j}\mathcal E(g)
=
\frac{1-|\operatorname{Lag}^{\mathrm D}_j(g)|}{n}.
```

An overfull cell therefore calls for a decrease of its dual weight. Proposition
{ref}`prop-assignment-dual-certificate` shows that a perfect matching in the
contact graph $i\in\operatorname{Lag}^{\mathrm D}_j(g)$ certifies optimality of
$g$; conversely, assignment duality and complementary slackness produce such a
matching at every maximizer.

For $i\in\operatorname{Lag}^{\mathrm D}_j(g)$, define

```{math}
:label: eq-auction-bid-web
\operatorname{bid}_j(g,i)
=
\min_{k\ne j}(\C_{ik}-g_k)-(\C_{ij}-g_j).
```

When the cell is nonempty, the largest maximizing decrement along the negative
$j$th coordinate is the largest such bid
{cite:p}`merigot2020optimaltransportalgorithms`. At a tie, even this largest
maximizing decrement can vanish, so naive coordinate ascent may jam before
reaching a dual maximizer.

### Bids and Relaxed Contacts

Auction avoids jamming by moving an unassigned row
$\varepsilon$ beyond its next indifference point. Let $j_0$ and $j_1$ be its
best and second-best targets:

```{math}
:label: eq-auction-reduced-costs-web
j_0\in\arg\min_j(\C_{ij}-g_j),
\qquad
j_1\in\arg\min_{j\ne j_0}(\C_{ij}-g_j).
```

The winning dual weight is updated by

```{math}
:label: eq-auction-dual-update-web
\Delta_i
=
\operatorname{bid}_{j_0}(g,i)+\varepsilon
=
(\C_{i,j_1}-g_{j_1})-(\C_{i,j_0}-g_{j_0})+\varepsilon,
\qquad
g_{j_0}\leftarrow g_{j_0}-\Delta_i.
```

Unlike exact coordinate maximization, this update uses the selected row's bid
rather than the maximum bid over the whole cell. Afterward, the reduced cost of
$j_0$ is exactly $\varepsilon$ above that of the unchanged alternative $j_1$.
The row nevertheless takes $j_0$; its former owner, if any, becomes unassigned.
Because of this overshoot, a bid need not increase the nonsmooth semi-dual.
Coordinate ascent motivates the update, but $\varepsilon$-complementary
slackness is the invariant used in the convergence proof.

(def-auction-eps-cs)=
:::{admonition} Definition: $\varepsilon$-Complementary Slackness
:class: important
A partial permutation matrix $P\in\{0,1\}^{n\times n}$ has at most one nonzero
entry in each row and column. Such a matrix and target potential $g$ satisfy
$\varepsilon$-complementary slackness if

```{math}
:label: eq-auction-epsilon-cs-web
P_{ij}=1
\quad\Longrightarrow\quad
\C_{ij}-g_j\le(g^{\bar\C})_i+\varepsilon.
```
:::

A bid gives the newly assigned row this property. Decreasing $g_{j_0}$ can only
make $j_0$ less attractive to rows assigned elsewhere, and the previous owner
of $j_0$ is removed. Every iteration therefore preserves the condition.

(alg-auction-bidding)=
:::{admonition} Algorithm: Bertsekas Auction
:class: ot4ml-algorithm

**Input:** Cost matrix $\C\in\mathbb R^{n\times n}$, tolerance
$\varepsilon>0$, initial target potential $g\in\mathbb R^n$ (default $g=0$).

**Output:** Permutation matrix $P$ and target potential $g$; the source
potential is $g^{\bar\C}$.

**Initialize:** Set $P=0$.

**While** some row $i$ satisfies $\sum_jP_{ij}=0$ **do**:

> **Choose** any such row $i$.
>
> **Set** $j_0\in\arg\min_j(\C_{ij}-g_j)$ and
> $j_1\in\arg\min_{j\ne j_0}(\C_{ij}-g_j)$.
>
> **Set**
> $\Delta\leftarrow(\C_{i,j_1}-g_{j_1})-(\C_{i,j_0}-g_{j_0})+\varepsilon$.
>
> **Set** $g_{j_0}\leftarrow g_{j_0}-\Delta$.
>
> **If** $P_{i_0,j_0}=1$ for some $i_0$ **then**, set $P_{i_0,j_0}\leftarrow0$.
>
> **Set** $P_{i,j_0}\leftarrow1$.

**Return** $P$ and $g$.
:::

Figure {ref}`fig:dual-auction-progression` shows actual iterates on the planar
point clouds used in {ref}`fig:matching-2d-cost-exponent`. For the current
target potential, define the auction reduced costs

$$
r_{ij}(g)=\C_{ij}-g_j-(g^{\bar\C})_i\geq 0.
$$

Exact zeros are the discrete Laguerre contacts of row $i$, whereas an owned
edge only needs to satisfy $r_{ij}(g)\leq\varepsilon$ by
$\varepsilon$-complementary slackness.

At an intermediate state, the current ownership matching is
$M=\{(i,j):P_{ij}=1\}$; the labels in the figure report its cardinality.

(fig:dual-auction-progression)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("dual-auction-progression", width=850)
```

*Geometric progression of the unit-mass transportation auction.* Thick violet
segments form the current partial ownership matching, while thin translucent
segments show the $2n$ unmatched edges with smallest auction reduced costs.
The labels report matching cardinality and cumulative bid count. With
$\varepsilon=0.002$, the final assignment is reached after $505$ bids and
coincides with the exact squared-distance optimum.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Vary the bid increment and inspect how assignments and
target dual weights evolve toward complementary slackness.
:::

<iframe class="ot4ml-live-frame" title="Auction dual-weight controls" src="../live/dual-auction.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

### Fixed Tolerance

For a prescribed tolerance, relaxed contact gives both an optimality
certificate and a finite bound on the number of bids.

(prop-auction-termination)=
:::{admonition} Proposition: Fixed-$\varepsilon$ Auction Convergence and Complexity
:class: important
Set
$R_{\C}=\max_{i,j}\C_{ij}-\min_{i,j}\C_{ij}$.
Started from $g=0$, Algorithm {ref}`alg-auction-bidding` terminates after at most

```{math}
n\left(\left\lfloor R_{\C}/\varepsilon\right\rfloor+1\right)
```

bids. It returns a permutation matrix satisfying $\varepsilon$-complementary
slackness and

```{math}
:label: eq-auction-cost-certificate-web
0
\le
\frac1n\langle\C,P\rangle
-
\min_{P'\in\mathcal P_n^{\mathrm{perm}}}\frac1n\langle\C,P'\rangle
\le
\varepsilon.
```

Dense scans require $O(n^2(1+R_{\C}/\varepsilon))$ operations and $O(n^2)$
storage. If $\C$ is integer-valued and $\varepsilon<1/n$, the assignment is
exactly optimal.
:::

:::{dropdown} Proof
Each bid decreases one target potential by at least $\varepsilon$. Once a target has an
owner, later bids may change that owner but never leave the target empty. While
the algorithm is incomplete, an unassigned target therefore retains its
initial zero potential. A selected target is either unassigned, hence has zero
potential, or has value at least $-R_{\C}$ by comparison with a zero-potential
target. Each target can consequently receive
at most $\lfloor R_{\C}/\varepsilon\rfloor+1$ bids. At termination every row and
column has one active entry.

For the cost certificate, summing $\varepsilon$-complementary slackness over
the returned permutation gives the first inequality below. The second is the
dual lower bound of Proposition {ref}`prop-assignment-dual-certificate`,
applied to $(g^{\bar\C},g)$:

```{math}
\frac1n\langle\C,P\rangle
\le
\frac1n\sum_i(g^{\bar\C})_i+\frac1n\sum_jg_j+\varepsilon
\le
\min_{P'}\frac1n\langle\C,P'\rangle+\varepsilon.
```

One dense bid scans $n$ reduced costs, proving the complexity bound. For integer
costs, the unnormalized assignment gap is an integer smaller than one and must
therefore vanish.
:::

### $\varepsilon$-Scaling

The cold-start estimate above exposes the limitation of a single tolerance. A
large $\varepsilon$ is fast but gives only a coarse certificate, whereas the
small $\varepsilon$ required for high accuracy can produce a bid count
proportional to $R_{\C}/\varepsilon$. Continuation first learns a rough
dual-potential landscape and then sharpens it instead of restarting from zero.

Algorithm {ref}`alg-auction-epsilon-scaling` starts at the cost scale
$\max\{R_{\C},\eta\}$ and halves the tolerance until it reaches the requested
value $\eta$. Each phase rebuilds the ownership matrix but retains the target
potential from the preceding phase. The previous complete assignment already
certifies approximate contact for this potential, so the next auction refines an existing
dual landscape.

(alg-auction-epsilon-scaling)=
:::{admonition} Algorithm: Auction With $\varepsilon$-Scaling
:class: ot4ml-algorithm

**Input:** Cost matrix $\C\in\mathbb R^{n\times n}$, final tolerance $\eta>0$.

**Output:** Permutation matrix $P$ and target potential $g$; the source
potential is $g^{\bar\C}$.

**Initialize:** Set
$R_{\C}\leftarrow\max_{i,j}\C_{ij}-\min_{i,j}\C_{ij}$ and $g\leftarrow0$.

**If** $R_{\C}=0$ **then**, return any permutation matrix and $g=0$.

**Set** $\varepsilon\leftarrow\max\{R_{\C},\eta\}$.

**While** $\varepsilon>\eta$ **do**:

> **Set** $(P,g)\leftarrow\operatorname{Auction}(\C,\varepsilon,g)$.
>
> **Set** $\varepsilon\leftarrow\max\{\varepsilon/2,\eta\}$.

**Set** $(P,g)\leftarrow\operatorname{Auction}(\C,\eta,g)$.

**Return** $P$ and $g$.
:::

(prop-auction-epsilon-scaling)=
:::{admonition} Proposition: Complexity of $\varepsilon$-Scaling
:class: important
For $\eta>0$, Algorithm {ref}`alg-auction-epsilon-scaling` returns a
permutation satisfying $\eta$-complementary slackness and
{eq}`eq-auction-cost-certificate-web` with $\varepsilon$ replaced by $\eta$.
If $R_{\C}>0$, it uses at most

```{math}
1+\left\lceil\log_2^+\!\left(\frac{R_{\C}}{\eta}\right)\right\rceil,
\qquad
\log_2^+(s)=\max\{0,\log_2 s\},
```

auction phases. Its dense worst-case complexity is

```{math}
O\!\left(n^3\left(1+\log_+\frac{R_{\C}}{\eta}\right)\right),
\qquad
\log_+(s)=\max\{0,\log s\}.
```

If $R_{\C}=0$, it terminates immediately. For integer-valued $\C$ and
$\eta<1/n$, its output is exactly optimal.
:::

:::{dropdown} Proof
The initial tolerance is $\varepsilon_0=\max\{R_{\C},\eta\}$. If it equals
$\eta$, the fixed-tolerance proposition gives the result in one phase.
Otherwise the first phase starts from the zero potential and costs $O(n^2)$ because
$R_{\C}/\varepsilon_0=1$.

Consider a later $\varepsilon$-phase initialized from a target potential obtained at
preceding tolerance $\lambda$. The preceding assignment satisfies
$\lambda$-complementary slackness. Lemma 25 of Mérigot and Thibert
{cite:p}`merigot2020optimaltransportalgorithms`, expressed in the present sign
convention, bounds the decrease of each potential component during the new
phase by $n(\lambda+\varepsilon)$. Since each bid decreases one component by at
least $\varepsilon$, the phase uses at most

```{math}
n^2\left(1+\frac{\lambda}{\varepsilon}\right)
```

bids. Consecutive tolerances satisfy $\lambda/\varepsilon\leq2$, hence each
warm-started phase costs $O(n^3)$ dense operations. Halving gives the stated
phase count. The last phase enforces $\eta$-complementary slackness, so the
fixed-tolerance proposition yields the accuracy and integer-cost conclusions.
:::

A cold-started $\eta$-auction has bound
$O(n^2(1+R_{\C}/\eta))$, while scaling uses a logarithmic number of $O(n^3)$
phases. Thus scaling is a high-accuracy guarantee, not an unconditional
speedup: its bound improves the cold-start estimate when $R_{\C}/\eta$ is large
compared with $n(1+\log_+(R_{\C}/\eta))$. For integer costs, choosing
$\eta<1/n$ gives an exact assignment in
$O(n^3(1+\log_+(nR_{\C})))$ operations.

:::{admonition} $\varepsilon$-Scaling Versus Sinkhorn
:class: note
Sinkhorn's continuation parameter has a different role. Entropy smooths the
hard minimum into a log-sum-exp, whereas auction retains the hard transform and
relaxes only the contact condition. Sinkhorn evolves a dense coupling; auction
maintains a partial permutation matrix through dual-weight bids and ownership changes.
:::

## Semi-discrete

The semi-discrete case is the setting where dual potentials become weights of
Laguerre cells. This gives both geometry and algorithms for quantization and
density fitting.

### Discrete Targets and Laguerre Cells

Consider the case where

```{math}
\beta=\sum_{j=1}^m b_j\delta_{y_j}
```

has distinct atoms and positive weights; zero-weight atoms can be removed. The
same construction applies if $\alpha$ is discrete, after
exchanging the roles of $\alpha$ and $\beta$. Restricting the minimization in
Definition {ref}`def-c-transform` to the support of $\beta$, equivalently
applying that definition with the discrete target space
$\Y=\{y_j\}_{j=1}^m$ and identifying a vector $g\in\RR^m$ with the function
$g:\Y\to\RR$ defined by $g(y_j)=g_j$, gives the discrete $\bar c$-transform

```{math}
:label: eq-disc-c-transform-web
g^{\bar c}(x)
\eqdef
\min_{1\le j\le m} c(x,y_j)-g_j.
```

This maps a vector $g$ to a continuous function because it is the minimum of
finitely many continuous functions. Using this transform when
$\beta$ is discrete yields the finite-dimensional semi-dual

```{math}
:label: eq-semi-dual-discrete-web
\mathcal{L}_c(\alpha,\beta)
=
\max_{g\in\RR^m}
\mathcal{E}(g)
\eqdef
\mathcal E_0(g^{\bar c},g)
=
\int_\X g^{\bar c}(x)\,\d\alpha(x)
+
\sum_{j=1}^m g_j b_j .
```

The objective is invariant under $g\mapsto g+s\mathbf 1$, so one may impose
the gauge $\sum_j g_j=0$.

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

Figure {ref}`fig:semidiscrete-laguerre-cells` follows this adjustment from unweighted Voronoi cells to a power diagram whose cell masses match the prescribed discrete target weights.

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
If the minimizing index in the discrete $\bar c$-transform is unique for
$\alpha$-almost every $x$, then $\mathcal{E}$ is differentiable at $g$ and

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

The difference quotients are bounded by $\norm{h}_\infty$, so dominated
convergence gives

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

The gradient components sum to zero, consistently with the gauge invariance.
Conversely, balanced cells define the piecewise-constant map
$T(x)=y_j$ on $\mathcal{L}_j(g)$. Its graph lies in the contact set
$g^{\bar c}(x)+g_j=c(x,y_j)$, so continuous complementary slackness proves
that both the map and the weights are optimal. For the quadratic cost,
uniqueness follows from Brenier's theorem when $\alpha$ has a density.


The sign of the gradient has a direct geometric interpretation. Increasing
$g_j$ lowers the corresponding power distance and expands $\mathcal L_j(g)$;
decreasing $g_j$ shrinks it. The dotted outline marks the balanced cell, so
semi-dual ascent can be read as a mass-balancing procedure on a power diagram.

Figure {ref}`fig:semidiscrete-weight-gradient-cells` makes the sign of this gradient geometric.

(fig:semidiscrete-weight-gradient-cells)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("semidiscrete-weight-gradient-cells", width=760)
```

*Dual weights control Laguerre cell masses in the semi-discrete quadratic
problem. The same blue target sites and red Gaussian source density are used in
all panels; only the highlighted violet weight is changed. The dotted violet
outline is the balanced cell. If the highlighted cell has too little source mass, then
$b_j-\alpha(\mathcal L_j(g))>0$ and the ascent update increases the weight,
expanding the cell outward. If it has too much mass, the update decreases the
weight, shrinking it inward. At balance, the cell mass matches the prescribed
target mass and the first-order update vanishes.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Vary the target weights and the number of dual updates to
watch Laguerre cells rebalance their masses.
:::

<iframe class="ot4ml-live-frame" title="Semi-discrete Laguerre controls" src="../live/semidiscrete-laguerre.html" loading="lazy" style="width:100%;height:510px;border:0;display:block;"></iframe>

Quadratic power diagrams have polyhedral cells and can be computed efficiently
using computational-geometry algorithms
{cite:p}`aurenhammer1987power,AurenhammerHA98,Merigot11`. Expanding the cost
shows that a cell minimizes
$x\mapsto-2\langle x,y_j\rangle+\norm{y_j}^2-g_j$. The lower envelope of these
affine functions gives the power diagram, while the lower hull of the lifted
sites $(y_j,\norm{y_j}^2-g_j)$ gives its dual regular triangulation. For a
planar source, this is a three-dimensional hull and Chan's output-sensitive
algorithm costs $O(m\log Q)$ for $Q$ hull vertices
{cite:p}`chan1996optimal`. A three-dimensional source lifts to four dimensions
and is not covered by that particular bound.

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

The stochastic supergradient has zero coordinate sum and preserves the gauge.
For almost-sure stochastic-approximation convergence, one typically imposes

```{math}
\sum_{\ell=0}^{\infty}\tau_\ell=\infty,
\qquad
\sum_{\ell=0}^{\infty}\tau_\ell^2<\infty.
```

For example, one may use
$\tau_\ell=\tau_0(1+\ell/\ell_0)^{-q}$ with $1/2<q\leq1$. The standard
finite-horizon rate instead concerns averaged iterates.

(prop-semidiscrete-sgd-rate)=
:::{admonition} Proposition: Averaged Stochastic Semi-dual Rate
:class: important
Let $g^\star$ maximize $\mathcal E$, set
$R=\norm{g^{(0)}-g^\star}_2$, and suppose the stochastic supergradients are
conditionally unbiased and bounded by $G$. For a horizon $L$, use the constant
step $\tau=R/(G\sqrt L)$ and
$\bar g_L=L^{-1}\sum_{\ell=0}^{L-1}g^{(\ell)}$. Then

```{math}
\mathcal{E}(g^\star)
-
\EE\left[\mathcal{E}(\bar g_L)\right]
\leq
\frac{RG}{\sqrt L}.
```
:::

:::{dropdown} Proof
Concavity and the squared-distance recursion yield

```{math}
2\tau\,\EE\!\left[\mathcal E(g^\star)-\mathcal E(g^{(\ell)})\right]
\leq
\EE\norm{g^{(\ell)}-g^\star}_2^2
-
\EE\norm{g^{(\ell+1)}-g^\star}_2^2
+
\tau^2G^2.
```

Summing, discarding the final squared distance, and using concavity at
$\bar g_L$ gives
$\mathcal E(g^\star)-\EE\mathcal E(\bar g_L)
\le R^2/(2\tau L)+\tau G^2/2$. Substitution of
$\tau=R/(G\sqrt L)$ proves the claim.
:::

This stochastic viewpoint is one of the main algorithmic advantages of the
semi-discrete formulation {cite:p}`Merigot11,genevay2016stochastic`.

(alg-semidiscrete-laguerre-ascent)=
:::{admonition} Algorithm: Semi-discrete Laguerre Ascent
:class: ot4ml-algorithm

**Input:** Source measure $\alpha$, target atoms $(y_j,\b_j)$, cost $c$, steps
$(\tau_k)_{k=0}^{K-1}$, tolerance $\mathrm{tol}$, maximum iteration count $K$.

**Output:** Semi-discrete dual weights $\gD$ and Laguerre cells.

**Initialize:** Set $\gD^{(0)}=0$.

**For** $k=0,\ldots,K-1$ **do**:

>
> **Compute cells:**
> $\Laguerre_j(\gD^{(k)}) = \enscond{x}{c(x,y_j)-\gD^{(k)}_j\leq c(x,y_\ell)-\gD^{(k)}_\ell\quad\forall \ell}.$
>
> **Compute masses:**
> $m_j^{(k)}=\int_{\Laguerre_j(\gD^{(k)})}\d\al .$
>
> **If** $\max_j\abs{m_j^{(k)}-\b_j}\leq\mathrm{tol}$ **then**:

>> **Return** $\gD^{(k)}$ and the current cells.
>
> **Update**
> $\gD^{(k+1)} = \gD^{(k)}+\tau_k\bigl(\b-m^{(k)}\bigr).$

**Compute** the cells of $\gD^{(K)}$.

**Return** $\gD^{(K)}$ and these cells.
:::

(alg-semidiscrete-stochastic-ascent)=
:::{admonition} Algorithm: Stochastic semi-discrete ascent
:class: ot4ml-algorithm

**Input:** Source sampler $x\sim\alpha$, target atoms $(y_j,\b_j)$, steps
$(\tau_\ell)_{\ell=0}^{L-1}$, iteration count $L$.

**Output:** Stochastic semi-discrete dual weights $\gD$.

**Initialize:** Set $\gD^{(0)}=0$.

**For** $\ell=0,\ldots,L-1$ **do**:

>
> **Draw** $x_\ell\sim\alpha$.
>
> **Set** $j_\ell=\min\argmin_j\bigl(c(x_\ell,y_j)-\gD_j^{(\ell)}\bigr)$.
>
> **For** $j=1,\ldots,m$ **do**

>> $\gD_j^{(\ell+1)} = \gD_j^{(\ell)} + \tau_\ell\bigl(\b_j-\ones_{\{j=j_\ell\}}\bigr).$

**Return** $\bar\gD_L=L^{-1}\sum_{\ell=0}^{L-1}\gD^{(\ell)}$.
:::


(sec-optimal-quantization)=
## Optimal Quantization

Optimal quantization asks for the best discrete approximation of a measure by
$m$ codepoints. It is the geometric core of vector quantization, compression
and $k$-means clustering.

### Free Masses and Prescribed Weights

The classical problem optimizes both codepoint positions and their
probabilities. For a measure $\alpha$, define

```{math}
:label: eq-optimal-quantization-web
\mathcal{Q}_m(\alpha)
\eqdef
\min_{Y=(y_j)_{j=1}^m,\;b\in\simplex_m}
\Wass_p\left(\alpha,\sum_{j=1}^m b_j\delta_{y_j}\right).
```

This problem is classical in approximation theory and information theory
{cite:p}`graf2000foundationsquantization,Lloyd82`.

The equal-weight case, $b_j=1/m$, prescribes the weights and is treated at the
end of this section.

(prop-quantization-rate)=
:::{admonition} Proposition: Quantization Rate and Curse of Dimensionality
:class: important
Let $\alpha$ be supported in a bounded $\Omega\subset\RR^d$ and assume
$\alpha=\rho\,\d x$ with $\rho\le\rho_+<+\infty$. Then, for fixed $p\ge1$, there exist
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
Enclose $\Omega$ in a cube and subdivide it into $k^d\le m$ congruent cubes,
where $k=\lfloor m^{1/d}\rfloor$. Placing one codepoint in each nonempty cube
gives the upper bound.

For the lower bound, fix any set $Y$ of $m$ codepoints and write
$d_Y(x)=\min_j\norm{x-y_j}$. Since the density is bounded above, the mass of
the $t$-neighborhood of $Y$ has mass at most
$\rho_+m\omega_dt^d$. For
$t_0=(2\rho_+m\omega_d)^{-1/d}$, one has
$\alpha(\{d_Y>t\})\ge1/2$ for $0<t<t_0$. Hence

```{math}
\int d_Y(x)^p\,\d\alpha(x)
=
\int_0^{+\infty}
p t^{p-1}\alpha(\{d_Y>t\})\,\d t
\ge
\frac{t_0^p}{2}
\simeq
c m^{-p/d}.
```

Taking the $p$-th root and minimizing over $Y$ proves the lower bound.
:::

This deterministic rate mirrors the empirical optimal-transport
sample-complexity rate: both are governed by the spacing $m^{-1/d}$ of points
in dimension $d$. Quantization is best-case and deterministic, while empirical
OT is random, but both display the same curse of dimensionality. Zador's
theorem further identifies the sharp asymptotic constant and limiting
codepoint density {cite:p}`graf2000foundationsquantization`.

For fixed codepoints $Y$, the powered cost
$b\mapsto\Wass_p^p(\alpha,\sum_jb_j\delta_{y_j})$ is convex. Its $p$-th root
$\Wass_p$ need not be convex. The dependence on $Y$ is nonconvex and is
generally computationally hard.
The rest of this section distinguishes the free-mass Lloyd reduction from the
fixed-weight geometry underlying finite-particle $\mathcal W_2$ gradient flows.

### Lloyd Algorithm

The computational appeal of quantization comes from
splitting the nonconvex search over sites into two elementary operations. For
fixed sites, the optimal assignment is purely local: each point is sent to one
of its nearest sites, and the resulting cells are Voronoi cells. This is the
assignment step behind Lloyd's algorithm and the $k$-means method.

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

At a differentiability point of this energy, any local minimizer with nonempty
cells satisfies the centroid condition

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
of its cell {cite:p}`Lloyd82`. The assignment and centroid steps each minimize
the appropriate block, so the objective cannot increase. Nonconvexity means
this does not guarantee a global minimizer. For a finite data set with squared
Euclidean loss, $k$-means++ gives an expected logarithmic approximation
guarantee {cite:p}`ArthurVassilvitskii2007`.

### Continuous Lloyd Flow

There is also an infinitesimal version of Lloyd's
fixed point, but it should first be understood on finite labelled
configurations. Assume that $c(x,y)=\norm{x-y}^2$ and that $\alpha$ does not
charge Voronoi boundaries. For a configuration $Y$, define, on nonempty cells,

```{math}
a_j(Y)=\alpha(\mathcal V_j(Y)),
\qquad
b_j(Y)=\frac{1}{a_j(Y)}
\int_{\mathcal V_j(Y)}x\,\d\alpha(x)
```

as the cell mass and centroid. Empty cells are singular points of the vector
field; one either freezes them, as in the algorithm below, or reseeds them.
The relaxed step

```{math}
y_j^{(k+1)}
=
y_j^{(k)}+\tau\big(b_j(Y^{(k)})-y_j^{(k)}\big),
\qquad 0<\tau\le 1,
```

is an explicit-Euler step for the cell-mass preconditioned gradient flow of the
quantization energy $\mathcal F$,

```{math}
\dot y_j(t)=b_j(Y_t)-y_j(t).
```

Indeed, at differentiability points of $\mathcal F$, the envelope theorem gives

```{math}
\nabla_{y_j}\mathcal F(Y)
=
2\int_{\mathcal V_j(Y)}(y_j-x)\d\alpha(x)
=
2a_j(Y)(y_j-b_j(Y)),
```

so that

```{math}
\dot y_j(t)
=
-\frac{1}{2a_j(Y_t)}\nabla_{y_j}\mathcal F(Y_t).
```

Equivalently, this is the gradient flow of $\mathcal F$ for the site metric
$g_Y(U,V)=2\sum_j a_j(Y)\langle u_j,v_j\rangle$; it is not the unweighted
Euclidean gradient flow unless the masses are absorbed into the time step.
Along smooth portions of the flow,

```{math}
\frac{\d}{\d t}\mathcal F(Y_t)
=
-2\sum_j a_j(Y_t)\|b_j(Y_t)-y_j(t)\|^2
\le 0.
```

If $\eta_t=\sum_j w_j\delta_{y_j(t)}$ carries fixed positive weights,
independent of the Voronoi masses $a_j(Y_t)$, this labelled particle ODE is
equivalently a weak continuity equation,

```{math}
\partial_t\eta_t+\operatorname{div}(v_t\eta_t)=0,
\qquad
v_t(y_j(t))=b_j(Y_t)-y_j(t),
```

in the sense of the measure evolutions introduced in
Chapter {ref}`sec-dynamic-optimal-transport`. The weights $w_j$ in this
transport equation are auxiliary weights for the moving labelled particles;
they are not the Voronoi masses used to define the quantization energy. If one
records instead the free-weight projection

```{math}
\nu_{Y_t}=\sum_j a_j(Y_t)\delta_{y_j(t)},
```

then, formally,

```{math}
\partial_t\nu_{Y_t}+\operatorname{div}(v_t\nu_{Y_t})
=
\sum_j\dot a_j(Y_t)\delta_{y_j(t)},
\qquad
v_t(y_j(t))=\dot y_j(t).
```

Thus the free-weight quantizer evolves by a balance equation, not by pure
transport. This is why the construction is intrinsically finite-dimensional:
Voronoi cells, centroids and labels define the velocity, and a canonical
extension to arbitrary measures is not obtained by replacing $Y$ with the
support of a measure. Indeed, any measure with dense support would have zero
support-distance quantization error.

### Mean-Field Limit and Ultrafast Diffusion

There is nevertheless a precise
high-resolution continuum theory when the number $m$ of codepoints tends to
infinity. If $\alpha=\rho\,\d x$, the limiting Eulerian variable is the density
$\sigma$ of sites, meaning heuristically that $m\sigma(x)\,\d x$ codepoints lie in
$\d x$. Thus the limit is $m\to+\infty$, not a limit in the exponent of the
PDE. In one dimension, Caglioti, Golse and Iacobelli embed the ordered particle
configuration in $L^2(0,1)$ and prove quantitative convergence of the discrete
gradient flow toward a limiting flow {cite:p}`caglioti2015gradient`. A
perturbative two-dimensional analysis around the optimal hexagonal lattice is
developed in {cite:p}`caglioti2018quantization2d`. For $p$-quantization in
dimension $d$, set $r=p/d$, so $r=2/d$ for the quadratic cost used in this
section, and write
$\mathcal F_p(Y)=\int\min_j\norm{x-y_j}^p\,\d\alpha(x)$. For well-prepared
configurations whose empirical site distributions converge to $\sigma\,\d x$,
the rescaled energy is described, up to a universal cell-shape constant, by

```{math}
\mathcal G_\rho(\sigma)
\eqdef
\int_\Omega \rho(x) \sigma(x)^{-r}\,\d x,
\qquad
\int_\Omega \sigma\,\d x=1,
```

Formally,

```{math}
m^r\mathcal F_p(Y^{(m)})\simeq C_{p,d}\mathcal G_\rho(\sigma),
\qquad
m^r\mathcal Q_m(\alpha)^p
\longrightarrow
C_{p,d}\min_\sigma\mathcal G_\rho(\sigma).
```

Since the first variation is $-r\rho\sigma^{-r-1}$, the formal
$\mathcal W_2$-gradient flow is the weighted ultrafast diffusion
equation

```{math}
\partial_t \sigma
=
-r\,\operatorname{div}\!\left(
\sigma\nabla\!\left(\frac{\rho}{\sigma^{r+1}}\right)
\right),
```

with periodic or no-flux boundary conditions. Iacobelli studies the associated
one-dimensional very-fast-diffusion equation and its convergence to equilibrium
{cite:p}`iacobelli2019asymptotic`; Iacobelli, Patacchini and Santambrogio then
use the JKO scheme and Wasserstein-gradient-flow tools to prove well-posedness,
regularity estimates and convergence for a multidimensional weighted version
{cite:p}`iacobelli2019weighted`. When $\rho>0$, set
$\omega=\rho^{1/(r+1)}$ and $u=\sigma/\omega$. The same equation becomes

```{math}
\partial_t u
=
-\frac{r+1}{\omega}\operatorname{div}\!\left(\omega\nabla(u^{-r})\right),
```

which makes the negative exponent, hence the ultrafast-diffusion character,
explicit. Its stationary site density is proportional to
$\rho^{d/(d+p)}$.

Figure {ref}`fig:semidiscrete-lloyd-flow-mixtures` shows the relaxed Lloyd flow in a two-dimensional toy problem.

(fig:semidiscrete-lloyd-flow-mixtures)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("semidiscrete-lloyd-flow-mixtures")
```

*Relaxed Lloyd flow from a source Gaussian-mixture initialization toward a
different target Gaussian-mixture density. The blue contours and shading show
the target density $\alpha$, while the colored disks are the moving codepoints
initialized from the source mixture. The faint curves
trace the labelled sites under the explicit-Euler Lloyd ODE. The right panel
displays the relative quantization energy, illustrating the monotone decay of
the objective along the relaxed iterations.*
:::

Figure {ref}`fig:semidiscrete-lloyd-quantization` follows the associated Voronoi cells and generators through Lloyd iterations, making the decrease of the quantization energy visible.

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

(alg-lloyd-quantization)=
:::{admonition} Algorithm: Lloyd quantization
:class: ot4ml-algorithm

**Input:** Source measure $\alpha$, initial codepoints
$Y^{(0)}=(y_j^{(0)})_{j=1}^m$, squared Euclidean cost, tolerance
$\mathrm{tol}$, maximum iteration count $K$.

**Output:** Codepoints $Y=(y_j)_{j=1}^m$.

**Initialize:** Set $d_0=+\infty$ and $k=0$.

**While** $d_k>\mathrm{tol}$ and $k<K$ **do**:

>
> **Set** $k\leftarrow k+1$.
>
> **Compute Voronoi cells:**
> $\VV_j(Y^{(k-1)}) = \enscond{x}{c(x,y_j^{(k-1)})\leq c(x,y_\ell^{(k-1)})\quad\forall \ell}.$
>
> **For** each nonempty cell $\VV_j$ **do**

>> $y_j^{(k)} = \frac{\int_{\VV_j(Y^{(k-1)})}x\,\d\al(x)} {\int_{\VV_j(Y^{(k-1)})}\d\al(x)}.$

> **For** each empty cell $\VV_j$ **do**:

>>
>> **Set** $y_j^{(k)}=y_j^{(k-1)}$.
>>

>
> **Set** $d_k=\max_j\norm{y_j^{(k)}-y_j^{(k-1)}}$.

**Return** $Y^{(k)}$.
:::


### Quantization with Fixed Equal Weights

The free-mass formulation above optimizes the positions and the weights of the
atoms. A different problem is obtained by prescribing the weights. In the
equal-weight case, set

```{math}
\nu_Y\eqdef \frac1m\sum_{j=1}^m\delta_{y_j},
\qquad
\mathcal F_{\rm eq}(Y)
\eqdef
\frac12\mathcal W_2^2(\alpha,\nu_Y),
```

and minimize only over the positions $Y=(y_j)_j$. Assume that the sites are
distinct, that $\alpha$ has a density, and that cell boundaries have zero
$\alpha$-mass. Let
$C_j(Y)$ be the Laguerre cell transported to $y_j$, so that
$\alpha(C_j(Y))=1/m$, and define its centroid

```{math}
\bar x_j(Y)
\eqdef
m\int_{C_j(Y)} x\,\d\alpha(x).
```

At differentiability points, the envelope theorem gives

```{math}
\nabla_{y_j}\mathcal F_{\rm eq}(Y)
=
\frac1m\bigl(y_j-\bar x_j(Y)\bigr).
```

Locally, while labels remain optimally matched, the $\mathcal W_2$ metric on
equal-weight empirical measures induces the particle metric
$g_Y(U,V)=m^{-1}\sum_j\langle u_j,v_j\rangle$. Hence the
associated $\mathcal W_2$ gradient flow is the coupled system

```{math}
\dot y_j(t)
=
\bar x_j(Y_t)-y_j(t),
\qquad j=1,\ldots,m.
```

Equivalently, $\nu_{Y_t}$ satisfies a continuity equation with velocity
$v_t(y_j(t))=\bar x_j(Y_t)-y_j(t)$. This is the so-called finite-particle
$\mathcal W_2$ gradient-flow viewpoint developed more systematically in
Chapter {ref}`sec-wasserstein-gradient-flows`; the fixed-weight cells are
Laguerre cells rather than the free-mass Voronoi cells used by Lloyd's method.

### Equal-Weight Quantization on the Line

The following classical scalar quantization result gives the precise form of
the inverse-CDF rule for equal-weight quadratic quantization
{cite:p}`graf2000foundationsquantization`. The atoms are not exactly the
midpoint quantiles in general; they are the averages of the quantile function
over equal mass bins. Midpoint inverse-CDF samples are nevertheless
asymptotically equivalent and are often the most convenient rule in numerical
examples.

(prop-1d-equal-weight-quantization)=
:::{admonition} Proposition: One-Dimensional Equal-Weight Quantization
:class: important
Let $\alpha\in\mathcal M_+^1(\mathbb R)$ have finite second moment and quantile
function $Q=F_\alpha^{-1}$. For

```{math}
\mathcal Q_{m,\mathrm{eq}}(\alpha)^2
\eqdef
\min_{y_1\le\cdots\le y_m}
\mathcal W_2^2
\left(\alpha,\frac1m\sum_{i=1}^m\delta_{y_i}\right),
```

set $I_i=((i-1)/m,i/m]$. Then the sorted minimizer is unique and its $i$th
atom is

```{math}
y_i^\star
=
m\int_{I_i} Q(u)\,\d u,
```

and

```{math}
\mathcal Q_{m,\mathrm{eq}}(\alpha)^2
=
\sum_{i=1}^m
\int_{I_i}
\left|Q(u)-y_i^\star\right|^2\,\d u.
```

If $Q\in C^1([0,1])$, then

```{math}
m^2\mathcal Q_{m,\mathrm{eq}}(\alpha)^2
\longrightarrow
\frac1{12}\int_0^1 |Q'(u)|^2\,\d u.
```
:::

:::{dropdown} Proof
After sorting the atoms, the quantile formula for $\mathcal W_2$ gives

```{math}
\mathcal W_2^2
\left(\alpha,\frac1m\sum_{i=1}^m\delta_{y_i}\right)
=
\sum_{i=1}^m
\int_{I_i}|Q(u)-y_i|^2\,\d u.
```

The minimization decouples over the intervals $I_i$, and the best constant
approximation of $Q$ on $I_i$ is its average. These averages are nondecreasing
because $Q$ is nondecreasing, so they satisfy the sorting constraint. Strict
convexity gives uniqueness.

Denote by $\bar Q_{I_i}=m\int_{I_i}Q(u)\,\d u$ the interval average. If $Q$ is
$C^1$, set $h=1/m$ and write $I_i=(a_i,a_i+h]$. Uniform Taylor expansion gives,
for $v\in[0,1]$,

```{math}
Q(a_i+hv)
=
Q(a_i)+hvQ'(a_i)+h\,r_i(v),
\qquad
\max_i\sup_{v\in[0,1]} |r_i(v)|\to0.
```

Subtracting the average over $v\in[0,1]$ and integrating gives

```{math}
\int_{I_i}|Q(u)-\bar Q_{I_i}|^2\,\d u
=
\frac{h^3}{12}|Q'(a_i)|^2+o(h^3),
```

uniformly in $i$. Summing over $i$ yields a Riemann sum for
$\frac1{12}\int_0^1 |Q'(u)|^2\,\d u$.
:::

Thus the common deterministic rule
$m^{-1}\sum_i\delta_{Q((i-1/2)/m)}$ should be read as a midpoint approximation
of the optimal bin-average formula. Orthogonal projection onto constants shows
that it has the same leading squared error under the same smoothness
assumptions; for the uniform law on $[0,1]$, both rules
coincide and give the regular grid $y_i=(i-1/2)/m$. Random sampling has a
different asymptotic regime.

(prop-1d-random-quantile-process)=
:::{admonition} Proposition: Quantile-Process Asymptotics for Random Placement
:class: important
Let $\alpha\in\mathcal M_+^1(\mathbb R)$ have quantile
$Q\in C^1([0,1])$, and let
$\widehat\alpha_m=m^{-1}\sum_{i=1}^m\delta_{X_i}$ with $X_i$ i.i.d. with law
$\alpha$. If $B$ denotes the standard Brownian bridge on $[0,1]$, then

```{math}
m\,\mathcal W_2^2(\alpha,\widehat\alpha_m)
\overset{\mathrm{law}}{\longrightarrow}
\int_0^1 B(u)^2 |Q'(u)|^2\,\d u,
```

and, in expectation,

```{math}
m\,\mathbb E\!\left[
\mathcal W_2^2(\alpha,\widehat\alpha_m)
\right]
\longrightarrow
\int_0^1 u(1-u)|Q'(u)|^2\,\d u.
```
:::

:::{dropdown} Proof
Let $\widehat Q_m$ be the empirical quantile function. The one-dimensional
formula gives

```{math}
\mathcal W_2^2(\alpha,\widehat\alpha_m)
=
\int_0^1|\widehat Q_m(u)-Q(u)|^2\,\d u.
```

Write $X_i=Q(U_i)$ with $U_i$ i.i.d. uniform on $[0,1]$, and let
$\widehat U_m^{-1}$ be the empirical quantile function of the $U_i$. Then
$\widehat Q_m=Q\circ \widehat U_m^{-1}$. The classical uniform quantile-process
theorem {cite:p}`vanDerVaartWellner1996,BobkovLedoux2019EmpiricalKantorovich` gives

```{math}
\sqrt m\,(\widehat U_m^{-1}-\operatorname{Id})
\overset{\mathrm{law}}{\longrightarrow}
-B
\quad\text{in }L^2(0,1).
```

Uniform continuity of $Q'$ and the functional delta method give

```{math}
\sqrt m\,(\widehat Q_m-Q)
\overset{\mathrm{law}}{\longrightarrow}
-BQ'
\quad\text{in }L^2(0,1).
```

Since $B$ and $-B$ have the same law, the sign disappears in the squared $L^2$
norm. The continuous mapping theorem gives the distributional convergence.
Standard fourth-moment bounds for the uniform quantile process give uniform
integrability, hence convergence of expectations. Since
$\mathbb E[B(u)^2]=u(1-u)$, Fubini's theorem gives the
displayed expectation limit.
:::

Combining these propositions gives a sharp contrast between optimal placement
and random placement on the line. Deterministic equal-weight quantization has
squared error of order $m^{-2}$, hence $\mathcal W_2$ error of order $m^{-1}$,
while i.i.d. empirical sampling has expected squared error of order $m^{-1}$, hence
root-mean-square $\mathcal W_2$ error of order $m^{-1/2}$. This is consistent
with broader empirical OT sample-complexity theory
{cite:p}`dereich2013constructive,fournier2015rate,weed2017sharp`.

Figure {ref}`fig:semidiscrete-quantile-quantization-rates` illustrates both parts of this comparison: optimal atoms are uniform in quantile coordinates, and their error decays one power of $m$ faster than the root-mean-square empirical error.

(fig:semidiscrete-quantile-quantization-rates)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("semidiscrete-quantile-quantization-rates")
```

*One-dimensional equal-weight quantization in quantile coordinates. Left: for a
smooth positive density on $[0,1]$, the colored atoms are bin averages of the
inverse CDF over equal quantile intervals, while the gray atoms show one i.i.d.
empirical draw with the same number of particles. Right: expected squared
$\mathcal W_2$ errors. The deterministic bin averages and midpoint quantiles
follow the $m^{-2}$ squared-error law, whereas i.i.d. empirical measures follow
the slower $m^{-1}$ expected squared-error law.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change the one-dimensional law, the number of atoms and
the Monte Carlo seed to compare optimal equal-weight quantization with random
empirical sampling. The right panel recomputes the squared $\Wass_2$ error
curves from the quantile formula.
:::

<iframe class="ot4ml-live-frame" title="One-dimensional quantization-rate controls" src="../live/semidiscrete-quantization-rates.html" loading="lazy" style="width:100%;height:480px;border:0;display:block;"></iframe>

(sec-W1)=
## Wasserstein-1 Norm

The $\Wass_1$ distance has an especially transparent dual: the admissible
potentials are exactly $1$-Lipschitz test functions. This makes $\Wass_1$ the
meeting point between transport, PDE formulations and weak norms on signed
measures.

### c-Transform for Wasserstein-1

Assume that $d$ is a distance on $\X=\Y$ and take the ground cost
$c(x,y)=d(x,y)$.

(def-lipschitz-constant)=
:::{admonition} Definition: Lipschitz Constant
:class: important
For a function $f:\X\to\RR$ on a metric space $(\X,d)$, its Lipschitz constant
is

```{math}
:label: eq-lip-constant
\Lip(f)
\eqdef
\sup_{x\ne y}
\frac{|f(x)-f(y)|}{d(x,y)}.
```

The function is $1$-Lipschitz when $\Lip(f)\le1$.
:::

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

By the preceding proposition, a closed dual pair has the form $(f,-f)$ with
$\Lip(f)\le1$. The Kantorovich dual therefore becomes the
Kantorovich--Rubinstein formula

```{math}
:label: eq-w1-metric-web
\Wass_1(\alpha,\beta)
=
\max_f
\left\{
\int_\X f\,\d(\alpha-\beta)
:
\Lip(f)\le1
\right\}
=:
\norm{\alpha-\beta}_{W_1}.
```

This expression depends only on the signed measure $\xi=\alpha-\beta$. On
compact $\X$, the same supremum defines the Kantorovich--Rubinstein norm on
finite signed measures with zero mass {cite:p}`kantorovich1958space`.
Homogeneity and the triangle inequality are immediate, while definiteness
follows because Lipschitz functions separate finite Radon measures. On a
noncompact pointed space, one uses normalized Lipschitz functions and measures
with finite first moment.

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
or first-order methods. If $N$ support points are involved, however, it still
contains $O(N^2)$ Lipschitz constraints, mirroring the $O(nm)$ coupling
variables of the original discrete Kantorovich LP; the dual formulation alone
does not remove the all-pairs structure. The gain comes on structured metric
spaces where the distance is generated locally: it is then enough to impose
Lipschitz inequalities on neighboring pairs, because summing along paths
recovers the constraints between arbitrary points. The one-dimensional ordered
case is the first example; the graph-geodesic case is described later in
Proposition {ref}`prop-graph-w1-beckmann`.

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

In one dimension this is equivalent to the cumulative formula given in the
one-dimensional transport section.

### Wasserstein-1 on Euclidean Spaces

In Euclidean space, the Lipschitz constraint has a local differential form and
its dual variable is a flux. Let $\alpha,\beta$ have finite first moments and
set $\xi=\alpha-\beta$. Rademacher's theorem gives

```{math}
:label: eq-w1-cont-web
\Wass_1(\alpha,\beta)
=
\sup_{f\in W_{\mathrm{loc}}^{1,\infty}(\RR^d)}
\left\{
\int_{\RR^d} f\,\d\xi
:
\norm{\nabla f}_{L^\infty}\le1
\right\}.
```

The flux need not have a Lebesgue density: Dirac-to-Dirac transport already
produces a measure concentrated on a segment. Let
$m\in\mathcal M(\RR^d;\RR^d)$ be a vector-valued Radon measure, let $|m|$
denote its total variation, and define
$\langle\operatorname{div}m,\varphi\rangle=-\int\langle\nabla\varphi,\d m\rangle$.

(prop-euclidean-beckmann)=
:::{admonition} Proposition: Euclidean Beckmann Formula
:class: important

```{math}
:label: eq-w1-cont-div-web
\Wass_1(\alpha,\beta)
=
\min_{m\in\mathcal M(\RR^d;\RR^d)}
\left\{
|m|(\RR^d)
:
\operatorname{div}(m)=\alpha-\beta
\right\},
```
:::

:::{dropdown} Proof
For every feasible $m$ and smooth $1$-Lipschitz $f$,
$\int f\,\d(\alpha-\beta)=-\int\langle\nabla f,\d m\rangle\le|m|(\RR^d)$.
The Lipschitz dual gives one inequality. Conversely, if $\pi$ is an optimal
plan, define

```{math}
\int\langle\zeta,\d m\rangle
=
\int\!\int_0^1
\left\langle\zeta((1-t)x+ty),y-x\right\rangle
\d t\,\d\pi(x,y).
```

The fundamental theorem of calculus gives
$\operatorname{div}m=\alpha-\beta$, and
$|m|(\RR^d)\le\int\norm{x-y}\,\d\pi=\Wass_1(\alpha,\beta)$.
:::

This is the Beckmann formulation {cite:p}`Beckmann52,SantambrogioBook`. If
$m=w\,\d x$, its cost is $\int\norm{w(x)}\,\d x$. Outside the source and
target mass, $\operatorname{div}m=0$, expressing local conservation.

Once discretized with finite elements, the dual Lipschitz problem and the
Beckmann problem become nonsmooth convex optimization problems. The same
formulation extends to complete Riemannian manifolds by replacing straight
segments with minimizing geodesics and using tangent-valued Radon measures.

### Graph Distances and Beckmann Flows

Finite graphs give a simple discrete instance where a metric is generated by
local moves, so the all-pairs Lipschitz constraints collapse to edge
constraints.

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
The edge constraints imply the all-pairs bound by summing along paths and
minimizing over paths. Conversely, a $1$-Lipschitz function for $d_G$ satisfies
$|f_i-f_j|\le d_G(i,j)\le\ell_e$ on every edge. The first equality is therefore the
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

Figure {ref}`fig:w1-graph-transport-flow` shows the optimal edge flux on both a quasi-regular and a nonuniform Delaunay graph, emphasizing that the Beckmann variables live only on graph edges.

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

(rem-graph-w1-network-simplex)=
:::{admonition} Remark: Sparse LP and Network Simplex
:class: ot4ml-remark

Let $N=|V|$ and $M=|E|$. Writing $m=m^+-m^-$ turns graph Beckmann transport
into

```{math}
\min_{m^+,m^-\geq0}\sum_{e\in E}\ell_e(m^+_e+m^-_e)
\quad\text{subject to}\quad
\operatorname{div}_G(m^+-m^-)=r .
```

This LP has $2M$ nonnegative variables and $N-1$ independent balance
constraints, versus $N^2$ variables and $2N-1$ independent constraints for the
dense transport LP. On a sparse graph, $M=O(N)$.

Equivalently, replace each undirected edge by two directed arcs. The result is
a minimum-cost transshipment problem to which the network simplex applies: a
basis is a spanning tree, and a pivot inserts a non-tree arc and routes flow
around the resulting cycle {cite:p}`bertsekas1988dual,Orlin1997`. A basic
implementation costs $O(PM)$ for $P$ pivots on a sparse graph. Although $P$
depends on the pivot rule, polynomial minimum-cost-flow algorithms are
available, and the edge formulation is usually far smaller than the dense
transport LP.
:::

This graph formulation is the transshipment version of $\Wass_1$. It is the
natural discrete analogue of the Beckmann formulation: gradients are edge
differences, divergences are incidence-matrix balances, and geodesic distance
is shortest-path length. It can be solved by min-cost flow methods on sparse
graphs, while entropic or KL-projection variants lead to flow-Sinkhorn
algorithms for graph $\Wass_1$ {cite:p}`Beckmann52,peyre2026robust`.
