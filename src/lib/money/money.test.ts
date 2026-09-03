import { describe, it, expect } from "vitest";
import {
  FINANCIAL_CONSTANTS,
  applyBps,
  calculateProjectFinancials,
  calculateMilestoneFinancials,
  formatIdr,
  parseIdr,
  createPlatformReference,
  checkLiabilityReserve,
} from "./money";

describe("Money Library (src/lib/money)", () => {
  describe("Basis Point Math (applyBps)", () => {
    it("should calculate 5% (500 bps) correctly on round numbers", () => {
      expect(applyBps(10_000_000n, 500)).toBe(500_000n);
    });

    it("should calculate 90% (9000 bps) and 10% (1000 bps) correctly", () => {
      const total = 5_000_000n;
      const payout = applyBps(total, FINANCIAL_CONSTANTS.PAYOUT_BPS);
      const retention = applyBps(total, FINANCIAL_CONSTANTS.RETENTION_BPS);

      expect(payout).toBe(4_500_000n);
      expect(retention).toBe(500_000n);
      expect(payout + retention).toBe(total);
    });

    it("should handle zero amount", () => {
      expect(applyBps(0n, 500)).toBe(0n);
    });

    it("should throw on negative bps", () => {
      expect(() => applyBps(100n, -10)).toThrow();
    });
  });

  describe("Project Financials (calculateProjectFinancials)", () => {
    it("should calculate 5% Activation Fee and 5% Success Fee on Rp 5.000.000 project", () => {
      const serviceValue = 5_000_000n;
      const result = calculateProjectFinancials(serviceValue);

      expect(result.serviceValue).toBe(5_000_000n);
      expect(result.activationFee).toBe(250_000n);
      expect(result.successFee).toBe(250_000n);
      expect(result.totalPlatformFee).toBe(500_000n);
      expect(result.fundingDue).toBe(5_500_000n);
      expect(result.fundingDue).toBe(serviceValue + result.totalPlatformFee);
    });

    it("should strictly conserve platform fees on uneven amounts", () => {
      const serviceValue = 1_234_567n;
      const result = calculateProjectFinancials(serviceValue);

      expect(result.activationFee + result.successFee).toBe(result.totalPlatformFee);
      expect(result.fundingDue).toBe(serviceValue + result.totalPlatformFee);
    });

    it("should throw on negative service value", () => {
      expect(() => calculateProjectFinancials(-5000n)).toThrow();
    });
  });

  describe("Milestone Financials (calculateMilestoneFinancials)", () => {
    it("should split milestone into 90% immediate payout and 10% warranty retention", () => {
      const milestoneValue = 2_000_000n;
      const result = calculateMilestoneFinancials(milestoneValue);

      expect(result.immediatePayout).toBe(1_800_000n);
      expect(result.warrantyRetention).toBe(200_000n);
      expect(result.immediatePayout + result.warrantyRetention).toBe(milestoneValue);
    });

    it("should guarantee exact conservation without losing 1 rupiah on odd amounts", () => {
      const oddAmount = 333_333n;
      const result = calculateMilestoneFinancials(oddAmount);

      // 10% of 333_333 = 33_333n
      expect(result.warrantyRetention).toBe(33_333n);
      // immediatePayout = 333_333n - 33_333n = 300_000n
      expect(result.immediatePayout).toBe(300_000n);
      expect(result.immediatePayout + result.warrantyRetention).toBe(oddAmount);
    });
  });

  describe("IDR Formatting & Parsing", () => {
    it("formats BigInt and numbers cleanly", () => {
      expect(formatIdr(2_000_000n)).toBe("Rp 2.000.000");
      expect(formatIdr(750_000)).toBe("Rp 750.000");
      expect(formatIdr(0n)).toBe("Rp 0");
      expect(formatIdr(-150_000n)).toBe("-Rp 150.000");
    });

    it("parses formatted string back into BigInt", () => {
      expect(parseIdr("Rp 2.000.000")).toBe(2_000_000n);
      expect(parseIdr("Rp 50.000")).toBe(50_000n);
      expect(parseIdr("1250000")).toBe(1_250_000n);
      expect(parseIdr("Rp 0")).toBe(0n);
      expect(parseIdr("")).toBe(0n);
    });
  });

  describe("Platform Reference Generator", () => {
    it("should format reference matching CCK-{PROJECT}-{PURPOSE}-{SEQUENCE}", () => {
      const ref = createPlatformReference("clx-abc-12345", "FUNDING", 1);
      expect(ref).toBe("CCK-C12345-FUNDING-0001");
      expect(ref).toMatch(/^CCK-[A-Z0-9]+-[A-Z]+-\d{4}$/);
    });

    it("should pad sequence numbers up to 4 digits", () => {
      const ref = createPlatformReference("prj99", "PAYOUT", 42);
      expect(ref).toBe("CCK-PRJ99-PAYOUT-0042");
    });
  });

  describe("Liability Reserve Verification (BR-TRS-01)", () => {
    it("returns healthy status when restricted cash >= required coverage (>= 100%)", () => {
      const restrictedCash = 10_000_000n;
      const liabilities = {
        talentPayable: 7_000_000n,
        umkmRefundable: 2_000_000n,
        feePending: 1_000_000n,
      };

      const check = checkLiabilityReserve(restrictedCash, liabilities);
      expect(check.isHealthy).toBe(true);
      expect(check.coverageRatioPercent).toBe(100);
      expect(check.deficit).toBe(0n);
    });

    it("returns deficit and unhealthy status when restricted cash is insufficient", () => {
      const restrictedCash = 8_000_000n;
      const liabilities = {
        talentPayable: 6_000_000n,
        umkmRefundable: 2_000_000n,
        feePending: 2_000_000n, // Total required = 10_000_000n
      };

      const check = checkLiabilityReserve(restrictedCash, liabilities);
      expect(check.isHealthy).toBe(false);
      expect(check.coverageRatioPercent).toBe(80);
      expect(check.deficit).toBe(2_000_000n);
    });

    it("handles zero liabilities edge case gracefully", () => {
      const check = checkLiabilityReserve(5_000_000n, {
        talentPayable: 0n,
        umkmRefundable: 0n,
        feePending: 0n,
      });

      expect(check.isHealthy).toBe(true);
      expect(check.coverageRatioPercent).toBe(100);
      expect(check.deficit).toBe(0n);
    });
  });
});
