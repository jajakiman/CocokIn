import { expect, test } from "@playwright/test";

test.describe("Responsive Design System Shell", () => {
  test("navigates all role dashboards from landing", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Satu sistem, tiga sudut pandang." })).toBeVisible();

    await page.getByRole("link", { name: /Talent/ }).click();
    await expect(page.getByRole("heading", { name: "Selamat datang, Nadia" })).toBeVisible();

    await page.goto("/business");
    await expect(page.getByRole("heading", { name: "Warung Bu Siti" })).toBeVisible();

    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Ringkasan hari ini" })).toBeVisible();
  });

  test("loads design system catalog without errors", async ({ page }) => {
    await page.goto("/dev/design-system");
    await expect(page.getByRole("heading", { name: "Arctic Depths Design System" })).toBeVisible();
    await expect(page.getByText("Brand cyan")).toBeVisible();
    await expect(page.getByText("Terverifikasi", { exact: true })).toBeVisible();
  });
});
