import type { ReactNode } from "react";
import { ArrowRightIcon, ArrowRightXsIcon, ClockIcon, DownloadIcon, SelectChevronIcon } from "@/components/icons";
import { DiamondMark, doubleRule, Eyebrow, FlowerMark } from "@/components/recitals/Ornaments";
import type { Issue } from "@/data/magazine";
import { cx } from "@/lib/cx";

/*
 * The Recitals — cards and controls.
 *
 * Shared shape language: a manuscript double rule on the edge, a flower or lozenge where a
 * separator is needed, serif for anything numeric or titular, Figtree for anything read in
 * sentences. The ornament is always on the frame, never behind the words.
 */

/** A postage-stamp tag. Perforated edge, so it reads as franked rather than as a web badge. */
export function StampBadge({ children, tone = "saffron" }: { children: ReactNode; tone?: "saffron" | "indigo" }) {
  const bg = tone === "saffron" ? "bg-r-orange" : "bg-r-copper";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 px-3 py-1.5 font-sans text-[11px]/[14px] font-semibold tracking-[.1em] text-r-white uppercase",
        "outline-1 outline-dashed outline-r-white/55 -outline-offset-[3px]",
        bg,
      )}
    >
      {children}
    </span>
  );
}

/** Metadata line: pages, file size, anything factual. Separated by flowers, not dots. */
export function MetaLine({ items, className }: { items: string[]; className?: string }) {
  return (
    <p className={cx("flex flex-wrap items-center gap-2 font-sans text-[13px]/[18px] font-medium text-r-ink-500", className)}>
      {items.map((item, i) => (
        <span key={item} className="flex items-center gap-2">
          {i > 0 && <FlowerMark size={7} className="text-r-amber" />}
          {item}
        </span>
      ))}
    </p>
  );
}

/**
 * One issue, as a postage stamp (Figma: Card / Issue — L).
 *
 * Geometry read off the Figma vector rather than estimated: a 14px rust border, a cream
 * stamp inside it, notches of 3.3px radius at a 8.99px pitch, and the cover inset a
 * further 20px. The cover itself is never cut, masked or decorated — all the character
 * lives in the border, which is the one place ornament can go without fighting artwork as
 * busy as these covers.
 *
 * Two actions on separate targets. The stamp opens the issue to read. The bar across the
 * foot downloads it, and it is a bar rather than a line of small print because a 9px
 * caption with a 12px icon is neither noticeable nor reliably hittable — it is 44px tall,
 * full width, and visible without hovering, since "free PDF, no sign-in" is the whole
 * offer of this page and hiding it until the pointer arrives undersells it.
 */
export function IssueCard({ issue, latest }: { issue: Issue; latest?: boolean }) {
  return (
    <article
      className={cx(
        "group/issue relative flex flex-col bg-[#b9501f] p-[14px]",
        /* Hover lifts and swells this one card and nothing else: dimming its neighbours
           made the shelf read as half-disabled rather than as a row of objects. */
        "[transition:translate_.35s_var(--ease-settle),scale_.35s_var(--ease-settle),box-shadow_.35s_var(--ease-settle)]",
        "hover:-translate-y-2.5 hover:scale-[1.015] hover:shadow-[0_30px_54px_-26px_rgba(94,27,16,.55)]",
      )}
    >
      <div className="r-perforated relative flex flex-1 flex-col bg-[#fdf6e8] px-5 pt-5">
        <div className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={issue.cover}
            alt={`${issue.label} cover`}
            width={260}
            height={336}
            loading="lazy"
            decoding="async"
            className="aspect-[260/336] w-full object-cover transition-transform duration-700 ease-[var(--ease-settle)] group-hover/issue:scale-[1.03]"
          />
          {latest && (
            <span className="absolute top-2 left-2">
              <StampBadge>Latest</StampBadge>
            </span>
          )}
        </div>

        <div className="flex flex-col items-center gap-0.5 pt-3 pb-3.5 text-center">
          <h3 className="font-r-masthead text-[27px]/[30px] text-[#8a3516]">
            <a
              href={issue.pdf}
              target="_blank"
              rel="noreferrer"
              className="after:absolute after:inset-0 after:content-['']"
            >
              {issue.month} <span className="text-[#b9501f] italic">{issue.year}</span>
            </a>
          </h3>
          <p className="font-sans text-[10px]/[14px] font-semibold tracking-[.12em] text-[#8a3516]/55 uppercase">
            {issue.pages} pages
          </p>
        </div>

        <a
          href={issue.pdf}
          download
          aria-label={`Download ${issue.label} as a PDF, ${issue.size}`}
          className={cx(
            "relative z-10 -mx-5 flex h-11 items-center justify-center gap-2 border-t border-[#8a3516]/15",
            "font-sans text-[13px]/[18px] font-semibold text-[#8a3516]",
            "transition-colors duration-200 hover:bg-[#f6e7cf] hover:text-[#b9501f]",
            "focus-visible:bg-[#f6e7cf] focus-visible:text-[#b9501f] focus-visible:outline-none",
          )}
        >
          <DownloadIcon className="size-4" />
          Download PDF · {issue.size}
        </a>
      </div>
    </article>
  );
}


/** A related free collection: Yojana, Kurukshetra, Quick Revision, Mains Probable. */
export function CollectionCard({ title, body, icon }: { title: string; body: string; icon: ReactNode }) {
  return (
    <article className={cx("group/col flex h-full flex-col gap-5 bg-r-paper p-6", doubleRule)}>
      <span className="flex size-12 items-center justify-center bg-r-cream text-r-rust shadow-[inset_0_0_0_1px_var(--color-r-line)]">{icon}</span>
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="font-r-editorial text-[20px]/[26px] text-r-ink">{title}</h3>
        <p className="font-sans text-[14px]/[22px] font-medium text-r-ink-700">{body}</p>
      </div>
      <div className="flex items-center gap-3 border-t border-r-line pt-4">
        <DiamondMark size={6} className="text-r-amber" />
        <a href="#" className="flex items-center gap-1.5 font-sans text-[14px]/[20px] font-semibold text-r-rust">
          Open the booklets
          <ArrowRightXsIcon className="transition-transform duration-300 group-hover/col:translate-x-0.5" />
        </a>
      </div>
    </article>
  );
}

/** A headline figure. The numeral is the ornament, so nothing else competes with it. */
export function StatCard({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="relative flex flex-col gap-1 bg-r-cream p-5 shadow-[inset_0_0_0_1px_var(--color-r-line)]">
      <DiamondMark size={6} className="absolute top-2.5 right-2.5 text-r-amber" />
      <p className="font-r-display font-extrabold text-[40px]/[44px] text-r-rust">{value}</p>
      <p className="font-sans text-[14px]/[20px] font-medium text-r-ink-700">{label}</p>
    </div>
  );
}

/** A numbered entry from "Inside an issue" or "Why monthly". */
export function NumberedRow({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <div className="group/row flex items-start gap-6 border-b border-r-line py-6 last:border-b-0">
      <span className="w-12 shrink-0 font-r-display font-extrabold text-[30px]/[34px] text-r-sand transition-colors duration-300 group-hover/row:text-r-amber">
        {index}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="font-r-editorial text-[20px]/[26px] text-r-ink">{title}</h3>
        <p className="font-sans text-[15px]/[23px] font-medium text-r-ink-700">{body}</p>
      </div>
    </div>
  );
}

/** One pass of the reading method, with when to do it and how long it takes. */
export function StepCard({ index, when, minutes, title, body }: { index: string; when: string; minutes: string; title: string; body: string }) {
  return (
    <article className={cx("flex h-full flex-col gap-4 bg-r-paper p-6", doubleRule)}>
      <div className="flex items-center justify-between">
        <span className="font-r-display font-extrabold text-[32px]/[36px] text-r-rust">{index}</span>
        <span className="flex items-center gap-1.5 bg-r-cream px-2.5 py-1 font-sans text-[12px]/[16px] font-semibold text-r-ink-700">
          <ClockIcon className="size-3.5" />
          {minutes}
        </span>
      </div>
      <p className="font-sans text-[12px]/[16px] font-semibold tracking-[.14em] text-r-amber uppercase">{when}</p>
      <div className="flex flex-col gap-2">
        <h3 className="font-r-editorial text-[19px]/[25px] text-r-ink">{title}</h3>
        <p className="font-sans text-[14px]/[22px] font-medium text-r-ink-700">{body}</p>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ controls ---------- */

const CONTROL = "inline-flex shrink-0 items-center justify-center gap-2.5 font-sans font-semibold whitespace-nowrap transition-colors duration-250";

export function SolidButton({ children, href = "#" }: { children: ReactNode; href?: string }) {
  return (
    <a href={href} className={cx(CONTROL, "group/btn h-12 bg-r-rust px-6 text-[15px]/[20px] text-r-white hover:bg-r-oxblood")}>
      {children}
      <ArrowRightIcon className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
    </a>
  );
}

export function GhostButton({ children, href = "#" }: { children: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className={cx(
        CONTROL,
        "h-12 bg-transparent px-6 text-[15px]/[20px] text-r-ink shadow-[inset_0_0_0_1px_var(--color-r-line)] hover:bg-r-cream",
      )}
    >
      {children}
    </a>
  );
}

export function QuietLink({ children, href = "#" }: { children: ReactNode; href?: string }) {
  return (
    <a href={href} className="group/link inline-flex items-center gap-1.5 font-sans text-[15px]/[21px] font-semibold text-r-rust">
      <span className="border-b border-r-rust/30 pb-0.5 transition-colors duration-200 group-hover/link:border-r-rust">{children}</span>
      <ArrowRightXsIcon className="transition-transform duration-300 group-hover/link:translate-x-0.5" />
    </a>
  );
}

export function YearChip({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex h-9 items-center px-3.5 font-sans text-[14px]/[20px] font-semibold tabular-nums transition-colors duration-200",
        active ? "bg-[#e2650d] text-white" : "text-r-ink-700 shadow-[inset_0_0_0_1px_var(--color-r-line)] hover:bg-r-cream",
      )}
    >
      {children}
    </span>
  );
}

export function SearchField({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex h-12 flex-1 items-center gap-3 bg-r-paper px-4 shadow-[inset_0_0_0_1px_var(--color-r-line)]">
      <FlowerMark size={11} className="text-r-amber" />
      <span className="font-sans text-[15px]/[21px] font-medium text-r-ink-500">{placeholder}</span>
    </div>
  );
}

export function SelectField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-12 items-center gap-3 bg-r-paper px-4 shadow-[inset_0_0_0_1px_var(--color-r-line)]">
      <span className="font-sans text-[14px]/[20px] font-medium text-r-ink-500">{label}</span>
      <span className="font-sans text-[15px]/[21px] font-semibold text-r-ink">{value}</span>
      <SelectChevronIcon className="text-r-ink-500" />
    </div>
  );
}

/** Standard section opening: eyebrow, serif heading, optional lead. */
export function SectionHead({
  id,
  eyebrow,
  title,
  lead,
  center,
  className,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-col gap-4", center && "items-center text-center", className)}>
      <Eyebrow className={center ? "justify-center" : undefined}>{eyebrow}</Eyebrow>
      <h2 id={id} className="max-w-[760px] font-r-editorial text-[40px]/[48px] font-bold text-r-ink">
        {title}
      </h2>
      {lead && <p className="max-w-[640px] font-sans text-[17px]/[27px] font-medium text-r-ink-700">{lead}</p>}
    </div>
  );
}
