import Link from "next/link";

import { MetricTile } from "@/src/design-system/metric-tile";
import { StatusBadge } from "@/src/design-system/status-badge";

const swatches = [
  ["Brand cyan", "#0DB8D3"],
  ["Brand blue", "#1B7FDC"],
  ["Primary action", "#065B98"],
  ["Primary foreground", "#193546"],
  ["Page background", "#F5FAFC"],
  ["Subtle surface", "#EAF5F8"],
];

export default function DesignSystemPage() {
  return (
    <main className="catalog-page">
      <header className="catalog-header">
        <div>
          <p className="eyebrow">Internal preview</p>
          <h1>Arctic Depths Design System</h1>
          <p>Fondasi role-neutral untuk Talent, UMKM, dan Admin.</p>
        </div>
        <Link className="secondary-action" href="/">
          Kembali
        </Link>
      </header>

      <section className="catalog-section">
        <h2>Warna</h2>
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
        <h2>Status</h2>
        <div className="inline-preview">
          <StatusBadge tone="success">Terverifikasi</StatusBadge>
          <StatusBadge tone="warning">Perlu review</StatusBadge>
          <StatusBadge tone="destructive">Gagal direkonsiliasi</StatusBadge>
          <StatusBadge tone="info">Dalam proses</StatusBadge>
          <StatusBadge>Draft</StatusBadge>
        </div>
      </section>

      <section className="catalog-section">
        <h2>Metrics</h2>
        <div className="metrics-grid">
          <MetricTile label="Kesiapan karier" value="72/100" detail="Talent comfortable" />
          <MetricTile label="Review menunggu" value="1" detail="UMKM standard" />
          <MetricTile label="Coverage reserve" value="100%" detail="Admin dense" />
        </div>
      </section>

      <section className="catalog-section">
        <h2>Aksi</h2>
        <div className="inline-preview">
          <button className="primary-action" type="button">Aksi utama</button>
          <button className="secondary-action" type="button">Aksi sekunder</button>
          <button className="text-action" type="button">Aksi teks</button>
        </div>
      </section>
    </main>
  );
}
