"use client";

import { useEffect, useState } from "react";
import { ArrowRightIcon, DownloadIcon } from "@/components/icons";
import { FlowerMark } from "@/components/recitals/Ornaments";
import { latestIssue } from "@/data/magazine";
import { cx } from "@/lib/cx";

/*
 * The one thing most people came for is the current issue, and by the middle of the page
 * the hero's buttons are long gone. This bar carries them the rest of the way. It only
 * appears once the hero has scrolled past, and gets out of the way at the footer so it
 * never sits on top of the closing links.
 */
export default function StickyCta() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("latest");
    const footer = document.querySelector("footer");
    if (!("IntersectionObserver" in window)) return;

    let pastHero = false;
    let atFooter = false;
    const sync = () => setShown(pastHero && !atFooter);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero) pastHero = !entry.isIntersecting;
          if (entry.target === footer) atFooter = entry.isIntersecting;
        }
        sync();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    if (hero) observer.observe(hero);
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cx(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-6 pb-5",
        "[transition:opacity_.4s_var(--ease-settle),translate_.4s_var(--ease-settle)]",
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
      )}
    >
      <div className="pointer-events-auto flex items-center gap-8 bg-r-ink py-3 pr-3 pl-6 shadow-[0_20px_44px_-20px_rgba(43,23,16,.6)]">
        <p className="flex items-center gap-2.5 font-sans text-[14px]/[20px] font-medium whitespace-nowrap text-r-sand/85">
          <FlowerMark size={10} className="text-r-amber" />
          <span className="font-semibold text-r-paper">{latestIssue.label}</span> is live · {latestIssue.pages} pages ·
          free
        </p>
        <div className="flex items-center gap-2">
          <a
            href="#archive"
            className="inline-flex h-10 items-center px-4 font-sans text-[14px]/[20px] font-semibold whitespace-nowrap text-r-sand transition-colors duration-200 hover:text-r-paper"
          >
            Browse the archive
          </a>
          <a
            href={latestIssue.pdf}
            className="group/cta inline-flex h-10 items-center gap-2 bg-r-amber px-4 font-sans text-[14px]/[20px] font-semibold whitespace-nowrap text-r-ink transition-colors duration-200 hover:bg-r-saffron"
          >
            <DownloadIcon />
            Read it now
            <ArrowRightIcon className="transition-transform duration-300 group-hover/cta:translate-x-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
