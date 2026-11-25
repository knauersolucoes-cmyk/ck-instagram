// Gera o post (1080x1350) e o story (1080x1920) no padrão CK (azul-marinho/dourado) a partir de um JSON.
// Uso: node arte.js spec.json   → grava ../artes/<slug>.jpg e ../artes/<slug>-story.jpg
// spec: { "slug": "2026-12-03-exemplo", "tag": "FOLHA DE PAGAMENTO", "titulo": "Texto com <span class=\"ouro\">destaque</span>",
//         "subtitulo": "Lei nº ...", "itens": [["Título do item", "Explicação curta"], ...até 3],
//         "chamada": "Dúvidas sobre a sua empresa?", "storyTag": "NOVA LEI" }
const p = require('puppeteer-core'), fs = require('fs'), path = require('path'), D = __dirname;
const chrome = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(f => fs.existsSync(f));
const s = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const linha = (n, t, x) => `<div style="display:flex;gap:26px;align-items:flex-start">
  <div style="flex:none;width:66px;height:66px;border-radius:50%;background:var(--ouro);color:var(--azul);font-size:32px;font-weight:900;display:flex;align-items:center;justify-content:center">${n}</div>
  <div><div style="font-size:36px;font-weight:800;line-height:1.15">${esc(t)}</div><div style="font-size:26px;font-weight:500;color:#c9d3f5;margin-top:6px;line-height:1.35">${esc(x)}</div></div></div>`;
const tam = s.titulo.replace(/<[^>]+>/g, '').length > 45 ? 76 : 88;
const post = `<div class="p escuro"><div class="pontos" style="top:70px;right:60px"></div>
  <div style="position:absolute;top:90px;left:90px;right:90px">
    <div class="tag">${esc(s.tag)}</div>
    <h1 style="font-size:${tam}px;margin-top:28px">${s.titulo}</h1>
    ${s.subtitulo ? `<div style="font-size:30px;font-weight:600;color:#c9d3f5;margin-top:16px">${esc(s.subtitulo)}</div>` : ''}
    <div style="display:grid;gap:34px;margin-top:54px">${(s.itens || []).slice(0, 3).map((it, i) => linha(i + 1, it[0], it[1])).join('')}</div>
  </div>
  <div style="position:absolute;left:90px;bottom:90px;font-size:30px;font-weight:700;line-height:1.35;color:#e6ebff">${esc(s.chamada || 'Dúvidas sobre a sua empresa?')}<br><span style="color:var(--ouro2)">Fale com a CK pelo WhatsApp.</span></div>
  <div class="selo canto"><img src="logo_ck.png"></div></div>`;
(async () => {
  const b = await p.launch({ executablePath: chrome, args: ['--no-sandbox'] }), g = await b.newPage();
  const css = fs.readFileSync(path.join(D, 'base.css'), 'utf8'), out = path.join(D, '..', 'artes');
  const shot = async (html, w, h, arq) => { const f = path.join(D, '_tmp.html'); fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body style="height:${h}px">${html}</body></html>`);
    await g.setViewport({ width: w, height: h }); await g.goto('file://' + f); await g.evaluate(() => document.fonts.ready); await new Promise(r => setTimeout(r, 300));
    await g.screenshot({ path: arq, type: 'jpeg', quality: 92 }); fs.unlinkSync(f); };
  const pj = path.join(out, s.slug + '.jpg'); await shot(post, 1080, 1350, pj);
  const img = 'data:image/jpeg;base64,' + fs.readFileSync(pj).toString('base64');
  await shot(`<div class="p escuro" style="height:1920px"><div class="pontos" style="top:90px;left:60px"></div><div class="pontos" style="top:90px;right:60px"></div>
    <div style="position:absolute;top:120px;left:0;right:0;text-align:center"><div class="tag">${esc(s.storyTag || s.tag)}</div></div>
    <div style="position:absolute;top:250px;left:60px;right:60px"><img src="${img}" style="width:960px;height:1200px;object-fit:cover;border-radius:28px;box-shadow:0 30px 70px #0008;display:block"></div>
    <div style="position:absolute;top:1490px;left:0;right:0;text-align:center;font-size:40px;font-weight:800;color:#fff">Confira o post completo no nosso perfil</div>
    <div style="position:absolute;top:1555px;left:0;right:0;text-align:center;font-size:34px;font-weight:800;color:var(--ouro2)">@ckgestaocontabil.es</div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:200px;background:var(--ouro);display:flex;align-items:center;justify-content:center;gap:18px;font-size:34px;font-weight:900;color:var(--azul)"><img src="logo_ck.png" style="height:70px">CK Gestão Contábil</div></div>`,
    1080, 1920, path.join(out, s.slug + '-story.jpg'));
  await b.close(); console.log('ok', s.slug);
})().catch(e => { console.error(e); process.exit(1); });
