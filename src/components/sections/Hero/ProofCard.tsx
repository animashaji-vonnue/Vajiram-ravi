import { heroProof } from "@/data/hero";
import { cx } from "@/lib/cx";
import { AT, ENTER, at } from "./enter";

/**
 * The proof card (Figma "Proof card – ranks 1 to 10", 2256:5605): a 330 × 120 parchment card, r20, at
 * (760, 546) over the statue's plinth, with eight avatars of AIR 1 to 8.
 *
 * It links to the selections page: the heading is the link, stretched over the whole card, and the card
 * lifts 4px on hover (presses to 0.98 on touch). The avatars sit above that stretch as links of their
 * own, named for their topper, so they can be focused: hovering or focusing one enlarges it to 1.15 and
 * shows a tooltip with the name and rank in Geist Mono 11 (motion spec, "Proof card"). It slides in 24px
 * from the right as the last step of the hero's load.
 */
export default function ProofCard() {
  const last = heroProof.avatars.length - 1;
  return (
    <div className={cx("absolute top-[546px] left-[760px] w-[330px] starting:translate-x-6", ENTER)} style={at(AT.card)}>
      <div className="relative h-[120px] rounded-[20px] bg-parchment px-5 pt-[18px] shadow-[0_16px_18px_rgba(20,8,3,0.4)] [transition:translate_var(--dur-fast)_var(--ease-out),box-shadow_var(--dur-fast)_var(--ease-out),scale_80ms_var(--ease-out)] hover:-translate-y-1 hover:shadow-[0_22px_28px_rgba(20,8,3,0.5)] pointer-coarse:active:scale-[.98]">
        <a href={heroProof.href} className="block after:absolute after:inset-0 after:rounded-[20px]">
          <span className="block font-sans text-[11px]/[14px] font-bold tracking-[1.32px] whitespace-nowrap text-burnt uppercase">
            {heroProof.eyebrow}
          </span>
          <span className="mt-1 block font-serif text-[22px]/[26px] tracking-[-0.01em] whitespace-nowrap text-mahogany">{heroProof.title}</span>
        </a>
        <ul className="relative mt-3 flex" aria-label={`${heroProof.eyebrow} toppers`}>
          {heroProof.avatars.map((avatar, i) => (
            <li key={avatar.rank} className={cx("relative hover:z-10 has-focus-visible:z-10", i < last && "-mr-[9px]")}>
              <a href={heroProof.href} aria-label={`${avatar.name}, AIR ${avatar.rank}`} className="group/av block size-7 rounded-full">
                <img
                  src={avatar.image}
                  alt=""
                  width={28}
                  height={28}
                  decoding="async"
                  className="block size-7 rounded-full border-2 border-parchment bg-parchment object-cover [transition:scale_var(--dur-fast)_var(--ease-out)] group-hover/av:scale-115 group-focus-visible/av:scale-115"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 rounded-md bg-ink px-2 py-1 font-mono text-[11px]/[14px] whitespace-nowrap text-cream opacity-0 [transition:opacity_var(--dur-fast)_var(--ease-out),translate_var(--dur-fast)_var(--ease-out)] group-hover/av:translate-y-0 group-hover/av:opacity-100 group-focus-visible/av:translate-y-0 group-focus-visible/av:opacity-100"
                >
                  {avatar.name} · AIR {avatar.rank}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
