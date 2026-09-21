// Milli Linker 動的OGP (Render Web Service用)
// GET /health          生存確認
// GET /cardOgp?uid=xx&lang=ja  名刺PNG (1200x630)
// GET /cardOgp?demo=1  フォント確認用サンプル
"use strict";
const path = require("path");
const fs = require("fs");
// 同梱フォントをfontconfigに見せる (sharpより前に設定する必要あり)
try {
  const conf = path.join(__dirname, "fonts", "fonts.conf");
  if (fs.existsSync(conf) && !process.env.FONTCONFIG_FILE) {
    process.env.FONTCONFIG_FILE = conf;
  }
} catch (e) {}
const express = require("express");
const sharp = require("sharp");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_BASE = "https://millipro-shared-default-rtdb.asia-southeast1.firebasedatabase.app";

let MEMBERS = [];
try {
  MEMBERS = require(path.join(__dirname, "..", "data", "members.json"));
} catch (e) {
  console.warn("members.json load failed", e.message);
}
// data.js の MEMBERS(ファンネーム等) を副作用なしで読む
let FULL = [];
try {
  const vm = require("vm");
  const src = fs.readFileSync(path.join(__dirname, "..", "data.js"), "utf8");
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(src + '\nthis.__M=(typeof MEMBERS!=="undefined"?MEMBERS:[]);', ctx, { timeout: 5000 });
  if (Array.isArray(ctx.__M)) FULL = ctx.__M;
} catch (e) {
  console.warn("data.js load failed", e.message);
}

async function fetchJson(url, ms) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms || 8000);
  try {
    const r = await fetch(url, { signal: ctl.signal });
    if (!r.ok) return null;
    return await r.json();
  } catch (e) {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function fetchBuffer(url, ms) {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), ms || 8000);
    try {
      const r = await fetch(url, { signal: ctl.signal });
      if (!r.ok) return null;
      const ab = await r.arrayBuffer();
      if (!ab || ab.byteLength > 8 * 1024 * 1024) return null;
      return Buffer.from(ab);
    } finally {
      clearTimeout(t);
    }
  } catch (e) {
    return null;
  }
}

function escXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function renderCardOgp({ name, icon, ultimate, oshiMark, lang }) {
  const W = 1200, H = 630;
  const m = MEMBERS.find((x) => x.id === ultimate) || null;
  const color = m ? m.color : "#7f7efd";
  const full = FULL.find((x) => x.id === ultimate) || null;
  const fanName = (full && full.fanName) || (m && m.fanName) || "";
  const isEn = lang === "en";
  const fJa = "'M PLUS Rounded 1c','Noto Sans JP',sans-serif";
  const fEn = "'Barlow',sans-serif";
  const badgeText = m ? (isEn ? `Fave: ${m.nameEn || m.name}` : `最推し ${m.name}`) : "";
  // バッジ幅: 日英混在を考慮 (ASCII約11px・他約20px @19px前後)
  const badgeW = [...badgeText].reduce((a, c) => a + (c.charCodeAt(0) < 128 ? 11 : 20), 0) + 32;
  const displayName = name || "";

  let iconPng = null;
  if (icon && /^https?:\/\//.test(icon)) {
    const buf = await fetchBuffer(icon);
    if (buf) {
      try {
        iconPng = await sharp(buf).resize(140, 140, { fit: "cover" }).png().toBuffer();
      } catch (e) { iconPng = null; }
    }
  }

  const svg =
    `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">` +
    `<rect width="${W}" height="${H}" fill="#fff"/>` +
    `<rect width="${W}" height="14" fill="${color}"/>` +
    `<rect y="${H - 8}" width="${W}" height="8" fill="${color}" opacity="0.12"/>` +
    `<path d="M744 346 L1200 220 L1200 630 L864 630 Z" fill="${color}" opacity="0.07"/>` +
    `<circle cx="134" cy="154" r="70" fill="#f7f5ff" stroke="${color}" stroke-width="4"/>` +
    `<text x="232" y="175" font-family="${isEn ? fEn : fJa}" font-size="${isEn ? 56 : 62}" font-weight="800" fill="#222">${escXml(displayName)}</text>` +
    `<text x="232" y="215" font-family="${isEn ? fEn : fJa}" font-size="${isEn ? 26 : 28}" font-weight="700" fill="#6b6a7a">${escXml(fanName)}${oshiMark ? ` ${escXml(oshiMark)}` : ""}</text>` +
    (m ? `<g><rect x="232" y="238" rx="14" ry="14" width="${badgeW}" height="28" fill="${color}"/>` +
      `<text x="246" y="257" font-family="${isEn ? fEn : fJa}" font-size="${isEn ? 18 : 19}" font-weight="800" fill="#fff">${escXml(badgeText)}</text></g>` : "") +
    `<text x="64" y="${H - 28}" font-family="${fJa}" font-size="13" font-weight="700" fill="#a8a3c0">Milli Kit  •  Milli Linker  •  非公式ファンメイド</text>` +
    `<text x="${W - 28}" y="${H - 28}" font-family="${fJa}" font-size="10" font-weight="600" fill="#c8c6de" text-anchor="end">1200×630</text>` +
    `</svg>`;

  let base = sharp(Buffer.from(svg));
  if (iconPng) {
    const circleSvg = Buffer.from('<svg width="140" height="140"><circle cx="70" cy="70" r="70" fill="white"/></svg>');
    const masked = await sharp(iconPng).composite([{ input: circleSvg, blend: "dest-in" }]).png().toBuffer();
    base = base.composite([{ input: masked, top: 84, left: 64 }]);
  }
  return base.png().toBuffer();
}

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/cardOgp", async (req, res) => {
  try {
    const lang = req.query.lang === "en" ? "en" : "ja";
    if (req.query.demo === "1") {
      const buf = await renderCardOgp({ name: "ミリちゃん", icon: "", ultimate: "yura", oshiMark: "❄", lang });
      res.set("Content-Type", "image/png");
      res.set("Cache-Control", "no-store");
      return res.send(buf);
    }
    const uid = String(req.query.uid || "");
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(uid)) return res.status(400).send("uid required");
    const data = await fetchJson(`${DB_BASE}/millipro/linker/${encodeURIComponent(uid)}.json`);
    if (!data) return res.status(404).send("not found");
    const buf = await renderCardOgp({
      name: data.name, icon: data.icon, ultimate: data.ultimate,
      oshiMark: data.oshiMark, lang,
    });
    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    res.send(buf);
  } catch (e) {
    console.error("cardOgp failed", e);
    res.status(500).send("render failed");
  }
});

app.get("/", (req, res) => res.send("milli-kit-ogp ok. GET /cardOgp?uid=xx"));

app.listen(PORT, () => console.log(`ogp listening on ${PORT}`));
