"""Generate the OT4ML website favicon from the anisotropic logo geometry."""

from __future__ import annotations

import os
import shutil
from pathlib import Path

os.environ.setdefault("MPLCONFIGDIR", "/private/tmp/mpl-ot4ml-logo")

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import FancyBboxPatch
from PIL import Image

from ot4ml_logo import MetricSpec, draw_logo, ot4ml_points, solve_assignment


HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
ASSET_DIR = ROOT / "assets" / "favicon"
MYST_DIR = ROOT / "myst"
FAVICON_SPEC = MetricSpec("aniso_diag", r"anisotropic $L_2$ $(2,.55)$", "anisotropic", (2.0, 0.55))
PNG_SIZES = (16, 32, 48, 64, 128, 180, 192, 512)
ICO_SIZES = (16, 32, 48, 64)


def render_master(svg_path: Path, png_path: Path, size: int = 512) -> None:
    """Render a square favicon-friendly OT4ML anisotropic OT map."""

    source, target, _ = ot4ml_points()
    assignment = solve_assignment(source, target, FAVICON_SPEC)

    fig, ax = plt.subplots(figsize=(size / 100, size / 100), dpi=100)
    fig.patch.set_alpha(0)
    ax.set_facecolor("none")

    background = FancyBboxPatch(
        (0.035, 0.035),
        0.93,
        0.93,
        boxstyle="round,pad=0,rounding_size=0.18",
        transform=ax.transAxes,
        facecolor="#f8fbff",
        edgecolor="#d8e7f7",
        linewidth=4.0,
        zorder=-20,
    )
    ax.add_patch(background)

    draw_logo(
        ax,
        source,
        target,
        assignment,
        line_alpha=0.50,
        line_width=1.45,
        dot_size=35,
    )

    points = np.vstack([source, target])
    low = points.min(axis=0)
    high = points.max(axis=0)
    center = 0.5 * (low + high)
    span = max(*(high - low)) * 1.08
    ax.set_xlim(center[0] - span / 2, center[0] + span / 2)
    ax.set_ylim(center[1] - span / 2, center[1] + span / 2)
    ax.set_aspect("equal")
    ax.axis("off")
    fig.subplots_adjust(0, 0, 1, 1)

    svg_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(svg_path, transparent=True, pad_inches=0)
    fig.savefig(png_path, transparent=True, pad_inches=0, dpi=100)
    plt.close(fig)


def resize_pngs(master_png: Path, output_dir: Path) -> list[Path]:
    image = Image.open(master_png).convert("RGBA")
    outputs: list[Path] = []
    for size in PNG_SIZES:
        out = output_dir / f"favicon-{size}.png"
        image.resize((size, size), Image.Resampling.LANCZOS).save(out)
        outputs.append(out)
    shutil.copyfile(output_dir / "favicon-180.png", output_dir / "apple-touch-icon.png")
    outputs.append(output_dir / "apple-touch-icon.png")
    return outputs


def write_ico(output_dir: Path) -> Path:
    images = [
        Image.open(output_dir / f"favicon-{size}.png").convert("RGBA")
        for size in ICO_SIZES
    ]
    ico_path = output_dir / "favicon.ico"
    images[-1].save(ico_path, sizes=[(size, size) for size in ICO_SIZES], append_images=images[:-1])
    return ico_path


def copy_site_icons(output_dir: Path) -> None:
    for name in ("favicon.ico", "favicon.svg", "apple-touch-icon.png"):
        shutil.copyfile(output_dir / name, ROOT / name)
        shutil.copyfile(output_dir / name, MYST_DIR / name)


def generate_favicon() -> list[Path]:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    svg_path = ASSET_DIR / "favicon.svg"
    master_png = ASSET_DIR / "favicon-512.png"
    render_master(svg_path, master_png)
    outputs = [svg_path, master_png]
    outputs.extend(resize_pngs(master_png, ASSET_DIR))
    outputs.append(write_ico(ASSET_DIR))
    copy_site_icons(ASSET_DIR)
    outputs.extend(ROOT / name for name in ("favicon.ico", "favicon.svg", "apple-touch-icon.png"))
    outputs.extend(MYST_DIR / name for name in ("favicon.ico", "favicon.svg", "apple-touch-icon.png"))
    return outputs


if __name__ == "__main__":
    for path in generate_favicon():
        print(path.relative_to(ROOT))
