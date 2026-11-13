/* The hero (css/hero-v6.css): version 6's toppers panel in version 7.
   - The slideshow: each topper stays 6.5s, then hands over with a 1s cross-fade. The active dot's fill is the clock: when it
     finishes, the next topper comes in; pausing (the keyboard-only button, or the panel scrolled off screen) pauses it.
     Choosing a dot jumps to that topper and gives it its full time.
   - With each topper the rank card (AIR, name) is drawn in again.
   - The entrance waits for the intro screen (js/intro.js: html.vrv-lock, then 'vr:intro-done'); the four figures under the
     panel then roll up to their values as each one rises in.
   - Reduced motion: everything in place, the first topper stays (the dots still switch), nothing pushes in or rolls. */
(() => {
  const hero = document.getElementById('hero');
  if (!hero || !hero.classList.contains('hx')) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SLIDE = 6500;
  const slides = [...hero.querySelectorAll('.hx__slide')], dots = [...hero.querySelectorAll('.hx__dots button')];
  const mark = hero.querySelector('.hx__mark'), air = mark.querySelector('.hx__mark-air b'), name = mark.querySelector('.hx__mark-name');
  const pauseBtn = hero.querySelector('.hx__pause');
  const pad = n => String(n).padStart(2, '0');
  let cur = 0, ready = false, paused = false, onScreen = true, clock = null;

  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  const tick = () => {
    if (clock) { clock.cancel(); clock = null; }
    if (!ready || reduce) return;
    clock = dots[cur].querySelector('i').animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: SLIDE, easing: 'linear', fill: 'forwards' });
    clock.onfinish = () => show(cur + 1);
    if (paused || !onScreen) clock.pause();
  };

  const show = i => {
    cur = (i + slides.length) % slides.length;
    const s = slides[cur], rank = +s.dataset.rank, who = s.dataset.name;
    slides.forEach((el, k) => {
      el.classList.toggle('is-on', k === cur);
      el.setAttribute('aria-hidden', k === cur ? 'false' : 'true');
    });
    dots.forEach((d, k) => { if (k === cur) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    air.textContent = pad(rank);
    name.textContent = who;
    if (!reduce) restart(mark, 'is-drawn');
    tick();
  };

  dots.forEach((d, k) => d.addEventListener('click', () => show(k)));
  if (reduce) pauseBtn.hidden = true;
  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.textContent = paused ? 'Play the toppers’ slideshow' : 'Pause the toppers’ slideshow';
    if (clock) paused ? clock.pause() : (onScreen && clock.play());
  });

  // on screen: the clock runs; off screen it rests
  new IntersectionObserver(es => {
    onScreen = es[0].isIntersecting;
    hero.classList.toggle('is-live', onScreen);
    if (clock) (onScreen && !paused) ? clock.play() : clock.pause();
  }, { threshold: .15 }).observe(hero);

  // the four figures roll up to their values as each one rises in: only the first number turns ("36/50" rolls its 36)
  const roll = () => hero.querySelectorAll('.hx__stat').forEach(li => {
    const fig = li.querySelector('.hx__fig'), value = fig.dataset.fig, m = value.match(/^(\D*)(\d+)(.*)$/);
    if (!m) return;
    const [, pre, num, post] = m, to = +num, at = parseFloat(li.style.getPropertyValue('--at')) || 0, DUR = 1200;
    fig.textContent = pre + '0' + post;
    setTimeout(() => {
      const t0 = performance.now();
      const step = now => {
        const p = Math.min(1, (now - t0) / DUR), e = 1 - Math.pow(1 - p, 3);
        fig.textContent = pre + Math.round(to * e) + post;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, at);
  });

  // the panel starts 16px under v7's floating nav, wherever the nav sits at this width (it is lower on wide screens); and pinned
  // under the next section, a hero taller than the screen pins once its foot is in view, so none of it is hidden
  const nav = document.getElementById('nav');
  const fit = () => {
    if (nav && !nav.classList.contains('is-hidden')) {
      const r = nav.getBoundingClientRect();
      // the foot of what shows of the nav (its pills), measured as if the page were at the top
      const foot = Math.max(...[...nav.children].filter(el => el.offsetParent !== null).map(el => el.getBoundingClientRect().bottom)) - r.top + nav.offsetTop;
      hero.style.setProperty('--hx-top', Math.round(foot + 16) + 'px');
      // and its sides line up with the nav's ends
      hero.style.setProperty('--hx-side', Math.round(r.left) + 'px');
      hero.style.setProperty('--hx-side-r', Math.round(innerWidth - r.right) + 'px');
    }
    hero.style.setProperty('--hx-stick', Math.min(0, innerHeight - hero.offsetHeight) + 'px');
  };
  fit(); addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  const start = () => {
    ready = true;
    hero.classList.add('is-in');
    if (!reduce) roll();
    show(0);
  };
  show(0);
  if (reduce) { hero.classList.add('is-in'); return; }
  hero.classList.add('is-pre');
  if (document.documentElement.classList.contains('vrv-lock')) document.addEventListener('vr:intro-done', () => requestAnimationFrame(start), { once: true });
  else requestAnimationFrame(() => requestAnimationFrame(start));
})();
