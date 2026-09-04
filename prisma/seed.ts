import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedTalent(prisma: PrismaClient, passwordHash: string) {
  // Seed Talent User
  const talentUser = await prisma.user.upsert({
    where: { email: "talent@cocokin.id" },
    update: { emailVerified: new Date(), identityStatus: "CONTACT_VERIFIED" },
    create: {
      email: "talent@cocokin.id",
      name: "Budi Santoso",
      emailVerified: new Date(),
      identityStatus: "CONTACT_VERIFIED",
      role: "TALENT",
      passwordHash,
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

    await prisma.talentSkill.upsert({
      where: {
        talentProfileId_skillId: {
          talentProfileId: talentProfile.id,
          skillId: skill.id
        }
      },
      update: {},
      create: {
        talentProfileId: talentProfile.id,
        skillId: skill.id,
        evidenceLevel: "SELF_DECLARED"
      }
    });
  }
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("PEMBERITAHUAN KEAMANAN: Database seeding dilarang keras dijalankan pada lingkungan produksi!");
  }

  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // Backfill: rename legacy career target (track FE+BE digabung menjadi Fullstack)
  await prisma.talentProfile.updateMany({
    where: { careerTarget: "Frontend Developer" },
    data: { careerTarget: "Fullstack Developer" },
  });

  // Seed Admin User (Farid - Platform Trust & Operations)
  await prisma.user.upsert({
    where: { email: "admin@cocokin.id" },
    update: { emailVerified: new Date(), identityStatus: "CONTACT_VERIFIED", role: "ADMIN" },
    create: {
      email: "admin@cocokin.id",
      name: "Admin Farid",
      emailVerified: new Date(),
      identityStatus: "CONTACT_VERIFIED",
      role: "ADMIN",
      passwordHash,
    },
  });

  // Seed Business User
  const umkmUser = await prisma.user.upsert({
    where: { email: "umkm@cocokin.id" },
    update: { emailVerified: new Date(), identityStatus: "CONTACT_VERIFIED" },
    create: {
      email: "umkm@cocokin.id",
      name: "UMKM Demo",
      emailVerified: new Date(),
      identityStatus: "CONTACT_VERIFIED",
      role: "BUSINESS",
      passwordHash,
    },
  });

  // Seed Business Profile
  const businessProfile = await prisma.businessProfile.upsert({
    where: { userId: umkmUser.id },
    update: {},
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

  await seedTalent(prisma, passwordHash);

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
