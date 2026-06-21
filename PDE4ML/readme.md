# PDE4ML: PDEs for Machine Learning

This directory contains a standalone long-review project on PDE tools for machine learning, written from an optimal-transport viewpoint.

The project is currently a curated reorganization of material from the full OT4ML manuscript. It keeps only the foundations needed for PDE and ML dynamics:

- a compact OT primer covering Monge, Kantorovich, Brenier maps and Wasserstein geometry;
- dynamic optimal transport and Benamou--Brenier formulations;
- Wasserstein gradient flows, JKO schemes, particle limits and mean-field training;
- transportation views of generative models, diffusion, flow matching, transformers and Gaussian closures.

## Files

- `PDE4ML.tex`: main LaTeX source.
- `PDE4ML.pdf`: compiled review.
- `Makefile`: local build helper.
- `sections/primer-ot.tex`: new compact OT primer.
- `sections/dynamic-ot.tex`: copied from the full manuscript and converted into a review-paper section.
- `sections/wasserstein-gradient-flows.tex`: copied from the full manuscript and converted into a review-paper section.
- `sections/transportation-models.tex`: copied from the full manuscript and converted into a review-paper section.
- `figures/`: copied PDF panels used by the review.
- `all.bib`, `mystyle.sty`, `notations_ot.sty`: local copies so the review can compile independently.
- `guideline.md`: scope and editing guidelines for this sub-project.

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

The current scaffold builds as a self-contained PDF with local figures, local bibliography and local style files.

Generated auxiliary files are ignored locally; the PDF is kept as the review output.
