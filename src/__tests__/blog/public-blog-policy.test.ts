import {
  getPublicBlogRedirect,
  isPublicBlogEnabled,
} from "@/lib/public-blog-policy";

describe("public blog production policy", () => {
  it("keeps the public blog available outside production", () => {
    expect(isPublicBlogEnabled("development")).toBe(true);
    expect(isPublicBlogEnabled("test")).toBe(true);
    expect(getPublicBlogRedirect("/es/blog/post", "development")).toBeNull();
  });

  it("disables the public blog in production", () => {
    expect(isPublicBlogEnabled("production")).toBe(false);
  });

  it.each([
    ["/es/blog", "/es"],
    ["/es/blog/", "/es"],
    ["/en/blog/a-post", "/en"],
  ])("redirects %s to its localized landing", (pathname, destination) => {
    expect(getPublicBlogRedirect(pathname, "production")).toBe(destination);
  });

  it.each(["/es", "/en/now", "/studio/blog", "/es/blogroll"])(
    "does not redirect unrelated path %s",
    (pathname) => {
      expect(getPublicBlogRedirect(pathname, "production")).toBeNull();
    },
  );
});
