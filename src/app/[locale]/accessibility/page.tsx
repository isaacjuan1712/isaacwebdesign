import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/i18n/metadata";
import { getDictionary } from "@/i18n/server";

// The text of this page lives in src/messages/he.json and en.json, under "accessibility"
export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getDictionary();
  return pageMetadata(locale, t, "/accessibility", { title: t.accessibility.title, description: t.accessibility.description });
}

export default function Page() {
  return <LegalPage page="accessibility" />;
}
