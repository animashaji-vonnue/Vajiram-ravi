/* The programme shelf: version 6's course shelf (Solomon's design, Programmes/CourseShelf, CoverArt, GeoArt and
   shelf.css), ported to plain JavaScript for this page and filled with this page's twelve programmes. The heading,
   the lead and the tab bar above it stay this page's own (js/content.js builds the tabs and hands the chosen one to
   window.__progShelf).

   - The programmes stand as cloth hardcovers on walnut planks drawn in CSS, six to a plank on a wide screen (fewer
     on narrower ones), centred on it: the
     board in the programme's colour, the spine down the left, the page block showing past the board, a gold foil
     frame, "Vajiram & Ravi", the name, a foil rule, the emblem in a foil ring, and the category at the foot. Under
     the foil a geometric motif is pressed faintly into the cloth. Hover: the book lifts off its plank, the cloth
     brightens, the motif moves, the emblem redraws itself, a band of light sweeps across and the foot reads "Open
     the book". While the shelf is on screen, a faint glint passes across one cover or another now and then.
   - A tab lays the books that leave down flat where they stand, fading; slides the rest along the planks to their
     new places; and stands the arriving ones up in theirs, all within about 500ms. Planks with no books fade away.
   - Choosing a book brings it forward to the middle, larger, the rest blurred back; its cover swings open on the
     spine and its pages can be turned: the programme, then the way to enquire about it. A chip above says the page,
     previous and next sit under it, a click on the right-hand page or → turns forward, the left-hand page or ←
     back; the right-hand page's corner peels, and pulling it over turns the page too. The close button, the open
     cover, Escape or a click on the wall close it.
   - Entrance, once, as the shelf comes into view: the books arrive as a stack lying on the lowest plank, then lift
     off it one by one and stand into their places. Reduced motion: no entrance, no glint, and moves are instant.

   Styles: css/programme-shelf.css. */
(() => {
  const grid = document.getElementById('pgrid');
  if (!grid || !window.__progs) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const zoom = () => (window.__z ? window.__z() : 1);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  /* ---- The programmes: this page's twelve, each given its own cloth cover: a bookbinding colour (after version 6's),
     an emblem and a pressed motif, no two alike. ---- */
  const COVERS = [
    { light: '#d9581c', base: '#c2410c', deep: '#8f3010', emblem: 'books', art: 'bars' },      // General Studies PCM
    { light: '#4f7d5a', base: '#3b6345', deep: '#26422d', emblem: 'sprout', art: 'steps' },    // GS PCM, 2-year Fledgling
    { light: '#5b4486', base: '#45336b', deep: '#2b1f48', emblem: 'bolt', art: 'chevrons' },   // GS Mains crash course: deep indigo, not the pale copper that read like the planks
    { light: '#c0362c', base: '#a3231c', deep: '#701510', emblem: 'quill', art: 'circles' },   // Optional subjects
    { light: '#2e6a80', base: '#1f4a5f', deep: '#14323f', emblem: 'abacus', art: 'grid' },     // CSAT
    { light: '#5e5f63', base: '#4a4b4e', deep: '#303133', emblem: 'mic', art: 'arches' },      // Interview guidance
    { light: '#7a3556', base: '#5e2742', deep: '#3f192c', emblem: 'target', art: 'target' },   // Prelims test series
    { light: '#b88a2e', base: '#9a7020', deep: '#6b4c12', emblem: 'compass', art: 'orbit' },   // Mentorship
    { light: '#4b5d8a', base: '#3a4a72', deep: '#26314f', emblem: 'blocks', art: 'quarters' }, // Module courses
    { light: '#a3545c', base: '#873f48', deep: '#5e2a31', emblem: 'pen', art: 'lines' },       // Mains test series
    { light: '#336650', base: '#264f3e', deep: '#18352a', emblem: 'hourglass', art: 'diamonds' },  // Optional crash course
    { light: '#5d6b34', base: '#485428', deep: '#2f3819', emblem: 'tree', art: 'triangles' }, // IFoS
  ];
  const PROGS = window.__progs.map((p, i) => ({ name: p.t, category: p.tab, line: p.d, prog: p.prog, cover: COVERS[i % COVERS.length] }));

  /* ---- Measurements (px): version 6's, made to hold this page's twelve programmes. Books a little smaller than
     version 6's (172 × 228, the same proportions), 30px apart. How many stand on a plank follows the room there is
     (the page is responsive): six on a wide screen (two planks, as version 6), four on a tablet, three, or two on a
     phone; the stage is just wide enough for them (and scaled down only if even that does not fit). The open book
     keeps version 6's size; on a screen too narrow for its spread the stage is scaled while it is open. ---- */
  const BOOK = { w: 172, h: 228 }, GAP = 30, ROW_H = 310, BOOK_TOP = 30, SIDE = 20;
  const PLANK_TOP = BOOK_TOP + BOOK.h - 8, PAGE = { w: 380, h: 504 }, OPEN_H = Math.max(2 * ROW_H, 704);
  /** The room the open spread needs across: its two pages and the close button. */
  const SPREAD_W = 2 * PAGE.w + 80;
  let PER_SHELF = 6, STAGE_W = 1280, PLANK_W = 1240, FIT = 1;
  const SPINE = { x: STAGE_W / 2, y: OPEN_H / 2 };
  const MAX_ROWS = 6;
  const MOVE_MS = 650, OPEN_MS = 750, TURN_MS = 700;
  const SETTLE = 'cubic-bezier(0.34, 1.4, 0.64, 1)', EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const STACK_TILT = 66, STACK_T = 12, STACK_SHIFT = [-6, 9, -3, 11, -9, 4, -5, 7], STACK_TURN = [-3, 2.5, -1.5, 3.5, -2, 1, -3.5, 2];
  const PILE_IN_MS = 220, PILE_DROP_MS = 10, DEAL_GAP_MS = 60, FLIGHT_MS = 420;
  const LIE_MS = 280, STAND_MS = 340, TIP_STAGGER_MS = 25, ARRIVE_AFTER_MS = 120, SLIDE_MS = 450, LEAVE_MS = 340;
  const FOIL = '#f6c77a';

  const rowsFor = n => Math.max(1, Math.ceil(n / PER_SHELF));
  const spot = (k, n) => {
    const row = Math.floor(k / PER_SHELF), inRow = Math.min(PER_SHELF, n - row * PER_SHELF);
    const left = (STAGE_W - (inRow * BOOK.w + (inRow - 1) * GAP)) / 2;
    return { x: left + (k % PER_SHELF) * (BOOK.w + GAP), y: row * ROW_H + BOOK_TOP };
  };
  const stackFoot = n => ({ x: STAGE_W / 2, y: (rowsFor(n) - 1) * ROW_H + BOOK_TOP + BOOK.h });
  const pose = (x, y, tilt, turn, scale) => `translate(${x}px, ${y}px) perspective(1100px) rotateX(${tilt}deg) rotateZ(${turn}deg) scale(${scale})`;
  const STAND = pose(0, 0, 0, 0, 1);
  const LYING = pose(0, 6, 84, 0, 0.94);
  const onStack = (at, foot, level, scale) => ({ x: foot.x + STACK_SHIFT[level % STACK_SHIFT.length] * scale - (at.x + BOOK.w / 2), y: foot.y - level * STACK_T * scale - (at.y + BOOK.h) });
  const dealSteps = (at, foot, level, scale, drop, wait, from) => {
    const { x, y } = onStack(at, foot, level, scale), turn = STACK_TURN[level % STACK_TURN.length];
    const lie = pose(x, y, STACK_TILT, turn, scale), off = pose(x + from.x, y + from.y, STACK_TILT, turn, scale);
    return [
      { at: 0, pose: off, opacity: 0, lift: 0 },
      { at: drop, pose: off, opacity: 0, lift: 0, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      { at: drop + PILE_IN_MS, pose: lie, lift: 0 },
      { at: wait, pose: lie, lift: 0, easing: 'cubic-bezier(0.45, 0, 0.3, 1)' },
      { at: wait + FLIGHT_MS * 0.26, pose: pose(x, y - 56, 26, turn / 2, (scale + 1) / 2 + 0.03), lift: 1, easing: 'cubic-bezier(0.3, 0.1, 0.25, 1)' },
      { at: wait + FLIGHT_MS * 0.68, pose: pose(x * 0.06, -26, -5, -2.5, 1.02), lift: 0.7, easing: SETTLE },
      { at: wait + FLIGHT_MS, pose: STAND, lift: 0 },
    ];
  };
  const lieDownSteps = start => [
    { at: 0, pose: STAND, lift: 0 },
    { at: start, pose: STAND, lift: 0, easing: 'cubic-bezier(0.5, 0, 0.75, 0.3)' },
    { at: start + LIE_MS, pose: LYING, opacity: 0, lift: 0 },
  ];
  const standUpSteps = start => [
    { at: 0, pose: LYING, opacity: 0, lift: 0 },
    { at: start, pose: LYING, opacity: 0, lift: 0, easing: SETTLE },
    { at: start + STAND_MS, pose: STAND, lift: 0 },
  ];
  /** Plays a motion on one book's cover (and its lifted shadow and foot shadow). */
  const moveBook = (book, steps, { delay = 0, keep = false, z }) => {
    const cover = book && book.querySelector('[data-cover]');
    if (!cover) return [];
    const total = steps[steps.length - 1].at;
    const timing = { duration: total, delay, fill: keep ? 'both' : 'backwards' };
    const offset = s => s.at / total;
    cover.style.zIndex = String(z);
    const motion = cover.animate(steps.map(s => ({ offset: offset(s), transform: s.pose, opacity: s.opacity ?? 1, easing: s.easing ?? 'linear' })), timing);
    if (!keep) motion.addEventListener('finish', () => { cover.style.zIndex = ''; });
    const out = [motion];
    const lift = cover.querySelector('[data-lift]'), foot = cover.querySelector('[data-foot]');
    if (lift) out.push(lift.animate(steps.map(s => ({ offset: offset(s), opacity: s.lift, transform: `translate(${s.lift * 6}px, ${s.lift * 26}px)`, easing: s.easing ?? 'linear' })), timing));
    if (foot) out.push(foot.animate(steps.map(s => ({ offset: offset(s), opacity: 1 - s.lift, easing: s.easing ?? 'linear' })), timing));
    return out;
  };

  /* ---- The emblems (version 6's CoverArt, with five more for this page's programmes): line drawings on 48 × 48. ---- */
  const DRAW = {
    books: '<path d="M24 17c-2.6-1.8-6-2.4-10-2.2v16c4-.2 7.4.4 10 2.2 2.6-1.8 6-2.4 10-2.2v-16c-4-.2-7.4.4-10 2.2Z"/><path d="M24 17v16M17 20.5h3.5M17 24h3.5M27.5 20.5H31M27.5 24H31"/>',
    abacus: '<rect x="15" y="15" width="18" height="18" rx="2"/><path d="M15 21h18M15 27h18"/><circle cx="20" cy="21" r="1.6"/><circle cx="26" cy="21" r="1.6"/><circle cx="23" cy="27" r="1.6"/><circle cx="29" cy="27" r="1.6"/>',
    quill: '<path d="M33 15c-7 1-12 6-14 14l-1.5 4.5"/><path d="M33 15c-1 6-4.5 10.5-11 12.5"/><path d="M21 30.5h8"/>',
    layers: '<path d="m24 15 9 4.5-9 4.5-9-4.5 9-4.5Z"/><path d="m15 24 9 4.5 9-4.5M15 28.5 24 33l9-4.5"/>',
    target: '<circle cx="24" cy="24" r="9"/><circle cx="24" cy="24" r="5"/><circle cx="24" cy="24" r="1.4"/><path d="m24 24 8-8M29 16h3v3"/>',
    pen: '<path d="M15 31h9M15 27h6M15 23h5"/><path d="m27 29.5 6.5-6.5a1.8 1.8 0 0 0-2.5-2.5L24.5 27 24 30Z"/>',
    compass: '<circle cx="24" cy="24" r="9"/><path d="m27.8 20.2-2.3 5.3-5.3 2.3 2.3-5.3 5.3-2.3Z"/>',
    mic: '<rect x="20.5" y="14" width="7" height="12" rx="3.5"/><path d="M17 23.5a7 7 0 0 0 14 0M24 30.5V34M20.5 34h7"/>',
    sprout: '<path d="M24 33V22"/><path d="M24 24c0-5-3.5-8-9-8 0 5 3.5 8 9 8Z"/><path d="M24 27c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5Z"/><path d="M17 33h14"/>',
    bolt: '<path d="M26 14 18 26h6l-2 9 8-12h-6l2-9Z"/>',
    blocks: '<rect x="15" y="25" width="8" height="8" rx="1.2"/><rect x="25" y="25" width="8" height="8" rx="1.2"/><rect x="20" y="15" width="8" height="8" rx="1.2"/>',
    hourglass: '<path d="M17 14h14M17 34h14"/><path d="M18.5 14c0 5 5.5 6.5 5.5 10s-5.5 5-5.5 10h11c0-5-5.5-6.5-5.5-10s5.5-5 5.5-10"/>',
    tree: '<path d="M24 34v-6"/><path d="M24 14l-7 10h4l-5 6h16l-5-6h4Z"/>',
  };
  const emblem = (kind, size) => `<svg class="ps-emblem" viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true"><g class="ps-emblem__ring"><circle cx="24" cy="24" r="21.5" stroke-width=".9" stroke-dasharray="1.2 2.4"/></g><circle cx="24" cy="24" r="18.5" stroke-width=".9"/><g class="ps-emblem__draw">${DRAW[kind] || DRAW.books}</g></svg>`;

  /* ---- The pressed motifs (version 6's GeoArt), on 100 × 100, moving on hover (css: .ps-geo [data-m]). ---- */
  const geo = (kind, accent, soft) => {
    const m = (cls, attrs) => `<${attrs.tag || 'rect'} data-m="${cls}" ${Object.entries(attrs).filter(([k]) => k !== 'tag').map(([k, v]) => `${k}="${v}"`).join(' ')}/>`;
    const parts = {
      bars: [m('l14', { x: 52, y: 45, width: 60, height: 13, rx: 6.5, fill: accent }), m('r8', { x: 22, y: 62, width: 90, height: 16, rx: 8, fill: soft, opacity: .75 }), m('l10', { x: 30, y: 82, width: 80, height: 14, rx: 7, fill: soft, opacity: .45 })],
      circles: [m('s112', { tag: 'circle', cx: 98, cy: 84, r: 44, fill: soft, opacity: .55 }), m('u6', { tag: 'circle', cx: 20, cy: 104, r: 36, fill: soft, opacity: .45 }), m('ul', { tag: 'circle', cx: 62, cy: 68, r: 16, fill: accent })],
      grid: [0, 1, 2].flatMap(r => [0, 1, 2].map(c => m(r === 1 && c === 1 ? 'rot-c' : 'rot', { x: 48 + c * 20, y: 46 + r * 20, width: 15, height: 15, rx: 2.5, fill: r === 1 && c === 1 ? accent : soft, opacity: r === 1 && c === 1 ? 1 : .6, style: `transition-delay:${(r + c) * 40}ms` }))),
      arches: [m('r8', { tag: 'path', d: 'M8 104 V82 A22 22 0 0 1 30 60 H30 V104 Z', fill: soft, opacity: .6 }), m('l8', { tag: 'path', d: 'M108 104 V82 A22 22 0 0 0 86 60 H86 V104 Z', fill: soft, opacity: .8 }), m('s16', { tag: 'circle', cx: 58, cy: 76, r: 4, fill: accent })],
      arcs: [m('s110', { tag: 'circle', cx: 22, cy: 104, r: 48, fill: soft, opacity: .35 }), m('s118', { tag: 'circle', cx: 22, cy: 104, r: 32, fill: soft, opacity: .5 }), m('ur', { tag: 'circle', cx: 66, cy: 62, r: 9, fill: accent })],
      lines: [m('sx', { x: 30, y: 44, width: 34, height: 8, rx: 2.5, fill: accent }), ...[[57, 22], [70, 44], [83, 20]].map(([y, w], i) => m('sx', { x: 30, y, width: w, height: 8, rx: 2.5, fill: soft, opacity: .75, style: `transition-delay:${(i + 1) * 60}ms` }))],
      target: [m('s108', { tag: 'circle', cx: 58, cy: 76, r: 34, fill: soft, opacity: .35 }), m('s112', { tag: 'circle', cx: 58, cy: 76, r: 23, fill: soft, opacity: .5, style: 'transition-delay:60ms' }), m('s116', { tag: 'circle', cx: 58, cy: 76, r: 13, fill: soft, opacity: .7, style: 'transition-delay:120ms' }), m('s13', { tag: 'circle', cx: 58, cy: 76, r: 6, fill: accent })],
      quarters: [m('u6', { tag: 'path', d: 'M30 104 V92 A26 26 0 0 1 56 66 V104 Z', fill: soft, opacity: .6 }), m('u10', { tag: 'path', d: 'M80 104 V90 A24 24 0 0 1 104 66 V104 Z', fill: soft, opacity: .75 }), m('dl', { tag: 'circle', cx: 76, cy: 46, r: 3.5, fill: accent })],
      // Five more, so no two covers share a motif: rising steps, chevrons, an orbit, diamonds and pines.
      steps: [m('u6', { x: 38, y: 82, width: 20, height: 26, rx: 3, fill: soft, opacity: .45 }), m('u10', { x: 61, y: 66, width: 20, height: 42, rx: 3, fill: soft, opacity: .65, style: 'transition-delay:60ms' }), m('u14', { x: 84, y: 50, width: 20, height: 58, rx: 3, fill: accent, style: 'transition-delay:120ms' })],
      chevrons: [0, 1, 2].map(k => m('r14', { tag: 'path', d: `M${36 + k * 20} 62 l16 16 -16 16 h9 l16 -16 -16 -16 Z`, fill: k === 2 ? accent : soft, opacity: k === 2 ? 1 : .45 + k * .2, style: `transition-delay:${k * 60}ms` })),
      orbit: [m('s110', { tag: 'circle', cx: 70, cy: 80, r: 26, fill: 'none', stroke: soft, 'stroke-width': 5, opacity: .6 }), m('s116', { tag: 'circle', cx: 70, cy: 80, r: 12, fill: soft, opacity: .55 }), m('or', { tag: 'circle', cx: 46, cy: 62, r: 6, fill: accent })],
      diamonds: [m('rot', { tag: 'path', d: 'M58 54 76 72 58 90 40 72 Z', fill: soft, opacity: .55 }), m('rot', { tag: 'path', d: 'M84 70 98 84 84 98 70 84 Z', fill: soft, opacity: .75, style: 'transition-delay:60ms' }), m('rot-c', { tag: 'path', d: 'M86 44 94 52 86 60 78 52 Z', fill: accent, style: 'transition-delay:120ms' })],
      triangles: [m('u6', { tag: 'path', d: 'M36 108 56 64 76 108 Z', fill: soft, opacity: .5 }), m('u10', { tag: 'path', d: 'M64 108 84 70 104 108 Z', fill: soft, opacity: .72, style: 'transition-delay:60ms' }), m('s16', { tag: 'path', d: 'M56 52 61 42 66 52 Z', fill: accent })],
    };
    return `<svg class="ps-geo" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${(parts[kind] || parts.bars).join('')}</svg>`;
  };

  const glintOffset = name => { let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997; return (h % 11) + (h % 7) / 7; };

  /* ---- A cover's front (version 6's CoverFront): small on the shelf, larger once brought forward. ---- */
  const coverFront = (p, large) => {
    const { light, base, deep } = p.cover;
    const SW = large ? 26 : 14;
    const frame = large ? `top:20px;right:20px;bottom:20px;left:${SW + 18}px` : `top:10px;right:10px;bottom:10px;left:${SW + 9}px`;
    return `<span class="ps-front${large ? ' ps-front--lg' : ''}" style="background-color:${base};background-image:linear-gradient(140deg, ${light} 0%, ${base} 48%, ${deep} 100%)">
      <span class="ps-front__geo" aria-hidden="true">${geo(p.cover.art, FOIL, '#fff3dc')}</span>
      <span class="ps-cloth" aria-hidden="true"></span><span class="ps-grain" aria-hidden="true"></span>
      <span class="ps-spine" aria-hidden="true" style="width:${SW}px;background:linear-gradient(90deg, rgb(0 0 0 / .38), ${deep} 38%, ${base} 80%, rgb(0 0 0 / .2))"></span>
      <span class="ps-hinge" aria-hidden="true" style="left:${SW}px"></span>
      <span class="ps-light" aria-hidden="true"></span>
      <span class="ps-frame" aria-hidden="true" style="${frame}"><span></span></span>
      <span class="ps-face" style="${frame}">
        <span class="ps-face__brand" aria-hidden="true">Vajiram &amp; Ravi</span>
        <span class="ps-face__name">${esc(p.name)}</span>
        <span class="ps-face__rule" aria-hidden="true"><i></i><b></b><i></i></span>
        <span class="ps-face__em" aria-hidden="true">${emblem(p.cover.emblem, large ? 128 : 58)}</span>
        <span class="ps-face__foot"><span class="ps-face__cat">${esc(p.category)}</span><span class="ps-face__open" aria-hidden="true">Open the book</span></span>
      </span>
      <span class="ps-glint" aria-hidden="true" style="animation-delay:${-glintOffset(p.name)}s"></span>
      <span class="ps-shine" aria-hidden="true"></span>
    </span>`;
  };

  /* ---- The pages: the programme, then the way to enquire about it. ---- */
  const ARROW = back => `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"${back ? ' style="transform:scaleX(-1)"' : ''}><path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const pageHtml = (p, kind) => kind === 'overview'
    ? `<p class="ps-pg__kick">${esc(p.category)} · Classroom and LIVE-Online</p><h3 class="ps-pg__h">${esc(p.name)}</h3><p class="ps-pg__p">${esc(p.line)}</p>`
    : `<p class="ps-pg__kick">Admissions</p><h3 class="ps-pg__h">Enquire about this programme</h3><p class="ps-pg__p">Tell us a little about yourself and a counsellor will call you back about the ${esc(p.name)}: batches, fees and how it is taught.</p>
       <div class="ps-pg__end"><a class="ps-pg__cta" href="#contact" data-prog="${esc(p.prog)}">Enquire now ${ARROW(false)}</a><button type="button" class="ps-pg__back" data-restart>${ARROW(true)} Back to the first page</button></div>`;
  const LEAVES = ['overview', 'enquire'];

  /* ---- Build the shelf ---- */
  grid.className = 'ps';
  grid.removeAttribute('role');
  grid.innerHTML = `<p class="ps-sr" aria-live="polite"></p>
    <div class="ps-stage" id="programme-shelf">
      ${Array.from({ length: MAX_ROWS }, (_, r) => `<span class="ps-plank" aria-hidden="true" data-row="${r}" style="top:${r * ROW_H + PLANK_TOP}px"><span class="ps-plank__top"></span><span class="ps-plank__front"></span></span>`).join('')}
      ${PROGS.map((p, i) => `<div class="ps-book" data-book="${i}">
        <div class="ps-book__in" data-cover>
          <span class="ps-lift" data-lift aria-hidden="true"></span>
          <span class="ps-extras" aria-hidden="true"><span class="ps-foot" data-foot></span><span class="ps-back" style="background-color:${p.cover.deep}"></span><span class="ps-pages"></span></span>
          <div class="ps-open"></div>
          <button type="button" class="ps-cover" aria-expanded="false" aria-label="Open ${esc(p.name)}">
            <span class="ps-cover__front">${coverFront(p, false)}</span>
            <span class="ps-cover__inside" aria-hidden="true" style="background-color:${p.cover.deep}"><span>Vajiram &amp; Ravi</span><span class="ps-cover__foot"><b>Since 1976</b><img src="assets/img/brand/logo-mark.webp" alt="" width="73" height="76"></span></span>
          </button>
        </div>
      </div>`).join('')}
    </div>`;
  const stage = grid.querySelector('.ps-stage');
  const live = grid.querySelector('.ps-sr');
  const planks = [...grid.querySelectorAll('.ps-plank')];
  const books = [...grid.querySelectorAll('.ps-book')];

  /* ---- Fitting the shelf to the room it has ---- */
  const measure = () => {
    const room = grid.clientWidth || 1280;
    const fits = n => n * BOOK.w + (n - 1) * GAP + 2 * SIDE + 40;
    PER_SHELF = [6, 4, 3, 2].find(n => fits(n) <= room) || 2;
    STAGE_W = fits(PER_SHELF);
    PLANK_W = STAGE_W - 40;
    SPINE.x = STAGE_W / 2;
    FIT = Math.min(1, room / STAGE_W);
    stage.style.width = STAGE_W + 'px';
    planks.forEach(pl => { pl.style.left = (STAGE_W - PLANK_W) / 2 + 'px'; pl.style.width = PLANK_W + 'px'; });
  };
  /** The stage's scale: to fit the shelf, or (while a book is open) the spread. */
  const stageZoom = () => (picked === null ? FIT : Math.min(FIT, (grid.clientWidth || 1280) / Math.max(STAGE_W, SPREAD_W)));

  /* ---- State ---- */
  let filter = 'All', picked = null, open = false, hovered = null, shuffle = null;
  const turned = PROGS.map(() => 0);
  const lastSpot = new Map();
  let stacking = [], timer = 0, shuffleTimer = 0;
  const shownIn = f => PROGS.flatMap((p, i) => (f === 'All' || p.category === f ? [i] : []));
  const later = (fn, ms) => { clearTimeout(timer); timer = setTimeout(fn, reduced ? 0 : ms); };
  const stopStacking = () => { stacking.forEach(a => a.cancel()); stacking = []; grid.querySelectorAll('[data-cover]').forEach(c => { c.style.zIndex = ''; }); };

  const place = i => {
    const shown = shownIn(filter), away = picked !== null;
    const base = { left: '', top: '', width: BOOK.w + 'px', height: BOOK.h + 'px', zIndex: '', transform: 'none', filter: 'none', opacity: '1', pointerEvents: '', transition: '' };
    if (i === picked) return { ...base, left: SPINE.x + 'px', top: SPINE.y - PAGE.h / 2 + 'px', width: PAGE.w + 'px', height: PAGE.h + 'px', zIndex: '20',
      transition: `left ${MOVE_MS}ms ${EASE}, top ${MOVE_MS}ms ${EASE}, width ${MOVE_MS}ms ${EASE}, height ${MOVE_MS}ms ${EASE}, transform 320ms ${EASE}` };
    const k = shown.indexOf(i);
    if (k < 0) {
      const { x, y } = lastSpot.get(i) || spot(i, PROGS.length);
      if (shuffle) return { ...base, left: x + 'px', top: y + 'px', opacity: '0', pointerEvents: 'none', transition: `opacity 0s linear ${shuffle.leaveMs}ms` };
      return { ...base, left: x + 'px', top: y + 'px', transform: 'translateY(18px) scale(0.92)', filter: 'blur(3px)', opacity: '0', pointerEvents: 'none',
        transition: `opacity ${LEAVE_MS}ms ${EASE}, transform ${LEAVE_MS + 40}ms ${EASE}, filter ${LEAVE_MS}ms ${EASE}` };
    }
    const { x, y } = spot(k, shown.length);
    lastSpot.set(i, { x, y });
    const common = `left ${MOVE_MS}ms ${EASE}, top ${MOVE_MS}ms ${EASE}, width ${MOVE_MS}ms ${EASE}, height ${MOVE_MS}ms ${EASE}, transform 320ms ${EASE}, filter 700ms ${EASE}, opacity 700ms ${EASE}`;
    return { ...base, left: x + 'px', top: y + 'px',
      transform: hovered === i && !away ? 'translateY(-14px) rotate(-1deg)' : 'none',
      filter: away ? 'blur(14px)' : 'none', opacity: away ? '0.25' : '1',
      transition: shuffle && shuffle.arriving.includes(i) ? 'none' : shuffle ? common.replace(`left ${MOVE_MS}ms`, `left ${SLIDE_MS}ms`).replace(`top ${MOVE_MS}ms`, `top ${SLIDE_MS}ms`) : common };
  };

  const layout = () => {
    const shown = shownIn(filter), rows = rowsFor(shown.length), away = picked !== null;
    stage.style.height = (away ? Math.max(rows * ROW_H, OPEN_H) : rows * ROW_H) + 'px';
    stage.style.zoom = String(stageZoom());
    planks.forEach((pl, r) => {
      pl.style.opacity = r < rows ? (away ? '0.3' : '1') : '0';
      pl.style.translate = r < rows ? '0 0' : '0 -12px';
      pl.style.filter = away ? 'blur(6px)' : 'none';
    });
    books.forEach((b, i) => {
      Object.assign(b.style, place(i));
      const hidden = !shown.includes(i);
      b.inert = hidden || (away && picked !== i);
      if (hidden) b.setAttribute('aria-hidden', 'true'); else b.removeAttribute('aria-hidden');
      b.classList.toggle('is-out', picked === i);
    });
    live.textContent = filter === 'All' ? `Showing all ${shown.length} programmes` : `Showing ${shown.length} ${filter} programmes`;
  };

  /* ---- The open book ---- */
  const flip = ms => `transform ${ms}ms cubic-bezier(0.65, 0, 0.35, 1), z-index 0s linear ${ms / 2}ms`;
  const buildOpen = i => {
    const p = PROGS[i], b = books[i], holder = b.querySelector('.ps-open');
    b.querySelector('.ps-cover__front').innerHTML = coverFront(p, true);
    holder.innerHTML = `
      <p class="ps-chip" aria-live="polite"><span><svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M8 4.2C6.6 3.2 4.6 2.8 2 2.9v9.3c2.6-.1 4.6.3 6 1.3 1.4-1 3.4-1.4 6-1.3V2.9c-2.6-.1-4.6.3-6 1.3ZM8 4.2v9.3"/></svg></span><b>Page 1 of ${LEAVES.length}</b></p>
      <button type="button" class="ps-close" aria-label="Close ${esc(p.name)}"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg></button>
      <div class="ps-paper ps-paper--base" aria-hidden="true"></div>
      ${LEAVES.map((kind, n) => `<div class="ps-leaf" data-leaf="${n}" style="z-index:${50 - n};transition:${flip(TURN_MS)}">
        <div class="ps-leaf__front peel${n < LEAVES.length - 1 ? ' is-turnable' : ''}">
          <div class="ps-leaf__paper peel__paper">${pageHtml(p, kind)}</div>
          ${n < LEAVES.length - 1 ? '<span class="peel__shade" aria-hidden="true"></span><span class="peel__flap" aria-hidden="true"><span class="peel__back"></span></span><span class="peel__hit" aria-hidden="true"></span>' : ''}
        </div>
        <div class="ps-leaf__back" aria-hidden="true"><img src="assets/img/brand/butta.svg" alt="" width="20" height="20"><span>${esc(p.name)}</span><small>${n * 2 + 2}</small></div>
      </div>`).join('')}
      <div class="ps-nav"><button type="button" class="ps-nav__prev">${ARROW(true)} Previous page</button><button type="button" class="ps-nav__next">Next page ${ARROW(false)}</button></div>`;
    syncPages(i);
  };
  const syncPages = i => {
    const b = books[i], t = turned[i], last = LEAVES.length - 1, isOpen = open && picked === i;
    b.querySelectorAll('.ps-leaf').forEach((leaf, n) => {
      const isTurned = n < t;
      leaf.style.transform = isTurned ? 'rotateY(-180deg)' : 'none';
      leaf.style.zIndex = isTurned ? 60 + n : 50 - n;
      const front = leaf.querySelector('.ps-leaf__front'), current = isOpen && n === t;
      front.inert = !current;
      front.setAttribute('aria-hidden', String(!current));
      front.classList.toggle('peel--on', current && n < last);
    });
    const chip = b.querySelector('.ps-chip b');
    if (chip) chip.textContent = `Page ${t + 1} of ${LEAVES.length}`;
    const prev = b.querySelector('.ps-nav__prev'), next = b.querySelector('.ps-nav__next');
    if (prev) { prev.disabled = t === 0; next.disabled = t === last; }
    b.classList.toggle('is-open', isOpen);
    const nav = b.querySelector('.ps-nav'); if (nav) nav.inert = !isOpen;
    const close = b.querySelector('.ps-close'); if (close) close.tabIndex = isOpen ? 0 : -1;
    const cover = b.querySelector('.ps-cover');
    cover.style.transform = isOpen ? 'rotateY(-180deg)' : 'none';
    cover.style.zIndex = isOpen ? '55' : '100';
    cover.style.transition = flip(OPEN_MS);
    cover.setAttribute('aria-expanded', String(isOpen));
    cover.setAttribute('aria-label', `${picked === i ? 'Close' : 'Open'} ${PROGS[i].name}`);
  };
  const turn = (i, by) => { turned[i] = Math.min(LEAVES.length - 1, Math.max(0, turned[i] + by)); syncPages(i); };
  const clearOpen = i => {
    const b = books[i];
    b.querySelector('.ps-open').innerHTML = '';
    b.querySelector('.ps-cover__front').innerHTML = coverFront(PROGS[i], false);
    turned[i] = 0;
    syncPages(i);
  };

  const pick = i => {
    if (picked === i) return;
    stopStacking();
    if (picked !== null) {
      const was = picked;
      open = false; syncPages(was);
      later(() => { picked = i; clearOpen(was); buildOpen(i); layout(); later(() => { open = true; syncPages(i); }, MOVE_MS); }, OPEN_MS);
      return;
    }
    picked = i; hovered = null; buildOpen(i); layout();
    later(() => { open = true; syncPages(i); }, MOVE_MS);
  };
  const close = () => {
    if (picked === null) return;
    const was = picked;
    open = false; syncPages(was);
    later(() => { picked = null; layout(); later(() => clearOpen(was), MOVE_MS); }, OPEN_MS);
  };

  /* ---- A tab: books leave, slide and arrive ---- */
  const choose = next => {
    if (next === filter) return;
    const before = shownIn(filter), after = shownIn(next);
    clearTimeout(timer); clearTimeout(shuffleTimer);
    stopStacking();
    if (picked !== null) { const was = picked; open = false; picked = null; clearOpen(was); }
    hovered = null;
    let plan = null;
    if (!reduced && typeof stage.animate === 'function') {
      const leaving = before.filter(i => !after.includes(i)), arriving = after.filter(i => !before.includes(i));
      const leaveMs = leaving.length ? (leaving.length - 1) * TIP_STAGGER_MS + LIE_MS : 0;
      const arriveAt = leaving.length ? ARRIVE_AFTER_MS : 0;
      const arriveMs = arriving.length ? arriveAt + (arriving.length - 1) * TIP_STAGGER_MS + STAND_MS : 0;
      shuffle = { arriving, leaveMs };
      plan = { leaving, arriving, arriveAt };
      shuffleTimer = setTimeout(() => { shuffle = null; layout(); }, Math.max(leaveMs, arriveMs, SLIDE_MS) + 50);
    } else shuffle = null;
    filter = next;
    layout();
    if (plan) {
      plan.leaving.forEach((i, k) => stacking.push(...moveBook(books[i], lieDownSteps(k * TIP_STAGGER_MS), { keep: true, z: 1 })));
      plan.arriving.forEach((i, k) => stacking.push(...moveBook(books[i], standUpSteps(k * TIP_STAGGER_MS), { delay: plan.arriveAt, z: 2 })));
    }
  };
  window.__progShelf = choose;

  /* ---- Events ---- */
  books.forEach((b, i) => {
    b.addEventListener('mouseenter', () => { hovered = i; if (picked === null) Object.assign(b.style, place(i)); });
    b.addEventListener('mouseleave', () => { if (hovered === i) hovered = null; if (picked === null) Object.assign(b.style, place(i)); });
    b.querySelector('.ps-cover').addEventListener('click', () => (picked === i ? close() : pick(i)));
    b.addEventListener('click', e => {
      if (picked !== i) return;
      if (e.target.closest('.ps-close')) { close(); return; }
      if (e.target.closest('.ps-nav__prev')) { turn(i, -1); return; }
      if (e.target.closest('.ps-nav__next')) { turn(i, 1); return; }
      if (e.target.closest('[data-restart]')) { turned[i] = 0; syncPages(i); return; }
      if (e.target.closest('a, button, .peel__hit')) return;
      if (e.target.closest('.ps-leaf__back')) { turn(i, -1); return; }
      const front = e.target.closest('.ps-leaf__front');
      if (front && front.classList.contains('is-turnable')) turn(i, 1);
    });
  });
  stage.addEventListener('click', e => { if (e.target === stage) close(); });
  addEventListener('keydown', e => {
    if (picked === null) return;
    if (e.key === 'Escape') close();
    if (open && e.key === 'ArrowRight') turn(picked, 1);
    if (open && e.key === 'ArrowLeft') turn(picked, -1);
  });

  // The peeling corner: a click turns the page; so does pulling it up and over far enough.
  const PEEL_GRAB = 0.7, PEEL_MOST = 2.2, PEEL_TURN = 1.25;
  let peel = null;
  stage.addEventListener('pointerdown', e => {
    const hit = e.target.closest('.peel__hit'); if (!hit || e.button !== 0) return;
    hit.setPointerCapture(e.pointerId);
    peel = { hit, page: hit.closest('.peel'), x: e.clientX, y: e.clientY, moved: false, amount: PEEL_GRAB };
  });
  stage.addEventListener('pointermove', e => {
    if (!peel) return;
    const dx = e.clientX - peel.x, dy = e.clientY - peel.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) peel.moved = true;
    if (!peel.moved || reduced) return;
    peel.amount = Math.min(PEEL_MOST, Math.max(0.1, PEEL_GRAB - (dx + dy) / 2 / zoom() / stageZoom() / 120));
    peel.page.classList.add('is-peeling');
    peel.page.style.setProperty('--peel', peel.amount.toFixed(3));
  });
  const endPeel = done => {
    if (!peel) return;
    const p = peel; peel = null;
    p.page.classList.remove('is-peeling'); p.page.style.removeProperty('--peel');
    if (done && picked !== null && (!p.moved || p.amount >= PEEL_TURN || reduced)) turn(picked, 1);
  };
  stage.addEventListener('pointerup', () => endPeel(true));
  stage.addEventListener('pointercancel', () => endPeel(false));

  // The glint runs only while the shelf is on screen.
  new IntersectionObserver(([e]) => stage.classList.toggle('is-on-screen', e.isIntersecting), { threshold: 0.1 }).observe(stage);

  measure();
  layout();
  let lastPer = PER_SHELF, rz = 0;
  addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      measure();
      // A change in how many stand on a plank re-shelves them at once, without the books' slide.
      if (PER_SHELF !== lastPer) { lastPer = PER_SHELF; books.forEach(b => { b.style.transition = 'none'; }); }
      layout();
    }, 120);
  });

  // The entrance: dealt off a stack as the shelf comes into view (only if it starts out of view).
  const box = stage.getBoundingClientRect();
  if (!reduced && typeof stage.animate === 'function' && !(box.top < innerHeight * 0.85 && box.bottom > 0)) {
    const shown = shownIn(filter), n = shown.length, foot = stackFoot(n);
    const anims = shown.flatMap((i, k) => {
      const level = n - 1 - k, wait = (n - 1) * PILE_DROP_MS + PILE_IN_MS + k * DEAL_GAP_MS;
      return moveBook(books[i], dealSteps(spot(k, n), foot, level, 0.92, level * PILE_DROP_MS, wait, { x: 0, y: -40 }), { z: 1 + level });
    });
    anims.forEach(a => a.pause());
    stacking = anims;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      anims.forEach(a => a.play());
    }, { threshold: 0.45 });
    io.observe(stage);
  }
})();
