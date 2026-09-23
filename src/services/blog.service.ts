import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { type BlogPost, blogPostSchema } from "@/contracts/blog-contract";
import { env } from "@/env";
import type { Locale } from "@/i18n/routing";

export type { BlogPost } from "@/contracts/blog-contract";

const contentRoot = path.join(process.cwd(), "content", "blog");

export async function readLocalPosts(
  locale: Locale,
  showDemoPosts: boolean,
): Promise<BlogPost[]> {
  const directory = path.join(contentRoot, locale);
  let files: string[];
  try {
    files = await readdir(directory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const source = await readFile(path.join(directory, file), "utf8");
        const match = source.match(
          /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/,
        );
        if (!match) throw new Error(`Invalid blog frontmatter: ${file}`);
        const metadata = JSON.parse(match[1]);
        if (metadata.demo === true && !showDemoPosts) {
          return null;
        }
        const slug = file.slice(0, -3);
        const contentMarkdown = match[2].trim();
        const date = metadata.date;
        return blogPostSchema.parse({
          ...metadata,
          id: `${locale}-${slug}`,
          locale,
          slug,
          contentMarkdown,
          cover: metadata.cover,
          coverAssetId: "",
          createdAt: metadata.createdAt ?? date,
          updatedAt: metadata.updatedAt ?? date,
          publishedAt: date,
          readingTimeMinutes: Math.max(
            1,
            Math.ceil(contentMarkdown.split(/\s+/).length / 220),
          ),
          status: "published",
          featured: metadata.featured ?? false,
          tags: metadata.tags ?? [],
        });
      }),
  );

  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

function readPosts(locale: Locale) {
  return readLocalPosts(locale, env.SHOW_DEMO_BLOG_POSTS === "true");
}

export class BlogService {
  static getPosts(locale: Locale) {
    return readPosts(locale);
  }

  static async getPostBySlug(locale: Locale, slug: string) {
    return (await readPosts(locale)).find((post) => post.slug === slug);
  }

  static async getRelatedPosts(locale: Locale, slug: string) {
    return (await readPosts(locale))
      .filter((post) => post.slug !== slug)
      .slice(0, 3);
  }

  static async getCategories(locale: Locale) {
    return [...new Set((await readPosts(locale)).map((post) => post.category))];
  }
}
