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

## 2026-07-05 Reference-Fidelity Pass

This pass rechecked the page-level outlines of all four reference PDFs and restored several compact but important derivations that make the Quarto decks closer to the mathematical granularity of the originals.

Added or strengthened:

- Deck 1 now spells out the empirical distribution-fitting model in the opening `The fitting problem` slide, including empirical laws, push-forward generative models, and the objective `min_\theta D((g_\theta)_#\zeta,\beta)`.
- Deck 1 now adds a dedicated finite `Discrete gluing formula` slide with the three-index coupling `S_{i,j,k}=P_{i,j}Q_{j,k}/b_j`, matching the reference proof of the Wasserstein triangle inequality.
- Deck 1 now adds the finite-dimensional extreme-point argument behind exactness of the Kantorovich relaxation for equal weights.
- Deck 2 now includes explicit KL projection formulas for the Sinkhorn row and column half-steps.
- Deck 3 now includes the semi-discrete Hessian/facet formula used by Newton and quasi-Newton solvers, with the correct sign convention for neighboring Laguerre cell masses.
- Deck 4 now restores the single-Dirac reduction of JKO to ordinary implicit gradient descent.
- Deck 4 now states the first variation formula and the three reference examples of Wasserstein gradients: linear potential/advection, Shannon entropy/heat equation, and quadratic interaction/interacting particles.

Corrections:

- Fixed the sign in the semi-discrete Hessian slide: increasing a neighboring weight expands that neighbor's cell and shrinks the current cell, so the off-diagonal derivative of the current cell mass is negative, while the concave dual Hessian has positive off-diagonal entries and negative diagonal row sums.
- Tightened the exactness statement to finite compact polytopes, which is the setting used for the bistochastic polytope.

Verification:

- `python3 slides/check_slides.py` passes for all decks.
- All four decks render to Reveal.js HTML with Quarto.
- `slides/export_pdf.sh` regenerated the four deck PDFs and `slides/pdf/ot4ml-slides-complete.pdf`.
- The newly added equation-heavy pages were rendered to PNG and visually checked for clipping and overflow.

## 2026-07-05 Second Formula-Fidelity Pass

This follow-up pass inspected the reference PDF pages visually in the places where `pdftotext` was too noisy, focusing on formulas that were still compressed into prose.

Added or strengthened:

- Deck 1 now states the quantitative CLT estimate in Wasserstein form: for normalized sums `Y_n`, `W_1(Law(Y_n),N(0,1)) <= C E|X|^3 / sqrt(n)`.
- Deck 2 now states the reference statistical comparison between exact OT's dimension-dependent empirical rate and fixed-`epsilon` entropic OT's parametric `n^{-1/2}` behavior.
- Deck 2 now records the small-`epsilon` entropic bias expansion and the debiased Sinkhorn divergence expansion involving the Fisher-information integral along the displacement interpolation.
- Deck 3 now includes the closest-site quantization formula for free masses and the general stationarity equation `int_{V_j(Y)} nabla_y c(x,y_j) d alpha(x)=0`, whose quadratic specialization is Lloyd's centroid update.
- Deck 4 now includes the independent convolution interpolant used in the reference flow-matching slides, its conditional-expectation vector field, the continuity equation, and the Tweedie score formula for a Gaussian endpoint.

Corrections:

- Kept the flow-matching score identity convention-aware: the Quarto deck's time orientation gives the `t`-denominator formula, while the reverse noising convention gives the `1-t`-denominator form shown in diffusion-model notation.
- Replaced a stray `W_c` notation in the quantization stationarity slide by the deck's general-cost notation `\mathcal L_c`.

Verification:

- Rendered the affected reference PDF pages to PNG for visual comparison.
- Rendered all four Quarto decks to Reveal.js HTML.
- Regenerated the deck PDFs and the combined PDF.
- Rendered the newly added pages to PNG contact sheets and checked for clipping or unreadable equations.
