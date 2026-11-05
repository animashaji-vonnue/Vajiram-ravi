"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";
import Medallion from "@/components/ui/Medallion";
import { links } from "@/data/links";
import { contact } from "@/data/site";
import { cx } from "@/lib/cx";
import { CARD_LINK } from "@/lib/hover";
import { lockScroll } from "@/lib/smoothScroll";

type LetsTalkSheetProps = { open: boolean; onClose: () => void };

/** The same ways to reach us as the contact section, in its words. */
const OPTIONS = [
  { title: "Course counselling", text: "Not sure which programme fits? A counsellor can help you.", action: "Book a free session", href: "#counsellor" },
  { title: "Chat on WhatsApp", text: "Quick answers on courses, batches and fees from our admissions team.", action: "Chat on WhatsApp", href: links.whatsapp },
  { title: "Email us", text: `Write to us on: ${contact.email}`, action: "Send an email", href: `mailto:${contact.email}` },
  { title: "Talk to us", text: `Contact us on: ${contact.phone}`, action: "Call now", href: contact.phoneHref },
];

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Entering over --dur-base with --ease-out; leaving in 70% of that with --ease-in. */
const ENTER = "[transition:opacity_var(--dur-base)_var(--ease-out),translate_var(--dur-base)_var(--ease-out)]";
const LEAVE = "[transition:opacity_calc(var(--dur-base)*0.7)_var(--ease-in),translate_calc(var(--dur-base)*0.7)_var(--ease-in)]";

/**
 * The "Let's talk" sheet the header button opens: the ways to reach the admissions team, sliding in from
 * the right over a dimmed page. In the final palette: a paper panel, a Newsreader heading with its
 * emphasis in burnt italic, and white linked cards (rest shadow, hover lift, the burnt medallion turning)
 * whose actions read like the page's Indian links. Focus moves into it on open, Tab stays inside it,
 * Escape, the backdrop and the close button dismiss it, focus returns to the button, and the page does
 * not scroll behind it.
 */
export default function LetsTalkSheet({ open, onClose }: LetsTalkSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      // The focus trap: Tab and Shift+Tab cycle through the sheet's own controls.
      const panel = panelRef.current;
      if (event.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const inside = panel.contains(document.activeElement);
      if (event.shiftKey && (!inside || document.activeElement === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || document.activeElement === last)) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    lockScroll(true);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  return (
    <div className={cx("fixed inset-0 z-60", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open} inert={!open}>
      <div className={cx("absolute inset-0 bg-ink/50 backdrop-blur-sm", open ? cx("opacity-100", ENTER) : cx("opacity-0", LEAVE))} onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lets-talk-h"
        data-lenis-prevent
        className={cx(
          "absolute top-3 right-3 bottom-3 flex w-[440px] flex-col gap-8 overflow-y-auto overscroll-contain rounded-2xl border border-[#e8e4df] bg-paper p-8 shadow-hover",
          // Closed, it waits far enough past the edge that its shadow does not tint the page.
          open ? cx("translate-x-0", ENTER) : cx("translate-x-[calc(100%+60px)]", LEAVE),
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 id="lets-talk-h" className="font-serif text-[40px]/[1.1] font-medium tracking-[-0.01em] text-ink">
              Let&rsquo;s <em className="text-burnt italic">talk</em>
            </h2>
            <p className="text-[16px]/[1.5] text-clay">We&rsquo;re here to help you anytime, any way</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink/15 text-ink [transition:background-color_var(--dur-fast)_var(--ease-out),border-color_var(--dur-fast)_var(--ease-out)] hover:border-ink/30 hover:bg-cream"
          >
            <Icon name="plus" className="size-3.5 rotate-45" />
          </button>
        </div>
        <ul className="flex flex-col gap-3">
          {OPTIONS.map((option) => (
            <li key={option.title}>
              <a
                href={option.href}
                onClick={option.href.startsWith("#") ? onClose : undefined}
                className={cx("flex flex-col gap-1.5 rounded-xl border border-[#e8e4df] bg-white p-5", CARD_LINK)}
              >
                <span className="font-serif text-[22px]/[1.25] font-medium text-ink">{option.title}</span>
                <span className="text-[15px]/[1.5] text-clay">{option.text}</span>
                <span className="mt-2 inline-flex items-center gap-2 text-[15px]/[22px] font-bold text-burnt">
                  {option.action}
                  <Medallion tone="burnt" size={26} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
