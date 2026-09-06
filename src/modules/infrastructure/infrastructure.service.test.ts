/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitHandover, reviewHandover } from "./infrastructure.service";
import { prisma } from "@/src/adapters/database/prisma";
import { startWarrantyPeriod } from "@/src/modules/support/warranty.service";

vi.mock("@/src/adapters/database/prisma", () => {
  const mockPrisma = {
    project: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    infrastructureHandover: {
      upsert: vi.fn(),
      update: vi.fn(),
    },
    businessAssessmentResult: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) => callback(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

vi.mock("@/src/modules/support/warranty.service", () => ({
  startWarrantyPeriod: vi.fn().mockResolvedValue({ id: "w_1", status: "ACTIVE" }),
}));

vi.mock("@/src/modules/notifications/notification.service", () => ({
  createNotification: vi.fn().mockResolvedValue({ id: "notif_1" }),
}));

describe("Infrastructure & Handover Service (src/modules/infrastructure)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("submitHandover", () => {
    it("transitions project to HANDOVER_REVIEW and notifies UMKM", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        title: "Katalog Kopi",
        applications: [{ status: "ACCEPTED" }],
        milestones: [
          { id: "m1", status: "APPROVED" },
          { id: "m2", status: "PAID" },
        ],
        businessProfile: { userId: "biz_user_123" },
      } as any);

      vi.mocked(prisma.infrastructureHandover.upsert).mockResolvedValueOnce({
        id: "h_1",
        projectId: "proj_1",
        status: "PENDING",
      } as any);

      const result = await submitHandover(
        "talent_user_1",
        "proj_1",
        "https://kopi.example.com",
        { domainConfigured: true, httpsActive: true, sourceCodeTransferred: true }
      );

      expect(result.status).toBe("PENDING");
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: "proj_1" },
        data: { status: "HANDOVER_PENDING" },
      });
    });

    it("rejects handover submission if any milestone is not yet approved/paid", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        applications: [{ status: "ACCEPTED" }],
        milestones: [
          { id: "m1", status: "APPROVED" },
          { id: "m2", status: "PENDING" }, // Belum disetujui!
        ],
        businessProfile: { userId: "biz_user_123" },
      } as any);

      await expect(
        submitHandover("talent_user_1", "proj_1", "https://kopi.example.com", {})
      ).rejects.toThrow(/Semua milestone harus disetujui sebelum melakukan handover/);
    });
  });

  describe("reviewHandover", () => {
    it("activates 30-day warranty period when UMKM accepts handover", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        title: "Katalog Kopi",
        businessProfile: { userId: "biz_owner_1" },
        businessProfileId: "biz_prof_1",
        applications: [{ talentProfile: { userId: "talent_1" } }],
      } as any);

      vi.mocked(prisma.infrastructureHandover.update).mockResolvedValueOnce({
        id: "h_1",
        status: "ACCEPTED",
      } as any);

      await reviewHandover("biz_owner_1", "proj_1", "ACCEPTED");

      // Verify startWarrantyPeriod called
      expect(startWarrantyPeriod).toHaveBeenCalledWith("proj_1");
    });
  });
});
