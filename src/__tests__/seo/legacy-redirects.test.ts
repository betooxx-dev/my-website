import {
  getRedirectUrl,
  unstable_getResponseFromNextConfig,
} from "next/experimental/testing/server";
import nextConfig from "../../../next.config";

describe("legacy Spanish URLs", () => {
  it.each([
    ["/es", "/"],
    ["/es/blog", "/blog"],
    [
      "/es/blog/disenar-software-tranquilo?source=legacy",
      "/blog/disenar-software-tranquilo?source=legacy",
    ],
  ])("permanently redirects %s to %s", async (path, target) => {
    const response = await unstable_getResponseFromNextConfig({
      nextConfig,
      url: `https://example.test${path}`,
    });
    expect(response.status).toBe(308);
    expect(getRedirectUrl(response)).toBe(`https://example.test${target}`);
  });
});
