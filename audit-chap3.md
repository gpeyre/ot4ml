# Chapter 3 Second-Pass Audit: Kantorovich Relaxation

## Scope and method

This report is an independent second-pass audit of the current on-disk file `/Users/gpeyre/Dropbox/github/ot4ml/OT4ML/sections/kantorovich.tex`, not Git HEAD. It supersedes the first-pass report whose SHA-256 was `69ea2f3e2b7e8f3279bd414d49fed76531e0d0bb754aec1663210cce1e3604f6`. The six first-pass IDs were treated as hypotheses: every source line and every imported convention needed for correctness was reread, every substantive claim was re-derived, and each candidate was tested against its strongest reasonable interpretation.

Coverage comprised all 1,495 physical source lines; every structural unit, definition, theorem-like environment, proof, display, algorithm, figure, label, reference, and citation-sensitive assertion; and the relevant imported material in `monge.tex`, `sinkhorn-advanced.tex`, `generalized-ot-problems.tex`, and `wasserstein-space.tex`. The bibliography, retained LaTeX diagnostics, all nine figure-generator notebooks, all 26 included PDF panels, and retained notebook outputs were inspected read-only. Bounded numerical checks used only memory or `/tmp`; no source asset was regenerated. Primary sources were checked where attribution affected correctness. A final adversarial pass removed findings that depended only on an unreasonable literal reading or on demanding a full algorithm from overview prose.

Initial source baseline:

- Physical lines: 1,495
- Bytes: 104,820
- SHA-256: `566cc6781bbe5f3b9cdc982cff44e718073f0ab4db82601435d37afe05bfe539`

## Executive summary

Exact defect counts:

| Severity | Active at audit completion | Unresolved after correction |
|---|---:|---:|
| Critical | 0 | 0 |
| Major | 0 | 0 |
| Moderate | 1 | 0 |
| Minor | 4 | 0 |
| **Total** | **5** | **0** |

The chapter's central mathematics is sound. The discrete LP formulation, rank-controlled sparsity theorem, exact `n+m-1` transport support bound, north-west construction, Birkhoff--von Neumann theorem and extraction algorithm, rational replication theorem, continuous existence theorem, maximal convex/lower-semicontinuous relaxation theorem, Brenier specialization, one-dimensional quantile coupling, affine-difference Monge-gap characterization, and necessity of `c`-cyclical monotonicity all withstand independent derivation.

At audit completion, the sole Moderate defect was numerical provenance: the kernel-regression notebook solved with a nugget-modified kernel but plotted a different function, and the displayed hard-constrained curves violated the stated sample monotonicity constraints. The four Minor defects concerned the implicit positive orientation of a uniform-grid Monge-gap formula, auxiliary versus output memory in the Birkhoff routine, polytope terminology for an infinite-dimensional coupling set, and an overstatement of the role of source density in preventing splitting. The former `CH3-006` anti-cycling hypothesis was retired because the relevant text is explicitly an overview, not a complete algorithm or termination theorem.

The counts and wording above describe the audited baseline. All five active findings were corrected on 2026-08-26; the implementation record below distinguishes those repairs from the historical diagnosis.

## Correction implementation record (2026-08-26)

| ID | Corrected location | Implemented correction | Status |
|---|---|---|---|
| `CH3-001` | Proposition `prop-monge-gap-one-dimensional`, its proof, and paragraph `par-monge-gap-kernel-regression` in `OT4ML/sections/kantorovich.tex` | The uniform grid is now explicitly increasing, with `\Delta>0`, both in the proposition and in the kernel-regression specialization. The proof now identifies positivity of `\Delta` as the reason that the increasing target assignment is optimal in the displayed indexing. | **Resolved** |
| `CH3-002` | `notebooks-figures/monge-gap-kernel-regression.ipynb`; regenerated `OT4ML/figures/monge-gap-kernel-regression/paths.pdf` and thumbnail | Removed the diagonal nugget entirely. A backward-stable spectral factorization of the unmodified Gaussian Gram matrix gives `K=FF^T` to a checked tolerance; optimization uses the resolved coordinates in which fitted samples are `Fw` and the RKHS norm is `|w|^2`, while the plotted kernel coefficients are reconstructed from that same factorization. Both penalized and hard programs use CLARABEL, require an `optimal` solver status, and check reconstruction, feasibility, and the two equivalent Monge-gap formulas. The largest displayed penalty was increased from `2.5` to `10` so the unmodified-kernel path still reaches the stated near-monotone regime. | **Resolved** |
| `CH3-003` | Complexity discussion after Algorithm `alg-birkhoff-von-neumann-decomposition` | Replaced the undifferentiated memory claim by separate bounds: `O(n^2)` auxiliary memory when terms are streamed, `O(n^3)` total worst-case storage for a compact returned list, and `O(n^4)` if each permutation is stored densely. | **Resolved** |
| `CH3-004` | Remark `rem-kantorovich-book-shifting` | Replaced the infinite-dimensional `coupling polytope` by the mathematically correct `convex coupling set` and identified its minimizing set more precisely as an exposed face. | **Resolved** |
| `CH3-005` | Explanation after Corollary `cor-monge-kantorovich-brenier` | Replaced the false necessity claim about densities by the exact disintegration criterion: `pi(dx,dy)=pi_x(dy) alpha(dx)` is map-induced exactly when `pi_x` is Dirac almost everywhere. The text then identifies singleton subdifferential fibers as the sufficient structural mechanism used in Brenier's proof, while distinguishing absolute continuity from weaker non-charging and pair-specific hypotheses. | **Resolved** |
| `CH3-006` | Transportation-simplex overview | No edit was required because the second audit retired this candidate finding. | **Retired; no action** |

### Numerical verification of `CH3-002`

The corrected notebook executes from start to finish and regenerates both figure assets. For the `n=55` and `n=95` experiments, respectively, the resolved Gaussian Gram ranks are 27 and 38; the relative spectral factorization errors are `3.70e-15` and `8.73e-15`; and evaluating the reconstructed pure-Gaussian expansions at the samples agrees with the optimized values to `1.32e-13` and `1.77e-13` in maximum norm. The hard monotonicity violations are `0` and `1.39e-13`, and the corresponding Monge gaps are `0` and `2.99e-16`. For every displayed regularization weight, the sorting and pairwise-hinge evaluations agree within the enforced `2e-10` tolerance, and the gap decreases monotonically with `gamma`. The strongest penalized fits have exact Monge gaps `7.59e-05` and `1.05e-05`. Thus the visible curves, their RKHS penalties, and their sample constraints now use one and the same Gaussian kernel.

### Manuscript verification

- `git diff --check` passes on the corrected Chapter 3 source, notebook, and audit report.
- The complete manuscript compiles to a 482-page PDF with no LaTeX error. The only unresolved citation in the resulting log is `FathiFigalli2010NoncompactOT` on Chapter 2 page 26, outside the scope of this Chapter 3 correction pass.
- The pages containing Algorithm 3.2, Remark 3.30, Corollary 3.36 and its corrected explanation, Proposition 3.44, and Figure 3.9 were rendered and inspected. The revised text fits without overflow, and the regenerated figure and caption remain legible at book scale.
- Corrected Chapter 3 source: 1,495 physical lines, 105,730 bytes, SHA-256 `bbfc4396d0005ed578b61fa57edbe420b32a18120624b7b0dbf763f00a291ff0`.
- Corrected notebook SHA-256: `f526fb3f40ed9da9004cd2b59b985aab60226519aa62e58c1836a2e5713d3dc3`.

### Correction refinement pass (2026-08-26)

Every repair was re-derived from the defining optimization problem rather than accepted from the first correction pass. The positive-grid identity in `CH3-001` was checked both by expanding the sorted quadratic costs and by the adjacent-inversion argument. The Birkhoff output-space bounds in `CH3-003` were recomputed from the `(n-1)^2+1` term bound. The weaker Brenier hypothesis cited by `CH3-005` was verified against Definition `defn-not-charging-hypersurfaces` and the following remark in Chapter 2.

This refinement made four additional improvements without opening a new finding:

- `CH3-004` now says `exposed face`, which records that the optimal set is cut out by equality in the linear Kantorovich objective rather than merely being an unspecified face.
- `CH3-005` now gives the disintegration formula and the exact Dirac-conditional criterion before explaining the sufficient singleton-subdifferential mechanism.
- The notebook's explanatory cell now describes the spectral truncation as a backward-stable factorization of the unmodified Gram matrix, rather than calling it exact; malformed math commands were repaired, and the stale displayed endpoint `gamma=2.5` was synchronized to the implemented value `gamma=10`.
- The generator now validates finite inputs and parameters, accepts only solver status `optimal`, checks the equivalence between sorting and hinge formulas, verifies zero hard Monge gap, and certifies that the Monge gap is nonincreasing along the computed penalty path.

The notebook was re-executed after these refinements, its PDF and thumbnail were regenerated, and the figure was inspected at full resolution. A fresh isolated manuscript build produced 482 pages; the affected printed pages 51, 57, 59, 62, and 63 were rendered and inspected with no clipping, collision, or degraded figure legibility. No active Chapter 3 issue remains.

## Second-pass disposition at audit completion

| ID | First pass | Second pass | Adversarial disposition |
|---|---|---|---|
| `CH3-001` | Moderate | **Minor, active** | The negative-`Delta` counterexample is exact, but `uniform grid`, the increasing-assignment proof, and the isotonic interpretation jointly make positive orientation the intended convention. The defect is an unstated local convention, not a failure under the intended reading. |
| `CH3-002` | Moderate | **Moderate, active** | Retained. The nugget enters every solve-side term and hard constraint, so it changes the finite RKHS program rather than merely stabilizing a factorization. The plotted pure-Gaussian samples measurably violate the stated hard program. |
| `CH3-003` | Moderate | **Minor, active** | Narrowed. `O(n^2)` is correct auxiliary/in-place space under the standard convention that excludes output. It is incomplete only because the pseudocode explicitly accumulates and returns a list whose compact storage can be `Theta(n^3)`. |
| `CH3-004` | Minor | **Minor, active** | Retained as literal terminology. The optimal set is an exposed face, but the ambient continuous coupling set is not a polytope. The usage is informal and has no mathematical propagation. |
| `CH3-005` | Minor | **Minor, active** | Retained and sharpened. For a fixed plan, no splitting is equivalent to Dirac conditional laws almost everywhere; singleton subdifferential fibers are the plan-independent mechanism used by Brenier. Absolute continuity is only one sufficient source condition. |
| `CH3-006` | Minor | **Retired** | The transportation-simplex paragraph states pivot geometry and practical/worst-case context, but neither presents pseudocode nor asserts termination for an unspecified tie rule. Anti-cycling is necessary for a full implementation, not for this overview's truth. |

No new defect survived the second-pass search, so no `CH3-007` was created. At audit completion, the active IDs were `CH3-001` through `CH3-005`; all five are now resolved by the implementation record above. `CH3-006` is retained only in the retired register and excluded from all defect totals.

## Findings

### CH3-001 - Minor - The uniform-grid Monge-gap orientation should be explicit

- **Current lines and environment:** lines 1332-1353, Proposition `prop-monge-gap-one-dimensional`, especially display `eq-monge-gap-uniform-grid` at lines 1342-1349 and its proof at lines 1351-1353; propagated to paragraph `par-monge-gap-kernel-regression`, lines 1364-1385, especially `eq-monge-gap-kernel-finite`.
- **Precise claim:** for `x_i=x_1+(i-1)Delta`, the quadratic Monge gap equals both the sorting difference and
  `2 Delta/n sum_{i<j}(t_i-t_j)_+`; the resulting coefficient makes the finite kernel problem convex.
- **Defect and derivation:** writing `d=|Delta|`, expansion cancels the squared target terms. If `Delta>0`, the increasing optimal assignment is `t_(i)` and
  `M=(2 Delta/n) sum_{i<j}(t_i-t_j)_+`.
  If `Delta<0`, source order is reversed, the optimal target at index `i` is `t_(n+1-i)`, and the correct identity is
  `M=(2 d/n) sum_{i<j}(t_j-t_i)_+`.
  The displayed identity is therefore not sign-invariant. For `n=2`, `x=(0,-1)` and `t=(1,0)`, the graph is already monotone in spatial order and has gap zero, while both displayed expressions evaluate to `-1`. On the other hand, the words `uniform grid`, the proof's `increasing optimal assignment`, the following isotonic cone, and the hard constraints all make `Delta>0` contextually intended. This survives only as an omitted orientation convention.
- **Smallest repair:** add `Delta>0` (equivalently `x_1<...<x_n`) in both the proposition and the kernel-regression setup. In the proof, say explicitly that adjacent inversions are exchanged relative to this increasing source order.
- **Downstream impact:** none under the standard positive-grid-spacing reading. Without that convention, the empirical identity, isotonic zero set, and sign of the RKHS hinge coefficient are wrong; all general Monge-gap results are unaffected.

### CH3-002 - Moderate - The plotted regression curves do not solve the stated Gaussian-kernel programs

- **Current lines and environment:** lines 1387-1393, Figure `fig:monge-gap-kernel-regression`, together with equations `eq-monge-gap-kernel-ridge` and `eq-monge-gap-kernel-finite` at lines 1365-1384.
- **Generator:** `/Users/gpeyre/Dropbox/github/ot4ml/notebooks-figures/monge-gap-kernel-regression.ipynb`.
- **Precise claim:** the colored curves solve the displayed Gaussian-kernel objective and the black dashed curve solves the corresponding hard sample-monotonicity problem.
- **Defect and derivation:** the exact solve kernel is `K_solve=K_Gaussian+10^{-3}I`. The notebook uses it in the data-fit term, RKHS quadratic, pairwise hinges, and hard inequalities. Plot evaluation instead uses `K_Gaussian(x,X)q`, omitting the diagonal component. This is not factorization-only jitter: it changes the coefficients' objective and the fitted sample vector. In the `n=55` experiment, the `gamma=0` coefficient vector differs from pure Gaussian KRR by relative norm `0.012237`; the plotted function differs from that pure solution by up to `5.859e-4`, with pure-objective excess `2.690e-6`. The hard constraints hold on `K_solve q` to `7.8e-15`, but the plotted Gaussian sample vector has maximum adjacent inversion `0.008084` in 21 of 54 pairs and differs from the solve-side samples by up to `0.013094`. For `n=95`, the corresponding coefficient/function/objective figures are `0.008881`, `3.603e-4`, and `4.732e-6`; hard solve-side violation is `1.9e-15`, while the plotted samples invert by up to `0.003732` in 36 of 94 pairs and differ by up to `0.004269`.
- **Smallest repair:** use one Gram matrix consistently. Prefer solving the displayed pure-Gaussian problem (using a solver-side PSD wrapper or numerically harmless factorization technique rather than changing the kernel), then evaluate with that same kernel. Alternatively, explicitly define the nugget kernel and evaluate its representer consistently, including at sample points. Regenerate only this figure afterward.
- **Downstream impact:** the analytical representer reduction and convexity claim remain valid. The defect is confined to the numerical evidence and the caption's assertion that the visible curves are the stated solutions.

### CH3-003 - Minor - The memory bound needs an auxiliary/output qualifier

- **Current lines and environment:** Algorithm `alg-birkhoff-von-neumann-decomposition`, lines 598-622; term bound at lines 626-632; complexity sentence at line 634.
- **Precise claim:** the dense implementation has `O(n^5)` operations and `O(n^2)` memory while the algorithm appends every pair `(lambda,sigma)` to a list `D` and returns that list.
- **Defect and derivation:** the dense residual, support graph, matching, and breadth-first-search state require `Theta(n^2)` words; this remains true in place or when preserving the input. Thus the sentence is correct under the conventional auxiliary-space reading. The pseudocode nevertheless appends every `(lambda,sigma)` and returns the list. With `L<=(n-1)^2+1`, compact permutations require `Theta(nL)=O(n^3)` output words; dense permutation matrices would require `O(n^2L)=O(n^4)`. The compact `Theta(n^3)` case is genuinely attainable: in a `d=(n-1)^2` dimensional polytope, the finite union of hulls of at most `d` vertices has dimension at most `d-1`, so a generic bistochastic matrix needs at least `d+1` permutation terms.
- **Smallest repair:** write `O(n^2) auxiliary memory when output terms are streamed; O(n^3) total compact storage in the worst case for the returned list (or O(n^4) if permutations are stored densely).`
- **Downstream impact:** correctness, termination, the term bound, and the conservative `O(n^5)` operation count are unchanged. Only the space-complexity accounting is wrong/underspecified.

### CH3-004 - Minor - A continuous coupling set is called a polytope

- **Current lines and environment:** line 1005, Remark `rem-kantorovich-book-shifting` (lines 993-1008).
- **Precise claim:** the optimal couplings form `a whole face of the coupling polytope`.
- **Defect and derivation:** `Couplings(alpha,beta)` here is an infinite-dimensional convex set of measures and is not the convex hull of finitely many vertices, hence not a polytope. The surrounding use is plainly an analogy with the discrete case. The face claim itself is exact: minimizers of this continuous linear functional form an exposed face, and equality holds exactly when `y>=x` almost surely.
- **Smallest repair:** replace `coupling polytope` by `convex coupling set` or `weakly compact coupling set`.
- **Downstream impact:** terminology only; the example, lower bound, equality characterization, and nonuniqueness are unaffected.

### CH3-005 - Minor - Absolute continuity is sufficient, not exactly necessary, to prevent splitting

- **Current lines and environment:** line 1158, immediately after Corollary `cor-monge-kantorovich-brenier` and its proof (lines 1142-1156).
- **Precise claim:** `The density assumption is exactly what prevents the relaxed plan from using several destinations at a nonsmooth point.`
- **Defect and derivation:** for a fixed optimal plan with disintegration `pi(dx,dy)=pi_x(dy) alpha(dx)`, absence of splitting is exactly `pi_x=delta_{T(x)}` for `alpha`-almost every `x`. In the Brenier proof, the plan-independent mechanism is the stronger singleton-fiber condition `partial phi(x)={grad phi(x)}` almost everywhere. Absolute continuity guarantees that condition because convex functions are Lebesgue-a.e. differentiable, but it is not necessary. The imported discussion at `monge.tex` lines 714-734 gives the weaker universal sufficient hypothesis that `alpha` not charge countably rectifiable hypersurfaces. Pair-specific singular and atomic laws can also have deterministic unique optimizers despite charging such sets. The next remark's words `may` and `can` are correct and expose the overstatement in `exactly`.
- **Smallest repair:** write: `What prevents splitting is that the optimal conditional fiber is a singleton alpha-almost everywhere. Absolute continuity is a convenient sufficient condition, and weaker non-charging or pair-specific hypotheses can also suffice.`
- **Downstream impact:** Brenier's corollary and proof remain correct; this repairs only the explanatory necessity claim.

## Retired finding

### CH3-006 - Retired - The simplex paragraph is an overview, not a termination specification

- **Current lines and environment:** paragraph `Transportation simplex and network simplex`, lines 782-796; related degenerate-basis explanation at line 314.
- **Adversarial result:** a degenerate basis can indeed give a zero-length pivot, tied leaving arcs, and cycling under an unrestricted rule. However, the chapter does not present a transportation-simplex algorithm, stopping rule, or theorem that arbitrary pivots terminate. It describes the fundamental-cycle pivot geometry, then explicitly distinguishes practical behavior from exponential worst cases. Requiring Bland's rule or lexicographic perturbation would improve an implementation note but does not repair a false assertion.
- **Disposition:** retired with no mandatory repair and no downstream impact. It is excluded from severity counts and repair order.

## Research and scope questions

These are not defects and are excluded from every severity total.

### RQ3-001 - General density of graph couplings

Should this chapter state the general atomless-source density theorem, rather than only Brenier's quadratic equality? A later imported result in `wasserstein-space.tex` lines 423-457 treats compact metric spaces and an atomless source, proves weak density of graph couplings, and yields equality of Monge and Kantorovich infima for continuous costs. Chapter 3 makes no contrary claim, so omission is a scope choice, not a defect.

### RQ3-002 - Sufficiency of `c`-cyclical monotonicity

The final section proves the necessary direction for finite continuous costs. It does not state the converse under the standard additional hypotheses or formulate `c`-subdifferentials/`c`-concave potentials. Decide whether the intended learning objective is only the support certificate used here or a necessity-and-sufficiency theorem. No converse is falsely claimed, so this is not counted.

### Resolved RQ3-003 - Orlin citation

This first-pass question is retired. The cited 1997 primary paper is exactly a primal network-simplex algorithm and gives
`O(min(n^2 m log(nC), n^2 m^2 log n))` time, including a cost-independent polynomial branch. It therefore supports the chapter's theoretical strongly-polynomial contrast at the stated level. Orlin's 1993 [faster strongly polynomial minimum-cost-flow paper](https://pubsonline.informs.org/doi/10.1287/opre.41.2.338) would be another canonical citation, but substitution is optional rather than a correction. Active RQs are only `RQ3-001` and `RQ3-002`.

## Validated-correct ledger

`V` means independently re-derived and retained after adversarial review. Qualifications listed here are part of the validation, not latent findings.

| ID | Current lines | Independently validated claim |
|---|---:|---|
| VC3-001 | 20-68 | Discrete couplings are exactly nonnegative `n x m` matrices with the stated row/column marginals. Equal total mass is necessary and sufficient for nonemptiness; for probability vectors the product plan supplies feasibility. With positive marginals, the affine dimension is `(n-1)(m-1)`; zero margins reduce to the active rows/columns. |
| VC3-002 | 71-100 | The product coupling is optimal iff the cost is additive on the active Cartesian support. The four-point equality argument has the correct signs and handles zero-weight rows/columns by restricting to active supports. |
| VC3-003 | 146-194 | The discrete objective is the exact LP `min <C,P>` under `P 1=a`, `P^T 1=b`, `P>=0`. Mixing feasible plans proves joint convexity in marginals; infima of linear forms prove concavity in cost. Extended-value endpoint conventions are sound. |
| VC3-004 | 221-245 | The general sparse-LP proposition is correct. If a minimizer has support larger than `rank(A)`, a nonzero support-restricted kernel direction preserves all linear constraints. Both signed perturbations remain feasible and optimal for sufficiently small magnitude, and an endpoint reduces support. Boundedness gives attainment. Inequalities encoded in the linear image are also preserved exactly. |
| VC3-005 | 247-264 | The transportation marginal map has rank `n+m-1` after one redundant total-mass equation. Therefore an optimal plan with at most `n+m-1` positives exists. Equality is an upper bound, not a claim that every optimizer or every basic plan has full support. |
| VC3-006 | 270-314 | The north-west corner construction preserves residual mass, terminates, has at most `n+m-1` positive entries, and produces acyclic positive support. Simultaneous row/column exhaustion correctly creates degeneracy; zero margins are skipped. |
| VC3-007 | 327-345 | The weighted one-dimensional sweep is optimal for convex displacement costs. The uncrossing inequality has the correct direction; strict convexity removes crossings except equality/tie cases. |
| VC3-008 | 353-441 | Permutation matrices have the stated convention; `B_n` is the scaled coupling set with row/column sums one. Extreme-point existence and extreme-minimizer results use compactness correctly. The Birkhoff affine dimension is `(n-1)^2`, including `n=1`. |
| VC3-009 | 443-584 | The Birkhoff--von Neumann proof correctly extracts an alternating cycle from every nonpermutation support and perturbs in both directions. Hall's theorem and Caratheodory give the exact extreme-point/decomposition statements and the bound `(n-1)^2+1`. |
| VC3-010 | 586-632 | Every residual support satisfies Hall. The augmenting-path routine produces a perfect matching. Subtracting the minimum matched entry preserves nonnegativity and equal residual sums. The normalized residual moves to a proper face, proving termination and the stated number of terms. |
| VC3-011 | 661-696 | Rational replication is exact: scaling by the common denominator yields an integral transportation polytope because the bipartite incidence matrix is totally unimodular. It proves existence of an integral optimizer, not integrality of all optimizers. |
| VC3-012 | 718-769 | Domain adaptation, visual distributions, and single-cell examples use couplings rather than falsely asserting deterministic maps. The barycentric-projection forward reference resolves and uses the conditional mean `sum_j P_ij y_j/a_i` on positive rows. WOT is described as an estimated population coupling, not an exact cell lineage. |
| VC3-013 | 800-839 | With zero rows/columns removed, the positive transport polytope has an interior and the log barrier has diagonal Hessian `epsilon/P_ij^2`. Path-following approaches the LP optimal face. This is approximate polynomial-time optimization; no finite exact-arithmetic claim is made. |
| VC3-014 | 851-923 | Continuous marginal and coupling definitions use pushforwards/test functions correctly. The product measure is a coupling. The continuous definitions reduce to the discrete matrix formulas under atomic identification. |
| VC3-015 | 925-977 | Product-coupling optimality is degenerate iff the continuous cost is additive on the product support. The rectangle identity, base-point construction, continuity extension, and almost-everywhere-to-support step are valid under the stated finite continuous cost. |
| VC3-016 | 993-1008 | Apart from CH3-004's word `polytope`, the book-shifting calculation is exact: `|y-x| >= y-x`, the marginal mean difference is one, and equality is equivalent to support in `y>=x`. |
| VC3-017 | 1015-1065 | The continuous value is well-defined in `[0,+infinity]` for nonnegative Borel costs. Joint marginal convexity and cost concavity remain valid with infinite values because endpoint and positive-coefficient cases are separated correctly. |
| VC3-018 | 1081-1097 | For Polish spaces and nonnegative lower-semicontinuous cost, the coupling set is nonempty, uniformly tight, weakly closed, and hence weakly compact by Prokhorov. Portmanteau gives lower semicontinuity and attainment. Compactness of the ground spaces is not needed. |
| VC3-019 | 1105-1131 | On compact metric spaces with finite continuous cost, `MK_c` is proper, jointly convex, weakly lower semicontinuous, exact on Dirac pairs, and the largest functional with the stated properties. Jensen applies because a proper lsc convex functional on this compact convex domain is bounded below. |
| VC3-020 | 1142-1156 | Under the stated Brenier hypotheses, every optimal plan is supported on a single-valued convex subgradient almost everywhere, so the graph plan is the unique Kantorovich optimizer and Monge/Kantorovich values agree. CH3-005 concerns only the following prose. |
| VC3-021 | 1180-1236 | The common-quantile coupling works with atoms. Conditional rank kernels lift any coupling to uniform ranks; bounded monotone step approximations and truncation justify uncrossing for general measures. The integrability condition controls the diagonal limit, while infinite competitor cost is harmless. No unsupported uniqueness claim is made for measures with atoms. |
| VC3-022 | 1252-1275 | The Monge gap is nonnegative, equals zero exactly when the graph coupling is optimal, and admits the self-coupling formula. Disintegration supplies every competitor with the fixed second marginal. |
| VC3-023 | 1281-1304 | Marginal terms cancel for affine-difference costs. The gap is a supremum of continuous linear functionals in `T`, hence convex and positively homogeneous. The zero condition reduces to optimality for `-<u,y>` and Rockafellar's convex-subgradient characterization. `L^2` controls every cross term. |
| VC3-024 | 1306-1313 | The argument order for Bregman divergences is correct. The two-point test for exhaustiveness is sound: convexity of `(g(u)-g(v))_+` and the swapped test force both `g` and `-g` convex, hence affine under `C^2`; cost differences therefore have the stated form. |
| VC3-025 | 1319-1355 | For atomless `alpha`, the probability integral transform makes the increasing rearrangement feasible. Strict convexity gives uniqueness almost everywhere. Conditional on the repair `Delta>0`, the sorting and pairwise-hinge identities and the distinction from least-squares isotonic regression are exact. |
| VC3-026 | 1364-1385 | Conditional on `Delta>0`, the representer reduction is correct. `K` is PSD, the squared-fit and RKHS terms are convex, and every hinge is affine-composed convex. CH3-002 concerns generator consistency, not these equations. |
| VC3-027 | 1412-1432 | Topological support is used correctly. The permutation and cyclic formulations of `c`-cyclical monotonicity are equivalent by cycle decomposition. Repeated points do not invalidate the definition. |
| VC3-028 | 1443-1463 | For finite continuous cost and a finite-valued optimum, optimal support is `c`-cyclically monotone. The overlapping-rectangle construction is valid: choosing `lambda <= (sum 1/m_i)^{-1}` makes the total removed density at most one, and product reinsertion preserves both marginals while strictly reducing cost. |
| VC3-029 | 1465-1490 | A graph plan lies in support on a full-source-measure set. For quadratic cost the two-cycle inequality yields monotonicity. In one dimension strict convexity for `p>1` excludes reversals; for `p=1` nonuniqueness is correctly retained. |
| VC3-030 | whole chapter | All 77 local labels are unique; all 85 `ref`/`eqref` occurrences resolve in the retained build; all 29 distinct cited bibliography keys exist. The first-pass Orlin question was resolved in favor of the existing citation. |

## Structural-unit reconciliation

| Unit | Current lines | Result |
|---|---:|---|
| Chapter `sec-kantorovich` | 6-1495 | Audited completely |
| Section `sec-discrete-relaxation` | 13-771 | Audited completely |
| Paragraph: Mass splitting and couplings | 19-140 | V |
| Paragraph: Linear-programming structure | 141-320 | V, including north-west initialization and degenerate-basis convention |
| Paragraph: One-dimensional cases | 321-347 | V |
| Paragraph: Permutation matrices as couplings | 348-554 | V |
| Paragraph: Constructive Birkhoff--von Neumann decomposition | 555-638 | V except CH3-003 |
| Paragraph: Rational weights | 639-717 | V |
| Paragraph: Applications of discrete transport | 718-771 | V |
| Section `sec-kantorovich-lp-algorithms` | 772-843 | V; `CH3-006` and `RQ3-003` retired after second-pass review |
| Paragraph: Transportation simplex and network simplex | 782-796 | V as an overview; no full pivot-rule termination claim |
| Paragraph: Interior-point methods | 797-843 | V |
| Section `sec-kantorovich-continuous` | 844-1240 | V except CH3-004 and CH3-005 |
| Paragraph: Continuous couplings | 851-1009 | V except CH3-004 |
| Paragraph: Continuous Kantorovich problem | 1010-1098 | V |
| Paragraph: Axiomatic characterization | 1099-1132 | V |
| Paragraph: Monge--Kantorovich equivalence | 1133-1173 | V except CH3-005; RQ3-001 |
| Paragraph `sec-1d-kantorovich-solution` | 1174-1240 | V |
| Section `sec-monge-gap` | 1241-1397 | V except CH3-001 and CH3-002 |
| Paragraph: Definition and optimality certificate | 1248-1276 | V |
| Paragraph: Convex gaps and convex potentials | 1277-1314 | V |
| Paragraph: One-dimensional order and isotonicity | 1315-1359 | CH3-001 |
| Paragraph `par-monge-gap-kernel-regression` | 1360-1397 | CH3-001 and CH3-002 |
| Section `sec-cyclical-monotonicity` | 1398-1495 | V; RQ3-002 |
| Paragraph: Support and `c`-cyclical monotonicity | 1409-1433 | V |
| Paragraph: Optimal matching to optimal transport | 1434-1464 | V |
| Paragraph: Monotonicity | 1465-1479 | V |
| Paragraph: One dimension | 1480-1495 | V |

## Named and numbered environment reconciliation

Every theorem-counter environment is listed once. Proofs, algorithms, and figures have separate matrices below.

| ID | Type | Lines | Name / label | Result |
|---|---|---:|---|---|
| E3-001 | Definition | 38-53 | Discrete couplings / `def-discrete-couplings` | V |
| E3-002 | Remark | 54-68 | Small transportation polytopes / `rem-small-transportation-polytopes` | V |
| E3-003 | Definition | 71-78 | Discrete product coupling / `def-discrete-product-coupling` | V |
| E3-004 | Proposition | 82-86 | Discrete product optimality / `prop-discrete-product-coupling-degenerate` | V |
| E3-005 | Definition | 146-158 | Discrete Kantorovich problem / `def-discrete-kantorovich-problem` | V |
| E3-006 | Proposition | 163-175 | Marginal convexity/cost concavity / `prop-discrete-kantorovich-joint-convexity` | V |
| E3-007 | Proposition | 221-236 | Rank-controlled sparse minimizers / `prop-lp-rank-sparsity` | V |
| E3-008 | Proposition | 247-252 | Sparse optimal plans / `prop-sparse-optimal-plans` | V |
| E3-009 | Proposition | 270-275 | North-west corner feasible plan / `prop-northwest-corner` | V |
| E3-010 | Proposition | 327-332 | One-dimensional weighted sweep / `prop-1d-weighted-sweep` | V |
| E3-011 | Definition | 353-365 | Permutation matrices / `def-permutation-matrices` | V |
| E3-012 | Definition | 377-386 | Birkhoff polytope / `def-birkhoff-polytope` | V |
| E3-013 | Definition | 405-413 | Extreme points / `def-extreme-points` | V |
| E3-014 | Proposition | 415-418 | Existence of extreme points / `prop-extreme-point-existence` | V |
| E3-015 | Example | 423-426 | Unbounded convex set without extreme points | V |
| E3-016 | Proposition | 428-437 | LPs have extreme minimizers / `prop-linear-program-extreme-minimizer` | V |
| E3-017 | Theorem | 443-446 | Birkhoff--von Neumann / `thm-birkhoff-von-neumann` | V |
| E3-018 | Corollary | 529-534 | Kantorovich for matching / `cor-kantorovich-matching` | V |
| E3-019 | Remark | 548-553 | General discrete case | V |
| E3-020 | Corollary | 560-573 | Birkhoff--von Neumann decomposition / `cor-birkhoff-von-neumann-decomposition` | V |
| E3-021 | Proposition | 661-686 | Rational duplicated matching / `prop-rational-weights-duplicated-matching` | V |
| E3-022 | Example | 722-727 | Domain adaptation / `ex-domain-adaptation` | V |
| E3-023 | Example | 729-733 | Visual distributions / `ex-visual-distributions` | V |
| E3-024 | Example | 735-760 | Single-cell dynamics / two labels at line 735 | V |
| E3-025 | Definition | 857-871 | Marginals / `def-joint-marginals` | V |
| E3-026 | Definition | 882-892 | Couplings / `def-continuous-couplings` | V |
| E3-027 | Remark | 894-898 | Probabilistic couplings | V |
| E3-028 | Definition | 902-912 | Tensor product / `def-tensor-product-coupling` | V |
| E3-029 | Proposition | 925-939 | Continuous product optimality / `prop-product-coupling-degenerate` | V |
| E3-030 | Remark | 993-1008 | Book-shifting face / `rem-kantorovich-book-shifting` | CH3-004 |
| E3-031 | Definition | 1015-1025 | Continuous Kantorovich problem / `def-continuous-kantorovich-problem` | V |
| E3-032 | Proposition | 1031-1046 | Continuous curvature / `prop-kantorovich-value-curvature` | V |
| E3-033 | Remark | 1067-1077 | Probabilistic Kantorovich form | V |
| E3-034 | Proposition | 1081-1085 | Lsc-cost existence / `prop-kantorovich-existence-compact` | V |
| E3-035 | Theorem | 1105-1117 | Maximal convex relaxation / `thm-kantorovich-maximal-convex-relaxation` | V |
| E3-036 | Corollary | 1142-1149 | Brenier equivalence / `cor-monge-kantorovich-brenier` | V; following prose CH3-005 |
| E3-037 | Remark | 1160-1163 | Nonsmooth potentials and splitting | V |
| E3-038 | Remark | 1165-1171 | Probabilistic tightness | V |
| E3-039 | Theorem | 1180-1192 | 1D quantile coupling / `prop-1d-kantorovich-quantile-coupling` | V |
| E3-040 | Definition | 1252-1259 | Monge gap / `def-monge-gap` | V |
| E3-041 | Proposition | 1263-1272 | Monge-gap properties / `prop-monge-gap-properties` | V |
| E3-042 | Proposition | 1281-1300 | Affine-difference gaps / `prop-affine-difference-monge-gap` | V |
| E3-043 | Definition | 1319-1328 | Increasing rearrangement / `def-increasing-rearrangement-map` | V |
| E3-044 | Proposition | 1332-1350 | 1D Monge-gap formulas / `prop-monge-gap-one-dimensional` | CH3-001 |
| E3-045 | Definition | 1415-1424 | `c`-cyclical monotonicity / `def:ccm` | V |
| E3-046 | Theorem | 1443-1446 | Optimal plans are ccm / `thm:opt_ccm` | V |

Environment totals: 13 definitions, 15 propositions (including the one spelled `proposition`), 4 theorems, 3 corollaries, 7 remarks, and 4 examples; total 46. All begin/end pairs are balanced.

## Proof reconciliation

| ID | Lines | Proves | Result |
|---|---:|---|---|
| P3-001 | 87-100 | E3-004 product degeneracy | V |
| P3-002 | 177-194 | E3-006 discrete curvature | V |
| P3-003 | 238-245 | E3-007 rank sparsity | V |
| P3-004 | 253-264 | E3-008 sparse plans | V |
| P3-005 | 276-281 | E3-009 north-west plan | V |
| P3-006 | 333-345 | E3-010 weighted 1D sweep | V |
| P3-007 | 419-421 | E3-014 extreme-point existence | V |
| P3-008 | 438-441 | E3-016 extreme minimizer | V |
| P3-009 | 470-527 | E3-017 Birkhoff--von Neumann | V |
| P3-010 | 535-540 | E3-018 matching equality | V |
| P3-011 | 574-584 | E3-020 finite decomposition | V |
| P3-012 | 687-694 | E3-021 rational replication | V |
| P3-013 | 940-977 | E3-029 continuous product degeneracy | V |
| P3-014 | 1048-1065 | E3-032 continuous curvature | V |
| P3-015 | 1086-1097 | E3-034 lsc existence | V |
| P3-016 | 1118-1129 | E3-035 maximal relaxation | V |
| P3-017 | 1150-1156 | E3-036 Brenier equivalence | V |
| P3-018 | 1193-1236 | E3-039 quantile coupling | V |
| P3-019 | 1273-1275 | E3-041 Monge-gap properties | V |
| P3-020 | 1301-1304 | E3-042 affine-difference gaps | V |
| P3-021 | 1351-1353 | E3-044 empirical 1D formula | Correct after CH3-001 hypothesis repair |
| P3-022 | 1447-1463 | E3-046 ccm necessity | V |

All 22 proof environments are present, matched to their statements, and audited line by line. No proof silently assumes attainment except where compactness/boundedness or an earlier existence theorem supplies it.

## Display reconciliation

The audit extracted 90 display starts, including bracket displays, `eql` displays, and the two explicit `equation` environments. The compact matrix below enumerates every display by stable audit ID and physical start line. `V except` means every listed display is valid except the explicitly named IDs.

| Chapter region | Exhaustive display IDs and start lines | Result |
|---|---|---|
| Discrete definitions and product plans | `D3-001@33`, `002@42`, `003@48`, `004@60`, `005@74`, `006@93`, `007@114`, `008@126`, `009@148`, `010@167`, `011@171`, `012@179`, `013@187`, `014@205` | V |
| Sparse LP and north-west plan | `D3-015@226`, `016@231`, `017@257`, `018@338` | V |
| Permutations, Birkhoff, Hall, decomposition | `D3-019@356`, `020@360`, `021@368`, `022@381`, `023@388`, `024@396`, `025@408`, `026@433`, `027@456`, `028@462`, `029@484`, `030@490`, `031@502`, `032@508`, `033@563`, `034@576`, `035@587`, `036@627` | V |
| Rational weights and applications | `D3-037@651`, `038@665`, `039@673`, `040@705`, `041@740`, `042@746`, `043@752` | V |
| LP algorithms | `D3-044@804`, `045@827` | V |
| Continuous marginals and product structure | `D3-046@860`, `047@866`, `048@875`, `049@885`, `050@906`, `051@914`, `052@928`, `053@934`, `054@942`, `055@948`, `056@954`, `057@959`, `058@971`, `059@984`, `060@997` | V |
| Continuous value, curvature, existence, envelope | `D3-061@1017`, `062@1036`, `063@1040`, `064@1051`, `065@1059`, `066@1069`, `067@1107`, `068@1111`, `069@1123` | V |
| Quantile coupling | `D3-070@1185`, `071@1197`, `072@1211`, `073@1221`, `074@1228` | V |
| Monge gap and affine-difference costs | `D3-075@1254`, `076@1265`, `077@1285`, `078@1289`, `079@1296`, `080@1308`, `081@1322`, `082@1335` | V |
| Empirical/RKHS Monge gap | `D3-083@1343`, `084@1365`, `085@1375` | `D3-083` and `D3-085` require CH3-001; `D3-084` is valid |
| Cyclical monotonicity | `D3-086@1419`, `087@1427`, `088@1450`, `089@1470`, `090@1485` | V |

Named display labels were separately checked: `eq-discr-couplings`, `eq-kanto-discr`, `eq-lp-rank-sparsity`, `eq-lp-rank-support-bound`, `eq-transport-log-barrier`, `eq-coupling-generic`, `eq-mk-generic`, `eq-monge-gap`, `eq-monge-gap-self-coupling`, `eq-affine-difference-cost`, `eq-affine-difference-monge-gap`, `eq-affine-difference-subgradient-characterization`, `eq-increasing-rearrangement-map`, `eq-monge-gap-increasing-rearrangement`, `eq-monge-gap-uniform-grid`, `eq-monge-gap-kernel-ridge`, and `eq-monge-gap-kernel-finite`. All are unique and resolve; only the two formulas identified in CH3-001 require the missing orientation hypothesis.

## Algorithm reconciliation

| ID | Lines / label | Objective and invariants | Stopping/correctness | Complexity result |
|---|---|---|---|---|
| A3-001 | 283-312 / `alg:north-west-corner` | Constructs feasibility only, not optimality. `r_i,s_j>=0`; every update preserves assigned plus residual mass; simultaneous exhaustion advances both indices. | Stops after at most `n+m-1` positive allocations; exact marginals; acyclic positive support. | `O(n+m)` allocations and working storage apart from the returned matrix. V. |
| A3-002 | 598-622 / `alg-birkhoff-von-neumann-decomposition` | Residual is nonnegative with every row/column sum `s`; Hall gives each perfect matching; subtraction uses maximal feasible `lambda`; sum of outputs plus residual equals input. | Every nonterminal extraction reaches a proper face; at most `(n-1)^2+1` outputs; exact decomposition. | `O(nE)` per elementary matching, `O(n^3)` dense per term, `O(n^5)` overall. Auxiliary/output-space qualifier is CH3-003. |
| A3-003 | 782-796 / prose transportation/network simplex | Tree basis plus entering arc gives one fundamental cycle; alternating push preserves marginals and changes cost according to reduced cost. | This is not pseudocode and claims no stopping rule. Degenerate zero steps and tied leaving arcs are implementation details; anti-cycling is needed only for a complete chosen pivot rule. | Practical efficiency, exponential worst-case pivots, and polynomial alternatives are correctly distinguished. V; first-pass `CH3-006` retired. |
| A3-004 | 800-839 / log-barrier overview | Positive marginals after deleting zero rows/columns; equality-constrained Newton steps; barrier keeps positivity. One redundant marginal equality must be removed or gauged in an implementation. | Path-following decreases `epsilon` and converges to the LP optimal face; this is approximate, not finite exact solution. | Standard self-concordant polynomial complexity is a valid high-level claim; dense Newton systems are expensive. V. |

The rational-duplication construction at lines 661-694 is a reduction, not a claimed efficient algorithm in binary input size. Its duplicated instance has exactly `N` copies, where `N` is a common denominator. Thus it can be exponential in the bit length of rational weights (for example weights `1/N` and `(N-1)/N` when `N` is binary-encoded). This dependence is visible in the statement and no polynomial-time claim is made, so it is a validated caveat rather than a defect.

## Figure and generator reconciliation

All nine included figure environments were matched to existing one-page PDF assets and executed generator notebooks. Retained outputs were inspected and bounded numerical diagnostics were independently recomputed.

| ID | Source lines / label | Generator | Checks and result |
|---|---|---|---|
| F3-001 | 109-119 / `fig:kantorovich-coupling-polylines` | `notebooks-figures/kantorovich-coupling-polylines.ipynb` | `n=24`; graph/product/optimal masses one; marginal residuals at most `1.39e-17`; supports `24/576/24`; costs `1.1016578/1.0659536/0.31652752`; assignment optimum independently matched. V. |
| F3-002 | 123-136 / `fig:kantorovich-coupling-matrix-marginals` | `notebooks-figures/kantorovich-coupling-matrix-marginals.ipynb` | `n=20`: residual `1.46e-16`, support 35 <= 39. Current exact-kernel rerun at `n=200`: row/column residuals `4.29e-15/6.70e-15`, support 362 <= 399, cost `1.93925936`, independent optimum difference `7.3e-16`. Plotting guards tiny row sums, so output is finite. V. |
| F3-003 | 198-215 / `fig:kantorovich-permutation-versus-splitting` | `notebooks-figures/kantorovich-permutation-versus-splitting.ipynb` | Uniform `12x12` plan is a scaled permutation with support 12. The `12x8` plan has residual `5.55e-17`, support 19, six split source rows and seven merged target columns. V. |
| F3-004 | 450-468 / `fig:birkhoff-von-neumann-cycle` | `notebooks-figures/birkhoff-von-neumann-cycle.ipynb` | Retained matrix has exact unit row/column sums, three unit support edges, and an eight-edge fractional alternating cycle; plus/minus perturbation structure agrees with the proof. V. |
| F3-005 | 646-659 / `fig:matching-resolution-and-weights` | `notebooks-figures/matching-resolution-and-weights.ipynb` | Supports `36`, `36`, and `71`; last equals `36+36-1`. Marginal residuals <= `4.16e-17`; all 18 rectangular targets merge; nonuniform target weights range about `0.00994` to `0.06407`. V. |
| F3-006 | 700-716 / `fig:matching-rational-duplication` | `notebooks-figures/matching-rational-duplication.ipynb` | `N=18,27,36`; zero marginal residual; supports `18,25,27`; collapsed and duplicated assignment costs agree; maximum copy counts `1,2,3`. V. |
| F3-007 | 762-769 / `fig:kantorovich-waddington-ot` | `notebooks-figures/kantorovich-waddington-ot.ipynb` | Uses the retained FLE/WOT preparation and aggregate trajectories; 40,000 aggregate samples, with complete snapshots of 4,556, 5,016, and 7,436 at days 0, 9, and 18. Caption does not claim exact balanced couplings or observed cell identities. V. Official method context: [Waddington-OT tutorial](https://broadinstitute.github.io/wot/tutorial/). |
| F3-008 | 820-837 / `fig:kantorovich-log-barrier-lp-geometry` | `notebooks-figures/kantorovich-log-barrier-lp-geometry.ipynb` | Recomputed central points for `epsilon=1.2,0.18,0.022` are approximately `(0.3891,0.3275,0.2834)`, `(0.6621,0.2113,0.1266)`, `(0.9448,0.03647,0.01875)`; the path approaches the unique LP vertex and stays interior. V. |
| F3-009 | 1389-1394 / `fig:monge-gap-kernel-regression` | `notebooks-figures/monge-gap-kernel-regression.ipynb` | Dimensions, noise regimes, and retained solver termination are consistent, but solve/evaluation kernels differ and hard plotted samples violate monotonicity. CH3-002. |

No generator, PDF, thumbnail, retained notebook output, or source asset was modified.

## Label and cross-reference reconciliation

### Local labels

All 77 label declarations are unique. This exhaustive list is grouped only for readability; each entry is `line:label`.

| Lines | Labels |
|---|---|
| 8-148 | `8:sec-kantorovich`; `14:sec-discrete-relaxation`; `38:def-discrete-couplings`; `42:eq-discr-couplings`; `54:rem-small-transportation-polytopes`; `71:def-discrete-product-coupling`; `82:prop-discrete-product-coupling-degenerate`; `118:fig:kantorovich-coupling-polylines`; `135:fig:kantorovich-coupling-matrix-marginals`; `146:def-discrete-kantorovich-problem`; `148:eq-kanto-discr` |
| 163-283 | `163:prop-discrete-kantorovich-joint-convexity`; `214:fig:kantorovich-permutation-versus-splitting`; `221:prop-lp-rank-sparsity`; `226:eq-lp-rank-sparsity`; `231:eq-lp-rank-support-bound`; `247:prop-sparse-optimal-plans`; `270:prop-northwest-corner`; `283:alg:north-west-corner` |
| 327-598 | `327:prop-1d-weighted-sweep`; `353:def-permutation-matrices`; `377:def-birkhoff-polytope`; `405:def-extreme-points`; `415:prop-extreme-point-existence`; `428:prop-linear-program-extreme-minimizer`; `443:thm-birkhoff-von-neumann`; `467:fig:birkhoff-von-neumann-cycle`; `529:cor-kantorovich-matching`; `560:cor-birkhoff-von-neumann-decomposition`; `598:alg-birkhoff-von-neumann-decomposition` |
| 658-846 | `658:fig:matching-resolution-and-weights`; `661:prop-rational-weights-duplicated-matching`; `715:fig:matching-rational-duplication`; `722:ex-domain-adaptation`; `729:ex-visual-distributions`; `735:ex-cell-population-distance`; `735:ex-single-cell-trajectory-inference`; `768:fig:kantorovich-waddington-ot`; `774:sec-kantorovich-lp-algorithms`; `804:eq-transport-log-barrier`; `836:fig:kantorovich-log-barrier-lp-geometry`; `846:sec-kantorovich-continuous` |
| 857-1105 | `857:def-joint-marginals`; `882:def-continuous-couplings`; `885:eq-coupling-generic`; `902:def-tensor-product-coupling`; `925:prop-product-coupling-degenerate`; `993:rem-kantorovich-book-shifting`; `1015:def-continuous-kantorovich-problem`; `1017:eq-mk-generic`; `1031:prop-kantorovich-value-curvature`; `1081:prop-kantorovich-existence-compact`; `1105:thm-kantorovich-maximal-convex-relaxation` |
| 1142-1375 | `1142:cor-monge-kantorovich-brenier`; `1174:sec-1d-kantorovich-solution`; `1180:prop-1d-kantorovich-quantile-coupling`; `1242:sec-monge-gap`; `1252:def-monge-gap`; `1254:eq-monge-gap`; `1263:prop-monge-gap-properties`; `1265:eq-monge-gap-self-coupling`; `1281:prop-affine-difference-monge-gap`; `1285:eq-affine-difference-cost`; `1289:eq-affine-difference-monge-gap`; `1296:eq-affine-difference-subgradient-characterization`; `1319:def-increasing-rearrangement-map`; `1322:eq-increasing-rearrangement-map`; `1332:prop-monge-gap-one-dimensional`; `1335:eq-monge-gap-increasing-rearrangement`; `1343:eq-monge-gap-uniform-grid`; `1360:par-monge-gap-kernel-regression`; `1365:eq-monge-gap-kernel-ridge`; `1375:eq-monge-gap-kernel-finite` |
| 1393-1443 | `1393:fig:monge-gap-kernel-regression`; `1400:sec-cyclical-monotonicity`; `1415:def:ccm`; `1443:thm:opt_ccm` |

### Reference occurrences

All 85 occurrences resolve. In the exhaustive matrix, `r` denotes `ref` and `e` denotes `eqref`.

| Source lines | Exhaustive occurrences |
|---|---|
| 22-196 | `22e:eq-monge-continuous`; `102r:prop-sparse-optimal-plans`; `107r:fig:kantorovich-coupling-polylines`; `121r:fig:kantorovich-coupling-matrix-marginals`; `196r:fig:kantorovich-permutation-versus-splitting` |
| 230-448 | `230e:eq-lp-rank-sparsity`; `244e:eq-lp-rank-support-bound`; `250e:eq-kanto-discr`; `254r:prop-lp-rank-sparsity`; `263r:prop-lp-rank-sparsity`; `314r:alg:north-west-corner`; `314e:eq-kanto-discr`; `314r:sec-kantorovich-lp-algorithms`; `324r:sec-monge-pbm`; `329e:eq-kanto-discr`; `424r:prop-extreme-point-existence`; `439r:prop-extreme-point-existence`; `448r:fig:birkhoff-von-neumann-cycle` |
| 531-710 | `531e:eq-kanto-discr`; `531r:sec-monge-pbm`; `536r:prop-linear-program-extreme-minimizer`; `536r:thm-birkhoff-von-neumann`; `549r:fig:kantorovich-permutation-versus-splitting`; `575r:prop-linear-program-extreme-minimizer`; `575r:thm-birkhoff-von-neumann`; `632r:alg-birkhoff-von-neumann-decomposition`; `642r:def-discrete-couplings`; `642r:fig:matching-resolution-and-weights`; `656r:fig:matching-2d-cost-exponent`; `696r:thm-birkhoff-von-neumann`; `698r:fig:matching-rational-duplication`; `710r:fig:matching-resolution-and-weights`; `710r:prop-rational-weights-duplicated-matching` |
| 726-923 | `726r:def-barycentric-projection`; `726r:sec-metric-learning-inverse-ot`; `745r:ex-gene-expression-distance`; `759r:ex-unbalanced-single-cell`; `759r:fig:kantorovich-waddington-ot`; `818r:fig:kantorovich-log-barrier-lp-geometry`; `880r:def-joint-marginals`; `890e:eq-discr-couplings`; `923r:prop-discrete-product-coupling-degenerate` |
| 990-1136 | `990r:sec-semidiscr-w1`; `996r:ex-monge-book-shifting-w1`; `1013r:sec-discrete-relaxation`; `1013r:def-discrete-kantorovich-problem`; `1029r:prop-discrete-kantorovich-joint-convexity`; `1068r:def-continuous-kantorovich-problem`; `1079r:def-monge-problem`; `1083e:eq-mk-generic`; `1089r:sec-wasserstein-topology-applications`; `1119r:prop-kantorovich-value-curvature`; `1119r:prop-kantorovich-existence-compact`; `1136r:thm-brenier` |
| 1161-1313 | `1161r:cor-kantorovich-matching`; `1167r:cor-monge-kantorovich-brenier`; `1178r:sec-1d-transport-quantiles`; `1190e:eq-mk-generic`; `1194r:prop-quantile-pushforward`; `1210r:prop-1d-weighted-sweep`; `1246r:thm-brenier`; `1274e:eq-monge-gap-self-coupling`; `1274e:eq-monge-gap`; `1279e:eq-monge-gap-self-coupling`; `1303e:eq-monge-gap-self-coupling`; `1303e:eq-affine-difference-monge-gap`; `1303r:sec-cyclical-monotonicity`; `1306e:eq-affine-difference-cost`; `1306r:def-bregman-divergence`; `1311e:eq-affine-difference-cost`; `1313e:eq-affine-difference-cost` |
| 1330-1490 | `1330r:prop-1d-kantorovich-quantile-coupling`; `1352r:prop-1d-quantile-map`; `1352r:prop-1d-kantorovich-quantile-coupling`; `1352e:eq-monge-gap-increasing-rearrangement`; `1355e:eq-monge-gap-uniform-grid`; `1355r:prop-affine-difference-monge-gap`; `1374e:eq-monge-gap-uniform-grid`; `1374e:eq-monge-gap-kernel-ridge`; `1387r:fig:monge-gap-kernel-regression`; `1392e:eq-monge-gap-kernel-ridge`; `1412r:def:support`; `1437r:cor-kantorovich-matching`; `1444e:eq-mk-generic`; `1490r:rem-kantorovich-book-shifting` |

Imported targets were read at their definitions rather than accepted by name. In particular: the Monge problem and graph couplings, Brenier theorem and sharper non-charging hypothesis, quantile pushforward and 1D Monge map, support, barycentric projection, Bregman divergence, weak topology, semi-discrete cells, and the WOT/unbalanced-OT forward examples all exist and are dimensionally compatible. The retained `.log` contains no undefined reference or citation warning for this chapter.

## Citation-sensitive claim reconciliation

There are 32 key occurrences and 29 distinct keys. Every key exists in the bibliography. `V` means the cited item is relevant to the local claim; bibliographic priority questions are not mathematical defects.

| Key | Lines | Claim checked | Result |
|---|---:|---|---|
| `Kantorovich42` | 10, 30 | Historical relaxation/origin | V |
| `Villani03` | 10 | Classical OT reference | V |
| `Villani09` | 10, 1089 | OT background; Prokhorov/weak compactness | V |
| `rachev1998mass2` | 10 | Mass transportation reference | V |
| `bertsimas1997introduction` | 217 | Fundamental theorem/basic LP sparsity context | V |
| `birkhoff` | 401 | Birkhoff theorem attribution | V |
| `vonNeumann1953assignment` | 401 | Assignment/decomposition attribution | V |
| `Hall1935` | 586 | Marriage theorem | V |
| `korte2012combinatorial` | 634 | Matching algorithms/complexity context | V |
| `brualdi2006combinatorial` | 634 | Combinatorial matrix/decomposition context | V |
| `courty2017optimal` | 726 | OT domain adaptation | V |
| `courty2017joint` | 726 | Joint OT/label-aware adaptation | V |
| `RubTomGui00` | 732 | Earth mover distance for images | V |
| `2014-xia-siims` | 732 | Wasserstein/transport visual distributions | V |
| `2015-solomon-siggraph` | 732 | Convolutional Wasserstein/graphics | V |
| `2013-Bonneel-barycenter` | 732 | Wasserstein barycenters in graphics | V |
| `bonneel2023survey` | 732 | OT computer-graphics survey | V |
| `schiebinger2017reconstruction` | 759 | Waddington-OT population dynamics | V |
| `TongHuangWolfVanDijkKrishnaswamy2020TrajectoryNet` | 759 | Trajectory inference comparison/context | V |
| `LavenantZhangKimSchiebinger2021TrajectoryInference` | 759 | Dynamic trajectory inference | V |
| `KleinUsciddaTheisCuturi2023GENOT` | 759 | Generative neural OT comparison | V |
| `Dantzig51` | 786 | Transportation LP/simplex history | V |
| `bertsekas1988dual` | 793 | Network/dual simplex context | V |
| `Orlin1997` | 793 | Strongly polynomial min-cost-flow/network-simplex theory | V; primary bound has cost-independent branch `O(n^2 m^2 log n)`, resolving former RQ3-003 |
| `nesterov1994interior` | 812 | Interior-point/self-concordant polynomial methods | V |
| `bogachev2007measure` | 1089 | Prokhorov and measure topology | V |
| `SavareSodini2022` | 1131 | Maximal convex/lsc envelope for finite measures | V; stated specialization matches Theorem 4.4 |
| `UsciddaCuturi2023` | 1250 | Monge-gap regularization | V; primary PMLR source checked |
| `rockafellar2015convex` | 1303, 1437 | Cyclic monotonicity and convex subgradients | V |

## Notation, dimension, and normalization audit

| Topic | Check | Result |
|---|---|---|
| Matrix orientation | `P in R_+^{n x m}`, rows indexed by source, columns by target; `P 1_m=a`, `P^T 1_n=b`; objective `<C,P>=sum_ij C_ij P_ij`. | Consistent throughout. |
| Mass convention | Discrete chapter uses probability vectors unless the local sparse/NW propositions explicitly allow equal positive total mass. Continuous chapter uses probability measures. | Consistent; product couplings have total mass one. |
| Nonemptiness | Discrete coupling set requires equal total mass and is nonempty via product after normalization; continuous set is nonempty via `alpha tensor beta`. | Correct. |
| Transportation rank | Of `n+m` marginal equations, exactly one is redundant on active rows/columns, so rank is `n+m-1`; affine dimension is `(n-1)(m-1)` with all positive margins. | Correct. |
| Support bounds | General rank bound is `rank(A)`; transportation specialization is `n+m-1`; degeneracy can make support strictly smaller. | Correct. |
| Birkhoff scaling | `B_n` has row/column sums one; the coupling between uniform measures is `P/n`. Permutation objective scaling is consistently `1/n`. | Correct. |
| Birkhoff dimension | `n^2-(2n-1)=(n-1)^2`; Caratheodory adds one. | Correct, including `n=1`. |
| Rational replication | `P_ij=n_ij/N`; row sums `k_i/N`, column sums `ell_j/N`; assignment cost includes `1/N`. | Correct. |
| Continuous/discrete identification | Atomic coupling mass at `(x_i,y_j)` is `P_ij`; all test-function marginal identities reduce to matrix sums. | Correct. |
| Quantile normalization | Lebesgue measure on `[0,1]` has unit mass and both generalized quantiles push it to the desired laws. | Correct with endpoint changes on null sets irrelevant. |
| Monge-gap variables | Self-coupling is on `(x,z)` with both marginals `alpha`; second map marginal remains `T_sharp alpha`. | Correct. |
| Affine-difference dimensions | `A(x),T(x),y in R^m`; inner products and `L^2` pairings match. | Correct. |
| Bregman argument order | `B_Phi(y|x)` is affine-difference in `y`; reversed order generally is not unless the Hessian is constant/quadratic. | Correct. |
| RKHS dimensions | `K in R^{n x n}`, `q,y in R^n`, fitted samples `Kq`, norm `q^T Kq`. | Correct under the intended positive grid orientation; generator issue CH3-002. |
| Grid orientation | The formula uses index order as increasing spatial order. | Positive spacing is contextually intended but should be stated: CH3-001. |

## Topology and arbitrary-measure audit

| Topic | Required assumptions and audit outcome |
|---|---|
| Measure class | Imported notation defines Borel/Radon probability measures on the stated metric spaces. Marginals are pushforwards by continuous coordinate projections. |
| Measurability | The continuous cost is nonnegative Borel for the value definition, so its extended integral is defined. Lower-semicontinuous costs are Borel. |
| Tightness | On Polish spaces, each fixed marginal is tight. Compact `K_X,K_Y` give uniform tightness of all couplings by the union bound. |
| Prokhorov | Uniform tightness yields relative weak compactness; fixed marginals define a weakly closed set, hence compactness. Correctly used at lines 1087-1089. |
| Lower semicontinuity | Portmanteau applies directly to nonnegative extended lsc costs. This supports both attainment and the value's lsc argument. |
| Finiteness | Existence does not require a finite value: a minimizer with value `+infinity` still exists. The ccm theorem separately assumes a finite value and finite continuous cost. |
| Maximal relaxation | Compact metric ground spaces and finite continuous cost make the domain compact and `MK_c` finite/proper. Jensen's inequality is legitimate for proper lsc convex `F`; Dirac domination then bounds `F` above by every plan cost. |
| Graph plans | `(Id,T)_sharp alpha` has the correct marginals exactly when `T_sharp alpha=beta`. Graph plans need not be weakly closed. General atomless density is deferred (RQ3-001). |
| Support | The ccm section uses topological support of a Radon measure. Continuity is exactly what upgrades a strict finite violation at support points to uniform neighborhood inequalities. |
| Terminology | The sole topology/geometry terminology defect is calling the continuous coupling set a polytope (CH3-004). |

## Boundary and equality-case audit

| Case | Outcome |
|---|---|
| Zero discrete masses | Product/additive statements restrict to active support. North-west code advances zero residuals because `eta=0`; sparse dimension should be read after deleting zero rows/columns. No false positivity claim. |
| Zero total mass | Chapter coupling definitions use probabilities. The general NW proposition explicitly assumes equal positive total mass, avoiding a vacuous final step. |
| `n=1` or `m=1` | Sparse bound, north-west plan, Birkhoff dimension, Hall decomposition, and Caratheodory count reduce correctly. |
| Degenerate LP optimum | Statements assert existence of a sparse/extreme optimizer, not sparsity of every optimizer. Flat optimal faces and fractional convex combinations are acknowledged. |
| Tied costs/Monge arrays | Convex uncrossing gives nonincrease; strict convexity is invoked only for exclusion/uniqueness. Equal coordinates and repeated target values allow equality as expected. |
| Rational degeneracy | Integral optimal vertices exist, but fractional optimal couplings can coexist; explicitly and correctly stated. |
| Extended cost `+infinity` | Continuous value and convexity proof use nonnegative extended integrals. The ccm theorem avoids this issue by taking finite continuous cost. |
| Book shifting | Equality iff `y>=x` plan-a.s.; multiple graph and nongraph optimizers. Correct except CH3-004 terminology. |
| Brenier source condition | Absolute continuity gives uniqueness, but is not necessary; CH3-005 repairs the word `exactly`. |
| Quantile atoms | Common ranks split atoms without requiring a deterministic source map. No uniqueness beyond what is proved. |
| Strictly convex 1D cost | With atomless source, increasing rearrangement is unique a.e.; with atoms the theorem claims optimality only. |
| `p=1` | Non-strict uncrossing and nonuniqueness are explicitly preserved. |
| Uniform grid | For `Delta>0`, the stated hinge counts descending index inversions. For `Delta<0`, source order reverses and the correct hinge is `(2|Delta|/n) sum_{i<j}(t_j-t_i)_+`. Positive orientation is implicit but should be explicit: CH3-001. Ties contribute zero. |
| CCM rectangles overlap | The proof's harmonic bound on `lambda` controls summed restriction densities, so no hidden disjointness assumption is needed. |

## Complexity audit

| Method/result | Exact audit conclusion |
|---|---|
| Generic sparse LP | Existential support reduction; not an algorithmic polynomial bound. Rank rather than affine dimension is correctly used for the homogeneous kernel argument. |
| North-west corner | Linear number of allocations, cost-blind feasible initializer, not an OT optimizer. Degenerate bases need zero basic entries. |
| Birkhoff decomposition | At most `(n-1)^2+1` terms. Elementary BFS matching gives `O(nE)` per term and dense `O(n^5)` operation upper bound. Arithmetic/graph-operation count is expressly not bit complexity. Explicit-output memory correction is CH3-003. |
| Rational duplication | Instance size is `N`, the common denominator, so the construction is pseudo-polynomial and may be exponential in binary encoding length. The text does not claim otherwise. |
| Transportation/network simplex | Efficient graph pivots in practice; unrestricted/widely used pivot rules can have exponentially many pivots. The prose is an overview and asserts no unspecified-rule termination; first-pass CH3-006 is retired. |
| Strongly polynomial min-cost flow | The high-level distinction from practical simplex is valid. `Orlin1997` gives a primal network-simplex bound with a cost-independent `O(n^2 m^2 log n)` branch; former RQ3-003 is resolved. |
| Interior point | Polynomial path-following gives prescribed-accuracy solutions to the rational LP; it is not a finite combinatorial exact method. The text says the parameter is decreased and does not conflate it with fixed-temperature entropic OT. |
| RKHS optimization | Finite convex program after `Delta>0`; global optimization claim is analytical. The retained numerical plot uses inconsistent solve/evaluation kernels (CH3-002). |

## Prioritized repair order

1. **CH3-002 (Moderate):** make the regression notebook solve and evaluate one declared kernel, regenerate `paths.pdf`, and verify the visible hard-fit sample values satisfy monotonicity.
2. **CH3-001 (Minor):** add `Delta>0` or `x_1<...<x_n` in the empirical proposition and RKHS setup.
3. **CH3-003 (Minor):** qualify line 634 as auxiliary memory and state compact returned-output space separately.
4. **CH3-005 (Minor):** replace density necessity by the singleton-conditional/subdifferential condition and describe absolute continuity as sufficient.
5. **CH3-004 (Minor):** replace `coupling polytope` by `convex coupling set`.
6. Decide only as scope whether to add the results in active `RQ3-001` and `RQ3-002`; neither is a defect repair. No action is required for retired `CH3-006` or resolved `RQ3-003`.

## Mechanical reconciliation and closure

### Defect and question IDs

- Serialized finding IDs are exactly `CH3-001` through `CH3-006`: 6 unique, sequential IDs, no gaps. Active findings are `CH3-001`--`CH3-005`; `CH3-006` is retired.
- Active severity partition is exactly 0 Critical + 0 Major + 1 Moderate + 4 Minor = 5 findings. Retired IDs contribute zero to this equation.
- Research-question IDs are exactly `RQ3-001` through `RQ3-003`: `RQ3-001` and `RQ3-002` remain active scope questions; `RQ3-003` is resolved/retired. All RQs are excluded from defect totals.
- Validated-ledger IDs are exactly `VC3-001` through `VC3-030`: 30 entries.
- Structural inventories reconcile to 1 chapter, 5 sections, 22 paragraphs, 46 theorem-counter environments, 22 proofs, 2 formal algorithms, 9 figures, 90 display starts, 77 unique labels, 85 reference occurrences, 32 citation-key occurrences, and 29 distinct bibliography keys.

### Source preservation

| Check | Initial | Final |
|---|---:|---:|
| Physical lines | 1,495 | 1,495 |
| Bytes | 104,820 | 104,820 |
| SHA-256 | `566cc6781bbe5f3b9cdc982cff44e718073f0ab4db82601435d37afe05bfe539` | `566cc6781bbe5f3b9cdc982cff44e718073f0ab4db82601435d37afe05bfe539` |

Equal byte counts and equal SHA-256 values establish that `/Users/gpeyre/Dropbox/github/ot4ml/OT4ML/sections/kantorovich.tex` was preserved byte-for-byte.

### Report and write-scope checks

- Report path: `/Users/gpeyre/Dropbox/github/ot4ml/audit-chap3.md`.
- Incoming first-pass report SHA-256: `69ea2f3e2b7e8f3279bd414d49fed76531e0d0bb754aec1663210cce1e3604f6`.
- Report physical lines: `00000000000000495`.
- Report bytes: `00000000000062889`.
- Report non-ASCII byte count: `000000000000000000000`.
- Open-work marker count after reconciliation: `000000000000000000000000`.
- Required sections present: title/scope/baseline, exact executive counts, findings with repairs and impact, RQs, validated ledger, all requested matrices, notation/topology/boundary/complexity audits, repair order, and mechanical closure.
- Workspace write scope: only `audit-chap3.md` was created or modified by this audit. The chapter, bibliography, notebooks, figures, assets, retained outputs, logs, and generated files were read-only.

Audit closed after the independent second adversarial reread. No active defect exists outside `CH3-001`--`CH3-005`; retired `CH3-006` is mechanically preserved, no `CH3-007` was warranted, and no RQ is included in defect totals.
