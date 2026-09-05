"use client";

import { ArrowRight, ChartLineUp, CheckCircle, Circle } from "@phosphor-icons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { CocokInBrand } from "@/src/design-system/cocokin-brand";

const ASSESSMENT_QUESTIONS = [
  {
    id: "q1",
    pillar: "Pilar 1 • Keuangan Digital",
    text: "Apakah bisnis Anda sudah memiliki pencatatan keuangan digital?",
    options: ["Belum", "Dalam Proses", "Sudah"],
  },
  {
    id: "q2",
    pillar: "Pilar 2 • Target Pasar",
    text: "Apakah Anda memiliki target pasar digital yang jelas?",
    options: ["Belum", "Sebagian", "Sudah"],
  },
  {
    id: "q3",
    pillar: "Pilar 3 • Kesiapan Tim",
    text: "Seberapa siap tim Anda untuk mengadopsi teknologi baru?",
    options: ["Kurang Siap", "Cukup Siap", "Sangat Siap"],
  },
  {
    id: "q4",
    pillar: "Pilar 4 • SOP Operasional",
    text: "Apakah Anda memiliki SOP (Standard Operating Procedure) operasional?",
    options: ["Tidak Ada", "Ada namun tidak lengkap", "Ada dan Lengkap"],
  },
  {
    id: "q5",
    pillar: "Pilar 5 • Kolaborasi Freelancer / Talent",
    text: "Apakah Anda pernah menggunakan jasa freelancer/talent sebelumnya?",
    options: ["Belum Pernah", "Pernah, tapi kurang puas", "Pernah dan Puas"],
  },
] as const;

export function BusinessAssessmentWizard() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / ASSESSMENT_QUESTIONS.length) * 100);

  const handleSelect = (questionId: string, optionValue: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionValue }));
    if (error) setError(undefined);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (answeredCount < ASSESSMENT_QUESTIONS.length) {
      setError(`Harap jawab seluruh ${ASSESSMENT_QUESTIONS.length} pertanyaan asesmen sebelum melanjutkan.`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/business/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan hasil asesmen. Silakan coba lagi.");
      }

      router.push("/business");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memproses asesmen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#D8E1EE] bg-white p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,16,64,0.18)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-assessment-title"
    >
      {/* Header Dialog */}
      <div className="pb-5 border-b border-[#D8E1EE]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CocokInBrand className="h-7 w-7 object-contain" decorative priority variant="mark" />
            <div>
              <h2
                id="modal-assessment-title"
                className="text-lg font-bold text-[#001040] leading-tight"
              >
                Asesmen Kesiapan Digital
              </h2>
              <p className="text-xs text-[#53647A]">
                Evaluasi 5 pilar kesiapan bisnis Anda untuk pencocokan proyek yang akurat.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF3FF] text-[#006FE6]">
            <ChartLineUp size={20} weight="duotone" />
          </div>
        </div>

        {/* Minimalist SVG Progress Bar */}
        <div className="mt-4 pt-3 border-t border-[#F1F5FB]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#53647A]">Progres Pengisian</span>
            <span className="font-bold text-[#006FE6] tabular-nums">
              {answeredCount} dari {ASSESSMENT_QUESTIONS.length} pilar ({progressPercent}%)
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#F1F5FB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#006FE6] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      {/* Questions Form */}
      <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-1">
          {ASSESSMENT_QUESTIONS.map((question, index) => {
            const currentSelected = answers[question.id];

            return (
              <fieldset key={question.id} className="space-y-2 border-0 p-0 m-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#006FE6]">
                    {question.pillar}
                  </span>
                </div>
                <legend className="text-sm font-bold text-[#001040] leading-snug">
                  {index + 1}. {question.text}{" "}
                  <span className="text-[#BE123C] font-black ml-0.5" title="Wajib dijawab">
                    *
                  </span>
                </legend>

                {/* Selectable Options Minimalist Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {question.options.map((option) => {
                    const isSelected = currentSelected === option;

                    return (
                      <label
                        key={option}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#EAF3FF] border-[#006FE6] text-[#001040] shadow-sm ring-1 ring-[#006FE6]/30"
                            : "bg-[#F7F9FC] border-[#D8E1EE] text-[#53647A] hover:bg-[#F1F5FB] hover:border-[#9AABC2]"
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={isSelected}
                          onChange={() => handleSelect(question.id, option)}
                          className="sr-only"
                        />
                        {isSelected ? (
                          <CheckCircle size={18} weight="fill" className="text-[#006FE6] shrink-0" />
                        ) : (
                          <Circle size={18} weight="regular" className="text-[#9AABC2] shrink-0" />
                        )}
                        <span className="leading-tight">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="rounded-xl border border-[#FECDD3] bg-[#FFF1F2] p-3 text-xs font-semibold text-[#BE123C]"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 border-t border-[#D8E1EE]">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#001040] hover:bg-[#001040]/90 !text-white px-5 py-3 text-sm font-bold shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
          >
            <span>{loading ? "Menghitung Skor Kesiapan..." : "Selesaikan & Masuk ke Dashboard"}</span>
            {!loading && <ArrowRight size={16} weight="bold" />}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
