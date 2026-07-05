# Reference Slide Coverage Audit

This audit checks the four Quarto/Reveal.js slide decks against the four reference PDF decks in `slides/references/`.  The goal is semantic coverage: every equation, algorithmic idea, proof mechanism, named concept, and application theme from the references should appear either directly or as a clearly identified compressed slide in the new decks.

## Method

- Extracted text from the reference PDFs with `pdftotext -layout`.
- Rendered contact sheets from the reference PDFs for visual inspection where text extraction was weak.
- Compared page titles, recurring formulas, named examples, and application blocks against the Quarto sources.
- Ran the slide source sanity checker after edits.

Verification command:

```bash
python3 slides/check_slides.py
```

Result: all four decks pass the source checker.

## Deck 1: Monge and Kantorovich Optimal Transport

Reference: `slides/references/1-MongeKantorovitch.pdf`

Current deck: `slides/1-monge-kantorovich/index.qmd`

Status: covered.

Core material present:

- Motivation by distribution fitting and computational OT.
- Finite Monge problem, permutation matrices, assignment algorithms, and one-dimensional sorting.
- Continuous measures, random variables, push-forwards, and density change of variables.
- Continuous Monge problem, Brenier theorem, Monge-Ampere equation, and regularity message.
- Quantile formula, histogram equalization, McCann interpolation, color transfer.
- Gaussian OT, Riccati equation, Bures metric, covariance geometry.
- Kantorovich relaxation, couplings, product versus optimal coupling, exact relaxation for equal weights, and Birkhoff-von Neumann/cycle intuition.
- Wasserstein distance, metric property, convergence in law, and dual witnesses.
- Application motifs: CLT, gradient flows, barycenters, generative models.

Restored or explicitly checked:

- The triangle inequality proof mechanism is now explicit as a gluing lemma/Minkowski argument in `Triangle inequality by gluing`.
- The `Application examples` slide explicitly names ATAC-seq/single-cell, MRI/cortical-surface geometry, bag-of-words, color transfer, image generation, and progressive growing GANs.

Compressed but not missing:

- The reference deck contains several application screenshots; the new deck groups these as application categories rather than reproducing every original screenshot.
- The computational framework/POT material is summarized in `Computational OT in practice` and `From LP to specialized solvers`.

## Deck 2: Entropic Regularization and Sinkhorn

Reference: `slides/references/2-EntropicRegularization.pdf`

Current deck: `slides/2-entropic-regularization/index.qmd`

Status: covered.

Core material present:

- Entropic OT for discrete and continuous measures.
- Relative entropy formulation and probabilistic interpretation.
- Schrödinger endpoint reduction and Brownian bridge/path-space viewpoint.
- Effect of the regularization parameter.
- Sinkhorn scaling, half-steps, matrix scaling, and computational structure.
- Perron-Frobenius/Hilbert metric convergence view.
- Bregman projection view, dual formulation, soft `c`-transforms, and stabilized log-domain Sinkhorn.
- Monotone/variation-seminorm convergence viewpoint.
- Other convex regularizers.
- Unbalanced OT, generalized Sinkhorn updates, marginal penalties, balanced versus unbalanced interpolation.
- Entropic barycenters, MMD/kernel norms, Sinkhorn divergence, debiasing.
- Sample complexity, bias-variance, smoothness, differentiable training, and automatic differentiation.

Restored or explicitly checked:

- The Schrödinger slide uses the correct spelling and includes the historical “lazy gas” interpretation.
- The Perron-Frobenius slide explicitly mentions Rothblum-type matrix-scaling convergence analyses.
- The unbalanced block explicitly mentions geodesic unbalanced OT.
- Generative-model slides mention progressive growing GAN experiments as in the reference deck.

Compressed but not missing:

- The reference Hilbert-versus-mirror comparison is split across `Hilbert projective metric`, `Linear contraction mechanism`, and `Monotone and variation viewpoints`.
- The reference sample-complexity discussion is more visual; the Quarto deck keeps the key rate/bias/smoothness messages in compact mathematical slides.

## Deck 3: Duality, Semi-Discrete OT, and Quantization

Reference: `slides/references/3-DualSemiDiscrete.pdf`

Current deck: `slides/3-dual-semidiscrete/index.qmd`

Status: covered.

Core material present:

- Discrete primal and dual OT and the Lagrangian derivation.
- Complementary slackness and discrete dual witnesses.
- Continuous duality, continuous potentials, `c`-transform, `c`-concavity, triple-transform closure, and alternating `c`-transforms.
- Kantorovich-Rubinstein formula, Wasserstein-1 as a norm, IPMs, and WGAN viewpoint.
- Euclidean, surface/subdomain, and graph Beckmann formulations.
- Semi-discrete OT, Laguerre cells, power diagrams, semi-discrete dual, and weight balancing.
- Practical optimization of semi-discrete OT.
- Quantization, fixed/free masses, Lloyd algorithm, quantization on the line, relaxed Lloyd flow, and energy decay.

Restored or explicitly checked:

- The surface/subdomain Wasserstein-1 slide now names the Solomon-Rustamov-Guibas-Butscher geometry-processing line.
- The practical semi-discrete optimization slide explicitly mentions L-BFGS/quasi-Newton implementations.

Compressed but not missing:

- Several reference slides show repeated animations of alternating `c`-transforms; the Quarto deck uses one interactive/figure-based sequence plus the closure identities.
- The semi-discrete solver details are expressed as an algorithm box instead of reproducing every implementation variant.

## Deck 4: Dynamic Transport and Flows for ML

Reference: `slides/references/4-DynamicFlows.pdf`

Current deck: `slides/4-dynamic-flows/index.qmd`

Status: covered after edits in this pass.

Core material present:

- Auto-regressive models versus transport models.
- Eulerian and Lagrangian descriptions and the continuity equation.
- Gradient structure linking PDEs and particles.
- Stochastic interpolants, flow matching objective, diffusion versus OT, forward noising schedules, and the question of optimality of diffusion maps.
- Benamou-Brenier dynamic formulation, convex moment formulation, dynamic solver, geodesic example, velocity field, and dynamic duality.
- Wasserstein gradient flows, JKO/minimizing movements, entropy steps, linear/nonlinear diffusions, Fokker-Planck/Langevin dynamics.
- Discrepancy-driven flows, particle objectives, constraints, congestion, and WFR.
- Mean-field two-layer networks, mean-field PDE, global-convergence message, neuron trajectories, normalized/Muon-type flows.
- Single-cell, multi-omics, and trajectory-inference applications.
- Attention as interacting particles, continuous-depth transformers, L2 attention/mean shift, Gaussian clustering, and universality viewpoint.

Restored or explicitly checked:

- The multi-omics slide now names MOWGLI explicitly.
- A new `Universality proof sketch` slide records the reference deck's transformer-universality message in mathematical language.

Compressed but not missing:

- The genomics part of the reference deck contains many domain screenshots; the Quarto deck keeps the main single-cell, paired multi-omics, and trajectory-inference visuals while compressing secondary domain screenshots.
- The transformer proof is kept as a proof sketch, consistent with the level of the reference PDF.

## Final Assessment

After the pass, I do not see a mathematical equation, algorithmic concept, or named application theme from the reference PDFs that is absent from the Quarto decks.  Some visually rich reference examples are deliberately compressed or replaced by cleaner OT4ML figures, but their mathematical role is represented in the slides.

## Extracted Reference Visuals

The following visuals from the reference PDFs did not have a close book-generated replacement and were therefore extracted, trimmed, and inserted into the interactive slides:

- `1-MongeKantorovitch.pdf`: distribution-comparison/ATAC-seq, MRI cortical-surface processing, bag-of-words OT, and image-generation examples, inserted in `slides/1-monge-kantorovich/`.
- `2-EntropicRegularization.pdf`: Sinkhorn/IPFP/RAS historical matrix-scaling visual and image-generation examples, inserted in `slides/2-entropic-regularization/`.
- `3-DualSemiDiscrete.pdf`: W1 on surfaces, W1 on subdomains, and WGAN schematic, inserted in `slides/3-dual-semidiscrete/`.
- `4-DynamicFlows.pdf`: autoregressive-vs-transport visual, crowd-motion example, cell-diversity and single-cell multi-omics visuals, MOWGLI visual, trajectory-inference visual, and transformer/attention architecture visual, inserted in `slides/4-dynamic-flows/`.

All extracted assets are stored under the corresponding deck `assets/` directory with a `ref-...` filename.

## 2026-07-05 Equation-Polish Pass

This pass rechecked the reference PDFs specifically for formula-level content that was compressed too much in the Quarto decks.

Added or strengthened:

- Deck 2 now spells out the entropy identity behind the probabilistic interpretation of entropic OT: `KL(P | a \otimes b)=I(X;Y)=H(a)+H(b)-H(P)`.
- Deck 2 now includes the dynamic Schrodinger path-space optimization formula and the KL chain-rule decomposition showing why the endpoint coupling solves the static entropic problem.
- Deck 2 now states the quantitative Hilbert-metric Birkhoff contraction formula used in the Sinkhorn linear-convergence explanation.
- Deck 3 now includes the reduced one-potential Kantorovich dual value and its discrete `c`-transform version.
- Deck 4 now includes the supervised two-layer mean-field risk functional and its first variation before the mean-field training PDE.

Verification:

- `python3 slides/check_slides.py` passes after the edits.
- The modified decks 2, 3, and 4 render with Quarto to Reveal.js HTML.
- The new formula slides were visually checked in the browser at 16:9; no overflow or broken math rendering was observed.
