"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type FormEvent, type ReactNode, useId, useRef, useState } from "react";
import { SelectChevronIcon } from "@/components/icons";
import { Reveal } from "@/components/recitals/Motion";
import { guidance } from "@/data/new-home";
import { cx } from "@/lib/cx";
import { Container, Flower, flowerPrint, Heading } from "./ui";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

type Values = { name: string; phone: string; email: string; programme: string; time: string; question: string };
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = { name: "", phone: "", email: "", programme: "", time: "", question: "" };

/** Every message says what is wrong and how to put it right. */
function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Enter your full name.";
  const digits = v.phone.replace(/[\s()-]/g, "").replace(/^(\+?91)/, "");
  if (!digits) e.phone = "Enter a contact number so our team can call you back.";
  else if (!/^\d{10}$/.test(digits)) e.phone = "Enter a 10-digit number, for example 98765 43210.";
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Check the email address. It should look like name@example.com.";
  if (!v.programme) e.programme = "Choose a programme, or pick “Not sure yet”.";
  if (!v.time) e.time = "Choose when we should call you.";
  if (v.question.length > 600) e.question = "Keep your question under 600 characters.";
  return e;
}

const ORDER: Field[] = ["name", "phone", "email", "programme", "time", "question"];

/*
 * 06 — Counselling and academic guidance.
 *
 * The page's deep-orange band: the darker orange is the one white text passes on, so the
 * reassurance can sit in white at reading size. The form is a plain paper sheet beside it.
 * It validates on blur and on submit, and shows the brief's confirmation once accepted.
 * The site is static, so nothing is sent yet: wiring it to a form service is a later step.
 */
export default function Guidance() {
  return (
    <section id="guidance" aria-labelledby="guidance-title" className="relative isolate overflow-hidden bg-v-orange-600 py-24 text-v-paper lg:py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={flowerPrint("rgba(255,255,255,0.08)", 40)} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_0%_0%,rgba(255,138,43,0.55),transparent_70%)]" />

      <Container className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28">
          <p className="flex items-center gap-2.5 font-v-body text-[13px] font-bold tracking-[0.16em] text-v-paper uppercase">
            <Flower size={12} className="text-v-marigold" />
            {guidance.eyebrow}
          </p>
          <Heading id="guidance-title" className="mt-5 max-w-[15ch] text-v-paper">
            {guidance.heading}
          </Heading>
          <p className="mt-6 max-w-[54ch] font-v-body text-[18px]/[1.6] text-v-paper">{guidance.description}</p>
          <ul className="mt-9 flex flex-col gap-4">
            {guidance.points.map((p) => (
              <li key={p} className="flex items-start gap-3.5 font-v-body text-[17.5px]/[1.45] font-semibold">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-v-ink text-v-orange-400">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6.2 5 8.5l4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <EnquiryForm />
        </Reveal>
      </Container>
    </section>
  );
}

function EnquiryForm() {
  const reduce = useReducedMotion();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  const set = (field: Field) => (e: { target: { value: string } }) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: validate(next)[field] }));
  };
  const blur = (field: Field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(values)[field] }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(values);
    setErrors(found);
    setTouched(Object.fromEntries(ORDER.map((f) => [f, true])));
    const first = ORDER.find((f) => found[f]);
    if (first) {
      // Bring the first problem into view, then focus it. Done in two steps because the
      // smooth-scroll layer does not follow the browser's own focus scrolling.
      const field = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      field?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
      field?.focus({ preventScroll: true });
      return;
    }
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 900);
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setStatus("idle");
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className="relative overflow-hidden rounded-[30px] bg-v-paper text-v-ink shadow-[0_50px_90px_-40px_rgba(58,20,7,0.75)]">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            role="status"
            className="flex min-h-[560px] flex-col items-center justify-center px-8 py-16 text-center sm:px-14"
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <motion.span
              className="grid size-20 place-items-center rounded-full bg-v-orange-500 text-v-ink"
              initial={reduce ? false : { rotate: -90, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            >
              <Flower size={34} />
            </motion.span>
            <p className="mt-7 font-v-head text-[30px]/[1.1] font-extrabold">Thank you for reaching out.</p>
            <p className="mt-3 max-w-[40ch] font-v-body text-[17.5px]/[1.55] text-v-ink-700">
              Your enquiry has been received. Our team will get in touch with you.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 rounded-full px-4 py-2 font-v-body text-[15.5px] font-semibold text-v-orange-600 underline decoration-2 underline-offset-4 hover:text-v-orange-700"
            >
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={submit}
            aria-labelledby={`${id}-title`}
            aria-describedby={`${id}-desc`}
            className="p-6 sm:p-10"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <h3 id={`${id}-title`} className="font-v-head text-[clamp(26px,2.2vw,32px)]/[1.1] font-extrabold">
              {guidance.form.heading}
            </h3>
            <p id={`${id}-desc`} className="mt-2 font-v-body text-[16.5px] text-v-ink-700">
              {guidance.form.description}
            </p>

            <p className="sr-only" aria-live="polite">
              {errorCount ? `${errorCount} ${errorCount === 1 ? "field needs" : "fields need"} attention.` : ""}
            </p>

            <div className="mt-8 grid gap-x-5 gap-y-5 sm:grid-cols-2">
              <FieldShell id={`${id}-name`} label="Full Name" error={errors.name}>
                <input
                  id={`${id}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={set("name")}
                  onBlur={blur("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? `${id}-name-err` : undefined}
                  className={inputClass(!!errors.name)}
                />
              </FieldShell>
              <FieldShell id={`${id}-phone`} label="Contact Number" error={errors.phone}>
                <input
                  id={`${id}-phone`}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={set("phone")}
                  onBlur={blur("phone")}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? `${id}-phone-err` : undefined}
                  className={inputClass(!!errors.phone)}
                />
              </FieldShell>
              <FieldShell id={`${id}-email`} label="Email Address" error={errors.email} wide>
                <input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={set("email")}
                  onBlur={blur("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? `${id}-email-err` : undefined}
                  className={inputClass(!!errors.email)}
                />
              </FieldShell>
              <FieldShell id={`${id}-programme`} label="Programme of Interest" error={errors.programme} wide>
                <SelectBox
                  id={`${id}-programme`}
                  name="programme"
                  value={values.programme}
                  onChange={set("programme")}
                  onBlur={blur("programme")}
                  invalid={!!errors.programme}
                  options={guidance.programmeOptions}
                />
              </FieldShell>
              <FieldShell id={`${id}-time`} label="Preferred Time to Contact" error={errors.time} wide>
                <SelectBox
                  id={`${id}-time`}
                  name="time"
                  value={values.time}
                  onChange={set("time")}
                  onBlur={blur("time")}
                  invalid={!!errors.time}
                  options={guidance.timeOptions}
                />
              </FieldShell>
              <FieldShell id={`${id}-question`} label="Your Question" optional error={errors.question} wide>
                <textarea
                  id={`${id}-question`}
                  name="question"
                  rows={3}
                  value={values.question}
                  onChange={set("question")}
                  onBlur={blur("question")}
                  aria-invalid={!!errors.question}
                  aria-describedby={errors.question ? `${id}-question-err` : undefined}
                  className={cx(inputClass(!!errors.question), "h-auto min-h-[104px] resize-y py-3")}
                />
              </FieldShell>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="group/btn mt-8 inline-flex h-[56px] w-full items-center justify-center gap-3 rounded-full bg-v-orange-500 font-v-body text-[17px] font-bold text-v-ink transition-[background-color,transform] duration-200 ease-v-out hover:bg-v-orange-400 active:scale-[0.98] disabled:cursor-progress disabled:opacity-80"
            >
              {status === "sending" ? (
                <>
                  <span aria-hidden="true" className="size-5 animate-spin rounded-full border-[2.5px] border-v-ink/25 border-t-v-ink" />
                  Sending your request…
                </>
              ) : (
                guidance.form.submit
              )}
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-center font-v-body text-[14px] text-v-ink-500">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              {guidance.form.privacy}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function inputClass(invalid: boolean) {
  return cx(
    "h-[52px] w-full rounded-[14px] border-2 bg-white px-4 font-v-body text-[16.5px] text-v-ink transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-v-ink-500",
    "focus-visible:outline-none focus:border-v-orange-500 focus:shadow-[0_0_0_4px_rgba(244,106,18,0.18)]",
    invalid ? "border-[#b3261e]" : "border-v-line hover:border-v-orange-200",
  );
}

function FieldShell({
  id,
  label,
  error,
  optional,
  wide,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cx("flex flex-col gap-2", wide && "sm:col-span-2")}>
      <label htmlFor={id} className="font-v-body text-[15px] font-semibold text-v-ink">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-v-ink-500">(Optional)</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="flex items-start gap-1.5 font-v-body text-[14px]/[1.4] font-medium text-[#b3261e]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-px shrink-0">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4.75v3.75M8 11h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectBox({
  id,
  name,
  value,
  onChange,
  onBlur,
  invalid,
  options,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  onBlur: () => void;
  invalid: boolean;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-err` : undefined}
        className={cx(inputClass(invalid), "cursor-pointer appearance-none pr-12", !value && "text-v-ink-500")}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="text-v-ink">
            {o}
          </option>
        ))}
      </select>
      <SelectChevronIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-v-ink-700" />
    </div>
  );
}
