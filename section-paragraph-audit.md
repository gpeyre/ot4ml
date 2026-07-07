# Section / Paragraph Structure Audit

This audit checks section-like heading blocks in the LaTeX sources for two layout issues:

- a `\section`, `\subsection`, or `\subsubsection` that starts immediately with `\paragraph` and has no pitch sentence;
- a heading block that contains exactly one direct `\paragraph`, which makes the paragraphing look accidental rather than structural.

The intended local pattern is:

```tex
\section{Section title}
Pitch sentence of the section.

\paragraph{Paragraph title.} Pitch sentence of the paragraph [...]
\paragraph{Paragraph title.} Pitch sentence of the paragraph [...]
```

## Scope

Audited source trees:

- `OT4ML/sections/*.tex`
- `PDE4ML/sections/*.tex`
- `compact/sections/*.tex`

The structural parser counted direct child `\paragraph` commands under each section-like heading and ignored labels, indexes, whitespace and comments immediately after headings.

## Initial Findings

Initial structural issues found: 69.

- `OT4ML/sections`: 11 issues.
- `PDE4ML/sections`: 2 issues.
- `compact/sections`: 56 issues.

The compact handout had most findings because it intentionally used compressed paragraph-led subsections. These were fixed with short pitch sentences to preserve compactness.

## Main Book Updates

Updated the following main-book sections.

- `OT4ML/sections/dual-norms.tex`: added a section pitch and a first paragraph `Dual-norm viewpoint.` before `Integral probability metrics.`
- `OT4ML/sections/generalized-ot-problems.tex`: added a subsection pitch and a first paragraph `First variations of OT values.` before `Inverse Optimal Transport.`
- `OT4ML/sections/generalized-wasserstein.tex`: added a section pitch and a first paragraph `Quotient distances.` before `Rigid motions and Wasserstein--Procrustes.`
- `OT4ML/sections/kantorovich.tex`: added a paragraph `Strong versus weak topology.` so `Metric Properties: Topology and Applications` no longer has a lone paragraph; also added a pitch before `DRO ambiguity sets.`
- `OT4ML/sections/matching.tex`: added `Classical assignment methods.` before `Hungarian primal-dual method.`
- `OT4ML/sections/monge.tex`: added a pitch before `Cumulative and quantile functions.`
- `OT4ML/sections/sinkhorn-advanced.tex`: added `Projective contraction.` in the Hilbert-metric section; added a pitch and `Parabolic Monge--Ampere limit.` in the continuous epsilon-Sinkhorn section.
- `OT4ML/sections/statistical-ot.tex`: added a pitch and `Empirical laws.` before `Central-limit fluctuations.`
- `OT4ML/sections/wasserstein-gradient-flows.tex`: added a pitch before `Generalized Wasserstein flows.`

## PDE4ML Updates

Updated the PDE4ML survey to keep the copied structure consistent with the main book.

- `PDE4ML/sections/primer-ot.tex`: added a pitch and `Metric structure.` before `Interpolation induced by an optimal plan.`
- `PDE4ML/sections/wasserstein-gradient-flows.tex`: added a pitch before `Generalized Wasserstein flows.`

## Compact Handout Updates

Updated compact subsections with short pitch sentences before their first run-in paragraph, and added an extra first paragraph title in singleton cases.

Files touched:

- `compact/sections/beyond-comparing-measures.tex`
- `compact/sections/dual-norms.tex`
- `compact/sections/dual.tex`
- `compact/sections/dynamic-ot.tex`
- `compact/sections/generalized-ot-problems.tex`
- `compact/sections/generalized-wasserstein.tex`
- `compact/sections/kantorovich.tex`
- `compact/sections/matching.tex`
- `compact/sections/monge.tex`
- `compact/sections/semidiscr-w1.tex`
- `compact/sections/sinkhorn-advanced.tex`
- `compact/sections/sinkhorn.tex`
- `compact/sections/statistical-ot.tex`
- `compact/sections/transportation-models.tex`
- `compact/sections/wasserstein-gradient-flows.tex`

The compact additions are intentionally terse, for example:

```tex
This compact subsection compares weak discrepancies through their discriminator classes.

\paragraph{Test-function viewpoint.}
Dual norms compare signed measures by restricting admissible test functions.

\paragraph{Integral probability metrics.}
...
```

## Final Verification

The structural audit was rerun after edits and returned:

```text
TOTAL 0
```

This means no audited heading block starts directly with `\paragraph`, and no audited heading block contains a single direct `\paragraph`.

Rebuilt PDFs successfully with `pdflatex -interaction=nonstopmode -halt-on-error`:

- `OT4ML/OT4ML.pdf` rebuilt successfully.
- `PDE4ML/PDE4ML.pdf` rebuilt successfully.
- `compact/CourseOT-compact.pdf` rebuilt successfully.

Only non-fatal layout/font warnings remain; no LaTeX errors were introduced by this pass.
