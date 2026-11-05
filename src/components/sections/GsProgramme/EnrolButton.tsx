"use client";

import { requestEnquiry } from "@/components/sections/Admissions/enquiry";
import Cta from "@/components/ui/Cta";

/** "Enrol in the GS programme": the large primary button, which opens the enquiry form with the programme chosen. */
export default function EnrolButton({ label, programme }: { label: string; programme: string }) {
  return (
    <Cta variant="primary" size="lg" onClick={() => requestEnquiry(programme)}>
      {label}
    </Cta>
  );
}
