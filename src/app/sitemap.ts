import type { MetadataRoute } from "next";
import { env } from "@/env";
import { isPublicBlogEnabled } from "@/features/blog/public-policy";
import { getPublishedPosts } from "@/features/blog/queries";
import { blogSitemapEntries } from "@/features/blog/sitemap";
import { localizedPath } from "@/i18n/paths";
import { locales } from "@/i18n/routing";

const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
const staticRoutes =
  isPublicBlogEnabled(env.NODE_ENV) && env.SHOW_DEMO_BLOG_POSTS !== "true"
    ? (["", "/blog"] as const)
    : ([""] as const);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${base}${localizedPath(locale, route || "/")}`,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((l) => [l, `${base}${localizedPath(l, route || "/")}`]),
          ),
          "x-default": `${base}${localizedPath("es", route || "/")}`,
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
        } catch {
          console.error("Blog sitemap request failed", { locale });
          return [];
        }
      }),
    )
  ).flat();

  return [
    ...staticEntries,
    ...blogSitemapEntries(
      base,
      posts.filter((post) => !post.demo),
    ),
  ];
}
