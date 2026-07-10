---
title: "Generative Models via Transportation"
kernelspec:
  name: python3
  display_name: Python 3
  language: python
---
(sec-generative-models-transportation)=

The preceding gradient-flow calculus is variational. Modern machine-learning
models often use the same transportation language more broadly: one may
prescribe an interpolation and regress its velocity, fit a one-step generator
to a descent field, or view network depth as a continuous transport of token
measures. The examples below separate what is genuinely a Wasserstein gradient
flow from what is a transportation dynamics with a useful geometric
interpretation.

:::{admonition} Guiding Comparison
:class: tip
Flow matching prescribes paths and learns their Eulerian velocity. Diffusion
models choose stochastic or noising paths whose reverse probability flow can be
sampled. One-step and drifting methods try to store a whole measure evolution
inside a single generator update. Transformer depth can also be read as a
transport equation, but usually not as a Wasserstein gradient flow of a fixed
energy.
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

(sec-generative-flow-matching)=
## Generative Models via Flow Matching

Flow matching constructs a generative map by learning the velocity field of an interpolation. The key computational insight is that a constrained continuity-equation problem can be trained by an unconstrained regression.

Generative models aim to build a transportation map $T$ between a reference distribution $\alpha$ (typically an isotropic Gaussian) and the target data distribution $\beta$. Since such reference measures are non-atomic, a measurable map with $T_\sharp\alpha=\beta$ exists on standard Borel spaces, for instance by identifying both probability spaces with the unit interval and using a quantile-type rearrangement. This abstract existence statement is much weaker than having an explicit and numerically stable construction of $T$. Optimal transport is one approach to achieving this, but it is computationally expensive and raises questions about how to estimate it from samples. A different route is to prescribe an interpolation between noise and data, learn its velocity, and obtain $T$ by integrating a time-dependent vector field $v_t$. This point of view sits at the meeting point of two literatures, surveyed from a transport perspective in {cite:p}`Peyre2026OptimalDiffusionTransports`. The diffusion branch builds on score matching {cite:p}`Hyvarinen2005ScoreMatching`, denoising score matching {cite:p}`Vincent2011DenoisingScoreMatching`, nonequilibrium noising chains {cite:p}`SohlDickstein2015DeepUnsupervised`, denoising diffusion probabilistic models {cite:p}`Ho2020DDPM`, score-based generative modeling {cite:p}`Song2019ScoreMatchingGenerative`, and the continuous-time score-SDE/probability-flow formulation {cite:p}`Song2021ScoreSDE`. The deterministic regression branch was introduced, essentially in parallel, under three closely related names: flow matching {cite:p}`Lipman2022FlowMatching`, rectified flow {cite:p}`Liu2023RectifiedFlow`, and stochastic interpolants {cite:p}`Albergo2025StochasticInterpolants`. In all three cases, the computational object is a velocity field whose regression loss avoids simulating the learned ODE during training. This vector field $v_t$ is obtained by constructing an interpolation $\alpha_t$ and then finding $v_t$ using the least-squares formula of the dynamic chapter. As we will explain, for a specific class of interpolation (obtained by a parametric push-forward), this $v_t$ can be obtained by avoiding explicitly inverting a Laplacian and instead computing a simple conditional expectation. This conditional expectation can itself be estimated by solving another least-squares problem, but this time unconstrained, making the estimation feasible from finite samples of $\alpha$ and $\beta$.

### Stochastic interpolant.

The word "stochastic" can hide two different levels of randomness. We first use the simpler one: after drawing a latent variable $U\sim\pi$, the path $t\mapsto P_t(U)$ is deterministic and differentiable. The randomness only comes from the initial draw of $U$; after taking the push-forward law, $\alpha_t=(P_t)_\sharp\pi$ is a deterministic curve of measures and obeys an ordinary continuity equation. This is the setting behind the stochastic-interpolant construction recalled in Remark {ref}`rem-static-noise-stochastic-interpolants`, and behind the flow-matching and rectified-flow regressions below. Genuine temporal noise, where the path itself has Brownian fluctuations, is different and is discussed in Remark {ref}`rem-noisy-stochastic-interpolants`.

We assume first that $\alpha_t$ is obtained by pushing a latent distribution $\pi \in \Pp(\RR^{d'})$ through a time-dependent map $P_t : \RR^{d'} \to \RR^d$; the latent dimension $d'$ may be larger than the data dimension $d$:

```{math}
:label: eq-interp-coupling
\forall t \in [0,1], \quad \alpha_t := (P_t)_\sharp \pi.
```

The basic two-endpoint construction already covers most flow-matching paths used in practice.

:::{admonition} Example: Linear two-endpoint deterministic interpolants
:class: ot4ml-example

Set $d'=2d$, write $(x,y)\in\RR^d\times\RR^d$, and choose $P_0(x,y)=x$ and $P_1(x,y)=y$. If $\pi$ has marginals $(\alpha_0,\alpha_1)$, then $\alpha_t=(P_t)_\sharp\pi$ interpolates between the two endpoint laws. The simplest choices are the independent, or trivial, coupling $\pi=\alpha_0\otimes\alpha_1$ and the straight path

```{math}
P_t(x,y)=(1-t)x+ty.
```

With this linear path and an arbitrary coupling $\pi$, the regression below is the common core of flow matching and rectified flow: Lipman et al. emphasize conditional probability paths and simulation-free training of continuous normalizing flows, while rectified flow emphasizes straight couplings, reflow, and the possibility of reducing transport costs and discretization error {cite:p}`Lipman2022FlowMatching,Liu2023RectifiedFlow`.

More complex constructions are possible when sampling from $\pi$ remains simple. Static auxiliary randomness is still handled by enlarging the latent variable, while Brownian noise leads to the diffusion correction described below; this is the broader stochastic-interpolant viewpoint connecting deterministic flows, probability-flow ODEs and diffusion SDEs {cite:p}`Albergo2025StochasticInterpolants`.
:::


If $\pi = \alpha \otimes \beta$ and $\alpha = \frac{1}{n} \sum_i \delta_{x_i}$, $\beta = \frac{1}{m} \sum_j \delta_{y_j}$, then $\alpha_t$ consists of $n \times m$ Dirac masses $$\alpha_t = \frac{1}{nm} \sum_{i,j} \delta_{P_t(x_i,y_j)}.$$ If $\pi = (\Id, T)_\sharp \alpha$ is a Brenier-type coupling, then $\alpha_t = ((1-t)\Id + tT)_\sharp \alpha$ is the so-called McCann OT interpolation.

(fig:generative-flow-matching-interpolants)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("generative-flow-matching-interpolants", width=760)
```

Flow matching interpolants between the same empirical source and target measures. A product-style random pairing produces crossing paths, an OT pairing gives direct displacement rays, and a curved bridge changes the path geometry while keeping the same endpoints. Gray arrows mark representative midpoint velocities $\partial_tP_t$.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the interpolation and noise controls to compare flow-matching paths between source noise and target structure.
:::


<iframe class="ot4ml-live-frame" title="Flow-matching interpolant controls" src="../live/generative-flow.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>


### Flow matching formula.

This interpolation is not directly useful for sampling from $\beta$, but it can be used to define a flow field $v_t$ so that the continuity equation, in Eulerian form, holds. This flow field is computed by solving an unconstrained least-squares problem, or equivalently, it is a conditional expectation.

(prop-flow-matching-vector-field)=
:::{admonition} Proposition: Flow matching vector field
:class: ot4ml-proposition

For each fixed $t$, assume $\partial_tP_t\in L^2(\pi;\RR^d)$. Consider the flow-matching problem over measurable fields $v_t:\RR^d\to\RR^d$

```{math}
:label: eq:flow-matching

\min_{v_t} \int_{\RR^{d'}} \norm{v_t(P_t(u)) - [\partial_t P_t](u)}^2 \, \d\pi(u).
```

Its minimizer is characterized $\alpha_t$-almost everywhere by the conditional expectation

```{math}
:label: eq:flow-match-conditional

v_t(z) = \EE_{u \sim \pi} \big( [\partial_t P_t](u) \, \big| \, z = P_t(u) \big).
```

Then the pair $(\alpha_t,v_t)$ satisfies the continuity equation {eq}`eq-eulerian-advection`.
:::

:::{dropdown} Proof
We first recall the two equivalent ways of writing the interpolated measure. Formally, one may write

```{math}
\alpha_t(z)=\int_{\RR^{d'}}\delta(z-P_t(u))\,\d\pi(u),
```

while the rigorous meaning is that, for every smooth test function $\varphi$,

```{math}
:label: eq:flow-matching-pushforward-test

\int_{\RR^d}\varphi(z)\,\d\alpha_t(z)
=
\int_{\RR^{d'}}\varphi(P_t(u))\,\d\pi(u).
```

The minimizer in {eq}`eq:flow-matching` is the orthogonal projection in $L^2(\pi;\RR^d)$ of the latent velocity $\partial_tP_t(u)$ onto the closed subspace of functions that depend on $u$ only through $P_t(u)$. This projection is the conditional expectation {eq}`eq:flow-match-conditional`. Formally, this can be read as

```{math}
v_t(z)=\frac{1}{\alpha_t(z)}
\int_{\RR^{d'}}\delta(z-P_t(u))[\partial_tP_t](u)\,\d\pi(u),
```

and rigorously it means that, for every smooth test vector field $m$,

```{math}
:label: eq:v_t

\int \dotp{m(z)}{v_t(z)} \, \d\alpha_t(z)
=
\int \dotp{m(P_t(u))}{[\partial_t P_t](u)} \, \d\pi(u).
```

We now prove that this field transports the curve $(\alpha_t)_t$. The weak form of
$\partial_t\alpha_t+\diverg(\alpha_t v_t)=0$ is that, for every smooth scalar test function $\varphi$,

```{math}
:label: eq:flow-matching-weak-target

\frac{\d}{\d t}\int\varphi(z)\,\d\alpha_t(z)
-
\int\dotp{v_t(z)}{\nabla\varphi(z)}\,\d\alpha_t(z)
=0.
```

Using {eq}`eq:flow-matching-pushforward-test` and differentiating under the integral sign gives

```{math}
:label: eq:flow-matching-test-derivative

\frac{\d}{\d t}\int \varphi(z)\d\alpha_t(z)
=
\int \dotp{\nabla\varphi(P_t(u))}{[\partial_t P_t](u)}\d\pi(u).
```

On the other hand, applying {eq}`eq:v_t` with $m=\nabla\varphi$ gives

```{math}
:label: eq:flow-matching-velocity-test

\int\dotp{v_t(z)}{\nabla\varphi(z)}\,\d\alpha_t(z)
=
\int \dotp{\nabla\varphi(P_t(u))}{[\partial_t P_t](u)}\d\pi(u).
```

Comparing {eq}`eq:flow-matching-test-derivative` and {eq}`eq:flow-matching-velocity-test` yields {eq}`eq:flow-matching-weak-target`, which is the desired continuity equation.
:::


The conditional expectation in {eq}`eq:flow-match-conditional` has a simple measure-theoretic meaning. Let $\alpha_t=(P_t)_\sharp\pi$ and define the vector-valued flux measure $\omega_t$ on $\RR^d$ by $$\int_{\RR^d}\dotp{\psi(z)}{\d\omega_t(z)}
    \eqdef
    \int_{\RR^{d'}}\dotp{\psi(P_t(u))}{[\partial_tP_t](u)}\d\pi(u)$$ for every bounded continuous vector field $\psi$. Since $\alpha_t(A)=0$ implies $\pi(P_t^{-1}(A))=0$, one has $\omega_t\ll\alpha_t$. The Radon--Nikodym decomposition of $\omega_t$ with respect to $\alpha_t$ is therefore $$\d\omega_t(z)=v_t(z)\d\alpha_t(z),
    \qquad
    v_t=\frac{\d\omega_t}{\d\alpha_t}.$$ In the language of Lebesgue decomposition, $\omega_t$ has only an absolutely continuous part with respect to $\alpha_t$ and no singular part; the conditional expectation is precisely its density. This agrees with the flux notation used in the dynamic formulation. Equivalently, disintegrating $\pi$ with respect to the map $P_t$ gives $\pi(\d u)=\pi_{t,z}(\d u)\alpha_t(\d z)$, where $\pi_{t,z}$ is supported on the fiber $\{u\,:\,P_t(u)=z\}$, and $$v_t(z)=\int_{\{P_t(u)=z\}}[\partial_tP_t](u)\d\pi_{t,z}(u).$$ Thus the solution of {eq}`eq:flow-matching` is the conditional expectation of the velocities $\partial_t P_t$: intuitively, $v_t(z)$ is the average velocity of all trajectories passing through $z$. Numerically, $(x,t) \to v_t(x)$ can be parameterized by a neural network (e.g., a U-Net for vision tasks) and estimated using stochastic gradient descent on the objective in {eq}`eq:flow-matching`. For the exact field $v_t$, integrating the ODE $\dot{x}=v_t(x)$ defines a transport map $T_t$. If $v_t$ is regular enough, or more generally if the continuity equation has a unique solution for this velocity, then $(T_t)_\sharp\alpha_0=\alpha_t$. Thus the same interpolation as {eq}`eq-interp-coupling` is represented by a deterministic flow rather than by the original coupling. The sampling procedure consists in first drawing $X_0 \sim \alpha$, and then integrating the ODE $\dot{X}_t = v_t(X_t)$ starting with $X_{t=0} = X_0$. In the ideal exact-field limit, the resulting $X_{t=1}$ is distributed according to $\alpha_1 = \beta$.

(alg-flow-matching-regression)=
:::{admonition} Algorithm: Flow matching regression and sampling
:class: ot4ml-algorithm

**Input:** Interpolant $P_t(u)$, training source $u\sim\pi$, parametrized field $v_\theta(t,z)$, training steps $N$.

**Output:** Learned sampler $X_0\mapsto X_1$.

**Training:**

**For** $q=1,\ldots,N$ **do**:

> **Draw** $t_q\sim\mathrm{Unif}(0,1)$ and $u_q\sim\pi$.
>
> **Set** $z_q=P_{t_q}(u_q)$ and $w_q=\partial_tP_t(u_q)|_{t=t_q}$.
>
> **Update** $\theta$ by one stochastic-gradient step on $\norm{v_\theta(t_q,z_q)-w_q}^2$.
>

**Sampling:**

**Draw** $X_0\sim\alpha_0$.

**Integrate**
$\dot X_t=v_\theta(t,X_t), \qquad t\in[0,1]$.

**Return** $X_1$.
:::

(rem-static-noise-stochastic-interpolants)=
:::{admonition} Remark: Static-noise stochastic interpolants
:class: ot4ml-remark

In the terminology of Albergo--Boffi--Vanden-Eijnden {cite:p}`Albergo2025StochasticInterpolants`, a stochastic interpolant is not first defined as an SDE. It is an explicit random bridge

```{math}
X_t = I_t(X_0,X_1,Z),
    \qquad X_0\sim\alpha_0,\quad X_1\sim\alpha_1,
```

where $Z$ is an auxiliary random variable, usually Gaussian and independent of the endpoints, and where

```{math}
I_0(x_0,x_1,z)=x_0,
    \qquad
    I_1(x_0,x_1,z)=x_1.
```

A typical spatially linear example is

```{math}
X_t=a(t)X_0+b(t)X_1+\gamma(t)Z,
    \qquad
    \gamma(0)=\gamma(1)=0.
```

The noise $Z$ is static: conditionally on $(X_0,X_1,Z)$, the path $t\mapsto X_t$ is differentiable. Thus this construction is exactly the previous push-forward framework with $u=(X_0,X_1,Z)$, $\pi=\operatorname{Law}(X_0,X_1,Z)$, and $P_t=I_t$. Its Eulerian velocity is therefore

```{math}
v_t(x)=\EE\bigl[\partial_t I_t(X_0,X_1,Z)\mid X_t=x\bigr],
```

and the interpolant density satisfies the continuity equation. The associated SDEs in the stochastic-interpolant framework are alternative sampling dynamics having the same one-time marginals; they are not the definition of the interpolant itself.
:::

(rem-noisy-stochastic-interpolants)=
:::{admonition} Remark: Brownian realizations of interpolant marginals
:class: ot4ml-remark

One can also represent an interpolating marginal curve by Brownian-in-time dynamics. This is a different construction from the static-noise bridge of Remark {ref}`rem-static-noise-stochastic-interpolants`. Let $Z_t$ solve the It\^o equation

```{math}
\d Z_t = r_t(U,Z_t)\d t + \Sigma_t(U,Z_t)\d B_t,
    \qquad \alpha_t=\operatorname{Law}(Z_t),
```

where $U\sim\pi$ is static and $B_t$ is Brownian motion. Define the Eulerian drift and diffusion matrix by conditioning on the observed state,

```{math}
v_t(z)=\EE\bigl[r_t(U,Z_t)\mid Z_t=z\bigr],
    \qquad
    D_t(z)=\EE\bigl[\Sigma_t(U,Z_t)\Sigma_t(U,Z_t)^\top\mid Z_t=z\bigr].
```

Then, for smooth test functions $\varphi$,

```{math}
\frac{\d}{\d t}\int \varphi\d\alpha_t
    = \int \dotp{\nabla\varphi}{v_t}\d\alpha_t
      + \frac12\int \Tr\bigl(D_t\nabla^2\varphi\bigr)\d\alpha_t,
```

or, in distributional form,

```{math}
:label: eq:noisy-interpolant-fokker-planck

\partial_t\alpha_t + \diverg(\alpha_t v_t)
    = \frac12\sum_{i,j}\partial_{ij}^2\bigl((D_t)_{ij}\alpha_t\bigr).
```

Thus the natural noisy analogue of {eq}`eq:flow-matching` regresses the instantaneous drift,

```{math}
\min_w \EE\bigl[\norm{w_t(Z_t)-r_t(U,Z_t)}^2\bigr],
```

and learns the drift term of a Fokker--Planck equation, not a pure continuity equation unless the diffusion tensor vanishes. When $\alpha_t=\rho_t\d x$ has a smooth positive density, the same marginal curve can be represented, at least formally, by a probability-flow ODE

```{math}
\partial_t\rho_t+\diverg(\rho_t\bar v_t)=0,
    \qquad
    \bar v_t
    = v_t - \frac{1}{2\rho_t}\diverg(\rho_t D_t),
```

where the divergence of the matrix field $\rho_tD_t$ is taken row-wise. In the scalar spatially homogeneous case $D_t=\sigma_t^2\Id$, this reduces to

```{math}
\bar v_t = v_t - \frac{\sigma_t^2}{2}\nabla\log\rho_t,
```

which is the familiar score correction relating diffusion SDEs to probability-flow ODEs.
:::


### Connection with diffusion models.

In the special case where $P_t(x,y)=(1-t)x+ty$ is a linear interpolation and $\pi = \alpha \otimes \beta$, the curve $\alpha_t$ is a convolution of rescaled versions of $\alpha_0$ and $\alpha_1$. The flow-matching problem {eq}`eq:flow-matching` becomes $$\min_{(v_t)_t} \int_{\RR^{d} \times \RR^d} \norm{v_t( (1-t)x+t y ) - (y-x) }^2 \, \d\alpha_0(x) \d\alpha_1(y).$$ When one endpoint is an isotropic Gaussian, this construction is closely related to the probability-flow formulation of diffusion models, up to the usual change of time parametrization {cite:p}`Song2021ScoreSDE`. This is why flow matching can be viewed both as a deterministic alternative to diffusion training and as a common language for diffusion paths, OT-inspired paths, and rectified paths {cite:p}`Lipman2022FlowMatching,Liu2023RectifiedFlow,Albergo2025StochasticInterpolants`. The next two propositions are written in the noising direction, from a data law $\alpha$ to a Gaussian; reversing time gives the corresponding sampling flow. They also give an explicit closed form for $v_t$ and show that it is a gradient field. In this setting, $v_t$ is also the solution of the constrained least-squares problem from the dynamic chapter. The regression {eq}`eq:flow-matching` is computationally simpler because the continuity equation has already been enforced by the chosen interpolant. To prove this, we rely on Tweedie's formula {cite:p}`Efron2011Tweedie`, which expresses the optimal Gaussian denoiser through the score, i.e. the gradient of the log-density.

(prop:Tweedie)=
:::{admonition} Proposition: Tweedie identity
:class: ot4ml-proposition

Let $W$ be a random vector in $\RR^{d}$ with law $\beta\in\Pp_1(\RR^d)$.
For $\sigma>0$, observe

```{math}
Z \;=\; W + \sigma\,\varepsilon,
\quad\text{where } \varepsilon \sim \Gaussian(0,\Id)
\text{ is independent of } W.
```

Denote by $\rho_\sigma$ the smooth positive density of

```{math}
\beta_\sigma \;=\; \beta * \Gaussian\bigl(0,\sigma^{2}\Id\bigr),
```

which is the law of $Z$.
Then the conditional mean admits the following everywhere-defined version:

```{math}
\EE\bigl[\,W \mid Z=z\bigr]
      \;=\; z \;+\;\sigma^{2}\,\nabla \log \rho_\sigma(z)
\qquad\text{for all } z \in \RR^{d}.
```
:::

:::{dropdown} Proof
Let $\varphi_\sigma$ be the $\Gaussian(0,\sigma^{2}\Id)$ density. Bayes' rule gives

```{math}
\EE[W\mid Z=z]
= \frac{1}{\rho_\sigma(z)}
      \int_{\RR^{d}} w\,
             \varphi_\sigma(z-w)\,\d\beta(w).
```

Differentiating the Gaussian convolution under the integral sign and using
$
\nabla_z\varphi_\sigma(z-w)
     = -\sigma^{-2}(z-w)\,\varphi_\sigma(z-w)
$
yields

```{math}
\nabla\rho_\sigma(z)
= \int \nabla_z\varphi_\sigma(z-w)\,\d\beta(w)
= -\sigma^{-2}\Bigl(z-\EE[W\mid Z=z]\Bigr)\,\rho_\sigma(z).
```

Rearranging finishes the proof.
:::


(prop:flow)=
:::{admonition} Proposition: Gaussian-endpoint flow-matching field
:class: ot4ml-proposition

Let $X\sim\alpha$ and $Y\sim\Gaussian(0,\Id)$ be independent.
For $t\in(0,1)$ set

```{math}
Z_t \;=\; (1-t)\,X + t\,Y,
\qquad
\alpha_t =\operatorname{Law}(Z_t)=\rho_t\,\d x.
```

The regression minimizer $v^\star:\RR^d\times(0,1)\to\RR^d$ of

```{math}
\min_{v}\;\int_{0}^{1}\!
         \iint_{\RR^{d}\times\RR^{d}}
              \bigl|y-x-v\bigl((1-t)x+t y,t\bigr)\bigr|^{2}\,
              \d\alpha(x)\,\d\Gaussian(y)\,\d t
```

is

```{math}
v^\star(x,t)
= -\frac{1}{1-t}\,x \;-\; \frac{t}{1-t}\,\nabla\log\rho_t(x)
\qquad (x\in\RR^{d},\;t\in(0,1)).
```

In particular, for each $t\in(0,1)$ this field is a gradient field,

```{math}
v^\star(\cdot,t)=-\nabla
\left(
\frac{\norm{\cdot}^2}{2(1-t)}
+\frac{t}{1-t}\log\rho_t
\right).
```
:::

:::{dropdown} Proof
Fix $t\in(0,1)$ and write $W=(1-t)X$, $\sigma=t$, so that
$Z_t = W + \sigma\,Y$ matches the setting of Proposition {ref}`prop:Tweedie`.

Conditional expectations satisfy

$
v^\star(z,t)
= \EE[Y-X\mid Z_t=z]
= \frac{1}{t}\,\EE[Z_t-W\mid Z_t=z]
  -\,\frac{1}{1-t}\,\EE[W\mid Z_t=z].
$
Applying Proposition {ref}`prop:Tweedie` to $\EE[W\mid Z_t=z]$ and

noting $\EE[Y\mid Z_t=z]
      = -\,t\,\nabla\log\rho_t(z)$
gives the claimed formula.
:::


(fig:generative-diffusion-1d-forward-backward)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("generative-diffusion-1d-forward-backward", width=760)
```

One-dimensional diffusion bridge for a Gaussian-mixture data law. The forward path $Z_t=(1-t)X+tY$ smooths the red data density toward a blue Gaussian endpoint. Reversing the probability-flow ODE transports a denser set of blue noise samples back toward the data modes, making the splitting of trajectories across mixture components visible.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the noising time and schedule controls to see the one-dimensional forward and reverse diffusion bridge.
:::


<iframe class="ot4ml-live-frame" title="One-dimensional diffusion bridge controls" src="../live/generative-diffusion-1d.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>


The same probability-flow intuition is visible in two dimensions. For a discrete data law, or more generally for a Gaussian mixture, the noising density is a Gaussian mixture whose score can be evaluated explicitly. This makes it possible to draw backward trajectories without training a neural network. In the plots below, the Gaussian endpoint has covariance $\sigma^2\Id$ to keep the geometry visible at the scale of the three atoms. For a scalar noising schedule $Z_t=a_tX+b_tY$, the intermediate law has component centers $a_t c_j$ and covariance $(b_t\sigma)^2\Id$. For the linear bridge, $p_t(z)=\sum_j w_j\Gaussian((1-t)c_j,(t\sigma)^2\Id)$, with $s_t=\nabla\log p_t$, and the scaled Gaussian-endpoint field gives $v_t(z)=-(z+t\sigma^2s_t(z))/(1-t)$.

(fig:generative-diffusion-2d-forward-backward)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("generative-diffusion-2d-forward-backward", width=760)
```

Two-dimensional noising paths from three Dirac masses to a single Gaussian. The linear interpolation $Z_t=(1-t)X+tY$ moves component centers linearly toward the origin and grows covariance like $(t\sigma)^2\Id$. The variance-preserving Ornstein--Uhlenbeck bridge has the same endpoints but a different speed of contraction and noising.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the schedule and time controls to watch two-dimensional samples blur forward and concentrate backward.
:::


<iframe class="ot4ml-live-frame" title="Two-dimensional noising bridge controls" src="../live/generative-diffusion-2d.html" loading="lazy" style="width:100%;height:540px;border:0;display:block;"></iframe>


### When is the induced map optimal?

Integrating the learned velocity gives a deterministic map from $\alpha_0$ to $\alpha_1$, but this map is not automatically the Brenier optimal map. It is optimal only in special cases where the accumulated flow remains the gradient of a convex potential. The Gaussian product-coupling case already shows the precise obstruction: the interpolated covariances are simple, the velocity is affine, but the terminal map can contain a hidden rotational part. This phenomenon, and its extensions to rectified flows and mixtures, is analyzed in depth in {cite:p}`HertrichChambolleDelon2025RectifiedOT`.

(prop-gaussian-flow-matching-optimality)=
:::{admonition} Proposition: Gaussian flow matching and optimality
:class: ot4ml-proposition

Let $\Sigma_0,\Sigma_1\succ0$ and let $X_0\sim\Gaussian(0,\Sigma_0)$ and $X_1\sim\Gaussian(0,\Sigma_1)$ be independent. Consider the linear flow-matching interpolation

```{math}
Z_t=(1-t)X_0+tX_1,
\qquad
\alpha_t=\operatorname{Law}(Z_t)=\Gaussian(0,\Sigma_t),
```

where

```{math}
:label: eq-gaussian-product-fm-covariance

\Sigma_t=(1-t)^2\Sigma_0+t^2\Sigma_1.
```

Then the exact flow-matching velocity is affine, $v_t(z)=A_tz$, with

```{math}
:label: eq-gaussian-product-fm-velocity

A_t=\bigl(t\Sigma_1-(1-t)\Sigma_0\bigr)\Sigma_t^{-1}.
```

The induced flow map $T_t^{\rm FM}$ from $\alpha_0$ to $\alpha_t$ is

```{math}
:label: eq-gaussian-product-fm-map

T_t^{\rm FM}
=
\Sigma_0^{1/2}
\Bigl((1-t)^2\Id+t^2\Sigma_0^{-1/2}\Sigma_1\Sigma_0^{-1/2}\Bigr)^{1/2}
\Sigma_0^{-1/2}.
```

In particular,

```{math}
:label: eq-gaussian-product-fm-terminal-map

T_1^{\rm FM}
=
\Sigma_0^{1/2}
\bigl(\Sigma_0^{-1/2}\Sigma_1\Sigma_0^{-1/2}\bigr)^{1/2}
\Sigma_0^{-1/2}.
```

This terminal map coincides with the quadratic optimal transport map

```{math}
:label: eq-gaussian-brenier-map-comparison

T^{\rm OT}
=
\Sigma_0^{-1/2}
\bigl(\Sigma_0^{1/2}\Sigma_1\Sigma_0^{1/2}\bigr)^{1/2}
\Sigma_0^{-1/2}
```

if and only if $\Sigma_0\Sigma_1=\Sigma_1\Sigma_0$.
:::

:::{dropdown} Proof
The conditional-expectation formula gives

```{math}
v_t(z)=\EE[X_1-X_0\mid Z_t=z].
```

Since all variables are jointly Gaussian, this conditional expectation is linear and

```{math}
v_t(z)
=
\operatorname{Cov}(X_1-X_0,Z_t)\operatorname{Cov}(Z_t)^{-1}z
=
\bigl(t\Sigma_1-(1-t)\Sigma_0\bigr)\Sigma_t^{-1}z,
```

which proves {eq}`eq-gaussian-product-fm-velocity`. To solve the characteristic equation, whiten the source by setting

```{math}
C=\Sigma_0^{-1/2}\Sigma_1\Sigma_0^{-1/2},
\qquad
\widetilde Z_t=\Sigma_0^{-1/2}Z_t.
```

In these coordinates the source covariance is $\Id$ and

```{math}
\widetilde\Sigma_t=(1-t)^2\Id+t^2C.
```

Because $\Id$ and $C$ commute, the affine flow map in whitened coordinates is simply $\widetilde T_t=\widetilde\Sigma_t^{1/2}$. Indeed,

```{math}
\frac{\d}{\d t}\widetilde\Sigma_t^{1/2}
=
\bigl(tC-(1-t)\Id\bigr)\widetilde\Sigma_t^{-1/2},
```

which is exactly the equation $\dot{\widetilde T}_t=\widetilde A_t\widetilde T_t$ with $\widetilde T_0=\Id$. Returning to the original coordinates gives {eq}`eq-gaussian-product-fm-map`, and $t=1$ gives {eq}`eq-gaussian-product-fm-terminal-map`.

Both $T_1^{\rm FM}$ and $T^{\rm OT}$ push $\Gaussian(0,\Sigma_0)$ to $\Gaussian(0,\Sigma_1)$. The Brenier map between nondegenerate Gaussians is the unique symmetric positive definite linear map with this property. Hence $T_1^{\rm FM}=T^{\rm OT}$ if and only if $T_1^{\rm FM}$ is symmetric positive definite. The map $T_1^{\rm FM}$ is similar to $C^{1/2}$, so if it is symmetric then it is automatically positive definite. It remains to characterize symmetry. Since $C^{1/2}$ is symmetric positive definite,

```{math}
(T_1^{\rm FM})^\top
=
\Sigma_0^{-1/2}C^{1/2}\Sigma_0^{1/2}.
```

Thus symmetry of $T_1^{\rm FM}$ is equivalent to
$\Sigma_0 C^{1/2}=C^{1/2}\Sigma_0$, hence to $\Sigma_0 C=C\Sigma_0$ by functional calculus. Multiplying this identity on the left and right by $\Sigma_0^{1/2}$ gives $\Sigma_0\Sigma_1=\Sigma_1\Sigma_0$. Conversely, if $\Sigma_0$ and $\Sigma_1$ commute, they are orthogonally co-diagonalizable, and both {eq}`eq-gaussian-product-fm-terminal-map` and {eq}`eq-gaussian-brenier-map-comparison` reduce in that basis to the diagonal map with entries $\sqrt{\lambda_{1,k}/\lambda_{0,k}}$. This proves the equivalence.
:::


The Gaussian optimality proposition explains why the statement "flow matching gives an optimal map" is fragile. The same terminal map {eq}`eq-gaussian-product-fm-terminal-map` is obtained for any scalar schedule $Z_t=a_tX_0+b_tX_1$ with the same endpoints, because after whitening the covariance path remains $a_t^2\Id+b_t^2C$. Thus changing the speed of a scalar Gaussian bridge, for instance by using an OU schedule, cannot repair the non-optimality created by non-commuting covariances. Commuting covariances reduce the terminal map to independent one-dimensional scalings, whereas non-commuting covariances create a non-symmetric affine map, hence a transport with a rotational or shearing component. More generally, mixture-like paths can create the same obstruction even when every instantaneous velocity looks natural. This distinction is closely related to counterexamples showing that flow maps associated with Fokker--Planck or diffusion-type evolutions do not in general provide optimal transport maps {cite:p}`LavenantSantambrogio2022FlowMap`. In particular, starting from an isotropic Gaussian does not by itself guarantee optimality once the target distribution is non-Gaussian; additional structural assumptions on the path or on the coupling are needed.

### Variations on the interpolant.

The geometry of the generated trajectories depends on the chosen interpolant, not only on the two endpoint laws. There is first a harmless ambiguity: a monotone reparametrization $Z_t=(1-\lambda(t))X+\lambda(t)Y$ of the linear bridge only changes the speed of the flow, $$v_t(z)=\lambda'(t)\,v^{\rm lin}_{\lambda(t)}(z),
    \qquad
    v^{\rm lin}_{r}(z)=\EE[Y-X\mid (1-r)X+rY=z].$$ It therefore leaves the spatial integral curves unchanged. Diffusion models use a genuinely different family of noising paths. If $$Z_t=a_tX+b_tY,\qquad Y\sim\Gaussian(0,\sigma^2\Id),$$ then both the mixture centers and the component variances are changed. Writing $p_t$ for the density of $Z_t$ and $s_t=\nabla\log p_t$, Tweedie's formula gives, away from times where $a_t=0$, $$v_t(z)=a'_t\,\EE[X\mid Z_t=z]+b'_t\,\EE[Y\mid Z_t=z]
    =\frac{a'_t}{a_t}z+
    \left(\frac{a'_tb_t^2}{a_t}-b'_tb_t\right)\sigma^2s_t(z).$$ For the linear bridge, $a_t=1-t$ and $b_t=t$, this recovers the formula above. For the variance-preserving Ornstein--Uhlenbeck noising used in diffusion models, $$a_\tau=e^{-\tau},\qquad b_\tau=\sqrt{1-e^{-2\tau}},$$ one obtains the forward probability-flow velocity $v_\tau(z)=-z-\sigma^2\nabla\log p_\tau(z)$. Sampling follows the reverse field $z+\sigma^2\nabla\log p_\tau(z)$ as $\tau$ decreases. This is the noising law used in the diffusion trajectory panel below; the trajectories are more curved than for the linear bridge because the centers and variances evolve according to the OU/Fokker--Planck scaling rather than by affine interpolation. Numerically, the integration is stopped at a small positive time before the Dirac endpoint, where the score becomes singular.

The finite-time coefficients $a_t=\cos(\pi t/2)$ and $b_t=\sin(\pi t/2)$ are not a new spatial interpolant: they are exactly the OU coefficients after the time change $\tau=-\log\cos(\pi t/2)$. The schedule comparison below therefore places the OU bridge next to a genuinely different scalar bridge, $$a_t=(1-t)(1-2t),
    \qquad
    b_t=t,$$ whose data coefficient changes sign before vanishing. This overshooting bridge is mainly a diagnostic example: it keeps the same endpoints, but its intermediate mixture reflects through the origin and produces visibly different reverse trajectories.

(fig:generative-diffusion-versus-ot-2d)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("generative-diffusion-versus-ot-2d", width=760)
```

Diffusion-style sampling trajectories compared with OT rays in the three-Dirac setting. Red particles are sampled from the centered Gaussian endpoint and transported toward the three blue atoms. The diffusion panel integrates a reverse probability-flow field based on a Gaussian-mixture score, while the OT panel uses straight displacement rays selected by a quadratic matching.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the trajectory and schedule controls to compare curved diffusion sampling paths with straight optimal-transport rays.
:::


<iframe class="ot4ml-live-frame" title="Diffusion trajectory schedule controls" src="../live/generative-trajectories.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>


(fig:generative-diffusion-schedule-comparison)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("generative-diffusion-schedule-comparison", width=760)
```

Effect of the interpolant on the exact reverse flow for the same three-Dirac target and the same Gaussian endpoint. The linear bridge $a_t=1-t$, $b_t=t$ produces almost radial curves. The variance-preserving OU bridge $a_\tau=e^{-\tau}$, $b_\tau=\sqrt{1-e^{-2\tau}}$ changes the relative speed of contraction and noising. The overshooting bridge $a_t=(1-t)(1-2t)$, $b_t=t$ is not a time reparameterization of either one and produces a more pronounced bending of the reverse trajectories.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the schedule controls to compare how different noising laws allocate motion over time.
:::


<iframe class="ot4ml-live-frame" title="Diffusion schedule comparison controls" src="../live/generative-schedule.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

:::{admonition} Remark: Changing the bridge speed does not restore optimality
:class: ot4ml-remark

The same terminal map {eq}`eq-gaussian-product-fm-terminal-map` is obtained for every continuously differentiable scalar schedule $Z_t=a_tX_0+b_tX_1$ satisfying $(a_0,b_0)=(1,0)$, $(a_1,b_1)=(0,1)$, and $a_t^2\Id+b_t^2C\succ0$ for all $t$. Indeed, after whitening, the covariance path is $a_t^2\Id+b_t^2C$, and the flow map is its positive square root. Thus changing the speed of a nondegenerate scalar Gaussian bridge, for instance by using an OU schedule, cannot repair the non-optimality created by non-commuting covariances.

Commuting covariances reduce the terminal map to independent one-dimensional scalings, whereas non-commuting covariances create a non-symmetric affine map, hence a transport with a rotational or shearing component. More generally, mixture-like paths can create the same obstruction even when every instantaneous velocity looks natural. This distinction is closely related to counterexamples showing that flow maps associated with Fokker--Planck or diffusion-type evolutions do not in general provide optimal transport maps {cite:p}`LavenantSantambrogio2022FlowMap`. In particular, starting from an isotropic Gaussian does not by itself guarantee optimality once the target distribution is non-Gaussian; additional structural assumptions on the path or on the coupling are needed.
:::

(alg-gaussian-mixture-probability-flow-sampling)=
:::{admonition} Algorithm: Exact probability-flow sampling for a Gaussian mixture
:class: ot4ml-algorithm

**Input:** Gaussian-mixture data law, schedule $(a_t,b_t)$, noise level $\sigma$, number of samples $R$.

**Output:** Backward samples $(Z_0^{(r)})_r$.

**Define** the noising variable:
$Z_t=a_tX+b_tY, \qquad Y\sim\Gaussian(0,\sigma^2\Id)$.

**Compute** closed-form mixture density $p_t$ and score $s_t=\nabla\log p_t$.

**Set** probability-flow velocity:
$v_t(z)=\frac{a'_t}{a_t}z+ \left(\frac{a'_tb_t^2}{a_t}-b'_tb_t\right)\sigma^2s_t(z)$.

**For** $r=1,\ldots,R$ **do**:

>
> **Draw** $Z_1^{(r)}$ from the Gaussian endpoint.
>
> **Integrate** $\dot Z_t^{(r)}=v_t(Z_t^{(r)})$ backward from $t=1$ to $t=0$.
>

**Return** $(Z_0^{(r)})_r$.
:::


## One-Step Generative Models

One-step generative models try to keep the geometric training principle of flows while removing the expensive multi-step integration at sampling time. The idea is to evolve the model distribution during training, but to store the final evolution in a single generator evaluation.

### One-Step Models via Parameter-Domain Discrepancy Flows

The most direct one-step strategy is to train the generator parameters
themselves by descending a discrepancy between generated and data
distributions. Let $\zeta$ be a simple latent distribution, let
$f_\theta:\mathcal Z\to\X$ be a neural generator, and let $\beta$ be the data
distribution. The objective is to find $\theta$ such that

```{math}
(f_\theta)_\sharp\zeta=\beta,
```

or, in practice, such that the generated law is close to $\beta$. Given a
discrepancy $\mathcal D$ on probability measures, define

```{math}
:label: eq-one-step-parameter-discrepancy

\mathcal E_\beta(\gamma)\eqdef\mathcal D(\gamma,\beta),
\qquad
H_\beta(\theta)
\eqdef
\mathcal E_\beta\big((f_\theta)_\sharp\zeta\big)
=
\mathcal D\big((f_\theta)_\sharp\zeta,\beta\big).
```

This viewpoint includes Wasserstein GANs, MMD-GANs and Sinkhorn generative
models {cite:p}`WassersteinGAN,MMD-GAN,2017-Genevay-AutoDiff`; when
$\mathcal D$ is written through a dual potential or discriminator, it connects
directly with the adversarial formulation in {ref}`sec-gan-duality`. The
resulting training dynamics is the ordinary Euclidean gradient flow in
parameter space,

```{math}
:label: eq-one-step-parameter-flow

\dot\theta_t=-\nabla_\theta H_\beta(\theta_t).
```

This parameter flow induces a flow of generated measures, but this induced flow
is not intrinsic in general. Set

```{math}
\alpha_t\eqdef(f_{\theta_t})_\sharp\zeta,
\qquad
X_t=f_{\theta_t}(Z),
\qquad
Z\sim\zeta .
```

If $t\mapsto\theta_t$ is smooth and $f_\theta$ is differentiable with respect
to $\theta$, then

```{math}
\dot X_t
=
\partial_\theta f_{\theta_t}(Z)\dot\theta_t .
```

For $\alpha_t$-a.e. $x$, let $\eta_{t,x}$ be the disintegration of the latent
law $\zeta$ with respect to the map $f_{\theta_t}$. Thus $\eta_{t,x}$ is
supported on the fiber $\{z:f_{\theta_t}(z)=x\}$, and for every bounded
measurable $\psi$,

```{math}
\int \psi(z)\,\d\zeta(z)
=
\int_\X\left(\int \psi(z)\,\d\eta_{t,x}(z)\right)\d\alpha_t(x).
```

The Eulerian velocity of the generated measure is therefore the conditional
average

```{math}
:label: eq-one-step-induced-velocity

v_t(x)
=
\int \partial_\theta f_{\theta_t}(z)\dot\theta_t\,\d\eta_{t,x}(z)
=
-\int \partial_\theta f_{\theta_t}(z)\nabla_\theta H_\beta(\theta_t)\,\d\eta_{t,x}(z).
```

Indeed, for every smooth test function $\varphi$,

```{math}
\frac{\d}{\d t}\int \varphi(x)\,\d\alpha_t(x)
=
\int \langle\nabla\varphi(x),v_t(x)\rangle\,\d\alpha_t(x),
```

which is the weak form of the continuity equation

```{math}
:label: eq-one-step-induced-continuity

\partial_t\alpha_t+\operatorname{div}(\alpha_t v_t)=0.
```

The velocity {eq}`eq-one-step-induced-velocity` depends on the parameter value
$\theta_t$ and on the latent disintegration, not only on the measure
$\alpha_t$. If the parametrization is non-identifiable, two different
parameters can generate the same measure while inducing different velocities.
Thus {eq}`eq-one-step-parameter-flow` is a Euclidean gradient flow on parameter
space, and only after push-forward a model-dependent flow on measures. It
coincides with an intrinsic Wasserstein gradient flow only in special cases
where $v_t$ agrees with the Wasserstein velocity

```{math}
-\nabla\delta_\gamma\mathcal E_\beta(\gamma)\big|_{\gamma=\alpha_t}.
```

More generally, a projected Wasserstein flow on the model manifold would
require projecting this intrinsic velocity onto the infinitesimal velocities
attainable by variations of $\theta$, using the $L^2(\alpha_t)$ metric. The
ordinary Euclidean parameter gradient flow {eq}`eq-one-step-parameter-flow` does
not perform this projection in general.

In machine learning, however, $\beta$ is accessed through minibatches. If

```{math}
\hat\beta_n=\frac{1}{n}\sum_{i=1}^n\delta_{Y_i},
\qquad
Y_i\overset{\mathrm{i.i.d.}}{\sim}\beta,
```

then the implemented update often replaces $H_\beta$ by the random objective
$H_{\hat\beta_n}$. For nonlinear discrepancies this is not, in general, an
unbiased gradient estimator:

```{math}
\mathbb E\left[\nabla_\theta H_{\hat\beta_n}(\theta)\right]
\neq
\nabla_\theta H_\beta(\theta).
```

The expectation is over the data minibatch. This bias is a finite-sample effect
of inserting the empirical measure inside a nonlinear transport or adversarial
optimization before differentiating; it is distinct from the optimization noise
of stochastic gradient descent. MMD losses admit unbiased $U$-statistic
variants, but OT and entropic OT objectives generally exhibit the bias--variance
phenomena discussed in {ref}`sec-bias-variance-ot`.

(ex-perturbation-response-neural-ot)=
:::{admonition} Example: Application to perturbation-response prediction
:class: ot4ml-example

In perturbation biology, one observes an unperturbed control law $\al$ and a perturbed law $\be$, but not paired cells. The goal is to learn how a new control cell would respond. Neural OT parameterizes a Monge map, a conditional Monge map or a stochastic semi-coupling and trains it from unpaired samples so that the pushed or transported control population matches $\be$. The distinction between a coupling, a deterministic map and an out-of-sample extrapolator is essential here: the learned object should act on cells not seen during training, not merely explain one empirical coupling {cite:p}`BunneKrauseCuturi2022ConditionalMonge,LuebeckBunneGutCastilloPelkmansAlvarezMelis2022NubOT,ChenHuChenHuang2024W1SingleCellOT,KleinUsciddaTheisCuturi2023GENOT`. Conditional Wasserstein flows in Section {ref}`sec-conditional-wasserstein-resnets` give a related geometric language when the conditioning variable is depth, context or treatment.
:::

### One-Step Model Using Wasserstein Flow of Discrepancy

This construction keeps the discrepancy-minimization viewpoint of the previous
paragraph but changes the dynamics. Instead of following the Euclidean gradient
of the discrepancy in parameter space, one prescribes the Wasserstein gradient
flow of the generated law and then learns a generator update realizing this
motion. This distribution-space, natural-gradient-type dynamics is less tied to
a particular parametrization and can have better convergence behavior, in
particular by reducing parameter-space traps when the discrepancy has a
favorable geometry.

Let $\zeta$ be a simple latent distribution and let $\alpha_\theta=(G_\theta)_\sharp\zeta$ be the model distribution. Assume that the target data distribution is $\beta$. The Wasserstein-flow construction chooses a discrepancy $$\mathcal E_\beta(\alpha),$$ for instance a smoothed $\KL(\alpha|\beta)$, an MMD/IPM loss, or the debiased Sinkhorn divergence $\bar\MK_c^\epsilon(\alpha,\beta)$ introduced in the Sinkhorn divergence section. The associated formal descent is

```{math}
:label: eq-one-step-wgf

\partial_t\alpha_t+\operatorname{div}(\alpha_t w_t)=0,
    \qquad
    w_t(x)=-\nabla\delta_\alpha \mathcal E_\beta(\alpha_t)(x).
```

Instead of integrating {eq}`eq-one-step-wgf` at inference time, one fits, at each training time $t$, a parametric residual field $U_{\eta_t}$ along the current model distribution:

```{math}
:label: eq-one-step-l2-fit

\min_\eta \int
        \norm{U_\eta(x)-w_t(x)}^2
        \,\d\alpha_t(x).
```

In a particle or generator implementation, the learned residual is then used to update the current generator by $$\alpha_{\theta}^{+}
    =
    (\Id+\tau U_{\eta_t})_\sharp \alpha_\theta,
    \qquad\text{or equivalently}\qquad
    G_\theta^{+}(z)=G_\theta(z)+\tau U_{\eta_t}(G_\theta(z)).$$ This is an ideal function-space update. A genuine one-step implementation fits the updated outputs back into a fixed generator architecture, or distills the accumulated transport into one network. After many training updates, that fixed-architecture or distilled generator is evaluated once at test time. This is the organizing principle behind recent one-step methods based on Wasserstein gradient flows: W-Flow uses such a construction with the Sinkhorn divergence as a tractable global discrepancy {cite:p}`Han2026WFlow`, while drifting methods evolve the generated distribution during training through a fitted vector field and also admit one-step inference {cite:p}`Deng2026Drifting`. The gradient-flow interpretation of drifting models, and its relation to KL, MMD, sliced-Wasserstein and Sinkhorn-type discrepancies, is analyzed in {cite:p}`Gretton2026DriftingWGF,He2026SinkhornDrifting`. These ideas are also connected to the Sinkhorn-type normalization dynamics used to model attention in Sinkformers {cite:p}`Sander2022Sinkformers`.

(alg-one-step-wgf-generator-update)=
:::{admonition} Algorithm: One-step Wasserstein-flow generator update
:class: ot4ml-algorithm

**Input:** Generator $G_{\theta_k}$, latent law $\zeta$, data law $\beta$, numerical descent-field oracle $W_\beta$, step size $\tau$, batch size $B$.

**Output:** Updated generator $G_{\theta_{k+1}}$.

**Draw** $z_b\sim\zeta$ for $b=1,\ldots,B$.

**Set** $x_b=G_{\theta_k}(z_b)$.

**Set** $w_k(x)=W_\beta[\alpha_{\theta_k}](x)$, where $W_\beta[\alpha]=-\nabla\delta_\alpha\mathcal E_\beta(\alpha)$.

**Set** $\eta_k$ by minimizing the empirical least-squares loss:
$\frac1B\sum_{b=1}^B \norm{U_{\eta}(x_b)-w_k(x_b)}^2$.

**Update by composition:**
$G_{\theta_{k+1}}(z) = G_{\theta_k}(z)+\tau U_{\eta_k}(G_{\theta_k}(z))$.

**Return** $G_{\theta_{k+1}}$.
:::

### Sliced-Wasserstein Flow

A particularly transparent instance uses the sliced objective introduced for
imaging and barycenters by Rabin, Peyré, Delon and Bernot
{cite:p}`rabin-ssvm-11`. Take

```{math}
\mathcal E_\beta(\alpha)=\frac12\SW_2^2(\alpha,\beta),
```

with $\SW_2$ defined in {ref}`sec-sliced-wasserstein`. With the
continuity-equation convention
$\partial_t\alpha_t+\operatorname{div}(\alpha_t w_t)=0$, the descent velocity
points from the current projected law toward the target projected law. More
precisely, assume that $\alpha$ has a density and sufficient moments so that the projected monotone maps are uniquely defined for almost every direction. If $T_\theta$
denotes the one-dimensional monotone transport from $(P_\theta)_\sharp\alpha$
to $(P_\theta)_\sharp\beta$, then the formal $\Wass_2$-gradient-flow velocity is

```{math}
:label: eq-sliced-wasserstein-flow-velocity

w_{\SW}[\alpha,\beta](x)
=
\int_{\Sphere^{d-1}}
\big(T_\theta(P_\theta x)-P_\theta x\big)\,\theta\,\d\sigma(\theta).
```

The sign follows from the one-dimensional identity: the first variation of
$\frac12\Wass_2^2(\rho,\nu)$ has spatial derivative $s-T(s)$, so the descent
velocity is $T(s)-s$, and composing with $P_\theta$ lifts it in the direction
$\theta$.

Thus empirical implementations only require one-dimensional sorting along
sampled directions, followed by averaging the lifted projected displacements.
This is the sliced-Wasserstein flow studied by Cozzi and Santambrogio
{cite:p}`CozziSantambrogio2024SlicedFlow`, who prove long-time convergence under
their hypotheses when the target is Gaussian and also show that the limiting
characteristic map is not, in general, the optimal transport map. When both the
evolving law and the target are Gaussian, the averaged velocity is affine and
the flow closes on means and covariances; this finite-dimensional closure is
revisited in {ref}`sec-gaussian-closure-transport-dynamics`, where the sliced
objective appears in the Gaussian closure catalogue of
{ref}`prop-centered-gaussian-covariance-catalogue`.

The difference between the full $\Wass_2$ descent and its sliced analogue is
already visible on a simple shape example. {ref}`fig:generative-w2-vs-sliced-flow-shapes`
compares the exact empirical flow of $\frac12\Wass_2^2(\cdot,\beta)$, where
one fixed optimal assignment gives straight relaxation curves, with the
$\Wass_2$-gradient flow of $\frac12\SW_2^2(\cdot,\beta)$, where the velocity is
recomputed from projected monotone rearrangements.

(fig:generative-w2-vs-sliced-flow-shapes)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("generative-w2-vs-sliced-flow-shapes", width=850)
```

Full Wasserstein and sliced-Wasserstein flows from a cat-shaped empirical law
to a heart-shaped target. The left panel in each row shows representative
particle trajectories colored from red to blue. The five panels on the right
render kernel-density estimates of all particles at common normalized times.
The $\Wass_2$ flow follows the fixed optimal assignment and therefore straight
relaxation rays, whereas the sliced flow averages one-dimensional sorted
rearrangements over projection directions, producing curved trajectories and a
different transient density evolution.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change the slicing angle and samples to compare a global quadratic assignment flow with the coordinatewise flow induced by one projected sliced direction.
:::

<iframe class="ot4ml-live-frame" title="Interactive W2 versus sliced-flow panel" src="../live/generative-w2-sliced-flow.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>


(sec-svgd-generative-flow)=
### Stein Variational Gradient Descent

Stein variational gradient descent (SVGD) is another deterministic particle
flow that fits naturally in this one-step viewpoint {cite:p}`LiuWang2016SVGD`.
Its original motivation is Bayesian sampling: given a target probability
$\beta=\rho_\beta\,\d x$ known through its score
$\nabla\log\rho_\beta=-\nabla V$, but not necessarily through its normalizing
constant, drive a particle cloud toward $\beta$ without estimating the score of
the current empirical law. Geometrically, this replaces
the Wasserstein gradient flow of $\KL(\alpha|\beta)$, whose tangent norm is
$L^2(\alpha)$, by the kernelized Benamou--Brenier geometry of
{ref}`sec-kernelized-bb-distance`, whose velocities live in a vector-valued RKHS.

For the formal density-level calculation, assume
$\alpha=\rho_\alpha\,\d x$ and $\beta=\rho_\beta\,\d x$ have smooth positive
densities, and let $v$ be a smooth compactly supported vector field. For the
perturbation $\alpha_\epsilon=(\Id+\epsilon v)_\sharp\alpha$, integration by
parts gives

```{math}
\left.\frac{\d}{\d\epsilon}\KL(\alpha_\epsilon|\beta)\right|_{\epsilon=0}
=
-\int
\big(\dotp{\nabla\log\rho_\beta(x)}{v(x)}+\operatorname{div} v(x)\big)
\d\alpha(x).
```

The bracket is the Langevin--Stein operator applied to $v$ and averaged under
$\alpha$; because it only evaluates $v$, $\operatorname{div}v$, and the target
score at sample locations, it remains meaningful when $\alpha$ is empirical.
Optimizing this linear functional over the unit ball of $\RKHS_k^d$ and using
the reproducing property gives the RKHS steepest-descent direction,

```{math}
:label: eq-svgd-velocity
v_{\alpha}^{\mathrm{SVGD}}(x)
=
\int
\Big(k(y,x)\nabla\log\rho_\beta(y)+\nabla_y k(y,x)\Big)
\d\alpha(y).
```

The associated mean-field equation is

```{math}
:label: eq-svgd-mean-field
\partial_t\alpha_t+\operatorname{div}\bigl(\alpha_t v_{\alpha_t}^{\mathrm{SVGD}}\bigr)=0.
```

For particles $\alpha^\ell_n=n^{-1}\sum_i\delta_{X_i^\ell}$, this becomes

```{math}
:label: eq-svgd-particle-update
X_i^{\ell+1}
=
X_i^\ell
+
\tau\,\frac{1}{n}\sum_{j=1}^n
\Big(k(X_j^\ell,X_i^\ell)\nabla\log\rho_\beta(X_j^\ell)
+
\nabla_{X_j}k(X_j^\ell,X_i^\ell)\Big).
```

The first term attracts particles toward increasing target log-density; the second term is a kernel repulsion that prevents immediate collapse.
The gradient-flow interpretation and its many-particle limits are studied in
{cite:p}`Liu2017SVGDGradientFlow,DuncanNueskenSzpruch2019SVGDGeometry,NueskenRenger2021SVGDAsymptotics`.
In generative modeling terms, SVGD transports a simple empirical latent law by
repeated smooth particle updates. It is therefore close in spirit to the
drifting fields above, but its velocity is not learned by regression: it is the
closed-form RKHS steepest-descent direction of the KL functional.


The figure below contrasts this RKHS flow with a particle closure of the Wasserstein gradient flow of $\KL(\alpha\mid\beta)$. The latter evaluates the current score $\nabla\log\rho_\alpha$ by a Gaussian KDE, while SVGD avoids this density estimate and uses the target score together with a kernel repulsion.

(fig:generative-w2-vs-svgd-entropy-flow)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("generative-w2-vs-svgd-entropy-flow", width=760)
```

Particle trajectories for two deterministic descents of relative entropy toward the same three-Gaussian target, whose density is shown by gray contours. The left panel approximates the $\Wass_2$ gradient flow of $\KL(\alpha\mid\beta)$ by the KDE velocity $\nabla\log\rho_\beta-\nabla\log\rho_{\alpha,h}$. The right panel uses the RBF-kernel SVGD velocity {eq}`eq-svgd-velocity`, where target-score attraction is coupled with RKHS repulsion. Both panels use the same initial particles and color trajectory time from red to blue.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change the number of particles and integration time to
compare a KDE Wasserstein closure with an RKHS Stein-type particle flow.
:::

<iframe class="ot4ml-live-frame" title="Interactive W2/SVGD particle-flow panel" src="../live/generative-w2-svgd.html" loading="lazy" style="width:100%;height:520px;border:0;display:block;"></iframe>

### Self-corrected drifting fields.

Drifting methods need not start from an exact Wasserstein gradient. They often prescribe an attraction-minus-repulsion field and then regress this field in $L^2(\alpha_t)$. A simple continuous version uses a strictly positive kernel $K_\epsilon(x,y)$ for which the following integrals are finite, and defines, for any probability measure $\nu$,

```{math}
:label: eq-normalized-kernel-drift

B_\epsilon[\nu](x)
    \eqdef
    \frac{\int (y-x)K_\epsilon(x,y)\,\d\nu(y)}
         {\int K_\epsilon(x,y)\,\d\nu(y)}.
```

 For the Gaussian kernel $K_\epsilon(x,y)=\exp(-\norm{x-y}^2/(2\epsilon))$, this normalized field is a score of a smoothed density:

```{math}
:label: eq-normalized-kernel-score

B_\epsilon[\nu](x)
    =
    \epsilon\nabla\log\!\left(\int K_\epsilon(x,y)\,\d\nu(y)\right).
```

 The drifting velocity is then

```{math}
:label: eq-cross-minus-self-drift

u_t(x)=B_\epsilon[\beta](x)-B_\epsilon[\alpha_t](x)
    =
    \epsilon\nabla\log
    \frac{\int K_\epsilon(x,y)\,\d\beta(y)}
         {\int K_\epsilon(x,y)\,\d\alpha_t(y)}.
```

 The first term pulls samples toward data, while the second term corrects self-attraction and prevents all particles from collapsing onto the same high-density region. For a fixed reference measure, $B_\epsilon[\nu]$ is precisely the Gaussian mean-shift displacement in {eq}`eq-l2-attention-mean-shift`: it moves $x$ toward the local kernel barycenter of $\nu$. Hence self-corrected drifting can be read as the difference between a target mean-shift field and the current model's own mean-shift field. Sinkhorn drifting replaces these one-sided kernel normalizations by two-sided entropic OT couplings, so that the cross and self terms are normalized by Sinkhorn scaling rather than by a single denominator {cite:p}`He2026SinkhornDrifting`.

(alg-self-corrected-drifting-particles)=
:::{admonition} Algorithm: Self-corrected drifting particle update
:class: ot4ml-algorithm

**Input:** Particles $x_i^k$ for $\alpha_k$, data samples $(y_b)_{b=1}^B$ from $\beta$, kernel scale $\epsilon$, step $h$.

**Output:** Updated particles $x_i^{k+1}$.

**For** each particle $i$ **do**:

>
> **Set** $Z_{\beta,i}=\sum_{b=1}^B K_\epsilon(x_i^k,y_b)$ and $b_i^k=Z_{\beta,i}^{-1}\sum_{b=1}^B (y_b-x_i^k)K_\epsilon(x_i^k,y_b)$.
>
> **Set** $Z_{\alpha,i}=\sum_{j=1}^n K_\epsilon(x_i^k,x_j^k)$ and $m_i^k=Z_{\alpha,i}^{-1}\sum_{j=1}^n (x_j^k-x_i^k)K_\epsilon(x_i^k,x_j^k)$.
>
> **Set**
> $u_i^k=b_i^k-m_i^k$.
>
> **Update**
> $x_i^{k+1}=x_i^k+h\,u_i^k$.

**Return** $(x_i^{k+1})_i$.
:::

(fig:generative-drifting-model-trajectories)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("generative-drifting-model-trajectories", width=760)
```

Drifting trajectories for a small particle generator. The raw kernel drift has weak long-range attraction and can leave particles away from the data modes. The self-corrected field uses the difference $B_\epsilon[\beta]-B_\epsilon[\alpha_t]$, so a longer integration brings particles to the blue modes while repelling them from their own current concentration.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the drift and time controls to inspect a learned-looking velocity field and its induced particle trajectories.
:::


<iframe class="ot4ml-live-frame" title="Drifting field controls" src="../live/generative-drifting.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>

(prop-drifting-semi-relaxed-gradient)=
:::{admonition} Proposition: Instantaneous gradient representation of drifting
:class: ot4ml-proposition

Let $\al_t=\rho_t\,\d x$ be a smooth curve of probability measures with positive densities, and let $u_t=\nabla\phi_t$ be a smooth time-dependent gradient field. Define the semi-relaxed functional

```{math}
:label: eq-semi-relaxed-drift-functional

\mathcal R_t(\alpha|\al_t)
\eqdef
-\int \phi_t(x)\,\d\alpha(x)
+\int \phi_t(x)\,\d\al_t(x).
```

Here $\al_t$ and $\phi_t$ are frozen when taking the first variation with respect to the first argument $\alpha$. Then the continuity equation

```{math}
\partial_t\al_t+\diverg(\al_t u_t)=0
```

is the formal Wasserstein gradient descent of the frozen time-dependent functional $\alpha\mapsto\mathcal R_t(\alpha|\al_t)$.
:::

:::{dropdown} Proof
Since $\al_t$ and $\phi_t$ are fixed in the variation with respect to $\alpha$, the first variation is

```{math}
\delta_\alpha \mathcal R_t(\alpha|\al_t)(x)=-\phi_t(x).
```

By Proposition {ref}`prop-formal-wass-gradient`,

```{math}
\Wgrad \mathcal R_t(\alpha|\al_t)
=
\nabla\delta_\alpha \mathcal R_t(\alpha|\al_t)
=
-\nabla\phi_t
=
-u_t.
```

The Wasserstein gradient-descent velocity is the negative of this gradient, namely $u_t$. Substituting this velocity in the continuity equation gives the claimed flow.
:::


:::{admonition} Example: Kernel drifting as a frozen surrogate
:class: ot4ml-example

For the Gaussian-kernel drift {eq}`eq-cross-minus-self-drift`, set

```{math}
\phi_t(x)=
\epsilon\log
\frac{\int K_\epsilon(x,y)\,\d\beta(y)}
     {\int K_\epsilon(x,y)\,\d\al_t(y)}.
```

Then $u_t=\nabla\phi_t$, so Proposition {ref}`prop-drifting-semi-relaxed-gradient` shows that kernel drifting is the Wasserstein gradient descent of

```{math}
\mathcal R_t^{\mathrm{drift}}(\alpha|\al_t)
=
\epsilon
\int
\log
\frac{\int K_\epsilon(x,y)\,\d\al_t(y)}
     {\int K_\epsilon(x,y)\,\d\beta(y)}
\,\d\alpha(x)
+\mathrm{constant}.
```

The surrogate vanishes at $\alpha=\al_t$, but it need not be nonnegative and is therefore not a divergence. It is "semi-relaxed" because the current model $\al_t$ is used to build the potential, but it is not varied inside the denominator when computing the first variation in $\alpha$.
:::


:::{admonition} Remark: General fields and projection onto gradients
:class: ot4ml-remark

A general regressed field $b_t$ is not necessarily the minimal Wasserstein tangent representative. Such representatives belong to the $L^2(\al_t)$ closure of gradient fields, and fields producing the same continuity-equation variation can differ by a weighted divergence-free component. The gradient component is obtained by the weighted projection

```{math}
\nabla\phi_t
=
\uargmin{\nabla\phi}
\int \norm{\nabla\phi(x)-b_t(x)}^2\,\d\al_t(x).
```

One may first normalize $b_t$ pointwise, for instance by $b_t/(\norm{b_t}+\eta)$, or globally by $\norm{b_t}_{L^2(\al_t)}$, before this projection. Proposition {ref}`prop-drifting-semi-relaxed-gradient` then applies to the projected field. Non-gradient components can still be useful in a parametric model, but they are not descent directions of a scalar functional for the $\Wass_2$ Riemannian metric.
:::

(sec-moment-measures)=
## Moment Measures

Moment measures give another way to make a whole distribution from one convex potential. Instead of first fixing a simple source law and then learning a transport map, one asks for a convex function whose own log-concave density is pushed forward by its gradient. This couples sampling and mapping in a rigid way: the same potential defines both the source density and the Brenier map. The reward is a hidden convex structure: after a suitable optimal-transport reformulation, a nonlinear equation on convex functions becomes a convex minimization problem for probability densities. This is one of the cleanest places where optimal transport, Prékopa-type inequalities and convex geometry meet.

(def-moment-measure)=
:::{admonition} Definition: Moment measure of a convex function
:class: ot4ml-definition

Let $u:\RR^d\to\RR\cup\{+\infty\}$ be a proper lower-semicontinuous convex function such that

```{math}
Z_u\eqdef \int_{\RR^d} e^{-u(x)}\,\d x <+\infty.
```

The normalized log-concave measure associated with $u$ is

```{math}
\eta_u \eqdef Z_u^{-1} e^{-u(x)}\,\d x.
```

Whenever $\nabla u$ is defined $\eta_u$-almost everywhere, the moment measure of $u$ is

```{math}
\mathfrak M(u)\eqdef (\nabla u)_\sharp \eta_u.
```
:::


The normalization removes additive constants in $u$. Translations of the argument are another invariance: if $u_a(x)=u(x-a)$, then $\eta_{u_a}$ is the translate of $\eta_u$, while $\nabla u_a(x)=\nabla u(x-a)$, hence $\mathfrak M(u_a)=\mathfrak M(u)$. A first obstruction is immediate. Formally, if $u$ is smooth and $e^{-u}$ decays fast enough for the boundary term to vanish, then

```{math}
\int y\,\d\mathfrak M(u)(y)
=
Z_u^{-1}\int \nabla u(x)e^{-u(x)}\,\d x
=
-Z_u^{-1}\int \nabla(e^{-u(x)})\,\d x
=0.
```

Thus moment measures are necessarily centered. The nonsmooth theory uses essentially continuous convex functions: lower-semicontinuous convex functions whose set of discontinuity points has zero $\mathcal H^{d-1}$ measure. Since a convex function is continuous in the interior of its effective domain, this condition controls only its boundary behavior.

Figure {ref}`fig:moment-measure-forward-map` shows the forward construction in one dimension. The map $u'$ is implicit in the push-forward, but the display focuses on the two visible measures: the log-concave source $\eta_u=Z_u^{-1}e^{-u}\d x$ and the resulting moment measure $\mathfrak M(u)$.

(fig:moment-measure-forward-map)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("moment-measure-forward-map", width=760)
```

*Forward moment-measure construction in one dimension. Each column shows a convex potential $u$ chosen so that the moment measure has a prescribed shape: a skewed unimodal density, two bumps, and three bumps with different widths and heights. The top row overlays $u$ (gray, vertically rescaled) with the density of the log-concave source $\eta_u=Z_u^{-1}e^{-u}\d x$ (red), while the bottom row shows $\mathfrak M(u)=(u')_{\#}\eta_u$ (blue); the dashed vertical line marks the zero barycenter.*
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Change the convex potential coefficients and watch the
same \(u\) define both the log-concave source measure \(\eta_u\) and the
moment measure obtained by pushing it through the monotone map \(u'\).
:::

<iframe class="ot4ml-live-frame" title="Moment-measure forward-map controls" src="../live/transportation-moment-measure.html" loading="lazy" style="width:100%;height:480px;border:0;display:block;"></iframe>

(thm-moment-measure-characterization)=
:::{admonition} Theorem: Cordero--Erausquin--Klartag
:class: ot4ml-theorem

Let $\al\in\Pp_1(\RR^d)$ be a probability measure. There exists an essentially continuous convex function $u$ such that $\al=\mathfrak M(u)$ if and only if

```{math}
\int y\,\d\al(y)=0
\qquad\text{and}\qquad
\supp(\al)\text{ is not contained in a hyperplane.}
```

Under these conditions, $u$ is unique up to translations of the argument and additive constants.
:::


This theorem is due to Cordero--Erausquin and Klartag {cite:p}`CorderoErausquinKlartag2015MomentMeasures`. It is a functional analogue of a Minkowski-type problem: the target measure prescribes how the gradient image of a log-concave density should be distributed. The hyperplane condition is the natural non-degeneracy assumption; otherwise the prescribed gradient image lives in a lower-dimensional affine direction and no coercive full-dimensional convex potential can be recovered.

(ex-moment-measure-gaussian)=
:::{admonition} Example: Quadratic potentials
:class: ot4ml-example

Let $A\in\RR^{d\times d}$ be symmetric positive definite and

```{math}
u(x)=\frac12 x^\top A x + c.
```

Then $\eta_u=\Nn(0,A^{-1})$ and $\nabla u(x)=Ax$, so

```{math}
\mathfrak M(u)=\Nn(0,A).
```

Thus centered non-degenerate Gaussians are moment measures. This example also shows the self-dual flavor of the construction: the covariance of the log-concave source is inverted by the linear gradient map.
:::


### Optimal-transport variational formulation.

Santambrogio {cite:p}`Santambrogio2015MomentMeasures` reformulates the moment-measure problem as a minimization over absolutely continuous probability measures. For a centered $\al\in\Pp_1(\RR^d)$, define the maximal-correlation transport functional, with values in $\RR\cup\{+\infty\}$,

```{math}
:label: eq-moment-max-correlation
\mathcal C_\al(\eta)
\eqdef
\sup_{\pi\in\Couplings(\eta,\al)}
\int_{\RR^d\times\RR^d} x\cdot y\,\d\pi(x,y).
```

By Kantorovich duality for the scalar-product cost,

```{math}
:label: eq-moment-max-correlation-dual
\mathcal C_\al(\eta)
=
\inf_{v\ \mathrm{convex}}
\left\{
\int v(x)\,\d\eta(x)+\int v^*(y)\,\d\al(y)
\right\},
```

where the infimum is over convex functions for which both integrals are well defined and $v^*$ is the Legendre transform. If $\eta,\al\in\Pp_2(\RR^d)$, then

```{math}
:label: eq-moment-correlation-w2
\mathcal C_\al(\eta)
=
\frac12\int \norm{x}^2\,\d\eta(x)
+
\frac12\int \norm{y}^2\,\d\al(y)
-
\frac12\Wass_2^2(\eta,\al).
```

The variational problem attached to a centered target $\al$ is

```{math}
:label: eq-moment-measure-variational
\min_{\eta\in\Pp_1(\RR^d)}
\left\{
\mathcal H(\eta)+\mathcal C_\al(\eta)
\right\},
\qquad
\mathcal H(r\,\d x)\eqdef \int r(x)\log r(x)\,\d x,
```

with $\mathcal H(\eta)=+\infty$ when $\eta$ is not absolutely continuous.
The centering of $\al$ makes this functional invariant under translations of $\eta$, since translating $\eta$ by a vector $a$ changes $\int x\cdot y\,\d\pi$ by $a\cdot\int y\,\d\al(y)=0$.

(prop-moment-hidden-convexity)=
:::{admonition} Proposition: Variational characterization of moment measures
:class: ot4ml-proposition

Let $\al\in\Pp_1(\RR^d)$ be centered and not supported on a hyperplane. Then the minimization problem {eq}`eq-moment-measure-variational` admits a solution, unique up to translations. Every minimizer is a probability measure with log-concave density of the form

```{math}
\eta=Z_u^{-1}e^{-u}\,\d x,
```

where $u$ is convex, essentially continuous, and satisfies the moment-measure equation

```{math}
\al=(\nabla u)_\sharp \eta.
```

Conversely, any essentially continuous convex $u$ satisfying this equation yields a global minimizer. If $\al\in\Pp_2(\RR^d)$, the objective $\eta\mapsto\mathcal H(\eta)+\mathcal C_\al(\eta)$ is displacement convex along $\Wass_2$ geodesics of absolutely continuous measures in $\Pp_2(\RR^d)$ whenever the terms are finite. When merely $\al\in\Pp_1(\RR^d)$, the maximal-correlation term remains convex along such finite-second-moment geodesics by approximation; existence and uniqueness on the full $\Pp_1$ domain follow from the lower-semicontinuity argument of Santambrogio.
:::

:::{dropdown} Proof
The existence proof has two ingredients. First, since $\al$ is centered, translating $\eta$ does not change either $\mathcal H(\eta)$ or $\mathcal C_\al(\eta)$, so one can center a minimizing sequence. Second, the assumption that $\al$ is not supported on a hyperplane gives a coercive lower bound of the form $\mathcal C_\al(\eta)\geq c_\al\int\norm{x}\,\d\eta(x)$ for centered absolutely continuous $\eta$, with $c_\al>0$. Together with the lower-semicontinuity estimates for entropy and maximal correlation, this yields a minimizer {cite:p}`Santambrogio2015MomentMeasures`.

Let $\eta=r\,\d x$ be a minimizer and let $u$ be a convex optimizer in the dual formula {eq}`eq-moment-max-correlation-dual`. Keeping $u$ fixed and varying $\eta$ in {eq}`eq-moment-measure-variational` gives the Euler equation

```{math}
\log r(x)+1+u(x)=\mathrm{constant}
\qquad\text{on }\{r>0\},
```

so $\eta=Z_u^{-1}e^{-u}\d x$. The optimality condition for the scalar-product transport problem says that an optimal coupling is supported on $\{(x,y):y\in\partial u(x)\}$. Since $\eta$ is absolutely continuous and $u$ is convex, $\partial u(x)=\{\nabla u(x)\}$ for $\eta$-almost every $x$, hence $\al=(\nabla u)_\sharp\eta$.

Conversely, assume $\eta=Z_u^{-1}e^{-u}\d x$ and $\al=(\nabla u)_\sharp\eta$. Let $\nu$ be a smooth compactly supported competitor, and let $T$ be the Brenier map from $\eta$ to $\nu$. Along the geodesic $\eta_t=((1-t)\Id+tT)_\sharp\eta$, the right derivative of the entropy at $t=0$ is

```{math}
\frac{\d}{\d t}\mathcal H(\eta_t)\Big|_{t=0^+}
=
-\int \dotp{T(x)-x}{\nabla u(x)}\,\d\eta(x),
```

where the identity follows by differentiating the Jacobian formula and integrating by parts. The dual optimizer $u$ gives the upper directional bound

```{math}
\frac{\d}{\d t}\mathcal C_\al(\eta_t)\Big|_{t=0^+}
\leq
\int \dotp{T(x)-x}{\nabla u(x)}\,\d\eta(x).
```

Conversely, Santambrogio's derivative estimate gives

```{math}
\frac{\d}{\d t}\mathcal C_\al(\eta_t)\Big|_{t=0^+}
\geq
\int \dotp{T(x)-x}{\nabla u(x)}\,\d\eta(x),
```

because $(\Id,\nabla u)_\sharp\eta$ is optimal for the scalar-product problem. The two bounds coincide, so the first-order terms cancel. Hence the one-sided derivative of $\mathcal H+\mathcal C_\al$ at $\eta$ in every such direction is zero. Displacement convexity implies global minimality, and approximation removes the smooth compact-support restriction. Strict displacement convexity of entropy gives uniqueness, except for translations; translations do not change $\mathcal C_\al$ because $\al$ is centered.

It remains to justify the convexity assertion. The entropy term is displacement convex by McCann's theorem, recalled in Theorem {ref}`thm-mccann-internal-energy`. If $\al$ has finite second moment, identity {eq}`eq-moment-correlation-w2` writes $\mathcal C_\al$ as the sum of the $1$-convex moment term $\eta\mapsto\frac12\int\norm{x}^2\,\d\eta$ and the $(-1)$-convex term $\eta\mapsto-\frac12\Wass_2^2(\eta,\al)$, hence $\mathcal C_\al$ is displacement convex. For a target with only a finite first moment, Santambrogio obtains the same convexity along $\Pp_2$ geodesics by approximation and proves the full variational characterization by lower semicontinuity.
:::


(rem-moment-hidden-convexity)=
:::{admonition} Remark: Where the convexity is hidden
:class: ot4ml-remark

If one eliminates $\eta$ first, the problem becomes the convex-potential functional

```{math}
u\mapsto
\int u^*(y)\,\d\al(y)
-
\log\!\left(\int e^{-u(x)}\,\d x\right).
```

This is a Toland-type duality: the functional is not visibly convex as a function of $u$, because the first term is convex while the logarithmic partition term is concave in this parametrization. Cordero--Erausquin and Klartag make the hidden convexity visible by changing variables to the dual potential $\varphi=u^*$. Since $u=\varphi^*$ for closed convex potentials, the same functional becomes

```{math}
\varphi\mapsto
\int \varphi(y)\,\d\al(y)
-
\log\!\left(\int e^{-\varphi^*(x)}\,\d x\right).
```

The first term is now affine in $\varphi$. The core Prekopa--Leindler input is that
$\varphi\mapsto \log\int e^{-\varphi^*}$ is concave along convex combinations of convex functions; equivalently, the negative log-partition in the display is convex. Santambrogio's formulation reveals the same mechanism in transport language: the difficult convexity becomes the displacement convexity of an entropy-plus-maximal-correlation functional in the measure variable $\eta$.
:::


### Conjugate moment measures for generation.

The moment-measure factorization suggests a generative recipe: sample $X$ from the log-concave law $Z_u^{-1}e^{-u}$ and output $\nabla u(X)$. This ties sampling and mapping through the same convex potential. Vesseron, Béthune and Cuturi {cite:p}`VesseronBethuneCuturi2025ConjugateMomentMeasures` argue that this direct factorization can be poorly adapted to practical generative modeling, and propose instead the conjugate factorization

```{math}
:label: eq-conjugate-moment-measure
\beta
=
(\nabla w^*)_\sharp
\left(Z_w^{-1}e^{-w(z)}\,\d z\right).
```

Here $\nabla w^*$ is the Brenier map from the learned log-concave source to the target distribution $\beta$. This keeps the single-convex-potential philosophy, but places the transport map on the conjugate side; it can be parameterized by input-convex neural networks and trained using OT solvers. From the viewpoint of this chapter, moment measures are therefore a rigorous convex-analytic prototype for one-step generators based on gradients of convex potentials.


(sec-transformer-depth-evolution)=
## Evolution in Depth of Transformers

Deep residual architectures can be read as time discretizations of ODEs or PDEs. For transformers, the transported objects are token measures and the velocity is induced by attention.

Transformers were introduced as sequence-to-sequence architectures driven by self-attention {cite:p}`Vaswani2017Attention` and have since become a central architecture for language and vision models {cite:p}`Brown2020LanguageModels,Dosovitskiy2021Image`. Their distinctive feature is that each token is updated by a data-dependent average of all other tokens. This makes an attention layer permutation-equivariant before positional encoding, context dependent after conditioning on the input sequence, and naturally compatible with a measure viewpoint in which a prompt is regarded as an empirical distribution of tokens.

The mathematical limit used below concerns depth rather than model scale: one lets the number of residual attention layers grow while each layer makes a small update, as in continuous-depth neural networks {cite:p}`Chen2018NeuralODE`. For attention, the resulting velocity is nonlinear in the current token law because it is normalized by the whole context. This measure-theoretic view appears in the analysis of attention as a Lipschitz or interacting-particle operator {cite:p}`Vuckovic2020MathematicalAttention,Geshkovski2023MathematicalPerspective`, in the Sinkhorn-normalized dynamics of Sinkformers {cite:p}`Sander2022Sinkformers`, and in recent well-posedness and mean-field-limit results for several attention mechanisms {cite:p}`Castin2025DynamicsTransformers`. It also separates the infinite-depth limit studied here from the token-limit question, where one controls how a finite empirical context approximates its limiting attention operator {cite:p}`Bohbot2025TokenSampleComplexity`.

We now consider very deep transformers, focusing on a single-head attention mechanism for simplicity while ignoring MLP layers, layer normalization, causality, and masking. This stripped-down framework is best suited to modeling encoders and vision transformers; the references above indicate which parts of this simplified picture extend to richer attention mechanisms.

### Attention as a context-dependent velocity.

After tokenization, embedding, and positional encoding, each input is represented as a point cloud $(x_i)_{i=1}^n$ of $n$ vectorized tokens. An attention layer with a skip connection and residual scale $1/T$, where $T$ is the depth, transforms the tokens according to $$x_i \mapsto x_i + \frac{1}{T} \sum_j \frac{e^{\langle Q x_i, K x_j \rangle} V x_j}{\sum_{\ell} e^{\langle Q x_i, K x_\ell \rangle}},$$ where $\theta=(K,Q,V)$ denotes the three parameter matrices. The conventional factor $1/\sqrt r$, with $r$ the query/key dimension, can be absorbed into $Q$ or $K$ and is omitted here.

### Token measure evolution.

To handle an arbitrary number of tokens, define $\alpha = \frac{1}{n} \sum_i \delta_{x_i}$ as the empirical measure of tokens and rewrite the transformer mapping as $$x_i \mapsto x_i + \frac{1}{T} \Gamma_\theta[\alpha](x_i),$$ where $$\Gamma_\theta[\alpha](x) :=
    \frac{\int e^{\langle Q x, K y \rangle} V y \, \d \alpha(y)}
    {\int e^{\langle Q x, K z \rangle} \, \d \alpha(z)}.$$ At the level of the token distribution, the layer uses the context-dependent velocity $\Gamma_{\theta_t}[\alpha]$ and pushes $\alpha$ forward by $\Id+\tau\Gamma_{\theta_t}[\alpha]$. This map depends on the whole context $\alpha$ and on the depth-dependent parameters $\theta_t$. Denoting normalized depth by $t\in[0,1]$ and setting $\tau=1/T$ gives $$\alpha_{t+\tau} = (\Id + \tau \Gamma_{\theta_t}[\alpha_t])_\sharp \alpha_t.$$ As $\tau \to 0$, this converges formally to the conservation equation $$\partial_t \alpha_t + \operatorname{div}(\alpha_t \Gamma_{\theta_t}[\alpha_t]) = 0.$$


### $L^2$ attention and mean shift.

A particularly geometric variant replaces the dot-product score $\langle Qx,Ky\rangle$ by a negative squared Euclidean score $s_\epsilon(x,y)=-\norm{x-y}^2/(2\epsilon)$. Take, for simplicity, the same token space for queries, keys and values, and set

```{math}
K_\epsilon(x,y)=\exp(-\norm{x-y}^2/(2\epsilon)),
\qquad
\rho_\epsilon[\alpha](x)=\int K_\epsilon(x,y)\d\alpha(y),
\qquad
m_\epsilon[\alpha](x)
=
\frac{\int yK_\epsilon(x,y)\d\alpha(y)}
     {\rho_\epsilon[\alpha](x)}.
```

The map $x\mapsto m_\epsilon[\alpha](x)$ is exactly Gaussian-kernel attention, i.e. normalized kernel regression over tokens; such $L^2$ or Gaussian-kernel scores are used explicitly in transformer variants motivated by Lipschitz control and projection-free attention {cite:p}`KimPapamakariosMnih2020L2SelfAttention,KunduGhoshGhoshHonavar2026GaussianKernelAttention`. Classical mean shift, however, uses the displacement from the current point to this local barycenter. This gives

```{math}
:label: eq-l2-attention-mean-shift
M_\epsilon[\alpha](x)
\eqdef
m_\epsilon[\alpha](x)-x
=
\frac{\int (y-x)K_\epsilon(x,y)\d\alpha(y)}
     {\rho_\epsilon[\alpha](x)}
=
\epsilon\nabla\log\rho_\epsilon[\alpha](x)
```

and, when $\alpha$ is empirical, $\rho_\epsilon[\alpha]$ is a Gaussian kernel density estimate up to normalization. Thus $M_\epsilon[\alpha]$ is the classical Gaussian mean-shift vector {cite:p}`FukunagaHostetler1975,Cheng1995MeanShift,ComaniciuMeer2002MeanShift`. Consequently, the barycentric residual update

```{math}
x_i^{k+1}
=
(1-\tau)x_i^k+\tau m_\epsilon[\alpha_k](x_i^k)
=
x_i^k+\tau M_\epsilon[\alpha_k](x_i^k)
```

is an explicit Euler step of the continuous-time mean-shift equation

```{math}
\partial_t\alpha_t+\operatorname{div}\bigl(\alpha_tM_\epsilon[\alpha_t]\bigr)=0.
```

With time step one this recovers the usual mean-shift iteration $x\leftarrow m_\epsilon[\alpha](x)$; with small residual steps it becomes a transport PDE that moves each token uphill along the log of the smoothed token density. This distinction between the raw barycentric attention output $m_\epsilon$ and the velocity $M_\epsilon=m_\epsilon-\Id$ is important: adding $m_\epsilon$ directly as a residual would produce a different drift. The mean-shift form isolates a purely metric attention mechanism from the learned bilinear geometry of $\dotp{Qx}{Ky}$.

(fig:generative-mean-shift-pde)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("generative-mean-shift-pde", width=760)
```

Continuous-time mean shift for a densely sampled three-Gaussian mixture. Left: initial density level sets, in red, and representative particle paths of $\dot x=M_\epsilon[\alpha_t](x)$, colored from red to blue. Right: four later kernel-density renderings of $\alpha_t$ at increasing times, with the same red-to-blue time palette; the initial density is omitted because it is shown on the left. The snapshots are chosen before complete mode collapse, so that the flow visibly advects mass uphill along $\log\rho_\epsilon[\alpha_t]$ and sharpens the overlapping modes.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Vary the bandwidth, particle count, and integration time to see the mean-shift transport PDE sharpen a three-mode density.
:::

<iframe class="ot4ml-live-frame" title="Mean-shift PDE controls" src="../live/generative-mean-shift.html" loading="lazy" style="width:100%;height:510px;border:0;display:block;"></iframe>

### Gradient structure and limitations.

When the token space has dimension $d$ and the query/key space has dimension $r$, take $Q,K\in\RR^{r\times d}$ and $V\in\RR^{d\times d}$. If $V=Q^\top K$, the field $\Gamma_\theta[\alpha]$ is a gradient vector field in the token variable. Indeed, define the log-partition potential $$\Phi_\alpha(x)
    =
    \int \exp(\dotp{Qx}{Ky})\d\alpha(y),
    \qquad
    U_\alpha(x)=\log\Phi_\alpha(x).$$ Then $$\nabla_x U_\alpha(x)
    =
    \frac{\int Q^\top K y\,\exp(\dotp{Qx}{Ky})\d\alpha(y)}
         {\int \exp(\dotp{Qx}{Kz})\d\alpha(z)}
    =
    \Gamma_\theta[\alpha](x).$$ This proves only that the velocity is an instantaneous gradient in $x$; it does not by itself identify a Wasserstein energy. Indeed, the natural scalar candidate $$f_{\rm att}(\alpha)=\int U_\alpha(x)\,\d\alpha(x)$$ has first variation $$\delta f_{\rm att}(\alpha)(z)=U_\alpha(z)+\int\frac{\exp(\dotp{Qx}{Kz})}{\Phi_\alpha(x)}\,\d\alpha(x),$$ up to an additive constant. The second term is the response of every query normalization to a perturbation of the key distribution, and its spatial gradient is absent from $\Gamma_\theta[\alpha]$. Thus, without additional symmetry or integrability conditions, the attention PDE is a transportation dynamics rather than the Wasserstein gradient flow of this fixed scalar functional. Special variants recover additional structure: Sinkhorn attention can be interpreted through doubly stochastic normalization and Wasserstein-type gradient flows {cite:p}`Sander2022Sinkformers,Castin2025DynamicsTransformers`, while layer normalization leads naturally to dynamics on the sphere and to modified metrics. The key open difficulty for the present viewpoint is training: after the architecture has been rewritten as a controlled transport equation, learning corresponds to optimizing the time-dependent parameters $(\theta_t)_t$ rather than merely analyzing the forward PDE for fixed parameters.

(alg-residual-attention-depth-evolution)=
:::{admonition} Algorithm: Residual attention depth evolution
:class: ot4ml-algorithm

**Input:** Tokens $(x_i^0)_{i=1}^n$, depth $T$, layer parameters $(Q_k,K_k,V_k)$.

**Output:** Final token measure $\alpha_T$.

**Initialize:**
$\alpha_0=\frac{1}{n}\sum_{i=1}^n\delta_{x_i^0}, \qquad \tau=1/T$.

**For** $k=0,\ldots,T-1$ **do**:

>
> **For** $i=1,\ldots,n$ **do**

>> $\Gamma_{\theta_k}[\alpha_k](x_i^k) = \frac{\sum_j \exp(\dotp{Q_kx_i^k}{K_kx_j^k})\,V_kx_j^k} {\sum_j \exp(\dotp{Q_kx_i^k}{K_kx_j^k})}$.
>>
>> $x_i^{k+1}=x_i^k+\tau\,\Gamma_{\theta_k}[\alpha_k](x_i^k)$.

> **Set**
> $\alpha_{k+1}=(\Id+\tau\Gamma_{\theta_k}[\alpha_k])_\sharp\alpha_k$.

**Return** $\alpha_T$.
:::


(sec-gaussian-closure-transport-dynamics)=
## Flows over the Gaussian Manifold

Gaussian measures provide a useful testing ground for the preceding dynamics. They are not invariant under a general Wasserstein gradient flow: a nonlinear velocity usually creates non-Gaussian densities immediately. The useful substitute is to either identify affine velocities, which exactly preserve Gaussianity, or to project the dynamics onto the Gaussian manifold. In both cases the measure PDE reduces to matrix ODEs for the mean and covariance. This viewpoint is emphasized in the survey {cite:p}`Peyre2026OptimalDiffusionTransports` and is useful for comparing diffusion paths, Wasserstein gradient flows, drifting fields and transformer-type dynamics.

For constrained gradient flows on this family, the covariance equation is the finite-dimensional Bures--Wasserstein gradient flow on positive definite matrices. Thus Gaussian closure is not just a computational shortcut: it is the restriction of Wasserstein geometry to the Gaussian submanifold, where affine gradient fields encode tangent vectors. The following figure first compares three bridge-type Gaussian closures from a source $\alpha_0$ to a target $\gamma$; the exact gradient-flow closures for specified energies $f(\alpha)$ are catalogued afterwards in {ref}`prop-centered-gaussian-covariance-catalogue`.

(fig:gradflow-gaussian-closure)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("gradflow-gaussian-closure", width=760)
```

Gaussian closures from a red source $\alpha_0$ to a blue target $\gamma=\mathcal N(\bar m,\bar\Sigma)$. The left panel is the constant-speed $W_2$ geodesic, equivalently the displacement interpolation minimizing the Benamou--Brenier action between $\alpha_0$ and $\gamma$. The middle panel is an entropic Sinkhorn/Schrödinger bridge-style closure for the quadratic cost $|x-y|^2$ and regularization strength $\epsilon>0$; it is a bridge toward $\gamma$, not the gradient flow of a fixed energy $f(\alpha)$, and the entropic noise inflates intermediate covariances. The right panel is a prescribed non-variational drifting flow, governed by a continuity equation with an affine Gaussian-preserving velocity, chosen so that the mean follows a curved path while the covariance is moment-matched to the same endpoint $\gamma$.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the anisotropy, angle, regularization, and drift controls to compare Gaussian closures of Wasserstein, Sinkhorn, and drifting dynamics.
:::


<iframe class="ot4ml-live-frame" title="Gaussian closure controls" src="../live/generative-gaussian-closure.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>


### Gaussianity preservation.

The first question is invariance: one wants a simple criterion ensuring that the continuity equation does not leave the finite-dimensional Gaussian family.

(prop-gaussian-affine-closure)=
:::{admonition} Proposition: Affine velocities preserve Gaussianity
:class: ot4ml-proposition

Let $\alpha_0=\Gaussian(m_0,\Sigma_0)$, with $\Sigma_0\succ0$. Let $b_t\in\RR^d$ and $A_t\in\RR^{d\times d}$ be locally integrable on a time interval, and let $(m_t,\Sigma_t)$ solve

```{math}
\dot m_t=b_t,
\qquad
\dot\Sigma_t=A_t\Sigma_t+\Sigma_tA_t^\top,
\qquad
(m_{t=0},\Sigma_{t=0})=(m_0,\Sigma_0).
```

Then, as long as this matrix ODE is defined, $\Sigma_t\succ0$ and

```{math}
\alpha_t=\Gaussian(m_t,\Sigma_t)
```

is the solution of the continuity equation

```{math}
\partial_t\alpha_t+\diverg(\alpha_t v_t)=0,
\qquad
v_t(x)=b_t+A_t(x-m_t).
```

In particular, if a smooth functional $f$ has a Wasserstein gradient on Gaussian measures of the affine form

```{math}
\Wgrad f(\Gaussian(m,\Sigma))(x)
=
b_f(m,\Sigma)+A_f(m,\Sigma)(x-m),
```

with $A_f(m,\Sigma)$ symmetric, then the Wasserstein gradient flow of $f$, initialized from any non-degenerate Gaussian, stays Gaussian and satisfies

```{math}
\dot m_t=h_f(m_t,\Sigma_t),
\qquad
\dot\Sigma_t=H_f(m_t,\Sigma_t),
```

where

```{math}
h_f(m,\Sigma)=-b_f(m,\Sigma),
\qquad
H_f(m,\Sigma)
=
-\bigl(A_f(m,\Sigma)\Sigma+\Sigma A_f(m,\Sigma)\bigr).
```

Conversely, fix a non-degenerate Gaussian $\Gaussian(m,\Sigma)$. Suppose that a finite-energy Wasserstein tangent field $V_{m,\Sigma}$ is represented by a gradient in $L^2(\Gaussian(m,\Sigma))$ and is tangent to the Gaussian manifold at this Gaussian. Then there exist $b(m,\Sigma)$ and a symmetric matrix $A(m,\Sigma)$ such that

```{math}
V_{m,\Sigma}(x)=b(m,\Sigma)+A(m,\Sigma)(x-m)
\qquad
\Gaussian(m,\Sigma)\text{-a.e.}
```

Consequently, under the same smoothness assumptions, if the Wasserstein gradient flow of a functional preserves the Gaussian family for all non-degenerate Gaussian initial data, then $\Wgrad f(\Gaussian(m,\Sigma))$ is affine on each Gaussian. Without the Wasserstein gradient representative, this converse is false because one may add velocity fields with zero $\Gaussian(m,\Sigma)$-weighted divergence.

Finally, any smooth Gaussian curve with positive definite covariance can be generated by an affine velocity. If one wants the velocity to be a Wasserstein tangent gradient, one chooses the unique symmetric solution of the Lyapunov equation

```{math}
A_t\Sigma_t+\Sigma_t A_t=\dot\Sigma_t.
```
:::

:::{dropdown} Proof
Let $X_t$ follow the characteristic ODE $\dot X_t=b_t+A_t(X_t-m_t)$ with $X_0\sim\Gaussian(m_0,\Sigma_0)$. Since $\dot m_t=b_t$, the centered variable $\tilde X_t=X_t-m_t$ solves the homogeneous linear ODE $\dot{\tilde X}_t=A_t\tilde X_t$. If $\Phi_t$ is the fundamental matrix $\dot\Phi_t=A_t\Phi_t$, $\Phi_{t=0}=\Id$, then

```{math}
X_t=m_t+\Phi_t(X_0-m_0),
\qquad
\Sigma_t=\Phi_t\Sigma_0\Phi_t^\top.
```

Hence $X_t$ is Gaussian and $\Sigma_t\succ0$, and

```{math}
\dot\Sigma_t
=
\frac{\d}{\d t}\EE\bigl(\tilde X_t\tilde X_t^\top\bigr)
=
A_t\Sigma_t+\Sigma_t A_t^\top.
```

This proves Gaussian preservation and the moment ODE. The Wasserstein gradient-flow statement follows by inserting the descent velocity $v_t=-\Wgrad f(\alpha_t)$.

For the converse, fix $\alpha=\Gaussian(m,\Sigma)$ and denote its density by $\rho$. Tangency to the Gaussian manifold means that the density variation $-\diverg(\rho V)$ is generated by some moment variation $(\dot m,\dot\Sigma)$, with $\dot\Sigma$ symmetric. Set $b=\dot m$, and let $A=A^\top$ be the unique solution of

```{math}
A\Sigma+\Sigma A=\dot\Sigma.
```

By the first part of the proposition, the affine gradient field $V_0(x)=b+A(x-m)$ generates exactly the same infinitesimal Gaussian variation. Hence

```{math}
\diverg\bigl(\rho(V-V_0)\bigr)=0
```

in the distributional sense. Both $V$ and $V_0$ belong to the $L^2(\alpha)$ closure of gradient fields. The weighted Helmholtz decomposition therefore makes $V-V_0$ simultaneously a tangent gradient and orthogonal to every tangent gradient, so $V=V_0$ in $L^2(\alpha)$. Equivalently, for a smooth representative $V-V_0=\nabla\psi$, integration by parts gives $\int\norm{\nabla\psi}^2\d\alpha=0$. This proves that the Wasserstein tangent representative is affine. The qualification is essential: without selecting the gradient representative, one can add a nonzero field with zero $\alpha$-weighted divergence without changing the Gaussian curve.

For a prescribed smooth Gaussian curve, set $b_t=\dot m_t$ and choose any matrix $A_t$ satisfying $A_t\Sigma_t+\Sigma_tA_t^\top=\dot\Sigma_t$. Since $\Sigma_t$ is positive definite, the Lyapunov map $A\mapsto A\Sigma_t+\Sigma_t A$ is invertible on symmetric matrices, which gives the unique symmetric choice when a gradient velocity is required. In that case $v_t$ is the gradient of the quadratic potential $x\mapsto \dotp{b_t}{x}+\dotp{A_t(x-m_t)}{x-m_t}/2$.
:::


### Gaussian-preserving gradient flows.

We now instantiate the affine-gradient viewpoint by tracking functionals whose full Wasserstein gradient is affine on Gaussian inputs. The catalogue below contains exact Gaussian-preserving Wasserstein flows, not projected or constrained flows; the separate constrained construction is discussed only afterwards.

(prop-centered-gaussian-covariance-catalogue)=
:::{admonition} Proposition: Gaussian closure catalogue
:class: ot4ml-proposition

Let $\gamma=\Gaussian(\bar m,\bar\Sigma)$ on $\RR^d$, with $\bar\Sigma\succ0$, and let the initial condition be $\alpha_0=\Gaussian(m_0,\Sigma_0)$, with $\Sigma_0\succ0$. For each functional displayed below, let $\alpha_t$ be the usual Wasserstein gradient flow on $\Pp_2(\RR^d)$, initialized at $\alpha_0$. Then the Gaussian family is invariant for these dynamics: as long as the solution exists and $\Sigma_t\succ0$,

```{math}
\alpha_t=\Gaussian(m_t,\Sigma_t),
```

and the mean and covariance satisfy

```{math}
\dot{m}_t=h(m_t,\Sigma_t),
\qquad
\dot{\Sigma}_t=H(m_t,\Sigma_t).
```

Write $\delta_m=m-\bar m$, $A=\bar\Sigma^{-1}$, and

```{math}
M_{\Sigma,\bar\Sigma}
\eqdef
\Sigma^{-1/2}\bigl(\Sigma^{1/2}\bar\Sigma\Sigma^{1/2}\bigr)^{1/2}\Sigma^{-1/2}.
```

With the normalizations displayed in the first column, the mean vector field $h$ and covariance vector field $H$ are listed in the following table. Gradients with respect to $\Sigma$ are symmetric Frobenius gradients on the cone of covariance matrices.

\begin{center}
\begingroup
\small
\renewcommand{\arraystretch}{1.55}
**Gaussian-preserving Wasserstein gradient flows.**\par\smallskip
\begin{tabularx}{\linewidth}{>{\raggedright\arraybackslash}p{.42\linewidth}>{\centering\arraybackslash}p{.18\linewidth}>{\raggedright\arraybackslash}X}
\hline
Functional $f(\alpha)$ & $h(m,\Sigma)$ & $H(m,\Sigma)$ \\
\hline
$g(m_\alpha,\Sigma_\alpha)$
&
$-\nabla_m g$
&
$-2(\Sigma\nabla_\Sigma g+\nabla_\Sigma g\,\Sigma)$
\\
$\displaystyle \int\Bigl(\frac12x^\top Bx+\dotp{\ell}{x}\Bigr)\d\alpha(x)$, $B=B^\top$
&
$-(B m+\ell)$
&
$-(\Sigma B+B\Sigma)$
\\
$\displaystyle \frac14\iint (x-y)^\top G(x-y)\d\alpha(x)\d\alpha(y)$, $G=G^\top$
&
$0$
&
$-(\Sigma G+G\Sigma)$
\\
$\KL(\alpha|\gamma)$
&
$-A\delta_m$
&
$2\Id-\Sigma A-A\Sigma$
\\
$\mathcal I(\alpha|\gamma)$
&
$-2A^2\delta_m$
&
$4\Sigma^{-1}-2\Sigma A^2-2A^2\Sigma$
\\
$\Wass_2^2(\alpha,\gamma)$
&
$-2\delta_m$
&
$2(M_{\Sigma,\bar\Sigma}\Sigma+\Sigma M_{\Sigma,\bar\Sigma}-2\Sigma)$
\\
$\MMD_k^2(\alpha,\gamma)$, $k(x,y)=\dotp{x}{y}^2$
&
$-4R m$
&
$-4(\Sigma R+R\Sigma)$
\\
$\displaystyle \bar\MK_{\norm{\cdot-\cdot}^2}^{\epsilon}(\alpha,\gamma)$
&
$-2\delta_m$
&
$-2(\Sigma G_\epsilon+G_\epsilon\Sigma)$
\\
$\SW_2^2(\alpha,\gamma)$
&
$\displaystyle -\frac{2}{d}\delta_m$
&
$-2(\Sigma G_{\mathrm{sw}}+G_{\mathrm{sw}}\Sigma)$
\\
\hline
\end{tabularx}
\endgroup
\end{center}
Here, in the MMD row,

```{math}
R=\Sigma+m\,m^\top-\bar\Sigma-\bar m\,\bar m^\top.
```

The debiased Sinkhorn row uses the notation of Corollary {ref}`cor-gaussian-sinkhorn-divergence`: for Gaussian inputs,

```{math}
\bar\MK_{\norm{\cdot-\cdot}^2}^{\epsilon}(\alpha,\gamma)
=
\norm{\delta_m}^2+\Bb_\epsilon(\Sigma,\bar\Sigma)^2,
```

with the closed-form covariance gradient

```{math}
G_\epsilon(\Sigma,\bar\Sigma)
=
\tau_\epsilon(\Sigma)
-
\bar\Sigma^{1/2}
\tau_\epsilon\bigl(B_{\Sigma,\bar\Sigma}^{1/2}\bigr)
B_{\Sigma,\bar\Sigma}^{-1/2}
\bar\Sigma^{1/2},
\qquad
B_{\Sigma,\bar\Sigma}=\bar\Sigma^{1/2}\Sigma\bar\Sigma^{1/2}.
```

Here $\tau_\epsilon$ is the scalar function

```{math}
\tau_\epsilon(r)
\eqdef
\frac{\sqrt{\epsilon^2+16r^2}-\epsilon}{4r},
\qquad r>0,
```

applied to positive matrices by spectral calculus. Equivalently, for $M\succ0$,

```{math}
\tau_\epsilon(M)
=
\bigl(\sqrt{\epsilon^2 I+16M^2}-\epsilon I\bigr)(4M)^{-1}.
```

With this convention, $G_\epsilon=\nabla_\Sigma \Bb_\epsilon(\Sigma,\bar\Sigma)^2$.
In the sliced row, $\sigma$ is the normalized spherical measure on $\Sphere^{d-1}$, and

```{math}
G_{\mathrm{sw}}(\Sigma,\bar\Sigma)
=
\int_{\Sphere^{d-1}}
\left(
1-\sqrt{\frac{\theta^\top\bar\Sigma\theta}{\theta^\top\Sigma\theta}}
\right)
\theta\theta^\top\,\d\sigma(\theta).
```

Here

```{math}
\mathcal I(\alpha|\gamma)
=
\int \left|\nabla\log\frac{\rho(x)}{\rho_\gamma(x)}\right|^2\rho(x)\,\d x
=
\int
\left|\nabla\log\rho(x)+A(x-\bar m)\right|^2\rho(x)\,\d x
\qquad(\alpha=\rho\,\d x),
```

where $\rho_\gamma$ is the density of $\gamma$.
:::

:::{dropdown} Proof
For the moment-functional row, the formula is exact on the full Wasserstein space. Indeed, write

```{math}
m_\alpha=\int x\,\d\alpha(x),
\qquad
\Sigma_\alpha=\int (x-m_\alpha)(x-m_\alpha)^\top\d\alpha(x).
```

If $\eta$ is a signed perturbation with zero total mass, then

```{math}
\d m_\alpha[\eta]=\int x\,\d\eta(x),
\qquad
\d\Sigma_\alpha[\eta]=\int (x-m_\alpha)(x-m_\alpha)^\top\d\eta(x).
```

Thus, up to an irrelevant additive constant, the first variation is

```{math}
\delta f(\alpha)(x)
=
\dotp{\nabla_m g}{x}
+
\dotp{\nabla_\Sigma g}{(x-m_\alpha)(x-m_\alpha)^\top},
```

and its spatial gradient is the affine field

```{math}
\nabla_x\delta f(\alpha)(x)
=
\nabla_m g+2\nabla_\Sigma g\,(x-m_\alpha).
```

Consequently the full Wasserstein descent velocity is affine, and Proposition {ref}`prop-gaussian-affine-closure` gives the displayed moment equations.

For the quadratic potential row, the ambient first variation is

```{math}
\delta f(\alpha)(x)=\frac12x^\top Bx+\dotp{\ell}{x},
\qquad
\nabla_x\delta f(\alpha)(x)=B m+\ell+B(x-m),
```

which gives the displayed affine velocity. For the quadratic interaction row, the ambient first variation is

```{math}
\delta f(\alpha)(x)
=
\frac12\int (x-y)^\top G(x-y)\d\alpha(y),
\qquad
\nabla_x\delta f(\alpha)(x)=G(x-m_\alpha).
```

These first variations are quadratic in $x$, hence the affine Gaussian flow coincides with the full Wasserstein gradient flow.

For the KL row, write $\alpha=\rho\,\d x$ and let $\rho_\gamma$ denote the density of $\gamma$. The ambient first variation is $\log(\rho/\rho_\gamma)$ up to an additive constant. If $\alpha=\Gaussian(m,\Sigma)$, then

```{math}
\nabla\log(\rho/\rho_\gamma)(x)
=
-\Sigma^{-1}(x-m)+A(x-\bar m),
```

so the descent velocity is

```{math}
v(x)=-A\delta_m+(\Sigma^{-1}-A)(x-m).
```

Proposition {ref}`prop-gaussian-affine-closure` gives $h(m,\Sigma)=-A\delta_m$ and $H(m,\Sigma)=2\Id-\Sigma A-A\Sigma$. For the Fisher row, writing $u=\log(\rho/\rho_\gamma)$, the ambient first variation of $\frac12\mathcal I(\alpha|\gamma)$ is, up to constants,

```{math}
-\Delta u-\frac12|\nabla u|^2-\dotp{\nabla u}{\nabla\log\rho_\gamma}.
```

For Gaussian $\rho$ and Gaussian $\gamma$, this is quadratic in $x$. Multiplying by two for $\mathcal I(\alpha|\gamma)$ gives the descent velocity

```{math}
v(x)=-2A^2\delta_m+2(\Sigma^{-2}-A^2)(x-m).
```

Hence the Wasserstein velocity is affine and the Gaussian family is closed, with the displayed $h$ and $H$. Although the ambient Fisher flow is a fourth-order PDE for a generic density, it is therefore an exact finite-dimensional closure in this quadratic-reference case.

For $\Wass_2^2(\alpha,\gamma)$, the Brenier map from $\Gaussian(m,\Sigma)$ to $\gamma$ is

```{math}
T(x)=\bar m+M_{\Sigma,\bar\Sigma}(x-m).
```

The descent velocity for the unhalved squared distance is $2(T-\Id)$, which gives the mean and covariance equations through Proposition {ref}`prop-gaussian-affine-closure`. For the MMD row, $k(x,y)=\dotp{x}{y}^2$ identifies the kernel mean embedding with the raw second moment. Thus

```{math}
\MMD_k^2(\alpha,\gamma)
=
\norm{\Sigma+m\,m^\top-\bar\Sigma-\bar m\,\bar m^\top}_{\mathrm F}^2
=
\norm{R}_{\mathrm F}^2,
```

and the ambient first variation is $2x^\top R x$, whose descent velocity is $-4Rx$. This gives $h(m,\Sigma)=-4R m$ and $H(m,\Sigma)=-4(\Sigma R+R\Sigma)$.

For the Sinkhorn row, Corollary {ref}`cor-gaussian-sinkhorn-divergence` gives the closed Gaussian formula as a squared mean displacement plus the smoothed Bures term $\Bb_\epsilon^2$. This is not only a formula on the Gaussian submanifold. The first variation of the entropic value with respect to the first marginal is a Sinkhorn dual potential, and for Gaussian marginals the cross and self dual potentials are quadratic. Their debiased combination is therefore quadratic, so its spatial gradient is affine. Since the restriction of the functional to Gaussians is

```{math}
(m,\Sigma)\mapsto \norm{m-\bar m}^2+\Bb_\epsilon(\Sigma,\bar\Sigma)^2,
```

the quadratic coefficient is $G_\epsilon=\nabla_\Sigma\Bb_\epsilon(\Sigma,\bar\Sigma)^2$, and the moment-functional computation gives the displayed $h$ and $H$. To compute this gradient, set $B_{\Sigma,\bar\Sigma}=\bar\Sigma^{1/2}\Sigma\bar\Sigma^{1/2}$. Since $\psi_\epsilon'(r)=-2\tau_\epsilon(r)$, differentiating
$\tr\psi_\epsilon(B_{\Sigma,\bar\Sigma}^{1/2})$ gives

```{math}
-\bar\Sigma^{1/2}
\tau_\epsilon\bigl(B_{\Sigma,\bar\Sigma}^{1/2}\bigr)
B_{\Sigma,\bar\Sigma}^{-1/2}
\bar\Sigma^{1/2},
```

whereas differentiating the self term
$-\frac12\tr\psi_\epsilon(\Sigma)$ gives $\tau_\epsilon(\Sigma)$. This proves the displayed closed form for $G_\epsilon$. When $\bar\Sigma=\Id$, this covariance contribution is a spectral function of $\Sigma$. If $\lambda$ is an eigenvalue of $\Sigma$, the corresponding scalar velocity is

```{math}
4\sqrt{\lambda+\epsilon^2/16}-4\sqrt{\lambda^2+\epsilon^2/16},
```

which gives the displayed covariance-eigenvalue equation by functional calculus.

For sliced Wasserstein, the exact ambient Wasserstein gradient is obtained by averaging the one-dimensional gradients. Each projection is Gaussian:

```{math}
(P_\theta)_\sharp\alpha=\Gaussian(\dotp{\theta}{m},\theta^\top\Sigma\theta),
\qquad
(P_\theta)_\sharp\gamma=\Gaussian(\dotp{\theta}{\bar m},\theta^\top\bar\Sigma\theta).
```

Hence

```{math}
\SW_2^2(\alpha,\gamma)
=
\int_{\Sphere^{d-1}}
\left[
\dotp{\theta}{\delta_m}^2
+
\left(\sqrt{\theta^\top\Sigma\theta}
-\sqrt{\theta^\top\bar\Sigma\theta}\right)^2
\right]\d\sigma(\theta).
```

If $T_\theta$ is the monotone transport from $(P_\theta)_\sharp\alpha$ to $(P_\theta)_\sharp\gamma$, then the descent velocity for the unhalved sliced objective is

```{math}
2\int_{\Sphere^{d-1}}\bigl(T_\theta(P_\theta x)-P_\theta x\bigr)\theta\,\d\sigma(\theta).
```

For Gaussian marginals, $T_\theta$ is affine. Thus this velocity is affine in $x$, and Proposition {ref}`prop-gaussian-affine-closure` applies. The spherical identity $\int\theta\theta^\top\d\sigma(\theta)=\Id/d$ gives the mean equation, and differentiating the covariance term gives $G_{\mathrm{sw}}$.
:::


Not every PDE preserves Gaussianity exactly. Wasserstein flows of generic higher-order regularizers usually create higher moments immediately and require a Gaussian projection to close on $(m,\Sigma)$. Such projected closures are still useful: they expose the finite-dimensional dynamics predicted by a variational model and make it easy to compare variational flows with non-variational affine dynamics such as drifting fields or the Gaussian transformer closure below.

:::{admonition} Example: Linear mean-field networks as cross-covariance flows
:class: ot4ml-example

Consider the two-layer mean-field model of Section {ref}`sec-wasserstein-flows-mlp`, and take the linear activation $\sigma(s)=s$, so that

```{math}
\psi((u,v),z)=v\,\dotp{u}{z}.
```

We restrict this example to centered neuron laws,

```{math}
\int (u,v)\d\alpha(u,v)=0,
\qquad
\Sigma_\alpha=
\begin{pmatrix}
\Sigma_{uu}(\alpha) & \Sigma_{uv}(\alpha)\\
\Sigma_{vu}(\alpha) & \Sigma_{vv}(\alpha)
\end{pmatrix},
```

and use the lower-left cross-covariance block

```{math}
\Sigma_{vu}(\alpha)=\int v u^\top\d\alpha(u,v)\in\RR^{d'\times d}.
```

The predictor is therefore the linear map

```{math}
G_{\alpha_t}(z)=\Sigma_{vu}(\alpha_t)z.
```

For the squared Euclidean loss, set

```{math}
S=\int zz^\top\d\rho(z,y),
\qquad
R=\int y z^\top\d\rho(z,y).
```

The learning energy of {eq}`eq-mlp-square-loss-quadratic-linear` is then the covariance functional

```{math}
f(\alpha)=g(\Sigma_\alpha),
\qquad
g(\Sigma)
=
\frac12\tr\!\big(\Sigma_{vu}S\Sigma_{uv}\big)
-\tr\!\big(R\Sigma_{uv}\big)
+\frac12\int\norm{y}^2\d\rho(z,y).
```

This puts the model exactly in the centered moment-functional row of Proposition {ref}`prop-centered-gaussian-covariance-catalogue`. To see that it recovers the usual particle equation, write

```{math}
E_\alpha\eqdef \Sigma_{vu}(\alpha)S-R.
```

The first variation is

```{math}
\delta f(\alpha)(u,v)=\dotp{E_\alpha}{v u^\top}=v^\top E_\alpha u.
```

Hence the particle velocity in parameter space is linear:

```{math}
-\nabla_{(u,v)}\delta f(\alpha)(u,v)
=
-\begin{pmatrix}
0 & E_\alpha^\top \\
E_\alpha & 0
\end{pmatrix}
\begin{pmatrix} u \\ v \end{pmatrix}.
```

Equivalently, at the level of $g$,

```{math}
\nabla_\Sigma g=
\frac12
\begin{pmatrix}
0 & E_\alpha^\top\\
E_\alpha & 0
\end{pmatrix}.
```

The factor $1/2$ in the covariance gradient comes from the symmetry of $\Sigma$: the upper-right block is the transpose of the lower-left block. Substituting this gradient in Proposition {ref}`prop-centered-gaussian-covariance-catalogue` gives

```{math}
\dot m_t=0,
\qquad
\dot\Sigma_t=-(\Sigma_t L_t+L_t\Sigma_t),
\qquad
L_t=
\begin{pmatrix}
0 & E_t^\top\\
E_t & 0
\end{pmatrix},
\qquad
E_t=\Sigma_{vu}(\alpha_t)S-R.
```

Thus a centered Gaussian law of neurons remains centered Gaussian, and the dynamics is driven by the cross-covariance block alone. This exact closure is special to the linear activation; for nonlinear activations, Gaussian closures are usually projections rather than invariant families.
:::


### Constrained evolution on the Gaussian manifold.

The preceding affine-gradient examples have a limited scope: most Wasserstein gradient flows of a functional $f(\alpha)$ are not closed on the Gaussian manifold. A nonlinear ambient velocity creates higher-order moments immediately, so the exact Gaussian closure usually fails. The constrained viewpoint deliberately replaces the full evolution by its projection onto $\mathcal G$, forcing the curve to remain Gaussian while keeping the Wasserstein tangent geometry.

Let $$\mathcal G=\{\Gaussian(m,\Sigma):m\in\RR^d,\ \Sigma\succ0\}$$ be the Gaussian submanifold of $\Pp_2(\RR^d)$. The Wasserstein gradient of a functional constrained to a smooth submanifold $\mathcal M\subset\Pp_2$ is defined as the Riesz representative of the differential restricted to tangent velocities of $\mathcal M$. Equivalently, it is the small-step limit of the constrained JKO scheme $$\alpha^{k+1}\in
    \argmin_{\alpha\in\mathcal M}
    \frac{1}{2\tau}\Wass_2^2(\alpha,\alpha^k)+f(\alpha).$$ For $\mathcal M=\mathcal G$, tangent velocities are affine gradient fields $v(x)=b+A(x-m)$ with $A=A^\top$. The constrained gradient is therefore the $L^2(\Gaussian(m,\Sigma))$ projection of the ambient Wasserstein gradient onto this finite-dimensional affine space, whenever the ambient gradient exists.

(prop-gaussian-gradient-bullet-list)=
:::{admonition} Proposition: Gaussian-constrained Wasserstein gradients
:class: ot4ml-proposition

Let $f$ be a smooth functional and assume that its restriction to nondegenerate Gaussian measures can be written as

```{math}
f(\Gaussian(m,\Sigma))=F(m,\Sigma).
```

Then the Wasserstein gradient constrained to the Gaussian family is the affine vector field

```{math}
v_F(x)
=
\nabla_m F(m,\Sigma)
+
2\nabla_\Sigma F(m,\Sigma)(x-m),
```

where $\nabla_\Sigma F$ denotes the symmetric matrix derivative. Equivalently, $v_F$ is the $L^2(\Gaussian(m,\Sigma))$ projection of the ambient Wasserstein gradient onto affine gradient fields, whenever the ambient gradient exists. Hence the gradient descent flow constrained to Gaussian measures satisfies

```{math}
:label: eq-gaussian-wgf-closure

\dot m_t=-\nabla_m F(m_t,\Sigma_t),
\qquad
\dot\Sigma_t=-2\bigl(\Sigma_t\nabla_\Sigma F(m_t,\Sigma_t)+\nabla_\Sigma F(m_t,\Sigma_t)\Sigma_t\bigr),
```

and the descent velocity is affine.
:::

:::{dropdown} Proof
Test the functional along a Gaussian tangent vector, represented by an affine gradient field

```{math}
v(x)=b+A(x-m)
```

with $A$ symmetric. The induced first-order variations are $\dot m=b$ and $\dot\Sigma=A\Sigma+\Sigma A$. Therefore

```{math}
\d F(m,\Sigma)[b,A\Sigma+\Sigma A]
=
\dotp{\nabla_m F}{b}
+
\mathrm{tr}\!\left(\nabla_\Sigma F(A\Sigma+\Sigma A)\right).
```

Since $A$, $\Sigma$ and $\nabla_\Sigma F$ are symmetric, the second term equals

```{math}
2\,\mathrm{tr}(\nabla_\Sigma F\,A\Sigma)
=
\int \dotp{2\nabla_\Sigma F(x-m)}{A(x-m)}\d\Gaussian(m,\Sigma)(x).
```

Together with the mean term, this gives

```{math}
\d F(m,\Sigma)[\dot m,\dot\Sigma]
=
\int \dotp{v_F(x)}{v(x)}\d\Gaussian(m,\Sigma)(x)
```

for all affine gradient fields $v$. This identifies the constrained Wasserstein gradient in the induced $L^2(\alpha)$ metric, or equivalently the projection of the ambient gradient when it exists. Substituting the descent velocity $-v_F$ in Proposition {ref}`prop-gaussian-affine-closure` gives {eq}`eq-gaussian-wgf-closure`.
:::


This proposition is the organizing rule for constrained Gaussian closures: once the scalar energy has been reduced to a function of $(m,\Sigma)$, its constrained Wasserstein gradient is automatically affine and the covariance follows the Bures-type ODE {eq}`eq-gaussian-wgf-closure`. When the first variation of $f$ is quadratic, this constrained gradient coincides with the full Wasserstein gradient.


### Non-variational Gaussian-preserving flows.

The last examples are not ordinary gradient flows of a fixed scalar energy on the full Wasserstein space. They preserve Gaussianity because the prescribed velocity field is affine when evaluated on Gaussian measures.

:::{admonition} Example: Flow matching and diffusion paths between Gaussians
:class: ot4ml-example

Consider a prescribed Gaussian interpolation $\alpha_t=\Gaussian(m_t,\Sigma_t)$. Proposition {ref}`prop-gaussian-affine-closure` shows that an exact flow-matching velocity can be taken affine:

```{math}
v_t(x)=\dot m_t+A_t(x-m_t),
\qquad
A_t\Sigma_t+\Sigma_t A_t=\dot\Sigma_t.
```

In the isotropic case $\Sigma_t=s_t^2\Id$, this reduces to the transparent formula

```{math}
v_t(x)=\dot m_t+\frac{\dot s_t}{s_t}(x-m_t).
```

For instance, the diffusion noising path

```{math}
X_t=a_tX_0+\sigma_t Z,\qquad Z\sim\Gaussian(0,\Id),
```

has $m_t=a_tm_0$ and $\Sigma_t=a_t^2\Sigma_0+\sigma_t^2\Id$. Thus, in the Gaussian case, diffusion paths and flow-matching paths reduce to the same mean-covariance bookkeeping, although the corresponding training objectives are different.
:::


:::{admonition} Example: Gaussian kernel drifting
:class: ot4ml-example

Let the target be $\gamma=\Gaussian(\bar m,\bar\Sigma)$ and assume $\al_t=\Gaussian(m_t,\Sigma_t)$. For the Gaussian kernel

```{math}
K_\epsilon(x,y)=\exp(-\norm{x-y}^2/(2\epsilon)),
```

the normalized field {eq}`eq-normalized-kernel-drift` satisfies

```{math}
B_\epsilon[\al_t](x)
=
-\epsilon(\Sigma_t+\epsilon\Id)^{-1}(x-m_t).
```

Indeed the smoothed density $x\mapsto\int K_\epsilon(x,y)\d\al_t(y)$ is proportional to the Gaussian density with mean $m_t$ and covariance $\Sigma_t+\epsilon\Id$. Thus $B_\epsilon[\al_t]$ is the mean-shift vector of a Gaussian density: it points linearly toward the Gaussian mode, with strength set by the bandwidth. The drifting velocity {eq}`eq-cross-minus-self-drift` is therefore the difference of two affine mean-shift fields; it is affine and preserves Gaussianity. With

```{math}
A_t=(\Sigma_t+\epsilon\Id)^{-1},
\qquad
\bar A=(\bar\Sigma+\epsilon\Id)^{-1},
```

the ODE is

```{math}
\dot m_t=\epsilon\bar A(\bar m-m_t),
\qquad
\dot\Sigma_t=\epsilon\bigl((A_t-\bar A)\Sigma_t+\Sigma_t(A_t-\bar A)\bigr).
```

This finite-dimensional model explains the stabilizing role of the self-normalized repulsion term in drifting: without it, the covariance equation loses the $A_t\Sigma_t+\Sigma_tA_t$ contribution.
:::


:::{admonition} Example: Gaussian closure of attention dynamics
:class: ot4ml-example

For the transformer PDE, assume $\alpha=\Gaussian(m,\Sigma)$. Since exponential tilting preserves Gaussianity,

```{math}
\frac{\int e^{\dotp{Qx}{Ky}}\,y\,\d\alpha(y)}
     {\int e^{\dotp{Qx}{Kz}}\,\d\alpha(z)}
=
m+\Sigma K^\top Qx.
```

Therefore

```{math}
\Gamma_\theta[\alpha](x)=Vm+V\Sigma K^\top Qx
```

is affine. The Gaussian token law is preserved and satisfies

```{math}
\dot m_t=(V_t+V_t\Sigma_tK_t^\top Q_t)m_t,
\qquad
\dot\Sigma_t=B_t\Sigma_t+\Sigma_tB_t^\top,
\qquad
B_t=V_t\Sigma_tK_t^\top Q_t.
```

When $V_t=Q_t^\top K_t$, the matrix $B_t=Q_t^\top K_t\Sigma_tK_t^\top Q_t$ is symmetric positive semidefinite, matching the gradient-field case mentioned above.
This closure is not a convergence theorem for trained transformers. It is instead a tractable model of how attention can shear, amplify or contract a cloud of tokens through its covariance.
:::

### Contractive Gaussian projection.

The preceding examples show when Gaussianity is preserved or imposed by projection. Gelbrich's inequality {cite:p}`gelbrich1990formula` gives a useful variational explanation: replacing a measure by the Gaussian with the same first two moments cannot increase its Wasserstein distance to another similarly projected measure.

(thm-gelbrich-projection)=
:::{admonition} Theorem: Gelbrich theorem
:class: ot4ml-theorem

For $\al\in\Pp_2(\RR^d)$, let

```{math}
\mathcal R\al\eqdef \Gaussian(m_\al,\Sigma_\al)
```

be the Gaussian with the same mean and covariance as $\al$. Then

```{math}
\Wass_2^2(\mathcal R\al,\mathcal R\nu)
=
\norm{m_\al-m_\nu}^2+\Bb^2(\Sigma_\al,\Sigma_\nu)
\leq
\Wass_2^2(\al,\nu).
```
:::

:::{dropdown} Proof
Take any coupling $(X,Y)$ of $\al$ and $\nu$, center the variables, and write $C=\EE[(X-m_\al)(Y-m_\nu)^\top]$. In the positive definite case, positivity of the block covariance matrix implies the factorization $C=\Sigma_\al^{1/2}K\Sigma_\nu^{1/2}$ with $\norm{K}_{\mathrm{op}}\leq1$, and therefore, by operator/nuclear norm duality,

```{math}
\tr C\leq \tr\left((\Sigma_\al^{1/2}\Sigma_\nu\Sigma_\al^{1/2})^{1/2}\right).
```

The semidefinite case follows by adding $\eta\Id$ to both covariance matrices and letting $\eta\downarrow0$.
Expanding $\EE\norm{X-Y}^2$ gives the lower bound

```{math}
\EE\norm{X-Y}^2
\geq
\norm{m_\al-m_\nu}^2+\Bb^2(\Sigma_\al,\Sigma_\nu).
```

Taking the infimum over couplings proves the inequality, while equality for Gaussian laws is Proposition {ref}`prop-gaussian-w2-bures`.
:::


The following preservation criterion is a direct consequence of Gelbrich's theorem and was explained to us by Hugo Lavenant. It says that a functional which does not increase under moment-matched Gaussian projection admits Gaussian minimizing movements from Gaussian initial data.

(thm-lavenant-gaussian-preserving-jko)=
:::{admonition} Theorem: Hugo Lavenant Gaussian-preservation criterion
:class: ot4ml-theorem

Let $f:\Pp_2(\RR^d)\to(-\infty,+\infty]$ satisfy

```{math}
f(\mathcal R\al)\leq f(\al)
\qquad\forall\al\in\Pp_2(\RR^d),
```

with $\mathcal R$ defined in Theorem {ref}`thm-gelbrich-projection`. If $\gamma$ is Gaussian and $\nu$ minimizes the JKO step

```{math}
\eta\mapsto f(\eta)+\frac1{2\tau}\Wass_2^2(\gamma,\eta),
```

then $\mathcal R\nu$ is also a minimizer. If this JKO minimizer is unique, it is Gaussian. Consequently, if every step from Gaussian data has a unique minimizer and the resulting minimizing movements converge in $\Wass_2$, each discrete iterate is Gaussian and every limit curve is Gaussian as well, possibly with a singular limiting covariance.
:::

:::{dropdown} Proof
For the JKO claim, $\mathcal R\gamma=\gamma$ because $\gamma$ is Gaussian. Hence, for any competitor $\eta$,

```{math}
f(\mathcal R\eta)+\frac1{2\tau}\Wass_2^2(\gamma,\mathcal R\eta)
\leq
f(\eta)+\frac1{2\tau}\Wass_2^2(\gamma,\eta).
```

Applying this to a minimizer $\eta=\nu$ shows that $\mathcal R\nu$ is again a minimizer. Uniqueness forces $\nu=\mathcal R\nu$.
:::


:::{admonition} Remark: Gaussian barycenters from contraction
:class: ot4ml-remark

The same projection argument also explains why quadratic Wasserstein barycenters of Gaussian measures are Gaussian. If $\be_s$ are Gaussian and

```{math}
f_{\rm bar}(\al)=\sum_s\la_s\Wass_2^2(\al,\be_s),
```

then $\mathcal R\be_s=\be_s$, and Theorem {ref}`thm-gelbrich-projection` gives $f_{\rm bar}(\mathcal R\al)\leq f_{\rm bar}(\al)$. Thus the moment-matched Gaussian projection of any barycenter is again a barycenter; when the barycenter is unique, it must itself be Gaussian. This is the contraction viewpoint behind Corollary {ref}`cor-gaussian-discrete-barycenters`.
:::
