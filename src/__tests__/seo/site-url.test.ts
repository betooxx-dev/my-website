import { resolveSiteUrl } from "@/lib/site-url";

describe("resolveSiteUrl", () => {
  it("prefers an explicitly configured site URL", () => {
    expect(
      resolveSiteUrl({
        configuredUrl: "https://alberto.dev/",
        nodeEnv: "production",
        vercelProductionUrl: "ignored.vercel.app",
      }),
    ).toBe("https://alberto.dev");
  });

  it("uses Vercel's production domain when available", () => {
    expect(
      resolveSiteUrl({
        nodeEnv: "production",
        vercelProductionUrl: "alberto-avendano.vercel.app",
      }),
    ).toBe("https://alberto-avendano.vercel.app");
  });

  it("uses the provisional landing URL for non-Vercel production builds", () => {
    expect(resolveSiteUrl({ nodeEnv: "production" })).toBe(
      "https://alberto-avendano.vercel.app",
    );
  });

  it("keeps localhost for development", () => {
    expect(resolveSiteUrl({ nodeEnv: "development" })).toBe(
      "http://localhost:3000",
    );
  });
});
