const ENQUIRY_EVENT = "vr:enquire";

/**
 * Brings the counselling postcard form into view and puts the focus in its first empty field. With a
 * `programme` (e.g. from a batch ticket's "Register now") it also chooses that programme in "Programme of
 * Interest". Safe to call from any client component.
 */
export function requestEnquiry(programme?: string): void {
  window.dispatchEvent(new CustomEvent<string | undefined>(ENQUIRY_EVENT, { detail: programme }));
}

export function onEnquiryRequest(handler: (programme: string | undefined) => void): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<string | undefined>).detail);
  window.addEventListener(ENQUIRY_EVENT, listener);
  return () => window.removeEventListener(ENQUIRY_EVENT, listener);
}
