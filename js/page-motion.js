/* v49: hero slides follow the hero VIDEO's own clock, so the copy always matches what is on screen, including when it loops.
   The video (20.04 s) has eight shots; two shots per slide:
     slide 1  0.00 - 5.65   a student arrives at the institute, then a full classroom        (legacy)
     slide 2  5.65 - 10.65  a student with his mentor, then late-night study from books     (Prelims, foundation)
     slide 3 10.65 - 14.65  an exam hall writing, then a close-up of handwriting            (Mains, writing)
     slide 4 14.65 - 20.04  the interview panel, then the officer walking into the sunrise  (achievement)
   Progress bars fill from the video time. Clicking a bar, the arrow keys or a swipe seek the video to that slide. */
(() => {
  const hero = document.getElementById('dlPin'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vid = null, imgs = [...document.querySelectorAll('#dlSlides img')], DUR = 3;   // image carousel: each slide shows for DUR seconds
  if (!hero || reduce) return;
  const scs = [...hero.querySelectorAll('.sc')], bars = [...hero.querySelectorAll('#dlProg button')];
  const N = 4, CUT = [0, DUR, DUR * 2, DUR * 3];             // start time of each slide in the video (just before the cut, so the text is in as the picture changes)
  let END = DUR * 4, cur = -1, raf = 0, introDone = !document.documentElement.classList.contains('vrv-lock'), inView = false, tabOn = !document.hidden;
  let clock = 0, last = 0;                                 // fallback clock, used only if the video is not playing (e.g. data saver)
  const bounds = () => CUT.concat(vid && vid.duration && isFinite(vid.duration) ? vid.duration : END);
  const slideAt = t => { const b = bounds(); for (let i = N - 1; i >= 0; i--) if (t >= b[i]) return i; return 0; };
  const cta = document.getElementById('dlCta');
  const CTAS = [['Explore our courses', '#courses'], ['Explore GS programmes', '#gs'], ['Explore Interview Guidance', '#contact'], ['Start Your UPSC Preparation', '#contact']];
  const show = n => {
    if (cta) {
      const apply = () => { cta.href = CTAS[n][1]; cta.querySelectorAll('.btn__t').forEach(t => { t.textContent = CTAS[n][0]; }); };
      if (cur < 0) apply();                                    // first paint: no fade
      else { cta.classList.add('is-swap'); clearTimeout(cta._t); cta._t = setTimeout(() => { apply(); cta.classList.remove('is-swap'); }, 400); }   // the whole button fades out with the old copy, changes, then fades back in with the new copy
    }
    cur = n; hero.dataset.s = n; imgs.forEach((im, i) => im.classList.toggle('on', i === n));
    // the slide that is leaving keeps .is-leaving for a moment so its copy can slide out before the next one rises in
    scs.forEach((s, i) => {
      const on = i === n - 1;
      if (!on && s.classList.contains('on')) { s.classList.add('is-leaving'); clearTimeout(s._lt); s._lt = setTimeout(() => s.classList.remove("is-leaving"), 450); }
      if (on) { clearTimeout(s._lt); s.classList.remove('is-leaving'); }
      s.classList.toggle('on', on);
    });
    bars.forEach((b, i) => b.setAttribute('aria-current', i === n ? 'true' : 'false'));
  };
  const timeNow = now => {
    if (vid && !vid.paused && vid.readyState >= 2) { clock = vid.currentTime; last = now; return clock; }
    const dt = Math.min(100, now - (last || now)); last = now; clock = (clock + dt / 1000) % bounds()[N]; return clock;   // no video playback: keep the same timeline on our own clock
  };
  const frame = now => {
    raf = 0; const t = timeNow(now), b = bounds(), i = slideAt(t);
    if (i !== cur) show(i);
    bars.forEach((el, k) => el.style.setProperty('--p', k < i ? 1 : k === i ? ((t - b[k]) / (b[k + 1] - b[k])).toFixed(4) : 0));
    sync();
  };
  const sync = () => { if (introDone && inView && tabOn && !raf) raf = requestAnimationFrame(frame); };
  const seek = n => { n = (n + N) % N; const t = CUT[n]; clock = t; if (vid) { try { vid.currentTime = t; } catch (e) {} const p = vid.play(); if (p && p.catch) p.catch(() => {}); } show(n); sync(); };
  if (!introDone) document.addEventListener('vr:intro-done', () => { introDone = true; seek(0); }, { once: true });   // the video restarts with slide 1 once the intro screen has lifted
  bars.forEach((b, i) => b.addEventListener('click', () => seek(i)));
  document.addEventListener('visibilitychange', () => { tabOn = !document.hidden; last = 0; sync(); });
  new IntersectionObserver(es => { inView = es[0].isIntersecting; last = 0; sync(); }, { threshold: .3 }).observe(hero);
  hero.addEventListener('keydown', e => { if (e.key === 'ArrowRight') seek(cur + 1); else if (e.key === 'ArrowLeft') seek(cur - 1); });
  let x0 = null;
  hero.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 50) seek(cur + (dx < 0 ? 1 : -1)); }, { passive: true });
  show(0); sync();
})();

/* nav: transparent while the hero is in view */
(() => {
  const nav = document.getElementById('nav'), hero = document.getElementById('dlPin'); if (!nav || !hero) return;
  let tick = false;
  const f = () => { tick = false; nav.classList.toggle('nav--hero', scrollY < hero.offsetHeight - 120); };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(f); } }, { passive: true });
  addEventListener('resize', f); f();
})();

/* hero -> next section: q = how far the section after the hero has risen into view (0 = just below the fold, 1 = at the top).
   q darkens the hero; the sheet is solid, its content fades and lifts in between q .12 and .7. */
(() => {
  const hero = document.getElementById('dlPin'), top = document.querySelector('#dlPin + section');   // whichever section follows the hero slides over it (Programmes since 2026-11-10)
  if (!hero || !top || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let tick = false;
  const c = (v) => Math.max(0, Math.min(1, v));
  const f = () => {
    tick = false;
    const q = c(1 - top.getBoundingClientRect().top / innerHeight);
    hero.style.setProperty('--cover', q.toFixed(3));
    top.style.setProperty('--cov', c((q - .12) / .58).toFixed(3));
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(f); } }, { passive: true });
  addEventListener('resize', f); f();
})();

/* CTA buttons: the reference build. Wraps the label in two stacked copies (it rolls up on hover), puts two teer-arrows in the
   circle (one slides out as the other slides in). Also picks up buttons added later. */
(() => {
  const ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8h11"/><path d="M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4"/></svg>';
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const enhance = el => {
    if (el.dataset.cta) return; el.dataset.cta = '1'; el.classList.add('cta');
    const sq = el.querySelector(':scope > .sq');
    const rest = [...el.childNodes].filter(n => n !== sq);
    const html = rest.map(n => n.nodeType === 1 ? n.outerHTML : n.textContent).join('').trim();
    const live = !!el.querySelector('[id]');              // text that other scripts rewrite (e.g. "View all 2025"): keep a single copy
    rest.forEach(n => n.remove());
    const label = document.createElement('span'); label.className = 'btn__label';
    label.innerHTML = live ? '<span class="btn__t">' + html + '</span>' : '<span class="btn__t">' + html + '</span><span class="btn__t" aria-hidden="true">' + html + '</span>';
    el.insertBefore(label, sq || null);
    if (sq) sq.innerHTML = ARROW + ARROW;
  };
  const SEL = '.bt, .pbtn, .talk, .vbtn, .inv__reg';
  const scan = root => (root.matches && root.matches(SEL) ? [root] : []).concat([...(root.querySelectorAll ? root.querySelectorAll(SEL) : [])]).forEach(enhance);
  scan(document);
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n); }))).observe(document.body, { childList: true, subtree: true });
})();

/* nav: mark the link of the section currently on screen */
(() => {
  const links = [...document.querySelectorAll('.nav__links a.nav__a[href^="#"]')]; if (!links.length) return;
  const map = links.map(a => ({ a, el: document.querySelector(a.getAttribute('href')) })).filter(x => x.el && x.el.id !== 'top');
  let tick = false;
  const f = () => {
    tick = false; const y = innerHeight * .35; let cur = null;
    map.forEach(m => { const r = m.el.getBoundingClientRect(); if (r.height && r.top <= y && r.bottom > y) cur = m.a; });
    links.forEach(a => a.classList.toggle('is-current', a === cur));
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(f); } }, { passive: true });
  addEventListener('resize', f); f();
})();

/* scroll focus: each section's content brightens GRADUALLY as the section rises toward the middle of the screen (fully lit once its top
   reaches halfway) and dims gradually as it leaves (its bottom travelling from halfway up to the top of the screen). Tied to the scroll position,
   so it eases with your scrolling instead of switching. The hero and the Toppers sheet (own reveal) are left alone. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const MAP = {
    courses: '.band__in', why: '.wc__in', batches: ':scope > *', gs: '.gs__in, .gsbook',
    faculty: ':scope > *', stories: ':scope > *', contact: '.contact__in', resources: ':scope > *', visit: ':scope > *', faq: ':scope > *', closing: ':scope > *'
  };
  const secs = [];
  Object.keys(MAP).forEach(id => {
    const s = document.getElementById(id); if (!s) return;
    const kids = [...s.querySelectorAll(MAP[id])].filter(e => e.parentElement === s || id === 'courses' || id === 'gs');
    if (!kids.length) return;
    kids.forEach(k => k.classList.add('fx')); secs.push(s);
  });
  document.documentElement.classList.add('fx-on');
  const MIN = .16, c = v => Math.max(0, Math.min(1, v)), ease = t => t * t * (3 - 2 * t);
  let tick = false;
  const update = () => {
    tick = false; const vh = innerHeight;
    secs.forEach(s => {
      const r = s.getBoundingClientRect();
      const rise = c((vh - r.top) / (vh * .5));          // 0 when the top enters at the bottom of the screen, 1 when it reaches halfway
      const leave = c(r.bottom / (vh * .5));              // 1 while the bottom is at or below halfway, 0 when it reaches the top of the screen
      s.style.setProperty('--fx', (MIN + (1 - MIN) * ease(Math.min(rise, leave))).toFixed(3));
    });
  };
  const kick = () => { if (!tick) { tick = true; requestAnimationFrame(update); } };
  addEventListener('scroll', kick, { passive: true }); addEventListener('resize', kick); update();
})();

/* WhatsApp button: slides in once the intro has finished (or straight away when there is no intro) */
(() => {
  const b = document.getElementById('waBtn'); if (!b) return;
  const show = () => requestAnimationFrame(() => b.classList.add('in'));
  if (document.documentElement.classList.contains('vrv-lock')) document.addEventListener('vr:intro-done', show, { once: true });
  else setTimeout(show, 600);
})();

/* closing CTA: mouse follow. A warm light trails the cursor across the orange card (eased, so it lags a little behind the pointer), and the
   lotus and the inner glow drift a few pixels against it for depth. Real pointers only; off for reduced motion. Uses the `translate`
   property, so it stacks with the CSS transforms (centring, hover turn) instead of replacing them. */
(() => {
  const card = document.querySelector('.cl__card'); if (!card) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const spot = card.querySelector('.cl__spot'), lotus = card.querySelector('.cl__lotus'), glow = card.querySelector('.cl__glow--b');
  let w = 1, h = 1, tx = 0, ty = 0, x = 0, y = 0, raf = 0;
  const loop = () => {
    x += (tx - x) * .12; y += (ty - y) * .12;
    const dx = x / w * 2 - 1, dy = y / h * 2 - 1;     // -1 … 1 across the card
    if (spot) spot.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    if (lotus) lotus.style.translate = `${(-dx * 18).toFixed(1)}px ${(-dy * 12).toFixed(1)}px`;
    if (glow) glow.style.translate = `${(dx * 26).toFixed(1)}px ${(dy * 16).toFixed(1)}px`;
    raf = Math.abs(tx - x) + Math.abs(ty - y) > .4 ? requestAnimationFrame(loop) : 0;
  };
  const at = e => { const r = card.getBoundingClientRect(); w = r.width; h = r.height; tx = e.clientX - r.left; ty = e.clientY - r.top; };
  const go = () => { if (!raf) raf = requestAnimationFrame(loop); };
  card.addEventListener('pointerenter', e => { at(e); if (!card.classList.contains('is-follow')) { x = tx; y = ty; } card.classList.add('is-follow'); go(); });
  card.addEventListener('pointermove', e => { at(e); go(); });
  card.addEventListener('pointerleave', () => { card.classList.remove('is-follow'); tx = w / 2; ty = h / 2; go(); });   // parallax settles back to centre
})();

/* footer ornament border: fades and settles in when the footer comes into view (css/v49.css .foot__frame) */
(() => {
  const f = document.querySelector('.foot__frame'); if (!f || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  f.classList.add('fb-anim');
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { f.classList.add('is-in'); io.disconnect(); } }), { threshold: .15 });
  io.observe(f.parentElement);
})();

/* card lists without a reveal of their own (batch cards, FAQ, the Toppers roll): stagger in when they reach the screen (css/v49.css .sg) */
(() => {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  const arm = el => { if (!el || el.classList.contains('sg')) return; [...el.children].forEach((c, i) => c.style.setProperty('--i', Math.min(i, 8))); el.classList.add('sg'); io.observe(el); };
  const go = () => ['#price', '#faqList', '#gzTen', '#story:not(.cmp--run) .cmp__track'].forEach(s => { const el = document.querySelector(s); if (el && el.children.length) arm(el); });
  go(); addEventListener('load', go);
})();
