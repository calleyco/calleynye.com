import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES_TO_SCAN = [
  { name: "home", path: "/" },
  { name: "writing index", path: "/writing" },
  { name: "disability models essay", path: "/writing/which-model-of-disability-is-your-ai-product-operating-from" },
  { name: "ui engineer essay", path: "/writing/congratulations-on-your-promotion" },
  { name: "compressive essay", path: "/writing/compressive-images-revisited" },
  { name: "lab index", path: "/lab" },
  { name: "live region lab", path: "/lab/live-regions" },
  { name: "accessibility statement", path: "/accessibility" },
];

for (const route of ROUTES_TO_SCAN) {
  test(`${route.name} has no axe violations @a11y`, async ({ page }) => {
    await page.goto(route.path);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
}

const SKIP_LINK_ROUTES = [
  "/",
  "/writing",
  "/writing/congratulations-on-your-promotion",
  "/lab",
  "/accessibility",
];

for (const path of SKIP_LINK_ROUTES) {
  test(`skip link is the first tab stop, visible on focus, and targets main on ${path} @a11y`, async ({ page }) => {
    await page.goto(path);
    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: /skip to content/i });
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute("href", "#main");

    // Hidden off-screen (top: -100px) until focused, then slides into view.
    const box = await skip.boundingBox();
    expect(box?.y ?? -100).toBeGreaterThanOrEqual(0);

    // Focus reached by keyboard must show a visible focus indicator.
    const outlineWidth = await skip.evaluate((el) => getComputedStyle(el).outlineWidth);
    expect(outlineWidth).not.toBe("0px");

    // The skip target exists on the page.
    await expect(page.locator("#main")).toHaveCount(1);
  });
}

test("ui-engineer essay: a title button is keyboard-operable and updates the live panel @a11y", async ({ page }) => {
  await page.goto("/writing/congratulations-on-your-promotion");

  const developerTab = page.getByRole("button", { name: "Frontend Developer" });
  await developerTab.focus();
  await expect(developerTab).toBeFocused();

  // Space activates a native button; the live region should reflect the change.
  await page.keyboard.press("Space");
  await expect(developerTab).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#title-scatter-panel")).toContainText("The catch-all");
});

test("disability models essay: pressing a model tab updates the panel @a11y", async ({ page }) => {
  await page.goto("/writing/which-model-of-disability-is-your-ai-product-operating-from");

  const justiceTab = page.getByRole("button", { name: /justice model/i });
  await justiceTab.click();

  await expect(justiceTab).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#model-explorer-panel")).toContainText("natural and necessary part of human diversity");
});

test("draft essays are not publicly routable", async ({ page }) => {
  const response = await page.goto("/writing/live-regions-are-a-real-time-ui-problem");

  expect(response?.status()).toBe(404);
});

test("the published compressive essay is publicly routable", async ({ page }) => {
  const response = await page.goto("/writing/compressive-images-revisited");

  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: /The Retina image trick everyone forgot/i })).toBeVisible();
});

test("writing index renders published posts without server errors", async ({ page }) => {
  const response = await page.goto("/writing");

  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: /The index/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Which model of disability/i })).toBeVisible();
  await expect(page.getByText("Application error")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /The Retina image trick everyone forgot/i })).toBeVisible();
  await expect(page.getByText("Live regions are a real-time UI problem")).toHaveCount(0);
});
