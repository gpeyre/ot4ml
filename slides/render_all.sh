#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v quarto >/dev/null 2>&1; then
  echo "quarto is not available on PATH; install Quarto to render the Reveal.js decks." >&2
  exit 127
fi

cd "${SCRIPT_DIR}"
quarto render
