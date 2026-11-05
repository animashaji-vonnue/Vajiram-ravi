"use client";

import { useEffect, useRef } from "react";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { clamp01, followScroll } from "@/lib/scroll";

const SMOOTHING_MS = 90;

/** The page's colour before and after the fade, as RGB. */
const FROM = [0xff, 0x8b, 0x00];
const TO = [0xff, 0xff, 0xff];

/**
 * Fades the page's own colour (`--page` on <main>) from orange to white as its parent section comes up the
 * screen: it starts as the section's top enters at the foot of the window and is white by the time that top
 * has risen most of the way up it. Renders nothing of its own.
 */
export default function PageFade() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = ref.current?.parentElement;
    const page = section?.closest("main");
    if (!section || !page) return;
    return followScroll(
      () => {
        const viewportHeight = window.innerHeight / getCanvasZoom();
        return clamp01((viewportHeight - canvasTop(section)) / (viewportHeight * 0.7));
      },
      (progress) => {
        const [r, g, b] = FROM.map((from, i) => Math.round(from + (TO[i] - from) * progress));
        page.style.setProperty("--page", `rgb(${r} ${g} ${b})`);
      },
      SMOOTHING_MS,
    );
  }, []);

  return <span ref={ref} hidden />;
}
