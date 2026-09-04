import { z } from "zod";
import { localeSchema } from "./locale-contract";

export const studioPostSchema = z.object({
  category: z.string(),
  contentMarkdown: z.string(),
  cover: z.string().nullable(),
  coverAssetId: z.string().nullable(),
  createdAt: z.string(),
  excerpt: z.string(),
  featured: z.boolean(),
  id: z.string(),
  locale: localeSchema,
  publishedAt: z.string().nullable(),
  readingTimeMinutes: z.number(),
  slug: z.string(),
  status: z.enum(["draft", "published"]),
  tags: z.array(z.string()),
  title: z.string(),
  updatedAt: z.string(),
});

export const studioAssetSchema = z.object({
  altText: z.string(),
  createdAt: z.string(),
  height: z.number(),
  id: z.string(),
  markdown: z.string(),
  mimeType: z.string(),
  originalName: z.string(),
  sizeBytes: z.number(),
  url: z.string(),
  width: z.number(),
});

export type StudioAsset = z.infer<typeof studioAssetSchema>;
export type StudioPost = z.infer<typeof studioPostSchema>;
export type StudioPostStatus = StudioPost["status"];

export type StudioPostInput = Pick<
  StudioPost,
  | "category"
  | "contentMarkdown"
  | "coverAssetId"
  | "excerpt"
  | "featured"
  | "locale"
  | "slug"
  | "tags"
  | "title"
>;

export type StudioResource<T> =
  | { data: T; status: "available" }
  | { data: T; status: "unauthorized" | "unavailable" };
