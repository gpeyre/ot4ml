"""Render the three retained Gaussian landscapes from the book's notebook.

Run from any directory with NumPy and Matplotlib installed. The notebook and
shared figure style are used only for regeneration; the article builds from
the resulting local PDF without access to the book or notebook directory.
"""

import json
from pathlib import Path
import sys


def main():
    review = Path(__file__).resolve().parents[1]
    notebooks = review.parent / "notebooks-figures"
    notebook = notebooks / "gradflow-gaussian-1d-energy-landscapes.ipynb"
    cells = json.loads(notebook.read_text())["cells"]
    source = "\n".join(
        "".join(cell["source"]) for cell in cells if cell["cell_type"] == "code"
    )
    # Skip the Colab installer: only the existing local scientific runtime is used.
    source = source[source.index("from pathlib import Path\nimport logging") :]
    source = source[: source.index("from IPython.display import Image, display")]
    edits = {
        "OUT = figure_dir(NAME)": "OUT = REVIEW / 'figures' / NAME",
        'THUMBNAIL.parent.mkdir(parents=True, exist_ok=True)':
            'OUT.mkdir(parents=True, exist_ok=True)',
        'fig, axes = plt.subplots(1, 4, figsize=(7.25, 2.02), sharex=True, sharey=True)':
            'PANEL_SPECS = [PANEL_SPECS[i] for i in (0, 1, 3)]\n'
            'fig, axes = plt.subplots(1, 3, figsize=(5.65, 2.02), sharex=True, sharey=True)',
        'save_pdf(fig, OUT / "flows.pdf", pad_inches=0.025)':
            'save_pdf(fig, OUT / "flows-focused.pdf", pad_inches=0.025)',
        'fig.savefig(THUMBNAIL, dpi=220, bbox_inches="tight", pad_inches=0.025)': '',
        'plt.show()': '',
    }
    for old, new in edits.items():
        if source.count(old) != 1:
            raise RuntimeError(f"Notebook layout changed; review the adaptation: {old}")
        source = source.replace(old, new)
    sys.path.insert(0, str(notebooks))
    import matplotlib
    matplotlib.use("Agg")
    exec(compile(source, str(notebook), "exec"), {"REVIEW": review})


if __name__ == "__main__":
    main()
