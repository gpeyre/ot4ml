---
title: "Notation Table"
---

This appendix collects the main notation used throughout the book. The last column points to the first section, equation, definition, proposition or theorem where the notation is defined or first used in a mathematically meaningful way.

## Ambient spaces, measures and elementary objects

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\RR^d$ | Euclidean ambient space. | [Section sec-measures](monge#measures) |
| $\X,\Y$ | Source and target spaces. | [Eq. eq-monge-continuous](monge#eq-monge-continuous-web) |
| $\Mm(\X)$ | Finite signed Radon measures on $\X$. | [Section sec-measures](monge#measures) |
| $\Mm_+(\X),\Mm_+^1(\X)$ | Positive finite measures and probability measures. | [Section sec-measures](monge#measures) |
| $\Pp(\X),\Pp_p(\X)$ | Probability measures, with finite $p$-moment for $\Pp_p$. | [Section sec-kantorovich-continuous](kantorovich#relaxation-for-arbitrary-measures) |
| $\simplex_n$ | Probability simplex of histograms of length $n$. | [Definition def-probability-simplex](monge#def-probability-simplex) |
| $\de_x$ | Dirac mass at $x$. | [Definition def-discrete-measure](monge#def-discrete-measure) |
| $\al,\be,\ga$ | Source, target and auxiliary probability measures. | [Eq. eq-monge-continuous](monge#eq-monge-continuous-web) |
| $\density{\al}$ | Density of $\al$ with respect to a reference measure. | [Definition def-relative-density](monge#def-relative-density) |
| $\d\al,\d x$ | Integration against $\al$ and against Lebesgue measure. | [Section sec-measures](monge#measures) |
| $\EE$ | Expectation of a random variable. | [Section sec-measures](monge#measures) |
| $\supp(\pi)$ | Topological support of a measure. | [Definition def:support](monge#general-measures) |
| $\Supp(\b)$ | Index support of a histogram. | [Eq. eq-discr-diverg](monge#total-variation) |
| $\Cc(\X)$ | Continuous real-valued functions on $\X$. | [Section sec-measures](monge#measures) |
| $\norm{\cdot}$ | Euclidean norm or the norm indicated by a subscript. | [Chapter sec-matching](matching) |
| $\dotp{\cdot}{\cdot}$ | Euclidean/Frobenius pairing or measure-function pairing. | [Section sec-measures](monge#measures) |

## Discrete matching and discrete Kantorovich OT

| Notation | Meaning | First reference |
| --- | --- | --- |
| $(x_i)_i,(y_j)_j$ | Source and target point clouds. | [Eq. eq-optimal-assignment](matching#eq-optimal-assignment-web) |
| $\C=(\C_{i,j})$ | Cost matrix between source and target points. | [Eq. eq-optimal-assignment](matching#eq-optimal-assignment-web) |
| $\sigma\in\Perm(n)$ | Permutation encoding a one-to-one matching. | [Eq. eq-optimal-assignment](matching#eq-optimal-assignment-web) |
| $P_\sigma,\mathcal P_n^{\mathrm{perm}}$ | Permutation matrix and the set of all such matrices. | [Definition def-permutation-matrices](kantorovich#def-permutation-matrices) |
| $\mathcal B_n$ | Birkhoff polytope of bistochastic matrices. | [Definition def-birkhoff-polytope](kantorovich#def-birkhoff-polytope) |
| $\a,\b$ | Discrete probability histograms. | [Eq. eq-discr-couplings](kantorovich#eq-discr-couplings-web) |
| $\P$ | Discrete transport/coupling matrix. | [Eq. eq-discr-couplings](kantorovich#eq-discr-couplings-web) |
| $\CouplingsD(\a,\b)$ | Polytope of discrete couplings with marginals $\a,\b$. | [Eq. eq-discr-couplings](kantorovich#eq-discr-couplings-web) |
| $\ones_n,\transp{\P}$ | All-ones vector and transpose of $\P$. | [Eq. eq-discr-couplings](kantorovich#eq-discr-couplings-web) |
| $\MKD_\C(\a,\b)$ | Discrete Kantorovich optimal value with cost $\C$. | [Eq. eq-kanto-discr](kantorovich#eq-kanto-discr-web) |
| $\distD$ | Ground distance matrix for discrete Wasserstein distances. | [Definition def-discrete-wasserstein-distance](kantorovich#def-discrete-wasserstein-distance) |
| $\WassD_p(\a,\b)$ | Discrete $p$-Wasserstein distance. | [Definition def-discrete-wasserstein-distance](kantorovich#def-discrete-wasserstein-distance) |

## Monge maps, one-dimensional OT and Gaussians

| Notation | Meaning | First reference |
| --- | --- | --- |
| $T,\T$ | Transport map. | [Eq. eq-monge-continuous](monge#eq-monge-continuous-web) |
| $T_\sharp\al$ | Push-forward of $\al$ by $T$. | [Definition defn-pushfwd](monge#push-forward) |
| $T^\sharp g$ | Pullback of a test function, $T^\sharp g=g\circ T$. | [Remark rem-pullback-pushforward](monge#push-forward) |
| $\Id$ | Identity map. | [Definition defn-pushfwd](monge#push-forward) |
| $\tilde\Wass_p$ | Directed Monge transport distance. | [Eq. eq-monge-distance](monge#eq-monge-distance-web) |
| $\nabla\phi$ | Brenier map for quadratic cost. | [Theorem thm-brenier](monge#breniers-theorem) |
| $\cumul{\al}$ | Cumulative distribution function of a 1-D measure. | [Eq. eq-cumul-defn](monge#eq-cumul-defn-web) |
| $\cumul{\al}^{-1}$ | Quantile function of a 1-D measure. | [Eq. eq-OT-map-1d](monge#eq-ot-map-1d-web) |
| $\Gaussian(\mean,\cov)$ | Gaussian law with mean $\mean$ and covariance $\cov$. | [Eq. eq-gauss-pf](monge#eq-gauss-pf-web) |
| $\mean_\al,\cov_\al$ | Mean and covariance of a Gaussian measure $\al$. | [Eq. eq-dist-gauss](monge#eq-dist-gauss-web) |
| $\Bb(\cov_\al,\cov_\be)$ | Bures covariance distance. | [Definition def-bures-metric](monge#def-bures-metric) |
| $\Phi_2(\mu)$ | Raw second-moment matrix of a probability measure. | [Lifted Bures metric](monge#prop-bures-second-moment-lift) |
| $D_{\Phi_2}$ | Lifted second-moment distance, equal to the Bures metric. | [Lifted Bures metric](monge#prop-bures-second-moment-lift) |
| $\tr(\cov)$ | Trace of a matrix. | [Eq. eq-dist-gauss](monge#eq-dist-gauss-web) |

## Continuous Kantorovich OT and Wasserstein distances

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\pi$ | Coupling or transport plan. | [Definition def-continuous-couplings](kantorovich#continuous-couplings) |
| $\Couplings(\al,\be)$ | Set of couplings between $\al$ and $\be$. | [Eq. eq-coupling-generic](kantorovich#eq-coupling-generic) |
| $\MK_\c(\al,\be)$ | Kantorovich optimal value with ground cost $\c$. | [Eq. eq-mk-generic](kantorovich#eq-mk-generic) |
| $\dist$ | Ground distance on the underlying metric space. | [Eq. eq-defn-wass-dist](kantorovich#eq-defn-wass-dist) |
| $\Wass_p(\al,\be)$ | $p$-Wasserstein distance. | [Definition def-wasserstein-distance](kantorovich#def-wasserstein-distance) |
| $\Wass_\infty(\al,\be)$ | Worst-displacement Wasserstein distance. | [Eq. eq-wass-infty](kantorovich#eq-wass-infty) |
| $\mathfrak A,\mathfrak B$ | Probability laws over probability measures. | [Eq. eq-wow-parametric-law](kantorovich#eq-wow-parametric-law) |
| $\bar\alpha_{\mathfrak A}$ | Collapsed mixture associated with a law over measures. | [Definition def-collapsed-barycentric-mixture](kantorovich#def-collapsed-barycentric-mixture) |
| $\mathbb W_2$ | Wasserstein distance on the Wasserstein space. | [Eq. eq-wow-distance](kantorovich#eq-wow-distance) |
| $\Gamma$ | $c$-cyclically monotone subset of $\X\times\Y$. | [Definition def:ccm](kantorovich#cyclical-monotonicity) |
| $\rho$ | Glued or composed coupling. | [Lemma lem-gluing-general](kantorovich#metric-properties-wasserstein-distances) |
| $\rightharpoonup$ | Weak$^*$ convergence of measures. | [Definition dfn-weak-conv](kantorovich#metric-properties-topology-and-applications) |
| $\TV,\norm{\cdot}_{\TV}$ | Total variation divergence/norm. | [Section sec-measures](monge#measures) |

## Duality, transforms and weak norms

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\fD,\gD$ | Discrete dual potentials. | [Eq. eq-dual](dual#eq-dual) |
| $\f,\g$ | Continuous dual potentials. | [Eq. eq-dual-generic](dual#eq-dual-generic) |
| $\PotentialsD(\a,\b)$ | Feasible set of discrete dual potentials. | [Eq. eq-feasible-potential](dual#eq-feasible-potential) |
| $\Potentials(\c)$ | Feasible set of continuous dual potentials. | [Eq. eq-dfn-pot-dual](dual#eq-dfn-pot-dual-web) |
| $f^c,g^c$ | $c$-transform of a potential. | [Definition def-c-transform](dual#c-transforms) |
| $\Laguerre_j(\gD)$ | Laguerre/power cell in semi-discrete OT. | [Eq. eq-laguerre-cells](semidiscrete-w1#eq-laguerre-cells-web) |
| $\Qq_m(\al)$ | Optimal $m$-point quantization error. | [Eq. eq-optimal-quantization](semidiscrete-w1#eq-optimal-quantization-web) |
| $\Lip(f)$ | Lipschitz constant of $f$. | [Eq. eq-lip-constant](semidiscrete-w1#eq-lip-constant) |
| $\Wass_1$ | Kantorovich--Rubinstein distance/norm. | [Eq. eq-w1-metric](semidiscrete-w1#eq-w1-metric-web) |
| $\Wass_{1,G}$ | Graph Wasserstein-1/transshipment distance. | [Proposition prop-graph-w1-beckmann](semidiscrete-w1#wasserstein-1-norm) |
| $d_G,\nabla_G,\operatorname{div}_G$ | Graph geodesic distance, gradient and divergence. | [Proposition prop-graph-w1-beckmann](semidiscrete-w1#wasserstein-1-norm) |
| $\norm{\cdot}_B$ | Dual norm induced by a discriminator class $B$. | [Eq. eq-dual-norm-cont](dual-norms#eq-dual-norm-cont-web) |
| $\RKHS,\Krkhs$ | Reproducing kernel Hilbert space and its kernel. | [Definition def-kernel-mmd-norm](dual-norms#dual-rkhs-norms-and-maximum-mean-discrepancies) |
| $\MMD_k$ | Maximum mean discrepancy/kernel norm for $k$. | [Definition def-kernel-mmd-norm](dual-norms#dual-rkhs-norms-and-maximum-mean-discrepancies) |
| $\Divergm_\phi,\DivergmD_\phi$ | Continuous and discrete $\phi$-divergences. | [Eq. eq-phi-div](dual-norms#eq-phi-div-web) |
| $\phi'_\infty$ | Recession slope of an entropy function. | [Definition def_entropy](dual-norms#definition-by-density-ratios) |
| $\phi^\star$ | Legendre transform of $\phi$. | [Eq. eq-legendre](dual-norms#definition-by-density-ratios) |
| $\KL,\KLD$ | Continuous and discrete Kullback--Leibler divergences. | [Definitions def-discrete-relative-entropy](sinkhorn#reformulation-using-relative-entropy), [def-measure-relative-entropy](sinkhorn#general-formulation) |
| $\Hellinger$ | Hellinger divergence/distance. | [Section sec-phi-div](dual-norms#phi-divergences) |
| $\JS$ | Jensen--Shannon divergence. | [Section sec-phi-div](dual-norms#phi-divergences) |

## Entropic regularization and Sinkhorn algorithms

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\epsilon$ | Entropic regularization strength. | [Eq. eq-regularized-discr](sinkhorn#eq-regularized-discrete-web) |
| $\HD(\P)$ | Shannon--Boltzmann entropy of a matrix. | [Definition def-discrete-shannon-boltzmann-entropy](sinkhorn#entropic-regularization-for-discrete-measures) |
| $\MKD_\C^\epsilon(\a,\b)$ | Discrete entropic OT value. | [Eq. eq-regularized-discr](sinkhorn#eq-regularized-discrete-web) |
| $\MK_\c^\epsilon(\al,\be)$ | Continuous entropic OT value. | [Eq. eq-entropic-generic](sinkhorn#eq-entropic-generic-web) |
| $\K$ | Gibbs kernel $e^{-\C/\epsilon}$. | [Eq. eq-scaling-form](sinkhorn#eq-scaling-form-web) |
| $\uD,\vD$ | Left and right Sinkhorn scalings. | [Eq. eq-scaling-form](sinkhorn#eq-scaling-form-web) |
| $\diag(\uD)\K\diag(\vD)$ | Scaling form of the entropic coupling. | [Eq. eq-sink-matrix](sinkhorn#eq-scaling-form-web) |
| $\odot$ | Entrywise product of vectors. | [Eq. eq-dualsinkhorn-constraints2](sinkhorn#eq-sinkhorn-constraints-web) |
| $\it{\uD},\itt{\uD}$ | Current and next Sinkhorn iterates. | [Eq. eq-sinkhorn](sinkhorn#eq-sinkhorn-web) |
| $\Hilbert$ | Hilbert projective metric on positive vectors. | [Definition def-hilbert-metric](sinkhorn-advanced#sinkhorn-convergence-linear-hilbert-metric-rate) |
| $\Proj^\KLD$ | KL/Bregman projection. | [Eq. eq-kl-proj](sinkhorn-advanced#alternating-kl-projections) |
| $\bar\MK_\c^\epsilon(\al,\be)$ | Debiased Sinkhorn divergence. | [Eq. eq-sinkhorn-divergence](sinkhorn#eq-sinkhorn-divergence-web) |

## Extensions of OT

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\psi_1,\psi_2$ | Entropy functions penalizing marginal mismatch. | [Eq. eq-unbalanced-primal](generalized-wasserstein#eq-unbalanced-primal) |
| $\UW_c,\UW_{c,\tau}$ | Relaxed unbalanced OT value with marginal penalties. | [Eq. eq-unbalanced-primal](generalized-wasserstein#eq-unbalanced-primal) |
| $L_c$ | Reverse-formulation local unbalanced cost. | [Eq. eq-unbalanced-reverse-local-cost](generalized-wasserstein#eq-unbalanced-reverse-local-cost) |
| $H_c$ | Homogeneous perspective of the local cost $L_c$. | [Eq. eq-unbalanced-homogeneous-local-cost](generalized-wasserstein#eq-unbalanced-homogeneous-local-cost) |
| $\HW$ | Homogeneous unbalanced formulation. | [Eq. eq-homogeneous](generalized-wasserstein#eq-homogeneous) |
| $\mathfrak{C}[\X]$ | Cone over the metric space $\X$. | [Section sec-unbalanced](generalized-wasserstein#unbalanced-ot) |
| $\CW,\CW_\kappa$ | Cone formulation of unbalanced OT, with $\CW_\kappa$ using growth scale $\kappa$. | [Theorem thm-cone-unbalanced-ot](generalized-wasserstein#conic-lifting), [Eq. eq-dynamic-unbalanced-ot](dynamic-ot#eq-dynamic-unbalanced-ot) |
| $\mathcal A_\kappa$ | Dynamic unbalanced perspective action for transport and growth. | [Eq. eq-dynamic-unbalanced-ot](dynamic-ot#eq-dynamic-unbalanced-ot) |
| $\WFR_\kappa$ | Wasserstein--Fisher--Rao dynamic distance with growth scale $\kappa$. | [Eq. eq-dynamic-unbalanced-ot](dynamic-ot#eq-dynamic-unbalanced-ot) |
| $\be_s,\la_s$ | Input measures and weights in barycenter problems. | [Eq. eq-barycenter-generic](generalized-ot-problems#eq-barycenter-generic) |
| $\al^\star$ | Optimal measure, often a barycenter. | [Section sec-barycenters](generalized-ot-problems#ot-barycenters) |
| $\SW_p$ | Sliced Wasserstein distance. | [Definition def-sliced-wasserstein](generalized-wasserstein#eq-sliced-wasserstein) |
| $\Sphere^{d-1}$ | Unit sphere of projection directions. | [Definition def-sliced-wasserstein](generalized-wasserstein#eq-sliced-wasserstein) |
| $P_\theta$ | Projection on direction $\theta$. | [Definition def-sliced-wasserstein](generalized-wasserstein#eq-sliced-wasserstein) |
| $\MaxSW_p$ | Max-sliced Wasserstein distance. | [Definition def-sliced-variants](generalized-wasserstein#sliced-wasserstein-distances) |
| $\operatorname{MSWGG}_2$ | Min-sliced lifted-plan upper bound on $\Wass_2$. | [Section sec-sliced-wasserstein](generalized-wasserstein#sliced-wasserstein-distances) |
| $\SW_{p,k},\MaxSW_{p,k}$ | Average and max Wasserstein distances over $k$-dimensional projections. | [Definition def-subspace-sliced-wasserstein](generalized-wasserstein#subspace-sliced-variants) |
| $\Wass_\gamma$ | Spectral Wasserstein distance associated with a matrix gauge $\gamma$. | [Eq. eq-spectral-wasserstein](generalized-wasserstein#eq-spectral-wasserstein) |
| $\mathcal B_\gamma$ | Polar set defining the robust projected form of $\Wass_\gamma$. | [Eq. eq-spectral-polar-set](generalized-wasserstein#eq-spectral-polar-set) |
| $\Wass_{2,A}$ | Quadratic Wasserstein pseudodistance after projection by $A^{1/2}$. | [Eq. eq-quadratic-projected-cost](generalized-wasserstein#eq-quadratic-projected-cost) |
| $\SRW_{2,k}$ | Paty--Cuturi subspace robust Wasserstein distance. | [Section sec-spectral-subspace-wasserstein](generalized-wasserstein#spectral-and-robust-wasserstein-distances) |
| $\LOT_\rho$ | Linear OT distance around reference $\rho$. | [Eq. eq-lot-embedding](generalized-wasserstein#eq-lot-embedding) |
| $\bar T_\pi$ | Barycentric projection of a coupling $\pi$. | [Eq. eq-barycentric-projection](generalized-ot-problems#eq-barycentric-projection) |
| $\bar\beta_\pi$ | Pushforward of $\alpha$ by the barycentric projection. | [Eq. eq-barycentric-projection](generalized-ot-problems#eq-barycentric-projection) |
| $\WOT_C$ | Weak OT value with conditional-law cost $C$. | [Eq. eq-weak-ot](generalized-ot-problems#eq-weak-ot) |
| $g^C$ | Weak $C$-transform in weak OT duality. | [Proposition prop-weak-ot-duality](generalized-ot-problems#weak-optimal-transport) |
| $\Couplings_{\mathrm{mart}}(\alpha,\beta)$ | Martingale couplings between $\alpha$ and $\beta$. | [Definition def-martingale-coupling](generalized-ot-problems#def-martingale-coupling) |
| $\preceq_{\mathrm{st}},\preceq_{\mathrm{cx}}$ | Stochastic order and convex order. | [Section sec-martingale-ot](generalized-ot-problems#sec-martingale-ot) |
| $u_t,V_t$ | Positive vector-valued density and spatial flux. | [Eqs. eq-vector-valued-bb](beyond-comparing-measures#eq-vector-valued-bb), [eq-vector-valued-continuity](beyond-comparing-measures#eq-vector-valued-continuity) |
| $\mathcal W_{\Phi}$ | Dynamic vector-valued BB-type cost. | [Eq. eq-vector-valued-bb](beyond-comparing-measures#eq-vector-valued-bb) |
| $\distD,\distD'$ | Intra-domain distance matrices in discrete GW. | [Eq. eq-gw-def](beyond-comparing-measures#eq-gw-def) |
| $\De$ | Discrepancy between intra-domain distances. | [Eq. eq-gw-def](beyond-comparing-measures#eq-gw-def) |
| $\GWD$ | Discrete Gromov--Wasserstein cost. | [Eq. eq-gw-def](beyond-comparing-measures#eq-gw-def) |
| $\XX,\YY$ | Metric-measure spaces. | [Definition def-metric-measure-space](beyond-comparing-measures#general-setting) |
| $\GW$ | Continuous Gromov--Wasserstein distance. | [Eq. eq-gw-generic](beyond-comparing-measures#eq-gw-generic) |
| $d_{\mathrm H},d_{\mathrm{GH}}$ | Hausdorff and Gromov--Hausdorff distances. | [Section sec-gromov-wasserstein](beyond-comparing-measures#gromov-wasserstein) |
| $\operatorname{FGW}_{\lambda,p}$ | Fused Gromov--Wasserstein distance. | [Section sec-gromov-wasserstein](beyond-comparing-measures#gromov-wasserstein) |
| $\mathbb S^m,\mathbb S_+^m$ | Real symmetric matrices and their positive semidefinite cone. | [Definition def-positive-matrix-valued-measure](beyond-comparing-measures#positive-matrix-valued-measures) |
| $A_t,P_t$ | Positive matrix-valued density and spatial matrix flux. | [Eqs. eq-matrix-valued-bb](beyond-comparing-measures#eq-matrix-valued-bb), [eq-matrix-valued-continuity](beyond-comparing-measures#eq-matrix-valued-continuity) |
| $\mathcal W_{\mathrm{mat}}$ | Conservative matrix-valued BB-type cost. | [Eq. eq-matrix-valued-bb](beyond-comparing-measures#eq-matrix-valued-bb) |
| $\mathbb H_n,\mathbb H_n^+,\mathbb H_n^{+,1}$ | Hermitian matrices, positive semidefinite Hermitian matrices and density matrices. | [Definition def-hermitian-density-matrices](beyond-comparing-measures#finite-dimensional-states-and-couplings) |
| $\operatorname{Tr}_A,\operatorname{Tr}_B$ | Partial traces of a bipartite matrix. | [Eq. eq-qot-partial-traces](beyond-comparing-measures#eq-qot-partial-traces) |
| $\mathrm{QOT}_C(A,B)$ | Finite-dimensional quantum OT value with cost observable $C$. | [Eq. eq-qot-primal](beyond-comparing-measures#eq-qot-primal) |
| $\mathrm{QOT}_C^\epsilon(A,B)$ | Entropically regularized quantum OT value. | [Eq. eq-qot-entropic-primal](beyond-comparing-measures#eq-qot-entropic-primal) |
| $T_e(F,G),T_s(F,G)$ | Exact Gibbs coupling and symmetric Gurvits-scaling surrogate. | [Eqs. eq-qot-gibbs-coupling](beyond-comparing-measures#eq-qot-gibbs-coupling), [eq-qot-symmetric-scaling](beyond-comparing-measures#eq-qot-symmetric-scaling) |

## Dynamic OT and Wasserstein gradient flows

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\alpha_t$ | Time-dependent curve of probability measures. | [Eq. eq:eulerian-advection](dynamic-ot#eq-eulerian-advection) |
| $v_t$ | Eulerian velocity field transporting $\alpha_t$. | [Eq. eq:eulerian-advection](dynamic-ot#eq-eulerian-advection) |
| $T_t$ | Lagrangian particle flow map. | [Eq. eq:lagrangian-advection](dynamic-ot#eq-lagrangian-advection) |
| $P_t$ | Interpolant map in flow matching; later also path evaluation. | [Eq. eq:interp-coupling](transportation-models#stochastic-interpolant) |
| $\Wass_2^2$ via action | Benamou--Brenier dynamic formulation. | [Eq. eq:benamou-brenier](dynamic-ot#eq-benamou-brenier) |
| $\Wgrad f(\alpha)$ | Wasserstein gradient of a functional. | [Proposition prop-formal-wass-gradient](wasserstein-gradient-flows#wasserstein-gradient-formula) |
| $\Pp_{2,\mathbf m}(\Omega;\RR_+^p)$ | Positive multi-species measures with fixed component masses. | [Eq. eq-multispecies-space](wasserstein-gradient-flows#eq-multispecies-space) |
| $\Wass_{2,\oplus}$ | Mass-weighted product Wasserstein distance for independent species transport. | [Eq. eq-multispecies-product-metric](wasserstein-gradient-flows#eq-multispecies-product-metric) |
| $\delta f(\alpha)$ | First variation of $f$ at $\alpha$. | [Proposition prop-formal-wass-gradient](wasserstein-gradient-flows#wasserstein-gradient-formula) |
| $\partial_t\alpha+\diverg(\alpha v)=0$ | Continuity equation. | [Eq. eq:eulerian-advection](dynamic-ot#eq-eulerian-advection) |
| $\alpha_{t+\tau}$ | One JKO/minimizing-movement step. | [Eq. eq:jko-discr](wasserstein-gradient-flows#eq-jko-discr) |
| $\Ss=C([0,1];\RR^d)$ | Path space in the superposition formulation. | [Chapter sec-wasserstein-flows](wasserstein-gradient-flows) |
