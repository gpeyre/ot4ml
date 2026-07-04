# Applications of Optimal Transport to Machine Learning and AI

This note is a curated roadmap of places where optimal transport (OT) is used in
machine learning, AI, and neighboring data-driven sciences. Each entry records
the application, the practical role of OT, representative papers, and the most
natural place to mention the topic in the OT4ML book.

The selection mixes practice and theory on purpose. Some items are mature
algorithmic tools, such as domain adaptation, WGANs, Sinkhorn losses, graph
matching, or single-cell trajectory inference. Others are mathematical lenses,
such as mean-field training dynamics or kernelized particle flows, that clarify
why modern ML methods behave as they do.

## Quick Insertion Map

| Application area | Best book location | Insertion angle |
|---|---|---|
| Transfer learning and domain adaptation | Chapter 3; Chapter 11 | Couplings as soft correspondences between source and target samples; learned costs for representation alignment. |
| Single-cell genomics and perturbation response | Chapter 7; Chapter 10; Chapter 13; Chapter 15 | Time-marginal couplings, growth/death, unpaired perturbation maps, and neural transport. |
| Generative models | Chapter 6; Chapter 7; Chapter 15 | WGAN/Sinkhorn losses, flow matching, rectified flows, diffusion bridges, and one-step maps. |
| Distributional robustness and adversarial training | Chapter 3 | Wasserstein balls as geometric ambiguity sets around empirical data. |
| Fairness and debiasing | Chapter 11; Chapter 10 | Barycenters and distribution repair across protected groups. |
| Computer vision, graphics, and image processing | Chapter 2; Chapter 5; Chapter 10; Chapter 11 | Color transfer, texture mixing, shape interpolation, and image barycenters. |
| Graphs, molecules, and structured data | Chapter 12 | GW/FGW as distances for objects without a common coordinate system. |
| NLP and embeddings | Chapter 3; Chapter 12 | Word Mover's Distance and GW alignment of embedding spaces. |
| Differentiable ranking, sorting, and attention | Chapter 1; Chapter 7; Chapter 15 | Sinkhorn relaxations of permutations and doubly stochastic attention. |
| Barycenters, clustering, and prototypes | Chapter 11 | Wasserstein means as interpretable prototypes for distributions. |
| Supervised learning losses | Chapter 6; Chapter 7; Chapter 9 | Differentiable losses for histogram- or measure-valued outputs. |
| Bayesian inference and particle methods | Chapter 13; Chapter 15 | Kernelized BB geometry and SVGD as deterministic particle transport. |
| Training dynamics of neural networks | Chapter 14 | Mean-field descriptions of overparameterized networks. |
| Model evaluation and dataset drift | Chapter 2; Chapter 9; Chapter 15 | FID, two-sample testing, and distribution-shift monitoring. |
| Reinforcement learning and imitation learning | Chapter 13; Chapter 15 | Occupancy-measure matching and stochastic-control viewpoints. |
| Scientific ML and computational physics | Chapter 11; Chapter 13; Chapter 14 | Multimarginal Coulomb problems, particle systems, and PDE-constrained learning. |
| Large-scale Sinkhorn and sketching | Chapter 9; Chapter 11; Chapter 15 | Low-rank couplings, positive features, and attention-like kernel approximations. |

## 1. Transfer Learning and Domain Adaptation

**Application.** Transfer learning asks how to reuse labeled source data when
predictions are needed in a target domain with a shifted distribution. OT gives
an explicit coupling between source and target samples; this coupling can move
labels, compare feature clouds, or align joint feature-label distributions.

**Practical role.** In practice, OT is used to align source and target feature
clouds, regularize the coupling with class information, and learn a representation
where source and target distributions are close. This is one of the cleanest
practical uses of discrete and entropic OT.

**Key papers.**

- Courty, Flamary, Tuia, Rakotomamonjy, [Optimal Transport for Domain Adaptation](https://arxiv.org/abs/1507.00504), 2015.
- Courty, Flamary, Habrard, Rakotomamonjy, [Joint Distribution Optimal Transportation for Domain Adaptation](https://arxiv.org/abs/1705.08848), 2017.
- Damodaran, Kellenberger, Flamary, Tuia, Courty, [DeepJDOT: Deep Joint Distribution Optimal Transport for Unsupervised Domain Adaptation](https://arxiv.org/abs/1803.10081), 2018.
- Shen, Qu, Zhang, Yu, [Wasserstein Distance Guided Representation Learning for Domain Adaptation](https://arxiv.org/abs/1707.01217), 2017.

**Best book location.** Add a practice paragraph in Chapter 3 after the discrete
Kantorovich relaxation: the domain-adaptation coupling is exactly a transport
matrix between source and target samples. Add a second pointer in Chapter 11,
near metric learning and inverse OT, because modern methods often learn the
feature map or ground cost jointly with the plan.

## 2. Single-Cell Genomics, Fate Inference, and Perturbation Response

**Application.** Single-cell RNA sequencing observes populations rather than
individual trajectories: cells measured at one time or condition are not the same
cells measured later. OT supplies couplings, trajectories, and response maps
between unpaired cellular populations.

**Practical role.** OT is used for developmental trajectory reconstruction,
cell-fate prediction, perturbation-response modeling, multi-omics alignment, and
out-of-sample neural transport maps. Unbalanced and entropic variants are often
essential because cell populations grow, die, branch, and are sampled unevenly.

**Key papers.**

- Schiebinger et al., *Optimal-Transport Analysis of Single-Cell Gene Expression Identifies Developmental Trajectories in Reprogramming*, Cell, 2019.
- Lavenant, Zhang, Kim, Schiebinger, [Towards a Mathematical Theory of Trajectory Inference](https://arxiv.org/abs/2102.09204), 2021.
- Forrow, Huetter, Nitzan, Rigollet, Schiebinger, Weed, [Statistical Optimal Transport via Factored Couplings](https://arxiv.org/abs/1806.07348), 2018.
- Bunne et al., *Learning single-cell perturbation responses using neural optimal transport*, Nature Methods, 2023.
- Klein, Uscidda, Theis, Cuturi, [GENOT: Entropic (Gromov) Wasserstein Flow Matching with Applications to Single-Cell Genomics](https://arxiv.org/abs/2310.09254), 2023.
- Bellazzi, Codegoni, Gualandi, Nicora, Vercesi, [The Gene Mover's Distance](https://arxiv.org/abs/2102.01218), 2021.

**Best book location.** Add an extended example in Chapter 7 after the path-space
Schrodinger problem, because Waddington-OT and gWOT are naturally path-space or
time-marginal problems. Add a shorter pointer in Chapter 10, unbalanced OT, for
growth, death, and unequal sampling. Add a forward pointer in Chapter 15, where
neural OT and flow matching give scalable out-of-sample transport maps.

## 3. Generative Adversarial Models and OT Discrepancies

**Application.** Generative modeling learns a map from a simple latent law to a
data law. OT enters either as a training discrepancy, as in WGAN and
Sinkhorn-type models, or as a geometry for evolving generated distributions.

**Practical role.** OT-based losses often give informative gradients when
supports are disjoint, which is important for high-dimensional empirical data.
Entropic, sliced, MMD, and dual variants trade statistical behavior against
computational tractability.

**Key papers.**

- Arjovsky, Chintala, Bottou, [Wasserstein GAN](https://arxiv.org/abs/1701.07875), 2017.
- Gulrajani et al., [Improved Training of Wasserstein GANs](https://arxiv.org/abs/1704.00028), 2017.
- Tolstikhin, Bousquet, Gelly, Schoelkopf, *Wasserstein Auto-Encoders*, 2018.
- Patrini et al., [Sinkhorn AutoEncoders](https://arxiv.org/abs/1810.01118), 2018.
- Kolouri, Pope, Martin, Rohde, [Sliced-Wasserstein Autoencoder](https://arxiv.org/abs/1804.01947), 2018.
- Genevay, Peyre, Cuturi, *Learning Generative Models with Sinkhorn Divergences*, 2018.

**Best book location.** Chapter 6, GANs via duality, is the place for WGAN and
MMD-GAN. Chapter 7 should mention Sinkhorn divergences as practical generative
losses. Chapter 15 should carry the broader synthesis: one-step generators, flow
matching, drifting fields, and particle flows.

## 4. Flow Matching, Rectified Flows, Diffusion Models, and Stochastic Interpolants

**Application.** Modern generative AI often learns a velocity or score field
that transports noise to data. OT supplies couplings, interpolants, and dynamic
formulations that clarify when learned flows approximate displacement
interpolation and when they are only transport-inspired.

**Practical role.** OT couplings can reduce variance in flow-matching targets,
produce straighter trajectories, and connect deterministic flow models with
Schrodinger bridges and diffusion models.

**Key papers.**

- Lipman et al., [Flow Matching for Generative Modeling](https://arxiv.org/abs/2210.02747), 2022.
- Liu, Gong, Liu, [Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow](https://arxiv.org/abs/2209.03003), 2022.
- Albergo, Boffi, Vanden-Eijnden, [Stochastic Interpolants](https://arxiv.org/abs/2303.08797), 2023.
- Tong et al., [Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport](https://arxiv.org/abs/2302.00482), 2023.
- Song et al., [Score-Based Generative Modeling through Stochastic Differential Equations](https://arxiv.org/abs/2011.13456), 2020.
- Hertrich, Chambolle, Delon, [On the Optimality of Flow Matching](https://arxiv.org/abs/2505.19712), 2025.

**Best book location.** This is already central in Chapter 15. Add an
application-oriented preamble to the flow-matching section explaining that
learned velocity fields are now the main practical interface between OT-like
geometry and large-scale generative AI.

## 5. Distributional Robustness and Adversarial Training

**Application.** Wasserstein distributionally robust optimization (DRO) replaces
empirical risk minimization by a worst-case risk over a Wasserstein ball around
the empirical distribution. This models adversarial perturbations, covariate
shift, and uncertainty in the data-generating distribution.

**Practical role.** In machine learning, DRO gives regularized learning problems,
robust classifiers, adversarial training objectives, and interpretable ambiguity
sets around samples.

**Key papers.**

- Esfahani, Kuhn, [Data-driven Distributionally Robust Optimization Using the Wasserstein Metric](https://arxiv.org/abs/1505.05116), 2015.
- Gao, Kleywegt, [Distributionally Robust Stochastic Optimization with Wasserstein Distance](https://arxiv.org/abs/1604.02199), 2016.
- Sinha, Namkoong, Duchi, *Certifying Some Distributional Robustness with Principled Adversarial Training*, 2018.
- Kuhn, Mohajerin Esfahani, Nguyen, Shafieezadeh-Abadeh, [Wasserstein Distributionally Robust Optimization: Theory and Applications in Machine Learning](https://arxiv.org/abs/1908.08729), 2019.
- Ho-Nguyen, Wright, [Adversarial Classification via Distributional Robustness with Wasserstein Ambiguity](https://arxiv.org/abs/2005.13815), 2020.

**Best book location.** Chapter 3 already contains distributional robustness and
W_infty. Add the ML discussion immediately after the geometric ambiguity-set
paragraph, with examples from robust classification and adversarial training.

## 6. Fairness, Debiasing, and Distribution Repair

**Application.** Fairness constraints often ask that prediction distributions be
aligned across protected groups. OT gives a way to repair distributions, compare
group-conditional predictors, and construct barycentric target distributions.

**Practical role.** Practical fairness algorithms use OT maps as pre-processing
or post-processing transformations, and Wasserstein barycenters as fair target
laws for group-wise predictions.

**Key papers.**

- del Barrio, Gamboa, Gordaliza, Loubes, [Obtaining Fairness Using Optimal Transport Theory](https://arxiv.org/abs/1806.03195), 2018.
- Chzhen, Denis, Hebiri, Oneto, Pontil, [Fair Regression with Wasserstein Barycenters](https://arxiv.org/abs/2006.07286), 2020.
- Buyl, De Bie, [Optimal Transport of Classifiers to Fairness](https://arxiv.org/abs/2202.03814), 2022.
- Hu, Ratz, Charpentier, [Fairness in Multi-Task Learning via Wasserstein Barycenters](https://arxiv.org/abs/2306.10155), 2023.

**Best book location.** Chapter 11, OT barycenters, is the best fit: fair
regression is a clean applied interpretation of Wasserstein means. Add a short
pointer in Chapter 10, because debiasing often becomes a generalized or
unbalanced transport problem when groups have unequal mass or support.

## 7. Computer Vision, Graphics, and Image Processing

**Application.** OT compares, interpolates, and edits images, colors, textures,
shapes, and probability maps. This is one of the historical application areas
where computational OT became visible outside pure mathematics.

**Practical role.** Applications include color transfer, histogram equalization,
image retrieval, texture mixing, shape interpolation, surface processing, and
geometric image registration.

**Key papers.**

- Rubner, Tomasi, Guibas, *The Earth Mover's Distance as a Metric for Image Retrieval*, IJCV, 2000.
- Ferradans, Papadakis, Peyre, Aujol, [Regularized Discrete Optimal Transport](https://arxiv.org/abs/1307.5551), 2013.
- Rabin, Peyre, Delon, Bernot, *Wasserstein Barycenter and Its Application to Texture Mixing*, 2012.
- Bonneel, Rabin, Peyre, Pfister, *Sliced and Radon Wasserstein Barycenters of Measures*, 2015.
- Solomon et al., *Convolutional Wasserstein Distances: Efficient Optimal Transportation on Geometric Domains*, 2015.
- Bonneel, Peyre, Cuturi, *A Survey of Optimal Transport for Computer Graphics and Computer Vision*, 2016.

**Best book location.** Mention color transfer and histogram equalization in
Chapter 2 or Chapter 5. Mention texture mixing and shape interpolation in
Chapter 11, barycenters. Mention convolutional and sliced approximations in
Chapter 7, Sinkhorn, and Chapter 10, sliced Wasserstein.

## 8. Graphs, Molecules, Point Clouds, and Structured Data

**Application.** Graphs and structured objects are not naturally compared in a
fixed ground space. Gromov-Wasserstein (GW) compares relational structure, while
fused GW combines this intrinsic geometry with node or point features.

**Practical role.** These distances are used for graph classification, molecule
comparison, shape matching, mesh correspondence, and cross-domain alignment when
the feature spaces do not match.

**Key papers.**

- Peyre, Cuturi, Solomon, *Gromov-Wasserstein Averaging of Kernel and Distance Matrices*, 2016.
- Vayer, Chapel, Flamary, Tavenard, Courty, [Optimal Transport for Structured Data with Application on Graphs](https://arxiv.org/abs/1805.09114), 2018.
- Vayer, Chapel, Flamary, Tavenard, Courty, [Fused Gromov-Wasserstein Distance for Structured Objects](https://arxiv.org/abs/1811.02834), 2018.
- Xu et al., *Scalable Gromov-Wasserstein Learning for Graph Partitioning and Matching*, 2019.
- Titouan Vayer et al., [Sliced Gromov-Wasserstein](https://arxiv.org/abs/1905.10124), 2019.

**Best book location.** Chapter 12, Gromov-Wasserstein and fused GW. Put the
application paragraph after the definition of FGW: it explains why ML practice
often needs to combine node features with pairwise distances.

## 9. Natural Language Processing and Embedding Alignment

**Application.** Documents can be represented as weighted bags of word
embeddings, and languages as metric spaces of embeddings. OT then gives semantic
document distances and unsupervised cross-lingual alignment.

**Practical role.** Word Mover's Distance is an interpretable document metric.
GW aligns embedding spaces without requiring the two vocabularies to live in the
same coordinate system.

**Key papers.**

- Kusner, Sun, Kolkin, Weinberger, [From Word Embeddings to Document Distances](https://proceedings.mlr.press/v37/kusnerb15.html), 2015.
- Alvarez-Melis, Jaakkola, [Gromov-Wasserstein Alignment of Word Embedding Spaces](https://arxiv.org/abs/1809.00013), 2018.
- Wu et al., [Word Mover's Embedding](https://arxiv.org/abs/1811.01713), 2018.
- Frogner, Mirzazadeh, Solomon, [Learning Embeddings into Entropic Wasserstein Spaces](https://arxiv.org/abs/1905.03329), 2019.

**Best book location.** Word Mover's Distance fits Chapter 3, discrete OT, as a
practical example of transporting word weights over an embedding ground metric.
Cross-lingual GW fits Chapter 12, after metric-measure spaces are introduced.

## 10. Differentiable Sorting, Matching, Ranking, and Attention

**Application.** Many ML pipelines need differentiable approximations of
permutations, matchings, rankings, top-k operations, and attention
normalizations. Entropic OT and Sinkhorn scaling turn these discrete objects into
smooth layers.

**Practical role.** These relaxations allow gradients to pass through sorting,
ranking, assignment, and permutation layers. Sinkhorn normalization also appears
in attention mechanisms where doubly stochastic matrices impose conservation or
competition between tokens.

**Key papers.**

- Mena, Belanger, Linderman, Snoek, [Learning Latent Permutations with Gumbel-Sinkhorn Networks](https://arxiv.org/abs/1802.08665), 2018.
- Cuturi, Teboul, Vert, [Differentiable Ranks and Sorting Using Optimal Transport](https://arxiv.org/abs/1905.11885), 2019.
- Blondel, Teboul, Berthet, Djolonga, [Fast Differentiable Sorting and Ranking](https://arxiv.org/abs/2002.08871), 2020.
- Sander, Ablin, Blondel, Peyre, [Sinkformers: Transformers with Doubly Stochastic Attention](https://arxiv.org/abs/2110.11773), 2021.

**Best book location.** Add differentiable sorting and Gumbel-Sinkhorn in
Chapter 1, after matching algorithms, with a forward pointer to Chapter 7 after
Sinkhorn's algorithm. Sinkformers belong in Chapter 15, transformers and
evolution in depth.

## 11. Barycenters, Clustering, Prototypes, and Dictionary Learning

**Application.** Wasserstein barycenters average probability distributions while
respecting the geometry of their support. They are used for clustering
distributions, averaging histograms or shapes, defining prototypes, and building
dictionary-learning models.

**Practical role.** In practice, barycenters provide interpretable class
representatives, Wasserstein k-means centers, texture/shape averages, and
low-dimensional mixture models over measures.

**Key papers.**

- Agueh, Carlier, *Barycenters in the Wasserstein Space*, 2011.
- Cuturi, Doucet, *Fast Computation of Wasserstein Barycenters*, 2014.
- Benamou, Carlier, Cuturi, Nenna, Peyre, *Iterative Bregman Projections for Regularized Transportation Problems*, 2015.
- Schmitz et al., [Wasserstein Dictionary Learning](https://arxiv.org/abs/1708.01955), 2017.
- Bonneel, Rabin, Peyre, Pfister, *Sliced and Radon Wasserstein Barycenters of Measures*, 2015.

**Best book location.** Chapter 11, OT barycenters. Add a practice paragraph
right after the general barycenter definition, before algorithmic details, to
explain barycenters as prototypes, cluster centers, and distributional averages.

## 12. Supervised Learning with Wasserstein Losses

**Application.** In structured prediction, labels may be histograms,
segmentation maps, probability vectors, or spatial distributions. OT losses use
the geometry of the output space instead of treating output bins as unrelated.

**Practical role.** Wasserstein losses improve learning when errors have a
meaningful geometry, such as nearby labels, semantic classes, spatial heatmaps,
or multi-label predictions.

**Key papers.**

- Frogner, Zhang, Mobahi, Araya-Polo, Poggio, [Learning with a Wasserstein Loss](https://arxiv.org/abs/1506.05439), 2015.
- Cuturi, [Sinkhorn Distances: Lightspeed Computation of Optimal Transport](https://arxiv.org/abs/1306.0895), 2013.
- Genevay et al., *Sample Complexity of Sinkhorn Divergences*, 2019.
- Feydy et al., *Interpolating between Optimal Transport and MMD using Sinkhorn Divergences*, 2019.

**Best book location.** Chapter 7, Sinkhorn divergences, for differentiable
losses. Chapter 9, statistical OT, for the statistical cost of empirical OT
losses. A supervised-learning example could also be added in Chapter 6, after
dual norms and IPMs.

## 13. Model Evaluation, Dataset Drift, and Two-Sample Testing

**Application.** OT distances compare generated samples to real samples,
training distributions to deployment distributions, and one empirical dataset to
another. The Gaussian closed form also underlies the Frechet Inception Distance.

**Practical role.** OT-based metrics are used for monitoring data drift,
evaluating generative models, comparing embeddings, and two-sample testing.
In practice, one often uses sliced, entropic, MMD, or Gaussian approximations.

**Key papers.**

- Heusel et al., *GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium*, 2017. This introduced the Frechet Inception Distance in generative-model practice.
- Ramdas, Garcia, Cuturi, *On Wasserstein Two-Sample Testing and Related Families of Nonparametric Tests*, 2015.
- Binkowski et al., *Demystifying MMD GANs*, 2018.
- Feydy et al., *Interpolating between Optimal Transport and MMD using Sinkhorn Divergences*, 2019.

**Best book location.** FID belongs in Chapter 2, Gaussian measures and Bures
metric, with a pointer to Chapter 15. Two-sample testing and drift monitoring fit
Chapter 9, statistical OT, because finite-sample behavior is the central issue in
practice.

## 14. Bayesian Inference and Particle Sampling

**Application.** Deterministic particle methods use transport-like flows to move
particles toward a posterior distribution. The most visible example is Stein
variational gradient descent (SVGD), which can be interpreted as a gradient flow
under a kernelized transport geometry.

**Practical role.** These methods provide particle-based variational inference
without Markov-chain random walks, while retaining repulsion between particles.
They are useful when the target score is available but the normalizing constant
is not.

**Key papers.**

- Liu, Wang, *Stein Variational Gradient Descent: A General Purpose Bayesian Inference Algorithm*, 2016.
- Liu, *Stein Variational Gradient Descent as Gradient Flow*, 2017.
- Duncan, Nuesken, Szpruch, *On the Geometry of Stein Variational Gradient Descent*, 2019.
- Nuesken, Renger, *Stein Variational Gradient Descent: Many-Particle and Long-Time Asymptotics*, 2021.

**Best book location.** Chapter 13, kernelized Benamou-Brenier distances, for the
metric viewpoint. Chapter 15, one-step generative models and SVGD, for the
particle algorithm and its relation to generative flows.

## 15. Neural-Network Training Dynamics and Mean-Field Limits

**Application.** Wide neural networks can be described by probability measures
over parameters. Training then becomes an evolution of this measure, often a
Wasserstein or Wasserstein-like gradient flow.

**Practical role.** This viewpoint explains feature learning, global convergence
in overparameterized regimes, noisy training, mean-field limits of two-layer
networks, normalized dynamics, and some transformer dynamics.

**Key papers.**

- Chizat, Bach, *On the Global Convergence of Gradient Descent for Over-parameterized Models using Optimal Transport*, 2018.
- Mei, Montanari, Nguyen, *A Mean Field View of the Landscape of Two-Layer Neural Networks*, 2018.
- Rotskoff, Vanden-Eijnden, *Parameters as Interacting Particles*, 2018.
- Sirignano, Spiliopoulos, *Mean Field Analysis of Neural Networks*, 2020.
- Sander, Ablin, Blondel, Peyre, [Sinkformers](https://arxiv.org/abs/2110.11773), 2021.

**Best book location.** Chapter 14, training dynamics of neural networks, is the
main place. Add an opening paragraph emphasizing that this is an ML-theory use of
OT: the measure is the model state, not merely an output distribution to compare.

## 16. Reinforcement Learning, Imitation Learning, and Control

**Application.** In imitation learning, one wants a policy whose state-action
occupancy measure matches expert demonstrations. OT compares occupancy measures
and defines imitation losses or robust control objectives.

**Practical role.** Wasserstein imitation learning replaces adversarial
classification between expert and learner trajectories by a geometric discrepancy.
Dynamic OT and Schrodinger bridges also connect to stochastic control.

**Key papers.**

- Xiao et al., *Wasserstein Adversarial Imitation Learning*, 2019.
- Dadashi et al., *Primal Wasserstein Imitation Learning*, 2021.
- Chen, Georgiou, Pavon, *Optimal Transport over a Linear Dynamical System*, 2016.
- Pavon and Wakolbinger, classical work connecting Schrodinger bridges and stochastic control.

**Best book location.** Chapter 13, dynamic OT and path-space formulations,
because occupancy measures and controlled processes are dynamic objects. Add a
short application paragraph after the Schrodinger bridge and stochastic-control
discussion.

## 17. Time Series, Signal Processing, and Spatio-Temporal Alignment

**Application.** Signals and time series often need both amplitude comparison and
temporal alignment. OT gives soft correspondences between events, while dynamic
and unbalanced variants handle missing or unequal mass.

**Practical role.** Applications include audio source separation, temporal
alignment, sensor data comparison, EEG/MEG alignment, and spatio-temporal
registration.

**Key papers.**

- Flamary, Courty, Tuia, Rakotomamonjy, *Optimal Transport for Domain Adaptation*, with signal and vision applications.
- Janati, Cuturi, Gramfort, *Spatio-Temporal Alignments: Optimal Transport through Space and Time*, 2020.
- Courty, Flamary, Habrard, Rakotomamonjy, *Joint Distribution Optimal Transportation for Domain Adaptation*, 2017.
- Chizat et al., *Scaling Algorithms for Unbalanced Optimal Transport Problems*, 2018.

**Best book location.** Chapter 10, unbalanced OT, for missing mass and partial
observations. Chapter 13, dynamic OT, for spatio-temporal couplings and
trajectory alignment.

## 18. Scientific ML, Physics, and Computational Chemistry

**Application.** OT appears in density-functional theory, multimarginal Coulomb
problems, particle methods, fluid mechanics, and simulation-based inference.
These topics are not always labelled "ML", but they increasingly belong to the
scientific machine-learning toolbox.

**Practical role.** OT supplies variational principles, differentiable solvers,
and structured regularizers for learning physical systems, comparing particle
clouds, and imposing conservation laws.

**Key papers.**

- Benamou, Carlier, Cuturi, Nenna, Peyre, *Iterative Bregman Projections for Regularized Transportation Problems*, 2015.
- Cotar, Friesecke, Klueppelberg, *Density Functional Theory and Optimal Transportation with Coulomb Cost*, 2013.
- Buttazzo, De Pascale, Gori-Giorgi, *Optimal-Transport Formulation of Electronic Density-Functional Theory*, 2012.
- Nenna, *Numerical Methods for Multi-Marginal Optimal Transportation*, thesis and related works.

**Best book location.** Chapter 11, multimarginal OT, for Coulomb and density
functional theory. Chapter 13, dynamic OT, for fluid mechanics and conservation
laws. Chapter 14, gradient flows, for particle systems and PDE-based learning.

## 19. Low-Rank, Sketching, and Large-Scale Sinkhorn in ML Systems

**Application.** Large ML systems cannot form dense n by n transport matrices
inside every training step. Low-rank couplings, factored couplings, kernel
sketches, Nystrom approximations, and positive random features make OT losses
feasible at larger scale.

**Practical role.** These methods are used when Sinkhorn appears inside a
learning loop, especially for differentiable losses, attention-like kernels, and
large minibatches.

**Key papers.**

- Forrow, Huetter, Nitzan, Rigollet, Schiebinger, Weed, [Statistical Optimal Transport via Factored Couplings](https://arxiv.org/abs/1806.07348), 2018.
- Scetbon, Cuturi, Peyre, *Low-Rank Sinkhorn Factorization*, 2021.
- Scetbon, Cuturi, *Linear-Time Sinkhorn Divergences using Positive Features*, 2020.
- Choromanski et al., *Rethinking Attention with Performers*, 2021.

**Best book location.** Chapter 9, sketching Sinkhorn, for positive features and
linear-time approximations. Chapter 11, low-rank OT, for factored couplings.
Chapter 15, transformers, for the attention analogy.

## 20. Metric Learning, Inverse OT, and Learning the Cost

**Application.** Instead of fixing a cost, one learns the geometry that makes
observed transports, labels, or correspondences likely. This is important for
domain adaptation, representation learning, and inverse problems where the raw
Euclidean metric is not meaningful.

**Practical role.** In practice, the cost can be a Mahalanobis metric, a neural
feature distance, a graph metric, or a bilinear cost learned from observed
couplings.

**Key papers.**

- Cuturi, Avis, *Ground Metric Learning*, 2014.
- Stuart, Wolfram, *Inverse Optimal Transport*, 2020.
- Ma, Sun, Ye, Zha, Zhou, *Learning Cost Functions for Optimal Transport*, 2020.
- Peyre, Poon, Tron, *Curvature of Optimal Transport with Respect to the Cost and Applications to Inverse Optimal Transport*, 2026.
- Courty et al., *Joint Distribution Optimal Transportation*, 2017, as a practical joint cost/model learning example.

**Best book location.** Chapter 11 already has metric learning and inverse OT.
Add a practice paragraph explaining that applications often learn the cost
because the raw feature geometry is rarely the geometry in which transport should
be measured.

## 21. Shape Registration, Procrustes Alignment, and Point-Cloud Learning

**Application.** Point clouds, meshes, and shapes often differ by rigid motions,
sampling density, or deformation. OT gives correspondences, while quotient or
Gromov-Wasserstein variants handle invariances and changing coordinates.

**Practical role.** Applications include point-cloud registration, shape
matching, template alignment, and mesh interpolation. OT variants can improve on
ICP by using soft global correspondences rather than nearest-neighbor matching.

**Key papers.**

- Solomon et al., *Convolutional Wasserstein Distances*, 2015.
- Memoli, *Gromov-Wasserstein Distances and the Metric Approach to Object Matching*, 2011.
- Grave, Joulin, Berthet, *Unsupervised Alignment of Embeddings with Wasserstein Procrustes*, 2019.
- Alvarez-Melis, Jegelka, Jaakkola, *Towards Optimal Transport with Global Invariances*, 2019.
- Vayer et al., *Fused Gromov-Wasserstein Distance for Structured Objects*, 2018.

**Best book location.** Chapter 10, quotient Wasserstein and Wasserstein
Procrustes, for rigid alignment. Chapter 12, GW, for intrinsic shape matching
when coordinates are not comparable.

## 22. Multi-Omics, Spatial Biology, and Heterogeneous Data Integration

**Application.** Biological datasets often measure different modalities on
different cells or spatial locations. OT aligns samples across modalities even
when features are heterogeneous; GW and co-optimal transport additionally align
features or relational structures.

**Practical role.** OT helps integrate scRNA-seq with chromatin accessibility,
spatial transcriptomics, protein markers, and perturbation measurements. This is
practice-heavy and should be presented as a major modern use case, not only as a
mathematical curiosity.

**Key papers.**

- Demetci et al., *SCOT: Single-Cell Multi-Omics Alignment with Optimal Transport*, 2022.
- Singh et al., *Unsupervised Manifold Alignment for Single-Cell Multi-Omics Data*, 2020.
- Tran, Janati, Courty, Flamary, Redko, Demetci, Singh, [Unbalanced CO-Optimal Transport](https://arxiv.org/abs/2205.14923), 2022.
- Klein, Uscidda, Theis, Cuturi, [GENOT](https://arxiv.org/abs/2310.09254), 2023.

**Best book location.** Chapter 12, GW and fused GW, for heterogeneous spaces.
Chapter 10, unbalanced OT, for different cell populations and missing mass.
Chapter 15, flow matching, for neural maps between modalities.

## Recommended Additions to the Book

The following additions would give the highest application payoff with little
new mathematical overhead.

1. Add a "Domain adaptation and transfer learning" paragraph after the discrete
   Kantorovich problem in Chapter 3, and point to learned costs in Chapter 11.
2. Add a "Single-cell genomics" example box in Chapter 7 after the path-space
   Schrodinger formulation, with explicit pointers to unbalanced OT and neural
   transport.
3. Add "Word Mover's Distance" as a discrete OT example in Chapter 3.
4. Add "FID as Gaussian W2/Bures" in Chapter 2, with a pointer to generative
   model evaluation in Chapter 15.
5. Add "Differentiable sorting and Sinkhorn layers" after Sinkhorn's algorithm in
   Chapter 7, with a pointer back to matching algorithms in Chapter 1.
6. Add a "Fairness by barycenters" example box in Chapter 11 after the barycenter
   definition.
7. Add a "Graph and molecule comparison" paragraph after fused GW in Chapter 12.
8. Add a "Large-scale Sinkhorn in ML systems" paragraph in Chapter 9, connecting
   positive-feature sketches to attention approximations.
9. Add a short "OT in Bayesian particle inference" paragraph next to SVGD in
   Chapter 15 and kernelized BB in Chapter 13.
10. Add a "Scientific ML" paragraph near multimarginal OT, emphasizing Coulomb
    costs, density-functional theory, and differentiable solvers.

## Bibliography Triage

These references should be checked against `OT4ML/all.bib` before insertion.

- Rubner, Tomasi, Guibas, *The Earth Mover's Distance as a Metric for Image Retrieval*, IJCV, 2000.
- Heusel et al., *GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium*, 2017.
- Tolstikhin et al., *Wasserstein Auto-Encoders*, 2018.
- Patrini et al., *Sinkhorn AutoEncoders*, 2018.
- Kolouri et al., *Sliced-Wasserstein Autoencoder*, 2018.
- del Barrio et al., *Obtaining Fairness Using Optimal Transport Theory*, 2018.
- Chzhen et al., *Fair Regression with Wasserstein Barycenters*, 2020.
- Kusner et al., *From Word Embeddings to Document Distances*, 2015.
- Mena et al., *Learning Latent Permutations with Gumbel-Sinkhorn Networks*, 2018.
- Cuturi, Teboul, Vert, *Differentiable Ranks and Sorting using Optimal Transport*, 2019.
- Schiebinger et al., *Optimal-Transport Analysis of Single-Cell Gene Expression*, 2019.
- Bunne et al., *Learning single-cell perturbation responses using neural optimal transport*, 2023.
- Demetci et al., *SCOT: Single-Cell Multi-Omics Alignment with Optimal Transport*, 2022.
- Janati, Cuturi, Gramfort, *Spatio-Temporal Alignments: Optimal Transport through Space and Time*, 2020.
- Xiao et al., *Wasserstein Adversarial Imitation Learning*, 2019.
- Dadashi et al., *Primal Wasserstein Imitation Learning*, 2021.
