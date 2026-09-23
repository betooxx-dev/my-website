import { readFileSync } from "node:fs";
import ts from "typescript";
import { findSourceFiles, relPath, SOURCE_DIR } from "./helpers";

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

/** Inspect JSX nodes rather than confusing TypeScript generics with tags. */
function findHardcodedStrings(
  content: string,
  filePath: string,
): HardcodedString[] {
  const results: HardcodedString[] = [];

  const source = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  function record(node: ts.Node, text: string, kind: HardcodedString["kind"]) {
    if (!isHumanReadableText(text)) return;
    const line =
      source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
    results.push({ file: filePath, line, text: text.trim(), kind });
  }
  function visit(node: ts.Node) {
    if (ts.isJsxText(node)) record(node, node.text, "jsx-text");
    if (
      ts.isJsxAttribute(node) &&
      USER_VISIBLE_ATTRS.includes(node.name.getText(source)) &&
      node.initializer &&
      ts.isStringLiteral(node.initializer)
    ) {
      record(node, node.initializer.text, "attr");
    }
    ts.forEachChild(node, visit);
  }
  visit(source);

  return results;
}

// ─── Error formatting ─────────────────────────────────────────────────────────

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

test("JSX copy scanner distinguishes refs from visible strings", () => {
  expect(
    findHardcodedStrings(
      "const first = useRef<HTMLButtonElement>(null); const second = useRef<HTMLDialogElement>(null);",
      "refs.tsx",
    ),
  ).toEqual([]);
  expect(
    findHardcodedStrings("<p>Texto visible {value}</p>", "copy.tsx"),
  ).toEqual([
    expect.objectContaining({ text: "Texto visible", kind: "jsx-text" }),
  ]);
});
