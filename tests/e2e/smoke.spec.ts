import { expect, test } from "@playwright/test";

test.describe("Responsive Design System Shell", () => {
  test("navigates from landing to dashboards cleanly", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Ekosistem Kerja Nyata untuk Talenta Muda",
    );

    await page.goto("/talent");
    await expect(page.getByRole("heading", { name: "Selamat datang, Nadia" })).toBeVisible();

    await page.goto("/business");
    await expect(page.getByRole("heading", { name: "Warung Bu Siti" })).toBeVisible();

    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Ringkasan hari ini" })).toBeVisible();
  });

});
