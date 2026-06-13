# Compact Teaching Version

This directory contains the compact, bibliography-free teaching version of the
OT4ML manuscript. It is generated from the current sources in `latex/` with
`generate_compact.py`, using a 10pt A4 layout and tight margins for handouts.

The compact version is meant for lecture use: it follows the current chapter
order of the full book, mapping chapters to article sections, and preserves the
core mathematical statements, proofs and equations. It removes expansive
exposition, side remarks and examples, transitions, references, figures, tables,
the bibliography, the index, and the notation table from the full book.

## Build

```sh
python3 compact/generate_compact.py
cd compact
pdflatex -synctex=1 -interaction=nonstopmode -halt-on-error CourseOT-compact.tex
pdflatex -synctex=1 -interaction=nonstopmode -halt-on-error CourseOT-compact.tex
```

Run these commands from the repository root. The first command refreshes the
compact LaTeX source, and the two LaTeX passes refresh cross-references.

## Generator Policy

- preserve formal mathematical environments and proofs;
- follow the section order of `latex/OT4ML.tex`;
- strip citations and omit the bibliography, index, figures, tables, remarks,
  and examples;
- remove pitches, transitions and background prose outside formal/math blocks;
- inline short unnumbered displayed equations when this saves vertical space.

LaTeX auxiliary files are ignored in this directory. Keep the generator, style
files, compact section files, generated source, and final
`CourseOT-compact.pdf` under version control.
