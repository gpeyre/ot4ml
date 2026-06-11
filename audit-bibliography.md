# Bibliography audit

Date: 2026-06-11.

## Scope

- Checked the bibliography used by `latex/OT4ML.tex`, namely `latex/all.bib` and the generated `latex/OT4ML.bbl`.
- Checked the active citation keys recorded in `latex/OT4ML.aux`, which is what BibTeX uses to build the printed bibliography.
- Ran BibTeX and LaTeX after corrections.
- Queried arXiv metadata for every cited entry carrying an arXiv identifier.
- Queried Crossref metadata for every cited entry carrying a DOI.

## Mechanical checks

- Citation occurrences in the compiled manuscript: 304.
- Unique cited keys in the compiled manuscript: 207.
- Entries in `latex/all.bib`: 604.
- Undefined cited keys: 0.
- Duplicate BibTeX keys: 0.
- BibTeX warnings after rebuild: 0.
- LaTeX build after rebuild: successful.

## External metadata checks

- All 23 cited arXiv identifiers resolved through the arXiv API.
- Local arXiv titles were compared against arXiv metadata; no title mismatch remained after the pass.
- All 18 remaining cited DOI fields were checked against Crossref; no title or publication-year mismatch remains.

## Corrections applied

- `peyre2019computational`: removed the spurious `and others`, normalized the journal name to `Foundations and Trends in Machine Learning`, restored the full published title, and added the DOI.
- `gigli2011user`: fixed the corrupted author field `Gigli, L Ambrosio-N`; converted the entry to an `incollection` with Ambrosio and Gigli, Lecture Notes in Mathematics volume 2062, pages 1--155.
- `weed2025statistical`: replaced the incorrect Weed/Niles-Weed/Rigollet Springer-book metadata by the arXiv lecture-note metadata for Chewi, Niles-Weed and Rigollet.
- `latex/OT4ML.tex`: updated the literature guide so it no longer describes the statistical OT reference as a Weed/Niles-Weed/Rigollet monograph.
- `Kuhn1955`: normalized field formatting and author order without changing the bibliographic target.
- Core OT monographs: normalized accents/full author names, fuller titles, series volume, and publisher formatting for Villani, Santambrogio, Rachev--Ruschendorf, and Ambrosio--Gigli--Savare.
- `RuschendorfThomsen`: removed a dead DOI field that returned 404 through both DOI resolution and Crossref.
- `samelson1957perron`: removed an `and others` placeholder after checking that the cited short note is attributed to Hans Samelson.
- `Kantorovich42`: normalized the page range to BibTeX's `227--229` form.
- `backhoff2019weak`: corrected the arXiv preprint year from 2019 to the first arXiv posting year, 2018.
- `flamary2021pot`: added the canonical JMLR reference for POT and cited it in the opening repository/figure acknowledgement.

## Second-pass notes

- The earlier raw-source count saw 216 unique keys because it also picked up citations in inactive/commented material. The authoritative BibTeX count is the `OT4ML.aux` count above: 206 unique cited entries.
- A duplicate-title scan over the active cited entries found no duplicate references.
- A required-field scan over the active cited entries found no missing required fields for their BibTeX types.
- A placeholder scan over active cited entries found no remaining true placeholder metadata; the only apparent hit was a section comment between entries, not part of the rendered reference.
- An arXiv year scan found and corrected one mismatch; all active arXiv years now match the corresponding arXiv metadata.

## Remaining notes

- The file still contains many uncited legacy entries. They are not a compilation problem and were not removed, because they may be useful while the manuscript is still evolving.
- Some older entries use minimal metadata, but no cited entry currently breaks BibTeX or produces undefined citations.
