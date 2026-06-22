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

Set $d'=2d$, write $(x,y)\in\RR^d\times\RR^d$, and choose $P_0(x,y)=x$ and $P_1(x,y)=y$. If $\pi$ has marginals $(\alpha_0,\alpha_1)$, then $\alpha_t=(P_t)_\sharp\pi$ interpolates between the two endpoint laws. The simplest choices are the independent coupling $\pi=\alpha_0\otimes\alpha_1$ and the straight path

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
:::{admonition} Proposition: Flow Matching Vector Field
:class: important
For each fixed $t$, assume $\partial_tP_t\in L^2(\pi;\RR^d)$. Consider the flow-matching problem over measurable fields $v_t:\RR^d\to\RR^d$ $$\min_{v_t} \int_{\RR^{d'}} \norm{v_t(P_t(u)) - [\partial_t P_t](u)}^2 \, \d\pi(u). \label{eq-flow-matching}$$ Its minimizer is characterized $\alpha_t$-almost everywhere by the conditional expectation $$\label{eq-flow-match-conditional}
        v_t(z) = \EE_{u \sim \pi} \big( [\partial_t P_t](u) \, \big| \, z = P_t(u) \big).$$ Then the pair $(\alpha_t,v_t)$ satisfies the continuity equation in Eulerian form.
:::

:::{dropdown} Proof
We first recall the two equivalent ways of writing the interpolated measure. Formally, one may write $$\alpha_t(z)=\int_{\RR^{d'}}\delta(z-P_t(u))\,\d\pi(u),$$ while the rigorous meaning is that, for every smooth test function $\varphi$, $$\label{eq-flow-matching-pushforward-test}
        \int_{\RR^d}\varphi(z)\,\d\alpha_t(z)
        =
        \int_{\RR^{d'}}\varphi(P_t(u))\,\d\pi(u).$$ The minimizer in {eq}`eq-flow-matching` is the orthogonal projection in $L^2(\pi;\RR^d)$ of the latent velocity $\partial_tP_t(u)$ onto the closed subspace of functions that depend on $u$ only through $P_t(u)$. This projection is the conditional expectation {eq}`eq-flow-match-conditional`. Formally, this can be read as $$v_t(z)=\frac{1}{\alpha_t(z)}
        \int_{\RR^{d'}}\delta(z-P_t(u))[\partial_tP_t](u)\,\d\pi(u),$$ and rigorously it means that, for every smooth test vector field $m$, $$\label{eq-v_t}
        \int \dotp{m(z)}{v_t(z)} \, \d\alpha_t(z)
        =
        \int \dotp{m(P_t(u))}{[\partial_t P_t](u)} \, \d\pi(u).$$

We now prove that this field transports the curve $(\alpha_t)_t$. The weak form of $\partial_t\alpha_t+\operatorname{div}(\alpha_t v_t)=0$ is that, for every smooth scalar test function $\varphi$, $$\label{eq-flow-matching-weak-target}
        \frac{\d}{\d t}\int\varphi(z)\,\d\alpha_t(z)
        -
        \int\dotp{v_t(z)}{\nabla\varphi(z)}\,\d\alpha_t(z)
        =0.$$ Using {eq}`eq-flow-matching-pushforward-test` and differentiating under the integral sign gives $$\label{eq-flow-matching-test-derivative}
        \frac{\d}{\d t}\int \varphi(z)\d\alpha_t(z)
        =
        \int \dotp{\nabla\varphi(P_t(u))}{[\partial_t P_t](u)}\d\pi(u).$$ On the other hand, applying {eq}`eq-v_t` with $m=\nabla\varphi$ gives $$\label{eq-flow-matching-velocity-test}
        \int\dotp{v_t(z)}{\nabla\varphi(z)}\,\d\alpha_t(z)
        =
        \int \dotp{\nabla\varphi(P_t(u))}{[\partial_t P_t](u)}\d\pi(u).$$ Comparing {eq}`eq-flow-matching-test-derivative` and {eq}`eq-flow-matching-velocity-test` yields {eq}`eq-flow-matching-weak-target`, which is the desired continuity equation.
:::

The conditional expectation in {eq}`eq-flow-match-conditional` has a simple measure-theoretic meaning. Let $\alpha_t=(P_t)_\sharp\pi$ and define the vector-valued measure $m_t$ on $\RR^d$ by $$\int_{\RR^d}\dotp{\psi(z)}{\d m_t(z)}
    \eqdef
    \int_{\RR^{d'}}\dotp{\psi(P_t(u))}{[\partial_tP_t](u)}\d\pi(u)$$ for every bounded continuous vector field $\psi$. Since $\alpha_t(A)=0$ implies $\pi(P_t^{-1}(A))=0$, one has $m_t\ll\alpha_t$. The Radon--Nikodym decomposition of $m_t$ with respect to $\alpha_t$ is therefore $$\d m_t(z)=v_t(z)\d\alpha_t(z),
    \qquad
    v_t=\frac{\d m_t}{\d\alpha_t}.$$ In the language of Lebesgue decomposition, the flux measure $m_t$ has only an absolutely continuous part with respect to $\alpha_t$ and no singular part; the conditional expectation is precisely this density. Equivalently, disintegrating $\pi$ with respect to the map $P_t$ gives $\pi(\d u)=\pi_{t,z}(\d u)\alpha_t(\d z)$, where $\pi_{t,z}$ is supported on the fiber $\{u\,:\,P_t(u)=z\}$, and $$v_t(z)=\int_{\{P_t(u)=z\}}[\partial_tP_t](u)\d\pi_{t,z}(u).$$ Thus the solution of {eq}`eq-flow-matching` is the conditional expectation of the velocities $\partial_t P_t$: intuitively, $v_t(z)$ is the average velocity of all trajectories passing through $z$. Numerically, $(x,t) \to v_t(x)$ can be parameterized by a neural network (e.g., a U-Net for vision tasks) and estimated using stochastic gradient descent on the objective in {eq}`eq-flow-matching`. For the exact field $v_t$, integrating the ODE $\dot{x}=v_t(x)$ defines a transport map $T_t$. If $v_t$ is regular enough, or more generally if the continuity equation has a unique solution for this velocity, then $(T_t)_\sharp\alpha_0=\alpha_t$. Thus the same interpolation as {eq}`eq-interp-coupling` is represented by a deterministic flow rather than by the original coupling. The sampling procedure consists in first drawing $X_0 \sim \alpha$, and then integrating the ODE $\dot{X}_t = v_t(X_t)$ starting with $X_{t=0} = X_0$. In the ideal exact-field limit, the resulting $X_{t=1}$ is distributed according to $\alpha_1 = \beta$.

(alg:flow-matching-regression)=
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
> **Update** $\theta$ by one stochastic-gradient step on $\norm{v_\theta(t_q,z_q)-w_q}^2.$
>

**Sampling:**

**Draw** $X_0\sim\alpha_0$.

**Integrate**
$\dot X_t=v_\theta(t,X_t), \qquad t\in[0,1].$
**Return** $X_1$.
:::

(rem-static-noise-stochastic-interpolants)=
<span id="rem-static-noise-stochastic-interpolants"></span>
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
<span id="rem-noisy-stochastic-interpolants"></span>
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

Thus the natural noisy analogue of {eq}`eq-flow-matching` regresses the instantaneous drift,

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

In the special case where $P_t(x,y)=(1-t)x+ty$ is a linear interpolation and $\pi = \alpha \otimes \beta$, the curve $\alpha_t$ is a convolution of rescaled versions of $\alpha_0$ and $\alpha_1$. The flow-matching problem {eq}`eq-flow-matching` becomes $$\min_{(v_t)_t} \int_{\RR^{d} \times \RR^d} \norm{v_t( (1-t)x+t y ) - (y-x) }^2 \, \d\alpha_0(x) \d\alpha_1(y).$$ When one endpoint is an isotropic Gaussian, this construction is closely related to the probability-flow formulation of diffusion models, up to the usual change of time parametrization {cite:p}`Song2021ScoreSDE`. This is why flow matching can be viewed both as a deterministic alternative to diffusion training and as a common language for diffusion paths, OT-inspired paths, and rectified paths {cite:p}`Lipman2022FlowMatching,Liu2023RectifiedFlow,Albergo2025StochasticInterpolants`. The next two propositions are written in the noising direction, from a data law $\alpha$ to a Gaussian; reversing time gives the corresponding sampling flow. They also give an explicit closed form for $v_t$ and show that it is a gradient field. In this setting, $v_t$ is also the solution of the constrained least-squares problem from the dynamic chapter. The regression {eq}`eq-flow-matching` is computationally simpler because the continuity equation has already been enforced by the chosen interpolant. To prove this, we rely on Tweedie's formula, which expresses the optimal Gaussian denoiser through the score, i.e. the gradient of the log-density.

(prop:Tweedie)=
:::{admonition} Proposition: Tweedie Identity
:class: important
Let $W$ be a random vector in $\RR^{d}$ with density $\beta$. For $\sigma>0$, observe $$Z \;=\; W + \sigma\,\varepsilon,
\quad\text{where } \varepsilon \sim \Gaussian(0,I_{d})
\text{ is independent of } W .$$ Denote by $$\beta_\sigma \;=\; \beta * \Gaussian\bigl(0,\sigma^{2}I_{d}\bigr)$$ the density of $Z$. Then $$\EE\bigl[\,W \mid Z=z\bigr]
      \;=\; z \;+\;\sigma^{2}\,\nabla \log \beta_\sigma(z)
\qquad\text{for all } z \in \RR^{d}.$$
:::

:::{dropdown} Proof
Bayes' rule gives the conditional density $p_{W|Z}(w\mid z)
= \dfrac{\beta(w)\,\varphi_\sigma(z-w)}{\beta_\sigma(z)}$ with $\varphi_\sigma$ the $\Gaussian(0,\sigma^{2}I_{d})$ density. Hence $$\EE[W\mid Z=z]
= \frac{1}{\beta_\sigma(z)}
      \int_{\RR^{d}} w\,
             \beta(w)\,\varphi_\sigma(z-w)\,\d w .$$ Differentiating the Gaussian convolution under the integral sign and using $\nabla_z\varphi_\sigma(z-w)
     = -\sigma^{-2}(z-w)\,\varphi_\sigma(z-w)$ yields $$\nabla_z\beta_\sigma(z)
= \int \beta(w)\,\nabla_z\varphi_\sigma(z-w)\,\d w
= -\sigma^{-2}\Bigl(z-\EE[W\mid Z=z]\Bigr)\,\beta_\sigma(z).$$ Rearranging finishes the proof.
:::

(prop:flow)=
:::{admonition} Proposition: Gaussian-Endpoint Flow-Matching Field
:class: important
Let $X\sim\alpha$ and $Y\sim\Gaussian(0,I_{d})$ be independent. For $t\in(0,1)$ set $$Z_t \;=\; (1-t)\,X + t\,Y,
\qquad
\alpha_t =\operatorname{Law}(Z_t).$$ The regression minimizer $v^\star:\RR^d\times(0,1)\to\RR^d$ of $$\min_{v}\;\int_{0}^{1}\!
         \iint_{\RR^{d}\times\RR^{d}}
              \bigl|y-x-v\bigl((1-t)x+t y,t\bigr)\bigr|^{2}\,
              \d\alpha(x)\,\d\Gaussian(y)\,\d t$$ is $$v^\star(x,t)
= -\frac{1}{1-t}\,x \;-\; \frac{t}{1-t}\,\nabla\log\alpha_t(x)
\qquad (x\in\RR^{d},\;t\in(0,1)).$$ In particular, for each $t\in(0,1)$ this field is a gradient field, $$v^\star(\cdot,t)=-\nabla
    \left(
        \frac{\norm{\cdot}^2}{2(1-t)}
        +\frac{t}{1-t}\log\alpha_t
    \right).$$
:::

:::{dropdown} Proof
Fix $t\in(0,1)$ and write $W=(1-t)X$, $\sigma=t$, so that $Z_t = W + \sigma\,Y$ matches the setting of Tweedie's identity. Conditional expectations satisfy $v^\star(z,t)
= \EE[Y-X\mid Z_t=z]
= \frac{1}{t}\,\EE[Z_t-W\mid Z_t=z]
  -\,\frac{1}{1-t}\,\EE[W\mid Z_t=z].$ Applying Tweedie's identity to $\EE[W\mid Z_t=z]$ and noting $\EE[Y\mid Z_t=z]
      = -\,t\,\nabla\log\alpha_t(z)$ gives the claimed formula.
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
:::{admonition} Proposition: Gaussian Flow Matching and Optimality
:class: important
Let $\Sigma_0,\Sigma_1\succ0$ and let $X_0\sim\Gaussian(0,\Sigma_0)$ and $X_1\sim\Gaussian(0,\Sigma_1)$ be independent. Consider the linear flow-matching interpolation $$Z_t=(1-t)X_0+tX_1,
        \qquad
        \alpha_t=\operatorname{Law}(Z_t)=\Gaussian(0,\Sigma_t),$$ where $$\label{eq-gaussian-product-fm-covariance}
        \Sigma_t=(1-t)^2\Sigma_0+t^2\Sigma_1.$$ Then the exact flow-matching velocity is affine, $v_t(z)=A_tz$, with $$\label{eq-gaussian-product-fm-velocity}
        A_t=\bigl(t\Sigma_1-(1-t)\Sigma_0\bigr)\Sigma_t^{-1}.$$ The induced flow map $T_t^{\rm FM}$ from $\alpha_0$ to $\alpha_t$ is $$\label{eq-gaussian-product-fm-map}
        T_t^{\rm FM}
        =
        \Sigma_0^{1/2}
        \Bigl((1-t)^2\Id+t^2\Sigma_0^{-1/2}\Sigma_1\Sigma_0^{-1/2}\Bigr)^{1/2}
        \Sigma_0^{-1/2}.$$ In particular, $$\label{eq-gaussian-product-fm-terminal-map}
        T_1^{\rm FM}
        =
        \Sigma_0^{1/2}
        \bigl(\Sigma_0^{-1/2}\Sigma_1\Sigma_0^{-1/2}\bigr)^{1/2}
        \Sigma_0^{-1/2}.$$ This terminal map coincides with the quadratic optimal transport map $$\label{eq-gaussian-brenier-map-comparison}
        T^{\rm OT}
        =
        \Sigma_0^{-1/2}
        \bigl(\Sigma_0^{1/2}\Sigma_1\Sigma_0^{1/2}\bigr)^{1/2}
        \Sigma_0^{-1/2}$$ if and only if $\Sigma_0\Sigma_1=\Sigma_1\Sigma_0$.
:::

:::{dropdown} Proof
The conditional-expectation formula gives $$v_t(z)=\EE[X_1-X_0\mid Z_t=z].$$ Since all variables are jointly Gaussian, this conditional expectation is linear and $$v_t(z)
        =
        \operatorname{Cov}(X_1-X_0,Z_t)\operatorname{Cov}(Z_t)^{-1}z
        =
        \bigl(t\Sigma_1-(1-t)\Sigma_0\bigr)\Sigma_t^{-1}z,$$ which proves {eq}`eq-gaussian-product-fm-velocity`. To solve the characteristic equation, whiten the source by setting $$C=\Sigma_0^{-1/2}\Sigma_1\Sigma_0^{-1/2},
        \qquad
        \widetilde Z_t=\Sigma_0^{-1/2}Z_t.$$ In these coordinates the source covariance is $\Id$ and $$\widetilde\Sigma_t=(1-t)^2\Id+t^2C.$$ Because $\Id$ and $C$ commute, the affine flow map in whitened coordinates is simply $\widetilde T_t=\widetilde\Sigma_t^{1/2}$. Indeed, $$\frac{\d}{\d t}\widetilde\Sigma_t^{1/2}
        =
        \bigl(tC-(1-t)\Id\bigr)\widetilde\Sigma_t^{-1/2},$$ which is exactly the equation $\dot{\widetilde T}_t=\widetilde A_t\widetilde T_t$ with $\widetilde T_0=\Id$. Returning to the original coordinates gives {eq}`eq-gaussian-product-fm-map`, and $t=1$ gives {eq}`eq-gaussian-product-fm-terminal-map`.

Both $T_1^{\rm FM}$ and $T^{\rm OT}$ push $\Gaussian(0,\Sigma_0)$ to $\Gaussian(0,\Sigma_1)$. The Brenier map between nondegenerate Gaussians is the unique symmetric positive definite linear map with this property. Hence $T_1^{\rm FM}=T^{\rm OT}$ if and only if $T_1^{\rm FM}$ is symmetric positive definite. The map $T_1^{\rm FM}$ is similar to $C^{1/2}$, so if it is symmetric then it is automatically positive definite. It remains to characterize symmetry. Since $C^{1/2}$ is symmetric positive definite, $$(T_1^{\rm FM})^\top
        =
        \Sigma_0^{-1/2}C^{1/2}\Sigma_0^{1/2}.$$ Thus symmetry of $T_1^{\rm FM}$ is equivalent to $\Sigma_0 C^{1/2}=C^{1/2}\Sigma_0$, hence to $\Sigma_0 C=C\Sigma_0$ by functional calculus. Multiplying this identity on the left and right by $\Sigma_0^{1/2}$ gives $\Sigma_0\Sigma_1=\Sigma_1\Sigma_0$. Conversely, if $\Sigma_0$ and $\Sigma_1$ commute, they are orthogonally co-diagonalizable, and both {eq}`eq-gaussian-product-fm-terminal-map` and {eq}`eq-gaussian-brenier-map-comparison` reduce in that basis to the diagonal map with entries $\sqrt{\lambda_{1,k}/\lambda_{0,k}}$. This proves the equivalence.
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

The same terminal map {eq}`eq-gaussian-product-fm-terminal-map` is obtained for any scalar schedule $Z_t=a_tX_0+b_tX_1$ with the same endpoints, because after whitening the covariance path remains $a_t^2\Id+b_t^2C$. Thus changing the speed of a scalar Gaussian bridge, for instance by using an OU schedule, cannot repair the non-optimality created by non-commuting covariances.

Commuting covariances reduce the terminal map to independent one-dimensional scalings, whereas non-commuting covariances create a non-symmetric affine map, hence a transport with a rotational or shearing component. More generally, mixture-like paths can create the same obstruction even when every instantaneous velocity looks natural. This distinction is closely related to counterexamples showing that flow maps associated with Fokker--Planck or diffusion-type evolutions do not in general provide optimal transport maps {cite:p}`LavenantSantambrogio2022FlowMap`. In particular, starting from an isotropic Gaussian does not by itself guarantee optimality once the target distribution is non-Gaussian; additional structural assumptions on the path or on the coupling are needed.
:::

(alg:gaussian-mixture-probability-flow-sampling)=
:::{admonition} Algorithm: Exact probability-flow sampling for a Gaussian mixture
:class: ot4ml-algorithm

**Input:** Gaussian-mixture data law, schedule $(a_t,b_t)$, noise level $\sigma$, number of samples $R$.

**Output:** Backward samples $(Z_0^{(r)})_r$.

**Define** the noising variable:
$Z_t=a_tX+b_tY, \qquad Y\sim\Gaussian(0,\sigma^2\Id).$

**Compute** closed-form mixture density $p_t$ and score $s_t=\nabla\log p_t$.

**Set** probability-flow velocity:
$v_t(z)=\frac{a'_t}{a_t}z+ \left(\frac{a'_tb_t^2}{a_t}-b'_tb_t\right)\sigma^2s_t(z).$

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

### Training a one-step flow.

Let $\zeta$ be a simple latent distribution and let $\alpha_\theta=(G_\theta)_\sharp\zeta$ be the model distribution. Assume that the target data distribution is $\beta$. A Wasserstein-flow construction chooses a discrepancy $$\mathcal E_\beta(\alpha),$$ for instance a smoothed $\KL(\alpha|\beta)$, an MMD/IPM loss, or the debiased Sinkhorn divergence $\bar\MK_c^\epsilon(\alpha,\beta)$ introduced in the Sinkhorn divergence section. The associated formal descent is $$\label{eq-one-step-wgf}
    \partial_t\mu_t+\operatorname{div}(\mu_t w_t)=0,
    \qquad
    w_t(x)=-\nabla\delta_\alpha \mathcal E_\beta(\mu_t)(x).$$ Instead of integrating {eq}`eq-one-step-wgf` at inference time, one fits a parametric residual field $U_\eta$ along the current model distribution: $$\label{eq-one-step-l2-fit}
    \min_\eta \int_0^1\!\int
        \norm{U_\eta(t,x)-w_t(x)}^2
        \,\d\mu_t(x)\,\d t.$$ In a particle or generator implementation, the learned residual is then used to update the current generator by $$\alpha_{\theta}^{+}
    =
    (\Id+\tau U_\eta)_\sharp \alpha_\theta,
    \qquad\text{or equivalently}\qquad
    G_\theta^{+}(z)=G_\theta(z)+\tau U_\eta(G_\theta(z)).$$ After many training updates, the accumulated generator is evaluated once at test time. This is the organizing principle behind recent one-step methods based on Wasserstein gradient flows: W-Flow uses such a construction with the Sinkhorn divergence as a tractable global discrepancy {cite:p}`Han2026WFlow`, while drifting methods evolve the generated distribution during training through a fitted vector field and also admit one-step inference {cite:p}`Deng2026Drifting`. The gradient-flow interpretation of drifting models, and its relation to KL, MMD, sliced-Wasserstein and Sinkhorn-type discrepancies, is analyzed in {cite:p}`Gretton2026DriftingWGF,He2026SinkhornDrifting`. These ideas are also connected to the Sinkhorn-type normalization dynamics used to model attention in Sinkformers {cite:p}`Sander2022Sinkformers`.

### Self-corrected drifting fields.

Drifting methods need not start from an exact Wasserstein gradient. They often prescribe an attraction-minus-repulsion field and then regress this field in $L^2(\mu_t)$. A simple continuous version uses a positive kernel $K_\epsilon(x,y)$ and defines, for any measure $\nu$, $$\label{eq-normalized-kernel-drift}
    B_\epsilon[\nu](x)
    \eqdef
    \frac{\int (y-x)K_\epsilon(x,y)\,\d\nu(y)}
         {\int K_\epsilon(x,y)\,\d\nu(y)}.$$ For the Gaussian kernel $K_\epsilon(x,y)=\exp(-\norm{x-y}^2/(2\epsilon))$, this normalized field is a score of a smoothed density: $$\label{eq-normalized-kernel-score}
    B_\epsilon[\nu](x)
    =
    \epsilon\nabla\log\!\left(\int K_\epsilon(x,y)\,\d\nu(y)\right).$$ The drifting velocity is then $$\label{eq-cross-minus-self-drift}
    u_t(x)=B_\epsilon[\beta](x)-B_\epsilon[\mu_t](x)
    =
    \epsilon\nabla\log
    \frac{\int K_\epsilon(x,y)\,\d\beta(y)}
         {\int K_\epsilon(x,y)\,\d\mu_t(y)}.$$ The first term pulls samples toward data, while the second term corrects self-attraction and prevents all particles from collapsing onto the same high-density region. For a fixed reference measure, $B_\epsilon[\nu]$ is precisely the Gaussian mean-shift displacement in {eq}`eq-l2-attention-mean-shift`: it moves $x$ toward the local kernel barycenter of $\nu$. Hence self-corrected drifting can be read as the difference between a target mean-shift field and the current model's own mean-shift field. Sinkhorn drifting replaces these one-sided kernel normalizations by two-sided entropic OT couplings, so that the cross and self terms are normalized by Sinkhorn scaling rather than by a single denominator {cite:p}`He2026SinkhornDrifting`.

(fig:generative-drifting-model-trajectories)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("generative-drifting-model-trajectories", width=760)
```

Drifting trajectories for a small particle generator. The raw kernel drift has weak long-range attraction and can leave particles away from the data modes. The self-corrected field uses the difference $B_\epsilon[\beta]-B_\epsilon[\mu_t]$, so a longer integration brings particles to the blue modes while repelling them from their own current concentration.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the drift and time controls to inspect a learned-looking velocity field and its induced particle trajectories.
:::


<iframe class="ot4ml-live-frame" title="Drifting field controls" src="../live/generative-drifting.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>


(prop-drifting-semi-relaxed-gradient)=
<span id="prop-drifting-semi-relaxed-gradient"></span>
:::{admonition} Proposition: Drifting as a Time-Dependent Wasserstein Gradient
:class: important
Let $\mu_t$ be a smooth curve of positive densities and let $u_t=\nabla\phi_t$ be a smooth time-dependent gradient field. Define the semi-relaxed functional $$\label{eq-semi-relaxed-drift-functional}
        \mathcal R_t(\alpha|\mu_t)
        \eqdef
        -\int \phi_t(x)\,\d\alpha(x)
        +\int \phi_t(x)\,\d\mu_t(x).$$ Here $\mu_t$ and $\phi_t$ are frozen when taking the first variation with respect to the first argument $\alpha$. Then the continuity equation $$\partial_t\mu_t+\operatorname{div}(\mu_t u_t)=0$$ is the formal Wasserstein gradient descent of the time-dependent functional $\alpha\mapsto\mathcal R_t(\alpha|\mu_t)$.
:::

:::{dropdown} Proof
Since $\mu_t$ and $\phi_t$ are fixed in the variation with respect to $\alpha$, the first variation is $$\delta_\alpha \mathcal R_t(\alpha|\mu_t)(x)=-\phi_t(x).$$ By the Wasserstein-gradient formula, $$\Wgrad \mathcal R_t(\alpha|\mu_t)
        =
        \nabla\delta_\alpha \mathcal R_t(\alpha|\mu_t)
        =
        -\nabla\phi_t
        =
        -u_t.$$ The Wasserstein gradient-descent velocity is the negative of this gradient, namely $u_t$. Substituting this velocity in the continuity equation gives the claimed flow.
:::

(alg:one-step-wgf-generator-update)=
:::{admonition} Algorithm: One-step Wasserstein-flow generator update
:class: ot4ml-algorithm

**Input:** Generator $G_{\theta_k}$, latent law $\zeta$, data law $\beta$, numerical descent-field oracle $W_\beta$, step size $\tau$, batch size $B$.

**Output:** Updated generator $G_{\theta_{k+1}}$.

**Draw** $z_b\sim\zeta$ for $b=1,\ldots,B$.

**Set** $x_b=G_{\theta_k}(z_b)$.

**Set** $w_k(x)=W_\beta[\alpha_{\theta_k}](x)$, where $W_\beta[\alpha]=-\nabla\delta_\alpha\mathcal E_\beta(\alpha)$.

**Set** $\eta_k$ by minimizing the empirical least-squares loss:
$\frac1B\sum_{b=1}^B \norm{U_{\eta}(x_b)-w_k(x_b)}^2.$

**Update by composition:**
$G_{\theta_{k+1}}(z) = G_{\theta_k}(z)+\tau U_{\eta_k}(G_{\theta_k}(z)).$
**Return** $G_{\theta_{k+1}}$.
:::

(alg:self-corrected-drifting-particles)=
:::{admonition} Algorithm: Self-corrected drifting particle update
:class: ot4ml-algorithm

**Input:** Particles $x_i^k$ for $\mu_k$, data samples $(y_b)_{b=1}^B$ from $\beta$, kernel scale $\epsilon$, step $h$.

**Output:** Updated particles $x_i^{k+1}$.

**For** each particle $i$ **do**:

>
> **Set** $Z_{\beta,i}=\sum_{b=1}^B K_\epsilon(x_i^k,y_b)$ and $b_i^k=Z_{\beta,i}^{-1}\sum_{b=1}^B (y_b-x_i^k)K_\epsilon(x_i^k,y_b)$.
>
> **Set** $Z_{\mu,i}=\sum_{j=1}^n K_\epsilon(x_i^k,x_j^k)$ and $m_i^k=Z_{\mu,i}^{-1}\sum_{j=1}^n (x_j^k-x_i^k)K_\epsilon(x_i^k,x_j^k)$.
>
> **Set**
> $u_i^k=b_i^k-m_i^k.$
>
> **Update**
> $x_i^{k+1}=x_i^k+h\,u_i^k.$

**Return** $(x_i^{k+1})_i$.
:::


:::{admonition} Example: Kernel drifting as a semi-relaxed divergence
:class: ot4ml-example

For the Gaussian-kernel drift {eq}`eq-cross-minus-self-drift`, set

```{math}
\phi_t(x)=
\epsilon\log
\frac{\int K_\epsilon(x,y)\,\d\beta(y)}
     {\int K_\epsilon(x,y)\,\d\mu_t(y)}.
```

Then $u_t=\nabla\phi_t$, so Proposition {ref}`prop-drifting-semi-relaxed-gradient` shows that kernel drifting is the Wasserstein gradient descent of

```{math}
\mathcal R_t^{\mathrm{drift}}(\alpha|\mu_t)
=
\epsilon
\int
\log
\frac{\int K_\epsilon(x,y)\,\d\mu_t(y)}
     {\int K_\epsilon(x,y)\,\d\beta(y)}
\,\d\alpha(x)
+\mathrm{constant}.
```

It is "semi-relaxed" because the current model $\mu_t$ is used to build the potential, but it is not varied inside the denominator when computing the first variation in $\alpha$.
:::


:::{admonition} Remark: General fields and projection onto gradients
:class: ot4ml-remark

A general regressed field $b_t$ is not necessarily a Wasserstein gradient, since Wasserstein tangent vectors are represented by gradient fields modulo $L^2(\mu_t)$-null directions. The gradient component is obtained by the weighted projection

```{math}
\nabla\phi_t
=
\uargmin{\nabla\phi}
\int \norm{\nabla\phi(x)-b_t(x)}^2\,\d\mu_t(x).
```

One may first normalize $b_t$ pointwise, for instance by $b_t/(\norm{b_t}+\eta)$, or globally by $\norm{b_t}_{L^2(\mu_t)}$, before this projection. Proposition {ref}`prop-drifting-semi-relaxed-gradient` then applies to the projected field. Non-gradient components can still be useful in a parametric model, but they are not descent directions of a scalar functional for the $\Wass_2$ Riemannian metric.
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
\rho_u \eqdef Z_u^{-1}e^{-u(x)}\,\d x .
```

Whenever $\nabla u$ is defined $\rho_u$-almost everywhere, the moment measure of $u$ is

```{math}
\mathfrak M(u)\eqdef(\nabla u)_\sharp \rho_u .
```
:::

The normalization removes additive constants in $u$. Translations of the argument are another invariance: if $u_a(x)=u(x-a)$, then $\rho_{u_a}$ is the translate of $\rho_u$, while $\nabla u_a(x)=\nabla u(x-a)$, hence $\mathfrak M(u_a)=\mathfrak M(u)$. A first obstruction is immediate. Formally, if $u$ is smooth and $e^{-u}$ decays fast enough for the boundary term to vanish, then

```{math}
\int y\,\d\mathfrak M(u)(y)
=
Z_u^{-1}\int \nabla u(x)e^{-u(x)}\,\d x
=
-Z_u^{-1}\int \nabla(e^{-u(x)})\,\d x
=0.
```

Thus moment measures are necessarily centered. The non-smooth theory uses essentially continuous convex functions, meaning convex functions whose restriction to the closure of their effective domain is continuous except possibly on a boundary set of zero $\mathcal H^{d-1}$ measure.

Figure {ref}`fig:moment-measure-forward-map` shows the forward construction in one dimension. Even before solving the inverse problem, one sees the two coupled effects of the same convex potential: $e^{-u}$ chooses the source law, while $u'$ transports it to the moment measure.

(fig:moment-measure-forward-map)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("moment-measure-forward-map", width=760)
```

*Forward moment-measure construction in one dimension. The top row uses $u(x)=x^2/2$, so $\rho_u$ and $\mathfrak M(u)$ are both standard Gaussian and $u'(x)=x$. The bottom row uses $u(x)=x^2/2+0.18\,x^4/4+0.92\,x$, which tilts the log-concave source and produces a nonlinear monotone map. In both cases the blue push-forward has barycenter zero, illustrating the identity $\int y\,\d\mathfrak M(u)(y)=0$.*
:::

(thm-moment-measure-characterization)=
:::{admonition} Theorem: Cordero--Erausquin--Klartag
:class: important

Let $\mu\in\Pp_1(\RR^d)$ be a probability measure. There exists an essentially continuous convex function $u$ such that $\mu=\mathfrak M(u)$ if and only if

```{math}
\int y\,\d\mu(y)=0
\qquad\text{and}\qquad
\supp(\mu)\text{ is not contained in a hyperplane.}
```

Under these conditions, $u$ is unique up to translations of the argument and additive constants.
:::

This theorem is due to Cordero--Erausquin and Klartag {cite:p}`CorderoErausquinKlartag2015MomentMeasures`. It is a functional analogue of a Minkowski-type problem: the target measure prescribes how the gradient image of a log-concave density should be distributed. The hyperplane condition is the natural non-degeneracy assumption; otherwise the prescribed gradient image lives in a lower-dimensional affine direction and no coercive full-dimensional convex potential can be recovered.

(ex-moment-measure-gaussian)=
:::{admonition} Example: Quadratic potentials
:class: ot4ml-example

Let $A\in\RR^{d\times d}$ be symmetric positive definite and

```{math}
u(x)=\frac12 x^\top A x + c .
```

Then $\rho_u=\Nn(0,A^{-1})$ and $\nabla u(x)=Ax$, so

```{math}
\mathfrak M(u)=\Nn(0,A).
```

Thus centered non-degenerate Gaussians are moment measures. This example also shows the self-dual flavor of the construction: the covariance of the log-concave source is inverted by the linear gradient map.
:::


### Optimal-transport variational formulation.

Santambrogio {cite:p}`Santambrogio2015MomentMeasures` reformulates the moment-measure problem as a minimization over probability densities. For a centered $\mu\in\Pp_1(\RR^d)$, define the maximal-correlation transport functional, with values in $\RR\cup\{+\infty\}$,

```{math}
:label: eq-moment-max-correlation
\mathcal C_\mu(\rho)
\eqdef
\sup_{\pi\in\Couplings(\rho,\mu)}
\int_{\RR^d\times\RR^d} x\cdot y\,\d\pi(x,y).
```

By Kantorovich duality for the scalar-product cost,

```{math}
:label: eq-moment-max-correlation-dual
\mathcal C_\mu(\rho)
=
\inf_{v\ \mathrm{convex}}
\left\{
\int v(x)\,\d\rho(x)+\int v^*(y)\,\d\mu(y)
\right\},
```

where $v^*$ is the Legendre transform. If $\rho,\mu\in\Pp_2(\RR^d)$, then

```{math}
:label: eq-moment-correlation-w2
\mathcal C_\mu(\rho)
=
\frac12\int \norm{x}^2\,\d\rho(x)
+
\frac12\int \norm{y}^2\,\d\mu(y)
-
\frac12\Wass_2^2(\rho,\mu).
```

The variational problem attached to a centered target $\mu$ is

```{math}
:label: eq-moment-measure-variational
\min_{\rho\in\Pp_1(\RR^d)}
\left\{
\mathcal H(\rho)+\mathcal C_\mu(\rho)
\right\},
\qquad
\mathcal H(r\,\d x)\eqdef \int r(x)\log r(x)\,\d x,
```

with $\mathcal H(\rho)=+\infty$ when $\rho$ is not absolutely continuous.
The centering of $\mu$ makes this functional invariant under translations of $\rho$, since translating $\rho$ by a vector $a$ changes $\int x\cdot y\,\d\pi$ by $a\cdot\int y\,\d\mu(y)=0$.

(prop-moment-hidden-convexity)=
:::{admonition} Proposition: Variational characterization of moment measures
:class: important

Let $\mu\in\Pp_1(\RR^d)$ be centered and not supported on a hyperplane. Then the minimization problem {eq}`eq-moment-measure-variational` admits a solution, unique up to translations. Every minimizer is a log-concave density of the form

```{math}
\rho=Z_u^{-1}e^{-u}\,\d x,
```

where $u$ is convex, essentially continuous, and satisfies the moment-measure equation

```{math}
\mu=(\nabla u)_\sharp \rho .
```

Conversely, any essentially continuous convex $u$ satisfying this equation yields a global minimizer. In the finite-second-moment case $\mu\in\Pp_2(\RR^d)$, the objective $\rho\mapsto\mathcal H(\rho)+\mathcal C_\mu(\rho)$ is displacement convex along $\Wass_2$ geodesics on $\Pp_2(\RR^d)$ whenever the terms are finite. For general $\mu\in\Pp_1(\RR^d)$, the same statement is obtained by approximation and lower semicontinuity.
:::

:::{dropdown} Proof
The existence proof has two ingredients. First, since $\mu$ is centered, translating $\rho$ does not change either $\mathcal H(\rho)$ or $\mathcal C_\mu(\rho)$, so one can center a minimizing sequence. Second, the assumption that $\mu$ is not supported on a hyperplane gives a coercive lower bound of the form $\mathcal C_\mu(\rho)\geq c_\mu\int\norm{x}\,\d\rho(x)$ for centered absolutely continuous $\rho$, with $c_\mu>0$. Together with the lower semicontinuity estimates for entropy and maximal correlation, this yields a minimizer {cite:p}`Santambrogio2015MomentMeasures`.

Let $\rho=r\,\d x$ be a minimizer and let $u$ be a convex optimizer in the dual formula {eq}`eq-moment-max-correlation-dual`. Keeping $u$ fixed and varying $\rho$ in {eq}`eq-moment-measure-variational` gives the Euler equation

```{math}
\log r(x)+1+u(x)=\mathrm{constant}
\qquad\text{on }\{r>0\},
```

so $\rho=Z_u^{-1}e^{-u}\d x$. The optimality condition for the scalar-product transport problem says that an optimal coupling is supported on $\{(x,y):y\in\partial u(x)\}$. Since $\rho$ is absolutely continuous and $u$ is convex, $\partial u(x)=\{\nabla u(x)\}$ for $\rho$-almost every $x$, hence $\mu=(\nabla u)_\sharp\rho$.

Conversely, assume $\rho=Z_u^{-1}e^{-u}\d x$ and $\mu=(\nabla u)_\sharp\rho$. Let $\nu$ be a smooth compactly supported competitor, and let $T$ be the Brenier map from $\rho$ to $\nu$. Along the geodesic $\rho_t=((1-t)\Id+tT)_\sharp\rho$, the right derivative of the entropy at $t=0$ is

```{math}
\frac{\d}{\d t}\mathcal H(\rho_t)\Big|_{t=0^+}
=
-\int \dotp{T(x)-x}{\nabla u(x)}\,\d\rho(x),
```

where the identity follows by differentiating the Jacobian formula and integrating by parts. Santambrogio's derivative estimate for the maximal-correlation functional gives

```{math}
\frac{\d}{\d t}\mathcal C_\mu(\rho_t)\Big|_{t=0^+}
\geq
\int \dotp{T(x)-x}{\nabla u(x)}\,\d\rho(x),
```

because $(\Id,\nabla u)_\sharp\rho$ is optimal for the scalar-product problem. The first-order terms cancel, hence the one-sided derivative of $\mathcal H+\mathcal C_\mu$ at $\rho$ in every such direction is nonnegative. Displacement convexity then implies global minimality, and approximation removes the smooth compact-support restriction. Strict displacement convexity of entropy gives uniqueness, except for translations; translations do not change $\mathcal C_\mu$ because $\mu$ is centered.

It remains to justify the convexity assertion. The entropy term is displacement convex by McCann's theorem. If $\mu$ has finite second moment, identity {eq}`eq-moment-correlation-w2` writes $\mathcal C_\mu$ as the sum of the $1$-convex moment term $\rho\mapsto\frac12\int\norm{x}^2\,\d\rho$ and the $(-1)$-convex term $\rho\mapsto-\frac12\Wass_2^2(\rho,\mu)$, hence $\mathcal C_\mu$ is displacement convex. For merely finite first moment $\mu$, the same convexity and the variational characterization follow by the approximation and semicontinuity arguments of Santambrogio.
:::

(rem-moment-hidden-convexity)=
:::{admonition} Remark: Where the convexity is hidden
:class: ot4ml-remark

If one eliminates $\rho$ first, the problem becomes the convex-potential functional

```{math}
u\mapsto
\int u^*(y)\,\d\mu(y)
-
\log\!\left(\int e^{-u(x)}\,\d x\right).
```

This is not visibly convex as a function of $u$: the first term is convex, while the logarithmic partition term is concave in this parametrization. Cordero--Erausquin and Klartag reveal convexity after passing to the dual potential $u^*$ and using a Prekopa-type argument. Santambrogio's formulation reveals the same mechanism in transport language: the difficult convexity becomes the displacement convexity of an entropy-plus-maximal-correlation functional in the density variable $\rho$.
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


## Evolution in Depth of Transformers

Deep residual architectures can be read as time discretizations of ODEs or PDEs. For transformers, the transported objects are token measures and the velocity is induced by attention.

Transformers were introduced as sequence-to-sequence architectures driven by self-attention {cite:p}`Vaswani2017Attention` and have since become a central architecture for language and vision models {cite:p}`Brown2020LanguageModels,Dosovitskiy2021Image`. Their distinctive feature is that each token is updated by a data-dependent average of all other tokens. This makes an attention layer permutation-equivariant before positional encoding, context dependent after conditioning on the input sequence, and naturally compatible with a measure viewpoint in which a prompt is regarded as an empirical distribution of tokens.

The mathematical limit used below concerns depth rather than model scale: one lets the number of residual attention layers grow while each layer makes a small update, as in continuous-depth neural networks {cite:p}`Chen2018NeuralODE`. For attention, the resulting velocity is nonlinear in the current token law because it is normalized by the whole context. This measure-theoretic view appears in the analysis of attention as a Lipschitz or interacting-particle operator {cite:p}`Vuckovic2020MathematicalAttention,Geshkovski2023MathematicalPerspective`, in the Sinkhorn-normalized dynamics of Sinkformers {cite:p}`Sander2022Sinkformers`, and in recent well-posedness and mean-field-limit results for several attention mechanisms {cite:p}`Castin2025DynamicsTransformers`. It also separates the infinite-depth limit studied here from the token-limit question, where one controls how a finite empirical context approximates its limiting attention operator {cite:p}`Bohbot2025TokenSampleComplexity`.

We now consider very deep transformers, focusing on a single-head attention mechanism for simplicity while ignoring MLP layers, layer normalization, causality, and masking. This stripped-down framework is best suited to modeling encoders and vision transformers; the references above indicate which parts of this simplified picture extend to richer attention mechanisms.

### Attention as a context-dependent velocity.

After tokenization, embedding, and positional encoding, each input (from a set of tokens) is represented as a point cloud $(x_i)_{i=1}^n$ of $n$ points in the space of vectorized tokens. An attention layer with skip connection and rescaling by $1/T$ (where $T$ is the depth) defines a transformation of the tokens: $$x_i \mapsto x_i + \frac{1}{T} \sum_j \frac{e^{\langle Q x_i, K x_j \rangle} V x_j}{\sum_{\ell} e^{\langle Q x_i, K x_\ell \rangle}},$$ where $\theta = (K, Q, V)$ are the parameters of the attention layer, represented by three matrices.

### Token measure evolution.

To handle an arbitrary number of tokens, we define $\alpha = \frac{1}{n} \sum_i \delta_{x_i}$ as the empirical measure of tokens and rewrite the transformer mapping as: $$x_i \mapsto x_i + \frac{1}{T} \Gamma_\theta[\alpha](x_i),$$ where $$\Gamma_\theta[\alpha](x) :=
    \frac{\int e^{\langle Q x, K y \rangle} V y \, \d \alpha(y)}
    {\int e^{\langle Q x, K z \rangle} \, \d \alpha(z)}.$$ At the level of the token distribution, the layer pushes $\alpha$ forward by the "in-context" mapping $\Gamma_{\theta_t}[\alpha]$, which depends on the context $\alpha$, the tokens, and the depth-dependent parameters $\theta_t$. Denoting $t \in [0, 1]$ as the depth and $\tau = 1/T$ as the step size, this gives: $$\alpha_{t+\tau} = (\Id + \tau \Gamma_{\theta_t}[\alpha_t])_\sharp \alpha_t.$$ As $\tau \to 0$, this converges formally to the conservation equation $$\partial_t \alpha_t + \operatorname{div}(\alpha_t \Gamma_{\theta_t}[\alpha_t]) = 0.$$


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
    \Gamma_\theta[\alpha](x).$$ This is an instantaneous gradient in $x$. It is not, however, the gradient of the first variation of a fixed functional of $\alpha$, because the potential $U_\alpha$ itself depends on the current measure through the same attention normalization. Thus the PDE is generally a transportation dynamics, not a Wasserstein gradient flow. Special variants recover additional structure: Sinkhorn attention can be interpreted through doubly stochastic normalization and Wasserstein-type gradient flows {cite:p}`Sander2022Sinkformers,Castin2025DynamicsTransformers`, while layer normalization leads naturally to dynamics on the sphere and to modified metrics. The key open difficulty for the present viewpoint is training: after the architecture has been rewritten as a controlled transport equation, learning corresponds to optimizing the time-dependent parameters $(\theta_t)_t$ rather than merely analyzing the forward PDE for fixed parameters.

(alg:residual-attention-depth-evolution)=
:::{admonition} Algorithm: Residual attention depth evolution
:class: ot4ml-algorithm

**Input:** Tokens $(x_i^0)_{i=1}^n$, depth $T$, layer parameters $(Q_k,K_k,V_k)$.

**Output:** Final token measure $\alpha_T$.

**Initialize:**
$\alpha_0=\frac1n\sum_{i=1}^n\delta_{x_i^0}, \qquad \tau=1/T.$

**For** $k=0,\ldots,T-1$ **do**:

>
> **For** $i=1,\ldots,n$ **do**

>> $\Gamma_{\theta_k}[\alpha_k](x_i^k) = \frac{\sum_j \exp(\dotp{Q_kx_i^k}{K_kx_j^k})\,V_kx_j^k} {\sum_j \exp(\dotp{Q_kx_i^k}{K_kx_j^k})}.$
>>
>> $x_i^{k+1}=x_i^k+\tau\,\Gamma_{\theta_k}[\alpha_k](x_i^k).$

> **Set**
> $\alpha_{k+1}=(\Id+\tau\Gamma_{\theta_k}[\alpha_k])_\sharp\alpha_k.$

**Return** $\alpha_T$.
:::


## Flows over the Gaussian Manifold

Gaussian measures provide a useful testing ground for the preceding dynamics. They are not invariant under a general Wasserstein gradient flow: a nonlinear velocity usually creates non-Gaussian densities immediately. The useful substitute is to either identify affine velocities, which exactly preserve Gaussianity, or to project the dynamics onto the Gaussian manifold. In both cases the measure PDE reduces to matrix ODEs for the mean and covariance. This viewpoint is emphasized in the survey {cite:p}`Peyre2026OptimalDiffusionTransports` and is useful for comparing diffusion paths, Wasserstein gradient flows, drifting fields and transformer-type dynamics.

For constrained gradient flows on this family, the covariance equation is the finite-dimensional Bures--Wasserstein gradient flow on positive definite matrices. Thus Gaussian closure is not just a computational shortcut: it is the restriction of Wasserstein geometry to the Gaussian submanifold, where affine gradient fields encode tangent vectors.

(fig:gradflow-gaussian-closure)=
:::{div}
:class: ot4ml-book-figure

```{code-cell} ipython3
:tags: [remove-input]
show_book_figure("gradflow-gaussian-closure", width=760)
```

Gaussian closures of transport dynamics between two overlapping anisotropic Gaussians. The left panel is the exact $\Wass_2$ Gaussian geodesic. The middle panel shows a regularized Sinkhorn-style closure with inflated intermediate covariances. The right panel shows a drifting-style closure with a curved mean path and moment-matched covariance ellipses.
:::

:::{div}
:class: ot4ml-interactive-note
**Interactive panel.** Use the anisotropy, angle, regularization, and drift controls to compare Gaussian closures of Wasserstein, Sinkhorn, and drifting dynamics.
:::


<iframe class="ot4ml-live-frame" title="Gaussian closure controls" src="../live/generative-gaussian-closure.html" loading="lazy" style="width:100%;height:500px;border:0;display:block;"></iframe>


### Gaussianity preservation.

The first question is invariance: one wants a simple criterion ensuring that the continuity equation does not leave the finite-dimensional Gaussian family.

(prop-gaussian-affine-closure)=
<span id="prop-gaussian-affine-closure"></span>
:::{admonition} Proposition: Affine Velocities Preserve Gaussianity
:class: important
Let $\alpha_t=\Gaussian(\mean_t,\cov_t)$, with $\cov_t$ positive definite, solve the continuity equation with an affine velocity $$v_t(x)=b_t+A_t(x-\mean_t).$$ Then $\alpha_t$ remains Gaussian and its moments solve $$\dot \mean_t=b_t,
        \qquad
        \dot\cov_t=A_t\cov_t+\cov_t A_t^\top .$$ Conversely, any smooth Gaussian curve with positive definite covariance can be generated by such an affine velocity. If one wants the velocity to be a Wasserstein tangent gradient, one chooses the unique symmetric solution of the Lyapunov equation $$A_t\cov_t+\cov_t A_t=\dot\cov_t.$$
:::

:::{dropdown} Proof
Let $X_t$ follow the characteristic ODE $\dot X_t=b_t+A_t(X_t-\mean_t)$. This linear ODE maps Gaussian random variables to Gaussian random variables. Taking expectation gives $\dot\mean_t=b_t$. Writing $\tilde X_t=X_t-\mean_t$, one has $\dot{\tilde X}_t=A_t\tilde X_t$, hence $$\dot\cov_t
        =
        \frac{\d}{\d t}\EE(\tilde X_t\tilde X_t^\top)
        =
        A_t\cov_t+\cov_t A_t^\top .$$ For the converse, set $b_t=\dot\mean_t$ and choose any matrix $A_t$ satisfying the covariance equation. Since $\cov_t$ is positive definite, the Lyapunov map $A\mapsto A\cov_t+\cov_t A$ is invertible on symmetric matrices, which gives the unique symmetric choice when a gradient velocity is required. In that case $v_t$ is the gradient of the quadratic potential $x\mapsto \dotp{b_t}{x}+\dotp{A_t(x-\mean_t)}{x-\mean_t}/2$.
:::

### Constrained evolution on the Gaussian manifold.

For non-affine velocities, the finite-dimensional substitute is to project the Wasserstein dynamics onto the Gaussian manifold.

Let $$\mathcal G=\{\Gaussian(\mean,\cov):\mean\in\RR^d,\ \cov\succ0\}$$ be the Gaussian submanifold of $\Pp_2(\RR^d)$. The Wasserstein gradient of a functional constrained to a smooth submanifold $\mathcal M\subset\Pp_2$ is defined as the Riesz representative of the differential restricted to tangent velocities of $\mathcal M$. Equivalently, it is the small-step limit of the constrained JKO scheme $$\alpha^{k+1}\in
    \argmin_{\alpha\in\mathcal M}
    \frac{1}{2\tau}\Wass_2^2(\alpha,\alpha^k)+f(\alpha).$$ For $\mathcal M=\mathcal G$, tangent velocities are affine gradient fields $v(x)=b+A(x-\mean)$ with $A=A^\top$. The constrained gradient is therefore the $L^2(\Gaussian(\mean,\cov))$ projection of the ambient Wasserstein gradient onto this finite-dimensional affine space, whenever the ambient gradient exists.

(prop-gaussian-gradient-bullet-list)=
<span id="prop-gaussian-gradient-bullet-list"></span>
:::{admonition} Proposition: Gaussian-Constrained Wasserstein Gradients
:class: important
Let $f$ be a smooth functional and assume that its restriction to nondegenerate Gaussian measures can be written as $$f(\Gaussian(\mean,\cov))=F(\mean,\cov).$$ Then the Wasserstein gradient constrained to the Gaussian family is the affine vector field $$v_F(x)
        =
        \nabla_\mean F(\mean,\cov)
        +
        2\nabla_\cov F(\mean,\cov)(x-\mean),$$ where $\nabla_\cov F$ denotes the symmetric matrix derivative. Equivalently, $v_F$ is the $L^2(\Gaussian(\mean,\cov))$ projection of the ambient Wasserstein gradient onto affine gradient fields, whenever the ambient gradient exists. Hence the gradient descent flow constrained to Gaussian measures satisfies $$\label{eq-gaussian-wgf-closure}
        \dot\mean_t=-\nabla_\mean F(\mean_t,\cov_t),
        \qquad
        \dot\cov_t=-2\bigl(\cov_t\nabla_\cov F(\mean_t,\cov_t)+\nabla_\cov F(\mean_t,\cov_t)\cov_t\bigr),$$ and the descent velocity is affine.
:::

:::{dropdown} Proof
Test the functional along a Gaussian tangent vector, represented by an affine gradient field $$v(x)=b+A(x-\mean)$$ with $A$ symmetric. The induced first-order variations are $\dot\mean=b$ and $\dot\cov=A\cov+\cov A$. Therefore $$\d F(\mean,\cov)[b,A\cov+\cov A]
        =
        \dotp{\nabla_\mean F}{b}
        +
        \mathrm{tr}\!\left(\nabla_\cov F(A\cov+\cov A)\right).$$ Since $A$, $\cov$ and $\nabla_\cov F$ are symmetric, the second term equals $$2\,\mathrm{tr}(\nabla_\cov F\,A\cov)
        =
        \int \dotp{2\nabla_\cov F(x-\mean)}{A(x-\mean)}\d\Gaussian(\mean,\cov)(x).$$ Together with the mean term, this gives $$\d F(\mean,\cov)[\dot\mean,\dot\cov]
        =
        \int \dotp{v_F(x)}{v(x)}\d\Gaussian(\mean,\cov)(x)$$ for all affine gradient fields $v$. This identifies the constrained Wasserstein gradient in the induced $L^2(\alpha)$ metric, or equivalently the projection of the ambient gradient when it exists. Substituting the descent velocity $-v_F$ in the affine-velocity moment equations gives {eq}`eq-gaussian-wgf-closure`.
:::

This proposition should be read as the organizing rule for Gaussian closures: once the scalar energy has been reduced to a function of $(\mean,\cov)$, its constrained Wasserstein gradient is automatically affine and the covariance follows the Bures-type ODE {eq}`eq-gaussian-wgf-closure`. When the first variation of $f$ is quadratic, this constrained gradient coincides with the full Wasserstein gradient.

### Gaussian-preserving gradient flows.

The next examples show that many familiar energies already have affine Wasserstein gradients on Gaussian inputs, so their full flow remains inside the Gaussian family.

(prop-centered-gaussian-covariance-catalogue)=
:::{admonition} Proposition: Centered Gaussian Covariance Catalogue
:class: important
Let $\gamma=\Gaussian(0,\Id)$ and let $\mu_t=\Gaussian(0,C_t)$ with $C_t\succ0$. For the normalizations displayed below, the Wasserstein descent constrained to the centered Gaussian manifold satisfies $\dot C_t=h(C_t)$, with $$\begin{array}{rcl}
        \KL(\mu|\gamma) &:& h(C)=2(\Id-C), \\[.35em]
        \frac12\,\mathcal I(\mu|\gamma) &:& h(C)=2(C^{-1}-C), \\[.35em]
        \Wass_2^2(\mu,\gamma) &:& h(C)=4(C^{1/2}-C), \\[.35em]
        \MMD_k^2(\mu,\gamma),\quad k(x,y)=\dotp{x}{y}^2
            &:& h(C)=8(C-C^2), \\[.35em]
        S_\epsilon(\mu,\gamma)
            &:& h(C)=
            4\left(C+\frac{\epsilon^2}{16}\Id\right)^{1/2}
            -2\left(C^2+\frac{\epsilon^2}{16}\Id\right)^{1/2}
            -2C-\frac{\epsilon}{2}\Id, \\[.75em]
        \SW_2^2(\mu,\gamma)
            &:& h(C)=V(C)C+CV(C),
    \end{array}$$ where $S_\epsilon$ is the debiased Sinkhorn divergence for the quadratic cost $\norm{x-y}^2$ and KL regularization strength $\epsilon$, and $$V(C)=
        2\int_{\Sphere^{d-1}}
        \left(\frac{1}{\sqrt{\theta^\top C\theta}}-1\right)
        \theta\theta^\top \,\d\sigma(\theta)$$ for the normalized spherical measure $\sigma$. Here $$\mathcal I(\mu|\gamma)=\int \left|\nabla\log\rho(x)+x\right|^2\rho(x)\,\d x
        \qquad(\mu=\rho\,\d x).$$ Thus the unhalved Fisher divergence has right-hand side $4(C^{-1}-C)$. Multiplying any of these energies by a constant simply rescales the corresponding right-hand side.
:::

:::{dropdown} Proof
Each row is obtained by identifying the affine descent velocity $v(x)=M_Cx$ generated by the corresponding Gaussian-constrained calculation and then applying the affine covariance equation, which gives $\dot C=M_CC+CM_C^\top$. For $\KL(\cdot|\gamma)$, the Fokker--Planck velocity is $(C^{-1}-\Id)x$, hence $\dot C=2(\Id-C)$. For the Fisher row, the restriction of $\frac12\mathcal I$ to centered Gaussians is $$\frac12\left(\tr(C)+\tr(C^{-1})-2d\right).$$ Using the Gaussian-constrained gradient formula gives the descent velocity $(C^{-2}-\Id)x$, hence $\dot C=2(C^{-1}-C)$. This row should be read as a Gaussian projected closure of the fourth-order Fisher flow.

For $\Wass_2^2(\cdot,\gamma)$, the Brenier map from $\Gaussian(0,C)$ to $\gamma$ is $C^{-1/2}x$, so the descent velocity for the unhalved squared distance is $2(C^{-1/2}-\Id)x$, giving $4(C^{1/2}-C)$. For the polynomial MMD row, centered Gaussians satisfy $\MMD_k^2(\mu,\gamma)=\norm{C-\Id}_{\mathrm{F}}^2$; the first variation is quadratic and its descent velocity is $4(\Id-C)x$, giving $8(C-C^2)$.

Gaussian Sinkhorn dual potentials are quadratic, so the velocity is again linear; differentiating the closed Gaussian formula yields the displayed spectral expression. The square roots are spectral functions of $C$, hence commute with $C$, which is why the covariance ODE closes as a matrix function of $C$ alone. For sliced Wasserstein, each one-dimensional projection is a Gaussian transport with velocity $2((\theta^\top C\theta)^{-1/2}-1)\dotp{\theta}{x}\theta$; averaging these velocities over $\Sphere^{d-1}$ gives $v(x)=V(C)x$ and thus $\dot C=V(C)C+CV(C)$.
:::

### Non-variational Gaussian-preserving flows.

The last examples are not ordinary gradient flows of a fixed scalar energy on the full Wasserstein space. They preserve Gaussianity because the prescribed velocity field is affine when evaluated on Gaussian measures.

### Contractive Gaussian projection.

The preceding examples show when Gaussianity is preserved or imposed by projection. Gelbrich's inequality {cite:p}`gelbrich1990formula` gives a useful variational explanation: replacing a measure by the Gaussian with the same first two moments cannot increase its Wasserstein distance to another similarly projected measure.

(thm-gelbrich-projection)=
<span id="thm-gelbrich-projection"></span>
:::{admonition} Theorem: Gelbrich Projection
:class: important
For $\mu\in\Pp_2(\RR^d)$, let $$\mathcal R\mu\eqdef \Gaussian(\mean_\mu,\cov_\mu)$$ be the Gaussian with the same mean and covariance as $\mu$. Then $$\Wass_2^2(\mathcal R\mu,\mathcal R\nu)
        =
        \norm{\mean_\mu-\mean_\nu}^2+\Bb^2(\cov_\mu,\cov_\nu)
        \leq
        \Wass_2^2(\mu,\nu).$$
:::

:::{dropdown} Proof
Take any coupling $(X,Y)$ of $\mu$ and $\nu$, center the variables, and write $C=\EE[(X-\mean_\mu)(Y-\mean_\nu)^\top]$. In the positive definite case, positivity of the block covariance matrix implies the factorization $C=\cov_\mu^{1/2}K\cov_\nu^{1/2}$ with $\norm{K}_{\mathrm{op}}\leq1$, and therefore, by operator/nuclear norm duality, $$\tr C\leq \tr\left((\cov_\mu^{1/2}\cov_\nu\cov_\mu^{1/2})^{1/2}\right).$$ The semidefinite case follows by adding $\eta\Id$ to both covariance matrices and letting $\eta\downarrow0$. Expanding $\EE\norm{X-Y}^2$ gives the lower bound $$\EE\norm{X-Y}^2
        \geq
        \norm{\mean_\mu-\mean_\nu}^2+\Bb^2(\cov_\mu,\cov_\nu).$$ Taking the infimum over couplings proves the inequality, while equality for Gaussian laws is exactly the Gaussian Bures formula.
:::

The following preservation criterion is a direct consequence of Gelbrich's theorem and was explained to us by Hugo Lavenant. It says that a functional which does not increase under moment-matched Gaussian projection admits Gaussian minimizing movements from Gaussian initial data.

(thm-lavenant-gaussian-preserving-jko)=
:::{admonition} Theorem: Hugo Lavenant Gaussian-Preservation Criterion
:class: important
Let $F:\Pp_2(\RR^d)\to(-\infty,+\infty]$ satisfy $$F(\mathcal R\mu)\leq F(\mu)
        \qquad\forall\mu\in\Pp_2(\RR^d),$$ with $\mathcal R$ defined in Gelbrich's theorem above. If $\gamma$ is Gaussian and $\nu$ minimizes the JKO step $$\eta\mapsto F(\eta)+\frac1{2\tau}\Wass_2^2(\gamma,\eta),$$ then $\mathcal R\nu$ is also a minimizer. If the JKO minimizer is unique, it is Gaussian. Thus any unique Wasserstein gradient flow obtained as the limit of this JKO scheme preserves Gaussian initial data.
:::

:::{dropdown} Proof
For the JKO claim, $\mathcal R\gamma=\gamma$ because $\gamma$ is Gaussian. Hence, for any competitor $\eta$, $$F(\mathcal R\eta)+\frac1{2\tau}\Wass_2^2(\gamma,\mathcal R\eta)
        \leq
        F(\eta)+\frac1{2\tau}\Wass_2^2(\gamma,\eta).$$ Applying this to a minimizer $\eta=\nu$ shows that $\mathcal R\nu$ is again a minimizer. Uniqueness forces $\nu=\mathcal R\nu$.
:::

(ex-gaussian-affine-gradients)=
:::{admonition} Example: Gaussian energies and affine gradients
:class: ot4ml-example

Proposition {ref}`prop-gaussian-gradient-bullet-list` turns many standard energies into explicit affine fields:
- *Quadratic potential energy.* If

```{math}
f(\alpha)=\int \Bigl(\frac12 x^\top Hx+\dotp{\ell}{x}\Bigr)\d\alpha(x),
\qquad H=H^\top,
```

then

```{math}
\Wgrad f(\alpha)(x)=Hx+\ell=(H\mean+\ell)+H(x-\mean).
```

This is the Gaussian form of transport under a quadratic confinement.
- *Quadratic interaction energy.* If

```{math}
f(\alpha)=\frac14\iint (x-y)^\top G(x-y)\d\alpha(x)\d\alpha(y),
\qquad G=G^\top,
```

then $F(\mean,\cov)=\frac12\mathrm{tr}(G\cov)$ and

```{math}
\Wgrad f(\alpha)(x)=G(x-\mean).
```

The mean is unchanged and the covariance contracts or expands according to the signs of $G$.
- *Relative entropy to a Gaussian.* For $\bar\alpha=\Gaussian(\bar\mean,\bar\cov)$,

```{math}
f(\alpha)=\KL(\alpha|\bar\alpha)
```

has

```{math}
\Wgrad f(\alpha)(x)
=
\bar\cov^{-1}(\mean-\bar\mean)
+
(\bar\cov^{-1}-\cov^{-1})(x-\mean).
```

The descent equations are the Ornstein--Uhlenbeck moment equations

```{math}
\dot\mean_t=-\bar\cov^{-1}(\mean_t-\bar\mean),
\qquad
\dot\cov_t=2\Id-\bar\cov^{-1}\cov_t-\cov_t\bar\cov^{-1}.
```

- *Squared Wasserstein distance to a Gaussian.* For

```{math}
f(\alpha)=\frac12\Wass_2^2(\alpha,\bar\alpha),
\qquad
\bar\alpha=\Gaussian(\bar\mean,\bar\cov),
```

the Gaussian Brenier map $T_{\alpha\to\bar\alpha}$ is affine,

```{math}
T_{\alpha\to\bar\alpha}(x)=\bar\mean+M(x-\mean),
\qquad
M=\cov^{-1/2}(\cov^{1/2}\bar\cov\cov^{1/2})^{1/2}\cov^{-1/2}.
```

Hence

```{math}
\Wgrad f(\alpha)(x)=x-T_{\alpha\to\bar\alpha}(x)
=
(\mean-\bar\mean)+(\Id-M)(x-\mean),
```

and descent moves each Gaussian infinitesimally along the Bures--Wasserstein geodesic toward $\bar\alpha$.
- *Gaussian-only losses.* Sliced $\SW_2^2$ losses to a Gaussian, Gaussian Sinkhorn divergences, and any smooth closed formula depending only on $(\mean,\cov)$ fit the same constrained-gradient template:

```{math}
v_F(x)=\nabla_\mean F+2\nabla_\cov F(x-\mean).
```

For Gaussian Sinkhorn divergences this finite-dimensional flow is studied in {cite:p}`HardionLacombe2026GaussianSinkhornFlow`.

Not every PDE preserves Gaussianity exactly. For instance, Wasserstein flows of relative Fisher information, related to quantum-drift or higher-order diffusion equations, typically require a Gaussian projection to close on $(\mean,\cov)$. Such projected closures are still useful: they expose the finite-dimensional dynamics predicted by a variational model and make it easy to compare variational flows with non-variational affine dynamics such as drifting fields or the Gaussian transformer closure below.
:::


:::{admonition} Example: Linear mean-field networks as cross-moment flows
:class: ot4ml-example

In the two-layer model above, take the linear activation $\sigma(s)=s$, so that

```{math}
\psi((u,v),z)=v\,\dotp{u}{z}.
```

The predictor is the linear map

```{math}
G_{\alpha_t}(z)=Q_t z,
\qquad
Q_t=\int v u^\top\d\alpha_t(u,v)\in\RR^{d'\times d}.
```

Thus the energy depends on the neuron law only through the cross moment $Q_t$, a subblock of the raw second moment of $x=(u,v)$. For square loss, set

```{math}
S=\int zz^\top\d\rho(z,y),
\qquad
R=\int y z^\top\d\rho(z,y),
\qquad
H_t=Q_tS-R.
```

The first variation is

```{math}
\delta f(\alpha_t)(u,v)=\dotp{H_t}{v u^\top}=v^\top H_t u.
```

Hence the particle velocity in parameter space is linear:

```{math}
-\nabla_{(u,v)}\delta f(\alpha_t)(u,v)
=
-\begin{pmatrix}
0 & H_t^\top \\
H_t & 0
\end{pmatrix}
\begin{pmatrix} u \\ v \end{pmatrix}.
```

Therefore a Gaussian law of neurons remains Gaussian. Its mean and covariance follow Proposition {ref}`prop-gaussian-affine-closure`, with a matrix depending only on the current cross moment $Q_t$, a raw second-moment subblock that becomes a covariance subblock when the neuron law is centered. This exact closure is special to the linear activation; for nonlinear activations, Gaussian closures are usually projections rather than invariant families.
:::


:::{admonition} Example: Flow matching and diffusion paths between Gaussians
:class: ot4ml-example

Consider a prescribed Gaussian interpolation $\alpha_t=\Gaussian(\mean_t,\cov_t)$. Proposition {ref}`prop-gaussian-affine-closure` shows that an exact flow-matching velocity can be taken affine:

```{math}
v_t(x)=\dot\mean_t+A_t(x-\mean_t),
\qquad
A_t\cov_t+\cov_t A_t=\dot\cov_t.
```

In the isotropic case $\cov_t=s_t^2\Id$, this reduces to the transparent formula

```{math}
v_t(x)=\dot\mean_t+\frac{\dot s_t}{s_t}(x-\mean_t).
```

For instance, the diffusion noising path

```{math}
X_t=a_tX_0+\sigma_t Z,\qquad Z\sim\Gaussian(0,\Id),
```

has $\mean_t=a_t\mean_0$ and $\cov_t=a_t^2\cov_0+\sigma_t^2\Id$. Thus, in the Gaussian case, diffusion paths and flow-matching paths reduce to the same mean-covariance bookkeeping, although the corresponding training objectives are different.
:::


:::{admonition} Example: Gaussian kernel drifting
:class: ot4ml-example

Let the target be $\beta=\Gaussian(\bar\mean,\bar\cov)$ and assume $\mu_t=\Gaussian(\mean_t,\cov_t)$. For the Gaussian kernel

```{math}
K_\epsilon(x,y)=\exp(-\norm{x-y}^2/(2\epsilon)),
```

the normalized field {eq}`eq-normalized-kernel-drift` satisfies

```{math}
B_\epsilon[\mu_t](x)
=
-\epsilon(\cov_t+\epsilon\Id)^{-1}(x-\mean_t).
```

Indeed the smoothed density $x\mapsto\int K_\epsilon(x,y)\d\mu_t(y)$ is proportional to the Gaussian density with mean $\mean_t$ and covariance $\cov_t+\epsilon\Id$. Thus $B_\epsilon[\mu_t]$ is the mean-shift vector of a Gaussian density: it points linearly toward the Gaussian mode, with strength set by the bandwidth. The drifting velocity {eq}`eq-cross-minus-self-drift` is therefore the difference of two affine mean-shift fields; it is affine and preserves Gaussianity. With

```{math}
A_t=(\cov_t+\epsilon\Id)^{-1},
\qquad
\bar A=(\bar\cov+\epsilon\Id)^{-1},
```

the ODE is

```{math}
\dot\mean_t=\epsilon\bar A(\bar\mean-\mean_t),
\qquad
\dot\cov_t=\epsilon\bigl((A_t-\bar A)\cov_t+\cov_t(A_t-\bar A)\bigr).
```

This finite-dimensional model explains the stabilizing role of the self-normalized repulsion term in drifting: without it, the covariance equation loses the $A_t\cov_t+\cov_tA_t$ contribution.
:::


:::{admonition} Example: Gaussian closure of attention dynamics
:class: ot4ml-example

For the transformer PDE, assume $\alpha=\Gaussian(\mean,\cov)$. Since exponential tilting preserves Gaussianity,

```{math}
\frac{\int e^{\dotp{Qx}{Ky}}\,y\,\d\alpha(y)}
     {\int e^{\dotp{Qx}{Kz}}\,\d\alpha(z)}
=
\mean+\cov K^\top Qx.
```

Therefore

```{math}
\Gamma_\theta[\alpha](x)=V\mean+V\cov K^\top Qx
```

is affine. The Gaussian token law is preserved and satisfies

```{math}
\dot\mean_t=(V_t+V_t\cov_tK_t^\top Q_t)\mean_t,
\qquad
\dot\cov_t=B_t\cov_t+\cov_tB_t^\top,
\qquad
B_t=V_t\cov_tK_t^\top Q_t.
```

When $V_t=Q_t^\top K_t$, the matrix $B_t=Q_t^\top K_t\cov_tK_t^\top Q_t$ is symmetric positive semidefinite, matching the gradient-field case mentioned above.
This closure is not a convergence theorem for trained transformers. It is instead a tractable model of how attention can shear, amplify or contract a cloud of tokens through its covariance.
:::


:::{admonition} Remark: Gaussian barycenters from contraction
:class: ot4ml-remark

The same projection argument also explains why quadratic Wasserstein barycenters of Gaussian measures are Gaussian. If $\be_s$ are Gaussian and

```{math}
F(\mu)=\sum_s\la_s\Wass_2^2(\mu,\be_s),
```

then $\mathcal R\be_s=\be_s$, and Theorem {ref}`thm-gelbrich-projection` gives $F(\mathcal R\mu)\leq F(\mu)$. Thus the moment-matched Gaussian projection of any barycenter is again a barycenter; when the barycenter is unique, it must itself be Gaussian. This is the contraction viewpoint behind Corollary {ref}`cor-gaussian-discrete-barycenters`.
:::
