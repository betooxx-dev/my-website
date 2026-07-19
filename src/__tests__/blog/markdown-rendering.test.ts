import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MarkdownContent } from "@/components/features/blog/MarkdownContent";

describe("public Markdown rendering", () => {
  it("renders GFM, links and remote images while dropping raw executable HTML", () => {
    const markdown = [
      "# Safe post",
      "",
      "[External link](https://example.com)",
      "",
      "![Architecture](https://cdn.example.com/architecture.webp)",
      "",
      "| Feature | Ready |",
      "| --- | --- |",
      "| Markdown | yes |",
      "",
      "<script>alert('no')</script>",
    ].join("\n");

    const html = renderToStaticMarkup(
      createElement(MarkdownContent, { source: markdown }),
    );

    expect(html).toContain("<h1");
    expect(html).toContain("<table");
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('src="https://cdn.example.com/architecture.webp"');
    expect(html).not.toContain("<script");
    expect(html).not.toContain("alert('no')");
  });
});
