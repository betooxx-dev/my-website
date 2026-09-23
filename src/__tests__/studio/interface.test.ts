import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import StudioBlogPage from "@/app/studio/blog/page";
import { StudioPostFields } from "@/app/studio/blog/post-fields";
import StudioLoginPage from "@/app/studio/login/page";
import { StudioFrame } from "@/components/features/studio/StudioFrame";

describe("studio interface", () => {
  it("offers a keyboard-friendly shell with truthful navigation state", () => {
    const html = renderToStaticMarkup(
      React.createElement(
        StudioFrame,
        { active: "blog" },
        React.createElement("p", null, "Editor content"),
      ),
    );

    expect(html).toContain('href="#studio-main"');
    expect(html).toContain('id="studio-main"');
    expect(html).toContain('aria-label="Navegación del Studio"');
    expect(html).toContain('aria-current="page"');
    expect(html).not.toContain('aria-disabled="true"');
    expect(html).toContain('aria-controls="studio-sidebar-navigation"');
    expect(html).toContain('aria-label="Contraer barra lateral"');
    expect(html).toContain('data-testid="studio-brand-mark"');
  });

  it("connects invalid-login feedback to both credential fields", async () => {
    const page = await StudioLoginPage({
      searchParams: Promise.resolve({ error: "invalid" }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('id="studio-login-error"');
    expect(html).toContain('role="alert"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="studio-login-error"');
    expect(html).toMatch(/auto[Cc]omplete="username"/);
    expect(html).toMatch(/auto[Cc]omplete="current-password"/);
  });

  it("keeps login focused on authentication without a navigation bar", async () => {
    const page = await StudioLoginPage({
      searchParams: Promise.resolve({}),
    });
    const html = renderToStaticMarkup(page);

    expect(html).not.toContain("<header");
    expect(html).not.toContain("Sitio público");
    expect(html).not.toContain("httpOnly");
    expect(html).not.toContain("Secure session");
    expect(html).toContain('aria-labelledby="studio-login-title"');
    expect(html).toContain('id="studio-login-form"');
  });

  it("gives the publishing fields stable labels and writing guidance", () => {
    const html = renderToStaticMarkup(
      React.createElement(StudioPostFields, {
        assets: [],
        categories: [{ name: "Tecnología", position: 0 }],
        fieldIdPrefix: "contract",
      }),
    );

    expect(html).toContain('for="contract-title"');
    expect(html).toContain('id="contract-title"');
    expect(html).toContain('for="contract-body"');
    expect(html).toContain('id="contract-body"');
    expect(html).toContain('aria-describedby="contract-body-help"');
    expect(html).toContain("encabezados, listas, enlaces, código e imágenes");
  });

  it("uses the landing design tokens instead of a separate hard-coded palette", () => {
    const interfaceFiles = [
      "src/app/studio/layout.tsx",
      "src/app/studio/login/page.tsx",
      "src/app/studio/page.tsx",
      "src/app/studio/blog/page.tsx",
      "src/app/studio/blog/post-fields.tsx",
      "src/components/features/studio/StudioFrame.tsx",
    ];

    for (const file of interfaceFiles) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toMatch(/#[\da-f]{3,8}/i);
    }
  });

  it("keeps the blog route as a server-rendered publishing surface", () => {
    expect(StudioBlogPage).toBeInstanceOf(Function);
  });

  it("keeps unsaved editor values recoverable across Studio navigation", () => {
    const source = readFileSync(
      "src/components/features/studio/StudioUnsavedChanges.tsx",
      "utf8",
    );

    expect(source).toContain("sessionStorage.setItem");
    expect(source).toContain("sessionStorage.getItem");
    expect(source).toContain("sessionStorage.removeItem");
    expect(source).toContain("storageKey");
  });

  it("associates image alternative-text guidance with its field", () => {
    const source = readFileSync(
      "src/app/studio/blog/_components/AssetLibrary.tsx",
      "utf8",
    );

    expect(source).toContain('aria-describedby="asset-alt-help"');
    expect(source).toContain('id="asset-alt-help"');
  });
});
