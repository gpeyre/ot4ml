---
title: Optimal Matching between Point Clouds
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-matching)=

This opening chapter isolates the simplest form of optimal transport: pairing
two finite, equally weighted point clouds of the same cardinality. The stakes
are algorithmic and geometric at once: one sees the combinatorial nature of
transport, the special simplicity of the line, and the limitations of
permutations once cardinalities or weights differ. Classical assignment
algorithms such as the Hungarian and auction methods
{cite:p}`Kuhn1955,bertsekas1992auction` provide the computational backdrop,
while the weighted examples motivate the Kantorovich relaxation.

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

# Static figures are Python-rendered; interactive demos are browser-rendered.
from ot4ml_web import (
    plot_histogram_equalization,
    plot_cost_power_sweep,
    plot_quantile_matching,
    plot_regularization_sweep,
)
```

(sec-monge-pbm)=
## Monge Problem for Discrete Points

This section formulates matching as Monge's deterministic transport problem on
two equally weighted clouds. The one-dimensional case is a transparent
reference case where the optimal map can be read off by sorting.

### Assignment Problem

Let $C\in\RR^{n\times n}$ be a cost matrix, where $C_{i,j}$ is the cost of
pairing source $i$ with target $j$, and let $\Perm(n)$ denote the bijections of
$\{1,\ldots,n\}$. The optimal assignment problem is

```{math}
:label: eq-optimal-assignment-web
\min_{\sigma \in \Perm(n)}
\frac{1}{n}\sum_{i=1}^n C_{i,\sigma(i)}.
```

When $C_{i,j}=c(x_i,y_j)$, this is the Monge problem between the two uniform
empirical measures. The factor $1/n$ records the mass of each atom but does not
change the optimizer. Exhaustive search evaluates all $n!$ permutations and is
therefore impractical. Without additional assumptions on $C$, the optimizer
need not be unique.

### Convex Costs on the Line

In one dimension, convex costs select monotone matchings.

(prop-matching-1d-monotone)=
:::{admonition} Proposition: Monotone Matching on the Line
:class: important
Assume that the source points are pairwise distinct and that the target points
are pairwise distinct. If $C_{i,j}=h(x_i-y_j)$ for a strictly convex function
$h:\RR\to\RR$, then the unique optimizer is the order-preserving permutation,
characterized by

```{math}
(x_i-x_{i'})(y_{\sigma(i)}-y_{\sigma(i')}) > 0
\qquad\text{for every }i\neq i'.
```
:::

:::{dropdown} Proof
An assignment that does not preserve order contains an inversion: after
relabeling, $x<x'$ are matched to $y'>y$. Set $d=y'-y>0$ and

```{math}
D(s)=\frac{h(s)-h(s-d)}{d}.
```

Strict convexity makes $D$ strictly increasing. Therefore

```{math}
 h(x-y')+h(x'-y)-h(x-y)-h(x'-y')
=d\bigl(D(x'-y)-D(x-y)\bigr).
```

This quantity is positive because $x-y<x'-y$. Swapping the inverted targets
strictly lowers the cost. Repeating the exchange eliminates every inversion;
the only order-preserving bijection between the sorted clouds pairs equal ranks.
:::

For convex but not strictly convex $h$, the same exchange inequality is
non-strict. Equal-rank matching remains optimal, but other optimizers may
coexist. Choose sorting permutations $\sigma_X,\sigma_Y$ such that

```{math}
x_{\sigma_X(1)} \leq x_{\sigma_X(2)} \leq \cdots
\qquad\text{and}\qquad
y_{\sigma_Y(1)} \leq y_{\sigma_Y(2)} \leq \cdots,
```

and then map $x_{\sigma_X(k)}$ to $y_{\sigma_Y(k)}$. Equivalently, an optimal
transport is $\sigma=\sigma_Y\circ\sigma_X^{-1}$. Comparison sorting costs
$O(n\log n)$ in the worst case with mergesort or heapsort; quicksort has this
complexity only in expectation.

### Concave Costs on the Line

Concavity reverses the exchange preference: one long and one short displacement
can cost less than two displacements of intermediate length. Thus costs
$c(x,y)=g(|x-y|)$ with $g$ strictly concave and nondecreasing, such as
$g(r)=r^p$ for $0<p<1$, favor nested or crossing assignments rather than equal
ranks. This is the regime studied by Gangbo and McCann
{cite:p}`gangbo1996geometry`.

For a source point, its right neighbor is the nearest target to its right such
that the intervening open interval contains equally many sources and targets;
left neighbors and target-to-source neighbors are defined symmetrically.
Iterating this balanced-neighbor relation partitions a unit-mass problem into
independent alternating chains. On a chain

```{math}
p_1<q_1<p_2<q_2<\cdots<p_N<q_N,
```

with the opposite orientation handled by exchanging $p$ and $q$, the local
indicators are

```{math}
I_k^p(i)
=c(p_i,q_{i+k})
+\sum_{r=0}^{k-1}c(p_{i+r+1},q_{i+r})
-\sum_{r=0}^{k}c(p_{i+r},q_{i+r}),
```

and

```{math}
I_k^q(i)
=c(p_{i+k+1},q_i)
+\sum_{r=1}^{k}c(p_{i+r},q_{i+r})
-\sum_{r=0}^{k}c(p_{i+r+1},q_{i+r}).
```

After the relevant lower-order indicators have been found nonnegative, a
negative $I_k^p(i)$ certifies
$p_{i+r}\leftrightarrow q_{i+r-1}$, while a negative $I_k^q(i)$ certifies
$p_{i+r}\leftrightarrow q_{i+r}$, for $r=1,\ldots,k$. Recursively removing
certified blocks gives an exact $O(n^2)$ algorithm for equal unit masses; the
extension to arbitrary real masses has a larger $O(n^3)$ worst-case bound
{cite:p}`delon-concave`. Repeatedly matching the closest red-blue pair is a
simpler heuristic, with quantitative guarantees for $g(r)=r^p$ when
$0<p<1/2$ {cite:p}`OttoliniSteinerberger2023GreedyConcave`.

(fig:matching-1d-convex-concave-costs)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("matching-1d-convex-concave-costs")
```

*One-dimensional assignments for ordered source and target clouds with costs
$c_p(x,y)=|x-y|^p$. The top row uses single-Gaussian source and target clouds;
the bottom row uses a denser two-component source and three-component target.
For the convex quadratic cost, equal ranks are matched and the segments do not
cross. For the concave cost, the optimum creates long crossing exchanges; the
ordered line remains useful, but through the alternating-chain structure of
concave transport rather than through monotone rearrangement.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the sliders to change the two cost exponents and see how convex costs preserve sorted, non-crossing matches while concave costs favor longer crossing exchanges.
:::

<iframe class="ot4ml-live-frame" title="One-dimensional convex and concave cost controls" src="../live/linecost.html" loading="lazy" style="width:100%;height:430px;border:0;display:block;"></iframe>

The next figure shows the monotone case more explicitly. The red and blue
curves are smooth laws used to generate equal-weight empirical measures; the
dots are inverse-CDF samples at common quantile levels. The monotone assignment
connects equal ranks.

(fig:matching-1d-quantile-assignment)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("matching-1d-quantile-assignment")
```

*One-dimensional optimal matching by quantile sorting. The red and blue curves
are smooth laws used to generate equal-weight empirical measures; the dots are
inverse-CDF samples at common quantile levels. The monotone assignment connects
equal ranks, both for two Gaussian mixtures and for the transport from one
central Gaussian toward a three-mode target law.*
:::

The interactive panel exposes the point count and the two laws while keeping
the monotone equal-rank construction in the background.

```{code-cell} ipython3
:tags: [remove-input]
n_points = 52
source_law = "two"      # one, two, wide_two, three
target_law = "three"    # one, two, wide_two, three
```

```{code-cell} ipython3
:tags: [remove-input]
fig = plot_quantile_matching(
    n=n_points,
    source=source_law,
    target=target_law,
)
```

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the point-count slider and the source/target menus to redraw the one-dimensional monotone assignment. The dots move, but the rule remains equal-rank matching after sorting.
:::

<iframe class="ot4ml-live-frame" title="Quantile matching controls" src="../live/quantile.html" loading="lazy" style="width:100%;height:470px;border:0;display:block;"></iframe>

### Histogram Equalization

If $\phi:\RR\to\RR$ is strictly increasing and $h:\RR_+\to\RR$ is convex and
nondecreasing, sorting also solves the problem with cost
$h(|\phi(x)-\phi(y)|)$. A typical application is grayscale histogram
equalization. For equal-size samples with distinct ranks, monotone rearrangement
gives the exact assignment to a prescribed target histogram. Repeated
intensities require consistent tie-breaking or mass splitting, but the quantile
construction remains canonical. It matches intensity distributions rather than
spatial pixel locations.

(fig:monge-histogram-equalization)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("monge-histogram-equalization")
```

*Histogram equalization as one-dimensional Monge transport on pixel
intensities. The map is the monotone rearrangement
$T=Q_\beta\circ F_\alpha$; here $\beta$ is a truncated Gaussian concentrated
near dark intensities. The images are interpolated pointwise by
$I_t=(1-t)I+tT(I)$, and all histograms share the same vertical scale.*
:::

The interactive view below exposes the target mean, target standard deviation,
and interpolation time.

```{code-cell} ipython3
:tags: [remove-input]
target_mean = 0.18
target_sigma = 0.105
interpolation = 0.67  # 0 is the original image, 1 is fully equalized
```

```{code-cell} ipython3
:tags: [remove-input]
fig = plot_histogram_equalization(
    target_mean=target_mean,
    target_sigma=target_sigma,
    interpolation=interpolation,
)
```

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the mean, standard-deviation, and time sliders to move the target intensity law and follow the resulting image equalization and histogram deformation.
:::

<iframe class="ot4ml-live-frame" title="Histogram equalization controls" src="../live/histogram.html" loading="lazy" style="width:100%;height:470px;border:0;display:block;"></iframe>

### Flat Directions for the Linear Cost

Strict convexity makes every optimizer increasing and, for distinct points,
unique. For a merely convex cost such as $|x-y|$, non-increasing optimal
assignments can coexist. The next example exhibits a genuine flat direction of
the linear cost.

(ex-book-shifting-w1)=
:::{admonition} Example: Discrete book-shifting and non-uniqueness for $\Wass_1$
:class: ot4ml-example

Fix $m\geq1$ and consider two equal-cardinality point clouds

```{math}
X=\{1,\ldots,2m\},
\qquad
Y=\{m+1,\ldots,3m\},
```

with uniform weights. The monotone assignment sends $i$ to $i+m$ and has average cost $m$ for $c(x,y)=|x-y|$. It is not unique. The discrete book-shifting assignment

```{math}
T_{\rm book}(i)=
\begin{cases}
i+2m, & 1\leq i\leq m,\\
i, & m<i\leq 2m,
\end{cases}
```

is also a bijection from $X$ to $Y$ and has the same average cost:

```{math}
\frac1{2m}\sum_{i=1}^{2m}|T_{\rm book}(i)-i|
=
\frac1{2m}\sum_{i=1}^{m}2m
=m.
```

Optimality follows from the lower bound

```{math}
\frac1{2m}\sum_{i=1}^{2m}|y_{\sigma(i)}-i|
\geq
\frac1{2m}\sum_{i=1}^{2m}(y_{\sigma(i)}-i)
=m,
```

which holds for every assignment because the target sum is fixed. The continuous Monge version of the same book-shifting phenomenon is given later in Example {ref}`ex-monge-book-shifting-w1`.

For $|x-y|^p$ with $p>1$, this degeneracy disappears: the monotone assignment has average cost $m^p$, whereas the book-shifting assignment has average cost $2^{p-1}m^p>m^p$. Strict convexity penalizes concentrating all displacement on half of the points.
:::


### Optimal Transport on the Circle

The sorting rule on the line has a periodic analogue. Identify the circle with
$\mathbb S^1=\RR/\mathbb Z$, let

```{math}
d_{\mathbb S^1}(x,y):=\min_{k\in\mathbb Z}|x-y+k|,
\qquad
c_p(x,y):=d_{\mathbb S^1}(x,y)^p,
\qquad p>1.
```

The only extra datum, compared with the line, is where one opens the circle.
Once a cut has been chosen, the circle is unfolded into an interval and the
one-dimensional monotone assignment can be used. In the discrete case, changing
the cut is the same as applying a cyclic shift to one of the two circular
orderings.

(prop-circle-ot-cut)=
:::{admonition} Proposition: Discrete Circle Transport by a Cut
:class: important
Assume that the $2n$ points $x_1,\ldots,x_n,y_1,\ldots,y_n$ are pairwise
distinct. Let $x_{(1)},\ldots,x_{(n)}$ and $y_{(1)},\ldots,y_{(n)}$ denote fixed
cyclic orderings, with indices understood modulo $n$. For the cost $c_p$,
$p>1$, every optimal assignment is a cyclic shift

```{math}
x_{(k)} \longmapsto y_{(k+s)},
\qquad k\in\{1,\ldots,n\},
\qquad s\in\{0,\ldots,n-1\},
```

and its cost is obtained by minimizing

```{math}
\frac1n\sum_{k=1}^n
d_{\mathbb S^1}\!\left(x_{(k)},y_{(k+s)}\right)^p
```

over the $n$ possible shifts. For each optimal assignment, one can choose a cut
$\theta\in\mathbb S^1\setminus(\{x_i\}_i\cup\{y_j\}_j)$ crossed by none of its
shortest transport arcs. After lifting the points to $(\theta,\theta+1)$, the
assignment is the equal-rank monotone matching on this interval.
:::

:::{dropdown} Proof
Fix an optimal assignment and let $\gamma_i$ be an open shortest arc from
$x_i$ to its matched target, choosing either orientation for an antipodal pair.
The path-uncrossing lemma of Delon, Rabin, and Gousseau says that if two arcs of
an optimal assignment intersect, then they have the same orientation and
neither is strictly contained in the other {cite:p}`DelonRabinGousseau2011Circle`.
Indeed, opposite orientations or strict containment would allow a two-edge
exchange that is strictly cheaper by monotonicity and strict convexity of
$r\mapsto r^p$.

Suppose that the arcs cover the circle. Because they are open, every source
lies in another transport arc. Ordering the sources cyclically and applying the
path-uncrossing lemma propagates a common orientation: either each forward
neighbor lies in the preceding arc, or the analogous statement holds backward.
Cyclically reassigning the targets in that orientation then shortens every arc,
contradicting optimality. Hence a point $\theta$ lies outside their union.

Cut at $\theta$ and lift the circle to $(\theta,\theta+1)$. Each matched
geodesic avoids the cut, so its circular length is the ordinary distance
between its lifted endpoints. The monotone matching proposition on the line
implies that the lifted assignment preserves order. An order-preserving
bijection between two cyclically ordered finite sets is a cyclic shift.
Minimizing over the $n$ shifts therefore recovers the optimum. The argument and
its extensions to convex costs and nonuniform masses are developed in
{cite:p}`DelonRabinGousseau2011Circle,delon-circle`.
:::

(fig:monge-circle-cut-unfolding)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("monge-circle-cut-unfolding")
```

*Optimal transport on the circle by cutting and unfolding. Purple segments show
the optimal matching and the green radius marks the chosen cut. The red and
blue atoms live on two copies of the circle; the denser point clouds make the
cyclic ordering visible. Once the circle is opened at this angle, the same
matching appears as a monotone one-dimensional assignment on the interval, with
the two green endpoints identified.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the number of points, exponent, and shift controls to open the circle at different cuts and compare the induced cyclic assignments.
:::

<iframe class="ot4ml-live-frame" title="Circle cut controls" src="../live/circle.html" loading="lazy" style="width:100%;height:470px;border:0;display:block;"></iframe>

(fig:matching-2d-cost-exponent)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("matching-2d-cost-exponent")
```

*Optimal assignments between the same two point clouds for four powers of the
Euclidean distance. The source atoms are semi-regular samples in a central
disk, while the target atoms are semi-regular samples on a thin annulus; this
canonical geometry is reused in later coupling and regularization figures. The
feasible set is unchanged, but changing $p$ changes the global organization of
the permutation: the concave case $p=1/2$ penalizes long edges only
sublinearly and therefore permits longer exchanges, whereas larger powers
increasingly suppress the longest edges.*
:::

The interactive panel reuses the same disk-to-annulus geometry and exposes the
number of points, the data geometry, and the cost exponents $p$ in
$c(x,y)=\norm{x-y}^p$.

```{code-cell} ipython3
:tags: [remove-input]
n_points_2d = 36
source_shape = "disk"       # disk, annulus, two_blobs, three_blobs, crescent
target_shape = "annulus"    # disk, annulus, two_blobs, three_blobs, crescent
cost_powers = (1, 2, 6)
seed = 2074
```

```{code-cell} ipython3
:tags: [remove-input]
fig = plot_cost_power_sweep(
    n_points=n_points_2d,
    source_shape=source_shape,
    target_shape=target_shape,
    cost_powers=cost_powers,
    seed=seed,
)
```

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the exponent sliders to compare how different powers of the distance reshape the same two-dimensional assignment problem.
:::

<iframe class="ot4ml-live-frame" title="Cost power controls" src="../live/cost.html" loading="lazy" style="width:100%;height:510px;border:0;display:block;"></iframe>

### Rational Weights

The strict assignment model is also tied to equal cardinalities and equal
weights. As soon as the target resolution changes or the weights are not
uniform, a permutation no longer describes the feasible transports. One instead
needs a nonnegative transport matrix with prescribed row and column sums; this
is the finite-dimensional Kantorovich relaxation developed in the next
chapters.

(fig:matching-resolution-and-weights)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("matching-resolution-and-weights")
```

*From assignments to transport plans, using the same disk-to-annulus geometry.
In the balanced equal-weight case, each source atom is matched to one target
atom. With a target cloud that has half as many atoms, or with strongly
nonuniform target weights, the coupling matrix can merge or split mass; segment
thickness and opacity encode its nonzero entries, and blue marker areas encode
the prescribed target masses.*
:::

The interactive panel below exposes the target resolution, target weights, and
regularization level. The first displayed plan is sparse, while positive
regularization values show the entropic smoothing used later in the Sinkhorn
chapter.

```{code-cell} ipython3
:tags: [remove-input]
n_source = 36
n_target = 18
weight_mode = "angular"     # uniform, angular, right_heavy
weight_strength = 1.4
epsilons = (0.0, 0.03, 0.12)
```

```{code-cell} ipython3
:tags: [remove-input]
fig = plot_regularization_sweep(
    n_source=n_source,
    n_target=n_target,
    source_shape="disk",
    target_shape="annulus",
    cost_power=2,
    epsilons=epsilons,
    weight_mode=weight_mode,
    weight_strength=weight_strength,
    seed=2031,
)
```

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the source and target sizes, weight pattern, and regularization sliders to see how unequal masses and finite resolution change the matching picture.
:::

<iframe class="ot4ml-live-frame" title="Resolution and weight controls" src="../live/resolution.html" loading="lazy" style="width:100%;height:510px;border:0;display:block;"></iframe>

(prop-rational-weights-duplicated-matching)=
:::{admonition} Proposition: Rational Weights as Duplicated Uniform Matching
:class: important
Let

```{math}
\alpha=\sum_{i=1}^n \frac{k_i}{N}\delta_{x_i},
\qquad
\beta=\sum_{j=1}^m \frac{\ell_j}{N}\delta_{y_j},
\qquad
\sum_i k_i=\sum_j\ell_j=N,
```

with positive integers $k_i,\ell_j$. Replace each $x_i$ by $k_i$ identical
copies and each $y_j$ by $\ell_j$ identical copies, producing two uniform
$N$-point clouds. The duplicated assignment problem and the discrete
Kantorovich problem between $\alpha$ and $\beta$ have the same optimal value.
Moreover, an optimal coupling exists of the form

```{math}
P_{ij}=\frac{n_{ij}}N,
\qquad n_{ij}\in\NN,
\qquad \sum_j n_{ij}=k_i,
\quad \sum_i n_{ij}=\ell_j.
```

Couplings whose scaled entries $NP_{ij}$ are integral are exactly the collapsed
assignments between the duplicated clouds. Fractional optimal couplings may
nevertheless coexist when the optimum is degenerate.
:::

:::{dropdown} Proof
Any assignment between the duplicated source and target clouds defines integers
$n_{ij}$ counting how many copied particles of type $x_i$ are matched to copied
particles of type $y_j$. These counts satisfy
$\sum_j n_{ij}=k_i$ and $\sum_i n_{ij}=\ell_j$, and the associated coupling
$P_{ij}=n_{ij}/N$ has marginals $k_i/N$ and $\ell_j/N$. The assignment cost is

```{math}
\frac1N\sum_{i,j} n_{ij}c(x_i,y_j)
=
\sum_{i,j}P_{ij}c(x_i,y_j).
```

Conversely, any nonnegative integer count matrix with those row and column sums
can be realized by allocating the $k_i$ copies of each $x_i$ among the target
copies according to $(n_{ij})_j$. It remains to show that restricting to
integer counts does not increase the optimum. Scale a feasible coupling by
$N$ and write $Q=NP$. The constraints on $Q$ have integer right-hand sides.
After multiplying the target rows by $-1$, their coefficient matrix is the
oriented node-edge incidence matrix of a bipartite graph and is therefore
totally unimodular. Every vertex of the transportation polytope is integral,
and a linear objective attains its minimum at a vertex. Thus an integral
optimal $Q$ exists and the two optimal values coincide. This proves existence,
not integrality of every optimizer: convex combinations of distinct integral
optima can be fractional.
:::

This network-flow integrality mechanism is the rational-weight counterpart of
the Birkhoff--von Neumann theorem proved later: in both cases, a linear
transport relaxation has an optimizer represented by integer edge flows after
scaling. Equal unit margins specialize these flows to permutation matrices,
whereas a degenerate optimal face may also contain fractional couplings.

(fig:matching-rational-duplication)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("matching-rational-duplication")
```

*Rational weights as duplicated uniform matchings, using the same
disk-to-annulus geometry with fewer displayed atoms. The red and blue locations
are kept fixed, while disk areas encode the integer multiplicities $k_i$ and
$\ell_j$. Solving the assignment problem after duplicating particles produces
several collapsed segments attached to high-multiplicity atoms; this is the
integer count matrix of the proposition.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the site and multiplicity sliders to see how rational weights can be represented by duplicated unit masses before solving an ordinary matching problem.
:::

<iframe class="ot4ml-live-frame" title="Rational duplication controls" src="../live/duplication.html" loading="lazy" style="width:100%;height:510px;border:0;display:block;"></iframe>

### Two-Dimensional Assignments

Sorting no longer orders a planar cloud, but a simple local exchange still
rules out proper crossings for the Euclidean-distance cost. This observation,
already present in Monge's geometric reasoning, is necessary but far from
sufficient for computing an optimum.

:::{admonition} Proposition: No Proper Crossings in Euclidean-Distance Matchings
:class: important
Let $x_1,\ldots,x_n,y_1,\ldots,y_n\in\RR^2$ and let
$c(x,y)=\norm{x-y}$. If $\sigma$ is optimal, then two matched segments cannot
cross properly: their relative interiors cannot meet at a point where their
supporting lines are distinct.
:::

:::{dropdown} Proof
Suppose that $[x_i,y_{\sigma(i)}]$ and $[x_j,y_{\sigma(j)}]$ cross properly at
$z$. The triangle inequality along the two reconnected paths gives

```{math}
\norm{x_i-y_{\sigma(j)}}
\leq \norm{x_i-z}+\norm{z-y_{\sigma(j)}},
```

and the analogous inequality after exchanging $i$ and $j$. The sum of the
right-hand sides is the cost of the two original segments. At least one
inequality is strict because the crossing is non-collinear. Swapping the two
targets therefore strictly decreases the cost, a contradiction. Collinear
overlaps are excluded because the exchange can then have equal cost.
:::

This property alone is not enough to lead to an efficient algorithm.
Non-crossing is only a necessary local test, not a compact certificate of
optimality. For instance, if $n$ sources and $n$ targets are placed alternately
on the boundary of a convex polygon, the number of non-crossing perfect
matchings is the Catalan number

```{math}
C_n=\frac{1}{n+1}\binom{2n}{n}
\sim \frac{4^n}{\sqrt{\pi}n^{3/2}}.
```

:::{admonition} Remark: Catalan count of alternating non-crossing matchings
:class: ot4ml-remark

The count follows from the standard Catalan recurrence. Fix one red vertex $r$. In a non-crossing perfect matching, if $r$ is matched to a blue vertex $b$, the chord $[r,b]$ splits the polygon into two smaller polygons. Since the boundary colors alternate, each side contains the same number of red and blue vertices. If one side contains $k$ red and $k$ blue vertices, the other contains $n-1-k$ red and $n-1-k$ blue vertices. Non-crossing matchings on the two sides are independent, because no segment can cross the chord $[r,b]$. Thus, denoting by $M_n$ the number of such matchings, one has

```{math}
M_0=1,
\qquad
M_n=\sum_{k=0}^{n-1} M_k M_{n-1-k}.
```

This recurrence characterizes the Catalan numbers, hence $M_n=C_n$.
:::


Thus even after forbidding proper crossings, exhaustive search remains
exponential. The two-segment swap explains why a transverse crossing cannot be
optimal, but it does not select among the exponentially many planar matchings
that survive this local test.

(alg-one-dimensional-sorting)=
:::{admonition} Algorithm: One-dimensional sorting assignment
:class: ot4ml-algorithm

**Input:** Equal-weight point clouds $(x_i)_{i=1}^n$, $(y_j)_{j=1}^n$ on $\RR$; convex cost $h(x-y)$.

**Output:** Optimal permutation $\sigma$.

**Sort** source and target points:
$x_{\sigma_X(1)}\leq\cdots\leq x_{\sigma_X(n)}, \qquad y_{\sigma_Y(1)}\leq\cdots\leq y_{\sigma_Y(n)}.$

**For** $k=1,\ldots,n$ **do**:

>
> **Match** $x_{\sigma_X(k)}$ with $y_{\sigma_Y(k)}$.
>

**Return** $\sigma=\sigma_Y\circ\sigma_X^{-1}.$
:::

(alg-concave-line-local-indicators)=
:::{admonition} Algorithm: Concave line matching by local indicators
:class: ot4ml-algorithm

**Input:** Two $n$-point unit-mass clouds on $\RR$; cost
$c(x,y)=g(|x-y|)$ with $g$ strictly concave and nondecreasing.

**Output:** Optimal concave-cost matching $M$.

**Sort** combined red-blue sequence on the line.

**Construct** the independent alternating chains induced by the
balanced-neighbor relation.

**Initialize:** Set $M=\emptyset$.

**While** an active chain remains **do**:

>
> **Select** the leftmost active chain and set the indicator order $k=1$.
>
> **While** the chain is nonempty **do**:

>>
>> **Retrieve or compute** all admissible order-$k$ indicators $I_k^p(i)$ and
>> $I_k^q(i)$.
>>
>> **If** a negative indicator is found **then**:

>>>
>>> **Select** the negative indicator with smallest site index $i$; prefer
>>> $I_k^p(i)$ to break a tie.
>>>
>>> **Add** its certified block of $k$ neighboring pairs to $M$.
>>>
>>> **Remove** their endpoints, invalidate affected cached indicators, relabel
>>> the chains, and set $k=1$.
>>>
>> **Else if** $k$ is below the maximal admissible order **then set**
>> $k\leftarrow k+1$.
>>
>> **Else** match the remaining chain by equal indices in its current
>> orientation and remove it.
>

**Return** $M$.
:::

(alg-circle-cut-assignment)=
:::{admonition} Algorithm: Circle assignment by cutting
:class: ot4ml-algorithm

**Input:** Equal-weight points $(x_i)_{i=1}^n$, $(y_j)_{j=1}^n$ on $\mathbb S^1$; cost $d_{\mathbb S^1}^p$.

**Output:** Optimal cyclic assignment and a compatible cut $\theta_{\rm cut}$.

**Let** $x_{(1)},\ldots,x_{(n)}$ and $y_{(1)},\ldots,y_{(n)}$ be the points sorted by increasing angle from a fixed origin.

**For** $s=0,\ldots,n-1$ **do**:

> $E_s=n^{-1}\sum_{k=1}^n d_{\mathbb S^1}\!\left(x_{(k)},y_{(k+s)}\right)^p, \qquad y_{(k+n)}=y_{(k)}.$

**Set** $s^\star$ to the smallest minimizer of $(E_s)_{s=0}^{n-1}$.

**Construct** the shortest arcs from $x_{(k)}$ to $y_{(k+s^\star)}$.

**Choose** $\theta_{\rm cut}$ outside their union and outside all endpoints.

**Lift** every point to its representative in
$(\theta_{\rm cut},\theta_{\rm cut}+1)$.

**Return** $x_{(k)}\mapsto y_{(k+s^\star)}$ and $\theta_{\rm cut}$.
:::

After sorting, direct enumeration costs $O(n^2)$. Faster methods exploit the
convex dependence of the circular transport cost on a continuous shift
parameter for weighted histograms {cite:p}`delon-circle`.


## Matching Algorithms

This section briefly locates matching within classical combinatorial
optimization. Its main point is that efficient algorithms exist, but their
cleanest analysis is obtained only after introducing the linear-programming
viewpoint.

### Classical Assignment Methods

Efficient algorithms exist to solve the optimal matching problem. The most
well-known are the Hungarian method and auction algorithms
{cite:p}`Kuhn1955,bertsekas1981new,bertsekas1992auction`. Auction algorithms
attach prices to targets: an unmatched source bids for the target of smallest
reduced cost, equivalently largest reduced profit, and raises that target's
price. The process terminates once $\epsilon$-complementary slackness holds.
For integer costs, this condition places the unnormalized total cost within
$n\epsilon$ of optimum. If $\epsilon<1/n$, the resulting integer assignment
cost is less than one above the integer optimum and must therefore equal it
{cite:p}`bertsekas1992auction`. The dual
chapter revisits this algorithm after Kantorovich duality and explains why it
is a dual price method, parallel in spirit to Sinkhorn scaling.

### Hungarian Primal-Dual Method

The Hungarian method is best understood as a certificate-building algorithm for
the assignment linear program. Since the factor $1/n$ in the assignment
objective does not affect its optimizer, we use the unnormalized total cost.
The method maintains a partial matching $M$ and dual
prices $(u_i,v_j)$ satisfying

```{math}
u_i+v_j\leq C_{i,j}
\qquad \forall i,j.
```

The equality graph
$E(u,v)=\{(i,j):u_i+v_j=C_{i,j}\}$ contains the edges whose reduced cost is
zero. For a source set $S$, write
$N_E(S)=\{j:\text{some }i\in S\text{ satisfies }(i,j)\in E(u,v)\}$.
The algorithm only augments $M$ along alternating paths made of equality edges.
Starting from an unmatched source, it grows an alternating tree with source set
$S$ and target set $T$. If the tree reaches an unmatched target, the matching
is augmented along the path. If $N_E(S)\setminus T$ is empty, the dual
variables are shifted by the smallest slack

```{math}
\delta=\min_{i\in S,\ j\notin T}\bigl(C_{i,j}-u_i-v_j\bigr),
\qquad
u_i\leftarrow u_i+\delta\ (i\in S),
\qquad
v_j\leftarrow v_j-\delta\ (j\in T).
```

This update preserves all inequalities $u_i+v_j\leq C_{i,j}$, keeps the
current alternating tree tight, and creates at least one new equality edge
leaving $S$. Maintaining these slacks incrementally gives the standard
$O(n^3)$ implementation for an $n\times n$ assignment problem.

The following figure summarizes actual iterates by displaying only the
evolving partial assignment: unmatched rows are shown as flat rows to keep a
fixed matrix format, and matched rows are shown as one-hot rows.

(fig:matching-hungarian-progression)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("matching-hungarian-progression")
```

*Matrix view of actual Hungarian primal-dual iterates on a diagonally dominant
ordered one-dimensional squared-distance assignment. Each panel records the
current partial assignment state: unassigned rows are kept flat, while assigned
rows are one-hot. The snapshots are taken at initialization and after two,
four, six and eight augmentations; for this pedagogical instance the partial
assignments grow along the diagonal, and the final matrix is the identity
assignment certified by complementary slackness.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the size, jitter, and seed controls to regenerate the assignment instance and inspect snapshots of the Hungarian augmentation process.
:::


(prop-hungarian-correct)=
:::{admonition} Proposition: Correctness and Complexity of the Hungarian Primal-Dual Method
:class: important
Assume the Hungarian method terminates with a perfect matching $\sigma$
contained in the equality graph

```{math}
E(u,v)=\{(i,j):u_i+v_j=C_{i,j}\},
```

where $(u,v)$ is dual feasible, i.e. $u_i+v_j\leq C_{i,j}$ for all $(i,j)$.
Then $\sigma$ is an optimal assignment. Moreover, the usual Hungarian updates
terminate after finitely many augmentations. With maintained slacks, the method
uses $O(n^3)$ arithmetic operations.
:::

:::{dropdown} Proof
For any permutation $\tau$, dual feasibility gives

```{math}
\sum_i C_{i,\tau(i)}
\geq
\sum_i (u_i+v_{\tau(i)})
=
\sum_i u_i+\sum_j v_j.
```

This is the weak duality lower bound. If $\sigma$ is contained in the equality
graph, then

```{math}
\sum_i C_{i,\sigma(i)}
=
\sum_i u_i+\sum_j v_j,
```

so the primal cost of $\sigma$ reaches the dual lower bound and is optimal.

It remains to justify finite termination and the complexity bound. Each
successful augmentation increases the matching cardinality by one, so there
are exactly $n$ augmentation phases. During one phase, the algorithm grows an
alternating tree in the equality graph. Before it reaches a free target, the
tree invariant is $|S|=|T|+1$, so $T$ cannot contain every target. If
$N_E(S)\setminus T$ is empty, every slack from $S$ to $T^c$ is positive and
the minimum defining $\delta$ exists. On $S\times T$, adding $\delta$ to source
labels and subtracting it from target labels preserves tightness. On
$S\times T^c$, the definition of $\delta$ preserves feasibility and makes at
least one new edge tight; inequalities on $S^c\times T$ become looser, and all
others are unchanged. Thus the reachable sets strictly grow after every dual
update and can grow at most $n$ times in one phase. If the slacks
$\min_{i\in S}(C_{i,j}-u_i-v_j)$ are maintained when a source enters $S$, each
tree expansion costs $O(n)$. One phase costs $O(n^2)$ and all $n$ phases cost
$O(n^3)$. Hence the method reaches a perfect optimal matching.
:::

(alg-hungarian-primal-dual)=
:::{admonition} Algorithm: Hungarian primal-dual augmentation
:class: ot4ml-algorithm

**Input:** Square cost matrix $C\in\RR^{n\times n}$.

**Output:** Minimum-cost perfect matching $M$.

**Initialize:** Set $u_i=\min_j C_{ij}$ and $v_j=0$.

**Set** $M=\emptyset$.

**While** $M$ is not perfect **do**:

>
> **Build** equality graph:
> $E(u,v)=\{(i,j):u_i+v_j=C_{i,j}\}.$
>
> **Set** root $i_0=\min\{i:\ i\text{ is unmatched in }M\}$.
>
> **Set** reached sets $S=\{i_0\}$ and $T=\emptyset$; clear parent pointers.
>
> **While** $T$ contains no unmatched target **do**:

>>
>> **If** $N_E(S)\setminus T=\emptyset$ **then**:

>>>
>>> **Compute** $\delta=\min_{i\in S,\ j\notin T}\bigl(C_{i,j}-u_i-v_j\bigr)$.
>>>
>>> **Update** $u_i\leftarrow u_i+\delta$ for $i\in S$ and $v_j\leftarrow v_j-\delta$ for $j\in T$.
>>>
>>> **Refresh** equality graph $E(u,v)$.
>>>

>> **Set** $J=N_E(S)\setminus T$.
>>
>> **For** each $j\in J$ in increasing order **do**:

>>>
>>> **Add** $j$ to $T$ and set parent row $p(j)=\min\{i\in S:(i,j)\in E(u,v)\}$.
>>>
>>> **If** $j$ is matched to $i'$ in $M$ **then set** $S\leftarrow S\cup\{i'\}$ and $q(i')=j$.
>>>

> **Set** $j_0=\min\{j\in T:\ j\text{ is unmatched in }M\}$.
>
> **Set** $j=j_0$.
>
> **While** $j$ is defined **do**:

>>
>> **Set** $i=p(j)$.
>>
>> **Set** $j_{\rm old}=q(i)$.
>>
>> **If** $j_{\rm old}$ is defined **then set** $M\leftarrow M\setminus\{(i,j_{\rm old})\}$.
>>
>> **Set** $M\leftarrow M\cup\{(i,j)\}$.
>> **Set** $j=j_{\rm old}$.

**Return** $M$.
:::

The chapter has exposed two complementary routes to finite matching: geometry
can reduce the problem to sorting, while primal-dual labels give a global
certificate for an arbitrary cost matrix. The next chapter passes from finite
permutations to transport maps between general measures.
