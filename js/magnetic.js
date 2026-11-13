/* Magnetic CTAs (user 2026-11-13, "a subtle magnetic pull to the cta buttons"): when the pointer comes within a short reach of a call-to-action
   button, the button drifts a few pixels towards it, and springs back when the pointer leaves. Mouse and trackpad only (no touch), and off
   with reduced motion. The offset goes into --mx / --my, which css/v49.css ("magnetic CTAs") adds to each button's own translate, so the
   story's entrance and the ticket's press still work. Eased in JS (no CSS transition), so it does not fight the buttons' own transitions. */
(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = [...document.querySelectorAll('.cta, .cmp__cta')];
  if (!els.length) return;
  const REACH = 40, PULL_X = .22, PULL_Y = .3, MAX_X = 8, MAX_Y = 6, EASE = .16;   // reach beyond the edges (px), share of the distance, caps (px), easing per frame
  const st = els.map(el => ({ el, x: 0, y: 0, tx: 0, ty: 0 }));
  let px = -1e4, py = -1e4, raf = 0;
  const clamp = (v, m) => Math.max(-m, Math.min(m, v));
  const aim = () => {
    for (const s of st) {
      const r = s.el.getBoundingClientRect();
      if (!r.width) { s.tx = s.ty = 0; continue; }
      const l = r.left - s.x, t = r.top - s.y;                       // the button's resting box (without the current pull)
      const inside = px > l - REACH && px < l + r.width + REACH && py > t - REACH && py < t + r.height + REACH;
      s.tx = inside ? clamp((px - (l + r.width / 2)) * PULL_X, MAX_X) : 0;
      s.ty = inside ? clamp((py - (t + r.height / 2)) * PULL_Y, MAX_Y) : 0;
    }
  };
  const tick = () => {
    raf = 0; aim();
    let moving = false;
    for (const s of st) {
      const nx = s.x + (s.tx - s.x) * EASE, ny = s.y + (s.ty - s.y) * EASE;
      const done = Math.abs(s.tx - nx) < .05 && Math.abs(s.ty - ny) < .05;
      const x = done ? s.tx : nx, y = done ? s.ty : ny;
      if (x !== s.x || y !== s.y) { s.x = x; s.y = y; s.el.style.setProperty('--mx', x.toFixed(2) + 'px'); s.el.style.setProperty('--my', y.toFixed(2) + 'px'); }
      if (!done) moving = true;
    }
    if (moving) go();
  };
  const go = () => { if (!raf) raf = requestAnimationFrame(tick); };
  addEventListener('pointermove', e => { if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return; px = e.clientX; py = e.clientY; go(); }, { passive: true });
  addEventListener('scroll', go, { passive: true });                   // the page can carry a button under a still pointer
  document.documentElement.addEventListener('pointerleave', () => { px = py = -1e4; go(); });
})();
