import { type Locale, routing } from "./routing";

export function localizedPath(locale: Locale, path = "/"): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return path === "/" ? prefix || "/" : `${prefix}${path}`;
}
