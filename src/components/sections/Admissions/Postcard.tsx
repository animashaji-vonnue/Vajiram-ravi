"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Cta from "@/components/ui/Cta";
import IndianLink from "@/components/ui/IndianLink";
import { counsellingCopy } from "@/data/admissions";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";
import { HEADER_OFFSET, scrollToElement } from "@/lib/smoothScroll";
import { onEnquiryRequest } from "./enquiry";
import { submitEnquiry, type EnquiryValues } from "./submitEnquiry";

type Field = keyof EnquiryValues;
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "done";
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const EMPTY: EnquiryValues = { name: "", phone: "", email: "", programme: "", mode: "", query: "" };
/** The fields in the order they are drawn, checked and focused. */
const ORDER: Field[] = ["name", "phone", "email", "programme", "mode", "query"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const copy = counsellingCopy;

/* The motion tokens, for the Web Animations API (which cannot read CSS variables). */
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
const DUR_FAST = 200;
const DUR_BASE = 320;
/** The card's arrival: it slides up 32px turned -2°, overshoots a hair and settles, in 700ms. */
const ARRIVE_MS = 700;
/** The stamp lands as the card settles; the ink ring and the postmark waves follow it. */
const STAMP_AT = ARRIVE_MS - DUR_FAST;
const INK_MS = 700;
const WAVE_STAGGER_MS = 60;
/** Posting: the card lifts 8px and tips back down, and the postmark hits as it lands. */
const SEND_MS = 520;
const POSTMARK_AT = 220;
/** The stamp's hover spin: a full turn about its upright axis, seen through a 600px perspective. */
const SPIN_MS = 900;
const SPIN = [{ transform: "perspective(600px) rotateY(0deg)" }, { transform: "perspective(600px) rotateY(360deg)" }];
/** A soft ink ring spreading from a stamp as it is pressed, and fading. */
const INK_RING = [
  { opacity: 0.55, transform: "scale(0.55)" },
  { opacity: 0, transform: "scale(1.2)" },
];

/** The 10 digits after +91, without a +91 or 0 typed in front of them. */
function phoneDigits(value: string) {
  return value.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
}

/** The error for a field's value, or "" when it is fine. "Your Query" may stay empty. */
function check(field: Field, value: string): string {
  switch (field) {
    case "name":
      return value.trim().length >= 2 ? "" : copy.errors.name;
    case "phone":
      return phoneDigits(value).length === 10 ? "" : copy.errors.phone;
    case "email":
      return EMAIL_PATTERN.test(value.trim()) ? "" : copy.errors.email;
    case "programme":
      return value ? "" : copy.errors.programme;
    case "mode":
      return value ? "" : copy.errors.mode;
    case "query":
      return "";
  }
}

/**
 * The bordered box of every field, as drawn: white, a grey hairline and 14px corners. Focus turns the
 * border burnt and shows the saffron ring (the page's ring, here on mouse focus of the selects too).
 */
const BOX =
  "w-full min-w-0 rounded-[14px] border bg-white text-[15px]/[22px] font-medium outline-offset-3 [transition:border-color_var(--dur-fast)_var(--ease-out)] placeholder:text-[#737373] focus:border-burnt focus:outline-2 focus:outline-saffron";
const border = (error: boolean) => (error ? "border-burnt" : "border-[#737373] hover:border-clay");
const SELECT = "h-[52px] cursor-pointer appearance-none pr-10 pl-4 [&_option]:text-ink";

function FieldShell({ id, label, error, className, children }: { id: string; label: ReactNode; error?: string; className?: string; children: ReactNode }) {
  return (
    <div className={cx("group/field flex min-w-0 flex-col gap-1.5", className)}>
      {/* Focus lifts the label from mahogany to ink. */}
      <label
        htmlFor={id}
        className="text-[13px]/[18px] font-bold whitespace-nowrap text-mahogany [transition:color_var(--dur-fast)_var(--ease-out)] group-focus-within/field:text-ink"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-[12px]/[16px] font-medium text-burnt">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Focus draws a 2px burnt line along the foot of the field's box from the left (--dur-base, --ease-out),
 * between the box's rounded corners; it draws back when the focus leaves. Instant with reduced motion.
 */
function FocusLine() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-3.5 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-burnt [transition:scale_var(--dur-base)_var(--ease-out)] group-focus-within/field:scale-x-100"
    />
  );
}

/** The select's "⌄", as drawn at the right of the box. */
function Chevron() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute top-4 right-[17px] text-[16px]/[20px] font-bold text-clay">
      ⌄
    </span>
  );
}

type PostcardProps = {
  /** The choices of "Programme of Interest". */
  programmes: string[];
  /** The choices of "Preferred Learning Mode". */
  modes: string[];
  className?: string;
};

/**
 * The India Post postcard (Figma "Postcard", 2377:4881, 700 wide): the title, the stamp (the Vajiram & Ravi
 * emblem on a cream panel in the orange frame, "1976") with its postmark waves, and the counselling form:
 * Full Name; Mobile Number and Email Address; Programme of Interest and Preferred Learning Mode; Your Query
 * (optional); "Request a Call Back". Labels are real labels; each field is checked when it is left (once
 * something is in it) and all of them on submit, an error showing under its field with a 4px shake. The
 * button shows its loading state while submitEnquiry runs. When it goes through, the form fades out, a
 * thank-you fades in and a round postmark stamps across the stamp; when it fails every value stays and the
 * error shows above the button.
 *
 * requestEnquiry, from anywhere on the page, scrolls the card into view if it is not and puts the focus in
 * its first empty field: "Get Expert Guidance" beside it, and a batch ticket's "Register now", which also
 * fills in "Programme of Interest" with its programme.
 *
 * Motion (reduced motion: the card fades in, and everything else is simply there):
 *   - Arrival, when the card is first seen: it slides up 32px from a -2° tilt, overshoots by a hair and
 *     settles square (700ms); the stamp lands with a small press (scale 1.1 to 1) as it settles, a soft
 *     ink ring spreads from it and fades, and the three postmark waves draw in after it, 60ms apart.
 *   - Focus draws a burnt line along the foot of the field (FocusLine), with the border and the ring.
 *   - Posting: the card lifts and tips back down as if dropped in the box, and the postmark hits as it lands
 *     (scale 1.4 to 1) with its own ink ring.
 *   - Hovering the stamp with a fine pointer spins it a full turn in 3D.
 */
export default function Postcard({ programmes, modes, className }: PostcardProps) {
  const uid = useId();
  const ids = Object.fromEntries(ORDER.map((field) => [field, `${uid}-${field}`])) as Record<Field, string>;

  const [values, setValues] = useState<EnquiryValues>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failed, setFailed] = useState(false);
  const [postedOn, setPostedOn] = useState("");
  // A programme asked for from elsewhere on the page that is not in the list (e.g. a batch's own name).
  const [extraProgramme, setExtraProgramme] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const stampSpinRef = useRef<HTMLDivElement>(null);
  const stampInkRef = useRef<HTMLSpanElement>(null);
  const wavesRef = useRef<Array<HTMLImageElement | null>>([]);
  const postmarkRef = useRef<HTMLDivElement>(null);
  const postmarkInkRef = useRef<HTMLSpanElement>(null);
  const thanksRef = useRef<HTMLDivElement>(null);
  const thanksTitleRef = useRef<HTMLParagraphElement>(null);
  const controls = useRef<Partial<Record<Field, Control | null>>>({});
  const boxes = useRef<Partial<Record<Field, HTMLDivElement | null>>>({});
  const statusRef = useRef<Status>("idle");
  const valuesRef = useRef<EnquiryValues>(EMPTY);
  const mounted = useRef(true);

  useEffect(() => {
    statusRef.current = status;
    valuesRef.current = values;
  }, [status, values]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const focusField = (field: Field) => controls.current[field]?.focus({ preventScroll: true });

  /** The 4px shake of a field whose error has just appeared (200ms, once). */
  const shake = (field: Field) => {
    const box = boxes.current[field];
    if (!box || prefersReducedMotion() || typeof box.animate !== "function") return;
    box.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(4px)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(0)" },
      ],
      { duration: DUR_FAST, easing: EASE_IN_OUT },
    );
  };

  /**
   * Hovering the stamp (a mouse or trackpad) spins it once about its upright axis, within its -4° tilt
   * (after the "3D spin" hover effect). The still outer box takes the hover, so the turning stamp cannot
   * drop the pointer and start another turn mid-spin. Not on touch, not under reduced motion.
   */
  const spinStamp = (event: { pointerType: string }) => {
    const stamp = stampRef.current;
    const face = stampSpinRef.current;
    if (!stamp || !face || typeof face.animate !== "function" || event.pointerType === "touch") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
    // Not before the card has arrived or while the stamp lands, nor while a turn is under way.
    if (cardRef.current?.style.opacity === "0" || stamp.getAnimations().length || face.getAnimations().length) return;
    face.animate(SPIN, { duration: SPIN_MS, easing: EASE_IN_OUT });
  };

  // Arrival (see the doc comment). With reduced motion the card just fades in, stamp and all.
  useEffect(() => {
    const card = cardRef.current;
    const stamp = stampRef.current;
    if (!card || !stamp || typeof card.animate !== "function") return;
    const reduce = prefersReducedMotion();
    card.style.opacity = "0";
    const cancel = whenVisible(card, 0.3, () => {
      card.style.opacity = "";
      if (reduce) {
        card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: "linear" });
        return;
      }
      card.animate(
        [
          { opacity: 0, transform: "translateY(32px) rotate(-2deg)", easing: EASE_OUT },
          { opacity: 1, offset: 0.3 },
          { transform: "translateY(-3px) rotate(0.3deg)", offset: 0.7, easing: EASE_IN_OUT },
          { transform: "none" },
        ],
        { duration: ARRIVE_MS },
      );
      stamp.animate(
        [
          { opacity: 0, transform: "scale(1.1)" },
          { opacity: 1, transform: "scale(1)" },
        ],
        { duration: DUR_FAST, delay: STAMP_AT, easing: EASE_OUT, fill: "backwards" },
      );
      stampInkRef.current?.animate(INK_RING, { duration: INK_MS, delay: STAMP_AT + DUR_FAST * 0.6, easing: EASE_OUT });
      wavesRef.current.forEach((wave, i) =>
        wave?.animate(
          [
            { opacity: 0, transform: "translateX(-10px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: DUR_BASE, delay: STAMP_AT + DUR_FAST + i * WAVE_STAGGER_MS, easing: EASE_OUT, fill: "backwards" },
        ),
      );
    });
    return () => {
      cancel();
      card.style.opacity = "";
    };
  }, []);

  // requestEnquiry: bring the postcard into view (if it is not) with the programme asked for chosen.
  useEffect(
    () =>
      onEnquiryRequest((programme) => {
        // A card already posted starts again, empty.
        const finished = statusRef.current === "done";
        const next = { ...(finished ? EMPTY : valuesRef.current), ...(programme !== undefined ? { programme } : {}) };
        if (programme !== undefined) setExtraProgramme(programmes.includes(programme) ? null : programme);
        else if (finished) setExtraProgramme(null);
        setValues(next);
        setErrors((current) => (finished ? {} : programme !== undefined ? { ...current, programme: undefined } : current));
        setFailed(false);
        if (finished) setStatus("idle");
        const card = cardRef.current;
        if (!card) return;
        const box = card.getBoundingClientRect();
        if (box.top < HEADER_OFFSET * getCanvasZoom() || box.bottom > window.innerHeight) {
          const section = card.closest("section");
          if (section) scrollToElement(section);
        }
        // The first required field still empty, once React has drawn the new values.
        const empty = ORDER.find((field) => field !== "query" && !next[field]);
        requestAnimationFrame(() => focusField(empty ?? "name"));
      }),
    [programmes],
  );

  // Posted: the card lifts and tips back down, the thank-you fades in, and the postmark hits as it lands.
  useEffect(() => {
    if (status !== "done") return;
    thanksTitleRef.current?.focus({ preventScroll: true });
    if (prefersReducedMotion()) return;
    cardRef.current?.animate(
      [{ transform: "none" }, { transform: "translateY(-8px) rotate(-0.6deg)", offset: 0.4 }, { transform: "none" }],
      { duration: SEND_MS, easing: EASE_IN_OUT },
    );
    thanksRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: DUR_BASE,
      delay: DUR_BASE * 0.7 * 0.5,
      easing: EASE_OUT,
      fill: "backwards",
    });
    postmarkRef.current?.animate(
      [
        { opacity: 0, transform: "scale(1.4)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      { duration: DUR_FAST, delay: POSTMARK_AT, easing: EASE_OUT, fill: "backwards" },
    );
    postmarkInkRef.current?.animate(INK_RING, { duration: INK_MS, delay: POSTMARK_AT + DUR_FAST * 0.6, easing: EASE_OUT });
  }, [status]);

  const update = (field: Field, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    // An error shown for this field clears as soon as the value is fixed.
    if (errors[field]) setErrors((current) => ({ ...current, [field]: check(field, value) || undefined }));
  };

  // Check a field when it is left, once something has been entered (or it already shows an error).
  const leave = (field: Field) => {
    const value = values[field];
    if (!value && !errors[field]) return;
    const error = check(field, value) || undefined;
    if (error && !errors[field]) shake(field);
    setErrors((current) => ({ ...current, [field]: error }));
  };

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "idle") return;
    const found: Errors = {};
    for (const field of ORDER) {
      const error = check(field, values[field]);
      if (error) found[field] = error;
    }
    setErrors(found);
    const invalid = ORDER.filter((field) => found[field]);
    if (invalid.length) {
      invalid.forEach(shake);
      focusField(invalid[0]);
      return;
    }
    setFailed(false);
    setStatus("sending");
    try {
      await submitEnquiry({
        ...values,
        name: values.name.trim(),
        phone: phoneDigits(values.phone),
        email: values.email.trim(),
        query: values.query.trim(),
      });
      if (!mounted.current) return;
      setPostedOn(new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase());
      setStatus("done");
    } catch {
      if (!mounted.current) return;
      setStatus("idle");
      setFailed(true);
    }
  };

  const startOver = () => {
    setValues(EMPTY);
    setErrors({});
    setExtraProgramme(null);
    setFailed(false);
    setStatus("idle");
    requestAnimationFrame(() => focusField("name"));
  };

  const fieldProps = (field: Field) => ({
    id: ids[field],
    name: field,
    value: values[field],
    onBlur: () => leave(field),
    onChange: (event: { target: { value: string } }) => update(field, event.target.value),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${ids[field]}-error` : undefined,
  });
  const controlRef = (field: Field) => (el: Control | null) => {
    controls.current[field] = el;
  };
  const boxRef = (field: Field) => (el: HTMLDivElement | null) => {
    boxes.current[field] = el;
  };

  const done = status === "done";
  const programmeOptions = extraProgramme ? [extraProgramme, ...programmes] : programmes;
  const firstName = values.name.trim().split(/\s+/)[0];

  return (
    <div
      ref={cardRef}
      className={cx(
        // Square to the page; the title sits level with the stamp.
        "relative w-[700px] shrink-0 rounded-2xl bg-[#ffefd5] px-9 pt-[52px] pb-10 shadow-[0_24px_24px_rgb(43_18_5/0.3)]",
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[10px] border border-burnt/60" />

      <h3 id={`${uid}-title`} className="relative w-[440px] font-serif text-[30px]/[34px] font-normal text-mahogany">
        {copy.postcardTitle}
      </h3>

      {/* The postmark's wavy cancellation lines, then the stamp with the emblem (88 × 104, turned 4°). */}
      {["top-[49.25px]", "top-[60.25px]", "top-[71.25px]"].map((top, i) => (
        <img
          key={top}
          ref={(el) => {
            wavesRef.current[i] = el;
          }}
          src="/images/talk-to-us/postmark-wave.svg"
          alt=""
          aria-hidden="true"
          width={88.9}
          height={4.964}
          className={cx("pointer-events-none absolute left-[475.55px] max-w-none", top)}
        />
      ))}
      {/* The ink ring the stamp leaves as it lands: 128px, centred on the stamp. */}
      <span
        ref={stampInkRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-[14.8px] left-[559.5px] size-32 rounded-full border-2 border-mahogany/35 opacity-0 mix-blend-multiply"
      />
      {/* Hovering the stamp spins it a full turn in 3D; its box takes the hover (it is not focusable). */}
      <div aria-hidden="true" onPointerEnter={spinStamp} className="absolute top-[26.8px] left-[579.52px] h-[104px] w-[88px] -rotate-4">
        <div ref={stampSpinRef} className="pointer-events-none absolute inset-0">
          <div ref={stampRef} className="absolute inset-0">
            <img src="/images/talk-to-us/stamp-edge.svg" alt="" width={104} height={120} className="absolute -top-[5px] -left-2 max-w-none" />
            {/* The stamp's face, as on a real stamp: an orange frame, the Vajiram & Ravi emblem on a cream panel, the year under it. */}
            <div className="absolute top-2 left-2 h-[88px] w-[72px] rounded-[2px] bg-[#ec5800] whitespace-nowrap">
              <div className="absolute inset-x-[5px] top-[5px] flex h-[60px] items-center justify-center rounded-[1px] bg-cream">
                <img src="/images/talk-to-us/stamp-emblem.webp" alt="" width={52} height={52} className="size-[52px] max-w-none" />
              </div>
              <p className="absolute inset-x-0 bottom-[5px] pl-px text-center text-[10px]/[12px] font-bold tracking-[1px] text-saffron">1976</p>
            </div>
          </div>
        </div>
      </div>
      {/* Posted: a round postmark across the stamp, with its ink ring. */}
      {done && (
        <div aria-hidden="true" className="pointer-events-none absolute top-10 left-[541px] size-[84px] -rotate-8 mix-blend-multiply">
          <span ref={postmarkInkRef} className="absolute -inset-5 rounded-full border-2 border-mahogany/35 opacity-0" />
          <div
            ref={postmarkRef}
            className="relative flex size-full flex-col items-center justify-center gap-px rounded-full border-2 border-mahogany/60 text-mahogany/75"
          >
            <span className="absolute inset-[5px] rounded-full border border-mahogany/40" />
            <span className="text-[9px]/[11px] font-bold tracking-[1.4px]">POSTED</span>
            <span className="font-mono text-[9px]/[11px]">{postedOn}</span>
            <span className="text-[9px]/[11px] font-bold tracking-[1.4px]">V&amp;R</span>
          </div>
        </div>
      )}

      <form noValidate onSubmit={(event) => void send(event)} aria-labelledby={`${uid}-title`} className="relative mt-[46px]">
        <div
          inert={done}
          className={cx(
            "grid grid-cols-[306px_306px] gap-x-4 gap-y-3.5",
            done
              ? "pointer-events-none opacity-0 [transition:opacity_224ms_var(--ease-in)]"
              : "opacity-100 [transition:opacity_var(--dur-base)_var(--ease-out)]",
          )}
        >
          <FieldShell id={ids.name} label={copy.labels.name} error={errors.name} className="col-span-2">
            <div ref={boxRef("name")} className="relative">
              <input
                {...fieldProps("name")}
                ref={controlRef("name")}
                type="text"
                autoComplete="name"
                placeholder={copy.placeholders.name}
                className={cx(BOX, border(!!errors.name), "h-[52px] px-4 text-ink")}
              />
              <FocusLine />
            </div>
          </FieldShell>

          <FieldShell
            id={ids.phone}
            label={
              <>
                {copy.labels.phone}
                <span className="sr-only"> (10 digits after +91)</span>
              </>
            }
            error={errors.phone}
          >
            <div ref={boxRef("phone")} className="relative">
              {/* The country code, as drawn: "+91" in the placeholder grey. */}
              <span aria-hidden="true" className="pointer-events-none absolute top-[15px] left-[17px] text-[15px]/[22px] font-medium text-[#737373]">
                +91
              </span>
              <input
                {...fieldProps("phone")}
                ref={controlRef("phone")}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={14}
                className={cx(BOX, border(!!errors.phone), "h-[52px] pr-4 pl-[53px] text-ink")}
              />
              <FocusLine />
            </div>
          </FieldShell>

          <FieldShell id={ids.email} label={copy.labels.email} error={errors.email}>
            <div ref={boxRef("email")} className="relative">
              <input
                {...fieldProps("email")}
                ref={controlRef("email")}
                type="email"
                autoComplete="email"
                placeholder={copy.placeholders.email}
                className={cx(BOX, border(!!errors.email), "h-[52px] px-4 text-ink")}
              />
              <FocusLine />
            </div>
          </FieldShell>

          <FieldShell id={ids.programme} label={copy.labels.programme} error={errors.programme}>
            <div ref={boxRef("programme")} className="relative">
              <select
                {...fieldProps("programme")}
                ref={controlRef("programme")}
                className={cx(BOX, border(!!errors.programme), SELECT, values.programme ? "text-ink" : "text-[#737373]")}
              >
                <option value="" disabled>
                  {copy.placeholders.programme}
                </option>
                {programmeOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <Chevron />
              <FocusLine />
            </div>
          </FieldShell>

          <FieldShell id={ids.mode} label={copy.labels.mode} error={errors.mode}>
            <div ref={boxRef("mode")} className="relative">
              <select
                {...fieldProps("mode")}
                ref={controlRef("mode")}
                className={cx(BOX, border(!!errors.mode), SELECT, values.mode ? "text-ink" : "text-[#737373]")}
              >
                <option value="" disabled>
                  {copy.placeholders.mode}
                </option>
                {modes.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <Chevron />
              <FocusLine />
            </div>
          </FieldShell>

          <FieldShell
            id={ids.query}
            label={
              <>
                {copy.labels.query} <span className="font-medium text-clay">{copy.optional}</span>
              </>
            }
            className="col-span-2"
          >
            <div ref={boxRef("query")} className="relative">
              <textarea
                {...fieldProps("query")}
                ref={controlRef("query")}
                rows={3}
                maxLength={600}
                placeholder={copy.placeholders.query}
                className={cx(BOX, border(false), "block h-[96px] resize-none px-4 py-3.5 text-ink")}
              />
              <FocusLine />
            </div>
          </FieldShell>

          {/* The button, at the left under the fields; a failed send is reported in the line above it. */}
          <div className="relative col-span-2 pt-7">
            {failed && (
              <p role="alert" className="absolute top-0 left-0 text-[13px]/[18px] font-bold whitespace-nowrap text-burnt">
                {copy.failed}
              </p>
            )}
            <Cta variant="primary" size="lg" type="submit" loading={status === "sending"}>
              {copy.submit}
            </Cta>
          </div>
        </div>

        {done && (
          <div ref={thanksRef} className="absolute inset-0 flex flex-col items-start justify-center gap-3">
            <p ref={thanksTitleRef} tabIndex={-1} className="font-serif text-[30px]/[34px] text-mahogany outline-none">
              {copy.thanks}
              {firstName ? `, ${firstName}` : ""}.
            </p>
            <p className="text-[15px]/[22px] font-medium text-clay">{copy.thanksText}</p>
            <p className="max-w-full truncate font-mono text-[12px]/[16px] tracking-[0.72px] text-clay uppercase">
              +91 {phoneDigits(values.phone)} · {values.programme} · {values.mode}
            </p>
            <div className="mt-2">
              <IndianLink tone="light" onClick={startOver}>
                {copy.again}
              </IndianLink>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
