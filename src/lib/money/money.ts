/**
 * CocokIn Money Precision and Financial Calculations Library
 * 
 * Invariants from DATA_STATE_MODEL.md & BUSINESS_RULES.md:
 * - IDR stored as integer BigInt (Rp 1 = 1n, no fractional units).
 * - All percentages defined in basis points (1 bps = 0.01%, 10,000 bps = 100%).
 * - Activation Fee = 500 bps (5%), Success Fee = 500 bps (5%).
 * - Milestone immediate payout = 9,000 bps (90%), Warranty retention = 1,000 bps (10%).
 * - Sum of components must strictly conserve money (no drift from integer division).
 * - Platform Reference format: CCK-{PROJECT}-{PURPOSE}-{SEQUENCE}.
 */

export const BPS_SCALE = 10_000n;

export const FINANCIAL_CONSTANTS = {
  ACTIVATION_FEE_BPS: 500, // 5%
  SUCCESS_FEE_BPS: 500,    // 5%
  PLATFORM_FEE_BPS: 1000,  // 10%
  PAYOUT_BPS: 9000,        // 90%
  RETENTION_BPS: 1000,     // 10%
  TOTAL_BPS: 10_000,       // 100%
} as const;

export type ProjectFinancials = {
  serviceValue: bigint;
  activationFee: bigint;
  successFee: bigint;
  totalPlatformFee: bigint;
  fundingDue: bigint;
};

export type MilestoneFinancials = {
  milestoneValue: bigint;
  immediatePayout: bigint;
  warrantyRetention: bigint;
};

export type LiabilityCoverage = {
  restrictedCash: bigint;
  requiredCoverage: bigint;
  isHealthy: boolean;
  coverageRatioPercent: number;
  deficit: bigint;
};

/**
 * Calculates a fraction of a BigInt amount using basis points (integer arithmetic).
 */
export function applyBps(amount: bigint, bps: number): bigint {
  if (bps < 0) throw new Error("Basis points cannot be negative");
  return (amount * BigInt(bps)) / BPS_SCALE;
}

/**
 * Calculates project funding due and fee splits for UMKM and Platform.
 * Funding Due = Service Value + (Service Value * 10%)
 * Platform Fee 10% is split into Activation Fee (5%) and Success Fee (5%).
 */
export function calculateProjectFinancials(serviceValue: bigint): ProjectFinancials {
  if (serviceValue < 0n) throw new Error("Service value cannot be negative");

  const activationFee = applyBps(serviceValue, FINANCIAL_CONSTANTS.ACTIVATION_FEE_BPS);
  const successFee = applyBps(serviceValue, FINANCIAL_CONSTANTS.SUCCESS_FEE_BPS);
  const totalPlatformFee = activationFee + successFee;
  const fundingDue = serviceValue + totalPlatformFee;

  return {
    serviceValue,
    activationFee,
    successFee,
    totalPlatformFee,
    fundingDue,
  };
}

/**
 * Calculates milestone payout to Talent (90%) and warranty retention (10%).
 * Strictly ensures immediatePayout + warrantyRetention === milestoneValue.
 */
export function calculateMilestoneFinancials(milestoneValue: bigint): MilestoneFinancials {
  if (milestoneValue < 0n) throw new Error("Milestone value cannot be negative");

  const warrantyRetention = applyBps(milestoneValue, FINANCIAL_CONSTANTS.RETENTION_BPS);
  // Subtract retention to guarantee exact sum conservation regardless of division remainder
  const immediatePayout = milestoneValue - warrantyRetention;

  return {
    milestoneValue,
    immediatePayout,
    warrantyRetention,
  };
}

/**
 * Formats integer BigInt or number to standard Indonesian Rupiah string.
 * Example: 2500000n -> "Rp 2.500.000"
 */
export function formatIdr(amount: bigint | number): string {
  const isNegative = amount < 0n || (typeof amount === "number" && amount < 0);
  const absVal = typeof amount === "bigint" 
    ? (amount < 0n ? -amount : amount) 
    : BigInt(Math.abs(Math.round(amount)));

  const formatted = absVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`;
}

/**
 * Parses user input or raw IDR string into BigInt rupiah.
 * Example: "Rp 2.500.000" -> 2500000n
 */
export function parseIdr(input: string): bigint {
  const sanitized = input.replace(/[^\d-]/g, "");
  if (!sanitized || sanitized === "-") return 0n;
  return BigInt(sanitized);
}

/**
 * Generates an authoritative platform reference complying with DATA_STATE_MODEL.md:
 * CCK-{PROJECT}-{PURPOSE}-{SEQUENCE}
 * Example: createPlatformReference("clx123", "FUNDING", 1) -> "CCK-CLX123-FUNDING-0001"
 */
export function createPlatformReference(projectId: string, purpose: string, sequence: number): string {
  const cleanProject = projectId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(-6) || "PRJ";
  const cleanPurpose = purpose.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const sequenceStr = String(sequence).padStart(4, "0");
  return `CCK-${cleanProject}-${cleanPurpose}-${sequenceStr}`;
}

/**
 * Verifies the 100% Liability Reserve Invariant (DATA_STATE_MODEL.md / BR-TRS-01):
 * Required cash coverage = Talent Payable + UMKM Refundable + Fee Pending
 * restricted cash >= required cash coverage (Coverage ratio >= 100%)
 */
export function checkLiabilityReserve(
  restrictedCash: bigint,
  liabilities: {
    talentPayable: bigint;
    umkmRefundable: bigint;
    feePending: bigint;
  }
): LiabilityCoverage {
  const requiredCoverage = liabilities.talentPayable + liabilities.umkmRefundable + liabilities.feePending;
  const isHealthy = restrictedCash >= requiredCoverage;
  const deficit = isHealthy ? 0n : requiredCoverage - restrictedCash;

  const coverageRatioPercent = requiredCoverage === 0n
    ? 100
    : Number((restrictedCash * 10000n) / requiredCoverage) / 100;

  return {
    restrictedCash,
    requiredCoverage,
    isHealthy,
    coverageRatioPercent,
    deficit,
  };
}
