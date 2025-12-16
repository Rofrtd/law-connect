import { test, expect } from "@playwright/test";

test("generate: prompt creates and displays records", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("textbox", { name: /prompt/i }).fill("hello world");
  await page.getByRole("button", { name: /generate/i }).click();

  await expect(page.getByText("From: hello world")).toBeVisible();
});

test("delete: removes a record from the list", async ({ page }) => {
  await page.goto("/");

  // generate a record first
  await page.getByRole("textbox", { name: /prompt/i }).fill("to delete");
  await page.getByRole("button", { name: /generate/i }).click();

  const card = page.locator("article", { hasText: "From: to delete" });
  await expect(card).toBeVisible();

  // delete that specific record
  await card.getByRole("button", { name: /delete/i }).click();

  // record card should be gone
  await expect(card).toBeHidden();
});
