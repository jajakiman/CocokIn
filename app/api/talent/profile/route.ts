import { NextResponse } from "next/server";
import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { hasTalentFeatureAccess } from "@/src/modules/talent/feature-access";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "TALENT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!(await hasTalentFeatureAccess(session.id))) return new NextResponse("Onboarding required", { status: 403 });

    const body = await req.json();
    const { name, bio, university, major, workModePreference, timeAvailability, careerTarget } = body;

    // Update the User name
    if (name) {
      await prisma.user.update({
        where: { id: session.id },
        data: { name }
      });
    }

    // Update TalentProfile
    const profile = await prisma.talentProfile.upsert({
      where: { userId: session.id },
      update: {
        bio,
        university,
        major,
        workModePreference,
        timeAvailability,
        careerTarget
      },
      create: {
        userId: session.id,
        bio,
        university,
        major,
        workModePreference,
        timeAvailability,
        careerTarget
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Failed to save talent profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
