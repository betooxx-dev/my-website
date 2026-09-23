import {
  getPublicBlogRedirect,
  isPublicBlogEnabled,
} from "@/features/blog/public-policy";

describe("public blog policy", () => {
  it("keeps the public blog available in every environment", () => {
    expect(isPublicBlogEnabled("development")).toBe(true);
    expect(isPublicBlogEnabled("test")).toBe(true);
    expect(isPublicBlogEnabled("production")).toBe(true);
    expect(getPublicBlogRedirect("/es/blog/post", "development")).toBeNull();
  });

  it.each(["/es/blog", "/es/blog/", "/en/blog/a-post", "/studio/blog"])(
    "does not redirect %s",
    (pathname) => {
      expect(getPublicBlogRedirect(pathname, "production")).toBeNull();
    },
  );
});
