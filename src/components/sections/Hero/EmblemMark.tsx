import Image from "next/image";
import type { CSSProperties } from "react";

/** When the finished picture fades in over the outline drawing (ms after load). */
const SHOW_AT = 1550;

/**
 * The hero's emblem, drawn in on load after brand.dropbox.com: its outlines (traced from the line art,
 * about 500 pieces, biggest first) draw themselves in light orange, then the picture itself fades in
 * over them as they fade out. The drawing's animation lives inside emblem-lines.svg, so the page
 * carries none of its path data. The picture is cut out around the emblem, so orbiting cards pass
 * behind its shape rather than a box.
 */
export default function EmblemMark({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={className} style={style}>
      <Image
        src="/images/hero/emblem.webp"
        alt="The Lion Capital emblem"
        fill
        priority
        sizes="272px"
        className="object-contain"
        style={{ animation: `fade-in 650ms var(--ease-smooth) ${SHOW_AT}ms both` }}
      />
      <Image
        src="/images/hero/emblem-lines.svg"
        alt=""
        aria-hidden="true"
        fill
        priority
        unoptimized
        className="object-contain motion-reduce:hidden"
      />
    </div>
  );
}
