import { ArrowRightXsIcon, ArrowRightXxsIcon } from "@/components/icons";
import { NUDGE, OutlineButton } from "@/components/ui/Buttons";
import { Eyebrow, SectionTitle } from "@/components/ui/Typography";
import { otherResources, resourceColumns, type ResourceColumn } from "@/data/resources";
import { cx } from "@/lib/cx";

function ResourceCard({ column }: { column: ResourceColumn }) {
  const { muted } = column;
  return (
    <div className="flex h-[562px] min-w-0 flex-1 flex-col gap-4 overflow-hidden rounded-[20px] bg-white px-7 pt-7 pb-6 shadow-[inset_0_0_0_1px_var(--color-neutral-200)]">
      <div className={cx("border-b border-neutral-200", muted && "pb-2")}>
        <div className={cx("flex", muted ? "pb-1" : "pb-2")}>
          <h3 className="font-display text-[26px]/[32px] font-bold whitespace-nowrap text-neutral-900">{column.title}</h3>
        </div>
      </div>
      <div className="flex flex-col">
        {column.items.map((item) => (
          <a
            key={item}
            href="#"
            className={cx(
              "group/row flex h-15 items-center gap-3.5 overflow-hidden py-3.5 shadow-[inset_0_-1px_0_var(--color-neutral-200)] last:shadow-none",
              muted ? "text-[#575757]" : "text-neutral-900",
            )}
          >
            <p className="min-w-0 flex-1 font-sans text-[14px]/[23px] font-medium text-neutral-700 transition-colors duration-200 group-hover/row:text-brand-700">
              {item}
            </p>
            <ArrowRightXsIcon className={cx(NUDGE, "group-hover/row:translate-x-[3px]")} />
          </a>
        ))}
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end">
        <OutlineButton href="#" size="md" className="w-full">
          View more
        </OutlineButton>
      </div>
    </div>
  );
}

export default function FreeResources() {
  return (
    <section className="bg-brand-50" id="resources" aria-labelledby="r2-h">
      <div className="relative mx-auto flex w-canvas flex-col gap-12 px-20 py-24">
        <div data-reveal className="flex max-w-[860px] flex-col gap-5">
          <Eyebrow>FREE RESOURCES</Eyebrow>
          <SectionTitle id="r2-h" className="w-[460px]">
            Study materials for every stage of UPSC
          </SectionTitle>
        </div>
        <div data-reveal-group className="flex items-stretch gap-6 overflow-hidden">
          {resourceColumns.map((column) => (
            <ResourceCard key={column.title} column={column} />
          ))}
        </div>
        <div data-reveal className="flex items-center gap-4">
          <p className="font-display text-[18px]/[25px] font-semibold whitespace-nowrap text-neutral-900">Other free resources :</p>
          <div className="flex flex-wrap items-center gap-3">
            {otherResources.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="group/chip flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-2.5 pr-3.5 pl-4 font-sans text-[14px]/[21px] font-medium whitespace-nowrap text-neutral-700 transition-colors duration-200 hover:border-neutral-300 hover:text-neutral-900"
              >
                {label}
                <ArrowRightXxsIcon className={cx(NUDGE, "group-hover/chip:translate-x-0.5")} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
