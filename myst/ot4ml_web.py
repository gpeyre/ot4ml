"""Small executable demos for the OT4ML web book prototype."""

from __future__ import annotations

from pathlib import Path
from statistics import NormalDist
from typing import Callable

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import ot
from matplotlib.collections import LineCollection
from matplotlib.colors import to_rgb
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "notebooks-figures" / "assets"

RED = "#d73027"
BLUE = "#2166ac"
VIOLET = "#7b3294"

MIXTURES = ("one", "two", "wide_two", "three")
SHAPES = ("disk", "annulus", "two_blobs", "three_blobs", "crescent")
WEIGHT_MODES = ("uniform", "angular", "right_heavy")


def setup_style() -> None:
    mpl.rcParams.update(
        {
            "font.family": "serif",
            "font.serif": ["CMU Serif", "Computer Modern Roman", "DejaVu Serif"],
            "mathtext.fontset": "cm",
            "font.size": 10,
            "axes.linewidth": 0.8,
            "axes.edgecolor": "#333333",
            "axes.facecolor": "white",
            "figure.facecolor": "white",
            "xtick.major.size": 3,
            "ytick.major.size": 3,
            "xtick.major.width": 0.7,
            "ytick.major.width": 0.7,
        }
    )


def _remove_axes(ax: plt.Axes) -> None:
    ax.set_xticks([])
    ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_visible(False)


def _interp_color(t: float, color0: str = RED, color1: str = BLUE) -> tuple[float, float, float]:
    a = np.array(to_rgb(color0))
    b = np.array(to_rgb(color1))
    return tuple((1 - t) * a + t * b)


def _bounded_int(value: int, name: str, low: int, high: int) -> int:
    value = int(value)
    if value < low or value > high:
        raise ValueError(f"{name} must be between {low} and {high}")
    return value


def _normal_pdf(x: np.ndarray, mean: float, std: float) -> np.ndarray:
    return np.exp(-0.5 * ((x - mean) / std) ** 2) / (std * np.sqrt(2 * np.pi))


def _mixture_pdf(x: np.ndarray, weights: list[float], means: list[float], stds: list[float]) -> np.ndarray:
    weights = np.asarray(weights, dtype=float)
    weights = weights / weights.sum()
    pdf = np.zeros_like(x, dtype=float)
    for weight, mean, std in zip(weights, means, stds):
        pdf += weight * _normal_pdf(x, mean, std)
    return pdf


def _inverse_cdf_samples(grid: np.ndarray, pdf: np.ndarray, n: int) -> tuple[np.ndarray, np.ndarray]:
    cdf = np.cumsum(pdf)
    cdf = (cdf - cdf[0]) / (cdf[-1] - cdf[0])
    levels = (np.arange(n) + 0.5) / n
    return np.interp(levels, cdf, grid), levels


MIXTURE_PARAMETERS = {
    "one": dict(weights=[1.0], means=[0.0], stds=[0.58]),
    "two": dict(weights=[0.58, 0.42], means=[-2.05, -0.15], stds=[0.32, 0.48]),
    "wide_two": dict(weights=[0.42, 0.58], means=[-1.7, 1.25], stds=[0.62, 0.42]),
    "three": dict(weights=[0.50, 0.31, 0.19], means=[-1.78, 0.10, 1.72], stds=[0.25, 0.56, 0.31]),
}


def plot_quantile_matching(n: int = 52, source: str = "two", target: str = "three") -> plt.Figure:
    """One-dimensional monotone assignment between two mixture laws."""
    setup_style()
    n = _bounded_int(n, "n", 4, 220)
    if source not in MIXTURE_PARAMETERS or target not in MIXTURE_PARAMETERS:
        raise ValueError(f"source and target must be among {MIXTURES}")

    grid = np.linspace(-3.3, 3.3, 5000)
    alpha_pdf = _mixture_pdf(grid, **MIXTURE_PARAMETERS[source])
    beta_pdf = _mixture_pdf(grid, **MIXTURE_PARAMETERS[target])
    x_samples, levels = _inverse_cdf_samples(grid, alpha_pdf, n)
    y_samples, _ = _inverse_cdf_samples(grid, beta_pdf, n)

    fig, ax = plt.subplots(figsize=(7.0, 3.0))
    base_alpha = 0.76
    base_beta = 0.24
    scale = 0.27 / max(alpha_pdf.max(), beta_pdf.max())

    ax.fill_between(grid, base_alpha, base_alpha + scale * alpha_pdf, color=RED, alpha=0.16, linewidth=0)
    ax.plot(grid, base_alpha + scale * alpha_pdf, color=RED, lw=1.45)
    ax.fill_between(grid, base_beta, base_beta - scale * beta_pdf, color=BLUE, alpha=0.16, linewidth=0)
    ax.plot(grid, base_beta - scale * beta_pdf, color=BLUE, lw=1.45)

    for k, (xk, yk) in enumerate(zip(x_samples, y_samples)):
        ax.plot([xk, yk], [base_alpha, base_beta], color=_interp_color(levels[k]), lw=0.65, alpha=0.45)

    ax.scatter(x_samples, np.full(n, base_alpha), s=15, color=RED, edgecolor="none", zorder=3)
    ax.scatter(y_samples, np.full(n, base_beta), s=15, color=BLUE, edgecolor="none", zorder=3)
    ax.text(grid.min(), base_alpha + 0.23, r"source $\alpha$", color=RED, ha="left", va="center")
    ax.text(grid.min(), base_beta - 0.23, r"target $\beta$", color=BLUE, ha="left", va="center")
    ax.set_xlim(grid.min(), grid.max())
    ax.set_ylim(-0.05, 1.05)
    _remove_axes(ax)
    return fig


def _farthest_indices(points: np.ndarray, n: int) -> np.ndarray:
    chosen = [int(np.argmin(np.sum(points**2, axis=1)))]
    dist2 = np.sum((points - points[chosen[0]]) ** 2, axis=1)
    for _ in range(1, n):
        idx = int(np.argmax(dist2))
        chosen.append(idx)
        dist2 = np.minimum(dist2, np.sum((points - points[idx]) ** 2, axis=1))
    return np.asarray(chosen, dtype=int)


def _jitter(points: np.ndarray, rng: np.random.Generator) -> np.ndarray:
    if len(points) < 2:
        return points
    diff = points[:, None, :] - points[None, :, :]
    dist2 = np.sum(diff**2, axis=2)
    np.fill_diagonal(dist2, np.inf)
    sigma = 0.22 * float(np.sqrt(np.min(dist2, axis=1)).mean())
    return points + rng.normal(scale=sigma, size=points.shape)


def _sample_cloud(kind: str, n: int, rng: np.random.Generator) -> np.ndarray:
    n = _bounded_int(n, "number of points", 2, 180)
    if kind not in SHAPES:
        raise ValueError(f"shape must be one of {SHAPES}")

    candidates = max(1600, 70 * n)

    if kind == "disk":
        theta = rng.uniform(0, 2 * np.pi, candidates)
        radius = 0.52 * np.sqrt(rng.uniform(0, 1, candidates))
        points = np.column_stack([radius * np.cos(theta), radius * np.sin(theta)])
    elif kind == "annulus":
        theta = rng.uniform(0, 2 * np.pi, candidates)
        radius = np.sqrt(rng.uniform(0.82**2, 1.04**2, candidates))
        points = np.column_stack([radius * np.cos(theta), radius * np.sin(theta)])
    elif kind == "two_blobs":
        labels = rng.integers(0, 2, candidates)
        centers = np.array([[-0.72, -0.18], [0.72, 0.18]])
        points = centers[labels] + rng.normal(scale=[0.22, 0.18], size=(candidates, 2))
    elif kind == "three_blobs":
        labels = rng.integers(0, 3, candidates)
        centers = np.array([[-0.78, -0.45], [0.78, -0.35], [0.0, 0.75]])
        points = centers[labels] + rng.normal(scale=0.18, size=(candidates, 2))
    elif kind == "crescent":
        theta = rng.uniform(-0.92 * np.pi, 0.92 * np.pi, candidates)
        radius = 0.82 + 0.13 * rng.normal(size=candidates)
        points = np.column_stack([radius * np.cos(theta), 0.72 * radius * np.sin(theta)])
        points += np.array([0.15, 0.0])
    return _jitter(points[_farthest_indices(points, n)], rng)


def make_clouds(
    n_source: int = 36,
    n_target: int | None = None,
    source_shape: str = "disk",
    target_shape: str = "annulus",
    seed: int = 2027,
) -> tuple[np.ndarray, np.ndarray]:
    """Generate two readable point clouds for small OT experiments."""
    n_source = _bounded_int(n_source, "n_source", 2, 180)
    rng = np.random.default_rng(seed)
    n_target = n_source if n_target is None else _bounded_int(n_target, "n_target", 2, 180)
    source = _sample_cloud(source_shape, n_source, rng)
    target = _sample_cloud(target_shape, n_target, rng)
    return source, target


def _padded_limits(points: np.ndarray, pad: float = 0.16) -> tuple[tuple[float, float], tuple[float, float]]:
    xmin, ymin = points.min(axis=0)
    xmax, ymax = points.max(axis=0)
    dx = max(xmax - xmin, 1e-6)
    dy = max(ymax - ymin, 1e-6)
    return (xmin - pad * dx, xmax + pad * dx), (ymin - pad * dy, ymax + pad * dy)


def _weights_for_target(y: np.ndarray, mode: str = "uniform", strength: float = 1.0) -> np.ndarray:
    if mode not in WEIGHT_MODES:
        raise ValueError(f"weight_mode must be one of {WEIGHT_MODES}")
    strength = float(np.clip(strength, 0.0, 4.0))

    if mode == "uniform":
        w = np.ones(len(y), dtype=float)
    elif mode == "angular":
        angles = np.arctan2(y[:, 1], y[:, 0])
        w = 0.18 + (0.5 + 0.5 * np.cos(angles - 0.65)) ** (1.0 + 2.0 * strength)
    elif mode == "right_heavy":
        x = (y[:, 0] - y[:, 0].min()) / max(float(np.ptp(y[:, 0])), 1e-12)
        w = 0.15 + np.exp(strength * (2.0 * x - 1.0))
    return w / w.sum()


def _transport_plan(a: np.ndarray, b: np.ndarray, cost: np.ndarray, epsilon: float) -> np.ndarray:
    positive = cost[cost > 0]
    scale = float(np.median(positive)) if positive.size else 1.0
    cost_scaled = cost / max(scale, 1e-12)
    if epsilon <= 0:
        return ot.emd(a, b, cost_scaled, numItermax=200000)
    return ot.sinkhorn(
        a,
        b,
        cost_scaled,
        reg=float(epsilon),
        method="sinkhorn_log",
        numItermax=20000,
        stopThr=1e-5,
    )


def _plan_for_clouds(
    x: np.ndarray,
    y: np.ndarray,
    cost_power: float,
    epsilon: float,
    weight_mode: str,
    weight_strength: float,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    if cost_power <= 0:
        raise ValueError("cost_power must be positive")
    a = np.ones(len(x)) / len(x)
    b = _weights_for_target(y, weight_mode, weight_strength)
    distance = np.linalg.norm(x[:, None, :] - y[None, :, :], axis=2)
    plan = _transport_plan(a, b, distance**cost_power, max(float(epsilon), 0.0))
    return a, b, plan


def _draw_segments(
    ax: plt.Axes,
    x: np.ndarray,
    y: np.ndarray,
    plan: np.ndarray,
    max_edges: int = 220,
) -> None:
    entries = [(i, j, float(plan[i, j])) for i in range(plan.shape[0]) for j in range(plan.shape[1]) if plan[i, j] > 1e-12]
    if not entries:
        return
    entries = sorted(entries, key=lambda item: item[2], reverse=True)[:max_edges]
    masses = np.array([m for _, _, m in entries], dtype=float)
    masses = masses / max(masses.max(), 1e-15)
    segments = [[x[i], y[j]] for i, j, _ in entries]
    widths = 0.22 + 1.65 * np.sqrt(masses)
    base = np.array(to_rgb(VIOLET))
    colors = [(*base, min(0.10 + 0.70 * mass, 0.90)) for mass in masses]
    ax.add_collection(LineCollection(segments, colors=colors, linewidths=widths, zorder=1))


def _draw_transport_axis(
    ax: plt.Axes,
    x: np.ndarray,
    y: np.ndarray,
    a: np.ndarray,
    b: np.ndarray,
    plan: np.ndarray,
    title: str,
    limits: tuple[tuple[float, float], tuple[float, float]],
) -> None:
    _draw_segments(ax, x, y, plan)
    source_sizes = 48 * np.sqrt(a / a.max())
    target_sizes = 48 * np.sqrt(b / b.max())
    ax.scatter(x[:, 0], x[:, 1], s=source_sizes, marker="o", color=RED, edgecolor="white", linewidth=0.4, zorder=3)
    ax.scatter(y[:, 0], y[:, 1], s=target_sizes, marker="o", color=BLUE, edgecolor="white", linewidth=0.4, zorder=4)
    ax.set_title(title, pad=7)
    ax.set_xlim(*limits[0])
    ax.set_ylim(*limits[1])
    ax.set_aspect("equal")
    _remove_axes(ax)


def plot_transport_experiment(
    n_source: int = 36,
    n_target: int | None = None,
    source_shape: str = "disk",
    target_shape: str = "annulus",
    cost_power: float = 2.0,
    epsilon: float = 0.0,
    weight_mode: str = "uniform",
    weight_strength: float = 1.0,
    seed: int = 2027,
) -> plt.Figure:
    """Plot an OT plan while exposing only the meaningful modeling knobs."""
    setup_style()
    x, y = make_clouds(n_source, n_target, source_shape, target_shape, seed)
    a, b, plan = _plan_for_clouds(x, y, cost_power, epsilon, weight_mode, weight_strength)
    fig, ax = plt.subplots(figsize=(5.3, 5.3))
    title = rf"$c(x,y)=\|x-y\|^{{{cost_power:g}}}$"
    if epsilon > 0:
        title += rf", entropic $\varepsilon={epsilon:g}$"
    else:
        title += ", exact LP"
    _draw_transport_axis(ax, x, y, a, b, plan, title, _padded_limits(np.vstack([x, y])))
    return fig


def plot_cost_power_sweep(
    cost_powers: tuple[float, ...] = (1.0, 2.0, 6.0),
    n_points: int = 36,
    source_shape: str = "disk",
    target_shape: str = "annulus",
    seed: int = 2074,
) -> plt.Figure:
    """Compare exact assignments for several powers of the ground distance."""
    setup_style()
    if len(cost_powers) < 1 or len(cost_powers) > 4:
        raise ValueError("cost_powers must contain between 1 and 4 values")
    x, y = make_clouds(n_points, n_points, source_shape, target_shape, seed)
    limits = _padded_limits(np.vstack([x, y]))
    fig, axes = plt.subplots(1, len(cost_powers), figsize=(3.05 * len(cost_powers), 3.45))
    axes = np.atleast_1d(axes)
    for ax, power in zip(axes, cost_powers):
        a, b, plan = _plan_for_clouds(x, y, float(power), 0.0, "uniform", 1.0)
        title = rf"$p={float(power):g}$"
        _draw_transport_axis(ax, x, y, a, b, plan, title, limits)
    fig.suptitle(r"Exact assignment for $c(x,y)=\|x-y\|^p$", y=0.96, fontsize=11)
    fig.tight_layout(rect=(0, 0, 1, 0.88), w_pad=0.3)
    return fig


def plot_regularization_sweep(
    epsilons: tuple[float, ...] = (0.0, 0.03, 0.12),
    n_source: int = 36,
    n_target: int = 18,
    source_shape: str = "disk",
    target_shape: str = "annulus",
    cost_power: float = 2.0,
    weight_mode: str = "angular",
    weight_strength: float = 1.4,
    seed: int = 2031,
) -> plt.Figure:
    """Compare exact and entropic transport plans on the same point clouds."""
    setup_style()
    if len(epsilons) < 1 or len(epsilons) > 4:
        raise ValueError("epsilons must contain between 1 and 4 values")
    x, y = make_clouds(n_source, n_target, source_shape, target_shape, seed)
    limits = _padded_limits(np.vstack([x, y]))
    fig, axes = plt.subplots(1, len(epsilons), figsize=(3.05 * len(epsilons), 3.45))
    axes = np.atleast_1d(axes)
    for ax, epsilon in zip(axes, epsilons):
        a, b, plan = _plan_for_clouds(x, y, cost_power, float(epsilon), weight_mode, weight_strength)
        title = "exact LP" if epsilon <= 0 else rf"$\varepsilon={float(epsilon):g}$"
        _draw_transport_axis(ax, x, y, a, b, plan, title, limits)
    fig.suptitle("From sparse plans to entropic couplings", y=0.96, fontsize=11)
    fig.tight_layout(rect=(0, 0, 1, 0.88), w_pad=0.3)
    return fig


def _load_gray_cat(n: int = 126) -> np.ndarray:
    n = _bounded_int(n, "image_size", 32, 256)
    img = Image.open(ASSETS / "cat.jpg")
    img = ImageOps.grayscale(img).resize((n, n), Image.Resampling.LANCZOS)
    return np.asarray(img, dtype=float) / 255.0


def _equalize_to_truncated_gaussian(arr: np.ndarray, mean: float, sigma: float) -> np.ndarray:
    flat = arr.ravel()
    order = np.argsort(flat, kind="mergesort")
    ranks = np.empty_like(flat, dtype=float)
    ranks[order] = (np.arange(flat.size) + 0.5) / flat.size
    normal = NormalDist(mu=mean, sigma=sigma)
    lo = normal.cdf(0.0)
    hi = normal.cdf(1.0)
    mapped = np.array([normal.inv_cdf(lo + rank * (hi - lo)) for rank in ranks])
    return np.clip(mapped.reshape(arr.shape), 0.0, 1.0)


def plot_histogram_equalization(
    image_size: int = 126,
    target_mean: float = 0.18,
    target_sigma: float = 0.105,
    interpolation: float = 1.0,
) -> plt.Figure:
    """Show monotone rearrangement of image intensities toward a target law."""
    setup_style()
    interpolation = float(np.clip(interpolation, 0.0, 1.0))
    target_mean = float(np.clip(target_mean, 0.02, 0.98))
    target_sigma = float(np.clip(target_sigma, 0.03, 0.35))
    img0 = _load_gray_cat(image_size)
    img1 = _equalize_to_truncated_gaussian(img0, target_mean, target_sigma)
    img = (1 - interpolation) * img0 + interpolation * img1

    bins = np.linspace(0, 1, 45)
    hist = np.histogram(img.ravel(), bins=bins, density=True)[0]
    centers = 0.5 * (bins[:-1] + bins[1:])
    normal = NormalDist(mu=target_mean, sigma=target_sigma)
    lo = normal.cdf(0.0)
    hi = normal.cdf(1.0)
    target_pdf = np.array([normal.pdf(float(x)) / (hi - lo) for x in centers])

    fig, axes = plt.subplots(1, 2, figsize=(8.2, 3.2), gridspec_kw={"width_ratios": [1.0, 1.22]})
    axes[0].imshow(img, cmap="gray", vmin=0, vmax=1, interpolation="nearest")
    axes[0].set_title(rf"$t={interpolation:.2f}$")
    _remove_axes(axes[0])

    color = _interp_color(interpolation)
    axes[1].fill_between(centers, 0, hist, color=color, alpha=0.28, linewidth=0)
    axes[1].plot(centers, hist, color=color, lw=1.5, label="current image")
    axes[1].plot(centers, target_pdf, color=BLUE, lw=1.1, alpha=0.90, label="target law")
    axes[1].set_xlim(0, 1)
    axes[1].set_ylim(0, 1.12 * max(float(hist.max()), float(target_pdf.max())))
    axes[1].set_xlabel("gray level")
    axes[1].set_ylabel("density")
    axes[1].legend(frameon=False, loc="upper right")
    fig.tight_layout()
    return fig


def _show_figure(fig: plt.Figure) -> None:
    from IPython.display import display

    display(fig)
    plt.close(fig)


def _widgets():
    try:
        import ipywidgets as widgets
    except ImportError as exc:
        raise RuntimeError("Interactive controls require ipywidgets. Install the packages in myst/requirements.txt.") from exc
    return widgets


def _live_output(callback: Callable[..., plt.Figure], controls: dict[str, object]):
    widgets = _widgets()

    def render(**kwargs) -> None:
        _show_figure(callback(**kwargs))

    return widgets.interactive_output(render, controls)


def quantile_matching_controls():
    """Interactive controls for the one-dimensional quantile matching demo."""
    widgets = _widgets()
    controls = {
        "n": widgets.IntSlider(value=52, min=8, max=140, step=2, description="points", continuous_update=False),
        "source": widgets.Dropdown(options=MIXTURES, value="two", description="source"),
        "target": widgets.Dropdown(options=MIXTURES, value="three", description="target"),
    }
    output = _live_output(plot_quantile_matching, controls)
    return widgets.VBox([widgets.HBox(list(controls.values())), output])


def histogram_equalization_controls():
    """Interactive controls for one-dimensional histogram equalization."""
    widgets = _widgets()
    controls = {
        "target_mean": widgets.FloatSlider(value=0.18, min=0.05, max=0.85, step=0.01, description="mean", continuous_update=False),
        "target_sigma": widgets.FloatSlider(value=0.105, min=0.04, max=0.28, step=0.005, description="sigma", continuous_update=False),
        "interpolation": widgets.FloatSlider(value=0.67, min=0.0, max=1.0, step=0.05, description="t", continuous_update=False),
    }
    output = _live_output(plot_histogram_equalization, controls)
    return widgets.VBox([widgets.HBox(list(controls.values())), output])


def cost_power_sweep_controls():
    """Interactive controls for comparing exact assignments across cost powers."""
    widgets = _widgets()
    n_points = widgets.IntSlider(value=36, min=8, max=72, step=2, description="points", continuous_update=False)
    source_shape = widgets.Dropdown(options=SHAPES, value="disk", description="source")
    target_shape = widgets.Dropdown(options=SHAPES, value="annulus", description="target")
    p1 = widgets.FloatSlider(value=1.0, min=0.5, max=8.0, step=0.5, description="p1", continuous_update=False)
    p2 = widgets.FloatSlider(value=2.0, min=0.5, max=8.0, step=0.5, description="p2", continuous_update=False)
    p3 = widgets.FloatSlider(value=6.0, min=0.5, max=8.0, step=0.5, description="p3", continuous_update=False)
    seed = widgets.IntSlider(value=2074, min=2000, max=2100, step=1, description="seed", continuous_update=False)

    def render(n_points: int, source_shape: str, target_shape: str, p1: float, p2: float, p3: float, seed: int) -> plt.Figure:
        return plot_cost_power_sweep(
            n_points=n_points,
            source_shape=source_shape,
            target_shape=target_shape,
            cost_powers=(p1, p2, p3),
            seed=seed,
        )

    controls = {
        "n_points": n_points,
        "source_shape": source_shape,
        "target_shape": target_shape,
        "p1": p1,
        "p2": p2,
        "p3": p3,
        "seed": seed,
    }
    output = _live_output(render, controls)
    return widgets.VBox([widgets.HBox([n_points, source_shape, target_shape, seed]), widgets.HBox([p1, p2, p3]), output])


def regularization_sweep_controls():
    """Interactive controls for comparing exact and entropic coupling plans."""
    widgets = _widgets()
    n_source = widgets.IntSlider(value=36, min=8, max=72, step=2, description="source n", continuous_update=False)
    n_target = widgets.IntSlider(value=18, min=4, max=60, step=2, description="target n", continuous_update=False)
    weight_mode = widgets.Dropdown(options=WEIGHT_MODES, value="angular", description="weights")
    weight_strength = widgets.FloatSlider(value=1.4, min=0.0, max=4.0, step=0.2, description="strength", continuous_update=False)
    eps1 = widgets.FloatSlider(value=0.03, min=0.005, max=0.2, step=0.005, description="eps 1", continuous_update=False)
    eps2 = widgets.FloatSlider(value=0.12, min=0.005, max=0.3, step=0.005, description="eps 2", continuous_update=False)
    seed = widgets.IntSlider(value=2031, min=2000, max=2100, step=1, description="seed", continuous_update=False)

    def render(
        n_source: int,
        n_target: int,
        weight_mode: str,
        weight_strength: float,
        eps1: float,
        eps2: float,
        seed: int,
    ) -> plt.Figure:
        return plot_regularization_sweep(
            n_source=n_source,
            n_target=n_target,
            epsilons=(0.0, eps1, eps2),
            weight_mode=weight_mode,
            weight_strength=weight_strength,
            seed=seed,
        )

    controls = {
        "n_source": n_source,
        "n_target": n_target,
        "weight_mode": weight_mode,
        "weight_strength": weight_strength,
        "eps1": eps1,
        "eps2": eps2,
        "seed": seed,
    }
    output = _live_output(render, controls)
    return widgets.VBox([widgets.HBox([n_source, n_target, weight_mode, seed]), widgets.HBox([weight_strength, eps1, eps2]), output])
