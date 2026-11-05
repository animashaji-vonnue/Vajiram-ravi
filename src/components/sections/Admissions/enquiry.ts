const ENQUIRY_EVENT = "vr:enquire";

/**
 * Brings the "Talk to us" postcard form into view with `programme` chosen in its "Select Programmes"
 * field, e.g. from a batch ticket's "Register now". Safe to call from any client component.
 */
export function requestEnquiry(programme: string): void {
  window.dispatchEvent(new CustomEvent<string>(ENQUIRY_EVENT, { detail: programme }));
}

export function onEnquiryRequest(handler: (programme: string) => void): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<string>).detail);
  window.addEventListener(ENQUIRY_EVENT, listener);
  return () => window.removeEventListener(ENQUIRY_EVENT, listener);
}
