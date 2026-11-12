/* Accordions (FAQ .qa, Toppers "More from CSE" .rs-yv-more): native <details> snap open and shut, so the height is animated here.
   Opening eases the panel to its full height and fades the answer in; closing eases it back to the summary, then closes it.
   In the FAQ only one answer is open at a time; the others close with the same motion. Works for details added later (delegated).
   Reduced motion: plain open/close. */
(() => {
  const SEL = 'details.qa, details.rs-yv-more';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubic-bezier(.2, .7, .2, 1)';
  const running = new WeakMap(), target = new WeakMap();

  const setOpen = (d, open) => {
    target.set(d, open);
    if (reduce || !d.animate) { d.open = open; return; }
    const from = d.getBoundingClientRect().height;      // includes a running animation's current height
    const prev = running.get(d); if (prev) prev.cancel();
    d.open = open;
    const to = d.getBoundingClientRect().height;         // the size it should settle at
    d.open = true;                                       // keep the content in place while it closes
    d.classList.toggle('is-closing', !open);
    d.style.overflow = 'hidden';
    const a = d.animate({ height: [from + 'px', to + 'px'] }, { duration: open ? 460 : 380, easing: EASE });
    running.set(d, a);
    if (open) {
      const body = d.querySelector(':scope > :not(summary)');
      if (body) body.animate({ opacity: [0, 1], transform: ['translateY(-8px)', 'none'] }, { duration: 420, delay: 90, easing: EASE, fill: 'backwards' });
    }
    a.onfinish = () => { running.delete(d); d.open = open; d.classList.remove('is-closing'); d.style.overflow = ''; };
    a.oncancel = () => { d.classList.remove('is-closing'); d.style.overflow = ''; };
  };

  document.addEventListener('click', e => {
    const s = e.target.closest('summary'); if (!s) return;
    const d = s.parentElement; if (!d || !d.matches(SEL)) return;
    e.preventDefault();
    const open = !(target.has(d) ? target.get(d) : d.open);
    if (open && d.matches('.qa')) {                      // FAQ: one answer at a time
      d.parentElement.querySelectorAll(':scope > details.qa').forEach(o => { if (o !== d && (target.has(o) ? target.get(o) : o.open)) setOpen(o, false); });
    }
    setOpen(d, open);
  });
})();
