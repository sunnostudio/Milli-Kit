// Milli Kit — home logic (login status, cursor, launcher)
"use strict";

const KIT_SERVICES = [
  {
    id: "linker",
    title: "Milli Linker",
    tag: "推し活ツール #1",
    desc: "推し・ファンネーム・神回を1枚の名刺に。Xで貼ると名刺が大きく表示されます。",
    href: "linker/",
    cta: "開く",
    featured: true,
    icon: "link",
    thumb: "images/rogo/milli-linker-rogo.png",
    logo: "images/icon/milli-kit-icon.png",
    pills: ["X共有", "OGP名刺", "神回リンク"]
  },
  {
    id: "orbis",
    title: "Milli Orbis",
    tag: "非公式ポータル",
    desc: "配信予定・最新動画・誕生日・イベントカレンダーを集約。",
    href: "https://milli-orbis-portal.pages.dev/",
    cta: "外部で開く",
    external: true,
    icon: "orbis",
    thumb: "images/sites/milli-orbis-rogo.png",
    logo: "images/sites/milli-orbis-icon-192.png",
    pills: ["ポータル", "推しカラー"]
  },
  {
    id: "millidex",
    title: "MilliDex",
    tag: "グッズDB — Milli Orbis内",
    desc: "ミリプロ公式ショップのグッズを横断検索。販売中・過去アーカイブ・店舗マップ対応。",
    href: "https://milli-orbis-portal.pages.dev/goods/current.html",
    cta: "外部で開く",
    external: true,
    icon: "millidex",
    thumb: "images/sites/millidex-rogo.png",
    logo: "images/sites/millidex-rogo.png",
    pills: ["グッズ", "DB"]
  },
  {
    id: "unishare",
    title: "Milli Unishare",
    tag: "動画・音楽ポータル",
    desc: "ミリプロのYouTube・楽曲を横断検索。秒数指定の神回再生にも対応。",
    href: "https://milli-unishare.pages.dev/",
    cta: "外部で開く",
    external: true,
    icon: "unishare",
    thumb: "images/sites/milli-unishare-rogo.png",
    logo: "images/sites/milli-unishare-icon-192.png",
    pills: ["動画", "音楽"]
  },
  {
    id: "games",
    title: "Milli Games",
    tag: "ミニゲーム集",
    desc: "音ゲーや診断ゲームなど、ブラウザで遊べるファンゲーム集。",
    href: "https://milli-games.pages.dev/",
    cta: "外部で開く",
    external: true,
    icon: "games",
    thumb: "images/sites/milli-games-rogo.png",
    logo: "images/sites/milli-games-icon-192.png",
    pills: ["ゲーム", "ブラウザ"]
  },
  {
    id: "millivibe",
    title: "Millivibe",
    tag: "音楽 — 連続再生",
    desc: "歌みた・オリ曲だけを止まらずに聴ける音楽サービス。",
    href: "https://milli-unishare.pages.dev/millivibe.html",
    cta: "外部で開く",
    external: true,
    icon: "vibe",
    thumb: "images/sites/millivibe-rogo.png",
    logo: "images/sites/millivibe-rogo.png",
    pills: ["音楽", "連続再生"]
  }
];

function kitInit(){
  initHeader();
  initCursor();
  initLauncher();
  initAuth();
}

function initHeader(){
  const ham = document.getElementById("hamburger");
  const nav = document.getElementById("mobileNav");
  const backdrop = document.getElementById("drawerBackdrop");
  if(!ham || !nav) return;
  function toggle(open){
    const isOpen = open ?? !nav.classList.contains("open");
    nav.classList.toggle("open", isOpen);
    backdrop.classList.toggle("open", isOpen);
    ham.setAttribute("aria-expanded", String(isOpen));
    nav.setAttribute("aria-hidden", String(!isOpen));
  }
  ham.addEventListener("click", ()=> toggle());
  backdrop.addEventListener("click", ()=> toggle(false));
  nav.querySelectorAll("a").forEach(a=> a.addEventListener("click", ()=> toggle(false)));
}

function initCursor(){
  const btn = document.getElementById("cursorBtn");
  const dropdown = document.getElementById("cursorDropdown");
  const preview = document.getElementById("cursorPreview");
  if(!btn || !dropdown) return;

  const members = (typeof LINKER_MEMBERS !== "undefined" ? LINKER_MEMBERS : (typeof MEMBERS !== "undefined" ? MEMBERS : []));
  const withCursor = members.filter(m=> m.hasCursor !== false && m.cursor);

  // build dropdown
  const grid = document.createElement("div");
  grid.className = "cursor-grid";
  withCursor.forEach(m=>{
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cursor-opt";
    b.dataset.id = m.id;
    b.setAttribute("role","menuitem");
    b.innerHTML = `<img src="${m.icon}" alt="" loading="lazy"><span><span class="c-name">${escapeHtml(m.name)}</span><br><span class="c-gen">${escapeHtml(m.gen||"")}</span></span>`;
    b.addEventListener("click", ()=>{
      setKitCursor(m.id);
      close();
      renderCursorState();
    });
    grid.appendChild(b);
  });
  const disable = document.createElement("button");
  disable.type = "button";
  disable.className = "cursor-disable";
  disable.textContent = (typeof T==="function" ? (function(){ var v=T("kit.cursor.disable"); return v==="kit.cursor.disable" ? "カーソルを無効化（デフォルトに戻す）" : v; })() : "カーソルを無効化（デフォルトに戻す）");
  disable.addEventListener("click", ()=>{
    setKitCursor("");
    close();
    renderCursorState();
  });

  dropdown.innerHTML = "";
  dropdown.appendChild(grid);
  dropdown.appendChild(disable);

  function open(){
    dropdown.classList.add("open");
    btn.setAttribute("aria-expanded","true");
    dropdown.setAttribute("aria-hidden","false");
  }
  function close(){
    dropdown.classList.remove("open");
    btn.setAttribute("aria-expanded","false");
    dropdown.setAttribute("aria-hidden","true");
  }
  btn.addEventListener("click", (e)=>{
    e.stopPropagation();
    if(dropdown.classList.contains("open")) close(); else open();
  });
  document.addEventListener("click", (e)=>{
    if(!dropdown.contains(e.target) && !btn.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") close(); });

  renderCursorState();

  function renderCursorState(){
    const curId = getKitCursor();
    // preview dot
    if(curId){
      const m = members.find(x=> x.id===curId);
      if(m){
        preview.style.background = m.color || "var(--accent)";
        preview.style.backgroundImage = `url("${m.icon}")`;
        // outline color
        preview.style.outlineColor = m.color || "var(--accent)";
      }
    } else {
      preview.style.background = "var(--accent)";
      preview.style.backgroundImage = "none";
      preview.style.outlineColor = "var(--accent)";
    }
    dropdown.querySelectorAll(".cursor-opt").forEach(el=>{
      el.classList.toggle("active", el.dataset.id===curId);
    });
    applyKitCursor();
  }
}

// Cursor storage: reuse same key as Orbis for shared experience, but fallback to kit-specific
function getKitCursor(){
  try{
    const c = JSON.parse(localStorage.getItem("milli-cursor")||"null");
    if(c && c.talentId) return c.talentId;
    if(localStorage.getItem("milli-kit-cursor")) return localStorage.getItem("milli-kit-cursor");
    return "";
  }catch(e){ return localStorage.getItem("milli-kit-cursor")||""; }
}
function setKitCursor(id){
  try{
    if(!id){
      localStorage.removeItem("milli-cursor");
      localStorage.removeItem("milli-kit-cursor");
      localStorage.setItem("milli-cursor", JSON.stringify({enabled:false,talentId:""}));
    } else {
      localStorage.setItem("milli-cursor", JSON.stringify({enabled:true,talentId:id}));
      localStorage.setItem("milli-kit-cursor", id);
    }
  }catch(e){}
}
function applyKitCursor(){
  const id = getKitCursor();
  const html = document.documentElement;
  // remove old
  html.className = html.className.replace(/\bcursor-\S+/g,"").trim();
  if(id){
    html.classList.add("cursor-custom");
    html.classList.add("cursor-"+id);
    // ensure css for cursor image exists dynamically
    let style = document.getElementById("kit-cursor-style");
    if(!style){
      style = document.createElement("style");
      style.id = "kit-cursor-style";
      document.head.appendChild(style);
    }
    // map id to file (need rako/liz mapping)
    const map = {raco:"rako", liz:"rizu"};
    const file = map[id]||id;
    // cursor png is 32x32, hotspot 2 2
    const url = `images/cursors/${file}.png`;
    // milchan special
    const finalUrl = id==="milchan" ? "images/cursors/milli-chan.png" : url;
    style.textContent = `html.cursor-custom.cursor-${id}{ cursor: url("${finalUrl}") 2 2, auto; } html.cursor-custom.cursor-${id} a, html.cursor-custom.cursor-${id} button{ cursor: url("${finalUrl}") 2 2, pointer; }`;
  } else {
    html.classList.remove("cursor-custom");
    const s = document.getElementById("kit-cursor-style");
    if(s) s.textContent = "";
  }
}

function getServiceField(id, field, fallback){
  try{
    var key="kit.services."+id+"."+field;
    if(typeof T==="function"){
      var v=T(key);
      if(v!==key) {
        if(Array.isArray(v)) return v;
        return v;
      }
    }
    // fallback for array pills: check dict directly
    if(field==="pills"){
      var lang=(typeof milliLang!=="undefined" && milliLang.get) ? milliLang.get() : "ja";
      var dict=(window.I18N && (window.I18N[lang]||window.I18N.ja))||{};
      if(dict[key]!==undefined) return dict[key];
      var dictJa=window.I18N && window.I18N.ja;
      if(dictJa && dictJa[key]!==undefined) return dictJa[key];
    }
  }catch(e){}
  return fallback;
}
function renderCards(list, grid){
  grid.innerHTML = "";
  list.forEach(s=>{
    const card = document.createElement("article");
    card.className = "tool-card"+(s.featured?" featured":"");
    const externalAttr = s.external ? `target="_blank" rel="noopener"` : "";
    const externalIcon = s.external ? `<svg width="12" height="12" aria-hidden="true"><use href="#icon-external"/></svg>` : `<svg width="14" height="14" aria-hidden="true"><use href="#icon-chevron"/></svg>`;
    var tag=getServiceField(s.id,"tag",s.tag);
    var desc=getServiceField(s.id,"desc",s.desc);
    var cta=getServiceField(s.id,"cta",s.cta);
    var pills=getServiceField(s.id,"pills",s.pills);
    card.innerHTML = `
      <div class="tool-head">
        <span class="tool-icon large" aria-hidden="true">${iconForService(s)}</span>
        <span>
          <span class="tool-title">${escapeHtml(s.title)}</span><br>
          <span class="tool-tag">${escapeHtml(tag)}</span>
        </span>
      </div>
      ${s.thumb ? `<div class="tool-thumb"><img src="${s.thumb}" alt="" loading="lazy"></div>` : `<div class="tool-thumb" aria-hidden="true"><span class="thumb-icon">${iconForService(s,true)}</span></div>`}
      <div class="tool-body">
        <p class="tool-desc">${escapeHtml(desc)}</p>
        <div class="tool-meta">${pills.map(p=> `<span class="tool-pill">${escapeHtml(p)}</span>`).join("")}</div>
      </div>
      <div class="tool-actions">
        <a href="${s.href}" ${externalAttr} class="btn ${s.featured?"btn-primary":"btn-ghost"}">${escapeHtml(cta)} ${externalIcon}</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initLauncher(){
  const grid = document.getElementById("launcherGrid");
  const extGrid = document.getElementById("externalGrid");
  const tools = KIT_SERVICES.filter(s=> !s.external);
  const externals = KIT_SERVICES.filter(s=> s.external);
  if(grid) renderCards(tools, grid);
  if(extGrid) renderCards(externals, extGrid);
}

function iconForService(s, small){
  if(s.logo) return `<img src="${s.logo}" alt="" width="${small?28:32}" height="${small?28:32}" style="width:${small?28:32}px;height:${small?28:32}px;object-fit:contain;border-radius:8px;background:#fff;border:1px solid var(--border)">`;
  if(s.id==="linker") return `<svg width="${small?22:24}" height="${small?22:24}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><use href="#icon-link"/></svg>`;
  if(s.id==="orbis") return `<svg width="${small?22:24}" height="${small?22:24}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><path d="M8 12a4 4 0 0 1 8 0"/><path d="M12 8v8"/></svg>`;
  if(s.id==="unishare") return `<svg width="${small?22:24}" height="${small?22:24}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="7" width="18" height="10" rx="3"/><path d="M10 10l5 2-5 2z" fill="currentColor" stroke="none"/></svg>`;
  if(s.id==="games") return `<svg width="${small?22:24}" height="${small?22:24}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="7" width="16" height="10" rx="3"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><path d="M15 11.5h2M16 10.5v2"/></svg>`;
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><use href="#icon-spark"/></svg>`;
}

function initAuth(){
  // Firebase is initialized in firebase-init.js; we just reflect state
  const iconEl = document.getElementById("profileIcon");
  const labelEl = document.getElementById("profileLabel");
  if(!iconEl || !labelEl) return;

  function render(userData, isLogged){
    // isLogged from firebase-init: check localStorage or auth
    let name = "";
    let icon = "";
    try{
      const raw = localStorage.getItem("millipro_userdata");
      if(raw){ const d = JSON.parse(raw); name = d.playerName||""; icon = d.icon||""; }
    }catch(e){}
    // If logged in via Firebase Auth, firebase-init will have updated localStorage
    const logged = isLogged || !!name || !!localStorage.getItem("millipro_userdata");

    if(logged && (name || icon)){
      labelEl.textContent = name || (typeof T==="function" ? (function(){ var v=T("kit.account.mypage"); return v==="kit.account.mypage" ? "マイページ" : v; })() : "マイページ");
      if(icon && (icon.startsWith("http") || icon.startsWith("data:"))){
        iconEl.innerHTML = `<img src="${escapeAttr(icon)}" alt="">`;
      } else if(icon){
        iconEl.textContent = icon;
        iconEl.innerHTML = escapeHtml(icon);
        iconEl.style.fontSize = "13px";
      } else {
        iconEl.innerHTML = `<svg width="18" height="18" aria-hidden="true"><use href="#icon-user"/></svg>`;
      }
      // also update header dot if you like
    } else {
      labelEl.textContent = (typeof T==="function" ? (function(){ var v=T("kit.header.login"); return v==="kit.header.login" ? "ログイン" : v; })() : "ログイン");
      iconEl.innerHTML = `<svg width="18" height="18" aria-hidden="true"><use href="#icon-user"/></svg>`;
    }
  }

  // Poll and listen for auth changes
  render();
  // firebase-init provides onMilliproAuth if available
  try{
    if(typeof onMilliproAuth === "function"){
      onMilliproAuth(()=> render(null,true));
    }
  }catch(e){}
  window.addEventListener("storage", render);
  setInterval(render, 1500);

  // expose helper for modals
  window.kitOpenAccount = function(){
    // Prefer firebase-init's function
    if(typeof mpOpenAccount === "function") return mpOpenAccount();
    const m = document.getElementById("acctModal");
    if(m){ m.classList.add("open"); m.setAttribute("aria-hidden","false"); }
  };
  // close handlers
  document.querySelectorAll("[data-close]").forEach(b=>{
    b.addEventListener("click", ()=>{
      const id = b.getAttribute("data-close");
      const el = document.getElementById(id);
      if(el){ el.classList.remove("open"); el.setAttribute("aria-hidden","true"); }
    });
  });
  document.querySelectorAll(".acct-overlay").forEach(ov=>{
    ov.addEventListener("click", (e)=>{
      if(e.target===ov){ ov.classList.remove("open"); ov.setAttribute("aria-hidden","true"); }
    });
  });
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escapeAttr(s){ return String(s).replace(/"/g,'&quot;'); }

document.addEventListener("DOMContentLoaded", kitInit);
