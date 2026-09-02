import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("App shell layout contract", () => {
  it("uses a shared desktop grid track and keeps the content fluid", () => {
    const css = readFileSync("app/globals.css", "utf8");

    expect(css).toContain("grid-template-columns: var(--app-sidebar-width) minmax(0, 1fr)");
    expect(css).toContain(".app-shell[data-sidebar=\"collapsed\"]");
    expect(css).not.toMatch(/\.app-content\s*\{[^}]*max-width:/s);
    expect(css).not.toMatch(/\.app-content\s*\{[^}]*margin:\s*0 auto/s);
    expect(css).not.toContain("transition: grid-template-columns");
  });

  it("does not add a second max-width and padding layer on the Talent dashboard", () => {
    const page = readFileSync("app/(dashboard)/talent/page.tsx", "utf8");

    expect(page).toContain('className="talent-dashboard space-y-10"');
    expect(page).toContain("xl:grid-cols-4");
    expect(page).not.toContain("lg:grid-cols-4");
    expect(page).not.toContain('className="max-w-7xl mx-auto p-4 md:p-8 space-y-10"');
  });
});
