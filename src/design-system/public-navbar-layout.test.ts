import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("public navbar layout", () => {
  it("anchors the navbar to the viewport without an overflow scroll container", () => {
    const css = readFileSync("src/design-system/styles/public.css", "utf8");

    expect(css).toMatch(/\.public-shell\s*{[^}]*overflow-x:\s*clip/s);
    expect(css).toMatch(/\.public-shell\s*{[^}]*padding-top:\s*5\.25rem/s);
    expect(css).toMatch(/\.public-header\s*{[^}]*position:\s*fixed/s);
    expect(css).not.toMatch(/\.public-header\s*{[^}]*position:\s*sticky/s);
  });
});
