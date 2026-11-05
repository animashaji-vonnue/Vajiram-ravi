"use client";

import { createElement, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/*
 * Photo parallax inside a fixed frame (after Skiper UI's "Parallax Image"): as the frame crosses the
 * viewport, the image inside it slides on the Y axis by speed% of the frame's height each way, by default
 * from −speed% to +speed% so it lags a little behind the page and reads as deeper than its frame. It is
 * scaled up just enough (1 + 2 × speed%) that its edges never show inside the frame. The frame keeps its
 * size and place; only the layer inside it moves.
 *
 * It runs on a scroll-driven Web Animation (a ViewTimeline on the frame), so there is no scroll handler and
 * the transform stays on the compositor. Where ViewTimeline is missing, on touch screens and with reduced
 * motion, the image stays still, as drawn.
 */

type ViewTimelineConstructor = new (options: { subject: Element; axis?: "block" | "inline" }) => AnimationTimeline;

/** The ViewTimeline constructor, where the browser has one. */
export function getViewTimeline(): ViewTimelineConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { ViewTimeline?: ViewTimelineConstructor }).ViewTimeline;
}

/** Whether scroll-linked photo parallax may run here: ViewTimeline, motion allowed, not a touch screen. */
export function canParallax(): boolean {
  return !!getViewTimeline() && !prefersReducedMotion() && !window.matchMedia("(pointer: coarse)").matches;
}

export type ParallaxOptions = {
  /** How far the image travels each way, as a percentage of the frame's height: 4 to 5 is gentle. */
  speed?: number;
  /** "slower" (default): the image lags behind the page, so it sits deeper. "faster": it runs ahead. */
  direction?: "slower" | "faster";
  /** The overflow-clipped frame whose passage drives the motion; the layer's parent by default. */
  frame?: Element | null;
  /** Where on the frame's view timeline the motion starts and ends; the frame's whole passage by default. */
  rangeStart?: string;
  rangeEnd?: string;
};

/**
 * Starts the parallax on `layer`, an element that fills its frame (e.g. `absolute inset-0`), and returns a
 * function that stops it. The layer's transform is the animation's: put any hover zoom on an element inside
 * it (or on the `scale` property, which composes with `transform`).
 */
export function parallax(
  layer: HTMLElement,
  { speed = 5, direction = "slower", frame = layer.parentElement, rangeStart = "cover 0%", rangeEnd = "cover 100%" }: ParallaxOptions = {},
): () => void {
  const Timeline = getViewTimeline();
  if (!frame || !Timeline || !canParallax()) return () => {};
  // Translating by a share of the layer's own height keeps the motion independent of the frame's size and
  // of the canvas zoom. The extra 1% covers sub-pixel rounding at the extremes.
  const scale = 1 + (2 * speed) / 100 + 0.01;
  const from = direction === "slower" ? -speed : speed;
  let animation: Animation | undefined;
  try {
    const timeline = new Timeline({ subject: frame, axis: "block" });
    animation = layer.animate(
      [{ transform: `translateY(${from}%) scale(${scale})` }, { transform: `translateY(${-from}%) scale(${scale})` }],
      { timeline, rangeStart, rangeEnd, fill: "both", easing: "linear" } as KeyframeAnimationOptions,
    );
  } catch {
    // A browser with ViewTimeline but without these options: the image stays still.
    animation?.cancel();
    animation = undefined;
  }
  return () => animation?.cancel();
}

/** Runs `parallax` on the element in `ref` while the component is mounted (and `enabled`). */
export function useParallax(ref: RefObject<HTMLElement | null>, { enabled = true, speed, rangeStart, rangeEnd }: Omit<ParallaxOptions, "frame"> & { enabled?: boolean } = {}) {
  useEffect(() => {
    const layer = ref.current;
    if (!layer || !enabled) return;
    return parallax(layer, { speed, rangeStart, rangeEnd });
  }, [ref, enabled, speed, rangeStart, rangeEnd]);
}

type ParallaxLayerProps = {
  className?: string;
  /** See ParallaxOptions.speed. */
  speed?: number;
  /** False for copies that are only laid out (e.g. an invisible edition holding a sheet's height). */
  enabled?: boolean;
  children?: ReactNode;
};

/**
 * A layer that moves with `parallax` inside its parent, which is the frame: give it the frame's box (e.g.
 * `absolute inset-0`) and put the image inside it. Usable from server components.
 */
export function ParallaxLayer({ className, speed, enabled = true, children }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref, { speed, enabled });
  return createElement("div", { ref, className }, children);
}
