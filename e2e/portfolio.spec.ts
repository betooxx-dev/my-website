import { expect, test } from "@playwright/test";

test("serves the localized portfolio with defensive headers", async ({
  page,
}) => {
  const response = await page.goto("/");

  expect(response).not.toBeNull();
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("main")).toBeVisible();
});

test("switches locale using the native language control", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("combobox", { name: "Idioma" }).selectOption("en");

  await expect(page).toHaveURL(/\/en(?:#.*)?$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("combobox", { name: "Language" }).selectOption("es");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("keeps Spanish canonical URLs independent of language preferences", async ({
  context,
  page,
}) => {
  await context.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
  await context.addCookies([
    { name: "NEXT_LOCALE", value: "en", url: test.info().project.use.baseURL },
  ]);
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^https?:\/\/[^/]+\/?$/,
  );
  await page.goto("/es/blog?source=legacy");
  await expect(page).toHaveURL(/\/blog\?source=legacy$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("navigates from the blog to a portfolio section", async ({ page }) => {
  await page.goto("/blog");
  await page.getByRole("link", { name: "Experiencia" }).first().click();

  await expect(page).toHaveURL(/\/#experience$/);
});

test("keeps the closed mobile menu out of keyboard navigation", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");
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
    await page.goto("/");

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

  await expect(page).toHaveURL(/\/(?:en)?$/);
  expect(page.url()).not.toContain("/studio");
});

test("publishes canonical locale URLs in the sitemap", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  expect(xml).toMatch(/<loc>https:\/\/[^<]+\/en<\/loc>/);
  expect(xml).not.toMatch(/https:\/\/[^<"\s]+\/es(?:[/"<])/);
});

test("keeps scroll content visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(test.info().project.use.baseURL ?? "http://127.0.0.1:3000");
    const content = page.locator("[data-scroll-reveal]").first();
    await expect(content).toBeVisible();
    await expect(content).toHaveCSS("opacity", "1");
  } finally {
    await context.close();
  }
});
