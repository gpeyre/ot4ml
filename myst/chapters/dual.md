---
title: Dual Problem
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-dual)=

Duality turns the transport problem into a search for potentials rather than
couplings. This chapter explains why potentials certify optimality, how
$c$-transforms regularize them, and why the quadratic case reveals convex
analysis behind Brenier maps. Linear-programming duality gives the discrete
picture {cite:p}`bertsimas1997introduction`, while the continuous form is one
of the central theorems of optimal transport {cite:p}`Villani03,SantambrogioBook`.

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

(sec-discrete-dual)=
## Discrete Dual

The discrete dual gives finite-dimensional certificates of optimality. Its
complementary-slackness conditions identify where an optimal coupling can put
mass.

(def-admissible-potentials)=
:::{admonition} Definition: Admissible Potentials
:class: important
For a cost matrix $\C\in\RR^{n\times m}$ and weights
$a\in\simplex_n$, $b\in\simplex_m$, a pair
$(f,g)\in\RR^n\times\RR^m$ is admissible if it lies below the cost:

```{math}
:label: eq-feasible-potential
\mathcal{D}_\C
\eqdef
\left\{
(f,g)\in\RR^n\times\RR^m
\;:\;
f_i+g_j\le \C_{ij}
\quad\text{for all } i,j
\right\}.
```

Equivalently, $f\oplus g\le \C$ entrywise.
:::

The two vectors play the role of source and target prices; admissibility means
that no transported pair is priced above its travel cost. The discrete
Kantorovich problem is a linear program. Hence its value can be computed either
by minimizing over couplings or by maximizing over a pair of dual vectors.

(prop-duality-discr)=
:::{admonition} Proposition: Discrete Kantorovich Duality
:class: important
For a cost matrix $\C\in\RR^{n\times m}$ and weights
$a\in\simplex_n$, $b\in\simplex_m$,

```{math}
:label: eq-dual
\mathcal{L}_\C(a,b)
=
\max_{(f,g)\in\mathcal{D}_\C}
\langle f,a\rangle+\langle g,b\rangle.
```
:::

:::{dropdown} Proof
Start from the primal problem

```{math}
\min_{\P\ge0,\;\P\mathbf{1}_m=a,\;\P^\top\mathbf{1}_n=b}
\langle \C,\P\rangle
```

Introduce multipliers $(f,g)$ for its two marginal constraints. The
Lagrangian is

```{math}
\mathcal L(\P,f,g)
=
\langle \C,\P\rangle
+\langle a-\P\mathbf{1}_m,f\rangle
+\langle b-\P^\top\mathbf{1}_n,g\rangle .
```

For fixed potentials, the dual function is

```{math}
\inf_{\P\ge0}\mathcal L(\P,f,g)
=
\langle a,f\rangle+\langle b,g\rangle
+\inf_{\P\ge0}\langle \C-(f\oplus g),\P\rangle.
```

The last infimum is zero when $\C_{ij}-f_i-g_j\ge0$ for all $i,j$, and
$-\infty$ otherwise. The primal coupling polytope is nonempty because it
contains $a\otimes b$, and it is compact. Finite-dimensional
linear-programming strong duality and attainment therefore give
{eq}`eq-dual`.
:::

(prop-discrete-complementary-slackness)=
:::{admonition} Proposition: Discrete Complementary Slackness
:class: important
For every feasible plan $\P$ and admissible pair $(f,g)$,

```{math}
\langle \C,\P\rangle-\langle f,a\rangle-\langle g,b\rangle
=
\sum_{i,j}\P_{ij}(\C_{ij}-f_i-g_j)\ge0.
```

They are primal and dual optimal if and only if

```{math}
:label: eq-mk-pd-rel-web
\operatorname{supp}(\P)
\subset
\left\{(i,j): f_i+g_j=\C_{ij}\right\}.
```
:::

:::{dropdown} Proof
The marginal constraints give
$\langle f,a\rangle+\langle g,b\rangle
=\sum_{i,j}\P_{ij}(f_i+g_j)$, proving the gap identity. All summands are
nonnegative. If the two feasible objects are optimal, strong duality makes
their gap zero, so every summand with $\P_{ij}>0$ vanishes. Conversely, the
contact condition makes the gap zero and weak duality forces optimality.
:::

Thus potentials are not transport maps themselves. They are certificates, and
their equality set with the cost matrix is where an optimal coupling is
allowed to place mass.

Figure {ref}`fig:dual-kantorovich-discrete-potentials` shows these finite-dimensional certificates on a one-dimensional quadratic problem.

(fig:dual-kantorovich-discrete-potentials)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("dual-kantorovich-discrete-potentials")
```

*Discrete Kantorovich dual potentials for the quadratic cost
$\C_{ij}=|x_i-y_j|^2$. The upper strip shows the fixed source histogram in red
and the target histogram in blue. The lower strip shows optimal dual vectors
$(f,g)$, with a gauge chosen so that $\langle f,a\rangle=0$. Complementary
slackness states that mass can be transported only through entries where
$f_i+g_j=\C_{ij}$.*
:::

The interactive demo varies the target law and the number of bins. The lower curves
are reconstructed from the active monotone transport graph, so the equality
set moves as the coupling support changes.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the geometry and slack controls to see feasible dual potentials touch the cost surface exactly on matched pairs.
:::

<iframe class="ot4ml-live-frame" title="Discrete dual potential controls" src="../live/dual-discrete.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

The formula {eq}`eq-dual` also shows that
$(a,b)\mapsto\mathcal{L}_\C(a,b)$ is convex, being a supremum of linear
functions. From the primal formulation, $\C\mapsto\mathcal{L}_\C(a,b)$ is
concave.

## General Formulation

The continuous dual is the analytic counterpart of the discrete linear
program. It uses continuous potentials because measures are naturally probed
through integration.

### Continuous Duality

The finite-dimensional price vectors become continuous test functions. The
pairing is
$\langle f,\alpha\rangle\eqdef\int f\,\d\alpha$.

(prop-kantorovich-duality-general)=
:::{admonition} Proposition: Kantorovich Duality
:class: important
Assume that $\X$ and $\Y$ are compact metric spaces and that
$c\in\Cc(\X\times\Y)$. Then

```{math}
:label: eq-dual-generic
\mathcal{L}_c(\alpha,\beta)
=
\max_{(f,g)\in\mathcal{D}_c}
\int_\X f(x)\,\d\alpha(x)
+
\int_\Y g(y)\,\d\beta(y),
```

where

```{math}
:label: eq-dfn-pot-dual-web
\mathcal{D}_c
\eqdef
\left\{
(f,g)\in\Cc(\X)\times\Cc(\Y)
\;:\;
f(x)+g(y)\le c(x,y)
\quad\text{for all }(x,y)
\right\}.
```

The same formula extends under the usual lower-semicontinuity and
integrability assumptions, replacing maxima by suprema when dual optimizers
need not exist.
:::

:::{dropdown} Proof
Weak duality is immediate. If $f(x)+g(y)\le c(x,y)$ and
$\pi\in\Couplings(\alpha,\beta)$, then

```{math}
\int f\,\d\alpha+\int g\,\d\beta
=
\int (f(x)+g(y))\,\d\pi(x,y)
\le
\int c(x,y)\,\d\pi(x,y).
```

Taking the supremum over admissible potentials and the infimum over couplings
gives the first inequality.

For the reverse inequality, let $V=\mathcal L_c(\alpha,\beta)$ and consider
the cone

```{math}
\mathcal K=
\left\{
\left(\pi_1,\pi_2,\int c\,\d\pi+r\right)
:
\pi\in\mathcal M_+(\X\times\Y),\ r\ge0
\right\}.
```

The cone is closed in the product weak topology: convergence of one marginal
bounds the masses, compactness provides a weakly convergent subnet, and
continuity of marginalization and of $\pi\mapsto\int c\,\d\pi$ identifies its
limit. For $t<V$, the point $z_t=(\alpha,\beta,t)$ is not in $\mathcal K$.
Strong separation gives $F\in\Cc(\X)$, $G\in\Cc(\Y)$ and $\lambda\in\RR$
such that

```{math}
\int F\,\d\alpha+\int G\,\d\beta+\lambda t<0
\le
\int F\,\d\eta+\int G\,\d\zeta+\lambda s
\quad
\text{for all }(\eta,\zeta,s)\in\mathcal K.
```

Testing $(0,0,r)$ gives $\lambda\ge0$, and testing Dirac generators gives
$F(x)+G(y)+\lambda c(x,y)\ge0$. If $\lambda=0$, integration against
$\alpha\otimes\beta$ contradicts strict separation, so $\lambda>0$. Therefore
$f=-F/\lambda$ and $g=-G/\lambda$ are admissible and have dual value greater
than $t$. Letting $t\uparrow V$ proves equality.

For attainment, take a maximizing sequence and successively set

```{math}
\widetilde g_k(y)=\min_x\{c(x,y)-f_k(x)\},
\qquad
\widetilde f_k(x)=\min_y\{c(x,y)-\widetilde g_k(y)\}.
```

These replacements preserve feasibility and improve the objective. Normalize
$\widetilde f_k(x_0)=0$. The envelopes inherit the uniform moduli of $c$ in
the two variables and are uniformly bounded. Arzela--Ascoli gives a uniformly
convergent maximizing subsequence, whose limit remains admissible.
:::

(rem-kantorovich-dual-attainment)=
:::{admonition} Remark: Dual attainment from $c$-transforms
:class: ot4ml-remark

The final part of the proof uses the $c$-transforms introduced below. A
continuous cost on a compact product has uniform moduli in both variables, and
transformed potentials inherit them by Proposition
{ref}`prop-c-transform-lipschitz`. Lipschitz costs give
equi-Lipschitz potentials as a special case, but Lipschitz continuity is not
required for attainment.
:::


### Complementary Slackness

As in the finite problem, equality of primal and dual values localizes the
support of every optimal coupling.

(prop-continuous-complementary-slackness)=
:::{admonition} Proposition: Continuous Complementary Slackness
:class: important
For $\pi\in\Couplings(\alpha,\beta)$ and admissible $(f,g)$,

```{math}
\int c\,\d\pi-\int f\,\d\alpha-\int g\,\d\beta
=
\int\bigl(c(x,y)-f(x)-g(y)\bigr)\,\d\pi(x,y)\ge0.
```

The coupling and potentials are optimal if and only if the gap vanishes. In
that case,

```{math}
:label: eq-mk-pd-rel-cont-web
\operatorname{supp}(\pi)
\subset
\left\{(x,y):f(x)+g(y)=c(x,y)\right\}.
```
:::

:::{dropdown} Proof
The marginal identities give the equality, and admissibility gives
nonnegativity. A zero gap is equivalent to equality of feasible primal and
dual values. The slack is continuous and nonnegative; if it were positive at
a point of $\operatorname{supp}(\pi)$, it would have positive integral on a
neighborhood of that point.
:::

The discrete case corresponds to dual vectors that sample the continuous
potentials, $(f_i,g_j)=(f(x_i),g(y_j))$.

For the one-dimensional quadratic cost, the continuous potentials can be read
from the monotone map $T=F_\beta^{-1}\circ F_\alpha$: on the active graph,
$f'(x)=2(x-T(x))$ and $g=f^c$.

Figure {ref}`fig:dual-kantorovich-continuous-potentials` shows how these continuous potentials adapt to increasingly multimodal source and target densities while retaining the same complementary-slackness interpretation.

(fig:dual-kantorovich-continuous-potentials)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("dual-kantorovich-continuous-potentials")
```

*Continuous Kantorovich potentials for the same source and target families as
the discrete potential figure. The upper strips show the source density
$\alpha$ in red and the target density $\beta$ in blue. The lower strips show
potentials $f$ and $g=f^c$ for the quadratic cost $c(x,y)=|x-y|^2$. The
equality set $f(x)+g(y)=c(x,y)$ contains the monotone transport graph.*
:::

The same optimality condition is even more explicit if one plots the slack

```{math}
s(x,y)=c(x,y)-f(x)-g(y).
```

Dual feasibility is the statement $s\ge 0$, while complementary slackness says
that an optimal coupling can only live where this slack vanishes. The next
figure shows this zero set for increasingly structured one-dimensional
transports, including a Gaussian source mapped to a separated three-component
target mixture: the transported graph is not guessed from the potentials
separately, but appears as the contact valley of the dual inequality.

Figure {ref}`fig:dual-complementary-slackness-contacts` shows this zero set for increasingly structured one-dimensional transports, including a Gaussian source mapped to a three-component target mixture: the transported graph is not guessed from the potentials separately, but appears as the contact valley of the dual inequality.

(fig:dual-complementary-slackness-contacts)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("dual-complementary-slackness-contacts", width=760)
```

*Complementary slackness contacts for one-dimensional quadratic OT. From left to
right: two Gaussian densities, two-component Gaussian-mixture densities, and one
Gaussian density transported to a separated three-component mixture. The central
heatmaps display the nonnegative dual slack $s(x,y)=|x-y|^2-f(x)-g(y)$: pale
colors mark the contact valley and darker blue means larger strict slack. The
red top strip and blue side strip show the source and target densities. The
violet curve is the quantile transport contact graph $(x,T(x))$, where
$s(x,T(x))=0$ and the optimal Monge plan is supported.*
:::

The interactive view computes the monotone map from numerical quantiles and then
integrates $f'(x)=2(x-T(x))$. It makes clear that the potentials change
smoothly with the target law, even though the equality set remains a thin
transport graph.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the regularity and time controls to view continuous Kantorovich potentials and their active transport contacts.
:::

<iframe class="ot4ml-live-frame" title="Continuous dual potential controls" src="../live/dual-continuous.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

In contrast to the primal problem, dual attainment is not immediate: the
constraint set is not compact and the objective is not coercive. The
$c$-transform selects canonical representatives that inherit the modulus of
continuity of the cost; a gauge condition then makes the family compact.

(sec-c-transfo)=
## c-Transforms

The $c$-transform is the operation that improves potentials without changing
feasibility. It is both a proof device for dual attainment and the route from
duality to Brenier's convex potentials.

### Best-Response Potentials

Keeping a dual potential $f$ fixed, one can maximize in closed form over the
second potential in the dual problem:

```{math}
\sup_g
\left\{
\int g\,\d\beta
\;:\;
g(y)\le c(x,y)-f(x)
\quad\text{for all }x,y
\right\}.
```

The constraint is equivalent to $g(y)\le f^c(y)$.

(def-c-transform)=
:::{admonition} Definition: $c$-Transform
:class: important
For a real-valued function $f:\X\to\RR$, its $c$-transform is the
extended-real-valued function

```{math}
:label: eq-c-transform-web
f^c(y)
\eqdef
\inf_{x\in\X}\{c(x,y)-f(x)\}.
```

For a real-valued function $g:\Y\to\RR$, the $\bar c$-transform associated
with $\bar c(y,x)=c(x,y)$ is

```{math}
g^{\bar c}(x)
\eqdef
\inf_{y\in\Y}\{c(x,y)-g(y)\}.
```

On compact spaces, if $c$ and the input potential are continuous, these
infima are finite minima and the transformed potential is continuous.
:::

(rem-discrete-c-transform)=
:::{admonition} Remark: Discrete $c$-transform
:class: ot4ml-remark

If $\al=\sum_{i=1}^n a_i\de_{x_i}$ and $\be=\sum_{j=1}^m b_j\de_{y_j}$, the same definition applies to the finite spaces $\X=\{x_i\}_i$ and $\Y=\{y_j\}_j$. The dual potentials are then vectors $(\fD,\gD)\in\RR^n\times\RR^m$, as in Section {ref}`sec-discrete-dual`, and the cost is the matrix $\C\in\RR^{n\times m}$ with entries

```{math}
\C_{i,j}=c(x_i,y_j).
```

With the present sign convention $f\oplus g\leq c$, the discrete transform of $\fD$ is the vector $\fD^\C\in\RR^m$ defined by

```{math}
(\fD^\C)_j
=
\min_{1\leq i\leq n} \C_{i,j}-\fD_i.
```

This is a minimum because feasibility imposes the upper bound $\gD_j\leq \C_{i,j}-\fD_i$ for every $i$. Thus the largest feasible best response is the minimum of these upper bounds; formulas with a maximum correspond to a different sign convention, not to the dual constraint {eq}`eq-dual`.
With $\bar\C\eqdef\C^\top$, the opposite transform of $\gD$ is

```{math}
\gD^{\bar\C}\eqdef \gD^{\C^\top}\in\RR^n,
\qquad
(\gD^{\bar\C})_i
=
\min_{1\leq j\leq m} \C_{i,j}-\gD_j.
```

Thus the continuous best-response operation reduces exactly to taking column minima for $\fD^\C$, or row minima for $\gD^{\bar\C}$, in shifted cost matrices. Chapter {ref}`sec-semidiscr-w1` studies the hybrid case where $\al$ has a density and $\be$ is discrete; then $g^{\bar c}(x)=\min_j c(x,y_j)-g_j$ is a lower envelope over target atoms, and the regions where each atom realizes the minimum are the Laguerre cells for the quadratic cost.
:::


Since $\beta$ is nonnegative, maximizing $\int g\,\d\beta$ is achieved by taking
$g=f^c$ on the support of $\beta$, equivalently $\beta$-almost everywhere.

Figure {ref}`fig:dual-c-transform-envelope` makes the best-response operation geometric: the discrete $c$-transform is the lower envelope of the shifted cost functions.

(fig:dual-c-transform-envelope)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("dual-c-transform-envelope")
```

*Discrete $c$-transform as a lower envelope for costs $c_p(x,y)=|x-y|^p$. The
red circles are four source atoms $x_i$ with potential values $f_i$; the gray
curves are $y\mapsto c_p(x_i,y)-f_i$; the colored curve is their lower
envelope $f^c(y)=\min_i c_p(x_i,y)-f_i$. This is the semi-discrete situation
where the source space is finite.*
:::

The interactive envelope view exposes the exponent, the number of atoms, and the
potential amplitude. This is the local mechanism behind many dual
regularity statements: taking a pointwise minimum of translated costs inherits
regularity from the cost.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the support and curvature controls to see the c-transform as a lower envelope of shifted cost functions.
:::

<iframe class="ot4ml-live-frame" title="c-transform envelope controls" src="../live/dual-envelope.html" loading="lazy" style="width:100%;height:480px;border:0;display:block;"></iframe>

(prop-c-transform-semi-relaxed)=
:::{admonition} Proposition: $c$-Transforms Solve The Semi-Relaxed Problems
:class: important
Under the compactness and continuity hypotheses above, for fixed
$f\in\Cc(\X)$ the maximizers of the dual objective over all
$g\in\Cc(\Y)$ such that
$f\oplus g\le c$ are exactly the functions satisfying $g=f^c$
$\beta$-almost everywhere. Equivalently,

```{math}
\inf_{\substack{\pi\in\mathcal M_+^1(\X\times\Y)\\\pi_2=\beta}}
\int c(x,y)\,\d\pi(x,y)-\int f(x)\,\d\pi_1(x)
=
\int f^c(y)\,\d\beta(y).
```

Symmetrically, for fixed $g$, the maximizers over $f$ satisfy
$f=g^{\bar c}$ $\alpha$-almost everywhere.
:::

:::{dropdown} Proof
The constraint $f(x)+g(y)\le c(x,y)$ for all $x$ is equivalent, for each fixed
$y$, to

```{math}
g(y)\le \inf_x c(x,y)-f(x)=f^c(y).
```

Since $\beta$ is nonnegative, the largest possible value of
$\int g\,\d\beta$ is obtained by saturating this pointwise upper bound on the
support of $\beta$. The proof for $f=g^{\bar c}$ is identical after exchanging
the two marginals.

For the primal formula, disintegrate any feasible plan as
$\pi(\d x,\d y)=\pi_y(\d x)\beta(\d y)$. Then

```{math}
\int c\,\d\pi-\int f\,\d\pi_1
=
\int
\left(
\int (c(x,y)-f(x))\,\d\pi_y(x)
\right)\d\beta(y)
\ge
\int f^c(y)\,\d\beta(y).
```

The argmin sets are nonempty and compact, and the measurable maximum theorem
provides a Borel selector $x_\star(y)$. The coupling
$\pi(\d x,\d y)=\delta_{x_\star(y)}(\d x)\beta(\d y)$ attains equality.
:::

The updates must be sequential:

```{math}
(f,g)\longmapsto(f,f^c)
\longmapsto(f^{c\bar c},f^c).
```

Each step preserves feasibility and improves the objective. Simultaneously
replacing an arbitrary old pair by $(g^{\bar c},f^c)$ need not preserve
feasibility, because the two best responses were computed against different
old coordinates. For example, if $c\equiv0$ and $f=g\equiv-1$, both transforms
equal $1$ and their simultaneous update violates the dual constraint.
Functions of the form $f^c$ and $g^{\bar c}$ are called
$c$-concave and $\bar c$-concave, respectively.

(prop-c-transform-lipschitz)=
:::{admonition} Proposition: Modulus Stability Of $c$-Transforms
:class: important
If

```{math}
|c(x,y)-c(x,y')|
\le\omega_\Y(d_\Y(y,y'))
```

uniformly in $x$, then every finite $f^c$ has modulus $\omega_\Y$. The
symmetric statement holds for $g^{\bar c}$ in the first variable. In
particular, a uniform $L$-Lipschitz bound on the cost gives an
$L$-Lipschitz transform.
:::

:::{dropdown} Proof
For each $x$, set $F_x(y)=c(x,y)-f(x)$ and
$F(y)=f^c(y)=\inf_x F_x(y)$. Since all functions $F_x$ share the same
modulus,

```{math}
|F(y)-F(y')|
=
\left|\inf_x F_x(y)-\inf_x F_x(y')\right|
\le
\sup_x |F_x(y)-F_x(y')|
\le
\omega_\Y(d_\Y(y,y')).
```

The proof in the first variable is identical.
:::

This stability is crucial for dual attainment. On compact spaces, continuity
of $c$ already supplies uniform moduli; sequential closure and a harmless
additive gauge then give compactness by Arzela--Ascoli.

### Euclidean Case

The Euclidean quadratic cost is the model case where $c$-transforms become
ordinary convex conjugates after removing quadratic terms. This is the
algebraic bridge between Kantorovich duality and Brenier maps.

Normalize the quadratic cost as $q(x,y)=\frac12\norm{x-y}^2$. For any
$\pi\in\Couplings(\alpha,\beta)$,

```{math}
\int q(x,y)\,\d\pi(x,y)
=
\frac12\int\norm{x}^2\,\d\alpha(x)
+
\frac12\int\norm{y}^2\,\d\beta(y)
-\int \langle x,y\rangle\,\d\pi(x,y).
```

The first two terms depend only on the marginals, so quadratic OT reduces to
$c(x,y)=-\langle x,y\rangle$. For this bilinear cost,

```{math}
f^c(y)
=
\inf_x -\langle x,y\rangle-f(x)
=
-(-f)^*(y),
\qquad
h^*(y)\eqdef\sup_x \langle x,y\rangle-h(x).
```

On full Euclidean space,
$f^{c\bar c}=-(-f)^{**}$. Hence $c$-closed functions are negatives of lower
semicontinuous convex functions, and closure gives the smallest upper
semicontinuous concave majorant. On restricted compact domains, the supporting
slopes must additionally belong to the opposite domain.

(rem-proof-brenier)=
:::{admonition} Remark: Proof of Brenier's theorem
:class: ot4ml-remark

Let $\alpha,\beta\in\mathcal P_2(\RR^d)$ and assume that $\alpha$ has a
density. For $q(x,y)=\frac12\norm{x-y}^2$, let $(u,v)$ be a closed optimal
dual pair and set

```{math}
\phi(x)=\frac12\norm{x}^2-u(x),
\qquad
\psi(y)=\frac12\norm{y}^2-v(y).
```

The dual constraint becomes
$\phi(x)+\psi(y)\ge\langle x,y\rangle$. The two closure relations give
$\psi=\phi^*$ and $\phi=\psi^*$, so $\phi$ is convex. Complementary slackness
shows that an optimal plan satisfies

```{math}
\operatorname{supp}(\pi)
\subset
\left\{(x,y):\phi(x)+\phi^*(y)=\langle x,y\rangle\right\}.
```

Fenchel equality is equivalent to $y\in\partial\phi(x)$. Convex functions are
differentiable Lebesgue-almost everywhere, hence $\alpha$-almost everywhere,
so the subdifferential is almost surely a singleton. This yields the Brenier
map $T=\nabla\phi$. Multiplying the cost by two rescales the potentials but
does not change the map.
:::


### Why Hard Alternating Optimization Stops

A crucial property of the Legendre transform is that $f^{***}=f^*$, while
$f^{**}$ is the lower semicontinuous convex envelope of a proper $f$. Analogous
identities explain why exact alternating best responses stop after one cycle
for
$c$-transforms {cite:p}`rockafellar2015convex`.

(prop-c-transform-algebra)=
:::{admonition} Proposition: Algebra Of $c$-Transforms
:class: important
The following identities hold, with inequalities understood pointwise:

```{math}
\text{(i) } f\le f' \Rightarrow f^c\ge f'^c,
\qquad
\text{(ii) } f^{c\bar c}\ge f,
```

```{math}
\text{(iii) } g^{\bar c c}\ge g,
\qquad
\text{(iv) } f^{c\bar c c}=f^c.
```
:::

:::{dropdown} Proof
The first inequality follows directly from the minus sign. For every $x,y$,

```{math}
f^c(y)=\inf_{x'}\{c(x',y)-f(x')\}
\le c(x,y)-f(x).
```

Thus $c(x,y)-f^c(y)\ge f(x)$, and taking the infimum over $y$ proves (ii).
The relation $g^{\bar c c}\ge g$ is symmetric. To prove (iv), use order
reversal with $f\le f^{c\bar c}$ to get
$f^c\ge f^{c\bar c c}$. Applying (iii) to $g=f^c$ gives the reverse
inequality.
:::

This invariance shows that exact block maximization reaches a coordinatewise
fixed point after one full cycle:

```{math}
:label: eq-iter-c-trans-web
(f,g)\mapsto(f,f^c)
\mapsto(f^{c\bar c},f^c)
\mapsto(f^{c\bar c},f^{c\bar c c})
=(f^{c\bar c},f^c).
```


The resulting pair is dual feasible but need not maximize the joint objective,
because its value still depends on the arbitrary initial $f$. Entropic
regularization replaces hard minima by soft log-sum-exp responses and leads to
the nontrivial Sinkhorn scaling iteration.

For $c(x,y)=-xy$ on compact intervals, $f^{c\bar c}$ is the smallest concave
majorant representable with slopes in the opposite interval. In the displayed
example that interval contains every relevant supporting slope, so the
restricted closure is the ordinary concave envelope.

In Figure {ref}`fig:dual-alternating-c-transform-failure`, the displayed interval contains all relevant supporting slopes, so this restricted closure agrees with the ordinary concave envelope.

(fig:dual-alternating-c-transform-failure)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("dual-alternating-c-transform-failure")
```

*Hard $c$-transforms for the bilinear cost $c(x,y)=-xy$. Dark curves are the
double-transform closures $f^{c\bar c}$ and $g^{\bar c c}$, while dashed
lighter curves are the one-sided best responses after a harmless gauge shift.
The domains contain the relevant supporting slopes, so these restricted
closures coincide with ordinary concave majorants. Exact best responses are
useful for certificates but do not give the smooth iterative dynamics of
entropic regularization.*
:::

The final interactive demo turns this algebra into a visible operation: change the
roughness of the starting potential and observe that the hard double transform
jumps directly to its concave closure.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the iteration and asymmetry controls to see why alternating c-transforms can stall or fail without the right assumptions.
:::

<iframe class="ot4ml-live-frame" title="Alternating c-transform controls" src="../live/dual-alternate.html" loading="lazy" style="width:100%;height:480px;border:0;display:block;"></iframe>
