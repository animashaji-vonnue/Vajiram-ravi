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
 * in Newsreader), the title, the design's rule-and-diamond divider and the sentence.
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
            <span className={cx("font-serif text-[40px]/[1] tracking-[-0.8px]", SHIFT, active ? "text-saffron" : "text-burnt")}>{card.figure}</span>
          )}
          <span className={cx("font-serif text-[24px]/[1.2]", SHIFT, active ? "text-white" : "text-mahogany")}>{card.title}</span>
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
 * The cards' line icons in the medallion's colour, 22px: a diya for the founding, two figures for the
 * educators, an open book for the specialists, a briefcase for the careers, the institute's pillared front
 * for a classroom and a screen with a play mark for LIVE-Online.
 */
function CardIcon({ icon }: { icon: AboutIcon }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {icon === "diya" && (
        <>
          <path d="M12 3.5c1.9 2.1 2.6 3.7 2.6 5a2.6 2.6 0 0 1-5.2 0c0-1.3.7-2.9 2.6-5Z" />
          <path d="M3.5 13.5h17c0 3.3-3.8 5.5-8.5 5.5s-8.5-2.2-8.5-5.5Z" />
          <path d="M9 21h6" />
        </>
      )}
      {icon === "educators" && (
        <>
          <circle cx={9} cy={8} r={3} />
          <path d="M3.5 19.5c0-3.2 2.5-5.5 5.5-5.5s5.5 2.3 5.5 5.5" />
          <circle cx={16.5} cy={9} r={2.4} />
          <path d="M15.5 14.2c3 .2 5 2.3 5 5.3" />
        </>
      )}
      {icon === "book" && (
        <>
          <path d="M12 6.5c-1.8-1.4-4.6-2-8-1.8v12.6c3.4-.2 6.2.4 8 1.8 1.8-1.4 4.6-2 8-1.8V4.7c-3.4-.2-6.2.4-8 1.8Z" />
          <path d="M12 6.5v12.6" />
        </>
      )}
      {icon === "careers" && (
        <>
          <rect x={3.5} y={7.5} width={17} height={12} rx={1.75} />
          <path d="M9 7.5V5.75c0-.7.55-1.25 1.25-1.25h3.5c.7 0 1.25.55 1.25 1.25V7.5" />
          <path d="M3.5 12.5h17M12 11.5v2" />
        </>
      )}
      {icon === "classroom" && (
        <>
          <path d="M3.5 9.25 12 4.5l8.5 4.75Z" />
          <path d="M6.5 12v5M10.5 12v5M13.5 12v5M17.5 12v5" />
          <path d="M4.5 17.5h15M3.5 20h17" />
        </>
      )}
      {icon === "online" && (
        <>
          <rect x={3} y={4.5} width={18} height={12.5} rx={1.75} />
          <path d="M9 20.25h6M12 17v3.25" />
          <path d="M10.5 8.5v4.5l3.75-2.25Z" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
