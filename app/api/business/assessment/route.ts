import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/session";
import { submitReadinessAssessment } from "@/src/modules/business/business.service";
import { loadBusinessAssessment, resolveSubmittedAnswers } from "@/src/modules/assessment/catalog";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "BUSINESS") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const parsed = z.object({ answers: z.array(z.object({ questionId: z.string().min(1), optionId: z.string().min(1) })) }).safeParse(await req.json());
    if (!parsed.success) return new NextResponse("Payload tidak valid", { status: 400 });
    const questions = await loadBusinessAssessment();
    const resolved = resolveSubmittedAnswers(questions, parsed.data.answers);
    const scoreByQuestion = new Map(resolved.map((answer) => [answer.questionId, answer.selectedScore]));
    const answers = Object.fromEntries(questions.slice(0, 5).map((question, index) => [`q${index + 1}`, scoreByQuestion.get(question.id) ?? 0]));

    const assessmentResult = await submitReadinessAssessment(session.id, answers);

    return NextResponse.json(assessmentResult);
  } catch (error: unknown) {
    console.error("Failed to save assessment:", error);
    if (error instanceof Error && error.message === "Business profile not found. Complete profile first.") {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
