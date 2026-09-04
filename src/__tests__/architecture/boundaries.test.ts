import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { findSourceFiles, relPath, SOURCE_DIR } from "../i18n/helpers";

const importPattern = /from\s+["'](@\/[^"']+)["']/g;

function importsFor(file: string): string[] {
  return [...readFileSync(file, "utf8").matchAll(importPattern)].map(
    (match) => match[1],
  );
}

describe("architecture boundaries", () => {
  const sourceFiles = findSourceFiles(SOURCE_DIR, ["__tests__"]);

  it("does not recreate the ambiguous lib layer", () => {
    const violations = sourceFiles.flatMap((file) =>
      importsFor(file)
        .filter((target) => target.startsWith("@/lib/"))
        .map((target) => `${relPath(file)} -> ${target}`),
    );

    expect(violations).toEqual([]);
  });

  it("keeps shared and contract layers independent from higher layers", () => {
    const restrictedLayers = ["app", "components", "features", "services"];
    const violations = sourceFiles
      .filter((file) => {
        const path = relPath(file);
        return (
          path.startsWith("src/shared/") || path.startsWith("src/contracts/")
        );
      })
      .flatMap((file) =>
        importsFor(file)
          .filter((target) =>
            restrictedLayers.some((layer) => target.startsWith(`@/${layer}/`)),
          )
          .map((target) => `${relPath(file)} -> ${target}`),
      );

    expect(violations).toEqual([]);
  });

  it("keeps services independent from routes and UI", () => {
    const violations = sourceFiles
      .filter((file) => relPath(file).startsWith("src/services/"))
      .flatMap((file) =>
        importsFor(file)
          .filter(
            (target) =>
              target.startsWith("@/app/") || target.startsWith("@/components/"),
          )
          .map((target) => `${relPath(file)} -> ${target}`),
      );

    expect(violations).toEqual([]);
  });

  it("uses the project naming convention in services and contracts", () => {
    const serviceNames = new Set(["api.ts"]);
    const contractName = /-contract\.ts$/;
    const violations = sourceFiles
      .filter((file) => {
        const path = relPath(file);
        if (path.startsWith("src/services/")) {
          const name = basename(file);
          return !serviceNames.has(name) && !name.endsWith(".service.ts");
        }
        if (path.startsWith("src/contracts/")) {
          return (
            basename(file) !== "index.ts" && !contractName.test(basename(file))
          );
        }
        return false;
      })
      .map(relPath);

    expect(violations).toEqual([]);
  });
});
