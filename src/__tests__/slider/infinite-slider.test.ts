import {
  hasDragged,
  normalizeInfiniteScroll,
} from "@/components/shared/infinite-slider";

describe("infinite slider behavior", () => {
  it("wraps scroll position after the first repeated track", () => {
    expect(normalizeInfiniteScroll({ scrollLeft: 124, scrollWidth: 200 })).toBe(
      24,
    );
  });

  it("keeps small pointer movement as a click", () => {
    expect(hasDragged(100, 105)).toBe(false);
  });

  it("treats larger pointer movement as a drag", () => {
    expect(hasDragged(100, 108)).toBe(true);
  });
});
