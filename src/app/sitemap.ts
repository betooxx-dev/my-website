import type { MetadataRoute } from "next";
import { env } from "@/env";
import { isPublicBlogEnabled } from "@/features/blog/public-policy";
import { getPublishedPosts } from "@/features/blog/queries";
import { blogSitemapEntries } from "@/features/blog/sitemap";
import { locales } from "@/i18n/routing";

const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
const staticRoutes = isPublicBlogEnabled(env.NODE_ENV)
  ? (["", "/blog"] as const)
  : ([""] as const);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${base}/${locale}${route}`,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((l) => [l, `${base}/${l}${route}`]),
          ),
          "x-default": route ? `${base}/es${route}` : base,
        },
      },
    })),
  );

  if (!isPublicBlogEnabled(env.NODE_ENV)) return staticEntries;

  const posts = (
    await Promise.all(
      locales.map(async (locale) => {
        try {
          return await getPublishedPosts(locale);
        } catch (error) {
          console.error(
            `No se pudo generar el sitemap del blog (${locale}).`,
            error,
          );
          return [];
        }
      }),
    )
  ).flat();

  return [...staticEntries, ...blogSitemapEntries(base, posts)];
}
