/* What's trending (#trending, in the hero under the four points; styles in css/trending.css). One banner at a time, sliding sideways
   in an endless loop: each banner sits at its place from the one on show, d (-2..2, the shortest way round), so after the last banner
   the first comes in from the right like any other, and going back from the first brings the last in from the left (user 2026-11-13:
   it used to slide back past every banner); a banner that changes sides out of sight jumps there without sliding (--tr-o = d - its
   index, since the flex row already places it at its index). The current dot fills over 6 s (a CSS animation) and its end moves
   to the next banner. It pauses while the pointer is over the banners or the keyboard is in them, while off screen, and while the tab
   is hidden; with prefers-reduced-motion it does not advance on its own. Previous / next buttons, the dots, the arrow keys and a
   sideways swipe change the banner. Only the banner on show can be reached (the others are inert). */
(() => {
  const tr = document.getElementById('trending'); if (!tr) return;
  const slides = [...tr.querySelectorAll('.tr__slide')], dots = [...tr.querySelectorAll('.tr__dots button')];
  const stage = tr.querySelector('.tr__stage'), track = tr.querySelector('.tr__track');
  if (slides.length < 2) return;
  const auto = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0, seen = false, held = false, focus = false;

  const go = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      let d = ((k - i) % slides.length + slides.length) % slides.length; if (d > slides.length / 2) d -= slides.length;
      if (s._d !== undefined && Math.abs(d - s._d) > 1 && d !== 0 && s._d !== 0) {   // changing sides out of sight: no slide
        s.style.transition = 'none'; s.style.setProperty('--tr-o', d - k); void s.offsetWidth; s.style.transition = '';
      } else s.style.setProperty('--tr-o', d - k);
      s._d = d;
      const on = k === i;
      s.classList.toggle('is-on', on); s.inert = !on; s.toggleAttribute('aria-hidden', !on);
    });
    near();
    dots.forEach((d, k) => {
      if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      const f = d.querySelector('i'); f.style.animation = 'none'; void f.offsetWidth; f.style.animation = '';   // restart the fill
    });
  };
  // once the banners are on screen, load the picture on show and the ones either side, so they are there before they slide in
  // (the other pictures stay lazy, so the page does not fetch them all before anyone scrolls down)
  const near = () => { if (!seen) return;
    [i - 1, i, i + 1].forEach(k => { const im = slides[(k + slides.length) % slides.length].querySelector('img'); if (im) im.loading = 'eager'; }); };
  const sync = () => tr.classList.toggle('is-paused', !seen || held || focus || document.hidden);

  tr.querySelector('.tr__nav--prev').addEventListener('click', () => go(i - 1));
  tr.querySelector('.tr__nav--next').addEventListener('click', () => go(i + 1));
  dots.forEach((d, k) => d.addEventListener('click', () => go(k)));
  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { go(i - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { go(i + 1); e.preventDefault(); }
  });

  // a sideways swipe on touch screens
  let sx = 0, sy = 0, swiping = false;
  track.addEventListener('touchstart', e => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; swiping = true; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (!swiping) return; swiping = false;
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) go(i + (dx < 0 ? 1 : -1));
  }, { passive: true });

  go(0);
  new IntersectionObserver(es => { seen = es[0].isIntersecting; near(); sync(); }, { threshold: .35 }).observe(stage);
  if (!auto) return;
  dots.forEach(d => d.querySelector('i').addEventListener('animationend', () => { if (d.getAttribute('aria-current') === 'true') go(i + 1); }));
  stage.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { held = true; sync(); } });
  stage.addEventListener('pointerleave', () => { held = false; sync(); });
  tr.addEventListener('focusin', () => { focus = true; sync(); });
  tr.addEventListener('focusout', e => { if (!tr.contains(e.relatedTarget)) { focus = false; sync(); } });
  document.addEventListener('visibilitychange', sync);
  tr.classList.add('is-auto', 'is-paused');
})();
