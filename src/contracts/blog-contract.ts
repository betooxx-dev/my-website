import { z } from "zod";
import { localeSchema } from "./locale-contract";

export const blogPostSchema = z.object({
  category: z.string(),
  contentMarkdown: z.string(),
  demo: z.boolean().optional(),
  cover: z.string(),
  coverAlt: z.string().optional(),
  coverAssetId: z.string(),
  createdAt: z.string(),
  date: z.string(),
  excerpt: z.string(),
  featured: z.boolean(),
  id: z.string(),
  locale: localeSchema,
  publishedAt: z.string(),
  readingTimeMinutes: z.number(),
  slug: z.string(),
  status: z.literal("published"),
  tags: z.array(z.string()),
  title: z.string(),
  updatedAt: z.string(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;
