import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TranslationValue = string | TranslationObject;
export type TranslationObject = { [key: string]: TranslationValue };
export type FlatTranslations = Record<string, string>;

// ─── Path helpers ─────────────────────────────────────────────────────────────

// Normalize to POSIX separators so assertions like `file.endsWith("src/env.ts")`
// and `path.replace(cwd + "/", "")` work the same on Windows and macOS/Linux.
const toPosix = (p: string): string => p.replace(/\\/g, "/");

export const CWD = toPosix(process.cwd());

export function relPath(absolute: string): string {
  return toPosix(absolute).replace(`${CWD}/`, "");
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const SOURCE_LOCALE = "es";
export const MESSAGES_DIR = toPosix(join(process.cwd(), "src/messages"));
export const SOURCE_DIR = toPosix(join(process.cwd(), "src"));

// ─── JSON loaders ─────────────────────────────────────────────────────────────

export function loadLocale(locale: string): TranslationObject {
  const path = join(MESSAGES_DIR, `${locale}.json`);
  return JSON.parse(readFileSync(path, "utf-8")) as TranslationObject;
}

export function loadLocaleRaw(locale: string): string {
  return readFileSync(join(MESSAGES_DIR, `${locale}.json`), "utf-8");
}

export function getTargetLocales(): string[] {
  return readdirSync(MESSAGES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .filter((locale) => locale !== SOURCE_LOCALE);
}

// ─── Key utilities ────────────────────────────────────────────────────────────

export function flattenKeys(
  obj: TranslationObject,
  prefix = "",
): FlatTranslations {
  const result: FlatTranslations = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      const nested = flattenKeys(value as TranslationObject, path);
      for (const [k, v] of Object.entries(nested)) result[k] = v;
    } else {
      result[path] = value as string;
    }
  }
  return result;
}

/**
 * Finds the approximate line number of a key in raw JSON content.
 * Uses the last key segment; may be approximate for repeated leaf names (e.g. "title"),
 * but the full dot-notation `key` path always provides precise semantic location.
 */
export function findKeyLine(raw: string, key: string): number {
  const segments = key.split(".");
  const leaf = segments[segments.length - 1];
  const lines = raw.split("\n");
  const index = lines.findIndex((line) =>
    new RegExp(`"${leaf}"\\s*:`).test(line),
  );
  return index + 1; // 1-indexed; 0 if not found
}

// ─── Source file discovery ────────────────────────────────────────────────────

export function findSourceFiles(
  dir: string,
  excludeDirs: string[] = [],
): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    if (excludeDirs.includes(entry)) return [];
    if (statSync(fullPath).isDirectory())
      return findSourceFiles(fullPath, excludeDirs);
    if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith(".d.ts"))
      return [toPosix(fullPath)];
    return [];
  });
}
