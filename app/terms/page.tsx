import type { Metadata } from "next";
import Link from "next/link";
import { CocokInBrand } from "@/src/design-system/cocokin-brand";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan Layanan | CocokIn",
  description: "Syarat dan Ketentuan Layanan resmi ekosistem CocokIn bagi Talenta Muda dan Pelaku Usaha UMKM.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#001040]">
      {/* ── Top Header Bar ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D8E1EE] px-4 md:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link className="flex items-center gap-2.5" href="/">
            <CocokInBrand className="w-8 h-8 object-contain" decorative priority variant="mark" />
            <span className="font-black text-xl text-[#001040] tracking-tight">CocokIn</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-[#53647A] hover:text-[#001040] px-3 py-2 rounded-lg transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-xs font-bold bg-[#001040] hover:bg-[#001040]/90 text-white px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Terms Document Container ── */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-10">
        <div>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006FE6] hover:underline mb-4"
          >
            <ArrowLeft size={16} weight="bold" /> Kembali ke Pendaftaran
          </Link>
          <h1 className="text-3xl md:text-5xl font-black text-[#001040] tracking-tight">
            Syarat & Ketentuan Layanan
          </h1>
          <p className="text-sm font-semibold text-[#53647A] mt-2">
            Terakhir diperbarui: 31 Agustus 2026 • Versi 2.0 (CocokIn Ecosystem)
          </p>
          <p className="text-sm text-[#53647A] mt-4 leading-relaxed bg-[#FFFFFF] p-5 rounded-xl border border-[#D8E1EE] shadow-2xs">
            Selamat datang di <strong>CocokIn</strong>. Dokumen ini merupakan ketentuan pra-rilis untuk penggunaan layanan simulasi oleh Talent dan Pelaku Usaha UMKM. Identitas badan hukum operator, alamat resmi, serta ketentuan layanan uang riil akan ditetapkan sebelum peluncuran komersial dan tunduk pada persetujuan hukum yang berlaku.
          </p>
        </div>

        {/* ── Section 1: Application and Acceptance ── */}
        <section className="bg-white border border-[#D8E1EE] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#001040] pb-2 border-b border-[#D8E1EE]">
            1. Penerimaan dan Ruang Lingkup Ketentuan (Acceptance of Terms)
          </h2>
          <div className="space-y-3 text-sm text-[#53647A] leading-relaxed">
            <p>
              1.1. Dengan mendaftar, mengakses, atau menggunakan platform CocokIn, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat secara hukum oleh Ketentuan ini beserta Kebijakan Privasi kami.
            </p>
            <p>
              1.2. Jika Anda bertindak atas nama badan usaha, firma, atau entitas UMKM, Anda menyatakan dan menjamin bahwa Anda memiliki kewenangan hukum yang sah untuk mewakili dan mengikat entitas tersebut pada Ketentuan ini.
            </p>
            <p>
              1.3. Jika Anda tidak menyetujui sebagian atau seluruh isi dari Ketentuan ini, Anda tidak diperkenankan untuk mengakses atau menggunakan layanan CocokIn.
            </p>
          </div>
        </section>

        {/* ── Section 2: Account Registration & Security ── */}
        <section className="bg-white border border-[#D8E1EE] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#001040] pb-2 border-b border-[#D8E1EE]">
            2. Pendaftaran Akun, Kelayakan & Keamanan (Account Registration & Security)
          </h2>
          <div className="space-y-3 text-sm text-[#53647A] leading-relaxed">
            <p>
              2.1. <strong>Akurasi Informasi:</strong> Saat mendaftarkan akun, Anda wajib memberikan informasi identitas yang akurat, mutakhir, dan lengkap (termasuk nama lengkap, institusi/universitas, nama usaha, domisili, dan alamat email aktif).
            </p>
            <p>
              2.2. <strong>Peran Pengguna (Roles):</strong> Platform membedakan dua peran pengguna utama: <strong>Talent</strong> (talenta muda, mahasiswa, fresh graduate) dan <strong>Business/UMKM</strong> (pelaku usaha mikro, kecil, dan menengah). Setiap peran memiliki hak akses, alur kerja, dan batasan fungsionalitas yang terpisah.
            </p>
            <p>
              2.3. <strong>Keamanan Kredensial:</strong> Anda bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi dan kredensial akun Anda. Anda dilarang meminjamkan, mengalihkan, atau menjual akses akun Anda kepada pihak ketiga mana pun.
            </p>
            <p>
              2.4. <strong>Penangguhan Akun:</strong> Kami berhak membatasi, menangguhkan, atau menghentikan akun pengguna yang terbukti melanggar hukum, melakukan pemalsuan bukti keahlian, menyalahgunakan dana proyek, atau melanggar aturan integritas komunitas.
            </p>
          </div>
        </section>

        {/* ── Section 3: Micro-Projects & Work Mode ── */}
        <section className="bg-white border border-[#D8E1EE] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#001040] pb-2 border-b border-[#D8E1EE]">
            3. Model Operasional Proyek Mikro & Moda Kerja (Micro-Projects & Work Mode)
          </h2>
          <div className="space-y-3 text-sm text-[#53647A] leading-relaxed">
            <p>
              3.1. <strong>Definisi Proyek Mikro:</strong> Proyek yang diterbitkan di CocokIn merupakan pekerjaan transformasi digital berskala terukur dengan estimasi durasi pengerjaan antara <strong>3 hingga 14 hari kerja</strong>.
            </p>
            <p>
            3.2. <strong>Moda Pengerjaan:</strong> Setiap proyek menetapkan moda Remote, Hybrid, atau Onsite sesuai kebutuhan dan kesepakatan para pihak. Cocok Score mempertimbangkan kecocokan preferensi moda kerja Talent dengan kebutuhan proyek.
            </p>
            <p>
              3.3. <strong>Kedaulatan Waktu Talent:</strong> Talent memiliki hak penuh untuk memilih, melamar, atau menolak tawaran proyek sesuai ketersediaan waktu luang mandiri tanpa adanya paksaan penugasan.
            </p>
          </div>
        </section>

        {/* ── Section 4: Smart Matching & Assessment ── */}
        <section className="bg-white border border-[#D8E1EE] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#001040] pb-2 border-b border-[#D8E1EE]">
            4. Algoritma Pencocokan & Tingkat Bukti Keahlian (Matching & Skill Passport)
          </h2>
          <div className="space-y-3 text-sm text-[#53647A] leading-relaxed">
            <p>
              4.1. <strong>Cocok Score Deterministik:</strong> Indeks kecocokan (0–100%) dihitung secara matematis dan transparan berdasarkan multi-faktor: <em>Skill Match (40%)</em>, <em>Career Alignment (20%)</em>, <em>Availability (15%)</em>, <em>Experience Level (15%)</em>, dan <em>Work Mode (10%)</em>.
            </p>
            <p>
              4.2. <strong>Empat Tingkat Bukti Keahlian (Evidence Levels):</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#001040]">
              <li><strong>Self-Declared:</strong> Klaim keahlian mandiri awal oleh Talent.</li>
              <li><strong>Assessed:</strong> Keahlian yang telah tervalidasi melalui kuis asesmen kualifikasi platform.</li>
              <li><strong>Project Applied:</strong> Keahlian yang sedang aktif diterapkan pada proyek berjalan.</li>
              <li><strong>Project Verified:</strong> Tingkat bukti tertinggi yang disahkan secara sah oleh UMKM pemilik proyek setelah serah terima tuntas.</li>
            </ul>
          </div>
        </section>

        {/* ── Section 5: Milestone Delivery & Staging ── */}
        <section className="bg-white border border-[#D8E1EE] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#001040] pb-2 border-b border-[#D8E1EE]">
            5. Penyerahan Milestone & Pengujian Staging (Delivery & Staging Review)
          </h2>
          <div className="space-y-3 text-sm text-[#53647A] leading-relaxed">
            <p>
              5.1. <strong>Struktur Milestone:</strong> Setiap proyek wajib memuat 1 hingga 4 milestone dengan kriteria penerimaan (*Acceptance Criteria*) terukur dan total bobot kumulatif tepat 100%.
            </p>
            <p>
              5.2. <strong>HTTPS Preview Staging:</strong> Talent wajib menyerahkan hasil pengerjaan melalui tautan Preview URL HTTPS yang dapat diuji langsung oleh UMKM (contoh: Vercel, Figma, Google Drive).
            </p>
            <p>
              5.3. <strong>Hak Review UMKM:</strong> UMKM berhak meninjau hasil dan mengambil keputusan:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[#001040]">
              <li><strong>APPROVED:</strong> Hasil telah memenuhi seluruh acceptance criteria milestone.</li>
              <li><strong>REVISION_REQUESTED:</strong> Hasil belum memenuhi scope yang disepakati (Talent wajib memperbaiki).</li>
            </ul>
          </div>
        </section>

        {/* ── Section 6: Payments, Fees & Liability Reserve ── */}
        <section className="bg-white border border-[#D8E1EE] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#001040] pb-2 border-b border-[#D8E1EE]">
            6. Tata Kelola Finansial & 100% Liability Reserve (Payments & Treasury)
          </h2>
          <div className="space-y-3 text-sm text-[#53647A] leading-relaxed">
            <p>
              6.1. <strong>Pendanaan Penuh di Awal:</strong> UMKM mendanai total nilai imbalan jasa (*Service Value*) ditambah total biaya platform 10% (5% Activation Fee + 5% Success Fee) sebelum proyek dinyatakan aktif.
            </p>
            <p>
              6.2. <strong>Tanpa Potongan untuk Talent:</strong> Talent menerima 100% nilai imbalan jasa tanpa potongan biaya platform.
            </p>
            <p>
              6.3. <strong>Alokasi Milestone Payout (90% + 10%):</strong> Setiap kali milestone disetujui (*Approved*), sistem mencairkan <strong>90%</strong> nilai milestone kepada Talent, dan mengalokasikan <strong>10%</strong> sebagai retensi garansi kualitas.
            </p>
            <p>
              6.4. <strong>100% Liability Reserve:</strong> Ketika mode uang riil diaktifkan, kas terbatas wajib selalu mencakup 100% Talent Payable, UMKM Refundable, dan Fee Pending. Ketentuan ini tidak menyatakan bahwa CocokIn merupakan penyedia escrow berizin.
            </p>
            <p>
              6.5. <strong>Mode Pembayaran:</strong> Saat ini platform hanya beroperasi dalam <em>Simulated Payment Mode</em> dan tidak memindahkan uang riil. Mode uang riil tetap dinonaktifkan sampai badan hukum, rekening bisnis, persetujuan bank/acquirer, akuntansi, pajak, AML/KYC, rekonsiliasi, keamanan, dan SOP treasury disetujui.
            </p>
          </div>
        </section>

        {/* ── Section 7: Handover & 30-Day Bug Warranty ── */}
        <section className="bg-white border border-[#D8E1EE] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#001040] pb-2 border-b border-[#D8E1EE]">
            7. Serah Terima Produksi, Kepemilikan & Garansi 30 Hari (Handover & Warranty)
          </h2>
          <div className="space-y-3 text-sm text-[#53647A] leading-relaxed">
            <p>
              7.1. <strong>Kepemilikan Infrastruktur:</strong> Nama domain, hosting, database, dan akun pihak ketiga dibeli langsung dan menjadi milik mutlak UMKM. Talent hanya diberikan hak akses kolaborator sementara.
            </p>
            <p>
              7.2. <strong>Garansi Bug Gratis 30 Hari:</strong> Setelah serah terima produksi (*Production Handover*) disetujui, berlaku masa garansi perbaikan bug gratis selama <strong>30 hari kalender</strong> terhadap ketidaksesuaian ruang lingkup pengerjaan.
            </p>
            <p>
              7.3. <strong>Pelepasan Retensi 10%:</strong> Akumulasi retensi garansi hanya dapat dilepas setelah hari ke-30 apabila tidak ada sengketa aktif dan tidak ada tiket warranty valid yang masih belum terselesaikan.
            </p>
          </div>
        </section>

        {/* ── Section 8: IP & Verified Portfolio ── */}
        <section className="bg-white border border-[#D8E1EE] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#001040] pb-2 border-b border-[#D8E1EE]">
            8. Hak Cipta, Bukti Kerja & Portofolio Berizin Ganda (IP & Portfolio)
          </h2>
          <div className="space-y-3 text-sm text-[#53647A] leading-relaxed">
            <p>
              8.1. <strong>Kepemilikan dan Lisensi:</strong> Batas kepemilikan deliverable, materi milik Talent sebelumnya, komponen open-source, layanan pihak ketiga, dan hak penggunaan UMKM harus dinyatakan dalam Project Agreement. CocokIn tidak menganggap seluruh hak otomatis beralih tanpa kesepakatan tersebut.
            </p>
            <p>
              8.2. <strong>Penerbitan Portofolio Berizin Ganda:</strong> Portofolio terverifikasi publik bagi Talent hanya dapat diterbitkan setelah proyek berstatus `COMPLETED` dan memenuhi izin ganda: izin publikasi dari Talent serta persetujuan atribusi bisnis dari UMKM.
            </p>
          </div>
        </section>

        {/* ── Section 9: Privacy & Communications ── */}
        <section className="bg-white border border-[#D8E1EE] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#001040] pb-2 border-b border-[#D8E1EE]">
            9. Privasi, Komunikasi Chat & Data Pribadi (Privacy & Chat)
          </h2>
          <div className="space-y-3 text-sm text-[#53647A] leading-relaxed">
            <p>
              9.1. <strong>Project Chat Terisolasi:</strong> Komunikasi interaktif melalui fitur chat proyek hanya aktif antara Talent terpilih dan UMKM yang bersangkutan.
            </p>
            <p>
              9.2. <strong>Integritas Chat:</strong> Pesan chat proyek tidak dapat digunakan untuk mengubah nilai finansial, ruang lingkup pengerjaan, atau kriteria penerimaan tanpa melalui formulir kesepakatan formal di sistem.
            </p>
            <p>
              9.3. <strong>Perlindungan Data Pribadi:</strong> Kami memproses data pribadi Anda sesuai regulasi perlindungan data yang berlaku untuk keperluan autentikasi, operasional matching, dan penerbitan bukti sertifikasi portofolio.
            </p>
          </div>
        </section>

        {/* ── Section 10: Disputes and Law ── */}
        <section className="bg-white border border-[#D8E1EE] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#001040] pb-2 border-b border-[#D8E1EE]">
            10. Penyelesaian Sengketa & Hukum yang Berlaku (Disputes & Governing Law)
          </h2>
          <div className="space-y-3 text-sm text-[#53647A] leading-relaxed">
            <p>
              10.1. Apabila timbul perselisihan antara Talent dan UMKM terkait pemenuhan hasil kerja atau pembayaran, kedua belah pihak sepakat untuk menyelesaikan melalui mediasi panel sengketa (*Dispute Panel*) Admin CocokIn berdasarkan bukti digital pada sistem.
            </p>
            <p>
              10.2. Ketentuan ini diatur dan ditafsirkan berdasarkan hukum Negara Kesatuan Republik Indonesia.
            </p>
          </div>
        </section>

        {/* ── Bottom Action ── */}
        <div className="pt-6 text-center space-y-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center bg-[#001040] hover:bg-[#001040]/90 text-white font-bold text-sm py-3.5 px-8 rounded-xl transition-colors shadow-sm"
          >
            Kembali ke Halaman Pendaftaran
          </Link>
          <p className="text-xs text-[#53647A]">
            Kanal kontak resmi operator akan diumumkan sebelum peluncuran komersial.
          </p>
        </div>
      </main>
    </div>
  );
}
