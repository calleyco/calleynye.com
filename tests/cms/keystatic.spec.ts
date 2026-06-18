import { expect, test } from "@playwright/test";

const WRITING_ENTRIES = [
  "accessibility-as-the-path-of-least-resistance",
  "compressive-images-revisited",
  "live-regions-are-a-real-time-ui-problem",
  "the-design-engineer-is-a-translator-not-a-compromise",
  "which-model-of-disability-is-your-ai-product-operating-from",
];

test.describe("Keystatic writing CMS", () => {
  test("lists all existing writing entries", async ({ page }) => {
    await page.goto("/keystatic/collection/writing");

    await expect(page.getByRole("heading", { name: "Writing" })).toBeVisible();

    for (const slug of WRITING_ENTRIES) {
      await expect(page.getByText(slug)).toBeVisible();
    }
  });

  test("opens the MDX-heavy compressive essay editor without validation errors", async ({ page }) => {
    await page.goto("/keystatic/collection/writing/item/compressive-images-revisited");

    await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
    await expect(page.getByText("Field validation failed")).toHaveCount(0);
    await expect(page.getByRole("textbox", { name: "Title" })).toHaveValue(
      "The Retina image trick everyone forgot — and whether it still holds up in 2026",
    );
    await expect(page.getByRole("textbox", { name: "Description" })).toHaveValue(/single oversized, low-quality file/);
    await expect(page.getByRole("button", { name: "Review Publication status" })).toBeVisible();
  });

  test("opens editor previews outside the Keystatic layout", async ({ page }) => {
    await page.goto("/keystatic/collection/writing/item/compressive-images-revisited");

    const popupPromise = page.waitForEvent("popup");
    await page.getByRole("button", { name: "Preview" }).click();
    const popup = await popupPromise;

    await expect(popup).toHaveURL(/\/cms-preview\/writing\/compressive-images-revisited$/);
    await expect(popup.getByText("Preview | review")).toBeVisible();
    await expect(popup.getByText("Calley Nye Content")).toHaveCount(0);
  });
});

test.describe("CMS writing previews", () => {
  test("renders review essays through the dev-only preview route", async ({ page }) => {
    const response = await page.goto("/cms-preview/writing/compressive-images-revisited");

    expect(response?.status()).toBe(200);
    await expect(page.getByText("Preview | review")).toBeVisible();
    await expect(page.getByRole("heading", { name: /The Retina image trick everyone forgot/i })).toBeVisible();
    await expect(page.getByText("In 2015 I built a CodePen")).toBeVisible();
  });

  test("does not route previews through the Keystatic app shell", async ({ page }) => {
    await page.goto("/cms-preview/writing/compressive-images-revisited");

    await expect(page.getByText("Calley Nye Content")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Back to CMS/i })).toBeVisible();
  });
});
