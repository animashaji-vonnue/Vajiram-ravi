/** What the counselling postcard sends. */
export type EnquiryValues = {
  name: string;
  /** The 10 digits after +91. */
  phone: string;
  email: string;
  programme: string;
  /** When to call back: morning, afternoon or evening. */
  time: string;
  /** May be empty. */
  query: string;
};

/** About how long a real send takes, so the loading state shows as it will. */
const FAKE_SEND_MS = 900;

/**
 * Sends a call-back request from the postcard form. The site is static and nothing is sent yet: this waits
 * about 900ms and resolves. Plug the real endpoint in here, e.g. Netlify Forms (POST the values, url-encoded
 * with `form-name`, to "/"; the static export also needs a hidden copy of the form for Netlify to detect).
 * It must reject when the request did not go through: the form then keeps every value and shows an error
 * above the button.
 */
export async function submitEnquiry(values: EnquiryValues): Promise<void> {
  void values;
  await new Promise((resolve) => setTimeout(resolve, FAKE_SEND_MS));
}
