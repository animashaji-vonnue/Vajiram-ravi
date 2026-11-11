"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type Ref } from "react";
import { cx } from "@/lib/cx";

type SelectMenuProps = {
  id: string;
  name: string;
  value: string;
  options: string[];
  /** Shown in the box while nothing is chosen (only once its label has risen, see Postcard.css). */
  placeholder: string;
  onChange: (value: string) => void;
  /** The field has been left: the form checks it. */
  onBlur: () => void;
  invalid?: boolean;
  describedBy?: string;
  /** The button, so the form can focus the field. */
  buttonRef?: Ref<HTMLButtonElement>;
  /** The box's classes (the form's BOX and border). */
  className?: string;
};

/**
 * A select drawn in the site's own hand instead of the browser's list (the client: "the dropdown is not
 * styled"): the field's box as a button, and under it a dark ink menu with rounded corners and a soft
 * shadow, its choices in cream, the chosen one marked with a saffron tick and the one under the pointer or
 * the keys lit warm. It opens downward over what follows, settling in from 4px above (150ms).
 *
 * It follows the WAI-ARIA select-only combobox pattern: the button is the combobox and keeps the focus,
 * the list is a listbox whose active option is announced through aria-activedescendant. ↓ ↑ Enter or Space
 * open it; inside it ↓ ↑ Home End move, Enter or Space choose, Escape closes it without choosing, Tab
 * chooses nothing and moves on; typing a letter jumps to the next choice that starts with it. A click away
 * closes it. A hidden input carries the value for a plain form post.
 */
export default function SelectMenu({ id, name, value, options, placeholder, onChange, onBlur, invalid, describedBy, buttonRef, className }: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = `${id}-list`;
  const optionId = (i: number) => `${id}-option-${i}`;

  // A click anywhere else closes it.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const show = (at = Math.max(0, options.indexOf(value))) => {
    setActive(at);
    setOpen(true);
  };
  const choose = (i: number) => {
    const next = options[i];
    if (next !== undefined && next !== value) onChange(next);
    setOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        show();
      }
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((i) => Math.min(last, i + 1));
        return;
      case "ArrowUp":
        event.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        return;
      case "Home":
        event.preventDefault();
        setActive(0);
        return;
      case "End":
        event.preventDefault();
        setActive(last);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        return;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        return;
      case "Tab":
        setOpen(false);
        return;
    }
    if (event.key.length === 1) {
      const key = event.key.toLowerCase();
      const from = active + 1;
      const order = [...options.slice(from), ...options.slice(0, from)];
      const hit = order.findIndex((option) => option.toLowerCase().startsWith(key));
      if (hit >= 0) setActive((from + hit) % options.length);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        onBlur={() => {
          setOpen(false);
          onBlur();
        }}
        className={cx(className, "vr-select flex h-[52px] cursor-pointer items-center pr-10 pl-4 text-left", value ? "text-ink" : "text-[#737373]")}
      >
        <span className="vr-select-value truncate">{value || placeholder}</span>
      </button>
      <span
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-clay [transition:rotate_var(--dur-fast)_var(--ease-out)]",
          open && "rotate-180",
        )}
      >
        <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </span>

      <ul
        id={listId}
        role="listbox"
        aria-labelledby={id}
        className={cx(
          "absolute top-[calc(100%+6px)] right-0 left-0 z-50 overflow-hidden rounded-[14px] bg-[#2a1a12] py-1.5 text-cream shadow-[0_18px_40px_-12px_rgb(20_8_2/0.55)] ring-1 ring-black/10 [transition:opacity_150ms_var(--ease-out),translate_150ms_var(--ease-out),visibility_0s_linear_150ms] motion-reduce:transition-none",
          open ? "visible translate-y-0 opacity-100 [transition-delay:0s]" : "invisible -translate-y-1 opacity-0",
        )}
      >
        {options.map((option, i) => {
          const chosen = option === value;
          return (
            <li
              key={option}
              id={optionId(i)}
              role="option"
              aria-selected={chosen}
              // Keep the focus on the button, so its blur does not close the list before the choice lands.
              onPointerDown={(event) => event.preventDefault()}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={cx(
                "flex cursor-pointer items-center gap-2.5 px-4 py-2.5 text-[15px]/[20px] [transition:background-color_var(--dur-fast)_var(--ease-out)]",
                i === active ? "bg-white/12" : "",
                chosen ? "font-semibold text-white" : "text-cream/90",
              )}
            >
              <span aria-hidden="true" className={cx("w-3.5 shrink-0 text-saffron", !chosen && "invisible")}>
                <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8.5l3.2 3L13 4.5" />
                </svg>
              </span>
              {option}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
