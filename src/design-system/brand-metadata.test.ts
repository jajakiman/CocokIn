import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("CocokIn metadata branding", () => {
  it("uses official logo assets for icons and social images in root layout", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");

    expect(layout).toContain('/brand/cocokin/logo-mark.webp');
    expect(layout).toContain('/brand/cocokin/logo-full.webp');
  });
});
