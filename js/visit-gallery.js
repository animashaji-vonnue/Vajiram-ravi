/* Contact us: the campus photos (#cmGal). No controls: the photos cross-fade on their own, one every 5 s, and the progress bar
   below fills one segment per photo (the fill is a CSS animation; its animationend moves to the next photo).
   Runs only while on screen, pauses while the pointer is over it, and stays on the first photo for prefers-reduced-motion. */
(() => {
  const gal = document.getElementById('cmGal'); if (!gal) return;
  const slides = [...gal.querySelectorAll('.cm__ph')], segs = [...gal.querySelectorAll('.cm__prog span')];
  if (slides.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let i = 0, seen = false, held = false;

  const show = n => {
    i = n % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('is-on', k === i); s.toggleAttribute('aria-hidden', k !== i); });
    segs.forEach((s, k) => { s.classList.remove('is-on'); s.classList.toggle('is-done', k < i); });
    void segs[i].offsetWidth;                       // restart the fill animation
    segs[i].classList.add('is-on');
  };
  const sync = () => gal.classList.toggle('is-paused', !seen || held);

  segs.forEach(s => s.addEventListener('animationend', () => show(i + 1)));
  gal.addEventListener('pointerenter', () => { held = true; sync(); });
  gal.addEventListener('pointerleave', () => { held = false; sync(); });
  new IntersectionObserver(es => { seen = es[0].isIntersecting; sync(); }, { threshold: .3 }).observe(gal);

  gal.classList.add('is-auto', 'is-paused');
})();
