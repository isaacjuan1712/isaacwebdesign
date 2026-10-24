import { locale as localeParam } from "next/root-params";
import { notFound } from "next/navigation";
import he from "@/messages/he.json";
import en from "@/messages/en.json";
import { isLocale, type Locale, type Messages } from "./config";

// en.json must have exactly the same shape as he.json; TypeScript flags any missing key.
const typedEn: Messages = en;
export const dictionaries: Record<Locale, Messages> = { he, en: typedEn };

// The current locale for Server Components, read from the [locale] root segment
export async function getLocale(): Promise<Locale> {
  const value = await localeParam();
  if (!value || !isLocale(value)) notFound();
  return value;
}

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
