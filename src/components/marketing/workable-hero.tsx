"use client";

import Link from "next/link";
import { User, Storefront, ArrowRight, Sparkle, ShieldCheck, CheckCircle, Clock, Code, Trophy } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export function WorkableHero() {
  return (
    <section className="heyretro-hero" id="hero">
      <div className="heyretro-hero__container">
        {/* Centered Top Value Proposition (HeyRetro Style) */}
        <motion.div
          className="heyretro-hero__header"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="hero-pill">
            <Sparkle size={14} weight="fill" />
            <span>Platform Kolaborasi Proyek Digital</span>
          </div>

          <h1>
            Potensi Bertemu Kebutuhan, <br className="hidden md:inline" />
            Proyek Nyata Mulai Berjalan.
          </h1>

          <p className="heyretro-hero__lead">
            CocokIn mempertemukan talenta muda dan UMKM melalui pengerjaan proyek 3–14 hari
            dengan pencocokan terbuka, hasil yang dapat ditinjau, dan perlindungan yang jelas.
          </p>

          <div className="heyretro-hero__ctas">
            <Link href="/register/talent" className="hero-cta-btn hero-cta-btn--talent">
              <User size={18} weight="bold" />
              <span>Mulai sebagai Talent</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link href="/register/business" className="hero-cta-btn hero-cta-btn--business">
              <Storefront size={18} weight="bold" />
              <span>Mulai sebagai UMKM</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          <div className="hero-trust-proofs">
            <span>
              <CheckCircle size={16} weight="fill" /> Pencocokan Objektif & Adil
            </span>
            <span>
              <Clock size={16} weight="fill" /> Durasi Nyata 3–14 Hari
            </span>
            <span>
              <ShieldCheck size={16} weight="fill" /> Dana Aman & Garansi 30 Hari
            </span>
          </div>
        </motion.div>

        {/* Large Central Product In-Use Showcase (HeyRetro Board Preview) */}
        <motion.div
          className="heyretro-board-wrapper"
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          {/* Main Board Container */}
          <div className="heyretro-board">
            {/* Board Topbar */}
            <div className="heyretro-board__topbar">
              <div className="topbar-left">
                <span className="dot dot--red" />
                <span className="dot dot--yellow" />
                <span className="dot dot--green" />
                <span className="topbar-title">Project Workspace • Warung Bu Siti × Nadia Putri</span>
              </div>
              <div className="topbar-right">
                <span className="live-status-pill">
                  <span className="live-indicator" /> Staging Live Review
                </span>
              </div>
            </div>

            {/* Board Inner Grid */}
            <div className="heyretro-board__grid">
              {/* Column 1: Kebutuhan Proyek */}
              <div className="board-col">
                <div className="board-col__header">
                  <span className="col-tag col-tag--biz">Klien UMKM</span>
                  <h4>Warung Bu Siti</h4>
                </div>
                <div className="board-card">
                  <p className="board-card__title">Website Katalog & Pemesanan WA</p>
                  <p className="board-card__desc">Menu digital responsif agar pesanan masuk langsung via chat.</p>
                  <div className="board-card__footer">
                    <span className="badge-meta">Durasi: 8 Hari</span>
                    <span className="badge-meta badge-meta--paid">Rp 1.500.000</span>
                  </div>
                </div>
              </div>

              {/* Column 2: Talent & Cocok Score */}
              <div className="board-col">
                <div className="board-col__header">
                  <span className="col-tag col-tag--talent">Talent Terpilih</span>
                  <h4>Nadia Putri</h4>
                </div>
                <div className="board-card board-card--highlight">
                  <div className="board-score-row">
                    <span>Cocok Score Engine</span>
                    <strong>87/100</strong>
                  </div>
                  <div className="skill-chips-row">
                    <span>React Verified</span>
                    <span>Next.js</span>
                    <span>Tailwind</span>
                  </div>
                  <p className="board-card__note">✓ Major skill gap terpenuhi</p>
                </div>
              </div>

              {/* Column 3: Progres Milestone */}
              <div className="board-col">
                <div className="board-col__header">
                  <span className="col-tag col-tag--milestone">Milestone 2/3</span>
                  <h4>Tinjauan Deliverable</h4>
                </div>
                <div className="board-card">
                  <p className="board-card__title">Integrasi WhatsApp & Katalog</p>
                  <div className="staging-link-box">
                    <span>Preview Link:</span>
                    <code>staging.warungbusiti.id</code>
                  </div>
                  <span className="status-badge" data-tone="success" style={{ marginTop: "0.5rem" }}>
                    ✓ HTTPS Valid & Siap Uji
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Subtle Proof Chips (Desktop only) */}
          <div className="floating-chip floating-chip--left">
            <Trophy size={18} weight="fill" />
            <div>
              <strong>Portofolio Resmi</strong>
              <span>Disahkan oleh Pemilik Usaha</span>
            </div>
          </div>

          <div className="floating-chip floating-chip--right">
            <Code size={18} weight="fill" />
            <div>
              <strong>Kompensasi Utuh 100%</strong>
              <span>Tanpa potongan komisi Talent</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
