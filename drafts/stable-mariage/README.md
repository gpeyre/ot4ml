# Stable marriage, optimal transport, and Birkhoff geometry

This directory contains a self-contained mathematical note connecting three
finite matching theories:

- Gale--Shapley stable marriage with ordinal preferences and no transfers;
- Kantorovich optimal assignment over the Birkhoff polytope;
- the Shapley--Shubik assignment game with transferable utility.

The central distinction is that ordinary stable marriage imposes no-blocking
constraints, whereas optimal transport minimizes a cardinal aggregate cost.
The exact bridge is the assignment game: core stability is equivalent to
Kantorovich dual feasibility and complementary slackness. The note also
compares the Birkhoff--von Neumann theorem with the Vande Vate--Rothblum
integrality theorem for the stable-marriage polytope.

Build with:

```bash
pdflatex -interaction=nonstopmode -halt-on-error stable_marriage_ot.tex
bibtex stable_marriage_ot
pdflatex -interaction=nonstopmode -halt-on-error stable_marriage_ot.tex
pdflatex -interaction=nonstopmode -halt-on-error stable_marriage_ot.tex
```

