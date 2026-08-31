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
      careerTarget: "Frontend Developer",
      hasNoPortfolio: true,
      onboardingCompletedAt: new Date(),
      workModePreference: "REMOTE",
    },
    create: {
      userId: talentUser.id,
      bio: "Mahasiswa Sistem Informasi tingkat akhir dengan pengalaman fullstack web development. Senang membantu UMKM go digital.",
      university: "Universitas Indonesia",
      major: "Sistem Informasi",
      careerTarget: "Frontend Developer",
      hasNoPortfolio: true,
      onboardingCompletedAt: new Date(),
      workModePreference: "REMOTE",
    },
  });

  // Create some basic skills
  const skillsData = ["React", "Next.js", "TailwindCSS", "Node.js", "PostgreSQL"];
  
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
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

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
