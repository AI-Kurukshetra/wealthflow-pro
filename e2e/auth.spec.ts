import { expect, test } from "@playwright/test";

import { bootstrapWorkspace, loginToWorkspace } from "./helpers";

test("seeded advisor login opens the dashboard", async ({ page }) => {
  await bootstrapWorkspace(page);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await loginToWorkspace(page);
  await expect(
    page.getByRole("heading", { name: "Good morning, Vineeth" })
  ).toBeVisible();
});
