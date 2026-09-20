# 計画書: ミリプロファン特化型プロフ＆名刺生成機能（Milli Cards 仮）

**作成**: 2026-09-20
**作成者**: OpenCode (Muse Spark) + SunSunmachi
**対象**: 新規リポジトリ（例 `milli-cards`）/ Milli Unishare (`youtubecontents`) / Milli Orbis
**目的**: ミリプロファンが「最推し・ファンネーム・神回（タイムスタンプ付き動画）」を1つにまとめられる lit.link 風プロフィール兼、Xシェア時に名刺になる動的OGP機能。リスナー同士の繋がりと布教を加速させる。
**ステータス**: 計画（置き場所の結論＝**新リポジトリで別サイト**。実装は別リポジトリのCodespaceで実施）
**扱い**: 消していいと言われたらこのファイルを削除してよい（暫定ドキュメント）

---

## 1. 企画概要

- **サービス名（仮）**: Milli Cards（ミリ カーズ）※「推し活ツール集」の第1弾という位置づけ。将来的にコール表・持ち物チェック等を同器に追加できるよう総称も検討
- **開発・運営**: すんすん（@SunSunmachi）
- **ポジショニング**: Milli Orbisエコシステム（Orbis=核 / Games=ミニゲーム / Unishare=動画・音楽 / Chronicle=大型ゲーム）の「推し活ツール」。UnishareでもOrbisでもなく、独立したツール集の第1弾
- **一言で**: **名刺1枚で自己紹介が完結し、Xに貼ると名刺がドカンと出る**。神シーン（YouTubeの特定秒数）布教まで1クリック

---

## 2. ターゲットと提供価値

### ① ファン（リスナー）層への価値

- 「繋がりタグ」の活性化: Xでの「#ミリプロリスナーさんと繋がりたい」のハードルを下げ、名刺画像1枚で自己紹介が完結する
- 熱量の可視化: 汎用のlit.linkでは難しかった「YouTubeの特定の秒数（神シーン）」をスマートに布教できる

### ② ミリメン（配信者）層への価値

- リスナーの可視化: 自分のリスナーが「どの動画のどのシーン」を愛してくれているのかが一目でわかる
- 配信企画への昇華: 雑談配信などで、リスナーから集まった名刺をスライドショー形式で紹介する「リスナー自己紹介凸待ち・同時視聴企画」にそのまま使える

---

## 3. 主要機能一覧（要件定義）

### 📱 ユーザー（リスナー）向け機能

- Firebaseソーシャルログイン: X（旧Twitter）またはGoogleアカウントによる簡単サインアップ
- プロフ編集・カスタマイズ
  - 基本情報: ユーザー名、Xアカウント、Discordなどの各種SNSリンク
  - 推し情報: 最推しメン（選択するとページ全体がメンバーのイメージカラーに変化）、ファンネーム（ゆらふぃら、ぬふぁみりー等）、ファン歴、推しマーク
  - 神回（動画）登録: YouTube URLと開始秒数（`?t=◯◯`）を入力。プロフ上にはサムネイルと「神シーンから再生」ボタンを設置
- 動的名刺OGPジェネレーター: プロフ保存時にサーバー側で名前・推しメン・アイコンを合成した「名刺風画像」を自動生成（Xシェア時に表示）
- 名刺画像ダウンロード機能: スマホのカメラロールに名刺画像を保存できるボタン（手動ツイートや画像添付用）

### 👑 ミリメン（公式）向け機能

- 公式認証バッジ（なりすまし防止）: ミリメン本人のX ID（数値）と照合し、自動で公式ダイヤマーク（ミリプロロゴ風）を付与。※初期は手動ホワイトリスト運用（§7参照）
- 公式専用プロフモード: メンバー本人が選ぶ「自分の神回（最大10件のカルーセル）」や、Million RECORDSの楽曲をBGM（またはジャケット風リンク）として設定可能

### 📺 配信・コミュニティ向け機能

- 配信用スライドショーモード（シークレットURL）: メンバーごと（例: `/stream/yura`）に、そのメンバーを最推しにしているリスナーの名刺が綺麗に並び、横にスライドしながら全画面で表示できる配信用画面

---

## 4. 画面（UI/UX）構成イメージ

### 1. Xタイムライン（OGP名刺）

ユーザーがURLをポストすると、リッチな名刺がドカンと表示される。

```
┌──────────────────────────────────────┐
│  ❄️ ゆらふぃら の ◯◯です！           │ ◀ 動的生成された
│ ┌───────────────┐ ┌───────────────┐  │   名刺風OGP画像
│ │  ユーザーの   │ │  最推し: ゆら │  │
│ │   アイコン    │ │  歴: 1周年    │  │
│ └───────────────┘ └───────────────┘  │
└──────────────────────────────────────┘
```

### 2. プロフィール詳細ページ（開いた先：lit.link風）

```
[ ユーザーアイコン ]
◆ ◯◯（ファンネーム: ゆらふぃら ❄️🦖）

【 SNS Links 】
[ X ] [ Discord ] [ YouTube ]

【 🎞️ 私の選ぶミリプロ神シーン！ 】
┌───────────────────────────────┐
│     [ YouTube動画のサムネイル ]      │
│ ［ ▶️ ◯分◯秒のツクリちゃんから再生 ］ │
└───────────────────────────────┘
「この雑談のこのセリフが本当に天才なので聴いてください！」
```

---

## 5. 参考: 2つのサイトの内部調査結果（2026-09-20時点）

判断材料として両サイトの中を見た結果。要旨のみ記す。

### 5-1. Milli Unishare（本リポジトリ `youtubecontents`）

- 本番: https://milli-unishare.pages.dev/ ／ 音楽: https://milli-unishare.pages.dev/millivibe.html
- 構成: Cloudflare Pages（`Output: public`、帯域無制限）＋ Render `milli-unishare-og`（OGP生成のみ残置）。旧 `onrender.com` はJSリダイレクト＋バナーで維持（`public/index.html:20-33,73-91`）
- データ: `public/data.json` 約350KB（YouTube約990件）を `scripts/fetch-data.js` が6回/日生成。`make check` でサイズ検証（`AGENTS.md` 参照）
- 強み（名刺企画との関係）:
  - 動的OGP基盤が既にある（`server/index.js` の Jimp/sharp＋QRCode実績）。名刺OGPはここに `cardOgp` を1本足せば追加$0
  - YouTube `?t=` パース・`embed?start=` 再生・サムネ取得は `public/js/video.js` で実証済み（神回リンクに直結）
  - 同居・別ページ方式の前例あり（Millivibe: `public/millivibe.html`＋`public/js/millivibe.js`、MilliFlow: `public/milliflow.html`＋`public/js/milliflow.js` 未公開）
- 弱み: ブランドは「動画と音楽」でプロフ・ソーシャル機能は異質。UGCの荒らしが本体の評判・Xカードに直撃する。`data.json`＋ポーリングの帯域事故（`docs/INCIDENT_2026-09-07.md`）の前科あり
- 相互リンクの接点: `public/site-config.json: sites[]` に1行追加するだけでエコシステムに参加できる

### 5-2. Milli Orbis（別リポジトリ・本番のみ確認）

- 本番: https://milli-orbis-portal.pages.dev/
- 主なページ: Member Guide（個別 `konomi.html` 等12名＋ミリちゃん）/ [メンバー比較表](https://milli-orbis-portal.pages.dev/members.html) / MilliDexグッズDB（`goods/current.html` 等）/ [曲DB](https://milli-orbis-portal.pages.dev/songs.html) / 検定 `quiz.html` / Event Calendar＋`.ics` / カーソル配布 `cursors.html` / [マイページ](https://milli-orbis-portal.pages.dev/account.html)
- アカウントの正本: Milli Orbisアカウント（Google/X/メール）→ RTDB `millipro/users/{uid}/profile` に `playerId / playerName / icon / ultimateOshi / favorites` を保持。Unishare/Games/Chronicleはfollower（`ensure→apply` の2段階、gamedata同期なし。詳細は本リポジトリの `連携ハンドオフ.md` §2-3）
- 強み: 最推し・推し・推しカラー・アイコン判別（絵文字 or dataURL）の仕組みが既存。`/stream/{member}` 構想は個別メンバーページの延長で自然。ポータル利用者と推し活層が一致
- 弱み: トップページは既に多機能で、これ以上詰め込むと迷子。動的OGP基盤はなく新設かUnishare-og間借りが必要。YouTube秒指定再生の知見はUnishareからの移植が必要
- 相互リンクの接点: ランチャー枠＋個別メンバーページからの導線

### 5-3. その他エコシステム

- Milli Games: https://milli-games.pages.dev/（別リポジトリ・分離の前例）
- Millipro Chronicle: https://millipro-chronicle.onrender.com/（報酬付与の本アプリ。名刺側に報酬数値は持たせない。`連携ハンドオフ.md` §0の役割分担を厳守）
- 関連ドキュメント: `PLAN_MIGRATION.md`（移行・運用ルール）/ `docs/SOUNDBOARD_PLAN.md` / `docs/TIKTOK_TWICAS_PLAN.md`（同居 vs 分離の検討前例。MilliFlowは同居・別ページ方式に決定済み）

---

## 6. 置き場所の結論: 新リポジトリで別サイト（推し活ツール集の第1弾）

| 観点 | Unishare同居 | Orbis同居 | 新サイト |
|---|---|---|---|
| OGP名刺 | ◎ `server/index.js` 流用 | △ 新設か間借り | ○ `og:image` 間借りで$0 |
| アカウント・推し色 | △ followerのみ | ◎ 正本そのもの | ○ Orbisを正本、新サイトはfollower |
| 神回 `?t=` 再生 | ◎ 実績あり | △ 移植が必要 | ○ コピペ移植 |
| `/stream/成员` | △ 入れ子問題（MilliFlow案C原則に抵触） | ◎ 自然 | ◎ 自由設計 |
| ブランド・発見性 | △ 異質だが拡散力最大 | ○ 一致 | △ 初期無名→相互送客で補う |
| 運用リスク | × 本体へ直撃 | △ 中枢に負荷 | ◎ 隔離 |
| 拡張性 | × 散らかる | △ 肥大 | ◎ ツール集の器 |

- UGC（ユーザー生成）DB型は、静的 `data.json` 駆動のUnishareと相性が悪い。MilliFlowが同居で正解だったのは「同じSheets→同じJSON→同じ動画ブランド」だからであり、名刺は当てはまらない
- 9/7障害の教訓（別ワークスペース隔離）を守る。別リポジトリ→別Pagesプロジェクト→別ワークスペース
- モノレポ（同一リポジトリのサブフォルダ）にしない。Pagesの `Output` が Unishare=`public` / Games=`/` とバラバラで、出し分けは `_redirects` 事故等の再発要因になる

---

## 7. 技術選定案（参考・別リポジトリで確定すること）

- 認証: Firebase Authentication（X / Google）。**新規Firestoreは作らず**既存 `millipro-shared` RTDBに `millipro/cards/{uid}` サブツリー追加。ルールは `users/` と同型（本人のみ書き込み）。課金・二重管理を避ける
- OGP画像生成: **既存Render `milli-unishare-og` に `cardOgp` を1本追加して `og:image` 間借り**（Jimp合成の実績あり、追加$0）。Cloudinary（帯域制限・URL改変）や Vercel OG（新ホスティング・別請求）は不採用を推奨
- フロント: Unishareの `video-card`＋Orbisの推しカラーCSSをコピペ。神回再生は `video.js` の `start` パターンを移植。名刺ダウンロードは `canvas.toDataURL`＋a[download]でフロント完結
- 公式バッジ: 初期は手動ホワイトリスト（`cards/official/{uid}=true` を運営が立てる）。X ID数値の自動照合はPhase2
- 役割分担: 名刺側に報酬数値を持たせない（`連携ハンドオフ.md` §0厳守）。Phase3の自動バッジは `watchEvents`/`gameEvents` の読み取りに留める
- 相互送客: 新サイト→ `orbisLink.pageMap` でOrbisメンバーページ＋Unishareタブへ返す。Unishare側は `site-config.json: sites[]` に1行、Orbis側はランチャーに1枠（両本体の無改修を維持）

---

## 8. 実装・公開に向けた3ステップ・ロードマップ

- **フェーズ1：MVP（最小限の機能）リリース**: Firebaseログイン、プロフ編集（テキスト・YouTubeリンク）、名刺風OGPの自動生成。まずはリスナー同士がXで「名刺を交換して繋がる」体験を完成させる
- **フェーズ2：ミリメン巻き込み（スライドモード）実装**: 配信用スライドショー画面の実装。ミリメンのX IDを登録し、公式バッジ機能を有効化。「ミリメンの配信でリスナーのプロフを紹介してもらう」ためのアプローチを開始
- **フェーズ3：自動推し活データ連携**: サイト内の他の機能（動画ポータル等）と連携し、よく見ている動画などが自動でプロフに実績バッジとして追加される仕組みの構築

### 新リポジトリ側の段取り（別Codespaceで実施）

1. 新規リポジトリ作成（例 `milli-cards`。オーナーはSunSunmachi側推奨。Gamesの `nun92425` 分離でpush権限403の手間があったため）。最初に `cards-start` タグを打つ（MilliFlowの `milliflow-start` と同型のロールバック境界）
2. 雛形（`index.html ?u=` / `edit.html` / `stream/{member}.html` / `js/cards.js`）＋ Firebase follower連携（gamedata同期なし版）
3. `milli-unishare-og` に `cardOgp` 追加→Xカード検証→Unishare/Orbisから相互リンク→公開

---

## 9. 要確認（別リポジトリで作業前に決めること）

1. リポジトリ名・Pages名（例 `milli-cards` → `milli-cards.pages.dev`？ツール集の器にするなら `milli-tools` 等の総称も可）
2. 公開／非公開（最初はprivate→Pages公開でも可）
3. OGPは間借り（$0・やや制約あり）でOKか、Vercel OG級の自由度が欲しいか
4. 公式バッジの初期ホワイトリスト運用ルール（誰が立てるか・削除フロー）

---

*関連: `連携ハンドオフ.md` / `PLAN_MIGRATION.md` / `docs/INCIDENT_2026-09-07.md` / `docs/SOUNDBOARD_PLAN.md` / `docs/TIKTOK_TWICAS_PLAN.md`*
