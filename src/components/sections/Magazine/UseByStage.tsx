import { Eyebrow, Lead, SectionTitle } from "@/components/ui/Typography";
import { stageUses } from "@/data/magazine";

/** How the magazine helps at each stage, in the homepage's feature-card style. */
export default function UseByStage() {
  return (
    <section className="bg-brand-50" aria-labelledby="use-h">
      <div className="relative mx-auto flex w-canvas flex-col gap-12 px-20 py-24">
        <div data-reveal className="flex w-full flex-col items-center gap-5 text-center">
          <Eyebrow>HOW TO USE IT</Eyebrow>
          <div className="flex flex-col items-center gap-3">
            <SectionTitle id="use-h">One magazine for every stage of the exam</SectionTitle>
            <Lead className="w-[760px]">
              Current affairs carry weight in more than half the syllabus. Each part of the magazine is written for the
              paper it will be tested in.
            </Lead>
          </div>
        </div>
        <div data-reveal-group className="grid w-full grid-cols-3 gap-6">
          {stageUses.map(({ title, description, icon: Icon }) => (
            <div key={title} className="relative flex flex-col gap-6 overflow-hidden rounded-[20px] border border-line bg-white p-8">
              <span className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-brand-100 text-brown-800">
                <Icon />
              </span>
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-[20px]/[27px] font-semibold text-neutral-900">{title}</h3>
                <p className="font-sans text-[16px]/[23px] font-medium text-neutral-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
