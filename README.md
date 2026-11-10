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
    layout.tsx        fonts (Newsreader, Hanken Grotesk, Geist Mono), metadata, header and footer
    page.tsx          the homepage: sections in the order of the client's information architecture
    globals.css       Tailwind import, colour and motion tokens, base rules, keyframes, reveal classes
  components/
    layout/           SiteHeader (utility bar, main header with mega menus, announcement ticker),
                      LetsTalkSheet, SearchDialog, SiteFooter and FooterSkyline, Preloader (the intro),
                      PageTransition (the curtain before leaving the page)
    sections/         one folder per section: the component and any client parts
      Hero/ Journey/ About/ Programmes/
      Admissions/ (batches and the counselling form) Faculty/ (educators) SuccessStories/
      FreeResources/ Faq/ Contact/ (locations) ClosingCta/
    ui/               shared pieces: Cta, IndianLink, Medallion, TraditionalTabs, CrossFade,
                      CarouselControls, Ornament, CountUp, Photo, Icon, LinkOrText,
                      ScrollReveal, SmoothScroll, CanvasFit, Toast, PointerGlow, CursorLabel,
                      NoteCard, ProgressRule, DoubleRuleFrame, BlockPrintBand
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
  - Skiper UI: the words preloader (skiper8) for the intro, the parallax image (skiper55) for photos, the scroll-drawn SVG line (skiper19) for the thread in "Why Vajiram & Ravi", the gradient hover card (skiper90) for the glow on the faculty cards, and the hover-members cursor follower (skiper6) for the cursor labels.
  - Unlumen "Animate Digits" for the stats, "Tilt Card" for the reason and faculty cards and "Dia Text Reveal" for the heading emphasis, Uilora "Stroke Fill" for the footer wordmark, the AutoAE "3D spin" for the seal and stamp, and chanhdai "Icon Swap" for the button spinner.
  - React Bits "Aurora" was tried in the hero and taken out at the client's request.
  - Homepage v2: animos "spread rows" for the about cards, the `kevin` branch's book wall for the courses, a ring after React Bits "Circular Gallery" for the educators, and a pinned scroll for the preparation journey. Some effects of the earlier round went with the sections they belonged to (the why-section thread and tilt, the hero aurora).
  - Not used: the Skiper UI card stacks (skiper16, skiper17), which scale sections as they stack and would change the layout, and the Apple-style navbar (skiper75), which would replace the header. animos, originkit, the animmasterlib sliders and the Framer marketplace gave no single effect to take.
- **Earlier designs:** the "final design" (`2258:10453`), V8 and the "new modern design" are replaced. The final design's build is commit `634d371`; the older two are kept under `refs/backups/v8` and `refs/backups/pre-v8`.

## Styling

- Everything is styled with Tailwind utilities in the components. There are no per-component CSS files.
- The palette is a set of theme tokens in `src/app/globals.css`, and the default Tailwind colours are switched off:
  - `ink` (dark text, primary buttons), `mahogany` (the darkest band), `clay` (secondary text)
  - the papers `paper`, `cream` and `parchment`
  - `saffron` (buttons and emphasis on dark, the focus ring), `burnt` (links and active states on light), `orange` (eyebrow labels)
- The type is Newsreader for headings, with its italic for the emphasis words (`font-serif`), Hanken Grotesk for text and UI (`font-sans`), and Geist Mono for eyebrows and labels (`font-mono`). No other fonts. All load with next/font and are bundled into the build.
- **Motion tokens** are CSS variables on `:root`:
  - durations `--dur-instant` (120ms), `--dur-fast` (200ms), `--dur-base` (320ms), `--dur-slow` (600ms) and `--dur-ambient` (40s)
  - distances `--rise` (24px), `--rise-sm` (8px) and `--lift` (−4px), and `--stagger` (60ms)
  - the easings `ease-out`, `ease-in-out` and `ease-in`, and the shadows `shadow-rest` and `shadow-hover`, as Tailwind utilities
  - Components use these, not hand-picked values. Only transform and opacity animate (plus colours on hover); the FAQ accordion's row height is the one exception.
- **Shared components** carry almost every interaction:
  - `ui/Cta`: the button, in four variants and two sizes, with hover, press, disabled and loading states.
  - `ui/IndianLink`: a text link with the scalloped arrow medallion and a drawn underline.
  - `ui/Medallion`: while hovered, the scalloped flower turns round and round (a turn every 4 seconds) and the arrow holds still. When the pointer leaves, the flower stops where it is. The contact cards' icon medallions turn the same way.
  - `ui/TraditionalTabs`: diamond separators and a sliding rule-diamond-rule indicator, used with `ui/CrossFade` for the content below.
  - `ui/CarouselControls`: the arrows and the stretching dots.
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
  - `ui/BlockPrintBand`: the block-print strip of diamonds between two rules that edges several bands, repeated across the full width of the screen.
  - `ui/DoubleRuleFrame`: the double-rule frame with corner diamonds of the batches and FAQ bands, drawn to the band's size, which can draw itself in.
  - `ui/CursorLabel`: a small saffron label follows the pointer over a carousel ("Drag", or "View" over a linked card).

## How it behaves

- The design is a fixed 1440px canvas. On narrower screens the page is zoomed down to fit; the zoom factor is also available to CSS as `--canvas-zoom`. There is no separate mobile layout yet.
- **Opening intro:** on every load, a reload included, "Namaste" appears in ten Indian scripts: the first holds, the others follow at an even beat, and the closing "Namaste" holds again. Then the curtain lifts with a curved edge and the hero enters behind it, about 3.1 seconds in all (`layout/Preloader`). The page stays still under it. A page restored with the browser's back button does not replay it.
- **Header:** sticky, and out of the way while reading. It is whole at the top of the page; scrolling down past 80px slides it out of view, and scrolling back up brings the main header and the ticker back (the utility bar returns at the top). It stays while it holds the keyboard focus or a menu is open.
  - Nav links turn burnt with the tab indicator under them. The link of the section in view keeps it.
  - All Courses, Study Materials and UPSC Exam open mega menus, on hover after 120ms or on click and Enter; Escape closes them.
  - "Let's talk" is the site's own ink button with the phone in its saffron medallion. It opens a sheet with the ways to reach the admissions team, and its phone rings once on the first hover.
  - The announcement ticker loops every 40 seconds and pauses on hover and focus.
- **Search:** ⌘K or Ctrl+K anywhere opens a search box over the page's own data (`src/data/search.ts`).
- **Page transitions:** leaving the page for another (a programme, the selections page) a mahogany curtain with the emblem rises from the foot of the screen before the browser goes on; it is the closing twin of the intro. In-page links, new tabs, phone and email links go through untouched.
- **Hero:** the toppers' slideshow from the `kevin` branch's hero, in this site's type and colours. On the orange ground (its glow drifts slowly), a large rounded panel in which the top three of UPSC CSE 2025 follow one another in wide portraits: each pushes in slowly for 6.5 seconds and cross-fades to the next, a torn paper scrap tears into a corner, and the topper's rank is marked beside them. Over it, the pill with the topper's line gliding past (to the selections page), the client's headline, the lead on a frosted card and the two buttons; a pause button appears when reached with the keyboard. Under the panel, the statement, the three results of UPSC 2025 (the figures roll in) and the rest of the top ten as small portraits. The slideshow starts once the intro curtain has lifted.
- **Preparation journey:** the three stages, Prelims, Mains and Personality Test, as medallions on a garland thread over the chosen stage's panel. The whole band pins to the screen while the page scrolls through the stages one after another (the thread fills with the scroll), then lets go. Choosing a stage on the rail glides the page to it.
- **About:** seven cards on an arc, each led by the scalloped medallion with its icon: the four institutional facts (their figures under the medallion), classroom learning in New Delhi, the Chennai campus and LIVE-Online learning (animos "spread rows": they spread out of a pile along the arc as it comes into view), then a carousel with arrows, dots, drag and keys, and the button to the about page.
- **Programmes:** the General Studies card over a newspaper collage, with its five figures rolling in and its two courses (Classroom and LIVE-Online, CSE 2028). Then the course shelf (after the `kevin` branch's "More UPSC programmes" wall): every other programme family of the institute as a plain square cover in its own colour on two cream shelves, five to a shelf (2-Year Fledgling, Mentorship, Module Courses, Optional Subjects, CSAT, Mains Test Series, Optional Crash Course, Prelims Test Series, Interview Guidance, IFoS). The shelves draw out and the covers are set on them one by one; a hovered cover lifts. Choosing one brings it forward while the rest blur, its cover swings open on the spine and its two pages turn: the programme and how it is taught, then the way to its courses on vajiramandravi.com. The open cover, Escape or a click on the wall shut it and put it back.
- **Batches:** the featured GS 2028 batch as a long ticket with its "Admissions Open" stamp, then the mode and month tabs and the ticket rail. Hovering a ticket lifts it a little. "Register now" scrolls to the counselling form and fills in the programme.
- **Counselling:** the client's six-field postcard with the Vajiram & Ravi stamp. The card slides in and settles, the stamp presses with an ink ring, and the Indian-script letters behind drift slowly. Fields validate as you leave them; submitting sends the card with a postmark. The form does not send anything yet: `src/components/sections/Admissions/submitEnquiry.ts` is where a form service plugs in.
- **Educators:** the portraits on a ring: the cards travel along a large arc, the centre one upright and in colour, the rest black and white until hovered. Arrows, drag, sideways trackpad swipes and the arrow keys roll it; it rolls in from the side as it appears.
- **Student stories:** the students' words on postcards, dealt onto the table one after the other. The arrows always stand in the heading row; with more stories than the two on the table they page through them.
- **Free study material:** the five resources as a newspaper front page, The Recitals as the lead story. The sheet settles, the headline inks in letter by letter and the columns print in.
- **FAQ:** the client's seven questions inside the gold double-rule frame, which draws itself in; the wax seal presses on beside the heading. One answer open at a time; every answer is in the page's HTML and its FAQPage structured data. The campus card follows (`#locations`): New Delhi and Chennai tabs, panning the map.
- **Closing banner and footer:** the sun rises behind the skyline while its halo rings fade in; while on screen a wave of light runs out through the rings, faint rays turn round the sun and its glow breathes. The footer holds the brand line, the contact block (both campuses, phone, email) and the Explore, Resources and Support columns; its line-art skyline is built like a construction and the wordmark arrives letter by letter.
- **Smooth scrolling:** the page scrolls with Lenis (`ui/SmoothScroll`). In-page links glide to their section and land under the 120px sticky header, and the page holds still while the search or the "Let's talk" sheet is open.
- **Opening at the hero:** the page always opens at the top. A head script (`startAtTopScript` in `lib/smoothScroll`) turns off the browser's scroll restoration and drops a section hash from the address.
- **Reduced motion:** reveals become a 150ms fade without movement, counters show their final numbers, carousels do not move on their own, and ambient loops (the hero's slideshow and glow, ticker, pin, the closing banner's wave, rays and sun glow, and the medallion flowers) stay still. There is no intro, page curtain, deal, spread, ring roll, parallax, tilt, glow, cursor label or spin, and the heading emphasis keeps its colour without the sweep. The journey still follows the scroll, its stages changing without the rise.
- **Accessibility:** every control is a real link or button with the saffron focus ring. Tabs follow the WAI-ARIA tabs pattern, accordion rows are buttons with `aria-expanded`, carousel arrows are labelled and slides are announced as "3 of 10", and decorative art is hidden from screen readers.
- The footer's last line is never scroll-revealed, and nothing in the last screen of the page is pre-hidden, so the foot of the page always shows.
- Every link that leaves the page is in `src/data/links.ts`, checked against vajiramandravi.com. A page that does not exist yet is `null` there and its link renders as plain text. There are no `href="#"` links.
- Images are served as webp and svg files. Next.js image resizing needs a server, so it is off.

## Content still to confirm

- Placeholders, marked `TODO: placeholder` in the data: the featured GS 2028 batch's start date (`src/data/admissions.ts`), and the educators' qualifications, experience and introductions, which are made-up statements about real people and must be replaced before launch (`src/data/faculty.ts`).
- Pages the live site does not have yet: faculty, student stories, Prelims Pointers (it opens the Prelims current affairs), a test-series hub (it opens the Prelims test series), grievance redressal (`src/data/links.ts`). "Meet Our Faculty" and "Watch Student Stories" stay hidden until their pages exist.
- More student stories: only two are in `src/data/stories.ts`; a third turns the postcards into a carousel.
- Social media links for the footer: the live site lists none.
- Real maps for both campuses, a Chennai landmark and metro note, and whether its hours match New Delhi's (`src/data/contact.ts`).
- The batch dates and seat flags (`src/data/admissions.ts`; "SMART Current Affairs Program 2026" targets a year that has passed).
