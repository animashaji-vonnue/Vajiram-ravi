import { type CSSProperties, type ReactNode, useId } from "react";
import { cx } from "@/lib/cx";

/**
 * Noise as a CSS background: `freq` sets its grain (two numbers stretch it), `opacity` its strength, and
 * `size` the tile it repeats on. Cloudy, low-frequency noise needs a large tile or the repeat shows.
 */
const noise = (freq: string, opacity: number, octaves = 3, size = 240) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${octaves}' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='${opacity}'/%3E%3C/svg%3E")`;

/**
 * Hardboard: fine fibres, longer pale-and-dark blotches like pressed wood pulp, and light falling from
 * the top left. Its pressed edge catches a little light along the top and darkens along the bottom, and a
 * darker band under it is the board's thickness.
 */
const BOARD: CSSProperties = {
  backgroundImage: [
    "linear-gradient(160deg, rgb(255 240 220 / 0.18), rgb(255 240 220 / 0) 40%, rgb(60 35 15 / 0.12))",
    noise(".9", 0.4),
    noise(".004 .01", 0.35, 4, 800),
  ].join(", "),
  backgroundBlendMode: "soft-light, multiply, multiply",
  boxShadow: [
    "inset 0 1.5px 0 rgb(255 232 205 / 0.55)",
    "inset 0 0 0 1px rgb(95 62 32 / 0.35)",
    "inset 0 -3px 4px rgb(70 42 18 / 0.3)",
    "0 5px 0 #8a6340",
    "0 6px 1px rgb(60 35 15 / 0.4)",
    "0 36px 60px -24px rgb(60 35 15 / 0.55)",
  ].join(", "),
};

/**
 * The sheet: uncoated paper, with a fine tooth, short fibres, soft cloudy unevenness where the pulp lay
 * thicker or thinner, a touch more light where it falls and a little warmth towards its edges and foot.
 */
const SHEET: CSSProperties = {
  backgroundImage: [
    "linear-gradient(172deg, rgb(255 255 255 / 0.65), rgb(255 255 255 / 0) 35%, rgb(150 120 80 / 0.08))",
    "radial-gradient(ellipse 75% 70% at 50% 45%, transparent 60%, rgb(150 115 70 / 0.1))",
    noise(".9", 0.16, 2),
    noise(".035 .5", 0.14, 2),
    noise(".0025 .0035", 0.14, 4, 1000),
  ].join(", "),
  backgroundBlendMode: "normal, normal, multiply, multiply, multiply",
};

/**
 * The same paper laid over what's on the sheet, lightly, so the text and the photo look printed on it
 * rather than floating above it.
 */
const PRINT: CSSProperties = {
  backgroundImage: [noise(".9", 0.5, 2), noise(".0025 .0035", 0.25, 4, 1000)].join(", "),
  mixBlendMode: "multiply",
};

/**
 * The clipboard's clip, as in the reference: a nickel plate riveted to the board at both ends, the wide
 * jaw over the paper with a rolled lower edge, and the lever rising from its middle with a hanging hole.
 * Brushed metal: bands of light and dark across it and fine streaks along it. Drawn on a 360 × 160 grid.
 */
function MetalClip({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const url = (name: string) => `url(#${id}-${name})`;
  const edge = "#4f5257";
  return (
    <svg aria-hidden="true" width="360" height="160" viewBox="0 0 360 160" fill="none" className={className}>
      <defs>
        {/* Polished metal reflects its surroundings as sharp bands rather than a smooth fade. */}
        <linearGradient id={`${id}-chrome`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdfdfd" />
          <stop offset="0.18" stopColor="#e6e8ea" />
          <stop offset="0.42" stopColor="#9a9ea3" />
          <stop offset="0.55" stopColor="#f1f2f3" />
          <stop offset="0.8" stopColor="#b4b8bc" />
          <stop offset="1" stopColor="#7a7e83" />
        </linearGradient>
        <linearGradient id={`${id}-lever`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8d9196" />
          <stop offset="0.22" stopColor="#f4f5f6" />
          <stop offset="0.45" stopColor="#c3c6ca" />
          <stop offset="0.7" stopColor="#e9ebec" />
          <stop offset="1" stopColor="#7f8388" />
        </linearGradient>
        <linearGradient id={`${id}-jaw`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#aeb2b6" />
          <stop offset="0.3" stopColor="#f3f4f5" />
          <stop offset="0.62" stopColor="#c9ccd0" />
          <stop offset="1" stopColor="#8b8f94" />
        </linearGradient>
        <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.62" stopColor="#2c2f33" stopOpacity="0.12" />
          <stop offset="0.78" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-roll`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7f8388" />
          <stop offset="0.25" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#b5b9bd" />
          <stop offset="1" stopColor="#5c6065" />
        </linearGradient>
        <radialGradient id={`${id}-rivet`} cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#dfe1e3" />
          <stop offset="0.75" stopColor="#8f9398" />
          <stop offset="1" stopColor="#5a5e63" />
        </radialGradient>
        {/* Fine streaks along the metal, the grain a brushed finish leaves. */}
        <filter id={`${id}-brushed`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.9" numOctaves="2" seed="3" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.35" />
          </feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id={`${id}-soft`} x="-10%" y="-50%" width="120%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* The plate riveted to the board, its ears showing either side of the jaw. */}
      <path d="M34 80 Q34 66 48 66 L312 66 Q326 66 326 80 L326 104 L34 104 Z" fill={url("chrome")} stroke={edge} strokeWidth="1" />
      <path d="M34 80 Q34 66 48 66 L312 66 Q326 66 326 80 L326 104 L34 104 Z" fill="#888" filter={url("brushed")} />
      {[58, 302].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="85" r="9" fill="#3b3e42" opacity="0.35" filter={url("soft")} />
          <circle cx={cx} cy="84" r="8" fill={url("rivet")} stroke={edge} strokeWidth="0.8" />
          <circle cx={cx - 2.5} cy="81.5" r="1.6" fill="#fff" opacity="0.9" />
        </g>
      ))}

      {/* The lever's shadow on the plate and jaw, then the lever with its hanging hole. */}
      <path d="M118 104 C130 84 146 74 150 52 C153 26 164 14 182 14 C200 14 211 26 214 52 C218 74 234 84 246 104 Z" fill="#2a2c2f" opacity="0.35" filter={url("soft")} />
      <path
        d="M112 104 C124 82 140 72 144 50 C147 22 160 8 180 8 C200 8 213 22 216 50 C220 72 236 82 248 104 Z"
        fill={url("lever")}
        stroke={edge}
        strokeWidth="1"
      />
      <path d="M112 104 C124 82 140 72 144 50 C147 22 160 8 180 8 C200 8 213 22 216 50 C220 72 236 82 248 104 Z" fill="#888" filter={url("brushed")} />
      <path d="M150 54 C152 30 162 17 180 17" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
      {/* The hole stands above the board, so the white page shows through it, under the rim's inner shadow. */}
      <circle cx="180" cy="40" r="13" fill="#fff" stroke={edge} strokeWidth="1" />
      <path d="M168 37 A13 13 0 0 1 192 37" stroke="#3a3d41" strokeWidth="3" opacity="0.35" filter={url("soft")} />

      {/* The jaw over the paper: a dark seam under the lever, brushed metal with a sweep of light across it, and a rolled lower edge. */}
      <path d="M26 101 Q26 94 33 94 L327 94 Q334 94 334 101 L334 140 L26 140 Z" fill={url("jaw")} stroke={edge} strokeWidth="1" />
      <path d="M26 101 Q26 94 33 94 L327 94 Q334 94 334 101 L334 140 L26 140 Z" fill="#888" filter={url("brushed")} />
      <path d="M26 101 Q26 94 33 94 L327 94 Q334 94 334 101 L334 140 L26 140 Z" fill={url("sweep")} />
      <path d="M40 95.5 L320 95.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <rect x="22" y="134" width="316" height="17" rx="8.5" fill={url("roll")} stroke={edge} strokeWidth="1" />
      <path d="M34 138.5 L326 138.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

/**
 * A clipboard, after the reference the brief pointed to: a brown hardboard with rounded corners, a sheet
 * of warm white, textured paper lying on it, and a nickel clip holding the sheet at the top, its jaw over the
 * paper's top edge and casting a soft shadow down it. The sheet's foot lifts very slightly at the corners.
 * `children` go on the paper; the jaw covers its top 30px or so. The clip stands up past the board's top
 * edge, so leave room above it.
 */
export default function Clipboard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("relative isolate rounded-[26px] bg-hardboard p-10 pt-[72px]", className)} style={BOARD}>
      <div className="relative">
        {/* The sheet's foot lifting off the board at its corners: two soft shadows under it, angled outwards. */}
        <span aria-hidden="true" className="absolute bottom-3 left-3 -z-10 h-10 w-2/5 -rotate-2 shadow-[0_14px_14px_rgb(60_35_15/0.35)]" />
        <span aria-hidden="true" className="absolute right-3 bottom-3 -z-10 h-10 w-2/5 rotate-2 shadow-[0_14px_14px_rgb(60_35_15/0.35)]" />
        <div
          className="relative rounded-[2px] bg-paper shadow-[0_0_0_0.5px_rgb(90_70_45/0.25),0_1px_2px_rgb(60_40_20/0.2),0_6px_12px_-6px_rgb(60_40_20/0.3)]"
          style={SHEET}
        >
          {/* The jaw's shadow on the paper below it. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-1/2 h-16 w-[360px] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,rgb(60_40_20/0.22),transparent)]"
          />
          {children}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25" style={PRINT} />
        </div>
      </div>
      <MetalClip className="absolute -top-12 left-1/2 -translate-x-1/2 [filter:drop-shadow(0_2px_1.5px_rgb(40_25_10/0.4))_drop-shadow(0_10px_10px_rgb(40_25_10/0.3))]" />
    </div>
  );
}
