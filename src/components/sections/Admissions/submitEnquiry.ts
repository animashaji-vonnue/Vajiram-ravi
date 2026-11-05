/** What the "Talk to us" postcard sends. */
export type EnquiryValues = {
  name: string;
  email: string;
  /** The 10 digits after +91. */
  phone: string;
  programme: string;
  time: string;
};

/** About how long a real send takes, so the loading state shows as it will. */
const FAKE_SEND_MS = 900;

/**
 * Sends an enquiry from the postcard form. The site is static and nothing is sent yet: this waits about
 * 900ms and resolves. Plug the real endpoint in here, e.g. Netlify Forms (POST the values, url-encoded with
 * `form-name`, to "/"; the static export also needs a hidden copy of the form for Netlify to detect).
 * It must reject when the enquiry did not go through: the form then keeps every value and shows an error
 * above Submit.
 */
export async function submitEnquiry(values: EnquiryValues): Promise<void> {
  void values;
  await new Promise((resolve) => setTimeout(resolve, FAKE_SEND_MS));
}
