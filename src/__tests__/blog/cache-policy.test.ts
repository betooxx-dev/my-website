import { readFileSync } from "node:fs";

describe("blog cache policy", () => {
  it("caches Argos reads and invalidates them after Studio mutations", () => {
    const queries = readFileSync("src/features/blog/queries.ts", "utf8");
    const actions = readFileSync("src/app/studio/blog/actions.ts", "utf8");

    expect(queries).toContain("unstable_cache");
    expect(queries).toContain('BLOG_CACHE_TAG = "blog-posts"');
    expect(queries).toContain("revalidate: 60 * 60");
    expect(actions).toContain("updateTag(BLOG_CACHE_TAG)");
  });
});
