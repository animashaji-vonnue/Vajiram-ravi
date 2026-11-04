import { KnobButton } from "@/components/ui/Buttons";
import { portalFeatures } from "@/data/magazine";

/** The daily layer around the monthly magazine: what the Student Portal and app add. */
export default function PortalBand() {
  return (
    <section aria-labelledby="portal-h">
      <div className="relative mx-auto w-canvas px-20 py-24">
        <div
          data-reveal
          className="relative flex items-center gap-20 overflow-hidden rounded-3xl bg-brown-950 px-14 py-14 text-white"
        >
          <div
            className="pointer-events-none absolute -top-40 -right-24 size-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(229,117,18,.28),transparent)]"
            aria-hidden="true"
          />
          <div className="relative flex w-[520px] flex-none flex-col gap-8">
            <div className="flex flex-col gap-5">
              <p className="font-display text-[14px]/[21px] font-semibold text-brand-100">BEYOND THE PDF</p>
              <div className="flex flex-col gap-3">
                <h2 id="portal-h" className="font-display text-[36px]/[43px] font-semibold text-white">
                  The magazine is the monthly layer of a daily routine
                </h2>
                <p className="font-sans text-[17px]/[25px] font-medium text-neutral-300">
                  Students on the Student Portal and the mobile app get the same news as it happens, then the magazine
                  consolidates the month into questions and answers.
                </p>
              </div>
            </div>
            <KnobButton href="#" tone="light" size="md">
              Explore the Current Affairs programme
            </KnobButton>
          </div>
          <ul className="relative grid min-w-0 flex-1 grid-cols-2 gap-4">
            {portalFeatures.map((feature, i) => (
              <li
                key={feature.title}
                className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/6 p-6 backdrop-blur-sm"
              >
                <span className="font-display text-[13px]/[18px] font-semibold text-brand-100 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[18px]/[25px] font-semibold text-white">{feature.title}</h3>
                <p className="font-sans text-[14px]/[21px] font-medium text-neutral-300">{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
