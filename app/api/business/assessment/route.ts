import { NextResponse } from "next/server";
import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "BUSINESS") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { answers } = await req.json();

    // Calculate a mock readiness score (0-100)
    let score = 0;
    const answerKeys = Object.keys(answers);
    
    answerKeys.forEach((key) => {
      const ans = answers[key];
      if (ans.includes("Sudah") || ans.includes("Sangat Siap") || ans.includes("Lengkap") || ans.includes("Puas")) {
        score += 20;
      } else if (ans.includes("Proses") || ans.includes("Sebagian") || ans.includes("Cukup Siap") || ans.includes("kurang puas") || ans.includes("Ada namun")) {
        score += 10;
      }
    });

    const profile = await prisma.businessProfile.findUnique({
      where: { userId: session.id }
    });

    if (!profile) {
      return new NextResponse("Business profile not found. Complete profile first.", { status: 400 });
    }

    // Delete old assessments to keep it simple (only latest matters)
    await prisma.businessAssessmentResult.deleteMany({
      where: { businessProfileId: profile.id }
    });

    const assessmentResult = await prisma.businessAssessmentResult.create({
      data: {
        businessProfileId: profile.id,
        readinessScore: score,
      }
    });

    return NextResponse.json(assessmentResult);
  } catch (error) {
    console.error("Failed to save assessment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
