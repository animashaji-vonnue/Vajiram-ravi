"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Cta from "@/components/ui/Cta";
import { journeyIntro, journeyStages, type StageId, type SupportItem } from "@/data/journey";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { scrollToY } from "@/lib/smoothScroll";
import StageRail from "./StageRail";
import { MARKER_AT } from "./thread";

const ID = "journey";

/** How far (canvas px) the page scrolls through each stage while the band is pinned. */
const STAGE_SCROLL = 480;
/** Room kept free above and below the content inside the pinned screen. */
const FRAME_PAD = 64;
/** The leaving stage's fade (ui/CrossFade's exit: 70% of its 200ms, --ease-in); the new one arrives after it. */
const EXIT_MS = 140;
/** The arriving stage's parts rise in one after another (--rise-sm, --dur-fast, --ease-out), this far apart. */
const RISE_STEP_MS = 40;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * The journey band as one pinned screen. The section is a screen tall plus a run of STAGE_SCROLL for each
 * stage; inside it the screen (position: sticky, a full viewport high) holds the heading, the stage rail (StageRail) and the chosen stage's panel, and stays put while the
 * page scrolls through the run: Prelims, then Mains, then Interview. When the run is over the screen
 * scrolls away with the section and the page goes on. On a screen too short for it all, the content is
 * scaled down to fit, so nothing is ever cut off while it is pinned.
 *
 * The filled thread on the rail follows the scroll the whole way, reaching the next medallion just as its
 * stage comes in, and running on to the thread's end through the last stage, so the visitor always sees how
 * far along the path they are. Choosing a stage on the rail (a click, or the arrow keys, Home and End)
 * glides the page to that stage's part of the run, so the scroll stays the one source of truth. With
 * reduced motion the jump is instant; the stages still follow the scroll, without the panel's rise.
 *
 * The panel has two columns, top-aligned: on the left the title line (the stage's name in orange italic),
 * its paragraph and its button; on the right the card "How Vajiram supports you", a list of plain lines
 * between hairlines, each after a small burnt dot (the Prelims numbers in burnt semibold, the Personality
 * Test's labels in bold). Every stage's content is in the panel, stacked in one grid cell per column with all
 * but the chosen one hidden, so the panel is always as tall as the longest stage and nothing moves when the
 * stage changes. The old stage fades out over 140ms (--ease-in) while the new one's title, paragraph,
 * button and lines rise 8px and fade in after it, 40ms apart.
 */
export default function JourneyStages({ heading }: { heading: ReactNode }) {
  const [active, setActive] = useState<StageId>(journeyStages[0].id);
  const trackRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const count = journeyStages.length;
  const run = STAGE_SCROLL * count;

  /** Canvas px scrolled into the run (0 when the screen has just pinned), and the page's scrollY for any point of it. */
  const measure = () => {
    const track = trackRef.current;
    if (!track) return null;
    const zoom = getCanvasZoom();
    const into = -track.getBoundingClientRect().top / zoom;
    return { into, toScrollY: (canvasPx: number) => window.scrollY + (canvasPx - into) * zoom };
  };

  // The stage and the thread follow the scroll.
  useEffect(() => {
    let frame = 0;
    let shown = -1;
    const update = () => {
      frame = 0;
      const at = measure();
      if (!at) return;
      const progress = clamp(at.into / run, 0, 1);
      const stage = Math.min(count - 1, Math.floor(progress * count));
      if (stage !== shown) {
        shown = stage;
        setActive(journeyStages[stage].id);
      }
      // The fill runs from this stage's medallion to the next one's (the thread's end after the last).
      const local = clamp(progress * count - stage, 0, 1);
      const from = MARKER_AT[stage];
      const to = MARKER_AT[stage + 1] ?? 1;
      fillRef.current?.style.setProperty("stroke-dashoffset", String(1 - (from + (to - from) * local)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [count, run]);

  // Fit the content into the pinned screen: scaled down (never up) when the screen is shorter than it.
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const fit = () => {
      const screen = window.innerHeight / getCanvasZoom();
      const scale = Math.min(1, (screen - FRAME_PAD * 2) / content.offsetHeight);
      content.style.transform = scale < 1 ? `scale(${scale.toFixed(4)})` : "";
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  /** Choosing a stage on the rail: glide to a quarter of the way into its part of the run. */
  const choose = (id: StageId) => {
    const i = journeyStages.findIndex((stage) => stage.id === id);
    const at = measure();
    if (i < 0 || !at) return;
    const y = at.toScrollY((i + 0.25) * STAGE_SCROLL);
    if (prefersReducedMotion()) window.scrollTo(0, y);
    else scrollToY(y);
  };

  return (
    // The run: a screen, plus room to scroll through every stage while that screen stays pinned.
    <div ref={trackRef} className="relative" style={{ height: `calc(100svh / var(--canvas-zoom, 1) + ${run}px)` }}>
      {/* The pinned screen. Its reveals play as it arrives, not when a fifth of the tall run is in view. */}
      <div data-reveal-section className="sticky top-0 flex h-[calc(100svh/var(--canvas-zoom,1))] items-center overflow-clip">

        <div ref={contentRef} className="relative isolate mx-auto flex w-canvas origin-center flex-col gap-12 px-20">
          {/*
            The Ashoka lion capital over a dome with the flag (Figma 2488:5480), as a faint warm print behind
            the heading's right side: low opacity, toned to the paper and fading out towards its foot, so it
            reads as part of the ground rather than a picture on it. Decoration.
          */}
          <img
            src="/images/journey/ashoka-dome.webp"
            alt=""
            aria-hidden="true"
            width={1024}
            height={947}
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute -top-16 right-6 -z-10 w-[500px] max-w-none opacity-[0.16] sepia-[.55] [mask-image:linear-gradient(to_bottom,black_45%,transparent_92%)]"
          />
          {heading}

          <div className="flex flex-col gap-10">
            <StageRail stages={journeyStages} active={active} onSelect={choose} label={journeyIntro.tabsLabel} idPrefix={ID} fillRef={fillRef} />

            <div
              data-reveal
              role="tabpanel"
              id={`${ID}-panel`}
              aria-labelledby={`${ID}-tab-${active}`}
              className="grid grid-cols-[520px_1fr] items-start gap-x-16"
            >
              <div className="grid pt-2">
                {journeyStages.map((stage) => {
                  const shown = stage.id === active;
                  const [title, text, button] = [0, 1, 2].map((step) => rise(shown, step));
                  return (
                    <Layer key={stage.id} shown={shown}>
                      <h3 style={title.style} className={cx("font-heading text-[36px]/[1.12] font-normal tracking-[-0.36px] text-ink", title.className)}>
                        <span className="text-orange italic">{stage.name}</span> – {stage.title}
                      </h3>
                      <p style={text.style} className={cx("mt-4 text-[17px]/[1.55] text-clay", text.className)}>
                        {stage.description}
                      </p>
                      <div style={button.style} className={cx("mt-8", button.className)}>
                        <Cta variant="primary" href={stage.cta.href}>
                          {stage.cta.label}
                        </Cta>
                      </div>
                    </Layer>
                  );
                })}
              </div>

              {/* The card: white paper with the hairline rule and a gold inner border 10px in. */}
              <div className="relative rounded-2xl border border-[#eadbc4] bg-white px-10 pt-9 pb-7 shadow-rest">
                <span aria-hidden="true" className="pointer-events-none absolute inset-2.5 rounded-[10px] border border-[#c9973a]/35" />
                <h3 className="relative font-heading text-[26px]/[1.2] font-medium tracking-[-0.01em] text-ink">{journeyIntro.supportLabel}</h3>
                <div className="relative mt-4 grid">
                  {journeyStages.map((stage) => {
                    const shown = stage.id === active;
                    return (
                      <Layer key={stage.id} shown={shown}>
                        <ul className="divide-y divide-[#eadbc4] border-t border-[#eadbc4]">
                          {stage.support.map((item, i) => {
                            // The lines follow the button in the arrival order.
                            const line = rise(shown, 3 + i);
                            return (
                              <li key={item.text} style={line.style} className={cx("flex items-start gap-3.5 py-3.5", line.className)}>
                                <img src="/images/ornaments/butta.svg" alt="" aria-hidden="true" width={14} height={14} className="mt-[5px] size-3.5 shrink-0" />
                                <p className="text-[16px]/[1.55] text-ink">
                                  {item.label && <strong className="font-semibold">{item.label} </strong>}
                                  <SupportText item={item} />
                                </p>
                              </li>
                            );
                          })}
                        </ul>
                      </Layer>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * One stage's content in a stacked grid cell. The chosen one shows at once (its parts rise in on their own,
 * see `rise`); the others fade out over EXIT_MS and are then hidden, which also takes them out of the tab
 * order and the accessibility tree.
 */
function Layer({ shown, children }: { shown: boolean; children: ReactNode }) {
  return (
    <div
      className={cx(
        "[grid-area:1/1]",
        shown ? "visible opacity-100" : "invisible opacity-0 [transition:opacity_140ms_var(--ease-in),visibility_0s_linear_140ms]",
      )}
    >
      {children}
    </div>
  );
}

/** The rise of the arriving stage's part number `step`; at rest (and while leaving) the parts wait 8px low. */
function rise(shown: boolean, step: number): { className: string; style?: CSSProperties } {
  return {
    className: cx(
      "[transition:opacity_var(--dur-fast)_var(--ease-out),translate_var(--dur-fast)_var(--ease-out)]",
      shown ? "opacity-100" : "translate-y-(--rise-sm) opacity-0",
    ),
    style: shown ? { transitionDelay: `${EXIT_MS + step * RISE_STEP_MS}ms` } : undefined,
  };
}

/** Splits `text` around the given figures, each matched where no digit touches it (so "30" never splits "300"). */
function splitFigures(text: string, figures: string[]): string[] {
  const parts: string[] = [];
  let rest = text;
  while (rest) {
    let hit: { at: number; figure: string } | null = null;
    for (const figure of figures) {
      let at = rest.indexOf(figure);
      while (at >= 0 && (/\d/.test(rest[at - 1] ?? "") || /\d/.test(rest[at + figure.length] ?? ""))) at = rest.indexOf(figure, at + 1);
      if (at >= 0 && (!hit || at < hit.at)) hit = { at, figure };
    }
    if (!hit) {
      parts.push(rest);
      break;
    }
    if (hit.at > 0) parts.push(rest.slice(0, hit.at));
    parts.push(hit.figure);
    rest = rest.slice(hit.at + hit.figure.length);
  }
  return parts;
}

/** A support line's text, with the numbers it names in burnt semibold (same size, so every line keeps its rhythm). */
function SupportText({ item }: { item: SupportItem }) {
  const figures = item.figures ?? [];
  if (!figures.length) return item.text;
  return splitFigures(item.text, figures).map((part, i) =>
    figures.includes(part) ? (
      <strong key={i} className="font-semibold text-burnt">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
