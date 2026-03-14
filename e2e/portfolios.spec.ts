import { expect, test } from "@playwright/test";

import { bootstrapWorkspace } from "./helpers";

test("portfolios navigation opens the portfolio ledger", async ({ page }) => {
  await bootstrapWorkspace(page);

  await page.getByRole("link", { name: "Portfolios" }).click();

  await expect(page).toHaveURL(/\/portfolios$/);
  await expect(
    page.getByRole("heading", { name: "Managed portfolios" })
  ).toBeVisible();
  await expect(page.getByText("Portfolio ledger")).toBeVisible();
  await expect(page.getByText("Performance chart")).toBeVisible();
  await expect(page.getByRole("cell", { name: "Aarav Core Wealth" })).toBeVisible();
});
