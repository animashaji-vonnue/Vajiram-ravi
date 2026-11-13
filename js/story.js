/* Our story (the opening of the Why section): the pinned photographic scene, ported from vajiram-ravi-homepage.vercel.app (v16.js
   campus()). Timings are in vh of scroll after the section pins:
     0-168    the gate card grows from 22vw x 49vh to 92vw x 82vh while the full-bleed facade fades out
     140-196  "हमारी" slides left and "कहानी" right
     182-280  the card shrinks into the first chapter's photo slot (40vw x 52vh, bottom-left) and the heading and chapters fade up
     280-322  the caption blurs in, its rule draws, the button rises
     then     each next chapter swings in about its bottom-left corner from 30deg while the track slides a screen (112vh, 7vh apart)
     then     (version 7, "Life at Vajiram & Ravi", user 2026-11-13) a short rest on the sixth chapter, then the chapters lift away
              (GA to GA+60) while the photo gallery (#lifeGal) rises in (GA+35 to GB); it holds a moment before the scene lets go
   What is drawn trails the scroll on an exponential ease. Wide screens (900 x 600 and up) with motion only; otherwise css/story.css
   shows the chapters stacked. A spacer after the section supplies the scroll the scene plays over. */
(() => {
  const sec = document.getElementById('story');
  if (!sec) return;
  const stage = sec.querySelector('.cmp__stage'), card = sec.querySelector('.cmp__card'), track = sec.querySelector('.cmp__track');
  const ov = sec.querySelector('.cmp__ov'), gal = sec.querySelector('.cmp__gal');
  const panels = [...track.children], N = panels.length;
  const wide = matchMedia('(min-width: 900px) and (min-height: 600px)'), reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (u, a, b) => clamp((u - a) / (b - a));
  const io = t => ((t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) + (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)) / 2;
  const lerp = (a, b, t) => a + (b - a) * t;
  // the first chapter's photo slot (css/story.css .cmp--run .cmp__ph): width SW vw, height SH vh, top ST of the screen
  const SW = 44, SH = 54, ST = .36;
  const S0 = 322, STEP = 119, DUR = 112, TAU = .12;
  const LAND = S0 + (N - 2) * STEP + DUR;                   // the sixth chapter has landed
  const GA = LAND + 30, GB = GA + 110;                      // the gallery: chapters lift from GA, the gallery is fully up at GB
  const RUN = gal ? GB + 30 : S0 + (N - 1) * STEP + 40;
  let shown = null;
  // Version 7: the opening zoom (0-322) is skipped. The scene starts settled on the first chapter, and the scroll only
  // carries the chapters sliding in from the right.
  const START = S0;
  const spacer = document.createElement('div');
  spacer.className = 'cmp__run'; spacer.setAttribute('aria-hidden', 'true');
  const H = () => document.documentElement.clientHeight || innerHeight;
  const pxVar = () => { const d = document.createElement('div'); d.style.width = 'var(--px)'; d.style.position = 'absolute'; sec.append(d); const w = d.getBoundingClientRect().width; d.remove(); return w; };
  let on = false, raf = 0, last = 0, su = null, px = 0;

  // scroll progress in vh since the section's top reached the top of the screen (the section is sticky, so read the spacer's position)
  const aim = () => START + clamp((H() - spacer.getBoundingClientRect().top) / H() * 100, 0, RUN - START);

  const draw = u => {
    const W = document.documentElement.clientWidth, h = H();
    const g = io(seg(u, 0, 168)), m = io(seg(u, 182, 280)), st = stage.style;
    st.setProperty('--g', g.toFixed(4));
    st.setProperty('--s', io(seg(u, 140, 196)).toFixed(4));
    st.setProperty('--bo', (1 - seg(u, 147, 189)).toFixed(4));
    st.setProperty('--ov', seg(u, 182, 280).toFixed(4));
    st.setProperty('--ti', seg(u, 280, 322).toFixed(4));
    st.setProperty('--tr', seg(u, 287, 322).toFixed(4));
    st.setProperty('--tb', seg(u, 301, 322).toFixed(4));
    let shift = 0;
    panels.forEach((p, k) => {
      if (!k) return;
      const e = io(seg(u, S0 + (k - 1) * STEP, S0 + (k - 1) * STEP + DUR));
      shift += e;
      const r = 30 * (1 - e);
      p.style.transform = r > .01 ? `rotate(${r.toFixed(3)}deg)` : '';
      p.style.setProperty('--e', e.toFixed(4));   // css/story.css: the photo settles from a slight zoom as its chapter lands
    });
    track.style.setProperty('--tx', (-shift * 100).toFixed(3) + 'vw');
    if (gal) {
      const lift = io(seg(u, GA, GA + 60)), gv = io(seg(u, GA + 35, GB));
      st.setProperty('--lift', lift.toFixed(4));
      st.setProperty('--gv', gv.toFixed(4));
      gal.classList.toggle('is-up', gv > .001);
      ov.classList.toggle('is-gone', lift > .999);
      const sh = gv > .6;
      if (sh !== shown) {
        shown = sh;
        gal.classList.toggle('is-shown', sh);   // (not inert: tabbing into the gallery scrolls it up, see focusin below)
        gal.dispatchEvent(new CustomEvent('lifegal', { detail: sh }));   // js/life-gallery.js starts / stops its autoplay
      }
    }
    const w = lerp(lerp(22, 92, g), SW, m) * W / 100, ht = lerp(lerp(49, 82, g), SH, m) * h / 100;
    // settled, the card sits exactly on the first chapter's photo slot: left = --px, top = ST
    const xEnd = px + SW / 200 * W - W / 2, yEnd = (ST + SH / 200) * h - h / 2;
    const x = lerp(0, xEnd, m) - shift * W, y = lerp(0, yEnd, m);
    card.style.width = w.toFixed(1) + 'px';
    card.style.height = ht.toFixed(1) + 'px';
    card.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px))`;
  };

  const tick = now => {
    raf = 0;
    if (!on) return;
    const want = aim();
    const dt = last ? Math.min(.1, (now - last) / 1000) : 0; last = now;
    su = su === null ? want : su + (want - su) * (1 - Math.exp(-dt / TAU));
    draw(su);
    if (Math.abs(want - su) > .02) raf = requestAnimationFrame(tick); else { su = want; draw(su); last = 0; }
  };
  const queue = () => { if (on && !raf) raf = requestAnimationFrame(tick); };
  const size = () => { spacer.style.height = ((RUN - START) / 100 * H()).toFixed(0) + 'px'; px = pxVar(); };

  const set = () => {
    const want = wide.matches && !reduce.matches;
    if (want === on) return;
    on = want;
    sec.classList.toggle('cmp--run', on);
    if (on) {
      sec.after(spacer); size(); su = aim(); draw(su);   // version 7: draw the settled first chapter at once, before any scroll
      sec.querySelectorAll('.cmp__ov img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });   // off-screen chapters would never intersect (the gallery loads its own)
      queue();
    } else {
      spacer.remove();
      stage.removeAttribute('style'); track.removeAttribute('style'); card.removeAttribute('style');
      panels.forEach(p => { p.style.transform = ''; p.style.removeProperty('--e'); });
      if (gal) { shown = null; gal.classList.remove('is-up', 'is-shown'); ov.classList.remove('is-gone'); gal.dispatchEvent(new CustomEvent('lifegal', { detail: false })); }
    }
  };

  // a focused link brings its chapter to rest on screen
  sec.addEventListener('focusin', e => {
    if (!on) return;
    const p = e.target.closest('.cmp__p'), g = gal && gal.contains(e.target); if (!p && !g) return;
    const k = p ? panels.indexOf(p) : -1, u = g ? GB : k ? S0 + (k - 1) * STEP + DUR : S0;
    const y0 = spacer.getBoundingClientRect().top + scrollY - H();
    const y = y0 + (u - START) / 100 * H();
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true }); else scrollTo({ top: y, behavior: 'auto' });
  });
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', () => { if (on) size(); queue(); });
  wide.addEventListener?.('change', set);
  reduce.addEventListener?.('change', set);
  set();
  addEventListener('load', () => { if (on) { size(); su = aim(); draw(su); } });   // re-measure once fonts and images are in
})();
