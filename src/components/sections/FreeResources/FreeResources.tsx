import FrontPage from "./FrontPage";

/**
 * Free study materials & resources (IA 9; Figma "10 Free resources · newspaper front page", 2392:5785):
 * a band of grey newspaper cuttings holding one fresh newspaper sheet, 1280
 * wide, whose masthead is the section's heading (FrontPage).
 */
export default function FreeResources() {
  return (
    <section id="resources" data-curtain aria-labelledby="resources-h" className="relative isolate overflow-clip bg-[#e9e5dd]">
      {/* Newspaper cuttings laid under the sheet, in grey, edge to edge. Decoration. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid grid-cols-4 grid-rows-2 opacity-30 grayscale">
        {["left", "centre", "right", "centre", "right", "left", "centre", "left"].map((cut, i) => (
          <img key={i} src={`/images/programmes/newsprint-${cut}.webp`} alt="" width={736} height={1308} loading="lazy" decoding="async" className="size-full object-cover" style={{ transform: i % 2 ? "scaleX(-1) rotate(1.5deg)" : "rotate(-1deg)" }} />
        ))}
      </div>
      <div className="relative mx-auto w-canvas px-20 pt-24 pb-26">
        <FrontPage />
      </div>
    </section>
  );
}
