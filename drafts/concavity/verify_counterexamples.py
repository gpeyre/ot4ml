"""Verify the finite formulas in the conditional-concavity note.

The script evaluates the GW curvature quadratic form directly, without an OT
solver. It checks both counterexamples from Theorem 2.1 and the sign predicted
for ultrametric inputs by Corollary 3.5. It only depends on NumPy.
"""

from __future__ import annotations

import numpy as np
from numpy.typing import NDArray


def gw_curvature(
    source_distances: NDArray[np.float64],
    target_distances: NDArray[np.float64],
    direction: NDArray[np.float64],
    exponent: float,
) -> float:
    """Evaluate the GW quadratic form along a zero-marginal direction.

    Parameters
    ----------
    source_distances, target_distances
        Pairwise dissimilarity matrices on the source and target spaces.
    direction
        Matrix whose row and column sums vanish.
    exponent
        Outer distortion exponent ``p`` in ``|d_X-d_Y|**p``.

    Returns
    -------
    float
        Value of the curvature quadratic form ``Q_p(direction)``.

    Raises
    ------
    ValueError
        If the direction does not have the required shape or zero marginals.
    """

    expected_shape = (source_distances.shape[0], target_distances.shape[0])
    if direction.shape != expected_shape:
        raise ValueError(f"direction must have shape {expected_shape}")
    if not (
        np.allclose(direction.sum(axis=0), 0.0)
        and np.allclose(direction.sum(axis=1), 0.0)
    ):
        raise ValueError("direction must have zero row and column sums")

    loss = np.abs(
        source_distances[:, None, :, None]
        - target_distances[None, :, None, :]
    ) ** exponent
    return float(np.einsum("ij,ijkl,kl->", direction, loss, direction))


def main() -> None:
    """Check the counterexamples and a finite ultrametric instance."""

    path_metric = np.array(
        [
            [0.0, 3.0, 2.0, 1.0],
            [3.0, 0.0, 1.0, 2.0],
            [2.0, 1.0, 0.0, 1.0],
            [1.0, 2.0, 1.0, 0.0],
        ]
    )
    square_metric = np.array(
        [
            [0.0, 2.0, 1.0, 1.0],
            [2.0, 0.0, 1.0, 1.0],
            [1.0, 1.0, 0.0, 2.0],
            [1.0, 1.0, 2.0, 0.0],
        ]
    )
    star_metric = np.array(
        [
            [0.0, 2.0, 2.0, 1.0],
            [2.0, 0.0, 2.0, 1.0],
            [2.0, 2.0, 0.0, 1.0],
            [1.0, 1.0, 1.0, 0.0],
        ]
    )
    target_direction = np.array([1.0, 1.0, -1.0, -1.0])

    p_small = 1.5
    source_direction_small = np.array([1.0, -1.0, -1.0, 1.0])
    direction_small = np.outer(source_direction_small, target_direction)
    value_small = gw_curvature(
        path_metric, square_metric, direction_small, exponent=p_small
    )
    expected_small = 8.0 * (2.0 ** (p_small + 1.0) - 3.0**p_small + 1.0)
    assert np.isclose(value_small, expected_small) and value_small > 0.0

    p_large = 3.0
    source_direction_large = np.array([1.0, 0.0, 0.0, -1.0])
    direction_large = np.outer(source_direction_large, target_direction)
    value_large = gw_curvature(
        star_metric, square_metric, direction_large, exponent=p_large
    )
    expected_large = 8.0 * (2.0**p_large - 4.0)
    assert np.isclose(value_large, expected_large) and value_large > 0.0

    source_ultrametric = np.array(
        [
            [0.0, 1.0, 3.0, 3.0],
            [1.0, 0.0, 3.0, 3.0],
            [3.0, 3.0, 0.0, 2.0],
            [3.0, 3.0, 2.0, 0.0],
        ]
    )
    target_ultrametric = np.array(
        [
            [0.0, 2.0, 4.0, 4.0],
            [2.0, 0.0, 4.0, 4.0],
            [4.0, 4.0, 0.0, 1.0],
            [4.0, 4.0, 1.0, 0.0],
        ]
    )
    rng = np.random.default_rng(7)
    largest_ultrametric_curvature = -np.inf
    for exponent in (1.0, 1.5, 2.0, 3.0, 5.0):
        for _ in range(100):
            direction = rng.normal(size=(4, 4))
            direction -= direction.mean(axis=1, keepdims=True)
            direction -= direction.mean(axis=0, keepdims=True)
            direction += direction.mean()
            value = gw_curvature(
                source_ultrametric,
                target_ultrametric,
                direction,
                exponent=exponent,
            )
            largest_ultrametric_curvature = max(
                largest_ultrametric_curvature, value
            )
            assert value <= 1e-10

    print(f"p={p_small:g} metric counterexample: Q={value_small:.6g}")
    print(f"p={p_large:g} metric counterexample:   Q={value_large:.6g}")
    print(
        "ultrametric sign check:             "
        f"max Q={largest_ultrametric_curvature:.6g}"
    )


if __name__ == "__main__":
    main()
