import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getSession: vi.fn(), findMessage: vi.fn(), createReport: vi.fn() }));

vi.mock("@/src/lib/session", () => ({ getSession: mocks.getSession }));
vi.mock("@/src/adapters/database/prisma", () => ({
  prisma: {
    chatMessage: { findUnique: mocks.findMessage },
    messageReport: { create: mocks.createReport },
  },
}));

import { reportMessageAction } from "./chat-actions";

describe("reportMessageAction", () => {
  it("rejects reports from users outside the project conversation", async () => {
    mocks.getSession.mockResolvedValue({ id: "outsider", role: "TALENT", email: "out@example.test", displayName: "Outsider" });
    mocks.findMessage.mockResolvedValue({
      id: "message-1",
      senderId: "sender-1",
      content: "Private message",
      createdAt: new Date(),
      conversation: { participants: [] },
    });
    const formData = new FormData();
    formData.set("messageId", "message-1");
    formData.set("reason", "Pesan ini melanggar aturan proyek.");

    const result = await reportMessageAction(null, formData);

    expect(result.ok).toBe(false);
    expect(result.message).toContain("bukan peserta");
    expect(mocks.createReport).not.toHaveBeenCalled();
  });
});
