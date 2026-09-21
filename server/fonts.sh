#!/bin/bash
# Render build時に日本語フォントを導入 (OGPの豆腐化防止)
set -eu
mkdir -p ~/.fonts
cd ~/.fonts
for u in \
  "https://cdn.jsdelivr.net/fontsource/fonts/m-plus-rounded-1c@latest/japanese-800-normal.ttf" \
  "https://cdn.jsdelivr.net/fontsource/fonts/m-plus-rounded-1c@latest/japanese-700-normal.ttf" \
  "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-700-normal.ttf" \
  "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-400-normal.ttf" \
  "https://cdn.jsdelivr.net/fontsource/fonts/barlow@latest/latin-800-normal.ttf" \
  ; do
  curl -fSL -O "$u"
done
if command -v fc-cache >/dev/null 2>&1; then
  fc-cache -f ~/.fonts
  fc-list | grep -i -E "rounded|noto|barlow" || true
else
  echo "fc-cache not found, skip"
fi
