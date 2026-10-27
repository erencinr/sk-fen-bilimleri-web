// SK Fen Bilimleri — tüm sayfalarda ortak: mobil menü ve WhatsApp bağlantıları
(() => {
  // ---- WhatsApp ayarı: numarayı ülke koduyla, boşluksuz yaz (örn. 905321234567) ----
  const WHATSAPP_NUMARA = '905398569980';
  const WHATSAPP_MESAJ = 'Merhaba, SK Fen Bilimleri programları hakkında bilgi almak istiyorum.';

  if (WHATSAPP_NUMARA) {
    document.querySelectorAll('[data-wa]').forEach(a => {
      const msg = a.dataset.waMsg || WHATSAPP_MESAJ;
      a.href = `https://wa.me/${WHATSAPP_NUMARA}?text=${encodeURIComponent(msg)}`;
      a.target = '_blank'; a.rel = 'noopener';
    });
    const n = WHATSAPP_NUMARA.replace(/^90/, '0');
    document.querySelectorAll('[data-wa-num]').forEach(el => el.textContent = n.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4'));
  }

  // ---- Duyuru şeridi: duyurular.json içindeki aktif duyuruları sırayla gösterir ----
  const bar = document.getElementById('duyuru');
  if (bar) fetch('duyurular.json', { cache: 'no-store' }).then(r => r.json()).then(d => {
    const list = (d.duyurular || []).filter(x => x.aktif !== false && x.metin);
    if (!list.length) return;
    const txt = bar.querySelector('.txt'), tag = bar.querySelector('.tag'), dots = bar.querySelector('.ddots');
    let cur = 0, timer;
    dots.innerHTML = list.map((_, i) => `<i${i === 0 ? ' class="on"' : ''}></i>`).join('');
    const show = i => {
      cur = (i + list.length) % list.length; const x = list[cur];
      tag.textContent = x.etiket || 'Duyuru';
      txt.innerHTML = `<span class="slide">${esc(x.metin)}${x.link ? ` <a href="${esc(x.link)}">${esc(x.link_metni || 'Detay')} →</a>` : ''}</span>`;
      dots.querySelectorAll('i').forEach((el, j) => el.classList.toggle('on', j === cur));
    };
    const restart = () => { clearInterval(timer); if (list.length > 1) timer = setInterval(() => show(cur + 1), 6000); };
    bar.querySelector('.prev').onclick = () => { show(cur - 1); restart(); };
    bar.querySelector('.next').onclick = () => { show(cur + 1); restart(); };
    bar.querySelector('.close').onclick = () => { bar.hidden = true; clearInterval(timer); };
    if (list.length < 2) bar.querySelectorAll('.prev,.next,.ddots').forEach(el => el.remove());
    show(0); restart(); bar.hidden = false;
  }).catch(() => {});
  function esc(v) { return String(v).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch])); }

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
