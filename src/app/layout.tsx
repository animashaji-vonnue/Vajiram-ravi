import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import UtilityBar from "@/components/layout/UtilityBar";
import CanvasFit from "@/components/ui/CanvasFit";
import Toast from "@/components/ui/Toast";
import { fitCanvasScript } from "@/lib/canvas";
import "./globals.css";

const figtree = localFont({
  src: [
    { path: "./fonts/figtree-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/figtree-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/figtree-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/figtree-700.woff2", weight: "700", style: "normal" },
  ],
  // Consumed by the --font-display theme token in globals.css.
  variable: "--font-figtree-face",
  display: "swap",
});

const geist = localFont({
  src: [
    { path: "./fonts/geist-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/geist-500.woff2", weight: "500", style: "normal" },
  ],
  // Consumed by the --font-sans theme token in globals.css.
  variable: "--font-geist-face",
  display: "swap",
});

// Headings on The Recitals. Martel is Indian Type Foundry's text serif, drawn with a
// Devanagari companion: an Indian voice that still reads as plain, comfortable text.
// The Recitals masthead. Instrument Serif is the face the approved Direction A frame uses:
// light, high contrast and elegant at display size, where a text serif turns clumsy.
const instrument = localFont({
  src: [
    { path: "./fonts/instrument-serif-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument-face",
  display: "swap",
});

const martel = localFont({
  src: [
    { path: "./fonts/martel-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/martel-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/martel-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-martel-face",
  display: "swap",
});

// The new homepage (/new-home): Mukta for headings, Source Sans 3 for reading.
// Mukta is Ek Type's sans, drawn alongside Devanagari, so it carries an Indian voice
// without turning decorative; Source Sans 3 is a calm, very readable text face.
const mukta = localFont({
  src: [
    { path: "./fonts/mukta-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/mukta-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/mukta-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/mukta-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/mukta-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-mukta-face",
  display: "swap",
});

const sourceSans = localFont({
  src: [
    { path: "./fonts/source-sans-3-variable.woff2", weight: "200 900", style: "normal" },
    { path: "./fonts/source-sans-3-variable-italic.woff2", weight: "200 900", style: "italic" },
  ],
  variable: "--font-source-sans-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vajiram & Ravi Homepage",
  description: "Working prototype of the redesigned Vajiram & Ravi homepage.",
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
      className={`${figtree.variable} ${geist.variable} ${martel.variable} ${instrument.variable} ${mukta.variable} ${sourceSans.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: fitCanvasScript }} />
      </head>
      <body>
        <CanvasFit />
        <a className="sr-only" href="#main">
          Skip to content
        </a>
        <UtilityBar />
        <SiteHeader />
        <AnnouncementBar />
        {children}
        <SiteFooter />
        <Toast />
      </body>
    </html>
  );
}
