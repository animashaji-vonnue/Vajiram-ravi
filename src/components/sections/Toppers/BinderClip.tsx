import { useId } from "react";

/** The clip's drawn size: its own grid is 152 × 192, at 0.575. */
const SIZE = { width: 87.4, height: 110.4 };

/** How far the clip leans, as in the reference: its right side sits lower than its left. */
const LEAN = 5.6;

/**
 * The steel handle, traced from the reference: its left arm comes out of the left tube and runs up the
 * face, pinches in, opens into a rounded loop above the clip, pinches in again, and its right arm runs
 * back down the face into the right tube.
 */
const HANDLE =
  "M31 70.5 L47 -10 C49 -18 51 -25 50 -30.5 C48 -42 36 -48 36 -57 C36 -70 42 -84 66 -86 C88 -87 104 -76 104.5 -63.5 C105 -50 86 -44 84 -32.5 C83 -25 84.5 -18 84.5 -11 L100.5 75";

/** The flat plate, its rolled top edge, the lip between the tubes (with the notch beside the left tube), and a tube. */
const PLATE = "M2 4 Q2 0 6 0 L128 0 Q132 0 132 4 L132 72 L2 70 Z";
const LIP = "M35 69 L99 70 L99 87 Q99 90 96 90 L44 89 Q41 89 41 86 L41 80 Q41 78 39 78 L35 78 Z";
/** A fine dark edge round the painted parts, soft enough not to read as a drawn outline. */
const OUTLINE = "#6b2a04";
const EDGE = 0.6;

function Tube({ x, fill }: { x: number; fill: string }) {
  return <rect x={x} y="67" width="36" height="21" rx="6.5" fill={fill} stroke={OUTLINE} strokeWidth={EDGE} />;
}

/**
 * An orange binder clip traced from the notepad reference, keeping its shape: a flat orange plate leaning a
 * little to the right, with a rolled edge along its top, two round tubes at its foot with a lip and a
 * notch between them, and one steel handle whose arms run down the front into the tubes, shaped like a
 * keyhole above the clip. Shaded as glossy painted metal. Purely decorative.
 */
export default function BinderClip({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const url = (name: string) => `url(#${id}-${name})`;
  return (
    <svg
      aria-hidden="true"
      width={SIZE.width}
      height={SIZE.height}
      viewBox="-12 -94 152 192"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-plate`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7a1a" />
          <stop offset="0.6" stopColor="#f06a0c" />
          <stop offset="1" stopColor="#d4560a" />
        </linearGradient>
        {/* The plate darkens towards its edges, the way a slightly curved sheet catches less light there. */}
        <linearGradient id={`${id}-plate-side`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5a2203" stopOpacity="0.45" />
          <stop offset="0.07" stopColor="#5a2203" stopOpacity="0" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="0.9" stopColor="#5a2203" stopOpacity="0" />
          <stop offset="1" stopColor="#5a2203" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={`${id}-roll`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffa45c" />
          <stop offset="0.45" stopColor="#f57414" />
          <stop offset="1" stopColor="#c4500a" />
        </linearGradient>
        <linearGradient id={`${id}-tube`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a4d" />
          <stop offset="0.3" stopColor="#f37012" />
          <stop offset="0.75" stopColor="#d2580b" />
          <stop offset="1" stopColor="#9a3f06" />
        </linearGradient>
        <linearGradient id={`${id}-lip`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4560a" />
          <stop offset="0.45" stopColor="#f06d12" />
          <stop offset="1" stopColor="#a8450a" />
        </linearGradient>
        <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9cdd1" />
          <stop offset="0.5" stopColor="#eef0f2" />
          <stop offset="1" stopColor="#b3b8bd" />
        </linearGradient>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <filter id={`${id}-glint`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>

      <g transform={`rotate(${LEAN} 67 0)`}>
        {/* The plate, shaded towards its sides, with a fine outline. */}
        <path d={PLATE} fill={url("plate")} stroke={OUTLINE} strokeWidth={EDGE} />
        <path d={PLATE} fill={url("plate-side")} />

        {/* The rolled top edge, catching the light along its upper side. */}
        <rect x="1" y="-1.5" width="132" height="9" rx="4.5" fill={url("roll")} stroke={OUTLINE} strokeWidth={EDGE} />
        <path d="M6 0.6 L128 0.6" stroke="#ffd2a8" strokeWidth="1" strokeLinecap="round" opacity="0.7" />

        {/* The lip between the tubes, with a few glints along its top where the paint is glossiest. */}
        <path d={LIP} fill={url("lip")} stroke={OUTLINE} strokeWidth={EDGE} />
        <path d="M47 80.2 L55 80.4 M63 80.6 L66 80.7 M75 80.8 L86 81.1" stroke="#ffe3c9" strokeWidth="1.3" strokeLinecap="round" opacity="0.45" filter={url("glint")} />

        {/* The handle's shadow on the plate, then the handle: a dark edge, the steel, and a bright line. */}
        <path d={HANDLE} stroke="#3a1802" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" transform="translate(2.2 2.6)" filter={url("soft")} />
        <path d={HANDLE} stroke="#26282b" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={HANDLE} stroke={url("steel")} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d={HANDLE} stroke="#fff" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />

        {/* The tubes the handle's arms go into, in front of the arms' ends. */}
        <Tube x={-1} fill={url("tube")} />
        <Tube x={99} fill={url("tube")} />
        <path d="M4 70.5 L30 70.5 M104 70.5 L130 70.5" stroke="#ffc794" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      </g>
    </svg>
  );
}
