import Image from "next/image";

const FLOWER = 46.667;

function Flower() {
  return <Image src="/images/icons/divider-flower.svg" alt="" width={FLOWER} height={FLOWER} />;
}

/** One of the thin green rules: the long ones either side stretch, the dashes between the flowers don't. */
function Rule({ dash }: { dash?: boolean }) {
  return <span className={`h-[1.667px] rounded-full bg-green-400 ${dash ? "w-[23.667px]" : "flex-1"}`} />;
}

/**
 * The divider between homepage sections, after the design's motif row (3697:533): three green flowers joined
 * by short dashes in the middle of a hairline that runs the width of the window, 30px in from its sides like
 * the hero's frame. Purely decorative. `className` adds space around it where the section beside it has none.
 */
export default function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex w-full items-center gap-[6.25px] px-[30px] ${className}`}>
      <Rule />
      <Flower />
      <Rule dash />
      <Flower />
      <Rule dash />
      <Flower />
      <Rule />
    </div>
  );
}
