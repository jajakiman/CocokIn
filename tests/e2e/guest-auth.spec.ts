import { expect, test } from "@playwright/test";

test.describe("Guest Landing, Auth UX & Demo Mode E2E Suite", () => {
  test("guest landing displays value proposition, dual CTAs, and product proof", async ({
    page,
  }) => {
    await page.goto("/");

    // 1. Header & Hero
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Proyek digital yang mempertemukan potensi dan kebutuhan nyata",
    );
    await expect(
      page.locator("#hero").getByRole("link", { name: "Mulai sebagai Talent" }),
    ).toBeVisible();
    await expect(
      page.locator("#hero").getByRole("link", { name: "Mulai sebagai UMKM" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Lihat demo sistem" })).toBeVisible();

    // 2. Sections
    await expect(page.locator("#cara-kerja")).toBeVisible();
    await expect(page.locator("#untuk-talent")).toBeVisible();
    await expect(page.locator("#untuk-umkm")).toBeVisible();
    await expect(page.locator("#product-proof")).toBeVisible();
    await expect(page.locator("#trust")).toBeVisible();

    // 3. No Admin registration link
    await expect(page.getByRole("link", { name: /Admin/i })).not.toBeVisible();
  });

  test("registration role choice presents Talent and UMKM options", async ({ page }) => {
    await page.goto("/register");

    await expect(page.getByRole("heading", { name: "Bergabung dengan CocokIn" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Daftar sebagai Talent/i })).toHaveAttribute(
      "href",
      "/register/talent",
    );
    await expect(page.getByRole("link", { name: /Daftar sebagai UMKM/i })).toHaveAttribute(
      "href",
      "/register/business",
    );
    await expect(page.getByRole("link", { name: /Admin/i })).not.toBeVisible();
  });

  test("login form provides accessible fields and honest unavailable failure", async ({
    page,
  }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "Masuk ke CocokIn" })).toBeVisible();

    // Fill form
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Kata sandi", { exact: true }).fill("password123");

    // Toggle password visibility
    const toggleBtn = page.getByRole("button", { name: /Tampilkan kata sandi/i });
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    await expect(page.getByLabel("Kata sandi", { exact: true })).toHaveAttribute("type", "text");

    // Submit
    await page.getByRole("button", { name: "Masuk", exact: true }).click();

    // Honest unavailable alert
    await expect(page.locator(".auth-alert")).toContainText("Autentikasi belum dikonfigurasi");
  });

  test("demo page launches talent and business demo with persistent banner and exit action", async ({
    page,
  }) => {
    await page.goto("/demo");

    await expect(page.getByRole("heading", { name: /Mode Demo/i })).toBeVisible();

    // Launch Talent demo
    await page.getByRole("link", { name: /Buka Demo Talent/i }).click();
    await expect(page).toHaveURL(/talent\?demo=talent/);

    // Verify Demo Banner is visible
    await expect(page.getByLabel("Informasi status mode demo")).toBeVisible();
    await expect(page.getByText(/SEEDED_DEMO/i)).toBeVisible();

    // Exit demo
    await page.getByRole("link", { name: /Keluar dari demo/i }).click();
    await expect(page).toHaveURL("/");
  });
});
