// Artes de datas comemorativas com fundo "fotográfico" (bokeh, enfeites e fogos desenhados em canvas, sem fotos de terceiros).
// Uso: node foto.js natal|anonovo  → grava ../artes/<slug>.jpg e ../artes/<slug>-story.jpg
const p = require('puppeteer-core'), fs = require('fs'), path = require('path'), D = __dirname;
const chrome = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(f => fs.existsSync(f));
const tema = process.argv[2] || 'natal';
const T = {
  natal: { slug: '2026-12-24-natal', linha1: 'Feliz', linha2: 'Natal', texto: 'Que o seu Natal seja de paz, saúde e união ao lado de quem você ama.', assinatura: 'Família CK Gestão Contábil' },
  anonovo: { slug: '2026-12-31-ano-novo', linha1: 'Feliz', linha2: '2027', texto: 'Obrigado pela parceria em 2026. Que o novo ano venha com conquistas e prosperidade!', assinatura: 'Equipe CK Gestão Contábil' },
}[tema];

// desenho do fundo (roda no navegador)
const cena = `
function rnd(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}}
function bokeh(c,r,n,cores,rmin,rmax,blur,alpha,area){
  for(let i=0;i<n;i++){const x=area.x+r()*area.w,y=area.y+r()*area.h,rad=rmin+r()*(rmax-rmin),cor=cores[Math.floor(r()*cores.length)];
    c.save();c.filter='blur('+(blur*(0.6+r()*0.8)).toFixed(1)+'px)';c.globalAlpha=alpha*(0.35+r()*0.65);
    const g=c.createRadialGradient(x,y,rad*0.1,x,y,rad);g.addColorStop(0,cor);g.addColorStop(0.75,cor);g.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=g;c.beginPath();c.arc(x,y,rad,0,7);c.fill();
    c.globalAlpha*=0.5;c.strokeStyle=cor;c.lineWidth=rad*0.08;c.beginPath();c.arc(x,y,rad*0.93,0,7);c.stroke();c.restore();}
}
function enfeite(c,x,y,R,base,claro,escuro,fio){
  c.save();c.strokeStyle='rgba(230,200,140,.55)';c.lineWidth=2;c.beginPath();c.moveTo(x,-10);c.lineTo(x,y-R-18);c.stroke();
  // presilha
  const gp=c.createLinearGradient(x-16,0,x+16,0);gp.addColorStop(0,'#7a5a1e');gp.addColorStop(.5,'#f5d98c');gp.addColorStop(1,'#6b4c15');
  c.fillStyle=gp;c.fillRect(x-17,y-R-20,34,24);c.beginPath();c.strokeStyle='#d8b25a';c.lineWidth=3;c.arc(x,y-R-24,8,Math.PI,0);c.stroke();
  // sombra suave
  c.filter='blur(30px)';c.globalAlpha=.55;c.fillStyle='#000';c.beginPath();c.ellipse(x+R*.25,y+R*.35,R*.95,R*.9,0,0,7);c.fill();c.filter='none';c.globalAlpha=1;
  // esfera
  const g=c.createRadialGradient(x-R*.35,y-R*.4,R*.05,x,y,R*1.05);g.addColorStop(0,claro);g.addColorStop(.35,base);g.addColorStop(.85,escuro);g.addColorStop(1,'#050505');
  c.fillStyle=g;c.beginPath();c.arc(x,y,R,0,7);c.fill();
  // reflexo da luz ambiente (bokeh refletido)
  c.save();c.beginPath();c.arc(x,y,R,0,7);c.clip();
  for(let i=0;i<9;i++){const a=-2.4+i*.13,rr=R*.78;c.globalAlpha=.25;c.fillStyle='#ffe2a0';c.filter='blur(2px)';c.beginPath();c.arc(x+Math.cos(a)*rr,y+Math.sin(a)*rr,R*.035,0,7);c.fill();}
  c.filter='none';const rim=c.createRadialGradient(x+R*.5,y+R*.55,R*.1,x+R*.5,y+R*.55,R*.7);rim.addColorStop(0,'rgba(255,190,90,.35)');rim.addColorStop(1,'rgba(0,0,0,0)');
  c.globalAlpha=1;c.fillStyle=rim;c.fillRect(x-R,y-R,2*R,2*R);
  // brilho especular
  const s=c.createRadialGradient(x-R*.38,y-R*.42,0,x-R*.38,y-R*.42,R*.32);s.addColorStop(0,'rgba(255,255,255,.95)');s.addColorStop(.4,'rgba(255,255,255,.35)');s.addColorStop(1,'rgba(255,255,255,0)');
  c.fillStyle=s;c.beginPath();c.ellipse(x-R*.38,y-R*.42,R*.32,R*.22,-.6,0,7);c.fill();c.restore();c.restore();
}
function galho(c,r,x0,y0,ang,comp,blur){
  c.save();c.filter='blur('+blur+'px)';c.translate(x0,y0);c.rotate(ang);
  c.strokeStyle='#2a1a0c';c.lineWidth=8;c.beginPath();c.moveTo(0,0);c.lineTo(comp,0);c.stroke();
  for(let t=0;t<comp;t+=7){for(const lado of[-1,1]){const l=60+r()*50,a=lado*(0.55+r()*.3);
    const g=c.createLinearGradient(t,0,t+Math.cos(a)*l,Math.sin(a)*l);g.addColorStop(0,'#0d3a22');g.addColorStop(1,r()>.5?'#1f6b3e':'#164f2e');
    c.strokeStyle=g;c.lineWidth=3.2;c.beginPath();c.moveTo(t,0);c.quadraticCurveTo(t+Math.cos(a)*l*.5,Math.sin(a)*l*.45,t+Math.cos(a)*l,Math.sin(a)*l);c.stroke();}}
  c.restore();
}
function fogo(c,r,x,y,R,cor,n){
  c.save();c.globalCompositeOperation='lighter';
  for(let i=0;i<n;i++){const a=r()*Math.PI*2,len=R*(.55+r()*.45),cur=.12;
    const path=()=>{c.beginPath();c.moveTo(x+Math.cos(a)*len*.08,y+Math.sin(a)*len*.08);for(let k=1;k<=20;k++){const t=k/20;c.lineTo(x+Math.cos(a)*len*t,y+Math.sin(a)*len*t+len*cur*t*t*1.4);}};
    const gl=c.createLinearGradient(x,y,x+Math.cos(a)*len,y+Math.sin(a)*len);gl.addColorStop(0,'rgba(0,0,0,0)');gl.addColorStop(.6,cor);gl.addColorStop(1,'#fff');
    c.globalAlpha=.5;c.filter='blur(4px)';c.strokeStyle=gl;c.lineWidth=5;path();c.stroke();
    c.filter='none';c.globalAlpha=.85;c.lineWidth=1.6;path();c.stroke();
    const ex=x+Math.cos(a)*len,ey=y+Math.sin(a)*len+len*cur*1.4;const g=c.createRadialGradient(ex,ey,0,ex,ey,14);g.addColorStop(0,'#fff');g.addColorStop(.3,cor);g.addColorStop(1,'rgba(0,0,0,0)');
    c.globalAlpha=.9;c.fillStyle=g;c.beginPath();c.arc(ex,ey,14,0,7);c.fill();}
  const h=c.createRadialGradient(x,y,0,x,y,R*1.1);h.addColorStop(0,'rgba(255,220,150,.35)');h.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=1;c.fillStyle=h;c.beginPath();c.arc(x,y,R*1.1,0,7);c.fill();
  c.restore();
}
function desenhar(cv,tema){
  const c=cv.getContext('2d'),W=cv.width,H=cv.height,r=rnd(tema==='natal'?7:11);
  if(tema==='natal'){
    const bg=c.createRadialGradient(W*.5,H*.42,50,W*.5,H*.5,H*.85);bg.addColorStop(0,'#1b2a5e');bg.addColorStop(.55,'#0d1636');bg.addColorStop(1,'#04070f');c.fillStyle=bg;c.fillRect(0,0,W,H);
    bokeh(c,r,70,['#ffcf70','#ffb347','#fff1c9','#f2b632'],30,95,14,.55,{x:-80,y:-80,w:W+160,h:H+160});
    bokeh(c,r,40,['#ffd98a','#ffffff','#e8a33a'],12,40,5,.7,{x:0,y:0,w:W,h:H*.75});
    galho(c,r,-40,H*.06,.18,W*.55,1.2);galho(c,r,W+40,H*.02,Math.PI-.12,W*.5,2.5);
    enfeite(c,W*.74,H*.25,118,'#c8952c','#ffeab0','#5c3d08');
    enfeite(c,W*.88,H*.13,64,'#a31d2b','#ff8c8c','#3a0408');
    enfeite(c,W*.16,H*.17,52,'#1d2c6b','#8fa6ff','#060b24');
    const v=c.createLinearGradient(0,H*.45,0,H);v.addColorStop(0,'rgba(4,7,15,0)');v.addColorStop(1,'rgba(4,7,15,.92)');c.fillStyle=v;c.fillRect(0,0,W,H);
  } else {
    const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#03060f');bg.addColorStop(.6,'#0d1840');bg.addColorStop(1,'#1d2c6b');c.fillStyle=bg;c.fillRect(0,0,W,H);
    for(let i=0;i<160;i++){c.globalAlpha=r()*.7;c.fillStyle='#fff';c.beginPath();c.arc(r()*W,r()*H*.6,r()*1.4,0,7);c.fill();}c.globalAlpha=1;
    fogo(c,r,W*.72,H*.2,W*.25,'#ffcc55',120);fogo(c,r,W*.26,H*.13,W*.15,'#ffe8b0',90);fogo(c,r,W*.9,H*.42,W*.12,'#ff9d4d',70);fogo(c,r,W*.12,H*.4,W*.1,'#fff4d6',60);
    bokeh(c,r,90,['#ffcf70','#ffb347','#fff1c9','#9fb4ff'],14,60,9,.6,{x:-40,y:H*.68,w:W+80,h:H*.4});
    bokeh(c,r,30,['#ffd98a','#ffffff'],40,110,18,.35,{x:-80,y:H*.55,w:W+160,h:H*.5});
    const v=c.createLinearGradient(0,H*.4,0,H);v.addColorStop(0,'rgba(3,6,15,0)');v.addColorStop(1,'rgba(3,6,15,.85)');c.fillStyle=v;c.fillRect(0,0,W,H);
  }
}`;

const pagina = (w, h, story) => `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;color:#fff">
  <canvas id="cv" width="${w}" height="${h}" style="position:absolute;inset:0"></canvas>
  <div style="position:absolute;left:90px;right:90px;bottom:${story ? 330 : 120}px">
    <div style="font-family:'Great Vibes',cursive;font-size:${story ? 150 : 130}px;line-height:.9;color:var(--ouro);text-shadow:0 4px 30px #0009;font-style:italic;font-weight:600">${T.linha1}</div>
    <div style="font-size:${story ? 190 : 170}px;font-weight:900;line-height:.95;letter-spacing:-3px;text-shadow:0 6px 40px #000a">${T.linha2}</div>
    <div style="width:120px;height:6px;background:var(--ouro);border-radius:3px;margin:34px 0 28px"></div>
    <div style="font-size:${story ? 40 : 36}px;font-weight:500;line-height:1.35;color:#eef1ff;max-width:${story ? 760 : 700}px;text-shadow:0 2px 16px #000c">${T.texto}</div>
    <div style="font-size:${story ? 34 : 30}px;font-weight:800;color:var(--ouro);margin-top:26px">${T.assinatura}</div>
  </div>
  <div class="selo" style="top:auto;left:auto;transform:none;right:70px;bottom:${story ? 330 : 110}px;width:150px;height:150px"><img src="logo_ck.png" style="width:120px"></div>
  ${story ? `<div style="position:absolute;left:0;right:0;bottom:0;height:200px;background:var(--ouro);display:flex;align-items:center;justify-content:center;gap:18px;font-size:34px;font-weight:900;color:var(--azul)"><img src="logo_ck.png" style="height:70px">CK Gestão Contábil · @ckgestaocontabil.es</div>` : ''}
</div><script>${cena};desenhar(document.getElementById('cv'),'${tema}')</script>`;

(async () => {
  const b = await p.launch({ executablePath: chrome, args: ['--no-sandbox'] }), g = await b.newPage();
  const css = fs.readFileSync(path.join(D, 'base.css'), 'utf8'), out = path.join(D, '..', 'artes');
  for (const [w, h, story] of [[1080, 1350, false], [1080, 1920, true]]) {
    const f = path.join(D, '_tmp.html');
    fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body style="width:${w}px;height:${h}px">${pagina(w, h, story)}</body></html>`);
    await g.setViewport({ width: w, height: h }); await g.goto('file://' + f); await g.evaluate(() => document.fonts.ready); await new Promise(r => setTimeout(r, 500));
    await g.screenshot({ path: path.join(out, T.slug + (story ? '-story' : '') + '.jpg'), type: 'jpeg', quality: 93 }); fs.unlinkSync(f);
  }
  await b.close(); console.log('ok', T.slug);
})().catch(e => { console.error(e); process.exit(1); });
