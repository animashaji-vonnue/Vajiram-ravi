"use client";

import { useEffect, useMemo, useState } from "react";
import Cta from "@/components/ui/Cta";
import TraditionalTabs, { type TabItem } from "@/components/ui/TraditionalTabs";
import { batchesCopy, batchFilters, todayIso, upcomingBatches, type BatchFilter } from "@/data/admissions";
import { links } from "@/data/links";
import BatchTrack from "./BatchTrack";
import { dateParts } from "./dates";

/** The month tab that shows every month. Other month tabs are keyed by month, e.g. "2026-11". */
const ALL_MONTHS = "all";

/** The batches the track can show: the featured one is on its own ticket above (FeaturedBatch). */
const trackBatches = (today: string) => upcomingBatches(today).filter((batch) => !batch.featured);

/** Each batch's place among the track's batches in date order: it picks the ticket's head colour, so a ticket keeps it. */
const TONE_INDEX = new Map(trackBatches("").map((batch, i) => [batch.id, i]));
const toneOf = (id: string) => TONE_INDEX.get(id) ?? 0;

/**
 * The batches under the heading: the mode tabs (All / Classroom / LIVE-Online) and the month tabs, the
 * arrows and the ticket track, then "View all upcoming batches". The two tab lists combine: the month tabs list each
 * month that has upcoming batches, and their counts follow the chosen mode. The featured batch is left out:
 * the wide ticket above already shows it.
 * Batches that have started are hidden. "Today" is read on the client, so the server render lists them all.
 */
export default function AdmissionsBoard() {
  const [mode, setMode] = useState<BatchFilter>("All");
  const [month, setMonth] = useState(ALL_MONTHS);
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => setToday(todayIso()), []);

  // Before today is known every batch counts as upcoming.
  const upcoming = useMemo(() => trackBatches(today ?? ""), [today]);
  const inMode = upcoming.filter((batch) => mode === "All" || batch.modes.includes(mode));

  const monthNames = new Map<string, string>();
  for (const batch of upcoming) {
    const { year, month: name } = dateParts(batch.startDate);
    monthNames.set(batch.startDate.slice(0, 7), `${name} ${year}`);
  }
  const activeMonth = monthNames.has(month) ? month : ALL_MONTHS;
  const inMonth = (key: string) => (key === ALL_MONTHS ? inMode : inMode.filter((batch) => batch.startDate.startsWith(key)));

  const modeTabs: TabItem[] = batchFilters.map((filter) => ({ id: filter, label: filter }));
  const monthTabs: TabItem[] = [ALL_MONTHS, ...monthNames.keys()].map((key) => ({
    id: key,
    label: monthNames.get(key) ?? "All",
  }));

  return (
    <>
      <BatchTrack
        batches={upcoming}
        shownIds={inMonth(activeMonth).map((batch) => batch.id)}
        toneOf={toneOf}
        panel={{ mode, month: activeMonth }}
        filters={
          <div className="flex items-center gap-7">
            <TraditionalTabs tabs={modeTabs} value={mode} onChange={(id) => setMode(id as BatchFilter)} label="Batch mode" idPrefix="batch-mode" />
            <span aria-hidden="true" className="h-[26px] w-px shrink-0 bg-ink/18" />
            <TraditionalTabs tabs={monthTabs} value={activeMonth} onChange={setMonth} label="Batch month" idPrefix="batch-month" />
          </div>
        }
      />

      <div data-reveal className="relative flex w-full justify-end">
        <Cta variant="secondary" size="md" href={links.upcomingBatches}>
          {batchesCopy.viewAll}
        </Cta>
      </div>
    </>
  );
}
