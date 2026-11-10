/** The stamp pad's ink: a deep vermilion, printed through the card's paper (multiply). */
export const INK = "#a5321b";

/** The words round the rim: the name over the top, the city along the foot, a star between them on each side. */
const RIM_TOP = "VAJIRAM & RAVI";
const RIM_FOOT = "NEW DELHI";

/** A five-pointed star centred on (x, y), r to its points (a path's d). */
export const star = (x: number, y: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + (Math.PI * i) / 5;
    const radius = i % 2 ? r * 0.42 : r;
    return `${i ? "L" : "M"}${(x + Math.cos(angle) * radius).toFixed(2)} ${(y + Math.sin(angle) * radius).toFixed(2)}`;
  }).join("") + "Z";

/** The rising sun's seven rays, over the horizon at (60, 63). */
const RAYS = Array.from({ length: 7 }, (_, i) => {
  const angle = Math.PI + (Math.PI * (i + 1)) / 8;
  const [x, y] = [Math.cos(angle), Math.sin(angle)];
  return `M${(60 + x * 14).toFixed(2)} ${(63 + y * 14).toFixed(2)}L${(60 + x * 19).toFixed(2)} ${(63 + y * 19).toFixed(2)}`;
});

/**
 * A rubber stamp's uneven ink, as an SVG filter (put it in an svg's defs and point `filter: url(#id)` at
 * it): a low wobble of the edges (turbulence through a displacement map), a fine grain of specks where the
 * rubber missed the paper, and broad patches pressed lighter, the grain and the patches together masking
 * the print. InkStamp inks with it, and so does the postage stamp's postmark (PostageStamp's Postmark).
 */
export function InkFilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={2} seed={3} result="warp" />
      <feDisplacementMap in="SourceGraphic" in2="warp" scale={1.8} xChannelSelector="R" yChannelSelector="G" result="rough" />
      <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves={2} seed={11} result="grain" />
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -5 3.7" result="specks" />
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={5} result="blot" />
      <feColorMatrix in="blot" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 2.05" result="pressure" />
      <feComposite in="specks" in2="pressure" operator="arithmetic" k1={1} result="mask" />
      <feComposite in="rough" in2="mask" operator="in" />
    </filter>
  );
}

/**
 * The round rubber stamp (112px), as the FAQ's seal (FaqSeal) presses it: a round office stamp inked once
 * and pressed by hand. A double ring at the rim; between it and an inner ring, "Vajiram & Ravi" round the top and "New
 * Delhi" along the foot (both upright, as a stamp is cut), with a star on either side; in the middle the
 * emblem's rising sun over the horizon with the year under it.
 *
 * The ink is made uneven by InkFilter, defined here under `filterId` so other prints can point at it too.
 * Decoration only; the caller turns it and blends it into the paper.
 */
export default function InkStamp({ filterId, className }: { filterId: string; className?: string }) {
  const rimPath = `${filterId}-rim`;
  return (
    <svg aria-hidden="true" width={112} height={112} viewBox="0 0 120 120" fill="none" overflow="visible" className={className}>
      <defs>
        <InkFilter id={filterId} />
        {/* The rim's band runs from radius 41 to 48.5: the name stands on its inner edge over the top, the
            city hangs from its outer edge along the foot, so both read upright. */}
        <path id={`${rimPath}-top`} d="M19 60A41 41 0 0 1 101 60" />
        <path id={`${rimPath}-foot`} d="M11.5 60A48.5 48.5 0 0 0 108.5 60" />
      </defs>

      <g filter={`url(#${filterId})`} stroke={INK} fill={INK}>
        <circle cx={60} cy={60} r={56} strokeWidth={3.2} fill="none" />
        <circle cx={60} cy={60} r={51.5} strokeWidth={1.1} fill="none" />
        <circle cx={60} cy={60} r={33} strokeWidth={1.1} fill="none" />
        <text stroke="none" fontSize={10.5} fontWeight={700} letterSpacing={1.6} textAnchor="middle" className="font-heading">
          <textPath href={`#${rimPath}-top`} startOffset="50%">
            {RIM_TOP}
          </textPath>
        </text>
        <text stroke="none" fontSize={10.5} fontWeight={700} letterSpacing={1.6} textAnchor="middle" className="font-heading">
          <textPath href={`#${rimPath}-foot`} startOffset="50%">
            {RIM_FOOT}
          </textPath>
        </text>
        <path d={star(15.25, 60, 3.6) + star(104.75, 60, 3.6)} stroke="none" />
        {/* The emblem's rising sun, its rays and the horizon, and the year. */}
        <path d="M49 63a11 11 0 0 1 22 0Z" stroke="none" />
        <path d={RAYS.join("")} strokeWidth={1.8} strokeLinecap="round" fill="none" />
        <path d="M40 63H80" strokeWidth={1.6} strokeLinecap="round" fill="none" />
        <text x={60} y={80} stroke="none" fontSize={12} fontWeight={700} letterSpacing={1} textAnchor="middle" className="font-heading">
          1976
        </text>
      </g>
    </svg>
  );
}
