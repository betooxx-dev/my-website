import { siteProfile } from "@/config/site-profile";
import { blogSeoFields } from "@/features/blog/seo";

describe("Blog SEO fields shared with Studio", () => {
  it("uses title, excerpt, locale, slug and cover alt without replacing editorial copy", () => {
    expect(
      blogSeoFields(
        {
          title: "Aprender",
          excerpt: "Descripción real",
          locale: "en",
          slug: "learn",
          coverAlt: "Una biblioteca",
        },
        "https://example.com/",
      ),
    ).toEqual({
      title: "Aprender",
      searchTitle: `Aprender | ${siteProfile.name}`,
      description: "Descripción real",
      path: "/en/blog/learn",
      url: "https://example.com/en/blog/learn",
      coverAlt: "Una biblioteca",
    });
  });
  it("allows long copy and provides a fallback for legacy covers", () => {
    const title = "Texto largo ".repeat(20);
    const seo = blogSeoFields(
      { title, excerpt: "", locale: "es", slug: "draft" },
      "http://localhost:3000",
    );
    expect(seo.title).toBe(title);
    expect(seo.coverAlt).toBe(title);
    expect(seo.url).toBe("http://localhost:3000/es/blog/draft");
  });
});
