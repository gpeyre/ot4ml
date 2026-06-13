---
title: "Notation Table"
---

This appendix collects the main notation used throughout the book. The last column points to the first section, equation, definition, proposition or theorem where the notation is defined or first used in a mathematically meaningful way.

## Ambient spaces, measures and elementary objects

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\RR^d$ | Euclidean ambient space. | Section sec-measures |
| $\X,\Y$ | Source and target spaces. | Eq. eq-monge-continuous |
| $\Mm(\X)$ | Finite signed Radon measures on $\X$. | Section sec-measures |
| $\Mm_+(\X),\Mm_+^1(\X)$ | Positive finite measures and probability measures. | Section sec-measures |
| $\Pp(\X),\Pp_p(\X)$ | Probability measures, with finite $p$-moment for $\Pp_p$. | Section sec-kantorovich-continuous |
| $\simplex_n$ | Probability simplex of histograms of length $n$. | Definition def-probability-simplex |
| $\de_x$ | Dirac mass at $x$. | Definition def-discrete-measure |
| $\al,\be,\ga$ | Source, target and auxiliary probability measures. | Eq. eq-monge-continuous |
| $\density{\al}$ | Density of $\al$ with respect to a reference measure. | Definition def-relative-density |
| $\d\al,\d x$ | Integration against $\al$ and against Lebesgue measure. | Section sec-measures |
| $\EE$ | Expectation of a random variable. | Section sec-measures |
| $\supp(\pi)$ | Topological support of a measure. | Definition def:support |
| $\Supp(\b)$ | Index support of a histogram. | Eq. eq-discr-diverg |
| $\Cc(\X)$ | Continuous real-valued functions on $\X$. | Section sec-measures |
| $\norm{\cdot}$ | Euclidean norm or the norm indicated by a subscript. | Chapter sec-matching |
| $\dotp{\cdot}{\cdot}$ | Euclidean/Frobenius pairing or measure-function pairing. | Section sec-measures |

## Discrete matching and discrete Kantorovich OT

| Notation | Meaning | First reference |
| --- | --- | --- |
| $(x_i)_i,(y_j)_j$ | Source and target point clouds. | Eq. eq-optimal-assignment |
| $\C=(\C_{i,j})$ | Cost matrix between source and target points. | Eq. eq-optimal-assignment |
| $\sigma\in\Perm(n)$ | Permutation encoding a one-to-one matching. | Eq. eq-optimal-assignment |
| $P_\sigma,\mathcal P_n^{\mathrm{perm}}$ | Permutation matrix and the set of all such matrices. | Definition def-permutation-matrices |
| $\mathcal B_n$ | Birkhoff polytope of bistochastic matrices. | Definition def-birkhoff-polytope |
| $\a,\b$ | Discrete probability histograms. | Eq. eq-discr-couplings |
| $\P$ | Discrete transport/coupling matrix. | Eq. eq-discr-couplings |
| $\CouplingsD(\a,\b)$ | Polytope of discrete couplings with marginals $\a,\b$. | Eq. eq-discr-couplings |
| $\ones_n,\transp{\P}$ | All-ones vector and transpose of $\P$. | Eq. eq-discr-couplings |
| $\MKD_\C(\a,\b)$ | Discrete Kantorovich optimal value with cost $\C$. | Eq. eq-kanto-discr |
| $\distD$ | Ground distance matrix for discrete Wasserstein distances. | Definition def-discrete-wasserstein-distance |
| $\WassD_p(\a,\b)$ | Discrete $p$-Wasserstein distance. | Definition def-discrete-wasserstein-distance |

## Monge maps, one-dimensional OT and Gaussians

| Notation | Meaning | First reference |
| --- | --- | --- |
| $T,\T$ | Transport map. | Eq. eq-monge-continuous |
| $T_\sharp\al$ | Push-forward of $\al$ by $T$. | Definition defn-pushfwd |
| $T^\sharp g$ | Pullback of a test function, $T^\sharp g=g\circ T$. | Remark rem-pullback-pushforward |
| $\Id$ | Identity map. | Definition defn-pushfwd |
| $\tilde\Wass_p$ | Directed Monge transport distance. | Eq. eq-monge-distance |
| $\nabla\phi$ | Brenier map for quadratic cost. | Theorem thm-brenier |
| $\cumul{\al}$ | Cumulative distribution function of a 1-D measure. | Eq. eq-cumul-defn |
| $\cumul{\al}^{-1}$ | Quantile function of a 1-D measure. | Eq. eq-OT-map-1d |
| $\Gaussian(\mean,\cov)$ | Gaussian law with mean $\mean$ and covariance $\cov$. | Eq. eq-gauss-pf |
| $\mean_\al,\cov_\al$ | Mean and covariance of a Gaussian measure $\al$. | Eq. eq-dist-gauss |
| $\Bb(\cov_\al,\cov_\be)$ | Bures covariance distance. | Definition def-bures-metric |
| $\tr(\cov)$ | Trace of a matrix. | Eq. eq-dist-gauss |

## Continuous Kantorovich OT and Wasserstein distances

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\pi$ | Coupling or transport plan. | Definition def-continuous-couplings |
| $\Couplings(\al,\be)$ | Set of couplings between $\al$ and $\be$. | Eq. eq-coupling-generic |
| $\MK_\c(\al,\be)$ | Kantorovich optimal value with ground cost $\c$. | Eq. eq-mk-generic |
| $\dist$ | Ground distance on the underlying metric space. | Eq. eq-defn-wass-dist |
| $\Wass_p(\al,\be)$ | $p$-Wasserstein distance. | Definition def-wasserstein-distance |
| $\Wass_\infty(\al,\be)$ | Worst-displacement Wasserstein distance. | Eq. eq-wass-infty |
| $\mathfrak A,\mathfrak B$ | Probability laws over probability measures. | Eq. eq-wow-parametric-law |
| $\bar\alpha_{\mathfrak A}$ | Collapsed mixture associated with a law over measures. | Definition def-collapsed-barycentric-mixture |
| $\mathbb W_2$ | Wasserstein distance on the Wasserstein space. | Eq. eq-wow-distance |
| $\Gamma$ | $c$-cyclically monotone subset of $\X\times\Y$. | Definition def:ccm |
| $\rho$ | Glued or composed coupling. | Lemma lem-gluing-general |
| $\rightharpoonup$ | Weak$^*$ convergence of measures. | Definition dfn-weak-conv |
| $\TV,\norm{\cdot}_{\TV}$ | Total variation divergence/norm. | Section sec-measures |

## Duality, transforms and weak norms

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\fD,\gD$ | Discrete dual potentials. | Eq. eq-dual |
| $\f,\g$ | Continuous dual potentials. | Eq. eq-dual-generic |
| $\PotentialsD(\a,\b)$ | Feasible set of discrete dual potentials. | Eq. eq-feasible-potential |
| $\Potentials(\c)$ | Feasible set of continuous dual potentials. | Eq. eq-dfn-pot-dual |
| $f^c,g^c$ | $c$-transform of a potential. | Definition def-c-transform |
| $\Laguerre_j(\gD)$ | Laguerre/power cell in semi-discrete OT. | Eq. eq-laguerre-cells |
| $\Qq_m(\al)$ | Optimal $m$-point quantization error. | Eq. eq-optimal-quantization |
| $\Lip(f)$ | Lipschitz constant of $f$. | Eq. eq-lip-constant |
| $\Wass_1$ | Kantorovich--Rubinstein distance/norm. | Eq. eq-w1-metric |
| $\Wass_{1,G}$ | Graph Wasserstein-1/transshipment distance. | Proposition prop-graph-w1-beckmann |
| $d_G,\nabla_G,\operatorname{div}_G$ | Graph geodesic distance, gradient and divergence. | Proposition prop-graph-w1-beckmann |
| $\norm{\cdot}_B$ | Dual norm induced by a discriminator class $B$. | Eq. eq-dual-norm-cont |
| $\RKHS,\Krkhs$ | Reproducing kernel Hilbert space and its kernel. | Definition def-kernel-mmd-norm |
| $\MMD_k$ | Maximum mean discrepancy/kernel norm for $k$. | Definition def-kernel-mmd-norm |
| $\Divergm_\phi,\DivergmD_\phi$ | Continuous and discrete $\phi$-divergences. | Eq. eq-phi-div |
| $\phi'_\infty$ | Recession slope of an entropy function. | Definition def_entropy |
| $\phi^\star$ | Legendre transform of $\phi$. | Eq. eq-legendre |
| $\KL,\KLD$ | Continuous and discrete Kullback--Leibler divergences. | Definitions def-discrete-relative-entropy, def-measure-relative-entropy |
| $\Hellinger$ | Hellinger divergence/distance. | Section sec-phi-div |
| $\JS$ | Jensen--Shannon divergence. | Section sec-phi-div |

## Entropic regularization and Sinkhorn algorithms

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\epsilon$ | Entropic regularization strength. | Eq. eq-regularized-discr |
| $\HD(\P)$ | Shannon--Boltzmann entropy of a matrix. | Definition def-discrete-shannon-boltzmann-entropy |
| $\MKD_\C^\epsilon(\a,\b)$ | Discrete entropic OT value. | Eq. eq-regularized-discr |
| $\MK_\c^\epsilon(\al,\be)$ | Continuous entropic OT value. | Eq. eq-entropic-generic |
| $\K$ | Gibbs kernel $e^{-\C/\epsilon}$. | Eq. eq-scaling-form |
| $\uD,\vD$ | Left and right Sinkhorn scalings. | Eq. eq-scaling-form |
| $\diag(\uD)\K\diag(\vD)$ | Scaling form of the entropic coupling. | Eq. eq-sink-matrix |
| $\odot$ | Entrywise product of vectors. | Eq. eq-dualsinkhorn-constraints2 |
| $\it{\uD},\itt{\uD}$ | Current and next Sinkhorn iterates. | Eq. eq-sinkhorn |
| $\Hilbert$ | Hilbert projective metric on positive vectors. | Definition def-hilbert-metric |
| $\Proj^\KLD$ | KL/Bregman projection. | Eq. eq-kl-proj |
| $\bar\MK_\c^\epsilon(\al,\be)$ | Debiased Sinkhorn divergence. | Eq. eq-sinkhorn-divergence |

## Extensions of OT

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\psi_1,\psi_2$ | Entropy functions penalizing marginal mismatch. | Eq. eq-unbalanced-primal |
| $\UW_c,\UW_{c,\tau}$ | Relaxed unbalanced OT value with marginal penalties. | Eq. eq-unbalanced-primal |
| $L_c$ | Reverse-formulation local unbalanced cost. | Eq. eq-unbalanced-reverse-local-cost |
| $H_c$ | Homogeneous perspective of the local cost $L_c$. | Eq. eq-unbalanced-homogeneous-local-cost |
| $\HW$ | Homogeneous unbalanced formulation. | Eq. eq-homogeneous |
| $\mathfrak{C}[\X]$ | Cone over the metric space $\X$. | Section sec-unbalanced |
| $\CW,\CW_\kappa$ | Cone formulation of unbalanced OT, with $\CW_\kappa$ using growth scale $\kappa$. | Theorem thm-cone-unbalanced-ot, Eq. eq-dynamic-unbalanced-ot |
| $\mathcal A_\kappa$ | Dynamic unbalanced perspective action for transport and growth. | Eq. eq-dynamic-unbalanced-ot |
| $\WFR_\kappa$ | Wasserstein--Fisher--Rao dynamic distance with growth scale $\kappa$. | Eq. eq-dynamic-unbalanced-ot |
| $\be_s,\la_s$ | Input measures and weights in barycenter problems. | Eq. eq-barycenter-generic |
| $\al^\star$ | Optimal measure, often a barycenter. | Section sec-barycenters |
| $\SW_p$ | Sliced Wasserstein distance. | Definition def-sliced-wasserstein |
| $\Sphere^{d-1}$ | Unit sphere of projection directions. | Definition def-sliced-wasserstein |
| $P_\theta$ | Projection on direction $\theta$. | Definition def-sliced-wasserstein |
| $\MaxSW_p$ | Max-sliced Wasserstein distance. | Definition def-sliced-variants |
| $\operatorname{MSWGG}_2$ | Min-sliced lifted-plan upper bound on $\Wass_2$. | Section sec-sliced-wasserstein |
| $\SW_{p,k},\MaxSW_{p,k}$ | Average and max Wasserstein distances over $k$-dimensional projections. | Definition def-subspace-sliced-wasserstein |
| $\Wass_\gamma$ | Spectral Wasserstein distance associated with a matrix gauge $\gamma$. | Eq. eq-spectral-wasserstein |
| $\mathcal B_\gamma$ | Polar set defining the robust projected form of $\Wass_\gamma$. | Eq. eq-spectral-polar-set |
| $\Wass_{2,A}$ | Quadratic Wasserstein pseudodistance after projection by $A^{1/2}$. | Eq. eq-quadratic-projected-cost |
| $\SRW_{2,k}$ | Paty--Cuturi subspace robust Wasserstein distance. | Section sec-spectral-subspace-wasserstein |
| $\LOT_\rho$ | Linear OT distance around reference $\rho$. | Eq. eq-lot-embedding |
| $\bar T_\pi$ | Barycentric projection of a coupling $\pi$. | Eq. eq-barycentric-projection |
| $\bar\beta_\pi$ | Pushforward of $\alpha$ by the barycentric projection. | Eq. eq-barycentric-projection |
| $\WOT_C$ | Weak OT value with conditional-law cost $C$. | Eq. eq-weak-ot |
| $g^C$ | Weak $C$-transform in weak OT duality. | Proposition prop-weak-ot-duality |
| $u_t,V_t$ | Positive vector-valued density and spatial flux. | Eqs. eq-vector-valued-bb, eq-vector-valued-continuity |
| $\mathcal W_{\Phi}$ | Dynamic vector-valued BB-type cost. | Eq. eq-vector-valued-bb |
| $\distD,\distD'$ | Intra-domain distance matrices in discrete GW. | Eq. eq-gw-def |
| $\De$ | Discrepancy between intra-domain distances. | Eq. eq-gw-def |
| $\GWD$ | Discrete Gromov--Wasserstein cost. | Eq. eq-gw-def |
| $\XX,\YY$ | Metric-measure spaces. | Definition def-metric-measure-space |
| $\GW$ | Continuous Gromov--Wasserstein distance. | Eq. eq-gw-generic |
| $d_{\mathrm H},d_{\mathrm{GH}}$ | Hausdorff and Gromov--Hausdorff distances. | Section sec-gromov-wasserstein |
| $\operatorname{FGW}_{\lambda,p}$ | Fused Gromov--Wasserstein distance. | Section sec-gromov-wasserstein |
| $\mathbb S^m,\mathbb S_+^m$ | Real symmetric matrices and their positive semidefinite cone. | Definition def-positive-matrix-valued-measure |
| $A_t,P_t$ | Positive matrix-valued density and spatial matrix flux. | Eqs. eq-matrix-valued-bb, eq-matrix-valued-continuity |
| $\mathcal W_{\mathrm{mat}}$ | Conservative matrix-valued BB-type cost. | Eq. eq-matrix-valued-bb |
| $\mathbb H_n,\mathbb H_n^+,\mathbb H_n^{+,1}$ | Hermitian matrices, positive semidefinite Hermitian matrices and density matrices. | Definition def-hermitian-density-matrices |
| $\operatorname{Tr}_A,\operatorname{Tr}_B$ | Partial traces of a bipartite matrix. | Eq. eq-qot-partial-traces |
| $\mathrm{QOT}_C(A,B)$ | Finite-dimensional quantum OT value with cost observable $C$. | Eq. eq-qot-primal |
| $\mathrm{QOT}_C^\epsilon(A,B)$ | Entropically regularized quantum OT value. | Eq. eq-qot-entropic-primal |
| $T_e(F,G),T_s(F,G)$ | Exact Gibbs coupling and symmetric Gurvits-scaling surrogate. | Eqs. eq-qot-gibbs-coupling, eq-qot-symmetric-scaling |

## Dynamic OT and Wasserstein gradient flows

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\alpha_t$ | Time-dependent curve of probability measures. | Eq. eq:eulerian-advection |
| $v_t$ | Eulerian velocity field transporting $\alpha_t$. | Eq. eq:eulerian-advection |
| $T_t$ | Lagrangian particle flow map. | Eq. eq:lagrangian-advection |
| $P_t$ | Interpolant map in flow matching; later also path evaluation. | Eq. eq:interp-coupling |
| $\Wass_2^2$ via action | Benamou--Brenier dynamic formulation. | Eq. eq:benamou-brenier |
| $\Wgrad f(\alpha)$ | Wasserstein gradient of a functional. | Proposition prop-formal-wass-gradient |
| $\delta f(\alpha)$ | First variation of $f$ at $\alpha$. | Proposition prop-formal-wass-gradient |
| $\partial_t\alpha+\diverg(\alpha v)=0$ | Continuity equation. | Eq. eq:eulerian-advection |
| $\alpha_{t+\tau}$ | One JKO/minimizing-movement step. | Eq. eq:jko-discr |
| $\Ss=C([0,1];\RR^d)$ | Path space in the superposition formulation. | Chapter sec-wasserstein-flows |
