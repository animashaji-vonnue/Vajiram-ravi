import type { AboutCard, AboutIcon } from "@/data/about";
import { cx } from "@/lib/cx";

const ART = "/images/about";

/**
 * The cards' light papers (Figma "card · 02" to "card · 06" and one more in the same family for the first
 * card, which the design draws dark): cream to peach and gold, at 140°, as drawn. Each card keeps its own.
 */
const PAPERS = [
  ["#fff1d6", "#eeae68"],
  ["#fff6e6", "#f6c391"],
  ["#ffefc9", "#f2b45a"],
  ["#fff3e3", "#f0a86c"],
  ["#fbe6d9", "#e39a7e"],
  ["#f8ebd2", "#d6a15e"],
] as const;

/** Colours and the dark look cross over --dur-base. */
const SHIFT = "[transition:color_var(--dur-base)_var(--ease-out)]";
const FADE = "[transition:opacity_var(--dur-base)_var(--ease-out)]";

/**
 * One card of the arc (Figma "card · 01 Proven track record (active)" and its light siblings): 280 × 388,
 * 16px corners, everything centred: the scalloped medallion with the card's icon (a fact's figure under it
 * in Mukta), the title, the design's rule-and-diamond divider and the sentence.
 *
 * The card at the centre takes the design's active look: the dark maroon-to-rust paper, a saffron hairline,
 * the saffron medallion, a saffron figure and cream text, with the hover shadow. The others rest on their
 * light papers with a white hairline and the rest shadow, in ink. The looks cross-fade over --dur-base as
 * the wheel turns. A side card lifts 8px (along its own lean) with the hover shadow under a mouse pointer,
 * to say it can be brought to the centre.
 */
export default function ArcCard({ card, index, active }: { card: AboutCard; index: number; active: boolean }) {
  const [from, to] = PAPERS[index % PAPERS.length];
  return (
    <div
      className={cx(
        "absolute inset-0 flex flex-col items-center gap-3.5 overflow-clip rounded-2xl px-5 pt-8 pb-7 text-center [transition:translate_var(--dur-fast)_var(--ease-out),box-shadow_var(--dur-base)_var(--ease-out)]",
        active ? "shadow-hover" : "shadow-rest group-hover/arc:-translate-y-2 group-hover/arc:shadow-hover",
      )}
      style={{ backgroundImage: `linear-gradient(140deg, ${from} 7.4%, ${to} 81.5%)` }}
    >
      <span aria-hidden="true" className={cx("absolute inset-0 bg-linear-140/srgb from-[#5a160f] from-7% to-[#b4501e] to-81%", FADE, active ? "opacity-100" : "opacity-0")} />
      <span
        aria-hidden="true"
        className={cx("pointer-events-none absolute inset-0 rounded-2xl border [transition:border-color_var(--dur-base)_var(--ease-out)]", active ? "border-saffron/35" : "border-white/70")}
      />

      <div className="relative flex flex-col items-center gap-3">
        <Medallion icon={card.icon} active={active} />
        <h3 className="flex flex-col items-center gap-1.5 font-normal">
          {card.kind === "fact" && (
            <span className={cx("font-heading text-[40px]/[1] tracking-[-0.8px]", SHIFT, active ? "text-saffron" : "text-burnt")}>{card.figure}</span>
          )}
          <span className={cx("font-heading text-[24px]/[1.2]", SHIFT, active ? "text-white" : "text-mahogany")}>{card.title}</span>
        </h3>
      </div>

      {/* The rule-and-diamond divider: burnt on the light papers, saffron on the dark. */}
      <span aria-hidden="true" className="relative h-2.5 w-[150px] shrink-0">
        {(["light", "dark"] as const).map((art) => (
          <img
            key={art}
            src={`${ART}/divider-${art}.svg`}
            alt=""
            width={150}
            height={10}
            draggable={false}
            className={cx("absolute inset-0 h-2.5 w-[150px] max-w-none", FADE, (art === "dark") !== active && "opacity-0")}
          />
        ))}
      </span>

      <p className={cx("relative text-[14px]/[1.55] font-medium", SHIFT, active ? "text-cream/85" : "text-ink/85")}>{card.text}</p>
    </div>
  );
}

/**
 * A card's medallion (the design's scalloped number medallion, carrying an icon instead): the orange
 * scallop with a cream stitch and a white icon, turning saffron with a dark stitch and a mahogany icon at
 * the centre.
 */
function Medallion({ icon, active }: { icon: AboutIcon; active: boolean }) {
  return (
    <span aria-hidden="true" className="relative block size-14 shrink-0">
      {(["light", "dark"] as const).map((art) => (
        <span key={art} className={cx("absolute inset-0", FADE, (art === "dark") !== active && "opacity-0")}>
          <img
            src={`${ART}/medallion-scallop-${art === "dark" ? "saffron" : "orange"}.svg`}
            alt=""
            width={56}
            height={54.8}
            draggable={false}
            className="absolute top-[0.6px] left-0 h-[54.8px] w-14 max-w-none"
          />
          <img
            src={`${ART}/medallion-stitch-${art === "dark" ? "dark" : "cream"}.svg`}
            alt=""
            width={45}
            height={45}
            draggable={false}
            className="absolute top-[5.5px] left-[5.5px] size-[45px] max-w-none"
          />
        </span>
      ))}
      <span className={cx("absolute inset-0 flex items-center justify-center", SHIFT, active ? "text-mahogany" : "text-white")}>
        <CardIcon icon={icon} />
      </span>
    </span>
  );
}

/**
 * The cards' line icons in the medallion's colour, 22px, each saying what its card says: a calendar for
 * the year of founding, a teacher at the board for the educators and mentors, a graduation cap for the
 * subject specialists, the Ashoka Chakra for careers in the Civil Services, a map pin for a campus, and a
 * laptop broadcasting live for LIVE-Online learning.
 */
function CardIcon({ icon }: { icon: AboutIcon }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {icon === "calendar" && (
        <>
          <rect x={3.5} y={5} width={17} height={15.5} rx={2} />
          <path d="M3.5 9.5h17M8 3v4M16 3v4" />
          <path d="m9 14.75 2 2 4-4" />
        </>
      )}
      {icon === "educators" && (
        <>
          <rect x={10} y={3.5} width={11} height={8.5} rx={1} />
          <circle cx={5.5} cy={8} r={2.2} />
          <path d="M2.5 20.5v-4.25a3 3 0 0 1 3-3h1.75l3.25-2.75" />
          <path d="M15.5 12v4M13 20.5l2.5-4.5 2.5 4.5" />
        </>
      )}
      {icon === "specialists" && (
        <>
          <path d="M2 9.25 12 4.5l10 4.75-10 4.75Z" />
          <path d="M6 11.25v4.5c0 1.4 2.7 2.75 6 2.75s6-1.35 6-2.75v-4.5" />
          <path d="M22 9.25v5" />
        </>
      )}
      {icon === "chakra" && (
        <>
          <circle cx={12} cy={12} r={8.5} />
          <circle cx={12} cy={12} r={2.2} />
          <path d="M14.20 12.00L20.00 12.00 M13.91 13.10L18.93 16.00 M13.10 13.91L16.00 18.93 M12.00 14.20L12.00 20.00 M10.90 13.91L8.00 18.93 M10.09 13.10L5.07 16.00 M9.80 12.00L4.00 12.00 M10.09 10.90L5.07 8.00 M10.90 10.09L8.00 5.07 M12.00 9.80L12.00 4.00 M13.10 10.09L16.00 5.07 M13.91 10.90L18.93 8.00" strokeWidth={1.1} />
        </>
      )}
      {icon === "campus" && (
        <>
          <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
          <circle cx={12} cy={9.5} r={2.5} />
        </>
      )}
      {icon === "online" && (
        <>
          <rect x={4} y={5} width={16} height={11} rx={1.5} />
          <path d="M2 19h20" />
          <circle cx={12} cy={10.5} r={1.4} fill="currentColor" />
          <path d="M9 8a3.75 3.75 0 0 0 0 5M15 8a3.75 3.75 0 0 1 0 5" />
        </>
      )}
    </svg>
  );
}
