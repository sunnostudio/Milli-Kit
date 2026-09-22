// Milli Linker 動的OGP (Render Web Service用) — リッチ版
// GET /health, GET /cardOgp?uid=xx, GET /cardOgp?demo=1
// クライアントの linker/ogp.js と同等の描画をサーバー側で再現 (sharp + SVG)
"use strict";
const path = require("path");
const fs = require("fs");
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
try {
  const vm2 = require("vm");
  const src2 = fs.readFileSync(path.join(__dirname, "..", "data", "members.js"), "utf8");
  const ctx2 = {};
  vm2.createContext(ctx2);
  vm2.runInContext(src2 + '\nthis.__L=LINKER_MEMBERS;', ctx2, { timeout: 5000 });
  if (Array.isArray(ctx2.__L)) {
    const map = new Map(MEMBERS.map((m) => [m.id, m]));
    for (const m of ctx2.__L) if (!map.has(m.id)) map.set(m.id, m);
    MEMBERS = Array.from(map.values());
  }
} catch (e) {
  console.warn("linker members load failed", e.message);
}
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

// FANMARK: サーバー側では絵文字フォントを持たないため tofu (□や16進表記) 化を避けるため空白にしている。
// クライアント linker/ogp.js では実際の絵文字を表示するが、サーバーSVGでは Noto/M PLUS しか無いため非表示。
// 必要ならテキスト代替やSVGアイコンに置換可能。現状は fanName/oshiMark で十分な識別性があるため空白を維持。
const FANMARK_EMOJI = {
  konomi:"", nono:"", akubi:"", koma:"", raco:"", yura:"",
  nuhu:"", tsukuri:"", liz:"", rei:"", mahoro:"", aoi:"",
  nova:"", uni:"", sona:""
};
// NOTE: 上記は意図的に空白。linker/ogp.js の FANMARK_EMOJI とは表示が異なるが、サーバーでの豆腐化を防ぐための設計差異。
const GROUP_MEMBERS = {
  nova: ["raco","yura","nuhu","aoi"],
  uni: ["tsukuri","liz","rei"],
  sona: ["nono","akubi","mahoro"]
};
function getMemberById(id){
  const m = MEMBERS.find(x=>x.id===id) || null;
  if(m) return m;
  return null;
}
function getUniformLogoScale(w,h,maxW,maxH,targetDiag){
  targetDiag = targetDiag||210;
  const diag=Math.hypot(w,h);
  const sDiag=targetDiag/diag;
  const dwDiag=w*sDiag, dhDiag=h*sDiag;
  if(dwDiag<=maxW && dhDiag<=maxH) return sDiag;
  return Math.min(maxW/w, maxH/h);
}
function escXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
// --- SSRF / Private IP helpers ---
function isPrivateHost(host){
  const h = String(host).split(":")[0].toLowerCase();
  if(h==="localhost"||h==="127.0.0.1"||h==="::1"||h==="[::1]"||h==="0.0.0.0") return true;
  if(/^10\./.test(h)) return true;
  if(/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;
  if(/^192\.168\./.test(h)) return true;
  if(/^169\.254\./.test(h)) return true;
  if(/^127\./.test(h)) return true;
  // IPv6 link-local / loopback etc
  if(h.startsWith("fc")||h.startsWith("fd")) return true; // unique local
  if(h==="::ffff:127.0.0.1") return true;
  return false;
}
function isAllowedFetchUrl(urlStr){
  try{
    const u = new URL(urlStr);
    if(u.protocol!=="https:") return false;
    if(isPrivateHost(u.hostname)) return false;
    // Optional allowlist for icon sources (public CDN only). Allow any public https by default,
    // but you can restrict to known hosts:
    // const allowedHosts = ["res.cloudinary.com","pbs.twimg.com","api.qrserver.com"];
    // const allowedSuffixes = [".googleusercontent.com",".cloudinary.com"];
    // const host = u.hostname.toLowerCase();
    // const ok = allowedHosts.includes(host) || allowedSuffixes.some(sfx=>host.endsWith(sfx));
    // if(!ok) return false;
    return true;
  }catch(e){ return false; }
}
// --- Text measurement helpers (server-side heuristic, no canvas) ---
function estimateTextWidth(text, fontSize){
  let w=0;
  const s = String(text);
  for(const ch of s){
    const code = ch.charCodeAt(0);
    if(code < 128){
      w += fontSize * 0.56;
    } else if(code >= 0x3000){
      w += fontSize * 0.95;
    } else {
      w += fontSize * 0.62;
    }
  }
  return w;
}
function fitNameToWidth(text, maxWidth, initialSize){
  let size = initialSize;
  let display = String(text);
  let w = estimateTextWidth(display, size);
  while(w > maxWidth && size > 36){
    size -= 4;
    w = estimateTextWidth(display, size);
  }
  if(w <= maxWidth) return {text: display, size};
  const ellipsis="...";
  const ellW = estimateTextWidth(ellipsis, size);
  while(display.length > 1 && estimateTextWidth(display, size) + ellW > maxWidth){
    display = display.slice(0, -1);
  }
  return {text: display + ellipsis, size};
}

async function fetchJson(url, ms) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms || 8000);
  try {
    const r = await fetch(url, { signal: ctl.signal });
    if (!r.ok) {
      if(r.status===404) return null; // not found -> caller will 404
      const err = new Error(`fetchJson failed ${r.status} for ${url}`);
      err.status = r.status;
      throw err;
    }
    return await r.json();
  } catch (e) {
    if(e && e.name==="AbortError"){
      const err = new Error(`fetchJson timeout for ${url}`);
      err.status = 504;
      err.cause = e;
      throw err;
    }
    if(e && typeof e.status==="number") throw e;
    const err2 = new Error(`fetchJson network error for ${url}: ${e && e.message}`);
    err2.status = 502;
    err2.cause = e;
    throw err2;
  } finally { clearTimeout(t); }
}
async function fetchBuffer(url, ms) {
  if(!url || typeof url!=="string") return null;
  // data: URLs are handled separately in renderCardOgp, not here
  if(url.startsWith("data:")) return null;
  if(!isAllowedFetchUrl(url)) return null;
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), ms || 8000);
    try {
      const r = await fetch(url, { signal: ctl.signal });
      if (!r.ok) return null;
      const ab = await r.arrayBuffer();
      if (!ab || ab.byteLength > 8 * 1024 * 1024) return null;
      // basic content-type check: must be image/*
      const ct = r.headers.get("content-type")||"";
      if(ct && !ct.startsWith("image/") && !ct.startsWith("application/octet-stream")){
        // allow QR server which returns image/png, but block unexpected types like text/html
        // be permissive: only block obvious non-images
        if(ct.startsWith("text/")) return null;
      }
      return Buffer.from(ab);
    } finally { clearTimeout(t); }
  } catch (e) { return null; }
}
async function loadLocalImageBuffer(relPath){
  // relPath like "images/talents/yura.webp" or "../images/..."
  try{
    let p = relPath;
    if(p.startsWith("../")) p = p.slice(3);
    if(p.startsWith("./")) p = p.slice(2);
    const abs = path.join(__dirname, "..", p);
    if(!fs.existsSync(abs)) return null;
    const buf = fs.readFileSync(abs);
    return buf;
  }catch(e){ return null; }
}
async function getImageMeta(buf){
  try{ const m = await sharp(buf).metadata(); return m; }catch(e){ return null; }
}

async function renderCardOgp(opts){
  const W=1200,H=630;
  const name=opts.name||"", icon=opts.icon||"", ultimate=opts.ultimate||"", lang=opts.lang||"ja";
  const fontJa=opts.fontJa||"'M PLUS Rounded 1c','Noto Sans JP',sans-serif";
  const fontEn=opts.fontEn||"'Barlow',sans-serif";
  const xHandle=opts.xHandle||"", oshiHistory=opts.oshiHistory||"", favCount=opts.favCount||0;
  const oshiMark=opts.oshiMark||"", shoulderTitle=opts.shoulderTitle||"";
  const birthday=opts.birthday||"", birthdayPublic=opts.birthdayPublic||"monthDay";
  // gallery is passed from client for future use but currently not rendered in server OGP (uses talent watermark instead)
  // kept for API compatibility; document unused
  const _gallery = Array.isArray(opts.gallery)?opts.gallery.slice(0,3):[];
  const m = MEMBERS.find(x=>x.id===ultimate) || null;
  const color = m ? m.color : "#7f7efd";
  const subColor = m ? (m.subColor || color+"22") : "#e5e3f2";
  let fanName=""; try{ const full=FULL.find(x=>x.id===ultimate); if(full) fanName=full.fanName||""; }catch(e){} if(!fanName && m) fanName=m.fanName||"";
  const fanMarkEmojis = FANMARK_EMOJI[ultimate] || "";
  const isEn = lang==="en" && /^[\x00-\x7F]*$/.test(name) && /[A-Za-z]/.test(name);
  // Load images
  let iconPng=null, ultimateLogoBuf=null, ultimateLogoMeta=null, siteLogoBuf=null, siteLogoMeta=null, qrBuf=null;
  let talentBufs=[]; // for watermark
  let groupIds = GROUP_MEMBERS[ultimate] || null;

  // icon — SSRF protected: only https and non-private hosts, or data:image/
  if(icon && icon.startsWith("data:image/")){
    try{
      const b64=icon.split(",")[1];
      if(b64){
        const buf=Buffer.from(b64,"base64");
        if(buf.length<=8*1024*1024) iconPng=await sharp(buf).resize(168,168,{fit:"cover"}).png().toBuffer();
      }
    }catch(e){}
  } else if(icon && icon.startsWith("https://")){
    if(isAllowedFetchUrl(icon)){
      const b=await fetchBuffer(icon);
      if(b) try{ iconPng=await sharp(b).resize(168,168,{fit:"cover"}).png().toBuffer(); }catch(e){}
    }
  }

  // ultimate logo
  if(ultimate){
    const mm = getMemberById(ultimate);
    if(mm && mm.logo){
      let p = mm.logo;
      if(p.startsWith("http")){
        if(isAllowedFetchUrl(p)){
          const b=await fetchBuffer(p);
          if(b){ ultimateLogoBuf=b; ultimateLogoMeta=await getImageMeta(b); }
        } else {
          // fallback to local if allowlist blocked? try local
          const b=await loadLocalImageBuffer(p);
          if(b){ ultimateLogoBuf=b; ultimateLogoMeta=await getImageMeta(b); }
        }
      } else {
        const b=await loadLocalImageBuffer(p);
        if(b){ ultimateLogoBuf=b; ultimateLogoMeta=await getImageMeta(b); }
      }
    }
  }
  // site logo
  try{
    const b=await loadLocalImageBuffer("images/rogo/milli-linker-rogo.png");
    if(b){ siteLogoBuf=b; siteLogoMeta=await getImageMeta(b); }
  }catch(e){}

  // QR — generate from uid (qrData is trusted, constructed server-side)
  if(opts.qrData){
    const qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(opts.qrData)}`;
    // qrUrl is allowlisted (api.qrserver.com) and uses https, safe
    const b=await fetchBuffer(qrUrl);
    if(b) qrBuf=b;
  }

  // talent watermark bufs
  if(groupIds){
    for(const gid of groupIds){
      const gm = getMemberById(gid);
      if(!gm || !gm.img) continue;
      let b=null;
      if(gm.img.startsWith("http")){
        if(isAllowedFetchUrl(gm.img)) b=await fetchBuffer(gm.img);
      } else {
        b=await loadLocalImageBuffer(gm.img);
      }
      if(b) talentBufs.push({id:gid, buf:b, meta:await getImageMeta(b)});
    }
  } else if(ultimate){
    const mm=getMemberById(ultimate);
    if(mm && mm.img){
      let b=null;
      if(mm.img.startsWith("http")){
        if(isAllowedFetchUrl(mm.img)) b=await fetchBuffer(mm.img);
      } else b=await loadLocalImageBuffer(mm.img);
      if(b) talentBufs.push({id:ultimate, buf:b, meta:await getImageMeta(b)});
    }
  }

  // Compute ultimate logo size
  let ultimateDw=0, ultimateDh=0;
  if(ultimateLogoBuf && ultimateLogoMeta){
    const isKoma = ultimate==="koma";
    const maxW=264, maxH=isKoma?78:72;
    const targetDiag=isKoma?235:210;
    let s=getUniformLogoScale(ultimateLogoMeta.width, ultimateLogoMeta.height, maxW, maxH, targetDiag);
    ultimateDw=ultimateLogoMeta.width*s; ultimateDh=ultimateLogoMeta.height*s;
    if(ultimateDw>maxW || ultimateDh>maxH){
      const cs=Math.min(maxW/ultimateLogoMeta.width, maxH/ultimateLogoMeta.height);
      ultimateDw=ultimateLogoMeta.width*cs; ultimateDh=ultimateLogoMeta.height*cs;
    }
  }

  // Build base SVG for background + text
  const subParts=[];
  if(xHandle) subParts.push(`@${String(xHandle).replace(/^@/,"")}`);
  if(oshiHistory) subParts.push(oshiHistory);
  const subLine = subParts.join("  •  ");

  // layout positions
  const iconX=56, iconY=72, iconR=84;
  const textX=iconX+iconR*2+32; // 256
  const nameY=168;
  let shoulderY = nameY+26;
  let subY = shoulderTitle ? shoulderY+8 : nameY+32;
  // we will compute fanY etc via SVG coordinates directly
  const badgeText = m ? (isEn?`Fave: ${m.nameEn||m.name}`:`最推し ${m.name}`) : "";
  // Badge width: use estimateTextWidth for accurate sizing (font size 19/18)
  const badgeFontSize = isEn?18:19;
  const badgePadX=16;
  const badgeW = badgeText ? Math.ceil(estimateTextWidth(badgeText, badgeFontSize) + badgePadX*2 + 4) : 0;

  // Name overflow handling: measure available width and shrink/truncate
  const availableNameW = W - textX - 32 - 8; // right padding, logo is top-right not overlapping but reserve a bit
  // If ultimate logo is wide, ensure name doesn't collide visually (logo is at y=28, name at y=168, so no direct overlap, but keep margin)
  const initialNameSize = isEn?68:70;
  const fittedName = fitNameToWidth(name, availableNameW, initialNameSize);
  const nameDisplay = fittedName.text;
  const nameFontSize = fittedName.size;

  // Build SVG string
  let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  svg+=`<rect width="${W}" height="${H}" fill="#fff"/>`;
  svg+=`<rect width="${W}" height="14" fill="${color}"/>`;
  svg+=`<rect y="${H-8}" width="${W}" height="8" fill="${color}" opacity="0.12"/>`;
  // dot pattern
  svg+=`<g opacity="0.32">`;
  for(let dx=0; dx<W; dx+=28){
    for(let dy=18; dy<H-12; dy+=28){
      if((dx+dy)%56===0){
        svg+=`<circle cx="${dx+14}" cy="${dy}" r="1.2" fill="${escXml(subColor)}"/>`;
      }
    }
  }
  svg+=`</g>`;
  // diamond
  svg+=`<g transform="translate(${W*0.92},${H*0.58}) rotate(-14)">`;
  svg+=`<path d="M 0 -190 L ${190*0.72} 0 L 0 190 L ${-190*0.72} 0 Z" fill="none" stroke="${color}" stroke-opacity="0.5" stroke-width="1.8"/>`;
  svg+=`</g>`;
  svg+=`<path d="M${W*0.62} ${H*0.55} L${W} ${H*0.35} L${W} ${H} L${W*0.72} ${H} Z" fill="${color}" opacity="0.12"/>`;

  // Text: name (fitted)
  svg+=`<text x="${textX}" y="${nameY}" font-family="${escXml(isEn?fontEn:fontJa)}" font-size="${nameFontSize}" font-weight="800" fill="#222">${escXml(nameDisplay)}</text>`;
  // shoulder — add extra line spacing to avoid overlap with subLine on server fonts
  if(shoulderTitle){
    svg+=`<text x="${textX}" y="${shoulderY}" font-family="${escXml(isEn?fontEn:fontJa)}" font-size="22" font-weight="600" fill="#6b6a7a">${escXml(shoulderTitle)}</text>`;
    shoulderY += 8; // extra padding for server font metrics
  }
  // sub (x + oshiHistory)
  if(subLine){
    // move subLine a bit lower when shoulder exists to avoid overlap (verified: +12 avoids tofu overlap)
    const subYAdj = shoulderTitle ? subY+12 : subY;
    svg+=`<text x="${textX}" y="${subYAdj}" font-family="${escXml(isEn?fontEn:fontJa)}" font-size="20" font-weight="600" fill="#6b6a7a">${escXml(subLine)}</text>`;
  }
  // fanMark + fanName + oshiMark + favCount + badge
  {
    // use adjusted subY when shoulder exists (extra 12px added for server font)
    let fy = subLine ? (shoulderTitle ? subY+50 : subY+38) : (shoulderTitle? shoulderY+38 : nameY+40);
    let tspan = "";
    if(fanMarkEmojis){
      tspan += `<tspan fill="#6b6a7a">${escXml(fanMarkEmojis)}</tspan><tspan dx="10"></tspan>`;
    }
    if(fanName){
      tspan += `<tspan fill="#6b6a7a">${escXml(fanName)}</tspan><tspan dx="10"></tspan>`;
    }
    if(oshiMark){
      tspan += `<tspan fill="${escXml(color)}">${escXml(oshiMark)}</tspan>`;
    }
    // 同一行に収める場合は1つの<text>にtspanを連ねて被りを防ぐ（novaのみ改行）
    if(tspan){
      if(favCount>0 && ultimate!=="nova"){
        // fanName/oshiMark と同じ行に「他○推し」を追記 — 被り対策で同一text内のtspanにする
        tspan += `<tspan dx="8" font-size="20" font-weight="600" fill="#6b6a7a">${escXml(`他${favCount}推し`)}</tspan>`;
        svg+=`<text x="${textX}" y="${fy}" font-family="${escXml(isEn?fontEn:fontJa)}" font-size="${isEn?32:34}" font-weight="700">${tspan}</text>`;
      } else {
        svg+=`<text x="${textX}" y="${fy}" font-family="${escXml(isEn?fontEn:fontJa)}" font-size="${isEn?32:34}" font-weight="700">${tspan}</text>`;
        if(favCount>0 && ultimate==="nova"){
          svg+=`<text x="${textX}" y="${fy+30}" font-family="${escXml(isEn?fontEn:fontJa)}" font-size="20" font-weight="600" fill="#6b6a7a">${escXml(`他${favCount}推し`)}</text>`;
        }
      }
    } else {
      if(favCount>0){
        svg+=`<text x="${textX}" y="${fy}" font-family="${escXml(isEn?fontEn:fontJa)}" font-size="20" font-weight="600" fill="#6b6a7a">${escXml(`他${favCount}推し`)}</text>`;
      }
    }
    // badge + birthday — tspanが空でも表示（グループでfanName無しでもバッジは出す）
    if(m){
      let wrapExtra = (ultimate==="nova" && favCount>0) ? 30 : 0;
      let badgeY = fy+34+wrapExtra;
      // tspanが空でsubLineも肩書きも無い場合の微調整は不要だが、fyが既に計算済みなのでそのまま
      const padX=16, bw=badgeW, bh=30;
      const bx=textX, by=badgeY-20;
      svg+=`<rect x="${bx}" y="${by}" rx="15" ry="15" width="${bw}" height="${bh}" fill="${escXml(color)}"/>`;
      svg+=`<text x="${bx+padX}" y="${by+20}" font-family="${escXml(isEn?fontEn:fontJa)}" font-size="${badgeFontSize}" font-weight="800" fill="#fff">${escXml(badgeText)}</text>`;
      if(birthday && birthdayPublic!=="hidden"){
        const mm=birthday.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if(mm){
          const bdayText = birthdayPublic==="full" ? `${mm[1]}/${mm[2]}/${mm[3]}` : `${mm[2]}/${mm[3]}`;
          const bdayFontSize=14;
          const iconW=14, bPadX=10, bTw=estimateTextWidth(bdayText, bdayFontSize), bW=Math.ceil(bTw+iconW+6+bPadX*2), bH=26;
          const bX=bx+bw+10, bY=by+2;
          svg+=`<rect x="${bX}" y="${bY}" rx="13" ry="13" width="${bW}" height="${bH}" fill="#fff" stroke="${escXml(color)}" stroke-opacity="0.27" stroke-width="1.5"/>`;
          // Vector birthday cake icon instead of emoji (tofu avoidance)
          svg+=`<g transform="translate(${bX+bPadX+6},${bY+bH/2}) scale(0.85)"><g stroke="#6b6a7a" fill="none" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M -6 -2 L 6 -2 L 6 6 L -6 6 Z"/><path d="M -6 -2 C -6 -6 6 -6 6 -2"/><path d="M -6 2 L 6 2"/><path d="M 0 -6 L 0 -10"/><circle cx="0" cy="-11.5" r="1.4" fill="#6b6a7a" stroke="none"/></g></g>`;
          svg+=`<text x="${bX+bPadX+iconW+6}" y="${bY+17}" font-family="${escXml(fontJa)}" font-size="${bdayFontSize}" font-weight="700" fill="#6b6a7a">${escXml(bdayText)}</text>`;
        }
      }
    } else if(birthday && birthdayPublic!=="hidden"){
      const mm=birthday.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if(mm){
        const bdayText = birthdayPublic==="full" ? `${mm[1]}/${mm[2]}/${mm[3]}` : `${mm[2]}/${mm[3]}`;
        let badgeY = fy+34 + ((ultimate==="nova"&&favCount>0)?30:0);
        const bdayFontSize=14;
        const iconW=14, bPadX=10, bTw=estimateTextWidth(bdayText, bdayFontSize), bW=Math.ceil(bTw+iconW+6+bPadX*2), bH=26;
        const bX=textX, bY=badgeY-20+2;
        svg+=`<rect x="${bX}" y="${bY}" rx="13" ry="13" width="${bW}" height="${bH}" fill="#fff" stroke="${escXml(color)}" stroke-opacity="0.27" stroke-width="1.5"/>`;
        svg+=`<g transform="translate(${bX+bPadX+6},${bY+bH/2}) scale(0.85)"><g stroke="#6b6a7a" fill="none" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M -6 -2 L 6 -2 L 6 6 L -6 6 Z"/><path d="M -6 -2 C -6 -6 6 -6 6 -2"/><path d="M -6 2 L 6 2"/><path d="M 0 -6 L 0 -10"/><circle cx="0" cy="-11.5" r="1.4" fill="#6b6a7a" stroke="none"/></g></g>`;
        svg+=`<text x="${bX+bPadX+iconW+6}" y="${bY+17}" font-family="${escXml(fontJa)}" font-size="${bdayFontSize}" font-weight="700" fill="#6b6a7a">${escXml(bdayText)}</text>`;
      }
    }
  }

  // footer site name
  svg+=`<text x="64" y="${H-28}" font-family="${escXml(fontJa)}" font-size="13" font-weight="700" fill="#a8a3c0">Milli Kit  •  Milli Linker  •  非公式ファンメイド</text>`;
  svg+=`<text x="${W-28}" y="${H-14}" font-family="${escXml(fontJa)}" font-size="10" font-weight="600" fill="#c8c6de" text-anchor="end">非公式ファンメイド</text>`;
  svg+=`</svg>`;

  // Render base SVG to PNG buffer
  let base = sharp(Buffer.from(svg)).png();

  // Composite layers: watermark, icon, logos, QR
  let composites=[];

  // Watermark
  if(groupIds && talentBufs.length){
    const tw=504, th=552, tx=W - tw - 18, ty=H - th - 18;
    const gIds=GROUP_MEMBERS[ultimate];
    const VISUAL_FIX={ mahoro:1.16, akubi:1.07 };
    const SONA_DOWN=(ultimate==="sona")?0.93:1;
    if(talentBufs.length===3){
      const baseW=296, baseH=390;
      const thumbW0=baseW*1.2, thumbH0=baseH*1.2;
      const positions=[
        {x: tx+tw/2-thumbW0/2, y: ty+2, w: thumbW0, h: thumbH0},
        {x: tx+8, y: ty+th-baseH-6, w: baseW, h: baseH},
        {x: tx+tw-baseW-8, y: ty+th-baseH-2, w: baseW, h: baseH},
      ];
      for(let idx=0; idx<talentBufs.length; idx++){
        const tb=talentBufs[idx];
        const mId=gIds[idx];
        const yOff=(mId==="aoi"?10:(mId==="tsukuri"||mId==="tukuri"?6:0));
        const pos=positions[idx];
        const pw=pos.w, ph=pos.h;
        const fix=(VISUAL_FIX[mId]||1)*SONA_DOWN;
        const scale=Math.min(pw/tb.meta.width, ph/tb.meta.height)*fix;
        const dw=Math.round(tb.meta.width*scale), dh=Math.round(tb.meta.height*scale);
        const dx=Math.round(pos.x + (pw-dw)/2), dy=Math.round(pos.y + (ph-dh) + yOff);
        try{
          const resized=await sharp(tb.buf).resize(dw,dh,{fit:"inside"}).png().toBuffer();
          composites.push({input:resized, left:dx, top:dy});
        }catch(e){}
      }
    } else {
      const baseW=265, baseH=359;
      const bigW=Math.round(baseW*1.2), bigH=Math.round(baseH*1.2);
      const positions=[
        {x: tx+4, y: ty+4, w: bigW, h: bigH},
        {x: tx+tw-baseW-4, y: ty+12, w: baseW, h: baseH},
        {x: tx+8, y: ty+th-baseH-4, w: baseW, h: baseH},
        {x: tx+tw-baseW-8, y: ty+th-baseH-2, w: baseW, h: baseH},
      ];
      for(let idx=0; idx<talentBufs.length; idx++){
        const tb=talentBufs[idx];
        const mId=gIds[idx];
        const yOff=(mId==="aoi"?10:(mId==="tsukuri"||mId==="tukuri"?6:0));
        const pos=positions[idx];
        const pw=pos.w, ph=pos.h;
        const fix=VISUAL_FIX[mId]||1;
        const scale=Math.min(pw/tb.meta.width, ph/tb.meta.height)*fix;
        const dw=Math.round(tb.meta.width*scale), dh=Math.round(tb.meta.height*scale);
        const dx=Math.round(pos.x + (pw-dw)/2), dy=Math.round(pos.y + (ph-dh) + yOff);
        try{
          const resized=await sharp(tb.buf).resize(dw,dh,{fit:"inside"}).png().toBuffer();
          composites.push({input:resized, left:dx, top:dy});
        }catch(e){}
      }
    }
  } else if(talentBufs.length===1){
    const tb=talentBufs[0];
    const tw=420, th=460, tx=W - tw - 18, ty=H - th - 18;
    // FIX: use inside (Math.min) to fit within watermark box, not cover (Math.max) which overflows
    const scale=Math.min(tw/tb.meta.width, th/tb.meta.height);
    const dw=Math.round(tb.meta.width*scale), dh=Math.round(tb.meta.height*scale);
    const dx=Math.round(tx + tw/2 - dw/2);
    const yOff2 = ultimate==="aoi" ? 26 : (ultimate==="tsukuri"||ultimate==="tukuri"?14:0);
    const dy=Math.round(ty + th - dh + yOff2);
    try{
      const resized=await sharp(tb.buf).resize(dw,dh,{fit:"inside"}).png().toBuffer();
      composites.push({input:resized, left:dx, top:dy});
    }catch(e){}
  }

  // Icon (circle mask)
  if(iconPng){
    const circleSvg=Buffer.from('<svg width="168" height="168"><circle cx="84" cy="84" r="84" fill="white"/></svg>');
    const masked=await sharp(iconPng).composite([{input:circleSvg, blend:"dest-in"}]).png().toBuffer();
    composites.push({input:masked, left:iconX, top:iconY});
    // border circle via SVG overlay
    const borderSvg=Buffer.from(`<svg width="168" height="168" xmlns="http://www.w3.org/2000/svg"><circle cx="84" cy="84" r="82" fill="none" stroke="${escXml(color)}" stroke-width="5"/></svg>`);
    composites.push({input:borderSvg, left:iconX, top:iconY});
  } else {
    // fallback initials already in SVG? add circle with initials via composite
    const initials = escXml((nameDisplay||name||"?").slice(0,2));
    const initSvg = `<svg width="168" height="168" xmlns="http://www.w3.org/2000/svg"><circle cx="84" cy="84" r="84" fill="#f7f5ff" stroke="${escXml(color)}" stroke-width="5"/><text x="84" y="96" font-family="${escXml(fontJa)}" font-size="50" font-weight="700" fill="${escXml(color)}" text-anchor="middle">${initials}</text></svg>`;
    composites.push({input:Buffer.from(initSvg), left:iconX, top:iconY});
  }

  // Ultimate logo
  if(ultimateLogoBuf && ultimateLogoMeta){
    try{
      const resized=await sharp(ultimateLogoBuf).resize(Math.round(ultimateDw), Math.round(ultimateDh), {fit:"inside"}).png().toBuffer();
      composites.push({input:resized, left: W - Math.round(ultimateDw) - 28, top: 28});
    }catch(e){}
  }
  // Site logo
  if(siteLogoBuf && siteLogoMeta){
    try{
      const maxW=240, maxH=48;
      const scale=Math.min(maxW/siteLogoMeta.width, maxH/siteLogoMeta.height);
      const dw=Math.round(siteLogoMeta.width*scale), dh=Math.round(siteLogoMeta.height*scale);
      const resized=await sharp(siteLogoBuf).resize(dw,dh,{fit:"inside"}).png().toBuffer();
      composites.push({input:resized, left:64, top: H - dh - 18});
    }catch(e){}
  }
  // QR
  if(qrBuf){
    try{
      const qs=96;
      const qx=W - qs - 20, qy=H - qs - 20;
      // white bg + border
      const bgSvg=Buffer.from(`<svg width="${qs+12}" height="${qs+12}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${qs+12}" height="${qs+12}" rx="10" ry="10" fill="#fff" stroke="#e5e3f2" stroke-width="1"/></svg>`);
      composites.push({input:bgSvg, left:qx-6, top:qy-6});
      const resized=await sharp(qrBuf).resize(qs,qs,{fit:"cover"}).png().toBuffer();
      composites.push({input:resized, left:qx, top:qy});
    }catch(e){}
  }

  // Composite all onto base
  if(composites.length){
    base = base.composite(composites);
  }
  return base.png().toBuffer();
}

app.get("/health", (req,res)=>res.json({ok:true}));
app.get("/cardOgp", async (req,res)=>{
  try{
    const lang = req.query.lang==="en"?"en":"ja";
    if(req.query.demo==="1"){
      const buf=await renderCardOgp({name:"ミリちゃん", icon:"", ultimate:"yura", oshiMark:"❄", shoulderTitle:"", xHandle:"", oshiHistory:"", favCount:0, birthday:"", birthdayPublic:"monthDay", lang, qrData:`${req.protocol}://${req.get('host')}/linker/view.html?uid=demo`});
      res.set("Content-Type","image/png"); res.set("Cache-Control","no-store"); return res.send(buf);
    }
    const uid=String(req.query.uid||"");
    if(!/^[A-Za-z0-9_-]{1,128}$/.test(uid)) return res.status(400).send("uid required");
    let data=null;
    try{
      data=await fetchJson(`${DB_BASE}/millipro/linker/${encodeURIComponent(uid)}.json`);
    }catch(e){
      if(e && e.status===504) return res.status(504).send("upstream timeout");
      if(e && e.status===502) return res.status(502).send("upstream error");
      if(e && e.status) return res.status(e.status).send("fetch failed");
      throw e;
    }
    if(!data) return res.status(404).send("not found");
    // extract fields
    const favCount = Array.isArray(data.favs)? data.favs.length : 0;
    let xHandle="";
    if(data.xUrl){
      const raw=String(data.xUrl).trim();
      if(/^https?:\/\//.test(raw)){
        try{ const u=new URL(raw); const hd=u.pathname.split("/")[1]||""; if(/^[A-Za-z0-9_]{1,15}$/.test(hd)) xHandle=hd; }catch(e){ xHandle=raw.replace(/^@/,"").split("/")[0]; }
      } else {
        const hd=raw.replace(/^@/,"").split("/")[0];
        if(/^[A-Za-z0-9_]{1,15}$/.test(hd)) xHandle=hd; else xHandle=raw;
      }
    }
    // fallback from sns if xHandle empty
    if(!xHandle && Array.isArray(data.sns)){
      const xSns=data.sns.find(s=>s.type==="x"&&s.url);
      if(xSns){
        const raw=String(xSns.url);
        if(/^https?:\/\//.test(raw)){
          try{ const u=new URL(raw); const hd=u.pathname.split("/")[1]||""; if(/^[A-Za-z0-9_]{1,15}$/.test(hd)) xHandle=hd; }catch(e){}
        }
      }
    }
    const buf=await renderCardOgp({
      name:data.name, icon:data.icon, ultimate:data.ultimate, oshiMark:data.oshiMark||"",
      shoulderTitle:data.title||"", xHandle, oshiHistory:data.oshiHistory||"",
      favCount, birthday:data.birthday||"", birthdayPublic:data.birthdayPublic||"monthDay",
      lang, qrData:`https://milli-kit.pages.dev/linker/view.html?uid=${encodeURIComponent(uid)}`,
      gallery: Array.isArray(data.gallery)?data.gallery.slice(0,3):[]
    });
    res.set("Content-Type","image/png");
    // caching: public 5min, CDN 10min, with stale-while-revalidate for OGP
    res.set("Cache-Control","public, max-age=300, s-maxage=600, stale-while-revalidate=60");
    res.send(buf);
  }catch(e){
    console.error("cardOgp failed", e);
    // differentiate upstream errors already handled above; default 500
    if(e && e.status && e.status>=400 && e.status<600) return res.status(e.status).send(e.message||"error");
    res.status(500).send("render failed");
  }
});
app.get("/", (req,res)=>res.send("milli-kit-ogp ok. GET /cardOgp?uid=xx"));
app.listen(PORT, ()=>console.log(`ogp listening on ${PORT}`));
