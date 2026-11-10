import { useId } from "react";
import { INK, InkFilter, star } from "./InkStamp";

/** The stamp's printing ink: a deep maroon, so the vermilion postmark reads over it. */
const PRINT = "#6a2216";
/** The stamp's paper: whiter than the card, as gummed stamp paper is. */
const PAPER = "#fdf9f0";

/** The stamp as drawn: 92 × 112, in px. The perforation (Postcard.css) is cut on a pitch that fits it. */
const W = 92;
const H = 112;
/** The printed picture's window, inside the frame. */
const PIC = { x: 11, y: 20, width: 70, height: 56 };
/** The photo behind the engraving, kept to its own shape (1920 × 1086) and sat on the window's foot. */
const PHOTO_W = 108;
const PHOTO_H = (PHOTO_W * 1086) / 1920;

/**
 * The postage stamp on the counselling postcard (92 × 112): stamp paper with its perforated edge, as if
 * torn from a sheet, printed in one maroon ink. A thin frame; "Vajiram & Ravi" over the picture; the
 * picture, an engraving of the Parliament House (about/parliament.webp drawn as horizontal hatching that
 * thickens where the photo is darker); "New Delhi" under it as its caption; "India" and the value, 1976, at
 * the foot. A faint paper grain and a light curl of shade lie over it all.
 *
 * The hatching is an SVG filter: a ruled pattern whose lines are lit from their middles (SourceGraphic),
 * added to the photo's darkness and cut sharp, then filled with the ink. The perforation is a CSS mask and
 * the lift off the card a drop shadow that follows it (Postcard.css: .vr-postage); hovering it lifts it a
 * little further (none with reduced motion). Decoration only; the caller places and turns it.
 */
export default function PostageStamp({ className }: { className?: string }) {
  const uid = useId().replace(/[^\w-]/g, "");
  const ids = { lines: `${uid}-lines`, ruling: `${uid}-ruling`, engrave: `${uid}-engrave`, grain: `${uid}-grain`, curl: `${uid}-curl` };
  return (
    <div aria-hidden="true" className={`vr-postage ${className ?? ""}`}>
      <div className="vr-postage-paper">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" className="absolute inset-0">
          <defs>
            {/* The engraver's ruling: lines 1.6px apart, lit most along their middles. */}
            <linearGradient id={ids.ruling} x1={0} y1={0} x2={0} y2={1}>
              <stop offset={0} stopColor="#fff" stopOpacity={0} />
              <stop offset={0.5} stopColor="#fff" stopOpacity={1} />
              <stop offset={1} stopColor="#fff" stopOpacity={0} />
            </linearGradient>
            <pattern id={ids.lines} width={4} height={1.6} patternUnits="userSpaceOnUse">
              <rect width={4} height={1.6} fill={`url(#${ids.ruling})`} />
            </pattern>
            <filter id={ids.engrave} filterUnits="userSpaceOnUse" {...PIC} colorInterpolationFilters="sRGB">
              <feImage
                href="/images/about/parliament.webp"
                x={PIC.x + (PIC.width - PHOTO_W) / 2}
                y={PIC.y + PIC.height - PHOTO_H + 1}
                width={PHOTO_W}
                height={PHOTO_H}
                preserveAspectRatio="none"
                result="photo"
              />
              {/* Its darkness, the blue counted in so the sky stays light, then curved so the lights thin to
                  hairlines while the shadows keep their weight. */}
              <feColorMatrix in="photo" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.5 -0.3 -0.45 0 1.25" result="dark" />
              <feComponentTransfer in="dark" result="shade">
                <feFuncA type="gamma" exponent={1.3} />
              </feComponentTransfer>
              <feComposite in="SourceGraphic" in2="shade" operator="arithmetic" k2={1} k3={1} k4={-1} result="cut" />
              <feComponentTransfer in="cut" result="hatch">
                <feFuncA type="linear" slope={3.2} />
              </feComponentTransfer>
              <feFlood floodColor={PRINT} />
              <feComposite in2="hatch" operator="in" />
            </filter>
            {/* The paper's grain: fine brown specks, faint. */}
            <filter id={ids.grain} x={0} y={0} width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency={1.1} numOctaves={3} seed={7} />
              <feColorMatrix type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.27  0 0 0 0 0.16  0 0 0 0.36 -0.14" />
            </filter>
            {/* The curl: a stamp's paper lifts a little, catching light at one corner and shade at the other. */}
            <linearGradient id={ids.curl} x1={0} y1={0} x2={1} y2={1}>
              <stop offset={0} stopColor="#fff" stopOpacity={0.5} />
              <stop offset={0.45} stopColor="#fff" stopOpacity={0} />
              <stop offset={1} stopColor="#6b4a3a" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <rect width={W} height={H} fill={PAPER} />

          {/* The print. */}
          <rect x={6.5} y={6.5} width={W - 13} height={H - 13} stroke={PRINT} strokeWidth={0.7} />
          <text x={W / 2} y={16} fill={PRINT} fontSize={6.2} fontWeight={700} letterSpacing={0.7} textAnchor="middle" className="font-heading">
            VAJIRAM &amp; RAVI
          </text>
          <rect {...PIC} fill={`url(#${ids.lines})`} filter={`url(#${ids.engrave})`} />
          <rect {...PIC} stroke={PRINT} strokeWidth={0.6} />
          <text x={W / 2} y={83.5} fill={PRINT} fontSize={4.6} fontWeight={600} letterSpacing={0.9} textAnchor="middle">
            NEW DELHI
          </text>
          <text x={11} y={99} fill={PRINT} fontSize={9.5} fontWeight={700} letterSpacing={0.8} className="font-heading">
            INDIA
          </text>
          <text x={W - 10.5} y={100} fill={PRINT} fontSize={13} fontWeight={700} textAnchor="end" className="font-heading">
            1976
          </text>

          <rect width={W} height={H} filter={`url(#${ids.grain})`} />
          <rect width={W} height={H} fill={`url(#${ids.curl})`} />
        </svg>
      </div>
    </div>
  );
}

/**
 * The postmark that cancels the stamp (64px), in the stamp pad's vermilion (INK) and inked unevenly by
 * InkFilter, defined here under `filterId` so the cancellation waves and the "Posted" mark can share it.
 * A round date stamp as a post office strikes it: a ring with "New Delhi" round the top and "India" along
 * the foot, a star on either side, and the year between two bars across the middle. Decoration only; the
 * caller places it over the stamp's corner, turns it and blends it into the paper.
 */
export function Postmark({ filterId, className }: { filterId: string; className?: string }) {
  const arc = `${filterId}-arc`;
  return (
    <svg aria-hidden="true" width={64} height={64} viewBox="0 0 72 72" fill="none" overflow="visible" className={className}>
      <defs>
        <InkFilter id={filterId} />
        {/* The town stands on radius 25 over the top; the country hangs from radius 29 along the foot. */}
        <path id={`${arc}-top`} d="M11 36A25 25 0 0 1 61 36" />
        <path id={`${arc}-foot`} d="M7 36A29 29 0 0 0 65 36" />
      </defs>
      <g filter={`url(#${filterId})`} stroke={INK} fill={INK}>
        <circle cx={36} cy={36} r={33.5} strokeWidth={1.8} fill="none" />
        <text stroke="none" fontSize={7.4} fontWeight={700} letterSpacing={1.3} textAnchor="middle" className="font-heading">
          <textPath href={`#${arc}-top`} startOffset="50%">
            NEW DELHI
          </textPath>
        </text>
        <text stroke="none" fontSize={7.4} fontWeight={700} letterSpacing={1.6} textAnchor="middle" className="font-heading">
          <textPath href={`#${arc}-foot`} startOffset="50%">
            INDIA
          </textPath>
        </text>
        <path d={star(7.5, 36, 2.6) + star(64.5, 36, 2.6)} stroke="none" />
        <path d="M14.5 28.5H57.5M14.5 43.5H57.5" strokeWidth={1} fill="none" />
        <text x={36} y={39.6} stroke="none" fontSize={10} fontWeight={700} letterSpacing={1.2} textAnchor="middle" className="font-mono">
          1976
        </text>
      </g>
    </svg>
  );
}
