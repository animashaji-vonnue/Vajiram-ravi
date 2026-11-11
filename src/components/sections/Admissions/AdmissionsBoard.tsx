"use client";

import { useEffect, useMemo, useState } from "react";
import Cta from "@/components/ui/Cta";
import TraditionalTabs, { type TabItem } from "@/components/ui/TraditionalTabs";
import { batchesCopy, batchFilters, todayIso, upcomingBatches, type BatchFilter } from "@/data/admissions";
import { links } from "@/data/links";
import BatchTrack from "./BatchTrack";

/** The batches the track can show: the featured one is on its own ticket above (FeaturedBatch). */
const trackBatches = (today: string) => upcomingBatches(today).filter((batch) => !batch.featured);

/** Each batch's place among the track's batches in date order: it picks the ticket's head colour, so a ticket keeps it. */
const TONE_INDEX = new Map(trackBatches("").map((batch, i) => [batch.id, i]));
const toneOf = (id: string) => TONE_INDEX.get(id) ?? 0;

/**
 * The batches under the heading: the mode tabs (All / Classroom / LIVE-Online), the ticket track with its
 * arrows at either side, then "View all upcoming batches". (The month tabs were taken out at the client's
 * request.) The featured batch is left out: the wide ticket above already shows it.
 * Batches that have started are hidden. "Today" is read on the client, so the server render lists them all.
 */
export default function AdmissionsBoard() {
  const [mode, setMode] = useState<BatchFilter>("All");
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => setToday(todayIso()), []);

  // Before today is known every batch counts as upcoming.
  const upcoming = useMemo(() => trackBatches(today ?? ""), [today]);
  const inMode = upcoming.filter((batch) => mode === "All" || batch.modes.includes(mode));
  const modeTabs: TabItem[] = batchFilters.map((filter) => ({ id: filter, label: filter }));

  return (
    <>
      <div data-reveal className="relative flex w-full items-center">
        <TraditionalTabs tabs={modeTabs} value={mode} onChange={(id) => setMode(id as BatchFilter)} label="Batch mode" idPrefix="batch-mode" />
      </div>

      <div id="batch-mode-panel" role="tabpanel" aria-labelledby={`batch-mode-tab-${mode}`} className="relative w-full">
        <BatchTrack batches={upcoming} shownIds={inMode.map((batch) => batch.id)} toneOf={toneOf} />
      </div>

      {/* It fades in out of a soft blur as it comes into view (ui/TextMotion, data-fade). */}
      <div data-fade className="relative flex w-full justify-end">
        <Cta variant="secondary" size="md" href={links.upcomingBatches}>
          {batchesCopy.viewAll}
        </Cta>
      </div>
    </>
  );
}
