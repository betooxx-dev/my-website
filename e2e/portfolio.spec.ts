import { expect, test } from "@playwright/test";

test("serves the localized portfolio with defensive headers", async ({
  page,
}) => {
  const response = await page.goto("/es");

  expect(response).not.toBeNull();
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("main")).toBeVisible();
});

test("switches locale using the native language control", async ({ page }) => {
  await page.goto("/es");

  await page.getByRole("combobox", { name: "Idioma" }).selectOption("en");

  await expect(page).toHaveURL(/\/en(?:#.*)?$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("navigates from the blog to a portfolio section", async ({ page }) => {
  await page.goto("/es/blog");
  await page.getByRole("link", { name: "Experiencia" }).first().click();

  await expect(page).toHaveURL(/\/es#experience$/);
});

test("keeps the closed mobile menu out of keyboard navigation", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/es");
  const toggle = page.locator('button[aria-controls="mobile-navigation"]');
  const menu = page.locator("#mobile-navigation");

  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toHaveAttribute("inert", "");

  await toggle.click();

  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(menu).not.toHaveAttribute("inert", "");
});

test("keeps the navbar and page inside narrow mobile viewports", async ({
  page,
}) => {
  for (const width of [320, 360, 390]) {
    await page.setViewportSize({ height: 844, width });
    await page.goto("/es");

    const bounds = await page.locator("header nav").boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds?.x).toBeGreaterThanOrEqual(0);
    expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(width);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await expect(
      page.locator('button[aria-controls="mobile-navigation"]'),
    ).toBeInViewport();
  }
});

test("does not expose Studio in a production runtime", async ({ page }) => {
  await page.goto("/studio");

  await expect(page).toHaveURL(/\/(?:es|en)$/);
  expect(page.url()).not.toContain("/studio");
});
