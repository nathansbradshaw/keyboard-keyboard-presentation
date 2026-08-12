#!/usr/bin/env bash
# Regenerates <dir>/slide-manifest.js from that folder's numbered slide
# fragments. Mirrors the dynamic manifest server.rs serves locally, so
# production (a static host with no server logic) stays in sync.
#
# Usage: tools/generate-manifest.sh <dir-relative-to-model-m-talk>
set -euo pipefail

dir="$1"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
target_dir="$script_dir/../$dir"

{
  echo "window.SLIDE_FILES = ["
  for file in "$target_dir"/*.html; do
    name="$(basename "$file")"
    [ "$name" = "index.html" ] && continue
    echo "$name"
  done | LC_COLLATE=C sort | while read -r name; do
    echo "  \"$dir/$name\","
  done
  echo "];"
} > "$target_dir/slide-manifest.js"
