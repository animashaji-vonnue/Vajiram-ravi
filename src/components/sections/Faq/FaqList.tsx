"use client";

import { useState } from "react";
import type { FaqEntry } from "@/data/faq-chat";
import FaqAccordion from "./FaqAccordion";

/** The accordion's state: one question open at a time, the first open to start with. */
export default function FaqList({ entries }: { entries: FaqEntry[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex flex-col">
      <FaqAccordion entries={entries} open={open} onToggle={(index) => setOpen((current) => (current === index ? null : index))} />
    </div>
  );
}
