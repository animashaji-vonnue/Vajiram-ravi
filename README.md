# Vajiram-ravi

The Vajiram & Ravi homepage, built with Next.js (App Router, React, TypeScript) and Tailwind CSS v4.
It is a 1:1 port of the design prototype in `Vajiram & Ravi Homepage.html`, split into one component per section.

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
    layout.tsx        fonts, metadata, site chrome, canvas-fit script
    page.tsx          the homepage: sections in order
    magazine/page.tsx the magazine page (/magazine): The Recitals, with the issue archive
    globals.css       Tailwind import, design tokens (@theme), base rules, keyframes
    fonts/            Figtree and Geist (latin), loaded with next/font/local
  components/
    layout/           UtilityBar, SiteHeader, AnnouncementBar, SiteFooter
    sections/         one folder per section: the component and any client parts
      Hero/ Toppers/ WhyChoose/ Courses/ GsProgramme/ Faculty/ Batches/
      Counselling/ SuccessStories/ FreeResources/ Faq/ ContactOptions/
      Locations/ ClosingCta/
      Magazine/       the magazine page's sections: hero, contents, archive, stages, portal band, FAQ
    ui/               shared pieces: Buttons, Typography, PeekCarousel,
                      TrackCarousel, CarouselControls, Photo, RankBadge,
                      Toast, ScrollReveal, CanvasFit
    icons.tsx         every inline SVG from the design, as typed components
  data/               all copy and lists (toppers, courses, faculty, FAQs, magazine issues, ...)
  lib/                small helpers (canvas zoom, motion, toast events)
public/images/        logo, photos and illustrations
scripts/serve-out.mjs preview server for the static export (npm start)
netlify.toml          Netlify build settings
```

To change content, edit the files in `src/data`. To change a section's look, edit the Tailwind classes in its component.

## Styling

- Everything is styled with Tailwind utilities in the components. There are no per-component CSS files.
- The design's palette, fonts, easing and canvas width are Tailwind theme tokens in `src/app/globals.css`. For example `bg-brand-500`, `text-neutral-600`, `font-display`, `ease-smooth`, `w-canvas`. The default Tailwind colours are switched off, so only design colours can be used.
- `font-display` is Figtree and `font-sans` is Geist.
- Shared looks live in small components instead of `@apply`: `Buttons.tsx` for the pill buttons and text links, `Typography.tsx` for eyebrows, section titles and lead paragraphs.
- A few states are toggled outside React and styled with arbitrary variants: `dragging` on carousels, `swap` on the toppers grid, `run` on the marquee. The scroll-reveal classes `rv-pre` and `rv-in` are plain CSS in `globals.css`.

## How it behaves

- The design is a fixed 1440px canvas. On narrower screens the page is zoomed down to fit, exactly like the prototype.
- Sections are server components. Only the interactive parts are client components: the header, marquee, carousels, year tabs, stat counters, FAQ, city tabs and map zoom, and the counselling form.
- Links with `href="#"` point at pages that do not exist yet. Clicking one shows a short toast.
- The counselling form validates input and shows a thank-you state, but it does not send anything yet. Because the site is static, sending it later needs a form service such as Netlify Forms or a serverless function.
- Images are served as the original webp files. Next.js image resizing needs a server, so it is off.
- The magazine page (`/magazine`) lists every issue of The Recitals from `src/data/magazine.ts`. The covers and PDFs are loaded straight from the live site's CDN, so the page needs no local copies; to add an issue, add a row at the top of that file. Links to homepage sections are written as `/#section` so they work from this page too.
