# Conditional concavity beyond quadratic GW

This directory contains a self-contained analysis of whether the conditional
concavity result for squared Gromov--Wasserstein transport extends from the
outer loss

\[
|d_{\mathcal X}-d_{\mathcal Y}|^2
\]

to `|d_X-d_Y|^p` with `p != 2`.

The main conclusions are:

- The original same-sign CND/CPD hypothesis is specific to `p=2`.
  Four-point CND metric counterexamples are given for every `p >= 1`,
  `p != 2`.
- A single multiscale layer-cake identity covers both regimes. At `p=2` its
  weight is constant and yields the classical integrated CND factorization;
  ultrametricity makes the same integrand nonnegative at every scale and hence
  covers all `p >= 1`.
- An all-exponent theorem is valid under the stronger requirement that every
  distance-threshold kernel `1_{d >= r}` is conditionally negative definite.
- For genuine metrics, threshold negative type is equivalent to
  ultrametricity. Compact ultrametric spaces therefore have conditionally
  concave `p`-GW objectives for every `p >= 1`.
- A graded catalogue develops ultrametric examples from constant finite
  metrics and dendrograms through prefix spaces, the Cantor set, p-adic and
  valued fields, profinite groups, rooted-graph local topology, Hausdorff
  hyperspaces, and random tree cascades.
- The layer-cake proof applies more generally to submodular scalar
  distortions whose negative mixed derivative is a positive measure.
- In finite ultrametric spaces, the resulting concavity yields a sparse
  extreme-point optimizer and, for equal uniform marginals, a permutation
  optimizer.
- Inner powers such as `d(x,x') = |x-x'|^q` are distinct from the outer GW
  exponent. Schoenberg's theorem broadens the inner power while the standard
  conditional-concavity proof still uses outer exponent `2`.

Run the finite counterexample and ultrametric sign checks with:

```sh
python3 verify_counterexamples.py
```

Build the note with:

```sh
pdflatex -interaction=nonstopmode -halt-on-error conditional_concavity_p_gw.tex
bibtex conditional_concavity_p_gw
pdflatex -interaction=nonstopmode -halt-on-error conditional_concavity_p_gw.tex
pdflatex -interaction=nonstopmode -halt-on-error conditional_concavity_p_gw.tex
```
