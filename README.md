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

`netlify.toml` also turns off Netlify's Next.js adapter with `NETLIFY_NEXT_PLUGIN_SKIP`. The adapter is for server-rendered sites and would reject `out` as the publish folder.
## Layout of the code

```
src/
  app/
    layout.tsx        fonts (Newsreader, Hanken Grotesk, Geist Mono), metadata, header and footer
    page.tsx          the homepage: sections in the order of the final design
    globals.css       Tailwind import, colour and motion tokens, base rules, keyframes, reveal classes
  components/
    layout/           SiteHeader (utility bar, main header with mega menus, announcement ticker),
                      LetsTalkSheet, SearchDialog, SiteFooter and FooterSkyline, Preloader (the intro)
    sections/         one folder per section: the component and any client parts
      Hero/ (hero and stats band) Toppers/ WhyChoose/ Courses/ GsProgramme/ Faculty/
      Admissions/ (batches and the postcard form) SuccessStories/ FreeResources/ Faq/
      Contact/ (contact cards and locations) ClosingCta/
    ui/               shared pieces: Cta, IndianLink, Medallion, TraditionalTabs, CrossFade,
                      CarouselControls, Ornament, CountUp, Photo, Icon, LinkOrText,
                      ScrollReveal, SmoothScroll, CanvasFit, Toast, PointerGlow, CursorLabel,
                      NoteCard, ProgressRule
  data/               all copy, lists and links, one file per section; links.ts holds every external link
  lib/                small helpers (canvas zoom, motion, the shared reveal observer, hover classes,
                      smooth scroll, in-view hook, photo parallax)
public/images/        logo, photos, illustrations, ornaments and icons
scripts/serve-out.mjs preview server for the static export (npm start)
netlify.toml          Netlify build settings
```

To change content, edit the files in `src/data`. To change a section's look, edit the Tailwind classes in its component.

## Design source

- **Layout:** the Figma frame "the final design" (file `TMjGmOJSfBGEgGxfO2JqMU`, page "version 3", node `2258:10453`), 1440 × 11,882px, in seventeen bands from the utility bar to the footer, plus the faculty band "10 · Faculty — subject gurus" (`2271:10583`), which sits after the flagship programme, and the "50+ years" badge under the Why photo (`2271:11038`; its skyline is drawn from the site's own monument silhouettes rather than the vectorized image). The shared components follow "CTA / Indian" (`2262:5786`) and the ornament eyebrows (`2104:3626`, `2104:3616`).
- **Motion:** the "V&R Homepage — Motion & Interaction Spec" (5 Nov 2026): one set of motion tokens, seven shared component behaviours, and a few named moments per section.
- **Motion references:** a later round of effects follows animation references the client picked. Each one is fitted into the existing layout, so nothing moves or resizes:
  - Skiper UI: the words preloader (skiper8) for the intro, the parallax image (skiper55) for photos, the scroll-drawn SVG line (skiper19) for the thread in "Why Vajiram & Ravi", the gradient hover card (skiper90) for the glow on the faculty cards, and the hover-members cursor follower (skiper6) for the cursor labels.
  - Unlumen "Animate Digits" for the stats, "Tilt Card" for the reason and faculty cards and "Dia Text Reveal" for the heading emphasis, Uilora "Stroke Fill" for the footer wordmark, the AutoAE "3D spin" for the seal and stamp, and chanhdai "Icon Swap" for the button spinner.
  - React Bits "Aurora" was tried in the hero and taken out at the client's request.
  - Not used: the Skiper UI card stacks (skiper16, skiper17), which scale sections as they stack and would change the layout, and the Apple-style navbar (skiper75), which would replace the header. animos, originkit, the animmasterlib sliders and the Framer marketplace gave no single effect to take.
- **Earlier designs:** V8 and the "new modern design" are replaced. Their last builds are kept in git under `refs/backups/v8` and `refs/backups/pre-v8`.

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
  - `ui/ProgressRule`: a carousel's progress line as an ornamented rule: a hairline between two diamonds, filled saffron to burnt up to the share seen so far, with a butta flower at the fill's end. Under the toppers and faculty carousels.
  - `ui/CursorLabel`: a small saffron label follows the pointer over a carousel ("Drag", or "View" over a linked card).

## How it behaves

- The design is a fixed 1440px canvas. On narrower screens the page is zoomed down to fit; the zoom factor is also available to CSS as `--canvas-zoom`. There is no separate mobile layout yet.
- **Opening intro:** on every load, a reload included, "Namaste" appears in ten Indian scripts: the first holds, the others follow at an even beat, and the closing "Namaste" holds again. Then the curtain lifts with a curved edge and the hero enters behind it, about 3.1 seconds in all (`layout/Preloader`). The page stays still under it. A page restored with the browser's back button does not replay it.
- **Header:** sticky. After 80px of scroll the utility bar slides away and the main header gains a shadow; scrolling up 40px brings the bar back.
  - Nav links turn burnt with the tab indicator under them. The link of the section in view keeps it.
  - All Courses, Study Materials and UPSC Exam open mega menus, on hover after 120ms or on click and Enter; Escape closes them.
  - "Let's talk" is the site's own ink button with the phone in its saffron medallion. It opens a sheet with the ways to reach the admissions team, and its phone rings once on the first hover.
  - The announcement ticker loops every 40 seconds and pauses on hover and focus.
- **Search:** ⌘K or Ctrl+K anywhere opens a search box over the page's own data (`src/data/search.ts`).
- **Hero:** on load the arch niche draws in, Lady Justice rises, then the eyebrow, the headline and its italic second line, the text, the buttons and the proof card follow, in about 1.2 seconds. The second line names one place at a time: "in Delhi" holds, then Delhi rolls up and away as India rises in, and back again, every 3.5 seconds (`Hero/PlaceRoll`, pure CSS). Screen readers and search engines read the whole line, "in Delhi, India". The glow behind the statue breathes while it is on screen, and with a mouse the statue and line art drift slightly slower than the page as you scroll. Hovering a topper avatar in the proof card shows their name and rank.
- **Stats band:** the four figures roll into place like an odometer when the band is half in view, digit by digit from the left, and their labels fade in after. The figures keep their width throughout.
- **Toppers:** the stamps drop in one by one. The carousel moves a page of five with the arrows, a drag or the arrow keys, and the ornamented rule under it shows the position. On hover a stamp lifts, its photo zooms and its AIR tag slides. A cursor label says "View" over a stamp and "Drag" elsewhere on the strip.
- **Why Vajiram & Ravi:** the Constitution photo wipes up from the bottom and then drifts in its arch as you scroll, and the reason cards rise with their medallions turning in. Every card rests cream; the design's mahogany card is the hover state, so a card turns dark with a saffron medallion while the pointer is over it. A dashed saffron thread draws itself behind the cards as the band scrolls by, and the cards tilt slightly toward the pointer. Under the photo, as wide as it, the orange "50+ years" badge carries a tone-on-tone skyline of monuments along its foot; its figure rolls in when it comes into view.
- **Programmes:** the stage tabs filter the cards. Cards that leave fade and shrink, the rest slide to their new places. Linked cards lift, zoom their photo and turn their arrow knob. The photos drift in their cards as you scroll.
- **GS programme:** the Konark wheel turns once every two minutes while on screen. The scores count up, and "Enrol in the GS programme" opens the enquiry form with the programme filled in.
- **Faculty:** arch-portrait cards with subject chips. The design's hover state is the active look: the card turns maroon with a soft orange glow, its arch line and chip turn saffron, and "View profile" appears. It rests on the first card and follows the pointer, with a glow under the pointer and a slight tilt toward it. The row is a carousel: the arrows move a card at a time and hide at the ends, it drags and responds to the arrow keys, and the ornamented rule under it shows the position. With the six educators in the data the row fits exactly, so the arrows stay hidden and the rule full.
- **Batches:** the intro beside the heading sits on the same note card as the toppers note (`ui/NoteCard`), standing on the heading's foot so the row keeps its height. The mode and month tabs combine (without counts); tickets that no longer match fold away. The track moves a ticket at a time with the arrows, a drag or the arrow keys. On reveal the dates flip in like a departure board and the "Limited seats" stamps come down. "Register now" scrolls to the postcard and fills in its programme. Batches that have started are hidden. A hovered ticket lifts over a soft contact shadow, and the track leaves room around the tickets so the shadow is never cut off. The band's double-rule frame is drawn to the band's size.
- **Talk to us:** the postcard slides up into place and its stamp, the Vajiram & Ravi emblem on a cream panel in an orange frame, lands last. Hovering the stamp spins it once, like a coin. Fields validate as you leave them and on Submit, and an error shakes its field once. Submitting swaps the button's arrow for a spinner, then a thank-you with a "posted" postmark. The form does not send anything yet: `src/components/sections/Admissions/submitEnquiry.ts` is where a form service such as Netlify Forms plugs in.
- **Success stories:** a quote carousel that moves on every seven seconds while on screen, with its progress on the dots. It pauses on hover, focus and in a hidden tab. The arrows, the arrow keys and a swipe move it by hand. The Gateway of India behind it drifts with the scroll.
- **Free study material:** a newspaper front page with Prelims, Mains and Quest editions; switching turns the page. Headline rows tint and draw an underline on hover, and the lead photo drifts in its frame as you scroll.
- **FAQ:** the scroll unrolls from the centre when it comes into view, its rods slide out and the tassels sway, then the questions appear and the wax seal stamps. Once it has landed, hovering the seal spins it once. The accordion opens one question at a time. Every answer is in the page's HTML and its FAQPage structured data.
- **Contact and locations:** four contact cards (WhatsApp opens in a new tab, Call uses tel:, Email uses mailto:). The locations card switches between New Delhi and Chennai, panning the map. Under the address, the nearest metro station and exit are a line of text. The map pin pulses while it is on screen. The temple collage drifts with the scroll.
- **Closing banner and footer:** the sun rises behind the skyline while its halo rings fade in, then the heading and buttons follow. While the banner is on screen, a wave of light runs out from the sun through the rings every 5 seconds, faint rays turn slowly around the sun, and a warm glow around it breathes. In the footer, the line-art skyline is built like a construction as it comes into view: the ground line first, then the colonnades rising column by column, the walls and domes, and the spires last (`layout/FooterSkyline`, strokes generated from the design's SVG into `layout/skylineStrokes.ts`). Links turn burnt with a drawn underline, and the "Vajiram & Ravi" wordmark arrives letter by letter, each letter drawn as an outline that then fills.
- **Smooth scrolling:** the page scrolls with Lenis (`ui/SmoothScroll`). In-page links glide to their section and land under the 120px sticky header, and the page holds still while the search or the "Let's talk" sheet is open.
- **Opening at the hero:** the page always opens at the top. A head script (`startAtTopScript` in `lib/smoothScroll`) turns off the browser's scroll restoration and drops a section hash from the address.
- **Reduced motion:** reveals become a 150ms fade without movement, counters show their final numbers, carousels do not move on their own, and ambient loops (the glow, wheel, ticker, pin, the closing banner's wave, rays and sun glow, and the medallion flowers) stay still. The FAQ scroll appears open and the stamps appear without their press. The hero's place stays on Delhi. There is no intro, parallax, tilt, glow, cursor label or spin; the why-section thread is simply there, fully drawn; and the heading emphasis keeps its colour without the sweep.
- **Accessibility:** every control is a real link or button with the saffron focus ring. Tabs follow the WAI-ARIA tabs pattern, accordion rows are buttons with `aria-expanded`, carousel arrows are labelled and slides are announced as "3 of 10", and decorative art is hidden from screen readers.
- The footer's last line is never scroll-revealed, and nothing in the last screen of the page is pre-hidden, so the foot of the page always shows.
- Every link that leaves the page is in `src/data/links.ts`, checked against vajiramandravi.com. A page that does not exist yet is `null` there and its link renders as plain text. There are no `href="#"` links.
- Images are served as webp and svg files. Next.js image resizing needs a server, so it is off.

## Content still to confirm

- FAQ answers 2 to 4 are the ones vajiramandravi.com publishes today; confirm them (`src/data/faq-chat.ts`). The Prelims and Quest editions of the study material, each article's address and each edition's lead photo still need the CMS (`src/data/study-materials.ts`).
- Real maps for both campuses: the design's street map is a placeholder, and Chennai pans the same image. Also a Chennai landmark and metro note, and whether its hours match New Delhi's (`src/data/contact.ts`).
- The WhatsApp number is assumed to be the admissions line (`src/data/links.ts`).
- The programmes of AIR 4, 7, 9 and 10 in 2025: the design says "PowerUp Prelims Test Series, IGP, Mains Test Series", but the selections page says IGP (`src/data/toppers.ts`).
- The links still missing a page: grievance redressal, topper stories and article pages (`src/data/links.ts`).
- Faculty profile pages, and more educators (`src/data/faculty.ts`): "View profile" is plain text until a profile exists, and the carousel only moves with more than six.
- The batch dates and seat flags (`src/data/admissions.ts`; "SMART Current Affairs Program 2026" targets a year that has passed), and the course counts on the programme cards (`src/data/programme-bento.ts`).
