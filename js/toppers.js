/* Toppers: a results-special newspaper front page (masthead removed 2026-11-11) (layout and behaviour after vajiram-ravi-homepage.vercel.app #results).
   Everything below the masthead is written from data, so adding a year, a rank holder or a programme is a data change only:
   - window.NP_ARCHIVE (js/data/toppers-archive.js): years, and per year {rank, name, programmes, photo (colour), img (b/w fallback)}
   - window.TOPPERS    (js/data/toppers.js): programme names for anyone the archive lists without them
   The roll shows the first ten (ranks 1 to 10), with "Show all" for the rest; shared ranks are fine (each entry has its own key).
   Selecting a rank holder brings them to the lead story; the filters dim the others and mark the matching programme. */
(() => {
  const sec = document.getElementById('toppers'), data = window.NP_ARCHIVE;
  if (!sec || !data || !document.getElementById('gzTen')) return;
  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ---------- data ---------- */
  const NAME = { igp: 'the Interview Guidance Programme', test: 'a test series', gs: 'a General Studies programme or module', opt: 'an optional subject course' };
  const catOf = p => /interview|\bigp\b/i.test(p) ? 'igp'
    : /test series|\bcamp\b|\bflt\b/i.test(p) ? 'test'
    : /optional|sociology|history|mathematics|psir|public administration|commerce|anthropology|political science|geography|enrichment/i.test(p) ? 'opt'
    : 'gs';
  const tidyProg = p => p.replace(/^&\s*/, '').trim()
    .replace(/^IGP$/i, 'Interview Guidance Programme').replace(/\bIGP\b/g, 'Interview Guidance Programme')
    .replace(/Interview Guidance Program\b/gi, 'Interview Guidance Programme')
    .replace(/Prelims Cum Mains/g, 'Prelims-cum-Mains');
  const splitProgs = s => (s || '').split(/,(?![^(]*\))|\s&\s/).map(tidyProg).filter(Boolean);
  const titleWord = w => /^[A-Z]{3,}$/.test(w) ? w[0] + w.slice(1).toLowerCase() : w;
  const tidyName = n => n.replace(/\s*-\s*Rank\s*\d+$/i, '').replace(/^[^A-Za-z]+|[^A-Za-z.]+$/g, '').replace(/\.$/, '').split(' ').map(titleWord).join(' ');
  const extra = {};   // programme names from js/data/toppers.js, keyed year-rank
  (window.TOPPERS || []).forEach(t => { if (t.c) extra[t.y + '-' + t.r] = t.c; });

  const YEARS = data.ARCHIVE_YEARS.slice().sort((a, b) => b - a);
  const SHOW = YEARS.includes(2025) ? 2025 : YEARS[0];   // only CSE 2025 is shown for now (user 2026-11-11); the year picker is gone, other years stay in the data
  const yearList = y => (data.ARCHIVE[y] || []).slice().sort((a, b) => a.rank - b.rank).map((t, i) => {
    const progs = splitProgs(t.programmes || extra[y + '-' + t.rank]).map(name => ({ name, cat: catOf(name) }));
    return { key: y + '-' + i, y, rank: t.rank, name: tidyName(t.name), img: t.photo || t.img, progs, cats: [...new Set(progs.map(p => p.cat))] };
  });

  /* ---------- words ---------- */
  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const words = n => n < 20 ? ONES[n] : n < 100 ? TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '') : String(n);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const join = a => a.length < 2 ? a[0] : a.slice(0, -1).join(', the ') + ' and the ' + a[a.length - 1];
  const progList = t => join(t.progs.map(p => esc(p.name)));

  /* ---------- elements ---------- */
  const yearSel = $('gzYear'), kickB = $('gzKick'), deck = $('gzDeck'), lead = $('gzLead');
  const img = $('gzImg'), seal = $('gzSeal'), sub = $('gzSub'), cols = $('gzCols'), progsEl = $('gzProgs');
  const scroller = $('gzScroll');   // the rank-holder column scrolls on its own on wide screens
  const ten = $('gzTen'), tabs = [...sec.querySelectorAll('.gz__tab')], count = $('gzCount'), say = $('gzSay'), allBtn = $('gzAll'), rollH = $('gzRollH');
  if (yearSel) yearSel.innerHTML = YEARS.map(y => `<option value="${y}">${y}</option>`).join('');

  let list = [], year = SHOW, current = null, cat = 'all', expanded = false, stats = {};

  /* ---------- the lead story ---------- */
  const fill = (t, withImg) => {
    const first = t === list[0];
    if (withImg) { img.src = t.img; img.alt = `${t.name}, All India Rank ${t.rank} in the Civil Services Examination ${t.y}`; }
    seal.innerHTML = `<s>CSE ${t.y}</s><span class="gz__air"><i>AIR</i><b>${t.rank}</b></span>`;
    const n = t.progs.length;
    // the programmes this rank holder prepared with, as labels across the foot of the photo (user 2026-11-11); none recorded: no strip
    if (progsEl) { progsEl.innerHTML = n ? `<small>Prepared with</small>${t.progs.map(p => `<span>${esc(p.name)}</span>`).join('')}` : ''; progsEl.hidden = !n; }
    // kept short (user 2026-11-11, "more minimal"): the headline, two paragraphs on this rank holder and one line on the year
    const paras = [];
    if (first && stats.igp10 > 1) sub.innerHTML = `${esc(t.name)} heads the list; ${words(stats.igp10)} of the top ten were associated with the Interview Guidance Programme`;
    else if (first) sub.innerHTML = `${esc(t.name)} heads the list in the Civil Services Examination ${t.y}`;
    else sub.innerHTML = `${esc(t.name)} secures All India Rank ${t.rank} in the Civil Services Examination ${t.y}`;
    paras.push(n ? `${esc(t.name)}, All India Rank ${t.rank} in the Civil Services Examination ${t.y}, was associated with Vajiram &amp; Ravi through the ${progList(t)}.`
                 : `${esc(t.name)}, All India Rank ${t.rank} in the Civil Services Examination ${t.y}, is among the rank holders who prepared with Vajiram &amp; Ravi.`);
    // a second paragraph to fill the column (user 2026-11-11): AIR 1 names the next two rank holders; others get a line on the
    // Interview Guidance Programme or, failing that, on their place in the top ten
    if (first) {
      const next = list.slice(1, 3).filter(x => x.progs.length);
      if (next.length) paras.push(next.map(x => `${esc(x.name)}, AIR ${x.rank}, was associated with the ${progList(x)}.`).join(' '));
    } else if (t.cats.includes('igp')) paras.push('The Interview Guidance Programme prepares candidates for the Personality Test, the final stage of the examination.');
    else if (t.rank <= 10 && stats.top10 > 1) paras.push(`${esc(t.name)} is one of ${words(stats.top10)} rank holders in the top ten of CSE ${t.y} who prepared with Vajiram &amp; Ravi.`);
    if (stats.n50 > 1) paras.push(`${stats.n50} of the top 50 ranks in CSE ${t.y} prepared with Vajiram &amp; Ravi.`);
    cols.innerHTML = paras.map(p => `<p>${p}</p>`).join('');
  };
  // the story box takes the height of the longest story in the year, so selecting a rank holder never moves the page below
  const sizeLead = () => {
    lead.style.minHeight = '';
    let h = 0;
    list.forEach(t => { fill(t, false); h = Math.max(h, lead.offsetHeight); });
    fill(current, false);
    lead.style.minHeight = h + 'px';
  };

  /* ---------- the roll ---------- */
  const firstTen = () => { const top = list.filter(t => t.rank <= 10); return top.length ? top : list.slice(0, 10); };
  const card = (t, i, isExtra) => `<li class="gz__tp${isExtra ? ' is-extra' : ''}${t.rank === 1 ? ' is-first' : ''}" data-key="${t.key}" data-cats="${t.cats.join(' ')}" style="--i:${Math.min(i, 9)}"${isExtra && !expanded ? ' hidden' : ''}>
      <button class="gz__pick" type="button" aria-pressed="false" aria-controls="gzLead">
        <span class="gz__mug" aria-hidden="true"><img src="${esc(t.img)}" alt="" width="360" height="450" loading="lazy" decoding="async"></span>
        <span class="gz__txt"><span class="gz__rk"><small>AIR</small>${t.rank}</span><b class="gz__nm">${esc(t.name)}</b>${t.progs.length
          ? `<span class="gz__pg">${t.progs.map(p => `<span data-gz-cat="${p.cat}">${esc(p.name)}</span>`).join(' <i aria-hidden="true">&middot;</i> ')}</span>` : ''}</span>
      </button></li>`;

  const renderYear = y => {
    year = +y; list = yearList(year); expanded = false; cat = 'all';
    const top = firstTen(), rest = list.filter(t => !top.includes(t));
    stats = {
      top10: list.filter(t => t.rank <= 10).length,
      igp10: list.filter(t => t.rank <= 10 && t.cats.includes('igp')).length,
      n50: list.filter(t => t.rank <= 50).length,
      withProgs: list.some(t => t.progs.length)
    };
    if (kickB) kickB.innerHTML = `Union Public Service Commission &middot; Civil Services Examination ${year}`;
    deck.innerHTML = stats.withProgs
      ? `The UPSC CSE ${year} top-ten rank holders were associated with Vajiram &amp; Ravi through different programmes, from General Studies preparation and test series to interview guidance.`
      : `The UPSC CSE ${year} rank holders who prepared with Vajiram &amp; Ravi, as the institute publishes them.`;
    ten.innerHTML = top.map((t, i) => card(t, i, false)).join('') + rest.map((t, i) => card(t, i, true)).join('');
    if (scroller) scroller.scrollTop = 0;
    allBtn.hidden = !rest.length;
    allBtn.innerHTML = label();
    allBtn.setAttribute('aria-expanded', 'false');
    rollH.textContent = 'The first ten';
    tabs.forEach(b => {
      const c = b.dataset.gzCat, k = c === 'all' ? list.length : list.filter(t => t.cats.includes(c)).length;
      b.hidden = c !== 'all' && !k;
      let s = b.querySelector('small'); if (!s) { s = document.createElement('small'); b.append(s); }
      s.textContent = k; s.setAttribute('aria-label', `${k} rank holders`);
    });
    current = list[0];
    sizeLead();
    pick(current, false);
    applyFilter('all');
  };

  /* ---------- selecting ---------- */
  /* Topper switch (user 2026-11-11: no blank frame, no flicker, previous topper stays until the next is ready, always in sync).
     1. Nothing changes until the next portrait is decoded (warm(); hovering a card starts this early). Meanwhile the clicked card shows
        .is-pending and the lead stays as it is; a newer click supersedes an older one (ask counter).
     2. Commit: a frozen copy of the current portrait (the "ghost", with whatever clip/zoom it has right now, so an interrupted reveal does
        not jump) is laid UNDER the frame's <img>; the text dims to 25% (.is-out, 140ms).
     3. The <img> is held clipped shut (.is-prep), its src and all the text are swapped (fill), the <img> is decoded, then the reveal runs
        (.is-swap: the new portrait wipes in from the top over the still-visible previous one, the text rises back from 25%). The card
        highlight moves in the same frame as the content. The ghosts are removed when the reveal ends. The story box keeps its min-height,
        so nothing below moves. */
  let ask = 0, revealT = 0, shown = null;   // shown: the topper on the front page right now (current: the latest one asked for)
  const setOn = t => { shown = t; ten.querySelectorAll('.gz__tp').forEach(li => {
    const on = li.dataset.key === t.key;
    li.classList.toggle('is-on', on); li.classList.remove('is-pending');
    li.querySelector('.gz__pick').setAttribute('aria-pressed', on ? 'true' : 'false');
  }); };
  const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const pick = async (t, animate) => {
    current = t;
    if (!animate) { ++ask; setOn(t); fill(t, true); return; }
    if (t === shown) { ++ask; setOn(t); lead.removeAttribute('aria-busy'); return; }   // clicked back to the one still showing: cancel the pending switch
    const top = lead.getBoundingClientRect().top;
    if (top < 80 || top > innerHeight * .6) {
      const y = scrollY + top - 96;
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: reduce ? 0 : 1 }); else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    }
    const me = ++ask;
    ten.querySelectorAll('.gz__tp').forEach(li => li.classList.toggle('is-pending', li.dataset.key === t.key && !li.classList.contains('is-on')));
    lead.setAttribute('aria-busy', 'true');
    await Promise.race([warm(t.img), wait(8000)]);   // a failed or very slow image still switches, after 8s at most
    if (me !== ask) return;
    const frame = img.parentNode;
    if (reduce) { setOn(t); fill(t, true); lead.removeAttribute('aria-busy'); say.textContent = `Front page now shows ${t.name}, All India Rank ${t.rank}.`; return; }
    clearTimeout(revealT);
    // 2. freeze the current portrait under the frame image, exactly as it looks now
    if (img.currentSrc) {
      const cs = getComputedStyle(img), ghost = document.createElement('span'), old = img.cloneNode(false);
      ghost.className = 'gz__ghost'; ghost.setAttribute('aria-hidden', 'true');
      old.removeAttribute('id'); old.alt = ''; old.style.height = img.offsetHeight + 'px';
      old.style.clipPath = cs.clipPath; old.style.scale = cs.scale; old.style.transformOrigin = cs.transformOrigin;
      ghost.append(old); frame.insertBefore(ghost, img);
    }
    lead.classList.remove('is-swap'); lead.classList.add('is-out');
    await wait(140);
    if (me !== ask) return;
    // 3. swap under cover, decode, reveal
    lead.classList.add('is-prep');
    setOn(t); fill(t, true);
    try { await img.decode(); } catch (e) {}
    if (me !== ask) return;
    await nextFrame();
    if (me !== ask) return;
    lead.classList.remove('is-out', 'is-prep'); void lead.offsetWidth; lead.classList.add('is-swap');
    lead.removeAttribute('aria-busy');
    say.textContent = `Front page now shows ${t.name}, All India Rank ${t.rank}.`;
    revealT = setTimeout(() => { if (me === ask) frame.querySelectorAll('.gz__ghost').forEach(g => g.remove()); }, 1000);
  };
  // decode a portrait ahead of time; hovering or focusing a card warms its portrait so the swap is instant
  const warmed = new Map();
  const warm = src => {
    if (!warmed.has(src)) {
      const im = new Image(); im.decoding = 'async'; im.src = src;
      warmed.set(src, (im.decode ? im.decode() : new Promise(r => { im.onload = im.onerror = r; })).catch(() => {}));
    }
    return warmed.get(src);
  };
  const warmCard = e => {
    const li = e.target.closest && e.target.closest('.gz__tp'); if (!li) return;
    const t = list.find(x => x.key === li.dataset.key); if (t) warm(t.img);
  };
  ten.addEventListener('pointerover', warmCard);
  ten.addEventListener('focusin', warmCard);
  ten.addEventListener('click', e => {
    const li = e.target.closest('.gz__tp'); if (!li) return;
    const t = list.find(x => x.key === li.dataset.key);
    if (t && t !== current) pick(t, true);
  });

  /* ---------- filters ---------- */
  const applyFilter = c => {
    cat = c;
    tabs.forEach(b => b.setAttribute('aria-pressed', b.dataset.gzCat === c ? 'true' : 'false'));
    sec.classList.toggle('gz--filter', c !== 'all');
    let inTen = 0, inAll = 0;
    ten.querySelectorAll('.gz__tp').forEach(li => {
      const hit = c === 'all' || li.dataset.cats.split(' ').includes(c);
      if (hit && c !== 'all') { inAll++; if (!li.classList.contains('is-extra')) inTen++; }
      li.classList.toggle('is-hit', hit && c !== 'all');
      li.classList.toggle('is-dim', !hit);
      li.querySelectorAll('.gz__pg [data-gz-cat]').forEach(x => x.classList.toggle('is-hit', c !== 'all' && x.dataset.gzCat === c));
    });
    if (c === 'all') { count.textContent = ''; return; }
    const tenWord = stats.top10 === 10 ? 'top ten' : 'first ten';
    count.textContent = `${inTen} of the ${tenWord} associated with ${NAME[c]}` + (allBtn.hidden ? '' : ` (${inAll} of all ${list.length} rank holders)`);
  };
  tabs.forEach(b => b.addEventListener('click', () => applyFilter(b.dataset.gzCat)));

  /* ---------- show all / edition ---------- */
  /* Show all / Show the first ten: the list grows or shrinks smoothly (its height animates), the new cards rise in one after another,
     and on collapse the page glides back to the roll header if it has scrolled past it. The button label rolls to its new text. */
  const label = () => `<span>${expanded ? 'Show the first ten' : `Show all ${list.length} rank holders`}</span><i aria-hidden="true"></i>`;
  let busy = false;
  const glideTo = el => {
    const y = scrollY + el.getBoundingClientRect().top - 96;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: reduce ? 0 : .9 }); else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  };
  allBtn.addEventListener('click', () => {
    if (busy) return;
    const extras = [...ten.querySelectorAll('.is-extra')];
    const h0 = ten.offsetHeight;
    expanded = !expanded;
    allBtn.setAttribute('aria-expanded', String(expanded));
    allBtn.innerHTML = label();
    rollH.textContent = expanded ? 'All rank holders' : 'The first ten';
    if (reduce) { extras.forEach(li => { li.hidden = !expanded; }); return; }
    busy = true;
    if (expanded) {
      extras.forEach((li, i) => { li.hidden = false; li.style.setProperty('--j', Math.min(i, 14)); li.classList.add('is-new'); });
    } else {
      if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
      if (ten.getBoundingClientRect().top < 80) glideTo(sec.querySelector('.gz__rollh') || sec.querySelector('.gz__roll'));
      extras.forEach(li => { li.hidden = true; });
    }
    const h1 = ten.offsetHeight;
    if (!expanded) extras.forEach(li => { li.hidden = false; li.classList.add('is-out'); });
    ten.style.height = h0 + 'px'; ten.style.overflow = 'hidden';
    void ten.offsetHeight;
    ten.style.transition = `height ${expanded ? .7 : .55}s cubic-bezier(.2, .7, .2, 1)`;
    ten.style.height = h1 + 'px';
    const done = () => {
      ten.removeEventListener('transitionend', done); clearTimeout(t);
      ten.style.height = ten.style.overflow = ten.style.transition = '';
      extras.forEach(li => { li.classList.remove('is-new', 'is-out'); if (!expanded) li.hidden = true; });
      busy = false;
    };
    ten.addEventListener('transitionend', done); const t = setTimeout(done, 900);
  });
  if (yearSel) yearSel.addEventListener('change', () => renderYear(yearSel.value));

  renderYear(SHOW);
  let w = innerWidth, rz = 0;
  addEventListener('resize', () => { if (innerWidth === w) return; w = innerWidth; clearTimeout(rz); rz = setTimeout(sizeLead, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeLead);
})();
