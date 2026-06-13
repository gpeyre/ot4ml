---
title: Kantorovich Relaxation
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---

Kantorovich's relaxation is the decisive move that turns transport into convex
optimization. Deterministic maps are replaced by couplings, infeasibility and
asymmetry disappear, and the Wasserstein distances emerge. Historically, this
linear-programming viewpoint grew from Kantorovich's economic planning work
{cite:p}`Kantorovich42` and is now the standard foundation of optimal transport
{cite:p}`Villani03,Villani09,rachev1998mass2`.

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

## Discrete Relaxation

The discrete relaxation is the cleanest place to see mass splitting. It
replaces permutations by a transportation polytope and reveals the
linear-programming structure that algorithms exploit.

Monge's discrete matching problem cannot be applied when the two clouds have
different cardinalities or unequal weights. The continuous Monge problem has
the same obstruction: there may be no map $T$ such that $T_\sharp\al=\be$,
for instance when one Dirac mass must be sent to several Dirac masses. It is
also asymmetric: two Dirac masses can be mapped to one, but one Dirac mass
cannot be split into two by a deterministic map.

Kantorovich's idea is to relax deterministic transportation. Instead of sending
each source point $x_i$ to exactly one target, the mass at $x_i$ may be
dispatched across several targets. The relaxation is encoded by a coupling
matrix $P\in\RR_+^{n\times m}$ for two discrete measures

```{math}
\al=\sum_i a_i\delta_{x_i},
\qquad
\be=\sum_j b_j\delta_{y_j}.
```

:::{admonition} Definition: Discrete Couplings And Mass Conservation
:class: important
Admissible couplings are constrained only by conservation of mass:

```{math}
:label: eq-discr-couplings-web
\CouplingsD(a,b)
\eqdef
\left\{
P\in\RR_+^{n\times m}
\;:\;
P\mathbf{1}_m=a,\quad
P^\top\mathbf{1}_n=b
\right\}.
```

Equivalently, rows sum to the source masses and columns sum to the target
masses:

```{math}
\left(\sum_j P_{ij}\right)_i=a,
\qquad
\left(\sum_i P_{ij}\right)_j=b.
```
:::

The first consequence is feasibility. There is always at least one admissible
plan.

:::{admonition} Definition: Discrete Product Coupling
:class: important
Given weights $a\in\simplex_n$ and $b\in\simplex_m$, the discrete product, or
trivial, coupling is

```{math}
P^\otimes_{ij}\eqdef a_i b_j.
```

It belongs to $\CouplingsD(a,b)$ and corresponds to choosing source and target
labels independently.
:::

The feasible set is a bounded intersection of an affine space with the
nonnegative orthant, hence a convex polytope. In one dimension, the coupling
can be read as a matrix: rows index source bins, columns index target bins, and
the marginal constraints appear as prescribed row and column sums.

:::{admonition} Proposition: Discrete Product Optimality Is Degenerate
:class: important
Assume that all zero-mass rows and columns have been removed, so that
$a_i>0$ and $b_j>0$, and let $C$ be a finite cost matrix. The product plan
$P^\otimes=ab^\top$ minimizes $P\mapsto\langle C,P\rangle$ over
$\CouplingsD(a,b)$ if and only if every coupling
$P\in\CouplingsD(a,b)$ minimizes it.
:::

:::{dropdown} Proof
The reverse implication is immediate. Conversely, assume that $P^\otimes$ is
optimal and let $Q\in\CouplingsD(a,b)$ be arbitrary. Since all entries of
$P^\otimes$ are positive, there exists $t>0$ small enough that

```{math}
R\eqdef(1+t)P^\otimes-tQ
```

is nonnegative. It still has row sums $a$ and column sums $b$, so
$R\in\CouplingsD(a,b)$. Also

```{math}
P^\otimes=\frac{1}{1+t}R+\frac{t}{1+t}Q.
```

Taking scalar products with $C$, the optimality of $P^\otimes$ forces both
$R$ and $Q$ to have the same cost as $P^\otimes$. Since $Q$ was arbitrary, all
couplings are optimal.
:::

Thus the product plan is mainly a feasibility witness. Except when the linear
cost is constant on the whole transportation polytope, it is not expected to
solve optimal transport.

```{code-cell} ipython3
:tags: [hide-input]
show_book_figure("kantorovich-coupling-polylines")
```

*Discrete couplings represented as straight transport segments. The
deterministic graph is a feasible Monge-type plan, the product plan spreads
every source mass over all targets, and the optimal Kantorovich plan minimizes
the quadratic transport cost. Line width and opacity encode transported mass.*

The live panel below separates the main feasible-plan archetypes: deterministic
graphs, independent product couplings, sparse splitting plans, and entropic
approximations.

:::{dropdown} Live controls
<iframe class="ot4ml-live-frame" title="Kantorovich coupling controls" src="../live/kantorovich-couplings.html" loading="lazy" style="width:100%;height:470px;border:0;display:block;"></iframe>
:::

```{code-cell} ipython3
:tags: [hide-input]
show_book_figure("kantorovich-coupling-matrix-marginals")
```

*Coupling matrices with their prescribed marginals. The central grayscale image
displays $P_{ij}$; the red curve on the left is the source marginal $a$, and
the blue curve on top is the target marginal $b$. The independent product plan
is diffuse, whereas the one-dimensional optimal plan concentrates near the
monotone quantile correspondence.*

The companion control varies the bin count and the endpoint laws, making the
transition from diffuse independence to monotone transport visually explicit.

:::{dropdown} Live controls
<iframe class="ot4ml-live-frame" title="Coupling matrix controls" src="../live/kantorovich-matrix.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>
:::

The Kantorovich feasible set is symmetric: $P\in\CouplingsD(a,b)$ if and only
if $P^\top\in\CouplingsD(b,a)$. With a unit transport cost matrix
$C_{ij}$, the discrete Kantorovich problem reads

```{math}
:label: eq-kanto-discr-web
\mathcal{L}_C(a,b)
\eqdef
\min_{P\in\CouplingsD(a,b)}
\langle C,P\rangle
=
\min_{P\in\CouplingsD(a,b)}
\sum_{i,j} C_{ij}P_{ij}.
```

This is a linear program, and its solutions need not be unique.

```{code-cell} ipython3
:tags: [hide-input]
show_book_figure("kantorovich-permutation-versus-splitting")
```

*From permutation matrices to splitting couplings. When the two empirical
measures have the same number of atoms and uniform weights, an optimal plan can
be a permutation matrix. Once target masses are nonuniform, one source can send
mass to several targets and several sources can merge into the same target.*

The live panel keeps the same source and target sites while changing the target
mass imbalance, so the moment where permutation structure breaks becomes
visible.

:::{dropdown} Live controls
<iframe class="ot4ml-live-frame" title="Splitting coupling controls" src="../live/kantorovich-splitting.html" loading="lazy" style="width:100%;height:470px;border:0;display:block;"></iframe>
:::

:::{admonition} Proposition: Sparse Optimal Plans
:class: important
Assume $a_i>0$, $b_j>0$ and $\sum_i a_i=\sum_j b_j=1$. The linear program
above admits an optimal coupling with at most $n+m-1$ nonzero entries.
:::

:::{dropdown} Proof
The transportation polytope is compact, so a linear objective attains its
minimum at an extreme point. Let $P$ be an extreme point and let
$E=\{(i,j):P_{ij}>0\}$ be its support graph on the bipartite vertex set of
source and target indices. If this graph contains a cycle, put alternating
signs $+1,-1$ on the cycle, obtaining a nonzero matrix $H$ supported on $E$
with zero row and column sums. For small $t>0$, both $P+tH$ and $P-tH$ are
nonnegative couplings and $P$ is their midpoint, contradicting extremality.
Thus the support graph is a forest, which has at most $n+m-1$ edges.
:::

:::{admonition} Proposition: North-West Corner Feasible Plan
:class: important
Let $a\in\RR_+^n$ and $b\in\RR_+^m$ have the same positive total mass. A greedy
sweep constructs a coupling with at most $n+m-1$ positive entries: start at
$(i,j)=(1,1)$ with residual masses $r_i=a_i$ and $s_j=b_j$, set

```{math}
P_{ij}=\min(r_i,s_j),
```

subtract this value from both residuals, and advance every index whose residual
has become zero. Repeat until all mass is exhausted.
:::

:::{dropdown} Proof
All assignments are nonnegative. At each step, the mass placed in $(i,j)$ is
subtracted from one current row residual and one current column residual. An
index is advanced only when its residual is fully filled. Each positive
assignment exhausts at least one current row or column, so before the final
assignment there can be at most $n-1$ row advances and $m-1$ column advances.
The support is acyclic because once a row or column is advanced, it never
appears again.
:::

### One-Dimensional Cases

In one dimension, the transportation polytope has a canonical monotone
optimizer. This is the weighted version of the sorting rule from the matching
chapter.

:::{admonition} Proposition: One-Dimensional Weighted Sweep
:class: important
Let $x_1\leq\cdots\leq x_n$ and $y_1\leq\cdots\leq y_m$ be points on the line,
and let $c(x,y)=h(x-y)$ with $h$ convex. The north-west corner plan between the
sorted weighted atoms is optimal. Consequently, for unsorted one-dimensional
inputs, an optimal plan is obtained in
$O(n\log n+m\log m)$ time by sorting and then sweeping the masses once from
left to right.
:::

:::{dropdown} Proof
The north-west plan is monotone: it cannot put positive mass on both
$(i,j)$ and $(i',j')$ when $i<i'$ and $j>j'$. Conversely, any feasible plan
with such a crossing pair can be improved by moving a small mass from
$(i,j)$ and $(i',j')$ to $(i,j')$ and $(i',j)$. Convexity gives the required
two-point inequality. Repeating this uncrossing procedure yields the unique
monotone feasible plan, namely the sweep plan.
:::

### Permutation Matrices As Couplings

Now assume $n=m$ and uniform weights $a=b=\mathbf{1}_n/n$. For a permutation
$\sigma\in\Perm(n)$, let $P_\sigma$ be its permutation matrix. The
corresponding probability coupling is $P_\sigma/n$, and

```{math}
\langle C,P_\sigma/n\rangle
=
\frac1n\sum_{i=1}^n C_{i,\sigma(i)}.
```

Thus the assignment problem is the minimization of a linear function over the
discrete, non-convex set of permutation matrices. The convex relaxation is the
Birkhoff polytope

```{math}
\mathcal B_n
\eqdef
\left\{
P\in\RR_+^{n\times n}
\;:\;
P\mathbf{1}_n=\mathbf{1}_n,\quad
P^\top\mathbf{1}_n=\mathbf{1}_n
\right\}.
```

:::{admonition} Definition: Extreme Points
:class: important
For a compact convex set $\mathcal C$ in a finite-dimensional vector space,

```{math}
\Extr(\mathcal C)
\eqdef
\{x\in\mathcal C:
x=(y+z)/2,\ y,z\in\mathcal C
\Rightarrow y=z=x\}.
```
:::

:::{admonition} Proposition: Linear Programs Have Extreme Minimizers
:class: important
Let $\mathcal C$ be nonempty and compact. For every linear form $\ell$,

```{math}
\Extr(\mathcal C)\cap\argmin_{x\in\mathcal C}\ell(x)\neq\emptyset.
```
:::

:::{dropdown} Proof
The minimizer set is nonempty, compact and convex. A nonempty compact convex
set in finite dimension has an extreme point, obtained by taking a face of
minimal affine dimension. That extreme point is also extreme in the original
set.
:::

:::{admonition} Theorem: Birkhoff--von Neumann
:class: important
The extreme points of $\mathcal B_n$ are exactly the permutation matrices.
:::

:::{dropdown} Proof
A permutation matrix is extreme because its entries are in $\{0,1\}$. Conversely,
let $P\in\mathcal B_n$ be non-integral. Consider the bipartite graph of entries
$0<P_{ij}<1$. Every non-isolated vertex has degree at least two, so the graph
contains a cycle. Put alternating signs along the cycle, giving a nonzero
matrix $H$ with zero row and column sums. For small $\epsilon>0$, both
$P+\epsilon H$ and $P-\epsilon H$ remain bistochastic, and $P$ is their
midpoint. Thus $P$ is not extreme.
:::

:::{admonition} Corollary: Kantorovich For Matching
:class: important
If $m=n$ and $a=b=\mathbf{1}_n/n$, then the discrete Kantorovich problem admits
an optimal solution of the form $P_\sigma/n$. The associated permutation solves
the assignment problem.
:::

For uniform empirical measures, the Kantorovich relaxation is tight: one can
choose a permutation matrix among the minimizers. For general discrete measures,
the Monge constraint may be empty and splitting couplings are essential.

## Linear-Programming Algorithms

The discrete Kantorovich problem is a linear program with much more structure
than a generic dense LP. Its variables are arcs of a complete bipartite network,
its equality constraints are flow-conservation constraints, and its extreme
points are sparse tree-like couplings.

### Transportation Simplex And Network Simplex

The transportation simplex goes back to Dantzig's formulation of the
transportation problem {cite:p}`Dantzig51`. It works on basic feasible
couplings, whose support is completed into a spanning tree of the bipartite
supply-demand graph. Reduced costs identify whether an unused arc can decrease
the objective. Adding such an arc creates a unique cycle; one then pushes as
much mass as possible around that cycle and removes the exhausted arc.

The network simplex is the corresponding pivoting method for general
minimum-cost-flow problems {cite:p}`bertsekas1988dual`. It keeps node
potentials, reduced costs and a spanning-tree basis. Its worst-case number of
pivots can be exponential, but the per-pivot operations exploit graph sparsity.
Polynomial guarantees can be obtained from strongly polynomial
minimum-cost-flow algorithms such as Orlin's algorithm {cite:p}`Orlin1997`.

### Interior-Point Methods

Generic interior-point methods approach the LP through a smooth central path.
For the transport polytope, the logarithmic-barrier version is

```{math}
:label: eq-transport-log-barrier-web
P_\epsilon
\eqdef
\argmin_{\substack{P\mathbf{1}_m=a,\;P^\top\mathbf{1}_n=b\\P_{ij}>0}}
\langle C,P\rangle
-
\epsilon\sum_{i,j}\log P_{ij}.
```

The barrier is singular at the boundary, so each iterate stays strictly inside
the transportation polytope. As $\epsilon\downarrow0$, the central path
approaches the set of LP minimizers.

```{code-cell} ipython3
:tags: [hide-input]
show_book_figure("kantorovich-log-barrier-lp-geometry")
```

*Logarithmic-barrier central path for a triangular slice of a linear program.
Large $\epsilon$ selects a central interior point; decreasing $\epsilon$ moves
the minimizer toward the optimal vertex while never touching the boundary. This
differs from entropic OT, where the entropy temperature is part of the
regularized objective itself.*

The live view exposes the barrier parameter directly: lowering $\epsilon$
slides the minimizer from the center of the feasible triangle toward the LP
vertex.

:::{dropdown} Live controls
<iframe class="ot4ml-live-frame" title="Log barrier central path controls" src="../live/kantorovich-barrier.html" loading="lazy" style="width:100%;height:460px;border:0;display:block;"></iframe>
:::

Both interior-point methods and Sinkhorn keep iterates positive, but they use
positivity differently. Interior-point algorithms solve the original LP by
decreasing a barrier parameter. Sinkhorn fixes an entropic temperature and
solves a different, KL-regularized OT problem by alternating diagonal scalings.

## Relaxation For Arbitrary Measures

This section lifts the finite-dimensional coupling matrix to a joint
probability measure. The payoff is that existence, duality and metric
properties can be stated for arbitrary laws, including discrete, singular and
continuous distributions.

### Continuous Couplings

:::{admonition} Definition: Marginals Of A Joint Measure
:class: important
Let $\pi\in\Mm_+^1(\Xx\times\Yy)$ and let
$P_\Xx(x,y)=x$ and $P_\Yy(x,y)=y$ be the coordinate projections. The marginals
of $\pi$ are

```{math}
\pi_1\eqdef(P_\Xx)_\sharp\pi,
\qquad
\pi_2\eqdef(P_\Yy)_\sharp\pi.
```

Equivalently, for bounded continuous test functions $f$ on $\Xx$ and $g$ on
$\Yy$,

```{math}
\int f(x)\d\pi(x,y)=\int f\d\pi_1,
\qquad
\int g(y)\d\pi(x,y)=\int g\d\pi_2.
```
:::

:::{admonition} Definition: Couplings
:class: important
Given $\al\in\Mm_+^1(\Xx)$ and $\be\in\Mm_+^1(\Yy)$, the set of couplings
between $\al$ and $\be$ is

```{math}
:label: eq-coupling-generic-web
\Couplings(\al,\be)
\eqdef
\{\pi\in\Mm_+^1(\Xx\times\Yy):\pi_1=\al,\ \pi_2=\be\}.
```

This is the continuous analogue of the transportation polytope.
:::

:::{admonition} Remark: Probabilistic Interpretation Of Couplings
:class: note
If $X\sim\al$ and $Y\sim\be$, then
$\pi\in\Couplings(\al,\be)$ is the law of a pair $(X,Y)$ whose coordinates have
laws $\al$ and $\be$. The coupling encodes dependence. The tensor product
$\al\otimes\be$ corresponds to independence; a graph coupling
$(\Id,T)_\sharp\al$ corresponds to the deterministic relation $Y=T(X)$.
:::

Unlike the Monge constraint, the coupling constraint is never empty. The
continuous feasibility witness is the tensor product coupling.

:::{admonition} Definition: Tensor Product And Trivial Coupling
:class: important
Given $\al\in\Mm_+^1(\Xx)$ and $\be\in\Mm_+^1(\Yy)$, the tensor product
coupling $\al\otimes\be$ is defined by

```{math}
\int h(x,y)\d(\al\otimes\be)(x,y)
=
\int_\Xx
\left(\int_\Yy h(x,y)\d\be(y)\right)
\d\al(x).
```
:::

:::{admonition} Proposition: Product Optimality Is Degenerate
:class: important
Assume that $\Xx$ and $\Yy$ are compact metric spaces and that
$c\in\Cc(\Xx\times\Yy)$. The tensor product $\al\otimes\be$ is optimal for
$\inf_{\pi\in\Couplings(\al,\be)}\int c\d\pi$ if and only if every coupling is
optimal. This is also equivalent to the additive decomposition

```{math}
c(x,y)=u(x)+v(y)
```

on the product support.
:::

:::{dropdown} Proof Sketch
If all couplings are optimal, the product coupling is optimal. Conversely,
assume the product is optimal. If cross differences failed to vanish on the
product support, there would be points $x_0,x_1,y_0,y_1$ such that exchanging
the two target neighborhoods decreases cost. Replacing a small amount of
product mass on the two diagonal rectangles by mass on the crossed rectangles
keeps the same marginals and lowers the cost, a contradiction. Vanishing cross
differences imply
$c(x,y)=c(x,y_\star)+c(x_\star,y)-c(x_\star,y_\star)$ on the support, so the
cost of any coupling depends only on its marginals.
:::

If there exists a map $T:\Xx\to\Yy$ with $T_\sharp\al=\be$, then the Monge map
induces the graph coupling $\pi=(\Id,T)_\sharp\al\in\Couplings(\al,\be)$,
characterized by

```{math}
\int h(x,y)\d\pi(x,y)
=
\int h(x,T(x))\d\al(x).
```

Graph couplings are precisely the Kantorovich representation of deterministic
Monge maps.

### Continuous Kantorovich Problem

The discrete Kantorovich problem becomes, for arbitrary measures,

```{math}
:label: eq-mk-generic-web
\mathcal{L}_c(\al,\be)
\eqdef
\inf_{\pi\in\Couplings(\al,\be)}
\int_{\Xx\times\Yy} c(x,y)\d\pi(x,y).
```

This is an infinite-dimensional linear program over a space of measures.

:::{admonition} Remark: Probabilistic Interpretation
:class: note
The same problem can be written as

```{math}
\mathcal{L}_c(\al,\be)
=
\inf_{X\sim\al,\;Y\sim\be}
\mathbb{E}\,c(X,Y).
```

The minimization is over all possible dependences between the two random
variables, not over the fixed marginal laws.
:::

:::{admonition} Proposition: Existence On Compact Spaces
:class: important
Assume that $\Xx$ and $\Yy$ are compact metric spaces and
$c\in\Cc(\Xx\times\Yy)$. Then the Kantorovich problem admits at least one
minimizer.
:::

:::{dropdown} Proof
The constraint set is nonempty because it contains $\al\otimes\be$. It is
closed for weak convergence because the marginal constraints are preserved.
Since $\Xx\times\Yy$ is compact, probability measures on it are compact for
the weak topology, and $\Couplings(\al,\be)$ is compact. Finally,
$\pi\mapsto\int c\d\pi$ is weakly continuous because $c$ is continuous and
bounded.
:::

On non-compact domains, one needs coercivity and moment conditions. For the
Wasserstein cost $c(x,y)=d(x,y)^p$ on a Polish metric space, the natural domain
is

```{math}
\mathcal P_p(\Xx)
\eqdef
\left\{
\mu\in\Mm_+^1(\Xx):
\int d(x,x_0)^p\d\mu(x)<+\infty
\right\},
```

for one, and hence every, reference point $x_0$.

### Interpolation Induced By A Plan

When $\Xx=\Yy\subset\RR^d$, a transport plan defines an interpolation between
measures by moving every active pair $(x,y)$ along the segment
$(1-t)x+ty$. If $T_t(x,y)=(1-t)x+ty$, then
$\al_t=(T_t)_\sharp\pi$. In the discrete case, each mass $P_{ij}$ moves from
$x_i$ to $y_j$ along its own segment. When the plan is not induced by a map,
one source atom can split into several moving atoms.

```{code-cell} ipython3
:tags: [hide-input]
show_book_figure("kantorovich-plan-interpolation")
```

*McCann interpolation induced by a non-deterministic transport plan. In every
panel, the red and blue endpoint measures are shown with low opacity, thin gray
segments display the support $P_{ij}>\mathrm{tol}$ of the coupling, and the
moving atoms are colored from red to blue along the interpolation.*

The companion panel lets the same coupling be inspected along time $t$, with an
entropy slider to contrast sparse and diffuse plans.

:::{dropdown} Live controls
<iframe class="ot4ml-live-frame" title="Plan interpolation controls" src="../live/kantorovich-plan.html" loading="lazy" style="width:100%;height:470px;border:0;display:block;"></iframe>
:::

### Monge--Kantorovich Equivalence

The proof of Brenier's theorem relies on Kantorovich relaxation and duality.
Under Brenier's hypotheses, the relaxation is tight: it has the same cost as
the Monge problem and the optimal coupling is induced by a map.

:::{admonition} Corollary: Monge--Kantorovich Equivalence Under Brenier
:class: important
Assume that $\al$ is absolutely continuous with respect to Lebesgue measure and
that $c(x,y)=\|x-y\|^2$. If $T$ is the Brenier map solving Monge's problem,
then $\pi=(\Id,T)_\sharp\al$ is the unique optimal coupling solving
Kantorovich's problem. In particular, the Monge and Kantorovich costs are the
same.
:::

:::{dropdown} Proof
The proof of Brenier's theorem shows that the support of any optimal
Kantorovich plan lies in the subdifferential $\partial\phi$ of a convex
function. Since $\al$ has a density, $\phi$ is differentiable
$\al$-almost everywhere, so $\partial\phi(x)=\{\nabla\phi(x)\}$ for
$\al$-almost every $x$. Every optimal coupling is therefore concentrated on the
graph of $T=\nabla\phi$ and equals $(\Id,T)_\sharp\al$.
:::

If $\al$ does not have a density, non-smooth points of $\phi$ can be charged by
$\al$ and mass splitting can occur. For instance, moving $\delta_0$ to
$(\delta_{-1}+\delta_1)/2$ can be represented by a plan concentrated on the
set-valued subdifferential of $\phi(x)=|x|$, but not by a deterministic map.

## Cyclical Monotonicity

Cyclical monotonicity is the local geometric fingerprint of optimality for a
cost $c$. It converts a global minimization problem into finite exchange
inequalities and is the bridge from Kantorovich plans to convex potentials.

:::{admonition} Definition: Support
:class: important
For a Radon measure $\pi$ on $\Xx\times\Yy$,

```{math}
\supp(\pi)
\eqdef
\{(x,y):\pi(U\times V)>0
\text{ for every open }U\ni x,\ V\ni y\}.
```
:::

:::{admonition} Definition: $c$-Cyclical Monotonicity
:class: important
A set $\Gamma\subset\Xx\times\Yy$ is $c$-cyclically monotone if, for every
$k\geq2$, every finite family $(x_i,y_i)_{i=1}^k\subset\Gamma$ and every
permutation $\sigma$ of $\{1,\ldots,k\}$,

```{math}
\sum_{i=1}^k c(x_i,y_i)
\leq
\sum_{i=1}^k c(x_i,y_{\sigma(i)}).
```
:::

It is enough to check cyclic permutations:

```{math}
\sum_{i=1}^k c(x_i,y_i)
\leq
\sum_{i=1}^k c(x_i,y_{i+1}),
\qquad y_{k+1}=y_1.
```

:::{admonition} Theorem: Optimal Plans Are $c$-Cyclically Monotone
:class: important
Assume $c$ is continuous. For any optimal plan $\pi$ solving the Kantorovich
problem, $\supp(\pi)$ is $c$-cyclically monotone.
:::

:::{dropdown} Proof Sketch
Suppose a finite family in $\supp(\pi)$ violates the exchange inequality. By
continuity, the same strict inequality holds in small neighborhoods
$U_i\times V_i$ around the chosen pairs. Remove a small equal amount of mass
from each rectangle, keep its first and second marginal pieces, and reinsert
the mass after permuting the second marginal pieces. The new measure has the
same marginals but strictly smaller cost, contradicting optimality.
:::

If the optimal plan is induced by a map $T$, cyclical monotonicity reads

```{math}
\sum_{i=1}^k c(x_i,T(x_i))
\leq
\sum_{i=1}^k c(x_i,T(x_{i+1})).
```

For $c(x,y)=\frac12\|x-y\|^2$, the two-point case gives

```{math}
\langle T(x)-T(y),x-y\rangle\geq0,
```

so $T$ is a monotone vector field. In one dimension, for
$c(x,y)=|x-y|^p$, this reduces to the classical monotone rearrangement.

## Metric Properties: Wasserstein Distances

OT costs become genuine distances when the ground cost comes from a metric. The
proof relies on a gluing lemma.

:::{admonition} Lemma: Discrete Gluing Lemma
:class: important
Given $a\in\simplex_n$, $b\in\simplex_p$, $c\in\simplex_m$,
$P\in\CouplingsD(a,b)$ and $Q\in\CouplingsD(b,c)$, define

```{math}
R=P\diag(1/b)Q,
\qquad
R_{ik}=\sum_{j:b_j>0}\frac{P_{ij}Q_{jk}}{b_j}.
```

Then $R\in\CouplingsD(a,c)$. It is the first-third marginal of the tensor
coupling

```{math}
S_{ijk}
=
\begin{cases}
P_{ij}Q_{jk}/b_j, & b_j>0,\\
0, & b_j=0.
\end{cases}
```
:::

:::{dropdown} Proof
If $b_j>0$, summing $S_{ijk}$ over $k$ gives
$P_{ij}b_j/b_j=P_{ij}$; if $b_j=0$, the corresponding column of $P$ and row of
$Q$ are zero. The other prescribed marginal is checked in the same way. Summing
over the intermediate index $j$ gives $R$. Its row and column sums are
$a$ and $c$.
:::

```{code-cell} ipython3
:tags: [hide-input]
show_book_figure("kantorovich-discrete-gluing-lemma")
```

*Discrete gluing lemma in matrix form. The first two panels are optimal
one-dimensional couplings through an intermediate marginal. The third panel
shows the induced marginal $R=P\diag(1/b)Q$; it is feasible and is the coupling
used in the triangle-inequality proof.*

The live version changes the resolution of the intermediate marginal, which
controls how mediated the glued source-target plan becomes.

:::{dropdown} Live controls
<iframe class="ot4ml-live-frame" title="Discrete gluing controls" src="../live/kantorovich-gluing.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>
:::

:::{admonition} Proposition: Discrete Wasserstein Distance
:class: important
Let $D$ be a distance matrix on $\{1,\ldots,n\}$ and $p\geq1$. Then

```{math}
W_p(a,b)\eqdef
\left(
\min_{P\in\CouplingsD(a,b)}
\sum_{i,j} D_{ij}^p P_{ij}
\right)^{1/p}
```

defines a distance on $\simplex_n$.
:::

:::{dropdown} Proof
Symmetry follows by transposing couplings. Positivity follows because a zero
cost plan must be supported on the diagonal. For the triangle inequality, take
optimal couplings $P$ from $a$ to $b$ and $Q$ from $b$ to $c$, glue them into
$S$, and use the feasible marginal $R$ from $a$ to $c$. Then Minkowski's
inequality and the ground triangle inequality give

```{math}
W_p(a,c)
\leq
\left(\sum_{i,j,k}(D_{ij}+D_{jk})^pS_{ijk}\right)^{1/p}
\leq
W_p(a,b)+W_p(b,c).
```
:::

:::{admonition} Lemma: Gluing Lemma
:class: important
Let $(\al,\be,\ga)$ be probability measures on Polish spaces. Given
$\pi\in\Couplings(\al,\be)$ and $\xi\in\Couplings(\be,\ga)$, there exists a
measure $\sigma$ on $\Xx\times\Yy\times\Zz$ such that

```{math}
(P_{\Xx,\Yy})_\sharp\sigma=\pi,
\qquad
(P_{\Yy,\Zz})_\sharp\sigma=\xi.
```
:::

:::{dropdown} Proof Sketch
Disintegrate $\pi$ and $\xi$ against their common marginal $\be$, obtaining
conditional laws $\pi_y$ on $\Xx$ and $\xi_y$ on $\Zz$. Define $\sigma$ by the
conditional-product formula

```{math}
\int g(x,y,z)\d\sigma
=
\int_\Yy
\left(\int_\Xx\int_\Zz g(x,y,z)\d\pi_y(x)\d\xi_y(z)\right)
\d\be(y).
```

This is the measure-theoretic version of the discrete formula above.
:::

:::{admonition} Proposition: Wasserstein Distance On Measures
:class: important
Assume $\X=\Y$ and $d$ is a distance on $\X$. For $p\geq1$,

```{math}
:label: eq-defn-wass-dist-web
\Wass_p(\al,\be)
\eqdef
\left(
\inf_{\pi\in\Couplings(\al,\be)}
\int d(x,y)^p\d\pi(x,y)
\right)^{1/p}
```

defines the $p$-Wasserstein distance.
:::

:::{dropdown} Proof
Symmetry is obtained by swapping the coordinates of a coupling. If the value is
zero, an optimal coupling is supported on the diagonal and therefore the two
marginals coincide. For the triangle inequality, glue optimal couplings
$\pi\in\Couplings(\al,\be)$ and $\xi\in\Couplings(\be,\ga)$ into
$\sigma$, project it to a coupling $\rho$ between $\al$ and $\ga$, and apply
the ground triangle inequality plus Minkowski:

```{math}
\Wass_p(\al,\ga)
\leq
\left(\int (d(x,y)+d(y,z))^p\d\sigma(x,y,z)\right)^{1/p}
\leq
\Wass_p(\al,\be)+\Wass_p(\be,\ga).
```
:::

Kantorovich's distance should be contrasted with the directed Monge distance.
The Kantorovich feasible set is never empty, although the cost may be infinite
without moment assumptions. When an optimal Monge map exists, the graph
coupling gives the same value.

## Metric Properties: Topology And Applications

Wasserstein distances metrize weak convergence under moment control, sit
between weak and strong topologies, and provide quantitative estimates in
probability and robust optimization.

:::{admonition} Proposition: Equivalence Of Wasserstein Distances On Compact Spaces
:class: important
On a compact metric space, for $p\leq q$,

```{math}
\Wass_p(\al,\be)
\leq
\Wass_q(\al,\be)
\leq
\diam(\Xx)^{(q-p)/q}\Wass_p(\al,\be)^{p/q}.
```
:::

:::{dropdown} Proof
The left inequality is Jensen's inequality applied to $r\mapsto r^{q/p}$. The
right inequality follows from
$d(x,y)^q\leq\diam(\Xx)^{q-p}d(x,y)^p$.
:::

:::{admonition} Definition: Weak$^*$ Topology
:class: important
A sequence $(\al_k)_k$ converges weakly$^*$ to $\al$ in $\Mm_+^1(\Xx)$ if, for
every bounded continuous function $f$,

```{math}
\int f\d\al_k\longrightarrow\int f\d\al.
```
:::

:::{admonition} Remark: A Riemann-Sum Weak Limit
:class: note
On $\Xx=\RR$,

```{math}
\frac1n\sum_{k=1}^n\delta_{k/n}
\rightharpoonup
\mathcal U_{[0,1]}.
```

This is exactly convergence of Riemann sums. The convergence is weak but not
strong: the empirical measure and the uniform density are mutually singular, so
their total variation distance is $2$.
:::

:::{admonition} Remark: Weak Convergence For Discrete Measures
:class: note
For a single Dirac, $\delta_{x^{(n)}}\rightharpoonup\delta_x$ is equivalent to
$x^{(n)}\to x$. With a fixed number of atoms, convergence of locations and
weights gives weak convergence after relabeling and merging identical limits.
Without a uniform bound on the number of atoms, weak limits of discrete
measures can be continuous; empirical measures are the standard example.
:::

:::{admonition} Remark: Modes Of Convergence For Random Variables
:class: note
If $X_n$ and $X$ live on a common probability space, almost-sure convergence
implies convergence in probability, and convergence in probability implies
convergence in law. Convergence in law is exactly weak convergence of the laws
$(X_n)_\sharp\PP\rightharpoonup X_\sharp\PP$, and does not require all
variables to live on the same probability space.
:::

:::{admonition} Remark: Central Limit Theorem
:class: note
If $(X_1,\ldots,X_n)$ are i.i.d. random vectors with finite second moments,
$\mathbb{E}X_i=0$ and $\mathbb{E}(X_iX_i^\top)=\Id$, then

```{math}
Z_n\eqdef\frac1{\sqrt n}\sum_{i=1}^n X_i
```

converges in law toward $\Gaussian(0,\Id)$.
:::

:::{admonition} Proposition: Total Variation As Wasserstein For The Discrete Metric
:class: important
Let $d$ be the $0/1$ metric, with $d(x,x)=0$ and $d(x,y)=1$ for $x\neq y$.
Then

```{math}
\Wass_p(\al,\be)^p
=
\frac12\|\al-\be\|_{\TV}.
```
:::

:::{dropdown} Proof Sketch
For discrete measures on a common support, set
$c_i=\min(a_i,b_i)$. Any coupling has diagonal mass at most $\sum_i c_i$, so
its off-diagonal cost is at least $1-\sum_i c_i$. This bound is achieved by
putting $c_i$ on the diagonal and coupling the leftover positive and negative
parts by a product plan. Since

```{math}
1-\sum_i c_i
=
\frac12\sum_i |a_i-b_i|,
```

the formula follows.
:::

For Dirac masses,

```{math}
\|\delta_{x_n}-\delta_x\|_{\TV}=2,
\qquad
\Wass_p(\delta_{x_n},\delta_x)=d(x_n,x).
```

Thus the strong topology never sees Diracs converge unless they are eventually
equal, while the Wasserstein topology captures their spatial convergence.

:::{admonition} Proposition: Wasserstein Metrizes Weak Convergence On Compact Spaces
:class: important
If $\Xx$ is compact, then $\al_k\rightharpoonup\al$ if and only if
$\Wass_p(\al_k,\al)\to0$.
:::

:::{dropdown} Proof Sketch
For $p=1$, this is the Kantorovich--Rubinstein metrization theorem: by duality,
$\Wass_1$ is the supremum over $1$-Lipschitz test functions, and on a compact
metric space this class is compact modulo constants by Arzela--Ascoli. The
comparison between $\Wass_p$ distances on compact spaces then gives the result
for all $p\geq1$.
:::

On non-compact spaces, one must also impose convergence of $p$-th moments:
$\Wass_p(\alpha_k,\alpha)\to0$ if and only if
$\alpha_k\rightharpoonup\alpha$ and

```{math}
\int d(x,x_0)^p\d\alpha_k(x)
\to
\int d(x,x_0)^p\d\alpha(x).
```

On a discrete space, weak and strong topologies coincide, and

```{math}
\frac{d_{\min}}{2}\|\al-\be\|_{\TV}
\leq
\Wass_1(\al,\be)
\leq
\frac{d_{\max}}{2}\|\al-\be\|_{\TV}.
```

## Wasserstein Over Wasserstein

The construction can be iterated. Once $(\X,d)$ is a metric space, the set of
probability measures on $\X$ becomes a metric space through $\Wass_p$. It can
therefore serve as a new ground space. This is useful whenever the objects to
compare are themselves random probability measures, or mixtures whose
components are meaningful objects rather than only a collapsed density.

:::{admonition} Proposition: Wasserstein Spaces As Ground Spaces
:class: important
If $(\X,d)$ is a Polish metric space, then $\Pp_p(\X)$ endowed with $\Wass_p$
is Polish. If $\X$ is compact, then $\Pp(\X)$ is compact for the Wasserstein
topology, and the construction can be iterated to form
$\Pp(\Pp(\X))$, $\Pp(\Pp(\Pp(\X)))$, and so on.
:::

:::{dropdown} Proof Sketch
Completeness follows by representing a $\Wass_p$-Cauchy sequence through
almost optimally glued couplings, which gives a Cauchy random sequence whose
law is the desired limit. Separability follows by approximating measures with
finitely supported measures on a countable dense subset and rational weights.
If $\X$ is compact, Prokhorov compactness and Wasserstein metrization of weak
convergence give compactness.
:::

Elements of $\Pp_2(\Pp_2(\X))$ are probability laws over probability measures,
or random probability measures. A parametric example is

```{math}
\mathfrak A=(\zeta\mapsto\alpha_\zeta)_\sharp\gamma.
```

The collapsed mixture associated with $\mathfrak A$ is

```{math}
\int_\X f(x)\d\bar\alpha_{\mathfrak A}(x)
=
\int_{\Pp_2(\X)}
\left(\int_\X f(x)\d\alpha(x)\right)
\d\mathfrak A(\alpha).
```

The Wasserstein distance on the Wasserstein space is

```{math}
\mathbb W_2^2(\mathfrak A,\mathfrak B)
\eqdef
\inf_{\Pi\in\Couplings(\mathfrak A,\mathfrak B)}
\int_{\Pp_2(\X)\times\Pp_2(\X)}
\Wass_2^2(\alpha,\beta)\d\Pi(\alpha,\beta).
```

For Gaussian mixtures, this separates two geometries. A mixture can be viewed
as a collapsed density on $\X$, or as a component law over Gaussian atoms in
the Bures--Wasserstein space. Interpolating at the component level generally
differs from the true $\Wass_2$ interpolation between the collapsed mixture
densities.

```{code-cell} ipython3
:tags: [hide-input]
show_book_figure("kantorovich-wow-mixtures")
```

*Two interpolations between the same three-component one-dimensional Gaussian
mixtures. On the left, components are matched using the Bures--Wasserstein
distance between Gaussians. On the right, the mixtures are collapsed into
ordinary one-dimensional densities and interpolated by the true quantile
formula for $\Wass_2$.*

The live comparison keeps both geometries side by side: component-level
transport moves Gaussian atoms, while collapsed transport rearranges the full
density.

:::{dropdown} Live controls
<iframe class="ot4ml-live-frame" title="Wasserstein-over-Wasserstein controls" src="../live/kantorovich-wow.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>
:::

:::{admonition} Proposition: Collapsing Is Non-Expansive
:class: important
Let $\mathfrak A,\mathfrak B\in\Pp_2(\Pp_2(\X))$, and let
$\bar\alpha_{\mathfrak A}$ and $\bar\beta_{\mathfrak B}$ be the collapsed
mixtures. Then

```{math}
\Wass_2(\bar\alpha_{\mathfrak A},\bar\beta_{\mathfrak B})
\leq
\mathbb W_2(\mathfrak A,\mathfrak B).
```
:::

:::{dropdown} Proof
Fix a coupling $\Pi$ between $\mathfrak A$ and $\mathfrak B$. For each
$(\alpha,\beta)$ choose an almost optimal coupling
$\pi_{\alpha,\beta}\in\Couplings(\alpha,\beta)$. Integrating this Markov
kernel against $\Pi$ gives a coupling between the collapsed mixtures whose cost
is bounded by the $\Pi$-average of $\Wass_2^2(\alpha,\beta)$. Taking infima
proves the claim.
:::

This viewpoint also clarifies lower bounds for Gromov--Wasserstein distances:
a metric-measure space can be mapped to a law of local distance profiles, and
these laws can be compared by Wasserstein-over-Wasserstein.

## Distributional Robustness And Wasserstein Infinity

Wasserstein distances define ambiguity sets around empirical laws. Given
samples $z_i$ and $\hat\alpha_n=\frac1n\sum_i\delta_{z_i}$, a
distributionally robust optimization problem replaces empirical risk by

```{math}
\sup_{\beta:\Wass_p(\beta,\hat\alpha_n)\leq\rho}
\int \ell_\theta(z)\d\beta(z).
```

Under standard upper-semicontinuity and growth assumptions on the loss, one has
the dual reformulation

```{math}
\sup_{\beta:\Wass_p(\beta,\hat\alpha_n)^p\leq\rho^p}
\int \ell_\theta\d\beta
=
\inf_{\lambda\geq0}
\lambda\rho^p
+
\frac1n\sum_{i=1}^n
\sup_z\{\ell_\theta(z)-\lambda d(z,z_i)^p\}.
```

The robust risk is therefore an empirical risk in which each sample is replaced
by its worst penalized perturbation. For $p=1$ and an $L_\theta$-Lipschitz loss,

```{math}
\sup_{\beta:\Wass_1(\beta,\hat\alpha_n)\leq\rho}
\int \ell_\theta\d\beta
\leq
\frac1n\sum_i\ell_\theta(z_i)+\rho L_\theta.
```

:::{admonition} Proposition: Convexity Of Transport Costs
:class: important
For any nonnegative lower-semicontinuous cost $c$, the value

```{math}
(\alpha,\beta)\mapsto\mathcal{L}_c(\alpha,\beta)
```

is jointly convex. In particular, $(\alpha,\beta)\mapsto\Wass_p(\alpha,\beta)^p$
is jointly convex. The distance $\Wass_1$ is jointly convex, but
$\Wass_p$ itself need not be convex for $p>1$.
:::

:::{dropdown} Proof
Let $\pi_0$ and $\pi_1$ be nearly optimal couplings for
$(\alpha_0,\beta_0)$ and $(\alpha_1,\beta_1)$. Then
$(1-t)\pi_0+t\pi_1$ is a coupling between the convex combinations of the
marginals, and its cost is the corresponding convex combination. Taking
infima proves joint convexity. For $p>1$, the root can destroy convexity; on
the line,
$\Wass_p((1-t)\delta_0+t\delta_1,\delta_0)=t^{1/p}$ is concave.
:::

The limiting distance

```{math}
:label: eq-wass-infty-web
\Wass_\infty(\alpha,\beta)
\eqdef
\inf_{\pi\in\Couplings(\alpha,\beta)}
\esssup_{(x,y)\sim\pi} d(x,y)
```

minimizes the worst displacement rather than an average displacement.

:::{admonition} Proposition: $\Wass_\infty$ Robust Envelope Around An Empirical Law
:class: important
Let $(\Zz,d)$ be a Polish metric space. Let
$\hat\alpha=\sum_{i=1}^n a_i\delta_{z_i}$ with $a_i>0$ and
$\sum_i a_i=1$, and assume the closed balls
$\overline B(z_i,\rho)$ are compact. For any real-valued upper-semicontinuous
loss $\ell$,

```{math}
\sup_{\beta:\Wass_\infty(\beta,\hat\alpha)\leq\rho}
\int \ell(z)\d\beta(z)
=
\sum_{i=1}^n a_i
\sup_{z\in\overline B(z_i,\rho)}\ell(z).
```
:::

:::{dropdown} Proof
Any feasible coupling between $\hat\alpha$ and $\beta$ disintegrates as
$\sum_i a_i\delta_{z_i}\otimes\nu_i$, with each $\nu_i$ supported in
$\overline B(z_i,\rho)$. Hence the robust expectation is bounded above by the
displayed sum. The reverse inequality follows by choosing, for each $i$, a
maximizer $z_i^\star\in\overline B(z_i,\rho)$ and taking
$\beta=\sum_i a_i\delta_{z_i^\star}$.
:::

## Theoretical Application: Quantitative Central Limit Theorems

Weak topology says whether laws converge; Wasserstein distances also quantify
how fast. The central limit theorem becomes a rate estimate in $\Wass_1$, which
controls the error of all $1$-Lipschitz observables of the normalized sum.

```{code-cell} ipython3
:tags: [hide-input]
show_book_figure("matching-quantitative-clt")
```

*Central-limit theorem for normalized Bernoulli sums. Starting from
$\alpha_0=\frac12(\delta_{-1}+\delta_1)$, the law of
$Z_n=n^{-1/2}\sum_i X_i$ remains discrete, but its rescaled atom heights
approach the standard Gaussian density shown in gray.*

The live control varies the number of summands and the Bernoulli skew, making
the Wasserstein view of weak convergence visible even while the law remains
discrete.

:::{dropdown} Live controls
<iframe class="ot4ml-live-frame" title="Quantitative CLT controls" src="../live/kantorovich-clt.html" loading="lazy" style="width:100%;height:470px;border:0;display:block;"></iframe>
:::

:::{admonition} Proposition: Berry--Esseen Bound In $\Wass_1$
:class: important
Let $(X_i)_{i=1}^n$ be i.i.d. real random variables with
$\mathbb{E}X_i=0$, $\mathbb{E}X_i^2=1$ and
$\mathbb{E}|X_i|^3<+\infty$. If $\alpha_n$ is the law of
$n^{-1/2}\sum_i X_i$ and $\gamma$ is the standard Gaussian law, then

```{math}
\Wass_1(\alpha_n,\gamma)
\leq
\frac{C\,\mathbb{E}|X_1|^3}{\sqrt n},
```

where $C$ is a universal constant.
:::

:::{dropdown} Proof Sketch
By Kantorovich--Rubinstein duality,

```{math}
\Wass_1(\alpha_n,\gamma)
=
\sup_{\Lip(h)\leq1}
\left|\mathbb{E}h(S_n)-\mathbb{E}h(G)\right|.
```

For each such $h$, solve Stein's equation
$f_h'(x)-xf_h(x)=h(x)-\mathbb{E}h(G)$. The solution has uniform derivative
bounds depending only on the Lipschitz constant of $h$. Expanding by replacing
summands one at a time, the first- and second-order terms cancel because
$\mathbb{E}X_i=0$ and $\mathbb{E}X_i^2=1$. The Taylor remainder is bounded by
$C\sum_i\mathbb{E}|X_i/\sqrt n|^3$, giving the $n^{-1/2}$ rate
{cite:p}`berry1941accuracy,esseen1942liapunoff,chen2011normal,bobkov2018berry,rio2011asymptotic`.
:::
