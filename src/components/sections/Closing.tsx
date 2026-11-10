import { Phone } from "iconoir-react";
import { closing, contact } from "@/data/content";
import { Button } from "@/components/ui/Button";

/**
 * The final invitation, on paper, centred like the journey's intro: the closing headline with its last sentence in
 * saffron italic, a line for students and parents, a button to explore the programmes and one to speak to the
 * counsellors, and the counsellors' phone number and hours.
 */
export default function Closing() {
  const [lead, accent] = closing.headline.split(/(?<=\.)\s+/);
  return (
    <section aria-labelledby="closing-title" className="bg-paper py-36">
      <div className="fade-up mx-auto flex w-canvas flex-col items-center px-12 text-center">
        <h2
          id="closing-title"
          className="max-w-[1000px] font-serif text-[88px]/[0.98] tracking-[-0.025em] text-balance text-ink-900"
        >
          {lead} <em className="text-saffron-600 italic">{accent}</em>
        </h2>
        <p className="mt-8 max-w-[560px] text-[19px]/[30px] text-muted">{closing.description}</p>
        <div className="mt-11 flex gap-3">
          <Button href={closing.primary.href}>{closing.primary.label}</Button>
          <Button href={closing.secondary.href} tone="ghost-dark">
            {closing.secondary.label}
          </Button>
        </div>
        <a
          href={contact.phoneHref}
          className="mt-8 inline-flex items-center gap-2.5 text-[15px] text-muted hover:text-ink-900"
        >
          <Phone width={17} height={17} strokeWidth={1.8} className="text-saffron-600" />
          <span className="font-semibold text-ink-900">{contact.phone}</span>
          {contact.hours}
        </a>
      </div>
    </section>
  );
}
