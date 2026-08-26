# Second-pass adversarial audit of Chapter 11: Generalized Wasserstein Distances

Audit date: 2026-08-26
Authoritative source: `OT4ML/sections/generalized-wasserstein.tex`
Audit mode: complete independent reread followed by adversarial refinement of the pass-one report, then implementation and verification of every retained correction

## Correction implementation

All 13 retained findings were corrected on 2026-08-26. The original diagnoses below are preserved as an audit trail; this table records their dispositions in the manuscript and reproducibility sources.

| Finding | Status | Implemented correction |
|---|---|---|
| `C11-MAJ-01` | **Resolved** | Replaced the unsupported large-penalty claim by an explicit compact-space Gamma-convergence statement in the weak topology. The entropy zero set is now required to be `{1}`, the marginal divergences are assumed weakly lower semicontinuous with weakly compact sublevels, and equicoercivity, value convergence, and convergence of minimizers are stated separately. |
| `C11-MAJ-02` | **Resolved** | Defined the homogeneous local cost as the lower-semicontinuous envelope of the raw positive-quadrant perspective, allowed extended costs `c=+infinity`, and stated the recession-axis values and cone-apex value. The KL specialization now explicitly gives the finite creation/destruction costs on both axes. The proof delegates the constraint-preserving boundary relaxation to the precise Liero--Mielke--Savare homogeneous-reformulation theorems rather than using an unjustified positive-weight perturbation. |
| `C11-MOD-01` | **Resolved** | Added a checkable compact-metric duality regime: finite continuous cost, finite Radon inputs, explicit entropy coercivity alternatives, finite primal feasibility, and potential spaces `C(X)` and `C(Y)`. The proof now identifies the entropy-transport duality theorem used for the minimax exchange, and the entropic dual uses the same potential spaces. |
| `C11-MOD-02` | **Resolved** | Identified the intrinsic length metric of `GHK_tau` as `WFR_{sqrt(tau)/2}` in the dynamic convention of the book, with the radial coefficient and angular scaling stated explicitly. |
| `C11-MOD-03` | **Resolved** | Strengthened the vector-quantile reference law to an absolutely continuous `gamma in P_2(R^d)`, making the Brenier problem and LOT `L^2(gamma)` coordinates well defined. |
| `C11-MOD-04` | **Resolved** | Restored the Paty-Cuturi terminology throughout: `PRW_{2,k}` is the max-min projection-robust value and `SRW_{2,k}` is the min-max Ky Fan value. Added the `PRW` macro and corrected the notation table and comparison proposition. |
| `C11-MOD-05` | **Resolved** | Rebuilt the Procrustes experiment so every displayed state is a rigid transform of the original source. Rotation damping is performed on `SO(2)` and translation damping is linear; the text and caption now clearly distinguish this pose-damped continuation from the exact block update. |
| `C11-MOD-06` | **Resolved** | Rebuilt the spectral figure from one common pair of discrete supports. Each interpolation row is now the exact weighted displacement pushforward of the corresponding full computed plan, with no nearest-cell lift or endpoint substitution, and every panel uses one fixed spatial frame. The coupling panels intentionally show only the largest positive plan entries. |
| `C11-MIN-01` | **Resolved** | Called the Radon-field construction a pseudometric before quotienting and stated that it becomes a metric only modulo equality in almost every direction. |
| `C11-MIN-02` | **Resolved** | Replaced “displacement covariance/variance” by “displacement second-moment matrix/mean squared projected displacement” in the chapter, figure prose, notebook gallery, and index material. |
| `C11-MIN-03` | **Resolved** | Replaced the unconverged, floored primal solve by a Fenchel-dual first-order solver for KL, Burg, and differentiably smoothed TV. Removed the artificial plan floor and added solver-success and marginal first-order-residual checks before export. |
| `C11-MIN-04` | **Resolved** | Disclosed in the LOT-MNIST prose and caption that all transport computations use a `0.020` positive pixel background and entropic parameter `0.004`; the notebook description now says the same. |
| `C11-MIN-05` | **Resolved** | Removed the unsupported claims about clipping amplitudes and inverting a Jacobian from the 1D LOT-PCA notebook. Its description now matches the actual arbitrary pushforward, weighted histogram, and display-smoothing implementation. |

The mathematical changes are concentrated in `OT4ML/sections/generalized-wasserstein.tex`, with notation support in `OT4ML/notations_ot.sty` and `OT4ML/sections/notation-table.tex`. The corrected experiments are in the corresponding notebooks under `notebooks-figures/`.

### Second correction check

A further source-level and numerical pass was completed after the first implementation. It made the following refinements.

- The large-penalty statement now names the weak topology, states equicoercivity, and records the liminf and recovery-sequence mechanism behind the Gamma-limit.
- The dual and homogeneous formulations now require a finite primal competitor. The two coercivity alternatives are grammatically separated so that feasibility applies to both.
- The homogeneous proof no longer claims that zero semi-coupling weights can be perturbed while preserving the marginal constraints. It proves only the positive-weight perspective mechanism directly and invokes the constraint-preserving lower-semicontinuous relaxation of Liero--Mielke--Savare for boundary weights, singular mass, and infinite costs.
- Projection-robust and subspace-robust Wasserstein are now defined together as the max--min and min--max values. The forward reference and notation table point to this joint definition.
- The spectral caption distinguishes the full plan used for displacement interpolation from the sparse edge subset displayed in the coupling panels.
- Hidden control characters caused by malformed JSON escapes in `unbalanced-divergence-choice.ipynb` were removed. The notebook was re-executed successfully, and all Chapter 11 notebooks involved in the corrections were checked for malformed source controls and retained execution errors.

## Findings (pre-correction)

### Severity summary

| Severity | Count |
|---|---:|
| Critical | 0 |
| Major | 2 |
| Moderate | 6 |
| Minor | 5 |
| **Total** | **13** |

At audit time, no Critical defect was found. The two Major defects concerned the stated general entropy class: one invalidated the advertised balanced limit, and the other left the homogeneous/cone construction incorrectly defined on precisely the cone axes it must use.

## Critical findings

None.

## Major findings

### C11-MAJ-01: The large-penalty balanced limit is false for the admitted entropy class

- **Physical source lines:** 32 and 40-52, especially line 52.
- **Current claim:** Definition 11.1 admits every proper lower-semicontinuous convex `psi_s:[0,+infinity)->[0,+infinity]` with `psi_s(1)=0`. The prose then says that, whenever hard marginal constraints are feasible, `UW_{c,tau}` approaches balanced OT as `tau` increases.
- **Diagnosis:** The hypotheses do not require the divergence to distinguish its reference measure. Take `X=Y=R`, `alpha=delta_0`, `beta=delta_1`, `c(x,y)=|x-y|^2`, and `bar psi_1=bar psi_2=0`. These entropy functions satisfy every condition in line 32. For every `tau`, the zero plan is admissible and has value zero, so `UW_{c,tau}(alpha,beta)=0`. The feasible balanced value is `W_2^2(delta_0,delta_1)=1`. Thus even convergence of values fails, not merely convergence of minimizers. More generally, any entropy with a zero set larger than `{1}` can retain non-balanced zero-penalty marginals as `tau -> infinity`.
- **Falsification attempt:** The counterexample is not excluded by properness: the constant-zero function is proper in convex analysis. It is lower semicontinuous, convex, nonnegative, and vanishes at one. Feasibility also holds because the two measures have equal mass.
- **Minimal repair:** Either narrow Definition 11.1 globally or qualify the sentence. A safe compact-space version is: require `bar psi_s(t)=0 iff t=1`, weak lower semicontinuity of the induced divergences, and equicoercive compact sublevels for the marginal penalties; assume a lower-semicontinuous transport cost and equal finite masses. Then state separately that the functionals Gamma-converge to balanced OT, their values converge, and every cluster point of minimizers is balanced and optimal. If only value convergence is wanted, say so and give the exact hypotheses. Do not infer the limit from `psi_s(1)=0` alone.
- **Downstream impact:** The definition itself remains usable, and the later KL formulas are unaffected because KL has singleton zero set and coercivity. The general explanatory claim and any reader inference that every admitted `phi`-divergence recovers balanced OT are false.
- **Primary source:** The entropy-transport framework imposes explicit coercivity/recession and compactness conditions rather than deriving asymptotics from normalization alone; see Liero, Mielke and Savare, [Optimal Entropy-Transport problems and a new Hellinger-Kantorovich distance](https://iris.unibocconi.it/retrieve/e31e10d4-0f6e-31fb-e053-1705fe0a5b99/Liero-Mielke-Savare18.pdf).

### C11-MAJ-02: The homogeneous cost is not the required lower-semicontinuous perspective on cone axes

- **Physical source lines:** 328-340, 355-401, and 411-476; the contradiction is visible at lines 333, 337, 377-379, 384-385, 401, and 419.
- **Current claim:** The chapter defines
  `L_c(r,s)=c+r psi_1(1/r)+s psi_2(1/s)` with a recession convention and then
  `H_c(r,s)=inf_{theta>0} theta L_c(r/theta,s/theta)`. It says this perspective handles `u=0` or `v=0`, is one-homogeneous, yields the semi-coupling formula, and is equivalent to the original unbalanced cost. The cone example also uses `c=-log cos^2(d wedge pi/2)`, which equals `+infinity` at the cutoff.
- **Diagnosis:** The displayed formula is only the raw interior perspective, not its lower-semicontinuous envelope. For unit KL, `psi(t)=t log t-t+1`, the stated recession convention gives
  `r psi(1/r)=-log r-1+r` for `r>0` and `L_c(0,s)=+infinity`. Consequently the literal infimum over `theta>0` gives `H_c(r,0)=+infinity` for every `r>0`, and also fails to assign the apex value `H_c(0,0)=0`. The closed homogeneous KL cost required later is instead
  `H_c(r,s)=r+s-2 sqrt(rs) exp(-c/2)`,
  so `H_c(r,0)=r`, `H_c(0,s)=s`, and `H_c(0,0)=0`. Those finite axis values are exactly the creation/destruction costs invoked at lines 377-379. The raw definition therefore contradicts its semi-coupling interpretation and does not support the cone apex. In addition, line 329 restricts `c` to finite nonnegative values, while line 419 immediately uses an extended-valued cost at angular cutoff.
- **Falsification attempt:** Choosing a sequence `theta_n downarrow 0` does not repair the literal formula because every term in the infimum is already `+infinity` when one argument of `L` is zero. The missing operation is closure in `(r,s)`, not merely taking an infimum over positive scales. The later phrase "recession conventions cover" cannot override the explicit definition.
- **Minimal repair:** Define `H_c` as the lower-semicontinuous envelope on `[0,+infinity)^2` of the interior homogeneous perspective, with the entropy recession constants and `c in [0,+infinity]` included explicitly. Equivalently, quote the closed perspective definition from Liero-Mielke-Savare and state its axis values. Then restate Proposition 11.5 with the precise hypotheses under which the closed cost is convex/lower semicontinuous and entropy-transport equals the homogeneous semi-coupling problem. In the proof, use measurable near-minimizers before closure and pass to the lower-semicontinuous envelope; do not claim a positive pointwise scale realizes axis costs.
- **Downstream impact:** This is foundational rather than cosmetic. As written, the homogeneous value, the cone lift, the WFR example, the partial-transport cone cost, and the equality theorem are not defined consistently for mass creation/destruction or for the cone apex. The familiar closed formulas can repair all of them without changing their intended results.
- **Primary source:** Definition 5.1 in Liero, Mielke and Savare explicitly takes the lower-semicontinuous envelope and defines the recession/axis extension; see [the primary paper](https://iris.unibocconi.it/retrieve/e31e10d4-0f6e-31fb-e053-1705fe0a5b99/Liero-Mielke-Savare18.pdf).

## Moderate findings

### C11-MOD-01: The two infinite-dimensional duality statements have no checkable analytic hypotheses

- **Physical source lines:** 266-304 and 550-572.
- **Current claim:** Proposition 11.4 states equality with a continuous-potential dual "under the usual Fenchel--Rockafellar qualification assumptions"; the entropically regularized primal is then assigned its dual without any qualification.
- **Diagnosis:** This is not a self-contained theorem because neither the topology on the measure spaces nor the class of potentials is fixed. The proof's exchange of `inf` and `sup` at lines 293-301 is the substantive theorem, not an algebraic step. For lower-semicontinuous extended costs on noncompact spaces, equality, restriction to continuous potentials, integrability of conjugate terms, and dual attainment require different assumptions. In the primary entropy-transport theorem, the alternatives involve Radon measures, proper lower-semicontinuous costs, superlinear entropies or finite recession slopes coupled to a positive cost lower bound, and compact cost sublevels. Continuous test functions require additional regularity of the spaces. The imported divergence conjugacy at `dual-norms.tex:656` was developed in a compact/continuous setting and cannot silently supply all of these conditions here.
- **Falsification attempt:** The signs are correct. Substituting the conjugate representation gives the constraint `f+g<=c`, and the KL specialization at lines 573-580 is algebraically consistent. The retained defect is therefore the theorem's missing domain and qualification, not a sign error.
- **Minimal repair:** State one explicit version. The shortest pedagogical repair is to assume compact metric `X,Y`, finite continuous `c`, finite Radon inputs, and entropy hypotheses that make the divergence functionals proper and lower semicontinuous, then specify `f in C(X), g in C(Y)`. Alternatively reproduce the full Liero-Mielke-Savare coercive alternatives and say whether dual attainment is claimed. Apply the corresponding assumptions to the entropic dual as well.
- **Downstream impact:** The finite discrete Sinkhorn formulas remain valid. The general continuous primal-dual identity and its use with extended costs are presently unverifiable and can be false if a reader applies them outside an unstated qualification regime.
- **Primary source:** Theorem 4.11 and Corollary 4.12 of [Liero-Mielke-Savare](https://iris.unibocconi.it/retrieve/e31e10d4-0f6e-31fb-e053-1705fe0a5b99/Liero-Mielke-Savare18.pdf) separate value duality from the topological conditions allowing continuous potentials.

### C11-MOD-02: The GHK-to-WFR intrinsic-length statement omits the parameter rescaling

- **Physical source lines:** 724-738, with the imported normalization at `OT4ML/sections/dynamic-ot.tex:1846-1923`.
- **Current claim:** Line 738 says that the intrinsic length metric induced by `GHK_tau` is the Hellinger-Kantorovich/WFR distance represented by the cosine cone cost in the section, and points to the static/dynamic proposition.
- **Diagnosis:** The statement is true only after an explicit scale identification. For two cone atoms, the KL/quadratic homogeneous chord cost is
  `delta_tau^2= tau[r^2+s^2-2rs exp(-|x-y|^2/(2 tau))]`.
  Its local squared line element is `tau dr^2+r^2|dx|^2`. The imported dynamic convention defines
  `WFR_kappa^2=inf integral a(|v|^2+kappa^2 g^2)`
  and its cone line element is `4 kappa^2 dr^2+r^2|dx|^2`; its static cone is
  `4 kappa^2[r^2+s^2-2rs cos((|x-y|/(2 kappa)) wedge pi/2)]`.
  Hence the intrinsic length metric of `GHK_tau` is `WFR_{sqrt(tau)/2}`, not the unparameterized WFR normalization at lines 457-464 unless `tau=1`. The imported text itself says its unscaled Chapter 11 cone corresponds to `kappa=1/2`.
- **Falsification attempt:** No extra global multiplicative factor is missing once `kappa=sqrt(tau)/2`; both radial and spatial infinitesimal coefficients then agree. Thus the issue is exactly the absent parameter map, not failure of the intrinsic-length assertion.
- **Minimal repair:** Replace line 738 by an explicit formula: "the intrinsic length metric induced by `GHK_tau` is `WFR_{sqrt(tau)/2}` in the convention of (dynamic equation), whose cosine cone has prefactor `tau` and angular argument `d/sqrt(tau)`; for `tau=1` this is Definition 11.x." Keep endpoint/chord GHK distinct from its intrinsic length metric.
- **Downstream impact:** Readers comparing the closed Gaussian endpoint formula to dynamic WFR will otherwise use the wrong reaction scale and cutoff distance. The Gaussian endpoint calculations themselves are unaffected.
- **Primary source:** The static/dynamic scale convention is standard in [Liero, Mielke and Savare](https://arxiv.org/abs/1509.00068); the chapter's own imported equations already contain the needed conversion.

### C11-MOD-03: Vector-quantile existence is stated without a finite-moment reference assumption

- **Physical source lines:** 2156-2176.
- **Current claim:** The reference probability `gamma` is assumed only absolutely continuous, while the target `alpha` has finite second moment; the Brenier map is then defined equivalently as the minimizer of quadratic transport from `gamma` to `alpha`.
- **Diagnosis:** Quadratic Brenier theory on `P_2(R^d)` requires both endpoint laws to have finite second moments. Absolute continuity alone does not imply this. For example, take an absolutely continuous heavy-tailed probability `gamma` with `int |x|^2 d gamma=+infinity` and `alpha=delta_0`. Every map pushing `gamma` to `delta_0` is zero almost everywhere, and the displayed objective is `int |x|^2 d gamma=+infinity`; it does not define a finite quadratic optimizer or an `L^2(gamma)` coordinate. The LOT norm introduced immediately afterward is likewise unavailable.
- **Falsification attempt:** The examples named in line 2156 (uniform on a bounded convex body and standard Gaussian) do satisfy the missing condition, but they are examples, not hypotheses. A gradient map may still exist for special heavy-tailed pairs, which does not make the claimed quadratic minimization or LOT geometry well posed in general.
- **Minimal repair:** Assume `gamma in P_2(R^d)` and absolutely continuous; retain `alpha in P_2(R^d)`. If later stability uses compact support or density bounds, state those separately rather than folding them into basic Brenier existence.
- **Downstream impact:** Without this repair, the vector quantile, the LOT embedding in `L^2(gamma)`, and PCA coordinates can be infinite or undefined. The finite empirical and Gaussian examples are unaffected.
- **Primary source:** The standard finite-cost formulation is Brenier's theorem on quadratic Wasserstein space; the chapter's cited LOT stability result also works under substantially stronger compact-support/density assumptions, [Merigot et al.](https://proceedings.mlr.press/v108/merigot20a.html).

### C11-MOD-04: The later spectral section assigns Paty-Cuturi's SRW name to their PRW quantity

- **Physical source lines:** 1553-1559 and 2521-2572.
- **Current claim:** Lines 1556-1559 correctly call the maximum over `k`-dimensional projected Wasserstein distances projection-robust Wasserstein. Lines 2521-2535 later call exactly that same max-projection formula the "Paty--Cuturi subspace robust Wasserstein distance" and denote it `SRW_{2,k}`. The Ky Fan min-coupling value is left under the chapter's generic spectral notation.
- **Diagnosis:** This is a one-sided mislabeling in the later section, not a global interchange of two formulas. In Paty and Cuturi's primary convention, projection robust Wasserstein (PRW) is the max-min quantity
  `sup_U inf_pi int |U^T(x-y)|^2 d pi`,
  whereas subspace robust Wasserstein (SRW) is the min-max/Ky Fan quantity
  `inf_pi sum_{l=1}^k lambda_l(M_pi)`.
  The source formulas and weak-minimax inequality are mathematically correct, but the symbol/name at lines 2524-2533 assigns SRW to PRW. It also conflicts internally with line 1557.
- **Falsification attempt:** This is not an alternate harmless expansion of the acronym because the text explicitly attributes the name to Paty-Cuturi and discusses their two constructions. The inequality currently proved is precisely `PRW_{2,k} <= SRW_{2,k}` in their notation.
- **Minimal repair:** Rename the max-projection quantity at lines 2521-2535 to `PRW_{2,k}`. Identify `W_{gamma_k}` with Paty-Cuturi's `SRW_{2,k}` and retitle the proposition as the PRW/SRW comparison. If chapter-local notation must be preserved, explicitly flag it as nonstandard and remove the primary-source attribution.
- **Downstream impact:** Numerical values and inequalities do not change. The defect is nomenclature, but it assigns a primary-paper name and symbol to the wrong variational quantity, so literature searches and cross-paper comparisons are materially misleading.
- **Primary source:** Paty and Cuturi, [Subspace Robust Wasserstein Distances](https://proceedings.mlr.press/v97/paty19a.html).

### C11-MOD-05: The Procrustes figure is generated by a non-rigid damped state that also drives subsequent assignments

- **Physical source lines:** 2132-2146, especially the caption's final sentence.
- **Current claim:** The caption says each step solves an assignment and then applies the closed-form rigid update; damping is "displayed" only, while the underlying update is Algorithm 11.2's block-coordinate method.
- **Diagnosis:** The generating notebook `notebooks-figures/wasserstein-procrustes-rigid-motion.ipynb` uses `damping=0.30` and updates
  `Xcur=(1-damping) Xcur+damping Xfull`.
  The next iteration computes its assignment from this damped `Xcur`, so damping changes the optimization path rather than merely the display. Moreover, in two dimensions a nontrivial convex blend `(1-d)I+d R_theta` satisfies
  `A^T A=[(1-d)^2+d^2+2d(1-d)cos theta] I`,
  whose scalar is strictly below one for `0<d<1` and nonzero `theta`. Thus the displayed intermediate source is a contracted similarity, not a rigid motion in `SE(2)`. The notebook does compute each full Procrustes candidate from the original `X0`, but it does not feed that full rigid pose directly into the next assignment as Algorithm 11.2 does.
- **Falsification attempt:** Damping translation alone would preserve rigidity, and interpolation of the rotation angle would also preserve rigidity. The implemented Euclidean blend of point positions/rotation matrices does neither; direct code inspection rules out the caption's "display only" interpretation.
- **Minimal repair:** Either label the panels as a damped fixed-point heuristic and say damping affects assignments, or generate the panels with the exact block-coordinate iterates. If a visible gradual path is needed, damp translation linearly and interpolate rotations on `SO(2)` (or via a matrix logarithm/geodesic), then clearly distinguish that heuristic from the exact algorithm.
- **Downstream impact:** The theorem and algorithm remain correct. The figure is not evidence for the stated algorithm and temporarily leaves the quotient rigid-motion orbit.
- **Primary source:** The classical rigid block update is the orthogonal Procrustes step; the chapter cites Besl-McKay for the alternating-registration context.

### C11-MOD-06: The spectral "corresponding displacement interpolations" are not pushforwards of the displayed or computed discrete plans

- **Physical source lines:** 2579-2616, especially lines 2579 and 2608.
- **Current claim:** The text says the figure compares selected plans and "the displacement interpolations they induce"; the caption calls the last two rows the corresponding displacement interpolations.
- **Diagnosis:** The notebook uses three incompatible discretization levels. Coupling panels use 84-point trace OT and 68-point spectral OT with 42 directions. Density rows use a separate 4,800-point trace assignment and a separate 640-point spectral LP with 64 directions. Those dense discrete plans are then not pushed forward directly. Instead, 70,000 independently sampled source pixels are assigned to nearest source sites; each plan row is normalized and sampled without correcting for unequal source Voronoi-cell masses; targets are sampled from nearest-target cells. Consequently the lifted coupling generally has neither the equal-weight discrete source marginal nor the intended target silhouette marginal. At `t=1`, the function bypasses the lift and abruptly returns the exact independent target sample cloud. Each density panel is also cropped around its own transported shape, weakening visual comparison.
- **Quantitative check:** Reconstructing the notebook's fixed seeds and cell assignment gives, for the 4,800-site trace lift, source-cell masses from `4.2857e-5` to `5.1429e-4` (standard deviation `6.791e-5`) and target-cell masses from `4.2857e-5` to `4.8571e-4` (standard deviation `6.107e-5`), rather than uniform `1/4800`. Even under the best permutation of those cell masses, the unavoidable target total-variation mismatch is at least `0.0138`; their total-variation distances from uniform are `0.1300` and `0.1163`. The analogous 640-site construction has a best-permutation mismatch at least `0.00597`. These are marginal defects, not just KDE smoothing.
- **Falsification attempt:** Separate higher-resolution plans can legitimately illustrate the same geometry if disclosed. That does not cure the stronger claim that the rows are induced by the displayed plans, nor the incorrect marginals in the cell lift. KDE bandwidth and Monte Carlo noise also cannot repair a biased coupling.
- **Minimal repair:** Use the exact discrete displacement interpolation `((1-t)p_1+t p_2)_# pi` with coupling weights, optionally KDE-smoothed afterward. If a silhouette-preserving lift is desired, compute weighted source/target cells and a coupling whose marginals equal those cell weights, or resample cells with explicit mass corrections. Use one plan per gauge across the plan and interpolation panels, or disclose separate resolutions/direction counts. Keep a common spatial frame and do not hard-switch the endpoint.
- **Downstream impact:** The spectral metric theorem is unaffected, but the figure cannot support claims about its geodesics, plans, or induced interpolation. It may visually attribute artifacts from marginal bias, resolution, clipping, and changing crops to the gauge.
- **Primary source:** The plan-level distinction between projected max-min transport and Ky Fan min-max transport is described in [Paty-Cuturi](https://proceedings.mlr.press/v97/paty19a.html); neither construction licenses changing a coupling's marginals during visualization.

## Minor findings

### C11-MIN-01: The Radon field formula is a pseudometric before quotienting null directions

- **Physical source lines:** 1147-1186, especially 1165-1186.
- **Current claim:** The pullback construction calls the integrated fiber distance `d_Rad` a metric on fields `theta -> mu_theta`.
- **Diagnosis:** If two measurable fields differ only on a set of sphere measure zero, their displayed integral distance is zero although the pointwise fields are distinct. It is a genuine metric only on equivalence classes modulo `sigma`-almost-everywhere equality; otherwise it is a pseudometric. The actual Radon transforms of probability measures are separated by Cramer-Wold, so the induced sliced metric on measures remains definite.
- **Falsification attempt:** Continuity of the special field `theta -> (P_theta)_# alpha` can identify a canonical representative, but the text first states the construction for general fields. The null-set counterexample applies at that level.
- **Minimal repair:** Say "pseudometric on measurable fields, and metric on their `sigma`-a.e. equivalence classes" before taking the Radon pullback.
- **Downstream impact:** No sliced-Wasserstein formula changes. This only corrects the ambient pullback-space statement.

### C11-MIN-02: `M_pi` is an uncentered second moment, not a covariance or variance

- **Physical source lines:** 2373-2381, 2394-2395, 2414-2430, and 2608-2610.
- **Current claim:** The matrix `M_pi=int(x-y)(x-y)^T d pi` is repeatedly called a displacement covariance, and `lambda_max(M_pi)` is described as worst projected displacement variance.
- **Diagnosis:** A covariance centers the displacement by its mean. Here, for `alpha=delta_a`, `beta=delta_0`, the displacement is deterministic, so its covariance is zero, while `M_pi=aa^T` and `lambda_max(M_pi)=|a|^2`. The formula intentionally needs the uncentered second moment: centering would destroy definiteness under translations.
- **Falsification attempt:** Some OT papers use "displacement covariance" informally for this matrix, but the statistical term and the caption's "variance" are mathematically inaccurate. The formulas themselves are correct and should not be centered.
- **Minimal repair:** Replace "displacement covariance" by "displacement second-moment matrix" and "variance" by "mean squared projected displacement" throughout this section and caption.
- **Downstream impact:** Terminology only. Centering the formula would be a harmful repair; renaming is the correct fix.

### C11-MIN-03: The divergence-choice figure does not compute exact TV and does not validate solver success

- **Physical source lines:** 188-204.
- **Current claim:** The prose says only the marginal divergence changes and labels the third panel total variation.
- **Diagnosis:** The notebook uses the smooth surrogate
  `sum(sqrt((r-a)^2+10^{-8})-10^{-4})`,
  imposes a strict plan floor `P_ij>=10^{-14}`, and solves all cases by L-BFGS-B. It returns `result.x` without checking `result.success`, stationarity, or an objective gap. The notebook markdown acknowledges a "small smooth approximation," but the book caption does not. The fixed floor also prevents exact zeros, precisely the active-set behavior attributed to TV.
- **Falsification attempt:** The smoothing scale is small and the retained outputs contain no exception; this makes the picture plausible, not an exact TV solution. No theorem depends on the panel, so Minor is proportionate.
- **Minimal repair:** Say "smoothed TV approximation" in the caption and disclose the positive floor, or solve the exact convex nonsmooth problem. Assert solver success and report marginal/objective residuals before exporting.
- **Downstream impact:** Numerical/caption provenance only; the TV partial-transport identities later in the chapter are exact and independently valid.

### C11-MIN-04: The MNIST LOT computation uses background-regularized images, not the original densities

- **Physical source lines:** 2332-2358, especially the caption at line 2358.
- **Current claim:** The caption says the underlying transport computations "still use the original densities."
- **Diagnosis:** The notebook loads digit-zero arrays and then sets `background=0.020`, computes `images=images_raw+background`, renormalizes, and uses those modified images for the Sinkhorn barycenter, every coupling, every barycentric projection, and PCA. On a 28-by-28 image this adds total raw background mass `15.68` before normalization, so it is not merely a plotting epsilon. Display normalization is a separate percentile/clipping operation.
- **Falsification attempt:** "Original densities" cannot reasonably mean the regularized arrays because the notebook explicitly names the pre-background arrays `images_raw`. The added background may be numerically sensible but must be disclosed.
- **Minimal repair:** Replace the caption sentence with "the computations use densities regularized by adding 0.020 to every pixel before normalization" (and, ideally, state the entropic regularization `0.004`). Alternatively remove the background from the computation and use stabilization confined to the solver.
- **Downstream impact:** The illustration remains qualitative, but stroke-thickness and background modes may partly reflect preprocessing. The abstract LOT/PCA construction is unaffected.

### C11-MIN-05: The 1D LOT-PCA notebook claims clipping and Jacobian inversion that its code does not perform

- **Physical source lines:** 2312-2325; generating notebook `notebooks-figures/linear-ot-1d-pca.ipynb`, Markdown cell 5 and code cells 6 and 8.
- **Current claim:** The notebook says that each display amplitude is clipped so every map `Qbar+a e_k` remains increasing and that densities are reconstructed from `rho(Q(u))=1/Q'(u)`, with only mild display smoothing. The chapter itself is more careful: line 2325 says extreme displayed maps need not remain monotone and defines the panels as pushforwards.
- **Diagnosis:** No monotonicity clipping is implemented. The code sets `amplitudes = [1.65,1.65,4.00] * score_span`, forms `q=Qbar+a*modes[k]`, and reconstructs its pushforward with a weighted histogram followed by Gaussian filtering. Re-running the retained seed and discretization gives display amplitudes `(0.585,0.333,0.454)`. All nine maps in modes 1 and 2 are increasing, but eight of the nine mode-3 maps have a negative minimum grid increment; the extrema range from `-0.6312` to `-0.0741`, while only the midpoint has positive minimum increment `8.92e-5`. For a nonmonotone map the single-branch formula `rho(Q)=1/Q'` is not valid; a pushforward density instead sums contributions over all preimages. The histogram code correctly approximates that pushforward, but it is not the method described in the notebook.
- **Falsification attempt:** The only `np.clip` in the data/PCA cells clips mixture weights, not excursion amplitudes or quantile maps. The conflicting sentence immediately above the false notebook paragraph and the book caption both acknowledge nonmonotonicity, so the defect is confined to retained notebook documentation rather than the displayed chapter claim or the generated probability laws.
- **Minimal repair:** Delete the clipping and inverse-Jacobian sentence from notebook cell 5 and state that arbitrary map pushforwards are approximated by weighted histograms and Gaussian display smoothing. Alternatively implement an explicit monotonicity bound and then use a correctly discretized monotone change-of-variables formula.
- **Downstream impact:** Reproducibility/provenance only. The generated mode-3 panels are valid pushforward probability densities, and the chapter's warning at line 2325 is correct.

## Scope, method, and falsification policy

I read all 2,719 physical source lines in order, then read every locally imported definition/result at its defining location. I separately extracted and checked all environments, displays, labels, references, citation keys, figure calls, notebook metadata, code cells, retained outputs, and included PDF assets. The second pass repeated the mathematical derivations rather than treating the pass-one ledger as established. Algebraic claims were rederived on paper or with bounded in-memory finite-dimensional checks. Numerical findings were retained only when the current notebook code, not merely appearance, established the discrepancy.

The preserved older audit was not opened until this independent source reading, derivation pass, counterexample search, notebook inspection, visual asset inspection, finding ledger, and validated-correct ledger were substantially complete. It was then used only as a hypothesis list; the reconciliation appears near the end of this report.

Severity means:

- **Critical:** invalidates a central result or broad chapter architecture with no local repair.
- **Major:** a central definition/theorem is false or ill-defined under its stated assumptions, but a known local mathematical repair exists.
- **Moderate:** a meaningful theorem-domain, normalization, nomenclature, or numerical-provenance defect that can mislead use of the result.
- **Minor:** a localized terminology, caption, or reproducibility defect that does not alter the chapter's principal mathematics.

An optional strengthening, an omitted proof detail that is genuinely standard under explicit existing assumptions, or an open research question was not promoted to a finding.

## Rejected and narrowed candidates

| Candidate | Disposition | Reason |
|---|---|---|
| Finite-WFR Gaussian nonclosure is unproved | Rejected as a defect | Lines 868-884 explicitly exhibit the **pure Hellinger endpoint** and do not claim that the three-Gaussian formula is a finite-`kappa` WFR geodesic. The endpoint calculation is correct. A finite-`kappa` example or citation would strengthen exposition but is not needed to make the stated endpoint claim true. |
| Min-SW triangle counterexample is based on a coarse angular grid | Rejected | Exact event-line enumeration reproduces all attainable permutations and the three values `51/16`, `51/16`, and `63/4`. The 91-direction notebook sweep happens to hit the exact minimizing cell, but the source proof does not rely on that grid. |
| Min-SW should be below ordinary SW or Max-SW | Rejected | There is no such general ordering. Min-SW minimizes ambient costs of constrained lifted plans and always satisfies `W_2<=MinSW`; ordinary SW minimizes projected costs. They are different variational objects. |
| Gaussian Min-SW proof has a zero projected direction | Rejected | A positive-definite Gaussian Brenier matrix has a positive eigenvalue in every eigenvector direction. Along such an eigenvector the projected affine relation has positive slope, so the optimal Gaussian coupling is a compatible monotone lift. |
| Unexecuted partial-OT notebook invalidates its figures | Narrowed to provenance note | `partial-ot-active-mass.ipynb` has no retained execution counts, and `partial-ot-shape-active-mass.ipynb` has execution gaps. The code and assets are coherent, and no mathematical mismatch was demonstrated; this is reproducibility debt, not a theorem defect. |
| Sliced projection side profiles are normalized independently | Optional disclosure only | The notebook rescales smoothed one-dimensional profiles for display. The caption calls them density estimates and makes no quantitative area comparison, so this is a plotting convention rather than a retained error. |
| Spectral matrix should be centered | Rejected repair | Centering would make translations invisible and destroy definiteness. C11-MIN-02 requires renaming the existing second moment, not changing it. |
| Cone endpoint issue can be fixed by a recession phrase alone | Rejected | The literal positive-scale infimum remains infinite on a KL axis. The lower-semicontinuous closure must be part of the definition, as retained in C11-MAJ-02. |

## Validated-correct ledger

The following 56 items were targeted because they are mathematically consequential, normalization-sensitive, or easy to misstate. "Validated" means the current claim survived an independent derivation under its stated assumptions, except where the ledger explicitly says it is the intended closed version repaired by a finding.

### Unbalanced, conic, Gaussian, and partial OT

| ID | Source lines | Validated claim and check |
|---|---:|---|
| V11-001 | 54-85 | The relaxed-marginal reformulation is exact: fixing `tilde alpha=pi_1`, `tilde beta=pi_2` with common mass leaves precisely the finite-mass balanced Kantorovich value, and conversely an optimal coupling of any relaxed pair is feasible for the original infimum. |
| V11-002 | 92-143 | The KL mass-shape identity is exact: `KL(M mu ; A nu)=M KL(mu ; nu)+M log(M/A)-M+A`, including extended-value cases for normalized probability shapes. |
| V11-003 | 94-143 | Differentiating the scalar objective gives `log M=(tau_0 log A+tau_1 log B-E)/(tau_0+tau_1)`. Substitution yields the constants, signs, weighted geometric mean, and exponential in equations 11.4-11.5 exactly. |
| V11-004 | 92-143 | The proposition deliberately assumes `A,B>0`. Outside that scope, the correct degenerate values are consistent with the primal: if `A=0<B`, the only finite-KL first marginal is zero and the value is `tau_1 B`; symmetrically it is `tau_0 A`; both zero gives zero. No contradiction was retained. |
| V11-005 | 209-264 | The small-transport-scale proposition is valid under its explicit compactness/lower-semicontinuity/compact-sublevel assumptions. Dividing by `tau`, tightness of relaxed marginals and concentration of transport on the diagonal yield the common-measure envelope. |
| V11-006 | 252-264 | For equal KL penalties the scalar envelope is `inf_r [r log(r/a)-r+a+r log(r/b)-r+b]=(sqrt(a)-sqrt(b))^2`, with minimizer `sqrt(ab)`. This is the squared Hellinger density formula with the chapter's normalization. |
| V11-007 | 266-304 | Conditional on proper duality hypotheses, all dual signs are correct: divergence conjugacy is evaluated at `-f,-g`, and minimizing the nonnegative plan imposes `f+g<=c`. C11-MOD-01 concerns hypotheses only. |
| V11-008 | 309-325 | The reverse factorization is algebraically correct on mutually absolutely continuous positive parts: `d alpha/d pi_1` and `d pi_1/d alpha` are reciprocal, so integrating `F psi(1/F)` against `pi_1` reproduces the divergence. |
| V11-009 | 328-379 | The **intended closed** unit-KL homogeneous cost is `r+s-2 sqrt(rs)e^{-c/2}`. Direct minimization in the positive interior confirms it; lower-semicontinuous extension supplies the finite axes described in C11-MAJ-02. |
| V11-010 | 411-465 | Substituting KL and `c=-log cos^2(d wedge pi/2)` into the closed homogeneous formula with squared radii gives `r^2+s^2-2rs cos(d wedge pi/2)`, the stated HK cone metric. |
| V11-011 | 424-428 | The Gaussian-kernel cone formula is a metric whenever `e^{-d^2/2}` is positive definite with unit diagonal: the map `(x,r)->r Phi(x)` is an isometric embedding. The chapter correctly states positive definiteness as an extra assumption on general metric spaces. |
| V11-012 | 429-433 | For full TV with `p=1`, direct minimization gives `r+s-(r wedge s)(2-d)_+`; the threshold constant 2 is correct under the chapter's full-TV convention. |
| V11-013 | 550-619 | For KL coupling regularization relative to `alpha tensor beta`, the exponential primal-dual relation and specialized dual exponents are correct. In the discrete algorithm, including `a_i b_j` inside `K` is consistent with that reference measure. |
| V11-014 | 581-619, 700-719 | Solving each KL dual first-order equation gives scaling updates with exponent `omega=tau/(tau+epsilon)`. Because `K` already contains `a_i b_j`, the displayed ratios by `a` and `b` are not double counting. |
| V11-015 | 620-698 | The Gauss-Seidel potential map contracts ordinary sup norm by `omega`: the first component is `omega`-Lipschitz and the second `omega^2`-Lipschitz, so their product maximum is bounded by `omega`. The equivalent scaling metric is Thompson's log metric, not a projective quotient. |
| V11-016 | 750-779 | `D_LD(P ; Sigma)=tr(Sigma^{-1}P)-log det(Sigma^{-1}P)-d` follows exactly from the Bregman divergence of `-log det`; the factors `tau/2` in the Gaussian KL covariance envelope match Gaussian KL. |
| V11-017 | 783-833 | The Riccati relation `L R_beta L=R_alpha`, positive solution, adjusted covariances, and determinant-only value follow from the two stationarity equations. A scalar and noncommuting numerical check confirmed the matrix order and inverse placement. |
| V11-018 | 835-866 | The softened Bures term increases to the hard Bures value, and the GHK endpoint formula has the correct outer factor `tau`, mass factor `2 sqrt(r_0 r_1)`, mean exponent `-1/4 norm(m_0-m_1)^2_{G_tau^{-1}}`, and covariance exponent `-B_tau^2/(2 tau)`. Its equal-mass hard limit is `r W_2^2` as stated. |
| V11-019 | 894-957 | Fixed-mass partial OT, unmatched-mass penalization, and full-TV UOT have the exact relation `lambda(A+B)+min_m[POT_m-2 lambda m]`. Trimming a plan to source/target submeasures cannot increase the nonnegative-cost objective, and the subgradient threshold is `2 lambda`. |
| V11-020 | 961-976 | On the slice where both inputs have total mass `m`, submeasure constraints force equality of marginals. Therefore `POT_m=m W_p(alpha/m,beta/m)^p` and its `p`th root is a metric; outside that slice definiteness correctly fails. |

### Sliced, intrinsic, subspace, and Min-SW geometry

| ID | Source lines | Validated claim and check |
|---|---:|---|
| V11-021 | 1033-1051 | Sliced Wasserstein uses the pushforward by `P_theta(x)=theta.x` and normalized sphere probability measure. There is no missing sphere-area constant. |
| V11-022 | 1057-1103 | Nonnegativity, symmetry, Minkowski's inequality, continuity in direction, and Cramer-Wold establish metricity on `P_p(R^d)`. Equality for almost every direction extends to all Fourier rays by continuity. |
| V11-023 | 1060-1070, 1104-1112 | Projecting any ambient coupling and averaging gives `SW_p^p<=kappa_{d,p} W_p^p`. The beta integral `Gamma(d/2)Gamma((p+1)/2)/(sqrt(pi)Gamma((d+p)/2))` and `kappa_{d,2}=1/d` are correct. |
| V11-024 | 1114-1128 | `SW_p` convergence is equivalent to weak convergence plus `p`th-moment convergence. The projected quantile-field norm controls radial moments via spherical averaging, yielding tightness and moment convergence. |
| V11-025 | 1071-1079, 1133-1141 | Bonnotte's compact-support estimate has the correct homogeneity: `W_p^p<=C R^{p-1/(d+1)} SW_p^{1/(d+1)}` follows from the `W_1` estimate, `W_p^p<=(2R)^{p-1}W_1`, and `SW_1<=SW_p`. |
| V11-026 | 1080-1093, 1139-1141 | The sharp compact `p=1` reverse exponent `1/d`, transferred to general `p`, yields `W_p<=C R^{1-1/(pd)} SW_p^{1/(pd)}`. The chapter correctly restricts the sharpness assertion to `p=1`. |
| V11-027 | 1147-1215 | Apart from the a.e.-quotient wording in C11-MIN-01, the measure-valued Radon transform, its density formula, the pullback identity, and its identification with fixed-base conditional Wasserstein are correct. |
| V11-028 | 1200-1213 | The projected quantile field is an isometric Hilbert embedding for `SW_2`; therefore `exp(-gamma SW_2^2)` is positive definite by the standard Gaussian kernel construction on a Hilbert space. |
| V11-029 | 1247-1300 | For `T_t=Id+t grad phi`, bounded Hessian makes `T_t` a Brenier map for small `abs(t)`; projected admissible couplings and the sphere second moment yield the exact `t^2/d` upper bound. |
| V11-030 | 1302-1331 | On a fixed-weight atomic stratum, diagonal ambient and projected matchings persist away from finitely many tie directions. Dominated convergence gives the local equality `speed_SW^2=(1/d) sum a_i norm(v_i)^2`. |
| V11-031 | 1333-1359 | For a Gaussian linear perturbation `Id+tA`, the sliced coefficient is `[tr(A)^2+2tr(A^2)]/[d(d+2)]`; Cauchy-Schwarz makes it strictly below `tr(A^2)/d` exactly when symmetric `A` is non-scalar. |
| V11-032 | 1361-1405 | For `d>=2`, `SW_2` is not a length distance. The intrinsic metric definition, a.e. metric derivative, attainment/geodesicity result, and bounds `SW_2<=ell_SW2<=W_2/sqrt(d)` agree with Park-Slepcev. The Gaussian example legitimately makes the upper inequality locally strict. |
| V11-033 | 1415-1457 | Projecting possibly singular Gaussians gives one-dimensional variances `theta^T Sigma theta`; integrating the one-dimensional formula produces the displayed mean factor `1/d` and covariance integral, including Dirac/singular endpoints. |
| V11-034 | 1465-1498 | Proportional-covariance and rank-one formulas are correct. In the rank-one case, the spherical expectation of `abs(theta.u) abs(theta.v)` is `(2/(pi d))[sqrt(1-chi^2)+chi asin chi]`, giving the chapter's `4ab/(pi d)` cross term. |
| V11-035 | 1514-1571 | The `L^q`, max, and `k`-subspace definitions use normalized Haar/Stiefel measure; `k=d` reduces to `W_p`, the supremum is attained, and right multiplication by `O(k)` confirms dependence only on the subspace. |
| V11-036 | 1581-1700 | Monotonicity in `q` and `k`, all endpoint cases, and the constant `kappa_{d,k,p}=Gamma(d/2)Gamma((k+p)/2)/(Gamma(k/2)Gamma((d+p)/2))` follow from random projection moments. In particular `kappa_{d,k,2}=k/d`. |
| V11-037 | 1702-1752 | Every finite-`q` and max-subspace variant metrizes the `W_p` topology. The radial moment lower bound, compact Stiefel equicontinuity, and reduction to all one-dimensional projections close the potentially delicate `q<p` case. |
| V11-038 | 1759-1909 | The measure-level Min-SW constrained-lift definition is nonempty and representation invariant; every admissible lift is an ambient coupling, hence `W_2<=MinSW`. Exact enumeration validates the triangle failure values `51/16`, `51/16`, and `63/4`, and the Gaussian-quantization argument validates failure of `W_2` topology in every `d>=2`. |
| V11-039 | 1911-1940 | For nondegenerate Gaussians, choosing an eigenvector of the positive-definite Brenier matrix makes the projected optimal coupling monotone. Thus the ambient Gaussian optimum is an admissible lift and `MinSW=W_2`; the chapter correctly limits the fixed-cardinality weak-topology statement. |

### Quotient Wasserstein, Procrustes, vector quantiles, and LOT

| ID | Source lines | Validated claim and check |
|---|---:|---|
| V11-040 | 1973-2003 | An isometric group action gives the one-group-variable formula and a quotient pseudometric. Attainment separates orbits; continuous compact-group actions attain the infimum. The caveat about identifying zero-distance orbits without attainment is correct. |
| V11-041 | 2013-2092 | In Wasserstein-Procrustes, optimizing translation aligns means. With `M_P=sum P_ij(y_j-ybar)(x_i-xbar)^T`, maximizing `tr(R^T M_P)` gives `R=UV^T`; the determinant correction for `SO(d)` and translation formula are correct. |
| V11-042 | 2040-2130 | The written alternating algorithm performs exact minimization in each block and therefore is a legitimate nonconvex descent heuristic; the text correctly avoids claiming global convergence. C11-MOD-05 concerns only the figure's different damped implementation. |
| V11-043 | 2186-2205, 2243-2257 | The LOT coupling `(T_alpha,T_beta)_# gamma` proves `W_2<=LOT_gamma`; setting one target to `gamma` gives equality. Both normalization and inequality direction are correct. |
| V11-044 | 2189-2205 | With an absolutely continuous `P_2` reference, Brenier-map uniqueness and pushforward injectivity make `LOT_gamma` a genuine Hilbertian distance on its target domain, not merely a pseudometric. |
| V11-045 | 2245-2262 | The stability theorem's domains and exponent match the primary result: normalized Lebesgue reference on compact convex `X`, targets in compact convex `Y`, and `LOT<=C W_1^{2/15}`. The constant is correctly allowed to depend on `d,X,Y`. |
| V11-046 | 2274-2312 | The finite-rank covariance operator, `N x N` Gram scaling, eigenvector reconstruction factor `1/sqrt(N lambda_k)`, and score definition are internally consistent. The warning that large linear excursions need not remain Brenier maps correctly limits the PCA interpretation. |
| V11-047 | 2312-2325 | The 1D figure is correctly defined as the pushforward of the uniform law by each displayed PCA excursion, not as a claim that every excursion remains a quantile map. Direct evaluation confirms modes 1 and 2 remain monotone while eight extreme mode-3 excursions do not; the source caption explicitly warns of this and the histogram pushforwards remain valid. C11-MIN-05 is confined to contradictory notebook prose. |

### Spectral/robust and conditional Wasserstein

| ID | Source lines | Validated claim and check |
|---|---:|---|
| V11-048 | 2383-2459 | Schatten gauges are monotone spectral gauges. Their positive-semidefinite polar sets use the conjugate Schatten exponent; the trace, Frobenius, and spectral endpoint polar descriptions are correct. |
| V11-049 | 2433-2441 | For every positive-semidefinite, possibly singular `A`, the quadratic semimetric cost equals `W_2^2((A^{1/2})#alpha,(A^{1/2})#beta)`. Disintegration over image fibers supplies the nontrivial reverse inequality. |
| V11-050 | 2461-2497 | Under compact support and a closed finite gauge, Sion's theorem applies to the convex compact coupling and polar sets, yielding the robust supremum representation. Affinity and continuity are correctly used. |
| V11-051 | 2498-2517 | A supremum of projected Wasserstein pseudometrics satisfies the triangle inequality. Operator bounds `aI<=A<=bI` at polar-set level give `sqrt(a)W_2<=W_gamma<=sqrt(b)W_2`, hence definiteness and finite-dimensional topology equivalence. |
| V11-052 | 2537-2572 | After correcting the names in C11-MOD-04, Ky Fan's variational formula and weak minimax give `PRW_{2,k}<=W_{gamma_k}=SRW_{2,k}`; `(k/d)tr M<=gamma_k(M)<=tr M` gives the remaining square-root bounds. |
| V11-053 | 2631-2663 | On standard Borel/Polish spaces, disintegrated conditional couplings are the correct fixed-base couplings. Joint Borel measurability and fiberwise lower semicontinuity permit measurable optimal or near-optimal selections, validating the infimum-integral equality. |
| V11-054 | 2667-2695 | `W_{p,lambda}` is exactly the `L^p(lambda)` norm of fiber Wasserstein distances. Fiber definiteness and Minkowski prove the metric axioms on joint laws with fixed first marginal. |
| V11-055 | 2683-2695 | Identifying disintegrations modulo `lambda`-a.e. equality with metric-valued `L^p(S;P_p(Omega))` establishes completeness and separability because the Wasserstein fiber is Polish. |
| V11-056 | 2697-2715 | A measurable family of constant-speed fiber geodesics integrates to a constant-speed conditional geodesic. Raising to the `p`th power and integrating gives the exact speed identity; the Euclidean displacement-plan specialization is correct. |

**Validated-correct count: 56.**

## Structural inventory

### Physical source blocks

The chapter front matter occupies lines 1-18. The six section-level blocks cover every remaining physical line:

| Lines | Section |
|---:|---|
| 19-1025 | Unbalanced OT |
| 1026-1959 | Sliced Wasserstein Distances |
| 1960-2149 | Quotient Wasserstein and Wasserstein--Procrustes |
| 2150-2365 | Vector Quantiles and Linear Optimal Transport |
| 2366-2618 | Spectral and Robust Wasserstein Distances |
| 2619-2719 | Conditional Wasserstein Distances |

All 21 explicit paragraph blocks are:

| Lines | Paragraph |
|---:|---|
| 27-86 | Relaxed formulation |
| 87-305 | KL mass--shape separation |
| 306-405 | Reverse and homogeneous formulations |
| 406-546 | Conic lifting |
| 547-619 | Entropic KL relaxation |
| 620-720 | Metric contraction of the damped updates |
| 721-889 | Gaussian Hellinger--Kantorovich transport |
| 890-1025 | Partial optimal transport |
| 1033-1036 | One-dimensional projections |
| 1037-1144 | Spherical averaging |
| 1145-1237 | Radon point of view |
| 1238-1360 | Infinitesimal SW geometry |
| 1361-1406 | Intrinsic sliced length |
| 1407-1500 | Sliced Wasserstein between Gaussians |
| 1501-1754 | `L^q`-sliced, max-sliced and subspace variants |
| 1755-1959 | Min-SW lifted transport plans |
| 1967-2004 | Quotient distances |
| 2005-2149 | Rigid motions and Wasserstein--Procrustes |
| 2162-2182 | Vector quantiles |
| 2183-2273 | Linearized Wasserstein coordinates |
| 2274-2365 | Principal components in linear OT coordinates |

The spectral and conditional sections have no explicit `\paragraph` subdivision. Their entire section ranges were audited as physical blocks.

### Mathematical environments

Counts: 20 definitions, 23 propositions, 1 theorem, 1 example, 8 remarks, 2 algorithms, 24 proofs, and 11 figures. This is 45 core numbered mathematical statements and 45 supporting environments (remarks, algorithms, proofs, figures).

**Definitions (start line and title):**

| Line | Title |
|---:|---|
| 31 | Unbalanced optimal transport |
| 328 | Local reverse cost and homogeneous perspective |
| 411 | Cone lift |
| 457 | Wasserstein--Fisher--Rao distance |
| 725 | Gaussian Hellinger--Kantorovich distance |
| 754 | LogDet divergence and KL-softened Bures cost |
| 894 | Fixed-mass, penalized and TV-unbalanced transport |
| 1040 | Sliced Wasserstein distance |
| 1147 | Measure-valued Radon transform |
| 1514 | `L^q`-sliced and subspace-sliced Wasserstein |
| 1795 | Min-SW discrepancy and lifted plans |
| 1973 | Quotient Wasserstein distance |
| 2013 | Wasserstein--Procrustes distance |
| 2189 | Linear optimal-transport embedding |
| 2383 | Monotone spectral gauge |
| 2397 | Schatten gauge |
| 2414 | Spectral Wasserstein distance |
| 2521 | Subspace robust Wasserstein |
| 2631 | Conditional couplings and conditional OT |
| 2667 | Conditional Wasserstein distance |

**Propositions (start line and title):**

| Line | Title |
|---:|---|
| 66 | Balanced transport between relaxed marginals |
| 94 | Exact mass--shape separation for KL relaxation |
| 209 | Small-transport-scale limit for marginal penalties |
| 266 | Dual of unbalanced optimal transport |
| 381 | Homogenization does not change the unbalanced cost |
| 637 | Linear contraction of unbalanced Sinkhorn |
| 783 | Closed form of the KL-softened Bures cost |
| 848 | Gaussian Hellinger--Kantorovich endpoint |
| 929 | Equivalence of partial and TV-unbalanced transport |
| 961 | Fixed total mass reduces partial OT to balanced OT |
| 1057 | Metric properties of sliced Wasserstein |
| 1247 | First-order sliced comparison along Brenier perturbations |
| 1415 | Sliced Wasserstein between Gaussians |
| 1581 | Basic bounds for sliced variants |
| 1834 | Min-SW lower bound, topology and metric status |
| 1913 | Min-SW between nondegenerate Gaussians |
| 1986 | Metric property on the quotient |
| 2057 | Rigid update for a fixed coupling |
| 2245 | Quantitative stability of linear OT |
| 2461 | Robust representation and metric equivalence |
| 2539 | Ky Fan relaxation of subspace robust transport |
| 2683 | Conditional metric property |
| 2697 | Conditional geodesics |

The sole theorem is the cone formulation at lines 469-478. The sole example is the proliferating/dying cell application at lines 176-186.

**Remarks:** `835-846` (hard Bures limit), `868-884` (Gaussian closure caveat), `886-888` (entropic Gaussian extension), `1200-1213` (Hilbert embedding for `SW_2`), `1302-1331` (atomic local equality), `1333-1359` (Gaussian strict local inequality), `1465-1499` (proportional/rank-one covariances), and `2264-2272` (three Hilbertian embeddings).

**Proof ranges:** `83-85`, `128-143`, `242-264`, `283-304`, `388-404`, `480-545`, `678-698`, `808-833`, `864-866`, `951-957`, `972-974`, `1096-1143`, `1272-1300`, `1433-1457`, `1636-1753`, `1855-1909`, `1928-1938`, `1991-2003`, `2080-2092`, `2256-2262`, `2484-2517`, `2552-2572`, `2687-2695`, and `2704-2715`.

**Algorithms:** unbalanced Sinkhorn at lines `700-719`; alternating Wasserstein--Procrustes at lines `2099-2130`.

**Figure environments:** starts at lines `154`, `190`, `980`, `1002`, `1222`, `1944`, `2134`, `2217`, `2315`, `2336`, and `2581`. Their complete asset inventory appears below.

### Display inventory

The file contains 129 raw `\[...\]` displays, 40 `equation` environments, 2 `align*` environments, 1 numbered `align` environment, 9 `\eql` macro displays, and 1 `\eqllead` macro display. The 52 equation labels, including the macro-generated label at line 1623, are:

```text
34:eq-unbalanced-primal
57:eq-finite-mass-kantorovich-extension
69:eq-uot-relaxed-marginal-reformulation
96:eq-uot-kl-shape-envelope
108:eq-uot-kl-mass-shape
118:eq-uot-kl-optimal-mass
130:eq-kl-mass-shape-identity
330:eq-unbalanced-reverse-local-cost
336:eq-unbalanced-homogeneous-local-cost
356:eq-homogeneous
369:eq-homogeneous-semicoupling
553:eq-unbalanced-entropic-primal
727:eq-gaussian-ghk-endpoint
756:eq-logdet-divergence-gaussian-uot
764:eq-gaussian-ghk-covariance-envelope
785:eq-gaussian-ghk-adjusted-map
793:eq-gaussian-ghk-adjusted-covariances
799:eq-gaussian-ghk-covariance-value
810:eq-gaussian-ghk-covariance-stationarity
838:eq-gaussian-uot-hard-bures-limit
850:eq-gaussian-ghk-closed-form
874:eq-hellinger-gaussian-three-mixture
896:eq-partial-ot-fixed-mass
905:eq-partial-ot-tv-penalized
916:eq-partial-ot-tv-unbalanced
932:eq-partial-tv-uot-equivalence
964:eq-partial-ot-balanced-slice
1044:eq-sliced-wasserstein
1370:eq-intrinsic-sliced-length
1419:eq-sliced-gaussian
1525:eq-lq-subspace-sliced
1594:eq-lq-sliced-monotonicity
1600:eq-subspace-dimension-monotonicity
1614:eq-lq-subspace-sliced-upper-bound
1623:eq-subspace-sliced-lower-bound [macro-generated]
1716:eq-lq-sliced-radial-moment
1772:eq-min-sw-empirical-plan
1798:eq-min-sw-constrained-lifts
1808:eq-min-sw-definition
1823:eq-min-sw-fiber-lift
1836:eq-min-sw-comparison
1842:eq-min-sw-topological-counterexample
1887:eq-min-sw-quantization-obstruction
1915:eq-min-sw-gaussians
2042:eq-wasserstein-procrustes-coupling-update
2049:eq-wasserstein-procrustes-rigid-update
2191:eq-lot-embedding
2423:eq-spectral-wasserstein
2433:eq-quadratic-projected-cost
2444:eq-spectral-polar-set
2646:eq-conditional-ot-general
2669:eq-conditional-wasserstein-distance
```

Every display was checked for endpoint conventions, powers, and normalization. Findings affecting displays are C11-MAJ-02, C11-MOD-02, C11-MOD-04, and C11-MIN-02; the remaining retained numerical defects concern captions/code rather than displayed mathematics.

### Label inventory and mechanics

There are 128 literal `\label` declarations and one macro-generated equation label, for 129 distinct chapter labels. No chapter label is duplicated anywhere in the TeX tree, and none is missing from the global label index. The complete inventory is:

```text
9:sec-extensions; 10:sec-generalized-wasserstein-distances; 21:sec-unbalanced
31:def-unbalanced-optimal-transport; 34:eq-unbalanced-primal
57:eq-finite-mass-kantorovich-extension; 66:prop-uot-balanced-relaxed-marginals
69:eq-uot-relaxed-marginal-reformulation; 94:prop-uot-kl-mass-shape
96:eq-uot-kl-shape-envelope; 108:eq-uot-kl-mass-shape; 118:eq-uot-kl-optimal-mass
130:eq-kl-mass-shape-identity; 168:fig:unbalanced-mass-relaxation
176:ex-unbalanced-single-cell; 204:fig:unbalanced-divergence-choice
209:prop-unbalanced-small-scale-limit; 266:prop-dual-unbalanced-ot
328:def-unbalanced-local-costs; 330:eq-unbalanced-reverse-local-cost
336:eq-unbalanced-homogeneous-local-cost; 356:eq-homogeneous
369:eq-homogeneous-semicoupling; 381:prop-homogeneous-unbalanced
411:def-unbalanced-cone-lift; 457:def-wfr-distance; 469:thm-cone-unbalanced-ot
553:eq-unbalanced-entropic-primal; 637:prop-unbalanced-sinkhorn-contraction
700:alg:unbalanced-sinkhorn; 725:def-gaussian-ghk; 727:eq-gaussian-ghk-endpoint
754:def-gaussian-soft-bures; 756:eq-logdet-divergence-gaussian-uot
764:eq-gaussian-ghk-covariance-envelope; 783:prop-gaussian-ghk-adjusted-covariances
785:eq-gaussian-ghk-adjusted-map; 793:eq-gaussian-ghk-adjusted-covariances
799:eq-gaussian-ghk-covariance-value; 810:eq-gaussian-ghk-covariance-stationarity
835:rem-gaussian-uot-bures-limit; 838:eq-gaussian-uot-hard-bures-limit
848:prop-gaussian-ghk-endpoint; 850:eq-gaussian-ghk-closed-form
868:rem-gaussian-uot-geodesic-caveat; 874:eq-hellinger-gaussian-three-mixture
886:rem-entropic-gaussian-uot; 894:def-partial-optimal-transport
896:eq-partial-ot-fixed-mass; 905:eq-partial-ot-tv-penalized
916:eq-partial-ot-tv-unbalanced; 929:prop-tv-partial-ot-lagrange
932:eq-partial-tv-uot-equivalence; 961:prop-partial-ot-metric-slice
964:eq-partial-ot-balanced-slice; 994:fig:partial-ot-active-mass
1021:fig:partial-ot-shape-active-mass; 1029:sec-sliced-wasserstein
1040:def-sliced-wasserstein; 1044:eq-sliced-wasserstein
1057:prop-sliced-wasserstein-metric; 1145:rem-sliced-radon-viewpoint
1147:def-measure-radon-transform; 1200:rem-sliced-hilbert-embedding
1235:fig:sliced-wasserstein-projections; 1247:prop-sliced-first-order-tangent
1302:rem-sliced-local-atomic-equality; 1333:rem-sliced-local-gaussian-strict
1361:par-sliced-intrinsic-length; 1370:eq-intrinsic-sliced-length
1415:prop-sliced-gaussian; 1419:eq-sliced-gaussian
1465:rem-sliced-gaussian-special-cases; 1514:def-sliced-variants
1525:eq-lq-subspace-sliced; 1581:prop-sliced-variant-bounds
1594:eq-lq-sliced-monotonicity; 1600:eq-subspace-dimension-monotonicity
1614:eq-lq-subspace-sliced-upper-bound; 1623:eq-subspace-sliced-lower-bound [macro]
1716:eq-lq-sliced-radial-moment; 1772:eq-min-sw-empirical-plan
1795:def-min-sw; 1798:eq-min-sw-constrained-lifts; 1808:eq-min-sw-definition
1823:eq-min-sw-fiber-lift; 1834:prop-min-sw-comparison; 1836:eq-min-sw-comparison
1842:eq-min-sw-topological-counterexample; 1887:eq-min-sw-quantization-obstruction
1913:prop-min-sw-gaussians; 1915:eq-min-sw-gaussians
1956:fig:min-sliced-transport-plan; 1963:sec-quotient-wasserstein-procrustes
1973:def-quotient-wasserstein; 1986:prop-quotient-wasserstein-metric
2013:def-wasserstein-procrustes; 2042:eq-wasserstein-procrustes-coupling-update
2049:eq-wasserstein-procrustes-rigid-update; 2057:prop-wasserstein-procrustes-rigid-update
2099:alg:wasserstein-procrustes; 2146:fig:wasserstein-procrustes-rigid-motion
2153:sec-linear-ot; 2154:sec-vector-quantiles-linearized-transport
2189:def-lot-embedding; 2191:eq-lot-embedding; 2240:fig:dualnorms-linear-ot-embedding
2245:prop-linear-ot-stability; 2264:rem-three-hilbertian-measure-embeddings
2329:fig:linear-ot-1d-pca; 2361:fig:linear-ot-mnist-pca
2371:sec-spectral-subspace-wasserstein; 2383:def-monotone-spectral-gauge
2397:def-schatten-gauge; 2414:def-spectral-wasserstein; 2423:eq-spectral-wasserstein
2433:eq-quadratic-projected-cost; 2444:eq-spectral-polar-set
2461:prop-spectral-wasserstein-robust; 2521:def-subspace-robust-wasserstein
2539:prop-ky-fan-srw-comparison; 2616:fig:spectral-wasserstein-gauge
2622:sec-conditional-wasserstein-distances; 2631:def-conditional-ot
2646:eq-conditional-ot-general; 2667:def-conditional-wasserstein-distance
2669:eq-conditional-wasserstein-distance; 2683:prop-conditional-wasserstein-distance
2697:prop-conditional-wasserstein-geodesics
```

There are 100 distinct cross-reference targets: 68 local and 32 imported. All resolve. The local targets used by the chapter are:

```text
alg:wasserstein-procrustes
def-conditional-wasserstein-distance, def-gaussian-ghk, def-gaussian-soft-bures
def-measure-radon-transform, def-min-sw, def-partial-optimal-transport
def-quotient-wasserstein, def-unbalanced-local-costs, def-unbalanced-optimal-transport
eq-conditional-ot-general, eq-conditional-wasserstein-distance
eq-finite-mass-kantorovich-extension, eq-gaussian-ghk-adjusted-covariances
eq-gaussian-ghk-adjusted-map, eq-gaussian-ghk-closed-form
eq-gaussian-ghk-covariance-envelope, eq-gaussian-ghk-covariance-stationarity
eq-gaussian-ghk-covariance-value, eq-gaussian-ghk-endpoint
eq-homogeneous-semicoupling, eq-lq-sliced-monotonicity
eq-lq-sliced-radial-moment, eq-lq-subspace-sliced-upper-bound
eq-min-sw-comparison, eq-min-sw-definition, eq-min-sw-empirical-plan
eq-min-sw-fiber-lift, eq-min-sw-quantization-obstruction
eq-min-sw-topological-counterexample, eq-partial-ot-balanced-slice
eq-partial-ot-fixed-mass, eq-partial-ot-tv-penalized, eq-partial-ot-tv-unbalanced
eq-partial-tv-uot-equivalence, eq-sliced-gaussian, eq-sliced-wasserstein
eq-subspace-dimension-monotonicity, eq-subspace-sliced-lower-bound
eq-unbalanced-entropic-primal, eq-unbalanced-primal, eq-uot-kl-mass-shape
eq-uot-kl-optimal-mass, eq-uot-relaxed-marginal-reformulation
eq-wasserstein-procrustes-coupling-update, eq-wasserstein-procrustes-rigid-update
fig:dualnorms-linear-ot-embedding, fig:linear-ot-1d-pca, fig:linear-ot-mnist-pca
fig:min-sliced-transport-plan, fig:partial-ot-active-mass
fig:partial-ot-shape-active-mass, fig:sliced-wasserstein-projections
fig:spectral-wasserstein-gauge, fig:unbalanced-divergence-choice
fig:unbalanced-mass-relaxation, fig:wasserstein-procrustes-rigid-motion
prop-gaussian-ghk-endpoint, prop-homogeneous-unbalanced, prop-min-sw-comparison
prop-sliced-first-order-tangent, prop-sliced-wasserstein-metric
prop-uot-balanced-relaxed-marginals, prop-wasserstein-procrustes-rigid-update
rem-sliced-local-atomic-equality, rem-sliced-local-gaussian-strict
sec-sliced-wasserstein, sec-spectral-subspace-wasserstein
```

The 32 imported targets were read at these defining locations:

| Target | Defining location |
|---|---|
| `def-bregman-divergence` | `OT4ML/sections/sinkhorn-advanced.tex:48` |
| `def-continuous-soft-c-transform` | `OT4ML/sections/sinkhorn.tex:1255` |
| `def_divergence` | `OT4ML/sections/dual-norms.tex:385` |
| `eq-bures-map` | `OT4ML/sections/monge.tex:1939` |
| `eq-dist-gauss` | `OT4ML/sections/monge.tex:1950` |
| `eq-gw-wp-wasserstein-comparison` | `OT4ML/sections/beyond-comparing-measures.tex:562` |
| `eq-legendre` | `OT4ML/sections/dual-norms.tex:656` |
| `eq-mk-generic` | `OT4ML/sections/kantorovich.tex:1017` |
| `eq-shannon-entropy` | `OT4ML/sections/dual-norms.tex:476` |
| `eq-tv-entropy` | `OT4ML/sections/dual-norms.tex:489` |
| `fig:monge-shape-mccann-interpolation` | `OT4ML/sections/monge.tex:934` |
| `fig:sliced-radon-barycenter` | `OT4ML/sections/generalized-ot-problems.tex:1016` |
| `prop-1d-kantorovich-quantile-coupling` | `OT4ML/sections/kantorovich.tex:1180` |
| `prop-bures-metric-convex` | `OT4ML/sections/monge.tex:2188` |
| `prop-centered-gaussian-covariance-catalogue` | `OT4ML/sections/transportation-models.tex:1943` |
| `prop-gaussian-w2-bures` | `OT4ML/sections/monge.tex:1935` |
| `prop-gw-wasserstein-procrustes-comparison` | `OT4ML/sections/beyond-comparing-measures.tex:550` |
| `prop-matching-1d-monotone` | `OT4ML/sections/matching.tex:41` |
| `prop-memoli-gw-profile-lower-bound` | `OT4ML/sections/beyond-comparing-measures.tex:810` |
| `prop-metric-measure` | `OT4ML/sections/wasserstein-space.tex:214` |
| `prop-static-dynamic-unbalanced` | `OT4ML/sections/dynamic-ot.tex:1908` |
| `prop-wass-quantile-1d` | `OT4ML/sections/monge.tex:1356` |
| `rem-gw-wp-topologies` | `OT4ML/sections/beyond-comparing-measures.tex:681` |
| `rem-pullback-pushforward` | `OT4ML/sections/monge.tex:312` |
| `sec-barycenters` | `OT4ML/sections/generalized-ot-problems.tex:13` |
| `sec-conditional-wasserstein-resnets` | `OT4ML/sections/wasserstein-gradient-flows.tex:3335` |
| `sec-dynamic-unbalanced-wfr-flows` | `OT4ML/sections/wasserstein-gradient-flows.tex:3206` |
| `sec-gromov-wasserstein` | `OT4ML/sections/beyond-comparing-measures.tex:391` |
| `sec-normalized-spectral-wasserstein-dynamics` | `OT4ML/sections/wasserstein-gradient-flows.tex:2801` |
| `sec-rkhs-mmd` | `OT4ML/sections/dual-norms.tex:167` |
| `sec-unbalanced-ot` | `OT4ML/sections/dynamic-ot.tex:1823` |
| `thm-gelbrich-projection` | `OT4ML/sections/transportation-models.tex:2575` |

The apparent 33rd nonliteral target, `eq-subspace-sliced-lower-bound`, is local and generated by `\eqllead` at line 1623.

### Citation inventory

There are 52 distinct citation keys, and all 52 occur in `OT4ML/all.bib`. No unresolved Chapter 11 bibliography key was found. Complete key list:

```text
2015-chizat-unbalanced
2017-chizat-focm
BarboniPeyreVialard2024ConditionalResNets
BeslMcKay1992ICP
CaffarelliMcCannPartial
CarlierFigalliMerigotWang2025SlicedW1
ChapelAlayaGassoPartial
ChemseddineHagemannSteidlWald2024ConditionalWasserstein
CramerWold1936
FigalliPartial
HosseiniHsuTaghvaei2023ConditionalFunctionSpaces
KerriganMiglioriniSmyth2024DynamicConditionalOT
KleinUsciddaTheisCuturi2023GENOT
LieroMielkeSavareLong
LuebeckBunneGutCastilloPelkmansAlvarezMelis2022NubOT
MaheyChapelGassoBonetCourty2023MinSW
Metamorphosis2005
ParkSlepcev2023SlicedGeometry
PeszekPoyato2023FiberedOptimalTransport
SantambrogioBook
SeguyCuturi
TanguyChapelDelon2025SlicedTransportPlans
Villani09
YangZhang2026
alvarez2018towards
backhoff2019weak
bhatia2018bures
bigot2017geodesic
bonnotte2013unidimensional
cai2020linearized
carlier2016vector
carlier2016vectorquantile
chernozhukov2017monge
cloninger2025linearized
deshpande2019maxsliced
grave2018unsupervised
hallin2021distribution
janati2020gaussian
kolouri2016continuous
kolouri2017optimal
lemmens2012nonlinear
merigot2020stability
moosmuller2023linear
nadjahi2019asymptotic
oliver2014minimization
paty2019subspace
peyre2026muon
rabin-ssvm-11
rosenberg2023fast
thorpe2017transportation
wang2013linear
zemel2017fr
```

## Pre-correction numerical and figure provenance

The inventories and hashes in this section preserve the audit-time snapshot on which the findings were based. The corrected state and regenerated numerical checks are recorded in the post-correction QA section below.

### Notebook inventory

Every Chapter 11 figure has one matching notebook in `notebooks-figures`. All 11 notebooks were parsed cell by cell; all retained code outputs were inspected. There are no retained Python error outputs. Execution-count gaps are reported rather than silently treated as execution evidence.

| Notebook | Bytes | SHA-256 | Cells / code / executed | Code execution counts | Retained errors |
|---|---:|---|---:|---|---:|
| `unbalanced-mass-relaxation.ipynb` | 41,114 | `67d9e87fa4125842461e24b65afeb414b691cc8a61660cfe9f682154164ad052` | 9 / 5 / 4 | `null,1,2,3,4` | 0 |
| `unbalanced-divergence-choice.ipynb` | 48,476 | `e0731956a951540dae1b571e7a727c6ad567be994dc8872b2e3f90a49e96b134` | 11 / 6 / 5 | `null,1,2,3,4,5` | 0 |
| `partial-ot-active-mass.ipynb` | 18,892 | `1817242dfbb461df248aa6892622a1fa8cbff393d04d017b0aa1e8367eec7f2f` | 10 / 6 / 0 | all `null` | 0 |
| `partial-ot-shape-active-mass.ipynb` | 20,980 | `a4952ebaf7194693807d4a51023a8107faf96931e55747d26749d543b0777f12` | 13 / 7 / 4 | `null,1,2,3,null,null,5` | 0 |
| `sliced-wasserstein-projections.ipynb` | 60,942 | `1224b71d6cb35ee74b317d73f3609270f8870a85347fc77623f26ece53e8cd4b` | 9 / 5 / 4 | `null,1,2,3,4` | 0 |
| `min-sliced-transport-plan.ipynb` | 51,322 | `aaeb4736721567fd6c688e25900a73251edde27a138c3033b7302849dfcf4fd8` | 8 / 5 / 4 | `null,1,2,3,4` | 0 |
| `wasserstein-procrustes-rigid-motion.ipynb` | 309,731 | `27a81bf382a66fc4c4257c3727f806e82d2d65ff363e7937495196c53a0b5729` | 11 / 6 / 5 | `null,1,2,5,7,9` | 0 |
| `dualnorms-linear-ot-embedding.ipynb` | 121,517 | `2ab09f5f7f9b952ea9d064630afaafe82a9daa1a6fa666305085d3f30ed56df2` | 11 / 7 / 7 | `1,2,3,4,5,6,7` | 0 |
| `linear-ot-1d-pca.ipynb` | 192,233 | `00257d7468bb30991a5572c0a6fc219370d8ba28a64a249915ee26cf43263439` | 12 / 7 / 7 | `1,2,3,4,5,6,7` | 0 |
| `linear-ot-mnist-pca.ipynb` | 523,355 | `a53a47163505e3e9c5cd91fc6e777bddd72fe2c4f6dec14d8fb24e09610c9f99` | 11 / 6 / 5 | `null,1,2,3,4,5` | 0 |
| `spectral-wasserstein-gauge.ipynb` | 358,588 | `f30f22624023e49e2c09ee8f866ee67cf926a6489ea4f08d217b33ba3a01b722` | 17 / 10 / 10 | `1,2,3,4,5,6,7,8,9,10` | 0 |

Notebook-manifest SHA-256 is `b3bbd0fcbf31e964606c7498584f36ca1dad3ea27b1c5135987916b4584ee38a`, computed over the ordered UTF-8 lines `relative-path|byte-count|individual-sha256` for the table above.

### Numerical-method audit by figure

| Figure/notebook | Method, seed, discretization, and verification | Audit result |
|---|---|---|
| Unbalanced mass relaxation | 150-point grid on `[-3,3]`; squared cost divided by its median; `epsilon=0.02`; `tau={0.04,0.25,20}`; POT unbalanced Sinkhorn with 4,000 iterations and `stopThr=1e-10`. | Parameters are shared as captioned. No retained convergence log is available, but no formula mismatch was found. |
| Divergence choice | 56-point grid; cost divided by median; `epsilon=0.025`, `tau=0.25`; direct L-BFGS-B with 1,200 iterations, `ftol=1e-12`, `gtol=1e-7`. KL, Burg, and smoothed TV objectives share geometry/reference. | C11-MIN-03: TV is smoothed, plans are floored, and solver status is unchecked. |
| Partial OT, 1D | 190-point grid; exact POT partial solver at masses `0.90,0.65,0.42,0.22`; assertions check transported mass and both submarginal inequalities to `1e-10`. | Code formulas and captions agree. Notebook has no retained execution counts, so provenance is weaker than the assets suggest. |
| Partial OT, shapes | Seed `20260620`; 1,200 farthest-point samples per shape; normalized cost; masses `0.82,0.58,0.36,0.18`; two dummies; two-million iteration budget; mass checked to `5e-9`. | Code formulas and panels agree. Two late code cells have no retained count; no numerical contradiction found. |
| Sliced projections | Seeds 13 and 17; 3,000 farthest-point samples per silhouette plus small deterministic jitter; five directions `{-65,-32,0,34,68}` degrees; 205-bin 2D smoothing and 96-bin projected profiles. | Geometry/directions/caption agree. Profiles are display-rescaled; treated as optional disclosure, not a defect. |
| Min-SW plan | Seed 52; two 30-point clouds; 91 deterministic directions on `[0,pi)`; sorting-induced lifted assignment compared with exact equal-weight EMD. | Panel is a valid feasible lift and its cost upper-bounds `W_2^2`. Exact theorem counterexample was checked separately and does not depend on this grid. |
| Wasserstein--Procrustes | Seed 2028; 170 farthest-point bunny samples; exact linear assignment and SVD Procrustes candidate; 10 iterations with point-space damping `0.30`. | C11-MOD-05: damping changes assignments and leaves the rigid orbit. |
| LOT embedding | Seed 811; exact quantile interpolation with 3,200 density and 2,200 quantile samples in 1D; 940 equal-weight samples in 2D; three exact EMD calls with 900,000-iteration budgets; barycentric maps from a common reference. | The linearized midpoint and direct McCann midpoint are computed as captioned; no formula defect found. |
| LOT 1D PCA | Seed 203911; 8,000 spatial and 12,000 quantile samples; exact equal-weight quantile-barycenter formula; sparse SVD for five modes; nine excursions per displayed mode; weighted-histogram pushforward with Gaussian display smoothing. | The source caption's nonmonotone-extreme warning is correct. C11-MIN-05: notebook prose falsely claims amplitude clipping and derivative-based density reconstruction; eight of nine mode-3 maps are nonmonotone. |
| LOT MNIST PCA | 48 deterministic digit-zero images; adds background `0.020`; Sinkhorn barycenter and maps use regularization `0.004`, iteration budgets 1,000/900, and `stopThr=1e-7`; four PCA modes; display uses percentile subtraction, 99.4th-percentile saturation, clipping, and bilinear rendering. | C11-MIN-04: caption incorrectly says original densities are used. Clipping of displaced points to the pixel square is also a disclosed implementation fact worth retaining in future provenance text. |
| Spectral gauge | Deterministic seeds; coupling panels use 84-point trace EMD and 68-point spectral LP with 42 directions; density rows use separate 4,800-point trace assignment and 640-point spectral LP with 64 directions; 70,000 silhouette samples; HiGHS LP; KDE grid 560 and percentile saturation. | C11-MOD-06: plan mismatch, biased cell lift, endpoint switch, and per-panel framing invalidate the "corresponding interpolation" claim. |

No notebook modifies the mathematical source. Randomized notebooks use explicit modern NumPy generators. Solver tolerances and mass checks are adequate where asserted, except for the unchecked L-BFGS-B result in C11-MIN-03. No retained output contains a traceback or error object.

### Included PDF asset inventory

All 51 included paths exist and are one-page PDFs. Each was rendered and visually inspected in contact sheets; no blank, corrupt, missing, or obviously clipped included page was found. The visual defects retained above arise from semantics/provenance, not unreadable files. The ordered asset manifest SHA-256 is `78569ff33937e783710cb76a35afe44ee320ca6766693124c25801f1cc814c78`, computed over lines `relative-path|byte-count|individual-sha256`.

| Included PDF | Bytes | SHA-256 |
|---|---:|---|
| `figures/unbalanced-mass-relaxation/tau-small.pdf` | 10,752 | `4824da90715a033c4bc702c2be48ff8c09d8584cf3bb507c7e2c51ab088d5f19` |
| `figures/unbalanced-mass-relaxation/tau-medium.pdf` | 11,184 | `ee232f4a2f20494cf675dc7d9fa426f3b05a374641f63e277bb0952918e35783` |
| `figures/unbalanced-mass-relaxation/tau-large.pdf` | 11,200 | `b8bde22ba38ebe7025bca6bb2114e452b2f638ec2a9c8098ab647c10426c3cb4` |
| `figures/unbalanced-divergence-choice/kl.pdf` | 6,785 | `da9d473481c4ef2baac0bcdd9d832c99c224751a13820882bf0e8ff4bd5352b3` |
| `figures/unbalanced-divergence-choice/burg.pdf` | 7,012 | `f2cb610bbada166ba22e7c363a80475e5fee16020e27ac287f13564a1c8bceb1` |
| `figures/unbalanced-divergence-choice/tv.pdf` | 6,621 | `b2267f62be9b40f66bd0aebaee98a262b9d91fb80a31da79866cbc38ba79f7af` |
| `figures/partial-ot-active-mass/mass-090.pdf` | 8,011 | `f18c9474ede9254bb01992929e749bf5435f4ad15c8e6ebb26f7b72bd782b160` |
| `figures/partial-ot-active-mass/mass-065.pdf` | 7,987 | `29e62b59df6e091405bdfc7ee386af190f228556f7eceb03a4a2288af6db7e0f` |
| `figures/partial-ot-active-mass/mass-042.pdf` | 7,857 | `fccfd71bfc420d9940c17256dfdca3b9e54477c727055ce2bdc1ab5e18357c66` |
| `figures/partial-ot-active-mass/mass-022.pdf` | 7,849 | `1d96f785f251709aebf001b32f596ec0efa549896ec715a896a711444f132871` |
| `figures/partial-ot-shape-active-mass/mass-82.pdf` | 40,269 | `3c5d141c0c7aee47ba1473c399bef835d1fe5046a5d4ebd3ae5c575a88fc36fd` |
| `figures/partial-ot-shape-active-mass/mass-58.pdf` | 40,223 | `7e2513832a1ba0d5f64a018f656e7c019d6eba79845dcb4bcf24850c712cb034` |
| `figures/partial-ot-shape-active-mass/mass-36.pdf` | 40,295 | `61b73c4a009dbf973c4cafec33cc99eaca13f78360214034f44ad93ddd3ca016` |
| `figures/partial-ot-shape-active-mass/mass-18.pdf` | 40,487 | `8c6191229921ea0318a4bedbfffaabf567a7a3f2295bdef484dc9f0b55fe2142` |
| `figures/sliced-wasserstein-projections/density-alpha.pdf` | 9,134 | `70bbfd747714b3e061494bc36ad9ed62833382881bca5949464d26e24d2c7676` |
| `figures/sliced-wasserstein-projections/hist-alpha.pdf` | 7,960 | `4597657338d2d3bcde2a22ab05b48bd13164354d06e0a5a4d26c54871bb4d648` |
| `figures/sliced-wasserstein-projections/hist-beta.pdf` | 8,565 | `dcdd7392cc6a390d97f5f7c1c335a30bbef2f7d5d0f4ea816cad8a86d62b2e68` |
| `figures/sliced-wasserstein-projections/density-beta.pdf` | 14,802 | `15220f46a6508a8a3546b3b11fd7b51630c5a6cb75f91fc0995e0ccdc5d3df07` |
| `figures/min-sliced-transport-plan/direction.pdf` | 11,940 | `0906becfea8bc45e724d3df4b897939be09c099f03ae6473955547c101d5d3cf` |
| `figures/min-sliced-transport-plan/lifted-plan.pdf` | 12,278 | `cc61506c39b337aeb65536ce41a6eb5c53e3c37a7af5a45bfebd4d9039c34531` |
| `figures/min-sliced-transport-plan/w2-plan.pdf` | 12,281 | `4c3b1aef0ee6db228e0df225ecca1e95a25d2cab7be778bd0ce684443200e035` |
| `figures/wasserstein-procrustes-rigid-motion/iter-01.pdf` | 8,387 | `3d7a44e1653bed3bba89427d7500a73a871ecd2f21b6e5527fef3312d9b0724b` |
| `figures/wasserstein-procrustes-rigid-motion/iter-02.pdf` | 8,409 | `3b615adf252951f5275ac452c1ac80a6bc43f1da867f306849c5e2dd96c286d7` |
| `figures/wasserstein-procrustes-rigid-motion/iter-03.pdf` | 8,446 | `ed7d6d927f70631848f9d354825d6ea48b0ce8dbc0f3545a15ae8486fa15f238` |
| `figures/wasserstein-procrustes-rigid-motion/iter-05.pdf` | 8,444 | `5ed3ad2474c533c4cbd48b87ec0845fe1acae1180a5e51b8f0457f0884a5a8e1` |
| `figures/wasserstein-procrustes-rigid-motion/iter-10.pdf` | 8,486 | `4e420f910a14ced2d8be3d21487c1b330765b7efdec3c5a939aa5b38be12f128` |
| `figures/dualnorms-linear-ot-embedding/displacements-1d.pdf` | 6,312 | `a97ba9ebb6b5c42d2da07a9ec27ce2e2ec171ee46feacd17ce4aeee87ee90c20` |
| `figures/dualnorms-linear-ot-embedding/barycenter-1d.pdf` | 7,455 | `506e7b7a5cddfb5617034fdebba74ddb3214c951036fdea9384567c6d67e3814` |
| `figures/dualnorms-linear-ot-embedding/targets-2d.pdf` | 44,759 | `481a89350458860b1f126752fd4f6aff9bf60ceb9d1357d274b21bba783788a8` |
| `figures/dualnorms-linear-ot-embedding/barycenter-2d.pdf` | 24,188 | `4364ce3217deb8b06f4eddd65be75c768edb3f4de394be4bb5aef92cbd637a6c` |
| `figures/dualnorms-linear-ot-embedding/barycenter-2d-ot.pdf` | 24,036 | `a7d0c414ed3b3b14ae62a9910e0e6216b6d878051cede09c019dac5e0ecb39be` |
| `figures/linear-ot-1d-pca/mode-1.pdf` | 835,770 | `0f19550f2886523563d132c636c5eb77dcc68ed851626be3e19da86b3194b331` |
| `figures/linear-ot-1d-pca/mode-2.pdf` | 834,512 | `e288de0fa2838dd245f45fa78bafa08b6f593a5f4ccfab30acc2eee2830621e5` |
| `figures/linear-ot-1d-pca/mode-3.pdf` | 824,192 | `89ebba6794adbe969a76cbac3d7143a497c632af2db07e6653111c6448f752eb` |
| `figures/linear-ot-mnist-pca/barycenter.pdf` | 6,615 | `02b06e5b4ad58f2876c47da326891a6a12e5f874bf8e570ae763faf7178c9c1e` |
| `figures/linear-ot-mnist-pca/mode-1.pdf` | 15,104 | `35f5f21b6c81a74247b63514474734b042115937d2a880709ae829f21ab9625a` |
| `figures/linear-ot-mnist-pca/mode-2.pdf` | 15,224 | `0f1af7c25f4373e36a5a44baef73fc0f22647e68ff9315e30f705d0e531bd0d4` |
| `figures/linear-ot-mnist-pca/mode-3.pdf` | 14,908 | `07fabd00d0508ad9f8cc37f4023ccf7bb129159ff38d4b7560fd1265a75fa185` |
| `figures/linear-ot-mnist-pca/mode-4.pdf` | 14,905 | `54fa82649254e3a8d810341ac911790652c034f64388154dfa75b1f446903831` |
| `figures/spectral-wasserstein-gauge/trace-coupling.pdf` | 599,454 | `655d4d60805dedb4a3c53b3e9a25fc529634a45de19f38bd3010faaafea4eb73` |
| `figures/spectral-wasserstein-gauge/lambda-max-coupling.pdf` | 599,109 | `1c19f2b20c9936dc7795050b9277dbb74cbe5e2fadc635f5f778223335099702` |
| `figures/spectral-wasserstein-gauge/trace-density-t000.pdf` | 7,991 | `a8ecf018c54ce2d7eaca02711c48144ed7c430c77310d5628f29149d76b81d91` |
| `figures/spectral-wasserstein-gauge/trace-density-t025.pdf` | 9,361 | `ef8b399f6db6127e56d5741ec4c27f48db5d8d7b166d0881c2dae75c7a75dfa3` |
| `figures/spectral-wasserstein-gauge/trace-density-t050.pdf` | 10,559 | `3fb565bef4dd9b4c8fd186600612147f3ce64e1aaf8558742ebe9480aaa44f3f` |
| `figures/spectral-wasserstein-gauge/trace-density-t075.pdf` | 11,537 | `600455b48fb6fe45d39116d0461c4010aed651e365a0fce529170449564bc130` |
| `figures/spectral-wasserstein-gauge/trace-density-t100.pdf` | 10,654 | `32d083e36079a2e87ecac37ebb351e0ccd5747157227260827f24de578d7e010` |
| `figures/spectral-wasserstein-gauge/lambda-max-density-t000.pdf` | 8,182 | `f898775796d572ed4a82396344420866cc939cee0c389f8044efc02407614aee` |
| `figures/spectral-wasserstein-gauge/lambda-max-density-t025.pdf` | 8,566 | `6ead66436ab0362a44080042c6a12fb3899c0d8d14b7272260a94cdfc4456309` |
| `figures/spectral-wasserstein-gauge/lambda-max-density-t050.pdf` | 9,557 | `9aca4acbde362f9fb2ea92d9a943168df7c400dd0dfba4705695e818501db78b` |
| `figures/spectral-wasserstein-gauge/lambda-max-density-t075.pdf` | 10,666 | `c8c52e4a68901894655df5bed44201ca1ac049dafa3f72bb26a84cd15fe05e83` |
| `figures/spectral-wasserstein-gauge/lambda-max-density-t100.pdf` | 10,427 | `e8821a70a947f5b4119d8b54a5dc7352963d8404ce6ca2ebdb8d2a0960f2e4f0` |

Five PDFs in the corresponding figure directories are not included by Chapter 11: `wasserstein-procrustes-rigid-motion/iter-00.pdf`, `wasserstein-procrustes-rigid-motion/iter-04.pdf`, `linear-ot-1d-pca/dataset.pdf`, `spectral-wasserstein-gauge/trace-geodesic.pdf`, and `spectral-wasserstein-gauge/lambda-max-geodesic.pdf`. They were not counted among the 51 included assets.

## Primary-literature verification

The audit used primary papers or authoritative monographs for material claims, and independently checked formulas rather than treating citation presence as validation.

| Topic | Primary source checked | Result |
|---|---|---|
| Entropy transport, homogeneous closure, cone axes, duality | Liero, Mielke and Savare, [Optimal Entropy-Transport problems and a new Hellinger-Kantorovich distance](https://iris.unibocconi.it/retrieve/e31e10d4-0f6e-31fb-e053-1705fe0a5b99/Liero-Mielke-Savare18.pdf) | Confirms the need for an l.s.c. homogeneous envelope and explicit coercive/topological duality regimes; supports C11-MAJ-02 and C11-MOD-01. |
| Static/dynamic HK-WFR scaling | Liero, Mielke and Savare, [Optimal transport in competition with reaction](https://arxiv.org/abs/1509.00068) | Confirms cosine-cone/dynamic equivalence; comparison with the chapter's imported convention gives `kappa=sqrt(tau)/2`, supporting C11-MOD-02. |
| Gaussian KL-unbalanced endpoint | Yang and Zhang, [Gaussian Unbalanced Optimal Transport](https://arxiv.org/abs/2605.02497) | Closed endpoint structure and Gaussian optimizer are consistent with lines 740-866. The audit independently checked all chapter constants. |
| Intrinsic sliced geometry | Park and Slepcev, [Geometry and analytic properties of the sliced Wasserstein space](https://arxiv.org/html/2311.05134v4) | Supports non-length status, intrinsic geodesicity, and comparison with `W_2`; lines 1361-1405 are valid. |
| Sharp compact sliced `W_1` comparison | Carlier, Figalli, Merigot and Wang, [Sharp comparisons between sliced and standard Wasserstein distances](https://arxiv.org/abs/2510.16465) | Supports the `1/d` exponent and its sharpness for `p=1`; the chapter correctly does not claim sharpness for transferred general-`p` bounds. |
| Min-SW/lifted sliced plans | Tanguy, Chapel and Delon, [Sliced transport plans](https://arxiv.org/html/2508.01243v3) | Supports compatible-lift construction, attainment, nonmetric behavior, and topology caveats. Chapter-specific examples and Gaussian equality were independently derived. |
| Projection/subspace robust names | Paty and Cuturi, [Subspace Robust Wasserstein Distances](https://proceedings.mlr.press/v97/paty19a.html) | Establishes that the source's formula called SRW is PRW and the Ky Fan min-coupling value is SRW; supports C11-MOD-04. |
| LOT stability | Merigot, Delalande and Chazal, [Quantitative stability of optimal transport maps and linearization of the 2-Wasserstein space](https://proceedings.mlr.press/v108/merigot20a.html) | Confirms the domains and exponent `2/15` in lines 2245-2262. |
| Fibered optimal transport | Peszek and Poyato, [Heterogeneous gradient flows in the topology of fibered optimal transport](https://arxiv.org/abs/2203.08104) | Attribution to fixed-fiber transport and heterogeneous PDEs is accurate. |
| Conditional OT on function spaces | Hosseini, Hsu and Taghvaei, [Conditional optimal transport on function spaces](https://arxiv.org/abs/2311.05672) | Attribution to triangular maps/Kantorovich formulations and Bayesian inference is accurate. |
| Conditional Wasserstein for inverse problems/flow matching | Chemseddine et al., [Conditional Wasserstein distances](https://arxiv.org/abs/2403.18705) | Restricted same-condition couplings are accurately characterized. |
| Dynamic conditional OT | Kerrigan, Migliorini and Smyth, [Dynamic conditional optimal transport through simulation-free flows](https://arxiv.org/abs/2404.04240) | Dynamic conditional-flow attribution is accurate. |

No citation was accepted as establishing a stronger claim than its theorem. In particular, the Paty-Cuturi nomenclature was checked against definitions, and the Hellinger endpoint was not used to infer a finite-parameter WFR geodesic formula.

## Requested-scope boundary notes

These are not findings because the current source does not make the stronger claim:

- The general entropy definition does not itself assert existence of a raw UOT minimizer. Existence is proved only in later compact/coercive settings. C11-MAJ-01 concerns the explicit large-penalty claim, not an unstated universal existence theorem.
- The Gaussian GHK formulas assume strictly positive masses and positive-definite covariances at lines 742-748. Singular covariance extensions are not claimed. They may be obtainable by lower-semicontinuous limits, but the current matrix inverses/determinants do not define them, so readers should not infer an endpoint theorem on `S_+^d` without an added statement.
- The Radon subsection contains a measure-valued transform and Hilbert pullback, but no Fourier-slice normalization, filtered backprojection, or `R^dagger` pseudoinverse theorem. Those notions therefore have no Chapter 11 formula to validate; the notation table's generic `R^dagger` entry is not referenced here.
- The current conditional section denotes the general value by `MK_c^lambda`, not `L_c^lambda`. Its relation to `W_{p,lambda}` is explicitly and correctly `W_{p,lambda}^p=MK_{d^p}^lambda`.
- The chapter does not claim that GHK itself is a length metric, that its Gaussian chord optimizer generates a Gaussian WFR geodesic, or that the finite-`tau` softened Bures term is a metric.
- No global Holder upper bound for Min-SW is claimed; the chapter correctly proves that none can hold on the full `P_2(R^d)` for `d>=2`.

## Reconciliation and change history

### Second pass against the supplied pass-one report

The supplied pass-one `audit-chap11.md` baseline had 840 physical lines, 10,454 words, 89,969 bytes, and SHA-256 `3d8e05d4b05d120104343f6eaa81d5595030b94f63dc519767ee852758b6608c`. Every one of its 12 findings was rechecked from the protected source, imported definitions, notebook code, assets, and, where material, primary literature.

| Pass-one finding | Second-pass challenge | Disposition |
|---|---|---|
| `C11-MAJ-01` - general large-penalty limit | Re-tested against the full admitted entropy class. The constant-zero entropy remains a literal admissible counterexample, including feasible hard marginals. The repair was checked not to overpromise minimizer convergence without equicoercivity. | **Retained/refined**, Major. |
| `C11-MAJ-02` - homogeneous closure | Re-derived the KL perspective on the positive quadrant and both axes. The raw positive-scale infimum is infinite on a one-sided axis and has no apex value, while the required closed formula is finite there. | **Retained**, Major. |
| `C11-MOD-01` - dual hypotheses | Rechecked both conjugate signs and the imported compact-space divergence dual. The algebra survives; the missing spaces, potential class, cost regularity, and qualification remain a theorem-domain defect. | **Retained/narrowed to hypotheses**, Moderate. |
| `C11-MOD-02` - GHK/WFR scale | Recomputed both infinitesimal cone tensors and the cosine cutoff. The unique matching is still `kappa=sqrt(tau)/2`, with no additional global factor. | **Retained**, Moderate. |
| `C11-MOD-03` - vector-quantile moment | Re-tested with an absolutely continuous infinite-second-moment reference and a Dirac target. Every feasible quadratic objective is infinite, so absolute continuity alone still does not support the stated equivalence. | **Retained**, Moderate. |
| `C11-MOD-04` - Paty-Cuturi names | Checked the primary definitions again. The earlier sliced section already says PRW correctly; only the later spectral definition calls PRW by the SRW name, while the Ky Fan min-coupling value is the actual SRW. | **Retained but title/diagnosis narrowed**, Moderate; nomenclature only. |
| `C11-MOD-05` - Procrustes damping | Traced every notebook state update. The damped point cloud drives the next assignment and, except at trivial rotations, is a contracted similarity rather than a rigid pose. | **Retained**, Moderate. |
| `C11-MOD-06` - spectral interpolation provenance | Rechecked all three discretization levels, Voronoi-cell weighting, endpoint branch, KDE crop, and rendered panels. The interpolation rows still are not induced by either displayed plan and do not preserve the intended marginals. | **Retained**, Moderate. |
| `C11-MIN-01` - Radon field metric | Re-tested the null-direction example and the conditional-space identification. The measure pullback is definite, but arbitrary fields still require the almost-everywhere quotient. | **Retained**, Minor. |
| `C11-MIN-02` - displacement covariance terminology | Re-tested on a deterministic translation. Centered covariance vanishes while the defined matrix is nonzero, confirming that renaming, not centering, is required. | **Retained**, Minor. |
| `C11-MIN-03` - smoothed TV panel | Re-read objective, bounds, solver return path, and caption. The panel remains a positive-floor smoothed surrogate with unchecked termination rather than exact TV. | **Retained**, Minor. |
| `C11-MIN-04` - MNIST background | Re-traced preprocessing through barycenter, couplings, barycentric maps, and PCA. The added `0.020` background enters every transport computation, contrary to the caption. | **Retained**, Minor. |
| `C11-MIN-05` - 1D LOT-PCA notebook prose | New systematic comparison of notebook claims with executed code found no amplitude clipping and no derivative inversion; eight of nine third-mode maps are nonmonotone. The book caption itself already states the correct pushforward convention. | **Added in pass two**, Minor. |

Pass-two change arithmetic: **added 1; upgraded 0; downgraded 0; merged 0; rejected 0; retained/refined 12**. The total rises from 12 to 13 findings solely because of C11-MIN-05. C11-MOD-04 was narrowed from an apparent two-way name swap to the exact one-way later-section mislabeling; its severity remains Moderate because an explicitly attributed named definition is assigned to the wrong variational object, even though every displayed inequality remains true.

### Reconciliation with the preserved pre-fresh audit

The preserved copy `/private/tmp/ot4ml-audit-chap11-before-fresh-agent.md` has 954 physical lines, 11,979 words, 91,585 bytes, and SHA-256 `2c759615f2339069a9ebd5305114e7df230833bfa6029b4d1d08fa1ad99a3a6e`. It was first opened only after the independent audit was substantially complete.

Every one of its 13 finding IDs has exactly one disposition below.

| Prior finding | Independent reconciliation | Current disposition |
|---|---|---|
| `CH11-UOT-001` - general large-penalty limit | Independently rediscovered with the same constant-zero entropy counterexample. I tightened the repair to separate Gamma convergence, value convergence, and minimizer-cluster claims. | **Retained/refined** as C11-MAJ-01, Major. |
| `CH11-UOT-002` - dual hypotheses | This candidate first entered the fresh ledger during reconciliation. I then independently read the imported conjugacy theorem and LMS Theorem 4.11/Corollary 4.12, verified the algebraic signs, and confirmed the missing theorem domain. | **Verified during reconciliation** as C11-MOD-01, Moderate. |
| `CH11-UOT-003` - GHK/WFR scale | Independently rediscovered by comparing the two infinitesimal cone tensors. The exact map is `kappa=sqrt(tau)/2`. | **Retained** as C11-MOD-02, Moderate. |
| `CH11-UOT-004` - Hellinger endpoint versus finite WFR | The old report paraphrased the current text as claiming that the displayed mixture is a finite-`kappa` WFR geodesic. The source explicitly labels it the pure Hellinger endpoint and does not make that formula a finite-parameter path. If finite-`kappa` nonclosure is intended by the preceding broad sentence, a citation would improve it, but this ambiguity does not warrant a retained defect. | **Rejected as a finding; narrowed to a scope note.** |
| `CH11-UOT-005` - missing l.s.c. homogeneous envelope | Independently rediscovered from the KL axis contradiction. The current report additionally identifies the excluded `c=+infinity` cutoff and apex inconsistency. | **Retained/broadened** as C11-MAJ-02, Major. |
| `CH11-SW-001` - Radon a.e. quotient | This candidate first entered during reconciliation. The null-direction counterexample was then independently checked against the conditional `L^p` construction. | **Verified during reconciliation** as C11-MIN-01, Minor. |
| `CH11-LOT-001` - reference second moment | Independently rediscovered using a heavy-tailed absolutely continuous reference and a Dirac target. | **Retained** as C11-MOD-03, Moderate. |
| `CH11-SP-001` - PRW/SRW swap | Independently rediscovered from the internal conflict between lines 1557 and 2524, then verified in the primary paper. The second pass narrowed this: PRW is named correctly at line 1557, then mislabeled as SRW at line 2524; the formulas are not mutually swapped. | **Retained/narrowed** as C11-MOD-04, Moderate. |
| `CH11-SP-002` - covariance terminology | Independently rediscovered with the deterministic displacement example. The current report emphasizes that centering would be the wrong repair. | **Retained** as C11-MIN-02, Minor. |
| `CH11-FIG-001` - divergence smoothing | Independently rediscovered by reading the optimizer code. | **Retained/refined** as C11-MIN-03, Minor. |
| `CH11-FIG-002` - Procrustes damping | Independently rediscovered; the fresh derivation proves the convex blend is a contracted similarity in 2D and confirms that the damped state drives later assignments. | **Retained/refined** as C11-MOD-05, Moderate. |
| `CH11-FIG-003` - MNIST background | This candidate first entered during reconciliation, after which the full preprocessing, barycenter, map, and display code was independently traced. | **Verified during reconciliation** as C11-MIN-04, Minor. |
| `CH11-FIG-004` - spectral interpolation marginal | Independently rediscovered and reproduced quantitatively. The fresh report adds separate-plan resolutions/direction counts, both source and target cell-mass diagnostics, endpoint switching, and crop changes. | **Retained/expanded** as C11-MOD-06, Moderate. |

Reconciliation arithmetic: 9 prior findings were independently rediscovered before opening the old audit; 3 were first surfaced by reconciliation and then independently verified; 1 was rejected as a retained defect. No prior finding was silently dropped. The first-pass report therefore had 12 retained findings. The present second pass adds C11-MIN-05, which is wholly new relative to both the preserved hypothesis list and the supplied pass-one report, for a current total of 13.

The old report's **validated-correct** ledger itself contained two false Min-SW descriptions, neither of which was a numbered finding:

- It stated `MinSW<=SW<=MaxSW` and said the topology obstruction can make Min-SW vanish. The chapter correctly states the opposite relevant comparison `W_2<=MinSW`, and its obstruction is bounded **away from zero** while `W_2->0`.
- It described Gaussian equality as choosing a direction where projected means and variances agree and realize zero. The actual proof chooses an eigenvector of the positive-definite Brenier map, making the projected source-target relation increasing; the projected cost need not be zero.

Those statements were rejected rather than copied into V11-038/V11-039.

## Post-correction QA record

### Mathematical and notation checks

- Re-derived the KL homogeneous perspective on the open quadrant and checked its lower-semicontinuous values on both axes and at the apex.
- Rechecked the GHK infinitesimal cone tensor against the dynamic WFR convention, obtaining exactly `kappa=sqrt(tau)/2` with no additional multiplicative factor.
- Rechecked the Ky Fan minimax comparison after restoring the PRW/SRW names; the formulas and inequalities are unchanged.
- Searched the manuscript and gallery prose for the superseded covariance terminology and stale homogeneous-formula label. No active occurrence remains.
- Finding heading IDs remain unique: 2 Major, 6 Moderate, 5 Minor, 0 Critical, total 13. Validated-ledger IDs remain contiguous from `V11-001` through `V11-056`.

### Numerical reproducibility checks

- Executed the Procrustes notebook. The largest rigid-orbit defect `||R^T R-Id||` over exported states is `2.22e-16`.
- Executed the divergence-choice notebook. The final marginal first-order residuals are `1.19e-16` (KL), `7.48e-13` (Burg), and `1.06e-12` (smoothed TV); all solver-success checks pass and no artificial positive floor is imposed.
- Executed the spectral-gauge notebook. Both full computed plans have zero mass, row-marginal, column-marginal, and negativity defects at the recorded precision; the interpolation panels are generated directly from those plans, while the coupling panels plot only their largest positive entries.
- Validated all five touched notebooks against notebook format 4.5. None retains an execution-error output. A second source scan found and removed malformed JSON control-character escapes from the divergence-choice Markdown; all five sources now pass the same scan.

### Build and visual checks

- A full `latexmk` build succeeds and produces the 492-page `OT4ML.pdf`.
- The final log contains no unresolved citation, undefined reference, duplicate label, or fatal error.
- Rendered manuscript pages containing Figures 11.2, 11.7, and 11.11 were inspected at full resolution. Captions, labels, algorithms, and panels fit cleanly without clipping or blocked layout.
- The updated divergence, Procrustes, and spectral figures were independently inspected before the manuscript-page check.

No Git staging, commit, push, reset, checkout, or unrelated-file cleanup was performed during this correction pass.
