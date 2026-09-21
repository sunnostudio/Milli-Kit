// Render milli-unishare-og に追加する cardOgp エンドポイントの例
// 白背景 + 推しカラーの線 + 名前/アイコン/ファンネーム/ファンマーク
// Sharp + SVG 合成で 1200x630 を生成。日英でフォントサイズを変える。
// 設置: server/index.js に app.get('/cardOgp', ...) として追記

const sharp = require('sharp');
const fetch = require('node-fetch'); // Node 18+ なら不要

// Firebase Admin または REST で取得（例: RTDB REST）
// ここではダミー。実際は firebase-admin や fetch で millipro/linker/{uid} を取得
async function fetchLinkerData(uid){
  const dbUrl = `https://millipro-shared-default-rtdb.asia-southeast1.firebasedatabase.app/millipro/linker/${uid}.json`;
  const r = await fetch(dbUrl);
  if(!r.ok) return null;
  return r.json();
}
async function fetchMember(uid){
  // LINKER_MEMBERS / MEMBERS から取得（簡易）
  const members = require('../data/members.json');
  return members.find(m=>m.id===uid)||null;
}
async function fetchIconBuffer(iconUrl){
  if(!iconUrl || !/^https?:\/\//.test(iconUrl)) return null;
  try{
    const r = await fetch(iconUrl);
    if(!r.ok) return null;
    return Buffer.from(await r.arrayBuffer());
  }catch(e){ return null; }
}

function escXml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

async function renderCardOgp({name, icon, ultimate, oshiMark, lang, fontJa, fontEn}){
  const W=1200, H=630;
  const m = ultimate ? await fetchMember(ultimate) : null;
  const color = m ? m.color : '#7f7efd';
  let fanName = m ? (m.fanName||'') : '';
  try{
    const full = require('../data/members.json').find(x=>x.id===ultimate);
  }catch(e){}
  const isEn = lang==='en';
  const fJa = fontJa || "'M PLUS Rounded 1c','Noto Sans JP',sans-serif";
  const fEn = fontEn || "'Barlow',sans-serif";
  const nameFont = isEn ? `800 56px ${fEn}` : `800 62px ${fJa}`;
  const fanFont = isEn ? `700 26px ${fEn}` : `700 28px ${fJa}`;
  const badgeFont = isEn ? `800 18px ${fEn}` : `800 19px ${fJa}`;
  const labelFont = `700 13px ${fJa}`;
  const displayName = name || '';
  const badgeText = m ? (isEn ? `Fave: ${m.nameEn||m.name}` : `最推し ${m.name}`) : '';

  // icon を丸く切り抜く
  let iconPng=null;
  const iconBuf = await fetchIconBuffer(icon);
  if(iconBuf){
    iconPng = await sharp(iconBuf).resize(140,140,{fit:'cover'}).png().toBuffer();
    // 円形マスクは SVG でクリップ
  }

  // SVG テンプレート — 白背景 + 推しカラーの線（日英でフォント切り替え）
  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="#fff"/>
    <rect width="${W}" height="14" fill="${color}"/>
    <rect y="${H-8}" width="${W}" height="8" fill="${color}" opacity="0.12"/>
    <path d="M744 346 L1200 220 L1200 630 L864 630 Z" fill="${color}" opacity="0.07"/>
    <circle cx="134" cy="154" r="70" fill="#f7f5ff" stroke="${color}" stroke-width="4"/>
    <text x="232" y="175" font-family="${isEn?fEn:fJa}" font-size="${isEn?56:62}" font-weight="800" fill="#222">${escXml(displayName)}</text>
    <text x="232" y="215" font-family="${isEn?fEn:fJa}" font-size="${isEn?26:28}" font-weight="700" fill="#6b6a7a">${escXml(fanName)}${oshiMark?` ${escXml(oshiMark)}`:''}</text>
    ${m ? `
    <g>
      <rect x="232" y="238" rx="14" ry="14" width="${badgeText.length*11+28}" height="28" fill="${color}"/>
      <text x="${232+14}" y="257" font-family="${isEn?fEn:fJa}" font-size="${isEn?18:19}" font-weight="800" fill="#fff">${escXml(badgeText)}</text>
    </g>` : ''}
    <text x="64" y="${H-28}" font-family="${fJa}" font-size="13" font-weight="700" fill="#a8a3c0">Milli Kit  •  Milli Linker</text>
    <text x="${W-28}" y="${H-28}" font-family="${fJa}" font-size="10" font-weight="600" fill="#c8c6de" text-anchor="end">1200×630</text>
  </svg>`;

  let base = sharp(Buffer.from(svg));

  if(iconPng){
    // icon を円形にマスクして合成
    const circleSvg = Buffer.from(`<svg width="140" height="140"><circle cx="70" cy="70" r="70" fill="white"/></svg>`);
    const masked = await sharp(iconPng)
      .composite([{input: circleSvg, blend:'dest-in'}])
      .png()
      .toBuffer();
    base = base.composite([{input: masked, top: 84, left: 64}]);
  }

  return base.png().toBuffer();
}

// Express 例
// app.get('/cardOgp', async (req,res)=>{
//   const uid = req.query.uid;
//   const lang = req.query.lang || 'ja';
//   if(!uid) return res.status(400).send('uid required');
//   const data = await fetchLinkerData(uid);
//   if(!data) return res.status(404).send('not found');
//   const buf = await renderCardOgp({name:data.name, icon:data.icon, ultimate:data.ultimate, oshiMark:data.oshiMark, lang});
//   res.set('Content-Type','image/png');
//   res.set('Cache-Control','public, max-age=300, s-maxage=600');
//   res.send(buf);
// });

module.exports = { renderCardOgp };
