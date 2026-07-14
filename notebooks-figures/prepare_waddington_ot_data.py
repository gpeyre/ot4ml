"""Prepare the compact Waddington-OT asset used by the Kantorovich figure.

The official tutorial archives are several gigabytes. This script relies on
HTTP byte ranges to extract only the official force-layout embedding and one
consecutive transport map. It then stores the two-dimensional display
coordinates and deterministic farthest-point display subsets in a small NPZ
file consumed by the Kantorovich Waddington-OT notebook.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import shutil
import tempfile
import zipfile

import anndata as ad
import fsspec
import numpy as np


DATA_ARCHIVE = (
    "https://drive.usercontent.google.com/download"
    "?id=1E494DhIx5RLy0qv_6eWa9426Bfmq28po&export=download&confirm=t"
)
TRANSPORT_ARCHIVE = (
    "https://drive.usercontent.google.com/download"
    "?id=1DiUObEYx5MafOfKcDDpuavvOKMyO4fmk&export=download&confirm=t"
)
FLE_MEMBER = "data/fle_coords.txt"
TRANSPORT_MEMBER = "tmaps/serum_10.0_10.5.h5ad"
RANDOM_SEED = 2026


def extract_zip_member(url: str, member: str, target: Path) -> None:
    """Extract one remote ZIP member through HTTP byte-range requests.

    Args:
        url: Direct URL of the remote ZIP archive.
        member: Archive-relative path of the requested member.
        target: Local output path.
    """
    if target.exists():
        return
    target.parent.mkdir(parents=True, exist_ok=True)
    with fsspec.open(
        url,
        mode="rb",
        block_size=4 * 2**20,
        cache_type="readahead",
    ) as remote_file:
        with zipfile.ZipFile(remote_file) as archive:
            with archive.open(member) as source, target.open("wb") as destination:
                shutil.copyfileobj(source, destination, length=4 * 2**20)


def farthest_point_indices(
    points: np.ndarray,
    n_samples: int,
    *,
    start_index: int | None = None,
) -> np.ndarray:
    """Return a deterministic Euclidean farthest-point subset.

    Args:
        points: Candidate coordinates with shape ``(n_points, dimension)``.
        n_samples: Number of distinct indices to select.
        start_index: Optional first selected index. The default is the point
            nearest the candidate centroid.

    Returns:
        Selected integer indices in greedy order.

    Raises:
        ValueError: If ``points`` or ``n_samples`` is invalid.
    """
    points = np.asarray(points, dtype=float)
    if points.ndim != 2 or len(points) == 0:
        raise ValueError("points must be a nonempty two-dimensional array")
    if not 1 <= n_samples <= len(points):
        raise ValueError("n_samples must lie between one and the point count")

    standardized = (points - points.mean(axis=0)) / (
        points.std(axis=0) + np.finfo(float).eps
    )
    if start_index is None:
        start_index = int(np.argmin(np.sum(standardized**2, axis=1)))
    if not 0 <= start_index < len(points):
        raise ValueError("start_index is outside the candidate array")

    selected = np.empty(n_samples, dtype=np.int64)
    selected[0] = start_index
    minimum_squared_distance = np.sum(
        (standardized - standardized[start_index]) ** 2,
        axis=1,
    )
    for sample_index in range(1, n_samples):
        selected[sample_index] = int(np.argmax(minimum_squared_distance))
        squared_distance = np.sum(
            (standardized - standardized[selected[sample_index]]) ** 2,
            axis=1,
        )
        np.minimum(
            minimum_squared_distance,
            squared_distance,
            out=minimum_squared_distance,
        )
    return selected


def official_force_layout_coordinates(
    embedding_path: Path,
    source_ids: np.ndarray,
    target_ids: np.ndarray,
) -> tuple[np.ndarray, np.ndarray]:
    """Load the official two-dimensional force-layout coordinates.

    Args:
        embedding_path: Official Waddington-OT force-layout coordinate table.
        source_ids: Cell identifiers for the first snapshot.
        target_ids: Cell identifiers for the second snapshot.

    Returns:
        Source and target coordinates in the shared force-layout embedding.

    Raises:
        KeyError: If a transport-map cell is absent from the embedding table.
    """
    table = np.genfromtxt(
        embedding_path,
        delimiter="\t",
        names=True,
        dtype=None,
        encoding="utf-8",
    )
    coordinates = {
        cell_id: np.array([x, y], dtype=np.float32)
        for cell_id, x, y in zip(table["id"], table["x"], table["y"])
    }
    missing = [
        cell_id
        for cell_id in np.concatenate([source_ids, target_ids])
        if cell_id not in coordinates
    ]
    if missing:
        raise KeyError(
            "{} transport-map cells are missing from the official "
            "force-layout embedding".format(len(missing))
        )
    source = np.stack([coordinates[cell_id] for cell_id in source_ids])
    target = np.stack([coordinates[cell_id] for cell_id in target_ids])
    return source, target


def sample_representative_plan_atoms(
    plan: np.ndarray,
    source: np.ndarray,
    target: np.ndarray,
    *,
    n_candidates: int = 12_000,
    n_display: int = 650,
) -> tuple[np.ndarray, np.ndarray]:
    """Sample plan atoms by mass and thin them in joint endpoint space.

    Args:
        plan: Nonnegative Waddington-OT transport matrix.
        source: Source display coordinates.
        target: Target display coordinates.
        n_candidates: Number of mass-weighted candidate pairs.
        n_display: Number of representative trajectories retained by FPS.

    Returns:
        Source and target indices of the retained plan atoms.
    """
    normalized_plan = np.maximum(np.asarray(plan, dtype=float), 0.0)
    normalized_plan /= normalized_plan.sum()
    random = np.random.default_rng(RANDOM_SEED)
    flat_samples = random.choice(
        normalized_plan.size,
        size=n_candidates,
        replace=True,
        p=normalized_plan.ravel(),
    )
    unique_samples, multiplicities = np.unique(flat_samples, return_counts=True)
    source_indices, target_indices = np.unravel_index(
        unique_samples,
        normalized_plan.shape,
    )
    joint_coordinates = np.column_stack(
        [source[source_indices], target[target_indices]]
    )
    retained = farthest_point_indices(
        joint_coordinates,
        min(n_display, len(joint_coordinates)),
        start_index=int(np.argmax(multiplicities)),
    )
    return source_indices[retained], target_indices[retained]


def select_high_mass_segments(
    plan: np.ndarray,
    source: np.ndarray,
    target: np.ndarray,
    *,
    n_candidates: int = 5_000,
    n_segments: int = 44,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Select well-spread segments among the largest coupling entries.

    Args:
        plan: Nonnegative Waddington-OT transport matrix.
        source: Source display coordinates.
        target: Target display coordinates.
        n_candidates: Number of largest plan entries considered.
        n_segments: Number of segments retained for the coupling panel.

    Returns:
        Source indices, target indices, and normalized segment masses.
    """
    plan = np.maximum(np.asarray(plan, dtype=float), 0.0)
    candidate_count = min(n_candidates, plan.size)
    flat_candidates = np.argpartition(plan.ravel(), -candidate_count)[
        -candidate_count:
    ]
    source_indices, target_indices = np.unravel_index(
        flat_candidates,
        plan.shape,
    )
    endpoints = np.column_stack(
        [source[source_indices], target[target_indices]]
    )
    first = int(np.argmax(plan.ravel()[flat_candidates]))
    retained = farthest_point_indices(
        endpoints,
        min(n_segments, candidate_count),
        start_index=first,
    )
    masses = plan[source_indices[retained], target_indices[retained]]
    masses /= masses.max()
    return source_indices[retained], target_indices[retained], masses


def prepare_asset(cache_dir: Path, output_path: Path) -> None:
    """Build and save the reduced plotting asset.

    Args:
        cache_dir: Directory used for the two extracted official files.
        output_path: Destination NPZ path.
    """
    embedding_path = cache_dir / Path(FLE_MEMBER).name
    transport_path = cache_dir / Path(TRANSPORT_MEMBER).name
    extract_zip_member(DATA_ARCHIVE, FLE_MEMBER, embedding_path)
    extract_zip_member(TRANSPORT_ARCHIVE, TRANSPORT_MEMBER, transport_path)

    transport = ad.read_h5ad(transport_path)
    source_ids = np.asarray(transport.obs_names)
    target_ids = np.asarray(transport.var_names)
    source, target = official_force_layout_coordinates(
        embedding_path,
        source_ids,
        target_ids,
    )
    plan = np.asarray(transport.X, dtype=float)

    source_display = farthest_point_indices(source, min(500, len(source)))
    target_display = farthest_point_indices(target, min(500, len(target)))
    pair_source, pair_target = sample_representative_plan_atoms(
        plan,
        source,
        target,
    )
    segment_source, segment_target, segment_mass = select_high_mass_segments(
        plan,
        source,
        target,
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        output_path,
        source=source.astype(np.float32),
        target=target.astype(np.float32),
        source_display=source_display.astype(np.int32),
        target_display=target_display.astype(np.int32),
        pair_source=pair_source.astype(np.int32),
        pair_target=pair_target.astype(np.int32),
        segment_source=segment_source.astype(np.int32),
        segment_target=segment_target.astype(np.int32),
        segment_mass=segment_mass.astype(np.float32),
        source_day=np.float32(10.0),
        target_day=np.float32(10.5),
    )


def parse_arguments() -> argparse.Namespace:
    """Parse command-line arguments for the data-preparation utility."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--cache-dir",
        type=Path,
        default=None,
        help=(
            "directory for extracted official files; by default a temporary "
            "directory is deleted after the compact asset is written"
        ),
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=(
            Path(__file__).resolve().parent
            / "assets"
            / "waddington_ot_day10_day10_5.npz"
        ),
        help="output NPZ asset",
    )
    return parser.parse_args()


if __name__ == "__main__":
    arguments = parse_arguments()
    if arguments.cache_dir is not None:
        prepare_asset(arguments.cache_dir, arguments.output)
    else:
        # The source expression and transport archives are large. Keep only the
        # compact, anonymized plotting asset once extraction has completed.
        with tempfile.TemporaryDirectory(prefix="ot4ml-waddington-ot-") as cache:
            prepare_asset(Path(cache), arguments.output)
