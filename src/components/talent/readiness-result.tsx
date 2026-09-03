import Link from "next/link";
import type { CareerReadinessResult } from "@/src/modules/talent/types";
import { getCareerDomain } from "@/src/modules/talent/career-taxonomy";
import { SkillGapChart } from "./skill-gap-chart";
import { getReadinessScores } from "@/src/modules/talent/readiness-flow";

type ReadinessResultProps = {
  result: CareerReadinessResult;
  onRestart: () => void;
};

export function ReadinessResult({ result, onRestart }: ReadinessResultProps) {
  const career = getCareerDomain(result.careerId);
  const allScores = getReadinessScores(result);

  return (
    <div className="readiness-result space-y-8">
      <div className="result-header pb-4 border-b border-[#D8E1EE]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#001040]">Hasil Cek Kesiapan Karier</h1>
        <p className="text-sm font-semibold text-[#006FE6] mt-1">{career.label}</p>
      </div>

      <div className="result-score">
        <div className="score-composite bg-white border border-[#D8E1EE] rounded-2xl p-6 sm:p-8 text-center shadow-sm">
          <p className="text-xs font-bold text-[#53647A] uppercase tracking-wider mb-2">Skor Kesiapan Kerja</p>
          <p className="text-5xl sm:text-6xl font-black text-[#001040] tracking-tight">{result.compositeScore}<span className="text-2xl text-[#53647A] font-medium">/100</span></p>
          <p className="mt-3 text-sm font-semibold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] inline-block px-4 py-1.5 rounded-full">
            {result.technicalScore} Skor Teknis • {result.softSkillScore} Skor Soft Skill
          </p>
        </div>
      </div>

      {/* Skill Gap Analysis Integration */}
      <div className="bg-white border border-[#D8E1EE] rounded-2xl p-6 sm:p-8 shadow-sm">
        <SkillGapChart careerId={result.careerId} scores={allScores} />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D8E1EE]">
        <Link href="/talent/projects" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#001040] px-6 py-3 text-sm font-bold !text-white shadow hover:bg-[#001040]/90 transition-all">
          Cari Proyek yang Cocok
        </Link>
        <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-[#D8E1EE] bg-white px-6 py-3 text-sm font-bold text-[#001040] hover:bg-[#F8FAFC] transition-all" onClick={onRestart}>
          Cek Ulang Kesiapan
        </button>
      </div>
    </div>
  );
}
