// Linker — custom UI (no native select/checkbox), official colors
"use strict";

const SNS_TYPES = [
  {v:"youtube", label:"YouTube", placeholder:"https://www.youtube.com/@... や https://youtu.be/...", pattern:"youtube"},
  {v:"discord", label:"Discord", placeholder:"ユーザー名、ID、または招待リンク（例: @xxx / discord.gg/xxx）", pattern:"discord"},
  {v:"instagram", label:"Instagram", placeholder:"https://www.instagram.com/xxx", pattern:"instagram"},
  {v:"tiktok", label:"TikTok", placeholder:"https://www.tiktok.com/@xxx", pattern:"tiktok"},
  {v:"wick", label:"Wick", placeholder:"https://wick.com/...", pattern:"wick"},
  {v:"line", label:"LINE", placeholder:"オープンチャットURL（ID直貼りは非推奨）", pattern:"line"},
  {v:"other", label:"その他", placeholder:"https://...", pattern:"other"},
];

function initLinker(){
  renderUltimate();
  renderFavs();
  initIcon();
  initXField();
  initCustomSelects();
  initSns();
  initKami();
  bindCounts();
  bindPreview();
  // load existing if any
  loadDraft();
}

function syncFavDisable(){
  const ultimate=document.getElementById("oshiUltimate")?.dataset.value||"";
  document.querySelectorAll("#oshiFavs .custom-opt").forEach(b=>{
    const isUlt = b.dataset.id===ultimate && ultimate!=="";
    b.disabled=isUlt;
    b.style.opacity=isUlt?"0.45":"";
    b.style.pointerEvents=isUlt?"none":"";
    if(isUlt && b.classList.contains("active")){
      b.classList.remove("active");
      const box=b.querySelector(".custom-box"); const sv=box?.querySelector("svg");
      if(sv) sv.style.display="none";
      if(box){ box.style.background="#fff"; box.style.borderColor="#c8c6de"; }
    }
  });
}
function renderUltimate(){
  const wrap = document.getElementById("oshiUltimate");
  if(!wrap || typeof LINKER_MEMBERS==="undefined") return;
  wrap.innerHTML="";
  LINKER_MEMBERS.forEach(m=>{
    const b = document.createElement("button");
    b.type="button"; b.className="custom-opt"; b.dataset.id=m.id;
    const iconUrl=resolveIcon(m.icon);
    b.innerHTML=`<span class="custom-dot" aria-hidden="true"></span><img src="${escAttr(iconUrl)}" alt="${esc(m.name)}" loading="lazy" onerror="this.style.display='none'"><span><span class="opt-name">${esc(m.name)}</span><br><span class="opt-fan">${esc(m.gen)}</span></span>`;
    b.addEventListener("click", ()=>{
      wrap.querySelectorAll(".custom-opt").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      wrap.dataset.value = m.id;
      syncFavDisable();
      updatePreview();
      saveDraft();
    });
    wrap.appendChild(b);
  });
}
function renderFavs(){
  const wrap = document.getElementById("oshiFavs");
  if(!wrap || typeof LINKER_MEMBERS==="undefined") return;
  wrap.innerHTML="";
  LINKER_MEMBERS.forEach(m=>{
    const b = document.createElement("button");
    b.type="button"; b.className="custom-opt"; b.dataset.id=m.id;
    const iconUrl=resolveIcon(m.icon);
    b.innerHTML=`<span class="custom-box" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><use href="#icon-check"/></svg></span><img src="${escAttr(iconUrl)}" alt="${esc(m.name)}" loading="lazy" onerror="this.style.display='none'"><span><span class="opt-name">${esc(m.name)}</span><br><span class="opt-fan">${esc(m.gen)}</span></span>`;
    const svg=b.querySelector(".custom-box svg"); if(svg) svg.style.display="none";
    b.addEventListener("click", ()=>{
      b.classList.toggle("active");
      const show = b.classList.contains("active");
      const box=b.querySelector(".custom-box"); const sv=box.querySelector("svg");
      if(sv) sv.style.display = show ? "block" : "none";
      box.style.background = show ? "#7f7efd" : "#fff";
      box.style.borderColor = show ? "#7f7efd" : "#c8c6de";
      updatePreview();
      saveDraft();
    });
    wrap.appendChild(b);
  });
}
function initIcon(){
  const input = document.getElementById("fieldIcon");
  const preview = document.getElementById("iconPreview");
  const file = document.getElementById("iconFile");
  const preset = document.getElementById("iconPreset");
  if(!input || !preview) return;
  const presets = ["✦","❄","🦖","🐺","🎀"];
  presets.forEach(ch=>{
    const b=document.createElement("button");
    b.type="button"; b.className="preset-btn"; b.textContent=ch;
    b.addEventListener("click", ()=>{ input.value=ch; updateIconPreview(); updatePreview(); });
    preset.appendChild(b);
  });
  input.addEventListener("input", ()=>{ updateIconPreview(); updatePreview(); });
  file.addEventListener("change", ()=>{
    const f=file.files[0]; if(!f) return;
    if(f.size>1024*1024){ alert("画像は1MBまでにしてください"); return; }
    const r=new FileReader();
    r.onload=()=>{ input.value=r.result; updateIconPreview(); updatePreview(); };
    r.readAsDataURL(f);
  });
  function updateIconPreview(){
    const v=input.value.trim();
    if(!v){ preview.innerHTML=`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><use href="#icon-user"/></svg>`; return; }
    if(v.startsWith("http") || v.startsWith("data:")){
      preview.innerHTML=`<img src="${escAttr(v)}" alt="">`;
    } else {
      preview.textContent=v.slice(0,2);
    }
  }
  updateIconPreview();
}
function initXField(){
  const wrap = document.getElementById("xFieldWrap");
  if(!wrap) return;
  // try to read from Orbis account
  let linked = "", auto=false;
  try{
    const raw=localStorage.getItem("millipro_userdata");
    if(raw){ const d=JSON.parse(raw); if(d.xUrl) linked=d.xUrl; else if(d.xId) linked="https://x.com/"+d.xId; }
    // also check provider linked?
    if(typeof getLinkedProviders==="function"){
      // fallback not needed
    }
  }catch(e){}
  if(linked){
    wrap.innerHTML=`<div class="kit-input-wrap" style="background:#f7f5ff"><input class="kit-input" value="${escAttr(linked)}" disabled><span class="kit-input-focus"></span></div><p class="field-note">Xと連携済みのため自動表示されています。</p>`;
    wrap.dataset.value=linked;
  } else {
    wrap.innerHTML=`<div class="kit-input-wrap"><input id="fieldX" class="kit-input" type="text" placeholder="@xxx または https://x.com/xxx"><span class="kit-input-focus"></span></div>`;
    wrap.querySelector("#fieldX").addEventListener("input", updatePreview);
  }
}
function initCustomSelects(){
  document.querySelectorAll(".custom-select").forEach(root=>{
    const trigger=root.querySelector(".custom-select-trigger");
    const menu=root.querySelector(".custom-select-menu");
    const valueEl=root.querySelector(".custom-select-value");
    trigger.addEventListener("click", (e)=>{
      e.stopPropagation();
      const open=root.classList.contains("open");
      closeAllSelects();
      if(!open) root.classList.add("open");
    });
    menu.querySelectorAll("button").forEach(opt=>{
      opt.addEventListener("click", ()=>{
        menu.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
        opt.classList.add("active");
        valueEl.textContent=opt.textContent;
        root.dataset.value=opt.dataset.value||"";
        root.classList.remove("open");
        updatePreview();
      });
    });
  });
  document.addEventListener("click", closeAllSelects);
  function closeAllSelects(){ document.querySelectorAll(".custom-select.open").forEach(r=>r.classList.remove("open")); }
}
function initSns(){
  const list=document.getElementById("snsList");
  const add=document.getElementById("addSnsBtn");
  if(!list||!add) return;
  add.addEventListener("click", ()=> addRow());
  addRow();
  function addRow(pref={}){
    const row=document.createElement("div");
    row.className="sns-row";
    const ph = pref.placeholder || "https://...";
    row.innerHTML=`
      <div class="custom-select" data-name="snsType">
        <button type="button" class="custom-select-trigger" aria-haspopup="listbox" aria-expanded="false"><span class="custom-select-value">${esc(pref.label||"種類を選択")}</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9l6 6 6-6"/></svg></button>
        <div class="custom-select-menu" role="listbox">
          ${SNS_TYPES.map(s=>`<button type="button" role="option" data-value="${s.v}" data-placeholder="${escAttr(s.placeholder)}">${esc(s.label)}</button>`).join("")}
        </div>
      </div>
      <div class="kit-input-wrap" style="flex:1"><input class="kit-input sns-url" type="text" placeholder="${escAttr(ph)}"><span class="kit-input-focus"></span></div>
      <button type="button" class="sns-remove" aria-label="削除"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><use href="#icon-trash"/></svg></button>
    `;
    const root=row.querySelector(".custom-select");
    const trigger=row.querySelector(".custom-select-trigger");
    const menu=row.querySelector(".custom-select-menu");
    const valEl=row.querySelector(".custom-select-value");
    const input=row.querySelector(".sns-url");
    trigger.addEventListener("click", (e)=>{ e.stopPropagation(); const open=root.classList.contains("open"); document.querySelectorAll(".custom-select.open").forEach(r=>r.classList.remove("open")); if(!open) root.classList.add("open"); });
    menu.querySelectorAll("button").forEach(b=> b.addEventListener("click", ()=>{
      menu.querySelectorAll("button").forEach(x=>x.classList.remove("active")); b.classList.add("active");
      valEl.textContent=b.textContent; root.dataset.value=b.dataset.value;
      input.placeholder=b.dataset.placeholder||"https://...";
      // adjust input type hint for Discord etc.
      root.classList.remove("open"); updatePreview(); saveDraft();
    }));
    input.addEventListener("input", ()=>{ updatePreview(); saveDraft(); });
    row.querySelector(".sns-remove").addEventListener("click", ()=>{ row.remove(); updatePreview(); saveDraft(); });
    document.addEventListener("click", ()=> root.classList.remove("open"));
    list.appendChild(row);
  }
  window._addSnsRow = addRow;
}
function extractYoutubeId(v){
  if(!v) return null;
  v=v.trim();
  if(/^[A-Za-z0-9_-]{11}$/.test(v)) return v;
  try{
    const u=new URL(v);
    if(u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("?")[0];
    if(u.searchParams.get("v")) return u.searchParams.get("v");
    const m=v.match(/(?:youtube\.com\/embed\/|youtube\.com\/v\/)([A-Za-z0-9_-]{11})/);
    if(m) return m[1];
  }catch(e){
    const m=v.match(/([A-Za-z0-9_-]{11})/);
    if(m) return m[1];
  }
  return null;
}
function parseT(s){ if(!s) return 0; if(/^\d+$/.test(String(s))) return parseInt(s,10); const m=String(s).match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/); if(!m) return 0; return (parseInt(m[1]||0)*3600)+(parseInt(m[2]||0)*60)+parseInt(m[3]||0); }
async function fetchOembed(youtubeUrl){
  if(!youtubeUrl) return null;
  // noembed.com は無料・規約上問題なし（YouTube oEmbedのプロキシ的役割、APIキー不要）
  // YouTube公式oembedは https://www.youtube.com/oembed?url=...&format=json でも取得可能だがCORSで弾かれることがあるためnoembedを優先
  const endpoints=[
    `https://noembed.com/embed?url=${encodeURIComponent(youtubeUrl)}`,
    `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`
  ];
  for(const ep of endpoints){
    try{
      const r=await fetch(ep);
      if(!r.ok) continue;
      const j=await r.json();
      // noembed: title, author_name ; youtube: title, author_name
      if(j.title) return {title:j.title, author:j.author_name||j.author||"", thumb:j.thumbnail_url||""};
    }catch(e){}
  }
  return null;
}
function initKami(){
  const list=document.getElementById("kamiList");
  const addBtn=document.getElementById("addKamiBtn");
  if(!list||!addBtn) return;
  function addRow(pref={}){
    if(list.children.length>=6){ addBtn.disabled=true; return; }
    const idx=list.children.length+1;
    const row=document.createElement("div");
    row.className="media-item";
    row.innerHTML=`
      <div class="media-item-head"><span class="media-item-index">${idx}</span><span class="media-item-title">神回 ${idx}</span><button type="button" class="media-item-remove" aria-label="削除"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><use href="#icon-trash"/></svg></button></div>
      <div class="kit-input-wrap"><input class="kit-input kami-url" type="text" placeholder="https://www.youtube.com/watch?v=... や動画ID" value="${escAttr(pref.url||"")}"><span class="kit-input-focus"></span></div>
      <div class="kit-input-wrap"><input class="kit-input kami-start" type="number" min="0" placeholder="開始秒数（例: 82）" value="${escAttr(pref.start||"")}"><span class="kit-input-focus"></span></div>
      <div class="kit-input-wrap"><input class="kit-input kami-comment" type="text" maxlength="80" placeholder="ひとこと（例: この一言が天才！）" value="${escAttr(pref.comment||"")}"><span class="kit-input-focus"></span></div>
      <div class="link-preview kami-preview" style="display:none"></div>
    `;
    const url=row.querySelector(".kami-url");
    const start=row.querySelector(".kami-start");
    const comment=row.querySelector(".kami-comment");
    const preview=row.querySelector(".kami-preview");
    let fetchTimer=null;
    async function parse(){
      const v=url.value.trim();
      if(!v){ preview.style.display="none"; preview.dataset.title=""; preview.dataset.author=""; updatePreview(); return; }
      const id=extractYoutubeId(v);
      let t=0; try{ const u=new URL(v); t=parseT(u.searchParams.get("t")||u.searchParams.get("start")||u.hash.replace("#t=","")); }catch(e){}
      if(id){
        const thumb=`https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        const sec=start.value?parseInt(start.value,10):t;
        if(!start.value && t) start.value=t;
        const youtubeUrl=`https://www.youtube.com/watch?v=${id}`;
        const unishare=`https://milli-unishare.pages.dev/?v=${id}${sec?`&t=${sec}`:""}`;
        preview.innerHTML=`<img src="${thumb}" alt=""><span><b>${esc(id)}</b> 読み込み中…<br><span style="font-size:11px;color:#6b6a7a">${sec?sec+"秒から":""} · ${esc(unishare)}</span></span>`;
        preview.style.display="flex";
        clearTimeout(fetchTimer);
        fetchTimer=setTimeout(async()=>{
          const info=await fetchOembed(youtubeUrl);
          if(info){
            preview.innerHTML=`<img src="${escAttr(info.thumb||thumb)}" alt=""><span><b>${esc(info.title)}</b><br><span style="font-size:11px;color:#6b6a7a">${esc(info.author)}${sec?` · ${sec}秒から`:""} · <a href="${escAttr(unishare)}" target="_blank" rel="noopener">Unishareで開く</a></span></span>`;
            preview.dataset.title=info.title; preview.dataset.author=info.author; preview.dataset.id=id;
            updatePreview();
          }
        }, 400);
      } else {
        preview.style.display="none";
      }
    }
    url.addEventListener("input", ()=>{ parse(); updatePreview(); saveDraft(); });
    start.addEventListener("input", ()=>{ parse(); updatePreview(); saveDraft(); });
    comment.addEventListener("input", ()=>{ updatePreview(); saveDraft(); });
    row.querySelector(".media-item-remove").addEventListener("click", ()=>{ row.remove(); refreshIndices(); updatePreview(); saveDraft(); updateAddBtn(); });
    list.appendChild(row);
    if(pref.url) parse();
    refreshIndices(); updateAddBtn();
  }
  function refreshIndices(){ [...list.children].forEach((r,i)=>{ r.querySelector(".media-item-index").textContent=i+1; r.querySelector(".media-item-title").textContent=`神回 ${i+1}`; }); }
  function updateAddBtn(){ addBtn.disabled=list.children.length>=6; addBtn.style.opacity=addBtn.disabled?"0.5":""; }
  addBtn.addEventListener("click", ()=> addRow());
  // expose for load
  window._addKamiRow=addRow;
  window._kamiList=list;
  // default 1 row
  if(list.children.length===0) addRow();
}
function initSong(){
  const list=document.getElementById("songList");
  const addBtn=document.getElementById("addSongBtn");
  if(!list||!addBtn) return;
  function addRow(pref={}){
    if(list.children.length>=6){ addBtn.disabled=true; return; }
    const idx=list.children.length+1;
    const row=document.createElement("div");
    row.className="media-item";
    row.innerHTML=`
      <div class="media-item-head"><span class="media-item-index">${idx}</span><span class="media-item-title">好きな曲 ${idx}</span><button type="button" class="media-item-remove" aria-label="削除"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><use href="#icon-trash"/></svg></button></div>
      <div class="kit-input-wrap"><input class="kit-input song-url" type="text" placeholder="https://www.youtube.com/watch?v=... や動画ID" value="${escAttr(pref.url||"")}"><span class="kit-input-focus"></span></div>
      <div class="kit-input-wrap"><input class="kit-input song-comment" type="text" maxlength="80" placeholder="ひとこと（例: この曲のサビが好き）" value="${escAttr(pref.comment||"")}"><span class="kit-input-focus"></span></div>
      <div class="link-preview song-preview" style="display:none"></div>
    `;
    const url=row.querySelector(".song-url");
    const comment=row.querySelector(".song-comment");
    const preview=row.querySelector(".song-preview");
    let fetchTimer=null;
    async function parse(){
      const v=url.value.trim();
      if(!v){ preview.style.display="none"; preview.dataset.title=""; preview.dataset.author=""; updatePreview(); return; }
      const id=extractYoutubeId(v);
      if(id){
        const thumb=`https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        const youtubeUrl=`https://www.youtube.com/watch?v=${id}`;
        const millivibe=`https://milli-unishare.pages.dev/millivibe.html?v=${id}`;
        preview.innerHTML=`<img src="${thumb}" alt=""><span><b>${esc(id)}</b> 読み込み中…<br><span style="font-size:11px;color:#6b6a7a"><a href="${escAttr(millivibe)}" target="_blank" rel="noopener">Millivibeで開く</a></span></span>`;
        preview.style.display="flex";
        clearTimeout(fetchTimer);
        fetchTimer=setTimeout(async()=>{
          const info=await fetchOembed(youtubeUrl);
          if(info){
            preview.innerHTML=`<img src="${escAttr(info.thumb||thumb)}" alt=""><span><b>${esc(info.title)}</b><br><span style="font-size:11px;color:#6b6a7a">${esc(info.author)} · <a href="${escAttr(millivibe)}" target="_blank" rel="noopener">Millivibeで開く</a></span></span>`;
            preview.dataset.title=info.title; preview.dataset.author=info.author; preview.dataset.id=id;
            updatePreview();
          }
        }, 400);
      } else {
        preview.style.display="none";
      }
    }
    url.addEventListener("input", ()=>{ parse(); updatePreview(); saveDraft(); });
    comment.addEventListener("input", ()=>{ updatePreview(); saveDraft(); });
    row.querySelector(".media-item-remove").addEventListener("click", ()=>{ row.remove(); refreshIndices(); updatePreview(); saveDraft(); updateAddBtn(); });
    list.appendChild(row);
    if(pref.url) parse();
    refreshIndices(); updateAddBtn();
  }
  function refreshIndices(){ [...list.children].forEach((r,i)=>{ r.querySelector(".media-item-index").textContent=i+1; r.querySelector(".media-item-title").textContent=`好きな曲 ${i+1}`; }); }
  function updateAddBtn(){ addBtn.disabled=list.children.length>=6; addBtn.style.opacity=addBtn.disabled?"0.5":""; }
  addBtn.addEventListener("click", ()=> addRow());
  window._addSongRow=addRow;
  window._songList=list;
  if(list.children.length===0) addRow();
}
function bindCounts(){
  const map=[["fieldName","countName",20],["fieldFree","countFree",200]];
  map.forEach(([fid,cid,max])=>{
    const i=document.getElementById(fid), c=document.getElementById(cid);
    if(i&&c) i.addEventListener("input", ()=> c.textContent=String(i.value.length));
  });
}
function bindPreview(){
  ["fieldName","fieldIcon","fieldOshiMark","fieldFree"].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.addEventListener("input", ()=>{ updatePreview(); saveDraft(); });
  });
  updatePreview();
}
function snsToUrl(type, raw){
  raw=(raw||"").trim();
  if(!raw) return "";
  if(/^https?:\/\//.test(raw)) return raw;
  if(type==="discord"){
    // allow @name, name#1234, or invite code
    if(raw.startsWith("@")) return `https://discord.com/users/${encodeURIComponent(raw.slice(1))}`;
    if(/^\d{17,20}$/.test(raw)) return `https://discord.com/users/${raw}`;
    if(raw.includes("discord.gg/")) return `https://${raw.replace(/^https?:\/\//,"")}`;
    return `https://discord.com/users/${encodeURIComponent(raw)}`;
  }
  if(type==="youtube"){
    if(/^[A-Za-z0-9_-]{11}$/.test(raw)) return `https://www.youtube.com/watch?v=${raw}`;
    if(raw.startsWith("@")) return `https://www.youtube.com/${raw}`;
    return `https://${raw.replace(/^https?:\/\//,"")}`;
  }
  if(type==="instagram"){
    if(raw.startsWith("@")) return `https://www.instagram.com/${raw.slice(1)}`;
    return raw.includes("instagram.com") ? `https://${raw.replace(/^https?:\/\//,"")}` : `https://www.instagram.com/${encodeURIComponent(raw)}`;
  }
  if(type==="tiktok"){
    if(raw.startsWith("@")) return `https://www.tiktok.com/${raw}`;
    return raw.includes("tiktok.com") ? `https://${raw.replace(/^https?:\/\//,"")}` : `https://www.tiktok.com/${encodeURIComponent(raw)}`;
  }
  if(type==="line"){
    return raw.includes("line.me") ? `https://${raw.replace(/^https?:\/\//,"")}` : raw;
  }
  return raw;
}
function updatePreview(){
  const name=document.getElementById("fieldName")?.value||"あなたの名前";
  const icon=document.getElementById("fieldIcon")?.value||"";
  const ultimateWrap=document.getElementById("oshiUltimate");
  const ultimate=ultimateWrap?.dataset.value||"";
  const favs=[...document.querySelectorAll("#oshiFavs .custom-opt.active")].map(b=>b.dataset.id);
  const kamiRows=[...document.querySelectorAll("#kamiList .media-item")].map(r=> ({
    url: r.querySelector(".kami-url")?.value||"",
    start: r.querySelector(".kami-start")?.value||"",
    comment: r.querySelector(".kami-comment")?.value||"",
    title: r.querySelector(".kami-preview")?.dataset.title||"",
    author: r.querySelector(".kami-preview")?.dataset.author||"",
    id: r.querySelector(".kami-preview")?.dataset.id||extractYoutubeId(r.querySelector(".kami-url")?.value||"")
  })).filter(x=>x.url);
  const songRows=[...document.querySelectorAll("#songList .media-item")].map(r=> ({
    url: r.querySelector(".song-url")?.value||"",
    comment: r.querySelector(".song-comment")?.value||"",
    title: r.querySelector(".song-preview")?.dataset.title||"",
    author: r.querySelector(".song-preview")?.dataset.author||"",
    id: r.querySelector(".song-preview")?.dataset.id||extractYoutubeId(r.querySelector(".song-url")?.value||"")
  })).filter(x=>x.url);
  const free=document.getElementById("fieldFree")?.value||"";

  const mUltimate = (typeof LINKER_MEMBERS!=="undefined") ? LINKER_MEMBERS.find(x=>x.id===ultimate) : null;
  const color = mUltimate ? mUltimate.color : "#7f7efd";
  const fanName = mUltimate ? (mUltimate.fanName||"") : "";
  let fullFan=""; try{ const f=(typeof MEMBERS!=="undefined"?MEMBERS.find(x=>x.id===ultimate):null); if(f) fullFan=f.fanName; }catch(e){}

  const card=document.getElementById("cardPreview");
  const ogp=document.getElementById("ogpPreview");
  if(!card) return;
  const iconMap={ x:"icon-x", youtube:"icon-youtube", discord:"icon-discord", instagram:"icon-instagram", tiktok:"icon-tiktok", line:"icon-line", wick:"icon-wick", other:"icon-link" };
  const snsRows=[...document.querySelectorAll("#snsList .sns-row")].map(r=>{
    const t=r.querySelector(".custom-select")?.dataset.value;
    const u=r.querySelector(".sns-url")?.value.trim();
    if(!t||!u) return "";
    const url=snsToUrl(t,u);
    const label=SNS_TYPES.find(x=>x.v===t)?.label||t;
    let iconHtml="";
    if(t==="wick"){
      iconHtml=`<img src="../images/sites/wick-icon.png" alt="" width="13" height="13" style="width:13px;height:13px;object-fit:contain;border-radius:3px">`;
    } else {
      const iconId=iconMap[t]||"icon-link";
      iconHtml=`<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><use href="#${iconId}"/></svg>`;
    }
    return `<a href="${escAttr(url)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:5px;border:1px solid #e5e3f2;border-radius:999px;padding:4px 10px;background:#fff;font-size:11px;font-weight:700;text-decoration:none;color:#222;">${iconHtml}${esc(label)}</a>`;
  }).filter(Boolean).join(" ");

  // kami (up to 6)
  let kamiThumbHtml="";
  if(kamiRows.length){
    kamiThumbHtml = kamiRows.map(r=>{
      const thumb=r.id?`https://img.youtube.com/vi/${r.id}/hqdefault.jpg`:"";
      const comment=esc(r.comment);
      const title=esc(r.title||r.id||r.url);
      const author=esc(r.author||"");
      const start=r.start?`${esc(r.start)}秒から`:"";
      if(r.id && thumb){
        if(r.title){
          return `<div style="margin-top:8px;border:1px solid #e5e3f2;border-radius:12px;overflow:hidden;"><img src="${thumb}" alt="" style="width:100%;height:78px;object-fit:cover;display:block"><div style="padding:8px;font-size:12px;"><b>${title}</b><br><span style="font-size:11px;color:#6b6a7a;">${author}${start?` · ${start}`:""}</span>${comment?`<div style="margin-top:4px;">${comment}</div>`:""}</div></div>`;
        } else {
          return `<div style="margin-top:8px;border:1px solid #e5e3f2;border-radius:12px;overflow:hidden;"><img src="${thumb}" alt="" style="width:100%;height:78px;object-fit:cover;display:block"><div style="padding:8px;font-size:12px;">${comment}</div></div>`;
        }
      } else {
        return `<div style="margin-top:8px;border:1px solid #e5e3f2;border-radius:12px;overflow:hidden;"><div style="height:48px;background:#f7f5ff;display:grid;place-items:center;font-size:11px;color:#6b6a7a;">${esc(r.url)}</div>${comment?`<div style="padding:8px;font-size:12px;">${comment}</div>`:""}</div>`;
      }
    }).join("");
  }
  // song (up to 6) with comment
  let songThumbHtml="";
  if(songRows.length){
    songThumbHtml = songRows.map(r=>{
      const thumb=r.id?`https://img.youtube.com/vi/${r.id}/hqdefault.jpg`:"";
      const title=esc(r.title||r.id||r.url);
      const author=esc(r.author||"");
      const comment=esc(r.comment||"");
      if(r.id && thumb){
        if(r.title){
          return `<div style="margin-top:8px;border:1px solid #e5e3f2;border-radius:12px;overflow:hidden;display:flex;gap:8px;align-items:center;padding:6px;background:#f7f5ff;"><img src="${thumb}" alt="" style="width:96px;height:54px;object-fit:cover;border-radius:8px;border:1px solid #e5e3f2"><span style="font-size:12px;"><b>${title}</b><br><span style="font-size:11px;color:#6b6a7a;">${author}</span>${comment?`<br><span style="font-size:11px;">${comment}</span>`:""}</span></div>`;
        } else {
          return `<div style="margin-top:8px;border:1px solid #e5e3f2;border-radius:12px;overflow:hidden;display:flex;gap:8px;align-items:center;padding:6px;background:#f7f5ff;"><img src="${thumb}" alt=""><span style="font-size:11px;color:#6b6a7a;">${title}${comment?` · ${comment}`:""}</span></div>`;
        }
      } else {
        return `<div style="margin-top:8px;padding:8px;border:1px dashed #e5e3f2;border-radius:12px;font-size:12px;">${title}${comment?` — ${comment}`:""}</div>`;
      }
    }).join("");
  }

  card.innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="width:36px;height:36px;border-radius:50%;background:#fff;border:1px solid #e5e3f2;display:grid;place-items:center;overflow:hidden;">${icon.startsWith("http")||icon.startsWith("data:")?`<img src="${escAttr(icon)}" style="width:100%;height:100%;object-fit:cover">`:`<span>${esc(icon||"？")}</span>`}</span>
      <b>${esc(name)}</b> ${mUltimate?`<span style="background:${color};color:#fff;padding:2px 8px;border-radius:999px;font-size:11px;">最推し ${esc(mUltimate.name)}</span>`:""}
    </div>
    ${snsRows?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 8px;">${snsRows}</div>`:""}
    <div style="font-size:12px;color:#6b6a7a;">${mUltimate?`ファンネーム ${esc(fullFan||fanName)} ${favFavs(favs)}`:"推しを選択するとここに表示"}</div>
    ${kamiThumbHtml}
    ${songThumbHtml}
    ${free?`<div style="margin-top:8px;padding:10px;border:1px dashed #e5e3f2;border-radius:12px;background:#fff;font-size:12px;white-space:pre-wrap;">${esc(free)}</div>`:""}
  `;
  // OGP style preview — official gradient + member color
  ogp.innerHTML=`<div style="width:100%;height:100%;display:grid;place-items:center;background:linear-gradient(135deg, ${color} 0%, #7f7efd 55%, #eccadc 100%);color:#fff;border-radius:12px;padding:12px;text-align:center;">
    <div style="background:rgba(255,255,255,.92);color:#222;border-radius:12px;padding:10px 14px;display:inline-flex;align-items:center;gap:8px;">
      <span style="width:28px;height:28px;border-radius:50%;background:#fff;border:1px solid #e5e3f2;display:grid;place-items:center;overflow:hidden;">${icon.startsWith("http")||icon.startsWith("data:")?`<img src="${escAttr(icon)}" style="width:100%;height:100%;object-fit:cover">`:`<span>${esc(icon||"？")}</span>`}</span>
      <b>${esc(name)}</b> <span style="font-size:11px;background:${color};color:#fff;padding:2px 6px;border-radius:999px;">${mUltimate?esc(mUltimate.name):""}</span>
    </div>
    <div style="font-size:10px;opacity:.9;">1200×630 OGP プレビュー</div>
  </div>`;

  // viewer color theming demo — apply to buttons
  document.querySelectorAll(".kit-btn.primary").forEach(b=> b.style.background=`linear-gradient(135deg, ${color} 0%, #7f7efd 100%)`);
}
function favFavs(ids){
  if(!ids.length) return "";
  const names=ids.map(id=>{
    const m=(typeof LINKER_MEMBERS!=="undefined"?LINKER_MEMBERS.find(x=>x.id===id):null);
    return m?m.name:id;
  });
  return "/" + names.join("/");
}
function isLoggedIn(){
  try{
    if(typeof firebase!=="undefined" && firebase.auth && firebase.auth().currentUser) return true;
    const raw=localStorage.getItem("millipro_userdata");
    if(raw){ const d=JSON.parse(raw); if(d.playerId||d.playerName) return true; }
    if(localStorage.getItem("millipro_userId")||localStorage.getItem("millipro_uid")) return true;
  }catch(e){}
  return false;
}
function saveDraft(){
  try{
    const kamiRows=[...document.querySelectorAll("#kamiList .media-item")].map(r=> ({
      url: r.querySelector(".kami-url")?.value||"",
      start: r.querySelector(".kami-start")?.value||"",
      comment: r.querySelector(".kami-comment")?.value||""
    }));
    const songRows=[...document.querySelectorAll("#songList .media-item")].map(r=> ({
      url: r.querySelector(".song-url")?.value||"",
      comment: r.querySelector(".song-comment")?.value||""
    }));
    const draft={
      name: document.getElementById("fieldName")?.value||"",
      icon: document.getElementById("fieldIcon")?.value||"",
      ultimate: document.getElementById("oshiUltimate")?.dataset.value||"",
      favs: [...document.querySelectorAll("#oshiFavs .custom-opt.active")].map(b=>b.dataset.id),
      kamiRows,
      songRows,
      free: document.getElementById("fieldFree")?.value||"",
      oshiHistory: document.querySelector('.custom-select[data-name="oshiHistory"]')?.dataset.value||"",
      oshiMark: document.getElementById("fieldOshiMark")?.value||"",
      sns: [...document.querySelectorAll("#snsList .sns-row")].map(r=> ({type:r.querySelector(".custom-select")?.dataset.value||"", url:r.querySelector(".sns-url")?.value||""}))
    };
    localStorage.setItem("milli-linker-draft", JSON.stringify(draft));
  }catch(e){}
}
function loadDraft(){
  try{
    const raw=localStorage.getItem("milli-linker-draft");
    if(!raw) return;
    const d=JSON.parse(raw);
    if(d.name) document.getElementById("fieldName").value=d.name;
    if(d.icon) document.getElementById("fieldIcon").value=d.icon;
    if(d.ultimate) { const w=document.getElementById("oshiUltimate"); w.dataset.value=d.ultimate; w.querySelectorAll(".custom-opt").forEach(b=> b.classList.toggle("active", b.dataset.id===d.ultimate)); }
    if(d.favs && Array.isArray(d.favs)){
      d.favs.forEach(id=>{
        const b=document.querySelector(`#oshiFavs .custom-opt[data-id="${id}"]`);
        if(b){ b.classList.add("active"); const box=b.querySelector(".custom-box"); const sv=box?.querySelector("svg"); if(sv) sv.style.display="block"; if(box){box.style.background="#7f7efd"; box.style.borderColor="#7f7efd";}}
      });
    }
    if(d.kamiRows && Array.isArray(d.kamiRows)){
      document.getElementById("kamiList").innerHTML="";
      d.kamiRows.forEach(r=> window._addKamiRow && window._addKamiRow(r));
      if(d.kamiRows.length===0) window._addKamiRow && window._addKamiRow();
    }
    if(d.songRows && Array.isArray(d.songRows)){
      document.getElementById("songList").innerHTML="";
      d.songRows.forEach(r=> window._addSongRow && window._addSongRow(r));
      if(d.songRows.length===0) window._addSongRow && window._addSongRow();
    }
    // legacy single field support
    if(d.kamiUrl && !d.kamiRows){ const el=document.getElementById("fieldKamiUrl"); if(el) el.value=d.kamiUrl; }
    if(d.kamiStart){ const el=document.getElementById("fieldKamiStart"); if(el) el.value=d.kamiStart; }
    if(d.kamiComment){ const el=document.getElementById("fieldKamiComment"); if(el) el.value=d.kamiComment; }
    if(d.songUrl && !d.songRows){ const el=document.getElementById("fieldSongUrl"); if(el) el.value=d.songUrl; }
    if(d.free) document.getElementById("fieldFree").value=d.free;
    if(d.oshiMark) document.getElementById("fieldOshiMark").value=d.oshiMark;
    if(d.oshiHistory){
      const sel=document.querySelector('.custom-select[data-name="oshiHistory"]');
      if(sel){ sel.dataset.value=d.oshiHistory; const vEl=sel.querySelector(".custom-select-value"); if(vEl) vEl.textContent=d.oshiHistory; }
    }
    if(d.sns && Array.isArray(d.sns) && d.sns.length){
      // clear default row
      document.getElementById("snsList").innerHTML="";
      d.sns.forEach(s=> {
        if(window._addSnsRow) window._addSnsRow({label: (SNS_TYPES.find(x=>x.v===s.type)?.label||s.type), placeholder: SNS_TYPES.find(x=>x.v===s.type)?.placeholder});
        const rows=[...document.querySelectorAll("#snsList .sns-row")];
        const last=rows[rows.length-1];
        if(last){
          const root=last.querySelector(".custom-select");
          const valEl=last.querySelector(".custom-select-value");
          const input=last.querySelector(".sns-url");
          if(root) root.dataset.value=s.type;
          if(valEl) valEl.textContent=SNS_TYPES.find(x=>x.v===s.type)?.label||s.type;
          if(input) input.value=s.url;
        }
      });
    }
    syncFavDisable();
    const kamiPrev=document.getElementById("kamiPreview"); if(kamiPrev) kamiPrev.style.display="flex";
    updatePreview();
  }catch(e){}
}
function esc(s){ return String(s).replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escAttr(s){ return String(s).replace(/"/g,'&quot;'); }

function initSave(){
  const btn=document.getElementById("saveBtn");
  const btn2=document.getElementById("saveBtn2");
  const hint=document.getElementById("saveHint");
  function onSave(){
    saveDraft();
    const logged=isLoggedIn();
    if(!logged){
      hint.style.display="block";
      hint.textContent="開発モード: ログインなしでローカルに保存しました。公開するにはログインしてください。";
      // allow save for dev — persist to localStorage already done, also try to show preview as if saved
      setTimeout(()=> hint.style.display="none", 3000);
      // still consider success for dev
      btn.textContent="保存しました"; setTimeout(()=> btn.textContent="保存して公開", 1500);
      if(btn2){ btn2.textContent="保存しました"; setTimeout(()=> btn2.textContent="保存して公開", 1500); }
      return;
    }
    hint.style.display="none";
    // try Firebase save if logged in (placeholder — will implement RTDB write)
    try{
      const uid = firebase.auth().currentUser?.uid;
      if(uid){
        const payload={
          name: document.getElementById("fieldName")?.value||"",
          icon: document.getElementById("fieldIcon")?.value||"",
          ultimate: document.getElementById("oshiUltimate")?.dataset.value||"",
          updatedAt: Date.now()
        };
        firebase.database().ref(`millipro/linker/${uid}`).set(payload).then(()=>{
          hint.style.display="block"; hint.style.color="#0a7a3a"; hint.textContent="公開しました！";
          setTimeout(()=> hint.style.display="none", 2000);
        }).catch(e=>{ hint.style.display="block"; hint.textContent="保存に失敗しました: "+e.message; });
      }
    }catch(e){ console.warn(e); }
  }
  if(btn) btn.addEventListener("click", onSave);
  if(btn2) btn2.addEventListener("click", onSave);
}

function resolveIcon(p){
  if(!p) return p;
  if(p.startsWith("http")||p.startsWith("data:")||p.startsWith("/")) return p;
  if(p.startsWith("../")) return p;
  return "../"+p;
}
document.addEventListener("DOMContentLoaded", ()=>{
  initLinker();
  initSong();
  initSave();
  setTimeout(()=>{
    const hint=document.getElementById("saveHint");
    if(!isLoggedIn() && hint){ hint.style.display="block"; hint.textContent="ログインしていないため、編集は自動保存されますが公開にはログインが必要です（開発中はログインなしでも保存できます）。"; }
  }, 800);
});
setInterval(saveDraft, 1500);
