/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  startWarrantyPeriod,
  createSupportTicket,
  checkAndReleaseWarrantyRetention,
} from "./warranty.service";
import { prisma } from "@/src/adapters/database/prisma";

vi.mock("@/src/adapters/database/prisma", () => {
  const mockPrisma = {
    project: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    warrantyAgreement: {
      upsert: vi.fn(),
      update: vi.fn(),
    },
    maintenancePackage: {
      upsert: vi.fn(),
      update: vi.fn(),
    },
    supportTicket: {
      create: vi.fn(),
      update: vi.fn(),
    },
    ledgerEntry: {
      findMany: vi.fn().mockResolvedValue([
        { accountType: "CASH_AT_BANK", amount: 1_500_000n },
        { accountType: "TALENT_PAYABLE", amount: -1_000_000n },
        { accountType: "COCOKIN_FEE_PENDING", amount: -500_000n },
      ]),
      createMany: vi.fn().mockResolvedValue({ count: 2 }),
    },
    $transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) => callback(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

describe("Warranty & Maintenance Module (src/modules/support)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("startWarrantyPeriod", () => {
    it("starts 30-day warranty agreement and initializes 5-ticket quota", async () => {
      const fixedStart = new Date("2026-09-01T00:00:00Z");
      const expectedEnd = new Date("2026-10-01T00:00:00Z"); // exactly 30 days

      vi.mocked(prisma.warrantyAgreement.upsert).mockResolvedValueOnce({
        id: "w_1",
        projectId: "proj_1",
        status: "ACTIVE",
        startDate: fixedStart,
        endDate: expectedEnd,
      } as any);

      const result = await startWarrantyPeriod("proj_1", fixedStart);

      expect(result.status).toBe("ACTIVE");
      const durationMs = (result.endDate ? result.endDate.getTime() : 0) - (result.startDate ? result.startDate.getTime() : 0);
      expect(durationMs).toBe(30 * 24 * 60 * 60 * 1000);
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: "proj_1" },
        data: { status: "DELIVERED" },
      });
    });
  });

  describe("createSupportTicket", () => {
    it("deducts quota and creates support ticket", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        businessProfile: { userId: "user_owner" },
        warrantyAgreement: { status: "ACTIVE" },
        maintenancePackage: { ticketQuota: 5 },
      } as any);

      vi.mocked(prisma.supportTicket.create).mockResolvedValueOnce({
        id: "tick_1",
        projectId: "proj_1",
        severity: "CRITICAL",
        description: "Tombol checkout error",
        status: "OPEN",
      } as any);

      const ticket = await createSupportTicket("user_owner", "proj_1", {
        severity: "CRITICAL",
        description: "Tombol checkout error",
      });

      expect(ticket.status).toBe("OPEN");
      expect(prisma.maintenancePackage.update).toHaveBeenCalledWith({
        where: { projectId: "proj_1" },
        data: { ticketQuota: { decrement: 1 } },
      });
    });

    it("rejects ticket creation if quota has been exhausted", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        businessProfile: { userId: "user_owner" },
        warrantyAgreement: { status: "ACTIVE" },
        maintenancePackage: { ticketQuota: 0 }, // exhausted!
      } as any);

      await expect(
        createSupportTicket("user_owner", "proj_1", {
          severity: "MINOR",
          description: "Ganti warna footer",
        })
      ).rejects.toThrow(/Kuota 5 tiket pemeliharaan untuk proyek ini telah habis/);
    });
  });

  describe("checkAndReleaseWarrantyRetention", () => {
    it("refuses to release retention if 30 days have not passed", async () => {
      const start = new Date("2026-09-01T00:00:00Z");
      const end = new Date("2026-10-01T00:00:00Z");
      const checkDate = new Date("2026-09-15T00:00:00Z"); // Only 14 days passed

      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        serviceValue: 10_000_000n,
        warrantyAgreement: { status: "ACTIVE", startDate: start, endDate: end },
        supportTickets: [],
        disputes: [],
      } as any);

      const result = await checkAndReleaseWarrantyRetention("proj_1", checkDate);

      expect(result.released).toBe(false);
      if (!result.released) {
        expect(result.reason).toContain("Masa garansi 30 hari belum berakhir");
      }
    });

    it("refuses to release retention if active support tickets exist", async () => {
      const start = new Date("2026-09-01T00:00:00Z");
      const end = new Date("2026-10-01T00:00:00Z");
      const checkDate = new Date("2026-10-02T00:00:00Z"); // 31 days passed

      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        serviceValue: 10_000_000n,
        warrantyAgreement: { status: "ACTIVE", startDate: start, endDate: end },
        supportTickets: [{ status: "OPEN" }], // 1 open ticket
        disputes: [],
      } as any);

      const result = await checkAndReleaseWarrantyRetention("proj_1", checkDate);

      expect(result.released).toBe(false);
      if (!result.released) {
        expect(result.reason).toContain("tiket pemeliharaan aktif yang belum selesai");
      }
    });

    it("successfully releases 10% retention and completes project when criteria met", async () => {
      const start = new Date("2026-09-01T00:00:00Z");
      const end = new Date("2026-10-01T00:00:00Z");
      const checkDate = new Date("2026-10-02T00:00:00Z"); // 31 days passed

      vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
        id: "proj_1",
        serviceValue: 10_000_000n,
        warrantyAgreement: { status: "ACTIVE", startDate: start, endDate: end },
        supportTickets: [{ status: "RESOLVED" }], // resolved!
        disputes: [],
        escrowTransaction: { id: "escrow_1" },
      } as any);

      const result = await checkAndReleaseWarrantyRetention("proj_1", checkDate);

      expect(result.released).toBe(true);
      if (result.released) {
        expect(result.retentionAmount).toBe(1_000_000n); // 10% of 10M
        expect(result.successFee).toBe(500_000n); // 5% of 10M
      }

      // Statuses updated to COMPLETED
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
