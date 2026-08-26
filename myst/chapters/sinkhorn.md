---
title: "Entropic Regularization: Sinkhorn Algorithm"
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-sinkhorn)=

Entropic regularization makes optimal transport smooth, strictly convex and
scalable. This chapter first explains the discrete KL-regularized problem,
derives Sinkhorn's alternating matrix scaling algorithm, and then rewrites the
same construction as a relative-entropy projection problem. It then records
the general continuous formulation, develops the dual soft-transform picture,
and presents the main convex regularization variants and the debiased Sinkhorn
divergence. Its stochastic path-space interpretation is developed later in
Section {ref}`sec-path-space-schrodinger`, alongside dynamic optimal transport.
A final section records a less standard
viewpoint: after fixing the potential gauge, the finite-dimensional Sinkhorn
equations admit a local holomorphic continuation to complex values of the
temperature.

The presentation connects the older matrix-scaling literature
{cite:p}`Sinkhorn64,SinkhornKnopp67,Sinkhorn67` with modern entropic OT
{cite:p}`CuturiSinkhorn,peyre2019computational`.

:::{admonition} Guiding Comparison
:class: tip
The unregularized Kantorovich problem is a linear program. Entropy replaces it
by a smooth strictly convex problem whose optimizer has the scaling form
$P=\operatorname{diag}(u)K\operatorname{diag}(v)$. The cost is a biased OT
approximation, but the payoff is differentiability and matrix-vector
iterations.
:::

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

(sec-entropic-discrete)=
## Entropic Regularization for Discrete Measures

Entropy turns a possibly non-unique linear program into a unique smooth
problem. The price is bias, but the reward is differentiability and fast
scaling algorithms.

(def-discrete-shannon-boltzmann-entropy)=
:::{admonition} Definition: Discrete Shannon--Boltzmann Entropy
:class: important
For a nonnegative matrix $\P$, its Shannon--Boltzmann entropy is

```{math}
H(\P)
\eqdef
-\sum_{i,j}\P_{i,j}\log \P_{i,j},
```

with the convention $0\log 0=0$.
:::

Using this entropy as a regularizing function gives the approximate transport
value

```{math}
:label: eq-regularized-discrete-web
\mathcal{L}_{\C}^{\epsilon}(a,b)
\eqdef
\min_{\P\in\mathbf{U}(a,b)}
\langle \P,\C\rangle
-
\epsilon H(\P).
```

Equivalently, the regularizer is
$\epsilon\sum_{i,j}\P_{i,j}\log \P_{i,j}$. It penalizes concentrated couplings
and makes the objective strictly convex on the relative interior of the
transport polytope.

(prop-entropic-unique)=
:::{admonition} Proposition: Existence and Uniqueness of Entropic OT
:class: important
Assume that $a,b$ are probability histograms and that $\C$ is finite. For every
$\epsilon>0$, problem {eq}`eq-regularized-discrete-web` admits a unique
minimizer. If all entries of $a$ and $b$ are positive, then this minimizer is
positive on every entry.
:::

:::{dropdown} Proof
The transport polytope is non-empty and compact, and the objective is
continuous with the convention $0\log0=0$, so a minimizer exists. On the
relative interior,

```{math}
-\partial^2 H(\P)=\operatorname{diag}(1/\P_{i,j})
```

is positive definite on every non-zero feasible direction. Hence
$-H$ is strictly convex on the polytope, which gives uniqueness.

If $a_i,b_j>0$ and a minimizer had $\P_{i,j}=0$, then the perturbation
$\P_t=(1-t)\P+t\,a\otimes b$ remains feasible for small $t>0$. The derivative
of $r\log r$ at zero along a positive direction is $-\infty$, so the objective
decreases, contradicting optimality.
:::

### Smoothing Effect

The entropy acts as a barrier for positivity and makes
$\mathcal{L}_{\C}^{\epsilon}(a,b)$ smooth in $a$, $b$, and $\C$ as long as these
variables stay in the relative interior. As $\epsilon\to+\infty$, the
minimizer converges to the independent coupling $a\otimes b$; as
$\epsilon\to0$, it approaches the optimal face of the original transport
linear program.

Figure {ref}`fig:sinkhorn-entropy-lp-geometry` visualizes this temperature-dependent path and contrasts it with a generic logarithmic barrier on linear-programming slacks.

(fig:sinkhorn-entropy-lp-geometry)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-entropy-lp-geometry")
```

*Entropic regularization and slack barriers. Large $\epsilon$ selects an
interior reference point, while small $\epsilon$ moves the minimizer toward a
low-cost face of the transport polytope. The second row gives the analogous
entropy-on-slacks picture for a generic linear program.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Move the temperature to see the entropic minimizer travel along the central path from the simplex interior toward the linear-programming vertex.
:::

<iframe class="ot4ml-live-frame" title="Interactive entropy LP geometry panel" src="../live/sinkhorn-entropy-lp-geometry.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

### Entropy Barriers Versus Generic LP Barriers

For a generic linear program $\min_z \ell^\top z$ with constraints
$Az\le b$, one can introduce positive slacks $s=b-Az$ and penalize them by an
entropy. This is a useful analogy, but it is not the standard self-concordant
interior-point barrier. The canonical barrier is the Burg, or reverse-KL,
barrier $-\sum_i\log s_i$, which leads to Newton systems.

Optimal transport is special because entropy is placed on the entries of
$\P$, while the constraints are only row and column marginals. This separable
structure turns Bregman projections into diagonal rescalings, giving the
Sinkhorn iterations.

(rem-entropy-versus-lp-barriers)=
:::{admonition} Remark: Entropy barriers versus generic LP barriers
:class: ot4ml-remark

For a generic linear program $\min_z \ell^\top z$ subject to $Az\leq b$, one can introduce positive slacks $s=b-Az$ and use an entropy-on-slacks penalty $H(s)=\sum_i s_i(\log s_i-1)$ as a smooth interior regularization. This is a useful analogy for Figure {ref}`fig:sinkhorn-entropy-lp-geometry`, but it is not the standard interior-point barrier for linear programming. The canonical barrier on the positive orthant is the Burg, or reverse-KL, logarithmic barrier $-\sum_i\log s_i$; it is self-concordant and therefore fits the Newton theory of interior-point methods {cite:p}`nesterov1994interior`. The price is that a generic Newton step solves a dense linear system, leading to cubic per-iteration scaling in the relevant number of variables or constraints. Optimal transport is special: the entropy is placed on the entries of $\P$, while the constraints are only the row and column marginals. This separable structure turns the associated Bregman projections into diagonal rescalings, hence into the Sinkhorn matrix-vector iterations developed next.
:::

## Sinkhorn's Algorithm

Sinkhorn's algorithm is alternating normalization of rows and columns. The
key point is that the optimizer of the entropic problem has a multiplicative
scaling form.

(prop-regularized-primal)=
:::{admonition} Proposition: Scaling Form of Entropic OT
:class: important
$\P$ is the unique solution of {eq}`eq-regularized-discrete-web` if and only if
there exist nonnegative vectors $u\in\RR_+^n$ and $v\in\RR_+^m$ such that

```{math}
:label: eq-scaling-form-web
\P_{i,j}=u_iK_{i,j}v_j,
\qquad
K_{i,j}\eqdef\exp(-\C_{i,j}/\epsilon),
```

and $\P\in\mathbf{U}(a,b)$.
:::

:::{dropdown} Proof
After removing zero-mass rows and columns, the minimizer is strictly positive,
so the positivity constraint can be ignored in the first-order conditions.
Introduce Lagrange multipliers $f\in\RR^n$ and $g\in\RR^m$ for the two
marginal constraints. The Lagrangian is

```{math}
\mathcal{L}(\P,f,g)
=
\langle \P,\C\rangle
+
\epsilon\sum_{i,j}\P_{i,j}\log \P_{i,j}
+
\langle f,a-\P\mathbf 1\rangle
+
\langle g,b-\P^\top\mathbf 1\rangle .
```

Stationarity with respect to $\P_{i,j}$ gives

```{math}
\C_{i,j}
+
\epsilon(\log \P_{i,j}+1)
-
f_i-g_j
=0.
```

Thus
$\P_{i,j}=\exp((f_i+g_j-\C_{i,j})/\epsilon-1)$, which is exactly the scaling
form after absorbing the one-body terms into $u$ and $v$.
:::

In matrix notation, $\P=\operatorname{diag}(u)K\operatorname{diag}(v)$. The
marginal constraints become

```{math}
:label: eq-sinkhorn-constraints-web
u\odot(Kv)=a,
\qquad
v\odot(K^\top u)=b.
```

Solving each equation in turn gives Sinkhorn's algorithm:

```{math}
:label: eq-sinkhorn-web
u^{(\ell+1)}
=
\frac{a}{Kv^{(\ell)}},
\qquad
v^{(\ell+1)}
=
\frac{b}{K^\top u^{(\ell+1)}}.
```

The division is entrywise. The scaling vectors are not unique: multiplying
$u$ by $\lambda>0$ and $v$ by $1/\lambda$ leaves $\P$ unchanged.

Figure {ref}`fig:sinkhorn-marginal-errors` exposes the alternating feasibility mechanism on a small matrix: each row or column normalization enforces one marginal exactly while generally perturbing the other.

(fig:sinkhorn-marginal-errors)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-marginal-errors")
```

*Marginal constraints during Sinkhorn scaling. Row normalizations align the
red source marginal and leave a blue defect; column normalizations align the
blue target marginal and leave a red defect.*
:::

The interactive demo exposes the alternating row/column normalization directly.
Change the half-step count to see the current coupling acquire one marginal,
lose the other, and then converge toward both.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the iteration, regularization, and mass controls to watch Sinkhorn row and column scalings enforce the marginals.
:::

<iframe class="ot4ml-live-frame" title="Sinkhorn scaling controls" src="../live/sinkhorn-scaling.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

Figure {ref}`fig:sinkhorn-continuous-marginal-scaling` shows the same alternating projection mechanism on a dense one-dimensional discretization, where the marginal defects appear as continuous side curves.

(fig:sinkhorn-continuous-marginal-scaling)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-continuous-marginal-scaling")
```

*Dense Sinkhorn scaling for one-dimensional Gaussian-mixture marginals. The
violet side curves are the current row and column sums; the red and blue
curves are the prescribed marginals.*
:::

After convergence, the regularization strength controls how much of the Gibbs
kernel remains visible in the optimal plan. Small $\epsilon$ produces a
concentrated transport band, while larger $\epsilon$ spreads the same
marginals into a smoother coupling.

Figure {ref}`fig:sinkhorn-coupling-iterations` compares these converged plans at four temperatures while keeping both marginals fixed.

(fig:sinkhorn-coupling-iterations)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-coupling-iterations")
```

*Final Sinkhorn couplings for the same one-dimensional marginals and four
regularization strengths. Decreasing $\epsilon$ sharpens the plan toward an
optimal-transport graph; increasing $\epsilon$ keeps more of the product
structure.*
:::

Before that, Figure {ref}`fig:sinkhorn-potentials-iterations` tracks the same Sinkhorn scaling in dual variables.

(fig:sinkhorn-potentials-iterations)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-potentials-iterations")
```

*KL-normalized dual potentials along the scaling iteration. The logarithmic
scaling potentials stabilize as the row/column normalizations converge.*
:::

The next interactive demo keeps the iteration count high and varies the temperature.
It is the quickest way to see the geometry-bias tradeoff: low temperature is
geometric and sharp, high temperature is smooth and closer to independence.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the regularization slider to compare sparse exact-looking couplings with smoother entropic plans and potentials.
:::

<iframe class="ot4ml-live-frame" title="Sinkhorn epsilon controls" src="../live/sinkhorn-epsilon.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

Complexity bounds for Sinkhorn and comparisons with accelerated first-order
methods are discussed in
{cite:p}`altschuler2017near,pmlr-v80-dvurechensky18a,knight2008sinkhorn`.
For a dense $n\times m$ problem, each iteration costs one multiplication by
$K$ and one by $K^\top$, so the cost scales like $Cnm$ for $\C$ iterations.
For fixed positive $\epsilon$, the marginal error eventually has a linear
regime, but small $\epsilon$ makes the Gibbs kernel more peaked and scaling
harder.

Figure {ref}`fig:sinkhorn-linear-rate-epsilon` complements the complexity discussion by plotting the marginal defect across half-steps and showing how smaller temperatures slow the observed linear regime.

(fig:sinkhorn-linear-rate-epsilon)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-linear-rate-epsilon")
```

*Marginal violation along Sinkhorn half-steps for several values of
$\epsilon$. Smaller $\epsilon$ gives sharper transport geometry but slower
scaling.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Vary $\epsilon$ and the conditioning parameters to compare observed residual decay with Hilbert-metric convergence guides.
:::

(rem-sinkhorn-separable-gaussian)=
:::{admonition} Remark: Separable Gaussian kernels on grids
:class: ot4ml-remark

When the samples lie on a Cartesian grid and $c(x,y)=\norm{x-y}^2$, the Gibbs kernel is Gaussian and factorizes along coordinates. If the grid has $q$ points per axis in dimension $d$, so that $N=q^d$ grid points are used, then

```{math}
K(x,y)=\exp\!\left(-\frac{\norm{x-y}^2}{\epsilon}\right)
=
\prod_{\ell=1}^d
\exp\!\left(-\frac{(x_\ell-y_\ell)^2}{\epsilon}\right).
```

Multiplication by $K$ can therefore be applied by successively multiplying along each coordinate direction, equivalently by applying one-dimensional Gaussian kernel operators along the axes. On a periodic or sufficiently padded uniform grid these are literal discrete convolutions. A direct dense one-dimensional multiplication costs $O(q^2)$ on each of the $q^{d-1}$ coordinate lines, and this is repeated for $d$ axes. Hence one Sinkhorn half-step costs

```{math}
:label: eq-separable-gaussian-half-step

O(d\,q^{d+1})=O(d\,N^{1+1/d})
```

instead of $O(N^2)$. With FFT-based or truncated Gaussian convolutions, the same separability can be pushed further, but the simple tensor-product estimate already explains why grid-based Sinkhorn can scale much better than a generic dense coupling.
:::

(alg-sinkhorn-scaling)=
:::{admonition} Algorithm: Sinkhorn scaling
:class: ot4ml-algorithm

**Input:** Positive weights $\a,\b$, cost matrix $\C$, regularization $\epsilon>0$, tolerance $\mathrm{tol}$.

**Output:** Entropic coupling $\P$.

**Initialize:** Set $\K_{ij}=e^{-\C_{ij}/\epsilon}$, $\vD^{(0)}=\ones_m$, $r^{(0)}=+\infty$, and $\ell=0$.

**While** $r^{(\ell)}>\mathrm{tol}$ **do**:

>
> **Set** $\ell\leftarrow \ell+1$.
>
> $\uD^{(\ell)}=\frac{\a}{\K\vD^{(\ell-1)}}.$
>
> $\vD^{(\ell)}=\frac{\b}{\transp{\K}\uD^{(\ell)}}.$
>
> $\P^{(\ell)}=\diag(\uD^{(\ell)})\K\diag(\vD^{(\ell)}).$
>
> **Set** $r^{(\ell)}=\max\{\norm{\P^{(\ell)}\ones_m-\a}_1,\norm{(\P^{(\ell)})^\top\ones_n-\b}_1\}$.

**Return** $\P^{(\ell)}$.
:::


## Reformulation Using Relative Entropy

The KL formulation identifies Sinkhorn as a projection method. It also
prepares the continuous and unbalanced settings, where a reference measure is
essential.

### Relative Entropy

A convenient tool to reformulate and normalize discrete entropy is relative
entropy. It turns entropy regularization into a finite-dimensional projection
problem and admits a direct measure-theoretic extension.

(def-discrete-relative-entropy)=
:::{admonition} Definition: Discrete Relative Entropy
:class: important
For nonnegative matrices $P,Q$ of the same size, the generalized relative
entropy is

```{math}
:label: eq-kl-defn
\operatorname{KL}(P|Q)
\eqdef
\sum_{i,j}
P_{i,j}\log\frac{P_{i,j}}{Q_{i,j}}
-
P_{i,j}
+
Q_{i,j}.
```

The convention is $0\log0=0$, and
$\operatorname{KL}(P|Q)=+\infty$ if $Q_{i,j}=0$ but $P_{i,j}>0$ for some
entry.
:::

For matrices with the same total mass, the affine terms cancel and

```{math}
\operatorname{KL}(P|Q)
=
\sum_{i,j}P_{i,j}\log\frac{P_{i,j}}{Q_{i,j}}.
```

On fixed-mass couplings, taking $Q=\mathbf 1_{n\times m}$ is equivalent to
subtracting the Shannon--Boltzmann entropy.

(prop-kl-distance-like)=
:::{admonition} Proposition: Non-Negativity and Definiteness of Relative Entropy
For all $P,Q\in\RR_+^{n\times m}$, one has
$\operatorname{KL}(P|Q)\ge0$, with equality if and only if $P=Q$.
:::

:::{dropdown} Proof
Write $\phi(s)=s\log s-s+1$. Then $\phi(s)\ge0$, with equality only at
$s=1$. If $P$ is not absolutely continuous with respect to $Q$, the
divergence is infinite. Otherwise,

```{math}
\operatorname{KL}(P|Q)
=
\sum_{i,j:\,Q_{i,j}>0}Q_{i,j}\phi(P_{i,j}/Q_{i,j})
\ge0.
```

Equality forces equality entrywise, including on the zero set of $Q$.
:::

### KL Reformulation of Regularized OT

Choosing the tensor product $\a\otimes\b=(\a_i\b_j)_{i,j}$ as reference measure
leads to the normalized problem

```{math}
:label: eq-regularized-discr-rescaled
\min_{\P\in\CouplingsD(\a,\b)}
\langle \P,\C\rangle
+
\epsilon\KLD(\P|\a\otimes\b).
```

For every $\P\in\CouplingsD(\a,\b)$,

```{math}
\langle \P,\C\rangle+\epsilon\KLD(\P|\a\otimes\b)
=
\langle \P,\C\rangle-\epsilon\HD(\P)
+\epsilon\bigl(\HD(\a)+\HD(\b)\bigr).
```

Hence this problem has exactly the same minimizer as the original entropic OT
problem, while its optimal value is
$\MKD_\C^\epsilon(\a,\b)+\epsilon(\HD(\a)+\HD(\b))$.
The normalization becomes substantive in unbalanced OT, where changing the
reference measure is no longer merely an additive shift.

(prop-kl-shift)=
:::{admonition} Proposition: Reference Measure Shift for KL
After removing zero-mass rows and columns, assume
$a,a'\in\simplex_n$ and $b,b'\in\simplex_m$ have positive entries. For every
$P\in\mathbf U(a,b)$,

```{math}
\operatorname{KL}(P|a\otimes b)
=
\operatorname{KL}(P|a'\otimes b')
-
\operatorname{KL}(a|a')
-
\operatorname{KL}(b|b').
```

Consequently, for fixed positive marginals, changing the positive
tensor-product reference only adds a constant on the transport polytope.
:::

:::{dropdown} Proof
Expand the logarithm and use the marginal constraints:

```{math}
\begin{aligned}
\operatorname{KL}(P|a\otimes b)
&=
\operatorname{KL}(P|a'\otimes b')
+
\sum_i a_i\log\frac{a_i'}{a_i}
+
\sum_j b_j\log\frac{b_j'}{b_j} \\
&=
\operatorname{KL}(P|a'\otimes b')
-
\operatorname{KL}(a|a')
-
\operatorname{KL}(b|b').
\end{aligned}
```
:::

The tensor-product reference is nevertheless useful when supports vary. It
makes explicit which entries may vanish and passes cleanly to the continuous
formulation.

Figure {ref}`fig:sinkhorn-dual-potentials-epsilon` shows how the corresponding KL-normalized dual potentials deform with temperature, from nearly hard Kantorovich potentials to smoother log-sum-exp profiles.

(fig:sinkhorn-dual-potentials-epsilon)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-dual-potentials-epsilon")
```

*KL-normalized Sinkhorn dual potentials for one-dimensional Gaussian-mixture
histograms. For $\epsilon=0.010$ the curves are already close to the
unregularized one-dimensional Kantorovich potentials; increasing $\epsilon$
turns this hard $c$-transform geometry into smoother log-sum-exp potentials.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change $\epsilon$ to compare the dual potentials with the
corresponding entropic coupling.
:::

<iframe class="ot4ml-live-frame" title="Sinkhorn epsilon controls" src="../live/sinkhorn-epsilon.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

(prop-convergence-eps)=
:::{admonition} Proposition: Convergence with $\epsilon$
:class: important
Assume, after removing zero-mass rows and columns, that $a$ and $b$ are
positive and that $C$ is finite. The unique solution $P_\epsilon$ converges,
as $\epsilon\to0$, to the maximum-entropy solution among all optimal solutions
of the Kantorovich problem. Moreover,

```{math}
P_\epsilon \to a\otimes b
\qquad
\text{as }
\epsilon\to+\infty.
```
:::

:::{dropdown} Proof Sketch
For $\epsilon\to0$, use compactness of the transport polytope and compare the
optimality inequalities for the entropic problem against an exact
Kantorovich optimizer. The cost gap is bounded by
$\epsilon$ times a KL difference, so every cluster point is cost-optimal; after
dividing by $\epsilon$, the cluster point is the KL-minimizer on the optimal
face.

For $\epsilon\to+\infty$, subtract a constant from $C$ so that $C\ge0$.
Testing the objective at $a\otimes b$ gives

```{math}
\operatorname{KL}(P_\epsilon|a\otimes b)
\le
\frac{\langle C,a\otimes b\rangle}{\epsilon},
```

so the KL divergence to $a\otimes b$ vanishes.
:::

Figure {ref}`fig:sinkhorn-plan-epsilon` illustrates the two limiting regimes established above: the plan approaches a sparse optimal coupling as $\epsilon\downarrow0$ and the product coupling as $\epsilon$ grows.

(fig:sinkhorn-plan-epsilon)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-plan-epsilon")
```

*Entropically regularized couplings between the red disk and blue annulus
point clouds. The plans are strictly positive for every $\epsilon>0$, but the
visible mass pattern evolves from nearly radial and sparse to diffuse as
$\epsilon$ increases.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the same temperature control to see positivity,
diffusion, and sharpening of entropic couplings in a one-dimensional setting.
:::

<iframe class="ot4ml-live-frame" title="Sinkhorn epsilon coupling controls" src="../live/sinkhorn-epsilon.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

## General Formulation

The continuous formulation replaces matrices by measures and discrete KL by
relative entropy. This section records the measure-theoretic problem, explains
how the temperature $\epsilon$ connects exact transport to the independent
product coupling, and states the two asymptotic regimes that are useful later:
a large-temperature expansion around independence and a small-temperature
expansion around quadratic optimal transport.

### Measure Formulation

The only structural change from the discrete problem is that matrix entries are
replaced by densities with respect to a product reference measure. For
probability measures $\alpha$ and $\beta$, define

```{math}
:label: eq-entropic-generic-web
\mathcal{L}_{c}^{\epsilon}(\alpha,\beta)
\eqdef
\min_{\pi\in\Couplings(\alpha,\beta)}
\int_{\X\times\Y}c(x,y)\,\d\pi(x,y)
+
\epsilon\operatorname{KL}(\pi|\alpha\otimes\beta).
```

(def-measure-relative-entropy)=
:::{admonition} Definition: Relative Entropy of Measures
:class: important
For nonnegative measures $\pi$ and $\xi$ on $\X\times\Y$,

```{math}
:label: eq-defn-rel-entropy

\operatorname{KL}(\pi|\xi)
\eqdef
\int_{\X\times\Y}
\log\left(\frac{\d\pi}{\d\xi}(x,y)\right)\d\pi(x,y)
+
\xi(\X\times\Y)-\pi(\X\times\Y).
```

By convention, $\operatorname{KL}(\pi|\xi)=+\infty$ if $\pi$ is not
absolutely continuous with respect to $\xi$.
:::

For fixed balanced marginals, the specific product reference only matters up
to additive constants, provided the reference marginals are mutually
absolutely continuous with $\alpha$ and $\beta$. Its support still matters: it
determines which couplings have finite entropy.

The dynamic counterpart of this measure formulation is the path-space
Schrödinger problem developed in Section {ref}`sec-path-space-schrodinger`: it
replaces an endpoint coupling by a probability law on noisy trajectories with
the same prescribed endpoint marginals.

### Probabilistic Interpretation

(def-mutual-information)=
:::{admonition} Definition: Mutual Information
If $(X,Y)\sim\pi$ have marginals $X\sim\alpha$ and $Y\sim\beta$, their mutual
information is

```{math}
\mathcal I(X,Y)
\eqdef
\operatorname{KL}(\pi|\alpha\otimes\beta).
```

It is nonnegative and vanishes if and only if $X$ and $Y$ are independent.
:::

With this terminology, the entropic problem is

```{math}
\inf_{X\sim\alpha,\;Y\sim\beta}
\mathbb E(c(X,Y))+\epsilon\mathcal I(X,Y).
```

Large $\epsilon$ favors nearly independent endpoints, while small $\epsilon$
suppresses endpoint randomness and recovers an optimal Monge--Kantorovich
coupling in the limit. When the unregularized quadratic problem has a Brenier
map, this limiting coupling is deterministic.

### Sinkhorn for General Measures

The multiplicative scaling structure extends from matrices to positive
functions. Define the Gibbs kernel and its two integral operators by

```{math}
:label: eq-continuous-sinkhorn-operators
\begin{aligned}
k_\epsilon(x,y)&\eqdef\exp\!\left(-\frac{c(x,y)}{\epsilon}\right),\\
(\mathcal K_\epsilon v)(x)
&\eqdef\int_\Yy k_\epsilon(x,y)v(y)\d\be(y),
&
(\mathcal K_\epsilon^*u)(y)
&\eqdef\int_\Xx k_\epsilon(x,y)u(x)\d\al(x).
\end{aligned}
```

Fubini's theorem gives the adjoint identity
$\int_\Xx u\mathcal K_\epsilon v\d\al
=\int_\Yy v\mathcal K_\epsilon^*u\d\be$.
For compact marginal supports and continuous $c$, Propositions
{ref}`prop-continuous-entropic-duality` and
{ref}`prop-entropic-dual-potentials` provide optimal dual potentials
$(f_\epsilon,g_\epsilon)$. Set $u_\epsilon=e^{f_\epsilon/\epsilon}$ and
$v_\epsilon=e^{g_\epsilon/\epsilon}$. The continuous density
law {eq}`eq-continuous-entropic-density-law-web` then becomes

```{math}
:label: eq-continuous-sinkhorn-scaling
\frac{\d\pi_\epsilon}{\d(\al\otimes\be)}(x,y)
=u_\epsilon(x)k_\epsilon(x,y)v_\epsilon(y),
```

Because $\al\otimes\be$ already contains the prescribed marginals, their
target densities with respect to $\al$ and $\be$ are both one. Thus

```{math}
u_\epsilon\mathcal K_\epsilon v_\epsilon=1
\quad \al\text{-a.e.},
\qquad
v_\epsilon\mathcal K_\epsilon^*u_\epsilon=1
\quad \be\text{-a.e.}
```

Starting, for instance, from $v^{(0)}=1$, continuous Sinkhorn alternately
enforces these two identities:

```{math}
:label: eq-continuous-sinkhorn-iteration
u^{(\ell+1)}=\frac{1}{\mathcal K_\epsilon v^{(\ell)}},
\qquad
v^{(\ell+1)}=\frac{1}{\mathcal K_\epsilon^*u^{(\ell+1)}}.
```

Equivalently, pointwise,

```{math}
\begin{aligned}
u^{(\ell+1)}(x)
&=\frac{1}{\displaystyle\int_\Yy k_\epsilon(x,y)v^{(\ell)}(y)\d\be(y)},\\
v^{(\ell+1)}(y)
&=\frac{1}{\displaystyle\int_\Xx k_\epsilon(x,y)u^{(\ell+1)}(x)\d\al(x)}.
\end{aligned}
```

Given $v^{(\ell)}$, the first update produces an intermediate coupling with
$\Xx$-marginal $\al$; the second produces one with $\Yy$-marginal $\be$, while
generally perturbing the first marginal again. The scalings retain the gauge
$(u,v)\mapsto(\lambda u,v/\lambda)$.

There is one useful situation in which no iteration is required: choose the
target by applying the normalized Gibbs kernel itself to the source.

(prop-sinkhorn-gibbs-pushforward)=
:::{admonition} Proposition: Closed-Form Gibbs Coupling
:class: important
Let $\beta_0$ be a sigma-finite reference measure on $\Y$ and suppose that

```{math}
Z_\epsilon(x)
\eqdef
\int_\Y k_\epsilon(x,y)\d\beta_0(y)
\in(0,+\infty)
\qquad\text{for $\alpha$-a.e. }x.
```

Define the normalized Gibbs transition and its output density by

```{math}
:label: eq-gibbs-pushforward-target
p_\epsilon(x,y)
\eqdef
\frac{k_\epsilon(x,y)}{Z_\epsilon(x)},
\qquad
q_\epsilon(y)
\eqdef
\int_\X p_\epsilon(x,y)\d\alpha(x),
\qquad
\d\beta_\epsilon=q_\epsilon\d\beta_0.
```

Assume that $\log Z_\epsilon\in L^1(\alpha)$,
$\log q_\epsilon\in L^1(\beta_\epsilon)$, and the plan below has finite
entropic objective. Then the unique solution of the entropic problem between
$\alpha$ and $\beta_\epsilon$ is

```{math}
:label: eq-closed-form-gibbs-coupling
\d\pi_\epsilon(x,y)
=
p_\epsilon(x,y)\d\alpha(x)\d\beta_0(y).
```

Relative to $\alpha\otimes\beta_\epsilon$, its Sinkhorn scalings are

```{math}
\frac{\d\pi_\epsilon}{\d(\alpha\otimes\beta_\epsilon)}(x,y)
=
\frac{k_\epsilon(x,y)}{Z_\epsilon(x)q_\epsilon(y)}
=
u_\epsilon(x)k_\epsilon(x,y)v_\epsilon(y),
\qquad
u_\epsilon=\frac1{Z_\epsilon},
\quad
v_\epsilon=\frac1{q_\epsilon}.
```
:::

:::{dropdown} Proof
By construction, $p_\epsilon(x,\cdot)\d\beta_0$ is a probability measure.
Fubini's theorem therefore shows that
{eq}`eq-closed-form-gibbs-coupling` has first marginal $\alpha$ and second
marginal $\beta_\epsilon$.

Let $\gamma\in\Couplings(\alpha,\beta_\epsilon)$ have finite objective. Since
$-\epsilon\log k_\epsilon=c$, the displayed density of $\pi_\epsilon$ gives

```{math}
\epsilon\KL(\gamma|\pi_\epsilon)
=
\int c\,\d\gamma
+
\epsilon\KL(\gamma|\alpha\otimes\beta_\epsilon)
+
\epsilon\int\log Z_\epsilon\,\d\alpha
+
\epsilon\int\log q_\epsilon\,\d\beta_\epsilon.
```

The last two terms depend only on the prescribed marginals. Minimizing the
entropic objective is therefore equivalent to minimizing
$\KL(\gamma|\pi_\epsilon)$, whose unique minimizer is
$\gamma=\pi_\epsilon$.
:::

If $k_\epsilon(x,\cdot)$ is already normalized with respect to $\beta_0$, then
$Z_\epsilon=1$ and {eq}`eq-gibbs-pushforward-target` reduces to

```{math}
\frac{\d\beta_\epsilon}{\d\beta_0}(y)
=
\int_\X k_\epsilon(x,y)\d\alpha(x).
```

For example, let $\X=\Y=\RR^d$, let $\beta_0$ be Lebesgue measure, and take
$c(x,y)=\norm{x-y}^2$. Then $Z_\epsilon=(\pi\epsilon)^{d/2}$ and

```{math}
p_\epsilon(x,y)
=
(\pi\epsilon)^{-d/2}e^{-\norm{x-y}^2/\epsilon},
\qquad
\beta_\epsilon
=
\alpha*\Gaussian\!\left(0,\frac{\epsilon}{2}\Id\right).
```

Equivalently, the closed-form coupling is the law of
$(X,X+\sqrt{\epsilon/2}\,G)$ for independent $X\sim\alpha$ and
$G\sim\Gaussian(0,\Id)$. Time-indexed Gaussian blurrings are the forward
noising mechanism behind diffusion models, with an additional deterministic
rescaling for variance-preserving Ornstein--Uhlenbeck schedules; see
{ref}`par-diffusion-model-connection`.

For discrete measures, setting $\uD_i=\a_i u(x_i)$ and
$\vD_j=\b_jv(y_j)$ gives
$\P_{i,j}=\a_i\b_j u(x_i)\K_{i,j}v(y_j)=\uD_i\K_{i,j}\vD_j$, so the functional
iteration reduces exactly to the matrix Sinkhorn iteration
{eq}`eq-sinkhorn-web`. Its logarithmic interpretation as continuous dual block
ascent is derived in {ref}`par-continuous-dual-sinkhorn`. Continuous
convergence is revisited through a generalized Fortet-type monotonicity argument
in Section {ref}`sec-sinkhorn-monotone`; the finite-dimensional linear rate is
studied through Hilbert's metric in Section {ref}`sec-sinkhorn-hilbert`.

### Convergence with $\epsilon$

The continuous problem has the same qualitative temperature limits as the
finite-dimensional problem, but the zero-temperature selection is subtler. For
quadratic transport between smooth densities, the limiting OT plan is typically
supported on a graph and is therefore singular with respect to
$\alpha\otimes\beta$. Thus the robust statement is weak convergence of
minimizers. This is the standard $\Gamma$-convergence mechanism for entropic
OT {cite:p}`leonard2012schrodinger,2017-carlier-SIMA`; the density hypothesis
below isolates the only approximation point needed in the proof.
(prop-continuous-convergence-epsilon)=

:::{admonition} Proposition: Convergence with $\epsilon$ for measures
:class: important
Let $\X$ and $\Y$ be compact metric spaces, let $c\in C(\X\times\Y)$, and
let $\alpha\in\mathcal P(\X)$ and $\beta\in\mathcal P(\Y)$. Assume that
finite-entropy couplings are dense in $\Couplings(\alpha,\beta)$ for weak
convergence with convergence of the cost integral. If $\pi_\epsilon$ minimizes
{eq}`eq-entropic-generic-web`, then

```{math}
\mathcal{L}_{c}^{\epsilon}(\alpha,\beta)
\longrightarrow
\mathcal{L}_{c}(\alpha,\beta)
\qquad(\epsilon\downarrow0),
```

and every weak cluster point of $\pi_\epsilon$ is an exact optimal plan. If the
exact optimal plan is unique, then the whole sequence converges to it. In
particular, for $c(x,y)=\|x-y\|^2$ and $\alpha$ absolutely continuous,
$\pi_\epsilon\rightharpoonup(\mathrm{Id},T)_\sharp\alpha$, where $T$ is the
Brenier map.

As $\epsilon\to+\infty$,

```{math}
\pi_\epsilon\to\alpha\otimes\beta
\quad\text{in total variation},
\qquad
\mathcal{L}_{c}^{\epsilon}(\alpha,\beta)
\to
\int_{\X\times\Y}c(x,y)\,\d\alpha(x)\d\beta(y).
```
:::

The proof is the standard $\Gamma$-convergence argument: the entropy is
nonnegative, finite-entropy couplings provide recovery sequences, and
Pinsker's inequality from Theorem {ref}`thm-pinsker` turns the
large-$\epsilon$ entropy bound into total-variation convergence.

### Large-Temperature Expansion

When $\epsilon$ is large, the entropy dominates and the optimal plan is a small
perturbation of the product coupling. The useful object is the part of the cost
that cannot be absorbed into row and column potentials. Let
$r=\alpha\otimes\beta$ and define

```{math}
\bar c_\X(x)=\int_\Y c(x,y)\,\d\beta(y),\qquad
\bar c_\Y(y)=\int_\X c(x,y)\,\d\alpha(x),\qquad
\bar c=\int_{\X\times\Y}c\,\d r,
```

and

```{math}
c_0(x,y)=c(x,y)-\bar c_\X(x)-\bar c_\Y(y)+\bar c.
```
(prop-large-epsilon-expansion)=

:::{admonition} Proposition: Large-temperature expansion
:class: important
Assume $c\in L^\infty(r)$ and that the large-temperature branch
$p_\epsilon=\d\pi_\epsilon/\d r$ admits an expansion to third order in
$\epsilon^{-1}$ near $0$ in $L^\infty(r)$. Then

```{math}
p_\epsilon(x,y)
=
1-\frac{c_0(x,y)}{\epsilon}
+O(\epsilon^{-2})
\quad\text{in }L^2(r),
```

and

```{math}
\mathcal{L}_{c}^{\epsilon}(\alpha,\beta)
=
\bar c
-
\frac{1}{2\epsilon}
\int_{\X\times\Y}c_0(x,y)^2\,\d r(x,y)
+
\frac{1}{6\epsilon^2}
\int_{\X\times\Y}c_0(x,y)^3\,\d r(x,y)
+O(\epsilon^{-3}).
```

With

```{math}
A(x)=\int_\Y c_0(x,y)^2\,\d\beta(y),\qquad
B(y)=\int_\X c_0(x,y)^2\,\d\alpha(x),\qquad
\sigma^2=\int_{\X\times\Y}c_0^2\,\d r,
```

and the gauge $\int g_\epsilon\,\d\beta=0$, the corresponding potentials
satisfy

```{math}
f_\epsilon(x)
=
\bar c_\X(x)-\frac{A(x)}{2\epsilon}
+O(\epsilon^{-2}),
\qquad
g_\epsilon(y)
=
\bar c_\Y(y)-\bar c
+\frac{\sigma^2-B(y)}{2\epsilon}
+O(\epsilon^{-2}).
```
:::

The coefficient $c_0$ has zero conditional means. The second-order term follows
by expanding the constrained exponential tilt and using this conditional
orthogonality.

### Small-Temperature Expansion for Smooth Densities

At small temperature, entropic transport is a viscous perturbation of quadratic
optimal transport. The expansion contains an $\epsilon\log\epsilon$ term from
the Gaussian normalization of Brownian bridges, an endpoint entropy correction,
and a Fisher-information term along the McCann interpolation. The formula below
translates the small-noise Schrödinger expansion to the convention
$\|x-y\|^2+\epsilon\operatorname{KL}(\cdot|\alpha\otimes\beta)$
{cite:p}`ConfortiTamanini2021EntropicDerivative,ChizatRoussillonLegerVialardPeyre2020Sinkhorn`.
(prop-small-epsilon-expansion)=

:::{admonition} Proposition: Small-temperature quadratic expansion
:class: important
Let $\alpha=\rho_0\,\d x$ and $\beta=\rho_1\,\d x$ be probability measures on
$\RR^d$ with bounded compactly supported densities. Let
$\alpha_t=\rho_t\,\d x$ be their quadratic displacement interpolation and
assume

```{math}
\mathcal I_{\mathrm{geo}}(\alpha,\beta)
=
\int_0^1\int_{\RR^d}
\|\nabla\log\rho_t(x)\|^2\rho_t(x)\,\d x\,\d t
<+\infty.
```

For $c(x,y)=\|x-y\|^2$ and
$\mathrm H(\alpha)=\int_{\RR^d}\rho_0\log\rho_0\,\d x$,

```{math}
\mathcal{L}_{\|\cdot\|^2}^{\epsilon}(\alpha,\beta)
=
\mathcal W_2^2(\alpha,\beta)
-
\frac{d\epsilon}{2}\log(\pi\epsilon)
-
\frac{\epsilon}{2}
\left(\mathrm H(\alpha)+\mathrm H(\beta)\right)
+
\frac{\epsilon^2}{16}\mathcal I_{\mathrm{geo}}(\alpha,\beta)
+
o(\epsilon^2).
```

If, in addition, the endpoint densities are smooth and positive on their
supports and the optimal map is a smooth non-degenerate diffeomorphism, then
normalized Sinkhorn potentials converge locally uniformly to Kantorovich
potentials on the interiors of the supports
{cite:p}`NutzWiesel2022EntropicPotentials`. In the gauge
$\int g_\epsilon\,\d\beta=0$, the scalar part satisfies

```{math}
\int f_\epsilon\,\d\alpha
=
\mathcal L_{\|\cdot\|^2}^{\epsilon}(\alpha,\beta),
```

so it has the displayed expansion. Spatial order-$\epsilon$ corrections come
from the Laplace prefactors in the soft $c$-transform equations.
:::

The Brownian entropy used in the proof is relative to the sigma-finite
endpoint measure $p_T(x,y)\,\d x\d y$, and therefore uses
$\mathscr H(\pi|\xi)=\int\log(\d\pi/\d\xi)\,\d\pi$ rather than the
finite-measure generalized KL above. This distinction is what fixes the
Gaussian normalization and the $\epsilon\log\epsilon$ coefficient.

## Dual of Sinkhorn

The dual point of view replaces couplings by potentials and soft
$c$-transforms. It is the right formulation for stabilized implementations
and differentiation.

### Discrete Dual

The KL-normalized problem has the dual

```{math}
:label: eq-dual-formulation
\min_{\P\in\mathbf U(a,b)}
\langle \P,\C\rangle+\epsilon\operatorname{KL}(\P|a\otimes b)
=
\max_{f,g}
\left[
\langle f,a\rangle+\langle g,b\rangle
-
\epsilon\sum_{i,j}
\exp\left(\frac{f_i+g_j-\C_{i,j}}{\epsilon}\right)a_i b_j
+
\epsilon
\right].
```

The optimal potentials are linked to the scaling variables through

```{math}
u_i=a_i e^{f_i/\epsilon},
\qquad
v_j=b_j e^{g_j/\epsilon}.
```

### Discrete Soft $c$-Transforms

For fixed $g$, maximizing the dual with respect to $f$ gives

```{math}
f_i
=
-\epsilon\log
\sum_j
\exp\left(\frac{g_j-\C_{i,j}}{\epsilon}\right)b_j.
```

This is a smoothed minimum.

(def-discrete-soft-c-transform)=
:::{admonition} Definition: Soft-Min and Discrete Soft $c$-Transform
:class: important
For $h\in\RR^m$ and weights $b\in\simplex_m$,

```{math}
\min_b^\epsilon(h)
\eqdef
-\epsilon\log\sum_j e^{-h_j/\epsilon}b_j.
```

It converges to $\min_{j:\,b_j>0}h_j$ as $\epsilon\to0$, and hence to
$\min_j h_j$ when all weights are positive. Given a cost matrix $\C$, the
discrete soft $c$-transforms are

```{math}
f_i=\min_b^\epsilon(\C_{i,\cdot}-g),
\qquad
g_j=\min_a^\epsilon(\C_{\cdot,j}-f).
```
:::

Exponentiating the alternating soft-transform iterations recovers Sinkhorn's
algorithm. For small $\epsilon$, one must compute the log-sum-exp terms with
the usual stabilization trick: subtract the minimum before exponentiating and
add it back afterward.

Figure {ref}`fig:sinkhorn-soft-c-transform-epsilon` visualizes the corresponding soft minimum: decreasing $\epsilon$ sharpens the smooth best response toward the hard $c$-transform envelope.

(fig:sinkhorn-soft-c-transform-epsilon)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-soft-c-transform-epsilon")
```

*Soft $c$-transforms for decreasing temperatures. A positive $\epsilon$
replaces the hard lower envelope by a log-sum-exp soft minimum.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the epsilon and potential controls to see how the hard c-transform is softened by log-sum-exp smoothing.
:::

<iframe class="ot4ml-live-frame" title="Sinkhorn soft c-transform controls" src="../live/sinkhorn-soft-c.html" loading="lazy" style="width:100%;height:460px;border:0;display:block;"></iframe>

### Continuous Dual and Soft-Transforms

The continuous formula follows from the same entropy conjugacy as its matrix
counterpart; it is not a discretization heuristic.

(prop-continuous-entropic-duality)=
:::{admonition} Proposition: Continuous Entropic Duality
:class: important
Let $\X$ and $\Y$ be compact metric spaces, let
$\alpha\in\mathcal P(\X)$ and $\beta\in\mathcal P(\Y)$, and let
$c\in\mathcal C(\X\times\Y)$. For every $\epsilon>0$, the continuous
KL-regularized problem satisfies

```{math}
:label: eq-dual-sinkhorn-cont-web
\mathcal{L}_{c}^{\epsilon}(\alpha,\beta)
=
\sup_{f,g}
\mathcal D_\epsilon(f,g),
```

where

```{math}
:label: eq-dual-sinkhorn-objective-web
\mathcal D_\epsilon(f,g)
=
\int f\,\d\alpha+\int g\,\d\beta
-
\epsilon
\int
\left(
e^{(f(x)+g(y)-c(x,y))/\epsilon}
-
1
\right)
\d\alpha(x)\d\beta(y).
```

If $\pi^\star$ and $(f^\star,g^\star)$ are primal and dual optimizers, then

```{math}
:label: eq-continuous-entropic-density-law-web
\frac{\d\pi^\star}{\d(\alpha\otimes\beta)}(x,y)
=
\exp\!\left(
\frac{f^\star(x)+g^\star(y)-c(x,y)}{\epsilon}
\right)
\qquad (\alpha\otimes\beta)\text{-a.e.}
```
:::

:::{dropdown} Proof
Write $\xi=\alpha\otimes\beta$ and
$\phi(r)=r\log r-r+1$. Every plan with finite objective has a density
$r=\d\pi/\d\xi$. Its two marginal constraints read

```{math}
\int_\Y r(x,y)\,\d\beta(y)=1\quad\alpha\text{-a.e.},
\qquad
\int_\X r(x,y)\,\d\alpha(x)=1\quad\beta\text{-a.e.}
```

Introducing potentials $(f,g)$ for these constraints gives the Lagrangian

```{math}
\int f\,\d\alpha+\int g\,\d\beta
+\int\!\left[
\epsilon\phi(r)+(c-f-g)r
\right]\d\xi.
```

Since $\phi^*(s)=e^s-1$, pointwise minimization over $r\geq0$ yields

```{math}
\inf_{r\geq0}
\left\{\epsilon\phi(r)+(c-f-g)r\right\}
=
-\epsilon\left(e^{(f+g-c)/\epsilon}-1\right).
```

After integration, this is exactly $\mathcal D_\epsilon(f,g)$, proving weak
duality. Fenchel--Rockafellar entropy duality gives equality: the strictly
positive feasible density $r\equiv1$ supplies the qualification point, and
$c$ is bounded on the compact product. Continuity of $c$ allows the supremum
to be restricted to continuous potentials, since the soft transforms turn
bounded potentials into continuous ones without lowering the dual value.

At primal--dual optimality, equality in the Fenchel inequality forces
$r^\star$ to be the unique pointwise minimizer. Its first-order condition is
$\epsilon\log r^\star+c-f^\star-g^\star=0$, which gives the displayed density
formula after exponentiation.
:::

This is the smooth counterpart of the hard feasibility constraint
$f\oplus g\le c$ from the Kantorovich dual.

(def-continuous-soft-c-transform)=
:::{admonition} Definition: Continuous Soft $c$-Transforms
:class: important
For $f\in\Cc(\X)$ and $g\in\Cc(\Y)$,

```{math}
f^{c,\epsilon}(y)
\eqdef
-\epsilon\log
\int_\X
e^{(f(x)-c(x,y))/\epsilon}
\d\alpha(x),
```

and

```{math}
g^{\bar c,\epsilon}(x)
\eqdef
-\epsilon\log
\int_\Y
e^{(g(y)-c(x,y))/\epsilon}
\d\beta(y).
```
:::

(prop-entropic-dual-potentials)=
:::{admonition} Proposition: Existence and Uniqueness of Entropic Dual Potentials
:class: important
Assume $\X=\operatorname{supp}(\alpha)$ and
$\Y=\operatorname{supp}(\beta)$ are compact and $c$ is continuous. The dual
problem has solutions, and the set of solutions on these supports is

```{math}
(f^\star+\lambda,g^\star-\lambda),
\qquad
\lambda\in\RR .
```
:::

:::{dropdown} Proof Sketch
Normalize potentials by imposing $\int f\,\d\alpha=0$. Replacing a pair of
potentials by the corresponding soft transforms does not decrease the dual
objective. The transformed potentials have oscillations bounded by the
oscillation of $c$, and their modulus of continuity is controlled by the
modulus of continuity of $c$. Arzela--Ascoli gives existence.

Uniqueness on the supports, up to constants, follows from strict convexity of
$H\mapsto\int e^{H/\epsilon}\d(\alpha\otimes\beta)$ on the image of
$(f,g)\mapsto f\oplus g-c$, modulo constants.
:::

(rem-soft-transform-convexity)=
:::{admonition} Remark: Convexity properties of soft transforms
:class: ot4ml-remark

The log-sum-exp part behaves like a smoothed maximum and preserves convexity. Since the soft transform takes the negative of this quantity after inserting the cost, it preserves the usual $c$-concavity structure. In particular, for the bilinear cost $c(x,y)=-\dotp{x}{y}$, the transform $f^{c,\epsilon}$ is concave for any $f$. Therefore, for the quadratic cost $c(x,y)=\norm{x-y}^2/2$, the optimal potentials have the form $f^\star(x)=\norm{x}^2/2-\phi^\star(x)$ and $g^\star(y)=\norm{y}^2/2-\psi^\star(y)$, where $\phi^\star$ and $\psi^\star$ are convex.
:::

(par-continuous-dual-sinkhorn)=
### Dual Sinkhorn for General Measures

The soft transforms are not only regularized analogues of hard
$c$-transforms: they are the exact block-maximization steps of the continuous
dual objective {eq}`eq-dual-sinkhorn-objective-web`. Indeed, for fixed $g$ and
$h\in\Cc(\X)$,

```{math}
\left.\frac{\d}{\d s}\mathcal D_\epsilon(f+s h,g)\right|_{s=0}
=
\int_\X h(x)\left[
1-e^{f(x)/\epsilon}
\int_\Y e^{(g(y)-c(x,y))/\epsilon}\d\beta(y)
\right]\d\alpha(x).
```

Hence exact maximization first over $f$ and then over $g$ gives

```{math}
:label: eq-continuous-dual-sinkhorn-iteration
f^{(\ell+1)}=(g^{(\ell)})^{\bar c,\epsilon},
\qquad
g^{(\ell+1)}=(f^{(\ell+1)})^{c,\epsilon}.
```

The transforms are those of Definition
{ref}`def-continuous-soft-c-transform`. Their decorations record their
domains: the $\bar c$-transform sends a potential on $\Y$ to one on $\X$,
whereas the $c$-transform sends a potential on $\X$ to one on $\Y$.

This dual iteration is exactly the logarithmic form of the continuous scaling
iteration {eq}`eq-continuous-sinkhorn-iteration`. Set
$u^{(\ell)}=e^{f^{(\ell)}/\epsilon}$ and
$v^{(\ell)}=e^{g^{(\ell)}/\epsilon}$. Exponentiating the dual updates and using
the kernel operators {eq}`eq-continuous-sinkhorn-operators` gives

```{math}
u^{(\ell+1)}=\frac{1}{\mathcal K_\epsilon v^{(\ell)}},
\qquad
v^{(\ell+1)}=\frac{1}{\mathcal K_\epsilon^*u^{(\ell+1)}}.
```

The coupling density reconstructed from the current potentials is therefore
$u^{(\ell)}(x)k_\epsilon(x,y)v^{(\ell)}(y)$ with respect to
$\alpha\otimes\beta$, as in {eq}`eq-continuous-sinkhorn-scaling`. At a fixed
point, its two marginals are $\alpha$ and $\beta$; equivalently, the potentials
jointly maximize the continuous dual.


### Neural Dual Solvers

The convex-potential structure above suggests a sample-based alternative to evaluating soft transforms on a grid or on all pairs of samples. For the bilinear cost $c(x,y)=-\dotp{x}{y}$, the signs of the dual potentials are convex: writing $\Phi=-f$ and $\Psi=-g$, the zero-temperature constraint $f(x)+g(y)\leq-\dotp{x}{y}$ becomes

```{math}
\Phi(x)+\Psi(y)\geq \dotp{x}{y}.
```

For the quadratic cost this is the same statement after subtracting the quadratic terms. One can therefore maximize the continuous dual over parameterized convex potentials, estimating the integrals by stochastic samples.

A useful parameterization is given by input-convex neural networks (ICNNs) {cite:p}`amos2017input,makkuva2020optimal`. The construction mirrors elementary closure rules for convex functions: nonnegative linear combinations preserve convexity, composition with a convex nondecreasing scalar nonlinearity preserves convexity, and the ReLU $r\mapsto\max(r,0)$ is both convex and nondecreasing. Thus a feed-forward network with nonnegative hidden-to-hidden weights and affine skip connections from the input defines a convex function of its input. This gives a flexible cone of convex trial potentials, although the finite-dimensional optimization over the network weights is not a convex optimization problem. Universal-approximation statements must be read with this distinction in mind: max-affine functions are dense among continuous convex functions on compact convex sets, and ICNN-type architectures are designed to inherit this approximation principle. General ReLU universal approximation results, such as the width $d+1$ theorem on compact subsets of $\RR^d$ {cite:p}`hanin2019universal`, provide useful background but do not by themselves enforce convexity. In practice, neural dual solvers trade exact Sinkhorn scaling for amortized stochastic optimization of the dual potentials.

(rem-sinkhorn-gaussian-marginals)=
:::{admonition} Remark: Gaussian marginals
:class: ot4ml-remark

For $c(x,y)=\norm{x-y}^2$ and Gaussian marginals, the soft transforms preserve quadratic functions, because products and convolutions of Gaussian functions remain Gaussian. Hence optimal entropic potentials are quadratic and the optimal entropic coupling is Gaussian. Section {ref}`sec-gaussian-sinkhorn` makes this finite-dimensional closure explicit.
:::

(alg-log-domain-sinkhorn)=
:::{admonition} Algorithm: Log-domain Sinkhorn by soft transforms
:class: ot4ml-algorithm

**Input:** Positive weights $\a,\b$, cost matrix $\C$, regularization $\epsilon>0$, tolerance $\mathrm{tol}$.

**Output:** Entropic coupling $\P$ computed from stabilized potentials.

**Initialize:** Set $\gD^{(0)}=0$, $\eta^{(0)}=+\infty$, and $\ell=0$.

**While** $\eta^{(\ell)}>\mathrm{tol}$ **do**:

>
> **Set** $\ell\leftarrow \ell+1$.
>
> **For** $i=1,\ldots,n$ **do**:

>> **Set** $M_i=\max_j\{\gD_j^{(\ell-1)}-\C_{ij}\}$.
>>
>> **Set** $\fD_i^{(\ell)}=-M_i-\epsilon\log\sum_j\b_j
>> \exp((\gD_j^{(\ell-1)}-\C_{ij}-M_i)/\epsilon)$.

>
> **For** $j=1,\ldots,m$ **do**:

>> **Set** $N_j=\max_i\{\fD_i^{(\ell)}-\C_{ij}\}$.
>>
>> **Set** $\gD_j^{(\ell)}=-N_j-\epsilon\log\sum_i\a_i
>> \exp((\fD_i^{(\ell)}-\C_{ij}-N_j)/\epsilon)$.

>
> **Set** $\P_{ij}^{(\ell)}=\a_i\b_j
> \exp((\fD_i^{(\ell)}+\gD_j^{(\ell)}-\C_{ij})/\epsilon)$.
>
> **Set** $\eta^{(\ell)}=\max\{\norm{\P^{(\ell)}\ones_m-\a}_1,
> \norm{(\P^{(\ell)})^\top\ones_n-\b}_1\}$.

**Return** $\P^{(\ell)}$.
:::


(sec-sinkhorn-marginal-dependent)=
## Marginal-Dependent Problems

The balanced Sinkhorn problem fixes both marginals exactly. Many nearby models
instead optimize the transported marginals, but only through penalties or
constraints applied separately to each marginal. The useful point, emphasized by
the generalized scaling algorithms of Chizat, Peyré, Schmitzer and Vialard
{cite:p}`2016-chizat-sinkhorn`, is that entropic OT remains a diagonal-scaling
problem whenever these marginal terms admit simple KL-proximal maps.

Let $\mathcal F$ and $\mathcal G$ be proper convex lower semicontinuous
functionals on finite nonnegative measures on $\Xx$ and $\Yy$. The
unregularized marginal-dependent transport problem is

```{math}
:label: eq-marginal-dependent-unregularized-cont
\inf_{\pi\in\Mm_+(\Xx\times\Yy)}
\int c(x,y)\,\d\pi(x,y)
+
\mathcal F(\pi_1)
+
\mathcal G(\pi_2),
```

where $\pi_1=(\mathrm p_{\Xx})_\sharp\pi$ and
$\pi_2=(\mathrm p_{\Yy})_\sharp\pi$ are the two marginals of $\pi$. Entropic
regularization turns this problem into the scaling-friendly form

```{math}
:label: eq-marginal-dependent-cont
\inf_{\pi\in\Mm_+(\Xx\times\Yy)}
\int c(x,y)\,\d\pi(x,y)
+
\mathcal F(\pi_1)
+
\mathcal G(\pi_2)
+
\epsilon\operatorname{KL}(\pi|\alpha\otimes\beta),
```

where $\alpha$ and $\beta$ are reference measures. In this subsection, when the
total mass of $\pi$ is not fixed, the KL term is understood in the generalized
sense associated with $\varphi(s)=s\log s-s+1$. Thus, if
$\lambda=\alpha\otimes\beta$ and $\pi=\rho\lambda+\pi^\perp$ is the Lebesgue
decomposition of $\pi$ with respect to $\lambda$, then

```{math}
\operatorname{KL}(\pi|\lambda)
=
\int \bigl(\rho\log\rho-\rho+1\bigr)\,\mathrm d\lambda
```

with value $+\infty$ when $\pi^\perp\ne0$. On probability couplings this
coincides with the usual relative entropy.

Balanced OT is recovered by taking $\mathcal F=\iota_{\{\alpha\}}$ and
$\mathcal G=\iota_{\{\beta\}}$. Unbalanced OT replaces these hard indicators by
marginal divergences, as developed later in Section {ref}`sec-unbalanced`. An
entropic JKO step fixes the first marginal to the previous iterate and puts the
energy on the second marginal, for instance
$\mathcal F=\iota_{\{\alpha_t\}}$ and $\mathcal G=E$, with cost $c/(2\tau)$;
this is the static counterpart of the minimizing-movement schemes of Chapter
{ref}`sec-wasserstein-gradient-flows`. Barycenters are the multi-coupling
extension: several couplings share one unknown marginal and are treated by the
generalized Sinkhorn updates of Section {ref}`sec-barycenters`.

In finite dimension, with reference weights satisfying $a_i,b_j>0$ and proper
convex functions
$\mathsf F:\RR_+^n\to\RR\cup\{+\infty\}$,
$\mathsf G:\RR_+^m\to\RR\cup\{+\infty\}$, the entropic version becomes

```{math}
:label: eq-marginal-dependent-discrete
\inf_{\P\in\RR_+^{n\times m}}
\langle\C,\P\rangle
+
\mathsf F(\P\ones_m)
+
\mathsf G(\P^\top\ones_n)
+
\epsilon\KLD(\P|\a\otimes\b).
```

Equivalently, if $\K_{ij}=a_i b_j e^{-\C_{ij}/\epsilon}$, the terms involving
$\C$ can be absorbed into the Gibbs reference and the problem is, up to the
additive constant $\epsilon\sum_{i,j}(a_i b_j-\K_{ij})$,

```{math}
\inf_{\P\ge0}
\mathsf F(\P\ones_m)
+
\mathsf G(\P^\top\ones_n)
+
\epsilon\KLD(\P|\K).
```

(prop-marginal-dependent-dual-scaling)=
:::{admonition} Proposition: Dual and scaling for marginal penalties
:class: important
Assume $a_i,b_j>0$, $\epsilon>0$, and a Fenchel qualification condition, for
instance the existence of a matrix $\P>0$ such that $\P\ones_m$ and
$\P^\top\ones_n$ belong to the relative interiors of $\operatorname{dom}(\mathsf F)$
and $\operatorname{dom}(\mathsf G)$. The Fenchel dual of the discrete
marginal-dependent problem is

```{math}
:label: eq-marginal-dependent-dual
\sup_{\mathbf f\in\RR^n,\mathbf g\in\RR^m}
-
\mathsf F^*(-\mathbf f)
-
\mathsf G^*(-\mathbf g)
-
\epsilon\sum_{i,j}a_i b_j
\left[
\exp\left(\frac{\mathbf f_i+\mathbf g_j-\C_{ij}}{\epsilon}\right)-1
\right].
```

Equivalently, up to the additive constant $\epsilon\sum_{i,j}a_i b_j$, the last
term is

```{math}
-
\epsilon\sum_{i,j}\K_{ij}
\exp\left(\frac{\mathbf f_i+\mathbf g_j}{\epsilon}\right).
```

If $\mathbf u=e^{\mathbf f/\epsilon}$ and
$\mathbf v=e^{\mathbf g/\epsilon}$, exact block ascent in the two dual
variables is the generalized Sinkhorn cycle

```{math}
:label: eq-generalized-sinkhorn-kl-prox
\begin{aligned}
r &\leftarrow \operatorname{prox}_{\mathsf F/\epsilon}^{\KLD}(\K\mathbf v),
&\qquad
\mathbf u &\leftarrow r\oslash(\K\mathbf v),\\
s &\leftarrow \operatorname{prox}_{\mathsf G/\epsilon}^{\KLD}(\K^\top\mathbf u),
&\qquad
\mathbf v &\leftarrow s\oslash(\K^\top\mathbf u),\\
\P&=\operatorname{diag}(\mathbf u)\K\operatorname{diag}(\mathbf v),
\end{aligned}
```

where divisions are entrywise and

```{math}
:label: eq-kl-prox-marginal
\operatorname{prox}^{\KLD}_{\mathsf h}(z)
\eqdef
\operatorname*{arg\,min}_{r\in\RR_+^d}
\mathsf h(r)+\KLD(r|z).
```

In particular, $\operatorname{prox}_{\mathsf F/\epsilon}^{\KLD}(z)$ is the
minimizer of $\mathsf F(r)+\epsilon\KLD(r|z)$.
:::

:::{dropdown} Proof
Introduce independent variables $r$ and $s$ for the two marginals and use dual
variables $\mathbf f,\mathbf g$ for the constraints $r=\P\ones_m$ and
$s=\P^\top\ones_n$. The Lagrangian contains

```{math}
\mathsf F(r)+\langle\mathbf f,r\rangle
+
\mathsf G(s)+\langle\mathbf g,s\rangle
+
\langle\C,\P\rangle
+
\epsilon\KLD(\P|\a\otimes\b)
-
\langle\mathbf f\oplus\mathbf g,\P\rangle.
```

Minimizing over $r$ and $s$ gives $-\mathsf F^*(-\mathbf f)$ and
$-\mathsf G^*(-\mathbf g)$. For each scalar entry, the convex conjugate of
$p\mapsto C_{ij}p+\epsilon(p\log(p/(a_i b_j))-p+a_i b_j)$ is
$q\mapsto\epsilon a_i b_j(e^{(q-C_{ij})/\epsilon}-1)$. Minimizing over $\P$
with $q=\mathbf f_i+\mathbf g_j$ gives the displayed dual.

For the scaling form, fix $\mathbf v>0$, set
$\widetilde{\K}=\K\operatorname{diag}(\mathbf v)$ and
$z=\widetilde{\K}\ones_m=\K\mathbf v$. Updating the row scaling means looking
for $\P=\operatorname{diag}(\mathbf u)\widetilde{\K}$, so its row marginal is
$r=\P\ones_m=\mathbf u\odot z$. The row-wise chain rule gives

```{math}
\KLD(\operatorname{diag}(\mathbf u)\widetilde{\K}|\widetilde{\K})
=
\sum_i \bigl(r_i\log(r_i/z_i)-r_i+z_i\bigr)
=
\KLD(r|z).
```

Thus exact optimization of this block is equivalent to minimizing
$\mathsf F(r)+\epsilon\KLD(r|z)$ over $r\ge0$, hence
$r=\operatorname{prox}_{\mathsf F/\epsilon}^{\KLD}(z)$ and
$\mathbf u=r\oslash z$. The column update is identical with
$w=\K^\top\mathbf u$.
:::

When $\mathsf F=\iota_{\{\a\}}$ and $\mathsf G=\iota_{\{\b\}}$, the first two
dual terms are $\langle\mathbf f,\a\rangle+\langle\mathbf g,\b\rangle$, and one
recovers the usual entropic dual. The classical Sinkhorn update is the special
case in which the KL proximal maps return the prescribed marginals $\a$ and
$\b$.

(alg-generalized-sinkhorn-marginal-penalties)=
:::{admonition} Algorithm: Generalized Sinkhorn for marginal penalties
:class: ot4ml-algorithm

**Input:** Reference weights $\a,\b$, cost $\C$, convex marginal penalties $\mathsf F,\mathsf G$, regularization $\epsilon>0$, tolerance $\mathrm{tol}$.

**Output:** Coupling $\P$ and optimized marginals $r=\P\ones_m$, $s=\transp{\P}\ones_n$.

**Set** $\K_{ij}=a_i b_j e^{-\C_{ij}/\epsilon}$.

**Initialize:** $\uD=\ones_n$, $\vD=\ones_m$, $\eta=+\infty$.

**While** $\eta>\mathrm{tol}$ **do**:

> **Store** $\uD_{\mathrm{old}}=\uD$ and $\vD_{\mathrm{old}}=\vD$.
>
> **Set** $z=\K\vD$.
>
> **Compute** $r=\prox_{\mathsf F/\epsilon}^{\KLD}(z)$.
>
> **Set** $\uD=r\oslash z$.
>
> **Set** $w=\transp{\K}\uD$.
>
> **Compute** $s=\prox_{\mathsf G/\epsilon}^{\KLD}(w)$.
>
> **Set** $\vD=s\oslash w$.
>
> **Set** $\eta=\max\{\norm{\uD-\uD_{\mathrm{old}}}_\infty,\norm{\vD-\vD_{\mathrm{old}}}_\infty\}$.

**Return** $\P=\diag(\uD)\K\diag(\vD)$, $r=\P\ones_m$, and $s=\transp{\P}\ones_n$.
:::


The usefulness of this formulation is that many KL-proximal maps are explicit.

- **Hard marginal constraint.** If $\mathsf F=\iota_{\{\a\}}$, then
  $\operatorname{prox}_{\mathsf F/\epsilon}^{\KLD}(z)=\a$.
- **KL marginal relaxation.** If $\mathsf F(r)=\tau\KLD(r|\a)$ with $\tau>0$,
  then, coordinatewise,

```{math}
\operatorname{prox}_{\mathsf F/\epsilon}^{\KLD}(z)
=
z^{\epsilon/(\tau+\epsilon)}\odot \a^{\tau/(\tau+\epsilon)},
```

so $\mathbf u\leftarrow(\a\oslash z)^{\tau/(\tau+\epsilon)}$, the damped scaling
of unbalanced Sinkhorn.

- **Pointwise bounds.** If $\mathsf F=\iota_{\{\ell\le r\le u\}}$, then the
  proximal map is the coordinatewise clipping
  $\operatorname{prox}_{\mathsf F/\epsilon}^{\KLD}(z)_i=\min\{u_i,\max\{\ell_i,z_i\}\}$.
- **Total-variation marginal relaxation.** If
  $\mathsf F(r)=\tau\norm{r-\a}_1$ and $\lambda=\tau/\epsilon$, then

```{math}
\operatorname{prox}_{\mathsf F/\epsilon}^{\KLD}(z)_i
=
\begin{cases}
z_i e^{\lambda}, & z_i<a_i e^{-\lambda},\\
a_i, & a_i e^{-\lambda}\le z_i\le a_i e^{\lambda},\\
z_i e^{-\lambda}, & z_i>a_i e^{\lambda}.
\end{cases}
```

- **Fixed total mass.** If $\mathsf F=\iota_{\{\langle r,\ones\rangle=m\}}$,
  then
  $\operatorname{prox}_{\mathsf F/\epsilon}^{\KLD}(z)=m z/\langle z,\ones\rangle$.

These examples explain why generalized Sinkhorn algorithms remain practical:
the expensive operation is still multiplication by $\K$ or $\K^\top$, while the
model-specific part is a low-dimensional KL-proximal update on a marginal.

(sec-sinkhorn-heat-hopf-cole)=
## Heat Kernels and Hopf--Cole Transforms

The Gaussian kernel used by Sinkhorn is also the Euclidean heat kernel. This
viewpoint clarifies when entropic OT admits fast grid and surface
implementations, and it places soft minima and Hopf--Cole transforms in the
same heat-kernel calculus.

### Geodesics in Heat

On $\mathbb R^d$, the heat kernel for $\partial_t u=\Delta u$ is

```{math}
h_t(x,y)=(4\pi t)^{-d/2}\exp\!\left(-\frac{\norm{x-y}^2}{4t}\right).
```

For the quadratic cost $c(x,y)=\norm{x-y}^2$, the Sinkhorn Gibbs kernel is
exactly a heat kernel up to a scalar factor:

```{math}
K_\epsilon(x,y)
=e^{-\norm{x-y}^2/\epsilon}
=(\pi\epsilon)^{d/2}h_{\epsilon/4}(x,y).
```

The scalar factor is absorbed by the Sinkhorn scalings and does not change the
coupling. On a Riemannian manifold or surface $M$, write
$L=-\Delta_M$ and replace the dense Gibbs matrix by the intrinsic heat operator
$H_\epsilon=e^{-(\epsilon/4)L}$. For two histograms on the same discretized
domain, Sinkhorn becomes

```{math}
u^{(\ell+1)}=a\oslash(H_\epsilon v^{(\ell)}),
\qquad
v^{(\ell+1)}=b\oslash(H_\epsilon^\top u^{(\ell+1)}).
```

Here $H_\epsilon$ includes quadrature weights and $H_\epsilon^\top$ is its
discrete adjoint; they coincide for a symmetric mass-normalized
discretization. This fits Sinkhorn because kernel multiplication is its only expensive step.
Equivalently, the heat kernel defines the effective cost
$c_\epsilon(x,y)=-\epsilon\log h_{\epsilon/4}(x,y)$. Varadhan's formula gives

```{math}
c_\epsilon(x,y)\longrightarrow d_M(x,y)^2
\qquad (\epsilon\downarrow0),
```

so convolutional Sinkhorn recovers the squared geodesic ground cost at small
temperature without computing all pairwise geodesic distances
{cite:p}`varadhan-1967,2015-solomon-siggraph`. This is also the asymptotic
principle behind geodesics-in-heat distance estimation {cite:p}`Crane2013`.

Computationally, the heat operator admits the resolvent approximation

```{math}
H_\epsilon
=\lim_{q\to\infty}
\left(I+\frac{\epsilon}{4q}L\right)^{-q}.
```

For a sparse discrete Laplacian $L_h$, factor
$A_{\epsilon,q}=I+\epsilon L_h/(4q)=RR^\top$ once by sparse Cholesky. Each
application of $H_\epsilon$ is then approximated by $q$ successive solves with
$A_{\epsilon,q}$, each reduced to two triangular substitutions. The same
factorization is reused in every Sinkhorn row and column update, avoiding a
dense kernel and an all-pairs distance matrix
{cite:p}`2015-solomon-siggraph`. An $\epsilon$-scaling schedule requires one factorization per
temperature. The diffusion length is of order $\sqrt\epsilon$, so the
small-temperature limit must still be resolved by the mesh; taking $\epsilon$
smaller than the squared grid spacing produces metrication and discretization
artifacts.

Figure {ref}`fig:sinkhorn-geodesics-in-heat` compares the exact distance to a non-convex source curve with heat-kernel and shifted-Laplacian approximations at several smoothing scales.

(fig:sinkhorn-geodesics-in-heat)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-geodesics-in-heat")
```

*Geodesics-in-heat approximation of the distance to a dense non-convex source
curve. The one-step approximation $(I+\epsilon L_h/4)^{-1}$ with Neumann
boundary conditions is followed by a normalized-gradient Poisson solve. Larger
Sinkhorn temperatures suppress unresolved grid-scale artifacts but progressively round the
non-convex level-set geometry.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Adjust the Sinkhorn temperature $\epsilon$ and number of sources to see how heat smoothing rounds Voronoi fronts and approximate distance level sets.
:::

<iframe class="ot4ml-live-frame" title="Interactive geodesics-in-heat surrogate panel" src="../live/sinkhorn-geodesics-heat.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

### Soft Hopf--Lax and Hopf--Cole

The Hopf--Lax formula is the Hamilton--Jacobi incarnation of the hard
$c$-transform. We use the normalized quadratic cost

```{math}
c(x,y)=\frac12\norm{x-y}^2,
```

so that the Hopf--Lax operator applied to an initial datum $h$ is precisely

```{math}
(-h)^{\bar c}(x)=\inf_y\left\{h(y)+\frac12\norm{x-y}^2\right\}.
```

The sign only reflects the convention of {ref}`def-c-transform`. This is the
usual Hopf--Lax formula for the Hamiltonian $\norm{p}^2/2$
{cite:p}`evans2010pde,Villani09`; other quadratic scalings amount to multiplying
the cost by a constant. In the present entropic setting, the parameter of
interest is instead the temperature $\epsilon$.

The soft version replaces the infimum by a log-sum-exp soft minimum. In the
notation of {ref}`def-continuous-soft-c-transform`, and using Lebesgue measure
on $\RR^d$,

```{math}
:label: eq-soft-hopf-lax-heat-web
(-h)^{\bar c,\epsilon}(x)
= -\epsilon\log \int
\exp\!\left(-\frac{h(y)+\norm{x-y}^2/2}{\epsilon}\right)\,dy .
```

This is a soft $c$-transform of the function $-h$, and Laplace's principle gives
$(-h)^{\bar c,\epsilon}\to(-h)^{\bar c}$ as $\epsilon\to0$ under the usual
compactness assumptions on near-minimizers. The same formula is also a
heat-kernel formula. If

```{math}
G_\epsilon(z)=(2\pi\epsilon)^{-d/2}
\exp\!\left(-\frac{\norm{z}^2}{2\epsilon}\right),
```

then

```{math}
:label: eq-soft-c-transform-gaussian-convolution-web
(-h)^{\bar c,\epsilon}(x)
= -\epsilon\log\big(G_\epsilon\ast e^{-h/\epsilon}\big)(x)
-\frac{\epsilon d}{2}\log(2\pi\epsilon).
```

Thus a soft quadratic $c$-transform is a Gaussian convolution followed by a
logarithm, up to an explicit additive constant independent of $x$. This is the
bridge between soft-minimum operators, heat kernels and entropic transport
potentials.

(prop-soft-legendre-convolution)=
:::{admonition} Proposition: Soft Quadratic $c$-Transform and Legendre Approximation
:class: important
Let $f:\RR^d\to\RR\cup\{+\infty\}$ be such that the integrals below are finite,
and introduce the quadratic shift
$\mathsf S f(y)=f(y)-\norm{y}^2/2$. For $\epsilon>0$, define the soft conjugate
by applying the soft $\bar c$-transform to the shifted function:

```{math}
:label: eq-soft-legendre-definition-web
f^{*,\epsilon}(p)
=\frac12\norm{p}^2-\big(-\mathsf S f\big)^{\bar c,\epsilon}(p).
```

Then

```{math}
:label: eq-soft-legendre-logsumexp-web
f^{*,\epsilon}(p)
=\epsilon\log\int_{\RR^d}
\exp\!\left(\frac{\dotp{p}{y}-f(y)}{\epsilon}\right)\,dy,
```

and equivalently

```{math}
:label: eq-soft-legendre-convolution-web
f^{*,\epsilon}(p)
=\frac12\norm{p}^2
+\epsilon\log\big(G_\epsilon\ast e^{-\mathsf S f/\epsilon}\big)(p)
+\frac{\epsilon d}{2}\log(2\pi\epsilon).
```

If, for instance, $f$ is proper, lower semicontinuous and superlinear, then
$f^{*,\epsilon}(p)\to f^*(p)$ for every $p$ as $\epsilon\to0$.
:::

The proof is just completion of squares. Since

```{math}
\inf_y\left\{\mathsf S f(y)+\frac12\norm{p-y}^2\right\}
=\frac12\norm{p}^2-f^*(p),
```

this shift turns the Legendre--Fenchel transform into a quadratic
$\bar c$-transform. Replacing the hard transform by its soft version gives the
definition of $f^{*,\epsilon}$. Expanding the square yields the log-sum-exp
formula, the Gaussian-convolution expression follows from the normalized kernel
$G_\epsilon$, and the convergence follows from Laplace's principle.

(rem-soft-legendre-fft)=
:::{admonition} Remark: Fast soft Legendre--Fenchel transforms
:class: ot4ml-remark

Proposition {ref}`prop-soft-legendre-convolution` gives a computational recipe for a smoothed Legendre--Fenchel transform. On a periodic, or sufficiently padded, grid, the term $G_\epsilon\ast e^{-\mathsf S f/\epsilon}$ in {eq}`eq-soft-legendre-convolution-web` is a Gaussian convolution. It can therefore be evaluated in $O(N\log N)$ operations for $N$ grid samples using an FFT. This is not an exact hard discrete Legendre transform, but a regularized approximation whose zero-temperature limit recovers the hard transform by Laplace's principle. Exact discrete conjugation and lower-envelope algorithms exploit convex-analytic and computational-geometry structure instead; see Lucet's survey of computational convex analysis and the distance-transform algorithm of Felzenszwalb and Huttenlocher {cite:p}`Lucet2010ComputationalConvexAnalysis,FelzenszwalbHuttenlocher2012DistanceTransforms`.

The convolutional route is nevertheless delicate when $\epsilon$ is small. In fixed precision, the factors $e^{-f/\epsilon}$ or $e^{-\mathsf S f/\epsilon}$ can underflow or overflow, and the logarithm can amplify small relative convolution errors. Practical implementations therefore use shifts, log-domain evaluations, or stabilized FFT convolutions. In dimension $d$, one can also use the same separability of the Gaussian kernel as in grid Sinkhorn: direct one-dimensional passes give the tensor-product cost {eq}`eq-separable-gaussian-half-step`, namely $O(d\,N^{1+1/d})$, while FFT convolutions provide an additional acceleration when boundary conditions and conditioning permit it.
:::


The first figure below isolates the biconjugation effect.  It compares the hard
lower convex envelope with finite-temperature soft biconjugates for both a simple
and a more oscillatory non-convex profile.

Figure {ref}`fig:sinkhorn-soft-biconjugates` illustrates the biconjugation viewpoint directly.

(fig:sinkhorn-soft-biconjugates)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-soft-biconjugates", width=760)
```

*Soft Legendre biconjugates as approximations of lower convex envelopes.  The dashed gray curve is the original non-convex function, the red curve is $f^{**}$, and the purple-to-blue curves show $(f^{*,\epsilon})^{*,\epsilon}$ for increasing $\epsilon$.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change the smoothing temperature to see how the soft
$c$-transform interpolates between hard envelopes and smooth log-sum-exp
transforms.
:::

<iframe class="ot4ml-live-frame" title="Sinkhorn soft c-transform controls" src="../live/sinkhorn-soft-c.html" loading="lazy" style="width:100%;height:460px;border:0;display:block;"></iframe>

The nonlinear PDEs are linearized by the Hopf--Cole transform. With the same
temperature normalization, $u_s=e^{-\phi_s/\epsilon}$ converts

```{math}
\partial_s\phi_s+\frac12\norm{\nabla\phi_s}^2=\frac{\epsilon}{2}\Delta\phi_s
```

into $\partial_su_s=(\epsilon/2)\Delta u_s$. Conversely,
$\phi_s=-\epsilon\log u_s$ gives a Hamilton--Jacobi solution, while
$v_s=\nabla\phi_s=-\epsilon\nabla\log u_s$ solves the gradient viscous Burgers
equation $\partial_s v_s+(v_s\cdot\nabla)v_s=(\epsilon/2)\Delta v_s$. In one
dimension this is the classical Cole--Hopf transform; in higher dimension this
scalar reduction applies to irrotational velocity fields.
The figure below keeps only the PDE content: the same initial potential is
evolved through the Hopf--Cole transform for three values of the viscosity.

Figure {ref}`fig:sinkhorn-hopf-cole-transform` starts from a Gaussian velocity bump, whose inviscid evolution would form a shock on its decreasing flank, and shows how the viscosity parameter $\epsilon/2$ regularizes this steepening.

(fig:sinkhorn-hopf-cole-transform)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-hopf-cole-transform", width=760)
```

*Hopf--Cole numerics for viscous Hamilton--Jacobi and Burgers dynamics.  The upper row shows the potentials $\phi_t$, the lower row shows the velocities $v_t=\partial_x\phi_t$, and colors encode time from red to blue.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change the viscosity, final time and initial velocity
bump to see the same Hopf--Cole mechanism: heat evolves the transformed
variable, while the logarithm reconstructs the Hamilton--Jacobi potential and
the Burgers velocity.
:::

<iframe class="ot4ml-live-frame" title="Hopf-Cole and Burgers controls" src="../live/sinkhorn-hopf-cole.html" loading="lazy" style="width:100%;height:540px;border:0;display:block;"></iframe>

(sec-sinkhorn-other-regularizers)=
## Other Convex Regularizers

KL regularization is the case that leads to multiplicative Sinkhorn scalings.
Replacing KL by another density-ratio penalty keeps the same transport
constraints but changes the scalar law linking the optimal density to the
dual potentials.

### $\phi$-Divergence Regularization

The exponential Gibbs relation is replaced by the scalar law generated by a
general convex entropy function.

Let $\phi$ be an entropy function and define

```{math}
:label: eq-phi-regularized-ot-web
\mathcal L_{c,\phi}^{\epsilon}(\alpha,\beta)
\eqdef
\min_{\pi\in\Couplings(\alpha,\beta)}
\int c(x,y)\,\d\pi(x,y)
+
\epsilon D_\phi(\pi|\alpha\otimes\beta).
```

(prop-phi-regularized-ot-dual)=
:::{admonition} Proposition: Dual and Density Law for $\phi$-Regularized OT
:class: important
Under standard Fenchel--Rockafellar qualification assumptions,

```{math}
\mathcal L_{c,\phi}^{\epsilon}(\alpha,\beta)
=
\sup_{f,g}
\int f\,\d\alpha+\int g\,\d\beta
-
\epsilon
\int
\phi^*
\left(
\frac{f(x)+g(y)-c(x,y)}{\epsilon}
\right)
\d\alpha(x)\d\beta(y).
```

If the optimal plan has density
$r^\star=\d\pi^\star/\d(\alpha\otimes\beta)$ and the solution is smooth and
interior, then

```{math}
:label: eq-phi-regularized-ot-density-law-web
r^\star(x,y)
=
(\phi')^{-1}
\left(
\frac{f^\star(x)+g^\star(y)-c(x,y)}{\epsilon}
\right).
```
:::

For KL, $\phi(r)=r\log r-r+1$ and
$\phi^*(s)=e^s-1$, recovering the Sinkhorn dual. Other choices replace
the exponential law by another scalar transfer function:

```{math}
\begin{array}{lll}
\phi(r)=r\log r-r+1 &\Rightarrow& r^\star=e^s,\\
\phi(r)=r-\log r-1 &\Rightarrow& r^\star=(1-s)^{-1}\quad(s<1),\\
\phi(r)=\frac12(r-1)^2 &\Rightarrow& r^\star=(1+s)_+,
\end{array}
\qquad
s=\frac{f^\star\oplus g^\star-c}{\epsilon}.
```

### Bregman-Divergence Regularization

The previous construction regularizes OT by a density-ratio divergence. This
differs from using a Bregman divergence generated by a convex functional on
the space of measures.

(def-measure-bregman-divergence)=
:::{admonition} Definition: Measure Bregman Divergence
:class: important
If $\Phi$ is a differentiable convex functional on a convex class of
nonnegative measures and $\xi$ is a reference measure, the Bregman divergence
generated by $\Phi$ is

```{math}
B_\Phi(\pi|\xi)
\eqdef
\Phi(\pi)-\Phi(\xi)
-
\int\delta\Phi(\xi)\,\d(\pi-\xi),
```

where $\delta\Phi(\xi)$ is the first variation in the sense of Definition
{ref}`def-first-variation`. The formula is understood whenever its right-hand
side is well-defined.
:::

With the product reference $\xi=\alpha\otimes\beta$, the corresponding
regularized transport value is

```{math}
\mathcal L_{c,\Phi}^{\epsilon}(\alpha,\beta)
\eqdef
\inf_{\pi\in\Couplings(\alpha,\beta)}
\left\{
\int c\,\d\pi+\epsilon B_\Phi(\pi|\xi)
\right\}.
```

(prop-bregman-regularized-ot-dual)=
:::{admonition} Proposition: Dual and Density Law for Bregman-Regularized OT
:class: important
Fix $\xi=\alpha\otimes\beta$ and assume that Fenchel duality is exact. Then

```{math}
:label: eq-bregman-regularized-ot-dual-web
\mathcal L_{c,\Phi}^{\epsilon}(\alpha,\beta)
=
\sup_{f,g}
\int f\,\d\alpha+\int g\,\d\beta
-\epsilon\left[
\Phi^*\left(
\delta\Phi(\xi)+\frac{f\oplus g-c}{\epsilon}
\right)
-\Phi^*(\delta\Phi(\xi))
\right].
```

If $(f^\star,g^\star)$ and $\pi^\star$ are optimal and the solution is
interior, then

```{math}
:label: eq-bregman-regularized-ot-density-law-web
\delta\Phi(\pi^\star)
=
\delta\Phi(\xi)+\frac{f^\star\oplus g^\star-c}{\epsilon}.
```
:::

:::{dropdown} Main Idea of the Proof
Write the Bregman-regularized objective, up to constants independent of
$\pi$, as

```{math}
\epsilon\Phi(\pi)
+
\int(c-\epsilon\delta\Phi(\xi))\,\d\pi .
```

Dualizing the marginal constraints and minimizing over $\pi$ produces the
global conjugate $\Phi^*$. Equality in Fenchel's inequality gives the
Bregman optimality condition.
:::

The primal--dual relations
{eq}`eq-bregman-regularized-ot-density-law-web` and
{eq}`eq-phi-regularized-ot-density-law-web` make the distinction precise.
Bregman regularization translates the reference measure in the functional
dual coordinate $\delta\Phi$, whereas $\phi$-divergence regularization applies
the scalar derivative $\phi'$ pointwise to the density relative to
$\alpha\otimes\beta$. For KL these laws coincide: logarithmic dual coordinates
turn additive potential shifts into multiplicative density scalings.

(prop-kl-only-bregman-phi)=
:::{admonition} Proposition: KL is the Common Bregman and $\phi$ Case
Under natural smoothness assumptions, if a Bregman divergence
$B_\Phi(\alpha|\beta)$ equals a $\phi$-divergence
$D_\phi(\alpha|\beta)$ for all positive probability densities, then

```{math}
\phi(t)=\kappa\,t\log t+a(t-1)
```

for some $\kappa\ge0$ and $a\in\RR$. Hence the common divergence is a multiple of
KL, up to an irrelevant affine term.
:::

Thus, except for KL, the two generalizations lead to different duals and
different algorithms. In the KL case, density-ratio regularization and Bregman
projection geometry coincide and reduce to multiplicative Sinkhorn scalings.

### Generalized Soft $c$-Transforms and Alternate Dual Maximization Method

The two dual formulations above suggest the same basic optimizer: maximize
exactly over one potential while the other is fixed, then exchange their
roles. For the $\phi$-divergence dual, separability with respect to
$\alpha\otimes\beta$ makes both block updates pointwise:

```{math}
:label: eq-phi-soft-c-transform-web
\begin{aligned}
g^{\bar c,\epsilon,\phi}(x)
&\in
\operatorname*{argmin}_{u\in\mathbb R}
\left\{
\epsilon\int
\phi^*\left(\frac{u+g(y)-c(x,y)}{\epsilon}\right)\d\beta(y)-u
\right\},\\
f^{c,\epsilon,\phi}(y)
&\in
\operatorname*{argmin}_{v\in\mathbb R}
\left\{
\epsilon\int
\phi^*\left(\frac{f(x)+v-c(x,y)}{\epsilon}\right)\d\alpha(x)-v
\right\}.
\end{aligned}
```

When $\phi^*$ is differentiable, the first minimizer satisfies

```{math}
\int
(\phi^*)'\left(\frac{u+g(y)-c(x,y)}{\epsilon}\right)\d\beta(y)=1,
```

and the second satisfies the symmetric equation. Thus each update normalizes
one conditional density. For Burg or quadratic penalties, the solve remains
one-dimensional and monotone, but it is no longer a log-sum-exp.

The Bregman dual has analogous block transforms, but they are function-space
minimizations unless $\Phi$ is separable. With
$\xi=\alpha\otimes\beta$, define

```{math}
:label: eq-bregman-soft-c-transform-web
\begin{aligned}
g^{\bar c,\epsilon,\Phi}
&\in
\operatorname*{argmin}_{u\in\mathcal C(\mathcal X)}
\left\{
\epsilon\Phi^*\left(\delta\Phi(\xi)+\frac{u\oplus g-c}{\epsilon}\right)
-\int u\,\d\alpha
\right\},\\
f^{c,\epsilon,\Phi}
&\in
\operatorname*{argmin}_{v\in\mathcal C(\mathcal Y)}
\left\{
\epsilon\Phi^*\left(\delta\Phi(\xi)+\frac{f\oplus v-c}{\epsilon}\right)
-\int v\,\d\beta
\right\}.
\end{aligned}
```

These are precisely the exact block minimizers of the negative Bregman dual.
For separable $\Phi$, disintegration reduces them to independent scalar
problems.

The two alternate dual-maximization schemes are therefore

```{math}
:label: eq-generalized-soft-c-alternate-maximization-web
\begin{aligned}
f^{(\ell+1)}&=\big(g^{(\ell)}\big)^{\bar c,\epsilon,\phi},
&g^{(\ell+1)}&=\big(f^{(\ell+1)}\big)^{c,\epsilon,\phi},\\
f^{(\ell+1)}&=\big(g^{(\ell)}\big)^{\bar c,\epsilon,\Phi},
&g^{(\ell+1)}&=\big(f^{(\ell+1)}\big)^{c,\epsilon,\Phi}.
\end{aligned}
```

For KL, which has both descriptions, these iterations coincide with the
usual soft $c$-transform iteration and recover Sinkhorn.

Quadratic regularizers replace exponentiation by positive-part thresholding.
For discrete measures, the choices
$\phi(r)=\frac12(r-1)^2$ and
$\Phi(\mathrm P)=\frac12\|\mathrm P\|_{\mathrm F}^2$ give, respectively,

```{math}
:label: eq-quadratic-regularized-density-laws-web
\mathrm P^\star_{i,j}
=
a_i b_j\left(1+\frac{f_i^\star+g_j^\star-\mathrm C_{i,j}}{\epsilon}\right)_+,
\qquad
\mathrm P^\star_{i,j}
=
\left(a_i b_j+\frac{f_i^\star+g_j^\star-\mathrm C_{i,j}}{\epsilon}\right)_+.
```

Both laws can produce sparse plans, as advocated by Blondel, Seguy, and
Rolet {cite:p}`blondel2018smooth`. For the first law, the row transform solves

```{math}
\sum_j b_j
\left(1+\frac{u+g_j-\mathrm C_{i,j}}{\epsilon}\right)_+=1.
```

The left-hand side is continuous, nondecreasing, and piecewise affine.
Sorting its breakpoints, equivalently computing a weighted simplex
projection, costs $O(m\log m)$ for a row of length $m$. The unweighted
quadratic Bregman transform is an ordinary Euclidean simplex projection.

Figures {ref}`fig:sinkhorn-phi-soft-c-transforms` and
{ref}`fig:sinkhorn-entropic-versus-quadratic-regularization` show the two
visible consequences: changing the regularizer modifies both the smoothing
of the dual envelope and the support of the primal coupling.

(fig:sinkhorn-phi-soft-c-transforms)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-phi-soft-c-transforms")
```

*Generalized soft double transforms for $c(x,y)=-xy$. The dashed curve is the
same non-concave input potential in all panels, the dark curve is the hard
double $c$-transform after centering, and colored curves show the centered
double transform $(f^{c,\epsilon,\phi})^{\bar c,\epsilon,\phi}$ for increasing
$\epsilon$ from red to blue. KL, Burg, and quadratic density-ratio penalties
smooth the concave envelope differently.*
:::

(fig:sinkhorn-entropic-versus-quadratic-regularization)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-entropic-versus-quadratic-regularization")
```

*Density-ratio regularizers and coupling support. KL gives a diffuse positive
plan, the Burg barrier keeps positive but differently tailed support, and the
rightmost quadratic plan is computed by alternate threshold transforms and
is exactly sparse through the positive-part law.*
:::

The interactive demo separates the same two effects. The left plot shows the
pointwise law $r=h(s)$, while the right plot recomputes a coupling after
enforcing the marginals with that law.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Compare entropic and quadratic penalties on the same transport problem by changing the regularizer and its strength.
:::

<iframe class="ot4ml-live-frame" title="Sinkhorn regularizer controls" src="../live/sinkhorn-regularizers.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

(sec-sinkhorn-div)=
## Sinkhorn Divergences

Sinkhorn divergences remove the entropic self-bias while retaining
smoothness. They interpolate between OT-like geometry and kernel-like norms,
which explains their statistical behavior.

### Entropic Bias

The raw Sinkhorn cost is biased: for $\epsilon>0$, minimizing
$\mathcal L_c^\epsilon(\alpha,\beta)$ over $\beta$ does not generally return
$\beta=\alpha$. In the large-temperature limit, the raw value behaves like a
product interaction:

:::{admonition} Proposition: Large-Temperature Entropic Bias
Assume $c$ is bounded and continuous. Then

```{math}
\mathcal L_c^\epsilon(\alpha,\beta)
\to
\iint c(x,y)\,\d\alpha(x)\d\beta(y)
\qquad
\text{as }\epsilon\to+\infty.
```
:::

For $c(x,y)=\norm{x-y}^2$, minimizing this large-temperature limit over
$\beta$ collapses toward a Dirac at the mean of $\alpha$.

### Sinkhorn Divergences

The standard debiasing subtracts the two self-interaction energies.
This cancellation removes the large-temperature attraction toward the
independent coupling; positivity is a separate property, proved below through
the positive-definite kernel associated with $e^{-c/\epsilon}$.

(def-sinkhorn-divergence)=
:::{admonition} Definition: Sinkhorn Divergence
:class: important
Let $c$ be a symmetric cost on a common state space. For $\epsilon>0$, the
debiased Sinkhorn divergence is

```{math}
:label: eq-sinkhorn-divergence-web
\overline{\mathcal L}_c^\epsilon(\alpha,\beta)
\eqdef
\mathcal L_c^\epsilon(\alpha,\beta)
-
\frac12\mathcal L_c^\epsilon(\alpha,\alpha)
-
\frac12\mathcal L_c^\epsilon(\beta,\beta).
```
:::

Figure {ref}`fig:sinkhorn-divergence-debiasing` demonstrates the role of the two self-cost corrections by optimizing a finite point cloud against a fixed target with and without debiasing.

(fig:sinkhorn-divergence-debiasing)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-divergence-debiasing")
```

*Debiasing by point optimization. For large $\epsilon$, minimizing the raw
entropic cost collapses atoms toward the barycenter, whereas the self-cost
subtraction keeps a bimodal cloud.*
:::

The interactive demo below shows the same mechanism with two-dimensional point
clouds. The raw entropic loss tends to keep the fitted cloud too concentrated,
whereas the self-cost correction spreads the moving particles across the target
geometry.

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the smoothing, correction, and iteration controls to compare raw entropic attraction with the debiased Sinkhorn divergence.
:::

<iframe class="ot4ml-live-frame" title="Two-dimensional Sinkhorn debiasing controls" src="../live/sinkhorn-debias.html" loading="lazy" style="width:100%;height:460px;border:0;display:block;"></iframe>

(eq-formula-cost-dual)=
:::{admonition} Lemma: Entropic Dual Cost at Optimum
Let $(f_{\alpha,\beta},g_{\alpha,\beta})$ be optimal dual potentials. Then

```{math}
\mathcal L_c^\epsilon(\alpha,\beta)
=
\int f_{\alpha,\beta}\,\d\alpha
+
\int g_{\alpha,\beta}\,\d\beta.
```
:::

:::{dropdown} Proof
At optimality,

```{math}
1
=
\int
e^{(f_{\alpha,\beta}(x)+g_{\alpha,\beta}(y)-c(x,y))/\epsilon}
\d\beta(y)
```

for $\alpha$-almost every $x$. Therefore the exponential penalty term in the
dual integrates to zero, and the dual value reduces to the two linear
potential terms.
:::

(prop-sinkhorn-divergence-asymptotics)=
:::{admonition} Proposition: Asymptotics of Sinkhorn Divergences
:class: important
Assume the two measures are supported on a common compact metric space and
that $c$ is symmetric, continuous, nonnegative, and satisfies $c(x,x)=0$.
Then

```{math}
\overline{\mathcal L}_c^\epsilon(\alpha,\beta)
\to
\mathcal L_c(\alpha,\beta)
\qquad
(\epsilon\to0),
```

and

```{math}
\overline{\mathcal L}_c^\epsilon(\alpha,\beta)
\to
-
\frac12
\int c\,\d(\alpha-\beta)\otimes\d(\alpha-\beta)
\qquad
(\epsilon\to+\infty).
```
:::

The zero-temperature statement is the $\Gamma$-convergence of entropic OT to
the Kantorovich problem {cite:p}`leonard2012schrodinger,2017-carlier-SIMA`.
Non-negativity of relative entropy and continuity of $c$ give the liminf
inequality; a finite-entropy approximation of an optimal coupling, chosen so
that its entropy multiplied by $\epsilon$ vanishes, gives a recovery sequence.

:::{admonition} Remark: Large-temperature Hilbertian limit
:class: ot4ml-remark

If $c$ is conditionally negative definite, equivalently if $-c$ is conditionally positive definite, the large-temperature limit in Proposition {ref}`prop-sinkhorn-divergence-asymptotics` is a squared Hilbertian seminorm on zero-mass signed measures. A typical example is $c(x,y)=\norm{x-y}^p$ for $0<p<2$, which yields the energy distance. This kernel norm is the dual of a homogeneous Sobolev norm.
:::


(prop-sinkhorn-positive)=
:::{admonition} Proposition: Positivity of Sinkhorn Divergences
Assume dual optimizers exist and the symmetric kernel
$k_\epsilon(x,y)=e^{-c(x,y)/\epsilon}$ is positive semidefinite in the sense
of Definition {ref}`def-positive-kernels`. Then
$\overline{\mathcal L}_c^\epsilon(\alpha,\beta)\ge0$.

If, in addition, the common state space is compact, $c$ is continuous, and
$k_\epsilon$ is universal, then
$\overline{\mathcal L}_c^\epsilon(\alpha,\beta)=0$ if and only if
$\alpha=\beta$. Moreover,
$\overline{\mathcal L}_c^\epsilon(\alpha_n,\alpha)\to0$ is equivalent to
$\alpha_n\rightharpoonup\alpha$ {cite:p}`feydy2018interpolating`.
:::

:::{dropdown} Proof Sketch
Use the optimal self-potentials for $(\alpha,\alpha)$ and $(\beta,\beta)$ as
a suboptimal pair in the dual problem between $\alpha$ and $\beta$. After
rewriting with
$\tilde\alpha=e^{f_{\alpha,\alpha}/\epsilon}\alpha$ and
$\tilde\beta=e^{f_{\beta,\beta}/\epsilon}\beta$, one obtains

```{math}
\frac{1}{\epsilon}
\overline{\mathcal L}_c^\epsilon(\alpha,\beta)
\ge
1-\langle \tilde\alpha,\tilde\beta\rangle_{k_\epsilon}.
```

The self Sinkhorn fixed-point equations imply
$\norm{\tilde\alpha}_{k_\epsilon}=\norm{\tilde\beta}_{k_\epsilon}=1$, so
Cauchy--Schwarz for the kernel pairing gives the result.

If the divergence vanishes and the kernel is universal, equality in
Cauchy--Schwarz gives identical kernel mean embeddings for $\tilde\alpha$ and
$\tilde\beta$, hence $\tilde\alpha=\tilde\beta$. The self-consistency equations
then recover the same original measure from this common weighted measure.
Positive semidefiniteness without universality guarantees only non-negativity
and may leave a nontrivial null space.
:::


:::{admonition} Example: Large Temperature Collapse
:class: ot4ml-example

Suppose that minimizers $\be_\epsilon$ are tight and that the large-temperature convergence is uniform enough to pass to their cluster points. The limiting functional is linear in the second argument:

```{math}
\be\mapsto \int V_\al(y)\d\be(y),
\qquad
V_\al(y)\eqdef\int c(x,y)\d\al(x).
```

Thus every cluster point is supported on $\argmin V_\al$. When this set is the singleton $\{y^\star(\al)\}$,

```{math}
\be_\epsilon \rightharpoonup \delta_{y^\star(\al)},
\qquad
y^\star(\al)=\uargmin{y} V_\al(y).
```

For the quadratic cost $c(x,y)=\norm{x-y}^2$ on $\RR^d$, assuming $\al$ has finite second moment, one has $V_\al(y)=\norm{y-\int x\d\al(x)}^2+\mathrm{const}$, so the collapse is toward the Dirac mass at the mean of $\al$.
:::


(sec-complex-epsilon)=
## Complex $\epsilon$

The Sinkhorn temperature is usually a positive real number: positivity makes
the Gibbs kernel positive, gives the entropy a convex meaning, and underlies
the Hilbert-metric and monotone convergence arguments of the next chapter.
Once the equations are written as exponential fixed-point equations, however,
$\epsilon$ can also be regarded locally as a complex variable. This does not
produce a positive coupling or a contraction theorem; it produces a
holomorphic branch of the same scaling equations near any positive real
temperature.

### Measure fixed point

Let $\alpha\in\mathcal P(X)$ and $\beta\in\mathcal P(Y)$. For
$\epsilon\in\mathbb C\setminus\{0\}$, reuse the Gibbs kernel and integral
operators in {eq}`eq-continuous-sinkhorn-operators` whenever the defining
integrals exist. The density factorization
{eq}`eq-continuous-sinkhorn-scaling`, the marginal equations that follow it,
and the updates {eq}`eq-continuous-sinkhorn-iteration` then remain valid
verbatim for complex-valued $u$ and $v$, provided that the divisions are well
defined. For real $\epsilon>0$ these are the usual Sinkhorn equations. For
complex $\epsilon$ they are only local analytic identities: they imply neither
positivity of $\pi_\epsilon$ nor convergence of the alternating iteration.

### Discrete histograms

For discrete histograms, evaluate the Gibbs kernel entrywise at $(x_i,y_j)$.
The factorization {eq}`eq-scaling-form-web` and Sinkhorn updates
{eq}`eq-sinkhorn-web` are then used verbatim over $\mathbb C$, with the same
marginal constraints and multiplicative gauge, whenever $\epsilon\ne0$ and all
divisions are defined. This complexified iteration is again a local
parametrization of the scaling equations, not a globally convergent algorithm.

The following finite-dimensional result is the scaling-variable counterpart of
Theorem 2.1 and Remark 2.2 of
{cite:p}`CarlierPegonTamanini2023EntropicRates`. For compactly supported
marginals and a continuous cost, Carlier, Pegon and Tamanini prove through the
Schrödinger system that the normalized potentials, and hence the entropic
cost, depend analytically on every real $\epsilon>0$; their remark explicitly
records the resulting local extension to complex temperatures. We state the
discrete version directly in $(u,v)$ and also allow the marginals and cost
matrix to vary.

(thm-carlier-complex-sinkhorn)=
:::{admonition} Theorem: Local Holomorphic Continuation of Sinkhorn Scalings
:class: important
Fix positive histograms $a^0\in\Delta_n$, $b^0\in\Delta_m$, a finite real cost
matrix $\C^0$, and a real temperature $\epsilon_0>0$. Choose positive scalings
$(u^0,v^0)$ of the corresponding Sinkhorn coupling. Then there are complex
neighborhoods of $(\epsilon_0,a^0,b^0,\C^0)$, inside the affine constraint
$\sum_i a_i=\sum_j b_j$, and a unique holomorphic map

```{math}
(\epsilon,a,b,\C)\mapsto(u_\epsilon,v_\epsilon)\in\mathbb C^n\times\mathbb C^m
```

satisfying the linear gauge
$\sum_i a_i^0u_{\epsilon,i}=\sum_i a_i^0u_i^0$, such that

```{math}
\P_\epsilon
=
\operatorname{diag}(u_\epsilon)K_\epsilon(\C)
\operatorname{diag}(v_\epsilon),
\qquad
\P_\epsilon\mathbf 1_m=a,
\qquad
\P_\epsilon^\top\mathbf 1_n=b.
```

Consequently the gauge-fixed scalings and the coupling $\P_\epsilon$ are
holomorphic in all four arguments near the base point.
:::

:::{dropdown} Proof
Apply the holomorphic implicit-function theorem to the $n$ row residuals, the
first $m-1$ column residuals, and the gauge residual
$G(u)=\sum_i a_i^0(u_i-u_i^0)$. There are $n+m$ equations for the $n+m$
scaling coordinates. Let $(\delta u,\delta v)$ belong to the kernel of their
derivative at the positive real base point and set

```{math}
r_i=\frac{\delta u_i}{u_i^0},
\qquad
s_j=\frac{\delta v_j}{v_j^0}.
```

The induced perturbation is

```{math}
\delta \P_{ij}=\P^0_{ij}(r_i+s_j).
```

The linearized row sums vanish; the first $m-1$ column sums vanish by
definition, and the last column sum follows from equality of the total row and
column sums. Hence

```{math}
0
=
\sum_i\overline{r_i}\sum_j\delta \P_{ij}
+
\sum_j\overline{s_j}\sum_i\delta \P_{ij}
=
\sum_{i,j}\P^0_{ij}|r_i+s_j|^2.
```

Strict positivity gives $r_i=\theta$ and $s_j=-\theta$. The linearized gauge
then gives $0=\theta\sum_i a_i^0u_i^0$, hence $\theta=0$. The derivative is
invertible, and the holomorphic implicit-function theorem gives the local
branch.
:::

After shrinking the neighborhoods if necessary, every scaling coordinate is
nonzero. Choosing local logarithms defines the holomorphic log-scalings
$f_\epsilon=\epsilon\log u_\epsilon$ and
$g_\epsilon=\epsilon\log v_\epsilon$. They are useful for visualization but
are not needed in the theorem.

:::{admonition} Remark: Local, not global, complex scaling
:class: ot4ml-remark

The theorem is local around a positive real point. It does not rule out complex
singularities, changes of logarithm branch, or zeros in the denominators of the
complexified updates {eq}`eq-sinkhorn-web` farther away. Along a compact
interval $[\epsilon_{\min},\epsilon_{\max}]\subset(0,+\infty)$, uniqueness
lets the local branches agree on overlaps and therefore cover some neighborhood
of that interval. This still gives no global single-valued continuation on
$\mathbb C\setminus\{0\}$.
:::


Figure {ref}`fig:sinkhorn-complex-epsilon-continuation` visualizes the local
continuation at the level of the coupling, without choosing logarithm branches.
To keep the regularization strength fixed, it follows the constant-modulus arc
$\epsilon_\theta=\epsilon_0e^{i\theta}$ and displays
$|\P_{\epsilon_\theta}|$ at four increasing phases. The complex matrix
$\P_{\epsilon_\theta}$ retains the prescribed marginals $(a,b)$, but taking
its entrywise modulus destroys these linear identities. The attached red and
blue profiles therefore show $(a,b)$, while the violet profiles show the row
and column sums of $|\P_{\epsilon_\theta}|$ and reveal the cancellations hidden
by the modulus. Gauge-fixed Newton continuation follows the branch in small
angular steps, with the marginal equations checked at every step.

(fig:sinkhorn-complex-epsilon-continuation)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sinkhorn-complex-epsilon-continuation")
```

*The magnitude of a complex Sinkhorn coupling exposes the oscillations created
by a complex phase. Two Gaussian-mixture histograms and $\epsilon_0=0.12$ are
fixed, while $\epsilon_\theta=\epsilon_0e^{i\theta}$ is continued through
$\theta\in\{0,0.40,0.80,1.20\}$. Thus every panel has the same regularization
amplitude $|\epsilon_\theta|=0.12$ and uses the same intensity scale. The red
and blue profiles are the prescribed marginals of the complex coupling; the
violet profiles are the marginals of its entrywise modulus and separate from
them as cancellation increases. The maximum marginal residual over the full
continuation path is below $10^{-11}$.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Vary the modulus $\epsilon_0$ and phase $\theta$ to
inspect $|\P_{\epsilon_0e^{i\theta}}|$ at fixed regularization amplitude. The
side profiles distinguish the prescribed marginals of the complex matrix from
the marginals obtained after taking its entrywise modulus.
:::

<iframe class="ot4ml-live-frame" title="Complex-epsilon Sinkhorn continuation controls" src="../live/sinkhorn-complex.html" loading="lazy" style="width:100%;height:480px;border:0;display:block;"></iframe>

:::{admonition} Example: Centered one-dimensional Gaussians
:class: ot4ml-example

Let $\al=\Gaussian(0,\sigma_\al^2)$ and
$\be=\Gaussian(0,\sigma_\be^2)$ on $\RR$, with
$\sigma_\al,\sigma_\be>0$, and take $c(x,y)=(x-y)^2$. Proposition
{ref}`prop-gaussian-sinkhorn-closed-form` shows that the real-temperature
Sinkhorn coupling is Gaussian. Its complex continuation uses the same formula.
For $\Re(\epsilon)>0$, set

```{math}
k_\epsilon
\eqdef
\frac{\sqrt{\epsilon^2+16\sigma_\al^2\sigma_\be^2}-\epsilon}{4},
```

where the square root is the holomorphic branch on the right half-plane that is
positive for real $\epsilon>0$. The continued coupling $\pi_\epsilon$ is a
centered complex Gaussian, with covariance parameter

```{math}
\begin{pmatrix}
\sigma_\al^2 & k_\epsilon\\
k_\epsilon & \sigma_\be^2
\end{pmatrix}.
```

Thus no new Gaussian computation is required. The formula defines a finite
complex Gaussian coupling throughout $\Re(\epsilon)>0$. It can be continued
farther along paths on which the Gaussian integral converges and which avoid
$\epsilon=0$ and the square-root branch points
$\epsilon=\pm4i\sigma_\al\sigma_\be$.
:::
