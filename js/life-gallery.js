/* Life at Vajiram & Ravi (#lifeGal; styles in css/life-gallery.css). A cover-flow carousel that loops: every card gets its place from
   the front, d = -4..4 (the shortest way round), and from it where it sits (--x, in card widths), its size (--s), its turn (--r), how
   bright (--b) and whether it shows (--o: two cards each side, the rest wait unseen just outside). It advances every 3.6 s while it is
   in view (in the pinned Why scene: once js/story.js has raised it, the "lifegal" event), and pauses while the pointer is over the
   photos, while the keyboard is in it, and while the tab is hidden; with prefers-reduced-motion it does not advance on its own. The
   arrows, the dots, the arrow keys, a click on a side photo and a sideways swipe move it. */
(() => {
  const gal = document.getElementById('lifeGal'); if (!gal) return;
  const sec = document.getElementById('story');
  const cards = [...gal.querySelectorAll('.lg__card')], dots = [...gal.querySelectorAll('.lg__dots button')];
  const stage = gal.querySelector('.lg__stage'), cap = gal.querySelector('.lg__cap');
  const N = cards.length; if (N < 2) return;
  const auto = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const X = [0, .78, 1.36, 1.8, 2.1], S = [1, .84, .7, .6, .55], R = [0, 16, 24, 28, 30], B = [1, .8, .66, .6, .6], O = [1, 1, .92, 0, 0];
  let i = 0, inView = false, raised = false, held = false, focus = false, timer = 0, near = false;

  const place = () => {
    cards.forEach((c, k) => {
      let d = ((k - i) % N + N) % N; if (d > N / 2) d -= N;
      const a = Math.min(4, Math.abs(d)), sg = Math.sign(d);
      c.style.setProperty('--x', (sg * X[a]).toFixed(3));
      c.style.setProperty('--s', S[a]);
      c.style.setProperty('--r', (sg * R[a]) + 'deg');
      c.style.setProperty('--b', B[a]);
      c.style.setProperty('--o', O[a]);
      c.style.setProperty('--z', 10 - a);
      c.classList.toggle('is-on', d === 0);
      c.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
    });
    dots.forEach((b, k) => { if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  };
  // once the section is on screen, load the photos in view and the next ones round (the rest stay lazy until they come near)
  const preload = () => { if (!near) return; [i - 3, i - 2, i - 1, i, i + 1, i + 2, i + 3].forEach(k => { const im = cards[((k % N) + N) % N].querySelector('img'); if (im) im.loading = 'eager'; }); };
  const pinned = () => !!(sec && sec.classList.contains('cmp--run'));
  const running = () => auto && (pinned() ? raised : inView) && !held && !focus && !document.hidden;
  const restart = () => { clearTimeout(timer); if (running()) timer = setTimeout(() => go(i + 1), 3600); };
  const go = n => {
    const next = ((n % N) + N) % N;
    if (next !== i) {
      i = next; place();
      // the caption fades out and back in with the new text
      cap.classList.add('is-sw'); clearTimeout(cap._t);
      cap._t = setTimeout(() => { cap.textContent = cards[i].dataset.cap || ''; cap.classList.remove('is-sw'); }, auto ? 220 : 0);
    }
    preload(); restart();
  };
  const sync = () => { if (inView || raised) near = true; preload(); restart(); };

  gal.querySelector('.lg__nav--prev').addEventListener('click', () => go(i - 1));
  gal.querySelector('.lg__nav--next').addEventListener('click', () => go(i + 1));
  dots.forEach((b, k) => b.addEventListener('click', () => go(k)));
  cards.forEach((c, k) => c.querySelector('.lg__pick').addEventListener('click', () => { if (k !== i) go(k); }));
  gal.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { go(i - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { go(i + 1); e.preventDefault(); }
  });
  let sx = 0, sy = 0, on = false;
  stage.addEventListener('touchstart', e => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; on = true; }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (!on) return; on = false;
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) go(i + (dx < 0 ? 1 : -1));
  }, { passive: true });

  stage.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { held = true; restart(); } });
  stage.addEventListener('pointerleave', () => { held = false; restart(); });
  gal.addEventListener('focusin', () => { focus = true; restart(); });
  gal.addEventListener('focusout', e => { if (!gal.contains(e.relatedTarget)) { focus = false; restart(); } });
  document.addEventListener('visibilitychange', restart);
  new IntersectionObserver(es => { inView = es[0].isIntersecting; sync(); }, { threshold: .3 }).observe(stage);
  gal.addEventListener('lifegal', e => { raised = !!e.detail; sync(); });   // from js/story.js, in the pinned scene

  place();
})();
