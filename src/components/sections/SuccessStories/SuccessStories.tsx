import { EyebrowCentred } from "@/components/ui/Ornament";
import { stories, storiesIntro } from "@/data/stories";
import { ParallaxLayer } from "@/lib/parallax";
import StoryCarousel from "./StoryCarousel";

/**
 * Success stories (Figma "Success stories", 2258:9790): a warm band with the Gateway of India faint
 * behind it, the "In their words" eyebrow, then one large glass card holding a student's words, with the
 * dots and the ← → buttons below it on the right. A plain full-bleed band, 758px tall as drawn.
 *
 * Scroll (fine pointers, where ViewTimeline exists, motion allowed): the Gateway drifts 7% of the band's
 * height behind the card as the band crosses the screen (lib/parallax).
 */
export default function SuccessStories() {
  return (
    <section id="stories" aria-labelledby="stories-h" className="relative isolate overflow-clip bg-linear-to-b from-[#ffeedb] to-[#fff7ee]">
      {/* The Gateway of India at 20%, over the band's gradient and under everything else; it drifts with the scroll. */}
      <ParallaxLayer speed={5} className="pointer-events-none absolute inset-0 -z-1">
        <img
          src="/images/stories/gateway-of-india.webp"
          alt=""
          aria-hidden="true"
          width={730}
          height={459}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full max-w-none object-cover opacity-20"
        />
      </ParallaxLayer>
      <div className="mx-auto flex w-canvas flex-col items-start gap-10 px-20 pt-24 pb-[62px]">
        <h2 id="stories-h" className="sr-only">
          {storiesIntro.title}
        </h2>
        <EyebrowCentred labelClassName="text-orange uppercase">{storiesIntro.eyebrow}</EyebrowCentred>
        <StoryCarousel stories={stories} />
      </div>
    </section>
  );
}
