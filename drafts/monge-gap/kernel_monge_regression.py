"""Monge-gap-regularized kernel regression on a one-dimensional grid.

The experiment solves the exact convex quadratic program derived in
``monge_gap.tex``.  It is intentionally small enough to run with a generic QP
solver while retaining all pairwise order-violation variables.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

os.environ.setdefault("MPLCONFIGDIR", "/tmp/matplotlib-ot4ml")

import cvxpy as cp
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import LinearSegmentedColormap


BLUE = "#2F6FA3"
RED = "#C44E3B"
VIOLET = "#76518D"
ORANGE = "#D58A3A"
GRAY = "#69717A"
LIGHT_GRAY = "#D9DDE1"


@dataclass(frozen=True)
class RegressionPath:
    """Numerical outputs along a Monge-gap regularization path."""

    gammas: np.ndarray
    fits: np.ndarray
    gaps: np.ndarray
    errors: np.ndarray
    hard_fit: np.ndarray
    hard_error: float


def gaussian_gram(x: np.ndarray, bandwidth: float, nugget: float) -> np.ndarray:
    """Return a stabilized Gaussian-kernel Gram matrix.

    Parameters
    ----------
    x:
        One-dimensional sample locations.
    bandwidth:
        Positive Gaussian-kernel bandwidth.
    nugget:
        Positive diagonal stabilization added to the Gram matrix.

    Returns
    -------
    numpy.ndarray
        Symmetric positive-definite Gram matrix.
    """

    squared_distances = (x[:, None] - x[None, :]) ** 2
    gram = np.exp(-squared_distances / (2.0 * bandwidth**2))
    return gram + nugget * np.eye(x.size)


def quadratic_monge_gap(x: np.ndarray, values: np.ndarray) -> float:
    """Evaluate the empirical quadratic Monge gap by sorting.

    The input locations must be sorted increasingly and carry equal weights.

    Parameters
    ----------
    x:
        Increasing one-dimensional input locations.
    values:
        Candidate map values at the input locations.

    Returns
    -------
    float
        Exact empirical Monge gap for the cost ``|x-y|^2 / 2``.
    """

    return float((x @ np.sort(values) - x @ values) / x.size)


def solve_path(
    x: np.ndarray,
    observations: np.ndarray,
    gram: np.ndarray,
    ridge: float,
    gammas: np.ndarray,
) -> RegressionPath:
    """Solve the penalized and hard-monotone RKHS regression problems.

    Parameters
    ----------
    x:
        Equally spaced, increasing input locations.
    observations:
        Scalar regression observations.
    gram:
        Positive-definite kernel Gram matrix.
    ridge:
        Positive RKHS squared-norm weight.
    gammas:
        Nonnegative Monge-gap weights, sorted increasingly and starting at
        zero.

    Returns
    -------
    RegressionPath
        Fitted values, exact gaps, empirical errors, and the hard-monotone
        benchmark.
    """

    if gammas[0] != 0 or np.any(np.diff(gammas) <= 0):
        raise ValueError("gammas must be strictly increasing and start at zero")

    sample_count = x.size
    grid_step = float(x[1] - x[0])
    pair_indices = np.array(
        [(i, j) for i in range(sample_count) for j in range(i + 1, sample_count)],
        dtype=int,
    )

    # Gamma zero is ordinary kernel ridge regression and has a closed form.
    ridge_coefficients = np.linalg.solve(
        gram + ridge * np.eye(sample_count), observations
    )
    fits = [gram @ ridge_coefficients]

    coefficients = cp.Variable(sample_count)
    fitted_values = gram @ coefficients
    inversion_slacks = cp.Variable(pair_indices.shape[0], nonneg=True)
    gamma_parameter = cp.Parameter(nonneg=True)

    constraints = [
        inversion_slacks
        >= fitted_values[pair_indices[:, 0]]
        - fitted_values[pair_indices[:, 1]]
    ]
    gap_epigraph = grid_step * cp.sum(inversion_slacks) / sample_count
    objective = cp.Minimize(
        cp.sum_squares(fitted_values - observations)
        + ridge * cp.quad_form(coefficients, cp.psd_wrap(gram))
        + gamma_parameter * gap_epigraph
    )
    problem = cp.Problem(objective, constraints)

    for gamma in gammas[1:]:
        gamma_parameter.value = float(gamma)
        problem.solve(
            solver="OSQP",
            eps_abs=1e-7,
            eps_rel=1e-7,
            max_iter=200_000,
            polishing=True,
            warm_start=True,
            verbose=False,
        )
        if problem.status not in {cp.OPTIMAL, cp.OPTIMAL_INACCURATE}:
            raise RuntimeError(f"QP failed for gamma={gamma}: {problem.status}")
        fits.append(np.asarray(fitted_values.value).ravel().copy())

    # Solve the limiting hard monotonicity-constrained problem independently.
    hard_coefficients = cp.Variable(sample_count)
    hard_values = gram @ hard_coefficients
    hard_problem = cp.Problem(
        cp.Minimize(
            cp.sum_squares(hard_values - observations)
            + ridge * cp.quad_form(hard_coefficients, cp.psd_wrap(gram))
        ),
        [hard_values[1:] >= hard_values[:-1]],
    )
    hard_problem.solve(
        solver="OSQP",
        eps_abs=1e-8,
        eps_rel=1e-8,
        max_iter=200_000,
        polishing=True,
        verbose=False,
    )
    if hard_problem.status not in {cp.OPTIMAL, cp.OPTIMAL_INACCURATE}:
        raise RuntimeError(f"Hard-monotone QP failed: {hard_problem.status}")

    fit_matrix = np.vstack(fits)
    gaps = np.array([quadratic_monge_gap(x, fit) for fit in fit_matrix])
    errors = np.mean((fit_matrix - observations[None, :]) ** 2, axis=1)
    hard_fit = np.asarray(hard_values.value).ravel()
    hard_error = float(np.mean((hard_fit - observations) ** 2))

    if gaps[-1] > 2e-5:
        raise RuntimeError(
            "The largest penalty did not reach the monotone regime; "
            f"final gap={gaps[-1]:.3e}."
        )

    return RegressionPath(gammas, fit_matrix, gaps, errors, hard_fit, hard_error)


def style_axis(axis: plt.Axes) -> None:
    """Apply the common understated axis style used by the figure."""

    axis.spines["top"].set_visible(False)
    axis.spines["right"].set_visible(False)
    axis.tick_params(colors=GRAY, labelsize=8)
    axis.xaxis.label.set_color(GRAY)
    axis.yaxis.label.set_color(GRAY)
    axis.title.set_color("#27313A")
    axis.grid(axis="y", color=LIGHT_GRAY, linewidth=0.65, alpha=0.65)


def render_figure(
    x: np.ndarray,
    observations: np.ndarray,
    path: RegressionPath,
    output_directory: Path,
) -> None:
    """Render the fitted curves and regularization diagnostics.

    Parameters
    ----------
    x:
        Increasing input locations.
    observations:
        Scalar observations.
    path:
        Solutions returned by :func:`solve_path`.
    output_directory:
        Directory receiving PDF and PNG versions of the figure.
    """

    selected_gammas = np.array([0.0, 10.0, 30.0, 60.0, 150.0])
    selected_indices = [
        int(np.flatnonzero(np.isclose(path.gammas, gamma))[0])
        for gamma in selected_gammas
    ]
    color_map = LinearSegmentedColormap.from_list("blue_red", [BLUE, VIOLET, RED])
    colors = [color_map(value) for value in np.linspace(0.0, 1.0, len(selected_gammas))]

    figure, axes = plt.subplots(
        1,
        3,
        figsize=(12.4, 3.45),
        gridspec_kw={"width_ratios": [1.75, 1.0, 1.0], "wspace": 0.36},
    )
    figure.patch.set_facecolor("white")

    fit_axis, gap_axis, error_axis = axes
    fit_axis.scatter(
        x,
        observations,
        s=15,
        color="#838A90",
        alpha=0.58,
        edgecolor="white",
        linewidth=0.35,
        label="observations",
        zorder=2,
    )
    for index, gamma, color in zip(selected_indices, selected_gammas, colors):
        fit_axis.plot(
            x,
            path.fits[index],
            color=color,
            linewidth=2.0,
            label=rf"$\gamma={gamma:g}$",
            zorder=3,
        )
    fit_axis.plot(
        x,
        path.hard_fit,
        color="#1F2428",
        linewidth=1.35,
        linestyle=(0, (3, 2)),
        label="hard monotone",
        zorder=4,
    )
    fit_axis.set_title("Kernel regression path", fontsize=10.5, pad=8)
    fit_axis.set_xlabel(r"input $x$")
    fit_axis.set_ylabel(r"prediction $T(x)$")
    fit_axis.legend(
        frameon=False,
        fontsize=7.4,
        ncol=2,
        loc="upper left",
        handlelength=2.0,
        columnspacing=0.9,
    )

    numerical_zero = 1e-7
    positive_gap = np.maximum(path.gaps, numerical_zero)
    displayed_gammas = path.gammas + 1.0
    gap_axis.plot(displayed_gammas, positive_gap, color=VIOLET, linewidth=2.2)
    gap_axis.scatter(displayed_gammas, positive_gap, color=VIOLET, s=18, zorder=3)
    gap_axis.axhline(
        numerical_zero, color=GRAY, linewidth=1.0, linestyle=(0, (3, 2))
    )
    gap_axis.set_xscale("log")
    gap_axis.set_xticks([1.0, 2.0, 11.0, 101.0], ["0", "1", "10", "100"])
    gap_axis.set_yscale("log")
    gap_axis.set_title("Order violations vanish", fontsize=10.5, pad=8)
    gap_axis.set_xlabel(r"penalty weight $\gamma$")
    gap_axis.set_ylabel("quadratic Monge gap")

    error_axis.plot(displayed_gammas, path.errors, color=ORANGE, linewidth=2.2)
    error_axis.scatter(displayed_gammas, path.errors, color=ORANGE, s=18, zorder=3)
    error_axis.axhline(
        path.hard_error,
        color="#1F2428",
        linewidth=1.2,
        linestyle=(0, (3, 2)),
    )
    error_axis.set_xscale("log")
    error_axis.set_xticks([1.0, 2.0, 11.0, 101.0], ["0", "1", "10", "100"])
    error_axis.set_title("Fit--monotonicity tradeoff", fontsize=10.5, pad=8)
    error_axis.set_xlabel(r"penalty weight $\gamma$")
    error_axis.set_ylabel("empirical squared error")
    error_axis.text(
        1.25,
        path.hard_error - 0.007,
        "hard monotone",
        color="#1F2428",
        fontsize=7.5,
        ha="left",
        va="top",
    )

    for axis in axes:
        axis.set_facecolor("white")
        style_axis(axis)

    output_directory.mkdir(parents=True, exist_ok=True)
    figure.savefig(
        output_directory / "kernel_monge_regression.pdf",
        bbox_inches="tight",
        pad_inches=0.04,
        facecolor="white",
        transparent=False,
    )
    figure.savefig(
        output_directory / "kernel_monge_regression.png",
        dpi=220,
        bbox_inches="tight",
        pad_inches=0.04,
        facecolor="white",
        transparent=False,
    )
    plt.close(figure)


def main() -> None:
    """Generate the deterministic regression experiment and its figure."""

    random_generator = np.random.default_rng(17)
    sample_count = 55
    x = np.linspace(-2.5, 2.5, sample_count)
    smooth_signal = 0.5 * x + 1.05 * np.sin(2.15 * x)
    observations = smooth_signal + 0.16 * random_generator.normal(size=sample_count)

    gram = gaussian_gram(x, bandwidth=0.62, nugget=1e-3)
    gammas = np.array(
        [0.0, 1.0, 3.0, 10.0, 20.0, 30.0, 45.0, 60.0, 80.0, 100.0, 125.0, 150.0]
    )
    path = solve_path(x, observations, gram, ridge=0.08, gammas=gammas)
    render_figure(x, observations, path, Path(__file__).resolve().parent)

    endpoint_difference = np.max(np.abs(path.fits[-1] - path.hard_fit))
    print(f"Final Monge gap: {path.gaps[-1]:.3e}")
    print(f"Distance to hard-monotone fit: {endpoint_difference:.3e}")


if __name__ == "__main__":
    main()
