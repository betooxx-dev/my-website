import { blogPostSchema, localeSchema, studioAssetSchema } from "@/contracts";
import { locales } from "@/i18n/routing";

describe("Argos runtime contracts", () => {
  it("shares the configured locale set with every API schema", () => {
    expect(localeSchema.options).toEqual(locales);
  });

  it("accepts a complete published post", () => {
    expect(
      blogPostSchema.safeParse({
        category: "Engineering",
        contentMarkdown: "# Calm software",
        cover: "https://example.com/cover.png",
        coverAssetId: "asset-1",
        createdAt: "2026-09-04T00:00:00.000Z",
        date: "2026-09-04T00:00:00.000Z",
        excerpt: "A short summary",
        featured: true,
        id: "post-1",
        locale: "es",
        publishedAt: "2026-09-04T00:00:00.000Z",
        readingTimeMinutes: 4,
        slug: "calm-software",
        status: "published",
        tags: ["engineering"],
        title: "Calm software",
        updatedAt: "2026-09-04T00:00:00.000Z",
      }).success,
    ).toBe(true);
  });

  it("rejects incomplete API payloads instead of trusting a type cast", () => {
    expect(blogPostSchema.safeParse({ id: "post-1" }).success).toBe(false);
    expect(studioAssetSchema.safeParse({ id: "asset-1" }).success).toBe(false);
  });
});
