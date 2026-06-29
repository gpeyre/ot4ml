# Figure Notebooks

This directory contains the executable notebooks that generate the illustrative
figures currently included in the OT4ML book. Each live notebook writes one or
several PDF panels to `../OT4ML/figures/<figure-name>/`; the thumbnails below
are compact PNG previews rendered from those outputs.

Rendered web version: [www.gpeyre.com/ot4ml/notebooks-figures/](https://www.gpeyre.com/ot4ml/notebooks-figures/).

**Gallery status.** Checked against the current LaTeX and MyST sources: all 117
live `OT4ML/figures/<figure-name>/` directories referenced by
`\includegraphics{figures/...}` have a matching live `.ipynb` file, thumbnail
in [`thumbnails/`](thumbnails/), and generated PDF panels in
`../OT4ML/figures/`. The searchable gallery currently exposes 118 figure views,
because `generative-diffusion-versus-ot-2d.ipynb` also provides the distinct
schedule-comparison view. The book currently has 120 LaTeX figure labels because
some figure directories generate several labeled views. The contact sheet
below is built from the same active thumbnail set.

This README intentionally lists only figure views integrated in the current
LaTeX or MyST sources. Retired or exploratory notebooks live in
[`removed/`](removed/), with their matching
generated panels in [`../OT4ML/figures/removed/`](../OT4ML/figures/removed/).
They are kept for provenance but omitted from this paper gallery.

Open a notebook locally from the **Open notebook** link, or launch it in Google
Colab from the badge. The Colab links target the `main` branch of
[`gpeyre/ot4ml`](https://github.com/gpeyre/ot4ml).

[![Contact sheet of book figures](thumbnails/book-figures-contact-sheet.png)](../README.md#figures-of-the-book)

## Optimal Matching between Point Clouds

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="matching-1d-quantile-assignment.ipynb"><img src="thumbnails/matching-1d-quantile-assignment.png" alt="One-dimensional quantile assignment" width="210"></a><br>
  <strong>One-dimensional quantile assignment</strong><br>
  <a href="matching-1d-quantile-assignment.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/matching-1d-quantile-assignment.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="matching-1d-convex-concave-costs.ipynb"><img src="thumbnails/matching-1d-convex-concave-costs.png" alt="Convex and concave costs on the line" width="210"></a><br>
  <strong>Convex and concave costs on the line</strong><br>
  <a href="matching-1d-convex-concave-costs.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/matching-1d-convex-concave-costs.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="monge-histogram-equalization.ipynb"><img src="thumbnails/monge-histogram-equalization.png" alt="Histogram equalization as one-dimensional Monge transport" width="210"></a><br>
  <strong>Histogram equalization as one-dimensional Monge transport</strong><br>
  <a href="monge-histogram-equalization.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-histogram-equalization.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="monge-circle-cut-unfolding.ipynb"><img src="thumbnails/monge-circle-cut-unfolding.png" alt="Circle transport by cutting and unfolding" width="210"></a><br>
  <strong>Circle transport by cutting and unfolding</strong><br>
  <a href="monge-circle-cut-unfolding.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-circle-cut-unfolding.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="matching-2d-cost-exponent.ipynb"><img src="thumbnails/matching-2d-cost-exponent.png" alt="Two-dimensional assignments for different cost exponents" width="210"></a><br>
  <strong>Two-dimensional assignments for different cost exponents</strong><br>
  <a href="matching-2d-cost-exponent.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/matching-2d-cost-exponent.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="matching-resolution-and-weights.ipynb"><img src="thumbnails/matching-resolution-and-weights.png" alt="Resolution and nonuniform weights in discrete transport" width="210"></a><br>
  <strong>Resolution and nonuniform weights in discrete transport</strong><br>
  <a href="matching-resolution-and-weights.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/matching-resolution-and-weights.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="matching-rational-duplication.ipynb"><img src="thumbnails/matching-rational-duplication.png" alt="Rational weights as duplicated matchings" width="210"></a><br>
  <strong>Rational weights as duplicated matchings</strong><br>
  <a href="matching-rational-duplication.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/matching-rational-duplication.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="matching-hungarian-progression.ipynb"><img src="thumbnails/matching-hungarian-progression.png" alt="Hungarian algorithm progression" width="210"></a><br>
  <strong>Hungarian algorithm progression</strong><br>
  <a href="matching-hungarian-progression.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/matching-hungarian-progression.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%"></td>

</tr>
</table>

## Monge Problem between Measures

<table>
<tr>

<td width="25%" align="center" valign="top">
  <a href="monge-jacobian-pushforward-density.ipynb"><img src="thumbnails/monge-jacobian-pushforward-density.png" alt="Jacobian determinant in the density push-forward formula" width="210"></a><br>
  <strong>Jacobian density push-forward</strong><br>
  <a href="monge-jacobian-pushforward-density.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-jacobian-pushforward-density.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="monge-polar-factorization.ipynb"><img src="thumbnails/monge-polar-factorization.png" alt="Polar factorization as relabeling plus a Brenier map" width="210"></a><br>
  <strong>Polar factorization</strong><br>
  <a href="monge-polar-factorization.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-polar-factorization.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="monge-semidiscrete-maps.ipynb"><img src="thumbnails/monge-semidiscrete-maps.png" alt="Semi-discrete Monge maps" width="210"></a><br>
  <strong>Semi-discrete Monge maps</strong><br>
  <a href="monge-semidiscrete-maps.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-semidiscrete-maps.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="monge-color-transfer-rgb.ipynb"><img src="thumbnails/monge-color-transfer-rgb.png" alt="RGB color transfer by a Monge map" width="210"></a><br>
  <strong>RGB color transfer by a Monge map</strong><br>
  <a href="monge-color-transfer-rgb.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-color-transfer-rgb.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="25%" align="center" valign="top">
  <a href="monge-shape-mccann-interpolation.ipynb"><img src="thumbnails/monge-shape-mccann-interpolation.png" alt="McCann interpolation between two shapes" width="210"></a><br>
  <strong>McCann interpolation between two shapes</strong><br>
  <a href="monge-shape-mccann-interpolation.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-shape-mccann-interpolation.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="monge-caffarelli-nonconvex-map.ipynb"><img src="thumbnails/monge-caffarelli-nonconvex-map.png" alt="Disk-to-dumbbell empirical McCann interpolation" width="210"></a><br>
  <strong>Disk-to-dumbbell empirical McCann interpolation</strong><br>
  <a href="monge-caffarelli-nonconvex-map.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-caffarelli-nonconvex-map.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="monge-1d-quantile-geodesic.ipynb"><img src="thumbnails/monge-1d-quantile-geodesic.png" alt="One-dimensional quantiles and displacement interpolation" width="210"></a><br>
  <strong>One-dimensional quantiles and displacement interpolation</strong><br>
  <a href="monge-1d-quantile-geodesic.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-1d-quantile-geodesic.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="monge-triangular-rearrangement.ipynb"><img src="thumbnails/monge-triangular-rearrangement.png" alt="Triangular rearrangement between two silhouettes" width="210"></a><br>
  <strong>Triangular rearrangement between two silhouettes</strong><br>
  <a href="monge-triangular-rearrangement.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-triangular-rearrangement.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="monge-gaussian-w2-geodesic.ipynb"><img src="thumbnails/monge-gaussian-w2-geodesic.png" alt="Gaussian W2 geodesics, Bures ellipses, and covariance cone" width="210"></a><br>
  <strong>Gaussian W2 geodesics and Bures cone</strong><br>
  <a href="monge-gaussian-w2-geodesic.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-gaussian-w2-geodesic.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="monge-gaussian-fr-mean-geodesic.ipynb"><img src="thumbnails/monge-gaussian-fr-mean-geodesic.png" alt="Fisher-Rao and Wasserstein geodesics for one-dimensional Gaussians" width="210"></a><br>
  <strong>Gaussian W2 and Fisher-Rao geodesics</strong><br>
  <a href="monge-gaussian-fr-mean-geodesic.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-gaussian-fr-mean-geodesic.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="monge-gaussian-fr-vs-bures-cone.ipynb"><img src="thumbnails/monge-gaussian-fr-vs-bures-cone.png" alt="Bures and Fisher-Rao covariance paths near the PSD boundary" width="210"></a><br>
  <strong>Bures and Fisher-Rao covariance paths</strong><br>
  <a href="monge-gaussian-fr-vs-bures-cone.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/monge-gaussian-fr-vs-bures-cone.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

## Kantorovich Relaxation

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="kantorovich-coupling-polylines.ipynb"><img src="thumbnails/kantorovich-coupling-polylines.png" alt="Couplings as straight transport segments" width="210"></a><br>
  <strong>Couplings as straight transport segments</strong><br>
  <a href="kantorovich-coupling-polylines.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/kantorovich-coupling-polylines.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="kantorovich-coupling-matrix-marginals.ipynb"><img src="thumbnails/kantorovich-coupling-matrix-marginals.png" alt="Coupling matrices with marginals" width="210"></a><br>
  <strong>Coupling matrices with marginals</strong><br>
  <a href="kantorovich-coupling-matrix-marginals.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/kantorovich-coupling-matrix-marginals.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="kantorovich-permutation-versus-splitting.ipynb"><img src="thumbnails/kantorovich-permutation-versus-splitting.png" alt="From permutation matrices to splitting couplings" width="210"></a><br>
  <strong>From permutation matrices to splitting couplings</strong><br>
  <a href="kantorovich-permutation-versus-splitting.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/kantorovich-permutation-versus-splitting.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="25%" align="center" valign="top">
  <a href="birkhoff-von-neumann-cycle.ipynb"><img src="thumbnails/birkhoff-von-neumann-cycle.png" alt="Birkhoff-von Neumann cycle certificate" width="210"></a><br>
  <strong>Birkhoff-von Neumann cycle certificate</strong><br>
  <a href="birkhoff-von-neumann-cycle.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/birkhoff-von-neumann-cycle.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="kantorovich-log-barrier-lp-geometry.ipynb"><img src="thumbnails/kantorovich-log-barrier-lp-geometry.png" alt="Logarithmic barrier central path" width="210"></a><br>
  <strong>Logarithmic barrier central path</strong><br>
  <a href="kantorovich-log-barrier-lp-geometry.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/kantorovich-log-barrier-lp-geometry.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="kantorovich-plan-interpolation.ipynb"><img src="thumbnails/kantorovich-plan-interpolation.png" alt="McCann interpolation from a transport plan" width="210"></a><br>
  <strong>McCann interpolation from a transport plan</strong><br>
  <a href="kantorovich-plan-interpolation.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/kantorovich-plan-interpolation.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="kantorovich-discrete-gluing-lemma.ipynb"><img src="thumbnails/kantorovich-discrete-gluing-lemma.png" alt="Discrete gluing lemma" width="210"></a><br>
  <strong>Discrete gluing lemma</strong><br>
  <a href="kantorovich-discrete-gluing-lemma.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/kantorovich-discrete-gluing-lemma.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="matching-quantitative-clt.ipynb"><img src="thumbnails/matching-quantitative-clt.png" alt="Quantitative central-limit theorem" width="210"></a><br>
  <strong>Quantitative central-limit theorem</strong><br>
  <a href="matching-quantitative-clt.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/matching-quantitative-clt.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="kantorovich-wow-mixtures.ipynb"><img src="thumbnails/kantorovich-wow-mixtures.png" alt="Wasserstein over Wasserstein for asymmetric mixtures" width="210"></a><br>
  <strong>Wasserstein over Wasserstein for asymmetric mixtures</strong><br>
  <a href="kantorovich-wow-mixtures.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/kantorovich-wow-mixtures.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="kantorovich-dro-ambiguity.ipynb"><img src="thumbnails/kantorovich-dro-ambiguity.png" alt="Wasserstein DRO logistic boundaries" width="210"></a><br>
  <strong>Wasserstein DRO logistic boundaries</strong><br>
  <a href="kantorovich-dro-ambiguity.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/kantorovich-dro-ambiguity.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

## Dual Problem

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="dual-kantorovich-discrete-potentials.ipynb"><img src="thumbnails/dual-kantorovich-discrete-potentials.png" alt="Discrete Kantorovich dual potentials" width="210"></a><br>
  <strong>Discrete Kantorovich dual potentials</strong><br>
  <a href="dual-kantorovich-discrete-potentials.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dual-kantorovich-discrete-potentials.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="dual-kantorovich-continuous-potentials.ipynb"><img src="thumbnails/dual-kantorovich-continuous-potentials.png" alt="Continuous Kantorovich dual potentials" width="210"></a><br>
  <strong>Continuous Kantorovich dual potentials</strong><br>
  <a href="dual-kantorovich-continuous-potentials.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dual-kantorovich-continuous-potentials.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="dual-complementary-slackness-contacts.ipynb"><img src="thumbnails/dual-complementary-slackness-contacts.png" alt="Complementary slackness contacts" width="210"></a><br>
  <strong>Complementary slackness contacts</strong><br>
  <a href="dual-complementary-slackness-contacts.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dual-complementary-slackness-contacts.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="dual-c-transform-envelope.ipynb"><img src="thumbnails/dual-c-transform-envelope.png" alt="Discrete c-transform lower envelopes" width="210"></a><br>
  <strong>Discrete c-transform lower envelopes</strong><br>
  <a href="dual-c-transform-envelope.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dual-c-transform-envelope.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="dual-alternating-c-transform-failure.ipynb"><img src="thumbnails/dual-alternating-c-transform-failure.png" alt="Concave closures from hard c-transforms" width="210"></a><br>
  <strong>Concave closures from hard c-transforms</strong><br>
  <a href="dual-alternating-c-transform-failure.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dual-alternating-c-transform-failure.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="dual-auction-progression.ipynb"><img src="thumbnails/dual-auction-progression.png" alt="Auction algorithm progression" width="210"></a><br>
  <strong>Auction algorithm progression</strong><br>
  <a href="dual-auction-progression.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dual-auction-progression.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

## Semi-discrete and $W_1$

<table>
<tr>

<td width="25%" align="center" valign="top">
  <a href="semidiscrete-laguerre-cells.ipynb"><img src="thumbnails/semidiscrete-laguerre-cells.png" alt="Semi-discrete Laguerre cells" width="210"></a><br>
  <strong>Semi-discrete Laguerre cells</strong><br>
  <a href="semidiscrete-laguerre-cells.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/semidiscrete-laguerre-cells.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="semidiscrete-weight-gradient-cells.ipynb"><img src="thumbnails/semidiscrete-weight-gradient-cells.png" alt="Semi-discrete weight-gradient cells" width="210"></a><br>
  <strong>Semi-discrete weight-gradient cells</strong><br>
  <a href="semidiscrete-weight-gradient-cells.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/semidiscrete-weight-gradient-cells.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="semidiscrete-lloyd-quantization.ipynb"><img src="thumbnails/semidiscrete-lloyd-quantization.png" alt="Lloyd quantization of a continuous density" width="210"></a><br>
  <strong>Lloyd quantization of a continuous density</strong><br>
  <a href="semidiscrete-lloyd-quantization.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/semidiscrete-lloyd-quantization.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="semidiscrete-lloyd-flow-mixtures.ipynb"><img src="thumbnails/semidiscrete-lloyd-flow-mixtures.png" alt="Continuous Lloyd flow between Gaussian mixtures" width="210"></a><br>
  <strong>Continuous Lloyd flow between Gaussian mixtures</strong><br>
  <a href="semidiscrete-lloyd-flow-mixtures.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/semidiscrete-lloyd-flow-mixtures.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="semidiscrete-quantile-quantization-rates.ipynb"><img src="thumbnails/semidiscrete-quantile-quantization-rates.png" alt="One-dimensional quantile quantization rates" width="210"></a><br>
  <strong>One-dimensional quantile quantization rates</strong><br>
  <a href="semidiscrete-quantile-quantization-rates.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/semidiscrete-quantile-quantization-rates.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="w1-graph-transport-flow.ipynb"><img src="thumbnails/w1-graph-transport-flow.png" alt="Graph Beckmann flow for W1" width="210"></a><br>
  <strong>Graph Beckmann flow for W1</strong><br>
  <a href="w1-graph-transport-flow.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/w1-graph-transport-flow.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%"></td>

</tr>
</table>

## Divergences and Dual Norms

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="dualnorms-ipm-witnesses.ipynb"><img src="thumbnails/dualnorms-ipm-witnesses.png" alt="Integral probability metric witnesses" width="210"></a><br>
  <strong>Integral probability metric witnesses</strong><br>
  <a href="dualnorms-ipm-witnesses.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dualnorms-ipm-witnesses.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="dualnorms-phi-generators.ipynb"><img src="thumbnails/dualnorms-phi-generators.png" alt="Generator functions for phi-divergences" width="210"></a><br>
  <strong>Generator functions for phi-divergences</strong><br>
  <a href="dualnorms-phi-generators.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dualnorms-phi-generators.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%"></td>

</tr>
</table>

## Entropic Regularization: Sinkhorn Algorithm

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-entropy-lp-geometry.ipynb"><img src="thumbnails/sinkhorn-entropy-lp-geometry.png" alt="Entropic regularization on a transport polytope" width="210"></a><br>
  <strong>Entropic regularization on a transport polytope</strong><br>
  <a href="sinkhorn-entropy-lp-geometry.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-entropy-lp-geometry.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-marginal-errors.ipynb"><img src="thumbnails/sinkhorn-marginal-errors.png" alt="Marginal constraints during Sinkhorn scaling" width="210"></a><br>
  <strong>Marginal constraints during Sinkhorn scaling</strong><br>
  <a href="sinkhorn-marginal-errors.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-marginal-errors.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-continuous-marginal-scaling.ipynb"><img src="thumbnails/sinkhorn-continuous-marginal-scaling.png" alt="Dense Sinkhorn marginal scaling" width="210"></a><br>
  <strong>Dense Sinkhorn marginal scaling</strong><br>
  <a href="sinkhorn-continuous-marginal-scaling.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-continuous-marginal-scaling.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-coupling-iterations.ipynb"><img src="thumbnails/sinkhorn-coupling-iterations.png" alt="Entropic plans as epsilon changes" width="210"></a><br>
  <strong>Entropic plans as epsilon changes</strong><br>
  <a href="sinkhorn-coupling-iterations.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-coupling-iterations.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-potentials-iterations.ipynb"><img src="thumbnails/sinkhorn-potentials-iterations.png" alt="Sinkhorn potentials along the iteration" width="210"></a><br>
  <strong>Sinkhorn potentials along the iteration</strong><br>
  <a href="sinkhorn-potentials-iterations.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-potentials-iterations.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-linear-rate-epsilon.ipynb"><img src="thumbnails/sinkhorn-linear-rate-epsilon.png" alt="Sinkhorn marginal error rates" width="210"></a><br>
  <strong>Sinkhorn marginal error rates</strong><br>
  <a href="sinkhorn-linear-rate-epsilon.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-linear-rate-epsilon.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-geodesics-in-heat.ipynb"><img src="thumbnails/sinkhorn-geodesics-in-heat.png" alt="Geodesics in heat for a curve" width="210"></a><br>
  <strong>Geodesics in heat for a curve</strong><br>
  <a href="sinkhorn-geodesics-in-heat.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-geodesics-in-heat.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-hopf-cole-transform.ipynb"><img src="thumbnails/sinkhorn-hopf-cole-transform.png" alt="Soft biconjugates and Hopf-Cole Burgers evolution" width="210"></a><br>
  <strong>Soft biconjugates and Burgers</strong><br>
  <a href="sinkhorn-hopf-cole-transform.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-hopf-cole-transform.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-path-space-bridges.ipynb"><img src="thumbnails/sinkhorn-path-space-bridges.png" alt="Path-space Brownian bridges for Sinkhorn couplings" width="210"></a><br>
  <strong>Path-space Brownian bridges</strong><br>
  <a href="sinkhorn-path-space-bridges.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-path-space-bridges.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-dual-potentials-epsilon.ipynb"><img src="thumbnails/sinkhorn-dual-potentials-epsilon.png" alt="Sinkhorn dual potentials as epsilon changes" width="210"></a><br>
  <strong>Sinkhorn dual potentials as epsilon changes</strong><br>
  <a href="sinkhorn-dual-potentials-epsilon.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-dual-potentials-epsilon.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-plan-epsilon.ipynb"><img src="thumbnails/sinkhorn-plan-epsilon.png" alt="Entropic couplings as epsilon changes" width="210"></a><br>
  <strong>Entropic couplings as epsilon changes</strong><br>
  <a href="sinkhorn-plan-epsilon.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-plan-epsilon.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-soft-c-transform-epsilon.ipynb"><img src="thumbnails/sinkhorn-soft-c-transform-epsilon.png" alt="Soft c-transforms as epsilon decreases" width="210"></a><br>
  <strong>Soft c-transforms as epsilon decreases</strong><br>
  <a href="sinkhorn-soft-c-transform-epsilon.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-soft-c-transform-epsilon.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-phi-soft-c-transforms.ipynb"><img src="thumbnails/sinkhorn-phi-soft-c-transforms.png" alt="Generalized phi-soft c-transforms" width="210"></a><br>
  <strong>Generalized phi-soft c-transforms</strong><br>
  <a href="sinkhorn-phi-soft-c-transforms.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-phi-soft-c-transforms.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-entropic-versus-quadratic-regularization.ipynb"><img src="thumbnails/sinkhorn-entropic-versus-quadratic-regularization.png" alt="Regularized couplings and entropy choice" width="210"></a><br>
  <strong>Regularized couplings and entropy choice</strong><br>
  <a href="sinkhorn-entropic-versus-quadratic-regularization.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-entropic-versus-quadratic-regularization.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-divergence-debiasing.ipynb"><img src="thumbnails/sinkhorn-divergence-debiasing.png" alt="Sinkhorn debiasing by point optimization" width="210"></a><br>
  <strong>Sinkhorn debiasing by point optimization</strong><br>
  <a href="sinkhorn-divergence-debiasing.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-divergence-debiasing.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-complex-epsilon-continuation.ipynb"><img src="thumbnails/sinkhorn-complex-epsilon-continuation.png" alt="Complex Sinkhorn potentials near a real epsilon" width="210"></a><br>
  <strong>Complex Sinkhorn potentials</strong><br>
  <a href="sinkhorn-complex-epsilon-continuation.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-complex-epsilon-continuation.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

## Entropic Regularization: Convergence

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-continuous-epsilon-flow.ipynb"><img src="thumbnails/sinkhorn-continuous-epsilon-flow.png" alt="Continuous ε-Sinkhorn flow" width="210"></a><br>
  <strong>Continuous ε-Sinkhorn flow</strong><br>
  <a href="sinkhorn-continuous-epsilon-flow.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-continuous-epsilon-flow.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-bias-variance-tradeoff.ipynb"><img src="thumbnails/sinkhorn-bias-variance-tradeoff.png" alt="Empirical fluctuations of regularized losses" width="210"></a><br>
  <strong>Empirical fluctuations of regularized losses</strong><br>
  <a href="sinkhorn-bias-variance-tradeoff.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-bias-variance-tradeoff.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="sinkhorn-mfunctions-nonvariational-scaling.ipynb"><img src="thumbnails/sinkhorn-mfunctions-nonvariational-scaling.png" alt="Monotone non-variational Sinkhorn scaling" width="210"></a><br>
  <strong>Monotone non-variational scaling</strong><br>
  <a href="sinkhorn-mfunctions-nonvariational-scaling.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sinkhorn-mfunctions-nonvariational-scaling.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

## Generalized Wasserstein Distances

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="partial-ot-active-mass.ipynb"><img src="thumbnails/partial-ot-active-mass.png" alt="Partial OT active mass selection" width="210"></a><br>
  <strong>Partial OT active mass selection</strong><br>
  <a href="partial-ot-active-mass.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/partial-ot-active-mass.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="partial-ot-shape-active-mass.ipynb"><img src="thumbnails/partial-ot-shape-active-mass.png" alt="Partial OT active regions between shapes" width="210"></a><br>
  <strong>Partial OT active regions between shapes</strong><br>
  <a href="partial-ot-shape-active-mass.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/partial-ot-shape-active-mass.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="unbalanced-mass-relaxation.ipynb"><img src="thumbnails/unbalanced-mass-relaxation.png" alt="Unbalanced OT and KL mass relaxation" width="210"></a><br>
  <strong>Unbalanced OT and KL mass relaxation</strong><br>
  <a href="unbalanced-mass-relaxation.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/unbalanced-mass-relaxation.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
<tr>

<td width="33%" align="center" valign="top">
  <a href="unbalanced-divergence-choice.ipynb"><img src="thumbnails/unbalanced-divergence-choice.png" alt="Unbalanced OT and marginal divergences" width="210"></a><br>
  <strong>Unbalanced OT and marginal divergences</strong><br>
  <a href="unbalanced-divergence-choice.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/unbalanced-divergence-choice.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="sliced-wasserstein-projections.ipynb"><img src="thumbnails/sliced-wasserstein-projections.png" alt="Sliced Wasserstein projections" width="210"></a><br>
  <strong>Sliced Wasserstein projections</strong><br>
  <a href="sliced-wasserstein-projections.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/sliced-wasserstein-projections.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="min-sliced-transport-plan.ipynb"><img src="thumbnails/min-sliced-transport-plan.png" alt="Min-sliced lifted transport plan" width="210"></a><br>
  <strong>Min-sliced lifted transport plan</strong><br>
  <a href="min-sliced-transport-plan.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/min-sliced-transport-plan.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="wasserstein-procrustes-rigid-motion.ipynb"><img src="thumbnails/wasserstein-procrustes-rigid-motion.png" alt="Wasserstein--Procrustes rigid alignment" width="210"></a><br>
  <strong>Wasserstein--Procrustes rigid alignment</strong><br>
  <a href="wasserstein-procrustes-rigid-motion.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/wasserstein-procrustes-rigid-motion.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="dualnorms-linear-ot-embedding.ipynb"><img src="thumbnails/dualnorms-linear-ot-embedding.png" alt="Linear OT tangent coordinates" width="210"></a><br>
  <strong>Linear OT tangent coordinates</strong><br>
  <a href="dualnorms-linear-ot-embedding.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dualnorms-linear-ot-embedding.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="linear-ot-1d-pca.ipynb"><img src="thumbnails/linear-ot-1d-pca.png" alt="One-dimensional linear OT PCA" width="210"></a><br>
  <strong>One-dimensional linear OT PCA</strong><br>
  <a href="linear-ot-1d-pca.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/linear-ot-1d-pca.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="linear-ot-mnist-pca.ipynb"><img src="thumbnails/linear-ot-mnist-pca.png" alt="Linear OT PCA on MNIST zeros" width="210"></a><br>
  <strong>Linear OT PCA on MNIST zeros</strong><br>
  <a href="linear-ot-mnist-pca.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/linear-ot-mnist-pca.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="spectral-wasserstein-gauge.ipynb"><img src="thumbnails/spectral-wasserstein-gauge.png" alt="Spectral gauges of displacement covariances" width="210"></a><br>
  <strong>Spectral gauges of displacement covariances</strong><br>
  <a href="spectral-wasserstein-gauge.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/spectral-wasserstein-gauge.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

## Generalized OT Problems

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="barycenters-four-shapes.ipynb"><img src="thumbnails/barycenters-four-shapes.png" alt="Wasserstein barycenters of four shapes" width="210"></a><br>
  <strong>Wasserstein barycenters of four shapes</strong><br>
  <a href="barycenters-four-shapes.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/barycenters-four-shapes.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="barycenters-gaussian-covariances.ipynb"><img src="thumbnails/barycenters-gaussian-covariances.png" alt="Gaussian covariance barycenters" width="210"></a><br>
  <strong>Gaussian covariance barycenters</strong><br>
  <a href="barycenters-gaussian-covariances.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/barycenters-gaussian-covariances.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="multimarginal-coulomb-sinkhorn.ipynb"><img src="thumbnails/multimarginal-coulomb-sinkhorn.png" alt="Entropic three-marginal Coulomb transport" width="210"></a><br>
  <strong>Three-marginal Coulomb Sinkhorn</strong><br>
  <a href="multimarginal-coulomb-sinkhorn.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/multimarginal-coulomb-sinkhorn.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="low-rank-ot-factorization.ipynb"><img src="thumbnails/low-rank-ot-factorization.png" alt="Low-rank entropic OT factorization" width="210"></a><br>
  <strong>Low-rank entropic OT factorization</strong><br>
  <a href="low-rank-ot-factorization.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/low-rank-ot-factorization.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="capacity-constrained-ot-1d.ipynb"><img src="thumbnails/capacity-constrained-ot-1d.png" alt="Capacity-constrained OT in one dimension" width="210"></a><br>
  <strong>Capacity-constrained OT in 1D</strong><br>
  <a href="capacity-constrained-ot-1d.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/capacity-constrained-ot-1d.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="capacity-constrained-ot-2d.ipynb"><img src="thumbnails/capacity-constrained-ot-2d.png" alt="Capacity-constrained local self-couplings" width="210"></a><br>
  <strong>Capacity-constrained local couplings</strong><br>
  <a href="capacity-constrained-ot-2d.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/capacity-constrained-ot-2d.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="metric-learning-cost-deformation.ipynb"><img src="thumbnails/metric-learning-cost-deformation.png" alt="Metric learning as cost deformation" width="210"></a><br>
  <strong>Metric learning as cost deformation</strong><br>
  <a href="metric-learning-cost-deformation.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/metric-learning-cost-deformation.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="inverse-ot-bilinear-logo-map.ipynb"><img src="thumbnails/inverse-ot-bilinear-logo-map.png" alt="Forward OT solutions for bilinear logo costs" width="210"></a><br>
  <strong>Forward OT solutions for bilinear logo costs</strong><br>
  <a href="inverse-ot-bilinear-logo-map.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/inverse-ot-bilinear-logo-map.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="inverse-ot-gap-loss.ipynb"><img src="thumbnails/inverse-ot-gap-loss.png" alt="Inverse OT gap loss on Gaussian mixtures" width="210"></a><br>
  <strong>Inverse OT gap loss on Gaussian mixtures</strong><br>
  <a href="inverse-ot-gap-loss.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/inverse-ot-gap-loss.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="weak-ot-barycentric-projection.ipynb"><img src="thumbnails/weak-ot-barycentric-projection.png" alt="Weak OT and barycentric projection" width="210"></a><br>
  <strong>Weak OT and barycentric projection</strong><br>
  <a href="weak-ot-barycentric-projection.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/weak-ot-barycentric-projection.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="martingale-ot-centered-kernels.ipynb"><img src="thumbnails/martingale-ot-centered-kernels.png" alt="Martingale OT with centered kernels" width="210"></a><br>
  <strong>Martingale OT with centered kernels</strong><br>
  <a href="martingale-ot-centered-kernels.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/martingale-ot-centered-kernels.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

## Beyond Comparing Measures

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="vector-valued-measure-geodesics.ipynb"><img src="thumbnails/vector-valued-measure-geodesics.png" alt="Positive vector-valued coupled transport" width="210"></a><br>
  <strong>Positive vector-valued coupled transport</strong><br>
  <a href="vector-valued-measure-geodesics.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/vector-valued-measure-geodesics.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="matrix-valued-measure-geodesic.ipynb"><img src="thumbnails/matrix-valued-measure-geodesic.png" alt="Positive matrix-valued coupled transport" width="210"></a><br>
  <strong>Positive matrix-valued coupled transport</strong><br>
  <a href="matrix-valued-measure-geodesic.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/matrix-valued-measure-geodesic.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="gromov-isometry-matching.ipynb"><img src="thumbnails/gromov-isometry-matching.png" alt="Gromov-Wasserstein matching of isometric shapes" width="210"></a><br>
  <strong>Gromov-Wasserstein matching of isometric shapes</strong><br>
  <a href="gromov-isometry-matching.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gromov-isometry-matching.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="gromov-nonisometric-distortion.ipynb"><img src="thumbnails/gromov-nonisometric-distortion.png" alt="Gromov-Wasserstein distortion for non-isometric shapes" width="210"></a><br>
  <strong>Gromov-Wasserstein distortion for non-isometric shapes</strong><br>
  <a href="gromov-nonisometric-distortion.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gromov-nonisometric-distortion.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="fused-gromov-feature-geometry.ipynb"><img src="thumbnails/fused-gromov-feature-geometry.png" alt="Fused Gromov-Wasserstein: features versus geometry" width="210"></a><br>
  <strong>Fused Gromov-Wasserstein: features versus geometry</strong><br>
  <a href="fused-gromov-feature-geometry.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/fused-gromov-feature-geometry.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%"></td>

</tr>
</table>

## Dynamic Optimal Transport

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="dynamic-benamou-brenier-duality.ipynb"><img src="thumbnails/dynamic-benamou-brenier-duality.png" alt="Benamou-Brenier primal-dual solutions" width="210"></a><br>
  <strong>Benamou-Brenier primal-dual solutions</strong><br>
  <a href="dynamic-benamou-brenier-duality.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dynamic-benamou-brenier-duality.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="dynamic-benamou-brenier-geodesic.ipynb"><img src="thumbnails/dynamic-benamou-brenier-geodesic.png" alt="Benamou-Brenier geodesic" width="210"></a><br>
  <strong>Benamou-Brenier geodesic</strong><br>
  <a href="dynamic-benamou-brenier-geodesic.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dynamic-benamou-brenier-geodesic.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="dynamic-unbalanced-geodesic.ipynb"><img src="thumbnails/dynamic-unbalanced-geodesic.png" alt="One-dimensional balanced and unbalanced dynamic geodesics" width="210"></a><br>
  <strong>One-dimensional balanced and unbalanced dynamic geodesics</strong><br>
  <a href="dynamic-unbalanced-geodesic.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/dynamic-unbalanced-geodesic.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
<tr>

<td width="33%" align="center" valign="top">
  <a href="discrete-markov-simplex-distances.ipynb"><img src="thumbnails/discrete-markov-simplex-distances.png" alt="Discrete Wasserstein distances on Markov-chain simplices" width="210"></a><br>
  <strong>Discrete Wasserstein distances on Markov-chain simplices</strong><br>
  <a href="discrete-markov-simplex-distances.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/discrete-markov-simplex-distances.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%"></td>

<td width="33%"></td>

</tr>
</table>

## Wasserstein Gradient Flows

<table>
<tr>

<td width="25%" align="center" valign="top">
  <a href="gradflow-jko-entropy-steps.ipynb"><img src="thumbnails/gradflow-jko-entropy-steps.png" alt="JKO steps for the entropy flow" width="210"></a><br>
  <strong>JKO steps for the entropy flow</strong><br>
  <a href="gradflow-jko-entropy-steps.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-jko-entropy-steps.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="gradflow-heat-versus-porous-medium.ipynb"><img src="thumbnails/gradflow-heat-versus-porous-medium.png" alt="Heat flow and porous-medium powers" width="210"></a><br>
  <strong>Heat flow and porous-medium powers</strong><br>
  <a href="gradflow-heat-versus-porous-medium.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-heat-versus-porous-medium.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="gradflow-fractional-laplacian-diffusion.ipynb"><img src="thumbnails/gradflow-fractional-laplacian-diffusion.png" alt="Fractional Laplacian diffusion" width="210"></a><br>
  <strong>Fractional Laplacian diffusion</strong><br>
  <a href="gradflow-fractional-laplacian-diffusion.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-fractional-laplacian-diffusion.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="25%" align="center" valign="top">
  <a href="gradflow-mmd-particle-count.ipynb"><img src="thumbnails/gradflow-mmd-particle-count.png" alt="Particle count for squared-MMD flow" width="210"></a><br>
  <strong>Particle count for squared-MMD flow</strong><br>
  <a href="gradflow-mmd-particle-count.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-mmd-particle-count.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="gradflow-interaction-particles.ipynb"><img src="thumbnails/gradflow-interaction-particles.png" alt="Interaction-energy particle flow" width="210"></a><br>
  <strong>Interaction-energy particle flow</strong><br>
  <a href="gradflow-interaction-particles.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-interaction-particles.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="gradflow-particle-objective-geometries.ipynb"><img src="thumbnails/gradflow-particle-objective-geometries.png" alt="Particle trajectories for different discrepancy geometries" width="210"></a><br>
  <strong>Particle trajectories for different discrepancy geometries</strong><br>
  <a href="gradflow-particle-objective-geometries.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-particle-objective-geometries.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="gradflow-fokker-planck-three-representations.ipynb"><img src="thumbnails/gradflow-fokker-planck-three-representations.png" alt="Three Fokker-Planck representations" width="210"></a><br>
  <strong>Three Fokker-Planck representations</strong><br>
  <a href="gradflow-fokker-planck-three-representations.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-fokker-planck-three-representations.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="gradflow-density-constrained-flow.ipynb"><img src="thumbnails/gradflow-density-constrained-flow.png" alt="Density-constrained gradient flow" width="210"></a><br>
  <strong>Density-constrained gradient flow</strong><br>
  <a href="gradflow-density-constrained-flow.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-density-constrained-flow.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="gradflow-multispecies-entropy-flow.ipynb"><img src="thumbnails/gradflow-multispecies-entropy-flow.png" alt="Multi-species entropy flow" width="210"></a><br>
  <strong>Multi-species entropy flow</strong><br>
  <a href="gradflow-multispecies-entropy-flow.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-multispecies-entropy-flow.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="gradflow-wfr-unbalanced-flow.ipynb"><img src="thumbnails/gradflow-wfr-unbalanced-flow.png" alt="Balanced and unbalanced WFR gradient flows" width="210"></a><br>
  <strong>Balanced and unbalanced WFR gradient flows</strong><br>
  <a href="gradflow-wfr-unbalanced-flow.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-wfr-unbalanced-flow.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="gradflow-mlp-homogeneous-relu.ipynb"><img src="thumbnails/gradflow-mlp-homogeneous-relu.png" alt="Homogeneous ReLU mean-field flow" width="210"></a><br>
  <strong>Homogeneous ReLU mean-field flow</strong><br>
  <a href="gradflow-mlp-homogeneous-relu.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-mlp-homogeneous-relu.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="gradflow-brunn-minkowski-ot.ipynb"><img src="thumbnails/gradflow-brunn-minkowski-ot.png" alt="Brunn-Minkowski through affine OT" width="210"></a><br>
  <strong>Brunn-Minkowski through affine OT</strong><br>
  <a href="gradflow-brunn-minkowski-ot.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-brunn-minkowski-ot.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="gradflow-hwi-entropy-decay.ipynb"><img src="thumbnails/gradflow-hwi-entropy-decay.png" alt="HWI and entropy decay" width="210"></a><br>
  <strong>HWI and entropy decay</strong><br>
  <a href="gradflow-hwi-entropy-decay.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-hwi-entropy-decay.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="gradflow-second-order-momentum-mmd.ipynb"><img src="thumbnails/gradflow-second-order-momentum-mmd.png" alt="First-order and Newton MMD particle flows" width="210"></a><br>
  <strong>First-order and Newton MMD particle flows</strong><br>
  <a href="gradflow-second-order-momentum-mmd.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-second-order-momentum-mmd.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="gradflow-second-order-momentum-entropy.ipynb"><img src="thumbnails/gradflow-second-order-momentum-entropy.png" alt="Finite-difference inertial entropy flow" width="210"></a><br>
  <strong>Finite-difference inertial entropy flow</strong><br>
  <a href="gradflow-second-order-momentum-entropy.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-second-order-momentum-entropy.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="gradflow-mlp-w2-vs-muon.ipynb"><img src="thumbnails/gradflow-mlp-w2-vs-muon.png" alt="W2 versus Muon ReLU mean-field flow" width="210"></a><br>
  <strong>W2 versus Muon ReLU mean-field flow</strong><br>
  <a href="gradflow-mlp-w2-vs-muon.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-mlp-w2-vs-muon.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

## Generative Models via Transportation

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="generative-flow-matching-interpolants.ipynb"><img src="thumbnails/generative-flow-matching-interpolants.png" alt="Flow matching: stochastic interpolants" width="210"></a><br>
  <strong>Flow matching: stochastic interpolants</strong><br>
  <a href="generative-flow-matching-interpolants.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/generative-flow-matching-interpolants.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="generative-diffusion-1d-forward-backward.ipynb"><img src="thumbnails/generative-diffusion-1d-forward-backward.png" alt="One-dimensional diffusion bridge" width="210"></a><br>
  <strong>One-dimensional diffusion bridge</strong><br>
  <a href="generative-diffusion-1d-forward-backward.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/generative-diffusion-1d-forward-backward.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="generative-diffusion-2d-forward-backward.ipynb"><img src="thumbnails/generative-diffusion-2d-forward-backward.png" alt="Two-dimensional diffusion bridge" width="210"></a><br>
  <strong>Two-dimensional diffusion bridge</strong><br>
  <a href="generative-diffusion-2d-forward-backward.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/generative-diffusion-2d-forward-backward.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="generative-diffusion-versus-ot-2d.ipynb"><img src="thumbnails/generative-diffusion-versus-ot-2d.png" alt="Diffusion trajectories versus OT rays" width="210"></a><br>
  <strong>Diffusion trajectories versus OT rays</strong><br>
  <a href="generative-diffusion-versus-ot-2d.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/generative-diffusion-versus-ot-2d.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="generative-diffusion-versus-ot-2d.ipynb"><img src="thumbnails/generative-diffusion-schedule-comparison.png" alt="Diffusion schedule comparison" width="210"></a><br>
  <strong>Diffusion schedule comparison</strong><br>
  <a href="generative-diffusion-versus-ot-2d.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/generative-diffusion-versus-ot-2d.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="generative-drifting-model-trajectories.ipynb"><img src="thumbnails/generative-drifting-model-trajectories.png" alt="Drifting fields for a small particle generator" width="210"></a><br>
  <strong>Drifting fields for a small particle generator</strong><br>
  <a href="generative-drifting-model-trajectories.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/generative-drifting-model-trajectories.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

<table>
<tr>

<td width="33%" align="center" valign="top">
  <a href="moment-measure-forward-map.ipynb"><img src="thumbnails/moment-measure-forward-map.png" alt="Forward moment-measure construction" width="210"></a><br>
  <strong>Forward moment-measure construction</strong><br>
  <a href="moment-measure-forward-map.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/moment-measure-forward-map.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="generative-mean-shift-pde.ipynb"><img src="thumbnails/generative-mean-shift-pde.png" alt="Mean-shift PDE for Gaussian-kernel attention" width="210"></a><br>
  <strong>Mean-shift PDE for Gaussian-kernel attention</strong><br>
  <a href="generative-mean-shift-pde.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/generative-mean-shift-pde.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

<td width="33%" align="center" valign="top">
  <a href="gradflow-gaussian-closure.ipynb"><img src="thumbnails/gradflow-gaussian-closure.png" alt="Gaussian closure of a Wasserstein flow" width="210"></a><br>
  <strong>Gaussian closure of a Wasserstein flow</strong><br>
  <a href="gradflow-gaussian-closure.ipynb">Open notebook</a> &middot; <a href="https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks-figures/gradflow-gaussian-closure.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></a>
</td>

</tr>
</table>

## Roadmap and Archive

Archived or exploratory notebooks are intentionally omitted from this gallery.
See [`figures.md`](figures.md) for the figure roadmap and
[`removed/`](removed/) for retired notebooks.
