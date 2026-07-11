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
The Monge inequality for a convex displacement cost states that, whenever
$i<i'$ and $j<j'$,

```{math}
h(x_i-y_j)+h(x_{i'}-y_{j'})
\leq
h(x_i-y_{j'})+h(x_{i'}-y_j).
```

We prove optimality by induction on $n+m$. Let $P$ be an optimal plan that
maximizes $P_{11}$. If $P_{11}<\min(a_1,b_1)$, then row $1$ sends positive
mass to some $j'>1$ and column $1$ receives positive mass from some $i'>1$.
Moving the same small amount from $(1,j')$ and $(i',1)$ to $(1,1)$ and
$(i',j')$ preserves both marginals and, by the displayed inequality, does not
increase the cost. It strictly increases $P_{11}$, a contradiction. Hence
$P_{11}=\min(a_1,b_1)$, exactly as in the north-west rule. Row $1$ or column
$1$ is exhausted; deleting it leaves the same problem on a smaller ordered
grid. Induction proves that the complete sweep is optimal. Sorting has cost
$O(n\log n+m\log m)$, and the sweep creates at most $n+m-1$ nonzero entries.
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
For a convex set $\mathcal C$ in a finite-dimensional vector space,

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

:::{admonition} Example: An unbounded convex set without extreme points
:class: ot4ml-example

Compactness cannot be dropped from Proposition {ref}`prop-extreme-point-existence`. For instance, the affine line $\RR\times\{0\}$ is closed, convex, and unbounded, but it has no extreme point.
:::


(prop-linear-program-extreme-minimizer)=
:::{admonition} Proposition: Linear Programs Have Extreme Minimizers
:class: important
Let $\mathcal C$ be nonempty, compact, and convex. For every linear form $\ell$,

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

**Initialize:** Set $R=P$, $s=1$, and $\mathcal L=\emptyset$.

**While** $s>0$ **do**:

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
> $R\leftarrow R-\lambda P_\sigma$ and $s\leftarrow s-\lambda$.

**Return** $P=\sum_{(\lambda_r,\sigma_r)\in\mathcal L}\lambda_rP_{\sigma_r}, \qquad \sum_r\lambda_r=1.$
:::

The perfect matching required at each iteration exists by Hall's theorem.
Indeed, while the common row and column sum of the residual matrix is $s>0$,
any set $I$ of row vertices and its neighborhood $N(I)$ satisfy

```{math}
s|I|
=
\sum_{i\in I}\sum_{j\in N(I)}R_{ij}
\leq
\sum_{j\in N(I)}\sum_iR_{ij}
=s|N(I)|.
```

Thus $|N(I)|\geq|I|$, which is Hall's condition. Subtracting
$\lambda P_\sigma$ preserves a common row and column sum $s-\lambda$ and
removes at least one positive entry. The algorithm therefore terminates after
finitely many steps with $R=0$; summing the updates yields the announced
convex decomposition and $\sum_r\lambda_r=1$.


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
Assume here that all entries of $a$ and $b$ are positive; zero-mass rows and
columns must first be removed. The logarithmic-barrier problem on the resulting
transport polytope is

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

on $\supp(\al)\times\supp(\be)$, for continuous functions $u$ and $v$ on the
respective supports.
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

The tensor product is therefore a trivial feasible coupling, not a typical
optimizer. The continuity assumption matters: changing a cost on an
$\al\otimes\be$-negligible set can change the cost of singular couplings while
leaving the product cost unchanged.

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

A last important class consists of semi-discrete problems, where $\al$ has a
density and $\be$ is discrete. Every coupling is supported on the union of the
slices $\Xx\times\{y_j\}$. When an optimal coupling is induced by a map, these
slices are selected by a partition of $\Xx$ into transport cells, as developed
in Chapter {ref}`sec-semidiscr-w1`.

### Continuous Kantorovich Problem

For a nonnegative Borel cost $c:\Xx\times\Yy\to[0,+\infty]$, the discrete
Kantorovich problem becomes, for arbitrary measures,

```{math}
:label: eq-mk-generic
\mathcal{L}_c(\al,\be)
\eqdef
\inf_{\pi\in\Couplings(\al,\be)}
\int_{\Xx\times\Yy} c(x,y)\d\pi(x,y).
```

This is an infinite-dimensional linear program over a space of measures.

(prop-kantorovich-existence-compact)=
:::{admonition} Proposition: Existence For Lower-Semicontinuous Costs
:class: important
Assume that $\Xx$ and $\Yy$ are Polish spaces and that
$c:\Xx\times\Yy\to[0,+\infty]$ is lower semicontinuous. Then the Kantorovich
problem admits at least one minimizer. In particular, this applies to every
continuous nonnegative cost on compact metric spaces.
:::

:::{dropdown} Proof
The constraint set is nonempty because it contains $\al\otimes\be$. It is
uniformly tight: for $\varepsilon>0$, choose compact sets
$K_\Xx\subset\Xx$ and $K_\Yy\subset\Yy$ with
$\al(K_\Xx),\be(K_\Yy)\geq1-\varepsilon/2$. Every feasible $\pi$ then
satisfies $\pi(K_\Xx\times K_\Yy)\geq1-\varepsilon$. Prokhorov's theorem
gives relative weak compactness. The marginal constraints are weakly closed
because the coordinate projections are continuous, so the feasible set is
weakly compact. Finally, Portmanteau's theorem makes
$\pi\mapsto\int c\d\pi$ weakly lower semicontinuous. The direct method gives a
minimizer.
:::

For the Wasserstein cost $c(x,y)=d(x,y)^p$ on a Polish metric space, the
natural finite-valued domain is

```{math}
\mathcal P_p(\Xx)
\eqdef
\left\{
\al\in\Mm_+^1(\Xx):
\int d(x,x_0)^p\d\al(x)<+\infty
\right\},
```

for one, and hence every, reference point $x_0$. If
$\al,\be\in\mathcal P_p(\Xx)$, the product coupling has finite $p$-cost by the
triangle inequality, and the proposition supplies an optimal coupling.

### Monge--Kantorovich Equivalence

The proof of Brenier's theorem relies on Kantorovich relaxation and duality.
Under Brenier's hypotheses, the relaxation is tight: it has the same cost as
the Monge problem and the optimal coupling is induced by a map.

(cor-monge-kantorovich-brenier)=
:::{admonition} Corollary: Monge--Kantorovich Equivalence Under Brenier
:class: important
Let $\al,\be\in\Pp_2(\RR^d)$, assume that $\al$ is absolutely continuous with
respect to Lebesgue measure, and let $c(x,y)=\|x-y\|^2$. If $T$ is the Brenier
map solving Monge's problem,
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


(sec-1d-kantorovich-solution)=
### Kantorovich solution in 1D

The atomless assumption in the Monge statement of Section
{ref}`sec-1d-transport-quantiles` is a limitation of maps, not of
one-dimensional optimality. Once couplings are allowed, atoms can be split by
assigning subintervals of quantile levels to different target points. The common
quantile parameter therefore defines an optimal relaxed coupling for arbitrary
probability measures.

(prop-1d-kantorovich-quantile-coupling)=
:::{admonition} Theorem: One-dimensional Kantorovich solution
:class: important
Let $\al,\be\in\Mm_+^1(\RR)$ and let $h:\RR\to[0,+\infty)$ be convex. Consider the cost
$c(x,y)=h(x-y)$. Write $q_\al=\cumul{\al}^{-1}$ and
$q_\be=\cumul{\be}^{-1}$, and assume that $h(q_\al-q_\be)\in L^1(0,1)$. Then
the quantile coupling

```{math}
\pi^\star=(q_\al,q_\be)_\sharp\mathrm{Leb}_{[0,1]}
=
(\cumul{\al}^{-1},\cumul{\be}^{-1})_\sharp\mathrm{Leb}_{[0,1]}
```

minimizes $\int h(x-y)\d\pi(x,y)$ over
$\pi\in\Couplings(\al,\be)$. In particular, $h(t)=|t|^p$ gives the usual
one-dimensional optimal coupling for every $p\geq1$.
:::

:::{dropdown} Proof
The push-forward statement $\pi^\star\in\Couplings(\al,\be)$ follows from the
quantile push-forward proposition. It remains to prove optimality.

The key point is the one-dimensional uncrossing inequality. If $x<x'$ and
$y>y'$, set $a=x-y$, $\delta=x'-x>0$ and $\eta=y-y'>0$. Convexity of $h$ implies
that increments are monotone, hence

```{math}
h(a+\eta)-h(a)\leq h(a+\delta+\eta)-h(a+\delta),
```

which is exactly

```{math}
h(x-y)+h(x'-y')\geq h(x-y')+h(x'-y).
```

Thus removing a crossing never increases the cost. For a finite transport
matrix on two ordered grids, if $i<i'$ and $j>j'$ carry crossed masses
$P_{i j}$ and $P_{i'j'}$, move $\theta=\min(P_{i j},P_{i'j'})$ units from the
crossed entries $(i,j)$, $(i',j')$ to the uncrossed entries $(i,j')$, $(i',j)$.
The marginals are unchanged, and the cost does not increase. Repeating this
elementary step yields an ordered plan; on an ordered uniform quantile grid,
this is the diagonal plan.

For general measures, lift any coupling to quantile coordinates. Let
$\pi\in\Couplings(\al,\be)$. Using regular conditional laws of a uniform
quantile variable given its image under $q_\al$ and $q_\be$, construct a
coupling $\gamma$ of two uniform variables such that
$\pi=(q_\al,q_\be)_\sharp\gamma$.

To justify the approximation, let
$\kappa_M(r)=\max(-M,\min(r,M))$ and set
$q_{\al,M}=\kappa_M\circ q_\al$ and $q_{\be,M}=\kappa_M\circ q_\be$.
Approximate these bounded nondecreasing functions almost everywhere by
nondecreasing step functions, constant on the uniform intervals
$I_k=((k-1)/N,k/N]$. The matrix
$G^N_{k\ell}=\gamma(I_k\times I_\ell)$ couples two uniform histograms.
Proposition {ref}`prop-1d-weighted-sweep` applied to the ordered step values
therefore yields the desired comparison for the step functions. For fixed
$M$, continuity of $h$ on $[-2M,2M]$ allows passage to the limit as
$N\to\infty$.

Finally, $\kappa_M$ is nondecreasing and $1$-Lipschitz, so for every $x,y$
there is $t_M(x,y)\in[0,1]$ such that
$\kappa_M(x)-\kappa_M(y)=t_M(x,y)(x-y)$. Convexity and nonnegativity give

```{math}
h(t_M(x,y)(x-y))
\leq (1-t_M(x,y))h(0)+t_M(x,y)h(x-y)
\leq h(0)+h(x-y).
```

The assumed integrability controls the diagonal term; for a competitor of
finite cost the same bound controls the other term, while an infinite-cost
competitor is irrelevant. Dominated convergence as $M\to\infty$ gives

```{math}
\int_0^1 h(q_\al(r)-q_\be(r))\d r
\leq
\int h(x-y)\d\pi(x,y)
```

for every $\pi\in\Couplings(\al,\be)$.
:::

This result is strictly more flexible than the Monge formula. If $\al$ has an
atom, a map can only send that whole atom to one target point, whereas the
quantile interval associated with the atom can be coupled with a nontrivial
portion of $\be$. The one-dimensional Kantorovich solution therefore handles
mass splitting without changing the monotone geometry.

(ex-domain-adaptation)=
:::{admonition} Example: Application to domain adaptation
:class: ot4ml-example

In unsupervised domain adaptation, labeled source samples $(x_i^s,y_i^s)_i$ and unlabeled target samples $(x_j^t)_j$ define empirical laws

```{math}
\al_s=\sum_i a_i\de_{x_i^s}
\qquad\text{and}\qquad
\al_t=\sum_j b_j\de_{x_j^t}.
```

Writing $\a=(a_i)_i$ and $\b=(b_j)_j$, a Kantorovich coupling $\P\in\CouplingsD(\a,\b)$ gives soft correspondences between the two clouds. Labels can be transferred by the barycentric rule

```{math}
\widetilde y_j=\frac1{b_j}\sum_i \P_{ij}y_i^s
\qquad (b_j>0),
```

for real-valued labels or one-hot class vectors. Alternatively, the transport can be optimized jointly with a classifier by adding label-prediction terms to the feature cost. This is the mechanism behind OT domain adaptation and JDOT: the plan is not only a distance certificate, but an explicit cross-domain alignment {cite:p}`courty2017optimal,courty2017joint`. Learning or adapting the ground cost is the inverse viewpoint developed later in Section {ref}`sec-metric-learning-inverse-ot`.
:::

(ex-visual-distributions)=
:::{admonition} Example: Application to visual distributions
:class: ot4ml-example

Images, color histograms, texture descriptors and shape samples can all be represented as measures. The ground cost then encodes color differences, image-plane displacements or surface distances. This viewpoint underlies the Earth Mover's Distance for image retrieval {cite:p}`RubTomGui00`, regularized transport for imaging {cite:p}`2014-xia-siims`, convolutional transport on geometric domains {cite:p}`2015-solomon-siggraph`, and Wasserstein barycenters for texture mixing or Radon-domain image processing {cite:p}`2013-Bonneel-barycenter,bonneel2023survey`. The practical gain is that the discrepancy respects geometry: moving a small amount of mass to a nearby color or pixel is cheaper than moving it far away.
:::


## Cyclical Monotonicity

Cyclical monotonicity is the local geometric fingerprint of optimality for a
cost $c$. It converts a global minimization problem into finite exchange
inequalities and is the bridge from Kantorovich plans to convex potentials.

### Support and $c$-Cyclical Monotonicity

The support of a coupling is the topological support introduced in Definition
{ref}`def:support`, now applied to a Radon measure on $\Xx\times\Yy$. Thus
$(x,y)\in\supp(\pi)$ exactly when every open neighborhood of $(x,y)$ has
positive $\pi$-mass.

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
Assume that $c:\Xx\times\Yy\to[0,+\infty)$ is continuous and that the
Kantorovich value is finite. For any optimal plan $\pi$ solving the
Kantorovich problem, $\supp(\pi)$ is $c$-cyclically monotone.
:::

:::{dropdown} Proof Sketch
Suppose a finite family in $\supp(\pi)$ violates the exchange inequality. By
continuity, the same strict inequality holds in small neighborhoods
$U_i\times V_i$ around the chosen pairs. Write
$m_i=\pi(U_i\times V_i)>0$ and choose
$0<\lambda\leq(\sum_i m_i^{-1})^{-1}$. The scaled restrictions
$\pi_i=\lambda\pi|_{U_i\times V_i}/m_i$ have common mass $\lambda$ and satisfy
$\sum_i\pi_i\leq\pi$, even when the rectangles overlap. If $\al_i$ and
$\be_i$ are their marginals, replace $\sum_i\pi_i$ by
$\sum_i\al_i\otimes\be_{\sigma(i)}/\lambda$. The new measure has the same
marginals, while the uniform strict inequality makes its cost strictly
smaller, contradicting optimality.
:::

### Monotonicity

If the optimal plan is induced by a map $T$, there is a set $G$ of full
$\al$-measure such that $(x,T(x))\in\supp(\pi)$ for every $x\in G$. For
$x_1,\ldots,x_k\in G$, cyclical monotonicity reads

```{math}
\sum_{i=1}^k c(x_i,T(x_i))
\leq
\sum_{i=1}^k c(x_i,T(x_{i+1})).
```

For $c(x,y)=\frac12\|x-y\|^2$, the two-point case gives, for $x,y\in G$,

```{math}
\langle T(x)-T(y),x-y\rangle\geq0,
```

so the optimal representative of $T$ is monotone on $G$.

### One Dimension

In one dimension, for $c(x,y)=|x-y|^p$, the two-point inequality has a strict
uncrossing consequence when $p>1$: if $x<y$, every optimal map satisfies
$T(x)\leq T(y)$ on its full-measure transport set. For $p=1$, uncrossing is
not strict. The monotone rearrangement remains optimal, but nonmonotone maps
and nondeterministic plans can also be optimal, as in Remark
{ref}`rem-kantorovich-book-shifting`.

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
Let $(\X,d)$ be a Polish metric space and $p\geq1$. For
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
$(\Id,T)_\sharp\al$.

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
Assume that $\Xx$ is compact and that atomless probability measures are dense in
$\Pp(\Xx)$ for the $\Wass_p$ topology. Then
$(\al,\be)\mapsto\Wass_p(\al,\be)^p$ is the lower-semicontinuous envelope, on
$\Pp(\Xx)\times\Pp(\Xx)$ for the product $\Wass_p$ topology, of the extended
Monge cost

```{math}
\widetilde{\Wass}_p(\al,\be)^p
=
\inf_{\substack{T:\Xx\to\Xx\\T_\sharp\al=\be}}
\int_\Xx d(x,T(x))^p\d\al(x),
```

with the convention $\widetilde{\Wass}_p(\al,\be)^p=+\infty$ if no admissible
map exists.
:::

:::{dropdown} Proof
For every admissible map $T$, the graph plan $(\Id,T)_\sharp\al$ is a coupling,
hence $\Wass_p(\al,\be)^p\leq \widetilde{\Wass}_p(\al,\be)^p$. Since
$\Wass_p^p$ is continuous in the product $\Wass_p$ topology, it is a
lower-semicontinuous minorant of the extended Monge cost.

Conversely, let $H$ be any lower-semicontinuous minorant of the extended Monge
cost. Fix $(\al,\be)$ and choose atomless $\al_k\to\al$ in $\Wass_p$. By
Proposition {ref}`prop-kantorovich-relaxation-monge`,
$\widetilde{\Wass}_p(\al_k,\be)^p=\Wass_p(\al_k,\be)^p$. Therefore
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

(ex-gene-expression-distance)=
:::{admonition} Example: Application to gene-expression distances
:class: ot4ml-example

A single cell can be encoded as a measure over genes,

```{math}
\al_{\mathrm{cell}}=\sum_g e_g\de_{\varphi(g)},
```

where $e_g\geq0$, $\sum_g e_g=1$, and $\varphi(g)$ is a gene embedding or annotation vector. Wasserstein distances then compare cells by moving expression mass between genes. The choice of $\dist(\varphi(g),\varphi(g'))$ is biologically meaningful: it can come from annotations, pathways or a learned ground metric. This is the idea behind the Gene Mover's Distance and related metric-learning approaches for single-cell data {cite:p}`BellazziCodegoniGualandiNicoraVercesi2021GeneMover,HuizingCantiniPeyre2021WassersteinSingularVectors`; it is the single-cell analogue of the cost-learning question revisited in Section {ref}`sec-metric-learning-inverse-ot`.
:::

(ex-word-mover-distance)=
:::{admonition} Example: Application to word embeddings and documents
:class: ot4ml-example

A document can similarly be viewed as a probability measure on a word-embedding space,

```{math}
\al_{\mathrm{doc}}=\sum_{w\in\mathrm{doc}} a_w\de_{e_w}.
```

Here $a_w$ are normalized word frequencies and $e_w$ are word embeddings. The Word Mover's Distance is the Wasserstein distance between such document measures {cite:p}`kusner2015word`. It compares bags of words through the geometry learned by the embedding, so that replacing a word by a nearby synonym is less costly than replacing it by an unrelated word. When two embedding spaces are not already aligned, Gromov--Wasserstein variants compare their intrinsic neighborhood geometry instead of relying on a common coordinate system {cite:p}`alvarez2018towards`; this is the intrinsic-space viewpoint developed in Section {ref}`sec-gromov-wasserstein`.
:::


## Metric Properties: Topology And Applications

Wasserstein distances metrize weak convergence under moment control, sit
between weak and strong topologies, and provide quantitative estimates in
probability and robust optimization.

(prop-comp-wass-p)=
:::{admonition} Proposition: Comparison Of Wasserstein Distances On Bounded Spaces
:class: important
On a bounded metric space, for $1\leq p\leq q<\infty$,

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
:::{admonition} Definition: Weak Or Narrow Topology
:class: important
A sequence $(\al_k)_k$ converges weakly, or narrowly, to $\al$ in
$\Mm_+^1(\Xx)$ if, for
every bounded continuous function $f$,

```{math}
\int f\d\al_k\longrightarrow\int f\d\al.
```
:::

On compact spaces this is also the weak-* topology inherited from the duality
between continuous functions and finite measures. On noncompact spaces,
“narrow convergence” avoids conflating this probability topology with other
weak-* topologies.

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

Almost-sure convergence implies convergence in probability, and convergence in probability implies convergence in law. Convergence in law is exactly weak, or narrow, convergence of the probability measures $(X_n)_\sharp\PP\rightharpoonup X_\sharp\PP$, and does not require all variables to live on the same probability space. Strong convergence of measures, for instance convergence in total variation, is different and usually much stronger: it controls the mass assigned to all measurable sets, not only averages against continuous test functions. In particular, total variation convergence implies weak convergence, but the converse fails for empirical approximations of continuous laws.
:::

(rem-clt)=
:::{admonition} Remark: Central limit theorem
:class: ot4ml-remark

The central limit theorem states that if $(X_i)_{i\geq1}$ are i.i.d. random vectors with finite second moments, $\EE(X_i)=0$, and $\EE(X_i X_i^\top)=\Id$, then the normalized sum

```{math}
Z_n \eqdef \frac{1}{\sqrt{n}} \sum_{i=1}^n X_i
```

converges in law toward the standard Gaussian $\Gaussian(0,\Id)$. In the terminology recalled above, this means that the measure $\al_n$ representing the law of $Z_n$ converges weakly toward the centered Gaussian measure $\al=\Gaussian(0,\Id)$.

Equivalently, this is a statement about rescaled convolutions of measures. If $\al$ and $\be$ are probability measures on $\RR^d$, their convolution is

```{math}
\al*\be \eqdef \operatorname{add}_\sharp(\al\otimes\be),
\qquad
\int \varphi\,\d(\al*\be)
=
\iint \varphi(x+y)\,\d\al(x)\d\be(y)
```

for every bounded continuous $\varphi$, where $\operatorname{add}(x,y)=x+y$. Thus $\al*\be$ is the law of $X+Y$ when $X$ and $Y$ are independent with laws $\al$ and $\be$. When $\al$ and $\be$ have densities $f$ and $g$, the convolution has density

```{math}
(f*g)(z)=\int_{\RR^d} f(x)g(z-x)\d x.
```

If $\al$ is the common law of the variables $X_i$, writing $\al^{*n}$ for the $n$-fold convolution of $\al$ with itself, and denoting by $D_a(x)=a x$ the dilation map, the law of $Z_n$ is

```{math}
\al_n=(D_{1/\sqrt n})_\sharp\al^{*n}.
```

The CLT therefore says that the normalized $n$-fold convolution $(D_{1/\sqrt n})_\sharp\al^{*n}$ converges weakly to the Gaussian $\Gaussian(0,\Id)$.
:::

(rem-wasserstein-berry-esseen-pointer)=
:::{admonition} Remark: A quantitative CLT in Wasserstein form
:class: ot4ml-remark

The metric viewpoint on weak convergence is not only topological. It also turns some classical limit theorems into quantitative metric estimates. For instance, the Berry--Esseen theorem can be stated as a bound on the $\Wass_1$ distance between the law of the normalized sum $n^{-1/2}\sum_i X_i$ and the limiting Gaussian. By Kantorovich--Rubinstein duality, this is exactly a uniform control of the CLT error over all $1$-Lipschitz test functions. This application is developed later in Section {ref}`sec-law-large-numbers-clt`, see in particular Proposition {ref}`prop-berry-esseen-w1`.
:::


(prop-rel-wass-tv)=
:::{admonition} Proposition: Total Variation As Wasserstein For The Discrete Metric
:class: important
Let $\Xx$ be a standard Borel space, let $\al$ and $\be$ be probability
measures on $\Xx$, and let $d_0$ be the $0/1$ cost, with $d_0(x,x)=0$ and
$d_0(x,y)=1$ for $x\neq y$.
Then

```{math}
\inf_{\pi\in\Couplings(\al,\be)}
\int d_0(x,y)^p\d\pi(x,y)
=
\frac12\|\al-\be\|_{\TV}.
```

Whenever the $0/1$ metric is an admissible ground metric, the left-hand side
is $\Wass_p(\al,\be)^p$.
:::

:::{dropdown} Proof
Let $\lambda=\al+\be$, write $a=\d\al/\d\lambda$ and
$b=\d\be/\d\lambda$, and define the common part $\eta$ by
$\d\eta/\d\lambda=\min(a,b)$. The residual measures
$\al'=\al-\eta$ and $\be'=\be-\eta$ are mutually singular and have common
mass

```{math}
r=1-\eta(\Xx)
=\frac12\int|a-b|\d\lambda
=\frac12\|\al-\be\|_{\TV}.
```

The diagonal submeasure of any coupling is bounded by both marginals, hence by
$\eta$. Every coupling therefore has off-diagonal mass, and thus $0/1$ cost,
at least $r$. If $r=0$, the diagonal coupling is optimal. If $r>0$, the
coupling

```{math}
\pi^\star
=\Delta_\sharp\eta+\frac1r\al'\otimes\be',
\qquad \Delta(x)=(x,x),
```

has the prescribed marginals. Since $\al'\perp\be'$, its product term is
concentrated off the diagonal and has cost $r$. This attains the lower bound.
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
$\Wass_p(\al_k,\al)\to0$ if and only if
$\al_k\rightharpoonup\al$ and

```{math}
\int d(x,x_0)^p\d\al_k(x)
\to
\int d(x,x_0)^p\d\al(x).
```

On a finite metric space, weak and strong topologies coincide. If
$d_{\min}=\min_{x\neq y}d(x,y)$ and
$d_{\max}=\max_{x,y}d(x,y)$, then

```{math}
\frac{d_{\min}}{2}\|\al-\be\|_{\TV}
\leq
\Wass_1(\al,\be)
\leq
\frac{d_{\max}}{2}\|\al-\be\|_{\TV}.
```

(ex-single-cell-trajectory-inference)=
:::{admonition} Example: Application to single-cell trajectory inference
:class: ot4ml-example

A single-cell time course gives empirical laws

```{math}
\al_{t_k}=\frac1{n_k}\sum_{i=1}^{n_k}\de_{x_i^{(k)}}
```

on a gene-expression or latent cell-state space. Since sequencing is destructive, one observes populations at successive times, not trajectories of identical cells. Couplings $\pi_k\in\Couplings(\al_{t_k},\al_{t_{k+1}})$ provide soft ancestor--descendant relations. After disintegration into Markov kernels, they can be chained to define population-level trajectories. This static sequence of couplings is the discrete-time shadow of the dynamic formulations of Chapter {ref}`sec-dynamic-optimal-transport`; entropic and unbalanced variants account for branching, noise and growth in modern single-cell models {cite:p}`schiebinger2017reconstruction,TongHuangWolfVanDijkKrishnaswamy2020TrajectoryNet,LavenantZhangKimSchiebinger2021TrajectoryInference,KleinUsciddaTheisCuturi2023GENOT`.
:::


(sec-measure-to-measure-maps)=
## Measure-to-Measure Maps on Wasserstein Space

Many constructions in modern machine learning act directly on probability laws. This section isolates this viewpoint and records two useful principles: some transformations move particles without splitting them, while others are intrinsically diffusive.

### Maps on Wasserstein space.

Once Wasserstein distances provide a topology on probability measures, it is natural to study transformations of probability measures as maps

```{math}
\Phi:\Pp_p(\Xx)\longrightarrow \Pp_p(\Xx)
```

on Wasserstein space. Later chapters use such maps repeatedly: flow matching and diffusion models evolve laws during sampling, one-step transportation methods learn maps between latent and data distributions, and transformers update the empirical law of their tokens; see Chapter {ref}`sec-generative-models-transportation` and Section {ref}`sec-transformer-depth-evolution`. Two questions are especially useful. The structural question asks whether $\Phi$ preserves a discrete particle representation. The metric question asks whether $\Phi$ is stable, for instance Lipschitz, for $\Wass_p$.

### Particle-preserving transport representations.

The deterministic case is obtained by pushing each input measure through a map that may itself depend on that input measure:

```{math}
:label: eq-measure-map-transport-representation
\Phi(\al) = \Gamma[\al]_\sharp \al,
\qquad
\Gamma[\al] : \Xx \to \Xx .
```

Then, for every discrete measure,

```{math}
:label: eq-measure-map-preserve-atoms
\al=\sum_{i=1}^n a_i\de_{x_i}
\quad\Longrightarrow\quad
\Phi(\al)=\sum_{i=1}^n a_i\de_{\Gamma[\al](x_i)} .
```

Thus the weights and the number of particles are preserved, up to possible collisions between images. This is the natural structure behind deterministic particle methods: particles move, but they do not split. Lavenant and Savaré {cite:p}`LavenantSavare2026ContinuousTransformations` study when transformations of measures admit transport representatives of the form {eq}`eq-measure-map-transport-representation`, the obstructions to choosing representatives continuously, and the additional regularity available when $\Phi$ is Wasserstein-Lipschitz.

### Mass-splitting Markov maps.

The opposite case is a stochastic transformation, where one input particle can generate a full output distribution. Let $K$ be a Markov kernel on $\Xx$, so that $K(y,\cdot)$ is a probability measure for each $y$. To obtain a map on $\Pp_p(\Xx)$, assume a finite-moment bound

```{math}
\int_{\Xx} d(x,x_0)^p\,K(y,\d x)
\leq C\bigl(1+d(y,x_0)^p\bigr)
```

for some $x_0\in\Xx$. The associated linear map

```{math}
:label: eq-measure-map-markov-kernel
\int_{\Xx} f(x)\,\d\Psi(\al)(x)
=
\int_{\Xx}\int_{\Xx} f(x)\,K(y,\d x)\,\d\al(y)
```

is a measure-to-measure map from $\Pp_p(\Xx)$ to itself: integrating the
moment bound against $\al$ proves that $\Psi(\al)$ has finite $p$th moment. If
$\Xx=\RR^d$ and $K(y,\d x)=\kappa(x-y)\d x$ for a probability density
$\kappa$ with finite $p$th moment, then $\Psi(\al)=\al*\kappa$ is convolution.
Unless $K(y,\cdot)$ is a Dirac mass, a single atom is sent to a diffuse
probability distribution. Heat flows, noising steps in diffusion models, and
other smoothing mechanisms therefore belong to this mass-splitting class.

If in addition $\Xx$ is Polish and
$\Wass_p(K(y,\cdot),K(y',\cdot))\leq Ld(y,y')$, then $\Psi$ is $L$-Lipschitz
for $\Wass_p$. Glue an input coupling of $(y,y')$ with measurable optimal
couplings between $K(y,\cdot)$ and $K(y',\cdot)$, then integrate the resulting
kernel coupling. Its expected $p$th-power cost is at most $L^p$ times the input
coupling cost.

### Wasserstein stability.

Regularity of $\Phi$ is a stability requirement: small perturbations of the input law should not create large changes of the output law. For transport representations, the following elementary estimate separates the spatial Lipschitz constant of the map from its sensitivity to the input measure.

(rem-w2-lipschitz-bounded-gradient)=
:::{admonition} Remark: $\Wass_2$-Lipschitz functionals and bounded gradients
The same word "Lipschitz" is also used for scalar functionals $f:\Pp_2(\RR^d)\to\RR$. In a geodesic metric space, an $L$-Lipschitz functional has descending metric slope at most $L$. Conversely, if the slope is a strong upper gradient and is uniformly bounded by $L$, then $f$ is $L$-Lipschitz along curves, hence for $\Wass_2$ on $\Pp_2(\RR^d)$. In the smooth Otto calculus this slope is the $L^2(\al)$-norm of the Wasserstein gradient introduced in Proposition {ref}`prop-formal-wass-gradient`:

```{math}
|\partial f|_{\Wass_2}(\al)
=
\norm{\Wgrad f(\al)}_{L^2(\al)} .
```

Thus, under the usual chain-rule assumptions, $\Wass_2$-Lipschitz regularity of $f$ is the metric analogue of imposing a uniform gradient bound,

```{math}
\sup_{\al}\norm{\Wgrad f(\al)}_{L^2(\al)}\leq L .
```

This first-order boundedness should not be confused with $L$-smoothness in optimization, which would instead control how the gradient itself varies.
:::

(prop-measure-map-wass-lipschitz)=
:::{admonition} Proposition: Wasserstein stability of transport representations
:class: important
Let $(\Xx,d)$ be Polish, let $p\geq1$, let $E\subset\Xx$, and assume that, for all $\al,\be\in\Pp_p(\Xx)$ supported in $E$, the maps $T[\al]:E\to\Xx$ satisfy

```{math}
d(T[\al](x),T[\al](y)) \leq L_x d(x,y)
\quad\text{for all }x,y\in E,
```

and

```{math}
\sup_{y\in E} d(T[\al](y),T[\be](y))
\leq L_{\rm law} \Wass_p(\al,\be).
```

Then $\Phi(\al)=T[\al]_\sharp\al$ is $(L_x+L_{\rm law})$-Lipschitz on probability measures supported in $E$:

```{math}
\Wass_p(\Phi(\al),\Phi(\be))
\leq
(L_x+L_{\rm law})\Wass_p(\al,\be).
```
:::

:::{dropdown} Proof
Let $\pi$ be an optimal coupling between $\al$ and $\be$. The measure $(T[\al],T[\be])_\sharp\pi$ is a coupling between $\Phi(\al)$ and $\Phi(\be)$, hence

```{math}
\Wass_p(\Phi(\al),\Phi(\be))
\leq
\left(
\int d(T[\al](x),T[\be](y))^p\,\d\pi(x,y)
\right)^{1/p}.
```

By the triangle inequality,

```{math}
d(T[\al](x),T[\be](y))
\leq
L_x d(x,y)+L_{\rm law}\Wass_p(\al,\be).
```

Minkowski's inequality gives the claim.
:::

The fixed-map case is the basic corollary, obtained with $E=\Xx$ and $L_{\rm law}=0$. If $T:\Xx\to\Xx$ is $L$-Lipschitz, then

```{math}
\Wass_p(T_\sharp\al,T_\sharp\be)\leq L\Wass_p(\al,\be).
```

This is the metric counterpart of the elementary push-forward operation introduced in Definition {ref}`defn-pushfwd`.

### Mean-field attention.

Self-attention is a central example because the number of tokens can be large and variable. A token cloud is represented by the empirical law $\al=n^{-1}\sum_i\de_{x_i}$, and a single-head mean-field attention layer is naturally a transport representation. With the notation of Section {ref}`sec-transformer-depth-evolution`, define

```{math}
:label: eq-kantorovich-mean-field-attention
\Gamma_\theta[\al](x)
=
\frac{\int e^{\dotp{Qx}{Kz}}Vz\,\d\al(z)}
{\int e^{\dotp{Qx}{Kz}}\,\d\al(z)} ,
\qquad \theta=(Q,K,V),
```

where, for simplicity, the value map $V$ takes values in the same Euclidean feature space.

The corresponding measure map is

```{math}
\operatorname{Att}_\theta(\al)=(\Gamma_\theta[\al])_\sharp\al ,
```

and a residual transformer layer uses the closely related map $(\Id+\tau\Gamma_\theta[\al])_\sharp\al$. Lipschitz estimates for $\operatorname{Att}_\theta$ are therefore stability estimates for attention in the many-token regime.

(prop-attention-wass-lipschitz)=
:::{admonition} Proposition: Compact-support attention stability
:class: important
Assume $\Xx=\RR^d$. Fix $R>0$ and let $\mathcal P_R$ be the set of probability measures supported in the Euclidean ball $B(0,R)$. For every $p\geq1$, there is a constant $C_{\theta,p}(R)$ such that

```{math}
\Wass_p(\operatorname{Att}_\theta(\al),\operatorname{Att}_\theta(\be))
\leq C_{\theta,p}(R)\Wass_p(\al,\be),
\qquad \al,\be\in\mathcal P_R.
```

Writing $A_R=\norm{Q}_{\rm op}\norm{K}_{\rm op}R^2$, one can take a constant bounded, up to polynomial factors in $R$ and the operator norms of $Q,K,V$, by

```{math}
C_{\theta,p}(R)\lesssim
e^{2A_R}.
```

This is the exponential-in-score-radius behavior, equivalently $e^{O(R^2)}$ for dot-product scores on $B(0,R)$, refined in {cite:p}`CastinAblinPeyre2024HowSmoothAttention`.
:::

:::{dropdown} Proof
Write $A_R=\norm{Q}_{\rm op}\norm{K}_{\rm op}R^2$. For $x,z\in B(0,R)$, the attention weight

```{math}
a_x(z)=e^{\dotp{Qx}{Kz}}
```

satisfies $e^{-A_R}\leq a_x(z)\leq e^{A_R}$. Moreover the functions $a_x$ and $a_xVz$ have Lipschitz constants bounded by $e^{A_R}$ times polynomial factors in $R$ and $\norm{Q}_{\rm op},\norm{K}_{\rm op},\norm{V}_{\rm op}$. By Kantorovich--Rubinstein duality,

```{math}
\left|\int a_x\,\d(\al-\be)\right|
+
\norm{\int a_xVz\,\d(\al-\be)}
\leq C_{\theta}(R)e^{A_R}\Wass_1(\al,\be).
```

Since the denominator in {eq}`eq-kantorovich-mean-field-attention` is at least $e^{-A_R}$, the quotient rule gives

```{math}
\sup_{x\in B(0,R)}
\norm{\Gamma_\theta[\al](x)-\Gamma_\theta[\be](x)}
\leq C_{\theta}(R)e^{2A_R}\Wass_1(\al,\be).
```

The same differentiation of the quotient with respect to $x$ gives a spatial Lipschitz bound for $x\mapsto\Gamma_\theta[\al](x)$ on $B(0,R)$, uniformly in $\al\in\mathcal P_R$. Since $\Wass_1\leq\Wass_p$ on probability measures and the output remains in the ball $B(0,\norm{V}_{\rm op}R)$, Proposition {ref}`prop-measure-map-wass-lipschitz`, applied with $E=B(0,R)$, proves the estimate.
:::


## Distributional Robustness And Wasserstein Infinity

Wasserstein distances define ambiguity sets around empirical laws. Given
samples $z_i$ and $\widehat{\al}_n=\frac1n\sum_i\delta_{z_i}$, a
distributionally robust optimization problem replaces empirical risk by

```{math}
\sup_{\be:\Wass_p(\be,\widehat{\al}_n)\leq\rho}
\int \ell_\theta(z)\d\be(z).
```

Under standard upper-semicontinuity and growth assumptions on the loss, one has
the dual reformulation

```{math}
\sup_{\be:\Wass_p(\be,\widehat{\al}_n)^p\leq\rho^p}
\int \ell_\theta\d\be
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
\sup_{\be:\Wass_1(\be,\widehat{\al}_n)\leq\rho}
\int \ell_\theta\d\be
\leq
\frac1n\sum_i\ell_\theta(z_i)+\rho L_\theta.
```

Figure {ref}`fig:kantorovich-dro-ambiguity` shows this robustification for a
genuinely nonlinear classification problem. The red and blue samples form two
noisy interlocking crescents whose opposing tips overlap locally. The
Wasserstein adversary transports samples toward high-loss regions under a
global root-mean-square displacement budget.

(fig:kantorovich-dro-ambiguity)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]

show_book_figure("kantorovich-dro-ambiguity")
```

*Wasserstein robustness reshapes the separator between two noisy interlocking
moons. The black curve is the learned zero-score boundary. Filled dots are
observed samples; hollow dots and violet segments show a deterministic
approximation of the adversarial transport for increasing quadratic
Wasserstein radii.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Increase the Wasserstein radius to move the two moons
toward high-loss regions and observe how their winding nonlinear separator
reorganizes.
:::

<iframe class="ot4ml-live-frame" title="Wasserstein DRO classifier controls" src="../live/kantorovich-dro.html" loading="lazy" style="width:100%;height:480px;border:0;display:block;"></iframe>

(prop-wasserstein-cost-convex)=
:::{admonition} Proposition: Convexity Of Transport Costs
:class: important
For any nonnegative lower-semicontinuous cost $c$, the value

```{math}
(\al,\be)\mapsto\mathcal{L}_c(\al,\be)
```

is jointly convex. In particular, $(\al,\be)\mapsto\Wass_p(\al,\be)^p$
is jointly convex. The distance $\Wass_1$ is jointly convex, but
$\Wass_p$ itself need not be convex for $p>1$.
:::

:::{dropdown} Proof
If either endpoint value is infinite, the convexity inequality is immediate.
Otherwise, let $\pi_0$ and $\pi_1$ be $\eta$-optimal couplings for
$(\al_0,\be_0)$ and $(\al_1,\be_1)$. Then
$(1-t)\pi_0+t\pi_1$ is a coupling between the convex combinations of the
marginals, and its cost is the corresponding convex combination. Letting
$\eta\downarrow0$ proves joint convexity. For $p>1$, the root can destroy convexity; on
the line,
$\Wass_p((1-t)\delta_0+t\delta_1,\delta_0)=t^{1/p}$ is concave.
:::

The limiting distance

```{math}
:label: eq-wass-infty
\Wass_\infty(\al,\be)
\eqdef
\inf_{\pi\in\Couplings(\al,\be)}
\esssup_{(x,y)\sim\pi} d(x,y)
```

minimizes the worst displacement rather than an average displacement.
It is the limit of $\Wass_p$ as $p\to\infty$ on bounded spaces, but not the
limit of the linear objectives defining $\Wass_p^p$. Although the
essential-supremum objective is not linear, each sublevel is a convex
support-constrained feasibility problem:

```{math}
\Wass_\infty(\al,\be)\leq r
\quad\Longleftrightarrow\quad
\exists\pi\in\Couplings(\al,\be)
\text{ supported on }\{d\leq r\}.
```

Thus one can compute it by threshold search over feasible coupling problems.

(prop-wasserstein-infty-dro)=
:::{admonition} Proposition: $\Wass_\infty$ Robust Envelope Around An Empirical Law
:class: important
Let $(\Zz,d)$ be a Polish metric space. Let
$\widehat{\al}=\sum_{i=1}^n a_i\delta_{z_i}$ with distinct $z_i$, $a_i>0$, and
$\sum_i a_i=1$, and assume the closed balls
$\overline B(z_i,\rho)$ are compact. For any real-valued upper-semicontinuous
loss $\ell$, the following identity holds. Repeated atoms may first be merged.

```{math}
\sup_{\be:\Wass_\infty(\be,\widehat{\al})\leq\rho}
\int \ell(z)\d\be(z)
=
\sum_{i=1}^n a_i
\sup_{z\in\overline B(z_i,\rho)}\ell(z).
```
:::

:::{dropdown} Proof
If $\Wass_\infty(\be,\widehat{\al})\leq\rho$, choose couplings $\pi_m$ whose
essential displacements are at most $\rho+1/m$. Their fixed marginals make the
family tight; Prokhorov's theorem and closedness of the marginal constraints
give a weak limit $\pi$. Portmanteau's theorem, applied to the closed sets
$\{d\leq\rho+\eta\}$ and then letting $\eta\downarrow0$, shows that $\pi$ is
supported on $\{d\leq\rho\}$.

Disintegrate this coupling as
$\sum_i a_i\delta_{z_i}\otimes\nu_i$. Each $\nu_i$ is supported in
$\overline B(z_i,\rho)$, so the robust expectation is bounded above by the
displayed sum. Compactness and upper semicontinuity provide a maximizer
$z_i^\star$ in every ball. The measure
$\be=\sum_i a_i\delta_{z_i^\star}$ and the coupling
$\sum_i a_i\delta_{(z_i,z_i^\star)}$ attain the reverse inequality.
:::

The coupling viewpoint developed in this chapter provides feasibility,
existence, geometry, and stability. The next chapter adds the complementary
dual description, in which marginal constraints are represented by
Kantorovich potentials.
