import { INK, InkFilter, star } from "./InkStamp";

/**
 * The postage stamp on the counselling postcard: the client's "Orange Vajiram & Ravi Postage Stamp" (Figma
 * 2572:4287), cut out of its orange card with its perforated edge whole (admissions/postage-stamp.webp,
 * 240 × 308, shown at 92 × 118): "भारत India", "₹5 Postage", the emblem's rising sun with the tick, the
 * "Vajiram & Ravi" ribbon and 2026, engraved in orange on stamp paper. It lifts off the card with a drop
 * shadow that follows the perforation (Postcard.css: .vr-postage); hovering it lifts it a little further
 * (none with reduced motion). Decoration only; the caller places and turns it.
 */
export default function PostageStamp({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`vr-postage ${className ?? ""}`}>
      <img src="/images/admissions/postage-stamp.webp" alt="" width={240} height={308} className="block h-[118px] w-[92px] max-w-none" />
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
        <text x={36} y={39.6} stroke="none" fontSize={10} fontWeight={700} letterSpacing={1.2} textAnchor="middle" className="font-sans">
          1976
        </text>
      </g>
    </svg>
  );
}
