"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";

/**
 * A film behind a section: the clips play one after another and round again, muted, each fading in over the last
 * as it starts. The first clip starts on its own as the page loads, or with `lazy` only once the film comes near
 * the screen, so a film further down the page doesn't take bandwidth from the page's own files on first load. It
 * fills the nearest positioned box, behind its content. With a `label` it is announced as an image; without one it
 * is decoration and hidden from screen readers.
 */
export default function VideoLoop({
  clips,
  label,
  lazy = false,
  className,
}: {
  clips: readonly string[];
  label?: string;
  lazy?: boolean;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [current, setCurrent] = useState(0);

  // Browsers only autoplay muted video, and React sets `muted` as a property after the markup is parsed, so
  // the first clip is muted and started here as well as by `autoPlay`. A lazy film waits until it is within a
  // screen of the window.
  useEffect(() => {
    const video = refs.current[0];
    if (!video) return;
    video.muted = true;
    const start = () => void video.play().catch(() => {});
    if (!lazy || !box.current) return start();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        start();
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(box.current);
    return () => observer.disconnect();
  }, [lazy]);

  const next = (i: number) => {
    const n = (i + 1) % clips.length;
    const video = refs.current[n];
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => {});
    setCurrent(n);
  };

  return (
    <div
      ref={box}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      className={cx("absolute inset-0 -z-10 overflow-hidden", className)}
    >
      {clips.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          src={src}
          muted
          autoPlay={i === 0 && !lazy}
          playsInline
          // Only the first clip loads up front, and a lazy film not even that; each of the rest starts loading as the
          // clip before it starts playing, so it is ready when its turn comes.
          preload={i === 0 && !lazy ? "auto" : "none"}
          aria-hidden="true"
          onPlay={() => {
            const following = refs.current[(i + 1) % clips.length];
            if (following) following.preload = "auto";
          }}
          onEnded={() => next(i)}
          className={cx(
            "absolute inset-0 size-full object-cover transition-opacity duration-500",
            i === current ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  );
}
