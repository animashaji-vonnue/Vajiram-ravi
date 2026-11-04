import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GraduationCapIcon, NotebookIcon, OpenBookIcon } from "@/components/icons";
import { Counter, Parallax, Reveal, SmoothScroll, Stagger, StaggerItem, TiltCard } from "@/components/recitals/Motion";
import {
  DandaMark,
  DiamondMark,
  Eyebrow,
  FlowerMark,
  grainStyle,
  patternStyle,
  Rule,
  SeamBand,
  type SeamVariant,
} from "@/components/recitals/Ornaments";
import {
  CollectionCard,
  GhostButton,
  IssueCard,
  MetaLine,
  NumberedRow,
  QuietLink,
  SearchField,
  SelectField,
  SolidButton,
  StampBadge,
  StatCard,
  StepCard,
  YearChip,
} from "@/components/recitals/Parts";
import { issues } from "@/data/magazine";

export const metadata: Metadata = {
  title: "The Recitals — styles kit",
  description: "Palette, type, ornaments, seams, cards and motion for the Recitals page.",
};

const PALETTE = {
  Grounds: [
    ["paper", "#fffcf6", "The page itself"],
    ["cream", "#fff3e0", "Raised panels"],
    ["sand", "#ffe5b4", "Peach. Quiet bands, image wells"],
    ["melon", "#fdbcb4", "Melon. Soft highlight panels"],
  ],
  Ink: [
    ["ink", "#2b1710", "Headings and body"],
    ["ink-700", "#5e4336", "Secondary copy"],
    ["ink-500", "#8c7264", "Metadata"],
  ],
  "The two mains, off the logo": [
    ["orange", "#f58025", "The wordmark orange"],
    ["terracotta", "#e2725b", "The soft red"],
    ["vermilion", "#e34234", "The strong red, for marks not text"],
  ],
  "Warm neighbours": [
    ["amber", "#ffbf00", "Ornament and highlights"],
    ["saffron", "#f4c430", "Gold notes"],
    ["gamboge", "#e49b0f", "Mid warm"],
  ],
  "Deep tones": [
    ["rust", "#a8341a", "Links and buttons — darkened so text passes contrast"],
    ["burnt", "#cc5500", "Strong accent"],
    ["copper", "#b87333", "Muted accent"],
    ["oxblood", "#5e1b10", "The one dark band"],
  ],
};

const SEAMS: { variant: SeamVariant; name: string; note: string; from: string; to: string }[] = [
  { variant: "toran", name: "Toran", note: "Garland over a doorway. Opens a warm section.", from: "#ffe5b4", to: "#fffcf6" },
  { variant: "perf", name: "Perforation", note: "Stamp edge. Use where the archive meets the page.", from: "#fdbcb4", to: "#fff3e0" },
  { variant: "jali", name: "Jali", note: "Lattice standing on the next section, open at the foot.", from: "#fffcf6", to: "#5e1b10" },
  { variant: "border", name: "Block border", note: "Sari border. Closes a section into the dark band.", from: "#5e1b10", to: "#2b1710" },
];

/** The dark seam rows need light text on them. */
const DARK_SEAM = "#5e1b10";

function Panel({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-7 border-t border-r-line pt-10">
      <div className="flex flex-col gap-2">
        <Eyebrow>{title}</Eyebrow>
        {note && <p className="max-w-[620px] font-sans text-[15px]/[23px] font-medium text-r-ink-700">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export default function KitPage() {
  const sample = issues.slice(0, 4);

  return (
    <main data-kit className="relative min-h-screen bg-r-paper text-r-ink">
      <SmoothScroll />
      <div className="pointer-events-none fixed inset-0 z-0" style={grainStyle} aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-[1180px] flex-col gap-16 px-10 py-16">
        {/* Masthead ------------------------------------------------------------------ */}
        <header className="flex flex-col gap-5">
          <Eyebrow>The Recitals · styles kit</Eyebrow>
          <h1 className="font-r-display font-extrabold text-[72px]/[78px] text-r-ink">
            A kit for a page that is <span className="text-r-rust">full but calm</span>
          </h1>
          <p className="max-w-[680px] font-sans text-[17px]/[27px] font-medium text-r-ink-700">
            Everything the Recitals page is built from, on one screen. The palette below is the set already in the Figma
            file. Replace those nine hex values in one file and the whole page follows.
          </p>
          <div className="flex items-center gap-3">
            <StampBadge>Provisional palette</StampBadge>
            <MetaLine items={["Martel + Figtree", "Motion + Lenis"]} />
          </div>
          <Rule className="pt-2" />
        </header>

        {/* Palette ------------------------------------------------------------------- */}
        <Panel
          title="Palette"
          note="Everything is warm — no cool opposites, as you asked. What stops an all-warm page turning to mush is value: near-white grounds, mid accents, and one genuinely dark band. The rule that keeps density calm is that no patterned area uses more than two hues."
        >
          <div className="flex flex-col gap-8">
            {Object.entries(PALETTE).map(([group, rows]) => (
              <div key={group} className="flex flex-col gap-3">
                <h3 className="font-sans text-[13px]/[18px] font-semibold tracking-[.14em] text-r-ink-500 uppercase">{group}</h3>
                <div className="flex flex-wrap gap-3">
                  {rows.map(([name, hex, role]) => (
                    <div key={name} className="flex w-[216px] flex-col gap-2">
                      <span className="h-20 w-full shadow-[inset_0_0_0_1px_rgba(26,26,26,.1)]" style={{ background: hex }} />
                      <div className="flex flex-col gap-0.5">
                        <p className="font-sans text-[14px]/[20px] font-semibold text-r-ink">
                          {name} <span className="font-normal text-r-ink-500 uppercase">{hex}</span>
                        </p>
                        <p className="font-sans text-[13px]/[18px] font-medium text-r-ink-500">{role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Type ---------------------------------------------------------------------- */}
        <Panel
          title="Type"
          note="Martel, from Indian Type Foundry, drawn with a Devanagari companion. It carries an Indian voice without becoming decoration: it is a plain text serif, so a long archive page stays comfortable to read. Figtree stays for body copy, because it is already the V&R site font and it is excellent on screen."
        >
          <div className="grid grid-cols-3 gap-6">
            {[
              { weight: "font-normal", name: "Martel Regular", note: "Card titles, long headings." },
              { weight: "font-bold", name: "Martel Bold", note: "Section headings." },
              { weight: "font-extrabold", name: "Martel Extrabold", note: "The masthead and big numerals." },
            ].map((face) => (
              <div key={face.name} className="flex flex-col gap-4 bg-r-cream p-7 shadow-[inset_0_0_0_1px_var(--color-r-line)]">
                <div className="flex items-baseline justify-between">
                  <p className="font-sans text-[13px]/[18px] font-semibold tracking-[.14em] text-r-rust uppercase">{face.name}</p>
                  <DiamondMark size={6} className="text-r-amber" />
                </div>
                <p className={`font-r-display ${face.weight} text-[46px]/[52px] text-r-ink`}>The Recitals</p>
                <p className="font-sans text-[13px]/[19px] font-medium text-r-ink-500">{face.note}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-5 pt-2">
            {[
              ["Masthead 72 / Martel Extrabold", "font-r-display font-extrabold text-[72px]/[78px]"],
              ["Section heading 40 / Martel Bold", "font-r-editorial font-bold text-[40px]/[48px]"],
              ["Card title 20 / Martel Regular", "font-r-editorial text-[20px]/[28px]"],
            ].map(([label, cls]) => (
              <div key={label} className="flex items-baseline gap-8 border-b border-r-line pb-4">
                <span className="w-[230px] shrink-0 font-sans text-[13px]/[18px] font-medium text-r-ink-500">{label}</span>
                <span className={`${cls} text-r-ink`}>What&rsquo;s inside an issue</span>
              </div>
            ))}
            <div className="flex items-start gap-8">
              <span className="w-[230px] shrink-0 font-sans text-[13px]/[18px] font-medium text-r-ink-500">Body 16 / Figtree</span>
              <p className="max-w-[560px] font-sans text-[16px]/[26px] font-medium text-r-ink-700">
                Five fixed sections, in the same order every month. Each one maps to a stage of the exam, so a year of
                issues reads as one course rather than twelve separate files.
              </p>
            </div>
          </div>
        </Panel>

        {/* Ornaments ----------------------------------------------------------------- */}
        <Panel
          title="Ornaments and rules"
          note="The small marks that replace plain divider lines. A rule with nothing in it reads as generated; a rule broken by a mark reads as set."
        >
          <div className="flex flex-wrap items-center gap-10">
            {[
              { el: <FlowerMark size={28} className="text-r-orange" />, name: "Flower" },
              { el: <DiamondMark size={20} className="text-r-amber" />, name: "Lozenge" },
              { el: <DandaMark size={28} className="text-r-rust" />, name: "Danda" },
            ].map((mark) => (
              <div key={mark.name} className="flex flex-col items-center gap-2">
                {mark.el}
                <span className="font-sans text-[13px]/[18px] font-medium text-r-ink-500">{mark.name}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-8 pt-2">
            <Rule />
            <Rule tone="accent" />
          </div>
        </Panel>

        {/* Patterns ------------------------------------------------------------------ */}
        <Panel
          title="Surface patterns"
          note="One motif per section, repeated. Forty repeats of one shape reads as rhythm; forty different shapes read as noise. These sit under content at low opacity, never over it."
        >
          <div className="grid grid-cols-3 gap-5">
            {(["jali", "block", "chevron"] as const).map((name) => (
              <div key={name} className="flex flex-col gap-2">
                <div className="relative h-36 overflow-hidden bg-r-cream shadow-[inset_0_0_0_1px_var(--color-r-line)]">
                  <div className="absolute inset-0" style={patternStyle(name, "#a8341a", 0.16)} />
                </div>
                <p className="font-sans text-[14px]/[20px] font-semibold text-r-ink capitalize">{name}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Seams ----------------------------------------------------------------------- */}
      <section className="relative z-10 flex flex-col gap-0 pt-6">
        <div className="mx-auto w-full max-w-[1180px] px-10 pb-8">
          <Eyebrow>Section seams</Eyebrow>
          <p className="max-w-[620px] pt-2 font-sans text-[15px]/[23px] font-medium text-r-ink-700">
            The join between two sections. The colour above dissolves into the colour below through a motif, so the page
            reads as one continuous object rather than a stack of bands. Four variants, one grammar.
          </p>
        </div>
        {SEAMS.map((seam) => (
          <div key={seam.variant}>
            <div className="px-10 py-6" style={{ background: seam.from }}>
              <div className="mx-auto flex max-w-[1180px] items-baseline gap-4">
                <span className="font-r-editorial text-[20px]/[26px] font-bold" style={{ color: seam.from === DARK_SEAM ? "#fff3e0" : "#2b1710" }}>
                  {seam.name}
                </span>
                <span className="font-sans text-[13px]/[19px] font-medium" style={{ color: seam.from === DARK_SEAM ? "#ffe5b4" : "#8c7264" }}>
                  {seam.note}
                </span>
              </div>
            </div>
            <SeamBand variant={seam.variant} from={seam.from} to={seam.to} />
            <div className="h-14" style={{ background: seam.to }} />
          </div>
        ))}
      </section>

      <div className="relative z-10 mx-auto flex max-w-[1180px] flex-col gap-16 px-10 py-16">
        {/* Cards --------------------------------------------------------------------- */}
        <Panel
          title="Cards"
          note="All four share one frame: a manuscript double rule on the edge, serif for titles and numerals, Figtree for sentences. The ornament lives on the border so the content stays readable."
        >
          <Stagger className="grid grid-cols-4 gap-5">
            {sample.map((issue, i) => (
              <StaggerItem key={issue.label}>
                <TiltCard>
                  <IssueCard issue={issue} latest={i === 0} />
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="grid grid-cols-4 gap-5">
            <StatCard value={<>50%+</>} label="Share of the GS syllabus current affairs touches" />
            <StatCard value={<>1 hour</>} label="To re-read a month you have already worked through" />
            <StatCard value={<>12 files</>} label="A whole year, not 300 loose notes" />
            <StatCard value={<>0 gaps</>} label="Unbroken since May 2019" />
          </div>

          <div className="grid grid-cols-3 gap-5">
            <CollectionCard title="Yojana Summary" body="Month-by-month summaries of the government's development magazine." icon={<OpenBookIcon />} />
            <CollectionCard title="Prelims Quick Revision" body="Condensed booklets built for the last six weeks before Prelims." icon={<NotebookIcon />} />
            <CollectionCard title="GS Mains Probable" body="Probable Mains questions on the year's themes, with structure hints." icon={<GraduationCapIcon />} />
          </div>

          <div className="grid grid-cols-3 gap-5">
            <StepCard index="01" when="Within a week" minutes="90 min" title="Read it through with the pen down" body="One sitting, no notes, no highlighter. You are building recognition." />
            <StepCard index="02" when="Three weeks later" minutes="45 min" title="Attempt the Prelims Q&A cold" body="Answer the MCQs without looking back at the articles." />
            <StepCard index="03" when="End of month" minutes="60 min" title="Pull the Mains notes out and file them" body="Move the answers and Extra Mile points into one page per topic." />
          </div>

          <div className="bg-r-paper px-7 shadow-[inset_0_0_0_1px_var(--color-r-line)]">
            <NumberedRow index="01" title="Feature Article" body="Two or three topics of the month taken apart in depth, with the background and the argument." />
            <NumberedRow index="02" title="Mains Q&A" body="Analytical answers to the month's contemporary questions, structured the way the paper wants them." />
            <NumberedRow index="03" title="Prelims Q&A" body="UPSC-standard multiple-choice questions with worked explanations." />
          </div>
        </Panel>

        {/* Controls ------------------------------------------------------------------ */}
        <Panel title="Controls" note="Square corners throughout. The rounded pill belongs to the homepage; this page is printed matter.">
          <div className="flex flex-wrap items-center gap-4">
            <SolidButton>Read the July issue</SolidButton>
            <GhostButton>Browse all 87 issues</GhostButton>
            <QuietLink>Open the booklets</QuietLink>
            <StampBadge>Latest</StampBadge>
            <StampBadge tone="indigo">Free</StampBadge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {["2027", "2026", "2025", "2024", "2023"].map((year, i) => (
              <YearChip key={year} active={i === 1}>
                {year}
              </YearChip>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <SearchField placeholder="Search by month or year — e.g. March 2026" />
            <SelectField label="Sort" value="Newest first" />
          </div>
        </Panel>

        {/* Motion -------------------------------------------------------------------- */}
        <Panel
          title="Motion"
          note="Scrolling is eased by Lenis, so the page glides rather than jumps. Everything below respects prefers-reduced-motion and renders its finished state when movement is turned down."
        >
          <div className="grid grid-cols-3 gap-5">
            {[
              ["Reveal", "Blocks fade and lift once, on entry."],
              ["Stagger", "Grids arrive in sequence, 70ms apart."],
              ["Parallax", "Texture and ornament drift against the scroll."],
              ["Counter", "Figures count up when they reach the reader."],
              ["Tilt", "Covers follow the pointer and spring back."],
              ["Draw", "Rules draw in from the left under headings."],
            ].map(([name, note], i) => (
              <Reveal key={name} delay={i * 0.05}>
                <div className="flex h-full flex-col gap-2 bg-r-cream p-5 shadow-[inset_0_0_0_1px_var(--color-r-line)]">
                  <p className="font-r-editorial text-[18px]/[24px] text-r-ink">{name}</p>
                  <p className="font-sans text-[14px]/[21px] font-medium text-r-ink-700">{note}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="relative overflow-hidden bg-r-oxblood px-10 py-16">
            <Parallax className="pointer-events-none absolute inset-0" distance={70}>
              <div className="h-[140%] w-full" style={patternStyle("jali", "#ffbf00", 0.14)} />
            </Parallax>
            <div className="relative flex items-end justify-between gap-10">
              <div className="flex flex-col gap-3">
                <p className="font-sans text-[13px]/[18px] font-semibold tracking-[.16em] text-r-amber uppercase">Counting figures</p>
                <p className="font-r-display font-extrabold text-[64px]/[68px] text-r-paper">
                  <Counter to={600} suffix="+" /> <span className="text-[28px] text-r-sand">Prelims MCQs a year</span>
                </p>
                <p className="font-r-display font-extrabold text-[64px]/[68px] text-r-paper">
                  <Counter to={87} /> <span className="text-[28px] text-r-sand">issues, unbroken</span>
                </p>
              </div>
              <p className="max-w-[300px] font-sans text-[14px]/[22px] font-medium text-r-sand">
                The lattice behind this panel drifts as you scroll. Texture moves, words never do.
              </p>
            </div>
          </div>
        </Panel>

        <footer className="flex items-center gap-4 border-t border-r-line pt-8 pb-4">
          <FlowerMark size={14} className="text-r-amber" />
          <p className="font-sans text-[14px]/[21px] font-medium text-r-ink-500">
            Swap the palette in <span className="text-r-ink">src/app/globals.css</span> and every specimen here
            follows.
          </p>
        </footer>
      </div>
    </main>
  );
}
