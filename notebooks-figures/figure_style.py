"""Shared plotting utilities for OT4ML figure notebooks."""

from __future__ import annotations

from pathlib import Path

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.collections import LineCollection
from matplotlib.colors import to_rgb


ROOT = Path(__file__).resolve().parents[1]
LATEX_FIGURES = ROOT / "latex" / "figures"

RED = "#d73027"
BLUE = "#2166ac"
VIOLET = "#7b3294"
ORANGE = "#fdae61"
GRAY = "#4d4d4d"
LIGHT_GRAY = "#d9d2c3"
BACKGROUND = "#fffaf0"

DIRAC_MARKER_SIZE = 15.0
MASS_MARKER_MIN_FACTOR = 0.50
MASS_MARKER_MAX_FACTOR = 1.55
TRANSPORT_LINE_MIN_WIDTH = 0.18
TRANSPORT_LINE_MAX_WIDTH = 1.75
TRANSPORT_LINE_ALPHA_SCALE = 0.68
AXIS_LINE_WIDTH = 0.75
POINT_EDGE_WIDTH = 0.0


def setup_matplotlib() -> None:
    """Use a common compact style for all generated PDF figures."""
    mpl.rcParams.update(
        {
            "font.family": "serif",
            "font.serif": ["CMU Serif", "Computer Modern Roman", "DejaVu Serif"],
            "mathtext.fontset": "cm",
            "font.size": 9,
            "axes.linewidth": AXIS_LINE_WIDTH,
            "axes.edgecolor": "#333333",
            "axes.facecolor": "white",
            "figure.facecolor": "white",
            "xtick.major.size": 3,
            "ytick.major.size": 3,
            "xtick.major.width": 0.7,
            "ytick.major.width": 0.7,
            "pdf.fonttype": 42,
            "ps.fonttype": 42,
        }
    )


def figure_dir(name: str) -> Path:
    out = LATEX_FIGURES / name
    out.mkdir(parents=True, exist_ok=True)
    return out


def save_pdf(fig: plt.Figure, path: Path, *, pad_inches: float = 0.035) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(path, bbox_inches="tight", pad_inches=pad_inches)


def remove_axes(ax: plt.Axes) -> None:
    ax.set_xticks([])
    ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_visible(False)


def box_axes(ax: plt.Axes) -> None:
    for spine in ax.spines.values():
        spine.set_visible(True)
        spine.set_linewidth(AXIS_LINE_WIDTH)


def coupling_box(
    ax: plt.Axes,
    n_rows: int,
    n_cols: int,
    *,
    color: str = "#2b2b2b",
    linewidth: float = 0.55,
    zorder: int = 6,
) -> None:
    """Draw a tight frame around a coupling matrix, excluding marginal strips."""
    ax.plot(
        [-0.5, n_cols - 0.5, n_cols - 0.5, -0.5, -0.5],
        [-0.5, -0.5, n_rows - 0.5, n_rows - 0.5, -0.5],
        color=color,
        lw=linewidth,
        solid_capstyle="butt",
        solid_joinstyle="miter",
        zorder=zorder,
        clip_on=False,
    )


def padded_limits(points: np.ndarray, pad: float = 0.25) -> tuple[tuple[float, float], tuple[float, float]]:
    points = np.asarray(points)
    xmin, ymin = points.min(axis=0)
    xmax, ymax = points.max(axis=0)
    dx = max(xmax - xmin, 1e-6)
    dy = max(ymax - ymin, 1e-6)
    return (xmin - pad * dx, xmax + pad * dx), (ymin - pad * dy, ymax + pad * dy)


def interp_color(t: float, color0: str = RED, color1: str = BLUE) -> tuple[float, float, float]:
    a = np.array(to_rgb(color0))
    b = np.array(to_rgb(color1))
    return tuple((1 - t) * a + t * b)


def draw_transport_segments(
    ax: plt.Axes,
    x: np.ndarray,
    y: np.ndarray,
    pairs: list[tuple[int, int, float]],
    *,
    color: str = VIOLET,
    max_width: float = TRANSPORT_LINE_MAX_WIDTH,
    min_width: float = TRANSPORT_LINE_MIN_WIDTH,
    alpha_scale: float = TRANSPORT_LINE_ALPHA_SCALE,
    zorder: int = 1,
) -> None:
    if len(pairs) == 0:
        return
    masses = np.array([m for _, _, m in pairs], dtype=float)
    masses = masses / max(masses.max(), 1e-15)
    segments = [[x[i], y[j]] for i, j, _ in pairs]
    widths = min_width + (max_width - min_width) * np.sqrt(masses)
    colors = []
    base = np.array(to_rgb(color))
    for mass in masses:
        colors.append((*base, min(0.12 + alpha_scale * mass, 0.95)))
    lc = LineCollection(segments, colors=colors, linewidths=widths, zorder=zorder)
    ax.add_collection(lc)


def draw_point_clouds(
    ax: plt.Axes,
    x: np.ndarray,
    y: np.ndarray,
    *,
    source_weights: np.ndarray | None = None,
    target_weights: np.ndarray | None = None,
    base_size: float = DIRAC_MARKER_SIZE,
    zorder: int = 3,
) -> None:
    if source_weights is None:
        source_sizes = np.full(len(x), base_size)
    else:
        source_sizes = base_size * (
            MASS_MARKER_MIN_FACTOR
            + (MASS_MARKER_MAX_FACTOR - MASS_MARKER_MIN_FACTOR) * np.asarray(source_weights) / np.max(source_weights)
        )
    if target_weights is None:
        target_sizes = np.full(len(y), base_size)
    else:
        target_sizes = base_size * (
            MASS_MARKER_MIN_FACTOR
            + (MASS_MARKER_MAX_FACTOR - MASS_MARKER_MIN_FACTOR) * np.asarray(target_weights) / np.max(target_weights)
        )
    ax.scatter(x[:, 0], x[:, 1], s=source_sizes, marker="o", color=RED, edgecolor="none", linewidth=POINT_EDGE_WIDTH, zorder=zorder)
    ax.scatter(y[:, 0], y[:, 1], s=target_sizes, marker="o", color=BLUE, edgecolor="none", linewidth=POINT_EDGE_WIDTH, zorder=zorder)


def canonical_matching_clouds(
    *,
    seed: int = 2027,
    n_source: int = 36,
    target_counts: tuple[int, int, int] | None = None,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Return the canonical disk-to-annulus cloud pair used in early figures.

    The source is semi-regular in a central disk of radius ``0.5``. The target
    is semi-regular in an annulus of outer radius ``1`` and width ``0.15``.
    Both clouds are generated by farthest-point sampling from many random
    candidates, then perturbed by a tiny noise proportional to the mean
    nearest-neighbor spacing. This keeps the geometry readable while avoiding
    an artificial lattice.
    """
    rng = np.random.default_rng(seed)

    def farthest_indices(points: np.ndarray, n: int) -> np.ndarray:
        chosen = [int(np.argmin(np.sum(points**2, axis=1)))]
        dist2 = np.sum((points - points[chosen[0]]) ** 2, axis=1)
        for _ in range(1, n):
            idx = int(np.argmax(dist2))
            chosen.append(idx)
            dist2 = np.minimum(dist2, np.sum((points - points[idx]) ** 2, axis=1))
        return np.asarray(chosen, dtype=int)

    def mean_nearest_spacing(points: np.ndarray) -> float:
        diff = points[:, None, :] - points[None, :, :]
        dist2 = np.sum(diff**2, axis=2)
        np.fill_diagonal(dist2, np.inf)
        return float(np.sqrt(np.min(dist2, axis=1)).mean())

    def jitter(points: np.ndarray) -> np.ndarray:
        sigma = 0.30 * mean_nearest_spacing(points)
        return points + rng.normal(scale=sigma, size=points.shape)

    n_target = n_source if target_counts is None else int(np.sum(target_counts))
    n_candidates = max(1600, 70 * max(n_source, n_target))

    theta = rng.uniform(0, 2 * np.pi, n_candidates)
    radius = 0.5 * np.sqrt(rng.uniform(0, 1, n_candidates))
    disk_candidates = np.column_stack([radius * np.cos(theta), radius * np.sin(theta)])
    source = jitter(disk_candidates[farthest_indices(disk_candidates, n_source)])

    theta = rng.uniform(0, 2 * np.pi, n_candidates)
    radius = np.sqrt(rng.uniform(0.85**2, 1.0, n_candidates))
    annulus_candidates = np.column_stack([radius * np.cos(theta), radius * np.sin(theta)])
    target = jitter(annulus_candidates[farthest_indices(annulus_candidates, n_target)])

    angles = (np.arctan2(target[:, 1], target[:, 0]) + 2 * np.pi) % (2 * np.pi)
    labels = np.floor(3 * ((angles + np.pi / 7) % (2 * np.pi)) / (2 * np.pi)).astype(int)

    perm = rng.permutation(len(target))
    target = target[perm]
    labels = labels[perm]
    return source, target, labels
