"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";


type CrossFadeProps = {
  /** Changes when the content changes, e.g. the selected tab's id. */
  id: string;
  children: ReactNode;
  className?: string;
  /** A slight sideways move with the fade, as the newspaper's page turn (old out to the left, new in from the right). */
  shift?: number;
  /** Entry time in ms: 200 for tab content, 320 (--dur-base) for the page turn. The exit is 70% of it. */
  duration?: number;
};

/**
 * Cross-fades its content when `id` changes (the tabs' "content below cross-fades 200ms"): the old content
 * fades out, then the new fades in. With `shift`, the old also moves that many px left and the new
 * arrives from as far right. With reduced motion the content just changes.
 */
export default function CrossFade({ id, children, className, shift = 0, duration = 200 }: CrossFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shownId, setShownId] = useState(id);
  // What is on screen for `shownId`; held while the old content fades out.
  const shownChildren = useRef(children);
  if (id === shownId) shownChildren.current = children;

  useEffect(() => {
    if (id === shownId) return;
    const el = ref.current;
    if (!el || prefersReducedMotion()) {
      setShownId(id);
      return;
    }
    const out = el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: `translateX(${-shift}px)` }], {
      duration: duration * 0.7,
      easing: "cubic-bezier(0.4, 0, 1, 1)",
      fill: "forwards",
    });
    out.onfinish = () => setShownId(id);
    return () => out.cancel();
  }, [id, shownId, shift, duration]);

  // The new content arrives.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    el.getAnimations().forEach((animation) => animation.cancel());
    el.animate([{ opacity: 0, transform: `translateX(${shift}px)` }, { opacity: 1, transform: "none" }], {
      duration,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
  }, [shownId, shift, duration]);

  return (
    <div ref={ref} className={cx(className)}>
      {shownChildren.current}
    </div>
  );
}
