import type { PointerEvent } from "react";

/**
 * The press ripple every pressable control on the page shares (the buttons, ui/Cta, and the carousel
 * arrows, ui/CarouselControls), after Material's ripple: a disc grows out from the point pressed and fades
 * (globals.css, .press-ripple), and a wave of two rings pulses out past the control's edge, the second a
 * beat behind (.press-pulse, .press-pulse-late). The buttons tint it bright orange (--ripple, --press-ring). The disc goes
 * into the control's `[data-ripple]` layer, which clips it to the shape; the ring goes on the control itself.
 * Both remove themselves when they end. Reduced motion: globals.css hides them.
 *
 * Options: `rings: false` keeps it all inside the control (the buttons, ui/Cta: no rings past the edge);
 * `soft: true` is the gentler disc the buttons spread from where the pointer comes in on hover.
 */
export function pressRipple(event: PointerEvent<HTMLElement>, { rings = true, soft = false }: { rings?: boolean; soft?: boolean } = {}) {
  if (!soft && event.button !== 0) return;
  const target = event.currentTarget;
  const box = target.getBoundingClientRect();
  // The page may be zoomed down (the canvas fit): measure in the control's own px.
  const scale = box.width / target.offsetWidth || 1;
  const x = (event.clientX - box.left) / scale;
  const y = (event.clientY - box.top) / scale;
  const reach = Math.hypot(Math.max(x, target.offsetWidth - x), Math.max(y, target.offsetHeight - y)) * 2;

  const disc = document.createElement("span");
  disc.className = soft ? "press-ripple press-ripple-soft" : "press-ripple";
  Object.assign(disc.style, { left: `${x}px`, top: `${y}px`, width: `${reach}px`, height: `${reach}px` });
  // The wave: two rings running out past the edge, the second a beat behind the first.
  const ring = document.createElement("span");
  ring.className = "press-pulse";
  const echo = document.createElement("span");
  echo.className = "press-pulse press-pulse-late";
  for (const el of [disc, ring, echo]) {
    el.setAttribute("aria-hidden", "true");
    el.addEventListener("animationend", () => el.remove(), { once: true });
  }
  (target.querySelector("[data-ripple]") ?? target).append(disc);
  if (rings) target.append(ring, echo);
}
