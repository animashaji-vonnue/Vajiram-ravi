import Image from "next/image";
import { stats } from "@/data/home";
import { cx } from "@/lib/cx";

/**
 * The stats, brought into the hero under its buttons: a compact version of the design's "Stats strip"
 * (3541:496) that fits the 600px text column. Three equal columns split by thin dividers, each with its
 * small coloured motif, the figure, and the unit and context as one caption.
 */
export default function HeroStats() {
  return (
    <ul aria-label="Vajiram & Ravi in numbers" className="grid w-full grid-cols-3 pt-6">
      {stats.map((stat, i) => (
        <li
          key={stat.value}
          className={cx("flex flex-col gap-3", i === 0 ? "pr-4" : "border-l border-neutral-200 px-4", i === stats.length - 1 && "pr-0")}
        >
          <Image src={`/images/stats/${stat.motif}.svg`} alt="" width={24} height={24} />
          <p className="flex flex-col gap-1">
            <span className="font-display text-[32px]/[38px] font-medium tracking-[-0.64px] text-neutral-900">
              {stat.value}
            </span>
            <span className="font-sans text-[14px]/[20px] font-medium text-neutral-600">
              {stat.unit} {stat.text}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}
