import { NextResponse } from "next/server";
import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { submitReadinessAssessment } from "@/src/modules/business/business.service";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "BUSINESS") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { answers } = await req.json();

    const assessmentResult = await submitReadinessAssessment(session.id, answers);

    return NextResponse.json(assessmentResult);
  } catch (error: any) {
    console.error("Failed to save assessment:", error);
    if (error.message === "Business profile not found. Complete profile first.") {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
