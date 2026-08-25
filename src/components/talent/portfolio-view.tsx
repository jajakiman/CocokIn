"use client";

import { useState } from "react";
import type { PortfolioEntry, PortfolioVisibility } from "@/src/modules/portfolio/types";
import { canPublishPortfolio } from "@/src/modules/portfolio/portfolio-guard";
import { StatusBadge } from "@/src/design-system/status-badge";
import { PageHeader } from "@/src/design-system/page-header";
import { EmptyState } from "@/src/design-system/empty-state";
import { CheckCircle, Globe, Lock, ArrowSquareOut, ShieldCheck } from "@phosphor-icons/react";

type PortfolioViewProps = {
  initialEntries: PortfolioEntry[];
};

export function PortfolioView({ initialEntries }: PortfolioViewProps) {
  const [entries, setEntries] = useState<PortfolioEntry[]>(initialEntries);

  const handleToggleConsent = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const newConsent = !e.talentPublicationConsentGranted;
        const willPublish = newConsent && e.businessAttributionApproved;
        return {
          ...e,
          talentPublicationConsentGranted: newConsent,
          visibility: willPublish ? "PUBLIC" : "PRIVATE",
        };
      }),
    );
  };

  const handleVisibilityChange = (id: string, visibility: PortfolioVisibility) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        if (!canPublishPortfolio(e) && visibility !== "PRIVATE") return e;
        return { ...e, visibility };
      }),
    );
  };

  return (
    <div className="portfolio-container">
      <PageHeader
        eyebrow="Rekam Jejak Nyata"
        title="Portofolio Terverifikasi UMKM"
        description="Karya digital dari proyek mikro yang telah tuntas dan disahkan langsung oleh pemilik usaha UMKM."
      />

      {entries.length === 0 ? (
        <EmptyState
          title="Belum ada portofolio terverifikasi"
          description="Selesaikan proyek pertamamu di workspace untuk otomatis menerbitkan draf portofolio berstempel resmi."
        />
      ) : (
        <div className="portfolio-grid">
          {entries.map((entry) => {
            const isPublishable = canPublishPortfolio(entry);

            return (
              <article key={entry.id} className="portfolio-card">
                <div className="portfolio-card__header">
                  <div>
                    <div className="portfolio-card__tags">
                      <StatusBadge tone="success">
                        <ShieldCheck size={14} weight="fill" />
                        Verified by {entry.businessName}
                      </StatusBadge>
                      <StatusBadge tone={entry.visibility === "PUBLIC" ? "info" : "neutral"}>
                        {entry.visibility === "PUBLIC" ? (
                          <>
                            <Globe size={14} weight="bold" /> Publik
                          </>
                        ) : (
                          <>
                            <Lock size={14} weight="bold" /> Privat (Draf)
                          </>
                        )}
                      </StatusBadge>
                    </div>
                    <h3>{entry.title}</h3>
                  </div>
                </div>

                <div className="portfolio-card__body">
                  <div className="portfolio-detail-block">
                    <strong>Tantangan Bisnis:</strong>
                    <p>{entry.problemSummary}</p>
                  </div>
                  <div className="portfolio-detail-block">
                    <strong>Solusi yang Dibangun:</strong>
                    <p>{entry.solutionSummary}</p>
                  </div>

                  <div className="portfolio-skills">
                    {entry.appliedSkillIds.map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="portfolio-card__links">
                    <a
                      href={entry.stagingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link"
                    >
                      Kunjungi Preview Staging URL <ArrowSquareOut size={16} weight="bold" />
                    </a>
                  </div>
                </div>

                {/* Consent & Visibility Controls */}
                <div className="portfolio-card__footer">
                  <div className="consent-toggle-row">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={entry.talentPublicationConsentGranted}
                        onChange={() => handleToggleConsent(entry.id)}
                      />
                      <span>Izin Publikasi Talent</span>
                    </label>
                    <span className="attribution-status">
                      Atribusi UMKM:{" "}
                      <strong>
                        {entry.businessAttributionApproved ? (
                          <span style={{ color: "var(--success)" }}>
                            <CheckCircle size={14} weight="fill" style={{ display: "inline" }} /> Disetujui
                          </span>
                        ) : (
                          "Menunggu"
                        )}
                      </strong>
                    </span>
                  </div>

                  {isPublishable ? (
                    <div className="visibility-selector">
                      <label htmlFor={`vis-${entry.id}`}>Visibilitas:</label>
                      <select
                        id={`vis-${entry.id}`}
                        className="form-select form-select--sm"
                        value={entry.visibility}
                        onChange={(e) =>
                          handleVisibilityChange(entry.id, e.target.value as PortfolioVisibility)
                        }
                      >
                        <option value="PUBLIC">Publik (Bisa Dilihat Siapa Saja)</option>
                        <option value="UNLISTED">Unlisted (Hanya Lewat Tautan)</option>
                        <option value="PRIVATE">Privat</option>
                      </select>
                    </div>
                  ) : (
                    <p className="publish-notice">
                      Publikasi membutuhkan persetujuan dari kedua belah pihak (Talent & UMKM).
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
