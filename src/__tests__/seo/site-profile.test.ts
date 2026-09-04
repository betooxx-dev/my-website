import { readFileSync } from "node:fs";
import { siteProfile } from "@/config/site-profile";
import { findSourceFiles, relPath, SOURCE_DIR } from "../i18n/helpers";

describe("site profile", () => {
  it("keeps contact details in one source of truth", () => {
    const profilePath = "src/config/site-profile.ts";
    const protectedValues = [
      siteProfile.email,
      ...Object.values(siteProfile.social).map(({ href }) => href),
    ];
    const violations = findSourceFiles(SOURCE_DIR, ["__tests__"])
      .filter((file) => relPath(file) !== profilePath)
      .flatMap((file) => {
        const source = readFileSync(file, "utf8");
        return protectedValues
          .filter((value) => source.includes(value))
          .map((value) => `${relPath(file)} duplicates ${value}`);
      });

    expect(violations).toEqual([]);
  });
});
