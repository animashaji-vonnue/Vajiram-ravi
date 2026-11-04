"use client";

import { useEffect, useState } from "react";
import { KnobButton } from "@/components/ui/Buttons";
import { mainNav } from "@/data/site";
import { cx } from "@/lib/cx";

const STUCK_AFTER_PX = 40;
/** A section counts as "current" while it crosses a thin band just below the middle of the viewport. */
const BAND = { rootMargin: "-45% 0px -50% 0px" };

/** Nav links are "/#section" (a homepage section) or a page path like "/magazine". */
function splitHref(href: string): { path: string; hash: string } {
  const at = href.indexOf("#");
  return at < 0 ? { path: href, hash: "" } : { path: href.slice(0, at), hash: href.slice(at) };
}

/**
 * Sticky header. Gains a shadow once the page scrolls and highlights the nav link of the section in view
 * on the homepage, or the nav link of the current page elsewhere.
 */
export default function SiteHeader() {
  const [stuck, setStuck] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > STUCK_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const page = window.location.pathname.replace(/\/$/, "") || "/";
    if (page !== "/") {
      const match = mainNav.find((link) => splitHref(link.href).path === page);
      setCurrent(match ? match.href : null);
      return;
    }
    if (!("IntersectionObserver" in window)) return;
    const observers: IntersectionObserver[] = [];

    const tracked = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setCurrent(`/#${entry.target.id}`);
    }, BAND);
    for (const link of mainNav) {
      const { hash } = splitHref(link.href);
      if (hash.length < 2) continue;
      const section = document.querySelector(hash);
      if (section) tracked.observe(section);
    }
    observers.push(tracked);

    // Sections without a nav link clear the highlight.
    document
      .querySelectorAll('main > section:not([id]), main > section[id="contact"], main > section[id="location"]')
      .forEach((section) => {
        const clearer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) setCurrent(null);
        }, BAND);
        clearer.observe(section);
        observers.push(clearer);
      });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return (
    <header
      id="hdr"
      data-chrome
      className={cx(
        "sticky top-0 z-40 border-b border-line-warm bg-white transition-shadow duration-300 ease-smooth",
        stuck && "shadow-[0_8px_24px_-12px_rgba(28,25,23,.18)]",
      )}
    >
      <div className="relative mx-auto flex h-[79px] w-canvas items-center justify-between px-10 pt-3.5 pb-[13px]">
        <a
          className="flex w-[180px] items-center rounded-lg"
          href="/#top"
          aria-label="Vajiram & Ravi – Institute for IAS Examination, home"
        >
          <span
            className="h-10 w-[176px] bg-no-repeat [background-image:var(--image-logo)] [background-position:0_50%] [background-size:100%_106.67%]"
            role="img"
            aria-label="Vajiram & Ravi logo"
          />
        </a>
        <nav className="flex items-center gap-1" aria-label="Main">
          {mainNav.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cx(
                "rounded-full px-3.5 py-2 font-display text-[16px]/[23px] font-medium whitespace-nowrap transition-colors duration-200 hover:bg-neutral-100",
                current === link.href ? "text-brand-700" : "text-neutral-900",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <KnobButton href="/#contact" size="md" icon="phone">
          Let&apos;s talk
        </KnobButton>
      </div>
    </header>
  );
}
