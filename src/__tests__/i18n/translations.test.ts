import {
  type FlatTranslations,
  findKeyLine,
  flattenKeys,
  getTargetLocales,
  loadLocale,
  loadLocaleRaw,
  SOURCE_LOCALE,
} from "./helpers";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MissingTranslation {
  key: string;
  sourceLine: number;
  sourceValue: string;
}

// ─── Diff ─────────────────────────────────────────────────────────────────────

function findMissingTranslations(
  source: FlatTranslations,
  target: FlatTranslations,
  sourceRaw: string,
): MissingTranslation[] {
  return Object.entries(source)
    .filter(([key]) => !(key in target))
    .map(([key, sourceValue]) => ({
      key,
      sourceLine: findKeyLine(sourceRaw, key),
      sourceValue,
    }));
}

// ─── Error formatting ─────────────────────────────────────────────────────────

function formatMissingError(
  locale: string,
  missing: MissingTranslation[],
): string {
  const items = missing
    .map(
      ({ key, sourceLine, sourceValue }) =>
        `  • "${key}"  →  ${SOURCE_LOCALE}.json:${sourceLine}  (valor original: "${sourceValue}")`,
    )
    .join("\n");

  return `\nLocale "${locale}" tiene ${missing.length} traducción(es) faltante(s):\n${items}\n`;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("i18n — completitud de traducciones", () => {
  const sourceRaw = loadLocaleRaw(SOURCE_LOCALE);
  const sourceFlat = flattenKeys(loadLocale(SOURCE_LOCALE));
  const targetLocales = getTargetLocales();

  it("se encontraron locales target para comparar", () => {
    expect(targetLocales.length).toBeGreaterThan(0);
  });

  describe.each(targetLocales)('locale "%s"', (locale) => {
    let targetFlat: FlatTranslations;

    beforeAll(() => {
      targetFlat = flattenKeys(loadLocale(locale));
    });

    it("no tiene claves faltantes respecto al source", () => {
      const missing = findMissingTranslations(
        sourceFlat,
        targetFlat,
        sourceRaw,
      );
      if (missing.length > 0)
        throw new Error(formatMissingError(locale, missing));
    });

    it("no tiene claves extra que no existan en el source", () => {
      const sourceKeys = new Set(Object.keys(sourceFlat));
      const extra = Object.keys(targetFlat).filter((k) => !sourceKeys.has(k));
      expect(extra).toHaveLength(0);
    });
  });
});
