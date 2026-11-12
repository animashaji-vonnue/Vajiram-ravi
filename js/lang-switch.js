/* header language switcher (EN / हिं): swaps the header + drawer labels, sets <html lang>, remembers the choice.
   Other scripts can listen for the 'langchange' event on document to translate their own content. */
(() => {
  const sw = document.getElementById('langSw'); if (!sw) return;
  const HI = {
    'All courses': 'सभी कोर्स', 'Toppers': 'टॉपर्स', 'Study materials': 'अध्ययन सामग्री', 'Current affairs': 'करंट अफेयर्स',
    'UPSC exam': 'UPSC परीक्षा', 'Upcoming batches': 'आगामी बैच', 'FAQs': 'सामान्य प्रश्न', 'Contact us': 'संपर्क करें', "Let's talk": 'बात करें'
  };
  const KEY = 'vr-lang';
  const targets = () => [...document.querySelectorAll('.nav__links .nav__a, #drawer a, .nav .talk .btn__t')];
  targets().forEach(el => { if (!el.dataset.en) el.dataset.en = el.textContent.trim(); });
  const btns = [...sw.querySelectorAll('.lang__b')];
  const apply = (lang, animate) => {
    sw.dataset.cur = lang;
    document.documentElement.lang = lang;
    btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
    targets().forEach(el => {
      if (!el.dataset.en) el.dataset.en = el.textContent.trim();
      const t = lang === 'hi' ? (HI[el.dataset.en] || el.dataset.en) : el.dataset.en;
      if (el.textContent.trim() === t) return;
      el.textContent = t;
      if (animate) { const a = el.closest('.btn__label') || el; a.classList.remove('is-sw'); void a.offsetWidth; a.classList.add('is-sw'); }
    });
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  };
  let saved = 'en'; try { saved = localStorage.getItem(KEY) === 'hi' ? 'hi' : 'en'; } catch (e) {}
  // the "Let's talk" label is split into rolling spans by v49.js, which runs before this script
  apply(saved, false);
  btns.forEach(b => b.addEventListener('click', () => {
    const lang = b.dataset.lang; if (sw.dataset.cur === lang) return;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply(lang, true);
  }));
})();
