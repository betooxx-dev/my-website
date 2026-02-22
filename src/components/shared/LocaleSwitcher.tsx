"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const nextLocale = locale === "es" ? "en" : "es";

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      scroll={false}
      className="font-mono text-sm text-white/50 transition-colors hover:text-white"
      aria-label={`Switch to ${nextLocale === "en" ? "English" : "Español"}`}
    >
      {nextLocale.toUpperCase()}
    </Link>
  );
}
