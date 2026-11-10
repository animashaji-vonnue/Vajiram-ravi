import type { CoverArtKind } from "@/data/programmes";

/*
 * The covers' geometric art, recreated from the `kevin` branch's course wall (the client's screenshot of
 * 14 Nov 2026; the art itself is not on GitHub yet). Drawn on a 100 × 100 box over the cover, clipped by it,
 * mostly off its right and bottom edges. Each motif moves in its own way while the book is hovered
 * (`group/book`), and settles back on leaving. Reduced motion: it stays still.
 */

/** A shape that moves on hover: its own box as the origin, a smooth 700ms. */
const MOVE = "[transform-box:fill-box] origin-center [transition:translate_700ms_var(--ease-out),scale_700ms_var(--ease-out),rotate_700ms_var(--ease-out),opacity_700ms_var(--ease-out)] motion-reduce:transition-none";

export default function CoverArt({ kind, accent, soft }: { kind: CoverArtKind; accent: string; soft: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 size-full overflow-hidden">
      {kind === "bars" && (
        <>
          <rect x={52} y={45} width={60} height={13} rx={6.5} fill={accent} className={`${MOVE} group-hover/book:-translate-x-[14px]`} />
          <rect x={22} y={62} width={90} height={16} rx={8} fill={soft} opacity={0.75} className={`${MOVE} group-hover/book:translate-x-[8px]`} />
          <rect x={30} y={82} width={80} height={14} rx={7} fill={soft} opacity={0.45} className={`${MOVE} group-hover/book:-translate-x-[10px]`} />
        </>
      )}
      {kind === "circles" && (
        <>
          <circle cx={98} cy={84} r={44} fill={soft} opacity={0.55} className={`${MOVE} group-hover/book:scale-[1.12]`} />
          <circle cx={20} cy={104} r={36} fill={soft} opacity={0.45} className={`${MOVE} group-hover/book:-translate-y-[6px]`} />
          <circle cx={62} cy={68} r={16} fill={accent} className={`${MOVE} group-hover/book:-translate-x-[10px] group-hover/book:-translate-y-[8px]`} />
        </>
      )}
      {kind === "grid" && (
        <g>
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => {
              const centre = row === 1 && col === 1;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={48 + col * 20}
                  y={46 + row * 20}
                  width={15}
                  height={15}
                  rx={2.5}
                  fill={centre ? accent : soft}
                  opacity={centre ? 1 : 0.6}
                  className={`${MOVE} group-hover/book:rotate-45 ${centre ? "group-hover/book:scale-[1.05]" : "group-hover/book:scale-[0.82]"}`}
                  style={{ transitionDelay: `${(row + col) * 40}ms` }}
                />
              );
            }),
          )}
        </g>
      )}
      {kind === "arches" && (
        <>
          <path d="M8 104 V82 A22 22 0 0 1 30 60 H30 V104 Z" fill={soft} opacity={0.6} className={`${MOVE} group-hover/book:translate-x-[8px]`} />
          <path d="M108 104 V82 A22 22 0 0 0 86 60 H86 V104 Z" fill={soft} opacity={0.8} className={`${MOVE} group-hover/book:-translate-x-[8px]`} />
          <circle cx={58} cy={76} r={4} fill={accent} className={`${MOVE} group-hover/book:scale-[1.6]`} />
        </>
      )}
      {kind === "arcs" && (
        <>
          <circle cx={22} cy={104} r={48} fill={soft} opacity={0.35} className={`${MOVE} group-hover/book:scale-[1.1]`} />
          <circle cx={22} cy={104} r={32} fill={soft} opacity={0.5} className={`${MOVE} group-hover/book:scale-[1.18]`} />
          <circle cx={66} cy={62} r={9} fill={accent} className={`${MOVE} group-hover/book:translate-x-[6px] group-hover/book:-translate-y-[10px]`} />
        </>
      )}
      {kind === "lines" && (
        <>
          <rect x={30} y={44} width={34} height={8} rx={2.5} fill={accent} className={`${MOVE} group-hover/book:scale-x-[1.4] origin-left`} />
          {[
            { y: 57, w: 22 },
            { y: 70, w: 44 },
            { y: 83, w: 20 },
          ].map((line, i) => (
            <rect
              key={line.y}
              x={30}
              y={line.y}
              width={line.w}
              height={8}
              rx={2.5}
              fill={soft}
              opacity={0.75}
              className={`${MOVE} origin-left group-hover/book:scale-x-[1.35]`}
              style={{ transitionDelay: `${(i + 1) * 60}ms` }}
            />
          ))}
        </>
      )}
      {kind === "target" && (
        <>
          <circle cx={58} cy={76} r={34} fill={soft} opacity={0.35} className={`${MOVE} group-hover/book:scale-[1.08]`} />
          <circle cx={58} cy={76} r={23} fill={soft} opacity={0.5} className={`${MOVE} group-hover/book:scale-[1.12]`} style={{ transitionDelay: "60ms" }} />
          <circle cx={58} cy={76} r={13} fill={soft} opacity={0.7} className={`${MOVE} group-hover/book:scale-[1.16]`} style={{ transitionDelay: "120ms" }} />
          <circle cx={58} cy={76} r={6} fill={accent} className={`${MOVE} group-hover/book:scale-[1.3]`} />
        </>
      )}
      {kind === "quarters" && (
        <>
          <path d="M30 104 V92 A26 26 0 0 1 56 66 V104 Z" fill={soft} opacity={0.6} className={`${MOVE} group-hover/book:-translate-y-[6px]`} />
          <path d="M80 104 V90 A24 24 0 0 1 104 66 V104 Z" fill={soft} opacity={0.75} className={`${MOVE} group-hover/book:-translate-y-[10px]`} />
          <circle cx={76} cy={46} r={3.5} fill={accent} className={`${MOVE} group-hover/book:-translate-x-[12px] group-hover/book:translate-y-[6px]`} />
        </>
      )}
    </svg>
  );
}
