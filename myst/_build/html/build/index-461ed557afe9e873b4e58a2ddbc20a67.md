---
title: Optimal Transport for Machine Learners
---

## Abstract

Modern machine learning repeatedly manipulates probability measures: empirical
datasets, generated samples, latent distributions, class-conditional laws,
particle systems, parameter distributions of wide networks and attention
patterns. Optimal transport is useful in this setting because it compares such
objects by asking how mass should move. It combines a statistically meaningful
discrepancy with a geometry of interpolation, dual certificates and variational
dynamics, making OT a common language for losses, generative modeling, domain
adaptation, robust learning, barycenters, gradient flows and mean-field
descriptions of learning algorithms.

This book uses optimal transport as a meeting point between probability, PDEs,
optimization and statistics, with modern machine learning as the organizing
pressure. In current learning systems, probability distributions are no longer
peripheral objects: datasets are empirical laws, generators define push-forward
laws, samplers solve evolution equations, and large models move information
through populations of particles, parameters and tokens. Comparing and evolving
such distributions has become a central mathematical problem, with particular
urgency in generative AI. The resulting tensions are both conceptual and
computational: empirical measures are singular, dimensions are large,
parametrizations are non-convex, and numerical approximations cannot be
separated from statistical error. The goal is to expose the OT tools that
organize these tensions, while keeping their connection to the training and
deployment of large models in view.

Several books already cover optimal transport from complementary viewpoints.
The two-volume monograph of Rachev and Rueschendorf
{cite:p}`rachev1998mass,rachev1998mass2` gives a broad probabilistic treatment
of mass transportation and its applications. Villani's books
{cite:p}`Villani03,Villani09` are the standard references for the modern
mathematical theory, from Kantorovich duality to curvature, concentration and
geometric analysis. Santambrogio's text {cite:p}`SantambrogioBook` offers a
concise applied-mathematics route through the same foundations, with a strong
emphasis on PDEs and variational arguments, and Ambrosio, Gigli and Savare
{cite:p}`ambrosio2006gradient` develop the metric-space theory of gradient
flows that underlies the dynamical part of the subject. On the computational
side, Peyre and Cuturi {cite:p}`peyre2019computational` provide the reference
account of numerical OT, entropic regularization and applications in data
sciences; Galichon's book {cite:p}`galichon2016optimal` explains the economic
and matching-theoretic viewpoint; and the statistical theory of OT is developed
in the recent lecture notes of Chewi, Niles-Weed and Rigollet
{cite:p}`weed2025statistical`. Recent surveys complement these books by
emphasizing scalable algorithms and machine-learning applications
{cite:p}`khamis2024scalable,montesuma2023recent`, as well as the role of OT in
imaging and graphics {cite:p}`bonneel2023survey`. These references remain the
natural places to find exhaustive proofs, historical details and specialized
variants.

All material for this book, including the code used to reproduce the figures,
is available at [gpeyre/ot4ml](http://github.com/gpeyre/ot4ml). Most
computational figures were produced with the Python Optimal Transport (POT)
library {cite:p}`flamary2021pot`. The author warmly thanks the POT team and
contributors for their important and sustained effort in making reliable
optimal-transport algorithms available to the community.

## Interactive Web Book

This web version gives the LaTeX book a second life as an interactive reading
environment:

- the mathematical exposition stays close to the book;
- the publication figures sit directly beside small parameter panels;
- the reader can change meaningful quantities and immediately see their
  influence;
- the interface stays focused on the book content.

:::{note}
The table of contents mirrors the front matter, 15 main chapters, conclusion,
and notation-table/index appendices of the book. Each chapter keeps the
mathematical exposition first and places browser-native interactive panels
beside the relevant figures.
:::
