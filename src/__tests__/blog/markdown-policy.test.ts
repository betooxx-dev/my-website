import { safeMarkdownUrl } from "@/components/features/blog/markdown-policy";

describe("blog Markdown URL policy", () => {
  it("allows useful links and uploaded images while rejecting executable URLs", () => {
    expect(safeMarkdownUrl("https://example.com", "href")).toBe(
      "https://example.com",
    );
    expect(safeMarkdownUrl("mailto:hello@example.com", "href")).toBe(
      "mailto:hello@example.com",
    );
    expect(safeMarkdownUrl("/api/blog/assets/asset-id", "src")).toBe(
      "/api/blog/assets/asset-id",
    );
    expect(safeMarkdownUrl("//evil.example/asset.png", "src")).toBe("");
    expect(safeMarkdownUrl("#not-an-image", "src")).toBe("");
    expect(safeMarkdownUrl("javascript:alert('no')", "href")).toBe("");
    expect(safeMarkdownUrl("data:text/html;base64,bm8=", "src")).toBe("");
  });

  it("passes safe external image URLs through the renderer policy", () => {
    const externalImage = "https://cdn.example.com/architecture.webp";

    expect(safeMarkdownUrl(externalImage, "src")).toBe(externalImage);
  });
});
