// SK Fen Bilimleri — tüm sayfalarda ortak: mobil menü ve WhatsApp bağlantıları
(() => {
  // ---- WhatsApp ayarı: numarayı ülke koduyla, boşluksuz yaz (örn. 905321234567) ----
  const WHATSAPP_NUMARA = '905398569980';
  const WHATSAPP_MESAJ = 'Merhaba, SK Fen Bilimleri programları hakkında bilgi almak istiyorum.';

  waUygula(WHATSAPP_NUMARA);

  // ---- İçerik: icerik.json (panelden düzenlenir) sayfadaki metin ve listeleri doldurur ----
  const esc = v => String(v == null ? '' : v).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const al = (o, p) => p.split('.').reduce((x, k) => (x == null ? undefined : x[k]), o);
  const ytId = v => { const m = String(v || '').match(/(?:v=|\/shorts\/|youtu\.be\/|\/embed\/)([\w-]{11})/); return m ? m[1] : String(v || '').trim(); };
  const play = '<span class="play"><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></span>';

  fetch('icerik.json', { cache: 'no-store' }).then(r => r.json()).then(uygula).catch(() => {});

  function uygula(I) {
    // Basit metinler
    document.querySelectorAll('[data-i]').forEach(el => { const v = al(I, el.dataset.i); if (v != null && v !== '') el.textContent = v; });
    document.querySelectorAll('[data-i-href]').forEach(el => { const v = al(I, el.dataset.iHref); if (v) el.href = v; });
    // İletişim
    if (I.iletisim) {
      if (I.iletisim.whatsapp) waUygula(String(I.iletisim.whatsapp).replace(/\D/g, ''));
      const tel = String(I.iletisim.sabit_hat || '').replace(/\D/g, '');
      if (tel) document.querySelectorAll('a[href^="tel:"]').forEach(a => a.href = 'tel:+9' + tel.replace(/^0/, '0'));
    }
    // Hero
    const h1 = document.getElementById('h1');
    if (h1 && I.hero && I.hero.baslik) h1.innerHTML = esc(I.hero.baslik) + ' <span>' + esc(I.hero.baslik_vurgu || '') + '</span>';
    if (I.hero && Array.isArray(I.hero.etiketler)) I.hero.etiketler.forEach((t, k) => { const el = document.querySelector('.chip-f.f' + (k + 1)); if (el && t) el.textContent = t; });
    // Farkımız ne
    if (Array.isArray(I.fark)) document.querySelectorAll('.diff-grid .dtile').forEach((el, k) => { const f = I.fark[k]; if (!f) return; const b = el.querySelector('b'), sp = el.querySelector('span:not(.todo)'); if (b && f.baslik) b.textContent = f.baslik; if (sp && f.metin) sp.textContent = f.metin; });
    // Başarı hikayeleri
    const sr = document.querySelector('.story-row');
    if (sr && Array.isArray(I.basari) && I.basari.length) sr.innerHTML = I.basari.map(x => { const id = ytId(x.youtube); return `<div class="story yt" data-yt="${esc(id)}" role="button" tabindex="0" aria-label="${esc(x.ad)}: ${esc(x.aciklama)} videosunu oynat"><div class="frame"><span class="tag-c t-coral">${esc(x.etiket || 'YKS')}</span><img class="pst" src="https://i.ytimg.com/vi/${esc(id)}/oar2.jpg" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${esc(id)}/hqdefault.jpg'" alt="" loading="lazy">${play}</div><b>${esc(x.ad)}</b><small>${esc(x.aciklama)}</small></div>`; }).join('');
    // Tam destek kartları
    if (Array.isArray(I.destek)) document.querySelectorAll('.sup-grid .sup').forEach((el, k) => { const d = I.destek[k]; if (!d) return;
      const ey = el.querySelector('.eyebrow'), h3 = el.querySelector('h3'), p = el.querySelector(':scope > p'), vf = el.querySelector('.vframe');
      if (ey && d.ust) ey.textContent = d.ust; if (h3 && d.baslik) h3.innerHTML = '<em>' + esc(d.vurgu || '') + '</em> ' + esc(d.baslik); if (p && d.metin) p.textContent = d.metin;
      const id = ytId(d.youtube); if (vf && id) { vf.outerHTML = `<div class="vframe yt" data-yt="${esc(id)}" role="button" tabindex="0" aria-label="Videoyu oynat"><img src="https://i.ytimg.com/vi/${esc(id)}/hqdefault.jpg" alt="" loading="lazy">${play}</div>`; } });
    // Yorumlar
    const rt = document.getElementById('revTrack');
    if (rt && Array.isArray(I.yorumlar) && I.yorumlar.length) { const bgs = ['bg-blue', '', 'bg-coral', '', 'bg-yellow', 'bg-green']; rt.innerHTML = I.yorumlar.map((y, k) => `<article class="rev ${bgs[k % bgs.length]}"><div class="rw"><i></i><div><b>${esc(y.ad)}</b><small>${esc(y.rol)}</small></div></div><q>${esc(y.metin)}</q><div class="mark"><span>”</span></div></article>`).join(''); }
    // SSS
    const fl = document.querySelector('.faq-list');
    if (fl && Array.isArray(I.sss) && I.sss.length) fl.innerHTML = I.sss.map((q, k) => `<details${k === 0 ? ' open' : ''}><summary>${esc(q.soru)}<i></i></summary><p>${esc(q.cevap)}</p></details>`).join('');
    // Duyuru şeridi
    duyuru(I.duyurular || []);
  }

  function waUygula(num) {
    if (!num) return;
    document.querySelectorAll('[data-wa]').forEach(a => { const msg = a.dataset.waMsg || WHATSAPP_MESAJ; a.href = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`; a.target = '_blank'; a.rel = 'noopener'; });
    const n = num.replace(/^90/, '0');
    document.querySelectorAll('[data-wa-num]').forEach(el => el.textContent = n.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4'));
  }

  function duyuru(all) {
    const bar = document.getElementById('duyuru'); if (!bar) return;
    const list = all.filter(x => x.aktif !== false && x.metin);
    if (!list.length) { bar.hidden = true; return; }
    const txt = bar.querySelector('.txt'), tag = bar.querySelector('.tag'), dots = bar.querySelector('.ddots');
    let cur = 0, timer;
    dots.innerHTML = list.map((_, i) => `<i${i === 0 ? ' class="on"' : ''}></i>`).join('');
    const show = i => { cur = (i + list.length) % list.length; const x = list[cur]; tag.textContent = x.etiket || 'Duyuru';
      txt.innerHTML = `<span class="slide">${esc(x.metin)}${x.link ? ` <a href="${esc(x.link)}">${esc(x.link_metni || 'Detay')} →</a>` : ''}</span>`;
      dots.querySelectorAll('i').forEach((el, j) => el.classList.toggle('on', j === cur)); };
    const restart = () => { clearInterval(timer); if (list.length > 1) timer = setInterval(() => show(cur + 1), 6000); };
    bar.querySelector('.prev').onclick = () => { show(cur - 1); restart(); };
    bar.querySelector('.next').onclick = () => { show(cur + 1); restart(); };
    bar.querySelector('.close').onclick = () => { bar.hidden = true; clearInterval(timer); };
    if (list.length < 2) bar.querySelectorAll('.prev,.next,.ddots').forEach(el => el.style.display = 'none');
    show(0); restart(); bar.hidden = false;
  }

  const btn = document.querySelector('.menu-btn'), panel = document.getElementById('mnav');
  if (btn && panel) {
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'mnav');
    const set = open => { panel.style.top = Math.max(0, btn.closest('.hdr').getBoundingClientRect().bottom) + 'px'; panel.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); btn.textContent = open ? 'Kapat' : 'Menü'; };
    btn.addEventListener('click', () => set(!panel.classList.contains('open')));
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }
})();
