import type { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

const dateLocales: Record<Locale, string> = {
  en: "en-US",
  es: "es-MX",
};

export function formatDate(date: string, locale: Locale) {
  return new Date(date).toLocaleDateString(dateLocales[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
