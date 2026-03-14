import { expect, test } from "@playwright/test";

test("tasks navigation opens the advisor workload view", async ({ page }) => {
  await page.goto("/dashboard");

  await page.getByRole("link", { name: "Tasks" }).click();

  await expect(page).toHaveURL(/\/tasks$/);
  await expect(
    page.getByRole("heading", { name: "Advisor workload" })
  ).toBeVisible();
  await expect(page.getByText("Open work")).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "Prepare quarterly review deck" }).first()
  ).toBeVisible();
});

test.fixme("creates a new task from the tasks workspace", async () => {
  // The current mock-backed tasks route does not expose task-creation controls yet.
});
