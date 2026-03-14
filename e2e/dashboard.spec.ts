import { expect, test } from "@playwright/test";

test("dashboard loads with the shell and primary priorities", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page.getByText("Platform")).toBeVisible();
  await expect(page.getByRole("link", { name: "Clients" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Good morning, Neha" })
  ).toBeVisible();
  await expect(page.getByText("Portfolio performance")).toBeVisible();
});
