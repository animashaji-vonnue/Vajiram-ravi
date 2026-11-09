"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { nav, ticker } from "@/data/new-home";
import { Flower } from "./ui";

/**
 * Running ticker. Two copies of the announcements on one track, so sliding it by half loops
 * without a seam. It stops under the pointer or keyboard focus, and has its own pause button,
 * because anything that moves for more than five seconds must be stoppable.
 */
export function Ticker() {
  const [paused, setPaused] = useState(false);
  const items = [...ticker, ...ticker];

  return (
    <div className="group/ticker relative flex h-11 items-center overflow-hidden bg-v-ink text-v-paper" aria-label="Announcements" role="region">
      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
        <ul
          className={cx(
            "flex w-max animate-[v-ticker_70s_linear_infinite] items-center group-hover/ticker:[animation-play-state:paused] group-focus-within/ticker:[animation-play-state:paused] motion-reduce:animate-none",
            paused && "[animation-play-state:paused]",
          )}
        >
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 pr-10 font-v-body text-[14.5px] whitespace-nowrap" aria-hidden={i >= ticker.length || undefined}>
              <span className="rounded-full bg-v-orange-500 px-2.5 py-0.5 text-[11.5px] font-bold tracking-[0.08em] text-v-ink uppercase">{item.tag}</span>
              <span className="text-v-paper/90">{item.text}</span>
              {item.link ? (
                <a
                  href={item.link.href}
                  tabIndex={i >= ticker.length ? -1 : undefined}
                  className="font-semibold text-v-orange-300 underline decoration-v-orange-300/40 underline-offset-4 hover:decoration-v-orange-300"
                >
                  {item.link.label}
                </a>
              ) : null}
              <Flower size={10} className="ml-7 text-v-orange-500" />
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="mr-3 ml-1 grid size-8 shrink-0 place-items-center rounded-full text-v-paper/80 hover:bg-v-paper/10 hover:text-v-paper motion-reduce:hidden"
        aria-label={paused ? "Play announcements" : "Pause announcements"}
        aria-pressed={paused}
      >
        {paused ? (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}

/**
 * Site header. Sticky; slides away while reading down the page and returns the moment you
 * scroll up, with a 6px threshold so trackpad jitter does not make it flicker. Always shown
 * near the top. Below 1024px the links fold into a menu.
 */
export function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      setScrolled(y > 48);
      if (y < 120) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      if (Math.abs(delta) > 6) lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cx(
        "sticky top-0 z-50 transition-[transform,background-color,box-shadow] duration-300 ease-v-out",
        hidden && !open ? "-translate-y-full" : "translate-y-0",
        scrolled || open ? "bg-v-paper/95 shadow-[0_1px_0_var(--color-v-line),0_10px_30px_-18px_rgb(90_32_4/0.35)] backdrop-blur-md" : "bg-v-paper",
      )}
    >
      <div className="mx-auto flex h-[76px] w-full max-w-[1360px] items-center gap-6 px-5 sm:px-8 lg:px-10">
        <a href="#top" className="shrink-0 rounded-md" aria-label="Vajiram & Ravi, back to top">
          <img src="/images/logo.webp" alt="" width={750} height={180} className="h-10 w-auto" />
        </a>

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative rounded-full px-3.5 py-2 font-v-body text-[15.5px] font-semibold text-v-ink-700 transition-colors duration-200 hover:bg-v-cream hover:text-v-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#guidance"
          className="ml-auto hidden h-11 items-center rounded-full bg-v-orange-500 px-5 font-v-body text-[15.5px] font-semibold text-v-ink transition-[background-color,transform] duration-200 hover:bg-v-orange-400 active:scale-[0.97] sm:inline-flex lg:ml-2"
        >
          Get Expert Guidance
        </a>

        <button
          type="button"
          className="ml-auto grid size-11 place-items-center rounded-full border-2 border-v-ink text-v-ink sm:ml-0 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            {open ? (
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M2.5 5h13M2.5 9h13M2.5 13h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t border-v-line bg-v-paper px-5 pt-3 pb-6 sm:px-8 lg:hidden"
      >
        <ul className="flex flex-col">
          {nav.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-v-line py-3.5 font-v-head text-[20px] font-bold text-v-ink"
              >
                {link.label}
                <Flower size={10} className="text-v-orange-500" />
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#guidance"
          onClick={() => setOpen(false)}
          className="mt-5 flex h-12 items-center justify-center rounded-full bg-v-orange-500 font-v-body text-[16px] font-semibold text-v-ink sm:hidden"
        >
          Get Expert Guidance
        </a>
      </nav>
    </header>
  );
}
