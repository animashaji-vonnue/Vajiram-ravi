/* The CSE 2025 rank holders, after the team section on maven.com ("Learn from the best in the industry"), set in this
   page's newspaper layout: under the masthead, the headline and the deck (unchanged), a section strip ("The rank
   holders · CSE 2025"), then a reel of all the rank holders as newspaper
   photo clippings drifting slowly left (Maven's carousel), and under it the lead story.

   - A clipping: the portrait in newsprint tones (colour on hover or focus), the name and the programmes as its caption,
     and the rank on a serrated orange seal at the top left, as the educators' years of experience are stamped
     (js/faculty-ring.js): "AIR" over the number.
   - The reel loops on its own, slowly, and stops while the pointer is on it, when it can be dragged through. A round
     button over the hint under it stops and starts it; stopped, chevrons show on hover to step through it. Reduced
     motion: it starts stopped.
   - A dropdown in the strip chooses which rank holders the reel shows: all of them, or ranks 1 to 10.
   - Choosing a clipping makes it the lead story under the reel: its headline and two paragraphs, set in newspaper
     columns, as the earlier front page did.

   Data: window.NP_ARCHIVE (js/data/toppers-archive.js) and window.TOPPERS (js/data/toppers.js), CSE 2025 only.
   Styles: css/toppers-wall.css. This replaces the front page's photo, story and rank list (js/toppers.js, which
   now stands aside since its list is gone). */
(() => {
  const sec = document.getElementById('toppers'), data = window.NP_ARCHIVE, wall = document.getElementById('gzWall');
  if (!sec || !data || !wall) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ---------- the data, read as js/toppers.js reads it ---------- */
  const catOf = p => /interview|\bigp\b/i.test(p) ? 'igp'
    : /test series|\bcamp\b|\bflt\b/i.test(p) ? 'test'
    : /optional|sociology|history|mathematics|psir|public administration|commerce|anthropology|political science|geography|enrichment/i.test(p) ? 'opt'
    : 'gs';
  const tidyProg = p => p.replace(/^&\s*/, '').trim()
    .replace(/^IGP$/i, 'Interview Guidance Programme').replace(/\bIGP\b/g, 'Interview Guidance Programme')
    .replace(/Interview Guidance Program\b/gi, 'Interview Guidance Programme').replace(/Prelims Cum Mains/g, 'Prelims-cum-Mains');
  const splitProgs = s => (s || '').split(/,(?![^(]*\))|\s&\s/).map(tidyProg).filter(Boolean);
  const titleWord = w => /^[A-Z]{3,}$/.test(w) ? w[0] + w.slice(1).toLowerCase() : w;
  const tidyName = n => n.replace(/\s*-\s*Rank\s*\d+$/i, '').replace(/^[^A-Za-z]+|[^A-Za-z.]+$/g, '').replace(/\.$/, '').split(' ').map(titleWord).join(' ');
  const extra = {};
  (window.TOPPERS || []).forEach(t => { if (t.c) extra[t.y + '-' + t.r] = t.c; });
  const YEAR = (data.ARCHIVE_YEARS || []).includes(2025) ? 2025 : Math.max(...data.ARCHIVE_YEARS);
  const list = (data.ARCHIVE[YEAR] || []).slice().sort((a, b) => a.rank - b.rank).map((t, i) => {
    const progs = splitProgs(t.programmes || extra[YEAR + '-' + t.rank]).map(name => ({ name, cat: catOf(name) }));
    return { key: i, rank: t.rank, name: tidyName(t.name), img: t.photo || t.img, progs, cats: [...new Set(progs.map(p => p.cat))] };
  });
  /* ---------- words, for the lead story ---------- */
  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const words = n => (n <= 10 ? ONES[n] : String(n));
  const join = a => (a.length < 2 ? a[0] : a.slice(0, -1).join(', the ') + ' and the ' + a[a.length - 1]);
  const progList = t => join(t.progs.map(p => esc(p.name)));
  const stats = {
    top10: list.filter(t => t.rank <= 10).length,
    igp10: list.filter(t => t.rank <= 10 && t.cats.includes('igp')).length,
    n50: list.filter(t => t.rank <= 50).length,
  };

  /* ---------- the seal: version 6's experience stamp, carrying the rank ---------- */
  const SEAL_EDGE = (() => {
    const teeth = 24, pts = [];
    for (let i = 0; i < teeth * 2; i++) {
      const r = i % 2 ? 27.4 : 29, a = (i / (teeth * 2)) * Math.PI * 2 - Math.PI / 2;
      pts.push(`${(29 + r * Math.cos(a)).toFixed(2)},${(29 + r * Math.sin(a)).toFixed(2)}`);
    }
    return `M${pts.join('L')}Z`;
  })();
  const seal = rank => `<span class="gzw__seal" aria-hidden="true"><svg viewBox="0 0 58 58" width="58" height="58"><path d="${SEAL_EDGE}"/><circle cx="29" cy="29" r="22.5"/></svg><span><small>AIR</small><b>${rank}</b></span></span>`;

  /* ---------- which rank holders the reel shows (the dropdown in the strip) ---------- */
  // Named by rank, not by count (the 36 rank holders hold ranks up to AIR 48, with gaps).
  const RANGES = [
    { label: 'Rank : All', test: () => true },
    { label: 'Rank : 1 - 10', test: t => t.rank <= 10 },
  ];

  /* ---------- build ---------- */
  const deck = document.getElementById('gzDeck');
  if (deck) deck.innerHTML = `The UPSC CSE ${YEAR} top-ten rank holders were associated with Vajiram &amp; Ravi through different programmes, from General Studies preparation and test series to interview guidance.`;

  wall.innerHTML = `
    <div class="gzw__head">
      <h3 class="gzw__kick">The rank holders <span>· CSE ${YEAR}</span></h3>
      <label class="gzw__range"><span class="sr-only">Show</span><select aria-label="Which rank holders to show">${RANGES.map((r, i) => `<option value="${i}">${r.label}</option>`).join('')}</select></label>
    </div>
    <div class="gzw__stage" role="region" aria-roledescription="carousel" aria-label="CSE ${YEAR} rank holders">
      <div class="gzw__reel"><div class="gzw__track"></div></div>
      <button type="button" class="gzw__chev gzw__chev--prev" aria-label="Previous rank holders" tabindex="-1"><svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M16 10H4m5-5-5 5 5 5"/></svg></button>
      <button type="button" class="gzw__chev gzw__chev--next" aria-label="Next rank holders" tabindex="-1"><svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5"/></svg></button>
    </div>
    <div class="gzw__ctl">
      <button type="button" class="gzw__play" aria-pressed="false" aria-label="Pause the rank holders"><span class="gzw__play-i" aria-hidden="true"></span></button>
      <p class="gzw__hint">Choose a rank holder to read their story.</p>
    </div>
    <article class="gzw__story" aria-live="polite">
      <div class="gzw__by">${seal(1)}<p><b></b><span></span></p></div>
      <div class="gzw__text"><h3 class="gz__sub"></h3><div class="gz__cols"></div></div>
    </article>`;
  const stage = wall.querySelector('.gzw__stage'), reel = wall.querySelector('.gzw__reel'), track = wall.querySelector('.gzw__track');
  const playBtn = wall.querySelector('.gzw__play'), [prevBtn, nextBtn] = wall.querySelectorAll('.gzw__chev'), rangeSel = wall.querySelector('.gzw__range select');
  const story = wall.querySelector('.gzw__story');

  const card = (t, copy) => `<article class="gzw__card${t.rank === 1 ? ' is-first' : ''}" data-key="${t.key}"${copy ? ' aria-hidden="true"' : ''}>
      <button type="button" class="gzw__pick"${copy ? ' tabindex="-1"' : ''} aria-label="${esc(t.name)}, All India Rank ${t.rank}: read the story">
        <span class="gzw__ph"><img src="${esc(t.img)}" alt="" loading="lazy" decoding="async"></span>
        ${seal(t.rank)}
        <span class="gzw__cap"><b class="gzw__nm">${esc(t.name)}</b>${t.progs.length ? `<span class="gzw__pg">${t.progs.map(p => esc(p.name)).join(' · ')}</span>` : ''}</span>
      </button>
    </article>`;

  /* ---------- the lead story ---------- */
  let current = list[0];
  const tell = t => {
    current = t;
    wall.querySelectorAll('.gzw__card').forEach(c => c.classList.toggle('is-on', +c.dataset.key === t.key));
    const first = t === list[0], n = t.progs.length;
    story.querySelector('.gzw__seal').outerHTML = seal(t.rank);
    story.querySelector('.gzw__by p b').textContent = t.name;
    story.querySelector('.gzw__by p span').textContent = n ? `Prepared with ${t.progs.map(p => p.name).join(', ')}` : `CSE ${YEAR}`;
    story.querySelector('.gz__sub').innerHTML = first && stats.igp10 > 1
      ? `${esc(t.name)} heads the list; ${words(stats.igp10)} of the top ten were associated with the Interview Guidance Programme`
      : first ? `${esc(t.name)} heads the list in the Civil Services Examination ${YEAR}`
      : `${esc(t.name)} secures All India Rank ${t.rank} in the Civil Services Examination ${YEAR}`;
    const paras = [n
      ? `${esc(t.name)}, All India Rank ${t.rank} in the Civil Services Examination ${YEAR}, was associated with Vajiram &amp; Ravi through the ${progList(t)}.`
      : `${esc(t.name)}, All India Rank ${t.rank} in the Civil Services Examination ${YEAR}, is among the rank holders who prepared with Vajiram &amp; Ravi.`];
    if (first) {
      const next = list.slice(1, 3).filter(x => x.progs.length);
      if (next.length) paras.push(next.map(x => `${esc(x.name)}, AIR ${x.rank}, was associated with the ${progList(x)}.`).join(' '));
    } else if (t.cats.includes('igp')) paras.push('The Interview Guidance Programme prepares candidates for the Personality Test, the final stage of the examination.');
    else if (t.rank <= 10 && stats.top10 > 1) paras.push(`${esc(t.name)} is one of ${words(stats.top10)} rank holders in the top ten of CSE ${YEAR} who prepared with Vajiram &amp; Ravi.`);
    if (stats.n50 > 1) paras.push(`${stats.n50} of the top 50 ranks in CSE ${YEAR} prepared with Vajiram &amp; Ravi.`);
    story.querySelector('.gz__cols').innerHTML = paras.map(p => `<p>${p}</p>`).join('');
  };

  /* ---------- the reel ----------
     Its position is kept here (x, in px, the track's shift left), so the drift, a drag and the chevrons all move the
     same strip. Two sets of clippings stand one after the other; x wraps within one set's width, so it loops without
     a seam.
     - It drifts while playing, except while the pointer is over it, while it is dragged, or while it is off screen.
     - Under the pointer it can be dragged (mouse or finger); a drag is not a click on a clipping.
     - The round button over the hint stops and starts it. Stopped, hovering it shows the chevrons, which move it one
       clipping at a time, coming to rest square on one. Reduced motion: it starts stopped. */
  const PX_PER_S = 38;   // its drift: slow, as Maven's
  let shown = list;
  let x = 0, period = 0, step = 236, playing = !reduce, hover = false, onScreen = true, drag = null, glide = null, swallow = false, last = 0;
  const wrap = v => (period ? ((v % period) + period) % period : 0);
  const apply = () => { track.style.transform = `translate3d(${(-wrap(x)).toFixed(2)}px, 0, 0)`; };

  const fill = () => {
    track.innerHTML = shown.map(t => card(t, false)).join('') + shown.map(t => card(t, true)).join('');
    const cards = track.children;
    period = cards[shown.length].offsetLeft - cards[0].offsetLeft;
    step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 236;
    wall.querySelectorAll('.gzw__card').forEach(c => c.classList.toggle('is-on', +c.dataset.key === current.key));
    apply();
  };

  const ease = u => 1 - Math.pow(1 - u, 3);
  const tick = time => {
    const dt = last ? Math.min(0.05, (time - last) / 1000) : 0;
    last = time;
    if (glide) {
      const u = Math.min(1, (time - glide.t0) / glide.ms);
      x = glide.from + (glide.to - glide.from) * ease(u);
      if (u >= 1) glide = null;
    } else if (playing && !hover && !drag && onScreen && !document.hidden) {
      x += PX_PER_S * dt;
    }
    apply();
    requestAnimationFrame(tick);
  };

  // Stop and start.
  const setPlaying = on => {
    playing = on;
    stage.classList.toggle('is-stopped', !on);
    playBtn.setAttribute('aria-pressed', String(!on));
    playBtn.setAttribute('aria-label', on ? 'Pause the rank holders' : 'Play the rank holders');
    [prevBtn, nextBtn].forEach(b => { b.tabIndex = on ? -1 : 0; b.setAttribute('aria-hidden', String(on)); });
  };
  playBtn.addEventListener('click', () => setPlaying(!playing));

  // The dropdown: all the rank holders, or ranks 1 to 10; the reel starts again from the first.
  rangeSel.addEventListener('change', () => {
    shown = list.filter(RANGES[+rangeSel.value].test);
    reel.classList.add('is-swapping');
    setTimeout(() => { x = 0; glide = null; fill(); reel.classList.remove('is-swapping'); }, reduce ? 0 : 180);
  });

  // The chevrons: one clipping at a time, coming to rest square on one.
  const go = dir => {
    const from = glide ? glide.to : x;
    const to = Math.round(from / step) * step + dir * step;
    glide = { from: x, to, t0: performance.now(), ms: reduce ? 1 : 520 };
  };
  prevBtn.addEventListener('click', () => go(-1));
  nextBtn.addEventListener('click', () => go(1));
  stage.addEventListener('keydown', e => {
    if (playing) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });

  // Hover holds it still (a mouse only: a finger's tap is not a hover).
  stage.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hover = true; });
  stage.addEventListener('pointerleave', () => { hover = false; });

  // Drag.
  reel.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, from: x, moved: false };
    glide = null;
    swallow = false;
  });
  reel.addEventListener('pointermove', e => {
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.moved) {
      if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) { drag.moved = true; reel.setPointerCapture(e.pointerId); reel.classList.add('is-grabbing'); }
      else { if (Math.abs(dy) > 10) drag = null; return; }
    }
    x = drag.from - dx;
  });
  const endDrag = () => {
    if (!drag) return;
    if (drag.moved) swallow = true;
    drag = null;
    reel.classList.remove('is-grabbing');
  };
  reel.addEventListener('pointerup', endDrag);
  reel.addEventListener('pointercancel', endDrag);

  // A clipping chosen (not one let go after a drag) becomes the lead story.
  track.addEventListener('click', e => {
    if (swallow) { swallow = false; e.preventDefault(); e.stopPropagation(); return; }
    const c = e.target.closest('.gzw__card'); if (!c) return;
    tell(list[+c.dataset.key]);
    if (innerWidth < 900) story.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  }, true);

  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }).observe(stage);
  let rz = 0;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(fill, 200); });

  setPlaying(playing);
  requestAnimationFrame(tick);
  fill();
  tell(list[0]);
})();
