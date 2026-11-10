import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import CanvasFit from "@/components/ui/CanvasFit";
import { fitCanvasScript } from "@/lib/canvas";
import "./globals.css";

// Instrument Serif, the headline face, with its italic for the words a headline leans on.
const instrumentSerif = localFont({
  src: [
    { path: "./fonts/instrument-serif.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument-serif-face",
  display: "swap",
});

// Instrument Sans, for everything else. Variable: weight 400–700.
const instrumentSans = localFont({
  src: [{ path: "./fonts/instrument-sans.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-instrument-sans-face",
  display: "swap",
});

// Geist Mono, for the small labels over the headings (the eyebrows).
const geistMono = localFont({
  src: [{ path: "./fonts/geist-mono.woff2", weight: "400", style: "normal" }],
  variable: "--font-geist-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vajiram & Ravi — UPSC preparation since 1976",
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
      className={`${instrumentSerif.variable} ${instrumentSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: fitCanvasScript }} />
      </head>
      <body>
        <CanvasFit />
        <a
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-ink-900 focus-visible:px-5 focus-visible:py-3 focus-visible:text-[15px] focus-visible:font-semibold focus-visible:text-white"
          href="#main"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
