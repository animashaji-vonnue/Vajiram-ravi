import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
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

// A free stand-in for Reckless (Displaay), the serif wanted for the hero heading. Variable: weight 400–700, optical size, SOFT and WONK.
const fraunces = localFont({
  src: [{ path: "./fonts/fraunces.woff2", weight: "400 700", style: "normal" }],
  // Consumed by the --font-serif theme token in globals.css.
  variable: "--font-fraunces-face",
  display: "swap",
});

// Noto Serif, for the toppers heading. Variable: weight 400–800.
const notoSerif = localFont({
  src: [{ path: "./fonts/noto-serif.woff2", weight: "400 800", style: "normal" }],
  // Consumed by the --font-noto-serif theme token in globals.css.
  variable: "--font-noto-serif-face",
  display: "swap",
});

const geistMono = localFont({
  // Variable font, copied from the one Next.js bundles.
  src: [{ path: "./fonts/geist-mono.woff2", weight: "100 900", style: "normal" }],
  // Consumed by the --font-mono theme token in globals.css.
  variable: "--font-geist-mono-face",
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
      className={`${figtree.variable} ${geist.variable} ${geistMono.variable} ${fraunces.variable} ${notoSerif.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: fitCanvasScript }} />
      </head>
      <body>
        <CanvasFit />
        {/* Hidden until it gets keyboard focus, then it drops in at the top left, over the header. */}
        <a
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-xl focus-visible:bg-neutral-900 focus-visible:px-4 focus-visible:py-3 focus-visible:font-display focus-visible:text-[15px]/[22px] focus-visible:font-medium focus-visible:text-white"
          href="#main"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <Toast />
      </body>
    </html>
  );
}
