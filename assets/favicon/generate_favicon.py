"""Generate website favicons from the PNG master image.

The canonical favicon set lives in ``assets/favicon``.  A few compatibility
copies are written to the repository root and to ``myst`` because browsers and
the MyST theme expect public icon files at those locations.
"""

from __future__ import annotations

import base64
import shutil
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
ASSET_DIR = ROOT / "assets" / "favicon"
MASTER_PNG = ROOT / "assets" / "favicon.png"
TEMPLATE_PNG = ASSET_DIR / "template.png"
MYST_DIR = ROOT / "myst"
BUILD_DIR = MYST_DIR / "_build"
BUILD_HTML_DIR = MYST_DIR / "_build" / "html"

PNG_SIZES = (16, 32, 48, 64, 128, 180, 192, 512)
ICO_SIZES = (16, 32, 48, 64)
SITE_ICON_FILES = ("favicon.ico", "favicon.svg", "apple-touch-icon.png")
SITE_ICON_DESTINATIONS = (
    ROOT,
    MYST_DIR,
    BUILD_HTML_DIR,
    BUILD_DIR
    / "templates"
    / "site"
    / "myst"
    / "book-theme"
    / "public",
    BUILD_DIR
    / "templates"
    / "site"
    / "myst"
    / "book-theme"
    / "book-theme-main"
    / "public",
)


def source_png() -> Path:
    if MASTER_PNG.exists():
        return MASTER_PNG
    if TEMPLATE_PNG.exists():
        shutil.copyfile(TEMPLATE_PNG, MASTER_PNG)
        return MASTER_PNG
    raise FileNotFoundError("Expected assets/favicon.png or assets/favicon/template.png")


def square_image(path: Path) -> Image.Image:
    with Image.open(path) as raw_image:
        image = raw_image.convert("RGBA")
    if image.width == image.height:
        return image
    size = max(image.width, image.height)
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    canvas.paste(image, ((size - image.width) // 2, (size - image.height) // 2))
    return canvas


def write_pngs(master: Image.Image) -> list[Path]:
    outputs: list[Path] = []
    for size in PNG_SIZES:
        output = ASSET_DIR / f"favicon-{size}.png"
        master.resize((size, size), Image.Resampling.LANCZOS).save(output)
        outputs.append(output)
    shutil.copyfile(ASSET_DIR / "favicon-180.png", ASSET_DIR / "apple-touch-icon.png")
    outputs.append(ASSET_DIR / "apple-touch-icon.png")
    return outputs


def write_ico(master: Image.Image) -> Path:
    ico_path = ASSET_DIR / "favicon.ico"
    master.save(ico_path, format="ICO", sizes=[(size, size) for size in ICO_SIZES])
    return ico_path


def write_svg(png_path: Path) -> Path:
    encoded = base64.b64encode(png_path.read_bytes()).decode("ascii")
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
        f'<image href="data:image/png;base64,{encoded}" x="0" y="0" '
        'width="512" height="512" preserveAspectRatio="xMidYMid meet"/>'
        "</svg>\n"
    )
    svg_path = ASSET_DIR / "favicon.svg"
    svg_path.write_text(svg, encoding="utf8")
    return svg_path


def copy_site_icons() -> list[Path]:
    copied: list[Path] = []
    for destination in SITE_ICON_DESTINATIONS:
        if not destination.exists():
            continue
        for name in SITE_ICON_FILES:
            target = destination / name
            shutil.copyfile(ASSET_DIR / name, target)
            copied.append(target)
    return copied


def generate_favicon() -> list[Path]:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    source = source_png()
    master = square_image(source)
    outputs = [source]
    outputs.extend(write_pngs(master))
    outputs.append(write_ico(master))
    outputs.append(write_svg(ASSET_DIR / "favicon-512.png"))
    outputs.extend(copy_site_icons())
    return outputs


if __name__ == "__main__":
    for path in generate_favicon():
        print(path.relative_to(ROOT))
