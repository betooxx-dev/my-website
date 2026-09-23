import { readFileSync } from "node:fs";

describe("blog cache policy", () => {
  it("reads Git-backed posts without the former Argos cache", () => {
    const queries = readFileSync("src/features/blog/queries.ts", "utf8");

    expect(queries).toContain("BlogService.getPosts");
    expect(queries).not.toContain("unstable_cache");
    expect(queries).toContain('BLOG_CACHE_TAG = "blog-posts"');
  });
});
