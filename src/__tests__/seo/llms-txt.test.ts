import { createLlmsTxt } from "@/features/seo/llms-txt";

describe("createLlmsTxt", () => {
  const content = createLlmsTxt("https://example.com/");

  it("follows the llms.txt heading and summary format", () => {
    expect(content).toMatch(/^# Alberto Avendaño\n\n> /);
    expect(content).toContain("## Portfolio");
    expect(content).toContain("## Optional");
  });

  it("uses absolute production URLs without duplicate slashes", () => {
    expect(content).toContain("https://example.com/es");
    expect(content).not.toContain("https://example.com//es");
  });
});
