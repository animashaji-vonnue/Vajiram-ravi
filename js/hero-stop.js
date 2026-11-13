/* A stop at the foot of the hero (user 2026-11-13: "if the user scrolls fast they will miss the banner section, so make the scroll stop at
   the banner section and the user has to scroll again to get to the programmes section"). Scrolling down from above, the page comes to
   rest where the hero's foot (the What's trending banners) meets the bottom of the screen, which is also where the hero pins and
   Programmes starts to slide over it. The rest of that scroll gesture is swallowed; the next gesture carries on. Scrolling up is never
   held, links and buttons that scroll the page (programmatic scrolls) pass straight through, and it only applies when the hero is taller
   than the screen.
   - Mouse wheel and trackpad (smoothed by Lenis): the wheel event that would carry the page past the stop is turned into a smooth scroll
     to the stop; further wheel events are dropped until the input pauses (180 ms without an event, after at least 400 ms, which lets a
     trackpad's momentum run out) or 1.2 s have passed, or the wheel turns upwards.
   - Touch, keyboard, and no Lenis (reduced motion): native scrolling; when a scroll that the user started crosses the stop, the page is
     put back on it, and a touch fling's momentum is cut (overflow hidden for a moment), so another swipe is needed. */
(() => {
  const hero = document.getElementById('hero'); if (!hero) return;
  const wrap = hero.parentElement;
  const stopY = () => wrap.offsetTop + hero.offsetHeight - innerHeight;   // page y at which the hero's foot meets the bottom of the screen
  const active = () => stopY() > 40;
  const now = () => performance.now();

  // ---- wheel and trackpad, through Lenis ----
  const lenis = window.__lenis;
  let hold = false, since = 0, last = 0;
  if (lenis) {
    lenis.options.virtualScroll = ({ deltaY, event }) => {
      if (!event.type.includes('wheel') || event.ctrlKey) return true;   // touch is native here; pinch-zoom is not a scroll
      const t = now();
      if (hold) {
        const gap = t - last; last = t;
        if (deltaY < 0 || (t - since > 400 && gap > 180) || t - since > 1200) hold = false;   // upwards, a new gesture, or long enough
        else { event.preventDefault(); return false; }
      }
      if (deltaY > 0 && active()) {
        const S = stopY(), from = lenis.targetScroll;
        if (from < S - 1 && from + deltaY > S - 1) {                     // this step would carry the page past the stop
          event.preventDefault();
          lenis.scrollTo(S, { programmatic: false });                    // as a wheel step would (so Lenis's target is the stop at once)
          hold = true; since = last = t;
          return false;
        }
      }
      return true;
    };
  }

  // ---- touch, keyboard and plain native scrolling ----
  const KEYS = new Set(['ArrowDown', 'PageDown', ' ', 'Spacebar']);
  let input = -1e9, prev = scrollY;
  addEventListener('touchmove', () => { input = now(); }, { passive: true });
  addEventListener('touchend', () => { input = now(); }, { passive: true });
  addEventListener('keydown', e => { if (KEYS.has(e.key) && !e.target.closest('input, textarea, select, [contenteditable]')) input = now(); });
  if (!lenis) addEventListener('wheel', () => { input = now(); }, { passive: true });
  const cut = S => {
    const html = document.documentElement, ov = html.style.overflow;
    html.style.overflow = 'hidden';                                       // stops a touch fling's momentum
    scrollTo(0, S);
    if (lenis) lenis.scrollTo(S, { immediate: true, force: true });
    setTimeout(() => { html.style.overflow = ov; }, 80);
  };
  addEventListener('scroll', () => {
    const y = scrollY, p = prev; prev = y;
    if (y <= p || !active() || now() - input > 1500) return;              // only downwards, and only scrolls the user started just now
    if (lenis && lenis.isScrolling !== 'native') return;                  // Lenis's own (wheel, links): handled above or let through
    const S = stopY();
    if (p < S - 1 && y > S + 1) cut(S);
  }, { passive: true });
})();
