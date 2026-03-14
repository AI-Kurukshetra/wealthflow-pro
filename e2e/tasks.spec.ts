import { expect, test } from "@playwright/test";

import { bootstrapWorkspace } from "./helpers";

test("tasks navigation opens the advisor workload view", async ({ page }) => {
  await bootstrapWorkspace(page);

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

test("creates a new task from the tasks workspace", async ({ page }) => {
  const taskTitle = `Call client about KYC refresh ${Date.now()}`;

  await bootstrapWorkspace(page);

  await page.getByRole("link", { name: "Tasks" }).click();
  await page.getByRole("button", { name: "New task" }).click();
  const createTaskDialog = page.getByRole("dialog", { name: "Create task" });

  await createTaskDialog
    .getByRole("textbox", { name: /^Task$/ })
    .fill(taskTitle);
  await createTaskDialog.getByRole("button", { name: "Create task" }).click();

  await expect(page.getByRole("cell", { name: taskTitle })).toBeVisible();
});
