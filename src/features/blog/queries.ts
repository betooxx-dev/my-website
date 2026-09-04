import "server-only";
import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/routing";
import { BlogService } from "@/services/blog.service";

export const BLOG_CACHE_TAG = "blog-posts";

export const getPublishedPosts = unstable_cache(
  (locale: Locale) => BlogService.getPosts(locale),
  ["published-blog-posts"],
  { revalidate: 60 * 60, tags: [BLOG_CACHE_TAG] },
);

export const getPublishedPost = unstable_cache(
  (locale: Locale, slug: string) => BlogService.getPostBySlug(locale, slug),
  ["published-blog-post"],
  { revalidate: 60 * 60, tags: [BLOG_CACHE_TAG] },
);

export const getRelatedPublishedPosts = unstable_cache(
  (locale: Locale, slug: string) => BlogService.getRelatedPosts(locale, slug),
  ["related-published-blog-posts"],
  { revalidate: 60 * 60, tags: [BLOG_CACHE_TAG] },
);

export const getPublishedTags = unstable_cache(
  (locale: Locale) => BlogService.getAllTags(locale),
  ["published-blog-tags"],
  { revalidate: 60 * 60, tags: [BLOG_CACHE_TAG] },
);
