import { readFileSync } from "node:fs";
import {
  findKeyLine,
  findSourceFiles,
  flattenKeys,
  loadLocale,
  loadLocaleRaw,
  relPath,
  SOURCE_DIR,
  SOURCE_LOCALE,
} from "./helpers";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AggregatedUsage {
  /** Full key paths found in static t("key") calls, mapped to the files that use them. */
  usedKeys: Map<string, string[]>;
  /**
   * Namespaces that contain at least one dynamic call (variable argument or template literal).
   * Keys under these namespaces are excluded from the "unused" check to avoid false positives.
   * e.g. navT(key) in Footer → "navbar" is dynamic.
   */
  dynamicNamespaces: Set<string>;
}

// ─── Usage extraction (SRP) ───────────────────────────────────────────────────

/**
 * Extracts translation key usage from a single file's content.
 *
 * Handles both patterns from next-intl:
 *   const t = await getTranslations("namespace")   → server components
 *   const t = useTranslations("namespace")          → client components
 *
 * Detects dynamic calls (variable or template literal arguments) and marks
 * the namespace so downstream analysis can skip it safely.
 */
function extractUsageFromFile(
  content: string,
  filePath: string,
): {
  keys: Array<{ key: string; file: string }>;
  dynamicNamespaces: Set<string>;
} {
  const keys: Array<{ key: string; file: string }> = [];
  const dynamicNamespaces = new Set<string>();

  // Build varName → namespace map for all getTranslations/useTranslations bindings
  // Handles both string form: getTranslations("ns") and object form: getTranslations({ locale, namespace: "ns" })
  const bindingRegex =
    /const\s+(\w+)\s*=\s*(?:await\s+)?(?:get|use)Translations\s*\(\s*(?:["'](\w+)["']|\{[^}]*namespace\s*:\s*["'](\w+)["'][^}]*\})\s*\)/g;

  const varNamespaceMap = new Map<string, string>();

  for (const [, varName, nsString, nsObject] of content.matchAll(
    bindingRegex,
  )) {
    const namespace = nsString ?? nsObject;
    if (namespace) varNamespaceMap.set(varName, namespace);
  }

  for (const [varName, namespace] of varNamespaceMap) {
    // Static string argument: t("key") or t('key')
    const staticRegex = new RegExp(
      `\\b${varName}\\s*\\(\\s*["']([^"']+)["']`,
      "g",
    );
    for (const [, key] of content.matchAll(staticRegex)) {
      keys.push({ key: `${namespace}.${key}`, file: filePath });
    }

    // Dynamic argument: t(variable) — not a string or template literal
    const dynamicArgRegex = new RegExp(
      `\\b${varName}\\s*\\(\\s*[^"'\`\\s)]`,
      "g",
    );
    if (dynamicArgRegex.test(content)) dynamicNamespaces.add(namespace);

    // Template literal argument: t(`...${expr}...`)
    const templateLiteralRegex = new RegExp(`\\b${varName}\\s*\\(\\s*\``, "g");
    if (templateLiteralRegex.test(content)) dynamicNamespaces.add(namespace);
  }

  return { keys, dynamicNamespaces };
}

function aggregateUsage(files: string[]): AggregatedUsage {
  return files.reduce<AggregatedUsage>(
    (acc, filePath) => {
      const content = readFileSync(filePath, "utf-8");
      const { keys, dynamicNamespaces } = extractUsageFromFile(
        content,
        filePath,
      );

      for (const { key, file } of keys) {
        acc.usedKeys.set(key, [...(acc.usedKeys.get(key) ?? []), file]);
      }
      for (const ns of dynamicNamespaces) acc.dynamicNamespaces.add(ns);

      return acc;
    },
    { usedKeys: new Map(), dynamicNamespaces: new Set() },
  );
}

// ─── Error formatting (SRP) ───────────────────────────────────────────────────

function formatUnusedError(
  unused: Array<{ key: string; line: number; value: string }>,
): string {
  const items = unused
    .map(
      ({ key, line, value }) =>
        `  • "${key}"  (${SOURCE_LOCALE}.json:${line})  →  "${value}"`,
    )
    .join("\n");

  return `\n${unused.length} clave(s) en el JSON sin usar en el código:\n${items}\n`;
}

function formatAbsentError(
  absent: Array<{ key: string; files: string[] }>,
): string {
  const items = absent
    .map(
      ({ key, files }) =>
        `  • "${key}"  →  usado en: ${files.map(relPath).join(", ")}`,
    )
    .join("\n");

  return `\n${absent.length} clave(s) usadas en el código pero ausentes del JSON:\n${items}\n`;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("i18n — uso de traducciones en el código", () => {
  const sourceFlat = flattenKeys(loadLocale(SOURCE_LOCALE));
  const sourceRaw = loadLocaleRaw(SOURCE_LOCALE);
  const sourceFiles = findSourceFiles(SOURCE_DIR, ["__tests__", "messages"]);
  const { usedKeys, dynamicNamespaces } = aggregateUsage(sourceFiles);

  it("se encontraron archivos fuente para analizar", () => {
    expect(sourceFiles.length).toBeGreaterThan(0);
  });

  it("no hay claves en el JSON sin usar en el código", () => {
    const unused = Object.entries(sourceFlat)
      .filter(([key]) => {
        const namespace = key.split(".")[0];
        // Skip namespaces with dynamic calls — static analysis can't verify them
        if (dynamicNamespaces.has(namespace)) return false;
        return !usedKeys.has(key);
      })
      .map(([key, value]) => ({
        key,
        line: findKeyLine(sourceRaw, key),
        value,
      }));

    if (unused.length > 0) throw new Error(formatUnusedError(unused));
  });

  it("no hay claves usadas en el código que no existan en el JSON", () => {
    const sourceKeys = new Set(Object.keys(sourceFlat));

    const absent = [...usedKeys.entries()]
      .filter(([key]) => !sourceKeys.has(key))
      .map(([key, files]) => ({ key, files }));

    if (absent.length > 0) throw new Error(formatAbsentError(absent));
  });
});
