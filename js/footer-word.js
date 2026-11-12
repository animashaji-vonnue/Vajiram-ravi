/* Footer wordmark "Vajiram&Ravi" (user 2026-11-10: "should reveal only on scroll"): hidden until it scrolls into view, then the letters
   rise in one after another (once). Each letter is wrapped in <i class="fw-c" style="--i:n">; the "&" span is one letter.
   Without JS, or with reduced motion, the wordmark simply shows. Styles: css/v49.css "footer wordmark reveal". */
(() => {
  const w = document.querySelector('.foot__word');
  if (!w || matchMedia('(prefers-reduced-motion: reduce)').matches || false) return;
  let i = 0;
  const wrap = node => {
    if (node.nodeType === 3) {
      const frag = document.createDocumentFragment();
      [...node.textContent].forEach(ch => { const c = document.createElement('i'); c.className = 'fw-c'; c.style.setProperty('--i', i++); c.textContent = ch; frag.append(c); });
      node.replaceWith(frag);
    } else if (node.nodeType === 1) {           // the "&" span: animate it as one letter, keep its own colour
      node.classList.add('fw-c'); node.style.setProperty('--i', i++);
    }
  };
  [...w.childNodes].forEach(wrap);
  w.classList.add('fw-ready');
  // reveal when the page uncovers the wordmark: with the curtain footer the footer sits behind the page from the start, so "in the
  // viewport" is not enough; the trigger is the bottom of <main> (the curtain's edge) passing 35% down the wordmark
  const main = document.querySelector('main');
  let tick = false;
  const check = () => {
    tick = false;
    const r = w.getBoundingClientRect(), edge = Math.min(innerHeight, main ? main.getBoundingClientRect().bottom : innerHeight);
    // uncovered: the page's bottom edge (or the viewport bottom) has passed above the word's lower 65%, and the word is on screen
    const edgeNow = main ? main.getBoundingClientRect().bottom : -Infinity;
    if (r.top < innerHeight && r.bottom > 0 && edgeNow < r.bottom - r.height * .35 && r.top + r.height * .35 < innerHeight) { w.classList.add('fw-in'); removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); }
  };
  const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(check); } };
  addEventListener('scroll', onScroll, { passive: true }); check();
  // a reload at the footer: the browser restores the scroll position after this script ran and fires no scroll event, so the word stayed
  // hidden; check again once the page has loaded (and restored), when it is shown from the back/forward cache, and on resize
  addEventListener('load', () => requestAnimationFrame(check));
  addEventListener('pageshow', () => requestAnimationFrame(check));
  addEventListener('resize', onScroll, { passive: true });
})();
