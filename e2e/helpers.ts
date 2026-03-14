import { expect, type Page } from "@playwright/test";

export async function bootstrapWorkspace(page: Page) {
  await loginToWorkspace(page, { allowBootstrap: true });
}

export async function loginToWorkspace(
  page: Page,
  options?: {
    allowBootstrap?: boolean;
  }
) {
  const allowBootstrap = options?.allowBootstrap ?? false;

  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Log in to WealthFlow" })).toBeVisible();

  await page.getByRole("button", { name: "Enter WealthFlow" }).click();

  const landedInWorkspace = await page
    .waitForURL(/\/(setup|dashboard)$/, { timeout: 10_000 })
    .then(() => true)
    .catch(() => false);

  if (!landedInWorkspace && allowBootstrap) {
    await page.getByRole("button", { name: "Create demo workspace" }).click();
    await page.waitForURL(/\/(setup|dashboard)$/, { timeout: 15_000 });
  }

  if (page.url().includes("/setup")) {
    if (!allowBootstrap) {
      throw new Error("Workspace setup is required before the seeded advisor can sign in.");
    }

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
