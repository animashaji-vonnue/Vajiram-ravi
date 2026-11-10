"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, NavArrowDown } from "iconoir-react";
import { contact, counselling } from "@/data/content";
import { Eyebrow } from "@/components/ui/SectionIntro";
import { cx } from "@/lib/cx";

const FIELD =
  "h-[52px] w-full rounded-[14px] border border-ink-900/45 bg-white px-4 text-[15px] font-medium text-ink-900 outline-none transition-colors placeholder:text-faint focus:border-saffron-600 focus:ring-2 focus:ring-saffron-500/25";

/** One labelled field on the postcard. */
function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px]/[18px] font-semibold text-ink-900">
        {label}
      </label>
      {children}
    </div>
  );
}

/** A select on the postcard, styled like the text fields, with a chevron. */
function Select({
  id,
  name,
  placeholder,
  options,
}: {
  id: string;
  name: string;
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        required
        defaultValue=""
        className={cx(FIELD, "cursor-pointer appearance-none pr-11")}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <NavArrowDown
        width={18}
        height={18}
        strokeWidth={1.8}
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-700"
      />
    </div>
  );
}

/**
 * Talk to us, after the "India Post postcard" design (Figma 2258:9692): on an orange panel, the label, the headline
 * with its last words in italic, a line and the counsellors' number and hours in a dark pill; beside them a peach
 * postcard, with an inner frame line, "Post card" and the title, a tilted V&R 1976 stamp with postmark waves, and the
 * enquiry: name, email, contact number, programme and preferred time, and the site's saffron button to send it. This preview
 * doesn't send enquiries yet; sending shows a note that says so, with the number to call.
 */
export default function Counselling() {
  const [sent, setSent] = useState(false);
  const [lead, accent] = counselling.headline.split(/(?<=our )/);

  return (
    <section id="counselling" aria-labelledby="counselling-title" className="scroll-mt-[76px] bg-white px-10 py-24">
      <div className="ember rounded-[32px]">
        <div className="grid grid-cols-[minmax(0,1fr)_700px] items-center gap-16 px-[70px] py-24 text-white">
          <div className="fade-up">
            <Eyebrow tone="ember">{counselling.eyebrow}</Eyebrow>
            <h2 id="counselling-title" className="mt-6 font-serif text-[64px]/[1.04] tracking-[-0.015em] text-balance">
              {lead}
              <em className="text-glow italic">{accent}</em>
            </h2>
            <p className="mt-6 max-w-[470px] text-[18px]/[27px] font-semibold text-white/95">
              {counselling.description}
            </p>
            <a
              href={contact.phoneHref}
              className="mt-7 inline-flex items-baseline gap-2.5 rounded-[14px] bg-[rgb(43_18_6/0.25)] px-[18px] py-3.5 transition-colors hover:bg-[rgb(43_18_6/0.4)]"
            >
              <span className="font-serif text-[24px]/[26px]">{contact.phone}</span>
              <span className="text-[14px]/[20px] font-semibold text-white/90">· {contact.hours}</span>
            </a>
          </div>

          {/* The postcard. */}
          <div className="fade-up relative rounded-[16px] bg-[#ffefd5] p-9 text-ink-900 shadow-[0_24px_24px_rgb(43_18_5/0.3)]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-3 rounded-[10px] border border-[rgb(204_85_0/0.6)]"
            />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[11px]/[14px] font-semibold tracking-[0.2em] text-[#c50] uppercase">
                  {counselling.card.tag}
                </p>
                <h3 className="mt-1.5 w-[440px] font-serif text-[32px]/[36px]">{counselling.card.title}</h3>
              </div>
              {/* Postmark waves and the stamp. */}
              <div aria-hidden="true" className="-mt-3 -mr-3 flex items-start gap-3">
                <span className="mt-[26px] flex flex-col gap-[7.5px]">
                  {[0, 1, 2].map((i) => (
                    // eslint-disable-next-line @next/next/no-img-element -- a fixed-size SVG ornament
                    <img key={i} src="/images/talk/postmark-wave.svg" alt="" width={88} height={4} />
                  ))}
                </span>
                <span className="relative block h-[104px] w-[88px] -rotate-4">
                  {/* eslint-disable-next-line @next/next/no-img-element -- the stamp's perforated edge */}
                  <img
                    src="/images/talk/stamp-edge.svg"
                    alt=""
                    width={104}
                    height={120}
                    className="absolute top-[-5px] left-[-8px] max-w-none"
                  />
                  <span className="absolute inset-2 flex flex-col items-center justify-center rounded-[2px] bg-[#ec5800]">
                    <span className="font-serif text-[24px]/[26px] text-white">V&amp;R</span>
                    <span className="mt-1.5 text-[10px]/[12px] font-semibold tracking-[0.1em] text-[#f4c430]">
                      1976
                    </span>
                  </span>
                </span>
              </div>
            </div>

            {sent ? (
              <div className="relative mt-8 min-h-[230px] rounded-[14px] bg-white/70 p-7" role="status">
                <p className="font-serif text-[30px]/[1.1]">Thank you.</p>
                <p className="mt-3 max-w-[520px] text-[16px]/[25px] text-muted">
                  This preview doesn’t send enquiries yet, so nobody has been contacted. To speak to a counsellor now,
                  call{" "}
                  <a href={contact.phoneHref} className="font-semibold text-ink-900 underline-offset-4 hover:underline">
                    {contact.phone}
                  </a>{" "}
                  ({contact.hours}).
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-5 text-[15px] font-semibold text-[#c50] underline-offset-4 hover:underline"
                >
                  Fill in the postcard again
                </button>
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setSent(true);
                }}
                className="relative mt-8 grid grid-cols-2 gap-x-4 gap-y-3.5"
              >
                <Field label="Name" htmlFor="talk-name">
                  <input
                    id="talk-name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    className={FIELD}
                  />
                </Field>
                <Field label="Email" htmlFor="talk-email">
                  <input
                    id="talk-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@email.com"
                    className={FIELD}
                  />
                </Field>
                <Field label="Contact number" htmlFor="talk-phone">
                  <input
                    id="talk-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+91"
                    className={FIELD}
                  />
                </Field>
                <Field label="Programme" htmlFor="talk-programme">
                  <Select
                    id="talk-programme"
                    name="programme"
                    placeholder="Pick a programme"
                    options={counselling.programmes}
                  />
                </Field>
                <Field label="Preferred time" htmlFor="talk-time">
                  <Select id="talk-time" name="time" placeholder="Preferred time" options={counselling.times} />
                </Field>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="group/button inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-saffron-500 px-7 text-[16px] font-semibold text-white transition-colors duration-200 hover:bg-saffron-600"
                  >
                    {counselling.card.cta}
                    <ArrowRight
                      width={18}
                      height={18}
                      strokeWidth={1.8}
                      className="transition-transform duration-300 ease-out-soft group-hover/button:translate-x-1"
                    />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
