# Notation Audit for OT4ML

Date: 2026-06-30.

Scope: compiled LaTeX sources of the book, namely `OT4ML/OT4ML.tex`, `OT4ML/mystyle.sty`, `OT4ML/notations_ot.sty`, the section files included by `OT4ML/OT4ML.tex`, and `OT4ML/sections/notation-table.tex`.

The following section files are compiled:

`matching.tex`, `monge.tex`, `kantorovich.tex`, `dual.tex`, `semidiscr-w1.tex`, `dual-norms.tex`, `sinkhorn.tex`, `sinkhorn-advanced.tex`, `statistical-ot.tex`, `generalized-wasserstein.tex`, `generalized-ot-problems.tex`, `beyond-comparing-measures.tex`, `dynamic-ot.tex`, `wasserstein-gradient-flows.tex`, `transportation-models.tex`, and `notation-table.tex`.

The files `OT4ML/sections/barycenters.tex` and `OT4ML/sections/estimation.tex` are present in the tree but are not included by the main book file. They were not used as primary evidence for inconsistencies in the compiled manuscript.

## Executive Summary

The book has a mostly coherent global convention in the core OT chapters:

- `\alpha,\beta` denote source and target measures.
- `\a,\b` denote discrete histograms.
- `\pi` denotes a continuous coupling, while `\P` denotes a discrete transport matrix.
- `\Couplings(\alpha,\beta)` and `\CouplingsD(\a,\b)` denote the continuous and discrete coupling sets.
- `\MK_c` / `\MKD_C` denote OT costs, while `\Wass_p` / `\WassD_p` denote Wasserstein distances.
- `\f,\g` and `\fD,\gD` separate continuous and discrete dual potentials.
- `\K` is used for the Sinkhorn Gibbs matrix in the entropic chapters.

The main remaining inconsistencies are concentrated in newer material, especially statistical OT, gradient flows, generative modeling, and nonlocal geometries. These additions introduce several local notation systems that are mathematically valid but require continued hygiene. The time-indexed evolving-law notation has since been cleaned up so that gradient-flow and generative-model sections use `\alpha_t` consistently, and the notation table now contains a dedicated block for generalized dynamic Wasserstein geometries.

The most important issues to fix are:

1. The symbol `\theta` is overloaded as a mobility, logarithmic mean, projection direction, and displacement field.
2. The symbol `K` is overloaded for Sinkhorn Gibbs kernels, Markov transition kernels, jump kernels, RKHS kernels, and quantum kernel operators.
3. `\gamma` and `\kappa` have several unrelated meanings.
4. `\rho` is used both for densities and for a glued coupling/common marginal in the notation table.
5. Several recent section-specific objects should continue to be checked when new material is added.

No compile-breaking notation error was found. The audit is mostly about reader-facing consistency and avoiding hidden symbol collisions.

## Recommended Cleanup Priorities

| Priority | Action |
| --- | --- |
| High | Maintain the convention that evolving laws in gradient-flow/generative sections are written `\alpha_t`; reserve `\mu,\nu` for generic local measures. |
| High | Reserve `\theta` for mobility/logarithmic mean and rename displacement fields in functional-inequality proofs. |
| Done | Add a notation-table block for generalized dynamic Wasserstein geometries. |
| Medium | Clarify all uses of `K`: Gibbs, Markov, jump, RKHS, and quantum kernels. |
| Medium | Rename or locally declare the capacity cap `\kappa` to avoid collision with WFR scale `\kappa`. |
| Medium | Clarify whether covariance matrices are written as `\cov` or raw `\Sigma`. |
| Low | Standardize source usage of `\epsilon` / `\varepsilon`, even though the rendered output is already consistent. |

## Detailed Findings

### N1. Source-target convention is coherent; generic `\mu` remains local

Global convention: the notation table uses `\alpha,\beta,\gamma` for source, target, and auxiliary measures. This is consistent throughout the core OT chapters.

Evidence:

- `OT4ML/sections/notation-table.tex` lists `\al,\be,\ga` as the source, target, and auxiliary measures.
- `OT4ML/sections/kantorovich.tex`, `dual.tex`, `semidiscr-w1.tex`, `sinkhorn.tex`, and `generalized-wasserstein.tex` predominantly follow `\alpha,\beta`.

Potential inconsistencies:

- `OT4ML/sections/matching.tex:345-351` states the rational-weight duplication result using `\mu,\nu`, although nearby discrete transport notation uses `\alpha,\beta` and `\a,\b`.
- `OT4ML/sections/wasserstein-gradient-flows.tex:2516-2555` introduces the empirical lift with `\mu_X`, `F(X)=f(\mu_X)`, and `v_\mu`.
- The previous time-indexed evolving-law mismatch in `wasserstein-gradient-flows.tex`, `transportation-models.tex`, and `semidiscr-w1.tex` has been resolved by using `\alpha_t` for evolving measures.
- `OT4ML/sections/transportation-models.tex:1777-1787` uses `\mu,\nu` in the Gelbrich theorem.

Diagnosis: this is not wrong. In many theorem statements, `\mu,\nu` is standard generic measure notation. The remaining point is to keep generic theorem notation visually distinct from evolving-law notation.

Recommendation: keep `\mu,\nu` for generic external statements such as Gelbrich, CLT, or moment-measure results. In gradient-flow and generative sections, continue using `\alpha_t` for evolving laws.

### N2. `\theta` is substantially overloaded

Uses found:

- `OT4ML/sections/generalized-wasserstein.tex` uses `\theta` as a projection direction in sliced/projected constructions.
- `OT4ML/sections/dynamic-ot.tex:636-646` uses `\theta(\rho)` as a concave mobility.
- `OT4ML/sections/dynamic-ot.tex:786-794` uses `\theta(a,b)` as the logarithmic mean.
- `OT4ML/sections/dynamic-ot.tex:923-928` reuses `\theta(a,b)` for the nonlocal logarithmic mean.
- `OT4ML/sections/wasserstein-gradient-flows.tex:1407-1422` and `1559-1575` use `T(x)=x+\theta(x)` for a Brenier displacement field in functional-inequality proofs.

Diagnosis: the dynamic-distance uses of `\theta` are structurally important and coherent: the same logarithmic mean appears in finite-state and nonlocal Markov geometries, and concave mobility notation is also standard. The projection-direction and displacement-field uses are easier to rename.

Recommendation: reserve `\theta` for mobilities/logarithmic means in dynamic geometries. Rename the displacement field in functional-inequality proofs to `u(x)`, `\xi(x)`, or `\zeta(x)`, e.g. `T(x)=x+u(x)`. If projection directions remain as `\theta`, add a local declaration and avoid using them near the dynamic-distance section.

### N3. `K` is overloaded across several unrelated kernels

Uses found:

- `OT4ML/notations_ot.sty:115` defines `\K` as the discrete Sinkhorn Gibbs kernel.
- `OT4ML/sections/sinkhorn.tex:363-373` uses the continuous Gibbs kernel associated with entropic OT.
- `OT4ML/sections/sinkhorn.tex:2301-2304` defines a complex Gibbs kernel `K_\epsilon(x,y)`.
- `OT4ML/sections/sinkhorn.tex:2342-2346` defines the complex Gibbs matrix `\K_\epsilon(\C)`.
- `OT4ML/sections/dynamic-ot.tex:796-814` uses `K_{ij}` as a Markov transition kernel/rate.
- `OT4ML/sections/dynamic-ot.tex:917-952` uses `K(x,\d y)` as a nonlocal jump kernel.
- `OT4ML/sections/beyond-comparing-measures.tex:964` uses `K` as a positive kernel operator in quantum scaling.
- RKHS/MMD sections use `k` or `\Krkhs`, which is mostly safe.

Diagnosis: many of these are locally standard, but the book has enough kernel notions that the reader needs an explicit notation policy. The notation table now lists the Sinkhorn `\K` and adds the Markov/jump uses in the dynamic block; the quantum kernel/operator use remains mostly local to the QOT section.

Recommendation: keep `\K` for Sinkhorn matrices and `k`/`\Krkhs` for RKHS kernels. Keep the Markov transition kernel `K_{ij}` and jump kernel `K(x,\d y)` locally declared in their sections and represented in the notation table. Consider renaming the nonlocal distance to `\mathcal W_{\mathsf J}` if the symmetric jump measure `\mathsf J` becomes the preferred structural object.

### N4. `\mathcal W_K` is used for both finite Markov and nonlocal distances

Evidence:

- `OT4ML/sections/dynamic-ot.tex:811-816` defines the finite-state Markov-chain distance `\mathcal W_K`.
- `OT4ML/sections/dynamic-ot.tex:950-956` defines the nonlocal jump distance also as `\mathcal W_K`.
- `OT4ML/sections/wasserstein-gradient-flows.tex` later uses `\mathcal W_K` for gradient flows in both settings.

Diagnosis: this is defensible because both constructions are generated by a reversible kernel and the text explicitly explains the common logarithmic-mean mechanism. The notation table now makes this shared convention explicit by listing both the Markov-chain and nonlocal uses of `\mathcal W_K`.

Recommendation: if the two sections grow further, introduce `\mathcal W_{K}^{\mathrm{mc}}` and `\mathcal W_{K}^{\mathrm{nl}}` or use `\mathcal W_{\mathsf J}` for the nonlocal version.

### N5. Generalized dynamic-distance notation in the notation table

Status: addressed in `OT4ML/sections/notation-table.tex` and mirrored, when the corresponding material exists, in `arxiv/sections/notation-table.tex`.

Newly documented symbols:

- `\mathcal A_A(\rho_0,\rho_1)` and `\mathsf D_A`, defined in `OT4ML/sections/dynamic-ot.tex:536-558`.
- `A_\theta` and `\mathsf W_\theta`, defined in `OT4ML/sections/dynamic-ot.tex:638-646`.
- `\mathcal N_{\gamma,\alpha}`, used in `OT4ML/sections/dynamic-ot.tex:748-758`.
- `\mathcal K_\rho`, `\mathcal A(\rho,\psi)`, and `\mathcal W_K`, defined in `OT4ML/sections/dynamic-ot.tex:796-816`.
- `\bar\nabla`, `\mathsf J`, and `\mathfrak m`, defined in `OT4ML/sections/dynamic-ot.tex:917-938`.
- `\mathcal A_K`, defined in `OT4ML/sections/dynamic-ot.tex:940-956`.
- `\mathcal J_{\gamma}^{\alpha}`, `S_\alpha(g)`, and `A_\alpha^\star`, used in normalized spectral Wasserstein flows in `OT4ML/sections/wasserstein-gradient-flows.tex`.
- The phase-space notation `\eta_t^n`, `\eta_t`, `s`, and `\pi_x` used in second-order momentum flows.

Residual recommendation: keep this block synchronized when new generalized dynamic distances or flow geometries are added. The remaining issue is not absence from the table, but possible symbol overloads such as `\theta`, `K`, `\gamma`, and `\kappa`.

### N6. `\gamma` has too many unrelated roles

Uses found:

- `\ga` is introduced as an auxiliary measure in the global notation table.
- `\gamma` is a monotone spectral gauge in the spectral Wasserstein section.
- `\gamma(t)` is the static-noise amplitude in stochastic interpolants, e.g. `OT4ML/sections/transportation-models.tex:256-260`.
- `\gamma` is the damping coefficient in second-order momentum flow, e.g. `OT4ML/sections/wasserstein-gradient-flows.tex:2551-2555`.
- `\gamma_d` denotes the standard Gaussian measure in functional inequalities.

Diagnosis: all uses are locally conventional, but a reader moving between spectral Wasserstein and momentum/generative sections sees the same symbol reused with unrelated meanings.

Recommendation: keep `\gamma` for the spectral gauge because it is structurally attached to `\Wass_\gamma`. Keep `\gamma_d` for the standard Gaussian if it is locally declared. Rename the stochastic-interpolant noise schedule to `r(t)` or `\sigma_{\mathrm{noise}}(t)`, and rename momentum damping to `\lambda_{\mathrm{fric}}`, `\eta`, or `\zeta`.

### N7. `\kappa` is used both for WFR scale and capacity constraints

Uses found:

- The WFR scale appears as `\WFR_\kappa` and `\mathcal A_\kappa` in dynamic OT and unbalanced gradient flows.
- `OT4ML/sections/generalized-ot-problems.tex:798-810` uses `\kappa(x,y)` as a capacity density cap for capacity-constrained OT.

Diagnosis: both uses are natural but unrelated. Since capacity-constrained OT appears in generalized OT and WFR appears in dynamic/gradient-flow chapters, this is unlikely to cause local algebraic confusion, but it is a notation-table issue.

Recommendation: either rename the capacity to `\bar\kappa`, `u(x,y)`, or `\mathrm{cap}(x,y)`, or explicitly say “Here `\kappa` is a capacity, unrelated to the WFR parameter.” The discrete capacity matrix `U` is clear and should be listed in the notation table.

### N8. `\rho` is both density and glued/common marginal

Uses found:

- The notation table defines `\density{\alpha}=\rho_\alpha` as a density.
- Many dynamic and gradient-flow sections use `\rho_t` as a density with respect to Lebesgue or a reference measure.
- The notation table also lists `\rho` as a glued coupling/common marginal in a Wasserstein-over-Wasserstein construction.

Diagnosis: `\rho` should primarily mean density in a book with dynamic OT and PDEs. Using it globally for a glued coupling is risky, even if that use is local.

Recommendation: rename the glued common marginal to `\chi`, `\omega`, or `\lambda` in the corresponding proof/definition, or make its notation explicitly local and remove the global table entry. Reserve `\rho_t` for densities.

### N9. `\mathcal R` is overloaded

Uses found:

- `\Potentials` is macro-defined as `\Rr`, visually related to `\mathcal R`, for admissible dual potentials.
- `OT4ML/sections/transportation-models.tex:831-838` defines a semi-relaxed drifting functional `\mathcal R_t(\alpha|\alpha_t)`.
- `OT4ML/sections/transportation-models.tex:1777-1780` defines the Gaussian projection `\mathcal R\mu`.

Diagnosis: the drifting functional and Gaussian projection appear in the same chapter and are unrelated. This is a genuine reader-facing collision.

Recommendation: rename the Gaussian projection to `\operatorname{Gauss}(\mu)` or `\mathsf G\mu`, and/or rename the drifting functional to `\mathcal E_t` or `\mathcal D_t`. If not renamed, add local reminders when the second use appears.

### N10. `C`, `\C`, and `c` are mostly coherent but should be documented for weak/QOT settings

Global convention:

- `c(x,y)` is the ground cost.
- `\C` is the discrete cost matrix.

Additional uses:

- Weak OT uses `C(x,\nu)` for a cost depending on a conditional law.
- Quantum OT uses `C` as a cost observable.
- Capacity-constrained OT uses `C` for the cost matrix and `U` for the capacity matrix.

Diagnosis: this is acceptable because the weak and quantum costs are genuinely different objects. The notation table already includes `\WOT_C` and `QOT_C`, but the distinction between `c` and weak/quantum `C` should be made more explicit.

Recommendation: add table entries for weak conditional cost `C(x,\nu)` and quantum cost observable `C`, or add a sentence in the table saying that uppercase `C` denotes cost-like objects beyond scalar pairwise costs.

### N11. `P_t` is close to the discrete plan `\P`

Uses found:

- `\P` denotes a discrete transport matrix throughout the discrete chapters.
- `OT4ML/sections/transportation-models.tex:49-60` uses `P_t` for an interpolating map.
- `OT4ML/sections/transportation-models.tex:260` identifies `P_t=I_t` in the stochastic-interpolant notation.

Diagnosis: there is no mathematical conflict because `P_t` is a map and `\P` is a matrix, but the visual collision is unnecessary in a chapter that already uses couplings and push-forwards.

Recommendation: use `I_t` consistently for interpolating maps in the generative-model chapter. This also matches the later stochastic-interpolant notation.

### N12. Simplex notation is split between `\simplex_n` and `\Sigma_n`

Uses found:

- The notation table lists `\simplex_n` for the probability simplex.
- `OT4ML/sections/dynamic-ot.tex:775-777` introduces finite-state Markov geometries on `\Sigma_n`.

Diagnosis: `\Sigma_n` visually collides with covariance matrices and is not the global simplex macro.

Recommendation: replace `\Sigma_n` by `\simplex_n`, or define `\Sigma_n=\simplex_n` locally and add an entry in the notation table. The first option is cleaner.

### N13. Covariance notation alternates between `\cov` and raw `\Sigma`

Uses found:

- `OT4ML/notations_ot.sty` defines `\cov=\mathbf{\Sigma}`.
- The notation table uses `\cov` for covariance matrices.
- Many Gaussian formulas use raw `\Sigma_0,\Sigma_1`, for instance Gaussian flow matching, convex order for Gaussians, Fisher-Rao comparisons, and Bures formulas.

Diagnosis: raw `\Sigma` is common and arguably more readable in Gaussian formulas. The macro `\cov` gives a bold symbol, which makes some formulas typographically different from nearby raw formulas.

Recommendation: either enforce `\cov` everywhere in Gaussian notation, or relax the table to say “`\Sigma` or `\cov` denotes a covariance matrix.” The second option is probably more pragmatic, because many classical Gaussian formulas are clearer with raw `\Sigma`.

### N14. `\epsilon` / `\varepsilon` is visually consistent but source-inconsistent

Evidence:

- `OT4ML/mystyle.sty:362` defines `\eps` as `\epsilon`.
- `OT4ML/mystyle.sty:444` redefines `\epsilon` to render as `\varepsilon`.
- The source alternates between `\epsilon`, `\varepsilon`, and `\eps`.

Diagnosis: the rendered PDF is mostly consistent because `\epsilon` is redefined. This is a source-hygiene issue, not a reader-facing issue.

Recommendation: standardize source on `\epsilon` for entropic regularization and reserve explicit `\varepsilon` only for contexts where the command name itself matters, such as a title. Avoid `\eps` in new text.

### N15. Marginal-dependent Sinkhorn notation is not fully in the table

Evidence:

- `OT4ML/sections/sinkhorn.tex:1294-1315` introduces `\mathcal F` and `\mathcal G` as marginal penalties.
- The subsection later uses KL-proximal maps associated with these functionals.

Diagnosis: the use is coherent, but these symbols are important enough to list because this subsection connects balanced OT, unbalanced OT, JKO steps, and barycenters.

Recommendation: add notation-table entries for `\mathcal F,\mathcal G`, their discrete versions if any, and the KL-proximal operator used in the generalized Sinkhorn updates.

### N16. Complex Sinkhorn introduces `K_\epsilon`, `\K_\epsilon`, and complex potentials

Evidence:

- `OT4ML/sections/sinkhorn.tex:2301-2317` defines the measure-level complex kernel and scalings.
- `OT4ML/sections/sinkhorn.tex:2328-2336` defines complex soft-transform equations.
- `OT4ML/sections/sinkhorn.tex:2342-2350` defines the discrete complex Gibbs matrix and coupling.

Diagnosis: this is a self-contained section, but it expands the meaning of Sinkhorn notation beyond positive kernels and real dual variables.

Recommendation: add a short notation-table row for `K_\epsilon`, `\K_\epsilon`, and complex scalings/potentials, or explicitly state that these are local to the complex-epsilon section.

### N17. Capacity-constrained OT introduces `U` as an upper matrix, which is not tabled

Evidence:

- `OT4ML/sections/generalized-ot-problems.tex:814-822` defines `U_{ij}` as the discrete capacity matrix.
- `OT4ML/sections/generalized-ot-problems.tex:842-850` uses `U` as input to the capacity-constrained Sinkhorn algorithm.

Diagnosis: `U` is important and distinct from `\CouplingsD`, which is `\VectMode{U}`. This is a subtle visual issue: `\CouplingsD(\a,\b)` is the feasible set of couplings, while `U` is an upper-capacity matrix.

Recommendation: rename the upper-capacity matrix to `\Ucap`, `\overline P`, or `\mathsf U`, or add a local sentence warning that this `U` is not the coupling set `\CouplingsD`.

### N18. `\pi_x` for conditional laws is consistent and should be preserved

Evidence:

- `OT4ML/sections/generalized-ot-problems.tex:1318-1325` uses the disintegration `\pi(\d x,\d y)=\pi_x(\d y)\alpha(\d x)` for barycentric projection.

Diagnosis: this is standard and fits weak OT well. It is not an inconsistency, but it should be listed in the notation table because weak OT, martingale OT, and barycentric projection rely on it.

Recommendation: add `\pi_x` to the notation table as the conditional law of `y` given `x` in a disintegration of `\pi`.

### N19. Phase-space notation in second-order flows is absent from the notation table

Evidence:

- `OT4ML/sections/wasserstein-gradient-flows.tex:2620-2643` introduces `\eta_t^n`, `\eta_t`, `x`, `s`, and `\alpha_t=(\pi_x)_\sharp\eta_t`.

Diagnosis: this section is long and conceptually important. The phase-space law should be tabled.

Recommendation: add entries for `s`, `\eta_t`, and `\pi_x` in the gradient-flow part of the notation table.

### N20. Statistical OT notation should be aligned with the global `\alpha` convention

Issue:

The user specifically requested replacing `\mu` by `\alpha` in the law-of-large-numbers and CLT discussion. The current statistical chapter should be rechecked for residual `\mu_n,\mu` notation that should be `\alpha_n,\alpha`, except where the source being cited uses `\mu` in a quoted theorem or in a generic proposition.

Recommendation: run a targeted pass on `OT4ML/sections/statistical-ot.tex` for `\mu`, `\mu_n`, `\nu`, and `\nu_n`. Use `\alpha_n` for empirical measures sampled from `\alpha`, and reserve `\mu,\nu` only for generic theorem statements when needed.

## Notation Table Gaps

The notation table is already useful for the core book, but it has not fully caught up with the newest sections. The following entries should be added or clarified.

### Generalized Dynamic Distances

Add entries for:

- `A(\rho,m)`: general convex action density.
- `\mathcal A_A`: dynamic action generated by `A`.
- `\mathsf D_A`: path metric generated by a homogeneous action.
- `A_\theta`: concave-mobility action.
- `\mathsf W_\theta`: concave-mobility distance.
- `\theta(a,b)`: logarithmic mean.
- `\mathcal K_\rho`: Onsager operator for finite Markov chains.
- `\mathcal W_K`: Markov/nonlocal Wasserstein distance generated by reversible kernel `K`.
- `\bar\nabla`: nonlocal gradient.
- `\mathsf J`: symmetric jump measure.
- `\mathfrak m`: reference measure for nonlocal jump geometry.

### Generalized Spectral Dynamics

Add entries for:

- `\gamma`: monotone spectral gauge.
- `\mathcal B_\gamma` or `B_\gamma`: displacement-covariance unit ball, if both variants appear.
- `\mathcal N_{\gamma,\alpha}`: spectral tangent norm.
- `\mathcal J_\gamma^\alpha`: JKO/normalization functional in spectral dynamics.
- `S_\alpha(g)`: covariance or moment matrix associated with a field `g`.
- `A_\alpha^\star`: normalized operator selected by the gauge duality.

### Sinkhorn Extensions

Add entries for:

- `\mathcal F,\mathcal G`: marginal penalties.
- `\prox^{\KLD}` or the KL-proximal map used in generalized Sinkhorn.
- `K_\epsilon`, `\K_\epsilon`: complex Gibbs kernels.
- Complex scalings `u,v` and complex dual potentials `f,g` in the complex-epsilon section.
- `f^{*,\epsilon}` or the soft Legendre transform notation if it is used beyond a local paragraph.

### Gradient Flows and PDEs

Add entries for:

- `\delta f/\delta\alpha`: first variation if not already explicit.
- `\Wgrad f(\alpha)`: Wasserstein gradient, already partially present but should be tied to `\nabla\delta f(\alpha)`.
- `\eta_t`: phase-space law in second-order flows.
- `s`: velocity variable in phase space.
- `\pi_x`: projection from phase space to position.
- `\lambda_{\mathrm{PL}}` or the PL constant if used repeatedly.

### Generalized OT Problems

Add entries for:

- `\kappa(x,y)`: capacity cap, or rename it to avoid collision.
- `U`: discrete upper-capacity matrix, if not renamed.
- `\bar T_\pi`: barycentric projection of a coupling.
- `\pi_x`: conditional law in a disintegration.
- `\Couplings_{\mathrm{mart}}`: martingale coupling set.
- `\preceq_{\mathrm{cx}}`: convex order.

### Generative Models

Add entries for:

- `I_t` or `P_t`: interpolating map, but choose one primary notation.
- `v_t`: Eulerian flow-matching velocity.
- `u_t`: target/regressed vector field if distinct from `v_t`.
- `\mathcal R_t`: drifting functional, if kept under that name.
- `\mathcal R\mu`: Gaussian projection, if not renamed.

## Low-Risk Local Reuses

The following local reuses are acceptable if explicitly declared:

- `\mu,\nu` in generic theorem statements.
- `\gamma_d` for the standard Gaussian measure.
- `C` for weak or quantum costs, as long as it is locally introduced.
- `m` for momentum in dynamic OT and for mass in partial OT, provided each paragraph declares it.
- `\lambda` for regularization/penalty/Lagrange parameters, as long as no two meanings interact in the same formula.

## Suggested Concrete Edits

1. Add a notation policy paragraph at the beginning of the notation table:
   “The symbols `\alpha,\beta` are used for the main source and target measures. The symbols `\mu,\nu` are reserved for generic measures in local theorem statements unless explicitly declared otherwise.”

2. Replace in functional-inequality proofs:
   `T(x)=x+\theta(x)` by `T(x)=x+u(x)`.

3. In the second-order momentum section, optionally rename the generic empirical-lift symbols `\mu_X` and `v_\mu` to `\alpha_X` and `v_\alpha`; the time-indexed spatial marginal is already written with `\alpha_t`.

4. In generative modeling, use `I_t` consistently for interpolating maps instead of `P_t`.

5. Rename one of the two `\mathcal R` objects in `transportation-models.tex`.

6. Add a table block for generalized dynamic Wasserstein geometries.

7. Add table entries for finite Markov and nonlocal Wasserstein distances, explicitly explaining the common logarithmic mean.

8. Recheck `statistical-ot.tex` for residual `\mu_n,\mu` notation if the chapter is intended to use `\alpha_n,\alpha`.

9. Decide on covariance typography: either use `\Sigma` throughout Gaussian formulas, or enforce `\cov`.

10. Rename the capacity cap `\kappa(x,y)` or add a local warning that it is unrelated to WFR `\kappa`.

## Bottom Line

The notation system is solid in the foundational OT material. The main work is to integrate the recent dynamic/PDE/generative additions into the global notation discipline. The highest-value edits are small but reader-visible: rename the displacement `\theta`, maintain the cleaned-up `\alpha_t` evolving-law convention, expand the notation table, and disambiguate the kernel and dynamic-distance symbols.
