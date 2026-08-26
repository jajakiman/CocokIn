"use client";

import Link from "next/link";
import { Check, ArrowRight, Storefront, CheckCircle } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { SEEDED_WORKSPACE } from "@/src/fixtures/seeded-demo";

export function BusinessFeatureSplit() {
  const milestone = SEEDED_WORKSPACE.milestones[1];

  return (
    <section className="feature-split-section feature-split-section--alt" id="untuk-umkm">
      <div className="feature-split-container feature-split-container--reverse">
        {/* Right (In LTR): Copy & Value Proposition */}
        <motion.div
          className="feature-split__content"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="workable-pill" style={{ background: "var(--success-subtle)", color: "var(--success)" }}>
            <Storefront size={14} weight="bold" />
            <span>Untuk Pemilik Bisnis & UMKM</span>
          </div>

          <h2>Solusi Digital untuk UMKM</h2>
          <p className="feature-split__lead">
            Selesaikan kebutuhan digital usaha dengan biaya yang jelas, proses yang mudah dipahami,
            dan hasil kerja yang dapat diperiksa langsung.
          </p>

          <ul className="feature-checklist">
            <li>
              <Check size={20} weight="bold" color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>Ubah Masalah Usaha Jadi Proyek Nyata</strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                  Susun kendala usaha menjadi rencana proyek digital 3–14 hari yang praktis.
                </p>
              </div>
            </li>
            <li>
              <Check size={20} weight="bold" color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>Pencocokan Cerdas & Terbuka</strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                  Temukan Talent yang paling sesuai tanpa proses seleksi manual yang memakan waktu.
                </p>
              </div>
            </li>
            <li>
              <Check size={20} weight="bold" color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>Periksa Hasil Sebelum Menyetujui</strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                  Lihat dan uji hasil kerja melalui tautan pratinjau sebelum pembayaran disetujui.
                </p>
              </div>
            </li>
            <li>
              <Check size={20} weight="bold" color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>Garansi Perbaikan 30 Hari</strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                  Perlindungan garansi memastikan kendala hasil kerja tetap ditangani setelah serah terima.
                </p>
              </div>
            </li>
          </ul>

          <Link href="/register/business" className="cta-btn-secondary" style={{ width: "fit-content", borderColor: "var(--success)", color: "var(--success)" }}>
            <span>Daftar sebagai UMKM</span>
            <ArrowRight size={16} weight="bold" />
          </Link>
        </motion.div>

        {/* Left (In LTR): Milestone & Workspace UI Card Showcase */}
        <motion.div
          className="feature-split__card"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--success)", textTransform: "uppercase" }}>Ruang Review UMKM</span>
              <h3 style={{ fontSize: "1.15rem", margin: "0.15rem 0 0" }}>Warung Bu Siti — Katalog WA</h3>
            </div>
            <span className="status-badge" data-tone="warning">Milestone 2/3</span>
          </div>

          <div style={{ background: "var(--surface-subtle)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <strong style={{ fontSize: "1rem" }}>{milestone.title}</strong>
              <span className="status-badge" data-tone="warning">
                <CheckCircle size={14} weight="fill" /> Ready for Review
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: "0 0 1rem" }}>
              {milestone.deliverableSummary}
            </p>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.375rem", padding: "0.6rem 0.85rem", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
              <span>Preview Link: <code>staging.warungbusiti.id</code></span>
              <span style={{ color: "var(--success)", fontWeight: 700 }}>✓ HTTPS Valid</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0.5rem 0" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Nilai Proyek & Proteksi</span>
              <strong style={{ display: "block", fontSize: "1.1rem" }}>Rp 1.500.000</strong>
            </div>
            <span className="status-badge" data-tone="success">100% Liability Reserve</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
