import { expect, type Page } from "@playwright/test";

export async function bootstrapWorkspace(page: Page) {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Log in to WealthFlow" })).toBeVisible();

  await page.getByRole("button", { name: "Create demo workspace" }).click();
  await page.waitForURL(/\/(setup|dashboard)$/, { timeout: 15_000 });

  if (page.url().includes("/setup")) {
    const setupButton = page.getByRole("button", { name: "Create demo workspace" });
    const canBootstrap = await setupButton
      .waitFor({ state: "visible", timeout: 2_000 })
      .then(() => true)
      .catch(() => false);

    if (canBootstrap) {
      await setupButton.click();
    }

    await page.waitForURL(/\/dashboard$/, { timeout: 15_000 });
  }

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: /Good morning/i })).toBeVisible();
}

export async function loginToWorkspace(page: Page) {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Log in to WealthFlow" })).toBeVisible();

  await page.getByRole("button", { name: "Enter WealthFlow" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
