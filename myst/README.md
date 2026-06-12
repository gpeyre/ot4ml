# OT4ML MyST Web Prototype

This directory contains an experimental MyST/Jupyter Book 2 version of OT4ML.
The current prototype starts with `chapters/matching.md`, which keeps the
mathematical text close to the LaTeX manuscript while replacing selected static
figure references by executable cells with small, visible parameter blocks.

The entry point is `index.md`, the project configuration is `myst.yml`, and
shared plotting helpers live in `ot4ml_web.py`. Generated build artifacts are
written under `_build/` and ignored by `myst/.gitignore`.

## Rendering Workflow

From this directory, install the local MyST dependency and start the executable
development server:

```bash
npm install
npm run start
```

The development server prints a local URL, typically `http://localhost:3000`.
To build the static site instead, run:

```bash
npm run build
```

The Python dependencies needed by the executable cells are listed in
`requirements.txt`.

During development without a local npm install, the equivalent one-shot command
is:

```bash
npx -y mystmd build --html --execute
```

## Editing Parameters in the Browser

`npm run start` executes the page while building it, but the rendered page is
static until it is connected to a live Jupyter kernel. For local live execution,
run two terminals from this directory:

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
by `npm run jupyter`.
