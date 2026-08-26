import { expect, test } from "@playwright/test";

test.describe("Guest Landing, Auth UX & Real System Flow E2E Suite (Workable B2B SaaS Style)", () => {
  test("guest landing displays Workable hero, dual CTAs, feature splits, and scorecard", async ({
    page,
  }) => {
    await page.goto("/");

    // 1. Header & Hero
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Ekosistem Kerja Nyata untuk Talenta Muda",
    );
    await expect(
      page.locator("#hero").getByRole("link", { name: "Mulai sebagai Talent" }),
    ).toBeVisible();
    await expect(
      page.locator("#hero").getByRole("link", { name: "Mulai sebagai UMKM" }),
    ).toBeVisible();

    // 2. Sections
    await expect(page.locator("#hero")).toBeVisible();
    await expect(page.locator("#untuk-talent")).toBeVisible();
    await expect(page.locator("#untuk-umkm")).toBeVisible();
    await expect(page.locator("#matching-engine")).toBeVisible();
    await expect(page.locator("#proyek-unggulan")).toBeVisible();
    await expect(page.locator("#trust")).toBeVisible();
    await expect(page.locator("#final-cta")).toBeVisible();

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
    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.fill("password123");

    // Toggle password visibility
    const toggleBtn = page.getByTestId("password-toggle");
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    // Submit
    await page.getByRole("button", { name: "Masuk", exact: true }).click();

    // Honest unavailable alert
    await expect(page.locator(".auth-alert")).toContainText("Autentikasi belum dikonfigurasi");
  });
});
