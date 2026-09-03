"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/src/design-system/page-header";
import { ClipboardText, Sparkle, ArrowRight, Info, SealCheck, TrendUp, Lightbulb } from "@phosphor-icons/react";
import { AssessmentWizard } from "@/src/components/talent/assessment-wizard";
import type { CareerDomainId, CareerReadinessResult } from "@/src/modules/talent/types";
import { useTalent } from "@/src/context/talent-context";

// Helper map label karier dari profil ke taxonomy ID
const CAREER_MAP: Record<string, CareerDomainId> = {
  "Fullstack Developer": "fullstack-dev",
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

function GuidanceBento() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl p-4 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-[#EAF3FF] text-[#006FE6] text-xs font-extrabold tabular-nums">
          10 Soal Teknis
        </span>
        <p className="text-xs text-[#53647A] mt-2 leading-relaxed">
          Pertanyaan praktis sesuai target karier yang kamu pilih.
        </p>
      </div>
      <div className="bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl p-4 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-[#FFF7ED] text-[#B45309] text-xs font-extrabold tabular-nums">
          3 Kasus Soft Skill
        </span>
        <p className="text-xs text-[#53647A] mt-2 leading-relaxed">
          Skenario profesional: problem solving, komunikasi, etika digital.
        </p>
      </div>
      <div className="bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl p-4 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-[#ECFDF5] text-[#047857] text-xs font-extrabold">
          &plusmn;5-7 Menit
        </span>
        <p className="text-xs text-[#53647A] mt-2 leading-relaxed">
          Satu sesi ringan, hasil langsung tersimpan di akunmu.
        </p>
      </div>
    </div>
  );
}

function ResultScorecard({
  latestAssessment,
  breakdown,
  onRetake,
}: {
  latestAssessment: NonNullable<AssessmentClientViewProps["latestAssessment"]>;
  breakdown: CareerReadinessResult | null;
  onRetake: () => void;
}) {
  const techContribution = Math.round(latestAssessment.technicalScore * 0.6);
  const softContribution = Math.round(latestAssessment.softSkillScore * 0.4);
  const assessedCount = breakdown
    ? [...breakdown.technicalBreakdown, ...breakdown.softSkillBreakdown].filter(
        (s) => s.talentScore >= 50,
      ).length
    : 0;

  return (
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
              Diambil pada:{" "}
              {new Date(latestAssessment.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <button
          onClick={onRetake}
          className="bg-[#001040] hover:bg-[#001040]/90 !text-white px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
        >
          Cek Ulang Kesiapan &rarr;
        </button>
      </div>

      {/* Formula transparansi */}
      <div className="bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl p-4 sm:p-5 space-y-2">
        <code className="block text-sm sm:text-base font-bold text-[#001040] text-center tracking-tight">
          Skor Komposit = (60% &times; Soal Teknis) + (40% &times; Kasus Soft
          Skill)
        </code>
        <p className="text-center text-sm text-[#53647A] tabular-nums">
          ({latestAssessment.technicalScore} &times; 0.6) + (
          {latestAssessment.softSkillScore} &times; 0.4) = {techContribution} +{" "}
          {softContribution} ={" "}
          <strong className="text-[#006FE6]">
            {latestAssessment.compositeScore}%
          </strong>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl text-center">
          <h3 className="text-xs font-extrabold text-[#53647A] uppercase tracking-wider mb-1">
            Skor Teknis
          </h3>
          <p className="text-4xl font-black text-[#001040] tabular-nums">
            {latestAssessment.technicalScore}
          </p>
          <span className="text-[11px] text-[#53647A] mt-1 block">
            Bobot 60% &rarr; {techContribution} poin
          </span>
        </div>
        <div className="p-5 bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl text-center">
          <h3 className="text-xs font-extrabold text-[#53647A] uppercase tracking-wider mb-1">
            Skor Soft-Skill
          </h3>
          <p className="text-4xl font-black text-[#001040] tabular-nums">
            {latestAssessment.softSkillScore}
          </p>
          <span className="text-[11px] text-[#53647A] mt-1 block">
            Bobot 40% &rarr; {softContribution} poin
          </span>
        </div>
        <div className="p-5 bg-[#EAF3FF] border border-[#BAE6FD] rounded-xl text-center">
          <h3 className="text-xs font-extrabold text-[#006FE6] uppercase tracking-wider mb-1">
            Skor Kesiapan Kerja
          </h3>
          <p className="text-4xl font-black text-[#006FE6] tabular-nums">
            {latestAssessment.compositeScore}%
          </p>
          <span className="text-[11px] font-bold text-[#047857] mt-1 block">
            Tingkat Kesiapan{" "}
            {latestAssessment.compositeScore >= 80
              ? "Tinggi"
              : latestAssessment.compositeScore >= 60
                ? "Menengah"
                : "Terbatas"}
          </span>
        </div>
      </div>

      {breakdown && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl flex gap-3">
            <SealCheck size={20} weight="duotone" className="text-[#006FE6] shrink-0 mt-0.5" />
            <p className="text-xs text-[#001040] leading-relaxed">
              <strong className="tabular-nums">{assessedCount} keahlian</strong>{" "}
              dengan skor &ge;50% otomatis mendapatkan lencana{" "}
              <strong>Assessed</strong> pada Paspor Keahlian Anda.
            </p>
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl flex gap-3">
            <TrendUp size={20} weight="duotone" className="text-[#006FE6] shrink-0 mt-0.5" />
            <p className="text-xs text-[#001040] leading-relaxed">
              Faktor kecocokan skill dalam Cocok Score menguat, menaikkan
              prioritas profilmu di mata UMKM.
            </p>
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl flex gap-3">
            <Lightbulb size={20} weight="duotone" className="text-[#006FE6] shrink-0 mt-0.5" />
            <p className="text-xs text-[#001040] leading-relaxed">
              Kunjungi detail hasil untuk melihat skill breakdown, benchmark
              industri, dan rekomendasi proyek mikro.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function AssessmentClientView({
  careerTarget,
  latestAssessment,
}: AssessmentClientViewProps) {
  const router = useRouter();
  const [isQuizActive, setIsQuizActive] = useState(false);
  const { latestReadinessResult } = useTalent();

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
      <PageHeader
        eyebrow="Validasi Kemampuan"
        title="Cek Kesiapan Karier"
        description="Cari tahu kesiapan teknis & soft skill kamu untuk proyek UMKM dan tingkatkan Cocok Score profilmu."
        action={
          <button
            onClick={() => setIsQuizActive(true)}
            className="primary-action whitespace-nowrap bg-[#001040] hover:bg-[#001040]/90 !text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            {latestAssessment ? "Cek Ulang Kesiapan" : "Mulai Cek Kesiapan"}{" "}
            <ArrowRight weight="bold" size={16} />
          </button>
        }
      />

      {!latestAssessment ? (
        <div className="space-y-6">
          <div className="bg-[#FFFBEB] border border-[#FDE68A] p-6 sm:p-8 rounded-2xl flex items-start gap-4 shadow-sm">
            <Info size={32} className="text-[#D97706] shrink-0 mt-0.5" weight="fill" />
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-[#92400E]">
                Kamu Belum Melakukan Cek Kesiapan
              </h3>
              <p className="text-sm text-[#92400E] leading-relaxed max-w-2xl">
                Cek kesiapan ini mencakup pertanyaan praktis seputar keahlian
                teknis dan soft-skill profesional. Menyelesaikan kuis ini akan
                memberikan status <strong>Assessed</strong> pada keahlianmu dan
                menaikkan prioritasmu di mata UMKM!
              </p>
            </div>
          </div>

          <GuidanceBento />
        </div>
      ) : (
        <ResultScorecard
          latestAssessment={latestAssessment}
          breakdown={latestReadinessResult}
          onRetake={() => setIsQuizActive(true)}
        />
      )}
    </div>
  );
}
