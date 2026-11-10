"use client";

import { useMemo, useState } from "react";
import { ArrowRight, MapPin, NavArrowDown } from "iconoir-react";
import { batches, type Batch, type BatchStatus } from "@/data/content";
import SectionIntro from "@/components/ui/SectionIntro";
import { cx } from "@/lib/cx";

const STATUS: Record<BatchStatus, { label: string; tone: string }> = {
  open: { label: "Admissions open", tone: "bg-open-soft text-open" },
  upcoming: { label: "Upcoming", tone: "bg-upcoming-soft text-upcoming" },
  closed: { label: "Admissions closed", tone: "bg-ink-900/[0.06] text-muted" },
};

const ALL = "All";

/** A filter as a native select, dressed as a pill, so it works with every keyboard and screen reader. */
function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative flex h-12 items-center gap-2 rounded-full border border-ink-900/15 bg-white pr-11 pl-5 text-[15px] transition-colors focus-within:border-ink-900 hover:border-ink-900/40">
      <span className="text-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="cursor-pointer appearance-none bg-transparent font-semibold text-ink-900 outline-none"
      >
        {[ALL, ...options].map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <NavArrowDown width={16} height={16} className="pointer-events-none absolute right-4 text-ink-900" />
    </label>
  );
}

/** "14 Oct 2026" as its day, short month and year. */
function splitDate(date: string) {
  const [day, month, year] = date.split(" ");
  return { day, month, year };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "14 Oct 2026" as a number that sorts by date, read by hand since browsers parse this format differently. */
function startTime(date: string) {
  const { day, month, year } = splitDate(date);
  return new Date(Number(year), MONTHS.indexOf(month), Number(day)).getTime();
}

/** Every batch, earliest first. */
const BY_DATE = [...batches.list].sort((a, b) => startTime(a.start) - startTime(b.start));

/**
 * Upcoming batches, on paper: the intro, three filters (programme, learning mode, starting month) and the schedule,
 * grouped by month like a calendar. Each batch is a row with its start date set large, the programme, how and where
 * it is taught, its duration, its admission status and a button; pointing at a row lifts it and reveals a line of
 * further detail. The dates are a placeholder schedule, labelled as such, until verified ones are connected.
 */
export default function Batches() {
  const [programme, setProgramme] = useState(ALL);
  const [mode, setMode] = useState(ALL);
  const [month, setMonth] = useState(ALL);

  const options = useMemo(
    () => ({
      programmes: [...new Set(batches.list.map((b) => b.category))],
      modes: [...new Set(batches.list.map((b) => b.mode))],
      months: [...new Set(BY_DATE.map((b) => b.month))],
    }),
    [],
  );

  const shown = BY_DATE.filter((b) => programme === ALL || b.category === programme)
    .filter((b) => mode === ALL || b.mode === mode)
    .filter((b) => month === ALL || b.month === month);

  // The shown batches, grouped by the month they start in.
  const byMonth = shown.reduce<Record<string, Batch[]>>((groups, b) => {
    const key = `${b.month} ${splitDate(b.start).year}`;
    (groups[key] ??= []).push(b);
    return groups;
  }, {});

  return (
    <section id="batches" aria-labelledby="batches-title" className="scroll-mt-[76px] bg-paper py-32">
      <div className="mx-auto w-canvas px-12">
        <SectionIntro
          id="batches-title"
          eyebrow={batches.eyebrow}
          headline={batches.headline}
          description={batches.description}
          statement={batches.statement}
        />

        <div className="mt-16 flex items-center justify-between">
          <div className="flex gap-3">
            <Filter label="Programme" value={programme} options={options.programmes} onChange={setProgramme} />
            <Filter label="Learning mode" value={mode} options={options.modes} onChange={setMode} />
            <Filter label="Starting month" value={month} options={options.months} onChange={setMonth} />
          </div>
          {batches.placeholder && (
            <p className="rounded-full border border-dashed border-ink-900/25 px-4 py-2 text-[13px] text-muted">
              Sample schedule: dates to be confirmed by admissions
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-12">
          {Object.entries(byMonth).map(([monthLabel, list]) => (
            <div key={monthLabel} className="grid grid-cols-[220px_1fr] gap-8">
              <h3 className="pt-5 font-serif text-[40px]/[1] text-ink-900">{monthLabel.split(" ")[0]}</h3>
              <ul className="flex flex-col gap-3">
                {list.map((b) => {
                  const date = splitDate(b.start);
                  const status = STATUS[b.status];
                  return (
                    <li
                      key={`${b.programme}-${b.mode}-${b.start}`}
                      className="group grid grid-cols-[96px_1fr_auto] items-center gap-8 rounded-[22px] border border-transparent bg-white px-6 py-5 shadow-[0_1px_0_rgb(20_27_42/0.06)] transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:border-ink-900/10 hover:shadow-[0_20px_40px_-28px_rgb(20_27_42/0.45)]"
                    >
                      <p className="flex flex-col items-center justify-center rounded-[16px] bg-paper py-3 text-center">
                        <span className="font-serif text-[44px]/[1] text-ink-900">{date.day}</span>
                        <span className="mt-1 text-[13px] font-semibold tracking-[0.14em] text-muted uppercase">
                          {date.month}
                        </span>
                      </p>
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="text-[20px]/[26px] font-semibold text-ink-900">{b.programme}</p>
                          <span className={cx("rounded-full px-3 py-1 text-[12px]/[16px] font-semibold", status.tone)}>
                            {status.label}
                          </span>
                        </div>
                        <p className="mt-1.5 flex items-center gap-x-4 text-[15px]/[22px] text-muted">
                          <span>{b.mode}</span>
                          {b.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin width={15} height={15} />
                              {b.location}
                            </span>
                          )}
                          <span>Duration {b.duration}</span>
                        </p>
                        {/* Further detail, revealed when the row is pointed at or focused. */}
                        <p className="grid grid-rows-[0fr] text-[14px]/[20px] text-muted transition-[grid-template-rows] duration-300 group-focus-within:grid-rows-[1fr] group-hover:grid-rows-[1fr]">
                          <span className="overflow-hidden">
                            <span className="block pt-2">{b.details}</span>
                          </span>
                        </p>
                      </div>
                      {b.status === "closed" ? (
                        <span className="text-[15px] font-semibold text-faint">Admissions closed</span>
                      ) : (
                        <a
                          href={b.href}
                          className="group/cta inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-semibold text-white ember-pill transition-[filter] hover:brightness-110"
                        >
                          {b.status === "open" ? "Enrol now" : "Explore batch"}
                          <ArrowRight
                            width={18}
                            height={18}
                            strokeWidth={1.8}
                            className="transition-transform group-hover/cta:translate-x-1"
                          />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {shown.length === 0 && (
            <p className="rounded-[22px] bg-white px-8 py-10 text-center text-[17px] text-muted">
              No batches match these filters. Try another month or{" "}
              <a href="#counselling" className="font-semibold text-saffron-600 underline-offset-4 hover:underline">
                ask a counsellor
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
