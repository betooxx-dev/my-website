import { env } from "@/env";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

export type BlogComment = {
  id: string;
  author: string;
  date: string;
  body: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  tags: string[];
  cover: string;
  featured?: boolean;
  rating: number;
  ratingCount: number;
  related: string[];
  comments: BlogComment[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

function blogUrl(path: string) {
  const baseUrl =
    typeof window === "undefined"
      ? env.ARGOS_API_URL
      : env.NEXT_PUBLIC_ARGOS_API_URL;
  return `${baseUrl}${path}`;
}

async function readBlogApi<T>(path: string): Promise<T> {
  const response = await fetch(blogUrl(path), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Blog API request failed: ${response.status}`);
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
  } catch {
    return undefined;
  }
}

export async function getRelatedPosts(locale: Locale, slug: string) {
  return readBlogApi<BlogPost[]>(`/blog/posts/${locale}/${slug}/related`);
}

export async function getAllTags(locale: Locale) {
  return readBlogApi<string[]>(`/blog/tags?locale=${locale}`);
}

export async function getAllBlogStaticParams() {
  const postsByLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      try {
        return { locale, posts: await getBlogPosts(locale) };
      } catch {
        return { locale, posts: [] };
      }
    }),
  );

  return postsByLocale.flatMap(({ locale, posts }) =>
    posts.map((post) => ({ locale, slug: post.slug })),
  );
}

export async function submitBlogComment(
  locale: Locale,
  slug: string,
  comment: { author: string; body: string },
) {
  return writeBlogApi<BlogComment>(`/blog/posts/${locale}/${slug}/comments`, {
    author: comment.author,
    body: comment.body,
  });
}

export async function submitBlogRating(
  locale: Locale,
  slug: string,
  rating: { value: number; fingerprint?: string },
) {
  return writeBlogApi<{ rating: number; ratingCount: number }>(
    `/blog/posts/${locale}/${slug}/ratings`,
    rating,
  );
}

export async function recommendBlogPost(
  locale: Locale,
  slug: string,
  recommendation: { fingerprint?: string },
) {
  return writeBlogApi<{ recommended: true }>(
    `/blog/posts/${locale}/${slug}/recommendations`,
    recommendation,
  );
}

async function writeBlogApi<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(blogUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Blog API request failed: ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;
  return payload.data;
}
