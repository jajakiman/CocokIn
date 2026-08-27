"use client";

import Link from "next/link";
import { Check, ArrowRight, Storefront, CheckCircle } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { SEEDED_WORKSPACE } from "@/src/fixtures/seeded-demo";

export function BusinessFeatureSplit() {
  const milestone = SEEDED_WORKSPACE.milestones[1];

  return (
    <section className="heyretro-section" id="untuk-umkm">
      <div className="heyretro-container">
        <div className="heyretro-split-grid heyretro-split-grid--reverse">
          {/* Left (Visual side in reverse): Milestone & Workspace UI Card */}
          <motion.div
            className="split-card split-card--biz"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <div className="split-card__header">
              <div>
                <span className="split-card__tag split-card__tag--biz">Ruang Review UMKM</span>
                <h3>Warung Bu Siti — Katalog WA</h3>
              </div>
              <span className="status-badge" data-tone="warning">Milestone 2/3</span>
            </div>

            <div className="split-milestone-panel">
              <div className="milestone-title-row">
                <strong>{milestone.title}</strong>
                <span className="status-badge" data-tone="warning">
                  <CheckCircle size={14} weight="fill" /> Ready for Review
                </span>
              </div>
              <p className="milestone-desc">
                {milestone.deliverableSummary}
              </p>
              <div className="staging-link-box">
                <span>Preview Link:</span>
                <code>staging.warungbusiti.id</code>
                <span className="tag-valid">✓ HTTPS Valid</span>
              </div>
            </div>

            <div className="split-card__footer-meta">
              <div>
                <span className="meta-label">Nilai Proyek & Proteksi</span>
                <strong className="meta-val">Rp 1.500.000</strong>
              </div>
              <span className="status-badge" data-tone="success">Dana Proyek Terlindungi</span>
            </div>
          </motion.div>

          {/* Right (Content side in reverse): Copy & Value Proposition */}
          <motion.div
            className="split-content"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="section-pill section-pill--biz">
              <Storefront size={14} weight="bold" />
              <span>Untuk Pemilik Bisnis & UMKM</span>
            </div>

            <h2>Solusi Digital untuk UMKM</h2>
            <p className="split-lead">
              Selesaikan kebutuhan digital usaha dengan biaya yang jelas, proses yang mudah dipahami,
              dan hasil kerja yang dapat diperiksa langsung.
            </p>

            <ul className="heyretro-checklist">
              <li>
                <span className="check-bullet check-bullet--biz"><Check size={16} weight="bold" /></span>
                <div>
                  <strong>Ubah Masalah Usaha Jadi Proyek Nyata</strong>
                  <p>Susun kendala usaha menjadi rencana proyek digital 3–14 hari yang praktis.</p>
                </div>
              </li>
              <li>
                <span className="check-bullet check-bullet--biz"><Check size={16} weight="bold" /></span>
                <div>
                  <strong>Pencocokan Cerdas & Terbuka</strong>
                  <p>Temukan Talent yang paling sesuai tanpa proses seleksi manual yang memakan waktu.</p>
                </div>
              </li>
              <li>
                <span className="check-bullet check-bullet--biz"><Check size={16} weight="bold" /></span>
                <div>
                  <strong>Periksa Hasil Sebelum Menyetujui</strong>
                  <p>Lihat dan uji hasil kerja melalui tautan pratinjau sebelum pembayaran disetujui.</p>
                </div>
              </li>
              <li>
                <span className="check-bullet check-bullet--biz"><Check size={16} weight="bold" /></span>
                <div>
                  <strong>Garansi Perbaikan 30 Hari</strong>
                  <p>Perlindungan garansi memastikan kendala hasil kerja tetap ditangani setelah serah terima.</p>
                </div>
              </li>
            </ul>

            <Link href="/register/business" className="hero-cta-btn hero-cta-btn--business" style={{ width: "fit-content" }}>
              <span>Daftar sebagai UMKM</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
