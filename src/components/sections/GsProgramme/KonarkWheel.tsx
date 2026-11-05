"use client";

import { useInView } from "@/lib/useInView";

/**
 * The Konark wheel photo (760px, its 40% strength baked into the image), multiplied into the band at the
 * right, as drawn: left 760, top -70 on the 1440 canvas. Motion spec, "Ambient": it turns once every
 * 120s, linear, for as long as the band is on screen, and pauses when it is not. Static with reduced
 * motion. Decoration only.
 */
export default function KonarkWheel() {
  const [ref, inView] = useInView<HTMLDivElement>({ once: false });
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute top-[-70px] left-[760px] size-[760px] mix-blend-multiply">
      <img
        src="/images/gs-programme/konark-wheel.webp"
        alt=""
        width={760}
        height={760}
        loading="lazy"
        decoding="async"
        className="size-[760px] max-w-none animate-spin motion-reduce:animate-none"
        style={{ animationDuration: "120s", animationPlayState: inView ? "running" : "paused" }}
      />
    </div>
  );
}
