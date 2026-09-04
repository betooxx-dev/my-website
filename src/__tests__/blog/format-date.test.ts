import { formatDate } from "@/shared/format";

describe("blog date formatting", () => {
  it("keeps a published calendar date stable across server and browser timezones", () => {
    expect(formatDate("2026-07-19T00:30:00.000Z", "es")).toBe("19 jul 2026");
    expect(formatDate("2026-07-19T00:30:00.000Z", "en")).toBe("Jul 19, 2026");
  });
});
