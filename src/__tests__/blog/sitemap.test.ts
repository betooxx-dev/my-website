import { blogSitemapEntries } from "@/features/blog/sitemap";

describe("blog sitemap", () => {
  it("adds every published post with its canonical localized URL", () => {
    const entries = blogSitemapEntries("https://albertocubillas.dev/", [
      {
        locale: "es",
        slug: "automatizaciones-utiles",
        updatedAt: "2026-07-18T16:00:00.000Z",
      },
      {
        locale: "en",
        slug: "useful-automations",
        updatedAt: "2026-07-17T16:00:00.000Z",
      },
    ]);

    expect(entries).toEqual([
      {
        lastModified: new Date("2026-07-18T16:00:00.000Z"),
        url: "https://albertocubillas.dev/es/blog/automatizaciones-utiles",
      },
      {
        lastModified: new Date("2026-07-17T16:00:00.000Z"),
        url: "https://albertocubillas.dev/en/blog/useful-automations",
      },
    ]);
  });
});
