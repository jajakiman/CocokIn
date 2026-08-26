import type { CocokScoreResult } from "@/src/modules/matching/types";
import { StatusBadge, type StatusTone } from "@/src/design-system/status-badge";

type MatchBreakdownProps = {
  result: CocokScoreResult;
};

const FACTOR_LABELS: Record<string, string> = {
  skill: "Kesesuaian Skill",
  career: "Keselarasan Karier",
  availability: "Ketersediaan Waktu",
  experience: "Pengalaman",
  workMode: "Mode Kerja",
};

const FACTOR_WEIGHTS: Record<string, number> = {
  skill: 40,
  career: 20,
  availability: 15,
  experience: 15,
  workMode: 10,
};

function scoreTone(score: number): StatusTone {
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "destructive";
}

export function MatchBreakdown({ result }: MatchBreakdownProps) {
  const factorEntries = Object.entries(result.factors) as [string, number][];

  return (
    <div className="match-breakdown">
      <div className="breakdown-factors">
        {factorEntries.map(([key, value]) => (
          <div key={key} className="breakdown-factor">
            <div className="breakdown-factor__header">
              <span className="breakdown-factor__name">
                {FACTOR_LABELS[key] ?? key}
              </span>
              <span className="breakdown-factor__weight">
                Bobot {FACTOR_WEIGHTS[key] ?? 0}%
              </span>
            </div>
            <div className="breakdown-factor__bar-bg">
              <div
                className="breakdown-factor__bar"
                data-tone={scoreTone(value)}
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="breakdown-factor__score">{value}/100</span>
          </div>
        ))}
      </div>

      {result.reasons.length > 0 && (
        <div className="breakdown-section">
          <h4>Alasan Kecocokan</h4>
          <ul className="breakdown-list">
            {result.reasons.map((r, i) => (
              <li key={i}>
                <StatusBadge tone="success">+</StatusBadge>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.gaps.length > 0 && (
        <div className="breakdown-section">
          <h4>Area yang Perlu Diperhatikan</h4>
          <ul className="breakdown-list">
            {result.gaps.map((g, i) => (
              <li key={i}>
                <StatusBadge tone="destructive">!</StatusBadge>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
