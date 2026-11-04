import type { CSSProperties } from "react";
import { Fragment } from "react";
import { ChevronRightSmIcon, DownloadIcon } from "@/components/icons";
import { KnobButton, OutlineButton } from "@/components/ui/Buttons";
import { Eyebrow, Lead } from "@/components/ui/Typography";
import { issues, latestIssue, magazine, magazineStats } from "@/data/magazine";
import Cover from "./Cover";

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Study materials", href: "/#resources" },
];

/** The two issues before the latest, fanned out behind it. */
const behind = [issues[2], issues[1]];

export default function MagazineHero() {
  return (
    <section className="overflow-x-clip" aria-labelledby="mag-h">
      <div className="relative mx-auto flex w-canvas items-center gap-16 px-20 pt-10 pb-20">
        <div className="flex min-w-0 flex-1 flex-col gap-10">
          <nav className="flex items-center gap-1.5 font-sans text-[14px]/[21px] font-medium text-neutral-500" aria-label="Breadcrumb">
            {crumbs.map((crumb) => (
              <Fragment key={crumb.label}>
                <a href={crumb.href} className="transition-colors duration-200 hover:text-neutral-900">
                  {crumb.label}
                </a>
                <ChevronRightSmIcon className="text-neutral-400" />
              </Fragment>
            ))}
            <span className="text-neutral-900" aria-current="page">
              {magazine.name}
            </span>
          </nav>

          <div data-reveal className="flex flex-col gap-5">
            <Eyebrow>THE RECITALS · MONTHLY CURRENT AFFAIRS MAGAZINE</Eyebrow>
            <div className="flex flex-col gap-4">
              <h1 id="mag-h" className="w-[640px] font-display text-[56px]/[62px] font-semibold text-neutral-900">
                Current affairs, written the way UPSC asks it
              </h1>
              <Lead className="w-[600px]">
                Every month’s news, turned into Prelims MCQs, Mains answers, an ethics case study and feature articles.
                Free to download, every issue since {magazine.firstIssue}.
              </Lead>
            </div>
          </div>

          <div data-reveal className="flex flex-col gap-4" style={{ "--d": "80ms" } as CSSProperties}>
            <div className="flex items-center gap-3">
              <KnobButton href={latestIssue.pdf}>Download {latestIssue.label}</KnobButton>
              <OutlineButton href="#issues">Browse every issue</OutlineButton>
            </div>
            <p className="flex items-center gap-1.5 font-sans text-[14px]/[21px] font-medium text-neutral-500">
              <DownloadIcon className="text-neutral-400" />
              Free PDF · Published {magazine.latestPublished}
            </p>
          </div>

          <dl data-reveal className="flex items-center gap-5 border-t border-neutral-200 pt-8" style={{ "--d": "160ms" } as CSSProperties}>
            {magazineStats.map((stat, i) => (
              <Fragment key={stat.label}>
                {i > 0 && <div className="h-11 w-px bg-neutral-200" />}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <dt className="order-2 font-sans text-[14px]/[20px] font-medium text-neutral-500">{stat.label}</dt>
                  <dd className="order-1 font-display text-[28px]/[34px] font-semibold text-brand-950 tabular-nums">{stat.value}</dd>
                </div>
              </Fragment>
            ))}
          </dl>
        </div>

        {/* The latest cover, with the two previous issues fanned out behind it. */}
        <div data-reveal className="relative h-[520px] w-[560px] flex-none" aria-label={`${latestIssue.label} issue`}>
          <div className="absolute top-1/2 left-1/2 size-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--color-brand-100),transparent)] opacity-80" />
          {behind.map((issue, i) => (
            <Cover
              key={issue.label}
              issue={issue}
              className={
                i === 0
                  ? "absolute top-[82px] left-[46px] w-[250px] -rotate-[11deg] opacity-90 shadow-[0_24px_40px_-24px_rgba(28,25,23,.45)]"
                  : "absolute top-[82px] right-[46px] w-[250px] rotate-[11deg] opacity-90 shadow-[0_24px_40px_-24px_rgba(28,25,23,.45)]"
              }
            />
          ))}
          <a
            href={latestIssue.pdf}
            className="group/cover absolute top-[50px] left-1/2 block w-[300px] -translate-x-1/2 rounded-[10px] transition-transform duration-500 ease-smooth hover:-translate-y-1.5"
            aria-label={`Download the ${latestIssue.label} issue (PDF)`}
          >
            <Cover
              issue={latestIssue}
              priority
              className="w-full shadow-[0_40px_60px_-28px_rgba(28,25,23,.55)] transition-shadow duration-500 ease-smooth group-hover/cover:shadow-[0_52px_70px_-28px_rgba(28,25,23,.6)]"
            />
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900 px-3.5 py-1.5 font-display text-[12px]/[16px] font-semibold tracking-[.04em] whitespace-nowrap text-white uppercase shadow-[0_8px_20px_-8px_rgba(0,0,0,.5)]">
              Latest issue
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
