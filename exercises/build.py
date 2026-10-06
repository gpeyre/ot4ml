#!/usr/bin/env python3
"""Build the five self-contained sheets, with and without hints/solutions."""
from pathlib import Path
import argparse
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parent
SHEETS = {
    "exo-monge": 13,
    "exo-kanto-discr": 5,
    "exo-kanto-cont": 6,
    "exo-sinkhorn": 11,
    "exo-gradient-flows": 6,
}


def check_source(path, count):
    text = path.read_text()
    body = text.split(r"\begin{document}", 1)[1]
    events = re.findall(r"\\begin\{(exercise|hints|solution)\}", body)
    if events != ["exercise", "hints", "solution"] * count:
        raise ValueError(f"{path}: expected {count} statement/hints/solution triples")
    if "solutionForce" in text:
        raise ValueError(f"{path}: unconditional solutions would leak into statements")
    if any(ord(c) < 32 and c not in "\n\r\t" for c in text):
        raise ValueError(f"{path}: nonprinting control character")
    labels = re.findall(r"\\label\{([^}]+)\}", text)
    if len(labels) != len(set(labels)):
        raise ValueError(f"{path}: duplicate labels")
    refs = re.findall(r"\\(?:eqref|ref)\{([^}]+)\}", text)
    if set(refs) - set(labels):
        raise ValueError(f"{path}: undefined source references: {set(refs)-set(labels)}")


def build(stem):
    source = ROOT / stem / f"{stem}.tex"
    check_source(source, SHEETS[stem])
    for statements in (False, True):
        name = stem + ("-uncorrected" if statements else "")
        work = ROOT / ".build" / name
        work.mkdir(parents=True, exist_ok=True)
        invocation = (r"\def\StatementOnly{1}" if statements else "")
        invocation += r"\input{" + str(source) + "}"
        cmd = ["pdflatex", "-interaction=nonstopmode", "-halt-on-error",
               "-file-line-error", "-no-shell-escape", f"-jobname={name}", invocation]
        for _ in range(2):
            result = subprocess.run(cmd, cwd=work, capture_output=True, text=True,
                                    errors="replace")
            if result.returncode:
                raise RuntimeError(result.stdout[-7000:])
        log = (work / f"{name}.log").read_text(errors="replace")
        if re.search(r"undefined references|multiply defined|Undefined control|Missing character", log):
            raise RuntimeError(f"Unresolved LaTeX diagnostics: {work / (name+'.log')}")
        overflow = re.findall(r"Overfull \\[hv]box.*", log)
        target = source.with_name(name + ".pdf")
        shutil.copy2(work / (name + ".pdf"), target)
        print(f"Built {target.relative_to(ROOT)}" +
              (f" ({len(overflow)} overflow warnings)" if overflow else ""), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("sheets", nargs="*", help="Folder names; default: all five")
    parser.add_argument("--check", action="store_true", help="Check sources without compiling")
    args = parser.parse_args()
    names = args.sheets or list(SHEETS)
    for name in names:
        if name not in SHEETS:
            parser.error(f"Unknown sheet: {name}")
        if args.check:
            check_source(ROOT / name / (name + ".tex"), SHEETS[name])
            print(f"Checked {name}: {SHEETS[name]} exercises")
        else:
            build(name)
