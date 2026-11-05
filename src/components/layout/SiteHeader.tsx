"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { ANCHOR_JUMP_EVENT } from "@/components/layout/anchorJump";
import LetsTalkSheet from "@/components/layout/LetsTalkSheet";
import MainNav from "@/components/layout/MainNav";
import SearchDialog from "@/components/layout/SearchDialog";
import UtilityBar from "@/components/layout/UtilityBar";
import Cta from "@/components/ui/Cta";
import Icon from "@/components/ui/Icon";
import { mainNav } from "@/data/site";
import { canvasTop } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";
import { scrollToElement } from "@/lib/smoothScroll";

/** Scroll distance (canvas px) after which the utility bar tucks away and the header gains its shadow. */
const TUCK_AFTER = 80;
/** How far the page must scroll back up to bring the utility bar back. */
const REVEAL_AFTER = 40;
/** A section is "current" while it crosses a thin band just below the middle of the viewport. */
const BAND = { rootMargin: "-45% 0px -50% 0px" };
/** The phone in "Let's talk" rings on the first hover of a visit only. */
const RANG_KEY = "vr-header-phone-rang";

/**
 * The header at the top of the page flow, 159px tall (Figma 2258:10448 and "00 Header", 2258:10384): the
 * 39px mahogany utility bar, the 80px white main header (logo, the links and "Let's talk", the site's ink
 * CTA with the phone in its medallion) and the 40px burnt announcement strip. The hero starts under it.
 *
 * Motion spec: it is sticky. After 80px of scroll the whole header slides up by the utility bar's height
 * (translateY(-39px), --dur-base), so the utility bar leaves the view and the main header and strip, 120px
 * (lib/smoothScroll's HEADER_OFFSET), stay at the top; a shadow (--shadow-rest) fades in under them.
 * Scrolling back up 40px brings the utility bar back; scrolling down tucks it again. One rAF-throttled
 * scroll listener drives this, writing data attributes so React does not re-render. While the page
 * glides to a section (an in-page link or a search result) the bar stays tucked, so the section lands
 * right under the 120px.
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
      let tucked = header.hasAttribute("data-tucked");
      if (y <= TUCK_AFTER) {
        tucked = false;
        peak = y;
      } else if (jumping || y > last) {
        tucked = true;
        peak = y;
      } else if (peak - y >= REVEAL_AFTER) {
        tucked = false;
      }
      if (jumping) endJumpSoon(200);
      last = y;
      header.toggleAttribute("data-tucked", tucked);
      header.toggleAttribute("data-raised", y > TUCK_AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // A glide to a section starts: keep the bar tucked until the page has settled.
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

  // Focus reaching the tucked utility bar (Tab from the top) brings it back into view.
  const revealUtility = () => headerRef.current?.removeAttribute("data-tucked");

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
        className="group/header sticky top-0 z-50 [transition:translate_var(--dur-base)_var(--ease-in-out)] data-tucked:-translate-y-[39px]"
      >
        {/* --shadow-rest under the main header and strip once the page has scrolled (fades; never animates the shadow itself). */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[39px] bottom-0 -z-10 opacity-0 shadow-rest [transition:opacity_var(--dur-base)_var(--ease-out)] group-data-raised/header:opacity-100"
        />

        <div onFocus={revealUtility}>
          <UtilityBar />
        </div>

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
                    <Icon name="phone" className="size-3.5 text-ink" />
                  </span>
                }
              >
                Let&apos;s talk
              </Cta>
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <AnnouncementBar />
        </div>
      </header>
      <LetsTalkSheet open={sheetOpen} onClose={closeSheet} />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  );
}
