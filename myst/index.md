---
title: Optimal Transport for Machine Learners
subtitle: Executable web book prototype
---

This directory is the beginning of an executable web version of *Optimal
Transport for Machine Learners*. The aim is not to discard the LaTeX book, but
to give it a second life as a computational reading environment:

- the mathematical exposition stays close to the book;
- the publication figures become small executable experiments;
- technical plotting and data-generation code is hidden from the main reading
  flow;
- the reader can still change a few meaningful parameters and rerun the cells.

The first prototype chapter is [](chapters/matching).

:::{note}
The current focus is the first chapter. It demonstrates the intended pattern:
visible parameter cells, revealable plotting calls, and reusable hidden helpers
in `ot4ml_web.py`.
:::

:::{tip}
For live parameter editing in the browser, start the local Jupyter backend with
`npm run jupyter`, start the MyST site with `npm run start`, then click the
power button at the top of the page.
:::
