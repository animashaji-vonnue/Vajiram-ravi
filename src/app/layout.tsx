import type { Metadata, Viewport } from "next";
import { Mukta, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";
import PageTransition from "@/components/layout/PageTransition";
import Preloader, { introScript } from "@/components/layout/Preloader";
import SiteFooter from "@/components/layout/SiteFooter";
import SectionJump from "@/components/layout/SectionJump";
import SiteHeader from "@/components/layout/SiteHeader";
import CanvasFit from "@/components/ui/CanvasFit";
import GradualBlur from "@/components/ui/GradualBlur";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Toast from "@/components/ui/Toast";
import { fitCanvasScript } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { startAtTopScript } from "@/lib/smoothScroll";
import "./globals.css";

/*
 * The site's type, and no other fonts: Mukta for headings (Light to Bold; it has no italics, so the
 * emphasis in a heading is set apart by its colour alone) and Source Sans 3 for everything else, text, UI
 * and labels alike (Regular to Bold, with italics). The variables feed the --font-heading and --font-sans
 * theme tokens.
 */
const sourceSans = Source_Sans_3({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-text-face",
  display: "swap",
});
const mukta = Mukta({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], variable: "--font-heading-face", display: "swap" });

export const metadata: Metadata = {
  title: "Vajiram & Ravi · UPSC Civil Services Examination preparation",
  description:
    "Prepare for the Civil Services Examination with experienced educators, structured programmes and focused academic guidance at every stage. Since 1976.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The canvas-fit script sets an inline zoom on <html> before hydration.
    <html
      lang="en"
      className={cx(sourceSans.variable, mukta.variable)}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: fitCanvasScript }} />
        <script dangerouslySetInnerHTML={{ __html: startAtTopScript }} />
        {/* Decides before the first paint whether the "Namaste" intro plays (every load, not with reduced motion). */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <CanvasFit />
        <SmoothScroll />
        <Preloader />
        <PageTransition />
        <a className="sr-only" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        {/*
          A soft, stepped blur along the very foot of the screen (40px, ui/GradualBlur), under the header,
          the cursor label and the dialogs. Hidden until TextMotion shows it (data-on), once the page has left
          its first screen, and gone again near the end of the page; never with reduced motion (globals.css).
        */}
        <div data-gb-viewport aria-hidden="true" className="gb-viewport pointer-events-none fixed inset-x-0 bottom-0 z-[35] h-10">
          <GradualBlur side="bottom" strength={3} layers={3} className="inset-0" />
        </div>
        <SectionJump />
        <Toast />
      </body>
    </html>
  );
}
