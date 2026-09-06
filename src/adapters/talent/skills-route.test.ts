import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  findProfile: vi.fn(),
  deleteMany: vi.fn(),
  queryRaw: vi.fn(),
  findSkill: vi.fn(),
  createSkill: vi.fn(),
  upsertTalentSkill: vi.fn(),
}));

vi.mock("@/src/lib/session", () => ({ getSession: mocks.getSession }));
vi.mock("@/src/adapters/database/prisma", () => ({
  prisma: {
    talentProfile: { findUnique: mocks.findProfile },
    talentSkill: { deleteMany: mocks.deleteMany },
    $transaction: async (operation: (tx: unknown) => unknown) => operation({
      $queryRaw: mocks.queryRaw,
      skill: { findFirst: mocks.findSkill, create: mocks.createSkill },
      talentSkill: { upsert: mocks.upsertTalentSkill },
    }),
  },
}));

import { DELETE, POST } from "@/app/api/talent/skills/route";

describe("Talent skill route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects unauthenticated claims before accessing the database", async () => {
    mocks.getSession.mockResolvedValue(null);

    const response = await POST(new Request("http://localhost/api/talent/skills", {
      method: "POST",
      body: JSON.stringify({ skillName: "React" }),
    }));

    expect(response.status).toBe(401);
    expect(mocks.findProfile).not.toHaveBeenCalled();
  });

  it("reuses a case-insensitive master skill while claiming it", async () => {
    mocks.getSession.mockResolvedValue({ id: "user-1", role: "TALENT" });
    mocks.findProfile.mockResolvedValue({ id: "profile-1" });
    mocks.findSkill.mockResolvedValue({ id: "skill-1", name: "Next.js", category: "Frontend" });
    mocks.upsertTalentSkill.mockResolvedValue({
      id: "talent-skill-1",
      evidenceLevel: "SELF_DECLARED",
      skill: { name: "Next.js", category: "Frontend" },
    });

    const response = await POST(new Request("http://localhost/api/talent/skills", {
      method: "POST",
      body: JSON.stringify({ skillName: "next.js" }),
    }));

    expect(response.status).toBe(200);
    expect(mocks.queryRaw).toHaveBeenCalledOnce();
    expect(mocks.findSkill).toHaveBeenCalledWith({ where: { name: { equals: "Next.js", mode: "insensitive" } } });
    expect(mocks.createSkill).not.toHaveBeenCalled();
  });

  it("limits deletion to the owner's self-declared relation", async () => {
    mocks.getSession.mockResolvedValue({ id: "user-1", role: "TALENT" });
    mocks.deleteMany.mockResolvedValue({ count: 1 });

    const response = await DELETE(new Request("http://localhost/api/talent/skills", {
      method: "DELETE",
      body: JSON.stringify({ talentSkillId: "talent-skill-1" }),
    }));

    expect(response.status).toBe(200);
    expect(mocks.deleteMany).toHaveBeenCalledWith({
      where: {
        id: "talent-skill-1",
        evidenceLevel: "SELF_DECLARED",
        talentProfile: { userId: "user-1" },
      },
    });
  });
});
