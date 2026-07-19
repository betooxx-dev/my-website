import { isStudioSubmitIntentPending } from "@/lib/studio-submit";

describe("studio submit state", () => {
  it("announces progress only on the button that submitted the form", () => {
    expect(isStudioSubmitIntentPending(true, "publish", "publish")).toBe(true);
    expect(isStudioSubmitIntentPending(true, "publish", "save")).toBe(false);
    expect(isStudioSubmitIntentPending(false, "publish", "publish")).toBe(
      false,
    );
  });

  it("keeps single-submit forms compatible without an explicit intent", () => {
    expect(isStudioSubmitIntentPending(true, null, undefined)).toBe(true);
  });
});
