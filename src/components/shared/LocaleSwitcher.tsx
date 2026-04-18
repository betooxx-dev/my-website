"use client";

import { useLocale } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const listboxId = `${buttonId}-listbox`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLocaleSelect = (nextLocale: (typeof routing.locales)[number]) => {
    if (nextLocale !== currentLocale) {
      router.replace(pathname, { locale: nextLocale });
    }
    setIsOpen(false);
  };

  return (
    <div ref={switcherRef} className="relative">
      <button
        type="button"
        id={buttonId}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-mint-50/20 bg-pine-900/55 px-3 py-1.5 transition-colors hover:border-mint-50/35 focus:border-mint-50/40 focus:outline-none"
      >
        <span className="font-mono text-sm text-mint-50/75">
          {currentLocale.toUpperCase()}
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={`h-3.5 w-3.5 text-mint-50/70 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className={`absolute right-0 z-20 mt-2 w-44 rounded-2xl border border-mint-50/20 bg-pine-900/95 p-1 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all ${isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
      >
        <div id={listboxId} role="listbox" aria-labelledby={buttonId}>
          {routing.locales.map((optionLocale) => {
            const isSelected = optionLocale === currentLocale;

            return (
              <button
                key={optionLocale}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleLocaleSelect(optionLocale)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors ${isSelected ? "bg-mint-50 text-pine-900" : "text-mint-50/85 hover:bg-pine-700 hover:text-mint-50"}`}
              >
                <span className="text-sm font-medium">
                  {localeLabels[optionLocale]}
                </span>
                <span className="font-mono text-xs">
                  {optionLocale.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
