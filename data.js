// Milli Kit / Milli Linker 用データ（Milli Orbis から必要なものだけ抜粋）
// 元ファイル: milli-orbis-portal.pages.dev/data.js
// 保持: SITE_CONFIG, MEMBERS, GROUP_ICON/GROUP_INFO のみ。GOODS, GAME_FEATURE, COUNTDOWN, NEWS 等は不要のため削除。
// 詳細なメンバー情報は data/members.json（軽量版）を参照。aoi のカーソルは未作成のため非表示。

const SITE_CONFIG = {
  name: "Milli Orbis",
  siteUrl: "https://milli-orbis-portal.pages.dev",
  ogImage: "/images/Milli-Orbis-OGP.png",
  tagline: "ここを開けば、今のミリプロのすべてにアクセスできる",
  disclaimer: "本サイトはファンが運営する非公式のポータルサイトです。ミリプロ公式様とは一切関係ありません。",
  sourceNote: "タレント情報の出典: ミリプロ公式サイト（https://milpr.com/）・ミリプロ非公式wiki（https://wikiwiki.jp/millipro10/）・Wikipedia。メンカラーはファン間の慣習色です。"
};

const MEMBERS = [
  {
    id: "konomi",
    gen: "0期生・創設メンバー",
    name: "甘狼このみ",
    nameEn: "Amakami Konomi",
    color: "#5f97a4",
    subColor: "#d8ecf2",
    birthday: "02-14",
    debut: "2022-12-23",
    catch: "オオカミ人間の完全セルフ受肉VTuber。将来の夢は世界征服",
    fanName: "このっ子",
    fanMark: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="#5f97a4"><circle cx="5.8" cy="8.4" r="2"/><circle cx="11" cy="6.2" r="2.1"/><circle cx="16.2" cy="8.4" r="2"/><ellipse cx="12" cy="15.2" rx="4.6" ry="3.6"/><path d="M10 18.6h4l.9 2H9.1z"/></g></svg>',
    calls: "この / このち / このちゃん / このみん",
    profile: "オオカミ人間。身長150cm（耳・ヒール込み）、年齢2歳、MBTI: INFJ。ミリプロを2023年4月1日に設立した0期生。全メンバーのキャラクターデザイン・イラスト・Live2Dを手がける「ママ」的存在で、かなりの天然（本人は「養殖」と主張）。",
    skills: "イラスト・Live2D（完全セルフ受肉）。お酒に弱くすぐ幼女化する",
    phrases: ["えへへ", "えへへ言ったら即終了"],
    likes: "チョコ（ロイズの生チョコに詳しい）、博多とんこつ、お酒、二度寝、野球観戦、ゲーム、お絵描き",
    dislikes: "セロリ、ピクルス、歌うこと、海、高いところ、ホラー、絶叫マシン、ダンス、虫",
    achievements: [
      "2022/12/23 個人勢として初配信",
      "2023/4/1 ミリプロ設立（0期生）",
      "2025/1/25 3Dお披露目",
      "書籍2冊出版（完全セルフVTuberが教える！一瞬で“かわいい”が作れるイラスト術 等）",
      "2025/12/23 1st Digital Single「想わせ♡らぶりー」",
      "2026/5 チャンネル登録者80万人達成"
    ],
    tags: { stream: "あまかみらいぶ", clip: "このこれくしょん", art: "このみすけっち" },
    links: { yt: "https://www.youtube.com/@AmakamiKonomi", x: "https://x.com/AmakamiKonomi", tiktok: "https://www.tiktok.com/@amakamikonomi" },
    img: "images/talents/konomi.webp",
    logo: "images/rogo/konomirogo.webp",
    icon: "images/icon/konomi_profile.jpg",
    catchphrase: "あなたと「すき」を共有したい。あなたと「すき」で繋がりたい。",
    introVoice: "",
    fx: "choco",
    deco: {
      label: "paw",
      shape: "paw",
      floats: [
        { k: "heart", x: 8, y: 14, size: 74, dur: 13 },
        { k: "paw", x: 88, y: 10, size: 60, dur: 15 },
        { k: "paw", x: 12, y: 74, size: 54, dur: 17 },
        { k: "heart", x: 86, y: 82, size: 48, dur: 12 }
      ]
    },
    featuredVideos: ["MN_OKWKp0rI", "GNKxOwdJgC8", "qL5FGwPkoQ4"],
    voice: "assets/voices/甘狼このみ.mp3",
    intro: "",
    en: {
      gen: "Gen 0 / Founding Member",
      catch: "A werewolf VTuber, fully self-made. Her dream for the future is world domination",
      fanName: "Kono-kko",
      calls: "Kono / Konochi / Kono-chan / Konomi-n",
      profile: "A werewolf girl. 150 cm tall (including ears & heels), age 2, MBTI: INFJ. A Gen 0 member who founded MilliPro on April 1, 2023. She is the \"Mama\" who handles character design, illustrations, and Live2D for all members, and is quite airheaded (she insists she's \"farm-raised\").",
      skills: "Illustration & Live2D (fully self-made). Gets drunk easily and reverts to a little girl",
      phrases: ["Ehehe", "Say ehehe and it's over immediately"],
      likes: "Chocolate (an expert on Royce nama chocolate), Hakata tonkotsu ramen, alcohol, sleeping in, watching baseball, games, drawing",
      dislikes: "Celery, pickles, singing, the sea, heights, horror, thrill rides, dancing, bugs",
      achievements: [
        "2022/12/23 First stream as an indie VTuber",
        "2023/4/1 Founded MilliPro (Gen 0)",
        "2025/1/25 3D debut",
        "Published 2 books (\"The Complete Self-Made VTuber's Guide to Making Things Cute in a Flash\", etc.)",
        "2025/12/23 1st Digital Single \"Omowase♡Lovely\"",
        "2026/5 Reached 800K channel subscribers"
      ],
      catchphrase: "I want to share \"love\" with you. I want to connect with you through \"love\"."
    }
  },
  {
    id: "nono",
    gen: "ミリプロSONA",
    name: "音ノ乃のの",
    nameEn: "Nonono Nono",
    color: "#6d609d",
    subColor: "#e4dff4",
    birthday: "05-04",
    debut: "2023-06-03",
    catch: "ダイヤのように輝きたいっ！♢ VSinger",
    fanName: "ののの隊",
    fanMark: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="none" stroke="#6d609d" stroke-width="2.3" stroke-linecap="round"><path d="M5.5 12.6a6.5 6.5 0 0 1 13 0"/></g><g fill="#6d609d"><rect x="3.6" y="11.9" width="4" height="6" rx="2"/><rect x="16.4" y="11.9" width="4" height="6" rx="2"/><rect x="6.3" y="14.4" width="11.4" height="2.6" rx="1.3"/></g></svg>',
    calls: "ののちゃん / ののち",
    profile: "VSinger。身長149cm、年齢20歳（ミリプロ内最年少）、MBTI: ENFP。路上ライブの録音がきっかけでスカウトされて加入。しっかり者でPONすることが滅多にない。兄4人の末っ子のブラコン。",
    skills: "歌うこと（メジャーデビュー実績）。ピアノ・ギター・ドラムも嗜む",
    phrases: ["シリアルなシーン", "ちくわ代表"],
    likes: "ちくわ（主食・最大1日8袋）、もずく、梅干し、するめいか、ブルーベリー、楽器、インテリア・お洋服集め",
    dislikes: "セロリ・パセリ等「雑草っぽいもの」",
    achievements: [
      "2023/4/1 short動画投稿開始",
      "2023/6/3 初配信（1期生デビュー）",
      "2024/5 ユニバーサルミュージックからメジャーデビュー",
      "オリジナル曲「約束」「アルテマ」「ののの音々ネ！」「ロクデナシテンシ」「HYPE SEEKER」"
    ],
    tags: { stream: "ののん家", clip: "ののちょき", art: "のののーと" },
    links: { yt: "https://www.youtube.com/@_nonono_nono", x: "https://x.com/_nonono_nono", tiktok: "" },
    img: "images/talents/nono.webp",
    logo: "images/rogo/nonorogo.webp",
    icon: "images/icon/nono_profile.jpg",
    catchphrase: "ダイヤのように輝きたいっ！",
    introVoice: "",
    fx: "note",
    deco: {
      label: "note",
      floats: [
        { k: "note", x: 10, y: 16, size: 70, dur: 13 },
        { k: "diamond", x: 86, y: 10, size: 52, dur: 16 },
        { k: "note", x: 13, y: 78, size: 46, dur: 14 },
        { k: "note", x: 72, y: 85, size: 58, dur: 12 }
      ]
    },
    featuredVideos: ["9jF60mq9Qdk", "lBUrJcR474U", "1HdUN5AP5BY"],
    voice: "assets/voices/音ノ乃のの.mp3",
    intro: "",
    en: {
      gen: "MilliPro SONA",
      catch: "I want to shine like a diamond! ♢ VSinger",
      fanName: "Nonono-tai (Nono's Squad)",
      calls: "Nono-chan / Nonochi",
      profile: "A VSinger. 149 cm tall, age 20 (the youngest in MilliPro), MBTI: ENFP. Joined after being scouted from a recording of her street performance. Reliable and almost never messes up. The youngest of four brothers and a total brocon.",
      skills: "Singing (has a major label debut). Also plays piano, guitar, and drums",
      phrases: ["Cereal scene", "Chikuwa representative"],
      likes: "Chikuwa (her staple; up to 8 packs a day), mozuku seaweed, umeboshi, dried squid, blueberries, instruments, collecting interior items and clothes",
      dislikes: "Celery, parsley, and other \"weed-like\" things",
      achievements: [
        "2023/4/1 Started posting shorts",
        "2023/6/3 First stream (Gen 1 debut)",
        "2024/5 Major label debut under Universal Music",
        "Original songs \"Yakusoku\", \"Ultima\", \"NONONO NENE!\", \"Rokudenashi Tenshi\", \"HYPE SEEKER\""
      ],
      catchphrase: "I want to shine like a diamond!"
    }
  },
  {
    id: "akubi",
    gen: "ミリプロSONA",
    name: "あくび・でもんすぺーど",
    nameEn: "Akubi Demonspade",
    color: "#5c1125",
    subColor: "#f2dde3",
    birthday: "10-31",
    debut: "2024-01-19",
    catch: "貴様ら、跪け！あくび・でもんすぺーど様だ！",
    fanName: "びぃの一族",
    fanMark: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="#5c1125"><path d="M12 4.2c-2.3 2.3-5.2 5.1-7 6.7-1 .9-.7 2.7.7 3.1.7.2 1.4 0 2-.5-.1 2-1 3.6-2.6 4.8l.7 1.2h12.4l.7-1.2c-1.6-1.2-2.5-2.8-2.6-4.8.6.5 1.3.7 2 .5 1.4-.4 1.7-2.2.7-3.1-1.8-1.6-4.7-4.4-7-6.7z"/><path d="M8 2.4c-.4-1-1.9-.7-1.8.4l.2 3.1c1-.3 1.5-1.5 1.6-3.5z"/><path d="M16 2.4c.4-1 1.9-.7 1.8.4l-.2 3.1c-1-.3-1.5-1.5-1.6-3.5z"/></g></svg>',
    calls: "あくび様 / あく様 / びー様",
    profile: "悪魔（ツノあり）。身長140cm、年齢2000歳くらい、MBTI: ISTP。同事務所初のオーディション合格者（倍率500倍）。多声類で歌が非常に上手く、MIXも自分でこなすマルチクリエイティブ。クソガキだが根は真面目。",
    skills: "声を変えて歌う（多声類）、歌・MIX、寝る",
    phrases: ["貴様ら、跪け！あくび・でもんすぺーど様だ！", "オタク"],
    likes: "ミニトマト、イチゴ、細くてカリカリのポテト、おさつどき、オタク、歌う、MIX、寝る、ワンピース（人生の教科書）",
    dislikes: "ピーマン、とうもろこし、あんこ、マジレス、急ぐこと、計画通りに動くこと、ネタバレ、ホラー、FPSゲーム（画面酔い）",
    achievements: [
      "2023/10/31 short動画初投稿",
      "2024/1/19 初配信（2期生デビュー・初のオーディション合格者）",
      "Xで万バズ多数（サブ垢で10万超いいね）",
      "2026/5/9 1st 3Dライブ「Million Story」に映像出演"
    ],
    tags: { stream: "生あくび", clip: "録あくび", art: "でもんすぺ絵ど" },
    links: { yt: "https://www.youtube.com/@Akubi.demonspade", x: "https://x.com/AkubiU_Uzz", tiktok: "https://www.tiktok.com/@akubiu_uzzzz" },
    img: "images/talents/akubi.webp",
    logo: "images/rogo/akubirogo.webp",
    icon: "images/icon/akubi_profile.jpg",
    catchphrase: "貴様ら、跪け！あくび・でもんすぺーど様だ！",
    introVoice: "",
    fx: "demon",
    deco: {
      label: "spade",
      floats: [
        { k: "spade", x: 9, y: 15, size: 66, dur: 14 },
        { k: "horn", x: 87, y: 12, size: 58, dur: 15 },
        { k: "spade", x: 13, y: 76, size: 50, dur: 13 },
        { k: "flame", x: 78, y: 83, size: 44, dur: 12 }
      ]
    },
    featuredVideos: ["PSdEXx6yKoI", "YNe2YuSqncc", "kpyynMWu-o0"],
    voice: "assets/voices/あくび・でもんすぺーど.mp3",
    intro: "",
    en: {
      gen: "MilliPro SONA",
      catch: "Kneel, you lot! I am Akubi Demonspade-sama!",
      fanName: "Bii Clan",
      calls: "Akubi-sama / Aku-sama / Bii-sama",
      profile: "A demon (with horns). 140 cm tall, around 2000 years old, MBTI: ISTP. The first audition winner in the agency (with 500:1 odds). A multi-voiced singer who is extremely good at singing and does her own mixing — a multi-creative. A brat at heart, but serious underneath.",
      skills: "Singing in different voices (multi-voice), singing & mixing, sleeping",
      phrases: ["Kneel, you lot! I am Akubi Demonspade-sama!", "Otaku"],
      likes: "Cherry tomatoes, strawberries, thin crispy fries, O-satsu Doki (sweet potato snacks), otaku stuff, singing, mixing, sleeping, One Piece (her textbook for life)",
      dislikes: "Green peppers, corn, red bean paste, taking things seriously in chat, rushing, following plans, spoilers, horror, FPS games (motion sickness)",
      achievements: [
        "2023/10/31 First short video posted",
        "2024/1/19 First stream (Gen 2 debut; first audition winner)",
        "Multiple viral hits on X (over 100K likes on a sub-account)",
        "2026/5/9 Video appearance in 1st 3D live \"Million Story\""
      ],
      catchphrase: "Kneel, you lot! I am Akubi Demonspade-sama!"
    }
  },
  {
    id: "koma",
    gen: "3期生",
    name: "小廻こま",
    nameEn: "Komawari Koma",
    color: "#d09559",
    subColor: "#fff0dd",
    birthday: "08-01",
    debut: "2025-03-22",
    catch: "みんなの一コマ、こまにちょーだい！",
    fanName: "こまめいと",
    fanMark: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="#d09559"><path d="M2.2 13.2l19.6-.2L20.3 11H3.7z"/><rect x="3.4" y="10.6" width="17.2" height="1.6" rx=".5"/><rect x="4.6" y="4.6" width="14.8" height="2.1" rx=".6"/><rect x="6.8" y="12.4" width="1.7" height="6.4" rx=".4"/><rect x="15.5" y="12.4" width="1.7" height="6.4" rx=".4"/><rect x="6.7" y="18.4" width="10.6" height="1.1" rx=".3"/></g></svg>',
    calls: "こま / 小廻",
    profile: "あそび大好きな巫女風VTuber。身長148cm、MBTI: ESFJ-T。とにかく声がでかい（コンプレッサー込みでも10%で音割れ）。社会人経験のある常識人・苦労人で、普段は人見知りだが歌うと変わる。",
    skills: "いろんな声と大声を出すこと、歌（歌い始めると圧巻）",
    phrases: ["みんなの一コマ、こまにちょーだい！", "こまの芸をとくとご覧あれ！"],
    likes: "お酒（酒豪・ラッパ飲みの理由は「洗い物がめんどくさいから」）、果物、卵料理、ohayo乳業のブリュレアイス、歌う、動画編集",
    dislikes: "生クリーム、きのこ、カレーのにんじん、バター、豆、球技、この世のすべての虫、だるい・めんどくさいと言われること",
    achievements: [
      "2024/12/15 活動開始（ミリちゃんのスカウトで加入）",
      "2025/3/22 初配信（3期生デビュー）",
      "2025/10 「MadTownGTA」で話題に。当月の登録者増加ランキング全VTuber中1位",
      "最高同接8000超「0.7釈迦」の異名",
      "ユニット: ゆまの酒盛り（ゆらぎゆら）・こまつくりーず（雨夜リズ・眠雲ツクリ）"
    ],
    tags: { stream: "こまにお立合い", clip: "こま斬り", art: "こまのえま" },
    links: { yt: "https://www.youtube.com/@komawarikoma", x: "https://x.com/komawarikoma", tiktok: "https://www.tiktok.com/@komawarikoma" },
    img: "images/talents/koma.webp",
    logo: "images/rogo/komarogo.webp",
    icon: "images/icon/koma_profile.jpg",
    catchphrase: "みんなの一コマ、こまにちょーだい！",
    introVoice: "",
    fx: "koma",
    deco: {
      label: "hex",
      floats: [
        { k: "hex", x: 9, y: 15, size: 58, dur: 13 },
        { k: "hex", x: 88, y: 12, size: 54, dur: 15 },
        { k: "top", x: 12, y: 78, size: 44, dur: 13 },
        { k: "top", x: 82, y: 82, size: 52, dur: 12 }
      ]
    },
    featuredVideos: ["EoCUHLE9GTc", "ssvo2Umq0sc", "1UdnoJ6qgPs"],
    voice: "assets/voices/小廻こま.mp3",
    intro: "",
    en: {
      gen: "Gen 3",
      catch: "Gimme your frame of fun, Koma!",
      fanName: "Komamate",
      calls: "Koma / Komawari",
      profile: "A play-loving shrine maiden-style VTuber. 148 cm tall, MBTI: ESFJ-T. Her voice is incredibly loud (it clips even at 10% with a compressor). A sensible, hardworking former working adult; shy at first, but transforms when she sings.",
      skills: "Making various voices and being loud, singing (spectacular once she starts)",
      phrases: ["Gimme your frame of fun, Koma!", "Behold Koma's art!"],
      likes: "Alcohol (a heavy drinker; she drinks straight from the bottle because \"washing dishes is a hassle\"), fruit, egg dishes, ohayo dairy crème brûlée ice cream, singing, video editing",
      dislikes: "Fresh cream, mushrooms, carrots in curry, butter, beans, ball sports, every bug in the world, being called \"lazy and whiny\"",
      achievements: [
        "2024/12/15 Started activities (scouted by Mil-chan)",
        "2025/3/22 First stream (Gen 3 debut)",
        "2025/10 Went viral in \"MadTownGTA\"; #1 among all VTubers in monthly subscriber growth",
        "Earned the nickname \"0.7 Shaka\" with 8,000+ peak concurrent viewers",
        "Units: Yuma's Drinking Party (with Yuragi Yura), Komatsuri-zu (with Amayo Liz & Nemukumo Tsukuri)"
      ],
      catchphrase: "Gimme your frame of fun, Koma!"
    }
  },
  {
    id: "raco",
    gen: "ミリプロNOVA",
    name: "音ノ瀬らこ",
    nameEn: "Otonose Raco",
    color: "#cba60b",
    subColor: "#fdf3cf",
    birthday: "04-08",
    debut: "2024-06-08",
    catch: "君に元気をおすそ分け！ DJラッコ",
    fanName: "らっ子",
    fanMark: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="#cba60b"><ellipse cx="12" cy="14.4" rx="6" ry="5.2"/><circle cx="8" cy="10.6" r="1.7"/><circle cx="16" cy="10.6" r="1.7"/><path d="M10.8 13.2h2.4l-.5 1.9h-1.4z" fill="#fdf3cf"/></g><g fill="none" stroke="#cba60b" stroke-width="1.1" stroke-linecap="round"><path d="M4.6 15.2h3M16.4 15.2h3M4.8 12l2.9.7M19.2 12l-2.9.7"/></g></svg>',
    calls: "らこち / らこちゃん",
    profile: "DJラッコVTuber。身長151cm（アホ毛込み）、年齢20ピー歳、MBTI: ESTP-T。キャラデザ・イラストは本人（セルフデザイン）、Live2Dは甘狼このみ。ミリプロタレントかつかなりのミリプロオタク。よく5歳児・小学生とイジられる。",
    skills: "歌（高音が綺麗、超高音でもがなりを効かせられる）、お絵描き",
    phrases: ["お腹空いた～", "はくばのおうじさま（白長須鯨の読み間違い）"],
    likes: "チョコミントアイス、クッキー＆クリーム、たらこパスタ、からあげ、カルボナーラ、歌うこと、ボカロ、ミリプロ、動物を見ること",
    dislikes: "フルーツ全般・トマト・ナス、早起き、虫、機械、マルチタスク、急かされること",
    achievements: [
      "2023/12/13 short動画投稿で活動開始（研究生）",
      "2024/3 ゆらぎゆらと共に正式加入（登録者2万人達成）",
      "2024/6/8 初配信",
      "2026/6/8 2周年に1st Single「ルミナス」をMillion RECORDSからリリース"
    ],
    tags: { stream: "らこといっしょ", clip: "らこの貝殻", art: "らこあーと" },
    links: { yt: "https://www.youtube.com/@OtonoseRaco", x: "https://x.com/OtonoseRaco", tiktok: "" },
    img: "images/talents/rako.webp",
    logo: "images/rogo/rakorogo.webp",
    icon: "images/icon/rako_profile.jpg",
    catchphrase: "君に元気をおすそ分け！",
    introVoice: "",
    fx: "sea",
    deco: {
      label: "shell",
      floats: [
        { k: "shell", x: 8, y: 14, size: 64, dur: 13 },
        { k: "shell", x: 88, y: 10, size: 56, dur: 15 },
        { k: "shell", x: 12, y: 76, size: 44, dur: 12 },
        { k: "wave", x: 80, y: 84, size: 58, dur: 12 }
      ]
    },
    featuredVideos: ["IAwrziSiqVI", "MklYo2c3QmM", "GgIbQ5mHAQk"],
    voice: "assets/voices/音ノ瀬らこ.mp3",
    intro: "",
    en: {
      gen: "MilliPro NOVA",
      catch: "Sharing my energy with you! DJ Otter",
      fanName: "Rakko",
      calls: "Rakochi / Rako-chan",
      profile: "A DJ otter VTuber. 151 cm tall (including her ahoge), 20-pee years old, MBTI: ESTP-T. Character design and illustrations are by herself (self-designed); Live2D by Amakami Konomi. A MilliPro talent and quite the MilliPro otaku. Often teased for acting like a 5-year-old / elementary schooler.",
      skills: "Singing (beautiful high notes; can add grit even at extremely high pitches), drawing",
      phrases: ["I'm hungry~", "Hakuba no oujisama (misreading of \"fin whale\")"],
      likes: "Chocomint ice cream, cookies & cream, tarako pasta, karaage, carbonara, singing, Vocaloid, MilliPro, watching animals",
      dislikes: "Fruit in general, tomatoes, eggplant, waking up early, bugs, machines, multitasking, being rushed",
      achievements: [
        "2023/12/13 Started with short videos (as a trainee)",
        "2024/3 Officially joined with Yuragi Yura (reached 20K subscribers)",
        "2024/6/8 First stream",
        "2026/6/8 Released 1st Single \"Luminous\" on her 2nd anniversary via Million RECORDS"
      ],
      catchphrase: "Sharing my energy with you!"
    }
  },
  {
    id: "yura",
    gen: "ミリプロNOVA",
    name: "ゆらぎゆら",
    nameEn: "Yuragi Yura",
    color: "#7f96bf",
    subColor: "#e7effb",
    birthday: "11-03",
    debut: "2024-06-09",
    catch: "あなたに安らぎを届けたい。ミズクラゲ",
    fanName: "ゆらふぃら",
    fanMark: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="#7f96bf"><path d="M14.9 3.1a8.5 8.5 0 1 0 6.6 9.2 6.9 6.9 0 0 1-6.6-9.2z"/><circle cx="5.2" cy="17.8" r="1.8"/><circle cx="9.4" cy="21.2" r="1.1"/><circle cx="19.8" cy="15.8" r="1.4"/></g></svg>',
    calls: "ゆらち / ゆらねぇ",
    profile: "ミズクラゲVTuber。沖縄出身、身長155cm、MBTI: ENFP-A。ミリプロのせくすぃー担当＆お姉様枠（かつては清楚枠）。配信頻度はミリプロ内随一でゲーム配信多め。バンド経験あり（ベース・ボーカル）。",
    skills: "歌（バラード得意）、絵（男性を描くのが得意）、ASMR",
    phrases: ["せくすぃー", "3時間は1時間", "腐女子は誰だって心にタマ飼ってんだよ"],
    likes: "お酒（特に梅酒）、マカロン、たまごボーロ、タコス、ハンバーガー、絵を描くこと、歌、配信、推し活",
    dislikes: "辛いもの・辛いお酒、ホラーゲーム、甘えること、虫",
    achievements: [
      "2023/12/23 short投稿で活動開始（研究生）",
      "2024/3 音ノ瀬らこと共に正式加入",
      "2024/6/9 初配信",
      "「せくすぃー」がミリプロ流行語大賞2025に選出",
      "ユニット: ゆまの酒盛り（小廻こま）・ゆららこ（音ノ瀬らこ）"
    ],
    tags: { stream: "ゆらのやすらぎ", clip: "ゆらあつめ", art: "ゆらぎあーと" },
    links: { yt: "https://www.youtube.com/@_YuraYuragi", x: "https://x.com/_YuraYuragi", tiktok: "" },
    img: "images/talents/yura.webp",
    logo: "images/rogo/yurarogo.webp",
    icon: "images/icon/yura_profile.jpg",
    catchphrase: "あなたに安らぎを届けたい",
    introVoice: "",
    fx: "deep",
    deco: {
      label: "bub",
      shape: "bub",
      floats: [
        { k: "jelly", x: 88, y: 12, size: 72, dur: 14 },
        { k: "bub", x: 8, y: 18, size: 56, dur: 13 },
        { k: "bub", x: 15, y: 80, size: 40, dur: 12 },
        { k: "bub", x: 78, y: 78, size: 48, dur: 16 }
      ]
    },
    featuredVideos: ["zkyfZ9Zg2bQ", "73hzg0X6jWk", "LqdUhTK2sCY"],
    voice: "assets/voices/ゆらぎゆら.mp3",
    intro: "",
    en: {
      gen: "MilliPro NOVA",
      catch: "I want to bring you peace of mind. A moon jellyfish",
      fanName: "Yurafira",
      calls: "Yurachi / Yura-nee",
      profile: "A moon jellyfish VTuber. From Okinawa, 155 cm tall, MBTI: ENFP-A. MilliPro's \"sexy\" specialist and big-sister slot (formerly the \"pure & innocent\" slot). Streams more frequently than anyone else in MilliPro, mostly games. Has band experience (bass & vocals).",
      skills: "Singing (great at ballads), drawing (great at drawing men), ASMR",
      phrases: ["Sexy", "3 hours is 1 hour", "Every fujoshi has a tama in her heart"],
      likes: "Alcohol (especially umeshu), macarons, tamago boro, tacos, hamburgers, drawing, singing, streaming, oshi activities",
      dislikes: "Spicy food and spicy drinks, horror games, being spoiled, bugs",
      achievements: [
        "2023/12/23 Started with shorts (as a trainee)",
        "2024/3 Officially joined with Otonose Raco",
        "2024/6/9 First stream",
        "\"Sexy\" chosen for the MilliPro Buzzword of the Year 2025",
        "Units: Yuma's Drinking Party (with Komawari Koma), Yurara-ko (with Otonose Raco)"
      ],
      catchphrase: "I want to bring you peace of mind"
    }
  },
  {
    id: "nuhu",
    gen: "ミリプロNOVA",
    name: "虹深°ぬふ",
    nameEn: "Nijipuka Nuhu",
    color: "#c6989a",
    subColor: "#fdecec",
    birthday: "11-30",
    debut: "2025-08-08",
    catch: "ぬふのごはんは褒めことば！",
    fanName: "ぷかぬファミリー",
    fanMark: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="#c6989a"><rect x="10.4" y="14.4" width="3.2" height="6.2" rx="1"/><path d="M10.4 18.4L12 21.6l1.6-3.2z"/></g><g fill="none" stroke="#c6989a" stroke-width="1.8" stroke-linecap="round"><path d="M6.2 13.2a5.8 5.8 0 0 1 11.6 0"/><path d="M3.8 13.2a8.2 8.2 0 0 1 16.4 0"/></g></svg>',
    calls: "ぬふ / ぬふちゃん / ぬふち",
    profile: "めんだこ×人間のハーフのイラストレーターVTuber。福岡出身、身長150cm、年齢（永遠の）17歳。完全セルフ受肉（イラスト・Live2Dとも本人、Live2Dは独学）。表情によって髪色が変わる。部屋の汚さはミリプロ内ぶっちぎり。",
    skills: "イラスト・アニメーション（ティザーPVも自作）。衣装制作も担当",
    phrases: ["オ↑レ↓", "ｴｰﾔｯﾀ‐、ｳﾚｼｰ", "体が清潔じゃなくても心は清楚だから"],
    likes: "ハンバーグ、動画編集（アニメーション）、イラスト制作、ご飯を食べること、褒められること",
    dislikes: "トマト、片付け、お風呂、勉強",
    achievements: [
      "個人勢イラストレーターとして活動",
      "設立当初の誘いを一度断るも自ら加入を熱望",
      "2025/7 ミリプロNOVA加入発表、8/8初配信",
      "NEWTOWN（GTA配信）で「アトリエぬふ」をオープンし話題に",
      "登録者30万人記念グッズ発売"
    ],
    tags: { stream: "ぬふライブ", clip: "にじぷかぬふ", art: "にじぷかーと" },
    links: { yt: "https://www.youtube.com/@NijipukaNuhu", x: "https://x.com/nijipukanuhu", tiktok: "" },
    img: "images/talents/nuhu.webp",
    logo: "images/rogo/nuhurogo.webp",
    icon: "images/icon/nuhu_profile.jpg",
    catchphrase: "ぬふのごはんは褒めことば！",
    introVoice: "",
    fx: "paint",
    deco: {
      label: "pen",
      shape: "wheel",
      floats: [
        { k: "pen", x: 9, y: 16, size: 58, dur: 13 },
        { k: "pen", x: 86, y: 14, size: 54, dur: 14 },
        { k: "pen", x: 14, y: 76, size: 44, dur: 13 },
        { k: "rainbow", x: 80, y: 86, size: 56, dur: 13 }
      ]
    },
    featuredVideos: ["FJO8obFEvIw", "9yClH5ihXXU", "7klVnwL9gH4"],
    voice: "assets/voices/虹深°ぬふ.mp3",
    intro: "",
    en: {
      gen: "MilliPro NOVA",
      catch: "Nuhu's food is praise words!",
      fanName: "Pukanu Family",
      calls: "Nuhu / Nuhu-chan / Nuhuchi",
      profile: "An illustrator VTuber who is half octopus-dog, half human. From Fukuoka, 150 cm tall, forever 17 years old. Fully self-made (both illustration and Live2D, with Live2D self-taught). Her hair color changes with her mood. Her room is the messiest in MilliPro by far.",
      skills: "Illustration & animation (she even makes her own teaser PVs). Also handles costume production",
      phrases: ["O↑RE↓", "Yatta-, Ureshii-", "My body may be dirty, but my heart is pure"],
      likes: "Hamburg steaks, video editing (animation), illustration, eating, being praised",
      dislikes: "Tomatoes, cleaning up, baths, studying",
      achievements: [
        "Active as an indie illustrator",
        "Declined the initial offer once, then desperately wanted to join",
        "2025/7 MilliPro NOVA joining announcement; first stream on 8/8",
        "Opened \"Atelier Nuhu\" in NEWTOWN (GTA streams) and went viral",
        "300K subscriber commemorative goods released"
      ],
      catchphrase: "Nuhu's food is praise words!"
    }
  },
  {
    id: "tsukuri",
    gen: "ミリプロUNI",
    name: "眠雲ツクリ",
    nameEn: "Nemukumo Tsukuri",
    color: "#a8a6ab",
    subColor: "#f0eff6",
    birthday: "09-03",
    debut: "2025-05-17",
    catch: "君との思い出つくってあげる。",
    fanName: "つくらうど",
    fanMark: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="#a8a6ab"><path d="M7.2 17.6a4.2 4.2 0 0 1-.8-8.3 5.4 5.4 0 0 1 10.4.4c1.5.3 2.5 1.6 2.5 3.2 0 1.9-1.4 3.4-3.3 3.5-.9 1.2-2.4 1.9-4 1.9-1.2 0-2.4-.3-3.3-1z"/><path d="M17.2 14.8l-3.6-3.6 1.2-1.1a3.2 3.2 0 0 0-3.7-4.7c.5 1 .4 2-.4 2.9l-5.2 5.2a1.1 1.1 0 0 0 1.5 1.5l3.4-3.4 3.6 3.6a1.1 1.1 0 0 0 1.5-1.5z"/></g></svg>',
    calls: "ツクリ / 眠ちゃん",
    profile: "マルチクリエイティブVTuber。身長160cm（厚底なし156cm）、MBTI: INTP。作曲・作詞・歌唱・MIX・動画編集・イラスト・デザインを全てこなす。真面目で落ち着いたツッコミ役。バンド経験あり。illustrator: りいちゅ / Live2D: 猫科純。",
    skills: "作曲・作詞・歌唱・MIX・動画編集・イラスト・デザイン。料理も得意",
    phrases: ["フ↑フ↓", "マジでツクるぞ？"],
    likes: "冷やし中華、チーズ、ミルクティー、油そば、マカロン、歌、ホラゲー、長時間睡眠",
    dislikes: "刺激物・辛いもの、梅、大根、大葉、水泳、ダンス",
    achievements: [
      "2025/5/17 初配信（雨夜リズと共にミリプロUNIとしてデビュー）",
      "ミリプロ抜き打ちテスト2位（唯二の留年回避者）",
      "ミリプロタレントのモノマネが得意",
      "ユニット: こまつくりーず（小廻こま・雨夜リズ）"
    ],
    tags: { stream: "ツクリーム", clip: "ツクリップ", art: "ツクリーンショット" },
    links: { yt: "https://www.youtube.com/@NemukumoTsukuri", x: "https://x.com/nemukumotsukuri", tiktok: "" },
    img: "images/talents/tukuri.webp",
    logo: "images/rogo/tukurirogo.webp",
    icon: "images/icon/tukuri_profile.jpg",
    catchphrase: "君との思い出つくってあげる",
    introVoice: "",
    fx: "sleep",
    deco: {
      label: "cloud",
      shape: "zzz",
      floats: [
        { k: "cloud", x: 88, y: 12, size: 76, dur: 14 },
        { k: "cloud", x: 10, y: 70, size: 56, dur: 15 },
        { k: "cloud", x: 78, y: 80, size: 46, dur: 13 }
      ]
    },
    featuredVideos: ["2UHLDOqb194", "UHf4Szx02iM", "Hs-gxOofX1s"],
    voice: "assets/voices/眠雲ツクリ.mp3",
    intro: "",
    en: {
      gen: "MilliPro UNI",
      catch: "I'll make memories with you.",
      fanName: "Tsukuloud",
      calls: "Tsukuri / Nemuchan",
      profile: "A multi-creative VTuber. 160 cm tall (156 cm without platforms), MBTI: INTP. Handles composing, writing lyrics, singing, mixing, video editing, illustration, and design all by herself. A serious, calm straight-man. Has band experience. Illustrator: Riichu / Live2D: Nekoka Jun.",
      skills: "Composing, songwriting, singing, mixing, video editing, illustration, design. Also a good cook",
      phrases: ["Fuu↑fuu↓", "I'll seriously make it, okay?"],
      likes: "Hiyashi chuka, cheese, milk tea, abura soba, macarons, singing, horror games, long sleeps",
      dislikes: "Stimulants and spicy food, ume plums, daikon radish, perilla, swimming, dancing",
      achievements: [
        "2025/5/17 First stream (debuted as MilliPro UNI with Amayo Liz)",
        "2nd place in the MilliPro surprise test (one of only two who avoided repeating a year)",
        "Great at impersonating MilliPro talents",
        "Unit: Komatsuri-zu (with Komawari Koma & Amayo Liz)"
      ],
      catchphrase: "I'll make memories with you"
    }
  },
  {
    id: "liz",
    gen: "ミリプロUNI",
    name: "雨夜リズ",
    nameEn: "Amayo Liz",
    color: "#617a7a",
    subColor: "#e4eeec",
    birthday: "03-19",
    debut: "2025-05-18",
    catch: "迷い込んで、雨宿り。雨女VTuber",
    fanName: "リズナイト",
    fanMark: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="none" stroke="#617a7a" stroke-width="1.9" stroke-linecap="round"><path d="M3.4 12.6a8.6 8.6 0 0 1 17.2 0z"/><path d="M12 12.8v6.2a2 2 0 0 0 4 0"/><path d="M12 3.6v1.4"/></g></svg>',
    calls: "リズ / 雨夜さん / まよちゃん",
    profile: "雨女VTuber。身長161cm、MBTI: INFP-T。「ミリプロの清楚かつロリ枠」を自称するが、PON（やらかし）が多いのが名物。自炊派で料理上手。相棒はかえるの「けろまる」（けろまるの片思い）。illustrator: りいちゅ / Live2D: 猫科純。",
    skills: "歌うこと、絵を描くこと、料理、モノマネ",
    phrases: ["やらかしの女王"],
    likes: "スイーツ全般、味の薄いもの、K-POP、歌い手、ボカロ",
    dislikes: "マルチタスク、早食い（食べ物の苦手はほぼなし）",
    achievements: [
      "2025/5/18 初配信（眠雲ツクリと共にミリプロUNIとしてデビュー）",
      "「ミリプロの清楚かつロリ枠」を自称",
      "PON伝説多数（炊飯器の米1週間放置・社用Discord晒し・アーカイブ2時間→45秒 等）",
      "ユニット: こまつくりーず（小廻こま・眠雲ツクリ）"
    ],
    tags: { stream: "リズと雨宿り", clip: "切り取リズ", art: "てるてるぼう図" },
    links: { yt: "https://www.youtube.com/@Amayo_liz", x: "https://x.com/amayoliz_", tiktok: "" },
    img: "images/talents/rizu.webp",
    logo: "images/rogo/rizurogo.webp",
    icon: "images/icon/rizu_profile.jpg",
    catchphrase: "迷い込んで、雨宿り。",
    introVoice: "",
    fx: "rain",
    deco: {
      label: "drop",
      shape: "rain",
      floats: [
        { k: "drop", x: 8, y: 14, size: 54, dur: 13 },
        { k: "drop", x: 86, y: 10, size: 64, dur: 15 },
        { k: "drop", x: 14, y: 78, size: 42, dur: 13 }
      ]
    },
    featuredVideos: ["IS6J88gLpAw", "gA2vNb2wDOo", "g5dmsdj-btY"],
    voice: "assets/voices/雨夜リズ.mp3",
    intro: "",
    en: {
      gen: "MilliPro UNI",
      catch: "Wander in and take shelter from the rain. A rain-bringer VTuber",
      fanName: "Lizknights",
      calls: "Liz / Amayo-san / Mayo-chan",
      profile: "A rain-bringer VTuber. 161 cm tall, MBTI: INFP-T. Calls herself \"MilliPro's pure & loli slot\", but is famous for messing up (PON) a lot. She cooks for herself and is good at it. Her partner is a frog named \"Keromaru\" (Keromaru's love for her is one-sided). Illustrator: Riichu / Live2D: Nekoka Jun.",
      skills: "Singing, drawing, cooking, impersonations",
      phrases: ["Queen of mess-ups"],
      likes: "All kinds of sweets, mild flavors, K-POP, utaite, Vocaloid",
      dislikes: "Multitasking, eating fast (she has almost no food dislikes)",
      achievements: [
        "2025/5/18 First stream (debuted as MilliPro UNI with Nemukumo Tsukuri)",
        "Calls herself \"MilliPro's pure & loli slot\"",
        "Legendary PON moments (left rice in the rice cooker for a week, leaked the work Discord, turned a 2-hour archive into 45 seconds, etc.)",
        "Unit: Komatsuri-zu (with Komawari Koma & Nemukumo Tsukuri)"
      ],
      catchphrase: "Wander in and take shelter from the rain."
    }
  },
  {
    id: "rei",
    gen: "ミリプロUNI",
    name: "夕霧レイ",
    nameEn: "Yugiri Ray",
    color: "#7e97b1",
    subColor: "#e8f0fa",
    birthday: "01-30",
    debut: "2026-07-11",
    catch: "霧に紛れて、作戦開始。霧のスナイパー",
    fanName: "オペレイター",
    fanMark: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="#7e97b1"><circle cx="8.4" cy="12" r="4.1"/><circle cx="15.6" cy="12" r="4.1"/><rect x="9.2" y="10.4" width="5.6" height="3.2" rx="1.6"/></g><g fill="none" stroke="#7e97b1" stroke-width="1.7" stroke-linecap="round"><path d="M4.3 11.4l-.6-1.7a2.6 2.6 0 0 1 2.7-3.3"/><path d="M19.7 11.4l.6-1.7a2.6 2.6 0 0 0-2.7-3.3"/></g><g fill="#fff" opacity=".8"><circle cx="6.7" cy="10.4" r="1.1"/><circle cx="13.9" cy="10.6" r="1.1"/></g></svg>',
    calls: "レイちゃん / レイぴょん（好きに呼んでOK）",
    profile: "「霧のスナイパー」VTuber。身長155cm、MBTI: INFP。元伝説のスナイパーで、世の中のものは大体撃ち抜いたので今度は人間の心を撃ち抜きに来た。2026年7月11日デビューの新人。illustrator: 巻羊 / Live2D: rariemonn。",
    skills: "ごはんとおかずをぴったり同時に食べ切ること",
    phrases: ["ターゲット、ロックオン"],
    likes: "お寿司、辛い食べ物、マック、邦ロック、アイドルソング、洋楽、ボカロ、VALORANT、マイクラ、APEX、ポケモン",
    dislikes: "朝（毎日5度寝くらい）、虫、夏、ラ行（発音ネタ）",
    achievements: [
      "2026/5/3 X初投稿",
      "2026/5/9 「Million Story」でティザーPV公開",
      "2026/7/11 初配信（配信前に登録者6万人、当日7万人突破）",
      "初配信同日に「怪獣の花唄/Vaundy」カバー公開"
    ],
    tags: { stream: "レイ作戦中", clip: "切り取レイ", art: "描いてくレイ" },
    links: { yt: "https://www.youtube.com/@yugiriray", x: "https://x.com/YugiriRay", tiktok: "" },
    img: "images/talents/rei.webp",
    logo: "images/rogo/reirogo.webp",
    icon: "images/icon/rei_profile.jpg",
    catchphrase: "霧に紛れて、作戦開始",
    introVoice: "",
    fx: "lockon",
    deco: {
      label: "ring",
      shape: "cross",
      floats: [
        { k: "ring", x: 9, y: 15, size: 64, dur: 13 },
        { k: "ring", x: 86, y: 12, size: 56, dur: 15 },
        { k: "ring", x: 12, y: 78, size: 44, dur: 13 }
      ]
    },
    featuredVideos: ["pb4bJ6x8oSg", "rvXcbRifIYM", "cphW85uNiuI"],
    voice: "assets/voices/夕霧レイ.mp3",
    intro: "",
    en: {
      gen: "MilliPro UNI",
      catch: "Mist in, mission start. The Sniper of the Mist",
      fanName: "Operator",
      calls: "Ray-chan / Ray-pon (call me whatever you like)",
      profile: "The \"Sniper of the Mist\" VTuber. 155 cm tall, MBTI: INFP. A legendary former sniper who has shot just about everything in the world, so now she's come to shoot people's hearts. A newcomer who debuted on July 11, 2026. Illustrator: Makihitsuji / Live2D: Rariemonn.",
      skills: "Finishing rice and side dishes at exactly the same moment",
      phrases: ["Target, locked on"],
      likes: "Sushi, spicy food, McDonald's, Japanese rock, idol songs, Western music, Vocaloid, VALORANT, Minecraft, Apex, Pokémon",
      dislikes: "Mornings (about 5 more sleeps a day), bugs, summer, the \"ra\" sound (a pronunciation gag)",
      achievements: [
        "2026/5/3 First X post",
        "2026/5/9 Teaser PV shown at \"Million Story\"",
        "2026/7/11 First stream (60K subs before the stream; broke 70K that day)",
        "Released a \"Kaijuu no Hanauta / Vaundy\" cover on her debut day"
      ],
      catchphrase: "Mist in, mission start"
    }
  },
  {
    id: "mahoro",
    gen: "ミリプロSONA",
    name: "鹿乃まほろ",
    nameEn: "Kano Mahoro",
    color: "#EF454A",
    subColor: "#fde8ec",
    birthday: "12-24",
    debut: "2026-08-22",
    catch: "みんなの毎日を、まほろばに！ Virtual Artist 鹿乃まほろ",
    fanName: "鹿友",
    fanMark: "🍓🦌",
    calls: "まほろちゃん",
    profile: "Virtual Artist。2010年にニコニコ動画で歌い手として活動を開始し、2015年にメジャーデビュー。2022年から音楽ユニットMKLNticのメンバーとしても活動。2026年7月にインクストゥエンターを退所し、同年8月にミリプロSONAへ加入。身長150cm。",
    skills: "作詞作曲・歌唱・ギター",
    phrases: ["みんなの毎日を、まほろばに！", "聞こえない音が聞こえる（人の話は聞こえない）"],
    likes: "歌うこと、ギター、癒しの魔法（配信でお届け中）",
    dislikes: "—",
    achievements: [
      "2010年 ニコニコ動画で歌い手として活動開始",
      "2015年 メジャーデビュー",
      "2022年 音楽ユニットMKLNtic メンバーとして活動開始",
      "2026年7月 インクストゥエンター退所",
      "2026年8月16日 ミリプロSONA加入発表",
      "2026年8月22日 初配信（20:00〜・YouTube @Kano_）"
    ],
    tags: { stream: "#まほろたいむ", clip: "#まほろくりっぷ", art: "#まほろしか描かん" },
    links: { yt: "https://www.youtube.com/@Kano_", x: "https://x.com/kano_2525", tiktok: "" },
    img: "images/talents/mahoro.webp",
    logo: "images/rogo/mahororogo.png",
    icon: "images/icon/mahoro_profile.jpg",
    catchphrase: "みんなの毎日を、まほろばに！",
    introVoice: "",
    featuredVideos: ["YzfwW0zTSpE", "aH1DIRyDnfc", "94xJrn4Kswk"],
    voice: "assets/voices/鹿乃まほろ.mp3",
    intro: "みんなの心に癒しの魔法を！",
    en: {
      gen: "MilliPro SONA",
      catch: "Making your every day a mahoroba! Virtual Artist Kano Mahoro",
      fanName: "Shikayu",
      calls: "Mahoro-chan",
      profile: "Virtual Artist. Started as an utaite on Nico Nico Douga in 2010, major debut in 2015. Member of the music unit MKLNtic since 2022. Left Inkst Entertainment in July 2026 and joined MilliPro SONA in August. Height: 150cm.",
      skills: "Songwriting, singing, guitar",
      phrases: ["Making your every day a mahoroba!", "I can hear inaudible sounds (but not people's talk)"],
      likes: "Singing, guitar, healing magic",
      dislikes: "—",
      achievements: [
        "2010 Started as an utaite on Nico Nico Douga",
        "2015 Major debut",
        "2022 Joined music unit MKLNtic",
        "July 2026 Left Inkst Entertainment",
        "Aug 16, 2026 Announced joining MilliPro SONA",
        "Aug 22, 2026 Debut stream (8PM JST @Kano_)"
      ],
      catchphrase: "Making everyone's everyday a mahoroba!"
    },
    deco: {
      label: "ichigo",
      shape: "straw",
      floats: [
        { k: "ribbon", x: 8, y: 14, size: 56, dur: 15 },
        { k: "ichigo", x: 88, y: 10, size: 68, dur: 13 },
        { k: "antler", x: 13, y: 74, size: 52, dur: 14 },
        { k: "note", x: 82, y: 84, size: 48, dur: 12 },
        { k: "ichigo", x: 76, y: 42, size: 38, dur: 16 },
        { k: "heart", x: 26, y: 38, size: 32, dur: 15 }
      ]
    },
    fx: "straw"
  },
  {
    id: "aoi",
    gen: "ミリプロNOVA",
    name: "海琳あおい",
    nameEn: "Mitama Aoi",
    color: "#7BC043",
    subColor: "#eaf6dc",
    birthday: "",
    debut: "",
    catch: "ミリプロNOVAに加入決定！デビュー準備中",
    fanName: "",
    fanMark: "🐢🌱",
    calls: "",
    profile: "ミリプロNOVA所属。2026年9月12日に加入発表。デビュー前のため詳細は準備中。",
    skills: "準備中",
    phrases: [],
    likes: "",
    dislikes: "",
    achievements: [
      "2026/9/12 ミリプロNOVA加入発表（公式X @Mil_Pro_）"
    ],
    tags: { stream: "", clip: "", art: "" },
    links: { yt: "https://www.youtube.com/@MitamaAoi", x: "https://x.com/MitamaAoi", tiktok: "" },
    img: "images/talents/aoi.webp",
    // TODO(aoi-logo): 現行logoは告知画像からの仮切り抜き。公式ロゴ素材が出たら差し替え (2026-09-16)
    logo: "images/rogo/aoirogo.webp",
    icon: "images/icon/aoi_profile.jpg",
    catchphrase: "",
    introVoice: "",
    introDelay: 6.5,
    fx: "aoi",
    deco: {
      label: "turtle",
      floats: [
        { k: "turtle", x: 8, y: 14, size: 64, dur: 13 },
        { k: "seaweed", x: 88, y: 10, size: 58, dur: 12 },
        { k: "seaweed", x: 12, y: 76, size: 48, dur: 14 },
        { k: "turtle", x: 82, y: 82, size: 44, dur: 15 }
      ]
    },
    featuredVideos: [],
    voice: "",
    intro: "",
    en: {
      gen: "MilliPro NOVA",
      catch: "Joined MilliPro NOVA! Debut coming soon",
      fanName: "",
      calls: "",
      profile: "Member of MilliPro NOVA. Announced on Sep 12, 2026. Details TBA (pre-debut).",
      skills: "TBA",
      phrases: [],
      likes: "",
      dislikes: "",
      achievements: [
        "Sep 12, 2026 Announced joining MilliPro NOVA (official X @Mil_Pro_)"
      ],
      catchphrase: ""
    }
  },
  {
    id: "milchan",
    gen: "事務所スタッフ・マスコット",
    name: "ミリちゃん",
    nameEn: "Mil-chan",
    color: "#74a5ae",
    subColor: "#e6f4f7",
    birthday: "",
    debut: "2023-04-01",
    catch: "謎のアザラシ。ミリプロ創設者＆マスコット",
    fanName: "",
    fanMark: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="#74a5ae"><ellipse cx="12" cy="14.6" rx="6.4" ry="5.2"/><circle cx="8.4" cy="10.8" r="1.6"/><circle cx="15.6" cy="10.8" r="1.6"/><path d="M10.8 13.6h2.4l-.5 1.8h-1.4z" fill="#e6f4f7"/></g><g fill="none" stroke="#74a5ae" stroke-width="1.1" stroke-linecap="round"><path d="M5 16.2h3M16 16.2h3"/></g></svg>',
    calls: "ミリちゃん",
    profile: "謎のアザラシ。ミリプロの創設者＆マスコットキャラクター。タレントではなくスタッフで、公式チャンネル（@Mil_Pro）や全体企画に登場。ミリプロのスカウト役としても有名（音ノ乃のの・小廻こまをスカウトした）。",
    skills: "スカウト・事務所の顔",
    phrases: [],
    likes: "",
    dislikes: "",
    achievements: [
      "2023/4/1 ミリプロ設立と同時に活動開始",
      "音ノ乃のの・小廻こまをスカウト"
    ],
    tags: { stream: "", clip: "", art: "" },
    links: { yt: "https://www.youtube.com/@Mil_Pro", x: "https://x.com/Mil_Staff_", tiktok: "" },
    img: "images/talents/milli%20chan.JPEG",
    icon: "images/icon/milli%20chan_profile.JPEG",
    catchphrase: "進捗どうですか？",
    introVoice: "",
    featuredVideos: ["hMl1U4Mu3kg", "7exy16BEnHY", "g5Y9wMxEwKw"],
    voice: "",
    intro: "",
    en: {
      gen: "Office Staff / Mascot",
      catch: "A mysterious seal. MilliPro's founder & mascot",
      calls: "Mil-chan",
      profile: "A mysterious seal. Founder & mascot character of MilliPro. She is staff rather than a talent, appearing on the official channel (@Mil_Pro) and group projects. Also famous as MilliPro's scout (she scouted Nono Nono and Komawari Koma).",
      skills: "Scouting, being the face of the office",
      phrases: [],
      likes: "",
      dislikes: "",
      achievements: [
        "2023/4/1 Started activities at the same time as MilliPro's founding",
        "Scouted Nono Nono and Komawari Koma"
      ],
      catchphrase: "How's the progress?"
    }
  }
];

/* グループアイコン（images/icon/group/）。所属グループごとに表示される */

const GROUP_ICON = {
  "0期生・創設メンバー": "images/icon/group/期生.webp",
  "1期生": "images/icon/group/期生.webp",
  "2期生": "images/icon/group/期生.webp",
  "3期生": "images/icon/group/期生.webp",
  "ミリプロNOVA": "images/icon/group/nova.webp",
  "ミリプロUNI": "images/icon/group/uni.webp",
  "ミリプロSONA": "images/icon/group/SONA.png"
};

/* グループ・期生まとめ（新規の方がミリプロの体制を理解しやすいように表示）
   gen: MEMBERS の gen 値、members: 所属メンバー（GEN の場合は期生の gen 値のみ） */

const GROUP_INFO = [
  {
    id: "gen",
    name: "期生",
    nameEn: "Generations",
    icon: "images/icon/group/期生.webp",
    desc: "ミリプロ設立当初は「〇期生」のナンバリング順でデビューしていました。現在は後述の「NOVA」「UNI」「SONA」というコンセプト・属性ごとのグループ（ユニット）を中心とした活動体制へ移行しています。",
    members: [
      { id: "konomi", note: "設立メンバー / CEO兼クリエイター" },
      { id: "koma" }
    ],
    en: {
      name: "Generations",
      desc: "In the early days of MilliPro, talents debuted in numbered \"Generations\". Today, activities are centered around concept-based groups (units) called \"NOVA\", \"UNI\", and \"SONA\"."
    }
  },
  {
    id: "nova",
    name: "ミリプロNOVA",
    nameEn: "MilliPro NOVA",
    icon: "images/icon/group/nova.webp",
    desc: "「Nova（新星）」を意味します。研究生から目標（登録者数など）を達成して正規デビューを果たしたメンバーなど、新たな輝きを放つタレントで構成されたグループです。",
    members: [
      { id: "raco" },
      { id: "yura" },
      { id: "nuhu" },
      { id: "aoi", note: "2026/9/12 加入発表・デビュー前" }
    ],
    en: {
      name: "MilliPro NOVA",
      desc: "Named after \"Nova (new star)\". A group of talents who shine anew — including members who debuted as full talents after reaching goals (such as subscriber counts) as trainees."
    }
  },
  {
    id: "uni",
    name: "ミリプロUNI",
    nameEn: "MilliPro UNI",
    icon: "images/icon/group/uni.webp",
    desc: "「Unique / Universe / Unity」などの意味合いを持つ音楽特化型ユニット。メンバーそれぞれに「天気（雲・雨・霧）」を連想させるモチーフや名前が取り入れられているのが特徴です。",
    members: [
      { id: "tsukuri", note: "［モチーフ：雲］" },
      { id: "liz", note: "［モチーフ：雨］" },
      { id: "rei", note: "［モチーフ：霧］" }
    ],
    en: {
      name: "MilliPro UNI",
      desc: "A music-specialized unit whose name evokes \"Unique / Universe / Unity\". Each member features weather motifs (clouds, rain, fog) in their names and themes."
    }
  },
  {
    id: "sona",
    name: "ミリプロSONA",
    nameEn: "MilliPro SONA",
    icon: "images/icon/group/SONA.png",
    badge: "new",
    desc: "音楽（Sound）と個性（Persona）を掛け合わせた新ユニット。メンバー一人ひとりの個性とアーティスト性を軸に、それぞれの強みや魅力を最大限に活かす「個としての活動（ソロ・アーティスト活動）」を中心に輝ける場所として設立されました。",
    members: [
      { id: "nono" },
      { id: "akubi" },
      { id: "mahoro", note: "※ミリプロ加入と同時に所属" }
    ],
    en: {
      name: "MilliPro SONA",
      desc: "A new unit combining Sound and Persona. Founded as a place where each member's individuality and artistry shine through \"solo artist activities\" that maximize their strengths and appeal."
    }
  }
];
