"use client";

import { useLocale } from "next-intl";
import type { ChangeEvent } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<(typeof routing.locales)[number], string> = {
  es: "Español",
  en: "English",
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = locale as (typeof routing.locales)[number];
  const languageLabel = currentLocale === "es" ? "Idioma" : "Language";

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as (typeof routing.locales)[number];

    if (nextLocale !== currentLocale) {
      router.replace(pathname, { locale: nextLocale });
    }
  }

  return (
    <label className="relative block min-w-0 shrink-0">
      <span className="sr-only">{languageLabel}</span>
      <select
        aria-label={languageLabel}
        className="w-[105px] max-w-full appearance-none rounded-full border border-mint-50/20 bg-pine-900/55 py-1.5 pl-3 pr-7 font-mono text-sm text-mint-50/75 transition-colors hover:border-mint-50/35 focus:border-mint-50/40 focus:outline-none focus:ring-2 focus:ring-amber-300/50 sm:w-auto sm:pr-8"
        onChange={handleChange}
        value={currentLocale}
      >
        {routing.locales.map((optionLocale) => (
          <option key={optionLocale} value={optionLocale}>
            {localeLabels[optionLocale]}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-mint-50/70"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
      </svg>
    </label>
  );
}
