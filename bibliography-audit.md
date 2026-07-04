# Bibliography Audit

This pass checked `OT4ML/all.bib` for malformed entries, missing cited keys, suspicious metadata, and likely hallucinated references.  The emphasis was on entries recently added or used in newly edited parts, plus entries flagged by automated checks.

## Checks performed

- Parsed `OT4ML/all.bib`: 783 BibTeX entries, 783 unique keys.
- Checked required fields by entry type: no missing `author`, `title`, `year`, `journal`, `booktitle`, or `publisher` fields after fixes.
- Checked cited keys in `OT4ML/sections/*.tex` and `OT4ML/OT4ML.tex`: no missing cited bibliography keys, ignoring the intentional `\nocite{*}`.
- Checked malformed metadata patterns: no empty fields, no obvious encoding corruption, no DOI fields containing URLs, no previous malformed `surveyof`-type strings.
- Queried arXiv metadata for all 78 arXiv IDs present in the bibliography: no title mismatches were found.  Five entries had year discrepancies because the `.bib` year had been set to a later publication/update year while the entry was still formatted as an arXiv preprint.
- Queried Crossref for suspicious or high-risk entries and upgraded entries only when Crossref returned an exact title match.
- Rebuilt the bibliography with `bibtex OT4ML` and rebuilt the PDF with two LaTeX passes.

## Corrections applied

- `BenamouCarlierNenna2018GeneralizedIncompressible`: upgraded from arXiv-preprint metadata to the published `Numerische Mathematik` article, volume 142, number 1, pages 33--54, year 2019, DOI `10.1007/s00211-018-0995-x`.
- `LinHoCuturiJordan2022MOTComplexity`: kept as arXiv preprint but corrected the year from 2022 to the arXiv year 2019; added `eprint` and `archivePrefix`.
- `HaaslerRinghChenKarlsson2021TreeMOT`: upgraded from arXiv-preprint metadata to `SIAM Journal on Control and Optimization`, volume 59, number 4, pages 2428--2453, year 2021, DOI `10.1137/20M1320195`.
- `AltschulerBoixAdsera2022StructuredMOT`: upgraded from arXiv-preprint metadata to `Mathematical Programming`, volume 199, number 1--2, pages 1107--1178, year 2023, DOI `10.1007/s10107-022-01868-7`.
- `CarlierChizatLabordeDisplacementSmoothness`: upgraded from arXiv-preprint metadata to `ESAIM: Control, Optimisation and Calculus of Variations`, volume 30, article/page 25, year 2024, DOI `10.1051/cocv/2024013`.
- `Pass2`: removed an empty `collaboration` field and added DOI `10.1137/100804917`.
- `Lowe1999`: removed an empty `number` field, normalized the author initial, and added DOI `10.1109/ICCV.1999.790410`.
- `lemmens2012nonlinear`: added DOI `10.1017/CBO9781139026079`.
- `knight2014symmetry`: added DOI `10.1137/110825753`.
- `knight2008sinkhorn`: added DOI `10.1137/060659624`.
- `AbrahamRadon`: added DOI `10.1007/s00245-015-9323-3`.
- `GramfortPC15`: added publisher metadata and DOI `10.1007/978-3-319-19992-4_20`.

## Items deliberately not changed

- Several recent machine-learning and single-cell entries remain arXiv/preprint entries because Crossref did not return an exact published match in this pass, while arXiv metadata matched the `.bib` title.  These were not treated as hallucinations.
- Entries that are currently uncited but valid were left in `all.bib`; the book uses `\nocite{*}`, so unused entries are part of the broad bibliography rather than necessarily dead material.
- Layout warnings in `OT4ML.log` about font substitutions, underfull boxes, and `mdframed` page breaks are unrelated to bibliography integrity and were not edited here.

## Build status

- `bibtex OT4ML`: successful; no BibTeX warnings.
- `pdflatex` twice after BibTeX: successful.
- Final scan: no undefined citations, no undefined references, no fatal LaTeX errors.

## External verification sources

- Crossref API was used for DOI and publication metadata checks.
- arXiv API was used to verify arXiv identifiers and titles.

## Duplicate-entry pass

A dedicated duplicate scan was run across `OT4ML/all.bib`, `arxiv/all.bib`, and `PDE4ML/all.bib`.  The scan checked exact duplicate keys, normalized DOI fields, normalized arXiv identifiers, normalized titles, and a conservative fuzzy-title pass to catch LaTeX accent and punctuation variants.

### Duplicate entries removed

The following semantic duplicates were removed from `OT4ML/all.bib`; the same cleanup was propagated to `arxiv/all.bib` and `PDE4ML/all.bib` when the duplicate key was present.

- Removed `agueh2015optimal`; kept `saumier2015optimal` for *Optimal transport for particle image velocimetry*.
- Removed `BigotBarycenter`; kept the published entry `bigot2012characterization`.
- Removed `Benamou:2014jw`; kept `benamou2014numerical` for the Monge--Ampere numerical solver paper.
- Removed `Levy3d`; kept `levy2015numerical` for semi-discrete OT in 3D.
- Removed `BassettiaEstimation`; kept the cited key `bassetti2006minimum`.
- Removed `BachJMLR14`; kept `bach2014adaptivity`, whose metadata has the correct JMLR page range.
- Removed `NIPS2017_6858`; kept `staib2017parallel`.
- Removed `li2017computations`; kept the published DOI-bearing entry `LiYinOsher2017_computationsa`.
- Removed `trouve2005metamorphoses`; kept the cited key `Metamorphosis2005`.
- Removed `hundrieser2022empirical` from `OT4ML/all.bib`; its title duplicated `tameling2017empirical`, while the separate entropic countable-space result is already represented by `hundrieser2021limit`.

### Citation updates

- Removed duplicate citation of `trouve2005metamorphoses` next to `Metamorphosis2005` in the quotient/Wasserstein--Procrustes discussion.
- Removed `hundrieser2022empirical` from the statistical OT countable-space citation and kept `tameling2017empirical`; the entropic Hundrieser--Klatt--Munk reference remains cited separately as `hundrieser2021limit`.
- Updated a legacy source copy in `svg/06-11/sections/monge.tex` from `Benamou:2014jw` to `benamou2014numerical`.

### Post-cleanup checks

- `OT4ML/all.bib`: 773 entries, 773 unique keys; no duplicate normalized DOI, arXiv identifier, or title groups.
- `arxiv/all.bib`: 716 entries, 716 unique keys; no duplicate normalized DOI, arXiv identifier, or title groups.
- `PDE4ML/all.bib`: 695 entries, 695 unique keys; no duplicate normalized DOI, arXiv identifier, or title groups.
- Cited-key check: `OT4ML` has 454 cited keys and 0 missing; `arxiv` has 378 cited keys and 0 missing; `PDE4ML` has 120 cited keys and 0 missing.
