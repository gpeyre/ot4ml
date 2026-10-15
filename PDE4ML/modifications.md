# PDE4ML Content Synchronization and Primer Revision

> The synchronization snapshot in Sections 1--5 records the earlier, broader review. The major scope revision in Section 6 below supersedes its coverage counts and retention policy. In particular, the current paper deliberately omits several book developments that the earlier snapshot retained.

## Scope

Pass performed on 15 October 2026 against the current working-copy sources of OT4ML, including the book's uncommitted corrections. The book itself was not modified. The review remains an independently buildable, article-structured project using its existing Acta-oriented class.

This is a content-synchronization and prerequisite audit, not a claim that the article has undergone a new independent peer review of every imported theorem.

## 1. Synchronization Coverage

The three main sections were refreshed from the current book, rather than selectively patching the older copies. Their definitions, statements, proofs, assumptions, numerical descriptions and references therefore incorporate the subsequent book corrections. Chapter headings were converted to article sections and lower-level headings shifted accordingly.

| Current book source | PDE4ML section | Formal-statement coverage |
| --- | --- | --- |
| `OT4ML/sections/dynamic-ot.tex` | 2. Dynamic Optimal Transport | All 33 book statements retained; one local spectral definition added to replace an external prerequisite. |
| `OT4ML/sections/wasserstein-gradient-flows.tex` | 3. Wasserstein Gradient Flows | 67 of 69 book statements retained. Only the higher-order vertical-derivative definition and the particle-polynomial approximation remark were omitted, because no later part of the review uses them. |
| `OT4ML/sections/transportation-models.tex` | 4. Generative Models via Transportation | All 31 book statements retained; a local attention definition and Gaussian Sinkhorn proposition added to supply prerequisites previously located elsewhere in the book. |

Here a formal statement means a theorem, proposition, lemma, corollary, definition, remark or example environment. The comparison is by environment and title, not merely by counting equations or matching section names.

### Dynamic Optimal Transport

- Integrated the current path-space Schrodinger section, between the Benamou--Brenier and generalized-action developments. It includes endpoint reduction, the relative-entropy chain rule, stochastic control, viscous actions, and Brownian-bridge interpretations of Sinkhorn couplings.
- Integrated variational mean field games, including the convex momentum formulation, its congestion recession convention, the optimality system, the distinction between potential games and arbitrary MFGs, and the current hard-congestion example.
- Incorporated the book's corrected continuity-equation and superposition hypotheses, measure-valued momentum action, Hamilton--Jacobi conventions and splitting discussion.
- Synchronized generalized action values, energy-versus-distance normalizations, homogeneous momentum actions, concave mobilities, spectral actions and restricted RKHS velocities.
- Incorporated the current assumptions and scaling in the nonlocal-to-local limit. In particular, the logarithmic-mean limit is not stated for arbitrary smooth, bounded jump profiles when the cited singular-kernel theorem does not apply.
- Incorporated the corrected WFR cone normalization and the cited dynamic-plan argument for arbitrary finite measures, rather than relying on a calculation for smooth individual paths alone.

### Wasserstein Gradient Flows

- Retained the first-order distinction between vertical mass variations and horizontal transport variations, with the current domain, integrability and chain-rule hypotheses.
- Synchronized the JKO-to-PDE discussion, metric derivatives, curves of maximal slope, interacting particles, stochastic McKean--Vlasov limits, density constraints and multi-species systems.
- Synchronized displacement convexity for polynomial energies, one-dimensional interaction kernels, McCann internal energies, the power-divergence family, KL, and the Hellinger counterexample for a Gaussian target.
- Incorporated the density-cap result and the distinction between convex Euclidean geometry and bottleneck domains used by the MFG example.
- Synchronized dissipation, finite metric length, Wasserstein PL/Kurdyka--Lojasiewicz convergence and distance-to-minimizer qualifications.
- Incorporated the updated functional inequalities, including the linearized quadratic forms for divergences, MMD and squared Wasserstein loss, and the logarithmic-Sobolev/Poincare connection.
- Synchronized mean-field MLP training and the conditions needed to exclude nonoptimal stationary limits; affine convexity over measures is not substituted for displacement convexity or support-propagation hypotheses.
- Incorporated the current PMO notation and assumptions for mobility, spectral, nonlocal, unbalanced and conditional flows, and the updated finite-width/continuous-depth distinction for ResNets.
- Synchronized the second-order and phase-space developments, including their qualifications concerning empirical energies and entropy.

### Generative Models via Transportation

- Replaced the older flow-matching exposition by the current deterministic-interpolant construction and its measurable, space-time-integrable conditional-expectation field.
- Preserved the important distinction between the unconstrained regression field and the minimum-kinetic-energy Wasserstein tangent. The former is not automatically the latter.
- Incorporated the corrected sampling discussion, Gaussian product-interpolation calculation, covariance-commutation condition and scalar-schedule qualifications.
- Synchronized diffusion reversal, probability-flow ODEs, static-noise interpolants and genuinely noisy SDE paths. Reusing a single latent Gaussian is not described as independent temporal noise; matching one-time marginals is not confused with matching path laws.
- Incorporated the updated nonparametric, one-step, parameter-induced, Stein and drifting sampling flows. The induced law dynamics is not asserted to be intrinsic to the represented distribution when it depends on the generator parameterization.
- Synchronized moment-measure variational signs, the conjugate-potential argument, and the assumptions of the conjugate moment-measure construction.
- Synchronized attention, residual depth evolution, Gaussian-kernel mean shift, and the distinction between fixed-data mode seeking and self-consistent blurring consensus.
- Incorporated the current affine-velocity Gaussian criterion and its converse for the Wasserstein gradient representative, the exact ambient closure catalogue, its uniqueness caveat, the scalar restrictions, constrained Gaussian flows, Gaussian projection and distribution-free moment closure.

## 2. Primer: Only Prerequisites Used Later

The primer was rewritten as six coherent subsections. It is about six pages in the compiled article, rather than a miniature survey of unrelated static OT topics. Its source decreased from 719 to 268 lines and its figure environments from 18 to 2.

| Primer component | Why it is needed later |
| --- | --- |
| Probability measures, empirical measures, densities and push-forwards | Particle approximations, continuity equations, generators and token laws. |
| Jacobian change of variables | Density evolution, Monge--Ampere arguments and moment measures. |
| Disintegration and conditional expectation | Dynamic superposition, flow-matching regression and parameter-induced velocities. |
| Monge maps, Kantorovich couplings and their discrete matrix form | Static/dynamic equivalence, endpoint interpolants, numerical transport and bridge couplings. |
| Basic dual potentials and their additive gauge | Hamilton--Jacobi duality, entropic potentials and variational generative constructions. |
| Wasserstein distances, gluing, weak convergence and moments | JKO schemes, compactness, convergence and particle limits. |
| Brenier maps and displacement interpolation | Geodesic convexity and transport gradients. |
| Gaussian transport, Bures formula, mean and covariance conventions | Gaussian interpolation, projection and the closure catalogue. |
| Cumulative/quantile functions and normalized sliced Wasserstein | One-dimensional illustrations, sliced sampling flows and Gaussian sliced energies. |
| Internal/interaction energies, phi-divergences, KL and scores | Diffusion equations, curvature examples, entropy production and diffusion models. |
| Total variation, PSD/conditionally PSD kernels, RKHS and MMD | Markov-chain comparisons, energy-distance examples, kernelized metrics and Stein/interaction flows. |
| Entropic OT, Gibbs density, scaling identities and Sinkhorn debiasing | Schrodinger bridges, Sinkhorn learning losses and the Gaussian Sinkhorn row. |

### Material Removed from the Primer

- Detailed assignment combinatorics and proofs about empirical permutations.
- Concave-cost matching comparisons, circular cutting/unfolding and changes of the planar cost exponent.
- Birkhoff cycle extraction, rational duplication of particles and repeated illustrations of splitting.
- The nonconvex-target regularity illustration and several redundant displacement/shape/Gaussian figures.
- The duplicate first-variation definition: the precise definition now appears once, at its point of use in the gradient-flow section.

No definitions of GW, Monge gaps, general approximation theory, statistical OT rates, assignment algorithms or full Sinkhorn convergence theory were added to compensate for missing book references.

### Mathematical Clarifications in the Primer

- Wasserstein convergence is stated on a Polish space as weak convergence plus convergence of the matching moment, not merely under compact support.
- Relative Wasserstein compactness uses uniform integrability of moments; a bounded moment of exactly the same order is not claimed to suffice.
- Discrete plans and costs use `\P` and `\C`, with indices `i,j`. Entries of a plan are masses, not row-normalized conditional probabilities.
- Quantiles use the book's `\cumul{\alpha}` notation, rather than introducing an independent `F`/`Q` convention.
- The source absolute-continuity assumption in Brenier's theorem is explicit; the classical Monge--Ampere calculation is not presented as a regularity theorem.
- Centered covariance, raw second moment, variance and standard deviation are distinguished explicitly.
- Phi-divergences include the recession cost for singular mass and the zero-times-infinity convention needed in the later power-family statements.
- Shannon entropy against Lebesgue measure is distinguished from the mass-corrected KL formula for finite reference measures.
- The conditional positivity needed for the kernel `-|x-y|` is included, without incorrectly treating that kernel itself as an ordinary positive-semidefinite RKHS kernel.
- Spherical measure is normalized to probability, consistently giving the factor `1/sqrt(d)` in the sliced comparison and `1/d` in later gradients.
- Entropic transport uses the product-marginal KL convention throughout; the debiased loss is not confused with the raw entropic cost.

## 3. Closing Dependencies on Excluded Book Chapters

- **Spectral geometry:** added its short static definition where dynamic spectral transport is introduced. Replaced the missing reference to the robust-distance theorem by a direct gluing proof of the triangle inequality and norm equivalence.
- **WFR:** defined the cone apex and the mass projection `P_2` locally instead of referring to the omitted static-unbalanced chapter.
- **Measure-valued momentum:** defined the vector measure's total-variation measure and the meaning of domination by a scalar reference before using its Radon--Nikodym perspective. This does not add a separate vector-measure topic to the primer.
- **Conditional geometry:** explained and defined the fiberwise metric in the ResNet discussion, where its fixed conditioning marginal matters.
- **Attention:** restored the discrete softmax formula, query/key/value dimensions, permutation equivariance and mean-field definition at the start of the transformer discussion, not in the primer. Retained the distinction between increasing depth and increasing token count.
- **Gaussian Sinkhorn loss:** added the closed spectral energy and its scalar helper next to Gaussian flows. The catalogue and the scalar table now refer to this local proposition, and the helper is not redefined in the one-dimensional paragraph.
- **Moment measures:** replaced an implicit sigma-finite KL reference by the explicit Shannon-entropy convention already fixed in the primer.
- **Elementary analytic operations:** made the Legendre-transform formula explicit in the moment-measure dual and recalled convolution's independent-sum interpretation in flow matching, at their point of use rather than adding a separate primer excursus.
- **Other book-only pointers:** removed dangling references to Lloyd's algorithm, the full statistical bias/variance discussion and vector-valued transport; retained the relevant explanation or pointed to the local product/mobility examples.
- **Consensus:** kept the positive-kernel comparison with Sinkhorn as a cited background connection, not as a reference to an absent Hilbert-convergence theorem. The stated convergence uses finite-p Wasserstein distances already defined in the article.
- **Gaussian projection:** made its barycenter application a short locally defined example instead of an unsupported reference to the book's barycenter proposition.

## 4. Opening Literature Guide and Journal Adaptation

The literature guide was reduced from approximately 292 to 99 words under the same source-level count (excluding the expanded citation text). It now contains only general background and the reading map. Foundational research papers and specialized contributions remain in the relevant mathematical sections rather than being duplicated in an opening bibliography parade.

General references added and checked against primary sources:

- Higham, Higham and Grindrod, *Diffusion Models for Generative Artificial Intelligence: An Introduction for Applied Mathematicians*, **SIAM Review** 67(3), 607--623 (2025), [publisher record](https://doi.org/10.1137/23M1626232).
- Tang and Zhao, *Score-based Diffusion Models via Stochastic Differential Equations -- A Technical Tutorial*, [arXiv:2402.07487](https://arxiv.org/abs/2402.07487), revised July 2025.
- Chewi, *Log-Concave Sampling*, [author's textbook manuscript](https://chewisinho.github.io/main.pdf), version dated 20 August 2026. This is identified as a manuscript, not given an invented publisher or publication venue.

Additional adaptations:

- Updated the abstract to describe the actual scope, including bridges and variational MFGs. Replaced the unsupported suggestion of SPDE limits by stochastic-process limits.
- Kept article-level numbering and the existing Acta-oriented class; updated local notation and theorem/algorithm support from the book.
- Retained the double-nabla Wasserstein gradient macro, upright discrete matrices, unbold mean/covariance notation and the current Gaussian projection symbol.
- Adapted the imported numeric-style citations to the journal's author-year presentation. After consolidation of the opening guide, there are 190 citation contexts: 152 parenthetical and 38 narrative citations.
- Removed chapter-based language and unnecessary references to the rendering style of book figures.
- Updated `readme.md` and `guideline.md` so the intended curated synchronization policy is explicit.

## 5. Bibliography, Figures and Validation

- Updated the local bibliography from the current book, preserving its corrected records. It contains 76 additional book entries and the 3 general references above; no old review-only records were lost. Only cited entries are printed in the article.
- Checked **all 146 referenced local PDF assets**, including paths passed through figure macros, against the current book. All are byte-identical to their book counterparts.
- Refreshed **14 figure files**: 9 existing Brunn--Minkowski/HWI panels and 5 newly needed Schrodinger-bridge/MFG panels. Unused legacy figure files were not deleted.
- Source-level checks found **no unresolved references, missing citation keys or duplicate labels**. The final source uses 240 distinct referenced labels and 164 distinct citation keys.
- The normal `make` build succeeds with LaTeX/BibTeX. The PDF has **118 pages**. There are no overfull boxes, undefined references, undefined citations or BibTeX warnings. Nonfatal legacy math-font substitutions and underfull vertical boxes are not being presented as content errors.
- Rendered every page for layout review; inspected the primer's dense formulas and Gaussian catalogue at larger resolution. Fixed the long inline Tweedie calculation that produced the remaining overfull box.
- Numerically checked the local Gaussian Sinkhorn spectral formula against its displayed covariance gradient on random positive-definite matrices at three temperatures. The maximum normalized finite-difference discrepancy was below `1e-9`; this is a consistency check, not a substitute for the analytic argument.
- The same build succeeds in an isolated copy containing only the review's 10 source/support files and its 146 referenced figure assets, with no adjacent OT4ML directory. This verifies that the review does not need the book at build time.

### Synchronization Snapshot

SHA-256 prefixes of the book sources used for this pass:

| Source | Digest prefix |
| --- | --- |
| Dynamic OT | `c3a381b3db93284a` |
| Wasserstein gradient flows | `5c03fea86d6c6428` |
| Generative models | `555036c0ef19837f` |
| Notation | `bf64fd4e80d8760c` |
| Shared style | `dcca319b39f892fb` |
| Bibliography | `c1f45dce1dbda61d` |

The hashes describe the working-copy synchronization source, not a new book commit. No commit or push was performed as part of this pass.

## 6. Focused Review: Major Scope Revision (15 October 2026)

### Requested Cuts and Replacements

| Original location | Applied revision |
| --- | --- |
| 1.4 Quantiles and Sliced Wasserstein | Removed the subsection and the sliced definition. Retained the CDF/quantile formula and 1D geodesic description in a compact example within Wasserstein Geometry, together with its three-panel figure. |
| 1.6 Entropic Transport and Debiasing | Removed the entire subsection, its coupling-density/scaling formulas and the Sinkhorn-divergence notation. |
| Proximal splitting | Removed the splitting discussion, proximal formulas and Douglas--Rachford pseudocode. Retained the independent silhouette/geodesic figure and the unregularized path-space formulation. |
| 2.3 Path-Space Schrodinger Problem | Removed the entire section and its bridge figure. |
| 2.4--2.7 Generalized, nonlocal and unbalanced distances; variational MFG | Replaced the detailed sections by one prose-only paragraph at the end of Benamou--Brenier, explaining mobility, edge/jump fluxes, mass change and potential population games with literature pointers. |
| Density-constrained and multi-species flows | Removed both paragraphs and their figures. |
| Geodesically convex constraints | Removed the paragraph and its associated density-cap and target-discrepancy discussion, including the sliced semiconcavity formulas. |
| Convexity and curvature | Removed the metric-measure/Ricci-curvature excursus. |
| 3.3 Functional Inequalities via OT | Removed the subsection, its statements/proofs and both associated figures. |
| 3.5--3.7 Generalized, nonlocal and unbalanced flows | Replaced by one short prose-only paragraph with references, leading into the retained conditional ResNet geometry. |
| 3.9 Second-Order Momentum Flows | Removed the subsection, phase-space and entropy lifts, and both associated figures. |
| 4.2 One-Step Generative Models | Removed the sliced-flow example, velocity formula and comparison figure. Retained the general discrepancy-flow construction, with ordinary Wasserstein and MMD examples. Sinkhorn-based learning papers are mentioned only verbally, without reinstating loss notation. |
| Stein variational gradient descent | Removed the paragraph, its kernelized descent definition and its comparison figure. |
| 4.3 Moment Measures | Removed the subsection, its variational and conjugate constructions, and its figure. |

### Downstream Coherence

- Rewrote the abstract and the dynamic-OT/gradient-flow introductions and transitions to describe the narrower review. The paper no longer promises bridges, congestion, functional inequalities or inertial dynamics.
- Removed the unused primer introduction of finite-mass reaction--transport measures and the separate total-variation definition. The phi-divergence definition now directly concerns probability laws; its singular-part convention remains necessary for the retained examples.
- Removed the entire Gaussian Sinkhorn prerequisite paragraph, both sliced/Sinkhorn rows of the ambient Gaussian catalogue, all their auxiliary matrices and scalar helpers, and the corresponding proof branches.
- Removed the Sinkhorn row of the scalar Gaussian energy table. Relative Fisher information is now explicitly introduced at its remaining point of use in the Gaussian catalogue, so deleting the functional-inequalities section leaves no missing prerequisite.
- Removed the Sinkhorn-force panel from the particle-geometry comparison and the covariance-inflation panel from the Gaussian-path figure. Updated the surrounding prose and captions to match the remaining panels.
- Replaced the ResNet introduction's pointer to a deleted generalized-flow section by the retained Benamou--Brenier section; the depthwise metric and fiberwise first variation remain defined locally.
- Simplified the mean-shift consensus explanation so it no longer relies on undeveloped Dobrushin or Sinkhorn-contraction terminology.
- Kept brief references to Sinkhorn learning and attention methods where relevant, explaining their role in words. There are no surviving sliced-distance, debiased-cost, Gaussian Sinkhorn, WFR, PMO or removed-action formulas in the active source.
- Corrected an existing inconsistency in the flow-matching introduction: Gaussian product-interpolation conditional velocities are tangent gradients for commuting endpoint covariances, but need not be so for general Gaussian endpoints. This now agrees with the later explicit affine-velocity proposition.
- Updated `readme.md` and `guideline.md` to record the exclusions explicitly and prevent wholesale book synchronization from restoring them.

### Figures and Layout

- Reduced Figure 1.1's coupling panels from `0.43` to `0.31` of the text width, with a modest fixed gap.
- Standardized the larger paired plots at more compact widths and reduced the three-row Fokker--Planck figure from `0.86` to `0.78` of the text width.
- Changed forced `[H]` figure placement to ordinary `[htbp]` placement to avoid gaps caused by immovable figures.
- Regenerated the Gaussian energy figure with exactly three panels: KL, squared Wasserstein distance and relative Fisher information. The local file is `figures/gradflow-gaussian-1d-energy-landscapes/flows-focused.pdf`; the book's four-panel figure is unchanged.
- Added `scripts/render-focused-gaussian-figure.py`, which reuses the book notebook's functions and styling, selects the three retained energies and writes only the review-specific PDF. Positivity, energy decrease and endpoint checks pass for all three flows; their final parameter errors are below `9e-4`.
- Shortened the Benamou--Brenier silhouette caption and removed a redundant Gaussian-table heading that became stranded at a page boundary.
- Unused legacy figure assets remain on disk; they are not included in the PDF. No source assets were deleted merely because their discussion was excluded.

### Validation

- The manuscript has **14 subsections instead of 27**, **20 figure environments instead of 36**, and **53 referenced figure assets instead of 146**. The four section sources have approximately **4,250 lines instead of 8,400**.
- Static checks found no unresolved references, missing citation keys, duplicate labels, unbalanced environments or unreferenced retained figures. There are 115 distinct referenced labels and 94 distinct citation keys.
- The project LaTeX/BibTeX build succeeds with no undefined references/citations, overfull boxes or BibTeX warnings. The existing small-size math-font substitutions are nonfatal.
- The final PDF has **62 pages, down from 118** in the immediately preceding review.
- Rebuilt successfully in an isolated temporary directory containing only the review sources, local class/styles/bibliography and its 53 referenced figure PDFs. The isolated result also has 62 pages, confirming that none of the removed material or the adjacent book is required to compile the review.
- The single-file editor compiler cannot load the local `acta-numerica.cls`; validation therefore uses the complete project build documented in `readme.md`.
- Rendered and inspected the complete PDF, with particular attention to the primer, section transitions, figure panels and Gaussian catalogue.
- The main OT4ML manuscript and figures were not modified during this scope revision. No commit or push was performed.

## 7. Mathematical and Editorial Recheck (15 October 2026)

This pass reviewed all four retained sections, their proofs and examples, the primer's prerequisite coverage, and the front matter. It works on the focused review produced in Section 6, not on the earlier 118-page version. The excluded topics have not been restored. The main OT4ML manuscript and its figures were not edited.

### Primer and Order of Introduction

- Corrected the scalar Gaussian formula: the sum of squared mean and standard-deviation differences is the **squared** Wasserstein distance, not the distance.
- Specified finite exponents `1 <= p < infinity` in the Wasserstein definition and quantile formula, and finite second moments for displacement geodesics.
- Defined the discrete matrix pairing explicitly. Explained the subdifferential appearing in the Brenier discussion and replaced unexplained cyclic-monotonicity terminology by its cost-reassignment meaning.
- Identified the uniform law in the quantile construction explicitly.
- Qualified the Radon--Nikodym formula for KL by absolute continuity; singular laws retain the infinite-value convention already stated in the definition.
- Removed the premature, duplicate score definition from the primer. The score is introduced in the gradient-flow discussion before the diffusion-model formulas need it.
- Defined a characteristic kernel at its first substantive occurrence, including the relevant class of probability laws.
- Defined the Wasserstein tangent space as the `L^2(alpha)` closure of compactly supported smooth gradients, and proved its identification with the orthogonal complement of weighted-divergence-free fields. Later uses of tangent representatives now point to this definition.
- Moved the Lipschitz/bounded-gradient remark after the metric slope and strong upper gradient have been defined.
- Moved relative Fisher information and the raw-second-moment discrepancy matrix before their first use in the Gaussian catalogue.

### Continuity Equations and Dynamic OT

- Added the initial condition `T_0 = Id` to the Lagrangian-flow proposition; without it, the claimed initial law was inconsistent with its definition.
- Gave an elementary sufficient well-posedness setting for the characteristic ODE and explained narrow continuity as weak continuity.
- Strengthened the bounded-domain Dacorogna--Moser construction to smooth boundaries and densities bounded away from zero on the closure, so division by the density and the characteristic argument have the stated regularity.
- Corrected the Benamou--Brenier normalization: the squared distance is twice the preceding half-normalized least-squares energy, or the unhalved action in the theorem. Made the finite-energy admissibility and second-moment requirements explicit.
- Restricted the perspective homogeneity identity to positive scaling factors and separately gave its value at the origin, avoiding an undefined `0 * infinity` expression.
- Replaced density/measure mixtures inside Lebesgue integrals by density notation. The first-variation proof similarly distinguishes an integral against a density from a distributional pairing.
- Added the missing logical step in the dynamic dual proof: computing the pointwise conjugate identifies a dual, but does not itself justify exchanging infimum and supremum. The proof now invokes static Kantorovich duality and the Hopf--Lax extension, with references for smooth-subsolution approximation. The nonsmooth formulation is described in its Euclidean scope, not as an unjustified smooth-gradient formula on arbitrary metric-measure spaces.
- Added a precise source for the superposition principle used in the Benamou--Brenier proof.
- Removed the incorrect general identification of flow-matching regression with least-kinetic-energy inversion. These velocities can differ by a weighted-divergence-free field; the minimum-energy claim is retained only in the appropriate Gaussian-gradient case.

### Gradient Flows and Convergence

- Corrected the minimizing-movement terminology: the piecewise-constant curve is a discrete interpolation, and a suitable vanishing-step limit is the minimizing movement. Existence and convergence are not asserted by definition.
- Corrected the implicit-Euler discussion. Uniqueness of a minimizer does not by itself make `Id + tau grad h` invertible; the stationarity equation and an appropriate invertibility hypothesis are now distinguished.
- Qualified uniqueness of first variations modulo constants by the richness of the admissible perturbations, and explicitly required the Wasserstein gradient to be a tangent representative.
- Corrected the energy-dissipation discussion. Under the stated strong-upper-gradient assumption, the maximal-slope inequality is necessarily an equality; it is not merely "usually" saturated in smooth examples. Added the short chain-rule/Young-inequality argument. The extra square-root-of-two length factor is now attached only to a weaker kinetic-energy bound, not to this stronger maximal-slope setting.
- Qualified passage of dissipation inequalities to limits by the necessary lower-semicontinuity hypotheses.
- Specified finite initial energy, locally absolutely continuous energy, and local `AC^2` regularity in the PL/Kurdyka--Lojasiewicz rate theorems. The KL definition now has a finite reference infimum. Reused the previously defined metric slope rather than redefining it by a formal gradient formula.
- Made explicit the smooth-density, chain-rule and distance-differentiation setting of the convex energy-decay proof. Strong geodesic convexity supplies a PL inequality but does not by itself prove existence of a global flow satisfying all the rate theorem's hypotheses.
- Corrected the McCann proof's regular starting class: smooth densities on bounded convex supports with a regular nondegenerate transport map, not globally positive compactly supported densities. Explicitly excluded the zero-exponent endpoint from the fast-diffusion shorthand.
- Corrected the flat-reference phi-divergence application. McCann's stated theorem assumes the internal-energy integrand vanishes at zero. When `phi(0)` is finite, the correct normalized integrand is `g(s) = b[phi(s/b)-phi(0)]`. On a fixed uniform-reference probability domain this changes the energy only by a constant, but it matters to the pointwise criterion.
- Qualified fixed-weight particle preservation: labels and weights are preserved by the characteristic description while it is well posed, but collisions can reduce the number of distinct support points.
- Separated smooth-kernel interaction formulas from the nonsmooth energy-distance kernel. Its diagonal self-energy is constant, collisions require a nonsmooth interpretation or smoothing, and a fixed-particle descent need not equal unrestricted Wasserstein descent at an atomic law, which can split mass.
- Stated differentiation/integrability assumptions for interaction and network gradients, including the nonsmooth qualification for ReLU. Restricted the energy-distance separation statement to laws with finite first moment.
- Defined the Brownian and Ito conventions at first use, and specified independent noises and independent initial samples in the interacting-particle model.
- Made the McKean--Vlasov energy notation consistent with `f(alpha)` and its first variation. Identified the target-score diffusion as descent of `sigma^2 KL`, not an unscaled KL when the diffusion coefficient is `sigma^2`.
- Added finite energy of the limiting density to the affine-convex stationarity proposition.
- Added the integrated second-moment condition to the depthwise conditional Wasserstein space. Fiberwise membership in `P_2` alone would not ensure a finite depth-integrated metric.

### Generative Models and Gaussian Closure

- Corrected the atomless-source existence argument: an arbitrary target, especially an atomic one, cannot be identified with an atomless uniform probability space. It is instead realized as a measurable image of the uniform variable representing the source.
- Corrected the discrete product interpolation count: it has `nm` labelled paths, not necessarily `nm` distinct atoms.
- Corrected Gaussian-mixture noising covariances to `a_t^2 Sigma_j + b_t^2 sigma^2 Id`. The simpler noise-only covariance is valid for Dirac components, not for arbitrary Gaussian components.
- Corrected the Ornstein--Uhlenbeck proof to assign the stated covariance to the full scaled noise term, rather than the unscaled stochastic integral.
- Used local-in-time square-integrability for static-noise interpolants. This includes the usual schedule `gamma(t) = sqrt(t(1-t))`, whose derivative is integrable but not square-integrable at the endpoints. The continuity-equation argument is local on the open interval; endpoint laws follow from continuity.
- Specified independence and well-posedness assumptions for Brownian realizations. The simple scalar score correction is now explicitly restricted to spatially constant diffusion; the matrix-divergence formula remains the general one.
- Required a discrepancy to be nonnegative and to vanish exactly on the diagonal before using its global minimum as the target law.
- Restricted the normalized drifting log-ratio identity to the Gaussian kernel for which it was derived.
- Corrected the consensus explanation: common positive mass contracts support widths and diameter, not the difference of extreme velocities. Strict positivity is sufficient for the stated result, not necessary for every possible consensus mechanism. Added integrability assumptions before differentiating attention's log-partition function.
- Clearly separated an affine minimum-energy Gaussian tangent field from the regression field of a specified interpolant. The two need not coincide for noncommuting endpoint covariances. Retained the distinction between exact ambient Gaussian solutions, uniqueness of the ambient PDE, and deliberately constrained Gaussian descent.
- Added the differentiability hypothesis on the general mean/covariance functional and restricted distribution-free moment closure to the domain where its derivatives exist.
- Corrected the linear-network interpretation: the coefficients depend on the cross-covariance, but that block alone is not generally autonomous. Gave its derivative, which also involves both diagonal covariance blocks.
- Qualified Gaussian attention preservation by existence of a finite positive-definite moment solution; it is not a global non-explosion assertion.
- Reworded the non-variational catalogue to allow special cases, such as Ornstein--Uhlenbeck, that do have a gradient-flow interpretation.
- Completed the Gaussian JKO criterion's limit argument using closure of Gaussian laws, including singular covariances, under Wasserstein convergence.
- Clarified that the scalar-moment theorem concerns unconstrained characteristics before boundary contact. Made the eikonal equivalence precise by relating its constants: `2 lambda = b` and `kappa^2 - 2 lambda c = a`.

### Notation, References and Writing

- Standardized discrepancy energies as `f_beta` and neural generators as `G_theta`, instead of switching between an energy `mathcal E_beta`, a functional `f`, and a generator `f_theta`.
- Reused `delta f` for first variations, the defined MMD notation for kernel discrepancies, and the primer's cumulative/quantile notation in figure captions.
- Used `zeta` for the input-label data law in the linear-network example, consistent with the preceding learning section; `rho` remains a density.
- Standardized positive-semidefinite kernel terminology and removed an editorial figure-caption reference to an omitted spectral comparison.
- Added the full Lafferty density-manifold reference, with a more cautious historical attribution. Corrected the named authors attached to the 2010 Attouch citation to Attouch, Bolte, Redont and Soubeyran.
- Added local cross-references at prerequisite transitions and shortened redundant slope/PL formulas and finite-length commentary.
- Fixed short definition-box page breaks without disabling multipage splitting for theorem environments generally.

### Verification and Remaining Scope

- The complete LaTeX/BibTeX build succeeds. The focused PDF remains **62 pages**, with **14 subsections**, **20 figures** and **53 local figure assets**.
- Source checks find **204 labels**, **120 distinct referenced labels** and **95 distinct citation keys**, with no missing references/citations, duplicate labels, unbalanced environments or unreferenced retained figures.
- The final build has no undefined references/citations, overfull boxes, BibTeX warnings or broken-box warnings. The pre-existing substitutions for two small mathematical font sizes remain nonfatal.
- Independently checked all seven Gaussian catalogue rows by centered finite differences against the Wasserstein metric pairing, on 24 random positive-definite covariance pairs in dimensions 2, 3 and 5. The largest normalized discrepancy was below `1.7e-8`.
- Checked the Gaussian flow-matching map against its ODE and covariance push-forward identity. The respective maximum normalized discrepancies were below `2.7e-10` and `1.9e-15`; the noncommuting examples had nonsymmetric regression fields and strictly higher terminal cost than the Brenier map.
- Checked the distribution-free moment equations on non-Gaussian empirical laws and the signed-distance eikonal example, with residuals below `4e-15`. These numerical checks supplement, not replace, the analytic proofs.
- Rebuilt in an isolated directory containing only the 10 local source/support files and the 53 referenced figure assets. The isolated PDF also has 62 pages; one additional LaTeX pass settled the fresh build's cross-references.
- Rendered all 62 final pages and reviewed their layout, with enlarged checks of the Gaussian catalogue, its proofs, and the PL theorem. The short definition boxes no longer split awkwardly, and the existing compact figure sizes are preserved.
- The formal smooth calculus remains explicitly conditional on differentiation, integrability and well-posedness assumptions. This review does not assert a global PDE existence/uniqueness theorem for every catalogue entry or every learned field.
- No commit or push was performed in this pass.
