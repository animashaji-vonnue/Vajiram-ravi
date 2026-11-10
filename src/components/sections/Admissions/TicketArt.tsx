import type { TicketArtName } from "@/data/admissions";

/** The rays fanned over the open book: 11 of them, one for each month of the comprehensive programme. */
const RAYS = Array.from({ length: 11 }, (_, i) => {
  const angle = Math.PI + (Math.PI * (i + 1)) / 12;
  const [x, y] = [Math.cos(angle), Math.sin(angle)];
  return `M${(152 + x * 20).toFixed(2)} ${(46 + y * 20).toFixed(2)}L${(152 + x * 40).toFixed(2)} ${(46 + y * 40).toFixed(2)}`;
});

/** A four-pointed sparkle centred on (x, y), r across. */
const sparkle = (x: number, y: number, r: number) =>
  `M${x} ${y - r}L${x + r * 0.28} ${y - r * 0.28}L${x + r} ${y}L${x + r * 0.28} ${y + r * 0.28}L${x} ${y + r}L${x - r * 0.28} ${y + r * 0.28}L${x - r} ${y}L${x - r * 0.28} ${y - r * 0.28}Z`;

/**
 * The line drawings, each in the lotus mark's hand: white hairlines (1.2px) at two strengths, the fainter
 * (10%) for what lies behind and the stronger (18%) for the subject, drawn on the same 204 × 108 box to the
 * right of the date and cut off by the head's edges.
 */
const ART: Record<TicketArtName, { faint: string[]; strong: string[] }> = {
  // Prelims CAMP: a tent under the hills, its flag up and its guy ropes pegged, with the stars out.
  camp: {
    faint: [
      "M30 108L84 46L112 76L150 30L204 100",
      "M112 86L84 108",
      "M188 86L212 104",
      sparkle(98, 20, 6),
      sparkle(190, 24, 5),
      sparkle(70, 30, 4),
    ],
    strong: ["M96 108L150 34L204 108", "M150 34L150 12", "M150 12L168 18L150 24", "M150 58L136 108", "M150 58L164 108", "M108 108H192"],
  },
  // SMART Prelims Current Affairs: the globe, its meridians and parallels, inside an orbit.
  globe: {
    faint: [
      "M152 8A58 58 0 1 1 151.99 8Z",
      "M152 8A20 58 0 1 1 151.99 8Z",
      "M101.8 37H202.2",
      "M101.8 95H202.2",
      "M119.4 18H184.6",
      "M66 92C66 70 238 34 238 56C238 78 66 114 66 92Z",
    ],
    strong: ["M152 -4A70 70 0 1 1 151.99 -4Z", "M152 8A40 58 0 1 1 151.99 8Z", "M94 66H210", "M152 8V124"],
  },
  // SMART Current Affairs: the day's paper on top of yesterday's, masthead, headline, photograph and columns.
  newspaper: {
    faint: [
      "M118 -6H214V114H118Z",
      "M112 38H188",
      "M112 44H164",
      "M152 54H188M152 60H188M152 66H188M152 72H188M152 78H180",
      "M112 88H146M152 88H188M112 94H146M152 94H188M112 100H140M152 100H188",
    ],
    strong: ["M102 6H198V126H102Z", "M112 16H188V26H112Z", "M112 31H188", "M112 52H146V80H112Z", "M112 80L124 64L132 72L138 66L146 76"],
  },
  // The 11-month comprehensive programme: an open book, its pages fanned, with 11 rays above it.
  book: {
    faint: [
      "M88 86V92C110 88 134 90 152 102C170 90 194 88 216 92V86",
      "M100 52C114 50 128 52 140 58M100 62C114 60 128 62 140 68M100 72C114 70 128 72 140 78",
      "M164 58C176 52 190 50 204 52M164 68C176 62 190 60 204 62M164 78C176 72 190 70 204 72",
      ...RAYS,
    ],
    strong: ["M152 96C134 84 110 82 88 86V40C110 36 134 38 152 50Z", "M152 96C170 84 194 82 216 86V40C194 36 170 38 152 50Z", "M152 50V96"],
  },
};

/**
 * A batch ticket's own drawing on its coloured head (after the lotus mark that the featured ticket carries),
 * fitting its subject. Decoration only.
 */
export default function TicketArt({ name }: { name: TicketArtName }) {
  const { faint, strong } = ART[name];
  return (
    <svg
      aria-hidden="true"
      width={204}
      height={108}
      viewBox="0 0 204 108"
      fill="none"
      overflow="visible"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute top-0 left-[104px] max-w-none"
    >
      <g stroke="white" strokeOpacity={0.1}>
        {faint.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g stroke="white" strokeOpacity={0.18}>
        {strong.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
