import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { generateProjectScopeAction } from "./gemini-actions";
import { getSession } from "@/src/lib/session";

vi.mock("@/src/lib/session", () => ({
  getSession: vi.fn(),
}));

describe("generateProjectScopeAction (Gemini AI Scoping)", () => {
  const originalEnv = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GEMINI_API_KEY;
  });

  afterAll(() => {
    process.env.GEMINI_API_KEY = originalEnv;
  });

  it("rejects non-business role unauthorized access", async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: "user_1",
      role: "TALENT" as const,
      email: "talent@cocokin.id",
      displayName: "Talent",
    });

    const result = await generateProjectScopeAction("Bikin website toko roti");
    expect(result.ok).toBe(false);
    expect(result.message).toContain("Hanya UMKM");
  });

  it("provides graceful simulated response when GEMINI_API_KEY is not set", async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: "biz_1",
      role: "BUSINESS" as const,
      email: "umkm@cocokin.id",
      displayName: "UMKM Owner",
    });

    // Fast-forward timeout/delay
    const resultPromise = generateProjectScopeAction("Website katalog UMKM");
    const result = await resultPromise;

    expect(result.ok).toBe(true);
    expect(result.data?.title).toBeDefined();
    expect(result.data?.milestones).toHaveLength(2);
    const sumWeights = result.data?.milestones.reduce((acc, m) => acc + m.weightBps, 0);
    expect(sumWeights).toBe(10000);
  });
});
