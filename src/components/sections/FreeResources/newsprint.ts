import { Playfair_Display } from "next/font/google";

/**
 * The front page's own face, beside the site's three: Playfair Display, a didone serif in the manner of a
 * broadsheet's headlines, upright and italic. It is used only on the front page's headline, its section
 * heads, the drop cap and the pull-quote (FrontPage); everything else keeps the site's type.
 */
export const newsprint = Playfair_Display({
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});
