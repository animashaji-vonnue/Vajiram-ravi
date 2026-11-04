"use client";

import { useEffect, useRef } from "react";
import { announcements, type Announcement } from "@/data/site";
import { cx } from "@/lib/cx";
import { prefersReducedMotion, whenFontsReady } from "@/lib/motion";

/** Marquee speed in canvas pixels per second. */
const SPEED = 42;

function Item({ item, clone }: { item: Announcement; clone?: boolean }) {
  const Icon = item.icon;
  return (
    <a
      className={cx(
        "flex shrink-0 items-center gap-2.5 overflow-hidden font-display whitespace-nowrap text-white",
        item.large ? "text-[18px]/[25px] font-semibold" : "text-[16px]/[22px] font-medium",
      )}
      href={item.href}
      aria-hidden={clone ? "true" : undefined}
      tabIndex={clone ? -1 : undefined}
    >
      <span className="size-5 shrink-0">{Icon && <Icon />}</span>
      <span>{item.text}</span>
    </a>
  );
}

/**
 * Scrolling announcement strip. The items are rendered twice and the track slides by exactly one
 * set's width, so the loop is seamless. The second set is hidden from assistive tech.
 * Hovering the strip pauses it.
 */
export default function AnnouncementBar() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    whenFontsReady().then(() => {
      const track = trackRef.current;
      if (cancelled || !track) return;
      const first = track.children[0] as HTMLElement | undefined;
      const firstClone = track.children[announcements.length] as HTMLElement | undefined;
      if (!first || !firstClone) return;
      const distance = firstClone.offsetLeft - first.offsetLeft;
      if (!distance) return;
      track.style.setProperty("--dist", `${distance}px`);
      track.style.setProperty("--dur", `${distance / SPEED}s`);
      // `run` starts the marquee animation (see the [&.run] utility on the track).
      if (!prefersReducedMotion()) track.classList.add("run");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div data-chrome className="group/ann relative h-10 overflow-hidden bg-brown-900" aria-label="Announcements">
      <div
        ref={trackRef}
        id="annTrack"
        className="absolute top-2 -left-[140px] flex w-max items-center gap-14 will-change-transform group-hover/ann:[animation-play-state:paused]! [&.run]:animate-marquee"
      >
        {announcements.map((item) => (
          <Item key={item.text} item={item} />
        ))}
        {announcements.map((item) => (
          <Item key={`clone-${item.text}`} item={item} clone />
        ))}
      </div>
    </div>
  );
}
