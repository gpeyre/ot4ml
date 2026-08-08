# August 2026 Full-Manuscript Correction Pass

## Scope

This pass audited the main LaTeX driver, all 16 chapter sources, and the notation table, representing approximately 31,500 lines of manuscript source. The audit combined:

- full-text spelling, punctuation, and typography searches;
- checks for duplicated words, unfinished markers, malformed labels, and unresolved references;
- targeted notation searches for measures, densities, discrete matrices, iteration indices, Fisher information, generalized actions, and the penalized minimization oracle (PMO);
- a complete bibliography-aware LaTeX build;
- inspection of all overfull and framed-environment warnings; and
- visual review of the pages affected by the remaining layout diagnostics.

## Corrections Made

### Global Typography and TeX Spacing

- Removed 105 source spaces incorrectly placed before terminal punctuation in displayed equations.
- Moved terminal punctuation outside 22 short inline mathematical expressions, especially in pseudocode and compact derivations.
- Normalized TeX interword spacing after abbreviations such as `i.e.`, `i.i.d.`, `a.e.`, `et al.`, and `vs.`.
- Added the appropriate TeX sentence-space marker after sentence-final uppercase abbreviations such as OT, GW, RKHS, PDE, ODE, and QOT.
- Preserved punctuation inside displayed equations where it belongs to the surrounding sentence.

### Titles, Index, and Cross-References

- Normalized the section titles `Discrete Dual`, `General Formulation`, `Benamou--Brenier Dynamic Formulation of OT`, and `Dual Norms (Integral Probability Metrics)` to the book's title-capitalization convention.
- Corrected the semantic label prefix of `Example 13.49 (Classical diagonal case)` from `rem-...` to `ex-...` and updated its reference.
- Corrected the index spelling and sorting text for the Cram\'er--Wold theorem in both places where it is indexed.
- Rephrased the notation-table entry for the continuous and discrete KL divergences so that its two definition references are joined grammatically.
- Verified that the final manuscript has no undefined references, undefined citations, or duplicate labels.

### Mathematical and Notational Clarity

- Rewrote the limiting graph-plan expression in the statistical OT chapter as an integral against `(Id,T)_# alpha`. The previous expression collapsed visually to `T(x)-T(x)` and obscured why the limiting integral vanishes.
- Moved the long positive-feature vector definition in the complete-positivity proof to its own displayed equation. This removes a line overflow and makes the Gram-factorization argument easier to parse.
- Standardized punctuation in the Shannon/total-variation comparison table.
- Verified that discrete costs and couplings consistently use the book macros for `C` and `P`, with comma-separated indices such as `C_{i,j}` and `P_{i,j}`.
- Verified that iteration counters use `ell` and parenthesized superscripts where they denote algorithmic iterates. Remaining uses of `k` are local mathematical indices, polynomial orders, or coordinate counters.
- Verified the density convention: `rho_alpha` and `rho_beta` are used when both densities must be distinguished, and `rho` is used only when the underlying measure is unambiguous.
- Verified the global notation `mathcal I(alpha|beta)` for relative Fisher information.
- Verified the action convention `mathbb A(alpha,w)` and the PMO notation `PMO_{mathbb A,alpha}` throughout the generalized-gradient-flow material.
- Verified that the only remaining standalone `mu` in the chapter sources is a scalar strong-convexity constant, not an inconsistently named probability measure.

### Page-Break and Rendering Corrections

The build initially exposed five definition boxes that split badly across pages. Targeted `Needspace` guards were added rather than making theorem environments globally unbreakable:

- continuous Kantorovich problem in Chapter 3;
- weak/narrow topology, uniform functional norm, and mean-field attention map in Chapter 4;
- graph geodesic distance in Chapter 6;
- antisymmetric quantum ground-cost lift in Chapter 13; and
- discrete Markov-chain Wasserstein distance in Chapter 14.

These changes remove all `mdframed` bad-break warnings. In particular, they eliminate an orphaned one-line quantum definition fragment and a severe overlap between the two- and three-point Markov-chain examples.

## Chapter-by-Chapter Outcome

| Chapter | Audit outcome |
|---|---|
| 1. Optimal Matching between Point Clouds | Checked assignment notation, factorial expressions, matching labels, and algorithmic iteration conventions; no substantive defect remained. |
| 2. Monge Problem between Measures | Normalized punctuation and abbreviation spacing; checked map, density, quantile, Gaussian, and Bures notation. |
| 3. Kantorovich Relaxation | Corrected equation punctuation and the continuous-problem page break; checked discrete/continuous coupling notation and convexity references. |
| 4. Wasserstein Space | Corrected three definition-page breaks; checked Wasserstein exponents, weak convergence notation, functionals, particle polynomials, attention maps, and measure-to-measure maps. |
| 5. Dual Problem | Normalized section capitalization and punctuation; checked full-dual/semi-dual symbols and `c`-transform references. |
| 6. Semi-dual and Semi-discrete OT | Corrected the graph-distance definition break; checked Laguerre-cell, auction, quantization, and `W_1` flow notation. |
| 7. Divergences and Dual Norms | Normalized title capitalization and table punctuation; checked `phi`-divergence, KL, MMD, RKHS, and Fisher-related symbols. |
| 8. Entropic Regularization: Sinkhorn Algorithm | Normalized equation and prose spacing; checked scaling variables, soft transforms, entropy conventions, and complex-temperature notation. |
| 9. Entropic Regularization: Convergence | Normalized punctuation and iteration notation; checked Bregman, Hilbert metric, local-rate, extrapolation, and Gaussian Sinkhorn symbols. |
| 10. Statistical Optimal Transport | Clarified the graph-plan limit and positive-feature proof; removed the only overfull line; checked sample-size and bias/variance notation. |
| 11. Generalized Wasserstein Distances | Corrected index typography and global punctuation; checked unbalanced, sliced, Min-SW, LOT, and spectral-distance notation. |
| 12. Generalized OT Problems | Corrected index typography and global punctuation; checked barycenter, low-rank, inverse-OT, and weak-OT notation. |
| 13. Beyond Comparing Measures | Corrected the QOT example label and quantum definition pagination; checked GW, Wasserstein-over-Wasserstein, quantum, and martingale notation. |
| 14. Dynamic Optimal Transport | Normalized section capitalization and punctuation; corrected the Markov-chain definition pagination and checked all local/nonlocal action variables. |
| 15. Wasserstein Gradient Flows | Normalized global punctuation and abbreviations; checked first variations, Wasserstein gradients, PMOs, PL/KL inequalities, and flow variables. |
| 16. Generative Models via Transportation | Normalized global punctuation and abbreviations; checked flow-matching, diffusion, mean-shift, Gaussian closure, and transformer notation. |
| Appendices A--B | Checked the notation table and index references; corrected the KL entry and confirmed that the index remains Appendix B. |

## Validation

- Ran a complete `pdflatex -> bibtex -> pdflatex -> pdflatex` build, followed by two further LaTeX passes after pagination fixes.
- Final output: 480 pages.
- Undefined references: 0.
- Undefined citations: 0.
- Duplicate-label warnings: 0.
- Overfull boxes: 0.
- Underfull horizontal boxes: 0.
- `mdframed` bad-break warnings: 0.
- Source whitespace errors reported by `git diff --check`: 0.
- Visually checked the corrected pages around printed pages 56--57, 70, 109, 296--299, and 327--330.

## Second Independent Pass

### Additional Corrections Made

- Replaced five raw `\operatorname{rank}` occurrences by the book's `\rank` macro in the sparse-linear-program and multimarginal-support arguments.
- Replaced the raw diagonal operator in the interior-point Hessian by the established `\diag` macro.
- Replaced three isolated identity-matrix notations (`I_3` and `I_n`) by `\Id_3` and `\Id_n` in the Birkhoff-contraction and mean-shift sections.
- Replaced two raw `\mathrm{tr}` occurrences by the book's `\tr` macro in the Gaussian-manifold calculation.
- These 11 source-level corrections make the corresponding operators and matrices render consistently with the notation table and the rest of the manuscript; none changes a mathematical statement.

### Additional Global Checks

- Re-ran spelling and malformed-prose searches on all chapter sources, including duplicated words, common transcription errors, article agreement, subject--verb agreement, unfinished markers, and stale editorial annotations. No further actionable prose defect was found.
- Parsed 970 labelled theorem-like environments and checked every typed reference such as `Definition~\ref{...}`, `Proposition~\ref{...}`, and `Theorem~\ref{...}` against the type of its target. No semantic cross-reference mismatch was found.
- Confirmed that all 141 labelled figures are referenced in the main text.
- Rechecked label uniqueness and found no duplicate labels.
- Rechecked discrete matrix notation, endpoint notation, density notation, generalized actions, PMOs, relative Fisher information, and iteration indices. No further drift was found.
- Confirmed that the remaining uses of `\epsilon` and `\varepsilon` encode a deliberate distinction: `\epsilon` denotes entropic temperature, whereas `\varepsilon` is used for generic perturbation and approximation parameters.
- Confirmed again that no generic probability measure is denoted by a standalone `\mu`; its only remaining mathematical use is as a scalar strong-convexity constant.
- Reviewed the diagnostics from `lacheck` and `chktex`. Their remaining reports arise from custom book macros, half-open interval notation, intentional factorial punctuation, and the established table style; none indicates malformed LaTeX or a rendered defect.

### Second-Pass Validation

- Ran a fresh complete `pdflatex -> bibtex -> pdflatex -> pdflatex` build.
- Final output: 480 pages.
- Undefined references and citations: 0.
- Duplicate-label warnings: 0.
- Overfull boxes: 0.
- Underfull horizontal boxes: 0.
- `mdframed` bad-break warnings: 0.
- Source whitespace errors reported by `git diff --check`: 0.

## Third Independent Pass

### Additional Corrections Made

- Corrected 36 residual discrete-notation occurrences that had bypassed the book macros. Discrete costs, couplings, histogram vectors and dual vectors now consistently use `\C`, `\P`, `\a`, `\b`, `\fD` and `\gD` in:
  - the proof of the robust discrete Sinkhorn dual rate, including its oscillation estimate, row update and first-cycle coupling bounds;
  - the quadratic $\phi$-divergence and Bregman density laws and their scalar threshold update;
  - the discrete dual certificate used in the local sliced-Wasserstein argument; and
  - the discrete and hybrid $c$-transform explanation and its figure caption; and
  - the Gaussian Nystr\"om--Sinkhorn complexity statement and its preceding scaling equations.
- Renamed the stale internal label `eq-bure-defn` to `eq-bures-defn` and updated its reference. This source typo did not affect the printed equation number, but the corrected label now matches the spelling used for every other Bures object.

### Additional Global Checks

- Re-scanned all chapter sources for raw discrete cost, coupling and dual-potential symbols. Remaining similarly shaped symbols are intentional objects: graph potentials, tensor basis vectors, stochastic matrices, covariance matrices, interpolation maps or constants.
- Rechecked operator macros for trace, rank, diagonal, support and identity. The remaining `\operatorname{Tr}_A` and `\operatorname{Tr}_B` denote partial-trace operators, while the remaining symbols $I_t$ denote interpolation maps; neither is a macro inconsistency.
- Re-ran dictionary-independent prose checks based on common transcription errors, repeated adjacent words, punctuation anomalies and low-frequency word candidates. The apparent repeated words are intended combinations such as the formatting command `\small` followed by the label “small $\epsilon$”; no further prose typo was confirmed.
- Rechecked iteration superscripts and counters. Algorithmic iterations consistently use parenthesized $\ell$; remaining occurrences of $k$ are mathematical indices or orders rather than iteration counters.
- Rechecked stale and malformed label stems, including Bures, Sinkhorn, Wasserstein, Kantorovich, Procrustes, Gaussian and Gromov--Hausdorff terminology. No unresolved malformed label or reference remains.
- Rechecked the notation table against the repaired formulas. Its declared distinction between discrete potentials $(\fD,\gD)$ and continuous potentials $(f,g)$ is now respected in all corrected locations.

### Third-Pass Validation

- Ran another complete `pdflatex -> bibtex -> pdflatex -> pdflatex` build.
- Final output: 480 pages.
- Undefined control sequences: 0.
- Undefined references and citations: 0.
- Duplicate labels or PDF destinations: 0.
- Overfull horizontal boxes: 0.
- Underfull horizontal boxes: 0.
- `mdframed` bad-break warnings: 0.
- Stale cross-reference rerun warnings: 0.
- Source whitespace errors reported by `git diff --check`: 0.

## Bibliography Audit

### Scope and Method

- Audited all 551 references cited by the compiled book, rather than only searching the full BibTeX database for malformed syntax.
- Confirmed that every citation key in the LaTeX auxiliary file exists in `OT4ML/all.bib`; no cited key is unresolved and no exact duplicate cited key, title, DOI, or arXiv identifier was found.
- Checked all 171 cited DOI identifiers through the DOI resolver and compared available records with Crossref metadata.
- Checked all 134 cited arXiv identifiers against the official arXiv API, including the recent 2025--2026 preprints.
- Checked all 45 cited direct web links; 44 remained live and one stale AAAI link was replaced by the official archived PDF.
- Cross-checked the remaining identifier-free cited titles against Crossref, publisher, proceedings, and author records, with particular attention to recent publications and historically translated works for which online years can differ from print years.

### Corrections Made

- Corrected the DOI of Bolte, Daniilidis, Ley and Mazet, *Characterizations of Łojasiewicz inequalities: subgradient flows, talweg, convexity*, from the nonexistent `10.1090/S0002-9947-10-05048-X` to `10.1090/S0002-9947-09-05048-X`.
- Restored the published author order of *Gromov--Wasserstein Distances between Gaussian Distributions* to Julie Delon, Agnès Desolneux and Antoine Salmona, and synchronized the two prose attributions in Chapter 13.
- Corrected Loeper's title to *On the regularity of solutions of optimal transportation problems* and added its DOI `10.1007/s11511-009-0037-8`.
- Replaced the dead landing-page URL for Berndt and Clifford's 1994 dynamic-time-warping paper by the stable official AAAI technical-report PDF.

### Hallucination and Metadata Outcome

- Found no nonexistent cited arXiv preprint and no fabricated cited publication during the identifier and title audit.
- Distinguished preprint metadata from final publication metadata before editing. In particular, apparent title conflicts for the Caglioti--Golse--Iacobelli and Rotskoff--Vanden-Eijnden papers were left unchanged because the existing BibTeX titles agree with the published journal versions.
- Retained legitimate print years when Crossref exposed only an online-first, translation, reprint, review, or later-edition year; these were not treated as errors.

### Bibliography Validation

- Ran a fresh `pdflatex -> bibtex -> pdflatex -> pdflatex` build after the corrections; the PDF contains 480 pages.
- BibTeX warnings: 0.
- Undefined citations and references: 0.
- Duplicate cited identifiers or exact titles: 0.
- Confirmed that the corrected AMS DOI redirects to the corresponding AMS article and that the replacement AAAI URL returns the official archived paper.

## Index Audit

### Scope and Counts

- Audited all 4,396 index occurrences generated by the compiled manuscript and all index commands in the 16 active chapter sources.
- Modified 198 existing index commands: 122 conceptual or hierarchical consolidations and 76 typographic display corrections.
- Added 34 new index commands at definitions and other authoritative locations that previously lacked a reliable subject anchor.
- The final Appendix B contains 1,009 top-level entries, 852 second-level entries and 8 third-level entries. No duplicate top-level label remains.

### Consolidation and Structural Corrections

- Merged exact synonyms and near-duplicate headings, including `optimal plan` with `optimal coupling`, `Dirac measure` with `Dirac mass`, `cumulative function` with `cumulative distribution function`, and `MTW condition` with `Ma--Trudinger--Wang condition`.
- Regrouped modifier-first variants under consistent subject hierarchies, including Brownian and Ornstein--Uhlenbeck bridges, interaction energy, bilinear costs, characteristic kernels, permutation matrices, partial matching, metric slopes, block-coordinate methods and Sinkhorn variants.
- Replaced the incorrect `simplex network` entry by the standard `network simplex` terminology.
- Unified the full Kullback--Leibler family under one heading, with subentries for divergence, reverse divergence, projections, proximal maps and operators, relaxation and barycenters.
- Unified all Gromov--Wasserstein material under one sorted and displayed heading, eliminating a duplicate top-level entry and adding coherent subentries for distance, infinite-order distance, stationarity, entropic regularization, biconvex relaxation and fused GW.
- Consolidated Fenchel--Rockafellar duality, Legendre--Fenchel transforms, Bures metrics, centroidal Voronoi tessellations, minimizing movements, least-squares constructions and optimal-map estimation.

### Added Subject Anchors

- Added definition-level entries for the $p$-Wasserstein space, vector-valued dynamic transport, admissible continuity-equation evolutions, Markov-chain Wasserstein distance, dynamic and static Wasserstein--Fisher--Rao distances, capacity-constrained OT, Min-SW, cumulative-function distances and classical square-root transport.
- Added missing anchors for continuous Kantorovich admissible potentials, the Legendre--Fenchel biconjugate, finite-valued $c$-concavity, uniform norms on functionals, particle polynomials, higher-order vertical derivatives, generalized action gradient flows and mean-field attention maps.
- Added computational anchors for discrete, continuous and marginal-dependent entropic OT, conditional coupling operators and $\epsilon$-complementary slackness.

### Typographic Polish

- Introduced stable alphabetical sort keys with correct displayed en dashes for named objects such as Baker--Campbell--Hausdorff, Berry--Esseen, Brunn--Minkowski, Fisher--Rao, Gromov--Hausdorff, Hamilton--Jacobi, Hellinger--Kantorovich, Kullback--Leibler, McKean--Vlasov, Monge--Kantorovich, Ornstein--Uhlenbeck and Perron--Frobenius.
- Replaced textual mathematical labels by proper mathematics in the printed index, including $\epsilon$, $L^2$, $\Wass_1$, $\Wass_\infty$ and generic $p$-Wasserstein variants.

### Index Validation

- MakeIndex accepted all 4,396 generated entries, rejected 0 entries and emitted 0 warnings.
- Rebuilt the complete book through the index-generation cycle and two final LaTeX passes; the PDF contains 480 pages and the index remains Appendix B.
- Undefined references and citations: 0.
- Overfull and underfull horizontal boxes: 0.
- Visually inspected the first, middle and last pages of the rendered index. The two-column layout, hierarchy, page links, mathematical glyphs and running headers render cleanly without clipping or collisions.
