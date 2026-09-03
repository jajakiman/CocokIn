import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  findProfile: vi.fn(),
  createAssessment: vi.fn(),
  findSkill: vi.fn(),
  updateTalentSkill: vi.fn(),
}));

vi.mock("@/src/lib/session", () => ({ getSession: mocks.getSession }));
vi.mock("@/src/adapters/database/prisma", () => ({
  prisma: {
    talentProfile: { findUnique: mocks.findProfile },
    $transaction: async (operation: (tx: unknown) => unknown) =>
      operation({
        talentAssessmentResult: { create: mocks.createAssessment },
        skill: { findFirst: mocks.findSkill },
        talentSkill: { updateMany: mocks.updateTalentSkill },
      }),
  },
}));

import { POST } from "@/app/api/talent/assessment/route";

describe("POST /api/talent/assessment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthorized users", async () => {
    mocks.getSession.mockResolvedValue(null);
    const res = await POST(
      new Request("http://localhost/api/talent/assessment", {
        method: "POST",
        body: JSON.stringify({ careerId: "frontend-dev", answers: [] }),
      })
    );
    expect(res.status).toBe(401);
  });

  it("validates answers payload", async () => {
    mocks.getSession.mockResolvedValue({ id: "user-1", role: "TALENT" });
    const res = await POST(
      new Request("http://localhost/api/talent/assessment", {
        method: "POST",
        body: JSON.stringify({ careerId: "invalid-career", answers: [] }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("saves assessment scores and promotes tested skills to ASSESSED", async () => {
    mocks.getSession.mockResolvedValue({ id: "user-1", role: "TALENT" });
    mocks.findProfile.mockResolvedValue({ id: "profile-1", userId: "user-1" });
    mocks.createAssessment.mockResolvedValue({ id: "assessment-1" });
    mocks.findSkill.mockResolvedValue({ id: "skill-html", name: "HTML" });
    mocks.updateTalentSkill.mockResolvedValue({ count: 1 });

    const payload = {
      careerId: "frontend-dev",
      answers: [
        { questionId: "fe-html-1", selectedScore: 100 },
        { questionId: "fe-css-1", selectedScore: 100 },
        { questionId: "fe-js-1", selectedScore: 100 },
        { questionId: "fe-react-1", selectedScore: 100 },
        { questionId: "fe-tailwind-1", selectedScore: 100 },
        { questionId: "fe-nextjs-1", selectedScore: 100 },
        { questionId: "ss-problem-1", selectedScore: 100 },
        { questionId: "ss-comm-1", selectedScore: 100 },
        { questionId: "ss-digital-1", selectedScore: 100 },
      ],
    };

    const res = await POST(
      new Request("http://localhost/api/talent/assessment", {
        method: "POST",
        body: JSON.stringify(payload),
      })
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.result.compositeScore).toBe(100);
    expect(mocks.createAssessment).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          talentProfileId: "profile-1",
          compositeScore: 100,
        }),
      })
    );
    expect(mocks.updateTalentSkill).toHaveBeenCalled();
  });
});
