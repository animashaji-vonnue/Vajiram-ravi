"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, Xmark } from "iconoir-react";
import { life } from "@/data/content";
import SectionIntro from "@/components/ui/SectionIntro";
import { prefersReducedMotion } from "@/lib/motion";

/** How long each word stays over the film. */
const WORD_MS = 2200;

/**
 * Life at Vajiram & Ravi, on the orange ground: the intro, then the film full width, playing silently as a preview with one
 * word at a time over it (Learn, Discuss, Prepare, Grow) and a large play button. Playing opens the film over the
 * whole window with its controls (drawn at the end of the page, so nothing on the page can sit over it); it starts muted, since sound never starts on its own, and Escape or the close
 * button ends it.
 */
export default function Life() {
  const [word, setWord] = useState(0);
  const [open, setOpen] = useState(false);
  const player = useRef<HTMLVideoElement>(null);
  const preview = useRef<HTMLVideoElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  // Closing the film hands focus back to the button that opened it.
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => trigger.current?.focus());
  };

  useEffect(() => {
    const video = preview.current;
    if (video) {
      video.muted = true;
      if (!prefersReducedMotion()) void video.play().catch(() => {});
    }
    if (prefersReducedMotion()) return;
    const timer = setInterval(() => setWord((w) => (w + 1) % life.words.length), WORD_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    void player.current?.play().catch(() => {});
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section id="life" aria-labelledby="life-title" className="ember scroll-mt-[76px] pt-32 text-white">
      <div className="mx-auto w-canvas px-12">
        <SectionIntro
          id="life-title"
          tone="ember"
          eyebrow={life.eyebrow}
          headline={life.headline}
          description={life.description}
          statement={life.statement}
        />
      </div>

      <div className="relative mt-16 h-[760px] overflow-hidden">
        <video
          ref={preview}
          src={life.film}
          poster={life.poster}
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-rust via-rust/35 to-[#c04016]/60" />

        <div className="absolute inset-0 flex items-center justify-between px-24">
          <p
            aria-hidden="true"
            className="relative h-[150px] w-[640px] font-serif text-[150px]/[1] tracking-[-0.03em] italic"
          >
            {life.words.map((w, i) => (
              <span
                key={w}
                className="absolute inset-0 transition-[opacity,translate] duration-700 ease-out-soft"
                style={{ opacity: i === word ? 1 : 0, translate: i === word ? "0 0" : "0 24px" }}
              >
                {w}.
              </span>
            ))}
          </p>
          <button
            ref={trigger}
            type="button"
            onClick={() => setOpen(true)}
            className="group flex items-center gap-5 text-left"
            aria-label="Play the film of life at Vajiram & Ravi"
          >
            <span className="flex size-28 items-center justify-center rounded-full bg-white text-ink-900 transition-transform duration-500 ease-out-soft group-hover:scale-110">
              <Play width={40} height={40} className="translate-x-1" />
            </span>
            <span className="text-[16px]/[22px] font-semibold">
              Watch the film
              <span className="block font-normal text-white/90">Sound off until you turn it on</span>
            </span>
          </button>
        </div>
      </div>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Life at Vajiram & Ravi, film"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-10"
          >
            <video
              ref={player}
              src={life.film}
              controls
              muted
              playsInline
              className="max-h-full w-full max-w-[1400px] rounded-[16px]"
            />
            <button
              type="button"
              onClick={close}
              aria-label="Close the film"
              autoFocus
              className="absolute top-6 right-6 flex size-12 items-center justify-center rounded-full bg-white text-ink-900"
            >
              <Xmark width={22} height={22} />
            </button>
          </div>,
          document.body,
        )}
    </section>
  );
}
