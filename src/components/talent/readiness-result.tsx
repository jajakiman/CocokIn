import Link from "next/link";
import type { CareerReadinessResult } from "@/src/modules/talent/types";
import { getCareerDomain } from "@/src/modules/talent/career-taxonomy";
import { CompositeScoreDonut } from "./composite-score-donut";
import { ReadinessBarChart } from "./readiness-bar-chart";
import { getReadinessScores } from "@/src/modules/talent/readiness-flow";
import { analyzeSkillGap } from "@/src/modules/talent/skill-gap";
import { Sparkle, SealCheck, TrendUp, Lightbulb } from "@phosphor-icons/react";

type ReadinessResultProps = {
  result: CareerReadinessResult;
  onRestart: () => void;
};

export function ReadinessResult({ result, onRestart }: ReadinessResultProps) {
  const career = getCareerDomain(result.careerId);
  const allScores = getReadinessScores(result);
  const gapAnalysis = analyzeSkillGap(result.careerId, allScores);
  const assessedCount = allScores.filter((s) => s.talentScore >= 50).length;
  const techContribution = Math.round(result.technicalScore * 0.6);
  const softContribution = Math.round(result.softSkillScore * 0.4);

  return (
    <div className="readiness-result space-y-8">
      <div className="result-header pb-4 border-b border-[#D8E1EE]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#001040]">
          Hasil Cek Kesiapan Karier
        </h1>
        <p className="text-sm font-semibold text-[#006FE6] mt-1">
          {career.label}
        </p>
      </div>

      {/* 1. Transparansi Formula Skor Komposit */}
      <section
        aria-labelledby="formula-title"
        className="bg-white border border-[#D8E1EE] rounded-2xl p-6 sm:p-8 shadow-sm"
      >
        <h2
          id="formula-title"
          className="text-lg font-bold text-[#001040] mb-3 flex items-center gap-2"
        >
          <Sparkle size={20} weight="fill" className="text-[#FF8010]" />
          Transparansi Skor Komposit
        </h2>
        <div className="bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl p-4 sm:p-5 space-y-3">
          <code
            className="block text-sm sm:text-base font-bold text-[#001040] text-center tracking-tight"
            aria-label="Rumus skor komposit: 60 persen rata-rata soal teknis ditambah 40 persen rata-rata kasus soft skill"
          >
            Skor Komposit = (60% &times; Rata-rata {result.technicalBreakdown.length}{" "}
            Soal Teknis) + (40% &times; Rata-rata{" "}
            {result.softSkillBreakdown.length} Kasus Soft Skill)
          </code>
          <p className="text-center text-sm text-[#53647A] tabular-nums">
            ({result.technicalScore} &times; 0.6) + ({result.softSkillScore}{" "}
            &times; 0.4) = {techContribution} + {softContribution} ={" "}
            <strong className="text-[#006FE6]">{result.compositeScore}%</strong>
          </p>
        </div>
      </section>

      {/* 2 & 3. Donut + Bar Chart side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <CompositeScoreDonut
            technicalScore={result.technicalScore}
            softSkillScore={result.softSkillScore}
            compositeScore={result.compositeScore}
          />
        </div>

        <div className="lg:col-span-3 bg-white border border-[#D8E1EE] rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#001040] mb-4">
            Skill Breakdown &amp; Gap Analysis
          </h2>
          <ReadinessBarChart
            careerId={result.careerId}
            technicalBreakdown={result.technicalBreakdown}
            softSkillBreakdown={result.softSkillBreakdown}
          />
        </div>
      </div>

      {/* 4. Impact ke Cocok Score */}
      <section
        aria-labelledby="impact-title"
        className="bg-white border border-[#D8E1EE] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4"
      >
        <h2
          id="impact-title"
          className="text-lg font-bold text-[#001040] flex items-center gap-2"
        >
          <TrendUp size={20} weight="duotone" className="text-[#006FE6]" />
          Bagaimana Nilai Ini Membantu Kamu
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#EAF3FF] border border-[#BAE6FD] rounded-xl">
            <div className="flex items-center gap-2 text-[#006FE6] font-bold text-sm mb-1">
              <SealCheck size={18} weight="duotone" />
              Status Keahlian
            </div>
            <p className="text-xs text-[#001040] leading-relaxed">
              <strong className="tabular-nums">{assessedCount} keahlian</strong>{" "}
              dengan skor &ge;50% otomatis dipromosikan ke level{" "}
              <strong>Assessed</strong> pada Paspor Keahlian Anda.
            </p>
          </div>

          <div className="p-4 bg-[#EAF3FF] border border-[#BAE6FD] rounded-xl">
            <div className="flex items-center gap-2 text-[#006FE6] font-bold text-sm mb-1">
              <TrendUp size={18} weight="duotone" />
              Bobot Matching
            </div>
            <p className="text-xs text-[#001040] leading-relaxed">
              Faktor kecocokan skill profilmu menguat, meningkatkan peluang
              lolos seleksi UMKM di CocokIn.
            </p>
          </div>

          <div className="p-4 bg-[#EAF3FF] border border-[#BAE6FD] rounded-xl">
            <div className="flex items-center gap-2 text-[#006FE6] font-bold text-sm mb-1">
              <Lightbulb size={18} weight="duotone" />
              Rekomendasi
            </div>
            <p className="text-xs text-[#001040] leading-relaxed">
              {gapAnalysis.majorSkillGapIds.length > 0
                ? `Ambil proyek mikro yang melatih: ${gapAnalysis.gaps
                    .filter((g) => gapAnalysis.majorSkillGapIds.includes(g.skillId))
                    .map((g) => g.name)
                    .join(", ")}.`
                : "Semua keahlian memenuhi benchmark industri. Pertahankan dan cari proyek yang menantang."}
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D8E1EE]">
        <Link
          href="/talent/projects"
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#001040] px-6 py-3 text-sm font-bold !text-white shadow hover:bg-[#001040]/90 transition-all"
        >
          Cari Proyek yang Cocok
        </Link>
        <button
          type="button"
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-[#D8E1EE] bg-white px-6 py-3 text-sm font-bold text-[#001040] hover:bg-[#F8FAFC] transition-all"
          onClick={onRestart}
        >
          Cek Ulang Kesiapan
        </button>
      </div>
    </div>
  );
}
