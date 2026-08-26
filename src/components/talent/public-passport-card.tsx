"use client";

import { useState } from "react";
import Link from "next/link";
import type { TalentSkillPassport } from "@/src/modules/talent/types";
import { getCareerDomain } from "@/src/modules/talent/career-taxonomy";
import { StatusBadge } from "@/src/design-system/status-badge";
import { ShareNetwork, Check, ShieldCheck, Sparkle } from "@phosphor-icons/react";

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
  ASSESSED: "Assessed (Platform Test)",
  PROJECT_APPLIED: "Applied in Active Project",
  PROJECT_VERIFIED: "Verified by UMKM Owner",
};

export function PublicPassportCard({
  talentName,
  university,
  major,
  passport,
}: PublicPassportCardProps) {
  const [copied, setCopied] = useState(false);
  const career = getCareerDomain(passport.careerId);
  const verifiedCount = passport.entries.filter((e) => e.evidenceLevel === "PROJECT_VERIFIED").length;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="public-passport-wrapper">
      {/* Brand Watermark Header */}
      <header className="public-passport-header">
        <Link href="/" className="brand-mark brand-mark--public">
          <span className="brand-dot" aria-hidden="true" />
          <strong>CocokIn Skill Passport</strong>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            type="button"
            className="secondary-action"
            onClick={handleShare}
            style={{ minHeight: "2.25rem", padding: "0.35rem 0.85rem", fontSize: "0.85rem", gap: "0.35rem" }}
          >
            {copied ? (
              <>
                <Check size={16} weight="bold" color="var(--success)" /> Tautan Tersalin!
              </>
            ) : (
              <>
                <ShareNetwork size={16} weight="bold" /> Bagikan Paspor
              </>
            )}
          </button>
          <span className="official-badge">Dokumen Terverifikasi Resmi</span>
        </div>
      </header>

      {/* Main Passport Document (Digital Credential Certificate) */}
      <main className="public-passport-card">
        <div className="passport-identity">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
              <Sparkle size={16} weight="fill" color="var(--primary)" />
              <p className="passport-target-career">{career.label}</p>
            </div>
            <h1>{talentName}</h1>
            <p className="passport-academic">
              {major} • {university}
            </p>
          </div>
          <div className="passport-stamp">
            <span className="passport-stamp__number">{verifiedCount}</span>
            <span className="passport-stamp__label">Skill Terverifikasi UMKM</span>
          </div>
        </div>

        {/* Skill Evidence Breakdown */}
        <section className="passport-skills-section">
          <h2>Bukti Validitas Keahlian</h2>
          <p className="section-note">
            Tingkat keahlian diuji lewat asesmen platform dan diverifikasi langsung oleh pelaku usaha
            setelah proyek diserahterimakan.
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
                    <span>Skor Uji: <strong>{entry.assessedScore}/100</strong></span>
                  )}
                  {entry.verifiedProjectCount > 0 && (
                    <span style={{ color: "var(--success)" }}>
                      ✓ {entry.verifiedProjectCount} Proyek Nyata
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Verification Notice */}
        <footer className="public-passport-footer">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={20} weight="fill" color="var(--primary)" />
            <p style={{ margin: 0 }}>
              Paspor ini diterbitkan secara otomatis oleh platform CocokIn atas dasar bukti pengerjaan proyek mikro nyata.
            </p>
          </div>
          <div className="footer-links">
            <Link href="/" className="text-link">
              Verifikasi Standar CocokIn →
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
