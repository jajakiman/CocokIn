import type { CocokScoreResult } from "@/src/modules/matching/types";
import { StatusBadge, type StatusTone } from "./status-badge";

type CocokScoreCardProps = {
  result: CocokScoreResult;
  talentName?: string;
  candidateRole?: string;
  showBreakdown?: boolean;
};

function getScoreTone(score: number): StatusTone {
  if (score >= 75) return "success";
  if (score >= 50) return "warning";
  return "destructive";
}

function getScoreLabel(score: number): string {
  if (score >= 75) return "Sangat Cocok";
  if (score >= 50) return "Cukup Cocok";
  return "Kurang Cocok";
}

export function CocokScoreCard({
  result,
  talentName,
  candidateRole,
  showBreakdown = true,
}: CocokScoreCardProps) {
  const tone = getScoreTone(result.total);
  const label = getScoreLabel(result.total);

  return (
    <div className="cocok-score-card" data-tone={tone}>
      <div className="cocok-score-card__header">
        <div>
          {talentName ? <h4 className="cocok-score-card__name">{talentName}</h4> : null}
          {candidateRole ? (
            <p className="cocok-score-card__role">{candidateRole}</p>
          ) : (
            <p className="cocok-score-card__label">Kecocokan Algoritmik Deterministik</p>
          )}
        </div>
        <div className="cocok-score-badge" data-tone={tone}>
          <span className="cocok-score-badge__value">{result.total}</span>
          <span className="cocok-score-badge__text">{label}</span>
        </div>
      </div>

      {showBreakdown && (
        <div className="cocok-score-card__factors">
          <div className="score-factor-item">
            <span>Skill (40%)</span>
            <strong>{result.factors.skill}</strong>
          </div>
          <div className="score-factor-item">
            <span>Karier (20%)</span>
            <strong>{result.factors.career}</strong>
          </div>
          <div className="score-factor-item">
            <span>Waktu (15%)</span>
            <strong>{result.factors.availability}</strong>
          </div>
          <div className="score-factor-item">
            <span>Pengalaman (15%)</span>
            <strong>{result.factors.experience}</strong>
          </div>
          <div className="score-factor-item">
            <span>Mode Kerja (10%)</span>
            <strong>{result.factors.workMode}</strong>
          </div>
        </div>
      )}

      {result.reasons.length > 0 && (
        <ul className="cocok-score-card__reasons">
          {result.reasons.slice(0, 2).map((reason, idx) => (
            <li key={idx}>
              <StatusBadge tone="success">+</StatusBadge>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
