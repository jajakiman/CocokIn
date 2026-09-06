# Product Requirement Document (PRD)
# CocokIn — Smart Talent–MSME Matching Ecosystem

> **Tagline:** Ubah Potensi Jadi Bukti, Selesaikan Solusi Pasti.  
> **Positioning:** Marketplace-Enabled Vertical SaaS for MSME Digitalization and Talent Empowerment  
> **Status:** Ready for Development  
> **Version:** 1.2 (Transaction, Delivery, and Post-Handover Operations)  
> **Target Release:** ITECHNO CUP 2026  
> **SDG Alignment:** SDG 8 (Decent Work & Economic Growth) & SDG 9 (Industry, Innovation, and Infrastructure)

### Version History

| Version | Summary |
|---|---|
| 1.1 | Comprehensive SaaS architecture, matching, assessment, and project lifecycle. |
| 1.2 | Milestone delivery, staging review, treasury funding, infrastructure handover, warranty, maintenance, chat, and platform fees. |

> System documentation: [`docs/README.md`](docs/README.md), [`docs/BUSINESS_FLOW.md`](docs/BUSINESS_FLOW.md), [`docs/BUSINESS_RULES.md`](docs/BUSINESS_RULES.md), [`docs/TECHNICAL_ARCHITECTURE.md`](docs/TECHNICAL_ARCHITECTURE.md), and [`docs/DATA_STATE_MODEL.md`](docs/DATA_STATE_MODEL.md).

---

## 1. Executive Summary & System Classification

### 1.1 Ringkasan Eksekutif
**CocokIn** adalah platform digital dua sisi (*two-sided platform*) berbasis **Marketplace-Enabled Vertical SaaS** yang menghubungkan talenta muda (mahasiswa, fresh graduates, atau self-taught talents) yang membutuhkan pengalaman kerja nyata dan portofolio terverifikasi, dengan Usaha Mikro, Kecil, dan Menengah (UMKM) yang membutuhkan transformasi digital aplikatif melalui pengerjaan proyek berskala mikro (*micro-projects*).

CocokIn mengeliminasi friksi mendasar:
1. **Sisi Talent:** Memiliki skill teknis dasar/menengah namun tidak memiliki jam terbang proyek nyata, bukti portofolio yang tervalidasi, serta tidak memahami *skill gap* terhadap target karier.
2. **Sisi UMKM:** Membutuhkan adopsi solusi digital praktis namun terkendala anggaran terbatas, minimnya pemahaman terminologi teknologi, dan kesulitan menemukan talenta yang dapat dipercaya.

### 1.2 Model Bisnis & Penerapan SaaS (Software as a Service)
CocokIn beroperasi sebagai *cloud-native web application* dengan modul SaaS ganda:
* **B2B SME Enablement SaaS:** Modul diagnosis kapabilitas digital bisnis (*Digital Readiness Benchmark*), formulasi kebutuhan otomatis (*Problem-to-Project Diagnosis*), serta manajemen pengerjaan proyek mikro (*Project & Delivery Management*).
* **B2Talent Career Development SaaS:** Modul asesmen mandiri kesiapan kerja (*Career Readiness & Skill Analytics*), kalkulator celah kompetensi (*Skill Gap Analyzer*), serta *hosting* otomatis paspor keahlian (*Skill Passport*) dan portofolio terverifikasi.
* **Matching Marketplace Layer:** Lapisan penghubung cerdas (*Smart Matching Engine*) yang mempertemukan kebutuhan digitalisasi UMKM dengan talenta pelaksana secara deterministik dan terukur.

### 1.3 Core Philosophy & Growth Loops

```text
TALENT GROWTH LOOP
Skill ➔ Assessment ➔ Skill Gap ➔ Micro-Project ➔ Submission ➔ Verification ➔ Verified Passport & Portfolio

UMKM GROWTH LOOP
Business Problem ➔ Digital Need Diagnosis ➔ Project Creation ➔ Smart Matching ➔ Review ➔ Digital Growth Indicator
```

---

## 2. User Persona & Actor Matrix

| Aktor / Persona | Karakteristik & Kebutuhan Utama | Hak Akses & Fungsionalitas Kunci |
|---|---|---|
| **Talent**<br>*(Mahasiswa / Fresh Graduate)* | • Butuh portofolio kerja nyata yang terbukti valid.<br>• Butuh evaluasi kesiapan kerja (*Careekarenr Readiness*) & *skill gap* terukur.<br>• Butuh proyek dengan durasi realistis berbasis milestone sesuai jam luang. | • Kelola Profil, Target Karier & *Skill Passport*.<br>• Mengikuti *Career Readiness Assessment*.<br>• Melihat *Cocok Score* & melamar *Micro-Project*.<br>• Akses *Project Workspace*, submit deliverable, & klaim bukti portofolio. |
| **UMKM (Business)**<br>*(Pelaku Usaha Mikro/Kecil)* | • Butuh solusi digital terjangkau tanpa bahasa teknis rumit.<br>• Butuh kepastian kualitas eksekutor proyek.<br>• Butuh monitoring kemajuan digitalisasi bisnis secara berkala. | • Kelola Profil Usaha & Pengajuan Verifikasi Bisnis.<br>• Mengikuti *Digital Readiness Assessment* (5 pilar).<br>• Mengubah masalah bisnis menjadi draf proyek digital otomatis.<br>• Seleksi pelamar berdasar *Cocok Score*, verifikasi tugas, pantau *Growth*. |
| **Admin**<br>*(Platform Overseer)* | • Menjaga keamanan, kepatuhan ekosistem, dan kualitas moderasi.<br>• Memantau agregasi dampak sosial (*impact metrics*). | • Verifikasi legalitas UMKM & moderasi lowongan proyek.<br>• Kelola master data taksonomi skill, karier, dan bank soal asesmen.<br>• Monitoring dashboard pencapaian indikator SDG 8 & SDG 9. |

---

## 3. Functional Requirements (FR)

### 3.1 Modul Talent (Career SaaS Subsystem)

* **FR-TAL-01 — Talent Profile & Skill Passport (Priority: P0)**
  * Sistem menyediakan pengelolaan data profil talent: identitas, universitas/jurusan, bio, preferensi sistem kerja (*Remote, Hybrid, Onsite*), ketersediaan waktu (*Full-time, Part-time, Weekend*), dan tautan karya eksternal.
  * Sistem mengelola *Skill Passport* dengan 4 tingkatan validitas bukti (*Evidence Levels*):
    1. *Self-Declared* (Klaim awal talent).
    2. *Assessed* (Teruji lewat kuis asesmen platform).
    3. *Project Applied* (Sedang diterapkan pada proyek aktif).
    4. *Project Verified* (Tervalidasi secara sah oleh UMKM pemilik proyek).

* **FR-TAL-02 — Career Readiness Assessment (Priority: P0)**
  * Modul asesmen adaptif sesuai target profesi pilihan talent (*Fullstack Developer, UI/UX Designer, Data Analyst, Digital Marketer*).
  * Menilai dua komponen utama:
    * *Technical Skills* (logika, sintaks, best-practices).
    * *Soft Skills* (problem solving, komunikasi profesional, digital literacy).
  * Menghasilkan skor komposit *Career Readiness Score* (0–100).

* **FR-TAL-03 — Skill Gap Analyzer (Priority: P0)**
  * Sistem menghitung deviasi keahlian talent terhadap standar kebutuhan karier:
    $$	ext{Skill\_Gap}(s) = 	ext{Talent\_Score}(s) - 	ext{Benchmark\_Score}(s)$$
  * Menampilkan visualisasi *Major Skill Gap* (keahlian dengan nilai deviasi negatif terbesar) sebagai rujukan rekomendasi proyek mikro.

* **FR-TAL-04 — Automated Verified Portfolio (Priority: P1)**
  * Sistem secara otomatis menerbitkan item portofolio publik bagi proyek berstatus `COMPLETED` yang memuat: judul proyek, nama bisnis UMKM, ringkasan masalah, solusi yang dibangun, keahlian yang diterapkan, dan status *Verified by UMKM*.

---

### 3.2 Modul UMKM (Digital Enablement SaaS Subsystem)

* **FR-BIZ-01 — Business Profile & Verification (Priority: P0)**
  * Pengelolaan data bisnis: nama usaha, kategori industri, domisili/lokasi, deskripsi produk/jasa, skala usaha, dan kontak perwakilan.
  * Status verifikasi berjenjang: `UNVERIFIED`, `BASIC_VERIFIED`, dan `VERIFIED_BUSINESS`.

* **FR-BIZ-02 — Digital Readiness Assessment (Priority: P0)**
  * Kuesioner evaluasi tingkat adopsi teknologi yang mencakup 5 pilar bisnis:
    1. *Digital Presence* (visibilitas online, website, media sosial).
    2. *Digital Sales* (pencatatan transaksi, katalog online, checkout).
    3. *Digital Operations* (manajemen stok, pembukuan digital).
    4. *Customer Management* (database pelanggan, komunikasi retensi).
    5. *Digital Marketing* (iklan digital, analitik trafik sederhana).
  * Menghasilkan nilai baseline *CocokIn Digital Readiness Score* (0–100).

* **FR-BIZ-03 — Problem-to-Project Diagnosis (Priority: P0)**
  * Mesin diagnosis yang menerjemahkan keluhan bisnis non-teknis (misal: *"Katalog produk sulit dilihat pelanggan dan stok sering salah catat"*) menjadi spesifikasi proyek mikro digital terstandarisasi (*"Website Katalog Produk Digital & Modul Inventori"*).

* **FR-BIZ-04 — Micro-Project Management (Priority: P0)**
  * Formulir penerbitan proyek terstruktur: cakupan kerja (*scope*), keahlian wajib, tingkat kesulitan (*Beginner, Intermediate, Advanced*), estimasi durasi dan target milestone, batas akhir (*deadline*), anggaran imbalan, dan daftar luaran (*expected deliverables*).

* **FR-BIZ-05 — Digital Growth Indicator (Priority: P1)**
  * Sistem menghitung rekalkulasi pertumbuhan kesiapan digital UMKM pasca-proyek selesai:
    $$\Delta 	ext{ Readiness} = 	ext{Readiness}_{	ext{After}} - 	ext{Readiness}_{	ext{Before}}$$

---

### 3.3 Modul Smart Matching & Lifecycle Proyek

* **FR-MTC-01 — Cocok Score Engine (Priority: P0)**
  * Algoritma pencocokan multi-faktor deterministik yang menghitung indeks kecocokan (0–100%) antara data profil Talent dengan kualifikasi Proyek.

* **FR-MTC-02 — Explainable Match Summary (Priority: P1)**
  * Kartu transparansi hasil penilaian:
    * **Untuk Talent:** Menjabarkan keahlian yang cocok dan potensi penutupan *skill gap*.
    * **Untuk UMKM:** Menjabarkan kesesuaian skill pelamar, jam terbang, dan riwayat proyek terverifikasi.

* **FR-PRJ-01 — Project Application & Workspace (Priority: P0)**
  * Alur pelamaran terstruktur (motivasi singkat, konfirmasi jadwal kerja, tautan portofolio).
  * *Workspace* kolaboratif setelah lamaran berstatus `ACCEPTED` yang memuat 1–4 *milestones*, tenggat waktu pengerjaan, *acceptance criteria*, dan instruksi deliverable.

* **FR-PRJ-02 — Project State Machine (Priority: P0)**
  * Pengendalian status proyek terstandarisasi dan terpisah dari status milestone, pembayaran, infrastruktur, serta dukungan pascaproyek:
    ```text
    DRAFT ➔ PUBLISHED ➔ TALENT_SELECTED ➔ FUNDED ➔ IN_PROGRESS
      ➔ STAGING_REVIEW ➔ PRODUCTION_DEPLOYMENT ➔ HANDOVER_PENDING ➔ COMPLETED
    ```
  * Cabang pengecualian proyek mencakup `CANCELLED` dan `DISPUTED` tanpa mencampurkannya dengan keputusan review milestone.

* **FR-PRJ-03 — Review & Project Verification (Priority: P0)**
  * Panel verifikasi UMKM memberikan keputusan `APPROVED`, `REVISION_REQUESTED`, `CHANGE_REQUESTED`, atau `DISPUTED` berdasarkan *acceptance criteria* yang disepakati.
  * `REVISION_REQUESTED` hanya digunakan untuk hasil yang belum memenuhi scope; kebutuhan baru wajib masuk `CHANGE_REQUESTED`.
  * Penyelesaian seluruh milestone, production handover, dan kewajiban pembayaran memicu pembaruan *Verified Skill*, portofolio, serta rekalkulasi *Digital Growth*.

### 3.4 Modul Milestone & Delivery Review

* **FR-MIL-01 — Milestone Definition (Priority: P0)**
  * Setiap proyek memiliki 1–4 milestone dengan judul, bobot pembayaran, deadline, deliverable, dan acceptance criteria terukur.
  * Total bobot seluruh milestone wajib tepat 100% sebelum proyek didanai.

* **FR-MIL-02 — Staging Submission (Priority: P0)**
  * Talent menyerahkan hasil melalui Preview URL staging HTTPS, ringkasan nonteknis, checklist acceptance criteria, instruksi pengujian, screenshot bukti, serta akun demo jika autentikasi diperlukan.
  * Revisi menghasilkan versi submission baru; riwayat submission sebelumnya tetap tersedia untuk audit.

* **FR-MIL-03 — UMKM Review Hub (Priority: P0)**
  * UMKM meninjau hasil menggunakan bahasa bisnis, langkah pengujian, batas waktu review, dan aksi persetujuan yang jelas tanpa diwajibkan memahami repository atau CI/CD.
  * Countdown review berhenti ketika staging tidak dapat diakses dan berlanjut setelah submission valid tersedia kembali.

* **FR-MIL-04 — Milestone Review & Payout (Priority: P0)**
  * Status milestone mengikuti `PENDING ➔ IN_PROGRESS ➔ SUBMITTED ➔ READY_FOR_REVIEW ➔ APPROVED ➔ PAID`.
  * Cabang review mencakup `REVISION_REQUESTED` dan `DISPUTED`; approval mencairkan 90% nilai milestone kepada Talent dan mengakumulasi 10% sebagai retensi warranty proyek.

### 3.5 Modul Infrastruktur & Handover

* **FR-INF-01 — Infrastructure Diagnosis (Priority: P0)**
  * Sistem menanyakan kebutuhan bisnis dalam bahasa nonteknis lalu merekomendasikan `STAGING_ONLY`, `MANAGED_HOSTING`, `SHARED_HOSTING`, `VPS`, atau `EXISTING_INFRASTRUCTURE`.
  * Managed hosting menjadi rekomendasi default; VPS hanya direkomendasikan ketika kebutuhan teknis tidak dapat dipenuhi layanan managed.

* **FR-INF-02 — Domain and Hosting Ownership (Priority: P0)**
  * Domain, hosting, VPS, database, dan layanan pihak ketiga dibeli langsung serta dimiliki UMKM.
  * Talent memperoleh akses sementara atau collaborator tanpa meminta credential plaintext melalui chat CocokIn.

* **FR-HOV-01 — Production Handover (Priority: P0)**
  * Handover memverifikasi production URL, domain, HTTPS, fungsi utama, tampilan mobile, ownership akun, akses admin, panduan penggunaan, backup/export awal, dan informasi biaya berulang.
  * Handover yang disetujui mencairkan 90% nilai milestone final, memulai warranty 30 hari, dan menjadwalkan pelepasan akumulasi retensi 10% dari seluruh milestone.

### 3.6 Modul Pembayaran, Warranty & Maintenance

* **FR-PAY-01 — Project Funding Receipt (Priority: P0)**
  * UMKM mendanai Service Value dan fee platform ke rekening badan usaha CocokIn melalui transfer bank sebagai default atau GoPay Merchant QRIS sebagai opsi.
  * Setiap pergerakan dana memiliki Platform Reference dan External Reference. Real-money mode tidak aktif sebelum legal, bank/acquirer, accounting, AML/KYC, reconciliation, dan treasury gates disetujui.
  * CocokIn menjaga reserve kas 100% atas seluruh kewajiban pengguna dan tidak boleh menyebut layanan ini sebagai escrow berizin tanpa dasar legal.
  * Domain, hosting, VPS, database, lisensi, pajak, dan biaya payment gateway dipisahkan dari nilai jasa yang dikenakan platform fee.

* **FR-PAY-02 — Staged Platform Fee (Priority: P0)**
  * UMKM membayar total fee 10% dari Service Value: 5% menjadi Activation Fee dan 5% menjadi Success Fee. Talent tidak dikenakan fee.
  * Fee pending tetap refundable; fee earned mengikuti trigger kontraktual dan immutable ledger.

* **FR-PAY-03 — Milestone Payout & Warranty Retention (Priority: P0)**
  * Setiap milestone approved mengalokasikan 90% untuk payout Talent dan 10% sebagai warranty retention Talent.
  * CocokIn menanggung biaya transfer payout. Retention cair setelah warranty berakhir tanpa tiket valid atau sengketa aktif.

* **FR-CHT-01 — Project-Scoped In-App Chat (Priority: P0)**
  * Chat aktif setelah Talent diterima, menggunakan PostgreSQL sebagai source of truth dan Pusher Channels untuk realtime transport.
  * Chat mendukung text, reply, reaction, attachment, voice note, typing, presence, receipt, unread, search, report, system message, fallback polling, read-only closure, dan reopen consent Talent.
  * Chat tidak dapat mengubah scope, milestone, deadline, approval, atau financial state tanpa aksi formal terkait.

* **FR-SUP-01 — Bug Warranty (Priority: P1)**
  * Warranty bug gratis berlaku 30 hari kalender untuk ketidaksesuaian terhadap scope, acceptance criteria, dan baseline production saat handover.
  * Talent memberi respons awal maksimal 2 hari kerja; target perbaikan adalah 1 hari kerja untuk kritis, 3 hari kerja untuk mayor, dan 5 hari kerja untuk minor setelah tiket dinyatakan valid.

* **FR-SUP-02 — Paid Maintenance (Priority: P1)**
  * UMKM dapat membeli maintenance opsional selama 30 hari dengan kuota maksimal 5 tiket operasional kecil.
  * Fitur baru, perubahan alur bisnis, integrasi baru, atau pekerjaan besar dialihkan menjadi change request atau proyek baru; sisa tiket tidak diakumulasi.

---

### 3.7 Modul Admin & Dampak Sosial (SDG)

* **FR-ADM-01 — User & Content Moderation (Priority: P1)**
  * Moderasi proyek mikro di luar cakupan wajar, manajemen penangguhan akun (*suspend/restore*), dan penanganan tiket aduan (*Trust & Safety*).

* **FR-ADM-02 — Master Taxonomy & Assessment Bank (Priority: P1)**
  * Manajemen CRUD master data keahlian, taksonomi karier, kategori bisnis, serta bank soal asesmen kesiapan karier dan bisnis.

* **FR-ADM-03 — Platform Impact Metrics Dashboard (Priority: P1)**
  * Dashboard pemantauan dampak real-time:
    * **SDG 8:** Total talenta terberdayakan, proyek mikro terselesaikan, total jam pengalaman terverifikasi.
    * **SDG 9:** Total UMKM terdigitalisasi, tipe solusi digital yang diterapkan, dan rata-rata kenaikan skor kesiapan digital UMKM.

* **FR-ADM-04 — Dispute & Financial Audit (Priority: P1)**
  * Admin meninjau acceptance criteria, riwayat submission, bukti kedua pihak, ledger transaksi, dan aktivitas tiket tanpa mengubah histori audit.
  * Keputusan dapat berupa full release, partial release, revisi, penggunaan retensi untuk Talent pengganti, atau refund sesuai aturan bisnis.

---

## 4. Mathematical Modeling & Matching Formula

### 4.1 Formula Cocok Score (Weighted Multi-Factor)
$$	ext{Cocok Score} = (W_{	ext{skill}} 	imes S_{	ext{skill}}) + (W_{	ext{career}} 	imes S_{	ext{career}}) + (W_{	ext{avail}} 	imes S_{	ext{avail}}) + (W_{	ext{exp}} 	imes S_{	ext{exp}}) + (W_{	ext{pref}} 	imes S_{	ext{pref}})$$

#### Pembobotan Parameter Default:
* **$W_{	ext{skill}} = 0.40$ (Skill Match Score):**  
  Persentase kecocokan skill wajib proyek yang dikuasai talent dikalikan bobot level bukti (*Project Verified* > *Assessed* > *Self-Declared*).
* **$W_{	ext{career}} = 0.20$ (Career Alignment & Skill Gap):**  
  Relevansi proyek terhadap target profesi talent dan potensi proyek dalam menyelesaikan *Major Skill Gap*.
* **$W_{	ext{avail}} = 0.15$ (Availability Score):**  
  Kesesuaian jam luang talent terhadap estimasi durasi dan *deadline* proyek.
* **$W_{	ext{exp}} = 0.15$ (Experience & Difficulty Score):**  
  Kesesuaian jumlah proyek terverifikasi sebelumnya dengan tingkat kesulitan proyek (*Beginner, Intermediate, Advanced*).
* **$W_{	ext{pref}} = 0.10$ (Work Mode Preference Score):**  
  Kesesuaian preferensi mode kerja (*Remote / Hybrid / Onsite*) antara talent dan UMKM.

$$\sum W = 0.40 + 0.20 + 0.15 + 0.15 + 0.10 = 1.00$$

---

## 5. Database Schema & Data Architecture

```text
User (1) <---> (0..1) TalentProfile
User (1) <---> (0..1) BusinessProfile
User (1) <---> (0..*) Notification
User (1) <---> (0..*) Report

Career (1) <---> (0..*) CareerSkillRequirement (0..*) <---> (1) Skill
Skill (1) <---> (0..*) TalentSkill (0..*) <---> (1) TalentProfile
Skill (1) <---> (0..*) ProjectSkill (0..*) <---> (1) Project

TalentProfile (1) <---> (0..*) TalentAssessmentResult
TalentProfile (1) <---> (0..*) ProjectApplication
TalentProfile (1) <---> (0..*) PortfolioEntry

BusinessProfile (1) <---> (0..*) BusinessAssessmentResult
BusinessProfile (1) <---> (0..*) Project

Project (1) <---> (0..*) ProjectApplication (1) <---> (0..1) MatchSnapshot
Project (1) <---> (1..4) ProjectMilestone
ProjectMilestone (1) <---> (1..*) MilestoneAcceptanceCriterion
ProjectMilestone (1) <---> (0..*) MilestoneSubmission
MilestoneSubmission (1) <---> (0..*) SubmissionEvidence
MilestoneSubmission (1) <---> (0..1) MilestoneReview

Project (1) <---> (0..*) ChangeRequest
Project (1) <---> (0..1) InfrastructurePlan
Project (1) <---> (0..1) InfrastructureHandover
Project (1) <---> (0..1) WarrantyAgreement
Project (1) <---> (0..1) MaintenancePackage
Project (1) <---> (0..*) SupportTicket

Project (1) <---> (1) EscrowTransaction
EscrowTransaction (1) <---> (1..*) LedgerEntry
EscrowTransaction (1) <---> (0..*) Payout
EscrowTransaction (1) <---> (0..*) Refund

Project (1) <---> (0..*) Dispute
Dispute (1) <---> (1..*) DisputeEvidence
Dispute (1) <---> (0..1) DisputeDecision
Project (1) <---> (0..*) AuditEvent
```

Status proyek, milestone, pembayaran, infrastruktur, warranty, dan maintenance disimpan sebagai state domain terpisah. Setiap mutasi finansial dan keputusan sengketa wajib menghasilkan ledger atau audit event yang immutable.

---

## 6. Design System & UI/UX Guidelines

### 6.1 Token Warna Semantik
* **Primary (Brand Trust):** `Blue 600` (`#2563EB`) & `Blue 700` (`#1D4ED8`) — Tombol aksi utama, branding, status aktif.
* **Dark Surfaces (Readability):** `Slate 900` (`#0F172A`) & `Slate 800` (`#1E293B`) — Headings, navbar background.
* **Semantic Status:**
  * `Emerald 600` (`#059669`) / `Emerald 50` (`#ECFDF5`) — *Verified status*, proyek `COMPLETED`, kenaikan skor.
  * `Amber 500` (`#F59E0B`) / `Amber 50` (`#FFFBEB`) — *Skill gap alert*, status revisi, deadline mendekat.
  * `Rose 600` (`#E11D48`) / `Rose 50` (`#FFF1F2`) — Kesalahan form, pembatalan, status ditolak.
* **Backgrounds & Borders:** `Slate 50` (`#F8FAFC`), `White` (`#FFFFFF`), `Slate 200` (`#E2E8F0`).

### 6.2 Standar Aksesibilitas (WCAG AA Compliance)
* Rasio kontras teks minimum **4.5:1** terhadap latar belakang.
* Navigasi keyboard penuh (*visible focus rings* pada seluruh elemen interaktif).
* Struktur HTML5 semantik (`<header>`, `<main>`, `<nav>`, `<article>`) dan atribut `aria-label` deskriptif.
* Form multi-step menampilkan progres, menyimpan draft, menggunakan label terlihat, error inline, dan error summary yang dapat difokuskan.
* Visualisasi *Cocok Score* dan readiness wajib memiliki nilai tekstual serta fallback tabel; informasi tidak boleh bergantung pada warna saja.

### 6.3 Product UI Direction
* **Typography:** Plus Jakarta Sans untuk UI yang modern, ramah, dan tetap profesional; angka finansial memakai tabular figures.
* **Layout:** Balanced modern dengan kepadatan sedang untuk dashboard; progressive disclosure digunakan untuk pilihan domain, hosting, dan VPS.
* **Motion:** Transisi fungsional dan terkendali dengan dukungan `prefers-reduced-motion`; hindari motion dekoratif pada proses pembayaran dan review.
* **Application:** `ui-ux-pro-max` menjadi acuan dashboard, assessment, form, chart, aksesibilitas, dan responsive behavior. `taste-skill` diterapkan selektif pada landing page serta public Skill Passport, bukan pada multi-step product UI.

---

## 7. Technical Architecture & Tech Stack

```text
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                          │
│ Next.js 16, React 19, TypeScript 5, Tailwind CSS 4          │
│ shadcn/Radix, React Hook Form, Zod 4, Recharts              │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION TIER                       │
│        Node.js 22 LTS / Next.js Server Actions              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Auth & RBAC Middleware | Validation (Zod Schema)      │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ Domain Modules:                                       │  │
│  │ • Talent & Skill Engine     • Business Readiness      │  │
│  │ • Matching & Cocok Engine   • Milestone & Review Hub  │  │
│  │ • Treasury & Ledger         • Infra & Handover        │  │
│  │ • Warranty & Support        • Impact Aggregator       │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Prisma Client
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA & STORAGE                        │
│ Supabase PostgreSQL 17 | Prisma 7 | Supabase Storage        │
└─────────────────────────────────────────────────────────────┘
```

* **Reliability & AI Fallback:** Fitur AI (draf proyek otomatis & ringkasan matching) bersifat opsional/pendukung. Jika API LLM mengalami downtime, sistem secara otomatis menjalankan *deterministic rule-based matching* 100% normal tanpa interupsi.
* **Payment Boundary:** Funding, payout, dan refund menggunakan rekening badan usaha CocokIn dengan reserve kewajiban 100%, dual reference, reconciliation, dan immutable ledger. Real-money launch tetap gated; foundation memakai simulasi.
* **Infrastructure Boundary:** CocokIn mengorkestrasi diagnosis, rekomendasi, review, dan handover; domain, hosting, VPS, serta billing provider tetap dimiliki UMKM.
* **Managed Providers:** Auth.js 5 untuk session/RBAC, Pusher Channels untuk realtime chat, Inngest untuk durable jobs, Resend untuk email, Google Gemini untuk AI assist, serta Sentry untuk observability.
* **Source & Deployment:** GitHub digunakan untuk source control dan Pull Request tanpa GitHub Actions. Vercel Git Integration membuat Preview Deployment dari branch/PR dan Production Deployment dari `main`.

---

## 8. Development Phases & Roadmap

* **Phase 1 — Foundation & Authentication (P0):** Setup repositori Next.js + Tailwind, konfigurasi PostgreSQL & Prisma, implementasi Auth.js dengan RBAC (Talent, Business, Admin), dan layout dashboard.
* **Phase 2 — Dual Profile & Assessment Core (P0):** Onboarding profil talent & bisnis, kuis *Career Readiness*, formulir *Digital Readiness*, dan kalkulator *Skill Gap*.
* **Phase 3 — Project Management & Smart Matching (P0):** Form pembuatan *Micro-Project*, algoritma kalkulasi *Cocok Score*, katalog marketplace proyek, dan alur pelamaran.
* **Phase 4 — Milestone Delivery & Review Hub (P0):** Milestone workspace, Preview URL staging, versioned submission, acceptance checklist, revision, change request, dan review UMKM.
* **Phase 5 — Treasury, Ledger & Dispute (P0/P1):** Funding reconciliation, reserve 100%, fee 5%/5%, payout milestone 90/10, refund, dual reference, audit event, dan mediasi Admin.
* **Phase 6 — Infrastructure, Handover & Support (P0/P1):** Diagnosis domain/hosting, production handover, ownership checklist, warranty 30 hari, maintenance 5 tiket, SLA, dan support ticket.
* **Phase 7 — Analytics, AI Assist & Final Polish (P1/P2):** Auto-generate *Skill Passport* dan *Verified Portfolio*, AI Project Assistant, *Explainable Match*, dashboard dampak SDG 8/9, testing E2E Playwright, dan finalisasi seed data demo.
