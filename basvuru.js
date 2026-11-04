// Ön görüşme formu: doğrular, Cloudflare servisine gönderir, teşekkür sayfasına yönlendirir
(() => {
  const SERVIS = 'https://sk-whatsapp-asistan.skfenbilimleri.workers.dev/basvuru';
  const form = document.getElementById('basvuru') || document.getElementById('lead');
  if (!form) return;
  const durum = form.querySelector('.form-note');
  const sel = form.querySelector('[name=program]');
  const secAlan = document.getElementById('b-secenek-alan'), secKutu = document.getElementById('b-secenek'), secEtiket = document.getElementById('b-secenek-etiket');
  const SECENEKLER = window.SK_SECENEKLER || {};

  // Program seçeneklerini (Etüt 3/5, Atomica 6/9...) göster
  const secenekGoster = () => {
    if (!secAlan || !sel) return;
    const list = SECENEKLER[sel.value];
    if (!list) { secAlan.hidden = true; secKutu.innerHTML = ''; return; }
    secEtiket.textContent = sel.value === 'atomica' ? 'Grup tercihi' : 'Tercih';
    secKutu.innerHTML = list.map((s, i) => `<label><input type="radio" name="secenek" value="${s.replace(/"/g, '&quot;')}"${i === list.length - 1 ? ' checked' : ''}><span>${s}</span></label>`).join('');
    secAlan.hidden = false;
  };
  if (sel) {
    const q = new URLSearchParams(location.search).get('program');
    if (q && [...sel.options].some(o => o.value === q)) sel.value = q;
    sel.addEventListener('change', secenekGoster); secenekGoster();
  }

  const telTemiz = v => { let d = String(v).replace(/\D/g, ''); if (d.startsWith('90') && d.length === 12) d = d.slice(2); if (d.length === 10 && d.startsWith('5')) d = '0' + d; return d; };
  const telGecerli = d => /^05\d{9}$/.test(d);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const tel = telTemiz(fd.get('telefon'));
    const telInput = form.querySelector('[name=telefon]');
    telInput.setCustomValidity(telGecerli(tel) ? '' : 'Geçerli bir Türkiye cep numarası girin (05xx xxx xx xx).');
    if (!form.reportValidity()) return;
    const veri = {
      veli_adi: String(fd.get('veli_adi') || '').trim(), telefon: tel, sinif: fd.get('sinif') || '', program: fd.get('program') || '',
      secenek: fd.get('secenek') || '', iletisim: fd.get('iletisim') || 'Telefon', zaman: fd.get('zaman') || '', not: String(fd.get('not') || '').trim().slice(0, 1000),
      kvkk: !!fd.get('kvkk'), ticari: !!fd.get('ticari'), web: fd.get('web') || '',
      kaynak: location.href, utm: Object.fromEntries([...new URLSearchParams(location.search)].filter(([k]) => k.startsWith('utm_')))
    };
    const btn = form.querySelector('[type=submit]'); btn.disabled = true;
    if (durum) { durum.className = 'form-note on'; durum.textContent = 'Gönderiliyor…'; }
    try {
      const r = await fetch(SERVIS, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(veri) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.no) throw new Error(j.hata || 'Gönderilemedi, lütfen tekrar deneyin ya da WhatsApp’tan yazın.');
      try { if (typeof gtag === 'function') gtag('event', 'form_submit_success', { program: veri.program, sinif: veri.sinif }); } catch {}
      location.href = 'tesekkurler.html?no=' + encodeURIComponent(j.no);
    } catch (err) {
      if (durum) { durum.className = 'form-note on err'; durum.textContent = err.message; }
      btn.disabled = false;
    }
  });
})();
