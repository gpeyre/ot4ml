# PDE4ML synchronization audit

## Scope

Compared the independent `PDE4ML/` review with the current OT4ML sources for dynamic optimal transport, Wasserstein gradient flows, transportation models, notation, bibliography, figures, labels and citations. The review remains intentionally focused: algorithmic OT and the full Sinkhorn theory are not copied unless they are prerequisites for a PDE or machine-learning argument.

## Primer on optimal transport

- Defined weak convergence and the finite-moment spaces `P_p(X)` before their first use.
- Added the characterization of Wasserstein convergence by weak convergence plus convergence of moments, clarifying the compactness mechanism used later.
- Added disintegration and conditional laws, including the conditional-expectation formula required by flow matching and parameterized push-forward models.
- Added static Kantorovich duality, dual potentials and complementary slackness to support later Hamilton--Jacobi, entropic and adversarial interpretations.
- Added the general one-dimensional quantile coupling and the exact `W_p` quantile formula, which are repeatedly used for geodesics and scalar numerical flows.
- Added a compact functional dictionary: first variations, scores, relative entropy, MMD and sliced Wasserstein distance, with the first-variation formulas needed later.
- Reorganized the quantile result after the discrete coupling discussion so that the progression remains general measures, discrete relaxation, one-dimensional closed form, Brenier theory and Wasserstein geometry.

## Dynamic optimal transport

- Synchronized the opening of generalized dynamic Wasserstein distances with OT4ML by introducing the common path-action viewpoint explicitly.
- Added the nondegeneracy qualification needed for a quadratic tangent action to induce a genuine distance after quotienting null velocity representatives.
- Preserved the review-specific section hierarchy and forward references to generalized gradient flows.

## Transportation models

- Corrected the mean-shift discussion to distinguish classical frozen-density mode seeking from self-consistent blurring mean shift.
- Added a compact consensus interpretation through a row-stochastic kernel matrix and its Dobrushin coefficient.
- Added and proved exponential diameter contraction for positive blurring mean shift, with references to opinion dynamics and Markov-operator contraction.
- Added the one-dimensional specialization of the Gaussian closure catalogue for KL, squared Wasserstein distance, debiased Sinkhorn divergence and relative Fisher information.
- Copied and integrated the corresponding four-panel Gaussian energy-landscape figure from OT4ML.

## Project synchronization

- Synchronized `PDE4ML/all.bib` with the current OT4ML bibliography so that the standalone survey contains all cited records, including the recent mean-shift and Dobrushin references.
- Updated `PDE4ML/readme.md` and `PDE4ML/guideline.md` to reflect the expanded self-contained primer.
- Rebuilt `PDE4ML/PDE4ML.pdf` as a standalone 120-page A4 document.

## Verification

- Checked all LaTeX labels and references: no duplicates or unresolved references.
- Checked all citation keys: no missing bibliography entries.
- Checked all included graphics: no missing files.
- Completed the BibTeX and two-pass pdfLaTeX build without undefined citations, undefined references or overfull boxes.
- Visually inspected representative pages from the expanded primer, mean-shift theorem and Gaussian closure addition; no clipping, overlap or unreadable layout was found.
