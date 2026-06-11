# Compact Teaching Version

This directory contains the compact, bibliography-free teaching version of the
OT4ML manuscript. It is generated from the current sources in `latex/` by
`generate_compact.py`, using a 10pt A4 layout with tight margins for handouts.

The compact version is meant for lecture use: it preserves the mathematical
statements and proofs, while removing the expansive exposition, references,
bibliography, and notation table used in the full book.

Build from the repository root:

```sh
python3 compact/generate_compact.py
cd compact
pdflatex -synctex=1 -interaction=nonstopmode -halt-on-error CourseOT-compact.tex
pdflatex -synctex=1 -interaction=nonstopmode -halt-on-error CourseOT-compact.tex
```

Generator policy:

- preserve formal mathematical environments and proofs;
- strip citations and omit the bibliography;
- remove pitches, transitions and background prose outside formal/math blocks;
- inline short unnumbered displayed equations when this saves vertical space.

LaTeX auxiliary files are ignored in this directory; keep the generated source
files, generator, style files, sections, and final `CourseOT-compact.pdf` under
version control.
