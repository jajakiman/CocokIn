import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  findUser: vi.fn(),
  updateUser: vi.fn(),
  findReport: vi.fn(),
  updateReport: vi.fn(),
  createAudit: vi.fn(),
}));

vi.mock("@/src/lib/session", () => ({ getSession: mocks.getSession }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/src/adapters/database/prisma", () => ({
  prisma: {
    user: { findUnique: mocks.findUser, updateMany: mocks.updateUser },
    messageReport: { findUnique: mocks.findReport, updateMany: mocks.updateReport },
    auditEvent: { create: mocks.createAudit },
    $transaction: async (operation: (tx: unknown) => unknown) => operation({
      user: { findUnique: mocks.findUser, updateMany: mocks.updateUser },
      messageReport: { findUnique: mocks.findReport, updateMany: mocks.updateReport },
      auditEvent: { create: mocks.createAudit },
    }),
  },
}));

import {
  resolveMessageReportAction,
  restoreUserAction,
  suspendUserAction,
} from "./moderation-actions";

const admin = {
  id: "admin-1",
  role: "ADMIN" as const,
  email: "admin@example.test",
  displayName: "Admin",
};

describe("Admin moderation actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.updateUser.mockResolvedValue({ count: 1 });
    mocks.updateReport.mockResolvedValue({ count: 1 });
  });

  it("rejects moderation by a non-admin", async () => {
    mocks.getSession.mockResolvedValue({ ...admin, role: "BUSINESS" });
    const formData = new FormData();
    formData.set("userId", "talent-1");
    formData.set("reason", "Pelanggaran berulang pada komunikasi proyek.");
    formData.set("confirmed", "true");

    const result = await suspendUserAction(null, formData);

    expect(result.ok).toBe(false);
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it("suspends a non-admin account and records an audit event", async () => {
    mocks.getSession.mockResolvedValue(admin);
    mocks.findUser.mockResolvedValue({ id: "talent-1", role: "TALENT", isSuspended: false });
    const formData = new FormData();
    formData.set("userId", "talent-1");
    formData.set("reason", "Pelanggaran berulang pada komunikasi proyek.");
    formData.set("confirmed", "true");

    const result = await suspendUserAction(null, formData);

    expect(result.ok).toBe(true);
    expect(mocks.updateUser).toHaveBeenCalledWith({
      where: { id: "talent-1", role: { not: "ADMIN" }, isSuspended: false },
      data: expect.objectContaining({
        isSuspended: true,
        suspensionReason: "Pelanggaran berulang pada komunikasi proyek.",
      }),
    });
    expect(mocks.createAudit).toHaveBeenCalledWith({
      data: expect.objectContaining({ action: "USER_SUSPENDED", actorId: "admin-1" }),
    });
  });

  it("refuses to suspend an admin account", async () => {
    mocks.getSession.mockResolvedValue(admin);
    mocks.findUser.mockResolvedValue({ id: "admin-2", role: "ADMIN", isSuspended: false });
    const formData = new FormData();
    formData.set("userId", "admin-2");
    formData.set("reason", "Alasan yang cukup panjang.");
    formData.set("confirmed", "true");

    const result = await suspendUserAction(null, formData);

    expect(result.ok).toBe(false);
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it("restores a suspended account and clears suspension metadata", async () => {
    mocks.getSession.mockResolvedValue(admin);
    mocks.findUser.mockResolvedValue({ id: "talent-1", role: "TALENT", isSuspended: true });
    const formData = new FormData();
    formData.set("userId", "talent-1");
    formData.set("reason", "Akun telah memenuhi proses pemulihan.");

    const result = await restoreUserAction(null, formData);

    expect(result.ok).toBe(true);
    expect(mocks.updateUser).toHaveBeenCalledWith({
      where: { id: "talent-1", role: { not: "ADMIN" }, isSuspended: true },
      data: { isSuspended: false, suspendedAt: null, suspensionReason: null },
    });
  });

  it("resolves a message report without deleting its audit history", async () => {
    mocks.getSession.mockResolvedValue(admin);
    mocks.findReport.mockResolvedValue({ id: "report-1", status: "PENDING" });
    const formData = new FormData();
    formData.set("reportId", "report-1");
    formData.set("resolution", "DISMISSED");
    formData.set("notes", "Tidak ditemukan pelanggaran setelah konteks ditinjau.");

    const result = await resolveMessageReportAction(null, formData);

    expect(result.ok).toBe(true);
    expect(mocks.updateReport).toHaveBeenCalledWith({
      where: { id: "report-1", status: "PENDING" },
      data: expect.objectContaining({
        status: "DISMISSED",
        resolutionNotes: "Tidak ditemukan pelanggaran setelah konteks ditinjau.",
        resolvedById: "admin-1",
      }),
    });
  });
});
