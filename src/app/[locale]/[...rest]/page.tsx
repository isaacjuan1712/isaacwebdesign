import { notFound } from "next/navigation";

// Any address that isn't a real page lands here and shows the 404 page
// in the visitor's language (rendered by ../not-found.tsx).
export default function CatchAll() {
  notFound();
}
