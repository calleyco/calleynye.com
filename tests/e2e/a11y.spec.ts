import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES_TO_SCAN = [
  { name: "home", path: "/" },
  { name: "writing index", path: "/writing" },
  { name: "disability models essay", path: "/writing/which-model-of-disability-is-your-ai-product-operating-from" },
  { name: "compressive images essay", path: "/writing/compressive-images-revisited" },
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

test("compressive images essay: switching pipeline updates the verdict @a11y", async ({ page }) => {
  await page.goto("/writing/compressive-images-revisited");

  const nextImgButton = page.getByRole("button", { name: /next\/image pipeline/i });
  await nextImgButton.click();

  await expect(nextImgButton).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/let the framework lead/i)).toBeVisible();
});

test("compressive images essay: density toggle updates the bars @a11y", async ({ page }) => {
  await page.goto("/writing/compressive-images-revisited");

  const fourX = page.getByRole("button", { name: /4× screens/i });
  await fourX.click();

  await expect(fourX).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/Full-quality @4x \(the naive way\)/i)).toBeVisible();
});
