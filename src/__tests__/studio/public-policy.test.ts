import { isStudioEnabled } from "@/features/studio/public-policy";

describe("Studio public policy", () => {
  it("is unavailable while posts are managed in Git", () => {
    expect(isStudioEnabled("development")).toBe(false);
    expect(isStudioEnabled("test")).toBe(false);
  });

  it("is unavailable in production", () => {
    expect(isStudioEnabled("production")).toBe(false);
  });
});
