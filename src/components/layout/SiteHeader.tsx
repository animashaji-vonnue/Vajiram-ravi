"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { ANCHOR_JUMP_EVENT } from "@/components/layout/anchorJump";
import LetsTalkSheet from "@/components/layout/LetsTalkSheet";
import MainNav from "@/components/layout/MainNav";
import SearchDialog from "@/components/layout/SearchDialog";
import Cta from "@/components/ui/Cta";
import Icon from "@/components/ui/Icon";
import { mainNav } from "@/data/site";
import { canvasTop } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";
import { scrollToElement } from "@/lib/smoothScroll";

/** Scroll distance (canvas px) after which the header hides on the way down and gains its shadow. */
const HIDE_AFTER = 80;
/** How far the page must scroll back up (canvas px) to bring the header back: a small, deliberate move. */
const SHOW_AFTER = 12;
/** A section is "current" while it crosses a thin band just below the middle of the viewport. */
const BAND = { rootMargin: "-45% 0px -50% 0px" };
/** The phone in "Let's talk" rings on the first hover of a visit only. */
const RANG_KEY = "vr-header-phone-rang";

/**
 * The header at the top of the page flow: the 80px white main header (Figma "00 Header", 2258:10384) with
 * the logo, the links and "Let's talk", the site's orange CTA with the phone in its medallion. (The
 * mahogany contact strip that sat above it has been removed at the client's request.) The hero starts
 * under it; the announcement strip runs between the hero and the preparation journey
 * (layout/AnnouncementBar, placed by app/page).
 *
 * Motion: it is sticky, and it gets out of the way while reading. At the top of the page it is whole.
 * Scrolling down past 80px slides it up out of view (data-hidden, --dur-base, --ease-in-out); scrolling back
 * up by 12px brings it back (80px, lib/smoothScroll's HEADER_OFFSET) with a shadow (--shadow-rest) under
 * it. It stays in view while it holds the keyboard focus or a menu is open. One rAF-throttled scroll
 * listener drives this, writing data attributes so React does not
 * re-render. While the page glides to a section (an in-page link or a search result) it stays hidden.
 *
 * "Let's talk" opens the contact sheet, and ⌘K / Ctrl+K anywhere opens the search box (the design has no
 * search button).
 */
export default function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // ⌘K on a Mac, Ctrl+K elsewhere, toggles the search box from anywhere on the page.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSheetOpen(false);
        setSearchOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The sticky behaviour: the page's one scroll listener, throttled to a frame.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let frame = 0;
    let last = 0;
    // The furthest point reached since the page last moved down; scrolling up from it reveals the bar.
    let peak = 0;
    let jumping = false;
    let settle = 0;

    const endJumpSoon = (delay: number) => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => (jumping = false), delay);
    };

    const update = () => {
      frame = 0;
      // How far the page has scrolled, in canvas pixels (the canvas may be zoomed down).
      const y = Math.max(0, -canvasTop(document.body));
      // Never hide a header the visitor is using: focus inside it, or one of its menus open.
      const inUse = header.matches(":focus-within") || !!header.querySelector('[aria-expanded="true"]');
      let hidden = header.hasAttribute("data-hidden");
      if (y <= HIDE_AFTER) {
        hidden = false;
        peak = y;
      } else if ((jumping || y > last) && !inUse) {
        hidden = true;
        peak = y;
      } else if (peak - y >= SHOW_AFTER || inUse) {
        hidden = false;
      }
      if (jumping) endJumpSoon(200);
      last = y;
      header.toggleAttribute("data-hidden", hidden);
      header.toggleAttribute("data-raised", y > HIDE_AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // A glide to a section starts: keep the header hidden until the page has settled.
    const startJump = () => {
      jumping = true;
      endJumpSoon(400);
    };
    const onClick = (event: globalThis.MouseEvent) => {
      const href = (event.target as Element | null)?.closest?.('a[href^="#"]')?.getAttribute("href");
      if (href && href.length > 1) startJump();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener(ANCHOR_JUMP_EVENT, startJump);
    document.addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener(ANCHOR_JUMP_EVENT, startJump);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  // The link of the section in view keeps its indicator (the lowest one, when two share the band).
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const inBand = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inBand.add(entry.target);
        else inBand.delete(entry.target);
      }
      let pick: Element | null = null;
      for (const el of inBand) if (!pick || pick.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) pick = el;
      setCurrent(pick ? `#${pick.id}` : null);
    }, BAND);
    for (const item of mainNav) {
      // Only in-page links have a section to watch; the others leave the page.
      const section = item.href.startsWith("#") && item.href.length > 1 ? document.getElementById(item.href.slice(1)) : null;
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  // Focus reaching the header (Tab from the top) brings it back into view.
  const revealHeader = () => headerRef.current?.removeAttribute("data-hidden");

  // The logo goes back to the very top, past the sticky header's offset.
  const toTop = (event: MouseEvent) => {
    event.preventDefault();
    scrollToElement(document.documentElement, 0);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  };

  // Motion spec: the phone medallion rings once (-12° → 12° → 0, 400ms) on the first hover of a visit.
  const ring = (event: PointerEvent) => {
    const phone = phoneRef.current;
    if (!phone || phone.dataset.rang || event.pointerType === "touch" || prefersReducedMotion()) return;
    phone.dataset.rang = "1";
    try {
      if (sessionStorage.getItem(RANG_KEY)) return;
      sessionStorage.setItem(RANG_KEY, "1");
    } catch {
      // Without storage it rings once per page view instead.
    }
    const easing = "cubic-bezier(0.65, 0, 0.35, 1)";
    phone.animate(
      [
        { transform: "rotate(0deg)", easing },
        { transform: "rotate(-12deg)", easing },
        { transform: "rotate(12deg)", easing },
        { transform: "rotate(0deg)" },
      ],
      { duration: 400 },
    );
  };

  return (
    <>
      <header
        ref={headerRef}
        onFocus={revealHeader}
        className="group/header sticky top-0 z-50 [transition:translate_var(--dur-base)_var(--ease-in-out)] data-hidden:-translate-y-full"
      >
        {/* --shadow-rest under the main header and strip once the page has scrolled (fades; never animates the shadow itself). */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 bottom-0 -z-10 opacity-0 shadow-rest [transition:opacity_var(--dur-base)_var(--ease-out)] group-data-raised/header:opacity-100"
        />

        <div className="relative z-20 h-20 border-b border-[#e8e4df] bg-white">
          <div className="mx-auto flex h-full w-canvas items-center justify-between px-10 pt-3.5 pb-[13px]">
            <a href="#top" onClick={toTop} aria-label="Vajiram & Ravi – Institute for IAS Examination, home" className="flex w-[180px] shrink-0 items-center">
              <img src="/images/logo.webp" alt="" width={176} height={40} className="h-10 w-[176px] object-cover" />
            </a>

            <MainNav current={current} />

            {/* The site's own button (CTA / Indian, primary), with the phone in its saffron medallion. */}
            <span onPointerEnter={ring} className="flex shrink-0">
              <Cta
                variant="primary"
                size="md"
                hasPopup="dialog"
                onClick={() => setSheetOpen(true)}
                icon={
                  <span ref={phoneRef} className="block">
                    <Icon name="phone" className="size-4 brightness-0 invert" />
                  </span>
                }
              >
                Let&apos;s talk
              </Cta>
            </span>
          </div>
        </div>

      </header>
      <LetsTalkSheet open={sheetOpen} onClose={closeSheet} />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  );
}
