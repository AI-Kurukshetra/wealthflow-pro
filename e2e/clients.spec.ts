import { expect, test } from "@playwright/test";

import { bootstrapWorkspace } from "./helpers";

test("clients navigation opens the roster and a client profile", async ({ page }) => {
  await bootstrapWorkspace(page);

  await page.getByRole("link", { name: "Clients" }).click();

  await expect(page).toHaveURL(/\/clients$/);
  await expect(
    page.getByRole("heading", { name: "Client relationships" })
  ).toBeVisible();

  await page.getByRole("link", { name: /Aarav & Meera Shah/i }).click();

  await expect(page).toHaveURL(/\/clients\/.+$/);
  await expect(
    page.getByRole("heading", { name: "Aarav & Meera Shah" })
  ).toBeVisible();
  await expect(page.getByRole("tab", { name: "Documents" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Meetings" })).toBeVisible();
});
