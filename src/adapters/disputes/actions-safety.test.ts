import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveDisputeAction } from "@/src/adapters/disputes/dispute-actions";
import { submitPaymentProofAction } from "@/src/adapters/payment/funding-actions";
import { executePayoutTransferAction } from "@/src/adapters/payment/payout-actions";
import { getSession } from "@/src/lib/session";
import { resolveDispute } from "@/src/modules/disputes";
import { submitFundingProof } from "@/src/modules/payments/funding";
import { executePayoutTransfer } from "@/src/modules/payments/payout";

vi.mock("@/src/lib/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/src/modules/disputes", () => ({
  resolveDispute: vi.fn(),
}));

vi.mock("@/src/modules/payments/funding", () => ({
  submitFundingProof: vi.fn(),
  reconcileFundingDeposit: vi.fn(),
  simulateInstantFundingSuccess: vi.fn(),
}));

vi.mock("@/src/modules/payments/payout", () => ({
  executePayoutTransfer: vi.fn(),
  executeRefundTransfer: vi.fn(),
}));

const mockAdminSession = { id: "admin_1", role: "ADMIN" as const, email: "admin@cocokin.id", displayName: "Admin" };
const mockBusinessSession = { id: "biz_1", role: "BUSINESS" as const, email: "umkm@cocokin.id", displayName: "UMKM" };

describe("Server Actions Safety & Zod Validation (Review Prioritas 1)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("resolveDisputeAction", () => {
    it("auto-calculates 100% talent / 0% umkm for FAVOR_TALENT resolution", async () => {
      vi.mocked(getSession).mockResolvedValueOnce(mockAdminSession);

      const formData = new FormData();
      formData.append("disputeId", "disp_123");
      formData.append("resolution", "FAVOR_TALENT");
      formData.append("notes", "Karya sudah sesuai brief dan lolos acceptance criteria.");

      const result = await resolveDisputeAction(null, formData);

      expect(result.ok).toBe(true);
      expect(resolveDispute).toHaveBeenCalledWith("admin_1", "disp_123", {
        resolution: "FAVOR_TALENT",
        notes: "Karya sudah sesuai brief dan lolos acceptance criteria.",
        talentSharePercent: 100,
        umkmSharePercent: 0,
      });
    });

    it("auto-calculates 0% talent / 100% umkm for FAVOR_UMKM resolution", async () => {
      vi.mocked(getSession).mockResolvedValueOnce(mockAdminSession);

      const formData = new FormData();
      formData.append("disputeId", "disp_123");
      formData.append("resolution", "FAVOR_UMKM");
      formData.append("notes", "Fitur utama tidak diselesaikan oleh talent.");

      const result = await resolveDisputeAction(null, formData);

      expect(result.ok).toBe(true);
      expect(resolveDispute).toHaveBeenCalledWith("admin_1", "disp_123", {
        resolution: "FAVOR_UMKM",
        notes: "Fitur utama tidak diselesaikan oleh talent.",
        talentSharePercent: 0,
        umkmSharePercent: 100,
      });
    });

    it("defaults to 50/50 for SPLIT if no custom percentage is sent", async () => {
      vi.mocked(getSession).mockResolvedValueOnce(mockAdminSession);

      const formData = new FormData();
      formData.append("disputeId", "disp_123");
      formData.append("resolution", "SPLIT");
      formData.append("notes", "Keduanya memiliki andil keterlambatan.");

      const result = await resolveDisputeAction(null, formData);

      expect(result.ok).toBe(true);
      expect(resolveDispute).toHaveBeenCalledWith("admin_1", "disp_123", {
        resolution: "SPLIT",
        notes: "Keduanya memiliki andil keterlambatan.",
        talentSharePercent: 50,
        umkmSharePercent: 50,
      });
    });

    it("rejects non-admin role", async () => {
      vi.mocked(getSession).mockResolvedValueOnce(mockBusinessSession);

      const formData = new FormData();
      formData.append("disputeId", "disp_123");

      const result = await resolveDisputeAction(null, formData);

      expect(result.ok).toBe(false);
      expect(result.message).toContain("Hanya tim Admin");
      expect(resolveDispute).not.toHaveBeenCalled();
    });
  });

  describe("submitPaymentProofAction safe BigInt & Zod parsing", () => {
    it("safely extracts numeric BigInt from formatted currency or string with dots", async () => {
      vi.mocked(getSession).mockResolvedValueOnce(mockBusinessSession);

      const formData = new FormData();
      formData.append("projectId", "prj_99");
      formData.append("senderBank", "BCA");
      formData.append("senderAccount", "1234567890");
      formData.append("senderName", "Budi Santoso");
      formData.append("destinationBank", "BCA");
      formData.append("destinationAccount", "9999999999999999");
      formData.append("amountTransferred", "Rp 5.500.000"); // Formatted string with Rp and dots!

      const result = await submitPaymentProofAction(null, formData);

      expect(result.ok).toBe(true);
      expect(submitFundingProof).toHaveBeenCalledWith("biz_1", "prj_99", {
        paymentMethod: "BANK_TRANSFER",
        destinationBank: "BCA",
        senderBank: "BCA",
        senderAccount: "1234567890",
        senderName: "Budi Santoso",
        paymentReference: undefined,
        amountTransferred: 5_500_000n,
      });
    });

    it("submits QRIS proof with payment reference without bank account fields", async () => {
      vi.mocked(getSession).mockResolvedValueOnce(mockBusinessSession);

      const formData = new FormData();
      formData.append("projectId", "prj_99");
      formData.append("paymentMethod", "QRIS");
      formData.append("senderName", "Budi Santoso");
      formData.append("paymentReference", "QRIS-RRN-9081726354");
      formData.append("amountTransferred", "5500000");

      const result = await submitPaymentProofAction(null, formData);

      expect(result.ok).toBe(true);
      expect(submitFundingProof).toHaveBeenCalledWith("biz_1", "prj_99", {
        paymentMethod: "QRIS",
        senderBank: undefined,
        senderAccount: undefined,
        senderName: "Budi Santoso",
        paymentReference: "QRIS-RRN-9081726354",
        amountTransferred: 5_500_000n,
      });
    });

    it("rejects non-numeric transfer amount gracefully without throwing syntax crash", async () => {
      vi.mocked(getSession).mockResolvedValueOnce(mockBusinessSession);

      const formData = new FormData();
      formData.append("projectId", "prj_99");
      formData.append("senderBank", "BCA");
      formData.append("senderAccount", "1234567890");
      formData.append("senderName", "Budi Santoso");
      formData.append("destinationBank", "BCA");
      formData.append("amountTransferred", "abc-bukan-angka");

      const result = await submitPaymentProofAction(null, formData);

      expect(result.ok).toBe(false);
      expect(result.message).toContain("Nominal transfer wajib berupa angka positif");
      expect(submitFundingProof).not.toHaveBeenCalled();
    });
  });

  describe("executePayoutTransferAction Zod validation", () => {
    it("rejects empty payout instruction id", async () => {
      vi.mocked(getSession).mockResolvedValueOnce(mockAdminSession);

      const formData = new FormData();
      formData.append("payoutInstructionId", "");

      const result = await executePayoutTransferAction(null, formData);

      expect(result.ok).toBe(false);
      expect(result.message).toContain("ID Instruksi Payout wajib diisi");
      expect(executePayoutTransfer).not.toHaveBeenCalled();
    });
  });
});
