#!/bin/bash
# Render build時に日本語フォントを導入 (OGPの豆腐化防止)
# $HOMEがビルド時と実行時で違う場合に備え、サービス内 ./fonts に同梱する
set -eu
mkdir -p fonts
rm -f fonts/*.ttf
cd fonts
dl() { curl -fSL -o "$1" "$2"; }
dl "rounded-800.ttf" "https://cdn.jsdelivr.net/fontsource/fonts/m-plus-rounded-1c@latest/japanese-800-normal.ttf"
dl "rounded-700.ttf" "https://cdn.jsdelivr.net/fontsource/fonts/m-plus-rounded-1c@latest/japanese-700-normal.ttf"
dl "noto-700.ttf" "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-700-normal.ttf"
dl "noto-400.ttf" "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-400-normal.ttf"
dl "barlow-800.ttf" "https://cdn.jsdelivr.net/fontsource/fonts/barlow@latest/latin-800-normal.ttf"
cd ..
DIR="$PWD/fonts"
cat > fonts/fonts.conf <<EOF
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${DIR}</dir>
  <include ignore_missing="yes">/etc/fonts/fonts.conf</include>
</fontconfig>
EOF
# 念のためユーザーホームにも配置
mkdir -p ~/.fonts 2>/dev/null || true
cp fonts/*.ttf ~/.fonts/ 2>/dev/null || true
if command -v fc-cache >/dev/null 2>&1; then
  fc-cache -f ~/.fonts >/dev/null 2>&1 || true
  fc-cache -f "$DIR" >/dev/null 2>&1 || true
  fc-list | grep -i -E "rounded|noto|barlow" || echo "fc-list: custom fonts not visible yet (runtime will use FONTCONFIG_FILE)"
else
  echo "fc-cache not found, skip (runtime will use FONTCONFIG_FILE)"
fi
ls -la fonts/
