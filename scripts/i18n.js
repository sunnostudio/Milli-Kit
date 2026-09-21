/* ============================================
   i18n ヘルパー（data/i18n.js の辞書を利用）
   - T(key, vars): 現在言語の文言を返す
   - milliLang.get/set: 言語取得・保存（localStorage "milli-lang"）
   - 静的HTML: data-i18n 属性で自動置換（data-i18n-html / -placeholder / -aria / -var-*）
   - 言語切替ボタン: #langToggle（クリックで JA/EN 切替＋リロード）
   ============================================ */
(function () {
  "use strict";

  var STORAGE_KEY = "milli-lang";

  var LANGS = ["ja","en","zh","ko"];
  function normalizeLang(v){
    if(!v) return "";
    v = String(v).toLowerCase();
    if(v==="zh" || v.indexOf("zh")===0) return "zh";
    if(v==="ko" || v.indexOf("ko")===0) return "ko";
    if(v==="en" || v.indexOf("en")===0) return "en";
    if(v==="ja" || v.indexOf("ja")===0) return "ja";
    return "";
  }
  function stored() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      v = normalizeLang(v);
      if(v) return v;
      // 旧キー "milli-lang" 以外の旧値 "zh-CN" 等も吸収
      var v2 = localStorage.getItem("milli-lang");
      if(v2) { v2=normalizeLang(v2); if(v2) return v2; }
    } catch (e) {}
    return "";
  }

  function getLang() {
    var v = stored();
    if (v) return v;
    var nav = (navigator.language || "ja").toLowerCase();
    if(nav.indexOf("zh")===0) return "zh";
    if(nav.indexOf("ko")===0) return "ko";
    if(nav.indexOf("en")===0) return "en";
    return "ja";
  }

  function setLang(l) {
    try { localStorage.setItem(STORAGE_KEY, l); } catch (e) {}
  }

  function dict() {
    var i18n = window.I18N || {};
    return i18n[getLang()] || i18n.ja || {};
  }

  function t(key, vars) {
    var d = dict();
    var s = d[key] !== undefined ? d[key] : ((window.I18N && window.I18N.ja && window.I18N.ja[key]) || key);
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = String(s).replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
      });
    }
    return s;
  }

  function hasKey(key) {
    return dict()[key] !== undefined ||
      (window.I18N && window.I18N.ja && window.I18N.ja[key] !== undefined);
  }

  /* データ（data.js 等）のローカライズ。言語ブロックがあればそれを、なければ日本語を返す */
  function loc(obj, key) {
    if (!obj) return undefined;
    var v = obj[key];
    var lang = getLang();
    if (obj[lang]) {
      var ev = obj[lang][key];
      if (ev !== undefined && ev !== null && ev !== "") return ev;
    }
    // en は zh/ko のフォールバックとしても使う
    if (lang !== "en" && lang !== "ja" && obj.en) {
      var ev2 = obj.en[key];
      if (ev2 !== undefined && ev2 !== null && ev2 !== "") return ev2;
    }
    return v;
  }

  /* メンバー名のローカライズ */
  function mName(m) {
    if (!m) return "";
    var lang = getLang();
    if (m[lang] && m[lang].name) return m[lang].name;
    if (lang !== "ja") {
      if (lang === "zh" && m.nameZh) return m.nameZh;
      if (lang === "ko" && m.nameKo) return m.nameKo;
      if (m.nameEn) return m.nameEn;
    }
    return m.name || m.nameEn || "";
  }

  /* タイトルのローカライズ（obj.en.title があれば英語を返す。データ全般用） */
  function tt(obj) {
    if (!obj) return "";
    var t = loc(obj, "title");
    return t !== undefined && t !== null && t !== "" ? t : (obj.title || "");
  }

  function resolveMemberName(idOrName) {
    var members = (typeof MEMBERS !== "undefined" ? MEMBERS : (window.MEMBERS || []));
    for (var i = 0; i < members.length; i++) {
      if (members[i].id === idOrName || members[i].name === idOrName) return mName(members[i]);
    }
    return null;
  }

  function applyLang() {
    var lang = getLang();
    document.documentElement.lang = lang;
    var els = document.querySelectorAll("[data-i18n]");
    Array.prototype.forEach.call(els, function (el) {
      var key = el.getAttribute("data-i18n");
      if (!hasKey(key)) return;
      var vars = {};
      Array.prototype.forEach.call(el.attributes, function (a) {
        if (a.name.indexOf("data-i18n-var-") === 0) {
          var r = resolveMemberName(a.value);
          vars[a.name.slice(14)] = r !== null ? r : a.value;
        }
      });
      if (el.hasAttribute("data-i18n-html")) el.innerHTML = t(key, vars);
      else el.textContent = t(key, vars);
      var ph = el.getAttribute("data-i18n-placeholder");
      if (ph) el.setAttribute("placeholder", t(ph));
      var aria = el.getAttribute("data-i18n-aria");
      if (aria) el.setAttribute("aria-label", t(aria));
      var ti = el.getAttribute("data-i18n-title");
      if (ti) el.setAttribute("title", t(ti));
    });
    /* メンバー名リンク・タブ（data-i18n-name="memberId"）の切り替え */
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-name]"), function (el) {
      var r = resolveMemberName(el.getAttribute("data-i18n-name"));
      if (r === null) return;
      var img = el.querySelector("img");
      if (img) {
        el.textContent = "";
        el.appendChild(img);
        el.appendChild(document.createTextNode(r));
      } else {
        el.textContent = r;
      }
    });
    /* ページタイトル（<title data-i18n="...">） */
    var ti = document.querySelector("title[data-i18n]");
    if (ti) {
      var vars = {};
      Array.prototype.forEach.call(ti.attributes, function (a) {
        if (a.name.indexOf("data-i18n-var-") === 0) {
          var r = resolveMemberName(a.value);
          vars[a.name.slice(14)] = r !== null ? r : a.value;
        }
      });
      document.title = t(ti.getAttribute("data-i18n"), vars);
    }
    /* メタディスクリプション（meta[data-i18n-desc]） */
    Array.prototype.forEach.call(document.querySelectorAll("meta[data-i18n-desc]"), function (el) {
      var k = el.getAttribute("data-i18n-desc");
      if (hasKey(k)) el.setAttribute("content", t(k));
    });
  }

  var LANG_LABEL = {ja:"EN", en:"中文", zh:"한국어", ko:"JA"};
  var LANG_NEXT = {ja:"en", en:"zh", zh:"ko", ko:"ja"};
  function initLangToggle() {
    var btns = document.querySelectorAll("#langToggle, #mobileLangToggle");
    if (!btns.length) return;
    var cur = getLang();
    btns.forEach(function (b) { b.textContent = LANG_LABEL[cur] || cur.toUpperCase(); b.setAttribute("aria-label", "Language: "+cur+" -> "+(LANG_NEXT[cur]||"ja")); });
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var nxt = LANG_NEXT[getLang()] || "ja";
        setLang(nxt);
        location.reload();
      });
    });
  }

  function init() {
    applyLang();
    initLangToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.T = t;
  window.loc = loc;
  window.mName = mName;
  window.tt = tt;
  window.milliLang = {
    get: getLang,
    set: setLang,
    apply: applyLang
  };
})();
