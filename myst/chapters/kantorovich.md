---
title: Kantorovich Relaxation
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-kantorovich)=

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

(sec-discrete-relaxation)=
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

(def-discrete-couplings)=
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

(rem-small-transportation-polytopes)=
:::{admonition} Remark: Small transportation polytopes
:class: ot4ml-remark

The definition is already informative in the smallest dimensions. If $n=m=1$, mass conservation fixes the only entry, so the feasible set is a singleton. The same happens for $(n,m)=(2,1)$, and by symmetry for $(n,m)=(1,2)$: the unique coupling is forced by its only column, or by its only row.

The first nontrivial case is $(n,m)=(2,2)$. Let $\a=(p,1-p)$ and $\b=(q,1-q)$ with $p,q\in[0,1]$. Once $s\eqdef \P_{1,1}$ is chosen, the marginal constraints force all other entries, hence every coupling has the form

```{math}
\P(s)=
\begin{pmatrix}
s & p-s \\
q-s & 1-p-q+s
\end{pmatrix}.
```

The nonnegativity constraints are exactly

```{math}
s\in\big[\max(0,p+q-1),\min(p,q)\big],
```

so $\CouplingsD(\a,\b)$ is a segment, possibly reduced to a point at the boundary. In general, when all marginal entries are positive, the transportation polytope has affine dimension $(n-1)(m-1)$ before the nonnegativity inequalities cut out its faces.
:::


The first consequence is feasibility. There is always at least one admissible
plan.

(def-discrete-product-coupling)=
:::{admonition} Definition: Discrete Product Coupling
:class: important
Given weights $a\in\simplex_n$ and $b\in\simplex_m$, the discrete product, or
trivial, coupling is

```{math}
(a\otimes b)_{ij}\eqdef a_i b_j.
```

It belongs to $\CouplingsD(a,b)$ and corresponds to choosing source and target
labels independently.
:::

The feasible set is a bounded intersection of an affine space with the
nonnegative orthant, hence a convex polytope. In one dimension, the coupling
can be read as a matrix: rows index source bins, columns index target bins, and
the marginal constraints appear as prescribed row and column sums.

(prop-discrete-product-coupling-degenerate)=
:::{admonition} Proposition: Discrete Product Optimality Is Degenerate
:class: important
Assume that all zero-mass rows and columns have been removed, so that
$a_i>0$ and $b_j>0$, and let $C$ be a finite cost matrix. The product plan
$a\otimes b$ minimizes $P\mapsto\langle C,P\rangle$ over
$\CouplingsD(a,b)$ if and only if every coupling
$P\in\CouplingsD(a,b)$ minimizes it.
:::

:::{dropdown} Proof
The reverse implication is immediate. Conversely, assume that $a\otimes b$ is
optimal and let $Q\in\CouplingsD(a,b)$ be arbitrary. Since all entries of
$a\otimes b$ are positive, there exists $t>0$ small enough that

```{math}
R\eqdef(1+t)(a\otimes b)-tQ
```

is nonnegative. It still has row sums $a$ and column sums $b$, so
$R\in\CouplingsD(a,b)$. Also

```{math}
a\otimes b=\frac{1}{1+t}R+\frac{t}{1+t}Q.
```

Taking scalar products with $C$, the optimality of $a\otimes b$ forces both
$R$ and $Q$ to have the same cost as $a\otimes b$. Since $Q$ was arbitrary, all
couplings are optimal.
:::

Thus the product plan is mainly a feasibility witness. Except when the linear
cost is constant on the whole transportation polytope, it is not expected to
solve optimal transport.

(fig:kantorovich-coupling-polylines)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("kantorovich-coupling-polylines")
```

*Discrete couplings represented as straight transport segments. The
deterministic graph is a feasible Monge-type plan, the product plan spreads
every source mass over all targets, and the optimal Kantorovich plan minimizes
the quadratic transport cost. Line width and opacity encode transported mass.*
:::

The interactive demo below separates the main feasible-plan archetypes: deterministic
graphs, independent product couplings, sparse splitting plans, and entropic
approximations.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the point and mass sliders to see how a Kantorovich plan can split mass into several weighted links rather than choosing one destination per source.
:::

<iframe class="ot4ml-live-frame" title="Kantorovich coupling controls" src="../live/kantorovich-couplings.html" loading="lazy" style="width:100%;height:470px;border:0;display:block;"></iframe>

(fig:kantorovich-coupling-matrix-marginals)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("kantorovich-coupling-matrix-marginals")
```

*Coupling matrices with their prescribed marginals. The central grayscale image
displays $P_{ij}$; the red curve on the left is the source marginal $a$, and
the blue curve on top is the target marginal $b$. The independent product plan
is diffuse, whereas the one-dimensional optimal plan concentrates near the
monotone quantile correspondence.*
:::

The companion control varies the bin count and the endpoint laws, making the
transition from diffuse independence to monotone transport visually explicit.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the problem-size and mass-shape controls to compare the coupling matrix with its red and blue marginal sums.
:::

<iframe class="ot4ml-live-frame" title="Coupling matrix controls" src="../live/kantorovich-matrix.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

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

(fig:kantorovich-permutation-versus-splitting)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("kantorovich-permutation-versus-splitting")
```

*From permutation matrices to splitting couplings. When the two empirical
measures have the same number of atoms and uniform weights, an optimal plan can
be a permutation matrix. Once target masses are nonuniform, one source can send
mass to several targets and several sources can merge into the same target.*
:::

The interactive demo keeps the same source and target sites while changing the target
mass imbalance, so the moment where permutation structure breaks becomes
visible.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the split-mass and geometry controls to contrast deterministic permutation-like transport with plans that divide source mass across targets.
:::

<iframe class="ot4ml-live-frame" title="Splitting coupling controls" src="../live/kantorovich-splitting.html" loading="lazy" style="width:100%;height:470px;border:0;display:block;"></iframe>

(prop-sparse-optimal-plans)=
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

(prop-northwest-corner)=
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
All assignments are nonnegative. At each step, the mass placed in entry $(i,j)$
is subtracted from exactly one current row residual and one current column
residual, so no row or column can receive more mass than prescribed. Conversely,
an index is advanced only when its residual has been fully filled. When the
algorithm stops, the total assigned mass is $\sum_i a_i=\sum_j b_j$, hence all
row and column sums are exactly $a$ and $b$.

Each positive assignment exhausts at least one current row or one current
column. Before the final assignment, at most $n-1$ row advances and $m-1$ column
advances can occur without terminating the construction. Hence the number of
positive entries is at most $(n-1)+(m-1)+1=n+m-1$. For acyclicity, view the
positive support as a bipartite graph. Once a row or column index is advanced,
it never appears again, so each new positive edge either starts a new component
or attaches at least one new vertex to the component currently being swept. No
edge is ever added between two old vertices of the same component, so no cycle
can be created.
:::

(alg-north-west-corner)=
:::{admonition} Algorithm: North-west corner coupling
:class: ot4ml-algorithm

**Input:** Source weights $\a\in\simplex_n$ and target weights $\b\in\simplex_m$.

**Output:** Sparse feasible coupling $\P\in\CouplingsD(\a,\b)$.

**Initialize:** Set $\P=0$, $r=\a$, $s=\b$, and $(i,j)=(1,1)$.

**While** $i\leq n$ and $j\leq m$ **do**:

> $\eta=\min(r_i,s_j), \qquad \P_{ij}\leftarrow \eta.$
>
> **Update residuals:**
> $r_i\leftarrow r_i-\eta, \qquad s_j\leftarrow s_j-\eta.$
>
> **If** $r_i=0$ **then**:

>>
>> **Set** $i\leftarrow i+1$.
>>

> **If** $s_j=0$ **then**:

>>
>> **Set** $j\leftarrow j+1$.
>>

**Return** $\P$.
:::


The north-west corner rule, summarized in Algorithm
{ref}`alg-north-west-corner`, does not use the cost matrix and is therefore not
meant to solve the discrete Kantorovich problem. Its role is algorithmic: an
acyclic support corresponds to linearly independent marginal constraints. When
the support has fewer than $n+m-1$ positive entries, transportation simplex
implementations complete it with zero-mass basic variables to obtain a
degenerate basic feasible solution. This gives a cheap initialization for the
pivoting methods discussed in Section {ref}`sec-kantorovich-lp-algorithms`.

### One-Dimensional Cases

In one dimension, the transportation polytope has a canonical monotone
optimizer. This is the weighted version of the sorting rule from the matching
chapter.

(prop-1d-weighted-sweep)=
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
$(i,j)$ and $(i',j')$ to $(i,j')$ and $(i',j)$. The two marginals are
unchanged, and convexity of $h$ gives

```{math}
h(x_i-y_j)+h(x_{i'}-y_{j'})
\geq
h(x_i-y_{j'})+h(x_{i'}-y_j)
```

for $i<i'$ and $j'<j$, with strict inequality for strictly convex $h$ and
distinct points. Repeating this uncrossing procedure until no crossing remains
yields a monotone optimal plan. There is only one monotone feasible plan with
the prescribed sorted marginals, namely the sweep plan: it pairs the leftmost
remaining source mass with the leftmost remaining target mass at every step.
Sorting costs $O(n\log n+m\log m)$ and the sweep uses at most $n+m-1$
assignments.
:::

(alg-weighted-one-dimensional-sweep)=
:::{admonition} Algorithm: Weighted one-dimensional sweep
:class: ot4ml-algorithm

**Input:** One-dimensional atoms $(x_i,\a_i)$ and $(y_j,\b_j)$; convex cost $h(x-y)$.

**Output:** Monotone optimal coupling $\P$.

**Sort** atoms:
$x_1\leq\cdots\leq x_n, \qquad y_1\leq\cdots\leq y_m.$

**Set** $\P$ to the output of Algorithm {ref}`alg-north-west-corner` applied to the sorted weights $(\a_i)_i$ and $(\b_j)_j$.
**Return** $\P$.
:::


(def-permutation-matrices)=
### Permutation Matrices As Couplings

Now assume $n=m$ and uniform weights $a=b=\mathbf{1}_n/n$. In this case, a
matching can be encoded as a matrix with exactly one active entry per row and
per column.

:::{admonition} Definition: Permutation Matrices
:class: important
For a permutation $\sigma\in\Perm(n)$, its permutation matrix $P_\sigma$ is

```{math}
(P_\sigma)_{i,j}
=
\begin{cases}
1 & \text{if } j=\sigma(i),\\
0 & \text{otherwise}.
\end{cases}
```

The set of all permutation matrices is

```{math}
\mathcal P_n^{\mathrm{perm}}
\eqdef
\left\{
P_\sigma:\sigma\in\Perm(n)
\right\}.
```
:::

The corresponding probability coupling is $P_\sigma/n$. If the matching cost
matrix is $C$, then

```{math}
\langle C,P_\sigma/n\rangle
=
\frac1n\sum_{i=1}^n C_{i,\sigma(i)}.
```

Thus the assignment problem is the minimization of a linear function over the
discrete, non-convex set of permutation matrices. The convex relaxation
replaces this finite set by all bistochastic matrices.

(def-birkhoff-polytope)=
:::{admonition} Definition: Birkhoff Polytope
:class: important
The Birkhoff polytope is the convex set of bistochastic matrices

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
:::

(def-extreme-points)=
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

(prop-extreme-point-existence)=
:::{admonition} Proposition: Existence of Extreme Points
:class: important
If $\mathcal C$ is a nonempty compact convex subset of a finite-dimensional
vector space, then $\Extr(\mathcal C)$ is nonempty.
:::

:::{dropdown} Proof
Among all nonempty faces of $\mathcal C$, choose one of minimal affine
dimension. If this face contained two distinct points, maximizing a linear
functional that is not constant on the face would produce a nonempty proper
exposed subface, contradicting minimality. Hence the minimal face is a
singleton, and its point is extreme.
:::

:::{admonition} Example: Unbounded convex sets may have no extreme point
:class: ot4ml-example

Compactness cannot be dropped from Proposition {ref}`prop-extreme-point-existence`. For instance, the closed convex set $\enscond{(x,y)\in\RR_+^2}{xy\geq1}$ is unbounded and has no extreme point.
:::


(prop-linear-program-extreme-minimizer)=
:::{admonition} Proposition: Linear Programs Have Extreme Minimizers
:class: important
Let $\mathcal C$ be nonempty and compact. For every linear form $\ell$,

```{math}
\Extr(\mathcal C)\cap\argmin_{x\in\mathcal C}\ell(x)\neq\emptyset.
```
:::

:::{dropdown} Proof
The set $S=\argmin_{x\in\mathcal C}\ell(x)$ is nonempty, compact and convex.
By Proposition {ref}`prop-extreme-point-existence`, it has an extreme point
$x$. If $x=(y+z)/2$ with $y,z\in\mathcal C$, then by linearity and optimality
of $x$, both $y$ and $z$ also minimize $\ell$ on $\mathcal C$, hence
$y,z\in S$. Since $x$ is extreme in $S$, $y=z=x$. Thus $x$ is extreme in
$\mathcal C$.
:::

(thm-birkhoff-von-neumann)=
:::{admonition} Theorem: Birkhoff--von Neumann
:class: important
The extreme points of $\mathcal B_n$ are exactly the permutation matrices.
:::

Figure {ref}`fig:birkhoff-von-neumann-cycle` shows the non-extreme mechanism
used in the proof below. The displayed matrix is bistochastic but not a
permutation matrix: the unit entries already behave like isolated matching
edges, while the fractional support contains a minimal alternating cycle.

(fig:birkhoff-von-neumann-cycle)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("birkhoff-von-neumann-cycle")
```

*Cycle certificate in the Birkhoff--von Neumann proof. The left panel is a
$7\times7$ bistochastic matrix which is not a permutation matrix. The right
panel shows its bipartite positive-support graph, with the column nodes sorted
as $j_1,\ldots,j_7$ from top to bottom to match the matrix order: red nodes are
rows, blue nodes are columns, thin purple edges
correspond to $0<P_{ij}<1$, and bold black edges correspond to isolated entries
$P_{ij}=1$. The orange halo marks the longer alternating fractional cycle along
which one can add and subtract mass while preserving all row and column sums.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Move mass around the alternating cycle and observe that
all row and column sums remain unchanged.
:::

<iframe class="ot4ml-live-frame" title="Birkhoff cycle certificate controls" src="../live/kantorovich-birkhoff.html" loading="lazy" style="width:100%;height:470px;border:0;display:block;"></iframe>

:::{dropdown} Proof
We first prove that permutation matrices are extreme. Let
$P_\sigma\in\mathcal P_n^{\mathrm{perm}}$ and assume that

```{math}
P_\sigma=\frac{Q+R}{2}
\qquad\text{with}\qquad
Q,R\in\mathcal B_n .
```

Every bistochastic matrix has entries in $[0,1]$. Since the only extreme
points of $[0,1]$ are $0$ and $1$, each entry of $P_\sigma$ fixes the
corresponding entries of $Q$ and $R$: if $(P_\sigma)_{ij}=0$, then
$Q_{ij}=R_{ij}=0$, while if $(P_\sigma)_{ij}=1$, then $Q_{ij}=R_{ij}=1$.
Hence $Q=R=P_\sigma$, so $P_\sigma$ is extreme.

We now prove the converse by contrapositive. Pick
$P\in\mathcal B_n\setminus\mathcal P_n^{\mathrm{perm}}$. Since an integral
bistochastic matrix is necessarily a permutation matrix, $P$ has at least one
fractional entry. We shall split $P=(Q+R)/2$ with
$Q,R\in\mathcal B_n$ and $Q\neq R$, proving that $P$ is not extreme.

Associate with $P$ the bipartite graph whose left vertices are the rows, whose
right vertices are the columns, and whose edges are the fractional entries
$0<P_{ij}<1$. An entry equal to $1$ uses the whole mass of its row and column,
so it is isolated in the positive support and does not appear in this fractional
graph. If a left vertex is incident to one fractional edge, then it must be
incident to at least one other fractional edge: after the first fractional
contribution, the row still has positive remaining mass, and that remainder
cannot be carried by an entry equal to $1$. The same argument applies to
columns. Thus every non-isolated vertex of the fractional graph has degree at
least two.

Starting from any fractional edge, one may therefore walk through adjacent
fractional edges without immediately backtracking and without getting stuck.
Since the graph is finite, some vertex is eventually visited twice; the portion
of the walk between the two visits contains a cycle. Choose a shortest such
cycle and write it in alternating form

```{math}
(i_1,j_1,i_2,j_2,\ldots,i_p,j_p),
\qquad i_{p+1}=i_1,
```

where both $(i_s,j_s)$ and $(i_{s+1},j_s)$ are fractional for every $s$. Define

```{math}
\epsilon
\eqdef
\min_{1\leq s\leq p}
\{
P_{i_s,j_s},
P_{i_{s+1},j_s},
1-P_{i_s,j_s},
1-P_{i_{s+1},j_s}
\}>0,
```

and split the cycle edges into the alternating families

```{math}
A=\{(i_s,j_s)\}_{s=1}^p,
\qquad
B=\{(i_{s+1},j_s)\}_{s=1}^p .
```

Set $Q=P$ and $R=P$ outside $A\cup B$; on $A$, set
$Q_{ij}=P_{ij}+\epsilon/2$ and $R_{ij}=P_{ij}-\epsilon/2$; on $B$, set
$Q_{ij}=P_{ij}-\epsilon/2$ and $R_{ij}=P_{ij}+\epsilon/2$. By the definition of
$\epsilon$, all modified entries stay in $[0,1]$. Each row and column of the
cycle sees one $+\epsilon/2$ and one $-\epsilon/2$, so the row and column sums
remain one. Thus $Q,R\in\mathcal B_n$, $Q\neq R$, and $P=(Q+R)/2$. Hence $P$
is not extreme. Consequently every extreme point of $\mathcal B_n$ is integral,
and every integral bistochastic matrix is a permutation matrix.
:::

The same combinatorial idea gives the constructive decomposition used to
express a bistochastic matrix as a convex combination of permutations.

(alg-birkhoff-von-neumann-decomposition)=
:::{admonition} Algorithm: Birkhoff--von Neumann decomposition
:class: ot4ml-algorithm

**Input:** Bistochastic matrix $P\in\mathcal B_n$.

**Output:** Decomposition $P=\sum_r\lambda_rP_{\sigma_r}$.

**Initialize:** Set $R=P$ and $\mathcal L=\emptyset$.

**While** $R\neq0$ **do**:

>
> **Build** bipartite graph $G_R=\{(i,j):R_{ij}>0\}$.
>
> **Set** $\sigma$ to the lexicographically first perfect matching of $G_R$.
>
> **Set**
> $\lambda=\min_i R_{i,\sigma(i)}.$
>
> **Append** $(\lambda,\sigma)$ to $\mathcal L$.
>
> **Update**
> $R\leftarrow R-\lambda P_\sigma .$

**Return** $P=\sum_{(\lambda_r,\sigma_r)\in\mathcal L}\lambda_rP_{\sigma_r}, \qquad \sum_r\lambda_r=1.$
:::


(cor-kantorovich-matching)=
:::{admonition} Corollary: Kantorovich For Matching
:class: important
If $m=n$ and $\a=\b=\ones_n/n$, then the discrete Kantorovich problem admits an
optimal solution of the form $P_\sigma/n$. The associated permutation $\sigma$
solves the assignment problem.
:::

:::{dropdown} Proof
The feasible set is $\mathcal B_n/n$. By Proposition
{ref}`prop-linear-program-extreme-minimizer`, the linear objective has an
optimal extreme point. Since scaling preserves extreme points and Theorem
{ref}`thm-birkhoff-von-neumann` identifies the extreme points of
$\mathcal B_n$, this optimizer is $P_\sigma/n$ for some permutation $\sigma$.
Its cost is exactly $n^{-1}\sum_i C_{i,\sigma(i)}$, so $\sigma$ is an optimal
assignment.
:::

Equivalently, for uniform empirical measures, one can always choose a
permutation matrix among the minimizers of the relaxed Kantorovich problem: the
relaxation is tight for assignment problems.

:::{admonition} Remark: General discrete case
:class: ot4ml-remark

For general input measures, one does not have equivalence between Monge and Kantorovich problems, since the Monge constraint can be empty. In finite dimension, however, the support of an optimal coupling still enjoys strong sparsity: one can choose an optimal basic feasible plan whose bipartite support is cycle-free, hence with at most $n+m-1$ nonzero entries. Figure {ref}`fig:kantorovich-permutation-versus-splitting` illustrates the difference between the tight uniform matching case and the genuinely splitting nonuniform case.
:::


(sec-kantorovich-lp-algorithms)=
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

(fig:kantorovich-log-barrier-lp-geometry)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("kantorovich-log-barrier-lp-geometry")
```

*Logarithmic-barrier central path for a triangular slice of a linear program.
Large $\epsilon$ selects a central interior point; decreasing $\epsilon$ moves
the minimizer toward the optimal vertex while never touching the boundary. This
differs from entropic OT, where the entropy temperature is part of the
regularized objective itself.*
:::

The interactive view exposes the barrier parameter directly: lowering $\epsilon$
slides the minimizer from the center of the feasible triangle toward the LP
vertex.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the barrier and angle controls to move along the interior central path of the transport polytope.
:::

<iframe class="ot4ml-live-frame" title="Log barrier central path controls" src="../live/kantorovich-barrier.html" loading="lazy" style="width:100%;height:460px;border:0;display:block;"></iframe>

Both interior-point methods and Sinkhorn keep iterates positive, but they use
positivity differently. Interior-point algorithms solve the original LP by
decreasing a barrier parameter. Sinkhorn fixes an entropic temperature and
solves a different, KL-regularized OT problem by alternating diagonal scalings.

(sec-kantorovich-continuous)=
## Relaxation For Arbitrary Measures

This section lifts the finite-dimensional coupling matrix to a joint
probability measure. The payoff is that existence, duality and metric
properties can be stated for arbitrary laws, including discrete, singular and
continuous distributions.

### Continuous Couplings

(def-joint-marginals)=
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

(def-continuous-couplings)=
:::{admonition} Definition: Couplings
:class: important
Given $\al\in\Mm_+^1(\Xx)$ and $\be\in\Mm_+^1(\Yy)$, the set of couplings
between $\al$ and $\be$ is

```{math}
:label: eq-coupling-generic
\Couplings(\al,\be)
\eqdef
\{\pi\in\Mm_+^1(\Xx\times\Yy):\pi_1=\al,\ \pi_2=\be\}.
```

This is the continuous analogue of the transportation polytope.
:::

:::{admonition} Remark: Probabilistic interpretation of couplings
:class: ot4ml-remark

If $X\sim\al$ and $Y\sim\be$, then $\pi\in\Couplings(\al,\be)$ means that $\pi$ is the law of a pair $(X,Y)$ whose coordinates have laws $\al$ and $\be$. The coupling encodes the dependence between $X$ and $Y$. The tensor product $\al\otimes\be$ corresponds to independence, whereas a graph coupling $(\Id,T)_\sharp\al$ corresponds to the deterministic relation $Y=T(X)$.

In the discrete case, when $\al=\sum_i \a_i\de_{x_i}$ and $\be=\sum_j \b_j\de_{y_j}$, the constraint $\pi_1=\al$ and $\pi_2=\be$ forces every coupling to have the form $\pi=\sum_{i,j}\P_{ij}\de_{(x_i,y_j)}$ with $\P\in\CouplingsD(\a,\b)$. The discrete formulation is therefore a special case of the continuous one, not merely an approximation.
:::


Unlike the Monge constraint, the coupling constraint is never empty. The
continuous feasibility witness is the tensor product coupling.

(def-tensor-product-coupling)=
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

The next result echoes Proposition
{ref}`prop-discrete-product-coupling-degenerate` in the continuous setting. In
both cases, the independent coupling is optimal precisely when the objective is
flat over the whole admissible set; for continuous costs, this flatness is
equivalently the additive form $c(x,y)=u(x)+v(y)$ on the product support.

(prop-product-coupling-degenerate)=
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
:label: eq-mk-generic
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

(prop-kantorovich-existence-compact)=
:::{admonition} Proposition: Existence On Compact Spaces
:class: important
Assume that $\Xx$ and $\Yy$ are compact metric spaces and
$c\in\Cc(\Xx\times\Yy)$. Then the Kantorovich problem admits at least one
minimizer.
:::

:::{dropdown} Proof
The constraint set is nonempty because it contains $\al\otimes\be$. It is
closed for weak convergence because the marginal constraints are preserved. Let
$\Omega\eqdef\Xx\times\Yy$. Since $\Omega$ is compact, Proposition
{ref}`prop-wasserstein-space-polish` gives compactness of $\Pp(\Omega)$ for the
Wasserstein topology. On compact spaces this topology is the weak topology by
Proposition {ref}`prop-wass-metrizes-weak-compact`; hence
$\Couplings(\al,\be)$ is compact. Finally, $\pi\mapsto\int c\d\pi$ is weakly
continuous because $c$ is continuous and bounded.
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

### Monge--Kantorovich Equivalence

The proof of Brenier's theorem relies on Kantorovich relaxation and duality.
Under Brenier's hypotheses, the relaxation is tight: it has the same cost as
the Monge problem and the optimal coupling is induced by a map.

(cor-monge-kantorovich-brenier)=
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

:::{admonition} Remark: Probabilistic interpretation of Kantorovich's problem
:class: ot4ml-remark

The same problem can be written as

```{math}
\MK_c(\al,\be)
=
\inf_{X\sim\al,\,Y\sim\be}\EE(c(X,Y)).
```

The minimization is not over the marginal laws, which are fixed, but over all possible dependences between the two random variables. OT therefore chooses the cheapest joint law among all couplings.
:::


:::{admonition} Remark: Nonsmooth potentials and splitting
:class: ot4ml-remark

If $\al$ does not have a density, then $\phi$ may be non-smooth on a set charged by $\al$, and non-smooth points can lead to mass splitting. For instance, moving $\delta_0$ to $(\delta_{-1}+\delta_{+1})/2$ can be represented by a plan concentrated on the set-valued subdifferential of $\phi(x)=|x|$, but not by a deterministic map. This is the continuous counterpart of the gap between the uniform matching case of Corollary {ref}`cor-kantorovich-matching` and the general splitting case.
:::


:::{admonition} Remark: Probabilistic form of tightness
:class: ot4ml-remark

If $(X,Y)$ has the optimal Kantorovich law under the assumptions of Corollary {ref}`cor-monge-kantorovich-brenier`, then $Y=T(X)$ almost surely with $X\sim\al$ and $T(X)\sim\be$. This is analogous to the Birkhoff--von Neumann result in the fully discrete uniform case: in both settings, the convex relaxation admits an optimizer satisfying the original deterministic constraint. The hypotheses are quite different, however: Birkhoff--von Neumann is finite-dimensional and need not give uniqueness, whereas Brenier's theorem uses absolute continuity of the source and gives uniqueness of the optimal map almost everywhere.
:::

(rem-kantorovich-book-shifting)=
:::{admonition} Remark: Book-shifting as a flat Kantorovich face
:class: ot4ml-remark

The Monge book-shifting example in Example {ref}`ex-monge-book-shifting-w1` has a transparent coupling interpretation. Let $\al$ be uniform on $[0,2]$ and $\be$ uniform on $[1,3]$. For every $\pi\in\Couplings(\al,\be)$,

```{math}
\int |y-x|\d\pi(x,y)
\geq
\int (y-x)\d\pi(x,y)
=
\int y\d\be(y)-\int x\d\al(x)
=1.
```

Equality holds exactly for couplings concentrated on the half-plane $\{(x,y):y\geq x\}$, where $|y-x|=y-x$. Hence the optimal set is a whole face of the coupling polytope, not a single graph. The translation and book-shifting maps give two graph couplings inside this face, but many non-deterministic couplings are optimal as well.
:::


## Cyclical Monotonicity

Cyclical monotonicity is the local geometric fingerprint of optimality for a
cost $c$. It converts a global minimization problem into finite exchange
inequalities and is the bridge from Kantorovich plans to convex potentials.

### Support and $c$-Cyclical Monotonicity

To formalize the finite-exchange condition, one needs a precise notion of support, namely the closed set that carries the mass of the coupling.

(def-support)=
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

(def:ccm)=
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

### Optimal Matching to Optimal Transport

For uniform marginals on the same number of atoms, Corollary {ref}`cor-kantorovich-matching` gives an optimal permutation plan. Its support must be $c$-cyclically monotone: otherwise exchanging finitely many targets along a violating cycle would lower the matching cost. The next theorem says that the same finite-exchange certificate holds for arbitrary optimal plans.

(thm:opt_ccm)=
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

### Monotonicity

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

so $T$ is a monotone vector field.

### One Dimension

In one dimension, for $c(x,y)=|x-y|^p$, cyclical monotonicity reduces to the classical monotone rearrangement: if $x<y$, then an optimal map satisfies $T(x)\leq T(y)$.

## Metric Properties: Wasserstein Distances

OT costs become genuine distances when the ground cost comes from a metric. The
proof relies on a gluing lemma.

### OT Defines a Distance

The discrete gluing lemma is the finite-dimensional mechanism behind the triangle inequality.

(lem-gluing-discr)=
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

(fig:kantorovich-discrete-gluing-lemma)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("kantorovich-discrete-gluing-lemma")
```

*Discrete gluing lemma in matrix form. The first two panels are optimal
one-dimensional couplings through an intermediate marginal. The third panel
shows the induced marginal $R=P\diag(1/b)Q$; it is feasible and is the coupling
used in the triangle-inequality proof.*
:::

The interactive version changes the resolution of the intermediate marginal, which
controls how mediated the glued source-target plan becomes.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the mediation slider to inspect how two couplings through an intermediate marginal glue into a source-target plan.
:::

<iframe class="ot4ml-live-frame" title="Discrete gluing controls" src="../live/kantorovich-gluing.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

(def-discrete-wasserstein-distance)=
:::{admonition} Definition: Discrete Wasserstein Distance
:class: important
Let $D$ be a distance matrix on $\{1,\ldots,n\}$ and $p\geq1$. The discrete
$p$-Wasserstein distance between histograms is

```{math}
:label: eq-wass-p-disc
W_p(a,b)\eqdef
\left(
\min_{P\in\CouplingsD(a,b)}
\sum_{i,j} D_{ij}^p P_{ij}
\right)^{1/p}
```

It depends on the chosen ground distance $D$.
:::

(prop-metric-histo)=
:::{admonition} Proposition: Metric Property Of Discrete Wasserstein Distance
:class: important
For every distance matrix $D$ on $\{1,\ldots,n\}$, Definition
{ref}`def-discrete-wasserstein-distance` defines a distance on $\simplex_n$:
$W_p$ is symmetric, positive, $W_p(a,b)=0$ if and only if $a=b$, and it
satisfies the triangle inequality.
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

### Continuous Gluing

The same construction extends to probability measures by disintegrating both couplings with respect to their common marginal.

(lem-gluing-general)=
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

(def-wasserstein-distance)=
:::{admonition} Definition: Wasserstein Distance
:class: important
Let $(\X,d)$ be a metric space and $p\geq1$. For
$\al,\be\in\Pp_p(\X)$, the $p$-Wasserstein distance is

```{math}
:label: eq-defn-wass-dist
\Wass_p(\al,\be)
\eqdef
\left(
\inf_{\pi\in\Couplings(\al,\be)}
\int d(x,y)^p\d\pi(x,y)
\right)^{1/p}
```

It depends on the ground distance $d$.
:::

(prop-metric-measure)=
:::{admonition} Proposition: Metric Property Of The Wasserstein Distance
:class: important
Definition {ref}`def-wasserstein-distance` defines a distance: $\Wass_p$ is
symmetric, positive, $\Wass_p(\al,\be)=0$ if and only if $\al=\be$, and it
satisfies the triangle inequality

```{math}
\forall(\al,\be,\ga)\in\Pp_p(\X)^3,
\qquad
\Wass_p(\al,\ga)
\leq
\Wass_p(\al,\be)+\Wass_p(\be,\ga).
```
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

(def-w2-geodesic-induced-by-plan)=
### Interpolation Induced By A Plan

The quadratic Wasserstein distance does not only compare two endpoint
measures. An optimal plan also says how to move mass between them: each active
pair $(x,y)$ travels along the segment joining $x$ to $y$. This turns an
optimal coupling into a curve of measures.

:::{admonition} Definition: $\Wass_2$ Geodesic Induced By An Optimal Plan
:class: important
Let $\al_0,\al_1\in\Pp_2(\RR^d)$, and let
$\pi^\star\in\Couplings(\al_0,\al_1)$ be optimal for
$\Wass_2^2(\al_0,\al_1)$. For $t\in[0,1]$, define

```{math}
e_t(x,y)\eqdef(1-t)x+t y,
\qquad
\al_t\eqdef(e_t)_\sharp\pi^\star.
```

The curve $(\al_t)_{t\in[0,1]}$ is the displacement, or McCann, $\Wass_2$
geodesic induced by $\pi^\star$.
:::

In the discrete case, each mass $P_{ij}$ moves from $x_i$ to $y_j$ along its
own segment. When the optimal plan is not induced by a map, one source atom can
split into several moving atoms. If the optimal plan is not unique, different
optimal plans may also induce different $\Wass_2$ geodesics.

(alg-plan-displacement-interpolation)=
:::{admonition} Algorithm: Displacement interpolation from a transport plan
:class: ot4ml-algorithm

**Input:** Measures $\alpha,\beta$ on $\RR^d$, time $t\in[0,1]$.

**Output:** Displacement interpolant $\alpha_t$.

**Let** $\pi^\star$ be any minimizer of the quadratic Kantorovich problem.

**Set** interpolation map:
$e_t(x,y)=(1-t)x+t y.$

**Push forward:**
$\al_t=(e_t)_\sharp\pi^\star.$

**If** $\pi^\star=\sum_{i,j}P^\star_{ij}\delta_{(x_i,y_j)}$ **then**:

>
> **Compute**
> $\al_t= \sum_{i,j}P^\star_{ij} \delta_{(1-t)x_i+t y_j}.$

**Return** $\alpha_t$.
:::


(prop-plan-interpolation-w2-geodesic)=
:::{admonition} Proposition: Optimal-Plan Interpolation Is A $\Wass_2$ Geodesic
:class: important
Let $(\al_t)_{t\in[0,1]}$ be defined by Definition
{ref}`def-w2-geodesic-induced-by-plan`. Then, for every
$0\leq s\leq t\leq1$,

```{math}
\Wass_2(\al_s,\al_t)
=
(t-s)\Wass_2(\al_0,\al_1).
```

Thus $t\mapsto\al_t$ is a constant-speed geodesic for the metric $\Wass_2$.
:::

:::{dropdown} Proof
Push the optimal plan $\pi^\star$ forward by $(e_s,e_t)$. This gives a
coupling $\gamma_{s,t}\in\Couplings(\al_s,\al_t)$, and

```{math}
\int \norm{z-z'}^2\d\gamma_{s,t}(z,z')
=
\int \norm{e_t(x,y)-e_s(x,y)}^2\d\pi^\star(x,y)
=
(t-s)^2\Wass_2^2(\al_0,\al_1).
```

Hence $\Wass_2(\al_s,\al_t)\leq(t-s)\Wass_2(\al_0,\al_1)$. Applying this upper
bound to the three pairs $(0,s)$, $(s,t)$ and $(t,1)$, and using the triangle
inequality of Proposition {ref}`prop-metric-measure`, gives

```{math}
\Wass_2(\al_0,\al_1)
\leq
\Wass_2(\al_0,\al_s)+\Wass_2(\al_s,\al_t)+\Wass_2(\al_t,\al_1)
\leq
\Wass_2(\al_0,\al_1).
```

All inequalities are therefore equalities, in particular the middle segment
has the claimed length.
:::

(fig:kantorovich-plan-interpolation)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("kantorovich-plan-interpolation")
```

*McCann interpolation induced by a non-deterministic optimal transport plan. In
every panel, the red and blue endpoint measures are shown with low opacity,
thin gray segments display the support $P_{ij}>\mathrm{tol}$ of the coupling,
and the moving atoms are colored from red to blue along the interpolation.*
:::

The companion panel lets the same coupling be inspected along time $t$, with an
entropy slider to contrast sparse and diffuse plans.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the interpolation time and plan controls to see how a fixed coupling induces a cloud of displacement paths between endpoint measures.
:::

<iframe class="ot4ml-live-frame" title="Plan interpolation controls" src="../live/kantorovich-plan.html" loading="lazy" style="width:100%;height:470px;border:0;display:block;"></iframe>

### General Geodesic Spaces

For Dirac masses in Euclidean space, the $\Wass_2$ geodesic from $\delta_x$ to
$\delta_y$ is $t\mapsto\delta_{(1-t)x+t y}$. The same idea extends to any
geodesic metric space $(\X,d)$, meaning that each pair of points can be joined
by a constant-speed metric geodesic. For each pair $(x,y)$, one replaces the
Euclidean segment by a curve $\gamma^{x,y}:[0,1]\to\X$ such that
$\gamma^{x,y}_0=x$, $\gamma^{x,y}_1=y$, and

```{math}
d(\gamma^{x,y}_s,\gamma^{x,y}_t)=|t-s|d(x,y).
```

If this geodesic is unique and depends measurably on $(x,y)$, one defines
$e_t(x,y)=\gamma^{x,y}_t$ and sets
$\al_t=(e_t)_\sharp\pi^\star$ for an optimal coupling $\pi^\star$. When
geodesics are not unique, there is no canonical interpolation of a pair of
Diracs unless a choice is made: one may select a particular geodesic between
$x$ and $y$, or randomize among several such geodesics. The intrinsic
formulation is to choose a probability measure $\eta$ on the path space of
constant-speed geodesics, called a dynamical optimal plan, such that
$(e_0,e_1)_\sharp\eta$ is an optimal coupling, and to set
$\al_t=(e_t)_\sharp\eta$. Different measurable choices, or different
conditional distributions over geodesics with the same endpoints, can give
different $\Wass_2$ geodesics; the constant-speed identity remains the same.
This path-space viewpoint is standard in the general theory of Wasserstein
spaces {cite:p}`ambrosio2006gradient,Villani09,SantambrogioBook`.

### Comparison With Monge

The distance $\Wass_p$ defined through the Kantorovich problem
{eq}`eq-defn-wass-dist` should be contrasted with the directed distance
$\widetilde{\Wass}$ obtained using Monge's problem. The Kantorovich feasible
set is never empty, since it contains the product coupling, although the
$p$-cost may still be infinite without moment assumptions on non-compact
spaces. By contrast, Monge's constraint set
$\{T:T_\sharp\al=\be\}$ can be empty. When an optimal Monge map exists,
Kantorovich gives the same value by choosing the graph coupling
$(\Id,T)_\sharp\alpha$.

The next proposition makes precise one important sense in which Kantorovich is
the relaxation of Monge. The cleanest statement is first made in the lifted
plan variable $\pi$: deterministic graph couplings are dense among all couplings
when the source can be split at arbitrarily fine scales. Thus the Kantorovich
functional is the weak lower-semicontinuous envelope of the Monge graph
functional.

(prop-kantorovich-relaxation-monge)=
:::{admonition} Proposition: Kantorovich As The Plan-Space Relaxation Of Monge
:class: important
Let $(\Xx,d)$ be a compact metric space, let $p\geq1$, and let
$\al,\be\in\Pp(\Xx)$ with $\al$ atomless. Define

```{math}
\mathcal G(\al,\be)
\eqdef
\{(\Id,T)_\sharp\al:T_\sharp\al=\be\}
\subset \Couplings(\al,\be),
```

and set
$F_p(\pi)\eqdef\int_{\Xx\times\Xx}d(x,y)^p\d\pi(x,y)$. For every
$\pi\in\Couplings(\al,\be)$, there are measurable maps $T_k$ such that
$(T_k)_\sharp\al=\be$,
$(\Id,T_k)_\sharp\al\rightharpoonup\pi$, and
$F_p((\Id,T_k)_\sharp\al)\to F_p(\pi)$.

Consequently $F_p$ is the weak lower-semicontinuous envelope on
$\Couplings(\al,\be)$ of the functional that equals $F_p$ on graph couplings
and $+\infty$ outside them. In particular,

```{math}
\Wass_p(\al,\be)^p
=
\inf_{T_\sharp\al=\be}\int_\Xx d(x,T(x))^p\d\al(x)
=
\widetilde{\Wass}_p(\al,\be)^p,
```

as an equality of infimum values. The Monge infimum need not be attained.
:::

:::{dropdown} Proof
Let $\pi\in\Couplings(\al,\be)$. Choose finite Borel partitions
$(A_i)_i$ and $(B_j)_j$ of $\Xx$ with mesh at most $\epsilon$, and set
$m_{ij}=\pi(A_i\times B_j)$. Since $\al$ is atomless and
$\sum_jm_{ij}=\al(A_i)$, split each $A_i$ into pieces $A_{ij}$ with
$\al(A_{ij})=m_{ij}$. For $m_{ij}>0$, Proposition
{ref}`prop-existence-transport-map-atomless` gives a measurable map from
$A_{ij}$ to $B_j$ sending $\al|_{A_{ij}}/m_{ij}$ to
$\be|_{B_j}/\be(B_j)$. Pasting these maps gives $T_\sharp\al=\be$, and the
graph coupling $(\Id,T)_\sharp\al$ has the same masses as $\pi$ on all
rectangles $A_i\times B_j$.

Uniform continuity of every test function on the compact product implies that
these graph couplings converge weakly to $\pi$ as the mesh goes to zero.
Applying this to the continuous cost $d^p$ gives convergence of costs.
Therefore any weakly lower-semicontinuous minorant of the graph functional is
bounded above by $F_p$ along the approximating graph couplings, while $F_p$
itself is continuous and below the graph functional. This proves the envelope
claim and then the equality of infima.
:::

Since $F_p$ is affine in the plan variable and $\Couplings(\al,\be)$ is convex,
this envelope is also the closed convex relaxation of the Monge graph problem in
the space of transport plans.

At the level of endpoint measures, this gives a literal
lower-semicontinuous-envelope interpretation for the Monge $p$-cost whenever
source measures can be regularized into atomless ones.

(cor-wasserstein-lsc-envelope-monge-distance)=
:::{admonition} Corollary: Lower-Semicontinuous Envelope Of The Monge p-Cost
:class: tip
Assume, in addition, that atomless probability measures are dense in
$\Pp(\Xx)$ for the $\Wass_p$ topology. Define

```{math}
D_M(\al,\be)
\eqdef
\widetilde{\Wass}_p(\al,\be)^p
=
\inf_{\substack{T:\Xx\to\Xx\\T_\sharp\al=\be}}
\int_\Xx d(x,T(x))^p\d\al(x),
```

with the convention $D_M(\al,\be)=+\infty$ if no admissible map exists. Then
$(\al,\be)\mapsto\Wass_p(\al,\be)^p$ is the lower-semicontinuous envelope of
$D_M$ on $\Pp(\Xx)\times\Pp(\Xx)$ for the product $\Wass_p$ topology.
:::

:::{dropdown} Proof
For every admissible map $T$, the graph plan $(\Id,T)_\sharp\al$ is a coupling,
hence $\Wass_p(\al,\be)^p\leq D_M(\al,\be)$. Since $\Wass_p^p$ is continuous in
the product $\Wass_p$ topology, it is a lower-semicontinuous minorant of $D_M$.

Conversely, let $H$ be any lower-semicontinuous minorant of $D_M$. Fix
$(\al,\be)$ and choose atomless $\al_k\to\al$ in $\Wass_p$. By Proposition
{ref}`prop-kantorovich-relaxation-monge`,
$D_M(\al_k,\be)=\Wass_p(\al_k,\be)^p$. Therefore
$H(\al,\be)\leq\liminf_k H(\al_k,\be)\leq
\lim_k\Wass_p(\al_k,\be)^p=\Wass_p(\al,\be)^p$. Thus no larger
lower-semicontinuous minorant exists.
:::

The extra density assumption in the corollary is essential. If $\al$ has atoms,
the graph-density statement can fail dramatically: a single source Dirac mass
cannot be mapped to two target Dirac masses. On finite spaces, the topology is
discrete and this obstruction cannot be removed by closure. In such cases the
Kantorovich formulation is not merely a closure of existing maps with the same
marginals; it genuinely adds the possibility of splitting atomic mass.

## Metric Properties: Topology And Applications

Wasserstein distances metrize weak convergence under moment control, sit
between weak and strong topologies, and provide quantitative estimates in
probability and robust optimization.

(prop-comp-wass-p)=
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

(dfn-weak-conv)=
:::{admonition} Definition: Weak$^*$ Topology
:class: important
A sequence $(\al_k)_k$ converges weakly$^*$ to $\al$ in $\Mm_+^1(\Xx)$ if, for
every bounded continuous function $f$,

```{math}
\int f\d\al_k\longrightarrow\int f\d\al.
```
:::

(rem-riemann-weak-limit)=
:::{admonition} Remark: A Riemann-sum weak limit
:class: ot4ml-remark

On $\Xx=\RR$, the empirical measures on a regular grid satisfy

```{math}
\frac{1}{n} \sum_{k=1}^n \de_{k/n} \rightharpoonup \Uu_{[0,1]}.
```

Indeed, for every continuous bounded function $f$,

```{math}
\frac{1}{n} \sum_{k=1}^n f(k/n) \longrightarrow \int_0^1 f(x) \d x,
```

which is precisely the convergence of Riemann sums. This convergence is weak but not strong: for every $n$, the discrete measure and the uniform density are mutually singular, hence their total variation distance is equal to $2$.
:::

(rem-weak-conv-disc)=
:::{admonition} Remark: Weak convergence for discrete measures
:class: ot4ml-remark

In the special case of a single Dirac, $\de_{x^{(n)}} \rightharpoonup \de_x$ is equivalent to $\int f \d\de_{x^{(n)}} = f(x^{(n)}) \rightarrow \int f \d\de_{x} = f(x)$ for any continuous $f$. This in turn is equivalent to $x^{(n)} \rightarrow x$.
For a fixed number of atoms, if $\al_n=\sum_{i=1}^N a_i^{(n)}\de_{x_i^{(n)}}$ and, after extracting a subsequence and relabeling, $a_i^{(n)}\to a_i$ and $x_i^{(n)}\to x_i$, then $\al_n$ converges weakly to $\sum_i a_i\de_{x_i}$, with atoms at identical limits merged. Without a uniform bound on the number of atoms, weak limits of discrete measures can be non-discrete; empirical measures are the standard example.
:::

(rem-random-variable-convergences)=
:::{admonition} Remark: Modes of convergence for random variables
:class: ot4ml-remark

Convergence of laws should be distinguished from stronger notions of convergence for random variables. If $X_n$ and $X$ are defined on a common probability space, then $X_n\to X$ almost surely means pointwise convergence outside a null set, while convergence in probability means

```{math}
\foralls \epsilon>0,\qquad
\PP(\norm{X_n-X}>\epsilon)\to0.
```

Almost-sure convergence implies convergence in probability, and convergence in probability implies convergence in law. Convergence in law is exactly weak$^*$ convergence of the probability measures $(X_n)_\sharp\PP\rightharpoonup X_\sharp\PP$, and does not require all variables to live on the same probability space. Strong convergence of measures, for instance convergence in total variation, is different and usually much stronger: it controls the mass assigned to all measurable sets, not only averages against continuous test functions. In particular, total variation convergence implies weak convergence, but the converse fails for empirical approximations of continuous laws.
:::

(rem-clt)=
:::{admonition} Remark: Central limit theorem
:class: ot4ml-remark

The central limit theorem states that if $(X_i)_{i\geq1}$ are i.i.d. random vectors with finite second moments, $\EE(X_i)=0$, and $\EE(X_i X_i^\top)=\Id$, then the normalized sum

```{math}
Z_n \eqdef \frac{1}{\sqrt{n}} \sum_{i=1}^n X_i
```

converges in law toward the standard Gaussian $\Gaussian(0,\Id)$. In the terminology recalled above, this means that the measure $\al_n$ representing the law of $Z_n$ converges weakly, or weak$^*$ in the measure/test-function duality, toward the centered Gaussian measure $\al=\Gaussian(0,\Id)$.

Equivalently, this is a statement about rescaled convolutions of measures. If $\mu$ and $\nu$ are probability measures on $\RR^d$, their convolution is

```{math}
\mu*\nu \eqdef \operatorname{add}_\sharp(\mu\otimes\nu),
\qquad
\int \varphi\,\d(\mu*\nu)
=
\iint \varphi(x+y)\,\d\mu(x)\d\nu(y)
```

for every bounded continuous $\varphi$, where $\operatorname{add}(x,y)=x+y$. Thus $\mu*\nu$ is the law of $X+Y$ when $X$ and $Y$ are independent with laws $\mu$ and $\nu$. When $\mu$ and $\nu$ have densities $f$ and $g$, the convolution has density

```{math}
(f*g)(z)=\int_{\RR^d} f(x)g(z-x)\d x.
```

If $\mu$ is the common law of the variables $X_i$, writing $\mu^{*n}$ for the $n$-fold convolution of $\mu$ with itself, and denoting by $D_a(x)=a x$ the dilation map, the law of $Z_n$ is

```{math}
\al_n=(D_{1/\sqrt n})_\sharp\mu^{*n}.
```

The CLT therefore says that the normalized $n$-fold convolution $(D_{1/\sqrt n})_\sharp\mu^{*n}$ converges weak$^*$ to the Gaussian $\Gaussian(0,\Id)$.
:::

(rem-wasserstein-berry-esseen-pointer)=
:::{admonition} Remark: A quantitative CLT in Wasserstein form
:class: ot4ml-remark

The metric viewpoint on weak convergence is not only topological.  It also turns some classical limit theorems into quantitative metric estimates.  For instance, the Berry--Esseen theorem can be stated as a bound on the $\Wass_1$ distance between the law of the normalized sum $n^{-1/2}\sum_i X_i$ and the limiting Gaussian.  By Kantorovich--Rubinstein duality, this is exactly a uniform control of the CLT error over all $1$-Lipschitz test functions.  This application is developed later in Section {ref}`sec-law-large-numbers-clt`, see in particular Proposition {ref}`prop-berry-esseen-w1`.
:::


(prop-rel-wass-tv)=
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

(prop-wass-metrizes-weak-compact)=
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

(sec-wasserstein-over-wasserstein)=
## Wasserstein Over Wasserstein

The construction can be iterated. Once $(\X,d)$ is a metric space, the set of
probability measures on $\X$ becomes a metric space through $\Wass_p$. It can
therefore serve as a new ground space. This is useful whenever the objects to
compare are themselves random probability measures, or mixtures whose
components are meaningful objects rather than only a collapsed density.

(prop-wasserstein-space-polish)=
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
:label: eq-wow-parametric-law
\mathfrak A=(\zeta\mapsto\alpha_\zeta)_\sharp\gamma.
```

(def-collapsed-barycentric-mixture)=
:::{admonition} Definition: Collapsed, Or Barycentric, Mixture
:class: important
The collapsed mixture associated with $\mathfrak A$ is

```{math}
:label: eq-wow-barycentric-mixture
\int_\X f(x)\d\bar\alpha_{\mathfrak A}(x)
=
\int_{\Pp_2(\X)}
\left(\int_\X f(x)\d\alpha(x)\right)
\d\mathfrak A(\alpha).
```
:::

The Wasserstein distance on the Wasserstein space is

```{math}
:label: eq-wow-distance
\mathbb W_2^2(\mathfrak A,\mathfrak B)
\eqdef
\inf_{\Pi\in\Couplings(\mathfrak A,\mathfrak B)}
\int_{\Pp_2(\X)\times\Pp_2(\X)}
\Wass_2^2(\alpha,\beta)\d\Pi(\alpha,\beta).
```

For Gaussian mixtures, this separates two geometries. A mixture can be viewed
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
\big((1-t)\Id+tA_{ij}\big).
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

:::{admonition} Remark: Local profiles as Wasserstein-over-Wasserstein laws
:class: ot4ml-remark

Given a metric-measure space $\XX=(\X,\dist_\X,\mu_\X)$, each point defines a local distance distribution

```{math}
\alpha_x=(\dist_\X(x,\cdot))_\sharp\mu_\X\in\Pp(\RR_+),
\qquad
\mathfrak D_\X=(x\mapsto\alpha_x)_\sharp\mu_\X\in\Pp(\Pp(\RR_+)).
```

The Memoli profile lower bound in Proposition {ref}`prop-memoli-gw-profile-lower-bound` is precisely a Wasserstein-over-Wasserstein comparison of these laws of local profiles. It replaces the full pairwise distortion by an ordinary OT problem whose ground cost is itself a one-dimensional Wasserstein distance.

Note that there exist alternative distances which also metricize weak convergence. The simplest ones are Hilbertian kernel norms, which are detailed in Section {ref}`sec-dual-norms`.
:::


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

Figure {ref}`fig:kantorovich-dro-ambiguity` shows this robustification as a
spatial perturbation picture. The Wasserstein ball permits empirical atoms to
move in the data geometry, while the global transport budget controls how many
atoms can move far toward high-loss regions.

(fig:kantorovich-dro-ambiguity)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]

show_book_figure("kantorovich-dro-ambiguity")
```

*Wasserstein distributional robustness as a geometric ambiguity set. The red
empirical atoms sit next to a dashed linear decision boundary. Local disks
suggest admissible spatial perturbations, and the last panel shows a simple
budgeted adversary moving atoms along a fixed loss-gradient direction.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Increase the Wasserstein radius to see how a robust
classifier protects against spatial adversarial shifts of the empirical atoms.
:::

<iframe class="ot4ml-live-frame" title="Wasserstein DRO classifier controls" src="../live/kantorovich-dro.html" loading="lazy" style="width:100%;height:480px;border:0;display:block;"></iframe>

(prop-wasserstein-cost-convex)=
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
:label: eq-wass-infty
\Wass_\infty(\alpha,\beta)
\eqdef
\inf_{\pi\in\Couplings(\alpha,\beta)}
\esssup_{(x,y)\sim\pi} d(x,y)
```

minimizes the worst displacement rather than an average displacement.

(prop-wasserstein-infty-dro)=
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
