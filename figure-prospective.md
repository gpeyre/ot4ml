# Prospective Figures for OT4ML

This document collects new figure ideas that could be added to the paper after the current figure campaign.  The guiding rule is the same as for the existing notebooks: each proposal should be visually simple, mathematically useful, lightweight to compute in Python/POT, and suitable for a polished book figure.  The emphasis is on intuition rather than benchmarking.

Each item is indexed by a possible future LaTeX label `fig:<name>`.  The same `<name>` should be used for the notebook name and output directory if the figure is implemented:

- notebook: `notebooks-figures/<name>.ipynb`;
- generated panels: `OT4ML/figures/<name>/*.pdf`;
- LaTeX label: `\label{fig:<name>}`.

The list is organized by the current chapter order.  Items marked `priority: high` are the ones that seem most likely to clarify a key concept that is currently not visualized as directly as it could be.

## Global Visual Direction

- Keep most examples one-dimensional or two-dimensional.
- Use the book palette: red for source, blue for target, violet for intermediate objects.
- Avoid solver comparisons and timing plots.
- Prefer geometric mechanisms: sorting, projection, splitting, smoothing, contraction, lifting, quotienting, and barycentric collapse.
- Use small circular markers for atoms, image renderings for densities, and clean matrix heatmaps when the object is a coupling or kernel.
- Avoid titles inside the exported PDFs; put titles and parameters in LaTeX.
- Each notebook should expose the mathematical point in a short opening paragraph and then generate the figure deterministically from a fixed seed.


=====


## 6. Divergences and Dual Norms

### `fig:dualnorms-tv-vs-mmd-microscope`

- **Concept.** TV sees pointwise singularity, MMD smooths through the kernel scale.
- **Visual.** Compare a Dirac and a narrow Gaussian on the line.  Show TV as a hard mismatch, and MMD witnesses for two kernel bandwidths as smooth bumps.
- **Why it helps.** It gives immediate intuition for why kernel norms are weaker and sample-friendly.
- **Implementation.** Analytic Gaussian kernels and simple quadrature.
- **priority: high**

### `fig:dualnorms-phi-divergence-tangent`

- **Concept.** Variational formula for `\phi`-divergences through tangent lines of `\phi`.
- **Visual.** Plot a convex generator `\phi(r)` with tangent lines at several density ratios; next to it, display the corresponding pointwise density-ratio penalty on a 1D pair of densities.
- **Why it helps.** The Fenchel dual of `\phi`-divergences becomes a one-dimensional convex-analysis picture.
- **Implementation.** Use KL, Hellinger, and TV generators as three small panels.
- **priority: medium**

### `fig:gan-ipm-vs-divergence-support-mismatch`

- **Concept.** Difference between divergence losses and IPM losses under support mismatch.
- **Visual.** Two disjoint 1D intervals.  Show a divergence panel saturating/infinite and an IPM witness with a finite sloped potential bridging the gap.
- **Why it helps.** It motivates why Wasserstein/IPM losses became attractive in generative modeling.
- **Implementation.** Static densities and witness curves.
- **priority: medium**

## 7. Entropic Regularization: Sinkhorn Algorithm

### `fig:sinkhorn-gibbs-kernel-blur`

- **Concept.** Entropic OT as a Gibbs-weighted blur of the hard cost geometry.
- **Visual.** Same 1D cost matrix, display `exp(-C/epsilon)` for three epsilons next to the resulting coupling.  The Gibbs kernel widens as epsilon increases.
- **Why it helps.** It visually separates the prior kernel from the scaled coupling.
- **Implementation.** Small 1D histograms; POT/Sinkhorn.
- **priority: high**

### `fig:sinkhorn-scaling-simplex-projections`

- **Concept.** Sinkhorn as alternating KL projections onto row and column marginal sets.
- **Visual.** In a stylized 2D simplex, draw two affine constraint sets and alternating projection points colored red-to-blue.  Use a tiny `2 x 2` coupling so the geometry is exact.
- **Why it helps.** Complements matrix iterations with the Bregman projection geometry.
- **Implementation.** Parameterize positive `2 x 2` matrices with fixed total mass in two coordinates.
- **priority: high**

### `fig:sinkhorn-softmin-rounding-envelope`

- **Concept.** Soft `c`-transform as a rounded minimum envelope.
- **Visual.** Draw a family of parabolas and compare the hard minimum envelope with soft-min envelopes for three `epsilon` values.
- **Why it helps.** It makes the log-sum-exp smoothing interpretation immediate.
- **Implementation.** Explicit 1D parabolas.
- **priority: high**

### `fig:sinkhorn-marginal-prox-simplex`

- **Concept.** KL proximal operators in marginal-dependent Sinkhorn problems.
- **Visual.** On the probability simplex triangle, show a current marginal, a KL-proximal update toward a target, and a projection onto a hard constraint face.
- **Why it helps.** The abstract `KL-prox` notation becomes geometric.
- **Implementation.** Three-bin histograms; compute prox formulas analytically.
- **priority: medium**

## 8. Entropic Regularization: Convergence

### `fig:sinkhorn-hilbert-projective-contraction`

- **Concept.** Hilbert metric contraction of positive vectors.
- **Visual.** Positive vectors in the `3`-simplex, rays identified projectively, and two initial scalings moving closer after multiplying by a positive kernel.  Use color to show contraction of the projective diameter.
- **Why it helps.** Hilbert metric is abstract; the simplex picture makes quotienting by scale visible.
- **Implementation.** Small positive `3 x 3` matrix and normalized vectors.
- **priority: high**

### `fig:sinkhorn-gaussian-fixed-point-map`

- **Concept.** Gaussian Sinkhorn iterations reduce to a scalar/matrix fixed-point map.
- **Visual.** One-dimensional centered Gaussian case: plot the scalar covariance update map, its fixed point, and cobweb iterations for two epsilons.
- **Why it helps.** The closed-form Gaussian section becomes computationally transparent.
- **Implementation.** Use the formula already in the text; no sampling.
- **priority: medium**

### `fig:sample-complexity-manifold-support`

- **Concept.** Wasserstein sample complexity depends on intrinsic support dimension.
- **Visual.** Side-by-side point samples on a square and on a one-dimensional curve in the square, with nearest-neighbor transport segments to a denser reference.  Avoid plotting rates; show only geometry of holes and coverage.
- **Why it helps.** It illustrates dimension-adaptivity without becoming a benchmark plot.
- **Implementation.** Sample from a square and a noisy circle/curve; compute a small assignment to a reference subset.
- **priority: high**

## 9. Generalized Wasserstein Distances

### `fig:unbalanced-cone-geodesic`

- **Concept.** Conic lifting behind unbalanced transport.
- **Visual.** A one-dimensional base line lifted to a cone: mass change is radial motion, transport is angular/base motion.  Show a few particles moving by transport, growth, and mixed motion.
- **Why it helps.** The cone formulation is powerful but hard to picture from equations alone.
- **Implementation.** Static 2D cone diagram with colored trajectories.
- **priority: high**

### `fig:partial-ot-free-boundary-1d`

- **Concept.** Free boundaries of active mass in partial OT.
- **Visual.** For a 1D pair of densities, show active intervals as the transported mass decreases, with boundary markers moving inward.
- **Why it helps.** Complements current partial OT coupling matrices by emphasizing active-region geometry.
- **Implementation.** Reuse exact 1D partial OT plan; extract active marginal support.
- **priority: medium**

### `fig:sliced-radon-sinogram`

- **Concept.** Sliced Wasserstein as OT on Radon projections.
- **Visual.** A 2D density, its sinogram over angles, and two selected projection densities with their 1D monotone matchings.
- **Why it helps.** The current projection figure shows selected directions; the sinogram shows the full angular family.
- **Implementation.** Use image rotation/projection or point-cloud projections on a fixed angle grid.
- **priority: high**

### `fig:quotient-wasserstein-orbit`

- **Concept.** Quotient Wasserstein collapses group orbits.
- **Visual.** A simple asymmetric shape, several rotated copies on an orbit ring, and two distances: large direct Wasserstein between misaligned copies, small quotient distance after rotation.
- **Why it helps.** Makes quotienting by symmetries intuitive before Procrustes iterations.
- **Implementation.** Farthest-point samples of a small silhouette or synthetic crescent; no iterative solver needed.
- **priority: high**

### `fig:spectral-gauge-projection-directions`

- **Concept.** Spectral gauges choose which displacement directions matter.
- **Visual.** A cloud of displacement vectors with covariance ellipse.  Compare trace, spectral radius, and a rank-one projected cost by highlighting average spread versus worst direction.
- **Why it helps.** Distills spectral Wasserstein before the full silhouette example.
- **Implementation.** Generate a few 2D displacement vectors and their covariance ellipse.
- **priority: medium**

## 10. Generalized OT Problems

### `fig:barycenter-support-explosion`

- **Concept.** Discrete barycenter support can live on all weighted averages of input support tuples.
- **Visual.** Three tiny one-dimensional input supports; below them, show the grid of all candidate barycenter points formed by weighted averages, with collisions merged.
- **Why it helps.** The multi-marginal curse behind barycenters becomes visible.
- **Implementation.** Enumerate tuples from three small supports.
- **priority: high**

### `fig:multimarginal-comotion-curves`

- **Concept.** Co-motion maps in equal-marginal multimarginal Coulomb transport.
- **Visual.** In one dimension, plot `x`, `T_2(x)`, and `T_3(x)` as three colored curves, plus a few triplets connected vertically.
- **Why it helps.** Complements the current pairwise Coulomb heatmap by showing deterministic Monge structure.
- **Implementation.** Use simple cyclic quantile shifts for equal 1D marginals.
- **priority: high**

### `fig:inverse-ot-normal-fan`

- **Concept.** Inverse OT loss is piecewise affine because a cost matrix selects a normal cone of the transport polytope.
- **Visual.** A two-parameter cost family with colored polygonal regions, each region corresponding to a different optimal plan.  Overlay the inverse-OT gap as contour lines.
- **Why it helps.** Gives geometric meaning to the convex but nonsmooth inverse OT objective.
- **Implementation.** Tiny `3 x 3` assignment problem; enumerate permutations and their cost regions.
- **priority: medium**

### `fig:weak-ot-barycentric-collapse-loss`

- **Concept.** Weak OT ignores conditional spread after barycentric projection.
- **Visual.** Two couplings with identical barycentric projections but different conditional variance clouds, shown side by side with the same red-to-violet barycentric arrows.
- **Why it helps.** It makes clear what information weak transport discards.
- **Implementation.** Hand-designed finite coupling from a few source atoms to symmetric blue pairs.
- **priority: high**

### `fig:convex-order-mean-preserving-spread`

- **Concept.** Convex order as mean-preserving spread, the feasibility condition behind martingale couplings.
- **Visual.** A narrow red density and a wider blue density with the same mean.  Show each red point splitting symmetrically into a small blue kernel, preserving barycenter.
- **Why it helps.** Martingale OT becomes a spread relation, not just linear constraints.
- **Implementation.** 1D grid; construct beta by spatially varying centered kernels.
- **priority: high**

## 11. Beyond Comparing Measures

### `fig:gw-distance-profiles`

- **Concept.** Memoli distance profiles and the lower bound for GW.
- **Visual.** Pick three points on each of two simple shapes.  For each point, display the histogram of distances to all other points.  Then show a small OT coupling between these histograms.
- **Why it helps.** Explains the profile lower bound and why local distance distributions are intrinsic signatures.
- **Implementation.** Two 2D point clouds, pairwise distances, 1D histograms.
- **priority: high**

### `fig:gw-vs-procrustes-failure-mode`

- **Concept.** GW can match intrinsic geometry even when no ambient rigid motion aligns the shapes.
- **Visual.** A bent curve and a straightened curve with the same intrinsic arclength order.  Procrustes alignment leaves large Euclidean mismatch, while GW correspondence follows the arclength.
- **Why it helps.** Clarifies the relation between Wasserstein--Procrustes and GW.
- **Implementation.** Sample points along two curves; match by arclength order for the schematic.
- **priority: high**

### `fig:quantum-bloch-disk-entropy`

- **Concept.** Density matrices and von Neumann entropy in the `2 x 2` case.
- **Visual.** Bloch disk: pure states on the boundary, maximally mixed state at the center, entropy contours as concentric rings.  Mark two density matrices and a geodesic/interpolation path.
- **Why it helps.** Gives a concrete picture of quantum states before quantum OT couplings.
- **Implementation.** Use `2 x 2` Hermitian density matrices parameterized by Bloch vectors in a disk.
- **priority: high**

### `fig:quantum-bregman-projection-cartoon`

- **Concept.** Quantum Sinkhorn/Gurvits scaling as alternating marginal normalization.
- **Visual.** A small diagram of positive matrix blocks whose row/column partial traces are alternately corrected.  Use matrix heatmaps before and after each correction.
- **Why it helps.** The noncommutative algorithm is otherwise very abstract; a block-matrix visual gives the right mental model.
- **Implementation.** Small random positive `2 x 2` block matrix and exact partial traces.
- **priority: medium**

## 12. Dynamic Optimal Transport

### `fig:dynamic-lagrangian-eulerian-same-flow`

- **Concept.** Lagrangian particle paths and Eulerian density/flux describe the same evolution.
- **Visual.** Top: several particles moving along curves.  Bottom: the same evolution rendered as density snapshots with a vector field overlay at mid-time.
- **Why it helps.** It introduces the dynamic chapter before Benamou--Brenier formulas.
- **Implementation.** Use an explicit affine flow of a Gaussian mixture.
- **priority: high**

### `fig:dynamic-dacorogna-moser-vectorfield`

- **Concept.** Dacorogna--Moser constructs a vector field whose divergence realizes a density change.
- **Visual.** A red-blue signed density difference `beta-alpha` as a heatmap, next to the gradient vector field solving a Poisson equation, with streamlines moving mass from positive to negative regions.
- **Why it helps.** The existence proof becomes a concrete divergence-inversion picture.
- **Implementation.** Two smooth 2D Gaussian mixtures on a grid; solve Poisson with FFT or finite differences.
- **priority: high**

### `fig:dynamic-action-penalizes-speed-in-low-density`

- **Concept.** The Benamou--Brenier action `|m|^2/rho` discourages large flux through low density.
- **Visual.** Two tubes carrying the same flux: one wide/high-density and one narrow/low-density.  Show action density as color intensity, much larger in the narrow tube.
- **Why it helps.** Explains the perspective function intuitively.
- **Implementation.** Static 2D scalar fields for `rho`, `m`, and `|m|^2/rho`.
- **priority: high**

## 13. Wasserstein Gradient Flows

### `fig:gradflow-jko-proximal-geometry`

- **Concept.** JKO as a proximal step balancing energy decrease and Wasserstein travel.
- **Visual.** On a 1D manifold of Gaussian means, plot an energy curve, a quadratic movement penalty centered at the previous step, and their sum.  Mark the next step; repeat with colors for several steps.
- **Why it helps.** It makes minimizing movements familiar before measure PDEs.
- **Implementation.** Gaussian family with variable mean and a simple double-well potential.
- **priority: high**

### `fig:gradflow-wasserstein-vs-euclidean-histogram-descent`

- **Concept.** Wasserstein gradient descent moves mass spatially; Euclidean histogram descent changes bin heights locally.
- **Visual.** Same 1D initial and target density.  Compare a few time snapshots for Euclidean `L^2` descent on histograms and Wasserstein/Fokker--Planck descent.
- **Why it helps.** It highlights what the metric changes in a gradient flow.
- **Implementation.** Simple finite differences on a 1D grid.
- **priority: high**

### `fig:gradflow-interaction-attraction-repulsion-field`

- **Concept.** Interaction energies generate velocity by convolving with `\nabla W`.
- **Visual.** A 2D particle cloud with arrows showing attraction to distant particles and repulsion at short range, plus the resulting next-step displacement.
- **Why it helps.** The interaction energy formula becomes a force-field picture.
- **Implementation.** Use a Morse-type radial potential and a few particles.
- **priority: medium**

### `fig:functional-inequality-deficit-transport`

- **Concept.** Functional inequality deficits along transport interpolation.
- **Visual.** For two 1D densities, show KL, Fisher information, and the HWI upper bound as three curves along a Wasserstein geodesic or OU flow, with the nonnegative gap shaded.
- **Why it helps.** Turns HWI/Talagrand/log-Sobolev statements into a visible inequality geometry.
- **Implementation.** Reuse fine-grid 1D density quadrature from existing HWI notebook.
- **priority: medium**

## 14. Generative Models via Transportation

### `fig:flowmatching-coupling-variance`

- **Concept.** The coupling used for flow matching controls conditional velocity variance.
- **Visual.** Same red/blue endpoint clouds, compare product coupling and OT coupling.  At a few midpoint locations, draw small velocity fans: product coupling has broad fans, OT coupling has coherent arrows.
- **Why it helps.** It explains why coupling choice affects regression difficulty without showing training curves.
- **Implementation.** Small 2D clouds, compute product random pairs and OT assignment.
- **priority: high**

### `fig:flowmatching-crossing-vs-continuity-density`

- **Concept.** Crossing particle paths can still define a valid density evolution, but induce complex velocity fields.
- **Visual.** Compare two interpolants between the same 1D/2D endpoints: monotone OT rays and crossing random rays.  Show the midpoint density and vector field for each.
- **Why it helps.** Clarifies the difference between path sampling and induced Eulerian velocity.
- **Implementation.** Small Gaussian-mixture samples and KDE velocity averaging.
- **priority: medium**

### `fig:transformer-attention-transport-kernel`

- **Concept.** Attention as a context-dependent transport kernel on tokens.
- **Visual.** Tokens as points on a line or circle, attention matrix as a heatmap, and barycentric token updates as arrows.  Compare sharp attention and diffuse attention.
- **Why it helps.** Replaces the archived attention figure with a simpler, more mathematical visual.
- **Implementation.** Explicit query/key Gaussian kernel on 12 tokens.
- **priority: high**

### `fig:moment-measure-gradient-pushforward-2d`

- **Concept.** A moment measure is the law of `\nabla u(X)` under the log-concave density proportional to `e^{-u}`.
- **Visual.** In 2D, show contours of a convex potential, samples from `e^{-u}`, arrows under `\nabla u`, and the pushed-forward cloud.  Use a mildly anisotropic tilted quartic potential.
- **Why it helps.** The current 1D moment-measure figure is exact; this gives the geometric two-dimensional picture.
- **Implementation.** Grid sampling or rejection sampling from a simple convex potential.
- **priority: medium**

## Cross-Chapter Summary Figures

### `fig:taxonomy-coupling-constraints`

- **Concept.** Many OT variants differ by constraints imposed on the coupling.
- **Visual.** One clean matrix layout with the same base coupling and overlays for constraints: fixed marginals, relaxed marginals, capacity cap, martingale row mean, low-rank factorization, multimarginal tensor.
- **Why it helps.** Gives readers a compact map of the generalized OT landscape.
- **Implementation.** Mostly schematic matrix panels, no heavy numerics.
- **priority: high**

### `fig:taxonomy-interpolations`

- **Concept.** Different interpolations between measures answer different questions.
- **Visual.** Same pair of 1D Gaussian mixtures, displayed under four paths: McCann quantile interpolation, entropic Schrodinger interpolation, linear mixture interpolation, and unbalanced interpolation.
- **Why it helps.** A unifying visual reference for many chapters.
- **Implementation.** Reuse existing 1D quantile, Sinkhorn, convex mixture, and unbalanced barycenter code.
- **priority: high**

### `fig:taxonomy-three-geometries-on-gaussians`

- **Concept.** Euclidean, Wasserstein/Bures, and Fisher--Rao geometries give different Gaussian paths.
- **Visual.** In the `(m,sigma)` half-plane or `2 x 2` PSD cone, overlay the three geodesics between the same endpoints and render the corresponding density snapshots below.
- **Why it helps.** It cross-links the Gaussian, information geometry, and gradient-flow discussions.
- **Implementation.** Closed-form 1D Gaussian formulas.
- **priority: medium**


## Second Brainstorming Round

This second round focuses on concepts that are present in the manuscript but could benefit from an even more immediate visual hook.  Each proposal below explicitly states where it would be integrated.

### `fig:matching-cost-power-continuation`

- **Integration.** Chapter 1, after the current figure comparing powers of the Euclidean distance.
- **Figure.** Use the same two small planar point clouds and continuously vary the exponent `p` from `1/2` to `4`.  Display four selected matchings and a tiny strip showing when individual assignment edges switch.
- **Intuition.** The reader sees that changing the cost does not merely rescale lengths; it can reorganize the optimal permutation through discrete combinatorial jumps.
- **Implementation.** Solve small equal-weight assignments for about 30 values of `p`, display only four panels and a compact edge-switch barcode.
- **priority: medium**

### `fig:matching-augmenting-path-mechanism`

- **Integration.** Chapter 1, in the paragraph on the Hungarian primal-dual method, just before or after the current matrix-iterate figure.
- **Figure.** A bipartite graph shows a partial matching, an alternating tree, one augmenting path highlighted in violet, and the updated matching after flipping the path.
- **Intuition.** The existing Hungarian figure shows iterates; this one explains the local graph operation that makes an iterate grow.
- **Implementation.** Static hand-designed graph with circular nodes and curved edges; no optimization required.
- **priority: high**

### `fig:monge-relative-density-singular-part`

- **Integration.** Chapter 2, in the measures section, after the definition of relative density and before total variation.
- **Figure.** On a line, show a reference measure with a smooth density, then a second measure decomposed into an absolutely continuous part plus a singular atom.  Use stacked colors: red smooth density and a red disk for the singular atom.
- **Intuition.** The Lebesgue decomposition and relative density become visible before they are used in KL, divergences, and measure duality.
- **Implementation.** Static 1D density plot with one atom and labels for the two components.
- **priority: high**

### `fig:monge-law-as-pushforward-random-variable`

- **Integration.** Chapter 2, in the probabilistic interpretation paragraph of the measures section.
- **Figure.** A simple abstract sample space represented as a square is mapped by a random variable `X` onto the real line.  Regions of the square collapse into intervals, producing the law `X_#P` as a histogram.
- **Intuition.** This clarifies that a probability law is a push-forward measure, not the random variable itself.
- **Implementation.** Draw an explicit map from a unit square to a one-dimensional value using colored bands.
- **priority: medium**

### `fig:monge-radial-map-rays`

- **Integration.** Chapter 2, immediately after the proposition on optimal transport between radial measures.
- **Figure.** Two radial densities in the plane are shown as concentric color rings.  Several rays carry red radial quantiles to blue radial quantiles while preserving angle.
- **Intuition.** The radial OT formula becomes an ordinary 1D quantile transport along every ray.
- **Implementation.** Closed-form radial Gaussian or annular densities; no discrete OT needed.
- **priority: high**

### `fig:monge-ampere-volume-change`

- **Integration.** Chapter 2, before the Monge--Ampere equation or just before its linearization proposition.
- **Figure.** A square grid is sent by a convex-gradient map to a deformed grid; each source cell is colored by its area expansion/compression, with a side density image showing the target density.
- **Intuition.** The determinant equation `det(DT) rho_beta(T)=rho_alpha` becomes a local volume-balance picture.
- **Implementation.** Use an explicit convex potential `phi(x)=|x|^2/2 + small smooth bump`; compute `T=grad phi` and the determinant on a grid.
- **priority: high**

### `fig:monge-mtw-focus-defocus`

- **Integration.** Chapter 2, after the paragraph on Ma--Trudinger--Wang curvature.
- **Figure.** Compare two toy costs by transporting a small source blob toward a moving target point: one cost preserves a smooth focused family of maps, while the other creates crossing/folding rays.
- **Intuition.** MTW is presented as a regularity condition; this figure gives a geometric cartoon of why curvature of the cost matters.
- **Implementation.** Use schematic rays rather than a heavy PDE solve; keep it as a clean conceptual two-panel figure.
- **priority: medium**

### `fig:kantorovich-gluing-particle-factorization`

- **Integration.** Chapter 3, in the continuous gluing paragraph and triangle-inequality proof.
- **Figure.** Three 1D marginals `alpha`, `beta`, `gamma` are shown.  Transport particles from alpha to beta and beta to gamma, then display the induced alpha-to-gamma particles after sampling a conditional intermediate point.
- **Intuition.** The gluing lemma becomes a probabilistic composition mechanism instead of only a formula for `P diag(1/b) Q`.
- **Implementation.** Sample a small finite coupling through an intermediate histogram; draw paired polylines through the middle axis.
- **priority: high**

### `fig:kantorovich-wasserstein-ball-1d`

- **Integration.** Chapter 3, in the metric properties section after defining `W_p`.
- **Figure.** Around a central 1D Gaussian density, show several densities at the same approximate `W_2` radius: translated, widened, and split variants.  Contrast with a narrow `L^2` perturbation band.
- **Intuition.** A Wasserstein ball is a set of spatial deformations, not just pointwise vertical perturbations of a density.
- **Implementation.** Use exact 1D quantile distances and select a few parametric densities with matched distance.
- **priority: high**

### `fig:kantorovich-branching-geodesic-space`

- **Integration.** Chapter 3, in the paragraph on general geodesic spaces.
- **Figure.** On a Y-shaped metric graph, transport a mass at the bottom branch to two endpoint masses.  Display two possible choices of geodesics at the branching point and the induced interpolation.
- **Intuition.** It explains why non-unique point geodesics require choosing a geodesic selection when lifting plan interpolation to general spaces.
- **Implementation.** Static metric graph with particles moving along edges.
- **priority: medium**

### `fig:kantorovich-winfty-thickening`

- **Integration.** Chapter 3, in the `W_infinity` robustness paragraph.
- **Figure.** A compact red support in the plane is progressively thickened by radius `r`; show the smallest radius for which it covers the blue support under a feasible matching.
- **Intuition.** `W_infinity` is the maximum displacement needed to transport mass, so it behaves like a support-thickening distance.
- **Implementation.** Use two small point clouds and draw disks of radius `r` around source atoms.
- **priority: high**

### `fig:dual-auction-price-tents`

- **Integration.** Chapter 4, after the auction algorithm section.
- **Figure.** For a small 1D assignment, show blue objects as price tents.  As prices rise, each red bidder changes its preferred object; the selected object is the lowest adjusted cost.
- **Intuition.** Auction prices are not arbitrary dual variables; they reshape the preference landscape seen by each bidder.
- **Implementation.** Explicit small cost matrix; plot adjusted costs `C_ij - p_j` as colored curves for a few price states.
- **priority: medium**

### `fig:dual-slack-heatmap-support`

- **Integration.** Chapter 4, in the general dual formulation after the definition of admissible potentials.
- **Figure.** Display the nonnegative slack matrix `C-f-g` as a heatmap.  Overlay the primal transport support exactly on the zero-slack entries.
- **Intuition.** This is the discrete version of contact-set complementary slackness and is easier to read than potentials alone.
- **Implementation.** Small 1D or 2D discrete OT plan from POT, then dual variables from the LP or Sinkhorn at tiny epsilon as an approximation.
- **priority: high**

### `fig:semidiscrete-cell-boundary-motion`

- **Integration.** Chapter 5, in the semi-discrete section after Laguerre cells are defined.
- **Figure.** Move one target weight continuously and show how adjacent Laguerre boundaries slide, while the target atom stays fixed.
- **Intuition.** The weights act like vertical lifts of paraboloids, and cell boundaries move even when sites do not.
- **Implementation.** Compute power diagrams on a grid for three values of one weight.
- **priority: high**

### `fig:w1-earthmover-cumulative-area`

- **Integration.** Chapter 5, in the Wasserstein-1 norm paragraph for the 1D case.
- **Figure.** Show two 1D densities, the signed cumulative difference, and shade the area under its absolute value, equal to `W_1`.
- **Intuition.** The `W_1` formula in one dimension becomes a visible area between cumulative masses.
- **Implementation.** Smooth 1D Gaussian mixtures; compute cumulative sums.
- **priority: high**

### `fig:dualnorms-witness-regularity-ladder`

- **Integration.** Chapter 6, after introducing IPMs and before RKHS/MMD.
- **Figure.** Use the same signed discrepancy and show three witness classes: bounded functions for TV, Lipschitz functions for `W_1`, and RKHS-smooth functions for MMD.  Each witness is drawn above the same red-blue signed measure.
- **Intuition.** The hierarchy of dual norms is a hierarchy of allowed test-function roughness.
- **Implementation.** One-dimensional signed density; construct representative witnesses by clipping, cumulative integration, and kernel smoothing.
- **priority: high**

### `fig:sinkhorn-reference-measure-effect`

- **Integration.** Chapter 7, in the relative-entropy reformulation section.
- **Figure.** Same marginals and same cost, but two reference couplings: product reference and a biased prior kernel.  Display the resulting entropic plans side by side.
- **Intuition.** The KL term regularizes toward a reference measure; changing the reference changes the preferred diffuse plan.
- **Implementation.** 1D histograms and Sinkhorn with a modified Gibbs/reference kernel.
- **priority: high**

### `fig:sinkhorn-temperature-bias-cartoon`

- **Integration.** Chapter 7, in the Sinkhorn divergences section, just before explaining debiasing.
- **Figure.** Compare `OT_epsilon(alpha,beta)`, `OT_epsilon(alpha,alpha)`, and the debiased combination as three bars while showing the self-coupling blur of a single empirical measure.
- **Intuition.** Entropic OT has a positive self-cost because it spreads mass; the Sinkhorn divergence subtracts this blur bias.
- **Implementation.** Small point cloud, Sinkhorn plans for self and cross terms.
- **priority: high**

### `fig:sinkhorn-continuous-flow-potential-to-map`

- **Integration.** Chapter 8, in the continuous epsilon-Sinkhorn flow section after the PDE definition.
- **Figure.** Along the continuous flow, show snapshots of the potential `u_t`, its gradient map `Id+grad u_t`, and the pushed density for three times.
- **Intuition.** The parabolic PDE is not just a potential evolution; it gradually builds the Monge--Ampere transport map.
- **Implementation.** Reuse the existing 1D continuous Sinkhorn notebook or make a 1D version with `u'_t` and transported density.
- **priority: medium**

### `fig:sample-complexity-hole-filling`

- **Integration.** Chapter 8, in sample complexity after discussing intrinsic dimension.
- **Figure.** Compare empirical samples from a 2D square and from a 1D curve.  Draw Voronoi-like coverage holes and nearest-reference transport segments.
- **Intuition.** High-dimensional OT is hard because samples leave large holes; lower-dimensional supports fill much faster.
- **Implementation.** Static samples with nearest-neighbor distances to a dense reference; no rate plot.
- **priority: high**

### `fig:unbalanced-three-mechanisms`

- **Integration.** Chapter 9, at the start of unbalanced OT before the KL/TV examples.
- **Figure.** Three side-by-side cartoons for a single source bump and target bump: pure transport, pure growth/destruction, and mixed reaction-transport.
- **Intuition.** It makes clear that unbalanced OT trades between moving mass and changing mass.
- **Implementation.** 1D Gaussian bumps with simple hand-crafted interpolations.
- **priority: high**

### `fig:sliced-null-directions`

- **Integration.** Chapter 9, after sliced Wasserstein is defined.
- **Figure.** Two different 2D point clouds have very similar projections along one direction but very different projections along another.  Show the misleading direction and the revealing direction.
- **Intuition.** Sliced OT depends on averaging many projections; a single projection can miss geometry.
- **Implementation.** Two anisotropic Gaussian mixtures and projected histograms.
- **priority: high**

### `fig:procrustes-vs-icp-correspondences`

- **Integration.** Chapter 9, in the Wasserstein--Procrustes paragraph where ICP is mentioned.
- **Figure.** Compare nearest-neighbor ICP correspondences and OT correspondences for a rotated/translated partial shape.  ICP has many-to-one collapses; OT distributes correspondences mass-preservingly.
- **Intuition.** It visually justifies the improvement over classical ICP-type registration.
- **Implementation.** Small shape point clouds; nearest-neighbor map and balanced OT assignment.
- **priority: high**

### `fig:barycenter-location-vs-shape-average`

- **Integration.** Chapter 10, at the start of OT barycenters.
- **Figure.** Compare Euclidean averaging of densities with Wasserstein barycentering for two shifted 1D Gaussians: Euclidean average has two modes, Wasserstein barycenter has one centered mode.
- **Intuition.** OT barycenters average locations rather than intensities.
- **Implementation.** Closed-form 1D Gaussian barycenter and arithmetic density average.
- **priority: high**

### `fig:low-rank-plan-as-two-stage-routing`

- **Integration.** Chapter 10, in low-rank OT after the factorized coupling definition.
- **Figure.** A 2D transport is routed through `r` violet hubs.  Show red-to-violet and violet-to-blue couplings as two layers, plus the collapsed red-to-blue plan.
- **Intuition.** Low-rank OT is a transport through a small latent measure, not just a matrix factorization trick.
- **Implementation.** Small Gaussian-mixture point clouds and chosen hub locations; optional alternating update.
- **priority: high**

### `fig:capacity-saturation-pattern`

- **Integration.** Chapter 10, in capacity-constrained OT after the capped problem is defined.
- **Figure.** Display a coupling matrix with entries colored by whether they are zero, strictly between bounds, or saturated at capacity.  Add side marginals.
- **Intuition.** Capacity constraints create active saturated regions analogous to obstacles in the coupling matrix.
- **Implementation.** Reuse a 1D capped Sinkhorn computation and plot a categorical mask.
- **priority: medium**

### `fig:mot-call-spread-convex-order`

- **Integration.** Chapter 10, in the martingale OT subsection after convex order is introduced.
- **Figure.** For two 1D laws with the same mean, plot the integrated call functions `K_alpha(t)=int (x-t)_+ d alpha` and `K_beta(t)`.  The wider law lies above the narrower one.
- **Intuition.** Convex order becomes a visible family of one-dimensional inequalities.
- **Implementation.** Smooth Gaussian laws with different variances; numerical quadrature.
- **priority: high**

### `fig:gw-label-invariance-distance-matrix`

- **Integration.** Chapter 11, at the start of Gromov--Wasserstein discrete formulation.
- **Figure.** Show the same metric-measure space with permuted labels: point clouds look reordered, but distance matrices are identical up to simultaneous row-column permutation.  GW ignores labels and compares distance structures.
- **Intuition.** It explains why GW uses pairwise distances instead of an ambient cost.
- **Implementation.** Small point cloud, distance matrix heatmaps before/after permutation.
- **priority: high**

### `fig:gw-feature-geometry-tradeoff-slider`

- **Integration.** Chapter 11, in the fused GW paragraph after the current fused geometry figure.
- **Figure.** A row of panels as the fusion parameter goes from feature-only to geometry-only, with correspondences changing smoothly or abruptly.
- **Intuition.** The fused objective is a tradeoff between attributes and structure, controlled by a meaningful knob.
- **Implementation.** Reuse the current small featured point-cloud construction with several alpha values.
- **priority: medium**

### `fig:quantum-density-matrix-eigenvalue-simplex`

- **Integration.** Chapter 11, after defining Hermitian and density matrices.
- **Figure.** For `3 x 3` diagonal density matrices, show the probability simplex of eigenvalues.  Mark pure states at vertices, mixed states inside, and entropy contours.
- **Intuition.** The classical simplex sits inside quantum states as the commuting diagonal case.
- **Implementation.** Triangle plot with entropy contours; no quantum OT solve.
- **priority: high**

### `fig:dynamic-continuity-equation-flux-balance`

- **Integration.** Chapter 12, at the beginning of evolutions over measures.
- **Figure.** On a 1D grid, show density entering and leaving a small interval; the change of mass equals incoming flux minus outgoing flux.
- **Intuition.** The continuity equation becomes a local conservation statement before the weak formulation.
- **Implementation.** Static 1D density and arrows at interval endpoints.
- **priority: high**

### `fig:dynamic-bb-straight-lines-vs-curved-paths`

- **Integration.** Chapter 12, immediately after the Benamou--Brenier formula.
- **Figure.** Same source-target point pairs in the plane, compare straight-line characteristics and deliberately curved paths.  A small side bar indicates the larger kinetic action of the curved path.
- **Intuition.** Least action selects constant-speed geodesic characteristics in Euclidean space.
- **Implementation.** Analytic paths, no OT solve.
- **priority: medium**

### `fig:dynamic-markov-chain-edge-mobility`

- **Integration.** Chapter 12, in discrete Wasserstein geometries on Markov chains before the simplex distance figure.
- **Figure.** A three-state Markov chain triangle with edge fluxes.  Edge thickness is proportional to logarithmic-mean mobility between endpoint masses.
- **Intuition.** The Maas metric lives on graph edges and weights flux by a nonlinear mean of endpoint densities.
- **Implementation.** Static simplex point with three edge mobilities.
- **priority: high**

### `fig:gradflow-energy-dissipation-identity`

- **Integration.** Chapter 13, after introducing Wasserstein gradient formula and before examples.
- **Figure.** Along a 1D gradient flow, show energy decreasing and cumulative dissipation increasing so that their sum remains approximately constant.
- **Intuition.** The energy-dissipation identity becomes a conservation-of-accounting picture.
- **Implementation.** Use heat or OU flow on a 1D grid and compute energy/dissipation numerically.
- **priority: medium**

### `fig:gradflow-congestion-pressure-barrier`

- **Integration.** Chapter 13, in gradient flows under density constraints.
- **Figure.** A crowd density moves downhill toward a potential well but hits the cap `rho <= kappa`; display the pressure field as a shaded region where the cap is active.
- **Intuition.** The pressure is a Lagrange multiplier that appears exactly on saturated zones.
- **Implementation.** Extend the existing density-constrained 1D figure by plotting pressure/reaction proxy below the density.
- **priority: high**

### `fig:gradflow-mckean-vlasov-chaos-cartoon`

- **Integration.** Chapter 13, in the stochastic particles and McKean--Vlasov paragraph.
- **Figure.** Show several interacting particle systems of increasing `n`, then their empirical histograms collapsing toward the same deterministic PDE density.
- **Intuition.** Propagation of chaos means the random empirical law becomes deterministic in the mean-field limit.
- **Implementation.** Lightweight 1D interacting drift simulation; display only snapshots, no statistical benchmark.
- **priority: medium**

### `fig:generative-score-field-mixture-basins`

- **Integration.** Chapter 14, in the connection with diffusion models paragraph.
- **Figure.** A two-Gaussian target density is shown with its score vector field.  Streamlines divide into basins of attraction toward the two modes under reverse-time sampling.
- **Intuition.** The score of a mixture is a soft assignment-weighted pull toward modes, not a single global Gaussian force.
- **Implementation.** Closed-form score of a Gaussian mixture on a grid.
- **priority: high**

### `fig:generative-gaussian-closure-failure`

- **Integration.** Chapter 14, just before the Gaussian manifold section or at its opening.
- **Figure.** Start with a Gaussian density and evolve under a nonlinear velocity field.  Show the true density becoming skewed or bimodal, alongside the moment-matched Gaussian projection.
- **Intuition.** It motivates why Gaussian closure is a projection/approximation unless the velocity is affine.
- **Implementation.** Push many particles through a simple nonlinear map and KDE the result.
- **priority: high**

### `fig:transformer-token-clustering-depth`

- **Integration.** Chapter 14, in evolution in depth of transformers after token measure evolution.
- **Figure.** Tokens on a line or plane evolve under a simplified attention-only ODE; show snapshots where clusters form or collapse depending on temperature.
- **Intuition.** Attention dynamics can be read as a transport-like clustering flow over token measures.
- **Implementation.** Small deterministic ODE with Gaussian attention kernel and fixed values.
- **priority: medium**

### `fig:moment-measure-barycenter-zero`

- **Integration.** Chapter 14, in the moment measures section after defining the moment measure.
- **Figure.** For several convex potentials in 1D or 2D, show the pushed-forward gradient samples and mark their barycenter at zero.
- **Intuition.** The barycenter constraint on moment measures is a striking invariant and deserves a visual emphasis.
- **Implementation.** Reuse moment-measure sampling with three simple potentials.
- **priority: medium**

### `fig:taxonomy-metric-choice-same-data`

- **Integration.** Cross-chapter summary figure, possibly near the transition from dual norms to generalized Wasserstein distances.
- **Figure.** Same pair of 2D measures compared by four geometries: `W_2` coupling, sliced projections, MMD witness field, and unbalanced transport with mass deletion.
- **Intuition.** The reader sees that changing the metric changes what discrepancy is considered important.
- **Implementation.** Reuse a single pair of Gaussian mixtures and lightweight computations from existing notebooks.
- **priority: high**


## Third Brainstorming Round

This third round emphasizes mechanism figures: small deterministic pictures that explain how a proof, algorithm, or geometric construction works.  The goal is to add candidates that are easy to compute, hard to misunderstand, and well localized in the manuscript.

### `fig:matching-dual-label-update`

- **Integration.** Chapter 1, in the Hungarian algorithm discussion, immediately before the actual-iterate matrix figure.
- **Figure.** Show a bipartite assignment graph with source labels, target labels, tight edges, and one label update that creates a new tight edge.  Use two panels: before and after the update.
- **Intuition.** The primal-dual Hungarian method is driven by making more constraints tight until an augmenting path appears.
- **Implementation.** Static `5 x 5` example with explicit labels and equality graph; no need to run the full algorithm.
- **priority: high**

### `fig:matching-concave-cost-uncrossing-failure`

- **Integration.** Chapter 1, near the paragraph on concave one-dimensional transport costs.
- **Figure.** On the line, contrast the monotone matching for `p>1` with a long-short pairing pattern for `p<1`, using the same ordered source and target samples.
- **Intuition.** Concave costs reward concentrating displacement, so the usual monotone rearrangement intuition can fail.
- **Implementation.** Small sorted point sets and exact assignment for `p=2` and `p=1/2`.
- **priority: high**

### `fig:matching-circle-cut-objective`

- **Integration.** Chapter 1, after the proposition on optimal transport on the circle by cutting.
- **Figure.** Show the circular matching on the left and, on the right, the total unfolded assignment cost as a function of the cut angle, with the selected cut marked in green.
- **Intuition.** The cut is not arbitrary: one searches over a one-dimensional cyclic parameter and then solves a line problem.
- **Implementation.** Use nonuniform points on the circle and evaluate all candidate cuts induced by source/target angles.
- **priority: medium**

### `fig:monge-map-plan-splitting-obstruction`

- **Integration.** Chapter 2, at the transition from Monge maps to the Kantorovich relaxation.
- **Figure.** A single red atom must be sent to two blue atoms.  The Monge panel shows impossibility, while the Kantorovich panel splits the atom into two outgoing weighted segments.
- **Intuition.** The relaxation is not cosmetic: it is the minimal extension needed when deterministic maps cannot represent mass splitting.
- **Implementation.** Static two-panel diagram with disk areas proportional to masses.
- **priority: high**

### `fig:monge-triangular-order-dependence`

- **Integration.** Chapter 2, after the triangular rearrangements paragraph.
- **Figure.** Use the same two 2D densities and compare two triangular transports: horizontal-then-vertical versus vertical-then-horizontal.  Display the intermediate pivot density for each order.
- **Intuition.** Knothe--Rosenblatt rearrangements depend on the chosen coordinate ordering, unlike the Brenier map.
- **Implementation.** Pixel histograms; perform 1D cumulative matching along rows/columns.
- **priority: high**

### `fig:monge-radial-quantile-functions`

- **Integration.** Chapter 2, after the radial-measure proposition.
- **Figure.** Pair the 2D radial transport picture with a 1D plot of the radial cumulative distributions and the radial quantile map.
- **Intuition.** Radial optimal transport is exactly one-dimensional OT after separating radius from angle.
- **Implementation.** Use two radial densities with closed-form or numerically tabulated radial CDFs.
- **priority: medium**

### `fig:monge-gaussian-commutation-test`

- **Integration.** Chapter 2, in the Gaussian measures section after the affine Gaussian OT map formula.
- **Figure.** Show two covariance ellipses and a third one reached through two successive Gaussian OT maps.  Compare a commuting case, where the composed map is optimal, with a rotated noncommuting case.
- **Intuition.** The one-dimensional composition property fails in higher dimensions because symmetric positive maps do not generally commute.
- **Implementation.** Closed-form Gaussian maps; display ellipses and a small matrix commutator norm bar.
- **priority: high**

### `fig:monge-fisher-rao-boundary-cone`

- **Integration.** Chapter 2, in the remark comparing Bures and Fisher--Rao metrics on Gaussian covariances.
- **Figure.** In the `2 x 2` PSD cone, show a Bures geodesic approaching the boundary and a Fisher--Rao geodesic bending away, with boundary annotated as finite versus infinite distance.
- **Intuition.** The same cone has very different metric completions depending on the geometry.
- **Implementation.** Use closed-form 2D covariance geodesics; render in the ice-cream cone coordinates already used in the Gaussian figure.
- **priority: medium**

### `fig:kantorovich-support-size-extreme-plan`

- **Integration.** Chapter 3, in the discrete relaxation section after the transport polytope is introduced.
- **Figure.** Display a small `4 x 5` feasible transport matrix: an extreme sparse plan with at most `n+m-1` positive entries beside a dense interior plan with the same marginals.
- **Intuition.** Linear programming optima live on sparse extreme points, while the feasible set itself contains many diffuse couplings.
- **Implementation.** Construct explicit matrices with fixed row/column sums; no solver required.
- **priority: high**

### `fig:kantorovich-tightness-escaping-mass`

- **Integration.** Chapter 3, in the existence proof for arbitrary measures.
- **Figure.** A sequence of probability densities on the line either remains tight inside a growing compact interval or leaks mass to infinity.  Use a simple side-by-side cartoon.
- **Intuition.** Tightness is the compactness mechanism behind existence of optimal couplings.
- **Implementation.** Plot translated Gaussians and compact intervals; purely illustrative.
- **priority: medium**

### `fig:kantorovich-cyclical-monotonicity-chain`

- **Integration.** Chapter 3, after the definition of `c`-cyclical monotonicity.
- **Figure.** Show a three-point cycle in the plane.  The bad cyclic reassignment is drawn as dashed crossing arrows; the monotone optimal support is drawn as solid arrows.
- **Intuition.** Cyclical monotonicity is a many-point no-improving-cycle condition, not only a two-edge swap.
- **Implementation.** Hand-picked point triplets with computed cost sums printed as tiny side bars.
- **priority: high**

### `fig:dual-envelope-contact-map`

- **Integration.** Chapter 4, after the continuous `c`-transform and before complementary slackness.
- **Figure.** In 1D quadratic cost, draw the family of parabolas defining the `c`-transform envelope; contact points indicate where the optimal map sends mass.
- **Intuition.** Dual potentials encode the transport map through envelope contacts.
- **Implementation.** Use a smooth convex potential and sample a few supporting parabolas.
- **priority: high**

### `fig:dual-lipschitz-witness-slope-saturation`

- **Integration.** Chapter 4 or Chapter 5, near the Kantorovich--Rubinstein formula for `W_1`.
- **Figure.** For two 1D densities, draw the optimal Lipschitz witness.  Highlight intervals where the slope constraint is saturated at `+1` or `-1`.
- **Intuition.** The `W_1` dual potential accumulates signed mass imbalance until the Lipschitz constraint saturates.
- **Implementation.** Compute cumulative difference between two 1D densities and integrate its sign.
- **priority: high**

### `fig:semidiscrete-weight-laguerre-volume-response`

- **Integration.** Chapter 5, in the semi-discrete Newton/descent discussion.
- **Figure.** Perturb one Laguerre weight and show its cell growing while neighboring cells shrink; include a small plot of cell mass versus weight.
- **Intuition.** The semi-discrete objective gradient is simply the mismatch between target weights and Laguerre cell masses.
- **Implementation.** Use a 2D grid and 8 target sites; recompute cells for three values of one weight.
- **priority: high**

### `fig:quantization-voronoi-centroid-condition`

- **Integration.** Chapter 5, after the optimal quantization/Lloyd algorithm paragraph.
- **Figure.** Show a density, a Voronoi tessellation, and arrows from current generators to the centroids of their cells.
- **Intuition.** Lloyd iterations alternate between assigning mass to nearest generators and enforcing centroid optimality.
- **Implementation.** 2D Gaussian mixture density on a grid with about 12 generators.
- **priority: medium**

### `fig:graph-beckmann-cycle-removal`

- **Integration.** Chapter 5, after the graph Beckmann formulation.
- **Figure.** On a graph with a signed source/sink, display a feasible flow with a useless circulation and the same flow after removing the cycle, with lower `l1` cost.
- **Intuition.** Optimal Beckmann flows do not waste mass in cycles when the cost is positive on edges.
- **Implementation.** Small planar graph with explicit edge widths; no optimization needed.
- **priority: medium**

### `fig:ipm-witness-smoothness-scale`

- **Integration.** Chapter 6, in the IPM/MMD comparison.
- **Figure.** For the same signed measure, show three witnesses: TV-like spiky, `W_1` Lipschitz, and RKHS smooth.  Put them above the same red-blue signed spikes.
- **Intuition.** The choice of test-function class controls which discrepancies are visible.
- **Implementation.** 1D signals; compute witnesses by simple clipping, cumulative integration, and Gaussian-kernel smoothing.
- **priority: high**

### `fig:mmd-bandwidth-mode-detection`

- **Integration.** Chapter 6, after the dual RKHS norm/MMD definition.
- **Figure.** Compare the MMD witness for small, medium, and large Gaussian kernel bandwidth between two nearby Gaussian mixtures.
- **Intuition.** Kernel bandwidth sets the observation scale: too small sees noise, too large merges modes.
- **Implementation.** Closed-form empirical MMD witness on a 1D grid.
- **priority: high**

### `fig:sinkhorn-kernel-support-expansion`

- **Integration.** Chapter 7, after introducing the Gibbs kernel `K=exp(-C/epsilon)`.
- **Figure.** For decreasing `epsilon`, display rows of the Gibbs kernel as heatmaps and as local neighborhoods around selected source points.
- **Intuition.** Entropic OT starts from local heat-like averaging at small `epsilon` and global dense coupling at large `epsilon`.
- **Implementation.** One-dimensional squared distance matrix; normalize rows only for visualization.
- **priority: medium**

### `fig:sinkhorn-logsumexp-underflow`

- **Integration.** Chapter 7, in the log-domain Sinkhorn paragraph.
- **Figure.** A tiny matrix heatmap shows entries of `exp((f+g-C)/epsilon)` underflowing to zero in direct arithmetic, while the log-domain potentials remain well scaled.
- **Intuition.** Log-Sinkhorn is not a cosmetic rewrite; it is a numerical necessity at small temperature.
- **Implementation.** Use a synthetic cost matrix and display values before and after subtracting the row maximum.
- **priority: medium**

### `fig:sinkhorn-bridge-endpoint-pinning`

- **Integration.** Chapter 7, in the dynamic Schroedinger bridge/path-space subsection.
- **Figure.** Brownian paths without conditioning diffuse freely, while Schroedinger bridge paths are reweighted so their endpoint clouds match prescribed marginals.
- **Intuition.** The bridge problem is Brownian motion modified by endpoint constraints, not arbitrary noisy interpolation.
- **Implementation.** Simulate Brownian bridges between matched endpoint samples; show endpoint histograms.
- **priority: high**

### `fig:convergence-bregman-pythagorean-simplex`

- **Integration.** Chapter 8, in the Bregman projection view of Sinkhorn.
- **Figure.** In a simplex triangle, draw alternating KL projections onto two affine marginal constraint sets and show the Bregman Pythagorean right-angle analogue.
- **Intuition.** Sinkhorn convergence follows from repeated information projections, not from Euclidean orthogonality.
- **Implementation.** Low-dimensional schematic with explicit KL contours.
- **priority: high**

### `fig:convergence-gaussian-sinkhorn-shrinkage`

- **Integration.** Chapter 8, in entropic OT between Gaussians.
- **Figure.** For fixed Gaussian endpoints, show covariance ellipses along entropic interpolations for several `epsilon`, with cross-covariance shrinkage indicated by thinner coupling lines.
- **Intuition.** Entropy regularization softens the deterministic Gaussian map into a noisy Gaussian coupling.
- **Implementation.** Closed-form Gaussian Sinkhorn covariance blocks.
- **priority: medium**

### `fig:sample-complexity-empty-cells`

- **Integration.** Chapter 8, in the sample complexity subsection.
- **Figure.** Uniform samples in dimensions visually represented by a line, square, and cube projection; mark empty cells at fixed grid resolution as `n` changes.
- **Intuition.** The curse of dimensionality is a coverage problem before it is a theorem.
- **Implementation.** Simple occupancy simulation; no benchmark curve required.
- **priority: medium**

### `fig:unbalanced-teleportation-vs-transport`

- **Integration.** Chapter 9, in the unbalanced OT section after transport-growth mechanisms are introduced.
- **Figure.** Compare balanced transport moving a small mode across space with unbalanced transport killing it and recreating mass near the target.  Show three time snapshots.
- **Intuition.** Unbalanced OT can prefer birth/death over long travel when marginal variation is cheap.
- **Implementation.** 1D Gaussian mixtures and unbalanced Sinkhorn barycenters.
- **priority: high**

### `fig:sliced-directional-blindness`

- **Integration.** Chapter 9, after sliced Wasserstein is defined.
- **Figure.** Two different 2D point clouds have identical projection along one direction but differ along another.  Show the projected histograms under both directions.
- **Intuition.** A single projection can be blind; sliced distances average many one-dimensional views.
- **Implementation.** Hand-designed point clouds or Gaussian mixtures.
- **priority: high**

### `fig:spectral-gauge-unit-balls`

- **Integration.** Chapter 9, after defining monotone spectral gauges.
- **Figure.** In the eigenvalue plane, draw unit balls for trace, spectral, and Schatten-like gauges.  Next to each, show the corresponding preferred covariance displacement ellipse.
- **Intuition.** The gauge chooses which covariance deformation directions are expensive.
- **Implementation.** Static contour plots in `(lambda_1,lambda_2)`.
- **priority: high**

### `fig:procrustes-coupling-rigid-step`

- **Integration.** Chapter 9, immediately before the rigid-update proposition for Wasserstein--Procrustes.
- **Figure.** Given a fixed soft coupling between two shapes, display the weighted cross-covariance arrows and the resulting best rigid alignment step.
- **Intuition.** The Procrustes update is the rigid motion that best explains the current transport correspondences.
- **Implementation.** Use two small point clouds and one precomputed coupling matrix.
- **priority: medium**

### `fig:barycenter-associativity-warning`

- **Integration.** Chapter 10, in the OT barycenter subsection after the barycenter definition.
- **Figure.** Compare the direct barycenter of three 1D measures with a two-stage barycenter obtained by first averaging two of them and then averaging with the third.
- **Intuition.** Wasserstein barycenters are variational objects; naive sequential averaging can change the result.
- **Implementation.** Use 1D quantile formulas for three simple densities.
- **priority: medium**

### `fig:capacity-dual-shadow-price`

- **Integration.** Chapter 10, in the capacity-constrained OT subsection.
- **Figure.** Display a coupling heatmap with saturated entries at the capacity cap and a matching heatmap of the dual shadow price supported on saturated regions.
- **Intuition.** Capacity constraints create congestion prices on overused source-target pairs.
- **Implementation.** Small entropic capacity-constrained 1D coupling; approximate multipliers from active constraints.
- **priority: high**

### `fig:martingale-binomial-lift`

- **Integration.** Chapter 10, in the martingale OT subsection after convex order.
- **Figure.** A 1D source distribution is lifted into two-point conditional laws whose barycenters equal each source point; the target marginal is more spread.
- **Intuition.** Martingale couplings preserve conditional means while allowing variance to increase.
- **Implementation.** Discrete grid with simple binomial kernels centered at each source point.
- **priority: high**

### `fig:gw-correspondence-matrix-vs-distance-matrix`

- **Integration.** Chapter 11, in the Gromov--Wasserstein subsection before the entropic solver.
- **Figure.** Show two small metric spaces, their distance matrices, and a correspondence matrix that tries to align similar distance patterns rather than coordinates.
- **Intuition.** GW matches relational structure; absolute positions are irrelevant.
- **Implementation.** Two small point clouds with one rotated/deformed; compute pairwise distances and a small GW plan.
- **priority: high**

### `fig:quantum-noncommuting-coupling-cartoon`

- **Integration.** Chapter 11, in the quantum OT subsection after density matrices are introduced.
- **Figure.** Use Bloch-sphere or Bloch-disk arrows for two noncommuting density matrices and contrast classical diagonal coupling with a genuinely noncommutative matrix coupling.
- **Intuition.** Quantum OT is not just classical OT on eigenvalues when matrices do not commute.
- **Implementation.** Low-dimensional `2 x 2` density matrices; mostly schematic with eigenbasis rotations.
- **priority: medium**

### `fig:dynamic-dual-hamilton-jacobi-cone`

- **Integration.** Chapter 12, after the Benamou--Brenier dual formulation.
- **Figure.** Plot a space-time potential satisfying the Hamilton--Jacobi inequality, with saturated regions along optimal trajectories and inactive regions elsewhere.
- **Intuition.** The dynamic dual is a causal barrier: optimal paths lie where the inequality is tight.
- **Implementation.** 1D quadratic transport between two Gaussians with explicit potential.
- **priority: high**

### `fig:dynamic-proximal-splitting-cartoon`

- **Integration.** Chapter 12, in the Douglas--Rachford/proximal method paragraph.
- **Figure.** Show the two constraint sets of the discretized dynamic problem: one panel for the divergence constraint, one for the kinetic perspective cone, and arrows alternating between proximal steps.
- **Intuition.** The numerical method alternates between enforcing mass conservation and enforcing convex kinetic-energy structure.
- **Implementation.** Schematic operator-splitting diagram with tiny grid icons.
- **priority: medium**

### `fig:markov-chain-mobility-edge-weights`

- **Integration.** Chapter 12, in the discrete Wasserstein geometries on Markov chains section.
- **Figure.** On a three-node simplex, show how logarithmic mean mobilities weight the edges depending on the current probability vector.
- **Intuition.** The geometry is state-dependent: moving mass along an edge is easier when both endpoint densities are present.
- **Implementation.** Simple triangle plot with edge widths computed from the logarithmic mean.
- **priority: medium**

### `fig:gradflow-jko-implicit-step-overshoot`

- **Integration.** Chapter 13, at the start of the JKO scheme discussion.
- **Figure.** Compare an explicit Euclidean-looking descent step with a JKO implicit step on a 1D density: the implicit step stays positive and moves along transport geometry.
- **Intuition.** JKO is a variational implicit Euler scheme in Wasserstein space, not a pointwise density update.
- **Implementation.** Use heat flow or KL-to-target flow on a 1D grid.
- **priority: high**

### `fig:gradflow-unbalanced-reaction-transport-split`

- **Integration.** Chapter 13, in the unbalanced gradient flow subsection.
- **Figure.** Decompose one time step into a transport component and a reaction/birth-death component for the same evolving density.
- **Intuition.** Wasserstein--Fisher--Rao gradient flows combine spatial motion with local mass change.
- **Implementation.** 1D mixture target; visualize arrows for transport and vertical bars for reaction.
- **priority: high**

### `fig:functional-talagrand-map-proof`

- **Integration.** Chapter 13, in the functional inequalities via OT section.
- **Figure.** Show the Brenier map from a measure to a Gaussian and annotate the three quantities in Talagrand's inequality: transport cost, entropy, and Gaussian convexity term.
- **Intuition.** The inequality is a geometric comparison along the transport map rather than an abstract estimate.
- **Implementation.** 1D density to Gaussian using quantile map; display map and shaded entropy/cost panels.
- **priority: medium**

### `fig:flowmatching-coupling-choice-trajectories`

- **Integration.** Chapter 14, in the flow matching section after the discussion of induced maps.
- **Figure.** Use the same source and target samples, but compare trajectories induced by independent coupling, OT coupling, and a partially shuffled coupling.
- **Intuition.** The chosen coupling changes the learned vector field even when the endpoints are fixed.
- **Implementation.** 2D Gaussian-mixture samples; straight interpolants under three couplings.
- **priority: high**

### `fig:flowmatching-speed-schedule-same-paths`

- **Integration.** Chapter 14, in the variation of interpolants paragraph.
- **Figure.** The same geometric paths are traversed with three schedules `s(t)`; show dots at equal time intervals bunching differently along the same curves.
- **Intuition.** Time parameterization changes the vector field magnitude and training distribution even when path geometry is unchanged.
- **Implementation.** Simple closed-form curves and schedules; no learning.
- **priority: medium**

### `fig:transformer-attention-plan-row-stochastic`

- **Integration.** Chapter 14, in the transformer evolution-in-depth section.
- **Figure.** Display tokens in 2D, the row-stochastic attention matrix, and the induced barycentric update of each token as a small transport plan from queries to values.
- **Intuition.** Attention is a normalized kernel coupling whose rows move tokens by barycentric averaging.
- **Implementation.** One small synthetic token cloud; compute softmax attention for two temperatures.
- **priority: high**

### `fig:moment-measure-legendre-duality`

- **Integration.** Chapter 14, in the moment measures section after the variational formulation.
- **Figure.** In 1D, show a convex potential, its derivative map, the pushed-forward moment measure, and the Legendre dual potential in aligned panels.
- **Intuition.** Moment measures are naturally tied to gradients of convex functions and Legendre duality.
- **Implementation.** Choose a smooth strongly convex potential and sample a log-concave density on the line.
- **priority: medium**

### `fig:taxonomy-static-dynamic-entropic-triangle`

- **Integration.** Cross-chapter summary near the transition between Kantorovich, Sinkhorn, and Benamou--Brenier chapters.
- **Figure.** A triangular diagram places static OT, entropic path-space OT, and dynamic Benamou--Brenier OT at the vertices.  Edges are annotated by limits: zero noise, path marginalization, and dynamic control.
- **Intuition.** It orients the reader among three formulations that otherwise appear in separate chapters.
- **Implementation.** Pure schematic with small inset examples at each vertex.
- **priority: high**

### `fig:taxonomy-map-plan-flow-field`

- **Integration.** Cross-chapter summary after dynamic OT or before generative models.
- **Figure.** The same endpoint transport is represented as a Monge map, a Kantorovich plan, a time-dependent density path, and a velocity field.
- **Intuition.** Many objects in the book are different encodings of the same transport phenomenon.
- **Implementation.** Use a 1D or 2D Gaussian-to-mixture example; compute all representations lightly.
- **priority: high**

## Shortlist

If only a small batch is implemented next, combining all brainstorming rounds, the strongest candidates are:

1. `fig:monge-pushforward-jacobian`.
2. `fig:monge-map-plan-splitting-obstruction`.
3. `fig:monge-ampere-volume-change`.
4. `fig:kantorovich-feasible-polytope-2x2`.
5. `fig:dual-envelope-contact-map`.
6. `fig:dual-slack-heatmap-support`.
7. `fig:semidiscrete-weight-laguerre-volume-response`.
8. `fig:ipm-witness-smoothness-scale`.
9. `fig:sinkhorn-scaling-simplex-projections`.
10. `fig:convergence-bregman-pythagorean-simplex`.
11. `fig:unbalanced-teleportation-vs-transport`.
12. `fig:capacity-dual-shadow-price`.
13. `fig:gw-distance-profiles`.
14. `fig:dynamic-dual-hamilton-jacobi-cone`.
15. `fig:gradflow-jko-implicit-step-overshoot`.
16. `fig:flowmatching-coupling-choice-trajectories`.
17. `fig:transformer-attention-plan-row-stochastic`.
18. `fig:taxonomy-map-plan-flow-field`.
