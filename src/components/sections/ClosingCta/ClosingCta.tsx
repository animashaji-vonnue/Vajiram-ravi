import { ClosingRings } from "@/components/icons";
import { KnobButton, OutlineButton } from "@/components/ui/Buttons";
import { contact } from "@/data/site";

export default function ClosingCta() {
  return (
    <section aria-labelledby="cc-h">
      <div className="relative mx-auto w-canvas px-41 py-16">
        <div
          data-reveal
          className="relative h-[444px] overflow-hidden rounded-3xl bg-[linear-gradient(to_right,#fdf3e7,#fdefb8)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_#f2e2cf]"
        >
          <ClosingRings className="pointer-events-none absolute -top-px -left-px" />
          <div className="absolute top-[calc(50%+.43px)] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-7 overflow-hidden">
            <div className="flex flex-col items-center gap-3 text-center">
              <h2 id="cc-h" className="w-[760px] font-display text-[44px]/[1.2] font-semibold text-neutral-900">
                Ready to start your UPSC preparation?
              </h2>
              <p className="w-[620px] font-sans text-[18px]/[1.5] font-medium text-neutral-500">
                Find the programme that fits your stage, or talk to a counsellor who will help you choose. No pressure to
                enrol.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <KnobButton href="/#courses">Find your course</KnobButton>
              <OutlineButton href="/#contact">Talk to a counsellor</OutlineButton>
            </div>
            <p className="font-sans text-[14px]/[normal] font-normal whitespace-pre text-neutral-500">
              {`Prefer to call? ${contact.phone}  ·  ${contact.hours}`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
