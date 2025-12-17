import { test, expect } from "@playwright/test";
import { db } from "@/db";
import { records } from "@/db/schema";

// remove all records before each test run using Drizzle ORM
test.beforeEach(async () => {
  await db.delete(records).run();
});

test("generate: prompt creates and displays records", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("textbox", { name: /prompt/i }).fill("hello world");
  await page.getByRole("button", { name: "Generate Document" }).click();

  await expect(page.getByText("From: hello world")).toBeVisible();
});

test("delete: removes a record from the list", async ({ page }) => {
  await page.goto("/");

  // generate a record first
  await page.getByRole("textbox", { name: /prompt/i }).fill("to delete");
  await page.getByRole("button", { name: "Generate Document" }).click();

  const card = page.locator("article", { hasText: "From: to delete" });
  await expect(card).toBeVisible();

  // open delete confirmation dialog
  await card.getByRole("button", { name: /delete/i }).click();

  // confirm deletion in the dialog
  await page.getByRole("button", { name: /delete record/i }).click();

  // record card should be gone
  await expect(card).toBeHidden();
});

test("edit: updates a record body", async ({ page }) => {
  await page.goto("/");

  // generate a record first
  await page.getByRole("textbox", { name: /prompt/i }).fill("to edit");
  await page.getByRole("button", { name: "Generate Document" }).click();

  const card = page.locator("article", { hasText: "From: to edit" });
  await expect(card).toBeVisible();

  // enter edit mode
  await card.getByRole("button", { name: /edit/i }).click();

  // update body and save
  const bodyBox = card.getByRole("textbox", { name: /body/i });
  await bodyBox.fill("Updated body");
  await card.getByRole("button", { name: /save/i }).click();

  // assert update is visible
  await expect(page.getByText("Updated body")).toBeVisible();
});
