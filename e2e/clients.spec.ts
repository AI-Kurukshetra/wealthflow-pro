import { expect, test } from "@playwright/test";

test("clients navigation opens the roster and a client profile", async ({ page }) => {
  await page.goto("/dashboard");

  await page.getByRole("link", { name: "Clients" }).click();

  await expect(page).toHaveURL(/\/clients$/);
  await expect(
    page.getByRole("heading", { name: "Client relationships" })
  ).toBeVisible();

  await page.getByRole("link", { name: /Aarav & Meera Shah/i }).click();

  await expect(page).toHaveURL(/\/clients\/client-001$/);
  await expect(
    page.getByRole("heading", { name: "Aarav & Meera Shah" })
  ).toBeVisible();
  await expect(page.getByRole("tab", { name: "Documents" })).toBeVisible();
});
