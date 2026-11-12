/* Visit: the dotted India map (ported from /v5 ContactMap.tsx). Hovering, focusing or clicking a city's label, pin or card lights
   that city's pin, label and card while the pointer or focus is on it; nothing is selected by default. */
(() => {
  const panel = document.getElementById('cmPanel'); if (!panel) return;
  const parts = [...panel.querySelectorAll('[data-city]')];
  const on = city => parts.forEach(el => el.classList.toggle('is-on', el.dataset.city === city));
  const pick = e => { const el = e.target.closest('[data-city]'); if (el && panel.contains(el)) on(el.dataset.city); };
  panel.addEventListener('pointerover', pick);
  panel.addEventListener('focusin', pick);
  panel.addEventListener('click', pick);
  panel.addEventListener('pointerleave', () => on(null));
  panel.addEventListener('focusout', e => { if (!panel.contains(e.relatedTarget)) on(null); });
})();
