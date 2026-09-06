"use client";

import { useState } from "react";
import type {
  AssessmentAnswer,
  AssessmentQuestion,
  CareerDomainId,
  CareerReadinessResult,
} from "@/src/modules/talent/types";
import type { CatalogQuestion } from "@/src/modules/assessment/catalog";
import { useTalent } from "@/src/context/talent-context";
import { CareerPicker } from "./career-picker";
import { ReadinessResult } from "./readiness-result";
import { Sparkle, ArrowLeft } from "@phosphor-icons/react";

type Step = "career" | "quiz" | "result";

export function AssessmentWizard({
  initialCareerId,
  onComplete,
  questionCatalog,
}: {
  initialCareerId?: CareerDomainId;
  onComplete?: () => void;
  questionCatalog: Record<CareerDomainId, CatalogQuestion[]>;
}) {
  const { applyAssessmentResult } = useTalent();
  const [step, setStep] = useState<Step>(initialCareerId ? "quiz" : "career");
  const [careerId, setCareerId] = useState<CareerDomainId | null>(initialCareerId ?? null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(
    initialCareerId ? questionCatalog[initialCareerId] : []
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [submittedAnswers, setSubmittedAnswers] = useState<Array<{ questionId: string; optionId: string }>>([]);
  const [result, setResult] = useState<CareerReadinessResult | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCareerSelect = (selectedCareerId: CareerDomainId) => {
    setCareerId(selectedCareerId);
    const careerQuestions = questionCatalog[selectedCareerId];
    setQuestions(careerQuestions);
    setStep("quiz");
  };

  const handleAnswer = async (optionId: string, score: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = [
      ...answers,
      { questionId: currentQuestion.id, selectedScore: score },
    ];
    setAnswers(newAnswers);
    const newSubmittedAnswers = [...submittedAnswers, { questionId: currentQuestion.id, optionId }];
    setSubmittedAnswers(newSubmittedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz selesai, hitung hasil & simpan ke DB
      if (careerId) {
        setSaving(true);
        try {
          const response = await fetch("/api/talent/assessment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ careerId, answers: newSubmittedAnswers }),
          });
          if (!response.ok) throw new Error("Gagal menyimpan hasil asesmen.");
          const payload = await response.json();
          setResult(payload.result);
          applyAssessmentResult(payload.result);
          onComplete?.();
        } catch (e) {
          console.error("Failed to save assessment to backend", e);
        } finally {
          setSaving(false);
          setStep("result");
        }
      }
    }
  };

  const handleRestart = () => {
    setStep("career");
    setCareerId(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSubmittedAnswers([]);
    setResult(null);
  };

  if (step === "career") {
    return <CareerPicker onSelect={handleCareerSelect} selected={careerId ?? undefined} />;
  }

  if (step === "quiz" && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="assessment-quiz">
        <div className="quiz-progress">
          <div className="quiz-progress__bar-bg">
            <div className="quiz-progress__bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="quiz-progress__label">
            Pertanyaan {currentQuestionIndex + 1} dari {questions.length} ({Math.round(progress)}%)
          </p>
        </div>

        {saving && (
          <div className="mb-4 p-3 bg-[#EAF3FF] border border-[#BAE6FD] text-[#006FE6] text-xs font-bold rounded-xl text-center animate-pulse">
            Menyimpan hasil Cek Kesiapan ke akun Anda...
          </div>
        )}

        <div className="quiz-question">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p className="quiz-question__type">
              <Sparkle size={14} weight="fill" style={{ display: "inline", marginRight: "4px" }} />
              {currentQuestion.type === "TECHNICAL" ? "Kompetensi Teknis" : "Soft Skill Profesional"}
            </p>
            <button
              type="button"
              className="text-action"
              onClick={handleRestart}
              style={{ fontSize: "0.8rem" }}
            >
              <ArrowLeft size={14} /> Ganti Karier
            </button>
          </div>

          <h2>{currentQuestion.text}</h2>

          <div className="quiz-options">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                type="button"
                className="quiz-option"
                onClick={() => handleAnswer(option.id ?? `${currentQuestion.id}-${idx}`, option.score)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "result" && result) {
    return <ReadinessResult result={result} onRestart={handleRestart} />;
  }

  return null;
}
