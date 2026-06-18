import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES_TO_SCAN = [
  { name: "home", path: "/" },
  { name: "writing index", path: "/writing" },
  { name: "disability models essay", path: "/writing/which-model-of-disability-is-your-ai-product-operating-from" },
  { name: "accessibility statement", path: "/accessibility" },
];

for (const route of ROUTES_TO_SCAN) {
  test(`${route.name} has no axe violations @a11y`, async ({ page }) => {
    await page.goto(route.path);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
}

test("disability models essay: pressing a model tab updates the panel @a11y", async ({ page }) => {
  await page.goto("/writing/which-model-of-disability-is-your-ai-product-operating-from");

  const justiceTab = page.getByRole("button", { name: /justice model/i });
  await justiceTab.click();

  await expect(justiceTab).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#model-explorer-panel")).toContainText("natural and necessary part of human diversity");
});

test("review essays are not publicly routable", async ({ page }) => {
  const response = await page.goto("/writing/compressive-images-revisited");

  expect(response?.status()).toBe(404);
});
