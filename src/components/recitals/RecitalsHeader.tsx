"use client";

import { useEffect, useState } from "react";
import { PhoneIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

/*
 * The header: the glass nav with the logo, the eight site links and the "Let's talk" pill,
 * exactly as drawn in Figma. Nothing is added to it — no wordmark, no page-section links.
 *
 * The running announcements banner that used to sit above it is gone. On a page whose whole
 * job is to introduce one magazine, a strip of unrelated scrolling notices was the first
 * thing a reader met and the first thing they ignored.
 *
 * The only thing not in the frame is behaviour: the nav hides on the way down and returns on
 * the way up, so reading gets the whole window.
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

export default function RecitalsHeader() {
  /*
   * Hide on the way down, come back on the way up, as on withbobbin.com. Reading gets the
   * whole window; the moment you look for navigation, it is already there. The small
   * threshold stops it flickering on trackpad jitter, and near the top it is always shown.
   */
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 120) setHidden(false);
      else if (y > last + 6) setHidden(true);
      else if (y < last - 6) setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* The glass nav, sticky so it stays with you down the page. */}
      <div
        className={cx(
          /*
           * The nav floats over the hero rather than sitting above it. In Figma it lives
           * inside the hero frame, so the paper texture runs behind it; as a block in the
           * flow it was leaving a strip of untextured page colour across the top. The
           * negative margin takes its 78px back out of the flow while `sticky` still works.
           */
          "sticky top-0 z-50 mx-auto -mb-[78px] w-full max-w-[1440px] px-20 pt-3.5 pb-0",
          "[transition:translate_.45s_var(--ease-settle)]",
          hidden ? "-translate-y-[130%]" : "translate-y-0",
        )}
      >
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
