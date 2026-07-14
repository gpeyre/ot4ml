# Mean field games

This directory contains a self-contained, gentle introduction to the mathematical theory of mean field games, written in the notation and expository style of *Optimal Transport for Machine Learners*.

The note emphasizes:

- the passage from finite-player Nash games to a population law;
- the coupled Hamilton--Jacobi--Bellman and Fokker--Planck system;
- continuity equations, weak measure solutions, and controlled diffusions;
- potential games as Benamou--Brenier-type variational problems;
- the precise relation, and distinction, between MFG planning and JKO/Wasserstein gradient flows;
- Lasry--Lions monotonicity and uniqueness;
- master equations, finite-player convergence, and numerical methods.

The companion note **variational_mfg_convexity.tex** focuses on potential
MFGs. It proves why changing from velocity to momentum variables produces a
convex problem, derives the convex dual and MFG optimality system, and compares
the construction with Benamou--Brenier transport and JKO minimizing movements.

Build with:

```sh
pdflatex -interaction=nonstopmode -halt-on-error mean_field_games.tex
bibtex mean_field_games
pdflatex -interaction=nonstopmode -halt-on-error mean_field_games.tex
pdflatex -interaction=nonstopmode -halt-on-error mean_field_games.tex
```

Replace `mean_field_games` by `variational_mfg_convexity` to build the focused
companion note.
