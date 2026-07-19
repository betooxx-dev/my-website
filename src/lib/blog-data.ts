import { env } from "@/env";
import type { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

export type BlogPost = {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  date: string;
  publishedAt: string;
  readingTimeMinutes: number;
  category: string;
  tags: string[];
  cover: string;
  coverAssetId: string;
  featured: boolean;
  status: "published";
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

class BlogApiError extends Error {
  constructor(readonly status: number) {
    super(`Blog API request failed: ${status}`);
  }
}

function blogUrl(path: string) {
  const baseUrl =
    typeof window === "undefined"
      ? env.ARGOS_API_URL
      : env.NEXT_PUBLIC_ARGOS_API_URL;
  return `${baseUrl}${path}`;
}

async function readBlogApi<T>(path: string): Promise<T> {
  const response = await fetch(blogUrl(path), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new BlogApiError(response.status);
  }

  const payload = (await response.json()) as ApiResponse<T>;
  return payload.data;
}

export async function getBlogPosts(locale: Locale) {
  return readBlogApi<BlogPost[]>(`/blog/posts?locale=${locale}`);
}

export async function getPostBySlug(locale: Locale, slug: string) {
  try {
    return await readBlogApi<BlogPost>(`/blog/posts/${locale}/${slug}`);
  } catch (error) {
    if (error instanceof BlogApiError && error.status === 404) return undefined;
    throw error;
  }
}

export async function getRelatedPosts(locale: Locale, slug: string) {
  return readBlogApi<BlogPost[]>(`/blog/posts/${locale}/${slug}/related`);
}

export async function getAllTags(locale: Locale) {
  return readBlogApi<string[]>(`/blog/tags?locale=${locale}`);
}
