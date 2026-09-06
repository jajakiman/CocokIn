import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedAssessmentCatalog } from "../src/modules/assessment/seed-catalog";

const prisma = new PrismaClient();

async function seedTalent(prisma: PrismaClient, passwordHash: string) {
  // Seed Talent User
  const talentUser = await prisma.user.upsert({
    where: { email: "talent@cocokin.id" },
    update: { emailVerified: new Date(), identityStatus: "CONTACT_VERIFIED", isSynthetic: true, isDemoAccount: true },
    create: {
      email: "talent@cocokin.id",
      name: "Budi Santoso",
      emailVerified: new Date(),
      identityStatus: "CONTACT_VERIFIED",
      role: "TALENT",
      passwordHash,
      isSynthetic: true,
      isDemoAccount: true,
    },
  });

  // Seed Talent Profile
  const talentProfile = await prisma.talentProfile.upsert({
    where: { userId: talentUser.id },
    update: {
      university: "Universitas Indonesia",
      major: "Sistem Informasi",
      careerTarget: "Fullstack Developer",
      hasNoPortfolio: true,
      onboardingCompletedAt: new Date(),
      workModePreference: "REMOTE",
    },
    create: {
      userId: talentUser.id,
      bio: "Mahasiswa Sistem Informasi tingkat akhir dengan pengalaman fullstack web development. Senang membantu UMKM go digital.",
      university: "Universitas Indonesia",
      major: "Sistem Informasi",
      careerTarget: "Fullstack Developer",
      hasNoPortfolio: true,
      onboardingCompletedAt: new Date(),
      workModePreference: "REMOTE",
    },
  });

  // Create some basic skills
  const skillsData = ["React", "Next.js", "TailwindCSS", "Node.js", "PostgreSQL", "REST API", "Git"];
  
  for (const skillName of skillsData) {
    const skill = await prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: { name: skillName, category: "UNCATEGORIZED" }
    });

    // Promote certain skills to ASSESSED or PROJECT_VERIFIED for demo fidelity
    const evidenceLevel = skillName === "React" || skillName === "Next.js"
      ? "PROJECT_VERIFIED"
      : skillName === "REST API" || skillName === "PostgreSQL"
      ? "ASSESSED"
      : "SELF_DECLARED";

    await prisma.talentSkill.upsert({
      where: {
        talentProfileId_skillId: {
          talentProfileId: talentProfile.id,
          skillId: skill.id
        }
      },
      update: { evidenceLevel },
      create: {
        talentProfileId: talentProfile.id,
        skillId: skill.id,
        evidenceLevel,
      }
    });
  }

  // Seed Talent Career Readiness Assessment Result (87% Siap Kerja)
  const existingAssessment = await prisma.talentAssessmentResult.findFirst({
    where: { talentProfileId: talentProfile.id },
  });
  if (!existingAssessment) {
    await prisma.talentAssessmentResult.create({
      data: {
        talentProfileId: talentProfile.id,
        technicalScore: 85,
        softSkillScore: 90,
        compositeScore: 87,
      },
    });
  }

  await prisma.talentPayoutAccount.upsert({
    where: { talentProfileId: talentProfile.id },
    update: {
      bankName: "BCA",
      accountNumber: "1234567890",
      accountHolder: "Budi Santoso",
      verifiedAt: new Date("2026-09-01T00:00:00.000Z"),
    },
    create: {
      talentProfileId: talentProfile.id,
      bankName: "BCA",
      accountNumber: "1234567890",
      accountHolder: "Budi Santoso",
      verifiedAt: new Date("2026-09-01T00:00:00.000Z"),
    },
  });

  return talentProfile;
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("PEMBERITAHUAN KEAMANAN: Database seeding dilarang keras dijalankan pada lingkungan produksi!");
  }

  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);
  await seedAssessmentCatalog(prisma);

  // Backfill: rename legacy career target (track FE+BE digabung menjadi Fullstack)
  await prisma.talentProfile.updateMany({
    where: { careerTarget: "Frontend Developer" },
    data: { careerTarget: "Fullstack Developer" },
  });

  // Seed Admin User (Farid - Platform Trust & Operations)
  await prisma.user.upsert({
    where: { email: "admin@cocokin.id" },
    update: { emailVerified: new Date(), identityStatus: "CONTACT_VERIFIED", role: "ADMIN", isSynthetic: true, isDemoAccount: true },
    create: {
      email: "admin@cocokin.id",
      name: "Admin Farid",
      emailVerified: new Date(),
      identityStatus: "CONTACT_VERIFIED",
      role: "ADMIN",
      passwordHash,
      isSynthetic: true,
      isDemoAccount: true,
    },
  });

  // Seed Business User
  const umkmUser = await prisma.user.upsert({
    where: { email: "umkm@cocokin.id" },
    update: { emailVerified: new Date(), identityStatus: "CONTACT_VERIFIED", isSynthetic: true, isDemoAccount: true },
    create: {
      email: "umkm@cocokin.id",
      name: "UMKM Demo",
      emailVerified: new Date(),
      identityStatus: "CONTACT_VERIFIED",
      role: "BUSINESS",
      passwordHash,
      isSynthetic: true,
      isDemoAccount: true,
    },
  });

  // Seed Business Profile
  const businessProfile = await prisma.businessProfile.upsert({
    where: { userId: umkmUser.id },
    update: {
      businessName: "Kopi Kenangan Senja",
      industryCategory: "F&B",
      location: "Jakarta Selatan",
      description: "Kedai kopi lokal dengan cita rasa nusantara.",
      verificationStatus: "VERIFIED_BUSINESS",
    },
    create: {
      userId: umkmUser.id,
      businessName: "Kopi Kenangan Senja",
      industryCategory: "F&B",
      location: "Jakarta Selatan",
      description: "Kedai kopi lokal dengan cita rasa nusantara.",
      verificationStatus: "VERIFIED_BUSINESS",
    },
  });

  // Seed Assessment (Only create if not exists to prevent duplicates on re-seed)
  const existingAssessment = await prisma.businessAssessmentResult.findFirst({
    where: { businessProfileId: businessProfile.id }
  });
  
  if (!existingAssessment) {
    await prisma.businessAssessmentResult.create({
      data: {
        businessProfileId: businessProfile.id,
        readinessScore: 85,
      },
    });
  }

  const bankFundingProject = await prisma.project.upsert({
    where: { id: "seed-funding-bank" },
    update: {
      status: "FUNDING_PENDING",
      serviceValue: 5_000_000n,
    },
    create: {
      id: "seed-funding-bank",
      businessProfileId: businessProfile.id,
      title: "Website Katalog & Order Online Kopi Nusantara",
      scope: "Katalog produk, keranjang, pemesanan WhatsApp, dan dashboard inventori sederhana.",
      difficulty: "INTERMEDIATE",
      estimatedDays: 12,
      deadline: new Date("2026-10-15T00:00:00.000Z"),
      serviceValue: 5_000_000n,
      status: "FUNDING_PENDING",
    },
  });

  await prisma.fundingReceipt.upsert({
    where: { projectId: bankFundingProject.id },
    update: {
      status: "PROOF_SUBMITTED",
      amountDue: 5_500_000n,
      amountReceived: 5_500_000n,
      paymentMethod: "BANK_TRANSFER",
      destinationBank: "BCA",
      destinationAccount: "8801212345678",
      destinationAccountHolder: "PT COCOKIN TEKNOLOGI INDONESIA",
      senderBank: "BCA",
      senderAccount: "0912345678",
      senderName: "Kopi Kenangan Senja",
      paymentReference: null,
      platformReference: "CCK-SEEDBANK-FUNDING-0001",
    },
    create: {
      projectId: bankFundingProject.id,
      status: "PROOF_SUBMITTED",
      amountDue: 5_500_000n,
      amountReceived: 5_500_000n,
      paymentMethod: "BANK_TRANSFER",
      destinationBank: "BCA",
      destinationAccount: "8801212345678",
      destinationAccountHolder: "PT COCOKIN TEKNOLOGI INDONESIA",
      senderBank: "BCA",
      senderAccount: "0912345678",
      senderName: "Kopi Kenangan Senja",
      platformReference: "CCK-SEEDBANK-FUNDING-0001",
    },
  });

  const qrisFundingProject = await prisma.project.upsert({
    where: { id: "seed-funding-qris" },
    update: {
      status: "FUNDING_PENDING",
      serviceValue: 3_000_000n,
    },
    create: {
      id: "seed-funding-qris",
      businessProfileId: businessProfile.id,
      title: "Landing Page Promo Paket Kopi Hampers",
      scope: "Landing page kampanye hampers dengan katalog paket, CTA order, dan analytics dasar.",
      difficulty: "BEGINNER",
      estimatedDays: 7,
      deadline: new Date("2026-10-01T00:00:00.000Z"),
      serviceValue: 3_000_000n,
      status: "FUNDING_PENDING",
    },
  });

  await prisma.fundingReceipt.upsert({
    where: { projectId: qrisFundingProject.id },
    update: {
      status: "PROOF_SUBMITTED",
      amountDue: 3_300_000n,
      amountReceived: 3_300_000n,
      paymentMethod: "QRIS",
      destinationBank: null,
      destinationAccount: null,
      destinationAccountHolder: "PT COCOKIN TEKNOLOGI INDONESIA",
      senderBank: null,
      senderAccount: null,
      senderName: "Kopi Kenangan Senja",
      paymentReference: "QRIS-RRN-9081726354",
      platformReference: "CCK-SEEDQRIS-FUNDING-0001",
    },
    create: {
      projectId: qrisFundingProject.id,
      status: "PROOF_SUBMITTED",
      amountDue: 3_300_000n,
      amountReceived: 3_300_000n,
      paymentMethod: "QRIS",
      destinationAccountHolder: "PT COCOKIN TEKNOLOGI INDONESIA",
      senderName: "Kopi Kenangan Senja",
      paymentReference: "QRIS-RRN-9081726354",
      platformReference: "CCK-SEEDQRIS-FUNDING-0001",
    },
  });

  const talentProfile = await seedTalent(prisma, passwordHash);

  await prisma.businessAssessmentResult.updateMany({
    where: { businessProfileId: businessProfile.id },
    data: {
      readinessScore: 82,
      financeScore: 75,
      marketingScore: 85,
      teamScore: 80,
      operationsScore: 85,
      outsourcingScore: 85,
    },
  });

  const recruitmentProject = await prisma.project.upsert({
    where: { id: "seed-project-recruitment" },
    update: { status: "PUBLISHED", solutionCategory: "WEBSITE_BRANDING" },
    create: {
      id: "seed-project-recruitment",
      businessProfileId: businessProfile.id,
      title: "Redesign Kemasan & Branding Kopi Drip Bag",
      scope: "Riset visual, tiga konsep kemasan, dieline siap cetak, dan panduan penggunaan brand.",
      difficulty: "INTERMEDIATE",
      estimatedDays: 10,
      deadline: new Date("2026-10-20T00:00:00.000Z"),
      serviceValue: 3_000_000n,
      status: "PUBLISHED",
      solutionCategory: "WEBSITE_BRANDING",
    },
  });

  const application = await prisma.projectApplication.upsert({
    where: {
      projectId_talentProfileId: {
        projectId: recruitmentProject.id,
        talentProfileId: talentProfile.id,
      },
    },
    update: {
      status: "PENDING",
      motivation: "Saya terbiasa menerjemahkan kebutuhan UMKM menjadi identitas visual yang siap diproduksi.",
    },
    create: {
      projectId: recruitmentProject.id,
      talentProfileId: talentProfile.id,
      status: "PENDING",
      motivation: "Saya terbiasa menerjemahkan kebutuhan UMKM menjadi identitas visual yang siap diproduksi.",
    },
  });

  await prisma.matchSnapshot.upsert({
    where: { projectApplicationId: application.id },
    update: {
      cocokScore: 88,
      skillMatchScore: 90,
      careerAlignmentScore: 85,
      availabilityScore: 90,
      experienceScore: 80,
      preferenceScore: 90,
      explainableText: "Skill inti sesuai, jadwal tersedia, dan pengalaman proyek terverifikasi relevan.",
    },
    create: {
      projectApplicationId: application.id,
      cocokScore: 88,
      skillMatchScore: 90,
      careerAlignmentScore: 85,
      availabilityScore: 90,
      experienceScore: 80,
      preferenceScore: 90,
      explainableText: "Skill inti sesuai, jadwal tersedia, dan pengalaman proyek terverifikasi relevan.",
    },
  });

  const activeProject = await prisma.project.upsert({
    where: { id: "seed-project-active" },
    update: { status: "STAGING_REVIEW", solutionCategory: "OPERATIONS_POS" },
    create: {
      id: "seed-project-active",
      businessProfileId: businessProfile.id,
      title: "Sistem Kasir & Laporan Penjualan Harian",
      scope: "Kasir web, pencatatan transaksi, stok sederhana, dan laporan penjualan harian.",
      difficulty: "ADVANCED",
      estimatedDays: 14,
      deadline: new Date("2026-10-10T00:00:00.000Z"),
      serviceValue: 7_500_000n,
      status: "STAGING_REVIEW",
      solutionCategory: "OPERATIONS_POS",
    },
  });

  await prisma.projectApplication.upsert({
    where: {
      projectId_talentProfileId: {
        projectId: activeProject.id,
        talentProfileId: talentProfile.id,
      },
    },
    update: { status: "ACCEPTED" },
    create: {
      projectId: activeProject.id,
      talentProfileId: talentProfile.id,
      status: "ACCEPTED",
      motivation: "Saya siap membangun alur kasir sampai deployment.",
    },
  });

  const reviewMilestone = await prisma.projectMilestone.upsert({
    where: { id: "seed-milestone-review" },
    update: { status: "READY_FOR_REVIEW" },
    create: {
      id: "seed-milestone-review",
      projectId: activeProject.id,
      title: "Kasir, Produk, dan Laporan Harian",
      weightBps: 6000,
      deadline: new Date("2026-09-20T00:00:00.000Z"),
      status: "READY_FOR_REVIEW",
    },
  });

  const reviewCriterion = await prisma.milestoneAcceptanceCriterion.findFirst({
    where: {
      projectMilestoneId: reviewMilestone.id,
      description: "Transaksi tersimpan dan laporan harian menampilkan total yang benar.",
    },
  });
  if (!reviewCriterion) {
    await prisma.milestoneAcceptanceCriterion.create({
      data: {
        projectMilestoneId: reviewMilestone.id,
        description: "Transaksi tersimpan dan laporan harian menampilkan total yang benar.",
      },
    });
  }

  await prisma.milestoneSubmission.upsert({
    where: {
      projectMilestoneId_version: {
        projectMilestoneId: reviewMilestone.id,
        version: 1,
      },
    },
    update: {
      stagingUrl: "https://example.com",
      summary: "Alur kasir, pengelolaan produk, dan laporan penjualan harian siap ditinjau.",
      instructions: "Gunakan data demo; coba tambah transaksi lalu buka laporan harian.",
    },
    create: {
      projectMilestoneId: reviewMilestone.id,
      version: 1,
      stagingUrl: "https://example.com",
      summary: "Alur kasir, pengelolaan produk, dan laporan penjualan harian siap ditinjau.",
      instructions: "Gunakan data demo; coba tambah transaksi lalu buka laporan harian.",
    },
  });

  await prisma.projectMilestone.upsert({
    where: { id: "seed-milestone-deploy" },
    update: { status: "PENDING" },
    create: {
      id: "seed-milestone-deploy",
      projectId: activeProject.id,
      title: "Deployment & Pelatihan Operasional",
      weightBps: 4000,
      deadline: new Date("2026-10-05T00:00:00.000Z"),
      status: "PENDING",
    },
  });

  const escrow = await prisma.escrowTransaction.upsert({
    where: { projectId: activeProject.id },
    update: {},
    create: { projectId: activeProject.id },
  });

  await prisma.fundingReceipt.upsert({
    where: { projectId: activeProject.id },
    update: {
      status: "FUNDED",
      amountDue: 8_250_000n,
      amountReceived: 8_250_000n,
      paymentMethod: "BANK_TRANSFER",
      destinationBank: "BCA",
      destinationAccount: "8801212345678",
      destinationAccountHolder: "PT COCOKIN TEKNOLOGI INDONESIA",
      senderBank: "BCA",
      senderAccount: "0912345678",
      senderName: "Kopi Kenangan Senja",
      platformReference: "CCK-SEEDACTIVE-FUNDING-0001",
      externalReference: "SIM-SEEDACTIVE-BANK-0001",
    },
    create: {
      projectId: activeProject.id,
      status: "FUNDED",
      amountDue: 8_250_000n,
      amountReceived: 8_250_000n,
      paymentMethod: "BANK_TRANSFER",
      destinationBank: "BCA",
      destinationAccount: "8801212345678",
      destinationAccountHolder: "PT COCOKIN TEKNOLOGI INDONESIA",
      senderBank: "BCA",
      senderAccount: "0912345678",
      senderName: "Kopi Kenangan Senja",
      platformReference: "CCK-SEEDACTIVE-FUNDING-0001",
      externalReference: "SIM-SEEDACTIVE-BANK-0001",
    },
  });

  await prisma.$transaction(async (tx) => {
    await tx.ledgerEntry.deleteMany({
      where: { escrowTransactionId: escrow.id, platformReference: { startsWith: "CCK-SEEDACTIVE-" } },
    });
    await tx.ledgerEntry.createMany({
      data: [
        { escrowTransactionId: escrow.id, accountType: "CASH_AT_BANK", amount: 8_250_000n, platformReference: "CCK-SEEDACTIVE-FUNDING-0001" },
        { escrowTransactionId: escrow.id, accountType: "TALENT_PAYABLE", amount: -7_500_000n, platformReference: "CCK-SEEDACTIVE-FUNDING-0001" },
        { escrowTransactionId: escrow.id, accountType: "COCOKIN_FEE_PENDING", amount: -750_000n, platformReference: "CCK-SEEDACTIVE-FUNDING-0001" },
        { escrowTransactionId: escrow.id, accountType: "COCOKIN_FEE_PENDING", amount: 375_000n, platformReference: "CCK-SEEDACTIVE-ACTIVATION-0001" },
        { escrowTransactionId: escrow.id, accountType: "COCOKIN_FEE_EARNED", amount: -375_000n, platformReference: "CCK-SEEDACTIVE-ACTIVATION-0001" },
      ],
    });
  });

  const deliveredProject = await prisma.project.upsert({
    where: { id: "seed-project-delivered" },
    update: { status: "DELIVERED", solutionCategory: "WEBSITE_BRANDING" },
    create: {
      id: "seed-project-delivered",
      businessProfileId: businessProfile.id,
      title: "Website Company Profile Kedai Kopi",
      scope: "Company profile, menu, lokasi, kontak, dan deployment produksi.",
      difficulty: "BEGINNER",
      estimatedDays: 7,
      deadline: new Date("2026-08-25T00:00:00.000Z"),
      serviceValue: 2_500_000n,
      status: "DELIVERED",
      solutionCategory: "WEBSITE_BRANDING",
    },
  });

  await prisma.warrantyAgreement.upsert({
    where: { projectId: deliveredProject.id },
    update: {
      status: "ACTIVE",
      startDate: new Date("2026-08-28T00:00:00.000Z"),
      endDate: new Date("2026-09-27T00:00:00.000Z"),
    },
    create: {
      projectId: deliveredProject.id,
      status: "ACTIVE",
      startDate: new Date("2026-08-28T00:00:00.000Z"),
      endDate: new Date("2026-09-27T00:00:00.000Z"),
    },
  });

  await prisma.maintenancePackage.upsert({
    where: { projectId: deliveredProject.id },
    update: { ticketQuota: 4 },
    create: {
      projectId: deliveredProject.id,
      startDate: new Date("2026-08-28T00:00:00.000Z"),
      endDate: new Date("2026-09-27T00:00:00.000Z"),
      ticketQuota: 4,
    },
  });

  const existingTicket = await prisma.supportTicket.findFirst({
    where: { projectId: deliveredProject.id, description: "Tombol cetak struk kadang timeout." },
  });
  if (!existingTicket) {
    await prisma.supportTicket.create({
      data: {
        projectId: deliveredProject.id,
        severity: "MINOR",
        status: "RESOLVED",
        description: "Tombol cetak struk kadang timeout.",
      },
    });
  }

  // Seed Verified Portfolio Entry for Talent Budi Santoso
  await prisma.portfolioEntry.upsert({
    where: { projectId: deliveredProject.id },
    update: {
      isPublic: true,
    },
    create: {
      talentProfileId: talentProfile.id,
      projectId: deliveredProject.id,
      title: deliveredProject.title,
      businessName: "Kopi Kenangan Senja",
      problemSummary: "Kedai kopi membutuhkan identitas digital resmi agar pelanggan dapat melihat lokasi, jam buka, dan menu kopi secara online.",
      solutionBuilt: "Membangun website company profile modern yang responsif dengan katalog menu interaktif dan integrasi Google Maps.",
      isPublic: true,
    },
  });

  // Seed Draft Project for UMKM (Kopi Kenangan Senja)
  await prisma.project.upsert({
    where: { id: "seed-project-draft" },
    update: {
      title: "Otomasi Notifikasi Pengiriman Kopi via WhatsApp",
      status: "DRAFT",
    },
    create: {
      id: "seed-project-draft",
      businessProfileId: businessProfile.id,
      title: "Otomasi Notifikasi Pengiriman Kopi via WhatsApp",
      scope: "Draf proyek integrasi webhook status pengiriman paket biji kopi ke pelanggan otomatis via WhatsApp.",
      difficulty: "BEGINNER",
      estimatedDays: 5,
      deadline: new Date("2026-11-01T00:00:00.000Z"),
      serviceValue: 2_000_000n,
      status: "DRAFT",
      solutionCategory: "OPERATIONS_POS",
    },
  });

  // Seed Dispute Project & Active Dispute Case for Admin Desk
  const disputeProject = await prisma.project.upsert({
    where: { id: "seed-project-dispute" },
    update: { status: "DISPUTED" },
    create: {
      id: "seed-project-dispute",
      businessProfileId: businessProfile.id,
      title: "Integrasi Payment Gateway Multi-Cabang",
      scope: "Integrasi webhook callback dan rekonsiliasi payment gateway untuk 3 cabang kedai kopi.",
      difficulty: "ADVANCED",
      estimatedDays: 14,
      deadline: new Date("2026-09-01T00:00:00.000Z"),
      serviceValue: 6_000_000n,
      status: "DISPUTED",
      solutionCategory: "CATALOG_COMMERCE",
    },
  });

  const existingDispute = await prisma.dispute.findFirst({
    where: { projectId: disputeProject.id },
  });

  if (!existingDispute) {
    const dispute = await prisma.dispute.create({
      data: {
        projectId: disputeProject.id,
        reason: "Terdapat perbedaan interpretasi penanganan webhook refund pada sistem kasir.",
        status: "OPEN",
      },
    });

    await prisma.disputeEvidence.createMany({
      data: [
        {
          disputeId: dispute.id,
          fileUrl: "https://otslyoqlulbpbtbcixvk.supabase.co/storage/v1/object/public/cocokin-uploads/dispute-evidence-1.png",
          submitterId: umkmUser.id,
        },
        {
          disputeId: dispute.id,
          fileUrl: "https://otslyoqlulbpbtbcixvk.supabase.co/storage/v1/object/public/cocokin-uploads/dispute-evidence-2.png",
          submitterId: talentProfile.userId,
        },
      ],
    });
  }

  const moderationConversation = await prisma.projectConversation.upsert({
    where: { projectId: activeProject.id },
    update: { status: "ACTIVE" },
    create: { projectId: activeProject.id, status: "ACTIVE" },
  });
  await prisma.conversationParticipant.upsert({
    where: {
      projectConversationId_userId: {
        projectConversationId: moderationConversation.id,
        userId: umkmUser.id,
      },
    },
    update: {},
    create: { projectConversationId: moderationConversation.id, userId: umkmUser.id },
  });
  const reportedMessage = await prisma.chatMessage.upsert({
    where: {
      projectConversationId_sequenceNumber: {
        projectConversationId: moderationConversation.id,
        sequenceNumber: 99,
      },
    },
    update: {},
    create: {
      projectConversationId: moderationConversation.id,
      senderId: talentProfile.userId,
      sequenceNumber: 99,
      content: "Silakan transfer biaya tambahan ke rekening pribadi agar fitur segera dikerjakan.",
    },
  });
  const existingReport = await prisma.messageReport.findFirst({
    where: { messageId: reportedMessage.id, reporterId: umkmUser.id },
  });
  if (existingReport) {
    await prisma.messageReport.update({
      where: { id: existingReport.id },
      data: {
        messageContent: reportedMessage.content ?? "[Lampiran tanpa teks]",
        messageSenderId: reportedMessage.senderId,
        messageCreatedAt: reportedMessage.createdAt,
        reporterName: umkmUser.name ?? umkmUser.email ?? "UMKM",
      },
    });
  } else {
    await prisma.messageReport.create({
      data: {
        messageId: reportedMessage.id,
        reporterId: umkmUser.id,
        reason: "Permintaan pembayaran di luar alur resmi CocokIn.",
        messageContent: reportedMessage.content ?? "[Lampiran tanpa teks]",
        messageSenderId: reportedMessage.senderId,
        messageCreatedAt: reportedMessage.createdAt,
        reporterName: umkmUser.name ?? umkmUser.email ?? "UMKM",
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
