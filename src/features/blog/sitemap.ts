import type { MetadataRoute } from "next";
import type { BlogPost } from "@/contracts";
import { localizedPath } from "@/i18n/paths";

type BlogSitemapPost = Pick<BlogPost, "locale" | "slug" | "updatedAt">;

export function blogSitemapEntries(
  baseUrl: string,
  posts: BlogSitemapPost[],
): MetadataRoute.Sitemap {
  const base = baseUrl.replace(/\/+$/, "");

  return posts.map((post) => ({
    url: `${base}${localizedPath(post.locale, `/blog/${encodeURIComponent(post.slug)}`)}`,
    lastModified: new Date(post.updatedAt),
  }));
}
