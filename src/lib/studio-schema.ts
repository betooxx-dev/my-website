export type StudioPostStatus = "draft" | "published";

export type StudioPost = {
  category: string;
  contentMarkdown: string;
  cover: string | null;
  coverAssetId: string | null;
  createdAt: string;
  excerpt: string;
  featured: boolean;
  id: string;
  locale: "es" | "en";
  publishedAt: string | null;
  readingTimeMinutes: number;
  slug: string;
  status: StudioPostStatus;
  tags: string[];
  title: string;
  updatedAt: string;
};

export type StudioPostInput = {
  category: string;
  contentMarkdown: string;
  coverAssetId: string | null;
  excerpt: string;
  featured: boolean;
  locale: "es" | "en";
  slug: string;
  tags: string[];
  title: string;
};

export type StudioAsset = {
  altText: string;
  createdAt: string;
  height: number;
  id: string;
  markdown: string;
  mimeType: string;
  originalName: string;
  sizeBytes: number;
  url: string;
  width: number;
};

export type StudioResource<T> =
  | { data: T; status: "available" }
  | { data: T; status: "unauthorized" | "unavailable" };
