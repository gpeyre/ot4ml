---
title: Optimal Matching between Point Clouds
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-matching)=

This opening chapter isolates the simplest form of optimal transport: pairing
two finite point clouds. The stakes are algorithmic and geometric at once: one
sees the combinatorial nature of transport, the special simplicity of the line,
and the first hints that convex relaxation will be necessary in higher
dimension. Classical assignment algorithms such as the Hungarian method and
auction methods {cite:p}`Kuhn1955,bertsekas1992auction` provide the
computational backdrop, while the geometric examples prepare the Kantorovich
relaxation.

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

### Matching Problem

Given a cost matrix $(C_{i,j})_{i \in \{1,\ldots,n\}, j \in \{1,\ldots,m\}}$
and assuming $n=m$, the optimal assignment problem aims to find a bijection
$\sigma$ within the set $\Perm(n)$ of permutations of $n$ elements that solves

```{math}
:label: eq-optimal-assignment-web
\min_{\sigma \in \Perm(n)}
\frac{1}{n}\sum_{i=1}^n C_{i,\sigma(i)}.
```

One could naively evaluate the cost above for all permutations in
$\Perm(n)$. However, this set has size $n!$, which becomes enormous even for
small values of $n$. In general, the optimal $\sigma$ is not unique.

### One-Dimensional Case

In one dimension, convex costs select monotone matchings.

(prop-matching-1d-monotone)=
:::{admonition} Proposition: Monotone Matching on the Line
:class: important
Assume that the points $(x_i)_i$ and $(y_j)_j$ are pairwise distinct. If the
cost is of the form $C_{i,j}=h(x_i-y_j)$, where
$h:\RR\to\RR^+$ is strictly convex, for instance
$C_{i,j}=|x_i-y_j|^p$ with $p>1$, then any optimal $\sigma$ defines a strictly
increasing map $x_i \mapsto y_{\sigma(i)}$, and hence is unique:

```{math}
\forall (i,i'), \qquad
(x_i-x_{i'})(y_{\sigma(i)}-y_{\sigma(i')}) > 0.
```
:::

:::{dropdown} Proof
If this property is violated, there exists $(i,i')$ such that
$(x_i-x_{i'})(y_{\sigma(i)}-y_{\sigma(i')}) < 0$. One can then define a
permutation $\tilde\sigma$ by swapping the match:
$\tilde\sigma(i)=\sigma(i')$ and $\tilde\sigma(i')=\sigma(i)$. This gives a
strictly better cost by the following elementary inequality.

Let $h:\RR\to\RR$ be strictly convex and let $x<x'$ and $y<y'$. Then

```{math}
h(x-y)+h(x'-y') < h(x-y')+h(x'-y).
```

Set $d:=y'-y>0$ and define, for every $s\in\RR$,

```{math}
D(s):=\frac{h(s)-h(s-d)}{d}
```

and

```{math}
\Delta
=h(x-y')+h(x'-y)-h(x-y)-h(x'-y')
=d\bigl(D(x'-y)-D(x-y)\bigr).
```

Because $h$ is strictly convex, $D$ is strictly increasing. Since
$x-y<x'-y$, monotonicity gives $D(x-y)<D(x'-y)$, hence $\Delta>0$.
:::

This property extends by continuity to convex costs that are not strictly
convex, such as $|x-y|$, but then the matching is not necessarily unique. For
convex costs, the algorithm to compute an optimal transport is to sort the
points: find permutations $\sigma_X,\sigma_Y$ such that

```{math}
x_{\sigma_X(1)} \leq x_{\sigma_X(2)} \leq \cdots
\qquad\text{and}\qquad
y_{\sigma_Y(1)} \leq y_{\sigma_Y(2)} \leq \cdots,
```

and then map $x_{\sigma_X(k)}$ to $y_{\sigma_Y(k)}$. Equivalently, an optimal
transport is $\sigma=\sigma_Y\circ\sigma_X^{-1}$. The computational cost is
therefore $O(n\log n)$, using for instance quicksort.

If the distance profile is concave instead of convex, the geometry changes.
For costs such as $c_p(x,y)=|x-y|^p$ with $0<p<1$, splitting a displacement
into several smaller displacements is expensive, so optimal matchings tend to
create long exchanges rather than the monotone equal-rank pairing. This is the
strictly concave regime studied by Gangbo and McCann
{cite:p}`gangbo1996geometry`.

The real line still gives special structure. After sorting all red and blue
points together, the ordered sequence decomposes into maximal alternating
chains, and local matching indicators can certify pairs that must be matched in
an optimum. Removing such certified pairs and repeating yields an exact
hierarchical algorithm for the unit-mass balanced assignment problem, with
worst-case complexity $O(n^2)$ in the framework of Delon, Salomon and
Sobolevski {cite:p}`delon-concave`. Very concave costs also motivate simpler
greedy heuristics, studied for instance by Ottolini and Steinerberger
{cite:p}`OttoliniSteinerberger2023GreedyConcave`. The point is that these
methods are not generic linear-programming solvers; they use the
one-dimensional order and the concavity of the distance profile.

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

If $\phi:\RR\to\RR$ is increasing, the same technique applies to costs of the
form $h(|\phi(x)-\phi(y)|)$ after a change of variable. A typical application
is grayscale histogram equalization. The empirical cumulative distribution of
image luminance values is transported to a prescribed target histogram, for
instance a concentrated or reference-image histogram. In one dimension, the
monotone rearrangement gives the exact transport map, so the operation is both
computationally simple and geometrically faithful: it matches distributions of
intensities rather than individual pixels.

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

If $h$ is strictly convex, then all optimal assignments are increasing, and if
the points are all distinct, this increasing map is unique. If $h$ is not
strictly convex, for instance $c(x,y)=|x-y|$, non-increasing optimal
assignments can also exist. This happens, for example, in the book-shifting
problem with overlapping uniform distributions, where the mass in the
intersection can stay fixed.

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
Let $x_1,\ldots,x_n$ and $y_1,\ldots,y_n$ be two families of distinct points on
$\mathbb S^1$, with equal weights. Let $x_{(1)},\ldots,x_{(n)}$ and
$y_{(1)},\ldots,y_{(n)}$ denote fixed cyclic orderings, with the convention
$y_{(k+n)}=y_{(k)}$. For the cost $c_p$, $p>1$, an optimal assignment is one of
the cyclic shifts

```{math}
x_{(k)} \longmapsto y_{(k+s)},
\qquad k\in\{1,\ldots,n\},
\qquad s\in\{0,\ldots,n-1\},
```

and is found by minimizing

```{math}
\sum_{k=1}^n
d_{\mathbb S^1}\!\left(x_{(k)},y_{(k+s)}\right)^p
```

over the $n$ possible shifts. Equivalently, for an optimal shift one can
choose a cut
$\theta\in\mathbb S^1\setminus(\{x_i\}_i\cup\{y_j\}_j)$ so that, after lifting
all points to $(\theta,\theta+1)$ and sorting them, the optimal matching is the
equal-rank monotone matching on this interval.
:::

:::{dropdown} Proof
Call two matched pairs cyclically inverted if the circular order of their
source endpoints is opposite to the circular order of their target endpoints.
Among optimal assignments, choose one with the smallest number of such
inversions. The elementary exchange step is the circular analogue of the line
argument above: if two matched pairs are inverted, then cutting the circle in a
gap which does not meet the four endpoints and choosing integer lifts realizes
the four geodesic distances involved in the exchange as ordinary distances
between two ordered source lifts and two oppositely ordered target lifts. The
one-dimensional Monge inequality for the strictly convex function
$r\mapsto |r|^p$ then shows that swapping the two targets cannot increase the
cost, and decreases it unless the four endpoints are in a degenerate tie
configuration.

Thus an optimal assignment can be chosen with no cyclic inversion. A bijection
between two finite cyclically ordered sets with no cyclic inversion is a
rotation of the order, hence a cyclic shift. This shift specifies how the two
cyclic orderings should be opened; after this cut, the rotation becomes an
ordinary linear order and the matching is the equal-rank monotone assignment on
the unfolded interval. Conversely, each cut gives one such cyclic shift, so
minimizing over the finitely many shifts gives an optimal discrete circle
assignment. Repeated points or ties are obtained by the same argument after an
arbitrarily small perturbation and a limiting passage. This is the discrete
form of the fast circle-Monge construction of {cite:p}`delon-circle`.
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

*Optimal assignments between the same two point clouds for three powers of the
Euclidean distance. The source atoms are semi-regular samples in a central
disk, while the target atoms are semi-regular samples on a thin annulus; this
canonical geometry is reused in later coupling and regularization figures. The
feasible set is unchanged, but increasing $p$ penalizes the longest edges more
strongly and changes the global organization of the permutation.*
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
\mu=\sum_{i=1}^n \frac{k_i}{N}\delta_{x_i},
\qquad
\nu=\sum_{j=1}^m \frac{\ell_j}{N}\delta_{y_j},
\qquad
\sum_i k_i=\sum_j\ell_j=N,
```

with $k_i,\ell_j\in\NN$. The discrete Kantorovich problem between $(\mu,\nu)$
is equivalent to the uniform assignment problem obtained by replacing each
$x_i$ by $k_i$ identical copies and each $y_j$ by $\ell_j$ identical copies.
More precisely, after multiplying transport masses by $N$, optimal couplings
correspond to optimal integer count matrices $(n_{ij})$ with row sums $k_i$ and
column sums $\ell_j$, and these count matrices are exactly the collapsed form
of assignments between the duplicated clouds.
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
can be realized by matching the corresponding duplicated particles. Finally,
the transportation constraint matrix is totally unimodular, so the linear
problem with integer supplies and demands has an optimal integer count matrix.
Thus the optimum of the rational-weight Kantorovich problem is the same as the
optimum of the duplicated uniform assignment problem.
:::

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

This efficient strategy to compute the OT in one dimension does not extend to
higher dimensions. In two dimensions, as already noted by Monge, optimal
segments for the Euclidean distance cannot cross.

:::{admonition} Proposition: Non-Crossing Optimal Matchings
:class: important
In dimension two, for $c(x,y)=\norm{x-y}$, if $\sigma$ is an optimal
assignment, then the segments $[x_i,y_{\sigma(i)}]$ cannot cross.
:::

:::{dropdown} Proof
If two segments $[x_i,y_{\sigma(i)}]$ and $[x_j,y_{\sigma(j)}]$ cross at an
interior point $z$, then the triangle inequality gives

```{math}
\norm{x_i-y_{\sigma(j)}}+\norm{x_j-y_{\sigma(i)}}
<
\norm{x_i-y_{\sigma(i)}}+\norm{x_j-y_{\sigma(j)}}.
```

The assignment obtained by swapping $(\sigma(i),\sigma(j))$ therefore has a
strictly smaller cost, contradicting optimality.
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


Thus even after forbidding crossings, an exhaustive search remains
exponential. The two-segment swap in the proof above is nevertheless useful:
it explains why a crossing matching cannot be optimal, but it does not select
among the exponentially many planar matchings that survive this local test.

(alg:one-dimensional-sorting)=
:::{admonition} Algorithm: One-dimensional sorting assignment
:class: ot4ml-algorithm

**Input:** Equal-weight point clouds $(x_i)_{i=1}^n$, $(y_j)_{j=1}^n$ on $\RR$; convex cost $h(x-y)$.

**Output:** Optimal permutation $\sigma$.

**Sort** source and target points:
\(x_{\sigma_X(1)}\leq\cdots\leq x_{\sigma_X(n)}, \qquad y_{\sigma_Y(1)}\leq\cdots\leq y_{\sigma_Y(n)}.\)

**For** $k=1,\ldots,n$ **do**:

>
> **Match** $x_{\sigma_X(k)}$ with $y_{\sigma_Y(k)}$.
>

**Return** \(\sigma=\sigma_Y\circ\sigma_X^{-1}.\)
:::

(alg:concave-line-local-indicators)=
:::{admonition} Algorithm: Concave line matching by local indicators
:class: ot4ml-algorithm

**Input:** Unit-mass source and target points on $\RR$; strictly concave distance cost.

**Output:** Optimal concave-cost matching $M$.

**Sort** combined red-blue sequence on the line.

**Decompose** it into maximal alternating chains.

**Initialize:** Set $M=\emptyset$.

**While** unmatched points remain **do**:

>
> **For** each active alternating chain **do**:

>>
>> **Compute** local matching indicators {cite:p}`delon-concave`.
>>
>> **If** an indicator certifies a pair $(i,j)$ **then**:

>>>
>>> **Update** $M\leftarrow M\cup\{(i,j)\}$.
>>>
>>> **Remove** points $i$ and $j$.
>>>

> **Recompute** only chains affected by removals.
>

**Return** $M$.
:::

(alg:circle-cut-assignment)=
:::{admonition} Algorithm: Circle assignment by cutting
:class: ot4ml-algorithm

**Input:** Equal-weight points $(x_i)_{i=1}^n$, $(y_j)_{j=1}^n$ on $\mathbb S^1$; cost $d_{\mathbb S^1}^p$.

**Output:** Optimal cyclic assignment.

**Let** $x_{(1)},\ldots,x_{(n)}$ and $y_{(1)},\ldots,y_{(n)}$ be the points sorted by increasing angle from a fixed origin.

**For** $s=0,\ldots,n-1$ **do**:

> \(E_s=\sum_{k=1}^n d_{\mathbb S^1}\!\left(x_{(k)},y_{(k+s)}\right)^p, \qquad y_{(k+n)}=y_{(k)}.\)

**Set** $s^\star=\min\argmin_{0\leq s<n}E_s$.

**Set** $\theta_{\rm cut}$ in an empty arc separating two consecutive matched pairs for the shift $s^\star$.

**Replace** every angle by its representative in $[\theta_{\rm cut},\theta_{\rm cut}+2\pi)$.
**Return** $x_{(k)}\mapsto y_{(k+s^\star)}$.
:::


## Matching Algorithms

This section briefly locates matching within classical combinatorial
optimization. Its main point is that efficient algorithms exist, but their
cleanest analysis is obtained only after introducing the linear-programming
viewpoint.

Efficient algorithms exist to solve the optimal matching problem. The most
well-known are the Hungarian method and auction algorithms
{cite:p}`Kuhn1955,bertsekas1981new,bertsekas1992auction`. Auction algorithms
use prices on the target points: each source bids for the target with largest
reduced profit, the target price is increased, and the process terminates when
the $\epsilon$-complementary slackness conditions are satisfied. For integer
costs, choosing $\epsilon<1/n$ gives an exact optimum after a finite number of
bids {cite:p}`bertsekas1992auction`. The dual chapter revisits this algorithm
after Kantorovich duality and explains why it is a dual price method, parallel
in spirit to Sinkhorn scaling.

### Hungarian Primal-Dual Method

The Hungarian method is best understood as a certificate-building algorithm for
the assignment linear program. It maintains a partial matching $M$ and dual
prices $(u_i,v_j)$ satisfying

```{math}
u_i+v_j\leq C_{i,j}
\qquad \forall i,j.
```

The equality graph
$E(u,v)=\{(i,j):u_i+v_j=C_{i,j}\}$ contains the edges whose reduced cost is
zero. The algorithm only augments $M$ along alternating paths made of equality
edges. Starting from an unmatched source, it grows an alternating tree with
source set $S$ and target set $T$. If the tree reaches an unmatched target, the
matching is augmented along the path. If no such edge exists, the dual
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

<iframe class="ot4ml-live-frame" title="Hungarian method controls" src="../live/hungarian.html" loading="lazy" style="width:100%;height:430px;border:0;display:block;"></iframe>

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

It remains to justify finite termination and the complexity bound. At each
successful augmentation, the matching cardinality increases by one, so there
are at most $n$ augmentations. During one augmentation phase, the algorithm
grows an alternating tree in the equality graph. If no augmenting path is
available, the dual update uses the smallest slack of an edge leaving the
current tree. For edges inside the tree, adding $\delta$ to source labels and
subtracting $\delta$ from target labels preserves tightness; for edges from $S$
to $T^c$, the definition of $\delta$ preserves feasibility and makes at least
one new edge tight; all other inequalities are unchanged or become looser. Thus
the reachable sets strictly grow between two failed augmentation attempts, and
they can grow at most $n$ times within one phase. If the current slacks
$\min_{i\in S}(C_{i,j}-u_i-v_j)$ are updated when a source enters $S$, each
tree expansion costs $O(n)$. A phase therefore costs $O(n^2)$, and the $n$
phases give $O(n^3)$ operations. Hence the method reaches a perfect optimal
matching.
:::

(alg:hungarian-primal-dual)=
:::{admonition} Algorithm: Hungarian primal-dual augmentation
:class: ot4ml-algorithm

**Input:** Square cost matrix $C\in\RR^{n\times n}$.

**Output:** Minimum-cost perfect matching $M$.

**Initialize:** Set $u_i=\min_j C_{ij}$ and $v_j=0$.

**Set** $M=\emptyset$.

**While** $M$ is not perfect **do**:

>
> **Build** equality graph:
> \(E(u,v)=\{(i,j):u_i+v_j=C_{i,j}\}.\)
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
>>> **If** $j$ is matched to $i'$ in $M$ **then set** \(S\leftarrow S\cup\{i'\}\) and \(q(i')=j\).
>>>

> **Set** $j_0=\min\{j\in T:\ j\text{ is unmatched in }M\}$.
>
> **Set** $j=j_0$.
>
> **While** $j$ is defined **do**:

>>
>> **Set** $i=p(j)$.
>>
>> **Set** $M\leftarrow M\cup\{(i,j)\}$.
>>
>> **Set** $j_{\rm old}=q(i)$.
>>
>> **If** $j_{\rm old}$ is defined **then set** \(M\leftarrow M\setminus\{(i,j_{\rm old})\}\).
>> **Set** $j=j_{\rm old}$.

**Return** $M$.
:::

