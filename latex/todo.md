Move the sections
	"5 Dual Problem"
	"6 Semi-discrete and W1"
	7 Divergences and Dual Norms
Before the section on sinkhorn (so that the two section on sinkhorn are contiguous)

---
Polish and integrate the following remark after defining and discussing push-forward:

\begin{rem}[Push-forward vs. pull-back]
The push-forward $\T_\sharp$ of measures should not be confounded with the pull-back of function $\T^\sharp : \Cc(\Y) \rightarrow \Cc(\X)$ which corresponds to the ``warping'' of functions. It is the linear map defined, for $g \in \Cc(\Y)$ by $\T^\sharp g = g \circ \T$. Push-forward and pull-back are actually adjoint one from each others, in the sense that
\eq{
	\foralls (\al,g) \in \Mm(\X) \times \Cc(Y), \quad
	\int_\Y g \d( \T_\sharp\al ) = \int_\X (\T^\sharp g) \d\al.
}
It is important to realize that even if $(\al,\be)$ have densities $(\density{\al},\density{\be})$, $\T_\sharp \al$ is not equal to $\T^\sharp \density{\be}$, because of the presence of the Jacobian in~\eqref{eq-pfwd-density}.
%
This explains why OT should be used with caution to perform image registration, because it does not operate as an image warping method.
%
Figure~\ref{fig-push-pull} illustrate the distinction between these push-forward and pull-back operators.
\end{rem}

---

After introducing weak* convergence, add a remark to explain detail the different notion of Convergence of random variable (in probability, almost sure, in law) and connect this to convergence of measures (strong, weak).

Keep in mind to have a pitch sentence for each \paragraph, for instance "Brenier maps and generalizations" "Regularity of OT maps." "Triangular rearrangements." "Variational dual formula." are lacking such pitch, but check at other places.

For bregman divergence as in "4.5 Bregman Projection View of Sinkhorn" use the notation B_Phi in place of D_Phi.

Fuse
	2.6 Vector Quantiles and Linearized Transport
and
	9.3 Linear Optimal Transport
and put this fused ubsection at this location in Section 9. KEep only one figure, the one "Figure 40: Linear OT coordinates. Fixing a reference measure" and remove the one from subsection 2.6

In this subsection, add a remark on hilbertian embedding of measure, that we have seen 3 ways (that you should \ref and also contrast) : kernel mean embedding / Sliced wasserstein / linear OT.

In the subsection of generalizing sinkhorn, make a comment on using phi divergence vs using bregman divergence (which can be defined over measure, so here put the definition over measure using the definition of first variation delta Phi / delta alpha introduced for gradient flows). Make the proposition/proof that KL is the only one which is both phi-div and bregman. You should check aux/bregman-cizar/ which contains this statement, but streamline the exposition and make it flow nicely with the current manuscript and notations. 


Integrate aux/gaussian-contraction/ inside the section on gaussian closure, as a last paragraph to revisit some of cases treated before.

Remove the paragraph "Applications and implications The practical value of Wasserstein distances"

In "8.6 Other Convex Regularizers" add a paragraph "Bregman vs phi-divergence" where you define the Bregman divergence B_Phi(pi|xi) for measure (make a ref to the subsectino where it was define for discrete histograms) and then make a proposition that the only case where B_Phi=D_phi is for KL, and contrast the dual and iterative algorithm for B_Phi vs D_phi regularization of OT. 


For "Proposition 67 (Small-transport-scale limit for marginal penalties)." doesn't the minimization on rho boils down to a scalar minimization at each x for rho(x), can't you give a name for this min so that one can have a much more explicit formulation for the limit?

Introducing a Lagrange multiplier ψt for the continuity equation gives the saddle problem -> encapsulate this in a proposition stating that the optimal v=nabla phi_t is a gradient (use phi in place of psi for the dual variable)