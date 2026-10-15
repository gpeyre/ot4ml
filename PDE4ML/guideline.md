# Guidelines for `PDE4ML/`

## Purpose

Create a standalone long review paper titled **PDE4ML: PDEs for Machine Learning**. The review should explain how PDE and optimal-transport tools are used to analyze machine-learning methods, especially training dynamics and generative models.

The manuscript is intended for eventual submission to **Acta Numerica**. Use the local `acta-numerica.cls`, the Cambridge-style article front matter, author--year references, restrained journal headings, and explicit competing-interest and data-availability declarations.

## Organization

- Start with a new abstract tailored to PDEs for ML.
- Add a short scope/literature guide restricted to standard textbooks, surveys and tutorials, including general references on diffusion models and sampling. Cite specialized papers where their results are used, not in this opening guide.
- Include a first section, **A Primer on Optimal Transport**, covering:
  - Monge problem for general measures;
  - particle interpretation of Monge maps, without assignment algorithms;
  - Kantorovich problem for general measures;
  - Kantorovich problem for discrete measures;
  - weak convergence, moment classes and Wasserstein convergence;
  - conditional laws and disintegration;
  - Kantorovich dual potentials and one-dimensional quantile transport;
  - Brenier theorem;
  - Wasserstein metric properties and geodesics.
  - Gaussian quadratic transport and the mean/covariance conventions used later;
  - entropy, phi-divergences and MMD, restricted to the conventions needed later.
- Present one-dimensional quantile transport in an example, retaining its figure; do not add a quantile/sliced subsection.
- Define first variations once in the gradient-flow section. Introduce conditional geometry, attention and Fisher information at their point of use.
- Keep **Dynamic Optimal Transport** focused on continuity equations and quadratic Benamou--Brenier transport, including its unregularized path-space representation. Generalized/nonlocal/unbalanced distances and variational MFG belong only in a final prose literature paragraph.
- Keep **Wasserstein Gradient Flows** focused on the quadratic calculus, particles, geodesic convexity, slope inequalities and neural-network training. Generalized flows belong only in a short prose literature paragraph.
- Keep **Generative Models via Transportation** focused on flow matching/diffusion, one-step generation, attention and Gaussian closures.
- End with a new conclusion focused on PDE/ML perspectives.

## Independence

- The directory must compile without relying on `OT4ML/`.
- Copy local versions of the style files, notation file and bibliography.
- Copy only the figure PDF directories used by this review.
- Keep figure paths relative to `PDE4ML/`.
- Keep `Makefile` as the canonical local build entry point.

## Reorganization Principle

- Preserve the current book's mathematical statements and hypotheses while adapting its exposition to a standalone article.
- When copied material refers to earlier OT notions, point back to the primer.
- Remove or rewrite references to excluded material when they become distracting.
- Keep the local structure section-based, because the target is a long review paper rather than a short monograph.
- Preserve the mathematical hypotheses and qualifications of retained material during restructuring, while respecting the explicit exclusions below.
- Do not import the higher-order vertical-derivative/polynomial-approximation excursus: it has no downstream role in this PDE review. Keep the first-order vertical/horizontal distinction and its precise chain-rule hypotheses.
- Check that every cross-reference resolves locally, every cited key is present, and every referenced figure is a local copy of the current book asset after synchronization.

## Explicit Scope Exclusions

- No formal entropic-transport/Sinkhorn primer, sliced transport, path-space Schrodinger section or proximal-splitting algorithm.
- No detailed generalized, nonlocal or unbalanced geometry; no variational-MFG section.
- No density-constrained or multi-species gradient-flow paragraphs, geodesically convex constraints, curvature excursus or functional-inequalities subsection.
- No second-order momentum flows, SVGD or moment-measure subsection.
- Remove downstream formulas and panels that depend on these exclusions. In particular, the Gaussian catalogue and scalar energy table contain no sliced or Sinkhorn rows.
- Brief cited mentions of regularized losses in the learning literature are acceptable without new mathematical notation.
- These exclusions supersede the broader synchronization snapshot recorded earlier in `modifications.md`.

## Style

- Keep notation synchronized with the full OT4ML manuscript.
- Keep theorem, definition, remark, example and algorithm environments visually consistent with OT4ML.
- Prefer concise pitch paragraphs at the start of each major section.
- Prefer local references over vague pointers.
- Figures should remain reproducible from the original notebooks in the main project.
- Keep figure panels compact and comparable in scale. Prefer ordinary floating placement to forced placement that leaves large blank areas. Review-specific panel selections must be reflected in the captions and reproducible without altering the book figures.
