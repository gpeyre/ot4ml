<h1 align="center">OT4ML - Optimal Transport for Machine Learners</h1>

This repository contains materials for a course on Optimal Transport for Machine Learning.

## Repository Layout

- `latex/`: draft book source.
- `notebooks/`: example notebooks for the course.
- `notebooks-figures/`: executable notebooks that generate the book figures.
- `latex/figures/`: generated PDF panels included by the LaTeX source.

## Book Figures

The illustrative figures are generated from one notebook per concept. Browse the
complete visual gallery in
[`notebooks-figures/README.md`](notebooks-figures/README.md): each card contains
a compact preview, a link to the local notebook, and an Open in Colab badge.

The notebooks write their PDF panels to `latex/figures/<figure-name>/`, where
they are included by the book source.

## Notebook Resources

The course notebooks are available below with a visual preview for each:

|  |  |
| --- | --- |
| **[1. Optimal Transport with Linear Programming](notebooks/1-linprog.ipynb)**<br>[![1-linprog preview](notebooks/figures/notebook-previews/1-linprog.png)](notebooks/1-linprog.ipynb)<br>[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks/1-linprog.ipynb) | **[2. Entropic Regularization of Optimal Transport](notebooks/2-sinkhorn.ipynb)**<br>[![2-sinkhorn preview](notebooks/figures/notebook-previews/2-sinkhorn.png)](notebooks/2-sinkhorn.ipynb)<br>[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks/2-sinkhorn.ipynb) |
| **[3. Advanced Topics on Sinkhorn Algorithms](notebooks/3-sinkhorn-advanced.ipynb)**<br>[![3-sinkhorn-advanced preview](notebooks/figures/notebook-previews/3-sinkhorn-advanced.png)](notebooks/3-sinkhorn-advanced.ipynb)<br>[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks/3-sinkhorn-advanced.ipynb) | **[4. Semi-discrete Optimal Transport](notebooks/4-semidiscrete.ipynb)**<br>[![4-semidiscrete preview](notebooks/figures/notebook-previews/4-semidiscrete.png)](notebooks/4-semidiscrete.ipynb)<br>[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks/4-semidiscrete.ipynb) |
| **[5. Unbalanced Optimal Transport](notebooks/5-unbalanced.ipynb)**<br>[![5-unbalanced preview](notebooks/figures/notebook-previews/5-unbalanced.png)](notebooks/5-unbalanced.ipynb)<br>[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks/5-unbalanced.ipynb) | **[6. Diffusion Models and Optimal Transport](notebooks/6-diffusion.ipynb)**<br>[![6-diffusion preview](notebooks/figures/notebook-previews/6-diffusion.png)](notebooks/6-diffusion.ipynb)<br>[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks/6-diffusion.ipynb) |
| **[7. Wasserstein Gradient Flows of Interaction Functionals](notebooks/7-wasserstein-flows.ipynb)**<br>[![7-wasserstein-flows preview](notebooks/figures/notebook-previews/7-wasserstein-flows.png)](notebooks/7-wasserstein-flows.ipynb)<br>[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks/7-wasserstein-flows.ipynb) | **[8. Discrete Diffusion](notebooks/8-discrete_diffusion.ipynb)**<br>[![8-discrete_diffusion preview](notebooks/figures/notebook-previews/8-discrete_diffusion.png)](notebooks/8-discrete_diffusion.ipynb)<br>[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/gpeyre/ot4ml/blob/main/notebooks/8-discrete_diffusion.ipynb) |

You can run notebooks locally or directly in Google Colab using the badge.

## Slides for the Course

- [Monge and Kantorovich](https://speakerdeck.com/gpeyre/computational-ot-number-1-monge-and-kantorovitch)
- [Entropic Regularization](https://speakerdeck.com/gpeyre/computational-ot-number-2-entropic-regularization)
- [Dual and Semidiscrete](https://speakerdeck.com/gpeyre/computational-ot-number-1-dual-and-semidiscrete)
- [Gradient Flow and Diffusion Models](https://speakerdeck.com/gpeyre/computational-ot-number-4-gradient-flow-and-diffusion-models)

## Lecture Notes

The lecture notes [*Optimal Transport for Machine Learners* can be found at this link.](https://arxiv.org/abs/2505.06589).

## Other Resources

### Bibliography

- [*Computational Optimal Transport*](https://optimaltransport.github.io/), Gabriel Peyré & Marco Cuturi, 2018.
- [*Optimal Transport for Applied Mathematicians*](https://www.math.u-psud.fr/~filippo/OTAM-cvgmt.pdf), Filippo Santambrogio, Springer, 2016.
- [*Statistical Optimal Transport*](https://arxiv.org/abs/2407.18163), Sinho Chewi, Jonathan Niles-Weed, Philippe Rigollet, 2024.

### Code

- [Python Optimal Transport (POT)](https://pythonot.github.io/)
- [Optimal Transport Tools (OTT) in JAX](https://ott-jax.readthedocs.io/en/latest/)
- [GeomLoss](https://www.kernel-operations.io/geomloss/)
