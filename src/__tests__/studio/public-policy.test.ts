import { isStudioEnabled } from "@/features/studio/public-policy";

describe("Studio public policy", () => {
  it("is available during local development", () => {
    expect(isStudioEnabled("development")).toBe(true);
    expect(isStudioEnabled("test")).toBe(true);
  });

  it("is unavailable in production", () => {
    expect(isStudioEnabled("production")).toBe(false);
  });
});
