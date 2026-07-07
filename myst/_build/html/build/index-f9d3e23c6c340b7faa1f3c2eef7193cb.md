---
title: Optimal Transport for Machine Learners
subtitle: Executable web book prototype
---

## Abstract

Modern machine learning repeatedly manipulates probability measures: empirical
datasets, generated samples, latent distributions, class-conditional laws,
particle systems, weights of wide networks and attention patterns. Optimal
transport is useful in this setting because it compares such objects by asking
how mass should move. It therefore combines a statistically meaningful notion
of discrepancy with a geometry of interpolation, dual certificates and
variational dynamics. This makes OT a common language for losses, generative
modeling, domain adaptation, robust learning, barycenters, gradient flows and
mean-field descriptions of learning algorithms.

This book presents the main OT techniques with these machine-learning uses in
mind. It starts from finite assignment and the Monge map viewpoint, passes to
Kantorovich couplings and dual potentials, and then explains the algorithmic
ideas that make transport usable: linear programming, semi-discrete cells,
Sinkhorn scaling and low-dimensional projections. The same objects are then
reused as a geometry of measures, giving Wasserstein distances, barycenters,
gradient flows, dynamic formulations and Gaussian/Bures formulas. The final
chapters emphasize the variants most relevant to modern ML: divergences and
adversarial losses, entropic and unbalanced relaxations, robust or spectral
ground geometries, Gromov and quantum extensions, and transport-based views of
generative models, mean-field networks and attention dynamics. The goal is to
keep the mathematics explicit while exposing the computational and geometric
intuitions needed to turn OT into a working toolbox for machine learners.

All material for this book, including the code used to reproduce the figures,
is available at [gpeyre/ot4ml](https://github.com/gpeyre/ot4ml). Most
computational figures were produced with the Python Optimal Transport (POT)
library {cite:p}`flamary2021pot`. The author warmly thanks the POT team and
contributors for their important and sustained effort in making reliable
optimal-transport algorithms available to the community.

## Guide to the Literature and Scope

Several books already cover optimal transport from complementary viewpoints.
The two-volume monograph of Rachev and Rueschendorf
{cite:p}`rachev1998mass,rachev1998mass2` gives a broad probabilistic treatment
of mass transportation and its applications. Villani's books
{cite:p}`Villani03,Villani09` are the standard references for the modern
mathematical theory, from Kantorovich duality to curvature, concentration and
geometric analysis. Santambrogio's text {cite:p}`SantambrogioBook` offers a
concise applied-mathematics route through the same foundations, with a strong
emphasis on PDEs and variational arguments. Ambrosio, Gigli and Savare
{cite:p}`ambrosio2006gradient` develop the metric-space theory of gradient
flows that underlies the dynamical part of the subject.

On the computational side, Peyre and Cuturi {cite:p}`peyre2019computational`
provide the reference account of numerical OT, entropic regularization and
applications in data sciences. Galichon's book {cite:p}`galichon2016optimal`
explains the economic and matching-theoretic viewpoint, while the statistical
theory of OT is developed in the recent lecture notes of Chewi, Niles-Weed and
Rigollet {cite:p}`weed2025statistical`. Recent surveys complement these books
by emphasizing scalable algorithms and machine-learning applications
{cite:p}`khamis2024scalable,montesuma2023recent`, as well as the role of OT in
imaging and graphics {cite:p}`bonneel2023survey`. These references remain the
natural places to find exhaustive proofs, historical details and specialized
variants.

The aim here is different and more selective. The book keeps the core
mathematics explicit, but organizes it around the questions that repeatedly
arise in machine learning: how to compare singular empirical measures, how to
compute differentiable transport losses, how regularization changes
optimization and statistics, how dual potentials become discriminators, and
how transport geometry produces flows of particles, neurons and tokens. The
intended contribution is therefore not a replacement for the references above,
but a compact bridge between rigorous OT and the geometric intuitions needed
to use it in modern ML.

## Executable Web Layer

This MyST version gives the LaTeX book a second life as a computational reading
environment:

- the mathematical exposition stays close to the book;
- the publication figures become small executable experiments;
- technical plotting and data-generation code is hidden from the main reading
  flow;
- the reader can still change a few meaningful parameters and rerun the cells.

:::{note}
The current web layer is a prototype, but its chapter list now mirrors the 14
main chapters compiled by `OT4ML/OT4ML.tex`. Each chapter demonstrates the
intended pattern: hidden helpers, static notebook figures, and browser-native
interactive demos beside the mathematical exposition.
:::

:::{tip}
For live parameter editing in the browser, start the local Jupyter backend with
`npm run jupyter`, start the MyST site with `npm run start`, then click the
power button at the top of the page.
:::
