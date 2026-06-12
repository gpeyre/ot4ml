# Bibliography Audit

Date: 2026-06-12.

## Scope

- Active BibTeX database: `latex/all.bib`.
- Compiled citation set: `latex/OT4ML.aux`, which currently contains 221 cited bibliography items.
- Full database size: 624 BibTeX entries. This pass checked the full database structurally and resolved every DOI/arXiv identifier present in the file. Entries without DOI/arXiv metadata were not all manually verified one by one, but the cited subset was checked more deeply.

## Local Consistency Checks

- Duplicate BibTeX keys: none found.
- Cited keys missing from `latex/all.bib`: none found.
- Required fields for cited entries: no missing required fields for the active entry types (`article`, `book`, `inproceedings`, `incollection`, `phdthesis`, `techreport`, `conference`).
- Required fields for all 624 entries: no missing required fields for the active entry types (`article`, `book`, `inproceedings`, `incollection`, `phdthesis`, `techreport`, `conference`, `misc`).
- Malformed numeric page ranges: none remaining.
- BibTeX run: zero warnings; `latex/OT4ML.blg` reports 221 used entries and `warning$ -- 0`.
- Years: no cited entry has a year after 2026 or before the historical range expected for the manuscript.

## External Metadata Checks

All entries carrying an arXiv identifier were checked directly against their `arxiv.org/abs/...` page. No hallucinated arXiv identifiers were found: all 68 unique arXiv identifiers in the full database resolve. After correction of stale legacy titles, the resolved arXiv titles match the local BibTeX title up to capitalization, TeX escaping, or HTML entity escaping.

All 27 DOI-bearing entries in the full database were checked through Crossref and resolve. The only residual automatic title-similarity flag is `zemel2017fr`, where the metadata agrees and the mismatch comes from TeX accent encoding of `Fr{\'e}chet`.

Among cited entries, all 30 cited arXiv identifiers and all 18 cited DOI entries resolve and match the expected title.

The checked arXiv entries are:

- `weed2025statistical`: arXiv:2407.18163, *Statistical Optimal Transport*.
- `montesuma2023recent`: arXiv:2306.16156, *Recent Advances in Optimal Transport for Machine Learning*.
- `merigot2020optimaltransportalgorithms`: arXiv:2003.00855, *Optimal transport: discretization and algorithms*.
- `Peyre2026OptimalDiffusionTransports`: arXiv:2512.06797, *Optimal and Diffusion Transports in Machine Learning*.
- `peyre2026robust`: arXiv:2602.01372, *Robust Sublinear Convergence Rates for Iterative Bregman Projections*.
- `sriperumbudur2009integral`: arXiv:0901.2698, *On integral probability metrics, phi-divergences and binary classification*.
- `ReviewSinkhorn`: arXiv:1609.06349, *A review of matrix scaling and Sinkhorn's normal form for matrices and positive maps*.
- `leonard2019fortet`: arXiv:1904.13211, *Revisiting Fortet's proof of existence of a solution to the Schroedinger system*.
- `chizat2024sharper`: arXiv:2407.01202, *Sharper Exponential Convergence Rates for Sinkhorn's Algorithm in Continuous Settings*.
- `peyre2026muon`: arXiv:2604.04891, *Muon Dynamics as a Spectral Wasserstein Flow*.
- `andrade2025sharpened`: arXiv:2505.07124, *Learning from Samples: Inverse Problems over measures via Sharpened Fenchel-Young Losses*.
- `peyre2026curvature`: arXiv:2604.22670, *Curvature of optimal transport with respect to the cost and applications to inverse optimal transport*.
- `ma2020learning`: arXiv:2002.09650, *Learning Cost Functions for Optimal Transport*.
- `karlsson2016generalized`: arXiv:1612.02273, *Generalized Sinkhorn iterations for regularizing inverse problems using optimal mass transport*.
- `backhoff2019weak`: arXiv:1809.05893, *Existence, Duality, and Cyclical monotonicity for weak transport costs*.
- `maas2016generalized`: arXiv:1607.01186, *Generalized optimal transport with singular sources*.
- `Chen2016`: arXiv:1610.03041, *Matrix Optimal Mass Transport: A Quantum Mechanical Approach*.
- `SturmGW`: arXiv:1208.0434, *The space of spaces: curvature bounds and gradient flows on the space of metric measure spaces*.
- `caglioti2019quantum`: arXiv:1908.01829, *Quantum optimal transport is cheaper*.
- `garg2018recent`: arXiv:1808.09669, *Recent progress on scaling algorithms and applications*.
- `HertrichChambolleDelon2025RectifiedOT`: arXiv:2505.19712, *On the Relation between Rectified Flows and Optimal Transport*.
- `Han2026WFlow`: arXiv:2605.11755, *One-Step Generative Modeling via Wasserstein Gradient Flows*.
- `Deng2026Drifting`: arXiv:2602.04770, *Generative Modeling via Drifting*.
- `Gretton2026DriftingWGF`: arXiv:2605.05118, *On the Wasserstein Gradient Flow Interpretation of Drifting Models*.
- `He2026SinkhornDrifting`: arXiv:2603.12366, *Sinkhorn-Drifting Generative Models*.
- `Vuckovic2020MathematicalAttention`: arXiv:2007.02876, *A Mathematical Theory of Attention*.
- `Geshkovski2023MathematicalPerspective`: arXiv:2312.10794, *A Mathematical Perspective on Transformers*.
- `Castin2025DynamicsTransformers`: arXiv:2501.18322, *A Unified Perspective on the Dynamics of Deep Transformers*.
- `Bohbot2025TokenSampleComplexity`: arXiv:2512.10656, *Token Sample Complexity of Attention*.
- `HardionLacombe2026GaussianSinkhornFlow`: arXiv:2602.10726, *The Wasserstein Gradient Flow of the Sinkhorn Divergence between Gaussian Distributions*.

A Crossref title-query sweep was also run over cited entries without DOI metadata. This is useful for finding typos but cannot be applied mechanically: Crossref often returns later journal versions, book chapters, SSRN versions, or unrelated papers with similar titles. The sweep found one additional definite metadata error, `schoenberg38`, and several intentionally unchanged cases where the local entry cites an arXiv preprint, a conference version, or a book edition rather than the Crossref top hit.

Crossref was used for the suspicious QAP survey entry:

- `loiola-2007`: Crossref confirms title, authors, journal, volume/issue/pages/year and DOI `10.1016/j.ejor.2005.09.032`.
- `schoenberg38`: Crossref/AMS confirms title, journal, volume 44, issue 3, pages 522--536, year 1938, and DOI `10.1090/S0002-9947-1938-1501980-0`.

## Fixes Applied

- `loiola-2007`: corrected the journal name from `European Journal Operational Research` to `European Journal of Operational Research`.
- `loiola-2007`: added DOI `10.1016/j.ejor.2005.09.032`.
- `schoenberg38`: corrected volume from `38` to `44`, pages from `522--356` to `522--536`, added issue `3`, and added DOI `10.1090/S0002-9947-1938-1501980-0`.
- `BigotBarycenter`: corrected stale arXiv title to match arXiv:1212.2562.
- `chowdhury2016constructing`: corrected stale arXiv title to match arXiv:1603.02385.
- `dessein2017parameter`: corrected stale arXiv title to match arXiv:1711.04366.
- `bernton2017inference`: corrected stale arXiv title to match arXiv:1701.05146.
- `cuturi2012positivity`: normalized the arXiv preprint field to include `arXiv:1209.2655`.
- `zemel2017fr`: normalized TeX accents/capitalization in the title.
- `Lowe1999`: cleaned the malformed page field `1150 -1157 vol.2` to `1150--1157`.
- `Combettes2007`: normalized the page range `564 -574` to `564--574`.
- `Crane2013`, `bronstein-2011`, `rustamov-2013`, `deGoes2015`, `SolomonEMDSurfaces2014`: normalized `ACM Transactions on Graphics`.
- `ZenICPR14`, `WangECCV12OLD`: converted proceedings stored as `article`/`journal` entries into `inproceedings`/`booktitle` entries.
- `endres2003new`, `AngenentHT03`, `Dykstra83`: corrected journal-name capitalization/spelling.
- `pytorch`: converted malformed URL-as-journal metadata into a `misc` entry.

## Remaining Notes

- Several cited entries are intentionally recorded as arXiv preprints because the cited manuscript text discusses very recent work. This is not a hallucination by itself; the arXiv identifiers checked above resolve and match the cited metadata.
- Crossref year mismatches were not automatically changed. Typical examples are preprints later published in journals, conference proceedings with publication year different from conference year, SSRN records, and book reprints. These should be changed only when the manuscript intends to cite the later published version.
- The uncited part of `latex/all.bib` remains a local reference library. It has now been structurally checked and all DOI/arXiv identifiers have been resolved, but entries without external identifiers have not all been manually matched against publisher pages.
