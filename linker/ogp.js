// OGP Business Card — Milli Linker version
// White bg, oshi color, bigger name/icon/fanName/logos, fanMark as 2 emojis, site = Milli Linker, optional shoulder title
"use strict";
const FANMARK_EMOJI = {
  konomi:"🐺🍫", nono:"🎧🤍", akubi:"👿♠︎", koma:"⛩️🔅", raco:"🦦💛", yura:"🌙🫧",
  nuhu:"🌈🖍️", tsukuri:"☁️🔧", liz:"🌂🖤", rei:"🩵🥽", mahoro:"🍓🦌", aoi:"🐢🌱",
  nova:"🦦💛🌙🫧🌈🖍️🐢🌱", uni:"☁️🔧🌂🖤🩵🥽", sona:"🎧🤍👿♠︎🍓🦌"
};
const GROUP_MEMBERS = {
  nova: ["raco","yura","nuhu","aoi"],
  uni: ["tsukuri","liz","rei"],
  sona: ["nono","akubi","mahoro"]
};
function getMemberById(id){
  const m=(typeof LINKER_MEMBERS!=="undefined"?LINKER_MEMBERS.find(x=>x.id===id):null)||(typeof MEMBERS!=="undefined"?MEMBERS.find(x=>x.id===id):null);
  return m||null;
}
async function loadImage(url){
  if(!url) return null;
  return new Promise(res=>{
    const img=new Image();
    // 同一オリジンの ../images/... はCORS不要（設定すると逆にtaintする）、httpのみanonymous
    if(url.startsWith("http")) img.crossOrigin="anonymous";
    img.onload=()=>res(img); img.onerror=()=>res(null); img.src=url;
  });
}
// OGP描画の世代管理（最推し切替時の古い透かしが残るバグ対策）
let ogpDrawGen=0;
// ロゴを面積で正規化（タレント間で見た目の大きさを揃える）
function getUniformLogoScale(w,h,maxW,maxH,targetDiag){
  targetDiag = targetDiag||210;
  const diag=Math.hypot(w,h);
  const sDiag=targetDiag/diag;
  const dwDiag=w*sDiag, dhDiag=h*sDiag;
  if(dwDiag<=maxW && dhDiag<=maxH) return sDiag;
  return Math.min(maxW/w, maxH/h);
}
function drawBirthdayIconCanvas(ctx, cx, cy, size, color){
  ctx.save();
  ctx.strokeStyle=color||"#6b6a7a"; ctx.fillStyle=color||"#6b6a7a";
  ctx.lineWidth=1.3; ctx.lineCap="round"; ctx.lineJoin="round";
  const s=size/16;
  ctx.translate(cx, cy);
  ctx.scale(s,s);
  // cake body
  ctx.beginPath(); ctx.moveTo(-6, -2); ctx.lineTo(6, -2); ctx.lineTo(6, 6); ctx.lineTo(-6, 6); ctx.closePath(); ctx.stroke();
  // top cream
  ctx.beginPath(); ctx.moveTo(-6, -2); ctx.bezierCurveTo(-6, -6, 6, -6, 6, -2); ctx.stroke();
  // layers
  ctx.beginPath(); ctx.moveTo(-6, 2); ctx.lineTo(6, 2); ctx.stroke();
  // candle
  ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, -10); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -11.5, 1.4, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}
async function drawOgpToCanvas(canvas, opts){
  const myGen = opts._gen || ogpDrawGen;
  const W=1200,H=630; canvas.width=W; canvas.height=H;
  const ctx=canvas.getContext("2d"); if(!ctx) return;
  const name=opts.name||"", icon=opts.icon||"", ultimate=opts.ultimate||"", lang=opts.lang||"ja";
  const fontJa=opts.fontJa||"'M PLUS Rounded 1c','Noto Sans JP',sans-serif";
  const fontEn=opts.fontEn||"'Barlow',sans-serif";
  const xHandle=opts.xHandle||"", oshiHistory=opts.oshiHistory||"", favCount=opts.favCount||0;
  const oshiMark=opts.oshiMark||"", shoulderTitle=opts.shoulderTitle||"";
  const qrUrl=opts.qrUrl||"", siteLogoUrl=opts.siteLogoUrl||"../images/rogo/milli-linker-rogo.png";
  const ultimateLogoUrl=opts.ultimateLogoUrl||"";
  const talentImgUrl=opts.talentImgUrl||"";
  const birthday=opts.birthday||"", birthdayPublic=opts.birthdayPublic||"monthDay";
  const gallery=Array.isArray(opts.gallery)?opts.gallery.slice(0,3):[];
  const m=getMemberById(ultimate); const color=m?m.color:"#7f7efd";
  const subColor=m? (m.subColor||color+"22") : "#e5e3f2";
  let fanName=""; try{ const full=(typeof MEMBERS!=="undefined"?MEMBERS.find(x=>x.id===ultimate):null); if(full) fanName=full.fanName||""; }catch(e){} if(!fanName && m) fanName=m.fanName||"";
  const fanMarkEmojis = FANMARK_EMOJI[ultimate] || "";
  // Load images first (needed for uniform logo sizing & watermark positioning & version check)
  let iconImg, ultimateLogoImg, siteLogoImg, qrImg, talentImgForWatermark=null;
  let groupTalentImgs=[];
  const isGroup = !!GROUP_MEMBERS[ultimate];
  if(isGroup){
    const gIds=GROUP_MEMBERS[ultimate];
    const gUrls=gIds.map(id=>{ const mm=getMemberById(id); return mm&&mm.img ? (mm.img.startsWith("http")?mm.img:"../"+mm.img) : null; });
    const results=await Promise.all([
      loadImage(icon && (icon.startsWith("http")||icon.startsWith("data:")) ? icon : null),
      ultimateLogoUrl?loadImage(ultimateLogoUrl):Promise.resolve(null),
      siteLogoUrl?loadImage(siteLogoUrl):Promise.resolve(null),
      qrUrl?loadImage(qrUrl):Promise.resolve(null),
      ...gUrls.map(u=> u?loadImage(u):Promise.resolve(null))
    ]);
    [iconImg, ultimateLogoImg, siteLogoImg, qrImg, ...groupTalentImgs]=results;
    groupTalentImgs=groupTalentImgs.filter(Boolean);
  } else {
    [iconImg, ultimateLogoImg, siteLogoImg, qrImg, talentImgForWatermark] = await Promise.all([
      loadImage(icon && (icon.startsWith("http")||icon.startsWith("data:")) ? icon : null),
      ultimateLogoUrl?loadImage(ultimateLogoUrl):Promise.resolve(null),
      siteLogoUrl?loadImage(siteLogoUrl):Promise.resolve(null),
      qrUrl?loadImage(qrUrl):Promise.resolve(null),
      talentImgUrl?loadImage(talentImgUrl):Promise.resolve(null)
    ]);
  }
  if(myGen !== ogpDrawGen) return;
  // compute ultimate logo size with uniform scale (area normalization) for consistent visual size
  let ultimateDw=0, ultimateDh=0;
  if(ultimateLogoImg){
    const isKoma = ultimate==="koma";
    const maxW=264, maxH=isKoma?78:72;
    const targetDiag=isKoma?235:210;
    let s=getUniformLogoScale(ultimateLogoImg.width, ultimateLogoImg.height, maxW, maxH, targetDiag);
    ultimateDw=ultimateLogoImg.width*s; ultimateDh=ultimateLogoImg.height*s;
    if(ultimateDw>maxW || ultimateDh>maxH){
      const cs=Math.min(maxW/ultimateLogoImg.width, maxH/ultimateLogoImg.height);
      ultimateDw=ultimateLogoImg.width*cs; ultimateDh=ultimateLogoImg.height*cs;
    }
  }
  // white bg + lines
  ctx.fillStyle="#fff"; ctx.fillRect(0,0,W,H);
  ctx.fillStyle=color; ctx.fillRect(0,0,W,14);
  ctx.fillStyle=color+"22"; ctx.fillRect(0,H-8,W,8);
  // subtle dot pattern for density (subColor) — slightly lighter to let watermark pop
  ctx.save(); ctx.globalAlpha=0.32; ctx.fillStyle=subColor;
  for(let dx=0; dx<W; dx+=28){
    for(let dy=18; dy<H-12; dy+=28){
      if((dx+dy)%56===0){ ctx.beginPath(); ctx.arc(dx+14, dy, 1.2, 0, Math.PI*2); ctx.fill(); }
    }
  }
  ctx.restore();
  // ♢ large diamond — one, sticks out
  ctx.save();
  ctx.strokeStyle=color+"80"; // ~50% opacity, member color
  ctx.lineWidth=1.8;
  ctx.globalAlpha=1;
  const diamondSize=190;
  const tilt=-14 * Math.PI/180;
  ctx.translate(W*0.92, H*0.58);
  ctx.rotate(tilt);
  ctx.beginPath();
  ctx.moveTo(0, -diamondSize);
  ctx.lineTo(diamondSize*0.72, 0);
  ctx.lineTo(0, diamondSize);
  ctx.lineTo(-diamondSize*0.72, 0);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
  ctx.save(); ctx.globalAlpha=0.12; ctx.fillStyle=color;
  ctx.beginPath(); ctx.moveTo(W*0.62,H*0.55); ctx.lineTo(W,H*0.35); ctx.lineTo(W,H); ctx.lineTo(W*0.72,H); ctx.closePath(); ctx.fill(); ctx.restore();
  // talent watermark — single or group (overlapping, bottom aligned, opaque)
  if(GROUP_MEMBERS[ultimate] && groupTalentImgs.length){
    ctx.save(); ctx.globalAlpha=1.0;
    const tw=420, th=460;
    const tx=W - tw - 18, ty=H - th - 18;
    const n=groupTalentImgs.length;
    const gIds=GROUP_MEMBERS[ultimate];
    if(n===3){
      // △配置: 上1・下2 — 左上1.2x
      const baseW=247, baseH=325;
      const thumbW0=baseW*1.2, thumbH0=baseH*1.2;
      const positions=[
        {x: tx+tw/2-thumbW0/2, y: ty+2, w: thumbW0, h: thumbH0},
        {x: tx+8, y: ty+th-baseH-6, w: baseW, h: baseH},
        {x: tx+tw-baseW-8, y: ty+th-baseH-2, w: baseW, h: baseH},
      ];
      groupTalentImgs.forEach((img, idx)=>{
        if(!img) return;
        const mId=gIds[idx];
        const yOff=(mId==="aoi"?10:(mId==="tsukuri"||mId==="tukuri"?6:0));
        const pos=positions[idx]||positions[0];
        const pw=pos.w, ph=pos.h;
        const scale=Math.min(pw/img.width, ph/img.height);
        const dw=img.width*scale, dh=img.height*scale;
        const dx=pos.x + (pw-dw)/2;
        const dy=pos.y + (ph-dh) + yOff;
        ctx.drawImage(img, dx, dy, dw, dh);
      });
    } else {
      // □配置: 2×2 — 左上1.2x、右下そのまま
      const baseW=221, baseH=299;
      const bigW=baseW*1.2, bigH=baseH*1.2;
      const positions=[
        {x: tx+4, y: ty+4, w: bigW, h: bigH},
        {x: tx+tw-baseW-4, y: ty+12, w: baseW, h: baseH},
        {x: tx+8, y: ty+th-baseH-4, w: baseW, h: baseH},
        {x: tx+tw-baseW-8, y: ty+th-baseH-2, w: baseW, h: baseH},
      ];
      groupTalentImgs.forEach((img, idx)=>{
        if(!img) return;
        const mId=gIds[idx];
        const yOff=(mId==="aoi"?10:(mId==="tsukuri"||mId==="tukuri"?6:0));
        const pos=positions[idx]||positions[0];
        const pw=pos.w, ph=pos.h;
        const scale=Math.min(pw/img.width, ph/img.height);
        const dw=img.width*scale, dh=img.height*scale;
        const dx=pos.x + (pw-dw)/2;
        const dy=pos.y + (ph-dh) + yOff;
        ctx.drawImage(img, dx, dy, dw, dh);
      });
    }
    ctx.restore();
  } else if(talentImgForWatermark){
    ctx.save(); ctx.globalAlpha=1.0;
    const tw=420, th=460;
    const tx=W - tw - 18, ty=H - th - 18;
    const scale=Math.max(tw/talentImgForWatermark.width, th/talentImgForWatermark.height);
    const dw=talentImgForWatermark.width*scale, dh=talentImgForWatermark.height*scale;
    const dx=tx + tw/2 - dw/2;
    const yOff2 = ultimate==="aoi" ? 26 : (ultimate==="tsukuri" || ultimate==="tukuri" ? 14 : 0);
    const dy=ty + th - dh + yOff2;
    ctx.drawImage(talentImgForWatermark, dx, dy, dw, dh);
    ctx.restore();
  }
  // bigger icon — 168px (was 140)
  const iconX=56, iconY=72, iconR=84;
  ctx.save(); ctx.beginPath(); ctx.arc(iconX+iconR, iconY+iconR, iconR, 0, Math.PI*2); ctx.clip();
  ctx.fillStyle="#f7f5ff"; ctx.fillRect(iconX, iconY, iconR*2, iconR*2);
  if(iconImg){
    const scale=Math.max(iconR*2/iconImg.width, iconR*2/iconImg.height);
    const dw=iconImg.width*scale, dh=iconImg.height*scale;
    ctx.drawImage(iconImg, iconX+iconR - dw/2, iconY+iconR - dh/2, dw, dh);
  } else {
    ctx.fillStyle=color; ctx.font=`700 50px ${fontJa}`; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText((name||"?").slice(0,2), iconX+iconR, iconY+iconR+2);
  }
  ctx.restore();
  ctx.strokeStyle=color; ctx.lineWidth=5; ctx.beginPath(); ctx.arc(iconX+iconR, iconY+iconR, iconR, 0, Math.PI*2); ctx.stroke();

  const textX=iconX+iconR*2+32;
  const isEn=/^[\x00-\x7F]*$/.test(name) && /[A-Za-z]/.test(name);
  // Name
  ctx.fillStyle="#222"; ctx.textAlign="left"; ctx.textBaseline="alphabetic";
  const nameFont=isEn?`800 68px ${fontEn}`:`800 70px ${fontJa}`;
  ctx.font=nameFont;
  const nameY=168;
  let displayName=name;
  if(ctx.measureText(displayName).width > 740){
    while(displayName.length>1 && ctx.measureText(displayName+"…").width>740) displayName=displayName.slice(0,-1);
    displayName+="…";
  }
  ctx.fillText(displayName, textX, nameY);
  // Shoulder title — small below name to avoid overlap
  let shoulderY=nameY+26;
  if(shoulderTitle){
    ctx.font=isEn?`600 22px ${fontEn}`:`600 22px ${fontJa}`;
    ctx.fillStyle="#6b6a7a";
    let st=shoulderTitle;
    if(ctx.measureText(st).width>740){
      while(st.length>1 && ctx.measureText(st+"…").width>740) st=st.slice(0,-1);
      st+="…";
    }
    ctx.fillText(st, textX, shoulderY);
    shoulderY+=18;
  }
  // X + 推し歴
  let subY=shoulderTitle ? shoulderY+8 : nameY+32;
  ctx.font=`600 20px ${isEn?fontEn:fontJa}`; ctx.fillStyle="#6b6a7a";
  let subParts=[];
  if(xHandle) subParts.push(`@${xHandle.replace(/^@/,"")}`);
  if(oshiHistory) subParts.push(oshiHistory);
  if(subParts.length){ ctx.fillText(subParts.join("  •  "), textX, subY); subY+=30; } else subY+=10;
  // FanName + official 2-emoji fanMark + oshiMark
  ctx.font=isEn?`700 32px ${fontEn}`:`700 34px ${fontJa}`;
  ctx.fillStyle="#6b6a7a";
  let fanY=subY+8;
  let fanX=textX;
  if(fanMarkEmojis){
    ctx.fillText(fanMarkEmojis, fanX, fanY);
    fanX+=ctx.measureText(fanMarkEmojis).width+10;
  }
  if(fanName){
    ctx.fillText(fanName, fanX, fanY);
    fanX+=ctx.measureText(fanName).width+10;
  }
  if(oshiMark){
    ctx.fillStyle=color;
    ctx.fillText(oshiMark, fanX, fanY);
    fanX+=ctx.measureText(oshiMark).width+10;
  }
  if(favCount>0){
    ctx.fillStyle="#6b6a7a"; ctx.font=`600 20px ${isEn?fontEn:fontJa}`;
    ctx.fillText(`他${favCount}推し`, fanX, fanY);
  }
  // badge + birthday pill
  let badgeBottom = fanY;
  if(m){
    const badgeText=isEn?`Fave: ${m.nameEn||m.name}`:`最推し ${m.name}`;
    const badgeY=fanY+34;
    ctx.font=isEn?`800 19px ${fontEn}`:`800 20px ${fontJa}`;
    const padX=16, tw=ctx.measureText(badgeText).width, bw=tw+padX*2, bh=30;
    const bx=textX, by=badgeY-20;
    ctx.fillStyle=color; roundRect(ctx,bx,by,bw,bh,15); ctx.fill();
    ctx.fillStyle="#fff"; ctx.fillText(badgeText, bx+padX, by+20);
    badgeBottom = by+bh;
    // birthday pill next to badge if available — SVG icon
    if(birthday && birthdayPublic!=="hidden"){
      const mm=birthday.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if(mm){
        const bdayText = birthdayPublic==="full" ? `${mm[1]}/${mm[2]}/${mm[3]}` : `${mm[2]}/${mm[3]}`;
        ctx.font=`700 16px ${fontJa}`;
        const iconW=14;
        const bPadX=10, bTw=ctx.measureText(bdayText).width, bW=bTw+iconW+6+bPadX*2, bH=26;
        const bX=bx+bw+10, bY=by+2;
        ctx.fillStyle="#fff"; ctx.strokeStyle=color+"44"; ctx.lineWidth=1.5; roundRect(ctx,bX,bY,bW,bH,13); ctx.fill(); ctx.stroke();
        drawBirthdayIconCanvas(ctx, bX+bPadX+7, bY+bH/2, 11, "#6b6a7a");
        ctx.fillStyle="#6b6a7a"; ctx.fillText(bdayText, bX+bPadX+iconW+6, bY+17);
      }
    }
  } else if(birthday && birthdayPublic!=="hidden"){
    const mm=birthday.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(mm){
      const bdayText = birthdayPublic==="full" ? `${mm[1]}/${mm[2]}/${mm[3]}` : `${mm[2]}/${mm[3]}`;
      const badgeY=fanY+34;
      ctx.font=`700 16px ${fontJa}`;
      const iconW=14;
      const bPadX=10, bTw=ctx.measureText(bdayText).width, bW=bTw+iconW+6+bPadX*2, bH=26;
      const bX=textX, bY=badgeY-20+2;
      ctx.fillStyle="#fff"; ctx.strokeStyle=color+"44"; ctx.lineWidth=1.5; roundRect(ctx,bX,bY,bW,bH,13); ctx.fill(); ctx.stroke();
      drawBirthdayIconCanvas(ctx, bX+bPadX+7, bY+bH/2, 11, "#6b6a7a");
      ctx.fillStyle="#6b6a7a"; ctx.fillText(bdayText, bX+bPadX+iconW+6, bY+17);
      badgeBottom = bY+bH;
    }
  }
  // ultimate logo — uniform scale (area normalization, ~1.2x, max 264x72)
  if(ultimateLogoImg){
    // reuse precomputed uniform size (fallback to simple max if not computed)
    let dw=ultimateDw, dh=ultimateDh;
    if(!dw || !dh){
      const maxW=264, maxH=72;
      const s=getUniformLogoScale(ultimateLogoImg.width, ultimateLogoImg.height, maxW, maxH, 210);
      dw=ultimateLogoImg.width*s; dh=ultimateLogoImg.height*s;
    }
    ctx.drawImage(ultimateLogoImg, W - dw - 28, 28, dw, dh);
  }
  // site logo — 240x48 (1.2x from 200x40)
  if(siteLogoImg){
    const maxW=240, maxH=48;
    let iw=siteLogoImg.width, ih=siteLogoImg.height;
    const scale=Math.min(maxW/iw, maxH/ih);
    const dw=iw*scale, dh=ih*scale;
    ctx.drawImage(siteLogoImg, 64, H - dh - 18, dw, dh);
  } else {
    ctx.fillStyle="#a8a3c0"; ctx.font=`700 13px ${fontJa}`; ctx.fillText("Milli Linker", 64, H-28);
  }
  // QR small bottom-right — 96x96
  if(qrImg){
    const qs=96; const qx=W - qs - 20, qy=H - qs - 20;
    ctx.fillStyle="#fff"; roundRect(ctx,qx-6,qy-6,qs+12,qs+12,10); ctx.fill();
    ctx.strokeStyle="#e5e3f2"; ctx.lineWidth=1; roundRect(ctx,qx-6,qy-6,qs+12,qs+12,10); ctx.stroke();
    ctx.drawImage(qrImg, qx, qy, qs, qs);
  }
  ctx.fillStyle="#c8c6de"; ctx.font=`600 10px ${fontJa}`; ctx.textAlign="right"; ctx.fillText("1200×630", W-28, H-14); ctx.textAlign="left";
}
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}
function ensureOgpCanvas(){
  let c=document.getElementById("ogpCanvas");
  if(!c){ c=document.createElement("canvas"); c.id="ogpCanvas"; c.width=1200; c.height=630; c.style.width="100%"; c.style.height="auto"; c.style.borderRadius="12px"; c.style.border="1px solid #e5e3f2"; }
  return c;
}
async function updateOgpPreview(){
  ogpDrawGen++; const myGen=ogpDrawGen;
  const name=document.getElementById("fieldName")?.value||"";
  const icon=document.getElementById("fieldIcon")?.value||"";
  const ultimate=document.getElementById("oshiUltimate")?.dataset.value||"";
  const oshiMark=document.getElementById("fieldOshiMark")?.value||"";
  const shoulderTitle=document.getElementById("fieldTitle")?.value||"";
  const lang=(localStorage.getItem("milli-lang")==="en"?"en":"ja");
  const fontJa=document.querySelector('.custom-select[data-name="ogpFontJa"]')?.dataset.value || "'M PLUS Rounded 1c','Noto Sans JP',sans-serif";
  const fontEn=document.querySelector('.custom-select[data-name="ogpFontEn"]')?.dataset.value || "'Barlow',sans-serif";
  const xRaw=document.getElementById("fieldX")?.value || document.getElementById("xFieldWrap")?.dataset.value || "";
  const xHandle=xRaw.replace(/^https?:\/\/(www\.)?x\.com\//,"").replace(/^@/,"").split("/")[0].split("?")[0]||xRaw;
  const oshiHistory=document.querySelector('.custom-select[data-name="oshiHistory"]')?.dataset.value||"";
  const favCount=document.querySelectorAll("#oshiFavs .custom-opt.active").length;
  const birthday=document.getElementById("fieldBirthday")?.value||"";
  const birthdayPublic=document.querySelector('.custom-select[data-name="birthdayPublic"]')?.dataset.value||"monthDay";
  const gallery=(typeof window._getGalleryData==="function" ? window._getGalleryData() : []);
  let ultimateLogoUrl=""; let talentImgUrl=""; if(ultimate){ const m=(typeof LINKER_MEMBERS!=="undefined"?LINKER_MEMBERS.find(x=>x.id===ultimate):null)||(typeof MEMBERS!=="undefined"?MEMBERS.find(x=>x.id===ultimate):null); if(m){ if(m.logo) ultimateLogoUrl=m.logo.startsWith("http")?m.logo:"../"+m.logo; if(m.img) talentImgUrl=m.img.startsWith("http")?m.img:"../"+m.img; } }
  const siteLogoUrl="../images/rogo/milli-linker-rogo.png";
  let uid="local"; try{ if(typeof firebase!=="undefined"&&firebase.auth().currentUser) uid=firebase.auth().currentUser.uid; }catch(e){}
  const qrData=`${location.origin}/linker/view.html?uid=${uid}`;
  const qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  if(document.fonts&&document.fonts.ready){ try{ await document.fonts.ready; }catch(e){} }
  if(myGen !== ogpDrawGen) return;
  const canvas=ensureOgpCanvas();
  const holder=document.getElementById("ogpPreview");
  if(holder && !holder.contains(canvas)){
    holder.innerHTML=""; holder.appendChild(canvas);
    const dl=document.createElement("a"); dl.id="ogpDownload"; dl.textContent="画像をダウンロード";
    dl.style.cssText="display:inline-block;margin-top:8px;padding:6px 12px;border-radius:999px;border:1px solid #e5e3f2;background:#fff;font-size:11px;font-weight:700;text-decoration:none;";
    dl.download="milli-linker-ogp.png"; holder.appendChild(dl);
  }
  await drawOgpToCanvas(canvas, {name, icon, ultimate, oshiMark, shoulderTitle, lang, fontJa, fontEn, xHandle, oshiHistory, favCount, ultimateLogoUrl, siteLogoUrl, qrUrl, talentImgUrl, birthday, birthdayPublic, gallery, _gen: myGen});
  if(myGen !== ogpDrawGen) return;
  const dl=document.getElementById("ogpDownload"); if(dl) dl.href=canvas.toDataURL("image/png");
}
window.drawOgpToCanvas=drawOgpToCanvas;
window.updateOgpPreview=updateOgpPreview;
