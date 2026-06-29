# OT4ML MyST Web Prototype

This directory contains an experimental MyST/Jupyter Book 2 version of OT4ML.
It fuses the LaTeX exposition with the notebook-generated figures and adds
small browser-native interactive demos beside selected examples. The web table
of contents mirrors the front matter, 15 main chapter inputs, conclusion,
acknowledgements, and notation-table appendix in `../OT4ML/OT4ML.tex`; those
converted pages are listed in `myst.yml`.

The entry point is `index.md`, the project configuration is `myst.yml`, and
shared Python plotting helpers live in `ot4ml_web.py`. Browser-native
interactive demos live in `live/`. Generated build artifacts are written under
`_build/` and ignored by `myst/.gitignore`.

## How the Interactive Demos Work

There are two separate execution layers.

| Layer | Where it runs | Needs Python/Jupyter? | What it controls |
| --- | --- | --- | --- |
| MyST executable cells | At build time, or in a connected local Jupyter session | Yes | The hidden Python code that reproduces the book figures and notebook outputs |
| **Interactive demos** | Directly in the browser | No | Lightweight interactive versions of selected figures, with sliders and menus for the main parameters |

The **interactive demos** are not `ipywidgets`. Each demo embeds a
small static HTML page from `live/`, for example:

```html
<iframe src="../live/quantile.html"></iframe>
```

Those demos load `live/ot4ml-live.js` and redraw in JavaScript. They
do not call Python, do not connect to a Jupyter kernel, and do not recompute the
hidden notebook cells. This is intentional: the technical Python code stays out
of the reader's way, while the important conceptual parameters remain editable.

This also means that the interactive demos work in a static/offline copy of the
already-built site, without Python computing, as long as the `live/` directory
is shipped next to the generated HTML. The `myst.yml` file already does this
through:

```yaml
static_files:
  - live
```

Python is only needed when you want to rebuild the book outputs, rerun or edit
the actual executable cells, or generate a new static site from source.

## Local Development Preview

From this directory, install the local MyST dependency and start the executable
development server:

```bash
npm install
npm run start
```

The development server prints a local URL, typically `http://localhost:3000`
or `http://localhost:3001` if another server is already using port 3000. The
command is defined as `myst start --execute`, so it executes the Python cells
while preparing the preview. The browser-native **interactive demos** then
work directly on the rendered page.

The Python dependencies needed by the executable cells are listed in
`requirements.txt`.

## Python-Backed Cell Editing

Use this mode when you want to edit visible Python parameter cells and rerun the
actual MyST notebook cells from the web page.

Run two terminals from this directory:

```bash
npm run jupyter
```

and:

```bash
npm run start
```

Then open the MyST page, click the power button at the top of the page, edit a
visible parameter cell, and run the page cells again. The MyST configuration in
`myst.yml` points the page to `http://localhost:8888/` with the local token used
by `npm run jupyter`. The Jupyter script accepts the usual MyST preview ports
`3000` through `3009`.

For full source editing, use the "Launch Jupyter Server Window" button in the
in-page execution toolbar.

## Build a Static Site

To make a static website, run:

```bash
npm run build
```

This script is equivalent to:

```bash
myst build --html --execute
```

Without a local npm install, the one-shot command is:

```bash
npx -y mystmd build --html --execute
```

The static site is written to:

```text
_build/html/
```

Preview it with a simple static server:

```bash
python3 -m http.server 8000 --directory _build/html
```

Then open `http://localhost:8000`. The interactive demos should still work because
`_build/html/live/` is part of the static output. For deployment, copy the
contents of `_build/html/` to any static host, such as GitHub Pages, Netlify,
Vercel, or the project web server.

The `npm run build` wrapper defaults `BASE_URL` to the public deployment
prefix used by the project website:

```bash
BASE_URL=/ot4ml/myst/_build/html npm run build
```

You can override this value for another host by passing a different `BASE_URL`.
For a root-hosted static preview, use `BASE_URL=/ npm run build`.

As a final release check, you can ask MyST to fail on warnings:

```bash
npx -y mystmd build --html --execute --strict
```
