/* ============================================
   お気に入り☆・ブックマーク（localStorage + Firebase RTDB 同期）
   - お気に入り: 曲・動画カード（曲データベース）→ ホームの「今日のミリプロ」下に表示
   - ブックマーク: 配信予定・カレンダーイベント・お知らせ・タレントページ
   - 未ログイン: localStorage（milli-favs / milli-bookmarks）を正とする
   - ログイン中: Firebase RTDB（millipro/users/{uid}/favorites|bookmarks）を正とする
     （ログイン時にローカルが空でなければ RTDB へアップロード、あれば RTDB を採用）
   変更時は document に "milli-favs-change" イベントを発火
   ============================================ */
(function () {
  "use strict";

  var KEY_FAVS = "milli-favs";
  var KEY_BMS = "milli-bookmarks";

  var state = {
    uid: null,
    favs: read(KEY_FAVS),
    bookmarks: read(KEY_BMS)
  };

  function read(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }

  function write(key, arr) {
    try { localStorage.setItem(key, JSON.stringify(arr)); } catch (e) {}
  }

  function notify() {
    try { document.dispatchEvent(new CustomEvent("milli-favs-change")); } catch (e) {}
  }

  function idxOf(arr, key) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] && arr[i].key === key) return i;
    }
    return -1;
  }

  /* ---- Firebase 同期 ---- */
  function fbRef(which) {
    if (typeof firebase === "undefined" || !firebase.database || !state.uid) return null;
    return firebase.database().ref("millipro/users/" + state.uid + "/" + which);
  }

  function pushRemote(which, entry) {
    var ref = fbRef(which);
    if (!ref) return;
    ref.once("value").then(function (snap) {
      var arr = (snap.val() && snap.val().items) || [];
      if (idxOf(arr, entry.key) !== -1) return;
      arr.push(entry);
      ref.set({ items: arr });
    }).catch(function () {});
  }

  function removeRemote(which, key) {
    var ref = fbRef(which);
    if (!ref) return;
    ref.once("value").then(function (snap) {
      var arr = (snap.val() && snap.val().items) || [];
      var next = arr.filter(function (x) { return x && x.key !== key; });
      ref.set({ items: next });
    }).catch(function () {});
  }

  function toggle(listName, which, keyLocal, entry) {
    var arr = state[listName];
    var i = idxOf(arr, entry.key);
    if (i === -1) {
      arr.push(entry);
      write(keyLocal, arr);
      pushRemote(which, entry);
      notify();
      return true;
    }
    arr.splice(i, 1);
    write(keyLocal, arr);
    removeRemote(which, entry.key);
    notify();
    return false;
  }

  function has(listName, key) {
    return idxOf(state[listName], key) !== -1;
  }

  /* ログイン状態の追跡: RTDB とローカルの同期 */
  function syncOnLogin(uid) {
    state.uid = uid;
    if (!uid) { notify(); return; }
    try {
      var root = firebase.database().ref("millipro/users/" + uid);
      root.once("value").then(function (snap) {
        var remote = snap.val() || {};
        var rf = (remote.favorites && remote.favorites.items) || [];
        var rb = (remote.bookmarks && remote.bookmarks.items) || [];
        if (!rf.length && state.favs.length) {
          root.child("favorites").set({ items: state.favs });
        } else if (rf.length) {
          state.favs = rf;
          write(KEY_FAVS, rf);
        }
        if (!rb.length && state.bookmarks.length) {
          root.child("bookmarks").set({ items: state.bookmarks });
        } else if (rb.length) {
          state.bookmarks = rb;
          write(KEY_BMS, rb);
        }
        notify();
      }).catch(function () {});
    } catch (e) {}
  }

  if (typeof onMilliproAuth === "function") {
    onMilliproAuth(syncOnLogin);
  }

  window.MilliFav = {
    /* お気に入り（動画・曲） */
    toggleFav: function (entry) {
      return toggle("favs", "favorites", KEY_FAVS, entry);
    },
    isFav: function (key) { return has("favs", key); },
    listFavs: function () { return state.favs.slice(); },

    /* ブックマーク（配信予定・イベント・お知らせ・タレント） */
    toggleBm: function (entry) {
      return toggle("bookmarks", "bookmarks", KEY_BMS, entry);
    },
    isBm: function (key) { return has("bookmarks", key); },
    listBms: function () { return state.bookmarks.slice(); },

    uid: function () { return state.uid; }
  };
})();