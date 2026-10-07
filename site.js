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

  const btn = document.querySelector('.menu-btn'), panel = document.getElementById('mnav');
  if (btn && panel) {
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'mnav');
    const set = open => { panel.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); btn.textContent = open ? 'Kapat' : 'Menü'; };
    btn.addEventListener('click', () => set(!panel.classList.contains('open')));
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }
})();
