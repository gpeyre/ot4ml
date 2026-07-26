# Monge maps for power-distance Gromov--Wasserstein transport

This directory contains a self-contained mathematical note on the existence
of Monge optimizers for

\[
\iint \bigl(|x-x'|^p-|y-y'|^p\bigr)^2\,d\pi(x,y)\,d\pi(x',y'),
\qquad 0<p\leq2.
\]

The note develops:

- the Schoenberg Hilbert embedding of Euclidean power distances;
- an exact decomposition through a scalar mixed moment and a
  Hilbert--Schmidt cross-covariance;
- a cost-regularized OT representation whose penalty is the norm of a
  tensor-product RKHS;
- the self-consistent linear OT problem solved by every GW optimizer;
- a constructive density theorem for graph couplings, separating equality of
  Gromov--Monge and GW values from attainment by a Monge map;
- a universal frozen-cost principle for arbitrary quadratic GW kernels and a
  conditional-concavity replacement theorem;
- a contact-set `m`-twist theorem showing that a finite twist number yields a
  measurable mixture of finitely many maps;
- the complementary subtwist mechanism, which makes every full-row-rank
  squared-distance frozen problem unique and gives its optimizer both a
  two-map and a map/anti-map structure;
- a quotient-and-fiber Brenier theorem that lifts a twisted quotient map
  through nonatomic source conditionals, even when the full frozen cost has
  infinite twist fibers;
- a finite-rank theorem reducing a rank-`R` learned cost to `R+1` quotient
  statistics, together with a coarea criterion for a Monge lift;
- an equivalent first-variation cost and an explicit distance-only
  finite-fiber criterion;
- a finite-rank feature-slice interpretation in which algebraic degree bounds
  the number of transport branches, recovering the degree-two paraboloid at
  `p=2`;
- a mixed-Hessian rank condition guaranteeing a finite twist number;
- a multijet-transversality argument yielding the generic branch count
  `floor(n/(n-d))` when the source dimension `n` exceeds the target dimension
  `d`;
- an analytic/definable rigidity criterion, together with a precise warning
  that analyticity alone neither excludes infinite fibers nor controls their
  number;
- a finite-dimensional specialization for `p=2`;
- a rank-free dimension-lowering theorem: for compactly supported marginals,
  when the absolutely continuous source dimension is strictly larger than the
  target dimension, squared-distance GW admits an attained Monge optimizer;
- a sharp rank decomposition behind this theorem: full row rank makes the
  chosen optimizer itself a graph, while every lower rank admits a quotient
  lift preserving the optimal cross-covariance;
- an equal-dimensional Monge theorem for full-row-rank optimizers when the
  target is supported on a sphere centered at its barycenter;
- an exact description of the second full-rank twist branch as reflection
  across a source-dependent affine hyperplane, yielding a sharp dual-contact
  criterion for eliminating it;
- Sturm's complete classification for equal-dimensional rotationally
  invariant absolutely continuous marginals: every optimizer monotonically
  rearranges radii and applies a common orthogonal transformation to angles;
- a more flexible one-dimensional quantile criterion, allowing singular
  targets and nonsymmetric pairs, under which an increasing or decreasing
  rearrangement is a GW-optimal map, with uniqueness under a strict
  endpoint-covariance comparison;
- an injective radial-linear feature criterion which removes the reflected
  second branch, notably in the equal-dimensional rank-`d-1` regime;
- the two-branch obstruction in equal dimensions and its relation to the
  known two-map theorem; and
- a precise account of what remains open for `0<p<2`, including the
  self-consistency obstruction and the nonsmooth range `p<=1`.

The draft deliberately does **not** claim a universal Monge theorem without a
dimension or geometric hypothesis.  In equal dimensions, current theory only
guarantees an optimal two-map in general, and published one-dimensional
computations provide evidence that a single-map optimizer need not always
exist.

Build the PDF from this directory with:

```sh
pdflatex -interaction=nonstopmode -halt-on-error gw_monge.tex
bibtex gw_monge
pdflatex -interaction=nonstopmode -halt-on-error gw_monge.tex
pdflatex -interaction=nonstopmode -halt-on-error gw_monge.tex
```
