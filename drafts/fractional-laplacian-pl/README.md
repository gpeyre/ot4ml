# Fractional-Laplacian PL analysis

This draft studies PL and Kurdyka--Lojasiewicz inequalities for the nonlocal
Wasserstein gradient flow of `KL(alpha | beta)`.

Main conclusions:

- For a fixed reversible jump kernel, modified log-Sobolev is exactly the
  exponential entropy-decay condition. It is a metric PL inequality once the
  logarithmic-mean action has the required entropy-slope identity.
- The condition depends on the pair `(beta, K)`, not on `beta` alone.
- Exact two-level densities quantify bottleneck obstructions and recover the
  spectral-gap obstruction in the small-perturbation limit.
- A Gaussian target can fail every global power-KL inequality for a
  tail-degenerate reversible kernel, even on fixed entropy sublevels.
- Weak log-Sobolev profiles yield restricted KL inequalities and explicit
  polynomial entropy rates.
- A translation-invariant fractional Laplacian cannot be reversible for a
  Gaussian or another nonconstant probability density on `R^d`.
- Strong log-concavity gives a positive result after subordinating the
  reversible Langevin semigroup.
- Direct stable-like kernels satisfy MLSI for the stretched-exponential
  family `exp(-(1+|x|^2)^q)`, including log-concave targets with slower than
  Gaussian tails.
- For the standard Gaussian and the fractional Ornstein--Uhlenbeck generator
  `-(-L_OU)^(s/2)`, the draft proves the dimension-free PL lower bound
  `kappa >= 2^(s/2-1)` and the upper bound `kappa <= 1`.

Build the note with:

```sh
pdflatex fractional_laplacian_pl.tex
bibtex fractional_laplacian_pl
pdflatex fractional_laplacian_pl.tex
pdflatex fractional_laplacian_pl.tex
```
