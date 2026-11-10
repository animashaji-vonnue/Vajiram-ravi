import type { PointerEvent } from "react";

/**
 * The press ripple every pressable control on the page shares (the buttons, ui/Cta, and the carousel
 * arrows, ui/CarouselControls), after Material's ripple: a disc grows out from the point pressed and fades
 * (globals.css, .press-ripple), and a ring pulses out past the control's edge (.press-pulse). The disc goes
 * into the control's `[data-ripple]` layer, which clips it to the shape; the ring goes on the control itself.
 * Both remove themselves when they end. Reduced motion: globals.css hides them.
 */
export function pressRipple(event: PointerEvent<HTMLElement>) {
  if (event.button !== 0) return;
  const target = event.currentTarget;
  const box = target.getBoundingClientRect();
  // The page may be zoomed down (the canvas fit): measure in the control's own px.
  const scale = box.width / target.offsetWidth || 1;
  const x = (event.clientX - box.left) / scale;
  const y = (event.clientY - box.top) / scale;
  const reach = Math.hypot(Math.max(x, target.offsetWidth - x), Math.max(y, target.offsetHeight - y)) * 2;

  const disc = document.createElement("span");
  disc.className = "press-ripple";
  Object.assign(disc.style, { left: `${x}px`, top: `${y}px`, width: `${reach}px`, height: `${reach}px` });
  const ring = document.createElement("span");
  ring.className = "press-pulse";
  for (const el of [disc, ring]) {
    el.setAttribute("aria-hidden", "true");
    el.addEventListener("animationend", () => el.remove(), { once: true });
  }
  (target.querySelector("[data-ripple]") ?? target).append(disc);
  target.append(ring);
}
