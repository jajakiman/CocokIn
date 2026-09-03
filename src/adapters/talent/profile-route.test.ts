import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  hasAccess: vi.fn(),
  updateUser: vi.fn(),
  upsertProfile: vi.fn(),
  createSession: vi.fn(),
}));

vi.mock("@/src/lib/session", () => ({
  getSession: mocks.getSession,
  createSession: mocks.createSession,
}));
vi.mock("@/src/modules/talent/feature-access", () => ({ hasTalentFeatureAccess: mocks.hasAccess }));
vi.mock("@/src/adapters/database/prisma", () => ({
  prisma: {
    $transaction: async (operation: (tx: unknown) => unknown) => operation({
      user: { update: mocks.updateUser },
      talentProfile: { upsert: mocks.upsertProfile },
    }),
  },
}));

import { POST } from "@/app/api/talent/profile/route";

describe("Talent profile route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("combines names, preserves work terms, and refreshes the session", async () => {
    mocks.getSession.mockResolvedValue({ id: "user-1", role: "TALENT" });
    mocks.hasAccess.mockResolvedValue(true);
    mocks.updateUser.mockResolvedValue({ id: "user-1", email: "nadia@example.com", name: "Nadia Arina", role: "TALENT" });
    mocks.upsertProfile.mockResolvedValue({ id: "profile-1" });

    const response = await POST(new Request("http://localhost/api/talent/profile", {
      method: "POST",
      body: JSON.stringify({
        firstName: " Nadia ",
        lastName: " Arina ",
        bio: "Frontend developer",
        university: "Universitas Indonesia",
        major: "Sistem Informasi",
        careerTarget: "Frontend Developer",
      }),
    }));

    expect(response.status).toBe(200);
    expect(mocks.updateUser).toHaveBeenCalledWith(expect.objectContaining({ data: { name: "Nadia Arina" } }));
    expect(mocks.upsertProfile).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      update: {
        bio: "Frontend developer",
        university: "Universitas Indonesia",
        major: "Sistem Informasi",
        careerTarget: "Frontend Developer",
      },
      create: {
        userId: "user-1",
        bio: "Frontend developer",
        university: "Universitas Indonesia",
        major: "Sistem Informasi",
        careerTarget: "Frontend Developer",
      },
    });
    expect(mocks.createSession).toHaveBeenCalledWith({
      id: "user-1",
      email: "nadia@example.com",
      displayName: "Nadia Arina",
      role: "TALENT",
    });
  });
});
