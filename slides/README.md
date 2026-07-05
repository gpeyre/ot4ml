# OT4ML slide decks

This directory contains Quarto + Reveal.js slide decks derived from the four reference PDFs in `slides/references/`.

The static landing page is `index.html`. After rendering the decks, it links to each generated Reveal.js presentation.

## Decks

- `1-monge-kantorovich/`: 53 slides on Monge maps, Kantorovich relaxation, Wasserstein metric structure, and applications.
- `2-entropic-regularization/`: 52 slides on entropic OT, Sinkhorn iterations, convergence, unbalanced extensions, Sinkhorn divergences, statistics, and learning.
- `3-dual-semidiscrete/`: 48 slides on duality, c-transforms, Wasserstein-1/IPMs, semi-discrete OT, Laguerre cells, and quantization.
- `4-dynamic-flows/`: 59 slides on dynamic OT, generative flows, Wasserstein gradient flows, training dynamics, biology, and transformer/attention PDE views.

The current sources include 180 local PNG assets, semantic mathematical blocks, algorithm boxes, roadmap slides, and lightweight browser-native interactive panels.

## PDF exports

The directory `pdf/` contains slide-style PDF exports generated from the Reveal.js print view:

- `pdf/1-monge-kantorovich.pdf`
- `pdf/2-entropic-regularization.pdf`
- `pdf/3-dual-semidiscrete.pdf`
- `pdf/4-dynamic-flows.pdf`
- `pdf/ot4ml-slides-complete.pdf`

The PDF page counts can be larger than the source slide counts because Reveal.js exports fragment states as separate print pages.

## Shared style

- Formatting rules: `formating.md`
- Reveal theme: `_common/ot4ml-reveal.scss`
- Quarto project file: `_quarto.yml`
- Landing page: `index.html`
- Source validator: `check_slides.py`
- Pandoc smoke test: `smoke_pandoc.sh`
- Batch renderer: `render_all.sh`

Each deck is self-contained at the source level: it has its own `assets/` directory and optional local JavaScript for interactive panels.

## Check

Run a lightweight source-level validation from `slides/`:

```bash
python3 check_slides.py
```

This checks front matter, hidden control characters, local references, roadmap counts, and balanced HTML blocks. It does not replace a real Quarto render.

When Quarto is unavailable, run a stricter syntax smoke test through Pandoc:

```bash
./smoke_pandoc.sh
```

## Render

Install Quarto, then run from a deck directory:

```bash
quarto render index.qmd
```

For example:

```bash
cd slides/2-entropic-regularization
quarto render index.qmd
```

To render every deck from `slides/`:

```bash
./render_all.sh
```

This uses `_quarto.yml`, so `quarto render` from the `slides/` directory is equivalent.

If `quarto` is not available on the current machine, the sources can still be smoke-tested with Pandoc, but the final Reveal.js HTML output requires Quarto.

## Export PDFs

After rendering the HTML decks, export PDFs with:

```bash
./export_pdf.sh
```

By default this uses Google Chrome on macOS. To use another Chromium executable:

```bash
CHROME_BIN=/path/to/chrome ./export_pdf.sh
```
