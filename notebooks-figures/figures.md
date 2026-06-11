# Figure Plan for OT4ML

This working document lists numerical illustrations to be added to the paper.  Each entry is indexed by the future LaTeX label `fig:<name>`.  The `<name>` part should also be used for the notebook and for the output directory:

- notebook: `notebooks-figures/<name>.ipynb`;
- generated PDFs: `latex/figures/<name>/*.pdf`;
- LaTeX reference: `\label{fig:<name>}`.

The entries below are organized in the order of the current paper sections, and within each section in the order where the figures are expected to appear.  They are figure ideas, not benchmark protocols: every notebook should remain lightweight, reproducible, and visually explanatory.

## Global Figure Conventions

- Status tags:
  - `[planned]` means the figure is specified in this roadmap but has not yet been implemented.
  - `[to revise]` means an existing notebook/PDF/LaTeX figure must be regenerated according to the detailed specification below.
  - `[to review]` means the notebook has been created, the PDFs have been generated, the LaTeX integration has been polished, and the figure is ready for human review.
  - `[to remove]` means the figure should be removed from the LaTeX integration and eventually archived or deleted after review.
  - `[archived]` means the figure notebook is kept for provenance, but the figure is no longer part of the live paper roadmap.
- Use red for the source measure `\alpha` and blue for the target measure `\beta`.
- Use linearly interpolated red-to-blue colors for geodesics, interpolants, barycenters, and time evolutions.
- Reuse the same simple one-dimensional Gaussian mixtures whenever comparison across figures is helpful.
- Reuse a small set of two-dimensional Gaussian mixtures or point clouds whenever this makes figures visually comparable.
- Fix random seeds in all notebooks.
- Export each panel as a separate PDF whenever the LaTeX figure should assemble several panels.
- Do not put titles inside exported PDFs; put panel titles and figure titles in LaTeX.
- Use boxed axes only when axes carry information.  Remove axes for point clouds, shapes, trajectories, and transport diagrams.
- Use small circular markers for points; avoid squares unless the object is intrinsically a matrix or grid cell.
- For discrete transport plans, draw red-to-blue transport segments or curves.  Use line thickness, opacity, or multiplicity to encode transported mass.
- Put numerical parameters in captions rather than in plot titles: number of points, exponent `p`, regularization `\varepsilon`, number of Sinkhorn iterations, relaxation strength, and time values.
- The notebook producing each figure should be polished, with a short pitching paragraph exposing the purpose. It should be split into several computational cells, with explanatory markdown cells and equations between them. Use the same notation as the paper, and keep the exposition fully synchronized with the LaTeX text. Use `$...$` and `$$...$$` for mathematical notation.
- Use as much as possible POT library.
- For the blue/red/violet disks representing Dirac masses, do not use white edges; only the filled disk should be colored.

### Shared Visual Dimensions

These values should be treated as the default contract for all notebooks.  They are also implemented in `notebooks-figures/figure_style.py`.

- Dirac mass disks: filled circles with area `s=15` in Matplotlib scatter units, no edge color and `linewidth=0`.
- Weighted Dirac disks: areas vary between `0.50*s` and `1.55*s`, normalized by the largest visible mass in the panel.
- Transport segments: default minimum width `0.18`, maximum width `1.75`, with width proportional to the square root of the displayed transported mass.
- Transport segment opacity: default alpha scale `0.68`, capped below full opacity so overlapping mass remains visible.
- Boxed axes: spine width `0.75`, used only when coordinates, densities, histograms, or functions are semantically important.
- Axis-free geometric panels: no ticks, no spines, equal aspect ratio whenever distances or angles matter.
- Default panel size: around `2.25in x 2.25in` for small geometric panels; use wider panels only for one-dimensional curves, densities, matrices, or time series that need horizontal space.
- PDF export padding: default `pad_inches=0.035`; use at most about `0.085` when dezooming is needed to avoid cropped disks or labels.
- Embedded text: no panel titles inside PDFs.  Use only mathematical annotations that are intrinsic to the drawing, and prefer putting parameter values in the LaTeX caption.
- Markers: circles only for points and Dirac masses.  Squares are allowed only for matrices, heatmaps, image pixels, or grid cells.

## Correction Batch Status

Figure 2: Histogram equalization as one-dimensional Monge transport on pixel intensities. -> [to review] target histogram changed from uniform to a concentrated truncated Gaussian near dark intensities; all histogram panels share a fixed vertical scale.

Figure 3: Optimal assignments between the same two point clouds for three powers of the Euclidean distance. -> [to review] canonical reference clouds now use farthest-point semi-regular samples in a central disk of radius `.5` and a target annulus of outer radius `1` and width `.15`, with small jitter.


Figure 4: From assignments to transport plans. -> [to review] uses the same disk-to-annulus geometry and transport-segment convention as Figure 3; the `m<n` panel has half as many target atoms, and the nonuniform target panel uses stronger mass variation with blue marker areas proportional to mass.

General comments :
- [to review] titles/panel labels are placed in LaTeX rather than embedded in the PDFs for the figures touched in this batch.
- [to review] regenerated PDFs use tighter padding/cropping where the notebooks were rerun.

2.5 One-Dimensional Transport and Quantiles -> [to review] `fig:monge-1d-quantile-geodesic` was restored in Section 2.5.

Figure 6: McCann displacement interpolation -> [to review] bottom-row density panels now use about sixteen hundred transported particles, a wider KDE smoothing window, and a farthest-point display subset.

Figure 7: Linearized transport coordinates around a fixed disk reference. -> [to review] the 2D row now shows red $\alpha$ and blue $\beta$ together, plus the purple linearized barycenter obtained by averaging Monge maps with KDE level sets and farthest-point display subsets.

2.7 Gaussian Measures and the Bures Metric -> [to review] added a one-dimensional Gaussian interpolation figure in the $(m,\sigma)$ half-plane with two density geodesics.

2.7 Gaussian Measures and the Bures Metric -> [to review] added a two-dimensional Gaussian interpolation figure for anisotropic-to-isotropic and rotated anisotropic pairs, using the red-to-blue interpolation convention.

Layout after Figure 7 -> [to review] float placement was relaxed to remove the large white-space/page-break artifact before Section 3.

Figure 8: Coupling matrices with their prescribed marginals -> [to review] removed black display boxes; the product and 20-bin OT panels no longer show a red barycentric curve, while the 200-bin OT panel keeps it.

Figure 12: Discrete gluing lemma in matrix form. -> [to review] removed the red Monge-map approximation and the remaining outer black frame from the matrix panels.

Figure 14: Entropic regularization of a linear objective -> [to review] used a very large epsilon for the large-epsilon triangle panel, displayed the entropic-penalized functional with colormap and level sets, added a second row for a two-dimensional polyhedron with entropy on slacks, and added the explanatory paragraph contrasting entropy-on-slacks, Burg barriers, and Sinkhorn structure.


Figure 15: Marginal constraints during Sinkhorn scaling -> [to review] moved the red source marginal constraint display to the left and kept circular markers only.

Figure 16: Dense Sinkhorn scaling for one-dimensional Gaussian-mixture marginals. -> [to review] removed black frames around the matrix displays.

Figure 17: Coupling matrices along Sinkhorn iterations for the same one-dimensional setting. -> [to review] replaced the old iteration sequence by converged Sinkhorn plans for varying epsilon.

Figure 18: KL-normalized Sinkhorn dual potentials along the scaling iteration -> [to review] the bottom of each plot now shows both alpha and beta density silhouettes.

Path-space Schrodinger bridges -> [to review] added `fig:sinkhorn-path-space-bridges`, generated by `sinkhorn-path-space-bridges.ipynb`. The figure displays six red source atoms concentrated near the center and six blue target atoms arranged around them. It uses the OT coupling at $\epsilon=0$ and three moderately entropic Sinkhorn couplings up to $\epsilon=0.28$, then lifts each selected endpoint pair to Brownian bridges with variance proportional to $\epsilon t(1-t)$ and a total display budget of 60 paths per panel.

Figure 20: KL-normalized Sinkhorn dual potentials for the same one-dimensional Gaussian-mixture setting. -> [to review] the bottom of each plot now shows both alpha and beta density silhouettes.

Figure 21: Entropically regularized couplings between the canonical red and blue point clouds -> [to review] redid the numeric with POT using the squared Euclidean cost, added convergence checks, and changed the geometry to a central red disk and a blue annulus.

Figure 22: Discrete Kantorovich dual potentials for the quadratic cost -> [to review] the second target is more strongly shifted and the third target is now a three-Gaussian mixture.


Figure 23: Continuous Kantorovich potentials for the same source -> [to review] mirrored the stronger shifted target and three-Gaussian target from Figure 22.

Figure 25: Hard c-transforms for the bilinear cost. -> [to review] used a reddish source-side palette, a blueish target-side palette, and made the initial potentials f and g visually distinct.

Figure 26: Laguerre cells for semi-discrete quadratic transport -> [to review] regenerated with twenty-one target atoms, i.e. 1.5x the previous site count, and slightly smaller circular markers.

Figure 27: Lloyd quantization for the same continuous density and initial site. -> [to review] regenerated with the same twenty-one initial codepoints as Figure 26 and slightly smaller circular markers.

Figure 30: Kernel mean embedding interpretation of MMD. -> [archived] removed from live LaTeX integration; the notebook is in `removed/` and its PDFs are in `../latex/figures/removed/`.


Figure 33: Debiasing by point optimization -> [to review] regenerated with three times more blue atoms, closer overlapping target modes, a one-line four-panel LaTeX layout, and mathematical panel labels below the PDFs.

Figure 35: Effect of the density-ratio regularizer on the coupling. -> [to review] regenerated with smaller regularization, dense coupling level sets to expose compact support, and mathematical $\phi$ labels from the main text.


Figure 34: Empirical fluctuation in dimension three. -> [to review] regenerated as two same-line panels for $d=3$ and $d=6$.

Figure 38: Sliced Wasserstein projections -> [to review] regenerated with roughly doubled semi-regular farthest-point samples from the silhouette assets, and LaTeX panel labels are now below the PDFs.

Figure 40: Linear OT coordinates. -> [to review] the one-dimensional row uses a translated Gaussian $\alpha$, a right-shifted three-Gaussian mixture $\beta$, and the averaged map $T_\gamma=(T_\alpha+T_\beta)/2$ without subtracting the identity; the 2D row shows $\alpha,\beta$ and the purple linearized barycenter.

Figure 41: Trace and spectral gauges for displacement covariances. -> [to review] redone with the same density-image convention as the McCann cat-to-heart interpolation: the coupling row remains a sparse transport visualization, while the interpolation rows use denser trace and spectral plans, deterministic weighted coupling support, Gaussian-smoothed KDE images, white zero-density background, and red-to-blue time colors.

Figure 42: Wasserstein barycenter grids for four corner measures. -> [to review] corrected after the stale-output audit: the left grid uses visibly separated one-, two-, three- and four-Gaussian one-dimensional inputs through averaged quantiles; the right grid computes entropic Sinkhorn barycenters on a uniform pixel grid from `notebooks-figures/assets/cat.png`, `notebooks-figures/assets/twodisks.png`, `notebooks-figures/assets/cross.jpg`, and `notebooks-figures/assets/trefle.jpg`, with normalized squared costs, the smaller regularization `epsilon=8e-4`, and exact corner silhouettes preserved.

Figure 43: Bures-Wasserstein barycenters -> [to review] the right grid now uses stronger anisotropy, making the nonlinear covariance interpolation more visible.

Figure 44: Changing the ground metric changes the optimal coupling. -> [to review] regenerated with a larger point set and closer mixture centroids; LaTeX panel labels are below the PDFs.

Figure 45: Weak barycentric transport on a small discrete coupling -> [to review] regenerated with disk/annulus clouds, fewer red atoms and three times more blue atoms; LaTeX panel labels now use $\pi_x$ and $\bar y(x)=\int y\,d\pi_x(y)$ below the PDFs.

Figure 46: Gromov-Wasserstein correspondences under increasing deformation. -> [to review] regenerated with a substantially stronger final deformation only in the rightmost target shape, and labels are below the PDFs.

Figure 47: Local distortion in a mildly non-isometric GW match. -> [to review] regenerated with a smaller target deformation so the residual matrix shows local distortion without overwhelming the correspondence; LaTeX labels use the hard correspondence $\sigma$ and the residual $|d_\X-d_\Y\circ\sigma|$ below the PDFs.

Figure 49: Two views of the continuity equation. -> [archived] Removed from the live LaTeX integration; the notebook is in `removed/` and its PDFs are in `../latex/figures/removed/`.

Figure 50: Benamou–Brenier geodesic between two sampled silhouettes. -> [to review] Regenerated with farthest-point shape samples, contour-only density panels, smaller KDE bandwidth, tighter crop, and arrow-only black midpoint velocities selected by a second farthest-point pass. The LaTeX layout now displays the interpolation strip and midpoint-velocity panel at the same height on a single line.

Figure 52: Entropy-driven Wasserstein gradient flows -> [to review] added a third right-hand panel for the porous-medium flow with power $m=6$, i.e. $\partial_t\rho=\Delta(\rho^6)$; the LaTeX layout now compares heat, $m=2$, and $m=6$ in one row.

Figure 53: Interaction-energy particle flows for three choices -> [to review] Regenerated with 1.5x particles, longer integration, smaller circular markers, and red-to-blue trajectory colors parameterized by curvilinear length.

Figure 55: Mean-field training of a homogeneous two-layer model as transport in neuron space. -> [to review] Reworked after checking `aux/mlp/` and `aux/mlp/fig-mlp/`: the figure now uses the reduced coordinates `(|u|v_1,|u|v_2)`, starts from a smaller initial Gaussian cloud, integrates the Wasserstein particle flow for a longer time, and shows no spectral-flow comparison.

Figure 58: Two-dimensional diffusion bridge from a three-component source. -> [to review] display now contains only the forward diffusion/noising path from three Dirac masses to one centered Gaussian, using the same geometry as Figure 59.

Figure 59: Diffusion-style sampling trajectories compared with OT rays. -> [to review] replaced the former speed-capped pseudo-flow by the closed-form reverse probability-flow ODE. The velocity is computed directly from the score $s_t=\nabla\log p_t$ of the Gaussian-mixture interpolation $p_t=\sum_j w_j\Gaussian((1-t)c_j,(t\sigma)^2I)$ through $v_t(z)=-(z+t\sigma^2s_t(z))/(1-t)$, integrated for the longer interval $t=.995$ down to $t=.015$ with a numerical assertion against the equivalent conditional-mean formula. Both panels now use continuous time-colored trajectories without intermediate dots, so the visual contrast is curved diffusion path versus straight OT ray.

Figure 60: Drifting fields for a small particle generator.  -> [to review] Regenerated with longer integrations, removed the unused vector-field panel from the live figure, and renamed the caption language to avoid the wording "normalized field".

Figure 61: Attention as a transportation dynamics on token measures. -> [archived] Removed from the live LaTeX integration; the notebook is in `removed/` and its PDFs are in `../latex/figures/removed/`.

Asset cleanup -> [to review] Verified that duplicate top-level shape assets are byte-identical to their canonical copies in `notebooks-figures/assets/`; notebooks use the asset directory, and the duplicate top-level copies were removed.

Archive cleanup -> [to review] Moved the 17 figure notebooks no longer referenced by live LaTeX `\includegraphics{figures/...}` commands to `notebooks-figures/removed/`, moved their generated PDF directories to `latex/figures/removed/`, and moved stale unreferenced PDF panels from otherwise live figure directories to `latex/figures/removed/stale-panels/`. The live inventory is now balanced: 61 notebooks, 61 figure directories, 212 included graphics, no missing graphics, and no unreferenced PDFs in live figure directories.

Stale-output audit -> [to review] Rechecked the figure edits after the user reported stale live PDFs: regenerated the affected notebooks, removed alias exports that created unused panels, rebuilt `latex/OT4ML.pdf`, scanned `OT4ML.log`, and visually inspected the affected standalone panels and manuscript pages. Details are recorded in `audit-figure-edits.md`.


## Latest Todo Iteration Status

Figure 30: Marginal violation along Sinkhorn half-steps -> [to review] added a right-hand gallery of the four limiting plans $P_\varepsilon$; each matrix has a colored box matching the corresponding convergence curve, and the LaTeX layout raises the 2-by-2 gallery slightly to align better with the error plot.

Figures 14, 26, 27, and 28: marginal-annotated coupling displays -> [to review] added the shared `coupling_box` convention, so the thin black frame surrounds only the coupling matrix while the marginal displays remain outside and tightly attached.

Figure 34: Visualization of the debiasing effect by point optimization -> [to review] increased the small-$\epsilon$ optimization budget, regenerated all four panels, and cleaned the caption to describe the common initialization rather than an internal draft comparison.

Figure 36: Density-ratio regularizers and coupling support -> [to review] regenerated with the smaller regularization strength $\epsilon=.06$, increased the fixed-point iteration counts, and updated the caption.

Figure 39: Sliced Wasserstein projections between two planar densities -> [to review] regenerated from dense farthest-point silhouette samples; both planar panels are smoothed black-and-white KDE-style density images, and the projected slice panels are one-dimensional smoothed density estimates rather than histograms.

Figure 41: Linear OT coordinates -> [to review] regenerated with sharper one-dimensional mixtures, farther two-dimensional target mixtures, a black central reference cloud, red/blue arrows from displayed reference atoms to transported endpoints, and farthest-point display subsets after denser OT computations.

## Post-Audit Fix Status

Figure `fig:kantorovich-coupling-polylines` -> [to review] moved next to the discrete coupling definition, changed the notebook export to straight transport segments, regenerated the live PDFs, and updated the caption/gallery wording accordingly.

Figure `fig:kantorovich-log-barrier-lp-geometry` -> [to review] rebuilt on the same equilateral triangular simplex as the entropic-regularization path illustration, with the barrier strength denoted by $\epsilon$; the small-$\epsilon$ minimizer and central path are computed from the exact KKT equations so the path approaches the correct LP vertex.

## Remaining New Todos

None in the active queue. The post-audit pass also checked the formerly untracked `latex/todo-new.md` list and converted it into an addressed status log.
