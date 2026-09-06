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

  // 5. Fetch support, moderation, and impact data in parallel.
  const [supportTickets, users, messageReports, empoweredTalentRows, digitalizedBusinessRows, impactProjects, paidPayouts, completedProjectsCount, readinessRows] = await Promise.all([
    prisma.supportTicket.findMany({
      include: { project: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.user.findMany({
      where: { role: { in: ["TALENT", "BUSINESS"] } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        identityStatus: true,
        isSuspended: true,
        suspendedAt: true,
        suspensionReason: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.messageReport.findMany({
      select: {
        id: true,
        reason: true,
        status: true,
        resolutionNotes: true,
        resolvedAt: true,
        resolvedBy: { select: { name: true } },
        reporterName: true,
        messageSenderId: true,
        messageCreatedAt: true,
        createdAt: true,
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 50,
    }),
    prisma.projectApplication.findMany({
      where: { status: "ACCEPTED", project: { status: "COMPLETED" } },
      distinct: ["talentProfileId"],
      select: { talentProfileId: true },
    }),
    prisma.project.findMany({
      where: { status: "COMPLETED" },
      distinct: ["businessProfileId"],
      select: { businessProfileId: true },
    }),
    prisma.project.groupBy({
      by: ["solutionCategory"],
      where: { status: "COMPLETED" },
      _count: { _all: true },
    }),
    prisma.payoutInstruction.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    prisma.project.count({ where: { status: "COMPLETED" } }),
    prisma.businessAssessmentResult.findMany({
      select: { businessProfileId: true, readinessScore: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const readinessByBusiness = readinessRows.reduce<Record<string, number[]>>((groups, row) => {
    (groups[row.businessProfileId] ??= []).push(row.readinessScore);
    return groups;
  }, {});
  const readinessGrowth = Object.values(readinessByBusiness)
    .filter((scores) => scores.length >= 2)
    .map((scores) => scores[scores.length - 1] - scores[0]);

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
      paymentMethod: r.paymentMethod,
      destinationBank: r.destinationBank,
      destinationAccount: r.destinationAccount,
      destinationAccountHolder: r.destinationAccountHolder,
      senderBank: r.senderBank,
      senderAccount: r.senderAccount,
      senderName: r.senderName,
      paymentReference: r.paymentReference,
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
    users: users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      suspendedAt: user.suspendedAt?.toISOString() ?? null,
    })),
    messageReports: messageReports.map((report) => ({
      id: report.id,
      reason: report.reason,
      status: report.status,
      resolutionNotes: report.resolutionNotes,
      resolvedAt: report.resolvedAt?.toISOString() ?? null,
      resolvedByName: report.resolvedBy?.name ?? null,
      reporterName: report.reporterName,
      messageSenderId: report.messageSenderId,
      messageCreatedAt: report.messageCreatedAt.toISOString(),
      createdAt: report.createdAt.toISOString(),
    })),
    impactMetrics: {
      empoweredTalentsCount: empoweredTalentRows.length,
      digitalizedBusinessesCount: digitalizedBusinessRows.length,
      completedProjectsCount,
      totalTalentIncome: (paidPayouts._sum.amount ?? 0n).toString(),
      averageReadinessGrowth: readinessGrowth.length > 0
        ? Math.round(readinessGrowth.reduce((sum, growth) => sum + growth, 0) / readinessGrowth.length)
        : 0,
      solutionCategories: impactProjects.map((category) => ({
        name: category.solutionCategory,
        count: category._count._all,
      })),
    },
  };

  return <AdminDashboardView data={dashboardData} />;
}
