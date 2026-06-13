"""Generate OT-map logo candidates for OT4ML.

The visual grammar is intentionally close to the POT logo: each letter is made
of red source atoms, blue target atoms, and semi-transparent transport segments.
The assignments are recomputed under several ground costs to show how the OT map
changes with the metric.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

os.environ.setdefault("MPLCONFIGDIR", str(Path(os.environ.get("TMPDIR", "/tmp")) / "mpl-ot4ml-logo"))

import matplotlib.pyplot as plt
import numpy as np
from scipy.optimize import linear_sum_assignment
from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import maximum_bipartite_matching


HERE = Path(__file__).resolve().parent
OUTPUT_DIR = HERE / "outputs"


@dataclass(frozen=True)
class MetricSpec:
    key: str
    title: str
    kind: str
    anisotropy: tuple[float, float] = (1.0, 1.0)


METRICS = [
    MetricSpec("w2", r"$W_2$", "w2"),
    MetricSpec("w1", r"$W_1$", "w1"),
    MetricSpec("winf", r"$W_\infty$", "winf"),
    MetricSpec("aniso_x4", r"anisotropic $L_2$ $(4,1)$", "anisotropic", (4.0, 1.0)),
    MetricSpec("aniso_y4", r"anisotropic $L_2$ $(1,4)$", "anisotropic", (1.0, 4.0)),
    MetricSpec("aniso_diag", r"anisotropic $L_2$ $(2,.55)$", "anisotropic", (2.0, 0.55)),
]


# Six-row stroke glyphs. Each row contains one or several horizontal spans
# `(left, right)`, with coordinates in a 5-unit letter box. Each span contributes
# one source atom near the left end and one target atom near the right end; the OT
# assignment decides the map.
SPAN_GLYPHS = {
    "O": [
        [(1.72, 3.08)],
        [(0.52, 4.28)],
        [(0.0, 5.0)],
        [(0.0, 5.0)],
        [(0.52, 4.28)],
        [(1.72, 3.08)],
    ],
    "T": [
        [(0.0, 5.0)],
        [(0.0, 5.0)],
        [(2.0, 3.0)],
        [(2.0, 3.0)],
        [(2.0, 3.0)],
        [(2.0, 3.0)],
    ],
    "4": [
        [(0.0, 1.0), (4.0, 5.0)],
        [(0.0, 1.0), (4.0, 5.0)],
        [(0.0, 5.0)],
        [(0.0, 5.0)],
        [(4.0, 5.0)],
        [(4.0, 5.0)],
    ],
    "M": [
        [(0.0, 1.0), (4.0, 5.0)],
        [(0.0, 2.0), (3.0, 5.0)],
        [(0.0, 1.0), (2.0, 3.0), (4.0, 5.0)],
        [(0.0, 1.0), (2.0, 3.0), (4.0, 5.0)],
        [(0.0, 1.0), (4.0, 5.0)],
        [(0.0, 1.0), (4.0, 5.0)],
    ],
    "L": [
        [(0.0, 1.0)],
        [(0.0, 1.0)],
        [(0.0, 1.0)],
        [(0.0, 1.0)],
        [(0.0, 5.0)],
        [(0.0, 5.0)],
    ],
}


def ot4ml_points(
    word: str = "OT4ML",
    cell: float = 1.0,
    row_step: float = 1.25,
    gap: float = 1.05,
    cap_inset: float = 0.08,
    jitter: float = 0.015,
    seed: int = 4,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Return source points, target points and occupied-cell centers.

    The tiny deterministic jitter breaks exact ties while preserving the block
    letters. Source and target atoms stay near the endpoints of each glyph
    stroke.
    """

    rng = np.random.default_rng(seed)
    sources: list[tuple[float, float]] = []
    targets: list[tuple[float, float]] = []
    centers: list[tuple[float, float]] = []

    x0 = 0.0
    for char in word:
        glyph = SPAN_GLYPHS[char]
        height = len(glyph)
        width = 5
        for row, spans in enumerate(glyph):
            y = (height - 1 - row) * row_step
            for left, right in spans:
                wiggle_s = rng.normal(scale=jitter, size=2)
                wiggle_t = rng.normal(scale=jitter, size=2)
                source = np.array([x0 + (left + cap_inset) * cell, y + 0.5 * cell])
                target = np.array([x0 + (right - cap_inset) * cell, y + 0.5 * cell])
                center = 0.5 * (source + target)
                sources.append(tuple(source + wiggle_s))
                targets.append(tuple(target + wiggle_t))
                centers.append(tuple(center))
        x0 += width * cell + gap

    source = np.array(sources, dtype=float)
    target = np.array(targets, dtype=float)
    cells = np.array(centers, dtype=float)

    # Center vertically and horizontally for neat exports.
    midpoint = np.vstack([source, target]).mean(axis=0)
    source -= midpoint
    target -= midpoint
    cells -= midpoint
    return source, target, cells


def pairwise_delta(source: np.ndarray, target: np.ndarray) -> np.ndarray:
    return source[:, None, :] - target[None, :, :]


def cost_matrix(source: np.ndarray, target: np.ndarray, spec: MetricSpec) -> np.ndarray:
    delta = pairwise_delta(source, target)
    if spec.kind == "w2":
        return np.sum(delta**2, axis=2)
    if spec.kind == "w1":
        return np.sum(np.abs(delta), axis=2)
    if spec.kind == "winf":
        return np.max(np.abs(delta), axis=2)
    if spec.kind == "anisotropic":
        ax, ay = spec.anisotropy
        scaled = delta / np.array([ax, ay])
        return np.sum(scaled**2, axis=2)
    raise ValueError(f"Unknown metric kind: {spec.kind}")


def solve_assignment(source: np.ndarray, target: np.ndarray, spec: MetricSpec) -> np.ndarray:
    """Compute a deterministic OT map for equal-weight empirical measures."""

    cost = cost_matrix(source, target, spec)
    if spec.kind != "winf":
        index_tie = np.abs(np.arange(cost.shape[0])[:, None] - np.arange(cost.shape[1])[None, :])
        rows, cols = linear_sum_assignment(cost + 1e-6 * index_tie)
        assignment = np.empty(source.shape[0], dtype=int)
        assignment[rows] = cols
        return assignment

    # W_infty is the bottleneck assignment: minimize the longest matched edge.
    values = np.unique(cost.ravel())
    lo, hi = 0, len(values) - 1
    best = values[-1]
    while lo <= hi:
        mid = (lo + hi) // 2
        threshold = values[mid]
        graph = csr_matrix(cost <= threshold)
        match = maximum_bipartite_matching(graph, perm_type="column")
        if np.all(match >= 0):
            best = threshold
            hi = mid - 1
        else:
            lo = mid + 1

    # Tie-break among bottleneck-optimal maps with a tiny Euclidean objective.
    euclidean_tie = cost_matrix(source, target, MetricSpec("tie", "tie", "w2"))
    penalized = np.where(cost <= best + 1e-12, euclidean_tie, 1e9 + euclidean_tie)
    rows, cols = linear_sum_assignment(penalized)
    assignment = np.empty(source.shape[0], dtype=int)
    assignment[rows] = cols
    return assignment


def draw_logo(
    ax: plt.Axes,
    source: np.ndarray,
    target: np.ndarray,
    assignment: np.ndarray,
    title: str | None = None,
    show_cells: bool = False,
    line_alpha: float = 0.50,
    line_width: float = 1.45,
    dot_size: float = 35.0,
) -> None:
    if show_cells:
        ax.scatter(
            0.5 * (source[:, 0] + target[:, 0]),
            0.5 * (source[:, 1] + target[:, 1]),
            s=130,
            marker="s",
            c="#f2f2f2",
            edgecolors="none",
            zorder=0,
        )

    for i, j in enumerate(assignment):
        ax.plot(
            [source[i, 0], target[j, 0]],
            [source[i, 1], target[j, 1]],
            color="black",
            alpha=line_alpha,
            lw=line_width,
            solid_capstyle="round",
            zorder=1,
        )

    ax.scatter(source[:, 0], source[:, 1], s=dot_size, c="#d62728", edgecolors="black", linewidths=0.55, zorder=3)
    ax.scatter(target[:, 0], target[:, 1], s=dot_size, c="#1f57ff", edgecolors="black", linewidths=0.55, zorder=4)

    ax.set_aspect("equal")
    ax.axis("off")
    if title:
        ax.set_title(title, fontsize=11, pad=8)


def render_variant(
    spec: MetricSpec,
    source: np.ndarray,
    target: np.ndarray,
    output_dir: Path = OUTPUT_DIR,
    dpi: int = 240,
    show_cells: bool = False,
) -> tuple[Path, Path, np.ndarray]:
    output_dir.mkdir(parents=True, exist_ok=True)
    assignment = solve_assignment(source, target, spec)

    fig, ax = plt.subplots(figsize=(8.7, 2.25))
    draw_logo(ax, source, target, assignment, title=None, show_cells=show_cells)
    fig.subplots_adjust(0, 0, 1, 1)

    svg_path = output_dir / f"ot4ml_logo_{spec.key}.svg"
    png_path = output_dir / f"ot4ml_logo_{spec.key}.png"
    fig.savefig(svg_path, transparent=True, bbox_inches="tight", pad_inches=0.03)
    fig.savefig(png_path, transparent=True, bbox_inches="tight", pad_inches=0.03, dpi=dpi)
    plt.close(fig)
    return svg_path, png_path, assignment


def render_sheet(
    source: np.ndarray,
    target: np.ndarray,
    specs: list[MetricSpec] = METRICS,
    output_dir: Path = OUTPUT_DIR,
    dpi: int = 220,
) -> tuple[Path, Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    fig, axes = plt.subplots(len(specs), 1, figsize=(8.7, 2.05 * len(specs)))
    if len(specs) == 1:
        axes = [axes]
    for ax, spec in zip(axes, specs):
        assignment = solve_assignment(source, target, spec)
        draw_logo(ax, source, target, assignment, title=spec.title)
    fig.subplots_adjust(left=0.01, right=0.99, top=0.98, bottom=0.02, hspace=0.40)

    svg_path = output_dir / "ot4ml_logo_metric_sheet.svg"
    png_path = output_dir / "ot4ml_logo_metric_sheet.png"
    fig.savefig(svg_path, transparent=True, bbox_inches="tight", pad_inches=0.05)
    fig.savefig(png_path, transparent=True, bbox_inches="tight", pad_inches=0.05, dpi=dpi)
    plt.close(fig)
    return svg_path, png_path


def generate_all(output_dir: Path = OUTPUT_DIR) -> dict[str, tuple[Path, Path]]:
    source, target, _ = ot4ml_points()
    generated: dict[str, tuple[Path, Path]] = {}
    for spec in METRICS:
        svg_path, png_path, _ = render_variant(spec, source, target, output_dir=output_dir)
        generated[spec.key] = (svg_path, png_path)
    generated["metric_sheet"] = render_sheet(source, target, METRICS, output_dir=output_dir)
    return generated


if __name__ == "__main__":
    for key, paths in generate_all().items():
        print(f"{key}: {paths[0].relative_to(HERE)}  {paths[1].relative_to(HERE)}")
