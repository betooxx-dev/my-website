import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("Markdown image RSC boundary", () => {
  it("keeps markdown image rendering server-compatible", () => {
    const serverRenderer = readFileSync(
      join(process.cwd(), "src/components/features/blog/MarkdownContent.tsx"),
      "utf8",
    );
    const clientImage = readFileSync(
      join(process.cwd(), "src/components/features/blog/MarkdownImage.tsx"),
      "utf8",
    );

    expect(serverRenderer).not.toContain("next/image");
    expect(clientImage.trimStart()).not.toMatch(/^"use client";/);
    expect(clientImage).not.toContain('from "next/image"');
  });
});
