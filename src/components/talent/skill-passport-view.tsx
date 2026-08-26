import type { TalentSkillPassport } from "@/src/modules/talent/types";
import { getCareerDomain } from "@/src/modules/talent/career-taxonomy";
import { StatusBadge } from "@/src/design-system/status-badge";

type SkillPassportViewProps = {
  passport: TalentSkillPassport;
};

const EVIDENCE_LABEL: Record<string, string> = {
  SELF_DECLARED: "Self-Declared",
  ASSESSED: "Assessed",
  PROJECT_APPLIED: "Project Applied",
  PROJECT_VERIFIED: "Verified",
};

const EVIDENCE_TONE: Record<string, "neutral" | "info" | "warning" | "success"> = {
  SELF_DECLARED: "neutral",
  ASSESSED: "info",
  PROJECT_APPLIED: "warning",
  PROJECT_VERIFIED: "success",
};

export function SkillPassportView({ passport }: SkillPassportViewProps) {
  const career = getCareerDomain(passport.careerId);

  return (
    <div className="skill-passport">
      <div className="passport-header">
        <h1>Skill Passport</h1>
        <p className="passport-header__career">{career.label}</p>
      </div>

      <div className="passport-description">
        <p>
          Skill passport menampilkan tingkat validitas bukti keahlianmu. Tingkatkan level dengan
          mengikuti asesmen dan menyelesaikan proyek.
        </p>
      </div>

      <div className="passport-entries">
        {passport.entries.map((entry) => (
          <div key={entry.skillId} className="passport-entry">
            <div className="passport-entry__header">
              <h3>{entry.name}</h3>
              <StatusBadge tone={EVIDENCE_TONE[entry.evidenceLevel]}>
                {EVIDENCE_LABEL[entry.evidenceLevel]}
              </StatusBadge>
            </div>
            <div className="passport-entry__details">
              {entry.assessedScore !== undefined && (
                <span className="passport-entry__score">Skor: {entry.assessedScore}/100</span>
              )}
              {entry.verifiedProjectCount > 0 && (
                <span className="passport-entry__projects">
                  {entry.verifiedProjectCount} proyek terverifikasi
                </span>
              )}
              <span className="passport-entry__date">
                Diperbarui: {new Date(entry.lastUpdated).toLocaleDateString("id-ID")}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="passport-legend">
        <h3>Tingkat Evidence</h3>
        <dl className="evidence-levels">
          <div>
            <dt>
              <StatusBadge tone="neutral">Self-Declared</StatusBadge>
            </dt>
            <dd>Klaim awal dari talent</dd>
          </div>
          <div>
            <dt>
              <StatusBadge tone="info">Assessed</StatusBadge>
            </dt>
            <dd>Teruji lewat kuis asesmen platform</dd>
          </div>
          <div>
            <dt>
              <StatusBadge tone="warning">Project Applied</StatusBadge>
            </dt>
            <dd>Sedang diterapkan pada proyek aktif</dd>
          </div>
          <div>
            <dt>
              <StatusBadge tone="success">Verified</StatusBadge>
            </dt>
            <dd>Tervalidasi oleh UMKM pemilik proyek</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
