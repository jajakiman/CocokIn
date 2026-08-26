"use client";

import { useState } from "react";
import { PageHeader } from "@/src/design-system/page-header";
import { StatusBadge, type StatusTone } from "@/src/design-system/status-badge";
import { MetricTile } from "@/src/design-system/metric-tile";
import {
  createSeededWorkspace,
  type SeedWorkspace,
} from "@/src/fixtures/seeded-demo";

const STATUS_TONE: Record<string, StatusTone> = {
  APPROVED: "success",
  READY_FOR_REVIEW: "warning",
  IN_PROGRESS: "info",
  PENDING: "neutral",
};

const STATUS_LABEL: Record<string, string> = {
  APPROVED: "Disetujui",
  READY_FOR_REVIEW: "Menunggu Review",
  IN_PROGRESS: "Sedang Dikerjakan",
  PENDING: "Belum Dimulai",
};

export function WorkspaceView() {
  const [project, setProject] = useState<SeedWorkspace>(() =>
    createSeededWorkspace(),
  );
  const [stagingUrl, setStagingUrl] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmitMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stagingUrl.trim()) return;

    // Update milestone 2 to READY_FOR_REVIEW
    setProject((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.order === 2
          ? {
              ...m,
              status: "READY_FOR_REVIEW",
              submittedUrl: stagingUrl,
              deliverableSummary: submissionNotes || m.deliverableSummary,
            }
          : m,
      ),
    }));

    setToastMessage("✓ Deliverable milestone berhasil dikirim ke UMKM untuk ditinjau!");
    setTimeout(() => setToastMessage(null), 4000);
    setStagingUrl("");
    setSubmissionNotes("");
  };

  const completedWeight = project.milestones
    .filter((m) => m.status === "APPROVED")
    .reduce((acc, m) => acc + m.weight, 0);

  return (
    <div className="workspace-container">
      <PageHeader
        eyebrow="Ruang Kerja Aktif"
        title={project.title}
        description={`Klien: ${project.businessName} • Sisa Waktu: ${project.remainingDays} hari dari ${project.durationDays} hari target pengerjaan.`}
      />

      {toastMessage && (
        <div role="status" className="status-toast status-toast--success">
          {toastMessage}
        </div>
      )}

      {/* Metrics */}
      <section className="metrics-grid">
        <MetricTile
          label="Kemajuan Proyek"
          value={`${completedWeight}%`}
          detail={`${project.milestones.filter((m) => m.status === "APPROVED").length} dari ${project.milestones.length} milestone selesai`}
        />
        <MetricTile
          label="Nilai Kompensasi"
          value={`Rp ${(project.serviceValue).toLocaleString("id-ID")}`}
          detail="90% payout langsung + 10% retensi garansi 30 hari"
        />
        <MetricTile
          label="Status Review"
          value="Menunggu UMKM"
          detail="Batas SLA review UMKM: 2x24 jam kerja"
        />
      </section>

      {/* Milestone Timeline */}
      <section className="content-section workspace-section">
        <div className="section-heading">
          <h2>Tahapan Milestone Pengerjaan</h2>
        </div>
        <div className="milestone-timeline">
          {project.milestones.map((m) => (
            <article key={m.id} className="milestone-card" data-status={m.status}>
              <div className="milestone-card__header">
                <div>
                  <span className="milestone-order">Milestone #{m.order} ({m.weight}%)</span>
                  <h3>{m.title}</h3>
                </div>
                <StatusBadge tone={STATUS_TONE[m.status]}>
                  {STATUS_LABEL[m.status]}
                </StatusBadge>
              </div>

              <p className="milestone-desc">{m.deliverableSummary}</p>

              {m.submittedUrl && (
                <div className="milestone-link">
                  <span>Tautan Hasil:</span>{" "}
                  <a href={m.submittedUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                    {m.submittedUrl} ↗
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Submission Box */}
      <section className="content-section workspace-section">
        <div className="section-heading">
          <h2>Kirim Deliverable Milestone #2</h2>
        </div>
        <form onSubmit={handleSubmitMilestone} className="form-body">
          <p className="submission-notice">
            Pastikan tautan preview staging dapat diakses via HTTPS dan telah bebas dari kredensial
            rahasia.
          </p>

          <div className="form-group">
            <label htmlFor="staging-url">Tautan Staging / Preview URL (HTTPS Wajib)</label>
            <input
              id="staging-url"
              type="url"
              className="form-input"
              value={stagingUrl}
              onChange={(e) => setStagingUrl(e.target.value)}
              placeholder="https://preview.domainanda.id"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Catatan Serah Terima untuk UMKM</label>
            <textarea
              id="notes"
              rows={3}
              className="form-textarea"
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="Jelaskan fitur yang sudah selesai dan instruksi pengetesan..."
            />
          </div>

          <button type="submit" className="primary-action">
            Kirim Hasil Pekerjaan untuk Direview
          </button>
        </form>
      </section>
    </div>
  );
}
