# Definition-environment audit

## Chapter 1: Optimal Matching between Point Clouds

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P1 | **Optimal assignment problem** | `OT4ML/sections/matching.tex:22`, Eq. `eq-optimal-assignment` | Define the cost matrix, permutation set, normalized assignment value, and the terminology “optimal assignment/permutation.” This is the clearest omission and should be the first box in the chapter. |

## Chapter 2: Monge Problem between Measures

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P2 | **Radon measure and probability measure** | `OT4ML/sections/monge.tex:118` | Consolidate the current prose definition of a Radon measure, the notation `M_+(X)` and `M_+^1(X)`, and the test-function pairing. This is foundational but standard. |
| P2 | **Random variable and its law** | `OT4ML/sections/monge.tex:249` | Define a measurable map `X:(Omega,F)->(X,B(X))` and `Law(X)=X_#P`. This would make the probabilistic interpretation independently citable. |
| P1 | **Monge problem and Monge map** | `OT4ML/sections/monge.tex:407`, Eq. `eq-monge-continuous` | Define the feasible maps `T_# alpha=beta`, the value `Monge_c(alpha,beta)`, the `+infinity` convention, and the terms admissible/optimal Monge map. |
| P1 | **Directed Monge distance** | `OT4ML/sections/monge.tex:534`, Eq. `eq-monge-distance` | Define `tilde W_p`, its finite-moment domain, and the empty-feasible-set convention. Proposition `prop-directed-monge-distance` should then prove its directed extended-metric properties rather than introduce the object. |

## Chapter 3: Kantorovich Relaxation

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P1 | **Discrete Kantorovich problem** | `OT4ML/sections/kantorovich.tex:156`, Eq. `eq-kanto-discr` | Define the linear program and its value `L_C(a,b)` after the existing definition of the transport polytope. Include the equal-total-mass assumption and the term optimal coupling/plan. |
| P1 | **Continuous Kantorovich problem** | `OT4ML/sections/kantorovich.tex:966`, Eq. `eq-mk-generic` | Define `L_c(alpha,beta)` over `Pi(alpha,beta)`, including measurability/integrability and the `+infinity` convention. Existence remains the next theorem. |
| P2 | **`p`-Wasserstein space** | around `OT4ML/sections/kantorovich.tex:1511` | Extend the existing “Wasserstein distance” box, or add a compact companion definition, for `P_p(X)`, finite `p`th moment, and `(P_p(X),W_p)`. Do not duplicate the distance formula. |
| P2 | **Convolution of measures** | `OT4ML/sections/kantorovich.tex:1948` | Define `alpha*beta=add_#(alpha otimes beta)` and the law-of-a-sum interpretation. It is reused in the CLT and diffusion discussions. |
| P1 | **`W_infinity` Wasserstein distance** | `OT4ML/sections/kantorovich.tex:2375`, Eq. `eq-wass-infty` | Define the essential-supremum coupling cost, its finite/infinite convention, and the equivalent support-threshold formulation. Metric and robust-envelope properties remain propositions. |

## Chapter 4: Dual Problem

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P1 | **Continuous admissible potentials** | `OT4ML/sections/dual.tex:137`, Eq. `eq-dfn-pot-dual` inside Theorem `prop-kantorovich-duality-general` | Move `Potentials(c)` out of the theorem and box it before continuous duality, mirroring Definition `def-admissible-potentials` for vectors. The theorem should only state equality and attainment. |
| P1 | **`c`-concave and `bar c`-concave functions** | `OT4ML/sections/dual.tex:422` | Define these as functions in the ranges of the two `c`-transforms, with the ambient spaces and extended-real convention inherited from the transform box. Their canonical biconjugate representatives can be mentioned, while regularity remains in the following proposition. |
| P2 | **Legendre–Fenchel transform and biconjugate** | `OT4ML/sections/dual.tex:455`, especially `:481` | Box `h^*` and `h^{**}`, including the extended-real convention. The convex-envelope statement remains a theorem/comment. This concept is reused in Sinkhorn’s Hopf–Cole discussion. |

## Chapter 5: Semi-discrete and `W_1`

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P1 | **Full dual functional and semi-dual functional** | `OT4ML/sections/semidiscr-w1.tex:23`, Eqs. `eq-full-dual-functional` and `eq-semi-dual` | Define `E_0(f,g)` and `E(g)=E_0(g^{bar c},g)`. A second clause can give the discrete-vector specialization at `:54` without a second box. |
| P1 | **Optimal quantization problem** | `OT4ML/sections/semidiscr-w1.tex:687`, Eq. `eq-optimal-quantization` | Define `Q_m(alpha)` as approximation by at most `m` atoms with free sites and weights. State whether coincident/zero-mass codepoints are allowed. |
| P1 | **Beckmann problem** | `OT4ML/sections/semidiscr-w1.tex:1218`, Eq. `eq-w1-cont-div` | Define the divergence-constrained flux minimization as a named optimization problem. The proposition should then prove equality with `W_1`. |

## Chapter 6: Dual Norms, MMD, and Divergences

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P2 | **Universal kernel** | `OT4ML/sections/dual-norms.tex:342` | Promote the mathematical definition currently embedded in Remark “Universal kernels”: density of kernel sections in `C(X)` (or `C_0(X)`) under the stated topology. Spectral characterizations remain in the remark/proposition text. |

## Chapter 7: Entropic Regularization and Sinkhorn

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P1 | **Discrete entropic OT problem** | `OT4ML/sections/sinkhorn.tex:33`, Eq. near `:49` | After the entropy definition, box `L_C^epsilon(a,b)` and specify the sign convention, `0 log 0`, and uniqueness for `epsilon>0` as a subsequent proposition. |
| P1 | **Continuous entropic OT problem** | `OT4ML/sections/sinkhorn.tex:601`, Eq. `eq-mk-entropic-continuous` | Box `L_c^epsilon(alpha,beta)` relative to `alpha otimes beta`. The already boxed relative entropy can be cited rather than repeated. |
| P1 | **Unregularized path-space transport problem** | `OT4ML/sections/sinkhorn.tex:1157`, Eq. around `:1203` | Define path space, evaluation maps, endpoint constraints, action, and the path-space transport value. The static equivalence remains a proposition. |
| P1 | **Schrödinger bridge / entropic path-space problem** | `OT4ML/sections/sinkhorn.tex:1252`, Eq. around `:1260` | Define minimization of relative entropy with respect to the reference path law under endpoint marginals. Distinguish path law from endpoint coupling. |
| P1 | **Marginal-dependent entropic transport problem** | `OT4ML/sections/sinkhorn.tex:1507`, Eq. around `:1613` | Define the primal template `int c dpi+F(pi_1)+G(pi_2)+epsilon KL(...)` and the discrete specialization. The dual and KL-proximal ascent remain results/algorithms. |
| P1 | **`phi`-regularized optimal transport** | `OT4ML/sections/sinkhorn.tex:1939`, Eq. around `:1949` | Define density-ratio regularization relative to `alpha otimes beta` for a convex entropy function `phi`. Generalized soft transforms then refer to this box. |
| P1 | **Bregman-regularized optimal transport** | `OT4ML/sections/sinkhorn.tex:2140`, before Proposition `prop-bregman-phi-dual-comparison` | Extract the primal value from the dual-comparison proposition and define it immediately after the existing measure-Bregman-divergence box. The proposition should compare duals, not introduce one of the two primal problems it compares. |

## Chapter 8: Sinkhorn Convergence

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P2 | **Bregman projection** | `OT4ML/sections/sinkhorn-advanced.tex:40`, used explicitly at `:119` | Extend the existing Bregman-divergence box or add a short companion box defining `Proj_C^B(Q)=argmin_{P in C}B(P|Q)`, including set-valuedness when uniqueness fails. |
| P2 | **Topical map** | `OT4ML/sections/sinkhorn-advanced.tex:459` | Define monotone, additively homogeneous maps before invoking variation-seminorm nonexpansiveness. This is a named order-theoretic object and deserves a label. |

## Chapter 9: Statistical Optimal Transport

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P1 | **Doubly nonnegative and completely positive matrices/kernels** | `OT4ML/sections/statistical-ot.tex:1417` | Box `DNN_n`, `CP_n`, doubly positive kernels, and complete-positive/positive-feature kernels. Use “complete-positive kernel” or explicitly flag the book’s “totally positive” terminology to avoid confusion with Karlin total positivity. |

## Chapter 10: Generalized Wasserstein Distances

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P1 | **Unbalanced optimal transport with marginal divergences** | `OT4ML/sections/generalized-wasserstein.tex:28`, Eq. around `:134` | Define the relaxed coupling problem, its two marginal divergences, penalty parameters, and value. Reverse/homogeneous/conic formulations remain equivalent reformulations in propositions. |
| P2 | **Cone lift of unbalanced transport** | `OT4ML/sections/generalized-wasserstein.tex:323` | Define the cone space, apex equivalence, and cone ground cost before the cone-formulation theorem. |
| P1 | **Partial optimal transport** | `OT4ML/sections/generalized-wasserstein.tex:1028`, Eqs. around `:1039` and `:1065` | Box both equivalent parameterizations: TV-penalized transported mass and prescribed transported mass. Keep their equivalence and metric regimes in propositions. |
| P2 | **Measure-valued Radon transform** | `OT4ML/sections/generalized-wasserstein.tex:1210`, Eq. around `:1216` | Define `R alpha(theta)=(P_theta)_#alpha`, then state the density-level classical Radon transform as a specialization. This supports sliced OT and barycenters. |
| P1 | **Min-SW discrepancy and lifted plans** | `OT4ML/sections/generalized-wasserstein.tex:1874`, Eqs. around `:1916`–`:1940` | Define the projection-induced coupling class and the minimum ambient cost. Explicitly call it a discrepancy, not a distance, because the triangle inequality fails. |
| P1 | **Wasserstein–Procrustes distance** | `OT4ML/sections/generalized-wasserstein.tex:2071`, formula around `:2078` | Give the rigid-motion specialization of quotient Wasserstein a named box, including `O(d)` versus `SO(d)` and translations. The alternating solver remains an algorithm. |
| P1 | **Linear optimal-transport embedding and distance** | `OT4ML/sections/generalized-wasserstein.tex:2278`, Eq. `eq-lot-embedding` | Define `alpha -> T_alpha-Id` and `LOT_{alpha_ref}(alpha,beta)`. Exactness and stability remain propositions. |
| P1 | **Wasserstein–Fisher–Rao / Hellinger–Kantorovich distance** | first constructed in `OT4ML/sections/generalized-wasserstein.tex:323`–`:340` | The named metric should have one stable box that distinguishes the cosine-cone WFR metric from the Gaussian-Hellinger endpoint cost discussed at `:657`. This would prevent the terminology ambiguity already noted in the text. |

## Chapter 11: Generalized OT Problems

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P1 | **Multimarginal coupling and OT problem** | `OT4ML/sections/generalized-ot-problems.tex:1022` | Define `Pi(alpha_1,...,alpha_S)` and the multimarginal value in one box. Tensor complexity and Monge structure follow afterward. |
| P1 | **Capacity-constrained OT** | `OT4ML/sections/generalized-ot-problems.tex:1634`, Eqs. `eq-capacity-constrained-ot` and `eq-discrete-capacity-constrained-ot` | Box the continuous density cap and its discrete upper-matrix specialization. Feasibility remains a proposition. |
| P1 | **Weak optimal transport problem** | `OT4ML/sections/generalized-ot-problems.tex:2247`, Eq. `eq-weak-ot` | Define disintegration `pi_x`, weak cost `C(x,pi_x)`, and `WOT_C(alpha,beta)`. The weak transform and duality remain theorem material. |
| P1 | **Classical stochastic order** | `OT4ML/sections/generalized-ot-problems.tex:2400` | Define `alpha <=_st beta` by monotone test functions. Strassen’s coupling characterization remains a theorem. |
| P1 | **Convex order** | `OT4ML/sections/generalized-ot-problems.tex:2423` | Define `alpha <=_cx beta` by convex test functions, including the equal-mean consequence. Martingale feasibility remains Strassen’s theorem. |

## Chapter 12: Beyond Comparing Measures

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P1 | **Vector-valued dynamic transport distance** | `OT4ML/sections/beyond-comparing-measures.tex:47`, Eq. `eq-vector-valued-bb` | After the existing vector-valued-measure definition, box the action-induced distance and componentwise continuity constraint. The diagonal reduction remains a proposition. |
| P1 | **Matrix-valued dynamic transport distance** | `OT4ML/sections/beyond-comparing-measures.tex:151`, Eq. `eq-matrix-valued-bb` | Box the matrix action, admissible fluxes, pseudoinverse convention, and matrix continuity equation. |
| P1 | **Wasserstein-over-Wasserstein distance** | `OT4ML/sections/beyond-comparing-measures.tex:216`–`:282` | Define `W_p` on `P_p(P_p(X))` explicitly, with fraktur notation and moment condition. The Polish-space result remains a proposition. |
| P1 | **Gromov–Wasserstein distance** | `OT4ML/sections/beyond-comparing-measures.tex:472`, Eq. around `:491` | Add a box immediately after metric-measure spaces, defining distortion, coupling, exponent convention, and `GW_p`. Metric-up-to-isomorphism properties remain propositions. |
| P1 | **Fused Gromov–Wasserstein problem** | `OT4ML/sections/beyond-comparing-measures.tex:862` | Define the discrete feature-plus-structure objective, the interpolation parameter, and the endpoint conventions. The graph/single-cell interpretations and numerical solver remain outside the box. |
| P2 | **Hausdorff and Gromov–Hausdorff distances** | `OT4ML/sections/beyond-comparing-measures.tex:901` | A compact paired box would make the comparison precise if these distances are used later; otherwise the current high-level paragraph is sufficient. |
| P2 | **Continuous time-warping problem** | `OT4ML/sections/beyond-comparing-measures.tex:1385`, Eq. around `:1391` | Define the admissible increasing reparameterizations and objective. Keep existence/relaxation caveats outside. |

## Chapter 13: Dynamic Optimal Transport

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P1 | **Continuity equation and admissible measure evolution** | `OT4ML/sections/dynamic-ot.tex:21`–`:94` | Define a narrowly continuous curve `alpha_t`, velocity `v_t`, distributional equation `partial_t alpha_t+div(alpha_t v_t)=0`, endpoint conditions, and no-flux convention. |
| P1 | **Benamou–Brenier action** | `OT4ML/sections/dynamic-ot.tex:213` | Define the kinetic action of an admissible pair before stating that its minimum equals `W_2^2`. Equality with static OT remains the Benamou–Brenier theorem. |
| P1 | **Perspective action on density–momentum measures** | `OT4ML/sections/dynamic-ot.tex:270`, Eqs. around `:275`–`:296` | Define the pointwise perspective `J(a,m)`, its lower-semicontinuous extension at `a=0`, and the measure functional using a dominating reference measure. Convexity and reference-measure independence remain propositions. |
| P1 | **Generalized dynamic action distance** | `OT4ML/sections/dynamic-ot.tex:570`, Eq. around `:659` | Define the path action `mathbb A(alpha,w)` and induced length/energy distance `D_A(alpha_0,alpha_1)` with `t in [0,1]` and velocities `v_t`. This should be the anchor definition for the whole section. |
| P1 | **Concave-mobility dynamic distance** | `OT4ML/sections/dynamic-ot.tex:851`, Eqs. around `:859`–`:899` | Define the mobility `theta`, pointwise momentum action, effective domain, reference measure, and `W_theta`. Convexity/metric properties remain propositions. |
| P1 | **Dynamic spectral Wasserstein distance** | `OT4ML/sections/dynamic-ot.tex:922`, Eqs. around `:934`–`:940` | Define the spectral tangent action and induced dynamic distance using the global action notation already established. Static/dynamic equivalence remains a proposition. |
| P1 | **Kernelized Benamou–Brenier distance** | `OT4ML/sections/dynamic-ot.tex:1043`, Eqs. around `:1054`–`:1067` | Define the vector-valued RKHS velocity class, alpha-independent action, induced extended distance, and finite-action component convention. |
| P1 | **Logarithmic mean** | `OT4ML/sections/dynamic-ot.tex:1124`, Eq. `eq-logarithmic-mean` | Box the two-variable mean, its diagonal and lower-semicontinuous boundary values, and the chain-rule identity `theta(a,b)(log a-log b)=a-b`. It is the shared mobility used by both continuum jump and Markov-chain geometries. |
| P1 | **Continuum nonlocal Wasserstein distance** | `OT4ML/sections/dynamic-ot.tex:1135`, Eqs. around `:1143`–`:1176` | Define the reversible pair measure, nonlocal gradient/divergence, logarithmic-mean mobility action, continuity equation, and induced distance as one coherent box. |
| P1 | **Discrete Markov-chain Wasserstein distance** | `OT4ML/sections/dynamic-ot.tex:1289`, Eqs. around `:1303`–`:1343` | Define reversible chain, relative densities, edge flux/action, discrete continuity equation, and distance between `a_0,a_1`. Use the same notation as the continuum nonlocal box. |
| P1 | **Dynamic unbalanced / WFR distance** | `OT4ML/sections/dynamic-ot.tex:1435`, Eqs. around `:1463`–`:1515` | Define the balance equation, vector velocity and scalar growth field, three-variable local action/perspective, and endpoint distance. Static/dynamic equivalence remains a proposition. |
| P1 | **Variational mean-field-game planning problem** | `OT4ML/sections/dynamic-ot.tex:1610`, Eq. around `:1644` | Define the planning functional, initial/terminal constraints or terminal cost, congestion energy, and continuity equation. Convexity in momentum variables and the optimality system remain exposition/results. |

## Chapter 14: Wasserstein Gradient Flows

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P1 | **First variation of a functional on measures** | `OT4ML/sections/wasserstein-gradient-flows.tex:54`, before Definition `def-wasserstein-gradient` | Define `delta f(alpha)` through directional variations, including the additive-constant convention. The existing Wasserstein-gradient box can then refer to it cleanly. |
| P1 | **JKO minimizing movement** | `OT4ML/sections/wasserstein-gradient-flows.tex:130` | Define the implicit step `alpha^{k+1} in argmin ...`, interpolation in time, and the term minimizing movement. The limiting PDE is not part of the definition. |
| P1 | **Metric derivative and absolutely continuous curve** | `OT4ML/sections/wasserstein-gradient-flows.tex:167`, Eq. around `:176` | Define `|dot alpha_t|`, `AC^p` curves, and the `W_2` specialization. |
| P1 | **Metric slope, strong upper gradient, and curve of maximal slope** | `OT4ML/sections/wasserstein-gradient-flows.tex:182` | Box the descending slope, the strong-upper-gradient property, and the energy-dissipation inequality. These three notions form one metric-gradient-flow definition block and are repeatedly invoked in convergence discussions. |
| P2 | **Score function** | first explicit use at `OT4ML/sections/wasserstein-gradient-flows.tex:277` | Define the score of a positive density `rho` as `nabla log rho` (and the relative score `nabla log(dalpha/dbeta)` when needed). This short box would stabilize terminology reused by Fokker–Planck, diffusion, KDE-particle, and generative-model sections. |
| P1 | **Relative Fisher information and logarithmic Sobolev inequality** | `OT4ML/sections/wasserstein-gradient-flows.tex:1840`, Eqs. `eq-relative-fisher-information` and `eq-general-log-sobolev` | Put the relative information, its lower-semicontinuous `+infinity` convention, and the meaning of an LSI constant in one box. The HWI theorem at `:2272` should refer back to it instead of redefining the information. |
| P1 | **Generalized action gradient flow** | `OT4ML/sections/wasserstein-gradient-flows.tex:2587`, before the existing PMO box | Define the JKO step associated with the dynamic distance from Chapter 13 and its formal continuity-equation limit. The existing PMO definition then gives its local velocity rule. |

## Chapter 15: Generative Models via Transportation

| Priority | Proposed definition | Current location | Proposed scope |
|---|---|---|---|
| P1 | **Deterministic interpolant** | `OT4ML/sections/transportation-models.tex:46` | Define a measurable `I_t(x_0,x_1)`, endpoint conditions, coupling-induced law `alpha_t`, and pathwise velocity. Avoid calling this stochastic unless an auxiliary random input is present. |
| P1 | **Stochastic interpolant** | `OT4ML/sections/transportation-models.tex:215` | Promote the static-noise construction from a remark to a definition, or add a definition inside the remark: `I_t(X_0,X_1,Z)` with endpoint constraints and independent auxiliary noise. |
| P1 | **Mean-field attention map** | `OT4ML/sections/transportation-models.tex:1290`–`:1325` | Define `Gamma_theta[alpha]` and the induced measure map/update. This should be the target of the earlier measure-to-measure-map section’s forward reference. |
| P2 | **Gaussian projection** | `OT4ML/sections/transportation-models.tex:2542`, Eq. around `:2554` | Define `GaussProj(alpha)=N(m_alpha,Sigma_alpha)` and its domain. Contractivity/optimality properties remain propositions. |
