import { describe, it, expect } from "vitest";
import {
  validateJournalBalance,
  createFundingDepositJournal,
  createActivationFeeJournal,
  createMilestonePayoutJournal,
  createSuccessFeeJournal,
  createWarrantyRetentionPayoutJournal,
  createRefundJournal,
  calculateBalanceSheet,
} from "./ledger.service";
import type { JournalEntryDraft } from "./types";

describe("Double-Entry Ledger Engine (src/modules/payments/ledger)", () => {
  describe("validateJournalBalance", () => {
    it("accepts a balanced journal entry set", () => {
      const entries: JournalEntryDraft[] = [
        { accountType: "CASH_AT_BANK", amount: 1_000_000n, platformReference: "REF-1" },
        { accountType: "TALENT_PAYABLE", amount: -1_000_000n, platformReference: "REF-1" },
      ];

      expect(() => validateJournalBalance(entries)).not.toThrow();
    });

    it("throws when journal entries are unbalanced (sum !== 0n)", () => {
      const unbalanced: JournalEntryDraft[] = [
        { accountType: "CASH_AT_BANK", amount: 1_000_000n, platformReference: "REF-1" },
        { accountType: "TALENT_PAYABLE", amount: -999_999n, platformReference: "REF-1" },
      ];

      expect(() => validateJournalBalance(unbalanced)).toThrow(/Unbalanced journal transaction/);
    });

    it("throws when journal has less than 2 entries", () => {
      const singleEntry: JournalEntryDraft[] = [
        { accountType: "CASH_AT_BANK", amount: 0n, platformReference: "REF-1" },
      ];

      expect(() => validateJournalBalance(singleEntry)).toThrow(/at least 2 entries/);
    });
  });

  describe("Journal Movement Factories", () => {
    const ref = "CCK-PRJ01-TEST-0001";

    it("creates balanced Funding Deposit journal", () => {
      const journal = createFundingDepositJournal({
        serviceValue: 5_000_000n,
        platformFee: 500_000n,
        reference: ref,
      });

      expect(journal).toHaveLength(3);
      const sum = journal.reduce((acc, e) => acc + e.amount, 0n);
      expect(sum).toBe(0n);

      expect(journal[0]).toEqual({ accountType: "CASH_AT_BANK", amount: 5_500_000n, platformReference: ref });
      expect(journal[1]).toEqual({ accountType: "TALENT_PAYABLE", amount: -5_000_000n, platformReference: ref });
      expect(journal[2]).toEqual({ accountType: "COCOKIN_FEE_PENDING", amount: -500_000n, platformReference: ref });
    });

    it("creates balanced Activation Fee recognition journal", () => {
      const journal = createActivationFeeJournal({
        activationFee: 250_000n,
        reference: ref,
      });

      expect(journal).toHaveLength(2);
      expect(journal.reduce((acc, e) => acc + e.amount, 0n)).toBe(0n);
      expect(journal[0]).toEqual({ accountType: "COCOKIN_FEE_PENDING", amount: 250_000n, platformReference: ref });
      expect(journal[1]).toEqual({ accountType: "COCOKIN_FEE_EARNED", amount: -250_000n, platformReference: ref });
    });

    it("creates balanced Milestone Payout journal (90%)", () => {
      const journal = createMilestonePayoutJournal({
        immediatePayout: 1_800_000n,
        reference: ref,
      });

      expect(journal).toHaveLength(2);
      expect(journal.reduce((acc, e) => acc + e.amount, 0n)).toBe(0n);
      expect(journal[0]).toEqual({ accountType: "TALENT_PAYABLE", amount: 1_800_000n, platformReference: ref });
      expect(journal[1]).toEqual({ accountType: "CASH_AT_BANK", amount: -1_800_000n, platformReference: ref });
    });

    it("creates balanced Success Fee recognition journal", () => {
      const journal = createSuccessFeeJournal({
        successFee: 250_000n,
        reference: ref,
      });

      expect(journal).toHaveLength(2);
      expect(journal.reduce((acc, e) => acc + e.amount, 0n)).toBe(0n);
      expect(journal[0]).toEqual({ accountType: "COCOKIN_FEE_PENDING", amount: 250_000n, platformReference: ref });
      expect(journal[1]).toEqual({ accountType: "COCOKIN_FEE_EARNED", amount: -250_000n, platformReference: ref });
    });

    it("creates balanced Warranty Retention Payout journal (10%)", () => {
      const journal = createWarrantyRetentionPayoutJournal({
        retentionAmount: 500_000n,
        reference: ref,
      });

      expect(journal).toHaveLength(2);
      expect(journal.reduce((acc, e) => acc + e.amount, 0n)).toBe(0n);
      expect(journal[0]).toEqual({ accountType: "TALENT_PAYABLE", amount: 500_000n, platformReference: ref });
      expect(journal[1]).toEqual({ accountType: "CASH_AT_BANK", amount: -500_000n, platformReference: ref });
    });

    it("creates balanced Refund journal", () => {
      const journal = createRefundJournal({
        refundAmount: 2_000_000n,
        sourceAccount: "UMKM_REFUNDABLE",
        reference: ref,
      });

      expect(journal).toHaveLength(2);
      expect(journal.reduce((acc, e) => acc + e.amount, 0n)).toBe(0n);
      expect(journal[0]).toEqual({ accountType: "UMKM_REFUNDABLE", amount: 2_000_000n, platformReference: ref });
      expect(journal[1]).toEqual({ accountType: "CASH_AT_BANK", amount: -2_000_000n, platformReference: ref });
    });
  });

  describe("Complete Project Financial Lifecycle & 100% Reserve Invariant", () => {
    it("maintains 100% reserve and correct balances through full happy path lifecycle", () => {
      const cumulativeEntries: Array<{ accountType: string; amount: bigint }> = [];
      const ref = "CCK-PRJ88-HAPPY-0001";

      // 1. Funding Deposit: Rp 5.000.000 serviceValue + Rp 500.000 platformFee (10%)
      const depositEntries = createFundingDepositJournal({
        serviceValue: 5_000_000n,
        platformFee: 500_000n,
        reference: ref,
      });
      cumulativeEntries.push(...depositEntries);

      let sheet = calculateBalanceSheet(cumulativeEntries);
      expect(sheet.cashAtBank).toBe(5_500_000n);
      expect(sheet.talentPayable).toBe(5_000_000n);
      expect(sheet.feePending).toBe(500_000n);
      expect(sheet.feeEarned).toBe(0n);
      expect(sheet.requiredReserve).toBe(5_500_000n);
      expect(sheet.isHealthy).toBe(true);
      expect(sheet.coverageRatioPercent).toBe(100);

      // 2. Project Activation: 5% Activation Fee recognized (Rp 250.000)
      const activationEntries = createActivationFeeJournal({
        activationFee: 250_000n,
        reference: ref,
      });
      cumulativeEntries.push(...activationEntries);

      sheet = calculateBalanceSheet(cumulativeEntries);
      expect(sheet.cashAtBank).toBe(5_500_000n);
      expect(sheet.talentPayable).toBe(5_000_000n);
      expect(sheet.feePending).toBe(250_000n);
      expect(sheet.feeEarned).toBe(250_000n);
      expect(sheet.requiredReserve).toBe(5_250_000n);
      // Cash at bank (5.5M) exceeds required liability reserve (5.25M) by exactly the earned fee!
      expect(sheet.isHealthy).toBe(true);
      expect(sheet.coverageRatioPercent).toBeGreaterThanOrEqual(100);

      // 3. Milestone 1 Approved (Value Rp 2.500.000 -> 90% payout = Rp 2.250.000)
      const milestone1Payout = createMilestonePayoutJournal({
        immediatePayout: 2_250_000n,
        reference: ref,
      });
      cumulativeEntries.push(...milestone1Payout);

      sheet = calculateBalanceSheet(cumulativeEntries);
      expect(sheet.cashAtBank).toBe(3_250_000n);
      expect(sheet.talentPayable).toBe(2_750_000n);
      expect(sheet.requiredReserve).toBe(3_000_000n);
      expect(sheet.isHealthy).toBe(true);

      // 4. Milestone 2 Approved (Value Rp 2.500.000 -> 90% payout = Rp 2.250.000)
      const milestone2Payout = createMilestonePayoutJournal({
        immediatePayout: 2_250_000n,
        reference: ref,
      });
      cumulativeEntries.push(...milestone2Payout);

      sheet = calculateBalanceSheet(cumulativeEntries);
      expect(sheet.cashAtBank).toBe(1_000_000n);
      expect(sheet.talentPayable).toBe(500_000n); // 10% warranty retention held!
      expect(sheet.feePending).toBe(250_000n);
      expect(sheet.requiredReserve).toBe(750_000n);
      expect(sheet.isHealthy).toBe(true);

      // 5. Handover Complete: 5% Success Fee recognized (Rp 250.000)
      const successFeeEntries = createSuccessFeeJournal({
        successFee: 250_000n,
        reference: ref,
      });
      cumulativeEntries.push(...successFeeEntries);

      sheet = calculateBalanceSheet(cumulativeEntries);
      expect(sheet.cashAtBank).toBe(1_000_000n);
      expect(sheet.feePending).toBe(0n);
      expect(sheet.feeEarned).toBe(500_000n);
      expect(sheet.talentPayable).toBe(500_000n);
      expect(sheet.requiredReserve).toBe(500_000n);
      expect(sheet.isHealthy).toBe(true);

      // 6. 30-day Warranty Expired: 10% retention (Rp 500.000) paid to Talent
      const retentionEntries = createWarrantyRetentionPayoutJournal({
        retentionAmount: 500_000n,
        reference: ref,
      });
      cumulativeEntries.push(...retentionEntries);

      sheet = calculateBalanceSheet(cumulativeEntries);
      expect(sheet.cashAtBank).toBe(500_000n); // Remaining cash belongs 100% to CocokIn Fee Earned
      expect(sheet.talentPayable).toBe(0n);
      expect(sheet.requiredReserve).toBe(0n);
      expect(sheet.feeEarned).toBe(500_000n);
      expect(sheet.isHealthy).toBe(true);
      expect(sheet.reserveDeficit).toBe(0n);
    });

    it("detects deficit if cash is illegally deducted below liability coverage", () => {
      const entries: Array<{ accountType: string; amount: bigint }> = [
        { accountType: "CASH_AT_BANK", amount: 2_000_000n },
        { accountType: "TALENT_PAYABLE", amount: -3_000_000n }, // Liability = 3.000.000n
        { accountType: "COCOKIN_FEE_PENDING", amount: 1_000_000n },
      ];

      const sheet = calculateBalanceSheet(entries);
      expect(sheet.isHealthy).toBe(false);
      expect(sheet.cashAtBank).toBe(2_000_000n);
      expect(sheet.talentPayable).toBe(3_000_000n);
      expect(sheet.requiredReserve).toBe(3_000_000n);
      expect(sheet.reserveDeficit).toBe(1_000_000n);
      expect(sheet.coverageRatioPercent).toBe(66.66);
    });
  });
});
