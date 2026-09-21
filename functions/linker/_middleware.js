// Cloudflare Pages — /linker/* middleware
// /linker/view.html (と /linker/view) のときだけ動的og:title/description/imageを注入。
// それ以外は素通し。Xクローラーは ?uid=xxx 付きURLを叩く。
const OGP_HOST = "https://milli-kit-og.onrender.com";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const p = url.pathname;
  const isView = p === "/linker/view.html" || p === "/linker/view" || p.endsWith("/linker/view.html");
  const res = await context.next();
  if (!isView) return res;
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("text/html")) return res;
  const uid = url.searchParams.get("uid") || url.searchParams.get("u") || url.searchParams.get("id") || "";
  let html = await res.text();
  if (!uid) return new Response(html, res);

  let name = "";
  let ultimateRaw = "";
  try {
    const dbUrl = `https://millipro-shared-default-rtdb.asia-southeast1.firebasedatabase.app/millipro/linker/${uid}.json`;
    const r = await fetch(dbUrl, { cf: { cacheTtl: 60 } });
    if (r.ok) {
      const data = await r.json();
      if (data) {
        name = data.name || "";
        ultimateRaw = data.ultimate || "";
      }
    }
  } catch (e) {}
  const MEMBER_NAMES = {
    konomi:"甘狼このみ", nono:"音ノ乃のの", akubi:"あくび・でもんすぺーど", koma:"小廻こま",
    raco:"音ノ瀬らこ", yura:"ゆらぎゆら", nuhu:"虹深°ぬふ", tsukuri:"眠雲ツクリ", tukuri:"眠雲ツクリ",
    liz:"雨夜リズ", rei:"夕霧レイ", mahoro:"鹿乃まほろ", aoi:"海琳あおい",
    nova:"ミリプロNOVA", uni:"ミリプロUNI", sona:"ミリプロSONA"
  };
  const ultimateName = MEMBER_NAMES[ultimateRaw] || ultimateRaw;

  const ogImage = `${OGP_HOST}/cardOgp?uid=${encodeURIComponent(uid)}`;
  const ogTitle = name ? `${name} — ${ultimateName ? ultimateName : "Milli Linker"} | Milli Kit` : `Milli Linker プロフィール | Milli Kit`;
  const ogDesc = name ? `${name}の推し活名刺。最推し ${ultimateName || ""}` : `推し・神回を1枚にまとめた名刺です。`;

  function escAttr(s){ return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${escAttr(ogTitle)}">`
  ).replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${escAttr(ogDesc)}">`
  ).replace(
    /<meta property="og:image" content="[^"]*">/,
    `<meta property="og:image" content="${escAttr(ogImage)}">`
  ).replace(
    /<meta name="twitter:card" content="[^"]*">/,
    `<meta name="twitter:card" content="summary_large_image">`
  );

  if (!html.includes('name="twitter:image"')) {
    html = html.replace("</head>", `<meta name="twitter:image" content="${escAttr(ogImage)}">\n</head>`);
  } else {
    html = html.replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${escAttr(ogImage)}">`);
  }

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });
}
