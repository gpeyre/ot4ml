---
title: "Notation Table"
---

This appendix collects the main notation used throughout the book. The last column points to the first section, equation, definition, proposition or theorem where the notation is defined or first used in a mathematically meaningful way. The global convention is that $\alpha,\beta$ denote the main source and target measures. A single generic measure is also denoted by $\alpha$; auxiliary measures use contextual letters such as $\nu,\gamma$ or $\eta$.

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
| $\P_\sigma,\mathcal P_n^{\mathrm{perm}}$ | Permutation matrix and the set of all such matrices. | [Definition def-permutation-matrices](kantorovich#def-permutation-matrices) |
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
| $\Phi_2(\al)$ | Raw second-moment matrix of a probability measure. | [Second-moment Bures quotient](monge#prop-bures-second-moment-lift) |
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
| $\mathfrak A,\mathfrak B$ | Probability laws over probability measures. | [Eq. eq-wow-parametric-law](beyond-comparing-measures#eq-wow-parametric-law) |
| $\widehat{\mathfrak A}_p$ | Empirical law of $p$ random probability measures. | [Proposition prop-wow-barycenter-lln](generalized-ot-problems#prop-wow-barycenter-lln) |
| $\bar\alpha_{\mathfrak A}$ | Collapsed mixture associated with a law over measures. | [Definition def-collapsed-barycentric-mixture](beyond-comparing-measures#def-collapsed-barycentric-mixture) |
| $\widetilde\alpha_{\mathfrak A}$ | Wasserstein-barycenter flattening of a law over measures. | [Section sec-barycenters](generalized-ot-problems#sec-barycenters) |
| $\mathbb W_p$ | $p$-Wasserstein distance on the Wasserstein space. | [Eq. eq-wow-distance](beyond-comparing-measures#eq-wow-distance) |
| $\Gamma$ | $c$-cyclically monotone subset of $\X\times\Y$. | [Definition def:ccm](kantorovich#cyclical-monotonicity) |
| $\rho$ | Glued or composed coupling. | [Lemma lem-gluing-general](kantorovich#metric-properties-wasserstein-distances) |
| $\rightharpoonup$ | Weak$^*$ convergence of measures. | [Definition dfn-weak-conv](kantorovich#metric-properties-topology-and-applications) |
| $\TV,\norm{\cdot}_{\TV}$ | Total variation divergence/norm. | [Section sec-measures](monge#measures) |

## Duality, transforms and weak norms

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\fD,\gD$ | Discrete dual potentials. | [Eq. eq-dual](dual#eq-dual) |
| $\f,\g$ | Continuous dual potentials. | [Eq. eq-dual-generic](dual#eq-dual-generic) |
| $\Ee_0(f,g),\Ee(g)$ | Full dual and semi-dual objectives, for functions or vectors. | [Eqs. eq-full-dual-functional-web and eq-semi-dual-web](semidiscrete-w1#eq-full-dual-functional-web) |
| $\PotentialsD(\C)$ | Feasible set of discrete dual potentials for cost $\C$. | [Eq. eq-feasible-potential](dual#eq-feasible-potential) |
| $\Potentials(\c)$ | Feasible set of continuous dual potentials. | [Eq. eq-dfn-pot-dual](dual#eq-dfn-pot-dual-web) |
| $f^c,g^{\bar c}$ | $c$- and $\bar c$-transforms of dual potentials. | [Definition def-c-transform](dual#c-transforms) |
| $\Laguerre_j(\gD)$ | Laguerre/power cell in semi-discrete OT. | [Eq. eq-laguerre-cells](semidiscrete-w1#eq-laguerre-cells-web) |
| $\VV_j(Y)$ | Voronoi cell of codepoint $y_j$. | [Proposition prop-free-masses-voronoi](semidiscrete-w1#prop-free-masses-voronoi) |
| $\Qq_m(\al)$ | Optimal $m$-point quantization error. | [Eq. eq-optimal-quantization](semidiscrete-w1#eq-optimal-quantization-web) |
| $\Ff(Y),\Ff_{\rm eq}(Y)$ | Free-mass and equal-weight quantization energies. | [Section sec-optimal-quantization](semidiscrete-w1#sec-optimal-quantization) |
| $\Lip(f)$ | Lipschitz constant of $f$. | [Eq. eq-lip-constant](semidiscrete-w1#eq-lip-constant) |
| $\Wass_1$ | Kantorovich--Rubinstein distance/norm. | [Eq. eq-w1-metric](semidiscrete-w1#eq-w1-metric-web) |
| $\flow,|\flow|$ | Vector-valued Beckmann flux and its total variation. | [Proposition prop-euclidean-beckmann](semidiscrete-w1#prop-euclidean-beckmann) |
| $\Wass_{1,G}$ | Graph Wasserstein-1/transshipment distance. | [Proposition prop-graph-w1-beckmann](semidiscrete-w1#wasserstein-1-norm) |
| $d_G,\nabla_G,\operatorname{div}_G$ | Graph geodesic distance, gradient and divergence. | [Proposition prop-graph-w1-beckmann](semidiscrete-w1#wasserstein-1-norm) |
| $\norm{\cdot}_B$ | Extended dual seminorm induced by a discriminator class $B$. | [Eq. eq-dual-norm-cont](dual-norms#eq-dual-norm-cont-web) |
| $\RKHS,\Krkhs$ | Reproducing kernel Hilbert space and its kernel. | [Definition def-kernel-mmd-norm](dual-norms#dual-rkhs-norms-and-maximum-mean-discrepancies) |
| $\MMD_k$ | Maximum mean discrepancy/kernel seminorm for $k$. | [Definition def-kernel-mmd-norm](dual-norms#dual-rkhs-norms-and-maximum-mean-discrepancies) |
| $\Divergm_\phi,\DivergmD_\phi$ | Continuous and discrete $\phi$-divergences. | [Eq. eq-phi-div](dual-norms#eq-phi-div-web) |
| $\phi'_\infty$ | Recession slope of an entropy function. | [Definition def_entropy](dual-norms#definition-by-density-ratios) |
| $\phi^\star$ | Legendre transform of $\phi$. | [Eq. eq-legendre](dual-norms#definition-by-density-ratios) |
| $\KL,\KLD$ | Continuous and discrete Kullback--Leibler divergences. | [Definitions def-discrete-relative-entropy](sinkhorn#reformulation-using-relative-entropy), [def-measure-relative-entropy](sinkhorn#general-formulation) |
| $\Hellinger$ | Hellinger distance. | [Section sec-phi-div](dual-norms#phi-divergences) |
| $\JS$ | Jensen--Shannon distance. | [Section sec-phi-div](dual-norms#phi-divergences) |

## Entropic regularization and Sinkhorn algorithms

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\epsilon$ | Entropic regularization strength. | [Eq. eq-regularized-discr](sinkhorn#eq-regularized-discrete-web) |
| $\HD(\P)$ | Shannon--Boltzmann entropy of a matrix. | [Definition def-discrete-shannon-boltzmann-entropy](sinkhorn#entropic-regularization-for-discrete-measures) |
| $\MKD_\C^\epsilon(\a,\b)$ | Discrete entropic OT value. | [Eq. eq-regularized-discr](sinkhorn#eq-regularized-discrete-web) |
| $\MK_\c^\epsilon(\al,\be)$ | Continuous entropic OT value. | [Eq. eq-entropic-generic](sinkhorn#eq-entropic-generic-web) |
| $\mathcal I(X,Y)$ | Mutual information of a coupled pair. | [Definition def-mutual-information](sinkhorn#def-mutual-information) |
| $\mathcal I_{\mathrm{geo}}(\al,\be)$ | Integrated Fisher information along the quadratic Wasserstein geodesic. | [Proposition prop-small-epsilon-expansion](sinkhorn#prop-small-epsilon-expansion) |
| $\K$ | Gibbs kernel $e^{-\C/\epsilon}$. | [Eq. eq-scaling-form](sinkhorn#eq-scaling-form-web) |
| $\uD,\vD$ | Left and right Sinkhorn scalings. | [Eq. eq-scaling-form](sinkhorn#eq-scaling-form-web) |
| $\diag(\uD)\K\diag(\vD)$ | Scaling form of the entropic coupling. | [Eq. eq-sink-matrix](sinkhorn#eq-scaling-form-web) |
| $\odot$ | Entrywise product of vectors. | [Eq. eq-dualsinkhorn-constraints2](sinkhorn#eq-sinkhorn-constraints-web) |
| $\it{\uD},\itt{\uD}$ | Current and next Sinkhorn iterates. | [Eq. eq-sinkhorn](sinkhorn#eq-sinkhorn-web) |
| $f^{c,\epsilon},g^{\bar c,\epsilon}$ | Continuous soft $c$-transforms. | [Definition def-continuous-soft-c-transform](sinkhorn#def-continuous-soft-c-transform) |
| $\mathrm{SB}_\epsilon(\al,\be)$ | Dynamic Schrodinger bridge value. | [Eq. eq-schrodinger-path-space](sinkhorn#eq-schrodinger-path-space-web) |
| $\operatorname{prox}_{\mathsf h}^{\KLD}$ | KL-proximal map of a marginal penalty. | [Eq. eq-kl-prox-marginal](sinkhorn#eq-kl-prox-marginal) |
| $\norm{\cdot}_V$ | Variation seminorm on potentials modulo constants. | [Definition def-variation-seminorm](sinkhorn-advanced#def-variation-seminorm) |
| $\Hilbert$ | Hilbert projective metric on positive vectors. | [Definition def-hilbert-metric](sinkhorn-advanced#sinkhorn-convergence-linear-hilbert-metric-rate) |
| $\Delta_k$ | Entropic dual suboptimality after $k$ Sinkhorn cycles. | [Proposition prop-sinkhorn-dual-rate](sinkhorn-advanced#prop-sinkhorn-dual-rate) |
| $\eta(K),\lambda(K)$ | Projective cross-ratio and Birkhoff contraction factor. | [Theorem thm-birkhoff](sinkhorn-advanced#thm-birkhoff) |
| $\Proj^\KLD$ | KL/Bregman projection. | [Eq. eq-kl-proj](sinkhorn-advanced#alternating-kl-projections) |
| $\bar\MK_\c^\epsilon(\al,\be)$ | Debiased Sinkhorn divergence. | [Eq. eq-sinkhorn-divergence](sinkhorn#eq-sinkhorn-divergence-web) |
| $v_k,S_k,\rho_{k,u}$ | Scaled log-Sinkhorn transforms and multiplicative increment. | [Proposition prop-scaled-log-sinkhorn-limit](sinkhorn-advanced#prop-scaled-log-sinkhorn-limit) |
| $z=(u,v),Q(z)$ | Log-scaling variables and clearing map in the M-function view. | [Definition def-mfunctions](sinkhorn-advanced#def-mfunctions) |
| $\underline z,\overline z,z^\star$ | Lower/upper order barriers and the monotone-clearing fixed point. | [Theorem thm-mfunction-jacobi-convergence](sinkhorn-advanced#thm-mfunction-jacobi-convergence) |
| $\eta_{ij},\sigma_i,\tau_j$ | Loss factors and outside-option coefficients in lossy Sinkhorn clearing. | [Example ex-lossy-sinkhorn-clearing](sinkhorn-advanced#ex-lossy-sinkhorn-clearing) |
| $u_t,F,G,\bar r_t$ | Continuous $\varepsilon$-Sinkhorn potential, log-densities and gauge term. | [Definition def-continuous-epsilon-sinkhorn](sinkhorn-advanced#def-continuous-epsilon-sinkhorn) |
| $B_t,q_t$ | Gaussian linear part and mean shift in continuous Sinkhorn closure. | [Section sec-continuous-epsilon-sinkhorn](sinkhorn-advanced#sec-continuous-epsilon-sinkhorn) |

## Extensions of OT

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\psi_1,\psi_2$ | Entropy functions penalizing marginal mismatch. | [Eq. eq-unbalanced-primal](generalized-wasserstein#eq-unbalanced-primal) |
| $\UW_c,\UW_{c,\tau}$ | Relaxed unbalanced OT value with marginal penalties. | [Eq. eq-unbalanced-primal](generalized-wasserstein#eq-unbalanced-primal) |
| $L_c$ | Reverse-formulation local unbalanced cost. | [Eq. eq-unbalanced-reverse-local-cost](generalized-wasserstein#eq-unbalanced-reverse-local-cost) |
| $H_c$ | Homogeneous perspective of the local cost $L_c$. | [Eq. eq-unbalanced-homogeneous-local-cost](generalized-wasserstein#eq-unbalanced-homogeneous-local-cost) |
| $\HW$ | Homogeneous unbalanced formulation. | [Eq. eq-homogeneous](generalized-wasserstein#eq-homogeneous) |
| $\mathfrak{C}[\X]$ | Cone over the metric space $\X$. | [Section sec-unbalanced](generalized-wasserstein#unbalanced-ot) |
| $\CW$ | Cone formulation of unbalanced OT. | [Theorem thm-cone-unbalanced-ot](generalized-wasserstein#conic-lifting) |
| $\Delta_\kappa,\CW_\kappa$ | Scaled cone metric and static cone value for Wasserstein--Fisher--Rao transport. | [Eqs. eq-wfr-scaled-cone-metric](dynamic-ot#eq-wfr-scaled-cone-metric), [eq-wfr-scaled-cone-value](dynamic-ot#eq-wfr-scaled-cone-value) |
| $J_\kappa,\mathbb J_\kappa$ | Pointwise and measure-valued dynamic unbalanced perspective actions. | [Eqs. eq-wfr-momentum-perspective](dynamic-ot#eq-wfr-momentum-perspective), [eq-wfr-measure-action](dynamic-ot#eq-wfr-measure-action) |
| $\WFR_\kappa$ | Wasserstein--Fisher--Rao dynamic distance with growth scale $\kappa$. | [Eq. eq-dynamic-unbalanced-ot](dynamic-ot#eq-dynamic-unbalanced-ot) |
| $\be_s,\la_s$ | Input measures and weights in barycenter problems. | [Eq. eq-barycenter-generic](generalized-ot-problems#eq-barycenter-generic) |
| $\al^\star$ | Optimal measure, often a barycenter. | [Eq. eq-barycenter-generic](generalized-ot-problems#eq-barycenter-generic) |
| $\mathcal B_c(\mathfrak A)$ | Set of barycenters of a law over measures. | [Section sec-barycenters](generalized-ot-problems#sec-barycenters) |
| $B,c_{\mathrm{bar}}$ | Barycentric map and induced multi-marginal barycenter cost. | [Proposition prop-multimarginal-barycenter](generalized-ot-problems#prop-multimarginal-barycenter) |
| $\SW_p$ | Sliced Wasserstein distance. | [Definition def-sliced-wasserstein](generalized-wasserstein#eq-sliced-wasserstein) |
| $\Sphere^{d-1}$ | Unit sphere of projection directions. | [Definition def-sliced-wasserstein](generalized-wasserstein#eq-sliced-wasserstein) |
| $P_\theta$ | Projection on direction $\theta$. | [Definition def-sliced-wasserstein](generalized-wasserstein#eq-sliced-wasserstein) |
| $\mathfrak R\al$ | Measure-valued Radon transform of $\alpha$. | [Remark rem-sliced-radon-viewpoint](generalized-wasserstein#rem-sliced-radon-viewpoint) |
| $R\rho$ | Density Radon transform of $\rho$. | [Remark rem-sliced-radon-viewpoint](generalized-wasserstein#rem-sliced-radon-viewpoint) |
| $R^\dagger h$ | Least-squares Radon pseudoinverse density reconstructed from a sinogram $h$. | [Proposition prop-radon-pseudoinverse](generalized-ot-problems#prop-radon-pseudoinverse) |
| $\gamma_\theta$ | One-dimensional projected/Radon-domain barycenter law. | [Section sec-barycenters](generalized-ot-problems#sec-barycenters) |
| $\SW_{p,q,k}$ | $L^q$ aggregate of $p$-Wasserstein distances over $k$-dimensional projections. | [Definition def-sliced-variants](generalized-wasserstein#def-sliced-variants) |
| $\SW_{p,q},\MaxSW_{p,k}$ | Line-sliced and max-sliced abbreviations, with $\MaxSW_{p,k}=\SW_{p,\infty,k}$. | [Definition def-sliced-variants](generalized-wasserstein#def-sliced-variants) |
| $\MinSW_2$ | Min-SW lifted-plan discrepancy, upper-bounding $\Wass_2$. | [Proposition prop-min-sw-comparison](generalized-wasserstein#prop-min-sw-comparison) |
| $\Wass_\gamma$ | Spectral Wasserstein distance associated with a matrix gauge $\gamma$. | [Eq. eq-spectral-wasserstein](generalized-wasserstein#eq-spectral-wasserstein) |
| $\mathcal B_\gamma$ | Polar set defining the robust projected form of $\Wass_\gamma$. | [Eq. eq-spectral-polar-set](generalized-wasserstein#eq-spectral-polar-set) |
| $\Wass_{2,A}$ | Quadratic Wasserstein pseudodistance after projection by $A^{1/2}$. | [Eq. eq-quadratic-projected-cost](generalized-wasserstein#eq-quadratic-projected-cost) |
| $\SRW_{2,k}$ | Paty--Cuturi subspace robust Wasserstein distance. | [Section sec-spectral-subspace-wasserstein](generalized-wasserstein#spectral-and-robust-wasserstein-distances) |
| $\LOT_\rho$ | Linear OT distance around reference $\rho$. | [Eq. eq-lot-embedding](generalized-wasserstein#eq-lot-embedding) |
| $Q,R,g$ | Low-rank OT factors and latent mass vector. | [Definition def-low-rank-couplings](generalized-ot-problems#def-low-rank-couplings) |
| $\P(\Q,\R,g)$ | Coupling induced by a low-rank factored representation. | [Eq. eq-low-rank-coupling-factor](generalized-ot-problems#eq-low-rank-coupling-factor) |
| $\eta=\sum_k g_k\delta_{z_k}$ | Abstract intermediate measure in low-rank OT. | [Definition def-low-rank-couplings](generalized-ot-problems#def-low-rank-couplings) |
| $\MK_c^\kappa,\kappa$ | Capacity-constrained OT value and capacity density. | [Eq. eq-capacity-constrained-ot](generalized-ot-problems#eq-capacity-constrained-ot) |
| $U_{ij}$ | Discrete upper-capacity matrix for a capped coupling. | [Eq. eq-discrete-capacity-constrained-ot](generalized-ot-problems#eq-discrete-capacity-constrained-ot) |
| $\mathcal V_c,\mathcal V_{c,\epsilon}$ | Unregularized and KL-normalized entropic OT values used in sensitivity formulas. | [Propositions prop-ot-first-variations-unregularized](generalized-ot-problems#prop-ot-first-variations-unregularized), [prop-ot-first-variations-entropic](generalized-ot-problems#prop-ot-first-variations-entropic) |
| $\mathcal L_{\mathrm{iOT}}$ | Inverse-OT primal--dual gap loss. | [Section sec-metric-learning-inverse-ot](generalized-ot-problems#sec-metric-learning-inverse-ot) |
| $\bar T_\pi$ | Barycentric projection of a coupling $\pi$. | [Eq. eq-barycentric-projection](generalized-ot-problems#eq-barycentric-projection) |
| $\bar\beta_\pi$ | Pushforward of $\alpha$ by the barycentric projection. | [Eq. eq-barycentric-projection](generalized-ot-problems#eq-barycentric-projection) |
| $\WOT_C$ | Weak OT value with conditional-law cost $C$. | [Eq. eq-weak-ot](generalized-ot-problems#eq-weak-ot) |
| $g^C$ | Weak $C$-transform in weak OT duality. | [Proposition prop-weak-ot-duality](generalized-ot-problems#weak-optimal-transport) |
| $\Couplings_{\mathrm{mart}}(\alpha,\beta)$ | Martingale couplings between $\alpha$ and $\beta$. | [Definition def-martingale-coupling](generalized-ot-problems#def-martingale-coupling) |
| $\preceq_{\mathrm{st}},\preceq_{\mathrm{cx}}$ | Stochastic order and convex order. | [Section sec-martingale-ot](generalized-ot-problems#sec-martingale-ot) |
| $C_{\mathrm{bar}}$ | Quadratic barycentric weak-transport cost. | [Proposition prop-barycentric-weak-ot](generalized-ot-problems#prop-barycentric-weak-ot) |
| $u_t,V_t$ | Positive vector-valued density and spatial flux. | [Eqs. eq-vector-valued-bb](beyond-comparing-measures#eq-vector-valued-bb), [eq-vector-valued-continuity](beyond-comparing-measures#eq-vector-valued-continuity) |
| $\mathcal W_{\Phi}$ | Dynamic vector-valued BB-type cost. | [Eq. eq-vector-valued-bb](beyond-comparing-measures#eq-vector-valued-bb) |
| $\distD,\distD'$ | Intra-domain distance matrices in discrete GW. | [Eq. eq-gw-def](beyond-comparing-measures#eq-gw-def) |
| $\De$ | Discrepancy between intra-domain distances. | [Eq. eq-gw-def](beyond-comparing-measures#eq-gw-def) |
| $\Ee_{\distD,\distD'}(\P)$ | Discrete GW distortion energy. | [Eq. eq-gw-def](beyond-comparing-measures#eq-gw-def) |
| $\GWD$ | Discrete Gromov--Wasserstein cost. | [Eq. eq-gw-def](beyond-comparing-measures#eq-gw-def) |
| $\XX,\YY$ | Metric-measure spaces. | [Definition def-metric-measure-space](beyond-comparing-measures#general-setting) |
| $\GW$ | Continuous Gromov--Wasserstein distance. | [Eq. eq-gw-generic](beyond-comparing-measures#eq-gw-generic) |
| $\mathfrak D_\XX$ | Law of local distance profiles of a metric-measure space. | [Proposition prop-memoli-gw-profile-lower-bound](beyond-comparing-measures#prop-memoli-gw-profile-lower-bound) |
| $\C(\P)$ | Half-gradient of the squared discrete GW distortion. | [Eq. eq-gw-sinkh](beyond-comparing-measures#eq-gw-sinkh) |
| $d_{\mathrm H},d_{\mathrm{GH}}$ | Hausdorff and Gromov--Hausdorff distances. | [Section sec-gromov-wasserstein](beyond-comparing-measures#gromov-wasserstein) |
| $\operatorname{FGW}_{\lambda,p}$ | Fused Gromov--Wasserstein distance. | [Section sec-gromov-wasserstein](beyond-comparing-measures#gromov-wasserstein) |
| $\mathbb S^m,\mathbb S_+^m$ | Real symmetric matrices and their positive semidefinite cone. | [Definition def-positive-matrix-valued-measure](beyond-comparing-measures#positive-matrix-valued-measures) |
| $A_t,P_t$ | Positive matrix-valued density and spatial matrix flux. | [Eqs. eq-matrix-valued-bb](beyond-comparing-measures#eq-matrix-valued-bb), [eq-matrix-valued-continuity](beyond-comparing-measures#eq-matrix-valued-continuity) |
| $\mathcal W_{\mathrm{mat}}$ | Conservative matrix-valued BB-type cost. | [Eq. eq-matrix-valued-bb](beyond-comparing-measures#eq-matrix-valued-bb) |
| $\mathbb H_n,\mathbb H_n^+,\mathbb H_n^{+,1}$ | Hermitian matrices, positive semidefinite Hermitian matrices and density matrices. | [Definition def-hermitian-density-matrices](beyond-comparing-measures#finite-dimensional-states-and-couplings) |
| $\operatorname{Tr}_A,\operatorname{Tr}_B$ | Partial traces of a bipartite matrix. | [Eq. eq-qot-partial-traces](beyond-comparing-measures#eq-qot-partial-traces) |
| $\mathrm{QOT}_C(A,B)$ | Finite-dimensional quantum OT value with cost observable $C$. | [Eq. eq-qot-primal](beyond-comparing-measures#eq-qot-primal) |
| $\mathrm{QOT}_C^\epsilon(A,B)$ | Entropically regularized quantum OT value. | [Eq. eq-qot-entropic-primal](beyond-comparing-measures#eq-qot-entropic-primal) |
| $D_H(T|K)$ | Quantum relative entropy used for Bregman projections. | [Proposition prop-qot-bregman-projections](beyond-comparing-measures#prop-qot-bregman-projections) |
| $T_e(F,G),T_s(F,G)$ | Exact Gibbs coupling and symmetric Gurvits-scaling surrogate. | [Eqs. eq-qot-gibbs-coupling](beyond-comparing-measures#eq-qot-gibbs-coupling), [eq-qot-symmetric-scaling](beyond-comparing-measures#eq-qot-symmetric-scaling) |
| $\Omega_{n,m},A_\omega$ | Monotone warping paths and their incidence matrices. | [Definition def-dynamic-time-warping](beyond-comparing-measures#def-dynamic-time-warping) |
| $\mathrm{DTW}_c(x,y)$ | Dynamic time-warping value between two feature sequences. | [Eq. eq-dtw-variational](beyond-comparing-measures#eq-dtw-variational) |
| $\Gamma_\uparrow,\mathrm{CDTW}_c(x,y)$ | Monotone clock pairs and continuous time-warping value. | [Eq. eq-continuous-dtw](beyond-comparing-measures#eq-continuous-dtw) |
| $\mathrm{sDTW}_{c,\epsilon},\PP_\epsilon,E_\epsilon$ | Soft-DTW free energy, Gibbs path law and expected alignment matrix. | [Eqs. eq-soft-dtw-variational](beyond-comparing-measures#eq-soft-dtw-variational), [eq-soft-dtw-expected-alignment](beyond-comparing-measures#eq-soft-dtw-expected-alignment) |

## Dynamic OT and Wasserstein gradient flows

| Notation | Meaning | First reference |
| --- | --- | --- |
| $\alpha_t$ | Time-dependent curve of probability measures. | [Eq. eq:eulerian-advection](dynamic-ot#eq-eulerian-advection) |
| $\rho_t$ | Density of $\alpha_t$ with respect to the relevant reference measure. | [Eq. eq:benamou-brenier-convex](dynamic-ot#eq-benamou-brenier-convex) |
| $v_t$ | Eulerian velocity field transporting $\alpha_t$. | [Eq. eq:eulerian-advection](dynamic-ot#eq-eulerian-advection) |
| $\mathcal H_\alpha$ | $L^2(\alpha)$ vector fields with zero weighted divergence. | [Chapter sec-dynamic-optimal-transport](dynamic-ot) |
| $\omega_t=\alpha_t v_t$ | Vector-valued momentum/flux measure in convex dynamic formulations. | [Eq. eq:benamou-brenier-convex](dynamic-ot#eq-benamou-brenier-convex) |
| $m_t=\rho_t v_t$ | Density of $\omega_t$ when $\alpha_t=\rho_t\,\d x$. | [Eq. eq:benamou-brenier-convex](dynamic-ot#eq-benamou-brenier-convex) |
| $J(a,m),\mathbb J(\alpha,\omega)$ | Quadratic perspective and its intrinsic measure action. | [Eqs. eq-quadratic-perspective](dynamic-ot#eq-quadratic-perspective), [eq-measure-perspective-action](dynamic-ot#eq-measure-perspective-action) |
| $T_t$ | Lagrangian particle flow map. | [Eq. eq:lagrangian-advection](dynamic-ot#eq-lagrangian-advection) |
| $P_t$ | Interpolant map in flow matching. | [Eq. eq:interp-coupling](transportation-models#stochastic-interpolant) |
| $\Ss=C([0,1];\RR^d),e_t$ | Path space and evaluation map in the superposition formulation. | [Section rem-bb-path-space](dynamic-ot#rem-bb-path-space) |
| $\Wass_2^2$ via action | Benamou--Brenier dynamic formulation. | [Eq. eq:benamou-brenier](dynamic-ot#eq-benamou-brenier) |
| $|\dot x_t|$ | Metric derivative of an absolutely continuous curve. | [Chapter sec-wasserstein-flows](wasserstein-gradient-flows) |
| $\mathbb A(\alpha,w)$ | Tangent action defining a dynamic length distance. | [Eq. eq-generalized-action-length-distance](dynamic-ot#eq-generalized-action-length-distance) |
| $\mathsf D_{\mathbb A}$ | Length-space distance generated by the tangent action $\mathbb A$. | [Eq. eq-generalized-action-length-distance](dynamic-ot#eq-generalized-action-length-distance) |
| $\operatorname{PMO}_{\mathbb A,\alpha}$ | Penalized minimization oracle associated with $w\mapsto\mathbb A(\alpha,w)$. | [Eq. eq-local-action-steepest-descent](wasserstein-gradient-flows#eq-local-action-steepest-descent) |
| $Q_\alpha$ | Positive operator representing a quadratic local tangent action. | [Eq. eq-general-quadratic-tangent-action](dynamic-ot#eq-general-quadratic-tangent-action) |
| $\mathsf D_Q$ | Geodesic distance induced by a quadratic tangent operator $Q_\alpha$. | [Eq. eq-general-quadratic-tangent-action](dynamic-ot#eq-general-quadratic-tangent-action) |
| $A(a,w)$ | Local velocity action density, with scalar density value $a$ and velocity $w\in\RR^d$. | [Eq. eq-local-velocity-action](dynamic-ot#eq-local-velocity-action) |
| $J_A(a,m)$ | Momentum perspective of $A$, with pointwise momentum $m\in\RR^d$. | [Eq. eq-general-momentum-perspective](dynamic-ot#eq-general-momentum-perspective) |
| $\mathbb J_{A,\lambda}(\alpha,\omega)$ | Measure-level momentum action associated with $A$ relative to a reference measure $\lambda$; written $\mathbb J_A$ only in intrinsic cases. | [Eq. eq-general-measure-momentum-action](dynamic-ot#eq-general-measure-momentum-action) |
| $\mathsf D_{A,\lambda}$ | Dynamic distance induced by the homogeneous momentum action $J_A$, with the reference measure suppressed only in intrinsic cases. | [Proposition prop-homogeneous-dynamic-action-distance](dynamic-ot#prop-homogeneous-dynamic-action-distance) |
| $A_p,J_p,\mathbb A_p$ | Velocity action, momentum perspective and tangent action for $\Wass_p$. | [Section sec-generalized-dynamic-wasserstein-distances](dynamic-ot#sec-generalized-dynamic-wasserstein-distances) |
| $\theta(a),J_\theta,\mathbb A_{\theta,\lambda},\mathsf W_{\theta,\lambda}$ | Concave mobility, its momentum action, reference-dependent tangent action and associated mobility distance. | [Section sec-generalized-dynamic-wasserstein-distances](dynamic-ot#sec-generalized-dynamic-wasserstein-distances) |
| $(s_t,g_t)$ | Source and relative growth variables in dynamic unbalanced OT. | [Eq. eq-dynamic-unbalanced-ot](dynamic-ot#eq-dynamic-unbalanced-ot) |
| $\mathbb A_\gamma(\alpha,v)$ | Spectral tangent action induced by the gauge $\gamma$. | [Eq. eq-spectral-tangent-action](dynamic-ot#eq-spectral-tangent-action) |
| $\mathsf W_{\gamma,\mathrm{dyn}}$ | Dynamic path-length representation of $\Wass_\gamma$. | [Eq. eq-dynamic-spectral-wasserstein](dynamic-ot#eq-dynamic-spectral-wasserstein) |
| $\Sigma_n$ | Finite-state probability simplex in Markov-chain geometries. | [Section sec-discrete-wasserstein-markov](dynamic-ot#sec-discrete-wasserstein-markov) |
| $K_{ij},\pi$ | Reversible Markov transition rates and invariant law. | [Section sec-discrete-wasserstein-markov](dynamic-ot#sec-discrete-wasserstein-markov) |
| $\theta(a,b)$ | Logarithmic mean used as Markov/nonlocal mobility. | {eq}`eq-logarithmic-mean` |
| $\mathcal K_\rho$ | Onsager operator for a discrete reversible Markov chain. | [Eq. eq-discrete-markov-onsager](dynamic-ot#eq-discrete-markov-onsager) |
| $\mathbb A_K(a,\psi),\mathcal W_K$ | Markov-chain tangent action and associated discrete Wasserstein distance. | [Eqs. eq-discrete-markov-action](dynamic-ot#eq-discrete-markov-action), [eq-discrete-markov-distance](dynamic-ot#eq-discrete-markov-distance) |
| $\mathfrak m,K(x,\d y),\mathsf J$ | Reference measure, reversible jump kernel and symmetric jump measure. | {eq}`eq-nonlocal-jump-measure` |
| $\bar\nabla\varphi$ | Nonlocal gradient/increment $\varphi(y)-\varphi(x)$. | [Eq. eq-nonlocal-continuity-weak](dynamic-ot#eq-nonlocal-continuity-weak) |
| $\mathbb A_K(\alpha,v),\mathcal W_K$ | Nonlocal jump tangent action and associated Wasserstein distance. | [Eq. eq-nonlocal-wasserstein-distance](dynamic-ot#eq-nonlocal-wasserstein-distance) |
| $\mathcal W_k,\RKHS_k^d,\kappa_k$ | Kernelized Benamou--Brenier distance, vector-valued velocity RKHS, and uniform evaluation bound. | [Eq. eq-kernelized-bb-distance](dynamic-ot#eq-kernelized-bb-distance), [Proposition prop-kernelized-bb-distance](dynamic-ot#prop-kernelized-bb-distance) |
| $\Wgrad f(\alpha)$ | Wasserstein gradient of a functional. | [Proposition prop-formal-wass-gradient](wasserstein-gradient-flows#wasserstein-gradient-formula) |
| $\mathcal I(\alpha|\beta)$ | Relative Fisher information of $\alpha$ with respect to $\beta$. | {eq}`eq-relative-fisher-information` |
| $\Pp_{p,\lambda}(S\times\Omega)$ | Conditional probability laws with fixed condition marginal $\lambda$ and finite $p$th moment. | [Section sec-conditional-wasserstein-distances](generalized-wasserstein#sec-conditional-wasserstein-distances) |
| $\Couplings_\lambda(\alpha,\beta)$ | Conditional couplings that keep the condition variable fixed. | [Eq. eq-conditional-ot-general](generalized-wasserstein#eq-conditional-ot-general) |
| $\MK_c^\lambda,\Wass_{p,\lambda}$ | Conditional OT value and, for $c_s=\dist^p$, its $p$th-root metric. | [Eqs. eq-conditional-ot-general](generalized-wasserstein#eq-conditional-ot-general), [eq-conditional-wasserstein-distance](generalized-wasserstein#eq-conditional-wasserstein-distance) |
| $\operatorname{PMO}_{\mathbb A_\gamma,\alpha}(g)$ | Spectral specialization of the penalized minimization oracle. | [Proposition prop-normalized-spectral-polar](wasserstein-gradient-flows#prop-normalized-spectral-polar) |
| $S_\alpha(g),A_\alpha^\star$ | Gradient covariance and active polar preconditioner in spectral flow. | [Proposition prop-normalized-spectral-polar](wasserstein-gradient-flows#prop-normalized-spectral-polar) |
| $\Pp_{2,\mathbf m}(\Omega;\RR_+^p)$ | Positive multi-species measures with fixed component masses. | [Eq. eq-multispecies-space](wasserstein-gradient-flows#eq-multispecies-space) |
| $\Wass_{2,\oplus}$ | Mass-weighted product Wasserstein distance for independent species transport. | [Eq. eq-multispecies-product-metric](wasserstein-gradient-flows#eq-multispecies-product-metric) |
| $\delta f(\alpha)$ | First variation of $f$ at $\alpha$. | [Proposition prop-formal-wass-gradient](wasserstein-gradient-flows#wasserstein-gradient-formula) |
| $|\partial f|(\alpha)$ | Wasserstein or metric slope of an energy functional. | [Definition def-wasserstein-pl](wasserstein-gradient-flows#def-wasserstein-pl) |
| $\partial_t\alpha+\diverg(\alpha v)=0$ | Continuity equation. | [Eq. eq:eulerian-advection](dynamic-ot#eq-eulerian-advection) |
| $\alpha_{t+\tau}$ | One JKO/minimizing-movement step. | [Eq. eq:jko-discr](wasserstein-gradient-flows#eq-jko-discr) |
| $\Ss=C([0,1];\RR^d)$ | Path space in the superposition formulation. | [Chapter sec-wasserstein-flows](wasserstein-gradient-flows) |
| $X,S,\al_X,F(X)$ | Particle configuration, particle velocity, empirical law and lifted energy. | [Eq. eq-empirical-momentum-lift](wasserstein-gradient-flows#eq-empirical-momentum-lift) |
| $s,\eta_t,\eta_t^n,\pi_x$ | Velocity variable, phase-space laws and spatial projection in inertial flows. | [Proposition prop-second-order-liouville](wasserstein-gradient-flows#prop-second-order-liouville) |
