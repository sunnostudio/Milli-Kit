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

  function stored() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (v === "ja" || v === "en") return v;
    } catch (e) {}
    return "";
  }

  function getLang() {
    var v = stored();
    if (v) return v;
    var nav = (navigator.language || "ja").toLowerCase();
    return nav.indexOf("en") === 0 ? "en" : "ja";
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

  /* データ（data.js 等）のローカライズ。オブジェクトの en ブロックがあれば英語を、
     なければ（未訳・日本語表記が正）元の値を返す。配列も対応 */
  function loc(obj, key) {
    if (!obj) return undefined;
    var v = obj[key];
    if (getLang() === "en" && obj.en) {
      var ev = obj.en[key];
      if (ev !== undefined && ev !== null && ev !== "") return ev;
    }
    return v;
  }

  /* メンバー名のローカライズ。EN 表示時は nameEn があればそれを返す */
  function mName(m) {
    if (!m) return "";
    if (getLang() === "en" && m.nameEn) return m.nameEn;
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

  function initLangToggle() {
    var btns = document.querySelectorAll("#langToggle, #mobileLangToggle");
    if (!btns.length) return;
    btns.forEach(function (b) { b.textContent = getLang() === "ja" ? "EN" : "JA"; });
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        setLang(getLang() === "ja" ? "en" : "ja");
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
