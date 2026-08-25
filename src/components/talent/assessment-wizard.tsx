"use client";

import { useState } from "react";
import type {
  AssessmentAnswer,
  AssessmentQuestion,
  CareerDomainId,
  CareerReadinessResult,
} from "@/src/modules/talent/types";
import { getQuestionsForCareer } from "@/src/modules/talent/assessment-bank";
import { calculateCareerReadiness } from "@/src/modules/talent/career-readiness";
import { useTalent } from "@/src/context/talent-context";
import { CareerPicker } from "./career-picker";
import { ReadinessResult } from "./readiness-result";
import { Sparkle, ArrowLeft } from "@phosphor-icons/react";

type Step = "career" | "quiz" | "result";

export function AssessmentWizard() {
  const { applyAssessmentResult } = useTalent();
  const [step, setStep] = useState<Step>("career");
  const [careerId, setCareerId] = useState<CareerDomainId | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [result, setResult] = useState<CareerReadinessResult | null>(null);

  const handleCareerSelect = (selectedCareerId: CareerDomainId) => {
    setCareerId(selectedCareerId);
    const careerQuestions = getQuestionsForCareer(selectedCareerId);
    setQuestions(careerQuestions);
    setStep("quiz");
  };

  const handleAnswer = (score: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = [
      ...answers,
      { questionId: currentQuestion.id, selectedScore: score },
    ];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz selesai, hitung hasil
      if (careerId) {
        const calculatedResult = calculateCareerReadiness(careerId, newAnswers);
        setResult(calculatedResult);
        applyAssessmentResult(calculatedResult);
        setStep("result");
      }
    }
  };

  const handleRestart = () => {
    setStep("career");
    setCareerId(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
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
                onClick={() => handleAnswer(option.score)}
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
