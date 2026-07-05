# Entropic Regularization and Sinkhorn

This is the second Quarto + Reveal.js deck for OT4ML. It follows the reference deck `slides/references/2-EntropicRegularization.pdf` while replacing dense raster slides by editable equations, semantic mathematical boxes, algorithmic summaries, book figures, and one lightweight interactive Sinkhorn-epsilon panel.

## Render

From this directory:

```bash
quarto render index.qmd
```

The output is `index.html`.

## Structure

The deck is organized into five roadmap parts:

1. Entropic OT
2. Sinkhorn convergence
3. Extensions and debiasing
4. Statistics
5. Learning

It currently contains 49 slides, 47 local PNG assets, two algorithm boxes for Sinkhorn iterations, and an interactive entropic-regularization panel.

Shared formatting conventions are documented in `../formating.md`; the Reveal theme is `../_common/ot4ml-reveal.scss`.
