import { describe, expect, it } from "vitest";

import { getRoleConfig, roleConfigs } from "./role-config";

describe("roleConfigs", () => {
  it("uses one shared Arctic Depths theme for every role", () => {
    expect(Object.values(roleConfigs).map((config) => config.theme)).toEqual([
      "arctic-depths",
      "arctic-depths",
      "arctic-depths",
    ]);
  });

  it("gives each role a distinct primary task without changing the shell", () => {
    expect(getRoleConfig("talent").primaryAction.label).toBe("Cari proyek");
    expect(getRoleConfig("business").primaryAction.label).toBe("Buat proyek");
    expect(getRoleConfig("admin").primaryAction.label).toBe("Tangani antrean");
    expect(new Set(Object.values(roleConfigs).map((config) => config.shell))).toEqual(
      new Set(["adaptive-sidebar"]),
    );
  });
});
