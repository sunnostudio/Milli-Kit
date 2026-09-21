// Cloudflare Pages Function — /linker/view.html
// Injects dynamic og:image / og:title for each uid so X shows the business card.
// If the FM is not available, falls back to static view.html.

export async function onRequest(context){
  const url = new URL(context.request.url);
  const uid = url.searchParams.get('uid') || url.searchParams.get('u') || url.searchParams.get('id') || '';
  // fetch static view.html
  const res = await context.next();
  let html = await res.text();

  if(!uid){
    return new Response(html, res);
  }

  // Try to fetch linker data to set title (optional, without auth it may be public)
  let name = '';
  let ultimateName = '';
  try{
    const dbUrl = `https://millipro-shared-default-rtdb.asia-southeast1.firebasedatabase.app/millipro/linker/${uid}.json`;
    const r = await fetch(dbUrl, { cf:{ cacheTtl:60 } });
    if(r.ok){
      const data = await r.json();
      if(data){
        name = data.name || '';
        const ultimate = data.ultimate || '';
        // fetch member name if available (minimal)
        if(ultimate){
          // we could fetch members.json, but keep simple
          ultimateName = ultimate;
        }
      }
    }
  }catch(e){}

  const ogImage = `https://milli-unishare-og.onrender.com/cardOgp?uid=${encodeURIComponent(uid)}`;
  const ogTitle = name ? `${name} — ${ultimateName ? ultimateName : 'Milli Linker'} | Milli Kit` : `Milli Linker プロフィール | Milli Kit`;
  const ogDesc = name ? `${name}の推し活名刺。最推し ${ultimateName || ''}` : `推し・神回を1枚にまとめた名刺です。`;

  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${ogTitle.replace(/"/g,'&quot;')}">`
  ).replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${ogDesc.replace(/"/g,'&quot;')}">`
  ).replace(
    /<meta property="og:image" content="[^"]*">/,
    `<meta property="og:image" content="${ogImage}">`
  ).replace(
    /<meta name="twitter:card" content="[^"]*">/,
    `<meta name="twitter:card" content="summary_large_image">`
  );

  // also add twitter:image
  if(!html.includes('name="twitter:image"')){
    html = html.replace('</head>', `<meta name="twitter:image" content="${ogImage}">\n</head>`);
  } else {
    html = html.replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${ogImage}">`);
  }

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=60'
    }
  });
}
