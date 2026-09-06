import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("LazyTalentSkillManager", () => {
  it("defers the interactive skill manager and reserves fallback space", () => {
    const source = readFileSync("src/components/talent/lazy-talent-skill-manager.tsx", "utf8");
    const fallback = readFileSync("src/design-system/talent-loading.tsx", "utf8");

    expect(source).toContain('dynamic(() => import("./talent-skill-manager")');
    expect(source).toContain("SkillManagerLoading");
    expect(fallback).toContain("min-h-44");
  });
});
