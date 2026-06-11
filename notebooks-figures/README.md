# Figure Notebooks

This directory contains the executable notebooks that generate the illustrative figures currently included in the OT4ML paper. Each notebook writes one or several PDF panels to `../latex/figures/<figure-name>/`; the thumbnails below are compact PNG previews rendered from those PDFs.

**Gallery status.** 59 paper figures, 59 linked notebooks, thumbnails in [`thumbnails/`](thumbnails/).

This README intentionally lists only figures that are integrated in `latex/OT4ML.tex` through a live `\label{fig:...}`. Archived or exploratory notebooks are still kept in this directory for provenance and are documented in [`figures.md`](figures.md), but they are omitted from this paper gallery.

Open a notebook locally from the **Open notebook** link, or launch it in Google Colab from the badge. The Colab links target the `main` branch of [`gpeyre/ot4ml`](https://github.com/gpeyre/ot4ml).

## Optimal Matching between Point Clouds

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="matching-1d-quantile-assignment.ipynb"><img src="thumbnails/matching-1d-quantile-assignment.png" alt="One-dimensional quantile assignment" width="210"></a><br>
  <strong>One-dimensional quantile assignment</strong><br>
  <code>fig:matching-1d-quantile-assignment</code><br>
  <a href="matching-1d-quantile-assignment.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/matching-1d-quantile-assignment.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="monge-histogram-equalization.ipynb"><img src="thumbnails/monge-histogram-equalization.png" alt="Histogram equalization as one-dimensional Monge transport" width="210"></a><br>
  <strong>Histogram equalization as one-dimensional Monge transport</strong><br>
  <code>fig:monge-histogram-equalization</code><br>
  <a href="monge-histogram-equalization.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-histogram-equalization.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="matching-2d-cost-exponent.ipynb"><img src="thumbnails/matching-2d-cost-exponent.png" alt="Two-dimensional assignments for different cost exponents" width="210"></a><br>
  <strong>Two-dimensional assignments for different cost exponents</strong><br>
  <code>fig:matching-2d-cost-exponent</code><br>
  <a href="matching-2d-cost-exponent.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/matching-2d-cost-exponent.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="matching-resolution-and-weights.ipynb"><img src="thumbnails/matching-resolution-and-weights.png" alt="Resolution and nonuniform weights in discrete transport" width="210"></a><br>
  <strong>Resolution and nonuniform weights in discrete transport</strong><br>
  <code>fig:matching-resolution-and-weights</code><br>
  <a href="matching-resolution-and-weights.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/matching-resolution-and-weights.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%"></td>
<td width="33%"></td>
</tr>
</table>

## Monge Problem between Measures

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="monge-color-transfer-rgb.ipynb"><img src="thumbnails/monge-color-transfer-rgb.png" alt="RGB color transfer by a Monge map" width="210"></a><br>
  <strong>RGB color transfer by a Monge map</strong><br>
  <code>fig:monge-color-transfer-rgb</code><br>
  <a href="monge-color-transfer-rgb.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-color-transfer-rgb.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="monge-shape-mccann-interpolation.ipynb"><img src="thumbnails/monge-shape-mccann-interpolation.png" alt="McCann interpolation between two shapes" width="210"></a><br>
  <strong>McCann interpolation between two shapes</strong><br>
  <code>fig:monge-shape-mccann-interpolation</code><br>
  <a href="monge-shape-mccann-interpolation.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-shape-mccann-interpolation.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="monge-linearized-transport-coordinates.ipynb"><img src="thumbnails/monge-linearized-transport-coordinates.png" alt="Linearized transport coordinates" width="210"></a><br>
  <strong>Linearized transport coordinates</strong><br>
  <code>fig:monge-linearized-transport-coordinates</code><br>
  <a href="monge-linearized-transport-coordinates.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-linearized-transport-coordinates.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

## Kantorovich Relaxation

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="kantorovich-coupling-matrix-marginals.ipynb"><img src="thumbnails/kantorovich-coupling-matrix-marginals.png" alt="Coupling matrices with marginals" width="210"></a><br>
  <strong>Coupling matrices with marginals</strong><br>
  <code>fig:kantorovich-coupling-matrix-marginals</code><br>
  <a href="kantorovich-coupling-matrix-marginals.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/kantorovich-coupling-matrix-marginals.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="kantorovich-permutation-versus-splitting.ipynb"><img src="thumbnails/kantorovich-permutation-versus-splitting.png" alt="From permutation matrices to splitting couplings" width="210"></a><br>
  <strong>From permutation matrices to splitting couplings</strong><br>
  <code>fig:kantorovich-permutation-versus-splitting</code><br>
  <a href="kantorovich-permutation-versus-splitting.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/kantorovich-permutation-versus-splitting.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="kantorovich-coupling-polylines.ipynb"><img src="thumbnails/kantorovich-coupling-polylines.png" alt="Couplings as transport polylines" width="210"></a><br>
  <strong>Couplings as transport polylines</strong><br>
  <code>fig:kantorovich-coupling-polylines</code><br>
  <a href="kantorovich-coupling-polylines.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/kantorovich-coupling-polylines.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="kantorovich-plan-interpolation.ipynb"><img src="thumbnails/kantorovich-plan-interpolation.png" alt="McCann interpolation from a transport plan" width="210"></a><br>
  <strong>McCann interpolation from a transport plan</strong><br>
  <code>fig:kantorovich-plan-interpolation</code><br>
  <a href="kantorovich-plan-interpolation.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/kantorovich-plan-interpolation.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="kantorovich-discrete-gluing-lemma.ipynb"><img src="thumbnails/kantorovich-discrete-gluing-lemma.png" alt="Discrete gluing lemma" width="210"></a><br>
  <strong>Discrete gluing lemma</strong><br>
  <code>fig:kantorovich-discrete-gluing-lemma</code><br>
  <a href="kantorovich-discrete-gluing-lemma.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/kantorovich-discrete-gluing-lemma.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="matching-quantitative-clt.ipynb"><img src="thumbnails/matching-quantitative-clt.png" alt="Quantitative central-limit theorem" width="210"></a><br>
  <strong>Quantitative central-limit theorem</strong><br>
  <code>fig:matching-quantitative-clt</code><br>
  <a href="matching-quantitative-clt.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/matching-quantitative-clt.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

## Sinkhorn

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="sinkhorn-entropy-lp-geometry.ipynb"><img src="thumbnails/sinkhorn-entropy-lp-geometry.png" alt="Entropic regularization on a transport polytope" width="210"></a><br>
  <strong>Entropic regularization on a transport polytope</strong><br>
  <code>fig:sinkhorn-entropy-lp-geometry</code><br>
  <a href="sinkhorn-entropy-lp-geometry.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-entropy-lp-geometry.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="sinkhorn-marginal-errors.ipynb"><img src="thumbnails/sinkhorn-marginal-errors.png" alt="Marginal constraints during Sinkhorn scaling" width="210"></a><br>
  <strong>Marginal constraints during Sinkhorn scaling</strong><br>
  <code>fig:sinkhorn-marginal-errors</code><br>
  <a href="sinkhorn-marginal-errors.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-marginal-errors.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="sinkhorn-continuous-marginal-scaling.ipynb"><img src="thumbnails/sinkhorn-continuous-marginal-scaling.png" alt="Dense Sinkhorn marginal scaling" width="210"></a><br>
  <strong>Dense Sinkhorn marginal scaling</strong><br>
  <code>fig:sinkhorn-continuous-marginal-scaling</code><br>
  <a href="sinkhorn-continuous-marginal-scaling.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-continuous-marginal-scaling.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="sinkhorn-coupling-iterations.ipynb"><img src="thumbnails/sinkhorn-coupling-iterations.png" alt="Coupling matrices along Sinkhorn iterations" width="210"></a><br>
  <strong>Coupling matrices along Sinkhorn iterations</strong><br>
  <code>fig:sinkhorn-coupling-iterations</code><br>
  <a href="sinkhorn-coupling-iterations.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-coupling-iterations.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="sinkhorn-potentials-iterations.ipynb"><img src="thumbnails/sinkhorn-potentials-iterations.png" alt="Sinkhorn potentials along the iteration" width="210"></a><br>
  <strong>Sinkhorn potentials along the iteration</strong><br>
  <code>fig:sinkhorn-potentials-iterations</code><br>
  <a href="sinkhorn-potentials-iterations.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-potentials-iterations.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="sinkhorn-linear-rate-epsilon.ipynb"><img src="thumbnails/sinkhorn-linear-rate-epsilon.png" alt="Sinkhorn marginal error rates" width="210"></a><br>
  <strong>Sinkhorn marginal error rates</strong><br>
  <code>fig:sinkhorn-linear-rate-epsilon</code><br>
  <a href="sinkhorn-linear-rate-epsilon.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-linear-rate-epsilon.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="sinkhorn-dual-potentials-epsilon.ipynb"><img src="thumbnails/sinkhorn-dual-potentials-epsilon.png" alt="Sinkhorn dual potentials as epsilon changes" width="210"></a><br>
  <strong>Sinkhorn dual potentials as epsilon changes</strong><br>
  <code>fig:sinkhorn-dual-potentials-epsilon</code><br>
  <a href="sinkhorn-dual-potentials-epsilon.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-dual-potentials-epsilon.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="sinkhorn-plan-epsilon.ipynb"><img src="thumbnails/sinkhorn-plan-epsilon.png" alt="Entropic plans as the temperature changes" width="210"></a><br>
  <strong>Entropic plans as the temperature changes</strong><br>
  <code>fig:sinkhorn-plan-epsilon</code><br>
  <a href="sinkhorn-plan-epsilon.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-plan-epsilon.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%"></td>
</tr>
</table>

## Dual Problem

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="dual-kantorovich-discrete-potentials.ipynb"><img src="thumbnails/dual-kantorovich-discrete-potentials.png" alt="Discrete Kantorovich dual potentials" width="210"></a><br>
  <strong>Discrete Kantorovich dual potentials</strong><br>
  <code>fig:dual-kantorovich-discrete-potentials</code><br>
  <a href="dual-kantorovich-discrete-potentials.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dual-kantorovich-discrete-potentials.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="dual-kantorovich-continuous-potentials.ipynb"><img src="thumbnails/dual-kantorovich-continuous-potentials.png" alt="Continuous Kantorovich dual potentials" width="210"></a><br>
  <strong>Continuous Kantorovich dual potentials</strong><br>
  <code>fig:dual-kantorovich-continuous-potentials</code><br>
  <a href="dual-kantorovich-continuous-potentials.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dual-kantorovich-continuous-potentials.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="dual-c-transform-envelope.ipynb"><img src="thumbnails/dual-c-transform-envelope.png" alt="Discrete c-transform lower envelopes" width="210"></a><br>
  <strong>Discrete c-transform lower envelopes</strong><br>
  <code>fig:dual-c-transform-envelope</code><br>
  <a href="dual-c-transform-envelope.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dual-c-transform-envelope.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="dual-alternating-c-transform-failure.ipynb"><img src="thumbnails/dual-alternating-c-transform-failure.png" alt="Concave closures from hard c-transforms" width="210"></a><br>
  <strong>Concave closures from hard c-transforms</strong><br>
  <code>fig:dual-alternating-c-transform-failure</code><br>
  <a href="dual-alternating-c-transform-failure.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dual-alternating-c-transform-failure.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%"></td>
<td width="33%"></td>
</tr>
</table>

## Semi-discrete and Wasserstein-1

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="semidiscrete-laguerre-cells.ipynb"><img src="thumbnails/semidiscrete-laguerre-cells.png" alt="Semi-discrete Laguerre cells" width="210"></a><br>
  <strong>Semi-discrete Laguerre cells</strong><br>
  <code>fig:semidiscrete-laguerre-cells</code><br>
  <a href="semidiscrete-laguerre-cells.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/semidiscrete-laguerre-cells.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="semidiscrete-lloyd-quantization.ipynb"><img src="thumbnails/semidiscrete-lloyd-quantization.png" alt="Lloyd quantization of a continuous density" width="210"></a><br>
  <strong>Lloyd quantization of a continuous density</strong><br>
  <code>fig:semidiscrete-lloyd-quantization</code><br>
  <a href="semidiscrete-lloyd-quantization.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/semidiscrete-lloyd-quantization.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="w1-graph-transport-flow.ipynb"><img src="thumbnails/w1-graph-transport-flow.png" alt="Graph Beckmann flow for W1" width="210"></a><br>
  <strong>Graph Beckmann flow for W1</strong><br>
  <code>fig:w1-graph-transport-flow</code><br>
  <a href="w1-graph-transport-flow.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/w1-graph-transport-flow.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

## Divergences and Dual Norms

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="dualnorms-linear-ot-embedding.ipynb"><img src="thumbnails/dualnorms-linear-ot-embedding.png" alt="Linear OT Tangent Coordinates" width="210"></a><br>
  <strong>Linear OT Tangent Coordinates</strong><br>
  <code>fig:dualnorms-linear-ot-embedding</code><br>
  <a href="dualnorms-linear-ot-embedding.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dualnorms-linear-ot-embedding.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="dualnorms-phi-generators.ipynb"><img src="thumbnails/dualnorms-phi-generators.png" alt="Generator Functions for $\phi$-Divergences" width="210"></a><br>
  <strong>Generator Functions for $\phi$-Divergences</strong><br>
  <code>fig:dualnorms-phi-generators</code><br>
  <a href="dualnorms-phi-generators.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dualnorms-phi-generators.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%"></td>
</tr>
</table>

## Advanced Topics on Entropic Regularization

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="sinkhorn-entropic-versus-quadratic-regularization.ipynb"><img src="thumbnails/sinkhorn-entropic-versus-quadratic-regularization.png" alt="Regularized Couplings and Entropy Choice" width="210"></a><br>
  <strong>Regularized Couplings and Entropy Choice</strong><br>
  <code>fig:sinkhorn-entropic-versus-quadratic-regularization</code><br>
  <a href="sinkhorn-entropic-versus-quadratic-regularization.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-entropic-versus-quadratic-regularization.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="sinkhorn-divergence-debiasing.ipynb"><img src="thumbnails/sinkhorn-divergence-debiasing.png" alt="Sinkhorn Debiasing by Point Optimization" width="210"></a><br>
  <strong>Sinkhorn Debiasing by Point Optimization</strong><br>
  <code>fig:sinkhorn-divergence-debiasing</code><br>
  <a href="sinkhorn-divergence-debiasing.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-divergence-debiasing.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="sinkhorn-bias-variance-tradeoff.ipynb"><img src="thumbnails/sinkhorn-bias-variance-tradeoff.png" alt="Empirical Decay of OT, MMD, and Sinkhorn" width="210"></a><br>
  <strong>Empirical Decay of OT, MMD, and Sinkhorn</strong><br>
  <code>fig:sinkhorn-bias-variance-tradeoff</code><br>
  <a href="sinkhorn-bias-variance-tradeoff.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-bias-variance-tradeoff.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

## Generalized Wasserstein Distances

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="unbalanced-mass-relaxation.ipynb"><img src="thumbnails/unbalanced-mass-relaxation.png" alt="Unbalanced OT and KL Mass Relaxation" width="210"></a><br>
  <strong>Unbalanced OT and KL Mass Relaxation</strong><br>
  <code>fig:unbalanced-mass-relaxation</code><br>
  <a href="unbalanced-mass-relaxation.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/unbalanced-mass-relaxation.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="unbalanced-divergence-choice.ipynb"><img src="thumbnails/unbalanced-divergence-choice.png" alt="Unbalanced OT: Choice of Marginal Divergence" width="210"></a><br>
  <strong>Unbalanced OT: Choice of Marginal Divergence</strong><br>
  <code>fig:unbalanced-divergence-choice</code><br>
  <a href="unbalanced-divergence-choice.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/unbalanced-divergence-choice.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="sliced-wasserstein-projections.ipynb"><img src="thumbnails/sliced-wasserstein-projections.png" alt="Sliced Wasserstein Projections" width="210"></a><br>
  <strong>Sliced Wasserstein Projections</strong><br>
  <code>fig:sliced-wasserstein-projections</code><br>
  <a href="sliced-wasserstein-projections.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sliced-wasserstein-projections.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="min-sliced-transport-plan.ipynb"><img src="thumbnails/min-sliced-transport-plan.png" alt="Min-Sliced Lifted Transport Plan" width="210"></a><br>
  <strong>Min-Sliced Lifted Transport Plan</strong><br>
  <code>fig:min-sliced-transport-plan</code><br>
  <a href="min-sliced-transport-plan.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/min-sliced-transport-plan.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="spectral-wasserstein-gauge.ipynb"><img src="thumbnails/spectral-wasserstein-gauge.png" alt="Spectral Gauges of Displacement Covariances" width="210"></a><br>
  <strong>Spectral Gauges of Displacement Covariances</strong><br>
  <code>fig:spectral-wasserstein-gauge</code><br>
  <a href="spectral-wasserstein-gauge.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/spectral-wasserstein-gauge.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%"></td>
</tr>
</table>

## Generalized OT Problems

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="barycenters-four-shapes.ipynb"><img src="thumbnails/barycenters-four-shapes.png" alt="Wasserstein Barycenters of Four Shapes" width="210"></a><br>
  <strong>Wasserstein Barycenters of Four Shapes</strong><br>
  <code>fig:barycenters-four-shapes</code><br>
  <a href="barycenters-four-shapes.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/barycenters-four-shapes.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="barycenters-gaussian-covariances.ipynb"><img src="thumbnails/barycenters-gaussian-covariances.png" alt="Gaussian covariance barycenters" width="210"></a><br>
  <strong>Gaussian covariance barycenters</strong><br>
  <code>fig:barycenters-gaussian-covariances</code><br>
  <a href="barycenters-gaussian-covariances.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/barycenters-gaussian-covariances.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="metric-learning-cost-deformation.ipynb"><img src="thumbnails/metric-learning-cost-deformation.png" alt="Metric Learning as Cost Deformation" width="210"></a><br>
  <strong>Metric Learning as Cost Deformation</strong><br>
  <code>fig:metric-learning-cost-deformation</code><br>
  <a href="metric-learning-cost-deformation.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/metric-learning-cost-deformation.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="weak-ot-barycentric-projection.ipynb"><img src="thumbnails/weak-ot-barycentric-projection.png" alt="Weak OT and barycentric projection" width="210"></a><br>
  <strong>Weak OT and barycentric projection</strong><br>
  <code>fig:weak-ot-barycentric-projection</code><br>
  <a href="weak-ot-barycentric-projection.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/weak-ot-barycentric-projection.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%"></td>
<td width="33%"></td>
</tr>
</table>

## Beyond Comparing Measures

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="gromov-isometry-matching.ipynb"><img src="thumbnails/gromov-isometry-matching.png" alt="Gromov--Wasserstein matching of isometric shapes" width="210"></a><br>
  <strong>Gromov--Wasserstein matching of isometric shapes</strong><br>
  <code>fig:gromov-isometry-matching</code><br>
  <a href="gromov-isometry-matching.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gromov-isometry-matching.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="gromov-nonisometric-distortion.ipynb"><img src="thumbnails/gromov-nonisometric-distortion.png" alt="Gromov--Wasserstein distortion for non-isometric shapes" width="210"></a><br>
  <strong>Gromov--Wasserstein distortion for non-isometric shapes</strong><br>
  <code>fig:gromov-nonisometric-distortion</code><br>
  <a href="gromov-nonisometric-distortion.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gromov-nonisometric-distortion.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="fused-gromov-feature-geometry.ipynb"><img src="thumbnails/fused-gromov-feature-geometry.png" alt="Fused Gromov--Wasserstein: features versus geometry" width="210"></a><br>
  <strong>Fused Gromov--Wasserstein: features versus geometry</strong><br>
  <code>fig:fused-gromov-feature-geometry</code><br>
  <a href="fused-gromov-feature-geometry.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/fused-gromov-feature-geometry.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

## Dynamic Optimal Transport

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="dynamic-continuity-equation.ipynb"><img src="thumbnails/dynamic-continuity-equation.png" alt="Continuity equation from particles to density" width="210"></a><br>
  <strong>Continuity equation from particles to density</strong><br>
  <code>fig:dynamic-continuity-equation</code><br>
  <a href="dynamic-continuity-equation.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dynamic-continuity-equation.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="dynamic-benamou-brenier-geodesic.ipynb"><img src="thumbnails/dynamic-benamou-brenier-geodesic.png" alt="Benamou--Brenier geodesic" width="210"></a><br>
  <strong>Benamou--Brenier geodesic</strong><br>
  <code>fig:dynamic-benamou-brenier-geodesic</code><br>
  <a href="dynamic-benamou-brenier-geodesic.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dynamic-benamou-brenier-geodesic.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%"></td>
</tr>
</table>

## Wasserstein Gradient Flows

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="gradflow-jko-entropy-steps.ipynb"><img src="thumbnails/gradflow-jko-entropy-steps.png" alt="JKO steps for the entropy flow" width="210"></a><br>
  <strong>JKO steps for the entropy flow</strong><br>
  <code>fig:gradflow-jko-entropy-steps</code><br>
  <a href="gradflow-jko-entropy-steps.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-jko-entropy-steps.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="gradflow-heat-versus-porous-medium.ipynb"><img src="thumbnails/gradflow-heat-versus-porous-medium.png" alt="Heat flow versus porous-medium flow" width="210"></a><br>
  <strong>Heat flow versus porous-medium flow</strong><br>
  <code>fig:gradflow-heat-versus-porous-medium</code><br>
  <a href="gradflow-heat-versus-porous-medium.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-heat-versus-porous-medium.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="gradflow-interaction-particles.ipynb"><img src="thumbnails/gradflow-interaction-particles.png" alt="Interaction-energy particle flow" width="210"></a><br>
  <strong>Interaction-energy particle flow</strong><br>
  <code>fig:gradflow-interaction-particles</code><br>
  <a href="gradflow-interaction-particles.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-interaction-particles.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="gradflow-particle-objective-geometries.ipynb"><img src="thumbnails/gradflow-particle-objective-geometries.png" alt="Particle trajectories for different discrepancy geometries" width="210"></a><br>
  <strong>Particle trajectories for different discrepancy geometries</strong><br>
  <code>fig:gradflow-particle-objective-geometries</code><br>
  <a href="gradflow-particle-objective-geometries.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-particle-objective-geometries.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="gradflow-mlp-homogeneous-relu.ipynb"><img src="thumbnails/gradflow-mlp-homogeneous-relu.png" alt="Homogeneous ReLU mean-field flow" width="210"></a><br>
  <strong>Homogeneous ReLU mean-field flow</strong><br>
  <code>fig:gradflow-mlp-homogeneous-relu</code><br>
  <a href="gradflow-mlp-homogeneous-relu.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-mlp-homogeneous-relu.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%"></td>
</tr>
</table>

## General Models via Transportation

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="generative-flow-matching-interpolants.ipynb"><img src="thumbnails/generative-flow-matching-interpolants.png" alt="Flow matching: stochastic interpolants" width="210"></a><br>
  <strong>Flow matching: stochastic interpolants</strong><br>
  <code>fig:generative-flow-matching-interpolants</code><br>
  <a href="generative-flow-matching-interpolants.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/generative-flow-matching-interpolants.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="generative-diffusion-1d-forward-backward.ipynb"><img src="thumbnails/generative-diffusion-1d-forward-backward.png" alt="One-dimensional diffusion bridge" width="210"></a><br>
  <strong>One-dimensional diffusion bridge</strong><br>
  <code>fig:generative-diffusion-1d-forward-backward</code><br>
  <a href="generative-diffusion-1d-forward-backward.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/generative-diffusion-1d-forward-backward.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="generative-diffusion-2d-forward-backward.ipynb"><img src="thumbnails/generative-diffusion-2d-forward-backward.png" alt="Two-dimensional diffusion bridge" width="210"></a><br>
  <strong>Two-dimensional diffusion bridge</strong><br>
  <code>fig:generative-diffusion-2d-forward-backward</code><br>
  <a href="generative-diffusion-2d-forward-backward.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/generative-diffusion-2d-forward-backward.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="generative-diffusion-versus-ot-2d.ipynb"><img src="thumbnails/generative-diffusion-versus-ot-2d.png" alt="Diffusion trajectories versus OT rays" width="210"></a><br>
  <strong>Diffusion trajectories versus OT rays</strong><br>
  <code>fig:generative-diffusion-versus-ot-2d</code><br>
  <a href="generative-diffusion-versus-ot-2d.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/generative-diffusion-versus-ot-2d.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="generative-drifting-model-trajectories.ipynb"><img src="thumbnails/generative-drifting-model-trajectories.png" alt="Normalized drifting model trajectories" width="210"></a><br>
  <strong>Normalized drifting model trajectories</strong><br>
  <code>fig:generative-drifting-model-trajectories</code><br>
  <a href="generative-drifting-model-trajectories.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/generative-drifting-model-trajectories.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%" align="center" valign="top">
  <a href="transformer-token-measure-flow.ipynb"><img src="thumbnails/transformer-token-measure-flow.png" alt="Attention as token-measure flow" width="210"></a><br>
  <strong>Attention as token-measure flow</strong><br>
  <code>fig:transformer-token-measure-flow</code><br>
  <a href="transformer-token-measure-flow.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/transformer-token-measure-flow.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
</tr>
</table>

<table>
<tr>
<td width="33%" align="center" valign="top">
  <a href="gradflow-gaussian-closure.ipynb"><img src="thumbnails/gradflow-gaussian-closure.png" alt="Gaussian closure of a Wasserstein flow" width="210"></a><br>
  <strong>Gaussian closure of a Wasserstein flow</strong><br>
  <code>fig:gradflow-gaussian-closure</code><br>
  <a href="gradflow-gaussian-closure.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-gaussian-closure.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>
<td width="33%"></td>
<td width="33%"></td>
</tr>
</table>

## Roadmap and Archive

Archived or exploratory notebooks are intentionally omitted from this gallery. See [`figures.md`](figures.md) for the full roadmap and archive list.
