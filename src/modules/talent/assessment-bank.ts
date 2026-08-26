import type { AssessmentQuestion } from "./types";

/**
 * Adaptive assessment question bank — PRD §3.1 FR-TAL-02.
 * Each career has Technical + Soft-Skill questions.
 * ponytail: static bank; replace with DB-backed adaptive engine at scale.
 */
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // ── Frontend Dev ──────────────────────────────────────────
  {
    id: "fe-html-1",
    careerId: "frontend-dev",
    type: "TECHNICAL",
    text: "Apa fungsi utama atribut `alt` pada elemen <img>?",
    options: [
      { label: "Menampilkan tooltip saat hover", score: 30 },
      { label: "Menyediakan teks alternatif untuk aksesibilitas dan fallback", score: 100 },
      { label: "Menentukan ukuran gambar", score: 10 },
      { label: "Mengatur posisi gambar", score: 10 },
    ],
  },
  {
    id: "fe-css-1",
    careerId: "frontend-dev",
    type: "TECHNICAL",
    text: "Apa perbedaan utama antara `flexbox` dan `grid` di CSS?",
    options: [
      { label: "Tidak ada perbedaan, keduanya identik", score: 10 },
      { label: "Flexbox untuk layout 1 dimensi, Grid untuk 2 dimensi", score: 100 },
      { label: "Grid hanya untuk tabel", score: 20 },
      { label: "Flexbox lebih baru dari Grid", score: 10 },
    ],
  },
  {
    id: "fe-js-1",
    careerId: "frontend-dev",
    type: "TECHNICAL",
    text: "Apa output dari `typeof null` di JavaScript?",
    options: [
      { label: '"null"', score: 30 },
      { label: '"undefined"', score: 10 },
      { label: '"object"', score: 100 },
      { label: '"boolean"', score: 10 },
    ],
  },
  {
    id: "fe-react-1",
    careerId: "frontend-dev",
    type: "TECHNICAL",
    text: "Kapan React `useEffect` cleanup function dijalankan?",
    options: [
      { label: "Saat komponen pertama kali di-render", score: 10 },
      { label: "Sebelum effect berikutnya berjalan dan saat unmount", score: 100 },
      { label: "Hanya saat unmount", score: 50 },
      { label: "Setiap kali state berubah", score: 20 },
    ],
  },
  {
    id: "fe-tailwind-1",
    careerId: "frontend-dev",
    type: "TECHNICAL",
    text: "Bagaimana cara membuat elemen responsif di Tailwind CSS?",
    options: [
      { label: "Menggunakan media query di file CSS terpisah", score: 20 },
      { label: "Menggunakan prefix breakpoint seperti md: dan lg:", score: 100 },
      { label: "Tailwind tidak mendukung responsif", score: 0 },
      { label: "Menggunakan JavaScript untuk deteksi layar", score: 10 },
    ],
  },
  {
    id: "fe-nextjs-1",
    careerId: "frontend-dev",
    type: "TECHNICAL",
    text: "Apa keuntungan utama Server Components di Next.js?",
    options: [
      { label: "Animasi lebih smooth", score: 10 },
      { label: "Mengurangi JavaScript bundle di client dan akses langsung ke data layer", score: 100 },
      { label: "Mempercepat hot reload", score: 10 },
      { label: "Tidak ada keuntungan, hanya branding", score: 0 },
    ],
  },

  // ── UI/UX Designer ────────────────────────────────────────
  {
    id: "ux-figma-1",
    careerId: "ui-ux-designer",
    type: "TECHNICAL",
    text: "Apa fungsi Auto Layout di Figma?",
    options: [
      { label: "Mengatur animasi otomatis", score: 10 },
      { label: "Membuat layout responsif yang menyesuaikan konten", score: 100 },
      { label: "Mengganti warna secara otomatis", score: 10 },
      { label: "Membuat prototipe interaktif", score: 20 },
    ],
  },
  {
    id: "ux-research-1",
    careerId: "ui-ux-designer",
    type: "TECHNICAL",
    text: "Apa tujuan utama User Research?",
    options: [
      { label: "Memvalidasi keputusan desain berdasarkan data pengguna", score: 100 },
      { label: "Membuat wireframe yang indah", score: 10 },
      { label: "Mengurangi waktu development", score: 30 },
      { label: "Mengganti usability testing", score: 10 },
    ],
  },
  {
    id: "ux-wireframe-1",
    careerId: "ui-ux-designer",
    type: "TECHNICAL",
    text: "Kapan sebaiknya wireframe dibuat dalam proses desain?",
    options: [
      { label: "Setelah high-fidelity mockup selesai", score: 10 },
      { label: "Sebelum visual design, untuk memvalidasi struktur dan alur", score: 100 },
      { label: "Bersamaan dengan coding", score: 20 },
      { label: "Wireframe tidak diperlukan dalam desain modern", score: 0 },
    ],
  },
  {
    id: "ux-prototype-1",
    careerId: "ui-ux-designer",
    type: "TECHNICAL",
    text: "Apa manfaat utama prototyping interaktif?",
    options: [
      { label: "Menggantikan kebutuhan developer", score: 0 },
      { label: "Menguji alur pengguna sebelum implementasi", score: 100 },
      { label: "Membuat kode production-ready", score: 10 },
      { label: "Hanya untuk presentasi ke klien", score: 30 },
    ],
  },
  {
    id: "ux-ds-1",
    careerId: "ui-ux-designer",
    type: "TECHNICAL",
    text: "Apa komponen inti dari sebuah Design System?",
    options: [
      { label: "Hanya kumpulan warna dan font", score: 20 },
      { label: "Token, komponen reusable, pattern, dan dokumentasi panduan", score: 100 },
      { label: "Template landing page", score: 10 },
      { label: "Library ikon saja", score: 10 },
    ],
  },

  // ── Data Analyst ──────────────────────────────────────────
  {
    id: "da-sql-1",
    careerId: "data-analyst",
    type: "TECHNICAL",
    text: "Apa perbedaan antara `INNER JOIN` dan `LEFT JOIN`?",
    options: [
      { label: "Tidak ada perbedaan", score: 0 },
      { label: "INNER JOIN hanya mengembalikan baris yang cocok; LEFT JOIN menyertakan semua baris kiri", score: 100 },
      { label: "LEFT JOIN lebih cepat", score: 10 },
      { label: "INNER JOIN hanya untuk 2 tabel", score: 10 },
    ],
  },
  {
    id: "da-python-1",
    careerId: "data-analyst",
    type: "TECHNICAL",
    text: "Library Python mana yang paling umum untuk manipulasi data tabular?",
    options: [
      { label: "NumPy", score: 40 },
      { label: "Pandas", score: 100 },
      { label: "Matplotlib", score: 20 },
      { label: "Flask", score: 0 },
    ],
  },
  {
    id: "da-excel-1",
    careerId: "data-analyst",
    type: "TECHNICAL",
    text: "Fungsi Excel apa yang digunakan untuk pencarian data berdasarkan kunci?",
    options: [
      { label: "SUM", score: 0 },
      { label: "VLOOKUP / XLOOKUP", score: 100 },
      { label: "IF", score: 20 },
      { label: "CONCATENATE", score: 0 },
    ],
  },
  {
    id: "da-analytics-1",
    careerId: "data-analyst",
    type: "TECHNICAL",
    text: "Apa langkah pertama dalam analisis data yang baik?",
    options: [
      { label: "Langsung membuat visualisasi", score: 10 },
      { label: "Memahami pertanyaan bisnis dan membersihkan data", score: 100 },
      { label: "Menggunakan machine learning", score: 10 },
      { label: "Membuat laporan PowerPoint", score: 10 },
    ],
  },
  {
    id: "da-viz-1",
    careerId: "data-analyst",
    type: "TECHNICAL",
    text: "Kapan pie chart TIDAK tepat digunakan?",
    options: [
      { label: "Saat membandingkan banyak kategori (>5) dengan nilai mirip", score: 100 },
      { label: "Saat menampilkan proporsi sederhana", score: 10 },
      { label: "Pie chart selalu tepat", score: 0 },
      { label: "Saat data bersifat kategorikal", score: 20 },
    ],
  },

  // ── Digital Marketer ──────────────────────────────────────
  {
    id: "dm-seo-1",
    careerId: "digital-marketer",
    type: "TECHNICAL",
    text: "Faktor on-page SEO apa yang paling penting?",
    options: [
      { label: "Jumlah iklan di halaman", score: 0 },
      { label: "Title tag, meta description, heading structure, dan konten berkualitas", score: 100 },
      { label: "Warna website", score: 0 },
      { label: "Jumlah halaman", score: 20 },
    ],
  },
  {
    id: "dm-content-1",
    careerId: "digital-marketer",
    type: "TECHNICAL",
    text: "Apa prinsip utama Content Strategy?",
    options: [
      { label: "Membuat konten sebanyak mungkin", score: 20 },
      { label: "Merencanakan konten relevan yang selaras dengan tujuan bisnis dan kebutuhan audiens", score: 100 },
      { label: "Fokus hanya pada SEO keywords", score: 30 },
      { label: "Mengikuti trend viral tanpa strategi", score: 10 },
    ],
  },
  {
    id: "dm-ads-1",
    careerId: "digital-marketer",
    type: "TECHNICAL",
    text: "Apa metrik utama untuk mengukur efektivitas kampanye Meta Ads?",
    options: [
      { label: "Jumlah likes", score: 20 },
      { label: "ROAS (Return on Ad Spend) dan Cost per Acquisition", score: 100 },
      { label: "Jumlah followers baru", score: 20 },
      { label: "Impressions saja", score: 10 },
    ],
  },
  {
    id: "dm-ga-1",
    careerId: "digital-marketer",
    type: "TECHNICAL",
    text: "Di Google Analytics, apa perbedaan bounce rate dan exit rate?",
    options: [
      { label: "Tidak ada perbedaan", score: 0 },
      { label: "Bounce rate = single-page visit tanpa interaksi; exit rate = persentase keluar dari halaman tertentu", score: 100 },
      { label: "Bounce rate hanya untuk mobile", score: 0 },
      { label: "Exit rate lebih buruk dari bounce rate", score: 10 },
    ],
  },
  {
    id: "dm-copy-1",
    careerId: "digital-marketer",
    type: "TECHNICAL",
    text: "Apa elemen terpenting dalam copywriting yang efektif?",
    options: [
      { label: "Menggunakan kata-kata rumit agar terlihat profesional", score: 10 },
      { label: "Headline yang menarik, value proposition jelas, dan CTA yang spesifik", score: 100 },
      { label: "Menulis sepanjang mungkin", score: 0 },
      { label: "Menggunakan banyak emoji", score: 10 },
    ],
  },

  // ── Shared Soft Skills (all careers) ──────────────────────
  {
    id: "ss-problem-1",
    careerId: "frontend-dev",
    type: "SOFT_SKILL",
    text: "Saat menghadapi bug yang sulit, langkah pertama terbaik adalah?",
    options: [
      { label: "Langsung rewrite seluruh kode", score: 10 },
      { label: "Mengidentifikasi, mereproduksi, lalu mengisolasi masalah secara sistematis", score: 100 },
      { label: "Bertanya di forum tanpa mencoba dulu", score: 20 },
      { label: "Mengabaikan dan lanjut ke fitur lain", score: 0 },
    ],
  },
  {
    id: "ss-comm-1",
    careerId: "frontend-dev",
    type: "SOFT_SKILL",
    text: "Bagaimana cara terbaik menyampaikan progres ke klien non-teknis?",
    options: [
      { label: "Menggunakan istilah teknis agar terlihat kompeten", score: 10 },
      { label: "Ringkasan progres dalam bahasa sederhana dengan visual/demo", score: 100 },
      { label: "Mengirim raw commit log", score: 0 },
      { label: "Hanya laporan di akhir proyek", score: 20 },
    ],
  },
  {
    id: "ss-digital-1",
    careerId: "frontend-dev",
    type: "SOFT_SKILL",
    text: "Apa praktik terbaik kolaborasi digital dalam tim remote?",
    options: [
      { label: "Semua komunikasi via telepon saja", score: 10 },
      { label: "Dokumentasi tertulis, async-first, dengan tools kolaborasi terstruktur", score: 100 },
      { label: "Meeting setiap jam", score: 10 },
      { label: "Bekerja sendiri tanpa update", score: 0 },
    ],
  },
];

export function getQuestionsForCareer(careerId: string): AssessmentQuestion[] {
  return ASSESSMENT_QUESTIONS.filter((q) => q.careerId === careerId);
}

export function getTechnicalQuestions(careerId: string): AssessmentQuestion[] {
  return ASSESSMENT_QUESTIONS.filter(
    (q) => q.careerId === careerId && q.type === "TECHNICAL",
  );
}

export function getSoftSkillQuestions(careerId: string): AssessmentQuestion[] {
  // ponytail: soft-skill questions are shared but tagged per career; add per-career pool when bank grows
  return ASSESSMENT_QUESTIONS.filter(
    (q) => q.careerId === careerId && q.type === "SOFT_SKILL",
  );
}
