import type { MetadataRoute } from "next";
import { env } from "@/env";
import { getBlogPosts } from "@/lib/blog-data";
import { blogSitemapEntries } from "@/lib/blog-sitemap";
import { isPublicBlogEnabled } from "@/lib/public-blog-policy";

const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
const locales = ["es", "en"] as const;

const staticRoutes = isPublicBlogEnabled(env.NODE_ENV)
  ? (["", "/blog", "/now"] as const)
  : (["", "/now"] as const);

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
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

  if (!isPublicBlogEnabled(env.NODE_ENV)) return staticEntries;

  const posts = (
    await Promise.all(
      locales.map(async (locale) => {
        try {
          return await getBlogPosts(locale);
        } catch {
          return [];
        }
      }),
    )
  ).flat();

  return [...staticEntries, ...blogSitemapEntries(base, posts)];
}
