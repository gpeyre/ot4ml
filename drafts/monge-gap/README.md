# Monge gap

This directory contains a self-contained mathematical account of the Monge
gap introduced by Théo Uscidda and Marco Cuturi in
[The Monge Gap: A Regularizer to Learn All Transport Maps](https://proceedings.mlr.press/v202/uscidda23a.html).
The note focuses on:

- a smooth-cost characterization of when the exact gap is convex in the map;
- quadratic, Mahalanobis, and reverse-Bregman examples;
- a counterexample for a convex quartic displacement cost;
- closed one-dimensional formulas based on quantiles and rearrangements;
- the permutahedral and isotonic-regression structure of the quadratic gap;
- a convex RKHS regression formulation and a reproducible numerical example.

Generate the numerical figure with:

```sh
python3 kernel_monge_regression.py
```

The script requires NumPy, Matplotlib, CVXPY, and the OSQP solver.

Build the note from this directory with:

```sh
pdflatex -interaction=nonstopmode -halt-on-error monge_gap.tex
bibtex monge_gap
pdflatex -interaction=nonstopmode -halt-on-error monge_gap.tex
pdflatex -interaction=nonstopmode -halt-on-error monge_gap.tex
```
