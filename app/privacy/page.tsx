import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

import { CocokInBrand } from "@/src/design-system/cocokin-brand";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | CocokIn",
  description: "Kebijakan Privasi resmi mengenai pengumpulan, penggunaan, perlindungan, dan hak atas data pribadi pengguna CocokIn.",
};

const sections = [
  {
    title: "1. Ruang Lingkup dan Persetujuan",
    paragraphs: [
      "Kebijakan Privasi ini menjelaskan cara CocokIn mengumpulkan, menggunakan, menyimpan, membagikan, dan melindungi data pribadi Talent, perwakilan UMKM, serta pengguna administratif.",
      "Dengan membuat akun dan menyetujui Kebijakan Privasi ini, Anda memberikan persetujuan untuk pemrosesan data yang diperlukan dalam penyediaan layanan CocokIn. Persetujuan khusus, seperti publikasi portofolio atau komunikasi pemasaran, diminta secara terpisah sesuai tujuan pemrosesannya.",
    ],
  },
  {
    title: "2. Data yang Kami Kumpulkan",
    paragraphs: [
      "Data akun dan identitas meliputi nama, alamat email, foto profil, peran pengguna, status verifikasi, dan informasi autentikasi. Kata sandi tidak disimpan dalam bentuk teks asli, tetapi dalam bentuk hash.",
      "Data Talent dapat meliputi universitas, jurusan, bio, target karier, keahlian, hasil asesmen, bukti keahlian, lamaran, proyek, dan portofolio. Data UMKM dapat meliputi nama usaha, kategori industri, lokasi, profil usaha, hasil asesmen kesiapan digital, proyek, dan data perwakilan.",
      "Data operasional dapat meliputi milestone, submission, review, riwayat chat proyek, lampiran, notifikasi, audit event, bukti pendanaan, payout, refund, warranty, support ticket, serta bukti sengketa.",
    ],
  },
  {
    title: "3. Tujuan Penggunaan Data",
    paragraphs: [
      "Kami menggunakan data untuk membuat dan mengamankan akun, menjalankan asesmen, menghitung Cocok Score secara deterministik, merekomendasikan proyek, mengelola workspace, memproses review milestone, dan menerbitkan bukti keahlian.",
      "Data juga digunakan untuk menjalankan dukungan pengguna, pencegahan penyalahgunaan, moderasi, penyelesaian sengketa, audit transaksi, pemenuhan kewajiban hukum, serta peningkatan keamanan dan keandalan platform.",
    ],
  },
  {
    title: "4. Dasar dan Batas Pemrosesan",
    paragraphs: [
      "Pemrosesan dilakukan berdasarkan persetujuan Anda, pelaksanaan perjanjian layanan, kepentingan sah untuk menjaga keamanan platform, dan kewajiban hukum yang berlaku.",
      "CocokIn tidak menjual data pribadi untuk periklanan. Data hanya diproses sejauh diperlukan untuk tujuan yang telah dijelaskan atau tujuan lain yang memperoleh persetujuan terpisah.",
    ],
  },
  {
    title: "5. Pembagian Data dan Penyedia Layanan",
    paragraphs: [
      "Data proyek yang relevan dapat dibagikan antara Talent terpilih dan UMKM pemilik proyek setelah hubungan kerja terbentuk. Admin hanya mengakses data sesuai kewenangan, alasan dukungan, moderasi, audit, atau sengketa yang tercatat.",
      "Kami dapat menggunakan penyedia layanan seperti Vercel untuk hosting, Supabase untuk PostgreSQL dan penyimpanan, Pusher untuk transport realtime, Google untuk OAuth, serta Resend untuk email transaksional. Penyedia tersebut memproses data sesuai instruksi dan kebijakan privasi masing-masing.",
    ],
  },
  {
    title: "6. Chat, Lampiran, dan Data Proyek",
    paragraphs: [
      "PostgreSQL merupakan sumber data otoritatif untuk pesan proyek. Pusher hanya digunakan untuk mempercepat pengiriman realtime dan bukan sebagai penyimpanan utama pesan.",
      "Pengguna dilarang mengirim credential plaintext, data sensitif yang tidak diperlukan, atau materi yang melanggar hukum melalui chat dan lampiran. Perubahan scope, nilai, milestone, atau status finansial hanya sah melalui aksi formal sistem.",
    ],
  },
  {
    title: "7. Keamanan dan Retensi Data",
    paragraphs: [
      "Kami menerapkan kontrol akses berbasis peran, cookie sesi HttpOnly, koneksi terenkripsi, hashing kata sandi, validasi input, audit event, dan pembatasan akses data proyek.",
      "Data disimpan selama akun aktif atau selama diperlukan untuk layanan, kewajiban hukum, audit, pembayaran, warranty, dukungan, dan penyelesaian sengketa. Token reset password berlaku satu jam dan hanya dapat digunakan satu kali.",
    ],
  },
  {
    title: "8. Hak Pengguna",
    paragraphs: [
      "Anda dapat meminta akses, koreksi, pembaruan, atau penghapusan data pribadi sesuai hukum yang berlaku. Beberapa data dapat tetap disimpan apabila diperlukan untuk kewajiban hukum, audit, keamanan, transaksi, atau sengketa.",
      "Talent dapat mengatur persetujuan publikasi portofolio. Pencabutan persetujuan berlaku untuk pemrosesan berikutnya dan tidak menghapus keabsahan pemrosesan yang telah dilakukan sebelumnya.",
    ],
  },
  {
    title: "9. Perubahan Kebijakan dan Kontak",
    paragraphs: [
      "Kami dapat memperbarui Kebijakan Privasi ini ketika layanan, regulasi, atau praktik pemrosesan berubah. Tanggal pembaruan akan ditampilkan pada halaman ini.",
      "Kanal kontak dan identitas pengendali data resmi akan diumumkan sebelum peluncuran komersial. Permintaan hak data akan diproses setelah verifikasi identitas yang wajar.",
    ],
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#001040]">
      <header className="sticky top-0 z-40 border-b border-[#D8E1EE] bg-white/95 px-4 py-4 backdrop-blur-md md:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link className="flex items-center gap-2.5" href="/">
            <CocokInBrand className="h-8 w-8 object-contain" decorative priority variant="mark" />
            <span className="text-xl font-black tracking-tight">CocokIn</span>
          </Link>
          <Link className="rounded-xl bg-[#001040] px-4 py-2 text-xs font-bold text-white" href="/register">Daftar</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-12 md:px-8">
        <header>
          <Link className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#006FE6] hover:underline" href="/register">
            <ArrowLeft size={16} weight="bold" /> Kembali ke Pendaftaran
          </Link>
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">Kebijakan Privasi</h1>
          <p className="mt-2 text-sm font-semibold text-[#53647A]">Terakhir diperbarui: 31 Agustus 2026</p>
          <p className="mt-5 rounded-xl border border-[#D8E1EE] bg-white p-5 text-sm leading-relaxed text-[#53647A]">
            CocokIn menghormati hak privasi setiap pengguna dan berkomitmen memproses data pribadi secara terbatas, transparan, aman, dan sesuai tujuan layanan. Kebijakan ini berlaku untuk layanan pra-rilis; identitas badan hukum pengendali data dan alamat resminya akan ditetapkan sebelum peluncuran komersial.
          </p>
        </header>

        {sections.map((section) => (
          <section className="space-y-3 rounded-2xl border border-[#D8E1EE] bg-white p-6 shadow-sm md:p-8" key={section.title}>
            <h2 className="border-b border-[#D8E1EE] pb-3 text-xl font-bold">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p className="text-sm leading-relaxed text-[#53647A]" key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <div className="pt-4 text-center">
          <Link className="inline-flex rounded-xl bg-[#001040] px-8 py-3.5 text-sm font-bold text-white" href="/register">
            Kembali ke Pendaftaran
          </Link>
        </div>
      </main>
    </div>
  );
}
