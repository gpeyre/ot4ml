# Structure of c-concave functions

This directory contains a self-contained mathematical note on the algebraic
and geometric structure of c-concave functions.

Main conclusions:

- Every c-concave class is a min-plus (tropical) cone.
- It need not be convex for ordinary linear combinations.
- The cost `-<x,y>` gives the ordinary cone of closed concave functions.
- The quadratic cost gives a convex set of semiconcave functions, not a cone.
- The metric cost gives a Lipschitz ball, not a cone.
- Under the classical smooth hypotheses, ordinary convexity is equivalent to
  nonnegative cross-curvature.
- Squared geodesic distance on round spheres and products of round spheres is
  the relevant geometric example.

Build with:

```sh
pdflatex c_concavity.tex
bibtex c_concavity
pdflatex c_concavity.tex
pdflatex c_concavity.tex
```
