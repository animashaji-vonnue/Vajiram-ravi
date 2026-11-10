import BlockPrintBand from "@/components/ui/BlockPrintBand";
import FrontPage from "./FrontPage";

/**
 * Free study materials & resources (IA 9; Figma "10 Free resources · newspaper front page", 2392:5785):
 * a parchment band with the burnt block-print strip along its top, holding one newspaper sheet, 1280
 * wide, whose masthead is the section's heading (FrontPage).
 */
export default function FreeResources() {
  return (
    <section id="resources" aria-labelledby="resources-h" className="relative isolate overflow-clip bg-[#ffefd5]">
      <BlockPrintBand colour="#cc5500" opacity={0.4} className="top-6" />
      <div className="mx-auto w-canvas px-20 pt-24 pb-26">
        <FrontPage />
      </div>
    </section>
  );
}
