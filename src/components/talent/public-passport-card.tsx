import Link from "next/link";
import type { TalentSkillPassport } from "@/src/modules/talent/types";
import { getCareerDomain } from "@/src/modules/talent/career-taxonomy";
import { StatusBadge } from "@/src/design-system/status-badge";

type PublicPassportCardProps = {
  talentName: string;
  university: string;
  major: string;
  passport: TalentSkillPassport;
};

const EVIDENCE_TONE: Record<string, "neutral" | "info" | "warning" | "success"> = {
  SELF_DECLARED: "neutral",
  ASSESSED: "info",
  PROJECT_APPLIED: "warning",
  PROJECT_VERIFIED: "success",
};

const EVIDENCE_LABEL: Record<string, string> = {
  SELF_DECLARED: "Self-Declared",
  ASSESSED: "Assessed",
  PROJECT_APPLIED: "Applied in Project",
  PROJECT_VERIFIED: "Verified by UMKM",
};

export function PublicPassportCard({
  talentName,
  university,
  major,
  passport,
}: PublicPassportCardProps) {
  const career = getCareerDomain(passport.careerId);
  const verifiedCount = passport.entries.filter((e) => e.evidenceLevel === "PROJECT_VERIFIED").length;

  return (
    <div className="public-passport-wrapper">
      {/* Brand Watermark Header */}
      <header className="public-passport-header">
        <Link href="/" className="brand-mark brand-mark--public">
          <span aria-hidden="true">C</span>
          <strong>CocokIn Skill Passport</strong>
        </Link>
        <span className="official-badge">Dokumen Terverifikasi Resmi</span>
      </header>

      {/* Main Passport Document */}
      <main className="public-passport-card">
        <div className="passport-identity">
          <div>
            <p className="passport-target-career">{career.label}</p>
            <h1>{talentName}</h1>
            <p className="passport-academic">
              {major} • {university}
            </p>
          </div>
          <div className="passport-stamp">
            <span className="passport-stamp__number">{verifiedCount}</span>
            <span className="passport-stamp__label">Skill Terverifikasi Proyek</span>
          </div>
        </div>

        {/* Skill Evidence Breakdown */}
        <section className="passport-skills-section">
          <h2>Bukti Validitas Keahlian</h2>
          <p className="section-note">
            Keahlian diuji melalui asesmen standar industri dan tervalidasi langsung oleh UMKM pemilik
            proyek.
          </p>

          <div className="public-skills-grid">
            {passport.entries.map((entry) => (
              <div key={entry.skillId} className="public-skill-card">
                <div className="public-skill-card__header">
                  <h3>{entry.name}</h3>
                  <StatusBadge tone={EVIDENCE_TONE[entry.evidenceLevel]}>
                    {EVIDENCE_LABEL[entry.evidenceLevel]}
                  </StatusBadge>
                </div>
                <div className="public-skill-card__meta">
                  {entry.assessedScore !== undefined && (
                    <span>Skor Uji: {entry.assessedScore}/100</span>
                  )}
                  {entry.verifiedProjectCount > 0 && (
                    <span>{entry.verifiedProjectCount} Proyek Nyata</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Verification Notice */}
        <footer className="public-passport-footer">
          <p>
            Paspor ini diterbitkan secara otomatis oleh platform CocokIn atas dasar bukti pengerjaan
            mikro-proyek dan penilaian kompetensi independen.
          </p>
          <div className="footer-links">
            <Link href="/" className="text-link">
              Pelajari Standar Validitas CocokIn →
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
