# Milli Kit / Milli Linker 用 Realtime Database ルール追記案（仮ファイル）

このファイルは他リポジトリへ持っていくための一時ファイルです。
`millipro-shared`（`asia-southeast1`）の Realtime Database ルールに、下記を追記してください。
ファイル自体は `Milli-Kit` に置いていますが、実際に適用するのは Firebase コンソール（または rules を管理しているリポジトリ）です。

## 追記するブロック

`millipro` の直下、`users` や `watchEvents` と並列に `linker`（と予備の `cards`）を追加します。

```json
"linker": {
  "$uid": {
    ".read": true,
    ".write": "auth != null && auth.uid == $uid",
    ".validate": "newData.hasChildren(['name', 'ultimate'])",
    "name": { ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 20" },
    "title": { ".validate": "!newData.exists() || (newData.isString() && newData.val().length <= 20)" },
    "icon": { ".validate": "newData.isString() && newData.val().length <= 2000000" },
    "ultimate": { ".validate": "newData.isString()" },
    "favs": { ".validate": "!newData.exists() || newData.isArray()" },
    "kamiRows": { ".validate": "!newData.exists() || newData.hasChildren()" },
    "songRows": { ".validate": "!newData.exists() || newData.hasChildren()" },
    "free": { ".validate": "!newData.exists() || newData.isString()" },
    "oshiHistory": { ".validate": "!newData.exists() || newData.isString()" },
    "oshiMark": { ".validate": "!newData.exists() || newData.isString()" },
    "sns": { ".validate": "!newData.exists() || newData.hasChildren()" },
    "updatedAt": { ".validate": "newData.isNumber()" },
    "$other": { ".validate": true }
  }
},
"cards": {
  "$uid": {
    ".read": true,
    ".write": "auth != null && auth.uid == $uid",
    ".validate": true
  }
}
```

## 全体の例（推定の既存ルール + 追記）

現在の `firebase-init.js` から推定した既存ルールに、上記を組み込んだ全体例です。
実際のコンソールに表示されている JSON に、上記ブロックをマージしてください。

```json
{
  "rules": {
    "millipro": {
      "users": {
        "$uid": {
          ".read": "auth != null && auth.uid == $uid",
          ".write": "auth != null && auth.uid == $uid",
          "profile": { ".validate": "newData.hasChildren(['playerId'])" },
          "unishare": {
            "favs": { ".validate": "newData.isArray() || newData.val() == null" },
            "notif": { ".validate": true },
            "cheers": { "$videoId": { ".validate": true } }
          },
          "favorites": { ".validate": true },
          "bookmarks": { ".validate": true }
        }
      },
      "watchEvents": {
        "$pid": {
          "$videoId": {
            "$date": {
              ".read": true,
              ".write": true,
              ".validate": "newData.hasChildren(['watchedAt'])"
            }
          }
        }
      },
      "linker": {
        "$uid": {
          ".read": true,
          ".write": "auth != null && auth.uid == $uid",
          ".validate": "newData.hasChildren(['name', 'ultimate'])",
          "name": { ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 20" },
          "icon": { ".validate": "newData.isString() && newData.val().length <= 2000000" },
          "ultimate": { ".validate": "newData.isString()" },
          "favs": { ".validate": "!newData.exists() || newData.isArray()" },
          "kamiRows": { ".validate": "!newData.exists() || newData.hasChildren()" },
          "songRows": { ".validate": "!newData.exists() || newData.hasChildren()" },
          "free": { ".validate": "!newData.exists() || newData.isString()" },
          "oshiHistory": { ".validate": "!newData.exists() || newData.isString()" },
          "oshiMark": { ".validate": "!newData.exists() || newData.isString()" },
          "sns": { ".validate": "!newData.exists() || newData.hasChildren()" },
          "updatedAt": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": true }
        }
      },
      "cards": {
        "$uid": {
          ".read": true,
          ".write": "auth != null && auth.uid == $uid",
          ".validate": true
        }
      }
    }
  }
}
```

## メモ

- `.read: true` はプロフィールを誰でも閲覧できるようにするためです。非公開にしたい場合は `"auth != null"` にしてください。
- 開発中は `LocalStorage` に自動保存されるため、ルールが未反映でも動作確認は可能です。公開時に上記ルールを反映してください。
- このファイルは一時ファイルです。反映後は削除して構いません。
