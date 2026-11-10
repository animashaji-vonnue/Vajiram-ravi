import type { Metadata, Viewport } from "next";
import { Geist_Mono, Hanken_Grotesk, Newsreader } from "next/font/google";
import type { ReactNode } from "react";
import PageTransition from "@/components/layout/PageTransition";
import Preloader, { introScript } from "@/components/layout/Preloader";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import CanvasFit from "@/components/ui/CanvasFit";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Toast from "@/components/ui/Toast";
import { fitCanvasScript } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { startAtTopScript } from "@/lib/smoothScroll";
import "./globals.css";

/*
 * The type of the final design, and no other fonts: Newsreader for headings (Light to Medium, with
 * their italics for emphasis), Hanken Grotesk for text and UI (Regular to Bold), and Geist Mono for the
 * eyebrows and labels. The variables feed the --font-serif, --font-sans and --font-mono theme tokens.
 */
const hanken = Hanken_Grotesk({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-hanken-face", display: "swap" });
const newsreader = Newsreader({
  // 300 is the Light italic of the success-story quotes.
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-newsreader-face",
  display: "swap",
});
const geistMono = Geist_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-mono-face", display: "swap" });

export const metadata: Metadata = {
  title: "Vajiram & Ravi · UPSC Civil Services Examination Preparation",
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
      className={cx(hanken.variable, newsreader.variable, geistMono.variable)}
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
        <Toast />
      </body>
    </html>
  );
}
