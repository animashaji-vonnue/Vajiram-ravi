"use client";

import { ArrowRight } from "iconoir-react";
import type { PointerEvent, ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { cx } from "@/lib/cx";

/**
 * The ripple hover: when the pointer comes onto a button, a single soft ripple spreads out across it from where it
 * came in, and the button pops up a touch (`.group/button:hover` in globals.css). The button keeps its colour; the ripples are drawn in `--ripple`
 * (set per tone) and clipped to its shape. Put `<Ripples />` first inside a `group/button` element that is
 * `relative overflow-clip`, wrap its label in `relative`, and call `ripple` on pointer enter. The styles are
 * `.ripples` in globals.css. Nothing ripples or pops when motion is reduced.
 */
export function Ripples() {
  return <span aria-hidden="true" className="ripples" />;
}

export function ripple(event: PointerEvent<HTMLElement>) {
  const button = event.currentTarget;
  const layer = button.querySelector<HTMLElement>(":scope > .ripples");
  if (!layer || prefersReducedMotion()) return;

  const box = button.getBoundingClientRect();
  // Scale from screen pixels to the button's own (the page is zoomed to fit the canvas).
  const scale = button.offsetWidth / box.width;
  const x = (event.clientX - box.left) * scale;
  const y = (event.clientY - box.top) * scale;
  // One ripple, big enough to reach the farthest corner.
  const size = 2 * Math.hypot(Math.max(x, button.offsetWidth - x), Math.max(y, button.offsetHeight - y));
  const wave = document.createElement("span");
  wave.className = "ripple";
  wave.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px`;
  wave.addEventListener("animationend", (event) => event.animationName === "ripple-fade" && wave.remove());
  layer.append(wave);
}

/**
 * The site's buttons: rounded pills, after mastersunion.org's.
 * - saffron: the institute's colour, for the main action in a section.
 * - light: white, for the main action on ink.
 * - ghost-light: an outline on ink. ghost-dark: an outline on paper or white.
 * An arrow follows the label and nudges right on hover, and the pointer coming on sends ripples across it.
 */
export type ButtonTone = "saffron" | "light" | "ghost-light" | "ghost-dark";

const TONE: Record<ButtonTone, string> = {
  saffron: "bg-saffron-500 text-white [--ripple:255_255_255]",
  light: "bg-white text-ink-900 [--ripple:255_87_0]",
  "ghost-light": "border border-white/35 text-white hover:border-white/70 [--ripple:255_255_255]",
  "ghost-dark": "border border-ink-900/25 text-ink-900 hover:border-ink-900/50 [--ripple:255_87_0]",
};

const SIZE = {
  md: "h-11 gap-2 px-5 text-[15px]",
  lg: "h-14 gap-2.5 px-7 text-[16px]",
};

export function Button({
  href,
  children,
  tone = "saffron",
  size = "lg",
  arrow = true,
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: ButtonTone;
  size?: keyof typeof SIZE;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      onPointerEnter={ripple}
      className={cx(
        "group/button relative inline-flex shrink-0 items-center justify-center overflow-clip rounded-full font-semibold whitespace-nowrap",
        SIZE[size],
        TONE[tone],
        className,
      )}
    >
      <Ripples />
      <span className="relative flex items-center gap-[inherit]">
        {children}
        {arrow && (
          <ArrowRight
            width={18}
            height={18}
            strokeWidth={1.8}
            className="transition-transform duration-300 ease-out-soft group-hover/button:translate-x-1"
          />
        )}
      </span>
    </a>
  );
}
