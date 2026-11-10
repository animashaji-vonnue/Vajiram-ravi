"use client";

import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import MegaMenu from "@/components/layout/MegaMenu";
import { mainNav, menus, type MenuId, type NavItem } from "@/data/site";
import { cx } from "@/lib/cx";

/** Hover intent before a menu opens, and the grace period before it closes once the pointer has left. */
const OPEN_DELAY = 120;
const CLOSE_DELAY = 200;

/** Figma "nav item": 14px × 8px padding round a 16px Source Sans 3 Medium label in charcoal. */
const ITEM =
  "group/nav relative isolate flex items-center rounded-full px-3.5 py-2 text-[16px]/[23px] font-medium whitespace-nowrap [transition:color_var(--dur-instant)_var(--ease-out)] hover:text-burnt";

/**
 * The mark of the link in use, matching the tabs: a soft burnt pill behind the label, full when marked,
 * faint on hover.
 */
function Indicator({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute inset-0 -z-10 rounded-full bg-burnt/10 [transition:opacity_var(--dur-fast)_var(--ease-out)]",
        on ? "opacity-100" : "opacity-0 group-hover/nav:opacity-50",
      )}
    />
  );
}

/**
 * The main header's links (Figma "Header / Main", 2258:10385), 4px apart. Motion spec: hovering a label
 * turns it burnt and fades in a faint burnt pill behind it; the link of the section in view (`current`,
 * tracked by SiteHeader) keeps the pill.
 *
 * All Courses, Study Materials and UPSC Exam are buttons that open mega menus: on hover after a 120ms
 * intent delay, or at once on click / Enter / Space (ArrowDown also moves into the panel). A menu closes
 * 200ms after the pointer leaves it, when focus moves out of it, on a click elsewhere, and on Escape,
 * which returns focus to its trigger when focus was inside. Only one is open at a time.
 */
export default function MainNav({ current }: { current: string | null }) {
  const [open, setOpen] = useState<MenuId | null>(null);
  // A click on a menu the pointer has just opened keeps it open rather than closing it again.
  const openedByHover = useRef(false);
  const timer = useRef(0);
  const wrappers = useRef<Partial<Record<MenuId, HTMLLIElement | null>>>({});
  const triggers = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});

  const schedule = (action: () => void, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(action, delay);
  };
  const cancel = () => window.clearTimeout(timer.current);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // While a menu is open: Escape and clicks outside it close it.
  useEffect(() => {
    if (!open) return;
    const wrapper = wrappers.current[open];
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (wrapper?.contains(document.activeElement)) triggers.current[open]?.focus();
      cancel();
      setOpen(null);
    };
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (wrapper && !wrapper.contains(event.target as Node)) {
        cancel();
        setOpen(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const onPointerEnter = (id: MenuId) => (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    if (open === id) return cancel();
    schedule(() => {
      openedByHover.current = true;
      setOpen(id);
    }, OPEN_DELAY);
  };

  const onPointerLeave = (id: MenuId) => (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    schedule(() => setOpen((value) => (value === id ? null : value)), CLOSE_DELAY);
  };

  const onTriggerClick = (id: MenuId) => (event: MouseEvent) => {
    cancel();
    if (open !== id) {
      openedByHover.current = false;
      setOpen(id);
    } else if (openedByHover.current && event.detail > 0) {
      openedByHover.current = false;
    } else {
      setOpen(null);
    }
  };

  const onTriggerKeyDown = (id: MenuId) => (event: KeyboardEvent) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    cancel();
    openedByHover.current = false;
    setOpen(id);
    requestAnimationFrame(() => wrappers.current[id]?.querySelector<HTMLElement>(`#menu-${id} a`)?.focus());
  };

  const onBlur = (id: MenuId) => (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && !wrappers.current[id]?.contains(next)) setOpen((value) => (value === id ? null : value));
  };

  const renderItem = (item: NavItem) => {
    const marked = current === item.href;
    if (!item.menu) {
      return (
        <a href={item.href} aria-current={marked ? "true" : undefined} className={cx(ITEM, marked ? "text-burnt" : "text-charcoal")}>
          {item.label}
          <Indicator on={marked} />
        </a>
      );
    }
    const id = item.menu;
    const isOpen = open === id;
    return (
      <>
        <button
          ref={(el) => {
            triggers.current[id] = el;
          }}
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-controls={`menu-${id}`}
          aria-current={marked ? "true" : undefined}
          onClick={onTriggerClick(id)}
          onKeyDown={onTriggerKeyDown(id)}
          className={cx(ITEM, "cursor-pointer", isOpen || marked ? "text-burnt" : "text-charcoal")}
        >
          {item.label}
          <Indicator on={isOpen || marked} />
        </button>
        <MegaMenu id={`menu-${id}`} menu={menus[id]} open={isOpen} />
      </>
    );
  };

  return (
    <nav aria-label="Main">
      <ul className="flex items-center gap-1">
        {mainNav.map((item) => (
          <li
            key={item.label}
            className="relative"
            ref={
              item.menu
                ? (el) => {
                    wrappers.current[item.menu!] = el;
                  }
                : undefined
            }
            onPointerEnter={item.menu ? onPointerEnter(item.menu) : undefined}
            onPointerLeave={item.menu ? onPointerLeave(item.menu) : undefined}
            onBlur={item.menu ? onBlur(item.menu) : undefined}
          >
            {renderItem(item)}
          </li>
        ))}
      </ul>
    </nav>
  );
}
