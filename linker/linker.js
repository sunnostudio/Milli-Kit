// Linker — custom UI (no native select/checkbox), official colors
"use strict";

const SNS_TYPES = [
  {v:"x", label:"X", placeholder:"@xxx または https://x.com/xxx（サブ垢用）", pattern:"x"},
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
  initGallery();
  bindCounts();
  bindBirthday();
  bindPreview();
  // load existing if any
  loadDraft();
  syncFavDisable();
  checkCloudinaryConfig();
}
function checkCloudinaryConfig(){
  const note=document.getElementById("galleryCloudinaryNote");
  if(!note) return;
  try{
    if(typeof isCloudinaryConfigured==="function" && !isCloudinaryConfigured()){
      note.style.display="block";
    } else {
      note.style.display="none";
    }
  }catch(e){ note.style.display="none"; }
}

function syncFavDisable(){
  const ultimate=document.getElementById("oshiUltimate")?.dataset.value||"";
  const grp=(typeof GROUP_MEMBERS!=="undefined"&&GROUP_MEMBERS[ultimate])||null;
  document.querySelectorAll("#oshiFavs .custom-opt").forEach(b=>{
    const isUlt = b.dataset.id===ultimate && ultimate!=="";
    const isGrpMember = !!(grp && grp.includes(b.dataset.id));
    const dis=isUlt||isGrpMember;
    b.disabled=dis;
    b.style.opacity=dis?"0.45":"";
    b.style.pointerEvents=dis?"none":"";
    if(dis && b.classList.contains("active")){
      b.classList.remove("active");
      const box=b.querySelector(".custom-box"); const sv=box?.querySelector("svg");
      if(sv) sv.style.display="none";
      if(box){ box.style.background="#fff"; box.style.borderColor="#c8c6de"; }
    }
    if(isGrpMember && !isUlt){
      b.title="最推しグループのメンバーのため選択できません";
    } else if(isUlt){
      b.title="";
    } else {
      b.title="";
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
function isValidXHandle(h){ return /^[A-Za-z0-9_]{1,15}$/.test(h); }
function isValidXUrl(url){
  if(!url) return false;
  try{
    const u=new URL(url.startsWith("http")?url:`https://x.com/${url.replace(/^@/,"")}`);
    if(!/^(www\.)?x\.com$/i.test(u.hostname) && !/^(www\.)?twitter\.com$/i.test(u.hostname)) return false;
    const handle=u.pathname.split("/")[1]||"";
    return isValidXHandle(handle);
  }catch(e){
    return isValidXHandle(String(url).replace(/^@/,"").split("/")[0]);
  }
}
async function initXField(){
  const wrap = document.getElementById("xFieldWrap");
  if(!wrap) return;
  let linked = "";
  // 1) localStorage (Orbis連携)
  try{
    const raw=localStorage.getItem("millipro_userdata");
    if(raw){
      const d=JSON.parse(raw);
      const cand = d.xUrl || (d.xId && "https://x.com/"+d.xId) || (d.xHandle && "https://x.com/"+String(d.xHandle).replace(/^@/,""));
      if(cand && isValidXUrl(cand)) linked=cand;
    }
  }catch(e){}
  // 2) Firebase Auth providerData (X連携) — 表示名がひらがなの場合は除外
  if(!linked){
    try{
      const u = (typeof firebase!=="undefined" && firebase.auth && firebase.auth().currentUser) ? firebase.auth().currentUser : null;
      if(u && u.providerData){
        const tw = u.providerData.find(p=>p.providerId==="twitter.com");
        if(tw){
          if(tw.displayName && isValidXHandle(tw.displayName.replace(/^@/,""))) linked="https://x.com/"+tw.displayName.replace(/^@/,"");
          else if(tw.uid && isValidXHandle(tw.uid)) linked="https://x.com/"+tw.uid;
        }
      }
    }catch(e){}
  }
  // 3) RTDB profileから取得（非同期、見つかれば上書き）
  const applyLinked = (url)=>{
    if(!url || wrap.dataset.value) return;
    if(!isValidXUrl(url)) return;
    wrap.innerHTML=`<div class="kit-input-wrap" style="background:#f7f5ff"><input class="kit-input" value="${escAttr(url)}" disabled><span class="kit-input-focus"></span></div><p class="field-note">Xと連携済みのため自動表示されています。</p>`;
    wrap.dataset.value=url;
    if(typeof updatePreview==="function") updatePreview();
    if(typeof saveDraft==="function") saveDraft();
  };
  if(linked){
    applyLinked(linked);
  } else {
    wrap.innerHTML=`<div class="kit-input-wrap"><input id="fieldX" class="kit-input" type="text" placeholder="@xxx または https://x.com/xxx"><span class="kit-input-focus"></span></div>`;
    wrap.querySelector("#fieldX").addEventListener("input", updatePreview);
  }
  // 非同期でRTDBを再確認（ログイン直後など localStorageが古い場合）
  try{
    let uid=null;
    if(typeof firebase!=="undefined" && firebase.auth && firebase.auth().currentUser) uid=firebase.auth().currentUser.uid;
    if(!uid && typeof getMilliproUid==="function") uid=getMilliproUid();
    if(uid && typeof firebase!=="undefined" && firebase.database){
      const snap=await firebase.database().ref(`millipro/users/${uid}/profile`).once("value");
      const p=snap.val();
      if(p){
        const xFromProfile = p.xUrl || p.xId && ("https://x.com/"+p.xId) || p.xHandle && ("https://x.com/"+String(p.xHandle).replace(/^@/,""));
        if(xFromProfile) applyLinked(xFromProfile);
      }
      // linkerにも保存されている場合
      if(!wrap.dataset.value){
        const snap2=await firebase.database().ref(`millipro/linker/${uid}`).once("value");
        const l=snap2.val();
        if(l && l.xUrl) applyLinked(l.xUrl);
      }
    }
  }catch(e){}
  // authが遅延する場合に備えて監視
  try{
    if(typeof firebase!=="undefined" && firebase.auth && typeof firebase.auth().onAuthStateChanged==="function"){
      firebase.auth().onAuthStateChanged(async (user)=>{
        if(user && !wrap.dataset.value){
          // 再試行
          let url="";
          try{
            const snap=await firebase.database().ref(`millipro/users/${user.uid}/profile`).once("value");
            const p=snap.val();
            if(p) url = p.xUrl || (p.xId && "https://x.com/"+p.xId) || "";
          }catch(e){}
          if(url) applyLinked(url);
          else {
            const tw=user.providerData && user.providerData.find(p=>p.providerId==="twitter.com");
            if(tw && tw.displayName) applyLinked("https://x.com/"+String(tw.displayName).replace(/^@/,""));
          }
        }
      });
    }
  }catch(e){}
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
      <div class="kit-input-wrap" style="flex:1"><input class="kit-input sns-url" type="text" placeholder="${escAttr(ph)}" value="${escAttr(pref.url||"")}"><span class="kit-input-focus"></span></div>
      <button type="button" class="sns-remove" aria-label="削除"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><use href="#icon-trash"/></svg></button>
      <div class="kit-input-wrap sns-memo-wrap"><input class="kit-input sns-memo" type="text" maxlength="30" placeholder="メモ（任意：例 サブ垢・告知用）" value="${escAttr(pref.memo||"")}"><span class="kit-input-focus"></span></div>
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
    const memo=row.querySelector(".sns-memo");
    if(pref.type && root){ root.dataset.value=pref.type; }
    if(memo) memo.addEventListener("input", ()=>{ updatePreview(); saveDraft(); });
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
function initGallery(){
  const grid=document.getElementById("galleryGrid");
  if(!grid) return;
  // expose for load
  window._galleryGrid=grid;
  window._addGalleryCard = addCard;
  // init 6 empty slots if empty
  if(grid.children.length===0){
    for(let i=0;i<6;i++) addCard();
  }
  function addCard(pref={}){
    if(grid.children.length>=6) return;
    const card=document.createElement("div");
    card.className="gallery-card";
    card.dataset.url=pref.url||"";
    const hasImg=!!pref.url;
    card.innerHTML=`
      <div class="gallery-thumb">
        ${hasImg?`<img src="${escAttr(pref.url)}" alt="">`:`<div class="gallery-placeholder">画像<br><span style="font-size:10px;">クリックで選択</span></div>`}
        ${hasImg?`<button type="button" class="gallery-remove" aria-label="削除">×</button>`:""}
        <div class="gallery-progress" style="display:none"><div class="gallery-progress-bar"></div></div>
      </div>
      <div class="gallery-card-actions">
        <label class="gallery-upload-btn">画像を選ぶ<input type="file" accept="image/*" hidden></label>
        <input class="kit-input gallery-comment" type="text" maxlength="40" placeholder="ひとこと(任意)" value="${escAttr(pref.comment||"")}">
      </div>
    `;
    const thumb=card.querySelector(".gallery-thumb");
    const progress=card.querySelector(".gallery-progress");
    const bar=card.querySelector(".gallery-progress-bar");
    const fileInput=card.querySelector('input[type="file"]');
    const commentInput=card.querySelector(".gallery-comment");
    const removeBtn=card.querySelector(".gallery-remove");
    if(removeBtn){
      removeBtn.addEventListener("click", ()=>{
        card.dataset.url="";
        thumb.innerHTML=`<div class="gallery-placeholder">画像<br><span style="font-size:10px;">クリックで選択</span></div><div class="gallery-progress" style="display:none"><div class="gallery-progress-bar"></div></div>`;
        saveDraft(); updatePreview();
      });
    }
    // click thumb to trigger file
    thumb.addEventListener("click", (e)=>{
      if(e.target.closest(".gallery-remove")) return;
      fileInput.click();
    });
    fileInput.addEventListener("change", async ()=>{
      const file=fileInput.files[0];
      if(!file) return;
      // validate
      if(!file.type.startsWith("image/")){ alert("画像ファイルを選んでください"); return; }
      if(file.size>5*1024*1024){ alert("画像は5MBまでにしてください"); return; }
      // show progress
      progress.style.display="block"; bar.style.width="0%";
      try{
        let resUrl="";
        if(typeof isCloudinaryConfigured==="function" && isCloudinaryConfigured() && typeof uploadToCloudinary==="function"){
          const res=await uploadToCloudinary(file, (pct)=>{ bar.style.width=pct+"%"; });
          resUrl=res.url;
        } else {
          // fallback: dataURL (local only, share時は表示されない旨を注記済み)
          resUrl=await new Promise((res, rej)=>{
            const r=new FileReader();
            r.onload=()=>res(r.result);
            r.onerror=()=>rej(new Error("読み込み失敗"));
            r.readAsDataURL(file);
          });
          // also warn once
          const note=document.getElementById("galleryCloudinaryNote");
          if(note) note.style.display="block";
        }
        card.dataset.url=resUrl;
        thumb.innerHTML=`<img src="${escAttr(resUrl)}" alt=""><button type="button" class="gallery-remove" aria-label="削除">×</button><div class="gallery-progress" style="display:none"><div class="gallery-progress-bar"></div></div>`;
        thumb.querySelector(".gallery-remove").addEventListener("click", ()=>{
          card.dataset.url="";
          thumb.innerHTML=`<div class="gallery-placeholder">画像<br><span style="font-size:10px;">クリックで選択</span></div><div class="gallery-progress" style="display:none"><div class="gallery-progress-bar"></div></div>`;
          saveDraft(); updatePreview();
        });
        progress.style.display="none";
        saveDraft(); updatePreview();
        if(window.updateOgpPreview) window.updateOgpPreview();
      }catch(err){
        progress.style.display="none";
        alert(err.message||"アップロードに失敗しました");
      }
      fileInput.value="";
    });
    commentInput.addEventListener("input", ()=>{ saveDraft(); updatePreview(); });
    grid.appendChild(card);
  }
  // expose helper to collect
  window._getGalleryData = ()=> [...grid.children].map(c=> ({
    url: c.dataset.url||"",
    comment: c.querySelector(".gallery-comment")?.value||""
  })).filter(x=>x.url);
}
function bindBirthday(){
  const bday=document.getElementById("fieldBirthday");
  if(bday){
    bday.addEventListener("input", ()=>{ saveDraft(); updatePreview(); if(window.updateOgpPreview) window.updateOgpPreview(); });
    bday.addEventListener("change", ()=>{ saveDraft(); updatePreview(); if(window.updateOgpPreview) window.updateOgpPreview(); });
  }
  // birthdayPublic is handled by initCustomSelects already (calls updatePreview)
}
function bindCounts(){
  const map=[["fieldName","countName",20],["fieldTitle","countTitle",20],["fieldFree","countFree",200]];
  map.forEach(([fid,cid,max])=>{
    const i=document.getElementById(fid), c=document.getElementById(cid);
    if(i&&c) i.addEventListener("input", ()=> c.textContent=String(i.value.length));
  });
}
function bindPreview(){
  ["fieldName","fieldTitle","fieldIcon","fieldOshiMark","fieldFree"].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.addEventListener("input", ()=>{ updatePreview(); if(window.updateOgpPreview) window.updateOgpPreview(); saveDraft(); });
  });
  updatePreview();
  if(window.updateOgpPreview) window.updateOgpPreview();
}
function isValidXHandleStrict(h){ return /^[A-Za-z0-9_]{1,15}$/.test(h); }
function snsToUrl(type, raw){
  raw=(raw||"").trim();
  if(!raw) return "";
  if(/^https?:\/\//.test(raw)){
    if(type==="x"){
      try{ const u=new URL(raw); const hd=u.pathname.split("/")[1]||""; if(!isValidXHandleStrict(hd)) return ""; }catch(e){ return ""; }
    }
    return raw;
  }
  if(type==="x"){
    const hd=raw.replace(/^@/,"").split("/")[0].split("?")[0];
    if(!isValidXHandleStrict(hd)) return "";
    return `https://x.com/${hd}`;
  }
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
function formatBirthday(bday, pub){
  if(!bday || pub==="hidden") return "";
  const m=bday.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m) return "";
  const y=m[1], mo=m[2], d=m[3];
  if(pub==="full") return `${y}/${mo}/${d}`;
  return `${mo}/${d}`;
}
function birthdayIconSvg(size){
  size=size||12;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:-1px;"><use href="#icon-birthday"/></svg>`;
}
function lightenColor(hex, amt){
  try{
    let h=hex.replace("#",""); if(h.length===3) h=h.split("").map(c=>c+c).join("");
    const n=parseInt(h,16); const r=(n>>16)&255, g=(n>>8)&255, b=n&255;
    const nr=Math.round(r + (255-r)*amt), ng=Math.round(g + (255-g)*amt), nb=Math.round(b + (255-b)*amt);
    return `rgb(${nr},${ng},${nb})`;
  }catch(e){ return "#fff"; }
}
function updatePreview(){
  const name=document.getElementById("fieldName")?.value||"あなたの名前";
  const shoulder=document.getElementById("fieldTitle")?.value||"";
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
  const birthday=document.getElementById("fieldBirthday")?.value||"";
  const birthdayPublic=document.querySelector('.custom-select[data-name="birthdayPublic"]')?.dataset.value||"monthDay";
  const birthdayText=formatBirthday(birthday, birthdayPublic);
  const galleryRows=(typeof window._getGalleryData==="function" ? window._getGalleryData() : [...document.querySelectorAll("#galleryGrid .gallery-card")].map(c=> ({
    url: c.dataset.url||"",
    comment: c.querySelector(".gallery-comment")?.value||""
  })).filter(x=>x.url));

  const mUltimate = (typeof LINKER_MEMBERS!=="undefined") ? LINKER_MEMBERS.find(x=>x.id===ultimate) : null;
  const color = mUltimate ? mUltimate.color : "#7f7efd";
  const fanName = mUltimate ? (mUltimate.fanName||"") : "";
  let fullFan=""; try{ const f=(typeof MEMBERS!=="undefined"?MEMBERS.find(x=>x.id===ultimate):null); if(f) fullFan=f.fanName; }catch(e){}

  const card=document.getElementById("cardPreview");
  const ogp=document.getElementById("ogpPreview");
  if(!card) return;
  const iconMap={ x:"icon-x", youtube:"icon-youtube", discord:"icon-discord", instagram:"icon-instagram", tiktok:"icon-tiktok", line:"icon-line", wick:"icon-wick", other:"icon-link" };
  // Xは上部のxUrlを先頭に統合
  const xUrlRaw=document.getElementById("fieldX")?.value || document.getElementById("xFieldWrap")?.dataset.value || "";
  const snsFromRows=[...document.querySelectorAll("#snsList .sns-row")].map(r=>{
    const t=r.querySelector(".custom-select")?.dataset.value;
    const u=r.querySelector(".sns-url")?.value.trim();
    const memo=r.querySelector(".sns-memo")?.value.trim()||"";
    if(!t||!u) return null;
    const url=snsToUrl(t,u);
    const label=SNS_TYPES.find(x=>x.v===t)?.label||t;
    let iconHtml="";
    if(t==="wick"){
      iconHtml=`<img src="../images/sites/wick-icon.png" alt="" width="13" height="13" style="width:13px;height:13px;object-fit:contain;border-radius:3px">`;
    } else {
      const iconId=iconMap[t]||"icon-link";
      iconHtml=`<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><use href="#${iconId}"/></svg>`;
    }
    return {type:t, url, label, memo, iconHtml};
  }).filter(Boolean);
  if(xUrlRaw){
    const xUrlNorm=snsToUrl("x", xUrlRaw);
    if(xUrlNorm){
      const xIcon=`<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-x"/></svg>`;
      snsFromRows.unshift({type:"x", url:xUrlNorm, label:"X", memo:"", iconHtml:xIcon});
    }
  }
  const snsRows=snsFromRows.map(s=>`<a href="${escAttr(s.url)}" target="_blank" rel="noopener" title="${escAttr(s.memo||s.label)}" style="display:inline-flex;align-items:center;gap:5px;border:1px solid #e5e3f2;border-radius:999px;padding:4px 10px;background:#fff;font-size:11px;font-weight:700;text-decoration:none;color:#222;">${s.iconHtml}${esc(s.label)}${s.memo?`<span style="font-weight:400;color:#8a86a3;">${esc(s.memo)}</span>`:""}</a>`).join(" ");

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
  // gallery (up to 6)
  let galleryHtml="";
  if(galleryRows.length){
    galleryHtml = `<div style="margin-top:8px;"><div style="font-size:11px;font-weight:800;color:#6b6a7a;margin-bottom:6px;">画像ギャラリー</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">` + galleryRows.map(g=>{
      const cmt=esc(g.comment||"");
      return `<div style="border:1px solid #e5e3f2;border-radius:12px;overflow:hidden;background:#fff;"><img src="${escAttr(g.url)}" alt="" style="width:100%;aspect-ratio:4/3;object-fit:cover;display:block;">${cmt?`<div style="padding:6px;font-size:11px;white-space:pre-wrap;">${cmt}</div>`:""}</div>`;
    }).join("") + `</div></div>`;
  }
  const birthdayHtml=birthdayText?`<span style="display:inline-flex;align-items:center;gap:4px;background:#fff;border:1px solid #e5e3f2;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:700;color:#6b6a7a;">${birthdayIconSvg(12)} ${esc(birthdayText)}</span>`:"";

  card.innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="width:36px;height:36px;border-radius:50%;background:#fff;border:1px solid #e5e3f2;display:grid;place-items:center;overflow:hidden;">${icon.startsWith("http")||icon.startsWith("data:")?`<img src="${escAttr(icon)}" style="width:100%;height:100%;object-fit:cover">`:`<span>${esc(icon||"？")}</span>`}</span>
      <span><b>${esc(name)}</b> ${shoulder?`<span style="font-size:11px;color:#6b6a7a;font-weight:700;margin-left:6px;">${esc(shoulder)}</span>`:""} ${mUltimate?`<span style="background:${color};color:#fff;padding:2px 8px;border-radius:999px;font-size:11px;">最推し ${esc(mUltimate.name)}</span>`:""} ${birthdayHtml}</span>
    </div>
    ${snsRows?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 8px;">${snsRows}</div>`:""}
    <div style="font-size:12px;color:#6b6a7a;">${mUltimate?`ファンネーム ${esc(fullFan||fanName)} ${favFavs(favs)}`:"推しを選択するとここに表示"} ${birthdayText?` · ${birthdayIconSvg(11)} ${esc(birthdayText)}`:""}</div>
    ${kamiThumbHtml}
    ${songThumbHtml}
    ${galleryHtml}
    ${free?`<div style="margin-top:8px;padding:10px;border:1px dashed #e5e3f2;border-radius:12px;background:#fff;font-size:12px;white-space:pre-wrap;">${esc(free)}</div>`:""}
  `;
  const btnLight = (mUltimate && mUltimate.subColor) ? mUltimate.subColor : lightenColor(color, 0.72);
  // OGP business card preview — canvas版があればそちらに任せる（1.2倍ロゴが反映される）
  if(window.updateOgpPreview){
    window.updateOgpPreview();
  } else {
    // fallback: canvas未読込時の簡易プレビュー — talent-based
    ogp.innerHTML=`<div style="width:100%;height:100%;display:grid;place-items:center;background:linear-gradient(135deg, ${color} 0%, ${btnLight} 100%);color:#fff;border-radius:12px;padding:12px;text-align:center;">
      <div style="background:rgba(255,255,255,.92);color:#222;border-radius:12px;padding:10px 14px;display:inline-flex;align-items:center;gap:8px;">
        <span style="width:28px;height:28px;border-radius:50%;background:#fff;border:1px solid #e5e3f2;display:grid;place-items:center;overflow:hidden;">${icon.startsWith("http")||icon.startsWith("data:")?`<img src="${escAttr(icon)}" style="width:100%;height:100%;object-fit:cover">`:`<span>${esc(icon||"？")}</span>`}</span>
        <b>${esc(name)}</b> <span style="font-size:11px;background:${color};color:#fff;padding:2px 6px;border-radius:999px;">${mUltimate?esc(mUltimate.name):""}</span>
      </div>
      <div style="font-size:10px;opacity:.9;">1200×630 OGP プレビュー</div>
    </div>`;
  }

  // viewer color theming — talent-based gradation (matches profile header)
  document.querySelectorAll(".kit-btn.primary").forEach(b=> b.style.background=`linear-gradient(135deg, ${color} 0%, ${btnLight} 100%)`);
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
    const gallery=(typeof window._getGalleryData==="function" ? window._getGalleryData() : [...document.querySelectorAll("#galleryGrid .gallery-card")].map(c=> ({
      url: c.dataset.url||"",
      comment: c.querySelector(".gallery-comment")?.value||""
    })).filter(x=>x.url));
    const draft={
      name: document.getElementById("fieldName")?.value||"",
      title: document.getElementById("fieldTitle")?.value||"",
      icon: document.getElementById("fieldIcon")?.value||"",
      ultimate: document.getElementById("oshiUltimate")?.dataset.value||"",
      favs: [...document.querySelectorAll("#oshiFavs .custom-opt.active")].map(b=>b.dataset.id),
      kamiRows,
      songRows,
      gallery,
      birthday: document.getElementById("fieldBirthday")?.value||"",
      birthdayPublic: document.querySelector('.custom-select[data-name="birthdayPublic"]')?.dataset.value||"monthDay",
      free: document.getElementById("fieldFree")?.value||"",
      oshiHistory: document.querySelector('.custom-select[data-name="oshiHistory"]')?.dataset.value||"",
      oshiMark: document.getElementById("fieldOshiMark")?.value||"",
      xUrl: document.getElementById("fieldX")?.value || document.getElementById("xFieldWrap")?.dataset.value || "",
      ogpFontJa: document.querySelector('.custom-select[data-name="ogpFontJa"]')?.dataset.value || "",
      ogpFontEn: document.querySelector('.custom-select[data-name="ogpFontEn"]')?.dataset.value || "",
      sns: [...document.querySelectorAll("#snsList .sns-row")].map(r=> ({type:r.querySelector(".custom-select")?.dataset.value||"", url:r.querySelector(".sns-url")?.value||"", memo:r.querySelector(".sns-memo")?.value||""}))
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
    if(d.title) document.getElementById("fieldTitle").value=d.title;
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
    if(d.xUrl){
      const xInput=document.getElementById("fieldX");
      if(xInput) xInput.value=d.xUrl;
      const xWrap=document.getElementById("xFieldWrap");
      if(xWrap && !xInput) xWrap.dataset.value=d.xUrl;
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
    if(d.ogpFontJa){
      const sel=document.querySelector('.custom-select[data-name="ogpFontJa"]');
      if(sel){ sel.dataset.value=d.ogpFontJa; const vEl=sel.querySelector(".custom-select-value"); if(vEl){ const opt=[...sel.querySelectorAll('[role="option"]')].find(b=>b.dataset.value===d.ogpFontJa); if(opt) vEl.textContent=opt.textContent; } }
    }
    if(d.ogpFontEn){
      const sel=document.querySelector('.custom-select[data-name="ogpFontEn"]');
      if(sel){ sel.dataset.value=d.ogpFontEn; const vEl=sel.querySelector(".custom-select-value"); if(vEl){ const opt=[...sel.querySelectorAll('[role="option"]')].find(b=>b.dataset.value===d.ogpFontEn); if(opt) vEl.textContent=opt.textContent; } }
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
          const memoEl=last.querySelector(".sns-memo");
          if(root) root.dataset.value=s.type;
          if(valEl) valEl.textContent=SNS_TYPES.find(x=>x.v===s.type)?.label||s.type;
          if(input) input.value=s.url;
          if(memoEl) memoEl.value=s.memo||"";
        }
      });
    }
    if(d.birthday){
      const b=document.getElementById("fieldBirthday");
      if(b) b.value=d.birthday;
    }
    if(d.birthdayPublic){
      const sel=document.querySelector('.custom-select[data-name="birthdayPublic"]');
      if(sel){ sel.dataset.value=d.birthdayPublic; const vEl=sel.querySelector(".custom-select-value"); if(vEl){ const opt=[...sel.querySelectorAll('[role="option"]')].find(b=>b.dataset.value===d.birthdayPublic); if(opt) vEl.textContent=opt.textContent; } }
    }
    if(d.gallery && Array.isArray(d.gallery) && d.gallery.length){
      const grid=document.getElementById("galleryGrid");
      if(grid){
        grid.innerHTML="";
        d.gallery.slice(0,6).forEach(g=> window._addGalleryCard && window._addGalleryCard(g));
        // fill remaining empty slots
        const remain=6 - grid.children.length;
        for(let i=0;i<remain;i++) window._addGalleryCard && window._addGalleryCard({});
      }
    }
    syncFavDisable();
    const kamiPrev=document.getElementById("kamiPreview"); if(kamiPrev) kamiPrev.style.display="flex";
    updatePreview();
  }catch(e){}
}
function esc(s){ return String(s).replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escAttr(s){ return String(s).replace(/"/g,'&quot;'); }

function collectPayload(){
  const kamiRows=[...document.querySelectorAll("#kamiList .media-item")].map(r=> ({
    url: r.querySelector(".kami-url")?.value||"",
    start: r.querySelector(".kami-start")?.value||"",
    comment: r.querySelector(".kami-comment")?.value||"",
    title: r.querySelector(".kami-preview")?.dataset.title||"",
    author: r.querySelector(".kami-preview")?.dataset.author||""
  })).filter(x=>x.url);
  const songRows=[...document.querySelectorAll("#songList .media-item")].map(r=> ({
    url: r.querySelector(".song-url")?.value||"",
    comment: r.querySelector(".song-comment")?.value||"",
    title: r.querySelector(".song-preview")?.dataset.title||"",
    author: r.querySelector(".song-preview")?.dataset.author||""
  })).filter(x=>x.url);
  const gallery=(typeof window._getGalleryData==="function" ? window._getGalleryData() : [...document.querySelectorAll("#galleryGrid .gallery-card")].map(c=> ({
    url: c.dataset.url||"",
    comment: c.querySelector(".gallery-comment")?.value||""
  })).filter(x=>x.url));
  return {
    name: document.getElementById("fieldName")?.value||"",
    title: document.getElementById("fieldTitle")?.value||"",
    icon: document.getElementById("fieldIcon")?.value||"",
    ultimate: document.getElementById("oshiUltimate")?.dataset.value||"",
    favs: [...document.querySelectorAll("#oshiFavs .custom-opt.active")].map(b=>b.dataset.id),
    kamiRows, songRows, gallery,
    birthday: document.getElementById("fieldBirthday")?.value||"",
    birthdayPublic: document.querySelector('.custom-select[data-name="birthdayPublic"]')?.dataset.value||"monthDay",
    free: document.getElementById("fieldFree")?.value||"",
    oshiHistory: document.querySelector('.custom-select[data-name="oshiHistory"]')?.dataset.value||"",
    oshiMark: document.getElementById("fieldOshiMark")?.value||"",
    ogpFontJa: document.querySelector('.custom-select[data-name="ogpFontJa"]')?.dataset.value || "'M PLUS Rounded 1c','Noto Sans JP',sans-serif",
    ogpFontEn: document.querySelector('.custom-select[data-name="ogpFontEn"]')?.dataset.value || "'Barlow',sans-serif",
    sns: [...document.querySelectorAll("#snsList .sns-row")].map(r=> ({type:r.querySelector(".custom-select")?.dataset.value||"", url:r.querySelector(".sns-url")?.value||"", memo:r.querySelector(".sns-memo")?.value||""})).filter(x=>x.type&&x.url),
    xUrl: document.getElementById("fieldX")?.value|| document.getElementById("xFieldWrap")?.dataset.value||"",
    updatedAt: Date.now()
  };
}
function showShareModal(link, payload){
  let modal=document.getElementById("shareModal");
  if(!modal){
    modal=document.createElement("div");
    modal.id="shareModal";
    modal.style.cssText="position:fixed;inset:0;background:rgba(20,10,30,.48);display:grid;place-items:center;z-index:80;padding:16px;";
    modal.innerHTML=`
      <div style="width:min(560px,100%);background:#fff;border:1px solid #e5e3f2;border-radius:22px;box-shadow:0 20px 60px rgba(0,0,0,.18);overflow:hidden;max-height:90vh;overflow-y:auto;">
        <div style="padding:16px 18px 0;display:flex;align-items:center;gap:8px;">
          <span style="font-weight:800;">公開しました</span>
          <button id="shareClose" style="margin-left:auto;width:32px;height:32px;border-radius:50%;border:1px solid #e5e3f2;background:#fff;display:grid;place-items:center;cursor:pointer;">×</button>
        </div>
        <div style="padding:12px 18px 18px;display:grid;gap:12px;">
          <div style="padding:10px;background:#f7f5ff;border:1px solid #e5e3f2;border-radius:12px;">
            <div style="font-size:11px;color:#6b6a7a;">あなたの公開リンク</div>
            <div style="font-size:12px;word-break:break-all;"><a id="shareLink" href="" target="_blank" rel="noopener"></a></div>
            <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
              <button id="shareCopy" style="padding:8px 14px;border-radius:999px;border:1px solid #e5e3f2;background:#fff;font-weight:700;font-size:12px;">リンクをコピー</button>
              <a id="shareView" href="" target="_blank" rel="noopener" style="padding:8px 14px;border-radius:999px;background:#7f7efd;color:#fff;text-decoration:none;font-weight:800;font-size:12px;">表示する</a>
            </div>
          </div>
          <div style="padding:10px;background:#fff;border:1px solid #e5e3f2;border-radius:12px;">
            <div style="font-size:11px;color:#6b6a7a;">Xで共有</div>
            <div style="font-size:12px;word-break:break-all;" id="shareXText"></div>
            <a id="shareXBtn" href="" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;padding:8px 14px;border-radius:999px;background:#111;color:#fff;text-decoration:none;font-weight:800;font-size:12px;">Xで投稿</a>
            <div style="font-size:11px;color:#6b6a7a;margin-top:6px;">OGP画像: <span id="shareOgp" style="word-break:break-all;"></span></div>
          </div>
          <div style="text-align:center;">
            <img id="shareQr" alt="QR" width="160" height="160" style="border:1px solid #e5e3f2;border-radius:12px;background:#fff;padding:6px;">
            <div style="font-size:11px;color:#6b6a7a;">QRコード</div>
          </div>
          <div style="display:flex;gap:8px;justify-content:center;">
            <a href="../mypage.html" style="padding:8px 14px;border-radius:999px;border:1px solid #e5e3f2;background:#fff;font-weight:700;font-size:12px;text-decoration:none;">マイページで見る</a>
            <button id="shareClose2" style="padding:8px 14px;border-radius:999px;background:#7f7efd;color:#fff;border:none;font-weight:800;font-size:12px;cursor:pointer;">閉じる</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener("click", e=>{ if(e.target===modal) modal.style.display="none"; });
    modal.querySelector("#shareClose").addEventListener("click", ()=> modal.style.display="none");
    modal.querySelector("#shareClose2").addEventListener("click", ()=> modal.style.display="none");
    modal.querySelector("#shareCopy").addEventListener("click", ()=>{
      const a=modal.querySelector("#shareLink").href;
      navigator.clipboard.writeText(a).then(()=> alert("コピーしました"));
    });
  }
  const linkEl=modal.querySelector("#shareLink");
  const viewEl=modal.querySelector("#shareView");
  const xBtn=modal.querySelector("#shareXBtn");
  const xText=modal.querySelector("#shareXText");
  const ogpEl=modal.querySelector("#shareOgp");
  const qr=modal.querySelector("#shareQr");
  linkEl.href=link; linkEl.textContent=link; viewEl.href=link;
  const mShare = (typeof LINKER_MEMBERS!=="undefined"?LINKER_MEMBERS.find(x=>x.id===payload.ultimate):null) || (typeof MEMBERS!=="undefined"?MEMBERS.find(x=>x.id===payload.ultimate):null);
  const oshiNameShare = mShare ? mShare.name : (payload.ultimate||"");
  const xTextStr=`${payload.name||"私"}のMilli Linker名刺 — 最推し ${oshiNameShare} ${link} #ミリプロ #MilliKit #MilliLinker`;
  xText.textContent=xTextStr;
  const ogpUrl=`https://milli-kit-og.onrender.com/cardOgp?uid=${encodeURIComponent(payload.uid||"local")}&v=${payload.updatedAt}`;
  ogpEl.textContent=ogpUrl;
  xBtn.href=`https://twitter.com/intent/tweet?text=${encodeURIComponent(xTextStr)}`;
  qr.src=`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(link)}`;
  modal.style.display="grid";
}
function resetAll(){
  if(!confirm("入力内容を全てリセットしますか？ 保存された下書きも削除されます。")) return;
  localStorage.removeItem("milli-linker-draft");
  // clear form
  const form=document.getElementById("linkerForm");
  if(form) form.reset();
  document.querySelectorAll(".custom-opt.active").forEach(b=>{
    b.classList.remove("active");
    const box=b.querySelector(".custom-box"); if(box){ box.style.background="#fff"; box.style.borderColor="#c8c6de"; const sv=box.querySelector("svg"); if(sv) sv.style.display="none"; }
    const dot=b.querySelector(".custom-dot"); if(dot) dot.style.display="none";
  });
  document.querySelectorAll(".custom-select").forEach(s=>{ s.dataset.value=""; const v=s.querySelector(".custom-select-value"); if(v) v.textContent="選択してください"; });
  // reset icon preview
  const iconPrev=document.getElementById("iconPreview");
  if(iconPrev) iconPrev.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><use href="#icon-user"/></svg>';
  // clear lists
  const kamiList=document.getElementById("kamiList");
  const songList=document.getElementById("songList");
  const snsList=document.getElementById("snsList");
  const galleryGrid=document.getElementById("galleryGrid");
  if(kamiList){ kamiList.innerHTML=""; if(window._addKamiRow) window._addKamiRow(); }
  if(songList){ songList.innerHTML=""; if(window._addSongRow) window._addSongRow(); }
  if(snsList){ snsList.innerHTML=""; if(window._addSnsRow) window._addSnsRow(); }
  if(galleryGrid){ galleryGrid.innerHTML=""; for(let i=0;i<6;i++) if(window._addGalleryCard) window._addGalleryCard({}); }
  // birthday
  const bday=document.getElementById("fieldBirthday"); if(bday) bday.value="";
  document.querySelectorAll('.custom-select[data-name="birthdayPublic"]').forEach(s=>{ s.dataset.value="monthDay"; const v=s.querySelector(".custom-select-value"); if(v) v.textContent="月日のみ公開"; });
  // clear counts
  document.querySelectorAll("[id^='count']").forEach(el=> el.textContent="0");
  // clear ultimate
  const ult=document.getElementById("oshiUltimate"); if(ult) ult.dataset.value="";
  syncFavDisable();
  updatePreview();
  if(window.updateOgpPreview) window.updateOgpPreview();
}
function initSave(){
  const btn=document.getElementById("saveBtn");
  const btn2=document.getElementById("saveBtn2");
  const resetBtn=document.getElementById("resetBtn");
  if(resetBtn) resetBtn.addEventListener("click", resetAll);
  function onSave(){
    saveDraft();
    const payload=collectPayload();
    let uid=null;
    try{
      if(typeof firebase!=="undefined" && firebase.auth().currentUser) uid=firebase.auth().currentUser.uid;
    }catch(e){}
    payload.uid=uid||"local";
    if(uid){
      try{
        firebase.database().ref(`millipro/linker/${uid}`).set(payload).catch(e=> console.warn(e));
      }catch(e){ console.warn(e); }
    }
    const link = uid ? `${location.origin}/linker/view.html?uid=${uid}` : `${location.origin}/linker/view.html?local=1`;
    if(btn) { btn.textContent="公開しました"; setTimeout(()=> btn.textContent="公開する", 1500); }
    if(btn2){ btn2.textContent="公開しました"; setTimeout(()=> btn2.textContent="公開する", 1500); }
    showShareModal(link, payload);
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
  loadDraft();
  updatePreview();
  if(window.updateOgpPreview) window.updateOgpPreview();
});
setInterval(saveDraft, 1500);
