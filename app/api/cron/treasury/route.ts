import { NextResponse } from "next/server";
import { prisma } from "@/src/adapters/database/prisma";
import { executePayoutTransfer } from "@/src/modules/payments/payout";
import { checkAndReleaseWarrantyRetention } from "@/src/modules/support";
import { calculateBalanceSheet } from "@/src/modules/payments/ledger";

function isAuthorized(req: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return true; // Allow in development/staging when no secret is configured
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  try {
    const url = new URL(req.url);
    const querySecret = url.searchParams.get("secret");
    if (querySecret === cronSecret) {
      return true;
    }
  } catch {
    // URL parsing fallback
  }

  return false;
}

async function runTreasuryCronJob() {
  const now = new Date();

  // 1. Process all pending due payouts
  const duePayouts = await prisma.payoutInstruction.findMany({
    where: { status: "PAYOUT_DUE" },
    select: { id: true, amount: true, platformReference: true },
  });

  const payoutResults: Array<{
    id: string;
    amount: string;
    status: "SUCCESS" | "FAILED";
    error?: string;
  }> = [];

  for (const payout of duePayouts) {
    try {
      await executePayoutTransfer(
        payout.id,
        `CRON-AUTO-${Date.now()}-${payout.id.slice(-6)}`
      );
      payoutResults.push({
        id: payout.id,
        amount: payout.amount.toString(),
        status: "SUCCESS",
      });
    } catch (err: unknown) {
      payoutResults.push({
        id: payout.id,
        amount: payout.amount.toString(),
        status: "FAILED",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // 2. Process all mature warranty agreements (30-day period ended)
  const matureWarranties = await prisma.warrantyAgreement.findMany({
    where: {
      status: "ACTIVE",
      endDate: { lte: now },
    },
    select: { projectId: true, endDate: true },
  });

  const warrantyResults: Array<{
    projectId: string;
    released: boolean;
    reason?: string;
    retentionAmount?: string;
    error?: string;
  }> = [];

  for (const warranty of matureWarranties) {
    try {
      const result = await checkAndReleaseWarrantyRetention(warranty.projectId, now);
      if (result.released) {
        warrantyResults.push({
          projectId: warranty.projectId,
          released: true,
          retentionAmount: result.retentionAmount.toString(),
        });
      } else {
        warrantyResults.push({
          projectId: warranty.projectId,
          released: false,
          reason: result.reason,
        });
      }
    } catch (err: unknown) {
      warrantyResults.push({
        projectId: warranty.projectId,
        released: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // 3. Perform automated double-entry ledger balance sheet reconciliation
  const ledgerEntries = await prisma.ledgerEntry.findMany({
    select: { accountType: true, amount: true },
  });
  const balanceSheet = calculateBalanceSheet(ledgerEntries);

  return {
    ok: true,
    timestamp: now.toISOString(),
    summary: {
      payoutsFound: duePayouts.length,
      payoutsSuccessful: payoutResults.filter((p) => p.status === "SUCCESS").length,
      warrantiesFound: matureWarranties.length,
      warrantiesReleased: warrantyResults.filter((w) => w.released).length,
      isReserveHealthy: balanceSheet.isHealthy,
      coverageRatioPercent: balanceSheet.coverageRatioPercent,
    },
    details: {
      payouts: payoutResults,
      warranties: warrantyResults,
      balanceSheet: {
        cashAtBank: balanceSheet.cashAtBank.toString(),
        talentPayable: balanceSheet.talentPayable.toString(),
        umkmRefundable: balanceSheet.umkmRefundable.toString(),
        feePending: balanceSheet.feePending.toString(),
        feeEarned: balanceSheet.feeEarned.toString(),
        requiredReserve: balanceSheet.requiredReserve.toString(),
        reserveDeficit: balanceSheet.reserveDeficit.toString(),
        coverageRatioPercent: balanceSheet.coverageRatioPercent,
        isHealthy: balanceSheet.isHealthy,
      },
    },
  };
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized cron request." },
      { status: 401 }
    );
  }

  try {
    const report = await runTreasuryCronJob();
    return NextResponse.json(report, { status: 200 });
  } catch (error: unknown) {
    console.error("[CRON_TREASURY_ERROR]", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Gagal memproses cron operasional treasury.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return GET(req);
}
