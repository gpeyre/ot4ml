# Optimal transport exercises

Each topic has a separate directory and two PDF editions. The `-uncorrected`
filename means **statements only**; the statements have been checked and revised
in both editions. In the corrected edition, every exercise is followed by useful
question-by-question hints and a detailed solution.

| Topic | Exercises | Statements | Hints and solutions |
| --- | ---: | --- | --- |
| Monge transport | 13 | [PDF](exo-monge/exo-monge-uncorrected.pdf) | [PDF](exo-monge/exo-monge.pdf) |
| Discrete Kantorovich transport | 5 | [PDF](exo-kanto-discr/exo-kanto-discr-uncorrected.pdf) | [PDF](exo-kanto-discr/exo-kanto-discr.pdf) |
| Continuous Kantorovich transport | 6 | [PDF](exo-kanto-cont/exo-kanto-cont-uncorrected.pdf) | [PDF](exo-kanto-cont/exo-kanto-cont.pdf) |
| Entropic transport and Sinkhorn | 11 | [PDF](exo-sinkhorn/exo-sinkhorn-uncorrected.pdf) | [PDF](exo-sinkhorn/exo-sinkhorn.pdf) |
| Wasserstein gradient flows | 6 | [PDF](exo-gradient-flows/exo-gradient-flows-uncorrected.pdf) | [PDF](exo-gradient-flows/exo-gradient-flows.pdf) |

Discrete and continuous Kantorovich transport are intentionally separate sheets,
not chapters of a combined PDF. The website links to all ten editions in its
Exercises section.

## Rebuilding

With `pdflatex` and the packages listed in the sources installed, run from the
repository root:

```sh
python3 exercises/build.py
python3 exercises/build.py --check
```

To rebuild one topic, append its directory name, for example `exo-monge`.
Compilation runs twice to resolve references. Intermediate files stay in the
ignored `.build/` directory. Each `.tex` file is standalone and builds the
corrected edition by default; defining `\StatementOnly` hides both hints and
solutions. The shared style is recorded in `preamble.tex` and copied into the
standalone sources; edits to that template must also be applied to the sources.

The numerical and PDF regression checks require NumPy and pypdf:

```sh
python3 exercises/test_exercises.py
```

## Mathematical corrections

All 41 exercise statements and their solutions were reviewed. The substantive
corrections include:

- **Monge:** added nondegeneracy and moment assumptions; distinguished atomless
  laws from laws with densities; corrected the discrete probability-integral
  transform; handled radial atoms correctly; repaired the translation identity
  and the discussion of nonunique one-dimensional linear-cost transport maps.
- **Discrete Kantorovich:** clarified mass normalization and the zero-parameter
  case; justified collision-free quadratic displacement interpolation and the
  permutation solution for equal weights; corrected the forbidden-cost argument
  and separated coupling matrices from interpolation maps.
- **Continuous Kantorovich:** fixed conditional-law normalization, the matrix
  orientation in the Gaussian optimizer and its cross covariance; established
  Gaussian optimality over all couplings; repaired the non-Monge example and
  the assumptions and residual construction in the bottleneck-cost exercise.
- **Sinkhorn:** corrected dual signs in the multimarginal and unbalanced
  problems; supplied Gaussian integrability conditions; clarified the simplex
  envelope derivative and the entropy-only convention for joint convexity;
  corrected the multimarginal Hilbert-contraction discussion and stated the
  superlinear-growth assumption needed for the proposed divergence formula.
- **Gradient flows:** fixed the density factor in Fisher information and its
  first variations; supplied boundary assumptions and the mass-preserving
  modification of the L2 flow; differentiated general nonsymmetric interaction
  kernels correctly, using raw second moments; limited Gaussian closure to the
  ODE lifetime where necessary and supplied a blow-up example; corrected the
  time parametrization and factor of two for descent of squared Wasserstein
  distance.

The solutions now explain intermediate steps rather than only giving final
formulas. Every exercise starts below a blue divider, with its title on a separate
line. Consistent hint and solution headings and page-break protection make the
blocks easy to distinguish; no answers appear in the statement editions.
The homepage presents the five topics in a compact three-column grid, adapting
to two columns on tablets and one on phones, without per-sheet descriptions.

## Checks

- All ten PDFs compile without unresolved references or missing glyph warnings.
- Source checks verify the 41 statement/hints/solution triples and local labels.
- PDF checks verify that every corrected exercise has hints and a solution and
  that neither appears in a statement-only edition.
- Numerical regression checks cover assignment enumeration, explicit transport
  integrals, noncommuting Gaussian covariances, first variations, unbalanced
  coordinate maximization, Gaussian Sinkhorn formulas and flow time changes.
- Rendered pages are inspected for equation overflow and orphaned headings.
