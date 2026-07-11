"""Validate the standalone, lightweight runtime of OT4ML figure notebooks."""

from __future__ import annotations

import ast
import json
from pathlib import Path
import re


NOTEBOOK_DIR = Path(__file__).resolve().parent
BOOTSTRAP_MARKER = "OT4ML lightweight Colab bootstrap"
PACKAGE_DISTRIBUTIONS = {
    "numpy": "numpy",
    "matplotlib": "matplotlib",
    "IPython": "ipython",
    "scipy": "scipy",
    "ot": "POT",
    "PIL": "Pillow",
    "sklearn": "scikit-learn",
    "fitz": "PyMuPDF",
}


def imported_modules(source: str) -> set[str]:
    """Return top-level modules imported by syntactically valid Python code."""
    tree = ast.parse(source)
    modules: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            modules.update(alias.name.split(".")[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            modules.add(node.module.split(".")[0])
    return modules


def tuple_body(source: str, name: str, following_name: str) -> str:
    """Extract the body of one tuple declaration in a bootstrap cell."""
    match = re.search(
        rf"{name} = \((.*?)\)\n{following_name}",
        source,
        flags=re.DOTALL,
    )
    if match is None:
        raise ValueError(f"cannot parse {name}")
    return match.group(1)


def check_notebook(path: Path) -> list[str]:
    """Return contract violations found in one notebook."""
    notebook = json.loads(path.read_text())
    code_cells = [
        "".join(cell.get("source", []))
        for cell in notebook.get("cells", [])
        if cell.get("cell_type") == "code"
    ]
    bootstrap_cells = [source for source in code_cells if BOOTSTRAP_MARKER in source]
    errors: list[str] = []
    if len(bootstrap_cells) != 1:
        return [f"expected one bootstrap cell, found {len(bootstrap_cells)}"]

    bootstrap = bootstrap_cells[0]
    regular_cells = [source for source in code_cells if BOOTSTRAP_MARKER not in source]
    regular_source = "\n".join(regular_cells)
    if "sys.path." in regular_source:
        errors.append("repository path injection remains")
    if "git clone" in regular_source or "git clone" in bootstrap:
        errors.append("repository cloning remains")

    imports: set[str] = set()
    for index, source in enumerate(code_cells):
        try:
            imports.update(imported_modules(source))
        except SyntaxError as error:
            errors.append(f"code cell {index} has invalid syntax: {error}")

    package_body = tuple_body(
        bootstrap,
        "_OT4ML_PACKAGES",
        "_OT4ML_REQUIRED_FILES",
    )
    packages = dict(
        re.findall(
            r"\(['\"]([^'\"]+)['\"]\s*,\s*['\"]([^'\"]+)['\"]\)",
            package_body,
        )
    )
    expected = {
        module: distribution
        for module, distribution in PACKAGE_DISTRIBUTIONS.items()
        if module in imports
    }
    if packages != expected:
        errors.append(f"package manifest {packages!r} does not match imports {expected!r}")

    file_body = tuple_body(bootstrap, "_OT4ML_REQUIRED_FILES", "ROOT =")
    required_files = re.findall(r"['\"]([^'\"]+)['\"]", file_body)
    for relative_path in required_files:
        if "/thumbnails/" in relative_path:
            errors.append(f"generated thumbnail declared as input: {relative_path}")
        if not (NOTEBOOK_DIR.parent / relative_path).exists():
            errors.append(f"declared input does not exist: {relative_path}")
    return errors


def main() -> None:
    """Check every active figure notebook and exit nonzero on violations."""
    failures = {
        path.name: errors
        for path in sorted(NOTEBOOK_DIR.glob("*.ipynb"))
        if (errors := check_notebook(path))
    }
    if failures:
        for name, errors in failures.items():
            for error in errors:
                print(f"{name}: {error}")
        raise SystemExit(1)
    count = len(list(NOTEBOOK_DIR.glob("*.ipynb")))
    print(f"Validated {count} lightweight standalone figure notebooks.")


if __name__ == "__main__":
    main()
