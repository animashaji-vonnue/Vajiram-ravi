"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "@/components/ui/CountUp";
import { whenEntering } from "./enter";

/**
 * An achievement's figure ("AIR 1", "36/50"). It is the plain figure until its achievement starts to rise
 * in with the hero's load sequence (see ./enter, `whenEntering`), and then it rolls into place with
 * ui/CountUp: only the number turns ("AIR 1" rolls its 1, "36/50" its 36), a full turn and on to the
 * digit, 1.2s, columns 60ms apart. The hero is on screen at load, so CountUp starts at once on mounting;
 * mounting it with the rise (rather than at hydration) keeps the roll from playing out under the intro
 * curtain. If the rise has already played when the script arrives, or with reduced motion, the figure
 * simply stays as it is.
 */
export default function HeroFigure({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [roll, setRoll] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return whenEntering(el, () => setRoll(true));
  }, []);

  if (roll) return <CountUp value={value} />;
  return <span ref={ref}>{value}</span>;
}
