# Bibliography audit report

Date: 2026-06-14

## Scope

- Checked the LaTeX bibliography file `latex/all.bib`.
- Parsed 634 BibTeX entries.
- Parsed the current LaTeX auxiliary file and found 236 cited bibliography keys.
- Verified that every cited key is present in `latex/all.bib`.
- Verified that there are no duplicate BibTeX keys.
- Ran BibTeX syntax/style checks through the paper build.

## Automated checks performed

- BibTeX key integrity: no duplicate keys, no missing cited keys.
- Required-field linting for cited entries: no cited entry is missing the standard core fields expected by its BibTeX type.
- Placeholder linting: no cited entry contains placeholder markers such as `TODO`, `FIXME`, `unknown`, or `???` in bibliographic fields.
- DOI validation: 29 DOI fields were checked. Direct `doi.org` resolution returned either success or publisher/bot-protection status codes; Crossref metadata checks confirmed the DOI/title matches for the blocked high-value records.
- arXiv validation: all 68 arXiv identifiers appearing in `latex/all.bib` were queried against the arXiv API. All 68 resolved.
- arXiv metadata comparison: local titles, years, and first-author order were compared against arXiv metadata.

## Confirmed corrections

The following records were checked against arXiv metadata and corrected/confirmed in `latex/all.bib`.

| Key | Issue | Resolution |
| --- | --- | --- |
| `dessein2017parameter` | Missing first author in the local record. arXiv:1711.04366 lists Jean-Frédéric Diebold first. | Author list is `Diebold, Jean-Frédéric; Papadakis; Dessein; Deledalle`. |
| `kitagawa2016newton` | Local title omitted the initial phrase `Convergence of`. | Title is `Convergence of a Newton algorithm for semi-discrete optimal transport`. |
| `caglioti2019quantum` | Local author order had Caglioti before Golse, while arXiv:1908.01829 lists François Golse first. | Author list is `Golse, François; Caglioti; Paul`. |

## Checked items that are not errors

- `kruithof`: the title `Telefoonverkeersrekening` is a Dutch title, not a malformed unspaced English title.
- `sriperumbudur2009integral`: arXiv uses the Unicode character `φ`; the BibTeX uses the TeX form `$\phi$`. This is intentional and correct for BibTeX.
- `del2016robust`: automated first-author comparison flags `del Barrio` because the arXiv API abbreviates the given name as `E. del Barrio`; the local author is the same person and the order is correct.
- `backhoff2019weak`: automated first-author comparison flags the compound surname formatting; `Backhoff Veraguas, Julio` matches arXiv's `Julio Backhoff Veraguas`.
- Several valid DOI requests returned `403` or `418` from `doi.org` because of publisher or bot-protection behavior. Crossref metadata confirmed representative blocked DOIs, including the POT reference, Kuhn's Hungarian-method paper, Schoenberg's positive-definite functions paper, the Gao--Kleywegt DRO paper, and the Bonneel--Digne survey.

## External sources consulted

- arXiv API and arXiv pages for all bibliography arXiv identifiers, including `1711.04366`, `1603.05579`, `1908.01829`, `2505.19712`, `2602.01372`, `2604.04891`, `2604.22670`, `2605.11755`, `2602.04770`, `2605.05118`, and `2603.12366`.
- Crossref API for DOI/title validation of DOI-bearing records.
- Publisher/DOI metadata checks for selected blocked DOI records.

## Conclusion

No hallucinated cited bibliography entry was found. The three genuine metadata errors found during the audit concerned author attribution/order or exact title wording, and the corrected metadata is now present in `latex/all.bib`. The current bibliography builds cleanly with BibTeX.
