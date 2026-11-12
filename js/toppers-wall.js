/* The CSE 2025 rank holders, after the team section on maven.com ("Learn from the best in the industry"), set in this
   page's newspaper layout: under the masthead, the headline and the deck (unchanged), a section strip ("The rank
   holders · CSE 2025") with tabs for the programmes they prepared with, then a reel of the rank holders as newspaper
   photo clippings drifting slowly left (Maven's carousel), and under it the lead story.

   - A clipping: the portrait in newsprint tones (colour on hover or focus), the name and the programmes as its caption,
     and the rank on a serrated orange seal at the top left, as the educators' years of experience are stamped
     (js/faculty-ring.js): "AIR" over the number.
   - The reel loops on its own, slowly, and stops while the pointer or keyboard focus is on it; with too few clippings
     to fill it (a narrow tab) it stands still, centred. Reduced motion: it stands still and scrolls sideways by hand.
   - A tab (All, Interview Guidance, Test series, General Studies, Optional, each with its count) shows just the rank
     holders who prepared with that kind of programme.
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
  const TABS = [
    { cat: 'all', label: 'All' },
    { cat: 'igp', label: 'Interview Guidance' },
    { cat: 'test', label: 'Test series' },
    { cat: 'gs', label: 'General Studies' },
    { cat: 'opt', label: 'Optional' },
  ].map(t => ({ ...t, n: t.cat === 'all' ? list.length : list.filter(x => x.cats.includes(t.cat)).length })).filter(t => t.n);

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

  /* ---------- build ---------- */
  const deck = document.getElementById('gzDeck');
  if (deck) deck.innerHTML = `The UPSC CSE ${YEAR} top-ten rank holders were associated with Vajiram &amp; Ravi through different programmes, from General Studies preparation and test series to interview guidance.`;

  wall.innerHTML = `
    <div class="gzw__head">
      <h3 class="gzw__kick">The rank holders <span>· CSE ${YEAR}</span></h3>
      <div class="gzw__tabs" role="group" aria-label="Show the rank holders by the programme they prepared with">
        ${TABS.map((t, i) => `<button type="button" class="gzw__tab" data-cat="${t.cat}" aria-pressed="${!i}">${t.label}<small>${t.n}</small></button>`).join('')}
      </div>
    </div>
    <div class="gzw__reel" role="region" aria-roledescription="carousel" aria-label="CSE ${YEAR} rank holders">
      <div class="gzw__track"></div>
    </div>
    <p class="gzw__hint">Choose a rank holder to read their story.</p>
    <article class="gzw__story" aria-live="polite">
      <div class="gzw__by">${seal(1)}<p><b></b><span></span></p></div>
      <div class="gzw__text"><h3 class="gz__sub"></h3><div class="gz__cols"></div></div>
    </article>`;
  const reel = wall.querySelector('.gzw__reel'), track = wall.querySelector('.gzw__track');
  const tabs = [...wall.querySelectorAll('.gzw__tab')];
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

  /* ---------- the reel ---------- */
  const PX_PER_S = 38;   // its drift: slow, as Maven's
  let shown = list;
  const fill = () => {
    track.style.animation = 'none';
    track.innerHTML = shown.map(t => card(t, false)).join('');
    const one = track.scrollWidth;
    const loop = !reduce && one > reel.clientWidth * 1.05;
    reel.classList.toggle('is-still', !loop);
    reel.classList.toggle('is-manual', reduce);
    if (loop) {
      // A second set straight after the first, so the drift loops without a seam.
      track.insertAdjacentHTML('beforeend', shown.map(t => card(t, true)).join(''));
      const half = track.scrollWidth / 2;
      track.style.setProperty('--gzw-shift', `-${half}px`);
      track.style.animation = `gzw-drift ${(half / PX_PER_S).toFixed(1)}s linear infinite`;
    }
    wall.querySelectorAll('.gzw__card').forEach(c => c.classList.toggle('is-on', +c.dataset.key === current.key));
  };

  tabs.forEach(b => b.addEventListener('click', () => {
    if (b.getAttribute('aria-pressed') === 'true') return;
    tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const cat = b.dataset.cat;
    shown = cat === 'all' ? list : list.filter(t => t.cats.includes(cat));
    reel.classList.add('is-swapping');
    setTimeout(() => { fill(); reel.classList.remove('is-swapping'); }, reduce ? 0 : 180);
  }));
  track.addEventListener('click', e => {
    const c = e.target.closest('.gzw__card'); if (!c) return;
    tell(list[+c.dataset.key]);
    if (innerWidth < 900) story.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  });
  let rz = 0;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(fill, 200); });

  fill();
  tell(list[0]);
})();
