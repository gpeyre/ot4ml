#!/usr/bin/env python3
"""Build a minimal, self-contained arXiv source package for OT4ML."""

from __future__ import annotations

import argparse
import re
import shutil
import tarfile
import tempfile
from pathlib import Path


INPUT_RE = re.compile(r"\\input\{([^}]+)\}")
FIGURE_RE = re.compile(r"figures/[^\s{}]+?\.(?:pdf|png|jpe?g)", re.IGNORECASE)


def read_text(path: Path) -> str:
    """Read a LaTeX source using the book's ISO-8859-1 encoding."""
    return path.read_text(encoding="latin-1")


def flatten_figure(path: str) -> str:
    """Map a nested figure path to the flat namespace used by the archive."""
    figure = Path(path)
    if figure.parts[0] != "figures":
        raise ValueError(f"Figure is outside figures/: {path}")
    return "figures/" + "--".join(figure.parts[1:])


def collect_sources(book: Path) -> list[Path]:
    """Recursively collect files included from the main LaTeX source."""
    pending = [Path("OT4ML.tex")]
    sources: list[Path] = []
    seen: set[Path] = set()
    while pending:
        relative = pending.pop()
        if relative in seen:
            continue
        source = book / relative
        if not source.is_file():
            raise FileNotFoundError(source)
        seen.add(relative)
        sources.append(relative)
        for included in INPUT_RE.findall(read_text(source)):
            child = Path(included)
            if child.suffix == "":
                child = child.with_suffix(".tex")
            pending.append(child)
    return sorted(sources)


def build_package(book: Path, destination: Path) -> tuple[int, int]:
    """Copy current sources and their exact figure dependency closure."""
    sources = collect_sources(book)
    support = [
        Path("mystyle.sty"),
        Path("notations_ot.sty"),
        Path("all.bib"),
        Path("OT4ML.bbl"),
        Path("OT4ML.ind"),
        Path("ot4ml.ist"),
    ]
    for relative in support:
        if not (book / relative).is_file():
            raise FileNotFoundError(book / relative)

    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True)

    copied_figures: dict[str, str] = {}
    for relative in sources:
        text = read_text(book / relative)

        def replace_graphic(match: re.Match[str]) -> str:
            original = match.group(0)
            flattened = flatten_figure(original)
            previous = copied_figures.get(flattened)
            if previous is not None and previous != original:
                raise ValueError(
                    f"Flattened figure collision: {previous} and {original}"
                )
            source_figure = book / original
            if not source_figure.is_file():
                raise FileNotFoundError(source_figure)
            copied_figures[flattened] = original
            return flattened

        packaged_text = FIGURE_RE.sub(replace_graphic, text)
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(packaged_text, encoding="latin-1")

    for relative in support:
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(book / relative, target)

    for flattened, original in sorted(copied_figures.items()):
        target = destination / flattened
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(book / original, target)

    return len(sources), len(copied_figures)


def write_archive(source: Path, archive: Path) -> None:
    """Create a gzip-compressed tar archive with the main file at its root."""
    archive.parent.mkdir(parents=True, exist_ok=True)
    if archive.exists():
        archive.unlink()
    with tarfile.open(archive, "w:gz", compresslevel=9) as output:
        for path in sorted(source.rglob("*")):
            if path.is_file():
                output.add(path, arcname=path.relative_to(source), recursive=False)


def main() -> None:
    """Build the source tree atomically and create its upload archive."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--book", type=Path, default=Path("OT4ML"))
    parser.add_argument("--output", type=Path, default=Path("arxiv"))
    parser.add_argument(
        "--archive", type=Path, default=Path("arxiv/ot4ml-arxiv-source.tar.gz")
    )
    args = parser.parse_args()

    book = args.book.resolve()
    output = args.output.resolve()
    archive = args.archive.resolve()
    with tempfile.TemporaryDirectory(prefix="ot4ml-arxiv-") as temp:
        staged = Path(temp) / "source"
        source_count, figure_count = build_package(book, staged)
        if output.exists():
            shutil.rmtree(output)
        shutil.copytree(staged, output)
        write_archive(staged, archive)

    size_mb = archive.stat().st_size / (1024 * 1024)
    print(
        f"Packaged {source_count} LaTeX sources and {figure_count} figures "
        f"into {archive} ({size_mb:.1f} MiB)."
    )


if __name__ == "__main__":
    main()
