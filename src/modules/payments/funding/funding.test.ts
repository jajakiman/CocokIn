import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getOrCreateFundingInstruction,
  submitFundingProof,
  reconcileFundingDeposit,
} from "./funding.service";
import { prisma } from "@/src/adapters/database/prisma";

vi.mock("@/src/adapters/database/prisma", () => {
  const mockPrisma = {
    project: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    fundingReceipt: {
      create: vi.fn(),
      update: vi.fn(),
    },
    escrowTransaction: {
      create: vi.fn(),
    },
    ledgerEntry: {
      findMany: vi.fn().mockResolvedValue([]),
      createMany: vi.fn().mockResolvedValue({ count: 2 }),
    },
    $transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) => callback(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

describe("Simulated Funding & Reconciliation Module (src/modules/payments/funding)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getOrCreateFundingInstruction", () => {
    it("generates instructions with exact 10% platform fee and Bank VA", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_abc_123",
        title: "Website E-Commerce UMKM",
        serviceValue: 5_000_000n,
        fundingReceipt: null,
      } as any);

      vi.mocked(prisma.fundingReceipt.create).mockResolvedValueOnce({
        id: "rec_1",
        projectId: "proj_abc_123",
        status: "AWAITING_PAYMENT",
        amountDue: 5_500_000n,
        platformReference: "CCK-BC123-FUNDING-0001",
        createdAt: new Date(),
      } as any);

      const instruction = await getOrCreateFundingInstruction("proj_abc_123", "BANK_TRANSFER", "BCA");

      expect(instruction.serviceValue).toBe(5_000_000n);
      expect(instruction.totalPlatformFee).toBe(500_000n);
      expect(instruction.fundingDue).toBe(5_500_000n);
      expect(instruction.bankName).toBe("BCA");
      expect(instruction.accountNumber).toContain("88012");
      expect(instruction.accountHolder).toBe("PT COCOKIN TEKNOLOGI INDONESIA");
      expect(instruction.platformReference).toMatch(/^CCK-[A-Z0-9]+-FUNDING-\d{4}$/);
    });

    it("generates QRIS payload when QRIS method selected", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_abc_123",
        title: "Website E-Commerce UMKM",
        serviceValue: 3_000_000n,
        fundingReceipt: {
          id: "rec_1",
          projectId: "proj_abc_123",
          status: "AWAITING_PAYMENT",
          amountDue: 3_300_000n,
          platformReference: "CCK-BC123-FUNDING-0001",
          createdAt: new Date(),
        },
      } as any);

      const instruction = await getOrCreateFundingInstruction("proj_abc_123", "QRIS");

      expect(instruction.paymentMethod).toBe("QRIS");
      expect(instruction.qrisCodePayload).toBeDefined();
      expect(instruction.qrisCodePayload).toContain("PT COCOKIN IND");
    });
  });

  describe("submitFundingProof", () => {
    it("transitions receipt to PROOF_SUBMITTED and project to FUNDING_PENDING", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        businessProfile: { userId: "user_owner" },
        fundingReceipt: {
          id: "rec_1",
          status: "AWAITING_PAYMENT",
        },
      } as any);

      vi.mocked(prisma.fundingReceipt.update).mockResolvedValueOnce({
        id: "rec_1",
        status: "PROOF_SUBMITTED",
      } as any);

      const result = await submitFundingProof("user_owner", "proj_1", {
        senderBank: "BCA",
        senderAccount: "1234567890",
        senderName: "Budi Santoso",
        amountTransferred: 5_500_000n,
      });

      expect(result.status).toBe("PROOF_SUBMITTED");
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: "proj_1" },
        data: { status: "FUNDING_PENDING" },
      });
    });

    it("throws unauthorized error if submitter is not business owner", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        businessProfile: { userId: "other_user" },
        fundingReceipt: { id: "rec_1" },
      } as any);

      await expect(
        submitFundingProof("unauthorized_user", "proj_1", {
          senderBank: "BCA",
          senderAccount: "12345",
          senderName: "Hacker",
          amountTransferred: 5_500_000n,
        })
      ).rejects.toThrow(/Akses ditolak/);
    });
  });

  describe("reconcileFundingDeposit", () => {
    it("detects AMOUNT_MISMATCH when transferred amount is less than amountDue", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        serviceValue: 5_000_000n,
        fundingReceipt: {
          id: "rec_1",
          status: "PROOF_SUBMITTED",
          amountDue: 5_500_000n,
          amountReceived: 4_000_000n, // Underpaid
        },
      } as any);

      vi.mocked(prisma.fundingReceipt.update).mockResolvedValueOnce({
        id: "rec_1",
        status: "AMOUNT_MISMATCH",
      } as any);

      const result = await reconcileFundingDeposit("proj_1", {
        approved: true,
        amountReceived: 4_000_000n,
      });

      expect(result.status).toBe("AMOUNT_MISMATCH");
    });

    it("successfully reconciles, creates escrow ledger entries, recognizes activation fee, and sets project IN_PROGRESS", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        serviceValue: 5_000_000n,
        fundingReceipt: {
          id: "rec_1",
          status: "PROOF_SUBMITTED",
          amountDue: 5_500_000n,
          amountReceived: 5_500_000n,
          platformReference: "CCK-PRJ1-FUNDING-0001",
        },
        escrowTransaction: null,
      } as any);

      vi.mocked(prisma.escrowTransaction.create).mockResolvedValueOnce({
        id: "escrow_1",
        projectId: "proj_1",
      } as any);

      vi.mocked(prisma.fundingReceipt.update).mockResolvedValueOnce({
        id: "rec_1",
        status: "FUNDED",
        amountReceived: 5_500_000n,
        externalReference: "EXT-BANK-001",
      } as any);

      const result = await reconcileFundingDeposit("proj_1", {
        approved: true,
        amountReceived: 5_500_000n,
        externalReference: "EXT-BANK-001",
      });

      expect(result.status).toBe("FUNDED");

      // Verify project moved to IN_PROGRESS
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: "proj_1" },
        data: { status: "IN_PROGRESS" },
      });

      // Verify ledger entries were created (deposit journal + activation fee journal)
      expect(prisma.ledgerEntry.createMany).toHaveBeenCalledTimes(2);
    });
  });
});
