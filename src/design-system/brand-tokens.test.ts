import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("official CocokIn brand tokens", () => {
  it("uses the solid colors derived from the official logo assets", () => {
    const css = readFileSync("app/globals.css", "utf8").toLowerCase();

    expect(css).toContain("--brand-navy: #001040");
    expect(css).toContain("--brand-blue: #0080ff");
    expect(css).toContain("--brand-orange: #ff8010");
    expect(css).toContain("--primary: var(--brand-navy)");
    expect(css).toContain("--interactive: #006fe6");
    expect(css).not.toContain("--brand-cyan:");
  });
});
