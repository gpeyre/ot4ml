#!/usr/bin/env python3
"""Generate a bibliography-free compact teaching version of OT4ML.

The compact edition preserves formal mathematical blocks (definitions,
statements, proofs and displayed equations) while thinning expository prose.
Run from the repository root with:

    python3 compact/generate_compact.py
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LATEX = ROOT / "latex"
OUT = ROOT / "compact"
OUT_SECTIONS = OUT / "sections"

SECTION_NAMES = [
    "matching",
    "monge",
    "kantorovich",
    "dual",
    "semidiscr-w1",
    "dual-norms",
    "sinkhorn",
    "sinkhorn-advanced",
    "generalized-wasserstein",
    "generalized-ot-problems",
    "beyond-comparing-measures",
    "dynamic-ot",
    "wasserstein-gradient-flows",
    "transportation-models",
]

PRESERVE_ENVS = {
    "prop",
    "proposition",
    "thm",
    "theorem",
    "lem",
    "lemma",
    "cor",
    "defn",
    "definition",
    "proof",
    "equation",
    "equation*",
    "align",
    "align*",
    "aligned",
    "cases",
    "pmatrix",
    "enumerate",
    "itemize",
    "tikzpicture",
    "longtable",
}

SKIP_ENVS = {
    "figure",
    "table",
    "rem",
    "rem1",
    "rem2",
    "example",
    "exmp",
    "alg",
    "algblock",
}

COMPACT_ENVS: set[str] = set()

BEGIN_RE = re.compile(r"\\begin\{([^}]+)\}")
END_RE = re.compile(r"\\end\{([^}]+)\}")
CITE_RE = re.compile(r"~?\\cite(?:\[[^\]]*\])*\{[^{}]*\}")
COMMAND_CITE_RE = re.compile(r"\\(?:citep|citet)(?:\[[^\]]*\])*\{[^{}]*\}")
HEADING_COMMANDS = ("chapter", "section", "subsection", "subsubsection", "paragraph")

DROP_SENTENCE_START_RE = re.compile(
    r"^(?:"
    r"This (?:section|subsection|chapter|paragraph|remark|example|result|theorem|proposition|corollary|lemma)\b|"
    r"The (?:goal|aim|stakes|purpose|point|message|common theme|next|previous|following|above|preceding)\b|"
    r"We (?:now|next|then|will|recall|give|show|prove|detail|consider|turn|move|apply|describe|explain)\b|"
    r"Let us\b|"
    r"Putting together\b|By putting together\b|"
    r"Combining\b|As a consequence\b|Consequently\b|"
    r"It remains\b|It is useful\b|It is important\b|It is non-trivial\b|"
    r"Intuitively\b|In words\b|Informally\b|Heuristically\b|"
    r"For example\b|For instance\b|"
    r"Historically\b|"
    r"Instead of\b|In contrast\b|In this case\b|For this\b|Under this assumption\b|"
    r"This quantity\b|This distance\b|This gives\b|A key difference\b|"
    r"The choice\b|The effect\b|Such a convergence\b|"
    r"The proof uses\b|"
    r"The dynamic formulation\b|The problem of\b|The general construction\b|"
    r"The projected\b|The standard\b|"
    r"This interpolation\b|This closure\b|This can\b|This corresponds\b|"
    r"This nonnegative quantity\b|This property\b|This norm\b|"
    r"Not every\b|Generative models\b|Linear OT\b|Inverse OT\b|GANs fit\b|"
    r"Duality turns\b|Monge's problem asks\b|Kantorovich's relaxation\b"
    r")",
)

DROP_SENTENCE_CONTAINS_RE = re.compile(
    r"(?:"
    r"\\cite|citep\{|citet\{|"
    r"Figure~\\ref|fig:|"
    r"\b(?:background|motivation|survey|overview|literature)\b|"
    r"\bdeveloped in\.?$|"
    r"\bshould be read as a warning\b|"
    r"\bthe reader\b|"
    r"\bwill be needed\b"
    r")",
    re.IGNORECASE,
)

KEEP_TECHNICAL_START_RE = re.compile(
    r"^(?:Let|Assume|Suppose|Given|Fix|Define|Denote|Set|Take|If|When|For)\b"
)


def strip_citations(text: str) -> str:
    text = CITE_RE.sub("", text)
    text = COMMAND_CITE_RE.sub("", text)
    text = re.sub(r"\s*\(see [^)]+\\ref\{[^}]+\}[^)]*\)", "", text)
    text = re.sub(r"\s*\(detailed in [^)]+\\ref\{[^}]+\}[^)]*\)", "", text)
    text = text.replace(
        "These are exactly the cases listed in Proposition~\\ref{prop-basic-geodesic-convexity}: ",
        "",
    )
    text = re.sub(r"\b1D\b", "1-D", text)
    text = text.replace("Benamou-Brenier", "Benamou--Brenier")
    text = text.replace("Gromov-Wasserstein", "Gromov--Wasserstein")
    text = re.sub(r"\bargument of([.;])", r"argument\1", text)
    text = re.sub(r"\bviewpoint of([.;])", r"viewpoint\1", text)
    text = text.replace(
        "related spectral Wasserstein gauges are used in.",
        "related spectral Wasserstein gauges give analogous constructions.",
    )
    text = text.replace(
        r"as in Remark~\ref{rem-soft-transform-convexity}",
        "using the convexity properties of soft transforms",
    )
    text = text.replace(
        r"\begin{prop}[Basic geodesically convex energies]\label{prop-basic-geodesic-convexity}",
        r"\begin{prop}[Basic geodesically convex energies]\phantomsection\label{prop-basic-geodesic-convexity}",
    )
    text = re.sub(r"\\,\s*([,.;:])", r"\1", text)
    text = re.sub(r"\s+([,.;:])", r"\1", text)
    text = re.sub(r"\(\s*\)", "", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()


def _scan_bracketed(text: str, start: int, open_char: str, close_char: str) -> tuple[str, int] | None:
    if start >= len(text) or text[start] != open_char:
        return None
    depth = 0
    for pos in range(start, len(text)):
        ch = text[pos]
        if ch == open_char:
            depth += 1
        elif ch == close_char:
            depth -= 1
            if depth == 0:
                return text[start + 1 : pos], pos + 1
    return None


def parse_heading(line: str) -> tuple[str, str, str] | None:
    for cmd in HEADING_COMMANDS:
        prefix = f"\\{cmd}"
        if not line.startswith(prefix):
            continue
        pos = len(prefix)
        if pos < len(line) and line[pos] == "*":
            pos += 1
        while pos < len(line) and line[pos].isspace():
            pos += 1
        if pos < len(line) and line[pos] == "[":
            optional = _scan_bracketed(line, pos, "[", "]")
            if optional is None:
                return None
            _, pos = optional
            while pos < len(line) and line[pos].isspace():
                pos += 1
        parsed = _scan_bracketed(line, pos, "{", "}")
        if parsed is None:
            return None
        title, end = parsed
        return cmd, title.strip(), line[end:].strip()
    return None


def plain_heading(title: str) -> str:
    plain = title
    replacements = {
        r"$\Wass_1$": "W1",
        r"$\Wass_\infty$": "W-infinity",
        r"$\phi$": "phi",
        r"$c$": "c",
        r"$p$": "p",
        r"$\KL$": "KL",
    }
    for src, dst in replacements.items():
        plain = plain.replace(src, dst)
    plain = re.sub(r"\\texorpdfstring\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\{([^{}]*)\}", r"\2", plain)
    plain = re.sub(r"\$([^$]*)\$", r"\1", plain)
    plain = plain.replace(r"\Wass", "W")
    plain = plain.replace(r"\phi", "phi")
    plain = plain.replace(r"\infty", "infinity")
    plain = re.sub(r"\\[a-zA-Z]+", "", plain)
    plain = plain.replace("{", "").replace("}", "")
    plain = re.sub(r"\s+", " ", plain).strip()
    return plain or "section"


def polish_heading(line: str) -> str:
    """Normalize compact-only heading typography."""
    line = line.replace("1D", "1-D")
    line = line.replace("Gromov Wasserstein", "Gromov--Wasserstein")
    line = line.replace("Gromov-Wasserstein", "Gromov--Wasserstein")
    line = line.replace("Benamou-Brenier", "Benamou--Brenier")
    parsed = parse_heading(line)
    if parsed is None:
        return line
    cmd, title, trailing = parsed
    cmd = {
        "chapter": "section",
        "section": "subsection",
        "subsection": "subsubsection",
        "subsubsection": "paragraph",
        "paragraph": "paragraph",
    }[cmd]
    if cmd == "paragraph":
        title = title.strip()
        if title and title[-1] not in ".?!:":
            title += "."
    if "$" in title and r"\texorpdfstring" not in title:
        title = rf"\texorpdfstring{{{title}}}{{{plain_heading(title)}}}"
    return rf"\{cmd}{{{title}}}" + (trailing if trailing else "")


def is_index_line(stripped: str) -> bool:
    return stripped.startswith(r"\index{")


def starts_skipped_env(stripped: str) -> str | None:
    for env in BEGIN_RE.findall(stripped):
        if env in SKIP_ENVS:
            return env
    return None


def ends_env(stripped: str, env_name: str) -> bool:
    return any(env == env_name for env in END_RE.findall(stripped))


def remove_comment(line: str) -> str:
    """Remove comments, keeping escaped percent signs."""
    if line.lstrip().startswith("%"):
        return ""
    out = []
    escaped = False
    for ch in line:
        if ch == "%" and not escaped:
            break
        out.append(ch)
        escaped = (ch == "\\" and not escaped)
        if ch != "\\":
            escaped = False
    return "".join(out).rstrip()


def split_sentences(paragraph: str) -> list[str]:
    # Conservative splitter: enough for prose compaction, while avoiding most
    # equation punctuation because displayed math is handled separately.
    pieces = re.split(r"(?<=[.!?])\s+(?=[A-Z\\])", paragraph)
    return [p.strip() for p in pieces if p.strip()]


def compact_paragraph(lines: list[str]) -> list[str]:
    if not lines:
        return []
    raw = " ".join(x.strip() for x in lines if x.strip())
    raw = re.sub(r"\s+", " ", raw).strip()
    if not raw:
        return []

    sentences = split_sentences(raw)
    if sentences and (
        DROP_SENTENCE_START_RE.search(sentences[0])
        or DROP_SENTENCE_CONTAINS_RE.search(sentences[0])
    ):
        return []
    kept_sentences = [
        s
        for s in sentences
        if not DROP_SENTENCE_START_RE.search(s)
        and not DROP_SENTENCE_CONTAINS_RE.search(s)
    ]
    if not kept_sentences:
        return []
    text = strip_citations(" ".join(kept_sentences))
    if not text:
        return []

    # Keep only notation-bearing or formula-bearing prose.  The compact edition
    # is intentionally not a narrative text: pitches, transitions, historical
    # comments and bibliographic context belong to the full book.
    mathish = any(
        tok in text
        for tok in ("$", "\\eqref", "\\ref", "\\label", "\\Wass", "\\MK", "\\KL", "\\Pp", "\\Mm")
    )
    defining = bool(
        re.search(
            r"\b(define|defined|denote|denoted|assume|where|reads|satisfies|Let|"
            r"Then|Thus|Hence|equivalently|iff)\b",
            text,
        )
    )

    if KEEP_TECHNICAL_START_RE.search(text) and mathish and len(text) <= 420:
        return [text, ""]

    if mathish and defining:
        short = " ".join(split_sentences(text)[:2])
        if len(short) > 430:
            short = split_sentences(text)[0]
        return [short, ""] if short else []

    return []


def compact_structural_line(line: str) -> str:
    """Trim transition sentences even inside preserved formal environments."""
    text = strip_citations(line)
    stripped = text.strip()
    if not stripped or stripped.startswith("\\"):
        return text
    sentences = split_sentences(stripped)
    if not sentences:
        return text
    if not any(
        DROP_SENTENCE_START_RE.search(s) or DROP_SENTENCE_CONTAINS_RE.search(s)
        for s in sentences
    ):
        return text
    kept = [
        s
        for s in sentences
        if not DROP_SENTENCE_START_RE.search(s)
        and not DROP_SENTENCE_CONTAINS_RE.search(s)
    ]
    return " ".join(kept).strip()


def can_inline_math(math: str) -> bool:
    """Return whether an unnumbered display is short enough to inline."""
    if len(math) > 145:
        return False
    if "\\sum_j \\exp" in math:
        return False
    forbidden = ("\\\\", "&", "\\begin", "\\end", "\\label", "\\tag", "\\left", "\\right", "\\choice")
    return not any(tok in math for tok in forbidden)


def compact_math_block(block: list[str]) -> str | None:
    """Return a one-line formula when a display block is visually one equation."""
    cleaned = [line.strip() for line in block if line.strip()]
    if not cleaned:
        return None
    math = " ".join(cleaned)
    math = re.sub(r"\s+", " ", math).strip()
    return math if can_inline_math(math) else None


def append_inline_math(prev: str, inline: str) -> str | None:
    """Attach a short formula to the previous prose line when this is natural."""
    if not prev or prev.startswith("\\") or prev.endswith(("\\]", "}")):
        return None
    if len(prev) + 1 + len(inline) > 230:
        return None
    if prev[-1] in ":,=+-":
        return f"{prev} {inline}"
    if re.search(r"\b(?:is|are|reads|as|by|where|with|gives|satisfies|one has)$", prev):
        return f"{prev} {inline}"
    return None


def inline_short_displays(text: str) -> str:
    """Replace short unnumbered centered equations by inline formulae."""
    lines = text.splitlines()
    out: list[str] = []
    i = 0
    while i < len(lines):
        stripped = lines[i].strip()

        if stripped == r"\[":
            j = i + 1
            block: list[str] = []
            while j < len(lines) and lines[j].strip() != r"\]":
                block.append(lines[j])
                j += 1
            if j < len(lines):
                math = compact_math_block(block)
                if math is not None:
                    inline = rf"\({math}\)"
                    attached = append_inline_math(out[-1], inline) if out else None
                    if attached is not None:
                        out[-1] = attached
                    else:
                        out.append(inline)
                    i = j + 1
                    continue

        if stripped in (r"\begin{equation}", r"\begin{equation*}"):
            end = r"\end{equation*}" if stripped.endswith("*}") else r"\end{equation}"
            j = i + 1
            block = []
            while j < len(lines) and lines[j].strip() != end:
                block.append(lines[j])
                j += 1
            if j < len(lines):
                math = compact_math_block(block)
                if math is not None:
                    inline = rf"\({math}\)"
                    attached = append_inline_math(out[-1], inline) if out else None
                    if attached is not None:
                        out[-1] = attached
                    else:
                        out.append(inline)
                    i = j + 1
                    continue

        if stripped in (r"\eq{", r"\eql{"):
            depth = brace_delta(stripped)
            j = i + 1
            block: list[str] = []
            while j < len(lines) and depth > 0:
                depth += brace_delta(lines[j].strip())
                if depth > 0:
                    block.append(lines[j])
                j += 1
            if depth <= 0:
                math = compact_math_block(block)
                # Keep labelled equations numbered and displayed.
                if math is not None and "\\label" not in math:
                    inline = rf"\({math}\)"
                    attached = append_inline_math(out[-1], inline) if out else None
                    if attached is not None:
                        out[-1] = attached
                    else:
                        out.append(inline)
                    i = j
                    continue

        out.append(lines[i])
        i += 1

    return "\n".join(out)


def brace_delta(line: str) -> int:
    # Counts braces well enough for custom \eq{...} blocks after comments have
    # been stripped. Escaped braces are rare in these sources and harmless here.
    return line.count("{") - line.count("}")


def compact_section(path: Path) -> str:
    out: list[str] = []
    paragraph: list[str] = []
    env_stack: list[str] = []
    compact_env_stack: list[str] = []
    custom_math_depth = 0
    display_math = False
    skip_if_depth = 0
    skip_env_stack: list[str] = []

    def flush() -> None:
        nonlocal paragraph
        out.extend(compact_paragraph(paragraph))
        paragraph = []

    lines = path.read_text(encoding="utf-8").splitlines()
    for raw_line in lines:
        line = remove_comment(raw_line)
        stripped = line.strip()

        if skip_env_stack:
            skipped = starts_skipped_env(stripped)
            if skipped:
                skip_env_stack.append(skipped)
            if ends_env(stripped, skip_env_stack[-1]):
                skip_env_stack.pop()
            continue

        if skip_if_depth:
            if stripped.startswith(("\\if", "\\iffalse")):
                skip_if_depth += 1
            if stripped.startswith("\\fi"):
                skip_if_depth -= 1
            continue

        if stripped.startswith(("\\if 0", "\\iffalse")):
            skip_if_depth = 1
            continue

        skipped = starts_skipped_env(stripped)
        if skipped:
            flush()
            if not ends_env(stripped, skipped):
                skip_env_stack.append(skipped)
            continue

        if is_index_line(stripped):
            continue

        if not stripped:
            if env_stack == ["proof"] and not custom_math_depth and not display_math:
                if out and out[-1] != "":
                    out.append("")
            elif env_stack or custom_math_depth or display_math:
                continue
            elif compact_env_stack:
                flush()
            else:
                flush()
            continue

        if compact_env_stack and not env_stack and not custom_math_depth and not display_math:
            compact_begins = [env for env in BEGIN_RE.findall(stripped) if env in COMPACT_ENVS]
            compact_ends = [env for env in END_RE.findall(stripped) if env in COMPACT_ENVS]
            begins = [env for env in BEGIN_RE.findall(stripped) if env in PRESERVE_ENVS]
            starts_custom_math = stripped.startswith("\\eq{") or stripped.startswith("\\eql{")
            starts_display = stripped.startswith("\\[") or stripped.startswith("$$")

            if compact_ends:
                flush()
                out.append(strip_citations(line))
                for env in compact_ends:
                    if env in compact_env_stack[::-1]:
                        idx = len(compact_env_stack) - 1 - compact_env_stack[::-1].index(env)
                        compact_env_stack = compact_env_stack[:idx]
                continue

            if compact_begins:
                flush()
                out.append(strip_citations(line))
                compact_env_stack.extend(compact_begins)
                continue

            if begins or starts_custom_math or starts_display:
                flush()
                compact_line = compact_structural_line(line)
                if compact_line:
                    out.append(compact_line)
                env_stack.extend(begins)
                if starts_custom_math:
                    custom_math_depth = brace_delta(stripped)
                    if custom_math_depth <= 0:
                        custom_math_depth = 0
                if starts_display and not ("\\]" in stripped and stripped.index("\\[") < stripped.index("\\]")):
                    display_math = True
                continue

            paragraph.append(line)
            continue

        if env_stack or custom_math_depth or display_math:
            compact_line = compact_structural_line(line)
            if compact_line:
                out.append(compact_line)
            for env in BEGIN_RE.findall(stripped):
                if env in PRESERVE_ENVS:
                    env_stack.append(env)
            for env in END_RE.findall(stripped):
                if env in PRESERVE_ENVS and env in env_stack[::-1]:
                    # Pop the matching environment and anything nested after it.
                    idx = len(env_stack) - 1 - env_stack[::-1].index(env)
                    env_stack = env_stack[:idx]
            if custom_math_depth:
                custom_math_depth += brace_delta(stripped)
                if custom_math_depth <= 0:
                    custom_math_depth = 0
            if display_math and ("\\]" in stripped or "$$" in stripped):
                display_math = False
            continue

        begins = [env for env in BEGIN_RE.findall(stripped) if env in PRESERVE_ENVS]
        compact_begins = [env for env in BEGIN_RE.findall(stripped) if env in COMPACT_ENVS]
        starts_custom_math = stripped.startswith("\\eq{") or stripped.startswith("\\eql{")
        starts_display = stripped.startswith("\\[") or stripped.startswith("$$")

        if stripped.startswith(("\\chapter", "\\section", "\\subsection", "\\subsubsection", "\\paragraph")):
            flush()
            out.append(polish_heading(stripped))
            continue

        if stripped.startswith("\\label{"):
            flush()
            out.append(stripped)
            continue

        if compact_begins:
            flush()
            out.append(strip_citations(line))
            compact_env_stack.extend(compact_begins)
            continue

        if begins or starts_custom_math or starts_display:
            flush()
            compact_line = compact_structural_line(line)
            if compact_line:
                out.append(compact_line)
            env_stack.extend(begins)
            if starts_custom_math:
                custom_math_depth = brace_delta(stripped)
                if custom_math_depth <= 0:
                    custom_math_depth = 0
            if starts_display and not ("\\]" in stripped and stripped.index("\\[") < stripped.index("\\]")):
                display_math = True
            continue

        # Preserve isolated LaTeX commands that are structural and compact.
        if stripped.startswith(("\\item", "\\hline", "\\multicolumn", "\\endfirsthead", "\\endhead", "\\endfoot")):
            flush()
            compact_line = compact_structural_line(line)
            if compact_line:
                out.append(compact_line)
            continue

        paragraph.append(line)

    flush()
    text = "\n".join(out).strip() + "\n"
    text = re.sub(r"(\\qifq[^\n]*),(\s*\\\\)", r"\1\2", text)
    text = re.sub(r"(\\qifq[^\n]*),\n(\})", r"\1\n\2", text)
    text = inline_short_displays(text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def write_driver() -> None:
    inputs = "\n".join(f"\\input{{sections/{name}}}" for name in SECTION_NAMES)
    driver = rf"""\documentclass[10pt,a4paper]{{article}}
\pdfoutput=1
\usepackage[bookmarks,bookmarksdepth=2,colorlinks=true,linkcolor=blue,urlcolor=blue]{{hyperref}}
\usepackage[a4paper,top=6mm,bottom=6mm,left=6mm,right=6mm,includefoot,footskip=4mm]{{geometry}}
\usepackage[compact]{{titlesec}}
\usepackage{{enumitem}}
\usepackage{{longtable}}
\usepackage[latin1]{{inputenc}}
\usepackage{{mystyle}}
\usepackage{{wrapfig}}
\usepackage{{notations_ot}}
\usepackage{{tikz}}

\setlength{{\parindent}}{{0pt}}
\setlength{{\parskip}}{{0.2pt}}
\linespread{{0.90}}
\setlength{{\abovedisplayskip}}{{2pt plus .5pt minus .5pt}}
\setlength{{\belowdisplayskip}}{{2pt plus .5pt minus .5pt}}
\setlength{{\abovedisplayshortskip}}{{1pt plus .5pt minus .5pt}}
\setlength{{\belowdisplayshortskip}}{{1pt plus .5pt minus .5pt}}
\setlength{{\jot}}{{1pt}}
\setlength{{\topsep}}{{0pt}}
\setlength{{\partopsep}}{{0pt}}
\setlength{{\parsep}}{{0pt}}
\setlength{{\itemsep}}{{0pt}}
\setlist{{nosep,leftmargin=*}}
\titlespacing*{{\section}}{{0pt}}{{.55ex plus .15ex}}{{.15ex}}
\titlespacing*{{\subsection}}{{0pt}}{{.45ex plus .15ex}}{{.1ex}}
\titlespacing*{{\subsubsection}}{{0pt}}{{.35ex plus .1ex}}{{.05ex}}
\titlespacing*{{\paragraph}}{{0pt}}{{.25ex plus .1ex}}{{.45em}}
\titleformat{{\section}}{{\large\bfseries}}{{\thesection}}{{.45em}}{{}}
\titleformat{{\subsection}}{{\normalsize\bfseries}}{{\thesubsection}}{{.4em}}{{}}
\titleformat{{\subsubsection}}{{\normalsize\itshape}}{{\thesubsubsection}}{{.35em}}{{}}
\titleformat{{\paragraph}}[runin]{{\bfseries}}{{}}{{0pt}}{{}}
\allowdisplaybreaks[2]
\emergencystretch=2em
\sloppy

\newcommand{{\todo}}[1]{{}}
\newcommand{{\blue}}[1]{{#1}}
\newcommand{{\removed}}[1]{{}}
\newcommand{{\dims}}{{d}}

\begin{{document}}
\begin{{center}}
{{\Large\bfseries Optimal Transport for Machine Learners}}\\[-.15em]
{{\large\itshape Compact teaching notes}}\\[.35em]
Gabriel Peyr{{\'e}}\\[-.1em]
{{\small\today}}
\end{{center}}
\vspace{{-.6em}}

{inputs}

\end{{document}}
"""
    (OUT / "CourseOT-compact.tex").write_text(driver, encoding="utf-8")


def write_readme() -> None:
    readme = """# Compact Teaching Version

This directory contains the compact, bibliography-free teaching version of the
OT4ML manuscript. It is generated from the current sources in `latex/` with
`generate_compact.py`, using a 10pt A4 layout and tight margins for handouts.

The compact version is meant for lecture use: it follows the current chapter
order of the full book, mapping chapters to article sections, and preserves the
core mathematical statements, proofs and equations. It removes expansive
exposition, side remarks and examples, transitions, references, figures, tables,
the bibliography, the index, and the notation table from the full book.

## Build

```sh
python3 compact/generate_compact.py
cd compact
pdflatex -synctex=1 -interaction=nonstopmode -halt-on-error CourseOT-compact.tex
pdflatex -synctex=1 -interaction=nonstopmode -halt-on-error CourseOT-compact.tex
```

Run these commands from the repository root. The first command refreshes the
compact LaTeX source, and the two LaTeX passes refresh cross-references.

## Generator Policy

- preserve formal mathematical environments and proofs;
- follow the section order of `latex/OT4ML.tex`;
- strip citations and omit the bibliography, index, figures, tables, remarks,
  and examples;
- remove pitches, transitions and background prose outside formal/math blocks;
- inline short unnumbered displayed equations when this saves vertical space.

LaTeX auxiliary files are ignored in this directory. Keep the generator, style
files, compact section files, generated source, and final
`CourseOT-compact.pdf` under version control.
"""
    (OUT / "README.md").write_text(readme, encoding="utf-8")


def write_clean_copy(src: Path, dst: Path) -> None:
    """Copy small TeX support files while normalizing line endings/whitespace."""
    text = src.read_text(encoding="latin1")
    if src.name == "mystyle.sty":
        text = text.replace(r"\numberwithin{equation}{chapter}", r"\numberwithin{equation}{section}")
        text = text.replace(r"\numberwithin{figure}{chapter}", r"\numberwithin{figure}{section}")
        text = text.replace(r"\newtheorem{thm}{Theorem}[chapter]", r"\newtheorem{thm}{Theorem}[section]")
        text = text.replace(r"\newfloat{algfloat}{tbp}{loa}[chapter]", r"\newfloat{algfloat}{tbp}{loa}[section]")
        text = text.replace("innertopmargin=3pt,", "innertopmargin=1.2pt,")
        text = text.replace("innerbottommargin=3pt,", "innerbottommargin=1.2pt,")
        text = text.replace("innerleftmargin=6pt,", "innerleftmargin=3.5pt,")
        text = text.replace("innerrightmargin=6pt,", "innerrightmargin=3.5pt,")
        text = text.replace(r"skipabove=.55\baselineskip,", r"skipabove=.18\baselineskip,")
        text = text.replace(r"skipbelow=.55\baselineskip,", r"skipbelow=.18\baselineskip,")
        text = text.replace(
            r"skipbelow=.18\baselineskip,"
            "\n}",
            r"skipbelow=.18\baselineskip,"
            "\n\tnobreak=true,"
            "\n}",
        )
    lines = text.splitlines()
    dst.write_text("\n".join(line.rstrip() for line in lines) + "\n", encoding="latin1")


def main() -> None:
    OUT_SECTIONS.mkdir(parents=True, exist_ok=True)
    for style in ("mystyle.sty", "notations_ot.sty"):
        write_clean_copy(LATEX / style, OUT / style)
    for name in SECTION_NAMES:
        src = LATEX / "sections" / f"{name}.tex"
        dst = OUT_SECTIONS / f"{name}.tex"
        dst.write_text(compact_section(src), encoding="utf-8")
    write_driver()
    write_readme()


if __name__ == "__main__":
    main()
