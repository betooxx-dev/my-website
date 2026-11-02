import { localizedPath } from "@/i18n/paths";

describe("public locale paths", () => {
  it.each([
    ["es", "/", "/"],
    ["en", "/", "/en"],
    ["es", "/blog", "/blog"],
    ["en", "/blog/post", "/en/blog/post"],
  ] as const)("maps %s %s to %s", (locale, path, expected) => {
    expect(localizedPath(locale, path)).toBe(expected);
  });
});
