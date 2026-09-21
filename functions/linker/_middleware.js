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
  let ultimateName = "";
  try {
    const dbUrl = `https://millipro-shared-default-rtdb.asia-southeast1.firebasedatabase.app/millipro/linker/${uid}.json`;
    const r = await fetch(dbUrl, { cf: { cacheTtl: 60 } });
    if (r.ok) {
      const data = await r.json();
      if (data) {
        name = data.name || "";
        ultimateName = data.ultimate || "";
      }
    }
  } catch (e) {}

  const ogImage = `${OGP_HOST}/cardOgp?uid=${encodeURIComponent(uid)}`;
  const ogTitle = name ? `${name} — ${ultimateName ? ultimateName : "Milli Linker"} | Milli Kit` : `Milli Linker プロフィール | Milli Kit`;
  const ogDesc = name ? `${name}の推し活名刺。最推し ${ultimateName || ""}` : `推し・神回を1枚にまとめた名刺です。`;

  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${ogTitle.replace(/"/g, "&quot;")}">`
  ).replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${ogDesc.replace(/"/g, "&quot;")}">`
  ).replace(
    /<meta property="og:image" content="[^"]*">/,
    `<meta property="og:image" content="${ogImage}">`
  ).replace(
    /<meta name="twitter:card" content="[^"]*">/,
    `<meta name="twitter:card" content="summary_large_image">`
  );

  if (!html.includes('name="twitter:image"')) {
    html = html.replace("</head>", `<meta name="twitter:image" content="${ogImage}">\n</head>`);
  } else {
    html = html.replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${ogImage}">`);
  }

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });
}
