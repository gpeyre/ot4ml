# PDE4ML: PDEs for Machine Learning

This directory contains a standalone long-review project on PDE tools for machine learning, written from an optimal-transport viewpoint and prepared for eventual submission to *Acta Numerica*.

The project is currently a curated reorganization of material from the full OT4ML manuscript. It keeps only the foundations needed for PDE and ML dynamics:

- a self-contained OT primer covering probability measures, push-forwards, conditional laws, Monge and Kantorovich formulations, dual potentials, Wasserstein convergence and geodesics, Gaussian transport, a one-dimensional quantile example, entropy and MMD;
- continuity equations and the velocity, momentum, dual and path-space formulations of quadratic Benamou--Brenier transport;
- Wasserstein gradient flows, JKO schemes, particle limits, geodesic convexity, slope inequalities and mean-field training of shallow and residual networks;
- transportation views of generative models, diffusion, flow matching, transformers and Gaussian closures.

## Files

- `PDE4ML.tex`: main LaTeX source.
- `acta-numerica.cls`: local Cambridge/Acta submission class following the official CUP medium-template interface and mathematical-review layout.
- `PDE4ML.pdf`: compiled review.
- `Makefile`: local build helper.
- `sections/primer-ot.tex`: purpose-written primer containing only prerequisites used by the PDE sections.
- `sections/dynamic-ot.tex`: selected continuity-equation and quadratic dynamic-OT material, with a short prose-only outlook on generalized geometries and variational mean field games.
- `sections/wasserstein-gradient-flows.tex`: the core quadratic calculus, convergence and neural-network applications; generalized flows appear only in a short literature paragraph.
- `sections/transportation-models.tex`: flow matching and diffusion, one-step generation, attention and Gaussian closures, with local prerequisites.
- `figures/`: copied PDF panels used by the review.
- `scripts/render-focused-gaussian-figure.py`: regenerates the three-panel Gaussian energy figure from the book's notebook, without changing the book's four-panel version.
- `all.bib`, `mystyle.sty`, `notations_ot.sty`: local copies so the review can compile independently.
- `guideline.md`: scope and editing guidelines for this sub-project.
- `modifications.md`: detailed content-synchronization report and prerequisite coverage map.

## Build

From this directory:

```sh
make
```

Equivalently, run the explicit LaTeX sequence:

```sh
pdflatex -interaction=nonstopmode -halt-on-error PDE4ML.tex
bibtex PDE4ML
pdflatex -interaction=nonstopmode -halt-on-error PDE4ML.tex
pdflatex -interaction=nonstopmode -halt-on-error PDE4ML.tex
```

The current scaffold builds as a self-contained PDF with local figures, local bibliography and local style files. Acta Numerica currently accepts standard LaTeX but does not publish a journal-coded class; the local class therefore keeps the source submission-ready and can be replaced by a production class supplied by Cambridge without changing the section files.

Generated auxiliary files are ignored locally; the PDF is kept as the review output.

## Synchronization Policy

The review follows the book's mathematics for the topics retained in its deliberately narrower scope. It is not a verbatim concatenation. First variations are defined once in the gradient-flow section; conditional geometry, attention and relative Fisher information are introduced where they are used. The opening literature guide contains only textbooks, surveys and tutorials; specialized results are attributed locally.

The October 2026 scope revision excludes formal treatments of sliced and entropic transport, Schrodinger bridges, generalized/nonlocal/unbalanced transport, variational MFG, density constraints, multi-species flows, synthetic curvature, functional inequalities, inertial flows, SVGD and moment measures. Generalized distances and flows have two short prose literature paragraphs. Sinkhorn-based learning methods may be mentioned with citations and a verbal explanation, but no omitted Sinkhorn notation or formula may be used. Do not restore these topics by copying whole book chapters. When removing a definition, also review later examples, Gaussian catalogues, figures and captions for dependencies.

All referenced figure PDFs are local; the Gaussian energy figure is a review-specific three-panel adaptation of the corresponding book asset. The review must continue to build without reading files from `../OT4ML/`. Regenerating that adapted figure uses the repository notebook, NumPy and Matplotlib, but building the article uses only its saved PDF. The document editor's single-file compiler cannot load the local class and section files; use the project build above for validation.
