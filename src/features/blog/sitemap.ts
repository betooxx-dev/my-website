import type { MetadataRoute } from "next";
import type { BlogPost } from "@/contracts";

type BlogSitemapPost = Pick<BlogPost, "locale" | "slug" | "updatedAt">;

export function blogSitemapEntries(
  baseUrl: string,
  posts: BlogSitemapPost[],
): MetadataRoute.Sitemap {
  const base = baseUrl.replace(/\/+$/, "");

  return posts.map((post) => ({
    url: `${base}/${post.locale}/blog/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post.updatedAt),
  }));
}
