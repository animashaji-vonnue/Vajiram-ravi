"use client";

import Cta from "@/components/ui/Cta";
import { requestEnquiry } from "./enquiry";

/** "Get Expert Guidance" beside the postcard: it puts the focus in the form's first empty field. */
export default function GuidanceButton({ label }: { label: string }) {
  return (
    <Cta variant="primary-dark" size="lg" onClick={() => requestEnquiry()}>
      {label}
    </Cta>
  );
}
