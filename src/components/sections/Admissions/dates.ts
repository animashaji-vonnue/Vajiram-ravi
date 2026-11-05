const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The parts of a YYYY-MM-DD date, with the month's short name: "2026-11-27" gives 2026, "Nov", 27. */
export function dateParts(iso: string): { year: number; month: string; day: number } {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: MONTHS[month - 1], day };
}
