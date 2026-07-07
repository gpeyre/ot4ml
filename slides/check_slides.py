#!/usr/bin/env python3
"""Source-level validation for the OT4ML Quarto slide decks.

The check is intentionally lightweight: it verifies that each deck has a
front matter block, balanced HTML div tags, five active roadmap slides, and no
missing local image or HTML links. It does not replace `quarto render`.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent
DECKS = [
    "1-monge-kantorovich",
    "2-entropic-regularization",
    "3-dual-semidiscrete",
    "4-dynamic-flows",
]


def local_references(text: str) -> list[str]:
    """Return local image and hyperlink targets referenced by a QMD file."""
    image_refs = [
        a or b
        for a, b in re.findall(r'src="([^"]+)"|!\[[^\]]*\]\(([^)]+)\)', text)
    ]
    href_refs = re.findall(r'href="([^"]+)"', text)
    return image_refs + href_refs


def image_tags_missing_alt(text: str) -> list[int]:
    """Return line numbers of HTML image tags without an alt attribute."""
    missing: list[int] = []
    for match in re.finditer(r"<img\s+([^>]+)>", text):
        attrs = match.group(1)
        if not re.search(r"\salt=", f" {attrs}"):
            missing.append(text.count("\n", 0, match.start()) + 1)
    return missing


def algorithm_boxes_missing_io(text: str) -> list[int]:
    """Return line numbers of algorithm boxes missing input or output fields."""
    missing: list[int] = []
    pattern = re.compile(r":::\s*\{\.algorithm-box\}(.*?):::", re.DOTALL)
    for match in pattern.finditer(text):
        block = match.group(1)
        if "Input:" not in block or "Output:" not in block:
            missing.append(text.count("\n", 0, match.start()) + 1)
    return missing


def should_check_reference(ref: str) -> bool:
    """Decide whether a reference should resolve on disk."""
    if ref.startswith(("http://", "https://", "mailto:", "#")):
        return False
    ref = urlsplit(ref).path
    return (
        ref.endswith(".html")
        or ref.startswith(("assets", "../", "../../"))
        or "/" in ref
    )


def resolve_reference(deck_dir: Path, ref: str) -> Path:
    """Resolve a QMD-local reference to an absolute filesystem path."""
    ref = urlsplit(ref).path
    if ref.startswith(("../", "../../")):
        return (deck_dir / ref).resolve()
    return deck_dir / ref


def check_deck(deck: str) -> list[str]:
    """Return validation errors for one deck."""
    errors: list[str] = []
    deck_dir = ROOT / deck
    qmd = deck_dir / "index.qmd"
    if not qmd.exists():
        return [f"{deck}: missing index.qmd"]

    text = qmd.read_text()
    for index, char in enumerate(text):
        if ord(char) < 32 and char not in "\n\t\r":
            line = text.count("\n", 0, index) + 1
            errors.append(f"{deck}: hidden control character U+{ord(char):04X} on line {line}")

    if not text.startswith("---\n") or "\n---\n" not in text[4:]:
        errors.append(f"{deck}: missing YAML front matter")

    open_divs = text.count("<div")
    close_divs = text.count("</div>")
    if open_divs != close_divs:
        errors.append(f"{deck}: unbalanced div tags {open_divs}/{close_divs}")

    missing_alt = image_tags_missing_alt(text)
    if missing_alt:
        lines = ", ".join(str(line) for line in missing_alt[:8])
        errors.append(f"{deck}: image tags without alt text on lines {lines}")

    missing_io = algorithm_boxes_missing_io(text)
    if missing_io:
        lines = ", ".join(str(line) for line in missing_io[:8])
        errors.append(f"{deck}: algorithm boxes missing Input/Output on lines {lines}")

    roadmaps = text.count("roadmap-card current")
    if roadmaps != 5:
        errors.append(f"{deck}: expected 5 active roadmap cards, got {roadmaps}")

    missing = []
    for ref in local_references(text):
        if should_check_reference(ref) and not resolve_reference(deck_dir, ref).exists():
            missing.append(ref)
    if missing:
        sample = ", ".join(missing[:8])
        errors.append(f"{deck}: missing local references: {sample}")

    return errors


def check_landing_page() -> list[str]:
    """Validate references in the static slides landing page."""
    page = ROOT / "index.html"
    if not page.exists():
        return ["slides/index.html: missing landing page"]

    text = page.read_text()
    refs = re.findall(r'(?:href|src)="([^"]+)"', text)
    missing = []
    skipped_rendered = 0
    for ref in refs:
        if ref.startswith(("http://", "https://", "mailto:", "#")):
            continue
        ref_path = urlsplit(ref).path
        if re.fullmatch(r"[1-4]-[^/]+/index\.html", ref_path):
            skipped_rendered += 1
            continue
        target = (ROOT / ref_path).resolve()
        if not target.exists():
            missing.append(ref)

    errors = []
    if missing:
        sample = ", ".join(missing[:8])
        errors.append(f"slides/index.html: missing references: {sample}")
    if skipped_rendered:
        print(f"slides/index.html: ok ({skipped_rendered} rendered deck links skipped)")
    else:
        print("slides/index.html: ok")
    return errors


def check_quarto_project() -> list[str]:
    """Validate the top-level Quarto project render list."""
    project = ROOT / "_quarto.yml"
    if not project.exists():
        return ["slides/_quarto.yml: missing Quarto project file"]

    text = project.read_text()
    listed = re.findall(r"^\s*-\s+([1-4][^\s]+/index\.qmd)\s*$", text, re.MULTILINE)
    errors: list[str] = []
    for deck in DECKS:
        qmd = f"{deck}/index.qmd"
        if qmd not in listed:
            errors.append(f"slides/_quarto.yml: missing render entry {qmd}")
    for qmd in listed:
        if not (ROOT / qmd).exists():
            errors.append(f"slides/_quarto.yml: render entry does not exist: {qmd}")
    return errors


def main() -> int:
    """Run all checks and print a compact report."""
    all_errors: list[str] = []
    all_errors.extend(check_quarto_project())
    all_errors.extend(check_landing_page())
    for deck in DECKS:
        errors = check_deck(deck)
        if errors:
            all_errors.extend(errors)
        else:
            qmd = ROOT / deck / "index.qmd"
            text = qmd.read_text()
            slides = sum(1 for line in text.splitlines() if line.startswith("## ")) + 1
            print(f"{deck}: ok ({slides} slides)")

    if all_errors:
        for error in all_errors:
            print(error, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
