import Link from "next/link";

import { AppShell } from "./app-shell";
import { MetricTile } from "./metric-tile";
import { getRoleConfig, type AppRole } from "./role-config";
import { StatusBadge, type StatusTone } from "./status-badge";

type DashboardFixture = {
  eyebrow: string;
  title: string;
  description: string;
  sectionTitle: string;
  metrics: Array<{ label: string; value: string; detail: string }>;
  tasks: Array<{ title: string; meta: string; status: string; tone: StatusTone }>;
};

const fixtures: Record<AppRole, DashboardFixture> = {
  talent: {
    eyebrow: "Ruang berkembang",
    title: "Selamat datang, Nadia",
    description: "Lanjutkan proyek aktif dan tutup skill gap menuju Frontend Developer.",
    sectionTitle: "Rekomendasi untukmu",
    metrics: [
      { label: "Proyek aktif", value: "1", detail: "Milestone 2 dari 3" },
      { label: "Kesiapan karier", value: "72/100", detail: "+6 dari asesmen terakhir" },
      { label: "Skill terverifikasi", value: "4", detail: "2 skill baru dari proyek" },
    ],
    tasks: [
      { title: "Website katalog Warung Bu Siti", meta: "Cocok Score 87 · 8 hari", status: "Sangat cocok", tone: "success" },
      { title: "Landing page Kopi Lereng", meta: "Cocok Score 78 · 5 hari", status: "Direkomendasikan", tone: "info" },
    ],
  },
  business: {
    eyebrow: "Kontrol proyek",
    title: "Warung Bu Siti",
    description: "Tinjau pekerjaan yang menunggu keputusan dan pantau progres digital usaha.",
    sectionTitle: "Proyek berjalan",
    metrics: [
      { label: "Menunggu review", value: "1", detail: "Batas review 18 jam" },
      { label: "Proyek aktif", value: "2", detail: "Satu menuju handover" },
      { label: "Kesiapan digital", value: "58/100", detail: "+11 setelah proyek pertama" },
    ],
    tasks: [
      { title: "Katalog dan pemesanan WhatsApp", meta: "Milestone implementasi dikirim", status: "Perlu review", tone: "warning" },
      { title: "Pencatatan stok sederhana", meta: "Pengerjaan hari ke-3", status: "Berjalan", tone: "info" },
    ],
  },
  admin: {
    eyebrow: "Operasi platform",
    title: "Ringkasan hari ini",
    description: "Dahulukan antrean berisiko, rekonsiliasi, dan kasus yang melewati SLA.",
    sectionTitle: "Antrean verifikasi",
    metrics: [
      { label: "SLA terlewati", value: "1", detail: "Tiket warranty kritis" },
      { label: "Sengketa terbuka", value: "3", detail: "Satu menunggu bukti" },
      { label: "Coverage reserve", value: "100%", detail: "Mode simulasi aktif" },
    ],
    tasks: [
      { title: "Verifikasi UMKM Dapur Rasa", meta: "Dokumen diperbarui 12 menit lalu", status: "Perlu tindakan", tone: "warning" },
      { title: "Funding CCK-1042-FUND-01", meta: "Nominal dan bukti belum cocok", status: "Unmatched", tone: "destructive" },
    ],
  },
};

type DashboardPreviewProps = { role: AppRole };

export function DashboardPreview({ role }: DashboardPreviewProps) {
  const config = getRoleConfig(role);
  const fixture = fixtures[role];

  return (
    <AppShell role={role}>
      <section className="page-heading">
        <div>
          <p className="eyebrow">{fixture.eyebrow}</p>
          <h1>{fixture.title}</h1>
          <p>{fixture.description}</p>
        </div>
        <Link className="primary-action" href={config.primaryAction.href}>
          {config.primaryAction.label}
        </Link>
      </section>

      <section aria-label="Ringkasan" className="metrics-grid">
        {fixture.metrics.map((metric) => (
          <MetricTile {...metric} key={metric.label} />
        ))}
      </section>

      <section className="content-section">
        <div className="section-heading">
          <h2>{fixture.sectionTitle}</h2>
          <button className="text-action" type="button">
            Lihat semua
          </button>
        </div>
        <div className="task-list">
          {fixture.tasks.map((task) => (
            <article className="task-row" key={task.title}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.meta}</p>
              </div>
              <StatusBadge tone={task.tone}>{task.status}</StatusBadge>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
