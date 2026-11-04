import type { CSSProperties } from "react";

/** When the cover starts to fade away, and for how long (ms): as the drawn emblem glides off to the right. */
const FADE_AT = 2250;
const FADE_MS = 650;

/** Thin guide lines that slide in from the screen edges, after the frame lines on brand.dropbox.com. */
const GUIDES: { className: string; style: CSSProperties }[] = [
  { className: "top-24 right-0 left-[18%] h-px origin-right", style: { animation: "guide-x 1200ms var(--ease-smooth) 0ms both" } },
  { className: "right-[26%] bottom-0 left-0 h-px origin-left", style: { animation: "guide-x 1200ms var(--ease-smooth) 160ms both" } },
  { className: "top-0 bottom-[30%] left-[22%] w-px origin-top", style: { animation: "guide-y 1200ms var(--ease-smooth) 80ms both" } },
  { className: "top-[24%] right-[18%] bottom-0 w-px origin-bottom", style: { animation: "guide-y 1200ms var(--ease-smooth) 240ms both" } },
];

/**
 * The white cover the page opens behind, while the hero's emblem draws itself on top of it (the emblem
 * is lifted above the cover for that moment). Guide lines slide in from the edges; then the cover fades
 * and the page appears around the finished emblem. Decorative only: it ignores the pointer and is
 * hidden from assistive technology, and with reduced motion it isn't shown at all.
 */
export default function OpeningCover() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 bg-white motion-reduce:hidden"
      style={{ animation: `cover-out ${FADE_MS}ms var(--ease-smooth) ${FADE_AT}ms both` }}
    >
      {GUIDES.map((guide, i) => (
        <span key={i} className={`absolute bg-brand-200 ${guide.className}`} style={guide.style} />
      ))}
    </div>
  );
}
