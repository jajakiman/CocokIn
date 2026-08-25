import Link from "next/link";

import { StatusBadge } from "@/src/design-system/status-badge";
import { PageHeader } from "@/src/design-system/page-header";
import { StepProgress } from "@/src/design-system/step-progress";
import { ErrorSummary } from "@/src/design-system/error-summary";
import { EmptyState } from "@/src/design-system/empty-state";
import { MoneyBreakdown } from "@/src/design-system/money-breakdown";
import { AuditTimeline } from "@/src/design-system/audit-timeline";
import { CocokScoreCard } from "@/src/design-system/cocok-score-card";

const swatches = [
  ["Brand cyan", "#0DB8D3"],
  ["Brand blue", "#1B7FDC"],
  ["Primary action", "#065B98"],
  ["Primary foreground", "#193546"],
  ["Page background", "#F5FAFC"],
  ["Subtle surface", "#EAF5F8"],
];

const demoSteps = [
  { id: "s1", label: "Data Diri" },
  { id: "s2", label: "Asesmen" },
  { id: "s3", label: "Persetujuan" },
];

const demoAuditEvents = [
  {
    id: "ev-1",
    timestamp: "2026-08-26T00:30:00Z",
    actor: "Nadia Putri",
    actorRole: "Talent" as const,
    action: "Milestone #2 Diserahkan",
    description: "Tautan staging HTTPS telah diunggah untuk peninjauan UMKM.",
    platformReference: "CCK-M2-SUB-01",
    tone: "info" as const,
  },
];

export default function DesignSystemPage() {
  return (
    <main className="catalog-page">
      <PageHeader
        eyebrow="Internal Design Showcase"
        title="Arctic Depths Design System"
        description="Komponen shared UI & primitives standar untuk Talent, UMKM, dan Admin."
        action={
          <Link className="secondary-action" href="/">
            Kembali ke Beranda
          </Link>
        }
      />

      <section className="catalog-section">
        <h2>Palet Warna Token</h2>
        <div className="swatch-grid">
          {swatches.map(([name, value]) => (
            <article className="swatch" key={value}>
              <span aria-label={`${name} ${value}`} style={{ backgroundColor: value }} />
              <strong>{name}</strong>
              <code>{value}</code>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog-section">
        <h2>Status Badges</h2>
        <div className="inline-preview">
          <StatusBadge tone="success">Terverifikasi</StatusBadge>
          <StatusBadge tone="warning">Perlu review</StatusBadge>
          <StatusBadge tone="destructive">Gagal direkonsiliasi</StatusBadge>
          <StatusBadge tone="info">Dalam proses</StatusBadge>
          <StatusBadge tone="neutral">Draft</StatusBadge>
        </div>
      </section>

      <section className="catalog-section">
        <h2>Step Progress Stepper</h2>
        <StepProgress steps={demoSteps} currentStepIndex={1} />
      </section>

      <section className="catalog-section">
        <h2>Error Summary (A11y Alert Container)</h2>
        <ErrorSummary
          errors={[
            { fieldId: "demo-input", message: "Kolom nama lengkap belum diisi." },
            { message: "Syarat layanan wajib disetujui." },
          ]}
        />
      </section>

      <section className="catalog-section">
        <h2>Shared CocokScoreCard Component</h2>
        <CocokScoreCard
          result={{
            total: 88,
            factors: {
              skill: 90,
              career: 100,
              availability: 100,
              experience: 80,
              workMode: 100,
            },
            reasons: ["Skill React terverifikasi dari proyek sebelumnya."],
            gaps: [],
          }}
          talentName="Nadia Putri"
          candidateRole="Frontend Developer"
        />
      </section>

      <section className="catalog-section">
        <h2>Money Breakdown (Transparan)</h2>
        <div className="form-grid-2">
          <MoneyBreakdown serviceValue={1500000} role="talent" />
          <MoneyBreakdown serviceValue={1500000} role="business" />
        </div>
      </section>

      <section className="catalog-section">
        <h2>Audit Timeline</h2>
        <AuditTimeline events={demoAuditEvents} />
      </section>

      <section className="catalog-section">
        <h2>Empty State</h2>
        <EmptyState
          title="Belum ada riwayat aktivitas"
          description="Aktivitas dan log penugasan proyek akan otomatis tercatat di sini."
        />
      </section>
    </main>
  );
}
