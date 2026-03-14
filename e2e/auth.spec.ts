import { expect, test } from "@playwright/test";

import { bootstrapWorkspace } from "./helpers";

test("seeded advisor login opens the dashboard", async ({ page }) => {
  await bootstrapWorkspace(page);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/login");

  await expect(page.getByText("Log in to WealthFlow")).toBeVisible();

  await page.getByRole("button", { name: "Enter WealthFlow" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "Good morning, Vineeth" })
  ).toBeVisible();
});
