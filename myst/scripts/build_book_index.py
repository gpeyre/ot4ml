#!/usr/bin/env python3
"""Build the MyST book index from the canonical LaTeX index markers.

The LaTeX sources determine the terminology and web locations, while the
generated ``OT4ML.idx`` file supplies the printed page numbers.  Keeping both
inputs in one pipeline prevents the PDF and web indexes from drifting apart.
"""

from __future__ import annotations

import argparse
import html
import re
from collections import defaultdict, deque
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, Iterator, Sequence


REPO_ROOT = Path(__file__).resolve().parents[2]
LATEX_ROOT = REPO_ROOT / "OT4ML"
MYST_ROOT = REPO_ROOT / "myst"
MASTER = LATEX_ROOT / "OT4ML.tex"
IDX_FILE = LATEX_ROOT / "OT4ML.idx"
OUTPUT = MYST_ROOT / "book-index.md"

ROUTES = {
    "matching": "matching",
    "monge": "monge",
    "kantorovich": "kantorovich",
    "dual": "dual",
    "semidiscr-w1": "semidiscrete-w1",
    "dual-norms": "dual-norms",
    "sinkhorn": "sinkhorn",
    "sinkhorn-advanced": "sinkhorn-advanced",
    "statistical-ot": "statistical-ot",
    "generalized-wasserstein": "generalized-wasserstein",
    "generalized-ot-problems": "generalized-ot-problems",
    "beyond-comparing-measures": "beyond-comparing-measures",
    "dynamic-ot": "dynamic-ot",
    "wasserstein-gradient-flows": "wasserstein-gradient-flows",
    "transportation-models": "transportation-models",
}

HEADING_LEVEL = {"chapter": 0, "section": 1, "subsection": 2, "paragraph": 3}
COMMAND_RE = re.compile(r"\\(chapter|section|subsection|paragraph|label|index)\b")
INPUT_RE = re.compile(r"\\input\{sections/([^}]+)\}")
HTML_ID_RE = re.compile(r'\bid="([^"]+)"')


@dataclass(frozen=True)
class Heading:
    """A structural LaTeX heading and its corresponding web anchor."""

    level: int
    position: int
    title: str
    anchor: str


@dataclass(frozen=True)
class Occurrence:
    """One index marker together with its preferred MyST destination."""

    key: str
    route: str
    anchor: str | None


@dataclass(frozen=True)
class PageLink:
    """A printed page number linked to the matching web location."""

    page: str
    route: str
    anchor: str | None


@dataclass
class IndexNode:
    """A node in the hierarchical index tree."""

    sort_name: str
    display_name: str
    links: list[PageLink] = field(default_factory=list)
    children: dict[str, "IndexNode"] = field(default_factory=dict)


def strip_comments(text: str) -> str:
    """Remove unescaped LaTeX comments while preserving line structure."""

    lines = []
    for line in text.splitlines(keepends=True):
        match = re.search(r"(?<!\\)%", line)
        lines.append(line[: match.start()] + "\n" if match else line)
    return "".join(lines)


def balanced_argument(text: str, opening: int) -> tuple[str, int]:
    """Return a balanced braced argument and the position after its brace."""

    if opening >= len(text) or text[opening] != "{":
        raise ValueError(f"expected '{{' at offset {opening}")
    depth = 0
    escaped = False
    for position in range(opening, len(text)):
        character = text[position]
        if escaped:
            escaped = False
            continue
        if character == "\\":
            escaped = True
            continue
        if character == "{":
            depth += 1
        elif character == "}":
            depth -= 1
            if depth == 0:
                return text[opening + 1 : position], position + 1
    raise ValueError(f"unclosed braced argument at offset {opening}")


def iter_commands(text: str) -> Iterator[tuple[str, str, int, int]]:
    """Yield relevant LaTeX commands with balanced arguments."""

    for match in COMMAND_RE.finditer(text):
        opening = match.end()
        while opening < len(text) and text[opening].isspace():
            opening += 1
        if opening >= len(text) or text[opening] != "{":
            continue
        argument, end = balanced_argument(text, opening)
        yield match.group(1), argument.strip(), match.start(), end


def latex_to_text(value: str) -> str:
    """Convert the small LaTeX subset used in index labels to plain text."""

    replacements = {
        r"\'E": "\u00c9",
        r"\'e": "\u00e9",
        r"\`e": "\u00e8",
        r'\"o': "\u00f6",
        r"\'a": "\u00e1",
        r"{\L}": "\u0141",
        r"\L": "\u0141",
    }
    result = value
    for source, target in replacements.items():
        result = result.replace(source, target)
    result = result.replace("--", "\u2013")
    result = re.sub(r"\\(?:textit|textbf|mathrm|mathsf)\{([^{}]*)\}", r"\1", result)
    result = result.replace("{", "").replace("}", "")
    result = re.sub(r"\\[A-Za-z]+", "", result)
    result = re.sub(r"\s+", " ", result)
    return result.strip(" .")


def slugify(title: str) -> str:
    """Approximate MyST's stable heading slug for unlabelled paragraphs."""

    plain = latex_to_text(title).lower()
    plain = plain.replace("\u2013", "-").replace("\u2014", "-")
    plain = re.sub(r"[^a-z0-9]+", "-", plain)
    return plain.strip("-")


def split_component(component: str) -> tuple[str, str]:
    """Split a MakeIndex sort/display component at its optional ``@``."""

    if "@" in component:
        sort_name, display_name = component.split("@", 1)
    else:
        sort_name = display_name = component
    return latex_to_text(sort_name), latex_to_text(display_name)


def split_key(key: str) -> list[tuple[str, str]]:
    """Return the sort and display names at every level of an index key."""

    return [split_component(component) for component in key.split("!")]


def chapter_names() -> list[str]:
    """Read the canonical chapter order from the LaTeX master document."""

    master = strip_comments(MASTER.read_text(encoding="utf8"))
    return [name for name in INPUT_RE.findall(master) if name in ROUTES]


def html_ids(route: str) -> set[str]:
    """Read the anchors from the latest static MyST build, when available."""

    page = MYST_ROOT / "_build" / "html" / route / "index.html"
    if not page.exists():
        return set()
    return set(HTML_ID_RE.findall(page.read_text(encoding="utf8")))


def source_occurrences(source: Path, route: str) -> list[Occurrence]:
    """Associate each source marker with the nearest valid web heading."""

    text = strip_comments(source.read_text(encoding="utf8"))
    commands = list(iter_commands(text))
    structural = [command for command in commands if command[0] in HEADING_LEVEL]
    valid_ids = html_ids(route)
    headings: list[Heading] = []

    for index, (name, title, position, end) in enumerate(structural):
        next_position = structural[index + 1][2] if index + 1 < len(structural) else len(text)
        nearby = text[end : min(next_position, end + 300)]
        label_match = re.search(r"\\label\{([^}]+)\}", nearby)
        candidate = label_match.group(1) if label_match else slugify(title)
        headings.append(Heading(HEADING_LEVEL[name], position, title, candidate))

    occurrences: list[Occurrence] = []
    stack: list[Heading] = []
    heading_cursor = 0
    for name, key, position, _ in commands:
        if name != "index":
            continue
        while heading_cursor < len(headings) and headings[heading_cursor].position < position:
            heading = headings[heading_cursor]
            stack = [item for item in stack if item.level < heading.level]
            stack.append(heading)
            heading_cursor += 1

        candidates = [heading.anchor for heading in reversed(stack) if heading.anchor]
        if valid_ids:
            anchor = next((candidate for candidate in candidates if candidate in valid_ids), None)
        else:
            anchor = candidates[0] if candidates else None
        occurrences.append(Occurrence(key=key, route=route, anchor=anchor))
    return occurrences


def parse_idx() -> list[tuple[str, str]]:
    """Parse MakeIndex entries without assuming that keys contain no braces."""

    entries: list[tuple[str, str]] = []
    for line_number, line in enumerate(IDX_FILE.read_text(encoding="utf8").splitlines(), 1):
        if not line.startswith(r"\indexentry{"):
            continue
        opening = line.index("{")
        argument, end = balanced_argument(line, opening)
        if "|" in argument:
            key, _encapsulation = argument.rsplit("|", 1)
        else:
            key = argument
        page_opening = line.find("{", end)
        if page_opening < 0:
            raise ValueError(f"missing page number in {IDX_FILE}:{line_number}")
        page, _ = balanced_argument(line, page_opening)
        entries.append((key, page))
    return entries


def occurrence_queues() -> dict[str, deque[Occurrence]]:
    """Collect source locations in document order, grouped by exact key."""

    grouped: dict[str, deque[Occurrence]] = defaultdict(deque)
    for name in chapter_names():
        source = LATEX_ROOT / "sections" / f"{name}.tex"
        for occurrence in source_occurrences(source, ROUTES[name]):
            grouped[occurrence.key].append(occurrence)
    return grouped


def linked_entries() -> list[tuple[str, PageLink]]:
    """Match printed entries to source destinations occurrence by occurrence."""

    queues = occurrence_queues()
    fallbacks = {key: queue[0] for key, queue in queues.items() if queue}
    result: list[tuple[str, PageLink]] = []
    unmatched: set[str] = set()

    for key, page in parse_idx():
        queue = queues.get(key)
        if queue:
            occurrence = queue.popleft()
        elif key in fallbacks:
            occurrence = fallbacks[key]
        else:
            unmatched.add(key)
            occurrence = Occurrence(key, "", None)
        result.append((key, PageLink(page, occurrence.route, occurrence.anchor)))

    if unmatched:
        sample = ", ".join(sorted(unmatched)[:8])
        raise ValueError(f"{len(unmatched)} index keys have no source marker: {sample}")
    return result


def build_tree(entries: Iterable[tuple[str, PageLink]]) -> dict[str, IndexNode]:
    """Build the nested index tree and deduplicate identical page links."""

    roots: dict[str, IndexNode] = {}
    for key, link in entries:
        components = split_key(key)
        children = roots
        node: IndexNode | None = None
        for sort_name, display_name in components:
            identity = sort_name.casefold()
            node = children.setdefault(identity, IndexNode(sort_name, display_name))
            children = node.children
        assert node is not None
        if link not in node.links:
            node.links.append(link)
    return roots


def page_value(page: str) -> tuple[int, str]:
    """Sort Arabic page numbers numerically and other labels lexically."""

    return (int(page), "") if page.isdigit() else (-1, page)


def format_links(links: Sequence[PageLink]) -> str:
    """Render deduplicated PDF pages, compressing runs of three or more."""

    unique: dict[str, PageLink] = {}
    for link in links:
        unique.setdefault(link.page, link)
    ordered = sorted(unique.values(), key=lambda item: page_value(item.page))

    def render_link(link: PageLink) -> str:
        destination = link.route
        if link.anchor:
            destination += f"#{link.anchor}"
        return f"[{link.page}]({destination})"

    rendered: list[str] = []
    index = 0
    while index < len(ordered):
        end = index
        if ordered[index].page.isdigit():
            while (
                end + 1 < len(ordered)
                and ordered[end + 1].page.isdigit()
                and int(ordered[end + 1].page) == int(ordered[end].page) + 1
            ):
                end += 1
        if end - index + 1 >= 3:
            rendered.append(f"{render_link(ordered[index])}\u2013{render_link(ordered[end])}")
        else:
            rendered.extend(render_link(link) for link in ordered[index : end + 1])
        index = end + 1
    return ", ".join(rendered)


def sorted_nodes(nodes: dict[str, IndexNode]) -> list[IndexNode]:
    """Sort nodes by their explicit MakeIndex sort labels."""

    return sorted(nodes.values(), key=lambda node: node.sort_name.casefold())


def render_node(node: IndexNode, depth: int = 0) -> list[str]:
    """Render one index node and its descendants as nested Markdown."""

    prefix = "  " * depth + "- "
    line = prefix + node.display_name
    if node.links:
        line += ": " + format_links(node.links)
    lines = [line]
    for child in sorted_nodes(node.children):
        lines.extend(render_node(child, depth + 1))
    return lines


def initial_letter(node: IndexNode) -> str:
    """Return the alphabet heading used for a top-level term."""

    match = re.search(r"[A-Za-z]", node.sort_name)
    return match.group(0).upper() if match else "#"


def render_document(tree: dict[str, IndexNode], marker_count: int) -> str:
    """Render the complete generated MyST index page."""

    by_letter: dict[str, list[IndexNode]] = defaultdict(list)
    for node in sorted_nodes(tree):
        by_letter[initial_letter(node)].append(node)

    lines = [
        "---",
        'title: "Index"',
        "---",
        "",
        "The page numbers follow Appendix B of the PDF and link to the corresponding web location.",
        "",
        "<!-- Generated by scripts/build_book_index.py; do not edit manually. -->",
        f"<!-- {marker_count} printed index occurrences. -->",
        "",
        ":::{div}",
        ":class: ot4ml-index-jump",
        "",
        " ".join(f"[{letter}](#index-{letter.lower()})" for letter in sorted(by_letter)),
        "",
        ":::",
        "",
        ":::{div}",
        ":class: ot4ml-book-index",
        "",
    ]
    for letter in sorted(by_letter, key=lambda value: (value == "#", value)):
        lines.extend([f"(index-{letter.lower()})=", f"## {html.escape(letter)}", ""])
        for node in by_letter[letter]:
            lines.extend(render_node(node))
        lines.append("")
    lines.extend([":::", ""])
    return "\n".join(lines)


def main() -> None:
    """Generate the web index and report its structural statistics."""

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="fail if the generated file is stale")
    arguments = parser.parse_args()

    entries = linked_entries()
    tree = build_tree(entries)
    output = render_document(tree, len(entries))
    if arguments.check:
        current = OUTPUT.read_text(encoding="utf8") if OUTPUT.exists() else ""
        if current != output:
            raise SystemExit(f"{OUTPUT.relative_to(REPO_ROOT)} is stale; run this script without --check")
    else:
        OUTPUT.write_text(output, encoding="utf8")

    unique_paths = set(key for key, _ in entries)
    print(
        f"book index: {len(entries)} occurrences, {len(unique_paths)} paths, "
        f"{len(tree)} top-level terms"
    )


if __name__ == "__main__":
    main()
