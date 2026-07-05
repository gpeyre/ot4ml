# Dynamic Transport and Flows for ML

This is the fourth Quarto + Reveal.js deck for OT4ML. It follows the reference deck `slides/references/4-DynamicFlows.pdf` while replacing dense raster slides by editable equations, semantic mathematical boxes, algorithmic summaries, book figures, MyST links, and one lightweight interactive transport-flow panel.

## Render

From this directory:

```bash
quarto render index.qmd
```

The output is `index.html`.

## Structure

The deck is organized into five roadmap parts:

1. Generative transport
2. Dynamic OT
3. Wasserstein gradient flows
4. Training and biology
5. Attention dynamics

It currently contains 54 slides and includes explicit algorithm boxes for flow matching training, convex Benamou-Brenier discretization, JKO time stepping, and Langevin particle simulation.

Shared formatting conventions are documented in `../formating.md`; the Reveal theme is `../_common/ot4ml-reveal.scss`.
