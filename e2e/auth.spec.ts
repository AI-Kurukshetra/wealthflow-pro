import { expect, test } from "@playwright/test";

test("seeded advisor login opens the dashboard", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByText("Log in to WealthFlow")).toBeVisible();

  await page.getByRole("textbox", { name: "advisor@wealthflow.in" }).fill(
    "neha.bansal@wealthflow.in"
  );
  await page.getByRole("textbox", { name: "Enter your password" }).fill(
    "WealthFlow123!"
  );
  await page.getByRole("button", { name: "Enter WealthFlow" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "Good morning, Neha" })
  ).toBeVisible();
});
