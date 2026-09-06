/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET, POST } from "@/app/api/cron/treasury/route";
import { prisma } from "@/src/adapters/database/prisma";
import { executePayoutTransfer } from "@/src/modules/payments/payout";
import { checkAndReleaseWarrantyRetention } from "@/src/modules/support";

vi.mock("@/src/adapters/database/prisma", () => ({
  prisma: {
    payoutInstruction: {
      findMany: vi.fn(),
    },
    warrantyAgreement: {
      findMany: vi.fn(),
    },
    ledgerEntry: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/src/modules/payments/payout", () => ({
  executePayoutTransfer: vi.fn(),
}));

vi.mock("@/src/modules/support", () => ({
  checkAndReleaseWarrantyRetention: vi.fn(),
}));

describe("Treasury Operational Automation Cron Route (/api/cron/treasury)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("rejects unauthorized requests when CRON_SECRET is configured", async () => {
    process.env.CRON_SECRET = "super-secret-cron-token";

    const req = new Request("http://localhost:3000/api/cron/treasury", {
      headers: { authorization: "Bearer wrong-token" },
    });

    const response = await GET(req);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json.ok).toBe(false);
    expect(json.message).toContain("Unauthorized");
  });

  it("accepts authorized requests when CRON_SECRET matches Bearer token", async () => {
    process.env.CRON_SECRET = "super-secret-cron-token";

    vi.mocked(prisma.payoutInstruction.findMany).mockResolvedValue([] as any);
    vi.mocked(prisma.warrantyAgreement.findMany).mockResolvedValue([] as any);
    vi.mocked(prisma.ledgerEntry.findMany).mockResolvedValue([
      { accountType: "CASH_AT_BANK", amount: 10_000_000n },
      { accountType: "TALENT_PAYABLE", amount: -9_000_000n },
      { accountType: "COCOKIN_FEE_EARNED", amount: -1_000_000n },
    ] as any);

    const req = new Request("http://localhost:3000/api/cron/treasury", {
      headers: { authorization: "Bearer super-secret-cron-token" },
    });

    const response = await GET(req);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.ok).toBe(true);
    expect(json.summary.payoutsFound).toBe(0);
    expect(json.summary.isReserveHealthy).toBe(true);
  });

  it("automatically processes due payouts and releases mature warranty retention", async () => {
    delete process.env.CRON_SECRET;

    vi.mocked(prisma.payoutInstruction.findMany).mockResolvedValue([
      { id: "payout-001", amount: 4_500_000n, platformReference: "CCK-PRJ1-PAYOUT-01" },
    ] as any);

    vi.mocked(executePayoutTransfer).mockResolvedValue({ id: "payout-001", status: "PAID" } as any);

    vi.mocked(prisma.warrantyAgreement.findMany).mockResolvedValue([
      { projectId: "proj-100", endDate: new Date("2026-08-01") },
    ] as any);

    vi.mocked(checkAndReleaseWarrantyRetention).mockResolvedValue({
      released: true,
      retentionAmount: 500_000n,
      successFee: 250_000n,
    });

    vi.mocked(prisma.ledgerEntry.findMany).mockResolvedValue([
      { accountType: "CASH_AT_BANK", amount: 5_000_000n },
      { accountType: "TALENT_PAYABLE", amount: -4_500_000n },
      { accountType: "COCOKIN_FEE_EARNED", amount: -500_000n },
    ] as any);

    const req = new Request("http://localhost:3000/api/cron/treasury", { method: "POST" });
    const response = await POST(req);

    expect(response.status).toBe(200);
    const json = await response.json();

    expect(executePayoutTransfer).toHaveBeenCalledWith("payout-001", expect.stringContaining("CRON-AUTO-"));
    expect(checkAndReleaseWarrantyRetention).toHaveBeenCalledWith("proj-100", expect.any(Date));

    expect(json.summary.payoutsFound).toBe(1);
    expect(json.summary.payoutsSuccessful).toBe(1);
    expect(json.summary.warrantiesFound).toBe(1);
    expect(json.summary.warrantiesReleased).toBe(1);
    expect(json.details.balanceSheet.isHealthy).toBe(true);
  });
});
