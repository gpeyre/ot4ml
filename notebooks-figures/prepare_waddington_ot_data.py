"""Prepare the compact Waddington-OT asset used by the Kantorovich figure.

The official tutorial archives are several gigabytes. This script relies on
HTTP byte ranges to extract only the official force-layout embedding and one
consecutive transport map. It then stores the two-dimensional display
coordinates and paper-style ancestor/descendant summaries in a small NPZ file
consumed by the Kantorovich Waddington-OT notebook.
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


def official_force_layout_coordinates(
    embedding_path: Path,
    source_ids: np.ndarray,
    target_ids: np.ndarray,
    *,
    n_background: int = 20_000,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Load the official two-dimensional force-layout coordinates.

    Args:
        embedding_path: Official Waddington-OT force-layout coordinate table.
        source_ids: Cell identifiers for the first snapshot.
        target_ids: Cell identifiers for the second snapshot.

    Returns:
        Source coordinates, target coordinates, and a density-preserving random
        subset of the complete force-layout background.

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
    all_coordinates = np.column_stack([table["x"], table["y"]]).astype(np.float32)
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
    random = np.random.default_rng(RANDOM_SEED)
    background_indices = random.choice(
        len(all_coordinates),
        size=min(n_background, len(all_coordinates)),
        replace=False,
    )
    return source, target, all_coordinates[background_indices]


def farthest_point_indices(points: np.ndarray, n_samples: int) -> np.ndarray:
    """Return a deterministic farthest-point subset of planar coordinates.

    Args:
        points: Nonempty coordinate array of shape ``(n_points, 2)``.
        n_samples: Number of distinct indices to retain.

    Returns:
        Selected integer indices in greedy order.
    """
    if points.ndim != 2 or points.shape[1] != 2 or len(points) == 0:
        raise ValueError("points must have shape (n_points, 2)")
    n_samples = min(int(n_samples), len(points))
    selected = np.empty(n_samples, dtype=np.int64)
    selected[0] = int(np.argmin(np.sum((points - 0.5) ** 2, axis=1)))
    minimum_squared_distance = np.sum(
        (points - points[selected[0]]) ** 2,
        axis=1,
    )
    for sample_index in range(1, n_samples):
        selected[sample_index] = int(np.argmax(minimum_squared_distance))
        squared_distance = np.sum(
            (points - points[selected[sample_index]]) ** 2,
            axis=1,
        )
        np.minimum(minimum_squared_distance, squared_distance, out=minimum_squared_distance)
    return selected


def nearest_indices(
    points: np.ndarray,
    candidates: np.ndarray,
    anchor: np.ndarray,
    n_samples: int,
) -> np.ndarray:
    """Select candidate points nearest a prescribed anchor.

    Args:
        points: Full coordinate array of shape ``(n_points, 2)``.
        candidates: Integer indices eligible for selection.
        anchor: Two-dimensional anchor in the same coordinate system.
        n_samples: Maximum number of selected points.

    Returns:
        Selected integer indices ordered by increasing distance to ``anchor``.
    """
    squared_distances = np.sum((points[candidates] - anchor) ** 2, axis=1)
    order = np.argsort(squared_distances)
    return candidates[order[: min(n_samples, len(candidates))]]


def select_target_regions(
    plan: np.ndarray,
    target: np.ndarray,
    *,
    n_per_region: int = 45,
    n_candidate_regions: int = 40,
    minimum_separation: float = 0.10,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Select separated target regions with appreciable shared ancestry.

    Args:
        plan: Nonnegative source-by-target Waddington-OT matrix.
        target: Target force-layout coordinates of shape ``(m, 2)``.
        n_per_region: Number of cells retained around each candidate center.
        n_candidate_regions: Number of well-spread candidate centers.
        minimum_separation: Minimum normalized separation between centers.

    Returns:
        Integer indices of the two regions and their normalized pulled-back
        ancestor distributions on the source snapshot.
    """
    lower = np.quantile(target, 0.02, axis=0)
    upper = np.quantile(target, 0.98, axis=0)
    normalized = (target - lower) / np.maximum(upper - lower, 1e-12)
    interior = np.flatnonzero(np.all((normalized >= 0.0) & (normalized <= 1.0), axis=1))
    anchor_local = farthest_point_indices(
        normalized[interior],
        n_candidate_regions,
    )
    anchors = interior[anchor_local]

    regions = []
    ancestors = []
    centers = []
    all_indices = np.arange(len(target))
    for anchor_index in anchors:
        region = nearest_indices(
            normalized,
            all_indices,
            normalized[anchor_index],
            n_per_region,
        )
        regions.append(region)
        ancestors.append(normalize_mass(plan[:, region].sum(axis=1)))
        centers.append(normalized[region].mean(axis=0))

    best_score = -np.inf
    best_pair = None
    for first in range(len(regions)):
        for second in range(first + 1, len(regions)):
            separation = float(np.linalg.norm(centers[first] - centers[second]))
            if separation < minimum_separation:
                continue
            affinity = float(np.sum(np.sqrt(ancestors[first] * ancestors[second])))
            score = affinity * np.sqrt(separation)
            if score > best_score:
                best_score = score
                best_pair = (first, second)
    if best_pair is None:
        raise ValueError("no separated target-region pair was found")
    first, second = best_pair
    return regions[first], regions[second], ancestors[first], ancestors[second]


def normalize_mass(values: np.ndarray) -> np.ndarray:
    """Normalize a nonnegative mass vector to unit total mass."""
    values = np.maximum(np.asarray(values, dtype=float), 0.0)
    total = float(values.sum())
    if total <= 0.0:
        raise ValueError("Waddington-OT summary has zero transported mass")
    return values / total


def paper_style_transport_summaries(
    plan: np.ndarray,
    source: np.ndarray,
    target: np.ndarray,
    *,
    n_source_seed: int = 55,
) -> dict[str, np.ndarray]:
    """Compute descendant, ancestor, and shared-ancestry summaries.

    The construction follows the push-forward and pull-back visualizations in
    Schiebinger et al. rather than drawing line segments in the display plane.

    Args:
        plan: Nonnegative source-by-target Waddington-OT matrix.
        source: Source force-layout coordinates.
        target: Target force-layout coordinates.
        n_source_seed: Number of source cells in the descendant seed set.

    Returns:
        Target branch sets, a compact shared-ancestor source set, descendant
        masses on the target, and ancestor masses on the source.
    """
    plan = np.maximum(np.asarray(plan, dtype=float), 0.0)
    target_a, target_b, ancestor_a, ancestor_b = select_target_regions(plan, target)

    # Cells carrying mass toward both regions form a compact common-ancestor seed.
    overlap = np.sqrt(ancestor_a * ancestor_b)
    robust_scale = np.quantile(source, 0.95, axis=0) - np.quantile(
        source, 0.05, axis=0
    )
    source_scaled = source / np.maximum(robust_scale, 1e-12)
    overlap_center = np.average(source_scaled, axis=0, weights=overlap)
    squared_distance = np.sum((source_scaled - overlap_center) ** 2, axis=1)
    score = overlap / (0.08 + squared_distance)
    source_seed = np.argsort(score)[-min(n_source_seed, len(source)) :]
    descendant = normalize_mass(plan[source_seed].sum(axis=0))
    return {
        "source_seed": source_seed,
        "target_a": target_a,
        "target_b": target_b,
        "descendant_mass": descendant,
        "ancestor_a_mass": ancestor_a,
        "ancestor_b_mass": ancestor_b,
    }


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
    source, target, background = official_force_layout_coordinates(
        embedding_path,
        source_ids,
        target_ids,
    )
    plan = np.asarray(transport.X, dtype=float)
    summaries = paper_style_transport_summaries(plan, source, target)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        output_path,
        background=background.astype(np.float32),
        source=source.astype(np.float32),
        target=target.astype(np.float32),
        source_seed=summaries["source_seed"].astype(np.int32),
        target_a=summaries["target_a"].astype(np.int32),
        target_b=summaries["target_b"].astype(np.int32),
        descendant_mass=summaries["descendant_mass"].astype(np.float32),
        ancestor_a_mass=summaries["ancestor_a_mass"].astype(np.float32),
        ancestor_b_mass=summaries["ancestor_b_mass"].astype(np.float32),
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
