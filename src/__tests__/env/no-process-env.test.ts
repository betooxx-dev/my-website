import { readFileSync } from "node:fs";
import { findSourceFiles, SOURCE_DIR } from "../i18n/helpers";

const ALLOWED_FILE = "src/env.ts";

describe("env — acceso a variables de entorno", () => {
  it("ningún archivo accede a process.env directamente salvo src/env.ts", () => {
    const files = findSourceFiles(SOURCE_DIR, ["__tests__"]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.endsWith(ALLOWED_FILE)) continue;
      const content = readFileSync(file, "utf-8");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (/process\.env\./.test(lines[i])) {
          violations.push(`  ${file}:${i + 1}  →  ${lines[i].trim()}`);
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `\n${violations.length} acceso(s) directos a process.env encontrados:\n${violations.join("\n")}\n\nUsa el objeto env de @/env en su lugar.`,
      );
    }
  });
});
