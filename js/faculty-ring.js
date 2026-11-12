/* The faculty ring: the educators' carousel from version 6 (Solomon's design, ui/CircularCarousel and
   Faculty/EducatorFlow), ported to plain JavaScript for this page. Portrait cards stand round a ring, facing out,
   each bent to follow it, the camera looking a little down onto it. The card at the front is in colour; the rest
   are in black and white (colour on hover) and fade into the section's paper as they turn away.

   Each card, after the Figma card (VAR, 4102:399 "Photo"): the portrait fills it with 20px corners, a 200px scrim
   rises from the foot, and over it the name (Mukta SemiBold 18/25) and subject (Source Sans 3 Medium 14/23) in
   white beside the LinkedIn mark; at the top left, the years of experience on a compact orange seal.

   It turns by drag, a sideways trackpad swipe, the arrows beside the ring, the dots, the ← → keys or a click on a
   card; a throw keeps going a little, then settles square on a card. It plays on its own, one card every 4.5s
   (the first step 6s after it comes into view), pausing while the pointer is on the front card, while keyboard
   focus is inside it, while it is off screen or the tab is hidden. Reduced motion: no autoplay, moves are instant.

   The page is zoomed to fit (see the script at the top of index.html): pointer movement, measured in screen pixels,
   is divided by __z() to get CSS pixels. Styles: css/faculty-ring.css. */
(() => {
  const host = document.getElementById('facRing');
  if (!host) return;

  /* The educators, as in version 6 (src/data/faculty.ts). The qualifications, experience and introductions are
     placeholder copy written to show the layout: replace them with the institute's own wording before launch. */
  const EDUCATORS = [
    { name: 'SK Manocha', focus: 'General Studies · Polity & Governance', photo: 'sk-manocha', qualifications: 'Postgraduate, Political Science', experience: '20+ years teaching UPSC', introduction: 'Builds Polity from the Constitution up, and ties every topic to the way the examination asks about it.' },
    { name: 'Brijender Singh', focus: 'Essay', photo: 'brijender-singh', qualifications: 'Postgraduate, English Literature', experience: '15+ years teaching UPSC', introduction: 'Helps you find a clear argument, shape it into a structure and write it out within the time.' },
    { name: 'Md. Rizwan', focus: 'Geography optional', photo: 'md-rizwan', qualifications: 'Postgraduate, Geography', experience: '15+ years teaching UPSC', introduction: 'Teaches Geography through maps, diagrams and examples you can carry straight into the answer.' },
    { name: 'Md. Tarique', focus: 'History optional', photo: 'md-tarique', qualifications: 'Postgraduate, History', experience: '15+ years teaching UPSC', introduction: 'Turns long stretches of History into connected themes that are easier to revise and to write about.' },
    { name: 'Mukul Pathak', focus: 'Psychology optional', photo: 'mukul-pathak', qualifications: 'Postgraduate, Psychology', experience: '10+ years teaching UPSC', introduction: 'Links psychological theory to everyday examples, so the concepts stay with you in the examination hall.' },
    { name: 'Shyam Sundar', focus: 'Economics optional', photo: 'shyam-sundar', qualifications: 'Postgraduate, Economics', experience: '15+ years teaching UPSC', introduction: 'Explains Economics from first principles and then applies it to the questions India faces today.' },
  ];

  // The card and the ring, as in version 6 (EducatorFlow's settings).
  const W = 264, H = 381, GAP = 30, RADIUS_PX = 20, INTERVAL = 4500, ARROW_REACH = 523, SPACING = 28;
  const STRIPS = 8, MIN_CARDS = 10, TILT = -6, PERSPECTIVE = 2400;
  const SNAP_HAND = 9, SNAP_AUTO = 6.5, FIRST_STEP_MS = 6000, MOMENTUM = 0.28, MAX_SPEED = 10;

  const count = EDUCATORS.length;
  const slots = count * Math.max(1, Math.ceil(MIN_CARDS / count));
  const step = 360 / slots;
  const pitch = W + GAP;
  const radius = (slots * pitch) / (2 * Math.PI);
  const lift = -radius * Math.sin((-TILT * Math.PI) / 180) * 0.55;
  const stageHeight = Math.round(H + radius * Math.sin((-TILT * Math.PI) / 180) * 0.9 + 24);
  const mod = (n, m) => ((n % m) + m) % m;
  const zoom = () => (window.__z ? window.__z() : 1);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Each strip's place on its card's bend, measured from the card's centre.
  const strips = Array.from({ length: STRIPS }, (_, j) => {
    const wide = W / STRIPS;
    const angle = (-W / 2 + (j + 0.5) * wide) / radius;
    const before = j === 0 ? 0 : 1.5, after = j === STRIPS - 1 ? 0 : 1.5;
    return {
      width: wide + before + after,
      left: -wide / 2 - before,
      offset: j * wide - before,
      transform: `translate3d(${(radius * Math.sin(angle)).toFixed(3)}px, 0, ${(radius * Math.cos(angle) - radius).toFixed(3)}px) rotateY(${((angle * 180) / Math.PI).toFixed(3)}deg)`,
      round: j === 0 ? `${RADIUS_PX}px 0 0 ${RADIUS_PX}px` : j === STRIPS - 1 ? `0 ${RADIUS_PX}px ${RADIUS_PX}px 0` : '0',
    };
  });

  // The seal's serrated edge: 24 teeth round a 29px circle.
  const SEAL_EDGE = (() => {
    const teeth = 24, pts = [];
    for (let i = 0; i < teeth * 2; i++) {
      const r = i % 2 ? 27.4 : 29, a = (i / (teeth * 2)) * Math.PI * 2 - Math.PI / 2;
      pts.push(`${(29 + r * Math.cos(a)).toFixed(2)},${(29 + r * Math.sin(a)).toFixed(2)}`);
    }
    return `M${pts.join('L')}Z`;
  })();
  const yearsOf = e => (e && e.match(/^(\d+\+?)\s*years?\b/i) || [])[1] || null;

  // What is drawn over each card's portrait (bending with it, so it is repeated on every strip).
  const face = ed => {
    const years = yearsOf(ed.experience);
    const seal = years ? `<span class="fr__seal"><svg viewBox="0 0 58 58" width="58" height="58"><path d="${SEAL_EDGE}"/><circle cx="29" cy="29" r="22.5"/></svg><span class="fr__seal-t"><b>${esc(years)}</b><small>Yrs exp</small></span></span>` : '';
    return `${seal}<span class="fr__scrim"></span><span class="fr__ft"><span class="fr__tx"><span class="fr__n">${esc(ed.name)}</span><span class="fr__s">${esc(ed.focus)}</span></span><span class="fr__li"><img src="assets/img/icons/linkedin.svg" alt="" width="28" height="28" draggable="false"></span></span>`;
  };

  // The slide's content for assistive technology: the card itself is only the picture.
  const slideText = ed => `<h3>${esc(ed.name)}</h3><p>${esc([ed.focus, ed.qualifications, ed.experience, ed.introduction].filter(Boolean).join('. '))}</p>`;

  const ARROW = d => `<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="${d === 'prev' ? 'M16 10H4m5-5-5 5 5 5' : 'M4 10h12m-5-5 5 5-5 5'}"/></svg>`;

  // ---- Build ----
  host.setAttribute('role', 'region');
  host.setAttribute('aria-roledescription', 'carousel');
  host.setAttribute('aria-label', 'Our educators');
  host.tabIndex = 0;
  host.style.setProperty('--fr-sp', SPACING + 'px');

  let cardsHtml = '';
  for (let slot = 0; slot < slots; slot++) {
    const index = slot % count, ed = EDUCATORS[index], copy = slot >= count;
    const src = `assets/img/faculty/${ed.photo}-portrait.webp`;
    const faces = strips.map(s => `<span class="fr__strip" aria-hidden="true" style="left:${s.left}px;top:${-H / 2}px;width:${s.width}px;height:${H}px;transform:${s.transform}"><span class="fr__pic" style="border-radius:${s.round};background-image:url('${src}');background-size:${W}px ${H}px;background-position:${-s.offset}px 0"><span class="fr__face" style="left:${-s.offset}px;width:${W}px;height:${H}px">${face(ed)}</span><span class="fr__fade"></span></span></span>`).join('');
    const a11y = copy ? 'aria-hidden="true"' : `role="group" aria-roledescription="slide" aria-label="${index + 1} of ${count}"`;
    cardsHtml += `<div class="fr__card" data-slot="${slot}" ${a11y} style="transform:rotateY(${(slot * step).toFixed(3)}deg) translateZ(${radius.toFixed(2)}px)">${faces}${copy ? '' : `<div class="fr__sr">${slideText(ed)}</div>`}</div>`;
  }
  host.innerHTML = `
    <div class="fr__stage" style="height:${stageHeight}px">
      <span class="fr__floor" aria-hidden="true" style="top:${stageHeight / 2 + H / 2 - 18}px"></span>
      <div class="fr__view" style="perspective:${PERSPECTIVE}px"><div class="fr__cam"><div class="fr__ring">${cardsHtml}</div></div></div>
      <div class="fr__arrow" style="left:calc(50% - ${ARROW_REACH}px)"><button class="fr__btn" type="button" aria-label="Previous educator">${ARROW('prev')}</button></div>
      <div class="fr__arrow" style="left:calc(50% + ${ARROW_REACH}px)"><button class="fr__btn" type="button" aria-label="Next educator">${ARROW('next')}</button></div>
    </div>
    <div class="fr__dots" role="group" aria-label="Choose educator">${EDUCATORS.map((_, i) => `<button type="button" aria-label="Educator ${i + 1} of ${count}"></button>`).join('')}</div>
    <p class="fr__sr" aria-live="polite"></p>`;

  const stage = host.querySelector('.fr__stage');
  const cam = host.querySelector('.fr__cam');
  const ring = host.querySelector('.fr__ring');
  const cards = [...host.querySelectorAll('.fr__card')];
  const dots = [...host.querySelectorAll('.fr__dots button')];
  const live = host.querySelector('[aria-live]');
  const [prevBtn, nextBtn] = host.querySelectorAll('.fr__btn');

  // Far cards fade into the section's paper.
  const sectionBg = getComputedStyle(host.closest('section') || document.body).backgroundColor;
  host.style.setProperty('--fr-paper', sectionBg && sectionBg !== 'rgba(0, 0, 0, 0)' ? sectionBg : '#fff8ec');

  // ---- The loop: the ring's spring, the autoplay clock and the depth fades ----
  const s = { pos: 0, vel: 0, target: 0, stiffness: SNAP_HAND, held: false, clock: 0 };
  const f = { playing: !reduced, onScreen: false, hover: false, focus: false };
  let front = -1, frame = 0, last = 0;
  const depths = [];

  const setFront = slot => {
    if (slot === front) return;
    if (front >= 0) cards[front].classList.remove('is-front');
    front = slot;
    cards[front].classList.add('is-front');
    f.hover = false;   // a card that turns away from under a still pointer never gets its pointerleave
    const active = mod(front, count);
    dots.forEach((d, i) => {
      d.classList.toggle('is-on', i === active);
      if (i === active) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      const fill = d.querySelector('i');
      if (i === active && !fill && f.playing) d.insertAdjacentHTML('beforeend', '<i aria-hidden="true"></i>');
      if (i !== active && fill) fill.remove();
    });
  };

  const draw = () => {
    ring.style.transform = `rotateY(${(-s.pos * step).toFixed(3)}deg)`;
    cam.style.transform = `translate3d(0, ${lift.toFixed(1)}px, ${(-radius).toFixed(1)}px) rotateX(${TILT}deg)`;
    for (let i = 0; i < slots; i++) {
      const turn = ((mod(i - s.pos + slots / 2, slots) - slots / 2) * step * Math.PI) / 180;
      const depth = ((1 - Math.cos(turn)) / 2).toFixed(3);
      if (depths[i] === depth) continue;
      depths[i] = depth;
      cards[i].style.setProperty('--fr-depth', depth);
    }
    setFront(mod(Math.round(s.pos), slots));
  };

  const tick = time => {
    const dt = last ? Math.min(0.05, (time - last) / 1000) : 1 / 60;
    last = time;
    let busy = false;
    if (!s.held) {
      if (reduced) { s.pos = s.target; s.vel = 0; }
      else {
        const k = s.stiffness;
        s.vel += (k * k * (s.target - s.pos) - 2 * k * s.vel) * dt;
        s.pos += s.vel * dt;
        if (Math.abs(s.target - s.pos) < 0.003 && Math.abs(s.vel) < 0.02) { s.pos = s.target; s.vel = 0; } else busy = true;
      }
    } else busy = true;

    const counting = f.playing && f.onScreen && slots > 1;
    if (counting) {
      busy = true;
      if (!f.hover && !f.focus && !s.held && !document.hidden) s.clock += dt * 1000;
      if (s.clock >= INTERVAL) { s.clock = 0; s.target = Math.round(s.target) + 1; s.stiffness = SNAP_AUTO; }
    }
    const fill = host.querySelector('.fr__dots .is-on i');
    if (fill) fill.style.transform = `scaleX(${counting ? Math.max(0, Math.min(1, s.clock / INTERVAL)).toFixed(4) : 0})`;

    draw();
    frame = busy ? requestAnimationFrame(tick) : 0;
    if (!busy) last = 0;
  };
  const kick = () => { if (!frame) frame = requestAnimationFrame(tick); };

  const announce = () => {
    const index = mod(Math.round(s.target), count), ed = EDUCATORS[index];
    live.textContent = `${index + 1} of ${count}: ${ed.name}, ${ed.focus}`;
  };
  const move = (by, byHand) => {
    if (!by) return;
    s.clock = 0; s.held = false;
    s.target = Math.round(s.target) + by;
    s.stiffness = SNAP_HAND;
    kick();
    if (byHand) announce();
  };
  const offsetTo = slot => mod(slot - Math.round(s.target) + Math.floor(slots / 2), slots) - Math.floor(slots / 2);
  const goTo = index => move(mod(index - mod(Math.round(s.target), count) + Math.floor(count / 2), count) - Math.floor(count / 2), true);

  // ---- Controls ----
  prevBtn.addEventListener('click', () => move(-1, true));
  nextBtn.addEventListener('click', () => move(1, true));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  host.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    move(e.key === 'ArrowRight' ? 1 : -1, true);
  });
  host.addEventListener('focusin', e => { if (e.target.matches(':focus-visible')) f.focus = true; });
  host.addEventListener('focusout', e => { if (!host.contains(e.relatedTarget)) f.focus = false; });

  // Only the pointer on the front card holds the autoplay.
  ring.addEventListener('pointerover', e => { const c = e.target.closest('.fr__card'); if (c && c.classList.contains('is-front') && e.pointerType === 'mouse') f.hover = true; });
  ring.addEventListener('pointerout', e => { const c = e.target.closest('.fr__card'); if (c && !c.contains(e.relatedTarget)) f.hover = false; });

  // Drag: a mostly sideways drag takes hold of the ring; a mostly vertical one is the page's scroll.
  let drag = null, swallowClick = false;
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('.fr__btn')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, pos: s.pos, moved: false, trail: [] };
    swallowClick = false;
  });
  stage.addEventListener('pointermove', e => {
    const d = drag;
    if (!d || d.id !== e.pointerId) return;
    const dx = (e.clientX - d.x) / zoom(), dy = (e.clientY - d.y) / zoom();
    if (!d.moved) {
      if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
        d.moved = true; d.pos = s.pos; s.held = true; s.vel = 0;
        stage.setPointerCapture(e.pointerId);
        stage.classList.add('is-grabbing');
        kick();
      } else { if (Math.abs(dy) > 10) drag = null; return; }
    }
    s.pos = d.pos - dx / pitch;
    s.target = s.pos;
    const now = performance.now();
    d.trail.push({ t: now, pos: s.pos });
    while (d.trail.length > 2 && now - d.trail[0].t > 90) d.trail.shift();
  });
  const release = () => {
    const d = drag;
    drag = null;
    stage.classList.remove('is-grabbing');
    if (!d || !d.moved) return;
    const a = d.trail[0], b = d.trail[d.trail.length - 1];
    const span = a && b ? (b.t - a.t) / 1000 : 0;
    const speed = span > 0.02 ? Math.max(-MAX_SPEED, Math.min(MAX_SPEED, (b.pos - a.pos) / span)) : 0;
    s.held = false;
    s.vel = reduced ? 0 : speed;
    s.target = Math.round(s.pos + speed * MOMENTUM);
    s.stiffness = SNAP_HAND;
    s.clock = 0;
    swallowClick = true;
    kick();
    announce();
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('click', e => {
    if (swallowClick) { swallowClick = false; e.preventDefault(); e.stopPropagation(); return; }
    const el = e.target.closest('[data-slot]');
    if (!el) return;
    const by = offsetTo(Number(el.dataset.slot));
    if (by) { e.preventDefault(); move(by, true); }
  }, true);

  // A sideways trackpad swipe turns the ring like a drag (the page's smooth scroll is told to leave it alone).
  let wheelTimer = 0;
  stage.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.lenisStopPropagation = true;
    e.preventDefault();
    s.held = true; s.vel = 0;
    s.pos += (e.deltaX * (e.deltaMode === 1 ? 16 : 1)) / pitch;
    s.target = s.pos;
    s.clock = 0;
    kick();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { s.held = false; s.target = Math.round(s.pos); s.stiffness = SNAP_HAND; kick(); announce(); }, 140);
  }, { passive: false });

  // On screen: the autoplay counts only then; the first step waits FIRST_STEP_MS after it first comes into view.
  let seen = false;
  new IntersectionObserver(([entry]) => {
    f.onScreen = entry.isIntersecting;
    if (entry.isIntersecting && !seen) { seen = true; s.clock = Math.min(0, INTERVAL - FIRST_STEP_MS); }
    kick();
  }, { threshold: 0.25 }).observe(stage);
  document.addEventListener('visibilitychange', kick);

  draw();
  kick();
})();
