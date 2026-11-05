"use client";

import { useEffect, useRef, type FocusEvent } from "react";
import { announcementIcons, announcements, announcementsMore, type Announcement } from "@/data/site";
import { cx } from "@/lib/cx";
import { prefersReducedMotion, whenFontsReady } from "@/lib/motion";

/** The page link's hover: an underline drawing in from the left under the text (no medallion here). */
function Underline() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current [transition:scale_var(--dur-fast)_var(--ease-out)] group-hover/item:scale-x-100 group-focus-visible/item:scale-x-100"
    />
  );
}

function Item({ item, index, clone, onFocus }: { item: Announcement; index: number; clone?: boolean; onFocus?: (event: FocusEvent<HTMLAnchorElement>) => void }) {
  return (
    <a
      href={item.href}
      aria-hidden={clone ? "true" : undefined}
      tabIndex={clone ? -1 : undefined}
      onFocus={onFocus}
      className={cx(
        "group/item flex shrink-0 items-center gap-2.5 text-[16px]/[22px] font-medium whitespace-nowrap text-white",
        // Reduced motion: the strip stands still and shows its first two items only.
        (clone || index > 1) && "motion-reduce:hidden",
      )}
    >
      <img src={announcementIcons[item.icon]} alt="" width={20} height={20} className="size-5" />
      <span className="relative">
        {item.text}
        <Underline />
      </span>
    </a>
  );
}

/**
 * The announcement strip under the main header (Figma "Header / Announcement strip", 2258:10386): a 40px
 * burnt band of white 16px Hanken Medium items, each after its saffron iconoir icon, 56px apart.
 *
 * Motion spec: a continuous right-to-left marquee, one full loop every --dur-ambient (40s). The items are
 * rendered twice and the track slides by exactly one set's width (measured once the fonts have loaded),
 * so the loop is seamless; the copies are hidden from assistive tech and skipped by Tab. Hovering or
 * focusing the strip pauses it, and a focused item that sits outside the band is brought to its left
 * edge. Each item is a link whose underline draws in on hover. Reduced motion: no scroll; the first two
 * items stand in a static row followed by "View all updates".
 */
export default function AnnouncementBar() {
  const stripRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    whenFontsReady().then(() => {
      const track = trackRef.current;
      if (cancelled || !track || prefersReducedMotion()) return;
      const first = track.children[0] as HTMLElement | undefined;
      const firstClone = track.children[announcements.length] as HTMLElement | undefined;
      if (!first || !firstClone) return;
      const distance = firstClone.offsetLeft - first.offsetLeft;
      if (!distance) return;
      track.style.setProperty("--dist", `${distance}px`);
      // `run` starts the marquee (see the [&.run] utility on the track).
      track.classList.add("run");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // The strip is paused while it holds focus; a focused item out of sight is wound to the band's left edge.
  const onItemFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    const strip = stripRef.current;
    const track = trackRef.current;
    const marquee = track?.getAnimations()[0];
    const distance = track ? parseFloat(track.style.getPropertyValue("--dist")) : 0;
    if (!strip || !track || !marquee || !distance) return;
    const box = strip.getBoundingClientRect();
    const item = event.currentTarget.getBoundingClientRect();
    if (item.left >= box.left && item.right <= box.right) return;
    const duration = Number(marquee.effect?.getComputedTiming().duration) || 0;
    marquee.currentTime = (event.currentTarget.offsetLeft / distance) * duration;
  };

  return (
    <div ref={stripRef} className="group/ann relative h-10 overflow-clip bg-burnt" role="marquee" aria-label="Announcements">
      <div
        ref={trackRef}
        // Starts at the header's 40px margin, also on screens wider than the canvas.
        className="absolute inset-y-0 left-[max(40px,calc((100%_-_1440px)/2_+_40px))] flex w-max items-center gap-14 will-change-transform group-focus-within/ann:[animation-play-state:paused]! group-hover/ann:[animation-play-state:paused]! motion-reduce:animate-none! [&.run]:animate-marquee"
      >
        {announcements.map((item, i) => (
          <Item key={item.text} item={item} index={i} onFocus={onItemFocus} />
        ))}
        {announcements.map((item, i) => (
          <Item key={`clone-${item.text}`} item={item} index={i} clone />
        ))}
        {/* White, underlined at rest (saffron would be too faint on burnt); the hover thickens the line. */}
        <a
          href={announcementsMore.href}
          className="hidden shrink-0 text-[16px]/[22px] font-semibold whitespace-nowrap text-white underline decoration-1 [text-underline-position:from-font] hover:decoration-2 motion-reduce:block"
        >
          {announcementsMore.label}
        </a>
      </div>
    </div>
  );
}
