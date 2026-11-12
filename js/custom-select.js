/* Custom select (user 2026-11-11: replace the browser dropdown for "pick a programme" with one in the site's style).
   window.enhanceSelect(select) puts a styled combobox in front of a native <select> and keeps the <select> as the source of truth:
   it stays in the form (hidden from view and from assistive tech), so FormData, `required` validation and any code that sets
   select.value keep working. Dispatch a 'change' on the select after setting its value in script and the combobox follows.

   Pattern: WAI-ARIA APG "select-only combobox". The combobox keeps focus; the open list is pointed at with aria-activedescendant.
   Keys, closed: Down / Up / Enter / Space / Alt+Down open (on the current option, or the first); Home / End open on the first / last;
   typing letters opens and jumps to the next option starting with them.
   Keys, open: Down / Up move, Home / End, PageDown / PageUp (8 at a time), Enter / Space / Alt+Up choose and close, Esc closes
   without changing, Tab closes, typing jumps. Mouse/touch: click an option to choose; click outside closes.
   The list is attached to <body> (sections clip their overflow) and placed under the field with position: fixed, flipping above
   when there is no room below; it follows the field while the page scrolls. Styles: end of css/v49.css (.cs). */
(() => {
  let uid = 0;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.enhanceSelect = select => {
    if (!select || select._cs) return select && select._cs;
    const id = 'cs' + (++uid);
    const box = document.createElement('span');
    box.className = 'cs';
    box.innerHTML = `<span class="cs__btn" role="combobox" tabindex="0" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}-list">`
      + `<span class="cs__val"></span><span class="cs__chev" aria-hidden="true"></span></span>`;
    const btn = box.firstChild, val = btn.querySelector('.cs__val');
    btn.setAttribute('aria-label', select.getAttribute('aria-label') || select.name || 'Choose');
    if (select.required) btn.setAttribute('aria-required', 'true');
    select.after(box);
    select.classList.add('cs__native'); select.tabIndex = -1; select.setAttribute('aria-hidden', 'true');

    const list = document.createElement('div');
    list.className = 'cs__list'; list.id = id + '-list'; list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', btn.getAttribute('aria-label')); list.hidden = true;
    list.setAttribute('data-lenis-prevent', '');   // the site's Lenis smooth scroll takes the wheel/touch otherwise, and the list would not scroll
    document.body.append(list);

    let opts = [], active = -1, open = false, typed = '', typedT = 0, raf = 0;

    // the list is rebuilt from the <select> each time it opens, so options added later (e.g. from a "choose this programme" link) appear
    const build = () => {
      let html = '', n = 0;
      const optHTML = o => {
        if (o.value === '') return '';   // the placeholder ("pick a programme") is not a choice
        const i = n++, sel = o.value === select.value;
        return `<div class="cs__opt${sel ? ' is-sel' : ''}" role="option" id="${id}-o${i}" data-i="${i}" aria-selected="${sel}">`
          + `<span>${o.textContent.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))}</span></div>`;
      };
      [...select.children].forEach((c, g) => {
        if (c.tagName === 'OPTGROUP') {
          html += `<div class="cs__grp" role="group" aria-labelledby="${id}-g${g}"><div class="cs__grp-h" id="${id}-g${g}" role="presentation">${c.label.replace(/[&<>"]/g, '')}</div>`
            + [...c.children].map(optHTML).join('') + '</div>';
        } else html += optHTML(c);
      });
      list.innerHTML = html;
      opts = [...list.querySelectorAll('[role="option"]')];
      const real = [...select.options].filter(o => o.value !== '');
      opts.forEach((el, i) => { el._opt = real[i]; });
    };
    const sync = () => {
      const o = select.options[select.selectedIndex];
      const empty = !o || o.value === '';
      val.textContent = o ? o.textContent : '';
      box.classList.toggle('is-empty', empty);
      btn.title = empty ? '' : val.textContent;
    };
    const setActive = (i, scroll = true) => {
      if (!opts.length) return;
      i = Math.max(0, Math.min(opts.length - 1, i));
      if (opts[active]) opts[active].classList.remove('is-act');
      active = i; opts[i].classList.add('is-act');
      btn.setAttribute('aria-activedescendant', opts[i].id);
      if (scroll) opts[i].scrollIntoView({ block: 'nearest' });
    };
    const place = () => {
      const r = btn.getBoundingClientRect(), vw = innerWidth, vh = innerHeight;
      const w = Math.min(Math.max(r.width, 300), 420, vw - 24);
      const left = Math.min(Math.max(12, r.left), vw - w - 12);
      const below = vh - r.bottom - 12, above = r.top - 12, want = Math.min(list.scrollHeight, 340);
      const up = below < Math.min(want, 220) && above > below;
      list.style.width = w + 'px'; list.style.left = left + 'px';
      list.style.maxHeight = Math.max(160, Math.min(340, up ? above - 6 : below - 6)) + 'px';
      if (up) { list.style.top = ''; list.style.bottom = (vh - r.top + 6) + 'px'; }
      else { list.style.bottom = ''; list.style.top = (r.bottom + 6) + 'px'; }
      list.classList.toggle('is-up', up);
      // closes if the field has scrolled out of view
      if (r.bottom < 0 || r.top > vh) close();
    };
    const follow = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(place); };
    const openList = at => {
      if (open) return;
      build(); open = true;
      list.hidden = false; place();
      btn.setAttribute('aria-expanded', 'true'); box.classList.add('is-open');
      void list.offsetWidth; list.classList.add('is-in');
      const cur = select.value === '' ? -1 : opts.findIndex(el => el._opt.value === select.value);
      setActive(at === 'last' ? opts.length - 1 : at === 'first' ? 0 : cur > -1 ? cur : 0);
      if (cur > -1 && at == null) opts[cur].scrollIntoView({ block: 'center' });
      addEventListener('scroll', follow, true); addEventListener('resize', follow);
      document.addEventListener('pointerdown', outside, true);
    };
    const close = () => {
      if (!open) return;
      open = false; btn.setAttribute('aria-expanded', 'false'); btn.removeAttribute('aria-activedescendant');
      box.classList.remove('is-open'); list.classList.remove('is-in');
      removeEventListener('scroll', follow, true); removeEventListener('resize', follow);
      document.removeEventListener('pointerdown', outside, true);
      if (reduce) list.hidden = true; else setTimeout(() => { if (!open) list.hidden = true; }, 160);
    };
    const choose = i => {
      const o = opts[i] && opts[i]._opt; if (!o) return;
      if (select.value !== o.value) { select.value = o.value; select.dispatchEvent(new Event('change', { bubbles: true })); }
      select.removeAttribute('aria-invalid'); btn.removeAttribute('aria-invalid');
      sync(); close(); btn.focus();
    };
    const outside = e => { if (!box.contains(e.target) && !list.contains(e.target)) close(); };
    const typeahead = ch => {
      clearTimeout(typedT); typed += ch.toLowerCase(); typedT = setTimeout(() => { typed = ''; }, 600);
      const n = opts.length, from = typed.length === 1 ? active + 1 : Math.max(active, 0);
      for (let k = 0; k < n; k++) {
        const i = (from + k) % n;
        if (opts[i].textContent.trim().toLowerCase().startsWith(typed)) { setActive(i); return; }
      }
    };

    btn.addEventListener('click', () => (open ? close() : openList()));
    btn.addEventListener('keydown', e => {
      const k = e.key;
      if (!open) {
        if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') { e.preventDefault(); openList(); return; }
        if (k === 'Home') { e.preventDefault(); openList('first'); return; }
        if (k === 'End') { e.preventDefault(); openList('last'); return; }
        if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && k !== ' ') { openList(); typeahead(k); }
        return;
      }
      if (k === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (k === 'ArrowUp' && e.altKey) { e.preventDefault(); choose(active); }
      else if (k === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (k === 'Home') { e.preventDefault(); setActive(0); }
      else if (k === 'End') { e.preventDefault(); setActive(opts.length - 1); }
      else if (k === 'PageDown') { e.preventDefault(); setActive(active + 8); }
      else if (k === 'PageUp') { e.preventDefault(); setActive(active - 8); }
      else if (k === 'Enter' || (k === ' ' && !typed)) { e.preventDefault(); choose(active); }
      else if (k === 'Escape') { e.preventDefault(); close(); }
      else if (k === 'Tab') close();
      else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); typeahead(k); }
    });
    btn.addEventListener('blur', e => { if (open && !list.contains(e.relatedTarget)) setTimeout(() => { if (document.activeElement !== btn) close(); }, 0); });
    list.addEventListener('pointerdown', e => e.preventDefault());   // keep focus on the combobox
    list.addEventListener('click', e => { const o = e.target.closest('[role="option"]'); if (o) choose(+o.dataset.i); });
    list.addEventListener('pointermove', e => { const o = e.target.closest('[role="option"]'); if (o && +o.dataset.i !== active) setActive(+o.dataset.i, false); });
    select.addEventListener('change', sync);
    // the form's validation focuses the field it flags; send that to the combobox and mirror aria-invalid
    select.focus = () => btn.focus();
    new MutationObserver(() => {
      const bad = select.getAttribute('aria-invalid');
      if (bad) btn.setAttribute('aria-invalid', bad); else btn.removeAttribute('aria-invalid');
    }).observe(select, { attributes: true, attributeFilter: ['aria-invalid'] });
    sync();
    select._cs = { btn, list, sync, close };
    return select._cs;
  };
})();
