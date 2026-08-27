import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("CocokIn metadata branding", () => {
  it("uses official logo assets for icons and social images", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    const passportOg = readFileSync("app/p/[id]/opengraph-image.tsx", "utf8");

    expect(layout).toContain('/brand/cocokin/logo-mark.webp');
    expect(layout).toContain('/brand/cocokin/logo-full.webp');
    expect(passportOg).toContain('/brand/cocokin/logo-mark.webp');
    expect(passportOg).toContain('process.env.VERCEL_URL');
    expect(passportOg).not.toContain('>\n            C\n');
  });
});
