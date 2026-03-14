import { expect, test } from "@playwright/test";

import { bootstrapWorkspace } from "./helpers";

test("dashboard loads with the shell and primary priorities", async ({ page }) => {
  await bootstrapWorkspace(page);

  await expect(page.getByText("Platform")).toBeVisible();
  await expect(page.getByRole("link", { name: "Clients" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Good morning, Vineeth" })
  ).toBeVisible();
  await expect(page.getByText("Portfolio performance")).toBeVisible();
});
