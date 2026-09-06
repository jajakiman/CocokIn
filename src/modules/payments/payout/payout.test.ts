/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  handleApprovedMilestoneRelease,
  executePayoutTransfer,
  calculateRefundBreakdown,
} from "./payout.service";
import { prisma } from "@/src/adapters/database/prisma";

vi.mock("@/src/adapters/database/prisma", () => {
  const mockPrisma = {
    project: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    projectMilestone: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    payoutInstruction: {
      count: vi.fn().mockResolvedValue(0),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    escrowTransaction: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    ledgerEntry: {
      findMany: vi.fn().mockResolvedValue([
        // Initial state: Escrow funded with 5.5M cash, 5M talent payable
        { accountType: "CASH_AT_BANK", amount: 5_500_000n },
        { accountType: "TALENT_PAYABLE", amount: -5_000_000n },
        { accountType: "COCOKIN_FEE_PENDING", amount: -250_000n },
        { accountType: "COCOKIN_FEE_EARNED", amount: -250_000n },
      ]),
      createMany: vi.fn().mockResolvedValue({ count: 2 }),
    },
    fundingReceipt: {
      update: vi.fn(),
    },
    refundInstruction: {
      create: vi.fn(),
    },
    $transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) => callback(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

describe("Payout & Settlement Module (src/modules/payments/payout)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("handleApprovedMilestoneRelease", () => {
    it("creates PayoutInstruction with exactly 90% of milestone value and leaves 10% retention", async () => {
      const mockTx = {
        projectMilestone: {
          findUnique: vi.fn().mockResolvedValueOnce({
          id: "mile_1",
          title: "Desain Sistem & UI",
          weightBps: 5000, // 50%
          status: "APPROVED",
          project: {
            id: "proj_1",
            serviceValue: 5_000_000n,
            applications: [{
              status: "ACCEPTED",
              talentProfile: {
                payoutAccount: {
                  bankName: "BCA",
                  accountNumber: "1234567890",
                  accountHolder: "Budi Santoso",
                  verifiedAt: new Date("2026-09-01T00:00:00.000Z"),
                },
              },
            }],
          },
          }),
          update: vi.fn(),
        },
        escrowTransaction: {
          findUnique: vi.fn().mockResolvedValueOnce({ id: "escrow_1", projectId: "proj_1" }),
        },
        payoutInstruction: {
          count: vi.fn().mockResolvedValueOnce(0),
          create: vi.fn().mockImplementation((args) => Promise.resolve({ id: "pay_1", ...args.data })),
        },
      } as any;

      const grossAmount = 2_500_000n; // 50% of 5.000.000
      const payout = await handleApprovedMilestoneRelease(mockTx, {
        projectId: "proj_1",
        milestoneId: "mile_1",
        grossAmount,
        approvedAt: new Date(),
        approvedBy: "business_user_1",
      });

      // 90% of 2.500.000 = 2.250.000
      expect(payout.amount).toBe(2_250_000n);
      expect(payout.status).toBe("PAYOUT_DUE");
      expect(payout.platformReference).toContain("CCK-PROJ1-PAYOUT-0001");
      expect(mockTx.payoutInstruction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          recipientBank: "BCA",
          recipientAccount: "1234567890",
          recipientName: "Budi Santoso",
        }),
      });

      // Verify milestone status updated to PAYOUT_DUE
      expect(mockTx.projectMilestone.update).toHaveBeenCalledWith({
        where: { id: "mile_1" },
        data: { status: "PAYOUT_DUE" },
      });
    });

    it("rejects payout instruction when the selected Talent has no verified payout account", async () => {
      const mockTx = {
        projectMilestone: {
          findUnique: vi.fn().mockResolvedValueOnce({
            id: "mile_1",
            status: "APPROVED",
            weightBps: 5000,
            project: {
              id: "proj_1",
              serviceValue: 5_000_000n,
              applications: [{
                status: "ACCEPTED",
                talentProfile: { payoutAccount: null },
              }],
            },
          }),
        },
      } as any;

      await expect(handleApprovedMilestoneRelease(mockTx, {
        projectId: "proj_1",
        milestoneId: "mile_1",
        grossAmount: 2_500_000n,
        approvedAt: new Date(),
        approvedBy: "business_user_1",
      })).rejects.toThrow(/rekening payout Talent terverifikasi/i);
    });

    it("rejects a release whose project or gross amount does not match the approved milestone", async () => {
      const mockTx = {
        projectMilestone: {
          findUnique: vi.fn().mockResolvedValue({
            id: "mile_1",
            status: "APPROVED",
            weightBps: 5000,
            project: { id: "proj_1", serviceValue: 5_000_000n, applications: [] },
          }),
        },
      } as any;

      await expect(handleApprovedMilestoneRelease(mockTx, {
        projectId: "other-project",
        milestoneId: "mile_1",
        grossAmount: 2_500_000n,
        approvedAt: new Date(),
        approvedBy: "business_user_1",
      })).rejects.toThrow(/tidak cocok/i);

      await expect(handleApprovedMilestoneRelease(mockTx, {
        projectId: "proj_1",
        milestoneId: "mile_1",
        grossAmount: 3_000_000n,
        approvedAt: new Date(),
        approvedBy: "business_user_1",
      })).rejects.toThrow(/nominal release/i);
    });
  });

  describe("executePayoutTransfer", () => {
    it("rejects migrated payout instructions without a valid recipient snapshot", async () => {
      vi.mocked(prisma.payoutInstruction.findUnique).mockResolvedValueOnce({
        id: "pay_legacy",
        status: "PAYOUT_DUE",
        recipientBank: "UNSET",
        recipientAccount: "UNSET",
        recipientName: "UNSET",
      } as any);

      await expect(executePayoutTransfer("pay_legacy")).rejects.toThrow(/rekening tujuan payout/i);
      expect(prisma.ledgerEntry.createMany).not.toHaveBeenCalled();
    });

    it("commits payout journal, updates payout to PAID, and advances project when all milestones complete", async () => {
      vi.mocked(prisma.payoutInstruction.findUnique).mockResolvedValueOnce({
        id: "pay_1",
        status: "PAYOUT_DUE",
        amount: 2_250_000n,
        platformReference: "CCK-PRJ1-PAYOUT-0001",
        milestoneId: "mile_1",
        escrowTransactionId: "escrow_1",
        recipientBank: "BCA",
        recipientAccount: "1234567890",
        recipientName: "Budi Santoso",
        escrowTransaction: {
          projectId: "proj_1",
          project: {
            milestones: [{ id: "mile_1" }],
          },
        },
      } as any);

      vi.mocked(prisma.projectMilestone.findMany).mockResolvedValueOnce([]); // No remaining uncompleted milestones

      vi.mocked(prisma.payoutInstruction.update).mockResolvedValueOnce({
        id: "pay_1",
        status: "PAID",
      } as any);

      const result = await executePayoutTransfer("pay_1", "EXT-TRF-001");

      expect(result.status).toBe("PAID");

      // Verify ledger entry created
      expect(prisma.ledgerEntry.createMany).toHaveBeenCalled();

      // Verify milestone updated to PAID
      expect(prisma.projectMilestone.update).toHaveBeenCalledWith({
        where: { id: "mile_1" },
        data: { status: "PAID" },
      });

      // Verify project advanced to HANDOVER_PENDING
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: "proj_1" },
        data: { status: "HANDOVER_PENDING" },
      });
    });
  });

  describe("calculateRefundBreakdown", () => {
    it("calculates refund for uncompleted milestones and unearned pending fee", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        serviceValue: 10_000_000n,
        milestones: [
          { id: "m1", status: "PAID", weightBps: 5000 }, // 5M completed
          { id: "m2", status: "PENDING", weightBps: 5000 }, // 5M uncompleted
        ],
      } as any);

      const refund = await calculateRefundBreakdown("proj_1", false);

      expect(refund.serviceValue).toBe(10_000_000n);
      expect(refund.completedMilestoneValue).toBe(5_000_000n);
      expect(refund.uncompletedMilestoneValue).toBe(5_000_000n);
      expect(refund.pendingPlatformFee).toBe(500_000n); // 5% Success Fee
      expect(refund.grossRefundable).toBe(5_500_000n);
      expect(refund.transferCost).toBe(2500n);
      expect(refund.netRefund).toBe(5_497_500n);
      expect(refund.costBearer).toBe("UMKM");
    });

    it("absorbs transfer cost if refund is platform fault", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        serviceValue: 10_000_000n,
        milestones: [
          { id: "m1", status: "PENDING", weightBps: 10000 },
        ],
      } as any);

      const refund = await calculateRefundBreakdown("proj_1", true);

      expect(refund.transferCost).toBe(0n);
      expect(refund.netRefund).toBe(refund.grossRefundable);
      expect(refund.costBearer).toBe("COCOKIN");
    });
  });
});
