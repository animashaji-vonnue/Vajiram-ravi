/* v45: Daylight's scroll behaviour, reproduced from measurements of the live site.
   Smooth scroll: Lenis (duration 1.2s, expo-out), no snapping.
   Section 2 (value propositions), per row i, with liTop = the row's viewport top and k = rowHeight / 457:
     enter  t = clamp((370k - liTop) / 250k)        opacity ×= 1 - (1 - t)^3            (power3.out)
     exit   u = clamp((60k - liTop) / 222k)         opacity ×= 1 - u^2                  (power2.in)
     drift  wrapper translateY = 0.2857 * (liTop - (123 + 282.5 i) k) px                (linear in scroll)
     lines  kicker  translateY% = 100 * (1 - t^out4);  title line 1: 60% -> 0 + opacity (power3.out);
            title line 2 follows the same curve delayed by 0.1
     media  image translateY = -0.295 * (liTop - 221k) px at scale 1.2876                (parallax inside the cell)
   Section 3 (steps): sticky stacked cards; each card's text drifts right/up and fades (power ~1.5) from ~1.0vh to ~2.95vh
   after its card pins, while the next card scrolls over it. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const outP = (t, p) => 1 - Math.pow(1 - t, p);
  const desktop = () => innerWidth > 900;

  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, anchors: true, autoRaf: true });
    window.__lenis = lenis;
  }
  const goto = sel => { const el = document.querySelector(sel); if (!el) return; if (lenis) lenis.scrollTo(el); else el.scrollIntoView({ behavior: 'auto' }); };

  const form = document.getElementById('dlForm');
  if (form) form.addEventListener('submit', e => { e.preventDefault(); goto('#courses'); });

  const rvs = [...document.querySelectorAll('.rv')];
  if (reduce || !('IntersectionObserver' in window)) rvs.forEach(el => el.classList.add('in'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .2, rootMargin: '0px 0px -6% 0px' });
    rvs.forEach(el => io.observe(el));
    requestAnimationFrame(() => document.querySelectorAll('.dl .rv').forEach(el => el.classList.add('in')));
  }

  const dl = document.querySelector('.dl'), dlBg = document.querySelector('.dl__bg'), hwBg = document.getElementById('hwBg'), hwSec = document.querySelector('.hw--intro');
  const rows = [...document.querySelectorAll('.vp__row')].map((row, i) => ({
    i, row, fix: row.querySelector('.vp__fix'), ph: row.querySelector('.vp__ph'),
    kick: row.querySelector('.vp__k .ln i'), t1: row.querySelectorAll('.vp__h .ln i')[0], t2: row.querySelectorAll('.vp__h .ln i')[1]
  }));
  const hp = document.getElementById('hp');
  const cards = hp ? [...hp.querySelectorAll('.hp__li')].map(li => ({ li, txt: li.querySelector('.hp__txt'), vis: li.querySelector('.hp__vis') })) : [];
  // measured per-row windows (viewport px at a 900px-high screen): [start liTop, length]
  const ENTER = [[540, 250], [370, 250], [305, 180]], EXIT = [[130, 250], [60, 222], null];
  let tick = false;

  const frame = () => {
    tick = false;
    const vh = innerHeight, y = scrollY, dsk = desktop();
    if (dl && dlBg && !reduce) { dlBg.style.setProperty('--py', `${(y * .18).toFixed(1)}px`); dlBg.style.setProperty('--sc', (1.06 - clamp(y / vh) * .04).toFixed(3)); }
    if (hwBg && hwSec && !reduce) { const r = hwSec.getBoundingClientRect(); hwBg.style.setProperty('--hy', `${((r.top + r.height / 2 - vh / 2) * -.12).toFixed(1)}px`); }

    rows.forEach(r => {
      const b = r.row.getBoundingClientRect(), k = b.height / 457, top = b.top;
      if (r.ph && !reduce) r.ph.style.setProperty('--iy', `${(-0.295 * (top - 221 * k)).toFixed(1)}px`);
      if (!dsk || reduce) {
        if (reduce && dsk) { const on = Math.abs(top + b.height / 2 - vh / 2) < b.height / 2; r.fix.style.visibility = on ? 'visible' : 'hidden'; r.fix.style.opacity = on ? 1 : 0; r.fix.style.transform = 'none'; }
        return;
      }
      const E = ENTER[r.i], X = EXIT[r.i];
      const t = clamp((E[0] * k - top) / (E[1] * k));
      let u = 0;
      if (X) u = clamp((X[0] * k - top) / (X[1] * k));
      else { const ulB = r.row.parentElement.getBoundingClientRect().bottom; u = clamp((0.42 * vh - ulB) / (0.38 * vh)); }
      const op = outP(t, 3) * (1 - u * u);
      const wy = 0.2857 * (top - (123 + 282.5 * r.i) * k);
      r.fix.style.visibility = op > 0.003 ? 'visible' : 'hidden';
      r.fix.style.opacity = op.toFixed(4);
      r.fix.style.transform = `translate3d(0, ${wy.toFixed(2)}px, 0)`;
      const t2 = clamp((t - 0.1) / 0.9);
      r.kick.style.transform = `translate3d(0, ${(100 * (1 - outP(t, 4))).toFixed(2)}%, 0)`;
      r.t1.style.transform = `translate3d(0, ${(60 * (1 - outP(t, 3))).toFixed(2)}%, 0)`; r.t1.style.opacity = outP(t, 3).toFixed(3);
      r.t2.style.transform = `translate3d(0, ${(60 * (1 - outP(t2, 3))).toFixed(2)}%, 0)`; r.t2.style.opacity = outP(t2, 3).toFixed(3);
    });

    if (hp && cards.length) {
      const ulTop = hp.querySelector('.hp__list').getBoundingClientRect().top + y;
      const pitch = 2.2 * vh + (dsk ? 300 : 0);
      cards.forEach((c, i) => {
        if (i === cards.length - 1 || reduce) { c.txt.style.cssText = c.vis.style.cssText = ''; return; }
        const pinned = ulTop + i * pitch;                         // page y at which this card pins
        const p = clamp((y - (pinned + 1.02 * vh)) / (1.94 * vh));
        const e = Math.pow(p, 1.5);
        c.txt.style.transform = `translate3d(${(64 * e).toFixed(1)}px, ${(-32 * e).toFixed(1)}px, 0)`; c.txt.style.opacity = (1 - e).toFixed(3);
        c.vis.style.transform = `translate3d(${(-36 * e).toFixed(1)}px, 0, 0)`; c.vis.style.opacity = (1 - e).toFixed(3);
      });
    }
  };
  const req = () => { if (!tick) { tick = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', req);
  frame();
})();
