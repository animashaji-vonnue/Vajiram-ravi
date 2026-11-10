"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Phone } from "iconoir-react";
import { contact, counselling } from "@/data/content";
import SectionIntro from "@/components/ui/SectionIntro";
import { cx } from "@/lib/cx";

type Answers = { who?: string; stage?: string; guidance?: string; connect?: string };

const STEP_COUNT = 5;

/** A choice in the enquiry: a wide button that fills with ink once picked. */
function Choice({ label, picked, onPick }: { label: string; picked: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={picked}
      onClick={onPick}
      className={cx(
        "flex h-14 items-center justify-between rounded-[16px] border px-5 text-left text-[16px] font-semibold transition-colors",
        picked
          ? "border-transparent ember-pill text-white"
          : "border-ink-900/15 bg-white text-ink-900 hover:border-ink-900/50",
      )}
    >
      {label}
      <span
        className={cx(
          "flex size-6 items-center justify-center rounded-full border transition-colors",
          picked ? "border-white bg-white" : "border-ink-900/25",
        )}
      >
        {picked && <Check width={14} height={14} strokeWidth={2.4} className="text-saffron-600" />}
      </span>
    </button>
  );
}

/**
 * The enquiry, one question at a time: who is asking, where they are (the options follow the first answer), what
 * they want guidance on, how they'd like to be reached, and then only the details that way of connecting needs.
 * A thin bar shows how far along it is. Enquiries aren't connected to anything yet, so the last step says so.
 */
function Enquiry() {
  const { steps } = counselling;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [sent, setSent] = useState(false);

  const pick = (key: keyof Answers, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value, ...(key === "who" ? { stage: undefined } : {}) }));
    setStep((s) => s + 1);
  };

  const isParent = answers.who === steps.who.options[1];
  const byEmail = answers.connect === "Email";

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const question = [
    steps.who.question,
    steps.stage.question,
    steps.guidance.question,
    steps.connect.question,
    steps.details.question,
  ][step];

  return (
    <div className="flex h-full flex-col rounded-[28px] bg-white p-10 shadow-[0_40px_80px_-50px_rgb(8_17_32/0.6)]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold tracking-[0.16em] text-muted uppercase">
          Step {Math.min(step + 1, STEP_COUNT)} of {STEP_COUNT}
        </p>
        {step > 0 && !sent && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1.5 text-[14px] font-semibold text-ink-900 hover:text-saffron-600"
          >
            <ArrowLeft width={16} height={16} strokeWidth={1.8} />
            Back
          </button>
        )}
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-ink-900/[0.08]">
        <div
          className="h-full rounded-full bg-saffron-500 transition-[width] duration-500 ease-out-soft"
          style={{ width: `${((sent ? STEP_COUNT : step) / STEP_COUNT) * 100}%` }}
        />
      </div>

      {sent ? (
        <div className="stage-in my-auto py-6">
          <p className="font-serif text-[40px]/[1.1] text-ink-900">Thank you.</p>
          <p className="mt-4 text-[17px]/[27px] text-muted">
            This preview doesn’t send enquiries yet, so nobody has been contacted. To speak to a counsellor now, call{" "}
            <a href={contact.phoneHref} className="font-semibold text-ink-900 underline-offset-4 hover:underline">
              {contact.phone}
            </a>{" "}
            ({contact.hours}).
          </p>
        </div>
      ) : (
        <div key={step} className="stage-in mt-10 flex flex-1 flex-col">
          <h3 className="font-serif text-[36px]/[1.1] text-ink-900">{question}</h3>
          <div className="mt-8 flex flex-col gap-3">
            {step === 0 &&
              steps.who.options.map((o) => (
                <Choice key={o} label={o} picked={answers.who === o} onPick={() => pick("who", o)} />
              ))}
            {step === 1 &&
              (isParent ? steps.stage.parent : steps.stage.student).map((o) => (
                <Choice key={o} label={o} picked={answers.stage === o} onPick={() => pick("stage", o)} />
              ))}
            {step === 2 &&
              steps.guidance.options.map((o) => (
                <Choice key={o} label={o} picked={answers.guidance === o} onPick={() => pick("guidance", o)} />
              ))}
            {step === 3 &&
              steps.connect.options.map((o) => (
                <Choice key={o} label={o} picked={answers.connect === o} onPick={() => pick("connect", o)} />
              ))}
            {step === 4 && (
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-2 text-[14px] font-semibold text-ink-900">
                  Your name
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    className="h-14 rounded-[16px] border border-ink-900/15 px-5 text-[16px] font-normal outline-none focus:border-ink-900"
                  />
                </label>
                <label className="flex flex-col gap-2 text-[14px] font-semibold text-ink-900">
                  {byEmail ? "Email" : answers.connect === "WhatsApp" ? "WhatsApp number" : "Phone number"}
                  <input
                    name={byEmail ? "email" : "phone"}
                    type={byEmail ? "email" : "tel"}
                    required
                    autoComplete={byEmail ? "email" : "tel"}
                    placeholder={byEmail ? "" : "+91"}
                    className="h-14 rounded-[16px] border border-ink-900/15 px-5 text-[16px] font-normal outline-none focus:border-ink-900"
                  />
                </label>
                <button
                  type="submit"
                  className="group mt-3 flex h-14 items-center justify-center gap-2 rounded-full bg-saffron-500 text-[16px] font-semibold text-white transition-colors hover:bg-saffron-600"
                >
                  Request a conversation
                  <ArrowRight
                    width={18}
                    height={18}
                    strokeWidth={1.8}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Personalised counselling, on white: on the left the intro (stacked), a preview of the four steps a conversation
 * takes, and the button to start; on the right a photograph of a counselling conversation, which the enquiry takes
 * the place of once started.
 */
export default function Counselling() {
  const [started, setStarted] = useState(false);

  return (
    <section id="counselling" aria-labelledby="counselling-title" className="scroll-mt-[76px] bg-white py-32">
      <div className="mx-auto grid w-canvas grid-cols-[1fr_600px] gap-20 px-12">
        <div className="flex flex-col">
          <SectionIntro id="counselling-title" eyebrow={counselling.eyebrow} headline={counselling.headline} />
          <p className="mt-8 max-w-[560px] text-[19px]/[30px] text-muted">{counselling.description}</p>
          <p className="mt-6 max-w-[560px] border-t border-line pt-5 font-serif text-[24px]/[1.3] text-ink-900 italic">
            {counselling.statement}
          </p>

          {/* What a conversation looks like, step by step. */}
          <ol className="mt-12 grid grid-cols-4 gap-3">
            {counselling.process.map((label, i) => (
              <li key={label} className="relative rounded-[18px] bg-paper px-5 py-5">
                <span className="text-[13px] font-semibold text-saffron-600">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-6 block text-[16px]/[22px] font-semibold text-ink-900">{label}</span>
              </li>
            ))}
          </ol>

          <div className="mt-auto flex items-center gap-8 pt-12">
            {!started && (
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="group inline-flex h-14 items-center gap-2.5 rounded-full bg-saffron-500 px-7 text-[16px] font-semibold text-white transition-colors hover:bg-saffron-600"
              >
                {counselling.cta}
                <ArrowRight
                  width={18}
                  height={18}
                  strokeWidth={1.8}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            )}
            <a href={contact.phoneHref} className="flex items-center gap-3 text-[15px] text-muted">
              <span className="ember-pill flex size-11 items-center justify-center rounded-full text-white">
                <Phone width={18} height={18} strokeWidth={1.8} />
              </span>
              <span>
                <span className="block font-semibold text-ink-900">{contact.phone}</span>
                {contact.hours}
              </span>
            </a>
          </div>
        </div>

        <div className="relative min-h-[640px] overflow-hidden rounded-[32px]">
          <Image
            src={counselling.photo}
            alt="An academic counsellor talking with a student"
            fill
            sizes="600px"
            className="object-cover"
          />
          {started ? (
            <div className="stage-in absolute inset-0 bg-ink-950/45 p-6 backdrop-blur-sm">
              <Enquiry />
            </div>
          ) : (
            <div className="absolute inset-x-6 bottom-6 rounded-[22px] bg-white/90 p-6 backdrop-blur">
              <p className="font-serif text-[26px]/[1.2] text-ink-900">
                Five quick questions, then a real conversation.
              </p>
              <p className="mt-2 text-[15px]/[23px] text-muted">We only ask what we need to help you.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
