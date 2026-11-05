import { defaultStage, otherResources, studyIntro, studyStages } from "@/data/study-materials";
import FrontPage from "./FrontPage";

/**
 * Free study material (Figma "10 · Free study material — newspaper front page", 2258:9835): a sand band
 * holding one newspaper sheet, 1280 wide, with the masthead and edition tabs, the edition's lead story
 * and five headlines, and the other free resources along its foot. A plain full-bleed band.
 */
export default function FreeResources() {
  return (
    <section id="resources" aria-labelledby="resources-h" className="relative bg-[#e9dcc4]">
      <div className="mx-auto w-canvas px-20 pt-[68px] pb-24">
        <FrontPage stages={studyStages} initialStage={defaultStage} intro={studyIntro} resources={otherResources} />
      </div>
    </section>
  );
}
