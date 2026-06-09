# Compact teaching version

This directory contains a compact, bibliography-free version of the course notes.
It is generated from `latex/` by `generate_compact.py`, using a 10pt A4 layout
with tight margins for teaching handouts.

Build from the repository root:

```sh
python3 compact/generate_compact.py
cd compact
pdflatex -synctex=1 -interaction=nonstopmode -halt-on-error CourseOT-compact.tex
pdflatex -synctex=1 -interaction=nonstopmode -halt-on-error CourseOT-compact.tex
```

Policy of the compact generator:

- preserve formal mathematical environments and proofs;
- strip citations and omit the bibliography;
- remove pitches, transitions and background prose outside formal/math blocks;
- inline short unnumbered displayed equations when this saves vertical space.

LaTeX auxiliary files are ignored in this directory; keep the source files,
generator and final `CourseOT-compact.pdf` under version control.
