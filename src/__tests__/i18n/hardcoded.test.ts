import { readFileSync } from "node:fs";
import { findSourceFiles, SOURCE_DIR } from "./helpers";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HardcodedString {
  file: string;
  line: number;
  text: string;
  kind: "jsx-text" | "attr";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const USER_VISIBLE_ATTRS = ["alt", "placeholder", "title", "aria-label"];

// ─── Detection ────────────────────────────────────────────────────────────────

/**
 * Returns true if the string looks like human-readable UI text that should go
 * through the translation system instead of being hardcoded.
 *
 * Heuristic: must contain a letter, not be an email/URL, and have at least
 * two whitespace-separated words. Requiring multiple words avoids false
 * positives from name fragments (e.g. "vendaño" from `<span>A</span>vendaño`)
 * or single technical abbreviations.
 */
function isHumanReadableText(text: string): boolean {
  const t = text.trim();
  if (t.length < 3) return false;
  if (!/[a-zA-ZáéíóúñüàèìòùâêîôûäëïöüçÁÉÍÓÚÑÜ]/.test(t)) return false;
  if (t.includes("@")) return false;
  if (/^[/\\]/.test(t) || /^https?:\/\//.test(t)) return false;
  return /\S+\s+\S+/.test(t);
}

/**
 * Scans a TSX file for hardcoded human-readable strings:
 *
 * 1. JSX text nodes — text between `>` and `<` (single or multi-line).
 *    Uses a multiline regex so that patterns like:
 *      <span>
 *        En progreso
 *      </span>
 *    are also detected.
 *
 * 2. User-visible attributes — `alt`, `placeholder`, `title`, `aria-label`
 *    with string literal values.
 */
function findHardcodedStrings(
  content: string,
  filePath: string,
): HardcodedString[] {
  const results: HardcodedString[] = [];

  // ── JSX text nodes ──────────────────────────────────────────────────────────
  // Matches text between > and < that doesn't contain JSX/JS delimiters.
  // The character class [^<{}>] already matches newlines, so no `s` flag needed.
  const jsxTextRegex = />([^<{}>]+)</g;

  for (const match of content.matchAll(jsxTextRegex)) {
    const text = match[1].trim();
    if (!isHumanReadableText(text)) continue;

    // Point to the line where the visible text starts (first non-whitespace char)
    const offsetToText = (match.index ?? 0) + 1 + match[1].search(/\S/);
    const line = content.slice(0, offsetToText).split("\n").length;

    results.push({ file: filePath, line, text, kind: "jsx-text" });
  }

  // ── User-visible attributes ─────────────────────────────────────────────────
  const attrPattern = `(?:${USER_VISIBLE_ATTRS.join("|")})=["']([^"']+)["']`;
  const attrRegex = new RegExp(attrPattern, "g");
  const lines = content.split("\n");

  for (const [idx, line] of lines.entries()) {
    for (const [, text] of line.matchAll(attrRegex)) {
      if (isHumanReadableText(text)) {
        results.push({ file: filePath, line: idx + 1, text, kind: "attr" });
      }
    }
  }

  return results;
}

// ─── Error formatting ─────────────────────────────────────────────────────────

function relPath(absolute: string): string {
  return absolute.replace(`${process.cwd()}/`, "");
}

function formatError(findings: HardcodedString[]): string {
  const items = findings
    .map(
      ({ file, line, text, kind }) =>
        `  • [${kind}] "${text}"  →  ${relPath(file)}:${line}`,
    )
    .join("\n");

  return `\n${findings.length} string(s) hardcodeado(s) encontrado(s):\n${items}\n\nUsa el sistema de traducciones (t("clave")) en lugar de texto literal.\n`;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("i18n — strings hardcodeados en TSX", () => {
  const tsxFiles = findSourceFiles(SOURCE_DIR, [
    "__tests__",
    "messages",
  ]).filter((f) => f.endsWith(".tsx"));

  it("se encontraron archivos TSX para analizar", () => {
    expect(tsxFiles.length).toBeGreaterThan(0);
  });

  it("no hay strings visibles para el usuario hardcodeados en JSX", () => {
    const findings = tsxFiles.flatMap((f) =>
      findHardcodedStrings(readFileSync(f, "utf-8"), f),
    );

    if (findings.length > 0) throw new Error(formatError(findings));
  });
});
