"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/src/design-system/page-header";
import { ClipboardText, Info, Sparkle, ArrowRight } from "@phosphor-icons/react";
import { AssessmentWizard } from "@/src/components/talent/assessment-wizard";
import type { CareerDomainId } from "@/src/modules/talent/types";

// Helper map label karier dari profil ke taxonomy ID
const CAREER_MAP: Record<string, CareerDomainId> = {
  "Frontend Developer": "frontend-dev",
  "UI/UX Designer": "ui-ux-designer",
  "Data Analyst": "data-analyst",
  "Digital Marketer": "digital-marketer",
};

type AssessmentClientViewProps = {
  careerTarget: string | null;
  latestAssessment: {
    id: string;
    technicalScore: number;
    softSkillScore: number;
    compositeScore: number;
    createdAt: string;
  } | null;
};

export function AssessmentClientView({
  careerTarget,
  latestAssessment,
}: AssessmentClientViewProps) {
  const router = useRouter();
  const [isQuizActive, setIsQuizActive] = useState(false);

  const initialCareerId = careerTarget ? CAREER_MAP[careerTarget] : undefined;

  if (isQuizActive) {
    return (
      <div className="max-w-4xl mx-auto py-6">
        <AssessmentWizard
          initialCareerId={initialCareerId}
          onComplete={() => {
            router.refresh();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <PageHeader
          eyebrow="Validasi Kemampuan"
          title="Cek Kesiapan Karier"
          description="Cari tahu kesiapan teknis & soft skill kamu untuk proyek UMKM dan tingkatkan Cocok Score profilmu."
        />
        {!latestAssessment && (
          <button
            onClick={() => setIsQuizActive(true)}
            className="bg-[#001040] hover:bg-[#001040]/90 !text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 mt-4 md:mt-0 transition-all shadow-md active:scale-95"
          >
            Mulai Cek Kesiapan <ArrowRight weight="bold" size={16} />
          </button>
        )}
      </div>

      {!latestAssessment ? (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] p-6 sm:p-8 rounded-2xl flex items-start gap-4 shadow-sm">
          <Info size={32} className="text-[#D97706] shrink-0 mt-0.5" weight="fill" />
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-[#92400E]">Kamu Belum Melakukan Cek Kesiapan</h3>
            <p className="text-sm text-[#92400E] leading-relaxed max-w-2xl">
              Cek kesiapan ini mencakup pertanyaan praktis seputar keahlian teknis dan soft-skill profesional.
              Menyelesaikan kuis ini akan memberikan status <strong>Assessed</strong> pada keahlianmu dan menaikkan prioritasmu di mata UMKM!
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsQuizActive(true)}
                className="bg-[#D97706] hover:bg-[#B45309] !text-white px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                Mulai Sekarang (±5 Menit) &rarr;
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#D8E1EE] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D8E1EE]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#EAF3FF] text-[#006FE6] flex items-center justify-center shrink-0">
                <ClipboardText size={28} weight="duotone" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#001040] flex items-center gap-2">
                  Hasil Cek Kesiapan Terkini
                  <Sparkle size={18} weight="fill" className="text-[#FF8010]" />
                </h2>
                <p className="text-xs text-[#53647A] mt-0.5">
                  Diambil pada: {new Date(latestAssessment.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsQuizActive(true)}
              className="bg-[#001040] hover:bg-[#001040]/90 !text-white px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
            >
              Cek Ulang Kesiapan &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl text-center">
              <h3 className="text-xs font-extrabold text-[#53647A] uppercase tracking-wider mb-1">Skor Teknis</h3>
              <p className="text-4xl font-black text-[#001040]">{latestAssessment.technicalScore}</p>
              <span className="text-[11px] text-[#53647A] mt-1 block">Bobot 60%</span>
            </div>
            <div className="p-5 bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl text-center">
              <h3 className="text-xs font-extrabold text-[#53647A] uppercase tracking-wider mb-1">Skor Soft-Skill</h3>
              <p className="text-4xl font-black text-[#001040]">{latestAssessment.softSkillScore}</p>
              <span className="text-[11px] text-[#53647A] mt-1 block">Bobot 40%</span>
            </div>
            <div className="p-5 bg-[#EAF3FF] border border-[#BAE6FD] rounded-xl text-center">
              <h3 className="text-xs font-extrabold text-[#006FE6] uppercase tracking-wider mb-1">Skor Kesiapan Kerja</h3>
              <p className="text-4xl font-black text-[#006FE6]">{latestAssessment.compositeScore}%</p>
              <span className="text-[11px] font-bold text-[#059669] mt-1 block">Tingkat Kesiapan Tinggi</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
