"""Prepare the compact Waddington-OT time-course asset used by Figure 4.2.

The official data archive is large. This utility extracts only the released
force-layout coordinates and cell-day table through HTTP byte-range requests,
then retains a reproducible background sample and three complete snapshots.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import shutil
import tempfile
import zipfile

import numpy as np


DATA_ARCHIVE = (
    "https://drive.usercontent.google.com/download"
    "?id=1E494DhIx5RLy0qv_6eWa9426Bfmq28po&export=download&confirm=t"
)
FLE_MEMBER = "data/fle_coords.txt"
CELL_DAYS_MEMBER = "data/cell_days.txt"
SNAPSHOT_DAYS = np.array([0.0, 9.0, 18.0], dtype=np.float32)
RANDOM_SEED = 2026


def extract_zip_member(url: str, member: str, target: Path) -> None:
    """Extract one member of a remote ZIP archive.

    Args:
        url: Direct URL of the remote archive.
        member: Archive-relative path of the requested file.
        target: Local destination of the extracted member.
    """
    if target.exists():
        return
    try:
        import fsspec
    except ImportError as error:
        raise RuntimeError(
            "Remote extraction requires fsspec; install it with "
            "`python -m pip install fsspec`."
        ) from error
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


def load_time_labeled_coordinates(
    embedding_path: Path,
    cell_days_path: Path,
) -> tuple[np.ndarray, np.ndarray]:
    """Join official force-layout coordinates with collection times.

    Args:
        embedding_path: Tab-separated table with fields ``id``, ``x`` and ``y``.
        cell_days_path: Tab-separated table with fields ``id`` and ``day``.

    Returns:
        Coordinates of shape ``(n_cells, 2)`` and the corresponding day vector.
    """
    embedding = np.genfromtxt(
        embedding_path,
        delimiter="\t",
        names=True,
        dtype=None,
        encoding="utf-8",
    )
    cell_days = np.genfromtxt(
        cell_days_path,
        delimiter="\t",
        names=True,
        dtype=None,
        encoding="utf-8",
    )
    if len(cell_days["id"]) != len(cell_days["day"]):
        raise ValueError("cell-day identifiers and values have inconsistent lengths")
    day_by_id = dict(zip(cell_days["id"], cell_days["day"]))
    available = np.fromiter(
        (cell_id in day_by_id for cell_id in embedding["id"]),
        dtype=bool,
        count=len(embedding),
    )
    identifiers = embedding["id"][available]
    coordinates = np.column_stack(
        [embedding["x"][available], embedding["y"][available]]
    ).astype(np.float32)
    days = np.fromiter(
        (day_by_id[cell_id] for cell_id in identifiers),
        dtype=np.float32,
        count=len(identifiers),
    )
    return coordinates, days


def compact_time_course(
    coordinates: np.ndarray,
    days: np.ndarray,
    *,
    snapshot_days: np.ndarray = SNAPSHOT_DAYS,
    n_background: int = 40_000,
) -> dict[str, np.ndarray]:
    """Select a compact global sample and complete requested snapshots.

    Args:
        coordinates: Force-layout coordinates of shape ``(n_cells, 2)``.
        days: Collection day associated with each coordinate.
        snapshot_days: Days retained in full for the temporal panels.
        n_background: Number of cells sampled for the aggregate landscape.

    Returns:
        Arrays ready to store in the compact plotting asset.

    Raises:
        ValueError: If coordinates and days disagree or a snapshot is empty.
    """
    if coordinates.ndim != 2 or coordinates.shape[1] != 2:
        raise ValueError("coordinates must have shape (n_cells, 2)")
    if days.shape != (len(coordinates),):
        raise ValueError("days must contain one value per coordinate")

    random = np.random.default_rng(RANDOM_SEED)
    background_indices = random.choice(
        len(coordinates),
        size=min(n_background, len(coordinates)),
        replace=False,
    )
    result = {
        "background": coordinates[background_indices].astype(np.float32),
        "background_day": days[background_indices].astype(np.float32),
        "snapshot_days": np.asarray(snapshot_days, dtype=np.float32),
    }
    for index, day in enumerate(snapshot_days):
        snapshot = coordinates[np.isclose(days, day)]
        if len(snapshot) == 0:
            raise ValueError(f"no cells found at day {float(day):g}")
        result[f"snapshot_{index}"] = snapshot.astype(np.float32)
    return result


def prepare_asset(cache_dir: Path, output_path: Path) -> None:
    """Create the compact, time-labeled plotting asset.

    Args:
        cache_dir: Directory for the two temporarily extracted official files.
        output_path: Destination compressed NumPy archive.
    """
    embedding_path = cache_dir / Path(FLE_MEMBER).name
    cell_days_path = cache_dir / Path(CELL_DAYS_MEMBER).name
    extract_zip_member(DATA_ARCHIVE, FLE_MEMBER, embedding_path)
    extract_zip_member(DATA_ARCHIVE, CELL_DAYS_MEMBER, cell_days_path)
    coordinates, days = load_time_labeled_coordinates(
        embedding_path,
        cell_days_path,
    )
    result = compact_time_course(coordinates, days)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(output_path, **result)


def parse_arguments() -> argparse.Namespace:
    """Parse command-line options."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--cache-dir",
        type=Path,
        default=None,
        help=(
            "directory containing or receiving the two official text files; "
            "a temporary directory is used by default"
        ),
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=(
            Path(__file__).resolve().parent
            / "assets"
            / "waddington_ot_snapshots.npz"
        ),
        help="output NPZ asset",
    )
    return parser.parse_args()


if __name__ == "__main__":
    arguments = parse_arguments()
    if arguments.cache_dir is not None:
        prepare_asset(arguments.cache_dir, arguments.output)
    else:
        with tempfile.TemporaryDirectory(prefix="ot4ml-waddington-ot-") as cache:
            prepare_asset(Path(cache), arguments.output)
