/* Contact us: the campus photos (#cmGal). The photos cross-fade on their own, one every 5 s, and the progress bar below fills one segment
   per photo (the fill is a CSS animation; its animationend moves to the next photo). Previous and next buttons (user 2026-11-13: "when
   hovered there should be navigation buttons") appear while the pointer is over the photos or a button has keyboard focus, and always on
   touch screens; a click moves one photo and restarts that photo's segment. Runs only while on screen and pauses while the pointer is over
   it. With prefers-reduced-motion the photos do not advance on their own (and there is no progress bar), but the buttons still work. */
(() => {
  const gal = document.getElementById('cmGal'); if (!gal) return;
  const slides = [...gal.querySelectorAll('.cm__ph')], segs = [...gal.querySelectorAll('.cm__prog span')];
  if (slides.length < 2) return;
  const auto = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0, seen = false, held = false;

  const show = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('is-on', k === i); s.toggleAttribute('aria-hidden', k !== i); });
    if (!auto) return;
    segs.forEach((s, k) => { s.classList.remove('is-on'); s.classList.toggle('is-done', k < i); });
    void segs[i].offsetWidth;                       // restart the fill animation
    segs[i].classList.add('is-on');
  };
  const sync = () => gal.classList.toggle('is-paused', !seen || held);

  // previous / next (Iconoir nav-arrow-left / nav-arrow-right)
  const arrow = d => `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="${d}"/></svg>`;
  const nav = document.createElement('div');
  nav.className = 'cm__nav';
  nav.innerHTML = `<button type="button" class="cm__navb cm__navb--prev" aria-label="Previous photo">${arrow('M15 6L9 12L15 18')}</button>`
                + `<button type="button" class="cm__navb cm__navb--next" aria-label="Next photo">${arrow('M9 6L15 12L9 18')}</button>`;
  gal.appendChild(nav);
  nav.querySelector('.cm__navb--prev').addEventListener('click', () => show(i - 1));
  nav.querySelector('.cm__navb--next').addEventListener('click', () => show(i + 1));
  gal.classList.add('has-nav');

  if (!auto) return;
  segs.forEach(s => s.addEventListener('animationend', () => show(i + 1)));
  gal.addEventListener('pointerenter', () => { held = true; sync(); });
  gal.addEventListener('pointerleave', () => { held = false; sync(); });
  new IntersectionObserver(es => { seen = es[0].isIntersecting; sync(); }, { threshold: .3 }).observe(gal);

  gal.classList.add('is-auto', 'is-paused');
})();
