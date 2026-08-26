# Chapter 13 Second Adversarial Audit: Beyond Comparing Measures

## Scope and method

This report is a fresh second-pass audit of the current on-disk file `OT4ML/sections/beyond-comparing-measures.tex`, not Git HEAD. The first-pass report was treated only as an inventory and a list of hypotheses: every one of its five proposed findings was attacked again from the source and imported conventions. The audited source has 2,755 physical lines and 190,051 bytes. Its SHA-256 at the start of this pass was `c58adf8f6fb10ba9a1f8a9f78e7564ed28707f98e4a28473e2f114b64fa27aa1`. The first-pass report hash was independently verified as `7636a45991ec3858e44b769e76ea909c58bf119c3f53ab3657fc27553e1b2b4a` before this rewrite.

Every source line was reread. The pass re-derived the claims involving vector and matrix mobilities, iterated Wasserstein spaces, all GW variants and normalizations, stationarity and conditional concavity, cost-learning and Gaussian formulas, Monge maps, biconvex/entropic/fused formulations, GH and infinite-order comparisons, quantum couplings and scaling, and discrete/continuous/soft DTW. It checked all 29 proofs, 195 top-level display blocks, 66 named mathematical environments, four algorithms, nine figures, 17 included PDFs, 226 TeX reference occurrences, and 70 citation commands. Imported Bures/Gaussian, entropy, kernel, Wasserstein-topology, and Monge conventions were read where they control correctness.

All nine retained generator notebooks and their retained diagnostics were rechecked against the captions and visible outputs. A bounded 18-point residual diagnostic was run in memory; expensive experiments were not rerun. Primary-source checking was deliberately bounded once citation scope was resolved. No chapter source, bibliography, notebook, figure, generated asset, or other repository file was edited.

## Correction implementation - 2026-08-26

The scope and source identities above record the completed read-only audit phase. The audit itself is preserved below as the pre-correction record. All seven active findings have now been corrected in `OT4ML/sections/beyond-comparing-measures.tex`; the retired editorial observation `ED13-001` has also been resolved.

| Issue | Resolution implemented | Mathematical check |
| --- | --- | --- |
| CH13-001 | Definition `def-gromov-wasserstein` now assumes that the two-variable distortion metric is lower semicontinuous in the ordinary topology and uses the natural distortion-dependent size $\mathsf S_{\Delta,p}(\mathbb X)^p=\iint\Delta(d_X(x,x'),0)^p\,d\alpha(x)d\alpha(x')$. Both spaces must have finite size. The ordinary distance-moment condition is recovered when $\Delta(r,s)=|r-s|$. The infinite-order definition now also requires lower semicontinuity, ensuring measurability. | The metric triangle inequality and Minkowski bound every feasible objective by $\mathsf S_{\Delta,p}(\mathbb X)+\mathsf S_{\Delta,p}(\mathbb Y)$. Weak continuity of $\pi\mapsto\pi\otimes\pi$, lower semicontinuity of the integrand, and weak compactness of the coupling set give attainment. GW to the one-point space equals the stated size. |
| CH13-002 | The deterministic Gaussian component interpolation now first assumes all component covariances are positive definite and points to `eq-bures-map`. For singular covariances, the text explicitly chooses minimizing square factors in the Procrustes formula, couples the components through one $d$-dimensional standard Gaussian variable, and interpolates that random pair. | For positive-definite sources the affine Brenier map exists and yields the displayed covariance. For arbitrary PSD endpoints the factor construction has the prescribed marginals and quadratic cost equal to the mean cost plus the Bures term; it is therefore optimal. The law of $(1-t)X+tY$ is Gaussian and is a valid $W_2$ geodesic. Possible nonuniqueness at singular endpoints is now stated. |
| CH13-003 | The prose, panel label and caption now identify exactly what the retained notebook displays: the absolute residual between separately max-normalized squared-Euclidean dissimilarities. The text states that its entrywise square, not the displayed residual itself, is the local square-loss integrand. | The printed formula matches `ot.dist` with POT's `sqeuclidean` default, the two independent maximum normalizations, `res = abs(C1-C2[match,match])`, and `loss_fun='square_loss'`. No numerical asset needed regeneration. |
| CH13-005 | The soft-DTW paragraph now fixes $\epsilon>0$. The hard value at zero is introduced only through the one-sided extension $\mathrm{sDTW}_{c,0}:=\mathrm{DTW}_c$, and the zero-temperature limit is written $\epsilon\downarrow0$. | Every log-sum-exp, partition, Gibbs, entropy and derivative formula is now used only where division by the temperature and strict Gibbs convexity are valid. |
| CH13-006 | Definition `def-fused-gromov-wasserstein` now includes the finite distortion-size domain, assumes a lower-semicontinuous feature cost with finite product-measure integral, and explicitly omits the feature term at the pure-GW endpoint. | The structural term is finite on every coupling, the product coupling is a finite competitor, and the sum is lower semicontinuous on a weakly compact coupling set. Hence the printed minimum is attained. The endpoint convention also removes the possible ambiguity $0\cdot(+\infty)$ at $\lambda=1$. |
| CH13-007 | Definition `def-gromov-hausdorff-distance` now states that the infimum ranges over common metric spaces and isometric embeddings of both input spaces. | Constant maps are no longer admissible. The standard correspondence formula and Proposition `prop-gh-gm-gw-infinity` now follow from the literal printed definition. |
| CH13-008 | Figure `fig:vector-valued-measure-geodesics` now says that glyphs encode fibers after channelwise normalization and nonlinear magnitude compression, so their directions and lengths are qualitative rather than proportional. | This matches the generator's separate channel scales, anisotropic display factors, `tanh` compression, thresholding and clipping. The underlying interpolation is unchanged. |
| ED13-001 | The broken forward promise after the discrete GW definition was removed. The cautious complexity statement now cites `Kravtsova2024GWComplexity` directly and distinguishes relaxed GW from hard QAP. | The cited revision explicitly notes that nonconvexity is not an NP-hardness proof and reports neither a known hardness reduction nor a general polynomial-time exact algorithm. |

### Refinement pass - 2026-08-26

The correction set was audited a third time against its downstream uses. This pass made the singular Gaussian construction dimensionally explicit, moved every fused-GW existence assumption and the $\lambda=1$ convention into the definition itself, and corrected the finite-space specialization to $\X=\{1,\ldots,n\}$ and $\Y=\{1,\ldots,m\}$, consistently with $\distD\in\RR^{n\times n}$, $\distD'\in\RR^{m\times m}$ and $\P\in\RR^{n\times m}$. The resulting page shift exposed a split-frame warning at Definition `def-continuous-dtw`; inlining the two short warping-path displays and tightening the continuous-DTW pitch removed the warning without adding a page. No further mathematical defect was found in the other five repairs.

### Post-correction verification

- `git diff --check` passes for the corrected chapter and this audit file.
- A complete `latexmk` build succeeds and produces a 494-page `OT4ML.pdf`. The final log contains no undefined references, undefined citations, LaTeX errors, or Chapter 13 overfull boxes.
- The two figure notebooks implicated by the corrections retain executed outputs with no recorded exceptions: five executed cells for `vector-valued-measure-geodesics.ipynb` and three for `gromov-nonisometric-distortion.ipynb`. Their numerical assets were not regenerated because the defects concerned only their mathematical interpretation in the prose and captions.
- The affected printed pages 282, 285--288, 292, 305--307, and 317--319 were rendered from the final PDF and inspected. Definition boxes, equations, captions, references, and page breaks are legible and unclipped.
- The corrected chapter has 2,766 physical lines after the refinement pass.

## Executive summary

| Severity | Count |
| --- | ---: |
| Critical | 0 |
| Major | 0 |
| Moderate | 5 |
| Minor | 2 |
| **Total established defects** | **7** |

The active defect register is `CH13-001`, `CH13-002`, `CH13-003`, `CH13-005`, `CH13-006`, `CH13-007`, and `CH13-008`. `CH13-004` is retired: it identifies a real broken prose promise, but the second pass classifies that as editorial observation `ED13-001`, not a mathematical defect. New IDs `CH13-006` through `CH13-008` are contiguous.

No central theorem, proof, or algorithm was found false. The five Moderate defects are: the domain of general-distortion GW does not ensure measurability, finiteness, or attainment; Gaussian component interpolation silently requires a usable Monge map; the GW residual caption confuses raw distances, squared dissimilarities, and square-loss contributions; fused GW writes a minimum for a merely measurable feature cost; and the GH definition omits the isometric-embedding constraint. The two Minor defects are the missing positive-temperature domain for soft-DTW and a vector-glyph caption that says `proportional` despite nonlinear, channelwise display normalization.

## Second-pass disposition

| First-pass ID | Old status/severity | Second-pass disposition | New severity | Rationale |
| --- | --- | --- | --- | --- |
| CH13-001 | Hypothesis / Moderate | Retained and broadened | Moderate | The ordinary `d^p` size condition fails for general `De`; compactness alone does not fix an arbitrary non-Borel or discontinuous `De`; `\umin` also needs lower semicontinuity for attainment. |
| CH13-002 | Hypothesis / Moderate | Retained and narrowed | Moderate | PSD Gaussian endpoints have optimal couplings and Wasserstein geodesics, but a deterministic affine map from a singular source need not exist. Positive definiteness of each active source covariance is sufficient; target positive definiteness is not necessary. |
| CH13-003 | Hypothesis / Moderate | Retained and numerically confirmed | Moderate | POT's local signature confirms `ot.dist(..., metric='sqeuclidean')`; the notebook normalizes each squared matrix separately, plots `abs(C1-C2)`, and optimizes its square. |
| CH13-004 | Hypothesis / Minor | Removed from defect register; retired ID | Not a defect | The promised discussion is absent, but the current primary source supports the cautious complexity sentence. This is a broken editorial promise, recorded as ED13-001. |
| CH13-005 | Hypothesis / Minor | Retained | Minor | No nearby or imported convention declares `epsilon>0`; unlike entropic GW, zero is not separately defined. Every displayed log/Gibbs formula requires positive temperature. |

## Established findings

### CH13-001 - General-distortion GW lacks the required analytic domain

**Severity:** Moderate.

**Location:** lines 469-477, Definition `def-metric-measure-space`; lines 481-492, Definition `def-gromov-wasserstein` and `eq-gw-generic`; formal downstream use at lines 894-940.

**Problematic claim:** The chapter says that the finite ordinary size moment

```tex
\int d_X(x,x')^p\,d\alpha(x)d\alpha(x')<+\infty
```

is the additional condition for finite `p`-GW, then permits an arbitrary metric `De` on `[0,+infinity)` and writes an attained minimum.

**Why it is wrong:** For a fixed object, the natural generalized size is

```tex
S_{De,p}(X)^p = \int De(d_X(x,x'),0)^p\,d\alpha(x)d\alpha(x').
```

Finiteness of this quantity is necessary if the class includes the one-point space: GW to a singleton is exactly `S_{De,p}(X)`. It is also sufficient pairwise, because

```tex
De(d_X,d_Y) <= De(d_X,0)+De(d_Y,0),
```

so Minkowski controls the cost under every coupling. For one particular pair, the exact weaker requirement is the existence of a coupling `pi` for which `De(d_X,d_Y)` belongs to `L^p(pi tensor pi)`.

The ordinary moment does not imply the generalized one. Let `X=R_+`, let `alpha` be exponential with rate one, let `Y` be a singleton, and set

```tex
De(r,s)=|exp(r)-exp(s)|.
```

Then every polynomial moment of `|X-X'|` is finite. On `{X>=2, 0<=X'<=1}`, however, `|X-X'|>=X-1`, and the cost density is bounded below by a constant times `exp((p-1)X)`. Its tail integral diverges for every `p>=1` (constant tail when `p=1`, exponential growth when `p>1`).

There are two further analytic gaps in the same root definition. A metric on the set `[0,+infinity)` need not be Borel or lower semicontinuous relative to the ordinary topology used by `d_X` and `d_Y`, so the integrand need not be measurable. Even for a measurable finite integrand, `\umin` is unjustified without lower semicontinuity; fixed-marginal coupling sets are weakly compact, but a merely measurable objective need not attain its infimum. Compact `X,Y` only bounds ordinary distance values. It does not make an arbitrary incompatible metric `De` bounded, Borel, or continuous on those values.

**Smallest correct repair:** Require `De` to be lower semicontinuous (hence Borel) for the ordinary topology and replace the ordinary size condition by `S_{De,p}(X)<+infinity`. This gives a measurable lower-semicontinuous objective, finite competitors, and attainment. If only Borel measurability is desired, write `inf` rather than `min`. The simpler repair is to restrict the chapter's metric theory to `De(r,s)=|r-s|`, for which the stated ordinary moment is sufficient.

**Downstream impact:** The compact results that explicitly assume continuous `De`, and all metric results using `De=abs`, remain valid. The unrestricted Definition `def-gromov-wasserstein`, its claim of finiteness, and formal stationarity statements without absolute-convergence hypotheses are affected. No retained figure relies on the pathological generality.

### CH13-002 - Gaussian WoW interpolation assumes a Monge map unavailable at singular sources

**Severity:** Moderate.

**Location:** lines 282-312 in `Transport between random measures`, especially lines 298-306. Imported convention: `OT4ML/sections/monge.tex`, Definition `def-bures-metric` (PSD covariances) and Proposition `prop-gaussian-w2-bures` (map formula under positive-definite covariances).

**Problematic claim:** For every active Gaussian component pair, the text invokes "the Brenier linear part from `Sigma_i` to `Lambda_j`" and uses it in the covariance interpolation, while the imported Gaussian/Bures notation permits positive semidefinite covariances.

**Why it is wrong:** Take `Sigma_i=0` and `Lambda_j=I`. The source Gaussian is a Dirac mass. For every deterministic affine linear part `A`,

```tex
A Sigma_i A^T = A 0 A^T = 0 != I,
```

so no affine map, Brenier or otherwise, pushes that source to the nondegenerate target. This does not invalidate the Bures distance: an optimal Gaussian coupling exists for all PSD covariances, and displacement interpolation under such a coupling is a valid Gaussian Wasserstein geodesic. What fails is specifically the deterministic map representation from a singular source.

The exact uniform sufficient condition for the displayed orientation is `Sigma_i` positive definite for every active source component. The target `Lambda_j` may remain PSD: with `Sigma_i` invertible,

```tex
A = Sigma_i^{-1/2}
    (Sigma_i^{1/2} Lambda_j Sigma_i^{1/2})^{1/2}
    Sigma_i^{-1/2}
```

is symmetric PSD, pushes the Gaussian source to the possibly singular target, and is the Brenier map because the source is absolutely continuous.

**Smallest correct repair:** Add `Sigma_i positive definite for every active pair` (or, more simply and symmetrically, assume all component covariances positive definite). To retain arbitrary PSD endpoints, replace `A_{i,j}` by an optimal jointly Gaussian coupling and define the interpolant as `((1-t)x+ty)_sharp gamma_{i,j}`; state that singular endpoints can yield nonunique geodesics and need not admit a deterministic source map.

**Downstream impact:** The WoW metric, component cost, collapsed path as a mixture of component geodesics, and collapse non-expansiveness are unaffected. Figure `fig:kantorovich-wow-mixtures` uses strictly positive one-dimensional standard deviations and is unaffected.

### CH13-003 - The GW residual figure displays neither the stated raw residual nor the square-loss contribution

**Severity:** Moderate.

**Location:** lines 787-803, Figure `fig:gromov-nonisometric-distortion`, especially panel label lines 795-796 and caption line 798. Generator: `notebooks-figures/gromov-nonisometric-distortion.ipynb`, code containing `gw_plan`, `match`, and `res`.

**Problematic claim:** The panel is labeled `|d_X-d_Y o sigma|`, and the caption says the displayed matrix is "the local contribution minimized" by the discrete GW objective.

**Why it is wrong:** The generator calls `ot.dist(x,x)` and `ot.dist(y,y)` without a metric argument. The locally installed POT signature is `metric='sqeuclidean'`. It then performs

```python
C1 /= C1.max()
C2 /= C2.max()
res = abs(C1 - C2[np.ix_(match, match)])
```

and solves with `loss_fun='square_loss'`. Therefore the displayed entry is

```tex
r_{ii'} = | ||x_i-x_i'||^2/M_X
           - ||y_{sigma(i)}-y_{sigma(i')}||^2/M_Y |,
```

where `M_X` and `M_Y` are separate maxima. It is not the raw Euclidean distance residual. Under square loss, the local integrand is `r_{ii'}^2`, and for the uniform hard correspondence its contribution to the total objective is `r_{ii'}^2/n^2`, not `r_{ii'}`. Separate normalization also removes relative scale rather than applying one common unit conversion.

The bounded diagnostic reproduces the identity hard match on 18 points, maximum displayed residual `0.468223`, mean displayed residual `0.127274`, and hard square-loss objective `0.0362304`; the plotting cap `.75` does not clip this instance. These values confirm the power distinction rather than changing it.

**Smallest correct repair:** Keep the output and change the panel/caption to "absolute residual between separately max-normalized squared-Euclidean dissimilarities; its square is the local square-loss integrand." Alternatively regenerate with Euclidean distances and display squared residuals if the intent is to show the objective contribution.

**Downstream impact:** The qualitative localization of deformation remains useful, and the discrete solver is valid because the chapter permits powers of distance matrices. Only the figure's quantitative interpretation and normalization are wrong; no theorem uses the panel.

### CH13-006 - Fused GW does not attain a minimum for a merely measurable feature cost

**Severity:** Moderate.

**Location:** lines 1721-1733, Definition `def-fused-gromov-wasserstein` and `eq-fused-gromov-wasserstein`; downstream `argmin` language at lines 1747-1791.

**Problematic claim:** The definition assumes only that `c_{X,Y}:X times Y -> R_+` is measurable but uses `\umin`, i.e. an attained minimum.

**Why it is wrong:** The failure persists even on compact spaces and at the valid endpoint `lambda=0`. Let `X=Y=S^1` with uniform measure and geodesic distance `d`, and define the bounded Borel cost

```tex
c(x,y) = d(x,y)  if x != y,
         1       if x = y.
```

This cost is strictly positive everywhere. Couplings supported on the rotation graph `y=x+delta` have cost `delta`, so the infimum is zero as `delta downarrow 0`. No coupling attains zero, because the integral of a strictly positive measurable function against a probability measure cannot vanish. Thus the displayed `min` need not exist.

**Smallest correct repair:** Either assume `c_{X,Y}` is lower semicontinuous (continuous in the intended feature-embedding examples) and keep `min`, or retain measurability and replace `min`/`argmin` by `inf` plus explicit existence hypotheses wherever an optimizer is used. For regularized block updates, impose the same lower-semicontinuity/finite-cost conditions needed by the chosen OT solver.

**Downstream impact:** The definition and optimizer-based discussion are false at the stated measurable generality. The finite discrete formulation and Figure `fig:fused-gromov-feature-geometry`, which use a continuous squared-Euclidean feature cost, are unaffected.

### CH13-007 - The Gromov--Hausdorff definition omits isometric embeddings

**Severity:** Moderate.

**Location:** lines 1841-1852, Definition `def-gromov-hausdorff-distance`, especially `eq` display lines 1846-1851; downstream Proposition `prop-gh-gm-gw-infinity`, lines 1872-1892.

**Problematic claim:** The definition writes

```tex
d_GH(X,Y) = inf_{Z,phi,psi} d_H^Z(phi(X),psi(Y))
```

without saying that `Z` is a common metric space and `phi:X->Z`, `psi:Y->Z` are isometric embeddings.

**Why it is wrong:** Read literally, choose `Z` to be a singleton and take both maps constant. Their images coincide, so the displayed infimum is zero for every pair of compact metric spaces. This contradicts the immediately following separation claim and destroys the relation to correspondence distortion.

**Smallest correct repair:** State explicitly that the infimum ranges over all metric spaces `Z` and all isometric embeddings `phi:X hookrightarrow Z` and `psi:Y hookrightarrow Z`. Equivalently, use the standard admissible-metric formulation on the disjoint union.

**Downstream impact:** The later factor-two correspondence identity and the proof of `prop-gh-gm-gw-infinity` are correct under the standard repaired definition. The defect is localized but essential: without the missing admissibility clause, the named definition collapses identically to zero.

### CH13-005 - Soft-DTW omits the positive-temperature domain

**Severity:** Minor.

**Location:** lines 2659-2733, equations `eq-dtw-softmin` through `eq-soft-dtw-divergence`, especially lines 2660-2664.

**Problematic claim:** Soft-DTW is introduced with a parameter `epsilon` but no domain restriction.

**Why it is wrong:** At `epsilon=0`, log-sum-exp, the partition function, and the Gibbs law divide by zero. At `epsilon<0`, the expression softens a maximum rather than a minimum in the asserted sense, the entropy minimization sign changes, and the zero-temperature bounds reverse or fail. The hard DTW value is the one-sided limit as `epsilon downarrow 0`, not the value of the displayed formulas at zero. Unlike lines 1497-1506 for entropic GW, this paragraph supplies no separate zero convention.

**Smallest correct repair:** Begin the soft-DTW paragraph with "Fix `epsilon>0`." If desired, define `sDTW_{c,0}=DTW_c` separately by continuous extension.

**Downstream impact:** Every displayed identity and derivative is correct for positive temperature. Figure `fig:dynamic-time-warping` uses `epsilon=.200` and is unaffected.

### CH13-008 - The vector arrows are not proportional to the local fiber values

**Severity:** Minor.

**Location:** lines 102-114, Figure `fig:vector-valued-measure-geodesics`, especially caption line 111. Generator: `notebooks-figures/vector-valued-measure-geodesics.ipynb`, function `draw_positive_vector_glyphs`.

**Problematic claim:** The caption says, "Each arrow is proportional to the local fiber value `(u_t^1(x),u_t^2(x))`."

**Why it is wrong:** Before drawing, the generator divides the two channels by distinct global quantiles `U_scale` and `V_scale`. It then compresses magnitude through `tanh(mag/mag_scale)`, uses different coordinate factors `.205` and `.078`, and suppresses glyphs below a threshold. The resulting arrow is a nonlinear, anisotropically scaled encoding of the fiber, not a scalar multiple of the original two-vector.

**Smallest correct repair:** Replace `proportional` by "encodes after channelwise normalization and nonlinear magnitude compression," or render both components with one common linear scale and no nonlinear magnitude map.

**Downstream impact:** The endpoint, conservation, exact diagonal quantile interpolation, and explicitly illustrative coupled interpolation remain valid. Only the visual quantitative reading of arrow direction/length is affected.

## Editorial observation

### ED13-001 - Broken complexity forward promise (retired CH13-004)

**Location:** line 420; promised destination after `eq-gw-zero-marginal-space`, lines 952-956.

Line 420 promises that the precise complexity status and references will be given after `eq-gw-zero-marginal-space`, but no such paragraph or citation appears there or later. The current February 2026 revision of `Kravtsova2024GWComplexity` supports the chapter's cautious mathematical sentence: it retracts the inference from non-convexity to NP-hardness, reports no known NP-hardness reduction, and reports no known polynomial-time general algorithm. The sentence is therefore not an established mathematical defect. The missing promised support is an editorial traceability issue. The smallest editorial repair is to cite that revision at line 420 and remove the forward promise, or add the promised paragraph after line 956.

## Unresolved research or scope questions

The following **four** items are not counted as defects.

| ID | Location | Question/status | Audit disposition |
| --- | --- | --- | --- |
| RQ13-001 | line 420 | Exact complexity of relaxed finite metric GW | The February 2026 primary revision supports "no proof/no polynomial algorithm known," but a bounded audit cannot certify an exhaustive negative literature claim for all future work. |
| RQ13-002 | lines 1257-1395 | Exact unrestricted squared-distance GW between general Gaussian pairs | The chapter correctly separates Gaussian-constrained formulas, known equality cases, and its explicit non-Gaussian counterexample; a complete characterization remains open. |
| RQ13-003 | lines 2186-2194 | Monge minimizers for classical square-root transport with atomless marginals | The finite nonmonotone example defeats a naive Brenier identification but does not settle existence under general atomless hypotheses; the chapter says so. |
| RQ13-004 | lines 2726-2744 | Positivity of the debiased soft-DTW functional for ordinary squared Euclidean cost in full generality | The cited primary result proves narrower cost classes and only qualified equal-length/stationarity or numerical statements for squared cost; the chapter does not overclaim. |

## Validated-correct ledger

The following **36** important claim clusters were independently re-derived or checked. A qualified entry means that the claim is correct after applying the finding named in the row.

| Lines | Claim cluster | Result |
| --- | --- | --- |
| 27-71 | Positive vector measures and dynamic perspective | Convexity, one-homogeneity, conservation, time reversal, and separation mechanisms check. |
| 73-95 | Diagonal/coupled linear mobilities | Matrix-fractional convexity, common-mode PSD structure, and weighted product reduction check. |
| 96-114 | Vector figure interpolation | Endpoints and diagonal quantile paths check; right path is explicitly illustrative; glyph proportionality is CH13-008. |
| 121-186 | Matrix action and diagonal reduction | Tensor dimensions, trace, pseudoinverse range convention, and scalar reduction check. |
| 188-204 | Matrix figure | PSD, conserved matrix mass, and retained continuity residuals match; coupled path is labeled illustrative. |
| 223-233 | Wasserstein space is Polish/compact | Gluing completeness, separability, and compactness proof check. |
| 239-281 | Random laws, collapse, and WoW metric | Outer moment condition, collapsed moment identity, and iterated metric domain check. |
| 282-312 | Gaussian component path | Bures cost correct; map formula valid under the source nondegeneracy repair in CH13-002. |
| 335-361 | Collapse is non-expansive | Measurable near-optimal coupling kernel and constant-one bound check. |
| 365-386 | Local profile laws | Pushforward and moment assertions check. |
| 481-544 | Finite/infinite GW | Compact continuous-`De` attainment and `p->infinity` proof check; general definition is qualified by CH13-001. |
| 550-589 | GW/WP/W comparison | Reverse triangle, rigid registration, and factor two check. |
| 593-666 | GW metric theorem | Zero class, support isometry, gluing, and Minkowski proof check. |
| 668-693 | Completeness and quotient topology | Equilateral counterexample and fixed-dimensional Euclidean topology comparison check. |
| 703-785 | Marginal stability and geodesics | Constant-two stability and constant-speed product-support construction check. |
| 810-880 | Profile lower bound and sandwich | Conditional profile couplings and every factor check. |
| 895-946 | First-order stationarity | Gradient factor two, normal-cone sign, and frozen-OT equivalence check; no sufficiency claim. |
| 948-1003 | Conditional concavity | Zero-marginal cancellation and tensor-feature sign check. |
| 1007-1059 | Extreme points and tangent replacement | Choquet/Birkhoff argument, support bound, and global majorizer check. |
| 1071-1172 | Fenchel/Toland/RKHS cost learning | Conjugate signs, extension domain, DCA direction, and RKHS coefficient `1/8` check. |
| 1174-1249 | Euclidean learned costs | Inner-product and squared-distance constants, including `-8 norm(S)_F^2`, check. |
| 1271-1395 | Gaussian GW and closure failure | Spectral formulas, constrained qualifier, Isserlis constants, and radial counterexample check. |
| 1399-1486 | Gromov--Monge and Monge maps | Directionality, finite uniform limit, rank limitation, and primary-source existence scope check. |
| 1510-1680 | Entropic/biconvex GW | Entropy halves, lower bound, polarization, tightness, block regularization, and operation counts check. |
| 1682-1705 | GW algorithm | Feasibility, lifted descent, stopping, and local-convergence qualifications check. |
| 1721-1791 | Fused GW algebra | Feature/structure factors and block linearization check; optimizer existence requires CH13-006. |
| 1826-1892 | Hausdorff/GH/GW-infinity | Factor `1/2`, correspondence support, and weight envelope check under the repaired GH definition CH13-007. |
| 1916-2035 | Quantum states, traces, and duality | Composite indices, adjoints, support compression, Slater point, and dual signs check. |
| 2046-2144 | Ground-cost lift/classical restriction | Antisymmetric normalization, diagonal square-root action, SOCP, and pure-state formulas check. |
| 2157-2273 | Classical square-root transport | Hellinger identity, first variation, Wasserstein bounds, topology, and triangle counterexample check. |
| 2280-2381 | Entropic QOT/Bregman | Entropy gradient, Fenchel conjugate, Gibbs exponential, and implicit projection equations check. |
| 2430-2539 | Gurvits scaling | Choi contractions, congruence geometric means, invariants, and explicit separation from exact Bregman check. |
| 2541-2547 | Operator extension | Correctly labeled formal; trace-class, unbounded-cost, and Gibbs-domain requirements are listed. |
| 2561-2638 | Discrete DTW | Path conventions, recurrence, tie breaking, backtracking, and `O(nm)` complexity check. |
| 2640-2657 | Continuous DTW | Two-clock line element, symmetry, admissible reparameterization, and narrow complexity claim check. |
| 2660-2744 | Soft-DTW | Partition/Gibbs identity, entropy sign, expected-alignment gradient, zero-temperature bounds, and positivity qualifications check for `epsilon>0`. |

## Structural-unit reconciliation

The chapter has one chapter heading, five sections, no `subsection` or `subsubsection` commands, and 28 explicit paragraph headings: **34 structural headings**. Section rows include their unheaded introductions; every prose paragraph in each range was audited.

| Kind | Lines | Heading | Disposition |
| --- | --- | --- | --- |
| Chapter | 3-2755 | Beyond Comparing Measures | Aggregate: seven active findings, ED13-001, and four RQ items |
| Section | 15-206 | Vector and Matrix-Valued Measures | CH13-008 in first figure caption; mathematics verified |
| Paragraph | 23-115 | Positive vector-valued measures | CH13-008; interpolation claims otherwise verified |
| Paragraph | 116-206 | Positive matrix-valued measures | Verified; coupled display explicitly illustrative |
| Section | 207-387 | Wasserstein over Wasserstein | CH13-002 |
| Paragraph | 215-234 | Wasserstein spaces as ground spaces | Verified |
| Paragraph | 235-266 | Random measures and collapsed mixtures | Verified |
| Paragraph | 267-387 | Transport between random measures | CH13-002 |
| Section | 388-1900 | Gromov--Wasserstein | CH13-001, CH13-003, CH13-006, CH13-007; ED13-001 |
| Paragraph | 396-465 | Discrete formulation | Mathematics verified; ED13-001 at line 420 |
| Paragraph | 466-546 | General setting | CH13-001 |
| Paragraph | 547-694 | Comparison with Wasserstein and Wasserstein--Procrustes | Verified |
| Paragraph | 695-804 | Marginal stability and geodesics | CH13-003 in trailing figure |
| Paragraph | 805-885 | Distance-profile lower bound | Verified |
| Paragraph | 886-947 | First-order optimality condition as self-consistent OT | Verified subject to absolute convergence already stated |
| Paragraph | 948-1062 | Conditional concavity of GW in Euclidean spaces | Verified |
| Paragraph | 1063-1256 | GW as cost-regularized robust Wasserstein transport | Verified |
| Paragraph | 1257-1396 | GW between Gaussian measures | Verified; RQ13-002 records remaining research scope |
| Paragraph | 1397-1490 | Monge--GW maps | Verified |
| Paragraph | 1491-1706 | Entropic regularization and biconvex alternating minimization | Verified |
| Paragraph | 1707-1819 | Fused GW: adding features | CH13-006 |
| Paragraph | 1820-1900 | Hausdorff and Gromov--Hausdorff viewpoints | CH13-007 |
| Section | 1901-2549 | Quantum Optimal Transport | Verified; RQ13-003 lies in classical restriction discussion |
| Paragraph | 1911-1987 | Finite-dimensional states and couplings | Verified |
| Paragraph | 1988-2039 | Dual formulation | Verified |
| Paragraph | 2040-2274 | Quantum-to-classical OT connection | Verified; RQ13-003 is explicitly scoped |
| Paragraph | 2275-2429 | Entropic regularization and Bregman iterations | Verified |
| Paragraph | 2430-2549 | Gurvits scaling and quantum Sinkhorn | Verified and qualified |
| Section | 2550-2755 | Dynamic Time Warping | CH13-005; RQ13-004 is correctly qualified |
| Paragraph | 2556-2560 | Ordered alignments versus transport couplings | Verified |
| Paragraph | 2561-2587 | Discrete variational problem | Verified |
| Paragraph | 2588-2639 | Dynamic programming | Verified |
| Paragraph | 2640-2657 | Continuous time warping | Verified |
| Paragraph | 2658-2755 | Soft-DTW and the Sinkhorn analogy | CH13-005; RQ13-004 |

## Named and numbered environment reconciliation

Counts: **24 definitions, 28 propositions, one theorem, zero corollaries, eight remarks, and five examples = 66 named mathematical environments**. Algorithms and figures are separate.

| Type | Lines | Name | Label | Disposition |
| --- | --- | --- | --- | --- |
| Definition | 27-34 | Positive vector-valued measure | def-positive-vector-valued-measure | Verified |
| Definition | 44-61 | Vector-valued dynamic transport | def-vector-valued-dynamic-transport | Verified |
| Definition | 121-127 | Positive matrix-valued measure | def-positive-matrix-valued-measure | Verified |
| Definition | 133-152 | Matrix-valued dynamic transport | def-matrix-valued-dynamic-transport | Verified |
| Definition | 246-258 | Collapsed, or barycentric, mixture | def-collapsed-barycentric-mixture | Verified |
| Definition | 272-281 | Wasserstein-over-Wasserstein distance | def-wasserstein-over-wasserstein | Verified |
| Definition | 469-477 | Metric-measure space | def-metric-measure-space | CH13-001 |
| Definition | 481-492 | Gromov--Wasserstein distance | def-gromov-wasserstein | CH13-001 |
| Definition | 493-503 | Infinite-order Gromov--Wasserstein distance | def-gromov-wasserstein-infinity | Verified |
| Definition | 593-601 | Isometric metric-measure spaces | def-isometric-mm-spaces | Verified |
| Definition | 924-931 | First-order stationary GW coupling | def-gw-stationary-coupling | Verified |
| Definition | 1399-1413 | Gromov--Monge problem | def-gromov-monge | Verified |
| Definition | 1510-1531 | Entropic GW and its biconvex relaxation | def-entropic-gw-biconvex | Verified |
| Definition | 1721-1733 | Fused Gromov--Wasserstein problem | def-fused-gromov-wasserstein | CH13-006 |
| Definition | 1826-1836 | Hausdorff distance | def-hausdorff-distance | Verified |
| Definition | 1841-1852 | Gromov--Hausdorff distance | def-gromov-hausdorff-distance | CH13-007 |
| Definition | 1916-1931 | Hermitian and density matrices | def-hermitian-density-matrices | Verified |
| Definition | 1942-1951 | Joint quantum states and partial traces | def-joint-quantum-state | Verified |
| Definition | 1969-1981 | Finite-dimensional quantum OT | def-finite-dimensional-qot | Verified |
| Definition | 2046-2064 | Antisymmetric lift of a ground cost | def-qot-ground-cost-lift | Verified |
| Definition | 2157-2177 | Classical square-root transport | def-classical-square-root-transport | Verified |
| Definition | 2280-2290 | von Neumann quantum entropy | def-von-neumann-quantum-entropy | Verified |
| Definition | 2573-2584 | Dynamic time warping | def-dynamic-time-warping | Verified |
| Definition | 2644-2654 | Continuous dynamic time warping | def-continuous-dtw | Verified |
| Proposition | 157-176 | Diagonal matrix subproblem | prop-matrix-diagonal-reduction | Verified |
| Proposition | 223-226 | Wasserstein spaces as ground spaces | prop-wasserstein-space-polish | Verified |
| Proposition | 335-344 | Collapsing is non-expansive | prop-wow-collapsed-bound | Verified |
| Proposition | 505-520 | Infinite-order limit of Gromov--Wasserstein | prop-gw-infinite-order-limit | Verified |
| Proposition | 550-570 | GW, Wasserstein--Procrustes and Wasserstein | prop-gw-wasserstein-procrustes-comparison | Verified |
| Proposition | 703-723 | Marginal stability and empirical GW rates | prop-gw-empirical-stability | Verified |
| Proposition | 745-765 | Gromov--Wasserstein geodesics | prop-gw-geodesics | Verified |
| Proposition | 810-829 | M\'emoli profile lower bound | prop-memoli-gw-profile-lower-bound | Verified |
| Proposition | 934-941 | Frozen-OT characterization of stationarity | prop-gw-frozen-ot-stationarity | Verified |
| Proposition | 973-980 | Conditional concavity of squared GW | prop-gw-conditional-concavity | Verified |
| Proposition | 1007-1009 | Extreme-point and permutation optimizers in the concave regime | prop-gw-extreme-optimal-coupling | Verified |
| Proposition | 1026-1049 | Tangent majorization and frozen-OT replacement | prop-gw-frozen-ot-replacement | Verified |
| Proposition | 1071-1096 | Concave coupling energies as cost-regularized OT | prop-concave-coupling-cost-regularized-ot | Verified |
| Proposition | 1174-1205 | Finite-dimensional cost learning for Euclidean GW | prop-gw-euclidean-cost-regularization | Verified |
| Proposition | 1271-1294 | Exact inner-product and Gaussian-constrained squared GW | prop-gw-between-gaussians | Verified |
| Proposition | 1342-1353 | Failure of Gaussian closure for squared-distance GW | prop-gw-gaussian-closure-fails | Verified |
| Proposition | 1438-1456 | Finite uniform Gromov--Monge limits | prop-finite-uniform-gromov-monge-limit | Verified |
| Proposition | 1467-1473 | Monge--GW map for inner-product dissimilarities | prop-gw-inner-product-monge-map | Verified |
| Proposition | 1554-1572 | Tightness of the biconvex GW relaxation | prop-gw-biconvex-tightness | Verified |
| Proposition | 1632-1652 | Fast contracted cost for squared GW | prop-gw-squared-cost-update | Verified |
| Proposition | 1872-1887 | Gromov--Hausdorff as an infinite-order intrinsic matching | prop-gh-gm-gw-infinity | Verified under the standard repaired definition; see CH13-007 |
| Proposition | 1991-2008 | Quantum Kantorovich duality | prop-qot-duality | Verified |
| Proposition | 2074-2085 | Ground-cost quantum semidistance | prop-qot-ground-cost-semidistance | Verified |
| Proposition | 2093-2120 | Convex classical restriction | prop-qot-classical-restriction | Verified |
| Proposition | 2196-2216 | Wasserstein comparison and topology | prop-classical-square-root-wasserstein-comparison | Verified |
| Proposition | 2308-2330 | Entropic quantum OT duality | prop-qot-entropic-duality | Verified |
| Proposition | 2362-2364 | Exact Bregman projections | prop-qot-bregman-projections | Verified |
| Proposition | 2591-2600 | DTW dynamic-programming recurrence | prop-dtw-dynamic-programming | Verified |
| Theorem | 608-613 | Gromov--Wasserstein metric modulo isometries | thm-gw-metric | Verified |
| Remark | 365-386 | Local profiles as Wasserstein-over-Wasserstein laws | -- | Verified |
| Remark | 668-679 | Completeness and compactness | rem-gw-not-complete | Verified |
| Remark | 681-693 | Distance hierarchy and topology | rem-gw-wp-topologies | Verified |
| Remark | 1103-1137 | Toland duality and DC algorithms | rem-gw-toland-dca | Verified |
| Remark | 2186-2194 | Monge structure for classical square-root transport | -- | Verified |
| Remark | 2525-2539 | Gurvits scaling is not the exact Bregman scheme | -- | Verified |
| Remark | 2541-2547 | Operator-valued couplings | -- | Verified |
| Remark | 2736-2744 | Validity of the soft-DTW divergence | rem-soft-dtw-divergence-validity | Verified |
| Example | 73-92 | Diagonal and coupled positive mobilities | -- | Verified |
| Example | 428-432 | Application to structured objects | ex-structured-objects-gw | Verified |
| Example | 1813-1817 | Application to multi-omics alignment | ex-multi-omics-alignment | Verified |
| Example | 1983-1986 | Classical diagonal case | ex-qot-classical-diagonal-case | Verified |
| Example | 2243-2273 | Failure of the triangle inequality | ex-classical-square-root-triangle-failure | Verified |

## Proof reconciliation

Every proposition and the theorem has a proof: **29 proof environments**. No proof is false. CH13-001, CH13-002, CH13-006, and CH13-007 are definition/domain defects outside the proof bodies; CH13-003 and CH13-008 are figure-description defects, and CH13-005 is a parameter-domain omission.

| Proof | Lines | Line-by-line result | Disposition |
| --- | --- | --- | --- |
| P01 | 177-186 | Diagonal trace expansion and scalar perspective reduction. | Verified |
| P02 | 227-233 | Cauchy gluing, convergence, and separability. | Verified |
| P03 | 345-361 | Measurable near-optimal kernels and Fubini. | Verified |
| P04 | 521-544 | Compactness and Lp-to-Linfinity limit. | Verified |
| P05 | 571-589 | Two gluing constructions for the comparison chain. | Verified |
| P06 | 615-666 | Attainment, zero-class isometry, and glued Minkowski triangle. | Verified |
| P07 | 725-739 | Marginal perturbation gluing with constant two. | Verified |
| P08 | 767-785 | Interpolation upper bound and triangle lower bound. | Verified |
| P09 | 830-854 | Conditional profile couplings and integrated OT bound. | Verified |
| P10 | 942-944 | Variational inequality equals frozen linear optimality. | Verified |
| P11 | 981-1003 | Product-kernel positivity and the required sign. | Verified |
| P12 | 1010-1022 | Choquet extreme minimizer and Birkhoff specialization. | Verified |
| P13 | 1050-1057 | Concave tangent and local segment contradiction. | Verified |
| P14 | 1097-1101 | Fenchel--Moreau learned-cost representation. | Verified |
| P15 | 1206-1249 | Euclidean expansions and all moment constants. | Verified |
| P16 | 1295-1337 | Trace alignment and Gaussian cross-covariance constraints. | Verified |
| P17 | 1354-1393 | Radial quantile coupling strict improvement. | Verified |
| P18 | 1457-1461 | Finite uniform permutation limit. | Verified |
| P19 | 1474-1482 | Bilinear cost reduction and Monge existence. | Verified |
| P20 | 1573-1585 | Polarization and equality criterion. | Verified |
| P21 | 1653-1667 | Tensor contraction and operation counts. | Verified |
| P22 | 1888-1892 | Full-support coupling support as correspondence. | Verified once Definition `def-gromov-hausdorff-distance` is read with isometric embeddings; see CH13-007 |
| P23 | 2010-2035 | Partial-trace adjoint and Slater duality. | Verified |
| P24 | 2087-2091 | Swap symmetry and pure-state separation. | Verified |
| P25 | 2122-2144 | Diagonal restriction, SOC epigraph, pure-state formula. | Verified |
| P26 | 2218-2241 | Wasserstein/Hellinger bounds and compact topology. | Verified |
| P27 | 2332-2346 | Trace-exponential first variation and dual equations. | Verified |
| P28 | 2366-2381 | Exact implicit Bregman projections. | Verified |
| P29 | 2602-2604 | Bellman induction and complexity. | Verified |

## Displayed-equation reconciliation

A block is one top-level `equation`, `align`, `align*`, custom `eqllead`, or `\[...\]` display; nested `aligned` rows belong to their parent. There are **195 blocks**: 107 bracket displays, 81 `equation`, four `align`, two `align*`, and one `eqllead`. Eighty-six blocks carry 88 labels; 109 are unlabeled.

| Display | Lines | Form | Label(s) | Disposition |
| --- | --- | --- | --- | --- |
| D001 | 30-32 | \[...\] | -- | Verified |
| D002 | 47-53 | equation | eq-vector-valued-bb | Verified |
| D003 | 56-60 | equation | eq-vector-valued-continuity | Verified |
| D004 | 76-80 | \[...\] | -- | Verified |
| D005 | 83-85 | equation | eq-diagonal-vector-mobility | Verified |
| D006 | 87-89 | \[...\] | -- | Verified |
| D007 | 124-126 | \[...\] | -- | Verified |
| D008 | 134-141 | equation | eq-matrix-valued-bb | Verified |
| D009 | 145-149 | equation | eq-matrix-valued-continuity | Verified |
| D010 | 160-163 | \[...\] | -- | Verified |
| D011 | 165-169 | \[...\] | -- | Verified |
| D012 | 171-173 | \[...\] | -- | Verified |
| D013 | 180-184 | \[...\] | -- | Verified |
| D014 | 239-241 | equation | eq-wow-parametric-law | Verified |
| D015 | 250-256 | equation | eq-wow-barycentric-mixture | Verified |
| D016 | 261-265 | \[...\] | -- | Verified |
| D017 | 274-280 | equation | eq-wow-distance | Verified |
| D018 | 285-287 | \[...\] | -- | Verified |
| D019 | 289-293 | \[...\] | -- | Verified |
| D020 | 295-297 | \[...\] | -- | Verified |
| D021 | 299-306 | \[...\] | -- | CH13-002 |
| D022 | 308-311 | \[...\] | -- | Verified |
| D023 | 339-343 | \[...\] | -- | Verified |
| D024 | 347-350 | \[...\] | -- | Verified |
| D025 | 355-359 | \[...\] | -- | Verified |
| D026 | 372-376 | \[...\] | -- | Verified |
| D027 | 405-414 | equation | eq-gw-def | Verified |
| D028 | 474-476 | \[...\] | -- | CH13-001 |
| D029 | 484-491 | align | eq-gw-generic | CH13-001 |
| D030 | 496-502 | equation | eq-gw-infinity | Verified |
| D031 | 507-513 | equation | eq-gw-infinity-support | Verified |
| D032 | 515-519 | equation | eq-gw-p-to-infinity | Verified |
| D033 | 527-533 | \[...\] | -- | Verified |
| D034 | 535-542 | \[...\] | -- | Verified |
| D035 | 556-560 | equation | eq-gw-fixed-space-wasserstein | Verified |
| D036 | 562-568 | equation | eq-gw-wp-wasserstein-comparison | Verified |
| D037 | 574-578 | \[...\] | -- | Verified |
| D038 | 582-586 | \[...\] | -- | Verified |
| D039 | 597-599 | \[...\] | -- | Verified |
| D040 | 620-624 | \[...\] | -- | Verified |
| D041 | 626-634 | \[...\] | -- | Verified |
| D042 | 641-663 | align* | -- | Verified |
| D043 | 672-675 | \[...\] | -- | Verified |
| D044 | 683-689 | \[...\] | -- | Verified |
| D045 | 708-714 | \[...\] | -- | Verified |
| D046 | 717-721 | \[...\] | -- | Verified |
| D047 | 727-735 | \[...\] | -- | Verified |
| D048 | 751-757 | \[...\] | -- | Verified |
| D049 | 760-764 | \[...\] | -- | Verified |
| D050 | 769-773 | \[...\] | -- | Verified |
| D051 | 777-783 | \[...\] | -- | Verified |
| D052 | 814-818 | \[...\] | -- | Verified |
| D053 | 821-825 | \[...\] | -- | Verified |
| D054 | 832-836 | \[...\] | -- | Verified |
| D055 | 838-844 | \[...\] | -- | Verified |
| D056 | 846-852 | \[...\] | -- | Verified |
| D057 | 872-880 | equation | eq-gw-profile-procrustes-sandwich | Verified |
| D058 | 895-899 | \[...\] | -- | Verified |
| D059 | 901-908 | equation | eq-gw-quadratic-form | Verified |
| D060 | 910-914 | equation | eq-gw-linearized-cost | Verified |
| D061 | 916-922 | equation | eq-gw-exact-linearization | Verified |
| D062 | 927-930 | equation | eq-gw-stationary-variational-inequality | Verified |
| D063 | 936-939 | equation | eq-gw-frozen-ot-fixed-point | Verified |
| D064 | 952-956 | equation | eq-gw-zero-marginal-space | Verified |
| D065 | 958-964 | \[...\] | -- | Verified |
| D066 | 975-978 | equation | eq-gw-conditional-negative-form | Verified |
| D067 | 983-987 | \[...\] | -- | Verified |
| D068 | 989-994 | align* | -- | Verified |
| D069 | 996-1001 | \[...\] | -- | Verified |
| D070 | 1012-1018 | \[...\] | -- | Verified |
| D071 | 1028-1036 | equation | eq-gw-tangent-majorization | Verified |
| D072 | 1041-1046 | \[...\] | -- | Verified |
| D073 | 1073-1080 | \[...\] | -- | Verified |
| D074 | 1082-1088 | \[...\] | -- | Verified |
| D075 | 1090-1095 | equation | eq-concave-coupling-cost-regularized-ot | Verified |
| D076 | 1108-1116 | equation | eq-gw-toland-duality | Verified |
| D077 | 1128-1135 | equation | eq-gw-dca-step | Verified |
| D078 | 1146-1156 | \[...\] | -- | Verified |
| D079 | 1158-1169 | equation | eq-gw-rkhs-cost-regularization | Verified |
| D080 | 1178-1185 | equation | eq-gw-euclidean-cost-learning | Verified |
| D081 | 1189-1193 | equation | eq-gw-inner-product-dissimilarities | Verified |
| D082 | 1197-1201 | equation | eq-gw-squared-distance-dissimilarities | Verified |
| D083 | 1209-1213 | \[...\] | -- | Verified |
| D084 | 1215-1220 | \[...\] | -- | Verified |
| D085 | 1224-1232 | \[...\] | -- | Verified |
| D086 | 1234-1240 | equation | eq-gw-squared-distance-cost-regularization | Verified |
| D087 | 1242-1247 | \[...\] | -- | Verified |
| D088 | 1263-1267 | \[...\] | -- | Verified |
| D089 | 1273-1277 | equation | eq-centered-gaussian-inner-product-gw | Verified |
| D090 | 1279-1285 | equation | eq-gaussian-constrained-squared-gw-definition | Verified |
| D091 | 1287-1292 | equation | eq-gaussian-constrained-squared-gw | Verified |
| D092 | 1297-1301 | \[...\] | -- | Verified |
| D093 | 1310-1314 | \[...\] | -- | Verified |
| D094 | 1318-1323 | \[...\] | -- | Verified |
| D095 | 1327-1335 | \[...\] | -- | Verified |
| D096 | 1344-1348 | \[...\] | -- | Verified |
| D097 | 1350-1352 | \[...\] | -- | Verified |
| D098 | 1356-1362 | \[...\] | -- | Verified |
| D099 | 1364-1366 | \[...\] | -- | Verified |
| D100 | 1370-1376 | \[...\] | -- | Verified |
| D101 | 1378-1383 | \[...\] | -- | Verified |
| D102 | 1385-1391 | \[...\] | -- | Verified |
| D103 | 1402-1411 | equation | eq-gromov-monge-p | Verified |
| D104 | 1415-1421 | equation | eq-gromov-monge-infinity | Verified |
| D105 | 1423-1436 | equation | eq-gromov-monge-basic-comparisons | Verified |
| D106 | 1440-1455 | align | eq-finite-gromov-monge-p, eq-finite-gw-gm-infinity-limit | Verified |
| D107 | 1469-1471 | equation | eq-gw-inner-product-transformed-brenier-map | Verified |
| D108 | 1478-1480 | \[...\] | -- | Verified |
| D109 | 1498-1505 | \[...\] | -- | Verified |
| D110 | 1514-1530 | align | eq-gw-entropic-general, eq-gw-biconvex-relaxation | Verified |
| D111 | 1536-1540 | equation | eq-gw-biconvex-lower-bound | Verified |
| D112 | 1544-1547 | \[...\] | -- | Verified |
| D113 | 1556-1560 | equation | eq-gw-biconvex-negative-condition | Verified |
| D114 | 1562-1570 | \[...\] | -- | Verified |
| D115 | 1575-1583 | equation | eq-gw-biconvex-polarization | Verified |
| D116 | 1590-1600 | align | eq-gw-biconvex-alternating-general | Verified |
| D117 | 1605-1611 | equation | eq-gw-contracted-cost | Verified |
| D118 | 1617-1622 | equation | eq-gw-biconvex-discrete | Verified |
| D119 | 1625-1628 | equation | eq-gw-entropy | Verified |
| D120 | 1634-1638 | \[...\] | -- | Verified |
| D121 | 1640-1648 | equation | eq-gw-sinkh | Verified |
| D122 | 1655-1663 | \[...\] | -- | Verified |
| D123 | 1677-1679 | \[...\] | -- | Verified |
| D124 | 1712-1716 | \[...\] | -- | Verified |
| D125 | 1725-1732 | equation | eq-fused-gromov-wasserstein | CH13-006 |
| D126 | 1739-1744 | \[...\] | -- | Verified |
| D127 | 1748-1756 | \[...\] | -- | Verified |
| D128 | 1758-1766 | equation | eq-fused-gw-linearized-cost | Verified |
| D129 | 1770-1781 | \[...\] | -- | Verified |
| D130 | 1783-1790 | \[...\] | -- | Verified |
| D131 | 1828-1835 | \[...\] | -- | Verified |
| D132 | 1846-1851 | \[...\] | -- | CH13-007 |
| D133 | 1858-1863 | \[...\] | -- | Verified |
| D134 | 1865-1869 | equation | eq-gh-correspondence-distortion | Verified |
| D135 | 1874-1878 | equation | eq-gh-gw-gm-infinity-chain | Verified under repaired GH definition |
| D136 | 1880-1886 | equation | eq-gh-as-weight-envelope-gw-infinity | Verified under repaired GH definition |
| D137 | 1919-1927 | \[...\] | -- | Verified |
| D138 | 1934-1940 | equation | eq-qot-tensor-product | Verified |
| D139 | 1945-1949 | equation | eq-qot-partial-traces | Verified |
| D140 | 1954-1958 | \[...\] | -- | Verified |
| D141 | 1960-1966 | equation | eq-qot-partial-traces-indices | Verified |
| D142 | 1975-1980 | equation | eq-qot-primal | Verified |
| D143 | 1995-2004 | equation | eq-qot-dual | Verified |
| D144 | 2014-2020 | \[...\] | -- | Verified |
| D145 | 2024-2028 | \[...\] | -- | Verified |
| D146 | 2049-2055 | equation | eq-qot-ground-cost-lift | Verified |
| D147 | 2057-2063 | equation | eq-qot-ground-cost-values | Verified |
| D148 | 2067-2071 | equation | eq-qot-ground-cost-lift-entries | Verified |
| D149 | 2077-2083 | \[...\] | -- | Verified |
| D150 | 2095-2101 | equation | eq-qot-classical-square-root-program | Verified |
| D151 | 2103-2108 | equation | eq-qot-classical-socp | Verified |
| D152 | 2110-2114 | equation | eq-qot-ground-cost-pure-states | Verified |
| D153 | 2125-2130 | \[...\] | -- | Verified |
| D154 | 2137-2141 | \[...\] | -- | Verified |
| D155 | 2161-2170 | equation | eq-classical-square-root-action | Verified |
| D156 | 2172-2176 | equation | eq-classical-square-root-transport | Verified |
| D157 | 2180-2183 | equation | eq-classical-square-root-weighted-hellinger | Verified |
| D158 | 2188-2192 | \[...\] | -- | Verified |
| D159 | 2198-2201 | \[...\] | -- | Verified |
| D160 | 2203-2207 | \[...\] | -- | Verified |
| D161 | 2209-2215 | equation | eq-classical-square-root-wasserstein-bounds | Verified |
| D162 | 2220-2228 | \[...\] | -- | Verified |
| D163 | 2234-2238 | \[...\] | -- | Verified |
| D164 | 2245-2251 | \[...\] | -- | Verified |
| D165 | 2253-2259 | \[...\] | -- | Verified |
| D166 | 2261-2271 | \[...\] | -- | Verified |
| D167 | 2284-2288 | \[...\] | -- | Verified |
| D168 | 2291-2301 | eqllead | eq-qot-entropic-primal | Verified |
| D169 | 2312-2321 | equation | eq-qot-entropic-dual | Verified |
| D170 | 2324-2328 | equation | eq-qot-gibbs-coupling | Verified |
| D171 | 2337-2341 | \[...\] | -- | Verified |
| D172 | 2349-2353 | \[...\] | -- | Verified |
| D173 | 2356-2360 | \[...\] | -- | Verified |
| D174 | 2368-2372 | \[...\] | -- | Verified |
| D175 | 2385-2389 | \[...\] | -- | Verified |
| D176 | 2438-2446 | equation | eq-qot-symmetric-scaling | Verified |
| D177 | 2455-2463 | equation | eq-qot-choi-map | Verified |
| D178 | 2465-2473 | \[...\] | -- | Verified |
| D179 | 2475-2479 | \[...\] | -- | Verified |
| D180 | 2482-2494 | equation | eq-qot-gurvits-updates | Verified |
| D181 | 2527-2532 | \[...\] | -- | Verified |
| D182 | 2563-2565 | \[...\] | -- | Verified |
| D183 | 2567-2570 | \[...\] | -- | Verified |
| D184 | 2576-2583 | equation | eq-dtw-variational | Verified |
| D185 | 2594-2598 | equation | eq-dtw-recurrence | Verified |
| D186 | 2646-2653 | equation | eq-continuous-dtw | Verified |
| D187 | 2660-2664 | equation | eq-dtw-softmin | CH13-005: valid for epsilon>0 |
| D188 | 2666-2675 | equation | eq-soft-dtw-recurrence | CH13-005: valid for epsilon>0 |
| D189 | 2678-2684 | equation | eq-soft-dtw-partition | CH13-005: valid for epsilon>0 |
| D190 | 2686-2694 | equation | eq-soft-dtw-variational | CH13-005: valid for epsilon>0 |
| D191 | 2698-2707 | equation | eq-soft-dtw-gibbs-law | CH13-005: valid for epsilon>0 |
| D192 | 2709-2715 | equation | eq-soft-dtw-zero-temperature-bound | CH13-005: valid for epsilon>0 |
| D193 | 2717-2721 | equation | eq-soft-dtw-expected-alignment | CH13-005: valid for epsilon>0 |
| D194 | 2727-2733 | equation | eq-soft-dtw-divergence | CH13-005: valid for epsilon>0 |
| D195 | 2738-2742 | \[...\] | -- | Verified |

## Algorithm reconciliation

All **four** algorithms were rechecked for their optimized objective, update normalization, feasibility invariant, stopping rule, convergence language, and stated operation count. No algorithmic defect was established.

| Algorithm | Lines | Objective and updates | Feasibility/convergence/stopping | Complexity | Disposition |
| --- | --- | --- | --- | --- | --- |
| alg:entropic-gromov-wasserstein | 1682-1705 | Exact alternating minimizers of the biconvex GW lift, with entropy epsilon/2 per block. | Transport feasibility is invariant. Each half-step decreases the lift. Diagonal descent is claimed only under conditional concavity. Iterate-difference tolerance or budget; epsilon=0 caveat and local convergence scope are explicit. | Refresh O(n^2m+nm^2); fixed-cost dense Sinkhorn step O(nm). No unsupported total inner-iteration count. | Verified |
| alg:quantum-exact-bregman | 2395-2428 | Entropic QOT with exact implicit dual-potential Bregman projections. | Each solve enforces one partial trace and may disturb the other; exponential preserves positivity. Maximum two-marginal residual or budget. The scheme is explicitly called exact but implicit. | Oracle pseudocode: no finite operation count is claimed without an inner nonlinear solver. | Verified and qualified |
| alg:quantum-gurvits-scaling | 2495-2517 | Symmetric operator scaling of K, explicitly not the exact entropic Bregman objective. | Positive geometric-mean updates impose alternating marginals; both hold only at convergence. Residual or budget; convergence only under strict positivity and scalability. | Dense contraction at least O(n^2m^2+n^3+m^3) per cycle before explicit coupling formation; no contrary bound claimed. | Verified and qualified |
| alg-dtw-dynamic-programming | 2608-2638 | Exact DTW shortest-path recurrence with lexicographic tie breaking. | Infinity boundary and predecessor invariant yield a valid optimal path. Finite loops and backtracking; no tolerance. | O(nm) time and O(nm) memory, as claimed. | Verified |

## Figure and matched-generator reconciliation

All 17 included PDFs exist. Each of the nine figure environments has a same-name retained notebook. The retained PDFs and thumbnails were compared visually with their captions. Retained diagnostics were read, and one bounded 18-point reproduction was used for the residual panel; no expensive notebook was re-executed.

| Figure label | Lines | Panels | Generator | Parameters/diagnostics | Disposition |
| --- | --- | --- | --- | --- | --- |
| fig:vector-valued-measure-geodesics | 102-114 | 2 | notebooks-figures/vector-valued-measure-geodesics.ipynb | Eight levels; exact gamma=0 quantile paths; illustrative gamma=.98 and eta=.76; endpoint discrepancy 2.22e-16; channelwise scaling plus tanh compression in glyphs. | CH13-008 for the word `proportional`; interpolation itself is correctly labeled illustrative. |
| fig:matrix-valued-measure-geodesic | 192-204 | 2 | notebooks-figures/matrix-valued-measure-geodesic.ipynb | Independent gamma=0, illustrative gamma=.94; relative continuity residuals 5.26e-4, 5.92e-4, 5.63e-4; PSD glyphs match. | Verified as explicitly illustrative. |
| fig:kantorovich-wow-mixtures | 319-333 | 2 | notebooks-figures/kantorovich-wow-mixtures.ipynb | Weights (.18,.64,.18) to (.45,.10,.45); positive standard deviations; component EMD versus quantile interpolation. | Verified; CH13-002 does not affect this instance. |
| fig:gromov-isometry-matching | 436-452 | 3 | notebooks-figures/gromov-isometry-matching.ipynb | Seed 2027, 18 uniform points; separately normalized squared dissimilarities and square-loss GW. | Verified as a qualitative discrete-dissimilarity illustration. |
| fig:gromov-nonisometric-distortion | 789-803 | 2 | notebooks-figures/gromov-nonisometric-distortion.ipynb | `ot.dist` default `sqeuclidean`; each matrix divided by its own maximum; identity hard match; residual max .468223, display limit .75; square-loss hard objective .0362304. | CH13-003. |
| fig:gromov-memoli-distance-profiles | 858-866 | 1 | notebooks-figures/gromov-memoli-distance-profiles.ipynb | 300 points per unit-diameter shape; 8 representatives; 20-bin display summaries; lower bound .098858; assignment GW .233738. | Verified; caption correctly distinguishes summaries from full profiles. |
| fig:fused-gromov-feature-geometry | 1795-1811 | 3 | notebooks-figures/fused-gromov-feature-geometry.ipynb | Seed 2027, 14 points, 100-degree rotation, lambda 0/.5/1; drawing offset excluded from cost. | Verified. |
| fig-qot-classical-square-root-comparison | 2148-2153 | 1 | notebooks-figures/quantum-classical-square-root-transport.ipynb | W2 plan value 1.937686; reoptimized 1.352929; 30.2% decrease; max marginal residual 2.00e-8; shared intensity. | Verified. |
| fig:dynamic-time-warping | 2748-2755 | 1 | notebooks-figures/dynamic-time-warping.ipynb | 105 samples, epsilon=.200; hard .106171, soft -30.972846; path length 127; expected length 177.192; retained bounds/gradient checks. | Verified; epsilon is positive. |

## Cross-reference reconciliation

There are **79 `ref` occurrences to 55 labels and 147 `eqref` occurrences to 70 labels: 226 occurrences and 125 distinct targets**. The chapter has 169 unique literal labels plus `eq-qot-entropic-primal`, generated by `eqllead`, for 170 effective local labels and no duplicates. There are 193 local-reference occurrences and 33 occurrences to 27 cross-chapter labels. Every TeX reference resolves. The prose-only broken promise at line 420 is recorded as editorial observation ED13-001, not as a mathematical defect.

| External target | Use(s) | Disposition |
| --- | --- | --- |
| cor-topol-wass | ref@2231, ref@2231 | Resolved; imported result/notation checked in context. |
| def-discrete-shannon-boltzmann-entropy | ref@1603 | Resolved; imported result/notation checked in context. |
| def-low-rank-couplings | ref@1671 | Resolved; imported result/notation checked in context. |
| def-measure-relative-entropy | ref@1497 | Resolved; imported result/notation checked in context. |
| def-ot-barycenter | ref@259 | Resolved; imported result/notation checked in context. |
| def-polish-metric-space | ref@216 | Resolved; imported result/notation checked in context. |
| def-positive-kernels | ref@971, ref@974 | Resolved; imported result/notation checked in context. |
| def-quotient-wasserstein | ref@581 | Resolved; imported result/notation checked in context. |
| def-twist-condition | ref@1468 | Resolved; imported result/notation checked in context. |
| def-wasserstein-procrustes | ref@569 | Resolved; imported result/notation checked in context. |
| eq-mk-generic | eqref@1069 | Resolved; imported result/notation checked in context. |
| eq-w1-metric | eqref@2240 | Resolved; imported result/notation checked in context. |
| prop-basic-phi-divergence-properties | ref@2184, ref@2229 | Resolved; imported result/notation checked in context. |
| prop-empirical-ot-rate | ref@722 | Resolved; imported result/notation checked in context. |
| prop-sparse-optimal-plans | ref@1021 | Resolved; imported result/notation checked in context. |
| prop-spectral-wasserstein-robust | ref@1139 | Resolved; imported result/notation checked in context. |
| prop-wass-quantile-1d | ref@1377 | Resolved; imported result/notation checked in context. |
| prop-wass-topology-polish | ref@228, ref@678 | Resolved; imported result/notation checked in context. |
| sec-barycenters | ref@259 | Resolved; imported result/notation checked in context. |
| sec-dynamic-optimal-transport | ref@2557 | Resolved; imported result/notation checked in context. |
| sec-phi-div | ref@2155, ref@2179 | Resolved; imported result/notation checked in context. |
| sec-rkhs-mmd | ref@1170 | Resolved; imported result/notation checked in context. |
| sec-sample-complexity | ref@736 | Resolved; imported result/notation checked in context. |
| sec-sinkhorn-div | ref@2726 | Resolved; imported result/notation checked in context. |
| sec-spectral-subspace-wasserstein | ref@1139 | Resolved; imported result/notation checked in context. |
| thm-birkhoff-von-neumann | ref@1021, ref@1460 | Resolved; imported result/notation checked in context. |
| thm-brenier | ref@1481 | Resolved; imported result/notation checked in context. |

## Citation reconciliation

There are **70 citation commands, 107 key occurrences, and 70 distinct cited keys**; all keys exist in `OT4ML/all.bib`. `P` marks an exact primary-source spot check. `I` marks independent mathematical derivation plus bibliographic/topic fit; contextual citations also use `I`. No cited source was found contradictory or misattributed. The uncited complexity source relevant to ED13-001/RQ13-001 is recorded after the table.

| Bib key | Occurrences | Source line(s) | Code | Disposition |
| --- | --- | --- | --- | --- |
| 2016-peyre-qot | 3 | 188,1905,2302 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| ambrosio2006gradient | 1 | 228 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| berg84harmonic | 1 | 1170 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| berlinet03reproducing | 1 | 1170 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| BerndtClifford1994DTW | 1 | 2554 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| BlondelMenschVert2021SoftDTW | 1 | 2743 | P | Primary Proposition 3 and squared-cost qualification match lines 2737-2743. |
| BuchinNusserWong2022CDTW | 2 | 2641,2656 | P | Primary result matches the narrowly qualified one-dimensional polygonal O((n+m)^5) claim. |
| burago2001course | 4 | 1824,1837,1853,1864 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| caglioti2019quantum | 1 | 1905 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| Carlen2014 | 1 | 188 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| Carlier2008TolandOT | 1 | 1121 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| chakrabarti2019quantum | 2 | 1905,2302 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| Chen2016 | 2 | 188,1905 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| ChenGangbo17 | 2 | 188,1905 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| ColeEcksteinFriedlandZyczkowski2023 | 2 | 2043,2272 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| Cuturi2011GlobalAlignment | 1 | 2724 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| CuturiBlondel2017SoftDTW | 2 | 2659,2716 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| CuturiVertBirkenesMatsui2007GlobalAlignment | 1 | 2724 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| DandapanthulaEtAl2025GaussianAlignment | 1 | 1258 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| dolbeault2009new | 1 | 96 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| DumontLacombeVialard2025 | 3 | 1463,1475,1486 | P | Primary statement matches inner-product map existence, squared-distance 2-map, and numerical non-map evidence. |
| garg2018recent | 2 | 2435,2518 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| georgiou2015positive | 2 | 2435,2518 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| gromov-2001 | 3 | 1824,1853,1864 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| gurvits2003classical | 1 | 2435 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| gurvits2004classical | 1 | 2435 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| JanatiCuturiGramfort2020STA | 1 | 2557 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| JiangSpectral | 1 | 188 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| Konno1976 | 1 | 1552 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| LeEtAl2022EntropicGaussianGW | 1 | 1395 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| LeThiPhamDinh2005DCA | 1 | 1136 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| loiola-2007 | 1 | 420 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| lyzinski-2015 | 1 | 426 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| maas2015generalized | 1 | 96 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| maas2016generalized | 1 | 96 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| MaronLipman2018 | 1 | 1061 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| memoli-2007 | 2 | 1824,1864 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| memoli-2008 | 1 | 692 | P | Primary Euclidean comparison supports fixed-dimension Holder control. |
| memoli-2011 | 3 | 458,612,692 | P | Primary metric and topology results match the GW/common-embedding claims. |
| memoli-2014 | 1 | 676 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| MemoliNeedham2024 | 1 | 1484 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| MielkeCVPDE | 1 | 96 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| Muller2007MusicMotion | 2 | 2554,2585 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| Ning2014metrics | 2 | 188,1905 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| ning2015matrix | 1 | 188 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| PatyCuturi2020GroundCost | 1 | 1064 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| petersen1993gromov | 1 | 1853 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| peyre2016gromov | 2 | 431,1495 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| PhamDinhLeThi1997DCProgramming | 1 | 1136 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| Phelps2001Choquet | 1 | 1011 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| RyuBunnePinelloRegevLopez2024LabeledGW | 1 | 1816 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| SakoeChiba1978DTW | 2 | 2554,2585 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| SalmonaDelonDesolneux2022GaussianGW | 4 | 1258,1395 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| SantambrogioBook | 1 | 228 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| ScetbonPeyreCuturi2022LinearTimeGW | 1 | 1671 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| schmitzer2013modelling | 1 | 458 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| schoenberg38 | 1 | 1061 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| SebbouhCuturiPeyre2024 | 4 | 1064,1170,1172,1475 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| SejourneVialardPeyre2021 | 2 | 1061,1552 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| StanojevicLiGarmire2022MultiOmicsReview | 1 | 1816 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| SturmGW | 3 | 458,676,741 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| Toland1978NonconvexDuality | 1 | 1121 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| TranJanatiCourtyFlamaryRedkoDemetciSingh2022UCOOT | 1 | 1816 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| Tseng2001 | 1 | 1680 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| vayer2019optimaltransportstructured | 2 | 431,1711 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| Vayer2020IncomparableSpaces | 4 | 1172,1395,1463,1481 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| Vayer2026GWSparsity | 1 | 1061 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| Villani09 | 1 | 228 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| Vintsyuk1968DTW | 1 | 2554 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |
| wendland2005scattered | 1 | 1170 | I | Bibliographic fit checked; mathematics independently derived or claim contextual. |

**Uncited source relevant to ED13-001 and RQ13-001:** `Kravtsova2024GWComplexity` is present in `all.bib` but absent from the chapter. The current [arXiv v4 dated 7 February 2026](https://arxiv.org/pdf/2408.06525) explicitly says that non-convexity alone does not prove NP-hardness, that the author knows of no reduction proving NP-hardness for relaxed finite GW, and that no polynomial-time algorithm for the general problem is known. This supports the cautious sentence at line 420 as of the audit date, but it does not repair the missing promised discussion.

## Notation, dimension, and normalization audit

| Topic | Check | Result |
| --- | --- | --- |
| Vector dynamics | `u` has `m` nonnegative components, `V` has `d` fluxes per component, and `M(u)` is `m x m`. | Consistent; range convention handles zero channels. |
| Vector glyphs | Two displayed components are separately normalized and magnitude-compressed. | Mathematically valid visualization, but `proportional` is false: CH13-008. |
| Matrix dynamics | `A` is `m x m` PSD and `P=(P_1,...,P_d)` has symmetric `m x m` entries. | Consistent; full matrix mass, not merely trace, is conserved. |
| WoW | Inner laws lie in `P_p(X)` and outer laws in `P_p(P_p(X))`. | Consistent; CH13-002 concerns only singular map representation. |
| General `De` | Ordinary distance moments were compared with `De(d,0)` moments; Borel/lower-semicontinuity compatibility was checked. | Insufficient as stated: CH13-001. |
| Discrete GW | `P` is `n x m`, `L` has four indices, `C(P)` is `n x m`, and `E(P)=<C(P),P>`. | Consistent; symmetric `L` gives gradient `2C(P)`. |
| GW factors | The chapter uses no built-in `1/2`; fixed-space comparison gives factor two. | Consistent in metric, profile, geodesic, and GH formulas. |
| Uniform maps | A permutation coupling is `P_sigma/n`, not `P_sigma`. | Used correctly in extreme-point and Gromov--Monge claims. |
| Biconvex entropy | The lift uses `-(epsilon/2)(H(P)+H(Q))`. | Each block has regularization `epsilon/2`; diagonal recovers `-epsilon H(P)`. |
| FGW | Feature and structural derivatives have factors `1-lambda` and `2lambda`. | Algebra consistent; attainment for measurable feature cost is CH13-006. |
| GH | The factor-two correspondence formula matches the chapter's GW normalization. | Correct only after adding isometric embeddings to the definition: CH13-007. |
| Quantum tensors | `A,F,U` are `n x n`; `B,G,V` are `m x m`; `T,C,K` are `(nm) x (nm)`. | Partial traces and Choi contractions use one composite-index convention. |
| Antisymmetric lift | Vectors have `1/sqrt(2)` normalization and projectors receive factor two. | Correctly recovers the ground cost on Dirac pure states. |
| Classical square-root action | Reciprocal directions enter as `c_ij(sqrt(P_ij)-sqrt(P_ji))^2`. | Factor `1/2` in the measure formula correctly avoids double counting. |
| Quantum entropy | `H(T)=tr(T log T-T)` has gradient `log T`; primal adds `+epsilon H`. | Dual signs and Gibbs exponential are consistent. |
| DTW | Incidence matrices are `n x m`; total mass is endogenous path length. | Correctly distinguished from fixed-marginal couplings. |
| Soft-DTW | The gradient is expected path incidence, not an OT coupling. | Correct for positive temperature; CH13-005. |
| Figure normalization | Profile shapes use unit diameter; QOT panels share intensity; FGW drawing offsets are excluded; GW residual matrices are separately normalized. | Only CH13-003 and CH13-008 are defective. |

## Boundary-case and hypothesis audit

| Case | Audit result | Disposition |
| --- | --- | --- |
| Zero vector mass | Perspective is finite only for flux in the mobility range; zero-mass diagonal channels contribute zero. | Handled. |
| Matrix degeneracy | Moore--Penrose inverse/range convention is explicit; equal total matrices are necessary, not claimed sufficient. | Handled. |
| WoW basepoint/moments | Basepoint independence and the collapsed moment identity are correct. | Handled. |
| Singular Gaussian components | PSD Bures distance/geodesics exist, but a deterministic source map need not. | CH13-002. |
| General GW integrability | A `d^p` moment does not control arbitrary `De` growth, measurability, or attainment. | CH13-001. |
| GW compactness | Compactness plus continuous `De` gives bounded integrand and attainment. | Handled in the propositions that state those hypotheses. |
| GW zero classes | Isometry is support-based and measure preserving. | Handled. |
| `p=infinity` | Coupling-support definition and compact `p`-limit are correct; no general Monge interchange is claimed. | Handled. |
| Zero marginal weights | Polytope statements survive; entropic uniqueness language assumes positive weights where needed. | Handled. |
| Gaussian GW rank | Zero padding and singular values are used; full-rank Brenier uniqueness is not asserted at rank deficiency. | Handled. |
| FGW endpoints | `lambda=0` exposes nonattainment for measurable cost; `lambda=1` removes the feature term. | CH13-006 at `lambda=0`; pure GW endpoint otherwise handled. |
| GH admissibility | Arbitrary maps collapse the infimum; isometric embeddings are essential. | CH13-007. |
| Quantum singular marginals | Primal support compression and full-space dual supremum are distinguished. | Handled. |
| Quantum inversion | Both quantum algorithms require positive-definite inputs where inverse square roots/logarithms are used. | Handled. |
| Infinite-dimensional quantum costs | The extension is formal and lists trace-class, unbounded-cost, and Gibbs requirements. | Adequately scoped. |
| Empty DTW sequences | Endpoints `(1,1)` and `(n,m)` implicitly require `n,m>=1`. | Standard local convention; not separately counted. |
| Continuous reparameterization | Invariance holds for admissible absolutely continuous monotone reparameterizations. | Handled. |
| Soft temperature | Log/Gibbs formulas require `epsilon>0`; zero is a one-sided limit. | CH13-005. |
| Soft-DTW positivity | The chapter restricts proved positivity to the cited cost classes and asserts no triangle inequality. | Handled; RQ13-004. |

## Adversarial reread of active findings

| ID | Strongest attempted rebuttal | Final disposition |
| --- | --- | --- |
| CH13-001 | Perhaps "typically `De=abs`" or compactness silently supplies boundedness. | Rejected. Arbitrary `De` is express, and compact ordinary distance values do not force compatibility, Borel measurability, boundedness, or lower semicontinuity of another metric. |
| CH13-002 | Perhaps Bures geodesics for PSD matrices eliminate the need for a map. | They eliminate the need only after reformulation by an optimal coupling. The displayed `A Sigma A^T` map cannot send `Sigma=0` to `I`. Repair narrowed to source positive definiteness. |
| CH13-003 | Perhaps the discrete chapter permits squared dissimilarities, making the caption acceptable. | That validates the solver input, not the caption's raw-distance notation or claim that `res`, rather than `res^2`, is the local square-loss contribution. |
| CH13-005 | Perhaps positive temperature is universally implicit. | Rejected for a self-contained definition: the same chapter explicitly handles `epsilon=0` elsewhere, while these displays divide by `epsilon`. |
| CH13-006 | Perhaps compactness of coupling sets guarantees a minimizer. | Rejected. Weak compactness needs lower semicontinuity of the objective; the circle counterexample is compact and bounded Borel. |
| CH13-007 | Perhaps `phi,psi` are conventionally understood to be isometric. | Standard expert intent is clear, but the named self-contained definition never states it. Literal constant maps force zero and contradict the next sentence. |
| CH13-008 | Perhaps plotting-axis aspect accounts for the component scales. | Rejected. Distinct channel normalizations, tanh magnitude compression, thresholding, and clipping remain nonlinear even after any fixed axis conversion. |

The adversarial pass removed first-pass CH13-004 from the defect count. It also rejected proposed defects concerning vector/matrix mobility separation, WoW collapse, GW stationarity sufficiency, Gaussian-constrained wording, biconvex tightness, entropy factors, Gurvits-versus-Bregman identification, quantum partial traces, DTW recurrence, and universal soft-DTW positivity: nearby hypotheses or explicit qualifications defeat those readings.

## Prioritized repair order

1. **CH13-001:** define the analytic domain of general `De`, its generalized size moment, and whether the value is a minimum or infimum.
2. **CH13-007:** add the isometric-embedding admissibility clause to the GH definition.
3. **CH13-006:** require lower semicontinuity of the FGW feature cost or replace minimum/argmin language by infimum plus existence hypotheses.
4. **CH13-002:** assume active source covariances are positive definite or use coupling-based PSD Bures geodesics.
5. **CH13-003:** correct the residual caption or regenerate the quantity actually named.
6. **CH13-005:** state `epsilon>0` and reserve zero for the hard-limit definition.
7. **CH13-008:** disclose the glyph normalization/compression or make the rendering genuinely linear.

After mathematical repairs, resolve **ED13-001** by adding the current complexity citation/discussion or deleting the broken forward promise.

## Exact count reconciliation and write scope

| Item | Exact result |
| --- | --- |
| Established defects | **7 = 0 Critical + 0 Major + 5 Moderate + 2 Minor** |
| Active finding IDs | `CH13-001`, `CH13-002`, `CH13-003`, `CH13-005`, `CH13-006`, `CH13-007`, `CH13-008`; unique |
| Retired finding ID | `CH13-004`; removed from defect count and mapped to `ED13-001` |
| New second-pass IDs | `CH13-006` through `CH13-008`; contiguous |
| Second-pass disposition coverage | **5/5** first-pass hypotheses explicitly disposed |
| Editorial observations | **1 = ED13-001**; not counted as a defect |
| Unresolved research/scope items | **4 = RQ13-001 through RQ13-004**; not counted as defects |
| Structural headings | **34 = 1 chapter + 5 sections + 0 subsections + 28 paragraphs** |
| Named mathematical environments | **66 = 24 definitions + 28 propositions + 1 theorem + 0 corollaries + 8 remarks + 5 examples** |
| Proofs | **29**, one for every proposition and the theorem; none false |
| Top-level displays | **195 = 107 bracket + 81 equation + 4 align + 2 align* + 1 eqllead** |
| Display labels | **88 labels on 86 blocks; 109 unlabeled blocks** |
| Algorithms | **4** |
| Figures | **9 environments, 17 included PDFs, 9 matched generator notebooks** |
| References | **226 = 79 `ref` + 147 `eqref`; 125 distinct targets; all resolve** |
| Local labels | **170 effective = 169 literal + 1 `eqllead`-generated; no duplicates** |
| External references | **33 occurrences to 27 distinct labels; all resolve** |
| Citations | **70 commands, 107 key occurrences, 70 distinct keys; all present in `OT4ML/all.bib`** |
| Validated-correct ledger | **36 claim clusters** |
| First-pass report SHA-256 before rewrite | `7636a45991ec3858e44b769e76ea909c58bf119c3f53ab3657fc27553e1b2b4a` |
| Report consistency checks | ASCII-only; no provisional markers; active/retired/RQ/ED IDs reconciled above |
| Source size | **2,755 lines; 190,051 bytes** |
| Initial source SHA-256 | `c58adf8f6fb10ba9a1f8a9f78e7564ed28707f98e4a28473e2f114b64fa27aa1` |
| Final source SHA-256 | `c58adf8f6fb10ba9a1f8a9f78e7564ed28707f98e4a28473e2f114b64fa27aa1` |
| Byte preservation | Initial and final hashes are identical; the chapter bytes were preserved exactly. |
| Write scope | Only `/Users/gpeyre/Dropbox/github/ot4ml/audit-chap13.md` was modified by this second pass. The source, bibliography, notebooks, figures, and generated assets remained read-only. |
