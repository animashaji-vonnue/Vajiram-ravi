import FrontPage from "./FrontPage";

/**
 * Free study materials & resources (IA 9): one broadsheet front page, 1280 wide, laid on the same cream as
 * the student stories above and the FAQ below, so the band runs on from them without a seam; only the
 * sheet itself is a lighter newsprint. Its headline is the section's heading (FrontPage).
 */
export default function FreeResources() {
  return (
    <section id="resources" aria-labelledby="resources-h" className="relative isolate overflow-clip bg-cream">
      <div className="relative mx-auto w-canvas px-20 pt-16 pb-20">
        <FrontPage />
      </div>
    </section>
  );
}
