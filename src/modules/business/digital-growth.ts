export type AssessmentRecord = {
  id: string;
  readinessScore: number;
  financeScore: number;
  marketingScore: number;
  teamScore: number;
  operationsScore: number;
  outsourcingScore: number;
  createdAt: Date;
};

export type PillarGrowth = {
  key: "finance" | "marketing" | "team" | "operations" | "outsourcing";
  label: string;
  description: string;
  before: number;
  after: number;
  delta: number;
  isPositive: boolean;
};

export type DigitalGrowthSummary = {
  hasGrowth: boolean;
  baseline: AssessmentRecord | null;
  latest: AssessmentRecord | null;
  deltaScore: number;
  deltaPercent: number;
  stage: string;
  stageDescription: string;
  pillars: PillarGrowth[];
};

function getAdoptionStage(score: number): { stage: string; description: string } {
  if (score <= 0) {
    return {
      stage: "Belum Asesmen",
      description: "Belum ada riwayat asesmen kesiapan digital.",
    };
  }
  if (score < 50) {
    return {
      stage: "Tahap Inisiasi Digital",
      description: "Fondasi digital awal, memerlukan standarisasi pencatatan dan kehadiran online terarah.",
    };
  }
  if (score < 80) {
    return {
      stage: "Tahap Adopsi & Otomasi",
      description: "Operasional dan pemasaran mulai terdigitalisasi, siap mengotomasi alur kerja dan integrasi sistem.",
    };
  }
  return {
    stage: "Tahap Terintegrasi & Siap Skala",
    description: "Sistem digital telah terintegrasi di seluruh pilar, siap meningkatkan skala bisnis dan efisiensi penuh.",
  };
}

/**
 * Calculates digital growth delta (FR-BIZ-05) across business assessment timeline.
 * Delta = Readiness_After - Readiness_Before
 * Pure calculation function.
 */
export function calculateDigitalGrowth(assessments: AssessmentRecord[]): DigitalGrowthSummary {
  if (!assessments || assessments.length === 0) {
    return {
      hasGrowth: false,
      baseline: null,
      latest: null,
      deltaScore: 0,
      deltaPercent: 0,
      stage: "Belum Asesmen",
      stageDescription: "Lakukan asesmen kesiapan digital untuk mengukur titik awal bisnis Anda.",
      pillars: [],
    };
  }

  // Sort ascending by createdAt to establish baseline vs latest
  const sorted = [...assessments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const baseline = sorted[0];
  const latest = sorted[sorted.length - 1];
  const hasGrowth = sorted.length >= 2;

  const deltaScore = latest.readinessScore - baseline.readinessScore;
  const deltaPercent = baseline.readinessScore > 0
    ? Number(((deltaScore / baseline.readinessScore) * 100).toFixed(1))
    : 0;

  const stageInfo = getAdoptionStage(latest.readinessScore);

  const pillarsConfig: Array<{
    key: PillarGrowth["key"];
    label: string;
    description: string;
    beforeVal: number;
    afterVal: number;
  }> = [
    {
      key: "finance",
      label: "Keuangan Digital",
      description: "Pencatatan kas, pembukuan digital, dan integrasi rekening",
      beforeVal: baseline.financeScore,
      afterVal: latest.financeScore,
    },
    {
      key: "marketing",
      label: "Pemasaran & Penjualan",
      description: "Katalog online, transaksi digital, dan visibilitas pasar",
      beforeVal: baseline.marketingScore,
      afterVal: latest.marketingScore,
    },
    {
      key: "team",
      label: "Kesiapan Tim",
      description: "Kapasitas SDM dan kesiapan mengadopsi teknologi baru",
      beforeVal: baseline.teamScore,
      afterVal: latest.teamScore,
    },
    {
      key: "operations",
      label: "SOP & Operasional",
      description: "Manajemen inventori, alur pesanan, dan efisiensi proses",
      beforeVal: baseline.operationsScore,
      afterVal: latest.operationsScore,
    },
    {
      key: "outsourcing",
      label: "Kolaborasi Talent",
      description: "Kemampuan mendelegasikan tugas teknis ke talenta digital",
      beforeVal: baseline.outsourcingScore,
      afterVal: latest.outsourcingScore,
    },
  ];

  const pillars: PillarGrowth[] = pillarsConfig.map((cfg) => {
    const delta = cfg.afterVal - cfg.beforeVal;
    return {
      key: cfg.key,
      label: cfg.label,
      description: cfg.description,
      before: cfg.beforeVal,
      after: cfg.afterVal,
      delta,
      isPositive: delta > 0,
    };
  });

  return {
    hasGrowth,
    baseline,
    latest,
    deltaScore,
    deltaPercent,
    stage: stageInfo.stage,
    stageDescription: stageInfo.description,
    pillars,
  };
}
