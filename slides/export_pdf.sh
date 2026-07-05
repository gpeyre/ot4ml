#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHROME_BIN="${CHROME_BIN:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
OUT_DIR="$ROOT_DIR/pdf"
mkdir -p "$OUT_DIR"

if [[ ! -x "$CHROME_BIN" ]]; then
  echo "Chrome executable not found: $CHROME_BIN" >&2
  echo "Set CHROME_BIN to a Chromium/Chrome executable." >&2
  exit 1
fi

decks=(
  "1-monge-kantorovich"
  "2-entropic-regularization"
  "3-dual-semidiscrete"
  "4-dynamic-flows"
)

for deck in "${decks[@]}"; do
  html="file://$ROOT_DIR/$deck/index.html?print-pdf"
  out="$OUT_DIR/$deck.pdf"
  "$CHROME_BIN" \
    --headless=new \
    --disable-gpu \
    --no-sandbox \
    --allow-file-access-from-files \
    --run-all-compositor-stages-before-draw \
    --virtual-time-budget=10000 \
    --window-size=1280,720 \
    --print-to-pdf="$out" \
    --print-to-pdf-no-header \
    "$html"
  echo "wrote $out"
done

if command -v pdfunite >/dev/null 2>&1; then
  pdfunite \
    "$OUT_DIR/1-monge-kantorovich.pdf" \
    "$OUT_DIR/2-entropic-regularization.pdf" \
    "$OUT_DIR/3-dual-semidiscrete.pdf" \
    "$OUT_DIR/4-dynamic-flows.pdf" \
    "$OUT_DIR/ot4ml-slides-complete.pdf"
  echo "wrote $OUT_DIR/ot4ml-slides-complete.pdf"
fi
