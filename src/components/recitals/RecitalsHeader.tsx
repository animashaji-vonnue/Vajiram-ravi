"use client";

import { Fragment } from "react";
import { PhoneIcon } from "@/components/icons";
import { FlowerMark } from "@/components/recitals/Ornaments";
import { announcements } from "@/data/site";
import { cx } from "@/lib/cx";

/*
 * The header, as drawn in the approved Direction A frame: the dark running banner, then the
 * glass nav with the logo, the eight site links and the "Let's talk" pill. Nothing is added
 * to it — no wordmark, no page-section links, no restyling.
 *
 * The only thing that is not in the frame is behaviour: the banner scrolls away as ordinary
 * page content and the nav sticks, so it is still there on a page this long.
 */

const NAV = [
  { label: "All Courses", href: "#" },
  { label: "Toppers", href: "#" },
  { label: "Study Materials", href: "#", current: true },
  { label: "Current Affairs", href: "#" },
  { label: "UPSC Exam", href: "#" },
  { label: "Upcoming Batches", href: "#" },
  { label: "FAQs", href: "#faq" },
  { label: "Contact us", href: "#" },
];

function BannerRun({ clone }: { clone?: boolean }) {
  return (
    <span className="flex shrink-0 items-center gap-[22px] pr-[22px]" aria-hidden={clone ? "true" : undefined}>
      {announcements.map((item) => (
        <Fragment key={item.text}>
          <a
            href={item.href}
            tabIndex={clone ? -1 : undefined}
            className="font-sans text-[12.5px]/[16px] font-medium whitespace-nowrap text-[#fff1dd]/88 transition-colors duration-200 hover:text-[#fff1dd]"
          >
            {item.text}
          </a>
          <FlowerMark size={10} className="shrink-0 text-r-amber/85" />
        </Fragment>
      ))}
    </span>
  );
}

export default function RecitalsHeader() {
  return (
    <>
      {/* Announcements. Ordinary page content: it scrolls away. */}
      <div className="group/ann relative h-9 overflow-hidden bg-[#2a1206] px-6" aria-label="Announcements">
        <div className="flex h-full items-center">
          <div className="flex w-max animate-[r-marquee_52s_linear_infinite] items-center group-hover/ann:[animation-play-state:paused] motion-reduce:animate-none">
            <BannerRun />
            <BannerRun clone />
          </div>
        </div>
      </div>

      {/* The glass nav, sticky so it stays with you down the page. */}
      <div className="sticky top-0 z-50 mx-auto w-full max-w-[1440px] px-20 pt-3.5 pb-0">
        <nav
          className="flex h-16 items-center justify-between rounded-full border border-white/90 bg-white/62 py-3 pr-3 pl-6 shadow-[0_12px_32px_-12px_rgba(122,52,16,.12)] backdrop-blur-[24px]"
          aria-label="Main"
        >
          <a href="/recitals" className="flex shrink-0 items-center" aria-label="Vajiram & Ravi">
            <span
              className="block h-9 w-[158px] bg-contain bg-left bg-no-repeat [background-image:var(--image-logo)]"
              role="img"
              aria-label="Vajiram & Ravi"
            />
          </a>

          <div className="flex items-center gap-7">
            {NAV.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={cx(
                  "font-sans text-[15px]/[18px] whitespace-nowrap transition-colors duration-200",
                  link.current ? "font-semibold text-[#b4430c]" : "font-medium text-[#2a2433] hover:text-[#b4430c]",
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#"
            className="group/talk flex h-12 shrink-0 items-center gap-2.5 rounded-full bg-[#1c1a27] py-2.5 pr-2.5 pl-5 font-sans text-[15px]/[18px] font-semibold text-white"
          >
            Let&apos;s talk
            <span className="flex size-7 items-center justify-center rounded-full bg-[#f07a1a] text-white">
              <PhoneIcon className="size-4 transition-transform duration-300 group-hover/talk:-rotate-12" />
            </span>
          </a>
        </nav>
      </div>
    </>
  );
}
