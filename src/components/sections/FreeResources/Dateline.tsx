"use client";

import { useEffect, useState } from "react";
import { masthead } from "@/data/study-materials";

const NUMERALS: Array<[number, string]> = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function roman(n: number): string {
  let out = "";
  for (const [value, numeral] of NUMERALS) {
    while (n >= value) {
      out += numeral;
      n -= value;
    }
  }
  return out;
}

/** The edition for a day: the volume (years since the first, 1976), the issue (the day of the year) and the date. */
function edition(day: Date) {
  const startOfYear = Date.UTC(day.getFullYear(), 0, 1);
  const today = Date.UTC(day.getFullYear(), day.getMonth(), day.getDate());
  return {
    volume: roman(Math.max(1, day.getFullYear() - masthead.founded)),
    issue: Math.round((today - startOfYear) / 86_400_000) + 1,
    // Set by hand rather than by the locale, so the server and the browser print it alike.
    date: `${WEEKDAYS[day.getDay()]}, ${day.getDate()} ${MONTHS[day.getMonth()]} ${day.getFullYear()}`,
  };
}

type DatelineProps = {
  /** The part of the dateline to show: the volume and issue, or the date. */
  part: "volume" | "date";
  className?: string;
};

/**
 * One part of the front page's dateline, for the reader's own day. The static export draws it for a fixed
 * day (PRINTED); once the page runs it moves to today, so the paper always reads as today's edition.
 */
export default function Dateline({ part, className }: DatelineProps) {
  const [day, setDay] = useState<Date | null>(null);
  useEffect(() => setDay(new Date()), []);
  // Until then, the fixed day: the same on the server and in the first client render.
  const { volume, issue, date } = edition(day ?? PRINTED);
  return (
    <span className={className}>
      {part === "volume" ? `Vol. ${volume} · No. ${issue}` : date}
    </span>
  );
}

/** The day the static page is drawn for, before the browser knows today (local midnight, so its date holds). */
const PRINTED = new Date(2026, 10, 10);
