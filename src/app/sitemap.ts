import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://betooxx.com";
const locales = ["es", "en"] as const;

const staticRoutes = ["", "/blog", "/now"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${base}/${locale}${route}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${base}/${l}${route}`]),
        ),
      },
    })),
  );
}
