import { describe, it, expect, vi, beforeEach } from "vitest";
import { raiseDispute, resolveDispute } from "./dispute.service";
import { prisma } from "@/src/adapters/database/prisma";

vi.mock("@/src/adapters/database/prisma", () => {
  const mockPrisma = {
    project: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    warrantyAgreement: {
      update: vi.fn(),
    },
    dispute: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    disputeEvidence: {
      createMany: vi.fn(),
    },
    disputeDecision: {
      create: vi.fn(),
    },
    ledgerEntry: {
      findMany: vi.fn().mockResolvedValue([
        { accountType: "CASH_AT_BANK", amount: 1_000_000n },
        { accountType: "TALENT_PAYABLE", amount: -1_000_000n },
      ]),
      createMany: vi.fn().mockResolvedValue({ count: 2 }),
    },
    $transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) => callback(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

describe("Dispute Management Desk (src/modules/disputes)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("raiseDispute", () => {
    it("freezes project and warranty to DISPUTED and persists immutable evidence", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        warrantyAgreement: { id: "w_1", status: "ACTIVE" },
      } as any);

      vi.mocked(prisma.dispute.create).mockResolvedValueOnce({
        id: "disp_1",
        projectId: "proj_1",
        reason: "Fitur pencarian tidak sesuai spesifikasi",
        status: "OPEN",
      } as any);

      const dispute = await raiseDispute(
        "user_owner",
        "proj_1",
        "Fitur pencarian tidak sesuai spesifikasi",
        ["https://storage.cocokin.com/evidence1.png"]
      );

      expect(dispute.status).toBe("OPEN");
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: "proj_1" },
        data: { status: "DISPUTED" },
      });
      expect(prisma.warrantyAgreement.update).toHaveBeenCalledWith({
        where: { projectId: "proj_1" },
        data: { status: "DISPUTED" },
      });
      expect(prisma.disputeEvidence.createMany).toHaveBeenCalledWith({
        data: [{ disputeId: "disp_1", fileUrl: "https://storage.cocokin.com/evidence1.png", submitterId: "user_owner" }],
      });
    });
  });

  describe("resolveDispute", () => {
    it("rejects resolution if split shares do not sum to 100", async () => {
      await expect(
        resolveDispute("admin_user_1", "disp_1", {
          resolution: "SPLIT",
          notes: "Pembagian seimbang",
          talentSharePercent: 60,
          umkmSharePercent: 30, // Sum = 90, not 100!
        })
      ).rejects.toThrow(/Total persentase pembagian harus tepat 100%/);
    });

    it("resolves dispute with SPLIT, creates compensating ledger entries, and completes project", async () => {
      vi.mocked(prisma.dispute.findUnique).mockResolvedValueOnce({
        id: "disp_1",
        status: "OPEN",
        project: {
          id: "proj_1",
          serviceValue: 10_000_000n, // Retention = 1.000.000n
          escrowTransaction: { id: "escrow_1" },
          warrantyAgreement: { id: "w_1", status: "DISPUTED" },
        },
      } as any);

      vi.mocked(prisma.disputeDecision.create).mockResolvedValueOnce({
        id: "dec_1",
        disputeId: "disp_1",
        resolverId: "admin_user_1",
        resolution: "SPLIT",
        notes: "60% Talent, 40% UMKM",
        talentSharePercent: 60,
        umkmSharePercent: 40,
      } as any);

      const decision = await resolveDispute("admin_user_1", "disp_1", {
        resolution: "SPLIT",
        notes: "60% Talent, 40% UMKM",
        talentSharePercent: 60,
        umkmSharePercent: 40,
      });

      expect(decision.resolution).toBe("SPLIT");

      // Ledger entries created for both Talent (600.000) and UMKM (400.000)
      expect(prisma.ledgerEntry.createMany).toHaveBeenCalledTimes(2);

      // Statuses updated
      expect(prisma.dispute.update).toHaveBeenCalledWith({
        where: { id: "disp_1" },
        data: { status: "RESOLVED" },
      });
      expect(prisma.warrantyAgreement.update).toHaveBeenCalledWith({
        where: { projectId: "proj_1" },
        data: { status: "COMPLETED" },
      });
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: "proj_1" },
        data: { status: "COMPLETED" },
      });
    });
  });
});
