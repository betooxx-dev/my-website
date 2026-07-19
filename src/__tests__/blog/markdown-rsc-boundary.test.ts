import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("Markdown image RSC boundary", () => {
  it("keeps the custom Next image loader inside a Client Component", () => {
    const serverRenderer = readFileSync(
      join(process.cwd(), "src/components/features/blog/MarkdownContent.tsx"),
      "utf8",
    );
    const clientImage = readFileSync(
      join(process.cwd(), "src/components/features/blog/MarkdownImage.tsx"),
      "utf8",
    );

    expect(serverRenderer).not.toContain("loader={markdownImageLoader}");
    expect(clientImage.trimStart()).toMatch(/^"use client";/);
    expect(clientImage).toContain("loader={markdownImageLoader}");
  });
});
