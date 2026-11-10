# Vajiram-ravi

The Vajiram & Ravi homepage, built with Next.js (App Router, React, TypeScript) and Tailwind CSS v4.
It is built from the Figma frame "the final design" and its motion spec, one component per section.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm start          # serve out/ at http://localhost:3000, the way Netlify will
npm run typecheck
```

The npm scripts call `node node_modules/...` directly instead of the usual `next dev`.
On Windows, npm's command shims break when the project path contains `&`, as `D:\vajiram&ravi` does.

## Deploy

The site is a static export. `npm run build` writes plain HTML, CSS, JS and images to `out/`, and any static host can serve that folder.

- **Netlify from GitHub:** connect the repo and deploy. `netlify.toml` sets the build command, the `out` publish folder and Node 22, and it overrides the settings in the Netlify UI.
- **Netlify drag-and-drop:** run `npm run build`, then drag the `out` folder onto the Netlify deploys page. Dragging the project folder or `.next` gives a 404, because neither has an `index.html` at the top.
- **Vercel from GitHub:** `vercel.json` tells Vercel to run `npm run build` and serve the static `out` folder, whatever the project's dashboard settings say. Every push to a branch gets its own deployment; the project's production address follows its production branch.

`netlify.toml` also turns off Netlify's Next.js adapter with `NETLIFY_NEXT_PLUGIN_SKIP`. The adapter is for server-rendered sites and would reject `out` as the publish folder.

## Layout of the code

```
src/
  app/
    layout.tsx        fonts (Mukta, Source Sans 3, Geist Mono), metadata, header and footer
    page.tsx          the homepage: sections in the order of the client's information architecture
    globals.css       Tailwind import, colour and motion tokens, base rules, keyframes, reveal classes
  components/
    layout/           SiteHeader (main header with mega menus, announcement ticker),
                      LetsTalkSheet, SearchDialog, SiteFooter, Preloader (the intro),
                      PageTransition (the curtain before leaving the page)
    sections/         one folder per section: the component and any client parts
      Hero/ Journey/ About/ Programmes/
      Admissions/ (batches and the counselling form) Faculty/ (educators) SuccessStories/
      FreeResources/ Faq/ Contact/ (locations) ClosingCta/
    ui/               shared pieces: Cta, IndianLink, Medallion, TraditionalTabs, CrossFade,
                      CarouselControls, Ornament, CountUp, Photo, Icon, LinkOrText,
                      ScrollReveal, SmoothScroll, CanvasFit, Toast, PointerGlow, CursorLabel,
                      NoteCard, ProgressRule
  data/               all copy, lists and links, one file per section; links.ts holds every external link
  lib/                small helpers (canvas zoom, motion, the shared reveal observer, hover classes,
                      smooth scroll, in-view hook, photo parallax)
public/images/        logo, photos, illustrations, ornaments and icons
scripts/serve-out.mjs preview server for the static export (npm start)
scripts/course-art.py  draws the programme cards' illustrations into public/images/courses/art
netlify.toml          Netlify build settings
```

To change content, edit the files in `src/data`. To change a section's look, edit the Tailwind classes in its component.

## Design source

- **Layout:** the Figma frame of the new version (file `TMjGmOJSfBGEgGxfO2JqMU`, node `2377:4172`, 1440 × 9,368px), laid out in the order of the client's homepage IA of 10 Nov 2026 and filled with the client's homepage content of the same day. The design's own inconsistencies are evened out into one system (see Styling): one button, one heading face and scale, palette colours only. The preparation journey has no frame and is drawn in the same language. The shared components follow "CTA / Indian" (`2262:5786`) and the ornament eyebrows (`2104:3626`, `2104:3616`).
- **Motion:** the "V&R Homepage — Motion & Interaction Spec" (5 Nov 2026): one set of motion tokens, seven shared component behaviours, and a few named moments per section.
- **Motion references:** a later round of effects follows animation references the client picked. Each one is fitted into the existing layout, so nothing moves or resizes:
  - Skiper UI: the parallax image (skiper55) for photos, the scroll-drawn SVG line (skiper19) for the thread in "Why Vajiram & Ravi", the gradient hover card (skiper90) for the glow on the faculty cards, and the hover-members cursor follower (skiper6) for the cursor labels.
  - Unlumen "Animate Digits" for the stats, "Tilt Card" for the reason and faculty cards and "Dia Text Reveal" for the heading emphasis, Uilora "Stroke Fill" for the footer wordmark, the AutoAE "3D spin" for the seal and stamp, and chanhdai "Icon Swap" for the button spinner.
  - React Bits "Aurora" was tried in the hero and taken out at the client's request.
  - Homepage v2: a pinned scroll film (text reveal, stack, arc, gradient carousel) for the about cards, the `kevin` branch's book wall for the courses, a ring after React Bits "Circular Gallery" for the educators, and a pinned scroll for the preparation journey. Some effects of the earlier round went with the sections they belonged to (the why-section thread and tilt, the hero aurora).
  - Not used: the Skiper UI card stacks (skiper16, skiper17), which scale sections as they stack and would change the layout, and the Apple-style navbar (skiper75), which would replace the header. animos, originkit, the animmasterlib sliders and the Framer marketplace gave no single effect to take.
- **Earlier designs:** the "final design" (`2258:10453`), V8 and the "new modern design" are replaced. The final design's build is commit `634d371`; the older two are kept under `refs/backups/v8` and `refs/backups/pre-v8`.

## Styling

- Everything is styled with Tailwind utilities in the components. There are no per-component CSS files.
- The palette is a set of theme tokens in `src/app/globals.css`, and the default Tailwind colours are switched off:
  - `ink` (dark text, primary buttons), `mahogany` (the darkest band), `clay` (secondary text)
  - the papers `paper`, `cream` and `parchment`
  - `saffron` (buttons and emphasis on dark, the focus ring), `burnt` (links and active states on light), `orange` (eyebrow labels)
- The type is Mukta for headings (`font-heading`; it has no italic, so emphasis words are set apart by colour), Source Sans 3 for text and UI (`font-sans`), and Geist Mono for eyebrows and labels (`font-mono`). No other fonts. All load with next/font and are bundled into the build.
- **Motion tokens** are CSS variables on `:root`:
  - durations `--dur-instant` (120ms), `--dur-fast` (200ms), `--dur-base` (320ms), `--dur-slow` (600ms) and `--dur-ambient` (40s)
  - distances `--rise` (24px), `--rise-sm` (8px) and `--lift` (−4px), and `--stagger` (60ms)
  - the easings `ease-out`, `ease-in-out` and `ease-in`, and the shadows `shadow-rest` and `shadow-hover`, as Tailwind utilities
  - Components use these, not hand-picked values. Only transform, opacity, filter and clip-path animate (plus colours on hover); the FAQ accordion's row height is the one exception.
- **Shared components** carry almost every interaction:
  - `ui/Cta`: the button, in five variants and two sizes, with hover, press, disabled and loading states. Its character comes from the page: a fine dash-dot thread stitched inside its edge (the journey thread's rhythm); on hover a sunrise, a bright core at the arrow warming the button to a more vivid tone with a saffron halo at its rim and a glow beneath, while the thread marches and the arrow passes through; on press the ripple and pulse shared with the carousel arrows (`lib/pressRipple`).
  - `ui/IndianLink`: a text link with the scalloped arrow medallion and a drawn underline.
  - `ui/Medallion`: while hovered, the scalloped flower turns round and round (a turn every 4 seconds) and the arrow holds still. When the pointer leaves, the flower stops where it is. The contact cards' icon medallions turn the same way.
  - `ui/TraditionalTabs`: the site's tabs, a segmented control: a cream track with a burnt pill that slides under the chosen tab, used with `ui/CrossFade` for the content below.
  - `ui/CarouselControls`: the arrows (an outline at rest, dark only on hover, with a ripple and a ring pulse when pressed, the same on every carousel) and the stretching dots.
  - `lib/hover`: the card lift, shadow and image zoom.
- **Section reveals** are data attributes that `ui/ScrollReveal` plays once, when 20% of a section is in view:
  - `data-reveal="heading"`, with `data-reveal-em` on the italic words that arrive 120ms later
  - `"sub"` for the sub text, and `data-reveal` / `"sm"` / `"fade"` or `data-reveal-group` for content, staggered 60ms
  - The eyebrows reveal themselves: their rules grow out from the label.
  - Once the italic words are in, a soft light sweeps across them once. They keep their own colour before and after.
  - One-off moments (stamps, wipes, flips, the FAQ scroll) use `whenVisible` from `lib/reveal`. That is the page's single IntersectionObserver.
- **Effects that follow the pointer or the scroll** are shared too, and run only with a mouse or trackpad and with motion allowed:
  - `lib/parallax`: a photo drifts inside its fixed frame as the frame crosses the screen, on a scroll-driven animation (no scroll handler).
  - `ui/PointerGlow`: a soft glow follows the pointer inside a card (the faculty cards).
  - `ui/ProgressRule`: a carousel's progress line as an ornamented rule: a hairline between two diamonds, filled saffron to burnt up to the share seen so far, with a butta flower at the fill's end.
  - `ui/CursorLabel`: a small saffron label follows the pointer over a carousel ("Drag", or "View" over a linked card).

## How it behaves

- The design is a fixed 1440px canvas. On narrower screens the page is zoomed down to fit; the zoom factor is also available to CSS as `--canvas-zoom`. There is no separate mobile layout yet.
- **Opening intro:** on every load, a reload included, a mahogany curtain covers the page for a moment, then lifts with a curved edge and the hero enters behind it, about 1.1 seconds in all (`layout/Preloader`). The page stays still under it. A page restored with the browser's back button does not replay it.
- **Header:** sticky, and out of the way while reading (the mahogany contact strip that sat above it was removed at the client's request). It is whole at the top of the page; scrolling down past 80px slides it out of view, and scrolling back up brings it back. It stays while it holds the keyboard focus or a menu is open.
  - Nav links turn burnt with a soft burnt pill behind them. The link of the section in view keeps it.
  - All Courses, Study Materials and UPSC Exam open mega menus, on hover after 120ms or on click and Enter; Escape closes them.
  - "Let's talk" is the site's own ink button with the phone in its saffron medallion. It opens a sheet with the ways to reach the admissions team, and its phone rings once on the first hover.
  - The announcement ticker loops every 40 seconds and pauses on hover and focus.
- **Search:** ⌘K or Ctrl+K anywhere opens a search box over the page's own data (`src/data/search.ts`).
- **Page transitions:** leaving the page for another (a programme, the selections page) a mahogany curtain with the emblem rises from the foot of the screen before the browser goes on; it is the closing twin of the intro. In-page links, new tabs, phone and email links go through untouched.
- **Hero:** the toppers' slideshow from the `kevin` branch's hero, in this site's type and colours. On the orange gradient of Figma 2484:4261, a large rounded panel in which the top three of UPSC CSE 2025 follow one another in wide portraits: each pushes in slowly for 6.5 seconds and cross-fades to the next. The rank is the loudest thing on it: "AIR 01" large and bold in saffron in the top right corner, clear of every portrait, while the headline stays white. Over it, the pill (a bold saffron "CSE 2025 results" badge, the topper's line gliding past, to the selections page), the client's headline, the lead and the two buttons; dots at the foot of the panel show which topper is on, fill with the slide's time and jump to a topper; a pause button appears when reached with the keyboard. Under the panel, with room above and below, the four points of Figma's stats bar (2425:51305): 50+ years of experience since 1976, 59 questions reflected in Prelims, 10/10 top rankers from V&R courses and 36/50 CSE 2025 rankers, each figure in a cream laurel (the figures roll in; the laurels sway gently, out of step, while the hero is on screen). The slideshow starts once the intro curtain has lifted.
- **Preparation journey:** the centred heading (no lead paragraph), then the three stages, Prelims, Mains and Interview, as medallions on a garland thread that runs in from past the left edge of the screen and out past the right, over the chosen stage's panel and its card "How Vajiram & Ravi supports you" (key words in bold, not colour). The whole band pins to the screen while the page scrolls through the stages one after another; the thread fills with the scroll, and through the Interview it runs on out to the screen's edge, so the last stage moves as visibly as the others. Then it lets go. Choosing a stage on the rail glides the page to it. The heading rises in letter by letter, the Ashoka dome behind it rises slowly through the run, the chosen medallion's halo breathes, and the Prelims figures (300+, 900+, 18, 30) count up when first seen.
- **About:** on a deep orange band with Parliament House blended into its colour, the logo's round mark (no plate, in a soft halo of light), the one-sentence heading "Five decades of experience, a dedicated academic team and a legacy in Civil Services preparation." and a three-line lead, then the six cards in a coverflow (`ui/Coverflow`) projected outward like the Parliament colonnade: the centre card large and open in its dark look with its sentence, the side cards smaller, turned away and showing only their title. It plays on its own (pausing on hover, focus and off screen, with a pause button), and the arrows, dots, arrow keys, swipe or a click on a side card move it. The band opens out from an inset card as it rises in, Parliament House drifts against the scroll, the heading's light words catch a light now and then, the cards rise into place with the scroll and a warm light breathes at the head of the centre card. Reduced motion: no autoplay or entrance.
- **Programmes:** in the `kevin` branch's copy (`src/data/programmes.ts`), on the cream of the journey band: the heading, then the flagship General Studies Prelims & Mains Programme on a card in the hero's orange gradient: a "Flagship programme" pill after the hero's, with the admissions line gliding through it (admissions open, the next batch's start date and the days to go, from `data/admissions.ts`); classroom and campus photographs fading from one to the next (placeholders until real classroom photos come); three short benefits, learning options and duration; "Enrol for the programme" (opens the counselling form with the programme chosen) and "View programme details". Then the course shelf: category chips (All, Foundation, Optional, Tests, Guidance) over two walnut planks built in CSS, with kevin's eight programme groups as cloth-bound books (spine, page block, gold frame and emblem), each with the earlier wall's geometric motif pressed faintly into its cloth. On hover the cloth grows brighter and more vivid, the motif moves, the foil brightens and a band of light sweeps across. Filtering sinks the outgoing books and slides the rest along the plank; with four or fewer the shelf closes up to one plank. A hovered book lifts; choosing one opens it as before (a round close button at its top right corner, besides Escape or a click away), its pages turning through the group, a page per course, then the way to all of them on vajiramandravi.com. Under the shelf, the card pointing to the counsellors. Course counts and lines are kevin's and still to be confirmed. Motion: the collage drifts down slowly behind the flagship card and its lotus turns with the scroll; the card's name rises letter by letter, its points come in one by one, its detail labels settle out of shuffling type and the duration counts up; now and then a glint of the foil passes across one of the books.
- **Batches:** on cream, the featured General Studies batch as a long ticket with its "Admissions open" stamp, then the mode and month tabs and the ticket rail of the other batches (General Studies is not repeated there), each ticket with its own faint line drawing (`Admissions/TicketArt`). Hovering a ticket lifts it a little. "Register now" scrolls to the counselling form and fills in the programme. The lead on the note card lights up word by word with the scroll, the featured ticket's labels settle out of shuffling type, and once down, the stamps give a short wobble every few seconds while the band is on screen.
- **Counselling:** the client's six-field postcard with a rubber ink stamp (`Admissions/InkStamp`), on a deep orange ground with a faint lattice, darker behind the white heading and at the sides, lighter behind the card. Fields have outlined floating labels that move up onto the border as you type; the mobile number has no +91 prefix. The card slides in and settles and the stamp presses with an ink ring. Fields validate as you leave them; submitting sends the card with a postmark. The form does not send anything yet: `src/components/sections/Admissions/submitEnquiry.ts` is where a form service plugs in.
- **Educators:** the same coverflow as About with the portraits: the centre one large and in colour, the rest smaller, turned away and black and white until hovered, and under the centre card the educator's name, subject, introduction and qualifications, cross-fading as it changes. The coverflow rises into place with the scroll.
- **Student stories:** the students' words on postcards, turning on a 3D ring after the `kevin` branch's stories: the front postcard flat, those either side turned away and set back. The next comes round every 4.5 seconds, pausing under the pointer or focus; the arrows, a click on a side postcard, the arrow keys and a swipe turn it too. The postcards fan out from the front one as the ring comes into view; with the scroll the ring floats up a little faster than the page and the postmarks' rings turn. Two are the toppers' stories; four are dummy stories (kevin's sample students) to be replaced. The heading names the toppers and alumni, and each postmark shows "AIR" over the rank (a placeholder story without a rank shows the exam year).
- **Free study material:** a broadsheet front page on the cream: a masthead with the Vajiram & Ravi logo between two ears, a dateline (volume, issue and the reader's date) between double rules, the newspaper headline with a drop-cap standfirst and a pull-quote, then three columns (Prelims pointers, Mains articles & editorial analysis, UPSC study materials) with section labels, bylines, black headings and a halftone lead photo each, the client's link at the foot of each, "Other free resources" and a folio. The page prints in as the band arrives, its small mono labels settling out of shuffling type, and the halftone photos drift in their frames with the scroll. The headlines are a snapshot of vajiramandravi.com's latest articles (14 Nov 2026), to be fed from the CMS; the bylines and ears are format labels for the client to approve.
- **FAQ:** the client's seven questions; the Vajiram & Ravi rubber stamp from the counselling postcard presses on beside the heading. One answer open at a time, the open one on a tinted panel with a burnt bar down its edge and the question in semibold; every answer is in the page's HTML and its FAQPage structured data. The campus section follows (`#locations`), shorter than before: the heading and lead, a cream details tile with the city tabs at its head, and the street map with "View on maps" beside a gallery of three photographs of the institute (placeholders until real campus photos come), uncovered from their foot up one after another as the grid comes in and drifting in their frames with the scroll. The FAQ seal turns a little with the scroll.
- **Text, section, scroll and ambient motion (the whole page):** after wabcoffeeco.com (`ui/TextMotion`), set by data attributes and run by one requestAnimationFrame loop (it runs when the page scrolls, and keeps going only while a figure counts or a label shuffles). Only transform, opacity, filter and clip-path change, and nothing is hidden before the script runs.
  - **Text:** headings (`data-split`) rise in letter by letter out of a mask per word as they reach 82% of the screen, every section's h2 included (the journey's too), and then drift a few pixels against the scroll; lead paragraphs (`data-words`) fill in word by word as they rise into the screen, from 40%, and stay lit; small mono labels (`data-scramble`) settle out of shuffling glyphs, left to right, like a departure board; figures (`data-count`) count up from 0 the first time they are seen, their width held so the line never moves.
  - **Entrances:** cards rise and grow into place (`data-zoom`), lists come in one by one (`data-stagger`), photos are uncovered from their foot up while they settle from 112% (`data-wipe`), and large blocks (the two coverflows) rise, grow and brighten into place as they come up the lower half of the screen, scrubbed with the scroll (`data-rise`). The about, counselling, free study material, locations and closing bands open out from a slightly inset, rounded card as they rise in (`data-curtain`).
  - **Scroll-linked:** photos drift against the scroll inside their frames (`data-par`, 6% or the amount given): Parliament House in About, the featured programme's photographs, the newspaper's halftones and the campus gallery. Decoration drifts and ornaments turn over their section's crossing of the screen (`data-drift`, `data-turn`): the Ashoka dome in the journey, the newspaper collage behind the programmes, the stories' postcard ring and postmarks, the flagship card's lotus and the FAQ seal.
  - **The scroll thread:** a slim dash-dot line across the top of the screen, in the journey thread's rhythm, fills orange to burnt with the share of the page read, a small saffron lozenge riding at its end. It fades in once the page has moved.
  - **Ambient loops:** slow, small and only while their section is on screen. TextMotion sets `--lp: running` on a section in view, and the loop classes in `globals.css` take their play state from it; otherwise they hold their first frame, the element at rest. The hero's laurels sway, out of step (`.lp-sway`); the chosen journey medallion's halo breathes (`.lp-breathe`); a warm light breathes at the head of the About centre card (`.lp-glow`); the "Limited seats" and "Admissions open" stamps give a short wobble now and then (`.lp-wobble`); a glint of gold light passes across a book's cover from time to time (`.lp-glint`); and the coloured emphasis words of the headings catch a soft light that runs through them letter by letter every 10 seconds (`.tm-glint`, a brightness and faint gold glow; the About heading's light words too, `data-sweep`).
  - Screen readers get each heading whole. Reduced motion turns it all off: no letters, words, labels or figures move, nothing drifts, wipes or loops, and the thread is not drawn.
- **Closing banner and footer:** the banner plays. The scroll scrubs its sunrise: as the band comes up the screen the sun, its rays and glow rise from below the horizon into place, the halo rings scale and fade in from the inside out, and the sky warms out of dusk. With a mouse over the band the sun and its glow follow the pointer on a lagged spring, the rings at falling depths; the rays turn faster, the glow warms, a soft light follows the pointer, and the heading's letters lift and lean towards it as it passes. A click or tap anywhere but the buttons sends a halo ripple out from the point and makes the sun flash (on touch there is the tap ripple and no follow). While on screen a wave of light runs out through the rings and the glow breathes; all of it runs on one animation-frame loop, only while the band is on screen, and with reduced motion the art is simply in place and still. Its main button is the saffron one used on the orange counselling band. The footer holds the brand line, the contact block (both campuses, phone, email) and the Explore, Resources and Support columns; under them the wordmark, large and bold, with photographs of the institute panning and cross-fading through its letters.
- **Smooth scrolling:** the page scrolls with Lenis (`ui/SmoothScroll`). In-page links glide to their section and land under the 120px sticky header, and the page holds still while the search or the "Let's talk" sheet is open.
- **Opening at the hero:** the page always opens at the top. A head script (`startAtTopScript` in `lib/smoothScroll`) turns off the browser's scroll restoration and drops a section hash from the address.
- **Reduced motion:** reveals become a 150ms fade without movement, counters show their final numbers, carousels do not move on their own, and ambient loops (the hero's slideshow, ticker, pin, the closing banner's wave, rays and sun glow, the medallion flowers, and TextMotion's laurels, halo, card glow, stamp wobble, foil glint and emphasis light) stay still. TextMotion's letters, words, labels, figures, wipes, drifts and scroll thread are all off. There is no intro, page curtain, deal, spread, ring roll, parallax, tilt, glow, cursor label or spin, and the heading emphasis keeps its colour without the sweep. The journey still follows the scroll, its stages changing without the rise.
- **Accessibility:** every control is a real link or button with the saffron focus ring. Tabs follow the WAI-ARIA tabs pattern, accordion rows are buttons with `aria-expanded`, carousel arrows are labelled and slides are announced as "3 of 10", and decorative art is hidden from screen readers.
- The footer's last line is never scroll-revealed, and nothing in the last screen of the page is pre-hidden, so the foot of the page always shows.
- Every link that leaves the page is in `src/data/links.ts`, checked against vajiramandravi.com. A page that does not exist yet is `null` there and its link renders as plain text. There are no `href="#"` links.
- Images are served as webp and svg files. Next.js image resizing needs a server, so it is off.

## Content still to confirm

- Placeholders, marked `TODO: placeholder` in the data: the featured GS 2028 batch's start date (`src/data/admissions.ts`), and the educators' qualifications, experience and introductions, which are made-up statements about real people and must be replaced before launch (`src/data/faculty.ts`).
- Pages the live site does not have yet: faculty, student stories, Prelims Pointers (it opens the Prelims current affairs), a test-series hub (it opens the Prelims test series), grievance redressal (`src/data/links.ts`). "Meet our faculty" and "Watch student stories" stay hidden until their pages exist.
- More student stories: only two are in `src/data/stories.ts`; a third turns the postcards into a carousel.
- Social media links for the footer: the live site lists none.
- Real maps for both campuses, a Chennai landmark and metro note, and whether its hours match New Delhi's (`src/data/contact.ts`).
- The batch dates and seat flags (`src/data/admissions.ts`; "SMART Current Affairs Program 2026" targets a year that has passed).
