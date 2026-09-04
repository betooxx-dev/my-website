import { readFileSync } from "node:fs";

describe("blog post SEO", () => {
  const source = readFileSync("src/app/[locale]/blog/[slug]/page.tsx", "utf8");

  it("declares canonical and article metadata", () => {
    expect(source).toContain("alternates: { canonical: path }");
    expect(source).toContain('type: "article"');
    expect(source).toContain("publishedTime: post.publishedAt");
    expect(source).toContain("modifiedTime: post.updatedAt");
  });

  it("renders escaped BlogPosting structured data", () => {
    expect(source).toContain('"@type": "BlogPosting"');
    expect(source).toContain('type="application/ld+json"');
    expect(source).toContain('.replace(/</g, "\\\\u003c")');
  });
});
