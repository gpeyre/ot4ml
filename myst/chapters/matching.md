---
title: Optimal Matching between Point Clouds
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---

This opening chapter isolates the simplest form of optimal transport: pairing
two finite point clouds. The stakes are algorithmic and geometric at once. One
sees the combinatorial nature of transport, the special simplicity of the line,
and the first hints that convex relaxation will be necessary in higher
dimension.

Classical assignment algorithms such as the Hungarian method and auction
methods {cite:p}`Kuhn1955,bertsekas1992auction` provide the computational
backdrop, while the executable cells below turn the book figures into small
experiments.

```{code-cell} ipython3
:tags: [remove-input]
from pathlib import Path
import sys

here = Path.cwd()
for candidate in [here, here.parent, here / "myst", here.parent / "myst", here.parent.parent / "myst"]:
    if (candidate / "ot4ml_web.py").exists():
        sys.path.insert(0, str(candidate.resolve()))
        break

from ot4ml_web import (
    plot_histogram_equalization,
    plot_cost_power_sweep,
    plot_quantile_matching,
    plot_regularization_sweep,
)
```

## Monge Problem for Discrete Points

Given a cost matrix $(C_{i,j})_{i \in \{1,\ldots,n\}, j \in \{1,\ldots,n\}}$,
the optimal assignment problem searches for a permutation $\sigma \in
\Perm(n)$ solving

```{math}
:label: eq-optimal-assignment-web
\min_{\sigma \in \Perm(n)} \frac{1}{n}\sum_{i=1}^n C_{i,\sigma(i)}.
```

Enumerating all permutations is impossible once $n$ grows, because there are
$n!$ of them. Geometry gives useful structure, but the structure is very
different in one dimension and in higher dimension.

### Quantile Matching on the Line

In one dimension, convex costs select the monotone matching: after sorting the
source and target points, equal ranks should be paired. This is the finite
version of monotone rearrangement.

:::{admonition} Proposition: Monotone matching on the line
:class: important
Assume that the points $(x_i)_i$ and $(y_j)_j$ are pairwise distinct. If
$C_{i,j}=h(x_i-y_j)$ with $h:\RR\to\RR^+$ strictly convex, then any optimal
assignment defines a strictly increasing map $x_i \mapsto y_{\sigma(i)}$.
:::

The first experiment exposes the point count and the two laws. The hidden code
uses inverse-CDF samples and connects points with equal quantile rank.

```{code-cell} ipython3
n_points = 52
source_law = "two"      # one, two, wide_two, three
target_law = "three"    # one, two, wide_two, three
```

```{code-cell} ipython3
:tags: [hide-input]
fig = plot_quantile_matching(
    n=n_points,
    source=source_law,
    target=target_law,
)
```

*Equal-rank matching between two one-dimensional empirical measures. Convex
costs preserve the order, so the optimal assignment is visible directly from
the quantiles.*

The same monotone map gives grayscale histogram equalization. Each pixel
intensity is transported through the one-dimensional rearrangement
$T=Q_\beta\circ F_\alpha$, where $F_\alpha$ is the cumulative distribution of
the current image intensities and $Q_\beta$ is the quantile function of a target
law. The parameter $t$ below displays the interpolation
$I_t=(1-t)I+tT(I)$.

```{code-cell} ipython3
target_mean = 0.18
target_sigma = 0.105
interpolation = 0.67  # 0 is the original image, 1 is fully equalized
```

```{code-cell} ipython3
:tags: [hide-input]
fig = plot_histogram_equalization(
    target_mean=target_mean,
    target_sigma=target_sigma,
    interpolation=interpolation,
)
```

*Histogram equalization as one-dimensional optimal transport on pixel
intensities. The target mean and standard deviation control the desired gray
level distribution.*

### Two-Dimensional Assignments

In two dimensions, the sorted-quantile trick disappears. For the Euclidean cost
$c(x,y)=\|x-y\|$, optimal segments cannot cross, but non-crossing alone is not
a complete certificate of optimality.

:::{admonition} Proposition: Non-crossing optimal matchings
:class: important
In dimension two, for $c(x,y)=\|x-y\|$, if $\sigma$ is an optimal assignment,
then the segments $[x_i,y_{\sigma(i)}]$ cannot cross.
:::

The reason this local rule is not enough is combinatorial. If $n$ sources and
$n$ targets are placed alternately on the boundary of a convex polygon, the
number of non-crossing perfect matchings is the Catalan number

```{math}
C_n=\frac{1}{n+1}\binom{2n}{n}
\sim \frac{4^n}{\sqrt{\pi}n^{3/2}}.
```

Even after forbidding crossings, there are still exponentially many candidates.
The full assignment problem needs a global certificate.

The next experiment reuses the disk-to-annulus geometry of the book figure, but
allows the reader to change the number of points, the data geometry, and the
cost exponents $p$ in $c(x,y)=\|x-y\|^p$.

```{code-cell} ipython3
n_points_2d = 36
source_shape = "disk"       # disk, annulus, two_blobs, three_blobs, crescent
target_shape = "annulus"    # disk, annulus, two_blobs, three_blobs, crescent
cost_powers = (1, 2, 6)
seed = 2074
```

```{code-cell} ipython3
:tags: [hide-input]
fig = plot_cost_power_sweep(
    n_points=n_points_2d,
    source_shape=source_shape,
    target_shape=target_shape,
    cost_powers=cost_powers,
    seed=seed,
)
```

*Exact assignments between the same two clouds for several powers of the
Euclidean distance. Increasing $p$ punishes the longest edges more severely and
can reorganize the whole permutation.*

### From Assignments to Couplings

The strict assignment model assumes equal cardinalities and equal weights. As
soon as the target resolution changes, or as soon as target masses are not
uniform, a permutation no longer describes the feasible transports. One needs a
nonnegative matrix $P$ whose row and column sums match the prescribed masses:

```{math}
\CouplingsD(a,b) =
\left\{P \in \RR_+^{n\times m} \;:\;
P\mathbf{1}_m=a,\quad P^\top\mathbf{1}_n=b
\right\}.
```

The following cell displays relaxed transport plans on the same clouds. Setting
one entry of `epsilons` to `0` solves the exact linear program; positive values
use entropic regularization, which turns a sparse plan into a smoother one.
This is a small preview of the Sinkhorn chapter.

```{code-cell} ipython3
n_source = 36
n_target = 18
weight_mode = "angular"     # uniform, angular, right_heavy
weight_strength = 1.4
epsilons = (0.0, 0.03, 0.12)
```

```{code-cell} ipython3
:tags: [hide-input]
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

*Relaxed transport plan with unequal target resolution and nonuniform target
masses. Positive $\varepsilon$ uses entropic regularization, so the plan becomes
soft rather than a sparse linear-programming vertex.*

### Matching Algorithms

The Hungarian method and auction algorithms solve the finite assignment problem
without enumerating permutations. Both can be read through dual prices. In the
Hungarian method, one maintains numbers $(u_i,v_j)$ satisfying

```{math}
u_i+v_j \leq C_{i,j}
\qquad\text{for all } i,j.
```

Edges where equality holds form the equality graph. The algorithm augments a
partial matching only along equality edges, and updates the prices when the
current equality graph is not yet rich enough. If a perfect matching lies in
the equality graph, then for every permutation $\tau$,

```{math}
\sum_i C_{i,\tau(i)}
\geq \sum_i u_i+\sum_j v_j
= \sum_i C_{i,\sigma(i)},
```

so the matching $\sigma$ is optimal. This is the first appearance of the
primal-dual certificate viewpoint that will reappear for Kantorovich duality
and Sinkhorn scaling.

## What This Prototype Establishes

This chapter uses the migration pattern intended for the rest of the web book:

- keep mathematical prose and references near the LaTeX source;
- convert each static figure into a small executable scene;
- hide the technical implementation behind stable helper functions;
- expose only the variables that change the mathematical behavior.

The next natural chapters to migrate are Monge and Kantorovich, because their
figures reuse the same point-cloud and coupling vocabulary introduced here.
