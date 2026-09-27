"""Editorial choices specific to the compact notes, not to the full book."""

from __future__ import annotations

import re


OMITTED_TOPICS = {
    "matching": {
        "Concave costs on the line.",
        "Flat directions for the linear cost.",
        "Optimal transport on the circle.",
        "Hungarian Algorithm",
    },
    "monge": {
        "Polar factorization.",
        r"Poincar\'e disk.",
        "Twist condition.",
        "Ma--Trudinger--Wang curvature.",
        "Norms on cumulative functions.",
        "OT on trees.",
        "Triangular rearrangements.",
        "Alternate formulation of the Bures metric.",
    },
}

HUNGARIAN_SENTENCE = (
    r"The Hungarian algorithm solves the assignment problem exactly in $O(n^3)$ "
    r"operations by maintaining feasible dual potentials and augmenting a matching "
    r"along edges where the dual constraint is tight."
)


def trim_topics(text: str, chapter: str, parse_heading) -> str:
    """Remove whole heading scopes, including their labels and proofs."""
    omitted = OMITTED_TOPICS.get(chapter, set())
    levels = {"section": 1, "subsection": 2, "subsubsection": 3, "paragraph": 4}
    out = []
    skipped_level = None
    for line in text.splitlines():
        heading = parse_heading(line.strip())
        if heading:
            command, title, _ = heading
            level = levels[command]
            if skipped_level is not None and level <= skipped_level:
                skipped_level = None
            if title in omitted:
                skipped_level = level
                if title == "Hungarian Algorithm":
                    out.extend(["", HUNGARIAN_SENTENCE, ""])
        if skipped_level is None:
            out.append(line)
    text = "\n".join(out)
    if chapter == "monge":
        text = re.sub(
            r"\\begin\{prop\}\[Bobkov--Ledoux cumulative formula\].*?\\end\{proof\}\s*",
            "",
            text,
            flags=re.DOTALL,
        )
    return text


def repair_dependencies(text: str) -> str:
    """Keep later arguments readable after omitting their former prerequisites."""
    replacements = {
        r"Proposition~\ref{prop-assignment-dual-certificate} shows that":
            r"complementary slackness (Proposition~\ref{prop-discrete-complementary-slackness}) shows that",
        r"The second is the dual lower bound of Proposition~\ref{prop-assignment-dual-certificate}, applied to the feasible pair $(\gD^{\bar\C},\gD)$:":
            r"The second follows by summing the feasible dual inequalities $(\gD^{\bar\C})_i+\gD_j\leq\C_{i,j}$ against any optimal assignment:",
        r"The Bures term is jointly convex by Proposition~\ref{prop-bures-metric-convex},":
            r"The squared Bures term is jointly convex,",
        r"$c_{M^\star}$ satisfies the twist condition of Definition~\ref{def-twist-condition};":
            r"the map $y\mapsto\nabla_x c_{M^\star}(x,y)$ is injective for every $x$;",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def polish_context(text: str, chapter: str) -> str:
    """Restore short assumptions/introductions lost with figures and remarks."""
    if chapter == "matching":
        text = text.replace(
            r"$I_{\iota(1)}\leq\cdots\leq I_{\iota(N)}$.",
            r"$I_{\iota(1)}\leq\cdots\leq I_{\iota(N)}$. "
            r"For a target law $\beta$, assign the pixel of rank $k$ the intensity "
            r"$\cumul{\beta}^{-1}((k-1/2)/N)$, using the quantile function "
            r"of Definition~\ref{def-cdf-quantile}. "
            r"Stable sorting breaks ties between equal source intensities.",
        )
    if chapter != "monge":
        return text
    text = text.replace(
        "\\paragraph{Multivariate Gaussians.}\nIf",
        r"\paragraph{Multivariate Gaussians.} Consider two Gaussian laws and an affine transport candidate:",
    )
    text = text.replace(
        r"\paragraph{General measures.}",
        r"\paragraph{General measures.} "
        r"We write $\Mm(\X)$ for finite signed Borel measures on a metric space $(\X,d)$.",
    )
    text = text.replace(
        r"For the quadratic cost, the optimal map between an atomless source and an arbitrary target is the monotone rearrangement",
        r"On the real line, for the quadratic cost and finite second moments, the optimal map from an atomless source to an arbitrary target is the monotone rearrangement",
    )
    text = text.replace(
        r"\norm{\gamma(t)-\eta(t)}", r"\norm{\gamma(t)-\eta(t)}.",
    )
    text = text.replace(
        "It is written with the exponential map rather than vector-space subtraction:",
        r"For $c(x,y)=d_M(x,y)^2/2$, the optimal map is expressed using the exponential map:",
    )
    text = text.replace(
        "The contrast with Bures is especially visible near the boundary of the covariance cone. Fisher--Rao is different.",
        r"Rank-deficient covariances are at finite Bures distance, but at infinite Fisher--Rao distance.",
    )
    text = text.replace(
        r"In the coordinates~\eqref{eq-2x2-covariance-cone}, write $z=(t,u,v)$ and $z'=(t',u',v')$, and set",
        r"For $2\times2$ covariances, use $z=(t,u,v)$ with "
        r"$\Sigma(z)=2^{-1/2}\left(\begin{smallmatrix}t+u&v\\v&t-u\end{smallmatrix}\right)$ "
        r"and $t\geq\sqrt{u^2+v^2}$, and set",
    )
    return text
