import { shouldBypassImageOptimization } from "@/features/blog/image-policy";

describe("blog image policy", () => {
  it("lets the browser load local Argos assets directly during end-to-end work", () => {
    expect(
      shouldBypassImageOptimization(
        "http://localhost:5000/api/blog/assets/example",
      ),
    ).toBe(true);
    expect(
      shouldBypassImageOptimization(
        "http://127.0.0.1:5000/api/blog/assets/example",
      ),
    ).toBe(true);
    expect(
      shouldBypassImageOptimization(
        "https://assets.example.com/blog/example.webp",
      ),
    ).toBe(false);
  });
});
