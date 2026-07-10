# Mean shift and Hilbert contraction

This directory contains a short standalone note explaining convergence of
positive-kernel blurring mean shift through the same Hilbert-projective
contraction mechanism used for Sinkhorn scaling.

The note distinguishes:

- Birkhoff contraction in Hilbert's projective metric;
- its infinitesimal Hopf oscillation seminorm;
- the exact Dobrushin contraction coefficient for Markov averaging;
- discrete, continuous-time, and measure-valued mean-shift consensus;
- the limitations of the analogy with Sinkhorn.

Build the PDF from this directory with:

```sh
pdflatex -interaction=nonstopmode -halt-on-error mean_shift_hilbert.tex
pdflatex -interaction=nonstopmode -halt-on-error mean_shift_hilbert.tex
```
