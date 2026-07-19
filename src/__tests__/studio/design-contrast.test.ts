import { readFileSync } from "node:fs";

describe("Studio design contrast", () => {
  it("keeps the shared green readable as text and as a button surface", () => {
    const css = readFileSync("src/styles/globals.css", "utf8");
    const rootStart = css.indexOf(":root");
    const darkStart = css.indexOf("\n.dark", rootStart);
    const lightTokens = css.slice(rootStart, darkStart);
    const primary = readOklchToken(lightTokens, "primary");
    const background = readOklchToken(lightTokens, "background");
    const white = { chroma: 0, hue: 0, lightness: 1 };

    expect(contrast(primary, background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(primary, white)).toBeGreaterThanOrEqual(4.5);
  });
});

type Oklch = {
  chroma: number;
  hue: number;
  lightness: number;
};

function readOklchToken(source: string, token: string): Oklch {
  const match = source.match(
    new RegExp(`--${token}: oklch\\(([\\d.]+) ([\\d.]+) ([\\d.]+)\\)`),
  );
  if (!match) throw new Error(`Missing --${token} OKLCH token`);

  return {
    lightness: Number(match[1]),
    chroma: Number(match[2]),
    hue: Number(match[3]),
  };
}

function contrast(first: Oklch, second: Oklch) {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(color: Oklch) {
  const hue = (color.hue * Math.PI) / 180;
  const a = color.chroma * Math.cos(hue);
  const b = color.chroma * Math.sin(hue);
  const l = color.lightness + 0.3963377774 * a + 0.2158037573 * b;
  const m = color.lightness - 0.1055613458 * a - 0.0638541728 * b;
  const s = color.lightness - 0.0894841775 * a - 1.291485548 * b;
  const linearL = l ** 3;
  const linearM = m ** 3;
  const linearS = s ** 3;
  const red = clamp(
    4.0767416621 * linearL - 3.3077115913 * linearM + 0.2309699292 * linearS,
  );
  const green = clamp(
    -1.2684380046 * linearL + 2.6097574011 * linearM - 0.3413193965 * linearS,
  );
  const blue = clamp(
    -0.0041960863 * linearL - 0.7034186147 * linearM + 1.707614701 * linearS,
  );

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}
