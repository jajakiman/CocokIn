import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  session: vi.fn(), skill: vi.fn(), requirement: vi.fn(), question: vi.fn(), deleteOptions: vi.fn(), createOptions: vi.fn(), audit: vi.fn(), toggle: vi.fn(), transaction: vi.fn(),
}));
vi.mock("@/src/lib/session", () => ({ getSession: mocks.session }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/src/adapters/database/prisma", () => ({ prisma: {
  skill: { create: mocks.skill },
  careerSkillRequirement: { upsert: mocks.requirement },
  assessmentQuestionRecord: { upsert: mocks.question, update: mocks.toggle },
  assessmentOptionRecord: { deleteMany: mocks.deleteOptions, createMany: mocks.createOptions },
  auditEvent: { create: mocks.audit },
  $transaction: async (operation: (tx: unknown) => unknown) => operation({
    assessmentQuestionRecord: { upsert: mocks.question }, assessmentOptionRecord: { deleteMany: mocks.deleteOptions, createMany: mocks.createOptions }, auditEvent: { create: mocks.audit },
  }),
} }));

import { createSkillAction, saveAssessmentQuestionAction } from "./taxonomy-actions";

const admin = { id: "admin-1", role: "ADMIN", email: "admin@example.test", displayName: "Admin" };

describe("Admin taxonomy actions", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.session.mockResolvedValue(admin); });

  it("rejects skill creation by non-admin", async () => {
    mocks.session.mockResolvedValue({ ...admin, role: "BUSINESS" });
    const data = new FormData(); data.set("key", "new-skill"); data.set("name", "New Skill"); data.set("category", "TECHNICAL");
    expect((await createSkillAction(null, data)).ok).toBe(false);
    expect(mocks.skill).not.toHaveBeenCalled();
  });

  it("rejects question options unless exactly one option scores 100", async () => {
    const data = new FormData();
    data.set("id", "question-1"); data.set("audience", "TALENT"); data.set("kind", "TECHNICAL"); data.set("careerKey", "fullstack-dev"); data.set("skillKey", "javascript"); data.set("text", "Pertanyaan yang cukup panjang?"); data.set("position", "1");
    data.set("optionsJson", JSON.stringify([{ label: "A", score: 100 }, { label: "B", score: 100 }, { label: "C", score: 0 }, { label: "D", score: 0 }]));
    const result = await saveAssessmentQuestionAction(null, data);
    expect(result.ok).toBe(false);
    expect(result.message).toContain("tepat satu");
    expect(mocks.question).not.toHaveBeenCalled();
  });
});
