---
title: "Generalized Wasserstein Distances"
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-extensions)=

This chapter keeps the idea of comparing measures while changing the geometry
of the comparison. The constructions below relax mass conservation, average
lower-dimensional projections, quotient nuisance symmetries, linearize
transport around a reference measure, replace the trace cost by spectral
gauges, or constrain motion to conditional fibers. They are useful when
standard $\Wass_p$ is too rigid or too expensive, but each modification also
changes which metric, geodesic, or stability properties survive.

:::{admonition} Guiding Comparison
:class: tip
Balanced Wasserstein fixes the marginals exactly. Unbalanced OT relaxes the
marginals. Sliced OT compares many one-dimensional shadows. Linear OT embeds
measures through maps from a fixed reference. Spectral OT changes the scalar
quadratic cost into a gauge of the whole displacement covariance. Quotient OT
removes prescribed symmetries, while conditional OT prohibits transport across
different fibers.
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

(sec-unbalanced)=
## Unbalanced OT

Unbalanced OT allows mass creation and destruction by penalizing marginal
mismatch. It is essential when histograms are not normalized, when
observations contain outliers, or when only part of the source should match
the target {cite:p}`LieroMielkeSavareLong,2015-chizat-unbalanced,2017-chizat-focm`.

### Relaxed Formulation

For nonnegative measures
$(\alpha,\beta)\in\mathcal M_+(\X)\times\mathcal M_+(\Y)$, a generic relaxed
formulation is

```{math}
:label: eq-unbalanced-primal
\mathsf{UW}_c(\alpha,\beta)
=
\inf_{\pi\in\mathcal M_+(\X\times\Y)}
\int_{\X\times\Y} c(x,y)\d\pi(x,y)
+
\mathcal D_{\psi_1}(\pi_1\mid\alpha)
+
\mathcal D_{\psi_2}(\pi_2\mid\beta),
```

where $\psi_1,\psi_2$ are convex entropy functions. Exact conservation
$(\pi_1,\pi_2)=(\alpha,\beta)$ is replaced by a cost for changing the
marginals. Writing $\psi_s=\tau\bar\psi_s$ exposes the relaxation scale:

```{math}
\mathsf{UW}_{c,\tau}(\alpha,\beta)
=
\inf_{\pi\geq0}
\int c\d\pi
+
\tau\mathcal D_{\bar\psi_1}(\pi_1\mid\alpha)
+
\tau\mathcal D_{\bar\psi_2}(\pi_2\mid\beta).
```

Large $\tau$ makes marginal mismatch expensive and approaches balanced OT when
the total masses are compatible. Small $\tau$ makes creation and destruction
cheap; after rescaling by $\tau$, the zero-transport part reveals the pure
divergence geometry.

The two immediate numerical displays make the penalty roles explicit.
{numref}`fig:unbalanced-mass-relaxation` fixes a KL marginal penalty and varies
$\tau$: the transported marginals, shown in violet, are allowed to differ from
the prescribed red and blue marginals, and the gaps are precisely the created or
destroyed mass. {numref}`fig:unbalanced-divergence-choice` then keeps the
geometry, entropic plan regularization and relaxation strength fixed, and
changes only the marginal divergence. This isolates the effect of the penalty:
KL gives smooth rescaling, Burg discourages complete deletion of prescribed
modes, while total variation produces sharper active-mass selection.

Figure {ref}`fig:unbalanced-mass-relaxation` fixes a KL marginal penalty and varies $\tau$: the transported marginals, shown in violet, are allowed to differ from the prescribed red and blue marginals, and the gaps are precisely the created or destroyed mass.

(fig:unbalanced-mass-relaxation)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("unbalanced-mass-relaxation")
```

*KL unbalanced OT on one-dimensional Gaussian-mixture densities. The central
matrix is the transported coupling. The side curves compare the prescribed
marginals with the transported marginals; increasing $\tau$ makes marginal
mismatch more expensive, so more mass is moved rather than created or
destroyed.*
:::

The entropy used in the marginal relaxation also changes the qualitative
behavior. A KL penalty leads to smooth multiplicative rescaling. The
reverse-KL, or Burg, penalty blows up when a transported marginal vanishes
where the prescribed marginal is positive, so it discourages complete deletion
of small modes. Total variation has a linear kink and behaves closer to
partial transport: mass is either kept active or created and destroyed at
nearly constant marginal price.

Figure {ref}`fig:unbalanced-divergence-choice` then keeps the geometry, entropic plan regularization and relaxation strength fixed, and changes only the marginal divergence.

(fig:unbalanced-divergence-choice)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("unbalanced-divergence-choice")
```

*Effect of the marginal divergence in unbalanced entropic OT. The geometric
cost, entropic plan regularization $\epsilon$, and relaxation strength $\tau$
are fixed; only the marginal penalty changes. KL allows smooth mass
variation, Burg keeps transported marginals from vanishing on prescribed
modes, and total variation gives a sharper active-mass selection.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the middle-$\tau$, $\epsilon$, and grid controls to
compare KL unbalanced couplings for the same source and target marginals as in
the book figure.
:::

<iframe class="ot4ml-live-frame" title="Unbalanced Sinkhorn controls" src="../live/generalized-unbalanced.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

These figures should be read as pictures of a single relaxed plan $\pi$: the
same nonnegative measure determines both the transported coupling and its two
relaxed marginals. The small-$\tau$ result below formalizes the opposite regime,
where transport becomes negligible compared with local mass variation.

(prop-unbalanced-small-scale-limit)=
:::{admonition} Proposition: Small-Transport-Scale Limit
:class: important
Assume that $\alpha,\beta$ are finite measures on a compact metric space
$\X$, that $c$ is continuous, $c\geq0$, and $c(x,y)=0$ if and only if $x=y$.
Assume also that the marginal divergences are nonnegative, weak-* lower
semicontinuous, and have weak-* compact sublevel sets on $\mathcal M_+(\X)$.
Then

```{math}
\lim_{\tau\downarrow0}
\frac{1}{\tau}\mathsf{UW}_{c,\tau}(\alpha,\beta)
=
\inf_{\rho\in\mathcal M_+(\X)}
\mathcal D_{\bar\psi_1}(\rho\mid\alpha)
+
\mathcal D_{\bar\psi_2}(\rho\mid\beta).
```

The right-hand side is the infimal gluing divergence obtained by matching the
two measures through a common zero-transport marginal $\rho$. In the dominated
case, if $\alpha=a\lambda$, $\beta=b\lambda$, and $\rho=r\lambda$, this
decouples pointwise:

```{math}
\int \mathfrak m_{\bar\psi_1,\bar\psi_2}(a(x),b(x))\d\lambda(x),
\qquad
\mathfrak m_{\bar\psi_1,\bar\psi_2}(a,b)
\eqdef
\inf_{r\geq0}
a\,\bar\psi_1(r/a)+b\,\bar\psi_2(r/b),
```

with the usual recession conventions when $a=0$ or $b=0$. For KL marginal
penalties,

```{math}
\inf_{\rho\in\mathcal M_+(\X)}
\operatorname{KL}(\rho\mid\alpha)
+
\operatorname{KL}(\rho\mid\beta)
=
\int (\sqrt a-\sqrt b)^2\d\lambda .
```

Thus KL marginal relaxation contains the squared Hellinger distance as its
local mass-variation limit.
:::

:::{dropdown} Proof
For the upper bound, restrict to diagonal plans
$\pi=(\Id,\Id)_\sharp\rho$, whose transport cost is zero and whose two
marginals are both $\rho$. This gives the desired upper bound after
optimizing over $\rho$.

For the lower bound, let $\tau_n\downarrow0$ and let $\pi_n$ be almost
minimizing plans with bounded scaled values
$\tau_n^{-1}\mathsf{UW}_{c,\tau_n}(\alpha,\beta)$. Since the divergences are
nonnegative, $\int c\d\pi_n=O(\tau_n)$, hence $\int c\d\pi_n\to0$. The
bounded scaled values also put the two marginals in compact divergence
sublevel sets. Since a coupling has the same total mass as each marginal, the
couplings are tight on $\X\times\X$. Up to subsequences,
$\pi_n\rightharpoonup\pi_0$.

Lower semicontinuity of the transport cost yields $\int c\d\pi_0=0$, so
$\pi_0$ is concentrated on the diagonal. Its two marginals are therefore equal
to a common measure $\rho$. Lower semicontinuity of the marginal divergences
gives

```{math}
\liminf_n
\frac{1}{\tau_n}
\mathsf{UW}_{c,\tau_n}(\alpha,\beta)
\geq
\mathcal D_{\bar\psi_1}(\rho\mid\alpha)
+
\mathcal D_{\bar\psi_2}(\rho\mid\beta),
```

and optimizing over $\rho$ gives the lower bound.

In the dominated case, the minimization over $\rho=r\lambda$ decouples into
the scalar envelope $\mathfrak m_{\bar\psi_1,\bar\psi_2}$. For KL, no
singular part is admissible when $\alpha$ and $\beta$ are dominated by
$\lambda$. The pointwise objective is
$r\log(r/a)-r+a+r\log(r/b)-r+b$. Its optimality condition is
$\log(r/a)+\log(r/b)=0$, hence $r=\sqrt{ab}$, and the minimum is
$a+b-2\sqrt{ab}=(\sqrt a-\sqrt b)^2$.
:::

(prop-dual-unbalanced-ot)=
:::{admonition} Proposition: Dual of Unbalanced Optimal Transport
:class: important
Under the usual Fenchel--Rockafellar qualification assumptions, the relaxed
primal value in {eq}`eq-unbalanced-primal` equals

```{math}
\mathsf{UW}_c(\alpha,\beta)
=
\sup_{f\oplus g\leq c}
-
\mathcal D_{\psi_1}^*(-f\mid\alpha)
-
\mathcal D_{\psi_2}^*(-g\mid\beta).
```
:::

:::{dropdown} Proof
Use the variational formula for the dual of a divergence and introduce the
marginal variables through continuous potentials:

```{math}
\inf_{\pi\geq0}\sup_{f,g}
\int c\d\pi
+
\int -f\d\pi_1
+
\int -g\d\pi_2
-
\mathcal D_{\psi_1}^*(-f\mid\alpha)
-
\mathcal D_{\psi_2}^*(-g\mid\beta).
```

Exchanging the infimum and supremum gives

```{math}
\sup_{f,g}
-
\mathcal D_{\psi_1}^*(-f\mid\alpha)
-
\mathcal D_{\psi_2}^*(-g\mid\beta)
+
\inf_{\pi\geq0}
\int \big(c-(f\oplus g)\big)\d\pi .
```

The last infimum is $0$ when $f\oplus g\leq c$ and $-\infty$ otherwise.
:::

### Reverse and Homogeneous Formulations

The Liero--Mielke--Savare formulation rewrites marginal penalties as a local
transport cost and then homogenizes it. Assuming first that the reference
measures and transported marginals have mutually absolutely continuous parts,
one can factor the objective as

```{math}
\begin{aligned}
&\int c(x,y)\d\pi(x,y)
+
\mathcal D_{\psi_1}(\pi_1\mid\alpha)
+
\mathcal D_{\psi_2}(\pi_2\mid\beta) \\
&\quad =
\int
\left(
c(x,y)
+
\psi_1\!\left(\frac{\d\pi_1}{\d\alpha}(x)\right)
\frac{\d\alpha}{\d\pi_1}(x)
+
\psi_2\!\left(\frac{\d\pi_2}{\d\beta}(y)\right)
\frac{\d\beta}{\d\pi_2}(y)
\right)
\d\pi(x,y).
\end{aligned}
```

This motivates the local reverse cost

```{math}
:label: eq-unbalanced-reverse-local-cost
L_c(r,s)
\eqdef
c+r\psi_1(1/r)+s\psi_2(1/s),
```

with the usual recession convention at $r=0$ or $s=0$. If
$\alpha=F\pi_1+\alpha^\perp$ and $\beta=G\pi_2+\beta^\perp$ are the Lebesgue
decompositions of the reference marginals with respect to the transported
marginals, then

```{math}
\mathsf{UW}_c(\alpha,\beta)
=
\inf_{\pi\geq0}
\int L_{c(x,y)}(F(x),G(y))\d\pi(x,y)
+
\psi_1(0)\alpha^\perp(\X)
+
\psi_2(0)\beta^\perp(\Y).
```

The homogeneous formulation is obtained by taking the perspective transform
of $L_c$,

```{math}
:label: eq-unbalanced-homogeneous-local-cost
H_c(r,s)
\eqdef
\inf_{\theta>0}
\theta L_c(r/\theta,s/\theta),
```

which is positively $1$-homogeneous. It defines

```{math}
:label: eq-homogeneous
\mathsf{HW}_c(\alpha,\beta)
=
\inf_{\pi\geq0}
\int H_{c(x,y)}(F(x),G(y))\d\pi(x,y)
+
\psi_1(0)\alpha^\perp(\X)
+
\psi_2(0)\beta^\perp(\Y).
```

For both the proof and the cone construction, it is useful to expose the
equivalent semi-coupling form {cite:p}`LieroMielkeSavareLong`:

```{math}
:label: eq-homogeneous-semicoupling
\mathsf{HW}_c(\alpha,\beta)
=
\inf_{\substack{\lambda\in\mathcal M_+(\X\times\Y)\\u,v\geq0}}
\left\{
\int H_{c(x,y)}(u(x,y),v(x,y))\d\lambda(x,y)
\; ;\;
(\mathrm p_1)_\sharp(u\lambda)=\alpha,\quad
(\mathrm p_2)_\sharp(v\lambda)=\beta
\right\}.
```

The cases $u=0$ or $v=0$ encode the recession terms and therefore mass that is
created or destroyed rather than transported.

(prop-homogeneous-unbalanced)=
:::{admonition} Proposition: Homogenization Does Not Change the Cost
:class: important
Assume that the entropy functions are proper, lower semicontinuous and convex,
with their usual recession extensions at zero. Then

```{math}
\mathsf{HW}_c(\alpha,\beta)=\mathsf{UW}_c(\alpha,\beta).
```
:::

:::{dropdown} Proof
Since $H_c(r,s)\leq L_c(r,s)$ by choosing scale one, every competitor in the
reverse formulation gives a homogeneous competitor of no larger cost. Hence
$\mathsf{HW}\leq\mathsf{UW}$.

Conversely, fix a feasible semi-coupling $(\lambda,u,v)$ in
{eq}`eq-homogeneous-semicoupling`. For a positive measurable scale $\theta$,
set $\widetilde\pi=\theta\lambda$. Disintegrate $\lambda$ with respect to its
first spatial marginal. If $\bar u(x)$ and $\bar\theta(x)$ are the conditional
averages of $u$ and $\theta$, then
$\alpha=\bar u(\mathrm p_1)_\sharp\lambda$ and
$\widetilde\pi_1=\bar\theta(\mathrm p_1)_\sharp\lambda$. Convexity of the
perspective $(a,m)\mapsto a\psi_1(m/a)$ and conditional Jensen give

```{math}
\mathcal D_{\psi_1}(\widetilde\pi_1\mid\alpha)
\leq
\int u\,\psi_1(\theta/u)\d\lambda.
```

The second marginal gives the analogous estimate. Therefore

```{math}
\int c\d\widetilde\pi
+\mathcal D_{\psi_1}(\widetilde\pi_1\mid\alpha)
+\mathcal D_{\psi_2}(\widetilde\pi_2\mid\beta)
\leq
\int\big[c\theta+u\psi_1(\theta/u)+v\psi_2(\theta/v)\big]\d\lambda.
```

The pointwise infimum over $\theta>0$ is $H_c(u,v)$. A measurable
$\eta$-minimizing scale exists by the normal-integrand selection theorem; the
recession conventions cover vanishing weights. Letting $\eta\downarrow0$ and
then minimizing over semi-couplings gives
$\mathsf{UW}\leq\mathsf{HW}$.
:::

### Conic Lifting

Assume now that $\X=\Y$ and $\psi_1=\psi_2=\psi$. The homogeneous formulation
lifts the problem to the cone space
$\mathfrak C[\X]\eqdef(\X\times\RR_+)/\sim$, where all points $(x,0)$ are
identified at the apex. For an exponent $p\geq1$, define

```{math}
\mathsf D((x,r),(y,s))
\eqdef
H_{c(x,y)}(r^p,s^p)^{1/p}.
```

Several classical unbalanced geometries are obtained by choosing $\psi$, $c$
and $p$ so that $\mathsf D$ is a distance on the cone:

- $\mathcal D_\psi=\operatorname{KL}$, $p=2$, and
  $c(x,y)=-\log\cos^2(d(x,y)\wedge\pi/2)$ give the
  Hellinger--Kantorovich or Wasserstein--Fisher--Rao cone metric

```{math}
\mathsf D((x,r),(y,s))^2
=
r^2+s^2-2rs\cos(d(x,y)\wedge\pi/2).
```

- $\mathcal D_\psi=\operatorname{KL}$, $p=2$, and $c(x,y)=d(x,y)^2$ give the
  Gaussian Hellinger formula

```{math}
\mathsf D((x,r),(y,s))^2
=
r^2+s^2-2rs e^{-d(x,y)^2/2}.
```

  This is a cone metric when the Gaussian kernel
  $k(x,y)=e^{-d(x,y)^2/2}$ is positive definite. In particular, this holds on
  subsets of Hilbert spaces. Positive definiteness is an additional
  hypothesis on a general metric space.

- $\mathcal D_\psi=\TV$, $p=1$, and $c(x,y)=d(x,y)$ give the partial-transport
  cone cost

```{math}
\mathsf D((x,r),(y,s))
=
r+s-(r\wedge s)(2-d(x,y))_+.
```

For a finite measure $\eta$ on the cone, define its weighted base projection
$\mathsf P_p\eta$ by

```{math}
\int_\X \varphi(x)\d(\mathsf P_p\eta)(x)
=
\int_{\mathfrak C[\X]}\varphi(x)r^p\d\eta(x,r).
```

The corresponding cone action value is

```{math}
\mathsf{CW}(\alpha,\beta)
=
\inf_{\gamma\in\mathcal M_+(\mathfrak C[\X]^2)}
\left\{
\int \mathsf D((x,r),(y,s))^p\d\gamma
\; ; \;
\mathsf P_p\gamma_1=\alpha,\quad
\mathsf P_p\gamma_2=\beta
\right\}.
```

(thm-cone-unbalanced-ot)=
:::{admonition} Theorem: Cone Formulation of Unbalanced OT
:class: important
Assume that $\X$ is compact, that $(r,s)\mapsto H_{c(x,y)}(r,s)$ is convex for
every $(x,y)$, and that $(x,y,r,s)\mapsto H_{c(x,y)}(r,s)$ is lower
semicontinuous. Then
$\mathsf{UW}_c=\mathsf{HW}_c=\mathsf{CW}$. If, in addition, $\mathsf D$ is a
continuous distance on the cone, then $\mathsf{CW}^{1/p}$ is a distance between
nonnegative finite measures.
:::

:::{dropdown} Proof
The equality $\mathsf{UW}=\mathsf{HW}$ is the preceding proposition. A feasible
semi-coupling $(\lambda,u,v)$ lifts to the cone through

```{math}
(x,y)\longmapsto
\big((x,u(x,y)^{1/p}),(y,v(x,y)^{1/p})\big).
```

Its weighted base marginals are $\alpha,\beta$, and its cone action is exactly
$\int H_{c(x,y)}(u,v)\d\lambda$, so
$\mathsf{CW}\leq\mathsf{HW}$. Conversely, disintegrate a cone plan over
$(x,y)$ and set $u=\mathbb E[r^p\mid x,y]$ and
$v=\mathbb E[s^p\mid x,y]$. Jensen's inequality for the convex function $H_c$
produces a feasible semi-coupling of no larger action. Hence
$\mathsf{HW}\leq\mathsf{CW}$.

For the triangle inequality, two plans that share the same *weighted* middle
projection need not share the same ordinary cone marginal. Homogeneity is the
essential correction: common radial rescaling preserves weighted projections
and action. After normalization and addition of harmless apex mass, two nearly
optimal plans for $(\alpha,\beta)$ and $(\beta,\zeta)$ can be given the same
ordinary middle lift

```{math}
M\delta_{\mathfrak o}+(x\mapsto(x,1))_\sharp\beta
```

for a sufficiently large finite $M$. The ordinary gluing lemma and Minkowski's
inequality then prove the triangle inequality. Radial normalization by
$(r^p+s^p)^{1/p}$ also restricts minimizing plans to bounded radii and fixed
mass; compactness and lower semicontinuity yield an optimizer. A zero-action
optimizer is concentrated on the cone diagonal, so its two weighted
projections coincide and $\alpha=\beta$.
:::

### Entropic KL Relaxation

A generic entropic regularization of unbalanced OT reads

```{math}
\operatorname{POT}^{\TV}_\lambda(\alpha,\beta)
\eqdef
\inf_{\pi\in\mathcal M_+(\X\times\Y)}
\int c\d\pi
+
\mathcal D_{\psi_1}(\pi_1\mid\alpha)
+
\mathcal D_{\psi_2}(\pi_2\mid\beta)
+
\epsilon\mathcal D_\phi(\pi\mid\alpha\otimes\beta).
```

Its dual is

```{math}
\sup_{f,g}
-
\mathcal D_{\psi_1}^*(-f\mid\alpha)
-
\mathcal D_{\psi_2}^*(-g\mid\beta)
-
\epsilon\mathcal D_\phi^*
\left(\frac{f\oplus g-c}{\epsilon}\middle|\alpha\otimes\beta\right).
```

For $\mathcal D_\phi=\operatorname{KL}$, the primal-dual relation is
$\d\pi=e^{(f\oplus g-c)/\epsilon}\d\alpha\d\beta$. If, in addition,
$\mathcal D_{\psi_1}=\mathcal D_{\psi_2}=\tau\operatorname{KL}$, coordinate
maximization gives the damped soft transforms

```{math}
f\leftarrow\omega\,g^{\bar c,\epsilon},
\qquad
g\leftarrow\omega\,f^{c,\epsilon},
\qquad
\omega\eqdef\frac{\tau}{\tau+\epsilon},
```

where the soft transforms are defined in {ref}`def-continuous-soft-c-transform`.
Equivalently,

```{math}
\begin{aligned}
f(x)
&=
-
\frac{\tau\epsilon}{\tau+\epsilon}
\log\int_\Y
\exp\left(\frac{g(y)-c(x,y)}{\epsilon}\right)\d\beta(y),\\
g(y)
&=
-
\frac{\tau\epsilon}{\tau+\epsilon}
\log\int_\X
\exp\left(\frac{f(x)-c(x,y)}{\epsilon}\right)\d\alpha(x).
\end{aligned}
```

In the discrete case, with
$K_{i,j}=e^{-C_{i,j}/\epsilon}a_i b_j$ and
$\omega=\tau/(\tau+\epsilon)$, this gives the generalized Sinkhorn scaling

```{math}
u_i\leftarrow
\left(\frac{a_i}{(Kv)_i}\right)^\omega,
\qquad
v_j\leftarrow
\left(\frac{b_j}{(K^\top u)_j}\right)^\omega,
\qquad
P=\diag(u)K\diag(v).
```

The exponent $\omega<1$ is the visible difference with balanced Sinkhorn:
marginal corrections are damped because violating the marginals is allowed.

The KL case in {numref}`fig:unbalanced-mass-relaxation` is obtained from these
damped updates. The interactive panel above exposes the two most important
regularization scales. Increasing $\tau$ pushes the transported marginals closer
to the prescribed ones; increasing $\epsilon$ spreads the coupling itself.

### Metric Contraction of the Damped Updates

Balanced entropic potentials have a gauge ambiguity, whereas KL marginal
penalties make the unbalanced potentials unique up to null sets. The natural
metric is therefore the ordinary $L^\infty$ distance on potentials, or,
equivalently, the Thompson metric on positive scalings,

```{math}
d_T((u,v),(u',v'))
\eqdef
\max\{\|\log u-\log u'\|_\infty,
       \|\log v-\log v'\|_\infty\}.
```

(prop-unbalanced-sinkhorn-contraction)=
:::{admonition} Proposition: Linear Contraction of Unbalanced Sinkhorn
:class: important
Assume that the damped soft-transform map sends bounded potentials to bounded
potentials, as happens when $c$ is bounded. With
$\omega=\tau/(\tau+\epsilon)<1$, define

```{math}
\mathcal T_{\rm GS}(f,g)=(\widetilde f,\widetilde g),
\qquad
\widetilde f=\omega g^{\bar c,\epsilon},
\qquad
\widetilde g=\omega\widetilde f^{c,\epsilon}.
```

Then, for
$d_\infty((f,g),(f',g'))=\max\{\|f-f'\|_\infty,\|g-g'\|_\infty\}$,

```{math}
d_\infty(\mathcal T_{\rm GS}(f,g),\mathcal T_{\rm GS}(f',g'))
\leq
\omega d_\infty((f,g),(f',g')).
```

Consequently the bounded fixed point is unique and both the potential distance
and the Thompson distance of the scalings decay at least as $\omega^k$.
:::

:::{dropdown} Proof
Soft $c$-transforms are order reversing, commute with additive constants up to
sign, and are $1$-Lipschitz in $L^\infty$. Thus, writing
$D=d_\infty((f,g),(f',g'))$,

```{math}
\|\widetilde f-\widetilde f'\|_\infty\leq\omega D,
\qquad
\|\widetilde g-\widetilde g'\|_\infty
\leq\omega\|\widetilde f-\widetilde f'\|_\infty
\leq\omega^2D.
```

Hence the product distance contracts by $\omega$. Banach's fixed-point theorem
gives existence, uniqueness, and the geometric rate.
:::

(alg-unbalanced-sinkhorn)=
:::{admonition} Algorithm: Unbalanced Sinkhorn scaling
:class: ot4ml-algorithm

**Input:** Weights $\a,\b$, cost matrix $\C$, entropic scale $\epsilon>0$, KL strength $\tau>0$, tolerance $\mathrm{tol}$.

**Output:** Unbalanced entropic coupling $\P$.

**Initialize:** Set
$K_{ij}=e^{-\C_{ij}/\epsilon}\a_i\b_j, \quad \omega=\frac{\tau}{\tau+\epsilon}, \quad u^{(0)}=\ones_n, \quad v^{(0)}=\ones_m, \quad \eta_0=+\infty, \quad k=0.$

**While** $\eta_k>\mathrm{tol}$ **do**:

>
> **Set** $k\leftarrow k+1$.
>
> $u^{(k)} = \left(\frac{\a}{K v^{(k-1)}}\right)^\omega, \qquad v^{(k)} = \left(\frac{\b}{\transp{K}u^{(k)}}\right)^\omega.$
>
> **Set** $\eta_k=\epsilon\max\{\norm{\log u^{(k)}-\log u^{(k-1)}}_\infty,\norm{\log v^{(k)}-\log v^{(k-1)}}_\infty\}$.

**Return** $\P^{(k)}=\diag(u^{(k)})K\diag(v^{(k)})$.
:::


### Partial Optimal Transport

Total variation gives a sharp active-mass selection and connects unbalanced OT
with the classical partial-transport problem. The latter fixes in advance the
amount of transported mass. For

```{math}
0\leq m\leq \min\{\alpha(\X),\beta(\Y)\},
```

define

```{math}
\operatorname{POT}_m(\alpha,\beta)
\eqdef
\inf_{\substack{\pi\in\mathcal M_+(\X\times\Y)\\
\pi_1\leq\alpha,\ \pi_2\leq\beta\\
\pi(\X\times\Y)=m}}
\int c\,\d\pi .
```

Thus only a submeasure of $\alpha$ is transported onto a submeasure of $\beta$;
the remaining mass is left unmatched. The corresponding Lagrangian form is
obtained by adding total-variation penalties. For a price $\lambda>0$ for
discarding or creating one unit of mass, denote by
$\operatorname{POT}^{\TV}_\lambda(\alpha,\beta)$ the value

```{math}
\inf_{\pi\in\mathcal M_+(\X\times\Y)}
\int c\,\d\pi
+
\lambda\|\alpha-\pi_1\|_{\TV}
+
\lambda\|\beta-\pi_2\|_{\TV}.
```

Assume $c\geq0$. Allowing transported marginals larger than the available
marginals does not improve the value: excess transported mass can be trimmed,
which decreases the transport cost and cannot increase the sum of the two
total-variation penalties. Hence an optimal plan may be chosen with
$\pi_1\leq\alpha$ and
$\pi_2\leq\beta$. If $m=\pi(\X\times\Y)$, the penalty then reduces to

```{math}
\lambda\big(\alpha(\X)-m\big)+\lambda\big(\beta(\Y)-m\big),
```

so the precise relation is a one-dimensional Lagrange duality in the transported
mass.

(prop-tv-partial-ot-lagrange)=
:::{admonition} Proposition: TV Penalization Selects Fixed-Mass Partial OT
:class: important
Assume that $\X,\Y$ are compact metric spaces and that $c$ is continuous and
nonnegative. Set $A=\alpha(\X)$, $B=\beta(\Y)$, and $M=\min(A,B)$. Then

```{math}
\operatorname{POT}^{\TV}_\lambda(\alpha,\beta)
=
\lambda(A+B)
+
\inf_{0\leq m\leq M}
\big\{\operatorname{POT}_m(\alpha,\beta)-2\lambda m\big\}.
```

If a penalized optimizer has mass $m_\lambda$, it is optimal for
$\operatorname{POT}_{m_\lambda}$ and $m_\lambda$ minimizes the scalar problem.
Conversely, if $2\lambda\in\partial\operatorname{POT}_m$, every fixed-mass
optimizer is penalized-optimal. Every $m\in[0,M]$ is selected by at least one
$\lambda\geq0$, possibly together with an interval of masses on a flat exposed
face.
:::

:::{dropdown} Proof
Write $V(m)=\operatorname{POT}_m(\alpha,\beta)$. Compactness gives an optimizer.
Convex combinations of subcouplings show that $V$ is convex, while rescaling a
plan shows that it is nondecreasing. If $m_0<m_1$, choose submeasures of mass
$m_1-m_0$ from the residual source and target measures of an optimizer at
$m_0$, couple them, and add this coupling. This proves
$V(m_1)-V(m_0)\leq\|c\|_\infty(m_1-m_0)$, so $V$ is Lipschitz.

Grouping every penalized competitor by its total transported mass gives the
displayed scalar infimum. Equality forces simultaneous optimality in the
fixed-mass and scalar problems. The converse is precisely the subgradient
inequality. Since the extended convex function is Lipschitz on $[0,M]$ and
nondecreasing, a nonnegative subgradient exists at every mass after including
the interval's normal cone.
:::

(prop-partial-ot-metric-slice)=
:::{admonition} Proposition: Fixed Total Mass Reduces Partial OT to Balanced OT
:class: important
Let $c=d^p$, $p\geq1$, and fix $m>0$. On nonnegative measures of total mass
exactly $m$ and finite $p$th moment,

```{math}
\operatorname{POT}_m(\alpha,\beta)^{1/p}
=
m^{1/p}\Wass_p(\alpha/m,\beta/m)
```

is a distance. On the larger class of measures with mass at least $m$, it is
not a distance in general.
:::

:::{dropdown} Proof
When both endpoint masses equal $m$, the inequalities
$\pi_1\leq\alpha$, $\pi_2\leq\beta$ and the mass constraint force
$\pi_1=\alpha$, $\pi_2=\beta$. Thus partial couplings are exactly balanced
couplings, and normalization by $m$ gives the formula. On a larger class,
$\alpha=m\delta_x+r\delta_y$ and $\beta=m\delta_x+r\delta_z$ are distinct but
share the zero-cost partial plan $m\delta_{(x,x)}$.
:::

Thus TV penalization is the Lagrangian envelope of constrained partial OT:
increasing $\lambda$ selects larger transported masses, while small $\lambda$
makes deletion and creation cheaper. The constrained theory, including active
regions and free boundaries, was developed
by Caffarelli--McCann and
Figalli {cite}`CaffarelliMcCannPartial,FigalliPartial`. Modern computational and
learning applications include partial Wasserstein and partial
Gromov--Wasserstein variants, for instance in
Chapel--Alaya--Gasso {cite}`ChapelAlayaGassoPartial`.

Figure {ref}`fig:partial-ot-active-mass` shows this active-region mechanism for two one-dimensional two-Gaussian mixtures, with the source mixture shifted to the left and the target mixture shifted to the right.

(fig:partial-ot-active-mass)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("partial-ot-active-mass")
```

*Partial optimal transport with prescribed transported mass. The central image is
the optimal subcoupling, with contrast normalized independently in each panel to
keep the low-mass plans readable. The pale red and blue side curves are the
original source and target densities, while the violet curves are the active
truncated marginals. As the transported mass decreases, only the lowest-cost
overlapping parts remain matched and the remaining mass is left unmatched.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Decrease the transported mass to see how partial OT
selects active submarginals and leaves the rest unmatched.
:::

<iframe class="ot4ml-live-frame" title="Partial OT active mass controls" src="../live/partial-ot-1d.html" loading="lazy" style="width:100%;height:460px;border:0;display:block;"></iframe>

The same mechanism becomes a geometric active-region selection in higher
dimension. {numref}`fig:partial-ot-shape-active-mass` shows a two-dimensional
shape example: the partial plan selects the closest pieces of the two supports,
while leaving distant regions unmatched.

Figure {ref}`fig:partial-ot-shape-active-mass` shows a two-dimensional

(fig:partial-ot-shape-active-mass)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("partial-ot-shape-active-mass")
```

*Two-dimensional partial optimal transport between a red cat-shaped indicator
measure and a blue annulus indicator measure. Both supports are sampled by
farthest-point sampling. Saturated points are the active source and target
marginals of the optimal partial plan, while pale points are available mass left
unmatched. As the prescribed mass decreases, the active regions contract to the
nearest compatible pieces of the two shapes.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Vary the transported mass to see which source and target points remain active when partial transport discards outlying mass.
:::

<iframe class="ot4ml-live-frame" title="Interactive partial-transport active-mass panel" src="../live/partial-ot-2d.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

(ex-unbalanced-single-cell)=
:::{admonition} Example: Application to proliferating and dying cell populations
:class: ot4ml-example

In single-cell time courses, the observed populations can grow, die or change composition between two sampling times. A balanced coupling would force every unit of mass at time $t$ to reappear at time $t+\Delta t$, which is too rigid biologically. The relaxed value

```{math}
\inf_{\pi\geq0}\int c\d\pi
+\tau_1\Dd(\pi_1|\al_t)
+\tau_2\Dd(\pi_2|\al_{t+\Delta t})
```

where $\pi_1,\pi_2$ are the marginals of $\pi$, interprets missing marginal mass as death or undersampling, and excess target marginal mass as growth or birth. Neural semi-coupling and entropic dynamic variants use this idea to model proliferating or dying cell populations from unpaired measurements {cite:p}`LuebeckBunneGutCastilloPelkmansAlvarezMelis2022NubOT,KleinUsciddaTheisCuturi2023GENOT`. The dynamic counterpart, where creation and transport are both part of the tangent dynamics, is discussed in Section {ref}`sec-dynamic-unbalanced-wfr-flows`.
:::


(sec-sliced-wasserstein)=
## Sliced Wasserstein Distances

Sliced Wasserstein distances replace one high-dimensional comparison by an
average of explicit one-dimensional optimal transport problems.

### One-Dimensional Projections

The idea was proposed by Marc Bernot, and its first published use for
Wasserstein barycenters and texture mixing is due to Rabin, Peyré, Delon and
Bernot {cite:p}`rabin-ssvm-11`. It is cheap, differentiable after sorting, and
often effective in imaging and learning. For measures on $\RR^d$ and
$\theta\in\mathbb S^{d-1}$, let $P_\theta(x)=\dotp{\theta}{x}$.

### Spherical Averaging

The projected measures live on the real line, where Wasserstein distances are
explicit through sorting or quantiles. Averaging over directions defines the
sliced distance.

(def-sliced-wasserstein)=
:::{admonition} Definition: Sliced Wasserstein Distance
:class: important
Let $p\geq1$, let $\alpha,\beta\in\mathcal P_p(\RR^d)$, and let $\sigma$ be the
uniform probability measure on $\mathbb S^{d-1}$. The sliced $p$-Wasserstein
distance is

```{math}
:label: eq-sliced-wasserstein
\operatorname{SW}_p(\alpha,\beta)^p
\eqdef
\int_{\mathbb S^{d-1}}
\Wass_p\big((P_\theta)_\sharp\alpha,(P_\theta)_\sharp\beta\big)^p
\d\sigma(\theta).
```
:::

Since each projected problem can be solved by sorting or quantiles,
$\operatorname{SW}_p$ is much cheaper to approximate numerically than
high-dimensional OT. It metrizes the
same weak-plus-moment topology as $\Wass_p$, but its geometry is not
bi-Lipschitz equivalent to $\Wass_p$ in high dimension
{cite:p}`nadjahi2019asymptotic`.

(rem-sliced-radon-viewpoint)=
:::{admonition} Remark: Radon viewpoint
:class: ot4ml-remark

Slicing can also be understood as applying a Radon transform before measuring discrepancy. For a probability measure $\al$ on $\RR^d$, define its measure-valued Radon transform by

```{math}
\mathfrak R\al(\theta)\eqdef (P_\theta)_\sharp\al,
\qquad
\theta\in\Sphere^{d-1}.
```

Thus $\mathfrak R\al$ is a collection of one-dimensional projected measures indexed by directions. If $\al=\rho(x)\d x$ has a density, then $\mathfrak R\al(\theta)$ has density given by the classical Radon transform

```{math}
R\rho(\theta,s)
=
\int_{\{x:\dotp{\theta}{x}=s\}}\rho(x)\,\d\mathcal H^{d-1}(x).
```

To make the metric meaning of *pull-back* explicit, equip Radon fields
$h:\mathbb S^{d-1}\to\mathcal P_p(\mathbb R)$ with

```{math}
d_{\mathrm{Rad},p}(h_0,h_1)
\eqdef
\left(
\int_{\mathbb S^{d-1}}
\Wass_p\big(h_0(\theta),h_1(\theta)\big)^p
\d\sigma(\theta)
\right)^{1/p}.
```

For a map $F:E\to(Y,d_Y)$, pulling the metric $d_Y$ back through $F$ means
precomposing both metric arguments:

```{math}
(F^*d_Y)(x,x')\eqdef d_Y\big(F(x),F(x')\big).
```

Consequently, {eq}`eq-sliced-wasserstein` reads

```{math}
\SW_p(\alpha,\beta)
=
d_{\mathrm{Rad},p}(\mathfrak R\alpha,\mathfrak R\beta)
=
(\mathfrak R^*d_{\mathrm{Rad},p})(\alpha,\beta).
```

This is not the adjoint relation between the pull-back
$T^\sharp g=g\circ T$ of a test function and the push-forward $T_\sharp$ of
a measure discussed in Remark {ref}`rem-pullback-pushforward`, although both
uses amount to precomposition by a map. Here both arguments of a metric are
precomposed; each coordinate
$\mathfrak R\alpha(\theta)=(P_\theta)_\sharp\alpha$ is itself a
push-forward. A metric pull-back is generally only a pseudometric when $F$ is
not injective. Here the full all-direction transform is injective on
probability measures by the Cramér--Wold theorem {cite:p}`CramerWold1936`,
which is why sliced Wasserstein separates measures. The warning is numerical
and variational: finitely sampled Radon data are not injective, and
independently constructed one-dimensional Radon data need not satisfy the
range conditions of an actual image. This is precisely the issue behind sliced
and Radon barycenter reconstructions discussed in Section
{ref}`sec-barycenters` and illustrated in Figure
{ref}`fig:sliced-radon-barycenter`.
:::


Figure {ref}`fig:sliced-wasserstein-projections` turns this Radon viewpoint into a concrete comparison: each planar density produces a family of one-dimensional projected laws, which can then be compared by ordinary one-dimensional Wasserstein distances.

(fig:sliced-wasserstein-projections)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("sliced-wasserstein-projections")
```

*Sliced Wasserstein projections between two planar densities. Fixed directions
are drawn on both densities, and the middle panels show smoothed
one-dimensional density estimates of the projected measures. Sliced OT
averages one-dimensional Wasserstein discrepancies over many such directions.*
:::

The interactive demo separates two uses of a slice: comparing projected measures and
lifting the sorted one-dimensional matching back to the plane. The lifted plan
is always feasible in the original space, but it need not be the quadratic
optimal plan.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the projection angle and number of directions to see how sliced Wasserstein distances reduce high-dimensional transport to one-dimensional matchings.
:::

<iframe class="ot4ml-live-frame" title="Sliced Wasserstein controls" src="../live/generalized-sliced.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

(prop-sliced-wasserstein-metric)=
:::{admonition} Proposition: Metric Properties of Sliced Wasserstein
:class: important
For $p\geq1$, $\operatorname{SW}_p$ is a distance on
$\mathcal P_p(\mathbb R^d)$ and metrizes weak convergence together with
convergence of the $p$th moment. With $\sigma$ the uniform probability measure
on the sphere, set

```{math}
\kappa_{d,p}
\eqdef
\int_{\mathbb S^{d-1}}|\theta_1|^p\d\sigma(\theta)
=
\frac{\Gamma(d/2)\Gamma((p+1)/2)}
{\sqrt{\pi}\,\Gamma((d+p)/2)}.
```

Then

```{math}
\operatorname{SW}_p(\alpha,\beta)^p
\leq
\kappa_{d,p}\Wass_p(\alpha,\beta)^p.
```

In particular, $\kappa_{d,2}=1/d$. Conversely, let $d\geq2$, $R>0$, and suppose that
$\alpha,\beta\in\mathcal P_p(\mathbb R^d)$ are supported in
$B_R=\{x:\|x\|\leq R\}$. Bonnotte's historical estimate gives

```{math}
\Wass_p(\alpha,\beta)^p
\leq
C_{d,p}R^{p-\frac{1}{d+1}}
\operatorname{SW}_p(\alpha,\beta)^{\frac{1}{d+1}}.
```

The sharp reverse estimate for $p=1$ also implies, for every $p\geq1$,

```{math}
\Wass_p(\alpha,\beta)
\leq
\widetilde C_{d,p}R^{1-\frac{1}{pd}}
\operatorname{SW}_p(\alpha,\beta)^{\frac{1}{pd}},
```

or, equivalently,

```{math}
\operatorname{SW}_p(\alpha,\beta)
\geq
\widetilde c_{d,p}R
\left(\frac{\Wass_p(\alpha,\beta)}{R}\right)^{pd}.
```

For $p=1$, the exponent $1/d$ in this last comparison is sharp.
:::

:::{dropdown} Proof
Non-negativity and symmetry follow from the one-dimensional Wasserstein
distance. For the triangle inequality, apply the triangle inequality of
$\Wass_p$ in every direction and then Minkowski's inequality in
$L^p(\mathbb S^{d-1})$.

If $\operatorname{SW}_p(\alpha,\beta)=0$, the projected measures agree for
almost every direction. Continuity of characteristic functions extends the
equality to all directions, and Cramér--Wold gives $\alpha=\beta$.

Let $\pi$ be any coupling of $\alpha$ and $\beta$. Projecting $\pi$ gives

```{math}
\Wass_p\big((P_\theta)_\sharp\alpha,(P_\theta)_\sharp\beta\big)^p
\leq
\int_{\mathbb R^d\times\mathbb R^d}
|\langle\theta,x-y\rangle|^p\d\pi(x,y).
```

Rotational invariance yields

```{math}
\int_{\mathbb S^{d-1}}|\langle\theta,z\rangle|^p\d\sigma(\theta)
=
\kappa_{d,p}\|z\|^p.
```

Integrating the projected bound and optimizing over $\pi$ proves the direct
comparison. The beta-integral formula for the first coordinate of a uniform
point on the sphere gives the displayed value of $\kappa_{d,p}$.

For the topology, $\Wass_p$ convergence implies sliced convergence by this
upper bound. Conversely, if $\operatorname{SW}_p(\alpha_n,\alpha)\to0$, then

```{math}
\int_{\mathbb S^{d-1}}\int |\langle\theta,x\rangle|^p
\d\alpha_n(x)\d\sigma(\theta)
=
\kappa_{d,p}\int\|x\|^p\d\alpha_n(x).
```

The projected-quantile formula gives uniform moment bounds and hence
tightness. Every subsequence has a further subsequence whose projected
$\Wass_p$ distances vanish for almost every direction; Cramér--Wold identifies
every weak limit with $\alpha$. If $Q_{n,\theta}$ and $Q_\theta$ are the
projected quantiles, then

```{math}
\operatorname{SW}_p(\alpha_n,\alpha)
=
\|Q_{n,\theta}-Q_\theta\|_{L^p(\mathbb S^{d-1}\times(0,1))}.
```

Together with the spherical identity, this gives convergence of the $p$th
moments, hence convergence in $\Wass_p$.

The compact-support reverse estimates use the Radon structure of slices.
Bonnotte's Lemma 5.1.4 {cite:p}`bonnotte2013unidimensional` proves

```{math}
\Wass_1(\alpha,\beta)
\leq
C_dR^{\frac{d}{d+1}}\operatorname{SW}_1(\alpha,\beta)^{\frac{1}{d+1}}
```

by smoothing a Kantorovich--Rubinstein test function, representing the smoothed
test through one-dimensional projections, and optimizing the smoothing scale.
On $B_R$,

```{math}
\Wass_p^p\leq(2R)^{p-1}\Wass_1,
\qquad
\operatorname{SW}_1\leq\operatorname{SW}_p.
```

The first inequality evaluates the $p$-cost on a $\Wass_1$-optimal coupling;
the second uses $\Wass_1\leq\Wass_p$ on each slice and Hölder's inequality in
the direction variable. They give Bonnotte's general-$p$ estimate. The sharper
$p=1$ theorem of Carlier, Figalli, Mérigot and Wang
{cite:p}`CarlierFigalliMerigotWang2025SlicedW1` replaces $1/(d+1)$ by the
optimal exponent $1/d$. Combining it with the same two inequalities gives

```{math}
\Wass_p^p
\leq
C_{d,p}R^{p-\frac1d}\operatorname{SW}_p^{\frac1d},
```

which is equivalent to the final two-sided formulation. Thus every $p$ admits
a bounded-support lower bound on $\operatorname{SW}_p$ in terms of $\Wass_p$;
sharpness is asserted only for $p=1$.
:::

The infinitesimal comparison is most transparent along smooth Brenier
perturbations. The usual Wasserstein distance sees the full $L^2(\alpha)$ norm
of the displacement, while slicing sees only its one-dimensional projections.
The same result also isolates the different behavior of finite atomic curves.

(prop-sliced-first-order-tangent)=
:::{admonition} Proposition: First-Order Comparison: Strictness and Atomic Equality
:class: theorem

Let $\alpha\in\Pp_2(\RR^d)$ be absolutely continuous, and let
$\varphi\in C^2(\RR^d)$ be such that $\nabla\varphi\in L^2(\alpha;\RR^d)$ and
$\nabla^2\varphi$ is bounded. For $\abs{t}$ small enough, set

```{math}
T_t(x)\eqdef x+t\nabla\varphi(x),
\qquad
\alpha_t\eqdef(T_t)_\sharp\alpha .
```

Then $T_t$ is the quadratic Brenier map from $\alpha$ to $\alpha_t$ for
$\abs{t}$ small enough, and

```{math}
\Wass_2(\alpha,\alpha_t)^2
=
t^2\int_{\RR^d}\norm{\nabla\varphi(x)}^2\d\alpha(x).
```

Moreover,

```{math}
\SW_2(\alpha,\alpha_t)^2
\leq
\frac{t^2}{d}\int_{\RR^d}\norm{\nabla\varphi(x)}^2\d\alpha(x).
```

The upper bound can be strict at order $t^2$. Let $d\geq2$, let
$\alpha=\Gaussian(0,\Id)$, and take
$\varphi(x)=\frac12x^\top A x$ for a symmetric matrix $A$ that is not a scalar
multiple of $\Id$. Then

```{math}
\lim_{t\to0}\frac{\SW_2(\alpha,\alpha_t)^2}{t^2}
=
\frac{\tr(A)^2+2\tr(A^2)}{d(d+2)}
<
\frac{\tr(A^2)}{d}
=
\frac1d\lim_{t\to0}\frac{\Wass_2(\alpha,\alpha_t)^2}{t^2}.
```

Separately, equality holds at first order along every finite atomic curve with
fixed weights. Let $a_i>0$ satisfy $\sum_i a_i=1$, let the $x_i$ be pairwise
distinct, and let $v_i\in\RR^d$. If
$\eta=\sum_{i=1}^n a_i\delta_{x_i}$ and
$\eta_t=\sum_{i=1}^n a_i\delta_{x_i+t v_i}$, then

```{math}
\lim_{t\to0}\frac{\SW_2(\eta,\eta_t)^2}{t^2}
=
\frac1d\sum_{i=1}^n a_i\norm{v_i}^2
=
\frac1d\lim_{t\to0}\frac{\Wass_2(\eta,\eta_t)^2}{t^2}.
```
:::

:::{admonition} Proof
:class: proof

The map $T_t$ is the gradient of
$\psi_t(x)=\frac12\norm{x}^2+t\varphi(x)$. Since $\nabla^2\varphi$ is bounded,
$\nabla^2\psi_t=\Id+t\nabla^2\varphi$ is positive semidefinite for $\abs{t}$
small enough. Hence $\psi_t$ is convex and $T_t=\nabla\psi_t$ is a Brenier map.
Its graph is cyclically monotone, so the Brenier optimality criterion gives

```{math}
\Wass_2(\alpha,\alpha_t)^2
=
\int\norm{x-T_t(x)}^2\d\alpha(x)
=
t^2\int\norm{\nabla\varphi(x)}^2\d\alpha(x).
```

For each $\theta$, the coupling $(P_\theta,P_\theta\circ T_t)_\sharp\alpha$ is
admissible between $(P_\theta)_\sharp\alpha$ and
$(P_\theta)_\sharp\alpha_t$, so

```{math}
\Wass_2\big((P_\theta)_\sharp\alpha,(P_\theta)_\sharp\alpha_t\big)^2
\leq
t^2\int\abs{\dotp{\theta}{\nabla\varphi(x)}}^2\d\alpha(x).
```

Integrating over $\theta$ and using
$\int_{\Sphere^{d-1}}\abs{\dotp{\theta}{w}}^2\d\sigma(\theta)=\norm{w}^2/d$
proves the result.

For the Gaussian example, $T_t=\Id+tA$. The projected source and target in
direction $\theta$ are centered one-dimensional Gaussians with standard
deviations $1$ and $\norm{(\Id+tA)\theta}$. Hence

```{math}
\lim_{t\to0}\frac{1}{t^2}
\Wass_2\big((P_\theta)_\sharp\alpha,(P_\theta)_\sharp\alpha_t\big)^2
=(\theta^\top A\theta)^2.
```

The spherical fourth-moment identity gives

```{math}
\int_{\Sphere^{d-1}}(\theta^\top A\theta)^2\d\sigma(\theta)
=\frac{\tr(A)^2+2\tr(A^2)}{d(d+2)}.
```

The Brenier formula gives
$\Wass_2(\alpha,\alpha_t)^2=t^2\tr(A^2)$, and strictness follows from
$\tr(A)^2<d\tr(A^2)$ for a symmetric non-scalar matrix.

For the atomic curve, the diagonal coupling between $x_i$ and $x_i+t v_i$ is
optimal for all sufficiently small $t$. Indeed, with
$c_{ij}(t)=\norm{x_i-x_j-tv_j}^2$, the discrete dual potentials $f_i=0$ and
$g_j=c_{jj}(t)$ are feasible for small $t$ and certify the diagonal plan. Thus

```{math}
\Wass_2(\eta,\eta_t)^2=t^2\sum_{i=1}^n a_i\norm{v_i}^2.
```

Outside the finite union of great spheres
$\{\dotp{\theta}{x_i-x_j}=0\}$, the projected atoms are distinct and retain
their order for small $t$. The monotone one-dimensional coupling therefore
pairs each atom with its perturbation. The diagonal projected coupling gives a
uniform integrable upper bound, so dominated convergence and the spherical
second-moment identity yield the sliced limit.
:::

(par-sliced-intrinsic-length)=
### Intrinsic Sliced Length

In dimension one, $\SW_2=\Wass_2$. For $d\geq2$, $\SW_2$ is not a length metric
{cite:p}`ParkSlepcev2023SlicedGeometry`. Its intrinsic, or path, metric is

```{math}
:label: eq-intrinsic-sliced-length
\ell_{\SW_2}(\alpha,\beta)
\eqdef
\inf_{\substack{\gamma_0=\alpha,\ \gamma_1=\beta\\
\gamma\ \text{$\SW_2$-absolutely continuous}}}
\int_0^1\abs{\dot\gamma_t}_{\SW_2}\,\d t,
```

where $\abs{\dot\gamma_t}_{\SW_2}$ is the metric derivative. Park and Slepčev
prove that the infimum is attained, so $(\Pp_2(\RR^d),\ell_{\SW_2})$ is a
geodesic space. Every path length dominates the endpoint distance, while
Proposition {ref}`prop-sliced-wasserstein-metric` bounds the sliced length of a
$\Wass_2$-geodesic. Therefore

```{math}
\SW_2\leq\ell_{\SW_2}\leq d^{-1/2}\Wass_2.
```

Neither inequality identifies the intrinsic geometry with a rescaled
Wasserstein geometry. Proposition {ref}`prop-sliced-first-order-tangent` shows
that the sliced metric derivative equals $d^{-1/2}$ times the Wasserstein
metric derivative along finite atomic curves with fixed weights. By contrast,
the Gaussian deformation in the same proposition is strictly slower for
$\SW_2$. Its sliced speed depends continuously on time, so strictness persists
on a short interval. Integrating along that $\Wass_2$-geodesic gives, for every
sufficiently small $t\neq0$,

```{math}
\ell_{\SW_2}(\alpha,\alpha_t)
<d^{-1/2}\Wass_2(\alpha,\alpha_t).
```

There is no reverse comparison by a constant depending only on dimension.
Example 3.2 of Park and Slepčev considers two nearby parallel line segments
moving in opposite directions. Most projected motions cancel after slicing:
for every $\delta>0$, the construction produces a compactly supported atomless
curve $(\alpha_t^\delta)_t$ such that, for small $t\geq0$,

```{math}
\abs{\dot\alpha_t^\delta}_{\Wass_2}=1,
\qquad
\abs{\dot\alpha_t^\delta}_{\SW_2}\leq C_d(t+\delta).
```

Since the first identity gives
$\Wass_2(\alpha_0^\delta,\alpha_h^\delta)=h+o(h)$, while the second gives
$\ell_{\SW_2}(\alpha_0^\delta,\alpha_h^\delta)
\leq C_d(\delta h+h^2/2)$, one obtains

```{math}
\limsup_{h\downarrow0}
\frac{\ell_{\SW_2}(\alpha_0^\delta,\alpha_h^\delta)}
     {\Wass_2(\alpha_0^\delta,\alpha_h^\delta)}
\leq C_d\delta.
```

Letting $\delta\to0$ gives

```{math}
:label: eq-no-lower-comparison-sliced-length
\inf_{\substack{\alpha,\beta\in\Pp_2(\RR^d)\\\alpha\neq\beta}}
\frac{\ell_{\SW_2}(\alpha,\beta)}{\Wass_2(\alpha,\beta)}=0.
```

Thus $\ell_{\SW_2}$ and $\Wass_2$ are not globally bi-Lipschitz equivalent,
even after inserting the factor $d^{-1/2}$.

The atomic equality remains stable in its natural regime. If $\eta$ is a fixed
finite atomic measure with positive masses and separated atoms, Theorem 5.5 of
Park and Slepčev gives

```{math}
\frac{\SW_2(\eta,\beta)}{\Wass_2(\eta,\beta)}
\longrightarrow\frac1{\sqrt d},
\qquad
\frac{\ell_{\SW_2}(\eta,\beta)}{\Wass_2(\eta,\beta)}
\longrightarrow\frac1{\sqrt d}
\quad\text{as }\Wass_\infty(\eta,\beta)\to0,
```

along $\beta\neq\eta$. By contrast, under suitable common-support and density
bounds in the diffuse regime, their Theorem 5.2 shows that both $\SW_2$ and
$\ell_{\SW_2}$ are locally equivalent to $\dot H^{-(d+1)/2}$, while the
infinitesimal geometry of $\Wass_2$ around a positive density is of
$\dot H^{-1}$ type. These results settle the comparison: the intrinsic sliced
metric agrees asymptotically with $d^{-1/2}\Wass_2$ near finite atomic measures,
but it is genuinely different globally and around diffuse measures.

(rem-sliced-hilbert-embedding)=
:::{admonition} Remark: Hilbert embedding for $\SW_2$
:class: ot4ml-remark

In one dimension, $\Wass_2$ is the $L^2(0,1)$ distance between quantile functions. Hence

```{math}
\SW_2(\alpha,\beta)^2
=
\int_{\Sphere^{d-1}}\int_0^1
\abs{F_{\theta,\alpha}^{-1}(u)-F_{\theta,\beta}^{-1}(u)}^2
\d u\d\sigma(\theta),
```

where $F_{\theta,\alpha}^{-1}$ is the quantile of $(P_\theta)_\sharp\alpha$. Thus $\SW_2$ is a Hilbertian distance after embedding each measure into its field of projected quantiles. Consequently, $\exp(-\gamma\SW_2^2)$ is a positive definite kernel on probability measures for every $\gamma>0$.

The compact reverse estimates in Proposition {ref}`prop-sliced-wasserstein-metric` explain why sliced distances metrize the same topology on bounded sets, while the dimension-dependent powers prevent a dimension-free bi-Lipschitz comparison with $\Wass_p$.
:::


### $L^q$-Sliced, Max-Sliced and Subspace Variants

The exponent used to aggregate projection directions need not coincide with
the transport exponent. A second exponent $q$ controls this aggregation:
finite $q$ pools information from many directions, whereas $q=\infty$ retains
only the most discriminating one. Independently, replacing lines by
$k$-dimensional subspaces preserves more correlations at the price of solving
higher-dimensional projected OT problems. These two choices fit into one
family.

(def-sliced-variants)=
:::{admonition} Definition: $L^q$-Sliced and Subspace-Sliced Wasserstein
:class: important
Let $p\in[1,\infty)$, $q\in[1,\infty]$, and $1\leq k\leq d$. Denote by

```{math}
\operatorname{St}(d,k)
\eqdef
\{U\in\RR^{d\times k}:U^\top U=I_k\}
```

the Stiefel manifold, equipped with its normalized invariant probability
measure $\sigma_{d,k}$. For $q<\infty$, define

```{math}
:label: eq-lq-subspace-sliced
\SW_{p,q,k}(\alpha,\beta)
\eqdef
\left(
\int_{\operatorname{St}(d,k)}
\Wass_p\big((U^\top)_\sharp\alpha,(U^\top)_\sharp\beta\big)^q
\d\sigma_{d,k}(U)
\right)^{1/q},
```

and extend the definition to $q=\infty$ by

```{math}
\SW_{p,\infty,k}(\alpha,\beta)
\eqdef
\sup_{U\in\operatorname{St}(d,k)}
\Wass_p\big((U^\top)_\sharp\alpha,(U^\top)_\sharp\beta\big).
```

The supremum is attained because the Stiefel manifold is compact and the
projected Wasserstein distance depends continuously on $U$. Moreover, the
integrand is unchanged under $U\mapsto UQ$ for $Q\in\operatorname O(k)$,
because $Q^\top$ is an isometry of $\RR^k$. Thus the construction depends only
on the subspace spanned by the columns of $U$; the Stiefel manifold is a
convenient parametrization of the corresponding Grassmann manifold.

We use the abbreviations

```{math}
\SW_{p,q}\eqdef\SW_{p,q,1},
\qquad
\SW_p=\SW_{p,p},
\qquad
\operatorname{MaxSW}_{p,k}\eqdef\SW_{p,\infty,k},
\qquad
\operatorname{MaxSW}_p=\SW_{p,\infty}.
```

Thus $k=1$ gives line-based slicing, $q=\infty$ gives max-slicing, and $k=d$
gives $\SW_{p,q,d}=\Wass_p$ for every $q$. Quadratic max-slicing is useful when only a
small set of directions carries the discrepancy, for instance in generative
modeling {cite:p}`deshpande2019maxsliced`. For $p=2$, the $k$-dimensional
max-sliced case is the projection-robust Wasserstein distance, which is related
to the subspace-robust distances
studied later in {ref}`sec-spectral-subspace-wasserstein`
{cite:p}`paty2019subspace`.
:::

Metricity and the direct comparison with $\Wass_p$ carry over from ordinary
slicing. The topological statement requires slightly more care when $q<p$:
although an abstract $L^q$ norm need not control an $L^p$ norm, projected
Wasserstein profiles have enough continuity and moment control to rule out
concentration in a vanishing set of subspaces. The next proposition separates
the roles of $p$, $q$, and $k$.

(prop-sliced-variant-bounds)=
:::{admonition} Proposition: Basic Bounds for Sliced Variants
:class: important
Let $p\in[1,\infty)$, $1\leq q\leq r\leq\infty$, and
$1\leq k\leq\ell\leq d$. Each $\SW_{p,q,k}$ is a finite distance on
$\mathcal P_p(\RR^d)$ and metrizes the same topology as $\Wass_p$. Moreover,

```{math}
:label: eq-lq-sliced-monotonicity
\SW_{p,q,k}(\alpha,\beta)
\leq
\SW_{p,r,k}(\alpha,\beta)
\leq
\Wass_p(\alpha,\beta).
```

The distances are also monotone in the projection dimension:

```{math}
:label: eq-subspace-dimension-monotonicity
\SW_{p,q,k}(\alpha,\beta)
\leq
\SW_{p,q,\ell}(\alpha,\beta)
\leq
\Wass_p(\alpha,\beta).
```

For a unit vector $e\in\mathbb S^{d-1}$, set

```{math}
\kappa_{d,k,p}
\eqdef
\int_{\operatorname{St}(d,k)}\|U^\top e\|^p\d\sigma_{d,k}(U)
=
\frac{\Gamma(d/2)\Gamma((k+p)/2)}
     {\Gamma(k/2)\Gamma((d+p)/2)}.
```

Then $\kappa_{d,d,p}=1$ and $\kappa_{d,1,p}=\kappa_{d,p}$ from
{ref}`prop-sliced-wasserstein-metric`, and

```{math}
:label: eq-lq-subspace-sliced-upper-bound
\SW_{p,q,k}(\alpha,\beta)
\leq
\begin{cases}
\kappa_{d,k,p}^{1/p}\Wass_p(\alpha,\beta), & 1\leq q\leq p,\\
\kappa_{d,k,p}^{1/q}\Wass_p(\alpha,\beta), & p\leq q<\infty,\\
\Wass_p(\alpha,\beta), & q=\infty.
\end{cases}
```

Moreover,

```{math}
:label: eq-subspace-sliced-lower-bound
\SW_p(\alpha,\beta)
\leq
\SW_{p,p,k}(\alpha,\beta)
\leq
\kappa_{d,k,p}^{1/p}\Wass_p(\alpha,\beta).
```

In particular, $\kappa_{d,k,2}=k/d$ and
$\SW_{2,2,k}^2\leq(k/d)\Wass_2^2$. If $q\geq p$, the compact-support reverse
estimates in {ref}`prop-sliced-wasserstein-metric` remain valid with
$\SW_{p,q,k}$ in place of $\SW_p$.
:::

:::{dropdown} Proof
Write
$D_U(\alpha,\beta)=
\Wass_p((U^\top)_\sharp\alpha,(U^\top)_\sharp\beta)$.
Non-negativity and symmetry are inherited from $\Wass_p$, while Minkowski's
inequality in $L^q(\sigma_{d,k})$, or the supremum triangle inequality for
$q=\infty$, proves the triangle inequality. The reverse triangle inequality
for $\Wass_p$ shows that $U\mapsto D_U(\alpha,\beta)$ is continuous. Indeed,

```{math}
\Wass_p\big((U_n^\top)_\sharp\alpha,(U^\top)_\sharp\alpha\big)
\leq
\|U_n-U\|_{\mathrm{op}}
\left(\int\|x\|^p\d\alpha(x)\right)^{1/p}.
```

Thus $\SW_{p,q,k}(\alpha,\beta)=0$ implies $D_U=0$ for every $U$: this is
immediate for $q=\infty$, while for finite $q$ it follows from continuity and
the full support of $\sigma_{d,k}$. Choosing a frame whose first column is any
prescribed $\theta\in\mathbb S^{d-1}$ shows that all one-dimensional
projections of $\alpha$ and $\beta$ agree; Cramér--Wold gives $\alpha=\beta$.

Every $U^\top$ is $1$-Lipschitz, so $D_U\leq\Wass_p$, and monotonicity of
$L^q$ norms proves the first comparison. To compare dimensions, let
$V\in\operatorname{St}(d,\ell)$ and $R\in\operatorname{St}(\ell,k)$. Since
$(VR)^\top=R^\top V^\top$, projection contraction gives $D_{VR}\leq D_V$.
Moreover, $VR$ is uniformly distributed on $\operatorname{St}(d,k)$ when $V$
and $R$ carry their invariant measures. Integration proves monotonicity in
$k$; the supremum case follows by extending each $k$-frame to an $\ell$-frame.

For any $\pi\in\Gamma(\alpha,\beta)$,

```{math}
D_U(\alpha,\beta)^p
\leq
\int\|U^\top(x-y)\|^p\d\pi(x,y).
```

Integrating in $U$ and minimizing in $\pi$ gives
$\|D_\cdot\|_{L^p}^p\leq\kappa_{d,k,p}\Wass_p^p$. Monotonicity of $L^q$ norms
proves the case $q\leq p$; for $q\geq p$, combine this estimate with
$D_U\leq\Wass_p$. Finally, average

```{math}
\Wass_p\big((P_{U\omega})_\sharp\alpha,(P_{U\omega})_\sharp\beta\big)
\leq D_U(\alpha,\beta)
```

over $U$ and $\omega\in\mathbb S^{k-1}$. Since $U\omega$ is uniform on
$\mathbb S^{d-1}$, this gives $\SW_p\leq\SW_{p,p,k}$. For $q\geq p$, this also
transfers the compact-support reverse estimates for ordinary sliced
Wasserstein.

It remains to prove the topological assertion. Define
$M_p(\eta)=(\int\|x\|^p\d\eta(x))^{1/p}$. For the Dirac mass at the origin,

```{math}
D_U(\eta,\delta_0)^p
=
\int\|U^\top x\|^p\d\eta(x),
\qquad
\int D_U(\eta,\delta_0)^p\d\sigma_{d,k}(U)
=
\kappa_{d,k,p}M_p(\eta)^p.
```

Since $D_U(\eta,\delta_0)\leq M_p(\eta)$, one obtains

```{math}
:label: eq-lq-sliced-radial-moment
\SW_{p,q,k}(\eta,\delta_0)
\geq
\begin{cases}
\kappa_{d,k,p}^{1/q}M_p(\eta), & 1\leq q\leq p,\\
\kappa_{d,k,p}^{1/p}M_p(\eta), & p\leq q\leq\infty.
\end{cases}
```

Consequently, if $\SW_{p,q,k}(\alpha_n,\alpha)\to0$, the triangle inequality
gives a uniform bound on $M_p(\alpha_n)$. The functions
$D_{n,U}=D_U(\alpha_n,\alpha)$ are therefore uniformly equicontinuous because

```{math}
|D_{n,U}-D_{n,V}|
\leq
\|U-V\|_{\mathrm{op}}
\big(M_p(\alpha_n)+M_p(\alpha)\big).
```

On the compact Stiefel manifold, equicontinuity and full support upgrade
$L^q$ convergence to uniform convergence. Choosing a frame whose first column
is $\theta$ then shows uniformly that

```{math}
\Wass_p\big((P_\theta)_\sharp\alpha_n,(P_\theta)_\sharp\alpha\big)
\leq D_{n,U}\longrightarrow0.
```

Thus $\SW_p(\alpha_n,\alpha)\to0$, and Proposition
{ref}`prop-sliced-wasserstein-metric` yields
$\Wass_p(\alpha_n,\alpha)\to0$. The converse follows from
$\SW_{p,q,k}\leq\Wass_p$.
:::

### Min-SW Lifted Transport Plans

The preceding constructions compare projected measures. Min-SW uses a
projection differently: it lifts the one-dimensional monotone coupling back
to the ambient space and retains the lift with the smallest quadratic cost.
Consider equal-weight empirical measures
$\alpha=n^{-1}\sum_i\delta_{x_i}$ and
$\beta=n^{-1}\sum_i\delta_{y_i}$. For a direction $\theta$ along which both
projected point families have distinct coordinates, let
$\sigma_\theta,\tau_\theta\in\mathfrak S_n$ be their sorting permutations:

```{math}
\dotp{x_{\sigma_\theta(1)}}{\theta}<\cdots<
\dotp{x_{\sigma_\theta(n)}}{\theta},
\qquad
\dotp{y_{\tau_\theta(1)}}{\theta}<\cdots<
\dotp{y_{\tau_\theta(n)}}{\theta}.
```

Lifting the one-dimensional monotone matching gives

```{math}
:label: eq-min-sw-empirical-plan
\pi_\theta
=
\frac1n\sum_{i=1}^n
\delta_{(x_{\sigma_\theta(i)},y_{\tau_\theta(i)})}
\in\Couplings(\alpha,\beta).
```

The cost of {eq}`eq-min-sw-empirical-plan` is an upper bound on
$\Wass_2(\alpha,\beta)^2$, and Min-SW minimizes this upper bound over
$\theta$. This inexpensive feasible-plan construction was introduced by
Mahey, Chapel, Gasso, Bonet and Courty
{cite:p}`MaheyChapelGassoBonetCourty2023MinSW`.

Projected ties make the extension beyond this generic empirical setting less
immediate. At a tie, the sorting permutations are not unique. Breaking ties
by labels is not invariant under a relabeling of the atoms, while a
lexicographic rule depends on an auxiliary coordinate system; both choices can
be discontinuous under perturbations. For a non-discrete measure, a projection
fiber may carry an entire conditional distribution, so there are no labels to
sort. Tanguy, Chapel and Delon
{cite:p}`TanguyChapelDelon2025SlicedTransportPlans` avoid arbitrary tie
breaking by optimizing over all compatible lifts. Set

```{math}
\alpha_\theta=(P_\theta)_\sharp\alpha,
\qquad
\beta_\theta=(P_\theta)_\sharp\beta,
```

and let

```{math}
\varpi_\theta
=
(q_{\alpha_\theta},q_{\beta_\theta})_\sharp
\mathrm{Leb}_{[0,1]}
```

be their canonical monotone coupling, as in Theorem
{ref}`prop-1d-kantorovich-quantile-coupling`. Define

```{math}
:label: eq-min-sw-constrained-lifts
\mathcal C_\theta(\alpha,\beta)
\eqdef
\left\{
\pi\in\Couplings(\alpha,\beta)
\;:\;
(P_\theta,P_\theta)_\sharp\pi=\varpi_\theta
\right\}.
```

This set is nonempty. Indeed, disintegrate along $P_\theta$,

```{math}
\alpha(\d x)=\int_\RR \alpha^s(\d x)\d\alpha_\theta(s),
\qquad
\beta(\d y)=\int_\RR \beta^t(\d y)\d\beta_\theta(t),
```

and form the conditionally independent lift

```{math}
:label: eq-min-sw-fiber-lift
\pi_\theta^0(\d x,\d y)
=
\int_{\RR^2}
\alpha^s(\d x)\beta^t(\d y)
\d\varpi_\theta(s,t).
```

It belongs to $\mathcal C_\theta(\alpha,\beta)$. A representation-invariant
measure-level extension is therefore

```{math}
:label: eq-min-sw-definition
\MinSW_2(\alpha,\beta)^2
\eqdef
\min_{\theta\in\Sphere^{d-1}}
\min_{\pi\in\mathcal C_\theta(\alpha,\beta)}
\int_{\RR^d\times\RR^d}\norm{x-y}^2\d\pi(x,y).
```

Both minima are attained for $\alpha,\beta\in\Pp_2(\RR^d)$
{cite:p}`TanguyChapelDelon2025SlicedTransportPlans`. Unlike the particular
lift {eq}`eq-min-sw-fiber-lift`, the inner minimization may correlate the
conditional laws on
$P_\theta^{-1}(s)\times P_\theta^{-1}(t)$; it chooses the least costly
transverse coupling compatible with the prescribed projected coupling. When
the empirical projections have no ties,
$\mathcal C_\theta(\alpha,\beta)=\{\pi_\theta\}$ and
{eq}`eq-min-sw-definition` reduces to {eq}`eq-min-sw-empirical-plan`.

(prop-min-sw-comparison)=
:::{admonition} Proposition: Min-SW Bounds, Exactness and Metric Status
:class: theorem

For $\alpha,\beta\in\Pp_2(\RR^d)$,

```{math}
:label: eq-min-sw-comparison
\Wass_2(\alpha,\beta)
\leq
\MinSW_2(\alpha,\beta)
\leq
\inf_{z\in\RR^d}
\left(
2\int\norm{x-z}^2\d\alpha(x)
+2\int\norm{y-z}^2\d\beta(y)
\right)^{1/2}.
```

If both supports lie in a compact set $K$, the last term can be replaced by
$\diam(K)$. Moreover,
$\MinSW_2(\alpha,\beta)=\Wass_2(\alpha,\beta)$ if and only if some quadratic
optimal plan $\pi^\star\in\Couplings(\alpha,\beta)$ satisfies
$(P_\theta,P_\theta)_\sharp\pi^\star=\varpi_\theta$ for some $\theta$.
Thus, for equal-weight point clouds, equality holds whenever an optimal
assignment is induced by sorting both clouds along one direction. In
particular, it holds for two uniform $n$-point measures when $d\geq2n-1$ and
the concatenated family $x_1,\ldots,x_n,y_1,\ldots,y_n$ is in general position
{cite:p}`TanguyChapelDelon2025SlicedTransportPlans`. Here general position
means that, for each $1\leq k\leq d$, no subset of $k+2$ points from this
family lies in a $k$-dimensional affine subspace.

The function $\MinSW_2$ is non-negative, symmetric and separates measures,
but it does not satisfy the triangle inequality in general. It is therefore a
separating symmetric discrepancy, not a distance.
:::

:::{admonition} Proof
:class: proof

Every $\pi\in\mathcal C_\theta(\alpha,\beta)$ is an admissible coupling,
which proves the first inequality in {eq}`eq-min-sw-comparison`. For every
$z\in\RR^d$, the pointwise bound
$\norm{x-y}^2\leq2\norm{x-z}^2+2\norm{y-z}^2$ proves the second one after
minimizing over $z$, while
$\norm{x-y}\leq\diam(K)$ gives the compact-support version. Equality with
$\Wass_2$ holds precisely when the constrained set for some direction contains
a quadratic optimal plan. Under the stated dimension and general-position
hypotheses, every ordering of the concatenated $2n$-point family is induced by
some linear projection. One may therefore choose an ordering that realizes an
optimal assignment; this is the projection-order theorem proved in
{cite:p}`TanguyChapelDelon2025SlicedTransportPlans`.

Symmetry follows by transposing the constrained plans, and separation follows
from the lower bound by $\Wass_2$. To see that the triangle inequality can
fail, let $\alpha_X,\alpha_Y,\alpha_Z$ be the uniform laws on the rows of

```{math}
X=\begin{pmatrix}-4&-4\\0&3\\1&-2\\4&-4\end{pmatrix},
\qquad
Z=\begin{pmatrix}-3&2\\2&2\\0&0\\2&-4\end{pmatrix},
\qquad
Y=\frac{X+Z}{2}.
```

A direct enumeration of the $4!$ assignments shows that the identity
assignment is quadratically optimal for both $(X,Y)$ and $(Y,Z)$. It is
induced by sorting along directions proportional to $(2,-1)$ and $(3,1)$,
respectively. Hence

```{math}
\MinSW_2(\alpha_X,\alpha_Y)^2
=
\MinSW_2(\alpha_Y,\alpha_Z)^2
=\frac{51}{16}.
```

For $(X,Z)$, the projected orders change only across the ten lines orthogonal
to pairwise differences of rows of $X$ or $Z$. Since the cost is linear in the
plan, it suffices to enumerate the resulting angular cells and, on their
boundaries, the compatible extreme permutations. This gives the nine distinct
squared costs

```{math}
\frac14\{63,67,73,79,91,95,105,131,135\}.
```

Thus $\MinSW_2(\alpha_X,\alpha_Z)^2=63/4$, and consequently

```{math}
\MinSW_2(\alpha_X,\alpha_Z)=\frac{\sqrt{63}}{2}
>
\frac{\sqrt{51}}{2}
=
\MinSW_2(\alpha_X,\alpha_Y)
+
\MinSW_2(\alpha_Y,\alpha_Z).
```
:::

For comparison, fixing $\theta$ before comparing the measures restores a
metric on equal-weight $n$-point clouds whose $\theta$-projections are
injective: it is $n^{-1/2}$ times the Euclidean distance between the two tuples
ordered along $\theta$. The constrained fixed-direction extension is likewise
a metric on the class of measures with atomless $\theta$-projections
{cite:p}`TanguyChapelDelon2025SlicedTransportPlans`. It is the subsequent
pair-dependent minimization over $\theta$ that destroys the triangle
inequality. In dimension one no such directional choice remains, and
$\MinSW_2=\Wass_2$.

The right-hand side of {eq}`eq-min-sw-comparison` and the diameter estimate are
absolute upper bounds, not multiplicative comparisons with $\Wass_2$. Beyond
the exactness criterion above, the cited theory does not provide a universal
converse of the form $\MinSW_2\leq C\Wass_2$.

Figure {ref}`fig:min-sliced-transport-plan` illustrates the resulting gap: the direction selected by Min-SW produces a valid lifted planar coupling, but that coupling need not be the quadratic optimal plan.

(fig:min-sliced-transport-plan)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("min-sliced-transport-plan")
```

*Min-SW lifted plan. A deterministic angular sweep selects a projection,
after which the red and blue atoms are sorted and matched in one dimension.
The middle panel lifts this matching back to the plane. Its cost upper-bounds
$W_2^2$, but the resulting feasible plan need not equal the quadratic optimal
plan shown on the right.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Rotate the slicing direction to see how one-dimensional
sorting induces a lifted feasible plan in the original plane.
:::

<iframe class="ot4ml-live-frame" title="Sliced Wasserstein controls" src="../live/generalized-sliced.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>


(sec-quotient-wasserstein-procrustes)=
## Quotient Wasserstein and Wasserstein-Procrustes

Many comparison problems contain nuisance transformations: two shapes, images
or point clouds should be considered close after translating, rotating or
otherwise reparametrizing one of them. Quotient Wasserstein distances encode
this idea by computing transport after optimizing over a group action. This
construction is the metric analogue of passing from objects to shapes modulo
symmetries, and connects OT with shape spaces, metamorphosis models and
global-invariance variants of transport
{cite:p}`Metamorphosis2005,zemel2017fr,alvarez2018towards`.

(def-quotient-wasserstein)=
:::{admonition} Definition: Quotient Wasserstein Distance
:class: important

Let a group $\mathcal G$ act on a metric space $(\Xx,d)$ by isometries, and
assume that the action preserves finite $p$th moments. Write
$g_\sharp\alpha$ for the push-forward of a measure $\alpha$ by
$g\in\mathcal G$, and write
$[\alpha]\eqdef\{g_\sharp\alpha:g\in\mathcal G\}$ for its orbit. The quotient
$p$-Wasserstein distance between the orbits of
$\alpha,\beta\in\Pp_p(\Xx)$ is

```{math}
\Wass_{p,\mathcal G}([\alpha],[\beta])
\eqdef
\inf_{g,h\in\mathcal G}\Wass_p(g_\sharp\alpha,h_\sharp\beta)
=
\inf_{g\in\mathcal G}\Wass_p(\alpha,g_\sharp\beta).
```
:::

:::{admonition} Proposition: Metric Property on the Quotient
:class: theorem
:label: prop-quotient-wasserstein-metric

If $\mathcal G$ acts by isometries and preserves $\Pp_p(\Xx)$, then
$\Wass_{p,\mathcal G}$ is a pseudo-distance on $\Pp_p(\Xx)$. If, in addition,
the infimum is attained between every pair of orbits, then
it is a distance on the orbit space $\Pp_p(\Xx)/\mathcal G$. This applies in
particular to continuous actions of compact groups.
:::

:::{dropdown} Proof
Isometry of the action gives
$\Wass_p(g_\sharp\alpha,g_\sharp\beta)=\Wass_p(\alpha,\beta)$, which proves the second
formula above. Non-negativity and symmetry are inherited from $\Wass_p$. For
the triangle inequality, choose $g_1,g_2\in\mathcal G$ and write

```{math}
\Wass_p(\alpha,(g_1)_\sharp\beta)
+
\Wass_p(\beta,(g_2)_\sharp\gamma)
=
\Wass_p(\alpha,(g_1)_\sharp\beta)
+
\Wass_p((g_1)_\sharp\beta,(g_1g_2)_\sharp\gamma).
```

The triangle inequality for $\Wass_p$, followed by the infimum over
$g_1,g_2$, gives the result. If the infimum is attained and the quotient
distance is zero, there exist $g,h\in\mathcal G$ such that
$\Wass_p(g_\sharp\alpha,h_\sharp\beta)=0$, hence
$g_\sharp\alpha=h_\sharp\beta$, which is exactly equality of the two orbits.
For compact groups, continuity of the action and compactness give the required
attainment. Without attainment, distinct orbits at zero orbit distance must be
identified to obtain a genuine metric space.
:::

### Rigid Motions and Wasserstein-Procrustes

The most common example is the Euclidean group
$\mathrm E(d)=\mathrm O(d)\ltimes\RR^d$. For measures on $\RR^d$,
quotienting by rotations and translations gives the Wasserstein-Procrustes
problem

```{math}
\inf_{R\in\mathrm O(d),\,t\in\RR^d,\,\pi\in\Couplings(\alpha,\beta)}
\int\norm{Rx+t-y}^2\d\pi(x,y).
```

Replacing $\mathrm O(d)$ by $\mathrm{SO}(d)$ enforces orientation
preservation.
This is the case $p=2$ of the quotient distance; for a general exponent $p$,
one replaces the quadratic cost by the $p$th power of the Euclidean distance.
Although the translation group is noncompact, the quadratic problem is well
behaved: for fixed $R$ and $\pi$, the optimal translation aligns $R\bar x$ with
$\bar y$. The remaining rigid step is therefore an orthogonal Procrustes
problem over the compact group $\mathrm O(d)$.

For empirical measures, this couples a transport problem with a rigid
registration problem. Classical iterative closest point methods alternate
nearest-neighbor assignment and rigid least squares {cite:p}`BeslMcKay1992ICP`.
Wasserstein-Procrustes replaces these hard many-to-one nearest-neighbor
correspondences by a mass-preserving OT plan. This makes the registration
less tied to sampling density and better suited to ambiguous correspondences.

Two complementary machine-learning formulations clarify the scope of this
construction. Grave, Joulin and Berthet {cite:p}`grave2018unsupervised`
formulate unsupervised alignment of high-dimensional embeddings as a
Wasserstein-Procrustes problem. In their equal-weight setting, one jointly
estimates an orthogonal matrix and a permutation; they use a convex-relaxation
initialization and a stochastic large-scale solver, with bilingual lexicon
induction as the main application. Alvarez-Melis, Jegelka and Jaakkola
{cite:p}`alvarez2018towards` place the same idea in a broader framework: the
coupling and a latent global transformation are optimized jointly over a
flexible invariance class because cross-space costs are otherwise ill-defined.
The rigid quadratic model and block updates below are the isometric Procrustes
specialization of this global-invariance viewpoint.

This is an extrinsic counterpart of the Gromov--Wasserstein viewpoint
developed in {ref}`sec-gromov-wasserstein`. Procrustes alignment searches only
over ambient rigid motions, whereas GW is invariant under intrinsic
measure-preserving isometries. The following comparison makes this relation
precise.

(prop-gw-procrustes-upper-certificate)=
:::{admonition} Proposition: Wasserstein-Procrustes Upper Certificate
:class: important
Let $p\geq1$ and $\alpha,\beta\in\mathcal P_p(\RR^d)$. Equip both copies of
$\RR^d$ with the Euclidean distance and take $\Delta(u,v)=|u-v|$ in the GW
objective. Then

```{math}
:label: eq-gw-procrustes-upper
\operatorname{GW}((\RR^d,\norm{\cdot},\alpha),(\RR^d,\norm{\cdot},\beta))
\leq
2\,\Wass_{p,\mathrm E(d)}([\alpha],[\beta]).
```
:::

:::{dropdown} Proof
Fix $g,h\in\mathrm E(d)$. For every coupling
$\pi\in\Pi(\alpha,\beta)$, the push-forward
$\widetilde\pi=(g\times h)_\sharp\pi$, where
$(g\times h)(x,y)=(g(x),h(y))$, couples $g_\sharp\alpha$ and
$h_\sharp\beta$. Rigid motions preserve pairwise Euclidean distances, so the
GW objective has the same value at $\pi$ and $\widetilde\pi$. Applying the
same argument to $g^{-1}$ and $h^{-1}$ proves

```{math}
\operatorname{GW}((\RR^d,\norm{\cdot},\alpha),(\RR^d,\norm{\cdot},\beta))
=
\operatorname{GW}((\RR^d,\norm{\cdot},g_\sharp\alpha),
                   (\RR^d,\norm{\cdot},h_\sharp\beta)).
```

The fixed-space estimate {ref}`prop-gw-controlled-by-wasserstein` therefore
gives

```{math}
\operatorname{GW}((\RR^d,\norm{\cdot},\alpha),(\RR^d,\norm{\cdot},\beta))
\leq 2\,\Wass_p(g_\sharp\alpha,h_\sharp\beta).
```

Taking the infimum over $g,h\in\mathrm E(d)$ proves the claim.
:::

Thus a good Wasserstein-Procrustes registration certifies small GW distortion.
The converse need not hold: GW may be small because of an intrinsic
correspondence that is not induced by an ambient rigid motion. The Mémoli
profile lower bound in {ref}`prop-memoli-gw-profile-lower-bound` gives the
complementary intrinsic lower certificate.

The empirical problem naturally suggests an alternating minimization. Given a
current rigid motion $(R^{(k)},t^{(k)})$, first compute the OT coupling between
the registered source cloud and the target cloud,

```{math}
:label: eq-wasserstein-procrustes-coupling-update
\P^{(k)}
\in
\argmin_{\P\in\CouplingsD(\a,\b)}
\sum_{i,j}\P_{ij}\norm{R^{(k)}x_i+t^{(k)}-y_j}^2 .
```

Then freeze this coupling and update the rigid motion by

```{math}
:label: eq-wasserstein-procrustes-rigid-update
(R^{(k+1)},t^{(k+1)})
\in
\argmin_{R\in\mathrm O(d),\,t\in\RR^d}
\sum_{i,j}\P^{(k)}_{ij}\norm{Rx_i+t-y_j}^2 ,
```

or by the same formula with $R\in\mathrm{SO}(d)$ if orientation should be
preserved. The first step is an ordinary discrete OT problem with the current
registered cost matrix; the next proposition shows that the second step is an
orthogonal Procrustes problem with an explicit singular-value formula.

:::{admonition} Proposition: Rigid Update for a Fixed Coupling
:class: theorem
:label: prop-wasserstein-procrustes-rigid-update

Let $\alpha=\sum_i a_i\delta_{x_i}$ and
$\beta=\sum_j b_j\delta_{y_j}$, and fix
$\P\in\CouplingsD(\a,\b)$. Define

```{math}
\bar x=\sum_i a_i x_i,\qquad
\bar y=\sum_j b_j y_j,\qquad
M_\P=\sum_{i,j}\P_{ij}(y_j-\bar y)(x_i-\bar x)^\top .
```

If $M_\P=U\Sigma V^\top$ is a singular value decomposition, then the
minimizers over the full orthogonal group of

```{math}
\min_{R\in\mathrm O(d),\,t\in\RR^d}
\sum_{i,j}\P_{ij}\norm{Rx_i+t-y_j}^2
```

are given by $R^\star=UV^\top$ and
$t^\star=\bar y-R^\star\bar x$, up to the usual non-uniqueness when $M_\P$ is
rank deficient. If one imposes $R\in\mathrm{SO}(d)$, set

```{math}
D=\operatorname{diag}(1,\ldots,1,\det(UV^\top)),
\qquad
R^\star=UDV^\top,
\qquad
t^\star=\bar y-R^\star\bar x .
```
:::

:::{dropdown} Proof
For fixed $R$, differentiating with respect to $t$ gives
$t=\bar y-R\bar x$. Substituting this value centers the variables and leaves

```{math}
\sum_{i,j}\P_{ij}\norm{R(x_i-\bar x)-(y_j-\bar y)}^2.
```

The two quadratic terms independent of $R$ are fixed, so the problem is
equivalent to maximizing
$\sum_{i,j}\P_{ij}\dotp{R(x_i-\bar x)}{y_j-\bar y}
=\tr(R^\top M_\P)$. Von Neumann's trace inequality gives the maximum for
$R=UV^\top$. Under the constraint $R\in\mathrm{SO}(d)$, the same argument
applies with the additional determinant constraint on $U^\top R V$, which
gives the displayed diagonal correction.
:::

Equations {eq}`eq-wasserstein-procrustes-coupling-update`--{eq}`eq-wasserstein-procrustes-rigid-update`
give a block-coordinate method. The objective is not jointly convex, so the
scheme should be read as a registration heuristic for the quotient problem
rather than as a global solver. The exact block update moves the rigid motion
fully; for visualization or continuation, one may damp the displayed motion
between two successive poses.

(alg-wasserstein-procrustes)=
:::{admonition} Algorithm: Alternating Wasserstein--Procrustes alignment
:class: ot4ml-algorithm

**Input:** Weighted point clouds $(x_i,\a_i)_{i=1}^n$, $(y_j,\b_j)_{j=1}^m$, initial rigid motion $(R^{(0)},t^{(0)})$, tolerance $\mathrm{tol}$, choice $\mathrm O(d)$ or $\mathrm{SO}(d)$.

**Output:** Last coupling $\P$ and rigid motion $(R,t)$.

**Set** $\bar x=\sum_i\a_i x_i$, $\bar y=\sum_j\b_j y_j$, $k=0$ and $\eta_0=+\infty$.

**While** $\eta_k>\mathrm{tol}$ **do**:

>
> **Set** $C_{ij}^{(k)}=\norm{R^{(k)}x_i+t^{(k)}-y_j}^2$.
>
> **Solve** $\P^{(k)}\in\argmin_{\P\in\CouplingsD(\a,\b)}\sum_{i,j}\P_{ij}\C_{ij}^{(k)}$.
>
> **Compute** $M_{\P^{(k)}}=\sum_{i,j}\P^{(k)}_{ij}(y_j-\bar y)(x_i-\bar x)^\top$.
>
> **Factorize** $M_{\P^{(k)}}=U\Sigma V^\top$.
>
> **Set** $D=\Id$ for $\mathrm O(d)$; set $D=\diag(1,\ldots,1,\det(UV^\top))$ for $\mathrm{SO}(d)$.
>
> **Set** $R^{(k+1)}=UDV^\top$ and $t^{(k+1)}=\bar y-R^{(k+1)}\bar x$.
>
> **Set** $\eta_{k+1}=\norm{R^{(k+1)}-R^{(k)}}_{\mathrm F}+\norm{t^{(k+1)}-t^{(k)}}$.
>
> **Set** $k\leftarrow k+1$.

**Solve**
$\P^{(k)}\in\argmin_{\P\in\CouplingsD(\a,\b)}
\sum_{i,j}\P_{ij}\norm{R^{(k)}x_i+t^{(k)}-y_j}^2$.

**Return** $\P^{(k)},R^{(k)},t^{(k)}$.
:::


Figure {ref}`fig:wasserstein-procrustes-rigid-motion` follows this block-coordinate scheme through a deliberately large translation, showing how the transport correspondences and the rigid registration stabilize together.

(fig:wasserstein-procrustes-rigid-motion)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("wasserstein-procrustes-rigid-motion")
```

*Wasserstein-Procrustes alignment of two bunny silhouettes under a strong
translation and a moderate rotation. The target silhouette is shown in black.
The moving source silhouette is sampled by farthest-point sampling and colored
from red to blue at iterations \(1,2,3,5,10\). Each step solves an equal-weight
OT assignment, then updates the rigid motion by the closed-form Procrustes
formula; faint segments show selected correspondences of the current OT
assignment. The displayed motion is damped only to make the registration path
visible, while the underlying update is the block-coordinate method above.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Step through the alternating OT assignment and rigid
Procrustes updates. Changing the true deformation, damping, noise level and
number of points shows when the block-coordinate registration is stable and
when correspondences start to lock onto the wrong silhouette parts.
:::

<iframe class="ot4ml-live-frame" title="Wasserstein-Procrustes alignment controls" src="../live/generalized-procrustes.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>


(sec-linear-ot)=
## Vector Quantiles and Linear Optimal Transport

Linear OT starts from the multivariate analogue of quantile coordinates. The
one-dimensional quantile function represents a probability measure by the
monotone map sending a fixed reference law to it; in dimension $d>1$,
Brenier's theorem gives the corresponding construction after choosing an
absolutely continuous reference probability $\rho$, typically the uniform law
on a convex body or a standard Gaussian.

### Vector Quantiles

Assume that $\rho$ is absolutely continuous. For a target law $\al$ with
finite second moment, its vector quantile relative to $\rho$ is the Brenier
map

```{math}
T_\al=\nabla\phi_\al,
\qquad
(T_\al)_\sharp\rho=\al,
```

or equivalently the solution of

```{math}
\min_{T_\sharp\rho=\al}
\int\norm{x-T(x)}^2\d\rho(x).
```

This construction is canonical only after fixing $\rho$: changing the
reference law changes the coordinates used to represent $\al$. The same
transport-based quantile map has been used in several complementary
statistical directions. Conditional vector quantile regression replaces
scalar conditional quantiles by conditional Brenier maps
{cite:p}`carlier2016vectorquantile,carlier2016vector`; Monge--Kantorovich
ranks and depth use transports to a spherical reference
{cite:p}`chernozhukov2017monge`; center-outward distribution and quantile
functions build multivariate ranks and signs from the forward and inverse maps
{cite:p}`hallin2021distribution`; and scalable nonlinear vector quantile
regression learns such conditional maps with flexible models
{cite:p}`rosenberg2023fast`.

### Linearized Wasserstein Coordinates

Linear OT replaces a nonlinear transport distance by a Hilbert norm between
reference maps. It is useful when one reference measure is fixed and many
nearby distributions must be compared cheaply. Let $T_\alpha$ be the Brenier
map pushing $\rho$ to $\alpha$, understood as an element of
$L^2(\rho;\RR^d)$ and hence defined only $\rho$-almost everywhere. The linear
OT embedding is

```{math}
:label: eq-lot-embedding
\alpha\mapsto T_\alpha-\Id\in L^2(\rho;\RR^d),
\qquad
\operatorname{LOT}_\rho(\alpha,\beta)
=
\norm{T_\alpha-T_\beta}_{L^2(\rho)}.
```

If one of the two targets equals the reference, the linearized distance is
exact: for instance,
$\operatorname{LOT}_\rho(\rho,\alpha)
=\norm{T_\alpha-\Id}_{L^2(\rho)}
=\Wass_2(\rho,\alpha)$. For two arbitrary targets, the coupling
$(T_\alpha,T_\beta)_\sharp\rho$ is admissible but not generally optimal, so
$\operatorname{LOT}_\rho$ is a tangent-space approximation of the Wasserstein
geometry. Introduced for the analysis of image populations
{cite:p}`wang2013linear`, LOT has subsequently been used for continuous
image-pattern analysis {cite:p}`kolouri2016continuous`, provable
classification of transformed distributions {cite:p}`moosmuller2023linear`,
collider-event analysis {cite:p}`cai2020linearized`, and scalable Wasserstein
dimensionality reduction {cite:p}`cloninger2025linearized`. Uniqueness of the
Brenier maps also shows that $\operatorname{LOT}_\rho$ is a genuine distance
on the class of targets for which these maps are defined.

For a family $(\alpha_s)_s$ with weights $(\lambda_s)_s$, the linearized
barycenter is obtained by averaging maps,

```{math}
\bar T=\sum_s\lambda_s T_{\alpha_s},
\qquad
\bar\alpha_{\operatorname{LOT}}=\bar T_\sharp\rho.
```

This is exact in one dimension, where quantile functions linearize
$\Wass_2$, and it is especially useful when many barycenters with changing
weights must be evaluated quickly.

Figure {ref}`fig:dualnorms-linear-ot-embedding` makes the LOT embedding explicit: map averaging is exact in one-dimensional quantile coordinates, whereas in two dimensions its linearized barycenter can differ from the genuine McCann midpoint.

(fig:dualnorms-linear-ot-embedding)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("dualnorms-linear-ot-embedding")
```

*Linear OT coordinates. Fixing a reference measure $\rho$ turns each target
into a map $T_\alpha$ from $\rho$ to $\alpha$, or equivalently into the
displacement field $T_\alpha-\Id$. In one dimension this is exactly the
quantile parametrization of $\Wass_2$. In two dimensions, averaging the maps
gives the linearized barycenter, which is compared with the genuine McCann
midpoint.*
:::

The next control keeps the exact one-dimensional setting. The reference
density defines the coordinate system, the target maps are quantile maps from
that reference, and the barycenter is obtained by averaging those maps before
pushing the reference forward.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the reference and deformation controls to inspect how linear optimal transport embeds measures through maps from a fixed template.
:::

<iframe class="ot4ml-live-frame" title="Linear optimal transport controls" src="../live/generalized-linear-ot.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

The usefulness of these coordinates depends on controlling how much they distort the underlying Wasserstein geometry. The following global estimate is therefore important: LOT always dominates $\Wass_2$, while on compact supports with a uniform reference it remains Hölder-continuous with respect to perturbations measured by $\Wass_1$.

(prop-linear-ot-stability)=
:::{admonition} Proposition: Quantitative Stability of Linear OT
:class: important
Let $X,Y\subset\RR^d$ be compact convex sets, assume that $X$ has positive
Lebesgue measure, and let $\rho$ be normalized Lebesgue measure on $X$. There
is a constant $C=C(d,X,Y)$ such that, for all
$\alpha,\beta\in\mathcal P(Y)$,

```{math}
\Wass_2(\alpha,\beta)
\leq
\operatorname{LOT}_\rho(\alpha,\beta)
\qquad\text{and}\qquad
\operatorname{LOT}_\rho(\alpha,\beta)
\leq
C\Wass_1(\alpha,\beta)^{2/15}.
```
:::

:::{dropdown} Proof
The first inequality is immediate:
$(T_\alpha,T_\beta)_\sharp\rho$ is a feasible coupling between $\alpha$ and
$\beta$. The second inequality is the global quantitative stability theorem of
Mérigot, Delalande and Chazal {cite:p}`merigot2020stability`. Its proof controls
the difference of Kantorovich potentials by $\Wass_1$ and then uses convexity
and interpolation estimates to control their gradients in $L^2(\rho)$.

In one dimension, quantiles make the embedding isometric and the exponent
improves to one. In several dimensions the theorem is global but only Hölder;
it is not a global Lipschitz estimate in $\Wass_2$.
:::

(rem-three-hilbertian-measure-embeddings)=
:::{admonition} Remark: Three Hilbertian embeddings of measures
:class: ot4ml-remark

Several constructions in this text embed measures into Hilbert spaces, but they encode different geometries. Kernel mean embeddings send $\alpha$ to $\int k(x,\cdot)\d\alpha(x)$ in an RKHS and lead to MMD distances; see Section {ref}`sec-rkhs-mmd`. Quadratic sliced Wasserstein sends a measure to the collection of one-dimensional quantile functions of its projections, viewed in $L^2(\Sphere^{d-1}\times[0,1])$; see Section {ref}`sec-sliced-wasserstein`. Linear OT sends $\alpha$ to the displacement field $T_\alpha-\Id$ from a fixed reference $\rho$ in $L^2(\rho;\RR^d)$. The first construction is linear in the measure and depends on the kernel, the second is nonlinear but reduces OT to projected one-dimensional quantiles, and the third is a tangent approximation to the full Wasserstein geometry around a chosen reference.
:::

### Principal Components in Linear OT Coordinates

The preceding embedding turns probability measures into displacement fields
in a fixed Hilbert chart, so ordinary principal component analysis can be
applied to deformations rather than to densities. Given training measures
$(\alpha_i)_{i=1}^N$, set

```{math}
z_i \eqdef T_{\alpha_i}-\Id,
\qquad
\bar z \eqdef \frac1N\sum_{i=1}^N z_i .
```

The map $\Id+\bar z$ defines the linear OT mean
$(\Id+\bar z)_\sharp\rho$. The empirical covariance operator on
$L^2(\rho;\RR^d)$ is the finite-rank operator

```{math}
\mathcal C_{\operatorname{LOT}} h
\eqdef
\frac1N\sum_{i=1}^N
\dotp{z_i-\bar z}{h}_{L^2(\rho)}
(z_i-\bar z),
```

and its leading orthonormal eigenvectors $e_k$ define the principal linear OT modes.
Equivalently, one diagonalizes the $N\times N$ Gram matrix
$G_{ij}=\frac1N\dotp{z_i-\bar z}{z_j-\bar z}_{L^2(\rho)}$. If
$Gv^{(k)}=\lambda_k v^{(k)}$ with $\lambda_k>0$ and
$\norm{v^{(k)}}=1$, then

```{math}
e_k=\frac{1}{\sqrt{N\lambda_k}}\sum_{i=1}^N v_i^{(k)}(z_i-\bar z)
```

is the corresponding unit eigenvector of $\mathcal C_{\operatorname{LOT}}$.
The score of $\alpha_i$ along mode $e_k$ is

```{math}
a_{i,k} \eqdef \dotp{z_i-\bar z}{e_k}_{L^2(\rho)} .
```

A low-rank reconstruction, or a synthetic excursion with prescribed
coefficients $a=(a_1,\ldots,a_m)$, is then obtained by pushing the reference
through

```{math}
T_a(x) \eqdef x+\bar z(x)+\sum_{k=1}^m a_k e_k(x),
\qquad
\alpha_a \eqdef (T_a)_\sharp\rho .
```

For small excursions around the mean displacement, this gives a practical
tangent-space PCA for probability measures: it captures dominant modes of
deformation while avoiding repeated pairwise OT computations. For large
coefficients, $T_a$ may fail to be the Brenier map from $\rho$ to
$\alpha_a$, and may even leave the regular chart where $T_a$ is a gradient
of a convex function. Thus the curve $a\mapsto\alpha_a$ should be read as a
chart-dependent linearized visualization rather than as an intrinsic
Wasserstein geodesic. This LOT-PCA viewpoint was introduced for image
variability analysis in {cite:p}`wang2013linear` and developed in
transport-based signal analysis
{cite:p}`thorpe2017transportation,kolouri2017optimal`; it complements
intrinsic principal-geodesic or geodesic-PCA approaches, which optimize
directly in the curved Wasserstein space
{cite:p}`SeguyCuturi,bigot2017geodesic`.

Figure {ref}`fig:linear-ot-1d-pca` first shows the exact one-dimensional case.

(fig:linear-ot-1d-pca)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("linear-ot-1d-pca", width=760)
```

*One-dimensional linear OT PCA for well-separated synthetic two-Gaussian mixtures. The PCA is fit on a large training ensemble, while the dataset panel displays only representative densities and the quantile average in violet. Each mode panel shows densities obtained from \(Q_{\bar\alpha}+a e_k\), using slightly extrapolated coefficients \(a\) increasing from red to blue. Since the embedding is the exact quantile parametrization \(Q_\alpha\in L^2(0,1)\), this is PCA in exact Wasserstein coordinates.*
:::

Figure {ref}`fig:linear-ot-mnist-pca` then illustrates a regularized numerical approximation of the same construction on MNIST digit-zero images.

(fig:linear-ot-mnist-pca)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("linear-ot-mnist-pca", width=760)
```

*Principal components in linear OT coordinates for MNIST digit-zero histograms.
The reference is a Sinkhorn barycenter, and each mode panel displays negative,
zero, and positive excursions in a tangent displacement direction. The panels
use white for zero displayed mass and black for high displayed mass; this is only
a rendering convention. The modes capture rotations, aspect-ratio changes, and
stroke-thickness deformations in the chart around the barycenter.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the reference and deformation controls to inspect how
linear optimal transport turns measures into displacement coordinates.
:::

<iframe class="ot4ml-live-frame" title="Linear optimal transport controls" src="../live/generalized-linear-ot.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>


(sec-spectral-subspace-wasserstein)=
## Spectral and Robust Wasserstein Distances

Spectral OT changes the scalar quadratic cost by measuring the whole
displacement covariance through a matrix gauge. The same object admits a
robust projected formulation: instead of fixing one projection, one maximizes
over the polar set of the gauge. Subspace robust OT is the important
non-convex rank-constrained version of this idea {cite:p}`paty2019subspace`;
spectral gauges provide its convex minimax counterpart and connect to recent
spectral-gradient viewpoints such as Muon dynamics {cite:p}`peyre2026muon`.

(def-monotone-spectral-gauge)=
:::{admonition} Definition: Monotone Spectral Gauge
:class: important
A monotone spectral gauge on positive semidefinite matrices is a convex,
positively $1$-homogeneous map $\gamma:\mathbb S_+^d\to\RR_+$ such that
$\gamma(M)=0$ only for $M=0$,
$\gamma(QMQ^\top)=\gamma(M)$ for every orthogonal matrix $Q$, and

```{math}
0\preceq M\preceq N
\quad\Longrightarrow\quad
\gamma(M)\leq\gamma(N).
```

For $1\leq q\leq+\infty$, the Schatten gauge

```{math}
\gamma_q(M)\eqdef\norm{M}_{S_q}
=
\begin{cases}
\left(\sum_{i=1}^d\lambda_i(M)^q\right)^{1/q}, & 1\leq q<+\infty,\\
\lambda_{\max}(M), & q=+\infty,
\end{cases}
```

is a monotone spectral gauge. The cases $q=1$, $q=2$ and $q=+\infty$ are
respectively the trace, Frobenius and spectral gauges.
:::

The monotonicity condition means that increasing the displacement covariance
in Loewner order cannot decrease the transport penalty.

(def-spectral-wasserstein)=
:::{admonition} Definition: Spectral Wasserstein Distance
:class: important
Let $\gamma$ be a monotone spectral gauge. For a coupling
$\pi\in\Couplings(\alpha,\beta)$, define its displacement covariance

```{math}
M_\pi
\eqdef
\int (x-y)(x-y)^\top\d\pi(x,y).
```

The spectral Wasserstein distance associated with $\gamma$ is

```{math}
:label: eq-spectral-wasserstein
\Wass_\gamma(\alpha,\beta)^2
\eqdef
\inf_{\pi\in\Couplings(\alpha,\beta)}
\gamma(M_\pi).
```
:::

The special case $\gamma(M)=\tr(M)$ gives the usual quadratic Wasserstein
distance $\Wass_2$. The spectral gauge $\gamma(M)=\lambda_{\max}(M)$ instead
measures the worst transported variance direction. For $A\succeq0$, define
the quadratic projected transport cost

```{math}
:label: eq-quadratic-projected-cost
\Wass_{2,A}(\alpha,\beta)^2
\eqdef
\inf_{\pi\in\Couplings(\alpha,\beta)}
\int (x-y)^\top A(x-y)\d\pi(x,y)
=
\Wass_2((A^{1/2})_\sharp\alpha,(A^{1/2})_\sharp\beta)^2.
```

The equality remains valid when $A$ is singular. Projecting any coupling gives
one inequality; conversely, disintegrate $\alpha$ and $\beta$ over their
$A^{1/2}$-images and lift an optimal projected coupling by conditionally
coupling the fibers.

The polar set of the gauge is

```{math}
:label: eq-spectral-polar-set
\mathcal B_\gamma
\eqdef
\{A\succeq0:
\tr(AM)\leq\gamma(M)\ \text{for all } M\succeq0\},
```

so that, for a closed gauge,
$\gamma(M)=\sup_{A\in\mathcal B_\gamma}\tr(AM)$.

For the Schatten gauge $\gamma_q$, Schatten Hölder duality gives

```{math}
\mathcal B_{\gamma_q}
=
\{A\succeq0:\norm{A}_{S_{q^\ast}}\leq1\},
\qquad
\frac1q+\frac1{q^\ast}=1,
```

with the usual endpoint conventions. Thus the trace gauge has polar set
$\{A:0\preceq A\preceq I\}$, the Frobenius gauge is self-polar on
$\mathbb S_+^d$, and the spectral gauge has polar set
$\{A\succeq0:\tr(A)\leq1\}$.

(prop-spectral-wasserstein-robust)=
:::{admonition} Proposition: Robust Representation and Metric Equivalence
:class: important
Assume, for simplicity, that the measures are compactly supported and that
$\gamma$ is closed and finite on the positive semidefinite cone. Then

```{math}
\Wass_\gamma(\alpha,\beta)^2
=
\sup_{A\in\mathcal B_\gamma}
\Wass_{2,A}(\alpha,\beta)^2.
```

If there exist constants $0<a\leq b<+\infty$ such that
$aI\in\mathcal B_\gamma$ and
$\mathcal B_\gamma\subset\{A:0\preceq A\preceq bI\}$, equivalently

```{math}
a\tr(M)\leq\gamma(M)\leq b\tr(M)
\qquad (M\succeq0),
```

then

```{math}
\sqrt a\,\Wass_2(\alpha,\beta)
\leq
\Wass_\gamma(\alpha,\beta)
\leq
\sqrt b\,\Wass_2(\alpha,\beta).
```

The robust representation proves that $\Wass_\gamma$ is a distance: the
supremum of pseudodistances gives symmetry and the triangle inequality, while
the lower comparison with $\Wass_2$ gives definiteness. When $\gamma$ is the
restriction of a norm to the positive semidefinite cone, finite-dimensional
norm equivalence supplies such constants automatically.
:::

:::{dropdown} Proof
Using the polar representation of $\gamma$,

```{math}
\Wass_\gamma(\alpha,\beta)^2
=
\inf_{\pi\in\Couplings(\alpha,\beta)}
\sup_{A\in\mathcal B_\gamma}
\tr(AM_\pi).
```

The coupling set is convex and compact for weak convergence under compact
support. The polar set $\mathcal B_\gamma$ is convex and compact, and the map
$(\pi,A)\mapsto\tr(AM_\pi)$ is affine in each variable and continuous. Sion's
minimax theorem gives

```{math}
\inf_\pi\sup_{A\in\mathcal B_\gamma}\tr(AM_\pi)
=
\sup_{A\in\mathcal B_\gamma}\inf_\pi\tr(AM_\pi)
=
\sup_{A\in\mathcal B_\gamma}\Wass_{2,A}(\alpha,\beta)^2.
```

For fixed $A\succeq0$, $\Wass_{2,A}$ is the Wasserstein pseudodistance
associated with the seminorm $x\mapsto\norm{A^{1/2}x}$. A supremum of
pseudodistances is symmetric and satisfies the triangle inequality. If
$aI\in\mathcal B_\gamma$ and $A\preceq bI$ for all
$A\in\mathcal B_\gamma$, then

```{math}
a\Wass_2(\alpha,\beta)^2
\leq
\Wass_\gamma(\alpha,\beta)^2
\leq
b\Wass_2(\alpha,\beta)^2,
```

which proves definiteness and equivalence with $\Wass_2$.
:::

(def-subspace-robust-wasserstein)=
:::{admonition} Definition: Subspace Robust Wasserstein
:class: important
For $1\leq k\leq d$, the Paty--Cuturi subspace robust Wasserstein distance is

```{math}
\operatorname{SRW}_{2,k}(\alpha,\beta)
\eqdef
\sup_{U^\top U=I_k}
\Wass_2((U^\top)_\sharp\alpha,(U^\top)_\sharp\beta)
=
\sup_{P^2=P=P^\top,\ \tr(P)=k}
\Wass_{2,P}(\alpha,\beta).
```
:::

For the Ky Fan gauge

```{math}
\gamma_k(M)=\sum_{\ell=1}^k\lambda_\ell(M),
```

where the eigenvalues are sorted in decreasing order, the polar set is

```{math}
\mathcal B_{\gamma_k}
=
\{A:0\preceq A\preceq I,\ \tr(A)\leq k\}.
```

Thus $k=d$ gives $\gamma_d(M)=\tr(M)$ and recovers $\Wass_2$. The convex hull
of rank-$k$ projectors is

```{math}
\{A:0\preceq A\preceq I,\ \tr(A)=k\},
```

and, since $M\succeq0$, the associated support function is the same Ky Fan
gauge. Thus $\Wass_{\gamma_k}$ is the convexified spectral counterpart of
$\operatorname{SRW}_{2,k}$, while $\operatorname{SRW}_{2,k}$ keeps the
original non-convex rank constraint. More precisely,

```{math}
\operatorname{SRW}_{2,k}(\alpha,\beta)
\leq
\Wass_{\gamma_k}(\alpha,\beta)
\leq
\Wass_2(\alpha,\beta),
\qquad
\sqrt{\frac{k}{d}}\Wass_2(\alpha,\beta)
\leq
\Wass_{\gamma_k}(\alpha,\beta).
```

Indeed, $\mathcal B_{\gamma_k}$ contains the rank-$k$ projectors and
$(k/d)I$, and it is contained in $\{0\preceq A\preceq I\}$. For $k=1$,
$\gamma_1(M)=\lambda_{\max}(M)$ and
$\mathcal B_{\gamma_1}=\{A\succeq0:\tr(A)\leq1\}$.

Figure {ref}`fig:spectral-wasserstein-gauge` compares the trace and top-eigenvalue geometries at both levels: the selected transport plans and the displacement interpolations they induce.

(fig:spectral-wasserstein-gauge)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("spectral-wasserstein-gauge")
```

*Trace and spectral gauges for displacement covariances. The trace gauge
minimizes the average squared displacement and gives the usual quadratic
transport plan. The $\lambda_{\max}$ gauge penalizes the worst projected
displacement variance; the displayed plan is obtained by approximating the
robust formulation with finitely many directions.*
:::

The interactive demo turns the displacement covariance into a visible object. The
trace gauge sums both covariance eigenvalues, while the top-eigenvalue gauge
cares only about the worst transported direction.


:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the spectral weights and deformation controls to see how the gauge changes the geometry used to compare measures.
:::

<iframe class="ot4ml-live-frame" title="Spectral Wasserstein controls" src="../live/generalized-spectral.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

(sec-conditional-wasserstein-distances)=
## Conditional Wasserstein Distances

Many applications compare probability laws while keeping an external condition
fixed: a class label, a time variable, a spatial location, or, later in
Section {ref}`sec-conditional-wasserstein-resnets`, the depth of a residual network. The
resulting geometry is a fiberwise, or conditional, version of optimal transport.
It is based on disintegration of measures and is closely related to conditional
and constrained variants of transport used in weak transport and conditional
simulation
{cite:p}`Villani09,SantambrogioBook,backhoff2019weak,oliver2014minimization,BarboniPeyreVialard2024ConditionalResNets`.

The recent literature uses this same fiberwise constraint in several
complementary directions. Peszek and Poyato study heterogeneous gradient flows in
the topology of fibered optimal transport, emphasizing fixed-fiber transport and
PDEs with heterogeneities {cite:p}`PeszekPoyato2023FiberedOptimalTransport`.
Hosseini, Hsu and Taghvaei develop conditional optimal transport on function
spaces through triangular maps and Kantorovich relaxations, motivated by
amortized Bayesian inference {cite:p}`HosseiniHsuTaghvaei2023ConditionalFunctionSpaces`.
Chemseddine, Hagemann, Steidl and Wald introduce conditional Wasserstein
distances for Bayesian inverse problems and OT flow matching, with restricted
couplings that compare posterior laws condition by condition
{cite:p}`ChemseddineHagemannSteidlWald2024ConditionalWasserstein`. Kerrigan,
Migliorini and Smyth give a dynamic conditional OT formulation and use it to
build simulation-free conditional flows
{cite:p}`KerriganMiglioriniSmyth2024DynamicConditionalOT`. The definition below
isolates the common geometric core: transport is ordinary within each fiber and
forbidden across distinct conditions.

(def-conditional-ot)=
:::{admonition} Definition: Conditional Couplings and Conditional OT
:class: important
Let $(S,\lambda)$ be a standard Borel probability space of conditions and let
$(\Omega,\dist)$ be a Polish metric space. For $p\geq1$, denote by
$\Pp_{p,\lambda}(S\times\Omega)$ the set of probability measures on
$S\times\Omega$ whose first marginal is $\lambda$ and whose disintegration

```{math}
\alpha(\d s,\d x)=\alpha_s(\d x)\lambda(\d s)
```

satisfies
$\int_S\int_\Omega \dist(x,x_0)^p\,\d\alpha_s(x)\d\lambda(s)<+\infty$
for some, hence every, $x_0\in\Omega$.

For $\alpha,\beta\in\Pp_{p,\lambda}(S\times\Omega)$, a conditional coupling is
a measure

```{math}
\Pi(\d s,\d x,\d y)
=
\pi_s(\d x,\d y)\lambda(\d s)
```

such that $\pi_s\in\Couplings(\alpha_s,\beta_s)$ for $\lambda$-a.e. $s$. The
set of such couplings is denoted $\Couplings_\lambda(\alpha,\beta)$. Let
$(s,x,y)\mapsto c_s(x,y)$ be jointly Borel, nonnegative, and lower
semicontinuous in $(x,y)$ for every $s$. The conditional OT value is

```{math}
:label: eq-conditional-ot-general
\begin{aligned}
\MK_c^\lambda(\alpha,\beta)
&\eqdef
\inf_{\Pi\in\Couplings_\lambda(\alpha,\beta)}
\int_S\int_{\Omega\times\Omega} c_s(x,y)\d\pi_s(x,y)\d\lambda(s) \\
&=
\int_S
\inf_{\pi_s\in\Couplings(\alpha_s,\beta_s)}
\int_{\Omega\times\Omega} c_s(x,y)\d\pi_s(x,y)
\d\lambda(s).
\end{aligned}
```
:::

The equality in {eq}`eq-conditional-ot-general` is not a formal exchange of an
infimum and an integral. The stated hypotheses make the fiberwise value
measurable and permit measurable selection of optimal plans, or measurable
near-optimal selection when minimizers are unavailable. Equivalently,
conditional transport is
ordinary transport on $S\times\Omega$ with an infinite cost for moving mass
between different values of $s$.

(def-conditional-wasserstein-distance)=
:::{admonition} Definition: Conditional Wasserstein Distance
:class: important
For the fiber-independent cost
$c_s(x,y)=c_p(x,y)\eqdef\dist(x,y)^p$, define

```{math}
:label: eq-conditional-wasserstein-distance
\Wass_{p,\lambda}(\alpha,\beta)
\eqdef
\left(\MK_{c_p}^\lambda(\alpha,\beta)\right)^{1/p}
=
\left(
\int_S \Wass_p^p(\alpha_s,\beta_s)\d\lambda(s)
\right)^{1/p}.
```
:::

Thus $\MK_c^\lambda$ is the general conditional Kantorovich value, whereas
$\Wass_{p,\lambda}$ is its metric specialization to
the constant family $c_s=c_p=\dist^p$, after taking the $p$th root.
Equivalently,

```{math}
\Wass_{p,\lambda}(\alpha,\beta)^p
=
\MK_{c_p}^\lambda(\alpha,\beta);
```

the two definitions use exactly the same conditional coupling problem.

(prop-conditional-wasserstein-distance)=
:::{admonition} Proposition: Metric Property
:class: important
For $p\geq1$, $\Wass_{p,\lambda}$ is a distance on
$\Pp_{p,\lambda}(S\times\Omega)$. This metric space is Polish.
:::

:::{dropdown} Proof
Non-negativity and symmetry follow from the corresponding properties of
$\Wass_p$ on each fiber. If $\Wass_{p,\lambda}(\alpha,\beta)=0$, then
$\Wass_p(\alpha_s,\beta_s)=0$ for $\lambda$-a.e. $s$, hence
$\alpha_s=\beta_s$ for $\lambda$-a.e. $s$ and the disintegrated measures
$\alpha$ and $\beta$ coincide. For the triangle inequality, let
$\gamma\in\Pp_{p,\lambda}(S\times\Omega)$. Since
$\Wass_p(\alpha_s,\gamma_s)\leq\Wass_p(\alpha_s,\beta_s)+\Wass_p(\beta_s,\gamma_s)$
for a.e. $s$, Minkowski's inequality in $L^p(S,\lambda)$ gives

```{math}
\Wass_{p,\lambda}(\alpha,\gamma)
\leq
\Wass_{p,\lambda}(\alpha,\beta)+\Wass_{p,\lambda}(\beta,\gamma).
```

For completeness and separability, identify each measure with the
$\lambda$-a.e. equivalence class of the measurable map
$s\mapsto\alpha_s\in\mathcal P_p(\Omega)$. The conditional distance is exactly
the metric of $L^p(S,\lambda;\mathcal P_p(\Omega))$. Since
$(\mathcal P_p(\Omega),\Wass_p)$ is Polish, so is this metric-valued $L^p$
space.
:::

(prop-conditional-wasserstein-geodesics)=
:::{admonition} Proposition: Conditional Geodesics
:class: important
Assume that $(\Omega,\dist)$ is a geodesic Polish space and let
$\alpha_0,\alpha_1\in\Pp_{p,\lambda}(S\times\Omega)$. For $\lambda$-a.e. $s$,
choose a constant-speed $\Wass_p$ geodesic $t\mapsto\alpha_{t,s}$ between
$\alpha_{0,s}$ and $\alpha_{1,s}$, measurably in $s$, and set

```{math}
\alpha_t(\d s,\d x)=\alpha_{t,s}(\d x)\lambda(\d s).
```

Then $t\mapsto\alpha_t$ is a constant-speed geodesic for
$\Wass_{p,\lambda}$.
:::

:::{dropdown} Proof
For $0\leq r\leq t\leq1$, the fiberwise geodesic property gives

```{math}
\Wass_p(\alpha_{r,s},\alpha_{t,s})
=
(t-r)\Wass_p(\alpha_{0,s},\alpha_{1,s})
\quad\text{for }\lambda\text{-a.e. }s.
```

Integrating the $p$th power over $S$ gives

```{math}
\Wass_{p,\lambda}(\alpha_r,\alpha_t)
=
(t-r)\Wass_{p,\lambda}(\alpha_0,\alpha_1).
```

Hence the conditional curve has constant speed and realizes the distance
between its endpoints. In Euclidean space one may take, for each $s$, an
optimal plan $\pi_s\in\Couplings(\alpha_{0,s},\alpha_{1,s})$ and set
$\alpha_{t,s}=((1-t)\mathrm p_1+t\mathrm p_2)_\sharp\pi_s$, where
$\mathrm p_1,\mathrm p_2$ are the two coordinate projections. On a general
geodesic space, the same construction uses a measurable family of optimal
dynamical plans; when geodesics are non-unique, different measurable selections
can produce different conditional geodesics.
:::
