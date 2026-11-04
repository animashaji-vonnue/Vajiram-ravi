"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Buttons";
import { isNavMenu, mainNav } from "@/data/site";
import { cx } from "@/lib/cx";
import NavPanel from "./NavPanel";

/** Grace period before a hover menu closes once the pointer leaves, so a slightly off path doesn't shut it. */
const CLOSE_DELAY_MS = 160;

/**
 * A nav item's label: dark grey, turning the design's active blue while hovered, focused or open. Only
 * the colour changes, so the row never shifts.
 */
const ITEM =
  "flex h-10 cursor-pointer items-center px-3 font-display text-[16px]/[24px] font-medium whitespace-nowrap text-neutral-700 transition-colors duration-200 hover:text-blue-900 focus-visible:text-blue-900 focus-visible:-outline-offset-2 aria-expanded:text-blue-900";

/**
 * The header, after the design's "Nav · C1 framed tile" (3663:42638): a white bar holding the logo, the
 * main items and "Let's talk" inside a blue cartouche, a double line with rounded ends and small fleurons
 * at its corners. The cartouche is a nine-slice border image: its 64px ends are drawn as they are and only
 * the straight middle stretches, so it fits any width. Menus open on hover, after
 * harvey.ai: hovering a menu item drops its panel under the bar; moving to the next item keeps the
 * panel open, resizes its background to fit and crossfades the contents. Hovering a plain link or
 * leaving the header closes it.
 * Accessibility: menu items are buttons that report whether their panel is open and which panel it
 * is; Enter or Space opens a panel and Tab moves through its links. Escape, a click outside or tabbing
 * out of the header closes it, and Escape returns focus to the item. Closed panels are `inert`.
 */
export default function SiteHeader() {
  const groupRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const contentRefs = useRef(new Map<string, HTMLDivElement>());
  const closeTimer = useRef(0);
  const id = useId();
  const [active, setActive] = useState<string | null>(null);
  const [panelHeight, setPanelHeight] = useState(0);
  const [warm, setWarm] = useState(false);

  // The shared background takes the height of whichever panel is open.
  useLayoutEffect(() => {
    if (active) setPanelHeight(contentRefs.current.get(active)?.offsetHeight ?? 0);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const group = groupRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      triggerRefs.current.get(active)?.focus();
      setActive(null);
    };
    const onPointer = (event: PointerEvent) => {
      if (group && !group.contains(event.target as Node)) setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [active]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const keepOpen = () => window.clearTimeout(closeTimer.current);
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActive(null), CLOSE_DELAY_MS);
  };

  return (
    // In the flow it takes 80px; the other 20px of the bar hang over the page.
    <header className="sticky top-0 z-40 h-20">
      <div className="h-[100px] bg-white">
        <div
          ref={groupRef}
          className="relative mx-auto h-full w-full max-w-wide pt-3"
          onPointerEnter={() => {
            keepOpen();
            setWarm(true);
          }}
          onPointerLeave={(event) => event.pointerType === "mouse" && closeSoon()}
          onFocus={() => setWarm(true)}
          // Tabbing out of the header closes whatever is open.
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
          }}
        >
          {/* The cartouche, 24px in from the sides and 12px from the top and bottom. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [border-image:url(/images/nav/cartouche.svg)_50_64_fill/50px_64px_stretch] border-solid"
          />
          <div className="relative flex h-[76px] items-center justify-between px-16">
            <a
              href="#top"
              aria-label="Vajiram & Ravi – Institute for IAS Examination, home"
              className="block h-10 w-[176px] shrink-0 bg-no-repeat [background-image:var(--image-logo)] [background-position:0_50%] [background-size:100%_106.67%]"
            />

            <nav aria-label="Main">
              <ul className="flex items-center gap-1">
                {mainNav.map((item, index) => {
                  if (!isNavMenu(item)) {
                    return (
                      <li key={item.label} onPointerEnter={() => setActive(null)} onFocus={() => setActive(null)}>
                        <a href={item.href} className={ITEM}>
                          {item.label}
                        </a>
                      </li>
                    );
                  }
                  const open = active === item.label;
                  const panelId = `${id}-menu-${index}`;
                  return (
                    <li
                      key={item.label}
                      // Focus reaching another item closes a menu left open from the keyboard.
                      onFocus={() => active && active !== item.label && setActive(null)}
                    >
                      <button
                        ref={(button) => {
                          if (button) triggerRefs.current.set(item.label, button);
                        }}
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onPointerEnter={(event) => event.pointerType === "mouse" && setActive(item.label)}
                        // Clicking a menu the hover already opened keeps it open; Enter, Space or a tap toggles it.
                        onClick={(event) => {
                          const mouse = (event.nativeEvent as PointerEvent).pointerType === "mouse";
                          if (!(mouse && open)) setActive(open ? null : item.label);
                        }}
                        className={ITEM}
                      >
                        {item.label}
                      </button>
                      <NavPanel
                        id={panelId}
                        menu={item}
                        open={open}
                        warm={warm}
                        onNavigate={() => setActive(null)}
                        contentRef={(element) => {
                          if (element) contentRefs.current.set(item.label, element);
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </nav>

            <Button href="#contact" size="nav">
              Let&apos;s talk
            </Button>
          </div>

          {/* The menus' shared background: it fades in under the bar and resizes to the open panel. */}
          <div
            aria-hidden="true"
            className={cx(
              "pointer-events-none absolute top-full left-0 -z-10 mt-2 w-full rounded-2xl border border-neutral-200 bg-white shadow-[0_16px_40px_-12px_rgba(28,25,23,0.18)] transition-[height,opacity] duration-300 ease-smooth",
              active ? "opacity-100" : "opacity-0",
            )}
            style={{ height: panelHeight }}
          />
        </div>
      </div>
    </header>
  );
}
