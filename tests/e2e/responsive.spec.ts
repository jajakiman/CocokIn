import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile-sm", width: 320, height: 568 },
  { name: "mobile-std", width: 375, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop-std", width: 1024, height: 768 },
  { name: "desktop-wide", width: 1440, height: 900 },
];

test.describe("ZAKY-01 Multi-Viewport & Accessibility E2E Suite", () => {
  for (const vp of VIEWPORTS) {
    test(`renders Talent pages properly on viewport ${vp.name} (${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // 1. Landing
      await page.goto("/");
      await expect(page.locator("body")).toBeVisible();

      // 2. Talent Projects Catalog
      await page.goto("/talent/projects");
      await expect(page.getByRole("heading", { name: "Cari Proyek" })).toBeVisible();

      // 3. Talent Assessment
      await page.goto("/talent/assessment");
      await expect(page.getByRole("heading", { name: "Pilih Target Karier" })).toBeVisible();

      // 4. Talent Skill Gap
      await page.goto("/talent/skill-gap");
      await expect(page.getByRole("heading", { name: "Analisis Skill Gap" })).toBeVisible();

      // 5. Talent Passport
      await page.goto("/talent/passport");
      await expect(page.getByRole("heading", { name: "Skill Passport" })).toBeVisible();

      // 6. Talent Profile
      await page.goto("/talent/profile");
      await expect(page.getByRole("heading", { name: "Profil & Preferensi Karier" })).toBeVisible();

      // 7. Talent Portfolio
      await page.goto("/talent/portfolio");
      await expect(
        page.getByRole("heading", { name: "Portofolio Terverifikasi UMKM" }),
      ).toBeVisible();

      // 8. Public Shareable Passport
      await page.goto("/p/talent-nadia");
      await expect(page.getByRole("heading", { name: "Nadia Putri" })).toBeVisible();

      // 9. Design System Catalog
      await page.goto("/dev/design-system");
      await expect(
        page.getByRole("heading", { name: "Arctic Depths Design System" }),
      ).toBeVisible();
    });
  }
});
