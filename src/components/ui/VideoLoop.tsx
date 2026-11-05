"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";

/**
 * A film behind a section: the clips play one after another and round again, muted, each fading in over the last
 * as it starts. The first clip starts on its own as the page loads. It fills the nearest positioned box, behind its
 * content. With a `label` it is announced as an image; without one it is decoration and hidden from screen readers.
 */
export default function VideoLoop({
  clips,
  label,
  className,
}: {
  clips: readonly string[];
  label?: string;
  className?: string;
}) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [current, setCurrent] = useState(0);

  // Browsers only autoplay muted video, and React sets `muted` as a property after the markup is parsed, so
  // the first clip is muted and started here as well as by `autoPlay`.
  useEffect(() => {
    const video = refs.current[0];
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {});
  }, []);

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
          autoPlay={i === 0}
          playsInline
          preload="auto"
          aria-hidden="true"
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
