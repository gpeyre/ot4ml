# Guidelines for `PDE4ML/`

## Purpose

Create a standalone long review paper titled **PDE4ML: PDEs for Machine Learning**. The review should explain how PDE and optimal-transport tools are used to analyze machine-learning methods, especially training dynamics and generative models.

## Organization

- Start with a new abstract tailored to PDEs for ML.
- Add a scope/literature header listing major references and explaining the focus.
- Include a first section, **A Primer on Optimal Transport**, covering:
  - Monge problem for general measures;
  - Monge problem for discrete measures;
  - Kantorovich problem for general measures;
  - Kantorovich problem for discrete measures;
  - Brenier theorem;
  - Wasserstein metric properties and geodesics.
- Reuse the current **Dynamic Optimal Transport** material as a top-level section.
- Reuse the current **Wasserstein Gradient Flows** material as a top-level section.
- Reuse the current **Generative Models via Transportation** material as a top-level section.
- End with a new conclusion focused on PDE/ML perspectives.

## Independence

- The directory must compile without relying on `latex/`.
- Copy local versions of the style files, notation file and bibliography.
- Copy only the figure PDF directories used by this review.
- Keep figure paths relative to `PDE4ML/`.
- Keep `Makefile` as the canonical local build entry point.

## Reorganization Principle

- For now, prioritize copy/paste and clean reorganization over rewriting.
- When copied material refers to earlier OT notions, point back to the primer.
- Remove or rewrite references to excluded material when they become distracting.
- Keep the local structure section-based, because the target is a long review paper rather than a short monograph.
- Preserve mathematical content during future restructuring.

## Style

- Keep notation synchronized with the full OT4ML manuscript.
- Keep theorem, definition, remark, example and algorithm environments visually consistent with OT4ML.
- Prefer concise pitch paragraphs at the start of each major section.
- Prefer local references over vague pointers.
- Figures should remain reproducible from the original notebooks in the main project.
