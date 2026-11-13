#!/usr/bin/env bash
# Downloads the original Sound Fortune Productions images into this project.
# Run from the project root:  bash tools/fetch-original-assets.sh
set -euo pipefail
BASE="https://www.soundfortuneproductions.com"
cd "$(dirname "$0")/.."
grep -v '^#' tools/asset-manifest.txt | while read -r src dst; do
  [ -z "${src:-}" ] && continue
  mkdir -p "$(dirname "$dst")"
  echo "↓ $dst"
  curl -fsSL "$BASE/$src" -o "$dst"
done
echo "Done. All original images are now in ./assets"
