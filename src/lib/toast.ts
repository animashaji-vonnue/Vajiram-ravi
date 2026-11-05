const TOAST_EVENT = "vr:toast";

/** Shows a short status message in the page toast. Safe to call from any client component. */
export function showToast(message: string): void {
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }));
}

export function subscribeToToasts(handler: (message: string) => void): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<string>).detail);
  window.addEventListener(TOAST_EVENT, listener);
  return () => window.removeEventListener(TOAST_EVENT, listener);
}
