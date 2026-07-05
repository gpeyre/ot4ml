#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v pandoc >/dev/null 2>&1; then
  echo "pandoc is not available on PATH; install Pandoc or run check_slides.py only." >&2
  exit 127
fi

tmpbase="${TMPDIR:-/tmp}"
tmpbase="${tmpbase%/}"
tmpdir="${tmpbase}/ot4ml-slides-smoke"
mkdir -p "${tmpdir}"

decks=(
  "1-monge-kantorovich"
  "2-entropic-regularization"
  "3-dual-semidiscrete"
  "4-dynamic-flows"
)

for deck in "${decks[@]}"; do
  pandoc "${SCRIPT_DIR}/${deck}/index.qmd" \
    -t html \
    -o "${tmpdir}/${deck}.html" \
    >"${tmpdir}/${deck}.log" 2>&1
done

pandoc "${SCRIPT_DIR}/index.html" \
  -t html \
  -o "${tmpdir}/slides-index.html" \
  >"${tmpdir}/slides-index.log" 2>&1

echo "pandoc smoke test ok (${tmpdir})"
