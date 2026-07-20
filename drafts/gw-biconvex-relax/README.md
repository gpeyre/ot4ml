# Biconvex relaxation of Gromov--Wasserstein

This directory contains a self-contained measure-theoretic account of the
two-coupling biconvex relaxation underlying the standard alternating
linearization of squared Gromov--Wasserstein transport.

The note develops:

- a general theory for two measures \((\pi,\xi)\) on a space
  \(\mathcal Z\), driven by a bilinear form that is negative on feasible
  differences;
- the Konno--Sejourne--Vialard--Peyre tightness theorem directly at the
  measure level;
- continuous and discrete squared GW as a running specialization;
- a Hilbert-feature proof of the negative-type criterion;
- one formulation encompassing unregularized and entropic GW;
- an exact KL/Bregman descent identity and uniform positivity of the
  measure-valued entropic GW iterates;
- a Fisher-geometry residual estimate, an explicit inverse for the
  constrained entropy Hessian, and a measure-space Łojasiewicz--Simon proof
  of full-sequence convergence on compact spaces for every fixed positive
  regularization;
- an abstract extension to analytic biconvex measure functionals with
  coercive block geometry and controlled cross derivatives; and
- the distinction between tightness of the global relaxation and global
  convergence of a nonconvex algorithm.

Build the PDF from this directory with:

```sh
pdflatex -interaction=nonstopmode -halt-on-error gw_biconvex_relax.tex
bibtex gw_biconvex_relax
pdflatex -interaction=nonstopmode -halt-on-error gw_biconvex_relax.tex
pdflatex -interaction=nonstopmode -halt-on-error gw_biconvex_relax.tex
```
