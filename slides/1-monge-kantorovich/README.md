# Monge and Kantorovich Optimal Transport

This is the first Quarto + Reveal.js deck for OT4ML. It follows the reference deck `slides/references/1-MongeKantorovitch.pdf` while replacing raster-heavy slides by editable equations, semantic mathematical boxes, book figures, algorithmic summaries, and one lightweight interactive panel.

## Render

From this directory:

```bash
quarto render index.qmd
```

The output is `index.html`.

## Structure

The deck is organized into five roadmap parts:

1. Monge matching
2. Continuous Monge
3. Kantorovich relaxation
4. Metric structure
5. Applications

It currently contains 48 slides, 38 local PNG assets, a method-landscape summary, and an interactive assignment/transport panel.

Shared formatting conventions are documented in `../formating.md`; the Reveal theme is `../_common/ot4ml-reveal.scss`.
