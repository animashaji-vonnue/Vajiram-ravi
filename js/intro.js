/* v49 intro: the original logo reveal (iris, mandala ring, logo, tagline, curtain lifts) in brand orange. No video.
   Skip button, Esc or scrolling ends it. Fires 'vr:intro-done' and clears html.vrv-lock. */
(function () {
  'use strict';
  // plays on every load, reloads included (user 2026-11-11; it used to play once per browser session)
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var el = document.createElement('div');
  el.className = 'vrv';
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Vajiram & Ravi');
  el.innerHTML =
    '<div class="vrv__fin">' +
      '<span class="vrv__ring" aria-hidden="true"></span>' +
      '<div class="vrv__logo" role="img" aria-label="Vajiram &amp; Ravi, Institute for IAS Examination"><img class="lc" src="assets/img/brand/logo.png" alt="" width="966" height="227"><img class="lw" src="assets/img/brand/logo.png" alt="" width="966" height="227"></div>' +
      '<p class="vrv__tag"><span>Understanding India.</span> <span>Shaping its Future.</span></p>' +
    '</div>' +
    '<span class="vrv__bar" aria-hidden="true"></span>' +
    '<span class="vrv__edge" aria-hidden="true"></span>' +
    '<button class="vrv__skip" type="button">Skip intro</button>';
  document.body.insertBefore(el, document.body.firstChild);
  root.classList.add('vrv-lock');
  var done = false, t = 0;
  var finish = function () {
    if (done) return; done = true; clearTimeout(t);
    el.classList.add('vrv--out');
    setTimeout(function () { el.remove(); root.classList.remove('vrv-lock'); document.dispatchEvent(new CustomEvent('vr:intro-done')); }, reduce ? 420 : 850);
  };
  el.querySelector('.vrv__skip').addEventListener('click', finish);
  addEventListener('keydown', function k(e) { if (e.key === 'Escape') { removeEventListener('keydown', k); finish(); } });
  ['wheel', 'touchmove'].forEach(function (ev) { addEventListener(ev, finish, { passive: true, once: true }); });
  requestAnimationFrame(function () { el.classList.add('vrv--fin'); t = setTimeout(finish, reduce ? 1500 : 2500); });
})();
