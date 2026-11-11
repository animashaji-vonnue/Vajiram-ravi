/**
 * The giant "Vajiram & Ravi" at the foot of the footer, pressed into the paper rather than printed on it
 * (the client's reference: trove.quest's debossed mark). One line of Mukta Bold across the content's 1280px,
 * filled a shade deeper than the cream it sits on; an SVG filter cuts it in: a soft shade along the top of
 * every stroke (where the pressed wall falls into shadow), a fine light edge along the bottom (where the
 * floor of the impression catches the light), and a faint light lip just under the letters on the paper.
 * Still, with no photographs and no motion. It is read as one name; the drawing is hidden from assistive
 * technology.
 */
export default function FooterWordmark({ text }: { text: string }) {
  return (
    <div className="w-[1280px] select-none">
      <span className="sr-only">{text}</span>
      <svg aria-hidden="true" viewBox="0 0 1280 210" className="block h-auto w-full overflow-visible" fill="none">
        <defs>
          <filter id="footer-deboss" x="-2%" y="-10%" width="104%" height="125%" colorInterpolationFilters="sRGB">
            {/* The shade inside the top of each stroke. */}
            <feOffset in="SourceAlpha" dy="6" result="down" />
            <feGaussianBlur in="down" stdDeviation="3.2" result="downSoft" />
            <feComposite in="SourceAlpha" in2="downSoft" operator="out" result="topBand" />
            <feFlood floodColor="#5a2a10" floodOpacity="0.42" result="shadeInk" />
            <feComposite in="shadeInk" in2="topBand" operator="in" result="innerShade" />
            {/* The light inside the bottom of each stroke. */}
            <feOffset in="SourceAlpha" dy="-2.2" result="up" />
            <feGaussianBlur in="up" stdDeviation="1.1" result="upSoft" />
            <feComposite in="SourceAlpha" in2="upSoft" operator="out" result="bottomBand" />
            <feFlood floodColor="#ffffff" floodOpacity="0.85" result="lightInk" />
            <feComposite in="lightInk" in2="bottomBand" operator="in" result="innerLight" />
            {/* The light lip on the paper just under the letters. */}
            <feOffset in="SourceAlpha" dy="2" result="lipDown" />
            <feComposite in="lipDown" in2="SourceAlpha" operator="out" result="lipBand" />
            <feFlood floodColor="#ffffff" floodOpacity="0.9" result="lipInk" />
            <feComposite in="lipInk" in2="lipBand" operator="in" result="lip" />
            <feMerge>
              <feMergeNode in="lip" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="innerShade" />
              <feMergeNode in="innerLight" />
            </feMerge>
          </filter>
        </defs>
        <text
          x="640"
          y="172"
          textAnchor="middle"
          textLength="1272"
          lengthAdjust="spacingAndGlyphs"
          filter="url(#footer-deboss)"
          className="font-heading"
          style={{ fontSize: 224, fontWeight: 700, letterSpacing: "-0.03em", fill: "#f6ead8" }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
}
