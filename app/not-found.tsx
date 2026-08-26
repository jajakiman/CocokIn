import Link from "next/link";

export default function NotFound() {
  return (
    <main className="state-page">
      <p className="eyebrow">404</p>
      <h1>Halaman belum tersedia.</h1>
      <p>Release 0 hanya memuat preview foundation yang sudah terhubung.</p>
      <Link className="primary-action" href="/">Kembali ke pilihan role</Link>
    </main>
  );
}
