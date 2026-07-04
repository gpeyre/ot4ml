# Applications of Optimal Transport in Machine Learning and AI

This file is both a planning document and a progress ledger for application
examples in the OT4ML book.  Each item below is meant to correspond to a compact
`example` environment inserted near the mathematical tool it illustrates.

## Editorial Rule for Future Insertion

Each application should be inserted as a single `example` environment with a
title of the form `Application to ...`.  The block should not be a detached
bibliographic aside: it should start from the notation and theorem currently
being discussed, explain the concrete machine-learning task, give the minimal
mathematical formulation, and then cite a small number of representative papers.

For each application, the preferred structure is:

- **Mathematical hook.** A two- or three-line formula connecting the application
to the surrounding section.
- **Practical message.** What OT buys in the application: alignment, geometry,
differentiability, barycentric averaging, uncertainty, growth/death, or testing.
- **References.** A curated list of stable papers, avoiding long incremental
bibliographies.
- **Book location.** The precise section where the example should be inserted.

## Implementation Status

Status after the insertion and polishing passes:

| Application | Status | Book location |
| --- | --- | --- |
| Domain adaptation | Done, polished | `OT4ML/sections/kantorovich.tex`, `ex-domain-adaptation` |
| Single-cell trajectory inference | Done, polished | `OT4ML/sections/kantorovich.tex`, `ex-single-cell-trajectory-inference` |
| Single-cell gradient-flow models | Done, polished | `OT4ML/sections/wasserstein-gradient-flows.tex`, `ex-single-cell-gradient-flow` |
| Perturbation-response prediction | Done, polished | `OT4ML/sections/transportation-models.tex`, `ex-perturbation-response-neural-ot` |
| Gene-expression distances | Done, polished | `OT4ML/sections/kantorovich.tex`, `ex-gene-expression-distance` |
| Proliferating and dying cell populations | Done, polished | `OT4ML/sections/generalized-wasserstein.tex`, `ex-unbalanced-single-cell` |
| Multi-omics alignment | Done, polished | `OT4ML/sections/beyond-comparing-measures.tex`, `ex-multi-omics-alignment` |
| Fair score repair | Done, polished | `OT4ML/sections/generalized-ot-problems.tex`, `ex-fair-score-repair` |
| Visual distributions | Done, polished | `OT4ML/sections/kantorovich.tex`, `ex-visual-distributions` |
| Structured objects | Done, polished | `OT4ML/sections/beyond-comparing-measures.tex`, `ex-structured-objects-gw` |
| Word embeddings and documents | Done, polished | `OT4ML/sections/kantorovich.tex`, `ex-word-mover-distance` |
| Structured prediction losses | Done, polished | `OT4ML/sections/estimation.tex`, `ex-structured-prediction-wasserstein-loss` |
| Two-sample testing and generative-model evaluation | Done, polished | `OT4ML/sections/statistical-ot.tex`, `ex-two-sample-testing-fid` |
| Imitation learning | Done, polished | `OT4ML/sections/dual-norms.tex`, `ex-imitation-learning-ot` |

The insertion pass added a compact bibliography block in `OT4ML/all.bib` for
the application papers that were not already present locally.  The polishing
passes aligned notation with the main book, added cross-references to related
sections, made the mathematical operations explicit when needed, and clarified
the practical message of each example.  A few roadmap
references that still needed exact verification, such as SCOT metadata and the
intended STORIES reference, were not cited in the book examples.

## Transfer Learning and Domain Adaptation

**Proposed example title.** `Application to domain adaptation`.

**Mathematical hook.** Given labeled source samples
\((x_i^s,y_i^s)_i\) and unlabeled target samples \((x_j^t)_j\), write
\(\alpha_s=\sum_i a_i\delta_{x_i^s}\) and
\(\alpha_t=\sum_j b_j\delta_{x_j^t}\).  OT estimates a coupling
\(P\in\U(a,b)\) between the two feature clouds.  Labels can then be transported
by the barycentric rule
\[
        \tilde y_j = \frac{1}{b_j}\sum_i P_{ij}y_i^s,
\]
or the coupling can be optimized jointly with a classifier through a feature-label
cost, as in JDOT.

**Practical message.** OT is useful because it keeps explicit correspondences
between source and target samples.  Class-aware costs, entropic regularization,
and learned representations turn the basic coupling into practical domain
adaptation methods.

**Representative references.**

- Courty, Flamary, Tuia, Rakotomamonjy, [Optimal Transport for Domain Adaptation](https://arxiv.org/abs/1507.00504), 2015.
- Courty, Flamary, Habrard, Rakotomamonjy, [Joint Distribution Optimal Transportation for Domain Adaptation](https://arxiv.org/abs/1705.08848), 2017.
- Damodaran, Kellenberger, Flamary, Tuia, Courty, [DeepJDOT: Deep Joint Distribution Optimal Transport for Unsupervised Domain Adaptation](https://arxiv.org/abs/1803.10081), 2018.
- Shen, Qu, Zhang, Yu, [Wasserstein Distance Guided Representation Learning for Domain Adaptation](https://arxiv.org/abs/1707.01217), 2017.

**Book location.** Chapter `Kantorovich Relaxation`, after `Relaxation for
Arbitrary Measures`; a second short pointer can be added in `Metric learning and
inverse OT`.

## Single-Cell Population Alignment and Trajectory Inference

**Proposed example title.** `Application to single-cell trajectory inference`.

**Mathematical hook.** A time course of single-cell measurements gives empirical
measures
\[
        \alpha_{t_k}=\frac1{n_k}\sum_{i=1}^{n_k}\delta_{x_i^{(k)}}
\]
on a gene-expression or latent cell-state space.  Since sequencing is destructive,
one observes populations at several times, not trajectories of the same cells.
OT couplings \(\pi_k\in\Gamma(\alpha_{t_k},\alpha_{t_{k+1}})\) provide soft
ancestor-descendant relations and can be composed or regularized dynamically to
infer developmental trajectories.

**Practical message.** This is one of the clearest modern examples where OT is
not merely a distance: the coupling itself is the object of biological interest.
Entropic, dynamic, and unbalanced variants account for noisy sampling, branching,
and population growth.

**Representative references.**

- Schiebinger et al., *Optimal-Transport Analysis of Single-Cell Gene Expression Identifies Developmental Trajectories in Reprogramming*, Cell, 2019.
- Tong, Huang, Wolf, van Dijk, Krishnaswamy, [TrajectoryNet: A Dynamic Optimal Transport Network for Modeling Cellular Dynamics](https://arxiv.org/abs/2002.04461), 2020.
- Lavenant, Zhang, Kim, Schiebinger, [Towards a Mathematical Theory of Trajectory Inference](https://arxiv.org/abs/2102.09204), 2021.
- Klein, Uscidda, Theis, Cuturi, [GENOT: Entropic (Gromov) Wasserstein Flow Matching with Applications to Single-Cell Genomics](https://arxiv.org/abs/2310.09254), 2023.

**Book location.** Chapter `Kantorovich Relaxation`, at the end of `Metric
Properties: Topology and Applications`, with a forward pointer to `Dynamic
Optimal Transport` and `Generative Models via Flow Matching`.

## Single-Cell Dynamics as Wasserstein Gradient Flows

**Proposed example title.** `Application to single-cell gradient-flow models`.

**Mathematical hook.** Instead of only estimating pairwise couplings between
snapshots, one can posit that a latent population law solves
\[
        \partial_t\alpha_t+\nabla\cdot(\alpha_t v_t)=0,
        \qquad
        v_t=-\nabla \frac{\delta \mathcal F}{\delta \alpha}(\alpha_t),
\]
for an energy such as
\(\mathcal F(\alpha)=\int V\,d\alpha+\tau\Ent(\alpha)\).  The potential
\(V\), the interaction part of \(\mathcal F\), or a neural approximation of
\(v_t\) is then fitted from unpaired population snapshots.

**Practical message.** This application connects the biological language of a
Waddington landscape to the mathematical language of gradient flows.  It also
explains why dynamic OT, Fokker--Planck equations, and flow matching naturally
appear in modern single-cell trajectory models.

**Representative references.**

- Tong, Huang, Wolf, van Dijk, Krishnaswamy, [TrajectoryNet](https://arxiv.org/abs/2002.04461), 2020.
- Lavenant, Zhang, Kim, Schiebinger, [Towards a Mathematical Theory of Trajectory Inference](https://arxiv.org/abs/2102.09204), 2021.
- Klein, Uscidda, Theis, Cuturi, [GENOT](https://arxiv.org/abs/2310.09254), 2023.

**Book location.** Chapter `Wasserstein Gradient Flows`, after `Minimizing
Movements and Wasserstein Gradients`, with a backward pointer to `Benamou--Brenier
dynamic formulation of OT`.

## Single-Cell Perturbation Response and Neural OT Maps

**Proposed example title.** `Application to perturbation-response prediction`.

**Mathematical hook.** For a control distribution \(\alpha\) and a perturbed
distribution \(\beta\), the goal is not only to compare \(\alpha\) and \(\beta\),
but to learn a map or stochastic kernel sending a new unperturbed cell to its
likely perturbed state.  Neural OT parameterizes a Monge map, semi-coupling, or
conditional transport map and trains it from unpaired samples.

**Practical message.** Perturbation modeling is a practical reason to discuss
out-of-sample maps, conditional Monge maps, and neural parameterizations of
couplings.  The application should be kept close to the mathematical distinction
between a coupling, a Monge map, and a learned extrapolator.

**Representative references.**

- Bunne, Krause, Cuturi, [Supervised Training of Conditional Monge Maps](https://arxiv.org/abs/2206.14262), 2022.
- Bunne et al., *Learning single-cell perturbation responses using neural optimal transport*, Nature Methods, 2023.  Not cited in the current book example until exact bibliography metadata is checked.
- Lübeck, Bunne, Gut, Sarabia del Castillo, Pelkmans, Alvarez-Melis, [Neural Unbalanced Optimal Transport via Cycle-Consistent Semi-Couplings](https://arxiv.org/abs/2209.15621), 2022.
- Chen, Hu, Chen, Huang, [Fast and scalable Wasserstein-1 neural optimal transport solver for single-cell perturbation prediction](https://arxiv.org/abs/2411.00614), 2024.

**Book location.** Chapter `Generative Models via Transportation`, in `One-Step
Generative Models`; also relevant to `Conditional Wasserstein Training of
Infinite ResNets` as a conditional-map example.

## Gene-Level OT Between Single Cells and Learned Ground Metrics

**Proposed example title.** `Application to gene-expression distances`.

**Mathematical hook.** Instead of representing a whole experiment as a measure
over cells, one can represent a single cell as a measure over genes,
\[
        \alpha_{\mathrm{cell}}=\sum_{g} e_g\delta_{\varphi(g)},
\]
where \(e_g\) is the normalized expression of gene \(g\) and \(\varphi(g)\) is a
feature or learned embedding of the gene.  OT then compares two cells by moving
expression mass between genes according to a gene-ground cost.

**Practical message.** This viewpoint makes the ground metric biologically
central.  It is a natural place to discuss when the cost is prescribed from gene
annotations, learned from data, or jointly inferred with sample distances.

**Representative references.**

- Bellazzi, Codegoni, Gualandi, Nicora, Vercesi, [The Gene Mover's Distance: Single-cell similarity via Optimal Transport](https://arxiv.org/abs/2102.01218), 2021.
- Huizing, Cantini, Peyré, [Unsupervised Ground Metric Learning using Wasserstein Singular Vectors](https://arxiv.org/abs/2102.06278), 2021.

**Book location.** Chapter `Kantorovich Relaxation`, in `Metric Properties:
Wasserstein Distances`, after the basic metric discussion; a second pointer fits
in Chapter `Generalized OT Problems`, in `Metric learning and inverse OT`.

## Unbalanced Single-Cell Dynamics

**Proposed example title.** `Application to proliferating and dying cell populations`.

**Mathematical hook.** Balanced OT enforces \(\pi_1=\alpha\) and \(\pi_2=\beta\),
which is too rigid when cell populations divide, die, or are sampled with unequal
composition.  Unbalanced OT replaces exact conservation by marginal penalties,
for instance
\[
        \min_{\pi\geq 0}\ \int c\,d\pi
        + \tau_1 D(\pi_1\mid \alpha)+\tau_2 D(\pi_2\mid \beta),
\]
or by dynamic formulations with a source term in the continuity equation.

**Practical message.** This application gives a biological interpretation of
semi-couplings, mass creation/destruction, and WFR-type dynamics: the marginal
mismatch is not a numerical nuisance but part of the phenomenon.

**Representative references.**

- Lübeck, Bunne, Gut, Sarabia del Castillo, Pelkmans, Alvarez-Melis, [Neural Unbalanced Optimal Transport via Cycle-Consistent Semi-Couplings](https://arxiv.org/abs/2209.15621), 2022.
- Klein, Uscidda, Theis, Cuturi, [GENOT](https://arxiv.org/abs/2310.09254), 2023.

**Book location.** Chapter `Generalized Wasserstein Distances`, in `Unbalanced
OT`, with a later pointer to `Dynamic Unbalanced OT and WFR Flows`.

## Multi-Omics, Spatial Biology, and Heterogeneous Data Integration

**Proposed example title.** `Application to multi-omics alignment`.

**Mathematical hook.** Multi-omics data often give two point clouds in different
feature spaces, for instance RNA and ATAC measurements on unmatched cells.  When
features are not directly comparable, GW or fused GW aligns relational geometry:
\[
        \min_{\pi\in\Gamma(a,b)}
        \sum_{i,i',j,j'} |d_X(x_i,x_{i'})-d_Y(y_j,y_{j'})|^2
        \pi_{ij}\pi_{i'j'}
        + \lambda\sum_{i,j} c_{\mathrm{feat}}(x_i,y_j)\pi_{ij}.
\]

**Practical message.** This is a strong motivation for Gromov-type distances:
the object to preserve is not an ambient coordinate system but neighborhood
structure, cell-type relations, and cross-modality consistency.

**Representative references.**

- Demetci et al., *SCOT: Single-Cell Multi-Omics Alignment with Optimal Transport*, 2022.  Not cited in the current book example until exact venue and metadata are checked.
- Singh et al., *Unsupervised Manifold Alignment for Single-Cell Multi-Omics Data*, 2020.
- Tran, Janati, Courty, Flamary, Redko, Demetci, Singh, [Unbalanced CO-Optimal Transport](https://arxiv.org/abs/2205.14923), 2022.
- Ryu, Bunne, Pinello, Regev, Lopez, [Cross-modality Matching and Prediction of Perturbation Responses with Labeled Gromov-Wasserstein Optimal Transport](https://arxiv.org/abs/2405.00838), 2024.
- Stanojevic, Li, Garmire, [Computational Methods for Single-Cell Multi-Omics Integration and Alignment](https://arxiv.org/abs/2201.06725), 2022, for broader context.

**Book location.** Chapter `Beyond Comparing Measures`, in `Gromov--Wasserstein`
and fused GW; add a short pointer in `Weak Optimal Transport` if barycentric
projections are used for modality translation.

## Fairness, Debiasing, and Distribution Repair

**Proposed example title.** `Application to fair score repair`.

**Mathematical hook.** Let \(S\) be a protected group and \(Y=f(X)\) a score.  A
basic demographic-parity constraint asks that the conditional score laws
\(\alpha_s=\mathcal L(Y\mid S=s)\) be independent of \(s\).  OT post-processing
chooses a common fair law, often the Wasserstein barycenter
\[
        \bar\alpha \in \arg\min_\nu \sum_s p_s W_2^2(\alpha_s,\nu),
\]
and maps each group by the monotone or Brenier map \(T_s{}_{\#}\alpha_s=\bar\alpha\).
The repaired score is \(\tilde Y=T_S(Y)\).

**Practical message.** This application is useful because it ties fairness to
barycenters and distribution repair.  The OT map gives an interpretable minimal
change of scores, while the barycenter expresses the target compromise across
groups.

**Representative references.**

- del Barrio, Gamboa, Gordaliza, Loubes, [Obtaining Fairness Using Optimal Transport Theory](https://arxiv.org/abs/1806.03195), 2018.
- Chzhen, Denis, Hebiri, Oneto, Pontil, [Fair Regression with Wasserstein Barycenters](https://arxiv.org/abs/2006.07286), 2020.
- Buyl, De Bie, [Optimal Transport of Classifiers to Fairness](https://arxiv.org/abs/2202.03814), 2022.
- Hu, Ratz, Charpentier, [Fairness in Multi-Task Learning via Wasserstein Barycenters](https://arxiv.org/abs/2306.10155), 2023.

**Book location.** Chapter `Barycenters`, after the general Wasserstein
barycenter definition; optionally add a pointer in `Metric Properties: Wasserstein
Distances`.

## Computer Vision, Graphics, and Image Processing

**Proposed example title.** `Application to visual distributions`.

**Mathematical hook.** Images, color histograms, texture descriptors, and shape
samples can all be treated as measures.  OT compares them by moving mass through
the geometry of color, image position, or surface distance; sliced OT and
convolutional OT give scalable approximations.

**Practical message.** This is the historical bridge between computational OT and
large-scale visual applications: EMD for retrieval, barycenters for texture
mixing, sliced/Radon barycenters for images, and geometric OT for shapes and
surfaces.

**Representative references.**

- Rubner, Tomasi, Guibas, *The Earth Mover's Distance as a Metric for Image Retrieval*, IJCV, 2000.
- Ferradans, Papadakis, Peyré, Aujol, [Regularized Discrete Optimal Transport](https://arxiv.org/abs/1307.5551), 2013.
- Rabin, Peyré, Delon, Bernot, *Wasserstein Barycenter and Its Application to Texture Mixing*, 2012.
- Bonneel, Rabin, Peyré, Pfister, *Sliced and Radon Wasserstein Barycenters of Measures*, 2015.
- Solomon et al., *Convolutional Wasserstein Distances: Efficient Optimal Transportation on Geometric Domains*, 2015.
- Bonneel, Peyré, Cuturi, *A Survey of Optimal Transport for Computer Graphics and Computer Vision*, 2016.

**Book location.** Chapter `Kantorovich Relaxation`, after `Relaxation for
Arbitrary Measures`; image barycenter examples also belong in `OT Barycenters`
and `Sliced Wasserstein Distances`.

## Graphs, Molecules, Point Clouds, and Structured Data

**Proposed example title.** `Application to structured objects`.

**Mathematical hook.** When samples live in different spaces, a ground cost
\(c(x,y)\) is not always available.  GW compares metric-measure structures by
matching pairwise distances, and fused GW adds feature costs when node labels or
attributes are available.

**Practical message.** GW is the right application block for graph
classification, molecule comparison, mesh correspondence, point-cloud matching,
and cross-domain alignment without a common coordinate system.

**Representative references.**

- Peyré, Cuturi, Solomon, [Gromov-Wasserstein Averaging of Kernel and Distance Matrices](https://arxiv.org/abs/1606.08407), 2016.
- Vayer, Chapel, Flamary, Tavenard, Courty, [Optimal Transport for Structured Data with Application on Graphs](https://arxiv.org/abs/1805.09114), 2018.
- Vayer, Chapel, Flamary, Tavenard, Courty, [Fused Gromov-Wasserstein Distance for Structured Objects](https://arxiv.org/abs/1811.02834), 2018.
- Xu, Luo, Zha, Carin, [Gromov-Wasserstein Learning for Graph Matching and Node Embedding](https://arxiv.org/abs/1901.06003), 2019.
- Xu, Luo, Carin, [Scalable Gromov-Wasserstein Learning for Graph Partitioning and Matching](https://arxiv.org/abs/1905.07645), 2019.
- Vayer et al., [Sliced Gromov-Wasserstein](https://arxiv.org/abs/1905.10124), 2019.

**Book location.** Chapter `Beyond Comparing Measures`, in `Gromov--Wasserstein`
and fused GW.

## Natural Language Processing and Embedding Alignment

**Proposed example title.** `Application to word embeddings and documents`.

**Mathematical hook.** A document can be represented as a weighted measure over
word embeddings,
\[
        \alpha_{\mathrm{doc}}=\sum_{w\in \mathrm{doc}} a_w\delta_{e_w}.
\]
Word Mover's Distance is the Wasserstein distance between such measures.  For
cross-lingual alignment, GW can compare two embedding spaces through their
intrinsic relational geometry when no shared coordinates are available.

**Practical message.** This application is a compact way to show how OT uses the
geometry of a learned representation, rather than treating a bag of words as an
unordered vector.

**Representative references.**

- Kusner, Sun, Kolkin, Weinberger, [From Word Embeddings to Document Distances](https://proceedings.mlr.press/v37/kusnerb15.html), 2015.
- Alvarez-Melis, Jaakkola, [Gromov-Wasserstein Alignment of Word Embedding Spaces](https://arxiv.org/abs/1809.00013), 2018.
- Wu et al., [Word Mover's Embedding](https://arxiv.org/abs/1811.01713), 2018.
- Frogner, Mirzazadeh, Solomon, [Learning Embeddings into Entropic Wasserstein Spaces](https://arxiv.org/abs/1905.03329), 2019.

**Book location.** Chapter `Kantorovich Relaxation`, in `Metric Properties:
Wasserstein Distances`; the embedding-alignment part can also point to
`Gromov--Wasserstein`.

## Supervised Learning with Wasserstein Losses

**Proposed example title.** `Application to structured prediction losses`.

**Mathematical hook.** If the label \(y\) is a histogram, segmentation map,
spatial heatmap, or probability vector, the prediction \(h_\theta(x)\) can be
trained with
\[
        \min_\theta \frac1n\sum_{i=1}^n W_c(h_\theta(x_i),y_i),
\]
where the cost \(c\) encodes semantic or spatial similarity between output bins.

**Practical message.** Wasserstein losses penalize a geographically or
semantically nearby error less than a distant one.  This is the supervised-learning
counterpart of the book's differentiable OT-loss discussion.

**Representative references.**

- Frogner, Zhang, Mobahi, Araya-Polo, Poggio, [Learning with a Wasserstein Loss](https://arxiv.org/abs/1506.05439), 2015.
- Toyokuni, Yokoi, Kashima, Yamada, [Computationally Efficient Wasserstein Loss for Structured Labels](https://arxiv.org/abs/2103.00899), 2021.

**Book location.** Chapter `Wasserstein Estimation`, in `Wasserstein Loss`, and
Chapter `Generalized OT Problems`, in `Differentiating OT losses`.

## Model Evaluation, Dataset Drift, and Two-Sample Testing

**Proposed example title.** `Application to two-sample testing and generative-model evaluation`.

**Mathematical hook.** Given samples \(X_1,\ldots,X_n\sim\alpha\) and
\(Y_1,\ldots,Y_m\sim\beta\), a two-sample test uses a statistic such as
\(D(\hat\alpha_n,\hat\beta_m)\) to test \(H_0:\alpha=\beta\).  OT distances are
geometric choices of \(D\), while MMD and energy distances give kernel or
negative-type alternatives.  FID is the Gaussian \(W_2\) distance between fitted
feature-space Gaussians.

**Practical message.** This application should separate two issues that are often
confused: statistical calibration of a test under \(H_0\), and practical
interpretability of a dataset or generator discrepancy.  It also connects the
Bures/Gaussian formula to a very common machine-learning metric.

**Representative references.**

- Ramdas, García Trillos, Cuturi, [On Wasserstein Two Sample Testing and Related Families of Nonparametric Tests](https://arxiv.org/abs/1509.02237), 2015.
- Gretton et al., *A Kernel Two-Sample Test*, JMLR, 2012.
- Heusel, Ramsauer, Unterthiner, Nessler, Hochreiter, [GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium](https://arxiv.org/abs/1706.08500), 2017, for FID.
- Bińkowski, Sutherland, Arbel, Gretton, [Demystifying MMD GANs](https://arxiv.org/abs/1801.01401), 2018, for KID/MMD-style evaluation.

**Book location.** Chapter `Statistical Optimal Transport`, after `Law of Large
Numbers and Central Limit Theorem` or in `Bias and Variance of OT`.


## Imitation Learning and Reinforcement Learning

**Proposed example title.** `Application to imitation learning`.

**Mathematical hook.** Imitation learning can compare the expert occupancy
measure \(\rho_E\) and the learner occupancy measure \(\rho_\theta\) on
state-action space.  OT yields either a primal matching loss
\(W(\rho_\theta,\rho_E)\) or a dual adversarial reward given by a Kantorovich
potential.

**Practical message.** OT gives a distribution-matching view of imitation
learning that is close to GANs but geometrically aware.  This is a good applied
example for dual potentials as learned rewards and for regularized OT in large
state-action spaces.

**Representative references.**

- Xiao, Herman, Wagner, Ziesche, Etesami, Linh, [Wasserstein Adversarial Imitation Learning](https://arxiv.org/abs/1906.08113), 2019.
- Dadashi, Hussenot, Geist, Pietquin, [Primal Wasserstein Imitation Learning](https://arxiv.org/abs/2006.04678), 2020.

**Book location.** Chapter `Divergences and Dual Norms`, after `GANs via Duality`,
or Chapter `Generative Models via Transportation` as another distribution-matching
learning problem.

## Bibliography and Verification Notes

References already visible in `OT4ML/all.bib` during this pass include several
core entries: Courty/Flamary domain adaptation, Schiebinger Waddington-OT,
Ramdas--García Trillos--Cuturi two-sample testing, Frogner et al. Wasserstein
losses, Rubner--Tomasi--Guibas EMD, Kusner et al. Word Mover's Distance, Vayer
et al. structured data/GW, and Bonneel--Peyré--Cuturi's graphics and vision
survey.

Items deliberately left out of the current book examples until exact metadata or
scope is clarified:

- Bunne et al., *Learning single-cell perturbation responses using neural optimal transport*, Nature Methods, 2023: left uncited until the exact author list and DOI are checked.
- Demetci et al., *SCOT: Single-Cell Multi-Omics Alignment with Optimal Transport*, 2022: left uncited until the exact title, venue and DOI are checked.
- Any intended `STORIES` reference involving Huizing/Cantini/Peyré: I did not verify an exact paper with that name in this pass.  The verified related reference is Huizing--Cantini--Peyré, *Unsupervised Ground Metric Learning using Wasserstein Singular Vectors*, 2021.
