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
while the restriction to equal cardinalities and weights motivates the
Kantorovich relaxation.

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
)
```

(sec-monge-pbm)=
## Monge Problem for Discrete Points

This section formulates matching as Monge's deterministic transport problem on
two equally weighted clouds. The one-dimensional case is a transparent
reference case where the optimal map can be read off by sorting.

### Assignment Problem

Let $\C\in\RR^{n\times n}$ be a cost matrix, where $\C_{i,j}$ is the cost of
pairing source $i$ with target $j$, and let $\Perm(n)$ denote the bijections of
$\{1,\ldots,n\}$. The optimal assignment problem is

```{math}
:label: eq-optimal-assignment-web
\min_{\sigma \in \Perm(n)}
\frac{1}{n}\sum_{i=1}^n \C_{i,\sigma(i)}.
```

When $\C_{i,j}=c(x_i,y_j)$, this is the Monge problem between the two uniform
empirical measures. The factor $1/n$ records the mass of each atom but does not
change the optimizer. Exhaustive search evaluates all $n!$ permutations and is
therefore impractical. Without additional assumptions on $\C$, the optimizer
need not be unique.

### Convex Costs on the Line

In one dimension, convex costs select monotone matchings.

(prop-matching-1d-monotone)=
:::{admonition} Proposition: Monotone Matching on the Line
:class: important
Assume that the source points are pairwise distinct and that the target points
are pairwise distinct. If $\C_{i,j}=h(x_i-y_j)$ for a strictly convex function
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

Figure {ref}`fig:matching-1d-convex-concave-costs` contrasts this alternating-chain behavior with monotone rank matching for a convex cost, first on unimodal clouds and then on multimodal clouds.

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

Figure {ref}`fig:matching-1d-quantile-assignment` isolates the rank-matching mechanism for both unimodal and multimodal laws: sampling the two quantile functions at the same levels produces the non-crossing optimal assignment.

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

Figure {ref}`fig:monge-histogram-equalization` applies this construction to image intensities and shows simultaneously the interpolated images and the monotone evolution of their histograms.

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

Figure {ref}`fig:monge-circle-cut-unfolding` shows how the selected cut turns the circular assignment into an ordinary ordered matching on an interval.

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

Figure {ref}`fig:matching-2d-cost-exponent` returns to planar assignments and shows that, even for fixed point clouds, changing the exponent of the Euclidean cost can reorganize the optimal permutation globally.

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


## Hungarian Algorithm

We now present a first algorithm for solving the optimal matching problem. The
Hungarian method {cite:p}`Kuhn1955,Burkard09` provides a gentle, self-contained
preview of duality: it computes a permutation together with a certificate of
its optimality. The auction algorithm
{cite:p}`bertsekas1981new,bertsekas1992auction` is postponed to Section
{ref}`sec-auction-dual-ascent`, after discrete duality and the semi-dual
formulation have been fully developed.

### Hungarian Primal-Dual Method

The method constructs an assignment and its optimality certificate
simultaneously. Its derivation below uses only the elementary lower bound
derived next; Section {ref}`sec-discrete-dual` later embeds this certificate in
general discrete Kantorovich duality.

The factor $1/n$ in the assignment objective does not affect its optimizer, so
consider the unnormalized dual problem

(eq-hungarian-dual)=
```{math}
\max_{(\fD,\gD)\in\RR^n\times\RR^n}
\sum_{i=1}^n\fD_i+\sum_{j=1}^n\gD_j
\qquad\text{subject to}\qquad
\fD_i+\gD_j\leq\C_{i,j}\quad\forall i,j.
```

The certificate used by both Hungarian and auction methods is worth isolating.

(prop-assignment-dual-certificate)=
:::{admonition} Proposition: Dual Certificate for an Assignment
:class: important
Let $(\fD,\gD)$ be feasible for the assignment dual. Then every
$\tau\in\Perm(n)$ satisfies

```{math}
:label: eq-assignment-dual-lower-bound-web
\sum_i\C_{i,\tau(i)}
\geq\sum_i\fD_i+\sum_j\gD_j.
```

If a permutation $\sigma$ uses only tight constraints,

```{math}
:label: eq-assignment-tight-certificate-web
\fD_i+\gD_{\sigma(i)}=\C_{i,\sigma(i)}
\qquad\text{for every }i,
```

then $\sigma$ is an optimal assignment and $(\fD,\gD)$ is dual optimal.
Equality in the lower bound at $\tau=\sigma$ holds if and only if every edge
$(i,\sigma(i))$ is tight.
:::

:::{dropdown} Proof
Dual feasibility gives
$\C_{i,\tau(i)}\geq\fD_i+\gD_{\tau(i)}$ for every $i$. Summing and using
that $\tau$ permutes the target indices yields

```{math}
\sum_i\C_{i,\tau(i)}
\geq
\sum_i\fD_i+\sum_i\gD_{\tau(i)}
=
\sum_i\fD_i+\sum_j\gD_j.
```

If all edges selected by $\sigma$ are tight, its assignment cost equals the
dual value of $(\fD,\gD)$. The lower bound shows that no permutation has
smaller cost. Applied to $\sigma$ and any other feasible dual pair, it also
shows that no feasible dual value can exceed this cost. Conversely, the difference is the sum of the
nonnegative slacks
$\C_{i,\sigma(i)}-\fD_i-\gD_{\sigma(i)}$, and it vanishes exactly when every
one of these slacks vanishes.
:::

This is exactly the uniform-mass specialization of the discrete Kantorovich
dual {eq}`eq-dual`, multiplied by $n$.

The method maintains feasible potentials and a partial matching $M$, meaning a
set of source--target pairs in which no vertex occurs twice. Its slack, or
reduced cost, is

(eq-hungarian-slack)=
```{math}
s_{i,j}=\C_{i,j}-\fD_i-\gD_j\geq0.
```

The **equality graph** consists precisely of the zero-slack edges,

```{math}
E(\fD,\gD)=\{(i,j):s_{i,j}=0\}
=\{(i,j):\fD_i+\gD_j=\C_{i,j}\}.
```

The invariant $M\subset E(\fD,\gD)$ means that every matched pair already
saturates its dual constraint. If $M$ is perfect, Proposition
{ref}`prop-assignment-dual-certificate` certifies that its associated
permutation is optimal. It remains to enlarge $M$ while preserving dual
feasibility and $M\subset E(\fD,\gD)$.

To increase the matching, choose an unmatched source $i_0$. Starting from that
root, grow a tree in the bipartite equality graph. From a reached source,
follow a zero-slack edge to a new target; from a reached target that is already
matched, follow its unique matched edge back to a source. The tree edges
therefore alternate between unmatched and matched edges, which explains the
term **alternating tree**. Write $p(j)$ for the source preceding a reached
target $j$, and $q(i)$ for the matched target preceding a reached non-root
source $i$. If the tree reaches an unmatched target, these pointers form an
**augmenting path**. Exchanging matched and unmatched edges along this path
increases $|M|$ by one.

Let $S$ and $T$ denote the reached source and target sets, and let
$N_E(S)=\{j:\exists i\in S,\ (i,j)\in E(\fD,\gD)\}$. If no equality edge leaves
$S$ toward an unreached target, shift the potentials by the smallest such
slack:

(eq-hungarian-dual-shift)=
```{math}
\delta=\min_{i\in S,\ j\notin T}
\bigl(\C_{i,j}-\fD_i-\gD_j\bigr),
\qquad
\fD_i\leftarrow\fD_i+\delta\ (i\in S),
\qquad
\gD_j\leftarrow\gD_j-\delta\ (j\in T).
```

Here $\delta>0$ because no edge from $S$ to $T^c$ is currently tight. The
update leaves slacks unchanged on $S\times T$, decreases them by $\delta$ on
$S\times T^c$, and increases them on $S^c\times T$. Feasibility and existing
tree edges are preserved, while at least one new equality edge appears from
$S$ to $T^c$. Since $|S|=|T|+1$ before a free target is reached, the dual
objective increases by $\delta(|S|-|T|)=\delta$.

A cubic implementation stores, for every unreached target,

(eq-hungarian-maintained-slack)=
```{math}
\ell_j=\min_{i\in S}s_{i,j}
```

and a parent source $p(j)$ attaining the minimum. When a source $i'$ enters
$S$, each unreached target is updated by comparing $\ell_j$ with the single
new slack $s_{i',j}$. A dual shift uses
$\delta=\min_{j\notin T}\ell_j$ and replaces $\ell_j$ by
$\ell_j-\delta$ for $j\notin T$. A tree expansion therefore costs $O(n)$
rather than requiring a rescan of $S\times T^c$.

Hungarian and auction methods use the same dual potentials and reduced costs in
different ways. Hungarian grows an exact zero-slack augmenting tree, whereas
the auction method in Section {ref}`sec-auction-dual-ascent` uses
$\epsilon$-relaxed contacts, price bids, and ownership changes. Figure
{ref}`fig:matching-hungarian-progression` shows the Hungarian mechanism on the
same planar clouds as Figure {ref}`fig:matching-2d-cost-exponent`: thick violet
edges form the current matching, while faint edges indicate unmatched pairs
whose reduced costs are closest to zero.

(fig:matching-hungarian-progression)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("matching-hungarian-progression", width=840)
```

*Growth of the Hungarian matching on the planar point clouds of Figure
{ref}`fig:matching-2d-cost-exponent`.* Thick violet segments show the partial
matching, whose cardinality $|M|$ is reported in each panel. Thin translucent
segments show the $2n$ lowest-slack unmatched edges, ranked by
$s_{i,j}=\C_{i,j}-\fD_i-\gD_j$; exact zero-slack candidates are slightly
stronger. This overlay summarizes the near-tight dual constraints, while the
algorithm selects its next edge only across the current alternating-tree cut.
The final thick matching is optimal and all its edges are dual-tight.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the size, jitter, and seed controls to regenerate an
assignment instance and inspect the augmentation process. The static book figure
above fixes the canonical point clouds and additionally overlays low-slack edges.
:::

(alg-hungarian-primal-dual)=
:::{admonition} Algorithm: Hungarian primal-dual augmentation
:class: ot4ml-algorithm

**Input:** Square cost matrix $\C\in\RR^{n\times n}$.

**Output:** Optimal permutation $\sigma$ and feasible potentials
$(\fD,\gD)$ certifying its optimality.

**Initialize:** Set $\fD_i=\min_j\C_{i,j}$, $\gD_j=0$, and $M=\emptyset$.

**While** $|M|<n$ **do**:

> **Set** $i_0=\min\{i:i\text{ is unmatched in }M\}$,
> $S=\{i_0\}$, and $T=\emptyset$; leave $j_0$ and $q(i_0)$ undefined.
>
> **For** $j=1,\ldots,n$ **do**:
>
>> **Set** $\ell_j=\C_{i_0,j}-\fD_{i_0}-\gD_j$ and $p(j)=i_0$.
>
> **While** $j_0$ is undefined **do**:
>
>> **Set** $\delta=\min_{j\notin T}\ell_j$.
>>
>> **Update** $\fD_i\leftarrow\fD_i+\delta$ for $i\in S$,
>> $\gD_j\leftarrow\gD_j-\delta$ for $j\in T$, and
>> $\ell_j\leftarrow\ell_j-\delta$ for $j\notin T$.
>>
>> **Select** $j=\min\{k\notin T:\ell_k=0\}$ and set
>> $T\leftarrow T\cup\{j\}$.
>>
>> **If** $j$ is unmatched in $M$ **then**:
>>
>>> **Set** $j_0=j$ and exit the inner while loop.
>>
>> **Otherwise set** $i'$ to the source matched to $j$,
>> $S\leftarrow S\cup\{i'\}$, and $q(i')=j$.
>>
>> **For** $k\notin T$ **do**:
>>
>>> **Set** $r=\C_{i',k}-\fD_{i'}-\gD_k$.
>>>
>>> **If** $r<\ell_k$ **then set** $\ell_k=r$ and $p(k)=i'$.
>
> **Set** $j=j_0$.
>
> **While** $j$ is defined **do**:
>
>> **Set** $i=p(j)$ and $j_{\rm old}=q(i)$.
>>
>> **Delete** $(i,j_{\rm old})$ from $M$ when $j_{\rm old}$ is defined.
>>
>> **Set** $M\leftarrow M\cup\{(i,j)\}$ and $j\leftarrow j_{\rm old}$.

**Return** the permutation $\sigma$ defined by
$M=\{(i,\sigma(i))\}_i$ and the potentials $(\fD,\gD)$.
:::

(prop-hungarian-correct)=
:::{admonition} Proposition: Correctness and Complexity of the Hungarian Primal-Dual Method
:class: important
For every cost matrix $\C\in\RR^{n\times n}$, the Hungarian algorithm
terminates after $n$ augmentation phases. It returns a permutation
$\sigma\in\Perm(n)$ and feasible potentials $(\fD,\gD)$ satisfying

```{math}
\fD_i+\gD_{\sigma(i)}=\C_{i,\sigma(i)}
\qquad\forall i.
```

Consequently, $\sigma$ is optimal. With the maintained slacks
{eq}`eq-hungarian-maintained-slack`, the algorithm uses $O(n^3)$ arithmetic
and comparison operations and $O(n^2)$ storage, including the cost matrix.
:::

:::{dropdown} Proof
Initialization is dual feasible and the empty matching lies in the equality
graph. At the beginning of a phase, the slack initialization gives

$$
\ell_j=\min_{i\in S}s_{i,j}=s_{p(j),j}
\qquad(j\notin T).
$$

This identity is preserved when a matched source $i'$ enters $S$, because the
algorithm compares every $\ell_j$ with the single new candidate $s_{i',j}$.

Before a free target is reached, every target in $T$ is matched to a source in
$S$, while every source in $S$ except the unmatched root was reached through
its matched target. Thus $|S|=|T|+1$, so $T$ cannot contain every target.
Dual feasibility gives

$$
\delta=\min_{j\notin T}\ell_j
=\min_{i\in S,\,j\notin T}s_{i,j}\geq0.
$$

After the potential update,

```{math}
s_{i,j}^{+}=
\begin{cases}
s_{i,j},&(i,j)\in S\times T,\\
s_{i,j}-\delta,&(i,j)\in S\times T^c,\\
s_{i,j}+\delta,&(i,j)\in S^c\times T,\\
s_{i,j},&(i,j)\in S^c\times T^c.
\end{cases}
```

All slacks remain nonnegative. For $j\notin T$, both the slacks from $S$ and
$\ell_j$ decrease by $\delta$, so the maintained-minimum identity remains
valid. At least one $\ell_j$ becomes zero, and $p(j)$ supplies the corresponding
equality edge. Every matched edge remains tight.

Each inner iteration adds a new target to $T$. It either reaches a free target
or adds that target's matched source to $S$ and updates the slack array. Hence a
phase reaches a free target after at most $n$ iterations. The pointers $p$ and
$q$ trace an alternating path; flipping it preserves the matching property,
increases $|M|$ by one, and uses only equality edges. Starting from the empty
matching, exactly $n$ phases produce a perfect matching.

At termination every matched edge is tight, so Proposition
{ref}`prop-assignment-dual-certificate` directly proves that $\sigma$ is
optimal and the returned potentials are dual optimal. This is the finite
assignment instance of the complementary-slackness mechanism proved in general
in Proposition {ref}`prop-discrete-complementary-slackness`.
Initializing the slack array costs $O(n)$. Each inner iteration scans at most
$n$ targets to find $\delta$, update the slacks, and compare them with one newly
reached source row. It therefore costs $O(n)$, giving $O(n^2)$ per phase and
$O(n^3)$ overall. The cost matrix requires $O(n^2)$ storage, while the matching,
reached sets, parent arrays, and slacks require only $O(n)$ additional storage.
:::

The chapter has exposed two complementary routes to finite matching: geometry
can reduce the problem to sorting, while primal-dual potentials give a global
certificate for an arbitrary cost matrix. The next chapter passes from finite
permutations to transport maps between general measures.
