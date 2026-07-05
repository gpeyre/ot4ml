# OT4ML Quarto slide formatting guide

This document defines the common formatting rules for the Quarto + Reveal.js slide decks in `slides/`.

## Directory layout

Each deck lives in its own directory:

- `slides/1-monge-kantorovich/`: Monge maps, Kantorovich relaxation, and Wasserstein metric structure.
- `slides/2-entropic-regularization/`: entropic OT, Sinkhorn, convergence, debiasing, statistics, and learning.
- `slides/3-dual-semidiscrete/`: duality, c-transforms, Wasserstein-1/IPMs, semi-discrete OT, Laguerre cells, and quantization.
- `slides/4-dynamic-flows/`: dynamic OT, generative transport, Wasserstein gradient flows, training dynamics, and attention-as-PDE material.

Shared style files live in `slides/_common/`. Deck-specific images are stored in the deck-level `assets/` directory.

The top-level `slides/_quarto.yml` lists the decks rendered by `quarto render`. Keep it synchronized whenever a deck is added, renamed, or removed.

## Build and validation

Run the source validator before rendering:

```bash
python3 check_slides.py
```

This checks front matter, hidden control characters, local references, roadmap structure, balanced HTML blocks, and missing image alt text.

When Quarto is unavailable, run the Pandoc smoke test:

```bash
./smoke_pandoc.sh
```

This does not test Reveal.js layout, but it catches many malformed Markdown, HTML, and math-source problems.

For final output, render the Quarto project from `slides/`:

```bash
quarto render
```

## Quarto defaults

Decks should use Reveal.js with:

- `format: revealjs`
- `theme: ../_common/ot4ml-reveal.scss`
- `html-math-method: katex`
- `width: 1280`
- `height: 720`
- `margin: 0.055`
- `slide-number: true`
- `transition: fade`
- `center: false`

Use explicit `width` and `height` rather than a high-level aspect-ratio shortcut. Quarto/Reveal uses these values to build the browser canvas, and the PDF exporter relies on the matching 16:9 `@page` rule in the shared SCSS.

The deck should remain self-contained at the source level: all local images are in the deck's `assets/` directory or in the shared `_common/` directory.

Prefer robust math glyphs in slide notation. In particular, avoid fragile one-letter calligraphic symbols such as `\mathcal X`, `\mathcal Y`, and `\mathcal N` in slides; use `X`, `Y`, and `\mathrm N` unless the calligraphic notation is essential.

## Visual language

The style follows the OT4ML book figures:

- red for source measures or initial states,
- blue for target measures or final states,
- violet for intermediate transports or couplings,
- orange for emphasis and active roadmap items,
- warm off-white page background,
- white cards with soft borders for figures and layouts.

Use concise slide titles, large equations, and avoid overfilling slides. If a reference slide is too dense, split it into several Quarto slides.

## Mathematical blocks

Use HTML fenced divs for semantic blocks.

Theorems, propositions, lemmas, and important mathematical results use a light gray box:

```markdown
::: {.theorem-box}
<span class="box-title">Theorem.</span>
Statement goes here.
:::
```

Short takeaway statements can use the same light gray visual language with `result-box`:

```markdown
::: {.result-box}
<span class="box-title">Message.</span>
The key interpretation goes here.
:::
```

Definitions use a light orange box:

```markdown
::: {.definition-box}
<span class="box-title">Definition.</span>
Statement goes here.
:::
```

Examples also use a light orange box, with the title starting by `Example.`:

```markdown
::: {.example-box}
<span class="box-title">Example.</span>
Short worked example goes here.
:::
```

Algorithms use a light blue box:

```markdown
::: {.algorithm-box}
<span class="box-title">Algorithm.</span>
Input: mathematical objects needed by the method.  
Output: object produced by the method.

1. Initialize the variables.
2. Repeat the update.
3. Return the final iterate.
:::
```

Algorithm slides should use short imperative steps rather than explanatory prose. Prefer inline equations inside the numbered steps; reserve display equations for the defining update when it materially improves readability.

## Roadmap slides

Each deck should contain a roadmap slide before each major part. The roadmap is a two-line grid of cards, one card per part. With five cards, the default layout is three cards on the first row and two centered cards on the second row. The part immediately following the roadmap uses class `.current`; all other cards use class `.dim`, which renders them at 25% opacity.

```html
<div class="roadmap">
  <div class="roadmap-card current">...</div>
  <div class="roadmap-card dim">...</div>
</div>
```

Each card contains:

- a short title,
- one figure snippet from the book or from an interactive figure,
- no long prose.

Images inside cards are centered and scaled with `object-fit: contain`. Avoid manually aligning them in each deck unless a specific figure needs a local exception.

## Figures

Prefer figures generated by the OT4ML book notebooks. Convert PDF panels to PNG for Reveal.js stability. Keep captions short and use class `.caption`.

Figures should not contain slide titles embedded inside the image. Put titles in the slide text.

For multi-panel rows, wrap images in `<div class="figure-row">...</div>`. Quarto inserts an intermediate paragraph around Markdown images; the common stylesheet turns this paragraph into a centered flex row, so do not add manual line breaks between images.

## Interactive figures

Interactive slides should be lightweight and browser-native whenever possible: SVG, Canvas, or small JavaScript controls. Avoid dependencies that require a Python server. Each deck should contain at least two small interactive panels: one near the beginning to set intuition and another near a later technical point. If an interactive slide mirrors a MyST numerical experiment, include a link or note to the corresponding MyST page.

Include deck-local JavaScript with a cache-busted URL, for instance `interactive.js?v=YYYYMMDD`, so local previews and GitHub Pages do not silently reuse stale drawing code.

## Typography and spacing

Use:

- one central idea per slide,
- two-column layouts for equation + figure,
- fragments only when they clarify the progression,
- no dense paragraphs copied verbatim from the reference PDFs.

Mathematical statements should be complete even when proofs are omitted.
