import NewHomePage, { newHomeMetadata } from "@/components/new-home/NewHomePage";

export const metadata = newHomeMetadata;

/* The address the new homepage was first shared under. Same page as "/". */
export default function Page() {
  return <NewHomePage />;
}
