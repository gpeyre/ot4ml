# Gaussian KL-UOT and soft Procrustes

This directory contains a self-contained study of Procrustes-type formulas for
quadratic unbalanced optimal transport with KL penalties on the marginals and
no entropy penalty on the coupling.

The main conclusion is exact: after separating transported mass, the Gaussian
covariance problem is a soft Procrustes problem. Classical Bures transport
imposes hard Gram constraints on covariance factors; KL-unbalanced transport
replaces those constraints by LogDet penalties. The note also:

- gives the full formula including means and unequal masses;
- reduces the soft alignment to two positive stretches and one ordinary
  orthogonal Procrustes step;
- connects the factor formulation to the known Riccati closed form;
- treats unequal KL penalties;
- recovers Bures--Procrustes in the large-penalty limit; and
- distinguishes convexity of the adjusted-covariance problem from the failure
  of joint convexity in the prescribed covariance parameters.

The main file is `kl_uot_bures_procrustes.tex`.

Build with:

```bash
pdflatex kl_uot_bures_procrustes.tex
bibtex kl_uot_bures_procrustes
pdflatex kl_uot_bures_procrustes.tex
pdflatex kl_uot_bures_procrustes.tex
```
