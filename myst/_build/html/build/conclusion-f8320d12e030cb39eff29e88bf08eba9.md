---
title: "Conclusion"
---

Optimal transport is useful because it keeps several viewpoints active at
once. It is a linear program over couplings, a duality theory for potentials,
a geometry on probability measures, a source of PDEs and gradient flows, and a
computational toolbox built around linear programming, Sinkhorn scaling and
low-dimensional projections. These viewpoints reinforce each other: Brenier
maps explain geodesics, geodesic convexity explains convergence of flows,
entropic regularization turns transport into scalable differentiable losses,
and dual norms or sliced variants reveal what is gained and lost when OT is
simplified.

For machine learning, this interplay is especially stimulating. Modern
generative modeling, diffusion and flow matching, inverse problems, robust
optimization, and even continuous-depth views of transformers all ask for ways
to move, compare or learn distributions in high dimension. These applications
do not merely consume existing OT theory; they create difficult mathematical
questions because empirical measures are singular, dimensions are large,
models are parametrized and non-convex, and computational approximations are
inseparable from statistical error. The strength of OT is precisely that it
gives a common language for these tensions, while still leaving enough open
structure for new mathematics to be needed.

## Acknowledgements

This work was supported by the European Research Council (ERC project WOLF)
and by the French government under the management of Agence Nationale de la
Recherche as part of the "France 2030" program, reference ANR-23-IACL-0008
(PRAIRIE-PSAI).
