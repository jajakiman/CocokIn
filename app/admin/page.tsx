import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import { calculateBalanceSheet } from "@/src/modules/payments/ledger";
import { AdminDashboardView, type AdminDashboardData } from "@/src/components/admin/admin-dashboard-view";

export async function generateMetadata() {
  return { title: "Pusat Operasional Admin & Treasury | CocokIn" };
}

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  // 1. Fetch all ledger entries to compute the real-time balance sheet
  const ledgerEntries = await prisma.ledgerEntry.findMany();
  const balanceSheet = calculateBalanceSheet(ledgerEntries);

  // 2. Fetch funding receipts for the reconciliation desk
  const fundingReceipts = await prisma.fundingReceipt.findMany({
    include: {
      project: {
        include: { businessProfile: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // 3. Fetch payout instructions for the payout desk
  const payoutInstructions = await prisma.payoutInstruction.findMany({
    include: {
      escrowTransaction: {
        include: {
          project: {
            include: { milestones: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // 4. Fetch disputes for the dispute desk
  const disputes = await prisma.dispute.findMany({
    include: {
      project: true,
      evidence: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // 5. Fetch support tickets
  const supportTickets = await prisma.supportTicket.findMany({
    include: {
      project: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const dashboardData: AdminDashboardData = {
    balanceSheet: {
      cashAtBank: balanceSheet.cashAtBank.toString(),
      talentPayable: balanceSheet.talentPayable.toString(),
      umkmRefundable: balanceSheet.umkmRefundable.toString(),
      feePending: balanceSheet.feePending.toString(),
      feeEarned: balanceSheet.feeEarned.toString(),
      requiredReserve: balanceSheet.requiredReserve.toString(),
      isHealthy: balanceSheet.isHealthy,
      coverageRatioPercent: balanceSheet.coverageRatioPercent,
      reserveDeficit: balanceSheet.reserveDeficit.toString(),
    },
    fundingReceipts: fundingReceipts.map((r) => ({
      id: r.id,
      projectId: r.projectId,
      projectTitle: r.project.title,
      businessName: r.project.businessProfile.businessName,
      amountDue: r.amountDue.toString(),
      amountReceived: r.amountReceived?.toString() || null,
      status: r.status,
      platformReference: r.platformReference,
      createdAt: r.createdAt.toISOString(),
    })),
    payoutInstructions: payoutInstructions.map((p) => {
      const milestone = p.escrowTransaction.project.milestones.find(
        (m) => m.id === p.milestoneId
      );
      return {
        id: p.id,
        projectId: p.escrowTransaction.projectId,
        projectTitle: p.escrowTransaction.project.title,
        milestoneTitle: milestone?.title || "Milestone Delivery",
        amount: p.amount.toString(),
        status: p.status,
        platformReference: p.platformReference,
        createdAt: p.createdAt.toISOString(),
      };
    }),
    disputes: disputes.map((d) => ({
      id: d.id,
      projectId: d.projectId,
      projectTitle: d.project.title,
      reason: d.reason,
      status: d.status,
      evidenceCount: d.evidence.length,
      createdAt: d.createdAt.toISOString(),
    })),
    supportTickets: supportTickets.map((t) => ({
      id: t.id,
      projectId: t.projectId,
      projectTitle: t.project.title,
      severity: t.severity,
      status: t.status,
      description: t.description,
      createdAt: t.createdAt.toISOString(),
    })),
  };

  return <AdminDashboardView data={dashboardData} />;
}
